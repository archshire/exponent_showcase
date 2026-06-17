// ---------------------------------------------------------------------------
// Profile & Settings service (PRD 3.1)
// ---------------------------------------------------------------------------
//
// Account identity + player preferences:
//   - change username / email (uniqueness enforced)
//   - change password (current password verified)
//   - change language preference
//   - upload/replace profile picture (validated, resized to 512x512 webp)
//   - read another player's public profile
//
// The uploaded picture is the MVP identity image; it replaces selectable
// built-in avatars. Stored under /uploads/avatars and served statically.

import path from 'node:path';
import { promises as fs } from 'node:fs';
import bcrypt from 'bcrypt';
import sharp from 'sharp';
import { prisma } from '@repo/db';
import { isOnline, getLastSeen } from './presence.service';

const SALT_ROUNDS = 12;

export const SUPPORTED_LANGUAGES = ['en', 'ms', 'zh', 'es', 'ja', 'ko'] as const;
export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number];

export const AVATAR_SIZE = 512;
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB before decode
const ALLOWED_FORMATS = new Set(['jpeg', 'png', 'webp']);

export const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'avatars');
const PUBLIC_AVATAR_PREFIX = '/uploads/avatars';

export type ServiceError = { error: string; status: number };

function isError(value: unknown): value is ServiceError {
  return typeof value === 'object' && value !== null && 'error' in value;
}

export interface OwnProfile {
  id: string;
  username: string;
  email: string;
  profilePictureUrl: string | null;
  identityImageSource: string;
  premadeAvatarKey: string | null;
  languageCode: string;
  auraPoints: number;
  tutorialCompleted: boolean;
}

export async function getOwnProfile(userId: string): Promise<OwnProfile | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      profile: {
        select: {
          profilePictureUrl: true,
          identityImageSource: true,
          premadeAvatarKey: true,
          languageCode: true,
          auraPoints: true,
          tutorialCompleted: true,
        },
      },
    },
  });
  if (!user || !user.profile) return null;
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    profilePictureUrl: user.profile.profilePictureUrl,
    identityImageSource: user.profile.identityImageSource,
    premadeAvatarKey: user.profile.premadeAvatarKey,
    languageCode: user.profile.languageCode,
    auraPoints: user.profile.auraPoints,
    tutorialCompleted: user.profile.tutorialCompleted,
  };
}

export async function updateUsername(
  userId: string,
  username: string,
): Promise<OwnProfile | ServiceError> {
  const existing = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });
  if (existing && existing.id !== userId) {
    return { error: 'That username is already taken.', status: 409 };
  }
  await prisma.user.update({ where: { id: userId }, data: { username } });
  return (await getOwnProfile(userId))!;
}

export async function updateEmail(
  userId: string,
  email: string,
): Promise<OwnProfile | ServiceError> {
  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (existing && existing.id !== userId) {
    return { error: 'That email is already in use.', status: 409 };
  }
  await prisma.user.update({ where: { id: userId }, data: { email } });
  return (await getOwnProfile(userId))!;
}

export async function updatePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<{ ok: true } | ServiceError> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { passwordHash: true },
  });
  if (!user) return { error: 'Account not found.', status: 404 };
  if (!user.passwordHash) {
    return {
      error: 'This account uses social login and has no password to change.',
      status: 400,
    };
  }
  const matches = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!matches) {
    return { error: 'Your current password is incorrect.', status: 400 };
  }
  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  // Bump tokenVersion so other sessions are signed out after a password change.
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash, tokenVersion: { increment: 1 } },
  });
  return { ok: true };
}

export async function updateLanguage(
  userId: string,
  languageCode: LanguageCode,
): Promise<OwnProfile | ServiceError> {
  await prisma.playerProfile.update({
    where: { playerId: userId },
    data: { languageCode },
  });
  return (await getOwnProfile(userId))!;
}

