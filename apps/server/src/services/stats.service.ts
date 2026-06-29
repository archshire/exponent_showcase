// ---------------------------------------------------------------------------
// 1P Stats service
// ---------------------------------------------------------------------------
//
// Private personal progress page. Shown in this order:
//   1. CPU defeat counts (lifetime wins per CPU)
//   2. CPU unlock progress
//   3. PvP stats
//   4. Last 10 PvP match history
//   5. D/C count
//
// Lifetime accuracy is intentionally NOT shown (answer counters are not
// persisted). Match history reads persisted pvp_matches only (no PvC).

import { prisma } from '@repo/db';
import {
  CPU_OPPONENT_CONFIG,
  CPU_OPPONENT_KEYS,
  type CpuOpponentKey,
} from '../config/cpu-opponents.config';
import {
  cpuUnlockProgress,
  isCpuUnlocked,
  type CpuUnlockContext,
} from '../config/cpu-unlock-rules.config';

export interface CpuDefeatCount {
  cpuKey: CpuOpponentKey;
  displayName: string;
  wins: number;
  unlocked: boolean;
}

export interface PvpStats {
  played: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number; // 0..1
}

export interface MatchHistoryRow {
  matchNumber: number;
  opponent: string;
  matchType: 'quick' | 'private';
  result: 'win' | 'loss' | 'draw' | 'voided';
  playedAt: string;
}

export interface StatsResult {
  cpuDefeats: CpuDefeatCount[];
  cpuUnlockProgress: ReturnType<typeof cpuUnlockProgress>[];
  pvpStats: PvpStats;
  matchHistory: MatchHistoryRow[];
  dcCount: number;
}

export async function getStats(userId: string): Promise<StatsResult> {
  const [profile, progression, allMatches] = await Promise.all([
    prisma.playerProfile.findUnique({
      where: { playerId: userId },
      select: { tutorialCompleted: true },
    }),
    prisma.playerCpuProgression.findMany({
      where: { playerId: userId },
      select: { cpuKey: true, wins: true },
    }),
    prisma.pvpMatch.findMany({
      where: { OR: [{ p1PlayerId: userId }, { p2PlayerId: userId }] },
      orderBy: [{ startedAt: 'asc' }],
      select: {
        matchId: true,
        isPrivateMatch: true,
        status: true,
        p1PlayerId: true,
        p2PlayerId: true,
        winnerPlayerId: true,
        dcPlayerId: true,
        startedAt: true,
        endedAt: true,
      },
    }),
  ]);

  // --- CPU defeat counts + unlock progress ---
  const winsByCpu = CPU_OPPONENT_KEYS.reduce(
    (acc, key) => ({ ...acc, [key]: 0 }),
    {} as Record<CpuOpponentKey, number>
  );
  for (const row of progression) {
    const key = row.cpuKey as CpuOpponentKey;
    if (key in winsByCpu) {
      winsByCpu[key] = row.wins;
    }
  }

  const completedPvpMatches = allMatches.filter((m) => m.status === 'completed').length;

  const ctx: CpuUnlockContext = {
    tutorialCompleted: profile?.tutorialCompleted ?? false,
    winsByCpu,
    completedPvpMatches,
  };

  // `unlocked` is derived from the live rule check (the single source of truth),
  // not the persisted `unlocked_at` stamp — so a freshly-met condition (e.g. the
  // tutorial just completed) shows as unlocked immediately and consistently with
  // the Practice screen. The stored `unlocked_at` records WHEN it first unlocked.
  const cpuDefeats: CpuDefeatCount[] = CPU_OPPONENT_KEYS.map((key) => ({
    cpuKey: key,
    displayName: CPU_OPPONENT_CONFIG[key].displayName,
    wins: winsByCpu[key],
    unlocked: isCpuUnlocked(key, ctx),
  }));

  const unlockProgress = CPU_OPPONENT_KEYS.map((key) => cpuUnlockProgress(key, ctx));

  // --- PvP stats ---
  const completed = allMatches.filter((m) => m.status === 'completed');
  let wins = 0;
  let losses = 0;
  let draws = 0;
  for (const m of completed) {
    if (m.winnerPlayerId === userId) wins += 1;
    else if (m.winnerPlayerId === null)
      draws += 1; // mutual final-round loss
    else losses += 1;
  }
  const pvpStats: PvpStats = {
    played: completed.length,
    wins,
    losses,
    draws,
    winRate: completed.length === 0 ? 0 : wins / completed.length,
  };

  // --- D/C count ---
  const dcCount = allMatches.filter((m) => m.dcPlayerId === userId).length;

  // --- Last 10 match history (Match # is chronological per player) ---
  const opponentIds = Array.from(
    new Set(
      allMatches
        .map((m) => (m.p1PlayerId === userId ? m.p2PlayerId : m.p1PlayerId))
        .filter((id): id is string => id !== null)
    )
  );
  const opponents = await prisma.playerProfile.findMany({
    where: { playerId: { in: opponentIds } },
    select: { playerId: true, user: { select: { username: true } } },
  });
  const usernameById = new Map(opponents.map((o) => [o.playerId, o.user.username]));

  const matchHistory: MatchHistoryRow[] = allMatches
    .map((m, index) => {
      const opponentId = m.p1PlayerId === userId ? m.p2PlayerId : m.p1PlayerId;
      const result: MatchHistoryRow['result'] =
        m.status === 'voided'
          ? 'voided'
          : m.winnerPlayerId === userId
            ? 'win'
            : m.winnerPlayerId === null
              ? 'draw'
              : 'loss';
      return {
        matchNumber: index + 1, // chronological across all of this player's PvP matches
        opponent: (opponentId && usernameById.get(opponentId)) || 'Unknown',
        matchType: m.isPrivateMatch ? ('private' as const) : ('quick' as const),
        result,
        playedAt: (m.endedAt ?? m.startedAt).toISOString(),
      };
    })
    .slice(-10)
    .reverse(); // newest first

  return { cpuDefeats, cpuUnlockProgress: unlockProgress, pvpStats, matchHistory, dcCount };
}
