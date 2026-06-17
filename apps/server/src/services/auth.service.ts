import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '@repo/db';
import { env } from '../config/env';
import type { JwtPayload } from '../middleware/auth.middleware';
import { createUserWithProfile } from './user.service';


const SALT_ROUNDS = 12;

function signToken(userId: string, tokenVersion: number): string {
  // @types/jsonwebtoken types expiresIn as `number | ms.StringValue` rather than a
  // plain string, so cast the validated env value to SignOptions['expiresIn'].
  const options: jwt.SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as NonNullable<jwt.SignOptions['expiresIn']>,
  };
  return jwt.sign({ userId, tokenVersion } satisfies JwtPayload, env.JWT_SECRET, options);
}

/**
 * Bumps tokenVersion (invalidating older tokens) and returns a freshly signed
 * JWT for the given user. Shared by login and the OAuth callbacks.
 */
export async function issueSessionToken(userId: string): Promise<string> {
  const now = new Date();

  // Bumping the session is the only part that must succeed.
  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      tokenVersion: { increment: 1 },
      lastLoginAt: now,
    },
    select: { tokenVersion: true },
  });

  // Touch lastActiveAt best-effort. updateMany (vs a nested `profile.update`)
  // is a no-op when the user has no profile, so a missing profile can't fail login.
  await prisma.playerProfile.updateMany({
    where: { playerId: userId },
    data: { lastActiveAt: now },
  });

  return signToken(userId, updated.tokenVersion);
}

export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
}): Promise<{ token: string; user: object } | { error: string; status: number }> {
  const existingEmail = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingEmail) {
    return { error: 'An account with this email already exists. Please log in instead.', status: 409 };
  }

  const existingUsername = await prisma.user.findUnique({ where: { username: data.username } });
  if (existingUsername) {
    return { error: 'This username is already taken. Please choose a different one.', status: 409 };
  }

  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

  const user = await createUserWithProfile({
    username: data.username,
    email: data.email,
    passwordHash,
  });

  const token = signToken(user.id, user.tokenVersion);
  return { token, user: { userId: user.id, username: user.username, email: user.email } };
}

export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<{ token: string; user: object } | { error: string; status: number }> {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
    select: { id: true, username: true, email: true, passwordHash: true, tokenVersion: true, status: true },
  });

  if (!user) {
    return { error: 'No account found with this email. Please register to get started.', status: 401 };
  }

  if (user.status === 'disabled') {
    return { error: 'Your account has been disabled. Please contact support.', status: 403 };
  }

  if (user.status === 'deleted') {
    return { error: 'This account no longer exists.', status: 403 };
  }

  // OAuth-only accounts have no local password — never grant password login.
  if (!user.passwordHash) {
    return { error: 'Incorrect email or password. Please try again.', status: 401 };
  }

  const passwordMatch = await bcrypt.compare(data.password, user.passwordHash);
  if (!passwordMatch) {
    return { error: 'Incorrect password. Please try again.', status: 401 };
  }

  const token = await issueSessionToken(user.id);
  return { token, user: { userId: user.id, username: user.username, email: user.email } };
}

export async function logoutUser(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { tokenVersion: { increment: 1 } },
  });
}

export async function getMe(userId: string): Promise<object | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      profile: {
        select: {
          identityImageSource: true,
          profilePictureUrl: true,
          premadeAvatarKey: true,
          auraPoints: true,
          languageCode: true,
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
    identityImageSource: user.profile.identityImageSource,
    profilePictureUrl: user.profile.profilePictureUrl,
    premadeAvatarKey: user.profile.premadeAvatarKey,
    auraPoints: user.profile.auraPoints,
    languageCode: user.profile.languageCode,
    tutorialCompleted: user.profile.tutorialCompleted,
  };
}

export type OAuthProvider = 'google' | 'github' | '42';

export interface NormalizedOAuthProfile {
  provider: OAuthProvider;
  /** Stable id of the user at the provider (Google `sub`, GitHub/42 `id`). */
  providerUserId: string;
  email: string;
  /** Whether the provider asserts the email is verified. Gates auto-linking. */
  emailVerified: boolean;
  /** Raw name/login used to seed a local username. */
  displayName: string;
  avatarUrl: string | null;
}

/**
 * Turns a provider's username/login/email into a unique local username matching
 * the same charset rules the register schema enforces ([a-zA-Z0-9_], 3-32 chars).
 */
async function generateUniqueUsername(seed: string, email: string): Promise<string> {
  const sanitize = (s: string) => s.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 32);
  let base = sanitize(seed);
  if (base.length < 3) base = sanitize(email.split('@')[0] ?? '');
  if (base.length < 3) base = 'player';

  // Try the bare base, then base1, base2, ... until one is free.
  for (let i = 0; i < 1000; i++) {
    const candidate = i === 0 ? base : `${base.slice(0, 32 - String(i).length)}${i}`;
    const taken = await prisma.user.findUnique({ where: { username: candidate }, select: { id: true } });
    if (!taken) return candidate;
  }
  // Extremely unlikely fallback: random suffix.
  return `${base.slice(0, 24)}${Date.now().toString(36)}`;
}

/**
 * Resolves a provider identity to a local userId:
 *   1. returning      — the provider account is already linked
 *   2. link-by-email  — a local account with the same VERIFIED email exists
 *   3. create         — brand-new user + profile + linked oauth account
 */
export async function resolveOAuthUser(
  profile: NormalizedOAuthProfile
): Promise<{ userId: string }> {
  // 1. Returning user.
  const link = await prisma.oAuthAccount.findUnique({
    where: {
      provider_providerUserId: {
        provider: profile.provider,
        providerUserId: profile.providerUserId,
      },
    },
    select: { userId: true },
  });
  if (link) return { userId: link.userId };

  // 2. Link to an existing local account — only when the provider verified the email.
  if (profile.emailVerified) {
    const existing = await prisma.user.findUnique({
      where: { email: profile.email },
      select: { id: true },
    });
    if (existing) {
      await prisma.oAuthAccount.create({
        data: {
          provider: profile.provider,
          providerUserId: profile.providerUserId,
          userId: existing.id,
        },
      });
      return { userId: existing.id };
    }
  }

  // 3. New user — create everything atomically.
  const username = await generateUniqueUsername(profile.displayName, profile.email);
  const userId = await prisma.$transaction(async (tx) => {
    const created = await createUserWithProfile({
      username,
      email: profile.email,
      passwordHash: null,
      profilePictureUrl: profile.avatarUrl,
    });
    await tx.oAuthAccount.create({
      data: {
        provider: profile.provider,
        providerUserId: profile.providerUserId,
        userId: created.id,
      },
    });
    return created.id;
  });

  return { userId };
}
