/**
 * Input Sanitization Utilities
 * Prevents XSS via stored user input by escaping HTML entities.
 */

const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};

const HTML_ENTITY_REGEX = /[&<>"'/]/g;

/**
 * Escape HTML special characters to prevent XSS when rendering user input.
 * Does NOT modify URLs, emails, or non-string values.
 */
export function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') return input;
  // eslint-disable-next-line security/detect-object-injection
  return input.replace(HTML_ENTITY_REGEX, char => HTML_ENTITIES[char] || char);
}

/**
 * Sanitize all string fields in an object (shallow, one level deep).
 * Non-string values are passed through unchanged.
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj };
  for (const key of Object.keys(result)) {
    // eslint-disable-next-line security/detect-object-injection
    const value = result[key];
    if (typeof value === 'string') {
      // eslint-disable-next-line security/detect-object-injection
      (result as Record<string, unknown>)[key] = sanitizeString(value);
    }
  }
  return result;
}

/**
 * Recursively sanitize all string values within a nested object or array.
 * Unlike `sanitizeObject` (which is one level deep), this function descends
 * into nested objects and arrays so deeply-nested XSS payloads are also escaped.
 *
 * Non-string primitives (numbers, booleans, null, undefined) pass through unchanged.
 * Returns a deep copy — the original value is never mutated.
 *
 * @example
 *   sanitizeDeep({ user: { bio: '<script>alert(1)</script>', age: 30 } })
 *   // → { user: { bio: '&lt;script&gt;...&lt;&#x2F;script&gt;', age: 30 } }
 */
export function sanitizeDeep<T>(value: T): T {
  if (typeof value === 'string') {
    return sanitizeString(value) as unknown as T;
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeDeep) as unknown as T;
  }
  if (value !== null && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>)) {
      // eslint-disable-next-line security/detect-object-injection
      result[key] = sanitizeDeep((value as Record<string, unknown>)[key]);
    }
    return result as T;
  }
  return value;
}

/**
 * Truncate a string to a maximum length, appending an ellipsis if truncated.
 */
export function truncateString(input: string, maxLength: number): string {
  if (!input || typeof input !== 'string') return input;
  if (input.length <= maxLength) return input;
  return input.slice(0, Math.max(0, maxLength - 1)) + '\u2026';
}
