/**
 * Agent Metrics & Commission Controller
 * Handlers for calculating agent performance scores, conversion rates, and commission breakdown.
 */

import { Request, Response } from 'express';
import { prisma } from '../../database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { validateIdParam } from '../../utils/validate.js';
import { RouteRequest, routeParamToString } from './agentCommon.js';

export const getAgentPerformance = async (req: RouteRequest, res: Response): Promise<void> => {
  const { id } = req.params as Record<string, string>;
  validateIdParam(id, 'Agent ID');

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
        total: totalLeads,
        won: wonLeads,
        lost: lostLeads,
        active: totalLeads - wonLeads - lostLeads,
        conversionRate,
      },
      commissions: {
        total: totalCommissions._count._all,
        totalValue: totalCommissions._sum.amount || 0,
        paidValue: paidCommissions._sum.amount || 0,
        pendingValue: (totalCommissions._sum.amount || 0) - (paidCommissions._sum.amount || 0),
      },
      performanceScore: Math.min(100, Math.round(conversionRate * 0.4 + wonLeads * 3 + 30)),
    },
  });
};

export const getAgentCommissions = async (req: Request, res: Response): Promise<void> => {
  const agentId = routeParamToString(req.params.id);
  if (!agentId) {
    throw new AppError('Agent ID is required', 400);
  }
  validateIdParam(agentId, 'Agent ID');

  const userRole = req.user?.role || '';
  const userId = req.user?.id || '';
  const isManagerOrAbove = ['owner', 'manager', 'admin'].includes(userRole);
  if (!isManagerOrAbove && userId !== agentId) {
    throw new AppError('Access denied — you can only view your own commission data', 403);
  }

  const { status, page = '1', pageSize = '50' } = req.query as Record<string, string | undefined>;
  const pageNum = Math.max(1, parseInt(page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(pageSize as string) || 50));

  const where: Record<string, unknown> = { agentId };
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
};

