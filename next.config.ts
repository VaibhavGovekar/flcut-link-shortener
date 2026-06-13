import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', 'pg'], // Prevents Turbopack build crashes!
};

export default nextConfig;