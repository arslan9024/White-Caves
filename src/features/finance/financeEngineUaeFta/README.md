# financeEngineUaeFta

UAE Federal Tax Authority (FTA) VAT calculation module for the White Caves
finance feature area.

Issue: #2472 · Parent: #1927 · Work stream: `W56-FINANCE-VAT`

## What this module does

Provides pure, deterministic VAT calculation utilities for UAE-domiciled
transactions:

- Per-line-item VAT computation (standard 5%, zero-rated, exempt,
  out-of-scope).
- VAT period summaries (output VAT vs. input VAT, net payable/reclaimable).
- UAE Tax Registration Number (TRN) validation (15-digit format).

See [`financeEngineUaeFta.contract.md`](./financeEngineUaeFta.contract.md)
for the full behavioral contract, including exported types, rounding rules,
and the required test matrix. That contract is the authoritative source of
truth for this module — implementations and tests must conform to it.

## Status

This child issue (#2472) delivers the documentation/contract handoff only:

- `financeEngineUaeFta.contract.md` — API and behavior contract.
- This `README.md`.
- SRS and SDD handoff documents under
  `plans/implementation_handoffs/` describing requirements and design for
  the broader `W56-FINANCE-VAT` work stream.

No `.ts` source or test files were added under this issue. A follow-on
child issue implements `financeEngineUaeFta.ts` (and its
`financeEngineUaeFta.test.ts` vitest suite) against the contract above.

## Scope boundaries

In scope for the `W56-FINANCE-VAT` work stream: UAE FTA VAT calculation
logic described in the contract file.

Out of scope for this and sibling child issues: FTA e-Services filing
integration, non-UAE tax jurisdictions, persistence/database writes, parent
issue (#1927) closure, bulk GitHub mutations, destructive database
operations, and production secret rewrites.

## Directory layout (target, once implementation lands)

```
src/features/finance/financeEngineUaeFta/
├── financeEngineUaeFta.ts          # implementation (future child issue)
├── financeEngineUaeFta.test.ts     # vitest suite (future child issue)
├── financeEngineUaeFta.contract.md # this contract (this issue)
└── README.md                       # this file (this issue)
```

## Validation

Documentation-only change; no build/lint/test commands are required for
this deliverable. When the implementation child issue lands, run the
project's existing vitest command scoped to this directory, e.g.:

```
npx vitest run src/features/finance/financeEngineUaeFta
```

## Rollback

Delete this directory's contract and README files to revert; they carry no
runtime code and are not imported anywhere.
