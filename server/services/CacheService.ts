/**
 * CacheService — Redis-backed response cache
 * Wave 15: Performance & PWA
 *
 * Provides get/set/invalidate operations with graceful degradation:
 * if Redis is unavailable the server continues without caching.
 */

import Redis from 'ioredis';
import logger from '../utils/logger.js';
import { REDIS_URL } from '../config/env.js';

type CacheValue = string | object | unknown[] | number | boolean;

class CacheService {
  private client: Redis | null = null;
  private connected = false;
  private readonly log = logger;

  constructor() {
    if (REDIS_URL) {
      this.init();
    } else {
      this.log.warn('REDIS_URL not set — response caching disabled (requests served from DB)');
    }
  }

  private init(): void {
    try {
      this.client = new Redis(REDIS_URL!, {
        maxRetriesPerRequest: 1,
        enableReadyCheck: true,
        lazyConnect: true,
        retryStrategy: (times: number) => {
          // Retry up to 3 times with 1s delay, then give up
          if (times > 3) return null;
          return 1000;
        },
      });

      this.client.on('connect', () => {
        this.connected = true;
        this.log.info('CacheService: Redis connected');
      });

      this.client.on('ready', () => {
        this.connected = true;
      });

      this.client.on('error', (err: Error) => {
        // Only log once per disconnect to avoid noise
        if (this.connected) {
          this.log.warn(`CacheService: Redis error — falling back to DB. ${err.message}`);
        }
        this.connected = false;
      });

      this.client.on('close', () => {
        this.connected = false;
      });

      // Initiate the lazy connection
      this.client.connect().catch(() => {
        // Handled by error event above
      });
    } catch (err) {
      this.log.warn('CacheService: Failed to initialise Redis client — caching disabled');
      this.client = null;
    }
  }

  /**
   * Fetch a cached value by key.
   * Returns null on cache miss, Redis unavailability, or parse errors.
   */
  async get<T = CacheValue>(key: string): Promise<T | null> {
    if (!this.client || !this.connected) return null;
    try {
      const raw = await this.client.get(key);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  /**
   * Store a value with an optional TTL (seconds).
   * Silently skips if Redis is unavailable.
   */
  async set(key: string, value: CacheValue, ttlSeconds = 60): Promise<void> {
    if (!this.client || !this.connected) return;
    try {
      await this.client.setex(key, ttlSeconds, JSON.stringify(value));
    } catch {
      // Non-fatal — fall through
    }
  }

  /**
   * Invalidate all keys matching a glob pattern (e.g. 'properties:*').
   * Uses SCAN to avoid blocking Redis on large key spaces.
   */
  async invalidate(pattern: string): Promise<void> {
    if (!this.client || !this.connected) return;
    try {
      let cursor = '0';
      do {
        const [nextCursor, keys] = await this.client.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
        cursor = nextCursor;
        if (keys.length > 0) {
          await this.client.del(...keys);
        }
      } while (cursor !== '0');
    } catch {
      // Non-fatal — fall through
    }
  }

  /**
   * Check if the Redis connection is healthy.
   * Used by the /api/health/cache endpoint.
   */
  async ping(): Promise<{ healthy: boolean; latencyMs: number }> {
    if (!this.client) return { healthy: false, latencyMs: 0 };
    const start = Date.now();
    try {
      await this.client.ping();
      return { healthy: true, latencyMs: Date.now() - start };
    } catch {
      return { healthy: false, latencyMs: Date.now() - start };
    }
  }

  get isAvailable(): boolean {
    return this.connected;
  }
}

// Singleton exported for reuse across routes
export const cacheService = new CacheService();
