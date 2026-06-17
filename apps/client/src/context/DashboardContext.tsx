'use client';

import { createContext, useContext } from 'react';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  auraPoints: number;
  languageCode: string;
  tutorialCompleted: boolean;
  identityImageSource: string;
  profilePictureUrl: string | null;
  premadeAvatarKey: string | null;
}

export const DashboardContext = createContext<AuthUser | null>(null);

export function useDashboardUser(): AuthUser | null {
  return useContext(DashboardContext);
}
