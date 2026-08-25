import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToolsDashboardLogic } from './ToolsDashboard.logic';

describe('ToolsDashboard.logic', () => {
  it('calculates mortgage stats, yields, and DLD fees accurately', () => {
    const { result } = renderHook(() => useToolsDashboardLogic());

    expect(result.current.mortgageStats.loanAmount).toBe(2000000);
    expect(result.current.mortgageStats.downPaymentAmount).toBe(500000);
    expect(result.current.dldFees.dldTransferFee).toBe(100000); // 4% of 2.5M
    expect(result.current.yieldStats.grossYield).toBeGreaterThan(0);

    act(() => {
      result.current.setPropertyPrice(5000000);
      result.current.setDownPaymentPercent(25);
    });

    expect(result.current.mortgageStats.loanAmount).toBe(3750000);
    expect(result.current.mortgageStats.downPaymentAmount).toBe(1250000);
    expect(result.current.dldFees.dldTransferFee).toBe(200000); // 4% of 5M
  });
});
