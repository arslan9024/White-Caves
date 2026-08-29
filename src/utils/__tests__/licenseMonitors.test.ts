import { describe, it, expect } from 'vitest';
import { getLicenseStatuses, hasExpiringLicenses } from '../licenseMonitors';

describe('Government License Expiry Monitors (licenseMonitors.ts)', () => {
  it('returns all 4 official regulatory licenses with canonical IDs', () => {
    const statuses = getLicenseStatuses(new Date('2026-01-01'));
    expect(statuses.length).toBe(4);

    const det = statuses.find(s => s.name === 'DET');
    expect(det?.idNumber).toBe('1388443');

    const rera = statuses.find(s => s.name === 'RERA');
    expect(rera?.idNumber).toBe('44483');

    const ejari = statuses.find(s => s.name === 'EJARI');
    expect(ejari?.idNumber).toBe('0120250814005322');

    const icp = statuses.find(s => s.name === 'ICP');
    expect(icp?.idNumber).toBe('2/1/1192499');
  });

  it('correctly calculates ACTIVE status when far from expiry', () => {
    const statuses = getLicenseStatuses(new Date('2026-01-01'));
    expect(statuses.every(s => s.status === 'ACTIVE')).toBe(true);
    expect(hasExpiringLicenses(statuses)).toBe(false);
  });

  it('triggers WARNING_90 when within 90 days of expiry', () => {
    const statuses = getLicenseStatuses(new Date('2026-05-15'));
    const det = statuses.find(s => s.name === 'DET');
    expect(det?.status).toBe('WARNING_90');
    expect(hasExpiringLicenses(statuses)).toBe(true);
  });

  it('triggers WARNING_30 when within 30 days of expiry', () => {
    const statuses = getLicenseStatuses(new Date('2026-07-15'));
    const det = statuses.find(s => s.name === 'DET');
    expect(det?.status).toBe('WARNING_30');
    expect(hasExpiringLicenses(statuses)).toBe(true);
  });

  it('triggers EXPIRED when current date is past expiry', () => {
    const statuses = getLicenseStatuses(new Date('2026-09-01'));
    const det = statuses.find(s => s.name === 'DET');
    expect(det?.status).toBe('EXPIRED');
    expect(hasExpiringLicenses(statuses)).toBe(true);
  });
});
