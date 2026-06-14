import { Request, Response } from 'express';
import { z } from 'zod';
import { registerUser, loginUser, logoutUser, getMe } from '../services/auth.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { env } from '../config/env';

const registerSchema = z.object({
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

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

export const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function register(req: Request, res: Response): Promise<void> {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
    return;
  }

  const result = await registerUser(parsed.data);
  if ('error' in result) {
    res.status(result.status).json({ error: result.error });
    return;
  }

  res.cookie('token', result.token, cookieOptions);
  res.status(201).json({ user: result.user });
}

export async function login(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
    return;
  }

  const result = await loginUser(parsed.data);
  if ('error' in result) {
    res.status(result.status).json({ error: result.error });
    return;
  }

  res.cookie('token', result.token, cookieOptions);
  res.status(200).json({ user: result.user });
}

export async function logout(req: AuthenticatedRequest, res: Response): Promise<void> {
  await logoutUser(req.user!.userId);
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully.' });
}

export async function me(req: AuthenticatedRequest, res: Response): Promise<void> {
  const user = await getMe(req.user!.userId);
  if (!user) {
    res.status(404).json({ error: 'User profile not found.' });
    return;
  }
  res.status(200).json({ user });
}
