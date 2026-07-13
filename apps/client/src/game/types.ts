export type GameMode = 'pvc' | 'pvp';
export type GameStage = 'landing' | 'starting' | 'matchmaking' | 'ready' | 'live' | 'summary';
export type GameSlot = 'p1' | 'p2';
export type GamePhase =
  | 'created'
  | 'round_prep'
  | 'question_constructing'
  | 'question_active'
  | 'round_ended'
  | 'reconnect_paused'
  | 'ended'
  | 'summary';

export interface GameCombatant {
  slot: GameSlot;
  id: string;
  driver: 'human' | 'cpu';
  hp: number;
  maxHp: number;
  currentStreak: number;
  longestStreak: number;
  revengeBlocks: number;
  revengeActive: boolean;
  defendAvailable: boolean;
  submittedAttempts: number;
  correctAnswers: number;
  statusEffects: Array<{
    type: 'missed' | 'defend' | 'stunned';
    startedAtMs: number;
    endsAtMs: number;
  }>;
}

export interface GameQuestion {
  sequence: number;
  prompt: string;
  difficulty: string;
  questionType: string;
  startedAtMs?: number;
  deadlineAtMs?: number;
  /** Set while paused for a reconnect: the attack gauge's exact fill at disconnect, frozen until resume. */
  frozenProgressPercent?: number;
}

export interface PlayerPresentation {
  playerId: string;
  username: string;
  avatar: string;
  profilePictureUrl: string | null;
  identityImageSource: string;
  premadeAvatarKey: string | null;
  isCpu: boolean;
}

export type Difficulty = 'very_easy' | 'easy' | 'very_hard';

export interface GameSnapshot {
  waiting?: boolean;
  roomId: string;
  matchId: string;
  playerId?: string;
  mode?: GameMode;
  phase?: GamePhase;
  arenaId?: string;
  matchDifficulty?: Difficulty;
  isPrivateMatch?: boolean;
  players?: Record<string, PlayerPresentation>;
  playerSlot?: GameSlot;
  question?: GameQuestion;
  combatants?: Record<GameSlot, GameCombatant>;
  roundNumber?: number;
  roundWins?: Record<GameSlot, number>;
  tiedRoundCount?: number;
  isFinalRound?: boolean;
  roundClock?: {
    startedAtMs?: number;
    deadlineAtMs?: number;
    /** Set while paused for a reconnect: the exact time left when disconnected, frozen until resume. */
    frozenSecondsLeft?: number;
  };
  reconnectState?: {
    status: 'reconnecting' | 'resuming';
    disconnectedSlot: GameSlot;
    startedAtMs: number;
    deadlineAtMs: number;
    resumedAtMs?: number;
    resumeDeadlineAtMs?: number;
  };
  eventLog?: GameEvent[];
  summary?: GameSummary;
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

export interface GameEvent {
  name: string;
  message: string;
  serverTimestampMs: number;
  payload?: Record<string, unknown>;
}

export interface GameSummary {
  status: 'completed' | 'voided';
  winnerCombatantId?: string;
  dcCombatantId?: string;
  voidReason?: string;
  mutualFinalRoundLoss: boolean;
  combatants: Record<
    GameSlot,
    {
      combatantId: string;
      hp: number;
      correctAnswers: number;
      submittedAttempts: number;
      accuracy: number;
      longestStreak: number;
      auraGain: number;
    }
  >;
}
