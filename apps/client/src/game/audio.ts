import { type MutableRefObject } from "react";
import { AUDIO_ASSETS, STREAK_NOTE_FREQUENCIES } from "./constants";
import type { GameEvent, GameSlot } from "./types";
import { readNumberPayload, readSlotPayload } from "./event-helpers";

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

export function startBackgroundMusic(bgmRef: MutableRefObject<HTMLAudioElement | null>, src: string): void {
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
export function fadeOutAndPauseBgm(bgmRef: MutableRefObject<HTMLAudioElement | null>, durationMs = 900): void {
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

export function startLoopingSfx(ref: MutableRefObject<HTMLAudioElement | null>, src: string, volume: number): void {
  if (typeof window === "undefined") return;
  stopLoopingSfx(ref);
  const audio = new Audio(src);
  audio.loop = true;
  audio.volume = volume;
  ref.current = audio;
  void audio.play().catch(() => undefined);
}

export function stopLoopingSfx(ref: MutableRefObject<HTMLAudioElement | null>): void {
  if (ref.current !== null) {
    ref.current.pause();
    ref.current.currentTime = 0;
    ref.current = null;
  }
}

export function playAudioForEvent(
  event: GameEvent,
  audioContextRef: MutableRefObject<AudioContext | null>,
  playerSlot?: GameSlot,
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

export function playSfx(src: string, volume: number): void {
  const audio = new Audio(src);
  audio.volume = volume;
  void audio.play().catch(() => undefined);
}

export function playStreakNote(streak: number, audioContextRef: MutableRefObject<AudioContext | null>): void {
  const context = getAudioContext(audioContextRef);
  if (context === null) {
    return;
  }

  const noteIndex = Math.max(0, Math.min(STREAK_NOTE_FREQUENCIES.length - 1, streak - 1));
  const frequency = STREAK_NOTE_FREQUENCIES[noteIndex] ?? STREAK_NOTE_FREQUENCIES[0];
  playTone(context, frequency, 0.16, 0.12, "triangle");
  playTone(context, frequency * 2, 0.12, 0.035, "sine", 0.012);
}

export function getAudioContext(audioContextRef: MutableRefObject<AudioContext | null>): AudioContext | null {
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
