# Finance Engine — Tax Invoice

Child feature of the Finance Engine domain, tracked under Issue #2468
(parent: #1928).

## Purpose

Provides pure, strictly-typed calculation and validation logic for tax
invoices (subtotal, tax, and total computation) used by the wider
finance engine. See [`financeEngineTaxInvoice.contract.md`](./financeEngineTaxInvoice.contract.md)
for the full scope contract.

## Status

- Scope: documentation and contract for this child issue only, per the
  task's declared "Files to create" list. No runtime `.ts` source files
  were added or modified as part of this change; this directory
  currently holds only the contract and this README.
- Parent issue #1928 remains **open**. This child does not close, edit,
  or otherwise mutate the parent issue or any other GitHub issue/PR.

## Excluded scope (explicit)

- Parent issue closure.
- Bulk GitHub mutation.
- Destructive database operations.
- Production secret rewrites.

## Completion evidence

- `financeEngineTaxInvoice.contract.md` created, defining in-scope /
  out-of-scope boundaries, interface guarantees, and acceptance
  criteria for this child feature.
- `README.md` (this file) created, recording status and rollback
  notes.
- No changes were made outside
  `src/features/finance/financeEngineTaxInvoice/`.
- No GitHub issues/PRs were modified; no destructive database
  operations, secret rewrites, or bulk mutations were performed.

## Rollback note

To roll back this change:

1. Delete the `src/features/finance/financeEngineTaxInvoice/` directory
   (contains only `financeEngineTaxInvoice.contract.md` and this
   `README.md`).
2. No dependencies, environment variables, database migrations, or
   external services were touched, so no additional cleanup is
   required.
3. This rollback has no effect on parent issue #1928 or any other
   sibling child scope.
