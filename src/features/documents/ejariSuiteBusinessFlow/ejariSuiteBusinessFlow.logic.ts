/**
 * ejariSuiteBusinessFlow.logic.ts
 *
 * Pure, dependency-free state-machine core for the Ejari tenancy-contract
 * registration business flow.
 *
 * Implements the design captured in:
 *  - plans/implementation_handoffs/SRS-ISSUE-W55-EJARI-DOCS-1922.md
 *  - plans/implementation_handoffs/SDD-ISSUE-W55-EJARI-DOCS-1922.md
 *
 * Scope note: the SDD originally sketched a multi-file layout
 * (types.ts / stateMachine.ts / errors.ts / index.ts). This child issue
 * (#2496) consolidates that design into a single `.logic.ts` module to keep
 * the implementation cohesive and minimal while preserving every exported
 * symbol the SRS/SDD specify. No network, GitHub, or database calls are
 * performed anywhere in this module (NFR-3).
 */

/** All possible stages an Ejari case can be in. */
export type EjariFlowStage =
  | 'draft'
  | 'documents_pending'
  | 'documents_verified'
  | 'submitted_to_ejari'
  | 'ejari_approved'
  | 'ejari_rejected'
  | 'completed'
  | 'cancelled';

/** Flags describing which documents have been collected for a case. */
export interface EjariDocumentBundle {
  readonly emiratesId: boolean;
  readonly passport: boolean;
  readonly titleDeed: boolean;
  readonly tenancyContractDraft: boolean;
}

/** A single recorded stage transition in a case's history. */
export interface EjariFlowTransition {
  readonly fromStage: EjariFlowStage;
  readonly toStage: EjariFlowStage;
  readonly actor: string;
  readonly timestamp: string; // ISO-8601
}

/** The Ejari case entity: current stage, document bundle, and full history. */
export interface EjariCase {
  readonly id: string;
  readonly stage: EjariFlowStage;
  readonly bundle: EjariDocumentBundle;
  readonly history: ReadonlyArray<EjariFlowTransition>;
}

/** Thrown when a requested stage transition is not permitted by the transition table. */
export class InvalidEjariTransitionError extends Error {
  constructor(from: EjariFlowStage, to: EjariFlowStage) {
    super(`Invalid Ejari transition from "${from}" to "${to}"`);
    this.name = 'InvalidEjariTransitionError';
    Object.setPrototypeOf(this, InvalidEjariTransitionError.prototype);
  }
}

/** Thrown when transitioning into `documents_verified` with a missing required document. */
export class IncompleteEjariBundleError extends Error {
  public readonly missing: ReadonlyArray<string>;

  constructor(missing: ReadonlyArray<string>) {
    super(`Cannot verify documents; missing: ${missing.join(', ')}`);
    this.name = 'IncompleteEjariBundleError';
    this.missing = missing;
    Object.setPrototypeOf(this, IncompleteEjariBundleError.prototype);
  }
}

/** Thrown when any transition is requested from a case already in a terminal stage. */
export class TerminalEjariCaseError extends Error {
  constructor(stage: EjariFlowStage) {
    super(`Case is already in terminal stage "${stage}"`);
    this.name = 'TerminalEjariCaseError';
    Object.setPrototypeOf(this, TerminalEjariCaseError.prototype);
  }
}

/** Stages from which no further transitions are permitted. */
const TERMINAL_STAGES: ReadonlySet<EjariFlowStage> = new Set<EjariFlowStage>([
  'completed',
  'cancelled',
]);

/**
 * Single source of truth for legal stage transitions, per the SDD's
 * transition table (Section 5).
 */
const TRANSITION_TABLE: Readonly<Record<EjariFlowStage, ReadonlySet<EjariFlowStage>>> = {
  draft: new Set<EjariFlowStage>(['documents_pending', 'cancelled']),
  documents_pending: new Set<EjariFlowStage>(['documents_verified', 'cancelled']),
  documents_verified: new Set<EjariFlowStage>(['submitted_to_ejari', 'cancelled']),
  submitted_to_ejari: new Set<EjariFlowStage>(['ejari_approved', 'ejari_rejected', 'cancelled']),
  ejari_approved: new Set<EjariFlowStage>(['completed', 'cancelled']),
  ejari_rejected: new Set<EjariFlowStage>(['documents_pending', 'cancelled']),
  completed: new Set<EjariFlowStage>([]),
  cancelled: new Set<EjariFlowStage>([]),
};

/** Documents required before a case may enter `documents_verified`. */
const REQUIRED_DOCUMENT_KEYS: ReadonlyArray<keyof EjariDocumentBundle> = [
  'emiratesId',
  'passport',
  'titleDeed',
  'tenancyContractDraft',
];

/**
 * Returns `true` only when transitioning from `from` to `to` is permitted by
 * the transition table. Pure O(1) lookup, no side effects.
 */
export function canTransition(from: EjariFlowStage, to: EjariFlowStage): boolean {
  return TRANSITION_TABLE[from].has(to);
}

/** Returns `true` only for the two terminal stages: `completed` and `cancelled`. */
export function isTerminalStage(stage: EjariFlowStage): boolean {
  return TERMINAL_STAGES.has(stage);
}

/** Returns the list of required document keys missing from the given bundle. */
export function getMissingDocuments(bundle: EjariDocumentBundle): ReadonlyArray<string> {
  return REQUIRED_DOCUMENT_KEYS.filter(key => !bundle[key]);
}

/**
 * Generates a reasonably unique case id without pulling in an external
 * dependency. Prefers the platform `crypto.randomUUID` when available and
 * falls back to a timestamp + random suffix otherwise.
 */
function generateEjariCaseId(): string {
  const globalCrypto = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;
  if (globalCrypto && typeof globalCrypto.randomUUID === 'function') {
    return globalCrypto.randomUUID();
  }
  const randomSuffix = Math.random().toString(36).slice(2, 10);
  return `ejari-${Date.now().toString(36)}-${randomSuffix}`;
}

/**
 * Creates a brand new `EjariCase` at stage `draft`, regardless of whether the
 * supplied bundle is already complete (FR-2). An explicit `id` may be
 * supplied for deterministic testing; otherwise one is generated.
 */
export function createEjariCase(bundle: EjariDocumentBundle, id?: string): EjariCase {
  return {
    id: id ?? generateEjariCaseId(),
    stage: 'draft',
    bundle,
    history: [],
  };
}

/**
 * Attempts to transition `current` to `nextStage` on behalf of `actor`.
 * Returns a brand new `EjariCase` object; never mutates `current` or its
 * `history` array (NFR-2). Throws typed errors for illegal transitions,
 * terminal-stage transitions, and incomplete document bundles.
 *
 * `now` may be injected for deterministic testing; defaults to the current
 * time as an ISO-8601 string.
 */
export function transitionEjariCase(
  current: EjariCase,
  nextStage: EjariFlowStage,
  actor: string,
  now: () => string = () => new Date().toISOString()
): EjariCase {
  if (isTerminalStage(current.stage)) {
    throw new TerminalEjariCaseError(current.stage);
  }

  if (!canTransition(current.stage, nextStage)) {
    throw new InvalidEjariTransitionError(current.stage, nextStage);
  }

  if (nextStage === 'documents_verified') {
    const missing = getMissingDocuments(current.bundle);
    if (missing.length > 0) {
      throw new IncompleteEjariBundleError(missing);
    }
  }

  const transition: EjariFlowTransition = {
    fromStage: current.stage,
    toStage: nextStage,
    actor,
    timestamp: now(),
  };

  return {
    ...current,
    stage: nextStage,
    history: [...current.history, transition],
  };
}
