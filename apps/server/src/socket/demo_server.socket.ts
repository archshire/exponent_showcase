import type { Server, Socket } from 'socket.io';
import { prisma } from '@repo/db';
import { buildMatchSummaryHandoff, persistMatchSummary } from '../services/match-summary.service';
import { prismaMatchSummaryRepository } from '../repositories/match-summary.repository';
import { getCpuOpponentConfig } from '../config/cpu-opponents.config';
import {
  createPvpRoomDraft,
  getMatchRoom,
  joinPrivateRoom,
  leavePreMatchRoom,
  joinQuickMatchQueue,
  markPlayerReady,
  startPvcMatch,
  startPvpLiveMatch,
  stopReadyCountdown,
} from '../services/matchmaking.service';
import { isOnline } from '../services/presence.service';
import type { MatchRoom } from '../services/matchmaking.service';
import {
  activateDefend,
  completeLiveMatchReconnectResume,
  constructNextQuestion,
  endFightRound,
  finalizeMatchResult,
  getLiveMatchSession,
  markLiveMatchReconnectResumed,
  markQuestionStarted,
  pauseLiveMatchForReconnect,
  RECONNECT_GRACE_MS,
  removeLiveMatchSession,
  requestCpuAction,
  resolvePendingCorrectAnswer,
  resolveQuestionTimeout,
  startRoundPrep,
  submitAnswer,
  voidLiveMatchForReconnectFailure,
} from '../services/live-match.service';
import type { CpuOpponentKey } from '../config/cpu-opponents.config';
import type {
  CombatantSlot,
  LiveMatchEvent,
  LiveMatchResult,
  LiveMatchSession,
  SubmittedAnswerResult,
} from '../services/live-match.service';

type DemoMode = 'pvc' | 'pvp';

interface DemoStartPvcPayload {
  playerId: string;
  cpuOpponentKey?: CpuOpponentKey;
  avatar?: string;
  arenaId?: string;
}

interface DemoQueueJoinPayload {
  playerId: string;
  avatar?: string;
}

interface DemoAnswerPayload {
  matchId: string;
  playerId: string;
  answer: string;
}

interface DemoReadyPayload {
  roomId: string;
  playerId: string;
}

interface DemoDefendPayload {
  matchId: string;
  playerId: string;
}

interface DemoSocketContext {
  playerId?: string;
  matchId?: string;
  roomId?: string;
}

// Shared presentation for a player: emoji battle token + real account identity
// (so both clients render the same avatars, names and profile pictures).
interface PlayerPresentation {
  playerId: string;
  username: string;
  avatar: string;
  profilePictureUrl: string | null;
  identityImageSource: string;
  premadeAvatarKey: string | null;
  isCpu: boolean;
}

interface DemoSnapshot {
  mode: DemoMode;
  roomId: string;
  matchId: string;
  phase: LiveMatchSession['phase'] | 'summary';
  arenaId?: string;
  players?: Record<string, PlayerPresentation>;
  playerSlot?: CombatantSlot;
  question?: {
    sequence: number;
    prompt: string;
    difficulty: string;
    questionType: string;
    startedAtMs?: number;
    deadlineAtMs?: number;
  };
  combatants: LiveMatchSession['combatants'];
  roundNumber: number;
  roundWins: LiveMatchSession['roundWins'];
  tiedRoundCount: number;
  isFinalRound: boolean;
  roundClock?: {
    startedAtMs: number;
    deadlineAtMs: number;
  };
  reconnectState?: {
    status: 'reconnecting' | 'resuming';
    disconnectedSlot: CombatantSlot;
    startedAtMs: number;
    deadlineAtMs: number;
    resumedAtMs?: number;
    resumeDeadlineAtMs?: number;
  };
  eventLog: Array<{ name: string; message: string; serverTimestampMs: number; payload?: Record<string, unknown> }>;
  summary?: unknown;
}

interface DemoPreMatchSnapshot {
  mode: 'pvp';
  stage: 'ready';
  roomId: string;
  matchId: string;
  playerId?: string;
  arenaId?: string;
  isPrivateMatch?: boolean;
  players?: Record<string, PlayerPresentation>;
  readyState: {
    p1PlayerId?: string;
    p2PlayerId?: string;
    p1Ready: boolean;
    p2Ready: boolean;
    countdownStartedAtMs?: number;
    countdownEndsAtMs?: number;
    message?: string;
  };
}

const DEMO_PVC_START = 'demo.pvc.start';
const DEMO_QUEUE_JOIN = 'demo.queue.join';
const DEMO_READY_SET = 'demo.ready.set';
const DEMO_READY_STOP = 'demo.ready.stop';
const DEMO_PREMATCH_LEAVE = 'demo.prematch.leave';
const DEMO_MATCH_LEAVE = 'demo.match.leave';
const DEMO_PRIVATE_CREATE = 'demo.private.create';
const DEMO_PRIVATE_INVITE = 'demo.private.invite';
const DEMO_PRIVATE_ACCEPT = 'demo.private.accept';
const DEMO_PRIVATE_DECLINE = 'demo.private.decline';
const DEMO_INVITE_RECEIVED = 'demo.invite.received';
const DEMO_INVITE_DECLINED = 'demo.invite.declined';
const DEMO_ANSWER_SUBMIT = 'demo.answer.submit';
const DEMO_DEFEND_ACTIVATE = 'demo.defend.activate';
const DEMO_RECONNECT_RESUME = 'demo.reconnect.resume';
const DEMO_ERROR = 'demo.error';
const DEMO_STATE = 'demo.state';
const DEMO_REMATCH_REQUEST = 'demo.rematch.request';
const DEMO_REMATCH_ACCEPT = 'demo.rematch.accept';
const DEMO_REMATCH_REJECT = 'demo.rematch.reject';
const DEMO_REMATCH_RECEIVED = 'demo.rematch.received';
const DEMO_REMATCH_REJECTED = 'demo.rematch.rejected';
const DEMO_ANSWER_TYPING = 'demo.answer.typing';
const DEMO_FIGHT_ROUND_MS = 50_000;
const DEMO_ROUND_INTRO_MS = 2_400;

const eventLogs = new Map<string, DemoSnapshot['eventLog']>();
const matchPlayers = new Map<string, Map<string, CombatantSlot>>();
const timers = new Map<string, NodeJS.Timeout[]>();
const roundTimers = new Map<string, NodeJS.Timeout>();
const roundClocks = new Map<string, { startedAtMs: number; deadlineAtMs: number }>();
const reconnectTimers = new Map<string, NodeJS.Timeout>();

// Tracks players in any PvP room (queueing/ready/live). Used to block
// invites mid-fight. Key = playerId, value = matchId.
const pvpActivePlayers = new Map<string, string>();
// Pending rematch request per matchId: value = requesting playerId.
const rematchRequests = new Map<string, string>();

// --- Shared presentation (arena + avatars + profile pics), keyed by matchId ---
const DEFAULT_AVATAR = '🧮';
const ARENA_IDS = ['math-arena', 'tech-room', 'tech-wall', 'campus-entrance'] as const;

interface MatchPresentation {
  arenaId: string;
  players: Record<string, PlayerPresentation>;
}
const presentations = new Map<string, MatchPresentation>();

function randomArenaId(): string {
  return ARENA_IDS[Math.floor(Math.random() * ARENA_IDS.length)] ?? 'math-arena';
}

