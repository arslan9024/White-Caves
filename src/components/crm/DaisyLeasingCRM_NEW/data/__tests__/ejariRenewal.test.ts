// Tests: Ejari Renewal Automation — ejariRenewal.ts
import { describe, it, expect } from 'vitest';
import {
  buildRenewalAlert,
  scanRenewalAlerts,
  buildRenewalSubmissionPlan,
  assessRenewalSLA,
  validateRenewalReadiness,
  EJARI_RENEWAL_DOCUMENTS,
  RENEWAL_ALERT_DAYS,
} from '../ejariRenewal';
import { ActiveLease, RenewalRecord } from '../leasing';

// ─── Mock Data ─────────────────────────────────────────────────────────────

const BASE_LEASE: ActiveLease = {
  id: 1,
  unit: 'Apt 1205',
  building: 'Marina Views Tower A',
  tenant: 'Ahmed Al Rashid',
  tenantPhone: '+971 50 123 4567',
  tenantEmail: 'ahmed@example.ae',
  rent: 10000,
  annualRent: 120000,
  startDate: '2025-01-15',
  endDate: '2026-03-01',
  status: 'expiring_soon',
  daysRemaining: 25,
  ejariNumber: 'EJARI-2025-001234',
  ejariStatus: 'registered',
  pdcCount: 12,
  pdcCleared: 11,
  pdcBounced: 0,
  agentCommissionPct: 5,
  keyHandedOver: true,
  renewalNotice: true,
};

const BASE_RENEWAL: RenewalRecord = {
  id: 1,
  leaseId: 1,
  unit: 'Apt 1205',
  tenant: 'Ahmed Al Rashid',
  currentRent: 10000,
  proposedRent: 10500,
  renewalDate: '2026-01-01',
  noticeSent: true,
  tenantResponse: 'accepted',
  daysUntilExpiry: 25,
};

// ─── buildRenewalAlert ─────────────────────────────────────────────────────

describe('buildRenewalAlert', () => {
  it('returns null for leases outside 90-day window', () => {
    const lease = { ...BASE_LEASE, daysRemaining: 120 };
    expect(buildRenewalAlert(lease)).toBeNull();
  });

  it('returns critical alert for ≤30 days', () => {
    const lease = { ...BASE_LEASE, daysRemaining: 20 };
    const alert = buildRenewalAlert(lease);
    expect(alert).not.toBeNull();
    expect(alert!.severity).toBe('critical');
    expect(alert!.threshold).toBe(30);
    expect(alert!.requiredDocuments.length).toBeGreaterThan(0);
  });

  it('returns warning alert for ≤60 days', () => {
    const lease = { ...BASE_LEASE, daysRemaining: 55 };
    const alert = buildRenewalAlert(lease);
    expect(alert!.severity).toBe('warning');
    expect(alert!.threshold).toBe(60);
  });

  it('returns info alert for ≤90 days', () => {
    const lease = { ...BASE_LEASE, daysRemaining: 85 };
    const alert = buildRenewalAlert(lease);
    expect(alert!.severity).toBe('info');
    expect(alert!.threshold).toBe(90);
  });

  it('alert message contains unit and tenant name', () => {
    const alert = buildRenewalAlert(BASE_LEASE)!;
    expect(alert.message).toContain('Apt 1205');
    expect(alert.message).toContain('Ahmed Al Rashid');
  });
});

// ─── scanRenewalAlerts ─────────────────────────────────────────────────────

describe('scanRenewalAlerts', () => {
  it('filters out leases with status=expired and returns sorted alerts', () => {
    const leases: ActiveLease[] = [
      { ...BASE_LEASE, id: 1, daysRemaining: 20, status: 'expiring_soon' },
      { ...BASE_LEASE, id: 2, daysRemaining: 55, status: 'active' },
      { ...BASE_LEASE, id: 3, daysRemaining: 200, status: 'active' }, // outside window
      { ...BASE_LEASE, id: 4, daysRemaining: 10, status: 'expired' }, // excluded
    ];
    const alerts = scanRenewalAlerts(leases);
    // id=4 is expired but daysRemaining=10 — still within window; check status filter
    // expired status is excluded
    expect(alerts.map(a => a.leaseId)).not.toContain(4);
    expect(alerts.map(a => a.leaseId)).not.toContain(3);
    // sorted ascending
    expect(alerts[0].daysUntilExpiry).toBeLessThanOrEqual(
      alerts[alerts.length - 1].daysUntilExpiry
    );
  });
});

