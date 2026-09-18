'use client';
import { useEffect, useRef, useState } from 'react';
import { firstSpokenNumber } from './spoken-number';
type Recognition = {
  lang: string; continuous: boolean; interimResults: boolean;
  onresult: ((event: { resultIndex: number; results: { length: number; [index: number]: { isFinal: boolean; [index: number]: { transcript: string } } } }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start(): void; abort(): void;
};
type SpeechWindow = Window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };

type Props = {
  onListening?: () => void;
  answer: string; enabled: boolean; submitEnabled: boolean; questionKey: string;
  onChange: (value: string) => void; onAutoSubmit?: (value: string) => void;
  onDefend?: () => void; defendEnabled?: boolean; autoEnable?: boolean; setup?: boolean;
};
export function VoiceControls({ onListening, answer, enabled, submitEnabled, questionKey, onChange, onAutoSubmit, onDefend, defendEnabled = false, autoEnable = false, setup = false }: Props) {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [micOn, setMicOn] = useState(autoEnable);
  const [listening, setListening] = useState(false);
  const [preview, setPreview] = useState('');
  const [micError, setMicError] = useState('');
  const startMic = useRef<() => void>(() => {});
  const stopMic = useRef<() => void>(() => {});
  const recognition = useRef<Recognition | null>(null);
  const captured = useRef(false);
  const onListeningRef = useRef(onListening);
  useEffect(() => { onListeningRef.current = onListening; }, [onListening]);
  const latest = useRef({ enabled, submitEnabled, answer, onChange, onAutoSubmit });
  const transcripts = useRef(new Map<number, string>());
  const consumedTranscripts = useRef(new Map<number, string>());
  const settleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const submitTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [clearVersion, setClearVersion] = useState(0);
  useEffect(() => { latest.current = { enabled, submitEnabled, answer, onChange, onAutoSubmit }; });
  useEffect(() => {
    clearTimeout(settleTimer.current);
    clearTimeout(submitTimer.current);
    consumedTranscripts.current = new Map(transcripts.current);
    captured.current = false;
    setPreview('');
  }, [questionKey, enabled, submitEnabled, clearVersion]);
  useEffect(() => {
    const browser = window as SpeechWindow;
    setSupported(Boolean(browser.SpeechRecognition || browser.webkitSpeechRecognition));
  }, []);

  useEffect(() => {
    const browser = window as SpeechWindow;
    const Constructor = browser.SpeechRecognition || browser.webkitSpeechRecognition;
    if (!Constructor) return;
    let disposed = false;
    let restart: ReturnType<typeof setTimeout> | undefined;

    let wanted = autoEnable;
    let active = false;
    let startupTimer: ReturnType<typeof setTimeout> | undefined;
    let failures = 0;
    const instance = new Constructor();
    recognition.current = instance;
    captured.current = false;
    instance.lang = 'en-US';
    instance.continuous = true;
    instance.interimResults = true;
    instance.onstart = () => {
      clearTimeout(startupTimer);
      if (!disposed) { setListening(true); onListeningRef.current?.(); }
    };
    function capture(number: string) {
      if (disposed || captured.current) return;
      captured.current = true;
      clearTimeout(settleTimer.current);
      if (!latest.current.enabled || (!setup && !latest.current.submitEnabled)) { captured.current = false; return; }
      latest.current.onChange(number);
      // Let React paint the captured answer before accepting it.
      if (!setup) submitTimer.current = setTimeout(() => {
        if (!disposed && captured.current && latest.current.enabled &&
            latest.current.submitEnabled && latest.current.answer === number) {
          latest.current.onAutoSubmit?.(number);
        } else {
          captured.current = false;
        }
      }, 350);
      setPreview('');
      setMicError('');
    }
    instance.onresult = (event) => {
      if (disposed) return;
      clearTimeout(settleTimer.current);
      // Interim results may be removed by the browser and their index reused
      // for the next utterance. Do not keep an old consumed prefix there.
      for (const index of transcripts.current.keys()) {
        if (index >= event.results.length) {
          transcripts.current.delete(index);
          consumedTranscripts.current.delete(index);
        }
      }
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript.trim().toLowerCase();
        if (transcript) failures = 0;
        transcripts.current.set(i, transcript);
        if (captured.current || !latest.current.enabled || (!setup && !latest.current.submitEnabled)) continue;
        // Desktop recognizers can append another answer to the same interim
        // result. Consume the old words, not the entire result index.
        const consumed = consumedTranscripts.current.get(i);
        let fresh = transcript;
        if (consumed !== undefined) {
          if (!transcript.startsWith(consumed)) continue;
          fresh = transcript.slice(consumed.length);
          if (fresh && !/^[\s.,!?;:]/.test(fresh)) continue;
        }
        if (!fresh.trim()) continue;
        const number = firstSpokenNumber(fresh);
        if (number === null) {
          setPreview('');
          if (result.isFinal) setMicError('No number heard. Say an English number, such as twelve or minus three.');
          continue;
        }
        setPreview(number);
        if (result.isFinal) capture(number);
        else {
          // Leave a little extra room for compound numbers: “twenty ... one”.
          const compound = Math.abs(Number(number)) >= 20 && Number(number) % 10 === 0;
          settleTimer.current = setTimeout(() => capture(number), compound ? 400 : 150);
        }
        break;
      }
    };
    instance.onerror = (event) => {
      if (disposed || event.error === 'aborted') return;
      if (event.error === 'no-speech' && failures++ < 2) return;
      wanted = false;
      clearTimeout(startupTimer);
      clearTimeout(restart);
      setMicOn(false);
      setListening(false);
      setMicError(event.error === 'not-allowed' || event.error === 'service-not-allowed'
        ? 'Microphone access was denied. Allow it in your browser’s site settings, then tap Clear (or Enable mic in setup).'
        : event.error === 'audio-capture' ? 'No microphone found. Connect or enable a microphone, then try again.'
        : 'Speech recognition stopped. Check your connection and microphone, then tap Clear (or Enable mic in setup).');
    };
    function start() {
      if (disposed || active || !wanted) return;
      clearTimeout(restart);
      transcripts.current.clear();
      consumedTranscripts.current.clear();
      try {
        active = true;
        instance.start();
        startupTimer = setTimeout(() => {
          if (disposed) return;
          wanted = false;
          setMicOn(false);
          setListening(false);
          instance.abort();
          setMicError('The microphone did not start. Tap Clear to retry. If this home-screen app stays silent, open the game in Safari and allow microphone access.');
        }, 5000);
      }
      catch { active = false; wanted = false; setMicOn(false); setMicError('Could not start the microphone. Tap Clear to try again.'); }
    }
    instance.onend = () => {
      if (disposed) return;
      active = false;
      clearTimeout(startupTimer);
      setListening(false);
      if (wanted) restart = setTimeout(start, 150);
    };
    startMic.current = () => {
      wanted = true;
      failures = 0;
      setMicError('');
      setMicOn(true);
      start(); // Run directly inside the tap, not in a later React effect.
    };
    stopMic.current = () => {
      wanted = false;
      clearTimeout(restart);
      clearTimeout(startupTimer);
      clearTimeout(settleTimer.current);
      clearTimeout(submitTimer.current);
      setMicOn(false);
      setListening(false);
      instance.abort();
    };
    if (autoEnable) start();
    return () => {
      disposed = true;
      wanted = false;
      clearTimeout(startupTimer);
      startMic.current = stopMic.current = () => {};
      clearTimeout(restart);
      clearTimeout(submitTimer.current);
      clearTimeout(settleTimer.current);
      setPreview('');
      instance.onresult = instance.onerror = instance.onend = instance.onstart = null;
      instance.abort();
      recognition.current = null;
      setListening(false);
    };
  }, [autoEnable, setup]);


  useEffect(() => {
    const pause = () => { if (document.hidden) { stopMic.current(); } };
    document.addEventListener('visibilitychange', pause);
    return () => document.removeEventListener('visibilitychange', pause);
  }, []);
  return <div className={setup ? 'voice-game-setup' : 'voice-game-controls'} aria-label={setup ? 'Microphone check' : 'Voice answer controls'}>
    {setup && <p>Test your mic: say a number in English, then start the duel. Use headphones to keep the game music out of your microphone.</p>}
    <div className="voice-game-status" role="status">
      {supported === false ? 'Speech recognition is unavailable in this browser.' : answer ? `Captured: ${answer}` : preview ? `Hearing: ${preview}` : !enabled ? 'Waiting for your next answer turn…' : listening ? '● Listening…' : setup ? 'Enable your microphone' : 'Tap Clear to enable your microphone'}
    </div>
    {micError && <p role="alert" className="voice-game-error">{micError}</p>}
    <div className="voice-game-buttons">
      <button type="button" aria-label="Clear voice answer" disabled={!supported} onClick={() => { clearTimeout(submitTimer.current); clearTimeout(settleTimer.current); onChange(''); setClearVersion((value) => value + 1); if (!listening) startMic.current(); }}>⌫ Clear</button>
      {onDefend && <button type="button" aria-label="Block" disabled={!defendEnabled} onClick={onDefend}>🛡 Block</button>}
      {setup && <button type="button" disabled={!supported} onClick={() => { if (micOn) stopMic.current(); else startMic.current(); }}>{micOn ? 'Mute mic' : 'Enable mic'}</button>}
    </div>
    {setup && <small>Your browser may send audio to its speech service. This checks the microphone; it does not identify your voice. Duels use normal scoring and progression.</small>}
  </div>;
}
