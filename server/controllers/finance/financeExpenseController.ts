import { Request, Response } from 'express';
import { readFile } from 'fs/promises';
import { prisma } from '../../database.js';
import { AppError, asyncHandler } from '../../middleware/errorHandler.js';
import { sanitizeString } from '../../utils/sanitize.js';
import { validateIdParam } from '../../utils/validate.js';
import { AuthRequest } from '../../middleware/auth.js';
import {
  EXPENSE_SCHEMA_PATH,
  RouteRequest,
  routeParamToString,
} from './financeCommon.js';

export const getExpenses = asyncHandler(async (req: RouteRequest, res: Response) => {
  const {
    page = '1',
    pageSize = '20',
    status,
    category,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query as Record<string, string | undefined>;

  const pageNum = Math.max(1, parseInt(page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(pageSize as string) || 20));

  const where: Record<string, unknown> = {};
  if (status && status !== 'all') where.status = status as string;
  if (category && category !== 'all') where.category = category as string;

  const validSorts = ['createdAt', 'amount', 'date', 'status', 'category'];
  const field = validSorts.includes(sortBy as string) ? (sortBy as string) : 'createdAt';
  const orderBy: Record<string, 'asc' | 'desc'> = {
    [field]: sortOrder === 'asc' ? 'asc' : 'desc',
  };

  const [expenses, total] = await Promise.all([
    prisma.expense.findMany({ where, orderBy, skip: (pageNum - 1) * limit, take: limit }),
    prisma.expense.count({ where }),
  ]);

  res.status(200).json({
    success: true,
    data: expenses,
    pagination: { page: pageNum, pageSize: limit, total, totalPages: Math.ceil(total / limit) },
  });
});

export const getExpenseById = asyncHandler(async (req: Request, res: Response) => {
  const expenseId = routeParamToString(req.params.id);
  if (!expenseId) {
    throw new AppError('Expense ID is required', 400);
  }

  validateIdParam(expenseId, 'Expense ID');
  const expense = await prisma.expense.findUnique({ where: { id: expenseId } });
  if (!expense) throw new AppError('Expense not found', 404);
  res.status(200).json({ success: true, data: expense });
});

export const createExpense = asyncHandler(async (req: RouteRequest, res: Response) => {
  const { category, description, amount, date, notes, receiptUrl } = req.body;

  if (!category) throw new AppError('Category is required', 400);
  if (!description) throw new AppError('Description is required', 400);
  const parsedAmount = Number(amount);
  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    throw new AppError('Amount must be a positive number', 400);
  }

  const VALID_CATEGORIES = [
    'Marketing',
    'Maintenance',
    'Utilities',
    'Salaries',
    'Office',
    'Legal',
    'Insurance',
    'Other',
  ];
  if (!VALID_CATEGORIES.includes(category)) {
    throw new AppError(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`, 400);
  }

  const expense = await prisma.expense.create({
    data: {
      category: sanitizeString(category),
      description: sanitizeString(description),
      amount: parsedAmount,
      status: 'pending',
      date: date ? new Date(date) : new Date(),
      notes: notes ? sanitizeString(notes) : null,
      receiptUrl: receiptUrl || null,
      createdById: req.user?.id || null,
    },
  });

  res.status(201).json({ success: true, data: expense });
});

export const updateExpense = asyncHandler(async (req: AuthRequest, res: Response) => {
  const expenseId = routeParamToString(req.params.id);
  if (!expenseId) {
    throw new AppError('Expense ID is required', 400);
  }

  validateIdParam(expenseId, 'Expense ID');
  const existing = await prisma.expense.findUnique({ where: { id: expenseId } });
  if (!existing) throw new AppError('Expense not found', 404);

  const { status, amount, category, description, notes, receiptUrl } = req.body;
  const data: Record<string, unknown> = {};

  if (status !== undefined) {
    const validStatuses = ['pending', 'approved', 'rejected', 'processed', 'reimbursed'];
    if (!validStatuses.includes(status))
      throw new AppError(`Invalid status. Allowed: ${validStatuses.join(', ')}`, 400);
    data.status = status;
    if (status === 'approved') {
      data.approvedById = req.user?.id || null;
      data.approvedAt = new Date();
    }
  }
  if (amount !== undefined) {
    const parsed = Number(amount);
    if (!Number.isFinite(parsed) || parsed < 0)
      throw new AppError('Amount must be non-negative', 400);
    data.amount = parsed;
  }
  if (category !== undefined) data.category = sanitizeString(category);
  if (description !== undefined) data.description = sanitizeString(description);
  if (notes !== undefined) data.notes = notes ? sanitizeString(String(notes)) : null;
  if (receiptUrl !== undefined) data.receiptUrl = receiptUrl || null;
  const expense = await prisma.expense.update({ where: { id: expenseId }, data });
  res.status(200).json({ success: true, data: expense });
});

export const deleteExpense = asyncHandler(async (req: Request, res: Response) => {
  const expenseId = routeParamToString(req.params.id);
  if (!expenseId) {
    throw new AppError('Expense ID is required', 400);
  }

  validateIdParam(expenseId, 'Expense ID');
  const existing = await prisma.expense.findUnique({ where: { id: expenseId } });
  if (!existing) throw new AppError('Expense not found', 404);
  if (existing.status === 'processed')
    throw new AppError('Cannot delete a processed expense', 400);
  await prisma.expense.delete({ where: { id: expenseId } });
  res.status(200).json({ success: true, message: 'Expense deleted' });
});

export const getExpenseCatalog = asyncHandler(async (_req: Request, res: Response) => {
  try {
    const data = await readFile(EXPENSE_SCHEMA_PATH, 'utf-8');
    const json = JSON.parse(data);
    res.status(200).json({ success: true, data: json });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    throw new AppError('Could not load expense master catalog: ' + message, 500);
  }
});

