'use client';

import React from 'react';
import {
  UserRound,
  Bot,
  Clock,
  ArrowDownToLine,
  ArrowUpToLine,
  Flame,
  ShieldHalf,
  type LucideIcon,
} from 'lucide-react';
import { assetUrl, type PlayerIdentity } from '@/lib/api';

// --- Button ----------------------------------------------------------------
type ButtonVariant = 'primary' | 'ghost' | 'danger';
export function Button({
  variant = 'primary',
  size,
  loading,
  className = '',
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: 'sm';
  loading?: boolean;
}) {
  const variantClass =
    variant === 'primary'
      ? 'sf-btn-primary'
      : variant === 'danger'
        ? 'sf-btn-danger'
        : 'sf-btn-ghost';
  return (
    <button
      className={`sf-btn ${variantClass} ${size === 'sm' ? 'sf-btn-sm' : ''} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="sf-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
      ) : (
        children
      )}
    </button>
  );
}

// --- Card ------------------------------------------------------------------
export function Card({
  className = '',
  hover,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { hover?: boolean }) {
  return (
    <div className={`sf-card ${hover ? 'sf-card-hover' : ''} ${className}`} {...props}>
      {children}
    </div>
  );
}

// --- TextField -------------------------------------------------------------
export function TextField({
  label,
  error,
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }) {
  return (
    <div className={className}>
      {label && <label className="sf-label">{label}</label>}
      <input className="sf-input" {...props} />
      {error && (
        <p className="mt-1 text-sm" style={{ color: 'var(--sf-danger)' }}>
          {error}
        </p>
      )}
    </div>
  );
}

// --- Avatar ----------------------------------------------------------------
export function Avatar({
  identity,
  size = 40,
  className = '',
}: {
  identity: Pick<PlayerIdentity, 'username' | 'profilePictureUrl'> | null;
  size?: number;
  className?: string;
}) {
  const url = assetUrl(identity?.profilePictureUrl);
  const initial = (identity?.username?.[0] ?? '?').toUpperCase();
  return (
    <span
      className={`sf-avatar ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={identity?.username ?? ''}
          width={size}
          height={size}
          style={{ width: size, height: size, objectFit: 'cover' }}
        />
      ) : (
        initial
      )}
    </span>
  );
}

// --- Online dot ------------------------------------------------------------
export function OnlineDot({ online }: { online: boolean }) {
  return <span className={`sf-dot ${online ? 'sf-dot-online' : 'sf-dot-offline'}`} />;
}

// --- Badge -----------------------------------------------------------------
export function Badge({
  children,
  className = '',
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span className={`sf-badge ${className}`} style={style}>
      {children}
    </span>
  );
}

// --- Spinner / loaders -----------------------------------------------------
export function Spinner() {
  return <span className="sf-spinner" />;
}

export function PageLoader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-24"
      style={{ color: 'var(--sf-muted)' }}
    >
      <Spinner />
      <span>{label}</span>
    </div>
  );
}

// --- Empty state -----------------------------------------------------------
export function EmptyState({
  icon,
  title,
  hint,
}: {
  icon?: React.ReactNode;
  title: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      {icon && <div className="text-4xl opacity-70">{icon}</div>}
      <p className="font-semibold" style={{ color: 'var(--sf-text)' }}>
        {title}
      </p>
      {hint && (
        <p className="text-sm" style={{ color: 'var(--sf-muted)' }}>
          {hint}
        </p>
      )}
    </div>
  );
}

// --- Section title ---------------------------------------------------------
export function SectionTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-sm" style={{ color: 'var(--sf-muted)' }}>
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

