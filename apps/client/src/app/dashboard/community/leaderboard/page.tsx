'use client';

import { useEffect, useState } from 'react';
import { api, type LeaderboardResult, type LeaderboardRow } from '@/lib/api';
import { useT } from '@/i18n/I18nContext';
import { Avatar, Card, EmptyState, OnlineDot, PageLoader, SectionTitle } from '@/components/ui';

export default function LeaderboardPage() {
  const t = useT();
  const [friendsOnly, setFriendsOnly] = useState(false);
  const [data, setData] = useState<LeaderboardResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .leaderboard(friendsOnly)
      .then((d) => active && setData(d))
      .catch(() => active && setData({ rows: [], self: null as unknown as LeaderboardRow }))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [friendsOnly]);

  const switchTab = (value: boolean) => {
    setLoading(true);
    setFriendsOnly(value);
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle
        title={t('leaderboard.title')}
        subtitle={t('leaderboard.subtitle')}
        action={
          <div className="flex gap-1 rounded-xl p-1" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--sf-border)' }}>
            <Tab active={!friendsOnly} onClick={() => switchTab(false)}>{t('leaderboard.all')}</Tab>
            <Tab active={friendsOnly} onClick={() => switchTab(true)}>{t('leaderboard.friends')}</Tab>
          </div>
        }
      />

      {/* Pinned self rank */}
      {data?.self && (
        <Card className="p-4" style={{ borderColor: 'var(--sf-border-strong)' }}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--sf-muted)' }}>
            {t('leaderboard.yourRank')}
          </p>
          <Row row={{ ...data.self, isSelf: true }} />
        </Card>
      )}

      <Card className="p-4">
        {loading ? (
          <PageLoader />
        ) : !data || data.rows.length === 0 ? (
          <EmptyState title="No ranked players yet." icon="🏆" hint="Play PvP matches to earn Aura." />
        ) : (
          <div className="flex flex-col">
            {data.rows.map((row) => (
              <Row key={row.id} row={row} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors"
      style={{
        color: active ? 'var(--sf-text)' : 'var(--sf-muted)',
        background: active ? 'var(--sf-accent-grad)' : 'transparent',
        WebkitTextFillColor: active ? '#04221d' : undefined,
      }}
    >
      {children}
    </button>
  );
}

function Row({ row }: { row: LeaderboardRow }) {
  const medal = row.rank === 1 ? '🥇' : row.rank === 2 ? '🥈' : row.rank === 3 ? '🥉' : null;
  return (
    <div
      className="flex items-center gap-3 rounded-xl px-3 py-2.5"
      style={row.isSelf ? { background: 'rgba(45,212,191,0.1)' } : undefined}
    >
      <span className="w-8 text-center font-bold" style={{ color: 'var(--sf-muted)' }}>
        {medal ?? row.rank}
      </span>
      <Avatar identity={row} size={36} />
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="truncate font-semibold">{row.username}</span>
        {row.isSelf && <span className="text-xs" style={{ color: 'var(--sf-teal)' }}>(you)</span>}
        <OnlineDot online={row.online} />
      </div>
      <span className="font-black sf-gradient-text">{row.auraPoints}</span>
    </div>
  );
}
