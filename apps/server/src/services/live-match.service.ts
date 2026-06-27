import { getCpuOpponentConfig } from '../config/cpu-opponents.config';
import { decideCpuAction, getCpuQuestionPressure } from './cpu-opponent.service';
import {
  generateQuestion,
  selectRoundQuestionConfig,
  validateAnswer,
} from './question-generator.service';
import type { CpuOpponentKey } from '../config/cpu-opponents.config';
import type {
  Difficulty,
  GeneratedQuestion,
  GameMode,
  QuestionGenerationOptions,
  RandomSource,
  RoundQuestionConfig,
} from './question-generator.service';
import type { CpuActionDecision } from './cpu-opponent.service';

// ---------------------------------------------------------------------------
// Live Match Service
// ---------------------------------------------------------------------------
//
// This module owns one in-memory runtime session per active match.
//
// It is the backend coordination layer between:
// - Matchmaking / room assignment.
// - Question Generator prompt truth.
// - CPU Opponent behavior decisions.
// - Future Socket.IO event emission.
//
// It should not render gameplay, access the database directly for every live
// tick, or let browser/Excalibur code decide match-critical truth.
//
// Match lifecycle map:
// 1. Matchmaking creates/assigns a room outside this module.
// 2. `createLiveMatchSession` creates one runtime state object for that match.
// 3. `startRoundPrep` chooses the question type and difficulty for the round.
// 4. `constructNextQuestion` asks Question Generator for the next prompt truth.
// 5. `markQuestionStarted` starts the 6-second answer timer.
// 6. `activateDefend` opens a 1.5-second damage-blocking DEFEND window.
// 7. `submitAnswer` validates player/CPU answers and applies basic combat:
//    correct answer -> attack power -> streak/revenge damage -> HP damage.
//    wrong answer -> MISSED lockout.
// 8. `resolveQuestionTimeout` applies SHOCK if the question expires unresolved.
// 9. `resolvePendingCorrectAnswer` finalizes a correct answer after the
//    150ms same-time DRAW window passes.
// 10. `endFightRound` compares HP, records round wins/ties, and may end match.
// 11. `finalizeMatchResult` builds the Match Summary/results-page handoff.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// 1. Public live match state types
// ---------------------------------------------------------------------------

export type LiveMatchMode = 'pvp' | 'pvc';

export type LiveMatchPhase =
  | 'created'
  | 'round_prep'
  | 'question_constructing'
  | 'question_active'
  | 'reconnect_paused'
  | 'round_ended'
  | 'ended';

export type CombatantSlot = 'p1' | 'p2';

export type CombatantDriver = 'human' | 'cpu';

export type StatusEffectType = 'missed' | 'defend' | 'stunned';

export interface StatusEffectState {
  type: StatusEffectType;
  startedAtMs: number;
  endsAtMs: number;
}

export interface CombatantRuntimeState {
  slot: CombatantSlot;
  id: string;
  driver: CombatantDriver;
  hp: number;
  maxHp: number;
  currentStreak: number;
  longestStreak: number;
  revengeBlocks: number;
  revengeActive: boolean;
  revengeActivatesOnQuestionSequence?: number;
  defendAvailable: boolean;
  defendUnavailableUntilQuestionSequence?: number;
  submittedAttempts: number;
  correctAnswers: number;
  statusEffects: StatusEffectState[];
}

export interface LiveQuestionRuntimeState {
  sequence: number;
  question: GeneratedQuestion;
  constructedAtMs: number;
  startedAtMs?: number;
  deadlineAtMs?: number;
  resolvedAtMs?: number;
  correctAnswerSlot?: CombatantSlot;
  pendingCorrectAnswer?: PendingCorrectAnswerState;
}

export interface LiveMatchSession {
  matchId: string;
  roomId: string;
  mode: LiveMatchMode;
  phase: LiveMatchPhase;
  roundNumber: number;
  roundWins: Record<CombatantSlot, number>;
  tiedRoundCount: number;
  isFinalRound: boolean;
  questionSequence: number;
  createdAtMs: number;
  updatedAtMs: number;
  combatants: Record<CombatantSlot, CombatantRuntimeState>;
  roundQuestionConfig?: RoundQuestionConfig;
  currentQuestion?: LiveQuestionRuntimeState;
  additionalDamage?: AdditionalDamageState;
  reconnectState?: ReconnectRuntimeState;
  finalOutcome?: LiveMatchFinalOutcomeState;
  cpuOpponentKey?: CpuOpponentKey;
}

export interface LiveMatchFinalOutcomeState {
  status: 'completed' | 'voided';
  endedAtMs: number;
  winnerSlot?: CombatantSlot;
  mutualFinalRoundLoss: boolean;
  dcSlot?: CombatantSlot;
  voidReason?: string;
}

export interface ReconnectRuntimeState {
  status: 'reconnecting' | 'resuming';
  disconnectedSlot: CombatantSlot;
  phaseBeforeReconnect: Exclude<LiveMatchPhase, 'reconnect_paused' | 'ended'>;
  startedAtMs: number;
  deadlineAtMs: number;
  resumedAtMs?: number;
  resumeDeadlineAtMs?: number;
}

export interface PendingCorrectAnswerState {
  combatantSlot: CombatantSlot;
  receivedAtMs: number;
  attackPower: number;
}

export interface AdditionalDamageState {
  damage: number;
  armedFromQuestionSequence: number;
}

export type LiveMatchEventName =
  | 'match.started'
  | 'round.prep.started'
  | 'question.constructing'
  | 'question.started'
  | 'round.ended'
  | 'answer.accepted'
  | 'answer.rejected'
  | 'defend.activated'
  | 'defend.blocked'
  | 'missed'
  | 'stun.applied'
  | 'draw.triggered'
  | 'tie_breaker.applied'
  | 'revenge.gauge_changed'
  | 'revenge.activated'
  | 'revenge.attack_landed'
  | 'shock.applied'
  | 'attack.landed'
  | 'cpu.action.decided'
  | 'reconnect.paused'
  | 'reconnect.resumed'
  | 'reconnect.lost'
  | 'match.voided'
  | 'match.ended'
  | 'results.ready';

export interface LiveMatchEvent {
  name: LiveMatchEventName;
  matchId: string;
  roomId: string;
  serverTimestampMs: number;
  payload: Record<string, unknown>;
}

export interface LiveMatchResult<T> {
  session: LiveMatchSession;
  value: T;
  events: LiveMatchEvent[];
}

export interface CreateLiveMatchSessionOptions {
  matchId: string;
  roomId: string;
  mode: LiveMatchMode;
  p1CombatantId: string;
  p2CombatantId?: string;
  cpuOpponentKey?: CpuOpponentKey;
  nowMs?: number;
}

export interface RuntimeActionOptions {
  nowMs?: number;
  rng?: RandomSource;
  forceDifficulty?: Difficulty;
  endMatchAfterRound?: boolean;
}

export interface StartRoundPrepOptions extends RuntimeActionOptions {
  difficulty?: Difficulty;
}

export interface SubmittedAnswerResult {
  combatantSlot: CombatantSlot;
  isCorrect: boolean;
  normalizedSubmittedAnswer: number | string | null;
  expectedAnswer: number | string;
  attackPower?: number;
  streakMultiplier?: number;
  damage?: number;
  targetCombatantSlot?: CombatantSlot;
  blockedByDefend?: boolean;
  usedRevenge?: boolean;
  pendingDrawWindowUntilMs?: number;
  drawTriggered?: boolean;
  additionalDamageArmed?: number;
  additionalDamageApplied?: number;
}

export interface QuestionTimeoutResult {
  timedOut: boolean;
  reason?: string;
  shockDamage?: number;
  additionalDamageCleared?: number;
}

export type FightRoundOutcome = 'p1_win' | 'p2_win' | 'tie' | 'mutual_loss';

export interface FightRoundResult {
  roundNumber: number;
  outcome: FightRoundOutcome;
  winnerSlot?: CombatantSlot;
  matchEnded: boolean;
  matchWinnerSlot?: CombatantSlot;
  mutualFinalRoundLoss?: boolean;
  roundWins: Record<CombatantSlot, number>;
  tiedRoundCount: number;
  isFinalRound: boolean;
}

