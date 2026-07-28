import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAdminDashboardData } from '../useAdminDashboardData';

vi.mock('../../../utils/authFetch', () => ({
  authFetch: vi.fn().mockImplementation((url) => {
    if (url.includes('/summary')) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: {
              metrics: {
                totalProperties: 100,
                availableProperties: 85,
                totalCommissions: 12,
                totalCommissionValue: 450000,
                paidCommissionValue: 300000,
              },
              recentActivities: [
                { id: '1', user: 'Arslan Malik', action: 'Login', time: '5m ago', type: 'system' },
              ],
            },
          }),
      });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true, users: [] }),
    });
  }),
}));

describe('useAdminDashboardData Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with system metrics and default filter period', () => {
    const { result } = renderHook(() => useAdminDashboardData());
    expect(result.current.systemMetrics.totalUsers).toBeGreaterThan(0);
    expect(result.current.filterPeriod).toBe('7d');
    expect(result.current.isRefreshing).toBe(false);
  });

  it('allows filter period switching', () => {
    const { result } = renderHook(() => useAdminDashboardData());
    act(() => {
      result.current.setFilterPeriod('30d');
    });
    expect(result.current.filterPeriod).toBe('30d');
  });

  it('allows pagination state updating for activities', () => {
    const { result } = renderHook(() => useAdminDashboardData());
    act(() => {
      result.current.setCurrentActivityPage(2);
    });
    expect(result.current.currentActivityPage).toBe(2);
  });
});
