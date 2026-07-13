import { randomUUID } from 'node:crypto';
import { getCpuOpponentConfig } from '../config/cpu-opponents.config';
import { createLiveMatchSession } from './live-match.service';
import type { CpuOpponentKey } from '../config/cpu-opponents.config';
import type { LiveMatchEvent, LiveMatchMode, LiveMatchSession } from './live-match.service';

// ---------------------------------------------------------------------------
// Matchmaking / Pre-Match Service
// ---------------------------------------------------------------------------
//
// This module owns the room before the fight becomes a Live Match.
//
// It is the backend coordination layer between:
// - PvC "Start Match" entry.
// - Quick Match queueing.
// - Private invite flow.
// - Ready / countdown state.
// - Live Match session creation.
//
// It should not resolve combat, generate questions, decide CPU behavior, write
// match summaries, or render frontend/Excalibur presentation.
//
// Pre-match lifecycle map:
// 1. Frontend sends a PvC start, Quick Match join, or private invite action.
// 2. Matchmaking creates or finds a backend room.
// 3. PvC can immediately hand off to Live Match because there is only one
//    human player plus a server-controlled CPU.
// 4. PvP waits for the two-player ready/countdown flow.
// 5. When the room is ready, Matchmaking calls `createLiveMatchSession`.
// 6. Socket.IO joins players to `room:{roomId}` / `match:{matchId}` channels.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// 1. Public pre-match types
// ---------------------------------------------------------------------------

export type MatchRoomMode = LiveMatchMode;

export type MatchRoomStatus =
  | 'created'
  | 'queueing'
  | 'waiting_ready'
  | 'countdown'
  | 'live'
  | 'cancelled';

export type MatchmakingEventName =
  | 'room.created'
  | 'room.assigned'
  | 'room.cancelled'
  | 'prematch.cancelled'
  | 'room.full'
  | 'queue.joined'
  | 'queue.cancelled'
  | 'ready.state'
  | 'match.countdown'
  | 'match.started';

export interface MatchmakingEvent {
  name: MatchmakingEventName;
  roomId?: string;
  matchId?: string;
  serverTimestampMs: number;
  payload: Record<string, unknown>;
}

export interface ReadyState {
  p1Ready: boolean;
  p2Ready: boolean;
  readyWindowEndsAtMs?: number;
}

export interface CountdownState {
  startedAtMs: number;
  endsAtMs: number;
}

export interface MatchRoom {
  roomId: string;
  matchId: string;
  mode: MatchRoomMode;
  status: MatchRoomStatus;
  createdAtMs: number;
  updatedAtMs: number;
  isPrivateMatch: boolean;
  playerIds: string[];
  cpuOpponentKey?: CpuOpponentKey;
  readyState?: ReadyState;
  countdownState?: CountdownState;
  liveMatchStartedAtMs?: number;
  cancelledReason?: string;
}

export interface StartPvcMatchOptions {
  playerId: string;
  cpuOpponentKey: CpuOpponentKey;
  nowMs?: number;
  roomId?: string;
  matchId?: string;
}

export interface CreatePvpRoomOptions {
  p1PlayerId: string;
  p2PlayerId?: string;
  isPrivateMatch?: boolean;
  nowMs?: number;
  roomId?: string;
  matchId?: string;
}

export interface MatchmakingResult<T> {
  room: MatchRoom;
  value: T;
  events: MatchmakingEvent[];
  liveMatchEvents?: LiveMatchEvent[];
}

export interface PvcStartResult {
  room: MatchRoom;
  liveMatchSession: LiveMatchSession;
}

export interface PvpRoomDraftResult {
  room: MatchRoom;
  nextRequiredStep: 'wait_for_opponent' | 'ready_flow_pending';
}

export interface ReadySetOptions {
  roomId: string;
  playerId: string;
  nowMs?: number;
}

export interface ReadySetResult {
  room: MatchRoom;
  countdownStarted: boolean;
}

export interface ReadyStopOptions {
  roomId: string;
  playerId: string;
  nowMs?: number;
}

export interface ReadyStopResult {
  room: MatchRoom;
  countdownStopped: boolean;
}

export interface StartPvpLiveMatchOptions {
  roomId: string;
  nowMs?: number;
  requireCountdownComplete?: boolean;
}

