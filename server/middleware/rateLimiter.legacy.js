import rateLimit from 'express-rate-limit';

// Auth endpoints - strict limiting to prevent brute force
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 attempts per window
  message: 'Too many login attempts. Please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req, res) => {
    // Rate limit by IP and email combination
    return `${req.ip}-${req.body?.email || 'unknown'}`;
  },
  skip: (req, res) => {
    // Skip rate limiting in development
    return process.env.NODE_ENV === 'development';
  },
});

// Password reset - moderate limiting
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Max 3 requests per hour
  message: 'Too many password reset requests. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    return `${req.ip}-${req.body?.email || 'unknown'}`;
  },
});

// Payment endpoints - moderate limiting
export const paymentLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Max 10 payment attempts per minute
  message: 'Too many payment requests. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    return `${req.ip}-${req.user?.id || 'unknown'}`;
  },
});

// General API endpoints - loose limiting
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per 15 minutes
  message: 'Too many requests from this IP. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// WhatsApp webhook - no limiting (use signature verification instead)
export const webhookLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1000, // Very generous for webhooks
  message: 'Too many webhook events.',
  standardHeaders: false,
  legacyHeaders: false,
  skip: (req, res) => {
    // Skip limiting if webhook signature is valid
    // This should be verified by middleware before this limiter
    return process.env.NODE_ENV === 'development';
  },
});
