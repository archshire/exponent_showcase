import { Response } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import {
  getOwnProfile,
  getPublicProfile,
  updateEmail,
  updateLanguage,
  updatePassword,
  updateProfilePicture,
  updateUsername,
  deleteAccount as deleteAccountService,
  isServiceError,
  SUPPORTED_LANGUAGES,
} from '../services/profile.service';

const usernameSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters.')
    .max(50, 'Username must be at most 50 characters.')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores.'),
});

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Your current password is required.'),
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters.')
    .max(72, 'New password must be at most 72 characters.'),
});

const languageSchema = z.object({
  languageCode: z.enum(SUPPORTED_LANGUAGES),
});

const pictureSchema = z.object({
  imageBase64: z.string().min(1, 'No image was uploaded.'),
});

export async function getMyProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  const profile = await getOwnProfile(req.user!.userId);
  if (!profile) {
    res.status(404).json({ error: 'Profile not found.' });
    return;
  }
  res.status(200).json({ profile });
}

export async function changeUsername(req: AuthenticatedRequest, res: Response): Promise<void> {
  const parsed = usernameSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
    return;
  }
  const result = await updateUsername(req.user!.userId, parsed.data.username);
  if (isServiceError(result)) {
    res.status(result.status).json({ error: result.error });
    return;
  }
  res.status(200).json({ profile: result });
}

export async function changeEmail(req: AuthenticatedRequest, res: Response): Promise<void> {
  const parsed = emailSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
    return;
  }
  const result = await updateEmail(req.user!.userId, parsed.data.email);
  if (isServiceError(result)) {
    res.status(result.status).json({ error: result.error });
    return;
  }
  res.status(200).json({ profile: result });
}

export async function changePassword(req: AuthenticatedRequest, res: Response): Promise<void> {
  const parsed = passwordSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
    return;
  }
  const result = await updatePassword(
    req.user!.userId,
    parsed.data.currentPassword,
    parsed.data.newPassword
  );
  if (isServiceError(result)) {
    res.status(result.status).json({ error: result.error });
    return;
  }
  res.status(200).json({ message: 'Password updated. Please log in again on your other devices.' });
}

export async function changeLanguage(req: AuthenticatedRequest, res: Response): Promise<void> {
  const parsed = languageSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
    return;
  }
  const result = await updateLanguage(req.user!.userId, parsed.data.languageCode);
  if (isServiceError(result)) {
    res.status(result.status).json({ error: result.error });
    return;
  }
  res.status(200).json({ profile: result });
}

export async function uploadPicture(req: AuthenticatedRequest, res: Response): Promise<void> {
  const parsed = pictureSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
    return;
  }
  // Accept either a data URL ("data:image/png;base64,...") or bare base64.
  const base64 = parsed.data.imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
  let buffer: Buffer;
  try {
    buffer = Buffer.from(base64, 'base64');
  } catch {
    res.status(400).json({ error: 'That image could not be read.' });
    return;
  }
  const result = await updateProfilePicture(req.user!.userId, buffer);
  if (isServiceError(result)) {
    res.status(result.status).json({ error: result.error });
    return;
  }
  res.status(200).json({ profile: result });
}

export async function getPublicProfileHandler(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  const id = typeof req.query.id === 'string' ? req.query.id : undefined;
  const username = typeof req.query.username === 'string' ? req.query.username : undefined;
  if (!id && !username) {
    res.status(400).json({ error: 'Provide an id or username.' });
    return;
  }
  const profile = await getPublicProfile({ id, username });
  if (!profile) {
    res.status(404).json({ error: 'Player not found.' });
    return;
  }
  res.status(200).json({ profile });
}

export async function deleteAccount(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    await deleteAccountService(req.user!.userId);
  } catch (err) {
    console.error('account deletion failed:', err);
    res.status(500).json({ error: 'Could not delete the account. Please try again.' });
    return;
  }
  res.clearCookie('token');
  res.status(200).json({ message: 'Account deleted.' });
}
