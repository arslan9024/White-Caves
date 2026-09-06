# financeEngineReraOff

Child module of the finance engine covering the **RERA-off** payment plan
calculation path.

- **Issue:** #2383
- **Parent issue:** #1949 (remains open — not closed by this child work)

## What this module is

`financeEngineReraOff` scopes the calculation logic for generating payment
milestone plans on transactions explicitly marked as exempt from RERA
(Real Estate Regulatory Authority) escrow rules. See
[`financeEngineReraOff.contract.md`](./financeEngineReraOff.contract.md)
for the full input/output data contract, invariants, and error codes.

This directory currently contains **contract and scope documentation only**.
No runtime implementation files are introduced by this change.

## Scope boundaries

**In scope:**

- Defining the request/response shape for RERA-off finance plan generation.
- Defining validation invariants (percentage totals, milestone ordering,
  rounding conservation) that any implementation of this contract must obey.
- Defining the error taxonomy for invalid inputs.

**Explicitly excluded from this child issue:**

- Closing the parent issue (#1949).
- Bulk GitHub mutations.
- Destructive database operations.
- Rewriting production secrets.
- Any change to the RERA-on finance engine path.

## Relationship to the parent issue

This module is one of several child deliverables tracked under parent issue
#1949. Per the reconciliation model for that parent, **the parent issue
stays open until all child issues (including this one) are individually
verified and reconciled**. Completing this child task does not authorize
closing #1949.

## Validation / testing

This change introduces documentation only (`.md` files) — no `.ts` source is
added, so there is no new vitest suite required by this change. Any future
implementation of `financeEngineReraOff` (e.g. a `financeEngineReraOff.ts`
module) must ship with a companion `financeEngineReraOff.test.ts` using
`vitest` (`import { describe, expect, it } from 'vitest'`) that asserts real
behavior against the invariants documented in the contract file — not
placeholder assertions.

## Completion evidence

- `financeEngineReraOff.contract.md` — data/behavior contract for the
  RERA-off finance calculation path.
- `README.md` (this file) — scope, boundaries, and reconciliation notes.

## Rollback note

This change is additive and documentation-only. To roll back:

```powershell
Remove-Item -Recurse -Force src\features\finance\financeEngineReraOff
```

No dependencies, database schema, secrets, or existing source files are
modified or affected. Removing the directory fully reverts this change.
