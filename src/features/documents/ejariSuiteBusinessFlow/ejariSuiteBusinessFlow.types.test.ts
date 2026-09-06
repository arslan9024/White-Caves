import { describe, expect, it } from 'vitest';
import {
  EJARI_MANDATORY_DOCUMENT_TYPES,
  EJARI_STAGE_ORDER,
  EjariDocumentType,
  EjariSuiteStage,
  areAllEjariDocumentsSubmitted,
  areAllEjariDocumentsVerified,
  calculateEjariDocumentCompletion,
  canTransitionEjariStage,
  createInitialEjariSuiteState,
  getEjariStageProgressIndex,
  getNextEjariStages,
  isTerminalEjariStage,
  markEjariDocumentSubmitted,
  transitionEjariSuiteStage,
} from './ejariSuiteBusinessFlow.types';

describe('createInitialEjariSuiteState', () => {
  it('starts in Draft stage with all mandatory documents unsubmitted', () => {
    const state = createInitialEjariSuiteState({
      id: 'suite-1',
      propertyId: 'prop-1',
      tenantId: 'tenant-1',
      landlordId: 'landlord-1',
      now: '2024-01-01T00:00:00.000Z',
    });

    expect(state.stage).toBe(EjariSuiteStage.Draft);
    expect(state.requiredDocuments).toHaveLength(EJARI_MANDATORY_DOCUMENT_TYPES.length);
    expect(state.requiredDocuments.every(doc => !doc.isSubmitted)).toBe(true);
    expect(state.history).toHaveLength(0);
    expect(state.createdAt).toBe('2024-01-01T00:00:00.000Z');
  });
});

describe('canTransitionEjariStage / getNextEjariStages', () => {
  it('allows Draft -> DocumentsCollected', () => {
    expect(canTransitionEjariStage(EjariSuiteStage.Draft, EjariSuiteStage.DocumentsCollected)).toBe(
      true
    );
  });

  it('disallows Draft -> Registered (skipping stages)', () => {
    expect(canTransitionEjariStage(EjariSuiteStage.Draft, EjariSuiteStage.Registered)).toBe(false);
  });

  it('disallows any transition out of a terminal stage', () => {
    expect(getNextEjariStages(EjariSuiteStage.Registered)).toHaveLength(0);
    expect(getNextEjariStages(EjariSuiteStage.Cancelled)).toHaveLength(0);
  });

  it('allows Rejected -> Draft as a resubmission path', () => {
    expect(canTransitionEjariStage(EjariSuiteStage.Rejected, EjariSuiteStage.Draft)).toBe(true);
  });
});

describe('isTerminalEjariStage', () => {
  it('identifies Registered, Rejected and Cancelled as terminal', () => {
    expect(isTerminalEjariStage(EjariSuiteStage.Registered)).toBe(true);
    expect(isTerminalEjariStage(EjariSuiteStage.Rejected)).toBe(true);
    expect(isTerminalEjariStage(EjariSuiteStage.Cancelled)).toBe(true);
  });

  it('identifies in-progress stages as non-terminal', () => {
    expect(isTerminalEjariStage(EjariSuiteStage.Draft)).toBe(false);
    expect(isTerminalEjariStage(EjariSuiteStage.UnderReview)).toBe(false);
  });
});

