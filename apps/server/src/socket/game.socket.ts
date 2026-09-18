import type { Server, Socket } from 'socket.io';
import { prisma } from '@repo/db';
import { buildMatchSummaryHandoff, persistMatchSummary } from '../services/match-summary.service';
import {
  ARENA_IDS,
  DEFAULT_AVATAR,
  addCpuPresentation,
  addHumanPresentation,
  clearPresentation,
  getMatchPresentation,
  randomArenaId,
  setMatchArena,
} from './game/presentation';
import type { PlayerPresentation } from './game/presentation';
import {
  asRecord,
  matchRoom,
  parseAnswerPayload,
  parseDefendPayload,
  parseDifficulty,
  parsePvcStartPayload,
  parseQueueJoinPayload,
  parseReadyPayload,
  preMatchRoom,
  readOptionalString,
  readString,
  toErrorMessage,
} from './game/parsers';
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
  QUESTION_DURATION_MS,
  RECONNECT_GRACE_MS,
  removeLiveMatchSession,
  requestCpuAction,
  resolvePendingCorrectAnswer,
  resolveQuestionTimeout,
  revertReconnectResumeToReconnecting,
  startRoundPrep,
  submitAnswer,
  voidLiveMatchForReconnectFailure,
} from '../services/live-match.service';
import type {
  CombatantSlot,
  LiveMatchEvent,
  LiveMatchResult,
  LiveMatchSession,
  SubmittedAnswerResult,
} from '../services/live-match.service';
import type { Difficulty } from '../services/question-generator.service';

type GameMode = 'pvc' | 'pvp';

const VERY_HARD_PVP_THRESHOLD = 50;

interface GameSocketContext {
  playerId?: string;
  matchId?: string;
  roomId?: string;
}

interface GameSnapshot {
  mode: GameMode;
  roomId: string;
  matchId: string;
  phase: LiveMatchSession['phase'] | 'summary';
  matchDifficulty?: Difficulty;
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
    /** Set while paused for a reconnect: the attack gauge's exact fill at disconnect, frozen until resume. */
    frozenProgressPercent?: number;
  };
  combatants: LiveMatchSession['combatants'];
  roundNumber: number;
  roundWins: LiveMatchSession['roundWins'];
  tiedRoundCount: number;
  isFinalRound: boolean;
  roundClock?: {
    startedAtMs?: number;
    deadlineAtMs?: number;
    /** Set while paused for a reconnect: the exact time left when disconnected, frozen until resume. */
    frozenSecondsLeft?: number;
  };
  reconnectState?: {
    status: 'reconnecting' | 'resuming';
    disconnectedSlot: CombatantSlot;
    startedAtMs: number;
    deadlineAtMs: number;
    resumedAtMs?: number;
    resumeDeadlineAtMs?: number;
  };
  eventLog: Array<{
    name: string;
    message: string;
    serverTimestampMs: number;
    payload?: Record<string, unknown>;
  }>;
  summary?: unknown;
}

