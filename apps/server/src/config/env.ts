import { z } from 'zod';

const envSchema = z.object({
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),

  // 42 OAuth. Optional — when the credentials are missing the provider is
  // simply not registered (its routes return 503).
  FORTYTWO_CLIENT_ID: z.string().optional(),
  FORTYTWO_CLIENT_SECRET: z.string().optional(),

  // Server origin providers redirect back to, and the frontend to land on after login.
  OAUTH_REDIRECT_BASE_URL: z.string().url().default('http://localhost:3000'),
  CLIENT_URL: z.string().url().default('http://localhost:3000'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
