// ---------------------------------------------------------------------------
// Community Chat service
// ---------------------------------------------------------------------------
//
// Basic realtime community chat backed entirely by server runtime memory:
// - server keeps only the latest 50 messages for the current server session.
// - when message 51 arrives, the oldest is dropped (ring buffer).
// - chat messages are NOT persisted; a server restart clears history.
//
// Moderation: the server censors offensive language before broadcasting; only
// the censored text is ever stored or sent to clients.

import { censor } from '../config/profanity.config';

export const MAX_MESSAGE_LENGTH = 280;
const BUFFER_SIZE = 50;

export interface ChatMessage {
  id: string;
  senderId: string;
  username: string;
  profilePictureUrl: string | null;
  identityImageSource: string;
  premadeAvatarKey: string | null;
  text: string;
  sentAt: string; // ISO 8601 (UTC)
  sentAtSgt: string; // formatted for Singapore time (Asia/Singapore)
}

export interface ChatSender {
  id: string;
  username: string;
  profilePictureUrl: string | null;
  identityImageSource: string;
  premadeAvatarKey: string | null;
}

const buffer: ChatMessage[] = [];
let sequence = 0;

const SGT_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Singapore',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

/** Validate, censor, store, and return a chat message; null if invalid. */
export function addMessage(sender: ChatSender, rawText: string): ChatMessage | null {
  const trimmed = rawText.trim();
  if (trimmed.length === 0) return null; // empty messages are rejected

  // Over-length messages are truncated before send.
  const bounded = trimmed.slice(0, MAX_MESSAGE_LENGTH);
  const text = censor(bounded);

  const now = new Date();
  const message: ChatMessage = {
    id: `msg-${Date.now()}-${sequence++}`,
    senderId: sender.id,
    username: sender.username,
    profilePictureUrl: sender.profilePictureUrl,
    identityImageSource: sender.identityImageSource,
    premadeAvatarKey: sender.premadeAvatarKey,
    text,
    sentAt: now.toISOString(),
    sentAtSgt: SGT_FORMATTER.format(now),
  };

  buffer.push(message);
  if (buffer.length > BUFFER_SIZE) {
    buffer.shift(); // drop oldest
  }

  return message;
}

/** Latest messages (oldest -> newest), at most BUFFER_SIZE. */
export function getRecentMessages(): ChatMessage[] {
  return [...buffer];
}

/** Test/reset hook. */
export function clearMessages(): void {
  buffer.length = 0;
  sequence = 0;
}