interface GamePreMatchSnapshot {
  mode: 'pvp';
  stage: 'ready';
  roomId: string;
  matchId: string;
  playerId?: string;
  arenaId?: string;
  isPrivateMatch?: boolean;
  matchDifficulty?: Difficulty;
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

const GAME_PVC_START = 'game.pvc.start';
const GAME_QUEUE_JOIN = 'game.queue.join';
const GAME_READY_SET = 'game.ready.set';
const GAME_READY_STOP = 'game.ready.stop';
const GAME_PREMATCH_LEAVE = 'game.prematch.leave';
const GAME_MATCH_LEAVE = 'game.match.leave';
const GAME_PRIVATE_CREATE = 'game.private.create';
const GAME_PRIVATE_INVITE = 'game.private.invite';
const GAME_PRIVATE_ACCEPT = 'game.private.accept';
const GAME_PRIVATE_DECLINE = 'game.private.decline';
const GAME_INVITE_RECEIVED = 'game.invite.received';
const GAME_INVITE_DECLINED = 'game.invite.declined';
const GAME_ANSWER_SUBMIT = 'game.answer.submit';
const GAME_DEFEND_ACTIVATE = 'game.defend.activate';
const GAME_RECONNECT_RESUME = 'game.reconnect.resume';
const GAME_ERROR = 'game.error';
const GAME_STATE = 'game.state';
const GAME_REMATCH_REQUEST = 'game.rematch.request';
const GAME_REMATCH_ACCEPT = 'game.rematch.accept';
const GAME_REMATCH_REJECT = 'game.rematch.reject';
const GAME_REMATCH_RECEIVED = 'game.rematch.received';
const GAME_REMATCH_REJECTED = 'game.rematch.rejected';
const GAME_ANSWER_TYPING = 'game.answer.typing';
const GAME_FIGHT_ROUND_MS = 50_000;
const GAME_ROUND_INTRO_MS = 2_400;
// Pause after a timeout SHOCK so its visuals (the ⚡ on both fighters, arena
// flash, -10 HP callouts) are visible before the next question begins. Without
// it the next question starts immediately and the shock barely registers.
const GAME_SHOCK_DISPLAY_MS = 900;

const eventLogs = new Map<string, GameSnapshot['eventLog']>();
const matchPlayers = new Map<string, Map<string, CombatantSlot>>();
const timers = new Map<string, NodeJS.Timeout[]>();
const roundTimers = new Map<string, NodeJS.Timeout>();
const roundClocks = new Map<string, { startedAtMs: number; deadlineAtMs: number }>();
const reconnectTimers = new Map<string, NodeJS.Timeout>();
// Remaining round-clock time stashed while a match is paused for reconnect,
// so resuming continues the countdown instead of leaving it cleared forever
// (which froze the client's round timer display) or unfairly restarting it
// at the full duration.
const pausedRoundRemainingMs = new Map<string, number>();
// Attack-gauge fill percent stashed at the moment of disconnect, so the
// client's per-question gauge freezes at the exact spot it was at instead of
// still ticking against the stale (pre-disconnect) question start time. The
// gauge always belongs to a fresh question once the player resumes, so this
// is read-once-and-discard, not resumed like the round clock.
const pausedAttackProgressPercent = new Map<string, number>();

// Tracks players in any PvP room (queueing/ready/live). Used to block
// invites mid-fight. Key = playerId, value = matchId.
const pvpActivePlayers = new Map<string, string>();
// Per-match difficulty level, set at match creation and used every round.
const matchDifficulties = new Map<string, Difficulty>();
// Per-player difficulty preference while they are queued, cleared on match start or cancel.
const playerQueueDifficulties = new Map<string, Difficulty>();
// Pending rematch request per matchId: value = requesting playerId.
const rematchRequests = new Map<string, string>();

export function registerGameRuntimeSocketHandlers(io: Server): void {
  io.on('connection', (socket) => {
    socket.on(GAME_PVC_START, (payload: unknown) => {
      handlePvcStart(io, socket, payload);
    });

    socket.on(GAME_QUEUE_JOIN, (payload: unknown) => {
      handleQueueJoin(io, socket, payload);
    });

    socket.on(GAME_PRIVATE_CREATE, (payload: unknown) => {
      handlePrivateCreate(io, socket, payload);
    });

    socket.on(GAME_PRIVATE_INVITE, (payload: unknown) => {
      handlePrivateInvite(io, socket, payload);
    });

    socket.on(GAME_PRIVATE_ACCEPT, (payload: unknown) => {
      handlePrivateAccept(io, socket, payload);
    });

    socket.on(GAME_PRIVATE_DECLINE, (payload: unknown) => {
      handlePrivateDecline(io, socket, payload);
    });

    socket.on(GAME_READY_SET, (payload: unknown) => {
      handleReadySet(io, socket, payload);
    });

    socket.on(GAME_READY_STOP, (payload: unknown) => {
      handleReadyStop(io, socket, payload);
    });

    socket.on(GAME_PREMATCH_LEAVE, (payload: unknown) => {
      handlePrematchLeave(io, socket, payload);
    });

    socket.on(GAME_ANSWER_SUBMIT, (payload: unknown) => {
      handleAnswerSubmit(io, socket, payload);
    });

    socket.on(GAME_DEFEND_ACTIVATE, (payload: unknown) => {
      handleDefendActivate(io, socket, payload);
    });

    socket.on(GAME_RECONNECT_RESUME, (payload: unknown) => {
      handleReconnectResume(io, socket, payload);
    });

    socket.on(GAME_MATCH_LEAVE, () => {
      handleMatchLeave(io, socket);
    });

    socket.on(GAME_REMATCH_REQUEST, (payload: unknown) => {
      handleRematchRequest(io, socket, payload);
    });

    socket.on(GAME_REMATCH_ACCEPT, (payload: unknown) => {
      handleRematchAccept(io, socket, payload);
    });

    socket.on(GAME_REMATCH_REJECT, (payload: unknown) => {
      handleRematchReject(io, socket, payload);
    });

    socket.on(GAME_ANSWER_TYPING, (payload: unknown) => {
      handleAnswerTyping(io, socket, payload);
    });

    socket.on('disconnect', () => {
      handleSocketDisconnect(io, socket);
    });
  });
}

async function countCompletedPvpMatches(playerId: string): Promise<number> {
  return prisma.pvpMatch.count({
    where: {
      status: 'completed',
      OR: [{ p1PlayerId: playerId }, { p2PlayerId: playerId }],
    },
  });
}

// When the socket is authenticated, the server-derived user id is authoritative
// and overrides any client-supplied playerId. This binds match progress to the
// real account and prevents a client from spoofing another player's identity.
// Anonymous sockets (no token) fall back to the client value when anonymous.
function resolvePlayerId(socket: Socket, claimed: string): string {
  const authedUserId = (socket.data as { userId?: string }).userId;
  return authedUserId ?? claimed;
}

async function handlePvcStart(io: Server, socket: Socket, payload: unknown): Promise<void> {
  const parsed = parsePvcStartPayload(payload);
  if (parsed === null) {
    emitError(socket, 'INVALID_PAYLOAD', 'Invalid PvC start payload.');
    return;
  }
  parsed.playerId = resolvePlayerId(socket, parsed.playerId);

  try {
    const cpuKey = parsed.mathBay ? 'min' : parsed.cpuOpponentKey ?? 'max';
    const result = startPvcMatch({ playerId: parsed.playerId, cpuOpponentKey: cpuKey });
    const session = result.value.liveMatchSession;
    const matchId = session.matchId;
    session.mathBay = parsed.mathBay === true;

    matchDifficulties.set(matchId, parsed.mathBay ? 'very_easy' : parsed.difficulty ?? 'easy');

    // Presentation: player picks the arena in PvC; load their identity + add the CPU.
    const arenaId =
      parsed.arenaId !== undefined && (ARENA_IDS as readonly string[]).includes(parsed.arenaId)
        ? parsed.arenaId
        : 'math-arena';
    setMatchArena(matchId, arenaId);
    await addHumanPresentation(matchId, parsed.playerId, parsed.mathBay ? '🐣' : parsed.avatar ?? DEFAULT_AVATAR);
    addCpuPresentation(matchId, session.combatants.p2.id, cpuKey);
    if (parsed.mathBay) {
      const bottle = getMatchPresentation(matchId)?.players[session.combatants.p2.id];
      if (bottle) { bottle.avatar = '🍼'; bottle.username = 'Milk Bottle'; }
    }

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
    emitError(socket, 'INVALID_PAYLOAD', 'Invalid queue payload.');
    return;
  }
  parsed.playerId = resolvePlayerId(socket, parsed.playerId);

  try {
    const result = joinQuickMatchQueue({ playerId: parsed.playerId, babyMode: parsed.babyMode === true });
    const matchId = result.room.matchId;
    pvpActivePlayers.set(parsed.playerId, matchId);
    playerQueueDifficulties.set(parsed.playerId, parsed.babyMode ? 'very_easy' : parsed.difficulty ?? 'easy');
    rememberSocketContext(socket, {
      playerId: parsed.playerId,
      matchId,
      roomId: result.room.roomId,
    });
    socket.join(preMatchRoom(result.room.roomId));

    // Quick match: the server owns the arena (random, chosen once when the room
    // is first created). Each player's identity is loaded as they join. Player
    // order in the room decides position — playerIds[0] is left (p1).
    if (getMatchPresentation(matchId) === undefined) {
      setMatchArena(matchId, randomArenaId());
    }
    await addHumanPresentation(matchId, parsed.playerId, parsed.avatar ?? DEFAULT_AVATAR);

    if (!result.value.matched) {
      socket.emit(GAME_STATE, {
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
      throw new Error('PvP queue match is missing a player.');
    }

    // Resolve difficulty: only use very_hard if both players requested it and both qualify.
    const p1Pref = playerQueueDifficulties.get(p1QueuedPlayerId) ?? 'easy';
    const p2Pref = playerQueueDifficulties.get(p2QueuedPlayerId) ?? 'easy';
    let resolvedDifficulty: Difficulty = p1Pref === p2Pref ? p1Pref : 'easy';
    if (resolvedDifficulty === 'very_hard') {
      const [p1Count, p2Count] = await Promise.all([
        countCompletedPvpMatches(p1QueuedPlayerId),
        countCompletedPvpMatches(p2QueuedPlayerId),
      ]);
      if (p1Count < VERY_HARD_PVP_THRESHOLD || p2Count < VERY_HARD_PVP_THRESHOLD) {
        resolvedDifficulty = 'easy';
      }
    }
    matchDifficulties.set(matchId, resolvedDifficulty);
    playerQueueDifficulties.delete(p1QueuedPlayerId);
    playerQueueDifficulties.delete(p2QueuedPlayerId);

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
  const arenaId =
    requestedArena !== undefined && (ARENA_IDS as readonly string[]).includes(requestedArena)
      ? requestedArena
      : 'math-arena';
  const requestedDifficulty = parseDifficulty(readOptionalString(record, 'difficulty'));

  try {
    const result = createPvpRoomDraft({ p1PlayerId: playerId, isPrivateMatch: true });
    const room = result.room;
    pvpActivePlayers.set(playerId, room.matchId);
    matchDifficulties.set(room.matchId, requestedDifficulty ?? 'easy');
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
    emitError(
      socket,
      'FRIEND_IN_GAME',
      `${friendName} is in a fight! Try challenging ${friendName} later!`
    );
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
  io.to(`user:${friendId}`).emit(GAME_INVITE_RECEIVED, {
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
  io.to(preMatchRoom(roomId)).emit(GAME_INVITE_DECLINED, { roomId, byUsername: username });
}

function handleReadySet(io: Server, socket: Socket, payload: unknown): void {
  const parsed = parseReadyPayload(payload);
  if (parsed === null) {
    emitError(socket, 'INVALID_PAYLOAD', 'Invalid ready payload.');
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
    emitError(socket, 'INVALID_PAYLOAD', 'Invalid ready stop payload.');
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
    emitError(socket, 'INVALID_PAYLOAD', 'Invalid prematch leave payload.');
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
      io.to(preMatchRoom(result.room.roomId)).emit(GAME_STATE, { cancelled: true });
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
    emitError(socket, 'INVALID_PAYLOAD', 'Invalid answer payload.');
    return;
  }
  parsed.playerId = resolvePlayerId(socket, parsed.playerId);

  const slot = getPlayerSlot(parsed.matchId, parsed.playerId);
  if (slot === undefined) {
    emitError(socket, 'NOT_MATCH_MEMBER', 'Player is not in this match.');
    return;
  }

  try {
    const result = submitAnswer(parsed.matchId, slot, parsed.answer);
    appendEvents(parsed.matchId, result.events);
    if (finishMatchIfNeeded(io, parsed.matchId)) {
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
    emitError(socket, 'INVALID_PAYLOAD', 'Invalid DEFEND payload.');
    return;
  }
  parsed.playerId = resolvePlayerId(socket, parsed.playerId);

  const slot = getPlayerSlot(parsed.matchId, parsed.playerId);
  if (slot === undefined) {
    emitError(socket, 'NOT_MATCH_MEMBER', 'Player is not in this match.');
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
    emitError(socket, 'INVALID_PAYLOAD', 'Invalid reconnect payload.');
    return;
  }
  parsed.playerId = resolvePlayerId(socket, parsed.playerId);

  const slot = getPlayerSlot(parsed.matchId, parsed.playerId);
  if (slot === undefined) {
    emitError(socket, 'NOT_MATCH_MEMBER', 'Player is not in this match.');
    return;
  }

  const session = getLiveMatchSession(parsed.matchId);
  if (session === null || session.phase !== 'reconnect_paused') {
    // Too late — the reconnect-grace window already expired (the match was
    // voided) or it otherwise isn't waiting for a reconnect. Tell the client
    // clearly instead of letting it fail generically and get stuck on a
    // stale "Reconnecting..." UI with no resolution.
    emitError(socket, 'MATCH_NO_LONGER_AVAILABLE', 'This match is no longer available.');
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
        setTimeout(
          () => {
            try {
              completeLiveMatchReconnectResume(parsed.matchId);
              // Only actually resume ticking once the "Get ready" success
              // countdown has finished — until then buildSnapshot reports the
              // frozen pause-time (see pausedRoundRemainingMs below).
              resumeRoundClockIfPaused(io, parsed.matchId);
              pausedAttackProgressPercent.delete(parsed.matchId);
              startQuestionInCurrentRound(io, parsed.matchId);
            } catch (error) {
              emitError(socket, 'RECONNECT_RESUME_FAILED', toErrorMessage(error));
            }
          },
          Math.max(0, resumeDeadlineAtMs - Date.now())
        )
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
  if (session === null || session.mode !== 'pvp' || session.phase === 'ended') {
    return;
  }

  if (session.phase === 'reconnect_paused') {
    const reconnectState = session.reconnectState;
    if (reconnectState === undefined) return;

    if (reconnectState.disconnectedSlot !== slot) {
      // The other player has now also disconnected — the reconnect model
      // only tracks one disconnected slot at a time, so there's no pause to
      // wait on. Resolve the match now rather than leaving it in limbo.
      voidMatchNow(io, context.matchId, slot, 'both_disconnected');
      return;
    }

    if (reconnectState.status === 'resuming') {
      // Same player reconnected, then dropped again before the "Get ready"
      // countdown finished. Cancel that in-flight resume timer and re-pause
      // with a fresh grace window instead of letting the countdown finish
      // and resume the match without them.
      try {
        clearMatchTimers(context.matchId);
        const result = revertReconnectResumeToReconnecting(context.matchId);
        appendEvents(context.matchId, result.events);
        emitSnapshotToRoom(io, context.matchId);
        scheduleReconnectVoid(io, context.matchId, slot);
      } catch {
        // Best effort — the match may have resumed through another path.
      }
    }
    // Otherwise: already 'reconnecting' for this same slot — already paused
    // and a void timer is already running, nothing more to do.
    return;
  }

  try {
    clearMatchTimers(context.matchId);
    pauseRoundClockForReconnect(context.matchId);
    freezeAttackGaugeForReconnect(context.matchId);
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

  if (
    session !== null &&
    session.mode === 'pvp' &&
    session.phase === 'reconnect_paused' &&
    context.playerId !== undefined
  ) {
    // An explicit leave only ever comes from a still-connected socket, so
    // this is always a deliberate departure — resolve the match now (whoever
    // is leaving forfeits) instead of falling through to the full-discard
    // branch below, which used to wipe the whole session — and the other
    // player's pending reconnect-grace timer — with no summary ever computed.
    const slot = getPlayerSlot(matchId, context.playerId);
    if (slot !== undefined) {
      voidMatchNow(io, matchId, slot, 'left_during_reconnect');
    }
    clearSocketContext(socket);
    return;
  }

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
        pauseRoundClockForReconnect(matchId);
        freezeAttackGaugeForReconnect(matchId);
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
  pausedRoundRemainingMs.delete(matchId);
  pausedAttackProgressPercent.delete(matchId);
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
  playerId: string | undefined
): void {
  if (roomId === undefined || playerId === undefined) return;
  const room = getMatchRoom(roomId);
  if (room === undefined || room.status === 'live' || room.status === 'cancelled') return;
  try {
    const result = leavePreMatchRoom({ roomId, playerId });

    // Cancel the room: evict everyone and send remaining players home.
    for (const pid of result.room.playerIds) {
      pvpActivePlayers.delete(pid);
      playerQueueDifficulties.delete(pid);
    }
    pvpActivePlayers.delete(playerId);
    playerQueueDifficulties.delete(playerId);
    clearPresentation(result.room.matchId);
    if (result.value.remainingPlayerIds.length > 0) {
      // Disconnecting player already left the socket room via disconnect.
      // Remaining players receive cancelled → client calls reset() → Quick/Private screen.
      io.to(preMatchRoom(roomId)).emit(GAME_STATE, { cancelled: true });
    }
  } catch {
    // Best effort — don't crash on cleanup.
  }
}

// ---------------------------------------------------------------------------
// Rematch flow
// ---------------------------------------------------------------------------

async function handleRematchRequest(io: Server, socket: Socket, payload: unknown): Promise<void> {
  const record = asRecord(payload);
  const matchId = readString(record, 'matchId');
  if (matchId === undefined) return;

  const context = readSocketContext(socket);
  const playerId = context?.playerId ?? (socket.data as { userId?: string }).userId;
  if (playerId === undefined) return;

  // Only valid after a completed match. A missing session means the
  // opponent already left the results screen (handleMatchLeave discards it).
  const session = getLiveMatchSession(matchId);
  if (session === null) {
    emitError(socket, 'OPPONENT_LEFT', 'Opponent has left!');
    return;
  }
  if (session.phase !== 'ended') return;

  // A voided match (disconnect/reconnect-timeout forfeit) has no opponent
  // left to rematch against — block the request rather than leaving the
  // requester waiting on a rematch that can never be accepted.
  if (session.finalOutcome?.status === 'voided') {
    emitError(socket, 'REMATCH_FAILED', 'Rematch is no longer available.');
    return;
  }

  // If the opponent already requested a rematch, both want one — start it
  // immediately rather than leaving either player stuck on "waiting".
  const existingRequester = rematchRequests.get(matchId);
  if (existingRequester !== undefined && existingRequester !== playerId) {
    rematchRequests.delete(matchId);
    await startRematch(io, socket, matchId, existingRequester, playerId);
    return;
  }

  rematchRequests.set(matchId, playerId);

  // Notify the other player.
  const players = matchPlayers.get(matchId);
  if (players === undefined) return;
  const fromUsername = (socket.data as { username?: string }).username ?? 'Opponent';
  for (const [pid] of players) {
    if (pid !== playerId) {
      io.to(`user:${pid}`).emit(GAME_REMATCH_RECEIVED, { matchId, fromUsername });
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

  // A player can't rematch themselves — guard against a stale/duplicate accept.
  if (requesterId === accepterId) return;

  await startRematch(io, socket, matchId, requesterId, accepterId);
}

// Spins up a fresh PvP room for a rematch, reusing the previous match's arena
// and avatars, and moves both players' sockets into the new prematch room.
// `errorSocket` receives any failure notice.
async function startRematch(
  io: Server,
  errorSocket: Socket,
  oldMatchId: string,
  requesterId: string,
  accepterId: string
): Promise<void> {
  // Reuse existing presentation (arena + avatars) from the finished match.
  const oldPres = getMatchPresentation(oldMatchId);
  const arenaId = oldPres?.arenaId ?? 'math-arena';
  const requesterAvatar = oldPres?.players[requesterId]?.avatar ?? DEFAULT_AVATAR;
  const accepterAvatar = oldPres?.players[accepterId]?.avatar ?? DEFAULT_AVATAR;

  try {
    const draft = createPvpRoomDraft({ p1PlayerId: requesterId, p2PlayerId: accepterId });
    const room = draft.room;
    room.babyMode = getLiveMatchSession(oldMatchId)?.mathBay === true;
    if (room.babyMode) matchDifficulties.set(room.matchId, 'very_easy');
    setMatchArena(room.matchId, arenaId);
    await addHumanPresentation(room.matchId, requesterId, requesterAvatar);
    await addHumanPresentation(room.matchId, accepterId, accepterAvatar);
    pvpActivePlayers.set(requesterId, room.matchId);
    pvpActivePlayers.set(accepterId, room.matchId);

    // Move both sockets into the new prematch room.
    io.in(matchRoom(oldMatchId)).socketsLeave(matchRoom(oldMatchId));
    const requesterSocket = (await io.in(`user:${requesterId}`).fetchSockets())[0];
    const accepterSocket = (await io.in(`user:${accepterId}`).fetchSockets())[0];
    if (requesterSocket !== undefined) {
      requesterSocket.data.game = {
        playerId: requesterId,
        matchId: room.matchId,
        roomId: room.roomId,
      };
      requesterSocket.join(preMatchRoom(room.roomId));
    }
    if (accepterSocket !== undefined) {
      accepterSocket.data.game = {
        playerId: accepterId,
        matchId: room.matchId,
        roomId: room.roomId,
      };
      accepterSocket.join(preMatchRoom(room.roomId));
    }

    emitPrematchSnapshotToRoom(io, room);
  } catch (error) {
    emitError(errorSocket, 'REMATCH_FAILED', toErrorMessage(error));
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
      io.to(`user:${pid}`).emit(GAME_ANSWER_TYPING, { partial });
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

  io.to(`user:${requesterId}`).emit(GAME_REMATCH_REJECTED, { matchId });
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
    const roundDifficulty = matchDifficulties.get(matchId);
    appendEvents(
      matchId,
      startRoundPrep(matchId, roundDifficulty !== undefined ? { difficulty: roundDifficulty } : {})
        .events
    );
    startFightRoundClock(io, matchId);
    if (!isFirstRound) {
      emitSnapshotToRoom(io, matchId);
      addTimer(
        matchId,
        setTimeout(() => startQuestionInCurrentRound(io, matchId), GAME_ROUND_INTRO_MS)
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
    setTimeout(
      () => {
        const result = resolveQuestionTimeout(session.matchId);
        appendEvents(session.matchId, result.events);
        if (finishMatchIfNeeded(io, session.matchId)) {
          return;
        }
        emitSnapshotToRoom(io, session.matchId);
        if (result.events.length > 0) {
          // Hold on the shock snapshot briefly so its visuals land before the
          // next question replaces them (mirrors the tutorial's shock pause).
          scheduleNextQuestionOrSummaryAfter(io, session.matchId, GAME_SHOCK_DISPLAY_MS);
        }
      },
      Math.max(0, deadline - Date.now() + 30)
    )
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

// Called after Shi-eld successfully blocks a player attack. The block clears
// Shield's own defend lockout immediately, so the counter-attack fires right away.
function maybeCpuCounterAfterBlock(io: Server, matchId: string): void {
  const session = getLiveMatchSession(matchId);
  if (session === null || session.mode !== 'pvc' || session.phase !== 'question_active') {
    return;
  }

  try {
    const decision = requestCpuAction(matchId, { cpuSuccessfulBlockThisQuestion: true });
    appendEvents(matchId, decision.events);
    if (decision.value.action !== 'answer') {
      return;
    }
    const answer = decision.value.answer ?? '';
    const result = submitAnswer(matchId, 'p2', answer);
    appendEvents(matchId, result.events);
    if (finishMatchIfNeeded(io, matchId)) {
      return;
    }
    emitSnapshotToRoom(io, matchId);
    schedulePostAnswerWork(io, result);
  } catch {
    // A counter-attack must never crash the block resolution flow.
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
      setTimeout(
        () => {
          const answer = decision.value.answer ?? '';
          const result = submitAnswer(session.matchId, 'p2', answer);
          appendEvents(session.matchId, result.events);
          if (finishMatchIfNeeded(io, session.matchId)) {
            return;
          }
          emitSnapshotToRoom(io, session.matchId);
          schedulePostAnswerWork(io, result);
        },
        Math.max(0, decision.value.performAtMs - Date.now())
      )
    );
  }

  if (decision.value.action === 'defend') {
    addTimer(
      session.matchId,
      setTimeout(
        () => {
          const result = activateDefend(session.matchId, 'p2');
          appendEvents(session.matchId, result.events);
          emitSnapshotToRoom(io, session.matchId);
        },
        Math.max(0, (decision.value.performAtMs ?? Date.now()) - Date.now())
      )
    );
  }
}

function schedulePostAnswerWork(io: Server, result: LiveMatchResult<SubmittedAnswerResult>): void {
  if (result.value.pendingDrawWindowUntilMs !== undefined) {
    addTimer(
      result.session.matchId,
      setTimeout(
        () => {
          const resolved = resolvePendingCorrectAnswer(result.session.matchId);
          appendEvents(result.session.matchId, resolved.events);
          if (finishMatchIfNeeded(io, result.session.matchId)) {
            return;
          }
          emitSnapshotToRoom(io, result.session.matchId);
          // A successful block leaves this question active. Its original
          // timeout is still scheduled, and play continues after the stun.
          if ('blockedByDefend' in resolved.value && resolved.value.blockedByDefend === true) {
            maybeCpuCounterAfterBlock(io, result.session.matchId);
          } else {
            scheduleNextQuestionOrSummary(io, result.session.matchId);
          }
        },
        Math.max(0, result.value.pendingDrawWindowUntilMs - Date.now() + 30)
      )
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
    result.events.some(
      (event) => event.name === 'attack.landed' || event.name === 'revenge.attack_landed'
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
    }, delayMs)
  );
}

function startFightRoundClock(
  io: Server,
  matchId: string,
  durationMs: number = GAME_FIGHT_ROUND_MS
): void {
  clearRoundTimer(matchId);
  const startedAtMs = Date.now();
  const deadlineAtMs = startedAtMs + durationMs;
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
      // The session may already have ended by KO or reset.
    }
  }, durationMs);

  roundTimers.set(matchId, timer);
}

// Pauses the round clock for a reconnect window, remembering how much time
// was left so resumeRoundClockIfPaused can continue it rather than leaving
// the round clock cleared (frozen display) or restarting it at full length.
function pauseRoundClockForReconnect(matchId: string): void {
  const clock = roundClocks.get(matchId);
  if (clock !== undefined) {
    pausedRoundRemainingMs.set(matchId, Math.max(0, clock.deadlineAtMs - Date.now()));
  }
  clearRoundTimer(matchId);
}

function resumeRoundClockIfPaused(io: Server, matchId: string): void {
  const remainingMs = pausedRoundRemainingMs.get(matchId);
  pausedRoundRemainingMs.delete(matchId);
  if (remainingMs === undefined) return;
  startFightRoundClock(io, matchId, remainingMs);
}

function freezeAttackGaugeForReconnect(matchId: string): void {
  const session = getLiveMatchSession(matchId);
  const startedAtMs = session?.currentQuestion?.startedAtMs;
  if (startedAtMs === undefined) return;
  const elapsedMs = Date.now() - startedAtMs;
  const percent = Math.min(100, Math.max(0, (elapsedMs / QUESTION_DURATION_MS) * 100));
  pausedAttackProgressPercent.set(matchId, percent);
}

// Resolves a match immediately instead of waiting out a reconnect-grace
// window — used when a second player also leaves/disconnects while the
// match is already paused (the reconnectState model can only track one
// disconnected slot at a time, so there is no "both away" pause to wait on)
// and when an explicit leave during a pause must end the match right away
// rather than silently discarding the whole session with no resolution.
function voidMatchNow(io: Server, matchId: string, dcSlot: CombatantSlot, reason: string): void {
  try {
    clearMatchTimers(matchId);
    clearReconnectTimer(matchId);
    clearRoundTimer(matchId);
    pausedRoundRemainingMs.delete(matchId);
    pausedAttackProgressPercent.delete(matchId);
    const result = voidLiveMatchForReconnectFailure(matchId, { dcSlot, reason });
    appendEvents(matchId, result.events);
    emitSnapshotToRoom(io, matchId);
    emitSummaryIfReady(io, matchId);
  } catch {
    // Best effort — the match may have already ended through another path.
  }
}

function finishMatchIfNeeded(io: Server, matchId: string): boolean {
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
    setTimeout(
      () => {
        void (async () => {
          try {
            // For private matches: validate very_hard eligibility before going live.
            if (matchDifficulties.get(room.matchId) === 'very_hard') {
              const p1Id = room.playerIds[0];
              const p2Id = room.playerIds[1];
              if (p1Id !== undefined && p2Id !== undefined) {
                const [p1Count, p2Count] = await Promise.all([
                  countCompletedPvpMatches(p1Id),
                  countCompletedPvpMatches(p2Id),
                ]);
                if (p1Count < VERY_HARD_PVP_THRESHOLD || p2Count < VERY_HARD_PVP_THRESHOLD) {
                  matchDifficulties.set(room.matchId, 'easy');
                }
              }
            }

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
        })();
      },
      Math.max(0, countdownEndsAtMs - Date.now())
    )
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
  matchDifficulties.delete(matchId);
  // Release PvP active-player slots so both players can receive invites again.
  for (const [pid, mid] of pvpActivePlayers) {
    if (mid === matchId) pvpActivePlayers.delete(pid);
  }
  io.to(matchRoom(matchId)).emit(
    GAME_STATE,
    buildSnapshot(finalResult.session, undefined, handoff.resultsPayload)
  );

  // Persist results (PvP history, Aura, CPU wins, tutorial completion, unlock
  // grants) out of band so the results screen isn't blocked on the DB write.
  void persistMatchSummary(handoff).catch((error) => {
    console.error(`Failed to persist match summary for ${matchId}:`, error);
  });
}

function emitSnapshot(
  _io: Server,
  socket: Socket,
  matchId: string,
  playerSlot?: CombatantSlot
): void {
  const session = getLiveMatchSession(matchId);
  if (session !== null) {
    socket.emit(GAME_STATE, buildSnapshot(session, playerSlot));
  }
}

function emitSnapshotToRoom(io: Server, matchId: string): void {
  const session = getLiveMatchSession(matchId);
  if (session !== null) {
    io.to(matchRoom(matchId)).emit(GAME_STATE, buildSnapshot(session));
  }
}

function emitPrematchSnapshotToRoom(io: Server, room: MatchRoom): void {
  io.to(preMatchRoom(room.roomId)).emit(GAME_STATE, buildPreMatchSnapshot(room));
}

function buildPreMatchSnapshot(
  room: MatchRoom,
  options: { message?: string } = {}
): GamePreMatchSnapshot {
  const readyState = room.readyState;
  const snapshot: GamePreMatchSnapshot = {
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

  const pres = getMatchPresentation(room.matchId);
  if (pres !== undefined) {
    snapshot.arenaId = pres.arenaId;
    snapshot.players = pres.players;
  }

  const difficulty = matchDifficulties.get(room.matchId);
  if (difficulty !== undefined) {
    snapshot.matchDifficulty = difficulty;
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
  summary?: unknown
): GameSnapshot {
  const snapshot: GameSnapshot = {
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

  const pres = getMatchPresentation(session.matchId);
  if (pres !== undefined) {
    snapshot.arenaId = pres.arenaId;
    snapshot.players = pres.players;
  }

  const matchDifficulty = matchDifficulties.get(session.matchId);
  if (matchDifficulty !== undefined) {
    snapshot.matchDifficulty = matchDifficulty;
  }

  const roundClock = roundClocks.get(session.matchId);
  if (roundClock !== undefined && summary === undefined) {
    snapshot.roundClock = roundClock;
  } else if (session.reconnectState !== undefined && summary === undefined) {
    // Paused for reconnect (or still in the post-reconnect "Get ready"
    // countdown) — show the exact time it had left when paused instead of
    // a missing roundClock (which the client falls back to rendering as a
    // static, unrelated "50").
    const frozenRemainingMs = pausedRoundRemainingMs.get(session.matchId);
    if (frozenRemainingMs !== undefined) {
      snapshot.roundClock = { frozenSecondsLeft: Math.ceil(frozenRemainingMs / 1000) };
    }
  }

  if (playerSlot !== undefined) {
    snapshot.playerSlot = playerSlot;
  }

  if (session.currentQuestion !== undefined) {
    const question: GameSnapshot['question'] = {
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

    if (session.reconnectState !== undefined && summary === undefined) {
      // Paused for reconnect (or still in the post-reconnect "Get ready"
      // countdown) — freeze the attack gauge at its exact fill when
      // disconnected instead of letting it keep ticking against the stale
      // pre-disconnect startedAtMs.
      const frozenPercent = pausedAttackProgressPercent.get(session.matchId);
      if (frozenPercent !== undefined) {
        question.frozenProgressPercent = frozenPercent;
      }
    }

    snapshot.question = question;
  }

  if (session.reconnectState !== undefined && summary === undefined) {
    const reconnectState: GameSnapshot['reconnectState'] = {
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
  events: ReadonlyArray<{ name: string; serverTimestampMs: number }>
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
    case 'reconnect.lost':
      return `${event.payload.disconnectedSlot} disconnected again. Reconnecting...`;
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
      pausedRoundRemainingMs.delete(matchId);
      pausedAttackProgressPercent.delete(matchId);
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

function rememberSocketContext(socket: Socket, context: GameSocketContext): void {
  const current = readSocketContext(socket) ?? {};
  socket.data.game = { ...current, ...context };
}

function readSocketContext(socket: Socket): GameSocketContext | undefined {
  const context = socket.data.game;
  if (context === undefined || typeof context !== 'object' || context === null) {
    return undefined;
  }
  return context as GameSocketContext;
}

function clearSocketContext(socket: Socket): void {
  delete socket.data.game;
}

function emitError(socket: Socket, code: string, message: string): void {
  socket.emit(GAME_ERROR, { code, message });
}
