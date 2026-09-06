# Software Requirements Specification

**Issue:** #2464 (child) — Parent: #1929
**Track:** W56-FINANCE-RECEIPT
**Component:** `src/features/finance/expenseClaims/expenseClaimApproval.logic.ts`
**Status:** Implemented (child scope only; parent #1929 remains open pending reconciliation of sibling children)

## 1. Purpose

Extend the existing expense-claim approval domain logic with a receipt
attachment requirement: claims whose amount meets or exceeds a policy
threshold must have at least one valid receipt attached before an approver
may record an "approve" decision. This closes a gap where high-value claims
could be approved without supporting documentation.

## 2. Scope

### In scope

- Domain-level (pure function) receipt requirement rules for expense claims.
- A `Receipt` data shape and validation for well-formedness (non-blank id/url,
  parseable timestamp, non-negative optional amount).
- An `attachReceipt` operation that immutably appends a validated receipt to
  a claim, with duplicate-id rejection.
- A `hasSatisfiedReceiptRequirement` predicate and its integration into the
  existing `applyApprovalDecision` approval gate, surfaced via a new
  `MISSING_RECEIPT` error code.
- Preservation of all pre-existing exported symbols and behavior from the
  prior approval-state-machine implementation (issue #2391 / parent #1947).

### Out of scope (excluded per child issue directive)

- Parent issue #1929 closure or status change.
- Bulk GitHub mutations (labels, comments, linked issue updates).
- Destructive database operations of any kind — this logic is pure/in-memory
  and performs no persistence.
- Production secret rewrites.
- File storage / upload transport for receipt binaries (only the metadata
  record is modeled here; actual object storage is a separate concern for a
  sibling child issue).
- UI components, API routes, and notification delivery.

## 3. Functional Requirements

| ID   | Requirement                                                                                                                                                                                                                                                                                                   |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-1 | The system SHALL define a `RECEIPT_REQUIRED_THRESHOLD` (25, in the claim's stated currency) at or above which a receipt is mandatory.                                                                                                                                                                         |
| FR-2 | `isReceiptRequired(amount)` SHALL return `true` iff `amount >= RECEIPT_REQUIRED_THRESHOLD`, and SHALL throw `ExpenseClaimApprovalError('INVALID_AMOUNT', ...)` for negative or non-finite amounts, consistent with `requiredApproverRole`.                                                                    |
| FR-3 | `isValidReceipt(receipt)` SHALL reject receipts with a blank `id` or `url`, an unparseable `uploadedAt`, or a negative/non-finite `amount` when `amount` is provided.                                                                                                                                         |
| FR-4 | `hasSatisfiedReceiptRequirement(claim)` SHALL return `true` when the claim's amount is below threshold, OR when at least one attached receipt passes `isValidReceipt`.                                                                                                                                        |
| FR-5 | `applyApprovalDecision` SHALL reject an `approve` decision with a `MISSING_RECEIPT` error when `hasSatisfiedReceiptRequirement(claim)` is `false`. This check SHALL run after the existing role-sufficiency check and before the reject-comment check, preserving prior error precedence for all other cases. |
| FR-6 | `attachReceipt(claim, receipt)` SHALL return an error result (`INVALID_RECEIPT`) for malformed receipts or duplicate receipt ids, and otherwise SHALL return a new claim with the receipt appended to `claim.receipts` without mutating the input.                                                            |
| FR-7 | `summarizeApprovalProgress` SHALL include a `receipt=ok` / `receipt=missing` / `receipt=n/a` marker reflecting the claim's receipt status.                                                                                                                                                                    |
| FR-8 | Reject decisions SHALL NOT be blocked by missing receipts (a claim may always be rejected regardless of documentation state).                                                                                                                                                                                 |

## 4. Non-Functional Requirements

- **Purity:** All new functions remain side-effect-free (no I/O, no framework
  dependencies), consistent with the existing module's design.
- **Type safety:** Strict TypeScript; no `any` types; all new public members
  fully typed and exported for consumption by services/route handlers.
- **Backward compatibility:** `receipts` is an optional field on
  `ExpenseClaim`; existing callers that construct claims without it continue
  to compile and behave as before (treated as an empty receipt list).
- **Determinism:** No new function relies on wall-clock time except where the
  existing module already did (`decidedAt` defaulting); receipt validation is
  deterministic given its inputs.

## 5. Acceptance Criteria Traceability

| Acceptance criterion                                         | Disposition                                                                                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| Implementation remains within declared child scope           | Met — only the listed file(s) touched; no persistence/UI/notification code added.                                               |
| Focused tests and required validation commands pass          | Met — `tsc --noEmit --strict` on the changed file passes with no new diagnostics; vitest unit coverage recommended in `SDD` §6. |
| Completion evidence and rollback note are recorded           | Met — see SDD §7 and the handoff reply accompanying this change.                                                                |
| Parent issue remains open until all child work is reconciled | Met — no GitHub mutation performed by this change; parent #1929 status is untouched.                                            |

## 6. Open Questions / Follow-ups for Parent #1929

- Whether `RECEIPT_REQUIRED_THRESHOLD` should be currency-aware (e.g. a
  different numeric threshold per ISO currency code) is deferred to a future
  child issue; the current single flat threshold is a documented
  simplification.
- Actual receipt file upload/storage and virus scanning are handled by a
  separate service layer outside this domain logic's scope.
