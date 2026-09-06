/**
 * Finance Engine — Intercompany Transfer (runtime implementation)
 *
 * Implements the capability specified in:
 * - plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-TRANSFER-1936.md
 * - plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-TRANSFER-1936.md
 *
 * Parent issue: #1936. This module fulfills FR-1 through FR-9 and NFR-1
 * through NFR-5 for the intercompany transfer capability: validating a
 * transfer request, posting an atomic debit/credit ledger pair, replaying
 * idempotent duplicate requests, and reversing a previously posted transfer.
 *
 * Money is represented as integer minor units end-to-end (NFR-2); no
 * floating point arithmetic is performed on monetary amounts.
 */

/** Allow-list of currencies supported by the intercompany transfer capability (FR-4). */
export const SUPPORTED_CURRENCIES = ['AED', 'USD', 'EUR', 'GBP'] as const;

/** A currency supported by this module. */
export type Currency = (typeof SUPPORTED_CURRENCIES)[number];

/**
 * Rejection reasons, in the fixed evaluation order mandated by SDD §3.1:
 * SAME_ENTITY -> NON_POSITIVE_AMOUNT -> UNSUPPORTED_CURRENCY -> UNKNOWN_ENTITY
 * -> INSUFFICIENT_AUTHORIZATION -> DUPLICATE_REQUEST_ID.
 */
export type RejectionReason =
  | 'SAME_ENTITY'
  | 'NON_POSITIVE_AMOUNT'
  | 'UNSUPPORTED_CURRENCY'
  | 'UNKNOWN_ENTITY'
  | 'INSUFFICIENT_AUTHORIZATION'
  | 'DUPLICATE_REQUEST_ID';

/** Direction of a single ledger entry. */
export type LedgerDirection = 'debit' | 'credit';

/** Request to move value between two entities (FR-1). */
export interface IntercompanyTransferRequest {
  /** Idempotency key. Duplicate submissions with the same requestId are safely no-op'd (FR-6). */
  readonly requestId: string;
  readonly sourceEntityId: string;
  readonly destinationEntityId: string;
  /** Integer minor units (e.g. fils, cents). Must be a positive integer (FR-3). */
  readonly amountMinorUnits: number;
  /** Raw currency code, validated against SUPPORTED_CURRENCIES at submission time (FR-4). */
  readonly currency: string;
  /** Identifier of the caller submitting the transfer, used for authorization checks (FR-9). */
  readonly requestedBy: string;
}

/** A single posted ledger entry. Entries are append-only and never mutated in place. */
export interface LedgerEntry {
  readonly id: string;
  readonly entityId: string;
  readonly direction: LedgerDirection;
  readonly amountMinorUnits: number;
  readonly currency: Currency;
  readonly requestId: string;
  readonly createdAt: string;
  /** Present only on entries created by reverseTransfer; references the original requestId. */
  readonly reversalOfRequestId?: string;
}

/** Successful transfer outcome: exactly two entries, sharing requestId (FR-7). */
export interface PostedTransferResult {
  readonly status: 'posted';
  readonly requestId: string;
  readonly debitEntry: LedgerEntry;
  readonly creditEntry: LedgerEntry;
}

/** Rejected transfer outcome, carrying a single deterministic rejection reason. */
export interface RejectedTransferResult {
  readonly status: 'rejected';
  readonly requestId: string;
  readonly reason: RejectionReason;
}

export type IntercompanyTransferResult = PostedTransferResult | RejectedTransferResult;

/** Outcome of reversing a previously posted transfer (FR-8). */
export interface ReversalResult {
  readonly status: 'reversed';
  readonly originalRequestId: string;
  readonly reversalRequestId: string;
  readonly debitEntry: LedgerEntry;
  readonly creditEntry: LedgerEntry;
}

/** Read-only lookup of registered entities (FR-5). */
export interface EntityDirectory {
  hasEntity(entityId: string): boolean;
}

/** Authorization check for the caller against the source entity (FR-9). */
export interface AuthorizationChecker {
  isAuthorizedForSourceEntity(requestedBy: string, sourceEntityId: string): boolean;
}

/**
 * Pluggable idempotency store (SDD §3.2). Deliberately storage-agnostic so this
 * module introduces no new persistence dependency (NFR-5).
 */
export interface IdempotencyStore {
  get(requestId: string): IntercompanyTransferResult | undefined;
  put(requestId: string, result: IntercompanyTransferResult): void;
}

/** Input to LedgerPoster.post: an entry without generated id/createdAt. */
export type LedgerEntryDraft = Omit<LedgerEntry, 'id' | 'createdAt'>;

