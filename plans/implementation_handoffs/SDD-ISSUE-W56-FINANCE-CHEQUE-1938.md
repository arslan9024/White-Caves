# SDD — Finance Engine Cheque Registry

- Handoff ID: SDD-ISSUE-W56-FINANCE-CHEQUE-1938
- Issue: #2426
- Parent issue: #1938 (remains open — not closed by this handoff)
- Companion document: `SRS-ISSUE-W56-FINANCE-CHEQUE-1938.md`

## 1. Design Overview

The Cheque Registry is designed as an isolated sub-module under
`src/features/finance/financeEngineChequeRegistry/`. This pass delivers only the
contract (`financeEngineChequeRegistry.contract.md`) and planning documents; no
runtime code is introduced yet, keeping the change surgical and reviewable.

The design below describes how a future implementation should be structured so
that it satisfies the contract without further architectural decisions being
required.

## 2. Module Layout (target, for future implementation)

```
src/features/finance/financeEngineChequeRegistry/
├── financeEngineChequeRegistry.contract.md   # data/behavior contract (this pass)
├── README.md                                 # module overview (this pass)
├── types.ts                                  # ChequeStatus, ChequeRecord (future)
├── validation.ts                             # field + transition validation (future)
├── chequeRegistry.service.ts                 # in-memory/service implementation (future)
├── chequeRegistry.errors.ts                  # typed error classes (future)
└── __tests__/
    └── chequeRegistry.service.test.ts        # vitest suite (future)
```

## 3. Design Decisions

### 3.1 Monetary amounts stored as integer minor units

**Decision**: `amountMinor: number` (integer) rather than a floating-point major
unit amount.
**Rationale**: Floating-point arithmetic on currency values is a well-known source
of rounding defects. Storing minor units (fils/cents) as integers avoids this class
of bug entirely and is consistent with how other Finance Engine sub-modules should
represent money.

### 3.2 Explicit finite-state lifecycle

**Decision**: Cheque status transitions are defined as a fixed adjacency list
(`RECEIVED -> DEPOSITED, CANCELLED`, etc.) rather than allowing arbitrary status
writes.
**Rationale**: Cheque lifecycle in finance operations has real-world legal/audit
significance (e.g., a cleared cheque can never revert to "received"). Enforcing
transitions at the contract level prevents invalid state from ever being persisted,
and makes the eventual service implementation's transition-guard logic
straightforward to test exhaustively (finite transition table).

### 3.3 Duplicate detection scoped to (chequeNumber, bankName, counterparty) while non-terminal

**Decision**: Only cheques in non-terminal states count toward duplicate detection.
**Rationale**: Real cheque numbers can legitimately repeat over time for the same
counterparty/bank once a prior cheque has reached a terminal state (`CLEARED` or
`CANCELLED`). Scoping the duplicate check to active (non-terminal) records avoids
false-positive rejections while still catching genuine double-entry mistakes.

### 3.4 Documentation-only delivery for this issue

**Decision**: This pass ships only markdown artifacts (contract, README, SRS, SDD),
not a runtime service.
**Rationale**: The issue's file list is explicitly documentation/contract files.
Introducing runtime TypeScript modules, Prisma migrations, or Redux slices not
requested by the issue would expand scope beyond the declared child boundary and
risk touching files outside the approved list. Future child issues under #1938
should implement the service using this contract as the binding interface.

## 4. Validation & Test Strategy (for future implementation)

When the runtime module is implemented, tests MUST:

- Use `import { describe, expect, it } from 'vitest'`.
- Assert real behavior: e.g. `expect(result.status).toBe('DEPOSITED')` after a
  valid `RECEIVED -> DEPOSITED` transition, and
  `expect(() => transition(cheque, 'CLEARED')).toThrow('CHEQUE_ILLEGAL_TRANSITION')`
  for an illegal `RECEIVED -> CLEARED` jump.
- Cover: field validation failures (each rule in the contract), every legal
  transition, at least one illegal transition per state, duplicate detection, and
  query filtering/sorting.
- Avoid placeholder assertions (`expect(true).toBe(true)`).

Required validation commands for this documentation-only pass: none (no TypeScript
source was added or modified). Future implementation PRs must run the project's
existing lint/typecheck/test commands (e.g. `npm run typecheck`, `npm run test`)
scoped to the new files.

## 5. Rollback Plan

This handoff introduces only new markdown files; nothing else in the repository
references them. Rollback is a straight deletion of:

- `src/features/finance/financeEngineChequeRegistry/financeEngineChequeRegistry.contract.md`
- `src/features/finance/financeEngineChequeRegistry/README.md`
- `plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-CHEQUE-1938.md`
- `plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-CHEQUE-1938.md`

No database migration, dependency change, or production configuration is touched,
so rollback carries no data-loss or downtime risk.

## 6. Completion Evidence

- Contract document defines full entity shape, lifecycle, validation, query, and
  error contracts (see `financeEngineChequeRegistry.contract.md`).
- README documents scope boundaries and explicitly excludes parent-issue closure,
  bulk GitHub mutation, destructive DB operations, and secret rewrites.
- This SDD and its companion SRS record the design rationale and traceability back
  to issue #2426 and parent issue #1938.
- Parent issue #1938 is not modified or closed by this work.