export interface CombatantResultSummary {
  slot: CombatantSlot;
  combatantId: string;
  driver: CombatantDriver;
  hp: number;
  correctAnswers: number;
  submittedAttempts: number;
  accuracy: number;
  longestStreak: number;
  auraGain: number;
}

export interface FinalMatchResult {
  matchId: string;
  roomId: string;
  mode: LiveMatchMode;
  status: 'completed' | 'voided';
  startedAtMs: number;
  endedAtMs: number;
  winnerSlot?: CombatantSlot;
  winnerCombatantId?: string;
  mutualFinalRoundLoss: boolean;
  roundWins: Record<CombatantSlot, number>;
  tiedRoundCount: number;
  combatants: Record<CombatantSlot, CombatantResultSummary>;
  cpuOpponentKey?: CpuOpponentKey;
  pvcPlayerWon?: boolean;
  dcCombatantId?: string;
  voidReason?: string;
}

export interface DefendActivationResult {
  combatantSlot: CombatantSlot;
  activeUntilMs?: number;
  unavailableUntilQuestionSequence?: number;
  accepted: boolean;
  reason?: string;
}

export interface CpuActionRequestOptions extends RuntimeActionOptions {
  playerAttackIncoming?: boolean;
  playerIsLockedOut?: boolean;
  cpuSuccessfulBlockThisQuestion?: boolean;
}

export const QUESTION_DURATION_MS = 6000;
// Power ramps across the whole question window so max power lands right at the
// deadline — the attack bar fills exactly as the shock fires, no dead gap.
const ATTACK_POWER_RAMP_MS = 6000;
const MIN_ATTACK_POWER = 1;
const MAX_ATTACK_POWER = 30;
const MISSED_LOCKOUT_MS = 1000;
const DEFEND_ACTIVE_MS = 1500;
const STUN_LOCKOUT_MS = 1500;
const SHOCK_DAMAGE = 10;
const DEFAULT_REVENGE_BLOCKS_REQUIRED = 5;
const SAME_TIME_DRAW_WINDOW_MS = 150;
const FIGHT_ROUND_WINS_TO_WIN_MATCH = 2;
const NORMAL_ROUNDS_BEFORE_FINAL = 3;
export const RECONNECT_GRACE_MS = 10_000;
export const RECONNECT_RESUME_COUNTDOWN_MS = 5_000;

// ---------------------------------------------------------------------------
// 2. In-memory live match registry
// ---------------------------------------------------------------------------
//
// One shared service process can host many sessions at the same time. The code
// is shared, but the state object is per match.

const liveMatchSessions = new Map<string, LiveMatchSession>();

// ---------------------------------------------------------------------------
// 3. Session lifecycle API
// ---------------------------------------------------------------------------

export function createLiveMatchSession(
  options: CreateLiveMatchSessionOptions,
): LiveMatchResult<LiveMatchSession> {
  const nowMs = options.nowMs ?? Date.now();

  if (options.mode === 'pvc' && options.cpuOpponentKey === undefined) {
    throw new Error('PvC live matches require a CPU opponent key.');
  }

  if (options.mode === 'pvp' && options.p2CombatantId === undefined) {
    throw new Error('PvP live matches require a second player combatant.');
  }

  const session: LiveMatchSession = {
    matchId: options.matchId,
    roomId: options.roomId,
    mode: options.mode,
    phase: 'created',
    roundNumber: 0,
    roundWins: {
      p1: 0,
      p2: 0,
    },
    tiedRoundCount: 0,
    isFinalRound: false,
    questionSequence: 0,
    createdAtMs: nowMs,
    updatedAtMs: nowMs,
    combatants: {
      p1: createCombatantState({
        slot: 'p1',
        id: options.p1CombatantId,
        driver: 'human',
      }),
      p2: createSecondCombatantState(options),
    },
  };

  if (options.cpuOpponentKey !== undefined) {
    session.cpuOpponentKey = options.cpuOpponentKey;
  }

  liveMatchSessions.set(session.matchId, session);

  return {
    session,
    value: session,
    events: [
      createEvent(session, 'match.started', nowMs, {
        mode: session.mode,
        phase: session.phase,
        combatants: session.combatants,
      }),
    ],
  };
}

export function getLiveMatchSession(matchId: string): LiveMatchSession | null {
  return liveMatchSessions.get(matchId) ?? null;
}

export function removeLiveMatchSession(matchId: string): boolean {
  return liveMatchSessions.delete(matchId);
}

// ---------------------------------------------------------------------------
// 4. Round and question flow API
// ---------------------------------------------------------------------------

export function startRoundPrep(
  matchId: string,
  options: StartRoundPrepOptions = {},
): LiveMatchResult<RoundQuestionConfig> {
  const session = requireLiveMatchSession(matchId);
  const nowMs = options.nowMs ?? Date.now();
  const questionMode = toQuestionGeneratorMode(session.mode);
  const selectionOptions: { mode: GameMode; rng?: RandomSource; difficulty?: Difficulty } = { mode: questionMode };
  if (options.rng !== undefined) selectionOptions.rng = options.rng;
  if (options.difficulty !== undefined) selectionOptions.difficulty = options.difficulty;
  const roundQuestionConfig = selectRoundQuestionConfig(selectionOptions);

  if (session.roundNumber > 0) {
    resetCombatantsForNextFightRound(session);
  }

  session.phase = 'round_prep';
  session.roundNumber += 1;
  session.roundQuestionConfig = roundQuestionConfig;
  delete session.currentQuestion;
  delete session.additionalDamage;
  session.updatedAtMs = nowMs;

  return {
    session,
    value: roundQuestionConfig,
    events: [
      createEvent(session, 'round.prep.started', nowMs, {
        roundNumber: session.roundNumber,
        questionType: roundQuestionConfig.questionType,
        difficulty: roundQuestionConfig.difficulty,
      }),
    ],
  };
}

export function constructNextQuestion(
  matchId: string,
  options: RuntimeActionOptions = {},
): LiveMatchResult<GeneratedQuestion> {
  const session = requireLiveMatchSession(matchId);
  const nowMs = options.nowMs ?? Date.now();
  const roundQuestionConfig = ensureRoundQuestionConfig(session, options);
  const generationOptions = buildQuestionGenerationOptions(session, roundQuestionConfig, options);
  const question = generateQuestion(generationOptions);

  session.phase = 'question_constructing';
  session.questionSequence += 1;
  refreshDefendAvailabilityForQuestion(session);
  const revengeActivationEvents = refreshRevengeActivationForQuestion(session, nowMs);
  session.currentQuestion = {
    sequence: session.questionSequence,
    question,
    constructedAtMs: nowMs,
  };
  session.updatedAtMs = nowMs;

  return {
    session,
    value: question,
    events: [
      createEvent(session, 'question.constructing', nowMs, {
        sequence: session.questionSequence,
        question,
      }),
      ...revengeActivationEvents,
    ],
  };
}

export function markQuestionStarted(
  matchId: string,
  options: RuntimeActionOptions = {},
): LiveMatchResult<LiveQuestionRuntimeState> {
  const session = requireLiveMatchSession(matchId);
  const currentQuestion = requireCurrentQuestion(session);
  const nowMs = options.nowMs ?? Date.now();
  const deadlineAtMs = nowMs + QUESTION_DURATION_MS;

  currentQuestion.startedAtMs = nowMs;
  currentQuestion.deadlineAtMs = deadlineAtMs;
  session.phase = 'question_active';
  session.updatedAtMs = nowMs;

  return {
    session,
    value: currentQuestion,
    events: [
      createEvent(session, 'question.started', nowMs, {
        sequence: currentQuestion.sequence,
        questionStartedAtMs: nowMs,
        questionDeadlineAtMs: deadlineAtMs,
      }),
    ],
  };
}

