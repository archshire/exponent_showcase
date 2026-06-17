'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { disconnectSocket } from '@/lib/socket';
import { useDashboardUser } from '@/context/DashboardContext';
import { useT } from '@/i18n/I18nContext';
import { Avatar } from '@/components/ui';
import type { TranslationKey } from '@/i18n/translations';

interface NavItem {
  href: string;
  labelKey: TranslationKey;
  icon: string;
  exact?: boolean;
}

const NAV: NavItem[] = [
  { href: '/dashboard', labelKey: 'nav.home', icon: '🏠', exact: true },
  { href: '/dashboard/solo', labelKey: 'nav.solo', icon: '🤖' },
  { href: '/dashboard/matchmaking', labelKey: 'nav.versus', icon: '⚔️' },
  { href: '/dashboard/community', labelKey: 'nav.community', icon: '💬' },
  { href: '/dashboard/community/leaderboard', labelKey: 'nav.leaderboard', icon: '🏆' },
  { href: '/dashboard/stats', labelKey: 'nav.stats', icon: '📊' },
  { href: '/dashboard/profile', labelKey: 'nav.profile', icon: '🪪' },
  { href: '/dashboard/settings', labelKey: 'nav.settings', icon: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useDashboardUser();
  const t = useT();

  const isActive = (item: NavItem) =>
    item.exact
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(`${item.href}/`);

  async function handleLogout() {
    try {
      await api.logout();
    } catch {
      /* ignore network errors on logout */
    }
    localStorage.removeItem('token');
    disconnectSocket();
    router.replace('/auth');
  }

  return (
    <aside
      className="flex h-screen w-64 flex-col gap-2 p-4"
      style={{ borderRight: '1px solid var(--sf-border)' }}
    >
      <Link href="/dashboard" className="mb-4 flex items-center gap-2 px-2 py-1">
        <span className="text-2xl">🜂</span>
        <span className="text-xl font-extrabold tracking-tight">
          Sky<span className="sf-gradient-text">Forge</span>
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors"
              style={{
                color: active ? 'var(--sf-text)' : 'var(--sf-muted)',
                background: active ? 'rgba(45,212,191,0.12)' : 'transparent',
                border: active ? '1px solid var(--sf-border-strong)' : '1px solid transparent',
              }}
            >
              <span className="text-lg">{item.icon}</span>
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

        <Link href="/dashboard/profile" className="flex items-center gap-3 rounded-xl p-2 sf-card">
          <Avatar identity={user} size={36} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{user.username}</p>
            <p className="text-xs" style={{ color: 'var(--sf-teal)' }}>
              {user.auraPoints} {t('common.aura')}
            </p>
          </div>
        </Link>

        <button onClick={handleLogout} className="sf-btn sf-btn-ghost w-full">
          {t('nav.logout')}
        </button>
      </div>
    </aside>
  );
}
