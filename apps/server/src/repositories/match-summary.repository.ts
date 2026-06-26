// ---------------------------------------------------------------------------
// Match Summary repository (PostgreSQL)
// ---------------------------------------------------------------------------
//
// Concrete `MatchSummaryRepository` that performs the post-match persistence
// writes planned by match-summary.service: PvP match rows, Aura gains, PvC CPU
// win counts, tutorial completion, and CPU unlock evaluation.
//
// Unlock rules themselves are static config (cpu-unlock-rules.config); this
// layer only reads the player's stored progress, applies the rule check, and
// stamps `unlockedAt` for any CPU that has newly become available.

import { prisma } from '@repo/db';
import {
  CPU_OPPONENT_KEYS,
  type CpuOpponentKey,
} from '../config/cpu-opponents.config';
import { isCpuUnlocked, type CpuUnlockContext } from '../config/cpu-unlock-rules.config';
import type {
  AuraProfileUpdateDraft,
  CpuProgressUpdateDraft,
  MatchSummaryRepository,
  PvpMatchPersistenceDraft,
} from '../services/match-summary.service';

export const prismaMatchSummaryRepository: MatchSummaryRepository = {
  async writePvpMatch(match: PvpMatchPersistenceDraft): Promise<void> {
    // Upsert keyed on matchId so a retried persist is idempotent.
    await prisma.pvpMatch.upsert({
      where: { matchId: match.matchId },
      create: {
        matchId: match.matchId,
        isPrivateMatch: match.isPrivateMatch,
        status: match.status,
        p1PlayerId: match.p1PlayerId,
        p2PlayerId: match.p2PlayerId,
        winnerPlayerId: match.winnerPlayerId ?? null,
        dcPlayerId: match.dcPlayerId ?? null,
        voidReason: match.voidReason ?? null,
        startedAt: match.startedAt,
        endedAt: match.endedAt,
      },
      update: {
        status: match.status,
        winnerPlayerId: match.winnerPlayerId ?? null,
        dcPlayerId: match.dcPlayerId ?? null,
        voidReason: match.voidReason ?? null,
        endedAt: match.endedAt,
      },
    });
  },

  async applyAuraUpdates(updates: AuraProfileUpdateDraft[]): Promise<void> {
    for (const update of updates) {
      if (update.auraGain === 0) continue;
      await prisma.playerProfile.updateMany({
        where: { playerId: update.playerId },
        data: { auraPoints: { increment: update.auraGain } },
      });
    }
  },

  async applyCpuProgressUpdate(update: CpuProgressUpdateDraft): Promise<void> {
    if (update.winIncrement === 0) return;
    await prisma.playerCpuProgression.upsert({
      where: { playerId_cpuKey: { playerId: update.playerId, cpuKey: update.cpuKey } },
      create: {
        playerId: update.playerId,
        cpuKey: update.cpuKey,
        wins: update.winIncrement,
      },
      update: { wins: { increment: update.winIncrement } },
    });
  },

  async markTutorialComplete(playerId: string): Promise<void> {
    await prisma.playerProfile.updateMany({
      where: { playerId, tutorialCompleted: false },
      data: { tutorialCompleted: true },
    });
  },

  async reevaluateCpuUnlocks(playerId: string): Promise<void> {
    const [profile, progression, completedPvpMatches] = await Promise.all([
      prisma.playerProfile.findUnique({
        where: { playerId },
        select: { tutorialCompleted: true },
      }),
      prisma.playerCpuProgression.findMany({
        where: { playerId },
        select: { cpuKey: true, wins: true, unlockedAt: true },
      }),
      prisma.pvpMatch.count({
        where: {
          status: 'completed',
          OR: [{ p1PlayerId: playerId }, { p2PlayerId: playerId }],
        },
      }),
    ]);

    if (profile === null) return;

    const winsByCpu = CPU_OPPONENT_KEYS.reduce(
      (acc, key) => ({ ...acc, [key]: 0 }),
      {} as Record<CpuOpponentKey, number>,
    );
    const alreadyUnlocked = new Set<string>();
    for (const row of progression) {
      if (row.cpuKey in winsByCpu) winsByCpu[row.cpuKey as CpuOpponentKey] = row.wins;
      if (row.unlockedAt !== null) alreadyUnlocked.add(row.cpuKey);
    }

    const ctx: CpuUnlockContext = {
      tutorialCompleted: profile.tutorialCompleted,
      winsByCpu,
      completedPvpMatches,
    };

    const now = new Date();
    for (const key of CPU_OPPONENT_KEYS) {
      if (alreadyUnlocked.has(key)) continue;
      if (!isCpuUnlocked(key, ctx)) continue;
      await prisma.playerCpuProgression.upsert({
        where: { playerId_cpuKey: { playerId, cpuKey: key } },
        create: { playerId, cpuKey: key, wins: winsByCpu[key], unlockedAt: now },
        update: { unlockedAt: now },
      });
    }
  },
};
