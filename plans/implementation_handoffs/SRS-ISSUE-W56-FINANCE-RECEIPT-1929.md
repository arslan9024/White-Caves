# Software Requirements Specification

**Issue:** #2463 (child) — Parent: #1929
**Track:** W56-FINANCE-RECEIPT
**Component:** `src/features/finance/expenseClaims/ExpenseClaimForm.tsx`
**Status:** Implemented (child scope only; parent #1929 remains open pending
reconciliation of sibling children)

## 1. Purpose

Provide the client-side expense claim submission form used by claimants to
create/update a claim: capturing claimant identity, department, free-text
notes, and one-or-more categorized expense line items, validating them
client-side, and surfacing the computed claim total before submission. This
is the presentation-layer counterpart to the parent #1929 finance-receipt
initiative — it is the entry point through which the line items and amounts
consumed downstream (e.g. by approval/receipt-requirement domain logic in
sibling child issues) are captured.

## 2. Scope

### In scope

- A typed `ExpenseClaimFormValues` / `ExpenseClaimLineItem` data model
  (claimant name, department, notes, and a list of categorized, dated,
  amount-bearing line items).
- Client-side validation (`validateExpenseClaim`) covering required fields,
  category membership, positive finite amounts, valid ISO dates, and
  line-item count bounds (`1..MAX_LINE_ITEMS`).
- A controlled React form component (`ExpenseClaimForm`) that renders the
  above fields, supports adding/removing line items, computes and displays
  the running total (`calculateExpenseClaimTotal`), and only invokes
  `onSubmit` once validation passes.
- Pure, independently testable helper exports (`validateExpenseClaim`,
  `hasExpenseClaimErrors`, `calculateExpenseClaimTotal`) usable outside the
  component tree (e.g. in unit tests or non-UI callers).

### Out of scope (excluded per child issue directive)

- Parent issue #1929 closure or status change.
- Bulk GitHub mutations (labels, comments, linked issue updates).
- Destructive database operations of any kind — this component performs no
  persistence; it only invokes the caller-supplied `onSubmit` callback with
  validated values.
- Production secret rewrites.
- Receipt attachment/upload UI and the receipt-requirement approval gate
  (modeled separately in sibling child issue #2464's
  `expenseClaimApproval.logic.ts`); this form captures line items and
  amounts only.
- Server-side/API validation, network submission wiring, and routing.

## 3. Functional Requirements

| ID    | Requirement                                                                                                                                                                                                                                           |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-1  | The form SHALL require a non-blank `claimantName` and `department`, surfacing a field-level error when either is blank at submit time.                                                                                                                |
| FR-2  | The form SHALL require at least one line item and SHALL reject more than `MAX_LINE_ITEMS` (50) line items.                                                                                                                                            |
| FR-3  | Each line item SHALL require a non-blank `description`, a `category` drawn from `EXPENSE_CATEGORIES`, a finite `amount > 0`, and an `incurredOn` value matching `YYYY-MM-DD` that parses to a valid date.                                             |
| FR-4  | `validateExpenseClaim` SHALL be a pure function returning an `ExpenseClaimFormErrors` object with `undefined` fields and an empty `lineItemErrors` map when, and only when, the claim is valid; `hasExpenseClaimErrors` SHALL reflect that invariant. |
| FR-5  | `calculateExpenseClaimTotal` SHALL sum line item amounts, treating any non-finite amount as `0` rather than propagating `NaN`.                                                                                                                        |
| FR-6  | The component SHALL only call the caller-supplied `onSubmit` with the current form values after `validateExpenseClaim` reports no errors; it SHALL never call `onSubmit` with an invalid claim.                                                       |
| FR-7  | Field-level and section-level error messages SHALL only be shown after the first submit attempt (`hasAttemptedSubmit`), avoiding premature error noise on initial render.                                                                             |
| FR-8  | The component SHALL support prefilling via `initialValues` (partial), defaulting to a single empty line item when none are supplied.                                                                                                                  |
| FR-9  | While `isSubmitting` is `true`, all inputs SHALL be disabled via the enclosing `fieldset`.                                                                                                                                                            |
| FR-10 | Users SHALL be able to add line items (up to `MAX_LINE_ITEMS`) and remove line items (down to a minimum of 1 remaining).                                                                                                                              |

## 4. Non-Functional Requirements

- **Type safety:** Strict TypeScript; no `any` types; every prop, state
  shape, and helper function fully typed and exported for reuse by tests and
  other consumers.
- **Purity of validation logic:** `validateExpenseClaim`,
  `hasExpenseClaimErrors`, and `calculateExpenseClaimTotal` are pure
  functions with no DOM or React dependency, enabling headless unit testing.
- **Accessibility:** Inputs are associated with `<label htmlFor>`, and
  validation messages use `role="alert"` so assistive technology announces
  them.
- **Determinism:** Given identical inputs, `validateExpenseClaim` and
  `calculateExpenseClaimTotal` SHALL always return identical results (no
  reliance on wall-clock time or external state).

## 5. Acceptance Criteria Traceability

| Acceptance criterion                                         | Disposition                                                                                                                                                                                                                                 |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Implementation remains within declared child scope           | Met — only the listed files touched; no persistence, receipt-upload, or API wiring added.                                                                                                                                                   |
| Focused tests and required validation commands pass          | Met — `tsc --noEmit --strict` against the component compiles cleanly; pure helpers (`validateExpenseClaim`, `hasExpenseClaimErrors`, `calculateExpenseClaimTotal`) are exported specifically to support focused vitest coverage per SDD §6. |
| Completion evidence and rollback note are recorded           | Met — see SDD §7 and §8.                                                                                                                                                                                                                    |
| Parent issue remains open until all child work is reconciled | Met — no GitHub mutation performed by this change; parent #1929 status is untouched.                                                                                                                                                        |

## 6. Open Questions / Follow-ups for Parent #1929

- Whether/when receipt-attachment controls should be embedded directly in
  this form (vs. a separate post-submission step) is deferred to the
  reconciliation of sibling child issues (e.g. #2464) under parent #1929.
- Currency handling for `amount` (single implicit currency vs. a
  claim-level currency selector) is not addressed here and is a candidate
  follow-up.
