import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePredictiveHover, PredictiveTarget } from '../usePredictiveHover';

describe('usePredictiveHover Hook', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes with empty prefetched list', () => {
    const { result } = renderHook(() => usePredictiveHover([]));
    expect(result.current.prefetchedIds).toEqual([]);
  });

  it('triggers prefetch when mouse trajectory projects inside target bounds', () => {
    const onPrefetch = vi.fn();
    const targets: PredictiveTarget[] = [
      {
        id: 'sales-tab',
        bounds: { left: 100, top: 100, right: 300, bottom: 300 },
        onPrefetch,
      },
    ];

    const { result } = renderHook(() => usePredictiveHover(targets, 0.1));

    // Simulate mouse moving towards target (100, 100)
    act(() => {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 20, clientY: 20 }));
    });

    act(() => {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 50, clientY: 50 }));
    });

    expect(onPrefetch).toHaveBeenCalledTimes(1);
    expect(result.current.prefetchedIds).toContain('sales-tab');
  });

  it('allows clearing prefetched target list', () => {
    const onPrefetch = vi.fn();
    const targets: PredictiveTarget[] = [
      {
        id: 'finance-tab',
        bounds: { left: 0, top: 0, right: 500, bottom: 500 },
        onPrefetch,
      },
    ];

    const { result } = renderHook(() => usePredictiveHover(targets, 0.1));

    act(() => {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 10, clientY: 10 }));
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 20, clientY: 20 }));
    });

    act(() => {
      result.current.clearPrefetched();
    });

    expect(result.current.prefetchedIds).toEqual([]);
  });
});
