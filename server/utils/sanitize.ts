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
  return input.replace(HTML_ENTITY_REGEX, (char) => HTML_ENTITIES[char] || char);
}

/**
 * Sanitize all string fields in an object (shallow, one level deep).
 * Non-string values are passed through unchanged.
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj };
  for (const key of Object.keys(result)) {
    const value = result[key];
    if (typeof value === 'string') {
      (result as Record<string, unknown>)[key] = sanitizeString(value);
    }
  }
  return result;
}

/**
 * Truncate a string to a maximum length, appending an ellipsis if truncated.
 */
export function truncateString(input: string, maxLength: number): string {
  if (!input || typeof input !== 'string') return input;
  if (input.length <= maxLength) return input;
  return input.slice(0, Math.max(0, maxLength - 1)) + '\u2026';
}
