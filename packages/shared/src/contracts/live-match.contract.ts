import type {
  CombatantDriver,
  CombatantSlot,
  CpuOpponentKey,
  LiveMatchMode,
} from './common.contract';
import type {
  GeneratedQuestionContract,
  RoundQuestionConfigContract,
} from './question-generator.contract';

// ---------------------------------------------------------------------------
// Live Match contract
// ---------------------------------------------------------------------------
//
// These shapes describe the active-match runtime boundary. The backend owns the
// truth; frontend code receives events and sends actions through Socket.IO.

export type LiveMatchPhase =
  | 'created'
  | 'round_prep'
  | 'question_constructing'
  | 'question_active'
  | 'round_ended'
  | 'reconnect_paused'
  | 'ended';

export type StatusEffectType = 'missed' | 'defend' | 'stunned';

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
  | 'match.voided'
  | 'match.ended'
  | 'results.ready';

export interface StatusEffectContract {
  type: StatusEffectType;
  startedAtMs: number;
  endsAtMs: number;
}

export interface CombatantRuntimeContract {
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
  statusEffects: readonly StatusEffectContract[];
}

export interface PendingCorrectAnswerContract {
  combatantSlot: CombatantSlot;
  receivedAtMs: number;
  attackPower: number;
}

export interface LiveQuestionRuntimeContract {
  sequence: number;
  question: GeneratedQuestionContract;
  constructedAtMs: number;
  startedAtMs?: number;
  deadlineAtMs?: number;
  resolvedAtMs?: number;
  correctAnswerSlot?: CombatantSlot;
  pendingCorrectAnswer?: PendingCorrectAnswerContract;
}

export interface AdditionalDamageContract {
  damage: number;
  armedFromQuestionSequence: number;
}

export interface ReconnectRuntimeContract {
  status: 'reconnecting' | 'resuming';
  disconnectedSlot: CombatantSlot;
  phaseBeforeReconnect: Exclude<LiveMatchPhase, 'reconnect_paused' | 'ended'>;
  startedAtMs: number;
  deadlineAtMs: number;
  resumedAtMs?: number;
  resumeDeadlineAtMs?: number;
}

export interface LiveMatchSessionContract {
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
  combatants: Record<CombatantSlot, CombatantRuntimeContract>;
  roundQuestionConfig?: RoundQuestionConfigContract;
  currentQuestion?: LiveQuestionRuntimeContract;
  additionalDamage?: AdditionalDamageContract;
  reconnectState?: ReconnectRuntimeContract;
  finalOutcome?: LiveMatchFinalOutcomeContract;
  cpuOpponentKey?: CpuOpponentKey;
}

export interface LiveMatchFinalOutcomeContract {
  status: 'completed' | 'voided';
  endedAtMs: number;
  winnerSlot?: CombatantSlot;
  mutualFinalRoundLoss: boolean;
  dcSlot?: CombatantSlot;
  voidReason?: string;
}

export interface LiveMatchEventContract {
  name: LiveMatchEventName;
  matchId: string;
  roomId: string;
  serverTimestampMs: number;
  payload: Record<string, unknown>;
}

export interface CreateLiveMatchSessionRequest {
  matchId: string;
  roomId: string;
  mode: LiveMatchMode;
  p1CombatantId: string;
  p2CombatantId?: string;
  cpuOpponentKey?: CpuOpponentKey;
}

export interface AnswerSubmitAction {
  action: 'answer.submit';
  matchId: string;
  playerId: string;
  displayedAnswer: string;
}

export interface DefendActivateAction {
  action: 'defend.activate';
  matchId: string;
  playerId: string;
}

export type LiveMatchClientAction = AnswerSubmitAction | DefendActivateAction;
