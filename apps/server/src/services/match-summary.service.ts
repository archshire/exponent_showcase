import type {
  CombatantResultSummary,
  CombatantSlot,
  FinalMatchResult,
  LiveMatchMode,
} from './live-match.service';
import type { CpuOpponentKey } from '../config/cpu-opponents.config';

// ---------------------------------------------------------------------------
// Match Summary Service
// ---------------------------------------------------------------------------
//
// This module owns the post-match handoff after Live Match has already decided
// the authoritative combat result.
//
// It is the backend coordination layer between:
// - Live Match final result payloads.
// - Future PostgreSQL persistence writes.
// - Results-page display payloads.
// - Future CPU unlock/progression rules.
//
// It should not resolve answers, calculate active HP, run timers, decide CPU
// actions, emit Socket.IO events directly, or render Excalibur presentation.
//
// Post-match lifecycle map:
// 1. Live Match ends a PvP or PvC match.
// 2. Live Match calls `finalizeMatchResult` and produces `FinalMatchResult`.
// 3. `buildMatchSummaryHandoff` validates the final result.
// 4. Match Summary prepares the PostgreSQL persistence plan:
//    PvP -> `pvp_matches` row + Aura profile updates.
//    PvC -> CPU progress update when the human player wins.
// 5. Match Summary prepares the results-page payload.
// 6. Future repository/database code performs the actual transaction.
// 7. Runtime match state can be discarded after players leave results flow.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// 1. Public post-match types
// ---------------------------------------------------------------------------

export type MatchSummaryStatus = 'completed' | 'voided';

export type PlayerResultLabel = 'win' | 'loss' | 'mutual_loss' | 'voided';

export interface BuildMatchSummaryOptions {
  isPrivateMatch?: boolean;
  dcPlayerId?: string;
  voidReason?: string;
  nowMs?: number;
}

export interface PvpMatchPersistenceDraft {
  matchId: string;
  isPrivateMatch: boolean;
  status: MatchSummaryStatus;
  p1PlayerId: string;
  p2PlayerId: string;
  winnerPlayerId?: string;
  dcPlayerId?: string;
  voidReason?: string;
  startedAt: Date;
  endedAt: Date;
}

export interface AuraProfileUpdateDraft {
  playerId: string;
  auraGain: number;
}

export interface CpuProgressUpdateDraft {
  playerId: string;
  cpuKey: CpuOpponentKey;
  winIncrement: number;
  unlockEvaluationRequired: boolean;
  updatedAt: Date;
}

export interface MatchSummaryPersistencePlan {
  mode: LiveMatchMode;
  pvpMatch?: PvpMatchPersistenceDraft;
  auraUpdates: AuraProfileUpdateDraft[];
  cpuProgressUpdate?: CpuProgressUpdateDraft;
}

export interface ResultsCombatantSummary {
  slot: CombatantSlot;
  combatantId: string;
  result: PlayerResultLabel;
  hp: number;
  correctAnswers: number;
  submittedAttempts: number;
  accuracy: number;
  longestStreak: number;
  auraGain: number;
}

export interface ResultsPagePayload {
  matchId: string;
  roomId: string;
  mode: LiveMatchMode;
  status: MatchSummaryStatus;
  winnerCombatantId?: string;
  mutualFinalRoundLoss: boolean;
  roundWins: Record<CombatantSlot, number>;
  tiedRoundCount: number;
  combatants: Record<CombatantSlot, ResultsCombatantSummary>;
  cpuOpponentKey?: CpuOpponentKey;
  pvcPlayerWon?: boolean;
}

export interface MatchSummaryHandoff {
  matchId: string;
  status: MatchSummaryStatus;
  persistencePlan: MatchSummaryPersistencePlan;
  resultsPayload: ResultsPagePayload;
}

export interface MatchSummaryRepository {
  writePvpMatch(match: PvpMatchPersistenceDraft): Promise<void>;
  applyAuraUpdates(updates: AuraProfileUpdateDraft[]): Promise<void>;
  applyCpuProgressUpdate(update: CpuProgressUpdateDraft): Promise<void>;
}

export interface PersistMatchSummaryResult {
  handoff: MatchSummaryHandoff;
  persisted: {
    pvpMatch: boolean;
    auraUpdates: boolean;
    cpuProgressUpdate: boolean;
  };
}

