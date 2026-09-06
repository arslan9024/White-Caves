# SDD — Ejari Suite Business Flow Documentation

- Handoff ID: SDD-ISSUE-W55-EJARI-DOCS-1922
- Child issue: #2497
- Parent issue: #1922
- Document type: Software Design Document (handoff)
- Companion document: `SRS-ISSUE-W55-EJARI-DOCS-1922.md`

## 1. Design Overview

`ejariSuiteBusinessFlow` will be implemented as a small, dependency-free TypeScript module located
at `src/features/documents/ejariSuiteBusinessFlow/`. It exposes a pure state machine over the
`EjariCase` entity plus typed error classes. This document specifies the concrete module layout,
type definitions, and algorithms for the transition guard, deferring actual file creation to the
implementation child issue(s) under parent #1922.

## 2. Module Layout (planned, for downstream implementation)

```
src/features/documents/ejariSuiteBusinessFlow/
  ejariSuiteBusinessFlow.contract.md   (this child issue — done)
  README.md                            (this child issue — done)
  types.ts                              (future child issue)
  stateMachine.ts                       (future child issue)
  errors.ts                             (future child issue)
  index.ts                              (future child issue — barrel export)
  __tests__/stateMachine.test.ts        (future child issue — vitest)
```

## 3. Type Design

```ts
export type EjariFlowStage =
  | 'draft'
  | 'documents_pending'
  | 'documents_verified'
  | 'submitted_to_ejari'
  | 'ejari_approved'
  | 'ejari_rejected'
  | 'completed'
  | 'cancelled';

export interface EjariDocumentBundle {
  readonly emiratesId: boolean;
  readonly passport: boolean;
  readonly titleDeed: boolean;
  readonly tenancyContractDraft: boolean;
}

export interface EjariFlowTransition {
  readonly fromStage: EjariFlowStage;
  readonly toStage: EjariFlowStage;
  readonly actor: string;
  readonly timestamp: string; // ISO-8601
}

export interface EjariCase {
  readonly id: string;
  readonly stage: EjariFlowStage;
  readonly bundle: EjariDocumentBundle;
  readonly history: ReadonlyArray<EjariFlowTransition>;
}
```

## 4. Error Design

```ts
export class InvalidEjariTransitionError extends Error {
  constructor(from: EjariFlowStage, to: EjariFlowStage) {
    super(`Invalid Ejari transition from "${from}" to "${to}"`);
    this.name = 'InvalidEjariTransitionError';
  }
}

export class IncompleteEjariBundleError extends Error {
  constructor(missing: ReadonlyArray<string>) {
    super(`Cannot verify documents; missing: ${missing.join(', ')}`);
    this.name = 'IncompleteEjariBundleError';
  }
}

export class TerminalEjariCaseError extends Error {
  constructor(stage: EjariFlowStage) {
    super(`Case is already in terminal stage "${stage}"`);
    this.name = 'TerminalEjariCaseError';
  }
}
```

All three error classes extend the built-in `Error` and are explicitly typed (no `any`), satisfying
NFR-1 from the SRS.

## 5. Transition Table (design source of truth)

| From                 | Valid To                                        |
| -------------------- | ----------------------------------------------- |
| `draft`              | `documents_pending`, `cancelled`                |
| `documents_pending`  | `documents_verified`, `cancelled`               |
| `documents_verified` | `submitted_to_ejari`, `cancelled`               |
| `submitted_to_ejari` | `ejari_approved`, `ejari_rejected`, `cancelled` |
| `ejari_approved`     | `completed`, `cancelled`                        |
| `ejari_rejected`     | `documents_pending`, `cancelled`                |
| `completed`          | _(none — terminal)_                             |
| `cancelled`          | _(none — terminal)_                             |

`canTransition(from, to)` is designed as a pure lookup against this table (e.g., a
`Record<EjariFlowStage, ReadonlySet<EjariFlowStage>>`), giving O(1) lookup and making the table the
single source of truth referenced by both design and tests.

## 6. Algorithm: `transitionEjariCase`

```
function transitionEjariCase(current, nextStage, actor):
  if isTerminalStage(current.stage):
    throw TerminalEjariCaseError(current.stage)
  if not canTransition(current.stage, nextStage):
    throw InvalidEjariTransitionError(current.stage, nextStage)
  if nextStage == 'documents_verified':
    missing = documents missing from current.bundle
    if missing is not empty:
      throw IncompleteEjariBundleError(missing)
  newTransition = { fromStage: current.stage, toStage: nextStage, actor, timestamp: now() }
  return {
    ...current,
    stage: nextStage,
    history: [...current.history, newTransition],
  }
```