function setMatchArena(matchId: string, arenaId: string): void {
  const existing = presentations.get(matchId);
  if (existing !== undefined) {
    existing.arenaId = arenaId;
    return;
  }
  presentations.set(matchId, { arenaId, players: {} });
}

// Loads a human player's real identity (name + picture) from the DB and records
// it under the match, so every snapshot can render the same avatars/pictures.
async function addHumanPresentation(matchId: string, playerId: string, avatar: string): Promise<void> {
  const pres = presentations.get(matchId);
  if (pres === undefined) return;
  const profile = await prisma.playerProfile.findUnique({
    where: { playerId },
    select: {
      profilePictureUrl: true,
      premadeAvatarKey: true,
      identityImageSource: true,
      user: { select: { username: true } },
    },
  });
  pres.players[playerId] = {
    playerId,
    username: profile?.user.username ?? 'Player',
    avatar: avatar || DEFAULT_AVATAR,
    profilePictureUrl: profile?.profilePictureUrl ?? null,
    identityImageSource: profile?.identityImageSource ?? 'premade_avatar',
    premadeAvatarKey: profile?.premadeAvatarKey ?? null,
    isCpu: false,
  };
}

function addCpuPresentation(matchId: string, cpuCombatantId: string, cpuKey: CpuOpponentKey): void {
  const pres = presentations.get(matchId);
  if (pres === undefined) return;
  pres.players[cpuCombatantId] = {
    playerId: cpuCombatantId,
    username: getCpuOpponentConfig(cpuKey).displayName,
    avatar: DEFAULT_AVATAR,
    profilePictureUrl: null,
    identityImageSource: 'premade_avatar',
    premadeAvatarKey: null,
    isCpu: true,
  };
}

function clearPresentation(matchId: string): void {
  presentations.delete(matchId);
}

export function registerDemoRuntimeSocketHandlers(io: Server): void {
  io.on('connection', (socket) => {
    socket.on(DEMO_PVC_START, (payload: unknown) => {
      handlePvcStart(io, socket, payload);
    });

    socket.on(DEMO_QUEUE_JOIN, (payload: unknown) => {
      handleQueueJoin(io, socket, payload);
    });

    socket.on(DEMO_PRIVATE_CREATE, (payload: unknown) => {
      handlePrivateCreate(io, socket, payload);
    });

    socket.on(DEMO_PRIVATE_INVITE, (payload: unknown) => {
      handlePrivateInvite(io, socket, payload);
    });

    socket.on(DEMO_PRIVATE_ACCEPT, (payload: unknown) => {
      handlePrivateAccept(io, socket, payload);
    });

    socket.on(DEMO_PRIVATE_DECLINE, (payload: unknown) => {
      handlePrivateDecline(io, socket, payload);
    });

    socket.on(DEMO_READY_SET, (payload: unknown) => {
      handleReadySet(io, socket, payload);
    });

    socket.on(DEMO_READY_STOP, (payload: unknown) => {
      handleReadyStop(io, socket, payload);
    });

    socket.on(DEMO_PREMATCH_LEAVE, (payload: unknown) => {
      handlePrematchLeave(io, socket, payload);
    });

    socket.on(DEMO_ANSWER_SUBMIT, (payload: unknown) => {
      handleAnswerSubmit(io, socket, payload);
    });

    socket.on(DEMO_DEFEND_ACTIVATE, (payload: unknown) => {
      handleDefendActivate(io, socket, payload);
    });

    socket.on(DEMO_RECONNECT_RESUME, (payload: unknown) => {
      handleReconnectResume(io, socket, payload);
    });

    socket.on(DEMO_MATCH_LEAVE, () => {
      handleMatchLeave(io, socket);
    });

    socket.on(DEMO_REMATCH_REQUEST, (payload: unknown) => {
      handleRematchRequest(io, socket, payload);
    });

    socket.on(DEMO_REMATCH_ACCEPT, (payload: unknown) => {
      handleRematchAccept(io, socket, payload);
    });

    socket.on(DEMO_REMATCH_REJECT, (payload: unknown) => {
      handleRematchReject(io, socket, payload);
    });

    socket.on(DEMO_ANSWER_TYPING, (payload: unknown) => {
      handleAnswerTyping(io, socket, payload);
    });

    socket.on('disconnect', () => {
      handleSocketDisconnect(io, socket);
    });
  });
}

// When the socket is authenticated, the server-derived user id is authoritative
// and overrides any client-supplied playerId. This binds match progress to the
// real account and prevents a client from spoofing another player's identity.
// Anonymous sockets (no token) fall back to the client value for the demo.
function resolvePlayerId(socket: Socket, claimed: string): string {
  const authedUserId = (socket.data as { userId?: string }).userId;
  return authedUserId ?? claimed;
}

async function handlePvcStart(io: Server, socket: Socket, payload: unknown): Promise<void> {
  const parsed = parsePvcStartPayload(payload);
  if (parsed === null) {
    emitError(socket, 'INVALID_PAYLOAD', 'Invalid Demo 6 PvC start payload.');
    return;
  }
  parsed.playerId = resolvePlayerId(socket, parsed.playerId);

  try {
    const cpuKey = parsed.cpuOpponentKey ?? 'max';
    const result = startPvcMatch({ playerId: parsed.playerId, cpuOpponentKey: cpuKey });
    const session = result.value.liveMatchSession;
    const matchId = session.matchId;

    // Presentation: player picks the arena in PvC; load their identity + add the CPU.
    const arenaId = parsed.arenaId !== undefined && (ARENA_IDS as readonly string[]).includes(parsed.arenaId)
      ? parsed.arenaId
      : 'math-arena';
    setMatchArena(matchId, arenaId);
    await addHumanPresentation(matchId, parsed.playerId, parsed.avatar ?? DEFAULT_AVATAR);
    addCpuPresentation(matchId, session.combatants.p2.id, cpuKey);

    rememberSocketContext(socket, {
      playerId: parsed.playerId,
      matchId,
      roomId: session.roomId,
    });
    rememberPlayer(matchId, parsed.playerId, 'p1');
    socket.join(matchRoom(matchId));
    appendEvents(matchId, result.liveMatchEvents ?? []);
    emitSnapshot(io, socket, matchId, 'p1');
    beginQuestion(io, matchId);
  } catch (error) {
    emitError(socket, 'PVC_START_FAILED', toErrorMessage(error));
  }
}

async function handleQueueJoin(io: Server, socket: Socket, payload: unknown): Promise<void> {
  const parsed = parseQueueJoinPayload(payload);
  if (parsed === null) {
    emitError(socket, 'INVALID_PAYLOAD', 'Invalid Demo 6 queue payload.');
    return;
  }
  parsed.playerId = resolvePlayerId(socket, parsed.playerId);

  try {
    const result = joinQuickMatchQueue({ playerId: parsed.playerId });
    const matchId = result.room.matchId;
    pvpActivePlayers.set(parsed.playerId, matchId);
    rememberSocketContext(socket, {
      playerId: parsed.playerId,
      matchId,
      roomId: result.room.roomId,
    });
    socket.join(preMatchRoom(result.room.roomId));

    // Quick match: the server owns the arena (random, chosen once when the room
    // is first created). Each player's identity is loaded as they join. Player
    // order in the room decides position — playerIds[0] is left (p1).
    if (!presentations.has(matchId)) {
      setMatchArena(matchId, randomArenaId());
    }
    await addHumanPresentation(matchId, parsed.playerId, parsed.avatar ?? DEFAULT_AVATAR);

    if (!result.value.matched) {
      socket.emit(DEMO_STATE, {
        waiting: true,
        roomId: result.room.roomId,
        matchId,
        playerId: parsed.playerId,
      });
      return;
    }

    const p1QueuedPlayerId = result.room.playerIds[0];
    const p2QueuedPlayerId = result.room.playerIds[1];
    if (p1QueuedPlayerId === undefined || p2QueuedPlayerId === undefined) {
      throw new Error('Demo 6 PvP queue match is missing a player.');
    }

    emitPrematchSnapshotToRoom(io, result.room);
  } catch (error) {
    emitError(socket, 'QUEUE_JOIN_FAILED', toErrorMessage(error));
  }
}

