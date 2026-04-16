/**
 * Saved Searches API Routes
 * ─────────────────────────
 * CRUD for user saved search criteria with optional alert notifications.
 *
 * GET    /api/saved-searches           — List user's saved searches
 * POST   /api/saved-searches           — Create a saved search
 * PATCH  /api/saved-searches/:id       — Update a saved search
 * DELETE /api/saved-searches/:id       — Delete a saved search
 * POST   /api/saved-searches/:id/check — Check for new matches
 */

import { Router, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../database.js';
import { createLogger } from '../utils/logger.js';

const log = createLogger('SavedSearches');
const router = Router();

// ─── GET /api/saved-searches — List all saved searches for current user ──────
router.get(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const searches = await prisma.savedSearch.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: searches,
    });
  }),
);

// ─── POST /api/saved-searches — Create a saved search ───────────────────────
router.post(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { name, filters, alertEnabled } = req.body;
    if (!name || !filters) throw new AppError('name and filters are required', 400);
    if (typeof name !== 'string' || name.trim().length === 0) {
      throw new AppError('name must be a non-empty string', 400);
    }
    if (typeof filters !== 'object') {
      throw new AppError('filters must be an object', 400);
    }

    // Limit saved searches per user
    const count = await prisma.savedSearch.count({ where: { userId } });
    if (count >= 20) {
      throw new AppError('Maximum 20 saved searches allowed. Delete one to create a new one.', 400);
    }

    // Count current matches
    const matchCount = await countPropertyMatches(filters);

    const search = await prisma.savedSearch.create({
      data: {
        name: name.trim(),
        filters,
        alertEnabled: alertEnabled === true,
        matchCount,
        userId,
      },
    });

    log.info('Saved search created', { userId, searchId: search.id, name: search.name });

    res.status(201).json({
      success: true,
      data: search,
    });
  }),
);

// ─── PATCH /api/saved-searches/:id — Update a saved search ──────────────────
router.patch(
  '/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { id } = req.params;
    const existing = await prisma.savedSearch.findUnique({ where: { id } });
    if (!existing) throw new AppError('Saved search not found', 404);
    if (existing.userId !== userId) throw new AppError('Access denied', 403);

    const { name, filters, alertEnabled } = req.body;
    const updateData: Record<string, unknown> = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        throw new AppError('name must be a non-empty string', 400);
      }
      updateData.name = name.trim();
    }
    if (filters !== undefined) {
      if (typeof filters !== 'object') {
        throw new AppError('filters must be an object', 400);
      }
      updateData.filters = filters;
      updateData.matchCount = await countPropertyMatches(filters);
    }
    if (alertEnabled !== undefined) {
      updateData.alertEnabled = alertEnabled === true;
    }

    const updated = await prisma.savedSearch.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      data: updated,
    });
  }),
);

// ─── DELETE /api/saved-searches/:id — Delete a saved search ──────────────────
router.delete(
  '/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { id } = req.params;
    const existing = await prisma.savedSearch.findUnique({ where: { id } });
    if (!existing) throw new AppError('Saved search not found', 404);
    if (existing.userId !== userId) throw new AppError('Access denied', 403);

    await prisma.savedSearch.delete({ where: { id } });

    log.info('Saved search deleted', { userId, searchId: id });

    res.status(200).json({
      success: true,
      message: 'Saved search deleted',
    });
  }),
);

// ─── POST /api/saved-searches/:id/check — Check for new matches ─────────────
router.post(
  '/:id/check',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { id } = req.params;
    const search = await prisma.savedSearch.findUnique({ where: { id } });
    if (!search) throw new AppError('Saved search not found', 404);
    if (search.userId !== userId) throw new AppError('Access denied', 403);

    const filters = search.filters as Record<string, unknown>;
    const newMatchCount = await countPropertyMatches(filters);
    const previousCount = search.matchCount;

    await prisma.savedSearch.update({
      where: { id },
      data: { matchCount: newMatchCount, lastChecked: new Date() },
    });

    res.status(200).json({
      success: true,
      data: {
        matchCount: newMatchCount,
        previousCount,
        newMatches: Math.max(0, newMatchCount - previousCount),
      },
    });
  }),
);

// ─── Helper: Build Prisma where clause from filters ──────────────────────────
async function countPropertyMatches(filters: Record<string, unknown>): Promise<number> {
  const where: Record<string, unknown> = { status: 'available' };

  if (filters.type && typeof filters.type === 'string') {
    where.type = filters.type;
  }
  if (filters.location && typeof filters.location === 'string') {
    where.location = { contains: filters.location, mode: 'insensitive' };
  }
  if (filters.area && typeof filters.area === 'string') {
    where.area = { contains: filters.area, mode: 'insensitive' };
  }
  if (typeof filters.minPrice === 'number' || typeof filters.maxPrice === 'number') {
    where.price = {};
    if (typeof filters.minPrice === 'number') (where.price as Record<string, number>).gte = filters.minPrice;
    if (typeof filters.maxPrice === 'number') (where.price as Record<string, number>).lte = filters.maxPrice;
  }
  if (typeof filters.bedrooms === 'number') {
    where.bedrooms = { gte: filters.bedrooms };
  }
  if (typeof filters.bathrooms === 'number') {
    where.bathrooms = { gte: filters.bathrooms };
  }
  if (typeof filters.minSqft === 'number') {
    where.sqft = { gte: filters.minSqft };
  }

  return prisma.property.count({ where });
}

export default router;
