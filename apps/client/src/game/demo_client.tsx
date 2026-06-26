"use client";

/* eslint-disable react-hooks/refs -- temporary demo arena; refs read during
   render are intentional for this playable preview and will be reworked when
   the arena is rebuilt against the final design. */

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState, type MutableRefObject } from "react";
import { type Socket } from "socket.io-client";
import { getSocket } from "@/lib/socket";
import { api, assetUrl, type FriendView } from "@/lib/api";
import { useT } from "@/i18n/I18nContext";
import type { TranslationKey } from "@/i18n/translations";

type DemoMode = "pvc" | "pvp";
type DemoStage = "landing" | "starting" | "matchmaking" | "ready" | "live" | "summary";
type DemoSlot = "p1" | "p2";
type DemoPhase =
  | "created"
  | "round_prep"
  | "question_constructing"
  | "question_active"
  | "round_ended"
  | "reconnect_paused"
  | "ended"
  | "summary";

interface DemoCombatant {
  slot: DemoSlot;
  id: string;
  driver: "human" | "cpu";
  hp: number;
  maxHp: number;
  currentStreak: number;
  longestStreak: number;
  revengeBlocks: number;
  revengeActive: boolean;
  defendAvailable: boolean;
  submittedAttempts: number;
  correctAnswers: number;
  statusEffects: Array<{ type: "missed" | "defend" | "stunned"; startedAtMs: number; endsAtMs: number }>;
}

interface DemoQuestion {
  sequence: number;
  prompt: string;
  difficulty: string;
  questionType: string;
  startedAtMs?: number;
  deadlineAtMs?: number;
  /** Set while paused for a reconnect: the attack gauge's exact fill at disconnect, frozen until resume. */
  frozenProgressPercent?: number;
}

interface PlayerPresentation {
  playerId: string;
  username: string;
  avatar: string;
  profilePictureUrl: string | null;
  identityImageSource: string;
  premadeAvatarKey: string | null;
  isCpu: boolean;
}

type Difficulty = 'very_easy' | 'easy' | 'very_hard';
const VERY_HARD_PVP_THRESHOLD = 50;

interface DemoSnapshot {
  waiting?: boolean;
  roomId: string;
  matchId: string;
  playerId?: string;
  mode?: DemoMode;
  phase?: DemoPhase;
  arenaId?: string;
  matchDifficulty?: Difficulty;
  isPrivateMatch?: boolean;
  players?: Record<string, PlayerPresentation>;
  playerSlot?: DemoSlot;
  question?: DemoQuestion;
  combatants?: Record<DemoSlot, DemoCombatant>;
  roundNumber?: number;
  roundWins?: Record<DemoSlot, number>;
  tiedRoundCount?: number;
  isFinalRound?: boolean;
  roundClock?: {
    startedAtMs?: number;
    deadlineAtMs?: number;
    /** Set while paused for a reconnect: the exact time left when disconnected, frozen until resume. */
    frozenSecondsLeft?: number;
  };
  reconnectState?: {
    status: "reconnecting" | "resuming";
    disconnectedSlot: DemoSlot;
    startedAtMs: number;
    deadlineAtMs: number;
    resumedAtMs?: number;
    resumeDeadlineAtMs?: number;
  };
  eventLog?: DemoEvent[];
  summary?: DemoSummary;
  readyState?: {
    p1PlayerId?: string;
    p2PlayerId?: string;
    p1Ready: boolean;
    p2Ready: boolean;
    countdownStartedAtMs?: number;
    countdownEndsAtMs?: number;
    message?: string;
  };
}

interface DemoEvent {
  name: string;
  message: string;
  serverTimestampMs: number;
  payload?: Record<string, unknown>;
}

interface DemoSummary {
  status: "completed" | "voided";
  winnerCombatantId?: string;
  dcCombatantId?: string;
  voidReason?: string;
  mutualFinalRoundLoss: boolean;
  combatants: Record<DemoSlot, {
    combatantId: string;
    hp: number;
    correctAnswers: number;
    submittedAttempts: number;
    accuracy: number;
    longestStreak: number;
  }>;
}

const DEMO_AVATARS = ["👻", "💀", "🥱", "👽", "🤖", "😈", "😷", "🤡", "🤯", "😍"];
const DEMO_BACKGROUNDS = [
  {
    id: "math-arena",
    label: "Math Arena",
    src: "/assets/game/candidates/backgrounds/math-arena-audience-v3.png",
    bgm: "/assets/game/selected/audio/music/active-match-theme.mp3",
  },
  {
    id: "tech-room",
    label: "Tech Room",
    src: "/assets/game/candidates/backgrounds/tech-room-arena-v1.png",
    bgm: "/assets/game/selected/audio/music/Soda Pop (Instrumental).mp3",
  },
  {
    id: "tech-wall",
    label: "Tech Wall",
    src: "/assets/game/candidates/backgrounds/tech-wall-arena-v1.png",
    bgm: "/assets/game/selected/audio/music/the_mountain-rap-background-496554.mp3",
  },
  {
    id: "campus-entrance",
    label: "Campus",
    src: "/assets/game/candidates/backgrounds/campus-entrance-arena-v1.png",
    bgm: "/assets/game/selected/audio/music/09. Ryu Stage.flac",
  },
] as const;

function backgroundById(id: string | undefined): (typeof DEMO_BACKGROUNDS)[number] {
  return DEMO_BACKGROUNDS.find((b) => b.id === id) ?? DEMO_BACKGROUNDS[0];
}

const CPU_AVATARS: Record<string, string> = {
  "cpu:min": "🤏🏻",
  "cpu:max": "👊",
  "cpu:fury": "🔥",
  "cpu:shi_eld": "🛡️",
};
const REVENGE_BLOCKS = 5;
// Matches the question window (QUESTION_DURATION_MS) so the bar fills exactly
// when the question times out — no dead gap before the shock.
const ATTACK_STRENGTH_MS = 6000;
const VISUAL_EVENT_NAMES = new Set([
  "attack.landed",
  "revenge.attack_landed",
  "defend.activated",
  "defend.blocked",
  "missed",
  "shock.applied",
  "draw.triggered",
  "match.ended",
]);
const DAMAGE_EVENT_NAMES = new Set(["attack.landed", "revenge.attack_landed", "shock.applied"]);
const AUDIO_EVENT_NAMES = new Set([
  "attack.landed",
  "revenge.attack_landed",
  "revenge.activated",
  "defend.activated",
  "defend.blocked",
  "missed",
  "shock.applied",
  "draw.triggered",
  "match.ended",
]);
const AUDIO_ASSETS = {
  hit: "/assets/game/selected/audio/sfx/correct_ans.wav",
  hitReceived: "/assets/game/selected/audio/sfx/hit_by_opponent.wav",
  miss: "/assets/game/selected/audio/sfx/wrong_ans.wav",
  shock: "/assets/game/selected/audio/sfx/shock.ogg",
  defend: "/assets/game/selected/audio/sfx/defend-activate.ogg",
  block: "/assets/game/selected/audio/sfx/defend-success.ogg",
  revengeReady: "/assets/game/selected/audio/sfx/revenge-ready.ogg",
  revengeHit: "/assets/game/selected/audio/sfx/revenge_hit.wav",
  revengeHitReceived: "/assets/game/selected/audio/sfx/hit_by_revenge_hit.mp3",
  clash: "/assets/game/selected/audio/sfx/clash.ogg",
  loserTaunt: "/assets/game/selected/audio/sfx/loser-taunt.ogg",
  winnerFanfare: "/assets/game/selected/audio/sfx/winner-fanfare.mp3",
} as const;
const STREAK_NOTE_FREQUENCIES = [261.63, 293.66, 329.63, 349.23, 392, 440, 493.88, 523.25];
// Mirrors the server's RECONNECT_GRACE_MS (live-match.service.ts) — once this
// elapses the server voids the match, so the rejoin banner must disappear too.
const REJOIN_GRACE_MS = 10_000;

function readStoredRejoin(): { matchId: string; leftAtMs: number } | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("demo-rejoin-match");
  if (raw === null) return null;
  try {
    const parsed = JSON.parse(raw) as { matchId?: string; leftAtMs?: number };
    if (typeof parsed.matchId !== "string" || typeof parsed.leftAtMs !== "number") {
      localStorage.removeItem("demo-rejoin-match");
      return null;
    }
    if (Date.now() - parsed.leftAtMs >= REJOIN_GRACE_MS) {
      localStorage.removeItem("demo-rejoin-match");
      return null;
    }
    return { matchId: parsed.matchId, leftAtMs: parsed.leftAtMs };
  } catch {
    localStorage.removeItem("demo-rejoin-match");
    return null;
  }
}

export interface DemoClientHandle {
  /** Forfeits/leaves any active match and returns to the PvP quick/private chooser. */
  goBackToChooser(): void;
}

