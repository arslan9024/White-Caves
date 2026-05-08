/**
 * Contracts API Routes
 * ─────────────────────
 * Full CRUD for property contracts (tenancy, sale, MOU, SPA, NDA).
 *
 * GET    /api/contracts              — List contracts (paginated, filtered)
 * GET    /api/contracts/:id          — Get single contract
 * POST   /api/contracts              — Create a contract
 * PATCH  /api/contracts/:id          — Update contract (status, dates, signers…)
 * DELETE /api/contracts/:id          — Delete a draft contract
 * POST   /api/contracts/:id/sign     — Record a party's signature
 */

import { Router, Response } from 'express';
import crypto from 'crypto';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';
import { prisma } from '../database.js';
import logger from '../utils/logger.js';

const router = Router();

function generateContractNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `WC-${year}-${random}`;
}

// ─── GET /api/contracts ───────────────────────────────────────────────────────
router.get(
  '/',
  requirePermission('view_contracts'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize as string) || 20));
    const status = req.query.status as string | undefined;
    const type = req.query.type as string | undefined;
    const propertyId = req.query.propertyId as string | undefined;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (propertyId) where.propertyId = propertyId;

    // Non-admins only see contracts they are party to or created
    const role = req.user?.role;
    const adminRoles = ['owner', 'admin', 'md'];
    if (!adminRoles.includes(role ?? '')) {
      where.OR = [
        { createdBy: userId },
        { agentId: userId },
        { buyerId: userId },
        { sellerId: userId },
      ];
    }

    const [contracts, total] = await Promise.all([
      prisma.contract.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.contract.count({ where }),
    ]);

    res.json({
      success: true,
      data: contracts,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  }),
);

// ─── GET /api/contracts/:id ───────────────────────────────────────────────────
router.get(
  '/:id',
  requirePermission('view_contracts'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const contract = await prisma.contract.findUnique({
      where: { id: req.params.id },
    });

    if (!contract) throw new AppError('Contract not found', 404);

    // Verify access
    const adminRoles = ['owner', 'admin', 'md'];
    if (!adminRoles.includes(req.user?.role ?? '')) {
      const parties = [contract.createdBy, contract.agentId, contract.buyerId, contract.sellerId];
      if (!parties.includes(userId)) {
        throw new AppError('Access denied', 403);
      }
    }

    res.json({ success: true, data: contract });
  }),
);

// ─── POST /api/contracts ──────────────────────────────────────────────────────
router.post(
  '/',
  requirePermission('create_contracts'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const {
      type,
      title,
      description,
      propertyId,
      buyerId,
      sellerId,
      agentId,
      totalValue,
      currency,
      startDate,
      endDate,
      templateKey,
      notes,
      tags,
      metadata,
    } = req.body;

    if (!type) throw new AppError('Contract type is required', 400);
    if (!title) throw new AppError('Contract title is required', 400);

    const contractNumber = generateContractNumber();
    const signatureToken = crypto.randomBytes(32).toString('hex');

    const contract = await prisma.contract.create({
      data: {
        contractNumber,
        type,
        title,
        description: description ?? null,
        propertyId: propertyId ?? null,
        buyerId: buyerId ?? null,
        sellerId: sellerId ?? null,
        agentId: agentId ?? userId,
        totalValue: totalValue !== undefined ? parseFloat(totalValue) : null,
        currency: currency ?? 'AED',
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        templateKey: templateKey ?? null,
        notes: notes ?? null,
        tags: tags ?? [],
        metadata: metadata ?? null,
        signatureToken,
        createdBy: userId,
      },
    });

    logger.info('Contract created', { contractNumber, type, createdBy: userId });

    res.status(201).json({ success: true, data: contract });
  }),
);

