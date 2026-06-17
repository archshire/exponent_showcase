'use client';

import { useEffect, useState } from 'react';
import { api, type StatsResult } from '@/lib/api';
import { useT } from '@/i18n/I18nContext';
import { Badge, Card, EmptyState, PageLoader, SectionTitle } from '@/components/ui';

const CPU_EMOJI: Record<string, string> = {
  max: '👊',
  min: '🤏🏻',
  fury: '🔥',
  shi_eld: '🛡️',
};

export default function StatsPage() {
  const t = useT();
  const [stats, setStats] = useState<StatsResult | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.stats().then(setStats).catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <SectionTitle title={t('stats.title')} />
        <Card className="p-6">
          <EmptyState title="Could not load stats." hint="Please try again later." />
        </Card>
      </div>
    );
  }
  if (!stats) return <PageLoader />;

  const { cpuDefeats, cpuUnlockProgress, pvpStats, matchHistory, dcCount } = stats;

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle title={t('stats.title')} />

      {/* CPU defeat counts */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-bold">{t('stats.cpuDefeats')}</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {cpuDefeats.map((c) => (
            <div
              key={c.cpuKey}
              className="flex flex-col items-center gap-1 rounded-xl p-4"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--sf-border)' }}
            >
              <span className="text-3xl">{CPU_EMOJI[c.cpuKey] ?? '🤖'}</span>
              <span className="text-sm font-semibold">{c.displayName}</span>
              <span className="text-2xl font-black sf-gradient-text">{c.wins}</span>
              <Badge style={c.unlocked ? { color: 'var(--sf-emerald)' } : undefined}>
                {c.unlocked ? t('stats.unlocked') : t('stats.locked')}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* CPU unlock progress */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-bold">{t('stats.cpuProgress')}</h3>
        <div className="flex flex-col gap-4">
          {cpuUnlockProgress.map((p) => (
            <div key={p.cpuKey}>
              <div className="mb-1 flex items-center justify-between">
                <span className="font-semibold">
                  {CPU_EMOJI[p.cpuKey] ?? '🤖'} {p.cpuKey === 'shi_eld' ? 'Shi-eld' : p.cpuKey[0].toUpperCase() + p.cpuKey.slice(1)}
                </span>
                <Badge style={p.unlocked ? { color: 'var(--sf-emerald)' } : undefined}>
                  {p.unlocked ? t('stats.unlocked') : t('stats.locked')}
                </Badge>
              </div>
              <p className="mb-2 text-sm" style={{ color: 'var(--sf-muted)' }}>{p.description}</p>
              {!p.unlocked && p.requirements.length > 0 && (
                <div className="flex flex-wrap gap-4">
                  {p.requirements.map((r) => (
                    <div key={r.label} className="min-w-[140px] flex-1">
                      <div className="mb-1 flex justify-between text-xs" style={{ color: 'var(--sf-muted)' }}>
                        <span>{r.label}</span>
                        <span>{r.current}/{r.target}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${(r.current / r.target) * 100}%`, background: 'var(--sf-accent-grad)' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* PvP stats */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-bold">{t('stats.pvp')}</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <Stat label={t('stats.played')} value={pvpStats.played} />
          <Stat label={t('stats.wins')} value={pvpStats.wins} />
          <Stat label={t('stats.losses')} value={pvpStats.losses} />
          <Stat label={t('stats.draws')} value={pvpStats.draws} />
          <Stat label={t('stats.winRate')} value={`${Math.round(pvpStats.winRate * 100)}%`} />
        </div>
        <p className="mt-4 text-sm" style={{ color: 'var(--sf-muted)' }}>
          {t('stats.dcCount')}: <span style={{ color: 'var(--sf-danger)' }}>{dcCount}</span>
        </p>
      </Card>

      {/* Match history */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-bold">{t('stats.history')}</h3>
        {matchHistory.length === 0 ? (
          <EmptyState title={t('stats.noMatches')} icon="⚔️" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ color: 'var(--sf-faint)' }} className="text-left">
                  <th className="py-2 pr-4 font-semibold">#</th>
                  <th className="py-2 pr-4 font-semibold">{t('leaderboard.player')}</th>
                  <th className="py-2 pr-4 font-semibold">Type</th>
                  <th className="py-2 pr-4 font-semibold">Result</th>
                  <th className="py-2 font-semibold">Played</th>
                </tr>
              </thead>
              <tbody>
                {matchHistory.map((m) => (
                  <tr key={m.matchNumber} style={{ borderTop: '1px solid var(--sf-border)' }}>
                    <td className="py-2 pr-4" style={{ color: 'var(--sf-muted)' }}>{m.matchNumber}</td>
                    <td className="py-2 pr-4 font-semibold">{m.opponent}</td>
                    <td className="py-2 pr-4 capitalize" style={{ color: 'var(--sf-muted)' }}>{m.matchType}</td>
                    <td className="py-2 pr-4">
                      <ResultBadge result={m.result} />
                    </td>
                    <td className="py-2" style={{ color: 'var(--sf-muted)' }}>
                      {new Date(m.playedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--sf-border)' }}>
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs" style={{ color: 'var(--sf-muted)' }}>{label}</p>
    </div>
  );
}

function ResultBadge({ result }: { result: 'win' | 'loss' | 'draw' | 'voided' }) {
  const map = {
    win: { label: 'Win', color: 'var(--sf-emerald)' },
    loss: { label: 'Loss', color: 'var(--sf-danger)' },
    draw: { label: 'Draw', color: 'var(--sf-warning)' },
    voided: { label: 'Voided', color: 'var(--sf-faint)' },
  } as const;
  const { label, color } = map[result];
  return <span className="font-semibold" style={{ color }}>{label}</span>;
}