This algorithm is pure: it returns a new `EjariCase` object and never mutates `current` or
`current.history`, satisfying NFR-2.

## 7. Testing Strategy (for future implementation child issue)

Focused vitest suites (real behavioral assertions, no placeholders) SHALL cover:

1. `createEjariCase` always starts at `draft` regardless of bundle completeness.
2. Each valid transition in the table above succeeds and appends exactly one history entry.
3. Each invalid transition (e.g., `draft` -> `completed`) throws `InvalidEjariTransitionError`.
4. Transitioning to `documents_verified` with an incomplete bundle throws
   `IncompleteEjariBundleError`, and the thrown error message lists the missing documents.
5. Attempting any transition from `completed` or `cancelled` throws `TerminalEjariCaseError`.
6. `ejari_rejected` -> retry lands on `documents_pending`, never `draft`.
7. `isTerminalStage` returns `true` only for `completed` and `cancelled`.

Validation commands expected for the implementation child issue: `vitest run` (targeted to the new
test file) and `tsc --noEmit` (or the project's strict type-check script) to confirm no `any`
usage and full strict-mode compliance.

## 8. Rollback Note

This handoff introduces documentation artifacts only; there is no runtime code to roll back. If
reverted, delete the four files listed in this child issue's scope
(`ejariSuiteBusinessFlow.contract.md`, `README.md`, this SDD, and the paired SRS) — no other files
are touched and no state, schema, or dependency changes are made.

## 9. Reconciliation

This SDD, together with its SRS pair, satisfies the documentation deliverable for child issue
#2497. Parent issue #1922 remains open until all sibling child issues (covering `types.ts`,
`stateMachine.ts`, `errors.ts`, `index.ts`, and their vitest suites) are completed and reconciled.

## 10. Reconciliation Update — Child Issue #2496 (Implementation)

Child issue #2496 delivered the implementation described in Sections 3–6 above. **Design
decision:** rather than the four-file split originally sketched in Section 2
(`types.ts` / `stateMachine.ts` / `errors.ts` / `index.ts`), the implementation consolidates all
types, error classes, and the transition state machine into a single module,
`src/features/documents/ejariSuiteBusinessFlow/ejariSuiteBusinessFlow.logic.ts`, with its focused
vitest suite in `ejariSuiteBusinessFlow.logic.test.ts`. This keeps the cohesive, dependency-free
core in one place for a module of this size while preserving every exported symbol named in
Sections 3 and 4 (`EjariFlowStage`, `EjariDocumentBundle`, `EjariFlowTransition`, `EjariCase`,
`InvalidEjariTransitionError`, `IncompleteEjariBundleError`, `TerminalEjariCaseError`,
`createEjariCase`, `transitionEjariCase`, `canTransition`, `isTerminalStage`), plus the additional
helper `getMissingDocuments` used internally by the bundle-completeness check. No existing export
was removed or renamed. Should downstream child issues need adapters (persistence, notifications,
GitHub sync per SRS Section 2.2), they MAY split this module further without breaking the public
contract, since all exports are named (not default) exports.

Validation evidence for #2496: `vitest run` on
`ejariSuiteBusinessFlow.logic.test.ts` — 28/28 tests passed, covering every scenario listed in
Section 7 (creation always at `draft`, every valid transition table row, illegal-transition
rejection, incomplete-bundle rejection with missing-document listing, terminal-stage rejection for
both `completed` and `cancelled`, `ejari_rejected` retry routing to `documents_pending`, and
`isTerminalStage` coverage). A scoped `tsc --noEmit --strict` type-check of both new files passed
with zero errors and no `any` usage, satisfying NFR-1.

**Rollback note (#2496):** this update adds only two new source files
(`ejariSuiteBusinessFlow.logic.ts`, `ejariSuiteBusinessFlow.logic.test.ts`) plus this
reconciliation section and the paired SRS update. To roll back, delete the two new source files
and revert this section and the SRS's matching update — no other files, schemas, or dependencies
are touched. Parent issue #1922 remains open pending reconciliation of any remaining sibling child
issues (adapters, persistence, notifications, GitHub sync).
