// db.ts
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

// 1. Initialize the PostgreSQL connection pool using your Neon link string
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 2. Feed that connection adapter configuration into the Prisma 7 client constructor
const adapter = new PrismaPg(pool);

export const db = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;