export interface StartPvpLiveMatchResult {
  room: MatchRoom;
  liveMatchSession: LiveMatchSession;
}

export interface QueueJoinOptions {
  playerId: string;
  nowMs?: number;
}

export interface QueueJoinResult {
  room: MatchRoom;
  matched: boolean;
  nextRequiredStep: 'wait_for_opponent' | 'ready_flow';
}

export interface LeavePreMatchOptions {
  roomId: string;
  playerId: string;
  nowMs?: number;
}

export interface LeavePreMatchResult {
  room: MatchRoom;
  leavingPlayerId: string;
  remainingPlayerIds: string[];
}

const MAX_ACTIVE_ROOMS = 50;
const DEFAULT_READY_WINDOW_MS = 30000;
const DEFAULT_COUNTDOWN_MS = 5000;

// ---------------------------------------------------------------------------
// 2. In-memory pre-match room registry
// ---------------------------------------------------------------------------
//
// This is temporary backend process memory. It is not PostgreSQL source
// of truth. Final match outcomes are persisted later through Match Summary.

const matchRooms = new Map<string, MatchRoom>();

// Quick Match uses queued one-player rooms. The first player creates a
// queued room. The second player is assigned into the oldest queued room.
const quickMatchQueueRoomIds: string[] = [];

// ---------------------------------------------------------------------------
// 3. PvC start flow
// ---------------------------------------------------------------------------
//
// PvC creates a runtime room too, but it does not need two-human queueing or
// ready synchronization. The player chooses a CPU, then Matchmaking immediately
// creates the Live Match session.

export function startPvcMatch(options: StartPvcMatchOptions): MatchmakingResult<PvcStartResult> {
  const nowMs = options.nowMs ?? Date.now();
  assertRoomCapacityAvailable();
  getCpuOpponentConfig(options.cpuOpponentKey);

  const roomOptions: CreateRoomOptions = {
    mode: 'pvc',
    status: 'created',
    playerIds: [options.playerId],
    isPrivateMatch: false,
    cpuOpponentKey: options.cpuOpponentKey,
    nowMs,
  };

  if (options.roomId !== undefined) {
    roomOptions.roomId = options.roomId;
  }

  if (options.matchId !== undefined) {
    roomOptions.matchId = options.matchId;
  }

  const room = createRoom(roomOptions);

  const liveMatch = createLiveMatchSession({
    matchId: room.matchId,
    roomId: room.roomId,
    mode: 'pvc',
    p1CombatantId: options.playerId,
    cpuOpponentKey: options.cpuOpponentKey,
    nowMs,
  });

  room.status = 'live';
  room.liveMatchStartedAtMs = nowMs;
  room.updatedAtMs = nowMs;

  return {
    room,
    value: {
      room,
      liveMatchSession: liveMatch.session,
    },
    events: [
      createMatchmakingEvent('room.created', nowMs, {
        roomId: room.roomId,
        matchId: room.matchId,
        mode: room.mode,
        playerIds: [...room.playerIds],
        cpuOpponentKey: room.cpuOpponentKey,
      }),
      createMatchmakingEvent('match.started', nowMs, {
        roomId: room.roomId,
        matchId: room.matchId,
        mode: room.mode,
      }),
    ],
    liveMatchEvents: liveMatch.events,
  };
}

// ---------------------------------------------------------------------------
// 4. PvP room draft flow
// ---------------------------------------------------------------------------
//
// Creates a PvP room shell (one or two players). Used by Quick Match (one
// player, then matched) and private invites (starter, then the invited friend).