describe('transitionEjariSuiteStage', () => {
  const initial = createInitialEjariSuiteState({
    id: 'suite-2',
    propertyId: 'prop-2',
    tenantId: 'tenant-2',
    landlordId: 'landlord-2',
    now: '2024-01-01T00:00:00.000Z',
  });

  it('successfully transitions on a valid path and records history', () => {
    const result = transitionEjariSuiteStage(
      initial,
      EjariSuiteStage.DocumentsCollected,
      'user-1',
      { now: '2024-01-02T00:00:00.000Z', note: 'docs uploaded' }
    );

    expect(result.success).toBe(true);
    expect(result.state.stage).toBe(EjariSuiteStage.DocumentsCollected);
    expect(result.state.history).toHaveLength(1);
    expect(result.state.history[0]).toEqual({
      fromStage: EjariSuiteStage.Draft,
      toStage: EjariSuiteStage.DocumentsCollected,
      changedAt: '2024-01-02T00:00:00.000Z',
      changedBy: 'user-1',
      note: 'docs uploaded',
    });
    expect(result.state.updatedAt).toBe('2024-01-02T00:00:00.000Z');
    // Original state must remain untouched (immutability).
    expect(initial.stage).toBe(EjariSuiteStage.Draft);
    expect(initial.history).toHaveLength(0);
  });

  it('rejects an invalid transition and preserves the original state', () => {
    const result = transitionEjariSuiteStage(initial, EjariSuiteStage.Registered, 'user-1');

    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid Ejari suite transition');
    expect(result.state).toBe(initial);
  });
});

describe('document submission and completion helpers', () => {
  const initial = createInitialEjariSuiteState({
    id: 'suite-3',
    propertyId: 'prop-3',
    tenantId: 'tenant-3',
    landlordId: 'landlord-3',
  });

  it('reports zero completion when nothing is submitted', () => {
    expect(areAllEjariDocumentsSubmitted(initial.requiredDocuments)).toBe(false);
    expect(calculateEjariDocumentCompletion(initial.requiredDocuments)).toBe(0);
  });

  it('marks a document submitted without mutating the source array', () => {
    const updated = markEjariDocumentSubmitted(
      initial.requiredDocuments,
      EjariDocumentType.TenancyContract,
      'https://files.example.com/contract.pdf',
      '2024-02-01T00:00:00.000Z'
    );

    const tenancyDoc = updated.find(doc => doc.documentType === EjariDocumentType.TenancyContract);
    expect(tenancyDoc?.isSubmitted).toBe(true);
    expect(tenancyDoc?.fileUrl).toBe('https://files.example.com/contract.pdf');
    expect(tenancyDoc?.uploadedAt).toBe('2024-02-01T00:00:00.000Z');

    // Original array is unchanged.
    expect(
      initial.requiredDocuments.find(doc => doc.documentType === EjariDocumentType.TenancyContract)
        ?.isSubmitted
    ).toBe(false);

    const completion = calculateEjariDocumentCompletion(updated);
    expect(completion).toBe(Math.round((1 / EJARI_MANDATORY_DOCUMENT_TYPES.length) * 100));
  });

  it('requires both submission and verification for full completeness', () => {
    const submittedOnly = initial.requiredDocuments.map(doc => ({
      ...doc,
      isSubmitted: true,
      isVerified: false,
    }));
    expect(areAllEjariDocumentsSubmitted(submittedOnly)).toBe(true);
    expect(areAllEjariDocumentsVerified(submittedOnly)).toBe(false);

    const fullyVerified = submittedOnly.map(doc => ({
      ...doc,
      isVerified: true,
    }));
    expect(areAllEjariDocumentsVerified(fullyVerified)).toBe(true);
  });

  it('returns 0 completion for an empty document list', () => {
    expect(calculateEjariDocumentCompletion([])).toBe(0);
  });
});

describe('getEjariStageProgressIndex', () => {
  it('returns increasing indices along the canonical stage order', () => {
    const draftIndex = getEjariStageProgressIndex(EjariSuiteStage.Draft);
    const reviewIndex = getEjariStageProgressIndex(EjariSuiteStage.UnderReview);
    const registeredIndex = getEjariStageProgressIndex(EjariSuiteStage.Registered);

    expect(draftIndex).toBe(0);
    expect(reviewIndex).toBeGreaterThan(draftIndex);
    expect(registeredIndex).toBeGreaterThan(reviewIndex);
    expect(registeredIndex).toBe(EJARI_STAGE_ORDER.length - 1);
  });

  it('returns -1 for a stage not tracked in the canonical order', () => {
    expect(getEjariStageProgressIndex(EjariSuiteStage.Rejected)).toBe(-1);
    expect(getEjariStageProgressIndex(EjariSuiteStage.Cancelled)).toBe(-1);
  });
});
