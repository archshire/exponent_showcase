// ---------------------------------------------------------------------------
// CPU unlock rules (source of truth)
// ---------------------------------------------------------------------------
//
// These unlock conditions are backend STATIC game configuration, not player
// data. The database stores each player's CPU progress (wins, unlockedAt)
// only — never the rule definitions themselves.
//
// All four CPU opponents are available immediately, including for new players.

import type { CpuOpponentKey } from './cpu-opponents.config';

export interface CpuUnlockContext {
  tutorialCompleted: boolean;
  /** Lifetime PvC win counts keyed by CPU. */
  winsByCpu: Record<CpuOpponentKey, number>;
  /** Lifetime count of completed (non-voided) PvP matches. */
  completedPvpMatches: number;
}

export interface CpuUnlockRequirement {
  labelKey: 'max_wins' | 'min_wins' | 'fury_wins' | 'shi_eld_wins' | 'pvp_matches';
  /** Current progress toward this requirement. */
  current: (ctx: CpuUnlockContext) => number;
  /** Target needed to satisfy this requirement. */
  target: number;
}

export interface CpuUnlockRule {
  cpuKey: CpuOpponentKey;
  /** Language-neutral identifier translated by the client. */
  descriptionKey: 'available_immediately' | 'available_after_tutorial' | 'beat_max_and_min' | 'beat_shield_and_pvp';
  /** Whether tutorial completion is required in addition to win requirements. */
  tutorialGated: boolean;
  /** Measurable requirements (empty for immediately available CPUs). */
  requirements: CpuUnlockRequirement[];
}

export const CPU_UNLOCK_RULES: Record<CpuOpponentKey, CpuUnlockRule> = {
  max: {
    cpuKey: 'max',
    descriptionKey: 'available_immediately',
    tutorialGated: false,
    requirements: [],
  },
  min: {
    cpuKey: 'min',
    descriptionKey: 'available_immediately',
    tutorialGated: false,
    requirements: [],
  },
  shi_eld: {
    cpuKey: 'shi_eld',
    descriptionKey: 'available_immediately',
    tutorialGated: false,
    requirements: [],
  },
  fury: {
    cpuKey: 'fury',
    descriptionKey: 'available_immediately',
    tutorialGated: false,
    requirements: [],
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
