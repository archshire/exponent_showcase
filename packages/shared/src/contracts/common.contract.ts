// ---------------------------------------------------------------------------
// Common contract types
// ---------------------------------------------------------------------------
//
// These types are shared across more than one integration boundary.

export type GameMode = 'pvp' | 'pvc' | 'tutorial';

export type LiveMatchMode = 'pvp' | 'pvc';

export type CombatantSlot = 'p1' | 'p2';

export type CombatantDriver = 'human' | 'cpu';

export type CpuOpponentKey =
  | 'min'
  | 'max'
  | 'fury'
  | 'shi_eld';

export interface TimestampedServerMessage {
  serverTimestampMs: number;
}
