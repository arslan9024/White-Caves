import { describe, it, expect } from 'vitest';
import { NINA_FEATURES } from '../assistantFeatures';

describe('assistantFeatures data module', () => {
  it('exports assistant feature data', () => {
    expect(NINA_FEATURES.length).toBeGreaterThan(0);
  });
});
