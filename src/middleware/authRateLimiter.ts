import rateLimit from 'express-rate-limit';

// Auth‑specific rate limiter – stricter limits to mitigate credential‑stuffing attacks
export const authRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // 20 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts, please try again later.' },
});
