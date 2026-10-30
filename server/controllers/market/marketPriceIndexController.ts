/**
 * Market Price Index, Transactions, and Indicators Controller
 */

import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { AppError } from '../../middleware/errorHandler.js';
import { prisma } from '../../database.js';
import { parsePositiveInt, normalizeOptionalText } from './marketCommon.js';
import { getAreaBenchmarks } from './marketFeedService.js';

export const getPriceIndex = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) throw new AppError('Authentication required', 401);

  const { zone, propertyType } = req.query as { zone?: string; propertyType?: string };
  const normalizedPropertyType = normalizeOptionalText(propertyType);

  const benchmarks = await getAreaBenchmarks();
  const validZones = new Set(benchmarks.map(b => b.zone.toLowerCase()));

  const normalizedZone = zone?.trim().toLowerCase();
  if (normalizedZone && !validZones.has(normalizedZone)) {
    throw new AppError(`Invalid zone. Allowed values: ${Array.from(validZones).join(', ')}`, 400);
  }

  // Fetch latest DB snapshots for each area to enrich hardcoded benchmarks
  const latestSnapshots = await prisma.marketSnapshot.findMany({
    where: normalizedPropertyType ? { propertyType: normalizedPropertyType } : undefined,
    orderBy: { snapshotDate: 'desc' },
    distinct: ['area'],
  });
  const snapshotMap = new Map(latestSnapshots.map(s => [s.area.toLowerCase(), s]));

  let result = benchmarks;
  if (normalizedZone) {
    result = result.filter(b => b.zone.toLowerCase() === normalizedZone);
  }

  const enriched = result.map(b => {
    const snap = snapshotMap.get(b.area.toLowerCase());
    const grossYield =
      b.avgAnnualRent > 0
        ? parseFloat(((b.avgAnnualRent / (b.avgPricePerSqft * 1000)) * 100).toFixed(2))
        : 0;
    return {
      area: b.area,
      zone: b.zone,
      avgPricePerSqft: snap?.avgPricePerSqft ?? b.avgPricePerSqft,
      avgAnnualRent: snap?.avgAnnualRent ?? b.avgAnnualRent,
      grossYield: snap?.grossYield ?? grossYield,
      transactionVol: snap?.transactionVol ?? 0,
      daysOnMarket: snap?.daysOnMarket ?? 0,
      source: snap ? snap.source : 'benchmark',
      dataDate: snap?.snapshotDate ?? null,
    };
  });

  res.json({ success: true, data: enriched, total: enriched.length });
};

export const getMarketTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) throw new AppError('Authentication required', 401);

  const { area, months = '12' } = req.query as { area?: string; months?: string };
  const normalizedArea = normalizeOptionalText(area);
  const lookback = parsePositiveInt(months, 12, 36);
  const since = new Date();
  since.setMonth(since.getMonth() - lookback);

  const where = {
    snapshotDate: { gte: since },
    ...(normalizedArea ? { area: normalizedArea } : {}),
  };

  const snapshots = await prisma.marketSnapshot.findMany({
    where,
    orderBy: { snapshotDate: 'asc' },
    select: {
      area: true,
      snapshotDate: true,
      transactionVol: true,
      avgSalePrice: true,
      avgPricePerSqft: true,
      propertyType: true,
    },
  });

  // Group by month
  const grouped: Record<
    string,
    { month: string; totalVolume: number; avgSalePrice: number; records: number }
  > = {};
  for (const s of snapshots) {
    const key = s.snapshotDate.toISOString().slice(0, 7); // YYYY-MM
    if (!grouped[key]) grouped[key] = { month: key, totalVolume: 0, avgSalePrice: 0, records: 0 };
    grouped[key].totalVolume += s.transactionVol;
    grouped[key].avgSalePrice += s.avgSalePrice;
    grouped[key].records += 1;
  }
  const monthly = Object.values(grouped).map(g => ({
    month: g.month,
    totalVolume: g.totalVolume,
    avgSalePrice: g.records > 0 ? Math.round(g.avgSalePrice / g.records) : 0,
  }));

  res.json({ success: true, data: monthly, period: `${lookback} months` });
};

export const getMarketIndicators = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) throw new AppError('Authentication required', 401);

  const { area } = req.query as { area?: string };
  const normalizedArea = normalizeOptionalText(area);

  const latest = await prisma.marketSnapshot.findMany({
    where: normalizedArea ? { area: normalizedArea } : {},
    orderBy: { snapshotDate: 'desc' },
    distinct: ['area'],
    take: 20,
  });

  if (latest.length === 0) {
    // Return benchmark-derived indicators
    res.json({
      success: true,
      data: {
        avgDaysOnMarket: 45,
        absorptionRate: 3.2,
        newListings: 0,
        activeListings: 0,
        source: 'benchmark',
        note: 'No market snapshot data yet. Seed with POST /api/market/reports/monthly',
      },
    });
    return;
  }

  const avgDaysOnMarket = latest.reduce((s, r) => s + r.daysOnMarket, 0) / latest.length;
  const absorptionRate = latest.reduce((s, r) => s + r.absorptionRate, 0) / latest.length;
  const totalNewListings = latest.reduce((s, r) => s + r.newListings, 0);
  const totalActive = latest.reduce((s, r) => s + r.activeListings, 0);

  res.json({
    success: true,
    data: {
      avgDaysOnMarket: parseFloat(avgDaysOnMarket.toFixed(1)),
      absorptionRate: parseFloat(absorptionRate.toFixed(2)),
      newListings: totalNewListings,
      activeListings: totalActive,
      areasIncluded: latest.length,
      source: 'database',
    },
  });
};