export function activateDefend(
  matchId: string,
  combatantSlot: CombatantSlot,
  options: RuntimeActionOptions = {},
): LiveMatchResult<DefendActivationResult> {
  const session = requireLiveMatchSession(matchId);
  const currentQuestion = requireCurrentQuestion(session);
  const nowMs = options.nowMs ?? Date.now();

  if (session.phase !== 'question_active' || currentQuestion.deadlineAtMs === undefined) {
    return buildRejectedDefendResult(session, combatantSlot, nowMs, 'QUESTION_NOT_ACTIVE');
  }

  if (currentQuestion.resolvedAtMs !== undefined) {
    return buildRejectedDefendResult(session, combatantSlot, nowMs, 'QUESTION_ALREADY_RESOLVED');
  }

  if (nowMs > currentQuestion.deadlineAtMs) {
    return buildRejectedDefendResult(session, combatantSlot, nowMs, 'DEFEND_AFTER_TIMEOUT');
  }

  const combatant = session.combatants[combatantSlot];
  if (!combatant.defendAvailable || hasDefendBlockingStatus(combatant, nowMs)) {
    return buildRejectedDefendResult(session, combatantSlot, nowMs, 'DEFEND_UNAVAILABLE');
  }

  const activeUntilMs = nowMs + DEFEND_ACTIVE_MS;
  // Recharges on the very next question (available once per question). Refresh
  // checks `questionSequence > this`, so using the current sequence means the
  // next question re-enables it.
  const unavailableUntilQuestionSequence = currentQuestion.sequence;

  combatant.defendAvailable = false;
  combatant.defendUnavailableUntilQuestionSequence = unavailableUntilQuestionSequence;
  addStatusEffect(combatant, 'defend', nowMs, activeUntilMs);
  session.updatedAtMs = nowMs;

  return {
    session,
    value: {
      combatantSlot,
      activeUntilMs,
      unavailableUntilQuestionSequence,
      accepted: true,
    },
    events: [
      createEvent(session, 'defend.activated', nowMs, {
        combatantSlot,
        activeUntilMs,
        activeMs: DEFEND_ACTIVE_MS,
        unavailableUntilQuestionSequence,
      }),
    ],
  };
}

// ---------------------------------------------------------------------------
// 5. Player answer flow API
// ---------------------------------------------------------------------------
//
// This first pass validates timing and lockout eligibility, then applies the
// basic combat consequences: correct-answer damage and wrong-answer MISSED.
// Round-result resolution will be added here or delegated from here as combat
// rules mature.
//
// Answer submission flow:
// 1. Reject if the question is not active.
// 2. Reject if this question was already resolved.
// 3. Reject if the answer arrived after the deadline.
// 4. Reject if the combatant is locked by MISSED, DEFEND, or STUNNED.
// 5. Validate the answer against Question Generator's expected answer.
// 6. First correct answer waits for the 150ms same-time DRAW window.
// 7. Second same-time correct answer triggers DRAW and arms Additional DMG.
// 8. Correct answer outside DRAW applies attack damage to the opponent.
// 9. Wrong answer applies MISSED lockout to the submitter.

export function submitAnswer(
  matchId: string,
  combatantSlot: CombatantSlot,
  submittedAnswer: string,
  options: RuntimeActionOptions = {},
): LiveMatchResult<SubmittedAnswerResult> {
  const session = requireLiveMatchSession(matchId);
  const currentQuestion = requireCurrentQuestion(session);
  const nowMs = options.nowMs ?? Date.now();

  if (session.phase !== 'question_active' || currentQuestion.deadlineAtMs === undefined) {
    return buildRejectedAnswerResult(session, combatantSlot, submittedAnswer, nowMs, 'QUESTION_NOT_ACTIVE');
  }

  if (
    currentQuestion.pendingCorrectAnswer !== undefined &&
    nowMs > currentQuestion.pendingCorrectAnswer.receivedAtMs + SAME_TIME_DRAW_WINDOW_MS
  ) {
    finalizePendingCorrectAnswer(session, currentQuestion.pendingCorrectAnswer.receivedAtMs + SAME_TIME_DRAW_WINDOW_MS);
  }

  if (currentQuestion.resolvedAtMs !== undefined) {
    return buildRejectedAnswerResult(session, combatantSlot, submittedAnswer, nowMs, 'DUPLICATE_ACTION');
  }

  if (nowMs > currentQuestion.deadlineAtMs) {
    return buildRejectedAnswerResult(session, combatantSlot, submittedAnswer, nowMs, 'ANSWER_AFTER_TIMEOUT');
  }

  const combatant = session.combatants[combatantSlot];
  if (hasAnswerBlockingStatus(combatant, nowMs)) {
    return buildRejectedAnswerResult(session, combatantSlot, submittedAnswer, nowMs, 'ACTION_LOCKED_OUT');
  }

  const validation = validateAnswer(currentQuestion.question, submittedAnswer);
  combatant.submittedAttempts += 1;

  if (validation.isCorrect) {
    combatant.correctAnswers += 1;
  }

  const result: SubmittedAnswerResult = {
    combatantSlot,
    isCorrect: validation.isCorrect,
    normalizedSubmittedAnswer: validation.normalizedSubmittedAnswer,
    expectedAnswer: validation.expectedAnswer,
  };

  const events: LiveMatchEvent[] = [
    createEvent(session, 'answer.accepted', nowMs, {
      combatantSlot,
      isCorrect: validation.isCorrect,
      normalizedSubmittedAnswer: validation.normalizedSubmittedAnswer,
      expectedAnswer: validation.expectedAnswer,
    }),
  ];

  if (validation.isCorrect) {
    const drawResult = maybeTriggerDraw(session, currentQuestion, combatantSlot, nowMs);

    if (drawResult !== null) {
      result.drawTriggered = true;
      result.additionalDamageArmed = drawResult.additionalDamageArmed;
      events.push(drawResult.event);
      session.updatedAtMs = nowMs;

      return {
        session,
        value: result,
        events,
      };
    }

    if (currentQuestion.pendingCorrectAnswer === undefined) {
      const attackPower = captureAttackPower(currentQuestion, nowMs);
      currentQuestion.pendingCorrectAnswer = {
        combatantSlot,
        receivedAtMs: nowMs,
        attackPower,
      };
      result.attackPower = attackPower;
      result.pendingDrawWindowUntilMs = nowMs + SAME_TIME_DRAW_WINDOW_MS;
      session.updatedAtMs = nowMs;

      return {
        session,
        value: result,
        events,
      };
    }

    const attackResolution = applySuccessfulAttack(session, combatantSlot, currentQuestion, nowMs);

    result.attackPower = attackResolution.attackPower;
    result.streakMultiplier = attackResolution.streakMultiplier;
    result.damage = attackResolution.damage;
    result.targetCombatantSlot = attackResolution.targetCombatantSlot;
    result.blockedByDefend = attackResolution.blockedByDefend;
    result.usedRevenge = attackResolution.usedRevenge;
    if (attackResolution.additionalDamageApplied !== undefined) {
      result.additionalDamageApplied = attackResolution.additionalDamageApplied;
    }
    events.push(...attackResolution.events);
  } else {
    combatant.currentStreak = 0;
    addStatusEffect(combatant, 'missed', nowMs, nowMs + MISSED_LOCKOUT_MS);
    events.push(
      createEvent(session, 'missed', nowMs, {
        combatantSlot,
        lockoutMs: MISSED_LOCKOUT_MS,
        statusEndsAtMs: nowMs + MISSED_LOCKOUT_MS,
      }),
    );
  }

  session.updatedAtMs = nowMs;

  return {
    session,
    value: result,
    events,
  };
}

export function resolveQuestionTimeout(
  matchId: string,
  options: RuntimeActionOptions = {},
): LiveMatchResult<QuestionTimeoutResult | SubmittedAnswerResult> {
  const session = requireLiveMatchSession(matchId);
  const currentQuestion = requireCurrentQuestion(session);
  const nowMs = options.nowMs ?? Date.now();

  if (session.phase !== 'question_active' || currentQuestion.deadlineAtMs === undefined) {
    return {
      session,
      value: { timedOut: false, reason: 'QUESTION_NOT_ACTIVE' },
      events: [],
    };
  }

  if (currentQuestion.resolvedAtMs !== undefined) {
    return {
      session,
      value: { timedOut: false, reason: 'QUESTION_ALREADY_RESOLVED' },
      events: [],
    };
  }

  if (currentQuestion.pendingCorrectAnswer !== undefined) {
    return resolvePendingCorrectAnswer(matchId, options);
  }

  if (nowMs < currentQuestion.deadlineAtMs) {
    return {
      session,
      value: { timedOut: false, reason: 'QUESTION_TIMER_RUNNING' },
      events: [],
    };
  }

  currentQuestion.resolvedAtMs = nowMs;
  const additionalDamageCleared = clearAdditionalDamage(session);
  applyHpDamage(session.combatants.p1, SHOCK_DAMAGE);
  applyHpDamage(session.combatants.p2, SHOCK_DAMAGE);
  session.updatedAtMs = nowMs;
  const events: LiveMatchEvent[] = [];

  if (additionalDamageCleared !== undefined) {
    events.push(
      createEvent(session, 'tie_breaker.applied', nowMs, {
        additionalDamage: additionalDamageCleared,
        applied: false,
        reason: 'QUESTION_TIMEOUT',
      }),
    );
  }

  events.push(
    createEvent(session, 'shock.applied', nowMs, {
      shockDamage: SHOCK_DAMAGE,
      combatants: {
        p1: { hp: session.combatants.p1.hp },
        p2: { hp: session.combatants.p2.hp },
      },
    }),
  );

  const value: QuestionTimeoutResult = {
    timedOut: true,
    shockDamage: SHOCK_DAMAGE,
  };

  if (additionalDamageCleared !== undefined) {
    value.additionalDamageCleared = additionalDamageCleared;
  }

  return {
    session,
    value,
    events,
  };
}

