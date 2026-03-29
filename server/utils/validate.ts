/**
 * Lightweight Request Validation Utility
 * =======================================
 * Zero-dependency validation helpers for Express route handlers.
 * Uses AppError for consistent 422 responses on invalid input.
 *
 * Usage:
 *   import { validate, rules } from '../utils/validate';
 *
 *   router.post('/', asyncHandler(async (req, res) => {
 *     validate(req.body, {
 *       name:   rules.requiredString('Lead name'),
 *       email:  rules.optionalEmail('Email'),
 *       amount: rules.positiveNumber('Amount'),
 *     });
 *     // ... safe to use req.body
 *   }));
 */

import { AppError } from '../middleware/errorHandler';

// ─── Validation Rule Type ────────────────────────────────────────────────
interface ValidationError {
  field: string;
  message: string;
}

type RuleFn = (value: unknown, field: string) => ValidationError | null;

// ─── Core validate() ────────────────────────────────────────────────────
/**
 * Validate an object against a map of rules.
 * Throws AppError (422) if any rule fails.
 */
export function validate(
  data: Record<string, unknown>,
  schema: Record<string, RuleFn | RuleFn[]>
): void {
  const errors: ValidationError[] = [];

  for (const [field, ruleDef] of Object.entries(schema)) {
    const value = data[field];
    const fns = Array.isArray(ruleDef) ? ruleDef : [ruleDef];

    for (const fn of fns) {
      const err = fn(value, field);
      if (err) {
        errors.push(err);
        break; // one error per field is enough
      }
    }
  }

  if (errors.length > 0) {
    throw new AppError(
      `Validation failed: ${errors.map(e => e.message).join('; ')}`,
      422
    );
  }
}

// ─── Built-in Rules ─────────────────────────────────────────────────────
const MONGO_ID_RE = /^[a-f\d]{24}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const rules = {
  /** Field must be a non-empty trimmed string */
  requiredString(label: string): RuleFn {
    return (v, f) =>
      typeof v !== 'string' || !v.trim()
        ? { field: f, message: `${label} is required` }
        : null;
  },

  /** If present, must be a non-empty string */
  optionalString(label: string): RuleFn {
    return (v, f) =>
      v !== undefined && v !== null && (typeof v !== 'string' || !v.trim())
        ? { field: f, message: `${label} must be a non-empty string` }
        : null;
  },

  /** Must be a number > 0 */
  positiveNumber(label: string): RuleFn {
    return (v, f) => {
      const n = typeof v === 'string' ? parseFloat(v) : v;
      return typeof n !== 'number' || isNaN(n) || !Number.isFinite(n) || n <= 0
        ? { field: f, message: `${label} must be a positive number` }
        : null;
    };
  },

  /** If present, must be a number ≥ 0 */
  optionalPositiveNumber(label: string): RuleFn {
    return (v, f) => {
      if (v === undefined || v === null) return null;
      const n = typeof v === 'string' ? parseFloat(v) : v;
      return typeof n !== 'number' || isNaN(n) || !Number.isFinite(n) || n < 0
        ? { field: f, message: `${label} must be a non-negative number` }
        : null;
    };
  },

  /** If present, must be a valid email */
  optionalEmail(label: string): RuleFn {
    return (v, f) =>
      v !== undefined && v !== null && (typeof v !== 'string' || !EMAIL_RE.test(v))
        ? { field: f, message: `${label} must be a valid email address` }
        : null;
  },

  /** Must match one of allowed values */
  oneOf(label: string, allowed: string[]): RuleFn {
    return (v, f) =>
      v !== undefined && v !== null && !allowed.includes(v as string)
        ? { field: f, message: `${label} must be one of: ${allowed.join(', ')}` }
        : null;
  },

  /** If present, must be a valid MongoDB ObjectId (24 hex chars) */
  optionalMongoId(label: string): RuleFn {
    return (v, f) =>
      v !== undefined && v !== null && (typeof v !== 'string' || !MONGO_ID_RE.test(v))
        ? { field: f, message: `${label} must be a valid ID` }
        : null;
  },

  /** If present, must be an array */
  optionalArray(label: string): RuleFn {
    return (v, f) =>
      v !== undefined && v !== null && !Array.isArray(v)
        ? { field: f, message: `${label} must be an array` }
        : null;
  },

  /** Required string with max length */
  requiredStringWithMax(label: string, maxLength = 255): RuleFn {
    return (v, f) => {
      if (typeof v !== 'string' || !v.trim()) {
        return { field: f, message: `${label} is required` };
      }
      if (v.length > maxLength) {
        return { field: f, message: `${label} must be ${maxLength} characters or less` };
      }
      return null;
    };
  },

  /** Optional string with max length */
  optionalStringWithMax(label: string, maxLength = 2000): RuleFn {
    return (v, f) => {
      if (v === undefined || v === null) return null;
      if (typeof v !== 'string') {
        return { field: f, message: `${label} must be a string` };
      }
      if (v.length > maxLength) {
        return { field: f, message: `${label} must be ${maxLength} characters or less` };
      }
      return null;
    };
  },

  /** Must be a valid MongoDB ObjectId (24 hex chars) — required */
  requiredMongoId(label: string): RuleFn {
    return (v, f) =>
      typeof v !== 'string' || !MONGO_ID_RE.test(v)
        ? { field: f, message: `${label} must be a valid 24-character ID` }
        : null;
  },
};

// ─── Standalone ID param validator ──────────────────────────────────────
/**
 * Validate a route :id parameter is a valid MongoDB ObjectId.
 * Throws AppError (400) immediately if invalid.
 * Usage:  validateIdParam(req.params.id);
 */
export function validateIdParam(id: string, label = 'ID'): void {
  if (!id || !MONGO_ID_RE.test(id)) {
    throw new AppError(`Invalid ${label} format — expected a 24-character hex string`, 400);
  }
}
