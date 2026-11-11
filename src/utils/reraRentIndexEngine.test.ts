import { describe, it, expect } from 'vitest';
import { calculateReraPermissibleIncrease } from './reraRentIndexEngine';

describe('RERA Rent Index Engine — Decree No. 43 of 2013', () => {
  const leaseExpiryDate = '2027-06-30';

  it('permits 0% increase when current rent is within 10% of benchmark (e.g. 95,000 vs 100,000)', () => {
    const result = calculateReraPermissibleIncrease({
      currentAnnualRentAED: 95000,
      reraBenchmarkAnnualRentAED: 100000,
      leaseExpiryDate,
    });

    expect(result.maxPermissibleIncreasePct).toBe(0);
    expect(result.maxPermissibleIncreaseAED).toBe(0);
    expect(result.maxPermissibleNewRentAED).toBe(95000);
    expect(result.isIncreaseAllowed).toBe(false);
  });

  it('permits 5% increase when current rent is 11% to 20% below benchmark (e.g. 85,000 vs 100,000)', () => {
    const result = calculateReraPermissibleIncrease({
      currentAnnualRentAED: 85000,
      reraBenchmarkAnnualRentAED: 100000,
      leaseExpiryDate,
    });

    expect(result.maxPermissibleIncreasePct).toBe(5);
    expect(result.maxPermissibleIncreaseAED).toBe(4250); // 5% of 85,000
    expect(result.maxPermissibleNewRentAED).toBe(89250);
    expect(result.isIncreaseAllowed).toBe(true);
  });

  it('permits 10% increase when current rent is 21% to 30% below benchmark (e.g. 75,000 vs 100,000)', () => {
    const result = calculateReraPermissibleIncrease({
      currentAnnualRentAED: 75000,
      reraBenchmarkAnnualRentAED: 100000,
      leaseExpiryDate,
    });

    expect(result.maxPermissibleIncreasePct).toBe(10);
    expect(result.maxPermissibleIncreaseAED).toBe(7500);
    expect(result.maxPermissibleNewRentAED).toBe(82500);
  });

  it('permits 15% increase when current rent is 31% to 40% below benchmark (e.g. 65,000 vs 100,000)', () => {
    const result = calculateReraPermissibleIncrease({
      currentAnnualRentAED: 65000,
      reraBenchmarkAnnualRentAED: 100000,
      leaseExpiryDate,
    });

    expect(result.maxPermissibleIncreasePct).toBe(15);
    expect(result.maxPermissibleIncreaseAED).toBe(9750);
    expect(result.maxPermissibleNewRentAED).toBe(74750);
  });

  it('permits 20% increase when current rent is > 40% below benchmark (e.g. 50,000 vs 100,000)', () => {
    const result = calculateReraPermissibleIncrease({
      currentAnnualRentAED: 50000,
      reraBenchmarkAnnualRentAED: 100000,
      leaseExpiryDate,
    });

    expect(result.maxPermissibleIncreasePct).toBe(20);
    expect(result.maxPermissibleIncreaseAED).toBe(10000);
    expect(result.maxPermissibleNewRentAED).toBe(60000);
  });

  it('correctly calculates 90-day statutory notice cutoff date', () => {
    const result = calculateReraPermissibleIncrease({
      currentAnnualRentAED: 80000,
      reraBenchmarkAnnualRentAED: 100000,
      leaseExpiryDate: '2027-06-30',
    });

    // 90 days before June 30, 2027 is April 1, 2027
    expect(result.statutory90DayNoticeCutoffDate).toBe('2027-04-01');
  });

  it('flags over-market benchmark if tenant is paying > 10% above market', () => {
    const result = calculateReraPermissibleIncrease({
      currentAnnualRentAED: 120000,
      reraBenchmarkAnnualRentAED: 100000,
      leaseExpiryDate,
    });

    expect(result.isOverBenchmarkFlag).toBe(true);
    expect(result.maxPermissibleIncreasePct).toBe(0);
  });
});
