import type { Server, Socket } from 'socket.io';
import {
  activateDefend,
  constructNextQuestion,
  endFightRound,
  finalizeMatchResult,
  getLiveMatchSession,
  markQuestionStarted,
  requestCpuAction,
  resolvePendingCorrectAnswer,
  resolveQuestionTimeout,
  startRoundPrep,
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
const DEMO_NEXT_QUESTION = 'demo.next_question';
const ANSWER_SUBMIT = 'answer.submit';
const DEFEND_ACTIVATE = 'defend.activate';
const MATCH_QUIT = 'match.quit';
const RECONNECT_RESUME = 'reconnect.resume';
const REMATCH_REQUEST = 'rematch.request';
const REMATCH_RESPOND = 'rematch.respond';
const SOCKET_ERROR = 'socket.error';

const DEMO_DRAW_RESOLVE_DELAY_MS = 170;
const DEMO_NEXT_QUESTION_DELAY_MS = 0;
const DEMO_FIGHT_ROUND_MS = 20000;
const DEMO_DIFFICULTY = 'easy';
const DEMO_ROUND_PREP_OPTIONS = {
  difficulty: DEMO_DIFFICULTY,
  forceDifficulty: DEMO_DIFFICULTY,
} as const;
const DEMO_QUESTION_OPTIONS = {
  forceDifficulty: DEMO_DIFFICULTY,
} as const;

const demoQuestionTimers = new Map<string, NodeJS.Timeout>();
const demoCpuTimers = new Map<string, NodeJS.Timeout>();
const demoRoundTimers = new Map<string, NodeJS.Timeout>();

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

    // Temporary Excalibur vertical-slice helper.
    // This chains round prep -> question construction -> question start so the
    // frontend can render an immediately playable question without the final
    // round orchestration/timer loop being fully implemented yet.
    socket.on(DEMO_NEXT_QUESTION, (payload: unknown) => {
      handleDemoNextQuestion(io, socket, payload);
    });

    socket.on(ANSWER_SUBMIT, (payload: unknown) => {
      handleAnswerSubmit(io, socket, payload);
    });

    socket.on(DEFEND_ACTIVATE, (payload: unknown) => {
      handleDefendActivate(io, socket, payload);
    });

    // Placeholders for PRD-required realtime flows that Live Match does not
    // implement yet. Keeping them visible here makes the missing integration
    // points obvious when frontend work begins.
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

function handleDemoNextQuestion(io: Server, socket: Socket, payload: unknown): void {
  const parsed = parseJoinPayload(payload);
  if (parsed === null) {
    emitSocketError(
      socket,
      DEMO_NEXT_QUESTION,
      'INVALID_PAYLOAD',
      'Invalid demo next question payload.',
    );
    return;
  }

  const combatantSlot = findCombatantSlotByPlayerId(parsed.matchId, parsed.playerId);
  if (combatantSlot === null) {
    emitSocketError(
      socket,
      DEMO_NEXT_QUESTION,
      'NOT_MATCH_MEMBER',
      'Player is not part of this match.',
    );
    return;
  }

  try {
    const session = getLiveMatchSession(parsed.matchId);
    if (session === null) {
      emitSocketError(socket, DEMO_NEXT_QUESTION, 'MATCH_NOT_FOUND', 'Live match session was not found.');
      return;
    }

    if (session.phase === 'ended') {
      emitSocketError(socket, DEMO_NEXT_QUESTION, 'MATCH_ENDED', 'Live match session has already ended.');
      return;
    }

    const prep =
      session.phase === 'created' || session.phase === 'round_ended'
        ? startRoundPrep(parsed.matchId, DEMO_ROUND_PREP_OPTIONS)
        : null;
    constructNextQuestion(parsed.matchId, DEMO_QUESTION_OPTIONS);
    const started = markQuestionStarted(parsed.matchId);

    if (prep !== null) {
      scheduleDemoRoundEnd(io, parsed.matchId);
    }

    emitLiveMatchResult(io, started);
    scheduleDemoQuestionRuntime(io, parsed.matchId);
  } catch (error) {
    emitSocketError(socket, DEMO_NEXT_QUESTION, 'DEMO_NEXT_QUESTION_FAILED', toErrorMessage(error));
  }
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
    scheduleAfterAction(io, parsed.matchId);
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
    scheduleDemoCpuAction(io, parsed.matchId, true);
  } catch (error) {
    emitSocketError(socket, DEFEND_ACTIVATE, 'MATCH_ACTION_FAILED', toErrorMessage(error));
  }
}

// ---------------------------------------------------------------------------
// Temporary demo orchestration
// ---------------------------------------------------------------------------

