import { describe, expect, it } from 'vitest';
import {
  DEFAULT_FINANCE_ENGINE_DOUBLE_CONFIG,
  FinanceEngineArchitectureDouble,
  FinanceEngineValidationError,
} from './financeEngineArchitectureDouble.logic';

describe('FinanceEngineArchitectureDouble', () => {
  describe('computePriceBreakdown', () => {
    it('computes tax and total using the default tax rate', () => {
      const engine = new FinanceEngineArchitectureDouble();
      const result = engine.computePriceBreakdown({ baseAmountMinorUnits: 100_000 });

      const expectedTax = Math.round(
        (100_000 * DEFAULT_FINANCE_ENGINE_DOUBLE_CONFIG.defaultTaxRatePercent) / 100
      );

      expect(result.baseAmountMinorUnits).toBe(100_000);
      expect(result.taxAmountMinorUnits).toBe(expectedTax);
      expect(result.feeAmountMinorUnits).toBe(0);
      expect(result.totalMinorUnits).toBe(100_000 + expectedTax);
    });

    it('changes the tax line proportionally when an override rate is supplied', () => {
      const engine = new FinanceEngineArchitectureDouble();
      const result = engine.computePriceBreakdown({
        baseAmountMinorUnits: 200_000,
        taxRatePercent: 10,
      });

      expect(result.taxAmountMinorUnits).toBe(20_000);
      expect(result.totalMinorUnits).toBe(220_000);
    });

    it('includes an itemized fee line only when a fee is provided', () => {
      const engine = new FinanceEngineArchitectureDouble();

      const withoutFee = engine.computePriceBreakdown({ baseAmountMinorUnits: 100_000 });
      expect(withoutFee.lineItems.some(line => line.label === 'fee')).toBe(false);

      const withFee = engine.computePriceBreakdown({
        baseAmountMinorUnits: 100_000,
        feeAmountMinorUnits: 5_000,
      });
      expect(withFee.lineItems.some(line => line.label === 'fee')).toBe(true);
      expect(withFee.totalMinorUnits).toBe(withoutFee.totalMinorUnits + 5_000);
    });

    it('sums to the same total as the itemized line items', () => {
      const engine = new FinanceEngineArchitectureDouble();
      const result = engine.computePriceBreakdown({
        baseAmountMinorUnits: 150_000,
        feeAmountMinorUnits: 2_500,
      });

      const lineItemSum = result.lineItems.reduce((sum, line) => sum + line.amountMinorUnits, 0);
      expect(lineItemSum).toBe(result.totalMinorUnits);
    });

    it('does not mutate the input object', () => {
      const engine = new FinanceEngineArchitectureDouble();
      const input = { baseAmountMinorUnits: 100_000, taxRatePercent: 8 };
      const snapshot = { ...input };

      engine.computePriceBreakdown(input);

      expect(input).toEqual(snapshot);
    });

    it('throws FinanceEngineValidationError for a negative base amount', () => {
      const engine = new FinanceEngineArchitectureDouble();
      expect(() => engine.computePriceBreakdown({ baseAmountMinorUnits: -1 })).toThrow(
        FinanceEngineValidationError
      );
    });

    it('throws FinanceEngineValidationError for an out-of-range tax rate', () => {
      const engine = new FinanceEngineArchitectureDouble();
      expect(() =>
        engine.computePriceBreakdown({ baseAmountMinorUnits: 1000, taxRatePercent: 150 })
      ).toThrow(FinanceEngineValidationError);
    });
  });

  describe('computeCommissionSplit', () => {
    it('splits a transaction using the default agent/agency shares', () => {
      const engine = new FinanceEngineArchitectureDouble();
      const result = engine.computeCommissionSplit({ transactionAmountMinorUnits: 1_000_000 });

      expect(result.agentAmountMinorUnits).toBe(25_000);
      expect(result.agencyAmountMinorUnits).toBe(25_000);
      expect(result.referralAmountMinorUnits).toBe(0);
      expect(result.totalMinorUnits).toBe(50_000);
    });

    it('honors overridden share percentages', () => {
      const engine = new FinanceEngineArchitectureDouble();
      const result = engine.computeCommissionSplit({
        transactionAmountMinorUnits: 1_000_000,
        agentSharePercent: 3,
        agencySharePercent: 2,
        referralSharePercent: 1,
      });

      expect(result.agentAmountMinorUnits).toBe(30_000);
      expect(result.agencyAmountMinorUnits).toBe(20_000);
      expect(result.referralAmountMinorUnits).toBe(10_000);
      expect(result.totalMinorUnits).toBe(60_000);
    });

    it('rejects share percentages that sum above 100', () => {
      const engine = new FinanceEngineArchitectureDouble();
      expect(() =>
        engine.computeCommissionSplit({
          transactionAmountMinorUnits: 1_000_000,
          agentSharePercent: 60,
          agencySharePercent: 60,
        })
      ).toThrow(FinanceEngineValidationError);
    });

    it('throws FinanceEngineValidationError for a negative transaction amount', () => {
      const engine = new FinanceEngineArchitectureDouble();
      expect(() => engine.computeCommissionSplit({ transactionAmountMinorUnits: -500 })).toThrow(
        FinanceEngineValidationError
      );
    });
  });

  describe('convertCurrency', () => {
    it('converts using the configured rate table', () => {
      const engine = new FinanceEngineArchitectureDouble();
      const result = engine.convertCurrency({
        amountMinorUnits: 100,
        fromCurrency: 'USD',
        toCurrency: 'AED',
      });

      expect(result.rateApplied).toBe(DEFAULT_FINANCE_ENGINE_DOUBLE_CONFIG.currencyRates.USD_AED);
      expect(result.amountMinorUnits).toBe(
        Math.round(100 * DEFAULT_FINANCE_ENGINE_DOUBLE_CONFIG.currencyRates.USD_AED)
      );
    });

    it('returns the identity conversion (rate 1) for same-currency conversion', () => {
      const engine = new FinanceEngineArchitectureDouble();
      const result = engine.convertCurrency({
        amountMinorUnits: 12_345,
        fromCurrency: 'AED',
        toCurrency: 'AED',
      });

      expect(result.rateApplied).toBe(1);
      expect(result.amountMinorUnits).toBe(12_345);
    });

    it('supports a custom rate injected via configuration override', () => {
      const engine = new FinanceEngineArchitectureDouble({
        currencyRates: { ZZZ_AED: 2 },
      });
      const result = engine.convertCurrency({
        amountMinorUnits: 100,
        fromCurrency: 'ZZZ',
        toCurrency: 'AED',
      });

      expect(result.rateApplied).toBe(2);
      expect(result.amountMinorUnits).toBe(200);
    });

    it('throws FinanceEngineValidationError for an unknown currency code', () => {
      const engine = new FinanceEngineArchitectureDouble();
      expect(() =>
        engine.convertCurrency({
          amountMinorUnits: 100,
          fromCurrency: 'USD',
          toCurrency: 'XXX',
        })
      ).toThrow(FinanceEngineValidationError);
    });

    it('throws FinanceEngineValidationError for a negative amount', () => {
      const engine = new FinanceEngineArchitectureDouble();
      expect(() =>
        engine.convertCurrency({
          amountMinorUnits: -10,
          fromCurrency: 'USD',
          toCurrency: 'AED',
        })
      ).toThrow(FinanceEngineValidationError);
    });
  });

  describe('projectPaymentSchedule', () => {
    it('splits the remaining amount evenly across installments after a down payment', () => {
      const engine = new FinanceEngineArchitectureDouble();
      const result = engine.projectPaymentSchedule({
        totalAmountMinorUnits: 1_000_000,
        installmentCount: 4,
        downPaymentMinorUnits: 200_000,
        startDateIso: '2024-01-01',
      });

      expect(result.downPaymentMinorUnits).toBe(200_000);
      expect(result.installments).toHaveLength(4);
      result.installments.forEach(installment => {
        expect(installment.amountMinorUnits).toBe(200_000);
      });
      expect(result.totalScheduledMinorUnits).toBe(1_000_000);
    });

    it('assigns rounding remainder to the final installment so totals reconcile exactly', () => {
      const engine = new FinanceEngineArchitectureDouble();
      const result = engine.projectPaymentSchedule({
        totalAmountMinorUnits: 100,
        installmentCount: 3,
        startDateIso: '2024-01-01',
      });

      expect(result.installments[0].amountMinorUnits).toBe(33);
      expect(result.installments[1].amountMinorUnits).toBe(33);
      expect(result.installments[2].amountMinorUnits).toBe(34);
      expect(result.totalScheduledMinorUnits).toBe(100);
    });

    it('advances due dates by the configured cadence', () => {
      const engine = new FinanceEngineArchitectureDouble();
      const result = engine.projectPaymentSchedule({
        totalAmountMinorUnits: 300,
        installmentCount: 3,
        startDateIso: '2024-01-01',
        cadenceDays: 30,
      });

      expect(result.installments[0].dueDateIso).toBe('2024-01-01');
      expect(result.installments[1].dueDateIso).toBe('2024-01-31');
      expect(result.installments[2].dueDateIso).toBe('2024-03-01');
    });

    it('throws FinanceEngineValidationError when the down payment exceeds the total', () => {
      const engine = new FinanceEngineArchitectureDouble();
      expect(() =>
        engine.projectPaymentSchedule({
          totalAmountMinorUnits: 100,
          installmentCount: 2,
          downPaymentMinorUnits: 200,
        })
      ).toThrow(FinanceEngineValidationError);
    });

    it('throws FinanceEngineValidationError for a non-positive installment count', () => {
      const engine = new FinanceEngineArchitectureDouble();
      expect(() =>
        engine.projectPaymentSchedule({ totalAmountMinorUnits: 100, installmentCount: 0 })
      ).toThrow(FinanceEngineValidationError);
    });

    it('throws FinanceEngineValidationError for a non-integer installment count', () => {
      const engine = new FinanceEngineArchitectureDouble();
      expect(() =>
        engine.projectPaymentSchedule({ totalAmountMinorUnits: 100, installmentCount: 2.5 })
      ).toThrow(FinanceEngineValidationError);
    });
  });

  describe('config override interchangeability', () => {
    it('allows constructing multiple independent doubles without shared mutable state', () => {
      const engineA = new FinanceEngineArchitectureDouble({ defaultTaxRatePercent: 0 });
      const engineB = new FinanceEngineArchitectureDouble({ defaultTaxRatePercent: 20 });

      const resultA = engineA.computePriceBreakdown({ baseAmountMinorUnits: 1_000 });
      const resultB = engineB.computePriceBreakdown({ baseAmountMinorUnits: 1_000 });

      expect(resultA.taxAmountMinorUnits).toBe(0);
      expect(resultB.taxAmountMinorUnits).toBe(200);
    });
  });
});
