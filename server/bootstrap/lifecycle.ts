import { createServer } from 'http';
import { Express } from 'express';
import { connectDatabase, prisma } from '../database.js';
import { connectDB } from '../lib/database.js';
import { IS_PRODUCTION, DATABASE_URL } from '../config/env.js';
import logger from '../utils/logger.js';
import { startViewingReminderCron } from '../services/ViewingReminderCron.js';
import { startFollowUpScheduler } from '../services/automation/followUpScheduler.js';
import { startRateRefresh } from '../services/currencyService.js';
import { startViewingReminderScheduler } from '../services/schedulingService.js';
import { startRERAExpiryScheduler } from '../services/compliance/reraExpiryScheduler.js';
import { startAutoRouting } from '../services/ai/leadAutoRouter.js';
import { schedulerService } from '../services/SchedulerService.js';
import { RealtimeService } from '../websocket/realtimeService.js';
import type { ServerRuntime } from './runtime.js';
import { PREFERRED_PORT, parsePort, listenWithPortFallback } from './listener.js';
const startServer = async (app: Express, runtime: ServerRuntime) => {
  // Bind HTTP + Socket.io port immediately so Vite proxy never hits ECONNREFUSED during DB TLS warmup
  const preferredPort = parsePort(PREFERRED_PORT);
  const allowPortFallback = process.env.NODE_ENV === 'development' && !process.env.API_PORT;

  const httpServer = createServer(app);
  runtime.realtimeService = new RealtimeService(httpServer);
  logger.info('RealtimeService initialized');

  const activePort = await listenWithPortFallback(httpServer, preferredPort, {
    enableFallback: allowPortFallback,
    maxAttempts: 20,
  });
  const host = process.env.API_URL || `http://localhost:${activePort}`;

  if (activePort !== preferredPort) {
    logger.warn(`API port fallback active: preferred ${preferredPort}, listening on ${activePort}`);
  }

  logger.info(`Server started on ${host} (${process.env.NODE_ENV || 'development'})`);
  logger.info(
    `API Base (v1): ${host}/api/v1 | Legacy: ${host}/api | Socket.io: ws://${host.replace(/^https?:\/\//, '')}`
  );

  runtime.dbInitPromise = (async () => {
    if (DATABASE_URL && /^mongodb(\+srv)?:\/\//i.test(DATABASE_URL)) {
      try {
        logger.info('Connecting to MongoDB with Mongoose...');
        await connectDB(DATABASE_URL);
        logger.info('Mongoose connected successfully');
      } catch (mongoErr: unknown) {
        const msg = mongoErr instanceof Error ? mongoErr.message : String(mongoErr);
        logger.warn(`Mongoose connection failed: ${msg}`);
      }
    } else {
      logger.warn('MongoDB URI not configured — skipping Mongoose connection in development');
    }

    try {
      await connectDatabase();
      logger.info('Prisma connected successfully');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      const firstLine = message
        .split('\n')
        .map(line => line.trim())
        .find(Boolean);
      logger.warn(`Database connection failed: ${firstLine ?? message}`);
      logger.warn('Server will start without Prisma — Prisma-backed API calls may return errors');
    }
  })();

  await runtime.dbInitPromise;
  runtime.dbInitPromise = null;

  // Start background services and non-blocking post-boot maintenance
  startFollowUpScheduler();
  startRateRefresh(); // Phase 2E: refresh exchange rates every 6h
  startViewingReminderScheduler(); // Phase 3C: viewing reminders every 15 min
  startViewingReminderCron(); // Wave 23: FCM push viewing reminders every 5 min
  startRERAExpiryScheduler(); // Phase 3D: RERA BRN expiry checks daily
  startAutoRouting(); // Phase 4A: auto-route hot leads to best agents
  schedulerService.start(); // Wave 12: cron automation engine

  import('../services/orchestrator/AssistantOrchestrator.js')
    .then(({ assistantOrchestrator }) => {
      assistantOrchestrator.registerLindaHandlers();
      assistantOrchestrator.registerNadiaHandlers();
      assistantOrchestrator.registerNinaHandlers();
      assistantOrchestrator.registerMaryHandlers();
      assistantOrchestrator.registerHenryHandlers();
      logger.info('AssistantOrchestrator: all 5 assistant handlers registered.');
    })
    .catch((err: unknown) => {
      logger.warn('AssistantOrchestrator init failed:', err instanceof Error ? err.message : err);
    });

  // Non-blocking background check for any legacy password hashes
  void (async () => {
    try {
      const legacyUsers = await prisma.user.findMany({
        where: { passwordHash: { startsWith: 'wc$' } },
        select: { id: true, passwordHash: true },
      });
      if (legacyUsers.length > 0) {
        const bcryptLib = await import('bcryptjs');
        const ROUNDS = 12;
        for (const user of legacyUsers) {
          const plaintext = Buffer.from(user.passwordHash!.slice(3), 'base64').toString();
          const hashed = await bcryptLib.default.hash(plaintext, ROUNDS);
          await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hashed } });
        }
        logger.info(`Migrated ${legacyUsers.length} legacy password hash(es) to bcrypt`);
      }
    } catch (migrationError: unknown) {
      const msg = migrationError instanceof Error ? migrationError.message : String(migrationError);
      logger.warn(`Legacy password migration skipped: ${msg}`);
    }
  })();

  return httpServer;
};

export function startApplication(app: Express, runtime: ServerRuntime): void {
  // Start the server

  startServer(app, runtime)
    .then(s => {
      runtime.httpServer = s;
    })
    .catch(err => {
      logger.error('Failed to start server', {
        error: err instanceof Error ? err.message : String(err),
      });
      process.exit(1);
    });

  // FIX 05 (AEGIS): Process handlers — log+continue in dev, exit in production
  process.on('unhandledRejection', (reason: Error) => {
    logger.error('Unhandled Rejection', { reason: reason?.message || reason });
    if (IS_PRODUCTION) {
      prisma.$disconnect().finally(() => process.exit(1));
    }
    // In development: log and continue — don't kill the process
  });

  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception', { error: error?.message || error });
    if (IS_PRODUCTION) {
      prisma.$disconnect().finally(() => process.exit(1));
    }
    // In development: log and continue — don't kill the process
  });

  // Graceful shutdown
  const gracefulShutdown = async (signal: string) => {
    logger.info(`${signal} received — shutting down gracefully`);
    // 1. Stop accepting new connections
    if (runtime.realtimeService) {
      runtime.realtimeService.stop();
      runtime.realtimeService = null;
      logger.info('RealtimeService stopped');
    }
    if (runtime.httpServer) {
      runtime.httpServer.close(() => {
        logger.info('HTTP server closed — no new connections');
      });
    }
    // 2. Allow in-flight requests to finish.
    // In production keep a longer drain window; in dev/test keep shutdown fast
    // so nodemon restarts do not race and re-bind errors (EADDRINUSE) are avoided.
    const shutdownDrainMs = IS_PRODUCTION ? 10_000 : 500;
    await new Promise(resolve => setTimeout(resolve, shutdownDrainMs));
    // 3. Disconnect database
    await prisma.$disconnect();
    logger.info('Database disconnected — exiting');
    process.exit(0);
  };
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.once('SIGUSR2', async () => {
    await gracefulShutdown('SIGUSR2');
    process.kill(process.pid, 'SIGUSR2');
  });
}
