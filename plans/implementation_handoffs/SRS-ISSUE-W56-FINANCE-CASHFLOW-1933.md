# Software Requirements Specification (SRS)

- Reference: `ISSUE-W56-FINANCE-CASHFLOW-1933`
- Parent issue: #1933
- Child issue: #2451
- Related child issue: #2452 (`financeEngineRollingMonth` contract/README)
- Status: draft handoff, parent issue #1933 remains open

## 1. Purpose

This SRS formalizes the requirements for the "W56" finance cash-flow
work-stream tracked under parent issue #1933. It hands off the
rolling-month period computation requirements — already declared in
`src/features/finance/financeEngineRollingMonth/financeEngineRollingMonth.contract.md`
— into a structured requirements document suitable for downstream
design (see the companion SDD) and implementation planning, without
modifying or duplicating the authoritative functional contract itself.

## 2. Scope

### 2.1 In scope

- Documenting functional and non-functional requirements for
  rolling-month cash-flow period computation used by finance
  reporting and reconciliation.
- Cross-referencing the existing `financeEngineRollingMonth` contract
  as the single source of truth for the public API shape
  (`computeRollingMonthWindow`, `isWithinRollingMonth`,
  `RollingMonthWindow`).
- Recording completion evidence and a rollback note for this
  handoff artifact.

### 2.2 Out of scope (excluded scope)

- Parent issue (#1933) closure.
- Bulk GitHub mutation of any kind.
- Destructive database operations.
- Production secret rewrites.
- Modifying files outside:
  - `src/features/finance/financeEngineRollingMonth/`
  - `plans/implementation_handoffs/`

## 3. Stakeholders

- Finance engineering (consumers of rolling-month windows for
  cash-flow reconciliation).
- Reporting/analytics consumers of derived rolling-month boundaries.

## 4. Functional requirements

| ID   | Requirement                                                                                                                               |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| FR-1 | The system SHALL compute a rolling-month window `[start, end)` that brackets a given `now` date, anchored to a configurable day-of-month. |
| FR-2 | The system SHALL clamp the window boundary to the last day of a calendar month when the anchor day-of-month does not exist in that month. |
| FR-3 | The system SHALL expose `daySpan` as the whole number of days spanned by the computed window (28-31 inclusive).                           |
| FR-4 | The system SHALL provide a pure predicate to test whether a target date falls within a given rolling-month window.                        |
| FR-5 | The system SHALL reject invalid `Date` inputs by throwing `RangeError`, without performing any I/O or partial state mutation.             |

## 5. Non-functional requirements

| ID    | Requirement                                                                                     |
| ----- | ----------------------------------------------------------------------------------------------- |
| NFR-1 | Strict TypeScript; no `any` types anywhere in implementation or tests.                          |
| NFR-2 | All public functions must be pure and independently unit-testable without network/FS/DB access. |
| NFR-3 | Tests use `vitest` with real behavior assertions (no placeholder assertions).                   |
| NFR-4 | No new runtime dependencies introduced by this work-stream.                                     |

## 6. Acceptance criteria

- Implementation remains within the declared child scope (this
  document's Section 2.1 and the `financeEngineRollingMonth` contract).
- Focused tests (`npx vitest run src/features/finance/financeEngineRollingMonth`)
  and required validation commands (`npx tsc --noEmit`) pass.
- Completion evidence and a rollback note are recorded (see Sections 8
  and 9).
- Parent issue #1933 remains open until all child work (including
  #2451 and #2452) is reconciled.

## 7. Traceability

- FR-1 through FR-5 map directly to the `computeRollingMonthWindow`
  and `isWithinRollingMonth` contract clauses in
  `financeEngineRollingMonth.contract.md`.
- See the companion SDD
  (`SDD-ISSUE-W56-FINANCE-CASHFLOW-1933.md`) for the design mapping of
  each requirement to concrete implementation modules.

## 8. Completion evidence

- This SRS and its companion SDD constitute the recorded requirements
  and design handoff for child issue #2451.
- No source or test files were modified outside the declared scope;
  this handoff is documentation-only and additive.
- Validation commands listed in Section 6 must be run and their
  results attached to child issue #2451 at reconciliation time.

## 9. Rollback note

This document is additive: it introduces one new file at
`plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-CASHFLOW-1933.md`
and does not alter any existing source, test, configuration, or
dependency files. Rollback is a simple deletion of this file; no
migration, data, or dependency changes are involved. Reverting this
file does not affect the `financeEngineRollingMonth` contract or
README, which remain independently valid.

## 10. Addendum — child issue #2449 reconciliation

- Child issue #2449 (parent #1933) re-verified this handoff against the
  live implementation at
  `src/features/finance/financeEngineRollingMonth/financeEngineRollingMonth.logic.ts`
  and its colocated vitest suite
  `financeEngineRollingMonth.logic.test.ts`.
- Verified public surface matches this SRS's traceability (Section 7):
  `computeRollingMonthWindow`, `isWithinRollingMonth`, and the
  `RollingMonthWindow` interface (`start`, `end`, both inclusive-lower
  and exclusive-upper ISO strings).
- No source or test changes were required for #2449; the existing
  implementation and focused tests already satisfy FR-1, FR-2, FR-4,
  and FR-5. FR-3 (`daySpan`) is tracked separately under sibling issue
  #2451/#2452 and is out of scope for #2449.
- Excluded scope for #2449 (parent issue closure, bulk GitHub
  mutation, destructive database operations, production secret
  rewrites) was fully respected — this addendum is documentation-only.
- Parent issue #1933 remains open pending reconciliation of all
  sibling child issues.

## 11. Addendum — child issue #2448 (types module)

- Child issue #2448 (parent #1933) added a dedicated, implementation-free
  types module,
  `src/features/finance/financeEngineRollingMonth/financeEngineRollingMonth.types.ts`,
  plus its colocated vitest suite
  `financeEngineRollingMonth.types.test.ts`.
- The types module formalizes FR-3's `daySpan` field (previously deferred
  under sibling issues #2451/#2452) as part of the `RollingMonthWindow`
  interface, and adds pure runtime validators
  (`isValidRollingMonthAnchorDay`, `isValidIsoDateString`,
  `computeDaySpan`, `validateRollingMonthWindow`,
  `isRollingMonthWindow`) so values crossing serialization boundaries
  (e.g. persisted or transmitted windows) can be checked without
  duplicating logic already owned by
  `financeEngineRollingMonth.logic.ts`.
- This satisfies FR-3 and reinforces FR-5 (rejecting invalid input) at
  the type/validation layer; FR-1, FR-2, and FR-4 remain the
  responsibility of the logic module and are unchanged by this
  addendum.
- No files outside
  `src/features/finance/financeEngineRollingMonth/` and
  `plans/implementation_handoffs/` were touched, consistent with the
  excluded scope for #2448 (no parent closure, no bulk GitHub
  mutation, no destructive database operations, no production secret
  rewrites).
- Parent issue #1933 remains open pending reconciliation of all
  sibling child issues.
