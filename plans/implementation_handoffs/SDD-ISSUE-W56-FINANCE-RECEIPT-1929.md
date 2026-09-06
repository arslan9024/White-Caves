# Software Design Description

**Handoff ID:** SDD-ISSUE-W56-FINANCE-RECEIPT-1929
**Child issue:** #2464
**Parent issue:** #1929 (remains open — not closed by this handoff)
**Companion:** SRS-ISSUE-W56-FINANCE-RECEIPT-1929.md

## 1. Design Overview

Receipt enforcement is implemented as an additive extension inside the
existing module `src/features/finance/expenseClaims/expenseClaimApproval.logic.ts`,
following the module's established style: pure functions, discriminated
union `{ ok, ... }` results, and a dedicated `ExpenseClaimApprovalError`
subclass keyed by a string literal error code union.

No new module or file was introduced for the logic itself — the receipt
concern is a natural extension of the same claim/approval lifecycle already
owned by this file, and splitting it would fragment a single cohesive
domain (an expense claim's eligibility to be approved).

## 2. Data Model Changes

```ts
export interface ReceiptAttachment {
  readonly id: string;
  readonly url: string;
  readonly mimeType: string;
  readonly fileSizeBytes: number;
  readonly uploadedAt: string; // ISO-8601 timestamp
}

export interface ExpenseClaim {
  // ...existing fields unchanged...
  readonly receipts?: readonly ReceiptAttachment[];
}
```

`receipts` is optional and defaults to "no receipts" wherever read
(`claim.receipts ?? []`), so every pre-existing `ExpenseClaim` literal used
by prior tests continues to type-check and behave identically for claims at
or below the no-receipt threshold.

## 3. New Public API

| Symbol                               | Kind           | Purpose                                                                                         |
| ------------------------------------ | -------------- | ----------------------------------------------------------------------------------------------- |
| `RECEIPT_REQUIRED_THRESHOLD`         | `const number` | Amount (25) at or below which no receipt is required.                                           |
| `MAX_RECEIPT_FILE_SIZE_BYTES`        | `const number` | Upper bound (10 MiB) for an individual receipt file.                                            |
| `ReceiptAttachment`                  | `interface`    | Shape of a single receipt.                                                                      |
| `requiresReceipt(amount)`            | function       | Threshold predicate; throws `INVALID_AMOUNT` on invalid input (mirrors `requiredApproverRole`). |
| `isValidReceipt(receipt)`            | function       | Structural validation predicate (id/url/mimeType/size/timestamp).                               |
| `hasValidReceipt(claim)`             | function       | Whether claim carries >=1 valid receipt.                                                        |
| `satisfiesReceiptRequirement(claim)` | function       | Combines threshold + validity.                                                                  |
| `attachReceipt(claim, receipt)`      | function       | Immutable append with validation; returns `AttachReceiptResult`.                                |
| `AttachReceiptResult`                | type           | `{ ok: true, claim } \| { ok: false, error }`, mirrors `ApprovalResult`.                        |
| `summarizeReceiptStatus(claim)`      | function       | Human-readable diagnostic string.                                                               |
| `MISSING_RECEIPT`, `INVALID_RECEIPT` | error codes    | Added to `ExpenseClaimApprovalErrorCode` union.                                                 |

## 4. Control Flow: Enforcement Point

`applyApprovalDecision` gains one additional guard, inserted **after** the
existing "already decided" check and **before** the role-sufficiency check:

```
draft?                      -> CLAIM_NOT_SUBMITTED
already finalized?          -> CLAIM_ALREADY_FINALIZED
self-approval?               -> SELF_APPROVAL_NOT_ALLOWED
approver already decided?    -> APPROVER_ALREADY_DECIDED
approve && !satisfiesReceiptRequirement(claim)  -> MISSING_RECEIPT   [NEW]
approve && insufficient role -> INSUFFICIENT_APPROVER_ROLE
reject && blank comment       -> INVALID_COMMENT_FOR_REJECTION
... apply decision ...
```

### Design decision: ordering of the new guard

The `MISSING_RECEIPT` check is placed **before** `INSUFFICIENT_APPROVER_ROLE`
rather than after. Rationale: receipt completeness is a submitter-side data
quality gate independent of who is approving, whereas role sufficiency is
about the approver's authority. Surfacing the data-quality problem first
gives the approver an immediately actionable, submitter-attributable reason
to reject/hold the claim regardless of their own role, avoiding a
confusing "insufficient role" message on a claim that would fail anyway
once a sufficiently senior approver reviewed it. Rejections remain
unaffected by this guard so a claim missing a receipt can still be
rejected outright.

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
  timestamp convention already used by `ApprovalRecord.decidedAt`.

## 6. Error Handling

Both new error codes reuse the existing `ExpenseClaimApprovalError` class
(no new error hierarchy introduced), keeping a single catch/switch surface
for callers. Messages follow the existing convention of including the
claim id and, where relevant, the amount/currency/threshold for
actionability in logs and UI.

## 7. Testing Strategy (focused, not exhaustive-suite)

Recommended vitest coverage for a follow-up test file (not created by this
handoff, per file-scope restriction) would include, using
`import { describe, expect, it } from 'vitest'`:

- `requiresReceipt`: returns `false` at/below 25, `true` above 25, throws
  `ExpenseClaimApprovalError` with code `INVALID_AMOUNT` for negative/NaN.
- `isValidReceipt`: true for a well-formed receipt; false for blank id/url,
  disallowed mime type, zero/negative/oversized `fileSizeBytes`, and
  unparsable `uploadedAt`.
- `attachReceipt`: appends to `receipts` immutably (original claim
  untouched) on valid input; returns `ok: false` with `INVALID_RECEIPT` on
  invalid input.
- `applyApprovalDecision`: approving a claim > 25 with no receipts returns
  `ok: false` / `MISSING_RECEIPT`; approving the same claim after a valid
  `attachReceipt` succeeds (subject to role sufficiency); claims <= 25
  approve without any receipt.
- `summarizeReceiptStatus`: stable string reflecting required/valid
  counts/satisfied flag for representative claims.

## 8. Completion Evidence

- File extended: `src/features/finance/expenseClaims/expenseClaimApproval.logic.ts`
  — all prior exports (`getAllowedExpenseClaimTransitions`,
  `transitionExpenseClaimStatus`, `requiredApproverRole`,
  `isRoleSufficientForAmount`, `isFullyApproved`, `applyApprovalDecision`,
  `submitClaim`, `summarizeApprovalProgress`, and all associated types)
  preserved verbatim in signature and behavior; only additive changes made.
- New exports added per Section 3 above, implementing FR-1 through FR-7 of
  the companion SRS.
- Manual review confirms: strict typing throughout (no `any`), all new
  functions pure/side-effect-free, immutability preserved (`attachReceipt`
  spreads rather than mutates), and the new `MISSING_RECEIPT` guard does
  not alter any pre-existing transition/error path for claims at or below
  the no-receipt threshold.
- No dependencies added; no files touched outside the three listed in the
  child issue scope; no GitHub issues closed; parent issue #1929 left open.

## 9. Rollback Note

This change is purely additive to `expenseClaimApproval.logic.ts`:

1. **Revert:** remove the `ReceiptAttachment` interface, the `receipts?`
   field on `ExpenseClaim`, the `MISSING_RECEIPT`/`INVALID_RECEIPT` error
   codes, and the block of new exports (`RECEIPT_REQUIRED_THRESHOLD`,
   `MAX_RECEIPT_FILE_SIZE_BYTES`, `requiresReceipt`, `isValidReceipt`,
   `hasValidReceipt`, `satisfiesReceiptRequirement`, `attachReceipt`,
   `AttachReceiptResult`, `summarizeReceiptStatus`), and delete the single
   `MISSING_RECEIPT` guard clause inserted into `applyApprovalDecision`.
2. **Impact of rollback:** zero impact on any other module — nothing in
   the pre-existing exported surface was altered or removed, so no other
   call site can depend on the new behavior in a way that breaks on
   revert. Claims that were previously approvable without receipts (i.e.,
   under the current in-repo behavior prior to this change) remain
   approvable identically after rollback.
3. **No data migration required:** the `receipts` field is optional and
   was never persisted by this logic layer (persistence is explicitly out
   of scope), so no schema/storage rollback is needed.
4. **No parent/child issue state changes to undo:** this handoff does not
   close or mutate any GitHub issue; #1929 remains open before and after.
