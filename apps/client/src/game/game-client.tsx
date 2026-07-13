'use client';

/* eslint-disable react-hooks/refs -- arena; refs read during
   render are intentional for this playable preview and will be reworked when
   the arena is rebuilt against the final design. */

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { type Socket } from 'socket.io-client';
import { getSocket } from '@/lib/socket';
import { api, type FriendView } from '@/lib/api';
import { useT } from '@/i18n/I18nContext';
import { useDashboardActions } from '@/context/DashboardContext';
import type { Difficulty, GameMode, GameSnapshot, GameStage } from './types';
import {
  ATTACK_STRENGTH_MS,
  AUDIO_ASSETS,
  GAME_AVATARS,
  GAME_BACKGROUNDS,
  REJOIN_GRACE_MS,
  backgroundById,
} from './constants';
import {
  fadeOutAndPauseBgm,
  playAudioForEvent,
  startBackgroundMusic,
  startLoopingSfx,
  stopLoopingSfx,
} from './audio';
import {
  avatarFor,
  avatarPadClass,
  eventKey,
  formatPrompt,
  getOrCreatePlayerId,
  inferPlayerSlot,
  isHardLocked,
  isLocked,
  labelFor,
  latestAudioEvent,
  latestVisualEvent,
  MAX_ANSWER_DIGITS,
  questionDisplayClass,
  resolveWinnerCombatantId,
  sanitizeAnswerInput,
  stageClassFor,
  summaryClass,
} from './helpers';
import {
  AvatarPicker,
  BackgroundPicker,
  DamageCallout,
  HpBar,
  MatchSummaryOverlay,
  OutcomeBanner,
  PlayerToken,
  ReconnectOverlay,
  RevengeGauge,
  RoundIntroOverlay,
  RoundWinnerOverlay,
  ShieldPip,
} from './components';
import { TutorialWalkthrough } from './tutorial';

function readStoredRejoin(): { matchId: string; leftAtMs: number } | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('game-rejoin-match');
  if (raw === null) return null;
  try {
    const parsed = JSON.parse(raw) as { matchId?: string; leftAtMs?: number };
    if (typeof parsed.matchId !== 'string' || typeof parsed.leftAtMs !== 'number') {
      localStorage.removeItem('game-rejoin-match');
      return null;
    }
    if (Date.now() - parsed.leftAtMs >= REJOIN_GRACE_MS) {
      localStorage.removeItem('game-rejoin-match');
      return null;
    }
    return { matchId: parsed.matchId, leftAtMs: parsed.leftAtMs };
  } catch {
    localStorage.removeItem('game-rejoin-match');
    return null;
  }
}

export interface GameClientHandle {
  /** Forfeits/leaves any active match and returns to the PvP quick/private chooser. */
  goBackToChooser(): void;
}

export const GameClient = forwardRef<
  GameClientHandle,
  {
    mode?: GameMode;
    cpuKey?: string;
    playerId?: string;
    /** Present when this client is joining a private match it was invited to. */
    invite?: { roomId: string; fromUsername: string };
    /** Fires whenever the "back" action should instead navigate away (i.e. we're at the top-level chooser with nothing left to go back to). */
    onAtTopLevelChange?: (atTopLevel: boolean) => void;
    /** Runs the scripted tutorial walkthrough before handing off to a real PvC match. */
    isTutorial?: boolean;
  }
