// ---------------------------------------------------------------------------
// CPU opponent personality config
// ---------------------------------------------------------------------------

export type CpuOpponentKey = 'min' | 'max' | 'fury' | 'shi_eld';

export type CpuFighterType =
  | 'vanilla'
  | 'streak'
  | 'avenge'
  | 'block_specialist';

export interface AnswerDelayMs {
  min: number;
  max: number;
}

export interface CpuOpponentConfig {
  key: CpuOpponentKey;
  displayName: string;
  fighterType: CpuFighterType;
  answerDelayMs?: AnswerDelayMs;
  hp?: number;
  baseDamageMultiplier?: number;
  startingAttackMultiplier?: number;
  canDefend: boolean;
  canBuildStreak: boolean;
  usesNormalRevengeGauge: boolean;
  revengeAlwaysActive?: boolean;
  revengeBlocksRequired?: number;
  mediumQuestionChance?: number;
  streakAttemptChance?: number;
  blockChance?: number;
  weakAfterMs?: number;
  weakAfterChance?: number;
  surpriseAttackChance?: number;
  fastAnswerChance?: number;
  criticalChanceAtPower30?: number;
  criticalDamageMultiplier?: number;
}

export const CPU_OPPONENT_CONFIG = {
  min: {
    key: 'min',
    displayName: 'Min',
    fighterType: 'vanilla',
    answerDelayMs: { min: 2500, max: 3500 },
    baseDamageMultiplier: 1.2,
    canDefend: false,
    canBuildStreak: false,
    usesNormalRevengeGauge: true,
  },
  max: {
    key: 'max',
    displayName: 'Max',
    fighterType: 'streak',
    answerDelayMs: { min: 2000, max: 3000 },
    canDefend: false,
    canBuildStreak: true,
    usesNormalRevengeGauge: true,
    streakAttemptChance: 0.7,
  },
  fury: {
    key: 'fury',
    displayName: 'Fury',
    fighterType: 'avenge',
    canDefend: true,
    canBuildStreak: false,
    usesNormalRevengeGauge: false,
    revengeAlwaysActive: true,
    blockChance: 0.8,
    mediumQuestionChance: 0.7,
    criticalChanceAtPower30: 0.5,
    criticalDamageMultiplier: 3,
  },
  shi_eld: {
    key: 'shi_eld',
    displayName: 'Shi-eld',
    fighterType: 'block_specialist',
    canDefend: true,
    canBuildStreak: false,
    usesNormalRevengeGauge: true,
    blockChance: 0.9,
    weakAfterMs: 2500,
    weakAfterChance: 0.9,
    surpriseAttackChance: 0.1,
  },
} as const satisfies Record<CpuOpponentKey, CpuOpponentConfig>;

export const CPU_OPPONENT_KEYS = Object.keys(CPU_OPPONENT_CONFIG) as CpuOpponentKey[];

export function getCpuOpponentConfig(cpuKey: CpuOpponentKey): CpuOpponentConfig {
  return CPU_OPPONENT_CONFIG[cpuKey];
}
