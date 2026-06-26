// ---------------------------------------------------------------------------
// Presence service
// ---------------------------------------------------------------------------
//
// In-memory online/offline tracking for authenticated users. Backend runtime
// memory owns WebSocket session state; presence is NOT persisted (only
// `player_profiles.last_active_at` is, as a best-effort "last activity" hint
// for offline friends).
//
// A user may have several concurrent sockets (multiple tabs/devices), so we
// ref-count connections per userId and only consider a user offline once the
// last socket disconnects.

const onlineCounts = new Map<string, number>();
const lastSeen = new Map<string, number>();

/** Register a new authenticated socket for `userId`. */
export function markOnline(userId: string): void {
  onlineCounts.set(userId, (onlineCounts.get(userId) ?? 0) + 1);
  lastSeen.set(userId, Date.now());
}

/** Drop one socket for `userId`; user goes offline when the count hits zero. */
export function markOffline(userId: string): void {
  const next = (onlineCounts.get(userId) ?? 0) - 1;
  if (next <= 0) {
    onlineCounts.delete(userId);
  } else {
    onlineCounts.set(userId, next);
  }
  lastSeen.set(userId, Date.now());
}

export function isOnline(userId: string): boolean {
  return (onlineCounts.get(userId) ?? 0) > 0;
}

/** Filter a list of userIds to those currently online. */
export function filterOnline(userIds: string[]): Set<string> {
  return new Set(userIds.filter(isOnline));
}

/** Epoch ms of the last presence change we saw for `userId`, if any. */
export function getLastSeen(userId: string): number | undefined {
  return lastSeen.get(userId);
}

/** Count of currently online users (debug/metrics). */
export function onlineCount(): number {
  return onlineCounts.size;
}