function scheduleDemoQuestionRuntime(io: Server, matchId: string): void {
  clearQuestionTimer(matchId);
  scheduleDemoQuestionTimeout(io, matchId);
  scheduleDemoCpuAction(io, matchId, false);
}

function scheduleDemoQuestionTimeout(io: Server, matchId: string): void {
  const session = getLiveMatchSession(matchId);
  const deadlineAtMs = session?.currentQuestion?.deadlineAtMs;
  if (session === null || deadlineAtMs === undefined) {
    return;
  }

  const delayMs = Math.max(deadlineAtMs - Date.now() + 25, 0);
  const timeout = setTimeout(() => {
    demoQuestionTimers.delete(matchId);

    try {
      const result = resolveQuestionTimeout(matchId);
      emitLiveMatchResult(io, result);
      scheduleAfterAction(io, matchId);
    } catch (error) {
      io.to(getMatchRoomName(matchId)).emit(SOCKET_ERROR, {
        code: 'QUESTION_TIMEOUT_FAILED',
        message: toErrorMessage(error),
        eventName: 'demo.question_timeout',
      } satisfies SocketErrorPayload);
    }
  }, delayMs);

  demoQuestionTimers.set(matchId, timeout);
}

function scheduleDemoCpuAction(
  io: Server,
  matchId: string,
  playerAttackIncoming: boolean,
): void {
  clearCpuTimer(matchId);

  const session = getLiveMatchSession(matchId);
  if (session === null || session.mode !== 'pvc' || session.phase !== 'question_active') {
    return;
  }

  try {
    const decision = requestCpuAction(matchId, {
      playerAttackIncoming,
    });
    emitLiveMatchResult(io, decision);

    const action = decision.value;
    if (action.action !== 'answer' && action.action !== 'defend') {
      return;
    }

    const cpuAction: 'answer' | 'defend' = action.action;
    const delayMs = Math.max((action.performAtMs ?? Date.now()) - Date.now(), 0);
    const timeout = setTimeout(() => {
      demoCpuTimers.delete(matchId);
      runDemoCpuAction(io, matchId, cpuAction, action.answer);
    }, delayMs);

    demoCpuTimers.set(matchId, timeout);
  } catch (error) {
    io.to(getMatchRoomName(matchId)).emit(SOCKET_ERROR, {
      code: 'CPU_ACTION_FAILED',
      message: toErrorMessage(error),
      eventName: 'demo.cpu_action',
    } satisfies SocketErrorPayload);
  }
}

function runDemoCpuAction(
  io: Server,
  matchId: string,
  action: 'answer' | 'defend',
  answer?: string,
): void {
  const session = getLiveMatchSession(matchId);
  if (
    session === null ||
    session.mode !== 'pvc' ||
    session.phase !== 'question_active' ||
    session.currentQuestion?.resolvedAtMs !== undefined
  ) {
    return;
  }

  try {
    const result: LiveMatchResult<unknown> =
      action === 'defend'
        ? activateDefend(matchId, 'p2')
        : submitAnswer(matchId, 'p2', answer ?? '');
    emitLiveMatchResult(io, result);
    scheduleAfterAction(io, matchId);
  } catch (error) {
    io.to(getMatchRoomName(matchId)).emit(SOCKET_ERROR, {
      code: 'CPU_ACTION_APPLY_FAILED',
      message: toErrorMessage(error),
      eventName: 'demo.cpu_action_apply',
    } satisfies SocketErrorPayload);
  }
}

function scheduleAfterAction(io: Server, matchId: string): void {
  const session = getLiveMatchSession(matchId);
  if (session === null || session.phase === 'ended') {
    return;
  }

  if (maybeEndRoundByKo(io, matchId)) {
    return;
  }

  if (session.currentQuestion?.pendingCorrectAnswer !== undefined) {
    clearQuestionTimer(matchId);
    const timeout = setTimeout(() => {
      demoQuestionTimers.delete(matchId);

      try {
        const result = resolvePendingCorrectAnswer(matchId);
        emitLiveMatchResult(io, result);
        scheduleAfterAction(io, matchId);
      } catch (error) {
        io.to(getMatchRoomName(matchId)).emit(SOCKET_ERROR, {
          code: 'PENDING_ANSWER_RESOLVE_FAILED',
          message: toErrorMessage(error),
          eventName: 'demo.resolve_pending_answer',
        } satisfies SocketErrorPayload);
      }
    }, DEMO_DRAW_RESOLVE_DELAY_MS);

    demoQuestionTimers.set(matchId, timeout);
    return;
  }

  if (session.currentQuestion?.resolvedAtMs !== undefined) {
    clearQuestionTimer(matchId);
    clearCpuTimer(matchId);
    scheduleNextDemoQuestion(io, matchId);
  }
}

