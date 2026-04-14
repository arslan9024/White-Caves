/**
 * Cache Service — In-Memory LRU Cache with TTL
 *
 * Provides application-level caching for expensive queries and computations:
 *   - Property listings (hot path — frequently queried)
 *   - Dashboard aggregations
 *   - API rate limit counters
 *   - NLP entity extraction results
 *
 * Architecture:
 *   LRU eviction + configurable TTL per namespace
 *   No external dependencies (Redis-ready interface for future upgrade)
 *
 * Usage:
 *   import { cache, CacheNamespace } from '../services/cache.js';
 *   const properties = await cache.getOrSet(
 *     CacheNamespace.PROPERTIES, 'dubai-marina-active',
 *     () => prisma.property.findMany({ where: { area: 'Dubai Marina', status: 'ACTIVE' } }),
 *     { ttlMs: 60_000 }
 *   );
 */

import { createLogger } from '../utils/logger.js';

const log = createLogger('Cache');

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export enum CacheNamespace {
  PROPERTIES = 'properties',
  LEADS = 'leads',
  DASHBOARD = 'dashboard',
  NLP = 'nlp',
  AUTH = 'auth',
  CONFIG = 'config',
  GENERAL = 'general',
}

interface CacheEntry<T> {
  value: T;
  expiresAt: number; // timestamp ms
  createdAt: number;
  hitCount: number;
  sizeEstimate: number; // bytes (rough)
}

export interface CacheOptions {
  /** Time-to-live in milliseconds. Default: 300_000 (5min) */
  ttlMs?: number;
  /** Force refresh even if cached. Default: false */
  forceRefresh?: boolean;
}

export interface CacheStats {
  totalEntries: number;
  namespaces: Record<string, number>;
  hits: number;
  misses: number;
  hitRate: string;
  estimatedMemoryMB: number;
  evictions: number;
  oldestEntryAgeMs: number;
}

// ─────────────────────────────────────────────────────────────
// Default Configuration
// ─────────────────────────────────────────────────────────────

const DEFAULT_TTL_MS = 300_000;       // 5 minutes
const MAX_ENTRIES = 10_000;            // LRU cap
const CLEANUP_INTERVAL_MS = 60_000;    // Sweep expired every 60s
const MAX_MEMORY_MB = 100;             // Estimated ceiling

// ─────────────────────────────────────────────────────────────
// Cache Implementation
// ─────────────────────────────────────────────────────────────

export class CacheService {
  private store = new Map<string, CacheEntry<unknown>>();
  private accessOrder: string[] = [];  // LRU tracking
  private cleanupTimer: ReturnType<typeof setInterval> | null = null;

  // Stats
  private hits = 0;
  private misses = 0;
  private evictions = 0;

  constructor() {
    this.startCleanup();
    log.info('Cache service initialized', { maxEntries: MAX_ENTRIES, defaultTTL: `${DEFAULT_TTL_MS / 1000}s` });
  }

  // ─── Core API ──────────────────────────────────────────

  /**
   * Get a cached value. Returns undefined if not found or expired.
   */
  public get<T>(namespace: CacheNamespace, key: string): T | undefined {
    const fullKey = `${namespace}:${key}`;
    const entry = this.store.get(fullKey);

    if (!entry) {
      this.misses++;
      return undefined;
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(fullKey);
      this.removeFromAccessOrder(fullKey);
      this.misses++;
      return undefined;
    }

    // Move to front of LRU
    this.touchAccessOrder(fullKey);
    entry.hitCount++;
    this.hits++;

    return entry.value as T;
  }

  /**
   * Set a cached value.
   */
  public set<T>(namespace: CacheNamespace, key: string, value: T, options: CacheOptions = {}): void {
    const fullKey = `${namespace}:${key}`;
    const ttl = options.ttlMs ?? DEFAULT_TTL_MS;
    const now = Date.now();

    // Evict if at capacity
    while (this.store.size >= MAX_ENTRIES) {
      this.evictLRU();
    }

    const entry: CacheEntry<T> = {
      value,
      expiresAt: now + ttl,
      createdAt: now,
      hitCount: 0,
      sizeEstimate: this.estimateSize(value),
    };

    this.store.set(fullKey, entry as CacheEntry<unknown>);
    this.touchAccessOrder(fullKey);
  }

  /**
   * Get-or-set: Fetch from cache, or compute & cache if missing.
   * This is the primary API for most use cases.
   */
  public async getOrSet<T>(
    namespace: CacheNamespace,
    key: string,
    factory: () => T | Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    if (!options.forceRefresh) {
      const cached = this.get<T>(namespace, key);
      if (cached !== undefined) {
        return cached;
      }
    }

    const value = await factory();
    this.set(namespace, key, value, options);
    return value;
  }

