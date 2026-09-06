# Software Requirements Specification

**Handoff ID:** SRS-ISSUE-W56-FINANCE-RECEIPT-1929
**Child issue:** #2464
**Parent issue:** #1929 (remains open — not closed by this handoff)
**Domain:** Finance / Expense Claims — Receipt Enforcement (Week 56)

## 1. Purpose

Define the requirements for enforcing receipt evidence on expense claims
before they can be approved, extending the existing expense claim approval
workflow (`src/features/finance/expenseClaims/expenseClaimApproval.logic.ts`)
without altering its previously established approver eligibility or status
transition behavior.

## 2. Scope

### 2.1 In scope

- Pure domain logic for validating individual receipt attachments
  (structural well-formedness: identifier, URL, MIME type, file size,
  upload timestamp).
- A minor-amount threshold (`RECEIPT_REQUIRED_THRESHOLD`) below which claims
  may be approved without a receipt.
- Enforcement of the receipt requirement at the point an `approve` decision
  is applied to a claim (`applyApprovalDecision`).
- A pure function to attach a validated receipt to an immutable claim value
  (`attachReceipt`).
- A human-readable receipt-compliance summary (`summarizeReceiptStatus`).

### 2.2 Out of scope (explicitly excluded)

- Parent issue #1929 closure.
- Bulk GitHub mutation of any kind.
- Destructive database operations.
- Production secret rewrites.
- File upload/storage I/O, virus scanning, OCR/data-extraction from
  receipt images, and any persistence or notification side effects.
- Changes to approver role thresholds or the expense claim status machine
  established under issue #2391 / parent #1947.

## 3. Functional Requirements

| ID   | Requirement                                                                                                                                                                                                                                                                                                                                       |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-1 | The system SHALL define a `ReceiptAttachment` type capturing `id`, `url`, `mimeType`, `fileSizeBytes`, and `uploadedAt`.                                                                                                                                                                                                                          |
| FR-2 | The system SHALL expose `requiresReceipt(amount)` returning `true` when `amount` exceeds `RECEIPT_REQUIRED_THRESHOLD` (25, in the claim's currency).                                                                                                                                                                                              |
| FR-3 | The system SHALL expose `isValidReceipt(receipt)` validating that `id` and `url` are non-blank, `mimeType` is one of an allow-listed set (`image/png`, `image/jpeg`, `image/webp`, `application/pdf`), `fileSizeBytes` is a positive finite number not exceeding `MAX_RECEIPT_FILE_SIZE_BYTES` (10 MiB), and `uploadedAt` parses as a valid date. |
| FR-4 | The system SHALL expose `hasValidReceipt(claim)` and `satisfiesReceiptRequirement(claim)` to determine whether a claim's current receipts satisfy FR-2/FR-3.                                                                                                                                                                                      |
| FR-5 | `applyApprovalDecision` SHALL reject an `approve` decision with a `MISSING_RECEIPT` error when `satisfiesReceiptRequirement(claim)` is `false`, prior to any role-sufficiency check.                                                                                                                                                              |
| FR-6 | The system SHALL expose `attachReceipt(claim, receipt)` returning a new claim with the receipt appended when valid, or an `INVALID_RECEIPT` error result when not, without mutating the input claim.                                                                                                                                              |
| FR-7 | The system SHALL expose `summarizeReceiptStatus(claim)` producing a deterministic, human-readable string describing receipt requirement/compliance state.                                                                                                                                                                                         |
| FR-8 | All existing exported symbols, types, and behaviors of `expenseClaimApproval.logic.ts` (status machine, approver ranking, self-approval/duplicate-decision/insufficient-role/comment validation) SHALL remain unchanged and continue to pass their existing contracts.                                                                            |

## 4. Non-Functional Requirements

- **NFR-1 (Purity):** All new functions SHALL be pure — no I/O, no hidden
  mutation, no reliance on ambient state other than `Date.parse` for
  timestamp validation.
- **NFR-2 (Type safety):** Strict TypeScript; no `any` types; all new public
  surfaces fully typed with `readonly` data where practical.
- **NFR-3 (Backward compatibility):** `ExpenseClaim.receipts` is optional so
  existing callers/tests constructing claims without receipts continue to
  compile and behave as before for claims at or below the threshold.
- **NFR-4 (Determinism):** Given identical inputs, all functions return
  identical outputs; no randomness or wall-clock dependence except where
  the caller supplies timestamps.

## 5. Acceptance Criteria

- Implementation remains within the declared child scope (finance expense
  claim receipt enforcement logic only).
- Focused unit tests (vitest) for the new receipt functions and the
  `MISSING_RECEIPT` enforcement path pass, alongside pre-existing tests for
  this module.
- Completion evidence (test run summary) and a rollback note are recorded
  in the corresponding SDD handoff.
- Parent issue #1929 remains open pending reconciliation of all sibling
  child issues.

## 6. Traceability

- Parent: #1929 (Finance/Receipt workstream, Week 56).
- Child: #2464 (this handoff).
- Related prior work: #2391 / parent #1947 (approval state machine and
  approver eligibility — preserved, not modified).
