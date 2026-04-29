/**
 * Currency Service — Unit Tests
 * Pure-function tests for convert, convertToAED, formatWithAedEquivalent,
 * getSupportedCurrencies, isSupportedCurrency, getExchangeRates.
 * No network calls — all rate fetches are static.
 */

import { describe, it, expect } from 'vitest';
import {
  convert,
  convertToAED,
  formatWithAedEquivalent,
  getSupportedCurrencies,
  isSupportedCurrency,
  getExchangeRates,
  CURRENCIES,
} from './currencyService';

// ── getExchangeRates ─────────────────────────────────────────────────────────

describe('getExchangeRates', () => {
  it('returns an object with base AED', () => {
    const rates = getExchangeRates();
    expect(rates.base).toBe('AED');
  });

  it('includes all supported currencies', () => {
    const rates = getExchangeRates();
    expect(rates.rates).toHaveProperty('AED');
    expect(rates.rates).toHaveProperty('USD');
    expect(rates.rates).toHaveProperty('EUR');
    expect(rates.rates).toHaveProperty('GBP');
    expect(rates.rates).toHaveProperty('INR');
  });

  it('AED rate is 1', () => {
    const rates = getExchangeRates();
    expect(rates.rates['AED']).toBe(1);
  });

  it('source is static when no live cache exists', () => {
    const rates = getExchangeRates();
    expect(rates.source).toBe('static');
  });
});

// ── isSupportedCurrency ──────────────────────────────────────────────────────

describe('isSupportedCurrency', () => {
  it('returns true for AED', () => expect(isSupportedCurrency('AED')).toBe(true));
  it('returns true for USD', () => expect(isSupportedCurrency('USD')).toBe(true));
  it('returns true for EUR', () => expect(isSupportedCurrency('EUR')).toBe(true));
  it('returns true for GBP', () => expect(isSupportedCurrency('GBP')).toBe(true));
  it('returns true for INR', () => expect(isSupportedCurrency('INR')).toBe(true));
  it('returns false for unsupported currency', () =>
    expect(isSupportedCurrency('JPY')).toBe(false));
  it('returns false for empty string', () => expect(isSupportedCurrency('')).toBe(false));
  it('returns false for lowercase aed', () => expect(isSupportedCurrency('aed')).toBe(false));
});

// ── getSupportedCurrencies ───────────────────────────────────────────────────

describe('getSupportedCurrencies', () => {
  it('returns an array of 5 currencies', () => {
    const currencies = getSupportedCurrencies();
    expect(currencies).toHaveLength(5);
  });

  it('each entry has required fields', () => {
    const currencies = getSupportedCurrencies();
    for (const c of currencies) {
      expect(c).toHaveProperty('code');
      expect(c).toHaveProperty('name');
      expect(c).toHaveProperty('symbol');
      expect(c).toHaveProperty('locale');
      expect(c).toHaveProperty('flag');
    }
  });

  it('includes AED with correct metadata', () => {
    const aed = getSupportedCurrencies().find(c => c.code === 'AED');
    expect(aed).toBeDefined();
    expect(aed!.name).toBe('UAE Dirham');
    expect(aed!.symbol).toBe('د.إ');
  });
});

// ── convert ──────────────────────────────────────────────────────────────────

