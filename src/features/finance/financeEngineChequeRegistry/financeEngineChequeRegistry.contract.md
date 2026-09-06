# Finance Engine Cheque Registry — Contract

- Issue: #2426
- Parent issue: #1938
- Domain: `src/features/finance/financeEngineChequeRegistry`

## Purpose

Defines the data contract, invariants, and public API surface for the Finance
Engine Cheque Registry — the module responsible for tracking post-dated and
issued cheques associated with finance ledger entries (rent, deposits,
service charges) within the White Caves finance engine.

This document is the source of truth for the shape of registry records and
the behavior of the registry's public functions. Any implementation added
under this feature directory (and any future test suite) must conform to
this contract.

## Scope

In scope:

- In-memory / pure-function registry of cheque records keyed by cheque ID.
- Validation of cheque record fields (amount, cheque number, dates, status).
- State-transition rules for cheque lifecycle (`pending` → `cleared` /
  `bounced` / `cancelled`).
- Query helpers (by status, by ledger reference, outstanding totals).

Out of scope (excluded per parent issue #1938 and this child issue):

- Parent issue closure.
- Bulk GitHub mutation of any kind.
- Destructive database operations (this module holds no persistence layer;
  callers own storage).
- Production secret rewrites.
- Network/API integration with banking providers.

## Data Model

```ts
export type ChequeStatus = 'pending' | 'cleared' | 'bounced' | 'cancelled';

export interface ChequeRecord {
  /** Unique identifier for the cheque record (UUID or ledger-scoped ID). */
  readonly id: string;
  /** Physical/bank cheque number as printed on the instrument. */
  readonly chequeNumber: string;
  /** Positive amount in the smallest currency unit is NOT used; amount is
   * a plain decimal number in major currency units (e.g. AED). Must be > 0. */
  readonly amount: number;
  /** ISO-8601 date string (YYYY-MM-DD) the cheque is dated for. */
  readonly issueDate: string;
  /** Optional ISO-8601 date string the cheque was presented/cleared/bounced. */
  readonly clearedDate?: string;
  /** Reference to the originating finance ledger entry (e.g. invoice/lease ID). */
  readonly ledgerReference: string;
  /** Current lifecycle status. */
  readonly status: ChequeStatus;
  /** Free-form note (e.g. bounce reason). */
  readonly note?: string;
}
```

## Invariants

1. `amount` MUST be a finite number strictly greater than `0`.
2. `chequeNumber` and `ledgerReference` MUST be non-empty, trimmed strings.
3. `issueDate` MUST be a valid ISO-8601 date string (`YYYY-MM-DD`).
4. `clearedDate`, when present, MUST be a valid ISO-8601 date string and
   MUST NOT be earlier than `issueDate`.
5. Status transitions are one-directional and restricted:
   - `pending` → `cleared`
   - `pending` → `bounced`
   - `pending` → `cancelled`
   - Any other transition (including from `cleared`, `bounced`, or
     `cancelled` to any other status, or to the same status) is invalid and
     must be rejected.
6. The registry never mutates a `ChequeRecord` in place; all registry
   operations return new record instances (immutability).
7. Registry lookups by unknown `id` return `undefined` (queries) or throw a
   descriptive `Error` (mutating operations), never silently no-op.

## Public API Surface

```ts
export function createChequeRecord(input: {
  id: string;
  chequeNumber: string;
  amount: number;
  issueDate: string;
  ledgerReference: string;
  note?: string;
}): ChequeRecord;

export function validateChequeRecord(record: ChequeRecord): string[]; // list of violation messages, empty = valid

export function canTransition(from: ChequeStatus, to: ChequeStatus): boolean;

export function transitionCheque(
  record: ChequeRecord,
  toStatus: ChequeStatus,
  options?: { clearedDate?: string; note?: string }
): ChequeRecord; // throws on invalid transition or invalid dates

export function filterByStatus(
  records: readonly ChequeRecord[],
  status: ChequeStatus
): ChequeRecord[];

export function filterByLedgerReference(
  records: readonly ChequeRecord[],
  ledgerReference: string
): ChequeRecord[];

export function sumOutstandingAmount(records: readonly ChequeRecord[]): number; // sum of amount for status === 'pending'
```

## Error Handling

- Invalid input to `createChequeRecord` throws `Error` with a message
  listing the specific violation(s).
- Invalid transitions in `transitionCheque` throw `Error` with a message of
  the form: `Invalid cheque transition: <from> -> <to>`.
- All exported functions are pure and free of side effects (no I/O, no
  network, no logging).

## Testing Requirements

- Vitest (`import { describe, expect, it } from 'vitest'`) test files
  co-located under this feature directory (e.g.
  `financeEngineChequeRegistry.test.ts`) must assert real behavior against
  every invariant listed above — no placeholder assertions (`expect(true).toBe(true)`).
- Minimum coverage: creation validation, each valid/invalid transition pair,
  query helpers, and outstanding-amount aggregation.

## Rollback Note

This contract and its companion README are documentation-only additions
under `src/features/finance/financeEngineChequeRegistry/`. To roll back,
delete the two files in this directory; no other files are touched, no
schema migrations are introduced, and no runtime behavior changes until an
implementation file is added in a follow-up child issue.
