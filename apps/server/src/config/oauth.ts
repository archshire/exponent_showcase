// NOTE: Google and GitHub OAuth are temporarily disabled — only 42 is wired up.
// To re-enable, restore `Google, GitHub` in this import and uncomment the blocks below
// (and the matching code in env.ts, oauth.controller.ts, oauth.routes.ts, auth/page.tsx).
import { /* Google, GitHub, */ OAuth2Client } from 'arctic';
import { env } from './env';

const base = env.OAUTH_REDIRECT_BASE_URL;

/**
 * Arctic provider clients. Each is null when its credentials are not configured,
 * which lets the routes return 503 instead of crashing at boot.
 */
// export const google =
//   env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
//     ? new Google(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET, `${base}/auth/google/callback`)
//     : null;

// export const github =
//   env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET
//     ? new GitHub(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET, `${base}/auth/github/callback`)
//     : null;

// 42 (Intra) has no dedicated Arctic provider — use the generic OAuth2 client.
export const fortytwo =
  env.FORTYTWO_CLIENT_ID && env.FORTYTWO_CLIENT_SECRET
    ? new OAuth2Client(env.FORTYTWO_CLIENT_ID, env.FORTYTWO_CLIENT_SECRET, `${base}/auth/42/callback`)
    : null;

export const FORTYTWO_AUTHORIZE_ENDPOINT = 'https://api.intra.42.fr/oauth/authorize';
export const FORTYTWO_TOKEN_ENDPOINT = 'https://api.intra.42.fr/oauth/token';

/** Short-lived cookie options for the OAuth handshake state/PKCE values. */
export const oauthHandshakeCookie = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  // 'lax' (not 'strict') so the cookie survives the cross-site redirect back from the provider.
  sameSite: 'lax' as const,
  maxAge: 10 * 60 * 1000, // 10 minutes
  path: '/',
};
