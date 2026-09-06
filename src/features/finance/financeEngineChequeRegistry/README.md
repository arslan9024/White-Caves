# Finance Engine Cheque Registry

- Issue: #2426 (child of parent #1938)
- Location: `src/features/finance/financeEngineChequeRegistry/`

## What this module is

The Cheque Registry sub-module of the Finance Engine tracks the full lifecycle of
physical/post-dated cheques handled by White Caves' finance operations: cheques
received from tenants or buyers, and cheques issued to owners/vendors. It exists to
give a single, auditable source of truth for cheque status so that finance
dashboards, payment reconciliation, and reporting can rely on one consistent model
instead of ad-hoc tracking in spreadsheets or scattered payment records.

See [`financeEngineChequeRegistry.contract.md`](./financeEngineChequeRegistry.contract.md)
for the authoritative data contract (types, lifecycle transitions, validation rules,
query contract, and error codes).

## Current status

This pass delivers the **contract and planning artifacts only**:

- `financeEngineChequeRegistry.contract.md` — the data/behavior contract that any
  future service, Redux slice, or Prisma model implementing this module MUST satisfy.
- This README, describing scope, boundaries, and how to pick up implementation.
- Companion SRS/SDD handoff documents under `plans/implementation_handoffs/` describing
  requirements and design for the eventual runtime implementation.

No runtime TypeScript module (service class, Redux slice, API route) is shipped in
this pass. This keeps the change surgical and scoped strictly to the child issue
(#2426) without expanding into implementation, persistence, or bulk mutation work
that belongs to later child issues under parent #1938.

## Scope boundaries

**In scope for #2426:**

- Defining the cheque entity shape, lifecycle, validation, and error contract.
- Documenting how consumers (CRM finance views, payment reconciliation flows) are
  expected to query and mutate cheque records once implemented.

**Explicitly out of scope (per issue #2426 exclusions):**

- Closing parent issue #1938.
- Any bulk GitHub mutation (issue/PR bulk edits, mass closes, etc.).
- Destructive database operations (drops, truncates, irreversible deletes).
- Rewriting production secrets (API keys, DB credentials, `.env` values).

## Next steps for implementation

A follow-up child issue should:

1. Implement a `ChequeRegistryService` (or equivalent) satisfying the contract in
   `financeEngineChequeRegistry.contract.md`.
2. Add a Prisma model / migration for `ChequeRecord` (additive migration only — no
   destructive schema changes).
3. Add vitest unit tests covering validation rules, lifecycle transitions, and query
   filtering, asserting real behavior (not placeholder `expect(true).toBe(true)`
   assertions).
4. Wire the service into finance dashboard/reporting consumers.

## Rollback

This change is documentation-only (no runtime code, no schema changes, no
dependency changes). To roll back, delete the four files listed in the issue:

- `src/features/finance/financeEngineChequeRegistry/financeEngineChequeRegistry.contract.md`
- `src/features/finance/financeEngineChequeRegistry/README.md`
- `plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-CHEQUE-1938.md`
- `plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-CHEQUE-1938.md`

Deleting them has no effect on any other module, build, or test, since nothing else
references them yet.
