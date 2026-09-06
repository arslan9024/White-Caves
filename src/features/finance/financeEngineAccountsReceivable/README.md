# financeEngineAccountsReceivable

Accounts-receivable sub-module of the White Caves finance engine
(`src/features/finance`). Tracks amounts owed to the business by tenants,
buyers, or agencies.

- Issue: #2410
- Parent issue: #1942 (remains open until all child issues are reconciled)

## Status

Contract and documentation stage. This directory currently defines the
public contract for the sub-module (see
[`financeEngineAccountsReceivable.contract.md`](./financeEngineAccountsReceivable.contract.md)).
Implementation (types, services, tests) is delivered under subsequent child
issues of #1942, against the interface fixed here.

## What this module will own

- Receivable record lifecycle: pending → partially paid → paid, or overdue
  → written off.
- Outstanding balance and aging calculations used by finance dashboards and
  reports elsewhere in `src/features/finance`.
- Pure, side-effect-free calculation helpers that other finance-engine
  sub-modules (e.g., reporting, reconciliation) can compose without needing
  to know about persistence or transport concerns.

## What this module will NOT own

- Persistence/storage of receivable records (handled by a data-access layer
  outside this directory).
- Payment processing or gateway integration.
- GitHub issue/PR automation, bulk mutations, or destructive database
  operations — explicitly excluded from this and related child issues.

## Directory layout (target)

```
financeEngineAccountsReceivable/
├── README.md                                   # this file
├── financeEngineAccountsReceivable.contract.md # public contract & invariants
├── financeEngineAccountsReceivable.types.ts     # (future) shared types
├── financeEngineAccountsReceivable.ts           # (future) pure calculation logic
└── financeEngineAccountsReceivable.test.ts      # (future) vitest suite
```

## Testing expectations (future implementation)

Tests must use vitest:

```ts
import { describe, expect, it } from 'vitest';
```

Every exported function/type must have at least one test that asserts real
behavior (e.g., correct outstanding balance for a partially paid record),
not a placeholder assertion.

## Rollback

This is a documentation-only addition. To roll back, delete this file and
`financeEngineAccountsReceivable.contract.md` from this directory. No other
files, dependencies, or data are affected.
