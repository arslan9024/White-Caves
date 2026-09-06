# Contract: Finance Engine — Intercompany Transfer

- **Issue:** #2434
- **Parent issue:** #1936
- **Module path:** `src/features/finance/financeEngineIntercompanyTransfer/`
- **Status:** Draft contract (design-only child; no runtime code introduced by this issue)

## 1. Purpose

Defines the behavioral and data contract for the Intercompany Transfer capability of the
Finance Engine. Intercompany transfers move recognized value (cash, ledger balances, or
booked commitments) between two related legal/business entities inside White Caves
(e.g. a holding entity and a project SPV) while preserving double-entry integrity and
auditability across both entities' books.

This document is the source of truth for any subsequent implementation task under
parent issue #1936. It does not itself add runtime logic — it constrains what a future
implementation must satisfy.

## 2. Scope

### In scope

- Contractual shape of an intercompany transfer request, its validation rules, and the
  resulting paired ledger entries (debit on the source entity, credit on the destination
  entity, or vice versa depending on transfer type).
- Idempotency, currency, and rounding rules for cross-entity postings.
- Error taxonomy for rejected/invalid transfers.

### Out of scope (see "Excluded scope" below)

- Closing parent issue #1936.
- Bulk GitHub mutations of any kind.
- Destructive database operations (drops, truncates, irreversible migrations).
- Rewriting or rotating production secrets.
- Any UI/presentation layer work — this is a finance-domain/service contract only.

## 3. Core Types (contract-level, informative — not compiled)

```ts
/** ISO 4217 currency code, e.g. "AED", "USD". */
export type CurrencyCode = string;

/** Entity identifier for a legal/business unit participating in intercompany transfers. */
export type EntityId = string;

export type IntercompanyTransferStatus =
  | 'pending'
  | 'validated'
  | 'posted'
  | 'rejected'
  | 'reversed';

export interface IntercompanyTransferRequest {
  /** Caller-supplied idempotency key; duplicate keys must not double-post. */
  readonly requestId: string;
  readonly sourceEntityId: EntityId;
  readonly destinationEntityId: EntityId;
  /** Positive integer minor units (e.g. fils/cents) — no floating point amounts. */
  readonly amountMinorUnits: number;
  readonly currency: CurrencyCode;
  readonly memo?: string;
  readonly requestedAt: string; // ISO 8601
}

export interface IntercompanyTransferResult {
  readonly requestId: string;
  readonly status: IntercompanyTransferStatus;
  readonly sourceLedgerEntryId?: string;
  readonly destinationLedgerEntryId?: string;
  readonly rejectionReason?: IntercompanyTransferRejectionReason;
  readonly postedAt?: string; // ISO 8601
}

export type IntercompanyTransferRejectionReason =
  | 'SAME_ENTITY'
  | 'NON_POSITIVE_AMOUNT'
  | 'UNSUPPORTED_CURRENCY'
  | 'UNKNOWN_ENTITY'
  | 'DUPLICATE_REQUEST_ID'
  | 'INSUFFICIENT_AUTHORIZATION';
```

## 4. Validation Rules

| Rule              | Condition                                                                      | Rejection code               |
| ----------------- | ------------------------------------------------------------------------------ | ---------------------------- |
| Distinct entities | `sourceEntityId !== destinationEntityId`                                       | `SAME_ENTITY`                |
| Positive amount   | `amountMinorUnits > 0` and an integer                                          | `NON_POSITIVE_AMOUNT`        |
| Known currency    | `currency` is in the supported currency allow-list                             | `UNSUPPORTED_CURRENCY`       |
| Known entities    | both `sourceEntityId` and `destinationEntityId` resolve to registered entities | `UNKNOWN_ENTITY`             |
| Idempotency       | `requestId` has not been previously posted                                     | `DUPLICATE_REQUEST_ID`       |
| Authorization     | caller has intercompany-transfer permission for the source entity              | `INSUFFICIENT_AUTHORIZATION` |

Amounts are always expressed in integer minor units to avoid floating-point rounding
errors; any conversion to major units (display) happens only at the presentation layer,
never inside the engine.

## 5. Posting Semantics

A successful transfer produces **exactly two** ledger entries, created atomically
(single transaction boundary):

1. A debit entry of `amountMinorUnits` against `sourceEntityId`.
2. A credit entry of `amountMinorUnits` against `destinationEntityId`.

Both entries share the same `requestId` as a correlation key so the pair can always be
reconciled back to the originating request, and both must be written or neither must be
written (no partial posting).

## 6. Idempotency

Re-submitting a request with the same `requestId` MUST return the original
`IntercompanyTransferResult` rather than creating a second posting. This is required so
that retried network calls (timeouts, client retries) cannot double-move funds between
entities.

## 7. Reversal

A `posted` transfer may transition to `reversed` by issuing an equal-and-opposite pair
of ledger entries referencing the original `requestId`. Reversal never deletes or
mutates the original entries (append-only ledger discipline).

## 8. Error Handling

All rejections are returned as a `status: 'rejected'` result with a populated
`rejectionReason` — the contract does not throw for expected business-rule violations.
Unexpected infrastructure failures (e.g. database unavailable) are allowed to throw and
are outside this contract's error taxonomy.

## 9. Non-Functional Requirements

- Strict TypeScript; no `any` types in any implementation that fulfills this contract.
- All amounts are integers; no implicit floating-point arithmetic on money values.
- All public functions implementing this contract must be independently unit-testable
  with `vitest`, asserting real behavior (validation outcomes, posting pairs, idempotent
  replay) rather than placeholder assertions.

## 10. Traceability

- Parent issue: #1936 (Finance Engine workstream, W56).
- This issue (#2434) delivers the contract and companion planning documents only; it
  does not implement or wire the runtime module. Implementation is tracked as a
  follow-up child issue under #1936.
