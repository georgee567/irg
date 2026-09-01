import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

// Create pool with proper configuration for development
const pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    // Reduce pool size in development to avoid connection exhaustion
    max: process.env.NODE_ENV === 'production' ? 10 : 2,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    // Log queries in development
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}

// Handle graceful shutdown
if (typeof global !== 'undefined') {
  if (process.env.NODE_ENV === 'development') {
    // In development, don't fully close but clean up properly
    process.once('exit', async () => {
      try {
        await pool.end();
      } catch (e) {
        console.error('Error closing pool:', e);
      }
    });
  }
}