import { describe, it, expect } from 'vitest';
import { calculateLeadSLADecay } from './LeadSLADecayEngine';

describe('LeadSLADecayEngine Utility', () => {
  it('returns EXCELLENT status for leads under 15 minutes old', () => {
    const now = new Date();
    const tenMinsAgo = new Date(now.getTime() - 10 * 60 * 1000);
    const result = calculateLeadSLADecay(tenMinsAgo, now);

    expect(result.status).toBe('EXCELLENT');
    expect(result.elapsedMinutes).toBe(10);
    expect(result.remainingValueScore).toBeGreaterThanOrEqual(80);
  });

  it('returns WARNING status for leads between 15 and 30 minutes old', () => {
    const now = new Date();
    const twentyMinsAgo = new Date(now.getTime() - 20 * 60 * 1000);
    const result = calculateLeadSLADecay(twentyMinsAgo, now);

    expect(result.status).toBe('WARNING');
    expect(result.elapsedMinutes).toBe(20);
  });

  it('returns EXPIRED_ESCALATED status for leads over 60 minutes old', () => {
    const now = new Date();
    const ninetyMinsAgo = new Date(now.getTime() - 90 * 60 * 1000);
    const result = calculateLeadSLADecay(ninetyMinsAgo, now);

    expect(result.status).toBe('EXPIRED_ESCALATED');
    expect(result.remainingValueScore).toBe(5);
  });
});
