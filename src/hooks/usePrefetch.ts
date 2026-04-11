/**
 * usePrefetch — Preload route chunks on hover/focus for instant navigation
 *
 * Uses requestIdleCallback (fallback: setTimeout) to preload lazy-loaded
 * route components when the user hovers over or focuses a navigation link.
 * This eliminates the loading spinner on navigation for anticipated routes.
 *
 * Usage:
 *   const prefetch = usePrefetch();
 *
 *   <Link to="/properties" onMouseEnter={() => prefetch(() => import('../pages/PropertiesPage'))}>
 *     Properties
 *   </Link>
 *
 * Or with the convenience component:
 *   <PrefetchLink to="/properties" factory={() => import('../pages/PropertiesPage')}>
 *     Properties
 *   </PrefetchLink>
 *
 * @module hooks/usePrefetch
 */

import { useCallback, useRef } from 'react';

type LazyFactory = () => Promise<{ default: React.ComponentType<unknown> }>;

/** Set of already-prefetched factory references (deduplication) */
const prefetched = new Set<string>();

/**
 * requestIdleCallback with fallback for Safari / older browsers.
 */
const scheduleIdle =
  typeof window !== 'undefined' && 'requestIdleCallback' in window
    ? window.requestIdleCallback
    : (cb: () => void) => setTimeout(cb, 1);

const cancelIdle =
  typeof window !== 'undefined' && 'cancelIdleCallback' in window
    ? window.cancelIdleCallback
    : (id: number) => clearTimeout(id);

/**
 * usePrefetch — Returns a function to preload a lazy import during idle time.
 *
 * Deduplicates calls (each factory preloaded at most once).
 * Cancels pending prefetch if component unmounts.
 */
export function usePrefetch() {
  const idleRef = useRef<number | null>(null);

  const prefetch = useCallback((factory: LazyFactory, key?: string) => {
    const dedupeKey = key || factory.toString();
    if (prefetched.has(dedupeKey)) return;

    // Cancel any pending idle callback
    if (idleRef.current !== null) {
      cancelIdle(idleRef.current);
    }

    idleRef.current = scheduleIdle(() => {
      prefetched.add(dedupeKey);
      // Fire the dynamic import — Vite/webpack will cache the chunk
      factory().catch(() => {
        // Silently fail — the actual navigation will retry the import
        prefetched.delete(dedupeKey);
      });
    }) as unknown as number;
  }, []);

  return prefetch;
}

/**
 * prefetchRoute — Imperative prefetch (non-hook version).
 * Use in event handlers or outside React components.
 */
export function prefetchRoute(factory: LazyFactory, key?: string): void {
  const dedupeKey = key || factory.toString();
  if (prefetched.has(dedupeKey)) return;

  scheduleIdle(() => {
    prefetched.add(dedupeKey);
    factory().catch(() => {
      prefetched.delete(dedupeKey);
    });
  });
}

/**
 * clearPrefetchCache — Reset the deduplication set (for testing).
 */
export function clearPrefetchCache(): void {
  prefetched.clear();
}

export default usePrefetch;
