# SDD — W56 Finance Ledger (Software Design Document)

- **Parent issue**: #1926
- **Child issue**: #2479
- **Component**: `src/features/finance/financeEngineDoubleEntry`
- **Companion document**: `SRS-ISSUE-W56-FINANCE-LEDGER-1926.md`
- **Behavioral contract**: `../../src/features/finance/financeEngineDoubleEntry/financeEngineDoubleEntry.contract.md`

## 1. Design Overview

The finance ledger engine is designed as a small set of pure functions operating over immutable,
`readonly` TypeScript domain types. It has no side effects and no dependency on Express, the
database layer, or any external service — this keeps the double-entry invariants trivially
testable and reusable by any future persistence or API layer built in a later, separately scoped
child issue under parent #1926.

```
┌────────────────────────────────────────────────────────────┐
│ financeEngineDoubleEntry (pure domain module)               │
│                                                              │
│  types.ts        → LedgerAccount, LedgerEntry,               │
│                    LedgerTransaction, ValidationResult, etc. │
│  validation.ts   → validateTransaction()                     │
│  posting.ts      → postTransaction() (idempotent)            │
│  balances.ts     → getAccountBalance()                       │
│  reversal.ts      → reverseTransaction()                      │
└────────────────────────────────────────────────────────────┘
              ▲                                   ▲
              │ consumed by (future, out of scope) │
     ┌────────┴─────────┐               ┌──────────┴─────────┐
     │ persistence layer │               │ booking/payout svc │
     └────────────────────┘               └─────────────────────┘
```

## 2. Module Decomposition (target file layout for implementation)

| File                   | Responsibility                                                                                                                                                   |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `types.ts`             | Domain types: `AccountType`, `EntrySide`, `LedgerAccount`, `LedgerEntry`, `LedgerTransaction`, `ValidationFailureCode`, `ValidationFailure`, `ValidationResult`. |
| `validation.ts`        | `validateTransaction(candidate, accounts): ValidationResult` — implements FR-1 through FR-7.                                                                     |
| `posting.ts`           | `postTransaction(candidate, accounts, ledgerState): LedgerTransaction` — implements FR-8, FR-9, FR-12.                                                           |
| `balances.ts`          | `getAccountBalance(accountId, postedTransactions, accounts): number` — implements FR-10.                                                                         |
| `reversal.ts`          | `reverseTransaction(original): LedgerTransaction` — implements FR-11, FR-13.                                                                                     |
| `index.ts`             | Barrel export of the above, forming the module's public API surface.                                                                                             |
| `*.test.ts` (per file) | vitest suites, one per module, covering the contract's §6 test list.                                                                                             |

This SDD documents the design; concrete `.ts` implementation files are produced in the
implementation phase of issue #2479 and MUST conform to this design and to the contract document.

## 3. Key Design Decisions

### 3.1 Amounts as integer minor units

**Decision**: All money values are `number` but constrained (via validation, not the type system
alone, since TypeScript cannot express integer-only numeric types) to positive integers
representing minor currency units.

**Why**: Floating point arithmetic on money amounts is a well-known source of balance drift bugs.
Integer minor units (fils/cents) make debit/credit summation exact. Validation enforces
`Number.isInteger` and positivity explicitly (`NON_INTEGER_AMOUNT`, `NON_POSITIVE_AMOUNT`).

### 3.2 Validation as data, not exceptions

**Decision**: `validateTransaction` returns a discriminated union `ValidationResult` rather than
throwing on the first problem.

**Why**: Callers such as a future finance-adjustment UI need to show a user every problem with a
submitted transaction at once (e.g. both `UNBALANCED` and `NON_POSITIVE_AMOUNT`), not just the
first one encountered. This also makes the validation function trivially unit-testable with exact
expected failure-code arrays.

### 3.3 Idempotent posting keyed by `reference`

**Decision**: `postTransaction` checks `ledgerState` for an existing transaction with the same
`reference` before creating a new one, and returns the existing transaction unchanged if found.

**Why**: Upstream producers (booking settlement, payout jobs) may retry due to network failures.
Without idempotency, retries would double-post financial entries, corrupting balances. Keying on a
caller-supplied `reference` (e.g. booking id, payout batch id) is simpler and more explicit than
attempting content-hash deduplication, and matches how the rest of the platform already correlates
events by external reference id.

### 3.4 Reversal instead of mutation

**Decision**: Corrections to posted transactions are always new "reversal" transactions with
flipped entry sides, never in-place edits.

**Why**: Financial audit requirements mandate an immutable history. A reversal transaction
preserves the original record for audit while nullifying its balance effect, and the
`metadata.reversalOf` back-reference keeps the two transactions traceable to each other.

### 3.5 Single currency per transaction

**Decision**: Multi-currency events are represented as two or more linked single-currency
transactions (e.g. a conversion entry pair), not as one transaction with mixed-currency entries.

**Why**: Allowing mixed currencies inside one transaction would make the "sum of debits equals
sum of credits" invariant ambiguous (equal in which currency?). Enforcing single-currency
transactions keeps FR-3 (balance check) unambiguous and keeps FX conversion logic — which is out
of scope for this child issue — cleanly separated.

## 4. Error Handling Strategy

- Expected, user-facing validation problems → returned as `ValidationResult` data (§3.2).
- Programmer misuse (e.g., calling `postTransaction` without first validating, or on already-known
  invalid input) → allowed to throw a `TypeError`/`LedgerPostingError`, since this represents a
  caller contract violation rather than expected user input error.
- No function in this module returns `any`; all failure modes are represented by the typed
  `ValidationFailureCode` union.

## 5. Testing Strategy

- Framework: vitest, `import { describe, expect, it } from 'vitest'`.
- One test file per implementation file, covering the full contract §6 checklist:
  balanced-pass, unbalanced-fail, single-sided-fail, empty-entries-fail, mixed-currency-fail,
  non-integer/non-positive-amount-fail, unknown/inactive-account-fail, idempotent posting,
  debit-normal and credit-normal balance derivation, and reversal correctness/immutability.
- All assertions must exercise real computed output (e.g. `expect(result.ok).toBe(false)` combined
  with `expect(result.failures.map(f => f.code)).toContain('UNBALANCED')`), never trivial
  placeholder assertions.
- Validation commands run against this scope are limited to targeted vitest runs for the touched
  files/module; no repository-wide destructive or mutating commands are part of this scope.

## 6. Traceability to Requirements

| SDD Section                         | SRS Requirement(s)                 |
| ----------------------------------- | ---------------------------------- |
| 3.1 Amounts as integer minor units  | FR-5                               |
| 3.2 Validation as data              | FR-1, FR-2, FR-3, FR-4, FR-6, FR-7 |
| 3.3 Idempotent posting              | FR-8, FR-9                         |
| 3.4 Reversal instead of mutation    | FR-11, FR-12, FR-13                |
| 3.5 Single currency per transaction | FR-4                               |
| §5 Testing Strategy                 | NFR-4                              |

## 7. Excluded Scope (reaffirmed)

- Parent issue #1926 closure.
- Bulk GitHub mutation.
- Destructive database operations.
- Production secret rewrites.

## 8. Rollback Note

This SDD is a planning/design artifact only. Rollback consists of deleting this file together with
its companion SRS, the contract document, and the module README — all listed in the parent issue's
child scope for #2479. No source code outside `src/features/finance/financeEngineDoubleEntry/`
documentation is affected, no dependencies are added, and no database or secret state is touched,
so reverting this change is a clean, side-effect-free file removal.
