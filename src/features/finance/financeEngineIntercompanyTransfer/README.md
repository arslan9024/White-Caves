# Finance Engine — Intercompany Transfer

Issue: #2434 · Parent issue: #1936

## Overview

This module (`src/features/finance/financeEngineIntercompanyTransfer/`) will
house the intercompany transfer capability of the White Caves finance engine:
moving recognized ledger value between related legal entities (e.g. a
management company and a property-owning SPV) via balanced, append-only
ledger entries, without any external payment rail.

This issue delivers the **contract and requirements/design handoff
documents** that govern the implementation. It intentionally does not ship
runtime code — see [Status](#status) below.

## Contents

| File                                                                               | Purpose                                                                                                                                                            |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `financeEngineIntercompanyTransfer.contract.md`                                    | Canonical behavioral contract: types, state machine, validation rules, concurrency/idempotency guarantees, error taxonomy. Source of truth for any implementation. |
| `README.md`                                                                        | This file — module orientation and links to the handoff docs.                                                                                                      |
| `../../../../plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-TRANSFER-1936.md` | Software Requirements Specification for the intercompany transfer capability.                                                                                      |
| `../../../../plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-TRANSFER-1936.md` | Software Design Description translating the SRS into the module's internal design.                                                                                 |

## Status

This issue is **documentation-only**. No `.ts` source or test files are
introduced under this directory by issue #2434. A future child issue under
parent #1936 will implement the module per the contract, and its tests must
be vitest-based (`import { describe, expect, it } from 'vitest'`) with real
behavior assertions covering the state machine, validation rules, and
idempotency guarantees defined in the contract.

## Scope Boundaries

**In scope for this issue:**

- The contract document.
- SRS/SDD handoff documents for the parent capability.

**Explicitly excluded (per issue #2434):**

- Closing parent issue #1936 — it remains open until all child issues under
  it are reconciled.
- Bulk GitHub mutations.
- Destructive database operations.
- Production secret rewrites.
- Any code outside this documentation set.

## Relationship to Parent Issue #1936

Parent issue #1936 tracks the overall finance-engine transfer initiative.
This child issue (#2434) is one of potentially several child issues that
each deliver a scoped, independently reviewable slice of that initiative.
The parent issue must remain open until every child issue (including any not
yet filed) is completed and reconciled against the parent's acceptance
criteria.

## Rollback

This issue only adds new files; it does not modify any existing source,
configuration, or test file. Rollback is a straightforward revert/deletion of
the four files listed above with no downstream impact, since nothing else in
the repository references them yet.