// ─── buildRenewalSubmissionPlan ────────────────────────────────────────────

describe('buildRenewalSubmissionPlan', () => {
  it('returns 8 steps', () => {
    const steps = buildRenewalSubmissionPlan(BASE_RENEWAL);
    expect(steps).toHaveLength(8);
  });

  it('marks notice step completed when noticeSent=true', () => {
    const steps = buildRenewalSubmissionPlan(BASE_RENEWAL);
    expect(steps[0].status).toBe('completed');
  });

  it('marks notice step pending when noticeSent=false', () => {
    const renewal = { ...BASE_RENEWAL, noticeSent: false };
    const steps = buildRenewalSubmissionPlan(renewal);
    expect(steps[0].status).toBe('pending');
  });

  it('marks step 2 as failed when tenant rejected', () => {
    const renewal = { ...BASE_RENEWAL, tenantResponse: 'rejected' as const };
    const steps = buildRenewalSubmissionPlan(renewal);
    expect(steps[1].status).toBe('failed');
  });

  it('all steps have required fields', () => {
    const steps = buildRenewalSubmissionPlan(BASE_RENEWAL);
    steps.forEach(s => {
      expect(s).toHaveProperty('stepId');
      expect(s).toHaveProperty('title');
      expect(s).toHaveProperty('owner');
      expect(s).toHaveProperty('status');
    });
  });
});

// ─── assessRenewalSLA ──────────────────────────────────────────────────────

describe('assessRenewalSLA', () => {
  it('returns non-breached for lease far from expiry', () => {
    const lease = {
      ...BASE_LEASE,
      daysRemaining: 90,
      endDate: '2027-01-01',
      ejariStatus: 'registered' as const,
    };
    const sla = assessRenewalSLA(lease);
    expect(sla.slaBreached).toBe(false);
  });

  it('marks slaBreachRisk when within 7 days of target', () => {
    // target = expiry - 14 days; if current date is within 7 days of target → risk
    // We use a lease expiring in 16 days (target = 2 days from now)
    const future = new Date();
    future.setDate(future.getDate() + 16);
    const lease: ActiveLease = {
      ...BASE_LEASE,
      daysRemaining: 16,
      endDate: future.toISOString().slice(0, 10),
      ejariStatus: 'pending',
    };
    const sla = assessRenewalSLA(lease);
    expect(sla.slaBreachRisk).toBe(true);
  });
});

// ─── validateRenewalReadiness ──────────────────────────────────────────────

describe('validateRenewalReadiness', () => {
  it('passes all checks for a fully ready renewal', () => {
    const report = validateRenewalReadiness(BASE_LEASE, BASE_RENEWAL);
    expect(report.ready).toBe(true);
    expect(report.failures).toHaveLength(0);
  });

  it('fails when notice not sent', () => {
    const renewal = { ...BASE_RENEWAL, noticeSent: false };
    const report = validateRenewalReadiness(BASE_LEASE, renewal);
    expect(report.ready).toBe(false);
    expect(report.failures.some(f => f.includes('notice'))).toBe(true);
  });

  it('fails when tenant rejected', () => {
    const renewal = { ...BASE_RENEWAL, tenantResponse: 'rejected' as const };
    const report = validateRenewalReadiness(BASE_LEASE, renewal);
    expect(report.failures.some(f => f.includes('rejected'))).toBe(true);
  });

  it('fails when ejari number is null', () => {
    const lease = { ...BASE_LEASE, ejariNumber: null };
    const report = validateRenewalReadiness(lease, BASE_RENEWAL);
    expect(report.failures.some(f => f.includes('Ejari number'))).toBe(true);
  });

  it('fails when pdcBounced > 0', () => {
    const lease = { ...BASE_LEASE, pdcBounced: 2 };
    const report = validateRenewalReadiness(lease, BASE_RENEWAL);
    expect(report.failures.some(f => f.includes('bounced'))).toBe(true);
  });
});

// ─── Constants ────────────────────────────────────────────────────────────

describe('RENEWAL_ALERT_DAYS', () => {
  it('contains thresholds [90, 60, 30]', () => {
    expect(RENEWAL_ALERT_DAYS).toEqual([90, 60, 30]);
  });
});

describe('EJARI_RENEWAL_DOCUMENTS', () => {
  it('contains at least 7 required documents', () => {
    expect(EJARI_RENEWAL_DOCUMENTS.length).toBeGreaterThanOrEqual(7);
  });
});
