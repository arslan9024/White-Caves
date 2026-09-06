# SRS — Finance Engine Intercompany Transfer

- **ID:** SRS-ISSUE-W56-FINANCE-TRANSFER-1936
- **Issue:** #2434
- **Parent issue:** #1936
- **Workstream:** W56 — Finance Engine
- **Document type:** Software Requirements Specification (implementation handoff)
- **Status:** Approved for handoff

## 1. Introduction

### 1.1 Purpose

This SRS specifies the requirements for the Intercompany Transfer capability of the
White Caves Finance Engine. It is the handoff artifact from the contract-definition
child issue (#2434) to whichever child issue under parent #1936 performs the runtime
implementation.

### 1.2 Scope

The capability allows recognized value to move between two related entities (e.g. a
holding entity and a project SPV) inside the platform's finance domain, producing a
matched debit/credit ledger pair, while remaining idempotent, currency-safe, and fully
auditable.

### 1.3 Definitions

| Term                  | Meaning                                                                        |
| --------------------- | ------------------------------------------------------------------------------ |
| Entity                | A legal/business unit with its own ledger (e.g. holding company, project SPV). |
| Intercompany transfer | A value movement between two distinct entities.                                |
| Minor units           | Smallest currency unit (e.g. fils, cents) represented as an integer.           |
| Idempotency key       | `requestId` used to detect and safely no-op duplicate submissions.             |

## 2. Overall Description

### 2.1 Product perspective

This capability is a sub-component of the Finance Engine (`src/features/finance/`),
consumed by treasury/back-office workflows that need to move recognized value between
entities without violating double-entry accounting invariants across entity boundaries.

### 2.2 User classes

- **Finance/treasury operators** — initiate intercompany transfers.
- **Auditors/compliance** — consume the resulting paired ledger entries for
  reconciliation.
- **Downstream engineering** — implement and test the module against this SRS/SDD pair.

### 2.3 Constraints

- Strict TypeScript; no `any` types in the eventual implementation.
- No new dependencies may be introduced to satisfy this capability.
- No destructive database operations, no production secret rewrites, no bulk GitHub
  mutations, and no closing of parent issue #1936 as part of this or any strictly-scoped
  child issue.

## 3. Functional Requirements

| ID   | Requirement                                                                                                                                                                                        |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-1 | The system shall accept an `IntercompanyTransferRequest` containing source entity, destination entity, amount (integer minor units), currency, and idempotency key.                                |
| FR-2 | The system shall reject a request where source and destination entity are identical, with reason `SAME_ENTITY`.                                                                                    |
| FR-3 | The system shall reject a request where the amount is not a positive integer, with reason `NON_POSITIVE_AMOUNT`.                                                                                   |
| FR-4 | The system shall reject a request whose currency is not in the supported allow-list, with reason `UNSUPPORTED_CURRENCY`.                                                                           |
| FR-5 | The system shall reject a request referencing an unregistered entity, with reason `UNKNOWN_ENTITY`.                                                                                                |
| FR-6 | The system shall detect and short-circuit duplicate `requestId` submissions, returning the original result rather than posting again.                                                              |
| FR-7 | On success, the system shall atomically create exactly two ledger entries: a debit against the source entity and a credit against the destination entity, both tagged with the shared `requestId`. |
| FR-8 | The system shall support reversing a `posted` transfer via an equal-and-opposite append-only ledger entry pair, referencing the original `requestId`.                                              |
| FR-9 | The system shall reject transfers from callers lacking intercompany-transfer authorization for the source entity, with reason `INSUFFICIENT_AUTHORIZATION`.                                        |

## 4. Non-Functional Requirements

| ID    | Requirement                                                                                                       |
| ----- | ----------------------------------------------------------------------------------------------------------------- |
| NFR-1 | All implementation code shall be strict TypeScript with no `any` types.                                           |
| NFR-2 | All monetary values shall be represented as integer minor units; no floating-point arithmetic on money.           |
| NFR-3 | All public behavior shall be covered by `vitest` unit tests asserting real outcomes (not placeholder assertions). |
| NFR-4 | Posting of the debit/credit pair shall be atomic — partial posting is not permitted.                              |
| NFR-5 | The module shall introduce no new runtime dependencies.                                                           |

## 5. Acceptance Criteria (traced to issue #2434)

- Implementation remains within the declared child scope (contract + planning docs
  only for this issue; no runtime module changes).
- Focused tests and required validation commands pass for any code introduced.
- Completion evidence and a rollback note are recorded (see SDD handoff, §7).
- Parent issue #1936 remains open until all child work under it is reconciled.

## 5.1 Acceptance Criteria (traced to child issue #2433 — runtime implementation)

- FR-1 through FR-9 are satisfied by
  `src/features/finance/financeEngineIntercompanyTransfer/financeEngineIntercompanyTransfer.logic.ts`,
  and NFR-1 through NFR-5 are satisfied as described in SDD §7.0.
- Implementation remains within the declared child scope (the `.logic.ts`/`.logic.test.ts`
  pair and this SRS/SDD update only; no other files were touched).
- Focused `vitest` tests (12/12) and `tsc --noEmit` type-checking pass; see SDD §7.0
  for validation evidence.
- Completion evidence and a rollback note are recorded (see SDD handoff, §7.0 and §7.3).
- Parent issue #1936 remains open until all child work under it is reconciled.

## 5.2 Acceptance Criteria (traced to child issue #2432 — shared domain types)

- FR-1 through FR-9's associated data shapes (`IntercompanyTransferRequest`,
  `LedgerEntry`, `PostedTransferResult`, `RejectedTransferResult`,
  `IntercompanyTransferResult`, `ReversalResult`) and NFR-1/NFR-5 are satisfied by
  `src/features/finance/financeEngineIntercompanyTransfer/financeEngineIntercompanyTransfer.types.ts`,
  a standalone, side-effect-free type module extracted for reuse by any future
  validation/service layer without depending on `financeEngineIntercompanyTransfer.logic.ts`.
- Implementation remains within the declared child scope (the `.types.ts`/`.types.test.ts`
  pair and this SRS/SDD update only; `financeEngineIntercompanyTransfer.logic.ts` and its
  test file were not modified).
- Focused `vitest` tests and `tsc --noEmit` type-checking pass; see SDD §7.4 for
  validation evidence.
- Completion evidence and a rollback note are recorded (see SDD handoff, §7.4 and §7.5).
- Parent issue #1936 remains open until all child work under it is reconciled.

## 6. Excluded Scope

- Parent issue closure.
- Bulk GitHub mutation of any kind.
- Destructive database operations.
- Production secret rewrites.

## 7. Traceability

- Contract: `src/features/finance/financeEngineIntercompanyTransfer/financeEngineIntercompanyTransfer.contract.md`
- Design handoff: `plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-TRANSFER-1936.md`
- Runtime implementation (child issue #2433):
  `src/features/finance/financeEngineIntercompanyTransfer/financeEngineIntercompanyTransfer.logic.ts`
  and `financeEngineIntercompanyTransfer.logic.test.ts`
- Shared domain types (child issue #2432):
  `src/features/finance/financeEngineIntercompanyTransfer/financeEngineIntercompanyTransfer.types.ts`
  and `financeEngineIntercompanyTransfer.types.test.ts`
- Parent issue: #1936
