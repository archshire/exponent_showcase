import 'dotenv/config';

console.log('ENV DATABASE_URL =', process.env.DATABASE_URL);
import './config/env';
import { createServer } from 'node:http';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import { prisma } from '@repo/db';

async function testDb() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Prisma connected successfully');
  } catch (e) {
    console.error('❌ Prisma connection failed:', e);
  }
}

testDb();

import path from 'node:path';
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

// Serve uploaded profile pictures (written by the profile service).
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/auth', authRoutes);
app.use('/auth', oauthRoutes);
app.use('/profile', profileRoutes);
app.use('/friends', friendsRoutes);
app.use('/leaderboard', leaderboardRoutes);
app.use('/stats', statsRoutes);

const io = new Server(httpServer, {
  cors: {
    origin: env.CLIENT_URL,
    credentials: true,
  },
});

registerSocketHandlers(io);

httpServer.listen(Number(env.PORT), () => {
  console.log(`Server running on port ${env.PORT}`);
});