// ─── PATCH /api/contracts/:id ─────────────────────────────────────────────────
router.patch(
  '/:id',
  requirePermission('create_contracts'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const existing = await prisma.contract.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new AppError('Contract not found', 404);

    // Only admins or creator/agent can edit
    const adminRoles = ['owner', 'admin', 'md'];
    if (!adminRoles.includes(req.user?.role ?? '')) {
      if (existing.createdBy !== userId && existing.agentId !== userId) {
        throw new AppError('Access denied', 403);
      }
    }

    const {
      type,
      title,
      description,
      status,
      propertyId,
      buyerId,
      sellerId,
      agentId,
      totalValue,
      currency,
      startDate,
      endDate,
      signedAt,
      documentUrl,
      templateKey,
      notes,
      tags,
      metadata,
    } = req.body;

    const updateData: Record<string, unknown> = {};
    if (type !== undefined) updateData.type = type;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (propertyId !== undefined) updateData.propertyId = propertyId;
    if (buyerId !== undefined) updateData.buyerId = buyerId;
    if (sellerId !== undefined) updateData.sellerId = sellerId;
    if (agentId !== undefined) updateData.agentId = agentId;
    if (totalValue !== undefined) updateData.totalValue = parseFloat(totalValue);
    if (currency !== undefined) updateData.currency = currency;
    if (startDate !== undefined) updateData.startDate = new Date(startDate);
    if (endDate !== undefined) updateData.endDate = new Date(endDate);
    if (signedAt !== undefined) updateData.signedAt = new Date(signedAt);
    if (documentUrl !== undefined) updateData.documentUrl = documentUrl;
    if (templateKey !== undefined) updateData.templateKey = templateKey;
    if (notes !== undefined) updateData.notes = notes;
    if (tags !== undefined) updateData.tags = tags;
    if (metadata !== undefined) updateData.metadata = metadata;

    const updated = await prisma.contract.update({
      where: { id: req.params.id },
      data: updateData,
    });

    logger.info('Contract updated', { id: req.params.id, status, updatedBy: userId });

    res.json({ success: true, data: updated });
  }),
);

// ─── DELETE /api/contracts/:id ────────────────────────────────────────────────
router.delete(
  '/:id',
  requirePermission('create_contracts'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const existing = await prisma.contract.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new AppError('Contract not found', 404);

    if (existing.status !== 'draft') {
      throw new AppError('Only draft contracts can be deleted', 400);
    }

    const adminRoles = ['owner', 'admin', 'md'];
    if (!adminRoles.includes(req.user?.role ?? '')) {
      if (existing.createdBy !== userId) {
        throw new AppError('Access denied', 403);
      }
    }

    await prisma.contract.delete({ where: { id: req.params.id } });

    logger.info('Contract deleted', { id: req.params.id, deletedBy: userId });

    res.json({ success: true, message: 'Contract deleted' });
  }),
);

// ─── POST /api/contracts/:id/sign ────────────────────────────────────────────
router.post(
  '/:id/sign',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { party, token } = req.body; // party: 'buyer' | 'seller' | 'agent'

    const contract = await prisma.contract.findUnique({ where: { id: req.params.id } });
    if (!contract) throw new AppError('Contract not found', 404);

    // Validate signature token if provided
    if (token && token !== contract.signatureToken) {
      throw new AppError('Invalid signature token', 400);
    }

    const signerMap: Record<string, string> = {
      buyer: 'signedByBuyer',
      seller: 'signedBySeller',
      agent: 'signedByAgent',
    };

    if (!party || !signerMap[party]) {
      throw new AppError('party must be buyer, seller, or agent', 400);
    }

    const updated = await prisma.contract.update({
      where: { id: req.params.id },
      data: {
        [signerMap[party]]: true,
        signedAt: new Date(),
        status: 'pending_signature',
      },
    });

    // If all parties signed → activate
    if (updated.signedByBuyer && updated.signedBySeller && updated.signedByAgent) {
      await prisma.contract.update({
        where: { id: req.params.id },
        data: { status: 'active' },
      });
    }

    logger.info('Contract signed', { id: req.params.id, party, userId });

    res.json({ success: true, data: updated });
  }),
);

export default router;
