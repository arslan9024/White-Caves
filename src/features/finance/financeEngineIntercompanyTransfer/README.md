# Finance Engine — Intercompany Transfer

Tracking: Issue #2434 · Parent: #1936

## What this module is

`financeEngineIntercompanyTransfer` will hold the Finance Engine's logic for moving
value between related entities inside White Caves (e.g. holding company ↔ project SPV)
while preserving double-entry ledger integrity. This directory currently contains the
**contract** for that module (see `financeEngineIntercompanyTransfer.contract.md`); it
does not yet contain runtime implementation code. Implementation is intentionally
deferred to a follow-up child issue under #1936 to keep this change's scope small and
reviewable.

## Why a contract-first approach

Intercompany postings touch two entities' books atomically and must be idempotent under
retry. Establishing the request/response shape, validation rules, and posting semantics
up front (before writing the service) lets the eventual implementation, its tests, and
any consuming callers (e.g. treasury workflows, reporting) be designed against a single
agreed interface, reducing churn once code lands.

## Contents

- `financeEngineIntercompanyTransfer.contract.md` — authoritative behavioral contract:
  types, validation rules, posting semantics, idempotency, and reversal rules.

## Relationship to parent issue #1936

This child issue (#2434) is scoped strictly to producing the contract and its
supporting planning documents (SRS/SDD handoffs under
`plans/implementation_handoffs/`). It explicitly excludes:

- Closing the parent issue (#1936 remains open until all child work is reconciled).
- Bulk GitHub mutations.
- Destructive database operations.
- Rewriting production secrets.

## Next steps (tracked separately, not part of this issue)

1. Implement the TypeScript module fulfilling this contract (strict types, no `any`).
2. Add `vitest` unit tests asserting real validation, posting, and idempotency behavior.
3. Wire the module into the broader finance engine's entity/ledger services.
4. Update this README once implementation lands to point at the concrete exports.