// ---------------------------------------------------------------------------
// 2. Main handoff API
// ---------------------------------------------------------------------------

export function buildMatchSummaryHandoff(
  finalResult: FinalMatchResult,
  options: BuildMatchSummaryOptions = {},
): MatchSummaryHandoff {
  validateFinalResult(finalResult);

  const persistencePlan = buildPersistencePlan(finalResult, options);
  const resultsPayload = buildResultsPagePayload(finalResult);

  return {
    matchId: finalResult.matchId,
    status: finalResult.status,
    persistencePlan,
    resultsPayload,
  };
}

export async function persistMatchSummary(
  handoff: MatchSummaryHandoff,
  repository: MatchSummaryRepository,
): Promise<PersistMatchSummaryResult> {
  const persisted = {
    pvpMatch: false,
    auraUpdates: false,
    cpuProgressUpdate: false,
  };

  if (handoff.persistencePlan.pvpMatch !== undefined) {
    await repository.writePvpMatch(handoff.persistencePlan.pvpMatch);
    persisted.pvpMatch = true;
  }

  if (handoff.persistencePlan.auraUpdates.length > 0) {
    await repository.applyAuraUpdates(handoff.persistencePlan.auraUpdates);
    persisted.auraUpdates = true;
  }

  if (handoff.persistencePlan.cpuProgressUpdate !== undefined) {
    await repository.applyCpuProgressUpdate(handoff.persistencePlan.cpuProgressUpdate);
    persisted.cpuProgressUpdate = true;
  }

  return {
    handoff,
    persisted,
  };
}

// ---------------------------------------------------------------------------
// 3. Persistence-plan builders
// ---------------------------------------------------------------------------

function buildPersistencePlan(
  finalResult: FinalMatchResult,
  options: BuildMatchSummaryOptions,
): MatchSummaryPersistencePlan {
  if (finalResult.mode === 'pvp') {
    return buildPvpPersistencePlan(finalResult, options);
  }

  return buildPvcPersistencePlan(finalResult, options);
}

function buildPvpPersistencePlan(
  finalResult: FinalMatchResult,
  options: BuildMatchSummaryOptions,
): MatchSummaryPersistencePlan {
  const p1 = finalResult.combatants.p1;
  const p2 = finalResult.combatants.p2;
  const pvpMatch = buildPvpMatchDraft(finalResult, p1, p2, options);

  return {
    mode: 'pvp',
    pvpMatch,
    auraUpdates: [
      {
        playerId: p1.combatantId,
        auraGain: p1.auraGain,
      },
      {
        playerId: p2.combatantId,
        auraGain: p2.auraGain,
      },
    ],
  };
}

function buildPvcPersistencePlan(
  finalResult: FinalMatchResult,
  options: BuildMatchSummaryOptions,
): MatchSummaryPersistencePlan {
  const cpuProgressUpdate = buildCpuProgressUpdateDraft(finalResult, options);
  const plan: MatchSummaryPersistencePlan = {
    mode: 'pvc',
    auraUpdates: [],
  };

  if (cpuProgressUpdate !== undefined) {
    plan.cpuProgressUpdate = cpuProgressUpdate;
  }

  return plan;
}

function buildPvpMatchDraft(
  finalResult: FinalMatchResult,
  p1: CombatantResultSummary,
  p2: CombatantResultSummary,
  options: BuildMatchSummaryOptions,
): PvpMatchPersistenceDraft {
  const draft: PvpMatchPersistenceDraft = {
    matchId: finalResult.matchId,
    isPrivateMatch: options.isPrivateMatch ?? false,
    status: finalResult.status,
    p1PlayerId: p1.combatantId,
    p2PlayerId: p2.combatantId,
    startedAt: new Date(finalResult.startedAtMs),
    endedAt: new Date(finalResult.endedAtMs),
  };

  if (finalResult.winnerCombatantId !== undefined) {
    draft.winnerPlayerId = finalResult.winnerCombatantId;
  }

  if (options.dcPlayerId !== undefined) {
    draft.dcPlayerId = options.dcPlayerId;
  }

  if (options.voidReason !== undefined) {
    draft.voidReason = options.voidReason;
  }

  return draft;
}

