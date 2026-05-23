/**
 * Market Analyst Service — Phase 4C
 *
 * Real-time market analytics engine that computes:
 *   1. Price per sqft trends by area/property type
 *   2. Rental yield calculations
 *   3. Comparable property analysis
 *   4. Demand heatmap (leads/inventory ratio)
 *   5. Market overview snapshot
 *   6. Offer-to-ask spread analytics
 *
 * All computations use existing Property, Transaction, Lease, Lead, Offer,
 * and Viewing models — no additional Prisma models required.
 */

import { prisma } from '../../database.js';
import logger from '../../utils/logger.js';

// ─── Types ──────────────────────────────────────────────────────────────

export interface PriceTrend {
  area: string;
  propertyType: string;
  avgPricePerSqft: number;
  medianPricePerSqft: number;
  minPricePerSqft: number;
  maxPricePerSqft: number;
  sampleSize: number;
  period: string;
}

export interface RentalYield {
  area: string;
  propertyType: string;
  avgYield: number;
  avgAnnualRent: number;
  avgPropertyValue: number;
  sampleSize: number;
}

export interface ComparableProperty {
  id: string;
  title: string;
  location: string;
  type: string;
  price: number;
  sqft: number;
  pricePerSqft: number;
  bedrooms: number;
  bathrooms: number;
  status: string;
  similarity: number;  // 0-100 similarity score
}

export interface DemandIndex {
  area: string;
  leadCount: number;
  availableInventory: number;
  demandIndex: number;           // leads / inventory
  avgBudget: number;
  avgLeadScore: number;
  viewingCount: number;
  status: 'hot' | 'warm' | 'balanced' | 'cool' | 'cold';
}

export interface MarketOverview {
  totalProperties: number;
  totalAvailable: number;
  avgPrice: number;
  avgPricePerSqft: number;
  avgRentalYield: number;
  totalTransactions30d: number;
  totalTransactionValue30d: number;
  avgDaysOnMarket: number;
  topAreas: Array<{ area: string; count: number; avgPrice: number }>;
  priceDistribution: Array<{ range: string; count: number }>;
}

export interface OfferSpread {
  area: string;
  avgListPrice: number;
  avgOfferPrice: number;
  avgSpread: number;          // % below list price
  acceptanceRate: number;     // % of offers accepted
  avgCounterAmount: number;
  sampleSize: number;
}

// ─── Price Per Sqft Trends ──────────────────────────────────────────────

/**
 * Calculate price per sqft trends grouped by area and property type.
 *
 * @param options.area    Filter to a specific area
 * @param options.type    Filter to a property type (apartment, villa, etc.)
 * @param options.days    Look-back period in days (default 90)
 */
