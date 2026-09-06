# financeEngineCommissionLedger

Module scope: Commission Ledger sub-feature of the Finance Engine, tracked under
child issue #2460 (parent: #1930).

## What this module is

The Commission Ledger records commission entries earned by agents/brokers on
property deals, tracks their lifecycle (`pending -> approved -> paid`, or
`-> voided`), and provides summarized totals per status for reporting.

The authoritative behavioral contract lives in
[`financeEngineCommissionLedger.contract.md`](./financeEngineCommissionLedger.contract.md).
Any implementation added to this module (services, types, tests) must conform to
that contract. Where an existing implementation conflicts with the contract, the
contract — aligned with the test suite — is the source of truth.

## Directory layout (current + expected)

```
financeEngineCommissionLedger/
├── financeEngineCommissionLedger.contract.md   # domain contract (this issue)
├── README.md                                   # this file
└── (implementation + tests added in follow-up child issues)
```

## Declared scope boundaries

In scope for this and directly related child issues:

- Commission ledger entry modeling, validation, status transitions, and
  aggregation logic, and their documentation.

Explicitly excluded from this and sibling child issues under parent #1930:

- Closing the parent issue (#1930) — it remains open until all child work is
  reconciled.
- Bulk GitHub mutations (mass issue/PR edits, labels, etc.).
- Destructive database operations (drops, truncations, irreversible migrations).
- Rewriting production secrets (credentials, API keys, env values).

## Validation

Any TypeScript implementation added under this module must:

- Use strict TypeScript with no `any` types.
- Be covered by `vitest` tests using `import { describe, expect, it } from 'vitest'`
  with real behavioral assertions (no placeholder/`expect(true).toBe(true)`-style
  assertions).
- Run via the repository's existing test command (e.g. `npm run test` /
  `vitest run`) — no new test tooling is introduced by this module.

## Completion evidence

- This README and the accompanying contract document were added as the child-scope
  deliverable for issue #2460.
- No existing files or exported symbols elsewhere in the repository were modified.
- No git, npm, or GitHub mutation commands were run as part of this change.

## Rollback note

To roll back this change, delete this directory
(`src/features/finance/financeEngineCommissionLedger/`). This is a purely additive
documentation change with no code, dependency, schema, or configuration side
effects, so removal fully reverts it with no residual state.

## Status relative to parent issue

Parent issue #1930 remains **open**. This child issue (#2460) only delivers the
contract and README documentation described above; further child issues under the
same parent are expected to add the implementation, tests, and any integration
points, after which the parent can be reconciled and considered for closure by the
orchestrating process (not by this change).
