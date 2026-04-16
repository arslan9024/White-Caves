/**
 * Dashboard / Reporting API â€” Full Implementation
 * Endpoints: /api/dashboard
 * Provides: executive overview, KPIs, activity feed, analytics
 */

import { Router, Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import type { AuthRequest } from '../middleware/auth';
import { prisma } from '../database.js';
import { requirePermission } from '../middleware/rbac';
import { createLogger } from '../utils/logger.js';

const log = createLogger('Reporting');

const router = Router();

// â”€â”€â”€ GET /api/dashboard/summary  &  /api/dashboard/overview â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Main dashboard overview used by CRM Hub  (frontend calls /summary)
// Also handles role-based routes: /admin/summary, /:role/summary
router.get(
  ['/summary', '/overview', '/admin/summary', '/:role/summary'],
  requirePermission('view_analytics'),
  asyncHandler(async (req: Request, res: Response) => {
    // AUTHORIZATION: Financial metrics restricted to managers/owners
    const userRole = req.user?.role || '';
    const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
    if (!allowedRoles.includes(userRole)) {
      throw new AppError('Access denied â€” dashboard summary requires manager or higher role', 403);
    }

    const [
      totalLeads, hotLeads, wonLeads,
      totalProperties, availableProperties,
      totalAgents,
      totalCommissions, paidCommissions,
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

    res.status(200).json({
      success: true,
      data: {
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
        recentActivities: recentActivities.map((a) => ({
          id: a.id,
          type: a.type,
          action: a.action,
          description: a.description,
          timestamp: a.createdAt.toISOString(),
          user: a.user?.name || 'System',
        })),
      },
    });
  })
);

// â”€â”€â”€ GET /api/dashboard/activities â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Global activity feed
router.get(
  '/activities',
  requirePermission('view_all_reports'),
  asyncHandler(async (req: Request, res: Response) => {
    // AUTHORIZATION: Only managers+ can access global activity feed
    const allowedRoles = ['owner', 'manager', 'admin'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied â€” activity feed requires manager or above role', 403);
    }

    const { page = '1', pageSize = '20', type } = req.query;
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
      data: activities.map((a) => ({
        id: a.id,
        type: a.type,
        action: a.action,
        description: a.description,
        timestamp: a.createdAt.toISOString(),
        user: a.user?.name || 'System',
        lead: a.lead ? { id: a.lead.id, name: a.lead.name } : null,
        metadata: a.metadata,
      })),
      pagination: { page: pageNum, pageSize: limit, total, totalPages: Math.ceil(total / limit) },
    });
  })
);

// â”€â”€â”€ GET /api/dashboard/executive â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.get(
  '/executive',
  requirePermission('view_all_reports'),
  asyncHandler(async (req: Request, res: Response) => {
    // AUTHORIZATION: Only managers+ can access executive analytics
    const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied â€” executive analytics requires manager or above role', 403);
    }
    const [
      leadsByStatus, leadsBySource,
      propertiesByStatus, propertiesByType,
      commissionsByStatus,
      portfolioValue,
    ] = await Promise.all([
      prisma.lead.groupBy({ by: ['status'], _count: { _all: true } }),
      prisma.lead.groupBy({ by: ['source'], _count: { _all: true } }),
      prisma.property.groupBy({ by: ['status'], _count: { _all: true } }),
      prisma.property.groupBy({ by: ['type'], _count: { _all: true } }),
      prisma.commission.groupBy({ by: ['status'], _count: { _all: true }, _sum: { amount: true } }),
      prisma.property.aggregate({ _sum: { price: true } }),
    ]);

    const toMap = (arr: Array<{ _count: { _all: number }; [key: string]: unknown }>, keyField: string) => {
      const map: Record<string, number> = {};
      arr.forEach(item => { map[String(item[keyField])] = item._count._all; });
      return map;
    };

    res.status(200).json({
      success: true,
      data: {
        leads: { byStatus: toMap(leadsByStatus, 'status'), bySource: toMap(leadsBySource, 'source') },
        properties: { byStatus: toMap(propertiesByStatus, 'status'), byType: toMap(propertiesByType, 'type') },
        commissions: commissionsByStatus.map((c) => ({
          status: c.status, count: c._count._all, totalValue: c._sum.amount || 0,
        })),
        portfolioValue: portfolioValue._sum.price || 0,
      },
    });
  })
);

// â”€â”€â”€ GET /api/dashboard/kpis â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.get(
  '/kpis',
  requirePermission('view_analytics'),
  asyncHandler(async (req: Request, res: Response) => {
    // AUTHORIZATION: Only managers+ can access KPI metrics
    const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied â€” KPI data requires manager or above role', 403);
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      newLeads30d, wonDeals30d, newProperties30d,
      totalRevenue, avgDealSize,
    ] = await Promise.all([
      prisma.lead.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.lead.count({ where: { status: 'won', updatedAt: { gte: thirtyDaysAgo } } }),
      prisma.property.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.commission.aggregate({ where: { status: 'paid' }, _sum: { amount: true } }),
      prisma.commission.aggregate({ where: { status: 'paid' }, _avg: { amount: true } }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        period: '30d',
        kpis: {
          newLeads: newLeads30d,
          wonDeals: wonDeals30d,
          newListings: newProperties30d,
          totalRevenue: totalRevenue._sum.amount || 0,
          avgDealSize: Math.round(avgDealSize._avg.amount || 0),
        },
      },
    });
  })
);

export default router;
