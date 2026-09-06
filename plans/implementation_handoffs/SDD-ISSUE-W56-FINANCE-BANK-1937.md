# Software Design Document — Finance Bank Reconciliation

- Workstream: W56 — Finance Engine
- Issue: #2430
- Parent issue: #1937
- Status: Draft handoff (parent issue remains open)
- Related: `plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-BANK-1937.md`

## 1. Overview

This SDD describes the intended design for the Bank Reconciliation module
under `src/features/finance/financeEngineBankReconciliation`, translating the
requirements in the companion SRS into a concrete module shape,
type-level contracts, and algorithmic approach. It is a handoff artifact for
implementers; no runtime source files are introduced by this issue.

## 2. Design Goals

- Keep the reconciliation engine a **pure function**: no I/O, no mutation of
  inputs, deterministic output for deterministic input.
- Express all domain concepts as strict TypeScript types (no `any`).
- Make the matching algorithm's tie-breaking and ordering behavior explicit
  enough to be unit-testable without ambiguity.
- Keep the module self-contained within its declared child directory so it
  can be reviewed, tested, and merged independently of sibling child issues
  under parent #1937.

## 3. Module Layout (planned)

```
src/features/finance/financeEngineBankReconciliation/
├── financeEngineBankReconciliation.contract.md   # behavioral contract (this issue)
├── README.md                                      # module overview (this issue)
├── types.ts                                        # domain types (future child issue)
├── reconcile.ts                                    # pure matching engine (future child issue)
├── validation.ts                                   # input validation helpers (future child issue)
└── __tests__/
    └── reconcile.test.ts                           # vitest suite (future child issue)
```

Only the contract and README are produced by issue #2430. The remaining
files are scoped to subsequent child issues under parent #1937 and are
listed here purely for design continuity/traceability.

## 4. Type Design

```ts
export type CurrencyCode = string; // validated against /^[A-Z]{3}$/ at runtime

export interface BankStatementLine {
  readonly id: string;
  readonly postedAt: string; // ISO 8601 date
  readonly amountMinorUnits: number; // integer, signed
  readonly currency: CurrencyCode;
  readonly description: string;
  readonly externalReference: string | null;
}

export interface LedgerTransaction {
  readonly id: string;
  readonly bookedAt: string; // ISO 8601 date
  readonly amountMinorUnits: number; // integer, signed
  readonly currency: CurrencyCode;
  readonly memo: string;
  readonly reconciliationStatus: 'unreconciled' | 'matched' | 'disputed';
}

export type MatchType = 'exact' | 'amount-and-date' | 'manual';

export interface ReconciliationMatch {
  readonly statementLineId: string;
  readonly ledgerTransactionId: string;
  readonly matchType: MatchType;
  readonly confidence: number; // 0..1 inclusive
}

export interface ReconciliationResult {
  readonly matches: readonly ReconciliationMatch[];
  readonly unmatchedStatementLines: readonly BankStatementLine[];
  readonly unmatchedLedgerTransactions: readonly LedgerTransaction[];
}

export interface ReconciliationOptions {
  readonly dateToleranceDays?: number; // default 3
}
```

## 5. Algorithm Design

1. **Partition by currency.** Group statement lines and ledger transactions
   into buckets keyed by currency code. Invalid currency codes are excluded
   from buckets and reported via a validation channel (design detail for the
   future `validation.ts` module).
2. **Within each currency bucket:**
   a. Build a candidate index of ledger transactions keyed by
   `amountMinorUnits`.
   b. For each statement line, look up ledger transactions with the same
   amount.
   c. Among same-amount candidates, prefer the one with the smallest
   absolute date difference; ties are broken by input order (lowest
   original index in the ledger array wins), which guarantees
   determinism (NFR-1).
   d. If the smallest date difference is `0`, classify as `exact`
   (`confidence: 1`); if it is within `dateToleranceDays`, classify as
   `amount-and-date` with confidence computed as
   `1 - 0.5 * (diffDays / dateToleranceDays)`; otherwise treat as no
   match for that candidate.
   d. Once a ledger transaction is consumed by a match, remove it from the
   candidate pool so it cannot be matched twice.
3. **Remaining statement lines and ledger transactions** (those never
   consumed) become `unmatchedStatementLines` / `unmatchedLedgerTransactions`
   respectively, preserving original input order.
4. **No mutation**: the algorithm only reads from the input arrays; all
   intermediate bookkeeping (candidate pools, indices) is built on private
   copies/maps, never modifying the caller's objects.

## 6. Error Handling Design

- A dedicated validation pass runs before matching:
  - Reject/flag records whose `currency` does not match `^[A-Z]{3}$`.
  - Reject/flag records whose `amountMinorUnits` is not a safe integer
    (`Number.isInteger`).
- Validation failures are collected into a structured result (e.g. a
  `validationErrors` array) rather than thrown, so a single malformed record
  does not abort reconciliation of the rest of the batch. Exact typing of
  this channel is deferred to the future `validation.ts` child issue but
  must not silently drop errors.

## 7. Testing Strategy (for future implementation issues)

- Unit tests (vitest) covering:
  - Exact match classification and confidence.
  - Amount-and-date match confidence scaling across the tolerance window.
  - No automatic matching across currencies.
  - No mutation of input arrays/objects (deep-equality snapshot before/after).
  - Idempotency across repeated invocations.
  - Rejection/flagging of malformed currency codes and non-integer amounts.
- All test files import from `vitest` (`describe`, `expect`, `it`) and
  assert on real return values from the reconciliation function, never
  placeholder assertions such as `expect(true).toBe(true)`.

## 8. Design Decisions

- **Pure function over class/service**: chosen to keep the engine trivially
  testable and free of hidden state, matching NFR-1/NFR-4.
- **Amount-first, then-date matching** rather than date-first matching:
  amount equality is a stronger, less ambiguous signal than date proximity,
  reducing false positives when multiple transactions share a date.
- **First-index tie-break** for equal-quality candidates: guarantees
  deterministic output (FR-7) without requiring a secondary sort key from
  the input data.

## 9. Excluded Scope Reminders

Per issue #2430, this design and its implementation must not:

- Close parent issue #1937.
- Perform bulk GitHub mutations.
- Perform destructive database operations.
- Rewrite production secrets.

Parent issue #1937 remains open until all child issues in workstream W56 are
reconciled.

## 10. Completion Evidence

- This document and its companion SRS constitute the completion evidence for
  issue #2430's documentation/contract scope.
- Contract file: `src/features/finance/financeEngineBankReconciliation/financeEngineBankReconciliation.contract.md`
- Module README: `src/features/finance/financeEngineBankReconciliation/README.md`

## 11. Rollback Note

This SDD is an additive documentation artifact. Rollback consists of
deleting this file; no source, configuration, or dependency manifest is
modified by this issue.
