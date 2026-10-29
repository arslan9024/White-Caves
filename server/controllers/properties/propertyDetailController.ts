/**
 * propertyDetailController.ts
 * Handlers for retrieving individual property records and per-listing completeness scores.
 */

import { Request, Response } from 'express';
import { prisma } from '../../database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { validateIdParam } from '../../utils/validate.js';
import { cacheService } from '../../services/CacheService.js';
import {
  CACHE_TTL_DETAIL,
  COMPLETENESS_CRITERIA,
  CompletenessProperty,
  computeCompletenessScore,
} from './propertyCommon.js';

export async function getPropertyById(req: Request, res: Response): Promise<void> {
  const { id } = req.params as Record<string, string>;
  validateIdParam(id, 'Property ID');

  const cacheKey = `properties:detail:${id}`;
  const cached = await cacheService.get(cacheKey);
  if (cached !== null) {
    res.setHeader('X-Cache', 'HIT');
    res.status(200).json(cached);
    return;
  }

  const property = await prisma.property.findUnique({
    where: { id },
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
}

export async function getPropertyCompleteness(req: Request, res: Response): Promise<void> {
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
}
