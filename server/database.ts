/**
 * Database Connection Setup
 * MongoDB connection via Prisma ORM
 */

import { PrismaClient } from '@prisma/client';
import { createLogger } from './utils/logger.js';
import { registerLeadScoringMiddleware } from './services/ai/leadScoringMiddleware.js';

const log = createLogger('Database');

type PrismaLikeError = { code?: string; errorCode?: string };

const getPrismaErrorCode = (error: unknown): string | null => {
  if (!error || typeof error !== 'object') return null;
  const candidate = error as PrismaLikeError;
  if (typeof candidate.code === 'string') return candidate.code;
  if (typeof candidate.errorCode === 'string') return candidate.errorCode;
  return null;
};

let prisma: PrismaClient;

// Check if there's already a prisma instance in development
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'info', 'warn', 'error']
          : ['error'],
    });
  }
  prisma = global.prisma;
}

// Slow-query extension — logs queries exceeding SLOW_QUERY_THRESHOLD_MS
// Note: Prisma 5+ removed $use; we now use $extends (Prisma Client Extensions).
// The extended type is cast back to PrismaClient so downstream code keeps its types.
const prismaWithExtensions = prisma.$extends({
  query: {
    $allModels: {
      async $allOperations({
        model,
        operation,
        args,
        query,
      }: {
        model: string;
        operation: string;
        args: unknown;
        query: (args: unknown) => Promise<unknown>;
      }) {
        const before = Date.now();
        const result = await query(args);
        const elapsed = Date.now() - before;
        if (elapsed > SLOW_QUERY_THRESHOLD_MS) {
          log.warn(`Slow query detected (${elapsed}ms): ${model}.${operation}`, {
            model,
            action: operation,
            elapsedMs: elapsed,
          });
        }
        return result;
      },
    },
  },
});
// Re-assign: cast to base PrismaClient to keep downstream type compatibility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
prisma = prismaWithExtensions as any;

// Register real-time lead scoring middleware (Phase 4A)
registerLeadScoringMiddleware(prisma);

// Global type augmentation for TypeScript
declare global {
  var prisma: PrismaClient | undefined;
}

/**
 * Connect to MongoDB database
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    log.info('Prisma connected to database');
    log.info('Database health check passed');
  } catch (error) {
    const errorCode = getPrismaErrorCode(error);
    if (errorCode === 'P1001') {
      log.warn('Database server unreachable (P1001)');
    } else {
      log.error('Database connection failed', error);
    }
    throw error;
  }
};

/**
 * Disconnect from database
 */
export const disconnectDatabase = async (): Promise<void> => {
  await prisma.$disconnect();
  log.info('Prisma disconnected from MongoDB');
};

export { prisma };
