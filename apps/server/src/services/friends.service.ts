// ---------------------------------------------------------------------------
// Friend system service
// ---------------------------------------------------------------------------
//
// One PlayerFriendship row per player pair (status: pending | accepted |
// declined | unfriended). The application checks BOTH orderings before
// inserting so a pair never gets a duplicate reverse-order row.
//
// player_profiles.playerId === users.id, so a friendship's requester/receiver
// PlayerProfile carries the related user's username.

import { prisma } from '@repo/db';
import { isOnline, getLastSeen } from './presence.service';

export type ServiceError = { error: string; status: number };
function err(error: string, status: number): ServiceError {
  return { error, status };
}
export function isServiceError(value: unknown): value is ServiceError {
  return typeof value === 'object' && value !== null && 'error' in value;
}

// --- spam protection -------------------------------------------------------
const SEND_COOLDOWN_MS = 1500;
const SEND_WINDOW_MS = 60_000;
const SEND_MAX_PER_WINDOW = 20;
const recentSends = new Map<string, number[]>();

function checkSendRate(userId: string): ServiceError | null {
  const now = Date.now();
  const times = (recentSends.get(userId) ?? []).filter((t) => now - t < SEND_WINDOW_MS);
  const last = times[times.length - 1];
  if (last !== undefined && now - last < SEND_COOLDOWN_MS) {
    return err('You are sending requests too fast. Please wait a moment.', 429);
  }
  if (times.length >= SEND_MAX_PER_WINDOW) {
    return err('Too many friend requests. Please try again later.', 429);
  }
  times.push(now);
  recentSends.set(userId, times);
  return null;
}

// --- shared select ---------------------------------------------------------
const profileSelect = {
  playerId: true,
  profilePictureUrl: true,
  identityImageSource: true,
  premadeAvatarKey: true,
  auraPoints: true,
  lastActiveAt: true,
  user: { select: { username: true } },
} as const;

type ProfileRow = {
  playerId: string;
  profilePictureUrl: string | null;
  identityImageSource: string;
  premadeAvatarKey: string | null;
  auraPoints: number;
  lastActiveAt: Date | null;
  user: { username: string };
};

export interface FriendView {
  id: string;
  username: string;
  profilePictureUrl: string | null;
  identityImageSource: string;
  premadeAvatarKey: string | null;
  auraPoints: number;
  online: boolean;
  lastActiveAt: string | null;
}

function toFriendView(p: ProfileRow): FriendView {
  const online = isOnline(p.playerId);
  const lastSeenMs = getLastSeen(p.playerId);
  const lastActiveAt = online
    ? null
    : p.lastActiveAt?.toISOString() ?? (lastSeenMs ? new Date(lastSeenMs).toISOString() : null);
  return {
    id: p.playerId,
    username: p.user.username,
    profilePictureUrl: p.profilePictureUrl,
    identityImageSource: p.identityImageSource,
    premadeAvatarKey: p.premadeAvatarKey,
    auraPoints: p.auraPoints,
    online,
    lastActiveAt,
  };
}

/** Accepted friends with online/last-activity state. */
export async function listFriends(userId: string): Promise<FriendView[]> {
  const rows = await prisma.playerFriendship.findMany({
    where: {
      status: 'accepted',
      OR: [{ requesterPlayerId: userId }, { receiverPlayerId: userId }],
    },
    select: {
      requester: { select: profileSelect },
      receiver: { select: profileSelect },
      requesterPlayerId: true,
    },
  });
  return rows
    .map((row) => (row.requesterPlayerId === userId ? row.receiver : row.requester))
    .map(toFriendView)
    // online first, then by aura desc, then name
    .sort(
      (a, b) =>
        Number(b.online) - Number(a.online) ||
        b.auraPoints - a.auraPoints ||
        a.username.localeCompare(b.username),
    );
}

/** Pending incoming friend requests (this user is the receiver). */
export async function listIncomingRequests(userId: string): Promise<FriendView[]> {
  const rows = await prisma.playerFriendship.findMany({
    where: { status: 'pending', receiverPlayerId: userId },
    select: { requester: { select: profileSelect } },
    orderBy: { createdAt: 'desc' },
  });
  return rows.map((row) => toFriendView(row.requester));
}

export type RelationshipStatus =
  | 'none'
  | 'friends'
  | 'request_sent'
  | 'request_received'
  | 'declined'
  | 'self';

export interface SearchResult extends FriendView {
  relationship: RelationshipStatus;
}

