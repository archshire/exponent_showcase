'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MessagesSquare, Trophy, Settings, type LucideIcon } from 'lucide-react';
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
// lives on Home too — so the nav is sections only, each with one entry point.
const NAV: NavItem[] = [
  { href: '/dashboard', labelKey: 'nav.home', icon: Home, exact: true },
  { href: '/dashboard/community', labelKey: 'nav.community', icon: MessagesSquare },
  { href: '/dashboard/community/leaderboard', labelKey: 'nav.leaderboard', icon: Trophy },
  { href: '/dashboard/settings', labelKey: 'nav.settings', icon: Settings },
];

export default function Topbar() {
  const pathname = usePathname();
  const user = useDashboardUser();
  const t = useT();
  const [loggingOut, setLoggingOut] = useState(false);

  const matchesPath = (item: NavItem) =>
    item.exact
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(`${item.href}/`);

  // Only the most specific match is active, so e.g. /dashboard/community/leaderboard
  // highlights Rankings, not also its parent Community.
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
    disconnectSocket();
    // Hard navigation: fully tears down the SPA (React state, socket, the
    // fixed-position doodle backdrop) and loads /auth fresh, avoiding the
    // flicker a soft client transition produces between the two shells.
    window.location.assign('/auth');
  }

  return (
    <header
      className="flex h-16 shrink-0 items-center gap-3 px-4 sm:px-6"
      style={{ borderBottom: '1px solid var(--sf-border)' }}
    >
      <Link href="/dashboard" className="flex items-center gap-2">
        <AbacusIcon size={24} className="sf-bob" style={{ color: 'var(--sf-yellow)' }} />
        <span className="hidden text-xl font-extrabold tracking-tight sm:inline">
          Ex<span className="sf-gradient-text">ponent</span>
        </span>
      </Link>

      <nav className="ml-1 flex items-center gap-1 sm:ml-3">
        {NAV.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={t(item.labelKey)}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors"
              style={{
                color: active ? 'var(--sf-yellow)' : 'var(--sf-muted)',
                background: active ? 'rgba(243,213,107,0.12)' : 'transparent',
                border: active ? '2px solid var(--sf-yellow)' : '2px solid transparent',
                textShadow: active ? '0 0 8px rgba(243,213,107,0.4)' : 'none',
              }}
            >
              <Icon size={18} strokeWidth={2} />
              <span className="hidden md:inline">{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </nav>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-2 rounded-xl p-1.5 pr-3 sf-card"
        >
          <Avatar identity={user} size={32} />
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-sm font-semibold leading-tight">{user.username}</p>
            <p className="text-xs leading-tight" style={{ color: 'var(--sf-teal)' }}>
              {user.auraPoints} {t('common.aura')}
            </p>
          </div>
        </Link>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="sf-btn sf-btn-ghost sf-btn-sm"
        >
          {loggingOut ? (
            <span className="sf-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
          ) : (
            t('nav.logout')
          )}
        </button>
      </div>
    </header>
  );
}
