/**
 * usePrefetch — Unit Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePrefetch, prefetchRoute, clearPrefetchCache } from './usePrefetch';

describe('usePrefetch', () => {
  beforeEach(() => {
    clearPrefetchCache();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns a prefetch function', () => {
    const { result } = renderHook(() => usePrefetch());
    expect(typeof result.current).toBe('function');
  });

  it('calls the factory function via idle callback', () => {
    const factory = vi.fn().mockResolvedValue({ default: () => null });
    const { result } = renderHook(() => usePrefetch());

    act(() => {
      result.current(factory, 'test-route');
    });

    // Factory not called synchronously
    expect(factory).not.toHaveBeenCalled();

    // Advance past setTimeout fallback (1ms)
    act(() => {
      vi.advanceTimersByTime(10);
    });

    expect(factory).toHaveBeenCalledTimes(1);
  });

  it('deduplicates — same key only prefetched once', () => {
    const factory = vi.fn().mockResolvedValue({ default: () => null });
    const { result } = renderHook(() => usePrefetch());

    act(() => {
      result.current(factory, 'properties');
    });
    act(() => {
      vi.advanceTimersByTime(10);
    });

    // Call again with same key
    act(() => {
      result.current(factory, 'properties');
    });
    act(() => {
      vi.advanceTimersByTime(10);
    });

    expect(factory).toHaveBeenCalledTimes(1);
  });

  it('removes from cache on factory rejection (allows retry)', async () => {
    const factory = vi.fn().mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => usePrefetch());

    act(() => {
      result.current(factory, 'failing-route');
    });
    act(() => {
      vi.advanceTimersByTime(10);
    });

    // Wait for the rejection to be handled
    await vi.runAllTimersAsync();

    // Should allow retry since it was removed from cache
    act(() => {
      result.current(factory, 'failing-route');
    });
    act(() => {
      vi.advanceTimersByTime(10);
    });

    expect(factory).toHaveBeenCalledTimes(2);
  });
});

describe('prefetchRoute (imperative)', () => {
  beforeEach(() => {
    clearPrefetchCache();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls the factory function', () => {
    const factory = vi.fn().mockResolvedValue({ default: () => null });
    prefetchRoute(factory, 'imperative-route');

    vi.advanceTimersByTime(10);
    expect(factory).toHaveBeenCalledTimes(1);
  });

  it('deduplicates repeated calls', () => {
    const factory = vi.fn().mockResolvedValue({ default: () => null });
    prefetchRoute(factory, 'dup-route');

    // Let first idle callback fire so dedup key is registered
    vi.advanceTimersByTime(10);

    prefetchRoute(factory, 'dup-route');
    vi.advanceTimersByTime(10);

    expect(factory).toHaveBeenCalledTimes(1);
  });
});

describe('clearPrefetchCache', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    clearPrefetchCache();
    vi.useRealTimers();
  });

  it('allows re-prefetch after cache clear', () => {
    const factory = vi.fn().mockResolvedValue({ default: () => null });
    prefetchRoute(factory, 'cache-route');
    vi.advanceTimersByTime(10);
    expect(factory).toHaveBeenCalledTimes(1);

    clearPrefetchCache();

    prefetchRoute(factory, 'cache-route');
    vi.advanceTimersByTime(10);
    expect(factory).toHaveBeenCalledTimes(2);
  });
});
