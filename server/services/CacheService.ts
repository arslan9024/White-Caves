import logger from '../utils/logger.js';
import { REDIS_URL } from '../config/env.js';
import Redis from 'ioredis';

type CacheValue = string | object | unknown[] | number | boolean;

class CacheService {
  private client: Redis | null = null;
  private memoryCache = new Map<string, { value: CacheValue; expiresAt: number }>();
  private connected = false;
  private readonly log = logger;

  constructor() {
    if (REDIS_URL) {
      try {
        this.client = new Redis(REDIS_URL, {
          maxRetriesPerRequest: 1,
          lazyConnect: true,
          connectTimeout: 2000,
        });
        this.client.on('connect', () => {
          this.connected = true;
          this.log.info('Redis cache client connected successfully');
        });
        this.client.on('error', (err) => {
          this.connected = false;
          this.log.warn('Redis cache connection error:', err.message);
        });
        void this.client.connect().catch(err => {
          this.log.warn('Redis lazy connect failed, falling back to memory cache:', err.message);
        });
      } catch (err: unknown) {
        this.log.warn('Failed to initialize Redis client, falling back to memory cache:', (err as Error).message);
      }
    } else {
      this.log.info('REDIS_URL not set — response caching using local in-memory fallback');
    }
  }

  /**
   * Fetch a cached value by key.
   */
  async get<T = CacheValue>(key: string): Promise<T | null> {
    if (process.env.NODE_ENV === 'test') return null;
    if (this.connected && this.client) {
      try {
        const val = await this.client.get(key);
        if (val === null) return null;
        try {
          return JSON.parse(val) as T;
        } catch {
          return val as unknown as T;
        }
      } catch (err: unknown) {
        this.log.warn(`Redis get failed for key ${key}:`, (err as Error).message);
      }
    }
    // Memory cache fallback
    const entry = this.memoryCache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.memoryCache.delete(key);
      return null;
    }
    return entry.value as T;
  }

  /**
   * Store a value with an optional TTL (seconds).
   */
  async set(key: string, value: CacheValue, ttlSeconds = 60): Promise<void> {
    if (process.env.NODE_ENV === 'test') return;
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    if (this.connected && this.client) {
      try {
        await this.client.set(key, stringValue, 'EX', ttlSeconds);
        return;
      } catch (err: unknown) {
        this.log.warn(`Redis set failed for key ${key}:`, (err as Error).message);
      }
    }
    // Memory cache fallback
    this.memoryCache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  /**
   * Increment a Redis key by 1 with a default 24h TTL.
   */
  async incr(key: string, ttlSeconds = 60 * 60 * 24): Promise<number> {
    if (process.env.NODE_ENV === 'test') return 1;
    if (this.connected && this.client) {
      try {
        const count = await this.client.incr(key);
        if (count === 1) {
          await this.client.expire(key, ttlSeconds);
        }
        return count;
      } catch (err: unknown) {
        this.log.warn(`Redis incr failed for key ${key}:`, (err as Error).message);
      }
    }
    // Memory cache fallback
    const entry = this.memoryCache.get(key);
    const count = (entry ? Number(entry.value) : 0) + 1;
    this.memoryCache.set(key, {
      value: count,
      expiresAt: entry ? entry.expiresAt : Date.now() + ttlSeconds * 1000,
    });
    return count;
  }

  /**
   * Increment a Redis key by a specific value with a default 24h TTL.
   */
  async incrby(key: string, value: number, ttlSeconds = 60 * 60 * 24): Promise<number> {
    if (process.env.NODE_ENV === 'test') return value;
    if (this.connected && this.client) {
      try {
        const count = await this.client.incrby(key, value);
        if (count === value) {
          await this.client.expire(key, ttlSeconds);
        }
        return count;
      } catch (err: unknown) {
        this.log.warn(`Redis incrby failed for key ${key}:`, (err as Error).message);
      }
    }
    // Memory cache fallback
    const entry = this.memoryCache.get(key);
    const count = (entry ? Number(entry.value) : 0) + value;
    this.memoryCache.set(key, {
      value: count,
      expiresAt: entry ? entry.expiresAt : Date.now() + ttlSeconds * 1000,
    });
    return count;
  }

  /**
   * Invalidate all keys matching a glob pattern (e.g. 'properties:*').
   */
  async invalidate(pattern: string): Promise<void> {
    if (process.env.NODE_ENV === 'test') return;
    if (this.connected && this.client) {
      try {
        const keys = await this.client.keys(pattern);
        if (keys.length > 0) {
          await this.client.del(...keys);
        }
        return;
      } catch (err: unknown) {
        this.log.warn(`Redis invalidate failed for pattern ${pattern}:`, (err as Error).message);
      }
    }
    // Memory cache fallback: clear matching keys
    const regexPattern = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    for (const key of this.memoryCache.keys()) {
      if (regexPattern.test(key)) {
        this.memoryCache.delete(key);
      }
    }
  }

  /**
   * Check if the Redis connection is healthy.
   */
  async ping(): Promise<{ healthy: boolean; latencyMs: number }> {
    if (this.connected && this.client) {
      try {
        const start = Date.now();
        await this.client.ping();
        return { healthy: true, latencyMs: Date.now() - start };
      } catch {
        return { healthy: false, latencyMs: 0 };
      }
    }
    return { healthy: false, latencyMs: 0 };
  }

  get isAvailable(): boolean {
    return this.connected;
  }
}

// Singleton exported for reuse across routes
export const cacheService = new CacheService();
