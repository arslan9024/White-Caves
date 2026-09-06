# SRS — Finance Engine FX Gain/Loss (Issue #2422)

- **Handoff ID**: SRS-ISSUE-W56-FINANCE-FX-1939
- **Child issue**: #2422
- **Parent issue**: #1939
- **Feature path**: `src/features/finance/financeEngineFxGain/`
- **Status**: Contract agreed; implementation pending in child scope

## 1. Purpose

This Software Requirements Specification defines what the FX gain/loss
calculation module of the finance engine must do. It is scoped strictly to
the child issue #2422 within the broader multi-currency finance engine effort
tracked by parent issue #1939.

## 2. Background

The finance engine records transactions that may be denominated in a
currency other than the organization's base reporting currency. When the
exchange rate used at settlement (or at a reporting valuation date) differs
from the rate used at original booking, the organization experiences a gain
or loss purely from currency movement, independent of the underlying
transaction economics. This must be tracked and reported accurately for
financial statements to be correct.

## 3. Functional Requirements

| ID   | Requirement                                                                                                                                                         |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-1 | The system SHALL compute realized FX gain/loss when a foreign-currency transaction is settled, given the original booking rate and the settlement rate.             |
| FR-2 | The system SHALL compute unrealized FX gain/loss for an open foreign-currency balance as of a valuation date, given the original booking rate and a valuation rate. |
| FR-3 | The system SHALL express gain/loss using the sign convention: positive = gain, negative = loss, computed as `currentBaseValue - originalBaseValue`.                 |
| FR-4 | The system SHALL round all monetary outputs to 2 decimal places (round-half-up) only at the final output boundary.                                                  |
| FR-5 | The system SHALL treat a rate of `0`, `NaN`, or a negative number as invalid input and SHALL throw a `RangeError` rather than silently coercing it.                 |
| FR-6 | The system SHALL return a gain/loss of exactly `0` when the foreign currency equals the base currency, regardless of the supplied rates.                            |
| FR-7 | The system SHALL be deterministic: identical inputs always produce identical outputs, with no reliance on system clock, randomness, or external I/O.                |

## 4. Non-Functional Requirements

| ID    | Requirement                                                                                |
| ----- | ------------------------------------------------------------------------------------------ |
| NFR-1 | Implementation SHALL be written in strict TypeScript with no `any` types.                  |
| NFR-2 | All exported functions SHALL be pure (no side effects, no network/database access).        |
| NFR-3 | Test coverage SHALL use vitest with real behavioral assertions covering FR-1 through FR-7. |
| NFR-4 | The module SHALL NOT introduce new runtime dependencies.                                   |

## 5. Constraints / Excluded Scope

Per issue #2422, the following are explicitly excluded from this child's
scope and MUST NOT be performed as part of implementing this SRS:

- Closing the parent issue (#1939).
- Bulk GitHub mutations of any kind.
- Destructive database operations.
- Production secret rewrites.

Additionally, out of functional scope for this child issue:

- Persistence layer / ORM models for FX transactions.
- API endpoints or UI components displaying FX gain/loss.
- Live exchange-rate retrieval from external providers (rates are always
  caller-supplied per FR-1/FR-2).

## 6. Acceptance Criteria

- [ ] Implementation remains within the declared child scope (this feature
      folder only; no changes to unrelated modules).
- [ ] Focused vitest tests covering FR-1 through FR-7 pass.
- [ ] Required validation commands (typecheck + focused test run) pass.
- [ ] Completion evidence (test run output, file diff summary) and a
      rollback note are recorded in the implementation handoff.
- [ ] Parent issue #1939 remains open until all sibling child issues under
      it are reconciled — this handoff does not close #1939.

## 7. Traceability

This SRS is the requirements source for `SDD-ISSUE-W56-FINANCE-FX-1939.md`
and for the functional contract defined in
`src/features/finance/financeEngineFxGain/financeEngineFxGain.contract.md`.

## 8. Implementation Addendum (Issue #2421)

- **Child issue**: #2421 (implementation child of parent #1939, sibling of
  documentation child #2422).
- Implementation was delivered as
  `src/features/finance/financeEngineFxGain/financeEngineFxGain.logic.ts`
  with focused vitest coverage in
  `financeEngineFxGain.logic.test.ts`, satisfying FR-1 through FR-7 and
  NFR-1 through NFR-4 above.
- Scope remained limited to the declared feature folder; no unrelated
  modules were touched, no dependencies were added, and no GitHub issues
  (including parent #1939) were closed or mutated.
- See `SDD-ISSUE-W56-FINANCE-FX-1939.md` §9/§10 for completion evidence and
  the rollback note covering this implementation.
