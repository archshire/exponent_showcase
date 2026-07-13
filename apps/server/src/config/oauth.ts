import { OAuth2Client } from 'arctic';
import { env } from './env';

const base = env.OAUTH_REDIRECT_BASE_URL;

/**
 * Arctic client for 42 (Intra), which has no dedicated provider — use the
 * generic OAuth2 client. Null when credentials are not configured, which lets
 * the routes return 503 instead of crashing at boot.
 */
export const fortytwo =
  env.FORTYTWO_CLIENT_ID && env.FORTYTWO_CLIENT_SECRET
    ? new OAuth2Client(
        env.FORTYTWO_CLIENT_ID,
        env.FORTYTWO_CLIENT_SECRET,
        `${base}/auth/42/callback`
      )
    : null;

export const FORTYTWO_AUTHORIZE_ENDPOINT = 'https://api.intra.42.fr/oauth/authorize';
export const FORTYTWO_TOKEN_ENDPOINT = 'https://api.intra.42.fr/oauth/token';

/** Short-lived cookie options for the OAuth handshake state value. */
export const oauthHandshakeCookie = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  // 'lax' (not 'strict') so the cookie survives the cross-site redirect back from the provider.
  sameSite: 'lax' as const,
  maxAge: 10 * 60 * 1000, // 10 minutes
  path: '/',
};
