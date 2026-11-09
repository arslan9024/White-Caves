/**
 * tierZeroCache.ts
 * White Caves Real Estate LLC - Sovereign In-Memory Tier-0 Fast Cache & O(1) MapIndexHash
 * Architecture: Sub-10ms Microsecond Engine (AEG-012, AEG-015, DOM-07)
 * Single Purpose File Law: < 350 lines
 */

export interface CacheEntry<T> {
  data: T;
  hash: number;
  timestamp: number;
  expiresAt: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  evictions: number;
  size: number;
  hitRatio: number;
  averageRetrievalTimeUs: number;
}

export class TierZeroMemoryCache {
  private static instance: TierZeroMemoryCache;
  private cache = new Map<string, CacheEntry<unknown>>();
  private indexMap = new Map<string, Map<string, unknown>>();
  private defaultTtlMs = 60_000; // 1 minute default
  private maxEntries = 5000;

  // Telemetry metrics
  private hits = 0;
  private misses = 0;
  private evictions = 0;
  private totalRetrievalDurationUs = 0;
  private totalRetrievals = 0;

  private constructor() {}

  public static getInstance(): TierZeroMemoryCache {
    if (!TierZeroMemoryCache.instance) {
      TierZeroMemoryCache.instance = new TierZeroMemoryCache();
    }
    return TierZeroMemoryCache.instance;
  }

  /**
   * Fast integer hash representation of data
   */
  public hashData(data: unknown): number {
    try {
      const str = typeof data === 'string' ? data : JSON.stringify(data);
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
      }
      return hash;
    } catch {
      return 0;
    }
  }

  /**
   * Store data in Tier-0 memory cache
   */
  public set<T>(key: string, data: T, ttlMs: number = this.defaultTtlMs): void {
    if (this.cache.size >= this.maxEntries) {
      // LRU Eviction of the oldest entry
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
        this.evictions++;
      }
    }

    const now = Date.now();
    this.cache.set(key, {
      data,
      hash: this.hashData(data),
      timestamp: now,
      expiresAt: now + ttlMs,
    });
  }

  /**
   * Retrieve data with sub-10ms (typically sub-50µs) O(1) performance
   */
  public get<T>(key: string): T | null {
    const t0 = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const entry = this.cache.get(key);

    if (!entry) {
      this.misses++;
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.evictions++;
      this.misses++;
      return null;
    }

    this.hits++;
    const t1 = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const durationUs = (t1 - t0) * 1000;
    this.totalRetrievalDurationUs += durationUs;
    this.totalRetrievals++;

    return entry.data as T;
  }

  /**
   * Check if a key exists and is unexpired
   */
  public has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  /**
   * Build or update an O(1) hash index for fast record lookup by property (e.g. id, code)
   */
  public buildIndex<T extends Record<string, unknown>>(
    indexName: string,
    items: T[],
    keyProp: keyof T
  ): void {
    let subMap = this.indexMap.get(indexName);
    if (!subMap) {
      subMap = new Map<string, unknown>();
      this.indexMap.set(indexName, subMap);
    } else {
      subMap.clear();
    }

    for (const item of items) {
      const val = item[keyProp];
      if (val !== undefined && val !== null) {
        subMap.set(String(val).toLowerCase(), item);
      }
    }
  }

  /**
   * Look up item in index in O(1) time
   */
  public lookupIndex<T>(indexName: string, keyVal: string): T | null {
    const subMap = this.indexMap.get(indexName);
    if (!subMap) return null;
    return (subMap.get(keyVal.toLowerCase()) as T) || null;
  }

  /**
   * Invalidate specific key
   */
  public delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Invalidate index
   */
  public clearIndex(indexName: string): boolean {
    return this.indexMap.delete(indexName);
  }

  /**
   * Invalidate everything
   */
  public clear(): void {
    this.cache.clear();
    this.indexMap.clear();
    this.hits = 0;
    this.misses = 0;
    this.evictions = 0;
    this.totalRetrievalDurationUs = 0;
    this.totalRetrievals = 0;
  }

  /**
   * Retrieve real-time telemetry stats
   */
  public getStats(): CacheStats {
    const totalRequests = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      evictions: this.evictions,
      size: this.cache.size,
      hitRatio: totalRequests > 0 ? (this.hits / totalRequests) * 100 : 0,
      averageRetrievalTimeUs:
        this.totalRetrievals > 0 ? this.totalRetrievalDurationUs / this.totalRetrievals : 0,
    };
  }
}

export const tierZeroCache = TierZeroMemoryCache.getInstance();
export default tierZeroCache;
