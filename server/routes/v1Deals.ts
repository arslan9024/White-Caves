/**
 * White Caves Real Estate LLC - V1 Deals REST API Router
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Backend Route)
 * Single Purpose File Law: < 350 lines
 */

import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { CANONICAL_DEALS } from '../../src/components/crm/DealManager/DealManager.data.js';

const router = Router();
let inMemoryDeals = [...CANONICAL_DEALS];

// GET /api/v1/deals - List all deals with optional filter by status/type
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { status, dealType, search } = req.query;
    let result = [...inMemoryDeals];

    if (status && typeof status === 'string' && status !== 'ALL') {
      result = result.filter(d => d.status === status);
    }
    if (dealType && typeof dealType === 'string' && dealType !== 'ALL') {
      result = result.filter(d => d.dealType === dealType);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      result = result.filter(
        d =>
          d.title.toLowerCase().includes(q) ||
          d.id.toLowerCase().includes(q) ||
          d.dealNumber.toLowerCase().includes(q) ||
          d.clientName.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: result.length, data: result });
  })
);

// GET /api/v1/deals/:id - Get single deal by ID
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deal = inMemoryDeals.find(d => d.id === id || d._id === id || d.dealNumber === id);
    if (!deal) {
      return res.status(404).json({ success: false, error: `Deal with ID ${id} not found.` });
    }
    res.json({ success: true, data: deal });
  })
);

// POST /api/v1/deals - Create a new deal
router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const body = req.body;
    if (!body.title || !body.dealType) {
      return res
        .status(400)
        .json({ success: false, error: 'Deal title and dealType are required.' });
    }

    const newDeal = {
      id: `DEAL-${String(inMemoryDeals.length + 1).padStart(3, '0')}`,
      _id: `deal-${String(inMemoryDeals.length + 1).padStart(3, '0')}`,
      dealNumber: `WC-DL-${String(inMemoryDeals.length + 1).padStart(3, '0')}`,
      title: body.title,
      dealType: body.dealType,
      status: body.status || 'INQUIRY',
      propertyId: body.propertyId || 'REP-001',
      propertyTitle: body.propertyTitle || 'Villa Inventory Unit',
      propertyCommunity: body.propertyCommunity || 'DAMAC Hills 2',
      agentId: body.agentId || 'EMP-001',
      agentName: body.agentName || 'Arslan Malik',
      agentRole: body.agentRole || 'MANAGING_DIRECTOR',
      clientId: body.clientId || 'CUST-001',
      clientName: body.clientName || 'Private Client',
      clientRole: body.clientRole || 'TENANT',
      ownerName: body.ownerName || 'Emaar Asset Holdings',
      valueAED: Number(body.valueAED) || 150000,
      commissionAED: Number(body.commissionAED) || 7500,
      commissionRate: Number(body.commissionRate) || 5,
      pdcSchedule: body.pdcSchedule || [],
      documents: body.documents || [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    inMemoryDeals.unshift(newDeal);
    res.status(201).json({ success: true, data: newDeal });
  })
);

// PATCH /api/v1/deals/:id/status - Advance deal status
router.patch(
  '/:id/status',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const deal = inMemoryDeals.find(d => d.id === id || d._id === id);
    if (!deal) {
      return res.status(404).json({ success: false, error: `Deal ${id} not found.` });
    }
    deal.status = status;
    deal.updatedAt = new Date().toISOString().split('T')[0];
    res.json({ success: true, data: deal });
  })
);

export default router;
