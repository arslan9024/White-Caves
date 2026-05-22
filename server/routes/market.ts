/**
 * Market Intelligence Routes — Wave 12
 * Dubai property price index, transaction data, indicators, RERA index
 */
import { Router, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../database.js';
import logger from '../utils/logger.js';

const router = Router();

// ─── Dubai Area Price Benchmarks ─────────────────────────────────────────────
const areaBenchmarks: Array<{
  area: string;
  avgPricePerSqft: number;
  avgAnnualRent: number;
  zone: string;
}> = [
  { area: 'Palm Jumeirah', avgPricePerSqft: 3800, avgAnnualRent: 260 * 12, zone: 'premium' },
  { area: 'Downtown Dubai', avgPricePerSqft: 3200, avgAnnualRent: 220 * 12, zone: 'premium' },
  { area: 'Emaar Beachfront', avgPricePerSqft: 3500, avgAnnualRent: 240 * 12, zone: 'premium' },
  { area: 'Creek Harbour', avgPricePerSqft: 2900, avgAnnualRent: 195 * 12, zone: 'premium' },
  { area: 'Dubai Marina', avgPricePerSqft: 2600, avgAnnualRent: 175 * 12, zone: 'prime' },
  { area: 'Jumeirah', avgPricePerSqft: 2800, avgAnnualRent: 190 * 12, zone: 'prime' },
  { area: 'Sobha Hartland', avgPricePerSqft: 2400, avgAnnualRent: 160 * 12, zone: 'prime' },
  { area: 'Dubai Hills', avgPricePerSqft: 2100, avgAnnualRent: 135 * 12, zone: 'mid' },
  { area: 'Business Bay', avgPricePerSqft: 2200, avgAnnualRent: 150 * 12, zone: 'mid' },
  { area: 'JLT', avgPricePerSqft: 1500, avgAnnualRent: 100 * 12, zone: 'mid' },
  { area: 'Jumeirah Lake Towers', avgPricePerSqft: 1500, avgAnnualRent: 100 * 12, zone: 'mid' },
  { area: 'Arabian Ranches', avgPricePerSqft: 1800, avgAnnualRent: 110 * 12, zone: 'mid' },
  { area: 'Al Barsha', avgPricePerSqft: 1300, avgAnnualRent: 90 * 12, zone: 'affordable' },
  { area: 'JVC', avgPricePerSqft: 1200, avgAnnualRent: 80 * 12, zone: 'affordable' },
  {
    area: 'Jumeirah Village Circle',
    avgPricePerSqft: 1200,
    avgAnnualRent: 80 * 12,
    zone: 'affordable',
  },
  { area: 'Motor City', avgPricePerSqft: 1050, avgAnnualRent: 72 * 12, zone: 'affordable' },
  { area: 'Sport City', avgPricePerSqft: 1000, avgAnnualRent: 70 * 12, zone: 'affordable' },
  { area: 'Mirdif', avgPricePerSqft: 1100, avgAnnualRent: 75 * 12, zone: 'affordable' },
  { area: 'Bur Dubai', avgPricePerSqft: 950, avgAnnualRent: 65 * 12, zone: 'affordable' },
  { area: 'Deira', avgPricePerSqft: 900, avgAnnualRent: 60 * 12, zone: 'affordable' },
];

// RERA Rental Index (2024 data — static, updated quarterly in production)
const reraRentalIndex: Array<{
  area: string;
  propertyType: string;
  bedrooms: string;
  avgRentAed: number;
  allowedIncreaseBelow10Pct: string;
  allowedIncrease10to20Pct: string;
  allowedIncrease20to30Pct: string;
  allowedIncrease30to40Pct: string;
  allowedIncreaseAbove40Pct: string;
}> = [
  {
    area: 'Downtown Dubai',
    propertyType: 'apartment',
    bedrooms: '1BR',
    avgRentAed: 90000,
    allowedIncreaseBelow10Pct: '0%',
    allowedIncrease10to20Pct: '5%',
    allowedIncrease20to30Pct: '10%',
    allowedIncrease30to40Pct: '15%',
    allowedIncreaseAbove40Pct: '20%',
  },
  {
    area: 'Dubai Marina',
    propertyType: 'apartment',
    bedrooms: '2BR',
    avgRentAed: 110000,
    allowedIncreaseBelow10Pct: '0%',
    allowedIncrease10to20Pct: '5%',
    allowedIncrease20to30Pct: '10%',
    allowedIncrease30to40Pct: '15%',
    allowedIncreaseAbove40Pct: '20%',
  },
  {
    area: 'JVC',
    propertyType: 'apartment',
    bedrooms: '1BR',
    avgRentAed: 48000,
    allowedIncreaseBelow10Pct: '0%',
    allowedIncrease10to20Pct: '5%',
    allowedIncrease20to30Pct: '10%',
    allowedIncrease30to40Pct: '15%',
    allowedIncreaseAbove40Pct: '20%',
  },
];

// ─── GET /api/market/price-index ─────────────────────────────────────────────
router.get(
  '/price-index',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { zone, propertyType } = req.query as { zone?: string; propertyType?: string };

    // Fetch latest DB snapshots for each area to enrich hardcoded benchmarks
    const latestSnapshots = await prisma.marketSnapshot.findMany({
      where: propertyType ? { propertyType } : undefined,
      orderBy: { snapshotDate: 'desc' },
      distinct: ['area'],
    });
    const snapshotMap = new Map(latestSnapshots.map(s => [s.area.toLowerCase(), s]));

    let result = areaBenchmarks;
    if (zone) {
      result = result.filter(b => b.zone === zone);
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
  })
);

// ─── GET /api/market/transactions ────────────────────────────────────────────
router.get(
  '/transactions',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { area, months = '12' } = req.query as { area?: string; months?: string };
    const lookback = Math.min(36, parseInt(months));
    const since = new Date();
    since.setMonth(since.getMonth() - lookback);

    const where = { snapshotDate: { gte: since }, ...(area ? { area } : {}) };

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
  })
);

// ─── GET /api/market/indicators ──────────────────────────────────────────────
router.get(
  '/indicators',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { area } = req.query as { area?: string };

    const latest = await prisma.marketSnapshot.findMany({
      where: area ? { area } : {},
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
  })
);

// ─── GET /api/market/rera-index ───────────────────────────────────────────────
router.get(
  '/rera-index',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { area, propertyType, bedrooms } = req.query as {
      area?: string;
      propertyType?: string;
      bedrooms?: string;
    };

    let data = reraRentalIndex;
    if (area) data = data.filter(r => r.area.toLowerCase().includes(area.toLowerCase()));
    if (propertyType) data = data.filter(r => r.propertyType === propertyType);
    if (bedrooms) data = data.filter(r => r.bedrooms === bedrooms);

    res.json({
      success: true,
      data,
      total: data.length,
      source: 'rera-2024',
      note: 'Based on RERA Rental Index 2024. Always verify with official RERA portal before issuing Form 7.',
    });
  })
);

// ─── POST /api/market/reports/monthly — generate + store snapshot (manager+) ─
router.post(
  '/reports/monthly',
  asyncHandler(async (req: AuthRequest, res: Response) => {
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
  })
);

// ─── GET /api/market/snapshots — paginated history ───────────────────────────
router.get(
  '/snapshots',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const {
      area,
      page = '1',
      pageSize = '20',
    } = req.query as { area?: string; page?: string; pageSize?: string };

    const p = Math.max(1, parseInt(page));
    const size = Math.min(100, parseInt(pageSize));
    const skip = (p - 1) * size;

    const where = area ? { area } : {};
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
  })
);

export default router;
