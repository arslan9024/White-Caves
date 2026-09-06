# Finance Engine — Bank Reconciliation Contract

- Issue: #2430
- Parent issue: #1937
- Module: `src/features/finance/financeEngineBankReconciliation`

## Purpose

Defines the behavioral contract for the Bank Reconciliation sub-feature of the
Finance Engine (parent workstream W56). This contract governs how bank
statement lines are matched against internal ledger transactions, how
discrepancies are surfaced, and how reconciliation state transitions are
reported to callers. It exists to keep the child scope isolated from the rest
of the Finance Engine while parent issue #1937 remains open and other
sibling child issues are still in flight.

## Scope

In scope for this child issue:

- Contract definition for reconciliation matching rules.
- README describing the module's intended public surface for engineering
  handoff.
- SRS/SDD handoff documents for the W56 finance/bank workstream.

Out of scope (excluded per issue #2430):

- Closing the parent issue (#1937).
- Any bulk GitHub mutation (label/milestone/state changes across issues).
- Destructive database operations (drops, truncates, irreversible migrations).
- Rewriting or rotating production secrets.

## Domain Model (contract-level)

### `BankStatementLine`

| Field               | Type                | Notes                                                                                    |
| ------------------- | ------------------- | ---------------------------------------------------------------------------------------- |
| `id`                | `string`            | Stable unique identifier for the statement line.                                         |
| `postedAt`          | `string` (ISO 8601) | Date the bank posted the transaction.                                                    |
| `amountMinorUnits`  | `number` (integer)  | Signed amount in minor currency units (e.g. cents). Positive = credit, negative = debit. |
| `currency`          | `string` (ISO 4217) | 3-letter currency code.                                                                  |
| `description`       | `string`            | Raw bank-provided description text.                                                      |
| `externalReference` | `string \| null`    | Bank-supplied reference number, if any.                                                  |

### `LedgerTransaction`

| Field                  | Type                                        | Notes                                                                               |
| ---------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------- |
| `id`                   | `string`                                    | Stable unique identifier for the internal ledger entry.                             |
| `bookedAt`             | `string` (ISO 8601)                         | Date the transaction was booked internally.                                         |
| `amountMinorUnits`     | `number` (integer)                          | Signed amount in minor currency units, same sign convention as `BankStatementLine`. |
| `currency`             | `string` (ISO 4217)                         | 3-letter currency code.                                                             |
| `memo`                 | `string`                                    | Internal memo/description.                                                          |
| `reconciliationStatus` | `'unreconciled' \| 'matched' \| 'disputed'` | Current reconciliation state.                                                       |

### `ReconciliationMatch`

| Field                 | Type                                       | Notes                                  |
| --------------------- | ------------------------------------------ | -------------------------------------- |
| `statementLineId`     | `string`                                   | ID of the matched `BankStatementLine`. |
| `ledgerTransactionId` | `string`                                   | ID of the matched `LedgerTransaction`. |
| `matchType`           | `'exact' \| 'amount-and-date' \| 'manual'` | How the match was derived.             |
| `confidence`          | `number`                                   | Value in the closed interval `[0, 1]`. |

### `ReconciliationResult`

| Field                         | Type                    | Notes                                                |
| ----------------------------- | ----------------------- | ---------------------------------------------------- |
| `matches`                     | `ReconciliationMatch[]` | All matches produced for the run.                    |
| `unmatchedStatementLines`     | `BankStatementLine[]`   | Statement lines with no matching ledger transaction. |
| `unmatchedLedgerTransactions` | `LedgerTransaction[]`   | Ledger transactions with no matching statement line. |

## Matching Rules

1. **Currency isolation** — statement lines and ledger transactions are only
   ever compared within the same `currency` code. Cross-currency comparisons
   MUST NOT be attempted by the matcher.
2. **Exact match** — a statement line and a ledger transaction match with
   `matchType: 'exact'` and `confidence: 1` when `amountMinorUnits` is equal
   and `postedAt === bookedAt` (same calendar date).
3. **Amount-and-date match** — when amounts are equal but dates differ by no
   more than a configurable tolerance window (default: 3 days), the match is
   recorded as `matchType: 'amount-and-date'` with `confidence` scaled
   linearly from `1` (same day) down to `0.5` at the edge of the tolerance
   window.
4. **No partial-amount matching** — the contract does not define any
   automatic matching for differing amounts; such cases MUST be reported as
   unmatched and left for manual reconciliation (`matchType: 'manual'` is
   reserved for operator-confirmed matches, never produced automatically).
5. **Idempotency** — running the reconciliation process twice over the same
   unmodified input MUST produce an identical `ReconciliationResult` (same
   matches, same unmatched sets, same ordering by input index).
6. **No mutation of inputs** — the reconciliation process MUST treat
   `BankStatementLine[]` and `LedgerTransaction[]` inputs as read-only and
   MUST NOT mutate `reconciliationStatus` or any other field on the caller's
   objects; state transitions are communicated only via the returned
   `ReconciliationResult`.

## Error Handling

- Invalid currency codes (not matching `^[A-Z]{3}$`) MUST cause the offending
  record to be excluded from matching and reported via a validation error
  channel (not silently dropped without signal).
- Non-integer `amountMinorUnits` values are considered malformed input and
  MUST be rejected before matching begins.

## Non-Goals

- This contract does not define persistence, API endpoints, or UI
  presentation. Those are addressed by sibling child issues under parent
  #1937 and are explicitly out of scope here.
- This contract does not define currency conversion; multi-currency
  reconciliation is out of scope for this child issue.

## Traceability

- Parent issue: #1937 (Finance Engine, workstream W56).
- Child issue: #2430 (Bank Reconciliation contract + handoff).
- Related handoff docs: `plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-BANK-1937.md`,
  `plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-BANK-1937.md`.
