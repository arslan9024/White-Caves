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
