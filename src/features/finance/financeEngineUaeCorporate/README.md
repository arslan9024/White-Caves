# financeEngineUaeCorporate

Finance module sub-feature: UAE Corporate Tax calculation engine for White Caves.

- **Tracking issue:** #2441
- **Parent issue:** #1935 (remains open — this child scope does not close it)
- **Status:** Contract/handoff stage. No runtime implementation is added by this change.

## What this directory is

This directory currently holds the design contract for a future UAE Corporate Tax
calculation engine (`financeEngineUaeCorporate.contract.md`). The contract defines the
public TypeScript interface, invariants, and acceptance criteria that the implementation
must satisfy. It exists so that:

1. Downstream teams (accounting exports, compliance dashboards) can review and agree on
   the shape of the engine before code is written.
2. The implementation PR has an unambiguous, testable specification to build against.
3. Reviewers can verify scope boundaries independently of implementation details.

## Why a contract-first approach

UAE Corporate Tax rules (Federal Decree-Law No. 47 of 2022) involve monetary thresholds
and rates that are politically and legally sensitive to get wrong. Separating the
contract (this handoff) from the implementation lets the interface be reviewed and
locked before any calculation logic is written, reducing the risk of rework and making
the eventual implementation PR small, focused, and easy to test.

## Scope boundaries

**In scope for this child issue (#2441):**

- Documenting the module contract and interface shape.
- Documenting the SRS/SDD handoff artifacts under `plans/implementation_handoffs/`.

**Out of scope:**

- Closing parent issue #1935.
- Any bulk GitHub mutation.
- Destructive database operations.
- Production secret rewrites.
- Writing the actual `.ts` implementation of the engine (tracked separately once the
  contract is accepted).

## Where to look next

- Contract: [`financeEngineUaeCorporate.contract.md`](./financeEngineUaeCorporate.contract.md)
- Requirements handoff: `plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-CORPORATE-TAX-1935.md`
- Design handoff: `plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-CORPORATE-TAX-1935.md`

## Rollback note

This change is documentation-only (markdown files under a new directory). Rollback is a
simple revert of the added files/directory; no schema, dependency, or runtime code is
affected.
