import { PrismaClient } from '@prisma/client';
import { env } from '@repo/config-env'; // or wherever your validated env is

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: env.DATABASE_URL,
    },
  },
});