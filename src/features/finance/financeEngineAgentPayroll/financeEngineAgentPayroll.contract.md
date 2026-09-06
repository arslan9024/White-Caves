# Finance Engine Agent Payroll — Contract

**Parent issue:** #1931
**Child issue:** #2456
**Status:** In progress (child scope only — parent issue remains open until all child work is reconciled)

## Purpose

Defines the interface contract for the `financeEngineAgentPayroll` module, the
sub-component of the White Caves finance engine responsible for computing and
reconciling agent payroll (commission-linked payout) data. This document is
the source of truth for the module's public surface; implementation code must
conform to it, and any divergence discovered during testing should be
resolved in favor of this contract.

## Scope

### In scope

- Defining TypeScript types/interfaces for agent payroll line items, payroll
  runs, and payroll summaries consumed by the finance engine.
- Defining the calculation contract (pure function signatures) for deriving
  payroll amounts from commission and adjustment inputs.
- Documenting validation rules and error conditions for payroll computation.

### Out of scope (excluded from this child issue)

- Parent issue (#1931) closure.
- Bulk GitHub mutation of related issues/PRs.
- Destructive database operations (deletes/truncates against payroll or
  finance tables).
- Production secret rewrites (API keys, DB credentials, etc.).
- Persistence layer / database schema changes.
- UI components consuming this data.

## Public Interfaces

```ts
/** Single payroll line item for one agent within a payroll run. */
export interface AgentPayrollLineItem {
  agentId: string;
  agentName: string;
  grossCommission: number;
  adjustments: number;
  deductions: number;
  netPayout: number;
  currency: string;
}

/** Aggregate result for a payroll run across all agents. */
export interface AgentPayrollRunSummary {
  runId: string;
  periodStart: string; // ISO date
  periodEnd: string; // ISO date
  lineItems: readonly AgentPayrollLineItem[];
  totalGrossCommission: number;
  totalNetPayout: number;
  generatedAt: string; // ISO datetime
}

/** Input required to compute a single agent's payroll line item. */
export interface AgentPayrollInput {
  agentId: string;
  agentName: string;
  grossCommission: number;
  adjustments?: number;
  deductions?: number;
  currency?: string;
}
```

## Behavioral Rules

1. `grossCommission`, `adjustments`, and `deductions` must be finite numbers;
   negative `grossCommission` is invalid and must be rejected.
2. `netPayout = grossCommission + adjustments - deductions`, rounded to 2
   decimal places.
3. `currency` defaults to `"AED"` when omitted.
4. A payroll run summary's totals must equal the sum of its line items'
   corresponding fields (within floating-point rounding tolerance of 0.01).
5. Computation functions must be pure (no I/O, no mutation of inputs) so they
   remain safely testable and reusable by the broader finance engine.

## Validation & Error Conditions

- Invalid numeric input (NaN, Infinity, negative gross commission) throws a
  `RangeError` with a descriptive message.
- Empty `agentId` or `agentName` throws a `TypeError`.
- Empty `lineItems` array when building a summary is valid and yields zeroed
  totals (not an error).

## Testing Requirements

- Unit tests (vitest) must assert real computed values (rounding, defaults,
  totals aggregation, and error paths) — no placeholder assertions.
- Tests live alongside implementation modules under this feature directory
  once implementation files are added in a follow-up child issue.

## Completion Evidence

- This contract and the accompanying `README.md` were authored to define the
  module surface ahead of implementation, per child issue #2456.
- No runtime/implementation `.ts` source files were introduced in this pass;
  only documentation artifacts were added, keeping the change within the
  declared child scope (contract + docs).

## Rollback Note

To roll back this change, delete:

- `src/features/finance/financeEngineAgentPayroll/financeEngineAgentPayroll.contract.md`
- `src/features/finance/financeEngineAgentPayroll/README.md`

No other files, dependencies, database state, or GitHub issues are affected
by this change, so rollback is a simple file deletion with no side effects.
