/**
 * Properties API Routes — Full CRUD Implementation
 * Endpoints: /api/properties
 * Supports: search, filter by type/status/price, pagination, stats
 */

import { Router, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { prisma } from '../database.js';
import { sanitizeString } from '../utils/sanitize';
import { validate, rules, validateIdParam } from '../utils/validate';
import { parsePagination } from '../config/pagination';
import { requirePermission, scopeToOwn, requireMinRole } from '../middleware/rbac';

const router = Router();

// ─── GET /api/properties ────────────────────────────────────────────────
router.get(
  '/',
  requirePermission('view_properties'),
  scopeToOwn('userId'),
  asyncHandler(async (req: Request, res: Response) => {
    const {
      status,
      type,
      search,
      featured,
      minPrice,
      maxPrice,
      minBeds,
      minBaths,
      beds,
      baths,
      location,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      area,
    } = req.query;

    const {
      page: pageNum,
      limit,
      skip,
    } = parsePagination({
      page: req.query.page as string,
      limit: req.query.pageSize as string,
    });

    const where: Prisma.PropertyWhereInput = {};

    if (status && status !== 'all') where.status = status as string;
    if (type && type !== 'all') where.type = type as string;
    if (area) where.area = area as string;
    if (location && location !== 'All Locations') {
      where.location = { contains: location as string, mode: 'insensitive' };
    }
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
    const resolvedMinBeds = minBeds ?? beds;
    if (resolvedMinBeds) {
      const parsed = parseInt(resolvedMinBeds as string, 10);
      if (!isNaN(parsed)) where.bedrooms = { gte: parsed };
    }
    const resolvedMinBaths = minBaths ?? baths;
    if (resolvedMinBaths) {
      const parsed = parseInt(resolvedMinBaths as string, 10);
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

    // Row-level security: agents only see properties they own (userId = their id).
    // scopeToOwn('userId') sets req.ownershipFilter; supervisors get {} (no restriction).
    const ownerFilter = req.ownershipFilter ?? {};
    if (Object.keys(ownerFilter).length > 0) {
      Object.assign(where, ownerFilter);
    }

    const validSortFields = ['createdAt', 'updatedAt', 'price', 'title', 'sqft', 'bedrooms'];
    const field = validSortFields.includes(sortBy as string) ? (sortBy as string) : 'createdAt';
    const orderBy: Prisma.PropertyOrderByWithRelationInput = {
      [field]: sortOrder === 'asc' ? 'asc' : 'desc',
    };

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        orderBy,
        skip,
        take: limit,
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
  requirePermission('view_properties'),
  requireMinRole('manager'),
  asyncHandler(async (_req: Request, res: Response) => {
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
    byStatus.forEach(s => {
      statusCounts[s.status] = s._count._all;
    });

    const typeCounts: Record<string, number> = {};
    byType.forEach(t => {
      typeCounts[t.type] = t._count._all;
    });

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

// ─── GET /api/properties/inventory-stats ───────────────────────────────
// Returns per-stage counts and document-alert totals for the Inventory Dashboard.
router.get(
  '/inventory-stats',
  requirePermission('view_properties'),
  asyncHandler(async (_req: Request, res: Response) => {
    const [stageCounts, titleDeedMissing, landlordPassportMissing, ejariMissing, total] =
      await Promise.all([
        prisma.property.groupBy({
          by: ['inventoryStage'],
          _count: { _all: true },
        }),
        prisma.property.count({ where: { titleDeedMissing: true } }),
        prisma.property.count({ where: { landlordPassportMissing: true } }),
        prisma.property.count({ where: { ejariMissing: true } }),
        prisma.property.count(),
      ]);

    const stages: Record<string, number> = {};
    stageCounts.forEach(s => {
      stages[s.inventoryStage ?? 'draft_collected'] = s._count._all;
    });

    res.status(200).json({
      success: true,
      total,
      stages,
      docAlerts: { titleDeedMissing, landlordPassportMissing, ejariMissing },
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

    res.status(200).json({ success: true, data: property });
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

    const {
      title,
      description,
      type,
      status,
      price,
      bedrooms,
      bathrooms,
      sqft,
      location,
      area,
      amenities,
      images,
      featured,
      agentName,
      unitNumber,
      floorPlan,
      rentalPrice,
      commissionPercent,
      availabilityDate,
      inventoryStage,
      titleDeedMissing,
      landlordPassportMissing,
      ejariMissing,
    } = req.body;

    validate(req.body, {
      title: rules.requiredStringWithMax('Property title', 255),
      price: rules.positiveNumber('Price'),
      location: rules.requiredStringWithMax('Location', 500),
      type: rules.oneOf('Property type', [
        'apartment',
        'villa',
        'townhouse',
        'penthouse',
        'office',
        'retail',
        'land',
        'warehouse',
        'studio',
        'duplex',
        'commercial',
      ]),
      status: rules.oneOf('Status', ['available', 'reserved', 'sold', 'rented', 'off_market']),
      amenities: rules.optionalArray('Amenities'),
      images: rules.optionalArray('Images'),
      description: rules.optionalStringWithMax('Description', 5000),
    });

    const VALID_STAGES = [
      'draft_collected',
      'verified_active',
      'under_offer',
      'leased_sold',
      'handed_over',
    ];
    const resolvedStage =
      inventoryStage && VALID_STAGES.includes(inventoryStage) ? inventoryStage : 'draft_collected';

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
        amenities: (amenities || [])
          .filter((a: unknown): a is string => typeof a === 'string' && a.trim().length > 0)
          .map(sanitizeString),
        images: (images || [])
          .filter((i: unknown): i is string => typeof i === 'string' && i.trim().length > 0)
          .map(sanitizeString),
        featured: featured || false,
        agentName: agentName ? sanitizeString(agentName) : null,
        // @Mary Intelligent Inventory fields
        unitNumber: unitNumber ? sanitizeString(String(unitNumber).trim()) : null,
        floorPlan: floorPlan ? sanitizeString(String(floorPlan).trim()) : null,
        rentalPrice:
          rentalPrice !== undefined && rentalPrice !== null && rentalPrice !== ''
            ? parseFloat(rentalPrice) || 0
            : null,
        commissionPercent:
          commissionPercent !== undefined && commissionPercent !== null && commissionPercent !== ''
            ? parseFloat(commissionPercent) || 5
            : 5,
        availabilityDate: availabilityDate ? new Date(availabilityDate) : null,
        inventoryStage: resolvedStage,
        titleDeedMissing: titleDeedMissing === true || titleDeedMissing === 'true',
        landlordPassportMissing:
          landlordPassportMissing === true || landlordPassportMissing === 'true',
        ejariMissing: ejariMissing === true || ejariMissing === 'true',
        userId: req.user?.id || 'system',
      },
    });

    await prisma.activity.create({
      data: {
        type: 'property',
        action: 'created',
        description: `New property listed: ${property.title} - AED ${property.price.toLocaleString()}`,
        userId: req.user?.id || null,
      },
    });

    res.status(201).json({ success: true, data: property });
  })
);

// ─── PATCH /api/properties/:id ──────────────────────────────────────────
router.patch(
  '/:id',
  requirePermission('edit_property'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    validateIdParam(id, 'Property ID');
    const {
      title,
      description,
      type,
      status,
      price,
      bedrooms,
      bathrooms,
      sqft,
      location,
      area,
      amenities,
      images,
      featured,
      agentName,
      unitNumber,
      floorPlan,
      rentalPrice,
      commissionPercent,
      availabilityDate,
      inventoryStage,
      titleDeedMissing,
      landlordPassportMissing,
      ejariMissing,
    } = req.body;

    validate(req.body, {
      title: rules.optionalStringWithMax('Property title', 255),
      description: rules.optionalStringWithMax('Description', 5000),
      location: rules.optionalStringWithMax('Location', 500),
      area: rules.optionalStringWithMax('Area', 255),
      agentName: rules.optionalStringWithMax('Agent name', 255),
      type: rules.oneOf('Property type', [
        'apartment',
        'villa',
        'townhouse',
        'penthouse',
        'office',
        'retail',
        'land',
        'warehouse',
      ]),
      status: rules.oneOf('Status', ['available', 'reserved', 'sold', 'rented', 'off_market']),
      amenities: rules.optionalArray('Amenities'),
      images: rules.optionalArray('Images'),
    });

    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) throw new AppError('Property not found', 404);

    // AUTHORIZATION: Only admins or property owner can update
    const isAdmin = ['owner', 'manager'].includes(req.user?.role || '');
    const isPropertyOwner = existing.userId === req.user?.id;
    if (!isAdmin && !isPropertyOwner) {
      throw new AppError('You do not have permission to update this property', 403);
    }

    // AVAILABILITY GUARD: A locked property may only be unlocked by managers/owners
    if (existing.isLocked && !isAdmin) {
      throw new AppError(
        'This property is locked under an active offer. Only a manager can modify it.',
        423
      );
    }

    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = sanitizeString(String(title).trim());
    if (description !== undefined)
      data.description = description ? sanitizeString(String(description)) : null;
    if (type !== undefined) data.type = type;
    if (status !== undefined) data.status = status;
    if (price !== undefined) {
      const parsedPrice = parseFloat(price as string);
      if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
        throw new AppError('Property price must be a valid non-negative number', 400);
      }
      data.price = parsedPrice;
    }
    if (bedrooms !== undefined)
      data.bedrooms = Math.max(
        0,
        !isNaN(parseInt(bedrooms as string, 10)) ? parseInt(bedrooms as string, 10) : 0
      );
    if (bathrooms !== undefined)
      data.bathrooms = Math.max(
        0,
        !isNaN(parseInt(bathrooms as string, 10)) ? parseInt(bathrooms as string, 10) : 0
      );
    if (sqft !== undefined)
      data.sqft = Math.max(
        0,
        !isNaN(parseInt(sqft as string, 10)) ? parseInt(sqft as string, 10) : 0
      );
    if (location !== undefined) data.location = sanitizeString(String(location).trim());
    if (area !== undefined) data.area = area ? sanitizeString(String(area)) : null;
    if (amenities !== undefined)
      data.amenities = Array.isArray(amenities)
        ? amenities.map((a: unknown) => (typeof a === 'string' ? sanitizeString(a) : String(a)))
        : [];
    if (images !== undefined)
      data.images = Array.isArray(images)
        ? images.map((i: unknown) => (typeof i === 'string' ? sanitizeString(i) : String(i)))
        : [];
    if (featured !== undefined) data.featured = featured === true || featured === 'true';
    if (agentName !== undefined)
      data.agentName = agentName ? sanitizeString(String(agentName)) : null;

    // @Mary Intelligent Inventory fields
    const VALID_STAGES = [
      'draft_collected',
      'verified_active',
      'under_offer',
      'leased_sold',
      'handed_over',
    ];
    if (unitNumber !== undefined)
      data.unitNumber = unitNumber ? sanitizeString(String(unitNumber).trim()) : null;
    if (floorPlan !== undefined)
      data.floorPlan = floorPlan ? sanitizeString(String(floorPlan).trim()) : null;
    if (rentalPrice !== undefined) {
      const parsedRentalPrice =
        rentalPrice !== null ? parseFloat(rentalPrice as string) || null : null;
      data.rentalPrice = parsedRentalPrice;
    }
    if (commissionPercent !== undefined)
      data.commissionPercent = parseFloat(commissionPercent as string) || 5;
    if (availabilityDate !== undefined)
      data.availabilityDate = availabilityDate ? new Date(availabilityDate as string) : null;
    if (inventoryStage !== undefined && VALID_STAGES.includes(inventoryStage as string)) {
      data.inventoryStage = inventoryStage;
      // Auto-lock when moving to under_offer
      if (inventoryStage === 'under_offer' && !existing.isLocked) {
        data.isLocked = true;
        data.lockedAt = new Date();
      }
      // Auto-unlock when offer falls through and stage moves back
      if (
        ['draft_collected', 'verified_active'].includes(inventoryStage as string) &&
        existing.isLocked &&
        isAdmin
      ) {
        data.isLocked = false;
        data.lockedAt = null;
      }
    }
    if (titleDeedMissing !== undefined)
      data.titleDeedMissing = titleDeedMissing === true || titleDeedMissing === 'true';
    if (landlordPassportMissing !== undefined)
      data.landlordPassportMissing =
        landlordPassportMissing === true || landlordPassportMissing === 'true';
    if (ejariMissing !== undefined)
      data.ejariMissing = ejariMissing === true || ejariMissing === 'true';

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

    res.status(200).json({ success: true, data: property });
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

    await prisma.$transaction(async tx => {
      // Clean up references to avoid orphaned records
      await tx.commission.updateMany({ where: { propertyId: id }, data: { propertyId: null } });
      await tx.lead.updateMany({ where: { propertyId: id }, data: { propertyId: null } });

      await tx.property.delete({ where: { id } });

      await tx.activity.create({
        data: {
          type: 'property',
          action: 'deleted',
          description: `Property deleted: ${existing.title} (by ${req.user?.email})`,
          userId: req.user?.id || null,
        },
      });
    });

    res.status(200).json({ success: true, message: `Property "${existing.title}" deleted` });
  })
);

export default router;
