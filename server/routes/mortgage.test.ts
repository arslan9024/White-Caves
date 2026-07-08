import { beforeEach, describe, expect, it, vi } from 'vitest';
import express, { type Express } from 'express';
import request from 'supertest';

// Hoisted mocks for import-time interception
const { mockCurrencyService } = vi.hoisted(() => {
  const mockCurrencyService = {
    getExchangeRates: vi.fn(() => ({
      base: 'AED',
      rates: {
        AED: 1,
        USD: 3.6725,
        EUR: 3.9841,
        GBP: 4.6189,
        INR: 0.04376,
      },
      updatedAt: '2026-05-25T00:00:00.000Z',
      source: 'live',
    })),
    convert: vi.fn((amount: number, from: string, to: string) => {
      const rates: Record<string, number> = {
        AED: 1,
        USD: 3.6725,
        EUR: 3.9841,
        GBP: 4.6189,
        INR: 0.04376,
      };
      if (from === to) return amount;
      const inAED = from === 'AED' ? amount : amount * rates[from];
      return to === 'AED' ? inAED : Math.round((inAED / rates[to]) * 100) / 100;
    }),
    isSupportedCurrency: vi.fn((code: string) => {
      return ['AED', 'USD', 'EUR', 'GBP', 'INR'].includes(code);
    }),
  };
  return { mockCurrencyService };
});

