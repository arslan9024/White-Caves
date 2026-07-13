/**
 * Currency Routes — Unit Tests
 * Tests /api/currency endpoints: rates, supported, convert, to-aed
 * No database required — currencyService is pure functions.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// ── Mock currencyService ─────────────────────────────────────────────
vi.mock('../services/currencyService.js', () => ({
  getExchangeRates: vi.fn(() => ({
    base: 'AED',
    rates: { AED: 1, USD: 3.6725, EUR: 3.9841, GBP: 4.6189, INR: 0.04376 },
    updatedAt: '2026-01-20T00:00:00Z',
    source: 'static',
  })),
  getSupportedCurrencies: vi.fn(() => [
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', locale: 'en-AE', flag: '🇦🇪' },
    { code: 'USD', name: 'US Dollar', symbol: '$', locale: 'en-US', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', symbol: '€', locale: 'de-DE', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', symbol: '£', locale: 'en-GB', flag: '🇬🇧' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', locale: 'en-IN', flag: '🇮🇳' },
  ]),
  convert: vi.fn((amount: number, from: string, to: string) => {
    if (from === to) return amount;
    if (from === 'USD' && to === 'AED') return Math.round(amount * 3.6725 * 100) / 100;
    if (from === 'AED' && to === 'USD') return Math.round(amount * 0.2723 * 100) / 100;
    return amount * 1.5;
  }),
  convertToAED: vi.fn((amount: number, currency: string) => {
    if (currency === 'AED') return amount;
    return Math.round(amount * 3.6725 * 100) / 100;
  }),
  formatWithAedEquivalent: vi.fn((amount: number, currency: string) =>
    currency === 'AED' ? `AED ${amount}` : `USD ${amount} (≈ AED ${Math.round(amount * 3.6725)})`
  ),
  isSupportedCurrency: vi.fn((code: string) => ['AED', 'USD', 'EUR', 'GBP', 'INR'].includes(code)),
}));

import currencyRoutes from './currency.js';

// ── Test app ─────────────────────────────────────────────────────────
function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/currency', currencyRoutes);
  return app;
}

// ═════════════════════════════════════════════════════════════════════

describe('Currency Routes — /api/currency', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── GET /rates ───────────────────────────────────────────────────
  describe('GET /api/currency/rates', () => {
    it('returns exchange rates with success', async () => {
      const res = await request(createApp()).get('/api/currency/rates');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('base', 'AED');
      expect(res.body.data).toHaveProperty('rates');
    });

    it('rates include all 5 supported currencies', async () => {
      const res = await request(createApp()).get('/api/currency/rates');
      const { rates } = res.body.data;
      expect(rates).toHaveProperty('AED');
      expect(rates).toHaveProperty('USD');
      expect(rates).toHaveProperty('EUR');
      expect(rates).toHaveProperty('GBP');
      expect(rates).toHaveProperty('INR');
    });
  });

  // ── GET /supported ───────────────────────────────────────────────
  describe('GET /api/currency/supported', () => {
    it('returns a list of supported currencies', async () => {
      const res = await request(createApp()).get('/api/currency/supported');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data).toHaveLength(5);
    });

    it('each currency has required fields', async () => {
      const res = await request(createApp()).get('/api/currency/supported');
      for (const c of res.body.data) {
        expect(c).toHaveProperty('code');
        expect(c).toHaveProperty('name');
        expect(c).toHaveProperty('symbol');
      }
    });
  });

  // ── GET /convert ─────────────────────────────────────────────────
  describe('GET /api/currency/convert', () => {
    it('converts USD to AED successfully', async () => {
      const res = await request(createApp()).get(
        '/api/currency/convert?amount=1000&from=USD&to=AED'
      );
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.original.amount).toBe(1000);
      expect(res.body.data.original.currency).toBe('USD');
      expect(res.body.data.converted.currency).toBe('AED');
    });

    it('returns 400 when amount is missing', async () => {
      const res = await request(createApp()).get('/api/currency/convert?from=USD&to=AED');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('returns 400 when from is missing', async () => {
      const res = await request(createApp()).get('/api/currency/convert?amount=1000&to=AED');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('returns 400 when to is missing', async () => {
      const res = await request(createApp()).get('/api/currency/convert?amount=1000&from=USD');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('returns 400 for invalid (NaN) amount', async () => {
      const res = await request(createApp()).get(
        '/api/currency/convert?amount=abc&from=USD&to=AED'
      );
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/invalid amount/i);
    });

    it('returns 400 for unsupported from currency', async () => {
      const res = await request(createApp()).get(
        '/api/currency/convert?amount=1000&from=JPY&to=AED'
      );
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('returns 400 for unsupported to currency', async () => {
      const res = await request(createApp()).get(
        '/api/currency/convert?amount=1000&from=USD&to=JPY'
      );
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('accepts lowercase currency codes and converts them', async () => {
      const res = await request(createApp()).get(
        '/api/currency/convert?amount=1000&from=usd&to=aed'
      );
      // Route uppercases before checking
      expect(res.status).toBe(200);
    });

    it('AED to AED returns same amount', async () => {
      const res = await request(createApp()).get(
        '/api/currency/convert?amount=5000&from=AED&to=AED'
      );
      expect(res.status).toBe(200);
      expect(res.body.data.converted.amount).toBe(5000);
    });
  });

  // ── GET /to-aed ──────────────────────────────────────────────────
  describe('GET /api/currency/to-aed', () => {
    it('converts USD amount to AED', async () => {
      const res = await request(createApp()).get('/api/currency/to-aed?amount=500000&currency=USD');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('aedAmount');
      expect(res.body.data).toHaveProperty('display');
    });

    it('returns 400 when amount is missing', async () => {
      const res = await request(createApp()).get('/api/currency/to-aed?currency=USD');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('returns 400 when currency is missing', async () => {
      const res = await request(createApp()).get('/api/currency/to-aed?amount=1000');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('returns 400 for invalid amount', async () => {
      const res = await request(createApp()).get('/api/currency/to-aed?amount=xyz&currency=USD');
      expect(res.status).toBe(400);
    });

    it('returns 400 for unsupported currency', async () => {
      const res = await request(createApp()).get('/api/currency/to-aed?amount=1000&currency=JPY');
      expect(res.status).toBe(400);
    });

    it('AED to AED returns same amount', async () => {
      const res = await request(createApp()).get('/api/currency/to-aed?amount=10000&currency=AED');
      expect(res.status).toBe(200);
      expect(res.body.data.aedAmount).toBe(10000);
    });
  });
});