  /**
   * Delete a specific key.
   */
  public delete(namespace: CacheNamespace, key: string): boolean {
    const fullKey = `${namespace}:${key}`;
    this.removeFromAccessOrder(fullKey);
    return this.store.delete(fullKey);
  }

  /**
   * Invalidate all entries in a namespace.
   * Use after mutations (e.g., new property created → invalidate PROPERTIES namespace).
   */
  public invalidateNamespace(namespace: CacheNamespace): number {
    const prefix = `${namespace}:`;
    let count = 0;

    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
        this.removeFromAccessOrder(key);
        count++;
      }
    }

    log.info(`Invalidated namespace: ${namespace}`, { entriesRemoved: count });
    return count;
  }

  /**
   * Clear entire cache.
   */
  public clear(): void {
    const size = this.store.size;
    this.store.clear();
    this.accessOrder = [];
    log.info('Cache cleared', { entriesRemoved: size });
  }

  /**
   * Check if a key exists and is not expired.
   */
  public has(namespace: CacheNamespace, key: string): boolean {
    return this.get(namespace, key) !== undefined;
  }

  // ─── Stats ─────────────────────────────────────────────

  public getStats(): CacheStats {
    const namespaces: Record<string, number> = {};
    let totalSize = 0;
    let oldestAge = 0;
    const now = Date.now();

    for (const [key, entry] of this.store) {
      const ns = key.split(':')[0];
      namespaces[ns] = (namespaces[ns] || 0) + 1;
      totalSize += entry.sizeEstimate;
      const age = now - entry.createdAt;
      if (age > oldestAge) oldestAge = age;
    }

    const totalRequests = this.hits + this.misses;

    return {
      totalEntries: this.store.size,
      namespaces,
      hits: this.hits,
      misses: this.misses,
      hitRate: totalRequests > 0 ? `${((this.hits / totalRequests) * 100).toFixed(1)}%` : '0%',
      estimatedMemoryMB: Math.round((totalSize / 1024 / 1024) * 100) / 100,
      evictions: this.evictions,
      oldestEntryAgeMs: oldestAge,
    };
  }

  /**
   * Reset hit/miss counters (for periodic reporting)
   */
  public resetStats(): void {
    this.hits = 0;
    this.misses = 0;
    this.evictions = 0;
  }

  // ─── LRU Management ────────────────────────────────────

  private touchAccessOrder(key: string): void {
    this.removeFromAccessOrder(key);
    this.accessOrder.push(key); // Most recent at end
  }

  private removeFromAccessOrder(key: string): void {
    const idx = this.accessOrder.indexOf(key);
    if (idx !== -1) {
      this.accessOrder.splice(idx, 1);
    }
  }

  private evictLRU(): void {
    if (this.accessOrder.length === 0) return;
    const lruKey = this.accessOrder.shift()!;
    this.store.delete(lruKey);
    this.evictions++;
    log.debug('LRU eviction', { key: lruKey });
  }

  // ─── Cleanup ───────────────────────────────────────────

  private startCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      this.sweepExpired();
    }, CLEANUP_INTERVAL_MS);

    // Don't keep Node.js alive just for cache cleanup
    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref();
    }
  }

  private sweepExpired(): void {
    const now = Date.now();
    let swept = 0;

    for (const [key, entry] of this.store) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
        this.removeFromAccessOrder(key);
        swept++;
      }
    }

    if (swept > 0) {
      log.debug(`Swept ${swept} expired entries`, { remaining: this.store.size });
    }
  }

  /**
   * Estimate memory size of a value (rough, for monitoring)
   */
  private estimateSize(value: unknown): number {
    try {
      return JSON.stringify(value).length * 2; // ~2 bytes per char
    } catch {
      return 1024; // Fallback: 1KB
    }
  }

  /**
   * Graceful shutdown — stop cleanup timer
   */
  public shutdown(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    log.info('Cache service shut down');
  }
}

// ─────────────────────────────────────────────────────────────
// Singleton
// ─────────────────────────────────────────────────────────────

let instance: CacheService | null = null;

export function getCache(): CacheService {
  if (!instance) {
    instance = new CacheService();
  }
  return instance;
}

/** Convenience alias */
export const cache = {
  get: <T>(ns: CacheNamespace, key: string) => getCache().get<T>(ns, key),
  set: <T>(ns: CacheNamespace, key: string, value: T, opts?: CacheOptions) => getCache().set(ns, key, value, opts),
  getOrSet: <T>(ns: CacheNamespace, key: string, factory: () => T | Promise<T>, opts?: CacheOptions) => getCache().getOrSet(ns, key, factory, opts),
  delete: (ns: CacheNamespace, key: string) => getCache().delete(ns, key),
  invalidate: (ns: CacheNamespace) => getCache().invalidateNamespace(ns),
  clear: () => getCache().clear(),
  stats: () => getCache().getStats(),
};
