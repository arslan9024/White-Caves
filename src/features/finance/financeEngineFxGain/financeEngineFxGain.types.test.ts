import { describe, expect, it } from 'vitest';
import {
  FxGainCalculationError,
  type FxGainErrorCode,
  type FxGainLossDirection,
  type FxGainLossResult,
  type FxGainLossSummary,
  type FxTransactionInput,
} from './financeEngineFxGain.types';

describe('FxGainCalculationError', () => {
  const codes: readonly FxGainErrorCode[] = [
    'INVALID_CURRENCY_CODE',
    'NON_FINITE_AMOUNT',
    'NEGATIVE_AMOUNT',
    'NON_POSITIVE_RATE',
  ];

  it.each(codes)('constructs with message and code %s', code => {
    const error = new FxGainCalculationError('bad input', code);

    expect(error.message).toBe('bad input');
    expect(error.code).toBe(code);
  });

  it('is an instance of Error and of itself (prototype chain preserved)', () => {
    const error = new FxGainCalculationError('bad input', 'NEGATIVE_AMOUNT');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(FxGainCalculationError);
  });

  it('sets a descriptive name distinct from the generic Error name', () => {
    const error = new FxGainCalculationError('bad input', 'NON_POSITIVE_RATE');

    expect(error.name).toBe('FxGainCalculationError');
  });

  it('can be caught and discriminated by code without string-matching the message', () => {
    const raise = (code: FxGainErrorCode): never => {
      throw new FxGainCalculationError(`invalid: ${code}`, code);
    };

    try {
      raise('INVALID_CURRENCY_CODE');
      throw new Error('expected raise() to throw');
    } catch (caught) {
      expect(caught).toBeInstanceOf(FxGainCalculationError);
      const fxError = caught as FxGainCalculationError;
      expect(fxError.code).toBe('INVALID_CURRENCY_CODE');
    }
  });

  it('exposes readonly code that keeps its original value across catches', () => {
    let captured: FxGainCalculationError | undefined;
    try {
      throw new FxGainCalculationError('rate must be positive', 'NON_POSITIVE_RATE');
    } catch (caught) {
      captured = caught as FxGainCalculationError;
    }

    expect(captured?.code).toBe('NON_POSITIVE_RATE');
    expect(captured?.message).toBe('rate must be positive');
  });
});

describe('FxTransactionInput shape', () => {
  it('accepts a fully-populated realized transaction object', () => {
    const input: FxTransactionInput = {
      transactionId: 'txn-1',
      transactionCurrency: 'USD',
      baseCurrency: 'AED',
      transactionAmount: 1000,
      bookingRate: 3.6725,
      settlementRate: 3.68,
      settlementStatus: 'realized',
    };

    expect(input.settlementStatus).toBe('realized');
    expect(input.transactionCurrency).toBe('USD');
  });

  it('accepts an unrealized transaction object', () => {
    const input: FxTransactionInput = {
      transactionId: 'txn-2',
      transactionCurrency: 'EUR',
      baseCurrency: 'AED',
      transactionAmount: 500,
      bookingRate: 4.0,
      settlementRate: 3.95,
      settlementStatus: 'unrealized',
    };

    expect(input.settlementStatus).toBe('unrealized');
  });
});

describe('FxGainLossResult and FxGainLossDirection shape', () => {
  it('supports all three direction literals', () => {
    const directions: readonly FxGainLossDirection[] = ['gain', 'loss', 'none'];

    directions.forEach(direction => {
      const result: FxGainLossResult = {
        transactionId: 'txn-3',
        bookedBaseAmount: 100,
        settledBaseAmount: direction === 'gain' ? 110 : direction === 'loss' ? 90 : 100,
        gainLossAmount: direction === 'gain' ? 10 : direction === 'loss' ? -10 : 0,
        direction,
        settlementStatus: 'realized',
      };

      expect(result.direction).toBe(direction);
    });
  });
});

describe('FxGainLossSummary shape', () => {
  it('holds totalGain, totalLoss, and netAmount as numbers', () => {
    const summary: FxGainLossSummary = {
      totalGain: 25.5,
      totalLoss: 10.25,
      netAmount: 15.25,
    };

    expect(summary.netAmount).toBeCloseTo(summary.totalGain - summary.totalLoss, 5);
  });
});
