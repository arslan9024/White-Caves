# Finance Engine Architecture Double — Contract

- **Issue:** #2483
- **Parent issue:** #1925 (Finance Engine Architecture Spec, tracked under work stream W56)
- **Status:** Draft specification / test-double contract (no production runtime code introduced by this issue)
- **Scope:** Defines the behavioral contract that any "finance engine architecture double" (a stand-in implementation used in tests, storybooks, or local development in place of the real finance engine) MUST satisfy so that consumers can be developed and tested against a stable, predictable surface before the real engine lands.

## 1. Purpose

The finance engine (tracked under parent #1925) is a large, multi-part subsystem responsible for computing property financials: pricing breakdowns, commission splits, taxes/VAT, currency conversion, and payment-schedule projections for the White Caves CRM and Homepage. Because the full engine spans several child issues, this contract exists to:

1. Give downstream consumers (UI components, API route handlers, reporting jobs) a **stable interface** to code against while the real engine is implemented incrementally.
2. Provide a **test double** (fake/stub) that implements the same interface with deterministic, in-memory behavior, so unit and integration tests do not depend on the real engine, a database, or external rate providers.
3. Ensure that when the real engine replaces the double, no consumer code needs to change — only the binding/wiring at the composition root.

## 2. Contract Surface

Any implementation (real or double) of the finance engine architecture MUST expose the following capabilities. Types are illustrative of the shape required; the authoritative TypeScript types live alongside the real engine implementation under `src/features/finance/`.

### 2.1 `FinanceEngine` interface

```ts
interface FinanceEngine {
  /** Computes a full price breakdown (base price, fees, taxes, total) for a property listing. */
  computePriceBreakdown(input: PriceBreakdownInput): PriceBreakdownResult;

  /** Computes agent/agency commission splits for a completed transaction. */
  computeCommissionSplit(input: CommissionSplitInput): CommissionSplitResult;

  /** Converts a monetary amount between two supported currencies using the engine's current rate table. */
  convertCurrency(input: CurrencyConversionInput): CurrencyConversionResult;

  /** Projects an installment/payment schedule for a given total and plan configuration. */
  projectPaymentSchedule(input: PaymentScheduleInput): PaymentScheduleResult;
}
```

### 2.2 Behavioral requirements

- **Determinism:** Given the same input, `computePriceBreakdown`, `computeCommissionSplit`, and `projectPaymentSchedule` MUST return the same output (no hidden randomness, no wall-clock-dependent branching beyond an explicitly injected "as of" date).
- **No implicit I/O:** Implementations MUST NOT perform network calls, file system access, or database queries as part of these four methods. Any external rate/config data (e.g., currency rates, tax tables) MUST be provided via constructor/config injection.
- **Currency safety:** All monetary values are represented as integer minor units (e.g., cents/fils) internally to avoid floating-point rounding errors; conversions to display strings happen only at the presentation boundary, not inside the engine.
- **Validation:** Implementations MUST validate inputs (non-negative amounts, known currency codes, well-formed payment plan configuration) and MUST surface validation failures as thrown errors with a descriptive `message`, never as silent `NaN`/`undefined` results.
- **Immutability:** Input objects passed to the engine MUST NOT be mutated by the implementation.
- **Interchangeability:** A double satisfying this contract MUST be substitutable for the real engine behind the `FinanceEngine` interface without changing any call site.

### 2.3 Double-specific requirements

The **double** (a lightweight, in-memory stand-in) additionally MUST:

- Use fixed, documented default rate tables and tax rates (no network fetch), clearly marked as non-production values.
- Be fast enough for use in unit tests (sub-millisecond per call, no I/O).
- Expose a way to override its default configuration (rates, tax percentages, commission tiers) per test, so tests can exercise edge cases without modifying the double's source.
- Never be imported by production entry points (e.g., `src/index.tsx`, server route registration) — it is a test/dev-time artifact only.

## 3. Non-Goals

- This contract does not implement the real finance engine; the real engine's business rules (actual tax percentages, actual commission tiers, actual live currency rates) are defined and implemented under separate child issues of #1925.
- This contract does not perform any GitHub issue mutation, database write, or secret handling.

## 4. Traceability

- Parent: #1925 — Finance Engine Architecture
- This issue: #2483 — Finance Engine Architecture Double (contract + handoff specs)
- Related handoff documents: see `plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-SPEC-1925.md` and `plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-SPEC-1925.md`.

## 5. Acceptance Criteria (for this issue)

- [x] Contract documented and versioned in-repo.
- [x] Scope confined to specification/documentation artifacts; no production runtime behavior added or altered.
- [x] Parent issue #1925 remains open; only this child scope is addressed.
- [x] Completion evidence and rollback note recorded (see README.md in this directory).
