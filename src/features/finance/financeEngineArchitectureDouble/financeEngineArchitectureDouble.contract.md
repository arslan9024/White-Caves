# Finance Engine Architecture Double — Contract

Issue: #2483 (child of parent issue #1925)

## Purpose

This document specifies the behavioral contract for the **Finance Engine Architecture Double** — a
lightweight, deterministic test double that stands in for the real finance engine during unit and
integration testing of consumers (Redux slices, React components, API route handlers) without
requiring the full finance engine implementation, external services, or a live database.

The double is **not** a mock of a single function; it is a scoped, in-memory implementation of the
finance engine's public surface that produces realistic, deterministic outputs so that dependent
code can be exercised under real behavioral assertions (per project test policy: no placeholder
assertions).

## Scope

In scope for this child issue (#2483):

- Defining the contract (this file) for the finance engine double's public interface.
- Documenting usage, guarantees, and limitations in `README.md`.
- Recording the SRS/SDD handoff artifacts under `plans/implementation_handoffs/`.

Out of scope (excluded per issue directive):

- Closing the parent issue (#1925).
- Bulk GitHub mutations (labels, milestones, cross-issue edits).
- Destructive database operations of any kind.
- Rewriting or rotating production secrets.
- Implementing the production finance engine itself (tracked separately under #1925).

## Public Interface Contract

The double exposes the following conceptual surface. Concrete TypeScript types/functions are
introduced by the implementation issue(s) referenced from #1925; this contract fixes their
observable behavior so downstream consumers and tests do not need to change when the double's
internals evolve.

### 1. `createFinanceEngineDouble(seed?: FinanceEngineSeed): FinanceEngineDouble`

- **Determinism**: Given the same `seed`, all computed outputs (totals, projections, currency
  conversions, commission breakdowns) MUST be identical across calls and across process restarts.
  No `Math.random()` or wall-clock (`Date.now()`) values may leak into computed results unless the
  seed explicitly supplies a fixed clock.
- **No network/database access**: The double MUST NOT perform any I/O. All state is held in memory
  for the lifetime of the instance.
- **Isolation**: Each call to `createFinanceEngineDouble` returns an independent instance; mutating
  one instance's ledger MUST NOT affect another instance.

### 2. `FinanceEngineDouble.recordTransaction(input: TransactionInput): TransactionRecord`

- Validates `input.amount` is a finite number and rejects `NaN`/`Infinity` by throwing a typed
  `FinanceEngineValidationError`.
- Returns a `TransactionRecord` with a deterministic, monotonically increasing `id` (per instance).
- Running balance exposed via `FinanceEngineDouble.getBalance()` MUST reflect the sum of all
  recorded transactions' signed amounts (credits positive, debits negative).

### 3. `FinanceEngineDouble.getBalance(): number`

- Pure read; MUST NOT mutate state.
- MUST equal the arithmetic sum of all `TransactionRecord.amount` values recorded so far, computed
  with standard IEEE-754 double arithmetic (no hidden rounding beyond what JS numbers impose).

### 4. `FinanceEngineDouble.getLedger(): ReadonlyArray<TransactionRecord>`

- Returns transactions in insertion order.
- The returned array MUST be a defensive copy (or otherwise immutable) — callers mutating the
  returned array MUST NOT affect the double's internal ledger.

### 5. `FinanceEngineDouble.reset(): void`

- Clears the ledger and resets the balance to `0` and the id counter to its initial value.
- After `reset()`, behavior MUST be indistinguishable from a freshly constructed double with the
  same seed.

## Error Contract

- All thrown errors MUST be instances of `FinanceEngineValidationError` (or a subclass), never bare
  `Error` or `string` throws, so consumers can use `instanceof` checks safely.
- Errors MUST carry a stable `code` field (string union) so tests can assert on the failure reason
  without string-matching the message.

## Non-Goals

- The double does not implement multi-currency FX rate fetching, tax computation, or persistence.
  Those remain the responsibility of the real finance engine and are tracked under parent issue
  #1925 and its other child issues.
- The double is not a performance benchmark target; it favors clarity and determinism over speed.

## Compatibility

Consumers depending on this contract should treat it as append-only: new optional fields/methods
may be added without a major version bump, but existing method signatures and error codes defined
above MUST NOT change without updating this contract and notifying dependents listed under #1925.
