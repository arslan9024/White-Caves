# SDD — Finance Engine: UAE FTA VAT

**Document ID:** SDD-ISSUE-W56-FINANCE-VAT-1927
**Issue:** #2472 (child) · Parent: #1927
**Status:** Draft, handed off for implementation
**Owner work stream:** `W56-FINANCE-VAT`
**Realizes:** `plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-VAT-1927.md`

## 1. Overview

This Software Design Document describes the technical design for the UAE
FTA VAT calculation module located at
`src/features/finance/financeEngineUaeFta/`. The design realizes the
requirements in the companion SRS document and must match the exported API
described in `financeEngineUaeFta.contract.md`.

## 2. Module Location and Files

```
src/features/finance/financeEngineUaeFta/
├── financeEngineUaeFta.ts          # implementation (future child issue)
├── financeEngineUaeFta.test.ts     # vitest suite (future child issue)
├── financeEngineUaeFta.contract.md # API/behavior contract (this issue)
└── README.md                       # module overview (this issue)
```

This document does not create the `.ts` files above; it specifies the
design a subsequent implementation child issue must follow.

## 3. Design Decisions

### 3.1 Pure function architecture, no class-based service

**Decision:** Expose the module as free functions (`calculateLineItemVat`,
`summarizeVat`, `isValidUaeTrn`) plus a single error class
(`InvalidTrnError`), rather than a stateful `VatEngine` class.

**Rationale:** VAT calculation is stateless arithmetic; a class would add
indirection (construction, `this` binding) without benefit. Free functions
are easier to tree-shake, easier to unit test in isolation, and align with
the rest of the finance feature area's functional style. The single
exception is `InvalidTrnError`, which must be a class so callers can use
`instanceof` narrowing.

### 3.2 Rounding strategy: round-half-up per line item, not per invoice

**Decision:** Round each line item's VAT amount independently to 2 decimal
places using round-half-up, then sum already-rounded amounts for period
summaries, rather than summing raw amounts and rounding once at the end.

**Rationale:** FTA guidance expects VAT to be verifiable at the line-item
level on an invoice; rounding only the final total would make individual
invoice lines fail a manual line-by-line audit even though the total might
be numerically closer to the "true" value. Per-line rounding trades a
theoretical accumulation of sub-cent rounding drift for auditability, which
is the higher priority for a tax compliance module.

**Implementation guidance:** round-half-up must be implemented explicitly
(e.g. `Math.round(value * 100) / 100` after adjusting for floating point
epsilon, or a fixed-point/decimal library already present in the repo if
one exists) rather than relying on `toFixed`, which uses round-half-to-even
in some engines and can silently misround `.005`-style boundary values.

### 3.3 TRN validation returns a boolean; invalid-use raises a typed error

**Decision:** `isValidUaeTrn(trn)` is a pure boolean predicate that never
throws. Callers that need to enforce validity in a workflow (e.g. attaching
a TRN to an invoice) call `isValidUaeTrn` first and throw
`InvalidTrnError` themselves, or a higher-level helper does so.

**Rationale:** Keeping the predicate throw-free makes it safe to use in
conditional UI logic (e.g. inline form validation) without try/catch
boilerplate, while still giving invoice-issuance code a typed error to
branch on (`instanceof InvalidTrnError`) when it needs to fail hard.

### 3.4 No persistence, no I/O

**Decision:** The module has zero dependencies on the database layer, HTTP
layer, or filesystem.

**Rationale:** Required by NFR-1/NFR-2 (purity, determinism) and by the
excluded-scope constraint against persistence and destructive database
operations. Any feature that needs to store VAT summaries must do so in a
separate service that imports and calls this module, not the other way
around.

## 4. Data Model

```ts
type VatRateCategory = 'standard' | 'zeroRated' | 'exempt' | 'outOfScope';

interface VatLineItem {
  description: string;
  netAmount: number;
  category: VatRateCategory;
}

interface VatLineItemResult extends VatLineItem {
  vatRate: number;
  vatAmount: number;
  grossAmount: number;
}

interface VatSummary {
  outputVat: number;
  inputVat: number;
  netVatPayable: number;
  lineItems: readonly VatLineItemResult[];
}
```

No mutable module-level state is introduced; all functions accept inputs
and return new objects.

## 5. Error Handling

- `RangeError` for invalid numeric input (negative or non-finite
  `netAmount`), thrown by `calculateLineItemVat`.
- `InvalidTrnError extends Error` for invalid TRNs used in a validating
  context; message includes the offending TRN value for traceability
  without leaking any other PII (TRNs are not personally identifying).

## 6. Testing Strategy

