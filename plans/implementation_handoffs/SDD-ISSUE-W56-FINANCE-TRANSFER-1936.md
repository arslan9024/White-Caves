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

### 7.0 Completion evidence (child issue #2433 — runtime implementation)

- Created `src/features/finance/financeEngineIntercompanyTransfer/financeEngineIntercompanyTransfer.logic.ts`,
  implementing FR-1 through FR-9 and NFR-1 through NFR-5: request validation
  in the fixed order specified in §3.1, a pluggable `IdempotencyStore`
  (§3.2), atomic debit/credit posting via a pluggable `LedgerPoster` (§3.3),
  integer-minor-units money representation (§3.4), and no `any` types with a
  closed `RejectionReason` union (§3.5). In-memory reference implementations
  of every pluggable dependency (`EntityDirectory`, `AuthorizationChecker`,
  `IdempotencyStore`, `LedgerPoster`, `IdGenerator`, `Clock`) are exported
  alongside the engine factory so the module is independently usable and
  testable without introducing a new persistence dependency.
- Created `src/features/finance/financeEngineIntercompanyTransfer/financeEngineIntercompanyTransfer.logic.test.ts`
  with 12 `vitest` cases covering: each rejection reason individually
  (`SAME_ENTITY`, `NON_POSITIVE_AMOUNT`, `UNSUPPORTED_CURRENCY`,
  `UNKNOWN_ENTITY`, `INSUFFICIENT_AUTHORIZATION`), fixed rejection-order
  precedence, successful posting of exactly two correctly-directed entries
  sharing a `requestId`, idempotent replay (identical result, no second
  posting, identical entry ids), equal-and-opposite reversal without
  mutating original entries, idempotent reversal replay, and reversal
  failure for a `requestId` that was never posted or was rejected.
- Deviation from the SDD §2 target layout: a single consolidated
  `*.logic.ts`/`*.logic.test.ts` pair was used instead of separate
  `.types.ts`/`.validate.ts`/`.service.ts` files, per the concrete file list
  assigned to this child issue. All design decisions in §3 (validation
  order, pluggable idempotency store, atomic posting, integer minor units,
  no `any`) are preserved exactly; only the physical file split differs from
  the illustrative (non-binding) layout in §2.
- Validated with `vitest` (12/12 passing) and `tsc --noEmit` (no errors
  attributable to the new files), run from a temporary copy under the real
  `src/` tree and removed immediately after validation; no repository state
  was left behind by the validation step.
- No existing exports were modified; this issue only adds new files.
- No new dependencies were added.
- Parent issue #1936 remains open; this is one reconciled child work item
  under it, not a closure of the parent.

### 7.4 Completion evidence (child issue #2432 — shared domain types)

- Created `src/features/finance/financeEngineIntercompanyTransfer/financeEngineIntercompanyTransfer.types.ts`,
  a standalone, side-effect-free module containing: the `SUPPORTED_CURRENCIES`
  allow-list and `Currency` type with an `isSupportedCurrency` guard (FR-4); the
  closed `RejectionReason` union together with an ordered `REJECTION_REASONS`
  runtime constant matching the fixed evaluation order in §3.1, plus an
  `isRejectionReason` guard; the `LedgerDirection` union and `LEDGER_DIRECTIONS`
  constant; the `IntercompanyTransferRequest`, `LedgerEntry`,
  `PostedTransferResult`, `RejectedTransferResult`, `IntercompanyTransferResult`,
  and `ReversalResult` interfaces/types (FR-1, FR-7, FR-8); discriminating type
  guards `isPostedTransferResult`/`isRejectedTransferResult`; and pure result
  constructors `createRejectedResult`/`createPostedResult`. No `any` types are
  used anywhere in the file (§3.5), and money remains integer minor units
  end-to-end (§3.4, NFR-2).
- Created `src/features/finance/financeEngineIntercompanyTransfer/financeEngineIntercompanyTransfer.types.test.ts`
  with `vitest` cases asserting real behavior: currency allow-list membership
  (positive and negative cases, including a case-sensitivity check), the fixed
  rejection-reason ordering and guard behavior, ledger direction constants,
  and both result constructors/type guards narrowing correctly in both
  directions (a posted result is accepted by `isPostedTransferResult` and
  rejected by `isRejectedTransferResult`, and vice versa for a rejected
  result).
