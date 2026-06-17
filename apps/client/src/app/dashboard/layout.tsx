'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, type AuthUser, type LanguageCode } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import { DashboardProvider } from '@/context/DashboardContext';
import { I18nProvider } from '@/i18n/I18nContext';
import Sidebar from '@/components/dashboard/Sidebar';
import { PageLoader } from '@/components/ui';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        const me = await api.me();
        if (cancelled) return;
        setUser(me);

        const token = localStorage.getItem('token') ?? undefined;
        const socket = getSocket(token);
        if (!socket.connected) socket.connect();
      } catch {
        if (!cancelled) router.replace('/auth');
      } finally {
        if (!cancelled) setChecking(false);
      }
    }
    init();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (checking) {
    return (
      <div className="sf-app flex min-h-screen items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  if (!user) return null;

  return (
    <I18nProvider initialLang={(user.languageCode as LanguageCode) ?? 'en'}>
      <DashboardProvider initialUser={user}>
        <div className="sf-app flex min-h-screen">
          <Sidebar />
          <main className="sf-scroll flex-1 overflow-y-auto" style={{ height: '100vh' }}>
            <div className="mx-auto w-full max-w-6xl px-6 py-8 sf-fade-up">{children}</div>
          </main>
        </div>
      </DashboardProvider>
    </I18nProvider>
  );
}
