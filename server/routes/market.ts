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

const parsePositiveInt = (value: unknown, fallback: number, max: number): number => {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(max, parsed);
};

const normalizeOptionalText = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
};

const VALID_COMPETITOR_PORTALS = ['bayut', 'propertyfinder'] as const;

// ─── Dubai Area Price Benchmarks ─────────────────────────────────────────────
interface AreaBenchmarkRow {
  area: string;
  avgPricePerSqft: number;
  avgAnnualRent: number;
  zone: string;
}

interface CompetitorPricingRow {
  area: string;
  portal: 'bayut' | 'propertyfinder';
  avgPricePerSqft: number;
  deltaVsWhiteCavesPct: number;
  updatedAt: string;
  source: string;
}

const areaBenchmarks: AreaBenchmarkRow[] = [
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

const MARKET_BENCHMARKS_CACHE_TTL_MS = 10 * 60 * 1000;
let marketBenchmarksLiveCache: { fetchedAt: number; rows: AreaBenchmarkRow[] } | null = null;

const normalizeBenchmarkRow = (raw: unknown): AreaBenchmarkRow | null => {
  if (!raw || typeof raw !== 'object') return null;

  const row = raw as Record<string, unknown>;
  const area = toStringField(row.area);
  const zone = toStringField(row.zone);
  const avgPricePerSqft = toNumberField(row.avgPricePerSqft);
  const avgAnnualRent = toNumberField(row.avgAnnualRent);

  if (!area || !zone || avgPricePerSqft === null || avgAnnualRent === null) {
    return null;
  }

  return { area, zone, avgPricePerSqft, avgAnnualRent };
};

const parseBenchmarkPayload = (payload: unknown): AreaBenchmarkRow[] => {
  let sourceRows: unknown[] = [];

  if (Array.isArray(payload)) {
    sourceRows = payload;
  } else if (payload && typeof payload === 'object') {
    const maybeData = (payload as { data?: unknown }).data;
    if (Array.isArray(maybeData)) sourceRows = maybeData;
  }

  return sourceRows
    .map(normalizeBenchmarkRow)
    .filter((row): row is AreaBenchmarkRow => row !== null);
};

const COMPETITOR_CACHE_TTL_MS = 10 * 60 * 1000;
let competitorPricingCache: { fetchedAt: number; rows: CompetitorPricingRow[] } | null = null;

const staticCompetitorPricing = (benchmarks: AreaBenchmarkRow[]): CompetitorPricingRow[] => {
  const nowIso = new Date().toISOString();

  return benchmarks.flatMap(benchmark => {
    const bayutPrice = Math.round(benchmark.avgPricePerSqft * 1.04);
    const propertyFinderPrice = Math.round(benchmark.avgPricePerSqft * 0.97);

    const bayutDelta =
      benchmark.avgPricePerSqft > 0
        ? Number(
            (((bayutPrice - benchmark.avgPricePerSqft) / benchmark.avgPricePerSqft) * 100).toFixed(
              2
            )
          )
        : 0;

    const propertyFinderDelta =
      benchmark.avgPricePerSqft > 0
        ? Number(
            (
              ((propertyFinderPrice - benchmark.avgPricePerSqft) / benchmark.avgPricePerSqft) *
              100
            ).toFixed(2)
          )
        : 0;

    return [
      {
        area: benchmark.area,
        portal: 'bayut' as const,
        avgPricePerSqft: bayutPrice,
        deltaVsWhiteCavesPct: bayutDelta,
        updatedAt: nowIso,
        source: 'derived-benchmark',
      },
      {
        area: benchmark.area,
        portal: 'propertyfinder' as const,
        avgPricePerSqft: propertyFinderPrice,
        deltaVsWhiteCavesPct: propertyFinderDelta,
        updatedAt: nowIso,
        source: 'derived-benchmark',
      },
    ];
  });
};

const normalizeCompetitorRow = (raw: unknown): CompetitorPricingRow | null => {
  if (!raw || typeof raw !== 'object') return null;

  const row = raw as Record<string, unknown>;
  const area = toStringField(row.area);
  const portalRaw = toStringField(row.portal)?.toLowerCase();
  const avgPricePerSqft = toNumberField(row.avgPricePerSqft);
  const deltaVsWhiteCavesPct = toNumberField(row.deltaVsWhiteCavesPct);
  const updatedAt = toStringField(row.updatedAt) ?? new Date().toISOString();
  const source = toStringField(row.source) ?? 'live-feed';

  if (!area || !portalRaw || avgPricePerSqft === null || deltaVsWhiteCavesPct === null) {
    return null;
  }

  if (portalRaw !== 'bayut' && portalRaw !== 'propertyfinder') {
    return null;
  }

  return {
    area,
    portal: portalRaw,
    avgPricePerSqft,
    deltaVsWhiteCavesPct,
    updatedAt,
    source,
  };
};

const parseCompetitorPayload = (payload: unknown): CompetitorPricingRow[] => {
  let sourceRows: unknown[] = [];

  if (Array.isArray(payload)) {
    sourceRows = payload;
  } else if (payload && typeof payload === 'object') {
    const maybeData = (payload as { data?: unknown }).data;
    if (Array.isArray(maybeData)) sourceRows = maybeData;
  }

  return sourceRows
    .map(normalizeCompetitorRow)
    .filter((row): row is CompetitorPricingRow => row !== null);
};

const getCompetitorPricingData = async (
  benchmarks: AreaBenchmarkRow[]
): Promise<CompetitorPricingRow[]> => {
  const feedUrl = process.env.COMPETITOR_PRICING_URL;
  if (!feedUrl) return staticCompetitorPricing(benchmarks);

  const now = Date.now();
  if (competitorPricingCache && now - competitorPricingCache.fetchedAt < COMPETITOR_CACHE_TTL_MS) {
    return competitorPricingCache.rows;
  }

  try {
    const headers: Record<string, string> = { Accept: 'application/json' };
    const apiKey = process.env.COMPETITOR_PRICING_API_KEY;
    if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

    const response = await fetch(feedUrl, { headers });
    if (!response.ok) {
      throw new Error(`Competitor feed request failed: HTTP ${response.status}`);
    }

    const payload = (await response.json()) as unknown;
    const rows = parseCompetitorPayload(payload);
    if (rows.length === 0) {
      throw new Error('Competitor feed returned no valid rows');
    }

    competitorPricingCache = { fetchedAt: now, rows };
    return rows;
  } catch (error) {
    logger.warn('Competitor pricing feed unavailable — falling back to derived benchmark data', {
      error: error instanceof Error ? error.message : String(error),
    });

    return staticCompetitorPricing(benchmarks);
  }
};

const getAreaBenchmarks = async (): Promise<AreaBenchmarkRow[]> => {
  const feedUrl = process.env.MARKET_BENCHMARKS_URL;
  if (!feedUrl) return areaBenchmarks;

  const now = Date.now();
  if (
    marketBenchmarksLiveCache &&
    now - marketBenchmarksLiveCache.fetchedAt < MARKET_BENCHMARKS_CACHE_TTL_MS
  ) {
    return marketBenchmarksLiveCache.rows;
  }

  try {
    const headers: Record<string, string> = { Accept: 'application/json' };
    const apiKey = process.env.MARKET_BENCHMARKS_API_KEY;
    if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

    const response = await fetch(feedUrl, { headers });
    if (!response.ok) {
      throw new Error(`Benchmark feed request failed: HTTP ${response.status}`);
    }

    const payload = (await response.json()) as unknown;
    const rows = parseBenchmarkPayload(payload);
    if (rows.length === 0) {
      throw new Error('Benchmark feed returned no valid rows');
    }

    marketBenchmarksLiveCache = { fetchedAt: now, rows };
    return rows;
  } catch (error) {
    logger.warn('Market benchmark live feed unavailable — falling back to static benchmarks', {
      error: error instanceof Error ? error.message : String(error),
    });

    return areaBenchmarks;
  }
};

interface ReraRentalIndexRow {
  area: string;
  propertyType: string;
  bedrooms: string;
  avgRentAed: number;
  allowedIncreaseBelow10Pct: string;
  allowedIncrease10to20Pct: string;
  allowedIncrease20to30Pct: string;
  allowedIncrease30to40Pct: string;
  allowedIncreaseAbove40Pct: string;
}

// RERA Rental Index (2024 data — static, updated quarterly in production)
const reraRentalIndex: ReraRentalIndexRow[] = [
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

const RERA_CACHE_TTL_MS = 10 * 60 * 1000;
let reraLiveCache: { fetchedAt: number; rows: ReraRentalIndexRow[] } | null = null;

const toStringField = (value: unknown): string | null => {
  if (typeof value === 'string' && value.trim().length > 0) return value.trim();
  return null;
};

const toNumberField = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
};

const normalizeReraRow = (raw: unknown): ReraRentalIndexRow | null => {
  if (!raw || typeof raw !== 'object') return null;

  const row = raw as Record<string, unknown>;
  const area = toStringField(row.area);
  const propertyType = toStringField(row.propertyType);
  const bedrooms = toStringField(row.bedrooms);
  const avgRentAed = toNumberField(row.avgRentAed);
  const allowedIncreaseBelow10Pct = toStringField(row.allowedIncreaseBelow10Pct);
  const allowedIncrease10to20Pct = toStringField(row.allowedIncrease10to20Pct);
  const allowedIncrease20to30Pct = toStringField(row.allowedIncrease20to30Pct);
  const allowedIncrease30to40Pct = toStringField(row.allowedIncrease30to40Pct);
  const allowedIncreaseAbove40Pct = toStringField(row.allowedIncreaseAbove40Pct);

  if (
    !area ||
    !propertyType ||
    !bedrooms ||
    avgRentAed === null ||
    !allowedIncreaseBelow10Pct ||
    !allowedIncrease10to20Pct ||
    !allowedIncrease20to30Pct ||
    !allowedIncrease30to40Pct ||
    !allowedIncreaseAbove40Pct
  ) {
    return null;
  }

  return {
    area,
    propertyType,
    bedrooms,
    avgRentAed,
    allowedIncreaseBelow10Pct,
    allowedIncrease10to20Pct,
    allowedIncrease20to30Pct,
    allowedIncrease30to40Pct,
    allowedIncreaseAbove40Pct,
  };
};

const parseReraPayload = (payload: unknown): ReraRentalIndexRow[] => {
  let sourceRows: unknown[] = [];

  if (Array.isArray(payload)) {
    sourceRows = payload;
  } else if (payload && typeof payload === 'object') {
    const maybeData = (payload as { data?: unknown }).data;
    if (Array.isArray(maybeData)) sourceRows = maybeData;
  }

  return sourceRows.map(normalizeReraRow).filter((row): row is ReraRentalIndexRow => row !== null);
};

const getReraRentalIndexData = async (): Promise<{
  rows: ReraRentalIndexRow[];
  source: string;
  note: string;
}> => {
  const feedUrl = process.env.RERA_RENTAL_INDEX_URL;

  if (!feedUrl) {
    return {
      rows: reraRentalIndex,
      source: 'rera-2024',
      note: 'Based on RERA Rental Index 2024. Always verify with official RERA portal before issuing Form 7.',
    };
  }

  const now = Date.now();
  if (reraLiveCache && now - reraLiveCache.fetchedAt < RERA_CACHE_TTL_MS) {
    return {
      rows: reraLiveCache.rows,
      source: 'rera-live-cache',
      note: 'Live RERA feed (cached). Always verify with official RERA portal before issuing Form 7.',
    };
  }

  try {
    const headers: Record<string, string> = { Accept: 'application/json' };
    const apiKey = process.env.RERA_RENTAL_INDEX_API_KEY;
    if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

    const response = await fetch(feedUrl, { headers });
    if (!response.ok) {
      throw new Error(`Live feed request failed: HTTP ${response.status}`);
    }

    const payload = (await response.json()) as unknown;
    const rows = parseReraPayload(payload);

    if (rows.length === 0) {
      throw new Error('Live feed returned no valid rows');
    }

    reraLiveCache = { fetchedAt: now, rows };

    return {
      rows,
      source: 'rera-live',
      note: 'Live RERA feed. Always verify with official RERA portal before issuing Form 7.',
    };
  } catch (error) {
    logger.warn('RERA live feed unavailable — falling back to static index', {
      error: error instanceof Error ? error.message : String(error),
    });

    return {
      rows: reraRentalIndex,
      source: 'rera-2024-fallback',
      note: 'Live RERA feed unavailable, fallback to RERA 2024 static index. Verify with official portal before Form 7.',
    };
  }
};

// ─── GET /api/market/price-index ─────────────────────────────────────────────
router.get(
  '/price-index',
  asyncHandler(async (req: AuthRequest, res: Response) => {
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
  })
);

// ─── GET /api/market/transactions ────────────────────────────────────────────
router.get(
  '/transactions',
  asyncHandler(async (req: AuthRequest, res: Response) => {
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
  })
);

// ─── GET /api/market/indicators ──────────────────────────────────────────────
router.get(
  '/indicators',
  asyncHandler(async (req: AuthRequest, res: Response) => {
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
  })
);

// ─── GET /api/market/competitor-pricing ─────────────────────────────────────
router.get(
  '/competitor-pricing',
  asyncHandler(async (req: AuthRequest, res: Response) => {
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
    const normalizedArea = normalizeOptionalText(area);

    const p = parsePositiveInt(page, 1, 10000);
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
  })
);

export default router;