function buildCpuProgressUpdateDraft(
  finalResult: FinalMatchResult,
  options: BuildMatchSummaryOptions,
): CpuProgressUpdateDraft | undefined {
  if (finalResult.pvcPlayerWon !== true || finalResult.cpuOpponentKey === undefined) {
    return undefined;
  }

  return {
    playerId: finalResult.combatants.p1.combatantId,
    cpuKey: finalResult.cpuOpponentKey,
    winIncrement: 1,
    unlockEvaluationRequired: true,
    updatedAt: new Date(options.nowMs ?? finalResult.endedAtMs),
  };
}

// ---------------------------------------------------------------------------
// 4. Results-page payload builders
// ---------------------------------------------------------------------------

function buildResultsPagePayload(finalResult: FinalMatchResult): ResultsPagePayload {
  const payload: ResultsPagePayload = {
    matchId: finalResult.matchId,
    roomId: finalResult.roomId,
    mode: finalResult.mode,
    status: finalResult.status,
    mutualFinalRoundLoss: finalResult.mutualFinalRoundLoss,
    roundWins: { ...finalResult.roundWins },
    tiedRoundCount: finalResult.tiedRoundCount,
    combatants: {
      p1: buildResultsCombatantSummary(finalResult, 'p1'),
      p2: buildResultsCombatantSummary(finalResult, 'p2'),
    },
  };

  if (finalResult.winnerCombatantId !== undefined) {
    payload.winnerCombatantId = finalResult.winnerCombatantId;
  }

  if (finalResult.cpuOpponentKey !== undefined) {
    payload.cpuOpponentKey = finalResult.cpuOpponentKey;
  }

  if (finalResult.pvcPlayerWon !== undefined) {
    payload.pvcPlayerWon = finalResult.pvcPlayerWon;
  }

  return payload;
}

function buildResultsCombatantSummary(
  finalResult: FinalMatchResult,
  combatantSlot: CombatantSlot,
): ResultsCombatantSummary {
  const combatant = finalResult.combatants[combatantSlot];

  return {
    slot: combatantSlot,
    combatantId: combatant.combatantId,
    result: resolvePlayerResultLabel(finalResult, combatantSlot),
    hp: combatant.hp,
    correctAnswers: combatant.correctAnswers,
    submittedAttempts: combatant.submittedAttempts,
    accuracy: combatant.accuracy,
    longestStreak: combatant.longestStreak,
    auraGain: combatant.auraGain,
  };
}

function resolvePlayerResultLabel(
  finalResult: FinalMatchResult,
  combatantSlot: CombatantSlot,
): PlayerResultLabel {
  const status = finalResult.status as MatchSummaryStatus;

  if (status === 'voided') {
    return 'voided';
  }

  if (finalResult.mutualFinalRoundLoss) {
    return 'mutual_loss';
  }

  if (finalResult.winnerSlot === combatantSlot) {
    return 'win';
  }

  return 'loss';
}

// ---------------------------------------------------------------------------
// 5. Validation and future placeholders
// ---------------------------------------------------------------------------

function validateFinalResult(finalResult: FinalMatchResult): void {
  if (finalResult.mode === 'pvp') {
    validatePvpFinalResult(finalResult);
    return;
  }

  validatePvcFinalResult(finalResult);
}

function validatePvpFinalResult(finalResult: FinalMatchResult): void {
  const p1 = finalResult.combatants.p1;
  const p2 = finalResult.combatants.p2;

  if (p1.driver !== 'human' || p2.driver !== 'human') {
    throw new Error('PvP match summary requires two human combatants.');
  }
}

function validatePvcFinalResult(finalResult: FinalMatchResult): void {
  const p1 = finalResult.combatants.p1;
  const p2 = finalResult.combatants.p2;

  if (p1.driver !== 'human' || p2.driver !== 'cpu') {
    throw new Error('PvC match summary requires p1 human and p2 CPU combatants.');
  }

  if (finalResult.cpuOpponentKey === undefined) {
    throw new Error('PvC match summary requires a CPU opponent key.');
  }
}

// TODO(match-summary-db): Implement the real PostgreSQL repository using the
// future database access layer. It should perform PvP row writes and Aura
// updates inside one transaction for PvP.
//
// TODO(cpu-unlocks): Replace `unlockEvaluationRequired` with an actual CPU
// unlock evaluation result once CPU progress reads and unlock-rule helpers are
// implemented.
//
// TODO(voided-matches): Extend Live Match final results to include voided PvP
// fields (`dcPlayerId`, `voidReason`) after reconnect/quit flows are built.