export function createPvpRoomDraft(
  options: CreatePvpRoomOptions
): MatchmakingResult<PvpRoomDraftResult> {
  const nowMs = options.nowMs ?? Date.now();
  assertRoomCapacityAvailable();

  const playerIds =
    options.p2PlayerId === undefined
      ? [options.p1PlayerId]
      : [options.p1PlayerId, options.p2PlayerId];

  const roomOptions: CreateRoomOptions = {
    mode: 'pvp',
    status: options.p2PlayerId === undefined ? 'queueing' : 'waiting_ready',
    playerIds,
    isPrivateMatch: options.isPrivateMatch ?? false,
    nowMs,
  };

  if (options.roomId !== undefined) {
    roomOptions.roomId = options.roomId;
  }

  if (options.matchId !== undefined) {
    roomOptions.matchId = options.matchId;
  }

  const room = createRoom(roomOptions);

  if (options.p2PlayerId !== undefined) {
    room.readyState = {
      p1Ready: false,
      p2Ready: false,
      readyWindowEndsAtMs: nowMs + DEFAULT_READY_WINDOW_MS,
    };
  }

  return {
    room,
    value: {
      room,
      nextRequiredStep:
        options.p2PlayerId === undefined ? 'wait_for_opponent' : 'ready_flow_pending',
    },
    events: [
      createMatchmakingEvent('room.created', nowMs, {
        roomId: room.roomId,
        matchId: room.matchId,
        mode: room.mode,
        status: room.status,
        playerIds: [...room.playerIds],
      }),
    ],
  };
}

// ---------------------------------------------------------------------------
// 5. Quick Match queue flow
// ---------------------------------------------------------------------------

export function joinQuickMatchQueue(options: QueueJoinOptions): MatchmakingResult<QueueJoinResult> {
  const nowMs = options.nowMs ?? Date.now();
  assertRoomCapacityAvailable();
  assertPlayerNotAlreadyQueued(options.playerId);

  const waitingRoom = findOldestQueuedRoom();
  if (waitingRoom === undefined) {
    const created = createPvpRoomDraft({
      p1PlayerId: options.playerId,
      nowMs,
    });

    addRoomToQuickMatchQueue(created.room.roomId);

    return {
      room: created.room,
      value: {
        room: created.room,
        matched: false,
        nextRequiredStep: 'wait_for_opponent',
      },
      events: [
        ...created.events,
        createMatchmakingEvent('queue.joined', nowMs, {
          roomId: created.room.roomId,
          matchId: created.room.matchId,
          playerId: options.playerId,
          matched: false,
        }),
      ],
    };
  }

  removeRoomFromQuickMatchQueue(waitingRoom.roomId);
  waitingRoom.playerIds.push(options.playerId);
  waitingRoom.status = 'waiting_ready';
  waitingRoom.readyState = {
    p1Ready: false,
    p2Ready: false,
    readyWindowEndsAtMs: nowMs + DEFAULT_READY_WINDOW_MS,
  };
  waitingRoom.updatedAtMs = nowMs;

  return {
    room: waitingRoom,
    value: {
      room: waitingRoom,
      matched: true,
      nextRequiredStep: 'ready_flow',
    },
    events: [
      createMatchmakingEvent('queue.joined', nowMs, {
        roomId: waitingRoom.roomId,
        matchId: waitingRoom.matchId,
        playerId: options.playerId,
        matched: true,
      }),
      createMatchmakingEvent('room.assigned', nowMs, {
        roomId: waitingRoom.roomId,
        matchId: waitingRoom.matchId,
        playerIds: [...waitingRoom.playerIds],
        readyWindowEndsAtMs: waitingRoom.readyState.readyWindowEndsAtMs,
      }),
      createReadyStateEvent(waitingRoom, nowMs, false),
    ],
  };
}

// Private match: an invited friend joins the starter's existing room as p2
// (right side). The starter created the room via createPvpRoomDraft (p1, left).
export function joinPrivateRoom(
  options: QueueJoinOptions & { roomId: string }
): MatchmakingResult<QueueJoinResult> {
  const nowMs = options.nowMs ?? Date.now();
  const room = matchRooms.get(options.roomId);

  if (room === undefined || room.status === 'cancelled') {
    throw new Error('Private match room not found.');
  }
  if (room.mode !== 'pvp' || !room.isPrivateMatch) {
    throw new Error('Room is not a private match.');
  }
  if (room.playerIds.includes(options.playerId)) {
    throw new Error('Player is already in this room.');
  }
  if (room.playerIds.length >= 2) {
    throw new Error('Private match room is full.');
  }

  room.playerIds.push(options.playerId);
  room.status = 'waiting_ready';
  room.readyState = {
    p1Ready: false,
    p2Ready: false,
    readyWindowEndsAtMs: nowMs + DEFAULT_READY_WINDOW_MS,
  };
  room.updatedAtMs = nowMs;

  return {
    room,
    value: { room, matched: true, nextRequiredStep: 'ready_flow' },
    events: [
      createMatchmakingEvent('room.assigned', nowMs, {
        roomId: room.roomId,
        matchId: room.matchId,
        playerIds: [...room.playerIds],
        readyWindowEndsAtMs: room.readyState.readyWindowEndsAtMs,
      }),
      createReadyStateEvent(room, nowMs, false),
    ],
  };
}

