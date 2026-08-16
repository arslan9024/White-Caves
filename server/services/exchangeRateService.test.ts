import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../utils/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import {
  getExchangeRates,
  convertCurrency,
  clearRateCache,
} from './exchangeRateService.js';

describe('ExchangeRate Service — Wave 40 (W40-005)', () => {
  beforeEach(() => {
    clearRateCache();
    vi.clearAllMocks();
  });

  describe('getExchangeRates', () => {
    it('returns fallback exchange rates when no API key present', async () => {
      const { rates, source } = await getExchangeRates();

      expect(source).toBe('fallback');
      expect(rates.AED).toBe(1);
      expect(rates.USD).toBeCloseTo(0.2723, 3);
    });
  });

  describe('convertCurrency', () => {
    it('returns exact amount when converting same currency', async () => {
      const res = await convertCurrency(1000, 'AED', 'AED');

      expect(res.convertedAmount).toBe(1000);
      expect(res.rate).toBe(1);
    });

    it('converts USD to AED accurately using exchange rates', async () => {
      const res = await convertCurrency(100, 'USD', 'AED');

      expect(res.convertedAmount).toBeGreaterThan(360);
      expect(res.convertedAmount).toBeLessThan(375);
    });

    it('converts AED to EUR accurately', async () => {
      const res = await convertCurrency(1000, 'AED', 'EUR');

      expect(res.convertedAmount).toBeGreaterThan(240);
      expect(res.convertedAmount).toBeLessThan(260);
    });
  });
});
