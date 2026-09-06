import { describe, expect, it } from 'vitest';
import type {
  CurrencyCode,
  FiscalQuarter,
  QuarterlyVatCalculationInput,
  QuarterlyVatCalculationResult,
  QuarterlyVatEngineOutcome,
  QuarterlyVatPeriod,
  QuarterlyVatValidationError,
  VatRateBand,
  VatRateBandSummary,
  VatTransactionDirection,
  VatTransactionLine,
} from './financeEngineQuarterlyVat.types';

/**
 * These tests validate the structural (runtime-shape) contract of the
 * Quarterly VAT finance engine types. Because the module exports only
 * type declarations, we assert behavior by constructing values that
 * conform to each type and verifying their shape/derived computations,
 * ensuring the type contract stays aligned with real usage.
 */

describe('financeEngineQuarterlyVat.types', () => {
  const standardRate: VatRateBand = {
    label: 'Standard',
    ratePercent: 5,
    isExempt: false,
  };

  const zeroRate: VatRateBand = {
    label: 'Zero-rated',
    ratePercent: 0,
    isExempt: false,
  };

  const exemptRate: VatRateBand = {
    label: 'Exempt',
    ratePercent: 0,
    isExempt: true,
  };

  const period: QuarterlyVatPeriod = {
    year: 2026,
    quarter: 'Q1' as FiscalQuarter,
    startDate: '2026-01-01',
    endDate: '2026-03-31',
  };

  it('constructs a valid VatRateBand and preserves its fields', () => {
    expect(standardRate.label).toBe('Standard');
    expect(standardRate.ratePercent).toBe(5);
    expect(standardRate.isExempt).toBe(false);
  });

  it('constructs a valid QuarterlyVatPeriod with consistent date ordering', () => {
    expect(period.year).toBe(2026);
    expect(period.quarter).toBe('Q1');
    expect(new Date(period.startDate).getTime()).toBeLessThan(new Date(period.endDate).getTime());
  });

  it('supports every FiscalQuarter literal value', () => {
    const quarters: readonly FiscalQuarter[] = ['Q1', 'Q2', 'Q3', 'Q4'];
    expect(quarters).toHaveLength(4);
    quarters.forEach(quarter => {
      const p: QuarterlyVatPeriod = { ...period, quarter };
      expect(p.quarter).toBe(quarter);
    });
  });

  it('constructs a VatTransactionLine for both sale and purchase directions', () => {
    const directions: readonly VatTransactionDirection[] = ['sale', 'purchase'];

    directions.forEach((direction, index) => {
      const line: VatTransactionLine = {
        id: `txn-${index}`,
        transactionDate: '2026-02-15',
        direction,
        netAmount: 1000,
        currency: 'AED' as CurrencyCode,
        rateBand: standardRate,
        description: `Test ${direction} transaction`,
      };

      expect(line.direction).toBe(direction);
      expect(line.netAmount).toBe(1000);
      expect(line.rateBand.ratePercent).toBe(5);
    });
  });

  it('allows an optional description to be omitted on VatTransactionLine', () => {
    const line: VatTransactionLine = {
      id: 'txn-no-desc',
      transactionDate: '2026-02-15',
      direction: 'sale',
      netAmount: 500,
      currency: 'AED',
      rateBand: zeroRate,
    };

    expect(line.description).toBeUndefined();
    expect(line.rateBand.ratePercent).toBe(0);
  });

  it('builds a QuarterlyVatCalculationInput aggregating multiple transaction lines', () => {
    const transactions: readonly VatTransactionLine[] = [
      {
        id: 'sale-1',
        transactionDate: '2026-01-10',
        direction: 'sale',
        netAmount: 2000,
        currency: 'AED',
        rateBand: standardRate,
      },
      {
        id: 'purchase-1',
        transactionDate: '2026-02-01',
        direction: 'purchase',
        netAmount: 800,
        currency: 'AED',
        rateBand: standardRate,
      },
      {
        id: 'exempt-sale-1',
        transactionDate: '2026-03-01',
        direction: 'sale',
        netAmount: 300,
        currency: 'AED',
        rateBand: exemptRate,
      },
    ];

    const input: QuarterlyVatCalculationInput = {
      period,
      transactions,
      reportingCurrency: 'AED',
      openingBalance: 150,
    };

    expect(input.transactions).toHaveLength(3);
    expect(input.openingBalance).toBe(150);

    const totalSalesNet = input.transactions
      .filter(t => t.direction === 'sale')
      .reduce((sum, t) => sum + t.netAmount, 0);
    expect(totalSalesNet).toBe(2300);
  });

  it('computes a VatRateBandSummary consistent with band totals', () => {
    const summary: VatRateBandSummary = {
      rateBand: standardRate,
      outputNetTotal: 2000,
      outputTaxTotal: 2000 * (standardRate.ratePercent / 100),
      inputNetTotal: 800,
      inputTaxTotal: 800 * (standardRate.ratePercent / 100),
    };

    expect(summary.outputTaxTotal).toBeCloseTo(100);
    expect(summary.inputTaxTotal).toBeCloseTo(40);
    expect(summary.outputTaxTotal - summary.inputTaxTotal).toBeCloseTo(60);
  });

  it('derives a payable QuarterlyVatCalculationResult when output tax exceeds input tax', () => {
    const rateBandSummaries: readonly VatRateBandSummary[] = [
      {
        rateBand: standardRate,
        outputNetTotal: 2000,
        outputTaxTotal: 100,
        inputNetTotal: 800,
        inputTaxTotal: 40,
      },
    ];

    const totalOutputTax = rateBandSummaries.reduce((s, b) => s + b.outputTaxTotal, 0);
    const totalInputTax = rateBandSummaries.reduce((s, b) => s + b.inputTaxTotal, 0);
    const netVatPosition = totalOutputTax - totalInputTax;

    const result: QuarterlyVatCalculationResult = {
      period,
      reportingCurrency: 'AED',
      totalOutputTax,
      totalInputTax,
      netVatPosition,
      status: netVatPosition > 0 ? 'payable' : netVatPosition < 0 ? 'refundable' : 'neutral',
      rateBandSummaries,
      excludedLineCount: 0,
    };

    expect(result.totalOutputTax).toBe(100);
    expect(result.totalInputTax).toBe(40);
    expect(result.netVatPosition).toBe(60);
    expect(result.status).toBe('payable');
    expect(result.excludedLineCount).toBe(0);
  });

  it('derives a refundable status when input tax exceeds output tax', () => {
    const netVatPosition = 40 - 100;
    const result: QuarterlyVatCalculationResult = {
      period,
      reportingCurrency: 'AED',
      totalOutputTax: 40,
      totalInputTax: 100,
      netVatPosition,
      status: netVatPosition > 0 ? 'payable' : netVatPosition < 0 ? 'refundable' : 'neutral',
      rateBandSummaries: [],
      excludedLineCount: 2,
    };

    expect(result.status).toBe('refundable');
    expect(result.netVatPosition).toBeLessThan(0);
    expect(result.excludedLineCount).toBe(2);
  });

  it('derives a neutral status when output tax equals input tax exactly', () => {
    const result: QuarterlyVatCalculationResult = {
      period,
      reportingCurrency: 'AED',
      totalOutputTax: 75,
      totalInputTax: 75,
      netVatPosition: 0,
      status: 'neutral',
      rateBandSummaries: [],
      excludedLineCount: 0,
    };

    expect(result.netVatPosition).toBe(0);
    expect(result.status).toBe('neutral');
  });

  it('represents a successful QuarterlyVatEngineOutcome as a discriminated union', () => {
    const result: QuarterlyVatCalculationResult = {
      period,
      reportingCurrency: 'AED',
      totalOutputTax: 100,
      totalInputTax: 40,
      netVatPosition: 60,
      status: 'payable',
      rateBandSummaries: [],
      excludedLineCount: 0,
    };

    const outcome: QuarterlyVatEngineOutcome = { success: true, result };

    expect(outcome.success).toBe(true);
    if (outcome.success) {
      expect(outcome.result.netVatPosition).toBe(60);
    } else {
      throw new Error('Expected outcome to be successful');
    }
  });

  it('represents a failed QuarterlyVatEngineOutcome carrying validation errors', () => {
    const errors: readonly QuarterlyVatValidationError[] = [
      {
        code: 'NEGATIVE_NET_AMOUNT',
        message: 'Transaction net amount cannot be negative.',
        transactionId: 'txn-99',
      },
      {
        code: 'TRANSACTION_OUTSIDE_PERIOD',
        message: 'Transaction date falls outside the reporting period.',
      },
    ];

    const outcome: QuarterlyVatEngineOutcome = { success: false, errors };

    expect(outcome.success).toBe(false);
    if (!outcome.success) {
      expect(outcome.errors).toHaveLength(2);
      expect(outcome.errors[0].code).toBe('NEGATIVE_NET_AMOUNT');
      expect(outcome.errors[0].transactionId).toBe('txn-99');
      expect(outcome.errors[1].transactionId).toBeUndefined();
    } else {
      throw new Error('Expected outcome to be a failure');
    }
  });

  it('narrows QuarterlyVatEngineOutcome via the success discriminant at compile time', () => {
    const outcomes: readonly QuarterlyVatEngineOutcome[] = [
      {
        success: true,
        result: {
          period,
          reportingCurrency: 'AED',
          totalOutputTax: 10,
          totalInputTax: 5,
          netVatPosition: 5,
          status: 'payable',
          rateBandSummaries: [],
          excludedLineCount: 0,
        },
      },
      {
        success: false,
        errors: [
          { code: 'CURRENCY_MISMATCH', message: 'Currency does not match reporting currency.' },
        ],
      },
    ];

    const successCount = outcomes.filter(o => o.success).length;
    const failureCount = outcomes.filter(o => !o.success).length;

    expect(successCount).toBe(1);
    expect(failureCount).toBe(1);
  });
});
