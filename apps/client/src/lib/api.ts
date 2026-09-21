// ---------------------------------------------------------------------------
// Typed REST client for the Exponent backend.
// ---------------------------------------------------------------------------
// Single source of truth for the API base URL, credentialed fetch, error
// normalization, and the typed surface of every endpoint the UI consumes.

export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/** Resolve a possibly-relative media URL (e.g. /uploads/..) to an absolute one. */
export function assetUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (/^https?:\/\//.test(url)) return url;
  return `${API_BASE}${url}`;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers:
      options.body !== undefined
        ? { 'Content-Type': 'application/json', ...(options.headers ?? {}) }
        : options.headers,
    ...options,
  });

  if (res.status === 204) return undefined as T;

  let data: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message =
      (data && typeof data === 'object' && 'error' in data
        ? String((data as { error: unknown }).error)
        : typeof data === 'string' && data
          ? data
          : 'Something went wrong.') || 'Something went wrong.';
    throw new ApiError(message, res.status);
  }

  return data as T;
}

// --- shared types ----------------------------------------------------------

export interface PlayerIdentity {
  id: string;
  username: string;
  profilePictureUrl: string | null;
  identityImageSource: string;
  premadeAvatarKey: string | null;
}

export interface AuthUser {
  role: string;
  id: string;
  username: string;
  email: string;
  auraPoints: number;
  languageCode: string;
  tutorialCompleted: boolean;
  /** False for OAuth-only accounts (no local password to change). */
  hasPassword: boolean;
  identityImageSource: string;
  profilePictureUrl: string | null;
  premadeAvatarKey: string | null;
}

export interface OwnProfile {
  id: string;
  username: string;
  email: string;
  profilePictureUrl: string | null;
  identityImageSource: string;
  premadeAvatarKey: string | null;
  languageCode: string;
  auraPoints: number;
  tutorialCompleted: boolean;
}

export interface PublicProfile extends PlayerIdentity {
  auraPoints: number;
  online: boolean;
  lastActiveAt: string | null;
}

export interface FriendView extends PlayerIdentity {
  auraPoints: number;
  online: boolean;
  lastActiveAt: string | null;
}

export type RelationshipStatus =
  | 'none'
  | 'friends'
  | 'request_sent'
  | 'request_received'
  | 'declined'
  | 'self';

export interface SearchResult extends FriendView {
  relationship: RelationshipStatus;
}

export interface LeaderboardRow extends PlayerIdentity {
  accuracy: number | null;
  rank: number;
  auraPoints: number;
  online: boolean;
  isSelf: boolean;
}

export interface LeaderboardResult {
  rows: LeaderboardRow[];
  self: LeaderboardRow;
}

export interface CpuDefeatCount {
  cpuKey: string;
  displayName: string;
  wins: number;
  unlocked: boolean;
}

export interface CpuUnlockProgress {
  cpuKey: string;
  descriptionKey: 'available_immediately' | 'available_after_tutorial' | 'beat_max_and_min' | 'beat_shield_and_pvp';
  unlocked: boolean;
  tutorialGated: boolean;
  tutorialCompleted: boolean;
  requirements: {
    labelKey: 'max_wins' | 'min_wins' | 'fury_wins' | 'shi_eld_wins' | 'pvp_matches';
    current: number;
    target: number;
  }[];
}

export interface PvpStats {
  played: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
}

export interface MatchHistoryRow {
  matchNumber: number;
  opponent: string;
  matchType: 'quick' | 'private';
  result: 'win' | 'loss' | 'draw' | 'voided';
  playedAt: string;
}

export interface StatsResult {
  cpuDefeats: CpuDefeatCount[];
  cpuUnlockProgress: CpuUnlockProgress[];
  pvpStats: PvpStats;
  matchHistory: MatchHistoryRow[];
  dcCount: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  username: string;
  profilePictureUrl: string | null;
  identityImageSource: string;
  premadeAvatarKey: string | null;
  text: string;
  sentAt: string;
  sentAtSgt: string;
}

export const SUPPORTED_LANGUAGES = ['en', 'ms', 'zh', 'es', 'fr', 'ko'] as const;
export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number];

