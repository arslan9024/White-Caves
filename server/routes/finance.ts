/**
 * Finance API Routes — Full Implementation
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
import { createLogger } from '../utils/logger.js';

const log = createLogger('Finance');

const router = Router();

// ─── GET /api/finance/summary ───────────────────────────────────────────
router.get(
  '/summary',
  requirePermission('view_payments'),
  asyncHandler(async (req: Request, res: Response) => {
    log.info('Finance summary requested');
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
        byType: commissionsByType.map((c) => ({
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
  requirePermission('view_payments'),
  asyncHandler(async (req: Request, res: Response) => {
    const {
      page = '1', pageSize = '20',
      status, type, agentId,
      sortBy = 'createdAt', sortOrder = 'desc',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(pageSize as string) || 20));

    const where: Record<string, unknown> = {};
    if (status && status !== 'all') where.status = status as string;
    if (type && type !== 'all') where.type = type as string;
    if (agentId) where.agentId = agentId as string;

    const validSorts = ['createdAt', 'amount', 'status'];
    const field = validSorts.includes(sortBy as string) ? (sortBy as string) : 'createdAt';
    const orderBy: Record<string, 'asc' | 'desc'> = { [field]: sortOrder === 'asc' ? 'asc' : 'desc' };

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

// ─── POST /api/finance/commissions ──────────────────────────────────────
router.post(
  '/commissions',
  requirePermission('process_payments'),
  asyncHandler(async (req: Request, res: Response) => {
    const { agentId, amount, percentage, type, notes, leadId, propertyId } = req.body;

    if (!agentId) throw new AppError('Agent ID is required', 400);

    // Validate and parse amount — catch NaN
    const MAX_COMMISSION = 100_000_000; // 100M AED
    const parsedAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0 || parsedAmount > MAX_COMMISSION) {
      throw new AppError(`Commission amount must be between 1 and ${MAX_COMMISSION.toLocaleString('en-US')} AED`, 400);
    }

    // Validate commission type enum
    const VALID_COMMISSION_TYPES = ['sale', 'rental', 'referral'];
    if (type && !VALID_COMMISSION_TYPES.includes(type)) {
      throw new AppError(`Commission type must be one of: ${VALID_COMMISSION_TYPES.join(', ')}`, 400);
    }

    // Validate percentage range if provided
    let validatedPercentage: number | null = null;
    if (percentage !== undefined && percentage !== null) {
      const parsedPct = typeof percentage === 'string' ? parseFloat(percentage) : Number(percentage);
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

// ─── PATCH /api/finance/commissions/:id ─────────────────────────────────
router.patch(
  '/commissions/:id',
  requirePermission('process_payments'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
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
        throw new AppError('Agents can only add notes to their commissions. Status and amount changes require manager approval.', 403);
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
      if (isNaN(parsed) || parsed < 0) throw new AppError('Amount must be a valid non-negative number', 400);
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
          description: `Commission for ${existing.agent.name || existing.agent.email}: ${existing.status} → ${status} (by ${req.user?.email})`,
          userId: req.user?.id || null,
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

export default router;
