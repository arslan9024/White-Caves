/**
 * Mary Inventory Routes — AI Valuation & ROI Optimizer
 *
 * POST /api/mary/ai-valuate    — AVM property valuation
 * POST /api/mary/roi-optimize  — Portfolio ROI analysis
 */

import { Router, Request, Response } from 'express';
import { requireMinRole } from '../middleware/rbac.js';

const router = Router();

// ─── POST /api/mary/ai-valuate ────────────────────────────────────────────────

/**
 * Run an Automated Valuation Model (AVM) for a property.
 *
 * Body:
 * {
 *   community:    string,
 *   propertyType: 'apartment' | 'villa' | 'townhouse' | 'penthouse' | 'studio',
 *   bedrooms:     number,
 *   buaSqft:      number,
 *   floorLevel?:  'low' | 'mid' | 'high' | 'ground',
 *   viewType?:    'sea' | 'golf' | 'park' | 'pool' | 'community' | 'road',
 *   finishing?:   'standard' | 'upgraded' | 'premium',
 *   buildingAge?: number,
 *   annualRentAED?: number   // optional: include to get yield calculations
 * }
 */
router.post('/ai-valuate', requireMinRole('agent'), async (req: Request, res: Response) => {
  try {
    const { valuateProperty } = await import('../services/mary/aiValuation.js');
    const { annualRentAED, ...input } = req.body as {
      community: string;
      propertyType: string;
      bedrooms: number;
      buaSqft: number;
      floorLevel?: string;
      viewType?: string;
      finishing?: string;
      buildingAge?: number;
      annualRentAED?: number;
    };

    if (!input.community || !input.propertyType || !input.bedrooms || !input.buaSqft) {
      return res.status(400).json({
        success: false,
        error: 'Required fields: community, propertyType, bedrooms, buaSqft',
      });
    }

    const result = valuateProperty(input as Parameters<typeof valuateProperty>[0], annualRentAED);
    res.json({ success: true, data: result });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

// ─── POST /api/mary/roi-optimize ─────────────────────────────────────────────

/**
 * Portfolio ROI optimisation.
 *
 * Body: ROIOptimizationInput
 * {
 *   portfolio: PortfolioProperty[],
 *   compareMortgage?: boolean,
 *   mortgageRatePct?: number,
 *   isUAENational?:   boolean,
 *   newBudgetAED?:    number,
 *   targetYieldPct?:  number
 * }
 */
router.post('/roi-optimize', requireMinRole('agent'), async (req: Request, res: Response) => {
  try {
    const { optimizePortfolioROI } = await import('../services/mary/roiOptimizer.js');
    const input = req.body;

    if (!Array.isArray(input.portfolio) || input.portfolio.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'portfolio must be a non-empty array of PortfolioProperty objects',
      });
    }

    const result = optimizePortfolioROI(input);
    res.json({ success: true, data: result });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

// ─── POST /api/mary/inventory-organize ───────────────────────────────────────

/**
 * Generate inventory organization insights and prioritized actions.
 *
 * Body:
 * {
 *   inventory: Array<{
 *     id: string;
 *     area: string;
 *     status: 'available' | 'reserved' | 'sold' | 'leased' | 'maintenance';
 *     updatedAt?: string;
 *     source?: string;
 *   }>
 * }
 */
router.post('/inventory-organize', requireMinRole('agent'), async (req: Request, res: Response) => {
  try {
    const { inventory } = req.body as {
      inventory?: Array<{
        id?: string;
        area?: string;
        status?: string;
        updatedAt?: string;
        source?: string;
      }>;
    };

    if (!Array.isArray(inventory) || inventory.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'inventory must be a non-empty array',
      });
    }

    const normalized = inventory
      .filter(item => item?.id && item?.area && item?.status)
      .map(item => ({
        id: String(item.id),
        area: String(item.area).trim(),
        status: String(item.status).toLowerCase(),
        updatedAt: item.updatedAt ? new Date(item.updatedAt) : null,
        source: item.source ? String(item.source) : 'manual',
      }));

    const byStatus = normalized.reduce<Record<string, number>>((acc, item) => {
      acc[item.status] = (acc[item.status] ?? 0) + 1;
      return acc;
    }, {});

    const byArea = normalized.reduce<Record<string, number>>((acc, item) => {
      acc[item.area] = (acc[item.area] ?? 0) + 1;
      return acc;
    }, {});

    const staleCutoff = Date.now() - 14 * 24 * 60 * 60 * 1000;
    const staleUnits = normalized.filter(
      item => item.updatedAt && item.updatedAt.getTime() < staleCutoff
    );

    const recommendations = [
      staleUnits.length > 0
        ? `Refresh ${staleUnits.length} stale inventory record(s) older than 14 days.`
        : 'No stale inventory records detected in the current payload.',
      `Prioritize demand review for top area: ${
        Object.entries(byArea).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'N/A'
      }.`,
      `Create a daily organizer board by status (available/reserved/sold/leased/maintenance).`,
    ];

    res.json({
      success: true,
      data: {
        totalUnits: normalized.length,
        byStatus,
        byArea,
        staleUnits: staleUnits.map(unit => ({
          id: unit.id,
          area: unit.area,
          status: unit.status,
          updatedAt: unit.updatedAt?.toISOString() ?? null,
        })),
        recommendations,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

export default router;
