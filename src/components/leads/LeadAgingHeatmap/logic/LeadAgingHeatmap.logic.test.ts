import { describe, it, expect } from 'vitest';
import { getAgingColor, getAgingLabel, AGING_LEADS } from './LeadAgingHeatmap.logic';

describe('LeadAgingHeatmap.logic', () => {
  it('returns appropriate colors based on days threshold', () => {
    expect(getAgingColor(1)).toBe('#22c55e');
    expect(getAgingColor(5)).toBe('#eab308');
    expect(getAgingColor(10)).toBe('#f97316');
    expect(getAgingColor(20)).toBe('#ef4444');
  });

  it('returns appropriate labels based on days threshold', () => {
    expect(getAgingLabel(1)).toBe('Fresh');
    expect(getAgingLabel(5)).toBe('Warm');
    expect(getAgingLabel(10)).toBe('Cooling');
    expect(getAgingLabel(20)).toBe('Cold');
  });

  it('provides a default aging leads dataset', () => {
    expect(AGING_LEADS.length).toBeGreaterThan(0);
    expect(AGING_LEADS[0].name).toBe('Ahmed Al Mansouri');
  });
});
