"use client";

/* eslint-disable react-hooks/refs -- temporary demo arena; refs read during
   render are intentional for this playable preview and will be reworked when
   the arena is rebuilt against the final design. */

import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { type Socket } from "socket.io-client";
import { getSocket } from "@/lib/socket";
import { api, assetUrl, type FriendView } from "@/lib/api";

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

interface DemoSnapshot {
  waiting?: boolean;
  roomId: string;
  matchId: string;
  playerId?: string;
  mode?: DemoMode;
  phase?: DemoPhase;
  arenaId?: string;
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
    startedAtMs: number;
    deadlineAtMs: number;
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
  },
  {
    id: "tech-room",
    label: "Tech Room",
    src: "/assets/game/candidates/backgrounds/tech-room-arena-v1.png",
  },
  {
    id: "tech-wall",
    label: "Tech Wall",
    src: "/assets/game/candidates/backgrounds/tech-wall-arena-v1.png",
  },
  {
    id: "campus-entrance",
    label: "Campus",
    src: "/assets/game/candidates/backgrounds/campus-entrance-arena-v1.png",
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
  bgm: "/assets/game/selected/audio/music/active-match-theme.mp3",
  hit: "/assets/game/selected/audio/sfx/correct-hit.ogg",
  miss: "/assets/game/selected/audio/sfx/wrong-answer.ogg",
  shock: "/assets/game/selected/audio/sfx/shock.ogg",
  defend: "/assets/game/selected/audio/sfx/defend-activate.ogg",
  block: "/assets/game/audio/sfx/role-aliases/defend-success-temp.ogg",
  revengeReady: "/assets/game/selected/audio/sfx/revenge-ready.ogg",
  revengeHit: "/assets/game/audio/sfx/kenney-impact-sounds/impactPunch_heavy_000.ogg",
  clash: "/assets/game/selected/audio/sfx/clash.ogg",
} as const;
const STREAK_NOTE_FREQUENCIES = [261.63, 293.66, 329.63, 349.23, 392, 440, 493.88, 523.25];

