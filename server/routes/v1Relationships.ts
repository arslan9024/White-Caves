/**
 * White Caves Real Estate LLC - V1 Relationships REST API Router
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Backend Route)
 * Single Purpose File Law: < 350 lines
 */

import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { CANONICAL_RELATIONSHIPS } from '../../src/components/crm/RelationshipManager/RelationshipManager.data.js';

const router = Router();
const inMemoryRelationships = [...CANONICAL_RELATIONSHIPS];

// GET /api/v1/relationships - List all relational chains
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { search } = req.query;
    let result = [...inMemoryRelationships];

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      result = result.filter(
        r =>
          r.name.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.dealNumber.toLowerCase().includes(q) ||
          r.summary.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: result.length, data: result });
  })
);

// GET /api/v1/relationships/:id - Get single relational chain
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const chain = inMemoryRelationships.find(
      r => r.id === id || r.dealId === id || r.dealNumber === id
    );
    if (!chain) {
      return res.status(404).json({ success: false, error: `Relational chain ${id} not found.` });
    }
    res.json({ success: true, data: chain });
  })
);

export default router;
