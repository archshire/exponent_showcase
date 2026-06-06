// ---------------------------------------------------------------------------
// CPU opponent personality config
// ---------------------------------------------------------------------------

export type CpuOpponentKey = 'max' | 'min' | 'fury' | 'shi_eld' | 'peasy' | 'skore';

export type CpuFighterType =
  | 'streak'
  | 'vanilla'
  | 'avenge'
  | 'block_specialist'
  | 'expert_streak'
  | 'boss_adaptive';

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
  forceHardQuestions?: boolean;
  hardQuestionChance?: number;
  streakAttemptChance?: number;
  blockChance?: number;
  weakAfterMs?: number;
  weakAfterChance?: number;
  surpriseAttackChance?: number;
  fastAnswerChance?: number;
  criticalChanceAtPower30?: number;
  criticalDamageMultiplier?: number;
  questionTypeChangeEveryQuestions?: number;
}

export const CPU_OPPONENT_CONFIG = {
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
  fury: {
    key: 'fury',
    displayName: 'Fury',
    fighterType: 'avenge',
    canDefend: true,
    canBuildStreak: false,
    usesNormalRevengeGauge: false,
    revengeAlwaysActive: true,
    blockChance: 0.8,
    hardQuestionChance: 0.6,
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
  peasy: {
    key: 'peasy',
    displayName: 'Peasy',
    fighterType: 'expert_streak',
    answerDelayMs: { min: 0, max: 1000 },
    canDefend: true,
    canBuildStreak: true,
    usesNormalRevengeGauge: true,
    fastAnswerChance: 0.8,
    blockChance: 0.5,
  },
  skore: {
    key: 'skore',
    displayName: 'Skore',
    fighterType: 'boss_adaptive',
    answerDelayMs: { min: 0, max: 1500 },
    hp: 200,
    startingAttackMultiplier: 1.2,
    canDefend: true,
    canBuildStreak: true,
    usesNormalRevengeGauge: false,
    revengeBlocksRequired: 1,
    forceHardQuestions: true,
    streakAttemptChance: 0.7,
    fastAnswerChance: 0.8,
    questionTypeChangeEveryQuestions: 3,
  },
} as const satisfies Record<CpuOpponentKey, CpuOpponentConfig>;

export const CPU_OPPONENT_KEYS = Object.keys(CPU_OPPONENT_CONFIG) as CpuOpponentKey[];

export function getCpuOpponentConfig(cpuKey: CpuOpponentKey): CpuOpponentConfig {
  return CPU_OPPONENT_CONFIG[cpuKey];
}
