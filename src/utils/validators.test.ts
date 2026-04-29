/**
 * Validators Tests
 * Tests for common validation functions
 */

import { describe, it, expect } from 'vitest';

/**
 * Email validation
 */
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Phone validation
 */
function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * URL validation
 */
function validateURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Username validation
 */
function validateUsername(username: string): boolean {
  return username.length >= 3 && username.length <= 20 && /^[a-zA-Z0-9_-]+$/.test(username);
}

/**
 * Password strength validation
 */
function validatePassword(password: string): {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  message: string;
} {
  if (password.length < 8) {
    return {
      isValid: false,
      strength: 'weak',
      message: 'Password must be at least 8 characters',
    };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);

  const strength =
    hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
      ? 'strong'
      : hasUpperCase && hasLowerCase && hasNumbers
      ? 'medium'
      : 'weak';

  return {
    isValid: strength !== 'weak',
    strength,
    message: strength === 'strong' ? 'Strong password' : `Password strength: ${strength}`,
  };
}

describe('Email Validation', () => {
  it('should validate correct email format', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    expect(validateEmail('user+tag@example.com')).toBe(true);
  });

  it('should reject invalid email format', () => {
    expect(validateEmail('invalid.email')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('user @example.com')).toBe(false);
  });

  it('should handle edge cases', () => {
    expect(validateEmail('')).toBe(false);
    expect(validateEmail('a@b.c')).toBe(true);
  });
});

describe('Phone Validation', () => {
  it('should validate correct phone formats', () => {
    expect(validatePhone('1234567890')).toBe(true);
    expect(validatePhone('+1 234 567 8900')).toBe(true);
    expect(validatePhone('(123) 456-7890')).toBe(true);
    expect(validatePhone('+971 50 123 4567')).toBe(true);
  });

  it('should reject invalid phone formats', () => {
    expect(validatePhone('123')).toBe(false);
    expect(validatePhone('abc')).toBe(false);
  });

  it('should handle whitespace and special characters', () => {
    expect(validatePhone('123 456 7890')).toBe(true);
    expect(validatePhone('123-456-7890')).toBe(true);
  });
});

describe('URL Validation', () => {
  it('should validate correct URLs', () => {
    expect(validateURL('https://example.com')).toBe(true);
    expect(validateURL('http://www.example.com')).toBe(true);
    expect(validateURL('https://example.com/path')).toBe(true);
    expect(validateURL('ftp://files.example.com')).toBe(true);
  });

  it('should reject invalid URLs', () => {
    expect(validateURL('not a url')).toBe(false);
    expect(validateURL('example.com')).toBe(false);
    expect(validateURL('://invalid')).toBe(false);
  });
});

describe('Username Validation', () => {
  it('should validate correct usernames', () => {
    expect(validateUsername('john_doe')).toBe(true);
    expect(validateUsername('user123')).toBe(true);
    expect(validateUsername('test-user')).toBe(true);
  });

  it('should reject invalid usernames', () => {
    expect(validateUsername('ab')).toBe(false); // too short
    expect(validateUsername('a'.repeat(21))).toBe(false); // too long
    expect(validateUsername('user@name')).toBe(false); // invalid character
    expect(validateUsername('user name')).toBe(false); // space
  });

  it('should handle length constraints', () => {
    expect(validateUsername('abc')).toBe(true); // minimum
    expect(validateUsername('a'.repeat(20))).toBe(true); // maximum
  });
});

describe('Password Validation', () => {
  it('should validate strong passwords', () => {
    const result = validatePassword('StrongPass123!');
    expect(result.isValid).toBe(true);
    expect(result.strength).toBe('strong');
  });

  it('should validate medium strength passwords', () => {
    const result = validatePassword('MediumPass123');
    expect(result.isValid).toBe(true);
    expect(result.strength).toBe('medium');
  });

  it('should reject weak passwords', () => {
    const result = validatePassword('weak');
    expect(result.isValid).toBe(false);
    expect(result.strength).toBe('weak');
  });

  it('should check minimum length', () => {
    const result = validatePassword('Short1!');
    expect(result.isValid).toBe(false);
    expect(result.message).toContain('8 characters');
  });

  it('should provide appropriate messages', () => {
    expect(validatePassword('StrongPass123!').message).toBe('Strong password');
    expect(validatePassword('MediumPass123').message).toContain('medium');
    expect(validatePassword('weak').message).toContain('8 characters');
  });
});

// Export validators for use in app
export {
  validateEmail,
  validatePhone,
  validateURL,
  validateUsername,
  validatePassword,
};
