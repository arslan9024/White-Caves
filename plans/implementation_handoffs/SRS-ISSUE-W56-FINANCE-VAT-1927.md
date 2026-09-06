# SRS — Finance Engine: UAE FTA VAT

**Document ID:** SRS-ISSUE-W56-FINANCE-VAT-1927
**Issue:** #2472 (child) · Parent: #1927
**Status:** Draft, handed off for implementation
**Owner work stream:** `W56-FINANCE-VAT`

## 1. Purpose

This Software Requirements Specification defines the requirements for a UAE
Federal Tax Authority (FTA)-compliant VAT calculation engine to be added to
the White Caves finance feature area at
`src/features/finance/financeEngineUaeFta/`.

## 2. Background

White Caves currently has no dedicated VAT calculation module for UAE
transactions. Invoicing, credit notes, and financial reporting features need
a single, auditable source of VAT arithmetic that matches FTA rules so that
downstream invoice generation and tax reporting features can rely on
consistent, testable behavior rather than duplicating VAT math ad hoc.

## 3. Stakeholders

- Finance/accounting feature owners (consumers of VAT summaries).
- Invoice generation feature (consumer of per-line VAT calculation and TRN
  validation).
- Compliance/audit reviewers (require deterministic, reproducible output).

## 4. Functional Requirements

| ID   | Requirement                                                                                                                                                                                                            |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-1 | The system SHALL compute VAT for a single line item given its net amount and VAT category (`standard`, `zeroRated`, `exempt`, `outOfScope`).                                                                           |
| FR-2 | The system SHALL apply a 5% VAT rate to `standard` category line items and 0% to all other categories.                                                                                                                 |
| FR-3 | The system SHALL round VAT amounts to 2 decimal places using round-half-up, applied per line item.                                                                                                                     |
| FR-4 | The system SHALL compute a gross amount (net + VAT) per line item.                                                                                                                                                     |
| FR-5 | The system SHALL produce a VAT period summary given a set of output (sales) line items and input (purchase) line items, returning output VAT total, input VAT total, and net VAT payable (or reclaimable if negative). |
| FR-6 | The system SHALL validate that a UAE Tax Registration Number (TRN) is exactly 15 numeric digits before it is considered valid.                                                                                         |
| FR-7 | The system SHALL raise a distinguishable, typed error (`InvalidTrnError`) when an invalid TRN is used in a context requiring validation, distinct from generic runtime errors.                                         |
| FR-8 | The system SHALL reject negative or non-finite net amounts in line item calculations by throwing a `RangeError`.                                                                                                       |

## 5. Non-Functional Requirements

| ID    | Requirement                                                                                                                                                                                                                              |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NFR-1 | All calculation functions SHALL be pure (no I/O, no network, no filesystem, no mutation of inputs).                                                                                                                                      |
| NFR-2 | All calculation functions SHALL be deterministic: identical inputs SHALL always produce identical outputs, to support FTA audit trails.                                                                                                  |
| NFR-3 | The implementation SHALL be strict TypeScript with no `any` types.                                                                                                                                                                       |
| NFR-4 | The implementation SHALL be covered by a vitest suite exercising standard, zero-rated, exempt VAT categories, net VAT payable/reclaimable summary cases, and TRN validation edge cases (empty, too short, too long, non-numeric, valid). |

## 6. Out of Scope

- FTA e-Services portal filing/submission.
- Tax jurisdictions other than the UAE.
- Database persistence of VAT records (handled by a separate persistence
  service, not this module).
- Closing the parent issue (#1927), bulk GitHub mutations, destructive
  database operations, and production secret rewrites — these are
  explicitly excluded from this and sibling child issues in the
  `W56-FINANCE-VAT` work stream.

## 7. Acceptance Criteria

- Implementation stays within the declared child scope (VAT calculation
  module only; no persistence, no filing integration).
- Focused vitest tests for `financeEngineUaeFta` and any required project
  validation commands (typecheck/lint/test) pass.
- Completion evidence (what was built/changed) and a rollback note are
  recorded in the corresponding handoff documents.
- Parent issue #1927 remains open until all child issues in the
  `W56-FINANCE-VAT` work stream are reconciled.

## 8. Traceability

This SRS is realized by the design in
`plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-VAT-1927.md` and the
behavioral contract in
`src/features/finance/financeEngineUaeFta/financeEngineUaeFta.contract.md`.

## 9. Rollback Note

This document is additive (new file, no references from build tooling or
source code). To roll back, delete this file; no other artifact depends on
its presence for compilation or runtime behavior.

## 10. Completion Evidence (implementation issue, #2471)

- Implemented `src/features/finance/financeEngineUaeFta/financeEngineUaeFta.logic.ts`,
  satisfying FR-1 through FR-8 and NFR-1 through NFR-4 against the
  behavioral contract in `financeEngineUaeFta.contract.md`.
- Implemented the companion vitest suite
  `src/features/finance/financeEngineUaeFta/financeEngineUaeFta.logic.test.ts`,
  covering standard/zero-rated/exempt/out-of-scope VAT categories, a
  round-half-up rounding boundary case, `summarizeVat` payable and
  reclaimable cases, TRN validation edge cases (empty, too short, too
  long, non-numeric, valid), and `RangeError`/`InvalidTrnError` error
  paths.
- Verified behavior manually via a standalone `tsx` script exercising the
  exported functions (boundary rounding, summary totals, TRN validation,
  and both error paths) with correct results, since the sandboxed staging
  location falls outside the repository's configured vitest `include`
  globs; no `src/`-tree files were modified to perform this check.
- Parent issue #1927 was not modified or closed; no GitHub mutations were
  performed.
