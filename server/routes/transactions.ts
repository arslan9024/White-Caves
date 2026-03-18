/**
 * Transactions API Routes — Full Implementation
 * Sales and lease transaction management
 * Endpoints: /api/transactions
 */

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler, AppError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// ─── GET /api/transactions ──────────────────────────────────────────────
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const {
      page = '1', pageSize = '20',
      status, type,
      sortBy = 'createdAt', sortOrder = 'desc',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string));
    const limit = Math.min(100, Math.max(1, parseInt(pageSize as string)));

    const where: any = {};
    if (status && status !== 'all') where.status = status as string;
    if (type && type !== 'all') where.type = type as string;

    const validSorts = ['createdAt', 'amount', 'status', 'closingDate'];
    const field = validSorts.includes(sortBy as string) ? (sortBy as string) : 'createdAt';
    const orderBy: any = { [field]: sortOrder === 'asc' ? 'asc' : 'desc' };

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy,
        skip: (pageNum - 1) * limit,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: transactions,
      pagination: { page: pageNum, pageSize: limit, total, totalPages: Math.ceil(total / limit) },
    });
  })
);

// ─── GET /api/transactions/stats ────────────────────────────────────────
router.get(
  '/stats',
  asyncHandler(async (req: Request, res: Response) => {
    const [total, byStatus, byType, valueStats] = await Promise.all([
      prisma.transaction.count(),
      prisma.transaction.groupBy({ by: ['status'], _count: { _all: true } }),
      prisma.transaction.groupBy({ by: ['type'], _count: { _all: true }, _sum: { amount: true } }),
      prisma.transaction.aggregate({
        _sum: { amount: true },
        _avg: { amount: true },
        _count: { _all: true },
      }),
    ]);

    const statusCounts: Record<string, number> = {};
    byStatus.forEach((s: any) => { statusCounts[s.status] = s._count._all; });

    res.status(200).json({
      success: true,
      data: {
        total,
        byStatus: statusCounts,
        byType: byType.map((t: any) => ({ type: t.type, count: t._count._all, value: t._sum.amount || 0 })),
        totalValue: valueStats._sum.amount || 0,
        averageValue: Math.round(valueStats._avg.amount || 0),
      },
    });
  })
);

// ─── GET /api/transactions/:id ──────────────────────────────────────────
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const transaction = await prisma.transaction.findUnique({
      where: { id: req.params.id },
    });

    if (!transaction) throw new AppError('Transaction not found', 404);
    res.status(200).json({ success: true, data: transaction });
  })
);

// ─── POST /api/transactions ─────────────────────────────────────────────
router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { type, amount, propertyId, leadId, agentId, closingDate, notes } = req.body;

    if (!amount || amount <= 0) throw new AppError('Valid amount is required', 400);

    const transaction = await prisma.transaction.create({
      data: {
        type: type || 'sale',
        status: 'draft',
        amount: parseFloat(amount),
        propertyId: propertyId || null,
        leadId: leadId || null,
        agentId: agentId || null,
        closingDate: closingDate ? new Date(closingDate) : null,
        notes: notes || null,
        documents: [],
      },
    });

    await prisma.activity.create({
      data: {
        type: 'deal',
        action: 'created',
        description: `New ${transaction.type} transaction created — AED ${transaction.amount.toLocaleString()}`,
        userId: (req as any).user?.id || null,
      },
    });

    res.status(201).json({ success: true, data: transaction });
  })
);

// ─── PATCH /api/transactions/:id ────────────────────────────────────────
router.patch(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, amount, type, closingDate, notes, documents } = req.body;

    const existing = await prisma.transaction.findUnique({ where: { id } });
    if (!existing) throw new AppError('Transaction not found', 404);

    const data: any = {};
    if (status !== undefined) data.status = status;
    if (amount !== undefined) data.amount = parseFloat(amount);
    if (type !== undefined) data.type = type;
    if (closingDate !== undefined) data.closingDate = closingDate ? new Date(closingDate) : null;
    if (notes !== undefined) data.notes = notes;
    if (documents !== undefined) data.documents = documents;

    const transaction = await prisma.transaction.update({ where: { id }, data });

    const statusChanged = status && status !== existing.status;
    if (statusChanged) {
      await prisma.activity.create({
        data: {
          type: 'deal',
          action: 'status_changed',
          description: `Transaction ${existing.status} → ${status} (AED ${transaction.amount.toLocaleString()})`,
          userId: (req as any).user?.id || null,
        },
      });
    }

    res.status(200).json({ success: true, data: transaction });
  })
);

// ─── DELETE /api/transactions/:id ───────────────────────────────────────
router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const existing = await prisma.transaction.findUnique({ where: { id } });
    if (!existing) throw new AppError('Transaction not found', 404);

    await prisma.transaction.delete({ where: { id } });

    await prisma.activity.create({
      data: {
        type: 'deal',
        action: 'deleted',
        description: `Transaction deleted — AED ${existing.amount.toLocaleString()}`,
        userId: (req as any).user?.id || null,
      },
    });

    res.status(200).json({ success: true, message: 'Transaction deleted' });
  })
);

export default router;
