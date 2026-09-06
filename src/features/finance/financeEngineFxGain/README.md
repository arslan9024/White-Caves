# financeEngineFxGain

FX (foreign exchange) gain/loss calculation module for the White Caves
Finance Engine. Part of workstream W56 (parent issue #1939), child scope
issue #2422.

## What this module does

Computes realized and unrealized FX gain/loss for transactions booked in a
currency other than the ledger's base currency, by comparing the base-
currency value at booking time against the value at settlement or
period-end revaluation time.

This is a pure, side-effect-free calculation module: it does not fetch
exchange rates, does not read/write the database, and does not perform any
network I/O. Callers must supply the booking rate and settlement/valuation
rate.

## Contract

The full behavioral contract, including the public API surface, validation
rules, and rounding conventions, is documented in
[`financeEngineFxGain.contract.md`](./financeEngineFxGain.contract.md).
That document is the source of truth; this README is a lightweight usage
summary.

## Usage

```ts
import {
  calculateFxGainLoss,
  summarizeFxGainLoss,
  FxGainCalculationError,
} from './financeEngineFxGain';

const result = calculateFxGainLoss({
  transactionId: 'INV-1001',
  transactionCurrency: 'USD',
  baseCurrency: 'AED',
  transactionAmount: 1000,
  bookingRate: 3.67,
  settlementRate: 3.7,
  settlementStatus: 'realized',
});

// result.gainLossAmount === 30
// result.direction === 'gain'

const summary = summarizeFxGainLoss([result]);
// summary.totalGain === 30, summary.totalLoss === 0, summary.netAmount === 30
```

Validation failures throw a typed `FxGainCalculationError` with a
discriminated `code` (`INVALID_CURRENCY_CODE`, `NON_FINITE_AMOUNT`,
`NEGATIVE_AMOUNT`, or `NON_POSITIVE_RATE`) — callers should catch and
translate this into their own error handling as needed.

## Scope

**In scope:** pure FX gain/loss calculation and aggregation for a batch of
transactions.

**Explicitly out of scope for this child issue (#2422):**

- Closing parent issue #1939.
- Bulk GitHub mutations.
- Destructive database operations.
- Production secret rewrites.
- Currency-rate retrieval/caching or ledger posting (handled by adjacent
  modules).

## Testing

Focused tests live in `financeEngineFxGain.test.ts` and run with
[vitest](https://vitest.dev/). Run the finance-engine focused suite with:

```sh
npx vitest run src/features/finance/financeEngineFxGain
```

## Files

| File                              | Purpose                           |
| --------------------------------- | --------------------------------- |
| `financeEngineFxGain.contract.md` | Authoritative behavioral contract |
| `README.md`                       | This usage overview               |
| `financeEngineFxGain.ts`          | Implementation (typed, no `any`)  |
| `financeEngineFxGain.test.ts`     | Vitest focused test suite         |

## Traceability

- Parent issue: **#1939** (remains open)
- Child issue: **#2422**
- SRS: `plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-FX-1939.md`
- SDD: `plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-FX-1939.md`

## Rollback

This module is additive under
`src/features/finance/financeEngineFxGain/`. To roll back, delete the
directory; no other module currently imports from it, so no downstream
changes are required.