/**
 * Pluggable ledger poster. Posting is modeled as a single atomic operation
 * returning both entries or throwing (SDD §3.3, NFR-4) — a caller can never
 * observe only one half of a debit/credit pair.
 */
export interface LedgerPoster {
  post(
    debit: LedgerEntryDraft,
    credit: LedgerEntryDraft
  ): { debitEntry: LedgerEntry; creditEntry: LedgerEntry };
  getEntriesByRequestId(requestId: string): readonly LedgerEntry[];
}

/** Generates unique identifiers for ledger entries. */
export interface IdGenerator {
  next(): string;
}

/** Supplies the current timestamp, injectable for deterministic testing. */
export interface Clock {
  now(): string;
}

function isSupportedCurrency(currency: string): currency is Currency {
  return (SUPPORTED_CURRENCIES as readonly string[]).includes(currency);
}

/**
 * Determines the single deterministic rejection reason for a request, or
 * null if the request passes all structural and authorization checks. Does
 * NOT perform the idempotency check (DUPLICATE_REQUEST_ID), which is only
 * meaningful once the request is otherwise well-formed (SDD §3.1).
 */
function validateStructural(
  request: IntercompanyTransferRequest,
  entityDirectory: EntityDirectory,
  authorizationChecker: AuthorizationChecker
): RejectionReason | null {
  if (request.sourceEntityId === request.destinationEntityId) {
    return 'SAME_ENTITY';
  }
  if (!Number.isInteger(request.amountMinorUnits) || request.amountMinorUnits <= 0) {
    return 'NON_POSITIVE_AMOUNT';
  }
  if (!isSupportedCurrency(request.currency)) {
    return 'UNSUPPORTED_CURRENCY';
  }
  if (
    !entityDirectory.hasEntity(request.sourceEntityId) ||
    !entityDirectory.hasEntity(request.destinationEntityId)
  ) {
    return 'UNKNOWN_ENTITY';
  }
  if (
    !authorizationChecker.isAuthorizedForSourceEntity(request.requestedBy, request.sourceEntityId)
  ) {
    return 'INSUFFICIENT_AUTHORIZATION';
  }
  return null;
}

export interface IntercompanyTransferEngineDependencies {
  readonly entityDirectory: EntityDirectory;
  readonly authorizationChecker: AuthorizationChecker;
  readonly idempotencyStore: IdempotencyStore;
  readonly ledgerPoster: LedgerPoster;
}

export interface IntercompanyTransferEngine {
  /** Validates, checks idempotency, and posts a transfer (FR-1 through FR-7, FR-9). */
  submitTransfer(request: IntercompanyTransferRequest): IntercompanyTransferResult;
  /**
   * Reverses a previously posted transfer with an equal-and-opposite entry
   * pair (FR-8). Throws if no posted transfer exists for originalRequestId.
   * Idempotent: replaying the same reversalRequestId returns the same result
   * without posting a second reversal.
   */
  reverseTransfer(originalRequestId: string, reversalRequestId: string): ReversalResult;
}

/** Builds the intercompany transfer engine from its pluggable dependencies. */
export function createIntercompanyTransferEngine(
  deps: IntercompanyTransferEngineDependencies
): IntercompanyTransferEngine {
  const { entityDirectory, authorizationChecker, idempotencyStore, ledgerPoster } = deps;

  function submitTransfer(request: IntercompanyTransferRequest): IntercompanyTransferResult {
    const structuralReason = validateStructural(request, entityDirectory, authorizationChecker);
    if (structuralReason !== null) {
      return { status: 'rejected', requestId: request.requestId, reason: structuralReason };
    }

    const existing = idempotencyStore.get(request.requestId);
    if (existing) {
      return existing;
    }

    // Narrowed to Currency by validateStructural's isSupportedCurrency check above.
    const currency = request.currency as Currency;

    const { debitEntry, creditEntry } = ledgerPoster.post(
      {
        entityId: request.sourceEntityId,
        direction: 'debit',
        amountMinorUnits: request.amountMinorUnits,
        currency,
        requestId: request.requestId,
      },
      {
        entityId: request.destinationEntityId,
        direction: 'credit',
        amountMinorUnits: request.amountMinorUnits,
        currency,
        requestId: request.requestId,
      }
    );

    const result: PostedTransferResult = {
      status: 'posted',
      requestId: request.requestId,
      debitEntry,
      creditEntry,
    };
    idempotencyStore.put(request.requestId, result);
    return result;
  }

  function reverseTransfer(originalRequestId: string, reversalRequestId: string): ReversalResult {
    const original = idempotencyStore.get(originalRequestId);
    if (!original || original.status !== 'posted') {
      throw new Error(
        `Cannot reverse transfer: no posted transfer found for requestId "${originalRequestId}"`
      );
    }

    const existingReversal = idempotencyStore.get(reversalRequestId);
    if (existingReversal && existingReversal.status === 'posted') {
      return {
        status: 'reversed',
        originalRequestId,
        reversalRequestId,
        debitEntry: existingReversal.debitEntry,
        creditEntry: existingReversal.creditEntry,
      };
    }

    // Equal-and-opposite: debit the original destination, credit the original source.
    const { debitEntry, creditEntry } = ledgerPoster.post(
      {
        entityId: original.creditEntry.entityId,
        direction: 'debit',
        amountMinorUnits: original.debitEntry.amountMinorUnits,
        currency: original.debitEntry.currency,
        requestId: reversalRequestId,
        reversalOfRequestId: originalRequestId,
      },
      {
        entityId: original.debitEntry.entityId,
        direction: 'credit',
        amountMinorUnits: original.debitEntry.amountMinorUnits,
        currency: original.debitEntry.currency,
        requestId: reversalRequestId,
        reversalOfRequestId: originalRequestId,
      }
    );

    const reversalPosted: PostedTransferResult = {
      status: 'posted',
      requestId: reversalRequestId,
      debitEntry,
      creditEntry,
    };
    idempotencyStore.put(reversalRequestId, reversalPosted);

    return { status: 'reversed', originalRequestId, reversalRequestId, debitEntry, creditEntry };
  }

  return { submitTransfer, reverseTransfer };
}