export const DemoClient = forwardRef<DemoClientHandle, {
  mode?: DemoMode;
  cpuKey?: string;
  playerId?: string;
  /** Present when this client is joining a private match it was invited to. */
  invite?: { roomId: string; fromUsername: string };
  /** Fires whenever the "back" action should instead navigate away (i.e. we're at the top-level chooser with nothing left to go back to). */
  onAtTopLevelChange?: (atTopLevel: boolean) => void;
  /** Runs the scripted tutorial walkthrough before handing off to a real PvC match. */
  isTutorial?: boolean;
}>(function DemoClient({
  mode = "pvp",
  cpuKey = "max",
  playerId,
  invite,
  onAtTopLevelChange,
  isTutorial = false,
} = {}, ref) {
  const t = useT();
  const [stage, setStage] = useState<DemoStage>("landing");
  const [selectedAvatar, setSelectedAvatar] = useState(DEMO_AVATARS[0] ?? "👻");
  const [pvpChoice, setPvpChoice] = useState<"quick" | "private" | null>(null);
  const [rejoinMatchId, setRejoinMatchId] = useState<string | null>(() => readStoredRejoin()?.matchId ?? null);
  const [rematchState, setRematchState] = useState<
    | { status: "idle" }
    | { status: "pending" }                         // we sent the request
    | { status: "received"; fromUsername: string }  // opponent sent the request
    | { status: "rejected" }                        // our request was rejected
  >({ status: "idle" });
  const [opponentAnswer, setOpponentAnswer] = useState("");
  const [invitedFriendIds, setInvitedFriendIds] = useState(() => new Set<string>());
  const [friends, setFriends] = useState<FriendView[]>([]);
  const [inviteNote, setInviteNote] = useState("");
  const [selectedBackground, setSelectedBackground] = useState<(typeof DEMO_BACKGROUNDS)[number]>(DEMO_BACKGROUNDS[0]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(isTutorial ? 'very_easy' : 'easy');
  const [pvpMatchCount, setPvpMatchCount] = useState(0);
  const [inviteConsumed, setInviteConsumed] = useState(false);
  const [snapshot, setSnapshot] = useState<DemoSnapshot | null>(null);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [now, setNow] = useState(Date.now());
  const [summaryVisible, setSummaryVisible] = useState(false);
  const [tutorialActive, setTutorialActive] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const playerIdRef = useRef("");
  const snapshotRef = useRef<DemoSnapshot | null>(null);
  const stageRef = useRef<DemoStage>("landing");
  const answerInputRef = useRef<HTMLInputElement | null>(null);
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const loserTauntRef = useRef<HTMLAudioElement | null>(null);
  const winnerFanfareRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastAudioEventKeyRef = useRef<string | undefined>(undefined);
  const shellRef = useRef<HTMLElement | null>(null);
  const summaryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const playerSlot = useMemo(() => inferPlayerSlot(snapshot, playerIdRef.current), [snapshot]);
  const opponentSlot = playerSlot === "p2" ? "p1" : "p2";
  const ownCombatant = playerSlot !== undefined ? snapshot?.combatants?.[playerSlot] : undefined;
  const opponentCombatant = snapshot?.combatants?.[opponentSlot];
  // Can type: not stunned or missed (defend is OK — you can pre-type your answer while shielding)
  const ownInputEnabled = stage === "live"
    && ownCombatant !== undefined
    && snapshot?.phase === "question_active"
    && snapshot.reconnectState === undefined
    && !isHardLocked(ownCombatant, now);
  // Can submit: no status effects at all (defend lock must expire before Enter fires)
  const ownInputAvailable = stage === "live"
    && ownCombatant !== undefined
    && snapshot?.phase === "question_active"
    && snapshot.reconnectState === undefined
    && !isLocked(ownCombatant, now);
  const roundTimerLeft = snapshot?.roundClock?.frozenSecondsLeft !== undefined
    ? snapshot.roundClock.frozenSecondsLeft
    : snapshot?.roundClock?.deadlineAtMs === undefined
      ? 50
      : Math.max(0, Math.ceil((snapshot.roundClock.deadlineAtMs - now) / 1000));
  const attackProgress = snapshot?.question?.frozenProgressPercent !== undefined
    ? snapshot.question.frozenProgressPercent
    : snapshot?.question?.startedAtMs === undefined
      ? 0
      : Math.min(100, Math.max(0, ((now - snapshot.question.startedAtMs) / ATTACK_STRENGTH_MS) * 100));

  useEffect(() => {
    // Use the authenticated account id when available so match results (CPU
    // wins, unlocks, PvP history, aura) persist to the real user. Falls back to
    // an anonymous local id only when rendered outside an authed session.
    playerIdRef.current = playerId ?? getOrCreatePlayerId();

    // Reuse the shared, already-authenticated socket established at login rather
    // than opening a second connection. It's been connected since login, so
    // starting a match costs no handshake. We attach the demo listeners here and
    // detach them on unmount — but never disconnect the shared socket (that would
    // tear down presence/chat for the whole session).
    const token = typeof window !== "undefined" ? window.localStorage.getItem("token") ?? undefined : undefined;
    const socket = getSocket(token);
    socketRef.current = socket;
    if (!socket.connected) {
      socket.connect();
    }

    function handleConnect() {
      setError("");
      const currentSnapshot = snapshotRef.current;
      const reconnectState = currentSnapshot?.reconnectState;
      // Only the player who was actually marked disconnected should ever try
      // to resume — otherwise the still-connected opponent's own "connect"
      // event (e.g. on initial mount) would fire a resume request the server
      // rejects anyway, just unnecessary noise.
      const ownSlot = inferPlayerSlot(currentSnapshot ?? null, playerIdRef.current);
      const isOwnReconnect = reconnectState === undefined || reconnectState.disconnectedSlot === ownSlot;
      if (
        currentSnapshot?.mode === "pvp"
        && currentSnapshot.matchId !== undefined
        && (stageRef.current === "live" || reconnectState !== undefined)
        && isOwnReconnect
      ) {
        startBackgroundMusic(bgmRef, backgroundById(currentSnapshot.arenaId).bgm);
        socket.emit("demo.reconnect.resume", {
          matchId: currentSnapshot.matchId,
          playerId: playerIdRef.current,
        });
      }
    }
    function handleConnectError(_event: Error) {
      setError(t('error.connectionLost'));
    }
    function handleDemoError(payload: { code: string; message: string }) {
      // Hide internal/technical codes from players; only surface player-relevant ones.
      const hide = new Set([
        "INVALID_PAYLOAD", "NOT_MATCH_MEMBER", "RECONNECT_RESUME_FAILED",
        "READY_FAILED", "READY_STOP_FAILED", "PREMATCH_LEAVE_FAILED",
        "PVC_START_FAILED", "ANSWER_FAILED", "DEFEND_FAILED",
      ]);
      if (hide.has(payload.code)) return;
      const friendlyMessages: Record<string, string> = {
        FRIEND_OFFLINE: t('error.friendOffline'),
        NOT_FRIENDS: t('error.notFriends'),
        PRIVATE_ACCEPT_FAILED: t('error.privateAcceptFailed'),
        PRIVATE_CREATE_FAILED: t('error.privateCreateFailed'),
        QUEUE_JOIN_FAILED: t('error.queueJoinFailed'),
        FRIEND_IN_GAME: payload.message,
        INVITE_FAILED: t('error.inviteFailed'),
        REMATCH_FAILED: t('error.rematchFailed'),
        OPPONENT_LEFT: t('error.opponentLeft'),
        MATCH_NO_LONGER_AVAILABLE: t('error.matchNoLongerAvailable'),
      };
      if (payload.code === "OPPONENT_LEFT") {
        setRematchState({ status: "idle" });
      }
      if (payload.code === "MATCH_NO_LONGER_AVAILABLE") {
        // A reconnect attempt landed too late (grace window already expired
        // and the match was voided) — don't leave the player stuck on a
        // stale "Reconnecting..." overlay with no way out.
        reset();
      }
      setError(friendlyMessages[payload.code] ?? payload.message);
    }
    function handleDemoState(nextSnapshot: DemoSnapshot) {
      // Room was cancelled — send all players back to Quick/Private choice.
      if ((nextSnapshot as { cancelled?: boolean }).cancelled === true) {
        reset();
        return;
      }

      // Keep BGM in sync with the server-assigned arena (handles PvP quick
      // matches and invited players who didn't pick the arena themselves).
      if (bgmRef.current !== null && nextSnapshot.arenaId !== undefined) {
        startBackgroundMusic(bgmRef, backgroundById(nextSnapshot.arenaId).bgm);
      }

      // Detect the moment the match summary first appears and gate its display.
      const summaryJustArrived = snapshotRef.current?.summary === undefined && nextSnapshot.summary !== undefined;
      if (summaryJustArrived) {
        const s = nextSnapshot.summary!;
        const c = nextSnapshot.combatants;
        const isKo = s.status === "completed"
          && s.dcCombatantId === undefined
          && c !== undefined
          && ((c.p1.hp <= 0) || (c.p2.hp <= 0));

        // Fade the arena music out the instant the match ends — the same
        // moment as the KO spin / winning blow — rather than waiting for the
        // (possibly delayed) summary overlay to appear.
        fadeOutAndPauseBgm(bgmRef);
        const outcome = summaryClass(s, playerIdRef.current);
        if (outcome === "win") {
          startLoopingSfx(winnerFanfareRef, AUDIO_ASSETS.winnerFanfare, 0.5);
        } else if (outcome === "lose") {
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
        setSummaryVisible(false);
      }

      // Only clear typed answers when a new question actually starts — a
      // demo.state broadcast also fires for unrelated events (e.g. the
      // opponent activating defend), which must not wipe in-progress input.
      const questionChanged = snapshotRef.current?.question?.sequence !== nextSnapshot.question?.sequence;
      setSnapshot(nextSnapshot);
      if (questionChanged) {
        setAnswer("");
        setOpponentAnswer("");
      }
      if (nextSnapshot.waiting === true) {
        setStage("matchmaking");
        return;
      }
      if (nextSnapshot.readyState !== undefined) {
        setStage("ready");
        return;
      }
      setStage(nextSnapshot.phase === "summary" ? "summary" : "live");
    }
    function handleInviteDeclined(payload: { byUsername?: string }) {
      setInviteNote(`${payload.byUsername ?? t('demo.yourFriend')} ${t('demo.declinedInvite')}`);
    }
    function handleAnswerTyping(payload: { partial: string }) {
      setOpponentAnswer(payload.partial ?? "");
    }
    function handleRematchReceived(payload: { fromUsername?: string }) {
      // If we also sent a request, both want a rematch — auto-accept to avoid deadlock.
      if (snapshotRef.current?.matchId !== undefined) {
        const currentRematch = rematchState;
        if (currentRematch.status === "pending") {
          socket.emit("demo.rematch.accept", { matchId: snapshotRef.current.matchId });
          return;
        }
      }
      setRematchState({ status: "received", fromUsername: payload.fromUsername ?? t('demo.opponentFallback') });
    }
    function handleRematchRejected() {
      setRematchState({ status: "rejected" });
    }

    // demo.match.leave is the exact moment the server starts its
    // reconnect-grace window (handleMatchLeave -> pauseLiveMatchForReconnect),
    // so the rejoin banner's countdown must be timestamped here too — not
    // whenever the live-stage effect last happened to run — or the two
    // countdowns drift out of sync. A hard refresh/tab close never runs React's
    // unmount cleanup, so this same write also has to happen on pagehide —
    // that path hits a real socket disconnect server-side (handleSocketDisconnect),
    // which starts the identical grace window independently of our emit below.
    function persistRejoinEntryIfLive() {
      const liveSnapshot = snapshotRef.current;
      if (stageRef.current === "live" && liveSnapshot?.mode === "pvp" && liveSnapshot.matchId) {
        localStorage.setItem("demo-rejoin-match", JSON.stringify({ matchId: liveSnapshot.matchId, leftAtMs: Date.now() }));
      }
    }

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);
    socket.on("demo.error", handleDemoError);
    socket.on("demo.state", handleDemoState);
    socket.on("demo.invite.declined", handleInviteDeclined);
    socket.on("demo.rematch.received", handleRematchReceived);
    socket.on("demo.rematch.rejected", handleRematchRejected);
    socket.on("demo.answer.typing", handleAnswerTyping);
    window.addEventListener("pagehide", persistRejoinEntryIfLive);
    window.addEventListener("beforeunload", persistRejoinEntryIfLive);

    const tick = window.setInterval(() => setNow(Date.now()), 100);
    return () => {
      window.clearInterval(tick);
      window.removeEventListener("pagehide", persistRejoinEntryIfLive);
      window.removeEventListener("beforeunload", persistRejoinEntryIfLive);
      persistRejoinEntryIfLive();
      socket.emit("demo.match.leave");
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
      socket.off("demo.error", handleDemoError);
      socket.off("demo.state", handleDemoState);
      socket.off("demo.invite.declined", handleInviteDeclined);
      socket.off("demo.rematch.received", handleRematchReceived);
      socket.off("demo.rematch.rejected", handleRematchRejected);
      socket.off("demo.answer.typing", handleAnswerTyping);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerId]);

  // Friends list (for the private-match invite picker).
  useEffect(() => {
    if (mode !== "pvp") {
      return;
    }
    api.friends().then(setFriends).catch(() => {});
  }, [mode]);

  useEffect(() => {
    api.stats().then((s) => setPvpMatchCount(s.pvpStats.played)).catch(() => undefined);
  }, []);

  useEffect(() => {
    snapshotRef.current = snapshot;
  }, [snapshot]);

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  useEffect(() => {
    if (stage !== "landing" && invite !== undefined && !inviteConsumed) {
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
    if (stage === "live" && snapshot?.mode === "pvp" && snapshot.matchId) {
      hasBeenLiveRef.current = true;
    }
    if (stage === "summary" && hasBeenLiveRef.current) {
      hasBeenLiveRef.current = false;
      localStorage.removeItem("demo-rejoin-match");
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
    const timer = window.setTimeout(() => {
      setRejoinMatchId(null);
      localStorage.removeItem("demo-rejoin-match");
    }, Math.max(0, remainingMs));
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
      if (event.code === "Space" && stage === "live") {
        event.preventDefault();
        activateDefend();
        return;
      }
      // F toggles fullscreen for the arena — ignored while typing an answer.
      if (
        (event.key === "f" || event.key === "F") &&
        !event.metaKey && !event.ctrlKey && !event.altKey &&
        !(event.target instanceof HTMLInputElement)
      ) {
        event.preventDefault();
        toggleFullscreen();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
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

  useEffect(() => () => {
    bgmRef.current?.pause();
    bgmRef.current = null;
    stopLoopingSfx(loserTauntRef);
    stopLoopingSfx(winnerFanfareRef);
  }, []);

  function reset() {
    // Leaving a live match in-place (e.g. the "Back" button) doesn't unmount
    // the component, so the pagehide/unmount-cleanup rejoin-entry write never
    // fires. Persist it here too, and update state directly so the landing
    // screen rendered right after this shows the rejoin banner immediately.
    if (stage === "live" && snapshot?.mode === "pvp" && snapshot.matchId) {
      localStorage.setItem("demo-rejoin-match", JSON.stringify({ matchId: snapshot.matchId, leftAtMs: Date.now() }));
      setRejoinMatchId(snapshot.matchId);
    }
    socketRef.current?.emit("demo.match.leave");
    bgmRef.current?.pause();
    bgmRef.current = null;
    stopLoopingSfx(loserTauntRef);
    stopLoopingSfx(winnerFanfareRef);
    lastAudioEventKeyRef.current = undefined;
    if (summaryTimerRef.current !== null) {
      clearTimeout(summaryTimerRef.current);
      summaryTimerRef.current = null;
    }
    setStage("landing");
    setSnapshot(null);
    setAnswer("");
    setOpponentAnswer("");
    setError("");
    setRematchState({ status: "idle" });
    setInvitedFriendIds(new Set());
    setPvpChoice(null);
    setSummaryVisible(false);
    setTutorialActive(false);
  }

  useImperativeHandle(ref, () => ({ goBackToChooser: reset }));

  // Tell the parent whether "back" has anywhere left to go to within this
  // component (the PvP quick/private chooser) or whether it should instead
  // navigate away, so the caller can swap the button between "Back" and "Home".
  const atTopLevel = mode === "pvp" && stage === "landing" && pvpChoice === null && effectiveInvite === undefined;
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
    setAnswer("");
    setOpponentAnswer("");
    setError("");
    setRematchState({ status: "idle" });
    setSummaryVisible(false);
    start("pvc");
  }

  function pickAvatar(avatar: string) {
    setSelectedAvatar(avatar);
  }

  function requestRematch() {
    if (snapshot?.matchId === undefined) return;
    socketRef.current?.emit("demo.rematch.request", { matchId: snapshot.matchId });
    setRematchState({ status: "pending" });
  }

  function acceptRematch() {
    if (snapshot?.matchId === undefined) return;
    socketRef.current?.emit("demo.rematch.accept", { matchId: snapshot.matchId });
    setRematchState({ status: "idle" });
  }

  function rejectRematch() {
    if (snapshot?.matchId === undefined) return;
    socketRef.current?.emit("demo.rematch.reject", { matchId: snapshot.matchId });
    setRematchState({ status: "idle" });
  }

  function attemptRejoin() {
    const matchId = rejoinMatchId;
    if (matchId === null) return;
    const socket = liveSocket();
    if (socket === null) return;
    setError("");
    socket.emit("demo.reconnect.resume", {
      matchId,
      playerId: playerIdRef.current,
    });
    // If the server rejects (match expired), the demo.error handler will
    // surface it and the stored key gets cleared.
    setRejoinMatchId(null);
    localStorage.removeItem("demo-rejoin-match");
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

  function start(mode: DemoMode) {
    startBackgroundMusic(bgmRef, selectedBackground.bgm);
    const socket = liveSocket();
    if (socket === null) {
      return;
    }
    setSnapshot(null);
    setError("");

    if (mode === "pvc") {
      // PvC starts immediately (no queue). The shared socket is already connected,
      // so this is one quick round trip; "starting" is just a fallback that's
      // imperceptible in practice.
      setStage("starting");
      socket.emit("demo.pvc.start", {
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
    setStage("matchmaking");
    socket.emit("demo.queue.join", {
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
    setError("");
    setStage("starting");
    socket.emit("demo.private.create", {
      playerId: playerIdRef.current,
      avatar: selectedAvatar,
      arenaId: selectedBackground.id,
      difficulty: selectedDifficulty,
    });
  }

  function sendInvite(friendId: string) {
    setInviteNote("");
    socketRef.current?.emit("demo.private.invite", {
      roomId: snapshotRef.current?.roomId,
      friendId,
    });
    setInvitedFriendIds((prev) => { const next = new Set(prev); next.add(friendId); return next; });
    setInviteNote(t('demo.inviteSent'));
  }

  // Invited friend joins the private room with their chosen avatar.
  function acceptInvite() {
    startBackgroundMusic(bgmRef, DEMO_BACKGROUNDS[0].bgm);
    const socket = liveSocket();
    if (socket === null || invite === undefined) {
      return;
    }
    setSnapshot(null);
    setError("");
    setStage("starting");
    socket.emit("demo.private.accept", {
      roomId: invite.roomId,
      playerId: playerIdRef.current,
      avatar: selectedAvatar,
    });
  }

  function submitAnswer() {
    if (!ownInputAvailable || snapshot?.matchId === undefined || answer.trim() === "") {
      return;
    }

    socketRef.current?.emit("demo.answer.submit", {
      matchId: snapshot.matchId,
      playerId: playerIdRef.current,
      answer,
    });
  }

  function updateAnswerInput(value: string) {
    const sanitized = sanitizeAnswerInput(value);
    setAnswer(sanitized);
    if (snapshot?.matchId !== undefined && snapshot.mode === "pvp") {
      socketRef.current?.emit("demo.answer.typing", {
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

    socketRef.current?.emit("demo.defend.activate", {
      matchId: snapshot.matchId,
      playerId: playerIdRef.current,
    });
  }

  function setReady() {
    if (snapshot?.roomId === undefined) {
      return;
    }

    socketRef.current?.emit("demo.ready.set", {
      roomId: snapshot.roomId,
      playerId: playerIdRef.current,
    });
  }

  function stopReady() {
    if (snapshot?.roomId === undefined) {
      return;
    }

    socketRef.current?.emit("demo.ready.stop", {
      roomId: snapshot.roomId,
      playerId: playerIdRef.current,
    });
  }

  function leavePrematch() {
    if (snapshot?.roomId === undefined) {
      reset();
      return;
    }

    socketRef.current?.emit("demo.prematch.leave", {
      roomId: snapshot.roomId,
      playerId: playerIdRef.current,
    });
    reset();
  }

  return (
    <main className="demo-shell" ref={shellRef}>
      {error !== "" && (
        <div className="demo-error" role="alert">
          {error}
          <button type="button" className="demo-error-close" onClick={() => setError("")} aria-label="Dismiss">✕</button>
        </div>
      )}

      {/* Rejoin banner: shown on landing when a PvP match is still within its reconnect-grace window. */}
      {stage === "landing" && rejoinMatchId !== null && (
        <div className="demo-rejoin-banner">
          <span>{t('demo.rejoinBannerText')}</span>
          <div className="demo-rejoin-actions">
            <button type="button" className="demo-start-button" style={{ padding: "8px 20px", fontSize: "14px" }} onClick={attemptRejoin}>
              {t('demo.rejoinMatch')}
            </button>
            <button type="button" className="demo-text-button" onClick={() => { setRejoinMatchId(null); localStorage.removeItem("demo-rejoin-match"); }}>
              {t('demo.dismiss')}
            </button>
          </div>
        </div>
      )}

      {/* PvC setup: pick token + arena + difficulty, then start. */}
      {stage === "landing" && mode === "pvc" && !tutorialActive && (
        <section className="demo-landing demo-landing-solo" aria-label="Prepare your duel">
          <div className="demo-landing-copy">
            <p>{t('demo.playerVsCpu')}</p>
            <h2>{t('demo.selectFighter')}</h2>
            <AvatarPicker selected={selectedAvatar} onPick={pickAvatar} />
            <button
              type="button"
              className="demo-start-button"
              onClick={() => {
                if (isTutorial) {
                  startBackgroundMusic(bgmRef, selectedBackground.bgm);
                  setTutorialActive(true);
                  return;
                }
                start("pvc");
              }}
            >
              ⚔️  {t('demo.startDuel')}
            </button>
          </div>
          <div className="demo-landing-arena">
            <span className="demo-setup-label">{t('demo.chooseArena')}</span>
            <BackgroundPicker selectedId={selectedBackground.id} onPick={setSelectedBackground} />
          </div>
        </section>
      )}

      {/* Scripted tutorial walkthrough — replaces the live engine entirely
          (deterministic, not subject to CPU randomness) until it hands off
          to a real PvC match via onComplete. */}
      {stage === "landing" && mode === "pvc" && tutorialActive && (
        <TutorialWalkthrough
          selectedAvatar={selectedAvatar}
          background={selectedBackground}
          cpuKey={cpuKey}
          onComplete={() => {
            setTutorialActive(false);
            start("pvc");
          }}
        />
      )}

      {/* PvP — invited friend: pick a token, then accept. */}
      {stage === "landing" && mode === "pvp" && effectiveInvite !== undefined && (
        <section className="demo-landing demo-pvp-entry" aria-label="Join private match">
          <p>{t('demo.privateMatchInvite')}</p>
          <h2>{t('demo.joinMatch').replace('{name}', effectiveInvite.fromUsername)}</h2>
          <AvatarPicker selected={selectedAvatar} onPick={pickAvatar} />
          <button type="button" className="demo-start-button" onClick={acceptInvite}>
            {t('demo.acceptJoin')}
          </button>
        </section>
      )}

      {/* PvP — choose match type first, avatar is optional (defaults). */}
      {stage === "landing" && mode === "pvp" && effectiveInvite === undefined && pvpChoice === null && (
        <section className="demo-landing demo-pvp-entry" aria-label="Choose match type">
          <p>{t('demo.playerVsPlayer')}</p>
          <h2>{t('demo.chooseBattle')}</h2>
          <div className="demo-pvp-options">
            <button type="button" className="demo-pvp-option" onClick={() => setPvpChoice("quick")}>
              <strong>{t('versus.quickMatch')}</strong>
              <span>{t('demo.quickMatchDesc')}</span>
            </button>
            <button type="button" className="demo-pvp-option" onClick={() => setPvpChoice("private")}>
              <strong>{t('demo.privateMatch')}</strong>
              <span>{t('demo.privateMatchDesc')}</span>
            </button>
          </div>
        </section>
      )}

      {/* PvP — quick match: pick avatar then join. */}
      {stage === "landing" && mode === "pvp" && effectiveInvite === undefined && pvpChoice === "quick" && (
        <section className="demo-landing demo-pvp-entry" aria-label="Quick match setup">
          <h2>{t('versus.quickMatch')}</h2>
          <span className="demo-setup-label">{t('demo.chooseFighter')} <small style={{opacity:0.6}}>{t('common.optional')}</small></span>
          <AvatarPicker selected={selectedAvatar} onPick={pickAvatar} />
          <button type="button" className="demo-start-button" onClick={() => start("pvp")}>
            {t('demo.findMatch')}
          </button>
        </section>
      )}

      {/* PvP — private setup: pick avatar + arena, then create room. */}
      {stage === "landing" && mode === "pvp" && effectiveInvite === undefined && pvpChoice === "private" && (
        <section className="demo-landing demo-landing-solo" aria-label="Set up private match">
          <div className="demo-landing-copy">
            <h2>{t('demo.privateMatchSetupTitle')}</h2>
            <span className="demo-setup-label">{t('demo.chooseFighter')} <small style={{opacity:0.6}}>{t('common.optional')}</small></span>
            <AvatarPicker selected={selectedAvatar} onPick={pickAvatar} />
            <button type="button" className="demo-start-button" onClick={createPrivateRoom}>
              {t('demo.createRoom')}
            </button>
          </div>
          <div className="demo-landing-arena">
            <span className="demo-setup-label">{t('demo.chooseArena')}</span>
            <BackgroundPicker selectedId={selectedBackground.id} onPick={setSelectedBackground} />
          </div>
        </section>
      )}

      {stage === "starting" && (
        <section className="demo-starting" aria-label="Starting duel">
          <span className="sf-spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
          <p>{t('demo.startingDuel')}</p>
        </section>
      )}

      {stage === "matchmaking" && (
        <section className="demo-matchmaking" aria-label="Matchmaking page">
          <div className="demo-room-card">
            <p>{t('demo.matchmaking')}</p>
            <h2>{snapshot?.waiting ? t('demo.waitingForP2') : t('demo.findingMatch')}</h2>
            <div className="demo-vs-strip">
              <PlayerToken avatar={selectedAvatar} label={t('common.you')} tone="p1" />
              <div className="demo-waiting-slot">{t('demo.waiting')}</div>
            </div>
          </div>
        </section>
      )}

      {stage === "ready" && snapshot?.readyState !== undefined && (() => {
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
          <section className="demo-ready" aria-label="Ready page">
            {/* Full arena stage with selected avatars on their platforms */}
            <div className={`stage demo-service-stage background-${snapshot.arenaId ?? "math-arena"}`}>
              <img alt={arena.label} src={arena.src} />
              <div className="ready-vs-text" aria-hidden="true">VS</div>
              <div className={`avatar-pad p1${rs.p1Ready ? ' ready-bob' : ''}`}>
                <div className="emoji-avatar">{p1Pres?.avatar ?? "❔"}</div>
              </div>
              <div className={`avatar-pad p2${rs.p2Ready ? ' ready-bob' : ''}`} style={!opponentPresent ? { opacity: 0.28 } : undefined}>
                <div className="emoji-avatar" style={!opponentPresent ? { filter: 'grayscale(1)' } : undefined}>
                  {p2Pres?.avatar ?? "❔"}
                </div>
              </div>
            </div>

            {/* Controls panel below the arena */}
            <div className="demo-room-card">
              <div className="demo-ready-status">
                <h2>
                  {inCountdown
                    ? t('demo.matchBeginsIn')
                    : opponentPresent
                      ? t('demo.readyCheck')
                      : t('demo.waitingForOpponent')}
                </h2>

                <div className="demo-vs-strip">
                  <PlayerToken
                    avatar={p1Pres?.avatar ?? "❔"}
                    label={p1Pres?.username ?? t('demo.player1')}
                    tone={rs.p1Ready ? "p1" : "pending"}
                    isReady={rs.p1Ready}
                  />
                  <div className="demo-versus">{t('demo.vsCaps')}</div>
                  {opponentPresent ? (
                    <PlayerToken
                      avatar={p2Pres?.avatar ?? "❔"}
                      label={p2Pres?.username ?? t('demo.player2')}
                      tone={rs.p2Ready ? "p2" : "pending"}
                      isReady={rs.p2Ready}
                    />
                  ) : (
                    <div className="demo-waiting-slot">{t('demo.waiting')}</div>
                  )}
                </div>

                {showInvite ? (
                  <div className="demo-invite-panel">
                    <strong>{t('demo.inviteFriend')}</strong>
                    {friends.filter((f) => f.online).length === 0 ? (
                      <span className="demo-invite-empty">{t('demo.noFriendsOnline')}</span>
                    ) : (
                      <ul className="demo-invite-list">
                        {friends.filter((f) => f.online).map((f) => {
                          const invited = invitedFriendIds.has(f.id);
                          return (
                            <li key={f.id}>
                              <span>{f.username}</span>
                              <button
                                type="button"
                                disabled={invited}
                                style={invited ? { background: "rgba(253,224,71,0.18)", borderColor: "#fde047", color: "#fde047" } : undefined}
                                onClick={() => sendInvite(f.id)}
                              >
                                {invited ? t('demo.invited') : t('demo.invite')}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                    {inviteNote !== "" && <span className="demo-invite-note">{inviteNote}</span>}
                    <button type="button" className="demo-text-button" onClick={leavePrematch}>{t('demo.cancelRoom')}</button>
                  </div>
                ) : inCountdown ? (
                  <div className="demo-ready-countdown">
                    <strong>{Math.max(0, Math.ceil(((rs.countdownEndsAtMs ?? now) - now) / 1000))}</strong>
                    <span>{t('demo.getReady')}</span>
                  </div>
                ) : (() => {
                  const iAmReady = iAmP1 ? rs.p1Ready : rs.p2Ready;
                  return (
                    <div className="demo-ready-actions">
                      <button
                        type="button"
                        disabled={!opponentPresent}
                        style={iAmReady ? { background: "rgba(253,224,71,0.18)", borderColor: "#fde047" } : undefined}
                        onClick={setReady}
                      >
                        {iAmReady ? `${t('demo.readyWord')} ✓` : t('demo.readyWord')}
                      </button>
                      <button type="button" onClick={leavePrematch}>{t('common.back')}</button>
                    </div>
                  );
                })()}

                {inCountdown && (
                  <button className="demo-stop-button" type="button" onClick={stopReady}>{t('demo.stop')}</button>
                )}
                {rs.message !== undefined && <div className="demo-ready-message">{rs.message}</div>}
              </div>
            </div>
          </section>
        );
      })()}

      {(stage === "live" || stage === "summary") && snapshot?.combatants !== undefined && (
        <section className={`demo-live ${snapshot.summary === undefined ? "demo-live-playing" : ""}`} aria-label="Live match page">
          <div className="demo-stage-card">
            <div className={`stage show-avatars show-question demo-service-stage background-${snapshot.arenaId ?? "math-arena"} ${stageClassFor(snapshot.eventLog ?? [])}`}>
              <img
                alt={backgroundById(snapshot.arenaId).label}
                src={backgroundById(snapshot.arenaId).src}
              />
              <div className="top-hud" aria-label="Fight round status">
                <HpBar combatant={snapshot.combatants.p1} label={labelFor(snapshot.combatants.p1, playerIdRef.current)} align="left" pres={snapshot.summary?.dcCombatantId === snapshot.combatants.p1.id ? undefined : snapshot.players?.[snapshot.combatants.p1.id]} />
                <div className="round-clock" aria-label="Fight round timer">
                  <span>{snapshot.isFinalRound === true ? t('round.finalShort') : `${t('round.roundPrefixCaps')} ${snapshot.roundNumber ?? 1}`}</span>
                  <strong className="digital-display">{roundTimerLeft}</strong>
                </div>
                <HpBar combatant={snapshot.combatants.p2} label={labelFor(snapshot.combatants.p2, playerIdRef.current)} align="right" pres={snapshot.summary?.dcCombatantId === snapshot.combatants.p2.id ? undefined : snapshot.players?.[snapshot.combatants.p2.id]} />
              </div>

              {(() => {
                const isKoMatch = snapshot.summary?.status === "completed" && snapshot.summary.dcCombatantId === undefined;
                const p1Ko = isKoMatch && snapshot.combatants.p1.hp <= 0;
                const p2Ko = isKoMatch && snapshot.combatants.p2.hp <= 0;
                const winnerCombatantId = snapshot.summary !== undefined ? resolveWinnerCombatantId(snapshot.summary) : undefined;
                const p1Winner = winnerCombatantId !== undefined && winnerCombatantId === snapshot.combatants.p1.id;
                const p2Winner = winnerCombatantId !== undefined && winnerCombatantId === snapshot.combatants.p2.id;
                return (
                  <>
                    <div className={`${avatarPadClass(snapshot.combatants.p1, "p1", snapshot.eventLog ?? [], now)}${p1Ko ? " ko-final-blow" : ""}${p1Winner ? " winner-celebrate" : ""}`}>
                      <div className="emoji-avatar" aria-label="P1 avatar">
                        {snapshot.summary?.dcCombatantId === snapshot.combatants.p1.id
                          ? "💨"
                          : avatarFor(snapshot.combatants.p1, snapshot.players)}
                      </div>
                    </div>
                    <div className={`${avatarPadClass(snapshot.combatants.p2, "p2", snapshot.eventLog ?? [], now)}${p2Ko ? " ko-final-blow" : ""}${p2Winner ? " winner-celebrate" : ""}`}>
                      <div className="emoji-avatar" aria-label="P2 avatar">
                        {snapshot.summary?.dcCombatantId === snapshot.combatants.p2.id
                          ? "💨"
                          : avatarFor(snapshot.combatants.p2, snapshot.players)}
                      </div>
                    </div>
                  </>
                );
              })()}

              <div className="shock-flash-layer" aria-hidden="true" />
              <RoundIntroOverlay snapshot={snapshot} now={now} />
              {snapshot.summary === undefined && <OutcomeBanner eventLog={snapshot.eventLog ?? []} playerSlot={playerSlot} />}
              <DamageCallout eventLog={snapshot.eventLog ?? []} />

              {snapshot.summary !== undefined && summaryVisible && (
                <MatchSummaryOverlay
                  className={summaryClass(snapshot.summary, playerIdRef.current)}
                  mode={snapshot.mode}
                  playerId={playerIdRef.current}
                  players={snapshot.players}
                  roundNumber={snapshot.roundNumber ?? 1}
                  summary={snapshot.summary}
                  rematchState={rematchState}
                  onRematchRequest={requestRematch}
                  onRematchAccept={acceptRematch}
                  onRematchReject={rejectRematch}
                  onReset={reset}
                  onPlayAgain={playAgainPvc}
                />
              )}

              {snapshot.phase !== "round_prep" && (
              <div className="question-stack">
                <strong className={`calc-display ${questionDisplayClass(snapshot.question?.prompt ?? t('tutorial.ready'))}`}>
                  {formatPrompt(snapshot.question?.prompt ?? t('tutorial.ready'))}
                </strong>
                <form
                  className="answer-row demo-service-answer-row"
                  onSubmit={(event) => {
                    event.preventDefault();
                    submitAnswer();
                  }}
                >
                  <label className={!ownInputEnabled ? "locked" : "input-ready"}>
                    <span className="answer-box-head">
                      <span>{playerSlot?.toUpperCase() ?? "P1"} {t('tutorial.answer')}</span>
                      {ownCombatant !== undefined && <ShieldPip combatant={ownCombatant} now={now} />}
                    </span>
                    <input
                      ref={answerInputRef}
                      disabled={!ownInputEnabled}
                      inputMode="numeric"
                      value={answer}
                      onChange={(event) => updateAnswerInput(event.target.value)}
                    />
                  </label>
                  <label className="opponent-box">
                    <span className="answer-box-head">
                      <span>{opponentSlot.toUpperCase()} {t('tutorial.answer')}</span>
                      {opponentCombatant !== undefined && <ShieldPip combatant={opponentCombatant} now={now} />}
                    </span>
                    <output className={opponentAnswer === "" && opponentCombatant?.driver !== "cpu" ? "waiting" : undefined}>
                      {opponentCombatant?.driver === "cpu" ? t('tutorial.cpuThinking') : (opponentAnswer || "…")}
                    </output>
                  </label>
                </form>

                <div className="revenge-row" aria-label="Revenge gauges">
                  <RevengeGauge combatant={snapshot.combatants.p1} align="left" />
                  <RevengeGauge combatant={snapshot.combatants.p2} align="right" />
                </div>

                <div className="power-meter" aria-label="Attack strength preview">
                  <span>{t('tutorial.attackStrength')}</span>
                  <div className="power-track demo-service-power-track">
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
              <div className="demo-controls-bar" aria-label="How to play">
                <span className="demo-controls-round">
                  {snapshot.isFinalRound === true ? t('demo.finalRound') : `${t('demo.roundPrefix')} ${snapshot.roundNumber ?? 1}`}
                </span>
                <span>⌨️ {t('demo.typeAnswerThenEnter')}</span>
                <span className="demo-controls-help" tabIndex={0}>
                  🛡️ {t('demo.spaceToDefend')} <i className="demo-help-mark">ⓘ</i>
                  <span className="demo-help-pop" role="tooltip">
                    <strong>{t('demoHelp.defendTitle')}</strong>
                    <span>{t('demoHelp.defendIntro')}</span>
                    <ul>
                      <li>{t('demoHelp.defendBullet1')}</li>
                      <li>{t('demoHelp.defendBullet2')}</li>
                      <li>{t('demoHelp.defendBullet3')}</li>
                      <li>{t('demoHelp.defendBullet4')}</li>
                    </ul>
                    <span>{t('demoHelp.defendOutro')}</span>
                  </span>
                </span>
                <button type="button" className="demo-controls-fs" onClick={toggleFullscreen} aria-label="Toggle fullscreen">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
                  </svg>
                  {t('demo.fullscreen')}
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
});

// ---------------------------------------------------------------------------
// Scripted tutorial walkthrough
// ---------------------------------------------------------------------------
//
// A fully client-side, deterministic mini-fight that reuses the same render
// helpers as the real live arena (HpBar, RevengeGauge, ShieldPip, the avatar
// animations driven by avatarPadClass/eventLog, etc.) so it looks identical,
// but is driven by local state instead of the server — the real PvC CPU's
// randomized accuracy/timing can't guarantee a SHOCK or a block landing
// inside the 1.5s defend window on cue, so this never touches the live match
// engine. Once the script finishes, onComplete() hands off to a real match.
type TutorialStepId =
  | "welcome"
  | "first-question"
  | "streak"
  | "gauge"
  | "shock-demo"
  | "shock-explain"
  | "defend-prompt"
  | "defend-explain"
  | "blocking"
  | "stun-explain"
  | "no-attack-while-defend"
  | "revenge-gauge"
  | "revenge-damage"
  | "finish";

const TUTORIAL_BOX_CONTENT: Record<TutorialStepId, { bodyKey: TranslationKey; showNext: boolean; arrow?: "gauge" | "revenge" } | null> = {
  welcome: {
    bodyKey: "tutorial.welcome",
    showNext: true,
  },
  "first-question": {
    bodyKey: "tutorial.firstQuestion",
    showNext: false,
  },
  streak: {
    bodyKey: "tutorial.streak",
    showNext: true,
  },
  gauge: {
    bodyKey: "tutorial.gauge",
    showNext: true,
    arrow: "gauge",
  },
  "shock-demo": null,
  "shock-explain": {
    bodyKey: "tutorial.shockExplain",
    showNext: true,
  },
  "defend-prompt": {
    bodyKey: "tutorial.defendPrompt",
    showNext: false,
  },
  "defend-explain": {
    bodyKey: "tutorial.defendExplain",
    showNext: true,
  },
  blocking: null,
  "stun-explain": {
    bodyKey: "tutorial.stunExplain",
    showNext: true,
  },
  "no-attack-while-defend": {
    bodyKey: "tutorial.noAttackWhileDefend",
    showNext: true,
  },
  "revenge-gauge": {
    bodyKey: "tutorial.revengeGauge",
    showNext: true,
    arrow: "revenge",
  },
  "revenge-damage": {
    bodyKey: "tutorial.revengeDamage",
    showNext: true,
  },
  finish: {
    bodyKey: "tutorial.finish",
    showNext: true,
  },
};

function makeTutorialCombatant(slot: DemoSlot, id: string, driver: "human" | "cpu"): DemoCombatant {
  return {
    slot,
    id,
    driver,
    hp: 100,
    maxHp: 100,
    currentStreak: 0,
    longestStreak: 0,
    revengeBlocks: 0,
    revengeActive: false,
    defendAvailable: true,
    submittedAttempts: 0,
    correctAnswers: 0,
    statusEffects: [],
  };
}

function TutorialWalkthrough({
  selectedAvatar,
  background,
  cpuKey,
  onComplete,
}: {
  selectedAvatar: string;
  background: (typeof DEMO_BACKGROUNDS)[number];
  cpuKey: string;
  onComplete: () => void;
}) {
  const t = useT();
  const cpuId = `cpu:${cpuKey}`;
  const [step, setStep] = useState<TutorialStepId>("welcome");
  const [p1, setP1] = useState<DemoCombatant>(() => makeTutorialCombatant("p1", "tutorial-player", "human"));
  const [p2, setP2] = useState<DemoCombatant>(() => makeTutorialCombatant("p2", cpuId, "cpu"));
  const [eventLog, setEventLog] = useState<DemoEvent[]>([]);
  const [question, setQuestion] = useState<{ prompt: string; expectedAnswer: number; startedAtMs: number } | null>(null);
  const [answer, setAnswer] = useState("");
  const [now, setNow] = useState(Date.now());
  const answerInputRef = useRef<HTMLInputElement | null>(null);

  const players: Record<string, PlayerPresentation> = {
    "tutorial-player": {
      playerId: "tutorial-player",
      username: t('common.you'),
      avatar: selectedAvatar,
      profilePictureUrl: null,
      identityImageSource: "avatar",
      premadeAvatarKey: null,
      isCpu: false,
    },
  };

  useEffect(() => {
    const tick = window.setInterval(() => setNow(Date.now()), 100);
    return () => window.clearInterval(tick);
  }, []);

  useEffect(() => {
    if (step === "first-question" || step === "defend-prompt") {
      answerInputRef.current?.focus();
    }
  }, [step]);

  function pushEvent(name: string, payload: Record<string, unknown>) {
    setEventLog((prev) => [{ name, message: "", serverTimestampMs: Date.now(), payload }, ...prev].slice(0, 8));
  }

  function startQuestion(prompt: string, expectedAnswer: number) {
    setQuestion({ prompt, expectedAnswer, startedAtMs: Date.now() });
    setAnswer("");
  }

  function submitAnswer() {
    if (step !== "first-question" || question === null) return;
    if (Number(answer) !== question.expectedAnswer) {
      setAnswer("");
      return;
    }
    const damage = 8;
    setP2((prev) => ({ ...prev, hp: Math.max(0, prev.hp - damage) }));
    setP1((prev) => ({ ...prev, currentStreak: 1, longestStreak: 1, correctAnswers: 1, submittedAttempts: prev.submittedAttempts + 1 }));
    pushEvent("attack.landed", { attackerSlot: "p1", targetCombatantSlot: "p2", damage, attackerStreak: 1 });
    playSfx(AUDIO_ASSETS.hit, 0.34);
    setQuestion(null);
    setAnswer("");
    setStep("streak");
  }

  function activateDefend() {
    if (step !== "defend-prompt") return;
    const startedAtMs = Date.now();
    setP1((prev) => ({
      ...prev,
      defendAvailable: false,
      statusEffects: [...prev.statusEffects, { type: "defend", startedAtMs, endsAtMs: startedAtMs + 1500 }],
    }));
    pushEvent("defend.activated", { combatantSlot: "p1" });
    playSfx(AUDIO_ASSETS.defend, 0.46);
    setQuestion(null);
    setStep("defend-explain");
  }

  // Auto-runs the question timer to its deadline without anyone answering,
  // guaranteeing the SHOCK demonstration instead of leaving it to chance.
  useEffect(() => {
    if (step !== "shock-demo") return;
    startQuestion("9 + 4", 13);
    const timer = window.setTimeout(() => {
      setP1((prev) => ({ ...prev, hp: Math.max(0, prev.hp - 10) }));
      setP2((prev) => ({ ...prev, hp: Math.max(0, prev.hp - 10) }));
      pushEvent("shock.applied", { shockDamage: 10 });
      playSfx(AUDIO_ASSETS.shock, 0.72);
      window.setTimeout(() => setStep("shock-explain"), 900);
    }, ATTACK_STRENGTH_MS);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // The simulated CPU "attacks" shortly after the player presses Next on
  // defend-explain — comfortably inside the 1.5s defend window, so the block
  // (and the stun it causes) is guaranteed rather than left to CPU timing.
  useEffect(() => {
    if (step !== "blocking") return;
    const timer = window.setTimeout(() => {
      const stunnedAtMs = Date.now();
      setP2((prev) => ({
        ...prev,
        currentStreak: 0,
        statusEffects: [...prev.statusEffects, { type: "stunned", startedAtMs: stunnedAtMs, endsAtMs: stunnedAtMs + 1000 }],
      }));
      pushEvent("defend.blocked", { attackerSlot: "p2", defenderSlot: "p1" });
      pushEvent("stun.applied", { combatantSlot: "p2" });
      playSfx(AUDIO_ASSETS.block, 0.66);
      window.setTimeout(() => setStep("stun-explain"), 900);
    }, 700);
    return () => window.clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const canAdvance = TUTORIAL_BOX_CONTENT[step]?.showNext === true;
      if (event.code === "Space") {
        event.preventDefault();
        if (step === "defend-prompt") {
          activateDefend();
        } else if (canAdvance) {
          handleNext();
        }
        return;
      }
      if (event.key === "Enter" && canAdvance) {
        event.preventDefault();
        handleNext();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  function handleNext() {
    switch (step) {
      case "welcome":
        startQuestion("7 + 5", 12);
        setStep("first-question");
        return;
      case "streak":
        setStep("gauge");
        return;
      case "gauge":
        setStep("shock-demo");
        return;
      case "shock-explain":
        startQuestion("6 + 6", 12);
        setStep("defend-prompt");
        return;
      case "defend-explain":
        setStep("blocking");
        return;
      case "stun-explain":
        setStep("no-attack-while-defend");
        return;
      case "no-attack-while-defend":
        setP1((prev) => ({ ...prev, revengeBlocks: REVENGE_BLOCKS, revengeActive: true }));
        playSfx(AUDIO_ASSETS.revengeReady, 0.6);
        setStep("revenge-gauge");
        return;
      case "revenge-gauge":
        setStep("revenge-damage");
        return;
      case "revenge-damage":
        setStep("finish");
        return;
      case "finish":
        onComplete();
        return;
      default:
        return;
    }
  }

  const attackProgress = question === null
    ? 0
    : Math.min(100, Math.max(0, ((now - question.startedAtMs) / ATTACK_STRENGTH_MS) * 100));
  const inputEnabled = step === "first-question";
  const box = TUTORIAL_BOX_CONTENT[step];

  return (
    <section className="demo-live demo-live-playing" aria-label="Tutorial walkthrough">
      <div className="demo-stage-card">
        <div className={`stage show-avatars show-question demo-service-stage background-${background.id}`}>
          <img alt={background.label} src={background.src} />
          <div className="top-hud" aria-label="Fight round status">
            <HpBar combatant={p1} label="P1" align="left" pres={players[p1.id]} />
            <div className="round-clock" aria-label="Fight round timer">
              <span>{t('solo.tutorial')}</span>
              <strong className="digital-display">-</strong>
            </div>
            <HpBar combatant={p2} label="P2" align="right" />
          </div>

          <div className={avatarPadClass(p1, "p1", eventLog, now)}>
            <div className="emoji-avatar" aria-label="P1 avatar">{avatarFor(p1, players)}</div>
          </div>
          <div className={avatarPadClass(p2, "p2", eventLog, now)}>
            <div className="emoji-avatar" aria-label="P2 avatar">{avatarFor(p2, undefined)}</div>
          </div>

          <div className="shock-flash-layer" aria-hidden="true" />
          <OutcomeBanner eventLog={eventLog} playerSlot="p1" />
          <DamageCallout eventLog={eventLog} />

          <div className="question-stack">
            <strong className={`calc-display ${questionDisplayClass(question?.prompt ?? t('tutorial.ready'))}`}>
              {question !== null ? formatPrompt(question.prompt) : t('tutorial.ready')}
            </strong>
            <form
              className="answer-row demo-service-answer-row"
              onSubmit={(event) => {
                event.preventDefault();
                submitAnswer();
              }}
            >
              <label className={!inputEnabled ? "locked" : "input-ready"}>
                <span className="answer-box-head">
                  <span>P1 {t('tutorial.answer')}</span>
                  <ShieldPip combatant={p1} now={now} />
                </span>
                <input
                  ref={answerInputRef}
                  disabled={!inputEnabled}
                  inputMode="numeric"
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value.replace(/[^0-9-]/g, ""))}
                />
              </label>
              <label className="opponent-box">
                <span className="answer-box-head">
                  <span>P2 {t('tutorial.answer')}</span>
                  <ShieldPip combatant={p2} now={now} />
                </span>
                <output>{step === "shock-demo" ? "…" : t('tutorial.cpuThinking')}</output>
              </label>
            </form>

            <div className="revenge-row" aria-label="Revenge gauges">
              <RevengeGauge combatant={p1} align="left" />
              <RevengeGauge combatant={p2} align="right" />
              {box?.arrow === "revenge" && <span className="tutorial-arrow revenge" aria-hidden="true">⬆</span>}
            </div>

            <div className="power-meter" aria-label="Attack strength preview">
              <span>{t('tutorial.attackStrength')}</span>
              <div className="power-track demo-service-power-track">
                <i style={{ left: `calc(${attackProgress}% - 5px)` }} />
                <b>⚡</b>
              </div>
              <div className="power-markers" aria-label="Attack strength scale">
                <span>1</span><span>5</span><span>10</span><span>15</span><span>20</span><span>25</span><span>30</span>
              </div>
              {box?.arrow === "gauge" && <span className="tutorial-arrow gauge" aria-hidden="true">⬇</span>}
            </div>
          </div>

          {box !== null && (
            <div className="tutorial-box" role="status" aria-live="polite">
              <p>{t(box.bodyKey)}</p>
              {box.showNext && (
                <button type="button" className="demo-start-button" onClick={handleNext}>Next</button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function getOrCreatePlayerId(): string {
  const key = "next-duel-demo-player-id";
  const existing = window.localStorage.getItem(key);
  if (existing !== null) {
    return existing;
  }

  const next = `player-${Math.random().toString(36).slice(2, 10)}`;
  window.localStorage.setItem(key, next);
  return next;
}

function inferPlayerSlot(snapshot: DemoSnapshot | null, playerId: string): DemoSlot | undefined {
  if (snapshot?.playerSlot !== undefined) {
    return snapshot.playerSlot;
  }

  if (snapshot?.readyState?.p1PlayerId === playerId) {
    return "p1";
  }

  if (snapshot?.readyState?.p2PlayerId === playerId) {
    return "p2";
  }

  if (snapshot?.combatants?.p1.id === playerId) {
    return "p1";
  }

  if (snapshot?.combatants?.p2.id === playerId) {
    return "p2";
  }

  return undefined;
}

function labelFor(combatant: DemoCombatant, playerId: string): string {
  if (combatant.id === playerId) {
    return combatant.slot.toUpperCase();
  }

  if (combatant.driver === "cpu") {
    return combatant.id.replace("cpu:", "").toUpperCase();
  }

  return combatant.slot.toUpperCase();
}

// Battle token for a combatant: humans use the shared chosen avatar (so both
// players see the same tokens); CPUs keep their themed emoji.
function avatarFor(combatant: DemoCombatant, players: Record<string, PlayerPresentation> | undefined): string {
  const pres = players?.[combatant.id];
  if (pres !== undefined && !pres.isCpu) {
    return pres.avatar;
  }
  if (combatant.driver === "cpu") {
    return CPU_AVATARS[combatant.id] ?? "👊";
  }
  return pres?.avatar ?? "❔";
}

function isLocked(combatant: DemoCombatant, now: number): boolean {
  return combatant.statusEffects.some((effect) => effect.endsAtMs > now);
}

// Locks typing entirely (stunned / missed). Defend does NOT hard-lock — the
// player can pre-type an answer while shielding but can't submit until it expires.
function isHardLocked(combatant: DemoCombatant, now: number): boolean {
  return combatant.statusEffects.some(
    (e) => e.endsAtMs > now && (e.type === "stunned" || e.type === "missed"),
  );
}

function PlayerToken({ avatar, label, tone, isReady }: { avatar: string; label: string; tone: DemoSlot | "pending"; isReady?: boolean }) {
  return (
    <div className={`demo-player-token ${tone}`}>
      <span>{avatar}</span>
      <strong style={isReady ? { color: '#22c55e', textShadow: '0 0 8px rgba(34,197,94,0.45)' } : undefined}>{label}</strong>
    </div>
  );
}

function AvatarPicker({ selected, onPick }: { selected: string; onPick: (avatar: string) => void }) {
  return (
    <div className="demo-avatar-picker" aria-label="Choose player avatar">
      {DEMO_AVATARS.map((avatar) => (
        <button
          className={avatar === selected ? "active" : ""}
          key={avatar}
          type="button"
          onClick={() => onPick(avatar)}
        >
          {avatar}
        </button>
      ))}
    </div>
  );
}

function BackgroundPicker({
  selectedId,
  onPick,
}: {
  selectedId: string;
  onPick: (background: (typeof DEMO_BACKGROUNDS)[number]) => void;
}) {
  return (
    <div className="demo-background-picker" aria-label="Choose match background">
      {DEMO_BACKGROUNDS.map((background) => (
        <button
          className={background.id === selectedId ? "active" : ""}
          key={background.id}
          type="button"
          onClick={() => onPick(background)}
        >
          <img alt="" src={background.src} />
          <span>{background.label}</span>
        </button>
      ))}
    </div>
  );
}

function DifficultyPicker({
  selected,
  pvpMatchCount,
  onPick,
}: {
  selected: Difficulty;
  pvpMatchCount: number;
  onPick: (d: Difficulty) => void;
}) {
  const t = useT();
  const remaining = Math.max(0, VERY_HARD_PVP_THRESHOLD - pvpMatchCount);
  const veryHardUnlocked = remaining === 0;

  const options: { value: Difficulty; label: string; locked: boolean; hint?: string }[] = [
    { value: 'very_easy', label: t('difficulty.veryEasy'), locked: false },
    { value: 'easy', label: t('difficulty.easy'), locked: false },
    {
      value: 'very_hard',
      label: veryHardUnlocked ? t('difficulty.veryHard') : t('difficulty.veryHardLocked'),
      locked: !veryHardUnlocked,
      hint: !veryHardUnlocked ? t('difficulty.veryHardUnlockHint').replace('{n}', String(remaining)) : undefined,
    },
  ];

  return (
    <div className="difficulty-picker">
      <span className="demo-setup-label">{t('difficulty.label')}</span>
      <div className="difficulty-options">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`difficulty-option${selected === opt.value ? ' active' : ''}${opt.locked ? ' locked' : ''}`}
            onClick={() => { if (!opt.locked) onPick(opt.value); }}
            disabled={opt.locked}
            title={opt.hint}
          >
            {opt.label}
            {opt.hint !== undefined && <small>{opt.hint}</small>}
          </button>
        ))}
      </div>
    </div>
  );
}

function FighterFace({ pres }: { pres?: PlayerPresentation }) {
  const url = pres ? assetUrl(pres.profilePictureUrl) : null;
  const initial = (pres?.username?.[0] ?? "?").toUpperCase();
  return (
    <span className="hp-face" aria-hidden>
      {url !== null ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" />
      ) : (
        <span className="hp-face-initial">{initial}</span>
      )}
    </span>
  );
}

function HpBar({
  combatant,
  label,
  align,
  pres,
}: {
  combatant: DemoCombatant;
  label: string;
  align: "left" | "right";
  pres?: PlayerPresentation;
}) {
  const hpPercent = Math.max(0, Math.min(100, (combatant.hp / combatant.maxHp) * 100));
  const roundedHp = Math.round(combatant.hp * 10) / 10;
  const name = pres?.username ?? label;
  if (align === "right") {
    return (
      <div className="hp-meter p2-hp">
        <strong>{roundedHp}</strong>
        <div className="hp-track"><i style={{ width: `${hpPercent}%` }} /></div>
        <span>{name}</span>
        <FighterFace pres={pres} />
      </div>
    );
  }

  return (
    <div className="hp-meter p1-hp">
      <FighterFace pres={pres} />
      <span>{name}</span>
      <div className="hp-track"><i style={{ width: `${hpPercent}%` }} /></div>
      <strong>{roundedHp}</strong>
    </div>
  );
}

// Shield that signals a fighter's DEFEND availability: bright when the block is
// ready, pulsing while the shield is actively up, faded once spent (recharges
// next question). Shown on each answer box so both players can read it.
function ShieldPip({ combatant, now }: { combatant: DemoCombatant; now: number }) {
  const active = combatant.statusEffects.some((e) => e.type === "defend" && e.endsAtMs > now);
  const state = active ? "active" : combatant.defendAvailable ? "ready" : "used";
  return (
    <i className={`shield-pip ${state}`} aria-label={`Defend ${state}`} title={`Defend ${state === "used" ? "used" : "ready"}`}>
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 2 4 5v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V5l-8-3Z" />
      </svg>
    </i>
  );
}

function OutcomeBanner({ eventLog, playerSlot }: { eventLog: DemoSnapshot["eventLog"]; playerSlot?: DemoSlot }) {
  const t = useT();
  const latest = latestVisualEvent(eventLog);
  if (latest === undefined) {
    return null;
  }

  return <div className={`outcome-banner show ${outcomeClass(latest)}`} key={eventKey(latest)}>{outcomeMessage(t, latest, playerSlot)}</div>;
}

function RoundIntroOverlay({ snapshot, now }: { snapshot: DemoSnapshot; now: number }) {
  const t = useT();
  if (snapshot.phase !== "round_prep" || snapshot.summary !== undefined) {
    return null;
  }

  const event = latestRoundPrepEvent(snapshot.eventLog);
  const elapsedMs = event === undefined ? 0 : Math.max(0, now - event.serverTimestampMs);
  const isGo = elapsedMs >= 1400;
  const roundLabel = snapshot.isFinalRound === true ? t('round.finalLong') : `${t('round.roundPrefixCaps')} ${snapshot.roundNumber ?? 1}`;

  return (
    <div className={`round-intro-overlay ${isGo ? "go" : "round"}`} aria-live="polite">
      <strong>{isGo ? t('round.go') : roundLabel}</strong>
    </div>
  );
}

function ReconnectOverlay({
  snapshot,
  playerSlot,
  now,
}: {
  snapshot: DemoSnapshot;
  playerSlot?: DemoSlot;
  now: number;
}) {
  const t = useT();
  const reconnectState = snapshot.reconnectState;
  if (reconnectState === undefined || snapshot.summary !== undefined) {
    return null;
  }

  const isDisconnectedPlayer = reconnectState.disconnectedSlot === playerSlot;
  if (reconnectState.status === "resuming") {
    const seconds = Math.max(0, Math.ceil(((reconnectState.resumeDeadlineAtMs ?? now) - now) / 1000));
    return (
      <div className="reconnect-overlay success" aria-live="assertive">
        <strong>{t('reconnect.success')}</strong>
        <span>{t('reconnect.getReadyExcl')}</span>
        <b>{seconds}</b>
      </div>
    );
  }

  const seconds = Math.max(0, Math.ceil((reconnectState.deadlineAtMs - now) / 1000));
  return (
    <div className="reconnect-overlay" aria-live="assertive">
      <strong>{t('reconnect.reconnecting')}</strong>
      <span>{isDisconnectedPlayer ? t('reconnect.youDisconnected') : `${reconnectState.disconnectedSlot.toUpperCase()} ${t('reconnect.disconnectedSuffix')}`}</span>
      <b>{seconds}</b>
    </div>
  );
}

function DamageCallout({ eventLog }: { eventLog: DemoSnapshot["eventLog"] }) {
  const latest = latestDamageEvent(eventLog);
  if (latest === undefined) {
    return null;
  }

  const targetSlot = readSlotPayload(latest, "targetCombatantSlot");
  const shock = latest.name === "shock.applied";
  const damage = latest.name === "shock.applied" ? 10 : readNumberPayload(latest, "damage");
  if (damage === undefined) {
    return null;
  }

  if (shock) {
    return (
      <>
        <div className="damage-callout p1 show" key={`${eventKey(latest)}-p1`}>-10 HP</div>
        <div className="damage-callout p2 show" key={`${eventKey(latest)}-p2`}>-10 HP</div>
      </>
    );
  }

  if (targetSlot === undefined) {
    return null;
  }

  return <div className={`damage-callout ${targetSlot} show`} key={eventKey(latest)}>-{formatCombatNumber(damage)} HP</div>;
}

function RevengeGauge({ combatant, align }: { combatant: DemoCombatant; align: "left" | "right" }) {
  const blocks = Array.from({ length: REVENGE_BLOCKS }, (_, index) => index);
  return (
    <div className={`revenge-gauge ${align} ${combatant.revengeActive ? "ready" : ""}`}>
      {blocks.map((index) => (
        <i className={index < combatant.revengeBlocks ? "filled" : ""} key={index} />
      ))}
      {combatant.revengeActive && <b>REVENGE</b>}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="demo-summary-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

// Match result shown as a centered overlay *inside* the arena frame (over a
// dimmed board) rather than a side panel that shrinks the stage.
type RematchState =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "received"; fromUsername: string }
  | { status: "rejected" };

function MatchSummaryOverlay({
  className,
  mode,
  playerId,
  players,
  roundNumber,
  summary,
  rematchState,
  onRematchRequest,
  onRematchAccept,
  onRematchReject,
  onReset,
  onPlayAgain,
}: {
  className: string;
  mode?: DemoMode;
  playerId: string;
  players?: Record<string, PlayerPresentation>;
  roundNumber: number;
  summary: DemoSummary;
  rematchState: RematchState;
  onRematchRequest: () => void;
  onRematchAccept: () => void;
  onRematchReject: () => void;
  onReset: () => void;
  onPlayAgain: () => void;
}) {
  const t = useT();
  const isPvp = mode === "pvp";
  // A voided match (disconnect/reconnect-timeout forfeit) has no opponent
  // left to rematch against.
  const canRematch = isPvp && summary.status !== "voided";

  return (
    <div className={`demo-summary-overlay show ${className}`} aria-label="Match summary" aria-live="polite">
      <div className="demo-summary-overlay-card">
        <h2>{winnerText(t, summary, playerId)}</h2>
        <p className="demo-summary-overlay-detail">{matchEndDetail(t, summary, playerId, players)}</p>
        <div className="demo-summary-overlay-stats">
          <SummaryCard label={t('summary.mode')} value={isPvp ? t('summary.pvpLabel') : t('summary.cpuLabel')} />
          <SummaryCard label={t('summary.endedOn')} value={`${t('demo.roundPrefix')} ${roundNumber}`} />
          <SummaryCard
            label={`${combatantLabel(t, summary.combatants.p1, playerId).replace(t('common.you'), t('summary.your'))} ${t('summary.accuracySuffix')}`}
            value={`${Math.round(summary.combatants.p1.accuracy * 100)}%`}
          />
          {isPvp && (
            <SummaryCard
              label={`${combatantLabel(t, summary.combatants.p2, playerId).replace(t('common.you'), t('summary.your'))} ${t('summary.accuracySuffix')}`}
              value={`${Math.round(summary.combatants.p2.accuracy * 100)}%`}
            />
          )}
        </div>

        {canRematch && rematchState.status === "received" && (
          <p className="demo-rematch-received-msg" aria-live="polite">
            ⚔️ {rematchState.fromUsername} {t('summary.wantsRematch')}
          </p>
        )}

        <div className="demo-summary-overlay-actions" aria-label="Post-match actions">
          {canRematch && rematchState.status === "idle" && (
            <button type="button" onClick={onRematchRequest}>{t('summary.rematch')}</button>
          )}
          {canRematch && rematchState.status === "pending" && (
            <button type="button" disabled>{t('demo.waiting')}</button>
          )}
          {canRematch && rematchState.status === "rejected" && (
            <button type="button" disabled>{t('summary.declined')}</button>
          )}
          {canRematch && rematchState.status === "received" && (
            <button type="button" className="demo-summary-accept" onClick={onRematchAccept}>{t('community.accept')}</button>
          )}
          {!isPvp && (
            <button type="button" onClick={onPlayAgain}>{t('summary.playAgain')}</button>
          )}
          {canRematch && rematchState.status === "received" ? (
            <button type="button" onClick={onRematchReject}>{t('community.decline')}</button>
          ) : (
            <button type="button" onClick={onReset}>{t('common.back')}</button>
          )}
        </div>
      </div>
    </div>
  );
}

function winnerText(t: (key: TranslationKey) => string, summary: DemoSummary, playerId: string): string {
  if (summary.status === "voided") {
    return summary.dcCombatantId === playerId ? t('summary.youDisconnected') : t('summary.matchVoided');
  }

  if (summary.mutualFinalRoundLoss) {
    return t('summary.mutualLoss');
  }

  const winnerCombatantId = resolveWinnerCombatantId(summary);

  if (winnerCombatantId === undefined) {
    return t('summary.matchComplete');
  }

  return winnerCombatantId === playerId ? t('summary.youWin') : t('summary.youLose');
}

function matchEndDetail(t: (key: TranslationKey) => string, summary: DemoSummary, playerId: string, players?: Record<string, PlayerPresentation>): string {
  if (summary.status === "voided") {
    if (summary.dcCombatantId === playerId) {
      return t('summary.reconnectFailed');
    }
    if (summary.dcCombatantId !== undefined) {
      const name = players?.[summary.dcCombatantId]?.username ?? labelCombatantId(summary.dcCombatantId);
      return `${name} ${t('summary.disconnectedSuffix')}`;
    }
    return summary.voidReason === undefined ? t('summary.matchVoidedPlain') : summary.voidReason.replaceAll("_", " ");
  }

  const winnerCombatantId = resolveWinnerCombatantId(summary);

  if (summary.mutualFinalRoundLoss) {
    return t('summary.noWinner');
  }

  if (winnerCombatantId === undefined) {
    return t('summary.matchComplete');
  }

  if (winnerCombatantId === playerId) {
    return t('summary.youWonMatch');
  }

  return `${players?.[winnerCombatantId]?.username ?? labelCombatantId(winnerCombatantId)} ${t('summary.winsSuffix')}`;
}

function resolveWinnerCombatantId(summary: DemoSummary): string | undefined {
  if (summary.status === "voided") {
    return undefined;
  }

  if (summary.winnerCombatantId !== undefined) {
    return summary.winnerCombatantId;
  }

  const p1Hp = summary.combatants.p1.hp;
  const p2Hp = summary.combatants.p2.hp;

  if (p1Hp <= 0 && p2Hp > 0) {
    return summary.combatants.p2.combatantId;
  }

  if (p2Hp <= 0 && p1Hp > 0) {
    return summary.combatants.p1.combatantId;
  }

  return undefined;
}

function labelCombatantId(combatantId: string): string {
  if (combatantId.startsWith("cpu:")) {
    const cpuName = combatantId.slice(4);
    return cpuName === "shi_eld"
      ? "Shi-eld"
      : `${cpuName.slice(0, 1).toUpperCase()}${cpuName.slice(1)}`;
  }

  return combatantId;
}

// "You" for the local player, the CPU's name (Min/Max/…) for a bot, or "Rival"
// for a human opponent — used to label per-player stats in the summary.
function combatantLabel(
  t: (key: TranslationKey) => string,
  combatant: DemoSummary["combatants"][DemoSlot],
  playerId: string,
): string {
  if (combatant.combatantId === playerId) return t('common.you');
  if (combatant.combatantId.startsWith("cpu:")) return labelCombatantId(combatant.combatantId);
  return t('summary.rival');
}

function labelQuestionType(questionType: string): string {
  return questionType
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatPrompt(prompt: string): string {
  return prompt.replaceAll("*", "×").replaceAll("x", "×");
}

function questionDisplayClass(prompt: string): string {
  const formatted = formatPrompt(prompt);
  const operatorCount = (formatted.match(/[+\-×]/g) ?? []).length;

  if (formatted.length >= 11 || operatorCount >= 3) {
    return "compact";
  }

  if (formatted.length >= 8 || operatorCount >= 2) {
    return "wide";
  }

  return "";
}

function sanitizeAnswerInput(value: string): string {
  const cleaned = value.replace(/[^\d-]/g, "");
  const isNegative = cleaned.startsWith("-");
  const digits = cleaned.replace(/-/g, "");
  return isNegative ? `-${digits}` : digits;
}

function eventKey(event: DemoEvent): string {
  const attacker = readSlotPayload(event, "attackerSlot") ?? "";
  const target = readSlotPayload(event, "targetCombatantSlot") ?? "";
  const streak = readNumberPayload(event, "attackerStreak") ?? "";
  const damage = readNumberPayload(event, "damage") ?? "";
  return `${event.serverTimestampMs}-${event.name}-${attacker}-${target}-${streak}-${damage}`;
}

function outcomeClass(event: DemoEvent): string {
  if (event.name === "attack.landed") {
    return readSlotPayload(event, "attackerSlot") === "p2" ? "from-right" : "from-left";
  }

  if (event.name === "revenge.attack_landed") {
    return readSlotPayload(event, "attackerSlot") === "p2" ? "revenge-right" : "revenge-left";
  }

  if (event.name === "defend.activated") {
    return "defend";
  }

  if (event.name === "defend.blocked") {
    return "stunned";
  }

  if (event.name === "missed") {
    return "missed";
  }

  if (event.name === "shock.applied") {
    return "shock";
  }

  if (event.name === "draw.triggered") {
    return "draw";
  }

  return "";
}

function outcomeMessage(t: (key: TranslationKey) => string, event: DemoEvent, playerSlot?: DemoSlot): string {
  const mine = (slot?: DemoSlot) => slot !== undefined && slot === playerSlot;
  // Streak multiplier suffix, e.g. " ×1.2" (omitted at 1×).
  const streak = (m?: number) => (m === undefined || m <= 1 ? "" : ` ×${formatCombatNumber(m)}`);

  switch (event.name) {
    case "attack.landed": {
      const attacker = readSlotPayload(event, "attackerSlot");
      const m = streak(readNumberPayload(event, "streakMultiplier"));
      return mine(attacker) ? `${t('outcome.directHit')}${m}` : `${t('outcome.youreHit')}${m}`;
    }
    case "revenge.attack_landed": {
      const attacker = readSlotPayload(event, "attackerSlot");
      return mine(attacker) ? t('outcome.revengeStrike') : t('outcome.revengeIncoming');
    }
    case "defend.activated": {
      const slot = readSlotPayload(event, "combatantSlot");
      return mine(slot) ? t('outcome.shieldUp') : t('outcome.rivalShields');
    }
    case "defend.blocked": {
      // defenderSlot blocked the attacker — good if that's you, painful if not.
      const defender = readSlotPayload(event, "defenderSlot");
      return mine(defender) ? t('outcome.blockedNice') : t('outcome.blockedStunned');
    }
    case "missed": {
      const slot = readSlotPayload(event, "combatantSlot");
      return mine(slot) ? t('outcome.missed') : t('outcome.rivalFumbles');
    }
    case "shock.applied":
      return t('outcome.bothShocked');
    case "draw.triggered":
      return t('outcome.clashTiebreaker');
    default:
      return event.message;
  }
}

function latestVisualEvent(eventLog: DemoSnapshot["eventLog"]): DemoEvent | undefined {
  return eventLog?.find((event) => VISUAL_EVENT_NAMES.has(event.name));
}

function latestDamageEvent(eventLog: DemoSnapshot["eventLog"]): DemoEvent | undefined {
  return eventLog?.find((event) => DAMAGE_EVENT_NAMES.has(event.name));
}

function latestAudioEvent(eventLog: DemoSnapshot["eventLog"]): DemoEvent | undefined {
  return eventLog?.find((event) => AUDIO_EVENT_NAMES.has(event.name));
}

function latestRoundPrepEvent(eventLog: DemoSnapshot["eventLog"]): DemoEvent | undefined {
  return eventLog?.find((event) => event.name === "round.prep.started");
}

function bgmSrcMatches(audio: HTMLAudioElement, src: string): boolean {
  // audio.src is the browser-resolved absolute URL with percent-encoded chars
  // (e.g. "Soda%20Pop.mp3"). Decode before comparing so filenames with spaces
  // or parentheses don't fail the check and trigger a spurious restart.
  try {
    return decodeURIComponent(audio.src).endsWith(src);
  } catch {
    return audio.src.endsWith(src);
  }
}

function startBackgroundMusic(bgmRef: MutableRefObject<HTMLAudioElement | null>, src: string): void {
  if (typeof window === "undefined") return;

  // Already playing the correct track — nothing to do.
  if (bgmRef.current !== null && !bgmRef.current.paused && bgmSrcMatches(bgmRef.current, src)) {
    return;
  }

  // Different track — swap out the audio element.
  if (bgmRef.current !== null && !bgmSrcMatches(bgmRef.current, src)) {
    bgmRef.current.pause();
    bgmRef.current = null;
  }

  if (bgmRef.current === null) {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.18;
    bgmRef.current = audio;
  }

  void bgmRef.current.play().catch(() => undefined);
}

// Ramps the arena music down to silence rather than cutting it abruptly at
// the final/winning blow, then pauses it and restores its original volume so
// a later rematch's startBackgroundMusic (which reuses this same element)
// isn't left permanently silent.
function fadeOutAndPauseBgm(bgmRef: MutableRefObject<HTMLAudioElement | null>, durationMs = 900): void {
  const audio = bgmRef.current;
  if (audio === null || typeof window === "undefined") return;
  const startVolume = audio.volume;
  const steps = 15;
  let step = 0;
  const interval = window.setInterval(() => {
    step += 1;
    audio.volume = Math.max(0, startVolume * (1 - step / steps));
    if (step >= steps) {
      window.clearInterval(interval);
      audio.pause();
      audio.volume = startVolume;
    }
  }, durationMs / steps);
}

function startLoopingSfx(ref: MutableRefObject<HTMLAudioElement | null>, src: string, volume: number): void {
  if (typeof window === "undefined") return;
  stopLoopingSfx(ref);
  const audio = new Audio(src);
  audio.loop = true;
  audio.volume = volume;
  ref.current = audio;
  void audio.play().catch(() => undefined);
}

function stopLoopingSfx(ref: MutableRefObject<HTMLAudioElement | null>): void {
  if (ref.current !== null) {
    ref.current.pause();
    ref.current.currentTime = 0;
    ref.current = null;
  }
}

function playAudioForEvent(
  event: DemoEvent,
  audioContextRef: MutableRefObject<AudioContext | null>,
  playerSlot?: DemoSlot,
): void {
  if (typeof window === "undefined") {
    return;
  }

  if (event.name === "attack.landed") {
    const streak = readNumberPayload(event, "attackerStreak") ?? 1;
    playStreakNote(streak, audioContextRef);
    const isMyAttack = playerSlot !== undefined && readSlotPayload(event, "attackerSlot") === playerSlot;
    playSfx(isMyAttack ? AUDIO_ASSETS.hit : AUDIO_ASSETS.hitReceived, 0.34);
    return;
  }

  if (event.name === "revenge.attack_landed") {
    const isMyAttack = playerSlot !== undefined && readSlotPayload(event, "attackerSlot") === playerSlot;
    playSfx(isMyAttack ? AUDIO_ASSETS.revengeHit : AUDIO_ASSETS.revengeHitReceived, 0.78);
    return;
  }

  if (event.name === "revenge.activated") {
    playSfx(AUDIO_ASSETS.revengeReady, 0.6);
    return;
  }

  if (event.name === "missed") {
    playSfx(AUDIO_ASSETS.miss, 0.62);
    return;
  }

  if (event.name === "shock.applied") {
    playSfx(AUDIO_ASSETS.shock, 0.72);
    return;
  }

  if (event.name === "defend.activated") {
    playSfx(AUDIO_ASSETS.defend, 0.46);
    return;
  }

  if (event.name === "defend.blocked") {
    playSfx(AUDIO_ASSETS.block, 0.66);
    return;
  }

  if (event.name === "draw.triggered") {
    playSfx(AUDIO_ASSETS.clash, 0.7);
  }
}

function playSfx(src: string, volume: number): void {
  const audio = new Audio(src);
  audio.volume = volume;
  void audio.play().catch(() => undefined);
}

function playStreakNote(streak: number, audioContextRef: MutableRefObject<AudioContext | null>): void {
  const context = getAudioContext(audioContextRef);
  if (context === null) {
    return;
  }

  const noteIndex = Math.max(0, Math.min(STREAK_NOTE_FREQUENCIES.length - 1, streak - 1));
  const frequency = STREAK_NOTE_FREQUENCIES[noteIndex] ?? STREAK_NOTE_FREQUENCIES[0];
  playTone(context, frequency, 0.16, 0.12, "triangle");
  playTone(context, frequency * 2, 0.12, 0.035, "sine", 0.012);
}

function getAudioContext(audioContextRef: MutableRefObject<AudioContext | null>): AudioContext | null {
  if (audioContextRef.current !== null) {
    if (audioContextRef.current.state === "suspended") {
      void audioContextRef.current.resume().catch(() => undefined);
    }
    return audioContextRef.current;
  }

  const AudioContextCtor = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (AudioContextCtor === undefined) {
    return null;
  }

  const context = new AudioContextCtor();
  audioContextRef.current = context;
  return context;
}

function playTone(
  context: AudioContext,
  frequency: number,
  duration: number,
  gainValue: number,
  type: OscillatorType,
  delay = 0,
): void {
  const startAt = context.currentTime + delay;
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startAt);
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(gainValue, startAt + 0.018);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + duration + 0.02);
}

function readSlotPayload(event: DemoEvent, key: string): DemoSlot | undefined {
  const value = event.payload?.[key];
  return value === "p1" || value === "p2" ? value : undefined;
}

function readNumberPayload(event: DemoEvent, key: string): number | undefined {
  const value = event.payload?.[key];
  return typeof value === "number" ? value : undefined;
}

function formatCombatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, "");
}

function avatarPadClass(
  combatant: DemoCombatant,
  slot: DemoSlot,
  eventLog: DemoSnapshot["eventLog"],
  now: number,
): string {
  const classes = ["avatar-pad", slot];
  const hpPercent = (combatant.hp / combatant.maxHp) * 100;
  const latest = latestVisualEvent(eventLog);

  if (hpPercent <= 33) {
    classes.push("hp-critical");
  } else if (hpPercent <= 66) {
    classes.push("hp-danger");
  }

  if (combatant.revengeActive) {
    classes.push("revenge-ready");
  }

  if (combatant.statusEffects.some((effect) => effect.type === "defend" && effect.endsAtMs > now)) {
    classes.push("defend");
  }

  if (combatant.statusEffects.some((effect) => effect.type === "stunned" && effect.endsAtMs > now)) {
    classes.push("stunned");
  }

  if (latest?.name === "revenge.attack_landed") {
    const targetSlot = readSlotPayload(latest, "targetCombatantSlot");
    const attackerSlot = readSlotPayload(latest, "attackerSlot");
    if (targetSlot === slot) {
      classes.push(slot === "p1" ? "revenge-hit-left" : "revenge-hit-right");
    }
    if (attackerSlot === slot) {
      classes.push(slot === "p1" ? "revenge-release-left" : "revenge-release-right");
    }
  } else if (latest?.name === "attack.landed") {
    const targetSlot = readSlotPayload(latest, "targetCombatantSlot");
    if (targetSlot === slot) {
      classes.push(slot === "p1" ? "knock-left" : "knock-right");
    }
  }

  if (latest?.name === "defend.blocked" && readSlotPayload(latest, "defenderSlot") === slot) {
    classes.push("block");
  }

  if (latest?.name === "missed" && latest.message.toLowerCase().includes(slot)) {
    classes.push("missed-shake");
  }

  if (latest?.name === "shock.applied") {
    classes.push("shock");
  }

  return classes.join(" ");
}

function stageClassFor(eventLog: DemoSnapshot["eventLog"]): string {
  const latest = latestVisualEvent(eventLog);
  if (latest === undefined) {
    return "";
  }

  if (latest.name === "shock.applied") {
    return "stage-shock";
  }

  // Landing an attack shakes the arena — harder hits (and revenge) shake more.
  if (latest.name === "attack.landed" || latest.name === "revenge.attack_landed") {
    const damage = readNumberPayload(latest, "damage") ?? 0;
    return latest.name === "revenge.attack_landed" || damage >= 16 ? "stage-hit-strong" : "stage-hit";
  }

  return "";
}

function summaryClass(summary: DemoSummary, playerId: string): string {
  if (summary.status === "voided") {
    return summary.dcCombatantId === playerId ? "lose" : "draw";
  }

  const winnerCombatantId = resolveWinnerCombatantId(summary);

  if (summary.mutualFinalRoundLoss || winnerCombatantId === undefined) {
    return "draw";
  }

  return winnerCombatantId === playerId ? "win" : "lose";
}
