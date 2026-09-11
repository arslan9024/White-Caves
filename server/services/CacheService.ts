import logger from '../utils/logger.js';
import { REDIS_URL } from '../config/env.js';
import { CONNECTION_POOL_CONFIG, ConnectionPoolConfig } from '../config/connectionPool.js';
import Redis from 'ioredis';

export type CacheValue = string | object | unknown[] | number | boolean;

export interface CacheStats {
  hits: number;
  misses: number;
  totalRequests: number;
  hitRate: string;
  dbQueriesSaved: number;
  estimatedDbLatencySavedMs: number;
  activeKeys: number;
  backend: 'redis' | 'memory';
  redisConnected: boolean;
  poolConfig: ConnectionPoolConfig;
}

const MAX_MEMORY_ENTRIES = 10000;
const DEFAULT_AGGREGATION_TTL_SECONDS = 300; // 5 minutes standard TTL for heavy aggregations
const ESTIMATED_AVG_DB_QUERY_MS = 35; // conservative average latency saved per offloaded query

class CacheService {
  private client: Redis | null = null;
  private memoryCache = new Map<string, { value: CacheValue; expiresAt: number }>();
  private connected = false;
  private readonly log = logger;
  private enableInTest = false;
  private cleanupTimer: NodeJS.Timeout | null = null;

  // Telemetry & offload counters
  private hitsCount = 0;
  private missesCount = 0;
  private dbQueriesSavedCount = 0;

