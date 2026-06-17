import type { Express, Request, Response } from 'express';
import { z } from 'zod';
import swaggerUi from 'swagger-ui-express';
import { env } from '../config/env';
import { registerSchema, loginSchema } from '../controllers/auth.controller';

/**
 * Convert a zod schema to an OpenAPI 3.0 schema object. Using zod's native
 * exporter keeps the docs in lockstep with the validation schemas (no drift).
 */
type JsonSchema = Record<string, unknown>;
const toSchema = (schema: z.ZodType): JsonSchema =>
  z.toJSONSchema(schema, { target: 'openapi-3.0' }) as JsonSchema;

// --- Response schemas (kept here since controllers return plain objects) ------
const errorSchema = z.object({ error: z.string() });

const userSummarySchema = z.object({
  userId: z.string(),
  username: z.string(),
  email: z.string(),
});

const authSuccessSchema = z.object({
  token: z.string(),
  user: userSummarySchema,
});

const meSchema = z.object({
  user: z.object({
    id: z.string(),
    username: z.string(),
    email: z.string(),
    identityImageSource: z.string().nullable(),
    profilePictureUrl: z.string().nullable(),
    premadeAvatarKey: z.string().nullable(),
    auraPoints: z.number(),
    languageCode: z.string(),
    tutorialCompleted: z.boolean(),
  }),
});

const messageSchema = z.object({ message: z.string() });

// Reusable response helpers ----------------------------------------------------
const json = (schema: z.ZodType) => ({ 'application/json': { schema: toSchema(schema) } });
const errorResponse = (description: string) => ({ description, content: json(errorSchema) });

const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'ft_transcendence API',
    version: '1.0.0',
    description: 'HTTP API for ft_transcendence. Auth endpoints are documented first.',
  },
  servers: [{ url: 'http://localhost:3001', description: 'Local development' }],
  components: {
    // Session JWT is delivered as an httpOnly `token` cookie (set on login/register).
    securitySchemes: {
      cookieAuth: { type: 'apiKey', in: 'cookie', name: 'token' },
    },
  },
  tags: [{ name: 'auth', description: 'Authentication & session management' }],
  paths: {
    '/auth/register': {
      post: {
        tags: ['auth'],
        summary: 'Register a new account',
        requestBody: { required: true, content: json(registerSchema) },
        responses: {
          '201': { description: 'Account created', content: json(authSuccessSchema) },
          '400': errorResponse('Validation error'),
          '409': errorResponse('Email or username already in use'),
          '500': errorResponse('Unexpected error'),
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['auth'],
        summary: 'Log in with email and password',
        requestBody: { required: true, content: json(loginSchema) },
        responses: {
          '200': { description: 'Logged in', content: json(authSuccessSchema) },
          '400': errorResponse('Validation error'),
          '401': errorResponse('Invalid credentials'),
          '403': errorResponse('Account disabled or deleted'),
          '500': errorResponse('Unexpected error'),
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['auth'],
        summary: 'Log out the current session',
        security: [{ cookieAuth: [] }],
        responses: {
          '200': { description: 'Logged out', content: json(messageSchema) },
          '401': errorResponse('Not authenticated'),
        },
      },
    },
    '/auth/me': {
      get: {
        tags: ['auth'],
        summary: 'Get the current user profile',
        security: [{ cookieAuth: [] }],
        responses: {
          '200': { description: 'Current user', content: json(meSchema) },
          '401': errorResponse('Not authenticated'),
          '404': errorResponse('Profile not found'),
        },
      },
    },
    '/auth/42': {
      get: {
        tags: ['auth'],
        summary: 'Begin 42 OAuth login (redirects to 42)',
        responses: {
          '302': { description: 'Redirect to the 42 authorization screen' },
          '503': errorResponse('42 login is not configured'),
        },
      },
    },
    '/auth/42/callback': {
      get: {
        tags: ['auth'],
        summary: '42 OAuth callback (redirects back to the client)',
        parameters: [
          { name: 'code', in: 'query', schema: { type: 'string' } },
          { name: 'state', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '302': { description: 'Redirect to the client with a session token or error' },
          '503': errorResponse('42 login is not configured'),
        },
      },
    },
  },
};

/**
 * Serves the raw spec at /openapi.json and Swagger UI at /docs.
 * Disabled in production so the API surface isn't publicly browsable.
 */
export function mountDocs(app: Express): void {
  if (env.NODE_ENV === 'production') return;

  app.get('/openapi.json', (_req: Request, res: Response) => {
    res.json(openApiDocument);
  });
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
}
