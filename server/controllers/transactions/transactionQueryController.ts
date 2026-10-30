/**
 * Transaction Query Controller
 * Handlers for transaction listings, aggregation statistics, and individual record retrieval.
 */

import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../../database.js';
import { parsePagination } from '../../config/pagination.js';
import { AppError } from '../../middleware/errorHandler.js';
import { validateIdParam } from '../../utils/validate.js';
import type { AuthRequest } from '../../middleware/auth.js';

export const getTransactions = async (req: Request, res: Response): Promise<void> => {
  // AUTHORIZATION: Transactions visible to owner/manager/admin/finance/agent
  const allowedRoles = ['owner', 'manager', 'admin', 'finance', 'agent'];
  if (!allowedRoles.includes(req.user?.role || '')) {
    throw new AppError('Access denied — insufficient role for transaction data', 403);
  }

  const {
    status,
    type,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query as Record<string, string | undefined>;

  const {
    page: pageNum,
    limit,
    skip,
  } = parsePagination({
    page: req.query.page as string,
    limit: req.query.pageSize as string,
  });

  const where: Prisma.TransactionWhereInput = {};
  if (status && status !== 'all') where.status = status as string;
  if (type && type !== 'all') where.type = type as string;

  const validSorts = ['createdAt', 'amount', 'status', 'closingDate'];
  const field = validSorts.includes(sortBy as string) ? (sortBy as string) : 'createdAt';
  const orderBy: Prisma.TransactionOrderByWithRelationInput = {
    [field]: sortOrder === 'asc' ? 'asc' : 'desc',
  };

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  res.status(200).json({
    success: true,
    data: transactions,
    pagination: { page: pageNum, pageSize: limit, total, totalPages: Math.ceil(total / limit) },
  });
};

export const getTransactionStats = async (req: Request, res: Response): Promise<void> => {
  const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
  if (!allowedRoles.includes((req as AuthRequest).user?.role || '')) {
    throw new AppError('Access denied — transaction statistics require manager role', 403);
  }
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
  byStatus.forEach(s => {
    statusCounts[s.status] = s._count._all;
  });

  res.status(200).json({
    success: true,
    data: {
      total,
      byStatus: statusCounts,
      byType: byType.map(t => ({
        type: t.type,
        count: t._count._all,
        value: t._sum.amount || 0,
      })),
      totalValue: valueStats._sum.amount || 0,
      averageValue: Math.round(valueStats._avg.amount || 0),
    },
  });
};

export const getTransactionById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as Record<string, string>;
  validateIdParam(id, 'Transaction ID');

  const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
  if (!allowedRoles.includes(req.user?.role || '')) {
    throw new AppError('Access denied — only managers can view transaction details', 403);
  }

  const transaction = await prisma.transaction.findUnique({
    where: { id },
  });

  if (!transaction) throw new AppError('Transaction not found', 404);
  res.status(200).json({ success: true, data: transaction });
};

