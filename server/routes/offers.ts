/**
 * Offers API Routes
 * ─────────────────
 * CRUD endpoints for property purchase/rental offers.
 *
 * GET    /api/offers           — List user's offers (as buyer)
 * GET    /api/offers/received  — Offers received on user's properties (as seller)
 * POST   /api/offers           — Submit a new offer
 * PATCH  /api/offers/:id       — Update offer (accept, reject, counter, withdraw)
 * DELETE /api/offers/:id       — Delete an offer
 */

import { Router, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../database.js';
import logger from '../utils/logger.js';

const router = Router();

// ─── GET /api/offers — List offers made by current user (as buyer) ───────────
router.get(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const status = req.query.status as string | undefined;
    const where: Record<string, unknown> = { buyerId: userId };
    if (status) where.status = status;

    const offers = await prisma.offer.findMany({
      where,
      include: {
        property: {
          select: { id: true, title: true, location: true, price: true, images: true, type: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: offers });
  }),
);

// ─── GET /api/offers/received — Offers on user's properties (as seller) ──────
router.get(
  '/received',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    // Find properties owned by the user, then get offers on those properties
    const userProperties = await prisma.property.findMany({
      where: { userId },
      select: { id: true },
    });
    const propertyIds = userProperties.map((p) => p.id);

    const offers = await prisma.offer.findMany({
      where: { propertyId: { in: propertyIds } },
      include: {
        property: {
          select: { id: true, title: true, location: true, price: true },
        },
        buyer: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: offers });
  }),
);

// ─── POST /api/offers — Submit a new offer ───────────────────────────────────
router.post(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { propertyId, amount, terms, expiresAt, leadId } = req.body;
    if (!propertyId) throw new AppError('propertyId is required', 400);
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      throw new AppError('amount must be a positive number', 400);
    }

    // Verify property exists and is available
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) throw new AppError('Property not found', 404);

    const offer = await prisma.offer.create({
      data: {
        buyerId: userId,
        propertyId,
        amount,
        terms: terms || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        leadId: leadId || null,
      },
      include: {
        property: {
          select: { id: true, title: true, location: true, price: true },
        },
      },
    });

    logger.info('Offer submitted', { userId, offerId: offer.id, propertyId, amount });
    res.status(201).json({ success: true, data: offer });
  }),
);

// ─── PATCH /api/offers/:id — Update offer status ────────────────────────────
router.patch(
  '/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { id } = req.params;
    const existing = await prisma.offer.findUnique({
      where: { id },
      include: { property: { select: { userId: true } } },
    });
    if (!existing) throw new AppError('Offer not found', 404);

    // Buyer can update/withdraw their own offer; property owner can accept/reject/counter
    const isBuyer = existing.buyerId === userId;
    const isPropertyOwner = existing.property?.userId === userId;
    if (!isBuyer && !isPropertyOwner) throw new AppError('Access denied', 403);

    const { status, counterAmount, terms, notes } = req.body;
    const updateData: Record<string, unknown> = {};

    if (status !== undefined) {
      const validStatuses = ['pending', 'accepted', 'rejected', 'countered', 'expired', 'withdrawn'];
      if (!validStatuses.includes(status)) {
        throw new AppError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
      }
      // Buyer can only withdraw; owner can accept/reject/counter
      if (isBuyer && !isPropertyOwner && status !== 'withdrawn') {
        throw new AppError('Buyers can only withdraw their offers', 403);
      }
      updateData.status = status;
    }
    if (counterAmount !== undefined) updateData.counterAmount = counterAmount;
    if (terms !== undefined) updateData.terms = terms;
    if (notes !== undefined) updateData.notes = notes;

    const updated = await prisma.offer.update({ where: { id }, data: updateData });

    // AVAILABILITY GUARD: lock property when offer is accepted, unlock when rejected/withdrawn
    if (status === 'accepted' && existing.propertyId) {
      await prisma.property.update({
        where: { id: existing.propertyId },
        data: {
          isLocked: true,
          lockedAt: new Date(),
          inventoryStage: 'under_offer',
          status: 'reserved',
        },
      });
    } else if ((status === 'rejected' || status === 'withdrawn') && existing.propertyId) {
      // Unlock only if no other accepted offers exist for this property
      const otherAccepted = await prisma.offer.count({
        where: {
          propertyId: existing.propertyId,
          status: 'accepted',
          id: { not: id },
        },
      });
      if (otherAccepted === 0) {
        await prisma.property.update({
          where: { id: existing.propertyId },
          data: {
            isLocked: false,
            lockedAt: null,
            inventoryStage: 'verified_active',
            status: 'available',
          },
        });
      }
    }

    logger.info('Offer updated', { userId, offerId: id, status: updated.status });
    res.json({ success: true, data: updated });
  }),
);

// ─── DELETE /api/offers/:id — Delete an offer ────────────────────────────────
router.delete(
  '/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { id } = req.params;
    const existing = await prisma.offer.findUnique({ where: { id } });
    if (!existing) throw new AppError('Offer not found', 404);
    if (existing.buyerId !== userId) throw new AppError('Access denied', 403);

    await prisma.offer.delete({ where: { id } });

    logger.info('Offer deleted', { userId, offerId: id });
    res.json({ success: true, message: 'Offer deleted' });
  }),
);

export default router;
