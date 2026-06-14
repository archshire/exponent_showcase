import './config/env';
import { createServer } from 'node:http';
import express from 'express';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.routes';
import oauthRoutes from './routes/oauth.routes';
import { env } from './config/env';
import { registerSocketHandlers } from './socket';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/auth', oauthRoutes);

registerSocketHandlers(io);

httpServer.listen(Number(env.PORT), () => {
  console.log(`Server running on port ${env.PORT}`);
});
