# Software Design Description

**Handoff ID:** SDD-ISSUE-W56-FINANCE-RECEIPT-1929
**Child issue:** #2463
**Parent issue:** #1929 (remains open — not closed by this handoff)
**Companion:** SRS-ISSUE-W56-FINANCE-RECEIPT-1929.md

## 1. Design Overview

Receipt capture is implemented as an additive extension inside the
existing component module
`src/features/finance/expenseClaims/ExpenseClaimForm.tsx`, following the
module's established style: pure exported validation helpers, a
controlled-component form using `useState`/`useCallback`, and
`data-testid`/`role="alert"` conventions already used for line items.

No new module or file was introduced for the logic itself — receipt
metadata is a natural per-line-item concern within the same form that
already owns line item description/category/amount/date, and splitting it
into a separate component would fragment a single cohesive submission
form without any reuse benefit at this scope.

## 2. Data Model Changes

```ts
export type ReceiptMimeType = 'image/png' | 'image/jpeg' | 'image/webp' | 'application/pdf';

export interface ReceiptAttachment {
  id: string;
  url: string;
  mimeType: ReceiptMimeType | string;
  fileSizeBytes: number;
  uploadedAt: string; // ISO-8601 timestamp
}

export interface ExpenseClaimLineItem {
  // ...existing fields unchanged (id, description, category, amount, incurredOn)...
  receipts?: readonly ReceiptAttachment[];
}
```

`receipts` is optional and every read defaults via `item.receipts ?? []`,
so every pre-existing `ExpenseClaimLineItem` literal used by prior tests
continues to type-check and behave identically for items at or below the
no-receipt threshold. `createEmptyLineItem()` now initializes `receipts`
to `[]` for newly added line items, which is a non-breaking additive
change (the field was previously absent/undefined, now present-but-empty).

## 3. New Public API

| Symbol                                      | Kind           | Purpose                                                                            |
| ------------------------------------------- | -------------- | ---------------------------------------------------------------------------------- |
| `ALLOWED_RECEIPT_MIME_TYPES`                | `const array`  | Allow-listed MIME types for a receipt file.                                        |
| `RECEIPT_REQUIRED_THRESHOLD`                | `const number` | Amount (25) at or below which no receipt is required.                              |
| `MAX_RECEIPT_FILE_SIZE_BYTES`               | `const number` | Upper bound (10 MiB) for an individual receipt file.                               |
| `ReceiptMimeType`                           | `type`         | Union of allow-listed MIME type strings.                                           |
| `ReceiptAttachment`                         | `interface`    | Shape of a single receipt attachment's metadata.                                   |
| `requiresReceipt(amount)`                   | function       | Threshold predicate; treats non-finite amounts as requiring a receipt (fail safe). |
| `isValidReceipt(receipt)`                   | function       | Structural validation predicate (id/url/mimeType/size/timestamp).                  |
| `hasValidReceiptForLineItem(item)`          | function       | Whether a line item carries >=1 structurally valid receipt.                        |
| `lineItemSatisfiesReceiptRequirement(item)` | function       | Combines threshold + validity for a single line item.                              |
| `summarizeReceiptStatus(values)`            | function       | Human-readable diagnostic string across all line items in the claim.               |

## 4. Control Flow: Enforcement Point

`validateExpenseClaim` gains one additional per-line-item check, inserted
**after** the existing `incurredOn` date check and **before** the
`Object.keys(itemErrors).length > 0` aggregation:

```
description blank?            -> itemErrors.description
category invalid?             -> itemErrors.category
amount not positive?          -> itemErrors.amount
incurredOn invalid?           -> itemErrors.incurredOn
!lineItemSatisfiesReceiptRequirement(item)  -> itemErrors.receipts   [NEW]
```

### Design decision: per-line-item vs. per-claim receipts

Receipts are attached at the **line item** level rather than once per
claim. Rationale: a claim may combine several expenses of different
amounts and dates (e.g. one $15 taxi ride and one $120 hotel night); only
the line item(s) whose amount exceeds `RECEIPT_REQUIRED_THRESHOLD` should
require a receipt, and attaching a single set of receipts to a multi-item
claim would not identify which expense each receipt evidences. Per-item
attachment keeps the requirement precise and keeps `hasValidReceiptForLineItem`
free of ambiguity about which receipt corresponds to which expense.

### Design decision: metadata-only capture

The form captures only receipt _metadata_ (URL, declared MIME type,
declared file size, upload timestamp) rather than performing a real file
upload. Rationale: actual file transport/storage is explicitly out of
scope per the parent workstream's exclusions, and decoupling metadata
capture from transport lets this form be wired to any future upload
mechanism (e.g. a pre-signed URL flow) without further changes to its
validation contract.

## 5. Validation Rules for `isValidReceipt`

- `id`, `url`: non-blank after `trim()`.
- `mimeType`: must be one of `image/png`, `image/jpeg`, `image/webp`,
  `application/pdf` — a conservative allow-list matching common receipt
  capture formats (photo or scanned PDF), rejecting arbitrary/executable
  content types.
