# SDD — Finance Engine Intercompany Transfer

- **Doc ID**: SDD-ISSUE-W56-FINANCE-TRANSFER-1936
- **Issue**: #2434
- **Parent issue**: #1936
- **Traces to**: `SRS-ISSUE-W56-FINANCE-TRANSFER-1936.md`,
  `financeEngineIntercompanyTransfer.contract.md`
- **Status**: Approved for future implementation

## 1. Purpose

This Software Design Description translates the requirements in the SRS into
a concrete internal design for the intercompany transfer module. It is
intended to guide the implementation delivered by a future child issue under
parent #1936; it does not itself introduce runtime code.

## 2. Design Goals

- Keep domain logic (validation + state transitions) pure and independently
  testable from persistence.
- Guarantee atomicity of the debit/credit pair without leaking transaction
  concerns into the domain layer's public API.
- Make idempotent replay a first-class, cheaply-checked path rather than an
  afterthought bolted onto the happy path.

## 3. Proposed Module Layout

```
src/features/finance/financeEngineIntercompanyTransfer/
├── financeEngineIntercompanyTransfer.contract.md   (this issue)
├── README.md                                        (this issue)
├── types.ts                       (future) — request/record/error types
├── validate.ts                     (future) — pure validation rules (FR-2..FR-5, FR-10)
├── stateMachine.ts                 (future) — PENDING→VALIDATED→POSTED→REVERSED / REJECTED
├── ledgerAdapter.ts                 (future) — persistence boundary (atomic post/reverse)
├── intercompanyTransferService.ts  (future) — orchestrates validate → post → record
└── __tests__/
    ├── validate.test.ts             (future, vitest)
    ├── stateMachine.test.ts         (future, vitest)
    └── intercompanyTransferService.test.ts (future, vitest)
```

No files under `types.ts`/`validate.ts`/etc. are created by issue #2434;
this layout is the design baseline for the implementing child issue.

## 4. Component Design

### 4.1 `validate.ts` (pure functions)

- `validateAmount(amount: MinorUnits): IntercompanyTransferError | null`
- `validateDistinctEntities(sourceId: string, targetId: string): IntercompanyTransferError | null`
- `validateCurrencyMatch(sourceCurrency: CurrencyCode, targetCurrency: CurrencyCode): IntercompanyTransferError | null`
- Composed by `validateRequest(request, context)` returning either `null`
  (valid) or the first applicable `IntercompanyTransferError`, per SRS FR-2
  through FR-5 and FR-10 (balance check delegated to context lookups, not
  hardcoded state).

### 4.2 `stateMachine.ts`

- Exposes pure transition functions, e.g.
  `transitionToValidated(record)`, `transitionToPosted(record, entries)`,
  `transitionToRejected(record, error)`, `transitionToReversed(record, reversalEntries)`.
- Each transition function asserts the precondition state (e.g. `POSTED` is
  only reachable from `VALIDATED`) and throws a programming-error exception
  (not a domain `IntercompanyTransferError`) if violated, since that
  indicates a caller bug rather than a business rejection.

### 4.3 `ledgerAdapter.ts` (persistence boundary)

- Interface `LedgerAdapter` with:
  - `findByRequestId(requestId: string): Promise<IntercompanyTransferRecord | null>`
  - `postBalancedEntries(input: PostInput): Promise<{ sourceEntryId: string; targetEntryId: string }>`
    implemented atomically (single DB transaction) by the concrete adapter.
  - `reverseEntries(input: ReverseInput): Promise<{ sourceEntryId: string; targetEntryId: string }>`
- The domain service depends only on this interface, enabling an in-memory
  fake adapter for unit tests without a live database.

### 4.4 `intercompanyTransferService.ts` (orchestration)

- `submitTransfer(request, adapter): Promise<IntercompanyTransferRecord | IntercompanyTransferError>`
  1. Look up `requestId` via `adapter.findByRequestId`; if found and payload
     matches, return the existing record (idempotent replay, FR-7).
  2. If found with a differing payload, return `DUPLICATE_REQUEST`.
  3. Otherwise run `validateRequest`; on failure, persist/return a
     `REJECTED` record with the error.
  4. On success, call `adapter.postBalancedEntries` and transition the
     record to `POSTED`.
- `reverseTransfer(requestId, adapter): Promise<IntercompanyTransferRecord | IntercompanyTransferError>`
  mirrors the above for the `POSTED → REVERSED` transition (FR-8).

## 5. Error Handling Strategy

- Domain rejections (FR-2..FR-5, FR-7 duplicate conflict, FR-10 balance)
  are returned as typed `IntercompanyTransferError` values — never thrown —
  so callers can pattern-match without try/catch.
- Infrastructure failures (adapter throwing due to DB unavailability) are
  allowed to propagate as exceptions; the service layer does not swallow
  them, preserving the distinction required by SRS/contract Section 7.

## 6. Concurrency Design

- Uniqueness of `requestId` is enforced at the persistence layer (e.g. a
  unique index), not merely in application memory, so that concurrent
  duplicate submissions cannot both succeed.
- `postBalancedEntries` is implemented as a single atomic unit at the
  adapter level (e.g. one DB transaction wrapping both entry inserts),
  satisfying NFR-3.

## 7. Test Strategy (for the future implementing issue)

- All test files will use vitest:
  `import { describe, expect, it } from 'vitest'`.
- `validate.test.ts` — table-driven cases asserting real error codes for
  each invalid input (same-entity, non-positive amount, currency mismatch,
  unknown entity), and `null` for valid input; no placeholder assertions.
- `stateMachine.test.ts` — asserts actual resulting `status` and entry IDs
  after each transition, and that invalid preconditions throw.
- `intercompanyTransferService.test.ts` — uses an in-memory fake
  `LedgerAdapter` to assert: successful post produces two entries; replay
  with identical `requestId`+payload returns the same record without a
  second adapter call; replay with a different payload returns
  `DUPLICATE_REQUEST`; reversal after posting produces compensating entries
  and never mutates the original two.

## 8. Traceability Matrix

| SRS Requirement               | Design Element                                                       |
| ----------------------------- | -------------------------------------------------------------------- |
| FR-1                          | `IntercompanyTransferRequest` type (contract §3)                     |
| FR-2, FR-3, FR-4, FR-5, FR-10 | `validate.ts`                                                        |
| FR-6, NFR-3                   | `ledgerAdapter.postBalancedEntries` (atomic)                         |
| FR-7                          | `intercompanyTransferService.submitTransfer` idempotent replay path  |
| FR-8                          | `stateMachine.transitionToReversed` + `ledgerAdapter.reverseEntries` |
| FR-9                          | `ledgerAdapter.findByRequestId`                                      |
| NFR-1                         | Strict TypeScript across all listed future files, no `any`           |
| NFR-4, NFR-5                  | Pure domain modules + vitest test strategy (Section 7)               |
| NFR-6                         | Section 9 — excluded scope reaffirmed                                |

## 9. Excluded Scope (reaffirmed)

- No closure of parent issue #1936.
- No bulk GitHub mutations.
- No destructive database operations.
- No production secret rewrites.

## 10. Rollback Note

This SDD, together with the SRS and contract, is a documentation-only
deliverable. Reverting is limited to deleting the four files added under
issue #2434; no source code, schema, or CI configuration depends on this
document, so rollback has no runtime impact.