export function resolvePendingCorrectAnswer(
  matchId: string,
  options: RuntimeActionOptions = {},
): LiveMatchResult<SubmittedAnswerResult | QuestionTimeoutResult> {
  const session = requireLiveMatchSession(matchId);
  const currentQuestion = requireCurrentQuestion(session);
  const nowMs = options.nowMs ?? Date.now();

  if (currentQuestion.pendingCorrectAnswer === undefined) {
    return {
      session,
      value: { timedOut: false, reason: 'NO_PENDING_CORRECT_ANSWER' },
      events: [],
    };
  }

  if (nowMs < currentQuestion.pendingCorrectAnswer.receivedAtMs + SAME_TIME_DRAW_WINDOW_MS) {
    return {
      session,
      value: { timedOut: false, reason: 'DRAW_WINDOW_RUNNING' },
      events: [],
    };
  }

  const result = finalizePendingCorrectAnswer(session, nowMs);

  return {
    session,
    value: result.value,
    events: result.events,
  };
}

export function endFightRound(
  matchId: string,
  options: RuntimeActionOptions = {},
): LiveMatchResult<FightRoundResult> {
  const session = requireLiveMatchSession(matchId);
  const nowMs = options.nowMs ?? Date.now();

  if (session.phase === 'ended') {
    throw new Error(`Live match session already ended: ${matchId}`);
  }

  if (session.currentQuestion?.pendingCorrectAnswer !== undefined) {
    finalizePendingCorrectAnswer(session, nowMs);
  }

  const roundOutcome = determineFightRoundOutcome(session);
  const winnerSlot = roundOutcome === 'p1_win' ? 'p1' : roundOutcome === 'p2_win' ? 'p2' : undefined;

  if (winnerSlot !== undefined) {
    session.roundWins[winnerSlot] += 1;
  } else {
    session.tiedRoundCount += 1;
  }

  const normalMatchWinnerSlot = getMatchWinnerSlot(session);
  const fallbackMatchWinnerSlot =
    options.endMatchAfterRound === true && winnerSlot !== undefined ? winnerSlot : undefined;
  const matchWinnerSlot = normalMatchWinnerSlot ?? fallbackMatchWinnerSlot;
  const mutualFinalRoundLoss = session.isFinalRound && winnerSlot === undefined;
  const matchEnded = matchWinnerSlot !== undefined || mutualFinalRoundLoss || options.endMatchAfterRound === true;

  if (!matchEnded && shouldEnterFinalRound(session)) {
    session.isFinalRound = true;
  }

  session.phase = matchEnded ? 'ended' : 'round_ended';
  session.updatedAtMs = nowMs;

  if (matchEnded) {
    session.finalOutcome = buildCompletedFinalOutcome(nowMs, matchWinnerSlot, mutualFinalRoundLoss);
  }

  const result: FightRoundResult = {
    roundNumber: session.roundNumber,
    outcome: mutualFinalRoundLoss ? 'mutual_loss' : roundOutcome,
    matchEnded,
    roundWins: { ...session.roundWins },
    tiedRoundCount: session.tiedRoundCount,
    isFinalRound: session.isFinalRound,
  };

  if (winnerSlot !== undefined) {
    result.winnerSlot = winnerSlot;
  }

  if (matchWinnerSlot !== undefined) {
    result.matchWinnerSlot = matchWinnerSlot;
  }

  if (mutualFinalRoundLoss) {
    result.mutualFinalRoundLoss = true;
  }

  const events: LiveMatchEvent[] = [
    createEvent(session, 'round.ended', nowMs, {
      ...result,
      combatants: {
        p1: { hp: session.combatants.p1.hp },
        p2: { hp: session.combatants.p2.hp },
      },
    }),
  ];

  if (matchEnded) {
    events.push(
      createEvent(session, 'match.ended', nowMs, {
        winnerSlot: matchWinnerSlot,
        mutualFinalRoundLoss,
        roundWins: { ...session.roundWins },
        tiedRoundCount: session.tiedRoundCount,
      }),
    );
  }

  return {
    session,
    value: result,
    events,
  };
}

export function finalizeMatchResult(
  matchId: string,
  options: RuntimeActionOptions = {},
): LiveMatchResult<FinalMatchResult> {
  const session = requireLiveMatchSession(matchId);
  const nowMs = options.nowMs ?? Date.now();

  if (session.phase !== 'ended') {
    throw new Error(`Live match session is not ended: ${matchId}`);
  }

  if (session.finalOutcome === undefined) {
    session.finalOutcome = buildCompletedFinalOutcome(nowMs, getMatchWinnerSlot(session), false);
  }

  const result = buildFinalMatchResult(session);
  session.updatedAtMs = nowMs;

  return {
    session,
    value: result,
    events: [
      createEvent(session, 'results.ready', nowMs, {
        result,
      }),
    ],
  };
}

export function pauseLiveMatchForReconnect(
  matchId: string,
  disconnectedSlot: CombatantSlot,
  options: RuntimeActionOptions = {},
): LiveMatchResult<ReconnectRuntimeState> {
  const session = requireLiveMatchSession(matchId);
  const nowMs = options.nowMs ?? Date.now();

  if (session.mode !== 'pvp') {
    throw new Error('Reconnect pause is only available for PvP matches.');
  }

  if (session.phase === 'ended') {
    throw new Error(`Live match session already ended: ${matchId}`);
  }

  if (session.phase === 'reconnect_paused' && session.reconnectState !== undefined) {
    return {
      session,
      value: session.reconnectState,
      events: [],
    };
  }

  if (session.phase === 'reconnect_paused') {
    throw new Error(`Live match reconnect state is missing: ${matchId}`);
  }

  const reconnectState: ReconnectRuntimeState = {
    status: 'reconnecting',
    disconnectedSlot,
    phaseBeforeReconnect: session.phase,
    startedAtMs: nowMs,
    deadlineAtMs: nowMs + RECONNECT_GRACE_MS,
  };

  session.phase = 'reconnect_paused';
  session.reconnectState = reconnectState;
  session.updatedAtMs = nowMs;

  return {
    session,
    value: reconnectState,
    events: [
      createEvent(session, 'reconnect.paused', nowMs, {
        disconnectedSlot,
        reconnectStartedAtMs: reconnectState.startedAtMs,
        reconnectDeadlineAtMs: reconnectState.deadlineAtMs,
        reconnectWindowMs: RECONNECT_GRACE_MS,
      }),
    ],
  };
}

export function markLiveMatchReconnectResumed(
  matchId: string,
  returningSlot: CombatantSlot,
  options: RuntimeActionOptions = {},
): LiveMatchResult<ReconnectRuntimeState> {
  const session = requireLiveMatchSession(matchId);
  const nowMs = options.nowMs ?? Date.now();
  const reconnectState = session.reconnectState;

  if (session.phase !== 'reconnect_paused' || reconnectState === undefined) {
    throw new Error(`Live match is not waiting for reconnect: ${matchId}`);
  }

  if (reconnectState.disconnectedSlot !== returningSlot) {
    throw new Error('Only the disconnected player can resume this reconnect pause.');
  }

  reconnectState.status = 'resuming';
  reconnectState.resumedAtMs = nowMs;
  reconnectState.resumeDeadlineAtMs = nowMs + RECONNECT_RESUME_COUNTDOWN_MS;
  session.updatedAtMs = nowMs;

  return {
    session,
    value: reconnectState,
    events: [
      createEvent(session, 'reconnect.resumed', nowMs, {
        returningSlot,
        resumedAtMs: reconnectState.resumedAtMs,
        resumeDeadlineAtMs: reconnectState.resumeDeadlineAtMs,
        resumeCountdownMs: RECONNECT_RESUME_COUNTDOWN_MS,
      }),
    ],
  };
}

