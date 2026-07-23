import { useEffect, useRef } from 'react';

type ImportFn = () => Promise<any>;
const prefetchRegistry = new Map<string, ImportFn>();

/**
 * Registers a route dynamic import function for pre-fetching.
 */
export const registerPrefetch = (route: string, importFn: ImportFn) => {
  prefetchRegistry.set(route, importFn);
};

/**
 * Manually trigger the dynamic import of a registered route.
 */
export const prefetchRoute = (route: string) => {
  const importFn = prefetchRegistry.get(route);
  if (importFn) {
    importFn().catch(() => {});
  }
};

/**
 * Custom hook to pre-load route dynamic imports when user hovers over a link
 * for more than 80ms, indicating a high-probability click intent.
 */
export const usePredictiveHover = () => {
  const hoverTimeoutRef = useRef<number | null>(null);

  const handleMouseEnter = (route: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    // Hover duration >= 80ms indicates high navigation intent
    hoverTimeoutRef.current = window.setTimeout(() => {
      prefetchRoute(route);
    }, 80);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  };
};