// --- Private match: create room, invite a friend, accept/decline -----------

async function handlePrivateCreate(io: Server, socket: Socket, payload: unknown): Promise<void> {
  const record = asRecord(payload);
  const claimed = readString(record, 'playerId');
  if (claimed === undefined) {
    emitError(socket, 'INVALID_PAYLOAD', 'Invalid private create payload.');
    return;
  }
  const playerId = resolvePlayerId(socket, claimed);
  const avatar = readOptionalString(record, 'avatar') ?? DEFAULT_AVATAR;
  const requestedArena = readOptionalString(record, 'arenaId');
  const arenaId = requestedArena !== undefined && (ARENA_IDS as readonly string[]).includes(requestedArena)
    ? requestedArena
    : 'math-arena';

  try {
    const result = createPvpRoomDraft({ p1PlayerId: playerId, isPrivateMatch: true });
    const room = result.room;
    pvpActivePlayers.set(playerId, room.matchId);
    setMatchArena(room.matchId, arenaId);
    await addHumanPresentation(room.matchId, playerId, avatar);
    rememberSocketContext(socket, { playerId, matchId: room.matchId, roomId: room.roomId });
    socket.join(preMatchRoom(room.roomId));
    emitPrematchSnapshotToRoom(io, room);
  } catch (error) {
    emitError(socket, 'PRIVATE_CREATE_FAILED', toErrorMessage(error));
  }
}

async function handlePrivateInvite(io: Server, socket: Socket, payload: unknown): Promise<void> {
  const record = asRecord(payload);
  const roomId = readString(record, 'roomId');
  const friendId = readString(record, 'friendId');
  const fromUserId = (socket.data as { userId?: string }).userId;
  if (roomId === undefined || friendId === undefined || fromUserId === undefined) {
    emitError(socket, 'INVALID_PAYLOAD', 'Invalid private invite payload.');
    return;
  }

  const room = getMatchRoom(roomId);
  if (room === undefined || !room.isPrivateMatch) {
    emitError(socket, 'INVITE_FAILED', 'Private room not found.');
    return;
  }
  if (!isOnline(friendId)) {
    emitError(socket, 'FRIEND_OFFLINE', 'That friend is offline.');
    return;
  }

  // Block invite if the friend is already in a PvP room (queue/ready/live).
  if (pvpActivePlayers.has(friendId)) {
    const friendProfile = await prisma.user.findUnique({
      where: { id: friendId },
      select: { username: true },
    });
    const friendName = friendProfile?.username ?? 'Your friend';
    emitError(socket, 'FRIEND_IN_GAME', `${friendName} is in a fight! Try challenging ${friendName} later!`);
    return;
  }

  // Verify an accepted friendship in either direction.
  const friendship = await prisma.playerFriendship.findFirst({
    where: {
      status: 'accepted',
      OR: [
        { requesterPlayerId: fromUserId, receiverPlayerId: friendId },
        { requesterPlayerId: friendId, receiverPlayerId: fromUserId },
      ],
    },
    select: { id: true },
  });
  if (friendship === null) {
    emitError(socket, 'NOT_FRIENDS', 'You can only invite friends.');
    return;
  }

  const fromUsername = (socket.data as { username?: string }).username ?? 'A friend';
  io.to(`user:${friendId}`).emit(DEMO_INVITE_RECEIVED, {
    roomId,
    matchId: room.matchId,
    fromPlayerId: fromUserId,
    fromUsername,
  });
}

async function handlePrivateAccept(io: Server, socket: Socket, payload: unknown): Promise<void> {
  const record = asRecord(payload);
  const roomId = readString(record, 'roomId');
  const claimed = readString(record, 'playerId');
  if (roomId === undefined || claimed === undefined) {
    emitError(socket, 'INVALID_PAYLOAD', 'Invalid private accept payload.');
    return;
  }
  const playerId = resolvePlayerId(socket, claimed);
  const avatar = readOptionalString(record, 'avatar') ?? DEFAULT_AVATAR;

  // If the accepter is mid-PvC, void that match before joining the PvP room.
  const existingCtx = readSocketContext(socket);
  if (existingCtx?.matchId !== undefined) {
    const existing = getLiveMatchSession(existingCtx.matchId);
    if (existing !== null && existing.mode === 'pvc' && existing.phase !== 'ended') {
      clearMatchTimers(existingCtx.matchId);
      clearRoundTimer(existingCtx.matchId);
      clearReconnectTimer(existingCtx.matchId);
      matchPlayers.delete(existingCtx.matchId);
      clearPresentation(existingCtx.matchId);
      removeLiveMatchSession(existingCtx.matchId);
      socket.leave(matchRoom(existingCtx.matchId));
      clearSocketContext(socket);
    }
  }

  try {
    const result = joinPrivateRoom({ roomId, playerId });
    const room = result.room;
    pvpActivePlayers.set(playerId, room.matchId);
    await addHumanPresentation(room.matchId, playerId, avatar);
    rememberSocketContext(socket, { playerId, matchId: room.matchId, roomId: room.roomId });
    socket.join(preMatchRoom(room.roomId));
    emitPrematchSnapshotToRoom(io, room);
  } catch (error) {
    emitError(socket, 'PRIVATE_ACCEPT_FAILED', toErrorMessage(error));
  }
}

function handlePrivateDecline(io: Server, socket: Socket, payload: unknown): void {
  const record = asRecord(payload);
  const roomId = readString(record, 'roomId');
  if (roomId === undefined) {
    return;
  }
  const username = (socket.data as { username?: string }).username ?? 'Your friend';
  io.to(preMatchRoom(roomId)).emit(DEMO_INVITE_DECLINED, { roomId, byUsername: username });
}

function handleReadySet(io: Server, socket: Socket, payload: unknown): void {
  const parsed = parseReadyPayload(payload);
  if (parsed === null) {
    emitError(socket, 'INVALID_PAYLOAD', 'Invalid Demo 6 ready payload.');
    return;
  }

  parsed.playerId = resolvePlayerId(socket, parsed.playerId);

  try {
    const result = markPlayerReady(parsed);
    emitPrematchSnapshotToRoom(io, result.room);
    if (result.value.countdownStarted) {
      schedulePvpStart(io, result.room);
    }
  } catch (error) {
    emitError(socket, 'READY_FAILED', toErrorMessage(error));
  }
}

