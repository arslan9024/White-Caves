import { describe, it, expect } from 'vitest';
import { validateViewCode, validateEntityId } from '../guards/RouteGuard';

describe('Route Bounds Guard Utility (RouteGuard.ts)', () => {
  it('validates correct View Code formats (VIEW-01 to VIEW-100)', () => {
    expect(validateViewCode('VIEW-01').isValid).toBe(true);
    expect(validateViewCode('VIEW-50').isValid).toBe(true);
    expect(validateViewCode('VIEW-100').isValid).toBe(true);
  });

  it('rejects invalid View Code formats and provides fallback cleanParam', () => {
    const invalid = validateViewCode('INVALID-CODE');
    expect(invalid.isValid).toBe(false);
    expect(invalid.cleanParam).toBe('VIEW-01');
  });

  it('validates UUID and numeric entity IDs', () => {
    expect(validateEntityId('12345').isValid).toBe(true);
    expect(validateEntityId('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d').isValid).toBe(true);
  });

  it('rejects empty or malformed entity IDs', () => {
    expect(validateEntityId('').isValid).toBe(false);
    expect(validateEntityId('!@#$%^&*()').isValid).toBe(false);
  });
});
