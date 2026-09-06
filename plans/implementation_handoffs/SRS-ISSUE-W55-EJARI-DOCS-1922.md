# SRS — Ejari Suite Business Flow Documentation

- Handoff ID: SRS-ISSUE-W55-EJARI-DOCS-1922
- Child issue: #2497
- Parent issue: #1922
- Document type: Software Requirements Specification (handoff)

## 1. Introduction

### 1.1 Purpose

This SRS captures the requirements for the `ejariSuiteBusinessFlow` module within the Documents
feature area. It is produced as a documentation-only deliverable for child issue #2497 and serves
as the requirements baseline for subsequent implementation child issues under parent epic #1922.

### 1.2 Scope

The `ejariSuiteBusinessFlow` module manages the business-flow state machine for Ejari tenancy
contract registration cases: creation, document verification, submission, approval/rejection,
completion, and cancellation. This SRS covers functional and non-functional requirements for that
state machine and its public contract. It does NOT cover UI components, API route handlers, or
persistence adapters — those are separate child issues.

### 1.3 Out of Scope / Excluded

- Parent issue closure (#1922 remains open until all children are reconciled)
- Bulk GitHub mutations
- Destructive database operations
- Production secret rewrites
- Files outside this handoff's declared artifact set

## 2. Overall Description

### 2.1 Product Perspective

`ejariSuiteBusinessFlow` is a sub-feature of the larger Documents domain in the White Caves
platform. It sits alongside other document-lifecycle flows (e.g., title deed verification, POA
document flows) and shares document intake/verification primitives but owns its own state machine.

### 2.2 User Classes

- **Case processors** (internal ops staff) who advance an `EjariCase` through its stages.
- **System integrators** (developers) who consume the public contract to build adapters
  (persistence, notifications, GitHub sync) around the pure state-machine core.

### 2.3 Assumptions and Dependencies

- Document upload/storage primitives already exist in the shared Documents feature area and are
  reused, not duplicated.
- Downstream child issues will supply the concrete TypeScript implementation, adapters, and
  vitest test suites conforming to this SRS and the accompanying SDD.

## 3. Functional Requirements

| ID   | Requirement                                                                                                                                                                                                     |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-1 | The system SHALL model an `EjariCase` with a current `EjariFlowStage` and an append-only transition `history`.                                                                                                  |
| FR-2 | The system SHALL expose `createEjariCase(bundle)` that always initializes a new case at stage `draft`.                                                                                                          |
| FR-3 | The system SHALL expose `transitionEjariCase(current, nextStage, actor)` that validates the transition via `canTransition` before mutating state, and returns a new case object rather than mutating the input. |
| FR-4 | The system SHALL expose `canTransition(from, to)` returning a boolean per the state diagram in the contract document.                                                                                           |
| FR-5 | The system SHALL expose `isTerminalStage(stage)` returning `true` only for `'completed'` and `'cancelled'`.                                                                                                     |
| FR-6 | The system SHALL throw a typed `InvalidEjariTransitionError` when an illegal transition is requested.                                                                                                           |
| FR-7 | The system SHALL throw a typed `IncompleteEjariBundleError` when transitioning to `documents_verified` with a bundle missing required documents.                                                                |
| FR-8 | The system SHALL throw a typed `TerminalEjariCaseError` when a transition is requested from a case already in a terminal stage.                                                                                 |
| FR-9 | The system SHALL route `ejari_rejected` retries back to `documents_pending`, never to `draft`.                                                                                                                  |

## 4. Non-Functional Requirements

| ID    | Requirement                                                                                                                             |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------- |
| NFR-1 | All implementation code SHALL be strict TypeScript with no `any` types.                                                                 |
| NFR-2 | State-transition functions SHALL be pure (no mutation of arguments, no hidden I/O).                                                     |
| NFR-3 | The module SHALL NOT perform network calls, GitHub API calls, or database writes directly.                                              |
| NFR-4 | All behavior SHALL be covered by focused vitest tests using real behavioral assertions (no placeholder assertions).                     |
| NFR-5 | Public API surface SHALL remain backward compatible across child issues; existing exports MUST be preserved and extended, not replaced. |

## 5. Acceptance Criteria (traced from parent issue #1922 child contract)

1. Implementation remains within the declared child scope for each child issue.
2. Focused tests and required validation commands (vitest, `tsc --noEmit`) pass before a child
   issue is considered complete.
3. Completion evidence (test output, file diffs) and a rollback note are recorded in each child
   issue's handoff.
4. Parent issue #1922 remains open until all child issues are reconciled.

## 6. Traceability

This SRS traces to the contract defined in
`src/features/documents/ejariSuiteBusinessFlow/ejariSuiteBusinessFlow.contract.md` and is paired
with `SDD-ISSUE-W55-EJARI-DOCS-1922.md` for design-level detail.
