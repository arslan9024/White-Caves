import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMobileDashboardPageLogic } from './MobileDashboardPage.logic';

describe('MobileDashboardPage.logic', () => {
  it('initializes with default agent name and recent activities', () => {
    const { result } = renderHook(() => useMobileDashboardPageLogic());

    expect(result.current.agentName).toBe('Arslan Malik');
    expect(result.current.activities.length).toBeGreaterThanOrEqual(4);
    expect(result.current.isRefreshing).toBe(false);
  });

  it('handles refresh state asynchronously', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useMobileDashboardPageLogic());

    let refreshPromise: Promise<void>;
    act(() => {
      refreshPromise = result.current.handleRefresh();
    });

    expect(result.current.isRefreshing).toBe(true);

    await act(async () => {
      vi.advanceTimersByTime(1300);
      await refreshPromise;
    });

    expect(result.current.isRefreshing).toBe(false);
    vi.useRealTimers();
  });
});
