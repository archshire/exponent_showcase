import type { Server, Socket } from 'socket.io';
import { buildMatchSummaryHandoff } from '../services/match-summary.service';
import {
  leavePreMatchRoom,
  joinQuickMatchQueue,
  markPlayerReady,
  startPvcMatch,
  startPvpLiveMatch,
  stopReadyCountdown,
} from '../services/matchmaking.service';
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
}

interface DemoQueueJoinPayload {
  playerId: string;
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

interface DemoSnapshot {
  mode: DemoMode;
  roomId: string;
  matchId: string;
  phase: LiveMatchSession['phase'] | 'summary';
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
const DEMO_ANSWER_SUBMIT = 'demo.answer.submit';
const DEMO_DEFEND_ACTIVATE = 'demo.defend.activate';
const DEMO_RECONNECT_RESUME = 'demo.reconnect.resume';
const DEMO_ERROR = 'demo.error';
const DEMO_STATE = 'demo.state';
const DEMO_FIGHT_ROUND_MS = 50_000;
const DEMO_ROUND_INTRO_MS = 2_400;

const eventLogs = new Map<string, DemoSnapshot['eventLog']>();
const matchPlayers = new Map<string, Map<string, CombatantSlot>>();
const timers = new Map<string, NodeJS.Timeout[]>();
const roundTimers = new Map<string, NodeJS.Timeout>();
const roundClocks = new Map<string, { startedAtMs: number; deadlineAtMs: number }>();
const reconnectTimers = new Map<string, NodeJS.Timeout>();

export function registerDemoRuntimeSocketHandlers(io: Server): void {
  io.on('connection', (socket) => {
    socket.on(DEMO_PVC_START, (payload: unknown) => {
      handlePvcStart(io, socket, payload);
    });

    socket.on(DEMO_QUEUE_JOIN, (payload: unknown) => {
      handleQueueJoin(io, socket, payload);
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

    socket.on('disconnect', () => {
      handleSocketDisconnect(io, socket);
    });
  });
}

function handlePvcStart(io: Server, socket: Socket, payload: unknown): void {
  const parsed = parsePvcStartPayload(payload);
  if (parsed === null) {
    emitError(socket, 'INVALID_PAYLOAD', 'Invalid Demo 6 PvC start payload.');
    return;
  }

  try {
    const result = startPvcMatch({
      playerId: parsed.playerId,
      cpuOpponentKey: parsed.cpuOpponentKey ?? 'max',
    });
    const matchId = result.value.liveMatchSession.matchId;
    rememberSocketContext(socket, {
      playerId: parsed.playerId,
      matchId,
      roomId: result.value.liveMatchSession.roomId,
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

function handleQueueJoin(io: Server, socket: Socket, payload: unknown): void {
  const parsed = parseQueueJoinPayload(payload);
  if (parsed === null) {
    emitError(socket, 'INVALID_PAYLOAD', 'Invalid Demo 6 queue payload.');
    return;
  }

  try {
    const result = joinQuickMatchQueue({ playerId: parsed.playerId });
    rememberSocketContext(socket, {
      playerId: parsed.playerId,
      matchId: result.room.matchId,
      roomId: result.room.roomId,
    });
    socket.join(preMatchRoom(result.room.roomId));

    if (!result.value.matched) {
      socket.emit(DEMO_STATE, {
        waiting: true,
        roomId: result.room.roomId,
        matchId: result.room.matchId,
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

function handleReadySet(io: Server, socket: Socket, payload: unknown): void {
  const parsed = parseReadyPayload(payload);
  if (parsed === null) {
    emitError(socket, 'INVALID_PAYLOAD', 'Invalid Demo 6 ready payload.');
    return;
  }

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

  try {
    const result = leavePreMatchRoom(parsed);
    clearMatchTimers(result.room.matchId);
    socket.leave(preMatchRoom(result.room.roomId));
    io.to(preMatchRoom(result.room.roomId)).emit(DEMO_STATE, buildPreMatchSnapshot(result.room, {
      message: 'Opponent left.',
    }));
    socket.emit(DEMO_STATE, {
      waiting: true,
      roomId: result.room.roomId,
      matchId: result.room.matchId,
      playerId: parsed.playerId,
      cancelled: true,
    });
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

  startDemoFightRoundClock(io, matchId);
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
  io.to(matchRoom(matchId)).emit(DEMO_STATE, buildSnapshot(finalResult.session, undefined, handoff.resultsPayload));
}

function emitSnapshot(io: Server, socket: Socket, matchId: string, playerSlot?: CombatantSlot): void {
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
    readyState: {
      p1Ready: readyState?.p1Ready ?? false,
      p2Ready: readyState?.p2Ready ?? false,
    },
  };

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
  return parsed;
}

function parseQueueJoinPayload(payload: unknown): DemoQueueJoinPayload | null {
  const record = asRecord(payload);
  const playerId = readString(record, 'playerId');
  return playerId === undefined ? null : { playerId };
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
