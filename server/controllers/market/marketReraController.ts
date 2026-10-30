/**
 * Market RERA & Competitor Pricing Controller
 */

import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { AppError } from '../../middleware/errorHandler.js';
import { normalizeOptionalText } from './marketCommon.js';
import { VALID_COMPETITOR_PORTALS } from './marketData.js';
import {
  getAreaBenchmarks,
  getCompetitorPricingData,
  getReraRentalIndexData,
} from './marketFeedService.js';

export const getReraIndex = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) throw new AppError('Authentication required', 401);

  const { area, propertyType, bedrooms } = req.query as {
    area?: string;
    propertyType?: string;
    bedrooms?: string;
  };
  const normalizedArea = normalizeOptionalText(area);
  const normalizedPropertyType = normalizeOptionalText(propertyType);
  const normalizedBedrooms = normalizeOptionalText(bedrooms);

  const baseData = await getReraRentalIndexData();
  let data = baseData.rows;
  if (normalizedArea) {
    data = data.filter(r => r.area.toLowerCase().includes(normalizedArea.toLowerCase()));
  }
  if (normalizedPropertyType) {
    const propertyTypeFilter = normalizedPropertyType.toLowerCase();
    data = data.filter(r => r.propertyType.toLowerCase() === propertyTypeFilter);
  }
  if (normalizedBedrooms) {
    const bedroomsFilter = normalizedBedrooms.toLowerCase();
    data = data.filter(r => r.bedrooms.toLowerCase() === bedroomsFilter);
  }

  res.json({
    success: true,
    data,
    total: data.length,
    source: baseData.source,
    note: baseData.note,
  });
};

export const getCompetitorPricing = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) throw new AppError('Authentication required', 401);

  const { area, portal } = req.query as { area?: string; portal?: string };
  const normalizedArea = normalizeOptionalText(area);

  const benchmarks = await getAreaBenchmarks();
  let data = await getCompetitorPricingData(benchmarks);

  if (normalizedArea) {
    data = data.filter(row => row.area.toLowerCase().includes(normalizedArea.toLowerCase()));
  }

  const normalizedPortal = normalizeOptionalText(portal)?.toLowerCase();
  if (normalizedPortal) {
    if (
      !VALID_COMPETITOR_PORTALS.includes(
        normalizedPortal as (typeof VALID_COMPETITOR_PORTALS)[number]
      )
    ) {
      throw new AppError(
        `Invalid portal. Allowed values: ${VALID_COMPETITOR_PORTALS.join(', ')}`,
        400
      );
    }
    data = data.filter(row => row.portal === normalizedPortal);
  }

  res.json({
    success: true,
    data,
    total: data.length,
    portals: ['bayut', 'propertyfinder'],
    note: 'Competitor pricing is advisory and should be validated against portal snapshots.',
  });
};

