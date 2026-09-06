# Software Design Document — Finance Engine Cheque Registry

- Handoff ID: SDD-ISSUE-W56-FINANCE-CHEQUE-1938
- Issue: #2426
- Parent issue: #1938 (remains open until all child work is reconciled)
- Module: `src/features/finance/financeEngineChequeRegistry`
- Companion: `SRS-ISSUE-W56-FINANCE-CHEQUE-1938.md`

## 1. Overview

This document describes the internal design for the Finance Engine Cheque
Registry module: a pure, dependency-free TypeScript library that models
cheque records, validates them, enforces lifecycle transitions, and offers
query/aggregation helpers. It has no persistence, no network calls, and no
mutation of shared state.

## 2. Module Layout

```
src/features/finance/financeEngineChequeRegistry/
├── financeEngineChequeRegistry.contract.md   # data/behavior contract (source of truth)
├── README.md                                  # module overview
├── financeEngineChequeRegistry.ts             # implementation (follow-up child issue)
└── financeEngineChequeRegistry.test.ts        # Vitest suite (follow-up child issue)
```

Only the two documentation files (`.contract.md`, `README.md`) are created
by this issue (#2426). The `.ts` implementation and test files are produced
in a follow-up child issue under parent #1938, using this SDD and the
contract as the implementation spec.

## 3. Types

```ts
export type ChequeStatus = 'pending' | 'cleared' | 'bounced' | 'cancelled';

export interface ChequeRecord {
  readonly id: string;
  readonly chequeNumber: string;
  readonly amount: number;
  readonly issueDate: string;
  readonly clearedDate?: string;
  readonly ledgerReference: string;
  readonly status: ChequeStatus;
  readonly note?: string;
}
```

Design decision: fields are `readonly` to make immutability a compile-time
guarantee (NFR: pure functions, no mutation), rather than relying solely on
runtime discipline.

## 4. Function Design

### 4.1 `createChequeRecord(input)`

- Builds a `ChequeRecord` with `status: 'pending'` and no `clearedDate`.
- Runs `validateChequeRecord` internally against the constructed record
  (minus the transition-specific rules, which don't apply to creation) and
  throws `Error(violations.join('; '))` if any violation is found.
- Trims `chequeNumber` and `ledgerReference` before storing.

### 4.2 `validateChequeRecord(record)`

- Pure function returning `string[]` of violation messages (empty array
  means valid). Used internally by `createChequeRecord` and
  `transitionCheque`, and exported for standalone validation (e.g. by
  callers validating externally constructed records, such as ones
  deserialized from storage).
- Checks, in order: amount > 0 and finite; chequeNumber non-empty trimmed;
  ledgerReference non-empty trimmed; issueDate is valid ISO date;
  clearedDate (if present) is valid ISO date and not before issueDate.

### 4.3 `canTransition(from, to)`

- Pure lookup against a `Record<ChequeStatus, ChequeStatus[]>` adjacency
  map:
  ```ts
  const ALLOWED_TRANSITIONS: Record<ChequeStatus, ChequeStatus[]> = {
    pending: ['cleared', 'bounced', 'cancelled'],
    cleared: [],
    bounced: [],
    cancelled: [],
  };
  ```
- Returns `ALLOWED_TRANSITIONS[from].includes(to)`.

### 4.4 `transitionCheque(record, toStatus, options?)`

- Calls `canTransition(record.status, toStatus)`; throws
  `Error('Invalid cheque transition: ' + record.status + ' -> ' + toStatus)`
  if false.
- When `toStatus` is `'cleared'` or `'bounced'`, requires
  `options?.clearedDate` (defaults to not set is disallowed for `cleared`;
  design decision: `clearedDate` is required for `cleared`/`bounced`
  because a clearing/bounce event is inherently dated, but optional for
  `cancelled` since cancellation may precede any bank presentation).
- Validates the resulting record via `validateChequeRecord` before
  returning it, so downstream state is guaranteed contract-valid.
- Returns a new object (spread of `record` with overridden `status`,
  `clearedDate`, `note`), never mutates the input.

### 4.5 Query/Aggregation Helpers

- `filterByStatus`, `filterByLedgerReference`: simple `Array.prototype.filter`
  predicates, `O(n)`, no sorting guarantees beyond input order.
- `sumOutstandingAmount`: `records.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0)`.

## 5. Design Decisions & Rationale

1. **Pure functions over a class-based registry.** A stateless functional
   API keeps the module trivially testable and avoids introducing shared
   mutable state, aligning with NFR-4 (no side effects) and simplifying
   composition with any persistence layer callers choose.
2. **Required `clearedDate` for `cleared`/`bounced` transitions.** Chosen
   because both events represent a bank action that inherently occurred on
   a specific date; omitting it would leave the record contract-incomplete
   and break `sumOutstandingAmount`/reporting accuracy downstream.
3. **String-based ISO dates rather than `Date` objects.** Keeps records
   JSON-serializable without custom (de)serialization logic, and avoids
   timezone ambiguity common with `Date` in cross-environment (Node/browser)
   code.
4. **Validation returns messages instead of throwing directly.**
   `validateChequeRecord` is exposed as a non-throwing pure function so
   callers (e.g. UI forms) can surface multiple validation errors at once;
   `createChequeRecord`/`transitionCheque` wrap it and throw for
   programmatic/contract-enforcement call sites.

## 6. Error Handling Strategy

- All errors are native `Error` instances with descriptive messages (no
  custom error classes introduced, to avoid adding public API surface not
  required by the contract).
- No error is ever swallowed; invalid input always throws or returns a
  non-empty violation list.

## 7. Testing Strategy

- Vitest suite (`import { describe, expect, it } from 'vitest'`) covering:
  - `createChequeRecord`: valid input succeeds; each invalid field throws.
  - `validateChequeRecord`: returns expected violation messages for each
    invariant breach; returns `[]` for valid input.
  - `canTransition`: true for the three valid pairs, false for all others
    (including same-state and terminal-state origins).
  - `transitionCheque`: successful transition returns new object with
    updated fields and does not mutate the original; invalid transition
    throws with the exact `Invalid cheque transition: <from> -> <to>`
    message.
  - `filterByStatus`, `filterByLedgerReference`, `sumOutstandingAmount`:
    correctness on multi-record fixtures including the empty-array edge
    case.
- No mocks needed; all inputs/outputs are plain data.

## 8. Risks & Mitigations

| Risk                                                    | Mitigation                                                                         |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Implementation drifts from contract in follow-up issue. | Contract file is the source of truth; SDD explicitly cross-references it in §3–§4. |
| Ambiguity about parent issue closure.                   | Explicitly excluded in scope; parent #1938 stays open per acceptance criteria.     |
| Scope creep into persistence/bank integration.          | Explicitly listed as out-of-scope in both SRS and this SDD.                        |

## 9. Rollback Note

This SDD is a documentation artifact under `plans/implementation_handoffs/`.
Deleting this file (and its companion SRS) fully reverts this handoff with
no effect on runtime code, configuration, or dependencies, since this issue
introduces no implementation files.

## 10. Implementation Completion Evidence (Issue #2425)

- Follow-up child issue #2425 (parent #1938) implements this design as:
  - `src/features/finance/financeEngineChequeRegistry/financeEngineChequeRegistry.logic.ts`
  - `src/features/finance/financeEngineChequeRegistry/financeEngineChequeRegistry.logic.test.ts`
- File names use the `.logic.ts` / `.logic.test.ts` suffix (rather than the
  bare `.ts`/`.test.ts` sketched in §2) to align with the implementation
  task's file-naming contract; the public API surface (types and exported
  functions in §3–§4) is otherwise implemented exactly as designed.
- Vitest suite covers `createChequeRecord`, `validateChequeRecord`,
  `canTransition`, `transitionCheque`, `filterByStatus`,
  `filterByLedgerReference`, and `sumOutstandingAmount`, including the
  invalid-transition error message, required-`clearedDate` enforcement,
  non-mutation of inputs, and empty-array edge cases described in §7.
- Rollback: deleting the two `.logic.ts`/`.logic.test.ts` files fully
  reverts issue #2425 with no effect on any other module, since the
  registry is a pure, dependency-free, standalone library with no external
  callers at this time. Parent issue #1938 remains open.
