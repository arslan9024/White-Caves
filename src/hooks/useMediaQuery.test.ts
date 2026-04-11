/**
 * useMediaQuery — Unit tests
 *
 * Tests the core useMediaQuery hook and convenience hooks.
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsTabletLandscape,
  useIsDesktop,
  useIsDesktopMd,
  useIsDesktopLg,
  usePrefersReducedMotion,
} from './useMediaQuery';

// ─── matchMedia mock ──────────────────────────────────────────────────────

type MediaQueryListener = (e: { matches: boolean }) => void;

let listeners: Map<string, Set<MediaQueryListener>>;
let matchState: Map<string, boolean>;

function createMockMatchMedia() {
  return vi.fn().mockImplementation((query: string) => {
    if (!matchState.has(query)) matchState.set(query, false);
    if (!listeners.has(query)) listeners.set(query, new Set());

    const mql = {
      matches: matchState.get(query) ?? false,
      media: query,
      onchange: null,
      addEventListener: vi.fn((_, cb: MediaQueryListener) => {
        listeners.get(query)!.add(cb);
      }),
      removeEventListener: vi.fn((_, cb: MediaQueryListener) => {
        listeners.get(query)!.delete(cb);
      }),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };

    // Override matches getter to be dynamic
    Object.defineProperty(mql, 'matches', {
      get: () => matchState.get(query) ?? false,
    });

    return mql;
  });
}

function setMatch(query: string, matches: boolean) {
  matchState.set(query, matches);
  const cbs = listeners.get(query);
  if (cbs) cbs.forEach(cb => cb({ matches }));
}

beforeEach(() => {
  listeners = new Map();
  matchState = new Map();
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: createMockMatchMedia(),
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ─── Tests ────────────────────────────────────────────────────────────────

describe('useMediaQuery', () => {
  it('returns false by default when query does not match', () => {
    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));
    expect(result.current).toBe(false);
  });

  it('returns true when query matches', () => {
    matchState.set('(max-width: 768px)', true);
    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));
    expect(result.current).toBe(true);
  });

  it('updates when viewport changes', () => {
    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));
    expect(result.current).toBe(false);

    act(() => setMatch('(max-width: 768px)', true));
    expect(result.current).toBe(true);

    act(() => setMatch('(max-width: 768px)', false));
    expect(result.current).toBe(false);
  });

  it('cleans up listener on unmount', () => {
    const { unmount } = renderHook(() => useMediaQuery('(max-width: 480px)'));
    const cbs = listeners.get('(max-width: 480px)');
    expect(cbs?.size).toBeGreaterThan(0);

    unmount();
    // After unmount, listener should be removed
    expect(cbs?.size).toBe(0);
  });

  it('handles query string changes', () => {
    const { result, rerender } = renderHook(
      ({ q }: { q: string }) => useMediaQuery(q),
      { initialProps: { q: '(max-width: 480px)' } },
    );
    expect(result.current).toBe(false);

    matchState.set('(min-width: 1024px)', true);
    rerender({ q: '(min-width: 1024px)' });
    expect(result.current).toBe(true);
  });
});

describe('convenience hooks', () => {
  it('useIsMobile — returns true when ≤ 480px', () => {
    matchState.set('(max-width: 480px)', true);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('useIsTablet — returns true when ≤ 768px', () => {
    matchState.set('(max-width: 768px)', true);
    const { result } = renderHook(() => useIsTablet());
    expect(result.current).toBe(true);
  });

  it('useIsTabletLandscape — returns true when ≤ 1024px', () => {
    matchState.set('(max-width: 1024px)', true);
    const { result } = renderHook(() => useIsTabletLandscape());
    expect(result.current).toBe(true);
  });

  it('useIsDesktop — returns true when ≥ 1024px', () => {
    matchState.set('(min-width: 1024px)', true);
    const { result } = renderHook(() => useIsDesktop());
    expect(result.current).toBe(true);
  });

  it('useIsDesktopMd — returns true when ≥ 1200px', () => {
    matchState.set('(min-width: 1200px)', true);
    const { result } = renderHook(() => useIsDesktopMd());
    expect(result.current).toBe(true);
  });

  it('useIsDesktopLg — returns true when ≥ 1920px', () => {
    matchState.set('(min-width: 1920px)', true);
    const { result } = renderHook(() => useIsDesktopLg());
    expect(result.current).toBe(true);
  });

  it('usePrefersReducedMotion — returns true when set', () => {
    matchState.set('(prefers-reduced-motion: reduce)', true);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(true);
  });

  it('all convenience hooks default to false', () => {
    const hooks = [
      useIsMobile, useIsTablet, useIsTabletLandscape,
      useIsDesktop, useIsDesktopMd, useIsDesktopLg,
      usePrefersReducedMotion,
    ];

    hooks.forEach(hook => {
      const { result } = renderHook(() => hook());
      expect(result.current).toBe(false);
    });
  });
});