// ---------------------------------------------------------------------------
// 6. Room lookup and cleanup API
// ---------------------------------------------------------------------------

export function getMatchRoom(roomId: string): MatchRoom | undefined {
  return matchRooms.get(roomId);
}

function requireMatchRoom(roomId: string): MatchRoom {
  const room = getMatchRoom(roomId);

  if (room === undefined) {
    throw new Error(`Match room not found: ${roomId}`);
  }

  return room;
}

export function leavePreMatchRoom(
  options: LeavePreMatchOptions
): MatchmakingResult<LeavePreMatchResult> {
  const nowMs = options.nowMs ?? Date.now();
  const room = requireMatchRoom(options.roomId);

  if (room.status === 'live') {
    throw new Error('Cannot leave pre-match after Live Match has started.');
  }

  if (room.status === 'cancelled') {
    throw new Error('Pre-match room is already cancelled.');
  }

  getPlayerIndex(room, options.playerId);

  const remainingPlayerIds = room.playerIds.filter((playerId) => playerId !== options.playerId);

  removeRoomFromQuickMatchQueue(room.roomId);
  room.status = 'cancelled';
  room.cancelledReason = 'player_left_prematch';
  room.updatedAtMs = nowMs;
  matchRooms.delete(room.roomId);

  return {
    room,
    value: {
      room,
      leavingPlayerId: options.playerId,
      remainingPlayerIds,
    },
    events: [
      createMatchmakingEvent('prematch.cancelled', nowMs, {
        roomId: room.roomId,
        matchId: room.matchId,
        leavingPlayerId: options.playerId,
        remainingPlayerIds,
        reason: 'player_left_prematch',
        message: remainingPlayerIds.length > 0 ? 'Opponent left.' : 'Room cancelled.',
      }),
      createMatchmakingEvent('room.cancelled', nowMs, {
        roomId: room.roomId,
        matchId: room.matchId,
        reason: 'player_left_prematch',
      }),
    ],
  };
}

// ---------------------------------------------------------------------------
// 7. PvP ready/countdown flow
// ---------------------------------------------------------------------------

export function markPlayerReady(options: ReadySetOptions): MatchmakingResult<ReadySetResult> {
  const nowMs = options.nowMs ?? Date.now();
  const room = requireReadyRoom(options.roomId, options.playerId);
  const readyState = requireReadyState(room);
  const playerIndex = getPlayerIndex(room, options.playerId);

  if (playerIndex === 0) {
    readyState.p1Ready = true;
  } else {
    readyState.p2Ready = true;
  }

  room.updatedAtMs = nowMs;
  room.status = 'waiting_ready';

  const events: MatchmakingEvent[] = [createReadyStateEvent(room, nowMs, false)];

  let countdownStarted = false;

  if (readyState.p1Ready && readyState.p2Ready) {
    room.status = 'countdown';
    room.countdownState = {
      startedAtMs: nowMs,
      endsAtMs: nowMs + DEFAULT_COUNTDOWN_MS,
    };
    room.updatedAtMs = nowMs;
    countdownStarted = true;
    events.push(createCountdownEvent(room, nowMs, 'started'));
  }

  return {
    room,
    value: {
      room,
      countdownStarted,
    },
    events,
  };
}

export function stopReadyCountdown(options: ReadyStopOptions): MatchmakingResult<ReadyStopResult> {
  const nowMs = options.nowMs ?? Date.now();
  const room = requireReadyRoom(options.roomId, options.playerId);
  const readyState = requireReadyState(room);
  const countdownStopped = room.countdownState !== undefined || room.status === 'countdown';

  readyState.p1Ready = false;
  readyState.p2Ready = false;
  readyState.readyWindowEndsAtMs = nowMs + DEFAULT_READY_WINDOW_MS;
  delete room.countdownState;
  room.status = 'waiting_ready';
  room.updatedAtMs = nowMs;

  return {
    room,
    value: {
      room,
      countdownStopped,
    },
    events: [
      createCountdownEvent(room, nowMs, 'stopped'),
      createReadyStateEvent(room, nowMs, true),
    ],
  };
}

