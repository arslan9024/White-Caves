import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFinanceWorker } from './useFinanceWorker';

describe('useFinanceWorker', () => {
  it('computes mortgage calculations asynchronously', async () => {
    const { result } = renderHook(() => useFinanceWorker());

    let mortgageRes: any;
    await act(async () => {
      mortgageRes = await result.current.computeMortgage({
        propertyPrice: 5000000,
        downPaymentPercent: 20,
        interestRateAnnual: 4.5,
        loanTenureYears: 25,
      });
    });

    expect(mortgageRes).toBeDefined();
    expect(mortgageRes.monthlyInstallment).toBeGreaterThan(0);
    expect(mortgageRes.loanAmount).toBe(4000000);
  });

  it('computes ROI calculations', async () => {
    const { result } = renderHook(() => useFinanceWorker());

    let roiRes: any;
    await act(async () => {
      roiRes = await result.current.computeROI({
        purchasePrice: 2000000,
        annualRent: 160000,
        serviceChargesAnnual: 20000,
        managementFeeAnnual: 5000,
        capitalAppreciationRateAnnual: 5,
        years: 5,
      });
    });

    expect(roiRes).toBeDefined();
    expect(roiRes.netYieldPercent).toBeGreaterThan(0);
  });
});
