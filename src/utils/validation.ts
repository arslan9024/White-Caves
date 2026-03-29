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
