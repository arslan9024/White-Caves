/**
 * Finance API Routes â€” Full Implementation
 * Commission management, financial summaries, payments
 * Endpoints: /api/finance
 */

import { Router, Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import type { AuthRequest } from '../middleware/auth';
import { prisma } from '../database.js';
import { validateIdParam } from '../utils/validate';
import { sanitizeString } from '../utils/sanitize';
import { requirePermission } from '../middleware/rbac';

const router = Router();

// â”€â”€â”€ GET /api/finance/summary â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.get(
  '/summary',
  requirePermission('view_payments'),
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
      prisma.commission.aggregate({
        where: { status: 'paid' },
        _sum: { amount: true },
        _count: { _all: true },
      }),
      prisma.commission.aggregate({
        where: { status: 'pending' },
        _sum: { amount: true },
        _count: { _all: true },
      }),
      prisma.commission.aggregate({
        where: { status: 'approved' },
        _sum: { amount: true },
        _count: { _all: true },
      }),
      prisma.commission.groupBy({ by: ['type'], _sum: { amount: true }, _count: { _all: true } }),
      prisma.property.aggregate({
        where: { status: { in: ['sold', 'rented'] } },
        _sum: { price: true },
      }),
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
          pending: {
            count: pendingCommissions._count._all,
            value: pendingCommissions._sum.amount || 0,
          },
          approved: {
            count: approvedCommissions._count._all,
            value: approvedCommissions._sum.amount || 0,
          },
        },
        byType: commissionsByType.map(c => ({
          type: c.type,
          count: c._count._all,
          value: c._sum.amount || 0,
        })),
      },
    });
  })
);