>(function GameClient(
  { mode = 'pvp', cpuKey = 'max', playerId, invite, onAtTopLevelChange, isTutorial = false } = {},
  ref
) {
  const t = useT();
  const { refresh: refreshDashboard } = useDashboardActions();
  const [stage, setStage] = useState<GameStage>('landing');
  const [selectedAvatar, setSelectedAvatar] = useState(GAME_AVATARS[0] ?? '👻');
  const [pvpChoice, setPvpChoice] = useState<'quick' | 'private' | null>(null);
  const [rejoinMatchId, setRejoinMatchId] = useState<string | null>(
    () => readStoredRejoin()?.matchId ?? null
  );
  const [rematchState, setRematchState] = useState<
    | { status: 'idle' }
    | { status: 'pending' } // we sent the request
    | { status: 'received'; fromUsername: string } // opponent sent the request
    | { status: 'rejected' } // our request was rejected
  >({ status: 'idle' });
  const [opponentAnswer, setOpponentAnswer] = useState('');
  const [invitedFriendIds, setInvitedFriendIds] = useState(() => new Set<string>());
  const [friends, setFriends] = useState<FriendView[]>([]);
  const [inviteNote, setInviteNote] = useState('');
  const [selectedBackground, setSelectedBackground] = useState<(typeof GAME_BACKGROUNDS)[number]>(
    GAME_BACKGROUNDS[0]
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(
    isTutorial ? 'very_easy' : 'easy'
  );
  const [pvpMatchCount, setPvpMatchCount] = useState(0);
  const [inviteConsumed, setInviteConsumed] = useState(false);
  const [snapshot, setSnapshot] = useState<GameSnapshot | null>(null);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [now, setNow] = useState(Date.now());
  const [summaryVisible, setSummaryVisible] = useState(false);
  const [seriesWins, setSeriesWins] = useState<Record<string, number>>({});
  const [tutorialActive, setTutorialActive] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const playerIdRef = useRef('');
  const snapshotRef = useRef<GameSnapshot | null>(null);
  const stageRef = useRef<GameStage>('landing');
  const answerInputRef = useRef<HTMLInputElement | null>(null);
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const loserTauntRef = useRef<HTMLAudioElement | null>(null);
  const winnerFanfareRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastAudioEventKeyRef = useRef<string | undefined>(undefined);
  const shellRef = useRef<HTMLElement | null>(null);
  const summaryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countedSeriesMatchIdsRef = useRef(new Set<string>());
  const liveStageElementRef = useRef<HTMLDivElement | null>(null);

  const playerSlot = useMemo(() => inferPlayerSlot(snapshot, playerIdRef.current), [snapshot]);
  const opponentSlot = playerSlot === 'p2' ? 'p1' : 'p2';
  const ownCombatant = playerSlot !== undefined ? snapshot?.combatants?.[playerSlot] : undefined;
  const opponentCombatant = snapshot?.combatants?.[opponentSlot];
  // Can type: not stunned or missed (defend is OK — you can pre-type your answer while shielding)
  const ownInputEnabled =
    stage === 'live' &&
    ownCombatant !== undefined &&
    snapshot?.phase === 'question_active' &&
    snapshot.reconnectState === undefined &&
    !isHardLocked(ownCombatant, now);
  // Can submit: no status effects at all (defend lock must expire before Enter fires)
  const ownInputAvailable =
    stage === 'live' &&
    ownCombatant !== undefined &&
    snapshot?.phase === 'question_active' &&
    snapshot.reconnectState === undefined &&
    !isLocked(ownCombatant, now);
  const roundTimerLeft =
    snapshot?.roundClock?.frozenSecondsLeft !== undefined
      ? snapshot.roundClock.frozenSecondsLeft
      : snapshot?.roundClock?.deadlineAtMs === undefined
        ? 50
        : Math.max(0, Math.ceil((snapshot.roundClock.deadlineAtMs - now) / 1000));
  const attackProgress =
    snapshot?.question?.frozenProgressPercent !== undefined
      ? snapshot.question.frozenProgressPercent
      : snapshot?.question?.startedAtMs === undefined
        ? 0
        : Math.min(
            100,
            Math.max(0, ((now - snapshot.question.startedAtMs) / ATTACK_STRENGTH_MS) * 100)
          );
  const latestVisual = latestVisualEvent(snapshot?.eventLog);
  const visualAnimationKey = latestVisual === undefined ? 'none' : eventKey(latestVisual);
  const liveStageAnimationClass = stageClassFor(snapshot?.eventLog);

  // CSS animations do not restart when consecutive events resolve to the same
  // class (two timeouts both leave `stage-shock` on the arena). Remove and
  // re-add the event class after layout so every server event gets a fresh run.
  useEffect(() => {
    const element = liveStageElementRef.current;
    if (element === null || liveStageAnimationClass === '') return;

    const animationClasses = ['stage-shock', 'stage-hit', 'stage-hit-strong'];
    element.classList.remove(...animationClasses);
    void element.offsetWidth;
    element.classList.add(liveStageAnimationClass);
  }, [liveStageAnimationClass, visualAnimationKey]);

  useEffect(() => {
    // Use the authenticated account id when available so match results (CPU
    // wins, unlocks, PvP history, aura) persist to the real user. Falls back to
    // an anonymous local id only when rendered outside an authed session.
    playerIdRef.current = playerId ?? getOrCreatePlayerId();

    // Reuse the shared, already-authenticated socket established at login rather
    // than opening a second connection. It's been connected since login, so
    // starting a match costs no handshake. We attach the game listeners here and
    // detach them on unmount — but never disconnect the shared socket (that would
    // tear down presence/chat for the whole session).
    const socket = getSocket();
    socketRef.current = socket;
    if (!socket.connected) {
      socket.connect();
    }

    function handleConnect() {
      setError('');
      const currentSnapshot = snapshotRef.current;
      const reconnectState = currentSnapshot?.reconnectState;
      // Only the player who was actually marked disconnected should ever try
      // to resume — otherwise the still-connected opponent's own "connect"
      // event (e.g. on initial mount) would fire a resume request the server
      // rejects anyway, just unnecessary noise.
      const ownSlot = inferPlayerSlot(currentSnapshot ?? null, playerIdRef.current);
      const isOwnReconnect =
        reconnectState === undefined || reconnectState.disconnectedSlot === ownSlot;
      if (
        currentSnapshot?.mode === 'pvp' &&
        currentSnapshot.matchId !== undefined &&
        (stageRef.current === 'live' || reconnectState !== undefined) &&
        isOwnReconnect
      ) {
        startBackgroundMusic(bgmRef, backgroundById(currentSnapshot.arenaId).bgm);
        socket.emit('game.reconnect.resume', {
          matchId: currentSnapshot.matchId,
          playerId: playerIdRef.current,
        });
      }
    }
    function handleConnectError(_event: Error) {
      setError(t('error.connectionLost'));
    }
    function handleGameError(payload: { code: string; message: string }) {
      // Hide internal/technical codes from players; only surface player-relevant ones.
      const hide = new Set([
        'INVALID_PAYLOAD',
        'NOT_MATCH_MEMBER',
        'RECONNECT_RESUME_FAILED',
        'READY_FAILED',
        'READY_STOP_FAILED',
        'PREMATCH_LEAVE_FAILED',
        'PVC_START_FAILED',
        'ANSWER_FAILED',
        'DEFEND_FAILED',
      ]);
      if (hide.has(payload.code)) return;
      const friendlyMessages: Record<string, string> = {
        FRIEND_OFFLINE: t('error.friendOffline'),
        NOT_FRIENDS: t('error.notFriends'),
        PRIVATE_ACCEPT_FAILED: t('error.privateAcceptFailed'),
        PRIVATE_CREATE_FAILED: t('error.privateCreateFailed'),
        QUEUE_JOIN_FAILED: t('error.queueJoinFailed'),
        FRIEND_IN_GAME: t('error.friendInGame'),
        INVITE_FAILED: t('error.inviteFailed'),
        REMATCH_FAILED: t('error.rematchFailed'),
        OPPONENT_LEFT: t('error.opponentLeft'),
        MATCH_NO_LONGER_AVAILABLE: t('error.matchNoLongerAvailable'),
      };
      if (payload.code === 'OPPONENT_LEFT') {
        setRematchState({ status: 'idle' });
      }
      if (payload.code === 'MATCH_NO_LONGER_AVAILABLE') {
        // A reconnect attempt landed too late (grace window already expired
        // and the match was voided) — don't leave the player stuck on a
        // stale "Reconnecting..." overlay with no way out.
        reset();
      }
      setError(friendlyMessages[payload.code] ?? t('common.failed'));
    }
    function handleGameState(nextSnapshot: GameSnapshot) {
      // Room was cancelled — send all players back to Quick/Private choice.
      if ((nextSnapshot as { cancelled?: boolean }).cancelled === true) {
        reset();
        return;
      }

      // A new match (e.g. an accepted rematch creates a fresh matchId) starts
      // clean: clear any leftover rematch state so the next results screen shows
      // a live "Rematch" button again instead of a stale "waiting…".
      if (
        nextSnapshot.matchId !== undefined &&
        snapshotRef.current?.matchId !== undefined &&
        nextSnapshot.matchId !== snapshotRef.current.matchId
      ) {
        setRematchState({ status: 'idle' });
      }

      // Keep BGM in sync with the server-assigned arena (handles PvP quick
      // matches and invited players who didn't pick the arena themselves), and
      // restart it for a new match (e.g. a rematch leaving the results screen).
      // Never resume it while the summary is up — results music owns that screen.
      if (
        bgmRef.current !== null &&
        nextSnapshot.arenaId !== undefined &&
        nextSnapshot.summary === undefined
      ) {
        startBackgroundMusic(bgmRef, backgroundById(nextSnapshot.arenaId).bgm);
      }

      // Detect the moment the match summary first appears and gate its display.
      const summaryJustArrived =
        snapshotRef.current?.summary === undefined && nextSnapshot.summary !== undefined;
      if (summaryJustArrived) {
        refreshDashboard().catch(() => {});
        const s = nextSnapshot.summary!;
        const seriesWinnerId = resolveWinnerCombatantId(s);
        if (
          s.status === 'completed' &&
          seriesWinnerId !== undefined &&
          !countedSeriesMatchIdsRef.current.has(nextSnapshot.matchId)
        ) {
          countedSeriesMatchIdsRef.current.add(nextSnapshot.matchId);
          setSeriesWins((current) => ({
            ...current,
            [seriesWinnerId]: (current[seriesWinnerId] ?? 0) + 1,
          }));
        }
        const c = nextSnapshot.combatants;
        const isKo =
          s.status === 'completed' &&
          s.dcCombatantId === undefined &&
          c !== undefined &&
          (c.p1.hp <= 0 || c.p2.hp <= 0);

        // Fade the arena music out the instant the match ends — the same
        // moment as the KO spin / winning blow — rather than waiting for the
        // (possibly delayed) summary overlay to appear.
        fadeOutAndPauseBgm(bgmRef);
        const outcome = summaryClass(s, playerIdRef.current);
        if (outcome === 'win') {
          startLoopingSfx(winnerFanfareRef, AUDIO_ASSETS.winnerFanfare, 0.5);
        } else if (outcome === 'lose') {
          startLoopingSfx(loserTauntRef, AUDIO_ASSETS.loserTaunt, 0.5);
        }

        if (isKo) {
          setSummaryVisible(false);
          if (summaryTimerRef.current !== null) clearTimeout(summaryTimerRef.current);
          summaryTimerRef.current = setTimeout(() => {
            setSummaryVisible(true);
            summaryTimerRef.current = null;
          }, 2200);
        } else {
          setSummaryVisible(true);
        }
      } else if (nextSnapshot.summary === undefined) {
        // Left the results screen (a rematch started a new match): the win/lose
        // results music must not bleed into it. Stop it here — the arena BGM is
        // restarted by the arena-sync block above for the new match.
        setSummaryVisible(false);
        stopLoopingSfx(winnerFanfareRef);
        stopLoopingSfx(loserTauntRef);
      }

      // Only clear typed answers when a new question actually starts — a
      // game.state broadcast also fires for unrelated events (e.g. the
      // opponent activating defend), which must not wipe in-progress input.
      const questionChanged =
        snapshotRef.current?.question?.sequence !== nextSnapshot.question?.sequence;
      setSnapshot(nextSnapshot);
      if (questionChanged) {
        setAnswer('');
        setOpponentAnswer('');
      }
      if (nextSnapshot.waiting === true) {
        setStage('matchmaking');
        return;
      }
      if (nextSnapshot.readyState !== undefined) {
        setStage('ready');
        return;
      }
      setStage(nextSnapshot.phase === 'summary' ? 'summary' : 'live');
    }
    function handleInviteDeclined(payload: { byUsername?: string }) {
      setInviteNote(`${payload.byUsername ?? t('game.yourFriend')} ${t('game.declinedInvite')}`);
    }
    function handleAnswerTyping(payload: { partial: string }) {
      setOpponentAnswer(payload.partial ?? '');
    }
    function handleRematchReceived(payload: { fromUsername?: string }) {
      // If we also sent a request, both want a rematch — auto-accept to avoid deadlock.
      if (snapshotRef.current?.matchId !== undefined) {
        const currentRematch = rematchState;
        if (currentRematch.status === 'pending') {
          socket.emit('game.rematch.accept', { matchId: snapshotRef.current.matchId });
          return;
        }
      }
      setRematchState({
        status: 'received',
        fromUsername: payload.fromUsername ?? t('game.opponentFallback'),
      });
    }
    function handleRematchRejected() {
      setRematchState({ status: 'rejected' });
    }

    // game.match.leave is the exact moment the server starts its
    // reconnect-grace window (handleMatchLeave -> pauseLiveMatchForReconnect),
    // so the rejoin banner's countdown must be timestamped here too — not
    // whenever the live-stage effect last happened to run — or the two
    // countdowns drift out of sync. A hard refresh/tab close never runs React's
    // unmount cleanup, so this same write also has to happen on pagehide —
    // that path hits a real socket disconnect server-side (handleSocketDisconnect),
    // which starts the identical grace window independently of our emit below.
    function persistRejoinEntryIfLive() {
      const liveSnapshot = snapshotRef.current;
      if (stageRef.current === 'live' && liveSnapshot?.mode === 'pvp' && liveSnapshot.matchId) {
        localStorage.setItem(
          'game-rejoin-match',
          JSON.stringify({ matchId: liveSnapshot.matchId, leftAtMs: Date.now() })
        );
      }
    }

    socket.on('connect', handleConnect);
    socket.on('connect_error', handleConnectError);
    socket.on('game.error', handleGameError);
    socket.on('game.state', handleGameState);
    socket.on('game.invite.declined', handleInviteDeclined);
    socket.on('game.rematch.received', handleRematchReceived);
    socket.on('game.rematch.rejected', handleRematchRejected);
    socket.on('game.answer.typing', handleAnswerTyping);
    window.addEventListener('pagehide', persistRejoinEntryIfLive);
    window.addEventListener('beforeunload', persistRejoinEntryIfLive);

    const tick = window.setInterval(() => setNow(Date.now()), 100);
    return () => {
      window.clearInterval(tick);
      window.removeEventListener('pagehide', persistRejoinEntryIfLive);
      window.removeEventListener('beforeunload', persistRejoinEntryIfLive);
      persistRejoinEntryIfLive();
      socket.emit('game.match.leave');
      socket.off('connect', handleConnect);
      socket.off('connect_error', handleConnectError);
      socket.off('game.error', handleGameError);
      socket.off('game.state', handleGameState);
      socket.off('game.invite.declined', handleInviteDeclined);
      socket.off('game.rematch.received', handleRematchReceived);
      socket.off('game.rematch.rejected', handleRematchRejected);
      socket.off('game.answer.typing', handleAnswerTyping);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerId]);

  // Friends list (for the private-match invite picker).
  useEffect(() => {
    if (mode !== 'pvp') {
      return;
    }
    api
      .friends()
      .then(setFriends)
      .catch(() => {});
  }, [mode]);

  useEffect(() => {
    api
      .stats()
      .then((s) => setPvpMatchCount(s.pvpStats.played))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    snapshotRef.current = snapshot;
  }, [snapshot]);

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  useEffect(() => {
    if (stage !== 'landing' && invite !== undefined && !inviteConsumed) {
      setInviteConsumed(true);
    }
  }, [stage, invite, inviteConsumed]);

  const effectiveInvite = inviteConsumed ? undefined : invite;

  // The rejoin entry itself is written at the moment of actually leaving (see
  // the main socket effect's cleanup, which mirrors the server's
  // reconnect-grace start time). Here we just track whether this mount has
  // been live, so a normal match completion (stage -> summary) clears any
  // leftover entry. We deliberately do NOT clear on stage === "landing" alone
  // — that's also a freshly mounted component's default stage, and clearing
  // there would wipe the entry before the rejoin banner ever renders.
  const hasBeenLiveRef = useRef(false);
  useEffect(() => {
    if (stage === 'live' && snapshot?.mode === 'pvp' && snapshot.matchId) {
      hasBeenLiveRef.current = true;
    }
    if (stage === 'summary' && hasBeenLiveRef.current) {
      hasBeenLiveRef.current = false;
      localStorage.removeItem('game-rejoin-match');
    }
  }, [stage, snapshot?.matchId, snapshot?.mode]);

  // The rejoin banner must vanish once the server's reconnect window has
  // elapsed — otherwise it offers a "Rejoin match" that can never succeed
  // because the match was already voided.
  useEffect(() => {
    if (rejoinMatchId === null) return;
    const stored = readStoredRejoin();
    if (stored === null || stored.matchId !== rejoinMatchId) {
      setRejoinMatchId(null);
      return;
    }
    const remainingMs = REJOIN_GRACE_MS - (Date.now() - stored.leftAtMs);
    const timer = window.setTimeout(
      () => {
        setRejoinMatchId(null);
        localStorage.removeItem('game-rejoin-match');
      },
      Math.max(0, remainingMs)
    );
    return () => window.clearTimeout(timer);
  }, [rejoinMatchId]);

  function toggleFullscreen() {
    const el = shellRef.current;
    if (el === null) {
      return;
    }
    if (document.fullscreenElement !== null) {
      document.exitFullscreen().catch(() => {});
    } else {
      el.requestFullscreen().catch(() => {});
    }
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.code === 'Space' && stage === 'live') {
        event.preventDefault();
        activateDefend();
        return;
      }
      // F toggles fullscreen for the arena — ignored while typing an answer.
      if (
        (event.key === 'f' || event.key === 'F') &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !(event.target instanceof HTMLInputElement)
      ) {
        event.preventDefault();
        toggleFullscreen();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  useEffect(() => {
    if (!ownInputEnabled) {
      return;
    }

    const focusTimer = window.setTimeout(() => {
      answerInputRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(focusTimer);
  }, [ownInputEnabled, snapshot?.question?.sequence]);

  useEffect(() => {
    const latest = latestAudioEvent(snapshot?.eventLog);
    if (latest === undefined) {
      return;
    }

    const key = eventKey(latest);
    if (lastAudioEventKeyRef.current === key) {
      return;
    }

    lastAudioEventKeyRef.current = key;
    playAudioForEvent(latest, audioContextRef, playerSlot);
  }, [snapshot?.eventLog]);

  useEffect(
    () => () => {
      bgmRef.current?.pause();
      bgmRef.current = null;
      stopLoopingSfx(loserTauntRef);
      stopLoopingSfx(winnerFanfareRef);
    },
    []
  );

  function reset() {
    // Leaving a live match in-place (e.g. the "Back" button) doesn't unmount
    // the component, so the pagehide/unmount-cleanup rejoin-entry write never
    // fires. Persist it here too, and update state directly so the landing
    // screen rendered right after this shows the rejoin banner immediately.
    if (stage === 'live' && snapshot?.mode === 'pvp' && snapshot.matchId) {
      localStorage.setItem(
        'game-rejoin-match',
        JSON.stringify({ matchId: snapshot.matchId, leftAtMs: Date.now() })
      );
      setRejoinMatchId(snapshot.matchId);
    }
    socketRef.current?.emit('game.match.leave');
    bgmRef.current?.pause();
    bgmRef.current = null;
    stopLoopingSfx(loserTauntRef);
    stopLoopingSfx(winnerFanfareRef);
    lastAudioEventKeyRef.current = undefined;
    if (summaryTimerRef.current !== null) {
      clearTimeout(summaryTimerRef.current);
      summaryTimerRef.current = null;
    }
    setStage('landing');
    setSnapshot(null);
    setAnswer('');
    setOpponentAnswer('');
    setError('');
    setRematchState({ status: 'idle' });
    setInvitedFriendIds(new Set());
    setPvpChoice(null);
    setSummaryVisible(false);
    setSeriesWins({});
    countedSeriesMatchIdsRef.current.clear();
    setTutorialActive(false);
  }

  useImperativeHandle(ref, () => ({ goBackToChooser: reset }));

  // Tell the parent whether "back" has anywhere left to go to within this
  // component (the PvP quick/private chooser) or whether it should instead
  // navigate away, so the caller can swap the button between "Back" and "Home".
  const atTopLevel =
    mode === 'pvp' && stage === 'landing' && pvpChoice === null && effectiveInvite === undefined;
  useEffect(() => {
    onAtTopLevelChange?.(atTopLevel);
  }, [atTopLevel, onAtTopLevelChange]);

  function playAgainPvc() {
    bgmRef.current?.pause();
    bgmRef.current = null;
    stopLoopingSfx(loserTauntRef);
    stopLoopingSfx(winnerFanfareRef);
    lastAudioEventKeyRef.current = undefined;
    if (summaryTimerRef.current !== null) {
      clearTimeout(summaryTimerRef.current);
      summaryTimerRef.current = null;
    }
    setSnapshot(null);
    setAnswer('');
    setOpponentAnswer('');
    setError('');
    setRematchState({ status: 'idle' });
    setSummaryVisible(false);
    start('pvc');
  }

  function pickAvatar(avatar: string) {
    setSelectedAvatar(avatar);
  }

  function requestRematch() {
    if (snapshot?.matchId === undefined) return;
    socketRef.current?.emit('game.rematch.request', { matchId: snapshot.matchId });
    setRematchState({ status: 'pending' });
  }

  function acceptRematch() {
    if (snapshot?.matchId === undefined) return;
    socketRef.current?.emit('game.rematch.accept', { matchId: snapshot.matchId });
    setRematchState({ status: 'idle' });
  }

  function rejectRematch() {
    if (snapshot?.matchId === undefined) return;
    socketRef.current?.emit('game.rematch.reject', { matchId: snapshot.matchId });
    setRematchState({ status: 'idle' });
  }

  function attemptRejoin() {
    const matchId = rejoinMatchId;
    if (matchId === null) return;
    const socket = liveSocket();
    if (socket === null) return;
    setError('');
    socket.emit('game.reconnect.resume', {
      matchId,
      playerId: playerIdRef.current,
    });
    // If the server rejects (match expired), the game.error handler will
    // surface it and the stored key gets cleared.
    setRejoinMatchId(null);
    localStorage.removeItem('game-rejoin-match');
  }

  function liveSocket(): Socket | null {
    const socket = socketRef.current;
    if (socket === null) {
      return null;
    }
    if (!socket.connected) {
      socket.connect();
    }
    return socket;
  }

  function start(mode: GameMode) {
    startBackgroundMusic(bgmRef, selectedBackground.bgm);
    const socket = liveSocket();
    if (socket === null) {
      return;
    }
    setSnapshot(null);
    setError('');

    if (mode === 'pvc') {
      // PvC starts immediately (no queue). The shared socket is already connected,
      // so this is one quick round trip; "starting" is just a fallback that's
      // imperceptible in practice.
      setStage('starting');
      socket.emit('game.pvc.start', {
        playerId: playerIdRef.current,
        cpuOpponentKey: cpuKey,
        avatar: selectedAvatar,
        arenaId: selectedBackground.id,
        difficulty: isTutorial ? 'very_easy' : selectedDifficulty,
      });
      return;
    }

    // PvP quick match: no arena/room choice — the server assigns a random arena
    // and the first joiner takes the left side.
    setStage('matchmaking');
    socket.emit('game.queue.join', {
      playerId: playerIdRef.current,
      avatar: selectedAvatar,
      difficulty: selectedDifficulty,
    });
  }

  // PvP private match: starter creates a room with the arena they picked, then
  // invites a friend. The prematch snapshot drives the stage transition.
  function createPrivateRoom() {
    startBackgroundMusic(bgmRef, selectedBackground.bgm);
    const socket = liveSocket();
    if (socket === null) {
      return;
    }
    setSnapshot(null);
    setError('');
    setStage('starting');
    socket.emit('game.private.create', {
      playerId: playerIdRef.current,
      avatar: selectedAvatar,
      arenaId: selectedBackground.id,
      difficulty: selectedDifficulty,
    });
  }

  function sendInvite(friendId: string) {
    setInviteNote('');
    socketRef.current?.emit('game.private.invite', {
      roomId: snapshotRef.current?.roomId,
      friendId,
    });
    setInvitedFriendIds((prev) => {
      const next = new Set(prev);
      next.add(friendId);
      return next;
    });
    setInviteNote(t('game.inviteSent'));
  }

  // Invited friend joins the private room with their chosen avatar.
  function acceptInvite() {
    startBackgroundMusic(bgmRef, GAME_BACKGROUNDS[0].bgm);
    const socket = liveSocket();
    if (socket === null || invite === undefined) {
      return;
    }
    setSnapshot(null);
    setError('');
    setStage('starting');
    socket.emit('game.private.accept', {
      roomId: invite.roomId,
      playerId: playerIdRef.current,
      avatar: selectedAvatar,
    });
  }

  function submitAnswer() {
    if (!ownInputAvailable || snapshot?.matchId === undefined || answer.trim() === '') {
      return;
    }

    socketRef.current?.emit('game.answer.submit', {
      matchId: snapshot.matchId,
      playerId: playerIdRef.current,
      answer,
    });

    // Always reset to a fresh box after submitting. A wrong answer keeps the
    // same question, so without this the rejected input would linger into the
    // next attempt. Mirror the clear to the opponent's live-typing view (PvP).
    setAnswer('');
    if (snapshot.mode === 'pvp') {
      socketRef.current?.emit('game.answer.typing', {
        matchId: snapshot.matchId,
        playerId: playerIdRef.current,
        partial: '',
      });
    }
  }

  function updateAnswerInput(value: string) {
    const sanitized = sanitizeAnswerInput(value);
    setAnswer(sanitized);
    if (snapshot?.matchId !== undefined && snapshot.mode === 'pvp') {
      socketRef.current?.emit('game.answer.typing', {
        matchId: snapshot.matchId,
        playerId: playerIdRef.current,
        partial: sanitized,
      });
    }
  }

  function activateDefend() {
    if (snapshot?.matchId === undefined) {
      return;
    }

    socketRef.current?.emit('game.defend.activate', {
      matchId: snapshot.matchId,
      playerId: playerIdRef.current,
    });
  }

  function setReady() {
    if (snapshot?.roomId === undefined) {
      return;
    }

    socketRef.current?.emit('game.ready.set', {
      roomId: snapshot.roomId,
      playerId: playerIdRef.current,
    });
  }

  function stopReady() {
    if (snapshot?.roomId === undefined) {
      return;
    }

    socketRef.current?.emit('game.ready.stop', {
      roomId: snapshot.roomId,
      playerId: playerIdRef.current,
    });
  }

  function leavePrematch() {
    if (snapshot?.roomId === undefined) {
      reset();
      return;
    }

    socketRef.current?.emit('game.prematch.leave', {
      roomId: snapshot.roomId,
      playerId: playerIdRef.current,
    });
    reset();
  }

  return (
    <main className="game-shell" ref={shellRef}>
      {error !== '' && (
        <div className="game-error" role="alert">
          {error}
          <button
            type="button"
            className="game-error-close"
            onClick={() => setError('')}
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      {/* Rejoin banner: shown on landing when a PvP match is still within its reconnect-grace window. */}
      {stage === 'landing' && rejoinMatchId !== null && (
        <div className="game-rejoin-banner">
          <span>{t('game.rejoinBannerText')}</span>
          <div className="game-rejoin-actions">
            <button
              type="button"
              className="game-start-button"
              style={{ padding: '8px 20px', fontSize: '14px' }}
              onClick={attemptRejoin}
            >
              {t('game.rejoinMatch')}
            </button>
            <button
              type="button"
              className="game-text-button"
              onClick={() => {
                setRejoinMatchId(null);
                localStorage.removeItem('game-rejoin-match');
              }}
            >
              {t('game.dismiss')}
            </button>
          </div>
        </div>
      )}

      {/* PvC setup: pick token + arena + difficulty, then start. */}
      {stage === 'landing' && mode === 'pvc' && !tutorialActive && (
        <section className="game-landing game-landing-solo" aria-label="Prepare your duel">
          <div className="game-landing-copy">
            <p>{t('game.playerVsCpu')}</p>
            <h2>{t('game.selectFighter')}</h2>
            <AvatarPicker selected={selectedAvatar} onPick={pickAvatar} />
            <button
              type="button"
              className="game-start-button"
              onClick={() => {
                if (isTutorial) {
                  startBackgroundMusic(bgmRef, selectedBackground.bgm);
                  setTutorialActive(true);
                  return;
                }
                start('pvc');
              }}
            >
              ⚔️ {t('game.startDuel')}
            </button>
          </div>
          <div className="game-landing-arena">
            <span className="game-setup-label">{t('game.chooseArena')}</span>
            <BackgroundPicker selectedId={selectedBackground.id} onPick={setSelectedBackground} />
          </div>
        </section>
      )}

      {/* Scripted tutorial walkthrough — replaces the live engine entirely
          (deterministic, not subject to CPU randomness) until it hands off
          to a real PvC match via onComplete. */}
      {stage === 'landing' && mode === 'pvc' && tutorialActive && (
        <TutorialWalkthrough
          selectedAvatar={selectedAvatar}
          background={selectedBackground}
          cpuKey={cpuKey}
          onComplete={() => {
            setTutorialActive(false);
            start('pvc');
          }}
        />
      )}

      {/* PvP — invited friend: pick a token, then accept. */}
      {stage === 'landing' && mode === 'pvp' && effectiveInvite !== undefined && (
        <section className="game-landing game-pvp-entry" aria-label="Join private match">
          <p>{t('game.privateMatchInvite')}</p>
          <h2>{t('game.joinMatch').replace('{name}', effectiveInvite.fromUsername)}</h2>
          <AvatarPicker selected={selectedAvatar} onPick={pickAvatar} />
          <button type="button" className="game-start-button" onClick={acceptInvite}>
            {t('game.acceptJoin')}
          </button>
        </section>
      )}

      {/* PvP — choose match type first, avatar is optional (defaults). */}
      {stage === 'landing' &&
        mode === 'pvp' &&
        effectiveInvite === undefined &&
        pvpChoice === null && (
          <section className="game-landing game-pvp-entry" aria-label="Choose match type">
            <p>{t('game.playerVsPlayer')}</p>
            <h2>{t('game.chooseBattle')}</h2>
            <div className="game-pvp-options">
              <button
                type="button"
                className="game-pvp-option"
                onClick={() => setPvpChoice('quick')}
              >
                <strong>{t('versus.quickMatch')}</strong>
                <span>{t('game.quickMatchDesc')}</span>
              </button>
              <button
                type="button"
                className="game-pvp-option"
                onClick={() => setPvpChoice('private')}
              >
                <strong>{t('game.privateMatch')}</strong>
                <span>{t('game.privateMatchDesc')}</span>
              </button>
            </div>
          </section>
        )}

      {/* PvP — quick match: pick avatar then join. */}
      {stage === 'landing' &&
        mode === 'pvp' &&
        effectiveInvite === undefined &&
        pvpChoice === 'quick' && (
          <section className="game-landing game-pvp-entry" aria-label="Quick match setup">
            <h2>{t('versus.quickMatch')}</h2>
            <span className="game-setup-label">
              {t('game.chooseFighter')}{' '}
              <small style={{ opacity: 0.6 }}>{t('common.optional')}</small>
            </span>
            <AvatarPicker selected={selectedAvatar} onPick={pickAvatar} />
            <button type="button" className="game-start-button" onClick={() => start('pvp')}>
              {t('game.findMatch')}
            </button>
          </section>
        )}

      {/* PvP — private setup: pick avatar + arena, then create room. */}
      {stage === 'landing' &&
        mode === 'pvp' &&
        effectiveInvite === undefined &&
        pvpChoice === 'private' && (
          <section className="game-landing game-landing-solo" aria-label="Set up private match">
            <div className="game-landing-copy">
              <h2>{t('game.privateMatchSetupTitle')}</h2>
              <span className="game-setup-label">
                {t('game.chooseFighter')}{' '}
                <small style={{ opacity: 0.6 }}>{t('common.optional')}</small>
              </span>
              <AvatarPicker selected={selectedAvatar} onPick={pickAvatar} />
              <button type="button" className="game-start-button" onClick={createPrivateRoom}>
                {t('game.createRoom')}
              </button>
            </div>
            <div className="game-landing-arena">
              <span className="game-setup-label">{t('game.chooseArena')}</span>
              <BackgroundPicker selectedId={selectedBackground.id} onPick={setSelectedBackground} />
            </div>
          </section>
        )}

      {stage === 'starting' && (
        <section className="game-starting" aria-label="Starting duel">
          <span className="sf-spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
          <p>{t('game.startingDuel')}</p>
        </section>
      )}

      {stage === 'matchmaking' && (
        <section className="game-matchmaking" aria-label="Matchmaking page">
          <div className="game-room-card">
            <p>{t('game.matchmaking')}</p>
            <h2>{snapshot?.waiting ? t('game.waitingForP2') : t('game.findingMatch')}</h2>
            <div className="game-vs-strip">
              <PlayerToken avatar={selectedAvatar} label={t('common.you')} tone="p1" />
              <div className="game-waiting-slot">{t('game.waiting')}</div>
            </div>
          </div>
        </section>
      )}

      {stage === 'ready' &&
        snapshot?.readyState !== undefined &&
        (() => {
          const rs = snapshot.readyState;
          const players = snapshot.players ?? {};
          const p1Pres = rs.p1PlayerId !== undefined ? players[rs.p1PlayerId] : undefined;
          const p2Pres = rs.p2PlayerId !== undefined ? players[rs.p2PlayerId] : undefined;
          const iAmP1 = rs.p1PlayerId === playerIdRef.current;
          const opponentPresent = rs.p2PlayerId !== undefined;
          const isPrivate = snapshot.isPrivateMatch === true;
          const showInvite = isPrivate && iAmP1 && !opponentPresent;
          const inCountdown = rs.countdownEndsAtMs !== undefined;
          const arena = backgroundById(snapshot.arenaId);
          return (
            <section className="game-ready" aria-label="Ready page">
              {/* Full arena stage with selected avatars on their platforms */}
              <div
                className={`stage game-service-stage background-${snapshot.arenaId ?? 'math-arena'}`}
              >
                <img alt={t(arena.labelKey)} src={arena.src} />
                <div className="ready-vs-text" aria-hidden="true">
                  VS
                </div>
                <div className={`avatar-pad p1${rs.p1Ready ? ' ready-bob' : ''}`}>
                  <div className="emoji-avatar">{p1Pres?.avatar ?? '❔'}</div>
                </div>
                <div
                  className={`avatar-pad p2${rs.p2Ready ? ' ready-bob' : ''}`}
                  style={!opponentPresent ? { opacity: 0.28 } : undefined}
                >
                  <div
                    className="emoji-avatar"
                    style={!opponentPresent ? { filter: 'grayscale(1)' } : undefined}
                  >
                    {p2Pres?.avatar ?? '❔'}
                  </div>
                </div>
              </div>

              {/* Controls panel below the arena */}
              <div className="game-room-card">
                <div className="game-ready-status">
                  <h2>
                    {inCountdown
                      ? t('game.matchBeginsIn')
                      : opponentPresent
                        ? t('game.readyCheck')
                        : t('game.waitingForOpponent')}
                  </h2>

                  <div className="game-vs-strip">
                    <PlayerToken
                      avatar={p1Pres?.avatar ?? '❔'}
                      label={p1Pres?.username ?? t('game.player1')}
                      tone={rs.p1Ready ? 'p1' : 'pending'}
                      isReady={rs.p1Ready}
                    />
                    <div className="game-versus">{t('game.vsCaps')}</div>
                    {opponentPresent ? (
                      <PlayerToken
                        avatar={p2Pres?.avatar ?? '❔'}
                        label={p2Pres?.username ?? t('game.player2')}
                        tone={rs.p2Ready ? 'p2' : 'pending'}
                        isReady={rs.p2Ready}
                      />
                    ) : (
                      <div className="game-waiting-slot">{t('game.waiting')}</div>
                    )}
                  </div>

                  {showInvite ? (
                    <div className="game-invite-panel">
                      <strong>{t('game.inviteFriend')}</strong>
                      {friends.filter((f) => f.online).length === 0 ? (
                        <span className="game-invite-empty">{t('game.noFriendsOnline')}</span>
                      ) : (
                        <ul className="game-invite-list">
                          {friends
                            .filter((f) => f.online)
                            .map((f) => {
                              const invited = invitedFriendIds.has(f.id);
                              return (
                                <li key={f.id}>
                                  <span>{f.username}</span>
                                  <button
                                    type="button"
                                    disabled={invited}
                                    style={
                                      invited
                                        ? {
                                            background: 'rgba(253,224,71,0.18)',
                                            borderColor: '#fde047',
                                            color: '#fde047',
                                          }
                                        : undefined
                                    }
                                    onClick={() => sendInvite(f.id)}
                                  >
                                    {invited ? t('game.invited') : t('game.invite')}
                                  </button>
                                </li>
                              );
                            })}
                        </ul>
                      )}
                      {inviteNote !== '' && <span className="game-invite-note">{inviteNote}</span>}
                      <button type="button" className="game-text-button" onClick={leavePrematch}>
                        {t('game.cancelRoom')}
                      </button>
                    </div>
                  ) : inCountdown ? (
                    <div className="game-ready-countdown">
                      <strong>
                        {Math.max(0, Math.ceil(((rs.countdownEndsAtMs ?? now) - now) / 1000))}
                      </strong>
                      <span>{t('game.getReady')}</span>
                    </div>
                  ) : (
                    (() => {
                      const iAmReady = iAmP1 ? rs.p1Ready : rs.p2Ready;
                      return (
                        <div className="game-ready-actions">
                          <button
                            type="button"
                            disabled={!opponentPresent}
                            style={
                              iAmReady
                                ? { background: 'rgba(253,224,71,0.18)', borderColor: '#fde047' }
                                : undefined
                            }
                            onClick={setReady}
                          >
                            {iAmReady ? `${t('game.readyWord')} ✓` : t('game.readyWord')}
                          </button>
                          <button type="button" onClick={leavePrematch}>
                            {t('common.back')}
                          </button>
                        </div>
                      );
                    })()
                  )}

                  {inCountdown && (
                    <button className="game-stop-button" type="button" onClick={stopReady}>
                      {t('game.stop')}
                    </button>
                  )}
                  {rs.message !== undefined && (
                    <div className="game-ready-message">{rs.message}</div>
                  )}
                </div>
              </div>
            </section>
          );
        })()}

      {(stage === 'live' || stage === 'summary') && snapshot?.combatants !== undefined && (
        <section
          className={`game-live ${snapshot.summary === undefined ? 'game-live-playing' : ''}`}
          aria-label="Live match page"
        >
          <div className="game-stage-card">
            <div
              ref={liveStageElementRef}
              className={`stage show-avatars show-question game-service-stage background-${snapshot.arenaId ?? 'math-arena'} ${liveStageAnimationClass}`}
            >
              <img
                alt={t(backgroundById(snapshot.arenaId).labelKey)}
                src={backgroundById(snapshot.arenaId).src}
              />
              <div className="top-hud" aria-label="Fight round status">
                <HpBar
                  combatant={snapshot.combatants.p1}
                  label={labelFor(snapshot.combatants.p1, playerIdRef.current)}
                  align="left"
                  roundWins={snapshot.roundWins?.p1 ?? 0}
                  pres={
                    snapshot.summary?.dcCombatantId === snapshot.combatants.p1.id
                      ? undefined
                      : snapshot.players?.[snapshot.combatants.p1.id]
                  }
                />
                <div className="round-clock" aria-label="Fight round timer">
                  <span>
                    {snapshot.isFinalRound === true
                      ? t('round.finalShort')
                      : `${t('round.roundPrefixCaps')} ${snapshot.roundNumber ?? 1}`}
                  </span>
                  <strong className="digital-display">{roundTimerLeft}</strong>
                </div>
                <HpBar
                  combatant={snapshot.combatants.p2}
                  label={labelFor(snapshot.combatants.p2, playerIdRef.current)}
                  align="right"
                  roundWins={snapshot.roundWins?.p2 ?? 0}
                  pres={
                    snapshot.summary?.dcCombatantId === snapshot.combatants.p2.id
                      ? undefined
                      : snapshot.players?.[snapshot.combatants.p2.id]
                  }
                />
              </div>

              {(() => {
                const isKoMatch =
                  snapshot.summary?.status === 'completed' &&
                  snapshot.summary.dcCombatantId === undefined;
                const p1Ko = isKoMatch && snapshot.combatants.p1.hp <= 0;
                const p2Ko = isKoMatch && snapshot.combatants.p2.hp <= 0;
                const winnerCombatantId =
                  snapshot.summary !== undefined
                    ? resolveWinnerCombatantId(snapshot.summary)
                    : undefined;
                const p1Winner =
                  winnerCombatantId !== undefined &&
                  winnerCombatantId === snapshot.combatants.p1.id;
                const p2Winner =
                  winnerCombatantId !== undefined &&
                  winnerCombatantId === snapshot.combatants.p2.id;
                return (
                  <>
                    <div
                      key={`p1-${visualAnimationKey}`}
                      className={`${avatarPadClass(snapshot.combatants.p1, 'p1', snapshot.eventLog ?? [], now)}${p1Ko ? ' ko-final-blow' : ''}${p1Winner ? ' winner-celebrate' : ''}`}
                    >
                      <div className="emoji-avatar" aria-label="P1 avatar">
                        {snapshot.summary?.dcCombatantId === snapshot.combatants.p1.id
                          ? '💨'
                          : avatarFor(snapshot.combatants.p1, snapshot.players)}
                      </div>
                    </div>
                    <div
                      key={`p2-${visualAnimationKey}`}
                      className={`${avatarPadClass(snapshot.combatants.p2, 'p2', snapshot.eventLog ?? [], now)}${p2Ko ? ' ko-final-blow' : ''}${p2Winner ? ' winner-celebrate' : ''}`}
                    >
                      <div className="emoji-avatar" aria-label="P2 avatar">
                        {snapshot.summary?.dcCombatantId === snapshot.combatants.p2.id
                          ? '💨'
                          : avatarFor(snapshot.combatants.p2, snapshot.players)}
                      </div>
                    </div>
                  </>
                );
              })()}

              <div
                key={`shock-flash-${visualAnimationKey}`}
                className="shock-flash-layer"
                aria-hidden="true"
              />
              <RoundWinnerOverlay snapshot={snapshot} now={now} />
              <RoundIntroOverlay snapshot={snapshot} now={now} />
              {snapshot.summary === undefined && (
                <OutcomeBanner eventLog={snapshot.eventLog ?? []} playerSlot={playerSlot} />
              )}
              <DamageCallout eventLog={snapshot.eventLog ?? []} />

              {snapshot.summary !== undefined && summaryVisible && (
                <MatchSummaryOverlay
                  className={summaryClass(snapshot.summary, playerIdRef.current)}
                  mode={snapshot.mode}
                  playerId={playerIdRef.current}
                  players={snapshot.players}
                  roundNumber={snapshot.roundNumber ?? 1}
                  summary={snapshot.summary}
                  seriesWins={seriesWins}
                  rematchState={rematchState}
                  onRematchRequest={requestRematch}
                  onRematchAccept={acceptRematch}
                  onRematchReject={rejectRematch}
                  onReset={reset}
                  onPlayAgain={playAgainPvc}
                />
              )}

              {snapshot.phase !== 'round_prep' && (
                <div className="question-stack">
                  <strong
                    className={`calc-display ${questionDisplayClass(snapshot.question?.prompt ?? t('tutorial.ready'))}`}
                  >
                    {formatPrompt(snapshot.question?.prompt ?? t('tutorial.ready'))}
                  </strong>
                  <form
                    className="answer-row game-service-answer-row"
                    onSubmit={(event) => {
                      event.preventDefault();
                      submitAnswer();
                    }}
                  >
                    {/* Boxes are rendered by absolute slot (p1 left, p2 right) so
                        they always line up with the avatars/HP above — your input
                        sits in your own slot's box regardless of which side you're
                        on (and stays in sync after a rematch swaps slots). */}
                    {(['p1', 'p2'] as const).map((slot) => {
                      const isOwn = slot === (playerSlot ?? 'p1');
                      const combatant = snapshot.combatants?.[slot];
                      return (
                        <label
                          key={slot}
                          className={
                            isOwn ? (ownInputEnabled ? 'input-ready' : 'locked') : 'opponent-box'
                          }
                        >
                          <span className="answer-box-head">
                            <span>
                              {slot.toUpperCase()} {t('tutorial.answer')}
                            </span>
                            {combatant !== undefined && (
                              <ShieldPip combatant={combatant} now={now} />
                            )}
                          </span>
                          {isOwn ? (
                            <input
                              ref={answerInputRef}
                              disabled={!ownInputEnabled}
                              inputMode="numeric"
                              maxLength={MAX_ANSWER_DIGITS + 1}
                              pattern="-?[0-9]{1,6}"
                              value={answer}
                              onChange={(event) => updateAnswerInput(event.target.value)}
                            />
                          ) : (
                            <output
                              className={
                                opponentAnswer === '' && combatant?.driver !== 'cpu'
                                  ? 'waiting'
                                  : undefined
                              }
                            >
                              {combatant?.driver === 'cpu'
                                ? t('tutorial.cpuThinking')
                                : opponentAnswer || '…'}
                            </output>
                          )}
                        </label>
                      );
                    })}
                  </form>

                  <div className="revenge-row" aria-label="Revenge gauges">
                    <RevengeGauge combatant={snapshot.combatants.p1} align="left" />
                    <RevengeGauge combatant={snapshot.combatants.p2} align="right" />
                  </div>

                  <div className="power-meter" aria-label="Attack strength preview">
                    <span>{t('tutorial.attackStrength')}</span>
                    <div className="power-track game-service-power-track">
                      <i style={{ left: `calc(${attackProgress}% - 5px)` }} />
                      <b>⚡</b>
                    </div>
                    <div className="power-markers" aria-label="Attack strength scale">
                      <span>1</span>
                      <span>5</span>
                      <span>10</span>
                      <span>15</span>
                      <span>20</span>
                      <span>25</span>
                      <span>30</span>
                    </div>
                  </div>
                </div>
              )}
              <ReconnectOverlay snapshot={snapshot} playerSlot={playerSlot} now={now} />
            </div>
            {snapshot.summary === undefined && (
              <div className="game-controls-bar" aria-label="How to play">
                <span className="game-controls-round">
                  {snapshot.isFinalRound === true
                    ? t('game.finalRound')
                    : `${t('game.roundPrefix')} ${snapshot.roundNumber ?? 1}`}
                </span>
                <span>⌨️ {t('game.typeAnswerThenEnter')}</span>
                <span className="game-controls-help" tabIndex={0}>
                  🛡️ {t('game.spaceToDefend')} <i className="game-help-mark">ⓘ</i>
                  <span className="game-help-pop" role="tooltip">
                    <strong>{t('gameHelp.defendTitle')}</strong>
                    <span>{t('gameHelp.defendIntro')}</span>
                    <ul>
                      <li>{t('gameHelp.defendBullet1')}</li>
                      <li>{t('gameHelp.defendBullet2')}</li>
                      <li>{t('gameHelp.defendBullet3')}</li>
                      <li>{t('gameHelp.defendBullet4')}</li>
                    </ul>
                    <span>{t('gameHelp.defendOutro')}</span>
                  </span>
                </span>
                <button
                  type="button"
                  className="game-controls-fs"
                  onClick={toggleFullscreen}
                  aria-label="Toggle fullscreen"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
                  </svg>
                  {t('game.fullscreen')}
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
});
