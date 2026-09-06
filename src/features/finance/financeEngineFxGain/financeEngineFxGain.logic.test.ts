import { describe, expect, it } from 'vitest';

import {
  calculateFxGain,
  roundToCents,
  type FxAmount,
  type FxGainResult,
} from './financeEngineFxGain.logic';

const BASE_CURRENCY = 'USD';

describe('roundToCents', () => {
  it('rounds a plain fractional cent value up (round-half-up)', () => {
    expect(roundToCents(100.005)).toBe(100.01);
  });

  it('rounds down when below the half-cent boundary', () => {
    expect(roundToCents(100.004)).toBe(100);
  });

  it('leaves already-rounded values unchanged', () => {
    expect(roundToCents(42.5)).toBe(42.5);
  });

  it('handles negative values symmetrically', () => {
    expect(roundToCents(-100.005)).toBe(-100);
  });
});

describe('calculateFxGain — FR-1: realized gain/loss', () => {
  it('reports a positive gain when settlement rate exceeds the booking rate', () => {
    const original: FxAmount = { foreignAmount: 1000, foreignCurrency: 'EUR', rate: 1.1 };
    const current: FxAmount = { foreignAmount: 1000, foreignCurrency: 'EUR', rate: 1.2 };

    const result = calculateFxGain(original, current, BASE_CURRENCY);

    expect(result.originalBaseValue).toBe(1100);
    expect(result.currentBaseValue).toBe(1200);
    expect(result.gainOrLoss).toBe(100);
    expect(result.gainOrLoss).toBeGreaterThan(0);
  });

  it('reports a negative loss when settlement rate is below the booking rate', () => {
    const original: FxAmount = { foreignAmount: 1000, foreignCurrency: 'EUR', rate: 1.2 };
    const current: FxAmount = { foreignAmount: 1000, foreignCurrency: 'EUR', rate: 1.1 };

    const result = calculateFxGain(original, current, BASE_CURRENCY);

    expect(result.originalBaseValue).toBe(1200);
    expect(result.currentBaseValue).toBe(1100);
    expect(result.gainOrLoss).toBe(-100);
    expect(result.gainOrLoss).toBeLessThan(0);
  });
});

describe('calculateFxGain — FR-2: unrealized gain/loss', () => {
  it('computes gain against a valuation-date rate using the same shape as realized calc', () => {
    const original: FxAmount = { foreignAmount: 500, foreignCurrency: 'GBP', rate: 1.25 };
    const valuation: FxAmount = { foreignAmount: 500, foreignCurrency: 'GBP', rate: 1.3 };

    const result = calculateFxGain(original, valuation, BASE_CURRENCY);

    expect(result.originalBaseValue).toBe(625);
    expect(result.currentBaseValue).toBe(650);
    expect(result.gainOrLoss).toBe(25);
  });

  it('computes loss against a valuation-date rate', () => {
    const original: FxAmount = { foreignAmount: 500, foreignCurrency: 'GBP', rate: 1.3 };
    const valuation: FxAmount = { foreignAmount: 500, foreignCurrency: 'GBP', rate: 1.25 };

    const result = calculateFxGain(original, valuation, BASE_CURRENCY);

    expect(result.gainOrLoss).toBe(-25);
  });
});

describe('calculateFxGain — FR-3: sign convention', () => {
  it('always computes gainOrLoss as currentBaseValue - originalBaseValue', () => {
    const original: FxAmount = { foreignAmount: 300, foreignCurrency: 'JPY', rate: 0.0067 };
    const current: FxAmount = { foreignAmount: 300, foreignCurrency: 'JPY', rate: 0.0071 };

    const result = calculateFxGain(original, current, BASE_CURRENCY);

    expect(result.gainOrLoss).toBe(
      roundToCents(result.currentBaseValue - result.originalBaseValue)
    );
  });
});

describe('calculateFxGain — FR-4: output rounding', () => {
  it('rounds base values and gain/loss to 2 decimal places', () => {
    const original: FxAmount = { foreignAmount: 333.333, foreignCurrency: 'EUR', rate: 1.001 };
    const current: FxAmount = { foreignAmount: 333.333, foreignCurrency: 'EUR', rate: 1.009 };

    const result = calculateFxGain(original, current, BASE_CURRENCY);

    const isTwoDp = (n: number) => Number.isInteger(Math.round(n * 100));
    expect(isTwoDp(result.originalBaseValue)).toBe(true);
    expect(isTwoDp(result.currentBaseValue)).toBe(true);
    expect(isTwoDp(result.gainOrLoss)).toBe(true);
  });
});

describe('calculateFxGain — FR-5: invalid rate handling', () => {
  it('throws RangeError when original.rate is zero', () => {
    const original: FxAmount = { foreignAmount: 100, foreignCurrency: 'EUR', rate: 0 };
    const current: FxAmount = { foreignAmount: 100, foreignCurrency: 'EUR', rate: 1 };

    expect(() => calculateFxGain(original, current, BASE_CURRENCY)).toThrow(RangeError);
  });

  it('throws RangeError when current.rate is negative', () => {
    const original: FxAmount = { foreignAmount: 100, foreignCurrency: 'EUR', rate: 1 };
    const current: FxAmount = { foreignAmount: 100, foreignCurrency: 'EUR', rate: -1 };

    expect(() => calculateFxGain(original, current, BASE_CURRENCY)).toThrow(RangeError);
  });

  it('throws RangeError when a rate is NaN', () => {
    const original: FxAmount = { foreignAmount: 100, foreignCurrency: 'EUR', rate: Number.NaN };
    const current: FxAmount = { foreignAmount: 100, foreignCurrency: 'EUR', rate: 1 };

    expect(() => calculateFxGain(original, current, BASE_CURRENCY)).toThrow(RangeError);
  });

  it('throws RangeError when a rate is non-finite (Infinity)', () => {
    const original: FxAmount = { foreignAmount: 100, foreignCurrency: 'EUR', rate: 1 };
    const current: FxAmount = {
      foreignAmount: 100,
      foreignCurrency: 'EUR',
      rate: Number.POSITIVE_INFINITY,
    };

    expect(() => calculateFxGain(original, current, BASE_CURRENCY)).toThrow(RangeError);
  });
});

describe('calculateFxGain — FR-6: same-currency short-circuit', () => {
  it('returns exactly zero gain/loss when foreignCurrency equals baseCurrency, regardless of rates', () => {
    const original: FxAmount = { foreignAmount: 250, foreignCurrency: BASE_CURRENCY, rate: 999 };
    const current: FxAmount = { foreignAmount: 999, foreignCurrency: BASE_CURRENCY, rate: 0.01 };

    const result = calculateFxGain(original, current, BASE_CURRENCY);

    expect(result.gainOrLoss).toBe(0);
    expect(result.originalBaseValue).toBe(250);
    expect(result.currentBaseValue).toBe(250);
  });
});

describe('calculateFxGain — FR-7: determinism', () => {
  it('produces identical results for identical inputs across repeated calls', () => {
    const original: FxAmount = { foreignAmount: 741.19, foreignCurrency: 'CAD', rate: 0.73 };
    const current: FxAmount = { foreignAmount: 741.19, foreignCurrency: 'CAD', rate: 0.76 };

    const first: FxGainResult = calculateFxGain(original, current, BASE_CURRENCY);
    const second: FxGainResult = calculateFxGain(original, current, BASE_CURRENCY);

    expect(second).toEqual(first);
  });
});
