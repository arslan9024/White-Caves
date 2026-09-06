# Finance Engine Architecture Double

> Child of #1925 (Finance Engine Architecture) · Tracked as #2483

## What this is

This directory documents the **contract** that a "finance engine architecture double" must satisfy. A double is a deterministic, in-memory stand-in for the real finance engine, used so that consumers (UI, API handlers, reporting) can be built and tested against a stable interface while the real engine's business logic is implemented across the remaining child issues of #1925.

This issue (#2483) delivers **specification and handoff documentation only** — no production runtime code, no database access, and no GitHub mutation. See:

- [`financeEngineArchitectureDouble.contract.md`](./financeEngineArchitectureDouble.contract.md) — the behavioral contract (interface shape, invariants, validation rules) that both the real engine and any test double must honor.
- [`../../../../plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-SPEC-1925.md`](../../../../plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-SPEC-1925.md) — Software Requirements Specification for the W56 finance work stream.
- [`../../../../plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-SPEC-1925.md`](../../../../plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-SPEC-1925.md) — Software Design Description translating those requirements into an implementable architecture.

## Why a "double" instead of mocking ad hoc

Rather than letting each consumer hand-roll its own mock of finance calculations (leading to drift and inconsistent test fixtures), the finance engine is specified as an interface (`FinanceEngine`) first. A single shared double implementing that interface can then be reused across test suites, guaranteeing that:

- Tests exercise the same shape of data the real engine will eventually return.
- When the real engine ships, swapping the binding at the composition root is the only change required — call sites and test expectations built against the contract remain valid.

## Scope boundaries (this issue only)

**In scope:**

- Contract documentation for the finance engine double.
- SRS/SDD handoff documents for the parent work stream (W56 / #1925), scoped to this child's contribution.

**Out of scope (explicitly excluded):**

- Closing parent issue #1925.
- Bulk GitHub mutations (labels, milestones, cross-issue edits).
- Destructive database operations.
- Production secret rewrites.
- Implementing the real finance engine's business logic (rates, tax tables, commission tiers) — tracked in other child issues.

## Status

Parent issue #1925 remains **open**; this child (#2483) contributes documentation artifacts only and does not reconcile or close the parent. Further child issues under #1925 are expected to implement the real engine and its test doubles in code.

## Rollback

These are additive, standalone documentation files. To roll back this change, delete:

- `src/features/finance/financeEngineArchitectureDouble/financeEngineArchitectureDouble.contract.md`
- `src/features/finance/financeEngineArchitectureDouble/README.md`
- `plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-SPEC-1925.md`
- `plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-SPEC-1925.md`

No other files, dependencies, or generated artifacts are affected. No database, secret, or GitHub state was mutated by this change.
