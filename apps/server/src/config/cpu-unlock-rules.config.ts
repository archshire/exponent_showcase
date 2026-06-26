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
  label: string;
  /** Current progress toward this requirement. */
  current: (ctx: CpuUnlockContext) => number;
  /** Target needed to satisfy this requirement. */
  target: number;
}

export interface CpuUnlockRule {
  cpuKey: CpuOpponentKey;
  /** Human-readable summary shown on the CPU VS screen. */
  description: string;
  /** Gated only by tutorial completion (Max/Min). */
  tutorialGated: boolean;
  /** Measurable requirements (empty for tutorial-only CPUs). */
  requirements: CpuUnlockRequirement[];
}

export const CPU_UNLOCK_RULES: Record<CpuOpponentKey, CpuUnlockRule> = {
  max: {
    cpuKey: 'max',
    description: 'Available after the tutorial.',
    tutorialGated: true,
    requirements: [],
  },
  min: {
    cpuKey: 'min',
    description: 'Available after the tutorial.',
    tutorialGated: true,
    requirements: [],
  },
  fury: {
    cpuKey: 'fury',
    description: 'Beat Max 2 times and Min 2 times.',
    tutorialGated: true,
    requirements: [
      { label: 'Max wins', current: (c) => c.winsByCpu.max, target: 2 },
      { label: 'Min wins', current: (c) => c.winsByCpu.min, target: 2 },
    ],
  },
  shi_eld: {
    cpuKey: 'shi_eld',
    description: 'Beat Fury 2 times and complete 1 PvP match.',
    tutorialGated: true,
    requirements: [
      { label: 'Fury wins', current: (c) => c.winsByCpu.fury, target: 2 },
      { label: 'PvP matches', current: (c) => c.completedPvpMatches, target: 1 },
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
    description: rule.description,
    unlocked: isCpuUnlocked(cpuKey, ctx),
    tutorialGated: rule.tutorialGated,
    tutorialCompleted: ctx.tutorialCompleted,
    requirements: rule.requirements.map((req) => ({
      label: req.label,
      current: Math.min(req.current(ctx), req.target),
      target: req.target,
    })),
  };
}
