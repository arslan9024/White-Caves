// Ejari Renewal Automation — AEG-029 / AEG-030 / VALKYRIE Wave
// 90/60/30-day statutory renewal alerts, document checklist, DLD/Ejari
// submission steps, SLA tracking, and acceptance-criteria validation.
// < 350 lines | Zero `any` | Strict TypeScript

import { ActiveLease, RenewalRecord } from './leasing';

// ─── Renewal Alert Thresholds (AEG-030) ──────────────────────────────────

export const RENEWAL_ALERT_DAYS = [90, 60, 30] as const;
export type RenewalAlertThreshold = (typeof RENEWAL_ALERT_DAYS)[number];

export type RenewalAlertSeverity = 'info' | 'warning' | 'critical';

export interface RenewalAlert {
  leaseId: number;
  unit: string;
  tenant: string;
  ejariNumber: string | null;
  daysUntilExpiry: number;
  threshold: RenewalAlertThreshold;
  severity: RenewalAlertSeverity;
  message: string;
  requiredDocuments: string[];
  nextAction: string;
}

// ─── Required Documents Checklist ────────────────────────────────────────

export const EJARI_RENEWAL_DOCUMENTS: string[] = [
  'Valid Emirates ID (tenant & landlord)',
  'Original tenancy contract (current)',
  'Title Deed / Oqood certificate',
  'No-objection certificate (NOC) from landlord',
  'Proof of DEWA connection / utility clearance',
  'Renewed PDC cheques for new term',
  'Completed Ejari renewal application form (RERA)',
  'Agency agreement (if applicable)',
];

// ─── Severity Map ─────────────────────────────────────────────────────────

function resolveSeverity(days: number): RenewalAlertSeverity {
  if (days <= 30) return 'critical';
  if (days <= 60) return 'warning';
  return 'info';
}

// ─── Build a Renewal Alert for a lease ───────────────────────────────────

export function buildRenewalAlert(lease: ActiveLease): RenewalAlert | null {
  const days = lease.daysRemaining;
  // Pick the smallest threshold that still covers daysRemaining (most urgent applicable window)
  const matchedThreshold = [...RENEWAL_ALERT_DAYS].reverse().find(t => days <= t) ?? null;

  if (matchedThreshold === null) return null; // outside alert window

  const severity = resolveSeverity(days);
  const urgencyLabel =
    severity === 'critical' ? '🔴 CRITICAL' : severity === 'warning' ? '🟡 WARNING' : '🔵 INFO';

  return {
    leaseId: lease.id,
    unit: lease.unit,
    tenant: lease.tenant,
    ejariNumber: lease.ejariNumber,
    daysUntilExpiry: days,
    threshold: matchedThreshold,
    severity,
    message:
      `${urgencyLabel} — Ejari renewal due in ${days} day(s) for unit ${lease.unit} ` +
      `(tenant: ${lease.tenant}). ` +
      `Ejari: ${lease.ejariNumber ?? 'NOT REGISTERED'}. ` +
      `Current status: ${lease.ejariStatus ?? 'unknown'}.`,
    requiredDocuments: EJARI_RENEWAL_DOCUMENTS,
    nextAction:
      severity === 'critical'
        ? 'Submit Ejari renewal immediately via RERA portal. Contact tenant and landlord.'
        : severity === 'warning'
          ? 'Collect renewal documents and confirm tenant intention to renew.'
          : 'Send 90-day renewal notice letter to tenant and prepare document checklist.',
  };
}

// ─── Batch Scan: all leases → active alerts ──────────────────────────────

export function scanRenewalAlerts(leases: ActiveLease[]): RenewalAlert[] {
  return leases
    .filter(
      l => l.status === 'active' || l.status === 'expiring_soon' || l.status === 'renewal_pending'
    )
    .map(l => buildRenewalAlert(l))
    .filter((a): a is RenewalAlert => a !== null)
    .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
}

// ─── Renewal Submission Steps ─────────────────────────────────────────────

export type SubmissionStepStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

export interface RenewalSubmissionStep {
  stepId: number;
  title: string;
  owner: string;
  estimatedDays: number;
  status: SubmissionStepStatus;
  completedAt: string | null;
}

