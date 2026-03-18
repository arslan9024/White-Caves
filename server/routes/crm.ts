/**
 * CRM Dashboard & General Routes — Full Implementation
 * General CRM operations, analytics, search, and dashboard data
 * Endpoints: /api/crm
 */

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// ─── GET /api/crm/dashboard ────────────────────────────────────────────
router.get(
  '/dashboard',
  asyncHandler(async (req: Request, res: Response) => {
    const [
      leadCount, propertyCount, agentCount, activityCount,
      hotLeads, recentActivity,
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.property.count(),
      prisma.user.count({ where: { role: { in: ['agent', 'owner'] } } }),
      prisma.activity.count(),
      prisma.lead.count({ where: { status: 'hot' } }),
      prisma.activity.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { user: { select: { id: true, name: true } } },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: { leads: leadCount, properties: propertyCount, agents: agentCount, activities: activityCount, hotLeads },
        recentActivity: recentActivity.map((a: any) => ({
          id: a.id, type: a.type, action: a.action, description: a.description,
          user: a.user?.name || 'System', timestamp: a.createdAt.toISOString(),
        })),
      },
    });
  })
);

// ─── GET /api/crm/analytics ────────────────────────────────────────────
router.get(
  '/analytics',
  asyncHandler(async (req: Request, res: Response) => {
    const [leadsBySource, leadsByStatus, propertiesByType, commissionStats] = await Promise.all([
      prisma.lead.groupBy({ by: ['source'], _count: { _all: true } }),
      prisma.lead.groupBy({ by: ['status'], _count: { _all: true } }),
      prisma.property.groupBy({ by: ['type'], _count: { _all: true } }),
      prisma.commission.aggregate({ _sum: { amount: true }, _avg: { amount: true }, _count: { _all: true } }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        leads: {
          bySource: leadsBySource.map((s: any) => ({ source: s.source, count: s._count._all })),
          byStatus: leadsByStatus.map((s: any) => ({ status: s.status, count: s._count._all })),
        },
        properties: {
          byType: propertiesByType.map((t: any) => ({ type: t.type, count: t._count._all })),
        },
        commissions: {
          total: commissionStats._count._all,
          totalValue: commissionStats._sum.amount || 0,
          averageValue: Math.round(commissionStats._avg.amount || 0),
        },
      },
    });
  })
);

// ─── GET /api/crm/search ───────────────────────────────────────────────
// Global search across leads, properties, and agents
router.get(
  '/search',
  asyncHandler(async (req: Request, res: Response) => {
    const { q } = req.query;
    if (!q || (q as string).trim().length < 2) {
      return res.status(200).json({ success: true, data: { leads: [], properties: [], agents: [] } });
    }

    const term = (q as string).trim();

    const [leads, properties, agents] = await Promise.all([
      prisma.lead.findMany({
        where: {
          OR: [
            { name: { contains: term, mode: 'insensitive' } },
            { email: { contains: term, mode: 'insensitive' } },
            { company: { contains: term, mode: 'insensitive' } },
          ],
        },
        select: { id: true, name: true, email: true, status: true, source: true },
        take: 10,
      }),
      prisma.property.findMany({
        where: {
          OR: [
            { title: { contains: term, mode: 'insensitive' } },
            { location: { contains: term, mode: 'insensitive' } },
          ],
        },
        select: { id: true, title: true, location: true, price: true, status: true },
        take: 10,
      }),
      prisma.user.findMany({
        where: {
          role: { in: ['agent', 'owner'] },
          OR: [
            { name: { contains: term, mode: 'insensitive' } },
            { email: { contains: term, mode: 'insensitive' } },
          ],
        },
        select: { id: true, name: true, email: true, role: true, department: true },
        take: 10,
      }),
    ]);

    res.status(200).json({
      success: true,
      data: { leads, properties, agents },
      totalResults: leads.length + properties.length + agents.length,
    });
  })
);

// ─── GET /api/crm/export ───────────────────────────────────────────────
router.get(
  '/export',
  asyncHandler(async (req: Request, res: Response) => {
    const { entity = 'leads', format = 'json' } = req.query;

    let data: any[] = [];
    switch (entity) {
      case 'leads':
        data = await prisma.lead.findMany({ include: { assignedTo: { select: { name: true } } } });
        break;
      case 'properties':
        data = await prisma.property.findMany();
        break;
      case 'agents':
        data = await prisma.user.findMany({ where: { role: { in: ['agent', 'owner'] } } });
        break;
      case 'commissions':
        data = await prisma.commission.findMany({ include: { agent: { select: { name: true } } } });
        break;
    }

    res.status(200).json({
      success: true,
      data,
      meta: { entity, format, count: data.length, exportedAt: new Date().toISOString() },
    });
  })
);

export default router;
