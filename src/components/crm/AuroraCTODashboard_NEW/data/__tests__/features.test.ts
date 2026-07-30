import { describe, it, expect } from 'vitest';
import { CTO_FEATURES } from '../features';

describe('CTO Features Data', () => {
  it('exports CTO_FEATURES array with expected features', () => {
    expect(Array.isArray(CTO_FEATURES)).toBe(true);
    expect(CTO_FEATURES.length).toBeGreaterThan(0);
    expect(CTO_FEATURES).toContain('System monitoring and health checks');
  });
});
