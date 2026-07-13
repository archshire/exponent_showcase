import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { registerUser, loginUser, logoutUser, getMe } from '../services/auth.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { env } from '../config/env';

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters.')
    .max(50, 'Username must be at most 50 characters.')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores.'),
  email: z.string().email('Please enter a valid email address.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(72, 'Password must be at most 72 characters.'),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

const SESSION_COOKIE_FLAGS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
};

const FALLBACK_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

/**
 * Session cookie options whose maxAge tracks the JWT's own expiry (read from the
 * token's `exp` claim), so the cookie and token stay in lockstep no matter what
 * JWT_EXPIRES_IN is set to. Falls back to 7 days if the token carries no exp.
 */
export function sessionCookieOptions(token: string) {
  const decoded = jwt.decode(token) as { exp?: number } | null;
  const maxAge = decoded?.exp ? decoded.exp * 1000 - Date.now() : FALLBACK_MAX_AGE;
  return { ...SESSION_COOKIE_FLAGS, maxAge };
}

/** Logs the failure and returns a generic 500 so internals never leak to clients. */
function serverError(res: Response, action: string, err: unknown): void {
  console.error(`${action} failed:`, err);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
}

export async function register(req: Request, res: Response): Promise<void> {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
    return;
  }

  try {
    const result = await registerUser(parsed.data);
    if ('error' in result) {
      res.status(result.status).json({ error: result.error });
      return;
    }

    res.cookie('token', result.token, sessionCookieOptions(result.token));
    // The token lives only in the httpOnly cookie — never returned to JS.
    res.status(201).json({ user: result.user });
  } catch (err) {
    serverError(res, 'register', err);
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
    return;
  }

  try {
    const result = await loginUser(parsed.data);
    if ('error' in result) {
      res.status(result.status).json({ error: result.error });
      return;
    }

    res.cookie('token', result.token, sessionCookieOptions(result.token));
    // The token lives only in the httpOnly cookie — never returned to JS.
    res.status(200).json({ user: result.user });
  } catch (err) {
    serverError(res, 'login', err);
  }
}

export async function logout(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    await logoutUser(req.user!.userId);
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully.' });
  } catch (err) {
    serverError(res, 'logout', err);
  }
}

export async function me(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const user = await getMe(req.user!.userId);
    if (!user) {
      res.status(404).json({ error: 'User profile not found.' });
      return;
    }
    res.status(200).json({ user });
  } catch (err) {
    serverError(res, 'me', err);
  }
}
