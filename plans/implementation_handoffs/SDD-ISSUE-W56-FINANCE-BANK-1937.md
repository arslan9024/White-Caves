# SDD — Finance Engine Bank Reconciliation

- Document ID: `SDD-ISSUE-W56-FINANCE-BANK-1937`
- Parent issue: #1937
- Child issue: #2430
- Module: `src/features/finance/financeEngineBankReconciliation/`
- Companion SRS: `plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-BANK-1937.md`

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
