import { describe, it, expect } from 'vitest';
import { calculateReraPermissibleRent, fetchWithDldFallback } from '../reraRentalCalculator';

describe('RERA Rental Increase Calculator & DLD Fallback', () => {
  it('allows 0% increase if current rent is within 10% of market average', () => {
    const result = calculateReraPermissibleRent({
      currentRentAed: 100_000,
      benchmarkAverageRentAed: 108_000,
      propertyType: 'APARTMENT',
      contractRenewalDate: '2026-12-01'
    });
    expect(result.maxPermissibleIncreasePercentage).toBe(0);
    expect(result.maxPermissibleNewRentAed).toBe(100_000);
    expect(result.isEligibleForIncrease).toBe(false);
  });

  it('allows 5% increase if current rent is 11% to 20% below market average', () => {
    const result = calculateReraPermissibleRent({
      currentRentAed: 100_000,
      benchmarkAverageRentAed: 115_000,
      propertyType: 'APARTMENT',
      contractRenewalDate: '2026-12-01'
    });
    expect(result.maxPermissibleIncreasePercentage).toBe(5);
    expect(result.maxPermissibleNewRentAed).toBe(105_000);
    expect(result.legalNoticeRequirementDays).toBe(90);
  });

  it('allows maximum 20% cap if rent is > 40% below market average', () => {
    const result = calculateReraPermissibleRent({
      currentRentAed: 100_000,
      benchmarkAverageRentAed: 150_000,
      propertyType: 'VILLA',
      contractRenewalDate: '2026-12-01'
    });
    expect(result.maxPermissibleIncreasePercentage).toBe(20);
    expect(result.maxPermissibleNewRentAed).toBe(120_000);
    expect(result.annualRentIncreaseAmountAed).toBe(20_000);
  });

  it('falls back to cached title deed data when DLD network call exceeds timeout', async () => {
    const slowCall = new Promise<string>((resolve) => setTimeout(() => resolve('LIVE_OK'), 3000));
    const cachedData = 'CACHED_DEED_1388443';

    const res = await fetchWithDldFallback(slowCall, cachedData, 20); // 20ms quick timeout
    expect(res.source).toBe('LOCAL_INDEX_FALLBACK');
    expect(res.data).toBe(cachedData);
  });
});
