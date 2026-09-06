# financeEngineQuarterlyVat

Quarterly VAT (Value Added Tax) calculation engine for the `finance` feature
area. This module is being scaffolded incrementally under parent issue
**#1945**; this pass (child issue **#2399**) adds only the module contract
and this overview — no runtime TypeScript source is included yet.

## Status

- ✅ Contract defined — see [`financeEngineQuarterlyVat.contract.md`](./financeEngineQuarterlyVat.contract.md).
- ⏳ Implementation (`financeEngineQuarterlyVat.ts` / `index.ts`) — pending,
  tracked as a follow-up child issue under #1945.
- ⏳ Vitest suite (`financeEngineQuarterlyVat.test.ts`) — pending, to be
  added alongside the implementation.

## What this module will do

`financeEngineQuarterlyVat` will compute VAT summaries (net, VAT, and gross
totals, broken down by rate) for a given fiscal quarter, given a list of
taxable line items. It is intended to be a pure, side-effect-free calculation
utility consumed by higher-level finance reporting features — it does not
perform persistence, network calls, or GitHub/issue-tracker interactions of
any kind.

## Directory layout

```
src/features/finance/financeEngineQuarterlyVat/
├── financeEngineQuarterlyVat.contract.md   # Public contract & invariants (source of truth)
└── README.md                               # This file
```

Future files (not part of this change):

```
├── financeEngineQuarterlyVat.ts            # Implementation
└── financeEngineQuarterlyVat.test.ts       # Vitest specs
```

## Design decisions

- **Docs-first scaffolding**: this child issue intentionally ships only the
  contract and README so the public API, invariants, and test expectations
  are agreed upon before any implementation code is written, reducing churn
  on the eventual TypeScript source.
- **Pure-function boundary**: the planned `calculateQuarterlyVat` function is
  scoped as a pure computation (no I/O), keeping it trivially unit-testable
  and reusable across reporting/UI contexts.

## Validation

Once implemented, run from the repository root:

```
npx vitest run src/features/finance/financeEngineQuarterlyVat
npx tsc --noEmit
```

## Scope & exclusions

This module and its child issue (#2399) do **not**:

- Close the parent issue (#1945) — it remains open until all child work
  under it is reconciled.
- Perform bulk GitHub mutations.
- Perform destructive database operations.
- Rewrite production secrets.

## Rollback

Deleting the `src/features/finance/financeEngineQuarterlyVat/` directory
fully reverts this change; no other files were modified.
