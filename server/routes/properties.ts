/**
 * Properties API Routes — Full CRUD Implementation
 * Endpoints: /api/properties
 * Supports: search, filter by type/status/price/furnishing/handover/permit/fee, pagination, stats
 */

import { Router, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { prisma } from '../database.js';
import { sanitizeString } from '../utils/sanitize';
import { validate, rules, validateIdParam } from '../utils/validate';
import { parsePagination } from '../config/pagination';
import { requirePermission, scopeToOwn, requireMinRole } from '../middleware/rbac';
import { cacheService } from '../services/CacheService.js';

const router = Router();

// Cache TTLs (seconds)
const CACHE_TTL_LIST   = 60;   // property list: 1 minute
const CACHE_TTL_DETAIL = 300;  // property detail: 5 minutes

// ─── Task 4: Listing Completeness ────────────────────────────────────────────

/** Shape of a property as returned by findUnique for completeness analysis */
interface CompletenessProperty {
  id: string;
  title: string;
  description: string | null;
  price: number;
  type: string;
  status: string;
  location: string;
  area: string | null;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  images: string[];
  amenities: string[];
  buildingPermitNumber: string | null;
  municipalityNumber: string | null;
  userId: string;
}

interface CompletenessCriterion {
  key: string;
  label: string;
  check: (p: CompletenessProperty) => boolean;
  hint: string;
}

const COMPLETENESS_CRITERIA: CompletenessCriterion[] = [
  { key: 'title',               label: 'Title',               check: p => Boolean(p.title?.trim()),              hint: 'Add a descriptive property title'            },
  { key: 'description',         label: 'Description',         check: p => (p.description?.length ?? 0) > 50,     hint: 'Write a description of at least 50 characters' },
  { key: 'price',               label: 'Price',               check: p => p.price > 0,                            hint: 'Set a non-zero listing price'                },
  { key: 'type',                label: 'Property Type',       check: p => Boolean(p.type?.trim()),               hint: 'Specify the property type'                   },
  { key: 'status',              label: 'Status',              check: p => Boolean(p.status?.trim()),             hint: 'Set the availability status'                 },
  { key: 'location',            label: 'Location',            check: p => Boolean(p.location?.trim()),           hint: 'Add a street/building location'              },
  { key: 'area',                label: 'Area / Community',    check: p => Boolean(p.area?.trim()),               hint: 'Specify the Dubai community or area'         },
  { key: 'bedrooms',            label: 'Bedrooms',            check: p => p.bedrooms > 0,                         hint: 'Add bedroom count'                          },
  { key: 'bathrooms',           label: 'Bathrooms',           check: p => p.bathrooms > 0,                        hint: 'Add bathroom count'                         },
  { key: 'sqft',                label: 'Square Footage',      check: p => p.sqft > 0,                             hint: 'Add the property area in sq ft'             },
  { key: 'images',              label: 'Photos (≥ 3)',        check: p => p.images.length > 2,                    hint: 'Upload at least 3 property photos'          },
  { key: 'amenities',           label: 'Amenities',           check: p => p.amenities.length > 0,                 hint: 'List at least one amenity'                  },
  { key: 'buildingPermitNumber',label: 'Building Permit',     check: p => Boolean(p.buildingPermitNumber?.trim()),hint: 'Add the DM building permit number'           },
  { key: 'municipalityNumber',  label: 'Municipality Number', check: p => Boolean(p.municipalityNumber?.trim()), hint: 'Add the Dubai municipality plot/unit number' },
  { key: 'contactInfo',         label: 'Agent Assigned',      check: p => Boolean(p.userId),                     hint: 'Assign a responsible agent'                 },
];

function computeCompletenessScore(property: CompletenessProperty): {
  score: number;
  passed: string[];
  failed: { key: string; label: string; hint: string }[];
} {
  const passed: string[] = [];
  const failed: { key: string; label: string; hint: string }[] = [];

  for (const criterion of COMPLETENESS_CRITERIA) {
    if (criterion.check(property)) {
      passed.push(criterion.key);
    } else {
      failed.push({ key: criterion.key, label: criterion.label, hint: criterion.hint });
    }
  }

  const score = Math.round((passed.length / COMPLETENESS_CRITERIA.length) * 100);
  return { score, passed, failed };
}

// ─── GET /api/properties ────────────────────────────────────────────────
router.get(
  '/',
  requirePermission('view_properties'),
  scopeToOwn('userId'),
  asyncHandler(async (req: Request, res: Response) => {
    // Build a stable cache key from sorted query params + user id (for scoping)
    const userId = req.user?.id ?? 'anon';
    const queryKey = Object.keys(req.query)
      .sort()
      .map(k => `${k}=${req.query[k]}`)
      .join('&');
    const cacheKey = `properties:list:${userId}:${queryKey}`;

    const cached = await cacheService.get(cacheKey);
    if (cached !== null) {
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).json(cached);
    }

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
      // Task 1 — Advanced Search Facets: new filter params
      furnishing,
      handoverStage,
      permitStatus,
      feeBand,
    } = req.query as Record<string, string | undefined>;

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

    // ── Task 1: Advanced facet filters ──────────────────────────────────
    // furnishing: "furnished" | "unfurnished" | "all" (default)
    if (furnishing && furnishing !== 'all') {
      if (furnishing === 'furnished')   where.furnished = true;
      if (furnishing === 'unfurnished') where.furnished = false;
      // "semi-furnished" has no schema field — gracefully ignored (no filter applied)
    }

    // handoverStage → maps to Property.inventoryStage
    if (handoverStage && handoverStage !== 'all') {
      const stageMap: Record<string, string> = {
        'ready':              'handed_over',
        'off-plan':           'draft_collected',
        'under-construction': 'verified_active',
      };
      const mapped = stageMap[handoverStage];
      if (mapped) where.inventoryStage = mapped;
    }

    // permitStatus → derived from presence of buildingPermitNumber
    if (permitStatus && permitStatus !== 'all') {
      if (permitStatus === 'active')  where.buildingPermitNumber = { not: null } as Prisma.StringNullableFilter;
      if (permitStatus === 'pending') where.buildingPermitNumber = null;
      // "expired" has no schema field — gracefully ignored
    }

    // feeBand → maps to commissionPercent range
    if (feeBand && feeBand !== 'all') {
      if (feeBand === 'no-fee')       where.commissionPercent = { lte: 0 } as Prisma.FloatNullableFilter;
      if (feeBand === 'low-fee')      where.commissionPercent = { gt: 0, lte: 2 } as Prisma.FloatNullableFilter;
      if (feeBand === 'standard-fee') where.commissionPercent = { gt: 2 } as Prisma.FloatNullableFilter;
    }
    // ── End Task 1 filters ───────────────────────────────────────────────

    // Row-level security: agents only see properties they created (where property.userId = their id).
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

    const payload = {
      success: true,
      data: properties,
      pagination: { page: pageNum, pageSize: limit, total, totalPages: Math.ceil(total / limit) },
    };

    // Cache scoped list results (per-user ownership filter included in key)
    await cacheService.set(cacheKey, payload, CACHE_TTL_LIST);

    res.setHeader('X-Cache', 'MISS');
    res.status(200).json(payload);
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

// ─── GET /api/properties/facets ─────────────────────────────────────────
// Task 1: Returns aggregated facet counts for the advanced search UI.
// MUST be registered before /:id to avoid route shadowing.
router.get(
  '/facets',
  requirePermission('view_properties'),
  asyncHandler(async (_req: Request, res: Response) => {
    const [
      furnishingGroups,
      handoverGroups,
      permitActive,
      permitPending,
      noFeeCount,
      lowFeeCount,
      standardFeeCount,
    ] = await Promise.all([
      // furnishing facets
      prisma.property.groupBy({ by: ['furnished'], _count: { _all: true } }),

      // handoverStage facets (via inventoryStage)
      prisma.property.groupBy({ by: ['inventoryStage'], _count: { _all: true } }),

      // permitStatus facets (derived from buildingPermitNumber presence)
      prisma.property.count({ where: { buildingPermitNumber: { not: null } as Prisma.StringNullableFilter } }),
      prisma.property.count({ where: { buildingPermitNumber: null } }),

      // feeBand facets (commissionPercent ranges)
      prisma.property.count({ where: { commissionPercent: { lte: 0 } as Prisma.FloatNullableFilter } }),
      prisma.property.count({ where: { commissionPercent: { gt: 0, lte: 2 } as Prisma.FloatNullableFilter } }),
      prisma.property.count({ where: { commissionPercent: { gt: 2 } as Prisma.FloatNullableFilter } }),
    ]);

    // Build furnishing counts
    const furnishing: Record<string, number> = { furnished: 0, unfurnished: 0 };
    furnishingGroups.forEach(g => {
      if (g.furnished)       furnishing['furnished']   = g._count._all;
      else                   furnishing['unfurnished']  = g._count._all;
    });

    // Build handoverStage counts — map inventoryStage back to task param names
    const stageReverseMap: Record<string, string> = {
      handed_over:     'ready',
      draft_collected: 'off-plan',
      verified_active: 'under-construction',
    };
    const handoverStage: Record<string, number> = { ready: 0, 'off-plan': 0, 'under-construction': 0 };
    handoverGroups.forEach(g => {
      const label = stageReverseMap[g.inventoryStage ?? 'draft_collected'];
      if (label) handoverStage[label] = (handoverStage[label] ?? 0) + g._count._all;
    });

    res.status(200).json({
      success: true,
      data: {
        furnishing,
        handoverStage,
        permitStatus: { active: permitActive, pending: permitPending },
        feeBand: { 'no-fee': noFeeCount, 'low-fee': lowFeeCount, 'standard-fee': standardFeeCount },
      },
    });
  })
);

// ─── GET /api/properties/completeness-summary ───────────────────────────
// Task 4: Returns portfolio-level completeness statistics and band breakdown.
// MUST be registered before /:id to avoid route shadowing.
router.get(
  '/completeness-summary',
  requirePermission('view_properties'),
  requireMinRole('manager'),
  asyncHandler(async (_req: Request, res: Response) => {
    const properties = await prisma.property.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        type: true,
        status: true,
        location: true,
        area: true,
        bedrooms: true,
        bathrooms: true,
        sqft: true,
        images: true,
        amenities: true,
        buildingPermitNumber: true,
        municipalityNumber: true,
        userId: true,
      },
    });

    const scores = properties.map(p => ({
      id: p.id,
      title: p.title,
      score: computeCompletenessScore(p as CompletenessProperty).score,
    }));

    const total = scores.length;
    const averageScore = total > 0
      ? Math.round(scores.reduce((sum, s) => sum + s.score, 0) / total)
      : 0;

    // Band breakdown — approximate quartile labels
    const bands: Record<string, number> = {
      '0-25 (poor)':       0,
      '26-50 (fair)':      0,
      '51-75 (good)':      0,
      '76-100 (excellent)': 0,
    };
    scores.forEach(({ score }) => {
      if (score <= 25)      bands['0-25 (poor)']++;
      else if (score <= 50) bands['26-50 (fair)']++;
      else if (score <= 75) bands['51-75 (good)']++;
      else                  bands['76-100 (excellent)']++;
    });

    // Surface the worst 10 listings for quick remediation
    const worst10 = scores
      .sort((a, b) => a.score - b.score)
      .slice(0, 10);

    res.status(200).json({
      success: true,
      data: { total, averageScore, bands, worst10 },
    });
  })
);

