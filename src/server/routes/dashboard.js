import express from 'express';
import {
  getSummary,
  getMarketAnalytics,
  getAgentPerformance,
  getRecentProperties,
} from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/summary', getSummary);
router.get('/analytics/market', getMarketAnalytics);
router.get('/agents/performance', getAgentPerformance);
router.get('/properties/recent', getRecentProperties);

export default router;
