/**
 * Caching Layer for Inventory System
 * Improves performance for property searches and frequently accessed data
 * Uses in-memory cache with TTL (can be upgraded to Redis)
 */

class CacheManager {
  constructor() {
    this.cache = new Map();
    this.ttls = new Map();
    
    // Cleanup expired entries every 30 seconds
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 30 * 1000);
  }

  /**
   * Set a cache entry with TTL
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} ttlSeconds - Time to live in seconds (default: 300)
   */
  set(key, value, ttlSeconds = 300) {
    const expiresAt = Date.now() + (ttlSeconds * 1000);
    this.cache.set(key, value);
    this.ttls.set(key, expiresAt);
    return true;
  }

  /**
   * Get a cache entry
   * @param {string} key - Cache key
   * @returns {*} Cached value or null if expired/missing
   */
  get(key) {
    const expiresAt = this.ttls.get(key);
    
    if (!expiresAt) return null;
    if (Date.now() > expiresAt) {
      // Entry expired, remove it
      this.cache.delete(key);
      this.ttls.delete(key);
      return null;
    }
    
    return this.cache.get(key);
  }

  /**
   * Check if key exists and is valid
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * Delete a cache entry
   */
  delete(key) {
    this.cache.delete(key);
    this.ttls.delete(key);
    return true;
  }

  /**
   * Delete all entries matching a pattern
   * Useful for cache invalidation
   */
  deletePattern(pattern) {
    const regex = new RegExp(pattern);
    let deleted = 0;
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
        this.ttls.delete(key);
        deleted++;
      }
    }
    
    return deleted;
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.clear();
    this.ttls.clear();
    return true;
  }

  /**
   * Remove expired entries
   */
  cleanup() {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, expiresAt] of this.ttls.entries()) {
      if (now > expiresAt) {
        this.cache.delete(key);
        this.ttls.delete(key);
        cleaned++;
      }
    }
    
    return cleaned;
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      memory: Math.round(JSON.stringify(Array.from(this.cache.entries())).length / 1024) + ' KB'
    };
  }

  /**
   * Destroy cache manager and cleanup interval
   */
  destroy() {
    clearInterval(this.cleanupInterval);
    this.clear();
  }
}

// Create singleton instance
const cacheManager = new CacheManager();

/**
 * Middleware factory for caching GET requests
 * @param {number} ttlSeconds - Cache TTL in seconds
 * @param {string} keyPrefix - Prefix for cache keys (e.g., 'property_search')
 */
export const cacheMiddleware = (ttlSeconds = 300, keyPrefix = 'cache') => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Generate cache key from URL and query parameters
    const cacheKey = `${keyPrefix}:${req.originalUrl}`;

    // Check if result is cached
    const cachedResult = cacheManager.get(cacheKey);
    if (cachedResult) {
      return res.json({
        ...cachedResult,
        cached: true,
        cacheKey
      });
    }

    // Intercept res.json to cache the response
    const originalJson = res.json.bind(res);
    res.json = function(data) {
      // Cache successful responses only (status 200)
      if (res.statusCode === 200) {
        cacheManager.set(cacheKey, data, ttlSeconds);
      }
      return originalJson(data);
    };

    next();
  };
};

/**
 * CACHE STRATEGIES FOR INVENTORY SYSTEM
 */

// Strategy 1: Property list caching (10-minute TTL)
export const propertyListCacheKey = (filters = {}) => {
  const sortedFilters = Object.keys(filters)
    .sort()
    .map(k => `${k}=${JSON.stringify(filters[k])}`)
    .join('&');
  return `property_list:${sortedFilters || 'all'}`;
};

// Strategy 2: Property detail caching (5-minute TTL)
export const propertyDetailCacheKey = (propertyId) => {
  return `property_detail:${propertyId}`;
};

// Strategy 3: Owner information caching (15-minute TTL)
export const ownerCacheKey = (ownerId) => {
  return `owner:${ownerId}`;
};

// Strategy 4: Opportunity caching (5-minute TTL)
export const opportunityCacheKey = (opportunityId) => {
  return `opportunity:${opportunityId}`;
};

// Strategy 5: Search results caching (10-minute TTL)
export const searchResultsCacheKey = (query) => {
  return `search:${query.toLowerCase().replace(/\s+/g, '_')}`;
};

// Strategy 6: Statistics caching (1-hour TTL)
export const statisticsCacheKey = (type = 'general') => {
  return `stats:${type}`;
};

// Strategy 7: Neighborhood/Location caching (24-hour TTL)
export const locationCacheKey = (location) => {
  return `location:${location.toLowerCase().replace(/\s+/g, '_')}`;
};

/**
 * Cache invalidation function
 * Clears related cache entries when data changes
 */
export const invalidateCache = {
  property: (propertyId) => {
    cacheManager.delete(propertyDetailCacheKey(propertyId));
    cacheManager.deletePattern(`^property_list:`);
    cacheManager.deletePattern(`^search:`);
    return true;
  },
  
  owner: (ownerId) => {
    cacheManager.delete(ownerCacheKey(ownerId));
    cacheManager.deletePattern(`^owner:`);
    return true;
  },
  
  opportunity: (opportunityId) => {
    cacheManager.delete(opportunityCacheKey(opportunityId));
    cacheManager.deletePattern(`^search:`);
    return true;
  },
  
  all: () => {
    cacheManager.clear();
    return true;
  },
  
  search: () => {
    cacheManager.deletePattern(`^search:`);
    cacheManager.deletePattern(`^property_list:`);
    return true;
  },
};

/**
 * Cache prewarming - load frequently accessed data into cache
 * Call this on server startup
 */
export const prewarmCache = async (propertyModel, ownerModel) => {
  try {
    // Cache top 100 most viewed properties
    const topProperties = await propertyModel
      .find()
      .sort({ views: -1 })
      .limit(100)
      .lean();

    topProperties.forEach(prop => {
      cacheManager.set(
        propertyDetailCacheKey(prop._id),
        prop,
        300 // 5-minute TTL
      );
    });

    // Cache frequently contacted owners
    const topOwners = await ownerModel
      .find()
      .sort({ 'metrics.totalProperties': -1 })
      .limit(50)
      .lean();

    topOwners.forEach(owner => {
      cacheManager.set(
        ownerCacheKey(owner._id),
        owner,
        900 // 15-minute TTL
      );
    });

    console.log(`✅ Cache prewarmed: ${topProperties.length} properties, ${topOwners.length} owners`);
    return true;
  } catch (error) {
    console.error('❌ Cache prewarming failed:', error.message);
    return false;
  }
};

export default cacheManager;