// ─── GET /api/properties/:id ────────────────────────────────────────────
router.get(
  '/:id',
  requirePermission('view_properties'),
  asyncHandler(async (req: Request, res: Response) => {
    // @ts-expect-error -- pre-existing: req.params/query string|string[] narrowing
    validateIdParam(req.params.id, 'Property ID');

    const cacheKey = `properties:detail:${req.params.id}`;
    const cached = await cacheService.get(cacheKey);
    if (cached !== null) {
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).json(cached);
    }

    const property = await prisma.property.findUnique({
    // @ts-expect-error -- pre-existing: req.params/query string|string[] narrowing
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

    const payload = { success: true, data: property };
    await cacheService.set(cacheKey, payload, CACHE_TTL_DETAIL);

    res.setHeader('X-Cache', 'MISS');
    res.status(200).json(payload);
  })
);

// ─── GET /api/properties/:id/completeness ───────────────────────────────
// Task 4: Returns the completeness score and gap analysis for a single listing.
router.get(
  '/:id/completeness',
  requirePermission('view_properties'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as Record<string, string>;
    validateIdParam(id, 'Property ID');

    const property = await prisma.property.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        type: true,
        status: true,
        location: true,
        area: true,
        bedrooms: true,
        bathrooms: true,
        sqft: true,
        images: true,
        amenities: true,
        buildingPermitNumber: true,
        municipalityNumber: true,
        userId: true,
      },
    });

    if (!property) throw new AppError('Property not found', 404);

    const { score, passed, failed } = computeCompletenessScore(property as CompletenessProperty);

    res.status(200).json({
      success: true,
      data: {
        propertyId: id,
        title: property.title,
        score,
        passed,
        failed,
        totalCriteria: COMPLETENESS_CRITERIA.length,
      },
    });
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
      currency,
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
      municipalityNumber,
      plotNumber,
      buildingPermitNumber,
      rentIndexRef,
      furnished,
    } = req.body as Record<string, unknown>;

    if (!title || typeof title !== 'string') throw new AppError('Property title is required', 400);
    if (!location || typeof location !== 'string') throw new AppError('Property location is required', 400);
    if (price === undefined || price === null) throw new AppError('Property price is required', 400);

    const parsedPrice = typeof price === 'number' ? price : parseFloat(String(price));
    if (isNaN(parsedPrice) || parsedPrice < 0) throw new AppError('Invalid price value', 400);

    const property = await prisma.property.create({
      data: {
        title: sanitizeString(String(title)),
        description: description ? sanitizeString(String(description)) : null,
        type: type ? String(type) : 'apartment',
        status: status ? String(status) : 'available',
        price: parsedPrice,
        currency: currency ? String(currency) : 'AED',
        bedrooms: bedrooms ? parseInt(String(bedrooms), 10) : 0,
        bathrooms: bathrooms ? parseInt(String(bathrooms), 10) : 0,
        sqft: sqft ? parseInt(String(sqft), 10) : 0,
        location: sanitizeString(String(location)),
        area: area ? sanitizeString(String(area)) : null,
        amenities: Array.isArray(amenities) ? (amenities as string[]) : [],
        images: Array.isArray(images) ? (images as string[]) : [],
        featured: featured === true || featured === 'true',
        agentName: agentName ? String(agentName) : null,
        unitNumber: unitNumber ? String(unitNumber) : null,
        floorPlan: floorPlan ? String(floorPlan) : null,
        rentalPrice: rentalPrice ? parseFloat(String(rentalPrice)) : null,
        commissionPercent: commissionPercent !== undefined && commissionPercent !== null
          ? parseFloat(String(commissionPercent))
          : undefined,
        availabilityDate: availabilityDate ? new Date(String(availabilityDate)) : null,
        inventoryStage: inventoryStage ? String(inventoryStage) : 'draft_collected',
        municipalityNumber: municipalityNumber ? String(municipalityNumber) : null,
        plotNumber: plotNumber ? String(plotNumber) : null,
        buildingPermitNumber: buildingPermitNumber ? String(buildingPermitNumber) : null,
        rentIndexRef: rentIndexRef ? String(rentIndexRef) : null,
        furnished: furnished === true || furnished === 'true',
        userId: req.user!.id,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    // Invalidate list cache on creation
    await cacheService.invalidate('properties:list:*');

    res.status(201).json({ success: true, data: property });
  })
);

