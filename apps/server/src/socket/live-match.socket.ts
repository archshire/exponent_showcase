import type { Server, Socket } from 'socket.io';
import {
  activateDefend,
  getLiveMatchSession,
  submitAnswer,
} from '../services/live-match.service';
import type {
  CombatantSlot,
  LiveMatchEvent,
  LiveMatchResult,
} from '../services/live-match.service';

// ---------------------------------------------------------------------------
// Live Match Socket.IO handlers
// ---------------------------------------------------------------------------
//
// This file is transport wiring only.
//
// Flow:
// 1. Browser-loaded Active Match Host connects through Socket.IO.
// 2. Client joins a match room with `live_match.join`.
// 3. Client sends gameplay actions like `answer.submit` or `defend.activate`.
// 4. This socket layer validates the basic payload shape.
// 5. This socket layer calls `live-match.service.ts`.
// 6. Live Match returns authoritative `LiveMatchEvent[]`.
// 7. This socket layer emits those events to the Socket.IO match room.
//
// Important:
// - This file does not decide HP, damage, answer truth, DEFEND success, revenge,
//   round winners, or match winners.
// - Those decisions belong to Live Match.
// - Auth/session checks are still pending and must be added before production.

const LIVE_MATCH_JOIN = 'live_match.join';
const ANSWER_SUBMIT = 'answer.submit';
const DEFEND_ACTIVATE = 'defend.activate';
const MATCH_QUIT = 'match.quit';
const RECONNECT_RESUME = 'reconnect.resume';
const REMATCH_REQUEST = 'rematch.request';
const REMATCH_RESPOND = 'rematch.respond';
const SOCKET_ERROR = 'socket.error';

interface LiveMatchJoinPayload {
  matchId: string;
  playerId: string;
}

interface AnswerSubmitPayload {
  matchId: string;
  playerId: string;
  displayedAnswer: string;
}

interface DefendActivatePayload {
  matchId: string;
  playerId: string;
}

interface PendingRealtimePayload {
  matchId?: string;
  playerId?: string;
}

interface SocketErrorPayload {
  code: string;
  message: string;
  eventName: string;
}

export function registerLiveMatchSocketHandlers(io: Server): void {
  io.on('connection', (socket) => {
    socket.on(LIVE_MATCH_JOIN, (payload: unknown) => {
      handleLiveMatchJoin(socket, payload);
    });

    socket.on(ANSWER_SUBMIT, (payload: unknown) => {
      handleAnswerSubmit(io, socket, payload);
    });

    socket.on(DEFEND_ACTIVATE, (payload: unknown) => {
      handleDefendActivate(io, socket, payload);
    });

    // Placeholders for realtime flows that Live Match does not implement
    // yet. Keeping them visible here makes the missing integration points
    // obvious when frontend work begins.
    socket.on(MATCH_QUIT, (payload: unknown) => {
      handlePendingRealtimeEvent(socket, MATCH_QUIT, payload);
    });

    socket.on(RECONNECT_RESUME, (payload: unknown) => {
      handlePendingRealtimeEvent(socket, RECONNECT_RESUME, payload);
    });

    socket.on(REMATCH_REQUEST, (payload: unknown) => {
      handlePendingRealtimeEvent(socket, REMATCH_REQUEST, payload);
    });

    socket.on(REMATCH_RESPOND, (payload: unknown) => {
      handlePendingRealtimeEvent(socket, REMATCH_RESPOND, payload);
    });
  });
}

// ---------------------------------------------------------------------------
// Active handlers
// ---------------------------------------------------------------------------

function handleLiveMatchJoin(socket: Socket, payload: unknown): void {
  const parsed = parseJoinPayload(payload);
  if (parsed === null) {
    emitSocketError(socket, LIVE_MATCH_JOIN, 'INVALID_PAYLOAD', 'Invalid live match join payload.');
    return;
  }

  const session = getLiveMatchSession(parsed.matchId);
  if (session === null) {
    emitSocketError(socket, LIVE_MATCH_JOIN, 'MATCH_NOT_FOUND', 'Live match session was not found.');
    return;
  }

  const combatantSlot = findCombatantSlotByPlayerId(parsed.matchId, parsed.playerId);
  if (combatantSlot === null) {
    emitSocketError(socket, LIVE_MATCH_JOIN, 'NOT_MATCH_MEMBER', 'Player is not part of this match.');
    return;
  }

  socket.join(getMatchRoomName(parsed.matchId));
  socket.emit('live_match.joined', {
    matchId: parsed.matchId,
    roomId: session.roomId,
    playerId: parsed.playerId,
    combatantSlot,
    session,
  });
}

function handleAnswerSubmit(io: Server, socket: Socket, payload: unknown): void {
  const parsed = parseAnswerSubmitPayload(payload);
  if (parsed === null) {
    emitSocketError(socket, ANSWER_SUBMIT, 'INVALID_PAYLOAD', 'Invalid answer submit payload.');
    return;
  }

  const combatantSlot = findCombatantSlotByPlayerId(parsed.matchId, parsed.playerId);
  if (combatantSlot === null) {
    emitSocketError(socket, ANSWER_SUBMIT, 'NOT_MATCH_MEMBER', 'Player is not part of this match.');
    return;
  }

  try {
    const result = submitAnswer(parsed.matchId, combatantSlot, parsed.displayedAnswer);
    emitLiveMatchResult(io, result);
  } catch (error) {
    emitSocketError(socket, ANSWER_SUBMIT, 'MATCH_ACTION_FAILED', toErrorMessage(error));
  }
}