// â”€â”€â”€ GET /api/finance/commissions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.get(
  '/commissions',
  requirePermission('view_payments'),
  asyncHandler(async (req: Request, res: Response) => {
    const {
      page = '1',
      pageSize = '20',
      status,
      type,
      agentId,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query as Record<string, string | undefined>;

    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(pageSize as string) || 20));

    const where: Record<string, unknown> = {};
    if (status && status !== 'all') where.status = status as string;
    if (type && type !== 'all') where.type = type as string;
    if (agentId) where.agentId = agentId as string;

    const validSorts = ['createdAt', 'amount', 'status'];
    const field = validSorts.includes(sortBy as string) ? (sortBy as string) : 'createdAt';
    const orderBy: Record<string, 'asc' | 'desc'> = {
      [field]: sortOrder === 'asc' ? 'asc' : 'desc',
    };

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

// â”€â”€â”€ GET /api/finance/commissions/:id â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.get(
  '/commissions/:id',
  requirePermission('view_payments'),
  asyncHandler(async (req: Request, res: Response) => {
    validateIdParam(req.params.id, 'Commission ID');
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

// â”€â”€â”€ POST /api/finance/commissions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.post(
  '/commissions',
  requirePermission('process_payments'),
  asyncHandler(async (req: Request, res: Response) => {
    const { agentId, amount, percentage, type, notes, leadId, propertyId } = req.body;

    if (!agentId) throw new AppError('Agent ID is required', 400);

    // Validate and parse amount â€” catch NaN
    const MAX_COMMISSION = 100_000_000; // 100M AED
    const parsedAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0 || parsedAmount > MAX_COMMISSION) {
      throw new AppError(
        `Commission amount must be between 1 and ${MAX_COMMISSION.toLocaleString('en-US')} AED`,
        400
      );
    }

    // Validate commission type enum
    const VALID_COMMISSION_TYPES = ['sale', 'rental', 'referral'];
    if (type && !VALID_COMMISSION_TYPES.includes(type)) {
      throw new AppError(
        `Commission type must be one of: ${VALID_COMMISSION_TYPES.join(', ')}`,
        400
      );
    }

    // Validate percentage range if provided
    let validatedPercentage: number | null = null;
    if (percentage !== undefined && percentage !== null) {
      const parsedPct =
        typeof percentage === 'string' ? parseFloat(percentage) : Number(percentage);
      if (!Number.isFinite(parsedPct) || parsedPct < 0 || parsedPct > 100) {
        throw new AppError('Commission percentage must be between 0 and 100', 400);
      }
      validatedPercentage = parsedPct;
    }

    // Verify agent exists
    const agent = await prisma.user.findUnique({ where: { id: agentId } });
    if (!agent) throw new AppError('Agent not found', 404);

    // Validate referenced entities
    if (leadId) {
      const lead = await prisma.lead.findUnique({ where: { id: leadId } });
      if (!lead) throw new AppError('Referenced lead not found', 400);
    }
    if (propertyId) {
      const property = await prisma.property.findUnique({ where: { id: propertyId } });
      if (!property) throw new AppError('Referenced property not found', 400);
    }

    const commission = await prisma.commission.create({
      data: {
        agentId,
        amount: parsedAmount,
        percentage: validatedPercentage,
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
        description: `Commission AED ${commission.amount.toLocaleString()} created for ${agent.name || agent.email} by ${req.user?.email}`,
        userId: req.user?.id || null,
      },
    });

    res.status(201).json({ success: true, data: commission });
  })
);

// â”€â”€â”€ PATCH /api/finance/commissions/:id â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.patch(
  '/commissions/:id',
  requirePermission('process_payments'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as Record<string, string>;
    validateIdParam(id, 'Commission ID');
    const { status, amount, notes } = req.body;

    const existing = await prisma.commission.findUnique({
      where: { id },
      include: { agent: { select: { id: true, name: true, email: true } } },
    });
    if (!existing) throw new AppError('Commission not found', 404);

    // AUTHORIZATION: Role-based access for different operations
    const isAdmin = ['owner', 'manager', 'finance'].includes(req.user?.role || '');
    const isAgentOwner = existing.agentId === req.user?.id;

    // Agents can only edit notes; cannot change status/amount
    if (!isAdmin && isAgentOwner) {
      if (status !== undefined || amount !== undefined) {
        throw new AppError(
          'Agents can only add notes to their commissions. Status and amount changes require manager approval.',
          403
        );
      }
    }
    // Non-admin, non-owner cannot access at all
    if (!isAdmin && !isAgentOwner) {
      throw new AppError('You do not have permission to modify this commission', 403);
    }

    const data: Record<string, unknown> = {};
    if (status !== undefined) {
      const validStatuses = ['pending', 'approved', 'paid', 'cancelled'];
      if (!validStatuses.includes(status)) {
        throw new AppError(`Invalid commission status. Allowed: ${validStatuses.join(', ')}`, 400);
      }
      // Only admins can approve/mark as paid
      if (['approved', 'paid'].includes(status) && !isAdmin) {
        throw new AppError('Only finance managers can approve or mark commissions as paid', 403);
      }
      data.status = status;
    }
    if (amount !== undefined) {
      if (!isAdmin) throw new AppError('Only admins can modify commission amounts', 403);
      const parsed = parseFloat(amount);
      if (isNaN(parsed) || parsed < 0)
        throw new AppError('Amount must be a valid non-negative number', 400);
      data.amount = parsed;
    }
    if (notes !== undefined) data.notes = notes ? sanitizeString(String(notes)) : null;
    if (status === 'paid') data.paidAt = new Date();

    const commission = await prisma.commission.update({ where: { id }, data });

    const statusChanged = status !== undefined && status !== null && status !== existing.status;
    if (statusChanged) {
      await prisma.activity.create({
        data: {
          type: 'commission',
          action: 'status_changed',
          description: `Commission for ${existing.agent.name || existing.agent.email}: ${existing.status} â†’ ${status} (by ${req.user?.email})`,
          userId: req.user?.id || null,
        },
      });
    }

    res.status(200).json({ success: true, data: commission });
  })
);