// The disconnected player reconnected (status -> 'resuming') but dropped again
// before the "Get ready" countdown finished. Revert to 'reconnecting' with a
// fresh grace window rather than leaving the match with no pause and no
// active void timer (the resume-completion timer must be cancelled by the
// caller, since it lives outside this session's state).
export function revertReconnectResumeToReconnecting(
  matchId: string,
  options: RuntimeActionOptions = {},
): LiveMatchResult<ReconnectRuntimeState> {
  const session = requireLiveMatchSession(matchId);
  const nowMs = options.nowMs ?? Date.now();
  const reconnectState = session.reconnectState;

  if (session.phase !== 'reconnect_paused' || reconnectState === undefined || reconnectState.status !== 'resuming') {
    throw new Error(`Live match is not in reconnect resume countdown: ${matchId}`);
  }

  reconnectState.status = 'reconnecting';
  reconnectState.startedAtMs = nowMs;
  reconnectState.deadlineAtMs = nowMs + RECONNECT_GRACE_MS;
  delete reconnectState.resumedAtMs;
  delete reconnectState.resumeDeadlineAtMs;
  session.updatedAtMs = nowMs;

  return {
    session,
    value: reconnectState,
    events: [
      createEvent(session, 'reconnect.lost', nowMs, {
        disconnectedSlot: reconnectState.disconnectedSlot,
        deadlineAtMs: reconnectState.deadlineAtMs,
      }),
    ],
  };
}

export function completeLiveMatchReconnectResume(
  matchId: string,
  options: RuntimeActionOptions = {},
): LiveMatchResult<LiveMatchSession> {
  const session = requireLiveMatchSession(matchId);
  const nowMs = options.nowMs ?? Date.now();

  if (session.phase !== 'reconnect_paused' || session.reconnectState?.status !== 'resuming') {
    throw new Error(`Live match is not in reconnect resume countdown: ${matchId}`);
  }

  session.phase = 'question_constructing';
  delete session.reconnectState;
  delete session.currentQuestion;
  delete session.additionalDamage;
  session.updatedAtMs = nowMs;

  return {
    session,
    value: session,
    events: [],
  };
}

export function voidLiveMatchForReconnectFailure(
  matchId: string,
  options: RuntimeActionOptions & { dcSlot?: CombatantSlot; reason?: string } = {},
): LiveMatchResult<LiveMatchSession> {
  const session = requireLiveMatchSession(matchId);
  const nowMs = options.nowMs ?? Date.now();
  const dcSlot = options.dcSlot ?? session.reconnectState?.disconnectedSlot;
  const voidReason = options.reason ?? 'reconnect_timeout';

  if (session.phase === 'ended') {
    return {
      session,
      value: session,
      events: [],
    };
  }

  session.phase = 'ended';
  delete session.currentQuestion;
  delete session.additionalDamage;
  delete session.reconnectState;
  session.finalOutcome = buildVoidedFinalOutcome(nowMs, dcSlot, voidReason);
  session.updatedAtMs = nowMs;

  return {
    session,
    value: session,
    events: [
      createEvent(session, 'match.voided', nowMs, {
        dcSlot,
        voidReason,
      }),
      createEvent(session, 'match.ended', nowMs, {
        winnerSlot: undefined,
        mutualFinalRoundLoss: false,
        status: 'voided',
        dcSlot,
        voidReason,
      }),
    ],
  };
}

// ---------------------------------------------------------------------------
// 6. CPU opponent flow API
// ---------------------------------------------------------------------------
//
// Live Match asks CPU Opponent what it wants to do; Live Match remains the owner
// that will later apply that decision through the same answer/DEFEND rules used
// for human players.

export function requestCpuAction(
  matchId: string,
  options: CpuActionRequestOptions = {},
): LiveMatchResult<CpuActionDecision> {
  const session = requireLiveMatchSession(matchId);
  const currentQuestion = requireCurrentQuestion(session);
  const cpuOpponentKey = requireCpuOpponentKey(session);
  const nowMs = options.nowMs ?? Date.now();

  if (currentQuestion.startedAtMs === undefined || currentQuestion.deadlineAtMs === undefined) {
    throw new Error('CPU action requires an active question with timestamps.');
  }

  const cpu = session.combatants.p2;
  const player = session.combatants.p1;
  const cpuDecisionContext = {
    cpuKey: cpuOpponentKey,
    serverTimestampMs: nowMs,
    questionStartedAtMs: currentQuestion.startedAtMs,
    questionDeadlineMs: currentQuestion.deadlineAtMs,
    expectedAnswer: currentQuestion.question.expectedAnswer,
    cpuCanAnswer: !hasAnswerBlockingStatus(cpu, nowMs),
    cpuCanDefend: cpu.defendAvailable,
    cpuRevengeActive: cpu.revengeActive,
    playerAttackIncoming: options.playerAttackIncoming ?? false,
    playerIsLockedOut: options.playerIsLockedOut ?? hasAnswerBlockingStatus(player, nowMs),
  };

  if (options.cpuSuccessfulBlockThisQuestion !== undefined) {
    Object.assign(cpuDecisionContext, {
      cpuSuccessfulBlockThisQuestion: options.cpuSuccessfulBlockThisQuestion,
    });
  }

  if (options.rng !== undefined) {
    Object.assign(cpuDecisionContext, { rng: options.rng });
  }

  const decision = decideCpuAction(cpuDecisionContext);

  session.updatedAtMs = nowMs;

  return {
    session,
    value: decision,
    events: [
      createEvent(session, 'cpu.action.decided', nowMs, {
        cpuOpponentKey,
        decision,
      }),
    ],
  };
}

// ---------------------------------------------------------------------------
// 7. Session construction helpers
// ---------------------------------------------------------------------------

function createSecondCombatantState(
  options: CreateLiveMatchSessionOptions,
): CombatantRuntimeState {
  if (options.mode === 'pvc') {
    const cpuOpponentKey = options.cpuOpponentKey;
    if (cpuOpponentKey === undefined) {
      throw new Error('PvC live matches require a CPU opponent key.');
    }

    const cpuConfig = getCpuOpponentConfig(cpuOpponentKey);
    const cpuCombatantOptions: {
      slot: CombatantSlot;
      id: string;
      driver: CombatantDriver;
      hp?: number;
    } = {
      slot: 'p2',
      id: `cpu:${cpuOpponentKey}`,
      driver: 'cpu',
    };

    if (cpuConfig.hp !== undefined) {
      cpuCombatantOptions.hp = cpuConfig.hp;
    }

    const cpuCombatant = createCombatantState(cpuCombatantOptions);

    if (cpuConfig.revengeAlwaysActive === true) {
      cpuCombatant.revengeActive = true;
    }

    return cpuCombatant;
  }

  const p2CombatantId = options.p2CombatantId;
  if (p2CombatantId === undefined) {
    throw new Error('PvP live matches require a second player combatant.');
  }

  return createCombatantState({
    slot: 'p2',
    id: p2CombatantId,
    driver: 'human',
  });
}

function createCombatantState(options: {
  slot: CombatantSlot;
  id: string;
  driver: CombatantDriver;
  hp?: number;
}): CombatantRuntimeState {
  return {
    slot: options.slot,
    id: options.id,
    driver: options.driver,
    hp: options.hp ?? 100,
    maxHp: options.hp ?? 100,
    currentStreak: 0,
    longestStreak: 0,
    revengeBlocks: 0,
    revengeActive: false,
    defendAvailable: true,
    submittedAttempts: 0,
    correctAnswers: 0,
    statusEffects: [],
  };
}

function resetCombatantsForNextFightRound(session: LiveMatchSession): void {
  for (const combatant of Object.values(session.combatants)) {
    combatant.hp = combatant.maxHp;
    combatant.currentStreak = 0;
    combatant.revengeBlocks = 0;
    combatant.revengeActive = false;
    combatant.defendAvailable = true;
    combatant.statusEffects = [];
    delete combatant.revengeActivatesOnQuestionSequence;
    delete combatant.defendUnavailableUntilQuestionSequence;
  }
}

