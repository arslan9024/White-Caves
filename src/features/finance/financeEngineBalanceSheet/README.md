# Finance Engine — Balance Sheet

Status: contract-only (documentation) increment. See `financeEngineBalanceSheet.contract.md`
for the full behavioral contract, invariants, and test obligations.

- **Issue:** #2406
- **Parent issue:** #1943 (remains open until all child work is reconciled)

## What this module will do

Once implemented, this module derives a point-in-time balance sheet
(assets, liabilities, equity) from normalized finance engine account data
and exposes a single strictly-typed entry point, `buildBalanceSheet`, plus
its supporting types (`BalanceSheetAccount`, `BalanceSheetInput`,
`BalanceSheetSection`, `BalanceSheetReport`).

## Scope

- Location: `src/features/finance/financeEngineBalanceSheet/`
- In scope: typed contract, computation invariants, test obligations for a
  follow-up implementation increment.
- Out of scope: parent issue closure, bulk GitHub mutation, destructive
  database operations, production secret rewrites, and any file outside
  this directory.

## Why contract-first

The Finance Engine has multiple sub-modules feeding shared reporting
surfaces. Recording the public API, invariants, and test obligations before
writing implementation code lets reviewers validate the shape and
correctness rules independently of any specific implementation, and gives
the follow-up implementation increment an unambiguous, testable target.

## Next steps (follow-up increment)

1. Implement `buildBalanceSheet` and its types in a
   `financeEngineBalanceSheet.ts` (or similarly named) module inside this
   directory, matching the contract in `financeEngineBalanceSheet.contract.md`
   exactly.
2. Add a `financeEngineBalanceSheet.test.ts` using `vitest`
   (`import { describe, expect, it } from 'vitest'`) covering every test
   obligation listed in the contract with real behavior assertions.
3. Wire the module into any consuming reporting/export feature only after
   its own tests pass in isolation.

## Rollback

This documentation-only increment can be removed by deleting this
directory (`src/features/finance/financeEngineBalanceSheet/`). No other
files were changed.
