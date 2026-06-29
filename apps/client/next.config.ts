import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  // Emit a self-contained server bundle for the Docker runtime image.
  output: 'standalone',
  // Trace workspace dependencies from the monorepo root so the standalone
  // output includes @repo/* packages.
  outputFileTracingRoot: path.join(__dirname, '../../'),
};

export default nextConfig;
