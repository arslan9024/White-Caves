import { describe, it, expect } from 'vitest';
import { PLATFORM_MODULES } from '../modules';

describe('Platform Modules Data', () => {
  it('exports PLATFORM_MODULES array with module categories', () => {
    expect(Array.isArray(PLATFORM_MODULES)).toBe(true);
    expect(PLATFORM_MODULES.length).toBeGreaterThan(0);
    expect(PLATFORM_MODULES[0].category).toBe('Core Business');
  });
});
