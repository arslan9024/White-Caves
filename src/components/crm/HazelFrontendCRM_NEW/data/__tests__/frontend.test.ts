import { describe, it, expect } from 'vitest';
import { COMPONENT_LIBRARY } from '../frontend';

describe('frontend data', () => {
  it('has components', () => {
    expect(COMPONENT_LIBRARY.length).toBeGreaterThan(0);
  });
});