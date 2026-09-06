# SDD — Finance Engine Intercompany Transfer

- **ID:** SDD-ISSUE-W56-FINANCE-TRANSFER-1936
- **Issue:** #2434
- **Parent issue:** #1936
- **Workstream:** W56 — Finance Engine
- **Document type:** Software Design Description (implementation handoff)
- **Companion:** `SRS-ISSUE-W56-FINANCE-TRANSFER-1936.md`

## 1. Overview

This SDD describes the design for satisfying the requirements in the companion SRS. It
is the handoff artifact enabling a future child issue under #1936 to implement the
runtime module at
`src/features/finance/financeEngineIntercompanyTransfer/` without re-deriving design
decisions.

## 2. Module Layout (target, for future implementation)

```
src/features/finance/financeEngineIntercompanyTransfer/
├── financeEngineIntercompanyTransfer.contract.md   (this issue — done)
├── README.md                                       (this issue — done)
├── financeEngineIntercompanyTransfer.types.ts       (future)
├── financeEngineIntercompanyTransfer.validate.ts    (future)
├── financeEngineIntercompanyTransfer.service.ts     (future)
└── financeEngineIntercompanyTransfer.test.ts        (future)
```

Only the two markdown artifacts listed as "this issue — done" are created by #2434.
The `.ts` files are explicitly out of scope for this issue and are called out here so
the next implementer has an unambiguous starting layout.

## 3. Design Decisions

### 3.1 Validation ordering

Validation rules (FR-2 through FR-5, FR-9) shall be evaluated in a fixed order so that
rejection reasons are deterministic and testable:

1. `SAME_ENTITY`
2. `NON_POSITIVE_AMOUNT`
3. `UNSUPPORTED_CURRENCY`
4. `UNKNOWN_ENTITY`
5. `INSUFFICIENT_AUTHORIZATION`
6. `DUPLICATE_REQUEST_ID` (checked last, since it requires a store lookup and is only
   meaningful once the request is otherwise well-formed)

**Rationale:** cheap, synchronous, purely structural checks (entity equality, amount
sign, currency membership) run before any I/O-bound checks (entity lookup,
authorization, idempotency store lookup). This keeps the common invalid-input path fast
and avoids unnecessary store round-trips for malformed requests.

### 3.2 Idempotency store

The idempotency check is designed as a pluggable interface
(`IdempotencyStore.get`/`.put`) rather than a concrete database dependency, so the
contract does not presuppose a specific persistence technology. **Rationale:** keeps
the contract stable regardless of which storage backend (SQL table, cache, etc.) the
implementation issue ultimately chooses, and avoids introducing new dependencies as
required by the excluded-scope constraints.

### 3.3 Atomic posting

The debit/credit pair is modeled as a single "posting" operation returning both entry
IDs or throwing, rather than two independent calls. **Rationale:** guarantees the
"exactly two entries or none" invariant (FR-7, NFR-4) cannot be violated by a caller
issuing only one half of the pair.

### 3.4 Money representation

Amounts are integers in minor units end-to-end; no `number` division/multiplication by
non-integer factors is permitted in the contract. **Rationale:** eliminates
floating-point rounding drift across two separate ledgers, which is a correctness
requirement for financial reconciliation (NFR-2).

### 3.5 No `any`

All interfaces are fully typed with no `any`, and rejection reasons are a closed
string-literal union rather than a free-form string. **Rationale:** enables exhaustive
`switch` handling in the future implementation and in any UI/reporting code that
branches on rejection reason, catching missing cases at compile time.

## 4. Sequence (informative)

1. Caller submits `IntercompanyTransferRequest`.
2. Validate structural rules (§3.1, steps 1–3).
3. Resolve both entities; reject `UNKNOWN_ENTITY` if either is missing.
4. Check caller authorization for `sourceEntityId`.
5. Check idempotency store for existing `requestId`; if present, return stored result.
6. Post debit + credit atomically; persist idempotency record.
7. Return `IntercompanyTransferResult` with `status: 'posted'`.

## 5. Testing Strategy (for the future implementation issue)

- `vitest` unit tests covering each rejection reason individually (one assertion per
  rule, using realistic fixture data, not placeholder `expect(true).toBe(true)`).
- A test asserting that a successful transfer produces exactly two ledger entries with
  correct debit/credit direction and shared `requestId` correlation.
- A test asserting idempotent replay: submitting the same `requestId` twice yields an
  identical result and does not create a second posting.
- A test asserting reversal produces an equal-and-opposite entry pair without mutating
  the original entries.

## 6. Risks and Mitigations

| Risk                                                                                   | Mitigation                                                                                                                   |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Future implementer conflates this contract with an existing intracompany transfer flow | README explicitly scopes this module to cross-entity transfers only.                                                         |
| Idempotency store choice introduces a new dependency                                   | Contract mandates a pluggable interface; implementation should reuse existing persistence already available in the codebase. |
| Floating-point amounts creep in via a UI layer sending major units                     | Contract mandates integer minor units at the boundary; conversion is a presentation-layer concern only.                      |

## 7. Completion Evidence & Rollback

### 7.1 Completion evidence (this issue, #2434)

- Created `src/features/finance/financeEngineIntercompanyTransfer/financeEngineIntercompanyTransfer.contract.md`.
- Created `src/features/finance/financeEngineIntercompanyTransfer/README.md`.
- Created `plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-TRANSFER-1936.md`.
- Created `plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-TRANSFER-1936.md` (this
  file).
- No runtime `.ts` source files were added or modified; no existing exports in the
  repository were touched, so no regression surface is introduced by this issue.
- No new dependencies were added.

### 7.2 Rollback note

This change is purely additive documentation (four new markdown files, one new empty
directory tree). To roll back:

1. Delete the four files listed in §7.1.
2. Remove the now-empty
   `src/features/finance/financeEngineIntercompanyTransfer/` directory if no other
   issue has since added files to it.
3. No database, dependency, or configuration changes were made, so no further reversal
   steps (e.g. migrations, secret rotations) are required.

Rollback is low-risk: since no runtime code, exports, or dependencies were touched,
reverting this commit cannot regress any existing behavior.

## 8. Traceability

- Requirements: `SRS-ISSUE-W56-FINANCE-TRANSFER-1936.md`
- Contract: `src/features/finance/financeEngineIntercompanyTransfer/financeEngineIntercompanyTransfer.contract.md`
- Parent issue: #1936 (remains open pending reconciliation of all child work).
