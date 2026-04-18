/**
 * settledJson — Unwrap Promise.allSettled results into parsed JSON
 * ═════════════════════════════════════════════════════════════════
 * Replaces the repeated boilerplate pattern in dashboard tabs:
 *
 *   const res = await Promise.allSettled([authFetch(…), authFetch(…)]);
 *   const a = res[0].status === 'fulfilled' ? await res[0].value.json() : fallback;
 *   const b = res[1].status === 'fulfilled' ? await res[1].value.json() : fallback;
 *
 * Usage:
 *   const [a, b] = await settledJson(
 *     [authFetch('/api/one'), authFetch('/api/two')],
 *     [{ data: [] }, { data: null }],
 *   );
 */

import { createLogger } from './logger';

const log = createLogger('settledJson');

/**
 * Execute an array of Response promises via `Promise.allSettled`,
 * parse each fulfilled response as JSON, and return the fallback
 * for any that rejected or failed to parse.
 *
 * @param requests  Array of Promise<Response> (typically from authFetch)
 * @param fallbacks Array of fallback values, one per request
 * @returns         Array of parsed JSON results (same order as requests)
 */
export async function settledJson<T extends Record<string, any>[]>(
  requests: { [K in keyof T]: Promise<Response> },
  fallbacks: { [K in keyof T]: T[K] },
): Promise<T> {
  const results = await Promise.allSettled(requests);

  const parsed = await Promise.all(
    results.map(async (result, i) => {
      if (result.status === 'fulfilled') {
        try {
          return await result.value.json();
        } catch {
          log.warn(`Failed to parse JSON for request ${i}:`, result.value.url);
          return fallbacks[i];
        }
      }
      log.warn(`Request ${i} rejected:`, result.reason);
      return fallbacks[i];
    }),
  );

  return parsed as T;
}
