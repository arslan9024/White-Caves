/**
 * Input Sanitization — Tests
 * Tests sanitizeString, sanitizeObject, and truncateString for XSS prevention.
 */

import { describe, it, expect } from 'vitest';
import { sanitizeString, sanitizeObject, truncateString } from './sanitize';

// ─── sanitizeString ─────────────────────────────────────────────────────
describe('sanitizeString', () => {
  it('escapes & to &amp;', () => {
    expect(sanitizeString('Tom & Jerry')).toBe('Tom &amp; Jerry');
  });

  it('escapes < to &lt;', () => {
    expect(sanitizeString('a < b')).toBe('a &lt; b');
  });

  it('escapes > to &gt;', () => {
    expect(sanitizeString('a > b')).toBe('a &gt; b');
  });

  it('escapes " to &quot;', () => {
    expect(sanitizeString('say "hello"')).toBe('say &quot;hello&quot;');
  });

  it("escapes ' to &#x27;", () => {
    expect(sanitizeString("it's")).toBe('it&#x27;s');
  });

  it('escapes / to &#x2F;', () => {
    expect(sanitizeString('a/b')).toBe('a&#x2F;b');
  });

  it('escapes a full XSS payload', () => {
    const input = '<script>alert("xss")</script>';
    const sanitized = sanitizeString(input);
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('</script>');
    expect(sanitized).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
  });

  it('escapes event handler injection', () => {
    const input = '<img onerror="alert(1)" src="x">';
    const sanitized = sanitizeString(input);
    expect(sanitized).not.toContain('<img');
    expect(sanitized).toContain('&lt;img');
  });

  it('returns empty string as-is', () => {
    expect(sanitizeString('')).toBe('');
  });

  it('returns string without special chars unchanged', () => {
    expect(sanitizeString('Hello World 123')).toBe('Hello World 123');
  });

  it('handles multiple special chars in sequence', () => {
    expect(sanitizeString('<>&"')).toBe('&lt;&gt;&amp;&quot;');
  });

  it('handles non-string input gracefully', () => {
    // The function checks typeof, so passing null/undefined returns the value
    expect(sanitizeString(null as unknown as string)).toBeNull();
    expect(sanitizeString(undefined as unknown as string)).toBeUndefined();
  });
});

// ─── sanitizeObject ─────────────────────────────────────────────────────
describe('sanitizeObject', () => {
  it('sanitizes all string fields', () => {
    const input = {
      name: '<b>Bold</b>',
      email: 'user@test.com',
      note: 'Tom & Jerry',
    };
    const result = sanitizeObject(input);
    expect(result.name).toBe('&lt;b&gt;Bold&lt;&#x2F;b&gt;');
    expect(result.email).toBe('user@test.com');
    expect(result.note).toBe('Tom &amp; Jerry');
  });

  it('leaves non-string values untouched', () => {
    const input = {
      name: 'Test',
      count: 42,
      active: true,
      tags: ['a', 'b'],
      nested: { key: '<val>' },
    };
    const result = sanitizeObject(input);
    expect(result.count).toBe(42);
    expect(result.active).toBe(true);
    expect(result.tags).toEqual(['a', 'b']);
    // Shallow only — nested objects are NOT sanitized
    expect((result.nested as Record<string, string>).key).toBe('<val>');
  });

  it('returns a new object (does not mutate original)', () => {
    const input = { name: '<script>bad</script>' };
    const result = sanitizeObject(input);
    expect(result).not.toBe(input);
    expect(input.name).toBe('<script>bad</script>'); // original unchanged
    expect(result.name).toContain('&lt;script&gt;');
  });

  it('handles empty object', () => {
    const result = sanitizeObject({});
    expect(result).toEqual({});
  });

  it('handles object with only non-string values', () => {
    const input = { count: 5, flag: false, items: [] };
    const result = sanitizeObject(input);
    expect(result).toEqual({ count: 5, flag: false, items: [] });
  });
});

// ─── truncateString ─────────────────────────────────────────────────────
describe('truncateString', () => {
  it('returns string unchanged if shorter than maxLength', () => {
    expect(truncateString('Hello', 10)).toBe('Hello');
  });

  it('returns string unchanged if exactly maxLength', () => {
    expect(truncateString('12345', 5)).toBe('12345');
  });

  it('truncates and adds ellipsis when exceeding maxLength', () => {
    const result = truncateString('Hello World!', 5);
    expect(result.length).toBeLessThanOrEqual(5);
    expect(result).toContain('…'); // Unicode ellipsis
  });

  it('produces correct truncation at boundary', () => {
    // maxLength=6: takes first 5 chars + ellipsis
    const result = truncateString('abcdefgh', 6);
    expect(result).toBe('abcde…');
  });

  it('handles empty string', () => {
    expect(truncateString('', 10)).toBe('');
  });

  it('handles maxLength of 1', () => {
    const result = truncateString('abc', 1);
    // Math.max(0, 1-1) = 0 chars + ellipsis
    expect(result).toBe('…');
  });

  it('handles non-string input gracefully', () => {
    expect(truncateString(null as unknown as string, 10)).toBeNull();
    expect(truncateString(undefined as unknown as string, 10)).toBeUndefined();
  });

  it('handles very long strings', () => {
    const longStr = 'A'.repeat(10000);
    const result = truncateString(longStr, 100);
    expect(result.length).toBe(100);
    expect(result.endsWith('…')).toBe(true);
  });
});
