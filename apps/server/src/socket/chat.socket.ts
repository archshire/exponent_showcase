// ---------------------------------------------------------------------------
// Community Chat socket handlers (PRD 3.1)
// ---------------------------------------------------------------------------
//
// Registered per authenticated socket from the central connection handler.
// Events:
//   client -> server  chat.history   ()            request recent messages
//   client -> server  chat.send      { text }      send a message
//   server -> client  chat.history   ChatMessage[] recent buffer (to requester)
//   server -> client  chat.message   ChatMessage   new message (broadcast to all)
//   server -> client  chat.error     { message }   validation/rate-limit feedback

import type { Server, Socket } from 'socket.io';
import { prisma } from '@repo/db';
import {
  addMessage,
  getRecentMessages,
  MAX_MESSAGE_LENGTH,
} from '../services/chat.service';

const CHAT_ROOM = 'community-chat';

// Lightweight per-user send cooldown to prevent spam/flooding.
const SEND_COOLDOWN_MS = 500;
const lastSendAt = new Map<string, number>();

export function registerChatHandlers(io: Server, socket: Socket, userId: string): void {
  void socket.join(CHAT_ROOM);

  socket.on('chat.history', () => {
    socket.emit('chat.history', getRecentMessages());
  });

  socket.on('chat.send', async (payload: unknown) => {
    const text = readText(payload);
    if (text === null) {
      socket.emit('chat.error', { message: 'Message cannot be empty.' });
      return;
    }
    if (text.length > MAX_MESSAGE_LENGTH) {
      socket.emit('chat.error', {
        message: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`,
      });
      return;
    }

    const now = Date.now();
    const last = lastSendAt.get(userId) ?? 0;
    if (now - last < SEND_COOLDOWN_MS) {
      socket.emit('chat.error', { message: 'You are sending messages too fast.' });
      return;
    }
    lastSendAt.set(userId, now);

    // Read current identity so the message reflects the latest username/picture.
    const profile = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        profile: {
          select: {
            profilePictureUrl: true,
            identityImageSource: true,
            premadeAvatarKey: true,
          },
        },
      },
    });
    if (!profile || !profile.profile) {
      socket.emit('chat.error', { message: 'Your account could not be found.' });
      return;
    }

    const message = addMessage(
      {
        id: profile.id,
        username: profile.username,
        profilePictureUrl: profile.profile.profilePictureUrl,
        identityImageSource: profile.profile.identityImageSource,
        premadeAvatarKey: profile.profile.premadeAvatarKey,
      },
      text,
    );
    if (!message) {
      socket.emit('chat.error', { message: 'Message cannot be empty.' });
      return;
    }

    io.to(CHAT_ROOM).emit('chat.message', message);
  });
}

function readText(payload: unknown): string | null {
  if (typeof payload === 'string') {
    return payload.trim().length === 0 ? null : payload;
  }
  if (
    typeof payload === 'object' &&
    payload !== null &&
    'text' in payload &&
    typeof (payload as { text: unknown }).text === 'string'
  ) {
    const text = (payload as { text: string }).text;
    return text.trim().length === 0 ? null : text;
  }
  return null;
}
