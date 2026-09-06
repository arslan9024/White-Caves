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

## 10. Completion Evidence — Implementation (Issue #2471)

- Implemented `src/features/finance/financeEngineUaeFta/financeEngineUaeFta.logic.ts`,
  fulfilling FR-1 through FR-8: `calculateLineItemVat`, `summarizeVat`,
  `isValidUaeTrn`, `assertValidUaeTrn`, `getVatRateForCategory`, and the
  `InvalidTrnError` typed error class, plus the `VatRateCategory`,
  `VatLineItem`, `VatLineItemResult`, and `VatSummary` types from the SDD
  data model.
- Implemented `src/features/finance/financeEngineUaeFta/financeEngineUaeFta.logic.test.ts`,
  a vitest suite (`import { describe, expect, it } from 'vitest'`) covering
  standard/zero-rated/exempt/out-of-scope categories, round-half-up
  boundary cases, positive and negative (reclaimable) `netVatPayable`
  summaries, TRN validation edge cases (empty, 14-digit, 16-digit,
  alphanumeric, valid 15-digit), `InvalidTrnError` message/`instanceof`
  behavior, and `RangeError` on invalid `netAmount` — satisfying NFR-4.
- All functions are pure (no I/O, no mutation of inputs, no module-level
  mutable state), satisfying NFR-1/NFR-2/NFR-3 (strict TypeScript, no
  `any`).
- Verified via a standalone strict-mode `tsc --noEmit` pass against the
  new file and a behavioral sanity run exercising every exported function
  against the exact scenarios in the vitest suite; all assertions passed.
- No files outside the declared child scope were modified. Parent issue
  #1927 was not closed or otherwise mutated.

## 11. Rollback Note — Implementation (Issue #2471)

The implementation adds two new, self-contained files under
`src/features/finance/financeEngineUaeFta/`
(`financeEngineUaeFta.logic.ts` and `financeEngineUaeFta.logic.test.ts`).
Neither file is imported by any other module in the repository yet (no
consumer wiring was added). To roll back, delete both files; no build,
lint, or runtime configuration references them, so no other change is
required.

## 12. Completion Evidence — Shared Types Module (Issue #2470)

- Implemented `src/features/finance/financeEngineUaeFta/financeEngineUaeFta.types.ts`,
  a types-only companion module extracting the SDD section 4 data model
  (`VatRateCategory`, `VatLineItem`, `VatLineItemResult`, `VatSummary`)
  into a single, shared, authoritative location, plus the runtime pieces
  required for real (non-placeholder) test assertions against a types-only
  module: the `VAT_RATE_CATEGORIES` const array, the `isVatRateCategory`
  type guard, the `STANDARD_VAT_RATE` / `ZERO_VAT_RATE` /
  `VAT_ROUNDING_DECIMAL_PLACES` constants, the `UAE_TRN_LENGTH` /
  `UAE_TRN_PATTERN` constants (FR-6), and the `InvalidTrnError` class
  (FR-7, SDD section 5).
- Implemented `src/features/finance/financeEngineUaeFta/financeEngineUaeFta.types.test.ts`,
  a vitest suite (`import { describe, expect, it } from 'vitest'`)
  exercising 26 real-behavior assertions: category membership/order/
  uniqueness of `VAT_RATE_CATEGORIES`, positive/negative/type-narrowing
  cases for `isVatRateCategory`, the standard/zero VAT rate and rounding
  constants, TRN pattern matching for valid, too-short, too-long,
  alphanumeric, and empty TRNs, `InvalidTrnError`'s `instanceof`
  relationship, `trn` property, message content, and `name`, and
  construction of well-formed `VatLineItem`/`VatLineItemResult`/
  `VatSummary` object literals to confirm the interfaces compile and
  compose as designed.
- Verified via `npx vitest run` against the new test file (26/26 tests
  passed) and a strict-mode (`--strict`, no `any`) `tsc --noEmit` pass
  against both new files (zero errors).
- This module does not yet replace the type declarations duplicated
  inline in `financeEngineUaeFta.logic.ts` from issue #2471; wiring
  `financeEngineUaeFta.logic.ts` to import from this shared module is
  left to a follow-on child issue so this issue's change stays within its
  declared scope (types module only, no edits to sibling files).
- No files outside the declared child scope were modified. Parent issue
  #1927 was not closed or otherwise mutated.

## 13. Rollback Note — Shared Types Module (Issue #2470)

This change adds two new, self-contained files:
`src/features/finance/financeEngineUaeFta/financeEngineUaeFta.types.ts`
and `src/features/finance/financeEngineUaeFta/financeEngineUaeFta.types.test.ts`.
Neither file is imported by any other module yet, so deleting both fully
reverts this change with no further cleanup required elsewhere in the
repository.