// ─── PUT /api/properties/:id ─────────────────────────────────────────────
router.put(
  '/:id',
  requirePermission('edit_property'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as Record<string, string>;
    validateIdParam(id, 'Property ID');

    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) throw new AppError('Property not found', 404);

    // AUTHORIZATION: Only admins or property owner can edit
    const isAdmin = ['owner', 'manager'].includes(req.user?.role || '');
    const isPropertyOwner = existing.userId === req.user?.id;
    if (!isAdmin && !isPropertyOwner) {
      throw new AppError('You do not have permission to edit this property', 403);
    }

    const updateData: Prisma.PropertyUpdateInput = {};
    const body = req.body as Record<string, unknown>;

    if (body.title !== undefined)       updateData.title       = sanitizeString(String(body.title));
    if (body.description !== undefined) updateData.description = body.description ? sanitizeString(String(body.description)) : null;
    if (body.type !== undefined)        updateData.type        = String(body.type);
    if (body.status !== undefined)      updateData.status      = String(body.status);
    if (body.price !== undefined)       updateData.price       = parseFloat(String(body.price));
    if (body.currency !== undefined)    updateData.currency    = String(body.currency);
    if (body.bedrooms !== undefined)    updateData.bedrooms    = parseInt(String(body.bedrooms), 10);
    if (body.bathrooms !== undefined)   updateData.bathrooms   = parseInt(String(body.bathrooms), 10);
    if (body.sqft !== undefined)        updateData.sqft        = parseInt(String(body.sqft), 10);
    if (body.location !== undefined)    updateData.location    = sanitizeString(String(body.location));
    if (body.area !== undefined)        updateData.area        = body.area ? sanitizeString(String(body.area)) : null;
    if (body.amenities !== undefined)   updateData.amenities   = Array.isArray(body.amenities) ? (body.amenities as string[]) : [];
    if (body.images !== undefined)      updateData.images      = Array.isArray(body.images) ? (body.images as string[]) : [];
    if (body.featured !== undefined)    updateData.featured    = body.featured === true || body.featured === 'true';
    if (body.agentName !== undefined)   updateData.agentName   = body.agentName ? String(body.agentName) : null;

    // Inventory / compliance fields
    if (body.unitNumber !== undefined)         updateData.unitNumber         = body.unitNumber ? String(body.unitNumber) : null;
    if (body.floorPlan !== undefined)          updateData.floorPlan          = body.floorPlan ? String(body.floorPlan) : null;
    if (body.rentalPrice !== undefined)        updateData.rentalPrice        = body.rentalPrice ? parseFloat(String(body.rentalPrice)) : null;
    if (body.commissionPercent !== undefined)  updateData.commissionPercent  = body.commissionPercent !== null ? parseFloat(String(body.commissionPercent)) : null;
    if (body.availabilityDate !== undefined)   updateData.availabilityDate   = body.availabilityDate ? new Date(String(body.availabilityDate)) : null;
    if (body.inventoryStage !== undefined)     updateData.inventoryStage     = String(body.inventoryStage);
    if (body.municipalityNumber !== undefined) updateData.municipalityNumber = body.municipalityNumber ? String(body.municipalityNumber) : null;
    if (body.plotNumber !== undefined)         updateData.plotNumber         = body.plotNumber ? String(body.plotNumber) : null;
    if (body.buildingPermitNumber !== undefined) updateData.buildingPermitNumber = body.buildingPermitNumber ? String(body.buildingPermitNumber) : null;
    if (body.rentIndexRef !== undefined)       updateData.rentIndexRef       = body.rentIndexRef ? String(body.rentIndexRef) : null;
    if (body.furnished !== undefined)          updateData.furnished          = body.furnished === true || body.furnished === 'true';

    // Document flags
    if (body.titleDeedMissing !== undefined)        updateData.titleDeedMissing        = Boolean(body.titleDeedMissing);
    if (body.landlordPassportMissing !== undefined) updateData.landlordPassportMissing = Boolean(body.landlordPassportMissing);
    if (body.ejariMissing !== undefined)            updateData.ejariMissing            = Boolean(body.ejariMissing);

    const property = await prisma.property.update({
      where: { id },
      data: updateData,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    // Invalidate caches
    await Promise.all([
      cacheService.invalidate('properties:list:*'),
      cacheService.invalidate(`properties:detail:${id}`),
    ]);

    res.status(200).json({ success: true, data: property });
  })
);

