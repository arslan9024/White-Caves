/**
 * Properties API Routes — Full CRUD Implementation
 * Endpoints: /api/properties
 * Supports: search, filter by type/status/price, pagination, stats
 */

import { Router, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import type { AuthRequest } from '../middleware/auth';
import { prisma } from '../database.js';
import { sanitizeString } from '../utils/sanitize';
import { validate, rules, validateIdParam } from '../utils/validate';
import { parsePagination } from '../config/pagination';
import { requirePermission } from '../middleware/rbac';
import { sendSuccess, sendCreated, buildPagination } from '../utils/apiResponse';

const router = Router();

// ─── GET /api/properties ────────────────────────────────────────────────
router.get(
  '/',
  requirePermission('view_properties'),
  asyncHandler(async (req: Request, res: Response) => {
    const {
      status, type, search, featured,
      minPrice, maxPrice, minBeds, minBaths,
      sortBy = 'createdAt', sortOrder = 'desc',
      area,
    } = req.query;

    const { page: pageNum, limit, skip } = parsePagination({
      page: req.query.page as string,
      limit: req.query.pageSize as string,
    });

    const where: Prisma.PropertyWhereInput = {};

    if (status && status !== 'all') where.status = status as string;
    if (type && type !== 'all') where.type = type as string;
    if (area) where.area = area as string;
    if (featured === 'true') where.featured = true;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) {
        const parsed = parseFloat(minPrice as string);
        if (!isNaN(parsed)) where.price.gte = parsed;
      }
      if (maxPrice) {
        const parsed = parseFloat(maxPrice as string);
        if (!isNaN(parsed)) where.price.lte = parsed;
      }
    }
    if (minBeds) {
      const parsed = parseInt(minBeds as string, 10);
      if (!isNaN(parsed)) where.bedrooms = { gte: parsed };
    }
    if (minBaths) {
      const parsed = parseInt(minBaths as string, 10);
      if (!isNaN(parsed)) where.bathrooms = { gte: parsed };
    }
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
    const orderBy: Prisma.PropertyOrderByWithRelationInput = { [field]: sortOrder === 'asc' ? 'asc' : 'desc' };

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

    sendSuccess(res, properties, 'OK', 200, buildPagination(pageNum, limit, total));
  })
);

// ─── GET /api/properties/stats ──────────────────────────────────────────
router.get(
  '/stats',
  requirePermission('view_properties'),
  asyncHandler(async (req: Request, res: Response) => {
    // AUTHORIZATION: Only managers+ can view aggregated property statistics
    const allowedRoles = ['owner', 'manager', 'admin', 'finance'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied — property statistics require manager role', 403);
    }

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

    sendSuccess(res, {
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
      });
  })
);

// ─── GET /api/properties/:id ────────────────────────────────────────────
router.get(
  '/:id',
  requirePermission('view_properties'),
  asyncHandler(async (req: Request, res: Response) => {
    validateIdParam(req.params.id, 'Property ID');
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

    sendSuccess(res, property);
  })
);

// ─── POST /api/properties ───────────────────────────────────────────────
router.post(
  '/',
  requirePermission('create_property'),
  asyncHandler(async (req: Request, res: Response) => {
    // AUTHORIZATION: Only owner, manager, or agents can create properties
    const allowedRoles = ['owner', 'manager', 'agent'];
    if (!allowedRoles.includes(req.user?.role || '')) {
      throw new AppError('Access denied — insufficient permissions to create properties', 403);
    }

    const { title, description, type, status, price, bedrooms, bathrooms, sqft,
      location, area, amenities, images, featured, agentName } = req.body;

    validate(req.body, {
      title:       rules.requiredStringWithMax('Property title', 255),
      price:       rules.positiveNumber('Price'),
      location:    rules.requiredStringWithMax('Location', 500),
      type:        rules.oneOf('Property type', ['apartment', 'villa', 'townhouse', 'penthouse', 'office', 'retail', 'land', 'warehouse']),
      status:      rules.oneOf('Status', ['available', 'reserved', 'sold', 'rented', 'off_market']),
      amenities:   rules.optionalArray('Amenities'),
      images:      rules.optionalArray('Images'),
      description: rules.optionalStringWithMax('Description', 5000),
    });

    const property = await prisma.property.create({
      data: {
        title: sanitizeString(title.trim()),
        description: description ? sanitizeString(description) : null,
        type: type || 'apartment',
        status: status || 'available',
        price: parseFloat(price),
        bedrooms: Math.max(0, parseInt(bedrooms, 10) || 0),
        bathrooms: Math.max(0, parseInt(bathrooms, 10) || 0),
        sqft: Math.max(0, parseInt(sqft, 10) || 0),
        location: sanitizeString(location.trim()),
        area: area ? sanitizeString(area) : null,
        amenities: (amenities || []).filter((a: unknown): a is string => typeof a === 'string' && a.trim().length > 0).map(sanitizeString),
        images: (images || []).filter((i: unknown): i is string => typeof i === 'string' && i.trim().length > 0).map(sanitizeString),
        featured: featured || false,
        agentName: agentName ? sanitizeString(agentName) : null,
        userId: req.user?.id || 'system',
      },
    });

    await prisma.activity.create({
      data: {
        type: 'property', action: 'created',
        description: `New property listed: ${property.title} - AED ${property.price.toLocaleString()}`,
        userId: req.user?.id || null,
      },
    });

    sendCreated(res, property);
  })
);

