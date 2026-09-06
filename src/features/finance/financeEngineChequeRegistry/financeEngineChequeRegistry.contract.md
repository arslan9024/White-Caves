# Finance Engine — Cheque Registry Contract

- Issue: #2426
- Parent issue: #1938
- Module path: `src/features/finance/financeEngineChequeRegistry/`
- Status: Draft (implementation contract only — no runtime code shipped in this pass)

## 1. Purpose

Defines the data and behavioral contract for the **Cheque Registry** sub-module of the
Finance Engine. The Cheque Registry is the single source of truth for tracking
post-dated and current-dated cheques received from tenants/buyers and issued to
vendors/owners, including their lifecycle state (received → deposited → cleared /
bounced / cancelled).

This contract does not implement UI or persistence; it defines the shape that any
future implementation (service, Redux slice, Prisma model) MUST honor so that
consuming code in Homepage/CRM finance views can be built against a stable interface.

## 2. Scope

### In scope

- Cheque entity shape and required fields.
- Allowed lifecycle states and legal transitions.
- Validation rules for cheque numbers, amounts, and dates.
- Query/filter contract for listing cheques by status, party, or date range.
- Error contract for rejected transitions and invalid input.

### Out of scope (excluded per issue #2426)

- Closing the parent issue (#1938).
- Bulk GitHub mutations of any kind.
- Destructive database operations (drops, truncations, irreversible deletes).
- Production secret rewrites (API keys, DB credentials, `.env` values).
- Bank-integration / clearing-house network calls (future child issue).

## 3. Core Types (contractual shape)

```ts
export type ChequeStatus = 'RECEIVED' | 'DEPOSITED' | 'CLEARED' | 'BOUNCED' | 'CANCELLED';

export interface ChequeRecord {
  /** Stable unique identifier (UUID v4). */
  id: string;
  /** Bank-printed cheque number, digits only, 6-12 chars. */
  chequeNumber: string;
  /** Issuing bank name. */
  bankName: string;
  /** Cheque face amount in minor units (fils/cents) to avoid float drift. */
  amountMinor: number;
  /** ISO 4217 currency code, e.g. "AED". */
  currency: string;
  /** ISO 8601 date the cheque is dated for. */
  chequeDate: string;
  /** Party the cheque was received from or issued to. */
  counterpartyId: string;
  /** Current lifecycle state. */
  status: ChequeStatus;
  /** Linked lease, sale, or payment plan identifier, if any. */
  linkedTransactionId: string | null;
  /** Audit timestamps (ISO 8601). */
  createdAt: string;
  updatedAt: string;
}
```

## 4. Lifecycle & Legal Transitions

```
RECEIVED   -> DEPOSITED, CANCELLED
DEPOSITED  -> CLEARED, BOUNCED
CLEARED    -> (terminal)
BOUNCED    -> RECEIVED, CANCELLED   // redeposit workflow or writeoff
CANCELLED  -> (terminal)
```

Any transition not listed above MUST be rejected with error code
`CHEQUE_ILLEGAL_TRANSITION`.

## 5. Validation Rules

- `chequeNumber`: required, `^[0-9]{6,12}$`.
- `amountMinor`: required, integer, `> 0`.
- `currency`: required, 3-letter uppercase ISO code.
- `chequeDate`: required, valid ISO 8601 date, not more than 5 years in the past.
- `counterpartyId`: required, non-empty string.
- Duplicate `(chequeNumber, bankName)` pairs for the same counterparty in a
  non-terminal status MUST be rejected with `CHEQUE_DUPLICATE`.

## 6. Query Contract

Consumers may filter the registry by:

- `status?: ChequeStatus | ChequeStatus[]`
- `counterpartyId?: string`
- `chequeDateFrom?: string` / `chequeDateTo?: string` (ISO 8601, inclusive)
- `linkedTransactionId?: string`

Results MUST be returned sorted by `chequeDate` ascending unless otherwise specified.

## 7. Error Contract

| Code                        | Meaning                                          |
| --------------------------- | ------------------------------------------------ |
| `CHEQUE_VALIDATION_FAILED`  | One or more field validation rules failed.       |
| `CHEQUE_ILLEGAL_TRANSITION` | Requested status transition is not permitted.    |
| `CHEQUE_DUPLICATE`          | Duplicate active cheque number for counterparty. |
| `CHEQUE_NOT_FOUND`          | Referenced cheque id does not exist.             |

## 8. Reconciliation Note

This is a scoping/contract artifact for child issue #2426 under parent #1938.
The parent issue remains **open** until all sibling child issues under #1938 are
reconciled; this document alone does not close any issue.