export async function getPriceTrends(options: {
  area?: string;
  type?: string;
  days?: number;
} = {}): Promise<PriceTrend[]> {
  const { area, type, days = 90 } = options;
  const since = new Date();
  since.setDate(since.getDate() - days);

  const where: Record<string, unknown> = {
    sqft: { gt: 0 },
    price: { gt: 0 },
    createdAt: { gte: since },
  };
  if (area) where.area = { contains: area, mode: 'insensitive' };
  if (type) where.type = type;

  const properties = await prisma.property.findMany({
    where,
    select: {
      price: true,
      sqft: true,
      area: true,
      type: true,
    },
  });

  // Group by area + type
  const groups = new Map<string, Array<{ pricePerSqft: number }>>();
  for (const p of properties) {
    const key = `${(p.area || 'Unknown').trim()}|${p.type}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push({ pricePerSqft: p.price / p.sqft });
  }

  const trends: PriceTrend[] = [];
  for (const [key, items] of groups) {
    const [areaName, propType] = key.split('|');
    const values = items.map(i => i.pricePerSqft).sort((a, b) => a - b);
    const sum = values.reduce((a, b) => a + b, 0);
    const median = values.length % 2 === 0
      ? (values[values.length / 2 - 1] + values[values.length / 2]) / 2
      : values[Math.floor(values.length / 2)];

    trends.push({
      area: areaName,
      propertyType: propType,
      avgPricePerSqft: Math.round(sum / values.length),
      medianPricePerSqft: Math.round(median),
      minPricePerSqft: Math.round(values[0]),
      maxPricePerSqft: Math.round(values[values.length - 1]),
      sampleSize: values.length,
      period: `${days}d`,
    });
  }

  // Sort by sample size descending for relevance
  trends.sort((a, b) => b.sampleSize - a.sampleSize);

  logger.info(`[MarketAnalyst] Price trends: ${trends.length} area/type combos from ${properties.length} properties`);
  return trends;
}

// ─── Rental Yield Calculator ────────────────────────────────────────────

/**
 * Calculate rental yield = (annualRent / propertyValue) × 100
 * by area and property type using Lease + Property data.
 *
 * @param options.area  Filter to specific area
 * @param options.type  Filter to property type
 */
export async function getRentalYields(options: {
  area?: string;
  type?: string;
} = {}): Promise<RentalYield[]> {
  const propertyWhere: Record<string, unknown> = {
    price: { gt: 0 },
  };
  if (options.area) propertyWhere.area = { contains: options.area, mode: 'insensitive' };
  if (options.type) propertyWhere.type = options.type;

  // Active leases with their properties
  const leases = await prisma.lease.findMany({
    where: {
      status: { in: ['active', 'renewed'] },
      monthlyRent: { gt: 0 },
      property: propertyWhere,
    },
    include: {
      property: {
        select: { price: true, area: true, type: true },
      },
    },
  });

  // Group by area + type
  const groups = new Map<string, Array<{ annualRent: number; propertyValue: number }>>();
  for (const lease of leases) {
    if (!lease.property || lease.property.price <= 0) continue;
    const area = (lease.property.area || 'Unknown').trim();
    const key = `${area}|${lease.property.type}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push({
      annualRent: lease.monthlyRent * 12,
      propertyValue: lease.property.price,
    });
  }

  const yields: RentalYield[] = [];
  for (const [key, items] of groups) {
    const [area, propType] = key.split('|');
    const avgRent = items.reduce((s, i) => s + i.annualRent, 0) / items.length;
    const avgValue = items.reduce((s, i) => s + i.propertyValue, 0) / items.length;
    const avgYield = (avgRent / avgValue) * 100;

    yields.push({
      area,
      propertyType: propType,
      avgYield: Math.round(avgYield * 100) / 100,
      avgAnnualRent: Math.round(avgRent),
      avgPropertyValue: Math.round(avgValue),
      sampleSize: items.length,
    });
  }

  yields.sort((a, b) => b.avgYield - a.avgYield);

  logger.info(`[MarketAnalyst] Rental yields: ${yields.length} combos from ${leases.length} leases`);
  return yields;
}

// ─── Comparable Properties ──────────────────────────────────────────────

/**
 * Find comparable properties for a given property based on:
 *   - Same area (or nearby)
 *   - Same type ±1 bedroom
 *   - Price within ±30% range
 *   - Size within ±40% range
 *
 * Each comparable gets a 0-100 similarity score.
 */
