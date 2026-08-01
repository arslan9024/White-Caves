import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePredictiveROI } from './usePredictiveROI';

describe('usePredictiveROI Hook', () => {
  it('returns memoized ROI metrics correctly', () => {
    const { result } = renderHook(() =>
      usePredictiveROI({
        purchasePriceAED: 2000000,
        expectedAnnualRentAED: 160000,
        community: 'Palm Jumeirah',
      })
    );

    expect(result.current.grossRentalYield).toBe(8.0);
    expect(result.current.projectedAppreciation3Yr).toBe(24.0);
  });
});
