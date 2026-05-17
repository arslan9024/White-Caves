/**
 * Rate Limiting Middleware — White Caves CRM
 * Protects against brute-force attacks and API abuse
 * Uses express-rate-limit with configurable windows per route type
 */

import rateLimit from 'express-rate-limit';

// ============================================================================
// AUTH RATE LIMITER — Strict limits for login/register/password
// ============================================================================

/** Login: 5 attempts per 15 minutes per IP */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    error: 'Too many login attempts',
    message: 'Too many login attempts from this IP. Please try again after 15 minutes.',
    statusCode: 429,
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  skipSuccessfulRequests: false,
});

/** Registration: 3 attempts per hour per IP */
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    success: false,
    error: 'Too many registration attempts',
    message: 'Too many registration attempts from this IP. Please try again after 1 hour.',
    statusCode: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/** Password change: 5 attempts per hour */
export const passwordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    error: 'Too many password change attempts',
    message: 'Too many password change attempts. Please try again later.',
    statusCode: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ============================================================================
// API RATE LIMITER — General API protection
// ============================================================================

/** General API: 100 requests per minute per IP */
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: {
    success: false,
    error: 'Rate limit exceeded',
    message: 'Too many requests from this IP. Please try again after 1 minute.',
    statusCode: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: req => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  },
});

// ============================================================================
// STRICT LIMITER — For sensitive operations (2FA, exports, bulk actions)
// ============================================================================

/** Strict: 10 requests per 15 minutes */
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    error: 'Rate limit exceeded',
    message: 'Too many requests for this operation. Please try again later.',
    statusCode: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ============================================================================
// CONTACT LIMITER — Public unauthenticated form submissions
// ============================================================================

/**
 * Contact form: 10 submissions per hour per IP.
 * Tighter than the general apiLimiter because this creates DB records from
 * unauthenticated requests and is a spam/flood vector.
 */
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    success: false,
    error: 'Too many contact form submissions',
    message: 'Too many submissions from this IP. Please try again after 1 hour.',
    statusCode: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default {
  authLimiter,
  registerLimiter,
  passwordLimiter,
  apiLimiter,
  strictLimiter,
  contactLimiter,
};
