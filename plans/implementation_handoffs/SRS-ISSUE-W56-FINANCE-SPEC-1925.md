# SRS — Issue W56 Finance Spec (Parent #1925 / Child #2483)

**Document type:** Software Requirements Specification (handoff artifact)
**Work stream ID:** W56-FINANCE-SPEC
**Parent issue:** #1925
**Child issue covered by this handoff:** #2483 — Finance Engine Architecture Double

## 1. Purpose

This SRS captures the requirements for the Finance Engine Architecture Double, a scoped child
deliverable of parent issue #1925 (Finance Engine architecture). It exists so that consuming
features can be developed and tested against a stable, documented contract before the full finance
engine implementation lands, and so the parent issue's reconciliation checklist has a concrete,
traceable requirements record for this child scope.

## 2. Scope

### 2.1 In scope

- Requirements for a deterministic, in-memory finance engine test double.
- Requirements for the double's public contract (construction, transaction recording, balance
  queries, ledger queries, reset).
- Requirements for the error-reporting contract used by the double.

### 2.2 Out of scope (explicitly excluded)

- Closure of parent issue #1925.
- Bulk GitHub mutations across issues (labels, milestones, cross-linking).
- Destructive database operations of any kind.
- Production secret rewrites/rotation.
- Implementation of the production (non-double) finance engine, FX rate integration, or tax
  computation — tracked under other children of #1925.

## 3. Stakeholders

- Consumers: feature teams building Redux slices, API routes, and React components against the
  finance domain who need a reliable test fixture ahead of the real engine's availability.
- Parent issue owner (#1925): reconciles this child's completion against the overall finance
  engine architecture plan.

## 4. Functional Requirements

| ID   | Requirement                                                                                                                                          | Priority |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| FR-1 | The double MUST be constructible via a factory function accepting an optional seed.                                                                  | Must     |
| FR-2 | Given identical seeds, the double MUST produce identical computed outputs across invocations and process restarts.                                   | Must     |
| FR-3 | The double MUST expose a method to record a transaction that validates the input amount is a finite number.                                          | Must     |
| FR-4 | The double MUST reject non-finite (`NaN`/`Infinity`) transaction amounts by throwing a typed validation error, never a bare `Error` or string throw. | Must     |
| FR-5 | The double MUST expose a method returning the current running balance, computed as the sum of all recorded transaction amounts.                      | Must     |
| FR-6 | The double MUST expose a method returning the full ledger of recorded transactions in insertion order, as a read-only/defensive-copy structure.      | Must     |
| FR-7 | The double MUST expose a `reset()` method restoring it to its just-constructed state (empty ledger, zero balance, id counter reset).                 | Must     |
| FR-8 | The double MUST NOT perform network or database I/O of any kind.                                                                                     | Must     |
| FR-9 | Errors thrown by the double MUST carry a stable, string-typed `code` field enabling assertions without string-matching messages.                     | Must     |

## 5. Non-Functional Requirements

| ID    | Requirement                                                                                                                                             |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NFR-1 | All implementation MUST use strict TypeScript with no `any` types.                                                                                      |
| NFR-2 | All automated tests for this scope MUST use vitest (`describe`/`expect`/`it`) with real behavioral assertions — no placeholder/tautological assertions. |
| NFR-3 | The double's behavior MUST remain backward compatible (append-only) once published, per the compatibility clause in the contract document.              |
| NFR-4 | Documentation (README, contract) MUST be kept in sync with any behavioral change to the double.                                                         |

## 6. Traceability

- This SRS traces to `src/features/finance/financeEngineArchitectureDouble/financeEngineArchitectureDouble.contract.md`
  for the authoritative behavioral contract.
- This SRS traces to the companion SDD:
  `plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-SPEC-1925.md`.
- This SRS traces to parent issue #1925 for overall finance engine architecture context and to
  child issue #2483 for the specific deliverable described here.

## 7. Completion Evidence

- Contract document created and reviewed against the requirements table above (FR-1 through FR-9
  all have a corresponding contract clause).
- README documenting usage and scope boundaries created alongside the contract.
- This SRS and its companion SDD recorded under `plans/implementation_handoffs/`.

## 8. Rollback Note

This handoff introduces documentation-only artifacts (contract, README, SRS, SDD) with no source
code, build configuration, or runtime behavior changes. Rollback is a pure file deletion:

```
git rm src/features/finance/financeEngineArchitectureDouble/financeEngineArchitectureDouble.contract.md
git rm src/features/finance/financeEngineArchitectureDouble/README.md
git rm plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-SPEC-1925.md
git rm plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-SPEC-1925.md
```

No database migrations, secrets, or third-party mutations are involved, so rollback carries no
side effects beyond removing these four files. Parent issue #1925 remains open regardless of this
child's status.
