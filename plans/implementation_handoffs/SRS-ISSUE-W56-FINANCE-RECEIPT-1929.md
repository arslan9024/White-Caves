# Software Requirements Specification

**Handoff ID:** SRS-ISSUE-W56-FINANCE-RECEIPT-1929
**Child issue:** #2462
**Parent issue:** #1929 (remains open — not closed by this handoff)
**Domain:** Finance / Expense Claims — Receipt Requirement Domain Types (Week 56)

## 1. Purpose

Define, at the domain-type level, when an expense claim line item requires
a receipt and how to determine whether its existing attachments satisfy
that requirement. This extends
`src/features/finance/expenseClaims/expenseClaims.types.ts` with pure,
exported types and validation helpers reusable by any consumer (forms,
approval logic, reporting) without introducing UI or transport concerns.

This is the domain/type-layer counterpart of the receipt-enforcement
workstream under parent #1929; it does not modify any form component,
backend approval logic, or persistence layer (owned separately by sibling
child issues under the same parent).

## 2. Scope

### 2.1 In scope

- A `RECEIPT_REQUIRED_THRESHOLD` amount constant (25) at or below which a
  line item may be submitted without a receipt.
- An `ALLOWED_RECEIPT_MIME_TYPES` allow-list and derived `ReceiptMimeType`
  union, plus `MAX_RECEIPT_FILE_SIZE_BYTES` (10 MiB) for validating that an
  existing `ExpenseAttachment` is acceptable receipt evidence.
- Pure, exported helpers: `isReceiptMimeType`, `requiresReceipt`,
  `isValidReceiptAttachment`, `hasValidReceiptForLineItem`,
  `lineItemSatisfiesReceiptRequirement`, `validateExpenseClaimReceipts`,
  `summarizeReceiptStatus`.
- Reuse of the pre-existing `ExpenseAttachment` / `ExpenseClaimLineItem` /
  `ExpenseClaimValidationResult` / `ExpenseClaimValidationError` types
  already defined in `expenseClaims.types.ts` — no duplicate or competing
  attachment shape is introduced.

### 2.2 Out of scope (explicitly excluded)

- Parent issue #1929 closure.
- Bulk GitHub mutation of any kind.
- Destructive database operations.
- Production secret rewrites.
- Any form/UI component changes (e.g. `ExpenseClaimForm.tsx`), real file
  upload/storage transport, virus scanning, or OCR/data extraction.
- Changes to the expense claim approval workflow, approver eligibility, or
  the claim status transition machine already defined in this file.

## 3. Functional Requirements

| ID   | Requirement                                                                                                                                                                                                                                                                                         |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-1 | The system SHALL expose `RECEIPT_REQUIRED_THRESHOLD` (25) as the amount above which a receipt is required.                                                                                                                                                                                          |
| FR-2 | The system SHALL expose `requiresReceipt(amount)` returning `true` when `amount` exceeds the threshold or is non-finite (fail safe).                                                                                                                                                                |
| FR-3 | The system SHALL expose `ALLOWED_RECEIPT_MIME_TYPES`/`ReceiptMimeType` and `isReceiptMimeType(value)` to constrain acceptable receipt file types.                                                                                                                                                   |
| FR-4 | The system SHALL expose `isValidReceiptAttachment(attachment)` validating an `ExpenseAttachment`'s `id`/`url` (non-blank), `mimeType` (allow-listed), `sizeBytes` (0 < n <= 10 MiB), and `uploadedAt` (parseable date).                                                                             |
| FR-5 | The system SHALL expose `hasValidReceiptForLineItem(item)` and `lineItemSatisfiesReceiptRequirement(item)` combining FR-2/FR-4 for a single line item.                                                                                                                                              |
| FR-6 | The system SHALL expose `validateExpenseClaimReceipts(lineItems)` returning the existing `ExpenseClaimValidationResult` discriminated type, with one `MISSING_ATTACHMENT` error per non-compliant line item.                                                                                        |
| FR-7 | The system SHALL expose `summarizeReceiptStatus(lineItems)` producing a deterministic, human-readable compliance summary string.                                                                                                                                                                    |
| FR-8 | All existing exported symbols, types, constants, and functions already present in `expenseClaims.types.ts` (e.g. `ExpenseClaim`, `ExpenseClaimLineItem`, `EXPENSE_CLAIM_STATUS_TRANSITIONS`, `validateExpenseClaimDraft`) SHALL remain unchanged and continue to type-check and behave identically. |

## 4. Non-Functional Requirements

- **NFR-1 (Purity):** All new functions SHALL be pure — no I/O, no hidden
  mutation, no reliance on ambient state other than `Date.parse` for
  timestamp validation.
- **NFR-2 (Type safety):** Strict TypeScript; no `any` types; all new
  public surfaces fully typed.
- **NFR-3 (Backward compatibility):** No existing field, type, or function
  signature is altered; new symbols are purely additive appended to the
  end of the file.
- **NFR-4 (Determinism):** Given identical inputs, all functions return
  identical outputs; no randomness or wall-clock dependence except where
  the caller supplies timestamps.
- **NFR-5 (Reuse):** New helpers operate on the pre-existing
  `ExpenseAttachment` shape rather than introducing a parallel/duplicate
  receipt-attachment type.

## 5. Acceptance Criteria

- Implementation remains within the declared child scope (receipt
  requirement domain types/helpers in `expenseClaims.types.ts` only).
- Focused unit tests (vitest, `import { describe, expect, it } from 'vitest'`)
  for the new helpers pass, alongside pre-existing behavior of the file
  (verified via `tsc --noEmit --strict --skipLibCheck`, zero diagnostics).
- Completion evidence (type-check summary) and a rollback note are
  recorded in the companion SDD handoff.
- Parent issue #1929 remains open pending reconciliation of all sibling
  child issues.

## 6. Traceability

- Parent: #1929 (Finance/Receipt workstream, Week 56).
- Child: #2462 (this handoff).
- Related sibling work: expense claim receipt capture UI (out of scope
  here; tracked separately under the same parent workstream).
