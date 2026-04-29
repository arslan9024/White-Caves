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
  // Schema engine
  createSchema,
  validate,
  validateField,
  hasErrors,
  // Composable validators
  required,
  minLength,
  maxLength,
  emailValidator,
  phoneValidator,
  hasUppercase,
  hasLowercase,
  hasNumber,
  hasSpecialChar,
  matchesField,
  matchesPattern,
  numberRange,
  dubaiPhone,
  // Password
  analyzePassword,
  // Pre-built schemas
  signInSchema,
  createSignUpSchema,
  contactSchema,
  propertyInquirySchema,
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

// ═══════════════════════════════════════════════════════════════════════
// SCHEMA-BASED VALIDATION ENGINE
// ═══════════════════════════════════════════════════════════════════════

describe('schema validation engine', () => {
  // ── createSchema & validate ────────────────────────────────────────
  describe('createSchema / validate', () => {
    it('returns empty object when all fields are valid', () => {
      const schema = createSchema({
        name: [required()],
        email: [required(), emailValidator()],
      });
      const result = validate(schema, { name: 'Ali', email: 'ali@test.com' });
      expect(result).toEqual({});
    });

    it('returns errors for invalid fields', () => {
      const schema = createSchema({
        name: [required()],
        email: [required(), emailValidator()],
      });
      const result = validate(schema, { name: '', email: 'bad' });
      expect(result.name).toBe('This field is required');
      expect(result.email).toBe('Please enter a valid email address');
    });

    it('stops at first error per field', () => {
      const schema = createSchema({
        pw: [required(), minLength(8), hasUppercase()],
      });
      const result = validate(schema, { pw: '' });
      expect(result.pw).toBe('This field is required');
      // Only one error per field
      expect(Object.keys(result)).toHaveLength(1);
    });
  });

  // ── validateField ──────────────────────────────────────────────────
  describe('validateField', () => {
    it('returns null when all validators pass', () => {
      expect(validateField([required(), minLength(2)], 'hello')).toBeNull();
    });

    it('returns first error message', () => {
      expect(validateField([required(), minLength(5)], 'hi')).toBe(
        'Must be at least 5 characters',
      );
    });
  });

  // ── hasErrors ──────────────────────────────────────────────────────
  describe('hasErrors', () => {
    it('returns false for empty object', () => {
      expect(hasErrors({})).toBe(false);
    });

    it('returns true when errors exist', () => {
      expect(hasErrors({ email: 'Required' })).toBe(true);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════
// COMPOSABLE VALIDATORS
// ═══════════════════════════════════════════════════════════════════════

describe('composable validators', () => {
  // ── required ───────────────────────────────────────────────────────
  describe('required', () => {
    const v = required();
    it('passes non-empty string', () => expect(v('hello')).toBeNull());
    it('fails empty string', () => expect(v('')).toBe('This field is required'));
    it('fails whitespace-only', () => expect(v('   ')).toBe('This field is required'));
    it('fails null', () => expect(v(null)).toBe('This field is required'));
    it('fails undefined', () => expect(v(undefined)).toBe('This field is required'));
    it('supports custom message', () => {
      expect(required('Name needed')('')).toBe('Name needed');
    });
  });

  // ── minLength ──────────────────────────────────────────────────────
  describe('minLength', () => {
    const v = minLength(3);
    it('passes when >= min', () => expect(v('abc')).toBeNull());
    it('fails when < min', () => expect(v('ab')).toBe('Must be at least 3 characters'));
    it('skips non-string', () => expect(v(42)).toBeNull());
    it('allows custom message', () => {
      expect(minLength(5, 'Too short')('hi')).toBe('Too short');
    });
  });

  // ── maxLength ──────────────────────────────────────────────────────
  describe('maxLength', () => {
    const v = maxLength(5);
    it('passes when <= max', () => expect(v('hello')).toBeNull());
    it('fails when > max', () => expect(v('hello!')).toBe('Must be no more than 5 characters'));
    it('skips non-string', () => expect(v(123456)).toBeNull());
  });

  // ── emailValidator ─────────────────────────────────────────────────
  describe('emailValidator', () => {
    const v = emailValidator();
    it('passes valid email', () => expect(v('a@b.co')).toBeNull());
    it('fails invalid email', () =>
      expect(v('not-email')).toBe('Please enter a valid email address'));
    it('skips empty string (use required for that)', () => expect(v('')).toBeNull());
  });

  // ── phoneValidator ─────────────────────────────────────────────────
  describe('phoneValidator', () => {
    const v = phoneValidator();
    it('passes valid phone', () => expect(v('+971501234567')).toBeNull());
    it('fails 3-digit input', () =>
      expect(v('123')).toBe('Please enter a valid phone number'));
    it('skips empty', () => expect(v('')).toBeNull());
  });

  // ── hasUppercase ───────────────────────────────────────────────────
  describe('hasUppercase', () => {
    const v = hasUppercase();
    it('passes with uppercase', () => expect(v('Hello')).toBeNull());
    it('fails all lowercase', () =>
      expect(v('hello')).toBe('Must contain at least one uppercase letter'));
  });

  // ── hasLowercase ───────────────────────────────────────────────────
  describe('hasLowercase', () => {
    const v = hasLowercase();
    it('passes with lowercase', () => expect(v('Hello')).toBeNull());
    it('fails all uppercase', () =>
      expect(v('HELLO')).toBe('Must contain at least one lowercase letter'));
  });

  // ── hasNumber ──────────────────────────────────────────────────────
  describe('hasNumber', () => {
    const v = hasNumber();
    it('passes with digit', () => expect(v('abc1')).toBeNull());
    it('fails no digits', () => expect(v('abc')).toBe('Must contain at least one number'));
  });

  // ── hasSpecialChar ─────────────────────────────────────────────────
  describe('hasSpecialChar', () => {
    const v = hasSpecialChar();
    it('passes with special char', () => expect(v('abc!')).toBeNull());
    it('fails no special char', () =>
      expect(v('abc123')).toBe('Must contain at least one special character'));
  });

  // ── matchesField ───────────────────────────────────────────────────
  describe('matchesField', () => {
    let pw = 'Secret1!';
    const v = matchesField(() => pw);
    it('passes when values match', () => expect(v('Secret1!')).toBeNull());
    it('fails when values differ', () =>
      expect(v('Different')).toBe('Fields do not match'));
  });

  // ── matchesPattern ─────────────────────────────────────────────────
  describe('matchesPattern', () => {
    const v = matchesPattern(/^[A-Z]{3}$/, 'Must be 3 uppercase letters');
    it('passes matching pattern', () => expect(v('ABC')).toBeNull());
    it('fails non-matching', () => expect(v('abc')).toBe('Must be 3 uppercase letters'));
    it('skips empty', () => expect(v('')).toBeNull());
  });

  // ── numberRange ────────────────────────────────────────────────────
  describe('numberRange', () => {
    const v = numberRange(1, 100);
    it('passes within range', () => expect(v(50)).toBeNull());
    it('passes at boundaries', () => {
      expect(v(1)).toBeNull();
      expect(v(100)).toBeNull();
    });
    it('fails below range', () => expect(v(0)).toBe('Must be between 1 and 100'));
    it('fails above range', () => expect(v(101)).toBe('Must be between 1 and 100'));
    it('parses string numbers', () => expect(v('50')).toBeNull());
    it('fails NaN', () => expect(v('abc')).toBeTruthy());
  });

  // ── dubaiPhone ─────────────────────────────────────────────────────
  describe('dubaiPhone', () => {
    const v = dubaiPhone();
    it('passes +971 mobile', () => expect(v('+971501234567')).toBeNull());
    it('passes +971 landline', () => expect(v('+97142345678')).toBeNull());
    it('fails without +971 prefix', () =>
      expect(v('+1234567890')).toBe('Please enter a valid UAE phone number (+971...)'));
    it('skips empty', () => expect(v('')).toBeNull());
  });
});

// ═══════════════════════════════════════════════════════════════════════
// PASSWORD STRENGTH ANALYSIS
// ═══════════════════════════════════════════════════════════════════════

describe('analyzePassword', () => {
  it('rates short lowercase-only as weak', () => {
    const { strength, score, feedback } = analyzePassword('abc');
    expect(strength).toBe('weak');
    expect(score).toBeLessThanOrEqual(1);
    expect(feedback.length).toBeGreaterThan(0);
  });

  it('rates 8-char mixed-case as fair', () => {
    const { strength } = analyzePassword('Abcdefgh');
    expect(['fair', 'good']).toContain(strength);
  });

  it('rates strong password correctly', () => {
    const { strength, score } = analyzePassword('MyP@ssw0rd!2026');
    expect(strength).toBe('strong');
    expect(score).toBe(4);
  });

  it('gives feedback for missing criteria', () => {
    const { feedback } = analyzePassword('password');
    expect(feedback.some((f) => f.toLowerCase().includes('uppercase'))).toBe(true);
  });

  it('returns empty feedback for perfect password', () => {
    const { feedback } = analyzePassword('Str0ng!Passw0rd12');
    expect(feedback).toHaveLength(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// PRE-BUILT SCHEMAS
// ═══════════════════════════════════════════════════════════════════════

describe('pre-built schemas', () => {
  describe('signInSchema', () => {
    it('passes valid sign-in', () => {
      const errors = validate(signInSchema, { email: 'test@test.com', password: 'pass' });
      expect(hasErrors(errors)).toBe(false);
    });

    it('requires email', () => {
      const errors = validate(signInSchema, { email: '', password: 'pass' });
      expect(errors.email).toBeTruthy();
    });

    it('requires password', () => {
      const errors = validate(signInSchema, { email: 'test@test.com', password: '' });
      expect(errors.password).toBeTruthy();
    });
  });

  describe('createSignUpSchema', () => {
    const password = 'MyP@ss1!';
    const schema = createSignUpSchema(() => password);

    it('passes valid sign-up', () => {
      const errors = validate(schema, {
        fullName: 'Ali Khan',
        email: 'ali@khan.com',
        password,
        confirmPassword: password,
      });
      expect(hasErrors(errors)).toBe(false);
    });

    it('fails when passwords do not match', () => {
      const errors = validate(schema, {
        fullName: 'Ali Khan',
        email: 'ali@khan.com',
        password,
        confirmPassword: 'DifferentPassword1!',
      });
      expect(errors.confirmPassword).toBe('Passwords do not match');
    });

    it('requires uppercase in password', () => {
      const errors = validate(schema, {
        fullName: 'Ali Khan',
        email: 'ali@khan.com',
        password: 'myp@ss1!',
        confirmPassword: 'myp@ss1!',
      });
      expect(errors.password).toBeTruthy();
    });
  });

  describe('contactSchema', () => {
    it('passes valid contact form', () => {
      const errors = validate(contactSchema, {
        name: 'Ali',
        email: 'ali@test.com',
        phone: '+971501234567',
        message: 'Hello, I am interested in your properties!',
      });
      expect(hasErrors(errors)).toBe(false);
    });

    it('allows empty phone (optional)', () => {
      const errors = validate(contactSchema, {
        name: 'Ali',
        email: 'ali@test.com',
        phone: '',
        message: 'This is a valid message.',
      });
      expect(errors.phone).toBeUndefined();
    });

    it('requires message with min length', () => {
      const errors = validate(contactSchema, {
        name: 'Ali',
        email: 'ali@test.com',
        message: 'Hi',
      });
      expect(errors.message).toBeTruthy();
    });
  });

  describe('propertyInquirySchema', () => {
    it('passes valid inquiry', () => {
      const errors = validate(propertyInquirySchema, {
        name: 'Sara',
        email: 'sara@mail.com',
        phone: '+971509876543',
        message: 'I want to schedule a viewing',
      });
      expect(hasErrors(errors)).toBe(false);
    });

    it('requires name, email, and phone', () => {
      const errors = validate(propertyInquirySchema, {
        name: '',
        email: '',
        phone: '',
        message: '',
      });
      expect(errors.name).toBeTruthy();
      expect(errors.email).toBeTruthy();
      expect(errors.phone).toBeTruthy();
    });
  });
});
