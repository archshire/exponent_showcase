import { Request, Response } from 'express';
import { generateState, OAuth2Tokens } from 'arctic';
import {
  fortytwo,
  FORTYTWO_AUTHORIZE_ENDPOINT,
  FORTYTWO_TOKEN_ENDPOINT,
  oauthHandshakeCookie,
} from '../config/oauth';
import { env } from '../config/env';
import { sessionCookieOptions } from './auth.controller';
import {
  resolveOAuthUser,
  issueSessionToken,
  type NormalizedOAuthProfile,
} from '../services/auth.service';

const STATE_COOKIE = 'oauth_state';

function loginRedirect(res: Response, error?: string): void {
  // On failure we send the browser back to /auth with ?error= for the form to show.
  const url = error
    ? `${env.CLIENT_URL}/auth?error=${encodeURIComponent(error)}`
    : `${env.CLIENT_URL}/auth`;
  res.redirect(url);
}

/** Completes a provider login: clears the handshake cookie, sets the session cookie, redirects. */
async function finishLogin(res: Response, profile: NormalizedOAuthProfile): Promise<void> {
  const { userId } = await resolveOAuthUser(profile);
  const token = await issueSessionToken(userId);
  res.clearCookie(STATE_COOKIE);
  // Set the httpOnly session cookie (parity with password login) and send the
  // browser straight to the dashboard, which authenticates via that cookie.
  // The token is never exposed to client JS or the URL.
  res.cookie('token', token, sessionCookieOptions(token));
  res.redirect(`${env.CLIENT_URL}/dashboard`);
}

/** Validates the callback request: provider not configured, denial, or CSRF state mismatch. */
function checkCallback(req: Request, res: Response, configured: boolean): { code: string } | null {
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
  if (
    typeof code !== 'string' ||
    typeof state !== 'string' ||
    state !== req.cookies?.[STATE_COOKIE]
  ) {
    loginRedirect(res, 'oauth_state');
    return null;
  }
  return { code };
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
      'User-Agent': 'ft_transcendence',
    },
  });
  if (!res.ok) {
    throw new Error(`Provider request failed: ${res.status}`);
  }
  return res.json();
}
