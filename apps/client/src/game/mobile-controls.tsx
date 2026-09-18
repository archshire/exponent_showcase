import { useEffect, useRef, useState, type PointerEvent } from 'react';

type Props = {
  answer: string;
  inputEnabled: boolean;
  submitEnabled: boolean;
  defendEnabled: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onDefend: () => void;
};
type Layout = { x: number; y: number; width: number };
const STORAGE_KEY = 'exponent-number-pad-v2';
const padHeight = (width: number) => 44 + 4 * ((width - 26) / 3) + 15;

export function MobileControls({ answer, inputEnabled, submitEnabled, defendEnabled, onChange, onSubmit, onDefend }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const pinch = useRef<{ distance: number; layout: Layout } | null>(null);
  const [pinching, setPinching] = useState(false);
  const suppressTapUntil = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gesture = useRef<{ id: number; x: number; y: number; layout: Layout; mode: 'hold' | 'move' | 'resize' } | null>(null);
  const [layout, setLayout] = useState<Layout>({ x: 0, y: 0, width: 168 });
  const [ready, setReady] = useState(false);
  const [editing, setEditing] = useState(false);
  const [holding, setHolding] = useState(false);
  const [fullscreenHelp, setFullscreenHelp] = useState('');

  function fit(value: Layout): Layout {
    const bounds = root.current?.getBoundingClientRect();
    if (!bounds || !bounds.width || !bounds.height) return value;
    const maxWidth = Math.min(300, bounds.width - 16, ((bounds.height - 75) * 3 / 4) + 26);
    const width = Math.max(160, Math.min(value.width, maxWidth));
    return {
      width,
      x: Math.max(8, Math.min(value.x, bounds.width - width - 8)),
      y: Math.max(8, Math.min(value.y, bounds.height - padHeight(width) - 8)),
    };
  }

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let initialized = false;
    let previousBounds = { width: 0, height: 0 };
    const observer = new ResizeObserver(() => {
      const bounds = element.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      if (!initialized) {
        let initial = { x: bounds.width - 180, y: bounds.height - padHeight(168) - 12, width: 168 };
        try {
          const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
          if (saved && [saved.x, saved.y, saved.width].every(Number.isFinite)) {
            initial = { x: saved.x * bounds.width, y: saved.y * bounds.height, width: saved.width };
          }
        } catch { /* Storage is optional in private browsing. */ }
        setLayout(fit(initial));
        setReady(true);
        initialized = true;
      } else {
        const oldBounds = previousBounds;
        setLayout((previous) => {
          const next = fit(previous);
          const xRatio = (previous.x - 8) / Math.max(1, oldBounds.width - previous.width - 16);
          const yRatio = (previous.y - 8) / Math.max(1, oldBounds.height - padHeight(previous.width) - 16);
          return fit({ ...next,
            x: 8 + xRatio * Math.max(0, bounds.width - next.width - 16),
            y: 8 + yRatio * Math.max(0, bounds.height - padHeight(next.width) - 16),
          });
        });
      }
      previousBounds = { width: bounds.width, height: bounds.height };
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function save(value: Layout) {
    const bounds = root.current?.getBoundingClientRect();
    if (!bounds?.width || !bounds.height) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ x: value.x / bounds.width, y: value.y / bounds.height, width: value.width }));
    } catch { /* Keep working when browser storage is unavailable. */ }
  }

  function begin(event: PointerEvent<HTMLButtonElement>, resize = false) {
    if (!event.isPrimary || event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, layout, mode: resize ? 'resize' : editing ? 'move' : 'hold' };
    if (!editing) {
      setHolding(true);
      timer.current = setTimeout(() => {
        setEditing(true);
        setHolding(false);
        if (gesture.current) gesture.current.mode = 'move';
      }, 1000);
    }
  }

  function move(event: PointerEvent<HTMLButtonElement>) {
    const active = gesture.current;
    if (!active || active.id !== event.pointerId) return;
    const dx = event.clientX - active.x;
    const dy = event.clientY - active.y;
    if (active.mode === 'hold') {
      if (Math.hypot(dx, dy) > 10) finish();
      return;
    }
    setLayout(fit(active.mode === 'resize'
      ? { ...active.layout, width: active.layout.width + (Math.abs(dx) >= Math.abs(dy * .75) ? dx : dy * .75) }
      : { ...active.layout, x: active.layout.x + dx, y: active.layout.y + dy }));
  }

  function finish() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    gesture.current = null;
    setHolding(false);
  }

  function lock() { finish(); save(layout); setEditing(false); }

  async function fullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.fullscreenEnabled) await document.documentElement.requestFullscreen();
      else setFullscreenHelp('For a screen without browser bars, open this page in Safari, tap Share → Add to Home Screen, then launch Exponent from its icon.');
    } catch {
      setFullscreenHelp('Fullscreen is unavailable in this browser. Try opening Exponent from your Home Screen.');
    }
  }

  return (
    <div ref={root} className="mobile-game-controls" aria-label="Touch game controls">
      <div className="mobile-left-actions">
        <button type="button" aria-label="Delete last digit" disabled={!inputEnabled} onClick={() => onChange(answer.slice(0, -1))}>⌫</button>
        <button type="button" aria-label="Toggle negative sign" disabled={!inputEnabled} onClick={() => onChange(answer.startsWith('-') ? answer.slice(1) : '-' + answer)}>−</button>
        <button type="button" className="mobile-defend" aria-label="Defend" disabled={!defendEnabled} onClick={onDefend}>🛡</button>
      </div>
      <button className="mobile-fullscreen" type="button" aria-label="Fullscreen options" onClick={fullscreen}>⛶</button>
      {fullscreenHelp && <div className="mobile-fullscreen-help" role="status">{fullscreenHelp}<button type="button" onClick={() => setFullscreenHelp('')}>Close</button></div>}
      <div
        onTouchStart={(event) => {
          if (event.touches.length !== 2) return;
          finish();
          const [a, b] = Array.from(event.touches);
          pinch.current = { distance: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY), layout };
          setPinching(true);
          suppressTapUntil.current = Date.now() + 500;
        }}
        onTouchMove={(event) => {
          if (!pinch.current || event.touches.length !== 2) return;
          const [a, b] = Array.from(event.touches);
          const distance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
          if (pinch.current.distance < 1) return;
          const initial = pinch.current.layout;
          const width = initial.width * distance / pinch.current.distance;
          setLayout(fit({ ...initial, width, x: initial.x + (initial.width - width) / 2,
            y: initial.y + (padHeight(initial.width) - padHeight(width)) / 2 }));
        }}
        onTouchEnd={(event) => {
          if (!pinch.current) return;
          suppressTapUntil.current = Date.now() + 500;
          if (event.touches.length === 0) {
            pinch.current = null;
            setPinching(false);
            save(layout);
          }
        }}
        onTouchCancel={() => {
          pinch.current = null;
          setPinching(false);
          suppressTapUntil.current = Date.now() + 500;
        }}
        onClickCapture={(event) => {
          if (pinch.current || Date.now() < suppressTapUntil.current) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
        className={`mobile-number-pad ${editing ? 'is-editing' : ''} ${pinching ? 'is-pinching' : ''}`} style={{ left: layout.x, top: layout.y, width: layout.width, visibility: ready ? 'visible' : 'hidden' }}>
        <button type="button" className={`mobile-pad-grip ${holding ? 'is-holding' : ''}`} aria-label="Hold for one second to move number pad"
          onPointerDown={(e) => begin(e)} onPointerMove={move} onPointerUp={finish} onPointerCancel={finish} onLostPointerCapture={finish}
          onContextMenu={(e) => e.preventDefault()}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setEditing(true); } }}>
          {editing ? 'Drag to move' : 'Pinch to resize · hold 1s to move'}
        </button>
        <div className="mobile-pad-grid" inert={editing}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => <button type="button" key={digit} disabled={!inputEnabled} aria-label={`Digit ${digit}`} onClick={() => onChange(answer + digit)}>{digit}</button>)}
          <button type="button" className="mobile-zero" disabled={!inputEnabled} aria-label="Digit 0" onClick={() => onChange(answer + '0')}>0</button>
          <button type="button" className="mobile-submit" aria-label="Submit answer" disabled={!submitEnabled || !/^-?\d+$/.test(answer)} onClick={onSubmit}>↵</button>
        </div>
        {editing && <div className="mobile-pad-editor">
          <button type="button" aria-label="Make number pad smaller" onClick={() => setLayout((value) => fit({ ...value, width: value.width - 16 }))}>− Size</button>
          <button type="button" aria-label="Make number pad larger" onClick={() => setLayout((value) => fit({ ...value, width: value.width + 16 }))}>+ Size</button>
          <button type="button" onClick={lock}>Done</button>
          <button type="button" aria-label="Reset number pad" onClick={() => { const b = root.current!.getBoundingClientRect(); setLayout(fit({ x: b.width - 180, y: b.height - padHeight(168) - 12, width: 168 })); }}>Reset</button>
          <button type="button" className="mobile-pad-resize" aria-label="Resize number pad" onPointerDown={(e) => begin(e, true)} onPointerMove={move} onPointerUp={finish} onPointerCancel={finish} onLostPointerCapture={finish}
            onKeyDown={(e) => { if (['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].includes(e.key)) { e.preventDefault(); setLayout(fit({ ...layout, width: layout.width + (['ArrowUp', 'ArrowRight'].includes(e.key) ? 12 : -12) })); } }}>Resize ↘</button>
        </div>}
      </div>
    </div>
  );
}
