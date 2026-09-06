# SRS — Finance Engine Bank Reconciliation

- Document ID: `SRS-ISSUE-W56-FINANCE-BANK-1937`
- Parent issue: #1937
- Child issues: #2430 (contract/docs), #2429 (implementation, this revision)
- Module: `src/features/finance/financeEngineBankReconciliation/`
- Status: Implemented — matching engine and Vitest suite delivered under
  child issue #2429, building on the contract established by #2430.

> **Revision note (issue #2429):** This document originally described a
> documentation-only handoff for child issue #2430. It has been extended
> (not replaced) to record that the `matchBankLines` engine and its test
> suite, previously deferred as "follow-up implementation work," are now
> implemented per the contract below. All original requirements text is
> preserved unchanged; only status markers and this note were added.

## 1. Purpose

This Software Requirements Specification defines the functional and
non-functional requirements for the bank reconciliation capability of the
Finance Engine (Week 56 workstream, parent issue #1937). It scopes the
child work tracked under issue #2430: establishing the data contract,
matching rules, and documentation handoff needed before implementation
begins.

## 2. Background

The Finance Engine requires an automated way to reconcile bank statement
lines (imported from bank exports) against internally recorded ledger
transactions, so that discrepancies (missing entries, amount mismatches,
timing differences) can be surfaced for manual review rather than
discovered during period close.

## 3. Scope

### 3.1 In scope

- FR-1: Define a `BankStatementLine` shape representing a single imported
  bank transaction line.
- FR-2: Define a `LedgerTransaction` shape representing a single internal
  finance engine ledger entry eligible for matching.
- FR-3: Define a `ReconciliationStatus` enum covering `matched`,
  `unmatched`, `amount-mismatch`, and `date-out-of-window` outcomes.
- FR-4: Define a `ReconciliationMatch` result shape carrying the bank line
  id, matched ledger transaction id (nullable), status, confidence score,
  and variance in cents.
- FR-5: Define a `ReconciliationSummary` aggregate shape for a full
  reconciliation run (totals + per-line matches).
- FR-6: Specify deterministic, side-effect-free matching rules with clear
  precedence (exact reference → amount-tolerant → mismatch → unmatched).
- FR-7: Each ledger transaction is consumable by at most one match per run.

### 3.2 Out of scope (explicit exclusions)

- Closing parent issue #1937.
- Any bulk GitHub mutation (issue/PR bulk edits, bulk labeling, etc).
- Destructive database operations (deletes, truncates, drops, migrations
  that remove data).
- Production secret rewrites or credential handling of any kind.
- Live/networked bank API integrations — only already-imported,
  in-memory data is addressed by this contract.

## 4. Functional Requirements Detail

| ID   | Requirement                                                                                                  | Acceptance signal                                             |
| ---- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| FR-1 | `BankStatementLine` includes `id`, `postedDate`, `amountCents`, `description`, `referenceNumber`.            | Type present in contract; no `any`.                           |
| FR-2 | `LedgerTransaction` includes `id`, `transactionDate`, `amountCents`, `memo`, `referenceNumber`.              | Type present in contract; no `any`.                           |
| FR-3 | `ReconciliationStatus` is a closed string union of 4 values.                                                 | Type present in contract.                                     |
| FR-4 | `ReconciliationMatch` includes `bankLineId`, `ledgerTransactionId`, `status`, `confidence`, `varianceCents`. | Type present in contract.                                     |
| FR-5 | `ReconciliationSummary` aggregates `totalBankLines`, `totalMatched`, `totalUnmatched`, `matches`.            | Type present in contract.                                     |
| FR-6 | Matching precedence documented step-by-step, deterministic, pure.                                            | Contract section "Matching Rules" enumerates 7 ordered rules. |
| FR-7 | One ledger transaction is used by at most one match.                                                         | Rule 7 in contract.                                           |

## 5. Non-Functional Requirements

- NFR-1: Strict TypeScript; no `any` types anywhere in the module.
- NFR-2: All matching functions are pure — no network, filesystem, or
  database access inside the matching engine.
- NFR-3: Deterministic output — identical inputs always produce identical
  `ReconciliationMatch[]` ordering and values.
- NFR-4: Testability — all exported types and functions must be
  independently unit-testable with Vitest using real behavioral
  assertions (no placeholder `expect(true).toBe(true)` style tests).

## 6. Constraints

- Implementation must remain entirely within
  `src/features/finance/financeEngineBankReconciliation/` (declared child
  scope for issue #2430).
- No new npm dependencies may be introduced.
- No files outside the four documents/module listed for this child issue
  may be modified as part of this handoff.

## 7. Traceability

| Requirement      | Source                                                                                |
| ---------------- | ------------------------------------------------------------------------------------- |
| FR-1 – FR-7      | `financeEngineBankReconciliation.contract.md` §"Data Contracts" and §"Matching Rules" |
| NFR-1 – NFR-4    | `financeEngineBankReconciliation.contract.md` §"Non-Functional Requirements"          |
| Scope boundaries | Issue #2430 "Excluded scope"; parent issue #1937                                      |

## 8. Open Questions for Follow-up Implementation Work

- Configurable date window and amount tolerance defaults (currently
  proposed: 3-day window, 0-cent tolerance) — to be confirmed with
  finance stakeholders before the matching engine is implemented.
- Whether partial/multi-line matches (one bank line split across multiple
  ledger transactions) are needed in a later iteration; current contract
  assumes 1:1 matching only.

## 9. Approval / Handoff State

This SRS is handed off as part of child issue #2430. Parent issue #1937
remains open. Closure of the parent issue is explicitly out of scope for
this handoff and must be performed separately once all child issues under
#1937 are reconciled.

## 10. Implementation Update (Issue #2429)

Child issue #2429 implements the matching engine and test suite planned
in §8 and in the companion SDD. Concretely:

- `src/features/finance/financeEngineBankReconciliation/financeEngineBankReconciliation.logic.ts`
  implements `BankStatementLine`, `LedgerTransaction`,
  `ReconciliationStatus`, `ReconciliationMatch`, `ReconciliationSummary`,
  `MatchOptions`, and the `matchBankLines` function, satisfying FR-1
  through FR-7 and NFR-1 through NFR-4.
- `src/features/finance/financeEngineBankReconciliation/financeEngineBankReconciliation.logic.test.ts`
  is a Vitest suite with 15 real behavioral assertions covering every
  scenario listed in SDD §5 (rule tiers 1–6, non-consumption ordering,
  aggregate total consistency, determinism).
- The date-window default (3 days) and amount-tolerance default (0 cents)
  proposed in §8 are retained as the module defaults, overridable per
  call via `MatchOptions`; the open question of split/multi-line matching
  remains deferred and out of scope for #2429.
- Parent issue #1937 remains open. No parent-issue closure, bulk GitHub
  mutation, destructive database operation, or production secret rewrite
  was performed as part of #2429, consistent with the declared excluded
  scope.

## 11. Implementation Update (Issue #2428)

Child issue #2428 delivers the standalone data contract module
(`financeEngineBankReconciliation.types.ts`) and its Vitest suite
(`financeEngineBankReconciliation.types.test.ts`), satisfying FR-1
through FR-5 (the data-shape requirements) independently of the matching
engine described in §10.

- `financeEngineBankReconciliation.types.ts` exports `BankStatementLine`,
  `LedgerTransaction`, `ReconciliationStatus`,
  `RECONCILIATION_STATUSES`, `ReconciliationMatch`,
  `ReconciliationSummary`, `MatchOptions`, `DEFAULT_MATCH_OPTIONS`, and
  runtime type guards (`isReconciliationStatus`, `isBankStatementLine`,
  `isLedgerTransaction`, `isReconciliationMatch`,
  `isReconciliationSummary`, `isConsistentReconciliationSummary`) plus
  the `resolveMatchOptions` helper, all in strict TypeScript with no
  `any` types, matching the shapes defined in this SRS and in the
  companion SDD.
- `financeEngineBankReconciliation.types.test.ts` is a Vitest suite with
  real behavioral assertions covering every exported type guard, the
  default options, and the `resolveMatchOptions` override behavior,
  including negative/invalid-shape cases.
- This module is standalone (no dependency on a `.logic.ts` matching
  engine file) and can be consumed by future matching-engine work
  without modification.
- Parent issue #1937 remains open. No parent-issue closure, bulk GitHub
  mutation, destructive database operation, or production secret rewrite
  was performed as part of #2428, consistent with the declared excluded
  scope.
