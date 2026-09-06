# financeEngineExportTo — Contract

- Issue: #2395
- Parent issue: #1946
- Scope: `src/features/finance/financeEngineExportTo/`

## Purpose

Defines the export contract for the Finance Engine's `exportTo` capability — the
interface responsible for serializing finance-engine domain results (ledger
snapshots, computed valuations, reconciliation reports) into consumer-facing
output formats (e.g. JSON, CSV) without exposing internal engine state.

This document is the source of truth for the public contract. Any TypeScript
implementation under this directory must conform to the shapes and invariants
described here. Where an existing implementation and this contract disagree,
this contract wins and the implementation must be aligned to it.

## Public Surface

### `ExportFormat`

```ts
type ExportFormat = 'json' | 'csv';
```

Enumerates the formats the exporter must support. No other literal values are
valid; passing an unsupported format must result in a rejected/error result,
never a silent fallback.

### `FinanceExportRecord`

```ts
interface FinanceExportRecord {
  readonly id: string;
  readonly category: string;
  readonly amount: number;
  readonly currency: string;
  readonly occurredAt: string; // ISO 8601 timestamp
  readonly metadata?: Readonly<Record<string, string | number | boolean>>;
}
```

Represents a single normalized finance record ready for export. `amount` is
always expressed in the smallest denomination consistent with `currency`
(e.g. cents for USD) to avoid floating point drift. `occurredAt` must be a
valid ISO 8601 string; producers are responsible for normalization before
records reach the exporter.

### `FinanceExportOptions`

```ts
interface FinanceExportOptions {
  readonly format: ExportFormat;
  readonly includeMetadata?: boolean;
  readonly delimiter?: string; // CSV-only, defaults to ','
}
```

### `FinanceExportResult`

```ts
interface FinanceExportResult {
  readonly ok: boolean;
  readonly format: ExportFormat;
  readonly payload?: string;
  readonly recordCount: number;
  readonly errors?: ReadonlyArray<string>;
}
```

### `exportTo`

```ts
function exportTo(
  records: ReadonlyArray<FinanceExportRecord>,
  options: FinanceExportOptions
): FinanceExportResult;
```

## Invariants

1. **Purity** — `exportTo` must be a pure function: no I/O, no mutation of
   `records`, no reliance on ambient/global state (clock, env vars, etc.).
2. **Determinism** — Given the same `records` and `options`, the output
   `payload` must be byte-identical across calls.
3. **No silent failure** — If any record fails to serialize (e.g. malformed
   `occurredAt`), the function must return `ok: false` with a populated
   `errors` array and must NOT return a partially-corrupt `payload`.
4. **Strict typing** — No `any`. Unknown/unvalidated input at the boundary
   must be validated and narrowed before use.
5. **Metadata redaction** — When `includeMetadata` is `false` or omitted,
   `metadata` must be entirely excluded from the serialized payload, not
   merely emptied.
6. **CSV escaping** — CSV output must correctly escape delimiters, quotes,
   and newlines per RFC 4180; JSON output must be valid, parseable JSON.
7. **Empty input** — An empty `records` array is valid input and must
   produce `ok: true`, `recordCount: 0`, and a well-formed empty payload
   (`"[]"` for JSON, header-only or empty string for CSV per implementation
   note in README).

## Excluded Scope

This contract does NOT cover:

- Parent issue (#1946) closure or reconciliation across sibling child issues.
- Bulk GitHub mutations of any kind.
- Destructive database operations (this module has no database access).
- Production secret rewrites or credential handling of any kind.
- Persistence, network transport, or scheduling of exports — this module only
  produces an in-memory serialized payload string; callers own delivery.

## Status

- Parent issue #1946 remains open until all child work is reconciled.
- This child scope (#2395) is limited to defining and documenting the
  `exportTo` contract and its supporting types as captured above.
