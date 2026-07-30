import { describe, it, expect } from 'vitest';
import { TECH_STACK, SYSTEM_COMPONENTS } from '../architecture';

describe('Architecture Data', () => {
  it('exports tech stack', () => {
    expect(TECH_STACK).toBeDefined();
    expect(Array.isArray(TECH_STACK.frontend)).toBe(true);
  });

  it('exports system components', () => {
    expect(Array.isArray(SYSTEM_COMPONENTS)).toBe(true);
    expect(SYSTEM_COMPONENTS.length).toBeGreaterThan(0);
  });
});
