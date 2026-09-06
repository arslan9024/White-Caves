# Finance Engine — Client Money Module Contract

- **Issue:** #2418
- **Parent issue:** #1940
- **Module path:** `src/features/finance/financeEngineClientMoney/`
- **Status:** Contract defined; implementation tracked under parent #1940 reconciliation.

## 1. Purpose

Defines the behavioral and data contract for the Client Money sub-module of the
Finance Engine. This module is responsible for tracking, reconciling, and
reporting on client funds (e.g. tenant/landlord escrow, security deposits,
rent-in-transit balances) held by White Caves on behalf of third parties,
strictly separated from company operating funds.

This document is the source of truth for any implementation, test, or review
work performed against this module. Where a future implementation diverges
from this contract, the contract wins unless it is amended here first.

## 2. Scope

### In scope (this child issue)

- Defining the public TypeScript contract (types, function signatures,
  invariants) for client money ledger operations.
- Documenting the reconciliation rules that any implementation must satisfy.
- Documenting error/edge-case behavior expected by tests.

### Out of scope (excluded per issue #2418)

- Closing the parent issue (#1940) — parent remains open until all child
  work across the finance engine is reconciled.
- Bulk GitHub mutations (issue/PR batch operations).
- Destructive database operations (drops, truncates, irreversible migrations).
- Rewriting or rotating production secrets.

## 3. Domain Model

### 3.1 `ClientMoneyAccount`

Represents a single ring-fenced ledger of client funds.

| Field               | Type                     | Notes                                                                       |
| ------------------- | ------------------------ | --------------------------------------------------------------------------- |
| `accountId`         | `string`                 | Stable unique identifier (UUID).                                            |
| `ownerType`         | `'tenant' \| 'landlord'` | Whose funds this account holds.                                             |
| `ownerId`           | `string`                 | Reference id of the owner entity.                                           |
| `currency`          | `string`                 | ISO 4217 currency code, e.g. `'AED'`.                                       |
| `balanceMinorUnits` | `number`                 | Integer balance in minor currency units (fils/cents). Never a float amount. |
| `createdAt`         | `string`                 | ISO 8601 timestamp.                                                         |
| `updatedAt`         | `string`                 | ISO 8601 timestamp.                                                         |

**Invariant:** `balanceMinorUnits` is always a non-negative safe integer.
Client money accounts must never go into deficit as a result of a single
ledger operation; operations that would cause `balanceMinorUnits < 0` must be
rejected before mutating state.

### 3.2 `ClientMoneyTransaction`

An immutable, append-only ledger entry.

| Field                     | Type                                                                           | Notes                                                        |
| ------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| `transactionId`           | `string`                                                                       | Stable unique identifier (UUID).                             |
| `accountId`               | `string`                                                                       | Foreign key to `ClientMoneyAccount.accountId`.               |
| `type`                    | `'deposit' \| 'withdrawal' \| 'transfer_in' \| 'transfer_out' \| 'adjustment'` |                                                              |
| `amountMinorUnits`        | `number`                                                                       | Positive integer; sign is implied by `type`.                 |
| `reference`               | `string`                                                                       | External reference (invoice id, payment id, etc.).           |
| `occurredAt`              | `string`                                                                       | ISO 8601 timestamp.                                          |
| `postedBalanceMinorUnits` | `number`                                                                       | Resulting account balance after this entry, for audit trail. |

**Invariant:** Transactions are append-only. No implementation may mutate or
delete a previously posted `ClientMoneyTransaction`. Corrections must be made
via a new `adjustment` transaction referencing the original `transactionId`.

## 4. Function Contract

The following signatures define the required public surface for any
implementation module (e.g. `financeEngineClientMoney.ts`). Strict TypeScript
is required; `any` is prohibited. Implementations may add private helpers
freely as long as this public surface is preserved.

```ts
export interface ClientMoneyAccount {
  accountId: string;
  ownerType: 'tenant' | 'landlord';
  ownerId: string;
  currency: string;
  balanceMinorUnits: number;
  createdAt: string;
  updatedAt: string;
}

export type ClientMoneyTransactionType =
  | 'deposit'
  | 'withdrawal'
  | 'transfer_in'
  | 'transfer_out'
  | 'adjustment';

export interface ClientMoneyTransaction {
  transactionId: string;
  accountId: string;
  type: ClientMoneyTransactionType;
  amountMinorUnits: number;
  reference: string;
  occurredAt: string;
  postedBalanceMinorUnits: number;
}

export interface ClientMoneyOperationResult {
  account: ClientMoneyAccount;
  transaction: ClientMoneyTransaction;
}

/** Thrown when an operation would violate a client money invariant. */
export class ClientMoneyInvariantError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ClientMoneyInvariantError';
  }
}

/**
 * Applies a deposit to a client money account.
 * amountMinorUnits must be a positive safe integer.
 */
export function applyDeposit(
  account: ClientMoneyAccount,
  amountMinorUnits: number,
  reference: string,
  occurredAt: string
): ClientMoneyOperationResult;

/**
 * Applies a withdrawal to a client money account.
 * Rejects (throws ClientMoneyInvariantError) if the withdrawal would
 * cause the account balance to go negative.
 */
export function applyWithdrawal(
  account: ClientMoneyAccount,
  amountMinorUnits: number,
  reference: string,
  occurredAt: string
): ClientMoneyOperationResult;

/**
 * Reconciles a list of transactions against an account's stated balance.
 * Returns true only if replaying every transaction in chronological order,
 * starting from a zero balance, produces exactly the account's current
 * balanceMinorUnits.
 */
export function reconcileAccount(
  account: ClientMoneyAccount,
  transactions: ReadonlyArray<ClientMoneyTransaction>
): boolean;
```

## 5. Reconciliation Rules

1. Replay order is strictly by `occurredAt` ascending; ties broken by the
   original array order (stable sort).
2. `deposit` and `transfer_in` increase the running balance by
   `amountMinorUnits`.
3. `withdrawal` and `transfer_out` decrease the running balance by
   `amountMinorUnits`.
4. `adjustment` may increase or decrease the balance; its signed effect is
   derived from `postedBalanceMinorUnits - <balance prior to this entry>`
   recorded on the transaction itself, since adjustments are the only type
   permitted to carry an implicit sign.
5. `reconcileAccount` returns `false` (never throws) when the replayed
   balance does not match `account.balanceMinorUnits`, so callers can trigger
   an alerting/audit workflow instead of crashing.
6. Any transaction with a non-integer or non-positive `amountMinorUnits`
   (except `adjustment`, which may be zero) is treated as invalid and causes
   `reconcileAccount` to return `false`.

## 6. Error Handling

- All invariant violations raise `ClientMoneyInvariantError`, a typed
  subclass of `Error`, never a bare string or untyped throw.
- No function in this module may return `any` or accept `any` typed
  parameters.
- Functions are pure with respect to their inputs: they return new objects
  rather than mutating the `account` or `transaction` arguments passed in.

## 7. Test Contract

Tests for this module (when implemented) must:

- Use `vitest` (`import { describe, expect, it } from 'vitest'`).
- Assert real behavioral outcomes (resulting balances, thrown error types,
  reconciliation booleans) — never placeholder assertions such as
  `expect(true).toBe(true)`.
- Cover at minimum: successful deposit, successful withdrawal, rejected
  overdraft withdrawal, and both a passing and failing reconciliation case.

## 8. Rollback Note

This change adds only documentation (this contract and the accompanying
`README.md`) under `src/features/finance/financeEngineClientMoney/`. No
runtime code, dependencies, configuration, or database state is modified.
To roll back, delete the two added files; no other part of the repository
is affected.

## 9. Reconciliation Status

Parent issue #1940 remains open. This child issue (#2418) is scoped to
contract definition only; it does not implement the runtime module, does not
close #1940, and does not perform any bulk GitHub mutation, destructive
database operation, or production secret change.
