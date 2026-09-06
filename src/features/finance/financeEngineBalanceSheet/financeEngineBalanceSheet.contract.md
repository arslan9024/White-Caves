# Finance Engine — Balance Sheet Module Contract

- **Issue:** #2406
- **Parent issue:** #1943
- **Scope:** `src/features/finance/financeEngineBalanceSheet/`

## Purpose

Defines the module boundary and behavioral contract for the Balance Sheet
sub-module of the Finance Engine. This module is responsible for deriving a
point-in-time balance sheet (assets, liabilities, equity) from normalized
finance engine inputs (accounts, transactions, valuations) and exposing a
strict, typed API for consumers (reporting UI, export pipelines, other
finance-engine sub-modules).

This contract is documentation-only for this increment; it records the
expected public surface, invariants, and test obligations so that a
subsequent implementation increment can be built and reviewed against a
stable, agreed contract instead of ad-hoc assumptions.

## Declared Scope

In scope:

- Type definitions and computation contract for the Balance Sheet feature
  under `src/features/finance/financeEngineBalanceSheet/`.
- Documentation of inputs, outputs, invariants, and error conditions.
- Test obligations for the eventual implementation (vitest, real behavior
  assertions).

Out of scope (excluded, per parent issue #1943 governance):

- Parent issue closure.
- Bulk GitHub mutation (issue/PR edits, labels, project board changes).
- Destructive database operations (drops, truncations, irreversible
  migrations).
- Production secret rewrites (env vars, credentials, key rotation).
- Any change to files outside this module's directory.

## Public API Contract

The module is expected to expose the following strictly-typed surface once
implemented:

```ts
export interface BalanceSheetAccount {
  readonly id: string;
  readonly name: string;
  readonly category: 'asset' | 'liability' | 'equity';
  readonly subCategory: string;
  readonly balance: number; // minor units (e.g., cents), never floating currency
}

export interface BalanceSheetInput {
  readonly asOfDate: string; // ISO-8601 date, e.g. "2026-09-06"
  readonly accounts: readonly BalanceSheetAccount[];
}

export interface BalanceSheetSection {
  readonly subCategory: string;
  readonly total: number;
  readonly accounts: readonly BalanceSheetAccount[];
}

export interface BalanceSheetReport {
  readonly asOfDate: string;
  readonly assets: {
    readonly total: number;
    readonly sections: readonly BalanceSheetSection[];
  };
  readonly liabilities: {
    readonly total: number;
    readonly sections: readonly BalanceSheetSection[];
  };
  readonly equity: {
    readonly total: number;
    readonly sections: readonly BalanceSheetSection[];
  };
  readonly isBalanced: boolean; // assets.total === liabilities.total + equity.total
}

export declare function buildBalanceSheet(input: BalanceSheetInput): BalanceSheetReport;
```

## Invariants

1. `assets.total` MUST equal the sum of all `asset` category account balances.
2. `liabilities.total` MUST equal the sum of all `liability` category account
   balances.
3. `equity.total` MUST equal the sum of all `equity` category account
   balances.
4. `isBalanced` MUST be `true` if and only if
   `assets.total === liabilities.total + equity.total`.
5. Sections MUST be grouped by `subCategory` within each top-level category,
   preserving deterministic ordering (first-seen order of `subCategory`).
6. All monetary values MUST be integers (minor units). No `any` types are
   permitted anywhere in the implementation.
7. Empty `accounts` input MUST produce a report with all totals `0` and
   `isBalanced: true`.
8. Unknown/invalid `category` values MUST cause the function to throw a
   descriptive `Error` rather than silently miscategorizing the account.

## Error Conditions

- Throws if `asOfDate` is not a valid ISO-8601 date string.
- Throws if any account has a non-finite or non-integer `balance`.
- Throws if any account's `category` is not one of `asset | liability | equity`.

## Test Obligations (for the implementation increment)

Tests MUST be written with `vitest` (`import { describe, expect, it } from
'vitest'`) and MUST assert real computed behavior (no placeholder
`expect(true).toBe(true)` style assertions). Minimum required coverage:

- Empty input produces a zeroed, balanced report.
- A mixed set of asset/liability/equity accounts produces correct section
  totals and grand totals.
- `isBalanced` correctly reflects both balanced and unbalanced scenarios.
- Invalid `category` throws.
- Non-integer `balance` throws.
- Invalid `asOfDate` throws.
- Section ordering is deterministic and matches first-seen `subCategory`
  order.

## Completion Evidence

This increment (issue #2406) delivers the contract and README documentation
only, establishing the reviewed public surface for the Balance Sheet module.
No runtime TypeScript source or test files are introduced in this increment;
those are scoped to a follow-up implementation increment that will be built
directly against this contract. The parent issue (#1943) remains open, as
required, pending reconciliation of all child work items.

## Rollback Note

This change adds two new documentation files only
(`financeEngineBalanceSheet.contract.md`, `README.md`) under
`src/features/finance/financeEngineBalanceSheet/`. No existing files were
modified and no runtime code, dependencies, or configuration were changed.
To roll back, delete this directory; no other part of the repository is
affected.
