/**
 * Ejari Suite Business Flow — types and pure helpers.
 *
 * Models the lifecycle of an Ejari (Dubai tenancy contract registration)
 * document suite: the set of documents a landlord/tenant must submit,
 * the stage the submission is currently in, and the valid transitions
 * between stages.
 *
 * Parent issue: #1922
 * Child issue: #2498
 */

/** Ordered lifecycle stages of an Ejari suite submission. */
export enum EjariSuiteStage {
  Draft = 'DRAFT',
  DocumentsCollected = 'DOCUMENTS_COLLECTED',
  SubmittedToEjari = 'SUBMITTED_TO_EJARI',
  UnderReview = 'UNDER_REVIEW',
  Approved = 'APPROVED',
  Registered = 'REGISTERED',
  Rejected = 'REJECTED',
  Cancelled = 'CANCELLED',
}

/** Document types that can be required as part of an Ejari suite. */
export enum EjariDocumentType {
  TenancyContract = 'TENANCY_CONTRACT',
  EmiratesIdTenant = 'EMIRATES_ID_TENANT',
  EmiratesIdLandlord = 'EMIRATES_ID_LANDLORD',
  PassportCopy = 'PASSPORT_COPY',
  TitleDeed = 'TITLE_DEED',
  TradeLicense = 'TRADE_LICENSE',
  PowerOfAttorney = 'POWER_OF_ATTORNEY',
  NoObjectionCertificate = 'NO_OBJECTION_CERTIFICATE',
  DewaBill = 'DEWA_BILL',
}

/** A single required document tracked within the suite. */
export interface EjariRequiredDocument {
  readonly documentType: EjariDocumentType;
  readonly isSubmitted: boolean;
  readonly isVerified: boolean;
  readonly fileUrl?: string;
  readonly uploadedAt?: string;
  readonly verifiedAt?: string;
  readonly rejectionNote?: string;
}

/** A single audit entry describing a stage transition. */
export interface EjariSuiteHistoryEntry {
  readonly fromStage: EjariSuiteStage;
  readonly toStage: EjariSuiteStage;
  readonly changedAt: string;
  readonly changedBy: string;
  readonly note?: string;
}

/** Full state of an Ejari suite business flow instance. */
export interface EjariSuiteBusinessFlowState {
  readonly id: string;
  readonly propertyId: string;
  readonly tenantId: string;
  readonly landlordId: string;
  readonly stage: EjariSuiteStage;
  readonly requiredDocuments: readonly EjariRequiredDocument[];
  readonly ejariNumber?: string;
  readonly rejectionReason?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly history: readonly EjariSuiteHistoryEntry[];
}

/** Result of a stage-transition attempt. */
export interface EjariSuiteTransitionResult {
  readonly success: boolean;
  readonly state: EjariSuiteBusinessFlowState;
  readonly error?: string;
}

/** Canonical ordering of non-terminal-branching stages (for display/progress). */
export const EJARI_STAGE_ORDER: readonly EjariSuiteStage[] = [
  EjariSuiteStage.Draft,
  EjariSuiteStage.DocumentsCollected,
  EjariSuiteStage.SubmittedToEjari,
  EjariSuiteStage.UnderReview,
  EjariSuiteStage.Approved,
  EjariSuiteStage.Registered,
];

/** Stages from which no further transition is allowed. */
export const EJARI_TERMINAL_STAGES: ReadonlySet<EjariSuiteStage> = new Set([
  EjariSuiteStage.Registered,
  EjariSuiteStage.Rejected,
  EjariSuiteStage.Cancelled,
]);

/** Map of valid forward transitions for each stage. */
export const EJARI_VALID_TRANSITIONS: Readonly<
  Record<EjariSuiteStage, readonly EjariSuiteStage[]>
> = {
  [EjariSuiteStage.Draft]: [EjariSuiteStage.DocumentsCollected, EjariSuiteStage.Cancelled],
  [EjariSuiteStage.DocumentsCollected]: [
    EjariSuiteStage.SubmittedToEjari,
    EjariSuiteStage.Draft,
    EjariSuiteStage.Cancelled,
  ],
  [EjariSuiteStage.SubmittedToEjari]: [EjariSuiteStage.UnderReview, EjariSuiteStage.Cancelled],
  [EjariSuiteStage.UnderReview]: [EjariSuiteStage.Approved, EjariSuiteStage.Rejected],
  [EjariSuiteStage.Approved]: [EjariSuiteStage.Registered, EjariSuiteStage.Rejected],
  [EjariSuiteStage.Registered]: [],
  [EjariSuiteStage.Rejected]: [EjariSuiteStage.Draft],
  [EjariSuiteStage.Cancelled]: [],
};

