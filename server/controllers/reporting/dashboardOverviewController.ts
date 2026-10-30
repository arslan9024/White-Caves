/**
 * dashboardOverviewController.ts
 * Handlers for widget config, user dashboard preferences, summary overview, activity feed, and cache stats.
 */

import { Request, Response } from 'express';
import { prisma } from '../../database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { getDashboardRoleConfig } from '../../config/dashboardConfigs.js';
import { cacheService } from '../../services/CacheService.js';

export async function getDashboardConfig(req: Request, res: Response): Promise<void> {
  const role = req.user?.role || 'agent';
  const config = getDashboardRoleConfig(role);

  res.status(200).json({
    success: true,
    data: config,
  });
}

export async function getDashboardPreferences(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id;
  const role = req.user?.role || 'agent';

  if (!userId) {
    throw new AppError('User context missing', 401);
  }

  const preference = await prisma.userDashboardPreference.findUnique({
    where: { userId },
  });

  const fallback = {
    role,
    widgets: getDashboardRoleConfig(role).widgets,
    layout: 'default',
  };

  res.status(200).json({
    success: true,
    data: preference
      ? {
          role: preference.role,
          widgets: preference.widgets,
          layout: preference.layout,
          updatedAt: preference.updatedAt,
        }
      : fallback,
  });
}

export async function updateDashboardPreferences(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id;
  const role = req.user?.role || 'agent';
  const { widgets, layout } = req.body as {
    widgets?: unknown;
    layout?: string;
  };

  if (!userId) {
    throw new AppError('User context missing', 401);
  }

  if (!Array.isArray(widgets)) {
    throw new AppError('widgets must be an array', 400);
  }

  const updated = await prisma.userDashboardPreference.upsert({
    where: { userId },
    update: {
      role,
      widgets,
      layout: layout || 'default',
    },
    create: {
      userId,
      role,
      widgets,
      layout: layout || 'default',
    },
  });

  res.status(200).json({
    success: true,
    data: {
      role: updated.role,
      widgets: updated.widgets,
      layout: updated.layout,
      updatedAt: updated.updatedAt,
    },
  });
}

export async function getDashboardSummary(req: Request, res: Response): Promise<void> {
  const userRole = req.user?.role || '';
  const allowedRoles = ['owner', 'manager', 'admin', 'finance', 'managing_director'];
  if (!allowedRoles.includes(userRole)) {
    throw new AppError('Access denied — dashboard summary requires manager or higher role', 403);
  }

  const cacheKey = `wc:dashboard:summary:${userRole}`;
  const data = await cacheService.getOrSet(
    cacheKey,
    async () => {
      const [
        totalLeads,
        hotLeads,
        wonLeads,
        totalProperties,
        availableProperties,
        totalAgents,
        totalCommissions,
        paidCommissions,
        recentActivities,
        pipelineValue,
      ] = await Promise.all([
        prisma.lead.count(),
        prisma.lead.count({ where: { status: 'qualified' } }),
        prisma.lead.count({ where: { status: 'won' } }),
        prisma.property.count(),
        prisma.property.count({ where: { status: 'available' } }),
        prisma.user.count({ where: { role: { in: ['agent', 'owner'] } } }),
        prisma.commission.aggregate({ _sum: { amount: true }, _count: { _all: true } }),
        prisma.commission.aggregate({ where: { status: 'paid' }, _sum: { amount: true } }),
        prisma.activity.findMany({
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { user: { select: { id: true, name: true } } },
        }),
        prisma.lead.aggregate({
          where: { status: { notIn: ['won', 'lost'] } },
          _sum: { budget: true },
        }),
      ]);

      return {
        metrics: {
          totalLeads,
          hotLeads,
          wonLeads,
          conversionRate: totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0,
          totalProperties,
          availableProperties,
          totalAgents,
          totalCommissions: totalCommissions._count._all,
          totalCommissionValue: totalCommissions._sum.amount || 0,
          paidCommissionValue: paidCommissions._sum.amount || 0,
          pipelineValue: pipelineValue._sum.budget || 0,
        },
        recentActivities: recentActivities.map(a => ({
          id: a.id,
          type: a.type,
          action: a.action,
          description: a.description,
          timestamp: a.createdAt.toISOString(),
          user: a.user?.name || 'System',
        })),
      };
    },
    300
  );

  res.status(200).json({
    success: true,
    data,
  });
}

export async function getDashboardActivities(req: Request, res: Response): Promise<void> {
  const allowedRoles = ['owner', 'manager', 'admin'];
  if (!allowedRoles.includes(req.user?.role || '')) {
    throw new AppError('Access denied — activity feed requires manager or above role', 403);
  }

  const { page = '1', pageSize = '20', type } = req.query as Record<string, string | undefined>;
  const pageNum = Math.max(1, parseInt(page as string) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(pageSize as string) || 20));

  const where: Record<string, unknown> = {};
  if (type && type !== 'all') where.type = type as string;

  const [activities, total] = await Promise.all([
    prisma.activity.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (pageNum - 1) * limit,
      take: limit,
      include: {
        user: { select: { id: true, name: true } },
        lead: { select: { id: true, name: true } },
      },
    }),
    prisma.activity.count({ where }),
  ]);

  res.status(200).json({
    success: true,
    data: activities.map(a => ({
      id: a.id,
      type: a.type,
      action: a.action,
      description: a.description,
      timestamp: a.createdAt.toISOString(),
      user: a.user?.name || 'System',
      metadata: a.metadata,
      lead: a.lead ? { id: a.lead.id, name: a.lead.name } : null,
    })),
    pagination: {
      page: pageNum,
      pageSize: limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function getCacheStats(_req: Request, res: Response): Promise<void> {
  const stats = cacheService.getStats();
  res.status(200).json({ success: true, data: stats });
}
