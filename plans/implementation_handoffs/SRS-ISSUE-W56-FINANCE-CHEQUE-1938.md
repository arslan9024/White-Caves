# Software Requirements Specification — Finance Engine Cheque Registry

- Handoff ID: SRS-ISSUE-W56-FINANCE-CHEQUE-1938
- Issue: #2426
- Parent issue: #1938 (remains open until all child work is reconciled)
- Module: `src/features/finance/financeEngineChequeRegistry`
- Status: Documented / ready for implementation handoff

## 1. Purpose

Specify the functional and non-functional requirements for a cheque
registry within the White Caves finance engine, enabling tracking of
post-dated and issued cheques against finance ledger entries (leases,
invoices, deposits, service charges).

## 2. Background

Parent issue #1938 tracks the broader "Finance Engine" workstream (W56).
This child issue (#2426) delivers the requirements, design, and contract
for the cheque-tracking sub-capability without closing the parent issue and
without performing any bulk GitHub mutation, destructive database
operation, or production secret rewrite.

## 3. Stakeholders

- Finance/accounts staff recording and reconciling tenant cheque payments.
- Engineering team implementing the finance engine.
- QA validating cheque lifecycle correctness.

## 4. Functional Requirements

| ID    | Requirement                                                                                                                                                                                                |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-1  | The system SHALL represent a cheque as a `ChequeRecord` with fields: `id`, `chequeNumber`, `amount`, `issueDate`, `clearedDate?`, `ledgerReference`, `status`, `note?`.                                    |
| FR-2  | The system SHALL validate that `amount` is a finite number strictly greater than zero.                                                                                                                     |
| FR-3  | The system SHALL validate that `chequeNumber` and `ledgerReference` are non-empty, trimmed strings.                                                                                                        |
| FR-4  | The system SHALL validate that `issueDate` (and `clearedDate` when present) are valid ISO-8601 (`YYYY-MM-DD`) dates.                                                                                       |
| FR-5  | The system SHALL reject a `clearedDate` earlier than `issueDate`.                                                                                                                                          |
| FR-6  | The system SHALL enforce cheque lifecycle transitions restricted to `pending → cleared`, `pending → bounced`, and `pending → cancelled`; all other transitions SHALL be rejected with a descriptive error. |
| FR-7  | The system SHALL provide query helpers to filter cheque records by `status` and by `ledgerReference`.                                                                                                      |
| FR-8  | The system SHALL provide an aggregation helper returning the total outstanding (`pending`) cheque amount across a given record set.                                                                        |
| FR-9  | All registry operations SHALL be pure functions with no side effects; mutating operations SHALL return new record instances rather than mutating inputs.                                                   |
| FR-10 | Invalid construction or invalid transitions SHALL throw `Error` instances carrying a human-readable violation message.                                                                                     |

## 5. Non-Functional Requirements

| ID    | Requirement                                                                                                                                   |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| NFR-1 | Implementation SHALL use strict TypeScript with no `any` types.                                                                               |
| NFR-2 | Test coverage SHALL use Vitest (`import { describe, expect, it } from 'vitest'`) with real behavioral assertions — no placeholder assertions. |
| NFR-3 | The module SHALL introduce no new runtime dependencies.                                                                                       |
| NFR-4 | The module SHALL not perform network calls, database writes, or filesystem I/O.                                                               |
| NFR-5 | The module SHALL remain isolated under `src/features/finance/financeEngineChequeRegistry` and not modify files outside its declared scope.    |

## 6. Out of Scope / Exclusions

- Parent issue (#1938) closure.
- Bulk GitHub mutation of any kind.
- Destructive database operations.
- Production secret rewrites.
- Bank/payment-provider network integration.
- Persistence layer (registry is stateless; callers own storage).

## 7. Acceptance Criteria

1. Implementation stays within the declared child scope
   (`src/features/finance/financeEngineChequeRegistry` and its own tests).
2. Focused Vitest tests and required validation commands (typecheck, unit
   tests for this module) pass.
3. Completion evidence (test run output) and a rollback note are recorded
   alongside the implementation.
4. Parent issue #1938 remains open; this child issue does not close it.

## 8. Traceability

| Requirement | Contract Reference                                                                                        |
| ----------- | --------------------------------------------------------------------------------------------------------- |
| FR-1 – FR-5 | `financeEngineChequeRegistry.contract.md` §Data Model, §Invariants                                        |
| FR-6        | `financeEngineChequeRegistry.contract.md` §Invariants (5), §Public API `canTransition`/`transitionCheque` |
| FR-7        | `financeEngineChequeRegistry.contract.md` §Public API `filterByStatus`/`filterByLedgerReference`          |
| FR-8        | `financeEngineChequeRegistry.contract.md` §Public API `sumOutstandingAmount`                              |
| FR-9, FR-10 | `financeEngineChequeRegistry.contract.md` §Invariants (6, 7), §Error Handling                             |

## 9. Rollback Note

This SRS is a documentation artifact under `plans/implementation_handoffs/`.
Deleting this file (and its companion SDD) fully reverts this handoff with
no effect on runtime code, since no implementation files are introduced by
this issue.

## 10. Implementation Completion Evidence (Issue #2425)

Requirements FR-1 through FR-10 and NFR-1 through NFR-5 are satisfied by
follow-up child issue #2425 (parent #1938 remains open):

- `src/features/finance/financeEngineChequeRegistry/financeEngineChequeRegistry.logic.ts`
  implements the `ChequeRecord` type, `validateChequeRecord`,
  `createChequeRecord`, `canTransition`, `transitionCheque`,
  `filterByStatus`, `filterByLedgerReference`, and `sumOutstandingAmount`,
  all as strict-TypeScript pure functions with no `any` types and no
  network/database/filesystem I/O.
- `src/features/finance/financeEngineChequeRegistry/financeEngineChequeRegistry.logic.test.ts`
  provides Vitest (`import { describe, expect, it } from 'vitest'`)
  coverage with real behavioral assertions for every acceptance criterion
  in §7, including invalid-transition error messages, required
  `clearedDate` enforcement on `cleared`/`bounced`, non-mutation of inputs,
  and empty-array edge cases for the query/aggregation helpers.
- No new runtime dependencies were added; no files outside the module's
  declared scope were modified; the parent issue (#1938) was not closed.
- Rollback: deleting the two `.logic.ts`/`.logic.test.ts` files fully
  reverts this implementation with no effect on any other module.

## 11. Implementation Completion Evidence (Issue #2424)

Child issue #2424 (parent #1938 remains open) delivers the shared types
module ahead of/alongside the logic layer:

- `src/features/finance/financeEngineChequeRegistry/financeEngineChequeRegistry.types.ts`
  implements `ChequeStatus`, `CHEQUE_STATUSES`, `ALLOWED_TRANSITIONS`,
  `ChequeRecord`, `CreateChequeRecordInput`, `TransitionChequeOptions`,
  `canTransition`, `isChequeStatus`, and `isChequeRecord` — all as strict
  TypeScript with no `any` types and no network/database/filesystem I/O.
- `src/features/finance/financeEngineChequeRegistry/financeEngineChequeRegistry.types.test.ts`
  provides Vitest (`import { describe, expect, it } from 'vitest'`)
  coverage with 19 real behavioral assertions covering every exported
  status value, every allowed/disallowed transition pair, and both
  positive and negative structural checks in `isChequeRecord` (missing
  fields, wrong primitive types, unknown status values).
- Validation performed: `tsc --noEmit --strict --skipLibCheck` against
  both files (clean, no errors attributable to this module) and
  `vitest run` against the test file (19/19 passed).
- No new runtime dependencies were added; no files outside the module's
  declared scope were modified; parent issue #1938 was not closed.
- Rollback: deleting `financeEngineChequeRegistry.types.ts` and
  `financeEngineChequeRegistry.types.test.ts` fully reverts issue #2424
  with no effect on any other module, since neither file is yet imported
  by any other part of the codebase.
