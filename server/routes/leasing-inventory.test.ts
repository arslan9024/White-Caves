/**
 * Leasing Inventory API Integration Tests
 * ─────────────────────────────────────────
 * Tests leasing lifecycle endpoints: inventory listing, property intake,
 * stage transitions, contract signing, Ejari registration, and handover.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

vi.mock('../controllers/inventoryController.js', () => ({
  getLeasingInventory: vi.fn((_req, res) =>
    res.json({ success: true, properties: [{ id: 'lease-prop-1', status: 'available' }] })
  ),
  createLeasingProperty: vi.fn((_req, res) =>
    res.status(201).json({ success: true, property: { id: 'lease-prop-new', title: 'Marina Apt' } })
  ),
  uploadPropertyDocument: vi.fn((_req, res) =>
    res.json({ success: true, message: 'Document uploaded' })
  ),
  transitionPropertyStage: vi.fn((_req, res) =>
    res.json({ success: true, stage: 'contract_signed' })
  ),
  signContract: vi.fn((_req, res) =>
    res.json({ success: true, status: 'signed' })
  ),
  registerEjari: vi.fn((_req, res) =>
    res.json({ success: true, ejariNumber: 'EJARI-2026-88899' })
  ),
  completeHandover: vi.fn((_req, res) =>
    res.json({ success: true, status: 'handed_over' })
  ),
}));

vi.mock('../middleware/validation.js', () => ({
  validatePropertyDetails: [(_req: any, _res: any, next: any) => next()],
  handleValidationErrors: (_req: any, _res: any, next: any) => next(),
}));

import leasingInventoryRouter from './leasing-inventory.js';

describe('Leasing Inventory API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/leasing-inventory', leasingInventoryRouter);
  });

  describe('GET /api/leasing-inventory', () => {
    it('returns list of leasing properties', async () => {
      const res = await request(app).get('/api/leasing-inventory');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.properties)).toBe(true);
    });
  });

  describe('POST /api/leasing-inventory', () => {
    it('creates a new leasing property', async () => {
      const res = await request(app)
        .post('/api/leasing-inventory')
        .send({ title: 'Marina Apt', price: 120000 });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.property.id).toBe('lease-prop-new');
    });
  });

  describe('PATCH /api/leasing-inventory/:id/stage', () => {
    it('transitions property leasing stage', async () => {
      const res = await request(app)
        .patch('/api/leasing-inventory/lease-prop-1/stage')
        .send({ stage: 'contract_signed' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.stage).toBe('contract_signed');
    });
  });

  describe('POST /api/leasing-inventory/:id/ejari', () => {
    it('registers Ejari and returns official registration number', async () => {
      const res = await request(app)
        .post('/api/leasing-inventory/lease-prop-1/ejari')
        .send({ depositAmount: 10000 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.ejariNumber).toBe('EJARI-2026-88899');
    });
  });

  describe('POST /api/leasing-inventory/:id/handover', () => {
    it('completes key handover workflow', async () => {
      const res = await request(app)
        .post('/api/leasing-inventory/lease-prop-1/handover')
        .send({ keysReceived: true });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.status).toBe('handed_over');
    });
  });
});