// --- Chalk-equation doodles (decorative backdrop) --------------------------
// Scribbled like working-out left on the board, in assorted chalk colors.
const DOODLES = [
  {
    c: '7 + 5 = 12',
    top: '11%',
    left: '6%',
    size: 34,
    color: 'var(--sf-yellow)',
    rot: -6,
    delay: '0s',
  },
  {
    c: 'a² + b² = c²',
    top: '72%',
    left: '4%',
    size: 32,
    color: 'var(--sf-sky)',
    rot: 4,
    delay: '1.2s',
  },
  {
    c: '√144 = 12',
    top: '20%',
    left: '82%',
    size: 32,
    color: 'var(--sf-pink)',
    rot: 5,
    delay: '0.6s',
  },
  {
    c: 'π ≈ 3.14',
    top: '80%',
    left: '80%',
    size: 36,
    color: 'var(--sf-teal)',
    rot: -4,
    delay: '2s',
  },
  {
    c: '∑ⁿ',
    top: '44%',
    left: '92%',
    size: 44,
    color: 'var(--sf-emerald)',
    rot: -8,
    delay: '1.6s',
  },
  {
    c: '9 × 8 = 72',
    top: '50%',
    left: '2%',
    size: 30,
    color: 'var(--sf-purple)',
    rot: 6,
    delay: '0.3s',
  },
  { c: '÷', top: '6%', left: '50%', size: 56, color: 'var(--sf-pink)', rot: -10, delay: '2.4s' },
  {
    c: '½ + ¼',
    top: '90%',
    left: '44%',
    size: 34,
    color: 'var(--sf-yellow)',
    rot: 3,
    delay: '0.9s',
  },
];

export function MathDoodles() {
  return (
    <div className="sf-doodles" aria-hidden>
      {DOODLES.map((d, i) => (
        <span
          key={i}
          className="sf-doodle"
          style={{
            top: d.top,
            left: d.left,
            fontSize: d.size,
            color: d.color,
            transform: `rotate(${d.rot}deg)`,
            animationDelay: d.delay,
          }}
        >
          {d.c}
        </span>
      ))}
    </div>
  );
}

