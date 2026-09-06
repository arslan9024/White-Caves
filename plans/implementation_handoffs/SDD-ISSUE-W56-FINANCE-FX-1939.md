# SDD — Finance Engine FX Gain/Loss (Issue #2422)

- **Handoff ID**: SDD-ISSUE-W56-FINANCE-FX-1939
- **Child issue**: #2422
- **Parent issue**: #1939
- **Feature path**: `src/features/finance/financeEngineFxGain/`
- **Traces to**: `SRS-ISSUE-W56-FINANCE-FX-1939.md`

## 1. Design Overview

The FX gain/loss module is a small, pure-function TypeScript unit with no
dependencies on persistence, network, or UI layers. It exposes two functions
and two supporting types, matching the contract in
`financeEngineFxGain.contract.md`.

## 2. Module Layout

```
src/features/finance/financeEngineFxGain/
├── financeEngineFxGain.contract.md   # functional contract (source of truth)
├── README.md                          # scope + rationale
├── financeEngineFxGain.ts             # implementation (child impl issue)
└── financeEngineFxGain.test.ts        # vitest suite (child impl issue)
```

Only the contract and README are produced by this documentation/handoff
issue (#2422); `financeEngineFxGain.ts` and its test file are produced by the
implementation child issue that consumes this SDD, keeping this handoff
strictly within its declared scope (docs/contract only, no destructive or
out-of-scope actions).

## 3. Types

```ts
export interface FxAmount {
  foreignAmount: number;
  foreignCurrency: string;
  rate: number; // 1 unit of foreignCurrency = rate units of base currency
}

export interface FxGainResult {
  gainOrLoss: number;
  originalBaseValue: number;
  currentBaseValue: number;
}
```

## 4. Functions

### `roundToCents(value: number): number`

- Rounds `value` to 2 decimal places using round-half-up semantics.
- Implementation approach: `Math.round((value + Number.EPSILON) * 100) / 100`
  to avoid floating-point round-half-to-even artifacts from naive
  `Math.round`.

### `calculateFxGain(original: FxAmount, current: FxAmount, baseCurrency: string): FxGainResult`

Algorithm:

1. Validate `original.rate` and `current.rate`: if either is `<= 0` or
   `NaN`, throw `new RangeError('FX rate must be a positive finite number')`.
2. If `original.foreignCurrency === baseCurrency` (same-currency case),
   return `{ gainOrLoss: 0, originalBaseValue: roundToCents(original.foreignAmount), currentBaseValue: roundToCents(original.foreignAmount) }`.
3. Otherwise compute:
   - `originalBaseValue = roundToCents(original.foreignAmount * original.rate)`
   - `currentBaseValue = roundToCents(current.foreignAmount * current.rate)`
   - `gainOrLoss = roundToCents(currentBaseValue - originalBaseValue)`
4. Return `{ gainOrLoss, originalBaseValue, currentBaseValue }`.

Note: rounding is applied to `originalBaseValue` and `currentBaseValue`
independently before differencing, per contract rule 4 ("applied only at the
final output boundary"), where each returned field is itself an output
boundary.

## 5. Design Decisions

- **Pure functions over a class**: no internal state is needed; a class
  would add ceremony without benefit. Two standalone functions keep the
  module trivially testable and tree-shakeable.
- **`RangeError` for invalid rates**: chosen over a generic `Error` because
  `RangeError` semantically communicates "value outside the domain of valid
  input" and lets callers use `instanceof RangeError` for targeted handling.
- **Round-half-up via `Number.EPSILON` correction**: plain
  `Math.round(x * 100) / 100` suffers from binary floating-point
  representation errors (e.g. `1.005` rounding down instead of up). Adding
  `Number.EPSILON` before rounding corrects this without external
  dependencies.
- **Same-currency short-circuit**: guarantees FR-6 exactly, avoiding any
  floating-point drift that could otherwise produce a non-zero gain/loss
  when no FX exposure exists.

## 6. Error Handling

| Condition                                                                                                  | Behavior                                                                                                                                                                                                                     |
| ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `rate <= 0` or `NaN` on either `original` or `current`                                                     | throws `RangeError`                                                                                                                                                                                                          |
| `foreignCurrency` mismatch between `original`/`current` and `baseCurrency` differs from same-currency case | proceeds with normal FX calculation (rate-driven)                                                                                                                                                                            |
| Non-finite `foreignAmount` (`NaN`/`Infinity`)                                                              | not explicitly guarded by this SDD; downstream numeric result will propagate `NaN`/`Infinity`, which is acceptable per contract (amounts are assumed pre-validated by the caller/finance ledger before reaching this module) |

## 7. Test Plan (for implementation child issue)

Using vitest (`import { describe, expect, it } from 'vitest'`):

1. Realized gain: booking rate lower than settlement rate → positive
   `gainOrLoss`.
2. Realized loss: booking rate higher than settlement rate → negative
   `gainOrLoss`.
3. Unrealized gain/loss: same shape as realized, using a valuation rate
   instead of a settlement rate.
4. Same-currency: `foreignCurrency === baseCurrency` → `gainOrLoss === 0`.
5. Invalid rate (`0`, negative, `NaN`) → throws `RangeError`.
6. Rounding: fractional cent inputs (e.g. `100.005`) round as expected.
7. Determinism: calling twice with identical inputs yields identical
   outputs (`toEqual`).

## 8. Rollback Note

This handoff only adds new documentation/contract files under
`src/features/finance/financeEngineFxGain/` and
`plans/implementation_handoffs/`. No existing files are modified, no
dependencies are added, and no destructive or production-affecting actions
are taken. Rollback is a simple deletion of the four files listed for issue
#2422; no data migration, dependency reinstall, or service restart is
required.

## 9. Completion Evidence

- Files added: `financeEngineFxGain.contract.md`, `README.md` (feature
  folder), `SRS-ISSUE-W56-FINANCE-FX-1939.md`, `SDD-ISSUE-W56-FINANCE-FX-1939.md`
  (this document).
- No implementation code (`.ts`) was in scope for issue #2422's file list;
  this SDD hands off implementation and vitest coverage to the
  next child issue under parent #1939.
- Parent issue #1939 remains open; this handoff does not close it.

## 10. Implementation Completion Evidence (Issue #2421)

- **Child issue**: #2421 (implementation child of parent #1939).
- **Files added**:
  - `src/features/finance/financeEngineFxGain/financeEngineFxGain.logic.ts`
    — exports `FxAmount`, `FxGainResult`, `roundToCents`,
    `calculateFxGain`, matching §3/§4 of this SDD exactly (round-half-up via
    `Number.EPSILON` correction, `RangeError` on invalid rates, same-currency
    short-circuit returning an exact `0` gain/loss).
  - `src/features/finance/financeEngineFxGain/financeEngineFxGain.logic.test.ts`
    — vitest suite (`import { describe, expect, it } from 'vitest'`)
    covering FR-1 (realized gain/loss), FR-2 (unrealized gain/loss), FR-3
    (sign convention), FR-4 (2-decimal-place rounding), FR-5 (RangeError on
    `0`/negative/`NaN`/`Infinity` rates), FR-6 (same-currency short-circuit),
    and FR-7 (determinism via repeated identical calls).
- **Design decisions confirmed during implementation**:
  - Kept the two pure exported functions with no class wrapper, per §5.
  - Validation is centralized in a private `assertValidRate` helper invoked
    for both `original.rate` and `current.rate`, keeping `calculateFxGain`
    readable while enforcing FR-5 symmetrically on both operands.
  - Non-finite rates (`Infinity`) are treated as invalid via
    `Number.isFinite`, which is a strict superset of the SDD's `<= 0`/`NaN`
    check and does not conflict with FR-5's stated conditions.
- **Validation commands** (to be run by the consuming pipeline; not
  executed by this handoff per its sandboxed, no-package-manager
  constraints):
  - `npx vitest run src/features/finance/financeEngineFxGain/financeEngineFxGain.logic.test.ts`
  - `npx tsc --noEmit` (or the repository's existing typecheck script)
- **Scope confirmation**: only the four files listed for issue #2421 were
  created/modified (this SDD, the sibling SRS, the logic module, and its
  test file); no other files, dependencies, or GitHub issues were touched.
  Parent issue #1939 remains open.

## 11. Rollback Note (Issue #2421)

Rollback is a simple deletion of the two new source files:
`src/features/finance/financeEngineFxGain/financeEngineFxGain.logic.ts` and
`src/features/finance/financeEngineFxGain/financeEngineFxGain.logic.test.ts`,
plus reverting the additive edits to this document and to
`SRS-ISSUE-W56-FINANCE-FX-1939.md`. No dependencies were added, no existing
files were modified beyond these two handoff documents, and no data
migration, dependency reinstall, or service restart is required to reverse
this change.

## 12. Types Extraction Completion Evidence (Issue #2420)

- **Child issue**: #2420 (implementation child of parent #1939, sibling of
  #2421/#2422).
- **Files added**:
  - `src/features/finance/financeEngineFxGain/financeEngineFxGain.types.ts`
    — exports `FxRate`, `FxAmount`, `FxGainResult`, plus pure helpers
    `isFxAmount` (structural type guard), `isValidFxRate` (domain type
    guard: finite and strictly positive), `assertValidFxRate` (assertion
    function throwing `RangeError` per FR-5, with an optional `label` for
    error-message context), and `isSameCurrency` (case-/whitespace-
    insensitive currency-code comparison supporting FR-6).
  - `src/features/finance/financeEngineFxGain/financeEngineFxGain.types.test.ts`
    — vitest suite (`import { describe, expect, it } from 'vitest'`) with
    22 passing assertions covering: structural validation of `FxAmount`
    (valid shape, empty currency, missing field, wrong field type,
    non-object inputs); `isValidFxRate` across positive/zero/negative/
    `NaN`/`Infinity` cases; `assertValidFxRate` throwing `RangeError` for
    each invalid case and including the caller-supplied label in the
    message; and `isSameCurrency` case-insensitivity/whitespace handling.
  - Updated `SRS-ISSUE-W56-FINANCE-FX-1939.md` §8 with a new "Types
    Extraction Addendum (Issue #2420)" section documenting scope and
    design decisions for this child.
- **Design decisions**:
  - Types and guards were placed in a dedicated `.types.ts` module rather
    than folded into `financeEngineFxGain.logic.ts`, so that consumers
    needing only the data contract and validation primitives (e.g. UI
    form validation, API request DTOs) do not need to import calculation
    logic. This keeps the module boundary aligned with single-
    responsibility and tree-shaking goals from SDD §5.
  - `assertValidFxRate` accepts an optional `label` parameter (defaulting
    to `'rate'`) so callers validating multiple rates (e.g. both
    `original.rate` and `current.rate` in `calculateFxGain`) can produce
    disambiguated error messages without duplicating validation logic.
  - `isValidFxRate` uses `Number.isFinite(rate) && rate > 0`, which is a
    strict superset of FR-5's `<= 0`/`NaN` check (it additionally rejects
    `Infinity`), consistent with the `Number.isFinite`-based validation
    already adopted in the sibling `financeEngineFxGain.logic.ts`
    implementation (issue #2421), keeping validation semantics identical
    across both modules.
  - `isSameCurrency` normalizes case and trims whitespace before
    comparison, avoiding false negatives from caller inconsistency (e.g.
    `"usd"` vs `"USD "`) while still correctly distinguishing genuinely
    different currencies.
- **Validation commands executed**:
  - Focused test run (22/22 passed):
    `npx vitest run src/features/finance/financeEngineFxGain/financeEngineFxGain.types.test.ts --reporter=verbose`
    (executed via a temporary same-content copy under the live repository
    tree to satisfy the local vitest config's `include` globs, then
    removed immediately after the run completed; no permanent files were
    added outside the declared scope).
  - `npx tsc --noEmit -p tsconfig.json --skipLibCheck` — no errors
    attributable to the new module.
- **Scope confirmation**: only the four files listed for issue #2420 were
  created/modified (this SDD, the sibling SRS, the new types module, and
  its test file); no other files, dependencies, or GitHub issues were
  touched. Parent issue #1939 remains open.

## 13. Rollback Note (Issue #2420)

Rollback is a simple deletion of the two new source files:
`src/features/finance/financeEngineFxGain/financeEngineFxGain.types.ts`
and
`src/features/finance/financeEngineFxGain/financeEngineFxGain.types.test.ts`,
plus reverting the additive edits to this document (§12/§13) and to
`SRS-ISSUE-W56-FINANCE-FX-1939.md` (§9). No dependencies were added, no
existing files were modified beyond these two handoff documents, and no
data migration, dependency reinstall, or service restart is required to
reverse this change. The sibling `financeEngineFxGain.logic.ts` module
(issue #2421) declares its own `FxAmount`/`FxGainResult` types locally and
does not import from this module, so removing this addendum does not
break the existing implementation child.
