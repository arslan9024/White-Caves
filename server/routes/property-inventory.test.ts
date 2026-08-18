/**
 * Property Inventory & Multi-Agent Access API Integration Tests
 * ──────────────────────────────────────────────────────────────
 * Tests inventory initialization, tenancy status lifecycle transitions,
 * and granular agent access control delegations.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

const { mockInventory } = vi.hoisted(() => {
  const inv: any = {
    propertyId: 'prop-inv-001',
    status: 'available',
    isAvailable: true,
    visibleTo: { mary: true },
    assignedAgents: [],
    notes: '',
  };
  inv.save = vi.fn().mockResolvedValue(inv);
  return { mockInventory: inv };
});

vi.mock('../models/PropertyInventory.js', () => {
  const MockModel: any = function (data: any) {
    return { ...mockInventory, ...data, save: vi.fn().mockResolvedValue({ ...mockInventory, ...data }) };
  };
  MockModel.findOne = vi.fn().mockImplementation(({ propertyId }: { propertyId: string }) => {
    if (propertyId === 'prop-inv-001') return Promise.resolve(mockInventory);
    return Promise.resolve(null);
  });
  return { default: MockModel };
});

vi.mock('../models/InventoryProperty.js', () => ({ default: {} }));
vi.mock('../services/FilterService.js', () => ({ default: {} }));
vi.mock('../services/AnalyticsService.js', () => ({ default: {} }));

import propertyInventoryRouter from './property-inventory.js';

describe('Property Inventory API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/property-inventory', propertyInventoryRouter);
  });

  describe('POST /api/property-inventory/:propertyId/inventory', () => {
    it('creates or retrieves property inventory record', async () => {
      const res = await request(app).post('/api/property-inventory/prop-inv-001/inventory');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.propertyId).toBe('prop-inv-001');
    });
  });

  describe('PATCH /api/property-inventory/:propertyId/status', () => {
    it('updates property tenancy status lifecycle', async () => {
      const res = await request(app)
        .patch('/api/property-inventory/prop-inv-001/status')
        .send({
          status: 'ready_for_leasing',
          notes: 'Snagging completed and cleaned',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('ready_for_leasing');
    });

    it('rejects invalid status enum with 400', async () => {
      const res = await request(app)
        .patch('/api/property-inventory/prop-inv-001/status')
        .send({ status: 'unknown_status' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid status');
    });
  });

  describe('POST /api/property-inventory/:propertyId/grant-access', () => {
    it('grants delegated property access to an agent', async () => {
      const res = await request(app)
        .post('/api/property-inventory/prop-inv-001/grant-access')
        .send({
          agentId: 'agent-101',
          accessLevel: 'full_edit',
          grantedBy: 'manager-001',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Property access granted');
    });
  });
});
