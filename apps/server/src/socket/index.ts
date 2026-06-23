import type { Server } from 'socket.io';
import { registerDemoRuntimeSocketHandlers } from './demo_server.socket';
import { registerLiveMatchSocketHandlers } from './live-match.socket';
import { registerMatchmakingSocketHandlers } from './matchmaking.socket';
import { authenticateSocket } from './socket-auth';
import { registerChatHandlers } from './chat.socket';
import { markOffline, markOnline } from '../services/presence.service';

// ---------------------------------------------------------------------------
// Socket.IO registration entrypoint
// ---------------------------------------------------------------------------
//
// This file is the realtime equivalent of the REST route registration layer.
// Express routes map HTTP URLs to controllers. Socket handlers map realtime
// event names to backend services.
//
// Connection handling is split into two worlds that share one Socket.IO server:
//   - Authenticated app sockets (the real client passes its JWT in the
//     handshake): tracked for presence and wired to Community Chat.
//   - Unauthenticated demo arena sockets (no token): handled by the demo
//     runtime / matchmaking / live-match handlers via their own player ids.

export function registerSocketHandlers(io: Server): void {
  console.log('[socket] initializing');

  io.on('connection', async (socket) => {
    const identity = await authenticateSocket(socket);

    if (identity) {
      socket.data.userId = identity.userId;
      socket.data.username = identity.username;
      markOnline(identity.userId);

      // Per-user room so we can push targeted events (e.g. private match
      // invites) to all of a user's sockets.
      void socket.join(`user:${identity.userId}`);

      registerChatHandlers(io, socket, identity.userId);

      socket.on('disconnect', () => {
        markOffline(identity.userId);
      });
    }

    socket.on('ping', () => {
      socket.emit('pong');
    });
  });

  registerMatchmakingSocketHandlers(io);
  registerLiveMatchSocketHandlers(io);
  registerDemoRuntimeSocketHandlers(io);
}
