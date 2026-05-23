import { describe, it, expect } from 'vitest';
import { Config } from './constants';

// ═══════════════════════════════════════════════════════════════════════
describe('config/constants', () => {
  // ── Top-level structure ───────────────────────────────────────────
  describe('Config structure', () => {
    it('exports Config as an object', () => {
      expect(typeof Config).toBe('object');
    });

    it.each([
      'DOMAIN',
      'API_URL',
      'APP_URL',
      'COMPANY',
      'ENDPOINTS',
      'FEATURES',
      'PAGINATION',
      'DLD_FEES',
      'REAL_ESTATE',
      'MORTGAGE',
      'TIMING',
    ])('has key "%s"', (key) => {
      expect(Config).toHaveProperty(key);
    });
  });

  // ── COMPANY ───────────────────────────────────────────────────────
  describe('Config.COMPANY', () => {
    it('has company name', () => {
      expect(Config.COMPANY.NAME).toBe('White Caves Real Estate LLC');
    });

    it('has short name', () => {
      expect(Config.COMPANY.SHORT_NAME).toBe('White Caves');
    });

    it('has phone with UAE country code', () => {
      expect(Config.COMPANY.PHONE).toContain('+971');
    });

    it('has email', () => {
      expect(Config.COMPANY.EMAIL).toContain('@');
    });

    it('has WhatsApp number (digits only)', () => {
      expect(Config.COMPANY.WHATSAPP).toMatch(/^\d+$/);
    });
  });

  // ── ENDPOINTS ─────────────────────────────────────────────────────
  describe('Config.ENDPOINTS', () => {
    it.each([
      ['LEADS', '/api/leads'],
      ['PROPERTIES', '/api/properties'],
      ['AGENTS', '/api/users'],
      ['DASHBOARD', '/api/dashboard/summary'],
      ['HEALTH', '/health'],
    ])('%s = "%s"', (key, value) => {
      expect(Config.ENDPOINTS[key as keyof typeof Config.ENDPOINTS]).toBe(value);
    });
  });

  // ── FEATURES ──────────────────────────────────────────────────────
  describe('Config.FEATURES', () => {
    it('has boolean feature flags', () => {
      expect(typeof Config.FEATURES.WHATSAPP_ENABLED).toBe('boolean');
      expect(typeof Config.FEATURES.STRIPE_ENABLED).toBe('boolean');
      expect(typeof Config.FEATURES.UAE_PASS_ENABLED).toBe('boolean');
      expect(typeof Config.FEATURES.ANALYTICS_ENABLED).toBe('boolean');
    });
  });

  // ── PAGINATION ────────────────────────────────────────────────────
  describe('Config.PAGINATION', () => {
    it('DEFAULT_PAGE_SIZE is 20', () => {
      expect(Config.PAGINATION.DEFAULT_PAGE_SIZE).toBe(20);
    });

    it('MAX_PAGE_SIZE is 100', () => {
      expect(Config.PAGINATION.MAX_PAGE_SIZE).toBe(100);
    });

    it('GRID_PAGE_SIZE is 9', () => {
      expect(Config.PAGINATION.GRID_PAGE_SIZE).toBe(9);
    });

    it('all values are positive numbers', () => {
      for (const val of Object.values(Config.PAGINATION)) {
        expect(typeof val).toBe('number');
        expect(val).toBeGreaterThan(0);
      }
    });
  });

  // ── DLD_FEES ──────────────────────────────────────────────────────
  describe('Config.DLD_FEES (Dubai Land Department)', () => {
    it('TRANSFER_FEE_RATE is 4% (0.04)', () => {
      expect(Config.DLD_FEES.TRANSFER_FEE_RATE).toBe(0.04);
    });

    it('ADMIN_FEE is 580 AED', () => {
      expect(Config.DLD_FEES.ADMIN_FEE).toBe(580);
    });

    it('TRUSTEE_FEE_MORTGAGE is 4200 AED', () => {
      expect(Config.DLD_FEES.TRUSTEE_FEE_MORTGAGE).toBe(4200);
    });

    it('TRUSTEE_FEE_CASH is 2100 AED', () => {
      expect(Config.DLD_FEES.TRUSTEE_FEE_CASH).toBe(2100);
    });

    it('MORTGAGE_REGISTRATION_RATE is 0.25% (0.0025)', () => {
      expect(Config.DLD_FEES.MORTGAGE_REGISTRATION_RATE).toBe(0.0025);
    });

    it('NOC_FEE is 5000 AED', () => {
      expect(Config.DLD_FEES.NOC_FEE).toBe(5000);
    });

    it('VALUATION_FEE is 3000 AED', () => {
      expect(Config.DLD_FEES.VALUATION_FEE).toBe(3000);
    });

    it('all fees are non-negative numbers', () => {
      for (const val of Object.values(Config.DLD_FEES)) {
        expect(typeof val).toBe('number');
        expect(val).toBeGreaterThanOrEqual(0);
      }
    });
  });

  // ── REAL_ESTATE ───────────────────────────────────────────────────
  describe('Config.REAL_ESTATE', () => {
    it('AGENCY_COMMISSION_RATE is 2% (0.02)', () => {
      expect(Config.REAL_ESTATE.AGENCY_COMMISSION_RATE).toBe(0.02);
    });

    it('VAT_RATE is 5% (0.05)', () => {
      expect(Config.REAL_ESTATE.VAT_RATE).toBe(0.05);
    });

    it('CURRENCY is AED', () => {
      expect(Config.REAL_ESTATE.CURRENCY).toBe('AED');
    });

    it('PRICE_RANGE_MIN < PRICE_RANGE_MAX', () => {
      expect(Config.REAL_ESTATE.PRICE_RANGE_MIN).toBeLessThan(Config.REAL_ESTATE.PRICE_RANGE_MAX);
    });

    it('PRICE_STEP is a positive number', () => {
      expect(Config.REAL_ESTATE.PRICE_STEP).toBeGreaterThan(0);
    });
  });

  // ── MORTGAGE ──────────────────────────────────────────────────────
  describe('Config.MORTGAGE', () => {
    it('DEFAULT_DOWN_PAYMENT is 25%', () => {
      expect(Config.MORTGAGE.DEFAULT_DOWN_PAYMENT).toBe(25);
    });

    it('MIN_DOWN_PAYMENT < MAX_DOWN_PAYMENT', () => {
      expect(Config.MORTGAGE.MIN_DOWN_PAYMENT).toBeLessThan(Config.MORTGAGE.MAX_DOWN_PAYMENT);
    });

    it('interest rate range is valid', () => {
      expect(Config.MORTGAGE.MIN_INTEREST_RATE).toBeLessThan(Config.MORTGAGE.MAX_INTEREST_RATE);
      expect(Config.MORTGAGE.DEFAULT_INTEREST_RATE).toBeGreaterThanOrEqual(Config.MORTGAGE.MIN_INTEREST_RATE);
      expect(Config.MORTGAGE.DEFAULT_INTEREST_RATE).toBeLessThanOrEqual(Config.MORTGAGE.MAX_INTEREST_RATE);
    });

    it('MAX_LOAN_TERM is 25 years', () => {
      expect(Config.MORTGAGE.MAX_LOAN_TERM).toBe(25);
    });
  });

  // ── TIMING ────────────────────────────────────────────────────────
  describe('Config.TIMING', () => {
    it('API_TIMEOUT is 30 seconds', () => {
      expect(Config.TIMING.API_TIMEOUT).toBe(30_000);
    });

    it('TOAST_DURATION is 3 seconds', () => {
      expect(Config.TIMING.TOAST_DURATION).toBe(3_000);
    });

    it('all timing values are positive', () => {
      for (const val of Object.values(Config.TIMING)) {
        expect(typeof val).toBe('number');
        expect(val).toBeGreaterThan(0);
      }
    });
  });

  // ── Business logic calculations ───────────────────────────────────
  describe('business logic validation', () => {
    it('DLD total cost for 1M AED property (cash) is calculable', () => {
      const price = 1_000_000;
      const transferFee = price * Config.DLD_FEES.TRANSFER_FEE_RATE;
      const total = transferFee + Config.DLD_FEES.ADMIN_FEE + Config.DLD_FEES.TRUSTEE_FEE_CASH;
      expect(transferFee).toBe(40_000);
      expect(total).toBe(42_680);
    });

    it('agency commission for 5M AED property is 100K AED', () => {
      const price = 5_000_000;
      const commission = price * Config.REAL_ESTATE.AGENCY_COMMISSION_RATE;
      expect(commission).toBe(100_000);
    });

    it('VAT on 100K commission is 5K AED', () => {
      const commission = 100_000;
      const vat = commission * Config.REAL_ESTATE.VAT_RATE;
      expect(vat).toBe(5_000);
    });
  });
});
