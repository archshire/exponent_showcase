import type { Server } from 'socket.io';
import { registerDemoRuntimeSocketHandlers } from './demo_server.socket';
import { registerLiveMatchSocketHandlers } from './live-match.socket';
import { registerMatchmakingSocketHandlers } from './matchmaking.socket';

// ---------------------------------------------------------------------------
// Socket.IO registration entrypoint
// ---------------------------------------------------------------------------
//
// This file is the realtime equivalent of the REST route registration layer.
// Express routes map HTTP URLs to controllers. Socket handlers map realtime
// event names to backend services.
//
// Pending startup wiring:
// - Create an HTTP server from the Express app in `src/index.ts`.
// - Attach a Socket.IO Server to that HTTP server.
// - Call `registerSocketHandlers(io)`.
//
// Keeping this as a separate entrypoint lets Live Match, Community Chat, and
// future realtime features register their own event handlers without putting
// Socket.IO transport details inside service/domain logic.

export function registerSocketHandlers(io: Server): void {
  console.log('[socket] initializing');

  io.on("connection", (socket) => {
    console.log("connecteda:", socket.id);

    socket.emit("welcome", { message: "hello client" });

    socket.on("ping", () => {
      socket.emit("pong");
    });

    socket.on("disconnect", () => {
      console.log("disconnected:", socket.id);
    });
  });
  registerMatchmakingSocketHandlers(io);
  registerLiveMatchSocketHandlers(io);
  registerDemoRuntimeSocketHandlers(io);
}
