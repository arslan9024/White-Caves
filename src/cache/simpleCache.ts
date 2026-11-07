import NodeCache from 'node-cache';

// Simple in‑memory cache with a default TTL of 5 minutes
export const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

/**
 * Helper to get a cached value or compute & store it.
 * @param key Cache key
 * @param ttl Optional TTL (seconds)
 * @param fn Function that returns a promise of the value
 */
export async function getOrSet<T>(key: string, fn: () => Promise<T>, ttl?: number): Promise<T> {
  const cached = cache.get(key) as T | undefined;
  if (cached !== undefined) return cached;
  const result = await fn();
  cache.set(key, result, ttl);
  return result;
}
