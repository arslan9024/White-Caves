/**
 * propertyQueryController.ts
 * Query handlers for property listing, search facets, and intent-aware ranking.
 */

import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../../database.js';
import { parsePagination } from '../../config/pagination.js';
import { cacheService } from '../../services/CacheService.js';
import logger from '../../utils/logger.js';
import { CACHE_TTL_LIST } from './propertyCommon.js';

export async function listProperties(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id ?? 'anon';
  const queryKey = Object.keys(req.query)
    .sort()
    .map(k => `${k}=${req.query[k]}`)
    .join('&');
  const cacheKey = `properties:list:${userId}:${queryKey}`;

  const cached = await cacheService.get(cacheKey);
  if (cached !== null) {
    res.setHeader('X-Cache', 'HIT');
    res.status(200).json(cached);
    return;
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
    furnishing,
    handoverStage,
    permitStatus,
    feeBand,
    intent,
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

  // Advanced facet filters
  if (furnishing && furnishing !== 'all') {
    if (furnishing === 'furnished') where.furnished = true;
    if (furnishing === 'unfurnished') where.furnished = false;
  }

  if (handoverStage && handoverStage !== 'all') {
    const stageMap: Record<string, string> = {
      ready: 'handed_over',
      'off-plan': 'draft_collected',
      'under-construction': 'verified_active',
    };
    const mapped = stageMap[handoverStage];
    if (mapped) where.inventoryStage = mapped;
  }

  if (permitStatus && permitStatus !== 'all') {
    if (permitStatus === 'active')
      where.buildingPermitNumber = { not: null } as Prisma.StringNullableFilter;
    if (permitStatus === 'pending') where.buildingPermitNumber = null;
  }

  if (feeBand && feeBand !== 'all') {
    if (feeBand === 'no-fee') where.commissionPercent = { lte: 0 } as Prisma.FloatNullableFilter;
    if (feeBand === 'low-fee')
      where.commissionPercent = { gt: 0, lte: 2 } as Prisma.FloatNullableFilter;
    if (feeBand === 'standard-fee')
      where.commissionPercent = { gt: 2 } as Prisma.FloatNullableFilter;
  }

  // Row-level security scoping
  const ownerFilter = (req as any).ownershipFilter ?? {};
  if (Object.keys(ownerFilter).length > 0) {
    Object.assign(where, ownerFilter);
  }

  const validSortFields = ['createdAt', 'updatedAt', 'price', 'title', 'sqft', 'bedrooms'];
  const field = validSortFields.includes(sortBy as string) ? (sortBy as string) : 'createdAt';
  const orderBy: Prisma.PropertyOrderByWithRelationInput = {
    [field]: sortOrder === 'asc' ? 'asc' : 'desc',
  };

  let properties: any[] = [];
  let total = 0;
  try {
    [properties, total] = await Promise.all([
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
  } catch (queryErr: any) {
    if (queryErr?.message?.includes('Field user is required')) {
      logger.warn(
        '[Properties] Inconsistent user relation in database — falling back to non-joined query'
      );
      [properties, total] = await Promise.all([
        prisma.property.findMany({
          where,
          orderBy,
          skip,
          take: limit,
          include: {
            _count: { select: { leads: true, commissions: true } },
          },
        }),
        prisma.property.count({ where }),
      ]);
    } else {
      throw queryErr;
    }
  }

  const payload = {
    success: true,
    data: (() => {
      const VALID_INTENTS = new Set(['buy', 'rent', 'invest']);
      return properties.map(p => {
        let intentScore = 0;
        if (intent !== undefined && VALID_INTENTS.has(intent)) {
          if (intent === 'buy') {
            if (p.status === 'available') {
              intentScore = 2;
            } else if (['villa', 'penthouse', 'apartment'].includes(p.type.toLowerCase())) {
              intentScore = 1;
            }
          } else if (intent === 'rent') {
            intentScore = p.rentalPrice != null && p.rentalPrice > 0 ? 2 : 0;
          } else if (intent === 'invest') {
            if (p.featured) {
              intentScore = 2;
            } else if ((p.commissionPercent ?? 0) > 0) {
              intentScore = 1;
            }
          }
        }
        return { ...p, intentScore };
      });
    })(),
    pagination: { page: pageNum, pageSize: limit, total, totalPages: Math.ceil(total / limit) },
  };

  await cacheService.set(cacheKey, payload, CACHE_TTL_LIST);

  res.setHeader('X-Cache', 'MISS');
  res.status(200).json(payload);
}

export async function getFacets(_req: Request, res: Response): Promise<void> {
  const fetchFn = async () => {
    const [
      furnishingGroups,
      handoverGroups,
      permitActive,
      permitPending,
      noFeeCount,
      lowFeeCount,
      standardFeeCount,
    ] = await Promise.all([
      prisma.property.groupBy({ by: ['furnished'], _count: { _all: true } }),
      prisma.property.groupBy({ by: ['inventoryStage'], _count: { _all: true } }),
      prisma.property.count({
        where: { buildingPermitNumber: { not: null } as Prisma.StringNullableFilter },
      }),
      prisma.property.count({ where: { buildingPermitNumber: null } }),
      prisma.property.count({
        where: { commissionPercent: { lte: 0 } as Prisma.FloatNullableFilter },
      }),
      prisma.property.count({
        where: { commissionPercent: { gt: 0, lte: 2 } as Prisma.FloatNullableFilter },
      }),
      prisma.property.count({
        where: { commissionPercent: { gt: 2 } as Prisma.FloatNullableFilter },
      }),
    ]);

    const furnishing: Record<string, number> = { furnished: 0, unfurnished: 0 };
    furnishingGroups.forEach(g => {
      if (g.furnished) furnishing['furnished'] = g._count._all;
      else furnishing['unfurnished'] = g._count._all;
    });

    const stageReverseMap: Record<string, string> = {
      handed_over: 'ready',
      draft_collected: 'off-plan',
      verified_active: 'under-construction',
    };
    const handoverStage: Record<string, number> = {
      ready: 0,
      'off-plan': 0,
      'under-construction': 0,
    };
    handoverGroups.forEach(g => {
      const label = stageReverseMap[g.inventoryStage ?? 'draft_collected'];
      if (label) handoverStage[label] = (handoverStage[label] ?? 0) + g._count._all;
    });

    return {
      furnishing,
      handoverStage,
      permitStatus: { active: permitActive, pending: permitPending },
      feeBand: {
        'no-fee': noFeeCount,
        'low-fee': lowFeeCount,
        'standard-fee': standardFeeCount,
      },
    };
  };

  const data = typeof cacheService?.getOrSet === 'function'
    ? await cacheService.getOrSet('wc:properties:facets', fetchFn, 300)
    : await fetchFn();

  res.status(200).json({
    success: true,
    data,
  });
}
