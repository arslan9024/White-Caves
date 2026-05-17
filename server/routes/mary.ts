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
      community:    string;
      propertyType: string;
      bedrooms:     number;
      buaSqft:      number;
      floorLevel?:  string;
      viewType?:    string;
      finishing?:   string;
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
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
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
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

export default router;
