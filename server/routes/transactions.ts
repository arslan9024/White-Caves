/**
 * Transactions API Routes — Full Implementation
 * Sales and lease transaction management
 * Endpoints: /api/transactions
 */

import { Router, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import type { AuthRequest } from '../middleware/auth';
import { prisma } from '../database.js';
import { validate, rules, validateIdParam } from '../utils/validate';
import { parsePagination } from '../config/pagination';
import { sanitizeString } from '../utils/sanitize';
import { requirePermission } from '../middleware/rbac';
import { RISKY_AMOUNT_AED } from '../middleware/kycGate';

const router = Router();
const RISKY_TRANSACTION_AMOUNT_AED = 500000;

// ─── GET /api/transactions ──────────────────────────────────────────────
router.get(
  '/',
  requirePermission('view_payments'),
  asyncHandler(async (req: Request, res: Response) => {
    // AUTHORIZATION: Transactions visible to owner/manager/admin/finance/agent
    const allowedRoles = ['owner', 'manager', 'admin', 'finance', 'agent'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied — insufficient role for transaction data', 403);
    }

    const { status, type, sortBy = 'createdAt', sortOrder = 'desc' } = req.query as Record<string, string | undefined>;

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
  })
);

// ─── GET /api/transactions/stats ────────────────────────────────────────
router.get(
  '/stats',
  requirePermission('view_payments'),
  asyncHandler(async (req: Request, res: Response) => {
    // Authorization: Only managers+ can view transaction statistics
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
  })
);

// ─── GET /api/transactions/:id ──────────────────────────────────────────
router.get(
  '/:id',
  requirePermission('view_payments'),
  asyncHandler(async (req: Request, res: Response) => {
    // @ts-expect-error -- pre-existing: req.params/query string|string[] narrowing
    validateIdParam(req.params.id, 'Transaction ID');

    // AUTHORIZATION: Only managers/finance can view individual transaction details
    const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied — only managers can view transaction details', 403);
    }

    const transaction = await prisma.transaction.findUnique({
    // @ts-expect-error -- pre-existing: req.params/query string|string[] narrowing
      where: { id: req.params.id },
    });

    if (!transaction) throw new AppError('Transaction not found', 404);
    res.status(200).json({ success: true, data: transaction });
  })
);

// ─── POST /api/transactions ─────────────────────────────────────────────
router.post(
  '/',
  requirePermission('process_payments'),
  asyncHandler(async (req: Request, res: Response) => {
    // AUTHORIZATION: Only owner, manager, finance, or agents can create transactions
    const allowedRoles = ['owner', 'manager', 'finance', 'agent'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied — insufficient permissions to create transactions', 403);
    }

    const { type, amount, propertyId, leadId, agentId, closingDate, notes } = req.body;

    validate(req.body, {
      amount: rules.positiveNumber('Amount'),
      type: rules.oneOf('Transaction type', ['sale', 'lease', 'rental']),
      propertyId: rules.optionalMongoId('Property ID'),
      leadId: rules.optionalMongoId('Lead ID'),
      agentId: rules.optionalMongoId('Agent ID'),
      notes: rules.optionalString('Notes'),
    });

    const parsedAmount = parseFloat(amount);
    const transactionType = type || 'sale';

    // W4-004 compliance baseline: risky transaction flows require verified KYC.
    // Risk definition: any sale OR amount >= AED 500k.
    const isRiskyTransaction =
      transactionType === 'sale' || parsedAmount >= RISKY_TRANSACTION_AMOUNT_AED;
    if (isRiskyTransaction) {
      if (!leadId) {
        throw new AppError(
          'KYC verification required: risky transactions must be linked to a verified lead',
          400
        );
      }

      const linkedLead = await prisma.lead.findUnique({
        where: { id: String(leadId) },
        select: { id: true, tags: true },
      });

      if (!linkedLead) {
        throw new AppError('Linked lead not found for KYC verification', 400);
      }

      const hasVerifiedKyc =
        Array.isArray(linkedLead.tags) &&
        linkedLead.tags.some(tag => String(tag).toLowerCase() === 'kyc_verified');

      if (!hasVerifiedKyc) {
        throw new AppError(
          'KYC verification required: linked lead is not verified for risky transaction',
          403
        );
      }
    }

    // Validate closingDate if provided
    let validClosingDate: Date | null = null;
    if (closingDate) {
      const d = new Date(closingDate);
      if (isNaN(d.getTime())) {
        throw new AppError('Invalid closing date format. Use ISO 8601 format (YYYY-MM-DD)', 400);
      }
      validClosingDate = d;
    }

    const transaction = await prisma.transaction.create({
      data: {
        type: transactionType,
        status: 'draft',
        amount: parsedAmount,
        propertyId: propertyId || null,
        leadId: leadId || null,
        agentId: agentId || null,
        closingDate: validClosingDate,
        notes: notes ? sanitizeString(String(notes)) : null,
        documents: [],
      },
    });

    await prisma.activity.create({
      data: {
        type: 'deal',
        action: 'created',
        description: `New ${transaction.type} transaction created — AED ${transaction.amount.toLocaleString()}`,
        userId: req.user?.id || null,
      },
    });

    res.status(201).json({ success: true, data: transaction });
  })
);

