/**
 * Properties API Routes — Full CRUD Implementation
 * Endpoints: /api/properties
 * Supports: search, filter by type/status/price, pagination, stats
 */

import { Router, Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { asyncHandler, AppError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// ─── GET /api/properties ────────────────────────────────────────────────
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const {
      page = '1', pageSize = '20',
      status, type, search, featured,
      minPrice, maxPrice, minBeds, minBaths,
      sortBy = 'createdAt', sortOrder = 'desc',
      area,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string));
    const limit = Math.min(100, Math.max(1, parseInt(pageSize as string)));
    const skip = (pageNum - 1) * limit;

    const where: Prisma.PropertyWhereInput = {};

    if (status && status !== 'all') where.status = status as string;
    if (type && type !== 'all') where.type = type as string;
    if (area) where.area = area as string;
    if (featured === 'true') where.featured = true;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) (where.price as any).gte = parseFloat(minPrice as string);
      if (maxPrice) (where.price as any).lte = parseFloat(maxPrice as string);
    }
    if (minBeds) where.bedrooms = { gte: parseInt(minBeds as string) };
    if (minBaths) where.bathrooms = { gte: parseInt(minBaths as string) };
    if (search) {
      const s = search as string;
      where.OR = [
        { title: { contains: s, mode: 'insensitive' } },
        { location: { contains: s, mode: 'insensitive' } },
        { description: { contains: s, mode: 'insensitive' } },
        { area: { contains: s, mode: 'insensitive' } },
      ];
    }

    const validSortFields = ['createdAt', 'updatedAt', 'price', 'title', 'sqft', 'bedrooms'];
    const field = validSortFields.includes(sortBy as string) ? (sortBy as string) : 'createdAt';
    const orderBy: any = { [field]: sortOrder === 'asc' ? 'asc' : 'desc' };

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where, orderBy, skip, take: limit,
        include: {
          user: { select: { id: true, name: true, email: true } },
          _count: { select: { leads: true, commissions: true } },
        },
      }),
      prisma.property.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: properties,
      pagination: { page: pageNum, pageSize: limit, total, totalPages: Math.ceil(total / limit) },
    });
  })
);

// ─── GET /api/properties/stats ──────────────────────────────────────────
router.get(
  '/stats',
  asyncHandler(async (req: Request, res: Response) => {
    const [total, byStatus, byType, priceStats] = await Promise.all([
      prisma.property.count(),
      prisma.property.groupBy({ by: ['status'], _count: { _all: true } }),
      prisma.property.groupBy({ by: ['type'], _count: { _all: true } }),
      prisma.property.aggregate({
        _sum: { price: true },
        _avg: { price: true, sqft: true },
        _min: { price: true },
        _max: { price: true },
      }),
    ]);

    const statusCounts: Record<string, number> = {};
    byStatus.forEach(s => { statusCounts[s.status] = s._count._all; });

    const typeCounts: Record<string, number> = {};
    byType.forEach(t => { typeCounts[t.type] = t._count._all; });

    res.status(200).json({
      success: true,
      data: {
        total,
        byStatus: statusCounts,
        byType: typeCounts,
        portfolioValue: priceStats._sum.price || 0,
        averagePrice: Math.round(priceStats._avg.price || 0),
        averageSqft: Math.round(priceStats._avg.sqft || 0),
        priceRange: {
          min: priceStats._min.price || 0,
          max: priceStats._max.price || 0,
        },
      },
    });
  })
);

// ─── GET /api/properties/:id ────────────────────────────────────────────
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        leads: {
          select: { id: true, name: true, status: true, budget: true },
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        commissions: true,
      },
    });

    if (!property) throw new AppError('Property not found', 404);

    res.status(200).json({ success: true, data: property });
  })
);

// ─── POST /api/properties ───────────────────────────────────────────────
router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { title, description, type, status, price, bedrooms, bathrooms, sqft,
      location, area, amenities, images, featured, agentName } = req.body;

    if (!title?.trim()) throw new AppError('Property title is required', 400);
    if (!price || price <= 0) throw new AppError('Valid price is required', 400);
    if (!location?.trim()) throw new AppError('Location is required', 400);

    const property = await prisma.property.create({
      data: {
        title: title.trim(),
        description: description || null,
        type: type || 'apartment',
        status: status || 'available',
        price: parseFloat(price),
        bedrooms: parseInt(bedrooms) || 0,
        bathrooms: parseInt(bathrooms) || 0,
        sqft: parseInt(sqft) || 0,
        location: location.trim(),
        area: area || null,
        amenities: amenities || [],
        images: images || [],
        featured: featured || false,
        agentName: agentName || null,
        userId: (req as any).user?.id || 'system',
      },
    });

    await prisma.activity.create({
      data: {
        type: 'property', action: 'created',
        description: `New property listed: ${property.title} - AED ${property.price.toLocaleString()}`,
        userId: (req as any).user?.id || null,
      },
    });

    res.status(201).json({ success: true, data: property });
  })
);

// ─── PATCH /api/properties/:id ──────────────────────────────────────────
router.patch(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, type, status, price, bedrooms, bathrooms, sqft,
      location, area, amenities, images, featured, agentName } = req.body;

    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) throw new AppError('Property not found', 404);

    const data: any = {};
    if (title !== undefined) data.title = title.trim();
    if (description !== undefined) data.description = description;
    if (type !== undefined) data.type = type;
    if (status !== undefined) data.status = status;
    if (price !== undefined) data.price = parseFloat(price);
    if (bedrooms !== undefined) data.bedrooms = parseInt(bedrooms);
    if (bathrooms !== undefined) data.bathrooms = parseInt(bathrooms);
    if (sqft !== undefined) data.sqft = parseInt(sqft);
    if (location !== undefined) data.location = location.trim();
    if (area !== undefined) data.area = area;
    if (amenities !== undefined) data.amenities = amenities;
    if (images !== undefined) data.images = images;
    if (featured !== undefined) data.featured = featured;
    if (agentName !== undefined) data.agentName = agentName;

    const statusChanged = status && status !== existing.status;

    const property = await prisma.property.update({ where: { id }, data });

    await prisma.activity.create({
      data: {
        type: 'property',
        action: statusChanged ? 'status_changed' : 'updated',
        description: statusChanged
          ? `Property "${property.title}" status: ${existing.status} → ${status}`
          : `Property "${property.title}" updated`,
        userId: (req as any).user?.id || null,
      },
    });

    res.status(200).json({ success: true, data: property });
  })
);

// ─── DELETE /api/properties/:id ─────────────────────────────────────────
router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) throw new AppError('Property not found', 404);

    await prisma.property.delete({ where: { id } });

    await prisma.activity.create({
      data: {
        type: 'property', action: 'deleted',
        description: `Property deleted: ${existing.title}`,
        userId: (req as any).user?.id || null,
      },
    });

    res.status(200).json({ success: true, message: `Property "${existing.title}" deleted` });
  })
);

export default router;
