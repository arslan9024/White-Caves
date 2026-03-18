/**
 * Finance API Routes — Full Implementation
 * Commission management, financial summaries, payments
 * Endpoints: /api/finance
 */

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler, AppError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// ─── GET /api/finance/summary ───────────────────────────────────────────
router.get(
  '/summary',
  asyncHandler(async (req: Request, res: Response) => {
    const [
      totalCommissions,
      paidCommissions,
      pendingCommissions,
      approvedCommissions,
      commissionsByType,
      portfolioValue,
    ] = await Promise.all([
      prisma.commission.aggregate({ _sum: { amount: true }, _count: { _all: true } }),
      prisma.commission.aggregate({ where: { status: 'paid' }, _sum: { amount: true }, _count: { _all: true } }),
      prisma.commission.aggregate({ where: { status: 'pending' }, _sum: { amount: true }, _count: { _all: true } }),
      prisma.commission.aggregate({ where: { status: 'approved' }, _sum: { amount: true }, _count: { _all: true } }),
      prisma.commission.groupBy({ by: ['type'], _sum: { amount: true }, _count: { _all: true } }),
      prisma.property.aggregate({ where: { status: { in: ['sold', 'rented'] } }, _sum: { price: true } }),
    ]);

    const totalRevenue = portfolioValue._sum.price || 0;
    const totalCommissionValue = totalCommissions._sum.amount || 0;
    const netProfit = totalRevenue - totalCommissionValue;

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        totalExpenses: totalCommissionValue,
        netProfit,
        commissions: {
          total: { count: totalCommissions._count._all, value: totalCommissionValue },
          paid: { count: paidCommissions._count._all, value: paidCommissions._sum.amount || 0 },
          pending: { count: pendingCommissions._count._all, value: pendingCommissions._sum.amount || 0 },
          approved: { count: approvedCommissions._count._all, value: approvedCommissions._sum.amount || 0 },
        },
        byType: commissionsByType.map((c: any) => ({
          type: c.type,
          count: c._count._all,
          value: c._sum.amount || 0,
        })),
      },
    });
  })
);

// ─── GET /api/finance/commissions ───────────────────────────────────────
router.get(
  '/commissions',
  asyncHandler(async (req: Request, res: Response) => {
    const {
      page = '1', pageSize = '20',
      status, type, agentId,
      sortBy = 'createdAt', sortOrder = 'desc',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string));
    const limit = Math.min(100, Math.max(1, parseInt(pageSize as string)));

    const where: any = {};
    if (status && status !== 'all') where.status = status as string;
    if (type && type !== 'all') where.type = type as string;
    if (agentId) where.agentId = agentId as string;

    const validSorts = ['createdAt', 'amount', 'status'];
    const field = validSorts.includes(sortBy as string) ? (sortBy as string) : 'createdAt';
    const orderBy: any = { [field]: sortOrder === 'asc' ? 'asc' : 'desc' };

    const [commissions, total] = await Promise.all([
      prisma.commission.findMany({
        where,
        orderBy,
        skip: (pageNum - 1) * limit,
        take: limit,
        include: {
          agent: { select: { id: true, name: true, email: true } },
          lead: { select: { id: true, name: true } },
          property: { select: { id: true, title: true, price: true } },
        },
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

// ─── GET /api/finance/commissions/:id ───────────────────────────────────
router.get(
  '/commissions/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const commission = await prisma.commission.findUnique({
      where: { id: req.params.id },
      include: {
        agent: { select: { id: true, name: true, email: true, phone: true } },
        lead: { select: { id: true, name: true, email: true, phone: true, budget: true } },
        property: { select: { id: true, title: true, price: true, location: true, type: true } },
      },
    });

    if (!commission) throw new AppError('Commission not found', 404);

    res.status(200).json({ success: true, data: commission });
  })
);

// ─── POST /api/finance/commissions ──────────────────────────────────────
router.post(
  '/commissions',
  asyncHandler(async (req: Request, res: Response) => {
    const { agentId, amount, percentage, type, notes, leadId, propertyId } = req.body;

    if (!agentId) throw new AppError('Agent ID is required', 400);
    if (!amount || amount <= 0) throw new AppError('Valid commission amount is required', 400);

    // Verify agent exists
    const agent = await prisma.user.findUnique({ where: { id: agentId } });
    if (!agent) throw new AppError('Agent not found', 404);

    const commission = await prisma.commission.create({
      data: {
        agentId,
        amount: parseFloat(amount),
        percentage: percentage ? parseFloat(percentage) : null,
        type: type || 'sale',
        status: 'pending',
        notes: notes || null,
        leadId: leadId || null,
        propertyId: propertyId || null,
      },
      include: {
        agent: { select: { id: true, name: true, email: true } },
      },
    });

    await prisma.activity.create({
      data: {
        type: 'commission',
        action: 'created',
        description: `Commission AED ${commission.amount.toLocaleString()} created for ${agent.name || agent.email}`,
        userId: (req as any).user?.id || null,
      },
    });

    res.status(201).json({ success: true, data: commission });
  })
);

// ─── PATCH /api/finance/commissions/:id ─────────────────────────────────
router.patch(
  '/commissions/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, amount, notes } = req.body;

    const existing = await prisma.commission.findUnique({
      where: { id },
      include: { agent: { select: { name: true, email: true } } },
    });
    if (!existing) throw new AppError('Commission not found', 404);

    const data: any = {};
    if (status !== undefined) data.status = status;
    if (amount !== undefined) data.amount = parseFloat(amount);
    if (notes !== undefined) data.notes = notes;
    if (status === 'paid') data.paidAt = new Date();

    const commission = await prisma.commission.update({ where: { id }, data });

    const statusChanged = status && status !== existing.status;
    if (statusChanged) {
      await prisma.activity.create({
        data: {
          type: 'commission',
          action: 'status_changed',
          description: `Commission for ${existing.agent.name || existing.agent.email}: ${existing.status} → ${status}`,
          userId: (req as any).user?.id || null,
        },
      });
    }

    res.status(200).json({ success: true, data: commission });
  })
);

// ─── POST /api/finance/payments ─────────────────────────────────────────
// Bulk-pay approved commissions
router.post(
  '/payments',
  asyncHandler(async (req: Request, res: Response) => {
    const { commissionIds } = req.body;

    if (!Array.isArray(commissionIds) || commissionIds.length === 0) {
      throw new AppError('Provide an array of commission IDs', 400);
    }

    const result = await prisma.commission.updateMany({
      where: { id: { in: commissionIds }, status: { in: ['approved', 'pending'] } },
      data: { status: 'paid', paidAt: new Date() },
    });

    await prisma.activity.create({
      data: {
        type: 'commission',
        action: 'paid',
        description: `${result.count} commission(s) marked as paid`,
        userId: (req as any).user?.id || null,
      },
    });

    res.status(200).json({
      success: true,
      data: { paidCount: result.count },
      message: `${result.count} commission(s) paid successfully`,
    });
  })
);

export default router;