export async function getComparables(propertyId: string, options: {
  limit?: number;
  priceRange?: number; // percentage, default 0.3 (±30%)
  sizeRange?: number;  // percentage, default 0.4 (±40%)
} = {}): Promise<ComparableProperty[]> {
  const { limit = 10, priceRange = 0.3, sizeRange = 0.4 } = options;

  const target = await prisma.property.findUnique({
    where: { id: propertyId },
  });
  if (!target) throw new Error(`Property ${propertyId} not found`);

  const where: Record<string, unknown> = {
    id: { not: propertyId },
    type: target.type,
    price: {
      gte: target.price * (1 - priceRange),
      lte: target.price * (1 + priceRange),
    },
  };

  // Size filter only if target has sqft
  if (target.sqft > 0) {
    where.sqft = {
      gte: Math.floor(target.sqft * (1 - sizeRange)),
      lte: Math.ceil(target.sqft * (1 + sizeRange)),
    };
  }

  // Area match (same area preferred)
  if (target.area) {
    where.area = { contains: target.area, mode: 'insensitive' };
  }

  const candidates = await prisma.property.findMany({
    where,
    take: limit * 3, // Fetch extra, then rank by similarity
  });

  // Calculate similarity score
  const comparables: ComparableProperty[] = candidates.map(c => {
    let score = 0;
    const maxScore = 100;

    // Price similarity (40 points)
    const priceDiff = Math.abs(c.price - target.price) / target.price;
    score += Math.max(0, 40 * (1 - priceDiff / priceRange));

    // Size similarity (25 points)
    if (target.sqft > 0 && c.sqft > 0) {
      const sizeDiff = Math.abs(c.sqft - target.sqft) / target.sqft;
      score += Math.max(0, 25 * (1 - sizeDiff / sizeRange));
    }

    // Bedroom match (15 points)
    const bedDiff = Math.abs(c.bedrooms - target.bedrooms);
    score += bedDiff === 0 ? 15 : bedDiff === 1 ? 8 : 0;

    // Location match (20 points)
    if (c.area && target.area && c.area.toLowerCase() === target.area.toLowerCase()) {
      score += 20;
    } else if (c.location && target.location) {
      // Partial location match
      const cLoc = c.location.toLowerCase();
      const tLoc = target.location.toLowerCase();
      if (cLoc.includes(tLoc.split(',')[0]) || tLoc.includes(cLoc.split(',')[0])) {
        score += 10;
      }
    }

    return {
      id: c.id,
      title: c.title,
      location: c.location,
      type: c.type,
      price: c.price,
      sqft: c.sqft,
      pricePerSqft: c.sqft > 0 ? Math.round(c.price / c.sqft) : 0,
      bedrooms: c.bedrooms,
      bathrooms: c.bathrooms,
      status: c.status,
      similarity: Math.min(Math.round(score), maxScore),
    };
  });

  // Sort by similarity descending, take top N
  comparables.sort((a, b) => b.similarity - a.similarity);
  const result = comparables.slice(0, limit);

  logger.info(`[MarketAnalyst] Comparables for ${propertyId}: ${result.length} found from ${candidates.length} candidates`);
  return result;
}

// ─── Demand Heatmap ─────────────────────────────────────────────────────

/**
 * Calculate demand index per area:
 *   demandIndex = activeLead count / available inventory count
 *
 * Status mapping:
 *   > 3.0 = hot, > 2.0 = warm, > 1.0 = balanced, > 0.5 = cool, ≤ 0.5 = cold
 */
export async function getDemandHeatmap(options: {
  days?: number;
} = {}): Promise<DemandIndex[]> {
  const { days = 30 } = options;
  const since = new Date();
  since.setDate(since.getDate() - days);

  // Get available properties grouped by area
  const properties = await prisma.property.findMany({
    where: { status: { in: ['available', 'reserved'] } },
    select: { area: true, price: true },
  });

  const propByArea = new Map<string, number>();
  for (const p of properties) {
    const area = (p.area || 'Unknown').trim();
    propByArea.set(area, (propByArea.get(area) || 0) + 1);
  }

  // Get active leads with budget, grouped by property area
  const leads = await prisma.lead.findMany({
    where: {
      status: { in: ['new', 'contacted', 'qualified', 'negotiating'] },
      createdAt: { gte: since },
    },
    select: {
      budget: true,
      score: true,
      property: { select: { area: true } },
    },
  });

  const leadByArea = new Map<string, Array<{ budget: number; score: number }>>();
  for (const lead of leads) {
    const area = (lead.property?.area || 'Unknown').trim();
    if (!leadByArea.has(area)) leadByArea.set(area, []);
    leadByArea.get(area)!.push({
      budget: lead.budget || 0,
      score: lead.score || 0,
    });
  }

  // Get viewing counts by area
  const viewings = await prisma.viewing.findMany({
    where: {
      scheduledAt: { gte: since },
    },
    select: {
      property: { select: { area: true } },
    },
  });

  const viewByArea = new Map<string, number>();
  for (const v of viewings) {
    const area = (v.property?.area || 'Unknown').trim();
    viewByArea.set(area, (viewByArea.get(area) || 0) + 1);
  }

  // Combine all areas
  const allAreas = new Set([...propByArea.keys(), ...leadByArea.keys()]);
  const heatmap: DemandIndex[] = [];

  for (const area of allAreas) {
    const inventory = propByArea.get(area) || 0;
    const areaLeads = leadByArea.get(area) || [];
    const leadCount = areaLeads.length;
    const viewCount = viewByArea.get(area) || 0;

    const demandIndex = inventory > 0 ? leadCount / inventory : leadCount > 0 ? 10 : 0;
    const avgBudget = areaLeads.length > 0
      ? areaLeads.reduce((s, l) => s + l.budget, 0) / areaLeads.length
      : 0;
    const avgScore = areaLeads.length > 0
      ? areaLeads.reduce((s, l) => s + l.score, 0) / areaLeads.length
      : 0;

    let status: DemandIndex['status'] = 'cold';
    if (demandIndex > 3) status = 'hot';
    else if (demandIndex > 2) status = 'warm';
    else if (demandIndex > 1) status = 'balanced';
    else if (demandIndex > 0.5) status = 'cool';

    heatmap.push({
      area,
      leadCount,
      availableInventory: inventory,
      demandIndex: Math.round(demandIndex * 100) / 100,
      avgBudget: Math.round(avgBudget),
      avgLeadScore: Math.round(avgScore),
      viewingCount: viewCount,
      status,
    });
  }

  heatmap.sort((a, b) => b.demandIndex - a.demandIndex);

  logger.info(`[MarketAnalyst] Demand heatmap: ${heatmap.length} areas, ${leads.length} leads, ${properties.length} properties`);
  return heatmap;
}

