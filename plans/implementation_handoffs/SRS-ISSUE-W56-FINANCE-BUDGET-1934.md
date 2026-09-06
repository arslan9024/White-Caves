# Software Requirements Specification (SRS)

- ID: SRS-ISSUE-W56-FINANCE-BUDGET-1934
- Child issue: #2445
- Parent issue: #1934
- Track: W56 — Finance Engine, Annual Budget capability
- Status: Draft — scoped to contract/documentation delivery for #2445

## 1. Purpose

Specify the requirements for the Annual Budget capability of the Finance
Engine (`src/features/finance/financeEngineAnnualBudget`), which computes
annual, per-category, and per-month budget summaries (planned vs. actual,
with variance) from a caller-supplied list of monthly budget line items.

## 2. Background

Parent issue #1934 tracks the overall Finance Engine budgeting initiative.
Child issue #2445 delivers the contract and documentation artifacts that
define the shape and behavior of the Annual Budget capability so that
subsequent implementation tasks (source + tests) have an unambiguous,
testable specification to implement against.

## 3. Scope

### 3.1 In Scope

- Requirements for pure, in-memory computation of annual budget summaries.
- Requirements for input validation and typed error reporting.
- Requirements for deterministic, side-effect-free behavior suitable for unit
  testing with vitest.

### 3.2 Out of Scope (Excluded Scope)

- Parent issue closure (#1934 must remain open until all child work is
  reconciled).
- Bulk GitHub mutation of any kind (issue/PR/label batch operations, etc.).
- Destructive database operations (this capability has no database access).
- Production secret rewrites or environment/config changes.
- Persistence, network I/O, or scheduling of budget computations.

## 4. Functional Requirements

| ID    | Requirement                                                                                                                                                                                         |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-1  | The system SHALL provide a pure function that accepts an array of `MonthlyBudgetLineItem` and a `fiscalYear`, and returns an `AnnualBudgetResult`.                                                  |
| FR-2  | The system SHALL validate that every line item's `month` is an integer in `[1, 12]`; violations SHALL produce an `INVALID_MONTH` error referencing the offending item's index.                      |
| FR-3  | The system SHALL validate that `plannedAmount` and, when present, `actualAmount` are finite numbers `>= 0`; violations SHALL produce `NON_FINITE_AMOUNT` or `NEGATIVE_AMOUNT` errors as applicable. |
| FR-4  | The system SHALL validate that all line items share a single `currency`; a mismatch SHALL produce a `CURRENCY_MISMATCH` error.                                                                      |
| FR-5  | The system SHALL reject an empty `lineItems` array with an `EMPTY_INPUT` error.                                                                                                                     |
| FR-6  | When validation fails, the system SHALL return `{ ok: false, errors }` and SHALL NOT return a partial or best-effort summary.                                                                       |
| FR-7  | When validation succeeds, the system SHALL compute `plannedTotal`, `actualTotal`, `variance` (`actual - planned`), and `variancePercent` at the annual level.                                       |
| FR-8  | The system SHALL compute the same planned/actual/variance metrics broken down `byCategory` and `byMonth`.                                                                                           |
| FR-9  | `variancePercent` SHALL be `0` (not `NaN`/`Infinity`) whenever the corresponding `plannedTotal` is `0`.                                                                                             |
| FR-10 | `byCategory` and `byMonth` SHALL be returned in a deterministic, documented sort order (category declaration order; month ascending).                                                               |
| FR-11 | The function SHALL NOT mutate its input arguments and SHALL be referentially deterministic (same input ⇒ same output).                                                                              |

## 5. Non-Functional Requirements

| ID    | Requirement                                                                                                                                      |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| NFR-1 | Implementation SHALL use strict TypeScript with no `any` types.                                                                                  |
| NFR-2 | Implementation SHALL have no network, filesystem, or database dependencies.                                                                      |
| NFR-3 | Test files SHALL use vitest (`import { describe, expect, it } from 'vitest'`) with real behavioral assertions (no placeholder/no-op assertions). |
| NFR-4 | The capability SHALL be safely removable (rollback) by deleting its directory, with no impact on other modules at the time of this issue.        |

## 6. Acceptance Criteria (traced to issue #2445)

1. Implementation remains within the declared child scope described in
   Section 3.
2. Focused tests (vitest) and required validation commands (strict TS
   compilation, existing lint/test scripts for the affected package) pass.
3. Completion evidence (test run output / summary) and this rollback note are
   recorded alongside the change (see SDD document, Section "Rollback Plan").
4. Parent issue #1934 remains open until all of its child issues, including
   this one, are reconciled — this document does not authorize closing #1934.

## 7. Traceability

- Contract source of truth: `src/features/finance/financeEngineAnnualBudget/financeEngineAnnualBudget.contract.md`
- Module overview: `src/features/finance/financeEngineAnnualBudget/README.md`
- Design detail: `plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-BUDGET-1934.md`