// ─── PATCH /api/transactions/:id ────────────────────────────────────────
// P0-013: KYC gate enforced for risky status transitions (sale ≥ AED 500k)
router.patch(
  '/:id',
  requirePermission('process_payments'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as Record<string, string>;
    validateIdParam(id, 'Transaction ID');
    const { status, amount, type, closingDate, notes, documents } = req.body;

    validate(req.body, {
      status: rules.oneOf('Status', ['draft', 'pending', 'active', 'in_progress', 'completed', 'cancelled']),
      amount: rules.optionalPositiveNumber('Amount'),
      type: rules.oneOf('Transaction type', ['sale', 'lease', 'rental']),
      documents: rules.optionalArray('Documents'),
    });

    // Wrap in Prisma transaction for atomicity (prevent race conditions)
    const transaction = await prisma.$transaction(async tx => {
      const existing = await tx.transaction.findUnique({ where: { id } });
      if (!existing) throw new AppError('Transaction not found', 404);

      // AUTHORIZATION: Only admins/managers/finance/agents can update transactions
      const allowedRoles = ['owner', 'manager', 'admin', 'finance', 'agent'];
      if (!allowedRoles.includes(req.user?.role || '')) {
        throw new AppError('You do not have permission to update this transaction', 403);
      }

      // P0-013: KYC gate — block risky status transitions without verified lead
      const riskyStatuses = ['in_progress', 'completed'];
      if (status && riskyStatuses.includes(status)) {
        const effectiveType   = type ?? existing.type;
        const effectiveAmount = amount != null ? parseFloat(amount) : Number(existing.amount);
        const isRisky         = effectiveType === 'sale' || effectiveAmount >= RISKY_AMOUNT_AED;

        if (isRisky) {
          if (!existing.leadId) {
            throw new AppError(
              'KYC required: risky transactions must reference a verified lead (leadId missing)',
              400,
            );
          }
          const lead = await tx.lead.findUnique({
            where: { id: existing.leadId },
            select: { id: true, tags: true },
          });
          if (!lead) throw new AppError('KYC check failed: lead not found', 400);
          const hasKyc =
            Array.isArray(lead.tags) &&
            lead.tags.some((t: unknown) => String(t).toLowerCase() === 'kyc_verified');
          if (!hasKyc) {
            throw new AppError(
              'KYC verification required: lead must be verified before this transaction can proceed',
              403,
            );
          }
        }
      }

      const data: Record<string, unknown> = {};
      if (status !== undefined) data.status = sanitizeString(String(status));
      if (amount !== undefined) {
        const parsed = parseFloat(amount);
        if (isNaN(parsed)) throw new AppError('Amount must be a valid number', 400);
        data.amount = parsed;
      }
      if (type !== undefined) data.type = type;
      if (closingDate !== undefined) {
        if (closingDate) {
          const d = new Date(closingDate);
          if (isNaN(d.getTime())) {
            throw new AppError(
              'Invalid closing date format. Use ISO 8601 format (YYYY-MM-DD)',
              400,
            );
          }
          data.closingDate = d;
        } else {
          data.closingDate = null;
        }
      }
      if (notes !== undefined) data.notes = notes ? sanitizeString(String(notes)) : null;
      if (documents !== undefined)
        data.documents = Array.isArray(documents)
          ? documents.map((d: unknown) => (typeof d === 'string' ? sanitizeString(d) : String(d)))
          : [];

      const updated = await tx.transaction.update({ where: { id }, data });

      const statusChanged = status !== undefined && status !== null && status !== existing.status;
      if (statusChanged) {
        await tx.activity.create({
          data: {
            type: 'deal',
            action: 'status_changed',
            description: `Transaction ${existing.status} → ${status} (AED ${Number(updated.amount).toLocaleString()})`,
            userId: req.user?.id || null,
            leadId: existing.leadId ?? null,
            metadata: { transactionId: id, from: existing.status, to: status },
          },
        });
      }

      return updated;
    });

    res.status(200).json({ success: true, data: transaction });
  })
);

// ─── DELETE /api/transactions/:id ───────────────────────────────────────
router.delete(
  '/:id',
  requirePermission('process_payments'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as Record<string, string>;
    validateIdParam(id, 'Transaction ID');
    const existing = await prisma.transaction.findUnique({ where: { id } });
    if (!existing) throw new AppError('Transaction not found', 404);

    // AUTHORIZATION: Only admins/managers can delete transactions
    // Note: Transaction model has no userId field, so only role-based auth applies
    const isAdmin = ['owner', 'manager'].includes(req.user?.role || '');
    if (!isAdmin) {
      throw new AppError('Only managers can delete transactions', 403);
    }

    await prisma.$transaction(async tx => {
      await tx.transaction.delete({ where: { id } });

      await tx.activity.create({
        data: {
          type: 'deal',
          action: 'deleted',
          description: `Transaction deleted — AED ${existing.amount.toLocaleString()} (by ${req.user?.email})`,
          userId: req.user?.id || null,
        },
      });
    });

    res.status(200).json({ success: true, message: 'Transaction deleted' });
  })
);

export default router;
