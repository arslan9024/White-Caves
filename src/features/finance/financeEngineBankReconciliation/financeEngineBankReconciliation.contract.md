# Finance Engine — Bank Reconciliation Contract

- Parent issue: #1937
- Child issue: #2430
- Module path: `src/features/finance/financeEngineBankReconciliation/`

## Purpose

Defines the reconciliation contract between imported bank statement lines and
internal finance engine ledger transactions. This document specifies the
data shapes, matching rules, and status lifecycle that any implementation
under this module must honor. It is the source of truth for the TypeScript
types and matching engine referenced by future implementation work under
this child issue.

## Scope

In scope:

- Bank statement line ingestion shape (`BankStatementLine`).
- Ledger transaction shape used for matching (`LedgerTransaction`).
- Reconciliation match result shape (`ReconciliationMatch`) and status enum.
- Pure matching rules (exact amount + date window, reference-number match,
  fuzzy amount tolerance) expressed as deterministic functions.
- Summary/report shape (`ReconciliationSummary`) for a reconciliation run.

Out of scope (excluded per parent/child governance):

- Parent issue closure.
- Bulk GitHub mutation of any kind.
- Destructive database operations (deletes, truncates, migrations).
- Production secret rewrites or credential handling.
- Any live bank API integration — this contract governs in-memory /
  already-imported data only.

## Data Contracts

### `BankStatementLine`

| Field             | Type                     | Notes                                                       |
| ----------------- | ------------------------ | ----------------------------------------------------------- |
| `id`              | `string`                 | Unique identifier for the statement line.                   |
| `postedDate`      | `string` (ISO 8601 date) | Date the transaction posted at the bank.                    |
| `amountCents`     | `number`                 | Signed integer, cents. Positive = credit, negative = debit. |
| `description`     | `string`                 | Raw bank-provided description.                              |
| `referenceNumber` | `string \| null`         | Optional bank reference / check number.                     |

### `LedgerTransaction`

| Field             | Type                     | Notes                                                     |
| ----------------- | ------------------------ | --------------------------------------------------------- |
| `id`              | `string`                 | Unique identifier for the internal ledger entry.          |
| `transactionDate` | `string` (ISO 8601 date) | Date recorded internally.                                 |
| `amountCents`     | `number`                 | Signed integer, cents. Same sign convention as bank line. |
| `memo`            | `string`                 | Internal memo/description.                                |
| `referenceNumber` | `string \| null`         | Optional reference matched against bank line.             |

### `ReconciliationStatus`

Enum of: `"matched" | "unmatched" | "amount-mismatch" | "date-out-of-window"`.

### `ReconciliationMatch`

| Field                 | Type                   | Notes                                                                  |
| --------------------- | ---------------------- | ---------------------------------------------------------------------- |
| `bankLineId`          | `string`               | Reference to `BankStatementLine.id`.                                   |
| `ledgerTransactionId` | `string \| null`       | Reference to matched `LedgerTransaction.id`, or `null` if unmatched.   |
| `status`              | `ReconciliationStatus` | Result of the match attempt.                                           |
| `confidence`          | `number`               | `0` to `1` inclusive; `1` = exact reference + amount + date match.     |
| `varianceCents`       | `number`               | Absolute difference in cents between matched amounts (`0` when exact). |

### `ReconciliationSummary`

| Field            | Type                    | Notes                                                  |
| ---------------- | ----------------------- | ------------------------------------------------------ |
| `totalBankLines` | `number`                | Count of bank lines processed.                         |
| `totalMatched`   | `number`                | Count of lines with status `"matched"`.                |
| `totalUnmatched` | `number`                | Count of lines with status other than `"matched"`.     |
| `matches`        | `ReconciliationMatch[]` | Full per-line results, same order as input bank lines. |

## Matching Rules

1. **Exact match**: reference numbers equal (non-null, case-insensitive
   trimmed comparison), amounts equal exactly, dates within the configured
   window (default 3 days) → `status: "matched"`, `confidence: 1`.
2. **Amount-tolerant match**: no reference match, but amount within
   configured tolerance (default 0 cents — exact only unless overridden)
   and date within window → `status: "matched"`, confidence scaled by how
   close the amount and date are.
3. **Amount mismatch**: date within window, reference or near-amount match
   found but amounts differ beyond tolerance → `status: "amount-mismatch"`.
4. **Date out of window**: otherwise-compatible candidate exists but the
   date difference exceeds the window → `status: "date-out-of-window"`.
5. **No candidate**: no ledger transaction meets any of the above →
   `status: "unmatched"`, `ledgerTransactionId: null`, `confidence: 0`.
6. Matching is deterministic and side-effect free: given the same inputs,
   the same `ReconciliationMatch[]` is produced every run. No I/O occurs
   inside the matching functions.
7. A ledger transaction may be consumed by at most one match; once matched
   it is removed from the candidate pool for subsequent bank lines.

## Non-Functional Requirements

- Strict TypeScript, no `any` types, no implicit `any`.
- All exported functions are pure (no network, no filesystem, no DB calls).
- All public types and functions must be unit-testable in isolation via
  Vitest with real behavioral assertions.

## Acceptance Criteria (traceable to issue #2430)

- [ ] Implementation remains within `src/features/finance/financeEngineBankReconciliation/` (declared child scope).
- [ ] Focused Vitest tests and required validation commands pass.
- [ ] Completion evidence and rollback note recorded in the SDD handoff.
- [ ] Parent issue #1937 remains open until all child work is reconciled.
