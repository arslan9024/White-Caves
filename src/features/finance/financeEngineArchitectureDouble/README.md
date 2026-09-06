# financeEngineArchitectureDouble

Issue: #2483 — child of parent issue #1925.

## What this is

A test-double module scope for the finance engine, used so that other features (Redux slices,
API route handlers, React components) can be unit- and integration-tested against a realistic,
deterministic in-memory stand-in for the finance engine, instead of depending on the real
implementation, a live database, or external payment/FX services.

This directory currently holds the **contract** for that double
(`financeEngineArchitectureDouble.contract.md`). The contract is the source of truth for the
double's public behavior; concrete TypeScript source files implementing the double are delivered
by the implementation work tracked under parent issue #1925 and MUST conform to this contract.

## Why a "double" and not a mock

A hand-rolled per-test mock (e.g. `vi.fn()` stubs) tends to encode assumptions about _how_ a
consumer calls the finance engine rather than _what_ the finance engine actually guarantees. A
double is a small, real, in-memory implementation: it validates input, maintains a ledger, and
computes a real running balance, so tests exercise genuine behavior (e.g. "recording a debit then
a credit yields the correct net balance") instead of asserting that a mock was called with certain
arguments.

This aligns with the project's test policy: assertions must reflect real behavior, never
placeholder/tautological checks.

## How to use it (once implemented)

```ts
import { createFinanceEngineDouble } from './financeEngineArchitectureDouble';

const engine = createFinanceEngineDouble({ seed: 'unit-test-seed' });

engine.recordTransaction({ amount: 500, description: 'Deposit' });
engine.recordTransaction({ amount: -120, description: 'Fee' });

expect(engine.getBalance()).toBe(380);
```

## Determinism guarantees

- Same seed ⇒ same computed outputs, every run, every machine.
- No hidden network or database calls.
- `reset()` returns the double to its just-constructed state.

See `financeEngineArchitectureDouble.contract.md` for the full behavioral contract, including the
error contract (`FinanceEngineValidationError` with a stable `code`).

## Scope boundaries

This module scope, and this issue (#2483), cover only the double's contract and its documentation
handoff artifacts. It does **not**:

- close parent issue #1925,
- perform bulk GitHub mutations,
- perform destructive database operations, or
- rewrite production secrets.

The parent issue (#1925) remains open until all of its child issues, including any that implement
the double described here, are reconciled.

## Related documents

- `financeEngineArchitectureDouble.contract.md` — behavioral contract for this module.
- `../../../../plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-SPEC-1925.md` — software
  requirements specification handoff for the W56 finance spec work stream.
- `../../../../plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-SPEC-1925.md` — software design
  document handoff for the same work stream.
