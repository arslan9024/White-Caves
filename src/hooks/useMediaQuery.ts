/**
 * useMediaQuery — Reactive viewport breakpoint hook
 *
 * Subscribes to window.matchMedia and re-renders when the query result changes.
 * SSR-safe: defaults to `false` when window is not available.
 *
 * Usage:
 *   const isMobile = useMediaQuery('(max-width: 768px)');
 *   const prefersReduced = useMediaQuery('(prefers-reduced-motion: reduce)');
 *
 * Convenience hooks are exported below for common breakpoints.
 */

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';

// ─── Core hook ────────────────────────────────────────────────────────────

function subscribe(query: string, callback: () => void): () => void {
  const mql = window.matchMedia(query);
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
}

function getSnapshot(query: string): boolean {
  return window.matchMedia(query).matches;
}

function getServerSnapshot(): boolean {
  return false; // SSR default
}

export function useMediaQuery(query: string): boolean {
  const subscribeFn = useCallback(
    (callback: () => void) => subscribe(query, callback),
    [query],
  );
  const snapshotFn = useCallback(() => getSnapshot(query), [query]);

  return useSyncExternalStore(subscribeFn, snapshotFn, getServerSnapshot);
}

// ─── Convenience hooks ────────────────────────────────────────────────────
// Aligned with src/styles/theme/breakpoints.ts values

/** True when viewport ≤ 480px (small phones) */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 480px)');
}

/** True when viewport ≤ 768px (tablets and below) */
export function useIsTablet(): boolean {
  return useMediaQuery('(max-width: 768px)');
}

/** True when viewport ≤ 1024px (tablet landscape / small desktop) */
export function useIsTabletLandscape(): boolean {
  return useMediaQuery('(max-width: 1024px)');
}

/** True when viewport ≥ 1024px (desktop and up) */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}

/** True when viewport ≥ 1200px (medium desktop) */
export function useIsDesktopMd(): boolean {
  return useMediaQuery('(min-width: 1200px)');
}

/** True when viewport ≥ 1920px (large desktop / UHD) */
export function useIsDesktopLg(): boolean {
  return useMediaQuery('(min-width: 1920px)');
}

/** True when user prefers reduced motion */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

export default useMediaQuery;
