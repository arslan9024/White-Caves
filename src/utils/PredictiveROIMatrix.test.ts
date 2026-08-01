import { describe, it, expect } from 'vitest';
import { calculatePredictiveROI } from './PredictiveROIMatrix';

describe('PredictiveROIMatrix Utility', () => {
  it('calculates gross yield and net yield correctly for DAMAC Hills 2 villa', () => {
    const result = calculatePredictiveROI({
      purchasePriceAED: 1500000,
      expectedAnnualRentAED: 120000,
      community: 'DAMAC Hills 2',
      holdingPeriodYears: 3,
    });

    expect(result.grossRentalYield).toBe(8.0); // 120k / 1.5M = 8.0%
    expect(result.netRentalYield).toBeGreaterThan(7.0);
    expect(result.projectedAppreciation3Yr).toBe(18.5);
    expect(result.estimatedTotalProfitAED).toBeGreaterThan(0);
  });

  it('handles zero or invalid purchase price gracefully', () => {
    const result = calculatePredictiveROI({
      purchasePriceAED: 0,
      expectedAnnualRentAED: 100000,
      community: 'Palm Jumeirah',
    });

    expect(result.grossRentalYield).toBe(0);
    expect(result.totalProjectedROI).toBe(0);
  });
});
