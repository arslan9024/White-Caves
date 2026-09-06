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
