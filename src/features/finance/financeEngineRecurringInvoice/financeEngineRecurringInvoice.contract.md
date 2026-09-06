# Finance Engine — Recurring Invoice — Contract

- Issue: #2387
- Parent issue: #1948
- Status: Draft / child scope only

## Purpose

Defines the module contract for the Recurring Invoice sub-feature of the Finance
Engine. This document is the source of truth for the public surface, data
shapes, and invariants that any implementation of
`financeEngineRecurringInvoice` must satisfy. It does not implement business
logic; it declares the contract that future implementation and test work must
honor.

## Scope

### In scope (this child issue)

- Declaring the TypeScript contract (types, interfaces, function signatures)
  for generating, scheduling, and previewing recurring invoices.
- Declaring validation rules and error conditions for recurring invoice
  schedules.
- Documenting rollback/operational notes for this child unit of work.

### Excluded scope (explicitly out of bounds for this and dependent work)

- Parent issue closure (#1948 remains open until all child work is reconciled).
- Bulk GitHub mutation (issue/PR bulk edits, label sweeps, etc.).
- Destructive database operations (migrations that drop/truncate data).
- Production secret rewrites (env vars, credentials, key rotation).

## Domain model

```ts
/** ISO 4217 currency code, e.g. "USD", "AED". */
type CurrencyCode = string;

/** Supported recurrence cadences for a recurring invoice schedule. */
type RecurrenceFrequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually';

/** Lifecycle status of a recurring invoice schedule. */
type RecurringInvoiceStatus = 'active' | 'paused' | 'cancelled' | 'completed';

/** A single line item on a recurring invoice template. */
interface RecurringInvoiceLineItem {
  readonly id: string;
  readonly description: string;
  readonly quantity: number;
  readonly unitAmount: number;
  readonly currency: CurrencyCode;
}

/** Immutable definition of a recurring invoice schedule. */
interface RecurringInvoiceSchedule {
  readonly id: string;
  readonly accountId: string;
  readonly frequency: RecurrenceFrequency;
  readonly startDate: string; // ISO 8601 date
  readonly endDate: string | null; // ISO 8601 date, null = open-ended
  readonly lineItems: readonly RecurringInvoiceLineItem[];
  readonly status: RecurringInvoiceStatus;
  readonly nextRunDate: string; // ISO 8601 date
}

/** Result of generating a concrete invoice instance from a schedule. */
interface GeneratedInvoicePreview {
  readonly scheduleId: string;
  readonly issueDate: string; // ISO 8601 date
  readonly dueDate: string; // ISO 8601 date
  readonly total: number;
  readonly currency: CurrencyCode;
  readonly lineItems: readonly RecurringInvoiceLineItem[];
}

/** Validation error describing why a schedule input was rejected. */
interface RecurringInvoiceValidationError {
  readonly field: string;
  readonly message: string;
}
```

## Public function contract

```ts
/**
 * Validates a candidate recurring invoice schedule before persistence.
 * MUST return an empty array when the schedule is valid.
 * MUST NOT throw for expected validation failures; throws only for
 * programmer errors (e.g., null schedule reference).
 */
declare function validateRecurringInvoiceSchedule(
  schedule: Omit<RecurringInvoiceSchedule, 'id' | 'status' | 'nextRunDate'>
): readonly RecurringInvoiceValidationError[];

/**
 * Computes the next run date for a schedule given the current run date and
 * frequency. Pure function; no I/O.
 */
declare function computeNextRunDate(currentRunDate: string, frequency: RecurrenceFrequency): string;

/**
 * Produces a non-persisted preview of the invoice that would be generated for
 * a schedule on a given issue date. Pure function; no I/O, no persistence.
 */
declare function previewGeneratedInvoice(
  schedule: RecurringInvoiceSchedule,
  issueDate: string
): GeneratedInvoicePreview;
```

## Invariants

1. `lineItems` on a schedule MUST contain at least one entry.
2. `unitAmount` and `quantity` on every line item MUST be finite, non-negative
   numbers.
3. `endDate`, when present, MUST be strictly after `startDate`.
4. `nextRunDate` MUST always be greater than or equal to `startDate` and, when
   `endDate` is set, less than or equal to `endDate`.
5. `computeNextRunDate` MUST be deterministic and MUST NOT depend on wall-clock
   time (the current date is never read internally).
6. `previewGeneratedInvoice` MUST NOT mutate its inputs and MUST NOT perform
   any database or network I/O.
7. All monetary totals MUST be computed as `sum(quantity * unitAmount)` across
   `lineItems`, rounded to 2 decimal places using standard rounding.
8. Every line item within a single schedule MUST share the same `currency`;
   mixed-currency schedules are invalid and MUST be rejected by
   `validateRecurringInvoiceSchedule`.

## Error handling

- Validation failures are represented as data (`RecurringInvoiceValidationError[]`),
  never thrown exceptions, so callers can display all failures at once.
- Strict TypeScript: no `any`, no implicit `unknown` widening without explicit
  narrowing. All public functions must have explicit parameter and return
  types.

## Testing expectations for dependent implementation work

- Unit tests MUST use vitest (`import { describe, expect, it } from 'vitest'`).
- Tests MUST assert real behavior (e.g., exact computed dates, exact totals,
  exact validation error contents) — no placeholder or trivial `expect(true).toBe(true)` assertions.
- Coverage MUST include: valid schedule acceptance, each invariant violation
  (one test per invariant), frequency edge cases (e.g., month-end dates for
  `monthly`), and open-ended vs. bounded schedules.

## Relationship to parent issue

This contract is one child unit under parent issue #1948. The parent issue
MUST remain open until all sibling child units under it are implemented,
tested, and reconciled. This document does not close, and must not be used to
imply closure of, #1948.
