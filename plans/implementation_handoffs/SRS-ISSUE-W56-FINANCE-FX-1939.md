# Software Requirements Specification (SRS)

## Issue: W56-FINANCE-FX — FX Gain/Loss Calculation Module

- **Child issues:** #2421, #2422
- **Parent issue:** #1939 (Finance Engine, Workstream 56)
- **Module:** `src/features/finance/financeEngineFxGain/`
- **Status:** Draft — child scope only; parent issue #1939 remains open
  until all child work under it is reconciled.

> Note (#2421): the calculation logic specified below is implemented in
> `financeEngineFxGain.logic.ts` (and tested in
> `financeEngineFxGain.logic.test.ts`), split out from the module's
> contract/README documentation files so the pure-function surface can be
> reviewed and reverted independently. Both child issues #2421 and #2422
> share this single SRS/SDD pair since they describe the same module and
> the same public API; neither child issue closes parent issue #1939.

## 1. Purpose

Specify the functional and non-functional requirements for a module that
calculates FX (foreign exchange) gain or loss arising from multi-currency
transactions processed through the White Caves Finance Engine.

## 2. Background

Property reservations, invoices, and settlements may be denominated in a
currency other than the platform's base ledger currency. When the
exchange rate moves between the booking date and the settlement date (or
a period-end revaluation date), the base-currency value of the
transaction changes. This difference must be captured as a realized or
unrealized gain/loss for accurate financial reporting.

## 3. Scope

### 3.1 In scope

- FR-1: Calculate the base-currency value of a transaction at booking
  time and at settlement/valuation time.
- FR-2: Calculate the FX gain or loss as the difference between the two
  base-currency values.
- FR-3: Classify the result as `'gain'`, `'loss'`, or `'none'`.
- FR-4: Support both `'realized'` (fully settled) and `'unrealized'`
  (open, period-end revaluation) transaction states.
- FR-5: Validate all numeric and currency-code inputs and reject invalid
  input with a typed, discriminated error.
- FR-6: Aggregate FX gain/loss across a batch of transactions into total
  gain, total loss, and net amount.

### 3.2 Out of scope (excluded scope for this issue)

- Closing or otherwise mutating parent issue #1939.
- Any bulk GitHub API mutation.
- Destructive database operations.
- Production secret rewrites.
- Exchange-rate sourcing, caching, or persistence.
- Posting entries to the general ledger.
- UI/reporting presentation layers.

## 4. Functional Requirements (detail)

| ID   | Requirement                                                                                                                                                                                                                 |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-1 | Given a transaction amount, a booking rate, and a settlement/valuation rate, the module computes `bookedBaseAmount` and `settledBaseAmount` in the base currency.                                                           |
| FR-2 | `gainLossAmount = settledBaseAmount - bookedBaseAmount`, rounded to 2 decimal places.                                                                                                                                       |
| FR-3 | `direction` is `'gain'` if `gainLossAmount > 0`, `'loss'` if `< 0`, `'none'` if `= 0`.                                                                                                                                      |
| FR-4 | The `settlementStatus` field (`'realized' \| 'unrealized'`) is preserved on the result for downstream reporting/classification; it does not change the calculation formula.                                                 |
| FR-5 | Reject non-ISO-shaped currency codes, non-finite amounts, negative amounts, and non-positive rates, each with a distinct error code (`INVALID_CURRENCY_CODE`, `NON_FINITE_AMOUNT`, `NEGATIVE_AMOUNT`, `NON_POSITIVE_RATE`). |
| FR-6 | `summarizeFxGainLoss` sums gains and losses (as an absolute value) separately across a list of results and computes the net amount; an empty list yields all-zero totals.                                                   |
| FR-7 | When transaction currency equals base currency, no FX exposure exists; the result must report `gainLossAmount: 0` and `direction: 'none'`.                                                                                  |

## 5. Non-Functional Requirements

- NFR-1: Written in strict TypeScript; no `any` types anywhere in the
  module's public or internal surface.
- NFR-2: Pure functions only — no network, filesystem, or database access
  from within this module.
- NFR-3: Deterministic output for identical input (no reliance on
  wall-clock time, randomness, or external state).
- NFR-4: Numeric results rounded to 2 decimal places to align with
  standard currency-minor-unit reporting.
- NFR-5: All validation failures are surfaced as a typed error class
  (`FxGainCalculationError`) rather than `null`/`undefined` sentinels.

## 6. Acceptance Criteria

- Implementation remains within the declared child scope (this module
  only; no changes to parent issue #1939 or unrelated files).
- Focused tests (vitest) and required validation commands pass.
- Completion evidence (test run output) and a rollback note are recorded
  in the module's contract/README.
- Parent issue #1939 remains open until all child work under it is
  reconciled — this issue does not close it.

## 7. Traceability

- Design: `plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-FX-1939.md`
- Contract: `src/features/finance/financeEngineFxGain/financeEngineFxGain.contract.md`
- Module README: `src/features/finance/financeEngineFxGain/README.md`
- Logic implementation (#2421): `src/features/finance/financeEngineFxGain/financeEngineFxGain.logic.ts`
- Logic tests (#2421): `src/features/finance/financeEngineFxGain/financeEngineFxGain.logic.test.ts`

## 8. Rollback

If this requirement set or its implementation needs to be reverted, delete
the `financeEngineFxGain` module directory and this SRS/SDD pair. No
schema, migration, secret, or parent-issue state is affected, since the
module is additive and consumes no external resources. For issue #2421
specifically, reverting only `financeEngineFxGain.logic.ts` and
`financeEngineFxGain.logic.test.ts` is sufficient and does not affect any
other file in the module or this shared SRS/SDD pair.

## 9. Completion Evidence (#2421)

Focused vitest run of `financeEngineFxGain.logic.test.ts` covering: realized
gain, realized loss, unrealized revaluation, same-currency no-exposure,
rounding, all four validation error codes with fixed precedence, and
`summarizeFxGainLoss` over mixed and empty batches. Evidence (pass/fail
counts) is recorded alongside the implementation commit for #2421. Parent
issue #1939 remains open pending reconciliation of all sibling child
issues under Workstream W56.
