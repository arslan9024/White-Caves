import { describe, it, expect } from 'vitest';
import {
  calculateMortgage,
  calculateROI,
  MortgageInput,
  ROIInput,
} from './financeWorker';

describe('financeWorker Engine', () => {
  describe('calculateMortgage', () => {
    it('calculates Dubai mortgage with 20% down payment and 4% DLD fee correctly', () => {
      const input: MortgageInput = {
        propertyPrice: 2_000_000,
        downPaymentPercent: 20,
        interestRateAnnual: 4.5,
        loanTenureYears: 25,
      };

      const result = calculateMortgage(input);

      expect(result.loanAmount).toBe(1_600_000);
      expect(result.upfrontCosts.downPayment).toBe(400_000);
      expect(result.upfrontCosts.dldFee).toBe(80_000); // 4% of 2M
      expect(result.upfrontCosts.agencyFee).toBe(40_000); // 2% of 2M
      expect(result.upfrontCosts.totalUpfront).toBe(520_000);
      expect(result.monthlyInstallment).toBeGreaterThan(8000);
      expect(result.monthlyInstallment).toBeLessThan(10000);
    });
  });

  describe('calculateROI', () => {
    it('computes gross yield, net yield, capital appreciation, and total 5-year ROI', () => {
      const input: ROIInput = {
        purchasePrice: 1_000_000,
        annualRent: 80_000,
        serviceChargesAnnual: 10_000,
        managementFeeAnnual: 5_000,
        capitalAppreciationRateAnnual: 5,
        years: 5,
      };

      const result = calculateROI(input);

      expect(result.grossYieldPercent).toBe(8.0); // 80k / 1M = 8%
      expect(result.netYieldPercent).toBe(6.5); // 65k / 1M = 6.5%
      expect(result.totalRentalIncome).toBe(325_000); // 65k * 5
      expect(result.projectedValue).toBeGreaterThan(1_200_000);
      expect(result.totalROI).toBeGreaterThan(50); // Total net income / 1M
    });
  });
});
