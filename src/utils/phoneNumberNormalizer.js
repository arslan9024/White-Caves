/**
 * Phone Number Normalizer Utility
 * Handles standardization of phone numbers across different formats
 * Normalizes to international format: +971XXXXXXXXX
 */

/**
 * Phone number validation and normalization patterns
 */
const PHONE_PATTERNS = {
  // Matches: +971501234567 (international with +)
  INTERNATIONAL_PLUS: /^\+971(\d{9})$/,
  
  // Matches: 00971501234567 (international with 00)
  INTERNATIONAL_DOUBLE_ZERO: /^00971(\d{9})$/,
  
  // Matches: 0501234567 (local UAE format)
  LOCAL: /^0([5,4,2,3,6,7,9]\d{7})$/,
  
  // Generic international format
  GENERIC_INTERNATIONAL: /^\+[1-9]\d{1,14}$/
};

/**
 * Normalize a phone number to international format (+971XXXXXXXXX)
 * @param {string} phone - Phone number in any supported format
 * @returns {string|null} - Normalized phone number or null if invalid
 * 
 * @example
 * normalizePhoneNumber('+971501234567') // Returns '+971501234567'
 * normalizePhoneNumber('00971501234567') // Returns '+971501234567'
 * normalizePhoneNumber('0501234567') // Returns '+971501234567'
 */
export function normalizePhoneNumber(phone) {
  if (!phone || typeof phone !== 'string') {
    return null;
  }

  // Remove all whitespace and dashes
  const cleaned = phone.trim().replace(/[\s\-()]/g, '');

  // Try international format with +
  const intlPlusMatch = cleaned.match(PHONE_PATTERNS.INTERNATIONAL_PLUS);
  if (intlPlusMatch) {
    return `+971${intlPlusMatch[1]}`;
  }

  // Try international format with 00
  const intlDoubleZeroMatch = cleaned.match(PHONE_PATTERNS.INTERNATIONAL_DOUBLE_ZERO);
  if (intlDoubleZeroMatch) {
    return `+971${intlDoubleZeroMatch[1]}`;
  }

  // Try local format
  const localMatch = cleaned.match(PHONE_PATTERNS.LOCAL);
  if (localMatch) {
    return `+971${localMatch[1]}`;
  }

  // If it looks like a valid international number (but not UAE), return as-is with +
  if (cleaned.length > 10 && /^\d+$/.test(cleaned)) {
    if (cleaned.match(PHONE_PATTERNS.GENERIC_INTERNATIONAL)) {
      return cleaned;
    }
    // If it starts with digits and is long, assume it needs a +
    if (!cleaned.startsWith('+')) {
      return `+${cleaned}`;
    }
    return cleaned;
  }

  // Invalid phone number
  return null;
}

/**
 * Validate a phone number (accepts various formats)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function validatePhoneNumber(phone) {
  if (!phone || typeof phone !== 'string') {
    return false;
  }

  const normalized = normalizePhoneNumber(phone);
  return normalized !== null;
}

/**
 * Check if two phone numbers represent the same contact
 * Normalizes both and compares
 * @param {string} phone1 - First phone number
 * @param {string} phone2 - Second phone number
 * @returns {boolean} - True if they represent the same phone number
 */
export function phoneNumbersMatch(phone1, phone2) {
  const normalized1 = normalizePhoneNumber(phone1);
  const normalized2 = normalizePhoneNumber(phone2);

  if (!normalized1 || !normalized2) {
    return false;
  }

  return normalized1 === normalized2;
}

/**
 * Extract phone numbers from text and normalize them
 * @param {string} text - Text containing phone numbers
 * @returns {string[]} - Array of normalized phone numbers (duplicates removed)
 */
export function extractAndNormalizePhones(text) {
  if (!text || typeof text !== 'string') {
    return [];
  }

  // Match various phone formats
  const patterns = [
    /\+971[0-9]{9}/g,           // +971 format
    /00971[0-9]{9}/g,           // 00971 format
    /0[5,4,2,3,6,7,9][0-9]{7}/g, // 0X format (UAE)
    /\+[1-9][0-9]{1,14}/g        // Generic international
  ];

  const phones = new Set();
  
  for (const pattern of patterns) {
    const matches = text.match(pattern);
    if (matches) {
      for (const phone of matches) {
        const normalized = normalizePhoneNumber(phone);
        if (normalized) {
          phones.add(normalized);
        }
      }
    }
  }

  return Array.from(phones);
}

/**
 * Format a phone number for display
 * @param {string} phone - Normalized phone number
 * @returns {string} - Formatted phone number for display
 * 
 * @example
 * formatPhoneForDisplay('+971501234567') // Returns '+971 50 123 4567'
 */
export function formatPhoneForDisplay(phone) {
  if (!phone) return '';

  const normalized = normalizePhoneNumber(phone);
  if (!normalized) return phone; // Return original if not valid

  // Format as: +971 50 123 4567
  const match = normalized.match(/^\+971(\d{2})(\d{3})(\d{4})$/);
  if (match) {
    return `+971 ${match[1]} ${match[2]} ${match[3]}`;
  }

  return normalized;
}

/**
 * Get the country code from a normalized phone number
 * @param {string} phone - Normalized phone number
 * @returns {string|null} - Country code or null
 */
export function getCountryCode(phone) {
  if (!phone || !phone.startsWith('+')) return null;

  const match = phone.match(/^\+(\d{1,3})/);
  return match ? match[1] : null;
}

/**
 * Convert to local format (for display in UAE context)
 * @param {string} phone - Phone number in any format
 * @returns {string|null} - Local format (05XXXXXXXX) or null if invalid
 */
export function toLocalFormat(phone) {
  const normalized = normalizePhoneNumber(phone);
  if (!normalized || !normalized.startsWith('+971')) {
    return null;
  }

  // Remove +971 and prepend 0
  return '0' + normalized.substring(4);
}

export default {
  normalizePhoneNumber,
  validatePhoneNumber,
  phoneNumbersMatch,
  extractAndNormalizePhones,
  formatPhoneForDisplay,
  getCountryCode,
  toLocalFormat
};
