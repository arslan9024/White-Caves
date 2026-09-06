# financeEngineExportTo

Child scope of parent issue #1946 (issue #2395).

## What this is

This directory defines and documents the **export contract** used by the
Finance Engine to serialize domain records (ledger entries, valuations,
reconciliation reports) into external-facing formats such as JSON and CSV.

See [`financeEngineExportTo.contract.md`](./financeEngineExportTo.contract.md)
for the authoritative type definitions, function signature, and invariants
that any implementation in this directory must satisfy.

## Scope

**In scope (this child issue, #2395):**

- Defining the public `exportTo` contract: types, function signature,
  invariants, and documented edge-case behavior (empty input, malformed
  records, unsupported formats).
- Documenting expected behavior for JSON and CSV serialization, including
  metadata redaction and RFC 4180 CSV escaping.

**Out of scope (excluded from this child issue):**

- Closing the parent issue (#1946) — it remains open until all sibling child
  issues under it are reconciled.
- Bulk GitHub mutations (e.g. batch issue/PR updates).
- Destructive database operations — this module performs no persistence or
  database access of any kind.
- Production secret rewrites — this module never reads or writes credentials,
  API keys, or other secrets.

## Design decisions

- **Pure function contract**: `exportTo` is specified as a pure, synchronous
  function with no I/O so it can be unit tested deterministically and reused
  across server/client contexts without side effects.
- **Discriminated `ExportFormat` union (`'json' | 'csv'`)** instead of a
  loosely-typed string, so unsupported formats are caught at compile time by
  consumers and at runtime by the exporter itself (no `any`).
- **Explicit `FinanceExportResult.ok` flag with `errors` array** rather than
  throwing, so callers (UI, reporting jobs) can handle partial/invalid input
  gracefully without try/catch control flow.
- **Amounts expressed in smallest currency denomination** (e.g. cents) to
  avoid floating-point rounding drift common with decimal currency math.

## Validation

- Focused tests for this scope live alongside any implementation added under
  this directory and must use `vitest` with real (non-placeholder) behavior
  assertions covering: JSON export, CSV export with escaping, metadata
  redaction, empty input, and malformed-record error reporting.
- Required validation commands: run the project's existing `vitest` test
  command scoped to this directory/path; no new test runner or dependency is
  introduced.

## Completion evidence

- `financeEngineExportTo.contract.md` — authoritative contract (types,
  invariants, excluded scope) for the `exportTo` capability.
- `README.md` (this file) — scope summary, design rationale, and rollback
  note for child issue #2395.

## Rollback note

This change only adds two new documentation files
(`financeEngineExportTo.contract.md`, `README.md`) under a new directory,
`src/features/finance/financeEngineExportTo/`. No existing files were
modified, no dependencies were added, and no runtime code was introduced.
To roll back, delete this directory; no other part of the codebase
references it yet, so removal is non-breaking.

## Status

Parent issue #1946 remains open. This child issue (#2395) covers only the
contract/documentation scope described above; it does not close the parent
and does not perform any GitHub mutation, database operation, or secret
rewrite.