function scheduleNextDemoQuestion(io: Server, matchId: string): void {
  const timeout = setTimeout(() => {
    const session = getLiveMatchSession(matchId);
    if (session === null || session.phase === 'ended' || session.phase === 'round_ended') {
      return;
    }

    if (maybeEndRoundByKo(io, matchId)) {
      return;
    }

    try {
      constructNextQuestion(matchId, DEMO_QUESTION_OPTIONS);
      const started = markQuestionStarted(matchId);
      emitLiveMatchResult(io, started);
      scheduleDemoQuestionRuntime(io, matchId);
    } catch (error) {
      io.to(getMatchRoomName(matchId)).emit(SOCKET_ERROR, {
        code: 'NEXT_QUESTION_FAILED',
        message: toErrorMessage(error),
        eventName: 'demo.next_question',
      } satisfies SocketErrorPayload);
    }
  }, DEMO_NEXT_QUESTION_DELAY_MS);

  clearQuestionTimer(matchId);
  demoQuestionTimers.set(matchId, timeout);
}

function maybeEndRoundByKo(io: Server, matchId: string): boolean {
  const session = getLiveMatchSession(matchId);
  if (
    session === null ||
    session.phase === 'ended' ||
    session.phase === 'round_ended' ||
    (session.combatants.p1.hp > 0 && session.combatants.p2.hp > 0)
  ) {
    return false;
  }

  clearQuestionTimer(matchId);
  clearCpuTimer(matchId);
  clearRoundTimer(matchId);

  try {
    const round = endFightRound(matchId);
    emitLiveMatchResult(io, round);

    if (round.value.matchEnded) {
      const result = finalizeMatchResult(matchId);
      emitLiveMatchResult(io, result);
      return true;
    }

    startRoundPrep(matchId, DEMO_ROUND_PREP_OPTIONS);
    constructNextQuestion(matchId, DEMO_QUESTION_OPTIONS);
    const started = markQuestionStarted(matchId);
    emitLiveMatchResult(io, started);
    scheduleDemoRoundEnd(io, matchId);
    scheduleDemoQuestionRuntime(io, matchId);
    return true;
  } catch (error) {
    io.to(getMatchRoomName(matchId)).emit(SOCKET_ERROR, {
      code: 'KO_ROUND_END_FAILED',
      message: toErrorMessage(error),
      eventName: 'demo.ko_round_end',
    } satisfies SocketErrorPayload);
    return true;
  }
}

function scheduleDemoRoundEnd(io: Server, matchId: string): void {
  clearRoundTimer(matchId);

  const timeout = setTimeout(() => {
    demoRoundTimers.delete(matchId);
    clearQuestionTimer(matchId);
    clearCpuTimer(matchId);

    try {
      const round = endFightRound(matchId);
      emitLiveMatchResult(io, round);

      if (round.value.matchEnded) {
        const result = finalizeMatchResult(matchId);
        emitLiveMatchResult(io, result);
        return;
      }

      startRoundPrep(matchId, DEMO_ROUND_PREP_OPTIONS);
      constructNextQuestion(matchId, DEMO_QUESTION_OPTIONS);
      const started = markQuestionStarted(matchId);
      emitLiveMatchResult(io, started);
      scheduleDemoRoundEnd(io, matchId);
      scheduleDemoQuestionRuntime(io, matchId);
    } catch (error) {
      io.to(getMatchRoomName(matchId)).emit(SOCKET_ERROR, {
        code: 'ROUND_END_FAILED',
        message: toErrorMessage(error),
        eventName: 'demo.round_end',
      } satisfies SocketErrorPayload);
    }
  }, DEMO_FIGHT_ROUND_MS);

  demoRoundTimers.set(matchId, timeout);
}

function clearQuestionTimer(matchId: string): void {
  const timeout = demoQuestionTimers.get(matchId);
  if (timeout !== undefined) {
    clearTimeout(timeout);
    demoQuestionTimers.delete(matchId);
  }
}

function clearCpuTimer(matchId: string): void {
  const timeout = demoCpuTimers.get(matchId);
  if (timeout !== undefined) {
    clearTimeout(timeout);
    demoCpuTimers.delete(matchId);
  }
}

function clearRoundTimer(matchId: string): void {
  const timeout = demoRoundTimers.get(matchId);
  if (timeout !== undefined) {
    clearTimeout(timeout);
    demoRoundTimers.delete(matchId);
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
