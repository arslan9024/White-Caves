import { describe, it, expect } from 'vitest';
import {
  EMAIL_REGEX,
  PHONE_REGEX,
  isValidEmail,
  isValidPhone,
  isRequired,
  isWithinLength,
  MAX_MESSAGE_LENGTH,
  MAX_PRICE,
  MAX_BEDROOMS,
  MAX_BATHROOMS,
  MAX_SQFT,
} from './validation';

// ═══════════════════════════════════════════════════════════════════════
describe('validation utilities', () => {
  // ── EMAIL_REGEX ───────────────────────────────────────────────────
  describe('EMAIL_REGEX', () => {
    it.each([
      'user@example.com',
      'user.name@domain.co',
      'user+tag@domain.org',
      'user_name@sub.domain.com',
      'user%special@domain.io',
      'a@b.cd',
    ])('matches valid email: %s', (email) => {
      expect(EMAIL_REGEX.test(email)).toBe(true);
    });

    it.each([
      'no-at-sign',
      '@missing-local.com',
      'user@',
      'user@.com',
      'user@domain.c',         // TLD < 2 chars
      'user@domain',           // no TLD
      '',
    ])('rejects invalid email: "%s"', (email) => {
      expect(EMAIL_REGEX.test(email)).toBe(false);
    });
  });

  // ── PHONE_REGEX ───────────────────────────────────────────────────
  describe('PHONE_REGEX', () => {
    it.each([
      '+971501234567',
      '050 123 4567',
      '(050) 1234567',
      '+1-800-555-0199',
      '1234567',
    ])('matches valid phone: %s', (phone) => {
      expect(PHONE_REGEX.test(phone)).toBe(true);
    });

    it.each([
      '12345',        // too short (< 7)
      '+'.padEnd(25, '1'), // too long (> 20)
      'abc',
    ])('rejects invalid phone: "%s"', (phone) => {
      expect(PHONE_REGEX.test(phone)).toBe(false);
    });
  });

  // ── isValidEmail ──────────────────────────────────────────────────
  describe('isValidEmail', () => {
    it('returns true for valid email', () => {
      expect(isValidEmail('hello@world.com')).toBe(true);
    });

    it('trims whitespace before validation', () => {
      expect(isValidEmail('  hello@world.com  ')).toBe(true);
    });

    it('returns false for null', () => {
      expect(isValidEmail(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isValidEmail(undefined)).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(isValidEmail('')).toBe(false);
    });

    it('returns false for non-email string', () => {
      expect(isValidEmail('not-an-email')).toBe(false);
    });

    it('returns false for non-string type coerced via any', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(isValidEmail(12345 as any)).toBe(false);
    });
  });

  // ── isValidPhone ──────────────────────────────────────────────────
  describe('isValidPhone', () => {
    it('returns true for valid international phone', () => {
      expect(isValidPhone('+971501234567')).toBe(true);
    });

    it('returns true for formatted phone with spaces/dashes', () => {
      expect(isValidPhone('+1-800-555-0199')).toBe(true);
    });

    it('returns false when < 4 actual digits', () => {
      expect(isValidPhone('(---) ---1-2-3')).toBe(false);
    });

    it('returns false for null', () => {
      expect(isValidPhone(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isValidPhone(undefined)).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(isValidPhone('')).toBe(false);
    });

    it('returns false for non-string type', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(isValidPhone(123 as any)).toBe(false);
    });

    it('returns false for too short input', () => {
      expect(isValidPhone('123')).toBe(false);
    });
  });

  // ── isRequired ────────────────────────────────────────────────────
  describe('isRequired', () => {
    it('returns true for non-empty string', () => {
      expect(isRequired('hello')).toBe(true);
    });

    it('returns false for whitespace-only string', () => {
      expect(isRequired('   ')).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(isRequired('')).toBe(false);
    });

    it('returns false for null', () => {
      expect(isRequired(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isRequired(undefined)).toBe(false);
    });

    it('returns false for non-string type', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(isRequired(0 as any)).toBe(false);
    });
  });

  // ── isWithinLength ────────────────────────────────────────────────
  describe('isWithinLength', () => {
    it('returns true when within max', () => {
      expect(isWithinLength('abc', 10)).toBe(true);
    });

    it('returns true when exactly at max', () => {
      expect(isWithinLength('abc', 3)).toBe(true);
    });

    it('returns false when exceeds max', () => {
      expect(isWithinLength('abcd', 3)).toBe(false);
    });

    it('returns true when between min and max', () => {
      expect(isWithinLength('abc', 10, 2)).toBe(true);
    });

    it('returns false when below min', () => {
      expect(isWithinLength('a', 10, 3)).toBe(false);
    });

    it('returns true at exact min boundary', () => {
      expect(isWithinLength('abc', 10, 3)).toBe(true);
    });

    it('returns false for null', () => {
      expect(isWithinLength(null, 10)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isWithinLength(undefined, 10)).toBe(false);
    });

    it('handles empty string with min=0', () => {
      expect(isWithinLength('', 10, 0)).toBe(true);
    });

    it('handles empty string with min > 0', () => {
      expect(isWithinLength('', 10, 1)).toBe(false);
    });
  });

  // ── Form Constants ────────────────────────────────────────────────
  describe('form constants', () => {
    it('MAX_MESSAGE_LENGTH is 2000', () => {
      expect(MAX_MESSAGE_LENGTH).toBe(2000);
    });

    it('MAX_PRICE is 999_999_999', () => {
      expect(MAX_PRICE).toBe(999_999_999);
    });

    it('MAX_BEDROOMS is 50', () => {
      expect(MAX_BEDROOMS).toBe(50);
    });

    it('MAX_BATHROOMS is 50', () => {
      expect(MAX_BATHROOMS).toBe(50);
    });

    it('MAX_SQFT is 999_999', () => {
      expect(MAX_SQFT).toBe(999_999);
    });
  });
});