// ---------------------------------------------------------------------------
// 9. Question Generator and CPU Opponent handoff helpers
// ---------------------------------------------------------------------------

function ensureRoundQuestionConfig(
  session: LiveMatchSession,
  options: RuntimeActionOptions,
): RoundQuestionConfig {
  if (session.roundQuestionConfig !== undefined) {
    return session.roundQuestionConfig;
  }

  const selectionOptions: { mode: GameMode; rng?: RandomSource } = {
    mode: toQuestionGeneratorMode(session.mode),
  };

  if (options.rng !== undefined) {
    selectionOptions.rng = options.rng;
  }

  const roundQuestionConfig = selectRoundQuestionConfig(selectionOptions);
  session.roundQuestionConfig = roundQuestionConfig;
  return roundQuestionConfig;
}

function buildQuestionGenerationOptions(
  session: LiveMatchSession,
  roundQuestionConfig: RoundQuestionConfig,
  options: RuntimeActionOptions,
): QuestionGenerationOptions {
  const generationOptions: QuestionGenerationOptions = {
    mode: toQuestionGeneratorMode(session.mode),
    questionType: roundQuestionConfig.questionType,
    difficulty: roundQuestionConfig.difficulty,
  };

  if (options.rng !== undefined) {
    generationOptions.rng = options.rng;
  }

  if (options.forceDifficulty !== undefined) {
    generationOptions.forceDifficulty = options.forceDifficulty;
  }

  if (session.mode === 'pvc' && session.cpuOpponentKey !== undefined) {
    const pressure = getCpuQuestionPressure(session.cpuOpponentKey);

    if (pressure.cpuMediumQuestionChance !== undefined) {
      generationOptions.cpuMediumQuestionChance = pressure.cpuMediumQuestionChance;
    }
  }

  return generationOptions;
}

function toQuestionGeneratorMode(mode: LiveMatchMode): GameMode {
  return mode === 'pvp' ? 'pvp' : 'pvc';
}

// ---------------------------------------------------------------------------
// 10. Validation and event helpers
// ---------------------------------------------------------------------------

function buildRejectedAnswerResult(
  session: LiveMatchSession,
  combatantSlot: CombatantSlot,
  submittedAnswer: string,
  nowMs: number,
  reason: string,
): LiveMatchResult<SubmittedAnswerResult> {
  const currentQuestion = requireCurrentQuestion(session);
  const validation = validateAnswer(currentQuestion.question, submittedAnswer);
  const result: SubmittedAnswerResult = {
    combatantSlot,
    isCorrect: false,
    normalizedSubmittedAnswer: validation.normalizedSubmittedAnswer,
    expectedAnswer: validation.expectedAnswer,
  };

  session.updatedAtMs = nowMs;

  return {
    session,
    value: result,
    events: [
      createEvent(session, 'answer.rejected', nowMs, {
        combatantSlot,
        reason,
        normalizedSubmittedAnswer: validation.normalizedSubmittedAnswer,
        expectedAnswer: validation.expectedAnswer,
      }),
    ],
  };
}

function buildRejectedDefendResult(
  session: LiveMatchSession,
  combatantSlot: CombatantSlot,
  nowMs: number,
  reason: string,
): LiveMatchResult<DefendActivationResult> {
  session.updatedAtMs = nowMs;

  return {
    session,
    value: {
      combatantSlot,
      accepted: false,
      reason,
    },
    events: [
      createEvent(session, 'answer.rejected', nowMs, {
        combatantSlot,
        action: 'defend.activate',
        reason,
      }),
    ],
  };
}

function createEvent(
  session: LiveMatchSession,
  name: LiveMatchEventName,
  serverTimestampMs: number,
  payload: Record<string, unknown>,
): LiveMatchEvent {
  return {
    name,
    matchId: session.matchId,
    roomId: session.roomId,
    serverTimestampMs,
    payload,
  };
}

function hasAnswerBlockingStatus(combatant: CombatantRuntimeState, nowMs: number): boolean {
  return combatant.statusEffects.some(
    (effect) =>
      (effect.type === 'missed' || effect.type === 'defend' || effect.type === 'stunned') &&
      effect.endsAtMs > nowMs,
  );
}

// DEFEND has a looser gate than answering: only a hard `stunned` (earned by
// attacking into a shield) blocks it. A wrong-answer `missed` recovery stops
// your answering but leaves your guard up, so a slip doesn't also strip your
// ability to protect yourself.
function hasDefendBlockingStatus(combatant: CombatantRuntimeState, nowMs: number): boolean {
  return combatant.statusEffects.some(
    (effect) => effect.type === 'stunned' && effect.endsAtMs > nowMs,
  );
}

// ---------------------------------------------------------------------------
// 11. Combat resolution helpers
// ---------------------------------------------------------------------------

function applySuccessfulAttack(
  session: LiveMatchSession,
  attackerSlot: CombatantSlot,
  currentQuestion: LiveQuestionRuntimeState,
  nowMs: number,
  attackPowerOverride?: number,
): {
  attackPower: number;
  streakMultiplier: number;
  damage: number;
  targetCombatantSlot: CombatantSlot;
  blockedByDefend: boolean;
  usedRevenge: boolean;
  additionalDamageApplied?: number;
  events: LiveMatchEvent[];
} {
  const attacker = session.combatants[attackerSlot];
  const targetCombatantSlot = getOpponentSlot(attackerSlot);
  const target = session.combatants[targetCombatantSlot];
  const attackPower = attackPowerOverride ?? captureAttackPower(currentQuestion, nowMs);
  const usedRevenge = attacker.revengeActive;
  const activeDefend = getActiveStatusEffect(target, 'defend', nowMs);
  // Only a landing attack advances the streak. A blocked attack must not count
  // toward currentStreak OR longestStreak — it just resets the streak (below),
  // so we read the would-be multiplier without mutating.
  const streakMultiplier = usedRevenge
    ? 1
    : activeDefend !== undefined
      ? streakMultiplierFor(attacker.currentStreak + 1)
      : advanceStreakAndGetMultiplier(attacker);
  const baseDamage = usedRevenge
    ? roundCombatNumber(attackPower * 2)
    : roundCombatNumber(attackPower * streakMultiplier);
  const additionalDamage = clearAdditionalDamage(session);
  const damage = roundCombatNumber(baseDamage + (additionalDamage ?? 0));
  const events: LiveMatchEvent[] = [];

  currentQuestion.resolvedAtMs = nowMs;
  currentQuestion.correctAnswerSlot = attackerSlot;

  if (additionalDamage !== undefined) {
    events.push(
      createEvent(session, 'tie_breaker.applied', nowMs, {
        attackerSlot,
        targetCombatantSlot,
        additionalDamage,
        applied: activeDefend === undefined,
      }),
    );
  }

  if (activeDefend !== undefined) {
    attacker.currentStreak = 0;
    consumeRevengeIfNeeded(session, attackerSlot);
    addStatusEffect(attacker, 'stunned', nowMs, nowMs + STUN_LOCKOUT_MS);

    events.push(
      createEvent(session, 'defend.blocked', nowMs, {
        attackerSlot,
        defenderSlot: targetCombatantSlot,
        blockedDamage: damage,
        baseDamage,
        additionalDamage,
        attackPower,
        streakMultiplier,
        usedRevenge,
        defendEndsAtMs: activeDefend.endsAtMs,
      }),
      createEvent(session, 'stun.applied', nowMs, {
        combatantSlot: attackerSlot,
        stunnedBySlot: targetCombatantSlot,
        stunMs: STUN_LOCKOUT_MS,
        stunEndsAtMs: nowMs + STUN_LOCKOUT_MS,
      }),
    );

    const blockedResult: {
      attackPower: number;
      streakMultiplier: number;
      damage: number;
      targetCombatantSlot: CombatantSlot;
      blockedByDefend: boolean;
      usedRevenge: boolean;
      additionalDamageApplied?: number;
      events: LiveMatchEvent[];
    } = {
      attackPower,
      streakMultiplier,
      damage: 0,
      targetCombatantSlot,
      blockedByDefend: true,
      usedRevenge,
      events,
    };

    if (additionalDamage !== undefined) {
      blockedResult.additionalDamageApplied = additionalDamage;
    }

    return blockedResult;
  }

  applyHpDamage(target, damage);
  // Losing the exchange (taking a hit) breaks the victim's correct-answer streak.
  target.currentStreak = 0;
  consumeRevengeIfNeeded(session, attackerSlot);
  const revengeGaugeEvent = applyIncomingHitRevengeProgress(
    session,
    targetCombatantSlot,
    currentQuestion.sequence,
    nowMs,
  );
  const damageEventName: LiveMatchEventName = usedRevenge
    ? 'revenge.attack_landed'
    : 'attack.landed';
  events.push(
    createEvent(session, damageEventName, nowMs, {
      attackerSlot,
      targetCombatantSlot,
      attackPower,
      streakMultiplier,
      baseDamage,
      additionalDamage,
      damage,
      targetHp: target.hp,
      attackerStreak: attacker.currentStreak,
      attackerLongestStreak: attacker.longestStreak,
      usedRevenge,
    }),
  );

  if (revengeGaugeEvent !== null) {
    events.push(revengeGaugeEvent);
  }

  const landedResult: {
    attackPower: number;
    streakMultiplier: number;
    damage: number;
    targetCombatantSlot: CombatantSlot;
    blockedByDefend: boolean;
    usedRevenge: boolean;
    additionalDamageApplied?: number;
    events: LiveMatchEvent[];
  } = {
    attackPower,
    streakMultiplier,
    damage,
    targetCombatantSlot,
    blockedByDefend: false,
    usedRevenge,
    events,
  };

  if (additionalDamage !== undefined) {
    landedResult.additionalDamageApplied = additionalDamage;
  }

  return landedResult;
}

