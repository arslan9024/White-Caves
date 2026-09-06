# Software Requirements Specification — Finance Bank Reconciliation

- Workstream: W56 — Finance Engine
- Issue: #2430
- Parent issue: #1937
- Status: Draft handoff (parent issue remains open)

## 1. Introduction

### 1.1 Purpose

This SRS captures the functional and non-functional requirements for the
Bank Reconciliation capability within the Finance Engine, as scoped by child
issue #2430 under parent issue #1937. It is a handoff artifact intended to
give implementers a stable, testable requirements baseline before source
code lands.

### 1.2 Scope

The Bank Reconciliation capability reconciles bank-provided statement lines
against internally recorded ledger transactions, identifying matches and
surfacing unmatched items for manual review. This SRS covers requirements
for the matching engine only; it does not cover ingestion of bank
statements, persistence layers, or presentation/UI layers.

### 1.3 Definitions

| Term               | Definition                                                        |
| ------------------ | ----------------------------------------------------------------- |
| Statement line     | A single transaction row from a bank statement feed.              |
| Ledger transaction | A single transaction recorded in the internal accounting ledger.  |
| Reconciliation     | The process of matching statement lines to ledger transactions.   |
| Unmatched item     | A statement line or ledger transaction with no counterpart found. |

## 2. Overall Description

### 2.1 Product Perspective

Bank Reconciliation is a sub-capability of the larger Finance Engine
(parent #1937), which coordinates multiple finance child workstreams (e.g.
invoicing, payouts, tax). This capability is consumed by finance operations
tooling and, indirectly, by financial reporting.

### 2.2 Constraints

- Excluded scope for this issue: closing parent issue #1937, bulk GitHub
  mutation, destructive database operations, production secret rewrites.
- Implementation must remain strictly within the declared child directory
  `src/features/finance/financeEngineBankReconciliation`.
- Strict TypeScript; no `any` types permitted in implementation code.
- Tests must use `vitest` with real behavioral assertions.

## 3. Functional Requirements

- **FR-1**: The system SHALL accept a list of bank statement lines and a
  list of ledger transactions as input to a reconciliation operation.
- **FR-2**: The system SHALL only match statement lines and ledger
  transactions sharing the same ISO 4217 currency code.
- **FR-3**: The system SHALL classify a match as `exact` when amounts are
  equal and dates are identical.
- **FR-4**: The system SHALL classify a match as `amount-and-date` when
  amounts are equal and dates differ within a configurable tolerance window
  (default 3 days), with confidence decreasing as the date gap increases.
- **FR-5**: The system SHALL report any statement line or ledger transaction
  that cannot be matched as an unmatched item, without inventing partial or
  approximate amount matches.
- **FR-6**: The system SHALL NOT mutate the input arrays or their elements;
  all results are communicated via a returned result object.
- **FR-7**: The system SHALL produce identical output when invoked twice
  with the same unmodified input (idempotency).
- **FR-8**: The system SHALL reject or flag malformed input (invalid
  currency codes, non-integer amounts) prior to matching.

## 4. Non-Functional Requirements

- **NFR-1 (Determinism)**: Matching results must be deterministic given the
  same inputs and configuration.
- **NFR-2 (Type Safety)**: All public and internal interfaces are expressed
  with strict TypeScript types; `any` is disallowed.
- **NFR-3 (Testability)**: Every functional requirement above must be
  covered by at least one vitest test with a real (non-placeholder)
  assertion once implementation code is introduced.
- **NFR-4 (Isolation)**: The capability must not reach outside its declared
  child scope (no filesystem, network, or database side effects within the
  matching engine itself).

## 5. Traceability

| Requirement | Contract Section  |
| ----------- | ----------------- |
| FR-1        | Domain Model      |
| FR-2        | Matching Rules §1 |
| FR-3        | Matching Rules §2 |
| FR-4        | Matching Rules §3 |
| FR-5        | Matching Rules §4 |
| FR-6        | Matching Rules §6 |
| FR-7        | Matching Rules §5 |
| FR-8        | Error Handling    |

Reference: `src/features/finance/financeEngineBankReconciliation/financeEngineBankReconciliation.contract.md`

## 6. Acceptance Criteria (for this handoff issue #2430)

- Implementation remains within the declared child scope.
- Focused tests and required validation commands pass.
- Completion evidence and rollback note are recorded.
- Parent issue #1937 remains open until all child work is reconciled.

## 7. Rollback Note

This SRS is an additive documentation artifact. Rollback consists of
deleting this file; it does not modify any existing source, configuration,
or dependency manifest.

## 8. Implementation Status Update (issue #2429)

Child issue #2429 delivers the FR-1 through FR-8 matching engine described
above as runtime source code, fulfilling the requirements this SRS defines.
This section records that handoff without altering the original
requirements text captured in sections 1–7.

- **Implementation**: `src/features/finance/financeEngineBankReconciliation/financeEngineBankReconciliation.logic.ts`
  exports a single pure function, `reconcile(statementLines, ledgerTransactions, options?)`,
  plus the domain types (`BankStatementLine`, `LedgerTransaction`,
  `ReconciliationMatch`, `ReconciliationResult`, `ReconciliationOptions`)
  defined in the contract and companion SDD.
