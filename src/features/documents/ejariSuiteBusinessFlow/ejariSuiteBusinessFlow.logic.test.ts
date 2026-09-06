import { describe, expect, it } from 'vitest';
import {
  canTransition,
  createEjariCase,
  getMissingDocuments,
  IncompleteEjariBundleError,
  InvalidEjariTransitionError,
  isTerminalStage,
  TerminalEjariCaseError,
  transitionEjariCase,
  type EjariDocumentBundle,
  type EjariFlowStage,
} from './ejariSuiteBusinessFlow.logic';

const completeBundle: EjariDocumentBundle = {
  emiratesId: true,
  passport: true,
  titleDeed: true,
  tenancyContractDraft: true,
};

const incompleteBundle: EjariDocumentBundle = {
  emiratesId: true,
  passport: false,
  titleDeed: false,
  tenancyContractDraft: true,
};

const fixedNow = (): string => '2024-01-01T00:00:00.000Z';

describe('createEjariCase', () => {
  it('always starts at draft regardless of bundle completeness (complete bundle)', () => {
    const created = createEjariCase(completeBundle, 'case-1');
    expect(created.stage).toBe('draft');
    expect(created.id).toBe('case-1');
    expect(created.history).toEqual([]);
  });

  it('always starts at draft regardless of bundle completeness (incomplete bundle)', () => {
    const created = createEjariCase(incompleteBundle, 'case-2');
    expect(created.stage).toBe('draft');
    expect(created.bundle).toEqual(incompleteBundle);
  });

  it('generates an id when none is supplied', () => {
    const created = createEjariCase(completeBundle);
    expect(typeof created.id).toBe('string');
    expect(created.id.length).toBeGreaterThan(0);
  });
});

describe('canTransition / valid transition table', () => {
  const validPairs: ReadonlyArray<[EjariFlowStage, EjariFlowStage]> = [
    ['draft', 'documents_pending'],
    ['draft', 'cancelled'],
    ['documents_pending', 'documents_verified'],
    ['documents_pending', 'cancelled'],
    ['documents_verified', 'submitted_to_ejari'],
    ['documents_verified', 'cancelled'],
    ['submitted_to_ejari', 'ejari_approved'],
    ['submitted_to_ejari', 'ejari_rejected'],
    ['submitted_to_ejari', 'cancelled'],
    ['ejari_approved', 'completed'],
    ['ejari_approved', 'cancelled'],
    ['ejari_rejected', 'documents_pending'],
    ['ejari_rejected', 'cancelled'],
  ];

  it.each(validPairs)('allows %s -> %s', (from, to) => {
    expect(canTransition(from, to)).toBe(true);
  });

  it('rejects an illegal jump such as draft -> completed', () => {
    expect(canTransition('draft', 'completed')).toBe(false);
  });

  it('rejects transitions out of terminal stages', () => {
    expect(canTransition('completed', 'draft')).toBe(false);
    expect(canTransition('cancelled', 'draft')).toBe(false);
  });
});

describe('isTerminalStage', () => {
  it('returns true only for completed and cancelled', () => {
    expect(isTerminalStage('completed')).toBe(true);
    expect(isTerminalStage('cancelled')).toBe(true);
    expect(isTerminalStage('draft')).toBe(false);
    expect(isTerminalStage('documents_pending')).toBe(false);
    expect(isTerminalStage('documents_verified')).toBe(false);
    expect(isTerminalStage('submitted_to_ejari')).toBe(false);
    expect(isTerminalStage('ejari_approved')).toBe(false);
    expect(isTerminalStage('ejari_rejected')).toBe(false);
  });
});

describe('getMissingDocuments', () => {
  it('returns an empty list for a complete bundle', () => {
    expect(getMissingDocuments(completeBundle)).toEqual([]);
  });

  it('lists the specific missing document keys', () => {
    expect(getMissingDocuments(incompleteBundle)).toEqual(['passport', 'titleDeed']);
  });
});