// ─── Market Overview ────────────────────────────────────────────────────

/**
 * Compute a full market overview snapshot:
 *   - Portfolio stats (total, available, avg price, avg price/sqft)
 *   - Transaction volume (30d)
 *   - Rental yield average
 *   - Days on market
 *   - Top areas and price distribution
 */
export async function getMarketOverview(): Promise<MarketOverview> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Property stats
  const allProperties = await prisma.property.findMany({
    select: { price: true, sqft: true, area: true, status: true, createdAt: true },
  });

  const available = allProperties.filter(p => p.status === 'available');
  const withSqft = allProperties.filter(p => p.sqft > 0 && p.price > 0);
  const avgPrice = allProperties.length > 0
    ? allProperties.reduce((s, p) => s + p.price, 0) / allProperties.length
    : 0;
  const avgPricePerSqft = withSqft.length > 0
    ? withSqft.reduce((s, p) => s + p.price / p.sqft, 0) / withSqft.length
    : 0;

  // Days on market (for available properties)
  const now = Date.now();
  const daysOnMarket = available.length > 0
    ? available.reduce((s, p) => s + (now - p.createdAt.getTime()) / 86400000, 0) / available.length
    : 0;

  // Transactions last 30 days
  const recentTx = await prisma.transaction.findMany({
    where: {
      status: { in: ['completed', 'in_progress'] },
      createdAt: { gte: thirtyDaysAgo },
    },
    select: { amount: true },
  });
  const txValue = recentTx.reduce((s, t) => s + t.amount, 0);

  // Rental yield average (from active leases)
  const activeLeases = await prisma.lease.findMany({
    where: {
      status: { in: ['active', 'renewed'] },
      monthlyRent: { gt: 0 },
    },
    include: { property: { select: { price: true } } },
  });
  const yieldsArr = activeLeases
    .filter(l => l.property && l.property.price > 0)
    .map(l => ((l.monthlyRent * 12) / l.property.price) * 100);
  const avgYield = yieldsArr.length > 0
    ? yieldsArr.reduce((a, b) => a + b, 0) / yieldsArr.length
    : 0;

  // Top areas
  const areaMap = new Map<string, { count: number; totalPrice: number }>();
  for (const p of allProperties) {
    const area = (p.area || 'Unknown').trim();
    const entry = areaMap.get(area) || { count: 0, totalPrice: 0 };
    entry.count++;
    entry.totalPrice += p.price;
    areaMap.set(area, entry);
  }
  const topAreas = [...areaMap.entries()]
    .map(([area, data]) => ({ area, count: data.count, avgPrice: Math.round(data.totalPrice / data.count) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Price distribution
  const ranges = [
    { range: '< 500K', min: 0, max: 500000 },
    { range: '500K–1M', min: 500000, max: 1000000 },
    { range: '1M–2M', min: 1000000, max: 2000000 },
    { range: '2M–5M', min: 2000000, max: 5000000 },
    { range: '5M–10M', min: 5000000, max: 10000000 },
    { range: '> 10M', min: 10000000, max: Infinity },
  ];
  const priceDistribution = ranges.map(r => ({
    range: r.range,
    count: allProperties.filter(p => p.price >= r.min && p.price < r.max).length,
  }));

  logger.info(`[MarketAnalyst] Market overview: ${allProperties.length} properties, ${recentTx.length} recent transactions`);

  return {
    totalProperties: allProperties.length,
    totalAvailable: available.length,
    avgPrice: Math.round(avgPrice),
    avgPricePerSqft: Math.round(avgPricePerSqft),
    avgRentalYield: Math.round(avgYield * 100) / 100,
    totalTransactions30d: recentTx.length,
    totalTransactionValue30d: Math.round(txValue),
    avgDaysOnMarket: Math.round(daysOnMarket),
    topAreas,
    priceDistribution,
  };
}

// ─── Offer / Ask Spread ─────────────────────────────────────────────────

/**
 * Analyze the gap between listing prices and offer amounts by area.
 * Shows negotiation dynamics: how much below asking price buyers offer.
 */
export async function getOfferSpread(options: {
  area?: string;
  days?: number;
} = {}): Promise<OfferSpread[]> {
  const { area, days = 90 } = options;
  const since = new Date();
  since.setDate(since.getDate() - days);

  const where: Record<string, unknown> = {
    createdAt: { gte: since },
    amount: { gt: 0 },
  };

  const offers = await prisma.offer.findMany({
    where,
    include: {
      property: { select: { price: true, area: true } },
    },
  });

  // Group by area
  const groups = new Map<string, Array<{
    listPrice: number;
    offerPrice: number;
    counter: number | null;
    accepted: boolean;
  }>>();

  for (const o of offers) {
    if (!o.property || o.property.price <= 0) continue;
    const propArea = (o.property.area || 'Unknown').trim();
    if (area && !propArea.toLowerCase().includes(area.toLowerCase())) continue;

    if (!groups.has(propArea)) groups.set(propArea, []);
    groups.get(propArea)!.push({
      listPrice: o.property.price,
      offerPrice: o.amount,
      counter: o.counterAmount,
      accepted: o.status === 'accepted',
    });
  }

  const spreads: OfferSpread[] = [];
  for (const [areaName, items] of groups) {
    const avgList = items.reduce((s, i) => s + i.listPrice, 0) / items.length;
    const avgOffer = items.reduce((s, i) => s + i.offerPrice, 0) / items.length;
    const avgSpread = ((avgList - avgOffer) / avgList) * 100;
    const accepted = items.filter(i => i.accepted).length;
    const counters = items.filter(i => i.counter != null);
    const avgCounter = counters.length > 0
      ? counters.reduce((s, i) => s + (i.counter || 0), 0) / counters.length
      : 0;

    spreads.push({
      area: areaName,
      avgListPrice: Math.round(avgList),
      avgOfferPrice: Math.round(avgOffer),
      avgSpread: Math.round(avgSpread * 100) / 100,
      acceptanceRate: items.length > 0 ? Math.round((accepted / items.length) * 100) : 0,
      avgCounterAmount: Math.round(avgCounter),
      sampleSize: items.length,
    });
  }

  spreads.sort((a, b) => b.sampleSize - a.sampleSize);

  logger.info(`[MarketAnalyst] Offer spreads: ${spreads.length} areas from ${offers.length} offers`);
  return spreads;
}

// ─── Exports ────────────────────────────────────────────────────────────

export default {
  getPriceTrends,
  getRentalYields,
  getComparables,
  getDemandHeatmap,
  getMarketOverview,
  getOfferSpread,
};