export function DemoClient({
  mode = "pvp",
  cpuKey = "max",
  playerId,
  invite,
}: {
  mode?: DemoMode;
  cpuKey?: string;
  playerId?: string;
  /** Present when this client is joining a private match it was invited to. */
  invite?: { roomId: string; fromUsername: string };
} = {}) {
  const [stage, setStage] = useState<DemoStage>("landing");
  const [selectedAvatar, setSelectedAvatar] = useState(DEMO_AVATARS[0] ?? "👻");
  const [pvpChoice, setPvpChoice] = useState<"quick" | "private" | null>(null);
  const [rejoinMatchId, setRejoinMatchId] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem("demo-rejoin-match") : null
  );
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
  const [snapshot, setSnapshot] = useState<DemoSnapshot | null>(null);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [now, setNow] = useState(Date.now());
  const [summaryVisible, setSummaryVisible] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const playerIdRef = useRef("");
  const snapshotRef = useRef<DemoSnapshot | null>(null);
  const stageRef = useRef<DemoStage>("landing");
  const answerInputRef = useRef<HTMLInputElement | null>(null);
  const bgmRef = useRef<HTMLAudioElement | null>(null);
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
  const roundTimerLeft = snapshot?.roundClock?.deadlineAtMs === undefined
    ? 50
    : Math.max(0, Math.ceil((snapshot.roundClock.deadlineAtMs - now) / 1000));
  const attackProgress = snapshot?.question?.startedAtMs === undefined
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
      if (
        currentSnapshot?.mode === "pvp"
        && currentSnapshot.matchId !== undefined
        && (stageRef.current === "live" || currentSnapshot.reconnectState !== undefined)
      ) {
        startBackgroundMusic(bgmRef);
        socket.emit("demo.reconnect.resume", {
          matchId: currentSnapshot.matchId,
          playerId: playerIdRef.current,
        });
      }
    }
    function handleConnectError(_event: Error) {
      setError("Connection lost. Reconnecting...");
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
        FRIEND_OFFLINE: "That player is offline.",
        NOT_FRIENDS: "You can only invite friends.",
        PRIVATE_ACCEPT_FAILED: "This room has been closed.",
        PRIVATE_CREATE_FAILED: "Couldn't create room. Please try again.",
        QUEUE_JOIN_FAILED: "Couldn't join the queue. Please try again.",
        FRIEND_IN_GAME: payload.message,
        INVITE_FAILED: "Room not found.",
        REMATCH_FAILED: "Rematch is no longer available.",
      };
      setError(friendlyMessages[payload.code] ?? payload.message);
    }
    function handleDemoState(nextSnapshot: DemoSnapshot) {
      // Room was cancelled — send all players back to Quick/Private choice.
      if ((nextSnapshot as { cancelled?: boolean }).cancelled === true) {
        reset();
        return;
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

      setSnapshot(nextSnapshot);
      setAnswer("");
      setOpponentAnswer("");
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
      setInviteNote(`${payload.byUsername ?? "Your friend"} declined the invite.`);
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
      setRematchState({ status: "received", fromUsername: payload.fromUsername ?? "Opponent" });
    }
    function handleRematchRejected() {
      setRematchState({ status: "rejected" });
    }

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);
    socket.on("demo.error", handleDemoError);
    socket.on("demo.state", handleDemoState);
    socket.on("demo.invite.declined", handleInviteDeclined);
    socket.on("demo.rematch.received", handleRematchReceived);
    socket.on("demo.rematch.rejected", handleRematchRejected);
    socket.on("demo.answer.typing", handleAnswerTyping);

    const tick = window.setInterval(() => setNow(Date.now()), 100);
    return () => {
      window.clearInterval(tick);
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
    snapshotRef.current = snapshot;
  }, [snapshot]);

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  // Persist an active PvP matchId so the player can rejoin within the 20s
  // reconnect window after navigating away.
  useEffect(() => {
    if (stage === "live" && snapshot?.mode === "pvp" && snapshot.matchId) {
      localStorage.setItem("demo-rejoin-match", snapshot.matchId);
    }
    if (stage === "summary" || stage === "landing") {
      localStorage.removeItem("demo-rejoin-match");
    }
  }, [stage, snapshot?.matchId, snapshot?.mode]);

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
    playAudioForEvent(latest, audioContextRef);
  }, [snapshot?.eventLog]);

  useEffect(() => () => {
    bgmRef.current?.pause();
    bgmRef.current = null;
  }, []);

  function reset() {
    socketRef.current?.emit("demo.match.leave");
    bgmRef.current?.pause();
    bgmRef.current = null;
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
  }

  function playAgainPvc() {
    bgmRef.current?.pause();
    bgmRef.current = null;
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
    startBackgroundMusic(bgmRef);
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
      });
      return;
    }

    // PvP quick match: no arena/room choice — the server assigns a random arena
    // and the first joiner takes the left side.
    setStage("matchmaking");
    socket.emit("demo.queue.join", {
      playerId: playerIdRef.current,
      avatar: selectedAvatar,
    });
  }

  // PvP private match: starter creates a room with the arena they picked, then
  // invites a friend. The prematch snapshot drives the stage transition.
  function createPrivateRoom() {
    startBackgroundMusic(bgmRef);
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
    });
  }

  function sendInvite(friendId: string) {
    setInviteNote("");
    socketRef.current?.emit("demo.private.invite", {
      roomId: snapshotRef.current?.roomId,
      friendId,
    });
    setInvitedFriendIds((prev) => { const next = new Set(prev); next.add(friendId); return next; });
    setInviteNote("Invite sent.");
  }

  // Invited friend joins the private room with their chosen avatar.
  function acceptInvite() {
    startBackgroundMusic(bgmRef);
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

    startBackgroundMusic(bgmRef);
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

    startBackgroundMusic(bgmRef);
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

      {/* Rejoin banner: shown on landing when a PvP match is still within its 20s reconnect window. */}
      {stage === "landing" && rejoinMatchId !== null && (
        <div className="demo-rejoin-banner">
          <span>You left an active match — the reconnect window is open.</span>
          <div className="demo-rejoin-actions">
            <button type="button" className="demo-start-button" style={{ padding: "8px 20px", fontSize: "14px" }} onClick={attemptRejoin}>
              Rejoin match
            </button>
            <button type="button" className="demo-text-button" onClick={() => { setRejoinMatchId(null); localStorage.removeItem("demo-rejoin-match"); }}>
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* PvC setup: pick token + arena, then start. */}
      {stage === "landing" && mode === "pvc" && (
        <section className="demo-landing demo-landing-solo" aria-label="Prepare your duel">
          <div className="demo-landing-copy">
            <p>Player vs CPU</p>
            <h2>Prepare your fighter.</h2>
            <span className="demo-setup-label">Choose your token</span>
            <AvatarPicker selected={selectedAvatar} onPick={pickAvatar} />
            <button type="button" className="demo-start-button" onClick={() => start("pvc")}>
              ⚔️  Start duel
            </button>
          </div>
          <div className="demo-landing-arena">
            <span className="demo-setup-label">Choose your arena</span>
            <BackgroundPicker selectedId={selectedBackground.id} onPick={setSelectedBackground} />
          </div>
        </section>
      )}

      {/* PvP — invited friend: pick a token, then accept. */}
      {stage === "landing" && mode === "pvp" && invite !== undefined && (
        <section className="demo-landing demo-pvp-entry" aria-label="Join private match">
          <p>Private match invite</p>
          <h2>Join {invite.fromUsername}&apos;s match.</h2>
          <span className="demo-setup-label">Choose your token <small style={{opacity:0.6}}>(optional)</small></span>
          <AvatarPicker selected={selectedAvatar} onPick={pickAvatar} />
          <button type="button" className="demo-start-button" onClick={acceptInvite}>
            Accept &amp; join
          </button>
        </section>
      )}

      {/* PvP — choose match type first, avatar is optional (defaults). */}
      {stage === "landing" && mode === "pvp" && invite === undefined && pvpChoice === null && (
        <section className="demo-landing demo-pvp-entry" aria-label="Choose match type">
          <p>Player vs Player</p>
          <h2>Choose your battle.</h2>
          <div className="demo-pvp-options">
            <button type="button" className="demo-pvp-option" onClick={() => setPvpChoice("quick")}>
              <strong>Quick Match</strong>
              <span>Auto-matched against a random opponent on a random arena.</span>
            </button>
            <button type="button" className="demo-pvp-option" onClick={() => setPvpChoice("private")}>
              <strong>Private Match</strong>
              <span>Pick the arena and invite a friend.</span>
            </button>
          </div>
        </section>
      )}

      {/* PvP — quick match: pick avatar then join. */}
      {stage === "landing" && mode === "pvp" && invite === undefined && pvpChoice === "quick" && (
        <section className="demo-landing demo-pvp-entry" aria-label="Quick match setup">
          <p>Quick Match</p>
          <h2>Pick your fighter.</h2>
          <span className="demo-setup-label">Choose your token <small style={{opacity:0.6}}>(optional)</small></span>
          <AvatarPicker selected={selectedAvatar} onPick={pickAvatar} />
          <button type="button" className="demo-start-button" onClick={() => start("pvp")}>
            Find match
          </button>
          <button type="button" className="demo-text-button" onClick={() => setPvpChoice(null)}>← Back</button>
        </section>
      )}

      {/* PvP — private setup: pick avatar + arena, then create room. */}
      {stage === "landing" && mode === "pvp" && invite === undefined && pvpChoice === "private" && (
        <section className="demo-landing demo-landing-solo" aria-label="Set up private match">
          <div className="demo-landing-copy">
            <p>Private match</p>
            <h2>Set up your room.</h2>
            <span className="demo-setup-label">Choose your token <small style={{opacity:0.6}}>(optional)</small></span>
            <AvatarPicker selected={selectedAvatar} onPick={pickAvatar} />
            <button type="button" className="demo-start-button" onClick={createPrivateRoom}>
              Create room
            </button>
            <button type="button" className="demo-text-button" onClick={() => setPvpChoice(null)}>← Back</button>
          </div>
          <div className="demo-landing-arena">
            <span className="demo-setup-label">Choose your arena</span>
            <BackgroundPicker selectedId={selectedBackground.id} onPick={setSelectedBackground} />
          </div>
        </section>
      )}

      {stage === "starting" && (
        <section className="demo-starting" aria-label="Starting duel">
          <span className="sf-spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
          <p>Starting duel…</p>
        </section>
      )}

      {stage === "matchmaking" && (
        <section className="demo-matchmaking" aria-label="Matchmaking page">
          <div className="demo-room-card">
            <p>Matchmaking</p>
            <h2>{snapshot?.waiting ? "Waiting for Player 2" : "Finding match..."}</h2>
            <div className="demo-room-code">
              <span>Room</span>
              <strong>{snapshot?.roomId ?? "Creating..."}</strong>
            </div>
            <div className="demo-vs-strip">
              <PlayerToken avatar={selectedAvatar} label="You" tone="p1" />
              <div className="demo-waiting-slot">Waiting...</div>
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
            <div className="demo-room-card ready">
              <p>{isPrivate ? "Private room" : "Ready up"}</p>
              <h2>
                {inCountdown
                  ? "Match begins in..."
                  : opponentPresent
                    ? "Ready check"
                    : "Waiting for opponent"}
              </h2>

              <div className="demo-vs-strip">
                <PlayerToken
                  avatar={p1Pres?.avatar ?? "❔"}
                  label={p1Pres?.username ?? "Player 1"}
                  tone={rs.p1Ready ? "p1" : "pending"}
                />
                <div className="demo-versus">VS</div>
                {opponentPresent ? (
                  <PlayerToken
                    avatar={p2Pres?.avatar ?? "❔"}
                    label={p2Pres?.username ?? "Player 2"}
                    tone={rs.p2Ready ? "p2" : "pending"}
                  />
                ) : (
                  <div className="demo-waiting-slot">Waiting…</div>
                )}
              </div>

              {/* Arena, shown below the ready status. */}
              <div className="demo-ready-arena">
                <img alt={arena.label} src={arena.src} />
                <span>{arena.label}</span>
              </div>

              {showInvite ? (
                <div className="demo-invite-panel">
                  <strong>Invite a friend</strong>
                  {friends.filter((f) => f.online).length === 0 ? (
                    <span className="demo-invite-empty">No friends online right now.</span>
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
                              {invited ? "Invited" : "Invite"}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  {inviteNote !== "" && <span className="demo-invite-note">{inviteNote}</span>}
                  <button type="button" className="demo-text-button" onClick={leavePrematch}>Cancel room</button>
                </div>
              ) : inCountdown ? (
                <div className="demo-ready-countdown">
                  <strong>{Math.max(0, Math.ceil(((rs.countdownEndsAtMs ?? now) - now) / 1000))}</strong>
                  <span>Get ready</span>
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
                      {iAmReady ? "Ready ✓" : "Ready"}
                    </button>
                    <button type="button" onClick={leavePrematch}>Back</button>
                  </div>
                );
              })()}

              {inCountdown && (
                <button className="demo-stop-button" type="button" onClick={stopReady}>Stop</button>
              )}
              {rs.message !== undefined && <div className="demo-ready-message">{rs.message}</div>}
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
                  <span>{snapshot.isFinalRound === true ? "FINAL" : `ROUND ${snapshot.roundNumber ?? 1}`}</span>
                  <strong className="digital-display">{roundTimerLeft}</strong>
                </div>
                <HpBar combatant={snapshot.combatants.p2} label={labelFor(snapshot.combatants.p2, playerIdRef.current)} align="right" pres={snapshot.summary?.dcCombatantId === snapshot.combatants.p2.id ? undefined : snapshot.players?.[snapshot.combatants.p2.id]} />
              </div>

              {(() => {
                const isKoMatch = snapshot.summary?.status === "completed" && snapshot.summary.dcCombatantId === undefined;
                const p1Ko = isKoMatch && snapshot.combatants.p1.hp <= 0;
                const p2Ko = isKoMatch && snapshot.combatants.p2.hp <= 0;
                return (
                  <>
                    <div className={`${avatarPadClass(snapshot.combatants.p1, "p1", snapshot.eventLog ?? [], now)}${p1Ko ? " ko-final-blow" : ""}`}>
                      <div className="emoji-avatar" aria-label="P1 avatar">
                        {snapshot.summary?.dcCombatantId === snapshot.combatants.p1.id
                          ? "💨"
                          : avatarFor(snapshot.combatants.p1, snapshot.players)}
                      </div>
                    </div>
                    <div className={`${avatarPadClass(snapshot.combatants.p2, "p2", snapshot.eventLog ?? [], now)}${p2Ko ? " ko-final-blow" : ""}`}>
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
                <strong className={`calc-display ${questionDisplayClass(snapshot.question?.prompt ?? "Ready")}`}>
                  {formatPrompt(snapshot.question?.prompt ?? "Ready")}
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
                      <span>{playerSlot?.toUpperCase() ?? "P1"} Answer</span>
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
                      <span>{opponentSlot.toUpperCase()} Answer</span>
                      {opponentCombatant !== undefined && <ShieldPip combatant={opponentCombatant} now={now} />}
                    </span>
                    <output className={opponentAnswer === "" && opponentCombatant?.driver !== "cpu" ? "waiting" : undefined}>
                      {opponentCombatant?.driver === "cpu" ? "CPU thinking..." : (opponentAnswer || "…")}
                    </output>
                  </label>
                </form>

                <div className="revenge-row" aria-label="Revenge gauges">
                  <RevengeGauge combatant={snapshot.combatants.p1} align="left" />
                  <RevengeGauge combatant={snapshot.combatants.p2} align="right" />
                </div>

                <div className="power-meter" aria-label="Attack strength preview">
                  <span>Attack strength</span>
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
                  {snapshot.isFinalRound === true ? "Final round" : `Round ${snapshot.roundNumber ?? 1}`}
                </span>
                <span>⌨️ Type your answer, then <b>Enter</b></span>
                <span className="demo-controls-help" tabIndex={0}>
                  🛡️ <b>Space</b> to DEFEND <i className="demo-help-mark">ⓘ</i>
                  <span className="demo-help-pop" role="tooltip">
                    <strong>DEFEND — your shield</strong>
                    <span>
                      Tap <b>Space</b> during a question to raise a shield for about 1.5 seconds. If your
                      opponent lands their attack while it&apos;s up:
                    </span>
                    <ul>
                      <li>Their hit is fully blocked — you take <b>0 damage</b></li>
                      <li>Their attack <b>streak resets</b> to zero</li>
                      <li>They&apos;re <b>stunned for ~1.5s</b> and can&apos;t answer</li>
                      <li>Any <b>Revenge</b> they were holding is wasted</li>
                    </ul>
                    <span>You get <b>one block per question</b> — it recharges on the next question.</span>
                  </span>
                </span>
                <button type="button" className="demo-controls-fs" onClick={toggleFullscreen} aria-label="Toggle fullscreen">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
                  </svg>
                  Fullscreen <b>(F)</b>
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
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

function PlayerToken({ avatar, label, tone }: { avatar: string; label: string; tone: DemoSlot | "pending" }) {
  return (
    <div className={`demo-player-token ${tone}`}>
      <span>{avatar}</span>
      <strong>{label}</strong>
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
  const latest = latestVisualEvent(eventLog);
  if (latest === undefined) {
    return null;
  }

  return <div className={`outcome-banner show ${outcomeClass(latest)}`} key={eventKey(latest)}>{outcomeMessage(latest, playerSlot)}</div>;
}

function RoundIntroOverlay({ snapshot, now }: { snapshot: DemoSnapshot; now: number }) {
  if (snapshot.phase !== "round_prep" || snapshot.summary !== undefined) {
    return null;
  }

  const event = latestRoundPrepEvent(snapshot.eventLog);
  const elapsedMs = event === undefined ? 0 : Math.max(0, now - event.serverTimestampMs);
  const isGo = elapsedMs >= 1400;
  const roundLabel = snapshot.isFinalRound === true ? "FINAL ROUND" : `ROUND ${snapshot.roundNumber ?? 1}`;

  return (
    <div className={`round-intro-overlay ${isGo ? "go" : "round"}`} aria-live="polite">
      <strong>{isGo ? "GO!" : roundLabel}</strong>
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
  const reconnectState = snapshot.reconnectState;
  if (reconnectState === undefined || snapshot.summary !== undefined) {
    return null;
  }

  const isDisconnectedPlayer = reconnectState.disconnectedSlot === playerSlot;
  if (reconnectState.status === "resuming") {
    const seconds = Math.max(0, Math.ceil(((reconnectState.resumeDeadlineAtMs ?? now) - now) / 1000));
    return (
      <div className="reconnect-overlay success" aria-live="assertive">
        <strong>Success!</strong>
        <span>Get ready!</span>
        <b>{seconds}</b>
      </div>
    );
  }

  const seconds = Math.max(0, Math.ceil((reconnectState.deadlineAtMs - now) / 1000));
  return (
    <div className="reconnect-overlay" aria-live="assertive">
      <strong>Reconnecting</strong>
      <span>{isDisconnectedPlayer ? "You disconnected." : `${reconnectState.disconnectedSlot.toUpperCase()} disconnected.`}</span>
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
  const isPvp = mode === "pvp";

  return (
    <div className={`demo-summary-overlay show ${className}`} aria-label="Match summary" aria-live="polite">
      <div className="demo-summary-overlay-card">
        <h2>{winnerText(summary, playerId)}</h2>
        <p className="demo-summary-overlay-detail">{matchEndDetail(summary, playerId, players)}</p>
        <div className="demo-summary-overlay-stats">
          <SummaryCard label="Mode" value={isPvp ? "PvP" : "CPU"} />
          <SummaryCard label="Ended on" value={`Round ${roundNumber}`} />
          <SummaryCard
            label={`${combatantLabel(summary.combatants.p1, playerId).replace("You", "Your")} accuracy`}
            value={`${Math.round(summary.combatants.p1.accuracy * 100)}%`}
          />
          {isPvp && (
            <SummaryCard
              label={`${combatantLabel(summary.combatants.p2, playerId).replace("You", "Your")} accuracy`}
              value={`${Math.round(summary.combatants.p2.accuracy * 100)}%`}
            />
          )}
        </div>

        {isPvp && rematchState.status === "received" && (
          <p className="demo-rematch-received-msg" aria-live="polite">
            ⚔️ {rematchState.fromUsername} wants a rematch!
          </p>
        )}

        <div className="demo-summary-overlay-actions" aria-label="Post-match actions">
          {isPvp && rematchState.status === "idle" && (
            <button type="button" onClick={onRematchRequest}>Rematch</button>
          )}
          {isPvp && rematchState.status === "pending" && (
            <button type="button" disabled>Waiting…</button>
          )}
          {isPvp && rematchState.status === "rejected" && (
            <button type="button" disabled>Declined</button>
          )}
          {isPvp && rematchState.status === "received" && (
            <button type="button" className="demo-summary-accept" onClick={onRematchAccept}>Accept</button>
          )}
          {!isPvp && (
            <button type="button" onClick={onPlayAgain}>Play again</button>
          )}
          {isPvp && rematchState.status === "received" ? (
            <button type="button" onClick={onRematchReject}>Decline</button>
          ) : (
            <button type="button" onClick={onReset}>Back</button>
          )}
        </div>
      </div>
    </div>
  );
}

function winnerText(summary: DemoSummary, playerId: string): string {
  if (summary.status === "voided") {
    return summary.dcCombatantId === playerId ? "You Disconnected" : "Match Voided";
  }

  if (summary.mutualFinalRoundLoss) {
    return "Mutual loss";
  }

  const winnerCombatantId = resolveWinnerCombatantId(summary);

  if (winnerCombatantId === undefined) {
    return "Match complete";
  }

  return winnerCombatantId === playerId ? "You Win!" : "You Lose!";
}

function matchEndDetail(summary: DemoSummary, playerId: string, players?: Record<string, PlayerPresentation>): string {
  if (summary.status === "voided") {
    if (summary.dcCombatantId === playerId) {
      return "Reconnect failed";
    }
    if (summary.dcCombatantId !== undefined) {
      const name = players?.[summary.dcCombatantId]?.username ?? labelCombatantId(summary.dcCombatantId);
      return `${name} disconnected`;
    }
    return summary.voidReason === undefined ? "Match voided" : summary.voidReason.replaceAll("_", " ");
  }

  const winnerCombatantId = resolveWinnerCombatantId(summary);

  if (summary.mutualFinalRoundLoss) {
    return "No winner";
  }

  if (winnerCombatantId === undefined) {
    return "Match complete";
  }

  if (winnerCombatantId === playerId) {
    return "You won the match";
  }

  return `${players?.[winnerCombatantId]?.username ?? labelCombatantId(winnerCombatantId)} wins`;
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
  combatant: DemoSummary["combatants"][DemoSlot],
  playerId: string,
): string {
  if (combatant.combatantId === playerId) return "You";
  if (combatant.combatantId.startsWith("cpu:")) return labelCombatantId(combatant.combatantId);
  return "Rival";
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

function outcomeMessage(event: DemoEvent, playerSlot?: DemoSlot): string {
  const mine = (slot?: DemoSlot) => slot !== undefined && slot === playerSlot;
  // Streak multiplier suffix, e.g. " ×1.2" (omitted at 1×).
  const streak = (m?: number) => (m === undefined || m <= 1 ? "" : ` ×${formatCombatNumber(m)}`);

  switch (event.name) {
    case "attack.landed": {
      const attacker = readSlotPayload(event, "attackerSlot");
      const m = streak(readNumberPayload(event, "streakMultiplier"));
      return mine(attacker) ? `DIRECT HIT!${m}` : `YOU'RE HIT!${m}`;
    }
    case "revenge.attack_landed": {
      const attacker = readSlotPayload(event, "attackerSlot");
      return mine(attacker) ? "REVENGE STRIKE!" : "REVENGE INCOMING!";
    }
    case "defend.activated": {
      const slot = readSlotPayload(event, "combatantSlot");
      return mine(slot) ? "SHIELD UP!" : "RIVAL SHIELDS!";
    }
    case "defend.blocked": {
      // defenderSlot blocked the attacker — good if that's you, painful if not.
      const defender = readSlotPayload(event, "defenderSlot");
      return mine(defender) ? "BLOCKED! NICE!" : "BLOCKED — STUNNED!";
    }
    case "missed": {
      const slot = readSlotPayload(event, "combatantSlot");
      return mine(slot) ? "MISSED!" : "RIVAL FUMBLES!";
    }
    case "shock.applied":
      return "TIME'S UP — BOTH SHOCKED!";
    case "draw.triggered":
      return "CLASH! TIE-BREAKER";
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

function startBackgroundMusic(bgmRef: MutableRefObject<HTMLAudioElement | null>): void {
  if (typeof window === "undefined") {
    return;
  }

  if (bgmRef.current === null) {
    const audio = new Audio(AUDIO_ASSETS.bgm);
    audio.loop = true;
    audio.volume = 0.18;
    bgmRef.current = audio;
  }

  void bgmRef.current.play().catch(() => undefined);
}

function playAudioForEvent(event: DemoEvent, audioContextRef: MutableRefObject<AudioContext | null>): void {
  if (typeof window === "undefined") {
    return;
  }

  if (event.name === "attack.landed") {
    const streak = readNumberPayload(event, "attackerStreak") ?? 1;
    playStreakNote(streak, audioContextRef);
    playSfx(AUDIO_ASSETS.hit, 0.34);
    return;
  }

  if (event.name === "revenge.attack_landed") {
    playSfx(AUDIO_ASSETS.revengeHit, 0.78);
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
