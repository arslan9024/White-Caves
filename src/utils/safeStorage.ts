/**
 * Safe localStorage wrapper that handles:
 * - Private/incognito browsing (SecurityError)
 * - Storage quota exceeded (QuotaExceededError)
 * - Corrupted JSON data
 * - SSR/non-browser environments
 *
 * Usage:
 *   import { safeStorage } from '../utils/safeStorage';
 *   const token = safeStorage.get('token');
 *   safeStorage.set('token', 'abc123');
 *   safeStorage.remove('token');
 *   const user = safeStorage.getJSON<User>('userData');
 *   safeStorage.setJSON('userData', { name: 'Ali' });
 */

import { createLogger } from './logger';

const log = createLogger('safeStorage');

const isStorageAvailable = (): boolean => {
  try {
    const testKey = '__wc_storage_test__';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

const storageAvailable = typeof window !== 'undefined' && isStorageAvailable();

/** Keys that should be checked for expiry */
const EXPIRY_MANAGED_KEYS = new Set(['token', 'authToken', 'refreshToken']);

/** Default token TTL: 24 hours in ms */
const DEFAULT_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

export const safeStorage = {
  /**
   * Get a string value from localStorage.
   * For token keys, checks expiry and auto-cleans expired entries.
   */
  get(key: string, fallback: string | null = null): string | null {
    if (!storageAvailable) return fallback;
    try {
      // Expiry check for security-sensitive keys
      if (EXPIRY_MANAGED_KEYS.has(key)) {
        const mainValue = localStorage.getItem(key);
        if (!mainValue) {
          // Purge orphaned expiry key if main key is missing
          localStorage.removeItem(`${key}__expiry`);
          return fallback;
        }
        const expiryRaw = localStorage.getItem(`${key}__expiry`);
        if (expiryRaw) {
          const expiry = parseInt(expiryRaw, 10);
          if (!isNaN(expiry) && expiry > 0 && Date.now() > expiry) {
            // Token expired — purge both entries
            localStorage.removeItem(key);
            localStorage.removeItem(`${key}__expiry`);
            log.warn(`Token "${key}" expired and was removed.`);
            return fallback;
          }
        }
        return mainValue;
      }
      return localStorage.getItem(key) ?? fallback;
    } catch {
      return fallback;
    }
  },

  /**
   * Set a string value in localStorage.
   * For token keys, also stores an expiry timestamp.
   *
   * @param key     — Storage key
   * @param value   — Value to store
   * @param ttlMs   — Time-to-live in ms (default 24h for tokens, ignored for other keys)
   */
  set(key: string, value: string, ttlMs?: number): boolean {
    if (!storageAvailable) return false;
    try {
      localStorage.setItem(key, value);

      // Auto-set expiry for token keys
      if (EXPIRY_MANAGED_KEYS.has(key)) {
        const ttl = ttlMs ?? DEFAULT_TOKEN_TTL_MS;
        localStorage.setItem(`${key}__expiry`, String(Date.now() + ttl));
      }

      return true;
    } catch (e) {
      if (import.meta.env.DEV) {
        log.warn(`Failed to set "${key}":`, e);
      }
      return false;
    }
  },

  /**
   * Remove a key from localStorage (and its expiry entry if present)
   */
  remove(key: string): boolean {
    if (!storageAvailable) return false;
    try {
      localStorage.removeItem(key);
      localStorage.removeItem(`${key}__expiry`);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Get and parse a JSON value from localStorage
   */
  getJSON<T = unknown>(key: string, fallback: T | null = null): T | null {
    const raw = this.get(key);
    if (raw === null) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      // Corrupted data — clean it up
      this.remove(key);
      return fallback;
    }
  },

  /**
   * Stringify and set a JSON value in localStorage
   */
  setJSON(key: string, value: unknown): boolean {
    try {
      return this.set(key, JSON.stringify(value));
    } catch (e) {
      if (import.meta.env.DEV) {
        log.warn(`setJSON failed for key "${key}":`, e);
      }
      return false;
    }
  },
} as const;

export default safeStorage;
