# Finance Engine — Refund Management

Refund lifecycle contract and module scaffolding for the White Caves
Finance Engine (child of parent issue #1941, tracked as #2414).

## What this module is

This directory documents the refund-management sub-domain of the
Finance Engine: how a refund moves from request to settlement, what
invariants must always hold, and what the eventual public TypeScript
API surface looks like. See
[`financeEngineRefundManagement.contract.md`](./financeEngineRefundManagement.contract.md)
for the full lifecycle contract, invariants, and public-surface
definition.

## Status

Documentation-only. This issue does not add runtime source or test
files — it establishes the contract that future implementation issues
(state machine, gateway adapters, API wiring) under parent issue
#1941 must satisfy.

## Structure

```
src/features/finance/financeEngineRefundManagement/
├── financeEngineRefundManagement.contract.md   # Lifecycle contract, invariants, public surface
└── README.md                                    # This file
```

## Scope boundaries

**In scope for this issue (#2414):**

- Refund lifecycle contract documentation.
- Module README.

**Explicitly out of scope:**

- Parent issue closure.
- Bulk GitHub mutations.
- Destructive database operations.
- Production secret rewrites.
- Gateway adapter implementation, API route wiring, and UI flows
  (deferred to sibling child issues).

## Validation

No runtime code is introduced by this issue, so no build or test
commands apply. When a future issue adds implementation code to this
module, it must include `vitest` specs
(`import { describe, expect, it } from 'vitest'`) with real behavior
assertions validating conformance to the contract in
`financeEngineRefundManagement.contract.md`.

## Rollback

Delete this file and `financeEngineRefundManagement.contract.md`. No
other files in the repository were modified as part of this issue.

## Parent tracking

Parent issue #1941 stays open until every child issue (including this
one) is implemented, validated, and reconciled.
