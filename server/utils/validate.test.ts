/**
 * Validation Utility — Tests
 * Comprehensive tests for validate(), all rules, and validateIdParam.
 */

import { describe, it, expect } from 'vitest';
import { vi } from 'vitest';

// Mock logger (used by errorHandler which is imported by validate)
vi.mock('../utils/logger.js', () => ({
  createLogger: () => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
}));

import { validate, rules, validateIdParam } from './validate';
import { AppError } from '../middleware/errorHandler';

// ─── validate() Core Function ───────────────────────────────────────────
describe('validate()', () => {
  it('passes when all rules are satisfied', () => {
    expect(() =>
      validate(
        { name: 'John', email: 'john@test.com' },
        {
          name: rules.requiredString('Name'),
          email: rules.optionalEmail('Email'),
        }
      )
    ).not.toThrow();
  });

  it('throws AppError 422 when validation fails', () => {
    expect(() =>
      validate(
        { name: '' },
        { name: rules.requiredString('Name') }
      )
    ).toThrowError(AppError);

    try {
      validate({ name: '' }, { name: rules.requiredString('Name') });
    } catch (e) {
      expect((e as AppError).statusCode).toBe(422);
      expect((e as AppError).message).toContain('Validation failed');
    }
  });

  it('collects all field errors (one per field)', () => {
    try {
      validate(
        { name: '', amount: -5 },
        {
          name: rules.requiredString('Name'),
          amount: rules.positiveNumber('Amount'),
        }
      );
    } catch (e) {
      const msg = (e as AppError).message;
      expect(msg).toContain('Name is required');
      expect(msg).toContain('Amount must be a positive number');
    }
  });

  it('supports array of rules per field', () => {
    expect(() =>
      validate(
        { name: 'A'.repeat(300) },
        {
          name: [
            rules.requiredString('Name'),
            rules.requiredStringWithMax('Name', 255),
          ],
        }
      )
    ).toThrow(/Name must be 255 characters or less/);
  });

  it('stops at first error per field when using array rules', () => {
    try {
      validate(
        { name: '' },
        {
          name: [
            rules.requiredString('Name'),
            rules.requiredStringWithMax('Name', 10),
          ],
        }
      );
    } catch (e) {
      // Should report "required" but not the max-length error
      const msg = (e as AppError).message;
      expect(msg).toContain('Name is required');
      expect(msg).not.toContain('characters or less');
    }
  });
});

// ─── rules.requiredString ───────────────────────────────────────────────
describe('rules.requiredString', () => {
  const rule = rules.requiredString('Label');

  it('passes for non-empty string', () => {
    expect(rule('hello', 'field')).toBeNull();
  });

  it('fails for empty string', () => {
    expect(rule('', 'field')).toEqual({ field: 'field', message: 'Label is required' });
  });

  it('fails for whitespace-only string', () => {
    expect(rule('   ', 'field')).toEqual({ field: 'field', message: 'Label is required' });
  });

  it('fails for undefined', () => {
    expect(rule(undefined, 'field')).toEqual({ field: 'field', message: 'Label is required' });
  });

  it('fails for null', () => {
    expect(rule(null, 'field')).toEqual({ field: 'field', message: 'Label is required' });
  });

  it('fails for number', () => {
    expect(rule(123, 'field')).toEqual({ field: 'field', message: 'Label is required' });
  });
});

// ─── rules.optionalString ──────────────────────────────────────────────
describe('rules.optionalString', () => {
  const rule = rules.optionalString('Label');

  it('passes for undefined', () => {
    expect(rule(undefined, 'field')).toBeNull();
  });

  it('passes for null', () => {
    expect(rule(null, 'field')).toBeNull();
  });

  it('passes for non-empty string', () => {
    expect(rule('hello', 'field')).toBeNull();
  });

  it('fails for empty string', () => {
    expect(rule('', 'field')).toEqual({ field: 'field', message: 'Label must be a non-empty string' });
  });

  it('fails for number', () => {
    expect(rule(42, 'field')).toEqual({ field: 'field', message: 'Label must be a non-empty string' });
  });
});

// ─── rules.positiveNumber ──────────────────────────────────────────────
describe('rules.positiveNumber', () => {
  const rule = rules.positiveNumber('Amount');

  it('passes for positive number', () => {
    expect(rule(100, 'field')).toBeNull();
  });

  it('passes for positive string number', () => {
    expect(rule('42.5', 'field')).toBeNull();
  });

  it('fails for zero', () => {
    expect(rule(0, 'field')).toEqual({ field: 'field', message: 'Amount must be a positive number' });
  });

  it('fails for negative number', () => {
    expect(rule(-5, 'field')).toEqual({ field: 'field', message: 'Amount must be a positive number' });
  });

  it('fails for NaN', () => {
    expect(rule(NaN, 'field')).toEqual({ field: 'field', message: 'Amount must be a positive number' });
  });

  it('fails for Infinity', () => {
    expect(rule(Infinity, 'field')).toEqual({ field: 'field', message: 'Amount must be a positive number' });
  });

  it('fails for non-numeric string', () => {
    expect(rule('abc', 'field')).toEqual({ field: 'field', message: 'Amount must be a positive number' });
  });

  it('fails for undefined', () => {
    expect(rule(undefined, 'field')).toEqual({ field: 'field', message: 'Amount must be a positive number' });
  });
});

