/**
 * server/db.ts — Prisma Singleton Connection Manager
 *
 * Prevents connection pool exhaustion in development hot-reloads and
 * provides graceful try/catch wrapper guards for local testing offline fallback.
 */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}

export async function safeDbQuery<T>(queryFn: () => Promise<T>, fallbackData: T): Promise<T> {
  try {
    return await queryFn();
  } catch (error) {
    console.warn('⚠️ Database query failed or offline. Returning synthetic fallback dataset.', error);
    return fallbackData;
  }
}
