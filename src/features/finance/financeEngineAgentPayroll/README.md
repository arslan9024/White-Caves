# financeEngineAgentPayroll

Sub-module of the White Caves finance engine that computes agent payroll
(commission-derived payout) data. This module is being built incrementally
under issue #2456, a child of parent issue #1931.

## Status

Documentation-only pass complete. See
[`financeEngineAgentPayroll.contract.md`](./financeEngineAgentPayroll.contract.md)
for the full interface contract, behavioral rules, and validation
requirements that any implementation in this directory must satisfy.
Implementation (`.ts` source + `vitest` unit tests) is tracked as follow-up
work under the same parent issue and is intentionally **not** included in
this pass.

## Scope of this issue (#2456)

**In scope:**

- Module contract (`financeEngineAgentPayroll.contract.md`) defining public
  types, calculation rules, and validation behavior.
- This README describing purpose, scope, and usage guidance.

**Explicitly excluded:**

- Closing the parent issue (#1931).
- Bulk GitHub mutations (issue/PR updates across the repo).
- Destructive database operations.
- Rewriting production secrets.

## Planned Public API

Once implemented, this module will export:

- `AgentPayrollLineItem`, `AgentPayrollRunSummary`, `AgentPayrollInput` —
  TypeScript interfaces (see contract).
- `computeAgentPayrollLineItem(input: AgentPayrollInput): AgentPayrollLineItem`
  — pure function computing a single agent's payroll line item.
- `buildAgentPayrollRunSummary(runId, periodStart, periodEnd, lineItems)` —
  pure function aggregating line items into a run summary.

All functions are pure (no I/O), strictly typed (no `any`), and validated per
the rules in the contract document.

## Testing

When implementation lands, tests will use `vitest`:

```ts
import { describe, expect, it } from 'vitest';
```

Tests must assert real computed values (rounding, currency defaults, summary
totals, and thrown error types) rather than placeholder assertions, per the
project's testing standards.

## Relationship to Parent Issue

This child issue (#2456) contributes contract/documentation artifacts only.
The parent issue (#1931) tracks the full finance engine agent payroll effort
and **remains open** until all child issues — including implementation and
integration — are completed and reconciled.

## Rollback

This is a documentation-only addition. To roll back, delete this directory
(`src/features/finance/financeEngineAgentPayroll/`) entirely; no other files,
dependencies, or external state are affected.
