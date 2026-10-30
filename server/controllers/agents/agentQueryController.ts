/**
 * Agent Query Controller
 * Handlers for agent list caching, directory aggregation, statistics, and profile detail.
 */

import { Request, Response } from 'express';
import { prisma } from '../../database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { validateIdParam } from '../../utils/validate.js';
import { cacheService } from '../../services/CacheService.js';
import {
  RouteRequest,
  CACHE_TTL_AGENTS,
  VALID_STATUSES,
  VALID_DEPARTMENTS,
  routeParamToString,
} from './agentCommon.js';

export const getAgents = async (req: RouteRequest, res: Response): Promise<void> => {
  const {
    status,
    department,
    search,
    page = '1',
    pageSize = '50',
  } = req.query as Record<string, string | undefined>;

  // Build cache key from stable query params
  const queryKey = Object.keys(req.query)
    .sort()
    .map(k => `${k}=${req.query[k]}`)
    .join('&');
  const cacheKey = `agents:list:${queryKey}`;
  const cached = await cacheService.get(cacheKey);
  if (cached !== null) {
    res.setHeader('X-Cache', 'HIT');
    res.status(200).json(cached);
    return;
  }

  const pageNum = Math.max(1, parseInt(page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(pageSize as string) || 50));

  const where: Record<string, unknown> = { role: { in: ['agent', 'owner'] } };
  if (status && VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
    where.status = status as string;
  }
  if (department && VALID_DEPARTMENTS.includes(department as (typeof VALID_DEPARTMENTS)[number])) {
    where.department = department as string;
  }
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
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        department: true,
        status: true,
        photoUrl: true,
        createdAt: true,
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
  const agentIds = agents.map(a => a.id);

  const [wonLeadsCounts, totalLeadsCounts, commissionSums] = await Promise.all([
    prisma.lead.groupBy({
      by: ['assignedToId'],
      where: { assignedToId: { in: agentIds }, status: 'won' },
      _count: true,
    }),
    prisma.lead.groupBy({
      by: ['assignedToId'],
      where: { assignedToId: { in: agentIds } },
      _count: true,
    }),
    prisma.commission.groupBy({
      by: ['agentId'],
      where: { agentId: { in: agentIds }, status: { in: ['approved', 'paid'] } },
      _sum: { amount: true },
    }),
  ]);

  // Build lookup maps for O(1) access
  const wonMap = new Map(wonLeadsCounts.map(r => [r.assignedToId, r._count]));
  const totalMap = new Map(totalLeadsCounts.map(r => [r.assignedToId, r._count]));
  const commissionMap = new Map(commissionSums.map(r => [r.agentId, r._sum.amount || 0]));

  // Enrich with performance data (no additional queries)
  const enriched = agents.map(agent => {
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
      performance: Math.min(
        100,
        Math.round(conversionRate * 0.4 + wonLeads * 3 + (revenue > 0 ? 20 : 0) + 30)
      ),
    };
  });

  const payload = {
    success: true,
    data: enriched,
    pagination: { page: pageNum, pageSize: limit, total, totalPages: Math.ceil(total / limit) },
  };

  await cacheService.set(cacheKey, payload, CACHE_TTL_AGENTS);
  res.setHeader('X-Cache', 'MISS');
  res.status(200).json(payload);
};

export const getAgentStats = async (req: RouteRequest, res: Response): Promise<void> => {
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
  byDepartment.forEach(d => {
    deptCounts[d.department || 'Unassigned'] = d._count._all;
  });

  res.status(200).json({
    success: true,
    data: { total, active: online, byDepartment: deptCounts },
  });
};

export const getAgentById = async (req: Request, res: Response): Promise<void> => {
  const agentId = routeParamToString(req.params.id);
  if (!agentId) {
    throw new AppError('Agent ID is required', 400);
  }
  validateIdParam(agentId, 'Agent ID');

  const userRole = req.user?.role || '';
  const userId = req.user?.id || '';
  const isManagerOrAbove = ['owner', 'manager', 'admin'].includes(userRole);
  if (!isManagerOrAbove && userId !== agentId) {
    throw new AppError('Access denied — you can only view your own agent profile', 403);
  }

  const agent = await prisma.user.findUnique({
    where: { id: agentId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      department: true,
      status: true,
      photoUrl: true,
      createdAt: true,
      leadsAssigned: {
        select: { id: true, name: true, status: true, budget: true },
        take: 10,
        orderBy: { createdAt: 'desc' },
      },
      commissions: {
        select: { id: true, amount: true, status: true, type: true, createdAt: true },
        take: 10,
        orderBy: { createdAt: 'desc' },
      },
      properties: {
        select: { id: true, title: true, status: true, price: true },
        take: 10,
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!agent) throw new AppError('Agent not found', 404);

  res.status(200).json({ success: true, data: agent });
};

