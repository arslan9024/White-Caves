import { describe, expect, it } from 'vitest';
import {
  FinanceEngineValidationError,
  SUPPORTED_CURRENCY_CODES,
  isCurrencyCode,
  type CommissionSplitInput,
  type CommissionSplitResult,
  type CurrencyConversionInput,
  type CurrencyConversionResult,
  type FinanceEngine,
  type LineItem,
  type Installment,
  type PaymentScheduleInput,
  type PaymentScheduleResult,
  type PriceBreakdownInput,
  type PriceBreakdownResult,
} from './financeEngineArchitectureDouble.types';

/**
 * A minimal, deterministic implementation of the `FinanceEngine` interface
 * used purely to prove the contract in this types module is implementable
 * and behaves as documented. This is NOT the architecture double
 * implementation (delivered under a separate child issue) — it exists only
 * to give the type contract real, executable behavior to assert against.
 */
class MinimalTestFinanceEngine implements FinanceEngine {
  computePriceBreakdown(input: PriceBreakdownInput): PriceBreakdownResult {
    if (input.baseAmountMinorUnits < 0) {
      throw new FinanceEngineValidationError(
        'baseAmountMinorUnits must be >= 0',
        'baseAmountMinorUnits'
      );
    }
    if (!isCurrencyCode(input.currency)) {
      throw new FinanceEngineValidationError(`unknown currency: ${input.currency}`, 'currency');
    }

    const taxRate = input.taxRateBasisPoints ?? 0;
    const feeRate = input.feeRateBasisPoints ?? 0;
    const taxAmount = Math.round((input.baseAmountMinorUnits * taxRate) / 10_000);
    const feeAmount = Math.round((input.baseAmountMinorUnits * feeRate) / 10_000);

    const lineItems: LineItem[] = [
      { label: 'base', amountMinorUnits: input.baseAmountMinorUnits },
      { label: 'tax', rateBasisPoints: taxRate, amountMinorUnits: taxAmount },
      { label: 'fee', rateBasisPoints: feeRate, amountMinorUnits: feeAmount },
    ];

    return {
      currency: input.currency,
      baseAmountMinorUnits: input.baseAmountMinorUnits,
      lineItems,
      totalMinorUnits: lineItems.reduce((sum, item) => sum + item.amountMinorUnits, 0),
    };
  }

  computeCommissionSplit(input: CommissionSplitInput): CommissionSplitResult {
    const referralShare = input.referralShareBasisPoints ?? 0;
    const totalShareBasisPoints =
      input.agentShareBasisPoints + input.agencyShareBasisPoints + referralShare;
    if (totalShareBasisPoints > 10_000) {
      throw new FinanceEngineValidationError(
        'commission shares exceed 100%',
        'agentShareBasisPoints'
      );
    }
    if (input.transactionAmountMinorUnits < 0) {
      throw new FinanceEngineValidationError(
        'transactionAmountMinorUnits must be >= 0',
        'transactionAmountMinorUnits'
      );
    }

    const agentAmount = Math.round(
      (input.transactionAmountMinorUnits * input.agentShareBasisPoints) / 10_000
    );
    const agencyAmount = Math.round(
      (input.transactionAmountMinorUnits * input.agencyShareBasisPoints) / 10_000
    );
    const referralAmount = Math.round((input.transactionAmountMinorUnits * referralShare) / 10_000);

    const lineItems: LineItem[] = [
      {
        label: 'agent',
        rateBasisPoints: input.agentShareBasisPoints,
        amountMinorUnits: agentAmount,
      },
      {
        label: 'agency',
        rateBasisPoints: input.agencyShareBasisPoints,
        amountMinorUnits: agencyAmount,
      },
      { label: 'referral', rateBasisPoints: referralShare, amountMinorUnits: referralAmount },
    ];

    return {
      currency: input.currency,
      transactionAmountMinorUnits: input.transactionAmountMinorUnits,
      lineItems,
      totalDistributedMinorUnits: lineItems.reduce((sum, item) => sum + item.amountMinorUnits, 0),
    };
  }