vi.mock('../services/currencyService.js', () => ({
  getExchangeRates: mockCurrencyService.getExchangeRates,
  convert: mockCurrencyService.convert,
  isSupportedCurrency: mockCurrencyService.isSupportedCurrency,
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

import mortgageRouter from '../routes/mortgage.js';

function createApp(): Express {
  const app = express();
  app.use(express.json());
  app.use('/api/mortgage', mortgageRouter);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

describe('Mortgage Routes — /api/mortgage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCurrencyService.getExchangeRates.mockClear();
    mockCurrencyService.convert.mockClear();
    mockCurrencyService.isSupportedCurrency.mockClear();
  });

  describe('POST /calculate', () => {
    // ===== BASIC CALCULATIONS (5 tests) =====
    describe('Basic Calculations', () => {
      it('calculates mortgage with valid inputs', async () => {
        const res = await request(createApp()).post('/api/mortgage/calculate').send({
          propertyPrice: 2000000,
          downPaymentPct: 20,
          interestRatePct: 4,
          loanTermYears: 25,
        });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('aed');
        expect(res.body.data.aed.propertyPrice).toBe(2000000);
        expect(res.body.data.aed.downPaymentAmount).toBe(400000);
        expect(res.body.data.aed.loanAmount).toBe(1600000);
        expect(res.body.data.aed.monthlyPayment).toBeGreaterThan(0);
      });

      it('defaults to AED currency when not specified', async () => {
        const res = await request(createApp()).post('/api/mortgage/calculate').send({
          propertyPrice: 1000000,
          downPaymentPct: 30,
          interestRatePct: 3.5,
          loanTermYears: 20,
        });

        expect(res.status).toBe(200);
        expect(res.body.data.currency).toBe('AED');
        expect(res.body.data.aed).toBeDefined();
      });

      it('handles small property prices', async () => {
        const res = await request(createApp()).post('/api/mortgage/calculate').send({
          propertyPrice: 100000,
          downPaymentPct: 10,
          interestRatePct: 2,
          loanTermYears: 10,
        });

        expect(res.status).toBe(200);
        expect(res.body.data.aed.loanAmount).toBe(90000);
      });

      it('handles large property prices', async () => {
        const res = await request(createApp()).post('/api/mortgage/calculate').send({
          propertyPrice: 10000000,
          downPaymentPct: 50,
          interestRatePct: 4.5,
          loanTermYears: 30,
        });

        expect(res.status).toBe(200);
        expect(res.body.data.aed.propertyPrice).toBe(10000000);
        expect(res.body.data.aed.loanAmount).toBe(5000000);
      });

      it('handles zero interest rate (interest-free loan)', async () => {
        const res = await request(createApp()).post('/api/mortgage/calculate').send({
          propertyPrice: 1000000,
          downPaymentPct: 0,
          interestRatePct: 0,
          loanTermYears: 10,
        });

        expect(res.status).toBe(200);
        expect(res.body.data.aed.totalInterest).toBe(0);
        expect(res.body.data.aed.monthlyPayment).toBe(Math.round((1000000 / 120) * 100) / 100);
      });
    });

    // ===== DOWN PAYMENT VARIATIONS (5 tests) =====
    describe('Down Payment Variations', () => {
      it('handles 0% down payment', async () => {
        const res = await request(createApp()).post('/api/mortgage/calculate').send({
          propertyPrice: 2000000,
          downPaymentPct: 0,
          interestRatePct: 4,
          loanTermYears: 25,
        });

        expect(res.status).toBe(200);
        expect(res.body.data.aed.downPaymentAmount).toBe(0);
        expect(res.body.data.aed.loanAmount).toBe(2000000);
      });

      it('handles 100% down payment (all cash)', async () => {
        const res = await request(createApp()).post('/api/mortgage/calculate').send({
          propertyPrice: 2000000,
          downPaymentPct: 100,
          interestRatePct: 4,
          loanTermYears: 25,
        });

        expect(res.status).toBe(200);
        expect(res.body.data.aed.downPaymentAmount).toBe(2000000);
        expect(res.body.data.aed.loanAmount).toBe(0);
        expect(res.body.data.aed.monthlyPayment).toBe(0);
      });

      it('clamps down payment > 100% to 100%', async () => {
        const res = await request(createApp()).post('/api/mortgage/calculate').send({
          propertyPrice: 1000000,
          downPaymentPct: 150,
          interestRatePct: 4,
          loanTermYears: 20,
        });

        expect(res.status).toBe(200);
        expect(res.body.data.aed.downPaymentPct).toBe(100);
        expect(res.body.data.aed.loanAmount).toBe(0);
      });

      it('clamps negative down payment to 0%', async () => {
        const res = await request(createApp()).post('/api/mortgage/calculate').send({
          propertyPrice: 1000000,
          downPaymentPct: -50,
          interestRatePct: 4,
          loanTermYears: 20,
        });

        expect(res.status).toBe(200);
        expect(res.body.data.aed.downPaymentPct).toBe(0);
        expect(res.body.data.aed.downPaymentAmount).toBe(0);
      });

      it('handles fractional down payment percentages', async () => {
        const res = await request(createApp()).post('/api/mortgage/calculate').send({
          propertyPrice: 1000000,
          downPaymentPct: 25.5,
          interestRatePct: 4,
          loanTermYears: 20,
        });

        expect(res.status).toBe(200);
        expect(res.body.data.aed.downPaymentPct).toBe(25.5);
        expect(res.body.data.aed.downPaymentAmount).toBe(255000);
      });
    });

    // ===== LOAN TERM VARIATIONS (4 tests) =====
    describe('Loan Term Variations', () => {
      it('handles 1-year loan term', async () => {
        const res = await request(createApp()).post('/api/mortgage/calculate').send({
          propertyPrice: 1000000,
          downPaymentPct: 20,
          interestRatePct: 4,
          loanTermYears: 1,
        });

        expect(res.status).toBe(200);
        expect(res.body.data.aed.loanTermYears).toBe(1);
        expect(res.body.data.aed.monthlyPayment).toBeGreaterThan(0);
      });

      it('handles 30-year loan term', async () => {
        const res = await request(createApp()).post('/api/mortgage/calculate').send({
          propertyPrice: 3000000,
          downPaymentPct: 20,
          interestRatePct: 4,
          loanTermYears: 30,
        });

        expect(res.status).toBe(200);
        expect(res.body.data.aed.loanTermYears).toBe(30);
      });

      it('handles fractional loan terms (e.g., 25.5 years)', async () => {
        const res = await request(createApp()).post('/api/mortgage/calculate').send({
          propertyPrice: 2000000,
          downPaymentPct: 20,
          interestRatePct: 4,
          loanTermYears: 25.5,
        });

        expect(res.status).toBe(200);
        expect(res.body.data.aed.loanTermYears).toBe(25.5);
      });

      it('clamps zero/negative loan term to 1 year', async () => {
        const res = await request(createApp()).post('/api/mortgage/calculate').send({
          propertyPrice: 1000000,
          downPaymentPct: 20,
          interestRatePct: 4,
          loanTermYears: 0,
        });

        expect(res.status).toBe(200);
        expect(res.body.data.aed.loanTermYears).toBe(1);
      });
    });

    // ===== INTEREST RATE VARIATIONS (4 tests) =====
    describe('Interest Rate Variations', () => {
      it('handles low interest rates (1%)', async () => {
        const res = await request(createApp()).post('/api/mortgage/calculate').send({
          propertyPrice: 2000000,
          downPaymentPct: 20,
          interestRatePct: 1,
          loanTermYears: 25,
        });

        expect(res.status).toBe(200);
        expect(res.body.data.aed.interestRatePct).toBe(1);
        expect(res.body.data.aed.totalInterest).toBeGreaterThan(0);
      });

      it('handles high interest rates (8%)', async () => {
        const res = await request(createApp()).post('/api/mortgage/calculate').send({
          propertyPrice: 2000000,
          downPaymentPct: 20,
          interestRatePct: 8,
          loanTermYears: 25,
        });

        expect(res.status).toBe(200);
        expect(res.body.data.aed.interestRatePct).toBe(8);
      });

      it('clamps negative interest rate to 0%', async () => {
        const res = await request(createApp()).post('/api/mortgage/calculate').send({
          propertyPrice: 1000000,
          downPaymentPct: 20,
          interestRatePct: -2,
          loanTermYears: 20,
        });

        expect(res.status).toBe(200);
        expect(res.body.data.aed.interestRatePct).toBe(0);
      });

      it('handles fractional interest rates (3.75%)', async () => {
        const res = await request(createApp()).post('/api/mortgage/calculate').send({
          propertyPrice: 2000000,
          downPaymentPct: 20,
          interestRatePct: 3.75,
          loanTermYears: 25,
        });

        expect(res.status).toBe(200);
        expect(res.body.data.aed.interestRatePct).toBe(3.75);
      });
    });

    // ===== CURRENCY CONVERSIONS (5 tests) =====
    describe('Currency Conversions', () => {
      it('converts to USD', async () => {
        const res = await request(createApp()).post('/api/mortgage/calculate').send({
          propertyPrice: 3672500,
          downPaymentPct: 20,
          interestRatePct: 4,
          loanTermYears: 25,
          currency: 'USD',
        });

        expect(res.status).toBe(200);
        expect(res.body.data.currency).toBe('USD');
        expect(res.body.data.converted).toBeDefined();
        expect(mockCurrencyService.convert).toHaveBeenCalled();
      });

      it('converts to EUR', async () => {
        const res = await request(createApp()).post('/api/mortgage/calculate').send({
          propertyPrice: 2000000,
          downPaymentPct: 20,
          interestRatePct: 4,
          loanTermYears: 25,
          currency: 'EUR',
        });

        expect(res.status).toBe(200);
        expect(res.body.data.currency).toBe('EUR');
      });

      it('converts to GBP', async () => {
        const res = await request(createApp()).post('/api/mortgage/calculate').send({
          propertyPrice: 2000000,
          downPaymentPct: 20,
          interestRatePct: 4,
          loanTermYears: 25,
          currency: 'GBP',
        });

        expect(res.status).toBe(200);
        expect(res.body.data.currency).toBe('GBP');
      });

      it('converts to INR', async () => {
        const res = await request(createApp()).post('/api/mortgage/calculate').send({
          propertyPrice: 2000000,
          downPaymentPct: 20,
          interestRatePct: 4,
          loanTermYears: 25,
          currency: 'INR',
        });

        expect(res.status).toBe(200);
        expect(res.body.data.currency).toBe('INR');
      });

      it('handles case-insensitive currency codes', async () => {
        const res = await request(createApp()).post('/api/mortgage/calculate').send({
          propertyPrice: 2000000,
          downPaymentPct: 20,
          interestRatePct: 4,
          loanTermYears: 25,
          currency: 'usd',
        });

        expect(res.status).toBe(200);
        expect(res.body.data.currency).toBe('USD');
      });
    });

    // ===== INPUT VALIDATION (4 tests) =====
    describe('Input Validation', () => {
      it('returns 400 for missing propertyPrice', async () => {
        const res = await request(createApp()).post('/api/mortgage/calculate').send({
          downPaymentPct: 20,
          interestRatePct: 4,
          loanTermYears: 25,
        });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/must be numbers/i);
      });

      it('returns 400 for missing downPaymentPct', async () => {
        const res = await request(createApp()).post('/api/mortgage/calculate').send({
          propertyPrice: 2000000,
          interestRatePct: 4,
          loanTermYears: 25,
        });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/must be numbers/i);
      });

      it('returns 400 for non-numeric inputs', async () => {
        const res = await request(createApp()).post('/api/mortgage/calculate').send({
          propertyPrice: 'not-a-number',
          downPaymentPct: 20,
          interestRatePct: 4,
          loanTermYears: 25,
        });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/must be numbers/i);
      });

      it('returns 400 for unsupported currency', async () => {
        const res = await request(createApp()).post('/api/mortgage/calculate').send({
          propertyPrice: 2000000,
          downPaymentPct: 20,
          interestRatePct: 4,
          loanTermYears: 25,
          currency: 'JPY',
        });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/unsupported currency/i);
      });
    });

    // ===== NUMERIC PRECISION & ROUNDING (2 tests) =====
    describe('Numeric Precision & Rounding', () => {
      it('rounds monetary values to 2 decimal places', async () => {
        const res = await request(createApp()).post('/api/mortgage/calculate').send({
          propertyPrice: 1000001.456,
          downPaymentPct: 20,
          interestRatePct: 3.333,
          loanTermYears: 17.5,
        });

        expect(res.status).toBe(200);
        const aed = res.body.data.aed;
        expect(aed.propertyPrice.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
        expect(aed.monthlyPayment.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
        expect(aed.totalPayment.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
      });

      it('includes exchange rate information in response', async () => {
        const res = await request(createApp()).post('/api/mortgage/calculate').send({
          propertyPrice: 2000000,
          downPaymentPct: 20,
          interestRatePct: 4,
          loanTermYears: 25,
          currency: 'USD',
        });

        expect(res.status).toBe(200);
        expect(res.body.data.rates).toBeDefined();
        expect(res.body.data.rates.source).toBe('live');
        expect(res.body.data.rates.updatedAt).toBeDefined();
        expect(res.body.data.rates.aedPerRequestedCurrency).toBeGreaterThan(0);
      });
    });

    // ===== RESPONSE STRUCTURE (1 test) =====
    describe('Response Structure', () => {
      it('returns complete response structure', async () => {
        const res = await request(createApp()).post('/api/mortgage/calculate').send({
          propertyPrice: 2000000,
          downPaymentPct: 20,
          interestRatePct: 4,
          loanTermYears: 25,
          currency: 'AED',
        });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('currency', 'AED');
        expect(res.body.data).toHaveProperty('rates');
        expect(res.body.data).toHaveProperty('aed');
        expect(res.body.data).toHaveProperty('converted');

        const aed = res.body.data.aed;
        expect(aed).toHaveProperty('propertyPrice');
        expect(aed).toHaveProperty('downPaymentPct');
        expect(aed).toHaveProperty('downPaymentAmount');
        expect(aed).toHaveProperty('loanAmount');
        expect(aed).toHaveProperty('monthlyPayment');
        expect(aed).toHaveProperty('totalPayment');
        expect(aed).toHaveProperty('totalInterest');
        expect(aed).toHaveProperty('loanTermYears');
        expect(aed).toHaveProperty('interestRatePct');
      });
    });
  });
});
