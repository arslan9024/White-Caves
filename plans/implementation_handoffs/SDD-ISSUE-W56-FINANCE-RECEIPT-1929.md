# Software Design Description

**Handoff ID:** SDD-ISSUE-W56-FINANCE-RECEIPT-1929
**Child issue:** #2462
**Parent issue:** #1929 (remains open — not closed by this handoff)
**Companion:** SRS-ISSUE-W56-FINANCE-RECEIPT-1929.md

## 1. Design Overview

Receipt requirement logic is implemented as a purely additive extension
appended to the end of the existing module
`src/features/finance/expenseClaims/expenseClaims.types.ts`, following the
module's established pattern of exported constants, type guards, and pure
validator functions (mirroring `isExpenseClaimStatus`,
`isExpenseCategory`, and `validateExpenseClaimDraft` already in the file).

No new file was introduced and no existing type was duplicated: the
already-defined `ExpenseAttachment` interface (id, fileName, mimeType,
sizeBytes, url, uploadedAt, uploadedByUserId) is reused as the receipt
evidence shape, avoiding a parallel `ReceiptAttachment` type that would
fragment the domain model between "attachments" and "receipts" for what
is conceptually the same artifact.

## 2. Data Model — No Breaking Changes

`ExpenseClaimLineItem.attachments: ReadonlyArray<ExpenseAttachment>` is
unchanged. The new logic reads this existing field; it does not add,
rename, or widen any field on `ExpenseClaimLineItem`, `ExpenseClaim`, or
`ExpenseAttachment`. Every pre-existing literal/object constructed against
these interfaces by prior callers or tests continues to type-check and
behave identically.

## 3. New Public API (appended, all additive)

| Symbol                                      | Kind           | Purpose                                                                              |
| ------------------------------------------- | -------------- | ------------------------------------------------------------------------------------ |
| `ALLOWED_RECEIPT_MIME_TYPES`                | `const array`  | Allow-listed MIME types for acceptable receipt evidence.                             |
| `ReceiptMimeType`                           | `type`         | Union of allow-listed MIME type strings, derived from the const array.               |
| `RECEIPT_REQUIRED_THRESHOLD`                | `const number` | Amount (25) at or below which no receipt is required.                                |
| `MAX_RECEIPT_FILE_SIZE_BYTES`               | `const number` | Upper bound (10 MiB) for an individual receipt attachment file.                      |
| `isReceiptMimeType(value)`                  | function       | Type guard narrowing `unknown` to `ReceiptMimeType`.                                 |
| `requiresReceipt(amount)`                   | function       | Threshold predicate; treats non-finite amounts as requiring a receipt (fail safe).   |
| `isValidReceiptAttachment(attachment)`      | function       | Structural validation of an `ExpenseAttachment` as receipt evidence.                 |
| `hasValidReceiptForLineItem(item)`          | function       | Whether a line item's `attachments` contain >=1 structurally valid receipt.          |
| `lineItemSatisfiesReceiptRequirement(item)` | function       | Combines threshold + validity for a single line item.                                |
| `validateExpenseClaimReceipts(lineItems)`   | function       | Returns the existing `ExpenseClaimValidationResult` discriminated type across items. |
| `summarizeReceiptStatus(lineItems)`         | function       | Human-readable diagnostic string across all supplied line items.                     |

## 4. Control Flow: Enforcement Point

`validateExpenseClaimReceipts` iterates the supplied line items and, for
each index `i` where `lineItemSatisfiesReceiptRequirement(item)` is
`false`, appends an error using the pre-existing
`ExpenseClaimValidationError` shape with `code: 'MISSING_ATTACHMENT'` and
`field: "lineItems[i].attachments"`. This is a **new standalone
validator**, not a modification of any pre-existing validator (e.g.
`validateExpenseClaimDraft`), so no prior validation behavior or message
changes for any existing caller.

```
for each lineItem:
  requiresReceipt(lineItem.amount.amount)?
    yes -> hasValidReceiptForLineItem(lineItem)?
             no  -> push MISSING_ATTACHMENT error
             yes -> compliant
    no  -> compliant (below/at threshold)
```

### Design decision: reuse `ExpenseAttachment` instead of a new receipt type

Rationale: the file already defines a general-purpose attachment shape
used by `ExpenseClaimLineItem.attachments`. Introducing a second,
structurally similar `ReceiptAttachment` type would create two competing
representations of "a file evidencing an expense," forcing future
consumers to reconcile which one a given line item actually carries.
Reusing `ExpenseAttachment` and layering pure predicate functions on top
(`isValidReceiptAttachment`, etc.) keeps a single source of truth for the
attachment shape while still letting receipt-specific rules (MIME
allow-list, max size, required-above-threshold) live as composable,
independently testable functions.

### Design decision: standalone validator vs. extending `validateExpenseClaimDraft`

`validateExpenseClaimDraft` validates a flat, single-line-item
`ExpenseClaimDraft` (used by a simple entry form) and does not operate on
multi-line-item claims or `ExpenseAttachment` arrays at all — extending it
would require changing its input type, which is a pre-existing exported
public contract used elsewhere. Instead, `validateExpenseClaimReceipts`
is a new, independent function operating on `ReadonlyArray<ExpenseClaimLineItem>`,
callable by any full-claim submission/approval pipeline (including a
future form component) without touching the draft validator's contract.

### Design decision: fail-safe on non-finite amounts

`requiresReceipt` returns `true` for `NaN`/`Infinity` rather than `false`,
so that a corrupted or unset amount never silently bypasses the receipt
requirement — the conservative behavior for a financial compliance rule
is to demand evidence when the amount cannot be established, not to
default to permissive.

