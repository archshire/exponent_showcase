import { Request, Response } from 'express';
import { generateState, generateCodeVerifier, OAuth2Tokens } from 'arctic';
import {
  google,
  github,
  fortytwo,
  FORTYTWO_AUTHORIZE_ENDPOINT,
  FORTYTWO_TOKEN_ENDPOINT,
  oauthHandshakeCookie,
} from '../config/oauth';
import { env } from '../config/env';
import { cookieOptions } from './auth.controller';
import {
  resolveOAuthUser,
  issueSessionToken,
  type NormalizedOAuthProfile,
} from '../services/auth.service';

const STATE_COOKIE = 'oauth_state';
const VERIFIER_COOKIE = 'oauth_verifier';

function loginRedirect(res: Response, error?: string): void {
  const url = error
    ? `${env.CLIENT_URL}/login?error=${encodeURIComponent(error)}`
    : env.CLIENT_URL;
  res.redirect(url);
}

/** Completes a provider login: clears handshake cookies, sets the session cookie, redirects. */
async function finishLogin(res: Response, profile: NormalizedOAuthProfile): Promise<void> {
  const { userId } = await resolveOAuthUser(profile);
  const token = await issueSessionToken(userId);
  res.clearCookie(STATE_COOKIE);
  res.clearCookie(VERIFIER_COOKIE);
  res.cookie('token', token, cookieOptions);
  loginRedirect(res);
}

/** Validates the callback request: provider not configured, denial, or CSRF state mismatch. */
function checkCallback(
  req: Request,
  res: Response,
  configured: boolean
): { code: string } | null {
  if (!configured) {
    res.status(503).json({ error: 'This login provider is not configured.' });
    return null;
  }
  if (req.query.error) {
    loginRedirect(res, 'oauth_denied');
    return null;
  }
  const code = req.query.code;
  const state = req.query.state;
  if (typeof code !== 'string' || typeof state !== 'string' || state !== req.cookies?.[STATE_COOKIE]) {
    loginRedirect(res, 'oauth_state');
    return null;
  }
  return { code };
}

// ---------------------------------------------------------------------------
// Google (OpenID Connect, PKCE)
// ---------------------------------------------------------------------------
export function googleAuthorize(_req: Request, res: Response): void {
  if (!google) {
    res.status(503).json({ error: 'Google login is not configured.' });
    return;
  }
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = google.createAuthorizationURL(state, codeVerifier, ['openid', 'profile', 'email']);

  res.cookie(STATE_COOKIE, state, oauthHandshakeCookie);
  res.cookie(VERIFIER_COOKIE, codeVerifier, oauthHandshakeCookie);
  res.redirect(url.toString());
}

export async function googleCallback(req: Request, res: Response): Promise<void> {
  const checked = checkCallback(req, res, Boolean(google));
  if (!checked) return;
  const verifier = req.cookies?.[VERIFIER_COOKIE];
  if (typeof verifier !== 'string') {
    loginRedirect(res, 'oauth_state');
    return;
  }

  try {
    const tokens = await google!.validateAuthorizationCode(checked.code, verifier);
    const info = await fetchJson('https://openidconnect.googleapis.com/v1/userinfo', tokens);
    if (!info.email) {
      loginRedirect(res, 'oauth_no_email');
      return;
    }
    await finishLogin(res, {
      provider: 'google',
      providerUserId: String(info.sub),
      email: info.email,
      emailVerified: info.email_verified === true,
      displayName: info.name ?? info.email,
      avatarUrl: info.picture ?? null,
    });
  } catch {
    loginRedirect(res, 'oauth_failed');
  }
}

// ---------------------------------------------------------------------------
// GitHub (no PKCE; email fetched separately)
// ---------------------------------------------------------------------------
export function githubAuthorize(_req: Request, res: Response): void {
  if (!github) {
    res.status(503).json({ error: 'GitHub login is not configured.' });
    return;
  }
  const state = generateState();
  const url = github.createAuthorizationURL(state, ['read:user', 'user:email']);
  res.cookie(STATE_COOKIE, state, oauthHandshakeCookie);
  res.redirect(url.toString());
}

export async function githubCallback(req: Request, res: Response): Promise<void> {
  const checked = checkCallback(req, res, Boolean(github));
  if (!checked) return;

  try {
    const tokens = await github!.validateAuthorizationCode(checked.code);
    const user = await fetchJson('https://api.github.com/user', tokens);
    const emails = (await fetchJson('https://api.github.com/user/emails', tokens)) as Array<{
      email: string;
      primary: boolean;
      verified: boolean;
    }>;
    const primary = Array.isArray(emails)
      ? emails.find((e) => e.primary && e.verified) ?? emails.find((e) => e.verified)
      : undefined;
    if (!primary) {
      loginRedirect(res, 'oauth_no_email');
      return;
    }
    await finishLogin(res, {
      provider: 'github',
      providerUserId: String(user.id),
      email: primary.email,
      emailVerified: primary.verified === true,
      displayName: user.login ?? user.name ?? primary.email,
      avatarUrl: user.avatar_url ?? null,
    });
  } catch {
    loginRedirect(res, 'oauth_failed');
  }
}

// ---------------------------------------------------------------------------
// 42 / Intra (generic OAuth2)
// ---------------------------------------------------------------------------
export function fortytwoAuthorize(_req: Request, res: Response): void {
  if (!fortytwo) {
    res.status(503).json({ error: '42 login is not configured.' });
    return;
  }
  const state = generateState();
  const url = fortytwo.createAuthorizationURL(FORTYTWO_AUTHORIZE_ENDPOINT, state, ['public']);
  res.cookie(STATE_COOKIE, state, oauthHandshakeCookie);
  res.redirect(url.toString());
}

export async function fortytwoCallback(req: Request, res: Response): Promise<void> {
  const checked = checkCallback(req, res, Boolean(fortytwo));
  if (!checked) return;

  try {
    const tokens = await fortytwo!.validateAuthorizationCode(
      FORTYTWO_TOKEN_ENDPOINT,
      checked.code,
      null
    );
    const me = await fetchJson('https://api.intra.42.fr/v2/me', tokens);
    if (!me.email) {
      loginRedirect(res, 'oauth_no_email');
      return;
    }
    await finishLogin(res, {
      provider: '42',
      providerUserId: String(me.id),
      email: me.email,
      // 42 issues institutional, verified email addresses.
      emailVerified: true,
      displayName: me.login ?? me.email,
      avatarUrl: me.image?.link ?? null,
    });
  } catch {
    loginRedirect(res, 'oauth_failed');
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchJson(url: string, tokens: OAuth2Tokens): Promise<any> {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${tokens.accessToken()}`,
      Accept: 'application/json',
      // GitHub's API rejects requests without a User-Agent.
      'User-Agent': 'ft_transcendence',
    },
  });
  if (!res.ok) {
    throw new Error(`Provider request failed: ${res.status}`);
  }
  return res.json();
}
