# Finance Engine Cheque Registry

Part of the White Caves finance engine. Tracks post-dated and issued
cheques linked to finance ledger entries (rent, deposits, service charges).

- Issue: #2426
- Parent issue: #1938
- Contract: [`financeEngineChequeRegistry.contract.md`](./financeEngineChequeRegistry.contract.md)

## Status

Documentation and contract phase. This directory currently defines the
data model, invariants, and public API contract that any implementation
(and its Vitest test suite) must satisfy. Implementation code lands in a
follow-up child issue under parent #1938.

## Why this module exists

Cheque handling is a recurring pain point in Dubai real-estate leasing:
tenants commonly pay via post-dated cheques (PDCs), and finance staff need
a reliable way to track which cheques are pending, cleared, bounced, or
cancelled against which lease/ledger entry — independent of any specific
bank integration.

## Scope

- **In scope:** pure, in-memory data model + validation + lifecycle
  transition rules + query helpers for cheque records.
- **Out of scope:** parent issue closure, bulk GitHub mutation, destructive
  database operations, production secret rewrites, bank/network
  integrations, and persistence (callers own storage).

## Data Model (summary)

A `ChequeRecord` has an `id`, `chequeNumber`, `amount`, `issueDate`,
optional `clearedDate`, `ledgerReference`, `status`
(`pending | cleared | bounced | cancelled`), and optional `note`. See the
contract file for full field semantics and invariants.

## Lifecycle

```
pending ──► cleared
pending ──► bounced
pending ──► cancelled
```

No other transitions are permitted; `cleared`, `bounced`, and `cancelled`
are terminal states.

## Public API (summary)

| Function                                            | Purpose                                                                      |
| --------------------------------------------------- | ---------------------------------------------------------------------------- |
| `createChequeRecord(input)`                         | Construct and validate a new `pending` cheque record.                        |
| `validateChequeRecord(record)`                      | Return a list of validation violation messages (empty = valid).              |
| `canTransition(from, to)`                           | Pure check of whether a status transition is allowed.                        |
| `transitionCheque(record, toStatus, options?)`      | Return a new record in the target status, or throw on an invalid transition. |
| `filterByStatus(records, status)`                   | Return records matching a given status.                                      |
| `filterByLedgerReference(records, ledgerReference)` | Return records for a given ledger entry.                                     |
| `sumOutstandingAmount(records)`                     | Sum of `amount` across all `pending` records.                                |

Full signatures live in the contract file.

## Testing

Tests use Vitest:

```ts
import { describe, expect, it } from 'vitest';
```

Test files must assert real behavior (validation failures, transition
rules, aggregation results) — never placeholder assertions.

## Related documents

- SRS: `plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-CHEQUE-1938.md`
- SDD: `plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-CHEQUE-1938.md`

## Rollback

This README and the contract file are additive documentation only. Removing
this directory fully reverts the change with no impact on other modules,
since no implementation or test files currently exist here.
