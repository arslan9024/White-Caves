/**
 * Formatters Tests
 * Tests for common formatting functions
 */

import { describe, it, expect } from 'vitest';

/**
 * Format date
 */
function formatDate(date: Date | string, format = 'MM/DD/YYYY'): string {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();

  return format
    .replace('MM', month)
    .replace('DD', day)
    .replace('YYYY', String(year));
}

/**
 * Format currency
 */
function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format phone number
 */
function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11) {
    return `+${cleaned[0]} ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
}

/**
 * Format percentage
 */
function formatPercentage(value: number, decimals = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format large numbers (e.g., 1000 -> 1K)
 */
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return String(num);
}

/**
 * Format bytes
 */
function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(dm)} ${sizes[i]}`;
}

/**
 * Format text - capitalize first letter
 */
function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Format slug from string
 */
function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

describe('Date Formatting', () => {
  it('should format date in MM/DD/YYYY format', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date)).toBe('01/15/2024');
  });

  it('should format date with custom format', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date, 'DD/MM/YYYY')).toBe('15/01/2024');
    expect(formatDate(date, 'YYYY-MM-DD')).toBe('2024-01-15');
  });

  it('should handle string dates', () => {
    expect(formatDate('2024-12-25')).toBe('12/25/2024');
  });

  it('should pad month and day with zeros', () => {
    const date = new Date('2024-01-05');
    expect(formatDate(date)).toBe('01/05/2024');
  });
});

describe('Currency Formatting', () => {
  it('should format USD currency', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00');
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('should format other currencies', () => {
    expect(formatCurrency(1000, 'EUR')).toContain('1,000.00');
    expect(formatCurrency(1000, 'GBP')).toContain('1,000.00');
  });

  it('should handle decimal amounts', () => {
    expect(formatCurrency(0.99)).toBe('$0.99');
    expect(formatCurrency(999.99)).toBe('$999.99');
  });

  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('should handle large amounts', () => {
    expect(formatCurrency(1000000)).toBe('$1,000,000.00');
  });
});

describe('Phone Number Formatting', () => {
  it('should format 10-digit US phone number', () => {
    expect(formatPhone('1234567890')).toBe('(123) 456-7890');
  });

  it('should format 11-digit international number', () => {
    expect(formatPhone('12345678901')).toBe('+1 234 567-8901');
  });

  it('should handle already formatted numbers', () => {
    expect(formatPhone('(123) 456-7890')).toBe('(123) 456-7890');
  });

  it('should handle various input formats', () => {
    expect(formatPhone('123-456-7890')).toBe('(123) 456-7890');
    expect(formatPhone('123 456 7890')).toBe('(123) 456-7890');
  });
});

describe('Percentage Formatting', () => {
  it('should format decimal as percentage', () => {
    expect(formatPercentage(0.5)).toBe('50.00%');
    expect(formatPercentage(0.123)).toBe('12.30%');
  });

  it('should respect decimal places', () => {
    expect(formatPercentage(0.333, 1)).toBe('33.3%');
    expect(formatPercentage(0.333, 0)).toBe('33%');
  });

  it('should handle edge cases', () => {
    expect(formatPercentage(0)).toBe('0.00%');
    expect(formatPercentage(1)).toBe('100.00%');
  });
});

describe('Number Formatting', () => {
  it('should format thousands as K', () => {
    expect(formatNumber(1000)).toBe('1.0K');
    expect(formatNumber(1500)).toBe('1.5K');
  });

  it('should format millions as M', () => {
    expect(formatNumber(1000000)).toBe('1.0M');
    expect(formatNumber(2500000)).toBe('2.5M');
  });

  it('should not format small numbers', () => {
    expect(formatNumber(500)).toBe('500');
    expect(formatNumber(999)).toBe('999');
  });
});

describe('Bytes Formatting', () => {
  it('should format bytes correctly', () => {
    expect(formatBytes(0)).toBe('0 Bytes');
    expect(formatBytes(1024)).toBe('1.00 KB');
    expect(formatBytes(1048576)).toBe('1.00 MB');
    expect(formatBytes(1073741824)).toBe('1.00 GB');
  });

  it('should respect decimal places', () => {
    expect(formatBytes(1536, 0)).toBe('2 KB');
    expect(formatBytes(1536, 2)).toBe('1.50 KB');
  });
});

describe('Text Formatting', () => {
  it('should capitalize first letter', () => {
    expect(capitalizeFirst('hello')).toBe('Hello');
    expect(capitalizeFirst('HELLO')).toBe('Hello');
    expect(capitalizeFirst('hELLO')).toBe('Hello');
  });

  it('should convert to slug', () => {
    expect(toSlug('Hello World')).toBe('hello-world');
    expect(toSlug('Test Post Title')).toBe('test-post-title');
    expect(toSlug('Special@Chars#are$Removed')).toBe('specialcharsareremoved');
  });

  it('should handle multiple spaces and dashes', () => {
    expect(toSlug('Hello  World')).toBe('hello-world');
    expect(toSlug('Test -- Post')).toBe('test-post');
  });
});

// Export formatters for use in app
export {
  formatDate,
  formatCurrency,
  formatPhone,
  formatPercentage,
  formatNumber,
  formatBytes,
  capitalizeFirst,
  toSlug,
};
