# financeEngineDoubleEntry

Double-entry bookkeeping engine for the White Caves finance/ledger subsystem.

- **Parent issue**: #1926 (SRS/SDD: W56 Finance Ledger)
- **Child issue**: #2479 (this scope)
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

## Rollback

This scope only adds documentation files under `src/features/finance/financeEngineDoubleEntry/`
and `plans/implementation_handoffs/`. To roll back, delete:

- `src/features/finance/financeEngineDoubleEntry/financeEngineDoubleEntry.contract.md`
- `src/features/finance/financeEngineDoubleEntry/README.md`
- `plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-LEDGER-1926.md`
- `plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-LEDGER-1926.md`

No source code, dependencies, or database state are touched by this change, so no additional
rollback steps are required.
