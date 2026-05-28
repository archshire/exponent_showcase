import './config/env';
import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import { env } from './config/env';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);

app.listen(Number(env.PORT), () => {
  console.log(`Server running on port ${env.PORT}`);
});
