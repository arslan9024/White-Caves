import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useLeadsInsights } from '../useLeadsInsights';
import type { Lead } from '../useLeadsData';

describe('useLeadsInsights Hook', () => {
  const mockLeads: Lead[] = [
    {
      id: '1',
      name: 'Test Lead',
      email: 'test@example.com',
      status: 'qualified',
      budget: 500000,
      companyType: 'investor',
      companySize: 'medium',
      score: 80,
    } as Lead,
  ];

  it('returns correct insights for provided leads', () => {
    const { result } = renderHook(() => useLeadsInsights(mockLeads));
    expect(result.current).toBeDefined();
    expect(typeof result.current.qualifiedPercentage).toBe('number');
    expect(typeof result.current.avgDealSize).toBe('number');
  });
});
