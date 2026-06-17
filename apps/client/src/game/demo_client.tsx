"use client";

/* eslint-disable react-hooks/refs -- temporary demo arena; refs read during
   render are intentional for this playable preview and will be reworked when
   the arena is rebuilt against the final design. */

import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { io, type Socket } from "socket.io-client";

type DemoMode = "pvc" | "pvp";
type DemoStage = "landing" | "matchmaking" | "ready" | "live" | "summary";
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

interface DemoSnapshot {
  waiting?: boolean;
  roomId: string;
  matchId: string;
  playerId?: string;
  mode?: DemoMode;
  phase?: DemoPhase;
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

const DEMO_AVATARS = ["🧚🏻‍♀️", "🍍", "🏹", "🎱", "🍀"];
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
const CPU_AVATARS: Record<string, string> = {
  "cpu:min": "🤏🏻",
  "cpu:max": "👊",
  "cpu:fury": "🔥",
  "cpu:shi_eld": "🛡️",
};
const REVENGE_BLOCKS = 5;
const ATTACK_STRENGTH_MS = 5000;
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
const LIVE_EVENT_NAMES = new Set([
  "round.prep.started",
  "round.ended",
  "attack.landed",
  "revenge.activated",
  "revenge.attack_landed",
  "defend.activated",
  "defend.blocked",
  "missed",
  "shock.applied",
  "draw.triggered",
  "match.ended",
  "reconnect.started",
  "reconnect.succeeded",
  "reconnect.resumed",
  "reconnect.failed",
]);
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

export function DemoClient() {
  const [stage, setStage] = useState<DemoStage>("landing");
  const [selectedAvatar, setSelectedAvatar] = useState(DEMO_AVATARS[0] ?? "🧚🏻‍♀️");
  const [selectedBackground, setSelectedBackground] = useState<(typeof DEMO_BACKGROUNDS)[number]>(DEMO_BACKGROUNDS[0]);
  const [snapshot, setSnapshot] = useState<DemoSnapshot | null>(null);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [now, setNow] = useState(Date.now());
  const socketRef = useRef<Socket | null>(null);
  const playerIdRef = useRef("");
  const snapshotRef = useRef<DemoSnapshot | null>(null);
  const stageRef = useRef<DemoStage>("landing");
  const answerInputRef = useRef<HTMLInputElement | null>(null);
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastAudioEventKeyRef = useRef<string | undefined>(undefined);

  const playerSlot = useMemo(() => inferPlayerSlot(snapshot, playerIdRef.current), [snapshot]);
  const opponentSlot = playerSlot === "p2" ? "p1" : "p2";
  const ownCombatant = playerSlot !== undefined ? snapshot?.combatants?.[playerSlot] : undefined;
  const opponentCombatant = snapshot?.combatants?.[opponentSlot];
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

  const flow = useMemo(
    () => [
      { label: "Landing", active: stage === "landing", done: stage !== "landing" },
      { label: "Matchmaking", active: stage === "matchmaking", done: stage === "ready" || stage === "live" || stage === "summary" },
      { label: "Ready", active: stage === "ready", done: stage === "live" || stage === "summary" },
      { label: "Live Match", active: stage === "live", done: stage === "summary" },
      { label: "Summary", active: stage === "summary", done: false },
    ],
    [stage],
  );

  useEffect(() => {
    playerIdRef.current = getOrCreatePlayerId();
    const tick = window.setInterval(() => setNow(Date.now()), 100);
    return () => window.clearInterval(tick);
  }, []);

  useEffect(() => {
    snapshotRef.current = snapshot;
  }, [snapshot]);

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.code === "Space" && stage === "live") {
        event.preventDefault();
        activateDefend();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  useEffect(() => {
    if (!ownInputAvailable) {
      return;
    }

    const focusTimer = window.setTimeout(() => {
      answerInputRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(focusTimer);
  }, [ownInputAvailable, snapshot?.question?.sequence]);

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

  function connect(): Socket {
    if (socketRef.current !== null) {
      return socketRef.current;
    }

    const socket = io(getServerUrl(), {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      setError("");
      const currentSnapshot = snapshotRef.current;
      if (
        currentSnapshot?.mode === "pvp"
        && currentSnapshot.matchId !== undefined
        && (stageRef.current === "live" || currentSnapshot.reconnectState !== undefined)
      ) {
        socket.emit("demo.reconnect.resume", {
          matchId: currentSnapshot.matchId,
          playerId: playerIdRef.current,
        });
      }
    });
    socket.on("connect_error", (event) => setError(`Cannot connect to Demo 6 server: ${event.message}`));
    socket.on("demo.error", (payload: { code: string; message: string }) => setError(`${payload.code}: ${payload.message}`));
    socket.on("demo.state", (nextSnapshot: DemoSnapshot) => {
      setSnapshot(nextSnapshot);
      setAnswer("");
      if (nextSnapshot.waiting === true) {
        setStage("matchmaking");
        return;
      }
      if (nextSnapshot.readyState !== undefined) {
        setStage("ready");
        return;
      }
      setStage(nextSnapshot.phase === "summary" ? "summary" : "live");
    });

    socketRef.current = socket;
    return socket;
  }

  function reset() {
    socketRef.current?.disconnect();
    socketRef.current = null;
    bgmRef.current?.pause();
    bgmRef.current = null;
    lastAudioEventKeyRef.current = undefined;
    setStage("landing");
    setSnapshot(null);
    setAnswer("");
    setError("");
  }

  function start(mode: DemoMode) {
    startBackgroundMusic(bgmRef);
    const socket = connect();
    setStage("matchmaking");
    setSnapshot(null);
    setError("");

    if (mode === "pvc") {
      socket.emit("demo.pvc.start", {
        playerId: playerIdRef.current,
        cpuOpponentKey: "max",
      });
      return;
    }

    socket.emit("demo.queue.join", {
      playerId: playerIdRef.current,
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
    setAnswer(sanitizeAnswerInput(value));
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
    <main className="demo-shell">
      <header className="demo-header">
        <div>
          <p>Demo 6: playable React + backend TS services</p>
          <h1>NeXT Duel</h1>
        </div>
        <button type="button" onClick={reset}>Reset Preview</button>
      </header>

      <nav className="demo-flow" aria-label="Demo 6 flow">
        {flow.map((item) => (
          <span className={`${item.active ? "active" : ""} ${item.done ? "done" : ""}`} key={item.label}>
            {item.label}
          </span>
        ))}
      </nav>

      {error !== "" && <div className="demo-error">{error}</div>}

      {stage === "landing" && (
        <section className="demo-landing" aria-label="Choose NeXT Duel mode">
          <div className="demo-landing-copy">
            <p>Real service wiring</p>
            <h2>Choose your duel path.</h2>
            <div className="demo-avatar-picker" aria-label="Choose player avatar">
              {DEMO_AVATARS.map((avatar) => (
                <button
                  className={avatar === selectedAvatar ? "active" : ""}
                  key={avatar}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar)}
                >
                  {avatar}
                </button>
              ))}
            </div>
            <div className="demo-background-picker" aria-label="Choose match background">
              {DEMO_BACKGROUNDS.map((background) => (
                <button
                  className={background.id === selectedBackground.id ? "active" : ""}
                  key={background.id}
                  type="button"
                  onClick={() => setSelectedBackground(background)}
                >
                  <img alt="" src={background.src} />
                  <span>{background.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="demo-mode-grid">
            <button type="button" onClick={() => start("pvc")}>
              <strong>1P</strong>
              <span>Player vs CPU</span>
              <small>Uses matchmaking, question generator, live match, CPU, and summary services.</small>
            </button>
            <button type="button" onClick={() => start("pvp")}>
              <strong>2P</strong>
              <span>Player vs Player</span>
              <small>Open this page on two computers and click 2P on both.</small>
            </button>
          </div>
        </section>
      )}

      {stage === "matchmaking" && (
        <section className="demo-matchmaking" aria-label="Matchmaking page">
          <div className="demo-room-card">
            <p>matchmaking.service.ts</p>
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
          <aside className="demo-service-panel">
            <strong>Second player flow</strong>
            <span>Open the same URL on another computer.</span>
            <span>Click 2P there too.</span>
            <span>The backend queue will pair both browsers into one match.</span>
          </aside>
        </section>
      )}

      {stage === "ready" && snapshot?.readyState !== undefined && (
        <section className="demo-ready" aria-label="Ready page">
          <div className="demo-room-card ready">
            <p>matchmaking.service.ts</p>
            <h2>{snapshot.readyState.countdownEndsAtMs === undefined ? "Ready check" : "Match begins in..."}</h2>
            <div className="demo-room-code">
              <span>Room</span>
              <strong>{snapshot.roomId}</strong>
            </div>
            <div className="demo-vs-strip">
              <PlayerToken
                avatar={selectedAvatar}
                label={readyLabel(snapshot, "p1", playerIdRef.current)}
                tone={snapshot.readyState.p1Ready ? "p1" : "pending"}
              />
              <div className="demo-versus">VS</div>
              <PlayerToken
                avatar={snapshot.readyState.p2PlayerId === playerIdRef.current ? selectedAvatar : "🎱"}
                label={readyLabel(snapshot, "p2", playerIdRef.current)}
                tone={snapshot.readyState.p2Ready ? "p2" : "pending"}
              />
            </div>
            {snapshot.readyState.message !== undefined && (
              <div className="demo-ready-message">{snapshot.readyState.message}</div>
            )}
            {snapshot.readyState.countdownEndsAtMs !== undefined ? (
              <div className="demo-ready-countdown">
                <strong>{Math.max(0, Math.ceil((snapshot.readyState.countdownEndsAtMs - now) / 1000))}</strong>
                <span>Get ready</span>
              </div>
            ) : (
              <div className="demo-ready-actions">
                <button type="button" onClick={setReady}>Ready</button>
                <button type="button" onClick={leavePrematch}>Back</button>
              </div>
            )}
            {snapshot.readyState.countdownEndsAtMs !== undefined && (
              <button className="demo-stop-button" type="button" onClick={stopReady}>Stop</button>
            )}
          </div>
          <aside className="demo-service-panel">
            <strong>Ready contract</strong>
            <span>Both players must press Ready.</span>
            <span>Then a 5-second countdown starts.</span>
            <span>Stop cancels the countdown and resets both players.</span>
            <span>Back leaves the room before active match.</span>
          </aside>
        </section>
      )}

      {(stage === "live" || stage === "summary") && snapshot?.combatants !== undefined && (
        <section className="demo-live" aria-label="Live match page">
          <div className="demo-stage-card">
            <div className={`stage show-avatars show-question demo-service-stage background-${selectedBackground.id} ${stageClassFor(snapshot.eventLog ?? [])}`}>
              <img
                alt={selectedBackground.label}
                src={selectedBackground.src}
              />
              <div className="top-hud" aria-label="Fight round status">
                <HpBar combatant={snapshot.combatants.p1} label={labelFor(snapshot.combatants.p1, playerIdRef.current)} align="left" />
                <div className="round-clock" aria-label="Fight round timer">
                  <span>{snapshot.isFinalRound === true ? "FINAL" : `ROUND ${snapshot.roundNumber ?? 1}`}</span>
                  <strong className="digital-display">{roundTimerLeft}</strong>
                </div>
                <HpBar combatant={snapshot.combatants.p2} label={labelFor(snapshot.combatants.p2, playerIdRef.current)} align="right" />
              </div>

              <div className={avatarPadClass(snapshot.combatants.p1, "p1", snapshot.eventLog ?? [], now)}>
                <div className="emoji-avatar" aria-label="P1 avatar">
                  {avatarFor(snapshot.combatants.p1, playerIdRef.current, selectedAvatar)}
                </div>
              </div>
              <div className={avatarPadClass(snapshot.combatants.p2, "p2", snapshot.eventLog ?? [], now)}>
                <div className="emoji-avatar" aria-label="P2 avatar">
                  {avatarFor(snapshot.combatants.p2, playerIdRef.current, selectedAvatar)}
                </div>
              </div>

              <div className="shock-flash-layer" aria-hidden="true" />
              <RoundIntroOverlay snapshot={snapshot} now={now} />
              {snapshot.summary === undefined && <OutcomeBanner eventLog={snapshot.eventLog ?? []} />}
              <DamageCallout eventLog={snapshot.eventLog ?? []} />

              {snapshot.summary !== undefined && (
                <div className={`match-end-overlay show ${summaryClass(snapshot.summary, playerIdRef.current)}`} aria-live="polite">
                  <strong>{winnerText(snapshot.summary, playerIdRef.current)}</strong>
                  <span>{matchEndDetail(snapshot.summary, playerIdRef.current)}</span>
                </div>
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
                  <label className={!ownInputAvailable ? "locked" : "input-ready"}>
                    <span>{playerSlot?.toUpperCase() ?? "P1"} Answer</span>
                    <input
                      ref={answerInputRef}
                      disabled={!ownInputAvailable}
                      inputMode="numeric"
                      value={answer}
                      onChange={(event) => updateAnswerInput(event.target.value)}
                    />
                  </label>
                  <label className="opponent-box">
                    <span>{opponentSlot.toUpperCase()} Answer</span>
                    <output>{opponentCombatant?.driver === "cpu" ? "CPU thinking..." : "Opponent ready"}</output>
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
          </div>
          {snapshot.summary !== undefined ? (
            <SummarySidePanel
              className={summaryClass(snapshot.summary, playerIdRef.current)}
              mode={snapshot.mode}
              matchId={snapshot.matchId}
              playerId={playerIdRef.current}
              roundNumber={snapshot.roundNumber ?? 1}
              summary={snapshot.summary}
              onReset={reset}
            />
          ) : (
            <aside className="demo-service-panel">
              <strong>Live events</strong>
              <span className="demo-round-chip">{snapshot.isFinalRound === true ? "Final round" : `Round ${snapshot.roundNumber ?? 1}`}</span>
              {snapshot.question !== undefined && (
                <span className="demo-question-meta">
                  Easy arithmetic
                </span>
              )}
              {visibleLiveEvents(snapshot.eventLog).map((event) => (
                <span key={`${event.serverTimestampMs}-${event.name}`}>{liveEventMessage(event)}</span>
              ))}
              <span>Spacebar: DEFEND once per question.</span>
            </aside>
          )}
        </section>
      )}
    </main>
  );
}

function getServerUrl(): string {
  if (typeof window === "undefined") {
    return "http://localhost:3001";
  }

  return `${window.location.protocol}//${window.location.hostname}:3001`;
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

function readyLabel(snapshot: DemoSnapshot, slot: DemoSlot, playerId: string): string {
  const player = slot === "p1" ? snapshot.readyState?.p1PlayerId : snapshot.readyState?.p2PlayerId;
  const ready = slot === "p1" ? snapshot.readyState?.p1Ready : snapshot.readyState?.p2Ready;
  const self = player === playerId ? "You" : slot.toUpperCase();
  return `${self} ${ready ? "Ready" : "Not Ready"}`;
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

function avatarFor(combatant: DemoCombatant, playerId: string, selectedAvatar: string): string {
  if (combatant.id === playerId) {
    return selectedAvatar;
  }

  if (combatant.driver === "cpu") {
    return CPU_AVATARS[combatant.id] ?? "👊";
  }

  return combatant.slot === "p1" ? "🧚🏻‍♀️" : "🎱";
}

function isLocked(combatant: DemoCombatant, now: number): boolean {
  return combatant.statusEffects.some((effect) => effect.endsAtMs > now);
}

function PlayerToken({ avatar, label, tone }: { avatar: string; label: string; tone: DemoSlot | "pending" }) {
  return (
    <div className={`demo-player-token ${tone}`}>
      <span>{avatar}</span>
      <strong>{label}</strong>
      <small>human</small>
    </div>
  );
}

function HpBar({ combatant, label, align }: { combatant: DemoCombatant; label: string; align: "left" | "right" }) {
  const hpPercent = Math.max(0, Math.min(100, (combatant.hp / combatant.maxHp) * 100));
  const roundedHp = Math.round(combatant.hp * 10) / 10;
  if (align === "right") {
    return (
      <div className="hp-meter p2-hp">
        <strong>{roundedHp}</strong>
        <div className="hp-track"><i style={{ width: `${hpPercent}%` }} /></div>
        <span>{label}</span>
      </div>
    );
  }

  return (
    <div className="hp-meter p1-hp">
      <span>{label}</span>
      <div className="hp-track"><i style={{ width: `${hpPercent}%` }} /></div>
      <strong>{roundedHp}</strong>
    </div>
  );
}

function OutcomeBanner({ eventLog }: { eventLog: DemoSnapshot["eventLog"] }) {
  const latest = latestVisualEvent(eventLog);
  if (latest === undefined) {
    return null;
  }

  return <div className={`outcome-banner show ${outcomeClass(latest)}`} key={eventKey(latest)}>{outcomeMessage(latest)}</div>;
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

function SummarySidePanel({
  className,
  mode,
  matchId,
  playerId,
  roundNumber,
  summary,
  onReset,
}: {
  className: string;
  mode?: DemoMode;
  matchId: string;
  playerId: string;
  roundNumber: number;
  summary: DemoSummary;
  onReset: () => void;
}) {
  // Handover contract: Add Friend needs an authenticated current user,
  // opponent user id, and the Friends Management REST endpoint.
  // function requestFriendInvite() {
  //   socketOrApi.emit("friends.invite.create", { requesterId, targetPlayerId });
  // }

  // Handover contract: Rematch needs both players to opt in, then Matchmaking
  // should create a fresh ready room using the previous match participants.
  // function requestRematch() {
  //   socket.emit("demo.rematch.request", { matchId, playerId });
  // }

  // Handover contract: Back currently returns to Landing. In the real app this
  // should navigate back to the post-match route or previous menu surface.
  // function goBackToPostMatchRoute() {
  //   router.push(`/dashboard/matches/${matchId}/summary`);
  // }

  return (
    <aside className={`demo-service-panel demo-summary-panel ${className}`} aria-label="Match summary">
      <p>match-summary.service.ts</p>
      <h2>{winnerText(summary, playerId)}</h2>
      <SummaryCard label="Result" value={matchEndDetail(summary, playerId)} />
      <SummaryCard label="Mode" value={mode === "pvc" ? "1P / CPU" : "2P / PVP"} />
      <SummaryCard label="Ended on" value={`Round ${roundNumber}`} />
      <SummaryCard label="Match" value={matchId} />
      <SummaryCard label="P1" value={summaryText(summary.combatants.p1)} />
      <SummaryCard label="P2" value={summaryText(summary.combatants.p2)} />
      <div className="demo-summary-actions" aria-label="Post-match actions">
        <button type="button" disabled title="Open contract: Friends Management service">
          Add Friend
        </button>
        <button type="button" disabled title="Open contract: Matchmaking rematch room">
          Rematch
        </button>
        <button type="button" onClick={onReset}>
          Back
        </button>
      </div>
    </aside>
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

function matchEndDetail(summary: DemoSummary, playerId: string): string {
  if (summary.status === "voided") {
    if (summary.dcCombatantId === playerId) {
      return "Reconnect failed";
    }
    if (summary.dcCombatantId !== undefined) {
      return `${labelCombatantId(summary.dcCombatantId)} disconnected`;
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

  return `${labelCombatantId(winnerCombatantId)} wins`;
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

function summaryText(combatant: DemoSummary["combatants"][DemoSlot]): string {
  return `${combatant.hp} HP / ${combatant.correctAnswers}-${combatant.submittedAttempts} answers / ${Math.round(combatant.accuracy * 100)}%`;
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

function outcomeMessage(event: DemoEvent): string {
  if (event.name === "attack.landed") {
    const attacker = readSlotPayload(event, "attackerSlot")?.toUpperCase() ?? "";
    const multiplier = readNumberPayload(event, "streakMultiplier");
    return multiplier === undefined ? `${attacker} ATT!` : `${attacker} ATT x ${formatCombatNumber(multiplier)}!`;
  }

  if (event.name === "revenge.attack_landed") {
    const attacker = readSlotPayload(event, "attackerSlot")?.toUpperCase() ?? "";
    return `${attacker} REVENGE ATT!`;
  }

  return event.message
    .replace("p1", "P1")
    .replace("p2", "P2")
    .replace("hit for", "ATT x");
}

function latestVisualEvent(eventLog: DemoSnapshot["eventLog"]): DemoEvent | undefined {
  return eventLog?.find((event) => VISUAL_EVENT_NAMES.has(event.name));
}

function latestDamageEvent(eventLog: DemoSnapshot["eventLog"]): DemoEvent | undefined {
  return eventLog?.find((event) => DAMAGE_EVENT_NAMES.has(event.name));
}

function visibleLiveEvents(eventLog: DemoSnapshot["eventLog"]): DemoEvent[] {
  return (eventLog ?? [])
    .filter((event) => LIVE_EVENT_NAMES.has(event.name))
    .slice(0, 7);
}

function liveEventMessage(event: DemoEvent): string {
  if (event.name === "attack.landed") {
    const attacker = readSlotPayload(event, "attackerSlot")?.toUpperCase() ?? "Player";
    const target = readSlotPayload(event, "targetCombatantSlot")?.toUpperCase() ?? "opponent";
    const damage = readNumberPayload(event, "damage");
    return damage === undefined ? `${attacker} hit ${target}.` : `${attacker} hit ${target} for ${formatCombatNumber(damage)}.`;
  }

  if (event.name === "revenge.attack_landed") {
    const attacker = readSlotPayload(event, "attackerSlot")?.toUpperCase() ?? "Player";
    const target = readSlotPayload(event, "targetCombatantSlot")?.toUpperCase() ?? "opponent";
    return `${attacker} used REVENGE on ${target}.`;
  }

  return event.message
    .replaceAll("p1", "P1")
    .replaceAll("p2", "P2")
    .replaceAll("cpu", "CPU")
    .replaceAll("_", " ");
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
  return latestVisualEvent(eventLog)?.name === "shock.applied" ? "stage-shock" : "";
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