function refreshDefendAvailabilityForQuestion(session: LiveMatchSession): void {
  for (const combatant of Object.values(session.combatants)) {
    if (
      combatant.defendUnavailableUntilQuestionSequence === undefined ||
      session.questionSequence > combatant.defendUnavailableUntilQuestionSequence
    ) {
      combatant.defendAvailable = true;
      delete combatant.defendUnavailableUntilQuestionSequence;
    }
  }
}

function maybeTriggerDraw(
  session: LiveMatchSession,
  currentQuestion: LiveQuestionRuntimeState,
  combatantSlot: CombatantSlot,
  nowMs: number,
): { additionalDamageArmed: number; event: LiveMatchEvent } | null {
  const pendingCorrectAnswer = currentQuestion.pendingCorrectAnswer;

  if (pendingCorrectAnswer === undefined) {
    return null;
  }

  if (pendingCorrectAnswer.combatantSlot === combatantSlot) {
    return null;
  }

  const receivedWithinDrawWindow =
    Math.abs(nowMs - pendingCorrectAnswer.receivedAtMs) <= SAME_TIME_DRAW_WINDOW_MS;

  if (!receivedWithinDrawWindow) {
    return null;
  }

  const additionalDamageArmed = captureAttackPower(currentQuestion, nowMs);

  currentQuestion.resolvedAtMs = nowMs;
  delete currentQuestion.pendingCorrectAnswer;
  session.additionalDamage = {
    damage: additionalDamageArmed,
    armedFromQuestionSequence: currentQuestion.sequence,
  };

  return {
    additionalDamageArmed,
    event: createEvent(session, 'draw.triggered', nowMs, {
      combatantSlots: [pendingCorrectAnswer.combatantSlot, combatantSlot],
      additionalDamageArmed,
      armedFromQuestionSequence: currentQuestion.sequence,
    }),
  };
}

function finalizePendingCorrectAnswer(
  session: LiveMatchSession,
  nowMs: number,
): LiveMatchResult<SubmittedAnswerResult> {
  const currentQuestion = requireCurrentQuestion(session);
  const pendingCorrectAnswer = currentQuestion.pendingCorrectAnswer;

  if (pendingCorrectAnswer === undefined) {
    throw new Error(`Live match session has no pending correct answer: ${session.matchId}`);
  }

  delete currentQuestion.pendingCorrectAnswer;

  const attackResolution = applySuccessfulAttack(
    session,
    pendingCorrectAnswer.combatantSlot,
    currentQuestion,
    nowMs,
    pendingCorrectAnswer.attackPower,
  );

  session.updatedAtMs = nowMs;

  const value: SubmittedAnswerResult = {
    combatantSlot: pendingCorrectAnswer.combatantSlot,
    isCorrect: true,
    normalizedSubmittedAnswer: currentQuestion.question.expectedAnswer,
    expectedAnswer: currentQuestion.question.expectedAnswer,
    attackPower: attackResolution.attackPower,
    streakMultiplier: attackResolution.streakMultiplier,
    damage: attackResolution.damage,
    targetCombatantSlot: attackResolution.targetCombatantSlot,
    blockedByDefend: attackResolution.blockedByDefend,
    usedRevenge: attackResolution.usedRevenge,
  };

  if (attackResolution.additionalDamageApplied !== undefined) {
    value.additionalDamageApplied = attackResolution.additionalDamageApplied;
  }

  return {
    session,
    value,
    events: attackResolution.events,
  };
}

function clearAdditionalDamage(session: LiveMatchSession): number | undefined {
  const additionalDamage = session.additionalDamage?.damage;
  delete session.additionalDamage;
  return additionalDamage;
}

function buildCompletedFinalOutcome(
  endedAtMs: number,
  winnerSlot: CombatantSlot | undefined,
  mutualFinalRoundLoss: boolean,
): LiveMatchFinalOutcomeState {
  const outcome: LiveMatchFinalOutcomeState = {
    status: 'completed',
    endedAtMs,
    mutualFinalRoundLoss,
  };

  if (winnerSlot !== undefined) {
    outcome.winnerSlot = winnerSlot;
  }

  return outcome;
}

function buildVoidedFinalOutcome(
  endedAtMs: number,
  dcSlot: CombatantSlot | undefined,
  voidReason: string,
): LiveMatchFinalOutcomeState {
  const outcome: LiveMatchFinalOutcomeState = {
    status: 'voided',
    endedAtMs,
    mutualFinalRoundLoss: false,
    voidReason,
  };

  if (dcSlot !== undefined) {
    outcome.dcSlot = dcSlot;
  }

  return outcome;
}

function buildFinalMatchResult(session: LiveMatchSession): FinalMatchResult {
  const finalOutcome = requireFinalOutcome(session);
  const result: FinalMatchResult = {
    matchId: session.matchId,
    roomId: session.roomId,
    mode: session.mode,
    status: finalOutcome.status,
    startedAtMs: session.createdAtMs,
    endedAtMs: finalOutcome.endedAtMs,
    mutualFinalRoundLoss: finalOutcome.mutualFinalRoundLoss,
    roundWins: { ...session.roundWins },
    tiedRoundCount: session.tiedRoundCount,
    combatants: {
      p1: buildCombatantResultSummary(session, 'p1', finalOutcome.winnerSlot),
      p2: buildCombatantResultSummary(session, 'p2', finalOutcome.winnerSlot),
    },
  };

  if (finalOutcome.winnerSlot !== undefined) {
    result.winnerSlot = finalOutcome.winnerSlot;
    result.winnerCombatantId = session.combatants[finalOutcome.winnerSlot].id;
  }

  if (finalOutcome.dcSlot !== undefined) {
    result.dcCombatantId = session.combatants[finalOutcome.dcSlot].id;
  }

  if (finalOutcome.voidReason !== undefined) {
    result.voidReason = finalOutcome.voidReason;
  }

  if (session.cpuOpponentKey !== undefined) {
    result.cpuOpponentKey = session.cpuOpponentKey;
  }

  if (session.mode === 'pvc') {
    result.pvcPlayerWon = finalOutcome.winnerSlot === 'p1';
  }

  return result;
}

function buildCombatantResultSummary(
  session: LiveMatchSession,
  combatantSlot: CombatantSlot,
  winnerSlot: CombatantSlot | undefined,
): CombatantResultSummary {
  const combatant = session.combatants[combatantSlot];

  return {
    slot: combatantSlot,
    combatantId: combatant.id,
    driver: combatant.driver,
    hp: combatant.hp,
    correctAnswers: combatant.correctAnswers,
    submittedAttempts: combatant.submittedAttempts,
    accuracy: calculateAccuracy(combatant),
    longestStreak: combatant.longestStreak,
    auraGain: calculateRuntimeAuraGain(session, combatantSlot, winnerSlot),
  };
}