function handleReadyStop(io: Server, socket: Socket, payload: unknown): void {
  const parsed = parseReadyPayload(payload);
  if (parsed === null) {
    emitError(socket, 'INVALID_PAYLOAD', 'Invalid Demo 6 ready stop payload.');
    return;
  }

  parsed.playerId = resolvePlayerId(socket, parsed.playerId);

  try {
    const result = stopReadyCountdown(parsed);
    clearMatchTimers(result.room.matchId);
    emitPrematchSnapshotToRoom(io, result.room);
  } catch (error) {
    emitError(socket, 'READY_STOP_FAILED', toErrorMessage(error));
  }
}

function handlePrematchLeave(io: Server, socket: Socket, payload: unknown): void {
  const parsed = parseReadyPayload(payload);
  if (parsed === null) {
    emitError(socket, 'INVALID_PAYLOAD', 'Invalid Demo 6 prematch leave payload.');
    return;
  }

  parsed.playerId = resolvePlayerId(socket, parsed.playerId);

  try {
    const result = leavePreMatchRoom(parsed);
    clearMatchTimers(result.room.matchId);
    // Remove leaving player from the socket room first so the broadcast below
    // only reaches the remaining player (if any).
    socket.leave(preMatchRoom(result.room.roomId));
    pvpActivePlayers.delete(parsed.playerId);
    for (const pid of result.value.remainingPlayerIds) {
      pvpActivePlayers.delete(pid);
    }
    clearPresentation(result.room.matchId);
    // Send remaining players back to the Quick/Private choice screen.
    if (result.value.remainingPlayerIds.length > 0) {
      io.to(preMatchRoom(result.room.roomId)).emit(DEMO_STATE, { cancelled: true });
    }
    // Do NOT emit back to the leaving socket — leavePrematch() already called
    // reset() on the client, landing them on the Quick/Private choice screen.
  } catch (error) {
    emitError(socket, 'PREMATCH_LEAVE_FAILED', toErrorMessage(error));
  }
}

function handleAnswerSubmit(io: Server, socket: Socket, payload: unknown): void {
  const parsed = parseAnswerPayload(payload);
  if (parsed === null) {
    emitError(socket, 'INVALID_PAYLOAD', 'Invalid Demo 6 answer payload.');
    return;
  }
  parsed.playerId = resolvePlayerId(socket, parsed.playerId);

  const slot = getPlayerSlot(parsed.matchId, parsed.playerId);
  if (slot === undefined) {
    emitError(socket, 'NOT_MATCH_MEMBER', 'Player is not in this Demo 6 match.');
    return;
  }

  try {
    const result = submitAnswer(parsed.matchId, slot, parsed.answer);
    appendEvents(parsed.matchId, result.events);
    if (finishDemoMatchIfNeeded(io, parsed.matchId)) {
      return;
    }
    emitSnapshotToRoom(io, parsed.matchId);
    // In PvC, the player's correct answer is now a pending attack (a ~150ms
    // window before it lands). Give the CPU its reaction: a defender like
    // Shi-eld can raise its shield in that window to block and punish the hit.
    if (slot === 'p1' && result.value.pendingDrawWindowUntilMs !== undefined) {
      maybeCpuReactiveDefend(io, parsed.matchId);
    }
    schedulePostAnswerWork(io, result);
  } catch (error) {
    emitError(socket, 'ANSWER_FAILED', toErrorMessage(error));
  }
}

function handleDefendActivate(io: Server, socket: Socket, payload: unknown): void {
  const parsed = parseDefendPayload(payload);
  if (parsed === null) {
    emitError(socket, 'INVALID_PAYLOAD', 'Invalid Demo 6 DEFEND payload.');
    return;
  }
  parsed.playerId = resolvePlayerId(socket, parsed.playerId);

  const slot = getPlayerSlot(parsed.matchId, parsed.playerId);
  if (slot === undefined) {
    emitError(socket, 'NOT_MATCH_MEMBER', 'Player is not in this Demo 6 match.');
    return;
  }

  try {
    const result = activateDefend(parsed.matchId, slot);
    appendEvents(parsed.matchId, result.events);
    emitSnapshotToRoom(io, parsed.matchId);
  } catch (error) {
    emitError(socket, 'DEFEND_FAILED', toErrorMessage(error));
  }
}

function handleReconnectResume(io: Server, socket: Socket, payload: unknown): void {
  const parsed = parseDefendPayload(payload);
  if (parsed === null) {
    emitError(socket, 'INVALID_PAYLOAD', 'Invalid Demo 6 reconnect payload.');
    return;
  }
  parsed.playerId = resolvePlayerId(socket, parsed.playerId);

  const slot = getPlayerSlot(parsed.matchId, parsed.playerId);
  if (slot === undefined) {
    emitError(socket, 'NOT_MATCH_MEMBER', 'Player is not in this Demo 6 match.');
    return;
  }

  try {
    rememberSocketContext(socket, {
      playerId: parsed.playerId,
      matchId: parsed.matchId,
    });
    socket.join(matchRoom(parsed.matchId));
    const result = markLiveMatchReconnectResumed(parsed.matchId, slot);
    appendEvents(parsed.matchId, result.events);
    clearReconnectTimer(parsed.matchId);
    emitSnapshotToRoom(io, parsed.matchId);
    const resumeDeadlineAtMs = result.value.resumeDeadlineAtMs;
    if (resumeDeadlineAtMs !== undefined) {
      addTimer(
        parsed.matchId,
        setTimeout(() => {
          try {
            completeLiveMatchReconnectResume(parsed.matchId);
            startQuestionInCurrentRound(io, parsed.matchId);
          } catch (error) {
            emitError(socket, 'RECONNECT_RESUME_FAILED', toErrorMessage(error));
          }
        }, Math.max(0, resumeDeadlineAtMs - Date.now())),
      );
    }
  } catch (error) {
    emitError(socket, 'RECONNECT_RESUME_FAILED', toErrorMessage(error));
  }
}

function handleSocketDisconnect(io: Server, socket: Socket): void {
  const context = readSocketContext(socket);
  if (context?.matchId === undefined || context.playerId === undefined) {
    return;
  }

  const slot = getPlayerSlot(context.matchId, context.playerId);
  if (slot === undefined) {
    // Not in a live match — could be waiting in the queue or the ready room.
    cancelPreMatchIfQueued(io, context.roomId, context.playerId);
    return;
  }

  const session = getLiveMatchSession(context.matchId);
  if (
    session === null ||
    session.mode !== 'pvp' ||
    session.phase === 'ended' ||
    session.phase === 'reconnect_paused'
  ) {
    return;
  }

  try {
    clearMatchTimers(context.matchId);
    clearRoundTimer(context.matchId);
    const result = pauseLiveMatchForReconnect(context.matchId, slot);
    appendEvents(context.matchId, result.events);
    emitSnapshotToRoom(io, context.matchId);
    scheduleReconnectVoid(io, context.matchId, slot);
  } catch {
    // Disconnect cleanup should never crash the Socket.IO server.
  }
}