- `fileSizeBytes`: finite, `> 0`, and `<= MAX_RECEIPT_FILE_SIZE_BYTES`
  (10 MiB) — guards against empty/corrupt uploads and unbounded storage
  cost, without being so strict as to reject legitimate multi-page PDF
  scans.
- `uploadedAt`: must be `Date.parse`-able — reuses the same ISO-8601
  timestamp convention already used elsewhere in the claim form (e.g.
  `incurredOn`).

## 6. UI Changes

Each line item block gains a nested `role="group"` region listing its
receipts, each rendered with labeled inputs for URL, file type (`<select>`
constrained to `ALLOWED_RECEIPT_MIME_TYPES`), file size, and upload
timestamp, plus "Add receipt"/"Remove receipt" buttons mirroring the
existing "Add line item"/"Remove line item" pattern. A claim-level
`data-testid="expense-claim-receipt-summary"` element renders
`summarizeReceiptStatus(values)` so the claimant sees compliance status
before submitting.

## 7. Error Handling

The new `receipts` validation message is surfaced through the existing
`itemErrors` mechanism (`Partial<Record<keyof ExpenseClaimLineItem, string>>`),
which already type-includes a `receipts` key once the field was added to
`ExpenseClaimLineItem` — no new error type or error-handling mechanism was
introduced, keeping a single validation-error surface for the whole form.

## 8. Testing Strategy (focused, not exhaustive-suite)

Recommended vitest coverage for a follow-up test file, using
`import { describe, expect, it } from 'vitest'`:

- `requiresReceipt`: returns `false` at/below 25, `true` above 25, and
  `true` for non-finite amounts.
- `isValidReceipt`: true for a well-formed receipt; false for blank
  id/url, disallowed mime type, zero/negative/oversized `fileSizeBytes`,
  and unparsable `uploadedAt`.
- `hasValidReceiptForLineItem` / `lineItemSatisfiesReceiptRequirement`:
  correct for items with zero, one invalid, and one valid receipt.
- `validateExpenseClaim`: a line item with amount > 25 and no receipts
  produces a `receipts` error; the same item with a valid receipt attached
  produces no `receipts` error; items at/below 25 never require a receipt.
- `summarizeReceiptStatus`: stable string reflecting required/satisfied
  counts for representative claims, and the "No line items require a
  receipt." message when no item exceeds the threshold.

## 9. Completion Evidence

- File extended: `src/features/finance/expenseClaims/ExpenseClaimForm.tsx`
  — all prior exports (`ExpenseCategory`, `EXPENSE_CATEGORIES`,
  `ExpenseClaimLineItem`, `ExpenseClaimFormValues`, `ExpenseClaimFormErrors`,
  `ExpenseClaimFormProps`, `validateExpenseClaim`, `hasExpenseClaimErrors`,
  `calculateExpenseClaimTotal`, `ExpenseClaimForm`, default export)
  preserved verbatim in signature and behavior; only additive changes made.
- New exports added per Section 3 above, implementing FR-1 through FR-7 of
  the companion SRS.
- `npx tsc --noEmit --jsx react-jsx --strict` run against the file
  completed with zero diagnostics (no `any` types, strict mode clean).
- Manual review confirms: all new functions pure/side-effect-free,
  immutability preserved (receipt add/update/remove handlers spread
  rather than mutate state), and the new `receipts` validation guard does
  not alter any pre-existing error path for line items at or below the
  no-receipt threshold.
- No dependencies added; no files touched outside the three listed in the
  child issue scope; no GitHub issues closed; parent issue #1929 left
  open.

## 10. Rollback Note

This change is purely additive to `ExpenseClaimForm.tsx`:

1. **Revert:** remove the `ReceiptMimeType`/`ReceiptAttachment` types, the
   `ALLOWED_RECEIPT_MIME_TYPES`/`RECEIPT_REQUIRED_THRESHOLD`/
   `MAX_RECEIPT_FILE_SIZE_BYTES` constants, the `receipts?` field on
   `ExpenseClaimLineItem`, the new exported functions
   (`requiresReceipt`, `isValidReceipt`, `hasValidReceiptForLineItem`,
   `lineItemSatisfiesReceiptRequirement`, `summarizeReceiptStatus`), the
   single `itemErrors.receipts` guard clause in `validateExpenseClaim`,
   the `receipts: []` initializer in `createEmptyLineItem`, the
   `createEmptyReceipt`/`createReceiptId` helpers, the
   `addReceipt`/`updateReceipt`/`removeReceipt` callbacks, and the
   receipt UI block plus claim-level summary `<div>` in the rendered form.
2. **Impact of rollback:** zero impact on any other module — nothing in
   the pre-existing exported surface was altered or removed, so no other
   call site can depend on the new behavior in a way that breaks on
   revert. Claims that were previously submittable without receipts (i.e.,
   under the in-repo behavior prior to this change) remain submittable
   identically after rollback.
3. **No data migration required:** `receipts` is optional, client-side
   form state only, and was never persisted by this component (persistence
   is explicitly out of scope), so no schema/storage rollback is needed.
4. **No parent/child issue state changes to undo:** this handoff does not
   close or mutate any GitHub issue; #1929 remains open before and after.
