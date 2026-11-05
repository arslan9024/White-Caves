/**
 * White Caves Real Estate LLC - V1 Sovereign Documents REST API Router
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Backend Route)
 * Single Purpose File Law: < 350 lines
 */

import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { CANONICAL_DOCUMENTS } from '../../src/components/crm/DocumentManager/DocumentManager.data.js';

const router = Router();
let inMemoryDocuments = [...CANONICAL_DOCUMENTS];

// GET /api/v1/documents - List all documents in vault
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { docType, status, search } = req.query;
    let result = [...inMemoryDocuments];

    if (docType && typeof docType === 'string' && docType !== 'ALL') {
      result = result.filter(d => d.docType === docType);
    }
    if (status && typeof status === 'string' && status !== 'ALL') {
      result = result.filter(d => d.status === status);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      result = result.filter(
        d =>
          d.title.toLowerCase().includes(q) ||
          d.id.toLowerCase().includes(q) ||
          d.documentNumber.toLowerCase().includes(q) ||
          d.linkedDealId.toLowerCase().includes(q) ||
          d.linkedPropertyName.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: result.length, data: result });
  })
);

// GET /api/v1/documents/:id - Get single document dossier
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const doc = inMemoryDocuments.find(d => d.id === id || d._id === id || d.documentNumber === id);
    if (!doc) {
      return res.status(404).json({ success: false, error: `Document ${id} not found.` });
    }
    res.json({ success: true, data: doc });
  })
);

// POST /api/v1/documents/verify - Verify document via Henry OCR / Legal Officer
router.post(
  '/verify',
  asyncHandler(async (req: Request, res: Response) => {
    const { id, verifiedBy } = req.body;
    const doc = inMemoryDocuments.find(d => d.id === id || d._id === id);
    if (!doc) {
      return res.status(404).json({ success: false, error: `Document ${id} not found.` });
    }
    doc.status = 'VERIFIED';
    doc.ocrStatus = 'COMPLETED';
    doc.verifiedBy = verifiedBy || 'Henry OCR & Compliance Gate';
    doc.verifiedAt = new Date().toISOString().split('T')[0];
    res.json({ success: true, data: doc });
  })
);

export default router;
