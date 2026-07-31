import { describe, it, expect } from 'vitest';
import { LEASING_STAGE_LABELS, ACTIVE_LEASES } from '../leasing';

describe('leasing data module', () => {
  it('exports LEASING_STAGE_LABELS with 10 stages', () => {
    expect(Object.keys(LEASING_STAGE_LABELS).length).toBe(10);
  });

  it('LEASING_STAGE_LABELS stage 1 is Lead Acquisition', () => {
    expect(LEASING_STAGE_LABELS[1]).toBe('Lead Acquisition');
  });

  it('exports ACTIVE_LEASES as an array', () => {
    expect(Array.isArray(ACTIVE_LEASES)).toBe(true);
    expect(ACTIVE_LEASES.length).toBeGreaterThan(0);
  });

  it('ACTIVE_LEASES entries have required fields', () => {
    const lease = ACTIVE_LEASES[0];
    expect(lease).toHaveProperty('id');
    expect(lease).toHaveProperty('status');
  });
});
