/**
 * Agents API Routes — Full Implementation
 * Endpoints: /api/agents
 * Supports: list, detail, performance metrics, commissions
 */

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler, AppError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// ─── GET /api/agents ────────────────────────────────────────────────────
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { status, department, search } = req.query;

    const where: any = { role: { in: ['agent', 'owner'] } };
    if (status) where.status = status as string;
    if (department) where.department = department as string;
    if (search) {
      const s = search as string;
      where.OR = [
        { name: { contains: s, mode: 'insensitive' } },
        { email: { contains: s, mode: 'insensitive' } },
      ];
    }

    const agents = await prisma.user.findMany({
      where,
      select: {
        id: true, name: true, email: true, phone: true, role: true,
        department: true, status: true, photoUrl: true, createdAt: true,
        _count: {
          select: {
            leadsAssigned: true,
            commissions: true,
            properties: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    // Enrich with performance data
    const enriched = await Promise.all(
      agents.map(async (agent) => {
        const [wonLeads, totalLeads, totalCommissionValue] = await Promise.all([
          prisma.lead.count({ where: { assignedToId: agent.id, status: 'won' } }),
          prisma.lead.count({ where: { assignedToId: agent.id } }),
          prisma.commission.aggregate({
            where: { agentId: agent.id, status: { in: ['approved', 'paid'] } },
            _sum: { amount: true },
          }),
        ]);

        const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;
        const revenue = totalCommissionValue._sum.amount || 0;

        return {
          ...agent,
          deals_closed: wonLeads,
          leads_assigned: totalLeads,
          revenue_generated: revenue,
          conversion_rate: conversionRate,
          performance: Math.min(100, Math.round(
            (conversionRate * 0.4) + (wonLeads * 3) + (revenue > 0 ? 20 : 0) + 30
          )),
        };
      })
    );

    res.status(200).json({ success: true, data: enriched });
  })
);

// ─── GET /api/agents/stats ──────────────────────────────────────────────
router.get(
  '/stats',
  asyncHandler(async (req: Request, res: Response) => {
    const [total, online, byDepartment] = await Promise.all([
      prisma.user.count({ where: { role: { in: ['agent', 'owner'] } } }),
      prisma.user.count({ where: { role: { in: ['agent', 'owner'] }, status: 'active' } }),
      prisma.user.groupBy({
        by: ['department'],
        where: { role: { in: ['agent', 'owner'] } },
        _count: { _all: true },
      }),
    ]);

    const deptCounts: Record<string, number> = {};
    byDepartment.forEach(d => { deptCounts[d.department || 'Unassigned'] = d._count._all; });

    res.status(200).json({
      success: true,
      data: { total, active: online, byDepartment: deptCounts },
    });
  })
);

// ─── GET /api/agents/:id ────────────────────────────────────────────────
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const agent = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true, name: true, email: true, phone: true, role: true,
        department: true, status: true, photoUrl: true, createdAt: true,
        leadsAssigned: {
          select: { id: true, name: true, status: true, budget: true },
          take: 10, orderBy: { createdAt: 'desc' },
        },
        commissions: {
          select: { id: true, amount: true, status: true, type: true, createdAt: true },
          take: 10, orderBy: { createdAt: 'desc' },
        },
        properties: {
          select: { id: true, title: true, status: true, price: true },
          take: 10, orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!agent) throw new AppError('Agent not found', 404);

    res.status(200).json({ success: true, data: agent });
  })
);

// ─── GET /api/agents/:id/performance ────────────────────────────────────
router.get(
  '/:id/performance',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const agent = await prisma.user.findUnique({ where: { id } });
    if (!agent) throw new AppError('Agent not found', 404);

    const [totalLeads, wonLeads, lostLeads, totalCommissions, paidCommissions] = await Promise.all([
      prisma.lead.count({ where: { assignedToId: id } }),
      prisma.lead.count({ where: { assignedToId: id, status: 'won' } }),
      prisma.lead.count({ where: { assignedToId: id, status: 'lost' } }),
      prisma.commission.aggregate({
        where: { agentId: id },
        _sum: { amount: true },
        _count: { _all: true },
      }),
      prisma.commission.aggregate({
        where: { agentId: id, status: 'paid' },
        _sum: { amount: true },
      }),
    ]);

    const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        agent: { id: agent.id, name: agent.name, email: agent.email, department: agent.department },
        leads: {
          total: totalLeads, won: wonLeads, lost: lostLeads,
          active: totalLeads - wonLeads - lostLeads,
          conversionRate,
        },
        commissions: {
          total: totalCommissions._count._all,
          totalValue: totalCommissions._sum.amount || 0,
          paidValue: paidCommissions._sum.amount || 0,
          pendingValue: (totalCommissions._sum.amount || 0) - (paidCommissions._sum.amount || 0),
        },
        performanceScore: Math.min(100, Math.round(
          (conversionRate * 0.4) + (wonLeads * 3) + 30
        )),
      },
    });
  })
);

// ─── GET /api/agents/:id/commissions ────────────────────────────────────
router.get(
  '/:id/commissions',
  asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.query;
    const where: any = { agentId: req.params.id };
    if (status) where.status = status as string;

    const commissions = await prisma.commission.findMany({
      where,
      include: {
        lead: { select: { id: true, name: true } },
        property: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ success: true, data: commissions });
  })
);

export default router;