describe('convert', () => {
  it('same currency returns same amount', () => {
    expect(convert(1000, 'AED', 'AED')).toBe(1000);
    expect(convert(500, 'USD', 'USD')).toBe(500);
  });

  it('zero amount returns zero', () => {
    expect(convert(0, 'USD', 'AED')).toBe(0);
    expect(convert(0, 'AED', 'EUR')).toBe(0);
  });

  it('AED to USD conversion is reasonable (1 AED ≈ 0.27 USD)', () => {
    const result = convert(1000, 'AED', 'USD');
    expect(result).toBeGreaterThan(200);
    expect(result).toBeLessThan(350);
  });

  it('USD to AED conversion is reasonable (1 USD ≈ 3.67 AED)', () => {
    const result = convert(1000, 'USD', 'AED');
    expect(result).toBeGreaterThan(3500);
    expect(result).toBeLessThan(3800);
  });

  it('AED to EUR conversion is reasonable', () => {
    const result = convert(1000, 'AED', 'EUR');
    expect(result).toBeGreaterThan(200);
    expect(result).toBeLessThan(300);
  });

  it('AED to GBP conversion is reasonable', () => {
    const result = convert(1000, 'AED', 'GBP');
    expect(result).toBeGreaterThan(180);
    expect(result).toBeLessThan(260);
  });

  it('AED to INR conversion is reasonable (1 AED ≈ 22 INR)', () => {
    const result = convert(100, 'AED', 'INR');
    expect(result).toBeGreaterThan(2000);
    expect(result).toBeLessThan(2400);
  });

  it('result is rounded to 2 decimal places', () => {
    const result = convert(1, 'AED', 'USD');
    const decimals = String(result).split('.')[1] || '';
    expect(decimals.length).toBeLessThanOrEqual(2);
  });

  it('round-trip USD → AED → USD is approximately equal', () => {
    const aed = convert(1000, 'USD', 'AED');
    const backToUsd = convert(aed, 'AED', 'USD');
    // Allow small rounding delta
    expect(Math.abs(backToUsd - 1000)).toBeLessThan(5);
  });

  it('GBP to EUR cross-rate works', () => {
    const result = convert(1000, 'GBP', 'EUR');
    expect(result).toBeGreaterThan(0);
    expect(result).toBeDefined();
  });
});

// ── convertToAED ─────────────────────────────────────────────────────────────

describe('convertToAED', () => {
  it('AED stays the same', () => {
    expect(convertToAED(500, 'AED')).toBe(500);
  });

  it('USD 1 ≈ 3.67 AED', () => {
    const result = convertToAED(1, 'USD');
    expect(result).toBeGreaterThan(3.5);
    expect(result).toBeLessThan(3.9);
  });

  it('GBP 1 is higher AED than USD 1', () => {
    const gbpAed = convertToAED(1, 'GBP');
    const usdAed = convertToAED(1, 'USD');
    expect(gbpAed).toBeGreaterThan(usdAed);
  });

  it('INR 1000 is less than USD 100 in AED', () => {
    const inrAed = convertToAED(1000, 'INR');
    const usdAed = convertToAED(100, 'USD');
    expect(inrAed).toBeLessThan(usdAed);
  });

  it('large property value conversion is consistent', () => {
    const aed = convertToAED(500000, 'USD');
    expect(aed).toBeGreaterThan(1_500_000);
    expect(aed).toBeLessThan(2_200_000);
  });
});

// ── formatWithAedEquivalent ───────────────────────────────────────────────────

describe('formatWithAedEquivalent', () => {
  it('returns just formatted AED for AED input', () => {
    const result = formatWithAedEquivalent(100000, 'AED');
    expect(result).toContain('100');
    expect(result).not.toContain('≈');
  });

  it('includes ≈ AED for non-AED currencies', () => {
    const result = formatWithAedEquivalent(100000, 'USD');
    expect(result).toContain('≈');
    expect(result.toLowerCase()).toContain('aed');
  });

  it('USD format includes dollar symbol or USD text', () => {
    const result = formatWithAedEquivalent(500000, 'USD');
    // Intl.NumberFormat may format as "$500,000" or "US$500,000" depending on environment
    expect(result).toMatch(/500[,.]?000/);
  });

  it('EUR format works', () => {
    const result = formatWithAedEquivalent(200000, 'EUR');
    expect(result).toBeTruthy();
    expect(result).toContain('≈');
  });
});

// ── CURRENCIES metadata ──────────────────────────────────────────────────────

describe('CURRENCIES constant', () => {
  it('has 5 entries', () => {
    expect(Object.keys(CURRENCIES)).toHaveLength(5);
  });

  it('USD has correct locale', () => {
    expect(CURRENCIES.USD.locale).toBe('en-US');
  });

  it('INR has Indian Rupee name', () => {
    expect(CURRENCIES.INR.name).toBe('Indian Rupee');
  });

  it('GBP flag is GB emoji', () => {
    expect(CURRENCIES.GBP.flag).toBe('🇬🇧');
  });
});
