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

const POOL_MAX_SIZE = parseInt(process.env.DB_POOL_MAX ?? '10', 10);
const POOL_MIN_SIZE = parseInt(process.env.DB_POOL_MIN ?? '2', 10);
const CONNECT_TIMEOUT_MS = parseInt(process.env.DB_CONNECT_TIMEOUT_MS ?? '10000', 10);

let prisma: PrismaClient;

// Inject pool parameters into DATABASE_URL if not already set
const buildDatabaseUrl = (): string | undefined => {
  const url = process.env.DATABASE_URL;
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    if (!parsed.searchParams.has('maxPoolSize'))
      parsed.searchParams.set('maxPoolSize', String(POOL_MAX_SIZE));
    if (!parsed.searchParams.has('minPoolSize'))
      parsed.searchParams.set('minPoolSize', String(POOL_MIN_SIZE));
    if (!parsed.searchParams.has('connectTimeoutMS'))
      parsed.searchParams.set('connectTimeoutMS', String(CONNECT_TIMEOUT_MS));
    return parsed.toString();
  } catch {
    return url;
  }
};

// Check if there's already a prisma instance in development
const effectiveDbUrl = buildDatabaseUrl();
const prismaOptions = effectiveDbUrl ? { datasources: { db: { url: effectiveDbUrl } } } : {};

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient(prismaOptions);
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      ...prismaOptions,
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
(prisma as any).$use(async (params: any, next: (params: any) => Promise<unknown>) => {
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
