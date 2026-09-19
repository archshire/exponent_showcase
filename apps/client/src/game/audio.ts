import { type MutableRefObject } from 'react';
import { AUDIO_ASSETS, STREAK_NOTE_FREQUENCIES } from './constants';
import type { GameEvent, GameSlot } from './types';
import { readNumberPayload, readSlotPayload } from './event-helpers';

const musicFades = new WeakMap<HTMLAudioElement, number>();
const wantedMusic = new WeakSet<HTMLAudioElement>();

function cancelMusicFade(audio: HTMLAudioElement): void {
  const timer = musicFades.get(audio);
  if (timer !== undefined) clearInterval(timer);
  musicFades.delete(audio);
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

export function startBackgroundMusic(
  bgmRef: MutableRefObject<HTMLAudioElement | null>,
  src: string
): void {
  if (typeof window === 'undefined') return;

  if (bgmRef.current) {
    cancelMusicFade(bgmRef.current);
    bgmRef.current.volume = 0.18;
    wantedMusic.add(bgmRef.current);
  }
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

  wantedMusic.add(bgmRef.current);
  void bgmRef.current.play().catch(() => undefined);
}

// Ramps the arena music down to silence rather than cutting it abruptly at
// the final/winning blow, then pauses it and restores its original volume so
// a later rematch's startBackgroundMusic (which reuses this same element)
// isn't left permanently silent.
export function fadeOutAndPauseBgm(
  bgmRef: MutableRefObject<HTMLAudioElement | null>,
  durationMs = 900
): void {
  const audio = bgmRef.current;
  if (audio === null || typeof window === 'undefined') return;
  cancelMusicFade(audio);
  wantedMusic.delete(audio);
  const startVolume = audio.volume;
  const steps = 15;
  let step = 0;
  const interval = window.setInterval(() => {
    step += 1;
    audio.volume = Math.max(0, startVolume * (1 - step / steps));
    if (step >= steps) {
      window.clearInterval(interval);
      musicFades.delete(audio);
      audio.pause();
      audio.volume = startVolume;
    }
  }, durationMs / steps);
  musicFades.set(audio, interval);
}

export type LoopingSfx = {
  stop: () => void;
};

export function startLoopingSfx(
  ref: MutableRefObject<LoopingSfx | null>,
  src: string,
  volume: number,
  audioContextRef: MutableRefObject<AudioContext | null>
): void {
  if (typeof window === 'undefined') return;
  stopLoopingSfx(ref);
  const context = getAudioContext(audioContextRef);
  if (!context) return;
  let cancelled = false;
  let source: AudioBufferSourceNode | undefined;
  let gain: GainNode | undefined;
  let resuming = false;
  // Releasing the microphone can interrupt mobile audio after results start.
  // Resume the existing source so playback continues from the same position.
  const recover = () => {
    if (cancelled || resuming || document.hidden || context.state === 'running' || context.state === 'closed') return;
    resuming = true;
    void context.resume().catch(() => undefined).finally(() => { resuming = false; });
  };
  context.addEventListener('statechange', recover);
  document.addEventListener('visibilitychange', recover);
  const removeRecovery = () => {
    context.removeEventListener('statechange', recover);
    document.removeEventListener('visibilitychange', recover);
  };
  const playback: LoopingSfx = {
    stop: () => {
      cancelled = true;
      removeRecovery();
      source?.stop();
      source?.disconnect();
      gain?.disconnect();
    },
  };
  ref.current = playback;
  void loadEffect(context, src).then((buffer) => {
    // A leave/rematch may arrive while the sound is still loading.
    if (cancelled || ref.current !== playback || context.state === 'closed') return;
    getAudioContext(audioContextRef);
    source = context.createBufferSource();
    gain = context.createGain();
    source.buffer = buffer;
    source.loop = true;
    gain.gain.value = volume;
    source.connect(gain);
    gain.connect(context.destination);
    source.start();
  }).catch(() => {
    playback.stop();
    if (ref.current === playback) ref.current = null;
  });
}

export function stopLoopingSfx(ref: MutableRefObject<LoopingSfx | null>): void {
  ref.current?.stop();
  ref.current = null;
}

export function playAudioForEvent(
  event: GameEvent,
  audioContextRef: MutableRefObject<AudioContext | null>,
  playerSlot?: GameSlot
): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (event.name === 'attack.landed') {
    const streak = readNumberPayload(event, 'attackerStreak') ?? 1;
    playStreakNote(streak, audioContextRef);
    const isMyAttack =
      playerSlot !== undefined && readSlotPayload(event, 'attackerSlot') === playerSlot;
    playBufferedSfx(isMyAttack ? AUDIO_ASSETS.hit : AUDIO_ASSETS.hitReceived, 0.34, audioContextRef);
    return;
  }

  if (event.name === 'revenge.attack_landed') {
    const isMyAttack =
      playerSlot !== undefined && readSlotPayload(event, 'attackerSlot') === playerSlot;
    playBufferedSfx(isMyAttack ? AUDIO_ASSETS.revengeHit : AUDIO_ASSETS.revengeHitReceived, 0.78, audioContextRef);
    return;
  }

  if (event.name === 'revenge.activated') {
    playBufferedSfx(AUDIO_ASSETS.revengeReady, 0.6, audioContextRef);
    return;
  }

  if (event.name === 'missed') {
    playBufferedSfx(AUDIO_ASSETS.miss, 0.62, audioContextRef);
    return;
  }

  if (event.name === 'shock.applied') {
    playBufferedSfx(AUDIO_ASSETS.shock, 0.72, audioContextRef);
    return;
  }

  if (event.name === 'defend.activated') {
    playBufferedSfx(AUDIO_ASSETS.defend, 0.46, audioContextRef);
    return;
  }

  if (event.name === 'defend.blocked') {
    playBufferedSfx(AUDIO_ASSETS.block, 0.66, audioContextRef);
    return;
  }

  if (event.name === 'draw.triggered') {
    playBufferedSfx(AUDIO_ASSETS.clash, 0.7, audioContextRef);
  }
}