export function buildRenewalSubmissionPlan(record: RenewalRecord): RenewalSubmissionStep[] {
  return [
    {
      stepId: 1,
      title: 'Send renewal notice to tenant',
      owner: 'Leasing Agent',
      estimatedDays: 1,
      status: record.noticeSent ? 'completed' : 'pending',
      completedAt: record.noticeSent ? record.renewalDate : null,
    },
    {
      stepId: 2,
      title: 'Collect tenant renewal decision',
      owner: 'Leasing Agent',
      estimatedDays: 7,
      status:
        record.tenantResponse === 'pending'
          ? 'in_progress'
          : record.tenantResponse === 'accepted' || record.tenantResponse === 'negotiating'
            ? 'in_progress'
            : record.tenantResponse === 'rejected'
              ? 'failed'
              : 'pending',
      completedAt: record.tenantResponse === 'accepted' ? record.renewalDate : null,
    },
    {
      stepId: 3,
      title: 'Agree on new rent amount',
      owner: 'Leasing Agent + Landlord',
      estimatedDays: 5,
      status: record.proposedRent > 0 ? 'completed' : 'pending',
      completedAt: record.proposedRent > 0 ? record.renewalDate : null,
    },
    {
      stepId: 4,
      title: 'Collect renewal PDC cheques from tenant',
      owner: 'Leasing Agent',
      estimatedDays: 3,
      status: 'pending',
      completedAt: null,
    },
    {
      stepId: 5,
      title: 'Prepare renewal tenancy contract',
      owner: 'Conveyancing / Legal',
      estimatedDays: 2,
      status: 'pending',
      completedAt: null,
    },
    {
      stepId: 6,
      title: 'Submit Ejari renewal via RERA portal',
      owner: 'Compliance Officer',
      estimatedDays: 1,
      status: 'pending',
      completedAt: null,
    },
    {
      stepId: 7,
      title: 'Obtain new Ejari certificate',
      owner: 'Compliance Officer',
      estimatedDays: 2,
      status: 'pending',
      completedAt: null,
    },
    {
      stepId: 8,
      title: 'Archive contract & update system records',
      owner: 'System / Admin',
      estimatedDays: 1,
      status: 'pending',
      completedAt: null,
    },
  ];
}

// ─── SLA Tracking ─────────────────────────────────────────────────────────

export interface RenewalSLAStatus {
  leaseId: number;
  unit: string;
  daysUntilExpiry: number;
  targetCompletionDate: string; // 14 days before expiry
  slaBreached: boolean;
  slaBreachRisk: boolean; // within 7 days of target
}

export function assessRenewalSLA(lease: ActiveLease): RenewalSLAStatus {
  const expiryDate = new Date(lease.endDate);
  const targetDate = new Date(expiryDate);
  targetDate.setDate(targetDate.getDate() - 14); // SLA: complete 14 days before expiry

  const now = new Date();
  const slaBreached = now > targetDate && lease.ejariStatus !== 'registered';
  const daysToTarget = Math.ceil((targetDate.getTime() - now.getTime()) / 86_400_000);
  const slaBreachRisk = !slaBreached && daysToTarget <= 7;

  return {
    leaseId: lease.id,
    unit: lease.unit,
    daysUntilExpiry: lease.daysRemaining,
    targetCompletionDate: targetDate.toISOString().slice(0, 10),
    slaBreached,
    slaBreachRisk,
  };
}

// ─── Acceptance Criteria Validator ───────────────────────────────────────

export interface RenewalReadinessReport {
  leaseId: number;
  unit: string;
  ready: boolean;
  failures: string[];
}

export function validateRenewalReadiness(
  lease: ActiveLease,
  record: RenewalRecord
): RenewalReadinessReport {
  const failures: string[] = [];

  if (!record.noticeSent) failures.push('Renewal notice not yet sent to tenant.');
  if (record.tenantResponse === 'rejected') failures.push('Tenant has rejected renewal.');
  if (record.tenantResponse === 'pending') failures.push('Awaiting tenant renewal decision.');
  if (record.proposedRent <= 0) failures.push('Proposed rent not yet agreed.');
  if (!lease.ejariNumber) failures.push('No Ejari number registered for this lease.');
  if (lease.ejariStatus === 'expired') failures.push('Existing Ejari registration is expired.');
  if (lease.pdcBounced > 0)
    failures.push(`${lease.pdcBounced} PDC cheque(s) still bounced — resolve before renewal.`);

  return {
    leaseId: lease.id,
    unit: lease.unit,
    ready: failures.length === 0,
    failures,
  };
}
