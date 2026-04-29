import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateEnvironment } from './validateEnv';

// ── Mock logger ─────────────────────────────────────────────────────────
vi.mock('../utils/logger', () => ({
  createLogger: () => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
}));

// ═══════════════════════════════════════════════════════════════════════
describe('validateEnv', () => {
  const origEnv = { ...import.meta.env };

  beforeEach(() => {
    // Reset env to original state
    Object.keys(import.meta.env).forEach((key) => {
      if (key.startsWith('VITE_')) {
        delete (import.meta.env as Record<string, unknown>)[key];
      }
    });
    // Restore originals
    Object.assign(import.meta.env, origEnv);
  });

  it('returns valid=true when VITE_API_URL is set', () => {
    (import.meta.env as Record<string, unknown>).VITE_API_URL = 'http://localhost:3000';
    const result = validateEnvironment();
    expect(result.valid).toBe(true);
    expect(result.missing).toHaveLength(0);
  });

  it('returns valid=false when VITE_API_URL is missing', () => {
    delete (import.meta.env as Record<string, unknown>).VITE_API_URL;
    const result = validateEnvironment();
    expect(result.valid).toBe(false);
    expect(result.missing).toContain('VITE_API_URL');
  });

  it('treats empty string VITE_API_URL as missing', () => {
    (import.meta.env as Record<string, unknown>).VITE_API_URL = '   ';
    const result = validateEnvironment();
    expect(result.valid).toBe(false);
    expect(result.missing).toContain('VITE_API_URL');
  });

  it('generates warnings for missing optional vars', () => {
    (import.meta.env as Record<string, unknown>).VITE_API_URL = 'http://localhost:3000';
    delete (import.meta.env as Record<string, unknown>).VITE_FIREBASE_API_KEY;
    delete (import.meta.env as Record<string, unknown>).VITE_STRIPE_PUBLIC_KEY;
    const result = validateEnvironment();
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.warnings.some((w: string) => w.includes('Firebase Auth'))).toBe(true);
  });

  it('no warnings when all optional vars are set', () => {
    (import.meta.env as Record<string, unknown>).VITE_API_URL = 'http://localhost:3000';
    (import.meta.env as Record<string, unknown>).VITE_FIREBASE_API_KEY = 'key';
    (import.meta.env as Record<string, unknown>).VITE_FIREBASE_PROJECT_ID = 'proj';
    (import.meta.env as Record<string, unknown>).VITE_STRIPE_PUBLIC_KEY = 'pk';
    (import.meta.env as Record<string, unknown>).VITE_GOOGLE_MAPS_API_KEY = 'gm';
    (import.meta.env as Record<string, unknown>).VITE_WHATSAPP_ENABLED = 'true';
    const result = validateEnvironment();
    expect(result.warnings).toHaveLength(0);
    expect(result.valid).toBe(true);
  });

  it('result shape has valid, missing, and warnings', () => {
    (import.meta.env as Record<string, unknown>).VITE_API_URL = 'http://test';
    const result = validateEnvironment();
    expect(result).toHaveProperty('valid');
    expect(result).toHaveProperty('missing');
    expect(result).toHaveProperty('warnings');
    expect(typeof result.valid).toBe('boolean');
    expect(Array.isArray(result.missing)).toBe(true);
    expect(Array.isArray(result.warnings)).toBe(true);
  });
});
