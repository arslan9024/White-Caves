import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// ── Hoisted mocks ──────────────────────────────────────────────────────────
const {
  mockGetOverduePayments,
  mockGetUpcomingPayments,
  mockGetContractSummary,
  mockFindById,
  mockCreate,
  mockFindByIdAndUpdate,
} = vi.hoisted(() => ({
  mockGetOverduePayments: vi.fn(),
  mockGetUpcomingPayments: vi.fn(),
  mockGetContractSummary: vi.fn(),
  mockFindById: vi.fn(),
  mockCreate: vi.fn(),
  mockFindByIdAndUpdate: vi.fn(),
}));

vi.mock('../models/RentPayment.js', () => ({
  default: {
    getOverduePayments: mockGetOverduePayments,
    getUpcomingPayments: mockGetUpcomingPayments,
    getContractSummary: mockGetContractSummary,
    findById: mockFindById,
    create: mockCreate,
    findByIdAndUpdate: mockFindByIdAndUpdate,
  },
}));

import rentPaymentsRouter from './rent-payments.js';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/rent-payments', rentPaymentsRouter);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

// ── GET /api/rent-payments/overdue ────────────────────────────────────────
describe('GET /api/rent-payments/overdue', () => {
  const app = createApp();

  beforeEach(() => vi.clearAllMocks());

  it('returns overdue payments with count', async () => {
    const payments = [
      { _id: 'pay-001', tenantId: 't-1', amount: 5000, status: 'overdue', dueDate: '2026-01-01' },
      { _id: 'pay-002', tenantId: 't-2', amount: 8000, status: 'overdue', dueDate: '2026-01-05' },
    ];
    mockGetOverduePayments.mockResolvedValue(payments);

    const res = await request(app).get('/api/rent-payments/overdue');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.payments).toHaveLength(2);
    expect(res.body.count).toBe(2);
  });

  it('returns empty array when no payments are overdue', async () => {
    mockGetOverduePayments.mockResolvedValue([]);

    const res = await request(app).get('/api/rent-payments/overdue');

    expect(res.status).toBe(200);
    expect(res.body.payments).toHaveLength(0);
    expect(res.body.count).toBe(0);
  });

  it('returns 500 when RentPayment.getOverduePayments throws', async () => {
    mockGetOverduePayments.mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/api/rent-payments/overdue');

    expect(res.status).toBe(500);
  });
});

// ── GET /api/rent-payments/upcoming ──────────────────────────────────────
describe('GET /api/rent-payments/upcoming', () => {
  const app = createApp();

  beforeEach(() => vi.clearAllMocks());

  it('returns upcoming payments within default 30 days', async () => {
    const payments = [
      { _id: 'pay-010', amount: 7000, dueDate: '2026-07-15', status: 'pending' },
    ];
    mockGetUpcomingPayments.mockResolvedValue(payments);

    const res = await request(app).get('/api/rent-payments/upcoming');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockGetUpcomingPayments).toHaveBeenCalledWith(30);
  });

  it('passes custom days query param', async () => {
    mockGetUpcomingPayments.mockResolvedValue([]);

    await request(app).get('/api/rent-payments/upcoming?days=7');

    expect(mockGetUpcomingPayments).toHaveBeenCalledWith(7);
  });
});

// ── GET /api/rent-payments/contract/:contractId/summary ──────────────────
describe('GET /api/rent-payments/contract/:contractId/summary', () => {
  const app = createApp();

  beforeEach(() => vi.clearAllMocks());

  it('returns contract payment summary', async () => {
    mockGetContractSummary.mockResolvedValue({
      total: 120000,
      paid: 60000,
      outstanding: 60000,
      overdueCount: 1,
      payments: [],
    });

    const res = await request(app).get('/api/rent-payments/contract/contract-1/summary');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.total).toBe(120000);
    expect(res.body.overdueCount).toBe(1);
    expect(mockGetContractSummary).toHaveBeenCalledWith('contract-1');
  });
});

// ── GET /api/rent-payments/:id ────────────────────────────────────────────
describe('GET /api/rent-payments/:id', () => {
  const app = createApp();

  beforeEach(() => vi.clearAllMocks());

  it('returns a single payment', async () => {
    mockFindById.mockResolvedValue({ _id: 'pay-001', amount: 5000, status: 'paid' });

    const res = await request(app).get('/api/rent-payments/pay-001');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('returns 404 when payment not found', async () => {
    mockFindById.mockResolvedValue(null);

    const res = await request(app).get('/api/rent-payments/pay-missing');

    expect(res.status).toBe(404);
  });
});

// ── POST /api/rent-payments ────────────────────────────────────────────────
describe('POST /api/rent-payments', () => {
  const app = createApp();

  beforeEach(() => vi.clearAllMocks());

  it('creates a new payment record and returns 201', async () => {
    mockCreate.mockResolvedValue({ _id: 'pay-new', amount: 9000, status: 'pending' });

    const res = await request(app)
      .post('/api/rent-payments')
      .send({ contractId: 'c-1', amount: 9000, dueDate: '2026-08-01', status: 'pending' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.payment._id).toBe('pay-new');
  });

  it('returns 400 when RentPayment.create throws a validation error', async () => {
    mockCreate.mockRejectedValue(new Error('amount is required'));

    const res = await request(app).post('/api/rent-payments').send({});

    expect(res.status).toBe(400);
  });
});
