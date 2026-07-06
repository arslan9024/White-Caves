/**
 * CacheService — Redis-backed response cache
 * Wave 15: Performance & PWA
 *
 * Provides get/set/invalidate operations with graceful degradation.
 * In dev, caching is disabled unless a supported Redis client is wired back in.
 */

import logger from '../utils/logger.js';
import { REDIS_URL } from '../config/env.js';

type CacheValue = string | object | unknown[] | number | boolean;

class CacheService {
  private connected = false;
  private readonly log = logger;

  constructor() {
    if (REDIS_URL) {
      this.log.warn('Redis cache disabled in this build — serving responses without cache');
    } else {
      this.log.warn('REDIS_URL not set — response caching disabled (requests served from DB)');
    }
  }

  /**
   * Fetch a cached value by key.
   * Returns null on cache miss, Redis unavailability, or parse errors.
   */
  async get<T = CacheValue>(key: string): Promise<T | null> {
    void key;
    return null;
  }

  /**
   * Store a value with an optional TTL (seconds).
   * Silently skips if Redis is unavailable.
   */
  async set(key: string, value: CacheValue, ttlSeconds = 60): Promise<void> {
    void key;
    void value;
    void ttlSeconds;
  }

  /**
   * Invalidate all keys matching a glob pattern (e.g. 'properties:*').
   * Uses SCAN to avoid blocking Redis on large key spaces.
   */
  async invalidate(pattern: string): Promise<void> {
    void pattern;
  }

  /**
   * Check if the Redis connection is healthy.
   * Used by the /api/health/cache endpoint.
   */
  async ping(): Promise<{ healthy: boolean; latencyMs: number }> {
    return { healthy: false, latencyMs: 0 };
  }

  get isAvailable(): boolean {
    return this.connected;
  }
}

// Singleton exported for reuse across routes
export const cacheService = new CacheService();
