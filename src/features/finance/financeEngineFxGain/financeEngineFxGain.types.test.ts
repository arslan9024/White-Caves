import { describe, expect, it } from 'vitest';

import {
  assertValidFxRate,
  isFxAmount,
  isSameCurrency,
  isValidFxRate,
  type FxAmount,
  type FxGainResult,
} from './financeEngineFxGain.types';

describe('financeEngineFxGain.types', () => {
  describe('isFxAmount', () => {
    it('returns true for a well-formed FxAmount object', () => {
      const value: FxAmount = { foreignAmount: 100, foreignCurrency: 'USD', rate: 1.1 };
      expect(isFxAmount(value)).toBe(true);
    });

    it('returns false when foreignCurrency is an empty string', () => {
      expect(isFxAmount({ foreignAmount: 100, foreignCurrency: '', rate: 1.1 })).toBe(false);
    });

    it('returns false when a required field is missing', () => {
      expect(isFxAmount({ foreignAmount: 100, foreignCurrency: 'USD' })).toBe(false);
    });

    it('returns false when a field has the wrong type', () => {
      expect(isFxAmount({ foreignAmount: '100', foreignCurrency: 'USD', rate: 1.1 })).toBe(false);
    });

    it('returns false for null, arrays, and primitives', () => {
      expect(isFxAmount(null)).toBe(false);
      expect(isFxAmount([])).toBe(false);
      expect(isFxAmount('not an object')).toBe(false);
      expect(isFxAmount(42)).toBe(false);
      expect(isFxAmount(undefined)).toBe(false);
    });
  });

  describe('isValidFxRate', () => {
    it('returns true for strictly positive finite numbers', () => {
      expect(isValidFxRate(1)).toBe(true);
      expect(isValidFxRate(0.0001)).toBe(true);
      expect(isValidFxRate(999.99)).toBe(true);
    });

    it('returns false for zero', () => {
      expect(isValidFxRate(0)).toBe(false);
    });

    it('returns false for negative numbers', () => {
      expect(isValidFxRate(-1)).toBe(false);
    });

    it('returns false for NaN', () => {
      expect(isValidFxRate(NaN)).toBe(false);
    });

    it('returns false for Infinity and -Infinity', () => {
      expect(isValidFxRate(Infinity)).toBe(false);
      expect(isValidFxRate(-Infinity)).toBe(false);
    });
  });

  describe('assertValidFxRate', () => {
    it('does not throw for a valid rate', () => {
      expect(() => assertValidFxRate(1.25)).not.toThrow();
    });

    it('throws RangeError for a zero rate', () => {
      expect(() => assertValidFxRate(0)).toThrow(RangeError);
    });

    it('throws RangeError for a negative rate', () => {
      expect(() => assertValidFxRate(-5)).toThrow(RangeError);
    });

    it('throws RangeError for NaN', () => {
      expect(() => assertValidFxRate(NaN)).toThrow(RangeError);
    });

    it('throws RangeError for Infinity', () => {
      expect(() => assertValidFxRate(Infinity)).toThrow(RangeError);
    });

    it('includes the provided label in the error message', () => {
      expect(() => assertValidFxRate(0, 'original.rate')).toThrow(/original\.rate/);
    });

    it('defaults the label to "rate" when omitted', () => {
      expect(() => assertValidFxRate(-1)).toThrow(/rate must be a positive finite number/);
    });
  });

  describe('isSameCurrency', () => {
    it('returns true for identical currency codes', () => {
      expect(isSameCurrency('USD', 'USD')).toBe(true);
    });

    it('is case-insensitive', () => {
      expect(isSameCurrency('usd', 'USD')).toBe(true);
    });

    it('tolerates surrounding whitespace', () => {
      expect(isSameCurrency(' USD ', 'usd')).toBe(true);
    });

    it('returns false for different currency codes', () => {
      expect(isSameCurrency('USD', 'EUR')).toBe(false);
    });
  });

  describe('type-level shape sanity (compile + runtime cross-check)', () => {
    it('accepts a value satisfying both FxAmount and FxGainResult shapes independently', () => {
      const amount: FxAmount = { foreignAmount: 250.5, foreignCurrency: 'GBP', rate: 1.3 };
      const result: FxGainResult = {
        gainOrLoss: 10.25,
        originalBaseValue: 300,
        currentBaseValue: 310.25,
      };

      expect(isFxAmount(amount)).toBe(true);
      expect(result.currentBaseValue - result.originalBaseValue).toBeCloseTo(result.gainOrLoss, 5);
    });
  });
});
