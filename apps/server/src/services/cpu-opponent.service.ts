import {
  getCpuOpponentConfig,
} from '../config/cpu-opponents.config';
import type { CpuOpponentConfig, CpuOpponentKey } from '../config/cpu-opponents.config';

// ---------------------------------------------------------------------------
// Public CPU decision types
// ---------------------------------------------------------------------------

export type CpuActionType = 'answer' | 'defend' | 'wait' | 'no_action';

export type RandomSource = () => number;

export interface CpuDecisionContext {
  cpuKey: CpuOpponentKey;
  serverTimestampMs: number;
  questionStartedAtMs: number;
  questionDeadlineMs: number;
  expectedAnswer: number | string;
  cpuCanAnswer: boolean;
  cpuCanDefend: boolean;
  cpuRevengeActive: boolean;
  playerAttackIncoming: boolean;
  playerIsLockedOut: boolean;
  cpuSuccessfulBlockThisQuestion?: boolean;
  rng?: RandomSource;
}

export interface CpuActionDecision {
  action: CpuActionType;
  reason: string;
  performAtMs?: number;
  answer?: string;
  targetAttackPower?: number;
  wantsStreak?: boolean;
  usesRevenge?: boolean;
  criticalChance?: number;
  damageMultiplier?: number;
}

export interface CpuQuestionPressure {
  cpuHardQuestionChance?: number;
  forceHardDifficulty?: boolean;
  questionTypeChangeEveryQuestions?: number;
}

// ---------------------------------------------------------------------------
// Public CPU decision API
// ---------------------------------------------------------------------------

export function decideCpuAction(context: CpuDecisionContext): CpuActionDecision {
  const config = getCpuOpponentConfig(context.cpuKey);
  const rng = context.rng ?? Math.random;

  if (shouldDefend(context, config, rng)) {
    return {
      action: 'defend',
      performAtMs: context.serverTimestampMs,
      reason: `${config.displayName} chose DEFEND from CPU profile rules.`,
    };
  }

  const blockFollowUp = decideBlockFollowUp(context, config);
  if (blockFollowUp !== null) {
    return blockFollowUp;
  }

  const lockoutPunish = decideLockoutPunish(context, config, rng);
  if (lockoutPunish !== null) {
    return lockoutPunish;
  }

  const surpriseAttack = decideSurpriseAttack(context, config, rng);
  if (surpriseAttack !== null) {
    return surpriseAttack;
  }

  if (context.cpuCanAnswer && config.answerDelayMs !== undefined) {
    return buildAnswerDecision({
      context,
      config,
      performAtMs: resolveAnswerTime(context, config, rng),
      reason: `${config.displayName} answered using its configured timing window.`,
    });
  }

  if (!context.cpuCanAnswer && !context.cpuCanDefend) {
    return {
      action: 'no_action',
      reason: `${config.displayName} cannot answer or defend in the current Live Match state.`,
    };
  }

  return {
    action: 'wait',
    reason: `${config.displayName} has no eligible CPU profile action for this moment.`,
  };
}

export function getCpuQuestionPressure(cpuKey: CpuOpponentKey): CpuQuestionPressure {
  const config = getCpuOpponentConfig(cpuKey);
  const pressure: CpuQuestionPressure = {};

  if (config.hardQuestionChance !== undefined) {
    pressure.cpuHardQuestionChance = config.hardQuestionChance;
  }

  if (config.forceHardQuestions === true) {
    pressure.forceHardDifficulty = true;
  }

  if (config.questionTypeChangeEveryQuestions !== undefined) {
    pressure.questionTypeChangeEveryQuestions = config.questionTypeChangeEveryQuestions;
  }

  return pressure;
}

// ---------------------------------------------------------------------------
// DEFEND decision rules
// ---------------------------------------------------------------------------

function shouldDefend(
  context: CpuDecisionContext,
  config: CpuOpponentConfig,
  rng: RandomSource,
): boolean {
  if (!context.playerAttackIncoming || !context.cpuCanDefend || !config.canDefend) {
    return false;
  }

  if (config.key === 'skore' && context.cpuRevengeActive) {
    return true;
  }

  if (config.key === 'shi_eld' && isAfterWeaknessMark(context, config)) {
    return !chance(config.weakAfterChance ?? 0, rng);
  }

  return chance(config.blockChance ?? 0, rng);
}

// ---------------------------------------------------------------------------
// Attack decision rules
// ---------------------------------------------------------------------------

