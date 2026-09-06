# SRS — Ejari Suite Production Release Gate

- Document type: Software Requirements Specification (implementation handoff)
- Issue: #2490
- Parent issue: #1924 (open — pending reconciliation)
- Workstream: W55 — Ejari Suite Production Release Gate

## 1. Purpose

Define the functional and non-functional requirements that must be satisfied
before the Ejari document suite (Ejari contract generation, RERA/Ejari
registration document packaging, and associated document lifecycle features)
is declared production-ready under the W55 release gate.

This SRS is a documentation/handoff artifact only. It does not itself
implement code changes; it records the requirements that downstream child
issues under W55 must satisfy, and that this specific child (#2490) uses to
scope its own documentation deliverables.

## 2. Scope

### 2.1 In Scope

- Requirements for verifying the Ejari document suite's correctness,
  auditability, and rollback safety prior to production release.
- Requirements for the documentation artifacts this child (#2490) produces:
  the contract file, README, this SRS, and the companion SDD.
- Requirements for how completion evidence and rollback notes must be
  recorded for every child issue under the W55 workstream.

### 2.2 Out of Scope

- Closing the parent issue #1924.
- Bulk GitHub mutations (label/milestone/batch edits across issues or PRs).
- Destructive database operations (migrations, deletions, truncations).
- Rewriting or rotating production secrets/credentials.
- Any change to files outside this child's declared file list.

## 3. Stakeholders

| Role                       | Interest                                                              |
| -------------------------- | --------------------------------------------------------------------- |
| Release engineering        | Confirms the Ejari suite meets the gate before enabling in production |
| Compliance/legal reviewers | Confirms generated Ejari/RERA documents remain accurate and auditable |
| Parent issue owner (#1924) | Tracks reconciliation status across all W55 children                  |

## 4. Functional Requirements

**FR-1 — Documentation completeness**
The Ejari release gate MUST have a written contract describing scope,
acceptance criteria, and exclusions before any child issue can be marked
complete. Verified by the presence and structure of
`ejariSuiteProductionRelease.contract.md`.

**FR-2 — Traceability**
Every artifact produced under this child MUST reference: (a) its own issue
number (#2490), (b) the parent issue (#1924), and (c) the workstream ID
(W55). Verified by grep/text-presence checks in each of the four files.

**FR-3 — Evidence and rollback**
Each child issue's documentation MUST record completion evidence (what was
delivered, mapped to acceptance criteria) and a rollback note (how to safely
undo the change). Verified by the presence of "Completion Evidence" and
"Rollback Note" sections in the contract.

**FR-4 — Parent non-closure**
No child issue's artifacts may state or imply that the parent issue #1924 is
closed or should be closed as a side effect of the child's completion.
Verified by textual assertions that #1924 is described as "open" in every
artifact that references it.

## 5. Non-Functional Requirements

**NFR-1 — Auditability**: All requirements and design decisions must be
traceable from SRS → SDD → contract → README without external context.

**NFR-2 — Reversibility**: All artifacts produced by this child must be
safely deletable without impacting runtime behavior (documentation-only,
no code imports).

**NFR-3 — Type safety (for any accompanying test/tooling code)**: If
TypeScript test files are introduced elsewhere in the workstream to validate
this gate's structural requirements, they must use strict TypeScript with no
`any` types and use `vitest` (`import { describe, expect, it } from 'vitest'`)
with real behavioral assertions.

## 6. Acceptance Criteria (Gate Conditions)

1. Implementation stays within the declared child scope (four files only).
2. Focused validation (any test/lint scoped to these artifacts) passes.
3. Completion evidence and a rollback note are recorded in the contract.
4. Parent issue #1924 remains open until all W55 children are reconciled.

## 7. Excluded Scope (Restated)

- Parent issue closure.
- Bulk GitHub mutation.
- Destructive database operations.
- Production secret rewrites.

## 8. Traceability to Design

See `SDD-ISSUE-W55-EJARI-GATE-1924.md` for how these requirements are
satisfied by the documentation structure and directory layout chosen for
this child.

## 9. Addendum — Child Issue #2489 (automated validator)

- Document type: SRS addendum (implementation handoff)
- Issue: #2489
- Parent issue: #1924 (open — pending reconciliation)
- Workstream: W55 — Ejari Suite Production Release Gate

### 9.1 Purpose

Child #2489 is the sibling of #2490 anticipated by SDD section 5
("Validation Approach"): it implements the automated structural/
traceability validator for the Ejari Suite Production Release Gate as
strict TypeScript, satisfying NFR-3 of this SRS.

### 9.2 Additional Functional Requirements

**FR-5 — Automated traceability validation**
The gate MUST provide a pure, side-effect-free TypeScript function that,
given a set of artifact contents, verifies each artifact contains the
required traceability markers (`#2489`, `#1924`, `W55`). Implemented by
`checkTraceabilityMarkers` in
`src/features/documents/ejariSuiteProductionRelease/ejariSuiteProductionRelease.logic.ts`.

**FR-6 — Automated parent-non-closure validation**
The gate MUST provide a function that detects whether any artifact asserts
closure of the parent issue (e.g. "closes #1924", "fixes #1924") and flags
this as a blocking error, distinct from a lower-severity warning when the
parent issue is merely mentioned without being described as open.
Implemented by `checkParentIssueOpenLanguage` and `isIssueClosureAsserted`.

**FR-7 — Automated exclusion/evidence validation**
The gate MUST provide functions that verify required exclusion phrases
(parent issue closure, bulk GitHub mutation, destructive database
operations, production secret rewrites) and required evidence sections
(Completion Evidence, Rollback Note) are present across the artifact set.
Implemented by `checkExclusionPhrases` and `checkEvidenceSections`.

**FR-8 — Aggregate gate evaluation**
The gate MUST expose a single entry point,
`evaluateEjariSuiteProductionReleaseGate`, that runs all of the above checks
and returns an overall `ready`/`blocked` status plus the full list of
individual check results, so downstream tooling can render a single
pass/fail decision.

### 9.3 Non-Functional Requirements (Child #2489)

- **NFR-4 — Strict typing**: `ejariSuiteProductionRelease.logic.ts` uses
  strict TypeScript with no `any` types.
- **NFR-5 — Test coverage with real assertions**: `ejariSuiteProductionRelease.logic.test.ts`
  uses `vitest` (`import { describe, expect, it } from 'vitest'`) and
  asserts on real behavior (regex/string matching outcomes), never
  placeholder assertions.
- **NFR-6 — No side effects**: the validator module performs no file I/O,
  network calls, or GitHub mutations; callers supply artifact text.

### 9.4 Acceptance Criteria (Child #2489)

1. Implementation stays within #2489's declared file list (the logic module,
   its test file, and this SRS/SDD addendum).
2. `ejariSuiteProductionRelease.logic.test.ts` passes when run with vitest.
3. Completion evidence and a rollback note for #2489 are recorded (see the
   SDD addendum, section 8).
4. No artifact produced by #2489 asserts or implies closure of parent issue
   #1924, which remains open pending reconciliation of all W55 children.
