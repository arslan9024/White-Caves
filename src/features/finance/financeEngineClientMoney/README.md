# Finance Engine — Client Money

Sub-module of the White Caves Finance Engine responsible for tracking client
funds (tenant/landlord escrow, deposits, rent-in-transit balances) held
separately from company operating funds.

- **Issue:** #2418
- **Parent issue:** #1940 (remains open until all child work is reconciled)

## Status

Contract-only. This directory currently defines the data model, function
signatures, and reconciliation rules that a future implementation must
satisfy. See [`financeEngineClientMoney.contract.md`](./financeEngineClientMoney.contract.md)
for the full contract.

No runtime module or test suite exists yet in this directory; when added,
implementation files (e.g. `financeEngineClientMoney.ts`) and their vitest
suites (e.g. `financeEngineClientMoney.test.ts`) must conform exactly to the
contract document rather than redefine the domain model.

## Why a contract-first module

Client money handling carries strict correctness requirements (accounts must
never go negative, transactions are append-only and auditable, reconciliation
must be deterministic and side-effect free). Publishing the contract before
the implementation lets reviewers validate the invariants and test plan
independently of any specific code, and gives downstream child issues under
parent #1940 a stable interface to build against.

## Scope boundaries

This module (and this issue) explicitly excludes:

- Closing the parent issue (#1940).
- Bulk GitHub mutations.
- Destructive database operations.
- Rewriting production secrets.

## Rollback

Deleting this `README.md` and the accompanying `.contract.md` file fully
reverts this change; no code, config, or dependency changes are involved.