function decideBlockFollowUp(
  context: CpuDecisionContext,
  config: CpuOpponentConfig,
): CpuActionDecision | null {
  if (!context.cpuCanAnswer || context.cpuSuccessfulBlockThisQuestion !== true) {
    return null;
  }

  if (config.key !== 'fury' && config.key !== 'skore') {
    return null;
  }

  return buildAnswerDecision({
    context,
    config,
    performAtMs: context.serverTimestampMs,
    reason: `${config.displayName} followed a successful block with a power-30 attack attempt.`,
    targetAttackPower: 30,
  });
}

function decideLockoutPunish(
  context: CpuDecisionContext,
  config: CpuOpponentConfig,
  rng: RandomSource,
): CpuActionDecision | null {
  if (!context.playerIsLockedOut || !context.cpuCanAnswer) {
    return null;
  }

  if (config.key !== 'peasy' && config.key !== 'skore') {
    return null;
  }

  return buildAnswerDecision({
    context,
    config,
    performAtMs: resolveFastAnswerTime(context, config, rng),
    reason: `${config.displayName} punished the player's lockout window.`,
  });
}

function decideSurpriseAttack(
  context: CpuDecisionContext,
  config: CpuOpponentConfig,
  rng: RandomSource,
): CpuActionDecision | null {
  if (!context.cpuCanAnswer || config.surpriseAttackChance === undefined) {
    return null;
  }

  if (!chance(config.surpriseAttackChance, rng)) {
    return null;
  }

  return buildAnswerDecision({
    context,
    config,
    performAtMs: context.serverTimestampMs,
    reason: `${config.displayName} used its surprise attack chance.`,
  });
}

// ---------------------------------------------------------------------------
// Decision construction helpers
// ---------------------------------------------------------------------------

function buildAnswerDecision(options: {
  context: CpuDecisionContext;
  config: CpuOpponentConfig;
  performAtMs: number;
  reason: string;
  targetAttackPower?: number;
}): CpuActionDecision {
  const { context, config } = options;
  const decision: CpuActionDecision = {
    action: 'answer',
    answer: context.expectedAnswer.toString(),
    performAtMs: clamp(options.performAtMs, context.serverTimestampMs, context.questionDeadlineMs),
    reason: options.reason,
  };

  if (options.targetAttackPower !== undefined) {
    decision.targetAttackPower = options.targetAttackPower;
  }

  if (config.canBuildStreak && chance(config.streakAttemptChance ?? 1, context.rng ?? Math.random)) {
    decision.wantsStreak = true;
  }

  if (config.baseDamageMultiplier !== undefined) {
    decision.damageMultiplier = config.baseDamageMultiplier;
  }

  if (config.startingAttackMultiplier !== undefined) {
    decision.damageMultiplier = config.startingAttackMultiplier;
  }

  if (config.revengeAlwaysActive === true || context.cpuRevengeActive) {
    decision.usesRevenge = true;
  }

  if (options.targetAttackPower === 30 && config.criticalChanceAtPower30 !== undefined) {
    decision.criticalChance = config.criticalChanceAtPower30;
  }

  return decision;
}

function resolveAnswerTime(
  context: CpuDecisionContext,
  config: CpuOpponentConfig,
  rng: RandomSource,
): number {
  if (config.fastAnswerChance !== undefined && chance(config.fastAnswerChance, rng)) {
    return resolveFastAnswerTime(context, config, rng);
  }

  const answerDelayMs = config.answerDelayMs;
  if (answerDelayMs === undefined) {
    return context.serverTimestampMs;
  }

  return context.questionStartedAtMs + randomInt(answerDelayMs.min, answerDelayMs.max, rng);
}

function resolveFastAnswerTime(
  context: CpuDecisionContext,
  config: CpuOpponentConfig,
  rng: RandomSource,
): number {
  const answerDelayMs = config.answerDelayMs;
  if (answerDelayMs === undefined) {
    return context.serverTimestampMs;
  }

  return context.questionStartedAtMs + randomInt(answerDelayMs.min, answerDelayMs.max, rng);
}

// ---------------------------------------------------------------------------
// Generic helpers
// ---------------------------------------------------------------------------

function isAfterWeaknessMark(context: CpuDecisionContext, config: CpuOpponentConfig): boolean {
  if (config.weakAfterMs === undefined) {
    return false;
  }

  return context.serverTimestampMs - context.questionStartedAtMs >= config.weakAfterMs;
}

function chance(probability: number, rng: RandomSource): boolean {
  if (probability <= 0) {
    return false;
  }

  if (probability >= 1) {
    return true;
  }

  return rng() < probability;
}

function randomInt(min: number, max: number, rng: RandomSource): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
