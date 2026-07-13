import 'dotenv/config';
import './config/env'; // validates required env vars, exits on failure

import { createServer } from 'node:http';
import path from 'node:path';
import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import { prisma } from '@repo/db';

import authRoutes from './routes/auth.routes';
import oauthRoutes from './routes/oauth.routes';
import profileRoutes from './routes/profile.routes';
import friendsRoutes from './routes/friends.routes';
import leaderboardRoutes from './routes/leaderboard.routes';
import statsRoutes from './routes/stats.routes';
import { env } from './config/env';
import { registerSocketHandlers } from './socket';

const app = express();
const httpServer = createServer(app);

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(cookieParser());

// Liveness/readiness probe (no auth). Returns 503 if the database is
// unreachable so orchestrators can restart or hold traffic.
app.get('/health', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok' });
  } catch {
    res.status(503).json({ status: 'degraded' });
  }
});

// Serve uploaded profile pictures (written by the profile service).
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/auth', authRoutes);
app.use('/auth', oauthRoutes);
app.use('/profile', profileRoutes);
app.use('/friends', friendsRoutes);
app.use('/leaderboard', leaderboardRoutes);
app.use('/stats', statsRoutes);

// Catch-all error handler (must be last, after all routes). Express forwards
// thrown/rejected handler errors here; log the detail and return a generic
// message so stack traces never leak to clients.
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled request error:', err);
  if (res.headersSent) return;
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
});

const io = new Server(httpServer, {
  cors: {
    origin: env.CLIENT_URL,
    credentials: true,
  },
});

registerSocketHandlers(io);

async function start(): Promise<void> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connected');
  } catch (err) {
    console.error('❌ Could not connect to the database — exiting.', err);
    process.exit(1);
  }

  httpServer.listen(Number(env.PORT), () => {
    console.log(`Server running on port ${env.PORT}`);
  });
}

let shuttingDown = false;
async function shutdown(signal: string): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`${signal} received — shutting down gracefully`);

  // Safety net: don't hang forever if connections refuse to close.
  const force = setTimeout(() => {
    console.error('Graceful shutdown timed out — forcing exit.');
    process.exit(1);
  }, 10_000);
  force.unref();

  io.close();
  httpServer.close(async () => {
    await prisma.$disconnect().catch(() => {});
    clearTimeout(force);
    process.exit(0);
  });
}

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));

void start();
