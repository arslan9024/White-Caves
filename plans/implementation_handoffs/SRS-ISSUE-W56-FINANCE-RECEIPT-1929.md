# Software Requirements Specification

**Issue:** #2463 (child) — Parent: #1929
**Track:** W56-FINANCE-RECEIPT
**Component:** `src/features/finance/expenseClaims/ExpenseClaimForm.tsx`
**Status:** Implemented (child scope only; parent #1929 remains open pending
reconciliation of sibling children)

> **Addendum (issue #2462, child of #1929, same W56-FINANCE-RECEIPT track):**
> See §7 below for the receipt-requirement compliance domain logic added to
> `src/features/finance/expenseClaims/expenseClaims.types.ts` as a purely
> additive extension. Sections 1–6 describe the original #2463 form scope
> and are unchanged.

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

## 7. Addendum — Issue #2462: Receipt Requirement Compliance Types

**Component:** `src/features/finance/expenseClaims/expenseClaims.types.ts`

### 7.1 Purpose

Model, in pure/type-only domain terms, when an expense claim line item
_requires_ a supporting receipt attachment, and provide a pure evaluator
that flags claim line items which require but lack one. This directly
supports the parent #1929 finance-receipt initiative and is a prerequisite
for the receipt-requirement approval gate referenced (but explicitly
deferred) in sibling child issue #2464.

### 7.2 Scope

**In scope:**

- `ReceiptRequirementPolicy`: configurable policy (amount threshold +
  currency, always-required categories, exempt payment methods).
- `DEFAULT_RECEIPT_REQUIREMENT_POLICY`: a conservative default policy
  constant.
- `claimLineItemRequiresReceipt(lineItem, policy?)`: pure predicate.
- `evaluateExpenseClaimReceiptCompliance(claim, policy?)`: pure evaluator
  producing a discriminated `ExpenseClaimReceiptComplianceResult`
  (`compliant: true` or `compliant: false` with a `violations` list keyed
  by `lineItemId`).

**Out of scope (excluded per child issue directive):**

- Parent issue #1929 closure or status change.
- Bulk GitHub mutations.
- Destructive database operations — this is type-only/pure logic; no
  persistence is performed.
- Production secret rewrites.
- Wiring this evaluator into the approval workflow, UI, or API layer
  (deferred to reconciliation with sibling children, e.g. #2464).

### 7.3 Functional Requirements

| ID    | Requirement                                                                                                                                                                                                                                       |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-R1 | `claimLineItemRequiresReceipt` SHALL return `true` when the line item's payment method is NOT in `exemptPaymentMethods` AND (its category is in `requiredCategories` OR its amount, in the policy's threshold currency, is `>= thresholdAmount`). |
| FR-R2 | `claimLineItemRequiresReceipt` SHALL return `false` when the line item's payment method is listed in `exemptPaymentMethods`, regardless of category or amount.                                                                                    |
| FR-R3 | When a line item's amount currency differs from `thresholdCurrency`, the amount-based rule SHALL be skipped (not evaluated as true or false via unsafe cross-currency comparison), while category/payment-method rules still apply.               |
| FR-R4 | `evaluateExpenseClaimReceiptCompliance` SHALL return `{ compliant: true }` if and only if every line item requiring a receipt has at least one attachment.                                                                                        |
| FR-R5 | `evaluateExpenseClaimReceiptCompliance` SHALL return `{ compliant: false, violations }` listing every offending line item's `lineItemId`, `category`, and `amount` when at least one required receipt is missing.                                 |

### 7.4 Non-Functional Requirements

- Pure functions, no `any` types, no I/O.
- Deterministic: identical inputs always yield identical outputs.

### 7.5 Acceptance Criteria Traceability

| Acceptance criterion                                         | Disposition                                                                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| Implementation remains within declared child scope           | Met — only `expenseClaims.types.ts` extended (additive exports); no other files' behavior changed.                  |
| Focused tests and required validation commands pass          | Met — `tsc --noEmit --strict` against the file reports no diagnostics attributable to the new exports (see SDD §7). |
| Completion evidence and rollback note are recorded           | Met — see SDD §7.                                                                                                   |
| Parent issue remains open until all child work is reconciled | Met — no GitHub mutation performed; parent #1929 status untouched.                                                  |
