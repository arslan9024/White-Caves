/**
 * Favorites API Routes
 * ────────────────────
 * CRUD endpoints for user property favorites.
 * Each user can favorite a property once (unique constraint).
 *
 * GET    /api/favorites           — List user's favorites (with property data)
 * POST   /api/favorites           — Add a favorite
 * DELETE /api/favorites/:propertyId — Remove a favorite
 * GET    /api/favorites/check/:propertyId — Check if a property is favorited
 * GET    /api/favorites/ids       — Get all favorited property IDs (lightweight)
 */

import { Router, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../database.js';
import logger from '../utils/logger.js';

const router = Router();

// ─── GET /api/favorites — List all favorites for current user ────────────────
router.get(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize as string) || 20));
    const skip = (page - 1) * pageSize;

    const [favorites, total] = await Promise.all([
      prisma.favorite.findMany({
        where: { userId },
        include: {
          property: {
            select: {
              id: true,
              title: true,
              price: true,
              location: true,
              area: true,
              type: true,
              status: true,
              bedrooms: true,
              bathrooms: true,
              sqft: true,
              images: true,
              featured: true,
              agentName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.favorite.count({ where: { userId } }),
    ]);

    res.status(200).json({
      success: true,
      data: favorites,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  }),
);

// ─── GET /api/favorites/ids — Get all favorited property IDs (lightweight) ───
router.get(
  '/ids',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      select: { propertyId: true },
    });

    res.status(200).json({
      success: true,
      data: favorites.map(f => f.propertyId),
    });
  }),
);

// ─── GET /api/favorites/check/:propertyId — Check if property is favorited ───
router.get(
  '/check/:propertyId',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { propertyId } = req.params as Record<string, string>;
    if (!propertyId) throw new AppError('Property ID is required', 400);

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_propertyId: { userId, propertyId },
      },
    });

    res.status(200).json({
      success: true,
      data: { isFavorited: !!favorite },
    });
  }),
);

// ─── POST /api/favorites — Add a favorite ────────────────────────────────────
router.post(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { propertyId } = req.body;
    if (!propertyId) throw new AppError('propertyId is required', 400);

    // Verify property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true, title: true },
    });
    if (!property) throw new AppError('Property not found', 404);

    // Upsert to handle duplicate gracefully
    const favorite = await prisma.favorite.upsert({
      where: {
        userId_propertyId: { userId, propertyId },
      },
      create: { userId, propertyId },
      update: {}, // No-op if already exists
      include: {
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            location: true,
            type: true,
            status: true,
            images: true,
          },
        },
      },
    });

    logger.info('Property favorited', { userId, propertyId, propertyTitle: property.title });

    res.status(201).json({
      success: true,
      data: favorite,
    });
  }),
);

// ─── DELETE /api/favorites/:propertyId — Remove a favorite ───────────────────
router.delete(
  '/:propertyId',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { propertyId } = req.params as Record<string, string>;
    if (!propertyId) throw new AppError('Property ID is required', 400);

    // Check it exists before deleting
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_propertyId: { userId, propertyId },
      },
    });

    if (!existing) {
      throw new AppError('Favorite not found', 404);
    }

    await prisma.favorite.delete({
      where: {
        userId_propertyId: { userId, propertyId },
      },
    });

    logger.info('Favorite removed', { userId, propertyId });

    res.status(200).json({
      success: true,
      message: 'Favorite removed',
    });
  }),
);

export default router;
