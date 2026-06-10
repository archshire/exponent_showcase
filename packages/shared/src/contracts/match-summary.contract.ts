import type {
  CombatantDriver,
  CombatantSlot,
  CpuOpponentKey,
  LiveMatchMode,
} from './common.contract';

// ---------------------------------------------------------------------------
// Match Summary contract
// ---------------------------------------------------------------------------
//
// Live Match produces this final result. Match Summary persists the durable
// outcome and returns display data for the results page.

export type MatchPersistenceStatus = 'completed' | 'voided';

export interface CombatantResultSummaryContract {
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

export interface FinalMatchResultContract {
  matchId: string;
  roomId: string;
  mode: LiveMatchMode;
  status: MatchPersistenceStatus;
  startedAtMs: number;
  endedAtMs: number;
  winnerSlot?: CombatantSlot;
  winnerCombatantId?: string;
  mutualFinalRoundLoss: boolean;
  roundWins: Record<CombatantSlot, number>;
  tiedRoundCount: number;
  combatants: Record<CombatantSlot, CombatantResultSummaryContract>;
  cpuOpponentKey?: CpuOpponentKey;
  pvcPlayerWon?: boolean;
  dcCombatantId?: string;
  voidReason?: string;
}

export interface MatchSummaryResultContract {
  matchId: string;
  status: MatchPersistenceStatus;
  winnerCombatantId?: string;
  mutualFinalRoundLoss: boolean;
  combatants: Record<CombatantSlot, CombatantResultSummaryContract>;
  cpuOpponentKey?: CpuOpponentKey;
  pvcPlayerWon?: boolean;
}
