# financeEngineTaxInvoice — Contract

- Issue: #2468
- Parent issue: #1928

## Scope

This contract defines the boundaries and behavioral guarantees for the
`financeEngineTaxInvoice` child feature of the Finance Engine domain. It
covers tax-invoice computation, validation, and formatting concerns only.

### In scope

- Tax invoice line-item calculation contracts (subtotal, tax, total).
- Validation rules for tax invoice input data (required fields, numeric
  ranges, currency/tax-rate consistency).
- Deterministic, pure computation functions consumable by the wider
  finance engine and UI layers.
- Type definitions describing tax invoice requests/results.

### Out of scope

- Parent issue (#1928) closure or status changes.
- Bulk GitHub mutation of any kind (issues, PRs, labels).
- Destructive database operations (drops, truncates, irreversible writes).
- Production secret rewrites (env vars, credentials, key rotation).
- Persistence, network I/O, or invoice PDF/document rendering — this
  child scope is limited to pure calculation/validation logic and its
  documentation.

## Interface guarantees

- All public functions exported from this feature are pure (no side
  effects, no I/O) and strictly typed — no `any`.
- Invalid input results in explicit, typed validation errors rather than
  silent coercion or thrown untyped exceptions.
- Numeric computations avoid floating-point drift for currency values by
  rounding to the smallest currency unit at each computation boundary.

## Acceptance criteria

- Implementation remains within the declared child scope described above.
- Focused unit tests (vitest) exist and pass for all exported behavior.
- Required validation commands (typecheck/test) pass for this feature
  directory.
- Completion evidence and a rollback note are recorded in this feature's
  `README.md`.
- The parent issue (#1928) remains open until all sibling child issues
  are reconciled; this child does not assume or trigger parent closure.

## Non-goals / explicit exclusions

- Closing or editing the parent issue (#1928).
- Performing bulk GitHub mutations (batch issue/PR updates).
- Any destructive database operation.
- Rewriting or rotating production secrets.

## Rollback

See `README.md` for the rollback note associated with this child scope.
