import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '@repo/db';
import { env } from '../config/env';
import type { JwtPayload } from '../middleware/auth.middleware';


const SALT_ROUNDS = 12;

function signToken(userId: string, tokenVersion: number): string {
  return jwt.sign({ userId, tokenVersion } satisfies JwtPayload, env.JWT_SECRET, {
    expiresIn: '7d',
  });
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

  const user = await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      passwordHash,
      profile: {
        create: {
          // Seed all 6 CPU progression rows on signup; none unlocked yet.
          cpuProgression: {
            create: ['max', 'min', 'fury', 'shi_eld', 'peasy', 'skore'].map((cpuKey) => ({ cpuKey })),
          },
        },
      },
    },
    select: { id: true, username: true, email: true, tokenVersion: true },
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

  const passwordMatch = await bcrypt.compare(data.password, user.passwordHash);
  if (!passwordMatch) {
    return { error: 'Incorrect password. Please try again.', status: 401 };
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      tokenVersion: { increment: 1 },
      lastLoginAt: new Date(),
      profile: { update: { lastActiveAt: new Date() } },
    },
    select: { tokenVersion: true },
  });

  const token = signToken(user.id, updated.tokenVersion);
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
