import { describe, expect, it } from 'vitest';
import {
  buildCompletionEvidence,
  createRollbackNote,
  evaluateReleaseChecklist,
  groupChecklistBySeverity,
  isReleaseApproved,
  type ReleaseCandidate,
  type ReleaseCheckItem,
} from './ejariSuiteProductionRelease.logic';

const passingChecklist: readonly ReleaseCheckItem[] = [
  { id: 'schema-migrated', label: 'Schema migrated', passed: true, severity: 'blocking' },
  { id: 'smoke-tests', label: 'Smoke tests green', passed: true, severity: 'blocking' },
  { id: 'docs-updated', label: 'Docs updated', passed: true, severity: 'informational' },
];

const blockedChecklist: readonly ReleaseCheckItem[] = [
  { id: 'schema-migrated', label: 'Schema migrated', passed: false, severity: 'blocking' },
  { id: 'smoke-tests', label: 'Smoke tests green', passed: true, severity: 'blocking' },
  { id: 'docs-updated', label: 'Docs updated', passed: true, severity: 'informational' },
];

const pendingChecklist: readonly ReleaseCheckItem[] = [
  { id: 'schema-migrated', label: 'Schema migrated', passed: true, severity: 'blocking' },
  {
    id: 'perf-benchmark',
    label: 'Perf benchmark within budget',
    passed: false,
    severity: 'warning',
  },
  { id: 'docs-updated', label: 'Docs updated', passed: true, severity: 'informational' },
];

describe('evaluateReleaseChecklist', () => {
  it('returns "ready" when every check passes', () => {
    const summary = evaluateReleaseChecklist(passingChecklist);
    expect(summary.status).toBe('ready');
    expect(summary.totalChecks).toBe(3);
    expect(summary.passedChecks).toBe(3);
    expect(summary.failedChecks).toBe(0);
    expect(summary.blockingFailures).toHaveLength(0);
    expect(summary.warningFailures).toHaveLength(0);
  });

  it('returns "blocked" when a blocking check fails, even if others pass', () => {
    const summary = evaluateReleaseChecklist(blockedChecklist);
    expect(summary.status).toBe('blocked');
    expect(summary.blockingFailures).toHaveLength(1);
    expect(summary.blockingFailures[0].id).toBe('schema-migrated');
    expect(summary.failedChecks).toBe(1);
  });

  it('returns "pending" when only warning-level checks fail', () => {
    const summary = evaluateReleaseChecklist(pendingChecklist);
    expect(summary.status).toBe('pending');
    expect(summary.blockingFailures).toHaveLength(0);
    expect(summary.warningFailures).toHaveLength(1);
    expect(summary.warningFailures[0].id).toBe('perf-benchmark');
  });

  it('handles an empty checklist as ready', () => {
    const summary = evaluateReleaseChecklist([]);
    expect(summary.status).toBe('ready');
    expect(summary.totalChecks).toBe(0);
    expect(summary.passedChecks).toBe(0);
    expect(summary.failedChecks).toBe(0);
  });

  it('does not let a failed informational check affect readiness', () => {
    const checklist: readonly ReleaseCheckItem[] = [
      { id: 'docs-updated', label: 'Docs updated', passed: false, severity: 'informational' },
    ];
    const summary = evaluateReleaseChecklist(checklist);
    expect(summary.status).toBe('ready');
    expect(summary.failedChecks).toBe(1);
  });
});

describe('isReleaseApproved', () => {
  it('returns true for a fully passing candidate', () => {
    const candidate: ReleaseCandidate = {
      version: '2.4.0',
      previousStableVersion: '2.3.0',
      checklist: passingChecklist,
    };
    expect(isReleaseApproved(candidate)).toBe(true);
  });

  it('returns false when blocking checks fail', () => {
    const candidate: ReleaseCandidate = {
      version: '2.4.0',
      previousStableVersion: '2.3.0',
      checklist: blockedChecklist,
    };
    expect(isReleaseApproved(candidate)).toBe(false);
  });

  it('returns false when the release is only pending (warnings outstanding)', () => {
    const candidate: ReleaseCandidate = {
      version: '2.4.0',
      previousStableVersion: '2.3.0',
      checklist: pendingChecklist,
    };
    expect(isReleaseApproved(candidate)).toBe(false);
  });
});

describe('createRollbackNote', () => {
  const candidate: ReleaseCandidate = {
    version: '2.4.0',
    previousStableVersion: '2.3.0',
    checklist: blockedChecklist,
  };

  it('builds a rollback note referencing the previous stable version', () => {
    const fixedDate = new Date('2026-01-01T00:00:00.000Z');
    const note = createRollbackNote(candidate, 'Schema migration failed in staging', fixedDate);

    expect(note.version).toBe('2.4.0');
    expect(note.previousStableVersion).toBe('2.3.0');
    expect(note.rollbackCommand).toBe('deploy:ejari-suite --version=2.3.0');
    expect(note.reason).toBe('Schema migration failed in staging');
    expect(note.generatedAt).toBe('2026-01-01T00:00:00.000Z');
  });

  it('throws when the candidate version is empty', () => {
    const invalidCandidate: ReleaseCandidate = { ...candidate, version: '   ' };
    expect(() => createRollbackNote(invalidCandidate, 'reason')).toThrow(
      /version must be a non-empty string/
    );
  });

  it('throws when the previous stable version is empty', () => {
    const invalidCandidate: ReleaseCandidate = { ...candidate, previousStableVersion: '' };
    expect(() => createRollbackNote(invalidCandidate, 'reason')).toThrow(
      /previousStableVersion must be a non-empty string/
    );
  });
});

describe('buildCompletionEvidence', () => {
  it('summarizes a ready release without listing failures', () => {
    const candidate: ReleaseCandidate = {
      version: '2.4.0',
      previousStableVersion: '2.3.0',
      checklist: passingChecklist,
    };
    const evidence = buildCompletionEvidence(candidate);
    expect(evidence).toContain('Ejari Suite Production Release evidence for version 2.4.0');
    expect(evidence).toContain('Status: ready');
    expect(evidence).toContain('Checks: 3/3 passed');
    expect(evidence).not.toContain('Blocking failures');
    expect(evidence).not.toContain('Warning failures');
  });

  it('lists blocking and warning failures when present', () => {
    const candidate: ReleaseCandidate = {
      version: '2.4.0',
      previousStableVersion: '2.3.0',
      checklist: [...blockedChecklist, ...pendingChecklist],
    };
    const evidence = buildCompletionEvidence(candidate);
    expect(evidence).toContain('Blocking failures: schema-migrated');
    expect(evidence).toContain('Warning failures: perf-benchmark');
  });
});

describe('groupChecklistBySeverity', () => {
  it('partitions checklist items into their respective severity buckets', () => {
    const grouped = groupChecklistBySeverity([...passingChecklist, ...pendingChecklist]);
    expect(grouped.blocking.map(item => item.id)).toEqual([
      'schema-migrated',
      'smoke-tests',
      'schema-migrated',
    ]);
    expect(grouped.warning.map(item => item.id)).toEqual(['perf-benchmark']);
    expect(grouped.informational.map(item => item.id)).toEqual(['docs-updated', 'docs-updated']);
  });

  it('returns empty arrays for an empty checklist', () => {
    const grouped = groupChecklistBySeverity([]);
    expect(grouped.blocking).toHaveLength(0);
    expect(grouped.warning).toHaveLength(0);
    expect(grouped.informational).toHaveLength(0);
  });
});
