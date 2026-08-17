/**
 * Intelligent Route Prefetching Engine — White Caves Real Estate LLC
 * Pre-downloads async chunks during link hover/focus events to achieve instant navigation.
 */

type RouteLoader = () => Promise<unknown>;

const routeRegistry = new Map<string, RouteLoader>();
const prefetchedRoutes = new Set<string>();

/**
 * Registers an asynchronous component import for a given URL path
 */
export function registerRoutePrefetch(path: string, loader: RouteLoader): void {
  const cleanPath = path.toLowerCase().replace(/\/$/, '') || '/';
  routeRegistry.set(cleanPath, loader);
}

/**
 * Prefetches the code chunk for a registered route if not already cached
 */
export function prefetchRoute(path: string): Promise<boolean> {
  const cleanPath = path.toLowerCase().replace(/\/$/, '') || '/';

  if (prefetchedRoutes.has(cleanPath)) {
    return Promise.resolve(true);
  }

  const loader = routeRegistry.get(cleanPath);
  if (!loader) {
    return Promise.resolve(false);
  }

  prefetchedRoutes.add(cleanPath);
  return loader()
    .then(() => true)
    .catch((err) => {
      console.warn(`[RoutePrefetcher] Failed to prefetch route ${cleanPath}:`, err);
      prefetchedRoutes.delete(cleanPath);
      return false;
    });
}

/**
 * Resets the prefetched route cache (primarily for tests)
 */
export function resetPrefetchRegistry(): void {
  routeRegistry.clear();
  prefetchedRoutes.clear();
}
