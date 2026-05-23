/**
 * safeStorage.test.ts — Comprehensive tests for safe localStorage wrapper
 * ────────────────────────────────────────────────────────────────────────
 * Tests: get/set/remove, getJSON/setJSON, token expiry management,
 *        corrupted data recovery.
 *
 * NOTE: safeStorage caches `storageAvailable` at module load time.
 * We need to ensure a working localStorage BEFORE the module evaluates.
 * We use vi.hoisted() to set up localStorage before any imports.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Set up localStorage BEFORE any module imports using vi.hoisted() ────
const { storageMap } = vi.hoisted(() => {
  const storageMap = new Map<string, string>();

  const localStorageMock: Storage = {
    get length() { return storageMap.size; },
    key(index: number) {
      const keys = Array.from(storageMap.keys());
      return keys[index] ?? null;
    },
    getItem(key: string) { return storageMap.get(key) ?? null; },
    setItem(key: string, value: string) { storageMap.set(key, String(value)); },
    removeItem(key: string) { storageMap.delete(key); },
    clear() { storageMap.clear(); },
  };

  Object.defineProperty(globalThis, 'localStorage', {
    value: localStorageMock,
    writable: true,
    configurable: true,
  });

  return { storageMap };
});

// ─── Mock logger ─────────────────────────────────────────────────────────
vi.mock('./logger', () => ({
  createLogger: () => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
}));

// Now import safeStorage — it will evaluate `isStorageAvailable()` using our mock
import { safeStorage } from './safeStorage';

describe('safeStorage', () => {
  beforeEach(() => {
    storageMap.clear();
  });

  // ═══════════════════════════════════════════════════════════════════════
  //  Basic get/set/remove
  // ═══════════════════════════════════════════════════════════════════════

  describe('get', () => {
    it('returns value from localStorage', () => {
      localStorage.setItem('testKey', 'testValue');
      expect(safeStorage.get('testKey')).toBe('testValue');
    });

    it('returns null when key does not exist', () => {
      expect(safeStorage.get('nonExistent')).toBeNull();
    });

    it('returns fallback when key does not exist', () => {
      expect(safeStorage.get('nonExistent', 'fallbackValue')).toBe('fallbackValue');
    });

    it('returns null as default fallback', () => {
      expect(safeStorage.get('missing')).toBeNull();
    });
  });

  describe('set', () => {
    it('stores value in localStorage', () => {
      safeStorage.set('myKey', 'myValue');
      expect(localStorage.getItem('myKey')).toBe('myValue');
    });

    it('returns true on success', () => {
      expect(safeStorage.set('key', 'value')).toBe(true);
    });

    it('overwrites existing value', () => {
      safeStorage.set('key', 'first');
      safeStorage.set('key', 'second');
      expect(localStorage.getItem('key')).toBe('second');
    });
  });

  describe('remove', () => {
    it('removes key from localStorage', () => {
      localStorage.setItem('key', 'value');
      safeStorage.remove('key');
      expect(localStorage.getItem('key')).toBeNull();
    });

    it('also removes the expiry key', () => {
      localStorage.setItem('token', 'abc');
      localStorage.setItem('token__expiry', '999999999999999');
      safeStorage.remove('token');
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('token__expiry')).toBeNull();
    });

    it('returns true on success', () => {
      expect(safeStorage.remove('key')).toBe(true);
    });

    it('returns true even if key did not exist', () => {
      expect(safeStorage.remove('nonExistent')).toBe(true);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  //  Token Expiry Management
  // ═══════════════════════════════════════════════════════════════════════

  describe('Token expiry management', () => {
    it('auto-sets expiry when setting "token" key', () => {
      safeStorage.set('token', 'jwt-123');
      const expiry = localStorage.getItem('token__expiry');
      expect(expiry).not.toBeNull();
      const expiryMs = parseInt(expiry!, 10);
      // Should be roughly 24 hours from now
      const expected = Date.now() + 24 * 60 * 60 * 1000;
      expect(expiryMs).toBeGreaterThan(Date.now());
      expect(Math.abs(expiryMs - expected)).toBeLessThan(1000); // Within 1 second
    });

    it('auto-sets expiry for "authToken" key', () => {
      safeStorage.set('authToken', 'auth-456');
      expect(localStorage.getItem('authToken__expiry')).not.toBeNull();
    });

    it('auto-sets expiry for "refreshToken" key', () => {
      safeStorage.set('refreshToken', 'refresh-789');
      expect(localStorage.getItem('refreshToken__expiry')).not.toBeNull();
    });

    it('does NOT set expiry for non-token keys', () => {
      safeStorage.set('username', 'ali');
      expect(localStorage.getItem('username__expiry')).toBeNull();
    });

    it('supports custom TTL', () => {
      const customTtl = 5000; // 5 seconds
      safeStorage.set('token', 'short-lived', customTtl);
      const expiry = parseInt(localStorage.getItem('token__expiry')!, 10);
      const expected = Date.now() + customTtl;
      expect(Math.abs(expiry - expected)).toBeLessThan(1000);
    });

    it('returns value for non-expired token', () => {
      localStorage.setItem('token', 'valid-jwt');
      localStorage.setItem('token__expiry', String(Date.now() + 60_000));
      expect(safeStorage.get('token')).toBe('valid-jwt');
    });

    it('returns fallback for expired token and cleans up', () => {
      localStorage.setItem('token', 'expired-jwt');
      localStorage.setItem('token__expiry', String(Date.now() - 1000));
      expect(safeStorage.get('token')).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('token__expiry')).toBeNull();
    });

    it('returns fallback for expired token with custom fallback', () => {
      localStorage.setItem('token', 'expired-jwt');
      localStorage.setItem('token__expiry', String(Date.now() - 1000));
      expect(safeStorage.get('token', 'default-token')).toBe('default-token');
    });

    it('returns value when token has no expiry entry (backwards compat)', () => {
      localStorage.setItem('token', 'legacy-jwt');
      expect(safeStorage.get('token')).toBe('legacy-jwt');
    });

    it('purges orphaned expiry key when main token key is missing', () => {
      localStorage.setItem('token__expiry', String(Date.now() + 60_000));
      expect(safeStorage.get('token')).toBeNull();
      expect(localStorage.getItem('token__expiry')).toBeNull();
    });

    it('handles malformed expiry value gracefully', () => {
      localStorage.setItem('token', 'some-jwt');
      localStorage.setItem('token__expiry', 'not-a-number');
      expect(safeStorage.get('token')).toBe('some-jwt');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  //  JSON Operations
  // ═══════════════════════════════════════════════════════════════════════

  describe('getJSON', () => {
    it('parses JSON from localStorage', () => {
      localStorage.setItem('user', JSON.stringify({ name: 'Ali', age: 30 }));
      const result = safeStorage.getJSON<{ name: string; age: number }>('user');
      expect(result).toEqual({ name: 'Ali', age: 30 });
    });

    it('returns fallback when key does not exist', () => {
      expect(safeStorage.getJSON('missing', { default: true })).toEqual({ default: true });
    });

    it('returns null when key does not exist and no fallback', () => {
      expect(safeStorage.getJSON('missing')).toBeNull();
    });

    it('handles arrays', () => {
      localStorage.setItem('items', JSON.stringify([1, 2, 3]));
      expect(safeStorage.getJSON<number[]>('items')).toEqual([1, 2, 3]);
    });

    it('handles primitive JSON values', () => {
      localStorage.setItem('count', '42');
      expect(safeStorage.getJSON<number>('count')).toBe(42);
    });

    it('cleans up corrupted JSON and returns fallback', () => {
      localStorage.setItem('broken', '{invalid json!!!');
      const result = safeStorage.getJSON('broken', 'clean');
      expect(result).toBe('clean');
      expect(localStorage.getItem('broken')).toBeNull();
    });
  });

  describe('setJSON', () => {
    it('stores JSON-stringified object', () => {
      safeStorage.setJSON('user', { name: 'Ali' });
      expect(localStorage.getItem('user')).toBe('{"name":"Ali"}');
    });

    it('stores arrays', () => {
      safeStorage.setJSON('list', [1, 2, 3]);
      expect(localStorage.getItem('list')).toBe('[1,2,3]');
    });

    it('stores primitive values', () => {
      safeStorage.setJSON('flag', true);
      expect(localStorage.getItem('flag')).toBe('true');
    });

    it('returns true on success', () => {
      expect(safeStorage.setJSON('key', { data: 1 })).toBe(true);
    });

    it('handles null value', () => {
      safeStorage.setJSON('nullable', null);
      expect(localStorage.getItem('nullable')).toBe('null');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  //  Round-trip: setJSON → getJSON
  // ═══════════════════════════════════════════════════════════════════════

  describe('JSON round-trip', () => {
    it('preserves complex objects', () => {
      const original = {
        id: '123',
        name: 'White Caves',
        settings: { theme: 'dark', lang: 'ar' },
        tags: ['real-estate', 'crm'],
      };
      safeStorage.setJSON('config', original);
      expect(safeStorage.getJSON('config')).toEqual(original);
    });

    it('preserves nested arrays', () => {
      const data = [[1, 2], [3, 4]];
      safeStorage.setJSON('matrix', data);
      expect(safeStorage.getJSON('matrix')).toEqual(data);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  //  Edge Cases
  // ═══════════════════════════════════════════════════════════════════════

  describe('Edge cases', () => {
    it('handles empty string value', () => {
      safeStorage.set('empty', '');
      expect(safeStorage.get('empty')).toBe('');
    });

    it('handles very long values', () => {
      const longValue = 'x'.repeat(10_000);
      safeStorage.set('long', longValue);
      expect(safeStorage.get('long')).toBe(longValue);
    });

    it('handles special characters in keys', () => {
      safeStorage.set('key-with-special_chars.v2', 'test');
      expect(safeStorage.get('key-with-special_chars.v2')).toBe('test');
    });

    it('handles unicode values', () => {
      safeStorage.set('arabic', 'مرحبا');
      expect(safeStorage.get('arabic')).toBe('مرحبا');
    });
  });
});
