import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePullToRefreshLogic } from './PullToRefreshWrapper.logic';

describe('PullToRefreshWrapper.logic', () => {
  it('initializes in idle state', () => {
    const onRefresh = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => usePullToRefreshLogic(onRefresh));

    expect(result.current.isPulling).toBe(false);
    expect(result.current.isRefreshing).toBe(false);
    expect(result.current.pullDistance).toBe(0);
    expect(result.current.threshold).toBe(70);
  });

  it('triggers onRefresh when pull exceeds threshold', async () => {
    const onRefresh = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => usePullToRefreshLogic(onRefresh));

    // Simulate touch start
    act(() => {
      result.current.onTouchStart({
        touches: [{ clientY: 100 }],
      } as any);
    });

    expect(result.current.isPulling).toBe(true);

    // Simulate touch move beyond threshold
    act(() => {
      result.current.onTouchMove({
        touches: [{ clientY: 190 }],
      } as any);
    });

    expect(result.current.pullDistance).toBe(90);

    // Simulate touch end
    await act(async () => {
      await result.current.onTouchEnd();
    });

    expect(onRefresh).toHaveBeenCalled();
    expect(result.current.isRefreshing).toBe(false);
  });
});
