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

import authRoutes from './routes/auth.routes';
import oauthRoutes from './routes/oauth.routes';
import { env } from './config/env';
import { registerSocketHandlers } from './socket';

const app = express();
const httpServer = createServer(app);

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/auth', oauthRoutes);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

registerSocketHandlers(io);

httpServer.listen(Number(env.PORT), () => {
  console.log(`Server running on port ${env.PORT}`);
});