/** Partial/exact username search (indexed) excluding the searcher. */
export async function searchPlayers(
  userId: string,
  query: string,
): Promise<SearchResult[]> {
  const q = query.trim();
  if (q.length === 0) return [];

  const users = await prisma.user.findMany({
    where: {
      username: { contains: q, mode: 'insensitive' },
      status: 'active',
      id: { not: userId },
    },
    select: { profile: { select: profileSelect } },
    take: 20,
    orderBy: { username: 'asc' },
  });

  const candidates = users
    .map((u) => u.profile)
    .filter((p): p is ProfileRow => p !== null);

  // Resolve relationship for each candidate in one query.
  const ids = candidates.map((p) => p.playerId);
  const friendships = await prisma.playerFriendship.findMany({
    where: {
      OR: [
        { requesterPlayerId: userId, receiverPlayerId: { in: ids } },
        { receiverPlayerId: userId, requesterPlayerId: { in: ids } },
      ],
    },
    select: { requesterPlayerId: true, receiverPlayerId: true, status: true },
  });

  const relFor = (otherId: string): RelationshipStatus => {
    const f = friendships.find(
      (x) =>
        (x.requesterPlayerId === userId && x.receiverPlayerId === otherId) ||
        (x.receiverPlayerId === userId && x.requesterPlayerId === otherId),
    );
    if (!f) return 'none';
    if (f.status === 'accepted') return 'friends';
    if (f.status === 'pending') {
      return f.requesterPlayerId === userId ? 'request_sent' : 'request_received';
    }
    if (f.status === 'declined') return 'declined';
    return 'none'; // unfriended -> can re-add
  };

  return candidates.map((p) => ({ ...toFriendView(p), relationship: relFor(p.playerId) }));
}

async function findPair(a: string, b: string) {
  return prisma.playerFriendship.findFirst({
    where: {
      OR: [
        { requesterPlayerId: a, receiverPlayerId: b },
        { requesterPlayerId: b, receiverPlayerId: a },
      ],
    },
  });
}

/** Send (or re-send) a friend request to `targetId`. */
export async function sendRequest(
  userId: string,
  targetId: string,
): Promise<{ ok: true; status: RelationshipStatus } | ServiceError> {
  if (userId === targetId) return err('You cannot add yourself.', 400);

  const target = await prisma.playerProfile.findUnique({
    where: { playerId: targetId },
    select: { playerId: true },
  });
  if (!target) return err('Player not found.', 404);

  const rate = checkSendRate(userId);
  if (rate) return rate;

  const existing = await findPair(userId, targetId);

  if (!existing) {
    await prisma.playerFriendship.create({
      data: { requesterPlayerId: userId, receiverPlayerId: targetId, status: 'pending' },
    });
    return { ok: true, status: 'request_sent' };
  }

  if (existing.status === 'accepted') {
    return err('You are already friends.', 409);
  }
  if (existing.status === 'pending') {
    if (existing.requesterPlayerId === userId) {
      return err('A request is already pending.', 409);
    }
    // They already requested us — accept it.
    await prisma.playerFriendship.update({
      where: { id: existing.id },
      data: { status: 'accepted' },
    });
    return { ok: true, status: 'friends' };
  }

  // declined or unfriended -> reopen as a fresh pending request from this user.
  await prisma.playerFriendship.update({
    where: { id: existing.id },
    data: {
      requesterPlayerId: userId,
      receiverPlayerId: targetId,
      status: 'pending',
    },
  });
  return { ok: true, status: 'request_sent' };
}

async function setStatusAsReceiver(
  userId: string,
  requesterId: string,
  status: 'accepted' | 'declined',
): Promise<{ ok: true } | ServiceError> {
  const existing = await prisma.playerFriendship.findFirst({
    where: { requesterPlayerId: requesterId, receiverPlayerId: userId, status: 'pending' },
  });
  if (!existing) return err('No pending request from that player.', 404);
  await prisma.playerFriendship.update({ where: { id: existing.id }, data: { status } });
  return { ok: true };
}

export function acceptRequest(userId: string, requesterId: string) {
  return setStatusAsReceiver(userId, requesterId, 'accepted');
}

export function declineRequest(userId: string, requesterId: string) {
  return setStatusAsReceiver(userId, requesterId, 'declined');
}

/** Remove an accepted friend (status -> unfriended, row retained). */
export async function removeFriend(
  userId: string,
  otherId: string,
): Promise<{ ok: true } | ServiceError> {
  const existing = await findPair(userId, otherId);
  if (!existing || existing.status !== 'accepted') {
    return err('You are not friends with that player.', 404);
  }
  await prisma.playerFriendship.update({
    where: { id: existing.id },
    data: { status: 'unfriended' },
  });
  return { ok: true };
}

/** True when the two players are accepted friends (used by private challenge). */
export async function areFriends(a: string, b: string): Promise<boolean> {
  const existing = await findPair(a, b);
  return existing?.status === 'accepted';
}