- **Tests**: `src/features/finance/financeEngineBankReconciliation/financeEngineBankReconciliation.logic.test.ts`
  uses `vitest` (`describe`, `expect`, `it`) with real behavioral assertions
  covering FR-1 through FR-8 (exact matches, amount-and-date confidence
  scaling, currency isolation, no partial-amount auto-matching, no
  mutation of inputs, idempotency, and malformed-input rejection).
- **Design decision — validation error channel**: FR-8/NFR requires
  malformed input to be rejected or flagged rather than silently dropped.
  Since the contract's `ReconciliationResult` shape (matches +
  unmatched arrays) has no dedicated field for this, `ReconciliationResult`
  was extended with an additive `validationErrors: readonly ValidationError[]`
  field. This is a backward-compatible extension (no existing field
  renamed or removed) chosen over throwing, so a single malformed record
  does not abort reconciliation of the rest of the batch (per FR-8 and SDD
  §6).
- **Scope discipline**: implementation remains confined to the single
  `financeEngineBankReconciliation.logic.ts` module (no `types.ts`,
  `validation.ts`, or `reconcile.ts` file split as sketched in SDD §3's
  "planned" layout); the module layout section is left as originally
  written since it documents design intent, not a hard requirement.
- **Excluded scope preserved**: no parent issue closure, no bulk GitHub
  mutation, no destructive database operations, and no production secret
  rewrites were performed as part of this implementation.
- **Validation commands (this issue)**: `vitest run` against the new test
  file (14/14 passing) and a strict `tsc --noEmit` type-check of the new
  module and its test file (no `any`, no errors).
- **Rollback (this issue)**: delete
  `src/features/finance/financeEngineBankReconciliation/financeEngineBankReconciliation.logic.ts`
  and `financeEngineBankReconciliation.logic.test.ts`. No other files are
  modified and no dependencies were added; parent issue #1937 remains open.

## 9. Implementation Status Update (issue #2428)

Child issue #2428 delivers the shared data contract (types, enums,
defaults, and runtime type guards) for the Bank Reconciliation capability
described above, ahead of / alongside the matching engine implementation
tracked under issue #2429. This section records that handoff without
altering the original requirements text captured in sections 1–8.

- **Implementation**: `src/features/finance/financeEngineBankReconciliation/financeEngineBankReconciliation.types.ts`
  exports the domain shapes `BankStatementLine`, `LedgerTransaction`,
  `ReconciliationMatch`, `ReconciliationSummary`, and `MatchOptions`; the
  `ReconciliationStatus` union with its exhaustive `RECONCILIATION_STATUSES`
  list; the `DEFAULT_MATCH_OPTIONS` constant (3-day date window, 0-cent
  amount tolerance) and `resolveMatchOptions` helper; and runtime type
  guards (`isReconciliationStatus`, `isBankStatementLine`,
  `isLedgerTransaction`, `isReconciliationMatch`, `isReconciliationSummary`,
  `isConsistentReconciliationSummary`) satisfying FR-1, FR-2 (currency-free
  amount/date matching contract), FR-8 (structural validation), and NFR-2
  (no `any`).
- **Tests**: `src/features/finance/financeEngineBankReconciliation/financeEngineBankReconciliation.types.test.ts`
  uses `vitest` (`describe`, `expect`, `it`) with real behavioral assertions
  covering the exhaustive status list, each type guard's accept/reject
  paths (missing fields, wrong field types, out-of-range confidence,
  unrecognized status values, non-object inputs), `resolveMatchOptions`
  default/partial/full override behavior, and both the positive and
  negative cases of `isConsistentReconciliationSummary`'s aggregate
  invariant.
- **Design decision — types module precedes the matching engine**: this
  issue intentionally scopes only the shared data contract, not the
  `reconcile()` algorithm itself (tracked separately under #2429), so the
  contract can be reviewed and stabilized independently and reused by any
  future matching implementation without re-litigating field shapes.
- **Design decision — type guards live alongside the types**: runtime
  validators (`isBankStatementLine`, etc.) are colocated in the same
  `.types.ts` module rather than a separate `validation.ts` file, since
  they are pure, dependency-free structural checks directly tied to the
  types they validate; this keeps the child scope to a single module pair
  per issue #2428's file list.
- **Scope discipline**: implementation remains confined to
  `financeEngineBankReconciliation.types.ts` and
  `financeEngineBankReconciliation.types.test.ts`; no other files under
  `src/` were created or modified.
- **Excluded scope preserved**: no parent issue closure, no bulk GitHub
  mutation, no destructive database operations, and no production secret
  rewrites were performed as part of this implementation.
- **Validation commands (this issue)**: `vitest run` against
  `financeEngineBankReconciliation.types.test.ts` (all cases passing) and a
  strict `tsc --noEmit` type-check of the new module and its test file (no
  `any`, no errors).
- **Rollback (this issue)**: delete
  `src/features/finance/financeEngineBankReconciliation/financeEngineBankReconciliation.types.ts`
  and `financeEngineBankReconciliation.types.test.ts`. No other files are
  modified and no dependencies were added; parent issue #1937 remains open
  pending remaining sibling child issues under workstream W56.
