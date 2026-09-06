# SDD — Ejari Suite Production Release Gate

- Document type: Software Design Document (implementation handoff)
- Issue: #2490
- Parent issue: #1924 (open — pending reconciliation)
- Workstream: W55 — Ejari Suite Production Release Gate

## 1. Overview

This SDD describes the design and structure chosen to satisfy the
requirements laid out in `SRS-ISSUE-W55-EJARI-GATE-1924.md` for child issue
#2490. It is a documentation-only design: the deliverable is a small,
self-contained set of Markdown artifacts that together form the auditable
"contract" for the Ejari suite's production release gate.

## 2. Design Goals

- **G1**: Keep the child's footprint minimal and fully contained to the four
  declared files, so scope containment (SRS FR-1/FR-2, acceptance criterion
  1. is trivially verifiable by directory diff.
- **G2**: Make traceability explicit and mechanical (grep-able issue/parent/
  workstream references) rather than relying on prose alone.
- **G3**: Make rollback a pure deletion — no code, no schema, no GitHub
  state, so reverting this child carries zero blast radius.
- **G4**: Keep the parent issue's status legible everywhere it's mentioned,
  so no downstream automation or reviewer could mistake this child's
  completion for parent closure.

## 3. File/Directory Layout

```
src/features/documents/ejariSuiteProductionRelease/
├── ejariSuiteProductionRelease.contract.md   # scope, acceptance criteria, exclusions, evidence, rollback
└── README.md                                  # orientation for engineers/reviewers

plans/implementation_handoffs/
├── SRS-ISSUE-W55-EJARI-GATE-1924.md           # requirements (this workstream's child)
└── SDD-ISSUE-W55-EJARI-GATE-1924.md           # this file — design
```

Placement rationale:

- The contract and README live under
  `src/features/documents/ejariSuiteProductionRelease/` (a feature-scoped
  location mirroring how other document-suite features are organized under
  `src/features/documents/`), keeping the gate's documentation co-located
  with the feature area it governs rather than in a generic top-level docs
  folder.
- The SRS/SDD handoffs live under `plans/implementation_handoffs/`, matching
  the existing convention for cross-cutting planning artifacts that are
  consumed by orchestration tooling rather than by the application runtime.

## 4. Design Decisions

### D1 — Documentation-only deliverable, no code or tests added to `src`

**Decision**: Produce Markdown artifacts only; do not add TypeScript source
or test files for this child.
**Reasoning**: The issue's objective is explicitly to author four Markdown
files (contract, README, SRS, SDD). Introducing new TypeScript modules or
`.test.ts` files would exceed the declared file list and violate the "do not
touch files outside the list" instruction. The technical requirements around
strict TypeScript and vitest apply to code artifacts that might be produced
by _other_ children in the W55 workstream that implement actual gate
validation logic (e.g., an automated checker); this child's scope is the
requirements/design/contract record itself.

### D2 — Explicit "open, pending reconciliation" language for the parent

**Decision**: Every artifact that references issue #1924 states it is open
and pending reconciliation, never simply "the parent issue" without status.
**Reasoning**: Prevents any automated parent-closure heuristics (e.g., text
scanners looking for "closes #1924" or "fixes #1924") from misinterpreting
this child's completion as authorization to close the parent. Directly
satisfies acceptance criterion 4 ("Parent issue remains open until all child
work is reconciled") and the excluded-scope item "parent issue closure."

### D3 — Contract file carries both criteria and evidence/rollback in one place

**Decision**: Rather than splitting acceptance criteria, completion
evidence, and rollback notes into separate files, they are consolidated into
`ejariSuiteProductionRelease.contract.md`.
**Reasoning**: Keeps the four-file budget intact while still satisfying
"Completion evidence and rollback note are recorded" (acceptance criterion 3) and NFR-1 auditability (SRS → SDD → contract → README traceable without
external context) without introducing a fifth file that would violate the
declared file list.

### D4 — Mechanical traceability markers

**Decision**: Each file repeats the same three identifiers verbatim near the
top: `Issue: #2490`, `Parent issue: #1924`, `Workstream: W55 — Ejari Suite
Production Release Gate`.
**Reasoning**: Enables trivial automated or manual verification (grep for
`#2490`, `#1924`, `W55`) across all four artifacts, satisfying SRS FR-2
without requiring a human to read full prose to confirm traceability.

## 5. Validation Approach

Because this child's deliverable is documentation, "focused tests and
required validation" (acceptance criterion 2) for this child consist of:

1. **Structural presence checks**: confirming each of the four files exists
   at its exact declared path.
2. **Traceability checks**: confirming `#2490`, `#1924`, and `W55` each
   appear in every one of the four files.
3. **Exclusion-language checks**: confirming the phrases describing the
   excluded scope (parent closure, bulk GitHub mutation, destructive DB
   operations, production secret rewrites) appear in the contract file.

These checks can be run as plain file/text inspections (e.g., via a review
checklist or a lightweight script elsewhere in the workstream) without
requiring new test infrastructure inside this child's own scope. Should a
sibling child under W55 introduce an automated validator, it should be
implemented as strict TypeScript with vitest specs
(`import { describe, expect, it } from 'vitest'`) asserting on the real
file contents (e.g., reading the Markdown and asserting on required
substrings), never placeholder assertions such as `expect(true).toBe(true)`.

## 6. Risks and Mitigations

| Risk                                                        | Mitigation                                                                         |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Reviewer misreads child completion as parent closure signal | D2: explicit "open, pending reconciliation" language everywhere #1924 is mentioned |
| Scope creep into code changes                               | D1: strictly Markdown-only deliverable for this child                              |
| Orphaned/inconsistent docs if reverted                      | G3: rollback is pure file deletion, documented in the contract's Rollback Note     |

## 7. Rollback

Identical to the contract's Rollback Note: delete the four files listed in
Section 3 above. No compensating action is required since no code, schema,
or GitHub state was mutated.

## 8. Addendum — Child Issue #2489 (automated validator)

- Document type: SDD addendum (implementation handoff)
- Issue: #2489
- Parent issue: #1924 (open — pending reconciliation)
- Workstream: W55 — Ejari Suite Production Release Gate

### 8.1 Overview

Child #2489 implements the automated validator anticipated in section 5
above as strict TypeScript, satisfying SRS FR-5 through FR-8 (see the SRS
addendum, section 9).

### 8.2 File/Directory Layout (Child #2489)

```
src/features/documents/ejariSuiteProductionRelease/
├── ejariSuiteProductionRelease.logic.ts        # gate validator functions (this child)
└── ejariSuiteProductionRelease.logic.test.ts   # vitest specs with real assertions (this child)
```

This extends, rather than replaces, the layout in section 3: the contract
and README produced by #2490 remain the human-readable record; #2489 adds
the machine-checkable validator alongside them in the same feature
directory, matching the "feature-scoped location" rationale already
established for this gate.

### 8.3 Design Decisions (Child #2489)

**D5 — Pure functions over a class-based validator**
**Decision**: Expose the gate as a set of pure functions
(`checkTraceabilityMarkers`, `checkParentIssueOpenLanguage`,
`checkExclusionPhrases`, `checkEvidenceSections`,
`evaluateEjariSuiteProductionReleaseGate`) plus exported types/interfaces,
rather than a stateful class.
**Reasoning**: The validator has no internal state to manage across calls;
pure functions are simpler to unit test with vitest, are trivially
tree-shakeable, and match the SDD's design goal (G2) of making
traceability mechanical rather than relying on hidden state.

**D6 — Severity-aware parent-issue check (error vs. warning)**
**Decision**: `checkParentIssueOpenLanguage` distinguishes a hard failure
(the artifact asserts closure of #1924 — severity `error`) from a soft
failure (the artifact mentions #1924 without describing it as open —
severity `warning`), and only `error`-severity failures block the overall
gate status in `evaluateEjariSuiteProductionReleaseGate`.
**Reasoning**: Asserting closure of the parent issue directly violates the
excluded scope ("parent issue closure") and must always block the gate.
Merely mentioning the parent issue without restating "open" every time is a
much softer documentation nit that should be visible but not
release-blocking, avoiding false-positive gate failures on otherwise
compliant artifacts.

**D7 — Caller-supplied artifact content, no file I/O**
**Decision**: The validator operates purely on in-memory
`EjariDocumentArtifact` objects (`{ path, content }`) rather than reading
files from disk itself.
**Reasoning**: Keeps the module dependency-free (no `fs` usage, no new
dependencies), makes it trivially unit-testable with in-memory fixtures in
`ejariSuiteProductionRelease.logic.test.ts`, and avoids the excluded scope
of touching files outside this child's declared list at runtime.

### 8.4 Validation Approach (Child #2489)

`ejariSuiteProductionRelease.logic.test.ts` exercises:

1. `isIssueClosureAsserted` against closure-verb variants (`closes`,
   `fixes`, `resolves`), case-insensitivity, and non-matches for unrelated
   issue numbers.
2. `checkTraceabilityMarkers` for both fully-compliant and marker-missing
   artifacts.
3. `checkParentIssueOpenLanguage` across the open/closed/ambiguous/absent
   scenarios described in design decision D6.
4. `checkExclusionPhrases` and `checkEvidenceSections` across single- and
   multi-artifact sets.
5. `evaluateEjariSuiteProductionReleaseGate` end-to-end, including a
   custom-config scenario, confirming `ready`/`blocked` status and
   `failureCount` are computed correctly.

Validated locally with the repository's existing vitest installation
(`vitest run`) against this child's test file: all 22 assertions pass.

### 8.5 Completion Evidence (Child #2489)

- Added `ejariSuiteProductionRelease.logic.ts` implementing
  `EjariDocumentArtifact`, `GateCheckResult`, `GateEvaluation`,
  `EjariGateConfig`, `DEFAULT_EJARI_GATE_CONFIG`,
  `isIssueClosureAsserted`, `checkTraceabilityMarkers`,
  `checkParentIssueOpenLanguage`, `checkExclusionPhrasePresent`,
  `checkExclusionPhrases`, `checkEvidenceSections`, and
  `evaluateEjariSuiteProductionReleaseGate` — satisfying SRS FR-5 through
  FR-8 and NFR-4/NFR-6.
- Added `ejariSuiteProductionRelease.logic.test.ts` with 22 vitest cases
  covering every exported function and both `ready`/`blocked` gate
  outcomes, satisfying SRS NFR-5.
- Extended this SRS and SDD with addendum sections (9 and 8 respectively)
  documenting #2489's scope, decisions, and evidence without altering any
  pre-existing #2490 content.
- Confirmed via `tsc --noEmit --strict` that the new module type-checks
  cleanly under the repository's strict compiler settings, and via
  `vitest run` that all 22 tests in the new test file pass.

### 8.6 Rollback Note (Child #2489)

To roll back #2489 in isolation:

1. Delete `src/features/documents/ejariSuiteProductionRelease/ejariSuiteProductionRelease.logic.ts`
   and `ejariSuiteProductionRelease.logic.test.ts`.
2. Remove sections 9 (SRS) and 8 (this SDD, i.e. this section and section
   8.1–8.6) added by this addendum, restoring the prior #2490-only content.

No other files are touched by #2489, no dependencies were added, no GitHub
issues were closed, and no runtime code outside this feature directory
imports from these two files, so rollback carries no blast radius. Parent
issue #1924 remains open and is unaffected by this rollback.
