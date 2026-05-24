/**
 * Database Connection Setup
 * MongoDB connection via Prisma ORM
 */

import { PrismaClient } from '@prisma/client';
import { createLogger } from './utils/logger.js';
import { registerLeadScoringMiddleware } from './services/ai/leadScoringMiddleware.js';

const log = createLogger('Database');

// Slow-query threshold: log any query taking longer than this
const SLOW_QUERY_THRESHOLD_MS = 500;

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

// Slow-query middleware — logs queries exceeding SLOW_QUERY_THRESHOLD_MS
// eslint-disable-next-line @typescript-eslint/no-explicit-any
prisma.$use(async (params: any, next: (params: any) => Promise<unknown>) => {
  const before = Date.now();
  const result = await next(params);
  const elapsed = Date.now() - before;
  if (elapsed > SLOW_QUERY_THRESHOLD_MS) {
    log.warn(
      `Slow query detected (${elapsed}ms): ${params.model}.${params.action}`,
      { model: params.model, action: params.action, elapsedMs: elapsed }
    );
  }
  return result;
});

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
    log.info('Prisma connected to MongoDB');
    log.info('Database health check passed');
  } catch (error) {
    log.error('Database connection failed', error);
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
