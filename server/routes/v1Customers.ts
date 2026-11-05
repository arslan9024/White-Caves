/**
 * White Caves Real Estate LLC - V1 Customers REST API Router
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Backend Route)
 * Single Purpose File Law: < 350 lines
 */

import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { CANONICAL_CUSTOMERS } from '../../src/components/crm/CustomerManager/CustomerManager.data.js';

const router = Router();
let inMemoryCustomers = [...CANONICAL_CUSTOMERS];

// GET /api/v1/customers - List all customers/leads
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { type, search } = req.query;
    let result = [...inMemoryCustomers];

    if (type && typeof type === 'string' && type !== 'ALL') {
      result = result.filter(c => c.customerType === type);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      result = result.filter(
        c =>
          c.fullName.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.customerCode.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: result.length, data: result });
  })
);

// GET /api/v1/customers/:id - Get single customer
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const customer = inMemoryCustomers.find(
      c => c.id === id || c._id === id || c.customerCode === id
    );
    if (!customer) {
      return res.status(404).json({ success: false, error: `Customer with ID ${id} not found.` });
    }
    res.json({ success: true, data: customer });
  })
);

// POST /api/v1/customers - Register new customer
router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const body = req.body;
    if (!body.fullName || !body.email) {
      return res
        .status(400)
        .json({ success: false, error: 'Customer fullName and email are required.' });
    }

    const newCustomer = {
      id: `CUST-${String(inMemoryCustomers.length + 1).padStart(3, '0')}`,
      _id: `cust-${String(inMemoryCustomers.length + 1).padStart(3, '0')}`,
      customerCode:
        body.customerCode || `WC-CUST-${String(inMemoryCustomers.length + 1).padStart(3, '0')}`,
      fullName: body.fullName,
      email: body.email,
      phone: body.phone || '+971 50 000 0000',
      customerType: body.customerType || 'LEAD',
      source: body.source || 'WHATSAPP',
      currentStep: 1,
      stepName: 'LEAD_CAPTURE',
      preferredCommunity: body.preferredCommunity || 'DAMAC Hills 2',
      budgetAED: Number(body.budgetAED) || 150000,
      assignedAgentId: body.assignedAgentId || 'EMP-001',
      assignedAgentName: body.assignedAgentName || 'Arslan Malik',
      kycVerified: false,
      createdAt: new Date().toISOString().split('T')[0],
      interactions: [],
    };

    inMemoryCustomers.unshift(newCustomer);
    res.status(201).json({ success: true, data: newCustomer });
  })
);

// POST /api/v1/customers/:id/step - Advance transaction workflow step
router.post(
  '/:id/step',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nextStep, stepName } = req.body;
    const customer = inMemoryCustomers.find(c => c.id === id || c._id === id);
    if (!customer) {
      return res.status(404).json({ success: false, error: `Customer ${id} not found.` });
    }
    customer.currentStep = Number(nextStep) || customer.currentStep + 1;
    if (stepName) customer.stepName = stepName;
    res.json({ success: true, data: customer });
  })
);

// POST /api/v1/customers/:id/interactions - Add touchpoint interaction
router.post(
  '/:id/interactions',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { channel, notes, agentName } = req.body;
    const customer = inMemoryCustomers.find(c => c.id === id || c._id === id);
    if (!customer) {
      return res.status(404).json({ success: false, error: `Customer ${id} not found.` });
    }
    const interaction = {
      id: `int-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      channel: channel || 'WHATSAPP',
      notes: notes || 'Touchpoint logged',
      agentName: agentName || 'Arslan Malik',
    };
    customer.interactions.unshift(interaction);
    res.json({ success: true, data: customer });
  })
);

export default router;
