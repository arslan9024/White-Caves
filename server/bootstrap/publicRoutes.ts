import { Express, Request, Response } from 'express';
import { prisma } from '../database.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import authRoutes from '../routes/auth.js';
import assistantsRoutes from '../routes/assistants.js';
import homepageRoutes from '../routes/homepage.js';
import graphqlRoutes from '../routes/graphql.js';
import contactRoutes from '../routes/contact.js';
import aiChatRoutes from '../routes/aiChat.js';
import sitemapRoutes from '../routes/sitemap.js';
import { cacheService } from '../services/CacheService.js';
import { isAuthenticationRequired } from '../config/authenticationPolicy.js';

export function mountPublicRoutes(app: Express): void {
  // Performance timing middleware
  app.use((req, res, next) => {
    const start = process.hrtime();
    res.on('finish', () => {
      const diff = process.hrtime(start);
      const time = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
      // DevTools header removed to prevent "Cannot set headers" crash
    });
    next();
  });

  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'OK',
      service: 'white-caves-api',
      authenticationRequired: isAuthenticationRequired(),
      timestamp: new Date(),
      environment: process.env.NODE_ENV,
      version: process.env.APP_VERSION || '1.0.0',
    });
  });

  // Public API health endpoint (used by runtime/deployment verifiers and Vercel checks)
  app.get('/api/health', (req: Request, res: Response) => {
    const mem = process.memoryUsage();
    res.status(200).json({
      status: 'OK',
      service: 'white-caves-api',
      authenticationRequired: isAuthenticationRequired(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.APP_VERSION || '2.0.26',
      aegisEngine: 'AEGIS-V4-Supercharged-300%',
      uptimeSeconds: Math.floor(process.uptime()),
      memory: {
        rssMb: (mem.rss / 1024 / 1024).toFixed(2),
        heapTotalMb: (mem.heapTotal / 1024 / 1024).toFixed(2),
        heapUsedMb: (mem.heapUsed / 1024 / 1024).toFixed(2),
      },
    });
  });

  // Database health check — Wave 15 (W15-002)
  app.get(
    '/api/health/db',
    asyncHandler(async (_req: Request, res: Response) => {
      const start = Date.now();
      try {
        await prisma.$runCommandRaw({ ping: 1 });
        const latencyMs = Date.now() - start;
        const cacheHealth = await cacheService.ping();
        res.status(200).json({
          status: 'healthy',
          latencyMs,
          cache: cacheHealth,
          timestamp: new Date(),
        });
      } catch (err) {
        const latencyMs = Date.now() - start;
        res.status(503).json({
          status: 'unhealthy',
          latencyMs,
          error: err instanceof Error ? err.message : 'Database unreachable',
          timestamp: new Date(),
        });
      }
    })
  );

  // System stats endpoint
  app.get('/api/system/stats', (req: Request, res: Response) => {
    const memUsage = process.memoryUsage();
    res.status(200).json({
      success: true,
      data: {
        uptime: process.uptime(),
        memory: {
          rss: Math.round(memUsage.rss / 1024 / 1024) + ' MB',
          heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + ' MB',
          heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + ' MB',
        },
        nodeVersion: process.version,
        platform: process.platform,
      },
    });
  });

  // Dynamic sitemap.xml (SEO)
  app.use('/', sitemapRoutes);

  // ============================================================================
  // API ROUTES
  // ============================================================================

  // Authentication routes
  app.use('/api/auth', authRoutes);

  // Public AI chat route — no auth required
  app.use('/api/ai/chat', aiChatRoutes);

  // AI Assistants list is public (GET /api/assistants) — mount before global auth middleware.
  // Write endpoints (POST/PUT/DELETE) within the router enforce their own authMiddleware.
  app.use('/api/assistants', assistantsRoutes);

  // Homepage Aggregate API (public — no auth required)
  app.use('/api/homepage', homepageRoutes);

  // Contact / Lead-from-homepage API (public — no auth required)
  app.use('/api/contact', contactRoutes);

  // GraphQL compatibility endpoints
  app.use('/graphql', graphqlRoutes);
  app.use('/api/graphql', graphqlRoutes);
}
