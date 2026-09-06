# Contract: Finance Engine — FX Gain/Loss Module

- **Issue:** #2422
- **Parent issue:** #1939 (Finance Engine — Workstream W56)
- **Module path:** `src/features/finance/financeEngineFxGain/`
- **Status:** Draft / in-progress (child scope only; parent issue #1939 remains open)

## 1. Purpose

Defines the behavioral and structural contract for the FX (foreign exchange)
gain/loss calculation module of the Finance Engine. This module computes
realized and unrealized FX gain/loss for multi-currency transactions
(property reservations, invoices, and settlements) that are recorded in a
transaction currency different from the ledger's base currency.

This contract is the source of truth for any implementation or test that
targets `financeEngineFxGain`. Where a future implementation disagrees with
this contract, the contract (and its accompanying test suite) governs.

## 2. Declared Scope

In scope:

- Pure calculation of FX gain/loss for a single transaction pair
  (original booking rate vs. settlement/valuation rate).
- Support for realized gain/loss (transaction fully settled) and unrealized
  gain/loss (period-end revaluation of open balances).
- Deterministic, side-effect-free functions — no direct DB, network, or
  filesystem access from this module.
- Input validation with typed errors (no `any`, no silent coercion).

Out of scope (excluded scope per issue #2422):

- Closing or mutating parent issue #1939.
- Any bulk GitHub API mutation.
- Destructive database operations (deletes, truncations, migrations).
- Production secret rewrites or credential handling.
- Persistence, currency-rate retrieval/caching, or ledger posting — these
  are the responsibility of adjacent modules (`financeEngineLedger`,
  `fxRateProvider`) and are only consumed here via injected values.

## 3. Public API Surface

The module exposes the following typed contract (implemented in
`financeEngineFxGain.ts`, alongside this document):

```ts
export interface FxTransactionInput {
  /** Unique identifier of the source transaction (invoice, reservation, etc.) */
  transactionId: string;
  /** ISO 4217 currency code of the transaction, e.g. "USD" */
  transactionCurrency: string;
  /** ISO 4217 currency code of the ledger/base currency, e.g. "AED" */
  baseCurrency: string;
  /** Amount in transaction currency, must be finite and non-negative */
  transactionAmount: number;
  /** Exchange rate (base per 1 unit of transaction currency) at booking time */
  bookingRate: number;
  /** Exchange rate at settlement or revaluation time */
  settlementRate: number;
  /** Whether the transaction has been fully settled ("realized") or is still open ("unrealized") */
  settlementStatus: 'realized' | 'unrealized';
}

export type FxGainLossDirection = 'gain' | 'loss' | 'none';

export interface FxGainLossResult {
  transactionId: string;
  /** Amount in base currency using the booking rate */
  bookedBaseAmount: number;
  /** Amount in base currency using the settlement/valuation rate */
  settledBaseAmount: number;
  /** settledBaseAmount - bookedBaseAmount, rounded to 2 decimal places */
  gainLossAmount: number;
  direction: FxGainLossDirection;
  settlementStatus: 'realized' | 'unrealized';
}

export class FxGainCalculationError extends Error {
  constructor(message: string, public readonly code: FxGainErrorCode) { ... }
}

export type FxGainErrorCode =
  | 'INVALID_CURRENCY_CODE'
  | 'NON_FINITE_AMOUNT'
  | 'NEGATIVE_AMOUNT'
  | 'NON_POSITIVE_RATE';

export function calculateFxGainLoss(input: FxTransactionInput): FxGainLossResult;

export function summarizeFxGainLoss(
  results: readonly FxGainLossResult[]
): { totalGain: number; totalLoss: number; netAmount: number };
```

## 4. Behavioral Rules

1. `transactionCurrency` and `baseCurrency` must each be a 3-letter uppercase
   ISO 4217-shaped code (`/^[A-Z]{3}$/`); otherwise throw
   `FxGainCalculationError` with code `INVALID_CURRENCY_CODE`.
2. `transactionAmount` must be a finite number (`Number.isFinite`);
   otherwise throw with code `NON_FINITE_AMOUNT`.
3. `transactionAmount` must be `>= 0`; otherwise throw with code
   `NEGATIVE_AMOUNT`.
4. `bookingRate` and `settlementRate` must each be finite and strictly
   greater than `0`; otherwise throw with code `NON_POSITIVE_RATE`.
5. When `transactionCurrency === baseCurrency`, both rates are treated as
   `1` for the purposes of computing base amounts (no FX exposure), and
   `gainLossAmount` is always `0` with `direction: 'none'`.
6. `bookedBaseAmount = transactionAmount * bookingRate`, rounded to 2
   decimal places (banker's rounding not required; standard round-half-up
   via `Math.round(value * 100) / 100` is acceptable and used by the
   reference implementation).
7. `settledBaseAmount = transactionAmount * settlementRate`, rounded the
   same way.
8. `gainLossAmount = settledBaseAmount - bookedBaseAmount`, rounded to 2
   decimal places.
9. `direction` is `'gain'` when `gainLossAmount > 0`, `'loss'` when
   `gainLossAmount < 0`, and `'none'` when `gainLossAmount === 0`.
10. `settlementStatus` is passed through unchanged from the input and used
    only for downstream reporting classification — it does not alter the
    calculation formula itself.
11. `summarizeFxGainLoss` sums all positive `gainLossAmount` values into
    `totalGain`, sums the absolute value of all negative amounts into
    `totalLoss`, and computes `netAmount = totalGain - totalLoss`, each
    rounded to 2 decimal places. An empty input array yields all-zero
    totals.
12. The module performs no I/O; all inputs (including exchange rates) must
    be supplied by the caller.

## 5. Error Handling

All validation failures throw a typed `FxGainCalculationError` carrying a
discriminated `code` field. Callers (e.g. the finance ledger poster) are
expected to catch and translate these into their own error/reporting
model. The module never returns `undefined`/`null` in place of an error —
it always throws.

## 6. Testing Contract

Focused tests live at
`src/features/finance/financeEngineFxGain/financeEngineFxGain.test.ts` and
use `vitest` (`import { describe, expect, it } from 'vitest'`). Tests must
assert real behavior (exact numeric results, thrown error codes) and must
not use placeholder assertions such as `expect(true).toBe(true)`.

Minimum required coverage:

- Realized gain scenario (settlement rate > booking rate).
- Realized loss scenario (settlement rate < booking rate).
- Unrealized (open balance) revaluation scenario.
- Same-currency (no FX exposure) scenario.
- Each of the four `FxGainErrorCode` validation failures.
- `summarizeFxGainLoss` aggregation across mixed gain/loss/none results,
  including the empty-array case.

## 7. Rollback

This module is additive and self-contained under
`src/features/finance/financeEngineFxGain/`. To roll back, delete the
directory and remove any import of `financeEngineFxGain` from consuming
modules (none exist yet as of this issue). No schema, migration, or
external configuration changes are introduced by this contract.

## 8. Traceability

- Parent issue: #1939 — remains open; this contract only closes the child
  scope for issue #2422.
- Requirements source: `plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-FX-1939.md`
- Design source: `plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-FX-1939.md`
