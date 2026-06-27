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
  /** Human player whose tutorial completes by finishing this match (PvC only). */
  tutorialCompletion?: { playerId: string };
  /**
   * Human players whose CPU unlock state should be recomputed after this match
   * persists (a tutorial completion, CPU win, or completed PvP match may newly
   * satisfy an unlock rule). CPU combatants are excluded.
   */
  unlockReevaluationPlayerIds: string[];
}

export interface ResultsCombatantSummary {
  slot: CombatantSlot;
  combatantId: string;
  driver: CombatantResultSummary['driver'];
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
  dcCombatantId?: string;
  voidReason?: string;
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
  markTutorialComplete(playerId: string): Promise<void>;
  /** Recompute and persist newly-satisfied CPU unlocks for one human player. */
  reevaluateCpuUnlocks(playerId: string): Promise<void>;
}

export interface PersistMatchSummaryResult {
  handoff: MatchSummaryHandoff;
  persisted: {
    pvpMatch: boolean;
    auraUpdates: boolean;
    cpuProgressUpdate: boolean;
    tutorialCompletion: boolean;
    unlocksReevaluated: boolean;
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
    tutorialCompletion: false,
    unlocksReevaluated: false,
  };

  const plan = handoff.persistencePlan;

  if (plan.pvpMatch !== undefined) {
    await repository.writePvpMatch(plan.pvpMatch);
    persisted.pvpMatch = true;
  }

  if (plan.auraUpdates.length > 0) {
    await repository.applyAuraUpdates(plan.auraUpdates);
    persisted.auraUpdates = true;
  }

  if (plan.cpuProgressUpdate !== undefined) {
    await repository.applyCpuProgressUpdate(plan.cpuProgressUpdate);
    persisted.cpuProgressUpdate = true;
  }

  if (plan.tutorialCompletion !== undefined) {
    await repository.markTutorialComplete(plan.tutorialCompletion.playerId);
    persisted.tutorialCompletion = true;
  }

  // Run unlock re-evaluation last so it sees the wins/matches/tutorial writes
  // above and can grant any newly-satisfied CPU unlocks.
  for (const playerId of plan.unlockReevaluationPlayerIds) {
    await repository.reevaluateCpuUnlocks(playerId);
    persisted.unlocksReevaluated = true;
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
    // Both are human; a completed PvP match can satisfy Shi-eld's PvP requirement.
    unlockReevaluationPlayerIds: [p1.combatantId, p2.combatantId],
  };
}

function buildPvcPersistencePlan(
  finalResult: FinalMatchResult,
  options: BuildMatchSummaryOptions,
): MatchSummaryPersistencePlan {
  const cpuProgressUpdate = buildCpuProgressUpdateDraft(finalResult, options);
  // In PvC the human is always p1 (p2 is the CPU combatant).
  const humanPlayerId = finalResult.combatants.p1.combatantId;
  const plan: MatchSummaryPersistencePlan = {
    mode: 'pvc',
    auraUpdates: [],
    unlockReevaluationPlayerIds: [humanPlayerId],
  };

  if (cpuProgressUpdate !== undefined) {
    plan.cpuProgressUpdate = cpuProgressUpdate;
  }

  // Finishing a PvC match — win or lose — completes the tutorial gate, which
  // unlocks Min and Max. Voided matches don't count.
  if (finalResult.status !== 'voided') {
    plan.tutorialCompletion = { playerId: humanPlayerId };
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

  const dcPlayerId = options.dcPlayerId ?? finalResult.dcCombatantId;
  if (dcPlayerId !== undefined) {
    draft.dcPlayerId = dcPlayerId;
  }

  const voidReason = options.voidReason ?? finalResult.voidReason;
  if (voidReason !== undefined) {
    draft.voidReason = voidReason;
  }

  return draft;
}

function buildCpuProgressUpdateDraft(
  finalResult: FinalMatchResult,
  options: BuildMatchSummaryOptions,
): CpuProgressUpdateDraft | undefined {
  if (finalResult.status === 'voided') {
    return undefined;
  }

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

  if (finalResult.dcCombatantId !== undefined) {
    payload.dcCombatantId = finalResult.dcCombatantId;
  }

  if (finalResult.voidReason !== undefined) {
    payload.voidReason = finalResult.voidReason;
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
    driver: combatant.driver,
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

