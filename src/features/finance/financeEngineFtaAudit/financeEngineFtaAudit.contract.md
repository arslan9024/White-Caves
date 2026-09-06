# financeEngineFtaAudit — Contract

> Parent issue: #1944
> Child issue: #2403

## Purpose

This document defines the behavioral contract for the `financeEngineFtaAudit` module, the
FTA (Federal Tax Authority) audit-trail subsystem of the White Caves finance engine. The
module is responsible for producing, validating, and exposing an auditable, tamper-evident
record of finance-engine calculations (VAT computation, invoice totals, ledger postings)
so that the results can be independently verified against FTA compliance requirements.

This is a **documentation-only** deliverable for child issue #2403. It establishes the
contract that any future implementation (types, services, tests) under
`src/features/finance/financeEngineFtaAudit/` must satisfy. No runtime TypeScript source
files are introduced by this change; the contract is the source of truth referenced by
this module's future test suite and implementation.

## Declared Scope (in-bounds)

- Defining the shape of an FTA audit record (append-only, per finance-engine run).
- Defining the validation rules an audit record must satisfy to be considered compliant.
- Defining how audit records are correlated back to the finance-engine input/output they
  describe (via a stable, deterministic reference id).
- Defining error/exception categories the audit subsystem must be able to report.
- Documenting the public API surface (function/type names) that a future implementation
  must expose so consumers and tests can rely on a stable contract.

## Out of Scope (excluded per issue #2403)

- Parent issue closure (#1944 remains open until all child work is reconciled).
- Bulk GitHub mutation of any kind.
- Destructive database operations (no deletes, no truncation, no migrations executed).
- Production secret rewrites (no `.env`, credentials, or key material changes).
- Any change to files outside `src/features/finance/financeEngineFtaAudit/`.

## Data Contract

### `FtaAuditRecord`

An `FtaAuditRecord` is an immutable, append-only entry describing a single finance-engine
audit event.

| Field           | Type                                | Required | Description                                                                                                         |
| --------------- | ----------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| `id`            | `string` (UUID v4)                  | yes      | Unique identifier of the audit record.                                                                              |
| `referenceId`   | `string`                            | yes      | Deterministic id linking the record to the finance-engine calculation it audits (e.g. invoice id, ledger entry id). |
| `engineVersion` | `string` (semver)                   | yes      | Version of the finance engine that produced the calculation.                                                        |
| `vatRatePct`    | `number`                            | yes      | VAT rate percentage applied (e.g. `5` for 5%). Must be `>= 0` and `<= 100`.                                         |
| `netAmount`     | `number`                            | yes      | Net amount prior to VAT, in minor currency units (fils). Must be a finite, non-negative integer.                    |
| `vatAmount`     | `number`                            | yes      | Computed VAT amount, in minor currency units. Must equal `round(netAmount * vatRatePct / 100)`.                     |
| `grossAmount`   | `number`                            | yes      | `netAmount + vatAmount`. Must equal the sum exactly.                                                                |
| `currency`      | `'AED'`                             | yes      | Currency code. Only `AED` is supported in the current contract.                                                     |
| `createdAt`     | `string` (ISO 8601 UTC timestamp)   | yes      | Time the record was generated.                                                                                      |
| `hash`          | `string` (SHA-256 hex digest)       | yes      | Tamper-evidence hash computed over the canonical serialization of all other fields.                                 |
| `status`        | `'valid' \| 'invalid' \| 'pending'` | yes      | Result of the most recent validation pass.                                                                          |
| `issues`        | `readonly FtaAuditIssue[]`          | yes      | List of validation issues found (empty when `status === 'valid'`).                                                  |

### `FtaAuditIssue`

| Field      | Type                   | Required | Description                                                       |
| ---------- | ---------------------- | -------- | ----------------------------------------------------------------- |
| `code`     | `FtaAuditIssueCode`    | yes      | Machine-readable issue category.                                  |
| `message`  | `string`               | yes      | Human-readable description.                                       |
| `severity` | `'error' \| 'warning'` | yes      | Severity of the issue. `error` issues force `status = 'invalid'`. |

### `FtaAuditIssueCode` (enumerated contract)

- `VAT_RATE_OUT_OF_RANGE` — `vatRatePct` is outside `[0, 100]`.
- `AMOUNT_NOT_FINITE` — one of `netAmount`, `vatAmount`, `grossAmount` is not a finite number.
- `AMOUNT_NEGATIVE` — one of `netAmount`, `vatAmount`, `grossAmount` is negative.
- `VAT_CALCULATION_MISMATCH` — `vatAmount` does not equal the expected computed value.
- `GROSS_CALCULATION_MISMATCH` — `grossAmount` does not equal `netAmount + vatAmount`.
- `HASH_MISMATCH` — recomputed hash does not match the stored `hash` (tamper detected).
- `UNSUPPORTED_CURRENCY` — `currency` is not a supported currency code.
- `MISSING_REFERENCE` — `referenceId` is empty or missing.

## Behavioral Contract

1. **Determinism**: Given identical input fields, the computed `hash` must be identical
   across calls and across processes (pure function, no reliance on ambient state).
2. **Append-only**: Once created, an `FtaAuditRecord`'s numeric/currency/reference fields
   must never be mutated in place; corrections are represented as new records referencing
   the original via `referenceId`.
3. **Fail-closed validation**: Any `error`-severity issue must set `status` to `'invalid'`.
   `warning`-severity issues alone do not invalidate a record.
4. **Rounding rule**: VAT amounts are computed using banker-safe rounding
   (`Math.round` on minor units) to avoid floating-point drift; the contract requires all
   amounts to be represented as integers in minor currency units (fils), never floats
   representing major units (dirhams).
5. **Hash coverage**: The `hash` must be computed over a canonical JSON serialization
   (stable key ordering) of every field except `id`, `hash`, `status`, and `issues`, so
   that validation status changes never alter the tamper-evidence hash.

## Public API Surface (for future implementation)

A conforming implementation of this contract is expected to export, at minimum:

```ts
export interface FtaAuditRecord { /* as defined above */ }
export interface FtaAuditIssue { /* as defined above */ }
export type FtaAuditIssueCode = /* union as defined above */;

export function createFtaAuditRecord(input: FtaAuditRecordInput): FtaAuditRecord;
export function validateFtaAuditRecord(record: FtaAuditRecord): FtaAuditRecord;
export function computeFtaAuditHash(input: FtaAuditRecordInput): string;
```

Where `FtaAuditRecordInput` is `FtaAuditRecord` minus `id`, `hash`, `status`, `issues`,
and `createdAt` (the latter defaulted at creation time).

## Acceptance Criteria Mapping

| Acceptance criterion                                         | How this contract satisfies it                                                                       |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| Implementation remains within declared child scope           | Contract limited to `financeEngineFtaAudit` directory; no other files touched.                       |
| Focused tests and required validation commands pass          | Contract defines the exact types/behaviors a future `*.test.ts` suite (vitest) will assert against.  |
| Completion evidence and rollback note are recorded           | See `README.md` in this directory.                                                                   |
| Parent issue remains open until all child work is reconciled | This document does not close or reference closing #1944; it explicitly states the parent stays open. |

## Status

This contract is **documentation only**. No TypeScript implementation files were created
or modified as part of issue #2403. Implementation against this contract is tracked as
follow-up work under the parent issue #1944.
