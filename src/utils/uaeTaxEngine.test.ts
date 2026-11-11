import { describe, it, expect } from 'vitest';
import {
  calculateUaeVat,
  calculateCorporateTaxReserve,
  calculateDldAcquisitionCosts,
} from './uaeTaxEngine';

describe('UAE Tax Engine — calculateUaeVat', () => {
  it('calculates 5% VAT on standard commission', () => {
    const result = calculateUaeVat(40000);
    expect(result.vatAmountAED).toBe(2000);
    expect(result.totalWithVatAED).toBe(42000);
    expect(result.vatRatePct).toBe(5);
  });

  it('handles zero gracefully', () => {
    const result = calculateUaeVat(0);
    expect(result.vatAmountAED).toBe(0);
    expect(result.totalWithVatAED).toBe(0);
  });
});

describe('UAE Tax Engine — calculateCorporateTaxReserve', () => {
  it('applies 0% tax for profits under the 375,000 AED threshold', () => {
    const result = calculateCorporateTaxReserve(350000);
    expect(result.taxableProfitAED).toBe(0);
    expect(result.taxReserveAmountAED).toBe(0);
    expect(result.effectiveTaxRatePct).toBe(0);
  });

  it('applies 9% tax strictly on the profit portion above 375,000 AED', () => {
    const result = calculateCorporateTaxReserve(1375000);
    // Taxable profit = 1,375,000 - 375,000 = 1,000,000 AED
    expect(result.taxableProfitAED).toBe(1000000);
    expect(result.taxReserveAmountAED).toBe(90000); // 9% of 1,000,000
    expect(result.effectiveTaxRatePct).toBeCloseTo(6.55, 1);
  });
});

describe('UAE Tax Engine — calculateDldAcquisitionCosts', () => {
  it('calculates standard DLD 4% transfer fee + trustee fees for 2M AED property', () => {
    const costs = calculateDldAcquisitionCosts(2000000);
    expect(costs.dldTransferFeeAED).toBe(80000); // 4% of 2M
    expect(costs.trusteeFeeAED).toBe(4200); // >= 500k AED
    expect(costs.adminFeeAED).toBe(580);
    expect(costs.trusteeVatAED).toBe(210); // 5% on 4,200
    expect(costs.totalFrictionAED).toBe(80000 + 4200 + 580 + 210);
    expect(costs.totalAcquisitionCostAED).toBe(2000000 + costs.totalFrictionAED);
  });

  it('applies reduced trustee fee of 2,100 AED for properties under 500k AED', () => {
    const costs = calculateDldAcquisitionCosts(400000);
    expect(costs.trusteeFeeAED).toBe(2100);
    expect(costs.trusteeVatAED).toBe(105);
  });
});
