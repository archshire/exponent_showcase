'use client';

import React from 'react';
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
    variant === 'primary' ? 'sf-btn-primary' : variant === 'danger' ? 'sf-btn-danger' : 'sf-btn-ghost';
  return (
    <button
      className={`sf-btn ${variantClass} ${size === 'sm' ? 'sf-btn-sm' : ''} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <span className="sf-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : children}
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
      {error && <p className="mt-1 text-sm" style={{ color: 'var(--sf-danger)' }}>{error}</p>}
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
        <img src={url} alt={identity?.username ?? ''} width={size} height={size} style={{ width: size, height: size, objectFit: 'cover' }} />
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
    <div className="flex flex-col items-center justify-center gap-3 py-24" style={{ color: 'var(--sf-muted)' }}>
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
      <p className="font-semibold" style={{ color: 'var(--sf-text)' }}>{title}</p>
      {hint && <p className="text-sm" style={{ color: 'var(--sf-muted)' }}>{hint}</p>}
    </div>
  );
}

// --- Modal -----------------------------------------------------------------
export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = 460,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: number;
}) {
  if (!open) return null;
  return (
    <div className="sf-modal-backdrop" onClick={onClose}>
      <Card
        className="w-full p-6 sf-fade-up"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h3 className="mb-4 text-xl font-bold">{title}</h3>}
        {children}
      </Card>
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
        {subtitle && <p className="mt-1 text-sm" style={{ color: 'var(--sf-muted)' }}>{subtitle}</p>}
      </div>
      {action}
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
    kind === 'error' ? 'var(--sf-danger)' : kind === 'success' ? 'var(--sf-emerald)' : 'var(--sf-muted)';
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
