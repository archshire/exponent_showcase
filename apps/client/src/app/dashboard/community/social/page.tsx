'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { api, ApiError, type FriendView, type SearchResult } from '@/lib/api';
import { useT } from '@/i18n/I18nContext';
import { Avatar, Button, Card, EmptyState, Notice, OnlineDot, SectionTitle } from '@/components/ui';

export default function SocialPage() {
  const t = useT();
  const [friends, setFriends] = useState<FriendView[]>([]);
  const [requests, setRequests] = useState<FriendView[]>([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [notice, setNotice] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);
  const debounce = useRef<number | null>(null);

  const flash = (kind: 'success' | 'error', text: string) => {
    setNotice({ kind, text });
    window.setTimeout(() => setNotice(null), 3500);
  };

  const refresh = useCallback(async () => {
    const [f, r] = await Promise.all([api.friends(), api.friendRequests()]);
    setFriends(f);
    setRequests(r);
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all([api.friends(), api.friendRequests()])
      .then(([f, r]) => {
        if (!active) return;
        setFriends(f);
        setRequests(r);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // debounced search (state updates happen inside the timeout, never
  // synchronously within the effect body)
  useEffect(() => {
    if (debounce.current) window.clearTimeout(debounce.current);
    const q = query.trim();
    debounce.current = window.setTimeout(async () => {
      if (q.length === 0) {
        setResults([]);
        setSearching(false);
        return;
      }
      setSearching(true);
      try {
        setResults(await api.searchPlayers(q));
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => {
      if (debounce.current) window.clearTimeout(debounce.current);
    };
  }, [query]);

  async function add(targetId: string) {
    try {
      await api.sendFriendRequest(targetId);
      flash('success', t('community.requestSent'));
      setResults((prev) =>
        prev.map((r) => (r.id === targetId ? { ...r, relationship: 'request_sent' } : r))
      );
    } catch (err) {
      flash('error', err instanceof ApiError ? err.message : t('community.failedRequest'));
    }
  }

  async function accept(id: string) {
    try {
      await api.acceptFriend(id);
      await refresh();
    } catch (err) {
      flash('error', err instanceof ApiError ? err.message : t('common.failed'));
    }
  }
  async function decline(id: string) {
    try {
      await api.declineFriend(id);
      await refresh();
    } catch (err) {
      flash('error', err instanceof ApiError ? err.message : t('common.failed'));
    }
  }
  async function remove(id: string) {
    try {
      await api.removeFriend(id);
      await refresh();
    } catch (err) {
      flash('error', err instanceof ApiError ? err.message : t('common.failed'));
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle
        title={t('community.friends')}
        action={
          <Link href="/dashboard/community">
            <Button variant="ghost" size="sm">
              💬 {t('community.chat')}
            </Button>
          </Link>
        }
      />

      {notice && <Notice kind={notice.kind}>{notice.text}</Notice>}

      {/* Search / Add */}
      <Card className="p-6">
        <h3 className="mb-3 font-bold">{t('community.addFriend')}</h3>
        <input
          className="sf-input"
          placeholder={t('community.searchPlayers')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query.trim().length > 0 && (
          <div className="mt-3 flex flex-col gap-2">
            {searching && (
              <p className="text-sm" style={{ color: 'var(--sf-muted)' }}>
                {t('common.loading')}
              </p>
            )}
            {!searching && results.length === 0 && (
              <p className="text-sm" style={{ color: 'var(--sf-muted)' }}>
                {t('community.noPlayersFound')}
              </p>
            )}
            {results.map((r) => (
              <PlayerRow key={r.id} player={r}>
                {r.relationship === 'friends' ? (
                  <span className="text-sm" style={{ color: 'var(--sf-emerald)' }}>
                    ✓ {t('community.alreadyFriends')}
                  </span>
                ) : r.relationship === 'request_sent' ? (
                  <span className="text-sm" style={{ color: 'var(--sf-muted)' }}>
                    {t('community.requestSent')}
                  </span>
                ) : r.relationship === 'request_received' ? (
                  <Button size="sm" onClick={() => accept(r.id)}>
                    {t('community.accept')}
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => add(r.id)}>
                    {t('community.addFriend')}
                  </Button>
                )}
              </PlayerRow>
            ))}
          </div>
        )}
      </Card>

      {/* Incoming requests */}
      <Card className="p-6">
        <h3 className="mb-3 font-bold">
          {t('community.requests')} · {requests.length}
        </h3>
        {requests.length === 0 ? (
          <EmptyState title={t('community.noRequests')} icon="📭" />
        ) : (
          <div className="flex flex-col gap-2">
            {requests.map((r) => (
              <PlayerRow key={r.id} player={r}>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => accept(r.id)}>
                    {t('community.accept')}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => decline(r.id)}>
                    {t('community.decline')}
                  </Button>
                </div>
              </PlayerRow>
            ))}
          </div>
        )}
      </Card>

      {/* Friends list */}
      <Card className="p-6">
        <h3 className="mb-3 font-bold">
          {t('community.friends')} · {friends.length}
        </h3>
        {friends.length === 0 ? (
          <EmptyState
            title={t('community.noFriends')}
            icon="🫂"
            hint={t('community.addFriendsHint')}
          />
        ) : (
          <div className="flex flex-col gap-2">
            {friends.map((f) => (
              <PlayerRow key={f.id} player={f}>
                <Button size="sm" variant="danger" onClick={() => remove(f.id)}>
                  {t('community.remove')}
                </Button>
              </PlayerRow>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function PlayerRow({ player, children }: { player: FriendView; children: React.ReactNode }) {
  const t = useT();
  return (
    <div
      className="flex items-center gap-3 rounded-xl p-3"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--sf-border)' }}
    >
      <Avatar identity={player} size={40} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-semibold">{player.username}</span>
          <OnlineDot online={player.online} />
        </div>
        <span className="text-xs" style={{ color: 'var(--sf-teal)' }}>
          {player.auraPoints} {t('common.aura')}
        </span>
      </div>
      {children}
    </div>
  );
}
