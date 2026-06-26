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

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({
      error: 'You are not logged in. Please log in to continue.',
    });
    return;
  }

  let payload: JwtPayload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  } catch {
    res.status(401).json({
      error: 'Your session has expired. Please log in again.',
    });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, tokenVersion: true },
  });

  if (!user) {
    res.status(401).json({
      error: 'Account not found. Please register to get started.',
    });
    return;
  }

  if (user.tokenVersion !== payload.tokenVersion) {
    res.status(401).json({
      error: 'You have been signed out because your account was logged in elsewhere.',
    });
    return;
  }

  req.user = { userId: user.id };
  next();
}
