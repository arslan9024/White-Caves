/**
 * Market Intelligence Routes — Wave 12
 * Dubai property price index, transaction data, indicators, RERA index
 */
import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  getPriceIndex,
  getMarketTransactions,
  getMarketIndicators,
  getReraIndex,
  getCompetitorPricing,
  createMonthlyReport,
  getSnapshots,
} from '../controllers/market/index.js';

const router = Router();

// Price index, transactions, indicators
router.get('/price-index', asyncHandler(getPriceIndex));
router.get('/transactions', asyncHandler(getMarketTransactions));
router.get('/indicators', asyncHandler(getMarketIndicators));

// RERA rental index & Competitor pricing
router.get('/rera-index', asyncHandler(getReraIndex));
router.get('/competitor-pricing', asyncHandler(getCompetitorPricing));

// Monthly market report snapshot generation & historical snapshot queries
router.post('/reports/monthly', asyncHandler(createMonthlyReport));
router.get('/snapshots', asyncHandler(getSnapshots));

export default router;
