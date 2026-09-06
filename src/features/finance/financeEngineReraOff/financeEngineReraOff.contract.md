# Finance Engine — RERA-Off Contract

**Issue:** #2383
**Parent issue:** #1949
**Module:** `src/features/finance/financeEngineReraOff`

## Purpose

Defines the behavioral contract for the finance engine's RERA-off calculation
mode. This mode computes payment plans, milestone allocations, and disbursement
schedules for transactions that fall **outside** RERA (Real Estate Regulatory
Authority) escrow governance — e.g. off-plan cash deals, non-UAE jurisdictions,
or internal test fixtures explicitly flagged as RERA-exempt.

This document is a scope-and-behavior contract only. It does not itself
constitute an implementation; it defines the inputs, outputs, invariants, and
error conditions that any future `financeEngineReraOff` implementation must
satisfy.

## Scope

### In scope

- Declaring the input/output shape for RERA-off payment plan generation.
- Declaring validation invariants (percentage totals, milestone ordering,
  currency consistency) that any implementation must enforce.
- Declaring error conditions and their expected error codes/messages.
- Declaring the boundary between this module and RERA-on finance logic
  (they must never share mutable state or silently fall back into each
  other).

### Out of scope (excluded per issue #2383)

- Parent issue closure (#1949 remains open until all child work reconciles).
- Bulk GitHub mutations of any kind.
- Destructive database operations (drops, truncates, irreversible migrations).
- Production secret rewrites (env vars, credentials, signing keys).
- Any RERA-on engine changes — this contract only governs the RERA-off path.

## Data Contract

### Input: `FinancePlanRequestReraOff`

| Field          | Type                                                                  | Required | Notes                                                                               |
| -------------- | --------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------- |
| `totalPrice`   | `number`                                                              | yes      | Must be `> 0`, finite.                                                              |
| `currency`     | `string`                                                              | yes      | ISO 4217 code, e.g. `"AED"`, `"USD"`.                                               |
| `milestones`   | `Array<{ label: string; percentage: number; dueOffsetDays: number }>` | yes      | Must sum to exactly `100`. `dueOffsetDays` must be non-decreasing across the array. |
| `isReraExempt` | `true`                                                                | yes      | Literal `true`; guards against accidental use on RERA-governed deals.               |

### Output: `FinancePlanReraOff`

| Field               | Type                                                              | Notes                                                                         |
| ------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `totalPrice`        | `number`                                                          | Echoed from input.                                                            |
| `currency`          | `string`                                                          | Echoed from input.                                                            |
| `installments`      | `Array<{ label: string; amount: number; dueOffsetDays: number }>` | `amount` derived from `percentage * totalPrice / 100`, rounded to 2 decimals. |
| `sumOfInstallments` | `number`                                                          | Must equal `totalPrice` within a `0.01` rounding tolerance.                   |

## Invariants

1. **Percentage totality** — `milestones[].percentage` must sum to exactly
   `100` (± `1e-9` floating point tolerance). Violation throws
   `FinanceReraOffError('MILESTONE_PERCENTAGE_MISMATCH')`.
2. **Non-negative pricing** — `totalPrice` must be a positive finite number.
   Violation throws `FinanceReraOffError('INVALID_TOTAL_PRICE')`.
3. **Milestone ordering** — `dueOffsetDays` must be non-decreasing across the
   milestone array (no milestone may be due before an earlier-listed one).
   Violation throws `FinanceReraOffError('MILESTONE_ORDER_INVALID')`.
4. **Rounding conservation** — the sum of rounded `installments[].amount`
   must reconcile to `totalPrice` within `0.01` currency units; any residual
   cent difference is allocated to the **final** installment to avoid
   under/over-collection.
5. **Explicit exemption flag** — `isReraExempt` must be the literal `true`.
   This prevents silent reuse of this contract for RERA-governed
   transactions; violation throws `FinanceReraOffError('NOT_RERA_EXEMPT')`.
6. **No cross-module fallback** — implementations of this contract must not
   import from or delegate to any RERA-on finance engine module, and vice
   versa.

## Error Codes

| Code                            | Condition                                       |
| ------------------------------- | ----------------------------------------------- |
| `INVALID_TOTAL_PRICE`           | `totalPrice <= 0` or non-finite.                |
| `MILESTONE_PERCENTAGE_MISMATCH` | Milestone percentages do not sum to 100.        |
| `MILESTONE_ORDER_INVALID`       | `dueOffsetDays` sequence is not non-decreasing. |
| `NOT_RERA_EXEMPT`               | `isReraExempt` is not literal `true`.           |
| `EMPTY_MILESTONE_LIST`          | `milestones` array has zero entries.            |

## Reconciliation Status

- **Status:** contract-only deliverable for child issue #2383.
- Parent issue **#1949 remains open** — this child task does not close it.
- No production code, schema, or secret changes are introduced by this
  contract document.

## Rollback

This is a documentation-only artifact. To roll back, delete this file:

```
src/features/finance/financeEngineReraOff/financeEngineReraOff.contract.md
```

No code, dependency, schema, or runtime behavior is affected by this file
existing or being removed.
