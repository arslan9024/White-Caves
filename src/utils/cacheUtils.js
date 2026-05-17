// Utility for response caching with TTL
const CACHE_TTL = 2000; // 2 seconds

export const cacheUtils = {
  // Hash function for response comparison
  hashResponse: (data) => {
    return JSON.stringify(data).split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a; // Convert to 32bit integer
    }, 0);
  },

  // Check if cached response is fresh
  isCacheFresh: (lastFetchTime) => {
    if (!lastFetchTime) return false;
    return Date.now() - lastFetchTime < CACHE_TTL;
  },

  // Store response in cache
  setCacheResponse: (key, data) => {
    const cache = JSON.parse(localStorage.getItem('inventoryCache') || '{}');
    cache[key] = {
      data,
      hash: exports.cacheUtils.hashResponse(data),
      timestamp: Date.now(),
    };
    localStorage.setItem('inventoryCache', JSON.stringify(cache));
  },

  // Get cached response
  getCacheResponse: (key) => {
    const cache = JSON.parse(localStorage.getItem('inventoryCache') || '{}');
    return cache[key] || null;
  },

  // Check if data has changed
  hasDataChanged: (newData, cachedResponse) => {
    if (!cachedResponse) return true;
    const newHash = exports.cacheUtils.hashResponse(newData);
    return newHash !== cachedResponse.hash;
  },

  // Clear entire cache
  clearCache: () => {
    localStorage.removeItem('inventoryCache');
  },

  // Clear specific key
  clearCacheKey: (key) => {
    const cache = JSON.parse(localStorage.getItem('inventoryCache') || '{}');
    delete cache[key];
    localStorage.setItem('inventoryCache', JSON.stringify(cache));
  },
};

export default cacheUtils;
