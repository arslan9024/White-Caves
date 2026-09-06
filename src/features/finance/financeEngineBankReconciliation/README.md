# financeEngineBankReconciliation

Bank reconciliation sub-module of the Finance Engine feature area.

- Parent issue: #1937 (Finance Engine — Week 56 workstream)
- Child issue: #2430
- Contract: [`financeEngineBankReconciliation.contract.md`](./financeEngineBankReconciliation.contract.md)

## What this module is

This module owns the reconciliation contract between imported bank
statement lines and the finance engine's internal ledger transactions. It
defines the data shapes (`BankStatementLine`, `LedgerTransaction`,
`ReconciliationMatch`, `ReconciliationSummary`), the `ReconciliationStatus`
lifecycle, and the deterministic matching rules that any TypeScript
implementation placed in this directory must satisfy.

See the contract document for the full field-by-field specification and
matching-rule precedence (exact reference match → amount-tolerant match →
amount-mismatch → date-out-of-window → unmatched).

## Status

This child issue (#2430) currently establishes the contract and handoff
documentation (SRS/SDD) for the bank reconciliation matching engine. Source
implementation (`*.ts`) and test files (`*.test.ts`) are introduced in
follow-up work tracked under the same parent issue and must conform to this
contract without modification to its public shapes.

## Scope boundaries

In scope for this child issue and its module directory:

- Contract and design documentation for bank-line-to-ledger matching.
- Type/shape definitions and matching-rule specification.

Explicitly out of scope (see contract's "Excluded scope" section and the
parent issue #1937 governance rules):

- Closing the parent issue.
- Any bulk GitHub mutation.
- Destructive database operations.
- Rewriting production secrets.
- Live bank API connectivity.

## Related documents

- SRS handoff: `plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-BANK-1937.md`
- SDD handoff: `plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-BANK-1937.md`

## Validation

Once implementation files land in this directory, focused validation
should run:

```
npx vitest run src/features/finance/financeEngineBankReconciliation
npx tsc --noEmit
```

Both commands must pass before this child issue is considered reconciled
against the parent issue (#1937).
