/**
 * src/lib/prisma.ts — Frontend-Safe Prisma Client Singleton Pool
 *
 * Prevents socket exhaustion during React hot-reloads and Next.js
 * serverless function cold starts. Reuses the global instance in
 * development and creates a fresh PrismaClient in production.
 *
 * Usage: import { prisma } from '@/lib/prisma';
 */

import { PrismaClient } from '@prisma/client';

// ─── Global type extension ────────────────────────────────────────────────────

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// ─── Singleton Factory ────────────────────────────────────────────────────────

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });
}

// ─── Exported Singleton ───────────────────────────────────────────────────────

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? createPrismaClient();

// Persist to globalThis in non-production to avoid pool exhaustion on hot-reload
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// ─── Safe Query Wrapper ───────────────────────────────────────────────────────

/**
 * Wraps a Prisma query with a fallback for offline / offline-first development.
 * Returns `fallbackData` when the database is unreachable.
 */
export async function safeQuery<T>(
  queryFn: (client: PrismaClient) => Promise<T>,
  fallbackData: T
): Promise<T> {
  try {
    return await queryFn(prisma);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '⚠️ [Prisma] Database unavailable — returning fallback dataset.',
        error instanceof Error ? error.message : error
      );
    }
    return fallbackData;
  }
}

export default prisma;
