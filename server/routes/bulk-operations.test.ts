/**
 * Bulk Operations API Integration Tests
 * ──────────────────────────────────────
 * Tests batch property updates, multi-property price changes, furnishing updates,
 * tag assignments, and input validation.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

vi.mock('../services/BulkOperationsService.js', () => ({
  default: {
    updateStatuses: vi.fn().mockResolvedValue({
      updatedCount: 3,
      successIds: ['p1', 'p2', 'p3'],
    }),
    updatePrices: vi.fn().mockResolvedValue({
      updatedCount: 2,
      appliedOperation: 'percentage_increase',
    }),
    updateFurnishing: vi.fn().mockResolvedValue({
      updatedCount: 3,
      furnishing: 'furnished',
    }),
    updateTags: vi.fn().mockResolvedValue({
      updatedCount: 3,
      tagsAdded: ['luxury', 'sea_view'],
    }),
  },
}));

import bulkOperationsRouter from './bulk-operations.js';

describe('Bulk Operations API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/bulk', bulkOperationsRouter);
  });

  describe('POST /api/bulk/status-update', () => {
    it('updates status for multiple properties in a single batch', async () => {
      const res = await request(app)
        .post('/api/bulk/status-update')
        .send({
          propertyIds: ['p1', 'p2', 'p3'],
          newStatus: 'available',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.updatedCount).toBe(3);
    });

    it('rejects empty propertyIds array with 400', async () => {
      const res = await request(app)
        .post('/api/bulk/status-update')
        .send({
          propertyIds: [],
          newStatus: 'available',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/bulk/price-update', () => {
    it('applies batch price adjustments', async () => {
      const res = await request(app)
        .post('/api/bulk/price-update')
        .send({
          propertyIds: ['p1', 'p2'],
          priceUpdate: { type: 'percentage', value: 5 },
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.updatedCount).toBe(2);
    });
  });

  describe('POST /api/bulk/furnishing-update', () => {
    it('updates furnishing state for selected properties', async () => {
      const res = await request(app)
        .post('/api/bulk/furnishing-update')
        .send({
          propertyIds: ['p1', 'p2', 'p3'],
          furnishing: 'furnished',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.furnishing).toBe('furnished');
    });
  });

  describe('POST /api/bulk/tags-update', () => {
    it('adds batch tags to properties', async () => {
      const res = await request(app)
        .post('/api/bulk/tags-update')
        .send({
          propertyIds: ['p1', 'p2', 'p3'],
          tags: ['luxury', 'sea_view'],
          operation: 'add',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.tagsAdded).toContain('luxury');
    });
  });
});
