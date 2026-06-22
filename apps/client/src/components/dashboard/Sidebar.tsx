'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  MessagesSquare,
  Trophy,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import { api } from '@/lib/api';
import { disconnectSocket } from '@/lib/socket';
import { useDashboardUser } from '@/context/DashboardContext';
import { useT } from '@/i18n/I18nContext';
import { AbacusIcon, Avatar } from '@/components/ui';
import type { TranslationKey } from '@/i18n/translations';

interface NavItem {
  href: string;
  labelKey: TranslationKey;
  icon: LucideIcon;
  exact?: boolean;
}

// Play modes (Practice / Arena) launch from the Home hub, and your record now
// lives on Home too — so the sidebar is sections only, each with one entry point.
const NAV: NavItem[] = [
  { href: '/dashboard', labelKey: 'nav.home', icon: Home, exact: true },
  { href: '/dashboard/community', labelKey: 'nav.community', icon: MessagesSquare },
  { href: '/dashboard/community/leaderboard', labelKey: 'nav.leaderboard', icon: Trophy },
  { href: '/dashboard/settings', labelKey: 'nav.settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const user = useDashboardUser();
  const t = useT();
  const [loggingOut, setLoggingOut] = useState(false);

  const matchesPath = (item: NavItem) =>
    item.exact
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(`${item.href}/`);

  // Only the most specific match is active, so e.g. /dashboard/community/leaderboard
  // highlights Leaderboard, not also its parent Community.
  const activeHref = NAV.filter(matchesPath).sort((a, b) => b.href.length - a.href.length)[0]?.href;
  const isActive = (item: NavItem) => item.href === activeHref;

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await api.logout();
    } catch {
      /* ignore network errors on logout */
    }
    localStorage.removeItem('token');
    disconnectSocket();
    // Hard navigation: fully tears down the SPA (React state, socket, the
    // fixed-position doodle backdrop) and loads /auth fresh, avoiding the
    // flicker a soft client transition produces between the two shells.
    window.location.assign('/auth');
  }

  return (
    <aside
      className="flex h-screen w-64 flex-col gap-2 p-4"
      style={{ borderRight: '1px solid var(--sf-border)' }}
    >
      <Link href="/dashboard" className="mb-4 flex items-center gap-2 px-2 py-1">
        <AbacusIcon size={24} className="sf-bob" style={{ color: 'var(--sf-yellow)' }} />
        <span className="text-xl font-extrabold tracking-tight">
          Ex<span className="sf-gradient-text">ponent</span>
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-base transition-colors"
              style={{
                color: active ? 'var(--sf-yellow)' : 'var(--sf-muted)',
                background: active ? 'rgba(243,213,107,0.12)' : 'transparent',
                border: active ? '2px solid var(--sf-yellow)' : '2px solid transparent',
                textShadow: active ? '0 0 8px rgba(243,213,107,0.4)' : 'none',
              }}
            >
              <Icon size={20} strokeWidth={2} />
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-3">
        <div
          className="flex items-center justify-between gap-2 text-xs"
          style={{ color: 'var(--sf-faint)' }}
        >
          <Link href="/privacy" className="hover:underline">{t('legal.privacy')}</Link>
          <Link href="/terms" className="hover:underline">{t('legal.terms')}</Link>
        </div>

        <Link href="/dashboard/settings" className="flex items-center gap-3 rounded-xl p-2 sf-card">
          <Avatar identity={user} size={36} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{user.username}</p>
            <p className="text-xs" style={{ color: 'var(--sf-teal)' }}>
              {user.auraPoints} {t('common.aura')}
            </p>
          </div>
        </Link>

        <button onClick={handleLogout} disabled={loggingOut} className="sf-btn sf-btn-ghost w-full">
          {loggingOut ? <span className="sf-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : t('nav.logout')}
        </button>
      </div>
    </aside>
  );
}
