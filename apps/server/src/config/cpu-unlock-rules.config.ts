// ---------------------------------------------------------------------------
// CPU unlock rules (source of truth)
// ---------------------------------------------------------------------------
//
// These unlock conditions are backend STATIC game configuration, not player
// data. The database stores each player's CPU progress (wins, unlockedAt)
// only — never the rule definitions themselves.
//
//   | CPU     | Unlock Criteria                              |
//   | ------- | -------------------------------------------- |
//   | Max     | Available after tutorial.                    |
//   | Min     | Available after tutorial.                    |
//   | Fury    | 2 Max wins and 2 Min wins.                   |
//   | Shi-eld | 2 Fury wins and 1 completed PvP match.      |
//
// Only completed PvP matches count toward unlocks; voided matches are excluded.

import type { CpuOpponentKey } from './cpu-opponents.config';

export interface CpuUnlockContext {
  tutorialCompleted: boolean;
  /** Lifetime PvC win counts keyed by CPU. */
  winsByCpu: Record<CpuOpponentKey, number>;
  /** Lifetime count of completed (non-voided) PvP matches. */
  completedPvpMatches: number;
}

export interface CpuUnlockRequirement {
  labelKey: 'max_wins' | 'min_wins' | 'fury_wins' | 'pvp_matches';
  /** Current progress toward this requirement. */
  current: (ctx: CpuUnlockContext) => number;
  /** Target needed to satisfy this requirement. */
  target: number;
}

export interface CpuUnlockRule {
  cpuKey: CpuOpponentKey;
  /** Language-neutral identifier translated by the client. */
  descriptionKey: 'available_after_tutorial' | 'beat_max_and_min' | 'beat_fury_and_pvp';
  /** Gated only by tutorial completion (Max/Min). */
  tutorialGated: boolean;
  /** Measurable requirements (empty for tutorial-only CPUs). */
  requirements: CpuUnlockRequirement[];
}

export const CPU_UNLOCK_RULES: Record<CpuOpponentKey, CpuUnlockRule> = {
  max: {
    cpuKey: 'max',
    descriptionKey: 'available_after_tutorial',
    tutorialGated: true,
    requirements: [],
  },
  min: {
    cpuKey: 'min',
    descriptionKey: 'available_after_tutorial',
    tutorialGated: true,
    requirements: [],
  },
  fury: {
    cpuKey: 'fury',
    descriptionKey: 'beat_max_and_min',
    tutorialGated: true,
    requirements: [
      { labelKey: 'max_wins', current: (c) => c.winsByCpu.max, target: 2 },
      { labelKey: 'min_wins', current: (c) => c.winsByCpu.min, target: 2 },
    ],
  },
  shi_eld: {
    cpuKey: 'shi_eld',
    descriptionKey: 'beat_fury_and_pvp',
    tutorialGated: true,
    requirements: [
      { labelKey: 'fury_wins', current: (c) => c.winsByCpu.fury, target: 2 },
      { labelKey: 'pvp_matches', current: (c) => c.completedPvpMatches, target: 1 },
    ],
  },
};

/** True when every gate/requirement for `cpuKey` is satisfied. */
export function isCpuUnlocked(cpuKey: CpuOpponentKey, ctx: CpuUnlockContext): boolean {
  const rule = CPU_UNLOCK_RULES[cpuKey];
  if (rule.tutorialGated && !ctx.tutorialCompleted) return false;
  return rule.requirements.every((req) => req.current(ctx) >= req.target);
}

/** Per-requirement progress for display (`current`/`target`, capped at target). */
export function cpuUnlockProgress(cpuKey: CpuOpponentKey, ctx: CpuUnlockContext) {
  const rule = CPU_UNLOCK_RULES[cpuKey];
  return {
    cpuKey,
    descriptionKey: rule.descriptionKey,
    unlocked: isCpuUnlocked(cpuKey, ctx),
    tutorialGated: rule.tutorialGated,
    tutorialCompleted: ctx.tutorialCompleted,
    requirements: rule.requirements.map((req) => ({
      labelKey: req.labelKey,
      current: Math.min(req.current(ctx), req.target),
      target: req.target,
    })),
  };
}
