# Software Design Document (SDD)

## Issue: W56-FINANCE-FX — FX Gain/Loss Calculation Module

- **Child issue:** #2420 (type contract), #2422 (documentation/contract), #2421 (logic implementation)
- **Parent issue:** #1939 (Finance Engine, Workstream 56)
- **Module:** `src/features/finance/financeEngineFxGain/`
- **Requirements source:** `plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-FX-1939.md`

## 1. Design Goals

- Deliver a small, dependency-free, pure-function module that is trivially
  unit-testable and safe to compose into the larger Finance Engine.
- Keep the module's blast radius limited to its own directory so it can be
  reverted independently of parent issue #1939 and any sibling child
  issues under the same workstream.
- Favor explicit, discriminated typed errors over silent failure or `any`.

## 2. Module Structure

```
src/features/finance/financeEngineFxGain/
├── financeEngineFxGain.contract.md   # authoritative behavioral contract
├── README.md                         # usage overview
├── financeEngineFxGain.types.ts      # type/interface/error contract — issue #2420
├── financeEngineFxGain.types.test.ts # vitest suite for the type/error contract — issue #2420
├── financeEngineFxGain.logic.ts      # implementation (types, errors, functions) — issue #2421
└── financeEngineFxGain.logic.test.ts # vitest focused test suite — issue #2421
```