// --- Abacus brand icon (Lucide has none) -----------------------------------
export function AbacusIcon({
  size = 24,
  className = '',
  style,
}: {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden
    >
      <rect x="3" y="3.5" width="18" height="17" rx="1.6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="7.5" y1="3.5" x2="7.5" y2="20.5" />
      <line x1="12" y1="3.5" x2="12" y2="20.5" />
      <line x1="16.5" y1="3.5" x2="16.5" y2="20.5" />
      <circle cx="7.5" cy="7" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="6" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="7.4" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="7.5" cy="14" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="17" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="13.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

// --- CPU rivals ------------------------------------------------------------
// One source of truth for the four CPU characters. Icons are chosen to read as
// the character AND the math theme: Min = floor (down-to-line), Max = ceiling
// (up-to-line), Fury = flame, Shi-eld = shield. Used on Home and Practice.
export const CPU_META: Record<
  string,
  { name: string; tagline: string; icon: LucideIcon; color: string }
> = {
  min: {
    name: 'Min',
    tagline: 'Vanilla fighter — steady constant damage.',
    icon: ArrowDownToLine,
    color: 'var(--sf-sky)',
  },
  max: {
    name: 'Max',
    tagline: 'Streak fighter — builds momentum fast.',
    icon: ArrowUpToLine,
    color: 'var(--sf-emerald)',
  },
  fury: {
    name: 'Fury',
    tagline: 'Avenge fighter — revenge-forward aggression.',
    icon: Flame,
    color: 'var(--sf-pink)',
  },
  shi_eld: {
    name: 'Shi-eld',
    tagline: 'Block specialist — punishes your attacks.',
    icon: ShieldHalf,
    color: 'var(--sf-purple)',
  },
};

export function CpuBadge({ cpuKey, size = 52 }: { cpuKey: string; size?: number }) {
  const meta = CPU_META[cpuKey];
  const Icon = meta?.icon ?? Bot;
  const color = meta?.color ?? 'var(--sf-muted)';
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-2xl"
      style={{
        width: size,
        height: size,
        color,
        border: `2px solid ${color}`,
        background: 'rgba(255,255,255,0.03)',
      }}
    >
      <Icon size={Math.round(size * 0.48)} strokeWidth={1.9} />
    </span>
  );
}

// --- 42 School logo --------------------------------------------------------
export function FortyTwoIcon({
  size = 20,
  className = '',
  style,
}: {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={(size * 629) / 896}
      viewBox="32 -51 896 629"
      fill="currentColor"
      className={className}
      style={style}
      aria-hidden
    >
      <polygon points="32,412.6 362.1,412.6 362.1,578 526.8,578 526.8,279.1 197.3,279.1 526.8,-51.1 362.1,-51.1 32,279.1" />
      <polygon points="597.9,114.2 762.7,-51.1 597.9,-51.1" />
      <polygon points="762.7,114.2 597.9,279.1 597.9,443.9 762.7,443.9 762.7,279.1 928,114.2 928,-51.1 762.7,-51.1" />
      <polygon points="928,279.1 762.7,443.9 928,443.9" />
    </svg>
  );
}

// --- Auth hero: brand + a chalk "live duel" preview ------------------------
function HpBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div
      className="h-2.5 w-full overflow-hidden rounded-full"
      style={{ background: 'rgba(0,0,0,0.28)', border: '1px solid var(--sf-border)' }}
    >
      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function FighterChip({ icon, accent }: { icon: React.ReactNode; accent: string }) {
  return (
    <span
      className="flex items-center justify-center rounded-full"
      style={{ width: 38, height: 38, border: `2px solid ${accent}`, color: accent }}
    >
      {icon}
    </span>
  );
}

export function AuthHero() {
  return (
    <div className="hidden flex-col gap-7 sf-fade-up lg:flex">
      <div className="flex items-center gap-3">
        <AbacusIcon size={46} className="sf-bob" style={{ color: 'var(--sf-yellow)' }} />
        <span className="text-5xl font-extrabold tracking-tight">
          Ex<span className="sf-gradient-text">ponent</span>
        </span>
      </div>
      <h2 className="text-3xl font-bold leading-tight">
        Outsmart your <span style={{ color: 'var(--sf-yellow)' }}>opponent</span>.
      </h2>

      {/* Frameless duel sketch — drawn straight on the board, no panel. */}
      <div className="flex flex-col gap-5 pr-6">
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-2" style={{ width: '42%' }}>
            <div className="flex items-center gap-2">
              <FighterChip icon={<UserRound size={20} />} accent="var(--sf-emerald)" />
              <span className="text-sm font-bold">YOU</span>
            </div>
            <HpBar pct={100} color="var(--sf-emerald)" />
          </div>
          <span className="pb-1 text-lg font-extrabold" style={{ color: 'var(--sf-faint)' }}>
            vs
          </span>
          <div className="flex flex-col items-end gap-2" style={{ width: '42%' }}>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">RIVAL</span>
              <FighterChip icon={<Bot size={20} />} accent="var(--sf-pink)" />
            </div>
            <HpBar pct={62} color="var(--sf-pink)" />
          </div>
        </div>

        <p
          className="mt-1 text-6xl font-extrabold"
          style={{ fontFamily: 'var(--font-chalk-display)' }}
        >
          7 + 5 ={' '}
          <span
            style={{
              color: 'var(--sf-yellow)',
              borderBottom: '3px solid var(--sf-yellow)',
              padding: '0 10px',
            }}
          >
            ?
          </span>
        </p>

        <p className="inline-flex items-center gap-2 text-sm" style={{ color: 'var(--sf-muted)' }}>
          <Clock size={15} /> Round 1 · first to empty the bar wins
        </p>
      </div>
    </div>
  );
}

// --- Toast (lightweight inline notice) -------------------------------------
export function Notice({
  kind = 'info',
  children,
}: {
  kind?: 'info' | 'success' | 'error';
  children: React.ReactNode;
}) {
  const color =
    kind === 'error'
      ? 'var(--sf-danger)'
      : kind === 'success'
        ? 'var(--sf-emerald)'
        : 'var(--sf-muted)';
  const bg =
    kind === 'error'
      ? 'rgba(251,113,133,0.1)'
      : kind === 'success'
        ? 'rgba(52,211,153,0.1)'
        : 'rgba(255,255,255,0.04)';
  return (
    <div
      className="rounded-xl px-4 py-3 text-sm"
      style={{ color, background: bg, border: `1px solid ${color}33` }}
    >
      {children}
    </div>
  );
}
