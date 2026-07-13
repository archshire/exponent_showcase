// ---------------------------------------------------------------------------
// Socket authentication
// ---------------------------------------------------------------------------
//
// The realtime equivalent of the `requireAuth` REST middleware. The client
// connects with `withCredentials`, so the browser sends the same httpOnly
// session cookie used for REST auth on the handshake; we read the JWT from
// there (never from JS-readable storage) and verify it the same way as the
// HTTP cookie token, including the tokenVersion check that invalidates sessions
// after logout / "logged in elsewhere".
//
// Authentication is OPTIONAL at the connection level: the unauthenticated game
// arena sockets carry no token and simply get no `socket.data.userId`. Handlers
// that require an identity (chat, presence) check for it before acting.

import jwt from 'jsonwebtoken';
import type { Socket } from 'socket.io';
import { prisma } from '@repo/db';
import { env } from '../config/env';
import type { JwtPayload } from '../middleware/auth.middleware';

declare module 'socket.io' {
  interface SocketData {
    userId?: string;
    username?: string;
  }
}

/**
 * Resolves the authenticated user for a socket from its handshake token.
 * Returns the userId (and username) on success, or null when the socket is
 * unauthenticated or the token is invalid/stale.
 */
export async function authenticateSocket(
  socket: Socket
): Promise<{ userId: string; username: string } | null> {
  const token = getCookie(socket.handshake.headers.cookie, 'token');
  if (!token) return null;

  let payload: JwtPayload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, username: true, tokenVersion: true },
  });

  if (!user || user.tokenVersion !== payload.tokenVersion) return null;

  return { userId: user.id, username: user.username };
}

/** Minimal cookie-header lookup — avoids pulling cookie-parser into the socket path. */
function getCookie(header: string | undefined, name: string): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(';')) {
    const eq = part.indexOf('=');
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === name) {
      return decodeURIComponent(part.slice(eq + 1).trim());
    }
  }
  return undefined;
}
