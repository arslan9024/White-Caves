# Finance Engine — Annual Budget

- Issue: #2445
- Parent issue: #1934 (remains open until all child work under it is reconciled)
- Location: `src/features/finance/financeEngineAnnualBudget`

## Overview

This module defines the annual budget computation contract for the Finance
Engine feature area. It is a **pure calculation module**: given a set of
monthly budget line items for a fiscal year, it derives:

- An overall annual planned/actual/variance summary.
- Per-category planned/actual/variance breakdowns.
- Per-month planned/actual/variance breakdowns.

No network calls, database access, or scheduling are performed by this module.
See [`financeEngineAnnualBudget.contract.md`](./financeEngineAnnualBudget.contract.md)
for the full type contract and invariants.

## Scope

**In scope**

- Type definitions and computation rules for annual budget aggregation.
- Input validation with typed, non-throwing error results.
- Variance calculation (planned vs. actual) at category and annual level.

**Out of scope (per issue #2445)**

- Closing parent issue #1934.
- Bulk GitHub mutations.
- Destructive database operations.
- Production secret rewrites.
- Persistence/storage of budgets (left to a future consuming feature/service).

## Status

This issue (#2445) establishes the contract and documentation for the annual
budget capability. Implementation code (TypeScript source and vitest test
files) is tracked and delivered under the corresponding implementation task(s)
referenced by the SRS/SDD handoff documents in
`plans/implementation_handoffs/`:

- `plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-BUDGET-1934.md`
- `plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-BUDGET-1934.md`

## Validation

Before any implementation lands in this directory, it must:

1. Compile under strict TypeScript with no `any` types.
2. Include vitest test files (`import { describe, expect, it } from 'vitest'`)
   with real behavior assertions covering the invariants in the contract
   document (validation errors, variance math, determinism, sort order).
3. Pass the repository's existing test and lint commands for the affected
   package/workspace only — no new tooling is introduced.

## Rollback

This module is self-contained and additive. To roll back, delete the
`src/features/finance/financeEngineAnnualBudget` directory. As of issue #2445,
no other module imports from it, so removal has no downstream impact. Parent
issue #1934 tracks the broader finance budget initiative and should remain
open until all of its child issues (including future implementation and
wiring work) are reconciled.
