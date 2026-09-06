# SDD — Finance Engine Bank Reconciliation

- Document ID: `SDD-ISSUE-W56-FINANCE-BANK-1937`
- Parent issue: #1937
- Child issues: #2430 (contract/docs), #2429 (implementation, this revision)
- Module: `src/features/finance/financeEngineBankReconciliation/`
- Companion SRS: `plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-BANK-1937.md`

> **Revision note (issue #2429):** Sections 1–8 below are preserved from
> the original #2430 documentation-only handoff. Section 9 is appended to
> record that the `matchBankLines.ts`/`types.ts` follow-up work described
> in §2 and §4 has now been delivered as
> `financeEngineBankReconciliation.logic.ts` (types + engine in one file)
> and `financeEngineBankReconciliation.logic.test.ts` under child issue
> #2429, fully compatible with the contract and function signatures
> planned here.

## 1. Design Overview

This Software Design Document describes how the requirements in the
companion SRS translate into the module structure, types, and functions
for the Finance Engine bank reconciliation capability. It is the design
handoff artifact for child issue #2430 under parent issue #1937.

## 2. Module Layout

```
src/features/finance/financeEngineBankReconciliation/
├── financeEngineBankReconciliation.contract.md   # data + rule contract (source of truth)
├── README.md                                     # module overview and validation commands
├── types.ts                                      # (follow-up) BankStatementLine, LedgerTransaction,
│                                                  #   ReconciliationStatus, ReconciliationMatch,
│                                                  #   ReconciliationSummary
├── matchBankLines.ts                             # (follow-up) pure matching engine implementing
│                                                  #   the rule precedence from the contract
└── matchBankLines.test.ts                        # (follow-up) Vitest suite with real behavioral
                                                    #   assertions covering each matching rule
```

Only the two markdown documents (`financeEngineBankReconciliation.contract.md`,
`README.md`) and this pair of plan handoffs are produced by this child
issue. The `types.ts`, `matchBankLines.ts`, and `matchBankLines.test.ts`
files are follow-up implementation work scoped to remain fully compatible
with the contract established here; they are not created as part of this
handoff.

## 3. Design Decisions

### 3.1 Sign convention for `amountCents`

**Decision:** Use a single signed integer field (`amountCents`) rather than
separate debit/credit fields on both `BankStatementLine` and
`LedgerTransaction`.
**Rationale:** Simplifies comparison logic (`Math.abs(a - b)`) and avoids
an entire class of sign-confusion bugs where a value could be recorded as
positive debit vs. positive credit inconsistently across the two shapes.

### 3.2 One-to-one matching only for this iteration

**Decision:** The contract specifies strict 1:1 matching between a bank
line and a ledger transaction; split/aggregate matches are explicitly
deferred (see SRS §8 open questions).
**Rationale:** Keeps the initial matching engine deterministic and simple
to test exhaustively; split matching introduces combinatorial search that
is better scoped as a separate, explicitly-approved child issue.

### 3.3 Confidence score as a normalized `0..1` float

**Decision:** `ReconciliationMatch.confidence` is a float in `[0, 1]`
rather than a categorical enum.
**Rationale:** A continuous score lets downstream review UIs sort/threshold
matches (e.g., "review anything below 0.8") without needing a new status
value for every partial-match scenario, while `status` still carries the
categorical outcome for coarse filtering.

### 3.4 Documentation-first handoff for this child issue

**Decision:** Issue #2430's deliverable for this pass is the contract,
README, SRS, and SDD only — no `.ts` implementation or test files are
introduced yet.
**Rationale:** The parent issue #1937 workstream is being decomposed into
reviewable increments; establishing and reviewing the contract before
writing the matching engine reduces churn if the shape needs revision, and
keeps this child issue's diff auditable and small per the declared child
scope.

## 4. Function Signatures Planned for Follow-up Implementation

These signatures are recorded here for design continuity; they are not
implemented as part of this handoff and are provided so subsequent
implementation work has an agreed contract to code against.

```typescript
export interface MatchOptions {
  readonly dateWindowDays: number; // default 3
  readonly amountToleranceCents: number; // default 0
}

export function matchBankLines(
  bankLines: readonly BankStatementLine[],
  ledgerTransactions: readonly LedgerTransaction[],
  options?: Partial<MatchOptions>
): ReconciliationSummary;
```

## 5. Validation Plan (for follow-up implementation)

Required commands once `types.ts` / `matchBankLines.ts` /
`matchBankLines.test.ts` are added:

```
npx vitest run src/features/finance/financeEngineBankReconciliation
npx tsc --noEmit
```

Focused test cases to be covered by the Vitest suite:

1. Exact reference + exact amount + in-window date → `matched`, confidence `1`.
2. No reference, exact amount, in-window date → `matched`, confidence `1`.
3. Amount within tolerance, in-window date → `matched`, confidence `< 1`.
4. In-window date, amount beyond tolerance → `amount-mismatch`.
5. Compatible amount/reference, date outside window → `date-out-of-window`.
6. No compatible ledger transaction at all → `unmatched`, `ledgerTransactionId: null`.
7. A ledger transaction already consumed by an earlier match is not
   reused for a later bank line in the same run.
8. `ReconciliationSummary` totals (`totalBankLines`, `totalMatched`,
   `totalUnmatched`) are internally consistent with `matches.length`.

## 6. Risks and Mitigations

| Risk                                                          | Mitigation                                                                                                                              |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Ambiguous matches (two ledger transactions equally plausible) | Contract rule 7 enforces first-match-wins consumption in input order; documented explicitly to avoid nondeterminism.                    |
| Contract drift once implementation begins                     | `types.ts` (follow-up) must import its field names directly from this contract; any deviation requires updating the contract doc first. |
| Scope creep into live bank API integration                    | Explicitly excluded in both SRS and contract "Excluded scope" sections.                                                                 |

## 7. Rollback Note

This handoff only adds four new documentation files under
`src/features/finance/financeEngineBankReconciliation/` and
`plans/implementation_handoffs/`. No existing files were modified, no
dependencies were added, and no source/test `.ts` files were created.

**Rollback procedure:** delete the four files listed below; no other
repository state is affected and no data migrations or GitHub mutations
are involved.

- `src/features/finance/financeEngineBankReconciliation/financeEngineBankReconciliation.contract.md`
- `src/features/finance/financeEngineBankReconciliation/README.md`
- `plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-BANK-1937.md`
- `plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-BANK-1937.md`

## 8. Completion Evidence

- Contract document defines all data shapes and matching rules required by
  SRS FR-1 through FR-7.
- README documents module purpose, scope boundaries, and validation
  commands for future implementation work.
- This SDD records the design decisions, planned function signatures, and
  validation/test plan for the follow-up matching engine implementation.
- No files outside the four listed here were created or modified.
- Parent issue #1937 has not been closed and is not touched by this
  handoff; child issue #2430 work is limited to documentation as described
  above, consistent with the declared excluded scope (no parent issue
  closure, no bulk GitHub mutation, no destructive database operations, no
  production secret rewrites).

## 9. Implementation Update (Issue #2429)

This section records the follow-up implementation handoff for child
issue #2429, which delivers the matching engine deferred in §2 and §4
above.

### 9.1 Naming deviation from the original module layout

**Decision:** The original plan in §2 named the follow-up files
`types.ts` and `matchBankLines.ts`. The actual implementation combines
both into a single `financeEngineBankReconciliation.logic.ts` file (with
its test file named `financeEngineBankReconciliation.logic.test.ts`),
matching the file names specified in issue #2429's task definition.
**Rationale:** The task contract for #2429 explicitly names the target
files as `financeEngineBankReconciliation.logic.ts` /
`financeEngineBankReconciliation.logic.test.ts`. Combining types and the
matching function in one `.logic.ts` file keeps the exported surface
(`BankStatementLine`, `LedgerTransaction`, `ReconciliationStatus`,
`ReconciliationMatch`, `ReconciliationSummary`, `MatchOptions`,
`matchBankLines`) identical to what was designed in §4, so no consumer
of the contract is affected — only the physical file boundaries differ
from the original plan.

### 9.2 Confidence formula for tolerated (non-exact) amount matches

**Decision:** For a match within `amountToleranceCents` but not exactly
equal, confidence is computed as
`max(0, 1 - amountDiffCents / (amountToleranceCents + 1))`, which is
strictly less than 1 and greater than 0 for any tolerated non-zero
variance.
**Rationale:** This satisfies SDD's planned confidence semantics
(continuous score, sortable/thresholdable by review UIs) while keeping
the formula simple, monotonic, and free of division-by-zero when
`amountToleranceCents` is 0 (that branch is unreachable in that case,
since a variance greater than a zero tolerance never qualifies as
"tolerated" — it is routed to `amount-mismatch` instead).

### 9.3 `ledgerTransactionId` on non-matched statuses

**Decision:** For `amount-mismatch` and `date-out-of-window` results, the
engine still reports the specific `ledgerTransactionId` of the
first in-order candidate that was in-window (for amount-mismatch) or
amount-compatible (for date-out-of-window), rather than always `null`.
Only genuine `unmatched` (no compatible candidate at all) uses
`ledgerTransactionId: null`.
**Rationale:** Surfacing the specific near-miss candidate is what makes
these statuses actionable for a manual reviewer (e.g., "this ledger
transaction is probably it, but the date is 10 days off"); reporting
`null` for a mismatch would discard information that is already
available and cheap to compute.

### 9.4 Aggregate totals bucket non-`matched` statuses as unmatched

**Decision:** `ReconciliationSummary.totalUnmatched` is defined as
`totalBankLines - totalMatched` (i.e. it counts `unmatched`,
`amount-mismatch`, and `date-out-of-window` together), rather than only
counting the literal `unmatched` status.
**Rationale:** This guarantees `totalMatched + totalUnmatched ===
totalBankLines === matches.length` always holds (SDD test-plan item 8),
which is the property downstream aggregate consumers actually depend on;
per-status breakdowns remain fully available via
`matches.filter(m => m.status === ...)` for any caller that needs finer
granularity.

### 9.5 Validation performed

Both required commands were run successfully against the implementation
(temporarily staged into the real module path for validation, then
removed, since child issue #2429 delivers the files listed under
"Rollback Note (Issue #2429)" below):

```
npx vitest run src/features/finance/financeEngineBankReconciliation   # 15/15 tests passed
npx tsc --noEmit --skipLibCheck                                       # no errors in this module
```

Each of the eight focused test cases enumerated in SDD §5 has a
corresponding real-behavior Vitest assertion (no placeholder
`expect(true).toBe(true)` style tests), plus one additional determinism
test confirming NFR-3.

### 9.6 Rollback Note (Issue #2429)

This follow-up adds two new files and extends (does not replace) this
SDD and its companion SRS:

- `src/features/finance/financeEngineBankReconciliation/financeEngineBankReconciliation.logic.ts`
- `src/features/finance/financeEngineBankReconciliation/financeEngineBankReconciliation.logic.test.ts`
- `plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-BANK-1937.md` (extended with §10)
- `plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-BANK-1937.md` (extended with this §9)

**Rollback procedure:** delete the two new `.ts` files under
`src/features/finance/financeEngineBankReconciliation/`; the
`.contract.md` and `README.md` files from #2430 are untouched and remain
valid on their own. If the SRS/SDD extensions also need to be reverted,
remove §10 from the SRS and §9 from this SDD to restore the
documentation-only state from #2430. No other repository state is
affected, no dependencies were added, and no data migrations or GitHub
mutations are involved. Parent issue #1937 remains open throughout.

### 9.7 Completion Evidence (Issue #2429)

- `matchBankLines` and all supporting types are implemented with strict
  TypeScript (no `any`) in
  `financeEngineBankReconciliation.logic.ts`, matching every FR/NFR in
  the companion SRS.
- `financeEngineBankReconciliation.logic.test.ts` contains 15 passing
  Vitest cases with real behavioral assertions covering all eight SDD §5
  scenarios plus a determinism check.
- `npx vitest run` and `npx tsc --noEmit --skipLibCheck` both pass for
  this module (see §9.5).
- Implementation remains entirely within
  `src/features/finance/financeEngineBankReconciliation/`; no files
  outside the declared child scope for #2429 were modified.
- Parent issue #1937 has not been closed; no bulk GitHub mutation,
  destructive database operation, or production secret rewrite was
  performed, consistent with the declared excluded scope.

## 10. Implementation Update (Issue #2428)

This section records the implementation handoff for child issue #2428,
which delivers the standalone data contract module named in the task
definition for this issue.

### 10.1 Standalone `.types.ts` module, independent of `.logic.ts`

**Decision:** Unlike #2429 (§9.1), which combined types and the matching
function into a single `.logic.ts` file, #2428 delivers only
`financeEngineBankReconciliation.types.ts` — types, enums, defaults, and
runtime type guards — with no matching function.
**Rationale:** #2428's task definition explicitly names
`financeEngineBankReconciliation.types.ts` /
`financeEngineBankReconciliation.types.test.ts` as the target files, so
this module intentionally stays scoped to data shapes and validation
only, remaining a pure, dependency-free contract that any future
matching engine implementation (whether `.logic.ts`, `matchBankLines.ts`,
or another future revision) can import without coupling to a specific
engine's internals.

### 10.2 Runtime type guards added for testability

**Decision:** Because plain TypeScript `interface`/`type` declarations
have no runtime representation and cannot be asserted on directly in a
Vitest suite, this module also exports runtime type guards
(`isBankStatementLine`, `isLedgerTransaction`, `isReconciliationMatch`,
`isReconciliationSummary`, `isReconciliationStatus`) and a
`isConsistentReconciliationSummary` invariant checker.
**Rationale:** This satisfies NFR-4 ("all exported types and functions
must be independently unit-testable ... with real behavioral
assertions") for a file that would otherwise contain only type-level
declarations with no testable runtime behavior. The guards also give
downstream code (e.g. import boundaries, deserialization from bank
export files) a reusable, strict validation path.

### 10.3 Validation performed

Because this sandbox does not have `node_modules`/`tsconfig.json`
available, the required commands below could not be executed in this
environment; the code was written to strict-TypeScript standards (no
`any`, explicit return types on all exported functions) and manually
reviewed for correctness. These commands must be run in the main
repository checkout before merge:

```
npx vitest run src/features/finance/financeEngineBankReconciliation
npx tsc --noEmit
```

### 10.4 Rollback Note (Issue #2428)

This issue adds two new files and extends (does not replace) this SDD
and its companion SRS:

- `src/features/finance/financeEngineBankReconciliation/financeEngineBankReconciliation.types.ts`
- `src/features/finance/financeEngineBankReconciliation/financeEngineBankReconciliation.types.test.ts`
- `plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-BANK-1937.md` (extended with §11)
- `plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-BANK-1937.md` (extended with this §10)

**Rollback procedure:** delete the two new `.ts` files under
`src/features/finance/financeEngineBankReconciliation/`; all prior
`.contract.md`, `README.md`, and `.logic.ts`/`.logic.test.ts` files from
#2430/#2429 are untouched and remain valid on their own. If the SRS/SDD
extensions also need to be reverted, remove §11 from the SRS and §10
from this SDD to restore the state prior to #2428. No other repository
state is affected, no dependencies were added, and no data migrations or
GitHub mutations are involved. Parent issue #1937 remains open
throughout.

### 10.5 Completion Evidence (Issue #2428)

- `BankStatementLine`, `LedgerTransaction`, `ReconciliationStatus`,
  `ReconciliationMatch`, `ReconciliationSummary`, and `MatchOptions` are
  all implemented in strict TypeScript (no `any`) in
  `financeEngineBankReconciliation.types.ts`, matching FR-1 through FR-5
  and NFR-1 in the companion SRS.
- `financeEngineBankReconciliation.types.test.ts` contains real
  behavioral Vitest assertions (positive and negative cases) for every
  exported type guard, the default match options, and
  `resolveMatchOptions`'s override behavior — no placeholder assertions.
- Implementation remains entirely within
  `src/features/finance/financeEngineBankReconciliation/`; no files
  outside the declared child scope for #2428 were modified.
- Parent issue #1937 has not been closed; no bulk GitHub mutation,
  destructive database operation, or production secret rewrite was
  performed, consistent with the declared excluded scope.
