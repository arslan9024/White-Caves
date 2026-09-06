# Contract: financeEngineUaeCorporate

- **Issue:** #2439 (child of parent #1935)
- **Module path:** `src/features/finance/financeEngineUaeCorporate/`
- **Status:** Draft contract — scoped documentation handoff only. No runtime code is introduced by this change set.

## 1. Purpose

Defines the boundary contract for the UAE Corporate Tax calculation engine used by the
White Caves finance module. This engine is responsible for computing UAE Corporate Tax
liability for in-scope entities based on Federal Decree-Law No. 47 of 2022 (as amended)
and its executive regulations, restricted to the White Caves real-estate/CRM business
context (property sales commissions, brokerage revenue, and related deductible expenses).

This contract does not implement business logic. It declares the expected public surface,
inputs, outputs, and invariants that a future implementation PR must satisfy so that
downstream consumers (accounting exports, dashboards, compliance reports) can integrate
against a stable interface.

## 2. Scope

### In scope

- Defining the public TypeScript interface shape for a UAE Corporate Tax computation
  engine (`FinanceEngineUaeCorporateInput`, `FinanceEngineUaeCorporateResult`,
  `FinanceEngineUaeCorporate` service contract).
- Declaring supported tax bands, the AED 375,000 small business relief threshold, and the
  9% standard corporate tax rate as configurable, versioned constants (not hard-coded
  magic numbers) so that rate changes do not require contract changes.
- Declaring validation and error-handling expectations (invalid currency, negative taxable
  income, missing tax period).
- Declaring audit/traceability requirements (every computation must be reproducible from
  its recorded inputs and the rate table version used).

### Out of scope (excluded per issue #2439)

- Parent issue #1935 closure.
- Bulk GitHub mutation of any kind.
- Destructive database operations (no migrations, no data deletion).
- Production secret rewrites (no `.env`, credentials, or secret store changes).
- Actual implementation of the calculation engine's runtime code — this handoff is
  documentation/contract only; implementation is tracked in a separate child issue.

## 3. Public Interface (target shape)

```ts
export interface FinanceEngineUaeCorporateInput {
  /** ISO 4217 currency code; engine only accepts 'AED' for this jurisdiction. */
  currency: 'AED';
  /** Tax period start (inclusive), ISO-8601 date string. */
  periodStart: string;
  /** Tax period end (inclusive), ISO-8601 date string. */
  periodEnd: string;
  /** Gross accounting profit before corporate tax adjustments, in fils-free AED. */
  accountingProfit: number;
  /** Sum of non-deductible expenses to be added back per FDL 47/2022. */
  nonDeductibleAddBacks: number;
  /** Sum of exempt income to be excluded from the taxable base. */
  exemptIncome: number;
  /** Version identifier of the rate table applied (for audit reproducibility). */
  rateTableVersion: string;
}

export interface FinanceEngineUaeCorporateResult {
  taxablePeriodStart: string;
  taxablePeriodEnd: string;
  taxableIncome: number;
  smallBusinessReliefApplied: boolean;
  taxDue: number;
  effectiveRate: number;
  rateTableVersion: string;
  calculatedAtIso: string;
}

export interface FinanceEngineUaeCorporate {
  calculate(input: FinanceEngineUaeCorporateInput): FinanceEngineUaeCorporateResult;
}
```

## 4. Invariants

1. `taxableIncome = accountingProfit + nonDeductibleAddBacks - exemptIncome`, floored at 0.
2. If `taxableIncome <= 375000` (small business relief threshold), `taxDue = 0` and
   `smallBusinessReliefApplied = true`.
3. Otherwise `taxDue = (taxableIncome - 375000) * 0.09`, rounded to 2 decimal places.
4. `effectiveRate = taxDue / taxableIncome` when `taxableIncome > 0`, else `0`.
5. `currency` must equal `'AED'`; any other value must be rejected by the implementation
   with a typed validation error (contract does not prescribe error class name yet —
   deferred to implementation PR, must be documented there).
6. Every result must be traceable to the exact `rateTableVersion` supplied — the engine
   must never silently substitute a different rate table.

## 5. Non-functional requirements

- Strict TypeScript; no `any` types anywhere in the eventual implementation.
- Pure function semantics for `calculate` — no I/O, no hidden global state.
- Deterministic output for identical input (required for audit reproducibility).

## 6. Acceptance criteria for implementing PR

- Implementation remains within `src/features/finance/financeEngineUaeCorporate/`.
- Focused unit tests (vitest, `import { describe, expect, it } from 'vitest'`) cover:
  standard rate calculation, small business relief boundary (exactly at 375,000 and one
  AED above/below), zero/negative taxable income clamping, and rate-table version
  pass-through. Assertions must exercise real computed values — no placeholder
  `expect(true).toBe(true)` style tests.
- Strict TypeScript throughout the implementation; no `any` types.
- Required validation commands (typecheck, lint, unit test) pass before merge.
- Completion evidence and a rollback note are recorded in the PR description.
- Parent issue #1935 remains open until all sibling child issues are reconciled.

## 7. Change log

- 2026-09-06 — Issue #2439: re-confirmed contract scope and acceptance criteria against
  the child-issue tracking template; no interface changes were required — the existing
  draft already satisfied the declared scope (documentation/contract only, no runtime
  code, parent #1935 left open). Corrected issue cross-references from a prior draft
  number (#2441) to the current tracking issue (#2439).