// ─── rules.optionalPositiveNumber ──────────────────────────────────────
describe('rules.optionalPositiveNumber', () => {
  const rule = rules.optionalPositiveNumber('Price');

  it('passes for undefined', () => {
    expect(rule(undefined, 'field')).toBeNull();
  });

  it('passes for null', () => {
    expect(rule(null, 'field')).toBeNull();
  });

  it('passes for zero', () => {
    expect(rule(0, 'field')).toBeNull();
  });

  it('passes for positive number', () => {
    expect(rule(99.99, 'field')).toBeNull();
  });

  it('fails for negative number', () => {
    expect(rule(-1, 'field')).toEqual({ field: 'field', message: 'Price must be a non-negative number' });
  });

  it('fails for NaN', () => {
    expect(rule(NaN, 'field')).toEqual({ field: 'field', message: 'Price must be a non-negative number' });
  });

  it('fails for Infinity', () => {
    expect(rule(Infinity, 'field')).toEqual({ field: 'field', message: 'Price must be a non-negative number' });
  });
});

// ─── rules.optionalEmail ───────────────────────────────────────────────
describe('rules.optionalEmail', () => {
  const rule = rules.optionalEmail('Email');

  it('passes for undefined', () => {
    expect(rule(undefined, 'field')).toBeNull();
  });

  it('passes for null', () => {
    expect(rule(null, 'field')).toBeNull();
  });

  it('passes for valid email', () => {
    expect(rule('user@example.com', 'field')).toBeNull();
  });

  it('passes for email with subdomain', () => {
    expect(rule('admin@mail.whitecaves.ae', 'field')).toBeNull();
  });

  it('fails for invalid email (no @)', () => {
    expect(rule('not-an-email', 'field')).toEqual({ field: 'field', message: 'Email must be a valid email address' });
  });

  it('fails for invalid email (no domain)', () => {
    expect(rule('user@', 'field')).toEqual({ field: 'field', message: 'Email must be a valid email address' });
  });

  it('fails for number', () => {
    expect(rule(123, 'field')).toEqual({ field: 'field', message: 'Email must be a valid email address' });
  });
});

// ─── rules.oneOf ────────────────────────────────────────────────────────
describe('rules.oneOf', () => {
  const rule = rules.oneOf('Status', ['active', 'inactive', 'pending']);

  it('passes for allowed value', () => {
    expect(rule('active', 'field')).toBeNull();
  });

  it('passes for undefined (optional)', () => {
    expect(rule(undefined, 'field')).toBeNull();
  });

  it('passes for null (optional)', () => {
    expect(rule(null, 'field')).toBeNull();
  });

  it('fails for disallowed value', () => {
    const result = rule('deleted', 'field');
    expect(result).toEqual({
      field: 'field',
      message: 'Status must be one of: active, inactive, pending',
    });
  });
});

// ─── rules.optionalMongoId ─────────────────────────────────────────────
describe('rules.optionalMongoId', () => {
  const rule = rules.optionalMongoId('Property ID');

  it('passes for undefined', () => {
    expect(rule(undefined, 'field')).toBeNull();
  });

  it('passes for null', () => {
    expect(rule(null, 'field')).toBeNull();
  });

  it('passes for valid 24-char hex string', () => {
    expect(rule('507f1f77bcf86cd799439011', 'field')).toBeNull();
  });

  it('passes for uppercase hex', () => {
    expect(rule('507F1F77BCF86CD799439011', 'field')).toBeNull();
  });

  it('fails for short string', () => {
    expect(rule('abc123', 'field')).toEqual({ field: 'field', message: 'Property ID must be a valid ID' });
  });

  it('fails for non-hex characters', () => {
    expect(rule('507f1f77bcf86cd79943901z', 'field')).toEqual({ field: 'field', message: 'Property ID must be a valid ID' });
  });

  it('fails for number', () => {
    expect(rule(12345, 'field')).toEqual({ field: 'field', message: 'Property ID must be a valid ID' });
  });
});

// ─── rules.optionalArray ───────────────────────────────────────────────
describe('rules.optionalArray', () => {
  const rule = rules.optionalArray('Tags');

  it('passes for undefined', () => {
    expect(rule(undefined, 'field')).toBeNull();
  });

  it('passes for null', () => {
    expect(rule(null, 'field')).toBeNull();
  });

  it('passes for empty array', () => {
    expect(rule([], 'field')).toBeNull();
  });

  it('passes for array with items', () => {
    expect(rule(['tag1', 'tag2'], 'field')).toBeNull();
  });

  it('fails for string', () => {
    expect(rule('not-an-array', 'field')).toEqual({ field: 'field', message: 'Tags must be an array' });
  });

  it('fails for number', () => {
    expect(rule(42, 'field')).toEqual({ field: 'field', message: 'Tags must be an array' });
  });

  it('fails for object', () => {
    expect(rule({}, 'field')).toEqual({ field: 'field', message: 'Tags must be an array' });
  });
});

