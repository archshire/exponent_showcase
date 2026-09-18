import type { CpuOpponentKey } from '../../config/cpu-opponents.config';
import type { Difficulty } from '../../services/question-generator.service';

// Realtime payloads arrive untyped from the client; these parsers validate and
// normalise them, and the room-name/utility helpers are pure string builders
// shared across the game socket handlers.

export interface GameStartPvcPayload {
  mathBay?: boolean;
  playerId: string;
  cpuOpponentKey?: CpuOpponentKey;
  avatar?: string;
  arenaId?: string;
  difficulty?: Difficulty;
}

export interface GameQueueJoinPayload {
  babyMode?: boolean;
  playerId: string;
  avatar?: string;
  difficulty?: Difficulty;
}

export interface GameAnswerPayload {
  matchId: string;
  playerId: string;
  answer: string;
}

export interface GameReadyPayload {
  roomId: string;
  playerId: string;
}

export interface GameDefendPayload {
  matchId: string;
  playerId: string;
}

export function parseDifficulty(value: string | undefined): Difficulty | undefined {
  if (value === 'very_easy' || value === 'easy' || value === 'very_hard') return value;
  return undefined;
}

export function parsePvcStartPayload(payload: unknown): GameStartPvcPayload | null {
  const record = asRecord(payload);
  const playerId = readString(record, 'playerId');
  const cpuOpponentKey = readOptionalString(record, 'cpuOpponentKey') as CpuOpponentKey | undefined;
  if (playerId === undefined) {
    return null;
  }

  const parsed: GameStartPvcPayload = { playerId };
  if (record?.mathBay === true) parsed.mathBay = true;
  if (cpuOpponentKey !== undefined) {
    parsed.cpuOpponentKey = cpuOpponentKey;
  }
  const avatar = readOptionalString(record, 'avatar');
  if (avatar !== undefined) {
    parsed.avatar = avatar;
  }
  const arenaId = readOptionalString(record, 'arenaId');
  if (arenaId !== undefined) {
    parsed.arenaId = arenaId;
  }
  const difficulty = parseDifficulty(readOptionalString(record, 'difficulty'));
  if (difficulty !== undefined) {
    parsed.difficulty = difficulty;
  }
  return parsed;
}

export function parseQueueJoinPayload(payload: unknown): GameQueueJoinPayload | null {
  const record = asRecord(payload);
  const playerId = readString(record, 'playerId');
  if (playerId === undefined) {
    return null;
  }
  const parsed: GameQueueJoinPayload = { playerId };
  if (record?.babyMode === true) parsed.babyMode = true;
  const avatar = readOptionalString(record, 'avatar');
  if (avatar !== undefined) {
    parsed.avatar = avatar;
  }
  const difficulty = parseDifficulty(readOptionalString(record, 'difficulty'));
  if (difficulty !== undefined) {
    parsed.difficulty = difficulty;
  }
  return parsed;
}

export function parseReadyPayload(payload: unknown): GameReadyPayload | null {
  const record = asRecord(payload);
  const roomId = readString(record, 'roomId');
  const playerId = readString(record, 'playerId');
  return roomId === undefined || playerId === undefined ? null : { roomId, playerId };
}

export function parseAnswerPayload(payload: unknown): GameAnswerPayload | null {
  const record = asRecord(payload);
  const matchId = readString(record, 'matchId');
  const playerId = readString(record, 'playerId');
  const answer = readString(record, 'answer');
  return matchId === undefined || playerId === undefined || answer === undefined
    ? null
    : { matchId, playerId, answer };
}

export function parseDefendPayload(payload: unknown): GameDefendPayload | null {
  const record = asRecord(payload);
  const matchId = readString(record, 'matchId');
  const playerId = readString(record, 'playerId');
  return matchId === undefined || playerId === undefined ? null : { matchId, playerId };
}

export function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function readString(record: Record<string, unknown>, key: string): string | undefined {
  const value = record[key];
  return typeof value === 'string' && value.trim() !== '' ? value : undefined;
}

export function readOptionalString(
  record: Record<string, unknown>,
  key: string
): string | undefined {
  return readString(record, key);
}

export function matchRoom(matchId: string): string {
  return `game:match:${matchId}`;
}

export function preMatchRoom(roomId: string): string {
  return `game:room:${roomId}`;
}

export function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown runtime error.';
}
