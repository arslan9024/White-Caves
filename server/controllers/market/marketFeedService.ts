/**
 * Market Feed Service
 * Fetches, validates, caches, and falls back for live market feeds:
 * - Dubai Area Price Benchmarks
 * - Competitor Portal Pricing (Bayut / PropertyFinder)
 * - Official RERA Rental Index
 */

import logger from '../../utils/logger.js';
import { toStringField, toNumberField } from './marketCommon.js';
import {
  AreaBenchmarkRow,
  CompetitorPricingRow,
  ReraRentalIndexRow,
  areaBenchmarks,
  reraRentalIndex,
} from './marketData.js';

export const MARKET_BENCHMARKS_CACHE_TTL_MS = 10 * 60 * 1000;
let marketBenchmarksLiveCache: { fetchedAt: number; rows: AreaBenchmarkRow[] } | null = null;

export const normalizeBenchmarkRow = (raw: unknown): AreaBenchmarkRow | null => {
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

export const parseBenchmarkPayload = (payload: unknown): AreaBenchmarkRow[] => {
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

export const getAreaBenchmarks = async (): Promise<AreaBenchmarkRow[]> => {
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

export const COMPETITOR_CACHE_TTL_MS = 10 * 60 * 1000;
let competitorPricingCache: { fetchedAt: number; rows: CompetitorPricingRow[] } | null = null;

export const staticCompetitorPricing = (benchmarks: AreaBenchmarkRow[]): CompetitorPricingRow[] => {
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

export const normalizeCompetitorRow = (raw: unknown): CompetitorPricingRow | null => {
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

export const parseCompetitorPayload = (payload: unknown): CompetitorPricingRow[] => {
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

export const getCompetitorPricingData = async (
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

export const RERA_CACHE_TTL_MS = 10 * 60 * 1000;
let reraLiveCache: { fetchedAt: number; rows: ReraRentalIndexRow[] } | null = null;

export const normalizeReraRow = (raw: unknown): ReraRentalIndexRow | null => {
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

export const parseReraPayload = (payload: unknown): ReraRentalIndexRow[] => {
  let sourceRows: unknown[] = [];

  if (Array.isArray(payload)) {
    sourceRows = payload;
  } else if (payload && typeof payload === 'object') {
    const maybeData = (payload as { data?: unknown }).data;
    if (Array.isArray(maybeData)) sourceRows = maybeData;
  }

  return sourceRows.map(normalizeReraRow).filter((row): row is ReraRentalIndexRow => row !== null);
};

export const getReraRentalIndexData = async (): Promise<{
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

export const resetMarketCaches = (): void => {
  marketBenchmarksLiveCache = null;
  competitorPricingCache = null;
  reraLiveCache = null;
};

