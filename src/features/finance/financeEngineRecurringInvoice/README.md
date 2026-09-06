# financeEngineRecurringInvoice

Recurring Invoice sub-feature of the Finance Engine.

- Tracking issue: #2387
- Parent issue: #1948 (remains open until all child work under it is reconciled)

## What this module is

This directory holds the contract and documentation for scheduling,
validating, and previewing recurring invoices within the Finance Engine. See
[`financeEngineRecurringInvoice.contract.md`](./financeEngineRecurringInvoice.contract.md)
for the authoritative TypeScript contract (types, function signatures, and
invariants) that any implementation in this directory must satisfy.

## Scope

**In scope for this child issue:**

- Defining the public contract (types/interfaces/function signatures) for
  recurring invoice schedules, next-run-date computation, and invoice preview
  generation.
- Documenting validation rules, invariants, and testing expectations for
  dependent implementation work.

**Explicitly out of scope:**

- Closing the parent issue (#1948).
- Bulk GitHub mutations (issue/PR batch edits, label sweeps, etc.).
- Destructive database operations.
- Rewriting production secrets/credentials.

## Technical requirements

- Strict TypeScript throughout; `any` is not permitted.
- All tests use [vitest](https://vitest.dev/) with the import style:
  ```ts
  import { describe, expect, it } from 'vitest';
  ```
- Tests must assert real, observable behavior (concrete dates, totals, and
  validation error contents) rather than placeholder assertions.

## How to use this contract

Implementations that build on this contract should:

1. Implement the declared functions (`validateRecurringInvoiceSchedule`,
   `computeNextRunDate`, `previewGeneratedInvoice`) exactly as typed in the
   contract file, keeping all functions pure (no I/O) unless the contract is
   revised.
2. Enforce every invariant listed in the contract via validation logic, and
   cover each with a dedicated vitest test case.
3. Keep all new files scoped to `src/features/finance/financeEngineRecurringInvoice/`
   unless a follow-up child issue explicitly expands the scope.

## Completion evidence

- `financeEngineRecurringInvoice.contract.md` created, defining the domain
  model, public function signatures, and invariants for recurring invoices.
- `README.md` (this file) created, documenting scope, usage, and rollback
  guidance.
- No source files outside this directory were modified.
- No dependencies were added; no git, npm, or network commands were executed
  as part of this change.

## Rollback note

This change is purely additive (two new documentation files, no code,
no dependency or configuration changes). To roll back:

```
git rm src/features/finance/financeEngineRecurringInvoice/financeEngineRecurringInvoice.contract.md
git rm src/features/finance/financeEngineRecurringInvoice/README.md
```

Removing the directory has no runtime impact, since no implementation code,
exports, or imports reference it yet.

## Status

Parent issue #1948 remains open. This child issue (#2387) delivers the
contract/documentation layer only; implementation and tests for the
functions declared here are tracked as separate child work and must be
reconciled against this contract before the parent issue can be considered
for closure.
