'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Dumbbell, Swords, type LucideIcon } from 'lucide-react';
import { api, type MatchHistoryRow, type StatsResult } from '@/lib/api';
import { useDashboardUser } from '@/context/DashboardContext';
import { useT } from '@/i18n/I18nContext';
import { Avatar, Badge, Button, Card, CpuBadge, EmptyState, Spinner } from '@/components/ui';

export default function DashboardHome() {
  const user = useDashboardUser();
  const t = useT();
  const [rank, setRank] = useState<number | undefined>(undefined);
  const [stats, setStats] = useState<StatsResult | null>(null);
  const [statsError, setStatsError] = useState(false);

  useEffect(() => {
    function fetchData() {
      api.leaderboard(false).then((b) => setRank(b.self.rank)).catch(() => {});
      api.stats().then(setStats).catch(() => setStatsError(true));
    }
    fetchData();

    function handleVisible() {
      if (document.visibilityState === 'visible') fetchData();
    }
    document.addEventListener('visibilitychange', handleVisible);
    return () => document.removeEventListener('visibilitychange', handleVisible);
  }, []);

  const modes: { href: string; icon: LucideIcon; title: string; desc: string; glow: string }[] = [
    {
      href: '/dashboard/solo',
      icon: Dumbbell,
      title: t('nav.solo'),
      desc: t('home.soloDesc'),
      glow: 'rgba(195,168,230,0.18)',
    },
    {
      href: '/dashboard/matchmaking',
      icon: Swords,
      title: t('nav.versus'),
      desc: t('home.versusDesc'),
      glow: 'rgba(143,211,196,0.18)',
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Hero — who you are, with your headline numbers written up on the board. */}
      <Card className="relative flex flex-col gap-5 overflow-hidden p-6 sm:flex-row sm:items-center sm:gap-7">
        <span className="sf-bob shrink-0">
          <Avatar identity={user} size={96} />
        </span>
        <div className="flex flex-1 flex-col gap-4">
          <h1 className="text-4xl font-extrabold leading-none tracking-tight">{user.username}</h1>
          <div className="flex flex-wrap items-end gap-x-9 gap-y-3">
            <ChalkStat label={t('nav.leaderboard')} value={rank ? `#${rank}` : '—'} color="var(--sf-yellow)" />
            <ChalkStat label={t('common.aura')} value={user.auraPoints} color="var(--sf-purple)" />
            <ChalkStat
              label={t('stats.winRate')}
              value={stats ? `${Math.round(stats.pvpStats.winRate * 100)}%` : '—'}
              color="var(--sf-emerald)"
            />
            <ChalkStat label={t('stats.played')} value={stats ? stats.pvpStats.played : '—'} color="var(--sf-teal)" />
          </div>
          <Link href="/dashboard/settings" className="self-start">
            <Button variant="ghost" size="sm">{t('nav.settings')}</Button>
          </Link>
        </div>
        {/* chalk doodle accent, scribbled in the corner of the board */}
        <span
          aria-hidden
          className="pointer-events-none absolute right-6 top-5 hidden text-3xl sm:block"
          style={{ fontFamily: 'var(--font-chalk-display)', color: 'var(--sf-faint)', opacity: 0.5, transform: 'rotate(-8deg)' }}
        >
          ∑ⁿ
        </span>
      </Card>

      {/* The single place to start a game */}
      <div>
        <h2 className="mb-4 text-xl font-bold">{t('home.choose')}</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {modes.map((m) => {
            const Icon = m.icon;
            return (
              <Link key={m.href} href={m.href}>
                <Card hover className="flex h-full flex-col gap-3 p-8" style={{ boxShadow: `0 18px 40px -18px ${m.glow}` }}>
                  <Icon className="sf-wiggle" size={44} strokeWidth={1.75} style={{ color: 'var(--sf-yellow)' }} />
                  <h3 className="text-2xl font-extrabold">{m.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--sf-muted)' }}>{m.desc}</p>
                  <span className="mt-auto pt-3 text-base font-bold sf-gradient-text">{t('home.play')} →</span>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Your record — folded in from the old Record page so the home is the
          single hub for "who you are" and "how you're doing". */}
      <div>
        <h2 className="mb-4 text-xl font-bold">{t('stats.title')}</h2>

        {statsError ? (
          <Card className="p-6">
            <EmptyState title={t('stats.couldNotLoad')} hint={t('stats.tryAgainLater')} />
          </Card>
        ) : !stats ? (
          <Card className="flex items-center justify-center gap-3 p-10" style={{ color: 'var(--sf-muted)' }}>
            <Spinner /> {t('stats.loadingRecord')}
          </Card>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* CPU mastery */}
              <Card className="p-6">
                <h3 className="mb-4 text-lg font-bold">{t('stats.cpuDefeats')}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {stats.cpuDefeats.map((c) => (
                    <div
                      key={c.cpuKey}
                      className="flex flex-col items-center gap-1 rounded-xl p-4"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--sf-border)' }}
                    >
                      <CpuBadge cpuKey={c.cpuKey} size={44} />
                      <span className="mt-1 text-sm font-semibold">{c.displayName}</span>
                      <span className="text-2xl font-black sf-gradient-text">{c.wins}</span>
                      <Badge style={c.unlocked ? { color: 'var(--sf-emerald)' } : undefined}>
                        {c.unlocked ? t('stats.unlocked') : t('stats.locked')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recent PvP matches */}
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold">{t('stats.history')}</h3>
                  <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--sf-muted)' }}>
                    <span style={{ color: 'var(--sf-emerald)' }}>{stats.pvpStats.wins}W</span>
                    <span style={{ color: 'var(--sf-danger)' }}>{stats.pvpStats.losses}L</span>
                    <span style={{ color: 'var(--sf-warning)' }}>{stats.pvpStats.draws}D</span>
                  </div>
                </div>
                {stats.matchHistory.length === 0 ? (
                  <EmptyState
                    title={t('stats.noMatches')}
                    icon={<Swords size={30} strokeWidth={1.75} style={{ color: 'var(--sf-faint)' }} />}
                  />
                ) : (
                  <ul className="flex flex-col gap-2">
                    {stats.matchHistory.slice(0, 6).map((m) => (
                      <MatchRow key={m.matchNumber} match={m} />
                    ))}
                  </ul>
                )}
                {stats.dcCount > 0 && (
                  <p className="mt-4 text-xs" style={{ color: 'var(--sf-faint)' }}>
                    {t('stats.dcCount')}: <span style={{ color: 'var(--sf-danger)' }}>{stats.dcCount}</span>
                  </p>
                )}
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** A headline number written up on the board: chalk value with a colored
 *  underline, label beneath. */
function ChalkStat({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span
        className="pb-0.5 text-3xl font-extrabold leading-none"
        style={{ fontFamily: 'var(--font-chalk-display)', color, borderBottom: `2px solid ${color}` }}
      >
        {value}
      </span>
      <span className="text-xs tracking-wide" style={{ color: 'var(--sf-muted)' }}>{label}</span>
    </div>
  );
}

const RESULT_STYLE = {
  win:    { labelKey: 'stats.resultWin',    color: 'var(--sf-emerald)', bg: 'rgba(134,239,172,0.12)', accent: '#86efac' },
  loss:   { labelKey: 'stats.resultLoss',   color: 'var(--sf-danger)',  bg: 'rgba(252,165,165,0.12)', accent: '#fca5a5' },
  draw:   { labelKey: 'stats.resultDraw',   color: 'var(--sf-warning)', bg: 'rgba(253,224,71,0.10)',  accent: '#fde047' },
  voided: { labelKey: 'stats.resultVoided', color: 'var(--sf-faint)',   bg: 'rgba(255,255,255,0.04)', accent: 'rgba(255,255,255,0.18)' },
} as const;

function MatchRow({ match: m }: { match: MatchHistoryRow }) {
  const t = useT();
  const s = RESULT_STYLE[m.result];
  const date = new Date(m.playedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  return (
    <li
      className="flex items-center gap-3 rounded-xl px-4 py-3"
      style={{ background: s.bg, borderLeft: `3px solid ${s.accent}` }}
    >
      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
        <span className="text-lg font-bold leading-tight truncate">{m.opponent}</span>
        <span className="text-sm" style={{ color: 'var(--sf-muted)' }}>{t('common.vs')} — {date}</span>
      </div>
      <span
        className="shrink-0 rounded-lg px-3 py-1 text-sm font-black"
        style={{ color: s.color, background: 'rgba(0,0,0,0.25)' }}
      >
        {t(s.labelKey)}
      </span>
    </li>
  );
}
