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

## 12. Implementation Status Update (issue #2429)

Child issue #2429 implements the module described in this SDD. The
original design sections (1–11) are preserved unmodified above; this
section records what was actually built and how it maps to the design.

- **Module layout delivered**: rather than the multi-file split sketched
  in §3 (`types.ts` / `reconcile.ts` / `validation.ts` / `__tests__/`), the
  full implementation and its test suite live in two files as scoped by
  issue #2429:
  - `financeEngineBankReconciliation.logic.ts` — types, validation, and the
    `reconcile()` matching engine, consolidated into one module.
  - `financeEngineBankReconciliation.logic.test.ts` — the vitest suite.
    This consolidation keeps the same design goals (pure function, no `any`,
    deterministic tie-breaking) while matching the two-file contract handed
    to this child issue.
- **Type design**: matches §4 exactly (`BankStatementLine`,
  `LedgerTransaction`, `MatchType`, `ReconciliationMatch`,
  `ReconciliationOptions`), with one additive extension: `ReconciliationResult`
  gains a `validationErrors: readonly ValidationError[]` field (new
  `ValidationError` / `ValidationErrorReason` types) to carry the
  validation-failure signal described in §6 without introducing a
  separate, as-yet-undesigned validation module or throwing mid-batch.
- **Algorithm**: implements §5 as designed — validation pass first
  (excluding malformed records into `validationErrors`), currency+amount
  bucketing of ledger candidates, smallest-date-difference selection with
  lowest-original-index tie-breaking, `exact` vs `amount-and-date`
  classification with linear confidence scaling
  (`1 - 0.5 * (diffDays / dateToleranceDays)`), single-consumption of
  matched ledger transactions, and order-preserving unmatched collections.
  No mutation of input arrays/objects; all bookkeeping uses local `Map`/
  `Set`/array structures.
- **Error handling**: implements §6 — invalid currency codes
  (`/^[A-Z]{3}$/` mismatch) and non-integer `amountMinorUnits`
  (`Number.isInteger` check) are excluded from matching and reported via
  `validationErrors`, never thrown and never silently dropped.
- **Testing strategy**: implements every bullet in §7 — exact match
  classification/confidence, amount-and-date confidence scaling across the
  tolerance window (including the 0.5-at-edge case), cross-currency
  isolation, no-mutation verification via deep-equality snapshots,
  idempotency across repeated invocations, and rejection/flagging of
  malformed currency codes and non-integer amounts. All assertions are
  real behavioral checks against `reconcile()`'s return value.
- **Validation performed for this issue**: `vitest run` (14/14 tests
  passing) and a strict `tsc --noEmit` pass over the new module and test
  file confirming no `any` usage and no type errors.
- **Excluded scope preserved**: no parent issue closure, no bulk GitHub
  mutation, no destructive database operations, no production secret
  rewrites.
- **Rollback for this issue**: delete
  `src/features/finance/financeEngineBankReconciliation/financeEngineBankReconciliation.logic.ts`
  and `.logic.test.ts`. No other files were modified; parent issue #1937
  remains open pending remaining sibling child issues under workstream W56.

## 13. Implementation Status Update (issue #2428)

Child issue #2428 delivers the shared type/contract layer that both the
design in §4 and the implementation recorded in §12 depend on. Sections
1–12 are preserved unmodified above; this section records the types-only
deliverable for #2428.

- **Files delivered**: `financeEngineBankReconciliation.types.ts` and
  `financeEngineBankReconciliation.types.test.ts`, matching the two-file
  scope assigned to issue #2428.
- **Relationship to §4 type design**: the delivered types use an
  equivalent-but-independently-named shape (`BankStatementLine`,
  `LedgerTransaction`, `ReconciliationMatch`, `ReconciliationSummary`,
  `MatchOptions`, `ReconciliationStatus`) rather than the sketched
  `ReconciliationResult` / `ReconciliationOptions` / `MatchType` names in
  §4. This divergence is intentional: §4 was drafted as forward-looking
  design guidance before implementation, while `.types.ts` is the actual,
  tested contract that downstream consumers (including the `.logic.ts`
  engine recorded in §12) must treat as source of truth going forward.
  Field-level intent is preserved (signed integer minor-unit amounts,
  ISO-8601 date strings, closed-interval confidence scores, exhaustive
  status enumeration).
- **Design decision — status enum over boolean flags**: `ReconciliationStatus`
  is modeled as a closed string union (`matched` / `unmatched` /
  `amount-mismatch` / `date-out-of-window`) with a paired
  `RECONCILIATION_STATUSES` runtime array and `isReconciliationStatus`
  guard, so status values are exhaustively enumerable and validated at
  runtime without duplicating the literal list across modules.
  This directly supports NFR-1 (determinism) and NFR-3 (testability) from
  the SRS by making every valid status independently unit-testable.
- **Design decision — `resolveMatchOptions` for partial overrides**: rather
  than requiring callers to always supply a fully-populated
  `MatchOptions`, `resolveMatchOptions` accepts `Partial<MatchOptions>` and
  fills gaps from `DEFAULT_MATCH_OPTIONS` (3-day window, 0-cent tolerance,
  per SDD §4/§8), keeping call sites terse while preserving strict typing.
- **Design decision — aggregate consistency check kept separate from the
  structural guard**: `isReconciliationSummary` validates shape only
  (field presence/types, recursively valid `matches`), while
  `isConsistentReconciliationSummary` separately validates the numeric
  invariant `totalMatched + totalUnmatched === totalBankLines ===
matches.length`. Splitting these means a structurally valid but
  arithmetically inconsistent summary can be detected and reported
  distinctly, rather than conflating two different failure modes into one
  boolean.
- **Testing strategy fulfilled**: the companion `.types.test.ts` covers
  every export with real behavioral assertions — enumerated status
  membership, guard accept/reject paths (missing/invalid fields,
  non-object inputs, out-of-range confidence, unrecognized status
  strings), option-resolution defaulting/overriding, and both the
  consistent and inconsistent summary invariant cases — with no
  placeholder assertions.
- **Excluded scope preserved**: no parent issue closure, no bulk GitHub
  mutation, no destructive database operations, no production secret
  rewrites.
- **Rollback for this issue**: delete
  `src/features/finance/financeEngineBankReconciliation/financeEngineBankReconciliation.types.ts`
  and `.types.test.ts`. No other files were modified; parent issue #1937
  remains open pending remaining sibling child issues under workstream W56.
