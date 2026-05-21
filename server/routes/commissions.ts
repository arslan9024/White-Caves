/**
 * Commissions API Routes
 *
 * Endpoints:
 *   GET /api/commissions          – List commissions (paginated, filterable)
 *   GET /api/commissions/summary  – Aggregate summary stats
 */

import { Router, Request, Response } from 'express';
import { requirePermission } from '../middleware/rbac.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { prisma } from '../database.js';

const router = Router();

// ── GET /api/commissions ────────────────────────────────────────────────────
router.get(
  '/',
  requirePermission('view_commissions'),
  asyncHandler(async (req: Request, res: Response) => {
    const { status, agentId, page = '1', pageSize = '50' } = req.query;
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(pageSize as string) || 50));

    const where: Record<string, unknown> = {};
    if (status && status !== 'all') where.status = status as string;
    if (agentId) where.agentId = agentId as string;

    const [rows, total] = await Promise.all([
      prisma.commission.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limit,
        take: limit,
        include: {
          agent: { select: { id: true, name: true } },
          property: { select: { id: true, title: true, type: true, price: true } },
          lead: { select: { id: true, name: true } },
        },
      }),
      prisma.commission.count({ where }),
    ]);

    const commissions = rows.map(c => ({
      _id: c.id,
      agentName: c.agent?.name ?? 'Unknown',
      propertyTitle: c.property?.title ?? '—',
      propertyType: c.property?.type ?? '—',
      transactionValue: c.property?.price ?? 0,
      clientName: c.lead?.name ?? '—',
      commissionAmount: c.amount,
      commissionRate: c.percentage ?? 0,
      status: c.status,
      createdAt: c.createdAt.toISOString(),
      paidAt: c.paidAt ? c.paidAt.toISOString() : undefined,
      notes: c.notes ?? undefined,
    }));

    res.status(200).json({
      success: true,
      data: commissions,
      pagination: { page: pageNum, pageSize: limit, total, totalPages: Math.ceil(total / limit) },
    });
  })
);

// ── GET /api/commissions/summary ────────────────────────────────────────────
router.get(
  '/summary',
  requirePermission('view_commissions'),
  asyncHandler(async (_req: Request, res: Response) => {
    const [total, byStatus, avgRate, topAgentRows] = await Promise.all([
      prisma.commission.aggregate({
        _count: { _all: true },
        _sum: { amount: true },
        _avg: { percentage: true },
      }),
      prisma.commission.groupBy({
        by: ['status'],
        _sum: { amount: true },
      }),
      prisma.commission.aggregate({ _avg: { percentage: true } }),
      prisma.commission.groupBy({
        by: ['agentId'],
        _sum: { amount: true },
        orderBy: { _sum: { amount: 'desc' } },
        take: 1,
      }),
    ]);

    const sumByStatus = (status: string): number => {
      const row = byStatus.find(r => r.status === status);
      return row?._sum?.amount ?? 0;
    };

    // Resolve top agent name if a result exists
    let topAgent: { name: string; totalCommission: number } | undefined;
    if (topAgentRows.length > 0) {
      const topRow = topAgentRows[0];
      const agent = await prisma.user.findUnique({
        where: { id: topRow.agentId },
        select: { name: true },
      });
      topAgent = {
        name: agent?.name ?? 'Unknown',
        totalCommission: topRow._sum?.amount ?? 0,
      };
    }

    res.status(200).json({
      success: true,
      data: {
        totalCommissions: total._count._all,
        totalAmount: total._sum?.amount ?? 0,
        pendingAmount: sumByStatus('pending'),
        paidAmount: sumByStatus('paid'),
        approvedAmount: sumByStatus('approved'),
        averageCommissionRate: avgRate._avg?.percentage ?? 0,
        topAgent,
      },
    });
  })
);

export default router;