// ─── PATCH /api/properties/:id ───────────────────────────────────────────
router.patch(
  '/:id',
  requirePermission('edit_property'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as Record<string, string>;
    validateIdParam(id, 'Property ID');

    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) throw new AppError('Property not found', 404);

    const isAdmin = ['owner', 'manager'].includes(req.user?.role || '');
    const isPropertyOwner = existing.userId === req.user?.id;
    if (!isAdmin && !isPropertyOwner) {
      throw new AppError('You do not have permission to update this property', 403);
    }

    const body = req.body as Record<string, unknown>;
    const updateData: Prisma.PropertyUpdateInput = {};

    const stringFields = ['title', 'description', 'type', 'status', 'currency', 'location', 'area',
      'agentName', 'unitNumber', 'floorPlan', 'inventoryStage', 'municipalityNumber',
      'plotNumber', 'buildingPermitNumber', 'rentIndexRef'] as const;

    stringFields.forEach(field => {
      if (body[field] !== undefined) {
        (updateData as Record<string, unknown>)[field] = body[field] !== null
          ? sanitizeString(String(body[field]))
          : null;
      }
    });

    if (body.price !== undefined)          updateData.price          = parseFloat(String(body.price));
    if (body.bedrooms !== undefined)       updateData.bedrooms       = parseInt(String(body.bedrooms), 10);
    if (body.bathrooms !== undefined)      updateData.bathrooms      = parseInt(String(body.bathrooms), 10);
    if (body.sqft !== undefined)           updateData.sqft           = parseInt(String(body.sqft), 10);
    if (body.rentalPrice !== undefined)    updateData.rentalPrice    = body.rentalPrice !== null ? parseFloat(String(body.rentalPrice)) : null;
    if (body.commissionPercent !== undefined) updateData.commissionPercent = body.commissionPercent !== null ? parseFloat(String(body.commissionPercent)) : null;
    if (body.availabilityDate !== undefined) updateData.availabilityDate = body.availabilityDate ? new Date(String(body.availabilityDate)) : null;
    if (body.featured !== undefined)       updateData.featured       = body.featured === true || body.featured === 'true';
    if (body.furnished !== undefined)      updateData.furnished      = body.furnished === true || body.furnished === 'true';
    if (body.amenities !== undefined)      updateData.amenities      = Array.isArray(body.amenities) ? (body.amenities as string[]) : [];
    if (body.images !== undefined)         updateData.images         = Array.isArray(body.images) ? (body.images as string[]) : [];
    if (body.titleDeedMissing !== undefined)        updateData.titleDeedMissing        = Boolean(body.titleDeedMissing);
    if (body.landlordPassportMissing !== undefined) updateData.landlordPassportMissing = Boolean(body.landlordPassportMissing);
    if (body.ejariMissing !== undefined)            updateData.ejariMissing            = Boolean(body.ejariMissing);

    const property = await prisma.property.update({
      where: { id },
      data: updateData,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    await Promise.all([
      cacheService.invalidate('properties:list:*'),
      cacheService.invalidate(`properties:detail:${id}`),
    ]);

    res.status(200).json({ success: true, data: property });
  })
);

// ─── DELETE /api/properties/:id ─────────────────────────────────────────
router.delete(
  '/:id',
  requirePermission('delete_property'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as Record<string, string>;
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

    // Invalidate cached list + this specific property detail
    await Promise.all([
      cacheService.invalidate('properties:list:*'),
      cacheService.invalidate(`properties:detail:${id}`),
    ]);

    res.status(200).json({ success: true, message: `Property "${existing.title}" deleted` });
  })
);

export default router;
