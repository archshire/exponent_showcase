import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '@repo/db';
import { env } from '../config/env';

export interface JwtPayload {
  userId: string;
  tokenVersion: number;
}

export interface AuthenticatedRequest extends Request {
  user?: { userId: string };
}

/** Either a resolved user id, or the 401 message explaining why the session failed. */
type AuthResult = { userId: string } | { error: string };

/**
 * Resolve the session cookie to a live user id. Shared by {@link requireAuth}
 * (which 401s on failure) and {@link optionalAuth} (which silently proceeds as
 * anonymous, so callers probing "am I logged in?" don't log a 401 to the browser
 * console).
 */
async function resolveUser(req: AuthenticatedRequest): Promise<AuthResult> {
  const token = req.cookies?.token;
  if (!token) return { error: 'You are not logged in. Please log in to continue.' };

  let payload: JwtPayload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  } catch {
    return { error: 'Your session has expired. Please log in again.' };
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, tokenVersion: true, status: true },
  });

  if (!user) return { error: 'Account not found. Please register to get started.' };
  if (user.status !== 'active') return { error: 'This account is not active.' };
  if (user.tokenVersion !== payload.tokenVersion) {
    return { error: 'You have been signed out because your account was logged in elsewhere.' };
  }

  return { userId: user.id };
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const result = await resolveUser(req);
  if ('error' in result) {
    res.status(401).json({ error: result.error });
    return;
  }
  req.user = { userId: result.userId };
  next();
}

/**
 * Populate `req.user` when a valid session exists, otherwise proceed as anonymous
 * without erroring. Use for endpoints that report auth state (e.g. GET /auth/me)
 * where "logged out" is a normal 200 response, not a 401.
 */
export async function optionalAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const result = await resolveUser(req);
  if ('userId' in result) req.user = { userId: result.userId };
  next();
}
