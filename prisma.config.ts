// prisma.config.ts
import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    // This tells Prisma to look up your DATABASE_URL string out of your .env file
    url: process.env.DATABASE_URL,
  },
});