// ─── rules.requiredStringWithMax ────────────────────────────────────────
describe('rules.requiredStringWithMax', () => {
  const rule = rules.requiredStringWithMax('Title', 50);

  it('passes for short non-empty string', () => {
    expect(rule('Hello World', 'field')).toBeNull();
  });

  it('passes for string at max length', () => {
    expect(rule('A'.repeat(50), 'field')).toBeNull();
  });

  it('fails for empty string', () => {
    expect(rule('', 'field')).toEqual({ field: 'field', message: 'Title is required' });
  });

  it('fails for string exceeding max length', () => {
    expect(rule('A'.repeat(51), 'field')).toEqual({ field: 'field', message: 'Title must be 50 characters or less' });
  });

  it('fails for undefined', () => {
    expect(rule(undefined, 'field')).toEqual({ field: 'field', message: 'Title is required' });
  });

  it('uses default max of 255 when not specified', () => {
    const defaultRule = rules.requiredStringWithMax('Name');
    expect(defaultRule('A'.repeat(255), 'field')).toBeNull();
    expect(defaultRule('A'.repeat(256), 'field')).toEqual({
      field: 'field',
      message: 'Name must be 255 characters or less',
    });
  });
});

// ─── rules.optionalStringWithMax ────────────────────────────────────────
describe('rules.optionalStringWithMax', () => {
  const rule = rules.optionalStringWithMax('Description', 100);

  it('passes for undefined', () => {
    expect(rule(undefined, 'field')).toBeNull();
  });

  it('passes for null', () => {
    expect(rule(null, 'field')).toBeNull();
  });

  it('passes for short string', () => {
    expect(rule('Short description', 'field')).toBeNull();
  });

  it('passes for string at max length', () => {
    expect(rule('A'.repeat(100), 'field')).toBeNull();
  });

  it('fails for string exceeding max length', () => {
    expect(rule('A'.repeat(101), 'field')).toEqual({
      field: 'field',
      message: 'Description must be 100 characters or less',
    });
  });

  it('fails for non-string type', () => {
    expect(rule(42, 'field')).toEqual({ field: 'field', message: 'Description must be a string' });
  });

  it('uses default max of 2000 when not specified', () => {
    const defaultRule = rules.optionalStringWithMax('Notes');
    expect(defaultRule('A'.repeat(2000), 'field')).toBeNull();
    expect(defaultRule('A'.repeat(2001), 'field')).toEqual({
      field: 'field',
      message: 'Notes must be 2000 characters or less',
    });
  });
});

// ─── rules.requiredMongoId ──────────────────────────────────────────────
describe('rules.requiredMongoId', () => {
  const rule = rules.requiredMongoId('Lead ID');

  it('passes for valid 24-char hex string', () => {
    expect(rule('507f1f77bcf86cd799439011', 'field')).toBeNull();
  });

  it('fails for undefined', () => {
    expect(rule(undefined, 'field')).toEqual({
      field: 'field',
      message: 'Lead ID must be a valid 24-character ID',
    });
  });

  it('fails for short string', () => {
    expect(rule('abc', 'field')).toEqual({
      field: 'field',
      message: 'Lead ID must be a valid 24-character ID',
    });
  });

  it('fails for non-hex characters', () => {
    expect(rule('507f1f77bcf86cd79943901z', 'field')).toEqual({
      field: 'field',
      message: 'Lead ID must be a valid 24-character ID',
    });
  });
});

// ─── validateIdParam ────────────────────────────────────────────────────
describe('validateIdParam()', () => {
  it('passes for valid MongoDB ObjectId', () => {
    expect(() => validateIdParam('507f1f77bcf86cd799439011')).not.toThrow();
  });

  it('throws AppError 400 for empty string', () => {
    expect(() => validateIdParam('')).toThrow(AppError);
    try {
      validateIdParam('');
    } catch (e) {
      expect((e as AppError).statusCode).toBe(400);
      expect((e as AppError).message).toContain('Invalid ID format');
    }
  });

  it('throws for invalid format', () => {
    expect(() => validateIdParam('not-a-valid-id')).toThrow(AppError);
  });

  it('throws for too-short hex string', () => {
    expect(() => validateIdParam('507f1f77bcf86cd7')).toThrow(/Invalid/);
  });

  it('uses custom label in error message', () => {
    try {
      validateIdParam('bad', 'Property ID');
    } catch (e) {
      expect((e as AppError).message).toContain('Property ID');
    }
  });

  it('uses default "ID" label', () => {
    try {
      validateIdParam('bad');
    } catch (e) {
      expect((e as AppError).message).toContain('Invalid ID format');
    }
  });
});
