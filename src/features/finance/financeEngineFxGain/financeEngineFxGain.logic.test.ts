import { describe, expect, it } from 'vitest';
import {
  calculateFxGainLoss,
  FxGainCalculationError,
  summarizeFxGainLoss,
  type FxTransactionInput,
} from './financeEngineFxGain.logic';

function baseInput(overrides: Partial<FxTransactionInput> = {}): FxTransactionInput {
  return {
    transactionId: 'txn-1',
    transactionCurrency: 'USD',
    baseCurrency: 'AED',
    transactionAmount: 1000,
    bookingRate: 3.67,
    settlementRate: 3.67,
    settlementStatus: 'realized',
    ...overrides,
  };
}

describe('calculateFxGainLoss', () => {
  it('computes a realized gain when the settlement rate rises', () => {
    const result = calculateFxGainLoss(baseInput({ bookingRate: 3.6, settlementRate: 3.7 }));

    expect(result.bookedBaseAmount).toBe(3600);
    expect(result.settledBaseAmount).toBe(3700);
    expect(result.gainLossAmount).toBe(100);
    expect(result.direction).toBe('gain');
    expect(result.settlementStatus).toBe('realized');
    expect(result.transactionId).toBe('txn-1');
  });

  it('computes a realized loss when the settlement rate falls', () => {
    const result = calculateFxGainLoss(baseInput({ bookingRate: 3.7, settlementRate: 3.6 }));

    expect(result.bookedBaseAmount).toBe(3700);
    expect(result.settledBaseAmount).toBe(3600);
    expect(result.gainLossAmount).toBe(-100);
    expect(result.direction).toBe('loss');
  });

  it('computes an unrealized revaluation using the same formula path', () => {
    const result = calculateFxGainLoss(
      baseInput({
        settlementStatus: 'unrealized',
        bookingRate: 3.65,
        settlementRate: 3.7,
      })
    );

    expect(result.gainLossAmount).toBe(50);
    expect(result.direction).toBe('gain');
    expect(result.settlementStatus).toBe('unrealized');
  });

  it('reports no exposure and gainLossAmount 0 when currencies match', () => {
    const result = calculateFxGainLoss(
      baseInput({
        transactionCurrency: 'AED',
        baseCurrency: 'AED',
        bookingRate: 1,
        settlementRate: 999,
      })
    );

    expect(result.gainLossAmount).toBe(0);
    expect(result.direction).toBe('none');
    expect(result.bookedBaseAmount).toBe(1000);
    expect(result.settledBaseAmount).toBe(1000);
  });

  it('rounds results to 2 decimal places', () => {
    const result = calculateFxGainLoss(
      baseInput({
        transactionAmount: 333.333,
        bookingRate: 3.001,
        settlementRate: 3.002,
      })
    );

    expect(Number.isInteger(result.bookedBaseAmount * 100)).toBe(true);
    expect(Number.isInteger(result.settledBaseAmount * 100)).toBe(true);
    expect(Number.isInteger(result.gainLossAmount * 100)).toBe(true);
  });

  it('throws INVALID_CURRENCY_CODE for a malformed currency code', () => {
    expect(() => calculateFxGainLoss(baseInput({ transactionCurrency: 'usd' }))).toThrow(
      FxGainCalculationError
    );

    try {
      calculateFxGainLoss(baseInput({ baseCurrency: 'AE' }));
      expect.unreachable('expected calculateFxGainLoss to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(FxGainCalculationError);
      expect((error as FxGainCalculationError).code).toBe('INVALID_CURRENCY_CODE');
    }
  });

  it('throws NON_FINITE_AMOUNT for a non-finite transaction amount', () => {
    try {
      calculateFxGainLoss(baseInput({ transactionAmount: Number.NaN }));
      expect.unreachable('expected calculateFxGainLoss to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(FxGainCalculationError);
      expect((error as FxGainCalculationError).code).toBe('NON_FINITE_AMOUNT');
    }
  });

  it('throws NEGATIVE_AMOUNT for a negative transaction amount', () => {
    try {
      calculateFxGainLoss(baseInput({ transactionAmount: -50 }));
      expect.unreachable('expected calculateFxGainLoss to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(FxGainCalculationError);
      expect((error as FxGainCalculationError).code).toBe('NEGATIVE_AMOUNT');
    }
  });

  it('throws NON_POSITIVE_RATE for a zero or negative rate', () => {
    try {
      calculateFxGainLoss(baseInput({ bookingRate: 0 }));
      expect.unreachable('expected calculateFxGainLoss to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(FxGainCalculationError);
      expect((error as FxGainCalculationError).code).toBe('NON_POSITIVE_RATE');
    }

    try {
      calculateFxGainLoss(baseInput({ settlementRate: -1 }));
      expect.unreachable('expected calculateFxGainLoss to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(FxGainCalculationError);
      expect((error as FxGainCalculationError).code).toBe('NON_POSITIVE_RATE');
    }
  });

  it('validates in fixed precedence: currency code before amount checks', () => {
    try {
      calculateFxGainLoss(baseInput({ transactionCurrency: 'usd', transactionAmount: -1 }));
      expect.unreachable('expected calculateFxGainLoss to throw');
    } catch (error) {
      expect((error as FxGainCalculationError).code).toBe('INVALID_CURRENCY_CODE');
    }
  });
});

describe('summarizeFxGainLoss', () => {
  it('sums gains and losses separately and computes a net amount', () => {
    const gain = calculateFxGainLoss(
      baseInput({ transactionId: 'g1', bookingRate: 3.6, settlementRate: 3.7 })
    );
    const loss = calculateFxGainLoss(
      baseInput({ transactionId: 'l1', bookingRate: 3.7, settlementRate: 3.6 })
    );
    const none = calculateFxGainLoss(
      baseInput({
        transactionId: 'n1',
        transactionCurrency: 'AED',
        baseCurrency: 'AED',
      })
    );

    const summary = summarizeFxGainLoss([gain, loss, none]);

    expect(summary.totalGain).toBe(100);
    expect(summary.totalLoss).toBe(100);
    expect(summary.netAmount).toBe(0);
  });

  it('returns all-zero totals for an empty list', () => {
    const summary = summarizeFxGainLoss([]);

    expect(summary).toEqual({ totalGain: 0, totalLoss: 0, netAmount: 0 });
  });

  it('computes a positive net amount when gains exceed losses', () => {
    const gain1 = calculateFxGainLoss(
      baseInput({ transactionId: 'g1', bookingRate: 3.6, settlementRate: 3.8 })
    );
    const gain2 = calculateFxGainLoss(
      baseInput({ transactionId: 'g2', bookingRate: 3.6, settlementRate: 3.7 })
    );
    const loss1 = calculateFxGainLoss(
      baseInput({ transactionId: 'l1', bookingRate: 3.7, settlementRate: 3.6 })
    );

    const summary = summarizeFxGainLoss([gain1, gain2, loss1]);

    expect(summary.totalGain).toBe(300);
    expect(summary.totalLoss).toBe(100);
    expect(summary.netAmount).toBe(200);
  });
});
