/**
 * Dashboard / Reporting API — Full Implementation
 * Endpoints: /api/dashboard
 * Provides: executive overview, KPIs, activity feed, analytics
 */

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// ─── GET /api/dashboard/summary  &  /api/dashboard/overview ─────────────
// Main dashboard overview used by CRM Hub  (frontend calls /summary)
router.get(
  ['/summary', '/overview'],
  asyncHandler(async (req: Request, res: Response) => {
    const [
      totalLeads, hotLeads, wonLeads,
      totalProperties, availableProperties,
      totalAgents,
      totalCommissions, paidCommissions,
      recentActivities,
      pipelineValue,
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: 'hot' } }),
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
        recentActivities: recentActivities.map((a: any) => ({
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

// ─── GET /api/dashboard/activities ──────────────────────────────────────
// Global activity feed
router.get(
  '/activities',
  asyncHandler(async (req: Request, res: Response) => {
    const { page = '1', pageSize = '20', type } = req.query;
    const pageNum = Math.max(1, parseInt(page as string));
    const limit = Math.min(50, Math.max(1, parseInt(pageSize as string)));

    const where: any = {};
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
      data: activities.map((a: any) => ({
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

// ─── GET /api/dashboard/executive ───────────────────────────────────────
router.get(
  '/executive',
  asyncHandler(async (req: Request, res: Response) => {
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

    const toMap = (arr: any[], keyField: string) => {
      const map: Record<string, number> = {};
      arr.forEach(item => { map[item[keyField]] = item._count._all; });
      return map;
    };

    res.status(200).json({
      success: true,
      data: {
        leads: { byStatus: toMap(leadsByStatus, 'status'), bySource: toMap(leadsBySource, 'source') },
        properties: { byStatus: toMap(propertiesByStatus, 'status'), byType: toMap(propertiesByType, 'type') },
        commissions: commissionsByStatus.map((c: any) => ({
          status: c.status, count: c._count._all, totalValue: c._sum.amount || 0,
        })),
        portfolioValue: portfolioValue._sum.price || 0,
      },
    });
  })
);

// ─── GET /api/dashboard/kpis ────────────────────────────────────────────
router.get(
  '/kpis',
  asyncHandler(async (req: Request, res: Response) => {
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
