# Software Design Document

**Issue:** #2463 (child) — Parent: #1929
**Track:** W56-FINANCE-RECEIPT
**Component:** `src/features/finance/expenseClaims/ExpenseClaimForm.tsx`
**Companion:** `SRS-ISSUE-W56-FINANCE-RECEIPT-1929.md`

> **Addendum (issue #2462, child of #1929, same W56-FINANCE-RECEIPT track):**
> See §9 below for the receipt-requirement compliance domain logic added to
> `src/features/finance/expenseClaims/expenseClaims.types.ts`. Sections 1–8
> describe the original #2463 form scope and are unchanged.

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

## 9. Addendum — Issue #2462: Receipt Requirement Compliance Design

**Component:** `src/features/finance/expenseClaims/expenseClaims.types.ts`

### 9.1 Context

The pre-existing `expenseClaims.types.ts` (issue #2389, parent #1947)
already models `ExpenseClaim`, `ExpenseClaimLineItem`, and
`ExpenseAttachment`. Issue #2462, under the W56-FINANCE-RECEIPT track
(parent #1929), extends that same file with a self-contained,
policy-driven receipt-requirement compliance model, without modifying,
renaming, or removing any pre-existing export.

### 9.2 Design Goals

1. **Additive only.** All new symbols (`ReceiptRequirementPolicy`,
   `DEFAULT_RECEIPT_REQUIREMENT_POLICY`, `claimLineItemRequiresReceipt`,
   `MissingReceiptViolation`, `ExpenseClaimReceiptComplianceResult`,
   `evaluateExpenseClaimReceiptCompliance`) are new exports appended to the
   file; nothing pre-existing was altered.
2. **Pure, side-effect-free evaluation.** Both `claimLineItemRequiresReceipt`
   and `evaluateExpenseClaimReceiptCompliance` are pure functions over plain
   data, consistent with the file's existing "type-only / no runtime
   side-effects beyond pure helpers" convention (mirroring
   `validateExpenseClaimDraft`).
3. **Configurable, conservative default.** A caller may omit the policy
   argument entirely and get `DEFAULT_RECEIPT_REQUIREMENT_POLICY` (AED 100
   threshold; `client_entertainment` and `training` always require a
   receipt), so downstream consumers (e.g. an approval-gate service in a
   sibling child issue) have a sane default without additional wiring.
4. **Safe cross-currency handling.** Rather than silently coercing or
   comparing mismatched currencies, the amount-based rule is simply
   skipped when the line item's currency differs from the policy's
   threshold currency — category/payment-method rules remain authoritative
   in that case. This avoids introducing incorrect currency-conversion
   logic into a pure domain-type module.

### 9.3 Data Model

```ts
export interface ReceiptRequirementPolicy {
  readonly thresholdAmount: number;
  readonly thresholdCurrency: CurrencyCode;
  readonly requiredCategories: ReadonlyArray<ExpenseCategory>;
  readonly exemptPaymentMethods?: ReadonlyArray<ExpensePaymentMethod>;
}

export interface MissingReceiptViolation {
  readonly lineItemId: string;
  readonly category: ExpenseCategory;
  readonly amount: Money;
}

export type ExpenseClaimReceiptComplianceResult =
  | { readonly compliant: true }
  | { readonly compliant: false; readonly violations: ReadonlyArray<MissingReceiptViolation> };
```

### 9.4 Public API Surface

| Symbol                                  | Kind      | Responsibility                                                                                     |
| --------------------------------------- | --------- | -------------------------------------------------------------------------------------------------- |
| `ReceiptRequirementPolicy`              | interface | Configurable rule set governing when a receipt is mandatory.                                       |
| `DEFAULT_RECEIPT_REQUIREMENT_POLICY`    | const     | Conservative default policy usable without additional configuration.                               |
| `claimLineItemRequiresReceipt`          | function  | Pure predicate: does this single line item require a receipt under the given (or default) policy?  |
| `MissingReceiptViolation`               | interface | Describes one line item that requires but lacks a receipt.                                         |
| `ExpenseClaimReceiptComplianceResult`   | type      | Discriminated union result of a whole-claim compliance evaluation.                                 |
| `evaluateExpenseClaimReceiptCompliance` | function  | Pure evaluator: iterates a claim's line items and reports every missing-receipt violation, if any. |

### 9.5 Control Flow

```
evaluateExpenseClaimReceiptCompliance(claim, policy?):
  violations = []
  for each lineItem in claim.lineItems:
    if claimLineItemRequiresReceipt(lineItem, policy) and lineItem.attachments.length === 0:
      violations.push({ lineItemId, category, amount })
  return violations.length === 0
    ? { compliant: true }
    : { compliant: false, violations }
```

**Design decision — evaluate against `Pick<ExpenseClaim, 'lineItems'>` rather
than the full `ExpenseClaim`:** the evaluator only needs `lineItems`, so its
parameter type is narrowed via `Pick` to minimize coupling and make it
trivially usable from partial/draft claim shapes (e.g. a claim still being
assembled) without requiring every other `ExpenseClaim` field to be
populated first.

**Design decision — policy parameter is optional with a module-level
default:** consistent with `claimLineItemRequiresReceipt(lineItem, policy =
DEFAULT_RECEIPT_REQUIREMENT_POLICY)`, callers needing custom thresholds
(e.g. a department-specific policy) can pass one explicitly, while the
common case requires no configuration.

### 9.6 Test Strategy (for the focused validation pass)

Recommended vitest coverage (helpers already exported to support this;
test file itself is outside this change's declared file list and is left
to the consuming test suite under the project's existing conventions):

- `claimLineItemRequiresReceipt`: amount at/above threshold in matching
  currency requires a receipt; amount below threshold in matching currency
  does not; a `requiredCategories` category requires a receipt even when
  the amount is below threshold; an `exemptPaymentMethods` payment method
  never requires a receipt even when category/amount would otherwise
  mandate one; mismatched currency skips the amount-based rule.
- `evaluateExpenseClaimReceiptCompliance`: returns `{ compliant: true }`
  for a claim with no line items; returns `{ compliant: true }` when every
  receipt-requiring line item has at least one attachment; returns
  `{ compliant: false, violations }` listing every offending
  `lineItemId`/`category`/`amount` when one or more required receipts are
  missing; violations preserve line-item order.

Validation commands for this change:

- `tsc --noEmit --strict` scoped to
  `src/features/finance/expenseClaims/expenseClaims.types.ts` (executed
  during implementation; passes with no diagnostics attributable to the
  new exports).
- Project vitest run scoped to the `expenseClaims` directory once test
  files exist there, e.g. `vitest run src/features/finance/expenseClaims`.

### 9.7 Completion Evidence

- File verified/extended in place:
  `src/features/finance/expenseClaims/expenseClaims.types.ts` — every
  pre-existing export (`ExpenseClaim`, `ExpenseClaimLineItem`,
  `validateExpenseClaimDraft`, etc.) is unchanged; only new, additive
  exports were appended.
- Type-check evidence: `tsc --noEmit --strict` run against the file
  reports no diagnostics originating from the new receipt-requirement
  code (a pre-existing, unrelated ambient `@types/request` diagnostic in
  the wider workspace is not attributable to this change).
- No GitHub issue state, labels, or comments were mutated by this change.
- No database, network, or filesystem I/O was introduced; all new
  exports are pure, synchronous functions/constants/types.

### 9.8 Rollback Note

This change is scoped to a single, purely additive block appended to an
existing type-only file, plus its accompanying handoff documentation
addenda:

1. Revert `src/features/finance/expenseClaims/expenseClaims.types.ts` to
   its prior revision (i.e. remove the "Receipt requirement compliance"
   block added under issue #2462) — because the addition is purely
   additive and no other code in this child's declared scope imports the
   new symbols yet, this is a clean, ripple-free revert.
2. Revert the "Addendum (issue #2462...)" sections appended to
   `SRS-ISSUE-W56-FINANCE-RECEIPT-1929.md` and
   `SDD-ISSUE-W56-FINANCE-RECEIPT-1929.md`, restoring them to their prior
   (#2463-only) content, if the documentation should also be rolled back
   alongside the code.
3. No data migration is required: the new logic performs no persistence
   or I/O, so no backfill or cleanup step is needed on rollback.
4. Because the new exports are self-contained and additive, reverting is
   a straightforward file-level revert with no ripple effects on other
   modules or on the pre-existing #2463/#2389 exports in the same file.
