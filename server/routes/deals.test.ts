/**
 * Deals API Integration Tests
 * ────────────────────────────
 * Tests tenancy and sales deals endpoints, filtering, creation, and status updates.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

const { mockTenancyDeals, mockSalesDeals } = vi.hoisted(() => {
  const tenancyItem: any = {
    _id: 'deal-001',
    dealNumber: 'TD-2026-001',
    property: { name: 'DAMAC Hills 2 Villa 401', propertyId: 'prop-001' },
    tenant: { name: 'Elena Rostova', email: 'elena@example.com' },
    landlord: { name: 'Tariq Al-Mansoor', email: 'tariq@example.com' },
    rentAmountAED: 180000,
    status: 'ACTIVE',
    timeline: [],
    createdAt: new Date().toISOString(),
  };
  tenancyItem.save = vi.fn().mockResolvedValue(tenancyItem);

  const salesItem: any = {
    _id: 'deal-002',
    dealNumber: 'SD-2026-001',
    property: { name: 'Palm Jumeirah Penthouse', propertyId: 'prop-002' },
    buyer: { name: 'Sovereign Fund A', email: 'fund@example.com' },
    seller: { name: 'White Caves Premier', email: 'seller@example.com' },
    salePriceAED: 12500000,
    status: 'UNDER_MOU',
    timeline: [],
    createdAt: new Date().toISOString(),
  };
  salesItem.save = vi.fn().mockResolvedValue(salesItem);

  return {
    mockTenancyDeals: [tenancyItem],
    mockSalesDeals: [salesItem],
  };
});

vi.mock('../models/TenancyDeal.js', () => {
  const MockModel: any = function (data: any) {
    return {
      ...data,
      save: vi.fn().mockResolvedValue({ _id: 'deal-new-01', ...data }),
    };
  };

  MockModel.find = vi.fn().mockReturnValue({
    sort: vi.fn().mockReturnValue({
      skip: vi.fn().mockReturnValue({
        limit: vi.fn().mockResolvedValue(mockTenancyDeals),
      }),
    }),
  });

  MockModel.countDocuments = vi.fn().mockResolvedValue(1);

  MockModel.findOne = vi.fn().mockImplementation(({ dealNumber }: { dealNumber: string }) => {
    if (dealNumber === 'TD-2026-001') {
      return Promise.resolve(mockTenancyDeals[0]);
    }
    return Promise.resolve(null);
  });

  MockModel.generateDealNumber = vi.fn().mockResolvedValue('TD-2026-002');

  return { default: MockModel };
});

vi.mock('../models/SalesDeal.js', () => {
  const MockModel: any = function (data: any) {
    return {
      ...data,
      save: vi.fn().mockResolvedValue({ _id: 'deal-sales-new', ...data }),
    };
  };

  MockModel.find = vi.fn().mockReturnValue({
    sort: vi.fn().mockReturnValue({
      skip: vi.fn().mockReturnValue({
        limit: vi.fn().mockResolvedValue(mockSalesDeals),
      }),
    }),
  });

  MockModel.countDocuments = vi.fn().mockResolvedValue(1);

  MockModel.findOne = vi.fn().mockImplementation(({ dealNumber }: { dealNumber: string }) => {
    if (dealNumber === 'SD-2026-001') {
      return Promise.resolve(mockSalesDeals[0]);
    }
    return Promise.resolve(null);
  });

  MockModel.generateDealNumber = vi.fn().mockResolvedValue('SD-2026-002');

  return { default: MockModel };
});

vi.mock('../models/DemoData.js', () => ({
  default: {
    find: vi.fn().mockResolvedValue([]),
    countDocuments: vi.fn().mockResolvedValue(0),
  },
}));

vi.mock('../seeds/demoDataSeeder.js', () => ({
  seedAllDemoData: vi.fn().mockResolvedValue({ success: true }),
}));

import dealsRouter from './deals.js';

describe('Deals API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/deals', dealsRouter);
  });

  describe('GET /api/deals/tenancy', () => {
    it('returns paginated tenancy deals', async () => {
      const res = await request(app).get('/api/deals/tenancy?page=1&limit=10');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0].dealNumber).toBe('TD-2026-001');
      expect(res.body.pagination).toBeDefined();
    });
  });

  describe('GET /api/deals/tenancy/:dealNumber', () => {
    it('returns a single tenancy deal by dealNumber', async () => {
      const res = await request(app).get('/api/deals/tenancy/TD-2026-001');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.dealNumber).toBe('TD-2026-001');
      expect(res.body.data.rentAmountAED).toBe(180000);
    });

    it('returns 404 when dealNumber does not exist', async () => {
      const res = await request(app).get('/api/deals/tenancy/TD-INVALID-999');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Deal not found');
    });
  });

  describe('POST /api/deals/tenancy', () => {
    it('creates a new tenancy deal and returns 201', async () => {
      const payload = {
        property: { name: 'DAMAC Hills 2 Villa 502', propertyId: 'prop-502' },
        tenant: { name: 'Ahmad Al-Razi', email: 'ahmad@example.com' },
        rentAmountAED: 195000,
      };

      const res = await request(app)
        .post('/api/deals/tenancy')
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.dealNumber).toBe('TD-2026-002');
    });
  });

  describe('PUT /api/deals/tenancy/:dealNumber/status', () => {
    it('updates status of tenancy deal', async () => {
      const res = await request(app)
        .put('/api/deals/tenancy/TD-2026-001/status')
        .send({ status: 'COMPLETED' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('COMPLETED');
    });
  });

  describe('GET /api/deals/sales', () => {
    it('returns paginated sales deals', async () => {
      const res = await request(app).get('/api/deals/sales?page=1&limit=10');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0].dealNumber).toBe('SD-2026-001');
    });
  });

  describe('GET /api/deals/sales/:dealNumber', () => {
    it('returns a single sales deal by dealNumber', async () => {
      const res = await request(app).get('/api/deals/sales/SD-2026-001');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.dealNumber).toBe('SD-2026-001');
      expect(res.body.data.salePriceAED).toBe(12500000);
    });
  });

  describe('POST /api/deals/sales', () => {
    it('creates a new sales deal and returns 201', async () => {
      const payload = {
        property: { name: 'Emirates Hills Mansion', propertyId: 'prop-777' },
        buyer: { name: 'VIP Investor Group', email: 'investor@example.com' },
        salePriceAED: 45000000,
      };

      const res = await request(app)
        .post('/api/deals/sales')
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.dealNumber).toBe('SD-2026-002');
    });
  });
});