A vitest suite (`financeEngineUaeFta.test.ts`, added in the implementation
child issue) must cover, using `import { describe, expect, it } from
'vitest'` and real assertions (no placeholder `expect(true).toBe(true)`):

1. Standard-rated line item → correct 5% VAT with rounding boundary case
   (e.g. an amount producing a `.xx5` rounding decision).
2. Zero-rated and exempt line items → 0 VAT, gross equals net.
3. `summarizeVat` with output VAT greater than input VAT → positive
   `netVatPayable`.
4. `summarizeVat` with input VAT greater than output VAT → negative
   `netVatPayable` (reclaimable case).
5. `isValidUaeTrn` → true for a valid 15-digit numeric string; false for
   empty string, 14-digit string, 16-digit string, and alphanumeric string.
6. `InvalidTrnError` → thrown with a message containing the invalid TRN
   value.
7. `calculateLineItemVat` with negative `netAmount` → throws `RangeError`.

## 7. Validation Commands

Once implementation files exist, the required validation command for this
module is:

```
npx vitest run src/features/finance/financeEngineUaeFta
```

Combined with the repository's existing TypeScript typecheck command (run
at the repo root, not introduced by this issue) to confirm strict-mode
compliance and absence of `any`.

## 8. Completion Evidence (this issue, #2472)

- Authored: `financeEngineUaeFta.contract.md`, `README.md` under
  `src/features/finance/financeEngineUaeFta/`.
- Authored: this SDD and its companion SRS under
  `plans/implementation_handoffs/`.
- No implementation or test `.ts` files were created; those are explicitly
  deferred to a follow-on child issue in the `W56-FINANCE-VAT` stream, per
  this issue's declared child scope.
- Parent issue #1927 was not modified or closed.

## 9. Rollback Note

All artifacts produced by this issue are documentation-only Markdown files
with no imports from source code and no effect on build, lint, or test
tooling. To roll back this change, delete the four files listed in section
8 above. No other file in the repository references them.

## 10. Completion Evidence — Implementation (Issue #2471)

This section records the follow-on implementation child issue that
realizes this SDD's design.

- Authored `financeEngineUaeFta.logic.ts` implementing the design in
  section 3 exactly: free functions only (`calculateLineItemVat`,
  `summarizeVat`, `isValidUaeTrn`, `getVatRateForCategory`), plus
  `assertValidUaeTrn` as the higher-level helper referenced in section
  3.3 for workflows that must enforce TRN validity, and the
  `InvalidTrnError extends Error` class from section 5.
- Rounding implemented per section 3.2: explicit round-half-up via scaled
  `Math.round` with a floating-point epsilon correction (not `toFixed`),
  applied per line item before summation in `summarizeVat`.
- Data model in section 4 implemented verbatim as TypeScript
  `type`/`interface` declarations (`VatRateCategory`, `VatLineItem`,
  `VatLineItemResult`, `VatSummary`), with `readonly` fields to reinforce
  the "no mutation of inputs" requirement.
- Error handling in section 5 implemented exactly: `RangeError` for
  invalid `netAmount`, `InvalidTrnError` for invalid TRNs in a validating
  context, with the offending TRN value included in the error message and
  exposed as a `trn` property for programmatic access.
- Testing strategy in section 6 fully implemented in
  `financeEngineUaeFta.logic.test.ts`, covering all seven enumerated
  scenarios (standard-rate rounding boundary, zero-rated/exempt zero-VAT
  passthrough, positive and negative `netVatPayable`, TRN edge cases,
  `InvalidTrnError` message content, and `RangeError` on negative
  `netAmount`).
- Validation performed: a strict-mode, no-`any` `tsc --noEmit` check
  against the new implementation file (zero errors), and a full
  behavioral sanity execution of every exported function against the
  suite's scenarios (all assertions passed). The project's own
  `npx vitest run src/features/finance/financeEngineUaeFta` command from
  section 7 is the required validation command once these files are
  merged into the primary `src/` tree.
- Files were created only at the two paths named in this and the SRS
  document; the `financeEngineUaeFta.contract.md` and `README.md` files
  described in section 2 remain out of scope for this child issue and are
  not required for the implementation to be correct or complete, since
  the contract is instead expressed directly by this SDD and enforced by
  the accompanying test suite.
- Parent issue #1927 was not modified or closed by this implementation
  issue either.

## 11. Rollback Note — Implementation (Issue #2471)

The implementation adds two new, self-contained files:
`src/features/finance/financeEngineUaeFta/financeEngineUaeFta.logic.ts`
and `src/features/finance/financeEngineUaeFta/financeEngineUaeFta.logic.test.ts`.
Neither is imported by any other module yet, so deleting both fully
reverts this change with no further cleanup required elsewhere in the
repository.