// â”€â”€â”€ POST /api/finance/payments â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Bulk-pay approved commissions
router.post(
  '/payments',
  requirePermission('process_payments'),
  asyncHandler(async (req: Request, res: Response) => {
    const { commissionIds } = req.body;

    if (!Array.isArray(commissionIds) || commissionIds.length === 0) {
      throw new AppError('Provide an array of commission IDs', 400);
    }

    const MONGO_ID_REGEX = /^[a-f\d]{24}$/i;
    if (!commissionIds.every((id: unknown) => typeof id === 'string' && MONGO_ID_REGEX.test(id))) {
      throw new AppError('All commission IDs must be valid 24-character hex strings', 400);
    }

    const result = await prisma.commission.updateMany({
      where: { id: { in: commissionIds }, status: 'approved' },
      data: { status: 'paid', paidAt: new Date() },
    });

    await prisma.activity.create({
      data: {
        type: 'commission',
        action: 'paid',
        description: `${result.count} commission(s) marked as paid`,
        userId: req.user?.id || null,
      },
    });

    res.status(200).json({
      success: true,
      data: { paidCount: result.count },
      message: `${result.count} commission(s) paid successfully`,
    });
  })
);

// ============================================================================
// INVOICE ENDPOINTS
// ============================================================================

// â”€â”€â”€ GET /api/finance/invoices â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.get(
  '/invoices',
  requirePermission('view_payments'),
  asyncHandler(async (req: Request, res: Response) => {
    const {
      page = '1',
      pageSize = '20',
      status,
      client,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query as Record<string, string | undefined>;

    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(pageSize as string) || 20));

    const where: Record<string, unknown> = {};
    if (status && status !== 'all') where.status = status as string;
    if (client) where.client = { contains: client as string, mode: 'insensitive' };

    const validSorts = ['createdAt', 'amount', 'totalAmount', 'dueDate', 'status'];
    const field = validSorts.includes(sortBy as string) ? (sortBy as string) : 'createdAt';
    const orderBy: Record<string, 'asc' | 'desc'> = {
      [field]: sortOrder === 'asc' ? 'asc' : 'desc',
    };

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({ where, orderBy, skip: (pageNum - 1) * limit, take: limit }),
      prisma.invoice.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: invoices,
      pagination: { page: pageNum, pageSize: limit, total, totalPages: Math.ceil(total / limit) },
    });
  })
);

// â”€â”€â”€ GET /api/finance/invoices/:id â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.get(
  '/invoices/:id',
  requirePermission('view_payments'),
  asyncHandler(async (req: Request, res: Response) => {
    validateIdParam(req.params.id, 'Invoice ID');
    const invoice = await prisma.invoice.findUnique({ where: { id: req.params.id } });
    if (!invoice) throw new AppError('Invoice not found', 404);
    res.status(200).json({ success: true, data: invoice });
  })
);

// â”€â”€â”€ POST /api/finance/invoices â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.post(
  '/invoices',
  requirePermission('process_payments'),
  asyncHandler(async (req: Request, res: Response) => {
    const { client, property, amount, dueDate, notes, lineItems, vatAmount } = req.body;

    if (!client) throw new AppError('Client name is required', 400);
    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      throw new AppError('Amount must be a positive number', 400);
    }
    if (!dueDate) throw new AppError('Due date is required', 400);

    // Generate sequential invoice number
    const lastInvoice = await prisma.invoice.findFirst({ orderBy: { createdAt: 'desc' } });
    const year = new Date().getFullYear();
    let seq = 1;
    if (lastInvoice?.invoiceNumber) {
      const match = lastInvoice.invoiceNumber.match(/INV-\d{4}-(\d+)/);
      if (match) seq = parseInt(match[1]) + 1;
    }
    const invoiceNumber = `INV-${year}-${String(seq).padStart(4, '0')}`;

    const vat = Number(vatAmount) || 0;
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        client: sanitizeString(client),
        property: property ? sanitizeString(property) : null,
        amount: parsedAmount,
        vatAmount: vat,
        totalAmount: parsedAmount + vat,
        status: 'pending',
        dueDate: new Date(dueDate),
        notes: notes ? sanitizeString(notes) : null,
        lineItems: lineItems || null,
        createdById: req.user?.id || null,
      },
    });

    res.status(201).json({ success: true, data: invoice });
  })
);

