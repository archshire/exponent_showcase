import { io, Socket } from "socket.io-client";

// In production the app is served behind nginx on a single origin: the API
// lives under "/api" and Socket.IO under "/socket.io" on that same origin, so
// the socket connects to the page origin. In development NEXT_PUBLIC_API_URL is
// unset and we fall back to the standalone server on :3001.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/** Origin the realtime socket connects to (same origin when API is relative). */
function getSocketUrl(): string | undefined {
  if (API_URL.startsWith("http")) return API_URL;
  return typeof window !== "undefined" ? window.location.origin : undefined;
}

const SOCKET_PATH = "/socket.io";

let socket: Socket | null = null;

export function getSocket(token?: string): Socket {
  if (!socket) {
    socket = io(getSocketUrl(), {
      path: SOCKET_PATH,
      auth: { token },
      transports: ["websocket", "polling"],
      autoConnect: false,
    });
  } else if (token) {
    socket.auth = { token };
  }
  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
