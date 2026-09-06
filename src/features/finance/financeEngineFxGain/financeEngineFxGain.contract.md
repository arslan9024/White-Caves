# Finance Engine — FX Gain/Loss Contract

- Issue: #2422
- Parent issue: #1939
- Domain: `src/features/finance/financeEngineFxGain`

## Purpose

Defines the calculation contract for realized and unrealized foreign-exchange
(FX) gain/loss on multi-currency finance transactions handled by the finance
engine. This document is the source of truth for the expected inputs, outputs,
and edge-case behavior of the FX gain/loss calculation module. Any
implementation under this feature folder must conform to this contract.

## Scope

In scope:

- Computing realized FX gain/loss when a foreign-currency transaction is
  settled against a base-currency ledger entry.
- Computing unrealized FX gain/loss for open (unsettled) foreign-currency
  balances at a given valuation date, using a supplied exchange rate.
- Rounding and sign-convention rules for gain/loss values.
- Pure, deterministic, side-effect-free calculation functions.

Out of scope (excluded scope per issue #2422):

- Parent issue (#1939) closure.
- Bulk GitHub mutation of any kind.
- Destructive database operations.
- Production secret rewrites.
- Persistence, API routes, or UI rendering of FX gain/loss (handled by other
  child issues under #1939).
- Live/external exchange-rate retrieval (rates are always caller-supplied).

## Data Contract

### `FxAmount`

```ts
interface FxAmount {
  /** Amount denominated in the foreign (transaction) currency. */
  foreignAmount: number;
  /** ISO 4217 currency code of the foreign currency, e.g. "USD". */
  foreignCurrency: string;
  /** Exchange rate: 1 unit of foreignCurrency = rate units of base currency. */
  rate: number;
}
```

### `FxGainResult`

```ts
interface FxGainResult {
  /** Gain (positive) or loss (negative) expressed in base currency. */
  gainOrLoss: number;
  /** Base-currency value of the amount at the original booking rate. */
  originalBaseValue: number;
  /** Base-currency value of the amount at the settlement/valuation rate. */
  currentBaseValue: number;
}
```

## Behavioral Rules

1. **Sign convention**: `gainOrLoss = currentBaseValue - originalBaseValue`.
   A positive value means a gain (favorable rate movement for the holder of
   the foreign-currency asset); a negative value means a loss.
2. **Realized gain/loss** is computed by comparing the booking rate at
   transaction creation to the settlement rate at the time cash is received
   or paid.
3. **Unrealized gain/loss** is computed by comparing the booking rate to a
   valuation rate as of a reporting/valuation date, without any actual
   settlement occurring.
4. **Rounding**: all monetary outputs are rounded to 2 decimal places using
   round-half-up rounding, applied only at the final output boundary (not on
   intermediate values).
5. **Zero/invalid rates**: a `rate` of `0`, `NaN`, or a negative number is
   invalid and MUST cause the calculation function to throw a
   `RangeError` with a descriptive message. Implementations must not
   silently coerce invalid rates.
6. **Same-currency transactions**: if the foreign currency equals the base
   currency, the gain/loss MUST be `0` regardless of rate inputs (same
   currency implies no FX exposure).
7. **Determinism**: given identical inputs, the function must always return
   identical outputs. No implicit reliance on system clock, randomness, or
   external I/O.

## Public API (expected exports)

- `calculateFxGain(original: FxAmount, current: FxAmount, baseCurrency: string): FxGainResult`
- `roundToCents(value: number): number`

## Non-Goals

- This contract does not define storage schema, API payloads, or UI display
  formatting — those belong to sibling child issues under #1939.