## 5. Validation Rules for `isValidReceiptAttachment`

- `id`, `url`: non-blank after `trim()`.
- `mimeType`: must satisfy `isReceiptMimeType`, i.e. be one of
  `image/png`, `image/jpeg`, `image/webp`, `application/pdf` — a
  conservative allow-list matching common receipt capture formats (photo
  or scanned PDF), rejecting arbitrary/executable content types.
- `sizeBytes`: finite, `> 0`, and `<= MAX_RECEIPT_FILE_SIZE_BYTES`
  (10 MiB) — guards against empty/corrupt uploads and unbounded storage
  cost, without being so strict as to reject legitimate multi-page PDF
  scans.
- `uploadedAt`: must be `Date.parse`-able — reuses the same ISO-8601
  timestamp convention already established for other date-time fields in
  this file (`IsoDateTimeString`).

## 6. Testing Strategy (focused, not exhaustive-suite)

Recommended vitest coverage for a follow-up test file (not part of this
child issue's file scope), using
`import { describe, expect, it } from 'vitest'`:

- `requiresReceipt`: `false` at/below 25, `true` above 25, `true` for
  `NaN`/`Infinity`.
- `isValidReceiptAttachment`: `true` for a well-formed attachment; `false`
  for blank `id`/`url`, a disallowed `mimeType`, zero/negative/oversized
  `sizeBytes`, and an unparsable `uploadedAt`.
- `hasValidReceiptForLineItem` / `lineItemSatisfiesReceiptRequirement`:
  correct for line items with zero, one invalid, and one valid attachment,
  at amounts both above and at/below the threshold.
- `validateExpenseClaimReceipts`: a line item with `amount.amount > 25`
  and no valid attachment produces a `MISSING_ATTACHMENT` error at the
  correct `field` path; the same item with a valid attachment produces
  `{ isValid: true }` for the whole set; items at/below the threshold
  never require an attachment.
- `summarizeReceiptStatus`: stable string reflecting required/satisfied
  counts for representative line-item sets, and the "No line items
  require a receipt." message when nothing exceeds the threshold.

## 7. Completion Evidence

- File extended: `src/features/finance/expenseClaims/expenseClaims.types.ts`
  — every prior exported symbol (`IsoDateTimeString`, `IsoDateString`,
  `CurrencyCode`, `ExpenseClaimStatus`, `ExpenseCategory`,
  `ExpensePaymentMethod`, `Money`, `ExpenseAttachment`,
  `ExpenseClaimLineItem`, `ExpenseClaimApprovalStep`, `ExpenseClaim`,
  `CreateExpenseClaimLineItemInput`, `CreateExpenseClaimInput`,
  `UpdateExpenseClaimInput`, `ExpenseClaimFilter`, `ExpenseClaimSummary`,
  `ExpenseClaimValidationResult`, `ExpenseClaimValidationError`,
  `isExpenseClaimStatus`, `isExpenseCategory`,
  `TERMINAL_EXPENSE_CLAIM_STATUSES`, `EXPENSE_CLAIM_STATUS_TRANSITIONS`,
  `ExpenseClaimCategory`, `EXPENSE_CLAIM_CATEGORIES`, `ExpenseClaimDraft`,
  `ExpenseClaimDraftValidation`, `validateExpenseClaimDraft`) preserved
  verbatim in signature and behavior; only additive changes made.
- New exports added per Section 3 above, implementing FR-1 through FR-8 of
  the companion SRS.
- `npx tsc --noEmit --strict --skipLibCheck` run against the file
  completed with zero diagnostics (no `any` types, strict mode clean).
  (Full, non-`skipLibCheck` type-checking of the whole workspace surfaces
  one pre-existing, unrelated `@types/request`/`tough-cookie` declaration
  conflict in `node_modules`, outside this file and outside this child
  issue's scope.)
- Manual review confirms: all new functions are pure/side-effect-free, no
  existing field or function signature was altered, and the new
  `validateExpenseClaimReceipts` guard is a standalone function that does
  not alter any pre-existing validation path (`validateExpenseClaimDraft`
  and the status/category type guards are untouched).
- No dependencies added; no files touched outside the three listed in the
  child issue scope; no GitHub issues closed; parent issue #1929 left
  open.

## 8. Rollback Note

This change is purely additive to `expenseClaims.types.ts`:

1. **Revert:** delete the appended "Receipt capture & enforcement"
   section — i.e. `ALLOWED_RECEIPT_MIME_TYPES`, `ReceiptMimeType`,
   `RECEIPT_REQUIRED_THRESHOLD`, `MAX_RECEIPT_FILE_SIZE_BYTES`,
   `isReceiptMimeType`, `requiresReceipt`, `isValidReceiptAttachment`,
   `hasValidReceiptForLineItem`, `lineItemSatisfiesReceiptRequirement`,
   `validateExpenseClaimReceipts`, and `summarizeReceiptStatus`. Every
   other symbol in the file is untouched, so reverting is a clean
   truncation of the file back to its pre-change end (immediately after
   `validateExpenseClaimDraft`).
2. **Impact of rollback:** zero impact on any other module — nothing in
   the pre-existing exported surface was altered or removed, so no other
   call site can depend on the new behavior in a way that breaks on
   revert.
3. **No data migration required:** all new logic is pure/stateless and
   operates only on already-in-memory `ExpenseClaimLineItem`/
   `ExpenseAttachment` values; nothing is persisted by this file, so no
   schema/storage rollback is needed.
4. **No parent/child issue state changes to undo:** this handoff does not
   close or mutate any GitHub issue; #1929 remains open before and after.