// Explicitly leaving a match (player navigated away / picked another opponent).
// The app socket stays connected — so unlike a disconnect, we must tear the
// match down here, leave its room, and clear the socket's match context, or a
// lingering PvC session would leak its state into the next match the player
// starts on the same socket.
function handleMatchLeave(io: Server, socket: Socket): void {
  const context = readSocketContext(socket);
  if (context?.matchId === undefined) {
    return;
  }

  const matchId = context.matchId;
  socket.leave(matchRoom(matchId));
  if (context.roomId !== undefined) {
    socket.leave(preMatchRoom(context.roomId));
  }

  const session = getLiveMatchSession(matchId);

  // PvP: let the opponent resolve via the normal disconnect/void path so they
  // aren't stranded; the leaver forfeits exactly as if they'd dropped.
  if (
    session !== null &&
    session.mode === 'pvp' &&
    session.phase !== 'ended' &&
    session.phase !== 'reconnect_paused' &&
    context.playerId !== undefined
  ) {
    const slot = getPlayerSlot(matchId, context.playerId);
    if (slot !== undefined) {
      try {
        clearMatchTimers(matchId);
        clearRoundTimer(matchId);
        const result = pauseLiveMatchForReconnect(matchId, slot);
        appendEvents(matchId, result.events);
        emitSnapshotToRoom(io, matchId);
        scheduleReconnectVoid(io, matchId, slot);
      } catch {
        /* never crash on leave */
      }
    }
    clearSocketContext(socket);
    return;
  }

  // Pre-match queue / ready room: no live session yet, remove from queue.
  cancelPreMatchIfQueued(io, context.roomId, context.playerId);

  // PvC (or an already-finished match): fully discard it so nothing leaks.
  clearMatchTimers(matchId);
  clearRoundTimer(matchId);
  clearReconnectTimer(matchId);
  matchPlayers.delete(matchId);
  rematchRequests.delete(matchId);
  if (context.playerId !== undefined) pvpActivePlayers.delete(context.playerId);
  clearPresentation(matchId);
  removeLiveMatchSession(matchId);
  clearSocketContext(socket);
}

function cancelPreMatchIfQueued(
  io: Server,
  roomId: string | undefined,
  playerId: string | undefined,
): void {
  if (roomId === undefined || playerId === undefined) return;
  const room = getMatchRoom(roomId);
  if (room === undefined || room.status === 'live' || room.status === 'cancelled') return;
  try {
    const result = leavePreMatchRoom({ roomId, playerId });

    // Cancel the room: evict everyone and send remaining players home.
    for (const pid of result.room.playerIds) {
      pvpActivePlayers.delete(pid);
    }
    pvpActivePlayers.delete(playerId);
    clearPresentation(result.room.matchId);
    if (result.value.remainingPlayerIds.length > 0) {
      // Disconnecting player already left the socket room via disconnect.
      // Remaining players receive cancelled → client calls reset() → Quick/Private screen.
      io.to(preMatchRoom(roomId)).emit(DEMO_STATE, { cancelled: true });
    }
  } catch {
    // Best effort — don't crash on cleanup.
  }
}

// ---------------------------------------------------------------------------
// Rematch flow
// ---------------------------------------------------------------------------

function handleRematchRequest(io: Server, socket: Socket, payload: unknown): void {
  const record = asRecord(payload);
  const matchId = readString(record, 'matchId');
  if (matchId === undefined) return;

  const context = readSocketContext(socket);
  const playerId = context?.playerId ?? (socket.data as { userId?: string }).userId;
  if (playerId === undefined) return;

  // Only valid after a completed match.
  const session = getLiveMatchSession(matchId);
  if (session === null || session.phase !== 'ended') return;

  rematchRequests.set(matchId, playerId);

  // Notify the other player.
  const players = matchPlayers.get(matchId);
  if (players === undefined) return;
  const fromUsername = (socket.data as { username?: string }).username ?? 'Opponent';
  for (const [pid] of players) {
    if (pid !== playerId) {
      io.to(`user:${pid}`).emit(DEMO_REMATCH_RECEIVED, { matchId, fromUsername });
    }
  }
}

async function handleRematchAccept(io: Server, socket: Socket, payload: unknown): Promise<void> {
  const record = asRecord(payload);
  const matchId = readString(record, 'matchId');
  if (matchId === undefined) return;

  const context = readSocketContext(socket);
  const accepterId = context?.playerId ?? (socket.data as { userId?: string }).userId;
  if (accepterId === undefined) return;

  const requesterId = rematchRequests.get(matchId);
  if (requesterId === undefined) {
    emitError(socket, 'REMATCH_FAILED', 'No pending rematch request.');
    return;
  }
  rematchRequests.delete(matchId);

  // Pull existing presentation to reuse arena + avatars.
  const oldPres = presentations.get(matchId);
  const arenaId = oldPres?.arenaId ?? 'math-arena';
  const requesterAvatar = oldPres?.players[requesterId]?.avatar ?? DEFAULT_AVATAR;
  const accepterAvatar = oldPres?.players[accepterId]?.avatar ?? DEFAULT_AVATAR;

  try {
    const draft = createPvpRoomDraft({ p1PlayerId: requesterId, p2PlayerId: accepterId });
    const room = draft.room;
    setMatchArena(room.matchId, arenaId);
    await addHumanPresentation(room.matchId, requesterId, requesterAvatar);
    await addHumanPresentation(room.matchId, accepterId, accepterAvatar);
    pvpActivePlayers.set(requesterId, room.matchId);
    pvpActivePlayers.set(accepterId, room.matchId);

    // Move both sockets into the new prematch room.
    io.in(matchRoom(matchId)).socketsLeave(matchRoom(matchId));
    const requesterSocket = (await io.in(`user:${requesterId}`).fetchSockets())[0];
    const accepterSocket = (await io.in(`user:${accepterId}`).fetchSockets())[0];
    if (requesterSocket !== undefined) {
      requesterSocket.data.demo = { playerId: requesterId, matchId: room.matchId, roomId: room.roomId };
      requesterSocket.join(preMatchRoom(room.roomId));
    }
    if (accepterSocket !== undefined) {
      accepterSocket.data.demo = { playerId: accepterId, matchId: room.matchId, roomId: room.roomId };
      accepterSocket.join(preMatchRoom(room.roomId));
    }

    emitPrematchSnapshotToRoom(io, room);
  } catch (error) {
    emitError(socket, 'REMATCH_FAILED', toErrorMessage(error));
  }
}

function handleAnswerTyping(io: Server, _socket: Socket, payload: unknown): void {
  const record = asRecord(payload);
  const matchId = readString(record, 'matchId');
  const playerId = readString(record, 'playerId');
  const partial = readString(record, 'partial') ?? '';
  if (matchId === undefined || playerId === undefined) return;

  const session = getLiveMatchSession(matchId);
  if (session === null || session.phase !== 'question_active') return;

  const players = matchPlayers.get(matchId);
  if (players === undefined) return;

  for (const [pid] of players) {
    if (pid !== playerId) {
      io.to(`user:${pid}`).emit(DEMO_ANSWER_TYPING, { partial });
    }
  }
}

function handleRematchReject(io: Server, _socket: Socket, payload: unknown): void {
  const record = asRecord(payload);
  const matchId = readString(record, 'matchId');
  if (matchId === undefined) return;

  const requesterId = rematchRequests.get(matchId);
  rematchRequests.delete(matchId);
  if (requesterId === undefined) return;

  io.to(`user:${requesterId}`).emit(DEMO_REMATCH_REJECTED, { matchId });
}