describe('transitionEjariCase — valid transitions', () => {
  it('succeeds for each valid transition and appends exactly one history entry', () => {
    let current = createEjariCase(completeBundle, 'case-flow');
    expect(current.history).toHaveLength(0);

    current = transitionEjariCase(current, 'documents_pending', 'agent-1', fixedNow);
    expect(current.stage).toBe('documents_pending');
    expect(current.history).toHaveLength(1);
    expect(current.history[0]).toEqual({
      fromStage: 'draft',
      toStage: 'documents_pending',
      actor: 'agent-1',
      timestamp: '2024-01-01T00:00:00.000Z',
    });

    current = transitionEjariCase(current, 'documents_verified', 'agent-1', fixedNow);
    expect(current.stage).toBe('documents_verified');
    expect(current.history).toHaveLength(2);

    current = transitionEjariCase(current, 'submitted_to_ejari', 'agent-2', fixedNow);
    expect(current.stage).toBe('submitted_to_ejari');
    expect(current.history).toHaveLength(3);

    current = transitionEjariCase(current, 'ejari_approved', 'ejari-system', fixedNow);
    expect(current.stage).toBe('ejari_approved');
    expect(current.history).toHaveLength(4);

    current = transitionEjariCase(current, 'completed', 'agent-2', fixedNow);
    expect(current.stage).toBe('completed');
    expect(current.history).toHaveLength(5);
  });

  it('does not mutate the input case or its history array', () => {
    const original = createEjariCase(completeBundle, 'case-immutable');
    const historyRefBefore = original.history;

    const next = transitionEjariCase(original, 'documents_pending', 'agent-1', fixedNow);

    expect(original.stage).toBe('draft');
    expect(original.history).toBe(historyRefBefore);
    expect(original.history).toHaveLength(0);
    expect(next).not.toBe(original);
    expect(next.history).not.toBe(original.history);
  });

  it('routes ejari_rejected retries back to documents_pending, never draft', () => {
    let current = createEjariCase(completeBundle, 'case-retry');
    current = transitionEjariCase(current, 'documents_pending', 'agent-1', fixedNow);
    current = transitionEjariCase(current, 'documents_verified', 'agent-1', fixedNow);
    current = transitionEjariCase(current, 'submitted_to_ejari', 'agent-1', fixedNow);
    current = transitionEjariCase(current, 'ejari_rejected', 'ejari-system', fixedNow);
    expect(current.stage).toBe('ejari_rejected');

    const retried = transitionEjariCase(current, 'documents_pending', 'agent-1', fixedNow);
    expect(retried.stage).toBe('documents_pending');
    expect(retried.stage).not.toBe('draft');
  });
});

describe('transitionEjariCase — error paths', () => {
  it('throws InvalidEjariTransitionError for an illegal transition (draft -> completed)', () => {
    const current = createEjariCase(completeBundle, 'case-invalid');
    expect(() => transitionEjariCase(current, 'completed', 'agent-1', fixedNow)).toThrow(
      InvalidEjariTransitionError
    );
    expect(() => transitionEjariCase(current, 'completed', 'agent-1', fixedNow)).toThrow(
      'Invalid Ejari transition from "draft" to "completed"'
    );
  });

  it('throws IncompleteEjariBundleError listing missing documents when verifying an incomplete bundle', () => {
    let current = createEjariCase(incompleteBundle, 'case-incomplete');
    current = transitionEjariCase(current, 'documents_pending', 'agent-1', fixedNow);

    expect(() => transitionEjariCase(current, 'documents_verified', 'agent-1', fixedNow)).toThrow(
      IncompleteEjariBundleError
    );
    try {
      transitionEjariCase(current, 'documents_verified', 'agent-1', fixedNow);
      throw new Error('expected transitionEjariCase to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(IncompleteEjariBundleError);
      expect((error as IncompleteEjariBundleError).message).toContain('passport');
      expect((error as IncompleteEjariBundleError).message).toContain('titleDeed');
      expect((error as IncompleteEjariBundleError).missing).toEqual(['passport', 'titleDeed']);
    }
  });

  it('throws TerminalEjariCaseError when transitioning from a completed case', () => {
    let current = createEjariCase(completeBundle, 'case-terminal-completed');
    current = transitionEjariCase(current, 'documents_pending', 'agent-1', fixedNow);
    current = transitionEjariCase(current, 'documents_verified', 'agent-1', fixedNow);
    current = transitionEjariCase(current, 'submitted_to_ejari', 'agent-1', fixedNow);
    current = transitionEjariCase(current, 'ejari_approved', 'agent-1', fixedNow);
    current = transitionEjariCase(current, 'completed', 'agent-1', fixedNow);

    expect(() => transitionEjariCase(current, 'cancelled', 'agent-1', fixedNow)).toThrow(
      TerminalEjariCaseError
    );
  });

  it('throws TerminalEjariCaseError when transitioning from a cancelled case', () => {
    let current = createEjariCase(completeBundle, 'case-terminal-cancelled');
    current = transitionEjariCase(current, 'cancelled', 'agent-1', fixedNow);

    expect(() => transitionEjariCase(current, 'documents_pending', 'agent-1', fixedNow)).toThrow(
      TerminalEjariCaseError
    );
    expect(() => transitionEjariCase(current, 'documents_pending', 'agent-1', fixedNow)).toThrow(
      'Case is already in terminal stage "cancelled"'
    );
  });
});
