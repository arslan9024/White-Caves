/**
 * Rate Limiting Middleware
 * Prevents abuse and DoS attacks on inventory/sourcing endpoints
 * Uses in-memory store for simplicity (can be upgraded to Redis)
 */

import rateLimit from 'express-rate-limit';

// Store for rate limiting (in-memory; for production use Redis)
const requestStore = new Map();

// Cleanup old entries (older than 15 minutes)
setInterval(() => {
  const fifteenMinutesAgo = Date.now() - 15 * 60 * 1000;
  for (const [key, timestamps] of requestStore.entries()) {
    const recent = timestamps.filter(t => t > fifteenMinutesAgo);
    if (recent.length === 0) {
      requestStore.delete(key);
    } else {
      requestStore.set(key, recent);
    }
  }
}, 60 * 1000); // Run every minute

// Custom rate limit handler
const customRateLimitHandler = (req, res) => {
  res.status(429).json({
    success: false,
    error: 'Too many requests',
    message: 'You have exceeded the rate limit. Please try again later.',
    retryAfter: req.rateLimit?.resetTime ? 
      Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000) : 
      60
  });
};

/**
 * TIER 1: Strict limits for property search/discovery
 * 100 requests per minute per user/IP
 */
export const searchRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100,
  message: 'Too many property searches, please try again later',
  standardHeaders: false,
  skip: (req) => {
    // Skip rate limiting for admin users (if auth system exists)
    return req.user?.role === 'admin';
  },
  handler: customRateLimitHandler,
  keyGenerator: (req) => {
    // Use IP address or user ID if authenticated
    return req.user?.id || req.ip;
  },
});

/**
 * TIER 2: Moderate limits for property updates
 * 50 requests per hour per user
 */
export const updatePropertyRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50,
  message: 'Too many property updates, please try again later',
  standardHeaders: false,
  handler: customRateLimitHandler,
  keyGenerator: (req) => {
    return req.user?.id || req.ip;
  },
});

/**
 * TIER 3: Strict limits for opportunity creation (property sourcing)
 * 20 opportunities per hour per user
 */
export const createOpportunityRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: 'Too many opportunities created, please try again later',
  standardHeaders: false,
  handler: customRateLimitHandler,
  keyGenerator: (req) => {
    return req.user?.id || req.ip;
  },
});

/**
 * TIER 4: Very strict limits for status updates
 * 100 updates per hour per user
 */
export const updateStatusRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
  message: 'Too many status updates, please try again later',
  standardHeaders: false,
  handler: customRateLimitHandler,
  keyGenerator: (req) => {
    return req.user?.id || req.ip;
  },
});

/**
 * TIER 5: Extreme limits for API admin/stats endpoints
 * 30 requests per minute
 */
export const statsRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30,
  message: 'Too many requests to stats endpoint',
  standardHeaders: false,
  handler: customRateLimitHandler,
  keyGenerator: (req) => {
    return req.user?.id || req.ip;
  },
});

/**
 * TIER 6: Bulk operation limits
 * 5 bulk operations per hour
 */
export const bulkOperationRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: 'Too many bulk operations, please try again later',
  standardHeaders: false,
  handler: customRateLimitHandler,
  keyGenerator: (req) => {
    return req.user?.id || req.ip;
  },
});

/**
 * TIER 7: Conversation analysis (real-time processing)
 * 60 analyses per hour per user (1 per minute average)
 */
export const analyzeConversationRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 60,
  message: 'Too many conversation analyses, please try again later',
  standardHeaders: false,
  handler: customRateLimitHandler,
  keyGenerator: (req) => {
    return req.user?.id || req.ip;
  },
});

// Export all limits as a group for easy application
export const inventoryRateLimits = {
  search: searchRateLimit,
  update: updatePropertyRateLimit,
  createOpportunity: createOpportunityRateLimit,
  updateStatus: updateStatusRateLimit,
  stats: statsRateLimit,
  bulk: bulkOperationRateLimit,
  analyze: analyzeConversationRateLimit,
};
