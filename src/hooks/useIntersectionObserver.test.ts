/**
 * useIntersectionObserver — Unit Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIntersectionObserver } from './useIntersectionObserver';

/* ──────────────────────────── Mock IntersectionObserver ────────── */

type IntersectionCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;

let mockObserve: ReturnType<typeof vi.fn>;
let mockDisconnect: ReturnType<typeof vi.fn>;
let mockCallback: IntersectionCallback;

class MockIntersectionObserver {
  constructor(callback: IntersectionCallback) {
    mockCallback = callback;
    this.observe = mockObserve;
    this.disconnect = mockDisconnect;
  }
  observe: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
  unobserve = vi.fn();
  takeRecords = vi.fn().mockReturnValue([]);
  root = null;
  rootMargin = '0px';
  thresholds = [0];
}

beforeEach(() => {
  mockObserve = vi.fn();
  mockDisconnect = vi.fn();
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

/* ──────────────────────────── Tests ───────────────────────────── */

describe('useIntersectionObserver', () => {
  it('returns ref, isIntersecting, and entry', () => {
    const { result } = renderHook(() => useIntersectionObserver());
    expect(result.current.ref).toBeDefined();
    expect(result.current.isIntersecting).toBe(false);
    expect(result.current.entry).toBeNull();
  });

  it('observes element when ref callback is called', () => {
    const { result } = renderHook(() => useIntersectionObserver());
    const div = document.createElement('div');

    act(() => {
      result.current.ref(div);
    });

    expect(mockObserve).toHaveBeenCalledWith(div);
  });

  it('sets isIntersecting=true when element enters viewport', () => {
    const { result } = renderHook(() => useIntersectionObserver());
    const div = document.createElement('div');

    act(() => {
      result.current.ref(div);
    });

    act(() => {
      mockCallback([{ isIntersecting: true } as IntersectionObserverEntry]);
    });

    expect(result.current.isIntersecting).toBe(true);
  });

  it('disconnects after first intersection when triggerOnce=true (default)', () => {
    const { result } = renderHook(() => useIntersectionObserver({ triggerOnce: true }));
    const div = document.createElement('div');

    act(() => {
      result.current.ref(div);
    });

    act(() => {
      mockCallback([{ isIntersecting: true } as IntersectionObserverEntry]);
    });

    expect(mockDisconnect).toHaveBeenCalled();
    expect(result.current.isIntersecting).toBe(true);
  });

  it('stays observed when triggerOnce=false', () => {
    const { result } = renderHook(() =>
      useIntersectionObserver({ triggerOnce: false }),
    );
    const div = document.createElement('div');

    act(() => {
      result.current.ref(div);
    });

    act(() => {
      mockCallback([{ isIntersecting: true } as IntersectionObserverEntry]);
    });

    // disconnect should NOT have been called after intersection
    expect(mockDisconnect).not.toHaveBeenCalled();

    // Element leaves viewport
    act(() => {
      mockCallback([{ isIntersecting: false } as IntersectionObserverEntry]);
    });

    expect(result.current.isIntersecting).toBe(false);
  });

  it('does not observe when enabled=false', () => {
    const { result } = renderHook(() =>
      useIntersectionObserver({ enabled: false }),
    );
    const div = document.createElement('div');

    act(() => {
      result.current.ref(div);
    });

    expect(mockObserve).not.toHaveBeenCalled();
  });

  it('disconnects on unmount', () => {
    const { result, unmount } = renderHook(() => useIntersectionObserver());
    const div = document.createElement('div');

    act(() => {
      result.current.ref(div);
    });

    unmount();
    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('stores the full IntersectionObserverEntry', () => {
    const { result } = renderHook(() => useIntersectionObserver());
    const div = document.createElement('div');

    act(() => {
      result.current.ref(div);
    });

    const mockEntry = {
      isIntersecting: true,
      intersectionRatio: 0.5,
      boundingClientRect: {} as DOMRectReadOnly,
    } as IntersectionObserverEntry;

    act(() => {
      mockCallback([mockEntry]);
    });

    expect(result.current.entry).toBe(mockEntry);
  });
});
