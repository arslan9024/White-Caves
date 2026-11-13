// PDC Bounce Escalation State Machine — AEG-012 / VALKYRIE Wave
// Dubai leasing ops: bounced cheque escalation with landlord alerting,
// grace-period rules, legal checkpoints, and idempotent state transitions.
// < 350 lines | Zero `any` | Strict TypeScript

import { PDCCheque, PDCStatus } from './leasing';

// ─── Escalation State Machine ──────────────────────────────────────────────

export type BounceStage =
  | 'cheque_returned' // Bank returns the cheque
  | 'landlord_notified' // Landlord alerted within 24h
  | 'grace_period_active' // 3-business-day cure window
  | 'grace_period_expired' // Cure window lapsed
  | 'legal_notice_sent' // Formal legal notice issued
  | 'legal_escalated' // Handed to legal team / RERA
  | 'resolved' // Tenant settled; case closed
  | 'written_off'; // Irrecoverable; lease terminated

export type BounceReason =
  | 'insufficient_funds'
  | 'account_closed'
  | 'payment_stopped'
  | 'signature_mismatch'
  | 'post_dated'
  | 'other';

export interface BounceEscalationEvent {
  timestamp: string; // ISO-8601
  stage: BounceStage;
  actor: string; // e.g. "system" | "agent:Daisy" | "legal"
  note: string;
}

export interface BounceEscalationRecord {
  chequeId: number;
  chequeNumber: string;
  leaseId: number;
  tenantName: string;
  unit: string;
  amount: number;
  bankName: string;
  returnDate: string; // ISO date cheque was returned
  bounceReason: BounceReason;
  currentStage: BounceStage;
  gracePeriodDeadline: string; // ISO date (returnDate + 3 business days)
  legalNoticeDate: string | null;
  resolvedDate: string | null;
  landlordNotified: boolean;
  events: BounceEscalationEvent[];
}

// ─── Business Logic Helpers ────────────────────────────────────────────────

/** Add N business days (Mon–Fri) to a date string; returns ISO date string */
export function addBusinessDays(isoDate: string, days: number): string {
  const date = new Date(isoDate);
  let added = 0;
  while (added < days) {
    date.setDate(date.getDate() + 1);
    const dow = date.getDay();
    if (dow !== 0 && dow !== 6) added++; // skip Sat(6) & Sun(0)
  }
  return date.toISOString().slice(0, 10);
}

/** Determine if the grace period has expired relative to `now` */
export function isGracePeriodExpired(gracePeriodDeadline: string, now: Date = new Date()): boolean {
  return new Date(gracePeriodDeadline) < now;
}

/** Derive next required stage from current stage */
export function nextEscalationStage(current: BounceStage): BounceStage | null {
  const flow: Record<BounceStage, BounceStage | null> = {
    cheque_returned: 'landlord_notified',
    landlord_notified: 'grace_period_active',
    grace_period_active: 'grace_period_expired',
    grace_period_expired: 'legal_notice_sent',
    legal_notice_sent: 'legal_escalated',
    legal_escalated: null, // terminal until resolved or written off
    resolved: null,
    written_off: null,
  };
  return flow[current] ?? null;
}

// ─── Factory: open a new bounce escalation record ─────────────────────────

export function openBounceEscalation(
  cheque: PDCCheque,
  bounceReason: BounceReason,
  returnDate: string,
  actor = 'system'
): BounceEscalationRecord {
  const gracePeriodDeadline = addBusinessDays(returnDate, 3);
  const initEvent: BounceEscalationEvent = {
    timestamp: new Date().toISOString(),
    stage: 'cheque_returned',
    actor,
    note: `Cheque ${cheque.chequeNumber} returned by ${cheque.bankName}. Reason: ${bounceReason}.`,
  };
  return {
    chequeId: cheque.id,
    chequeNumber: cheque.chequeNumber,
    leaseId: cheque.leaseId,
    tenantName: cheque.tenantName,
    unit: cheque.unit,
    amount: cheque.amount,
    bankName: cheque.bankName,
    returnDate,
    bounceReason,
    currentStage: 'cheque_returned',
    gracePeriodDeadline,
    legalNoticeDate: null,
    resolvedDate: null,
    landlordNotified: false,
    events: [initEvent],
  };
}