function calculateAccuracy(combatant: CombatantRuntimeState): number {
  if (combatant.submittedAttempts === 0) {
    return 0;
  }

  return roundCombatNumber(combatant.correctAnswers / combatant.submittedAttempts);
}

function calculateRuntimeAuraGain(
  session: LiveMatchSession,
  combatantSlot: CombatantSlot,
  winnerSlot: CombatantSlot | undefined,
): number {
  if (session.mode !== 'pvp') {
    return 0;
  }

  if (session.finalOutcome?.status === 'voided') {
    return 0;
  }

  const combatant = session.combatants[combatantSlot];
  const winBonus = winnerSlot === combatantSlot ? 50 : 0;

  return winBonus + combatant.correctAnswers * 10;
}

function determineFightRoundOutcome(session: LiveMatchSession): FightRoundOutcome {
  const p1Hp = session.combatants.p1.hp;
  const p2Hp = session.combatants.p2.hp;

  if (p1Hp > p2Hp) {
    return 'p1_win';
  }

  if (p2Hp > p1Hp) {
    return 'p2_win';
  }

  return 'tie';
}

function getMatchWinnerSlot(session: LiveMatchSession): CombatantSlot | undefined {
  if (session.roundWins.p1 >= FIGHT_ROUND_WINS_TO_WIN_MATCH) {
    return 'p1';
  }

  if (session.roundWins.p2 >= FIGHT_ROUND_WINS_TO_WIN_MATCH) {
    return 'p2';
  }

  return undefined;
}

function shouldEnterFinalRound(session: LiveMatchSession): boolean {
  if (session.isFinalRound) {
    return false;
  }

  if (getMatchWinnerSlot(session) !== undefined) {
    return false;
  }

  return session.roundNumber >= NORMAL_ROUNDS_BEFORE_FINAL;
}

function refreshRevengeActivationForQuestion(
  session: LiveMatchSession,
  nowMs: number,
): LiveMatchEvent[] {
  const events: LiveMatchEvent[] = [];

  for (const combatant of Object.values(session.combatants)) {
    if (
      combatant.revengeActivatesOnQuestionSequence !== undefined &&
      session.questionSequence >= combatant.revengeActivatesOnQuestionSequence
    ) {
      combatant.revengeActive = true;
      delete combatant.revengeActivatesOnQuestionSequence;
      events.push(
        createEvent(session, 'revenge.activated', nowMs, {
          combatantSlot: combatant.slot,
          revengeBlocks: combatant.revengeBlocks,
          questionSequence: session.questionSequence,
        }),
      );
    }
  }

  return events;
}

function applyIncomingHitRevengeProgress(
  session: LiveMatchSession,
  defenderSlot: CombatantSlot,
  currentQuestionSequence: number,
  nowMs: number,
): LiveMatchEvent | null {
  const defender = session.combatants[defenderSlot];

  if (defender.revengeActive || isPermanentRevengeCombatant(session, defenderSlot)) {
    return null;
  }

  const requiredBlocks = getRevengeBlocksRequired(session, defenderSlot);
  defender.revengeBlocks = Math.min(defender.revengeBlocks + 1, requiredBlocks);

  if (defender.revengeBlocks >= requiredBlocks) {
    defender.revengeActivatesOnQuestionSequence = currentQuestionSequence + 1;
  }

  return createEvent(session, 'revenge.gauge_changed', nowMs, {
    combatantSlot: defenderSlot,
    revengeBlocks: defender.revengeBlocks,
    revengeBlocksRequired: requiredBlocks,
    activatesOnQuestionSequence: defender.revengeActivatesOnQuestionSequence,
  });
}

function consumeRevengeIfNeeded(session: LiveMatchSession, combatantSlot: CombatantSlot): void {
  const combatant = session.combatants[combatantSlot];

  if (!combatant.revengeActive || isPermanentRevengeCombatant(session, combatantSlot)) {
    return;
  }

  combatant.revengeActive = false;
  combatant.revengeBlocks = 0;
  combatant.currentStreak = 0;
  delete combatant.revengeActivatesOnQuestionSequence;
}

function getRevengeBlocksRequired(session: LiveMatchSession, combatantSlot: CombatantSlot): number {
  if (session.mode === 'pvc' && combatantSlot === 'p2' && session.cpuOpponentKey !== undefined) {
    return getCpuOpponentConfig(session.cpuOpponentKey).revengeBlocksRequired ?? DEFAULT_REVENGE_BLOCKS_REQUIRED;
  }

  return DEFAULT_REVENGE_BLOCKS_REQUIRED;
}

function isPermanentRevengeCombatant(
  session: LiveMatchSession,
  combatantSlot: CombatantSlot,
): boolean {
  return (
    session.mode === 'pvc' &&
    combatantSlot === 'p2' &&
    session.cpuOpponentKey !== undefined &&
    getCpuOpponentConfig(session.cpuOpponentKey).revengeAlwaysActive === true
  );
}

function getActiveStatusEffect(
  combatant: CombatantRuntimeState,
  type: StatusEffectType,
  nowMs: number,
): StatusEffectState | undefined {
  return combatant.statusEffects.find(
    (effect) => effect.type === type && effect.startedAtMs <= nowMs && effect.endsAtMs > nowMs,
  );
}

function captureAttackPower(currentQuestion: LiveQuestionRuntimeState, nowMs: number): number {
  if (currentQuestion.startedAtMs === undefined) {
    return MIN_ATTACK_POWER;
  }

  const elapsedMs = Math.max(0, nowMs - currentQuestion.startedAtMs);

  if (elapsedMs >= ATTACK_POWER_RAMP_MS) {
    return MAX_ATTACK_POWER;
  }

  const rampProgress = elapsedMs / ATTACK_POWER_RAMP_MS;
  return roundCombatNumber(MIN_ATTACK_POWER + rampProgress * (MAX_ATTACK_POWER - MIN_ATTACK_POWER));
}

function advanceStreakAndGetMultiplier(combatant: CombatantRuntimeState): number {
  combatant.currentStreak += 1;
  combatant.longestStreak = Math.max(combatant.longestStreak, combatant.currentStreak);

  return streakMultiplierFor(combatant.currentStreak);
}

// Damage multiplier for a given streak length (+10% per landed hit, capped 1.5×).
// Pure — does not mutate combatant state.
function streakMultiplierFor(streak: number): number {
  return roundCombatNumber(Math.min(1 + streak * 0.1, 1.5));
}

function addStatusEffect(
  combatant: CombatantRuntimeState,
  type: StatusEffectType,
  startedAtMs: number,
  endsAtMs: number,
): void {
  combatant.statusEffects = [
    ...combatant.statusEffects.filter((effect) => effect.endsAtMs > startedAtMs),
    { type, startedAtMs, endsAtMs },
  ];
}

function applyHpDamage(combatant: CombatantRuntimeState, damage: number): void {
  combatant.hp = roundCombatNumber(Math.max(0, combatant.hp - damage));
}

function getOpponentSlot(slot: CombatantSlot): CombatantSlot {
  return slot === 'p1' ? 'p2' : 'p1';
}

function roundCombatNumber(value: number): number {
  return Math.round(value * 100) / 100;
}

// ---------------------------------------------------------------------------
// 12. Required-state helpers
// ---------------------------------------------------------------------------

function requireLiveMatchSession(matchId: string): LiveMatchSession {
  const session = liveMatchSessions.get(matchId);

  if (session === undefined) {
    throw new Error(`Live match session not found: ${matchId}`);
  }

  return session;
}

function requireCurrentQuestion(session: LiveMatchSession): LiveQuestionRuntimeState {
  if (session.currentQuestion === undefined) {
    throw new Error(`Live match session has no current question: ${session.matchId}`);
  }

  return session.currentQuestion;
}

function requireCpuOpponentKey(session: LiveMatchSession): CpuOpponentKey {
  if (session.mode !== 'pvc' || session.cpuOpponentKey === undefined) {
    throw new Error('CPU actions are only available for PvC live match sessions.');
  }

  return session.cpuOpponentKey;
}

function requireFinalOutcome(session: LiveMatchSession): LiveMatchFinalOutcomeState {
  if (session.finalOutcome === undefined) {
    throw new Error(`Live match session has no final outcome: ${session.matchId}`);
  }

  return session.finalOutcome;
}
