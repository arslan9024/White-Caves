# Software Design Description (SDD)

## Work Stream W56 — Finance Engine Architecture

### Parent Issue: #1925 · Child Issue: #2483 (Finance Engine Architecture Double)

## 1. Introduction

This SDD translates the requirements in `SRS-ISSUE-W56-FINANCE-SPEC-1925.md` into an implementable architecture for the finance engine and its test double. It is a design/handoff artifact; concrete `.ts` implementations of the engine and double are delivered under separate child issues of parent #1925, guided by this design.

## 2. Architectural Overview

```
                        ┌───────────────────────────┐
                        │   FinanceEngine (interface) │
                        └───────────────┬───────────┘
                                        │ implements
              ┌─────────────────────────┼─────────────────────────┐
              │                                                     │
  ┌───────────────────────────┐                     ┌───────────────────────────┐
  │  RealFinanceEngine         │                     │  FinanceEngineDouble        │
  │  (production, later issue) │                     │  (test/dev, later issue)     │
  │  - reads config/rate tables│                     │  - fixed default config      │
  │  - no network/db calls in  │                     │  - overridable per test       │
  │    core computation methods│                     │  - sub-ms, in-memory only     │
  └───────────────────────────┘                     └───────────────────────────┘
              ▲                                                     ▲
              │                                                     │
              └───────────────── consumed via ─────────────────────┘
                                        │
                  ┌─────────────────────┴─────────────────────┐
                  │   Consumers (UI, API routes, reports)      │
                  │   depend ONLY on FinanceEngine interface   │
                  └─────────────────────────────────────────────┘
```

Consumers are wired to a concrete implementation at the composition root (e.g., app bootstrap or route/module registration), never by importing `RealFinanceEngine` or `FinanceEngineDouble` directly inside feature/UI code.

## 3. Module Layout (target, for downstream implementation issues)

```
src/features/finance/
├── financeEngine.types.ts            # FinanceEngine interface + input/result DTOs
├── financeEngine.ts                  # RealFinanceEngine implementation
├── financeEngine.test.ts             # vitest suite against the contract
└── financeEngineArchitectureDouble/
    ├── financeEngineArchitectureDouble.contract.md   # (this issue) behavioral contract
    ├── README.md                                      # (this issue) scope + usage notes
    ├── financeEngineDouble.ts             # FinanceEngineDouble implementation (later issue)
    └── financeEngineDouble.test.ts        # vitest suite validating double against contract (later issue)
```

This issue (#2483) delivers only the two files under `financeEngineArchitectureDouble/` that end in `.md`. The `.ts` implementation files are explicitly deferred to subsequent child issues under #1925, consistent with the declared child scope for #2483.

## 4. Detailed Design

### 4.1 `FinanceEngine` Interface (design intent)

- Defined once in `financeEngine.types.ts` using strict TypeScript (no `any`).
- Input DTOs (`PriceBreakdownInput`, `CommissionSplitInput`, `CurrencyConversionInput`, `PaymentScheduleInput`) are plain, readonly-shaped objects — no classes, no methods — to keep the engine boundary serialization-friendly (usable across API request/response bodies).
- Result DTOs (`PriceBreakdownResult`, `CommissionSplitResult`, `CurrencyConversionResult`, `PaymentScheduleResult`) include itemized line data (per NFR-5 auditability) in addition to totals.

### 4.2 `RealFinanceEngine` (future child issue)

- Constructed with injected configuration: tax tables, commission tier tables, currency rate table, and a clock/"as of date" provider.
- Core methods are pure functions of `(config, input) -> result`; no hidden state mutation between calls.
- Validation is centralized in small guard functions (e.g., `assertNonNegativeAmount`, `assertKnownCurrency`) shared across all four methods to avoid duplicated validation logic drifting out of sync.

### 4.3 `FinanceEngineDouble` (future child issue)

- Implements the same `FinanceEngine` interface.
- Ships with a documented, clearly-non-production default configuration (e.g., flat 5% tax, flat 2.5%/2.5% agent/agency commission split, a small fixed AED/USD/EUR rate table).
- Accepts an optional partial-config override in its constructor so individual tests can exercise edge cases (e.g., zero-rate currency, single-installment payment plan) without forking the double.
- Contains no network, filesystem, or database calls — guaranteeing it can be instantiated and used synchronously in any vitest test file.

### 4.4 Error Handling Design

- All four core methods funnel invalid input into a single `FinanceEngineValidationError` (extends `Error`) carrying a descriptive `message` and, where useful, a `field` identifying which input was invalid. This gives both the real engine and the double a consistent, testable error surface, satisfying FR-5 uniformly.

### 4.5 Testing Strategy (for downstream `.ts` issues)

- Each of the four core methods gets a dedicated `describe` block in `financeEngineDouble.test.ts` using `import { describe, expect, it } from 'vitest'`.
- Tests assert **real behavior**: e.g., for `computePriceBreakdown`, assert that `result.total` equals the sum of itemized line amounts, and that changing the injected tax rate changes the computed tax line by the expected amount — not placeholder assertions like `expect(true).toBe(true)`.
- A shared "golden input" fixture set is used so the same inputs can later be run against both the double and the real engine to confirm interchangeability (contract parity testing).

## 5. Design Decisions and Rationale

| Decision                                        | Rationale                                                                                               |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Separate interface from implementation          | Enables the double/real-engine swap described in NFR-4 without touching consumer code.                  |
| Integer minor units internally                  | Avoids floating-point rounding drift in financial totals (FR-4).                                        |
| Config injection instead of internal fetch/read | Keeps the engine's core methods synchronous, deterministic, and easily testable (NFR-1, NFR-3).         |
| Centralized validation guards                   | Reduces duplication and risk of the double and real engine disagreeing on what counts as invalid input. |
| Golden-input fixture reuse                      | Provides a cheap way to assert double/real-engine parity as the real engine is built out incrementally. |

## 6. Risks and Mitigations

| Risk                                                           | Mitigation                                                                                                                                                                                           |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Double drifts from real engine behavior over time              | Golden-input fixture parity tests (Section 4.5) run against both implementations once the real engine exists.                                                                                        |
| Consumers accidentally import the double in production code    | Double is placed under a clearly-named `financeEngineArchitectureDouble/` directory and documented as test/dev-only in its README; a later lint rule (out of scope for this issue) can enforce this. |
| Scope creep into implementing the real engine under this issue | This SDD explicitly restricts #2483 to documentation artifacts; `.ts` files are named here only as forward-looking design targets for other child issues.                                            |

## 7. Traceability to Acceptance Criteria (Issue #2483)

| Acceptance Criterion                                         | Addressed By                                                                                                                                                                  |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Implementation remains within declared child scope           | Section 3 explicitly defers all `.ts` implementation to later child issues; this issue delivers design/spec documents only.                                                   |
| Focused tests and required validation commands pass          | Section 4.5 defines the vitest-based validation strategy that downstream implementation issues must satisfy.                                                                  |
| Completion evidence and rollback note recorded               | This SDD, its paired SRS, and the contract/README under `financeEngineArchitectureDouble/` constitute completion evidence; rollback is documented in that directory's README. |
| Parent issue remains open until all child work is reconciled | No action in this document closes or mutates #1925; multiple follow-on child issues are identified in Section 6/SRS Section 5.                                                |
