/**
 * Type definitions for the Finance Engine FTA (Federal Tax Authority) Audit module.
 *
 * This module models the audit trail records, findings, and summary structures
 * used to track FTA (VAT/tax authority) compliance audits performed against
 * finance engine transactions (invoices, credit notes, tax filings, etc.).
 *
 * Parent issue: #1944
 * Issue: #2401
 */

/** Severity level assigned to an individual audit finding. */
export type FtaAuditSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

/** Lifecycle status of an FTA audit run. */
export type FtaAuditStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';

/** Resolution status of a single audit finding. */
export type FtaAuditFindingStatus = 'open' | 'acknowledged' | 'resolved' | 'waived';

/** The category of finance record a finding relates to. */
export type FtaAuditRecordType =
  | 'invoice'
  | 'credit_note'
  | 'tax_filing'
  | 'payment'
  | 'refund'
  | 'ledger_entry';

/** A reference to the finance record examined by an audit finding. */
export interface FtaAuditRecordReference {
  /** The type of finance record referenced. */
  recordType: FtaAuditRecordType;
  /** Unique identifier of the referenced record. */
  recordId: string;
  /** Optional human-readable label for the referenced record (e.g. invoice number). */
  label?: string;
}

/** A single issue identified during an FTA audit pass. */
export interface FtaAuditFinding {
  /** Unique identifier for this finding. */
  id: string;
  /** Severity of the finding. */
  severity: FtaAuditSeverity;
  /** Machine-readable rule/check identifier that produced this finding. */
  ruleId: string;
  /** Human-readable description of the issue found. */
  message: string;
  /** The finance record(s) implicated by this finding. */
  records: FtaAuditRecordReference[];
  /** Current resolution status of the finding. */
  status: FtaAuditFindingStatus;
  /** ISO-8601 timestamp when the finding was created. */
  detectedAt: string;
  /** Optional ISO-8601 timestamp when the finding was resolved or waived. */
  resolvedAt?: string;
  /** Optional free-text notes captured during resolution. */
  resolutionNotes?: string;
}

/** Aggregate counters summarizing findings for an audit run. */
export interface FtaAuditSummary {
  /** Total number of findings produced by the audit run. */
  totalFindings: number;
  /** Count of findings grouped by severity. */
  bySeverity: Record<FtaAuditSeverity, number>;
  /** Count of findings grouped by resolution status. */
  byStatus: Record<FtaAuditFindingStatus, number>;
}

/** The date range covered by an FTA audit run. */
export interface FtaAuditPeriod {
  /** ISO-8601 date (inclusive) marking the start of the audited period. */
  startDate: string;
  /** ISO-8601 date (inclusive) marking the end of the audited period. */
  endDate: string;
}

/** A complete FTA audit run over a period of finance engine data. */
export interface FtaAuditRun {
  /** Unique identifier of the audit run. */
  id: string;
  /** Current lifecycle status of the audit run. */
  status: FtaAuditStatus;
  /** The period of finance data covered by this audit. */
  period: FtaAuditPeriod;
  /** ISO-8601 timestamp when the audit run was started. */
  startedAt: string;
  /** Optional ISO-8601 timestamp when the audit run completed or failed. */
  completedAt?: string;
  /** Findings produced by this audit run. */
  findings: FtaAuditFinding[];
  /** Aggregate summary of the findings for this audit run. */
  summary: FtaAuditSummary;
  /** Identifier of the user or system process that initiated the audit run. */
  initiatedBy: string;
}

/** Input parameters used to request a new FTA audit run. */
export interface FtaAuditRequest {
  /** The period of finance data to audit. */
  period: FtaAuditPeriod;
  /** Optional subset of record types to restrict the audit to. */
  recordTypes?: FtaAuditRecordType[];
  /** Identifier of the user or system process requesting the audit. */
  requestedBy: string;
}

/** Type guard verifying an unknown value conforms to {@link FtaAuditSeverity}. */
export function isFtaAuditSeverity(value: unknown): value is FtaAuditSeverity {
  return (
    value === 'critical' ||
    value === 'high' ||
    value === 'medium' ||
    value === 'low' ||
    value === 'info'
  );
}

/** Type guard verifying an unknown value conforms to {@link FtaAuditStatus}. */
export function isFtaAuditStatus(value: unknown): value is FtaAuditStatus {
  return (
    value === 'pending' ||
    value === 'in_progress' ||
    value === 'completed' ||
    value === 'failed' ||
    value === 'cancelled'
  );
}

/** Type guard verifying an unknown value conforms to {@link FtaAuditFindingStatus}. */
export function isFtaAuditFindingStatus(value: unknown): value is FtaAuditFindingStatus {
  return value === 'open' || value === 'acknowledged' || value === 'resolved' || value === 'waived';
}

/** Type guard verifying an unknown value conforms to {@link FtaAuditRecordType}. */
export function isFtaAuditRecordType(value: unknown): value is FtaAuditRecordType {
  return (
    value === 'invoice' ||
    value === 'credit_note' ||
    value === 'tax_filing' ||
    value === 'payment' ||
    value === 'refund' ||
    value === 'ledger_entry'
  );
}

/**
 * Builds an {@link FtaAuditSummary} from a list of findings by tallying
 * counts per severity and per resolution status.
 */
export function summarizeFtaAuditFindings(findings: FtaAuditFinding[]): FtaAuditSummary {
  const bySeverity: Record<FtaAuditSeverity, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0,
  };
  const byStatus: Record<FtaAuditFindingStatus, number> = {
    open: 0,
    acknowledged: 0,
    resolved: 0,
    waived: 0,
  };

  for (const finding of findings) {
    bySeverity[finding.severity] += 1;
    byStatus[finding.status] += 1;
  }

  return {
    totalFindings: findings.length,
    bySeverity,
    byStatus,
  };
}