/** The set of document types required for every Ejari suite submission. */
export const EJARI_MANDATORY_DOCUMENT_TYPES: readonly EjariDocumentType[] = [
  EjariDocumentType.TenancyContract,
  EjariDocumentType.EmiratesIdTenant,
  EjariDocumentType.EmiratesIdLandlord,
  EjariDocumentType.DewaBill,
];

/** Returns true if the given stage is a terminal (non-transitionable) stage. */
export function isTerminalEjariStage(stage: EjariSuiteStage): boolean {
  return EJARI_TERMINAL_STAGES.has(stage);
}

/** Returns the list of stages reachable directly from the given stage. */
export function getNextEjariStages(stage: EjariSuiteStage): readonly EjariSuiteStage[] {
  return EJARI_VALID_TRANSITIONS[stage] ?? [];
}

/** Returns true if transitioning from `from` to `to` is a valid, declared transition. */
export function canTransitionEjariStage(from: EjariSuiteStage, to: EjariSuiteStage): boolean {
  return getNextEjariStages(from).includes(to);
}

/**
 * Creates a fresh Ejari suite state in the Draft stage with the mandatory
 * documents pre-populated as not-yet-submitted.
 */
export function createInitialEjariSuiteState(params: {
  readonly id: string;
  readonly propertyId: string;
  readonly tenantId: string;
  readonly landlordId: string;
  readonly now?: string;
}): EjariSuiteBusinessFlowState {
  const now = params.now ?? new Date().toISOString();
  return {
    id: params.id,
    propertyId: params.propertyId,
    tenantId: params.tenantId,
    landlordId: params.landlordId,
    stage: EjariSuiteStage.Draft,
    requiredDocuments: EJARI_MANDATORY_DOCUMENT_TYPES.map(documentType => ({
      documentType,
      isSubmitted: false,
      isVerified: false,
    })),
    createdAt: now,
    updatedAt: now,
    history: [],
  };
}

/**
 * Attempts to transition the given state to a new stage, validating the
 * transition against EJARI_VALID_TRANSITIONS and appending a history entry
 * on success. Returns a result object rather than throwing, so callers can
 * handle invalid transitions gracefully.
 */
export function transitionEjariSuiteStage(
  state: EjariSuiteBusinessFlowState,
  toStage: EjariSuiteStage,
  changedBy: string,
  options?: { readonly note?: string; readonly now?: string }
): EjariSuiteTransitionResult {
  if (!canTransitionEjariStage(state.stage, toStage)) {
    return {
      success: false,
      state,
      error: `Invalid Ejari suite transition from ${state.stage} to ${toStage}`,
    };
  }

  const now = options?.now ?? new Date().toISOString();
  const historyEntry: EjariSuiteHistoryEntry = {
    fromStage: state.stage,
    toStage,
    changedAt: now,
    changedBy,
    note: options?.note,
  };

  return {
    success: true,
    state: {
      ...state,
      stage: toStage,
      updatedAt: now,
      history: [...state.history, historyEntry],
    },
  };
}

/** Returns true if every mandatory document has been submitted. */
export function areAllEjariDocumentsSubmitted(
  requiredDocuments: readonly EjariRequiredDocument[]
): boolean {
  return requiredDocuments.every(doc => doc.isSubmitted);
}

/** Returns true if every mandatory document has been submitted and verified. */
export function areAllEjariDocumentsVerified(
  requiredDocuments: readonly EjariRequiredDocument[]
): boolean {
  return requiredDocuments.every(doc => doc.isSubmitted && doc.isVerified);
}

/**
 * Computes the completion percentage (0-100, rounded) of the required
 * document set based on how many are submitted. Returns 0 for an empty list.
 */
export function calculateEjariDocumentCompletion(
  requiredDocuments: readonly EjariRequiredDocument[]
): number {
  if (requiredDocuments.length === 0) {
    return 0;
  }
  const submittedCount = requiredDocuments.filter(doc => doc.isSubmitted).length;
  return Math.round((submittedCount / requiredDocuments.length) * 100);
}

/**
 * Returns a new required-documents array with the given document type marked
 * as submitted (and optionally carrying a file URL / upload timestamp).
 * Non-mutating: the original array is left untouched.
 */
export function markEjariDocumentSubmitted(
  requiredDocuments: readonly EjariRequiredDocument[],
  documentType: EjariDocumentType,
  fileUrl: string,
  uploadedAt?: string
): readonly EjariRequiredDocument[] {
  return requiredDocuments.map(doc =>
    doc.documentType === documentType
      ? {
          ...doc,
          isSubmitted: true,
          fileUrl,
          uploadedAt: uploadedAt ?? new Date().toISOString(),
        }
      : doc
  );
}

/** Returns the zero-based index of a stage within the canonical progress order, or -1 if not tracked. */
export function getEjariStageProgressIndex(stage: EjariSuiteStage): number {
  return EJARI_STAGE_ORDER.indexOf(stage);
}