  convertCurrency(input: CurrencyConversionInput): CurrencyConversionResult {
    const rateTable: Record<string, number> = {
      AED_USD: 0.27,
      USD_AED: 3.67,
      AED_EUR: 0.25,
      EUR_AED: 4.0,
      USD_EUR: 0.92,
      EUR_USD: 1.09,
    };

    if (input.fromCurrency === input.toCurrency) {
      return {
        amountMinorUnits: input.amountMinorUnits,
        fromCurrency: input.fromCurrency,
        toCurrency: input.toCurrency,
        convertedAmountMinorUnits: input.amountMinorUnits,
        rateApplied: 1,
      };
    }

    const key = `${input.fromCurrency}_${input.toCurrency}`;
    const rate = rateTable[key];
    if (rate === undefined) {
      throw new FinanceEngineValidationError(`no rate configured for ${key}`, 'toCurrency');
    }

    return {
      amountMinorUnits: input.amountMinorUnits,
      fromCurrency: input.fromCurrency,
      toCurrency: input.toCurrency,
      convertedAmountMinorUnits: Math.round(input.amountMinorUnits * rate),
      rateApplied: rate,
    };
  }

  projectPaymentSchedule(input: PaymentScheduleInput): PaymentScheduleResult {
    if (input.numberOfInstallments <= 0) {
      throw new FinanceEngineValidationError(
        'numberOfInstallments must be > 0',
        'numberOfInstallments'
      );
    }

    const downPayment = input.downPaymentMinorUnits ?? 0;
    const remaining = input.totalAmountMinorUnits - downPayment;
    const perInstallment = Math.floor(remaining / input.numberOfInstallments);
    const installments: Installment[] = [];
    let allocated = 0;

    for (let sequence = 1; sequence <= input.numberOfInstallments; sequence += 1) {
      const isLast = sequence === input.numberOfInstallments;
      const amountMinorUnits = isLast ? remaining - allocated : perInstallment;
      allocated += amountMinorUnits;
      installments.push({ sequence, dueDateIso: input.startDateIso, amountMinorUnits });
    }

    return {
      currency: input.currency,
      installments,
      totalScheduledMinorUnits:
        downPayment + installments.reduce((sum, item) => sum + item.amountMinorUnits, 0),
    };
  }
}

describe('SUPPORTED_CURRENCY_CODES / isCurrencyCode', () => {
  it('contains exactly AED, USD, and EUR', () => {
    expect(SUPPORTED_CURRENCY_CODES).toEqual(['AED', 'USD', 'EUR']);
  });

  it('recognizes supported currency codes', () => {
    expect(isCurrencyCode('AED')).toBe(true);
    expect(isCurrencyCode('USD')).toBe(true);
    expect(isCurrencyCode('EUR')).toBe(true);
  });

  it('rejects unsupported or malformed currency codes', () => {
    expect(isCurrencyCode('GBP')).toBe(false);
    expect(isCurrencyCode('')).toBe(false);
    expect(isCurrencyCode('aed')).toBe(false);
  });
});

describe('FinanceEngineValidationError', () => {
  it('sets message, name, and field, and is a real Error instance', () => {
    const error = new FinanceEngineValidationError(
      'amount must be non-negative',
      'amountMinorUnits'
    );

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(FinanceEngineValidationError);
    expect(error.name).toBe('FinanceEngineValidationError');
    expect(error.message).toBe('amount must be non-negative');
    expect(error.field).toBe('amountMinorUnits');
  });

  it('allows field to be omitted', () => {
    const error = new FinanceEngineValidationError('generic failure');
    expect(error.field).toBeUndefined();
  });
});

describe('FinanceEngine contract: computePriceBreakdown', () => {
  const engine: FinanceEngine = new MinimalTestFinanceEngine();

  it('produces a total equal to the sum of its line items', () => {
    const result = engine.computePriceBreakdown({
      baseAmountMinorUnits: 100_000,
      currency: 'AED',
      taxRateBasisPoints: 500,
      feeRateBasisPoints: 250,
    });

    const sumOfLines = result.lineItems.reduce((sum, item) => sum + item.amountMinorUnits, 0);
    expect(result.totalMinorUnits).toBe(sumOfLines);
    expect(result.totalMinorUnits).toBe(100_000 + 5_000 + 2_500);
  });

  it('changing the injected tax rate changes the computed tax line by the expected amount', () => {
    const lowTax = engine.computePriceBreakdown({
      baseAmountMinorUnits: 100_000,
      currency: 'AED',
      taxRateBasisPoints: 500,
    });
    const highTax = engine.computePriceBreakdown({
      baseAmountMinorUnits: 100_000,
      currency: 'AED',
      taxRateBasisPoints: 1000,
    });

    const lowTaxLine = lowTax.lineItems.find(item => item.label === 'tax');
    const highTaxLine = highTax.lineItems.find(item => item.label === 'tax');

    expect(highTaxLine?.amountMinorUnits).toBe((lowTaxLine?.amountMinorUnits ?? 0) * 2);
  });

  it('does not mutate the input object', () => {
    const input: PriceBreakdownInput = {
      baseAmountMinorUnits: 50_000,
      currency: 'USD',
      taxRateBasisPoints: 100,
    };
    const snapshot = { ...input };

    engine.computePriceBreakdown(input);

    expect(input).toEqual(snapshot);
  });

  it('throws FinanceEngineValidationError on a negative base amount', () => {
    expect(() =>
      engine.computePriceBreakdown({ baseAmountMinorUnits: -1, currency: 'AED' })
    ).toThrow(FinanceEngineValidationError);
  });
});