// â”€â”€â”€ PATCH /api/finance/invoices/:id â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.patch(
  '/invoices/:id',
  requirePermission('process_payments'),
  asyncHandler(async (req: Request, res: Response) => {
    validateIdParam(req.params.id, 'Invoice ID');
    const existing = await prisma.invoice.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new AppError('Invoice not found', 404);

    const { status, amount, vatAmount, notes, client, property, dueDate } = req.body;
    const data: Record<string, unknown> = {};

    if (status !== undefined) {
      const validStatuses = ['draft', 'pending', 'paid', 'overdue', 'cancelled', 'refunded'];
      if (!validStatuses.includes(status))
        throw new AppError(`Invalid status. Allowed: ${validStatuses.join(', ')}`, 400);
      data.status = status;
      if (status === 'paid') data.paidAt = new Date();
    }
    if (amount !== undefined) {
      const parsed = Number(amount);
      if (!Number.isFinite(parsed) || parsed < 0)
        throw new AppError('Amount must be a valid non-negative number', 400);
      data.amount = parsed;
      const vat = vatAmount !== undefined ? Number(vatAmount) : existing.vatAmount;
      data.vatAmount = vat;
      data.totalAmount = parsed + vat;
    }
    if (notes !== undefined) data.notes = notes ? sanitizeString(String(notes)) : null;
    if (client !== undefined) data.client = sanitizeString(client);
    if (property !== undefined) data.property = property ? sanitizeString(property) : null;
    if (dueDate !== undefined) data.dueDate = new Date(dueDate);
    const invoice = await prisma.invoice.update({ where: { id: req.params.id }, data });
    res.status(200).json({ success: true, data: invoice });
  })
);

// â”€â”€â”€ DELETE /api/finance/invoices/:id â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.delete(
  '/invoices/:id',
  requirePermission('process_payments'),
  asyncHandler(async (req: Request, res: Response) => {
    validateIdParam(req.params.id, 'Invoice ID');
    const existing = await prisma.invoice.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new AppError('Invoice not found', 404);
    if (existing.status === 'paid') throw new AppError('Cannot delete a paid invoice', 400);
    await prisma.invoice.delete({ where: { id: req.params.id } });
    res.status(200).json({ success: true, message: 'Invoice deleted' });
  })
);

// ============================================================================
// EXPENSE ENDPOINTS
// ============================================================================

// â”€â”€â”€ GET /api/finance/expenses â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.get(
  '/expenses',
  requirePermission('view_payments'),
  asyncHandler(async (req: Request, res: Response) => {
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
  })
);

// â”€â”€â”€ GET /api/finance/expenses/:id â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.get(
  '/expenses/:id',
  requirePermission('view_payments'),
  asyncHandler(async (req: Request, res: Response) => {
    validateIdParam(req.params.id, 'Expense ID');
    const expense = await prisma.expense.findUnique({ where: { id: req.params.id } });
    if (!expense) throw new AppError('Expense not found', 404);
    res.status(200).json({ success: true, data: expense });
  })
);

// â”€â”€â”€ POST /api/finance/expenses â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.post(
  '/expenses',
  requirePermission('process_payments'),
  asyncHandler(async (req: Request, res: Response) => {
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
  })
);

// â”€â”€â”€ PATCH /api/finance/expenses/:id â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.patch(
  '/expenses/:id',
  requirePermission('process_payments'),
  asyncHandler(async (req: Request, res: Response) => {
    validateIdParam(req.params.id, 'Expense ID');
    const existing = await prisma.expense.findUnique({ where: { id: req.params.id } });
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
    const expense = await prisma.expense.update({ where: { id: req.params.id }, data });
    res.status(200).json({ success: true, data: expense });
  })
);

// â”€â”€â”€ DELETE /api/finance/expenses/:id â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
router.delete(
  '/expenses/:id',
  requirePermission('process_payments'),
  asyncHandler(async (req: Request, res: Response) => {
    validateIdParam(req.params.id, 'Expense ID');
    const existing = await prisma.expense.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new AppError('Expense not found', 404);
    if (existing.status === 'processed')
      throw new AppError('Cannot delete a processed expense', 400);
    await prisma.expense.delete({ where: { id: req.params.id } });
    res.status(200).json({ success: true, message: 'Expense deleted' });
  })
);

export default router;