function handleDefendActivate(io: Server, socket: Socket, payload: unknown): void {
  const parsed = parseDefendActivatePayload(payload);
  if (parsed === null) {
    emitSocketError(socket, DEFEND_ACTIVATE, 'INVALID_PAYLOAD', 'Invalid DEFEND payload.');
    return;
  }

  const combatantSlot = findCombatantSlotByPlayerId(parsed.matchId, parsed.playerId);
  if (combatantSlot === null) {
    emitSocketError(socket, DEFEND_ACTIVATE, 'NOT_MATCH_MEMBER', 'Player is not part of this match.');
    return;
  }

  try {
    const result = activateDefend(parsed.matchId, combatantSlot);
    emitLiveMatchResult(io, result);
  } catch (error) {
    emitSocketError(socket, DEFEND_ACTIVATE, 'MATCH_ACTION_FAILED', toErrorMessage(error));
  }
}

// ---------------------------------------------------------------------------
// Pending handlers
// ---------------------------------------------------------------------------

function handlePendingRealtimeEvent(
  socket: Socket,
  eventName: string,
  payload: unknown,
): void {
  const parsed = parsePendingRealtimePayload(payload);
  emitSocketError(
    socket,
    eventName,
    'NOT_IMPLEMENTED',
    `Realtime event ${eventName} is documented but not implemented yet.`,
  );

  if (parsed?.matchId !== undefined) {
    socket.emit('live_match.pending_event_received', {
      eventName,
      matchId: parsed.matchId,
      playerId: parsed.playerId,
    });
  }
}

// ---------------------------------------------------------------------------
// Emit helpers
// ---------------------------------------------------------------------------

function emitLiveMatchResult<T>(io: Server, result: LiveMatchResult<T>): void {
  for (const event of result.events) {
    emitLiveMatchEvent(io, event);
  }
}

function emitLiveMatchEvent(io: Server, event: LiveMatchEvent): void {
  io.to(getMatchRoomName(event.matchId)).emit(event.name, {
    ...event,
    session: getLiveMatchSession(event.matchId),
  });
}

function emitSocketError(
  socket: Socket,
  eventName: string,
  code: string,
  message: string,
): void {
  const payload: SocketErrorPayload = {
    code,
    message,
    eventName,
  };

  socket.emit(SOCKET_ERROR, payload);
}

// ---------------------------------------------------------------------------
// Match lookup helpers
// ---------------------------------------------------------------------------

function findCombatantSlotByPlayerId(matchId: string, playerId: string): CombatantSlot | null {
  const session = getLiveMatchSession(matchId);
  if (session === null) {
    return null;
  }

  if (session.combatants.p1.id === playerId) {
    return 'p1';
  }

  if (session.combatants.p2.id === playerId) {
    return 'p2';
  }

  return null;
}

function getMatchRoomName(matchId: string): string {
  return `match:${matchId}`;
}

// ---------------------------------------------------------------------------
// Payload parsing helpers
// ---------------------------------------------------------------------------

function parseJoinPayload(payload: unknown): LiveMatchJoinPayload | null {
  const record = asRecord(payload);
  if (record === null) {
    return null;
  }

  const matchId = readString(record, 'matchId');
  const playerId = readString(record, 'playerId');

  if (matchId === null || playerId === null) {
    return null;
  }

  return { matchId, playerId };
}

function parseAnswerSubmitPayload(payload: unknown): AnswerSubmitPayload | null {
  const record = asRecord(payload);
  if (record === null) {
    return null;
  }

  const matchId = readString(record, 'matchId');
  const playerId = readString(record, 'playerId');
  const displayedAnswer = readString(record, 'displayedAnswer');

  if (matchId === null || playerId === null || displayedAnswer === null) {
    return null;
  }

  return { matchId, playerId, displayedAnswer };
}

function parseDefendActivatePayload(payload: unknown): DefendActivatePayload | null {
  const record = asRecord(payload);
  if (record === null) {
    return null;
  }

  const matchId = readString(record, 'matchId');
  const playerId = readString(record, 'playerId');

  if (matchId === null || playerId === null) {
    return null;
  }

  return { matchId, playerId };
}

function parsePendingRealtimePayload(payload: unknown): PendingRealtimePayload | null {
  const record = asRecord(payload);
  if (record === null) {
    return null;
  }

  const parsed: PendingRealtimePayload = {};
  const matchId = readOptionalString(record, 'matchId');
  const playerId = readOptionalString(record, 'playerId');

  if (matchId !== undefined) {
    parsed.matchId = matchId;
  }

  if (playerId !== undefined) {
    parsed.playerId = playerId;
  }

  return parsed;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function readString(record: Record<string, unknown>, key: string): string | null {
  const value = record[key];
  if (typeof value !== 'string' || value.trim() === '') {
    return null;
  }

  return value;
}

function readOptionalString(record: Record<string, unknown>, key: string): string | undefined {
  const value = record[key];
  if (typeof value !== 'string' || value.trim() === '') {
    return undefined;
  }

  return value;
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unknown live match socket error.';
}
