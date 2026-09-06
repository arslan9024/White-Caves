# Finance Engine — Refund Management Contract

- **Issue:** #2414
- **Parent issue:** #1941
- **Module:** `src/features/finance/financeEngineRefundManagement`
- **Status:** In progress (parent issue #1941 remains open until all child work is reconciled)

## Purpose

Defines the scope, boundaries, and behavioral contract for the Refund
Management sub-domain of the Finance Engine. This document is the
source of truth for what this child module is responsible for, what it
must never do, and how its behavior is verified.

## Scope

This child issue covers **only** the refund-management concern within
the Finance Engine feature area:

- Documenting the refund lifecycle contract (request → validation →
  approval/rejection → settlement → reconciliation).
- Defining the public surface (types, function signatures, error
  states) that a future implementation of refund management must
  satisfy.
- Establishing the module-level README describing purpose, structure,
  and usage for contributors.

Out of scope (deferred to other child issues or the parent):

- Implementing the payment-gateway refund adapters.
- Wiring the refund engine into API routes or controllers.
- UI/consumer-facing refund flows.

## Refund Lifecycle (Contract)

| Stage       | Description                                              | Preconditions                                                                   | Postconditions                                                                                                                                  |
| ----------- | -------------------------------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `requested` | A refund request is created for a completed transaction. | Transaction exists and is in a refundable state (`paid`, `partially_refunded`). | A refund record is created in `requested` status with an immutable `requestId`, `transactionId`, and `amount`.                                  |
| `validated` | Amount and eligibility rules are checked.                | Refund record exists in `requested` status.                                     | Refund transitions to `validated` or `rejected` with a reason code.                                                                             |
| `approved`  | Refund is authorized for settlement.                     | Refund record exists in `validated` status.                                     | Refund transitions to `approved`.                                                                                                               |
| `rejected`  | Refund is declined.                                      | Refund exists in `requested` or `validated` status.                             | Refund transitions to `rejected` with a required reason string; terminal state.                                                                 |
| `settled`   | Funds are returned to the payer.                         | Refund exists in `approved` status.                                             | Refund transitions to `settled` with a `settledAt` timestamp; terminal state.                                                                   |
| `failed`    | Settlement attempt failed.                               | Refund exists in `approved` status.                                             | Refund transitions to `failed` with a required reason string; may be retried by creating a new refund cycle, not by mutating the failed record. |

### Invariants

1. A refund amount must never exceed the remaining refundable balance
   of its source transaction.
2. Terminal states (`rejected`, `settled`, `failed`) are immutable —
   no further status transitions are permitted on the same record.
3. Every rejection or failure must carry a non-empty, human-readable
   reason.
4. All monetary amounts are represented as integer minor units (e.g.
   cents) to avoid floating-point rounding errors.
5. Every state transition must be independently auditable (timestamp +
   actor + previous/next status).

## Public Surface (planned)

```ts
type RefundStatus = 'requested' | 'validated' | 'approved' | 'rejected' | 'settled' | 'failed';

interface RefundRequest {
  requestId: string;
  transactionId: string;
  amountMinorUnits: number;
  reason?: string;
  status: RefundStatus;
  createdAt: string;
  updatedAt: string;
}
```

Concrete implementations (validators, state-machine transitions,
adapters) are introduced by subsequent child issues under parent
issue #1941 and must conform to the invariants defined above.

## Excluded Scope (this issue)

- Parent issue closure.
- Bulk GitHub mutations.
- Destructive database operations.
- Production secret rewrites.

## Validation

- This issue introduces documentation only; no runtime code is added.
- Focused validation for this child issue consists of reviewing this
  contract and the accompanying README for internal consistency with
  the parent issue (#1941) and sibling child issues.
- No test suite changes are required by this issue. Future
  implementation issues that add runtime code to this module must add
  `vitest` specs (`import { describe, expect, it } from 'vitest'`)
  asserting real behavior against the contract above.

## Completion Evidence

- Files added: `financeEngineRefundManagement.contract.md`,
  `README.md` under
  `src/features/finance/financeEngineRefundManagement/`.
- No existing exports, modules, or files were modified or removed.

## Rollback Note

To roll back this change, delete the two files listed under
"Completion Evidence" above. No other files were touched, no
dependencies were added, and no runtime behavior was altered, so
rollback is a pure file deletion with no downstream impact.

## Reconciliation Note

Parent issue #1941 must remain **open** until all sibling child
issues covering refund-management implementation, gateway adapters,
and API wiring are completed and reconciled against this contract.
