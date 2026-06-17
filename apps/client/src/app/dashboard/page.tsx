'use client';

import Link from 'next/link';
import { useDashboardUser } from '@/context/DashboardContext';
import { useT } from '@/i18n/I18nContext';
import { Avatar, Card } from '@/components/ui';

export default function DashboardHome() {
  const user = useDashboardUser();
  const t = useT();

  const modes = [
    {
      href: '/dashboard/solo',
      icon: '🤖',
      title: t('nav.solo'),
      desc: t('home.soloDesc'),
    },
    {
      href: '/dashboard/matchmaking',
      icon: '⚔️',
      title: t('nav.versus'),
      desc: t('home.versusDesc'),
    },
    {
      href: '/dashboard/community',
      icon: '💬',
      title: t('nav.community'),
      desc: t('home.communityDesc'),
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <Card className="flex flex-wrap items-center justify-between gap-4 p-6">
        <div className="flex items-center gap-4">
          <Avatar identity={user} size={64} />
          <div>
            <p className="text-sm" style={{ color: 'var(--sf-muted)' }}>
              {t('home.welcome')}
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight">{user.username}</h1>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm" style={{ color: 'var(--sf-muted)' }}>{t('common.aura')}</p>
          <p className="text-4xl font-black sf-gradient-text">{user.auraPoints}</p>
        </div>
      </Card>

      <div>
        <h2 className="mb-4 text-xl font-bold">{t('home.choose')}</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {modes.map((m) => (
            <Link key={m.href} href={m.href}>
              <Card hover className="flex h-full flex-col gap-3 p-6">
                <span className="text-4xl">{m.icon}</span>
                <h3 className="text-lg font-bold">{m.title}</h3>
                <p className="text-sm" style={{ color: 'var(--sf-muted)' }}>{m.desc}</p>
                <span className="mt-auto pt-2 text-sm font-semibold" style={{ color: 'var(--sf-teal)' }}>
                  {t('home.play')} →
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
