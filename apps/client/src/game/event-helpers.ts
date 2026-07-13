import type { GameEvent, GameSlot } from './types';

export function readSlotPayload(event: GameEvent, key: string): GameSlot | undefined {
  const value = event.payload?.[key];
  return value === 'p1' || value === 'p2' ? value : undefined;
}

export function readNumberPayload(event: GameEvent, key: string): number | undefined {
  const value = event.payload?.[key];
  return typeof value === 'number' ? value : undefined;
}
