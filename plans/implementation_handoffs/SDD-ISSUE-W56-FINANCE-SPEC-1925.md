# SDD — Issue W56 Finance Spec (Parent #1925 / Child #2483)

**Document type:** Software Design Document (handoff artifact)
**Work stream ID:** W56-FINANCE-SPEC
**Parent issue:** #1925
**Child issue covered by this handoff:** #2483 — Finance Engine Architecture Double

## 1. Overview

This SDD describes the design of the Finance Engine Architecture Double introduced for child issue
#2483, satisfying the requirements captured in the companion SRS
(`SRS-ISSUE-W56-FINANCE-SPEC-1925.md`). It defines module layout, data types, and the internal
design that implementers must follow to conform to
`src/features/finance/financeEngineArchitectureDouble/financeEngineArchitectureDouble.contract.md`.

## 2. Module Layout

```
src/features/finance/financeEngineArchitectureDouble/
├── financeEngineArchitectureDouble.contract.md   # behavioral contract (source of truth)
├── README.md                                     # usage + scope documentation
└── (future) financeEngineArchitectureDouble.ts   # implementation, delivered under #1925 children
    (future) financeEngineArchitectureDouble.test.ts  # vitest suite, real behavioral assertions
```

Only the contract and README are delivered by this handoff (#2483); the `.ts` implementation and
its vitest suite are implemented by subsequent child work under parent #1925 and MUST conform to
the design below.

## 3. Data Model (design-level types)

```ts
export type FinanceEngineErrorCode = 'INVALID_AMOUNT' | 'NEGATIVE_INFINITY' | 'NOT_A_NUMBER';

export interface FinanceEngineSeed {
  readonly seed?: string;
  readonly clock?: () => number; // injectable fixed clock for determinism
}

export interface TransactionInput {
  readonly amount: number;
  readonly description?: string;
}

export interface TransactionRecord extends TransactionInput {
  readonly id: number;
  readonly recordedAt: number; // epoch ms, from seed.clock() if provided, else 0-based counter
}

export interface FinanceEngineDouble {
  recordTransaction(input: TransactionInput): TransactionRecord;
  getBalance(): number;
  getLedger(): ReadonlyArray<TransactionRecord>;
  reset(): void;
}
```

## 4. Internal Design

- **State container**: a closure-scoped mutable object holding `ledger: TransactionRecord[]`,
  `nextId: number`, and `balance: number`, returned as a frozen-shaped `FinanceEngineDouble`
  object from the factory function. Using a closure (rather than a class with public fields)
  prevents external code from mutating internal counters directly.
- **Validation**: `recordTransaction` MUST call `Number.isFinite(input.amount)` before accepting
  the transaction; on failure it throws a `FinanceEngineValidationError` carrying a
  `FinanceEngineErrorCode`.
- **Balance maintenance**: balance is maintained incrementally (`balance += input.amount`) rather
  than recomputed from the ledger on every read, for O(1) `getBalance()` — but MUST remain
  consistent with summing the ledger, so tests may assert either way interchangeably.
- **Defensive copies**: `getLedger()` returns `[...ledger]` (a shallow copy) so external mutation
  of the returned array cannot corrupt internal state.
- **Reset**: `reset()` reassigns `ledger = []`, `nextId` to its initial value, and `balance = 0`,
  matching the just-constructed state exactly (verified via seed-equality tests).
- **Determinism**: if `seed.clock` is supplied, `recordedAt` uses it; otherwise `recordedAt` is
  derived from a monotonically increasing internal counter (never `Date.now()`), preserving
  determinism when no clock is injected.

## 5. Error Design

```ts
export class FinanceEngineValidationError extends Error {
  constructor(
    message: string,
    public readonly code: FinanceEngineErrorCode
  ) {
    super(message);
    this.name = 'FinanceEngineValidationError';
  }
}
```

Rationale: subclassing `Error` (rather than throwing a plain object or string) preserves stack
traces and lets consumers use `instanceof FinanceEngineValidationError` for reliable narrowing,
while the `code` field lets tests assert on the specific failure reason without brittle string
matching on `message`.

## 6. Testing Strategy (for implementers)

When the `.ts` implementation lands, its vitest suite must cover, at minimum:

1. Deterministic output for a fixed seed across two separately constructed instances.
2. Balance correctness after a mixed sequence of credit/debit transactions.
3. Rejection of `NaN` and `Infinity` amounts with the correct `FinanceEngineErrorCode`.
4. Ledger immutability — mutating the array returned by `getLedger()` does not affect subsequent
   `getBalance()`/`getLedger()` calls.
5. `reset()` parity — state after `reset()` is assertively equal to a freshly constructed double.

All suites must use `import { describe, expect, it } from 'vitest'` and assert on real computed
values (e.g., `expect(engine.getBalance()).toBe(380)`), never tautological assertions such as
`expect(true).toBe(true)`.

## 7. Design Decisions Resolved

- **Closure-based state vs. class**: chose closures to avoid exposing mutable public fields that
  callers could accidentally reassign, keeping `reset()` as the single sanctioned mutation entry
  point besides `recordTransaction`.
- **Incremental balance vs. ledger-sum-on-read**: chose incremental maintenance for O(1) reads
  while still guaranteeing (via the contract) that it equals the ledger sum, so both are valid
  test assertions.
- **Injectable clock over `Date.now()`**: required by the determinism requirement (FR-2/NFR-2);
  wall-clock reads would make repeated test runs non-reproducible.

## 8. Traceability

- Implements requirements FR-1 through FR-9 and NFR-1 through NFR-4 in the companion SRS.
- Governed by the contract in
  `src/features/finance/financeEngineArchitectureDouble/financeEngineArchitectureDouble.contract.md`.

## 9. Completion Evidence

- SDD content reviewed against every FR/NFR in the companion SRS; no requirement left untraced.
- Design types and error class are directly derivable from, and consistent with, the contract
  document's Public Interface Contract and Error Contract sections.

## 10. Rollback Note

This document is a design handoff artifact only; it introduces no source code or runtime changes.
Rollback is file deletion only:

```
git rm plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-SPEC-1925.md
```

Removing this file has no effect on runtime behavior, database state, or GitHub issue state.
Parent issue #1925 remains open independent of this document's presence or removal.
