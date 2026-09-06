# Ejari Suite Business Flow — Contract

- Parent issue: #1922
- Child issue: #2500
- Status: in progress (parent issue remains open until all child work under #1922 is reconciled)

## Purpose

This contract defines the scope, inputs/outputs, invariants, and validation
expectations for the `ejariSuiteBusinessFlow` feature module, which
orchestrates the Ejari (Dubai tenancy contract registration) document
lifecycle within the `documents` feature area.

The Ejari Suite Business Flow coordinates the sequence of steps required to
take a lease/tenancy record from "eligible for registration" through
"Ejari certificate issued", including document collection, validation,
submission, and status reconciliation.

## Declared Scope (this child issue only)

In scope for #2500:

- Documenting the business flow contract and module README for
  `ejariSuiteBusinessFlow`.
- Establishing the shared vocabulary (states, transitions, inputs/outputs)
  that subsequent implementation child issues under #1922 must conform to.

Out of scope (excluded per issue #2500):

- Parent issue (#1922) closure.
- Bulk GitHub mutation (e.g., batch issue/PR updates).
- Destructive database operations (drops, truncations, irreversible writes).
- Production secret rewrites (credentials, tokens, `.env` values).

Any TypeScript implementation, hooks, slices, or components that consume
this contract are tracked as separate child issues under the #1922 parent
and must implement against the interfaces described below without
widening this file's declared scope.

## Flow States

The Ejari suite business flow models a finite set of states:

| State                | Description                                                         |
| -------------------- | ------------------------------------------------------------------- |
| `draft`              | Flow instance created; no documents collected yet.                  |
| `documentsPending`   | Required documents (title deed, tenancy contract, IDs) outstanding. |
| `documentsCollected` | All required documents uploaded and locally validated.              |
| `submitted`          | Submission sent to the Ejari registration channel.                  |
| `underReview`        | Submission acknowledged, awaiting registrar decision.               |
| `rejected`           | Registrar rejected the submission; requires remediation.            |
| `issued`             | Ejari certificate issued; flow complete (terminal state).           |
| `cancelled`          | Flow cancelled before completion (terminal state).                  |

### Allowed Transitions

```
draft              -> documentsPending
documentsPending   -> documentsCollected
documentsCollected -> submitted
submitted          -> underReview
underReview        -> rejected | issued
rejected           -> documentsPending   (remediation loop)
draft | documentsPending | documentsCollected | submitted | underReview
                   -> cancelled
```

`issued` and `cancelled` are terminal; no further transitions are permitted
out of them. Implementations must reject any transition not listed above.

## Required Inputs

A flow instance requires, at minimum:

- `tenancyContractId: string` — identifier of the underlying tenancy record.
- `requiredDocuments: readonly string[]` — document type keys that must be
  present before the flow can leave `documentsPending`.
- `submittedDocuments: ReadonlyMap<string, DocumentRef>` — documents
  collected so far, keyed by document type.

## Outputs / Side Effects

- Emits a flow status snapshot (`state`, `updatedAt`, `history`) after every
  transition.
- Does not perform network calls, database writes, or GitHub mutations as
  part of this contract; those concerns belong to the implementation layer
  consuming this contract, tracked under separate #1922 child issues.

## Invariants

1. A transition is valid only if it appears in the Allowed Transitions
   table above.
2. `documentsCollected` may only be reached when every key in
   `requiredDocuments` has a corresponding entry in `submittedDocuments`.
3. Terminal states (`issued`, `cancelled`) never transition further.
4. All state changes must be recorded in the flow's history (append-only)
   for audit purposes.
5. No implementation may perform destructive database operations,
   production secret rewrites, or bulk GitHub mutations as part of
   satisfying this contract.

## Validation

Implementations of this contract are expected to be covered by focused
vitest suites asserting:

- Valid transitions succeed and update state/history correctly.
- Invalid transitions throw/are rejected without mutating state.
- Terminal-state guards are enforced.
- Document-completeness invariant (#2 above) is enforced before allowing
  `documentsCollected`.

## Rollback Note

This change adds two new documentation files only
(`ejariSuiteBusinessFlow.contract.md`, `README.md`) under
`src/features/documents/ejariSuiteBusinessFlow/`. No existing exports,
modules, or runtime behavior are modified. To roll back, delete the
`src/features/documents/ejariSuiteBusinessFlow/` directory; no other files
are affected and no data migrations are involved.

## Completion Evidence

- Files created: `ejariSuiteBusinessFlow.contract.md`, `README.md`.
- No source/test files were modified; no build or test commands were
  required to change behavior, since no executable code was added in this
  child issue.
- Parent issue #1922 remains open pending reconciliation of all sibling
  child issues.
