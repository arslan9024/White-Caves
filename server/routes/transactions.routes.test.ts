/**
 * Transactions API Integration Tests
 * ────────────────────────────────────
 * Tests historical market transactions queries, DLD sales metrics, statistical aggregations,
 * single transaction lookups, and CRUD operations.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

const { mockTransaction } = vi.hoisted(() => {
  const trans: any = {
    _id: '507f1f77bcf86cd799439099',
    transactionNumber: 'TX-2026-0099',
    instanceDate: '2026-08-01',
    area: 'Palm Jumeirah',
    project: 'Palm Views East',
    propSubType: 'Apartment',
    transValue: 3500000,
    rooms: '2 B/R',
    isOffplan: 'Ready',
  };
  trans.save = vi.fn().mockResolvedValue(trans);
  return { mockTransaction: trans };
});

const createChain = (result: any) => ({
  sort: vi.fn().mockImplementation(() => createChain(result)),
  skip: vi.fn().mockImplementation(() => createChain(result)),
  limit: vi.fn().mockImplementation(() => createChain(result)),
  lean: vi.fn().mockResolvedValue(result),
  then: (resolve: any) => resolve(result),
  exec: vi.fn().mockResolvedValue(result),
});

vi.mock('../models/Transaction.js', () => {
  const MockModel: any = function (data: any) {
    const item = { ...mockTransaction, ...data };
    item.save = vi.fn().mockResolvedValue(item);
    return item;
  };
  MockModel.find = vi.fn().mockImplementation(() => createChain([mockTransaction]));
  MockModel.countDocuments = vi.fn().mockResolvedValue(1);
  MockModel.aggregate = vi.fn().mockImplementation((pipeline: any[]) => {
    if (pipeline[0]?.$group?.total) {
      return Promise.resolve([{ total: 35000000 }]);
    }
    return Promise.resolve([{ _id: 'Palm Jumeirah', count: 15, avgValue: 4500000 }]);
  });
  MockModel.findById = vi.fn().mockImplementation((id: string) => {
    if (id === '507f1f77bcf86cd799439099') return Promise.resolve(mockTransaction);
    return Promise.resolve(null);
  });
  MockModel.findByIdAndUpdate = vi.fn().mockImplementation((id: string, data: any) => {
    if (id === '507f1f77bcf86cd799439099') return Promise.resolve({ ...mockTransaction, ...data });
    return Promise.resolve(null);
  });
  MockModel.findByIdAndDelete = vi.fn().mockImplementation((id: string) => {
    if (id === '507f1f77bcf86cd799439099') return Promise.resolve(mockTransaction);
    return Promise.resolve(null);
  });
  return { default: MockModel };
});

import transactionsRouter from './transactions.routes.js';

describe('Transactions API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/transactions', transactionsRouter);
  });

  describe('GET /api/transactions', () => {
    it('returns paginated transactions matching filters', async () => {
      const res = await request(app).get('/api/transactions?area=Palm%20Jumeirah&page=1&limit=10');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0].transactionNumber).toBe('TX-2026-0099');
      expect(res.body.pagination.total).toBe(1);
    });
  });

  describe('GET /api/transactions/stats', () => {
    it('returns aggregated transaction statistics', async () => {
      const res = await request(app).get('/api/transactions/stats');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.stats.totalTransactions).toBe(1);
      expect(res.body.stats.totalValue).toBe(35000000);
    });
  });

  describe('GET /api/transactions/:id', () => {
    it('returns single transaction by ID', async () => {
      const res = await request(app).get('/api/transactions/507f1f77bcf86cd799439099');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.area).toBe('Palm Jumeirah');
    });

    it('returns 404 for unknown transaction ID', async () => {
      const res = await request(app).get('/api/transactions/unknown-id');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/transactions', () => {
    it('creates new transaction record', async () => {
      const res = await request(app)
        .post('/api/transactions')
        .send({
          transactionNumber: 'TX-2026-0100',
          area: 'Downtown Dubai',
          transValue: 5000000,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.transactionNumber).toBe('TX-2026-0100');
    });
  });

  describe('DELETE /api/transactions/:id', () => {
    it('deletes transaction record', async () => {
      const res = await request(app).delete('/api/transactions/507f1f77bcf86cd799439099');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