// ─── PATCH /api/properties/:id ──────────────────────────────────────────
router.patch(
  '/:id',
  requirePermission('edit_property'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    validateIdParam(id, 'Property ID');
    const { title, description, type, status, price, bedrooms, bathrooms, sqft,
      location, area, amenities, images, featured, agentName } = req.body;

    validate(req.body, {
      title:       rules.optionalStringWithMax('Property title', 255),
      description: rules.optionalStringWithMax('Description', 5000),
      location:    rules.optionalStringWithMax('Location', 500),
      area:        rules.optionalStringWithMax('Area', 255),
      agentName:   rules.optionalStringWithMax('Agent name', 255),
      type:      rules.oneOf('Property type', ['apartment', 'villa', 'townhouse', 'penthouse', 'office', 'retail', 'land', 'warehouse']),
      status:    rules.oneOf('Status', ['available', 'reserved', 'sold', 'rented', 'off_market']),
      amenities: rules.optionalArray('Amenities'),
      images:    rules.optionalArray('Images'),
    });

    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) throw new AppError('Property not found', 404);

    // AUTHORIZATION: Only admins or property owner can update
    const isAdmin = ['owner', 'manager'].includes(req.user?.role || '');
    const isPropertyOwner = existing.userId === req.user?.id;
    if (!isAdmin && !isPropertyOwner) {
      throw new AppError('You do not have permission to update this property', 403);
    }

    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = sanitizeString(String(title).trim());
    if (description !== undefined) data.description = description ? sanitizeString(String(description)) : null;
    if (type !== undefined) data.type = type;
    if (status !== undefined) data.status = status;
    if (price !== undefined) {
      const parsedPrice = parseFloat(price as string);
      if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
        throw new AppError('Property price must be a valid non-negative number', 400);
      }
      data.price = parsedPrice;
    }
    if (bedrooms !== undefined) data.bedrooms = Math.max(0, !isNaN(parseInt(bedrooms as string, 10)) ? parseInt(bedrooms as string, 10) : 0);
    if (bathrooms !== undefined) data.bathrooms = Math.max(0, !isNaN(parseInt(bathrooms as string, 10)) ? parseInt(bathrooms as string, 10) : 0);
    if (sqft !== undefined) data.sqft = Math.max(0, !isNaN(parseInt(sqft as string, 10)) ? parseInt(sqft as string, 10) : 0);
    if (location !== undefined) data.location = sanitizeString(String(location).trim());
    if (area !== undefined) data.area = area ? sanitizeString(String(area)) : null;
    if (amenities !== undefined) data.amenities = Array.isArray(amenities) ? amenities.map((a: unknown) => typeof a === 'string' ? sanitizeString(a) : String(a)) : [];
    if (images !== undefined) data.images = Array.isArray(images) ? images.map((i: unknown) => typeof i === 'string' ? sanitizeString(i) : String(i)) : [];
    if (featured !== undefined) data.featured = featured === true || featured === 'true';
    if (agentName !== undefined) data.agentName = agentName ? sanitizeString(String(agentName)) : null;

    const statusChanged = status !== undefined && status !== null && status !== existing.status;

    const property = await prisma.property.update({ where: { id }, data });

    await prisma.activity.create({
      data: {
        type: 'property',
        action: statusChanged ? 'status_changed' : 'updated',
        description: statusChanged
          ? `Property "${property.title}" status: ${existing.status} → ${status}`
          : `Property "${property.title}" updated`,
        userId: req.user?.id || null,
      },
    });

    sendSuccess(res, property);
  })
);

// ─── DELETE /api/properties/:id ─────────────────────────────────────────
router.delete(
  '/:id',
  requirePermission('delete_property'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    validateIdParam(id, 'Property ID');

    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) throw new AppError('Property not found', 404);

    // AUTHORIZATION: Only admins or property owner can delete
    const isAdmin = ['owner', 'manager'].includes(req.user?.role || '');
    const isPropertyOwner = existing.userId === req.user?.id;
    if (!isAdmin && !isPropertyOwner) {
      throw new AppError('You do not have permission to delete this property', 403);
    }

    await prisma.$transaction(async (tx) => {
      // Clean up references to avoid orphaned records
      await tx.commission.updateMany({ where: { propertyId: id }, data: { propertyId: null } });
      await tx.lead.updateMany({ where: { propertyId: id }, data: { propertyId: null } });

      await tx.property.delete({ where: { id } });

      await tx.activity.create({
        data: {
          type: 'property', action: 'deleted',
          description: `Property deleted: ${existing.title} (by ${req.user?.email})`,
          userId: req.user?.id || null,
        },
      });
    });

    sendSuccess(res, null, `Property "${existing.title}" deleted`);
  })
);

export default router;