export interface DeveloperUserStats {
  profilePictureUrl: string | null;
  id: string; username: string; email: string; role: string; status: string; online: boolean;
  createdAt: string; lastLoginAt: string | null; lastActiveAt: string | null;
  aura: number; tutorialCompleted: boolean; cpuWins: Record<string, number>;
  recordedMatches: number; pvpMatches: number; cpuMatches: number;
  wins: number; losses: number; draws: number; voided: number; playSeconds: number;
  correctAnswers: number; submittedAttempts: number; accuracy: number | null;
}
export interface DeveloperStats {
  rows: DeveloperUserStats[]; total: number; page: number; pageSize: number;
  totalUsers: number; recordedParticipations: number; totalPlaySeconds: number;
}

// --- API surface -----------------------------------------------------------

export const api = {
  deleteDeveloperUser: (id: string, username: string) => request<void>(`/developer/users/${encodeURIComponent(id)}`, {
    method: 'DELETE', body: JSON.stringify({ username }),
  }),
  developerUsers: (page = 1, search = '') => request<DeveloperStats>(`/developer/users?page=${page}&search=${encodeURIComponent(search)}`),
  // auth
  // Returns null (not a 401) when no session exists, so an unauthenticated probe
  // doesn't surface an error in the browser console.
  me: () => request<{ user: AuthUser | null }>('/auth/me').then((r) => r.user),
  login: (email: string, password: string) =>
    request<{ user: AuthUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (username: string, email: string, password: string) =>
    request<{ user: AuthUser }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    }),
  logout: () => request<{ message: string }>('/auth/logout', { method: 'POST' }),

  // profile
  myProfile: () => request<{ profile: OwnProfile }>('/profile/me').then((r) => r.profile),
  changeUsername: (username: string) =>
    request<{ profile: OwnProfile }>('/profile/username', {
      method: 'PATCH',
      body: JSON.stringify({ username }),
    }).then((r) => r.profile),
  changeEmail: (email: string) =>
    request<{ profile: OwnProfile }>('/profile/email', {
      method: 'PATCH',
      body: JSON.stringify({ email }),
    }).then((r) => r.profile),
  changePassword: (currentPassword: string, newPassword: string) =>
    request<{ message: string }>('/profile/password', {
      method: 'PATCH',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
  changeLanguage: (languageCode: LanguageCode) =>
    request<{ profile: OwnProfile }>('/profile/language', {
      method: 'PATCH',
      body: JSON.stringify({ languageCode }),
    }).then((r) => r.profile),
  uploadPicture: (imageBase64: string) =>
    request<{ profile: OwnProfile }>('/profile/picture', {
      method: 'PUT',
      body: JSON.stringify({ imageBase64 }),
    }).then((r) => r.profile),
  deleteAccount: () => request<{ message: string }>('/profile/me', { method: 'DELETE' }),
  publicProfile: (params: { id?: string; username?: string }) => {
    const q = new URLSearchParams();
    if (params.id) q.set('id', params.id);
    if (params.username) q.set('username', params.username);
    return request<{ profile: PublicProfile }>(`/profile/public?${q.toString()}`).then(
      (r) => r.profile
    );
  },

  // friends
  friends: () => request<{ friends: FriendView[] }>('/friends').then((r) => r.friends),
  friendRequests: () =>
    request<{ requests: FriendView[] }>('/friends/requests').then((r) => r.requests),
  searchPlayers: (q: string) =>
    request<{ results: SearchResult[] }>(`/friends/search?q=${encodeURIComponent(q)}`).then(
      (r) => r.results
    ),
  sendFriendRequest: (targetId: string) =>
    request<{ status: RelationshipStatus }>('/friends/requests', {
      method: 'POST',
      body: JSON.stringify({ targetId }),
    }),
  acceptFriend: (requesterId: string) =>
    request<{ message: string }>(`/friends/requests/${requesterId}/accept`, {
      method: 'POST',
    }),
  declineFriend: (requesterId: string) =>
    request<{ message: string }>(`/friends/requests/${requesterId}/decline`, {
      method: 'POST',
    }),
  removeFriend: (otherId: string) =>
    request<{ message: string }>(`/friends/${otherId}`, { method: 'DELETE' }),

  // leaderboard
  leaderboard: (friendsOnly: boolean, sort: 'aura' | 'accuracy' = 'aura') =>
    request<LeaderboardResult>(`/leaderboard?friends=${friendsOnly}&sort=${sort}`),

  // stats
  stats: () => request<StatsResult>('/stats'),
};
