'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, type AuthUser, type LanguageCode } from '@/lib/api';
import { disconnectSocket, getSocket } from '@/lib/socket';
import { DashboardProvider } from '@/context/DashboardContext';
import { I18nProvider } from '@/i18n/I18nContext';
import Topbar from '@/components/dashboard/Topbar';
import DashboardFooter from '@/components/dashboard/DashboardFooter';
import InviteListener from '@/components/dashboard/InviteListener';
import { MathDoodles, PageLoader } from '@/components/ui';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checking, setChecking] = useState(true);
  const loggedOut = useRef(false);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        const me = await api.me();
        if (cancelled) return;
        if (!me) {
          router.replace('/auth');
          return;
        }
        setUser(me);

        const socket = getSocket();
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

  // Detect when another session has invalidated this token (e.g. login from another device/tab).
  // On visibility restore or every 30 s, re-validate; a 401 means the server bumped tokenVersion.
  useEffect(() => {
    if (checking) return;

    // Force-logout teardown mirrors the manual logout in Topbar: tear down the
    // shared socket and hard-navigate to /auth. The hard nav avoids the flicker
    // a soft client transition produces between the two shells; the guard keeps
    // overlapping triggers (socket event + 30s poll + visibility change) from
    // firing it more than once.
    function redirectToAuth() {
      if (loggedOut.current) return;
      loggedOut.current = true;
      disconnectSocket();
      window.location.assign('/auth');
    }

    async function checkSession() {
      try {
        // A null user means the session was invalidated (e.g. tokenVersion bumped
        // by a login elsewhere); network/other errors are ignored and retried.
        const user = await api.me();
        if (!user) redirectToAuth();
      } catch {
        // Transient failure — leave the session in place and retry on the next tick.
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') checkSession();
    }

    const socket = getSocket();
    socket.on('auth.session_invalidated', redirectToAuth);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    const interval = setInterval(checkSession, 30_000);

    return () => {
      socket.off('auth.session_invalidated', redirectToAuth);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, [checking, router]);

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
        <div className="sf-app flex min-h-screen flex-col">
          <MathDoodles />
          <InviteListener />
          <div
            className="relative z-10 flex h-screen w-full flex-col"
            style={{ paddingTop: '1.25rem', paddingBottom: '1.25rem' }}
          >
            <Topbar />
            <main className="sf-scroll flex-1 overflow-y-auto">
              <div className="mx-auto w-full max-w-6xl px-6 py-8 sf-fade-up">{children}</div>
            </main>
            <DashboardFooter />
          </div>
        </div>
      </DashboardProvider>
    </I18nProvider>
  );
}
