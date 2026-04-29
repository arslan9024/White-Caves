/**
 * Input Sanitization — Tests
 * Tests sanitizeString, sanitizeObject, and truncateString for XSS prevention.
 */

import { describe, it, expect } from 'vitest';
import { sanitizeString, sanitizeObject, sanitizeDeep, truncateString } from './sanitize';

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

  describe('maxLength parameter', () => {
    it('does not truncate when string is shorter than maxLength', () => {
      expect(sanitizeString('hello', 10)).toBe('hello');
    });

    it('does not truncate when string equals maxLength after sanitization', () => {
      // 'hello' is 5 chars — maxLength=5 means no truncation
      expect(sanitizeString('hello', 5)).toBe('hello');
    });

    it('truncates and appends ellipsis when sanitized string exceeds maxLength', () => {
      // 'hello world' is 11 chars — maxLength=8 → 7 chars + ellipsis
      const result = sanitizeString('hello world', 8);
      expect(result.length).toBe(8);
      expect(result).toBe('hello w\u2026');
    });

    it('applies maxLength after sanitization so HTML entities count as a single char', () => {
      // '<b>' sanitizes to '&lt;b&gt;' (9 chars) — maxLength=5 → 4 chars + ellipsis
      const result = sanitizeString('<b>hello</b>', 5);
      expect(result.length).toBe(5);
      expect(result.endsWith('\u2026')).toBe(true);
    });

    it('works correctly with maxLength=1 (returns just ellipsis)', () => {
      const result = sanitizeString('hello', 1);
      expect(result).toBe('\u2026');
    });

    it('works with no maxLength (existing behavior unchanged)', () => {
      expect(sanitizeString('<b>hello</b>')).toBe('&lt;b&gt;hello&lt;&#x2F;b&gt;');
    });

    it('enforces maxLength on contact-form name field (max=100)', () => {
      const longName = 'A'.repeat(200);
      const result = sanitizeString(longName, 100);
      expect(result.length).toBe(100);
      expect(result.endsWith('\u2026')).toBe(true);
    });

    it('enforces maxLength on contact-form phone field (max=30)', () => {
      const longPhone = '1'.repeat(50);
      const result = sanitizeString(longPhone, 30);
      expect(result.length).toBe(30);
    });

    it('enforces maxLength on contact-form message field (max=2000)', () => {
      const longMessage = 'x'.repeat(3000);
      const result = sanitizeString(longMessage, 2000);
      expect(result.length).toBe(2000);
    });
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

// ─── sanitizeDeep ───────────────────────────────────────────────────────
describe('sanitizeDeep', () => {
  it('sanitizes a plain string', () => {
    expect(sanitizeDeep('<b>hello</b>')).toBe('&lt;b&gt;hello&lt;&#x2F;b&gt;');
  });

  it('sanitizes a flat object (same as sanitizeObject)', () => {
    const input = { name: '<b>Bold</b>', count: 5 };
    const result = sanitizeDeep(input);
    expect(result.name).toBe('&lt;b&gt;Bold&lt;&#x2F;b&gt;');
    expect(result.count).toBe(5);
  });

  it('sanitizes deeply nested string fields', () => {
    const input = {
      user: {
        profile: {
          bio: '<script>alert("xss")</script>',
          age: 30,
        },
      },
    };
    const result = sanitizeDeep(input);
    expect(result.user.profile.bio).not.toContain('<script>');
    expect(result.user.profile.bio).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
    );
    expect(result.user.profile.age).toBe(30);
  });

  it('sanitizes strings inside arrays', () => {
    const input = ['<b>one</b>', 'plain', '<i>two</i>'];
    const result = sanitizeDeep(input);
    expect(result[0]).toBe('&lt;b&gt;one&lt;&#x2F;b&gt;');
    expect(result[1]).toBe('plain');
    expect(result[2]).toBe('&lt;i&gt;two&lt;&#x2F;i&gt;');
  });

  it('sanitizes arrays of objects', () => {
    const input = [{ name: '<script>bad</script>' }, { name: 'safe' }];
    const result = sanitizeDeep(input);
    expect(result[0].name).toContain('&lt;script&gt;');
    expect(result[1].name).toBe('safe');
  });

  it('sanitizes arrays nested inside objects', () => {
    const input = { tags: ['<b>tag1</b>', 'tag2'] };
    const result = sanitizeDeep(input);
    expect(result.tags[0]).toBe('&lt;b&gt;tag1&lt;&#x2F;b&gt;');
    expect(result.tags[1]).toBe('tag2');
  });

  it('passes through numbers, booleans, null unchanged', () => {
    expect(sanitizeDeep(42)).toBe(42);
    expect(sanitizeDeep(true)).toBe(true);
    expect(sanitizeDeep(null)).toBeNull();
  });

  it('does not mutate the original object', () => {
    const input = { user: { name: '<b>Alice</b>' } };
    const result = sanitizeDeep(input);
    expect(result).not.toBe(input);
    expect(input.user.name).toBe('<b>Alice</b>'); // original unchanged
    expect(result.user.name).toContain('&lt;b&gt;');
  });

  it('handles an empty object', () => {
    expect(sanitizeDeep({})).toEqual({});
  });

  it('handles an empty array', () => {
    expect(sanitizeDeep([])).toEqual([]);
  });

  it('handles undefined', () => {
    expect(sanitizeDeep(undefined)).toBeUndefined();
  });

  it('sanitizes a realistic nested CRM payload', () => {
    const payload = {
      lead: {
        name: '<img onerror="alert(1)" src="x">',
        notes: 'Normal text',
        metadata: {
          source: '<iframe src="evil.com">',
          score: 85,
          tags: ['<script>x</script>', 'vip'],
        },
      },
    };
    const result = sanitizeDeep(payload);
    expect(result.lead.name).not.toContain('<img');
    expect(result.lead.notes).toBe('Normal text');
    expect(result.lead.metadata.source).not.toContain('<iframe');
    expect(result.lead.metadata.score).toBe(85);
    expect(result.lead.metadata.tags[0]).not.toContain('<script>');
    expect(result.lead.metadata.tags[1]).toBe('vip');
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
