// ---------------------------------------------------------------------------
// Leaderboard service
// ---------------------------------------------------------------------------
//
// Ranks players by Aura Points (PvP-only currency). Reads persisted
// player_profiles.aura_points directly — there is no separate leaderboard
// source-of-truth table. Shows the top 50, supports a friend filter (accepted
// friends + the current player), and always pins the current player's own rank.

import { prisma } from '@repo/db';
import { isOnline } from './presence.service';

export interface LeaderboardRow {
  rank: number;
  id: string;
  username: string;
  profilePictureUrl: string | null;
  identityImageSource: string;
  premadeAvatarKey: string | null;
  accuracy?: number | null;
  auraPoints: number;
  online: boolean;
  isSelf: boolean;
}

export interface LeaderboardResult {
  rows: LeaderboardRow[];
  self: LeaderboardRow;
}

const profileSelect = {
  playerId: true,
  profilePictureUrl: true,
  identityImageSource: true,
  premadeAvatarKey: true,
  auraPoints: true,
  user: { select: { username: true } },
} as const;

type ProfileRow = {
  playerId: string;
  profilePictureUrl: string | null;
  identityImageSource: string;
  premadeAvatarKey: string | null;
  auraPoints: number;
  user: { username: string };
};

function toRow(p: ProfileRow, rank: number, selfId: string): LeaderboardRow {
  return {
    rank,
    id: p.playerId,
    username: p.user.username,
    profilePictureUrl: p.profilePictureUrl,
    identityImageSource: p.identityImageSource,
    premadeAvatarKey: p.premadeAvatarKey,
    auraPoints: p.auraPoints,
    online: isOnline(p.playerId),
    isSelf: p.playerId === selfId,
  };
}

async function acceptedFriendIds(userId: string): Promise<string[]> {
  const rows = await prisma.playerFriendship.findMany({
    where: {
      status: 'accepted',
      OR: [{ requesterPlayerId: userId }, { receiverPlayerId: userId }],
    },
    select: { requesterPlayerId: true, receiverPlayerId: true },
  });
  return rows.map((r) =>
    r.requesterPlayerId === userId ? r.receiverPlayerId : r.requesterPlayerId
  );
}

export async function getLeaderboard(
  userId: string,
  friendsOnly: boolean,
  sort: 'aura' | 'accuracy' = 'aura'
): Promise<LeaderboardResult> {
  const where = friendsOnly
    ? { playerId: { in: [...(await acceptedFriendIds(userId)), userId] } }
    : {};
  const profiles = await prisma.playerProfile.findMany({ where, select: profileSelect });
  const totals = await prisma.playerMatchRecord.groupBy({
    by: ['userId'], where: { userId: { in: profiles.map(p => p.playerId) } },
    _sum: { correctAnswers: true, submittedAttempts: true },
  });
  const accuracy = new Map(totals.map(t => [t.userId, t._sum.submittedAttempts
    ? (t._sum.correctAnswers ?? 0) / t._sum.submittedAttempts : null]));
  const ranked = profiles.map(p => ({ ...toRow(p, 0, userId), accuracy: accuracy.get(p.playerId) ?? null }));
  ranked.sort((a, b) => {
    const auraOrder = b.auraPoints - a.auraPoints;
    const accuracyOrder = (b.accuracy ?? -1) - (a.accuracy ?? -1);
    return (sort === 'accuracy' ? accuracyOrder || auraOrder : auraOrder || accuracyOrder)
      || a.id.localeCompare(b.id);
  });
  ranked.forEach((p, i) => { p.rank = i + 1; });
  const self = ranked.find(p => p.isSelf) ?? {
    rank: 0, id: userId, username: 'You', profilePictureUrl: null,
    identityImageSource: 'premade_avatar', premadeAvatarKey: null,
    auraPoints: 0, accuracy: null, online: isOnline(userId), isSelf: true,
  };
  return { rows: ranked.slice(0, 50), self };
}
