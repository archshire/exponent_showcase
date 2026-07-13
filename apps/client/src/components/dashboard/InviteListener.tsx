'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Swords } from 'lucide-react';
import { getSocket } from '@/lib/socket';

interface IncomingInvite {
  roomId: string;
  matchId: string;
  fromPlayerId: string;
  fromUsername: string;
}

// App-level listener for private-match invites. A friend can be anywhere in the
// dashboard when invited, so this lives in the layout (on the shared socket) and
// shows a notification with Accept / Decline.
export default function InviteListener() {
  const router = useRouter();
  const [invite, setInvite] = useState<IncomingInvite | null>(null);

  useEffect(() => {
    const socket = getSocket();
    if (!socket.connected) socket.connect();

    function onInvite(payload: IncomingInvite) {
      setInvite(payload);
    }
    socket.on('game.invite.received', onInvite);
    return () => {
      socket.off('game.invite.received', onInvite);
    };
  }, []);

  if (invite === null) return null;

  function accept() {
    if (invite === null) return;
    router.push(
      `/dashboard/matchmaking?invite=${encodeURIComponent(invite.roomId)}&from=${encodeURIComponent(invite.fromUsername)}`
    );
    setInvite(null);
  }

  function decline() {
    if (invite === null) return;
    getSocket().emit('game.private.decline', { roomId: invite.roomId });
    setInvite(null);
  }

  return (
    <div className="sf-invite-toast sf-fade-up" role="alert">
      <Swords size={20} style={{ color: 'var(--sf-yellow)' }} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold">Match invite</p>
        <p className="text-xs" style={{ color: 'var(--sf-muted)' }}>
          <span style={{ color: 'var(--sf-text)' }}>{invite.fromUsername}</span> invited you to a
          private match.
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <button type="button" className="sf-btn sf-btn-primary sf-btn-sm" onClick={accept}>
          Accept
        </button>
        <button type="button" className="sf-btn sf-btn-ghost sf-btn-sm" onClick={decline}>
          Decline
        </button>
      </div>
    </div>
  );
}
