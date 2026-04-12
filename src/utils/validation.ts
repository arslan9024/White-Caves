/**
 * Centralized validation utilities for White Caves forms.
 * All form validation should use these helpers for consistency.
 */

// ─── Regex Patterns ─────────────────────────────────────────────

/** RFC-compliant email pattern requiring 2+ char TLD */
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/** Phone: optional +, 7-20 chars of digits/spaces/parens/dashes, must have 4+ actual digits */
export const PHONE_REGEX = /^\+?[\d\s()-]{7,20}$/;

/** Minimum digits required in a phone number */
const MIN_PHONE_DIGITS = 4;

// ─── Validation Functions ───────────────────────────────────────

export const isValidEmail = (email: string | null | undefined): boolean => {
  if (!email || typeof email !== 'string') return false;
  return EMAIL_REGEX.test(email.trim());
};

export const isValidPhone = (phone: string | null | undefined): boolean => {
  if (!phone || typeof phone !== 'string') return false;
  if (!PHONE_REGEX.test(phone)) return false;
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length >= MIN_PHONE_DIGITS;
};

export const isRequired = (value: string | null | undefined): boolean => {
  if (!value || typeof value !== 'string') return false;
  return value.trim().length > 0;
};

export const isWithinLength = (value: string | null | undefined, max: number, min = 0): boolean => {
  if (value == null || typeof value !== 'string') return false;
  return value.length >= min && value.length <= max;
};

// ─── Form Constants ─────────────────────────────────────────────

export const MAX_MESSAGE_LENGTH = 2000;
export const MAX_PRICE = 999_999_999;
export const MAX_BEDROOMS = 50;
export const MAX_BATHROOMS = 50;
export const MAX_SQFT = 999_999;

/* ═══════════════════════════════════════════════════════════════════
   COMPOSABLE VALIDATION ENGINE
   Schema-based validation with real-time field-level errors.
   ═══════════════════════════════════════════════════════════════ */

/* ──────────────────────────── Types ───────────────────────────── */

/** Single field validator — returns error string or null if valid */
export type Validator = (value: unknown) => string | null;

/** Schema: field name → array of validators (run in order, first error wins) */
type ValidationSchema = Record<string, Validator[]>;

/** Validation result: field name → error message (only failed fields) */
type ValidationErrors = Record<string, string>;

/* ──────────────────────────── Core Engine ─────────────────────── */

/**
 * Create a validation schema from field → validator[] mappings.
 */
export function createSchema(fields: ValidationSchema): ValidationSchema {
  return fields;
}

/**
 * Validate all fields against a schema. Returns only failed fields.
 * Empty object = all valid.
 */
