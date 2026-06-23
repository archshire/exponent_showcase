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
  const [featured, setFeatured] = useState<LeaderboardRow | null>(null);

  useEffect(() => {
    let active = true;
    api
      .leaderboard(friendsOnly)
      .then((d) => {
        if (!active) return;
        setData(d);
        setFeatured((prev) => prev ?? d.self ?? d.rows[0] ?? null);
      })
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

      <div className="flex gap-6 items-start">
        {/* Rankings list — 1/3 width */}
        <div style={{ width: '33.33%', flexShrink: 0 }}>
          <Card className="p-4">
            {loading ? (
              <PageLoader />
            ) : !data || data.rows.length === 0 ? (
              <EmptyState title="No ranked players yet." icon="🏆" hint="Play PvP matches to earn Aura." />
            ) : (
              <div className="flex flex-col gap-1">
                {data.rows.map((row) => (
                  <Row
                    key={row.id}
                    row={row}
                    isSelected={featured?.id === row.id}
                    onClick={() => setFeatured(row)}
                  />
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Featured player panel — 2/3 width */}
        <div style={{ flex: 1 }}>
          {featured ? (
            <FeaturedPanel row={featured} />
          ) : (
            <Card className="p-8 flex items-center justify-center" style={{ minHeight: 320 }}>
              <EmptyState title="Select a player" icon="👤" hint="Click a row to highlight a player." />
            </Card>
          )}
        </div>
      </div>
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

function Row({
  row,
  isSelected,
  onClick,
}: {
  row: LeaderboardRow;
  isSelected: boolean;
  onClick: () => void;
}) {
  const medal = row.rank === 1 ? '🥇' : row.rank === 2 ? '🥈' : row.rank === 3 ? '🥉' : null;
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-4 rounded-xl px-4 py-3 w-full text-left transition-colors"
      style={{
        background: isSelected
          ? 'rgba(45,212,191,0.14)'
          : row.isSelf
            ? 'rgba(45,212,191,0.06)'
            : undefined,
        border: isSelected ? '1px solid rgba(45,212,191,0.4)' : '1px solid transparent',
        cursor: 'pointer',
      }}
    >
      <span className="shrink-0 text-center font-black" style={{ color: 'var(--sf-muted)', fontSize: '1.5rem', minWidth: '2.5rem' }}>
        {medal ?? `#${row.rank}`}
      </span>
      <div className="flex items-center gap-3 min-w-0">
        <Avatar identity={row} size={56} />
        <div className="flex flex-col gap-0.5 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold leading-tight truncate" style={{ fontSize: '1.25rem' }}>{row.username}</span>
            {row.isSelf && <span className="text-sm font-semibold shrink-0" style={{ color: 'var(--sf-teal)' }}>(you)</span>}
            <OnlineDot online={row.online} />
          </div>
          <span className="font-black sf-gradient-text leading-tight" style={{ fontSize: '1rem' }}>
            {row.auraPoints.toLocaleString()} aura
          </span>
        </div>
      </div>
    </button>
  );
}

function FeaturedPanel({ row }: { row: LeaderboardRow }) {
  const medal = row.rank === 1 ? '🥇' : row.rank === 2 ? '🥈' : row.rank === 3 ? '🥉' : null;
  return (
    <Card
      className="flex flex-col items-center justify-center gap-6 p-8"
      style={{
        minHeight: 420,
        background: row.isSelf ? 'rgba(45,212,191,0.06)' : undefined,
        borderColor: row.isSelf ? 'rgba(45,212,191,0.3)' : undefined,
      }}
    >
      <Avatar identity={row} size={240} className="shrink-0" />
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-2">
          <span className="font-black" style={{ fontSize: '2.5rem', color: 'var(--sf-text)' }}>{row.username}</span>
          {row.isSelf && <span className="text-base font-semibold" style={{ color: 'var(--sf-teal)' }}>(you)</span>}
          <OnlineDot online={row.online} />
        </div>
        <span className="font-black" style={{ fontSize: '3rem', lineHeight: 1 }}>
          {medal ?? <span style={{ color: 'var(--sf-muted)' }}>#{row.rank}</span>}
        </span>
        <span className="font-black sf-gradient-text" style={{ fontSize: '2rem' }}>
          {row.auraPoints.toLocaleString()} aura
        </span>
      </div>
    </Card>
  );
}
