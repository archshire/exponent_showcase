import type { Server, Socket } from 'socket.io';
import {
  cancelQuickMatchQueue,
  joinQuickMatchQueue,
  leavePreMatchRoom,
  markPlayerReady,
  startPvcMatch,
  startPvpLiveMatch,
  stopReadyCountdown,
} from '../services/matchmaking.service';
import { getLiveMatchSession } from '../services/live-match.service';
import type { CpuOpponentKey } from '../config/cpu-opponents.config';
import type { LiveMatchEvent } from '../services/live-match.service';
import type {
  MatchmakingEvent,
  MatchmakingResult,
  LeavePreMatchResult,
  PvcStartResult,
  QueueCancelResult,
  QueueJoinResult,
  ReadySetResult,
  ReadyStopResult,
  StartPvpLiveMatchResult,
} from '../services/matchmaking.service';

// ---------------------------------------------------------------------------
// Matchmaking Socket.IO handlers
// ---------------------------------------------------------------------------
//
// This file is transport wiring for pre-match/start actions.
//
// Current active path:
// - `pvc.start` creates a PvC runtime room.
// - Matchmaking immediately creates the Live Match session.
// - Socket.IO joins the player to the match room.
// - Socket.IO emits matchmaking events and Live Match start events.
//
// Future paths:
// - Quick Match queue.
// - Private invites.
// - PvP handoff into Live Match.
//
// Countdown timer note:
// The PvP ready countdown currently uses in-memory `setTimeout` handles.
// If the backend process restarts during the countdown, the timer is lost.
// Future restart-safe behavior should persist `countdownEndsAtMs` and recreate
// or resolve countdowns during backend startup.

const PVC_START = 'pvc.start';
const QUEUE_JOIN = 'queue.join';
const QUEUE_CANCEL = 'queue.cancel';
const PRIVATE_INVITE_SEND = 'private_invite.send';
const PRIVATE_INVITE_RESPOND = 'private_invite.respond';
const READY_SET = 'ready.set';
const READY_STOP = 'ready.stop';
const MATCH_LEAVE_PREMATCH = 'match.leave_prematch';
const SOCKET_ERROR = 'socket.error';

interface PvcStartPayload {
  playerId: string;
  cpuOpponentKey: CpuOpponentKey;
}

interface SocketErrorPayload {
  code: string;
  message: string;
  eventName: string;
}

interface PendingPreMatchPayload {
  roomId?: string;
  matchId?: string;
  playerId?: string;
}

interface ReadyPayload {
  roomId: string;
  playerId: string;
}

interface QueuePayload {
  playerId: string;
}

const CPU_OPPONENT_KEYS: readonly CpuOpponentKey[] = [
  'max',
  'min',
  'fury',
  'shi_eld',
  'peasy',
  'skore',
];

const countdownTimers = new Map<string, NodeJS.Timeout>();

export function registerMatchmakingSocketHandlers(io: Server): void {
  io.on('connection', (socket) => {
    socket.on(PVC_START, (payload: unknown) => {
      handlePvcStart(io, socket, payload);
    });

    socket.on(QUEUE_JOIN, (payload: unknown) => {
      handleQueueJoin(io, socket, payload);
    });

    socket.on(QUEUE_CANCEL, (payload: unknown) => {
      handleQueueCancel(io, socket, payload);
    });

    // Private invite and leave-prematch flows are documented contract points,
    // but they are not built yet.
    socket.on(PRIVATE_INVITE_SEND, (payload: unknown) => {
      handlePendingPreMatchEvent(socket, PRIVATE_INVITE_SEND, payload);
    });

    socket.on(PRIVATE_INVITE_RESPOND, (payload: unknown) => {
      handlePendingPreMatchEvent(socket, PRIVATE_INVITE_RESPOND, payload);
    });

    socket.on(READY_SET, (payload: unknown) => {
      handleReadySet(io, socket, payload);
    });

    socket.on(READY_STOP, (payload: unknown) => {
      handleReadyStop(io, socket, payload);
    });

    socket.on(MATCH_LEAVE_PREMATCH, (payload: unknown) => {
      handleLeavePreMatch(io, socket, payload);
    });
  });
}

// ---------------------------------------------------------------------------
// Active handlers
// ---------------------------------------------------------------------------

function handlePvcStart(io: Server, socket: Socket, payload: unknown): void {
  const parsed = parsePvcStartPayload(payload);
  if (parsed === null) {
    emitSocketError(socket, PVC_START, 'INVALID_PAYLOAD', 'Invalid PvC start payload.');
    return;
  }

  try {
    const result = startPvcMatch(parsed);
    socket.join(getMatchRoomName(result.room.matchId));
    socket.join(getPreMatchRoomName(result.room.roomId));
    emitPvcStartResult(io, socket, result);
  } catch (error) {
    emitSocketError(socket, PVC_START, toErrorCode(error), toErrorMessage(error));
  }
}

