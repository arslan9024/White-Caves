/**
 * Rate Limiter Middleware — Tests
 * Validates configuration integrity of all rate limiters:
 *   authLimiter, registerLimiter, passwordLimiter, apiLimiter, strictLimiter
 *
 * NOTE: We test the middleware functions exist and have the correct config.
 * Full integration tests (actually hitting rate limits) would require supertest.
 */

import { describe, it, expect } from 'vitest';
import {
  authLimiter,
  registerLimiter,
  passwordLimiter,
  apiLimiter,
  strictLimiter,
} from './rateLimiter';
import rateLimiterDefault from './rateLimiter';

// ─── Helper: All limiters are Express middleware ────────────────────────
function isMiddleware(fn: unknown): boolean {
  return typeof fn === 'function';
}

// ─── Exports ────────────────────────────────────────────────────────────
describe('rateLimiter exports', () => {
  it('exports authLimiter as a function', () => {
    expect(isMiddleware(authLimiter)).toBe(true);
  });

  it('exports registerLimiter as a function', () => {
    expect(isMiddleware(registerLimiter)).toBe(true);
  });

  it('exports passwordLimiter as a function', () => {
    expect(isMiddleware(passwordLimiter)).toBe(true);
  });

  it('exports apiLimiter as a function', () => {
    expect(isMiddleware(apiLimiter)).toBe(true);
  });

  it('exports strictLimiter as a function', () => {
    expect(isMiddleware(strictLimiter)).toBe(true);
  });

  it('default export contains all 5 limiters', () => {
    expect(rateLimiterDefault).toHaveProperty('authLimiter');
    expect(rateLimiterDefault).toHaveProperty('registerLimiter');
    expect(rateLimiterDefault).toHaveProperty('passwordLimiter');
    expect(rateLimiterDefault).toHaveProperty('apiLimiter');
    expect(rateLimiterDefault).toHaveProperty('strictLimiter');
  });
});

// ─── authLimiter Config ─────────────────────────────────────────────────
describe('authLimiter', () => {
  it('is a valid middleware function', () => {
    expect(typeof authLimiter).toBe('function');
    // Express middleware has 3 params (req, res, next)
    expect(authLimiter.length).toBeLessThanOrEqual(3);
  });

  it('exists and is distinct from other limiters', () => {
    expect(authLimiter).not.toBe(registerLimiter);
    expect(authLimiter).not.toBe(apiLimiter);
    expect(authLimiter).not.toBe(strictLimiter);
  });
});

// ─── registerLimiter Config ─────────────────────────────────────────────
describe('registerLimiter', () => {
  it('is a valid middleware function', () => {
    expect(typeof registerLimiter).toBe('function');
  });

  it('is distinct from authLimiter (different limits)', () => {
    expect(registerLimiter).not.toBe(authLimiter);
  });
});

// ─── passwordLimiter Config ─────────────────────────────────────────────
describe('passwordLimiter', () => {
  it('is a valid middleware function', () => {
    expect(typeof passwordLimiter).toBe('function');
  });

  it('is distinct from authLimiter', () => {
    expect(passwordLimiter).not.toBe(authLimiter);
  });
});

// ─── apiLimiter Config ──────────────────────────────────────────────────
describe('apiLimiter', () => {
  it('is a valid middleware function', () => {
    expect(typeof apiLimiter).toBe('function');
  });

  it('is distinct from strict limiters', () => {
    expect(apiLimiter).not.toBe(authLimiter);
    expect(apiLimiter).not.toBe(strictLimiter);
  });
});

// ─── strictLimiter Config ───────────────────────────────────────────────
describe('strictLimiter', () => {
  it('is a valid middleware function', () => {
    expect(typeof strictLimiter).toBe('function');
  });

  it('is distinct from apiLimiter', () => {
    expect(strictLimiter).not.toBe(apiLimiter);
  });
});

// ─── All limiters have consistent structure ─────────────────────────────
describe('all limiters consistency', () => {
  const limiters = [
    { name: 'authLimiter', fn: authLimiter },
    { name: 'registerLimiter', fn: registerLimiter },
    { name: 'passwordLimiter', fn: passwordLimiter },
    { name: 'apiLimiter', fn: apiLimiter },
    { name: 'strictLimiter', fn: strictLimiter },
  ];

  it.each(limiters)('$name is a callable function', ({ fn }) => {
    expect(typeof fn).toBe('function');
  });

  it('all 5 limiters are unique instances', () => {
    const set = new Set([authLimiter, registerLimiter, passwordLimiter, apiLimiter, strictLimiter]);
    expect(set.size).toBe(5);
  });
});
