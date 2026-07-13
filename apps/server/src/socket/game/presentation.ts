import { prisma } from '@repo/db';
import { getCpuOpponentConfig } from '../../config/cpu-opponents.config';
import type { CpuOpponentKey } from '../../config/cpu-opponents.config';

// Shared presentation for a player: emoji battle token + real account identity
// (so both clients render the same avatars, names and profile pictures).
export interface PlayerPresentation {
  playerId: string;
  username: string;
  avatar: string;
  profilePictureUrl: string | null;
  identityImageSource: string;
  premadeAvatarKey: string | null;
  isCpu: boolean;
}

interface MatchPresentation {
  arenaId: string;
  players: Record<string, PlayerPresentation>;
}

export const DEFAULT_AVATAR = '🧮';
export const ARENA_IDS = ['math-arena', 'tech-room', 'tech-wall', 'campus-entrance'] as const;

// Shared presentation (arena + avatars + profile pics), keyed by matchId.
const presentations = new Map<string, MatchPresentation>();

export function getMatchPresentation(matchId: string): MatchPresentation | undefined {
  return presentations.get(matchId);
}

export function randomArenaId(): string {
  return ARENA_IDS[Math.floor(Math.random() * ARENA_IDS.length)] ?? 'math-arena';
}

export function setMatchArena(matchId: string, arenaId: string): void {
  const existing = presentations.get(matchId);
  if (existing !== undefined) {
    existing.arenaId = arenaId;
    return;
  }
  presentations.set(matchId, { arenaId, players: {} });
}

// Loads a human player's real identity (name + picture) from the DB and records
// it under the match, so every snapshot can render the same avatars/pictures.
export async function addHumanPresentation(
  matchId: string,
  playerId: string,
  avatar: string
): Promise<void> {
  const pres = presentations.get(matchId);
  if (pres === undefined) return;
  const profile = await prisma.playerProfile.findUnique({
    where: { playerId },
    select: {
      profilePictureUrl: true,
      premadeAvatarKey: true,
      identityImageSource: true,
      user: { select: { username: true } },
    },
  });
  pres.players[playerId] = {
    playerId,
    username: profile?.user.username ?? 'Player',
    avatar: avatar || DEFAULT_AVATAR,
    profilePictureUrl: profile?.profilePictureUrl ?? null,
    identityImageSource: profile?.identityImageSource ?? 'premade_avatar',
    premadeAvatarKey: profile?.premadeAvatarKey ?? null,
    isCpu: false,
  };
}

export function addCpuPresentation(
  matchId: string,
  cpuCombatantId: string,
  cpuKey: CpuOpponentKey
): void {
  const pres = presentations.get(matchId);
  if (pres === undefined) return;
  pres.players[cpuCombatantId] = {
    playerId: cpuCombatantId,
    username: getCpuOpponentConfig(cpuKey).displayName,
    avatar: DEFAULT_AVATAR,
    profilePictureUrl: null,
    identityImageSource: 'premade_avatar',
    premadeAvatarKey: null,
    isCpu: true,
  };
}

export function clearPresentation(matchId: string): void {
  presentations.delete(matchId);
}
