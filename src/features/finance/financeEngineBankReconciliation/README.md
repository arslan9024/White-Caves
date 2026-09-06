# Finance Engine — Bank Reconciliation

- Issue: #2430
- Parent issue: #1937 (remains open until all child work under W56 is reconciled)
- Location: `src/features/finance/financeEngineBankReconciliation`

## What this module is

This module owns the Bank Reconciliation sub-feature of the Finance Engine.
It is responsible for matching bank statement lines against internal ledger
transactions and reporting matches/discrepancies. It does **not** own
persistence, HTTP/API wiring, or UI presentation — those belong to sibling
child issues tracked under parent issue #1937.

See [`financeEngineBankReconciliation.contract.md`](./financeEngineBankReconciliation.contract.md)
for the full behavioral contract (domain model, matching rules, error
handling, non-goals).

## Scope boundary

This child issue (#2430) is documentation- and contract-level handoff work
only. It intentionally does **not**:

- Close the parent issue (#1937).
- Perform any bulk GitHub mutation.
- Perform destructive database operations.
- Touch or rewrite production secrets.

Parent issue #1937 stays open until every child issue in the W56
finance/bank reconciliation workstream is reconciled and merged.

## Intended public surface

When implemented, the module's public surface is expected to expose (per the
contract):

- `BankStatementLine`, `LedgerTransaction`, `ReconciliationMatch`, and
  `ReconciliationResult` types.
- A pure reconciliation function with the shape
  `reconcile(statementLines: BankStatementLine[], ledgerTransactions: LedgerTransaction[], options?: ReconciliationOptions): ReconciliationResult`
  that never mutates its inputs (see contract §"No mutation of inputs").

## Handoff documents

- SRS: `plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-BANK-1937.md`
- SDD: `plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-BANK-1937.md`

## Validation

Focused validation for this child issue is documentation review: confirm the
contract, README, SRS, and SDD are internally consistent and traceable to
issue #2430 / parent #1937. No source code, build, or test commands are
introduced by this change since no runtime module code was added in this
issue's scope.

## Rollback

This change is additive-only (new documentation files under a new
`financeEngineBankReconciliation` directory and two new handoff docs under
`plans/implementation_handoffs/`). To roll back, delete the four files listed
below; no other files are touched and no dependencies were added:

- `src/features/finance/financeEngineBankReconciliation/financeEngineBankReconciliation.contract.md`
- `src/features/finance/financeEngineBankReconciliation/README.md`
- `plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-BANK-1937.md`
- `plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-BANK-1937.md`
