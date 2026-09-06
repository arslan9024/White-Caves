# Contract: Finance Engine — Intercompany Transfer

- **Issue**: #2434
- **Parent issue**: #1936
- **Module path**: `src/features/finance/financeEngineIntercompanyTransfer/`
- **Status**: Draft (documentation-only handoff; no runtime code shipped under this issue)

## 1. Purpose

Define the behavioral contract for the intercompany transfer capability of the
White Caves finance engine. Intercompany transfers move recognized value
(cash, receivables, or ledger credits) between two related legal entities
inside the platform (e.g. a management company and a property-owning SPV)
without creating external payment rails. This contract is the source of truth
for any implementation, and any future code under this directory MUST conform
to it. Where a prior implementation conflicts with this document, this
document wins.

## 2. Scope

### In scope

- Defining the shape of an intercompany transfer request, its validation
  rules, and its resulting ledger entries.
- Defining the state machine governing a transfer's lifecycle.
- Defining error conditions and how they are surfaced to callers.
- Defining idempotency and concurrency guarantees required of any
  implementation.

### Out of scope (excluded scope for this issue)

- Closing the parent issue (#1936) — remains open until all child issues
  reconcile.
- Bulk GitHub mutations of any kind.
- Destructive database operations (drops, truncations, irreversible
  migrations).
- Production secret rewrites or rotation.
- Any external/cross-border payment execution — this contract covers
  internal ledger movement only.

## 3. Core Types (contractual shape)

```ts
/** Money is represented in integer minor units (e.g. fils/cents) to avoid
 *  floating point drift. Never model money as `number` with decimals. */
type MinorUnits = number; // integer, non-negative for magnitudes

type CurrencyCode = 'AED' | 'USD' | 'EUR'; // extend via a controlled enum, not `string`

interface IntercompanyTransferRequest {
  readonly requestId: string; // caller-supplied idempotency key (UUID v4)
  readonly sourceEntityId: string;
  readonly targetEntityId: string;
  readonly amount: MinorUnits;
  readonly currency: CurrencyCode;
  readonly memo: string;
  readonly requestedAt: string; // ISO-8601 timestamp
  readonly requestedBy: string; // user or service principal id
}

type IntercompanyTransferStatus = 'PENDING' | 'VALIDATED' | 'POSTED' | 'REJECTED' | 'REVERSED';

interface IntercompanyTransferRecord {
  readonly requestId: string;
  readonly status: IntercompanyTransferStatus;
  readonly sourceEntryId: string | null; // ledger entry id, once POSTED
  readonly targetEntryId: string | null; // ledger entry id, once POSTED
  readonly rejectionReason: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

interface IntercompanyTransferError {
  readonly code:
    | 'DUPLICATE_REQUEST'
    | 'SAME_ENTITY'
    | 'INVALID_AMOUNT'
    | 'CURRENCY_MISMATCH'
    | 'ENTITY_NOT_FOUND'
    | 'INSUFFICIENT_BALANCE';
  readonly message: string;
}
```

## 4. State Machine

```
PENDING --validate success--> VALIDATED --post success--> POSTED --reverse--> REVERSED
   |                              |
   +--validate failure--> REJECTED
```

- A transfer starts in `PENDING` when accepted for processing.
- `VALIDATED` requires: `sourceEntityId !== targetEntityId`, `amount > 0`,
  both entities exist, and (if enforced) sufficient source balance.
- `POSTED` requires two balanced ledger entries created atomically: a debit
  on `sourceEntityId` and a credit on `targetEntityId`, same `amount` and
  `currency`.
- `REVERSED` is only reachable from `POSTED` and creates two compensating
  ledger entries; it never mutates or deletes the original entries
  (append-only ledger discipline).
- `REJECTED` is terminal; no ledger entries are created.

## 5. Validation Rules

1. `amount` MUST be a positive integer (`Number.isInteger(amount) && amount > 0`).
2. `sourceEntityId` MUST NOT equal `targetEntityId` (`SAME_ENTITY`).
3. `requestId` MUST be unique per transfer; a repeat with the same
   `requestId` and identical payload returns the original `IntercompanyTransferRecord`
   (idempotent replay); a repeat with a different payload returns
   `DUPLICATE_REQUEST`.
4. `currency` on both sides of the transfer MUST match; cross-currency
   transfers require an explicit FX conversion step (out of scope here) and
   otherwise return `CURRENCY_MISMATCH`.
5. Unknown `sourceEntityId`/`targetEntityId` returns `ENTITY_NOT_FOUND`.
6. If balance enforcement is enabled for the source entity, insufficient
   funds returns `INSUFFICIENT_BALANCE` and the transfer is `REJECTED`.

## 6. Concurrency & Idempotency Guarantees

- Implementations MUST treat `requestId` as a unique constraint at the
  persistence layer (not just an in-memory check) to survive concurrent
  duplicate submissions.
- Posting MUST be atomic: both ledger entries are created in a single
  transaction, or neither is.
- Re-processing a `POSTED` transfer with the same `requestId` MUST be a
  no-op that returns the existing record, never a second posting.

## 7. Error Handling

- All rejections return a typed `IntercompanyTransferError`; no exceptions
  cross the module boundary for expected validation failures.
- Only unexpected infrastructure failures (e.g. persistence unavailable) may
  throw; callers MUST be able to distinguish domain rejection from
  infrastructure failure.

## 8. Non-Functional Requirements

- Strict TypeScript; no `any` in any implementation of this contract.
- All public functions must be pure with respect to inputs beyond declared
  side effects (ledger writes), to keep unit tests deterministic.
- Any test suite implementing this contract must use vitest
  (`import { describe, expect, it } from 'vitest'`) with real behavior
  assertions (state transitions, computed ledger entries, error codes) —
  never placeholder assertions.

## 9. Traceability

- Parent issue: #1936 (remains open; not closed by this or any child issue).
- This issue (#2434) delivers the contract and SRS/SDD handoff documents
  only. Runtime implementation and its tests are tracked as subsequent child
  work under the parent issue and must reference this contract as their
  acceptance baseline.
