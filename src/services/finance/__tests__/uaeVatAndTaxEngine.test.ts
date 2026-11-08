import { describe, it, expect } from 'vitest';
import {
  calculateDealVatAndCorporateTax,
  CORPORATE_TAX_STATUTORY_THRESHOLD_AED
} from '../uaeVatAndTaxEngine';

describe('UAE FTA 5% VAT & 9% Corporate Tax Treasury Engine', () => {
  it('computes exact 5% VAT and baseline 60% agent split below corporate tax threshold', () => {
    const res = calculateDealVatAndCorporateTax({
      dealId: 'DEAL-DXB-001',
      grossTransactionValueAed: 5_000_000,
      agencyGrossCommissionAed: 100_000, // 2% of 5M
      agentMeritXp: 1200, // Standard tier -> 60%
      quarterCumulativeProfitAed: 150_000, // Combined = 190,000 < 375,000
      isCommercial: false
    });

    expect(res.vatAmountAed).toBe(5_000);
    expect(res.totalCommissionWithVatAed).toBe(105_000);
    expect(res.agentCommissionTierPercent).toBe(60);
    expect(res.agentNetPayoutAed).toBe(60_000);
    expect(res.companyNetRetainedAed).toBe(40_000);
    expect(res.corporateTaxApplicable).toBe(false);
    expect(res.corporateTaxReserveAmountAed).toBe(0);
  });

  it('elevates top performer to 70% commission split and reserves 9% corporate tax above threshold', () => {
    const res = calculateDealVatAndCorporateTax({
      dealId: 'DEAL-PALM-PENTHOUSE',
      grossTransactionValueAed: 40_000_000,
      agencyGrossCommissionAed: 800_000,
      agentMeritXp: 5500, // Top Performer -> 70% split
      quarterCumulativeProfitAed: 400_000, // Already above 375,000 threshold
      isCommercial: true
    });

    expect(res.vatAmountAed).toBe(40_000); // 5% of 800k
    expect(res.agentCommissionTierPercent).toBe(70);
    expect(res.agentNetPayoutAed).toBe(560_000); // 70% of 800k

    // Company gross share = 240,000
    // 9% corporate tax on 240,000 = 21,600
    expect(res.corporateTaxApplicable).toBe(true);
    expect(res.corporateTaxRatePercent).toBe(9);
    expect(res.corporateTaxReserveAmountAed).toBe(21_600);
    expect(res.companyNetRetainedAed).toBe(218_400); // 240,000 - 21,600
  });
});