> Note (#2420): `financeEngineFxGain.types.ts` extracts the module's pure
> type/interface/error surface (`FxTransactionInput`,
> `FxGainLossDirection`, `FxGainLossResult`, `FxGainLossSummary`,
> `FxGainErrorCode`, `FxGainCalculationError`) so it can be reviewed and
> reverted independently of both the calculation logic tracked under
> #2421 and the contract/README documentation tracked under #2422. The
> public API described in Section 3 below is the authoritative shape for
> this file; `financeEngineFxGain.logic.ts` is expected to import these
> types rather than redeclare them once #2421 is reconciled with this
> file's existence.

> Note (#2421): the implementation and its test suite use the
> `.logic.ts` / `.logic.test.ts` naming (rather than bare
> `financeEngineFxGain.ts`) to keep the pure-calculation surface
> separately identifiable and independently revertible from the
> `.contract.md`/`README.md` documentation files tracked under sibling
> issue #2422. The public API described in Section 3 below is unchanged
> by this naming.

## 3. Public API Design

```ts
export interface FxTransactionInput {
  transactionId: string;
  transactionCurrency: string;
  baseCurrency: string;
  transactionAmount: number;
  bookingRate: number;
  settlementRate: number;
  settlementStatus: 'realized' | 'unrealized';
}

export type FxGainLossDirection = 'gain' | 'loss' | 'none';

export interface FxGainLossResult {
  transactionId: string;
  bookedBaseAmount: number;
  settledBaseAmount: number;
  gainLossAmount: number;
  direction: FxGainLossDirection;
  settlementStatus: 'realized' | 'unrealized';
}

export type FxGainErrorCode =
  | 'INVALID_CURRENCY_CODE'
  | 'NON_FINITE_AMOUNT'
  | 'NEGATIVE_AMOUNT'
  | 'NON_POSITIVE_RATE';

export class FxGainCalculationError extends Error {
  constructor(message: string, public readonly code: FxGainErrorCode);
}

export function calculateFxGainLoss(input: FxTransactionInput): FxGainLossResult;

export function summarizeFxGainLoss(
  results: readonly FxGainLossResult[]
): { totalGain: number; totalLoss: number; netAmount: number };
```

### Design rationale

- **Discriminated `FxGainErrorCode` union over generic `Error`:** allows
  callers (e.g. ledger posting, API error mapping) to `switch` on `code`
  without string matching on `message`, keeping the contract stable even
  if wording changes.
- **`FxGainLossDirection` as a 3-state enum (`gain`/`loss`/`none`)** rather
  than a signed number only: makes the zero-case explicit and avoids
  ambiguous `-0`/`0` comparisons in downstream reporting.
- **Same-currency short-circuit (FR-7):** when `transactionCurrency ===
baseCurrency`, the module returns a zero-gain/loss, `'none'` result
  without applying the supplied rates, since no FX exposure exists by
  definition. This avoids surprising non-zero output from rounding noise
  if a caller passes mismatched rates for a same-currency transaction.
- **Rounding at the boundary, not internally accumulated:** each of
  `bookedBaseAmount`, `settledBaseAmount`, and `gainLossAmount` is rounded
  independently to 2 decimal places using
  `Math.round(value * 100) / 100`. This is simple, deterministic, and
  matches standard currency-minor-unit display; higher-precision ledger
  reconciliation (if ever needed) is intentionally left to a future,
  separate concern rather than over-engineering this module.
- **Pure functions, no classes for the calculators:** `calculateFxGainLoss`
  and `summarizeFxGainLoss` are stateless functions rather than a service
  class, since there is no instance state to manage and this keeps the
  module trivially tree-shakeable and testable.

## 4. Validation Flow

```
calculateFxGainLoss(input)
  │
  ├─ validate transactionCurrency, baseCurrency  ──▶ throw INVALID_CURRENCY_CODE
  ├─ validate transactionAmount is finite         ──▶ throw NON_FINITE_AMOUNT
  ├─ validate transactionAmount >= 0              ──▶ throw NEGATIVE_AMOUNT
  ├─ validate bookingRate, settlementRate finite & > 0 ──▶ throw NON_POSITIVE_RATE
  │
  ├─ if transactionCurrency === baseCurrency:
  │     return { bookedBaseAmount: amount, settledBaseAmount: amount,
  │              gainLossAmount: 0, direction: 'none', ... }
  │
  └─ else:
        bookedBaseAmount  = round2(amount * bookingRate)
        settledBaseAmount = round2(amount * settlementRate)
        gainLossAmount    = round2(settledBaseAmount - bookedBaseAmount)
        direction         = sign(gainLossAmount)
        return result
```

Validation order is fixed (currency codes → amount finiteness → amount
sign → rate validity) so that error precedence is deterministic and
testable.

## 5. Aggregation Design

`summarizeFxGainLoss` iterates the input array once, accumulating:

- `totalGain += result.gainLossAmount` when `> 0`
- `totalLoss += Math.abs(result.gainLossAmount)` when `< 0`
- `netAmount = round2(totalGain - totalLoss)` computed once at the end

An empty array short-circuits to `{ totalGain: 0, totalLoss: 0, netAmount: 0 }`.

## 6. Error Handling Design

`FxGainCalculationError extends Error` and adds a `readonly code:
FxGainErrorCode` property. `Object.setPrototypeOf` is applied in the
constructor to preserve `instanceof` checks under the TypeScript
`target`/`lib` configuration used by this project when compiling classes
that extend built-ins.

## 7. Testing Strategy

Vitest (`describe`/`expect`/`it`) focused suite covering:

1. Realized gain (settlement rate up) — exact numeric assertions.
2. Realized loss (settlement rate down) — exact numeric assertions.
3. Unrealized revaluation — same formula path, different `settlementStatus`.
4. Same-currency no-exposure case.
5. Each of the 4 validation error codes, asserting `instanceof
FxGainCalculationError` and the specific `code`.
6. `summarizeFxGainLoss` over a mixed batch (gain + loss + none) and over
   an empty array.

No mocks/stubs are required since the module has no external
dependencies.

## 8. Risks & Mitigations

| Risk                                                    | Mitigation                                                                                                                                               |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Floating-point rounding drift across large batches      | Round at each boundary (per-transaction) rather than deferring to the summary step, keeping the summary a straightforward sum of already-rounded values. |
| Silent misuse with mismatched currency/rate combos      | Explicit same-currency short-circuit (FR-7) and 4 distinct validation error codes with dedicated tests.                                                  |
| Future scope creep into ledger posting or rate-fetching | Explicitly documented as out-of-scope in both the contract and this SDD; kept as pure calculation only.                                                  |

## 9. Rollback Plan

The module is additive and self-contained. To roll back:

1. Delete `src/features/finance/financeEngineFxGain/` in full.
2. Delete this SDD and the paired SRS document.
3. No other module currently imports from `financeEngineFxGain`, so no
   further code changes are required. No database, secret, or parent
   issue (#1939) state is touched by this change, so rollback carries no
   external side effects.
4. For issue #2421 specifically, a partial rollback deleting only
   `financeEngineFxGain.logic.ts` and `financeEngineFxGain.logic.test.ts`
   is also safe and self-contained, since no other file in this module
   imports from those two files.

## 10. Completion Evidence

Evidence of the focused vitest run for this module (test file names and
pass/fail counts) is to be recorded alongside the implementation commit
message and/or CI run for issue #2422. Parent issue #1939 remains open
pending reconciliation of all sibling child issues under Workstream W56.

## 11. Completion Evidence (#2421)

The focused vitest suite in `financeEngineFxGain.logic.test.ts` exercises
every functional requirement in the linked SRS (FR-1 through FR-7),
including all four validation error codes and their fixed precedence
order, the same-currency short-circuit, rounding behavior, and batch
aggregation via `summarizeFxGainLoss` over mixed and empty inputs. Run
output (pass/fail counts) is recorded alongside the implementation commit
for #2421. This issue does not close parent issue #1939.

## 12. Completion Evidence (#2420)

The focused vitest suite in `financeEngineFxGain.types.test.ts` exercises
the `financeEngineFxGain.types.ts` type/error contract: every
`FxGainErrorCode` variant produces a distinct, correctly-shaped
`FxGainCalculationError` (message, code, `name`, `instanceof Error`, and
`instanceof FxGainCalculationError` across a throw/catch round-trip), and
object literals typed as `FxTransactionInput`, `FxGainLossResult` (for
each `FxGainLossDirection` literal), and `FxGainLossSummary` compile and
behave as expected. Run output (pass/fail counts) is recorded alongside
the implementation commit for #2420. This issue does not close parent
issue #1939.

## 13. Rollback Plan (#2420)

`financeEngineFxGain.types.ts` and `financeEngineFxGain.types.test.ts` are
additive and self-contained; deleting both files fully reverts issue
#2420 with no impact on any other file in the module, since no other file
in this repository imports from `financeEngineFxGain.types.ts` at this
time. No database, secret, or parent issue (#1939) state is touched by
this change.