  constructor() {
    if (REDIS_URL) {
      try {
        this.client = new Redis(REDIS_URL, {
          maxRetriesPerRequest: 3,
          enableReadyCheck: true,
          lazyConnect: true,
          connectTimeout: 5000,
          keepAlive: 10000,
          autoResendUnfulfilledCommands: true,
          retryStrategy: (times) => {
            if (times > 5) return null;
            return Math.min(times * 200, 2000);
          },
        });
        this.client.on('connect', () => {
          this.connected = true;
          this.log.info('Redis cache client connected successfully with sized connection pool');
        });
        this.client.on('error', (err) => {
          this.connected = false;
          this.log.warn('Redis cache connection error:', err.message);
        });
        void this.client.connect().catch(err => {
          this.log.warn('Redis lazy connect failed, falling back to memory cache pool:', err.message);
        });
      } catch (err: unknown) {
        this.log.warn('Failed to initialize Redis client, falling back to memory cache pool:', (err as Error).message);
      }
    } else {
      this.log.info('REDIS_URL not set — response caching using local in-memory cache pool');
    }

    // Background sweep for expired in-memory entries every 30s
    this.cleanupTimer = setInterval(() => {
      this.sweepExpiredMemoryEntries();
    }, 30000);
    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref();
    }
  }

  /**
   * Enable or disable caching during test runs.
   * By default, tests bypass caching so unit-level Prisma mocks work unmodified.
   * Specific caching/integration tests can enable this to test offload behavior.
   */
  enableTestMode(enable = true): void {
    this.enableInTest = enable;
  }

  private isTestBypass(): boolean {
    return process.env.NODE_ENV === 'test' && !this.enableInTest;
  }

  private sweepExpiredMemoryEntries(): void {
    const now = Date.now();
    for (const [key, entry] of this.memoryCache.entries()) {
      if (now > entry.expiresAt) {
        this.memoryCache.delete(key);
      }
    }
  }

  /**
   * Fetch a cached value by key.
   */
  async get<T = CacheValue>(key: string): Promise<T | null> {
    if (this.isTestBypass()) return null;

    if (this.connected && this.client) {
      try {
        const val = await this.client.get(key);
        if (val !== null) {
          this.hitsCount++;
          try {
            return JSON.parse(val) as T;
          } catch {
            return val as unknown as T;
          }
        }
      } catch (err: unknown) {
        this.log.warn('Redis get failed for key:', (err as Error).message);
      }
    }

    // Memory cache fallback
    const entry = this.memoryCache.get(key);
    if (!entry) {
      this.missesCount++;
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.memoryCache.delete(key);
      this.missesCount++;
      return null;
    }

    this.hitsCount++;
    return entry.value as T;
  }

  /**
   * Store a value with an optional TTL (seconds, default 300 = 5 minutes).
   */
  async set(key: string, value: CacheValue, ttlSeconds = DEFAULT_AGGREGATION_TTL_SECONDS): Promise<void> {
    if (this.isTestBypass()) return;

    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    if (this.connected && this.client) {
      try {
        await this.client.set(key, stringValue, 'EX', ttlSeconds);
        return;
      } catch (err: unknown) {
        this.log.warn('Redis set failed for key:', (err as Error).message);
      }
    }

    // Memory cache fallback with bounded LRU eviction
    if (this.memoryCache.size >= MAX_MEMORY_ENTRIES) {
      // Evict oldest inserted entry
      const oldestKey = this.memoryCache.keys().next().value;
      if (oldestKey) this.memoryCache.delete(oldestKey);
    }

    this.memoryCache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  /**
   * High-level query wrapper: checks cache; on miss, invokes database fetcher,
   * stores result in Redis/pool with given TTL (default 5 minutes), and returns data.
   * Actively tracks offloaded queries for database load monitoring.
   */
  async getOrSet<T = CacheValue>(
    key: string,
    fetcher: () => Promise<T>,
    ttlSeconds = DEFAULT_AGGREGATION_TTL_SECONDS
  ): Promise<T> {
    if (this.isTestBypass()) {
      return await fetcher();
    }

    const cached = await this.get<T>(key);
    if (cached !== null) {
      this.dbQueriesSavedCount++;
      return cached;
    }

    // Cache miss — execute query against database
    const fresh = await fetcher();
    await this.set(key, fresh as unknown as CacheValue, ttlSeconds);
    return fresh;
  }

  /**
   * Delete a single specific cache key.
   */
  async del(key: string): Promise<void> {
    if (this.isTestBypass()) return;

    if (this.connected && this.client) {
      try {
        await this.client.del(key);
      } catch (err: unknown) {
        this.log.warn('Redis del failed for key:', (err as Error).message);
      }
    }
    this.memoryCache.delete(key);
  }

  /**
   * Invalidate all keys matching a glob pattern (e.g. 'wc:properties:*' or 'properties:*').
   */
  async invalidate(pattern: string): Promise<void> {
    if (this.isTestBypass()) return;

    if (this.connected && this.client) {
      try {
        const keys = await this.client.keys(pattern);
        if (keys.length > 0) {
          await this.client.del(...keys);
        }
      } catch (err: unknown) {
        this.log.warn('Redis invalidate failed for pattern:', (err as Error).message);
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
   * Invalidate multiple patterns in parallel.
   */
  async invalidateMany(patterns: string[]): Promise<void> {
    if (this.isTestBypass() || patterns.length === 0) return;
    await Promise.all(patterns.map(p => this.invalidate(p)));
  }

  /**
   * Increment a Redis key by 1 with a default 24h TTL.
   */
  async incr(key: string, ttlSeconds = 60 * 60 * 24): Promise<number> {
    if (this.isTestBypass()) return 1;

    if (this.connected && this.client) {
      try {
        const count = await this.client.incr(key);
        if (count === 1) {
          await this.client.expire(key, ttlSeconds);
        }
        return count;
      } catch (err: unknown) {
        this.log.warn('Redis incr failed for key:', (err as Error).message);
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
    if (this.isTestBypass()) return value;

    if (this.connected && this.client) {
      try {
        const count = await this.client.incrby(key, value);
        if (count === value) {
          await this.client.expire(key, ttlSeconds);
        }
        return count;
      } catch (err: unknown) {
        this.log.warn('Redis incrby failed for key:', (err as Error).message);
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
   * Clear entire cache pool.
   */
  async clear(): Promise<void> {
    if (this.isTestBypass()) return;

    if (this.connected && this.client) {
      try {
        await this.client.flushdb();
      } catch (err: unknown) {
        this.log.warn('Redis flushdb failed:', (err as Error).message);
      }
    }
    this.memoryCache.clear();
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

  /**
   * Returns live cache telemetry, offload metrics, and DB connection pool sizing status.
   */
  getStats(): CacheStats {
    const total = this.hitsCount + this.missesCount;
    const hitRate = total > 0 ? `${((this.hitsCount / total) * 100).toFixed(1)}%` : '0.0%';

    return {
      hits: this.hitsCount,
      misses: this.missesCount,
      totalRequests: total,
      hitRate,
      dbQueriesSaved: this.dbQueriesSavedCount,
      estimatedDbLatencySavedMs: this.dbQueriesSavedCount * ESTIMATED_AVG_DB_QUERY_MS,
      activeKeys: this.memoryCache.size,
      backend: this.connected ? 'redis' : 'memory',
      redisConnected: this.connected,
      poolConfig: CONNECTION_POOL_CONFIG,
    };
  }

  /**
   * Reset stats counters (useful in tests and benchmark runs).
   */
  resetStats(): void {
    this.hitsCount = 0;
    this.missesCount = 0;
    this.dbQueriesSavedCount = 0;
  }

  get isAvailable(): boolean {
    return this.connected;
  }
}

// Singleton exported for reuse across routes and services
export const cacheService = new CacheService();
export default cacheService;