function handleQueueJoin(io: Server, socket: Socket, payload: unknown): void {
  const parsed = parseQueuePayload(payload);
  if (parsed === null) {
    emitSocketError(socket, QUEUE_JOIN, 'INVALID_PAYLOAD', 'Invalid queue join payload.');
    return;
  }

  try {
    const result = joinQuickMatchQueue(parsed);
    socket.join(getPreMatchRoomName(result.room.roomId));
    emitQueueJoinResult(io, socket, result);
  } catch (error) {
    emitSocketError(socket, QUEUE_JOIN, toErrorCode(error), toErrorMessage(error));
  }
}

function handleQueueCancel(io: Server, socket: Socket, payload: unknown): void {
  const parsed = parseQueuePayload(payload);
  if (parsed === null) {
    emitSocketError(socket, QUEUE_CANCEL, 'INVALID_PAYLOAD', 'Invalid queue cancel payload.');
    return;
  }

  try {
    const result = cancelQuickMatchQueue(parsed);
    emitQueueCancelResult(io, result);
    socket.leave(getPreMatchRoomName(result.room.roomId));
  } catch (error) {
    emitSocketError(socket, QUEUE_CANCEL, toErrorCode(error), toErrorMessage(error));
  }
}

function handleReadySet(io: Server, socket: Socket, payload: unknown): void {
  const parsed = parseReadyPayload(payload);
  if (parsed === null) {
    emitSocketError(socket, READY_SET, 'INVALID_PAYLOAD', 'Invalid ready payload.');
    return;
  }

  try {
    const result = markPlayerReady(parsed);
    socket.join(getPreMatchRoomName(result.room.roomId));
    emitReadySetResult(io, result);

    if (result.value.countdownStarted) {
      schedulePvpCountdownStart(io, result.room.roomId);
    }
  } catch (error) {
    emitSocketError(socket, READY_SET, toErrorCode(error), toErrorMessage(error));
  }
}

function handleReadyStop(io: Server, socket: Socket, payload: unknown): void {
  const parsed = parseReadyPayload(payload);
  if (parsed === null) {
    emitSocketError(socket, READY_STOP, 'INVALID_PAYLOAD', 'Invalid ready stop payload.');
    return;
  }

  try {
    clearCountdownTimer(parsed.roomId);
    const result = stopReadyCountdown(parsed);
    socket.join(getPreMatchRoomName(result.room.roomId));
    emitReadyStopResult(io, result);
  } catch (error) {
    emitSocketError(socket, READY_STOP, toErrorCode(error), toErrorMessage(error));
  }
}

function handleLeavePreMatch(io: Server, socket: Socket, payload: unknown): void {
  const parsed = parseReadyPayload(payload);
  if (parsed === null) {
    emitSocketError(
      socket,
      MATCH_LEAVE_PREMATCH,
      'INVALID_PAYLOAD',
      'Invalid leave pre-match payload.',
    );
    return;
  }

  try {
    clearCountdownTimer(parsed.roomId);
    const result = leavePreMatchRoom(parsed);
    emitLeavePreMatchResult(io, result);
    socket.leave(getPreMatchRoomName(result.room.roomId));
  } catch (error) {
    emitSocketError(socket, MATCH_LEAVE_PREMATCH, toErrorCode(error), toErrorMessage(error));
  }
}

// ---------------------------------------------------------------------------
// Pending PvP pre-match handlers
// ---------------------------------------------------------------------------

function handlePendingPreMatchEvent(
  socket: Socket,
  eventName: string,
  payload: unknown,
): void {
  const parsed = parsePendingPreMatchPayload(payload);

  emitSocketError(
    socket,
    eventName,
    'NOT_IMPLEMENTED',
    `Pre-match event ${eventName} is documented but not implemented yet.`,
  );

  socket.emit('matchmaking.pending_event_received', {
    eventName,
    roomId: parsed?.roomId,
    matchId: parsed?.matchId,
    playerId: parsed?.playerId,
  });
}

// ---------------------------------------------------------------------------
// Emit helpers
// ---------------------------------------------------------------------------

function emitPvcStartResult(
  io: Server,
  socket: Socket,
  result: MatchmakingResult<PvcStartResult>,
): void {
  socket.emit('pvc.started', {
    room: result.room,
    liveMatchSession: result.value.liveMatchSession,
  });

  for (const event of result.events) {
    emitMatchmakingEvent(io, event);
  }

  for (const event of result.liveMatchEvents ?? []) {
    emitLiveMatchEvent(io, event);
  }
}

function emitQueueJoinResult(
  io: Server,
  socket: Socket,
  result: MatchmakingResult<QueueJoinResult>,
): void {
  socket.emit('queue.joined.self', {
    room: result.room,
    matched: result.value.matched,
    nextRequiredStep: result.value.nextRequiredStep,
  });

  for (const event of result.events) {
    emitMatchmakingEvent(io, event);
  }
}

function emitQueueCancelResult(
  io: Server,
  result: MatchmakingResult<QueueCancelResult>,
): void {
  for (const event of result.events) {
    emitMatchmakingEvent(io, event);
  }
}

function emitLeavePreMatchResult(
  io: Server,
  result: MatchmakingResult<LeavePreMatchResult>,
): void {
  for (const event of result.events) {
    emitMatchmakingEvent(io, event);
  }
}

