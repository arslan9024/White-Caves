/**
 * Agents API Routes — Full Implementation
 * Endpoints: /api/agents
 * Supports: list, detail, performance metrics, commissions
 */

import { Router, Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import type { AuthRequest } from '../middleware/auth';
import { prisma } from '../database.js';
import { validateIdParam } from '../utils/validate';
import { requirePermission, requireRole } from '../middleware/rbac';
import { createLogger } from '../utils/logger.js';

const log = createLogger('Agents');

const router = Router();

// ─── GET /api/agents ──────────────────────────────────────────────────────
router.get(
  '/',
  requirePermission('manage_agents'),
  asyncHandler(async (req: Request, res: Response) => {
    // AUTHORIZATION: Agent list with performance data restricted to managers+
    const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied — agent list requires manager or above role', 403);
    }
    log.info('Agents list requested', { role: req.user?.role });

    const { status, department, search, page = '1', pageSize = '50' } = req.query;

    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(pageSize as string) || 50));

    const where: Record<string, unknown> = { role: { in: ['agent', 'owner'] } };
    const VALID_STATUSES = ['active', 'inactive', 'pending', 'suspended'];
    const VALID_DEPARTMENTS = ['sales', 'leasing', 'support', 'management', 'marketing', 'finance', 'hr', 'it'];
    if (status && VALID_STATUSES.includes(status as string)) where.status = status as string;
    if (department && VALID_DEPARTMENTS.includes(department as string)) where.department = department as string;
    if (search) {
      const s = search as string;
      where.OR = [
        { name: { contains: s, mode: 'insensitive' } },
        { email: { contains: s, mode: 'insensitive' } },
      ];
    }

    const [agents, total] = await Promise.all([
      prisma.user.findMany({
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
        skip: (pageNum - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    // Batch-fetch performance data to avoid N+1 queries
    const agentIds = agents.map((a) => a.id);

    const [wonLeadsCounts, totalLeadsCounts, commissionSums] = await Promise.all([
      // Won leads per agent in one query
      prisma.lead.groupBy({
        by: ['assignedToId'],
        where: { assignedToId: { in: agentIds }, status: 'won' },
        _count: true,
      }),
      // Total leads per agent in one query
      prisma.lead.groupBy({
        by: ['assignedToId'],
        where: { assignedToId: { in: agentIds } },
        _count: true,
      }),
      // Commission sums per agent in one query
      prisma.commission.groupBy({
        by: ['agentId'],
        where: { agentId: { in: agentIds }, status: { in: ['approved', 'paid'] } },
        _sum: { amount: true },
      }),
    ]);

    // Build lookup maps for O(1) access
    const wonMap = new Map(wonLeadsCounts.map((r) => [r.assignedToId, r._count]));
    const totalMap = new Map(totalLeadsCounts.map((r) => [r.assignedToId, r._count]));
    const commissionMap = new Map(commissionSums.map((r) => [r.agentId, r._sum.amount || 0]));

    // Enrich with performance data (no additional queries)
    const enriched = agents.map((agent) => {
      const wonLeads = wonMap.get(agent.id) || 0;
      const totalLeads = totalMap.get(agent.id) || 0;
      const revenue = commissionMap.get(agent.id) || 0;
      const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

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
    });

    res.status(200).json({
      success: true,
      data: enriched,
      pagination: { page: pageNum, pageSize: limit, total, totalPages: Math.ceil(total / limit) },
    });
  })
);

// ─── GET /api/agents/stats ──────────────────────────────────────────────
router.get(
  '/stats',
  requirePermission('manage_agents'),
  asyncHandler(async (req: Request, res: Response) => {
    // AUTHORIZATION: Only managers+ can view aggregated agent statistics
    const allowedRoles = ['owner', 'manager', 'admin'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied — agent statistics require manager role', 403);
    }

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
    validateIdParam(req.params.id, 'Agent ID');

    // IDOR protection: agents can only view their own profile; managers+ can view any
    const userRole = req.user?.role || '';
    const userId = req.user?.id || '';
    const isManagerOrAbove = ['owner', 'manager', 'admin'].includes(userRole);
    if (!isManagerOrAbove && userId !== req.params.id) {
      throw new AppError('Access denied — you can only view your own agent profile', 403);
    }

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
// AUTHORIZATION: Only the agent themselves, or a manager/owner, can view performance
router.get(
  '/:id/performance',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    validateIdParam(id, 'Agent ID');

    // IDOR protection: agents can only view their own performance
    const userRole = req.user?.role || '';
    const userId = req.user?.id || '';
    const isManagerOrAbove = ['owner', 'manager', 'admin'].includes(userRole);
    if (!isManagerOrAbove && userId !== id) {
      throw new AppError('Access denied — you can only view your own performance data', 403);
    }

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
// ─── GET /api/agents/:id/commissions ────────────────────────────────────
// AUTHORIZATION: Only the agent themselves, or a manager/owner, can view commissions
router.get(
  '/:id/commissions',
  asyncHandler(async (req: Request, res: Response) => {
    validateIdParam(req.params.id, 'Agent ID');

    // IDOR protection: agents can only view their own commission data
    const userRole = req.user?.role || '';
    const userId = req.user?.id || '';
    const isManagerOrAbove = ['owner', 'manager', 'admin'].includes(userRole);
    if (!isManagerOrAbove && userId !== req.params.id) {
      throw new AppError('Access denied — you can only view your own commission data', 403);
    }

    const { status, page = '1', pageSize = '50' } = req.query;
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(pageSize as string) || 50));

    const where: Record<string, unknown> = { agentId: req.params.id };
    if (status) where.status = status as string;

    const [commissions, total] = await Promise.all([
      prisma.commission.findMany({
        where,
        include: {
          lead: { select: { id: true, name: true } },
          property: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limit,
        take: limit,
      }),
      prisma.commission.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: commissions,
      pagination: { page: pageNum, pageSize: limit, total, totalPages: Math.ceil(total / limit) },
    });
  })
);

export default router;
