import { describe, expect, it } from 'vitest';

import {
  deriveEjariSuiteStatus,
  isEjariDocumentStage,
  isEjariE2eStep,
  isEjariStepStatus,
  summarizeEjariSteps,
  type EjariE2eStep,
  type EjariE2eSummary,
} from './ejariSuitePlaywrightE2e.types';

const makeStep = (overrides: Partial<EjariE2eStep> = {}): EjariE2eStep => ({
  id: 'step-1',
  description: 'Uploads the Ejari document',
  stage: 'upload',
  status: 'passed',
  durationMs: 120,
  ...overrides,
});

describe('isEjariDocumentStage', () => {
  it('accepts every documented stage value', () => {
    expect(isEjariDocumentStage('upload')).toBe(true);
    expect(isEjariDocumentStage('validation')).toBe(true);
    expect(isEjariDocumentStage('submission')).toBe(true);
    expect(isEjariDocumentStage('statusTracking')).toBe(true);
    expect(isEjariDocumentStage('completion')).toBe(true);
  });

  it('rejects unknown or non-string values', () => {
    expect(isEjariDocumentStage('archived')).toBe(false);
    expect(isEjariDocumentStage(42)).toBe(false);
    expect(isEjariDocumentStage(undefined)).toBe(false);
  });
});

describe('isEjariStepStatus', () => {
  it('accepts every documented status value', () => {
    expect(isEjariStepStatus('passed')).toBe(true);
    expect(isEjariStepStatus('failed')).toBe(true);
    expect(isEjariStepStatus('skipped')).toBe(true);
    expect(isEjariStepStatus('pending')).toBe(true);
  });

  it('rejects unknown values', () => {
    expect(isEjariStepStatus('running')).toBe(false);
    expect(isEjariStepStatus(null)).toBe(false);
  });
});

describe('isEjariE2eStep', () => {
  it('validates a well-formed step object', () => {
    expect(isEjariE2eStep(makeStep())).toBe(true);
  });

  it('validates a step carrying an optional errorMessage', () => {
    expect(isEjariE2eStep(makeStep({ status: 'failed', errorMessage: 'timeout' }))).toBe(true);
  });

  it('rejects objects missing required fields', () => {
    const { id: _id, ...withoutId } = makeStep();
    expect(isEjariE2eStep(withoutId)).toBe(false);
  });

  it('rejects objects with an invalid stage', () => {
    expect(isEjariE2eStep({ ...makeStep(), stage: 'not-a-stage' })).toBe(false);
  });

  it('rejects non-object values', () => {
    expect(isEjariE2eStep(null)).toBe(false);
    expect(isEjariE2eStep('step')).toBe(false);
    expect(isEjariE2eStep(42)).toBe(false);
  });
});

describe('summarizeEjariSteps', () => {
  it('counts each status bucket correctly', () => {
    const steps: readonly EjariE2eStep[] = [
      makeStep({ id: 's1', status: 'passed' }),
      makeStep({ id: 's2', status: 'passed' }),
      makeStep({ id: 's3', status: 'failed' }),
      makeStep({ id: 's4', status: 'skipped' }),
      makeStep({ id: 's5', status: 'pending' }),
    ];

    expect(summarizeEjariSteps(steps)).toEqual({
      total: 5,
      passed: 2,
      failed: 1,
      skipped: 1,
      pending: 1,
    });
  });

  it('returns an all-zero summary for an empty step list', () => {
    expect(summarizeEjariSteps([])).toEqual({
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      pending: 0,
    });
  });
});

describe('deriveEjariSuiteStatus', () => {
  it('marks the suite failed when any step failed', () => {
    const summary: EjariE2eSummary = { total: 3, passed: 1, failed: 1, skipped: 1, pending: 0 };
    expect(deriveEjariSuiteStatus(summary)).toBe('failed');
  });

  it('marks the suite skipped when nothing failed or passed but some skipped', () => {
    const summary: EjariE2eSummary = { total: 2, passed: 0, failed: 0, skipped: 2, pending: 0 };
    expect(deriveEjariSuiteStatus(summary)).toBe('skipped');
  });

  it('marks the suite passed when there are passes and no failures', () => {
    const summary: EjariE2eSummary = { total: 3, passed: 2, failed: 0, skipped: 1, pending: 0 };
    expect(deriveEjariSuiteStatus(summary)).toBe('passed');
  });

  it('marks the suite passed when everything is zero (vacuous success)', () => {
    const summary: EjariE2eSummary = { total: 0, passed: 0, failed: 0, skipped: 0, pending: 0 };
    expect(deriveEjariSuiteStatus(summary)).toBe('passed');
  });
});
