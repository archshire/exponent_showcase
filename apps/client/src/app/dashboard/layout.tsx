'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSocket } from '@/lib/socket';
import { DashboardContext, type AuthUser } from '@/context/DashboardContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch('http://localhost:3001/auth/me', {
          credentials: 'include',
        });

        if (!res.ok) {
          router.replace('/auth');
          return;
        }

        const data = await res.json();
        setUser(data.user as AuthUser);

        const token = localStorage.getItem('token') ?? undefined;
        const socket = getSocket(token);
        if (!socket.connected) {
          socket.connect();
        }
      } catch {
        router.replace('/auth');
      } finally {
        setChecking(false);
      }
    }

    init();
  }, [router]);

  if (checking) {
    return <div style={{ padding: 24 }}>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardContext.Provider value={user}>
      {children}
    </DashboardContext.Provider>
  );
}
