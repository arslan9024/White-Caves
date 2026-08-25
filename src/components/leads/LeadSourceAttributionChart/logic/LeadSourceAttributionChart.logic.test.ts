import { describe, it, expect } from 'vitest';
import { SOURCE_DATA, calcPercent } from './LeadSourceAttributionChart.logic';

describe('LeadSourceAttributionChart.logic', () => {
  it('contains valid lead sources and distribution counts', () => {
    expect(SOURCE_DATA.length).toBeGreaterThanOrEqual(4);
    expect(SOURCE_DATA[0].label).toBe('PropertyFinder');
    expect(SOURCE_DATA[0].count).toBe(142);
  });

  it('correctly calculates percentage shares', () => {
    expect(calcPercent(50, 200)).toBe(25);
    expect(calcPercent(142, 420)).toBe(34);
    expect(calcPercent(0, 100)).toBe(0);
  });
});
