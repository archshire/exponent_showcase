import { prisma } from '@repo/db';
import { CPU_OPPONENT_KEYS } from '../config/cpu-opponents.config';

export interface CreatedUser {
  id: string;
  username: string;
  email: string;
  tokenVersion: number;
}

/**
 * Creates a user together with its PlayerProfile and one cpu-progression row per
 * live CPU. Shared by both the email/password and OAuth signup paths.
 *
 * `passwordHash` is null for OAuth-only users. `profilePictureUrl`, when provided
 * (e.g. an avatar from the OAuth provider), seeds the profile as an uploaded image.
 */
export async function createUserWithProfile(data: {
  username: string;
  email: string;
  passwordHash?: string | null;
  profilePictureUrl?: string | null;
}): Promise<CreatedUser> {
  return prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      passwordHash: data.passwordHash ?? null,
      profile: {
        create: {
          profilePictureUrl: data.profilePictureUrl ?? null,
          identityImageSource: data.profilePictureUrl ? 'upload' : 'premade_avatar',
          // Seed every live CPU progression row on signup; none unlocked yet.
          cpuProgression: {
            create: CPU_OPPONENT_KEYS.map((cpuKey) => ({ cpuKey })),
          },
        },
      },
    },
    select: { id: true, username: true, email: true, tokenVersion: true },
  });
}