function emitReadySetResult(
  io: Server,
  result: MatchmakingResult<ReadySetResult>,
): void {
  for (const event of result.events) {
    emitMatchmakingEvent(io, event);
  }
}

function emitReadyStopResult(
  io: Server,
  result: MatchmakingResult<ReadyStopResult>,
): void {
  for (const event of result.events) {
    emitMatchmakingEvent(io, event);
  }
}

function emitPvpStartResult(
  io: Server,
  result: MatchmakingResult<StartPvpLiveMatchResult>,
): void {
  for (const event of result.events) {
    emitMatchmakingEvent(io, event);
  }

  for (const event of result.liveMatchEvents ?? []) {
    emitLiveMatchEvent(io, event);
  }
}

function emitMatchmakingEvent(io: Server, event: MatchmakingEvent): void {
  if (event.roomId === undefined) {
    return;
  }

  io.to(getPreMatchRoomName(event.roomId)).emit(event.name, event);
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
// Payload parsing helpers
// ---------------------------------------------------------------------------

function parsePvcStartPayload(payload: unknown): PvcStartPayload | null {
  const record = asRecord(payload);
  if (record === null) {
    return null;
  }

  const playerId = readString(record, 'playerId');
  const cpuOpponentKey = readCpuOpponentKey(record, 'cpuOpponentKey');

  if (playerId === null || cpuOpponentKey === null) {
    return null;
  }

  return {
    playerId,
    cpuOpponentKey,
  };
}

function parseReadyPayload(payload: unknown): ReadyPayload | null {
  const record = asRecord(payload);
  if (record === null) {
    return null;
  }

  const roomId = readString(record, 'roomId');
  const playerId = readString(record, 'playerId');

  if (roomId === null || playerId === null) {
    return null;
  }

  return {
    roomId,
    playerId,
  };
}

function parseQueuePayload(payload: unknown): QueuePayload | null {
  const record = asRecord(payload);
  if (record === null) {
    return null;
  }

  const playerId = readString(record, 'playerId');
  if (playerId === null) {
    return null;
  }

  return {
    playerId,
  };
}

function parsePendingPreMatchPayload(payload: unknown): PendingPreMatchPayload | null {
  const record = asRecord(payload);
  if (record === null) {
    return null;
  }

  const parsed: PendingPreMatchPayload = {};
  const roomId = readOptionalString(record, 'roomId');
  const matchId = readOptionalString(record, 'matchId');
  const playerId = readOptionalString(record, 'playerId');

  if (roomId !== undefined) {
    parsed.roomId = roomId;
  }

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

function readCpuOpponentKey(
  record: Record<string, unknown>,
  key: string,
): CpuOpponentKey | null {
  const value = readString(record, key);
  if (value === null) {
    return null;
  }

  if (!CPU_OPPONENT_KEYS.includes(value as CpuOpponentKey)) {
    return null;
  }

  return value as CpuOpponentKey;
}

function getPreMatchRoomName(roomId: string): string {
  return `room:${roomId}`;
}

function getMatchRoomName(matchId: string): string {
  return `match:${matchId}`;
}

function schedulePvpCountdownStart(io: Server, roomId: string): void {
  clearCountdownTimer(roomId);

  const timeout = setTimeout(() => {
    countdownTimers.delete(roomId);

    try {
      const result = startPvpLiveMatch({
        roomId,
        requireCountdownComplete: true,
      });
      emitPvpStartResult(io, result);
    } catch (error) {
      io.to(getPreMatchRoomName(roomId)).emit(SOCKET_ERROR, {
        code: toErrorCode(error),
        message: toErrorMessage(error),
        eventName: 'match.countdown',
      } satisfies SocketErrorPayload);
    }
  }, 5000);

  countdownTimers.set(roomId, timeout);
}

function clearCountdownTimer(roomId: string): void {
  const timeout = countdownTimers.get(roomId);
  if (timeout === undefined) {
    return;
  }

  clearTimeout(timeout);
  countdownTimers.delete(roomId);
}

function toErrorCode(error: unknown): string {
  const message = toErrorMessage(error);

  if (message.includes('Game rooms are full')) {
    return 'ROOM_CAP_REACHED';
  }

  if (message.includes('already queued')) {
    return 'ALREADY_QUEUED';
  }

  if (message.includes('not currently queued')) {
    return 'NOT_QUEUED';
  }

  if (message.includes('CPU opponent')) {
    return 'INVALID_CPU_OPPONENT';
  }

  if (message.includes('not part of this pre-match room')) {
    return 'NOT_ROOM_MEMBER';
  }

  if (message.includes('not found')) {
    return 'ROOM_NOT_FOUND';
  }

  if (message.includes('not in a ready-capable state')) {
    return 'INVALID_ROOM_STATE';
  }

  if (message.includes('Live Match has started')) {
    return 'MATCH_ALREADY_STARTED';
  }

  if (message.includes('countdown has not completed')) {
    return 'READY_COUNTDOWN_ACTIVE';
  }

  return 'MATCHMAKING_ACTION_FAILED';
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unknown matchmaking socket error.';
}
