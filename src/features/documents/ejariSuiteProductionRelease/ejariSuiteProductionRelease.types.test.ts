import { describe, expect, it } from 'vitest';
import {
  EJARI_RELEASE_CHECK_IDS,
  createInitialGateState,
  isGateReadyForRelease,
  summarizeGate,
  validateGateStructure,
  withCheckResult,
  type EjariReleaseCheckResult,
  type EjariSuiteProductionReleaseGate,
} from './ejariSuiteProductionRelease.types';

describe('createInitialGateState', () => {
  it('creates a gate with every required check pending', () => {
    const gate = createInitialGateState('#2488', '#1924');

    expect(gate.issueRef).toBe('#2488');
    expect(gate.parentIssueRef).toBe('#1924');
    expect(gate.checks).toHaveLength(EJARI_RELEASE_CHECK_IDS.length);
    expect(gate.checks.every(check => check.status === 'pending')).toBe(true);
    expect(gate.checks.map(check => check.id)).toEqual(EJARI_RELEASE_CHECK_IDS);
  });
});

describe('withCheckResult', () => {
  it('updates a single existing check without mutating the original gate', () => {
    const gate = createInitialGateState('#2488', '#1924');
    const updatedResult: EjariReleaseCheckResult = {
      id: 'schemaValidation',
      status: 'passed',
      evaluatedAt: '2026-01-01T00:00:00.000Z',
    };

    const nextGate = withCheckResult(gate, updatedResult);

    expect(nextGate).not.toBe(gate);
    expect(gate.checks.find(c => c.id === 'schemaValidation')?.status).toBe('pending');
    expect(nextGate.checks.find(c => c.id === 'schemaValidation')?.status).toBe('passed');
    expect(nextGate.checks).toHaveLength(gate.checks.length);
  });

  it('appends a new check when the id is not already present', () => {
    const gate: EjariSuiteProductionReleaseGate = {
      issueRef: '#2488',
      parentIssueRef: '#1924',
      checks: [],
    };

    const nextGate = withCheckResult(gate, { id: 'auditTrailIntegrity', status: 'passed' });

    expect(nextGate.checks).toHaveLength(1);
    expect(nextGate.checks[0]).toEqual({ id: 'auditTrailIntegrity', status: 'passed' });
  });
});

describe('summarizeGate', () => {
  it('reports "not-ready" when at least one check is still pending', () => {
    const gate = createInitialGateState('#2488', '#1924');
    const summary = summarizeGate(gate);

    expect(summary.status).toBe('not-ready');
    expect(summary.pendingChecks).toBe(EJARI_RELEASE_CHECK_IDS.length);
    expect(summary.blockingCheckIds).toEqual([]);
  });

  it('reports "blocked" and lists blocking checks when a check has failed', () => {
    let gate = createInitialGateState('#2488', '#1924');
    for (const id of EJARI_RELEASE_CHECK_IDS) {
      gate = withCheckResult(gate, { id, status: 'passed' });
    }
    gate = withCheckResult(gate, {
      id: 'signatureWorkflowVerification',
      status: 'failed',
      detail: 'Signature provider sandbox timed out',
    });

    const summary = summarizeGate(gate);

    expect(summary.status).toBe('blocked');
    expect(summary.failedChecks).toBe(1);
    expect(summary.blockingCheckIds).toEqual(['signatureWorkflowVerification']);
  });

  it('reports "ready" when every check has passed or been skipped', () => {
    let gate = createInitialGateState('#2488', '#1924');
    for (const id of EJARI_RELEASE_CHECK_IDS) {
      gate = withCheckResult(
        gate,
        id === 'rollbackPlanRecorded'
          ? { id, status: 'skipped', detail: 'Not applicable for this release' }
          : { id, status: 'passed' }
      );
    }

    const summary = summarizeGate(gate);

    expect(summary.status).toBe('ready');
    expect(summary.failedChecks).toBe(0);
    expect(summary.pendingChecks).toBe(0);
    expect(summary.skippedChecks).toBe(1);
    expect(summary.passedChecks).toBe(EJARI_RELEASE_CHECK_IDS.length - 1);
  });
});

describe('isGateReadyForRelease', () => {
  it('returns false for a freshly created gate', () => {
    const gate = createInitialGateState('#2488', '#1924');
    expect(isGateReadyForRelease(gate)).toBe(false);
  });

  it('returns true once all checks have passed', () => {
    let gate = createInitialGateState('#2488', '#1924');
    for (const id of EJARI_RELEASE_CHECK_IDS) {
      gate = withCheckResult(gate, { id, status: 'passed' });
    }

    expect(isGateReadyForRelease(gate)).toBe(true);
  });

  it('returns false when any check has failed even if others passed', () => {
    let gate = createInitialGateState('#2488', '#1924');
    for (const id of EJARI_RELEASE_CHECK_IDS) {
      gate = withCheckResult(gate, { id, status: 'passed' });
    }
    gate = withCheckResult(gate, {
      id: 'auditTrailIntegrity',
      status: 'failed',
      detail: 'Missing audit log entries for renewal flow',
    });

    expect(isGateReadyForRelease(gate)).toBe(false);
  });
});

describe('validateGateStructure', () => {
  it('returns no errors for a well-formed complete gate', () => {
    let gate = createInitialGateState('#2488', '#1924');
    for (const id of EJARI_RELEASE_CHECK_IDS) {
      gate = withCheckResult(gate, { id, status: 'passed' });
    }

    expect(validateGateStructure(gate)).toEqual([]);
  });

  it('reports missing required checks', () => {
    const gate: EjariSuiteProductionReleaseGate = {
      issueRef: '#2488',
      parentIssueRef: '#1924',
      checks: [{ id: 'schemaValidation', status: 'passed' }],
    };

    const errors = validateGateStructure(gate);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(message => message.includes('documentGenerationSmokeTest'))).toBe(true);
  });

  it('reports duplicate check ids', () => {
    const gate: EjariSuiteProductionReleaseGate = {
      issueRef: '#2488',
      parentIssueRef: '#1924',
      checks: [
        { id: 'schemaValidation', status: 'passed' },
        { id: 'schemaValidation', status: 'passed' },
        ...EJARI_RELEASE_CHECK_IDS.filter(id => id !== 'schemaValidation').map(id => ({
          id,
          status: 'passed' as const,
        })),
      ],
    };

    const errors = validateGateStructure(gate);

    expect(errors.some(message => message.includes('Duplicate check id: schemaValidation'))).toBe(
      true
    );
  });

  it('requires a detail message when a check has failed or been skipped', () => {
    let gate = createInitialGateState('#2488', '#1924');
    for (const id of EJARI_RELEASE_CHECK_IDS) {
      gate = withCheckResult(gate, { id, status: 'passed' });
    }
    gate = withCheckResult(gate, { id: 'rollbackPlanRecorded', status: 'failed' });

    const errors = validateGateStructure(gate);

    expect(
      errors.some(
        message =>
          message.includes('rollbackPlanRecorded') && message.includes('requires a detail message')
      )
    ).toBe(true);
  });
});
