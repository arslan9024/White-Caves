/**
 * Environment Configuration — Tests
 * Tests env.ts default values, type conversions, and production safeguards.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ─── Helpers ────────────────────────────────────────────────────────────
// We need to dynamically import env.ts after setting process.env
// because it executes side effects at import time.

function importEnvFresh() {
  // Clear the module cache so vitest re-evaluates the file
  vi.resetModules();
  return import('../config/env');
}

describe('server/config/env', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.resetModules();
    // Reset to clean state
    delete process.env.PORT;
    delete process.env.NODE_ENV;
    delete process.env.JWT_SECRET;
    delete process.env.DATABASE_URL;
    delete process.env.CORS_ORIGIN;
    delete process.env.WHATSAPP_WEBHOOK_SECRET;
  });

  afterEach(() => {
    // Restore original env
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  // ─── PORT ─────────────────────────────────────────────────────────
  describe('PORT', () => {
    it('defaults to 3001 when not set', async () => {
      const env = await importEnvFresh();
      expect(env.PORT).toBe(3001);
    });

    it('parses PORT from environment', async () => {
      process.env.PORT = '4000';
      const env = await importEnvFresh();
      expect(env.PORT).toBe(4000);
    });

    it('returns a number type', async () => {
      process.env.PORT = '8080';
      const env = await importEnvFresh();
      expect(typeof env.PORT).toBe('number');
    });
  });

  // ─── NODE_ENV ─────────────────────────────────────────────────────
  describe('NODE_ENV', () => {
    it('defaults to "development" when not set', async () => {
      const env = await importEnvFresh();
      expect(env.NODE_ENV).toBe('development');
    });

    it('reads from environment', async () => {
      process.env.NODE_ENV = 'test';
      const env = await importEnvFresh();
      expect(env.NODE_ENV).toBe('test');
    });
  });

  // ─── IS_PRODUCTION ────────────────────────────────────────────────
  describe('IS_PRODUCTION', () => {
    it('is false in development', async () => {
      process.env.NODE_ENV = 'development';
      const env = await importEnvFresh();
      expect(env.IS_PRODUCTION).toBe(false);
    });

    it('is true in production', async () => {
      // Need all required vars for production
      process.env.NODE_ENV = 'production';
      process.env.JWT_SECRET = 'real-secret';
      process.env.DATABASE_URL = 'mongodb://localhost/db';
      process.env.CORS_ORIGIN = 'https://whitecaves.ae';
      process.env.WHATSAPP_WEBHOOK_SECRET = 'webhook-secret';
      const env = await importEnvFresh();
      expect(env.IS_PRODUCTION).toBe(true);
    });
  });

  // ─── JWT_SECRET ───────────────────────────────────────────────────
  describe('JWT_SECRET', () => {
    it('uses fallback in development when not set', async () => {
      process.env.NODE_ENV = 'development';
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const env = await importEnvFresh();
      expect(env.JWT_SECRET).toContain('dev-only-secret');
      warnSpy.mockRestore();
    });

    it('uses provided JWT_SECRET', async () => {
      process.env.JWT_SECRET = 'my-custom-secret';
      const env = await importEnvFresh();
      expect(env.JWT_SECRET).toBe('my-custom-secret');
    });

    it('throws in production when JWT_SECRET is missing', async () => {
      process.env.NODE_ENV = 'production';
      // Don't set JWT_SECRET
      await expect(importEnvFresh()).rejects.toThrow('CRITICAL: JWT_SECRET');
    });
  });

  // ─── JWT_EXPIRES_SECONDS ──────────────────────────────────────────
  describe('JWT_EXPIRES_SECONDS', () => {
    it('is 7 days in seconds', async () => {
      const env = await importEnvFresh();
      expect(env.JWT_EXPIRES_SECONDS).toBe(7 * 24 * 60 * 60);
    });
  });

  // ─── BCRYPT_ROUNDS ────────────────────────────────────────────────
  describe('BCRYPT_ROUNDS', () => {
    it('is 12', async () => {
      const env = await importEnvFresh();
      expect(env.BCRYPT_ROUNDS).toBe(12);
    });
  });

  // ─── DATABASE_URL ─────────────────────────────────────────────────
  describe('DATABASE_URL', () => {
    it('uses empty string as fallback in development', async () => {
      process.env.NODE_ENV = 'development';
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const env = await importEnvFresh();
      expect(env.DATABASE_URL).toBe('');
      warnSpy.mockRestore();
    });

    it('uses provided DATABASE_URL', async () => {
      process.env.DATABASE_URL = 'mongodb://localhost:27017/whitecaves';
      const env = await importEnvFresh();
      expect(env.DATABASE_URL).toBe('mongodb://localhost:27017/whitecaves');
    });

    it('throws in production when DATABASE_URL is missing', async () => {
      process.env.NODE_ENV = 'production';
      process.env.JWT_SECRET = 'production-secret';
      // Don't set DATABASE_URL
      await expect(importEnvFresh()).rejects.toThrow('CRITICAL: DATABASE_URL');
    });
  });

  // ─── CORS_ORIGINS ─────────────────────────────────────────────────
  describe('CORS_ORIGINS', () => {
    it('defaults to ["http://localhost:5000"] in development', async () => {
      process.env.NODE_ENV = 'development';
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const env = await importEnvFresh();
      expect(env.CORS_ORIGINS).toEqual(['http://localhost:5000']);
      warnSpy.mockRestore();
    });

    it('splits comma-separated origins', async () => {
      process.env.CORS_ORIGIN = 'https://whitecaves.ae,https://admin.whitecaves.ae';
      const env = await importEnvFresh();
      expect(env.CORS_ORIGINS).toEqual(['https://whitecaves.ae', 'https://admin.whitecaves.ae']);
    });

    it('trims whitespace from origins', async () => {
      process.env.CORS_ORIGIN = '  https://a.com ,  https://b.com  ';
      const env = await importEnvFresh();
      expect(env.CORS_ORIGINS).toEqual(['https://a.com', 'https://b.com']);
    });

    it('throws in production when CORS_ORIGIN is missing', async () => {
      process.env.NODE_ENV = 'production';
      process.env.JWT_SECRET = 'production-secret';
      process.env.DATABASE_URL = 'mongodb://localhost/db';
      // Don't set CORS_ORIGIN
      await expect(importEnvFresh()).rejects.toThrow('CRITICAL: CORS_ORIGIN');
    });
  });

  // ─── WHATSAPP_WEBHOOK_SECRET ──────────────────────────────────────
  describe('WHATSAPP_WEBHOOK_SECRET', () => {
    it('uses empty string as fallback in development', async () => {
      process.env.NODE_ENV = 'development';
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const env = await importEnvFresh();
      expect(env.WHATSAPP_WEBHOOK_SECRET).toBe('');
      warnSpy.mockRestore();
    });

    it('uses provided value', async () => {
      process.env.WHATSAPP_WEBHOOK_SECRET = 'whatsapp-secret-123';
      const env = await importEnvFresh();
      expect(env.WHATSAPP_WEBHOOK_SECRET).toBe('whatsapp-secret-123');
    });

    it('throws in production when WHATSAPP_WEBHOOK_SECRET is missing', async () => {
      process.env.NODE_ENV = 'production';
      process.env.JWT_SECRET = 'prod-secret';
      process.env.DATABASE_URL = 'mongodb://localhost/db';
      process.env.CORS_ORIGIN = 'https://whitecaves.ae';
      // Don't set WHATSAPP_WEBHOOK_SECRET
      await expect(importEnvFresh()).rejects.toThrow('CRITICAL: WHATSAPP_WEBHOOK_SECRET');
    });
  });

  // ─── Full Production Config ───────────────────────────────────────
  describe('full production config', () => {
    it('loads all values without throwing when everything is set', async () => {
      process.env.NODE_ENV = 'production';
      process.env.PORT = '8080';
      process.env.JWT_SECRET = 'super-secret-production-key';
      process.env.DATABASE_URL = 'mongodb+srv://user:pass@cluster.mongodb.net/whitecaves';
      process.env.CORS_ORIGIN = 'https://whitecaves.ae';
      process.env.WHATSAPP_WEBHOOK_SECRET = 'wh-secret-prod';

      const env = await importEnvFresh();

      expect(env.PORT).toBe(8080);
      expect(env.IS_PRODUCTION).toBe(true);
      expect(env.JWT_SECRET).toBe('super-secret-production-key');
      expect(env.DATABASE_URL).toBe('mongodb+srv://user:pass@cluster.mongodb.net/whitecaves');
      expect(env.CORS_ORIGINS).toEqual(['https://whitecaves.ae']);
      expect(env.WHATSAPP_WEBHOOK_SECRET).toBe('wh-secret-prod');
    });
  });
});
