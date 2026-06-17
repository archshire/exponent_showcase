// ---------------------------------------------------------------------------
// Leaderboard service (PRD 3.1)
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
  return rows.map((r) => (r.requesterPlayerId === userId ? r.receiverPlayerId : r.requesterPlayerId));
}

export async function getLeaderboard(
  userId: string,
  friendsOnly: boolean,
): Promise<LeaderboardResult> {
  const where = friendsOnly
    ? { playerId: { in: [...(await acceptedFriendIds(userId)), userId] } }
    : {};

  const top = await prisma.playerProfile.findMany({
    where,
    select: profileSelect,
    orderBy: [{ auraPoints: 'desc' }, { playerId: 'asc' }],
    take: 50,
  });

  const rows = top.map((p, i) => toRow(p, i + 1, userId));

  // Self rank: if present in the visible rows use it, otherwise compute the
  // global rank from a count of players with strictly more aura.
  const selfInRows = rows.find((r) => r.isSelf);
  let self: LeaderboardRow;
  if (selfInRows) {
    self = selfInRows;
  } else {
    const me = await prisma.playerProfile.findUnique({
      where: { playerId: userId },
      select: profileSelect,
    });
    if (!me) {
      self = {
        rank: 0,
        id: userId,
        username: 'You',
        profilePictureUrl: null,
        identityImageSource: 'premade_avatar',
        premadeAvatarKey: null,
        auraPoints: 0,
        online: true,
        isSelf: true,
      };
    } else {
      const scopeFilter = friendsOnly
        ? { playerId: { in: [...(await acceptedFriendIds(userId)), userId] } }
        : {};
      const ahead = await prisma.playerProfile.count({
        where: { ...scopeFilter, auraPoints: { gt: me.auraPoints } },
      });
      self = toRow(me, ahead + 1, userId);
    }
  }

  return { rows, self };
}
