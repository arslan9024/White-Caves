import { describe, it, expect } from 'vitest';
import { STAGE_VELOCITIES, calcVelocityPct, isOnTarget } from './PipelineVelocityGauge.logic';

describe('PipelineVelocityGauge.logic', () => {
  it('contains valid stage velocity metrics', () => {
    expect(STAGE_VELOCITIES.length).toBe(4);
    expect(STAGE_VELOCITIES[0].stage).toBe('New → Contacted');
  });

  it('calculates velocity percentages accurately', () => {
    expect(calcVelocityPct(2, 1)).toBe(50);
    expect(calcVelocityPct(1, 2)).toBe(100);
  });

  it('evaluates whether velocity is on target', () => {
    expect(isOnTarget(1.1, 1)).toBe(true);
    expect(isOnTarget(1.5, 1)).toBe(false);
  });
});