// Reuse the context unlocked by the Start gesture, including for hands-free answers.
const buffers = new WeakMap<AudioContext, Map<string, Promise<AudioBuffer>>>();

function loadEffect(context: AudioContext, src: string): Promise<AudioBuffer> {
  let cache = buffers.get(context);
  if (!cache) { cache = new Map(); buffers.set(context, cache); }
  let pending = cache.get(src);
  if (!pending) {
    pending = fetch(src).then((response) => {
      if (!response.ok) throw new Error('Could not load game effect');
      return response.arrayBuffer();
    }).then((data) => context.decodeAudioData(data));
    cache.set(src, pending);
    void pending.catch(() => cache?.delete(src));
  }
  return pending;
}

export function prepareGameAudio(ref: MutableRefObject<AudioContext | null>): void {
  const context = getAudioContext(ref);
  if (!context) return;
  void context.resume().catch(() => undefined);
  for (const src of Object.values(AUDIO_ASSETS)) {
    void loadEffect(context, src).catch(() => undefined);
  }
}

export function installAudioRecovery(
  ref: MutableRefObject<AudioContext | null>,
  bgmRef?: MutableRefObject<HTMLAudioElement | null>
): () => void {
  let observedContext: AudioContext | null = null;
  let resuming = false;
  const resume = () => {
    if (document.hidden) return;
    if (ref.current !== observedContext) {
      observedContext?.removeEventListener('statechange', resume);
      observedContext = ref.current;
      observedContext?.addEventListener('statechange', resume);
    }
    const context = ref.current;
    if (context && context.state !== 'running' && context.state !== 'closed' && !resuming) {
      resuming = true;
      void context.resume().catch(() => undefined).finally(() => { resuming = false; });
    }
    const music = bgmRef?.current;
    if (music && wantedMusic.has(music) && music.paused) {
      void music.play().catch(() => undefined);
    }
  };
  const visible = () => { if (!document.hidden) resume(); };
  // The context may be created after this effect, or interrupted after a rematch
  // tap. Keep recovery active throughout gameplay, not only on user gestures.
  const recoveryTimer = window.setInterval(resume, 1000);
  document.addEventListener('click', resume, true);
  document.addEventListener('touchend', resume, { passive: true });
  document.addEventListener('visibilitychange', visible);
  document.addEventListener('fullscreenchange', resume);
  window.addEventListener('pageshow', visible);
  return () => {
    window.clearInterval(recoveryTimer);
    observedContext?.removeEventListener('statechange', resume);
    document.removeEventListener('click', resume, true);
    document.removeEventListener('touchend', resume);
    document.removeEventListener('visibilitychange', visible);
    document.removeEventListener('fullscreenchange', resume);
    window.removeEventListener('pageshow', visible);
  };
}

export function playBufferedSfx(src: string, volume: number, ref: MutableRefObject<AudioContext | null>): void {
  const context = getAudioContext(ref);
  if (!context) { playSfx(src, volume); return; }
  void loadEffect(context, src).then((buffer) => {
    if (context.state === 'closed') return;
    getAudioContext(ref);
    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = buffer;
    gain.gain.value = volume;
    source.connect(gain);
    gain.connect(context.destination);
    source.onended = () => { source.disconnect(); gain.disconnect(); };
    source.start();
  }).catch(() => playSfx(src, volume));
}

export function playSfx(src: string, volume: number): void {
  const audio = new Audio(src);
  audio.volume = volume;
  void audio.play().catch(() => undefined);
}

export function playStreakNote(
  streak: number,
  audioContextRef: MutableRefObject<AudioContext | null>
): void {
  const context = getAudioContext(audioContextRef);
  if (context === null) {
    return;
  }

  const noteIndex = Math.max(0, Math.min(STREAK_NOTE_FREQUENCIES.length - 1, streak - 1));
  const frequency = STREAK_NOTE_FREQUENCIES[noteIndex] ?? STREAK_NOTE_FREQUENCIES[0];
  playTone(context, frequency, 0.16, 0.12, 'triangle');
  playTone(context, frequency * 2, 0.12, 0.035, 'sine', 0.012);
}

export function getAudioContext(
  audioContextRef: MutableRefObject<AudioContext | null>
): AudioContext | null {
  if (audioContextRef.current?.state === 'closed') audioContextRef.current = null;
  if (audioContextRef.current !== null) {
    if (audioContextRef.current.state !== 'running') {
      void audioContextRef.current.resume().catch(() => undefined);
    }
    return audioContextRef.current;
  }

  const AudioContextCtor =
    window.AudioContext ??
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
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
  delay = 0
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
