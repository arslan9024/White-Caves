# Finance Engine — Double Entry Contract

- **Module**: `src/features/finance/financeEngineDoubleEntry`
- **Issue**: #2478 (child of parent #1926 — "SRS/SDD: W56 Finance Ledger"); tracked alongside
  sibling child issue #2479 covering the same double-entry engine scope.
- **Status**: Draft contract — implementation scaffolding tracked separately; this document is the
  authoritative behavioral contract that any concrete TypeScript implementation and its vitest
  suite MUST satisfy.

## 1. Purpose

Defines the double-entry bookkeeping engine used by the White Caves finance/ledger subsystem.
Every financial event recorded by the platform (bookings, refunds, commissions, payouts, fees,
adjustments) MUST be represented as a **balanced ledger transaction** composed of two or more
**entries**, where the sum of debits equals the sum of credits, in accordance with standard
double-entry accounting rules.

This contract is scoped strictly to the double-entry engine: transaction construction, validation,
posting, and balance derivation. It does NOT cover persistence adapters, HTTP/API routes, currency
conversion services, or reporting/analytics — those are separate child scopes under parent #1926.

## 2. Core Domain Types

```ts
type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';

type EntrySide = 'debit' | 'credit';

interface LedgerAccount {
  readonly id: string;
  readonly code: string; // e.g. "1000-CASH"
  readonly type: AccountType;
  readonly currency: string; // ISO 4217, e.g. "AED"
  readonly isActive: boolean;
}

interface LedgerEntry {
  readonly id: string;
  readonly accountId: string;
  readonly side: EntrySide;
  readonly amountMinorUnits: number; // integer, no floating point money
  readonly currency: string;
  readonly memo?: string;
}

interface LedgerTransaction {
  readonly id: string;
  readonly postedAt: string; // ISO 8601 timestamp
  readonly reference: string; // external correlation id (booking id, payout id, etc.)
  readonly entries: readonly LedgerEntry[];
  readonly metadata?: Readonly<Record<string, string>>;
}

type ValidationFailureCode =
  | 'EMPTY_ENTRIES'
  | 'SINGLE_SIDED'
  | 'UNBALANCED'
  | 'MIXED_CURRENCY'
  | 'NON_INTEGER_AMOUNT'
  | 'NON_POSITIVE_AMOUNT'
  | 'INACTIVE_ACCOUNT'
  | 'UNKNOWN_ACCOUNT';

interface ValidationFailure {
  readonly code: ValidationFailureCode;
  readonly message: string;
}

type ValidationResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly failures: readonly ValidationFailure[] };
```

Amounts are always integers expressed in the currency's minor unit (fils/cents). Floating point
amounts are rejected. No `any` types are permitted anywhere in the implementation or its tests.

## 3. Invariants (MUST hold for every accepted transaction)

1. **Balance invariant**: `sum(debits.amountMinorUnits) === sum(credits.amountMinorUnits)` per
   currency, for every transaction.
2. **Minimum entries**: a transaction MUST contain at least two entries.
3. **Both sides present**: a transaction MUST contain at least one debit entry and at least one
   credit entry (a transaction with only debits or only credits is rejected as `SINGLE_SIDED`).
4. **Single currency per transaction**: all entries within one `LedgerTransaction` MUST share the
   same `currency`. Multi-currency events are modeled as linked transactions with an FX
   conversion entry pair, not as a single mixed-currency transaction (out of scope here).
5. **Positive integer amounts**: `amountMinorUnits` MUST be a positive integer (`> 0`,
   `Number.isInteger(amount) === true`). Zero-value entries and negative amounts are rejected.
6. **Known, active accounts**: every `accountId` referenced by an entry MUST resolve to a
   `LedgerAccount` that exists and has `isActive === true` at posting time.
7. **Immutability of posted transactions**: once a `LedgerTransaction` is posted, its `entries`
   array and each entry are immutable (`readonly`). Corrections are made via new reversing
   transactions, never by mutating a posted transaction.
8. **Idempotent posting**: posting the same `reference` + entry set twice MUST NOT double-post;
   the engine returns the previously posted transaction instead of creating a duplicate.
9. **Deterministic account balance derivation**: an account's balance is always derivable by
   folding all posted entries for that account:
   - `asset`/`expense` accounts: balance = debits − credits (debit-normal).
   - `liability`/`equity`/`revenue` accounts: balance = credits − debits (credit-normal).

## 4. Required Engine Operations

- `validateTransaction(candidate, accounts): ValidationResult` — pure function, no side effects,
  checks invariants 1–6 above and returns all applicable `ValidationFailure` entries (not just the
  first).
- `postTransaction(candidate, accounts, ledgerState): LedgerTransaction` — validates first (throws
  or returns a typed error result on failure — implementation MUST NOT silently post an invalid
  transaction), applies invariant 8 (idempotency by `reference`), and returns the posted
  transaction.
- `getAccountBalance(accountId, postedTransactions, accounts): number` — pure function implementing
  invariant 9.
- `reverseTransaction(original): LedgerTransaction` — produces a new balanced transaction with every
  entry's side flipped (debit↔credit), same amounts/currency, new id, referencing the original via
  metadata (e.g. `{ reversalOf: original.id }`). MUST NOT mutate `original`.

## 5. Error Handling Contract

- Validation failures are returned as data (`ValidationResult`), not thrown, so callers can surface
  all failures to users at once.
- Programmer errors (e.g. calling `postTransaction` with a transaction that failed validation
  without checking) MAY throw a `TypeError` or a dedicated `LedgerPostingError`.
- No entry point may return `any`; unknown/invalid input is represented with the typed
  `ValidationFailureCode` union above.

## 6. Test Contract (for any vitest suite implementing this module)

Test files MUST use `import { describe, expect, it } from 'vitest'` and assert real computed
behavior (no placeholder `expect(true).toBe(true)`). Minimum required coverage:

1. A balanced two-entry transaction (one debit, one credit, equal amounts, same currency) passes
   `validateTransaction` with `ok: true`.
2. An unbalanced transaction (debit total ≠ credit total) fails with `UNBALANCED`.
3. A single-sided transaction (all debits or all credits) fails with `SINGLE_SIDED`.
4. A transaction with fewer than two entries fails with `EMPTY_ENTRIES`.
5. A transaction mixing currencies across entries fails with `MIXED_CURRENCY`.
6. A transaction with a non-integer or non-positive amount fails with `NON_INTEGER_AMOUNT` or
   `NON_POSITIVE_AMOUNT` respectively.
7. A transaction referencing an inactive or unknown account fails with `INACTIVE_ACCOUNT` or
   `UNKNOWN_ACCOUNT` respectively.
8. Posting the same `reference` twice returns the same transaction id both times (idempotency).
9. `getAccountBalance` returns correct debit-normal and credit-normal balances for representative
   `asset` and `liability` accounts across multiple posted transactions.
10. `reverseTransaction` produces entries with flipped sides, identical amounts/currency, a new
    transaction id, and does not mutate the original transaction object.

## 7. Explicitly Out of Scope

- Parent issue #1926 closure.
- Bulk GitHub mutation of any kind.
- Destructive database operations (this contract defines an in-memory/pure computation layer only;
  persistence adapters are a separate child scope).
- Production secret rewrites.
- Currency conversion / FX rate sourcing.
- HTTP/API route wiring.

## 8. Traceability

- Parent issue: #1926
- Child issue: #2478 (this document; sibling scope #2479 covers the same engine)
- Related handoff documents:
  - `plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-LEDGER-1926.md`
  - `plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-LEDGER-1926.md`