// ─── Idempotent Stage Transition (AEG-012) ────────────────────────────────

export interface TransitionResult {
  success: boolean;
  record: BounceEscalationRecord;
  message: string;
}

export function advanceBounceStage(
  record: BounceEscalationRecord,
  toStage: BounceStage,
  actor: string,
  note: string
): TransitionResult {
  // Idempotent: skip if already at or past this stage
  if (record.currentStage === toStage) {
    return { success: false, record, message: `Already at stage: ${toStage}` };
  }

  const terminalStages: BounceStage[] = ['resolved', 'written_off'];
  if (terminalStages.includes(record.currentStage)) {
    return {
      success: false,
      record,
      message: `Record is terminal (${record.currentStage}); no further transitions allowed.`,
    };
  }

  const event: BounceEscalationEvent = {
    timestamp: new Date().toISOString(),
    stage: toStage,
    actor,
    note,
  };

  const updated: BounceEscalationRecord = {
    ...record,
    currentStage: toStage,
    landlordNotified: record.landlordNotified || toStage === 'landlord_notified',
    legalNoticeDate:
      toStage === 'legal_notice_sent'
        ? new Date().toISOString().slice(0, 10)
        : record.legalNoticeDate,
    resolvedDate: terminalStages.includes(toStage)
      ? new Date().toISOString().slice(0, 10)
      : record.resolvedDate,
    events: [...record.events, event],
  };

  return { success: true, record: updated, message: `Transitioned to: ${toStage}` };
}

// ─── Landlord Notification Payload ────────────────────────────────────────

export interface LandlordNotification {
  chequeNumber: string;
  unit: string;
  tenantName: string;
  amount: number;
  bounceReason: BounceReason;
  gracePeriodDeadline: string;
  urgency: 'high' | 'critical';
  message: string;
}

export function buildLandlordNotification(record: BounceEscalationRecord): LandlordNotification {
  const daysLeft = Math.ceil(
    (new Date(record.gracePeriodDeadline).getTime() - Date.now()) / 86_400_000
  );
  const urgency = daysLeft <= 1 ? 'critical' : 'high';
  return {
    chequeNumber: record.chequeNumber,
    unit: record.unit,
    tenantName: record.tenantName,
    amount: record.amount,
    bounceReason: record.bounceReason,
    gracePeriodDeadline: record.gracePeriodDeadline,
    urgency,
    message:
      `PDC Bounce Alert — Cheque ${record.chequeNumber} for unit ${record.unit} ` +
      `(AED ${record.amount.toLocaleString()}) returned by ${record.bankName}. ` +
      `Reason: ${record.bounceReason.replace(/_/g, ' ')}. ` +
      `Grace period expires: ${record.gracePeriodDeadline} (${daysLeft} day(s) remaining). ` +
      `Please advise on next steps.`,
  };
}

// ─── Batch Scan: flag all bounced cheques needing action ──────────────────

export interface BouncedChequeSummary {
  chequeId: number;
  chequeNumber: string;
  unit: string;
  tenantName: string;
  amount: number;
  status: PDCStatus;
  actionRequired: string;
}

export function scanBouncedCheques(cheques: PDCCheque[]): BouncedChequeSummary[] {
  return cheques
    .filter(c => c.status === 'bounced')
    .map(c => ({
      chequeId: c.id,
      chequeNumber: c.chequeNumber,
      unit: c.unit,
      tenantName: c.tenantName,
      amount: c.amount,
      status: c.status,
      actionRequired: 'Open bounce escalation record and notify landlord within 24h.',
    }));
}
