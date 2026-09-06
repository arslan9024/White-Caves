# financeEngineDoubleEntry

Double-entry bookkeeping engine for the White Caves finance/ledger subsystem.

- **Parent issue**: #1926 (SRS/SDD: W56 Finance Ledger)
- **Child issue**: #2478 (this scope; sibling scope #2479 covers the same double-entry engine)
- **Behavioral contract**: [`financeEngineDoubleEntry.contract.md`](./financeEngineDoubleEntry.contract.md)

## What this module is

A pure, deterministic engine that constructs, validates, posts, and reverses double-entry ledger
transactions, and derives account balances from posted transaction history. It has no I/O: no
database access, no network calls, no HTTP routes. It is designed to be wrapped by a persistence
adapter and/or API layer in a later, separately scoped child issue.

## What this module is not

- Not a persistence layer. `postTransaction` operates on an in-memory `ledgerState` argument
  supplied by the caller; storing that state durably is out of scope here.
- Not a currency-conversion service. Transactions are single-currency by contract; multi-currency
  flows are represented as linked transactions built elsewhere.
- Not an API surface. No Express routes or controllers are introduced by this scope.

## Design decisions

- **Integer minor-unit amounts only.** Money is represented as integers (fils/cents), never
  floating point, to avoid rounding drift across debit/credit balancing.
- **Validation returns data, not exceptions.** `validateTransaction` returns a discriminated
  `ValidationResult` union so callers (e.g. UI forms, batch import jobs) can surface every
  validation failure at once instead of stopping at the first thrown error.
- **Idempotent posting by `reference`.** Financial event producers (booking service, payout
  service) may retry; posting the same `reference` twice must not double-post. This is enforced
  as a contract invariant rather than left to callers.
- **Reversals are new transactions.** Once posted, a transaction is immutable; corrections are
  modeled as reversing transactions referencing the original via `metadata.reversalOf`, preserving
  a full audit trail.

## Status

This directory currently contains the behavioral contract only. Concrete TypeScript
implementation and its vitest suite are tracked as follow-up work under parent #1926 and must
conform to the contract in `financeEngineDoubleEntry.contract.md`, including the required test
coverage enumerated in section 6 of that document.

## Scope boundaries (excluded from this and dependent child issues)

- Parent issue #1926 closure.
- Bulk GitHub mutation.
- Destructive database operations.
- Production secret rewrites.

## Completion evidence

- This child scope (#2478) is documentation-only: it defines/refines the behavioral contract in
  `financeEngineDoubleEntry.contract.md` and this README. No TypeScript source, no test files, and
  no dependency manifests were added or modified.
- Validation performed for this scope: manual review confirming (a) both files exist at the exact
  paths declared for issue #2478, (b) all invariants, required operations, error-handling rules,
  and the 10-point test contract in section 6 of the contract doc are internally consistent and
  unambiguous, (c) no exported TypeScript symbols exist yet to preserve, so none were dropped, and
  (d) scope boundaries (no parent closure, no bulk GitHub mutation, no destructive DB operations,
  no secret rewrites) are respected — see "Scope boundaries" above.
- Because no `.ts`/`.tsx` files are introduced by this scope, there are no vitest suites or
  `tsc`/lint commands to run here; the required vitest coverage (section 6 of the contract) is
  deferred to the follow-up implementation child issue that adds the concrete engine module.
- Parent issue #1926 remains open; this child issue's documentation is one of several sibling
  scopes (including #2479) that must all be reconciled before any parent-level closure is
  considered — which is explicitly out of scope here.

## Rollback

This scope only adds documentation files under `src/features/finance/financeEngineDoubleEntry/`
and `plans/implementation_handoffs/`. To roll back, delete:

- `src/features/finance/financeEngineDoubleEntry/financeEngineDoubleEntry.contract.md`
- `src/features/finance/financeEngineDoubleEntry/README.md`
- `plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-LEDGER-1926.md`
- `plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-LEDGER-1926.md`

No source code, dependencies, or database state are touched by this change, so no additional
rollback steps are required.
