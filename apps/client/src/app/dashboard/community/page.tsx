'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { api, type ChatMessage, type FriendView } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import { useDashboardUser } from '@/context/DashboardContext';
import { useT } from '@/i18n/I18nContext';
import { Avatar, Button, Card, EmptyState, OnlineDot, SectionTitle } from '@/components/ui';

const MAX_LEN = 280;

export default function CommunityPage() {
  const me = useDashboardUser();
  const t = useT();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [friends, setFriends] = useState<FriendView[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const socket = getSocket();
    if (!socket.connected) socket.connect();

    const onHistory = (msgs: ChatMessage[]) => setMessages(msgs);
    const onMessage = (msg: ChatMessage) => setMessages((prev) => [...prev, msg].slice(-50));
    const onError = (payload: { message: string }) => {
      setError(payload.message);
      window.setTimeout(() => setError(null), 3000);
    };

    socket.on('chat.history', onHistory);
    socket.on('chat.message', onMessage);
    socket.on('chat.error', onError);
    socket.emit('chat.history');

    return () => {
      socket.off('chat.history', onHistory);
      socket.off('chat.message', onMessage);
      socket.off('chat.error', onError);
    };
  }, []);

  useEffect(() => {
    api
      .friends()
      .then(setFriends)
      .catch(() => setFriends([]));
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  function send(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (trimmed.length === 0) return;
    const socket = getSocket();
    socket.emit('chat.send', { text: trimmed });
    setText('');
  }

  const onlineFriends = friends.filter((f) => f.online);

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle
        title={t('community.title')}
        action={
          <Link href="/dashboard/community/social">
            <Button variant="ghost" size="sm">
              👥 {t('community.friends')}
            </Button>
          </Link>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        {/* Chat — fills the available height under the top bar. */}
        <Card className="flex h-[calc(100svh-17rem)] min-h-[420px] flex-col p-0">
          <div className="border-b px-5 py-3 font-bold" style={{ borderColor: 'var(--sf-border)' }}>
            {t('community.chat')}
          </div>
          <div ref={scrollRef} className="sf-scroll flex-1 space-y-3 overflow-y-auto p-5">
            {messages.length === 0 ? (
              <EmptyState title={t('community.emptyChat')} icon="💬" />
            ) : (
              messages.map((m) => <ChatRow key={m.id} msg={m} mine={m.senderId === me.id} />)
            )}
          </div>
          <form
            onSubmit={send}
            className="flex items-center gap-2 border-t p-3"
            style={{ borderColor: 'var(--sf-border)' }}
          >
            <input
              className="sf-input"
              placeholder={t('community.sendMessage')}
              maxLength={MAX_LEN}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Button type="submit" disabled={text.trim().length === 0}>
              {t('community.send')}
            </Button>
          </form>
          <div
            className="flex items-center justify-between px-3 pb-2 text-xs"
            style={{ color: 'var(--sf-faint)' }}
          >
            <span>{error ?? ''}</span>
            <span>
              {text.length}/{MAX_LEN}
            </span>
          </div>
        </Card>

        {/* Online friends rail — matches the chat height, list scrolls. */}
        <Card className="flex flex-col p-5">
          <h3 className="mb-3 font-bold">
            {t('common.online')} · {onlineFriends.length}
          </h3>
          <div className="sf-scroll min-h-0 flex-1 overflow-y-auto">
            {onlineFriends.length === 0 ? (
              <EmptyState title={t('community.noFriends')} hint={t('community.noFriendsHint')} />
            ) : (
              <div className="flex flex-col gap-2">
                {onlineFriends.map((f) => (
                  <div key={f.id} className="flex items-center gap-2">
                    <Avatar identity={f} size={32} />
                    <span className="flex-1 truncate text-sm font-semibold">{f.username}</span>
                    <OnlineDot online />
                  </div>
                ))}
              </div>
            )}
          </div>
          <Link href="/dashboard/community/social" className="mt-auto pt-4">
            <Button variant="ghost" size="sm" className="w-full">
              {t('community.addFriend')}
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}

function ChatRow({ msg, mine }: { msg: ChatMessage; mine: boolean }) {
  return (
    <div className={`flex gap-3 ${mine ? 'flex-row-reverse text-right' : ''}`}>
      <Avatar identity={msg} size={32} />
      <div className={`max-w-[75%] ${mine ? 'items-end' : ''}`}>
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--sf-faint)' }}>
          <span className="font-semibold" style={{ color: 'var(--sf-muted)' }}>
            {msg.username}
          </span>
          <span>{msg.sentAtSgt}</span>
        </div>
        <div
          className="mt-1 inline-block rounded-2xl px-3 py-2 text-sm"
          style={{
            background: mine ? 'rgba(45,212,191,0.14)' : 'rgba(255,255,255,0.05)',
            border: '1px solid var(--sf-border)',
            wordBreak: 'break-word',
          }}
        >
          {msg.text}
        </div>
      </div>
    </div>
  );
}