function beginQuestion(io: Server, matchId: string): void {
  const session = getLiveMatchSession(matchId);
  if (session === null || session.phase === 'ended') {
    emitSummaryIfReady(io, matchId);
    return;
  }

  clearMatchTimers(matchId);

  const startsNewRound = session.roundNumber === 0 || session.phase === 'round_ended';
  if (startsNewRound) {
    const isFirstRound = session.roundNumber === 0;
    appendEvents(matchId, startRoundPrep(matchId).events);
    startDemoFightRoundClock(io, matchId);
    if (!isFirstRound) {
      emitSnapshotToRoom(io, matchId);
      addTimer(
        matchId,
        setTimeout(() => startQuestionInCurrentRound(io, matchId), DEMO_ROUND_INTRO_MS),
      );
      return;
    }
  }

  startQuestionInCurrentRound(io, matchId);
}

function startQuestionInCurrentRound(io: Server, matchId: string): void {
  const session = getLiveMatchSession(matchId);
  if (session === null || session.phase === 'ended') {
    emitSummaryIfReady(io, matchId);
    return;
  }

  appendEvents(matchId, constructNextQuestion(matchId).events);
  const started = markQuestionStarted(matchId);
  appendEvents(matchId, started.events);
  emitSnapshotToRoom(io, matchId);
  scheduleQuestionTimeout(io, started.session);
  scheduleCpuAction(io, started.session);
}

function scheduleQuestionTimeout(io: Server, session: LiveMatchSession): void {
  const deadline = session.currentQuestion?.deadlineAtMs;
  if (deadline === undefined) {
    return;
  }

  addTimer(
    session.matchId,
    setTimeout(() => {
      const result = resolveQuestionTimeout(session.matchId);
      appendEvents(session.matchId, result.events);
      if (finishDemoMatchIfNeeded(io, session.matchId)) {
        return;
      }
      emitSnapshotToRoom(io, session.matchId);
      if (result.events.length > 0) {
        scheduleNextQuestionOrSummary(io, session.matchId);
      }
    }, Math.max(0, deadline - Date.now() + 30)),
  );
}

// Reactive defend: called when the player's attack is pending (the ~150ms
// window before it lands). Asks the CPU profile — with playerAttackIncoming —
// whether to block; if so, raises its shield immediately so the attack resolves
// into a block (the shield stays up long enough to cover the pending window).
// This is what makes Shi-eld actually punish your attacks. Min/Max can't defend,
// so they no-op here.
function maybeCpuReactiveDefend(io: Server, matchId: string): void {
  const session = getLiveMatchSession(matchId);
  if (session === null || session.mode !== 'pvc' || session.phase !== 'question_active') {
    return;
  }
  if (!session.combatants.p2.defendAvailable) {
    return;
  }

  try {
    const decision = requestCpuAction(matchId, { playerAttackIncoming: true });
    appendEvents(matchId, decision.events);
    if (decision.value.action !== 'defend') {
      return;
    }
    const result = activateDefend(matchId, 'p2');
    appendEvents(matchId, result.events);
    emitSnapshotToRoom(io, matchId);
  } catch {
    // A blocked reaction must never crash the player's answer flow.
  }
}

function scheduleCpuAction(io: Server, session: LiveMatchSession): void {
  if (session.mode !== 'pvc' || session.phase !== 'question_active') {
    return;
  }

  const decision = requestCpuAction(session.matchId);
  appendEvents(session.matchId, decision.events);
  if (decision.value.action === 'answer' && decision.value.performAtMs !== undefined) {
    addTimer(
      session.matchId,
      setTimeout(() => {
        const answer = decision.value.answer ?? '';
        const result = submitAnswer(session.matchId, 'p2', answer);
        appendEvents(session.matchId, result.events);
        if (finishDemoMatchIfNeeded(io, session.matchId)) {
          return;
        }
        emitSnapshotToRoom(io, session.matchId);
        schedulePostAnswerWork(io, result);
      }, Math.max(0, decision.value.performAtMs - Date.now())),
    );
  }

  if (decision.value.action === 'defend') {
    addTimer(
      session.matchId,
      setTimeout(() => {
        const result = activateDefend(session.matchId, 'p2');
        appendEvents(session.matchId, result.events);
        emitSnapshotToRoom(io, session.matchId);
      }, Math.max(0, (decision.value.performAtMs ?? Date.now()) - Date.now())),
    );
  }
}

function schedulePostAnswerWork(io: Server, result: LiveMatchResult<SubmittedAnswerResult>): void {
  if (result.value.pendingDrawWindowUntilMs !== undefined) {
    addTimer(
      result.session.matchId,
      setTimeout(() => {
        const resolved = resolvePendingCorrectAnswer(result.session.matchId);
        appendEvents(result.session.matchId, resolved.events);
        if (finishDemoMatchIfNeeded(io, result.session.matchId)) {
          return;
        }
        emitSnapshotToRoom(io, result.session.matchId);
        scheduleNextQuestionOrSummary(io, result.session.matchId);
      }, Math.max(0, result.value.pendingDrawWindowUntilMs - Date.now() + 30)),
    );
    return;
  }

  if (result.events.some((event) => event.name === 'missed')) {
    return;
  }

  if (result.events.some((event) => event.name === 'draw.triggered')) {
    scheduleNextQuestionOrSummary(io, result.session.matchId);
    return;
  }

  if (
    result.events.some((event) =>
      event.name === 'attack.landed' ||
      event.name === 'revenge.attack_landed' ||
      event.name === 'defend.blocked'
    )
  ) {
    scheduleNextQuestionOrSummary(io, result.session.matchId);
  }
}

function scheduleNextQuestionOrSummary(io: Server, matchId: string): void {
  scheduleNextQuestionOrSummaryAfter(io, matchId, 0);
}

function scheduleNextQuestionOrSummaryAfter(io: Server, matchId: string, delayMs: number): void {
  addTimer(
    matchId,
    setTimeout(() => {
      const session = getLiveMatchSession(matchId);
      if (session === null) {
        return;
      }

      if (session.phase === 'ended') {
        emitSummaryIfReady(io, matchId);
        return;
      }

      beginQuestion(io, matchId);
    }, delayMs),
  );
}

function startDemoFightRoundClock(io: Server, matchId: string): void {
  clearRoundTimer(matchId);
  const startedAtMs = Date.now();
  const deadlineAtMs = startedAtMs + DEMO_FIGHT_ROUND_MS;
  roundClocks.set(matchId, { startedAtMs, deadlineAtMs });

  const timer = setTimeout(() => {
    try {
      const result = endFightRound(matchId);
      appendEvents(matchId, result.events);
      emitSnapshotToRoom(io, matchId);
      if (result.value.matchEnded) {
        emitSummaryIfReady(io, matchId);
        return;
      }
      scheduleNextQuestionOrSummaryAfter(io, matchId, 1400);
    } catch {
      // The demo session may already have ended by KO or reset.
    }
  }, DEMO_FIGHT_ROUND_MS);

  roundTimers.set(matchId, timer);
}

function finishDemoMatchIfNeeded(io: Server, matchId: string): boolean {
  const session = getLiveMatchSession(matchId);
  if (session === null) {
    return false;
  }

  if (session.phase === 'ended') {
    emitSummaryIfReady(io, matchId);
    return true;
  }

  const hasKo = session.combatants.p1.hp <= 0 || session.combatants.p2.hp <= 0;
  if (!hasKo) {
    return false;
  }

  clearMatchTimers(matchId);
  clearRoundTimer(matchId);
  const result = endFightRound(matchId);
  appendEvents(matchId, result.events);
  emitSnapshotToRoom(io, matchId);
  if (result.value.matchEnded) {
    emitSummaryIfReady(io, matchId);
    return true;
  }
  scheduleNextQuestionOrSummaryAfter(io, matchId, 1400);
  return true;
}

