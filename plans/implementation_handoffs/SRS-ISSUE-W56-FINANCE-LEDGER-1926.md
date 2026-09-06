# SRS — W56 Finance Ledger (Software Requirements Specification)

- **Parent issue**: #1926
- **Child issue**: #2479
- **Component**: `src/features/finance/financeEngineDoubleEntry`
- **Document type**: Software Requirements Specification
- **Status**: Handoff record for the double-entry finance ledger engine scope

## 1. Introduction

### 1.1 Purpose

This SRS captures the functional and non-functional requirements for the double-entry finance
ledger engine (work stream W56) that underlies booking payments, refunds, commissions, and payouts
in the White Caves platform. It is the requirements-of-record handed off between planning and
implementation for issue #2479, a child scope of parent #1926.

### 1.2 Scope

In scope:

- Definition of ledger domain types (accounts, entries, transactions).
- Validation rules for balanced double-entry transactions.
- Deterministic account balance derivation.
- Transaction reversal semantics.
- Idempotent transaction posting.

Out of scope (see also `financeEngineDoubleEntry.contract.md` §7):

- Parent issue #1926 closure.
- Bulk GitHub mutation of any kind.
- Destructive database operations.
- Production secret rewrites.
- Persistence adapters, HTTP/API routes, currency conversion, and reporting — tracked as separate
  child issues under #1926.

### 1.3 Definitions

| Term           | Definition                                                                         |
| -------------- | ---------------------------------------------------------------------------------- |
| Ledger account | A named bucket (asset/liability/equity/revenue/expense) that entries post against. |
| Entry          | A single debit or credit line item within a transaction.                           |
| Transaction    | A balanced set of ≥2 entries recorded atomically.                                  |
| Posting        | The act of committing a validated transaction to ledger state.                     |
| Reversal       | A new transaction that negates a previously posted transaction.                    |

## 2. Overall Description

### 2.1 Product Perspective

The double-entry engine is a pure computation module consumed by higher-level services (booking
settlement, payout processing, manual finance adjustments). It has no direct database or network
dependency; it is deliberately isolated so it can be unit-tested exhaustively and reused across
any persistence backend chosen later.

### 2.2 User Classes

- **Finance service developers**: integrate the engine into booking/payout/refund workflows.
- **Finance operations staff** (indirect, via UI built on top of this engine in a later scope):
  need guaranteed balanced books and auditable reversal trails.
- **Auditors / compliance reviewers**: rely on immutability and full reversal trail rather than
  in-place mutation of historical records.

### 2.3 Assumptions and Dependencies

- All monetary amounts are expressed in integer minor units (fils/cents); no floating point money
  is introduced anywhere in the call chain.
- Account metadata (type, currency, active status) is supplied by the caller; this scope does not
  define account provisioning/management.
- Concurrency control for simultaneous postings is the responsibility of the persistence layer
  that wraps this engine (out of scope here).

## 3. Functional Requirements

| ID    | Requirement                                                                                                                                                                                                             | Priority |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| FR-1  | The system SHALL reject any transaction containing fewer than two entries.                                                                                                                                              | Must     |
| FR-2  | The system SHALL reject any transaction that is not composed of at least one debit and one credit entry.                                                                                                                | Must     |
| FR-3  | The system SHALL reject any transaction where the sum of debit amounts does not equal the sum of credit amounts.                                                                                                        | Must     |
| FR-4  | The system SHALL reject any transaction whose entries reference more than one currency.                                                                                                                                 | Must     |
| FR-5  | The system SHALL reject any entry with a non-integer or non-positive `amountMinorUnits`.                                                                                                                                | Must     |
| FR-6  | The system SHALL reject any entry referencing an account that is unknown or inactive.                                                                                                                                   | Must     |
| FR-7  | The system SHALL report all applicable validation failures for a candidate transaction, not only the first encountered.                                                                                                 | Must     |
| FR-8  | The system SHALL NOT post a transaction that fails validation.                                                                                                                                                          | Must     |
| FR-9  | The system SHALL treat posting requests with a previously seen `reference` as idempotent, returning the existing posted transaction rather than creating a duplicate.                                                   | Must     |
| FR-10 | The system SHALL derive an account's balance deterministically from its posted entries, applying debit-normal accounting for asset/expense accounts and credit-normal accounting for liability/equity/revenue accounts. | Must     |
| FR-11 | The system SHALL support generating a reversal transaction from any previously posted transaction, flipping each entry's side while preserving amounts and currency.                                                    | Must     |
| FR-12 | The system SHALL NOT mutate a transaction object once it has been returned as posted.                                                                                                                                   | Must     |
| FR-13 | The system SHALL record on each reversal transaction a reference (via metadata) back to the transaction it reverses.                                                                                                    | Should   |

## 4. Non-Functional Requirements

| ID    | Requirement                                                                                                                                                                 |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NFR-1 | Implementation SHALL use strict TypeScript with no `any` types.                                                                                                             |
| NFR-2 | Public engine functions SHALL be pure (no hidden I/O, no global mutable state) except where explicitly documented (e.g., idempotency lookup against supplied ledger state). |
| NFR-3 | All domain types SHALL be expressed with `readonly` fields/arrays to prevent accidental mutation.                                                                           |
| NFR-4 | Test suites SHALL use vitest (`import { describe, expect, it } from 'vitest'`) with assertions on real computed values, never placeholder assertions.                       |
| NFR-5 | The engine SHALL remain free of runtime dependencies beyond what already exists in the repository; no new packages SHALL be introduced by this scope.                       |

## 5. Acceptance Criteria (traceable to parent #1926 / child #2479)

- Implementation remains within the declared child scope (double-entry engine only; no
  persistence, API, or currency-conversion code).
- Focused unit tests (vitest) covering FR-1 through FR-13 pass, along with any required repo-wide
  validation commands scoped to the touched files.
- Completion evidence (test run output) and this handoff document's rollback note are retained
  alongside the change.
- Parent issue #1926 remains open until all sibling child issues under the W56 finance ledger
  work stream are reconciled.

## 6. Rollback Note

This SRS document and its sibling handoff/design documents are additive artifacts under
`plans/implementation_handoffs/` and `src/features/finance/financeEngineDoubleEntry/`. Rollback is
a straightforward deletion of the four files introduced by issue #2479 (this SRS, the paired SDD,
the contract, and the README); no schema, dependency, or runtime configuration changes are made by
this scope, so no additional remediation is required.
