import { describe, expect, it } from 'vitest';
import {
  isFtaAuditFindingStatus,
  isFtaAuditRecordType,
  isFtaAuditSeverity,
  isFtaAuditStatus,
  summarizeFtaAuditFindings,
  type FtaAuditFinding,
  type FtaAuditPeriod,
  type FtaAuditRecordReference,
  type FtaAuditRequest,
  type FtaAuditRun,
} from './financeEngineFtaAudit.types';

function buildFinding(overrides: Partial<FtaAuditFinding> = {}): FtaAuditFinding {
  const records: FtaAuditRecordReference[] = [
    { recordType: 'invoice', recordId: 'inv-001', label: 'INV-2026-001' },
  ];

  return {
    id: 'finding-1',
    severity: 'high',
    ruleId: 'VAT-RATE-MISMATCH',
    message: 'VAT rate applied does not match FTA published rate for the period.',
    records,
    status: 'open',
    detectedAt: '2026-01-15T09:00:00.000Z',
    ...overrides,
  };
}

describe('isFtaAuditSeverity', () => {
  it('returns true for every valid severity value', () => {
    expect(isFtaAuditSeverity('critical')).toBe(true);
    expect(isFtaAuditSeverity('high')).toBe(true);
    expect(isFtaAuditSeverity('medium')).toBe(true);
    expect(isFtaAuditSeverity('low')).toBe(true);
    expect(isFtaAuditSeverity('info')).toBe(true);
  });

  it('returns false for invalid or non-string values', () => {
    expect(isFtaAuditSeverity('urgent')).toBe(false);
    expect(isFtaAuditSeverity(42)).toBe(false);
    expect(isFtaAuditSeverity(undefined)).toBe(false);
    expect(isFtaAuditSeverity(null)).toBe(false);
  });
});

describe('isFtaAuditStatus', () => {
  it('returns true for every valid status value', () => {
    expect(isFtaAuditStatus('pending')).toBe(true);
    expect(isFtaAuditStatus('in_progress')).toBe(true);
    expect(isFtaAuditStatus('completed')).toBe(true);
    expect(isFtaAuditStatus('failed')).toBe(true);
    expect(isFtaAuditStatus('cancelled')).toBe(true);
  });

  it('returns false for values outside the FtaAuditStatus union', () => {
    expect(isFtaAuditStatus('done')).toBe(false);
    expect(isFtaAuditStatus({})).toBe(false);
  });
});

describe('isFtaAuditFindingStatus', () => {
  it('returns true for every valid finding status value', () => {
    expect(isFtaAuditFindingStatus('open')).toBe(true);
    expect(isFtaAuditFindingStatus('acknowledged')).toBe(true);
    expect(isFtaAuditFindingStatus('resolved')).toBe(true);
    expect(isFtaAuditFindingStatus('waived')).toBe(true);
  });

  it('returns false for invalid finding status values', () => {
    expect(isFtaAuditFindingStatus('closed')).toBe(false);
    expect(isFtaAuditFindingStatus([])).toBe(false);
  });
});

describe('isFtaAuditRecordType', () => {
  it('returns true for every valid record type value', () => {
    expect(isFtaAuditRecordType('invoice')).toBe(true);
    expect(isFtaAuditRecordType('credit_note')).toBe(true);
    expect(isFtaAuditRecordType('tax_filing')).toBe(true);
    expect(isFtaAuditRecordType('payment')).toBe(true);
    expect(isFtaAuditRecordType('refund')).toBe(true);
    expect(isFtaAuditRecordType('ledger_entry')).toBe(true);
  });

  it('returns false for invalid record type values', () => {
    expect(isFtaAuditRecordType('receipt')).toBe(false);
    expect(isFtaAuditRecordType(0)).toBe(false);
  });
});

describe('summarizeFtaAuditFindings', () => {
  it('returns zeroed counters for an empty findings list', () => {
    const summary = summarizeFtaAuditFindings([]);

    expect(summary.totalFindings).toBe(0);
    expect(summary.bySeverity).toEqual({
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0,
    });
    expect(summary.byStatus).toEqual({
      open: 0,
      acknowledged: 0,
      resolved: 0,
      waived: 0,
    });
  });

  it('tallies findings correctly across severities and statuses', () => {
    const findings: FtaAuditFinding[] = [
      buildFinding({ id: 'f1', severity: 'critical', status: 'open' }),
      buildFinding({ id: 'f2', severity: 'critical', status: 'resolved' }),
      buildFinding({ id: 'f3', severity: 'high', status: 'acknowledged' }),
      buildFinding({ id: 'f4', severity: 'low', status: 'waived' }),
      buildFinding({ id: 'f5', severity: 'low', status: 'open' }),
    ];

    const summary = summarizeFtaAuditFindings(findings);

    expect(summary.totalFindings).toBe(5);
    expect(summary.bySeverity).toEqual({
      critical: 2,
      high: 1,
      medium: 0,
      low: 2,
      info: 0,
    });
    expect(summary.byStatus).toEqual({
      open: 2,
      acknowledged: 1,
      resolved: 1,
      waived: 1,
    });
  });

  it('does not mutate the input findings array', () => {
    const findings = [buildFinding()];
    const snapshot = JSON.parse(JSON.stringify(findings)) as FtaAuditFinding[];

    summarizeFtaAuditFindings(findings);

    expect(findings).toEqual(snapshot);
  });
});

describe('FtaAuditRun shape', () => {
  it('supports constructing a fully-typed audit run object', () => {
    const period: FtaAuditPeriod = {
      startDate: '2026-01-01',
      endDate: '2026-01-31',
    };
    const findings = [buildFinding()];

    const run: FtaAuditRun = {
      id: 'run-1',
      status: 'completed',
      period,
      startedAt: '2026-02-01T08:00:00.000Z',
      completedAt: '2026-02-01T08:05:00.000Z',
      findings,
      summary: summarizeFtaAuditFindings(findings),
      initiatedBy: 'user-42',
    };

    expect(run.status).toBe('completed');
    expect(run.findings).toHaveLength(1);
    expect(run.summary.totalFindings).toBe(1);
    expect(run.summary.bySeverity.high).toBe(1);
  });

  it('supports constructing a valid audit request without optional fields', () => {
    const request: FtaAuditRequest = {
      period: { startDate: '2026-03-01', endDate: '2026-03-31' },
      requestedBy: 'system-scheduler',
    };

    expect(request.recordTypes).toBeUndefined();
    expect(request.requestedBy).toBe('system-scheduler');
  });
});