function schedulePvpStart(io: Server, room: MatchRoom): void {
  const countdownEndsAtMs = room.countdownState?.endsAtMs;
  if (countdownEndsAtMs === undefined) {
    return;
  }

  clearMatchTimers(room.matchId);
  addTimer(
    room.matchId,
    setTimeout(() => {
      try {
        const start = startPvpLiveMatch({
          roomId: room.roomId,
          requireCountdownComplete: true,
        });
        const matchId = start.value.liveMatchSession.matchId;
        const p1PlayerId = start.value.liveMatchSession.combatants.p1.id;
        const p2PlayerId = start.value.liveMatchSession.combatants.p2.id;

        rememberPlayer(matchId, p1PlayerId, 'p1');
        rememberPlayer(matchId, p2PlayerId, 'p2');
        io.in(preMatchRoom(room.roomId)).socketsJoin(matchRoom(matchId));
        appendMatchmakingEvents(matchId, start.events);
        appendEvents(matchId, start.liveMatchEvents ?? []);
        emitSnapshotToRoom(io, matchId);
        beginQuestion(io, matchId);
      } catch {
        emitPrematchSnapshotToRoom(io, room);
      }
    }, Math.max(0, countdownEndsAtMs - Date.now())),
  );
}

function emitSummaryIfReady(io: Server, matchId: string): void {
  const session = getLiveMatchSession(matchId);
  if (session === null || session.phase !== 'ended') {
    return;
  }

  const finalResult = finalizeMatchResult(matchId);
  appendEvents(matchId, finalResult.events);
  const handoff = buildMatchSummaryHandoff(finalResult.value);
  clearMatchTimers(matchId);
  clearRoundTimer(matchId);
  clearReconnectTimer(matchId);
  // Release PvP active-player slots so both players can receive invites again.
  for (const [pid, mid] of pvpActivePlayers) {
    if (mid === matchId) pvpActivePlayers.delete(pid);
  }
  io.to(matchRoom(matchId)).emit(DEMO_STATE, buildSnapshot(finalResult.session, undefined, handoff.resultsPayload));

  // Persist results (PvP history, Aura, CPU wins, tutorial completion, unlock
  // grants) out of band so the results screen isn't blocked on the DB write.
  void persistMatchSummary(handoff, prismaMatchSummaryRepository).catch((error) => {
    console.error(`Failed to persist match summary for ${matchId}:`, error);
  });
}

function emitSnapshot(_io: Server, socket: Socket, matchId: string, playerSlot?: CombatantSlot): void {
  const session = getLiveMatchSession(matchId);
  if (session !== null) {
    socket.emit(DEMO_STATE, buildSnapshot(session, playerSlot));
  }
}

function emitSnapshotToRoom(io: Server, matchId: string): void {
  const session = getLiveMatchSession(matchId);
  if (session !== null) {
    io.to(matchRoom(matchId)).emit(DEMO_STATE, buildSnapshot(session));
  }
}

function emitPrematchSnapshotToRoom(io: Server, room: MatchRoom): void {
  io.to(preMatchRoom(room.roomId)).emit(DEMO_STATE, buildPreMatchSnapshot(room));
}

function buildPreMatchSnapshot(
  room: MatchRoom,
  options: { message?: string } = {},
): DemoPreMatchSnapshot {
  const readyState = room.readyState;
  const snapshot: DemoPreMatchSnapshot = {
    mode: 'pvp',
    stage: 'ready',
    roomId: room.roomId,
    matchId: room.matchId,
    isPrivateMatch: room.isPrivateMatch,
    readyState: {
      p1Ready: readyState?.p1Ready ?? false,
      p2Ready: readyState?.p2Ready ?? false,
    },
  };

  const pres = presentations.get(room.matchId);
  if (pres !== undefined) {
    snapshot.arenaId = pres.arenaId;
    snapshot.players = pres.players;
  }

  const p1PlayerId = room.playerIds[0];
  if (p1PlayerId !== undefined) {
    snapshot.readyState.p1PlayerId = p1PlayerId;
  }

  const p2PlayerId = room.playerIds[1];
  if (p2PlayerId !== undefined) {
    snapshot.readyState.p2PlayerId = p2PlayerId;
  }

  if (room.countdownState !== undefined) {
    snapshot.readyState.countdownStartedAtMs = room.countdownState.startedAtMs;
    snapshot.readyState.countdownEndsAtMs = room.countdownState.endsAtMs;
  }

  if (options.message !== undefined) {
    snapshot.readyState.message = options.message;
  }

  return snapshot;
}

function buildSnapshot(
  session: LiveMatchSession,
  playerSlot?: CombatantSlot,
  summary?: unknown,
): DemoSnapshot {
  const snapshot: DemoSnapshot = {
    mode: session.mode,
    roomId: session.roomId,
    matchId: session.matchId,
    phase: summary === undefined ? session.phase : 'summary',
    combatants: session.combatants,
    roundNumber: session.roundNumber,
    roundWins: session.roundWins,
    tiedRoundCount: session.tiedRoundCount,
    isFinalRound: session.isFinalRound,
    eventLog: eventLogs.get(session.matchId) ?? [],
  };

  const pres = presentations.get(session.matchId);
  if (pres !== undefined) {
    snapshot.arenaId = pres.arenaId;
    snapshot.players = pres.players;
  }

  const roundClock = roundClocks.get(session.matchId);
  if (roundClock !== undefined && summary === undefined) {
    snapshot.roundClock = roundClock;
  }

  if (playerSlot !== undefined) {
    snapshot.playerSlot = playerSlot;
  }

  if (session.currentQuestion !== undefined) {
    const question: DemoSnapshot['question'] = {
      sequence: session.currentQuestion.sequence,
      prompt: session.currentQuestion.question.prompt,
      difficulty: session.currentQuestion.question.difficulty,
      questionType: session.currentQuestion.question.questionType,
    };

    if (session.currentQuestion.startedAtMs !== undefined) {
      question.startedAtMs = session.currentQuestion.startedAtMs;
    }

    if (session.currentQuestion.deadlineAtMs !== undefined) {
      question.deadlineAtMs = session.currentQuestion.deadlineAtMs;
    }

    snapshot.question = question;
  }

  if (session.reconnectState !== undefined && summary === undefined) {
    const reconnectState: DemoSnapshot['reconnectState'] = {
      status: session.reconnectState.status,
      disconnectedSlot: session.reconnectState.disconnectedSlot,
      startedAtMs: session.reconnectState.startedAtMs,
      deadlineAtMs: session.reconnectState.deadlineAtMs,
    };

    if (session.reconnectState.resumedAtMs !== undefined) {
      reconnectState.resumedAtMs = session.reconnectState.resumedAtMs;
    }

    if (session.reconnectState.resumeDeadlineAtMs !== undefined) {
      reconnectState.resumeDeadlineAtMs = session.reconnectState.resumeDeadlineAtMs;
    }

    snapshot.reconnectState = reconnectState;
  }

  if (summary !== undefined) {
    snapshot.summary = summary;
  }

  return snapshot;
}

