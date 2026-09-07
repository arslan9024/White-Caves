import { describe, expect, it } from 'vitest';
import { canAccessCRMModule, normalizeDashboardAccessRole } from './moduleAccessPolicy';

describe('dashboard module access policy', () => {
  it('normalizes supported role aliases', () => {
    expect(normalizeDashboardAccessRole('managing_director')).toBe('managing_director');
    expect(normalizeDashboardAccessRole('sales_agent')).toBe('agent');
    expect(normalizeDashboardAccessRole('buyer')).toBe('agent');
  });

  it('allows executive roles to use registered modules', () => {
    expect(canAccessCRMModule('owner', 'mary')).toBe(true);
    expect(canAccessCRMModule('managing_director', 'theodora')).toBe(true);
  });

  it('limits focused roles to their approved workspace modules', () => {
    expect(canAccessCRMModule('sales_agent', 'leads')).toBe(true);
    expect(canAccessCRMModule('agent', 'henry-tenancy-journey')).toBe(true);
    expect(canAccessCRMModule('agent', 'mary')).toBe(false);
  });

  it('denies unknown and missing roles', () => {
    expect(canAccessCRMModule('unknown', 'leads')).toBe(false);
    expect(canAccessCRMModule(undefined, 'leads')).toBe(false);
  });
});