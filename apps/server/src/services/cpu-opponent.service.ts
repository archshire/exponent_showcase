import { getCpuOpponentConfig } from '../config/cpu-opponents.config';
import type { CpuOpponentConfig, CpuOpponentKey } from '../config/cpu-opponents.config';
import { randomInt } from './random.util';
import type { RandomSource } from './random.util';

// ---------------------------------------------------------------------------
// Public CPU decision types
// ---------------------------------------------------------------------------

export type CpuActionType = 'answer' | 'defend' | 'wait' | 'no_action';

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
  cpuMediumQuestionChance?: number;
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

  if (config.mediumQuestionChance !== undefined) {
    pressure.cpuMediumQuestionChance = config.mediumQuestionChance;
  }

  return pressure;
}

// ---------------------------------------------------------------------------
// DEFEND decision rules
// ---------------------------------------------------------------------------

function shouldDefend(
  context: CpuDecisionContext,
  config: CpuOpponentConfig,
  rng: RandomSource
): boolean {
  if (!context.playerAttackIncoming || !context.cpuCanDefend || !config.canDefend) {
    return false;
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
  config: CpuOpponentConfig
): CpuActionDecision | null {
  if (!context.cpuCanAnswer || context.cpuSuccessfulBlockThisQuestion !== true) {
    return null;
  }

  if (config.key === 'fury') {
    return buildAnswerDecision({
      context,
      config,
      performAtMs: context.serverTimestampMs,
      reason: `${config.displayName} followed a successful block with a power-30 attack attempt.`,
      targetAttackPower: 30,
    });
  }

  if (config.key === 'shi_eld') {
    return buildAnswerDecision({
      context,
      config,
      performAtMs: context.serverTimestampMs,
      reason: `${config.displayName} immediately countered a successful block.`,
    });
  }

  return null;
}

function decideSurpriseAttack(
  context: CpuDecisionContext,
  config: CpuOpponentConfig,
  rng: RandomSource
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
  const rng = context.rng ?? Math.random;
  const decision: CpuActionDecision = {
    action: 'answer',
    answer: resolveAnswerValue(context, config, rng),
    performAtMs: clamp(options.performAtMs, context.serverTimestampMs, context.questionDeadlineMs),
    reason: options.reason,
  };

  if (options.targetAttackPower !== undefined) {
    decision.targetAttackPower = options.targetAttackPower;
  }

  if (config.canBuildStreak && chance(config.streakAttemptChance ?? 1, rng)) {
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

// The CPU answers correctly with probability `config.accuracy` (default 1).
// When it errs, it submits a realistic near miss (off by 1–3) rather than the
// correct value — a wrong answer is handled by Live Match as a normal miss
// (streak reset, brief lockout, no attack, accuracy stat drops).
function resolveAnswerValue(
  context: CpuDecisionContext,
  config: CpuOpponentConfig,
  rng: RandomSource
): string {
  const accuracy = config.accuracy ?? 1;
  if (accuracy >= 1 || chance(accuracy, rng)) {
    return context.expectedAnswer.toString();
  }

  const correct = Number(context.expectedAnswer);
  if (!Number.isFinite(correct)) {
    return context.expectedAnswer.toString();
  }

  const offsets = [-3, -2, -1, 1, 2, 3];
  const offset = offsets[Math.floor(rng() * offsets.length)] ?? 1;
  return (correct + offset).toString();
}

function resolveAnswerTime(
  context: CpuDecisionContext,
  config: CpuOpponentConfig,
  rng: RandomSource
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
  rng: RandomSource
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

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
