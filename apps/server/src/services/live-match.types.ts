import type { CpuOpponentKey } from '../config/cpu-opponents.config';
import type {
  Difficulty,
  GeneratedQuestion,
  RandomSource,
  RoundQuestionConfig,
} from './question-generator.service';

// ---------------------------------------------------------------------------
// Public live match state types
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
