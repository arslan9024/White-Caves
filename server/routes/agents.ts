/**
 * Agents API Routes — Full Implementation
 * Supports: list, detail, performance metrics, commissions
 * Endpoints: /api/agents
 */

import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requirePermission } from '../middleware/rbac.js';
import {
  getAgents,
  getAgentStats,
  getAgentById,
  getAgentPerformance,
  getAgentCommissions,
} from '../controllers/agents/index.js';

const router = Router();

// Query endpoints
router.get('/', requirePermission('manage_agents'), asyncHandler(getAgents));
router.get('/stats', requirePermission('manage_agents'), asyncHandler(getAgentStats));
router.get('/:id', asyncHandler(getAgentById));

// Metrics & Commissions
router.get('/:id/performance', asyncHandler(getAgentPerformance));
router.get('/:id/commissions', asyncHandler(getAgentCommissions));

export default router;