export function startPvpLiveMatch(
  options: StartPvpLiveMatchOptions
): MatchmakingResult<StartPvpLiveMatchResult> {
  const nowMs = options.nowMs ?? Date.now();
  const room = requireMatchRoom(options.roomId);

  validatePvpRoomCanStart(room, nowMs, options.requireCountdownComplete ?? true);

  const p1PlayerId = room.playerIds[0];
  const p2PlayerId = room.playerIds[1];

  if (p1PlayerId === undefined || p2PlayerId === undefined) {
    throw new Error('PvP live match requires two players.');
  }

  const liveMatch = createLiveMatchSession({
    matchId: room.matchId,
    roomId: room.roomId,
    mode: 'pvp',
    p1CombatantId: p1PlayerId,
    p2CombatantId: p2PlayerId,
    nowMs,
  });

  room.status = 'live';
  room.liveMatchStartedAtMs = nowMs;
  room.updatedAtMs = nowMs;

  return {
    room,
    value: {
      room,
      liveMatchSession: liveMatch.session,
    },
    events: [
      createMatchmakingEvent('match.started', nowMs, {
        roomId: room.roomId,
        matchId: room.matchId,
        mode: room.mode,
        playerIds: [...room.playerIds],
      }),
    ],
    liveMatchEvents: liveMatch.events,
  };
}

// ---------------------------------------------------------------------------
// 8. Internal helpers
// ---------------------------------------------------------------------------

function findOldestQueuedRoom(): MatchRoom | undefined {
  pruneQuickMatchQueue();

  const roomId = quickMatchQueueRoomIds[0];
  if (roomId === undefined) {
    return undefined;
  }

  return matchRooms.get(roomId);
}

function findQueuedRoomByPlayerId(playerId: string): MatchRoom | undefined {
  pruneQuickMatchQueue();

  for (const roomId of quickMatchQueueRoomIds) {
    const room = matchRooms.get(roomId);
    if (room?.playerIds[0] === playerId) {
      return room;
    }
  }

  return undefined;
}

function assertPlayerNotAlreadyQueued(playerId: string): void {
  if (findQueuedRoomByPlayerId(playerId) !== undefined) {
    throw new Error('Player is already queued for Quick Match.');
  }
}

function addRoomToQuickMatchQueue(roomId: string): void {
  if (!quickMatchQueueRoomIds.includes(roomId)) {
    quickMatchQueueRoomIds.push(roomId);
  }
}

function removeRoomFromQuickMatchQueue(roomId: string): void {
  const index = quickMatchQueueRoomIds.indexOf(roomId);
  if (index >= 0) {
    quickMatchQueueRoomIds.splice(index, 1);
  }
}

function pruneQuickMatchQueue(): void {
  for (let index = quickMatchQueueRoomIds.length - 1; index >= 0; index -= 1) {
    const room = matchRooms.get(quickMatchQueueRoomIds[index] ?? '');
    if (room === undefined || room.status !== 'queueing' || room.playerIds.length !== 1) {
      quickMatchQueueRoomIds.splice(index, 1);
    }
  }
}

function requireReadyRoom(roomId: string, playerId: string): MatchRoom {
  const room = requireMatchRoom(roomId);

  if (room.mode !== 'pvp') {
    throw new Error('Ready flow is only available for PvP rooms.');
  }

  if (room.status !== 'waiting_ready' && room.status !== 'countdown') {
    throw new Error(`Room is not in a ready-capable state: ${room.status}`);
  }

  getPlayerIndex(room, playerId);

  if (room.playerIds.length !== 2) {
    throw new Error('PvP ready flow requires two players in the room.');
  }

  return room;
}

function requireReadyState(room: MatchRoom): ReadyState {
  if (room.readyState !== undefined) {
    return room.readyState;
  }

  room.readyState = {
    p1Ready: false,
    p2Ready: false,
    readyWindowEndsAtMs: Date.now() + DEFAULT_READY_WINDOW_MS,
  };

  return room.readyState;
}

