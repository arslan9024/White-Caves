# SRS — Finance Engine Bank Reconciliation

- Document ID: `SRS-ISSUE-W56-FINANCE-BANK-1937`
- Parent issue: #1937
- Child issue: #2430
- Module: `src/features/finance/financeEngineBankReconciliation/`
- Status: Draft — contract established, implementation pending in follow-up work

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
