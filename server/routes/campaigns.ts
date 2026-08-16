/**
 * Broadcast Campaigns API Routes — Wave 38 (REQ-WA-005)
 *
 * Endpoints:
 * - GET    /api/campaigns — List campaigns
 * - POST   /api/campaigns — Create new campaign
 * - GET    /api/campaigns/:id — Get campaign detail
 * - POST   /api/campaigns/:id/execute — Execute campaign broadcast
 * - GET    /api/campaigns/:id/analytics — Get campaign analytics & funnel metrics
 */

import { Router, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../database.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { requirePermission } from '../middleware/rbac.js';
import { executeCampaign, getCampaignAnalytics } from '../services/broadcastCampaignService.js';
import { validateIdParam } from '../utils/validate.js';

const router = Router();

// ─── GET /api/campaigns — List campaigns ──────────────────────────────────
router.get(
  '/',
  requirePermission('manage_marketing'),
  asyncHandler(async (_req: Request, res: Response) => {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.status(200).json({
      success: true,
      data: campaigns,
    });
  })
);

// ─── POST /api/campaigns — Create new campaign ───────────────────────────
router.post(
  '/',
  requirePermission('manage_marketing'),
  asyncHandler(async (req: Request, res: Response) => {
    const { name, templateName, templateLanguage, templateVars, audienceFilter, scheduledAt } = req.body as {
      name: string;
      templateName: string;
      templateLanguage?: string;
      templateVars?: Record<string, unknown>;
      audienceFilter?: Record<string, unknown>;
      scheduledAt?: string;
    };

    if (!name || !templateName) {
      throw new AppError('name and templateName are required', 400);
    }

    const campaign = await prisma.campaign.create({
      data: {
        name: name.trim(),
        templateName: templateName.trim(),
        templateLanguage: templateLanguage || 'en',
        templateVars: templateVars ? (templateVars as Prisma.InputJsonObject) : undefined,
        audienceFilter: audienceFilter ? (audienceFilter as Prisma.InputJsonObject) : undefined,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        createdById: req.user?.id || null,
        status: scheduledAt ? 'scheduled' : 'draft',
      },
    });

    res.status(201).json({
      success: true,
      data: campaign,
    });
  })
);

// ─── GET /api/campaigns/:id — Get campaign detail ────────────────────────
router.get(
  '/:id',
  requirePermission('manage_marketing'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as Record<string, string>;
    validateIdParam(id, 'Campaign ID');

    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        recipients: {
          take: 100,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!campaign) {
      throw new AppError('Campaign not found', 404);
    }

    res.status(200).json({
      success: true,
      data: campaign,
    });
  })
);

// ─── POST /api/campaigns/:id/execute — Execute campaign broadcast ───────
router.post(
  '/:id/execute',
  requirePermission('manage_marketing'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as Record<string, string>;
    validateIdParam(id, 'Campaign ID');

    const result = await executeCampaign(id);

    res.status(200).json({
      success: true,
      data: result,
    });
  })
);

// ─── GET /api/campaigns/:id/analytics — Get campaign analytics ───────────
router.get(
  '/:id/analytics',
  requirePermission('manage_marketing'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as Record<string, string>;
    validateIdParam(id, 'Campaign ID');

    const analytics = await getCampaignAnalytics(id);

    res.status(200).json({
      success: true,
      data: analytics,
    });
  })
);

export default router;
