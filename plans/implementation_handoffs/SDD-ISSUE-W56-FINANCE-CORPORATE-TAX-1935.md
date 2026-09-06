# Software Design Document (SDD)

**Handoff ID:** SDD-ISSUE-W56-FINANCE-CORPORATE-TAX-1935
**Child issue:** #2441
**Parent issue:** #1935 (open; not closed by this handoff)
**Feature area:** Finance — UAE Corporate Tax Engine
**Module:** `src/features/finance/financeEngineUaeCorporate/`
**Paired requirements doc:** `SRS-ISSUE-W56-FINANCE-CORPORATE-TAX-1935.md`

## 1. Design Overview

The UAE Corporate Tax engine is designed as a stateless, pure-function module living at
`src/features/finance/financeEngineUaeCorporate/`. It has no dependency on persistence,
network, or framework-specific code, which keeps it independently testable and reusable
across server-side reporting jobs and any future client-side estimation tooling.

## 2. Module Layout (target, for the implementation PR)

```
src/features/finance/financeEngineUaeCorporate/
├── financeEngineUaeCorporate.contract.md   # public interface + invariants (this handoff)
├── README.md                                # module overview (this handoff)
├── financeEngineUaeCorporate.types.ts        # (future) shared type definitions
├── financeEngineUaeCorporate.rates.ts        # (future) versioned rate table constants
├── financeEngineUaeCorporate.ts              # (future) calculate() implementation
└── financeEngineUaeCorporate.test.ts         # (future) vitest unit tests
```

Only the two markdown files above are introduced by this handoff. The `.ts` files are
the design target for the subsequent implementation child issue and are documented here
for continuity.

## 3. Design Decisions

### 3.1 Pure function over class/service

**Decision:** Model the engine as a single pure function (`calculate`) rather than a
stateful class or injected service.
**Rationale:** Tax calculation has no side effects and no dependency on runtime state;
a pure function is trivially unit-testable, has no lifecycle to manage, and avoids
introducing an unnecessary DI abstraction for a deterministic computation.

### 3.2 Versioned rate table over hard-coded constants

**Decision:** The 9% rate and AED 375,000 threshold are passed/resolved via a
`rateTableVersion` rather than hard-coded inline in the calculation function.
**Rationale:** UAE Corporate Tax rates and thresholds are set by federal legislation and
can change. Versioning the rate table allows historical recalculation/audit against the
rate table that was actually in effect at the time, without needing to change the
function contract when rates change.

### 3.3 AED-only currency constraint

**Decision:** Restrict `currency` to the literal type `'AED'` rather than a generic
string, and reject any other value at the validation boundary.
**Rationale:** UAE Corporate Tax is computed in AED; accepting arbitrary currencies would
silently produce incorrect tax figures if a caller passed unconverted foreign-currency
amounts. A literal type makes the constraint enforceable at compile time in addition to
runtime validation.

### 3.4 Floor negative taxable income at zero

**Decision:** `taxableIncome` is floored at 0 rather than allowed to go negative.
**Rationale:** Negative taxable income has no meaningful corporate tax interpretation in
this context (no tax refund mechanism is in scope); flooring avoids downstream
consumers needing to special-case negative values.

## 4. Interaction with Existing Finance Module

This engine is designed to be additive and side-effect free relative to the existing
finance module. It does not modify any existing exported symbols, routes, or database
models. Integration points (e.g., wiring the engine into a reporting job or dashboard
API) are explicitly deferred to a future issue and are out of scope for #2441.

## 5. Testing Strategy (for the implementation PR)

- Framework: vitest (`import { describe, expect, it } from 'vitest'`).
- Real behavior assertions only — no placeholder `expect(true).toBe(true)` style tests.
- Required coverage:
  - Standard-rate calculation above the relief threshold.
  - Exact boundary at AED 375,000 (relief applies) and AED 375,001 (relief does not
    apply, tax computed only on the excess).
  - Zero and negative accounting profit (taxable income floored at 0, tax due 0).
  - `rateTableVersion` pass-through and immutability of input object.
  - Rejection of non-`'AED'` currency values.

## 6. Risks and Mitigations

| Risk                                               | Mitigation                                                                                   |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Legislative rate changes after implementation      | Rate table versioning (§3.2) isolates rate values from the calculation contract.             |
| Incorrect rounding causing audit discrepancies     | NFR-4 in the paired SRS mandates 2-decimal-place rounding matching AED accounting precision. |
| Scope creep into persistence/reporting integration | Explicitly deferred per §4; tracked as future work, not part of #2441.                       |

## 7. Completion Evidence

- This SDD and its paired SRS constitute the completion evidence for the documentation
  scope of child issue #2441.
- The implementation PR that follows must reference this SDD ID
  (`SDD-ISSUE-W56-FINANCE-CORPORATE-TAX-1935`) and attach its own validation command
  output (typecheck/lint/test) as completion evidence.

## 8. Rollback Note

This handoff introduces only markdown documentation. To roll back, revert this file and
its paired SRS/contract/README files; there is no code, migration, or configuration
change to undo, and no runtime behavior is affected. Parent issue #1935 is unaffected
and remains open.
