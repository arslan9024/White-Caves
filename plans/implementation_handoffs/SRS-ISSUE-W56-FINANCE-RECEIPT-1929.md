# Software Requirements Specification

**Handoff ID:** SRS-ISSUE-W56-FINANCE-RECEIPT-1929
**Child issue:** #2463
**Parent issue:** #1929 (remains open — not closed by this handoff)
**Domain:** Finance / Expense Claims — Receipt Capture UI (Week 56)

## 1. Purpose

Define the requirements for capturing and validating expense receipt
attachment metadata directly in the expense claim submission form
(`src/features/finance/expenseClaims/ExpenseClaimForm.tsx`), so a claimant
can attach one or more receipts to a line item before submitting a claim,
and is blocked from submitting a claim with a line item that requires a
receipt but does not yet have a valid one.

This is the UI-facing counterpart of the receipt-enforcement workstream
under parent #1929; it does not modify any backend approval logic (owned
separately, e.g. `expenseClaimApproval.logic.ts` under sibling child work).

## 2. Scope

### 2.1 In scope

- A `ReceiptAttachment` metadata type (id, url, mimeType, fileSizeBytes,
  uploadedAt) captured per line item.
- An optional `receipts` field on `ExpenseClaimLineItem`, backward
  compatible with existing callers that omit it.
- A minor-amount threshold (`RECEIPT_REQUIRED_THRESHOLD` = 25) below which
  a line item may be submitted without a receipt.
- Pure, exported validation helpers: `requiresReceipt`, `isValidReceipt`,
  `hasValidReceiptForLineItem`, `lineItemSatisfiesReceiptRequirement`,
  `summarizeReceiptStatus`.
- Integration of the receipt requirement into the existing
  `validateExpenseClaim` function (new `receipts` error key per line item),
  without changing any previously established validation message or
  behavior for description/category/amount/date fields.
- Form UI to add, edit, and remove receipt attachments per line item, and
  a claim-level receipt-compliance summary.

### 2.2 Out of scope (explicitly excluded)

- Parent issue #1929 closure.
- Bulk GitHub mutation of any kind.
- Destructive database operations.
- Production secret rewrites.
- Real file upload/storage transport, virus scanning, OCR/data extraction
  from receipt images, and any persistence or network side effects — this
  form only captures and validates attachment _metadata_.
- Changes to the expense claim approval workflow, approver eligibility, or
  claim status machine (owned by sibling child work under parent #1929 /
  #1947).

## 3. Functional Requirements

| ID   | Requirement                                                                                                                                                                                                                                                                                                                                   |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-1 | The system SHALL define a `ReceiptAttachment` type capturing `id`, `url`, `mimeType`, `fileSizeBytes`, and `uploadedAt`.                                                                                                                                                                                                                      |
| FR-2 | The system SHALL expose `requiresReceipt(amount)` returning `true` when `amount` exceeds `RECEIPT_REQUIRED_THRESHOLD` (25) or is non-finite.                                                                                                                                                                                                  |
| FR-3 | The system SHALL expose `isValidReceipt(receipt)` validating that `id`/`url` are non-blank, `mimeType` is one of an allow-listed set (`image/png`, `image/jpeg`, `image/webp`, `application/pdf`), `fileSizeBytes` is a positive finite number not exceeding `MAX_RECEIPT_FILE_SIZE_BYTES` (10 MiB), and `uploadedAt` parses as a valid date. |
| FR-4 | The system SHALL expose `hasValidReceiptForLineItem(item)` and `lineItemSatisfiesReceiptRequirement(item)` to determine whether a line item's current receipts satisfy FR-2/FR-3.                                                                                                                                                             |
| FR-5 | `validateExpenseClaim` SHALL populate a `receipts` error for any line item that requires a receipt but does not have one, surfaced alongside the item's other field errors.                                                                                                                                                                   |
| FR-6 | The form SHALL let a user add, edit (URL/MIME type/file size/uploaded-at), and remove receipt attachments per line item without page reload.                                                                                                                                                                                                  |
| FR-7 | The system SHALL expose `summarizeReceiptStatus(values)` producing a deterministic, human-readable string describing how many line items requiring a receipt currently have one, rendered in the form.                                                                                                                                        |
| FR-8 | All existing exported symbols, types, and behaviors of `ExpenseClaimForm.tsx` (categories, validation, totals calculation, submit/cancel handling) SHALL remain unchanged and continue to pass their existing contracts.                                                                                                                      |

## 4. Non-Functional Requirements

- **NFR-1 (Purity):** All new validation/summary functions SHALL be pure —
  no I/O, no hidden mutation, no reliance on ambient state other than
  `Date.parse` for timestamp validation.
- **NFR-2 (Type safety):** Strict TypeScript; no `any` types; all new
  public surfaces fully typed.
- **NFR-3 (Backward compatibility):** `ExpenseClaimLineItem.receipts` is
  optional so existing callers/tests constructing line items without
  receipts continue to compile and behave as before for items at or below
  the threshold.
- **NFR-4 (Determinism):** Given identical inputs, all functions return
  identical outputs; no randomness or wall-clock dependence except where
  the caller supplies timestamps.
- **NFR-5 (Accessibility):** New receipt inputs use associated `<label>`
  elements and `role="group"`/`role="alert"` conventions consistent with
  the rest of the form.

## 5. Acceptance Criteria

- Implementation remains within the declared child scope (expense claim
  receipt capture UI only, in `ExpenseClaimForm.tsx`).
- Focused unit tests (vitest) for the new receipt helpers and the
  `receipts` validation path pass, alongside pre-existing tests for this
  component.
- Completion evidence (type-check/test run summary) and a rollback note
  are recorded in the corresponding SDD handoff.
- Parent issue #1929 remains open pending reconciliation of all sibling
  child issues.

## 6. Traceability

- Parent: #1929 (Finance/Receipt workstream, Week 56).
- Child: #2463 (this handoff).
- Related sibling work: expense claim approval-side receipt enforcement
  logic under the same parent (out of scope here; not modified).
