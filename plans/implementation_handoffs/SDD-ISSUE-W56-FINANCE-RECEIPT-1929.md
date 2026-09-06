# Software Design Document

**Issue:** #2463 (child) — Parent: #1929
**Track:** W56-FINANCE-RECEIPT
**Component:** `src/features/finance/expenseClaims/ExpenseClaimForm.tsx`
**Companion:** `SRS-ISSUE-W56-FINANCE-RECEIPT-1929.md`

## 1. Context

Parent issue #1929 covers the finance-receipt initiative: capturing expense
claims with categorized line items and (in sibling child issues, e.g.
#2464) enforcing receipt-attachment requirements before approval. This
child issue (#2463) delivers the claimant-facing capture surface: a
controlled React form that produces well-typed, validated
`ExpenseClaimFormValues` for downstream consumption by services or approval
logic. It does not implement receipt upload UI or the approval gate itself
— those are modeled as separate child scopes so each can be reviewed and
tested independently.

## 2. Design Goals

1. **Pure validation, impure shell.** All validation and total-calculation
   logic (`validateExpenseClaim`, `hasExpenseClaimErrors`,
   `calculateExpenseClaimTotal`) is implemented as plain, side-effect-free
   functions operating on plain data, independent of React. The
   `ExpenseClaimForm` component is a thin, controlled-input shell around
   this logic, so the business rules can be exercised in tests without
   rendering the DOM.
2. **Fail visibly, not silently.** Validation errors are computed
   holistically (`ExpenseClaimFormErrors`) rather than field-by-field on
   blur, and are only surfaced after a submit attempt, avoiding both
   silent rejection and premature error noise.
3. **Bounded, safe line-item management.** Line items use stable
   client-generated ids (`createLineItemId`) so React keys remain stable
   across add/remove/edit operations without relying on array index
   identity, and additions/removals are clamped (`1..MAX_LINE_ITEMS`).
4. **Backward/forward compatible data shape.** `ExpenseClaimFormValues` and
   `ExpenseClaimLineItem` are intentionally minimal and additive-friendly:
   a `receipts` field or similar can be layered on by a sibling child issue
   without breaking this component's existing props or exports.

## 3. Data Model

```ts
export type ExpenseCategory =
  | 'travel'
  | 'accommodation'
  | 'meals'
  | 'supplies'
  | 'software'
  | 'other';

export interface ExpenseClaimLineItem {
  id: string;
  description: string;
  category: ExpenseCategory;
  amount: number;
  incurredOn: string; // ISO date string (YYYY-MM-DD)
}

export interface ExpenseClaimFormValues {
  claimantName: string;
  department: string;
  notes: string;
  lineItems: ExpenseClaimLineItem[];
}

export interface ExpenseClaimFormErrors {
  claimantName?: string;
  department?: string;
  lineItems?: string;
  lineItemErrors: Record<string, Partial<Record<keyof ExpenseClaimLineItem, string>>>;
}
```

`lineItemErrors` is keyed by line-item `id` (not array index) so errors
remain correctly associated with a specific row even as other rows are
added or removed.

## 4. Public API Surface

| Symbol                                  | Kind            | Responsibility                                                                                                    |
| --------------------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------- |
| `EXPENSE_CATEGORIES`                    | `const`         | Canonical, ordered list of valid categories; drives both validation and the `<select>` options.                   |
| `validateExpenseClaim(values)`          | function        | Produces an `ExpenseClaimFormErrors` describing every violated rule; empty/undefined fields mean "valid".         |
| `hasExpenseClaimErrors(errors)`         | function        | Convenience predicate collapsing an `ExpenseClaimFormErrors` into a single boolean.                               |
| `calculateExpenseClaimTotal(lineItems)` | function        | Sums line-item amounts, coercing non-finite values to `0`.                                                        |
| `ExpenseClaimForm`                      | React component | Controlled form wiring the above logic to inputs, submit, cancel, add/remove line item, and a live total display. |

## 5. Control Flow: Submission

```
1. User edits fields / line items -> local state updates (updateField, updateLineItem)
2. User clicks "Submit claim"     -> handleSubmit:
     a. event.preventDefault()
     b. hasAttemptedSubmit = true
     c. errors = validateExpenseClaim(values)
     d. setErrors(errors)
     e. if !hasExpenseClaimErrors(errors): onSubmit(values)
```

**Design decision — validate-on-submit vs. validate-on-change:** validation
runs holistically on submit (and is recomputed each subsequent submit
attempt) rather than incrementally on every keystroke. This keeps the
validation function pure and simple to test (one call, one result) and
avoids flickering error states while a user is still typing a value such as
an amount or date. `hasAttemptedSubmit` gates error visibility so a
first-render empty form never shows errors before the user has tried to
submit.

**Design decision — stable line-item ids:** `createLineItemId` uses a
monotonically increasing in-memory counter combined with `Date.now()`
rather than array index, so `key={item.id}` remains stable across
inserts/removals — preventing React from misattributing input focus/state
to the wrong row when a middle row is removed.

**Design decision — amount coercion in `calculateExpenseClaimTotal`:** any
non-finite `amount` (e.g. transient `NaN` while a user is mid-edit of a
numeric input) is treated as `0` in the total rather than propagating
`NaN` to the displayed total, keeping the running total always
presentable; the underlying validation (`validateExpenseClaim`) still flags
the invalid amount as a field-level error.

## 6. Test Strategy (for the focused validation pass)

Recommended vitest coverage (component/helpers already exported to support
this; test file itself is outside this change's declared file list and is
left to the consuming test suite under the project's existing conventions):

- `validateExpenseClaim`: valid claim (no errors), blank claimant name,
  blank department, zero line items, more than `MAX_LINE_ITEMS` line items,
  a line item with blank description / invalid category / non-positive
  amount / invalid `incurredOn`.
- `hasExpenseClaimErrors`: returns `false` for a fully-valid errors object,
  `true` when any top-level or nested line-item error is present.
- `calculateExpenseClaimTotal`: sums multiple positive amounts correctly;
  treats `NaN`/`Infinity` amounts as `0` in the sum; returns `0` for an
  empty list.
- `ExpenseClaimForm` (React Testing Library + vitest): renders with a
  default single empty line item; shows validation errors only after a
  failed submit attempt; calls `onSubmit` with normalized values on a valid
  submit; does not call `onSubmit` on an invalid submit; add/remove line
  item respects the `1..MAX_LINE_ITEMS` bounds; all inputs are disabled
  when `isSubmitting` is `true`.

Validation commands for this change:

- `tsc --noEmit --strict` scoped to the changed file (executed during
  implementation; passes with no new diagnostics attributable to this
  component).
- Project vitest run scoped to the `expenseClaims` directory once test
  files exist there, e.g. `vitest run src/features/finance/expenseClaims`.

## 7. Completion Evidence

- File verified/extended in place:
  `src/features/finance/expenseClaims/ExpenseClaimForm.tsx` — no
  pre-existing export removed, renamed, or given a behavior-changing
  signature.
- Type-check evidence: the component uses strict TypeScript throughout
  (no `any`), with all props, state, and helper function signatures fully
  typed.
- No GitHub issue state, labels, or comments were mutated by this change.
- No database, network, or filesystem I/O was introduced; the component
  and its helpers only call the caller-supplied `onSubmit`/`onCancel`
  callbacks.

## 8. Rollback Note

This change is scoped to a single component file plus its accompanying
handoff documents:

1. Revert `src/features/finance/expenseClaims/ExpenseClaimForm.tsx` to its
   prior revision (or delete it if it was newly introduced in this child
   issue's history) — no other module imports from it within this child's
   declared scope, so no ripple edits are required elsewhere.
2. Delete or revert
   `plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-RECEIPT-1929.md` and
   `plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-RECEIPT-1929.md` if
   the documentation should also be rolled back alongside the code.
3. No data migration is required: the component performs no persistence or
   I/O, so no backfill or cleanup step is needed on rollback.
4. Because the component's public exports (`ExpenseClaimForm`,
   `validateExpenseClaim`, `hasExpenseClaimErrors`,
   `calculateExpenseClaimTotal`, and the associated types) are self-
   contained, reverting is a straightforward file-level revert with no
   ripple effects on other modules.
