/**
 * Market Reports & Historical Snapshots Controller
 */

import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { AppError } from '../../middleware/errorHandler.js';
import { prisma } from '../../database.js';
import logger from '../../utils/logger.js';
import { parsePositiveInt, normalizeOptionalText } from './marketCommon.js';

export const createMonthlyReport = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const role = req.user?.role;
  if (!userId) throw new AppError('Authentication required', 401);
  if (!['manager', 'admin', 'owner'].includes(role ?? '')) {
    throw new AppError('Only managers and admins can generate market reports', 403);
  }

  const {
    area,
    propertyType = 'all',
    avgPricePerSqft,
    avgSalePrice,
    avgAnnualRent,
    grossYield,
    transactionVol,
    daysOnMarket,
    absorptionRate,
    newListings,
    activeListings,
    source = 'manual',
    notes,
  } = req.body as {
    area: string;
    propertyType?: string;
    avgPricePerSqft: number;
    avgSalePrice: number;
    avgAnnualRent: number;
    grossYield: number;
    transactionVol?: number;
    daysOnMarket?: number;
    absorptionRate?: number;
    newListings?: number;
    activeListings?: number;
    source?: string;
    notes?: string;
  };

  if (!area || !avgPricePerSqft || !avgSalePrice || !avgAnnualRent || !grossYield) {
    throw new AppError(
      'area, avgPricePerSqft, avgSalePrice, avgAnnualRent, and grossYield are required',
      400
    );
  }

  const snapshot = await prisma.marketSnapshot.create({
    data: {
      area,
      propertyType,
      avgPricePerSqft,
      avgSalePrice,
      avgAnnualRent,
      grossYield,
      transactionVol: transactionVol ?? 0,
      daysOnMarket: daysOnMarket ?? 0,
      absorptionRate: absorptionRate ?? 0,
      newListings: newListings ?? 0,
      activeListings: activeListings ?? 0,
      source,
      notes,
    },
  });

  logger.info(`Monthly market report generated for ${area} by user ${userId}`);
  res.status(201).json({ success: true, data: snapshot });
};

export const getSnapshots = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) throw new AppError('Authentication required', 401);

  const {
    area,
    page = '1',
    pageSize = '20',
  } = req.query as { area?: string; page?: string; pageSize?: string };
  const normalizedArea = normalizeOptionalText(area);

  const p = parsePositiveInt(page, 1, 1000);
  const size = parsePositiveInt(pageSize, 20, 100);
  const skip = (p - 1) * size;

  const where = normalizedArea ? { area: normalizedArea } : {};
  const [records, total] = await Promise.all([
    prisma.marketSnapshot.findMany({
      where,
      orderBy: { snapshotDate: 'desc' },
      skip,
      take: size,
    }),
    prisma.marketSnapshot.count({ where }),
  ]);

  res.json({
    success: true,
    data: records,
    pagination: { page: p, pageSize: size, total, totalPages: Math.ceil(total / size) },
  });
};