export function validate(
  schema: ValidationSchema,
  values: Record<string, unknown>,
): ValidationErrors {
  const errors: ValidationErrors = {};
  for (const [field, validators] of Object.entries(schema)) {
    const value = values[field];
    for (const validator of validators) {
      const error = validator(value);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  }
  return errors;
}

/**
 * Validate a single field against its validators.
 * Returns error string or null if valid.
 */
export function validateField(
  validators: Validator[],
  value: unknown,
): string | null {
  for (const validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  return null;
}

/**
 * Check if validation result has any errors.
 */
export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

/* ──────────────────────────── Composable Validators ──────────── */

/** Field must not be empty, null, or undefined */
export function required(message = 'This field is required'): Validator {
  return (value: unknown) => {
    if (value === null || value === undefined || value === '') return message;
    if (typeof value === 'string' && value.trim() === '') return message;
    return null;
  };
}

/** Minimum string length */
export function minLength(min: number, message?: string): Validator {
  return (value: unknown) => {
    if (typeof value !== 'string') return null;
    return value.length < min
      ? message || `Must be at least ${min} characters`
      : null;
  };
}

/** Maximum string length */
export function maxLength(max: number, message?: string): Validator {
  return (value: unknown) => {
    if (typeof value !== 'string') return null;
    return value.length > max
      ? message || `Must be no more than ${max} characters`
      : null;
  };
}

/** Valid email format */
export function emailValidator(message = 'Please enter a valid email address'): Validator {
  return (value: unknown) => {
    if (typeof value !== 'string' || value === '') return null;
    return EMAIL_REGEX.test(value) ? null : message;
  };
}

/** Valid phone number (international format, 7-15 digits) */
export function phoneValidator(message = 'Please enter a valid phone number'): Validator {
  return (value: unknown) => {
    if (typeof value !== 'string' || value === '') return null;
    const digits = value.replace(/[\s\-().+]/g, '');
    return /^\d{7,15}$/.test(digits) ? null : message;
  };
}

/** Must contain at least one uppercase letter */
export function hasUppercase(message = 'Must contain at least one uppercase letter'): Validator {
  return (value: unknown) => {
    if (typeof value !== 'string') return null;
    return /[A-Z]/.test(value) ? null : message;
  };
}

/** Must contain at least one lowercase letter */
export function hasLowercase(message = 'Must contain at least one lowercase letter'): Validator {
  return (value: unknown) => {
    if (typeof value !== 'string') return null;
    return /[a-z]/.test(value) ? null : message;
  };
}

/** Must contain at least one digit */
export function hasNumber(message = 'Must contain at least one number'): Validator {
  return (value: unknown) => {
    if (typeof value !== 'string') return null;
    return /\d/.test(value) ? null : message;
  };
}

/** Must contain at least one special character */
export function hasSpecialChar(message = 'Must contain at least one special character'): Validator {
  return (value: unknown) => {
    if (typeof value !== 'string') return null;
    return /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value) ? null : message;
  };
}

/** Must match another field's value (e.g., confirm password) */
export function matchesField(
  getValue: () => unknown,
  message = 'Fields do not match',
): Validator {
  return (value: unknown) => {
    return value === getValue() ? null : message;
  };
}

/** Custom regex pattern */
export function matchesPattern(regex: RegExp, message = 'Invalid format'): Validator {
  return (value: unknown) => {
    if (typeof value !== 'string' || value === '') return null;
    return regex.test(value) ? null : message;
  };
}

/** Numeric value within range */
export function numberRange(min: number, max: number, message?: string): Validator {
  return (value: unknown) => {
    const num = typeof value === 'string' ? parseFloat(value) : Number(value);
    if (isNaN(num)) return message || `Must be a number between ${min} and ${max}`;
    return num >= min && num <= max
      ? null
      : message || `Must be between ${min} and ${max}`;
  };
}

/** Dubai UAE phone format (+971...) */
export function dubaiPhone(message = 'Please enter a valid UAE phone number (+971...)'): Validator {
  return (value: unknown) => {
    if (typeof value !== 'string' || value === '') return null;
    const cleaned = value.replace(/[\s\-()]/g, '');
    return /^\+971[2-9]\d{7,8}$/.test(cleaned) ? null : message;
  };
}

/* ──────────────────────────── Password Strength ──────────────── */

export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

export interface PasswordAnalysis {
  strength: PasswordStrength;
  score: number; // 0-4
  feedback: string[];
}

/**
 * Analyze password strength with detailed feedback.
 */
export function analyzePassword(password: string): PasswordAnalysis {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score++;
  else feedback.push('Use at least 8 characters');

  if (password.length >= 12) score++;

  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  else feedback.push('Mix uppercase and lowercase letters');

  if (/\d/.test(password)) score++;
  else feedback.push('Add at least one number');

  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score++;
  else feedback.push('Add a special character (!@#$...)');

  score = Math.min(score, 4);

  const strengthMap: Record<number, PasswordStrength> = {
    0: 'weak', 1: 'weak', 2: 'fair', 3: 'good', 4: 'strong',
  };

  return { strength: strengthMap[score], score, feedback };
}

/* ──────────────────────────── Pre-built Schemas ──────────────── */

/** Sign-in form schema */
export const signInSchema = createSchema({
  email: [required('Email is required'), emailValidator()],
  password: [required('Password is required')],
});

/** Sign-up form schema */
export function createSignUpSchema(getPassword: () => string) {
  return createSchema({
    fullName: [required('Full name is required'), minLength(2, 'Name must be at least 2 characters')],
    email: [required('Email is required'), emailValidator()],
    password: [
      required('Password is required'),
      minLength(8, 'Password must be at least 8 characters'),
      hasUppercase('Password must contain an uppercase letter'),
      hasNumber('Password must contain a number'),
    ],
    confirmPassword: [
      required('Please confirm your password'),
      matchesField(getPassword, 'Passwords do not match'),
    ],
  });
}

/** Contact form schema */
export const contactSchema = createSchema({
  name: [required('Name is required'), minLength(2)],
  email: [required('Email is required'), emailValidator()],
  phone: [phoneValidator()],
  message: [required('Message is required'), minLength(10, 'Message must be at least 10 characters')],
});

/** Property inquiry schema */
export const propertyInquirySchema = createSchema({
  name: [required('Name is required')],
  email: [required('Email is required'), emailValidator()],
  phone: [required('Phone is required'), phoneValidator()],
  message: [minLength(5, 'Please provide more details')],
});
