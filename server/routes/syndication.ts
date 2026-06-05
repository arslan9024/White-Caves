import { Router, Request, Response } from 'express';
import { requirePermission } from '../middleware/rbac.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { prisma } from '../database.js';

const router = Router();

const isSyndicationEnabled = () => process.env.SYNDICATION_ENABLED === 'true';

router.get('/status', requirePermission('view_properties'), asyncHandler(async (_req: Request, res: Response) => {
  const enabled = isSyndicationEnabled();
  res.status(200).json({
    success: true,
    data: {
      enabled,
      providers: ['property_finder', 'bayut'],
    },
  });
}));

router.post('/sync-queue', requirePermission('manage_properties'), asyncHandler(async (req: Request, res: Response) => {
  if (!isSyndicationEnabled()) {
    throw new AppError('Syndication is disabled. Set SYNDICATION_ENABLED=true to enable.', 503);
  }

  const propertyIds = Array.isArray(req.body?.propertyIds)
    ? req.body.propertyIds.filter((id: unknown): id is string => typeof id === 'string' && id.trim().length > 0)
    : [];
  const provider = typeof req.body?.provider === 'string' ? req.body.provider : 'all';

  if (propertyIds.length === 0) {
    throw new AppError('propertyIds is required', 400);
  }

  const queuedAt = new Date();
  const queueRecords = await Promise.all(
    propertyIds.map((propertyId: string) =>
      prisma.activity.create({
        data: {
          type: 'property',
          action: 'syndication_queued',
          description: `Queued property ${propertyId} for syndication (${provider})`,
          userId: req.user?.id || null,
          metadata: {
            propertyId,
            provider,
            queuedAt: queuedAt.toISOString(),
            status: 'queued',
          },
        },
      }),
    ),
  );

  res.status(201).json({
    success: true,
    data: {
      queued: queueRecords.length,
      provider,
      queuedAt: queuedAt.toISOString(),
    },
  });
}));

router.get('/sync-queue', requirePermission('view_properties'), asyncHandler(async (_req: Request, res: Response) => {
  const queued = await prisma.activity.findMany({
    where: { action: 'syndication_queued' },
    orderBy: { createdAt: 'desc' },
    take: 200,
    select: {
      id: true,
      createdAt: true,
      userId: true,
      description: true,
      metadata: true,
    },
  });

  res.status(200).json({
    success: true,
    data: queued,
    count: queued.length,
  });
}));

export default router;
