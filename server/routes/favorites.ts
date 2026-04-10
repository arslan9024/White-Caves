/**
 * Favorites API Routes — Property Favorites Management
 * Allow users to bookmark/favorite properties
 * Endpoints: /api/favorites
 */

import { Router, Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import type { AuthRequest } from '../middleware/auth';
import { prisma } from '../database.js';
import { validate, rules, validateIdParam } from '../utils/validate';
import { parsePagination } from '../config/pagination';

const router = Router();

// ─── GET /api/favorites ─────────────────────────────────────────────────
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { page: pageNum, limit, skip } = parsePagination({
      page: req.query.page as string,
      limit: req.query.pageSize as string,
    });

    const where = { userId };

    const [favorites, total] = await Promise.all([
      prisma.favorite.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.favorite.count({ where }),
    ]);

    // Populate property data for each favorite
    const propertyIds = favorites.map((f) => f.propertyId);
    const properties = propertyIds.length > 0
      ? await prisma.property.findMany({
          where: { id: { in: propertyIds } },
          select: {
            id: true, title: true, type: true, status: true,
            price: true, bedrooms: true, bathrooms: true, sqft: true,
            location: true, images: true, featured: true,
          },
        })
      : [];

    const propertyMap = new Map(properties.map((p) => [p.id, p]));
    const data = favorites.map((f) => ({
      ...f,
      property: propertyMap.get(f.propertyId) || null,
    }));

    res.status(200).json({
      success: true,
      data,
      pagination: {
        page: pageNum,
        pageSize: limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  })
);

// ─── POST /api/favorites ────────────────────────────────────────────────
router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { propertyId } = req.body;

    validate(req.body, {
      propertyId: rules.requiredMongoId('Property ID'),
    });

    // Verify the property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true },
    });
    if (!property) throw new AppError('Property not found', 404);

    // Check for existing favorite (unique constraint)
    const existing = await prisma.favorite.findUnique({
      where: { userId_propertyId: { userId, propertyId } },
    });
    if (existing) {
      throw new AppError('Property is already in your favorites', 400);
    }

    const favorite = await prisma.favorite.create({
      data: { userId, propertyId },
    });

    res.status(201).json({ success: true, data: favorite });
  })
);

// ─── DELETE /api/favorites/:propertyId ──────────────────────────────────
router.delete(
  '/:propertyId',
  asyncHandler(async (req: Request, res: Response) => {
    const { propertyId } = req.params;
    validateIdParam(propertyId, 'Property ID');
    const userId = (req as AuthRequest).user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const existing = await prisma.favorite.findUnique({
      where: { userId_propertyId: { userId, propertyId } },
    });
    if (!existing) throw new AppError('Favorite not found', 404);

    await prisma.favorite.delete({
      where: { userId_propertyId: { userId, propertyId } },
    });

    res.status(200).json({ success: true, message: 'Favorite removed' });
  })
);

// ─── GET /api/favorites/check/:propertyId ───────────────────────────────
router.get(
  '/check/:propertyId',
  asyncHandler(async (req: Request, res: Response) => {
    const { propertyId } = req.params;
    validateIdParam(propertyId, 'Property ID');
    const userId = (req as AuthRequest).user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const favorite = await prisma.favorite.findUnique({
      where: { userId_propertyId: { userId, propertyId } },
    });

    res.status(200).json({
      success: true,
      data: { isFavorited: !!favorite },
    });
  })
);

export default router;
