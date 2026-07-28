import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useAdminDashboardData } from './useAdminDashboardData';

const mockAuthFetch = vi.fn();

vi.mock('../../../utils/authFetch', () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
}));

const mockSummary = {
  success: true,
  data: {
    metrics: {
      totalProperties: 50,
      availableProperties: 35,
      totalCommissions: 20,
      totalCommissionValue: 100000,
      paidCommissionValue: 80000,
    },
    recentActivities: [
      { id: 1, type: 'create', action: 'Created new user', timestamp: '2026-07-28T10:00:00Z', user: 'Admin' },
    ],
  },
};

const mockActivities = {
  data: [
    { id: 1, type: 'create', action: 'Created listing', timestamp: '2026-07-28T10:00:00Z', user: 'Nadia' },
  ],
};

const mockUsers = {
  data: [
    { id: 1, name: 'Nadia Yusuf', role: 'agent', status: 'active', updatedAt: '2026-07-28T10:00:00Z' },
    { id: 2, name: 'Sarah', role: 'admin', status: 'active', updatedAt: '2026-07-28T10:00:00Z' },
  ],
};

describe('useAdminDashboardData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('provides initial metrics and fallback values on mount', async () => {
    mockAuthFetch.mockImplementation(url => {
      if (url === '/api/dashboard/summary') return Promise.resolve({ json: () => Promise.resolve(mockSummary) });
      if (url === '/api/dashboard/activities?pageSize=20') return Promise.resolve({ json: () => Promise.resolve(mockActivities) });
      if (url === '/api/users?pageSize=100') return Promise.resolve({ json: () => Promise.resolve(mockUsers) });
      return Promise.reject(new Error('Unknown endpoint'));
    });

    const { result } = renderHook(() => useAdminDashboardData());

    await waitFor(() => {
      expect(result.current.systemMetrics.totalProperties).toBe(50);
    });

    expect(result.current.systemMetrics.activeListings).toBe(35);
    expect(result.current.systemMetrics.totalUsers).toBe(2);
    expect(result.current.systemMetrics.activeUsers).toBe(2);
    expect(result.current.alerts.length).toBeGreaterThan(0);
  });

  it('handles pagination updates for activities and users', async () => {
    mockAuthFetch.mockImplementation(url => {
      if (url === '/api/dashboard/summary') return Promise.resolve({ json: () => Promise.resolve(mockSummary) });
      if (url === '/api/dashboard/activities?pageSize=20') return Promise.resolve({ json: () => Promise.resolve(mockActivities) });
      if (url === '/api/users?pageSize=100') return Promise.resolve({ json: () => Promise.resolve(mockUsers) });
      return Promise.reject(new Error('Unknown endpoint'));
    });

    const { result } = renderHook(() => useAdminDashboardData());

    await waitFor(() => {
      expect(result.current.systemMetrics.totalProperties).toBe(50);
    });

    act(() => {
      result.current.setFilterPeriod('30d');
      result.current.setCurrentActivityPage(2);
      result.current.setCurrentUsersPage(2);
    });

    expect(result.current.filterPeriod).toBe('30d');
    expect(result.current.currentActivityPage).toBe(2);
    expect(result.current.currentUsersPage).toBe(2);
  });

  it('falls back to default system metrics when network calls reject', async () => {
    mockAuthFetch.mockRejectedValue(new Error('Network offline'));

    const { result } = renderHook(() => useAdminDashboardData());

    await act(async () => {
      await result.current.refreshData();
    });

    expect(result.current.systemMetrics.totalUsers).toBeDefined();
    expect(result.current.isLoading).toBe(false);
  });
});
