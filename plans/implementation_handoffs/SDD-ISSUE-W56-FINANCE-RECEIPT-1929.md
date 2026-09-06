# Software Design Document

**Issue:** #2464 (child) — Parent: #1929
**Track:** W56-FINANCE-RECEIPT
**Component:** `src/features/finance/expenseClaims/expenseClaimApproval.logic.ts`
**Companion:** `SRS-ISSUE-W56-FINANCE-RECEIPT-1929.md`

## 1. Context

`expenseClaimApproval.logic.ts` already implements a pure, side-effect-free
approval state machine for expense claims (added under issue #2391, parent
#1947): status transitions, approver role sufficiency by amount tier, and
`applyApprovalDecision` as the single entry point that validates and applies
an approver's decision. This design extends that module — it does not
replace or fork it — to add a receipt-attachment precondition for approvals,
per parent issue #1929's finance-receipt initiative.

## 2. Design Goals

1. **Additive only.** Every existing exported type, function, constant, and
   error code from the pre-existing implementation remains present with
   unchanged signatures and behavior for all previously-covered code paths.
2. **Consistent idioms.** New functions follow the same patterns already
   established in the file: pure functions, discriminated-union
   `ApprovalResult` returns, `ExpenseClaimApprovalError` with a typed `code`,
   and immutable claim updates via object spread.
3. **Fail closed, not silent.** A claim that requires a receipt and lacks one
   cannot be silently approved; the caller receives a typed, actionable
   error (`MISSING_RECEIPT`) rather than an unexplained no-op.
4. **Backward-compatible data model.** Adding `receipts` as an _optional_
   field on `ExpenseClaim` means existing object literals and fixtures built
   before this change continue to type-check and behave identically (treated
   as "no receipts attached").

## 3. Data Model Changes

```ts
export interface Receipt {
  readonly id: string;
  readonly url: string;
  readonly uploadedAt: string; // ISO-8601 timestamp
  readonly amount?: number;
}

export interface ExpenseClaim {
  // ...pre-existing fields unchanged...
  readonly receipts?: readonly Receipt[];
}
```

`receipts` is optional (not defaulted to `[]` at the type level) so that
callers who never touch receipts are unaffected; all internal logic treats
`claim.receipts ?? []` as the canonical list.

## 4. New Public API Surface

| Symbol                                   | Kind        | Responsibility                                                                          |
| ---------------------------------------- | ----------- | --------------------------------------------------------------------------------------- |
| `RECEIPT_REQUIRED_THRESHOLD`             | `const`     | Policy threshold (25) at/above which a receipt is mandatory.                            |
| `isReceiptRequired(amount)`              | function    | Threshold predicate; mirrors `requiredApproverRole`'s input validation for consistency. |
| `isValidReceipt(receipt)`                | function    | Structural validation of a single `Receipt`.                                            |
| `hasSatisfiedReceiptRequirement(claim)`  | function    | Claim-level predicate combining threshold + attached valid receipts.                    |
| `attachReceipt(claim, receipt)`          | function    | Immutable, validated append of a receipt to a claim; returns `ApprovalResult`.          |
| `'MISSING_RECEIPT'`, `'INVALID_RECEIPT'` | error codes | Added to `ExpenseClaimApprovalErrorCode` union.                                         |

## 5. Control Flow: `applyApprovalDecision`

The receipt check is inserted as a new guard clause, placed **after** the
role-sufficiency check and **before** the reject-comment validation:

```
1. draft?                         -> CLAIM_NOT_SUBMITTED
2. already finalized?             -> CLAIM_ALREADY_FINALIZED
3. self-approval?                 -> SELF_APPROVAL_NOT_ALLOWED
4. approver already decided?      -> APPROVER_ALREADY_DECIDED
5. approve & insufficient role?   -> INSUFFICIENT_APPROVER_ROLE
6. approve & missing receipt?     -> MISSING_RECEIPT        [NEW]
7. reject & blank comment?        -> INVALID_COMMENT_FOR_REJECTION
8. apply decision, recompute status
```

**Design decision — ordering:** the receipt check is placed after role
sufficiency (so a reviewer without adequate authority sees the role error
first — the more fundamental blocker) and before the reject-comment check,
which is irrelevant to `approve` requests and thus never reached together
with `MISSING_RECEIPT` in the same call. This ordering has no effect on
`reject` requests, satisfying FR-8 (rejections are never blocked by receipt
status).

**Design decision — flat threshold vs. tiered:** a single numeric threshold
(25) was chosen over per-currency or per-role thresholds to keep the change
minimal and additive per the child issue's constrained scope; currency-aware
thresholds are logged as a follow-up for parent #1929 (see SRS §6) rather
than implemented speculatively.

**Design decision — `attachReceipt` duplicate/validity guards:** duplicate
receipt ids and malformed receipts are rejected at attach-time (not deferred
to approval-time) so that `claim.receipts` never accumulates invalid data,
keeping `hasSatisfiedReceiptRequirement` simple (a single `.some(isValidReceipt)`
scan is defensive-only, not load-bearing for correctness).

## 6. Test Strategy (for the focused validation pass)

Recommended vitest coverage (not part of this change's file list, to be
added by the consuming test suite under the project's existing test
conventions):

- `isReceiptRequired`: boundary at exactly `RECEIPT_REQUIRED_THRESHOLD`
  (inclusive), below/above, and negative/non-finite throw behavior.
- `isValidReceipt`: valid receipt, blank id, blank url, unparseable
  `uploadedAt`, negative `amount`, `amount` omitted (valid).
- `hasSatisfiedReceiptRequirement`: below-threshold claim with no receipts
  (satisfied), at/above-threshold claim with no receipts (unsatisfied),
  at/above-threshold claim with one valid receipt (satisfied), at/above with
  only invalid receipts (unsatisfied).
- `applyApprovalDecision`: approve blocked with `MISSING_RECEIPT` for a
  high-value claim with no receipts; approve succeeds once a valid receipt
  is attached; reject still succeeds on a high-value claim with no receipts.
- `attachReceipt`: successful attach, duplicate id rejected, malformed
  receipt rejected, original claim object left unmutated (identity check).

Validation commands for this change:

- `tsc --noEmit --strict` scoped to the changed file (already executed
  during implementation; passed with no new diagnostics).
- Project vitest run scoped to the `expenseClaims` directory once test files
  exist there, e.g. `vitest run src/features/finance/expenseClaims`.

## 7. Completion Evidence

- File modified: `src/features/finance/expenseClaims/expenseClaimApproval.logic.ts`
  (extended in place; no pre-existing export removed or renamed).
- Type-check evidence: `node_modules/.bin/tsc --noEmit --strict --target ES2020
--module commonjs --moduleResolution node` against the file produced zero
  diagnostics attributable to this file (one pre-existing, unrelated
  `@types/request`/`tough-cookie` diagnostic from the shared dependency graph
  was observed and is out of scope for this change).
- No GitHub issue state, labels, or comments were mutated by this change.
- No database, network, or filesystem I/O was introduced; the module remains
  pure.

## 8. Rollback Note

This change is purely additive to a single source file:

1. Remove the `Receipt` interface, the `receipts` field on `ExpenseClaim`,
   `RECEIPT_REQUIRED_THRESHOLD`, `isReceiptRequired`, `isValidReceipt`,
   `hasSatisfiedReceiptRequirement`, `attachReceipt`, and the
   `'MISSING_RECEIPT'` / `'INVALID_RECEIPT'` error-code union members.
2. Revert the single inserted guard clause in `applyApprovalDecision` (the
   `MISSING_RECEIPT` check) and the receipt-status clause appended to
   `summarizeApprovalProgress`.
3. No data migration is required: `receipts` was never persisted by this
   change (the module performs no I/O), so no backfill or cleanup step is
   needed on rollback.
4. Because every change is additive and no existing signature was altered,
   reverting is a straightforward file-level revert with no ripple effects
   on other modules that only depended on the pre-existing exports.
