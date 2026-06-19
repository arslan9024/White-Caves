/**
 * Market Analytics Routes — Phase 4C
 *
 * Endpoints:
 *   GET  /api/analytics/overview        — Full market overview snapshot
 *   GET  /api/analytics/trends          — Price per sqft trends by area/type
 *   GET  /api/analytics/yields          — Rental yield by area/type
 *   GET  /api/analytics/comparables/:id — Comparable properties for a listing
 *   GET  /api/analytics/demand          — Demand heatmap (leads/inventory)
 *   GET  /api/analytics/offer-spread    — Offer vs. asking price analytics
 */

import { Router, Request, Response } from 'express';
import { requirePermission } from '../middleware/rbac.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  getMarketOverview,
  getPriceTrends,
  getRentalYields,
  getComparables,
  getDemandHeatmap,
  getOfferSpread,
} from '../services/ai/marketAnalyst.js';
import { logger } from '../utils/logger.js';

const router = Router();

// ── Market Overview ─────────────────────────────────────────────────────

router.get(
  '/overview',
  requirePermission('view_analytics'),
  asyncHandler(async (_req: Request, res: Response) => {
    logger.info('[Analytics] Market overview requested');

    const overview = await getMarketOverview();

    res.status(200).json({
      success: true,
      data: overview,
    });
  })
);

// ── Price Per Sqft Trends ───────────────────────────────────────────────

router.get(
  '/trends',
  requirePermission('view_analytics'),
  asyncHandler(async (req: Request, res: Response) => {
    const { area, type, days } = req.query as Record<string, string | undefined>;

    const trends = await getPriceTrends({
      area: area as string | undefined,
      type: type as string | undefined,
      days: days ? parseInt(days as string, 10) : undefined,
    });

    res.status(200).json({
      success: true,
      data: trends,
      meta: {
        area: area || 'all',
        type: type || 'all',
        days: days ? parseInt(days as string, 10) : 90,
      },
    });
  })
);

// ── Rental Yields ───────────────────────────────────────────────────────

router.get(
  '/yields',
  requirePermission('view_analytics'),
  asyncHandler(async (req: Request, res: Response) => {
    const { area, type } = req.query as Record<string, string | undefined>;

    const yields = await getRentalYields({
      area: area as string | undefined,
      type: type as string | undefined,
    });

    res.status(200).json({
      success: true,
      data: yields,
      meta: {
        area: area || 'all',
        type: type || 'all',
      },
    });
  })
);

// ── Comparable Properties ───────────────────────────────────────────────

router.get(
  '/comparables/:propertyId',
  requirePermission('view_leads'),
  asyncHandler(async (req: Request, res: Response) => {
    const { propertyId } = req.params as Record<string, string>;
    const { limit, priceRange, sizeRange } = req.query as Record<string, string | undefined>;

    const comparables = await getComparables(propertyId, {
      limit: limit ? parseInt(limit as string, 10) : undefined,
      priceRange: priceRange ? parseFloat(priceRange as string) : undefined,
      sizeRange: sizeRange ? parseFloat(sizeRange as string) : undefined,
    });

    res.status(200).json({
      success: true,
      data: comparables,
      meta: {
        propertyId,
        limit: limit ? parseInt(limit as string, 10) : 10,
      },
    });
  })
);

// ── Demand Heatmap ──────────────────────────────────────────────────────

router.get(
  '/demand',
  requirePermission('view_analytics'),
  asyncHandler(async (req: Request, res: Response) => {
    const { days } = req.query as Record<string, string | undefined>;

    const heatmap = await getDemandHeatmap({
      days: days ? parseInt(days as string, 10) : undefined,
    });

    res.status(200).json({
      success: true,
      data: heatmap,
      meta: {
        days: days ? parseInt(days as string, 10) : 30,
      },
    });
  })
);

// ── Offer Spread ────────────────────────────────────────────────────────

router.get(
  '/offer-spread',
  requirePermission('view_analytics'),
  asyncHandler(async (req: Request, res: Response) => {
    const { area, days } = req.query as Record<string, string | undefined>;

    const spreads = await getOfferSpread({
      area: area as string | undefined,
      days: days ? parseInt(days as string, 10) : undefined,
    });

    res.status(200).json({
      success: true,
      data: spreads,
      meta: {
        area: area || 'all',
        days: days ? parseInt(days as string, 10) : 90,
      },
    });
  })
);

export default router;