/**
 * Validates an uploaded image buffer (type + size), resizes it to a square
 * AVATAR_SIZE webp, writes it under UPLOAD_DIR, and stores the public path on
 * the player's profile. Returns the updated profile.
 */
export async function updateProfilePicture(
  userId: string,
  buffer: Buffer,
): Promise<OwnProfile | ServiceError> {
  if (buffer.length === 0) {
    return { error: 'No image was uploaded.', status: 400 };
  }
  if (buffer.length > MAX_UPLOAD_BYTES) {
    return { error: 'Image is too large. Maximum size is 5 MB.', status: 400 };
  }

  let metadata: sharp.Metadata;
  try {
    metadata = await sharp(buffer).metadata();
  } catch {
    return { error: 'That file is not a valid image.', status: 400 };
  }
  if (!metadata.format || !ALLOWED_FORMATS.has(metadata.format)) {
    return {
      error: 'Unsupported image format. Use JPG, PNG, or WEBP.',
      status: 400,
    };
  }

  let output: Buffer;
  try {
    output = await sharp(buffer)
      .rotate() // honor EXIF orientation
      .resize(AVATAR_SIZE, AVATAR_SIZE, { fit: 'cover', position: 'centre' })
      .webp({ quality: 82 })
      .toBuffer();
  } catch {
    return { error: 'That image could not be processed.', status: 400 };
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${userId}-${Date.now()}.webp`;
  await fs.writeFile(path.join(UPLOAD_DIR, filename), output);

  const publicUrl = `${PUBLIC_AVATAR_PREFIX}/${filename}`;
  await prisma.playerProfile.update({
    where: { playerId: userId },
    data: { profilePictureUrl: publicUrl, identityImageSource: 'upload' },
  });

  // Best-effort cleanup of the previous file(s) for this user.
  void cleanupOldAvatars(userId, filename);

  return (await getOwnProfile(userId))!;
}

async function cleanupOldAvatars(userId: string, keep: string): Promise<void> {
  try {
    const files = await fs.readdir(UPLOAD_DIR);
    await Promise.all(
      files
        .filter((f) => f.startsWith(`${userId}-`) && f !== keep)
        .map((f) => fs.unlink(path.join(UPLOAD_DIR, f)).catch(() => undefined)),
    );
  } catch {
    // directory missing or unreadable — nothing to clean
  }
}

export interface PublicProfile {
  id: string;
  username: string;
  profilePictureUrl: string | null;
  identityImageSource: string;
  premadeAvatarKey: string | null;
  auraPoints: number;
  online: boolean;
  lastActiveAt: string | null;
}

/** Public profile by user id or exact username. Never exposes email/password. */
export async function getPublicProfile(opts: {
  id?: string | undefined;
  username?: string | undefined;
}): Promise<PublicProfile | null> {
  const where =
    opts.id !== undefined
      ? { id: opts.id }
      : opts.username !== undefined
        ? { username: opts.username }
        : null;
  if (where === null) return null;
  const user = await prisma.user.findFirst({
    where,
    select: {
      id: true,
      username: true,
      profile: {
        select: {
          profilePictureUrl: true,
          identityImageSource: true,
          premadeAvatarKey: true,
          auraPoints: true,
          lastActiveAt: true,
        },
      },
    },
  });
  if (!user || !user.profile) return null;
  const online = isOnline(user.id);
  const lastSeenMs = getLastSeen(user.id);
  const lastActive = online
    ? null
    : user.profile.lastActiveAt?.toISOString() ??
      (lastSeenMs ? new Date(lastSeenMs).toISOString() : null);
  return {
    id: user.id,
    username: user.username,
    profilePictureUrl: user.profile.profilePictureUrl,
    identityImageSource: user.profile.identityImageSource,
    premadeAvatarKey: user.profile.premadeAvatarKey,
    auraPoints: user.profile.auraPoints,
    online,
    lastActiveAt: lastActive,
  };
}

export { isError as isServiceError };