function appendEvents(matchId: string, events: readonly LiveMatchEvent[]): void {
  if (events.length === 0) {
    return;
  }

  const existing = eventLogs.get(matchId) ?? [];
  const next = [
    ...events.map((event) => ({
      name: event.name,
      message: formatEventMessage(event),
      serverTimestampMs: event.serverTimestampMs,
      payload: event.payload,
    })),
    ...existing,
  ].slice(0, 8);
  eventLogs.set(matchId, next);
}

function appendMatchmakingEvents(
  matchId: string,
  events: ReadonlyArray<{ name: string; serverTimestampMs: number }>,
): void {
  if (events.length === 0) {
    return;
  }

  const existing = eventLogs.get(matchId) ?? [];
  const next = [
    ...events.map((event) => ({
      name: event.name,
      message: event.name === 'match.countdown' ? 'PvP ready. Starting match.' : 'Player ready.',
      serverTimestampMs: event.serverTimestampMs,
    })),
    ...existing,
  ].slice(0, 8);
  eventLogs.set(matchId, next);
}

function formatEventMessage(event: LiveMatchEvent): string {
  switch (event.name) {
    case 'question.started':
      return `Question ${(event.payload.sequence as number | undefined) ?? ''} started.`;
    case 'attack.landed':
      return `${event.payload.attackerSlot} hit ${event.payload.targetCombatantSlot} for ${event.payload.damage}.`;
    case 'revenge.attack_landed':
      return `REVENGE ATT! ${event.payload.attackerSlot} hit for ${event.payload.damage}.`;
    case 'defend.activated':
      return `${event.payload.combatantSlot} DEFEND!`;
    case 'defend.blocked':
      return `${event.payload.defenderSlot} BLOCK SUCCESS!`;
    case 'missed':
      return `${event.payload.combatantSlot} MISSED!`;
    case 'shock.applied':
      return 'SHOCK! Both players take damage.';
    case 'draw.triggered':
      return 'DRAW! Additional damage armed.';
    case 'revenge.activated':
      return `${event.payload.combatantSlot} REVENGE ready.`;
    case 'reconnect.paused':
      return `${event.payload.disconnectedSlot} disconnected. Reconnecting...`;
    case 'reconnect.resumed':
      return `${event.payload.returningSlot} reconnected. Get ready.`;
    case 'match.voided':
      return `Match voided: ${String(event.payload.voidReason ?? 'reconnect failed')}.`;
    case 'match.ended':
      return `Match ended. Winner: ${String(event.payload.winnerSlot ?? 'none')}.`;
    case 'results.ready':
      return 'Summary ready.';
    default:
      return event.name;
  }
}

function rememberPlayer(matchId: string, playerId: string, slot: CombatantSlot): void {
  const players = matchPlayers.get(matchId) ?? new Map<string, CombatantSlot>();
  players.set(playerId, slot);
  matchPlayers.set(matchId, players);
}

function getPlayerSlot(matchId: string, playerId: string): CombatantSlot | undefined {
  return matchPlayers.get(matchId)?.get(playerId);
}

function addTimer(matchId: string, timer: NodeJS.Timeout): void {
  const list = timers.get(matchId) ?? [];
  list.push(timer);
  timers.set(matchId, list);
}

function clearMatchTimers(matchId: string): void {
  for (const timer of timers.get(matchId) ?? []) {
    clearTimeout(timer);
  }
  timers.delete(matchId);
}

function clearRoundTimer(matchId: string): void {
  const timer = roundTimers.get(matchId);
  if (timer !== undefined) {
    clearTimeout(timer);
    roundTimers.delete(matchId);
  }
  roundClocks.delete(matchId);
}

function scheduleReconnectVoid(io: Server, matchId: string, dcSlot: CombatantSlot): void {
  clearReconnectTimer(matchId);
  const timer = setTimeout(() => {
    try {
      const result = voidLiveMatchForReconnectFailure(matchId, {
        dcSlot,
        reason: 'reconnect_timeout',
      });
      appendEvents(matchId, result.events);
      clearMatchTimers(matchId);
      clearRoundTimer(matchId);
      emitSnapshotToRoom(io, matchId);
      emitSummaryIfReady(io, matchId);
    } catch {
      // The match may have resumed or ended through another path.
    } finally {
      reconnectTimers.delete(matchId);
    }
  }, RECONNECT_GRACE_MS);
  reconnectTimers.set(matchId, timer);
}

function clearReconnectTimer(matchId: string): void {
  const timer = reconnectTimers.get(matchId);
  if (timer !== undefined) {
    clearTimeout(timer);
    reconnectTimers.delete(matchId);
  }
}

function rememberSocketContext(socket: Socket, context: DemoSocketContext): void {
  const current = readSocketContext(socket) ?? {};
  socket.data.demo = { ...current, ...context };
}

function readSocketContext(socket: Socket): DemoSocketContext | undefined {
  const context = socket.data.demo;
  if (context === undefined || typeof context !== 'object' || context === null) {
    return undefined;
  }
  return context as DemoSocketContext;
}

function clearSocketContext(socket: Socket): void {
  delete socket.data.demo;
}

function parsePvcStartPayload(payload: unknown): DemoStartPvcPayload | null {
  const record = asRecord(payload);
  const playerId = readString(record, 'playerId');
  const cpuOpponentKey = readOptionalString(record, 'cpuOpponentKey') as CpuOpponentKey | undefined;
  if (playerId === undefined) {
    return null;
  }

  const parsed: DemoStartPvcPayload = { playerId };
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
  return parsed;
}

function parseQueueJoinPayload(payload: unknown): DemoQueueJoinPayload | null {
  const record = asRecord(payload);
  const playerId = readString(record, 'playerId');
  if (playerId === undefined) {
    return null;
  }
  const parsed: DemoQueueJoinPayload = { playerId };
  const avatar = readOptionalString(record, 'avatar');
  if (avatar !== undefined) {
    parsed.avatar = avatar;
  }
  return parsed;
}

function parseReadyPayload(payload: unknown): DemoReadyPayload | null {
  const record = asRecord(payload);
  const roomId = readString(record, 'roomId');
  const playerId = readString(record, 'playerId');
  return roomId === undefined || playerId === undefined ? null : { roomId, playerId };
}

function parseAnswerPayload(payload: unknown): DemoAnswerPayload | null {
  const record = asRecord(payload);
  const matchId = readString(record, 'matchId');
  const playerId = readString(record, 'playerId');
  const answer = readString(record, 'answer');
  return matchId === undefined || playerId === undefined || answer === undefined
    ? null
    : { matchId, playerId, answer };
}

function parseDefendPayload(payload: unknown): DemoDefendPayload | null {
  const record = asRecord(payload);
  const matchId = readString(record, 'matchId');
  const playerId = readString(record, 'playerId');
  return matchId === undefined || playerId === undefined ? null : { matchId, playerId };
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function readString(record: Record<string, unknown>, key: string): string | undefined {
  const value = record[key];
  return typeof value === 'string' && value.trim() !== '' ? value : undefined;
}

function readOptionalString(record: Record<string, unknown>, key: string): string | undefined {
  return readString(record, key);
}

function emitError(socket: Socket, code: string, message: string): void {
  socket.emit(DEMO_ERROR, { code, message });
}

function matchRoom(matchId: string): string {
  return `demo:match:${matchId}`;
}

function preMatchRoom(roomId: string): string {
  return `demo:room:${roomId}`;
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown Demo 6 runtime error.';
}
