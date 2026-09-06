# SRS — Finance Engine Intercompany Transfer

- **Doc ID**: SRS-ISSUE-W56-FINANCE-TRANSFER-1936
- **Issue**: #2434
- **Parent issue**: #1936
- **Related module**: `src/features/finance/financeEngineIntercompanyTransfer/`
- **Status**: Approved for design handoff

## 1. Purpose

This Software Requirements Specification defines the functional and
non-functional requirements for the intercompany transfer capability of the
White Caves finance engine. It is the requirements baseline that the
corresponding SDD (`SDD-ISSUE-W56-FINANCE-TRANSFER-1936.md`) and the module
contract (`financeEngineIntercompanyTransfer.contract.md`) must satisfy.

## 2. Background

White Caves manages properties across multiple related legal entities
(management company, property-owning SPVs, brokerage arm). Revenue and cost
allocations frequently need to move recognized value between these entities
internally — e.g. a management fee recognized on the SPV's books settling
against the management company's books — without triggering an external bank
transfer. Today this reconciliation is manual and error-prone. This
capability formalizes it as a first-class, auditable ledger operation.

## 3. Stakeholders

| Role                         | Interest                                           |
| ---------------------------- | -------------------------------------------------- |
| Finance operations           | Accurate, auditable intercompany settlement        |
| Engineering (finance domain) | Implementable, testable contract                   |
| Compliance/Audit             | Append-only trail, no destructive operations       |
| Product/Ownership            | Parent issue #1936 delivered incrementally, safely |

## 4. Functional Requirements

- **FR-1**: The system SHALL accept an intercompany transfer request
  containing source entity, target entity, amount (integer minor units),
  currency, memo, and an idempotency key (`requestId`).
- **FR-2**: The system SHALL reject a transfer where `sourceEntityId` equals
  `targetEntityId`.
- **FR-3**: The system SHALL reject a transfer with a non-positive or
  non-integer amount.
- **FR-4**: The system SHALL reject a transfer where source and target
  currencies do not match (cross-currency FX is out of scope for this
  capability).
- **FR-5**: The system SHALL reject a transfer referencing an unknown
  entity.
- **FR-6**: On successful validation, the system SHALL post two balanced,
  append-only ledger entries (a debit on the source entity and a credit on
  the target entity) atomically.
- **FR-7**: The system SHALL support idempotent replay: resubmitting the same
  `requestId` with an identical payload SHALL return the original result
  without creating duplicate ledger entries; resubmitting with a different
  payload under the same `requestId` SHALL be rejected as a duplicate-request
  conflict.
- **FR-8**: The system SHALL support reversing a posted transfer via
  compensating ledger entries, never by mutating or deleting the original
  entries.
- **FR-9**: The system SHALL expose the current status of a transfer
  (`PENDING`, `VALIDATED`, `POSTED`, `REJECTED`, `REVERSED`) queryable by
  `requestId`.
- **FR-10**: The system SHALL optionally enforce a source-entity balance
  check and reject transfers that would overdraw the source entity when this
  check is enabled.

## 5. Non-Functional Requirements

- **NFR-1 (Type safety)**: All implementation code SHALL be strict
  TypeScript with no `any` types.
- **NFR-2 (Auditability)**: Ledger entries are append-only; no update or
  delete operations are permitted against posted entries.
- **NFR-3 (Atomicity)**: Posting the debit/credit pair SHALL be atomic — both
  succeed or both fail.
- **NFR-4 (Determinism)**: Domain logic SHALL be deterministic and
  side-effect-isolated so it can be unit tested without a live database.
- **NFR-5 (Testability)**: All test suites SHALL use vitest
  (`import { describe, expect, it } from 'vitest'`) with assertions against
  real computed behavior (state transitions, ledger entry shape, error
  codes), never placeholder assertions (e.g. `expect(true).toBe(true)`).
- **NFR-6 (Safety)**: No requirement in this document authorizes destructive
  database operations, bulk GitHub mutations, or production secret changes.

## 6. Constraints & Exclusions

- This issue (#2434) does not implement runtime code; it establishes the
  requirements and design baseline plus the module contract.
- Parent issue #1936 SHALL remain open until all of its child issues,
  including this one, are reconciled — this SRS does not authorize closing
  the parent issue.
- Cross-border/external payment execution is explicitly out of scope.

## 7. Acceptance Criteria (traced to issue #2434)

- [x] Implementation remains within the declared child scope (documentation
      set listed in this issue only).
- [ ] Focused tests and required validation commands pass — applies once a
      future child issue introduces implementation and tests against this
      SRS/contract; tracked, not closed here.
- [x] Completion evidence and rollback note are recorded (see Section 8).
- [x] Parent issue (#1936) remains open until all child work is reconciled.

## 8. Completion Evidence

- Deliverables produced under issue #2434:
  1. `src/features/finance/financeEngineIntercompanyTransfer/financeEngineIntercompanyTransfer.contract.md`
  2. `src/features/finance/financeEngineIntercompanyTransfer/README.md`
  3. `plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-TRANSFER-1936.md` (this file)
  4. `plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-TRANSFER-1936.md`
- No source, test, configuration, or CI file was modified.
- No GitHub issue was closed or bulk-mutated as part of this work.

## 9. Rollback Note

All changes introduced by issue #2434 are additive documentation files with
no code or configuration dependents. To roll back, delete the four files
listed in Section 8. No data migration, secret, or GitHub state changes are
involved, so rollback carries no destructive risk and requires no additional
coordination beyond a standard revert of the commit(s) that added them.
