'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { api, type AuthUser } from '@/lib/api';

export type { AuthUser };

interface DashboardValue {
  user: AuthUser;
  setUser: (user: AuthUser) => void;
  /** Merge partial fields into the current user (e.g. after a profile edit). */
  patchUser: (patch: Partial<AuthUser>) => void;
  /** Re-fetch the authenticated user from the server. */
  refresh: () => Promise<void>;
}

const DashboardContext = createContext<DashboardValue | null>(null);

export function DashboardProvider({
  initialUser,
  children,
}: {
  initialUser: AuthUser;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AuthUser>(initialUser);

  const patchUser = useCallback((patch: Partial<AuthUser>) => {
    setUser((prev) => ({ ...prev, ...patch }));
  }, []);

  const refresh = useCallback(async () => {
    const fresh = await api.me();
    if (fresh) setUser(fresh);
  }, []);

  const value = useMemo(() => ({ user, setUser, patchUser, refresh }), [user, patchUser, refresh]);

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

function useDashboard(): DashboardValue {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
}

/** The authenticated user (throws outside the provider). */
export function useDashboardUser(): AuthUser {
  return useDashboard().user;
}

export function useDashboardActions() {
  const { setUser, patchUser, refresh } = useDashboard();
  return { setUser, patchUser, refresh };
}
