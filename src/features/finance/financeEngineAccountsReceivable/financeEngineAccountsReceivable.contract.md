# Contract: financeEngineAccountsReceivable

- Issue: #2410
- Parent issue: #1942
- Status: child scope in progress (parent remains open until all child work is reconciled)

## Purpose

Defines the accounts-receivable sub-module of the White Caves finance engine.
This module is responsible for tracking amounts owed to the business by
tenants, buyers, or agencies (invoices, receipts, aging, and outstanding
balance calculations) as a discrete, independently testable unit within
`src/features/finance`.

## Scope

### In scope (this child issue)

- Documenting the public contract (this file) and module overview (`README.md`)
  for the `financeEngineAccountsReceivable` sub-module.
- Establishing the expected inputs/outputs, invariants, and error semantics
  that any future implementation (types, services, reducers, tests) of this
  sub-module must honor.
- Recording completion evidence and a rollback note for this child slice of
  work so it can be reconciled against parent issue #1942.

### Out of scope (excluded from this child issue)

- Closing parent issue #1942. The parent stays open until **all** child
  issues under it are completed and reconciled.
- Bulk GitHub mutations (labeling, closing, or editing multiple issues/PRs).
- Destructive database operations (drops, truncates, irreversible migrations).
- Rewriting or rotating production secrets/credentials.
- Implementing unrelated finance-engine sub-modules (accounts payable,
  general ledger, payroll, etc.) — those are tracked under their own child
  issues.

## Public Contract (for future implementation)

Any implementation of this sub-module is expected to expose, at minimum:

| Symbol                        | Kind       | Description                                                                               |
| ----------------------------- | ---------- | ----------------------------------------------------------------------------------------- |
| `AccountsReceivableRecord`    | type       | A single receivable entry (id, debtor reference, amount, currency, due date, status).     |
| `AccountsReceivableStatus`    | union type | `'pending' \| 'partially_paid' \| 'paid' \| 'overdue' \| 'written_off'`.                  |
| `calculateOutstandingBalance` | function   | Pure function: `(record: AccountsReceivableRecord) => number`. Never mutates input.       |
| `isOverdue`                   | function   | Pure function: `(record: AccountsReceivableRecord, asOf: Date) => boolean`.               |
| `summarizeAgingBuckets`       | function   | Pure function: groups records into standard aging buckets (0-30, 31-60, 61-90, 90+ days). |

### Invariants

1. All exported functions must be pure (no I/O, no hidden mutation).
2. Monetary values are represented as non-negative numbers in the record's
   minor currency unit (e.g., cents) to avoid floating-point drift.
3. `calculateOutstandingBalance` must never return a negative number; it is
   clamped to zero once fully paid.
4. No `any` types are permitted anywhere in the implementation or its tests.
5. Every exported symbol must have at least one corresponding vitest test
   with a real behavioral assertion (no placeholder `expect(true).toBe(true)`
   style tests).

### Error semantics

- Invalid input (e.g., negative amounts, malformed dates) must be rejected
  via typed validation results or thrown `Error` subclasses defined within
  the module — never silently coerced.

## Completion Evidence

- This child issue (#2410) delivers the contract and module documentation
  (`financeEngineAccountsReceivable.contract.md`, `README.md`) that define
  the scope boundary and public contract for the accounts-receivable
  sub-module, so subsequent child issues can implement code against a
  stable, agreed-upon interface.
- No source/implementation files were added in this slice; only
  documentation. This keeps the change surgical and reviewable, and avoids
  speculative code that could drift from the eventual real requirements.
- Validation for this slice consists of: (a) confirming these two files are
  syntactically valid Markdown, and (b) confirming no files outside the
  declared list were touched.

## Rollback Note

To roll back this change, delete the two files added by this issue:

```
src/features/finance/financeEngineAccountsReceivable/financeEngineAccountsReceivable.contract.md
src/features/finance/financeEngineAccountsReceivable/README.md
```

No code, configuration, dependencies, or database state are affected by
this change, so rollback is a pure file removal with no migration or
data-repair steps required. Parent issue #1942 is unaffected by this
rollback and remains open regardless.
