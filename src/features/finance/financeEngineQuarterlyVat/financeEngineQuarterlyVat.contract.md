# Contract: financeEngineQuarterlyVat

- Parent issue: #1945
- Child issue: #2399
- Status: scaffolding only (no runtime implementation shipped in this change)

## Purpose

Defines the module contract for the quarterly VAT (Value Added Tax) calculation
engine within the `finance` feature area. This document is the source of truth
for the public surface, inputs/outputs, and invariants that any future
`financeEngineQuarterlyVat` TypeScript implementation and its vitest suite
must satisfy.

## Scope

In scope for this child issue (#2399):

- Declaring the contract (this file) and module overview (`README.md`) for
  the quarterly VAT engine under `src/features/finance/financeEngineQuarterlyVat/`.

Out of scope (see "Excluded scope" on the parent tracking issue):

- Parent issue (#1945) closure.
- Bulk GitHub mutations (labels, milestones, cross-issue edits).
- Destructive database operations.
- Production secret rewrites.
- Any TypeScript source/test implementation beyond this documentation pass;
  those are tracked as separate, subsequent child issues under #1945.

## Public Surface (planned)

The eventual implementation is expected to export, from an
`index.ts` (or `financeEngineQuarterlyVat.ts`) module in this directory:

```ts
export interface QuarterlyVatLineItem {
  /** ISO 4217 currency code, e.g. "AED". */
  currency: string;
  /** Net (pre-VAT) amount, in the smallest currency unit avoided — use decimal-safe number. */
  netAmount: number;
  /** VAT rate applied to this line, expressed as a fraction (e.g. 0.05 for 5%). */
  vatRate: number;
}

export interface QuarterlyVatInput {
  /** Calendar quarter, 1-4. */
  quarter: 1 | 2 | 3 | 4;
  /** Four-digit fiscal year, e.g. 2026. */
  year: number;
  /** Line items subject to VAT for the quarter. */
  lineItems: readonly QuarterlyVatLineItem[];
}

export interface QuarterlyVatResult {
  quarter: 1 | 2 | 3 | 4;
  year: number;
  totalNetAmount: number;
  totalVatAmount: number;
  totalGrossAmount: number;
  /** Breakdown of VAT collected per distinct rate used in the input. */
  vatByRate: ReadonlyMap<number, number>;
}

/**
 * Computes the quarterly VAT summary for a set of line items.
 * Must be a pure function: no I/O, no mutation of the input, deterministic
 * output for identical input.
 */
export declare function calculateQuarterlyVat(input: QuarterlyVatInput): QuarterlyVatResult;
```

## Invariants

1. **Purity** — `calculateQuarterlyVat` must not mutate `input` or any of its
   nested arrays/objects, and must not perform I/O (no network, filesystem,
   or database access).
2. **No `any`** — the implementation and its tests must be written in strict
   TypeScript with no `any` types (explicit or implicit).
3. **Determinism** — identical inputs must always produce identical outputs
   (including map iteration-independent equality checks in tests).
4. **Non-negative rates** — `vatRate` must be within `[0, 1]`; a rate outside
   this range is a caller error and the function must throw a descriptive
   `Error` (or a typed error subclass) rather than silently clamping.
5. **Rounding** — monetary totals are rounded to 2 decimal places using
   half-away-from-zero rounding to avoid floating point drift; rounding must
   happen once, on the final aggregated totals, not per line item.
6. **Empty input** — an empty `lineItems` array is valid and must yield all
   totals as `0` and an empty `vatByRate` map.
7. **Quarter validity** — `quarter` must be one of `1 | 2 | 3 | 4` (enforced
   at the type level for compile-time callers, defensively validated at
   runtime for values crossing an untyped boundary, e.g. JSON input).

## Testing Contract

Any subsequent implementation PR must add vitest specs
(`financeEngineQuarterlyVat.test.ts`, colocated in this directory) that:

- Import from `vitest` using `import { describe, expect, it } from 'vitest'`.
- Assert real computed values (e.g. exact totals for known fixtures), never
  placeholder assertions such as `expect(true).toBe(true)`.
- Cover: empty input, single line item, multiple VAT rates, invalid rate
  (throws), and rounding edge cases (e.g. amounts that sum to `x.xx5`).

## Validation Commands

Once implementation lands, the required commands are:

- `npx vitest run src/features/finance/financeEngineQuarterlyVat` — focused
  test run for this module.
- `npx tsc --noEmit` (or the project's existing strict typecheck script) —
  must pass with zero errors and no `any` usage introduced.

## Rollback Note

This change only adds two new documentation files
(`financeEngineQuarterlyVat.contract.md`, `README.md`) under a new directory;
it does not modify any existing file. Rollback is a no-op deletion of the
`src/features/finance/financeEngineQuarterlyVat/` directory with no
side effects on other modules, builds, or runtime behavior.

## Reconciliation

Parent issue #1945 remains open. This child issue (#2399) covers only the
contract/documentation scaffolding described above; it does not implement or
export any runtime TypeScript code, and does not close #1945 or any other
issue.
