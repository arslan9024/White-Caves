# Finance Engine — Commission Ledger Contract

- Parent issue: #1930
- Child issue: #2460
- Status: Draft (child scope only; parent remains open until all child work is reconciled)

## Purpose

Defines the data and behavioral contract for the Commission Ledger module within the
Finance Engine feature area. The Commission Ledger is responsible for recording,
aggregating, and reconciling commission entries attributable to agents/brokers on
completed or in-progress property transactions.

## Scope

In scope for this child issue:

- Documentation of the domain contract (entities, invariants, operations) for the
  Commission Ledger.
- Establishing the module boundary within `src/features/finance/financeEngineCommissionLedger/`.

Out of scope (excluded scope, per parent orchestration policy):

- Parent issue (#1930) closure.
- Bulk GitHub mutation of any kind.
- Destructive database operations (drops, truncations, irreversible migrations).
- Production secret rewrites (env vars, credentials, API keys).
- Any implementation of unrelated finance sub-modules (payouts, invoicing, tax).

## Domain Model

### CommissionLedgerEntry

| Field              | Type                                            | Required | Notes                                                                    |
| ------------------ | ----------------------------------------------- | -------- | ------------------------------------------------------------------------ |
| `id`               | `string` (UUID)                                 | yes      | Unique identifier for the ledger entry.                                  |
| `dealId`           | `string`                                        | yes      | Reference to the originating deal/transaction.                           |
| `agentId`          | `string`                                        | yes      | Reference to the agent/broker earning the commission.                    |
| `grossAmount`      | `number`                                        | yes      | Gross transaction amount the commission is based on. Must be `>= 0`.     |
| `commissionRate`   | `number`                                        | yes      | Fractional rate applied, range `0..1` inclusive.                         |
| `commissionAmount` | `number`                                        | yes      | Computed as `grossAmount * commissionRate`, rounded to 2 decimal places. |
| `currency`         | `string` (ISO 4217, e.g. `"AED"`)               | yes      | 3-letter uppercase currency code.                                        |
| `status`           | `'pending' \| 'approved' \| 'paid' \| 'voided'` | yes      | Lifecycle state of the entry.                                            |
| `createdAt`        | `string` (ISO 8601 timestamp)                   | yes      | Creation timestamp.                                                      |
| `updatedAt`        | `string` (ISO 8601 timestamp)                   | yes      | Last mutation timestamp.                                                 |

### Invariants

1. `commissionRate` MUST be within the closed interval `[0, 1]`.
2. `grossAmount` MUST be `>= 0`.
3. `commissionAmount` MUST equal `round(grossAmount * commissionRate, 2)` at creation
   time and after any recalculation.
4. Valid status transitions are:
   - `pending -> approved`
   - `pending -> voided`
   - `approved -> paid`
   - `approved -> voided`
     Any other transition (including transitions from `paid` or `voided`, or skipping
     states) is invalid and MUST be rejected.
5. `updatedAt` MUST be set to a value greater than or equal to `createdAt` for a
   given entry, and MUST be refreshed on every mutating operation.
6. Ledger entries are immutable with respect to `id`, `dealId`, `agentId`,
   `grossAmount`, `commissionRate`, `currency`, and `createdAt` once created; only
   `status`, `commissionAmount` (via recalculation), and `updatedAt` may change.

## Operations Contract

### `createCommissionEntry(input)`

- Validates `grossAmount >= 0` and `0 <= commissionRate <= 1`; throws a descriptive
  `Error` otherwise.
- Computes `commissionAmount` per invariant 3.
- Initializes `status` to `'pending'` unless explicitly overridden with a valid
  initial status (`'pending'` only is accepted as an explicit initial status).
- Returns a fully-populated `CommissionLedgerEntry`.

### `transitionStatus(entry, nextStatus)`

- Validates the transition against invariant 4.
- Throws a descriptive `Error` when the transition is invalid.
- Returns a new entry object (does not mutate the input) with `status` and
  `updatedAt` updated.

### `recalculateCommission(entry)`

- Recomputes `commissionAmount` from the entry's existing `grossAmount` and
  `commissionRate`.
- Returns a new entry object with `commissionAmount` and `updatedAt` updated.
- Idempotent: calling it repeatedly without changing `grossAmount`/`commissionRate`
  yields the same `commissionAmount`.

### `summarizeLedger(entries)`

- Aggregates an array of `CommissionLedgerEntry` into per-status totals:
  `{ pending, approved, paid, voided }`, each a `number` sum of `commissionAmount`
  for entries in that status.
- Returns `0` for any status with no matching entries.
- Does not mutate the input array.

## Reconciliation & Rollback

- This contract document and the accompanying `README.md` are additive artifacts;
  no existing exported symbols in the repository are modified or removed.
- Rollback: delete the
  `src/features/finance/financeEngineCommissionLedger/` directory. No other files
  are touched, no migrations are applied, and no runtime behavior outside this
  module is affected by this change.
- Parent issue #1930 remains open; this child issue (#2460) addresses only the
  contract/documentation scope described above and does not itself close any
  issue.