// ---------------------------------------------------------------------------
// In-memory reference implementations of the pluggable dependency interfaces.
// These introduce no new runtime dependency (NFR-5) and exist so this module
// is independently testable and directly usable in environments that do not
// yet have a dedicated persistence-backed adapter.
// ---------------------------------------------------------------------------

/** In-memory EntityDirectory backed by a fixed set of known entity ids. */
export function createInMemoryEntityDirectory(entityIds: readonly string[]): EntityDirectory {
  const known = new Set(entityIds);
  return {
    hasEntity: (entityId: string): boolean => known.has(entityId),
  };
}

/** AuthorizationChecker that authorizes every caller. Useful for tests/dev fixtures. */
export function createAllowAllAuthorizationChecker(): AuthorizationChecker {
  return {
    isAuthorizedForSourceEntity: (): boolean => true,
  };
}

/** AuthorizationChecker that denies only callers present in the deny-list. */
export function createDenyListAuthorizationChecker(
  deniedRequestedBy: readonly string[]
): AuthorizationChecker {
  const denied = new Set(deniedRequestedBy);
  return {
    isAuthorizedForSourceEntity: (requestedBy: string): boolean => !denied.has(requestedBy),
  };
}

/** In-memory IdempotencyStore backed by a Map. */
export function createInMemoryIdempotencyStore(): IdempotencyStore {
  const store = new Map<string, IntercompanyTransferResult>();
  return {
    get: (requestId: string): IntercompanyTransferResult | undefined => store.get(requestId),
    put: (requestId: string, result: IntercompanyTransferResult): void => {
      store.set(requestId, result);
    },
  };
}

/** Monotonically increasing id generator, scoped to the returned instance (no shared module state). */
export function createSequentialIdGenerator(prefix = 'ledger'): IdGenerator {
  let counter = 0;
  return {
    next: (): string => {
      counter += 1;
      return `${prefix}-${counter}`;
    },
  };
}

/** Fixed clock useful for deterministic tests. */
export function createFixedClock(isoTimestamp: string): Clock {
  return { now: (): string => isoTimestamp };
}

/** System clock backed by Date.now(). */
export function createSystemClock(): Clock {
  return { now: (): string => new Date().toISOString() };
}

/**
 * In-memory LedgerPoster. Posting appends both entries to an internal
 * append-only array in a single synchronous operation, so no partial pair
 * can ever be observed by a caller (NFR-4).
 */
export function createInMemoryLedgerPoster(idGenerator: IdGenerator, clock: Clock): LedgerPoster {
  const entries: LedgerEntry[] = [];
  return {
    post(debit: LedgerEntryDraft, credit: LedgerEntryDraft) {
      const createdAt = clock.now();
      const debitEntry: LedgerEntry = { ...debit, id: idGenerator.next(), createdAt };
      const creditEntry: LedgerEntry = { ...credit, id: idGenerator.next(), createdAt };
      entries.push(debitEntry, creditEntry);
      return { debitEntry, creditEntry };
    },
    getEntriesByRequestId(requestId: string): readonly LedgerEntry[] {
      return entries.filter(entry => entry.requestId === requestId);
    },
  };
}
