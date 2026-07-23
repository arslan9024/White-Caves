import { beforeEach, describe, expect, it, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

const { getExchangeRates, convert, isSupportedCurrency } = vi.hoisted(() => ({
  getExchangeRates: vi.fn(() => ({
    base: 'AED',
    rates: { AED: 1, USD: 3.6725, EUR: 3.9841, GBP: 4.6189, INR: 0.04376 },
    updatedAt: '2026-05-25T00:00:00.000Z',
    source: 'live',
  })),
  convert: vi.fn((amount: number) => Math.round((amount / 3.6725) * 100) / 100),
  isSupportedCurrency: vi.fn((code: string) =>
    ['AED', 'USD', 'EUR', 'GBP', 'INR'].includes(code)
  ),
}));

vi.mock('../services/currencyService.js', () => ({
  getExchangeRates,
  convert,
  isSupportedCurrency,
}));

vi.mock('../middleware/errorHandler.js', () => ({
  AppError: class extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
    }
  },
  asyncHandler: (fn: any) => (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next),
}));

import mortgageRoutes from '../routes/mortgage.js';

const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/mortgage', mortgageRoutes);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
};

describe('Mortgage routes — /api/mortgage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calculates mortgage in AED', async () => {
    const res = await request(createApp()).post('/api/mortgage/calculate').send({
      propertyPrice: 2_000_000,
      downPaymentPct: 20,
      interestRatePct: 4,
      loanTermYears: 25,
      currency: 'AED',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.currency).toBe('AED');
    expect(res.body.data.aed.monthlyPayment).toBeGreaterThan(0);
  });

  it('returns 400 for unsupported currency', async () => {
    const res = await request(createApp()).post('/api/mortgage/calculate').send({
      propertyPrice: 2_000_000,
      downPaymentPct: 20,
      interestRatePct: 4,
      loanTermYears: 25,
      currency: 'JPY',
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/unsupported currency/i);
  });

  it('uses conversion for non-AED currency', async () => {
    const res = await request(createApp()).post('/api/mortgage/calculate').send({
      propertyPrice: 2_000_000,
      downPaymentPct: 20,
      interestRatePct: 4,
      loanTermYears: 25,
      currency: 'USD',
    });

    expect(res.status).toBe(200);
    expect(res.body.data.currency).toBe('USD');
    expect(convert).toHaveBeenCalled();
  });
});
