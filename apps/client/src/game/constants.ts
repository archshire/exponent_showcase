export const VERY_HARD_PVP_THRESHOLD = 50;

export const GAME_AVATARS = ["👻", "💀", "🥱", "👽", "🤖", "😈", "😷", "🤡", "🤯", "😍"];

export const GAME_BACKGROUNDS = [
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

export function backgroundById(id: string | undefined): (typeof GAME_BACKGROUNDS)[number] {
  return GAME_BACKGROUNDS.find((b) => b.id === id) ?? GAME_BACKGROUNDS[0];
}

export const CPU_AVATARS: Record<string, string> = {
  "cpu:min": "🤏🏻",
  "cpu:max": "👊",
  "cpu:fury": "🔥",
  "cpu:shi_eld": "🛡️",
};

export const REVENGE_BLOCKS = 5;

// Matches the question window (QUESTION_DURATION_MS) so the bar fills exactly
// when the question times out — no dead gap before the shock.
export const ATTACK_STRENGTH_MS = 6000;

export const VISUAL_EVENT_NAMES = new Set([
  "attack.landed",
  "revenge.attack_landed",
  "defend.activated",
  "defend.blocked",
  "missed",
  "shock.applied",
  "draw.triggered",
  "match.ended",
]);

export const DAMAGE_EVENT_NAMES = new Set(["attack.landed", "revenge.attack_landed", "shock.applied"]);

export const AUDIO_EVENT_NAMES = new Set([
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

export const AUDIO_ASSETS = {
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

export const STREAK_NOTE_FREQUENCIES = [261.63, 293.66, 329.63, 349.23, 392, 440, 493.88, 523.25];

// Mirrors the server's RECONNECT_GRACE_MS (live-match.service.ts) — once this
// elapses the server voids the match, so the rejoin banner must disappear too.
export const REJOIN_GRACE_MS = 10_000;