describe('FinanceEngine contract: computeCommissionSplit', () => {
  const engine: FinanceEngine = new MinimalTestFinanceEngine();

  it('distributes the transaction amount across agent, agency, and referral lines', () => {
    const result = engine.computeCommissionSplit({
      transactionAmountMinorUnits: 1_000_000,
      currency: 'AED',
      agentShareBasisPoints: 250,
      agencyShareBasisPoints: 250,
      referralShareBasisPoints: 100,
    });

    expect(result.totalDistributedMinorUnits).toBe(25_000 + 25_000 + 10_000);
    expect(result.lineItems).toHaveLength(3);
  });

  it('rejects shares that sum above 100%', () => {
    expect(() =>
      engine.computeCommissionSplit({
        transactionAmountMinorUnits: 1_000_000,
        currency: 'AED',
        agentShareBasisPoints: 6000,
        agencyShareBasisPoints: 5000,
      })
    ).toThrow(FinanceEngineValidationError);
  });
});

describe('FinanceEngine contract: convertCurrency', () => {
  const engine: FinanceEngine = new MinimalTestFinanceEngine();

  it('is a no-op with rate 1 when source and target currencies match', () => {
    const result = engine.convertCurrency({
      amountMinorUnits: 12_345,
      fromCurrency: 'AED',
      toCurrency: 'AED',
    });
    expect(result.convertedAmountMinorUnits).toBe(12_345);
    expect(result.rateApplied).toBe(1);
  });

  it('applies the configured rate for a known currency pair', () => {
    const result = engine.convertCurrency({
      amountMinorUnits: 10_000,
      fromCurrency: 'USD',
      toCurrency: 'AED',
    });
    expect(result.rateApplied).toBe(3.67);
    expect(result.convertedAmountMinorUnits).toBe(Math.round(10_000 * 3.67));
  });

  it('throws FinanceEngineValidationError for an unconfigured currency pair', () => {
    expect(() =>
      // @ts-expect-error deliberately passing an unsupported code at runtime to exercise the error path
      engine.convertCurrency({ amountMinorUnits: 1, fromCurrency: 'AED', toCurrency: 'JPY' })
    ).toThrow(FinanceEngineValidationError);
  });
});

describe('FinanceEngine contract: projectPaymentSchedule', () => {
  const engine: FinanceEngine = new MinimalTestFinanceEngine();

  it('reconciles the schedule total exactly to the requested total amount', () => {
    const input: PaymentScheduleInput = {
      totalAmountMinorUnits: 1_000_000,
      currency: 'AED',
      numberOfInstallments: 3,
      downPaymentMinorUnits: 100_000,
      startDateIso: '2026-01-01',
      cadence: 'monthly',
    };

    const result = engine.projectPaymentSchedule(input);

    expect(result.installments).toHaveLength(3);
    expect(result.totalScheduledMinorUnits).toBe(input.totalAmountMinorUnits);
  });

  it('assigns any rounding remainder to the final installment', () => {
    const result = engine.projectPaymentSchedule({
      totalAmountMinorUnits: 100,
      currency: 'AED',
      numberOfInstallments: 3,
      startDateIso: '2026-01-01',
      cadence: 'monthly',
    });

    expect(result.installments[0]?.amountMinorUnits).toBe(33);
    expect(result.installments[1]?.amountMinorUnits).toBe(33);
    expect(result.installments[2]?.amountMinorUnits).toBe(34);
  });

  it('throws FinanceEngineValidationError when installment count is not positive', () => {
    expect(() =>
      engine.projectPaymentSchedule({
        totalAmountMinorUnits: 1000,
        currency: 'AED',
        numberOfInstallments: 0,
        startDateIso: '2026-01-01',
        cadence: 'monthly',
      })
    ).toThrow(FinanceEngineValidationError);
  });
});
