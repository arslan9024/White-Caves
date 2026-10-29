/**
 * propertyStatsController.ts
 * Handlers for property metrics, inventory stages, and portfolio completeness summary.
 */

import { Request, Response } from 'express';
import { prisma } from '../../database.js';
import { cacheService } from '../../services/CacheService.js';
import {
  CompletenessProperty,
  computeCompletenessScore,
} from './propertyCommon.js';

export async function getPropertyStats(_req: Request, res: Response): Promise<void> {
  const fetchFn = async () => {
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

    return {
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
    };
  };

  const data = typeof cacheService?.getOrSet === 'function'
    ? await cacheService.getOrSet('wc:properties:stats', fetchFn, 300)
    : await fetchFn();

  res.status(200).json({
    success: true,
    data,
  });
}

export async function getInventoryStats(_req: Request, res: Response): Promise<void> {
  const fetchFn = async () => {
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

    return {
      total,
      stages,
      docAlerts: { titleDeedMissing, landlordPassportMissing, ejariMissing },
    };
  };

  const data = typeof cacheService?.getOrSet === 'function'
    ? await cacheService.getOrSet('wc:properties:inventory-stats', fetchFn, 300)
    : await fetchFn();

  res.status(200).json({
    success: true,
    ...data,
  });
}

export async function getCompletenessSummary(_req: Request, res: Response): Promise<void> {
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
  const averageScore =
    total > 0 ? Math.round(scores.reduce((sum, s) => sum + s.score, 0) / total) : 0;

  const bands: Record<string, number> = {
    '0-25 (poor)': 0,
    '26-50 (fair)': 0,
    '51-75 (good)': 0,
    '76-100 (excellent)': 0,
  };
  scores.forEach(({ score }) => {
    if (score <= 25) bands['0-25 (poor)']++;
    else if (score <= 50) bands['26-50 (fair)']++;
    else if (score <= 75) bands['51-75 (good)']++;
    else bands['76-100 (excellent)']++;
  });

  const worst10 = scores.sort((a, b) => a.score - b.score).slice(0, 10);

  res.status(200).json({
    success: true,
    data: { total, averageScore, bands, worst10 },
  });
}