function getPlayerIndex(room: MatchRoom, playerId: string): 0 | 1 {
  const index = room.playerIds.indexOf(playerId);

  if (index !== 0 && index !== 1) {
    throw new Error('Player is not part of this pre-match room.');
  }

  return index;
}

function validatePvpRoomCanStart(
  room: MatchRoom,
  nowMs: number,
  requireCountdownComplete: boolean
): void {
  if (room.mode !== 'pvp') {
    throw new Error('Only PvP rooms can use PvP live-match handoff.');
  }

  if (room.status !== 'countdown') {
    throw new Error(`PvP room is not in countdown state: ${room.status}`);
  }

  if (
    room.playerIds.length !== 2 ||
    room.playerIds[0] === undefined ||
    room.playerIds[1] === undefined
  ) {
    throw new Error('PvP live match requires two players.');
  }

  const readyState = requireReadyState(room);
  if (!readyState.p1Ready || !readyState.p2Ready) {
    throw new Error('PvP live match requires both players to be ready.');
  }

  if (room.countdownState === undefined) {
    throw new Error('PvP live match requires an active countdown.');
  }

  if (requireCountdownComplete && nowMs < room.countdownState.endsAtMs) {
    throw new Error('PvP countdown has not completed yet.');
  }
}

function createReadyStateEvent(
  room: MatchRoom,
  serverTimestampMs: number,
  reset: boolean
): MatchmakingEvent {
  return createMatchmakingEvent('ready.state', serverTimestampMs, {
    roomId: room.roomId,
    matchId: room.matchId,
    p1Ready: room.readyState?.p1Ready ?? false,
    p2Ready: room.readyState?.p2Ready ?? false,
    readyWindowEndsAtMs: room.readyState?.readyWindowEndsAtMs,
    reset,
  });
}

function createCountdownEvent(
  room: MatchRoom,
  serverTimestampMs: number,
  state: 'started' | 'stopped'
): MatchmakingEvent {
  return createMatchmakingEvent('match.countdown', serverTimestampMs, {
    roomId: room.roomId,
    matchId: room.matchId,
    state,
    countdownStartedAtMs: room.countdownState?.startedAtMs,
    countdownEndsAtMs: room.countdownState?.endsAtMs,
  });
}

interface CreateRoomOptions {
  mode: MatchRoomMode;
  status: MatchRoomStatus;
  playerIds: string[];
  isPrivateMatch: boolean;
  nowMs: number;
  roomId?: string;
  matchId?: string;
  cpuOpponentKey?: CpuOpponentKey;
}

function createRoom(options: CreateRoomOptions): MatchRoom {
  const room: MatchRoom = {
    roomId: options.roomId ?? randomUUID(),
    matchId: options.matchId ?? randomUUID(),
    mode: options.mode,
    status: options.status,
    createdAtMs: options.nowMs,
    updatedAtMs: options.nowMs,
    isPrivateMatch: options.isPrivateMatch,
    playerIds: [...options.playerIds],
  };

  if (options.cpuOpponentKey !== undefined) {
    room.cpuOpponentKey = options.cpuOpponentKey;
  }

  matchRooms.set(room.roomId, room);

  return room;
}

function assertRoomCapacityAvailable(): void {
  if (matchRooms.size >= MAX_ACTIVE_ROOMS) {
    throw new Error('Game rooms are full. Please return in 5 minutes.');
  }
}

function createMatchmakingEvent(
  name: MatchmakingEventName,
  serverTimestampMs: number,
  payload: Record<string, unknown>
): MatchmakingEvent {
  const event: MatchmakingEvent = {
    name,
    serverTimestampMs,
    payload,
  };

  const roomId = getStringPayload(payload, 'roomId');
  const matchId = getStringPayload(payload, 'matchId');

  if (roomId !== undefined) {
    event.roomId = roomId;
  }

  if (matchId !== undefined) {
    event.matchId = matchId;
  }

  return event;
}

function getStringPayload(payload: Record<string, unknown>, key: string): string | undefined {
  const value = payload[key];
  return typeof value === 'string' ? value : undefined;
}
