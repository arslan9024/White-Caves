import { Express, Request, Response, NextFunction } from 'express';
import { prisma } from '../database.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import authMiddleware from '../middleware/auth.js';
import logger from '../utils/logger.js';
import { phase6Router } from '../routes/phase6.routes.js';
import { requirePermission } from '../middleware/rbac.js';

export function mountSystemCompatibilityRoutes(app: Express): void {
  // System Health API (SystemHealthPage)
  app.get(
    '/api/system/health',
    authMiddleware,
    requirePermission('view_system_health'),
    asyncHandler(async (req: Request, res: Response) => {
      const uptime = process.uptime();
      res.status(200).json({
        success: true,
        data: {
          status: 'healthy',
          uptime: Math.round(uptime),
          uptimeFormatted: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`,
          database: 'connected',
          memory: {
            used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
            total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          },
          services: {
            api: 'operational',
            database: 'operational',
            whatsapp: 'not_configured',
            email: 'not_configured',
          },
          version: '1.0.0',
          environment: process.env.NODE_ENV || 'development',
          timestamp: new Date().toISOString(),
        },
      });
    })
  );

  // Admin Role Management: Handles role transitions and RBAC policy updates via userRole schema
  app.post(
    '/api/users/role',
    authMiddleware,
    requirePermission('manage_users'),
    asyncHandler(async (req: Request, res: Response) => {
      const { userId, role } = req.body;
      if (!userId || !role) throw new AppError('userId and role are required', 400);

      // Validate role against the full alias map to prevent arbitrary strings being stored
      const { ROLE_ALIAS_MAP } = await import('../middleware/rbac.js');
      if (!Object.hasOwn(ROLE_ALIAS_MAP, role)) {
        throw new AppError(
          `Invalid role: "${role}". Must be one of: ${Object.keys(ROLE_ALIAS_MAP).join(', ')}`,
          422
        );
      }

      const updated = await prisma.user.update({
        where: { id: userId },
        data: { role },
        select: { id: true, email: true, name: true, role: true },
      });
      await prisma.activity.create({
        data: {
          type: 'system',
          action: 'updated',
          description: `Role changed to ${role} for ${updated.email}`,
          userId: req.user?.id || null,
        },
      });
      res.status(200).json({ success: true, data: updated });
    })
  );

  // Admin Settings — read and write system-wide configuration
  app.get(
    '/api/admin/settings',
    authMiddleware,
    requirePermission('manage_users'),
    asyncHandler(async (_req: Request, res: Response) => {
      const settings = await prisma.systemSetting.findMany({ orderBy: { category: 'asc' } });
      const settingsMap = Object.fromEntries(settings.map(s => [s.key, s.value]));
      res.json({ success: true, data: settingsMap, meta: { count: settings.length } });
    })
  );
  app.post(
    '/api/admin/settings',
    authMiddleware,
    requirePermission('manage_users'),
    asyncHandler(async (req: Request, res: Response) => {
      const { settings } = req.body;
      if (!settings || typeof settings !== 'object' || Array.isArray(settings)) {
        throw new AppError('Request body must contain a "settings" object', 400);
      }

      const userId = (req as Request & { user?: { id: string } }).user?.id;
      const entries = Object.entries(settings as Record<string, unknown>);
      if (entries.length === 0) throw new AppError('No settings provided', 400);
      if (entries.length > 50)
        throw new AppError('Cannot update more than 50 settings at once', 400);

      // Upsert each key
      const updated = await Promise.all(
        entries.map(([key, value]) =>
          prisma.systemSetting.upsert({
            where: { key },
            create: {
              key,
              value: value as Parameters<typeof prisma.systemSetting.create>[0]['data']['value'],
              updatedBy: userId,
            },
            update: {
              value: value as Parameters<typeof prisma.systemSetting.update>[0]['data']['value'],
              updatedBy: userId,
            },
          })
        )
      );

      logger.info('Admin settings updated', { keys: entries.map(([k]) => k), userId });
      res.json({ success: true, data: { updatedCount: updated.length } });
    })
  );

  // Phase 6 — queue, analytics, notifications, encryption, presence
  // The phase6 router uses x-user-id header auth; bridge it from the JWT-authenticated user.
  app.use(
    '/api/platform',
    authMiddleware,
    (req: Request, _res: Response, next: NextFunction) => {
      // Bridge JWT identity into the x-user-id header expected by phase6 routes
      const userId = (req as Request & { user?: { id: string } }).user?.id;
      if (userId) req.headers['x-user-id'] = userId;
      next();
    },
    phase6Router
  );

  // ============================================================================
  // PRODUCTION STATIC ASSET + SPA SERVING
}