- Design decision: this file is deliberately independent of
  `financeEngineIntercompanyTransfer.logic.ts` — it does not import from, or
  modify, that module or its exports. The two files describe the same domain
  contract (by design, per SDD §2's illustrative future layout listing
  `.types.ts` as a separate file from the runtime module), but keeping them
  decoupled means a future dedicated `.validate.ts`/`.service.ts` split (per
  §2) can depend on this types module without a circular or redundant
  dependency on `.logic.ts`, and this issue's scope stays limited to adding
  new files with no risk of regressing the existing runtime module.
- Design decision: a small set of pure, side-effect-free runtime helpers
  (type guards and result constructors) were included alongside the type
  declarations, rather than shipping a pure `.d.ts`-style file with zero
  runtime code. Rationale: TypeScript interfaces/type aliases alone have no
  runtime representation and cannot be meaningfully asserted against by
  `vitest` with real behavior assertions (a stated technical requirement for
  this issue); colocating narrow, single-purpose guards/constructors with the
  types they discriminate is a common, low-risk pattern that keeps the file
  free of business logic (validation ordering, entity lookups, posting,
  idempotency) which remains reserved for the future `.validate.ts`/`.service.ts`
  modules described in §2.
- Validated with `vitest` and `tsc --noEmit` from within the sandboxed staging
  copy of these two new files; no repository state outside the listed files
  was modified.
- No existing exports were modified; this issue only adds new files.
- No new dependencies were added.
- Parent issue #1936 remains open; this is one reconciled child work item
  under it, not a closure of the parent.

### 7.5 Rollback note (child issue #2432)

This change is purely additive: one new types module plus one new test file,
and documentation updates to this SDD and the companion SRS. To roll back:

1. Delete `src/features/finance/financeEngineIntercompanyTransfer/financeEngineIntercompanyTransfer.types.ts`
   and `financeEngineIntercompanyTransfer.types.test.ts`.
2. Revert §7.4 of this file and the corresponding acceptance-criteria note in
   the companion SRS (§5.2) to their prior state, or delete those additions.
3. No other files were modified; `financeEngineIntercompanyTransfer.logic.ts` and
   its test file are untouched, so no downstream consumer can be affected by a
   rollback.
4. No database, dependency, or configuration changes were made, so no further
   reversal steps (e.g. migrations, secret rotations) are required.

Rollback is low-risk: the new types module is not yet imported/consumed by
`financeEngineIntercompanyTransfer.logic.ts` or by any other file in the
repository, so removing it cannot regress any existing behavior. Parent issue
#1936 remains open regardless of whether this rollback is applied.

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

### 7.3 Rollback note (child issue #2433)

This change is purely additive runtime code plus documentation updates. To roll back:

1. Delete `src/features/finance/financeEngineIntercompanyTransfer/financeEngineIntercompanyTransfer.logic.ts`
   and `financeEngineIntercompanyTransfer.logic.test.ts`.
2. Revert §7.0 of this file and the corresponding acceptance-criteria note in the
   companion SRS (§5) to their prior state, or delete those additions.
3. No other files were modified; no exports outside this module's own two new files
   were added, changed, or removed, so no downstream consumer can be affected by a
   rollback.
4. No database, dependency, or configuration changes were made, so no further
   reversal steps (e.g. migrations, secret rotations) are required.

Rollback is low-risk: the module is not yet imported/consumed anywhere else in the
codebase, so removing it cannot regress any existing behavior. Parent issue #1936
remains open regardless of whether this rollback is applied.

## 8. Traceability

- Requirements: `SRS-ISSUE-W56-FINANCE-TRANSFER-1936.md`
- Contract: `src/features/finance/financeEngineIntercompanyTransfer/financeEngineIntercompanyTransfer.contract.md`
- Parent issue: #1936 (remains open pending reconciliation of all child work).
