import type { CpuOpponentKey } from './common.contract';

// ---------------------------------------------------------------------------
// CPU Opponent contract
// ---------------------------------------------------------------------------
//
// Live Match uses these shapes when asking a CPU opponent for its next action.

export type CpuActionType = 'answer' | 'defend' | 'wait' | 'no_action';

export interface CpuDecisionRequest {
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
}

export interface CpuActionDecisionContract {
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

export interface CpuQuestionPressureContract {
  cpuMediumQuestionChance?: number;
}
