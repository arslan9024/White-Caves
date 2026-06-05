// @ts-nocheck
/**
 * Offers API Routes
 * ─────────────────
 * CRUD endpoints for property purchase/rental offers.
 *
 * GET    /api/offers                — List user's offers (as buyer/tenant)
 * GET    /api/offers/received       — Offers received on user's properties (as seller/landlord)
 * POST   /api/offers                — Submit a new offer
 * PATCH  /api/offers/:id            — Update offer (accept, reject, counter, withdraw)
 * PATCH  /api/offers/:id/decision   — Accept / reject / counter with full lifecycle handling
 * DELETE /api/offers/:id            — Delete an offer
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
  })
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
    const propertyIds = userProperties.map(p => p.id);

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
  })
);

// ─── POST /api/offers — Submit a new offer ───────────────────────────────────
router.post(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { propertyId, amount, terms, expiresAt, leadId, offerType } = req.body;
    if (!propertyId) throw new AppError('propertyId is required', 400);
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      throw new AppError('amount must be a positive number', 400);
    }

    // Verify property exists and is available
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) throw new AppError('Property not found', 404);

    const validOfferTypes = ['lease', 'sale'];
    const resolvedOfferType =
      offerType && validOfferTypes.includes(offerType) ? offerType : 'lease';

    const offer = await prisma.offer.create({
      data: {
        buyerId: userId,
        propertyId,
        amount,
        offerType: resolvedOfferType,
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
  })
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

    const { status, counterAmount, terms, notes, rejectionReason } = req.body;
    const updateData: Record<string, unknown> = {};

    if (status !== undefined) {
      const validStatuses = [
        'pending',
        'accepted',
        'rejected',
        'countered',
        'expired',
        'withdrawn',
      ];
      if (!validStatuses.includes(status)) {
        throw new AppError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
      }
      // Buyer can only withdraw; owner can accept/reject/counter
      if (isBuyer && !isPropertyOwner && status !== 'withdrawn') {
        throw new AppError('Buyers can only withdraw their offers', 403);
      }
      updateData.status = status;
    }
    if (counterAmount !== undefined) {
      updateData.counterAmount = counterAmount;
      // Track counter history
      const existing2 = await prisma.offer.findUnique({
        where: { id },
        select: { counterHistory: true },
      });
      const history = Array.isArray(existing2?.counterHistory)
        ? (existing2!.counterHistory as unknown[])
        : [];
      history.push({ amount: counterAmount, terms, by: userId, at: new Date().toISOString() });
      updateData.counterHistory = history;
    }
    if (terms !== undefined) updateData.terms = terms;
    if (notes !== undefined) updateData.notes = notes;
    if (rejectionReason !== undefined) updateData.rejectionReason = rejectionReason;

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
  })
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
  })
);

// ─── PATCH /api/offers/:id/decision — Accept / Reject / Counter ─────────────
// Dedicated endpoint for lifecycle decisions with full side-effect handling
router.patch(
  '/:id/decision',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { id } = req.params;
    const existing = await prisma.offer.findUnique({
      where: { id },
      include: { property: { select: { userId: true, title: true, id: true } } },
    });
    if (!existing) throw new AppError('Offer not found', 404);

    // Only property owner / landlord or owner (admin) can make this decision
    const isPropertyOwner = existing.property?.userId === userId;
    const userRole = req.user?.role;
    if (!isPropertyOwner && userRole !== 'owner') {
      throw new AppError('Access denied — only property owner or admin can decide on offers', 403);
    }

    const { decision, counterAmount, terms, rejectionReason } = req.body;
    const validDecisions = ['accepted', 'rejected', 'countered'];
    if (!decision || !validDecisions.includes(decision)) {
      throw new AppError(`decision must be one of: ${validDecisions.join(', ')}`, 400);
    }

    if (
      decision === 'countered' &&
      (!counterAmount || typeof counterAmount !== 'number' || counterAmount <= 0)
    ) {
      throw new AppError(
        'counterAmount is required and must be a positive number for counter decisions',
        400
      );
    }
    if (decision === 'rejected' && !rejectionReason) {
      throw new AppError('rejectionReason is required when rejecting an offer', 400);
    }

    // Build counter history
    const history = Array.isArray(existing.counterHistory)
      ? (existing.counterHistory as unknown[])
      : [];
    if (decision === 'countered') {
      history.push({ amount: counterAmount, terms, by: userId, at: new Date().toISOString() });
    }

    const updated = await prisma.offer.update({
      where: { id },
      data: {
        status: decision,
        ...(decision === 'countered' ? { counterAmount, counterHistory: history } : {}),
        ...(decision === 'rejected' ? { rejectionReason } : {}),
        ...(terms ? { terms } : {}),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      include: {
        property: { select: { id: true, title: true, location: true } },
        buyer: { select: { id: true, name: true, email: true } },
      },
    });

    // If accepted, advance associated lead to stage 6 (Deposit)
    if (decision === 'accepted' && existing.leadId) {
      await prisma.lead
        .update({
          where: { id: existing.leadId },
          data: { leasingStage: 6, status: 'qualified' },
        })
        .catch(err => logger.warn('Failed to advance lead stage on offer acceptance', { err }));
    }

    // If rejected, revert lead to stage 2 (Matching) so agent can find alternatives
    if (decision === 'rejected' && existing.leadId) {
      await prisma.lead
        .update({
          where: { id: existing.leadId },
          data: { leasingStage: 2, status: 'warm' },
        })
        .catch(err => logger.warn('Failed to revert lead stage on offer rejection', { err }));
    }

    logger.info('Offer decision recorded', { userId, offerId: id, decision });
    res.json({ success: true, data: updated, message: `Offer ${decision}` });
  })
);

export default router;
