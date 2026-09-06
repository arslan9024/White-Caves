# Software Requirements Specification (SRS)

**Handoff ID:** SRS-ISSUE-W56-FINANCE-CORPORATE-TAX-1935
**Child issue:** #2441
**Parent issue:** #1935 (open; not closed by this handoff)
**Feature area:** Finance — UAE Corporate Tax Engine
**Module:** `src/features/finance/financeEngineUaeCorporate/`

## 1. Introduction

### 1.1 Purpose

This SRS defines the functional and non-functional requirements for a UAE Corporate Tax
calculation capability within the White Caves finance module. It is the requirements-side
counterpart to the design handoff (SDD) and the module contract
(`financeEngineUaeCorporate.contract.md`).

### 1.2 Scope

The requirements below apply strictly to the `financeEngineUaeCorporate` child scope of
parent issue #1935. They do not authorize changes to unrelated finance sub-modules,
authentication, or infrastructure.

### 1.3 Definitions

- **FDL 47/2022:** UAE Federal Decree-Law No. 47 of 2022 on Taxation of Corporations and
  Businesses.
- **Small Business Relief:** Relief provision exempting taxable income up to AED 375,000
  from corporate tax.
- **Taxable Period:** The financial period for which corporate tax is being computed.

## 2. Overall Description

### 2.1 Product perspective

The engine is a pure calculation service consumed by:

- Finance reporting dashboards (read-only consumption of computed results).
- Compliance export jobs (periodic generation of tax filings support data).
- Internal audit tooling (recomputation/verification of historical results).

### 2.2 User classes

- **Finance/Accounting staff:** consume computed tax figures; do not interact with the
  engine's internals directly.
- **Engineering (implementers):** build the engine against this SRS and the paired SDD.
- **Auditors/compliance reviewers:** verify reproducibility of historical calculations.

### 2.3 Assumptions and dependencies

- Currency is fixed to AED for this scope; multi-currency support is explicitly deferred.
- Rate tables (9% standard rate, AED 375,000 relief threshold) are treated as versioned,
  configurable data, not hard-coded constants, to accommodate future legislative changes
  without requiring a contract change.
- No external tax-authority API integration is included in this scope.

## 3. Functional Requirements

| ID   | Requirement                                                                                                                      |
| ---- | -------------------------------------------------------------------------------------------------------------------------------- |
| FR-1 | The system SHALL compute taxable income as accounting profit plus non-deductible add-backs minus exempt income, floored at zero. |
| FR-2 | The system SHALL apply Small Business Relief (zero tax due) when taxable income is less than or equal to AED 375,000.            |
| FR-3 | The system SHALL apply a 9% tax rate to taxable income in excess of AED 375,000 when relief does not apply.                      |
| FR-4 | The system SHALL reject any input where `currency !== 'AED'` with a typed validation error.                                      |
| FR-5 | The system SHALL record the exact `rateTableVersion` used in every result for audit traceability.                                |
| FR-6 | The system SHALL produce deterministic output: identical input must always yield identical output.                               |
| FR-7 | The system SHALL NOT perform any I/O (network, disk, database) as part of the calculation — it must be a pure function.          |

## 4. Non-Functional Requirements

| ID    | Requirement                                                                                                                                                                  |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NFR-1 | Implementation SHALL be strict TypeScript with no `any` types.                                                                                                               |
| NFR-2 | Unit tests SHALL use vitest (`describe`/`expect`/`it`) with real behavior assertions covering FR-1 through FR-6, including boundary values around the AED 375,000 threshold. |
| NFR-3 | All required validation commands (typecheck, lint, test) SHALL pass before the implementation is considered complete.                                                        |
| NFR-4 | Rounding SHALL be to 2 decimal places to match AED accounting precision.                                                                                                     |

## 5. Constraints and Exclusions

- Parent issue #1935 closure is explicitly excluded from this child's scope.
- Bulk GitHub mutations (mass issue/PR edits) are excluded.
- Destructive database operations are excluded — this feature has no persistence layer
  in its current scope.
- Production secret rewrites are excluded — the engine requires no credentials or
  secrets.

## 6. Traceability

This SRS pairs with:

- `SDD-ISSUE-W56-FINANCE-CORPORATE-TAX-1935.md` (design/architecture handoff)
- `src/features/finance/financeEngineUaeCorporate/financeEngineUaeCorporate.contract.md`
  (interface contract)

## 7. Completion Evidence

- This SRS document itself constitutes the requirements completion evidence for child
  issue #2441's documentation scope.
- Implementation completion evidence (test run output, validation command results) must
  be recorded in the implementation PR that follows this handoff, referencing this SRS
  ID (`SRS-ISSUE-W56-FINANCE-CORPORATE-TAX-1935`).

## 8. Rollback Note

This handoff is additive documentation only. Rollback consists of reverting this file;
no code, schema, or configuration changes are made, so rollback carries no runtime risk.

## 9. Implementation Completion Evidence (Child issue #2440)

- Implementing child issue: #2440. Parent issue #1935 remains open; this addendum does
  not close #1935 or #2440's parent.
- Implementation delivered at:
  - `src/features/finance/financeEngineUaeCorporate/financeEngineUaeCorporate.logic.ts`
    (`calculateUaeCorporateTax` pure function, satisfying FR-1 through FR-7).
  - `src/features/finance/financeEngineUaeCorporate/financeEngineUaeCorporate.logic.test.ts`
    (vitest unit tests covering FR-1–FR-6 and NFR-4, including the AED 375,000/375,001
    boundary, negative/zero profit flooring, currency rejection, determinism, and
    input-immutability checks).
- Required validation commands (typecheck, lint, test) must be run from the repository
  root against these two files before merge; this addendum records the requirement, and
  the implementing PR must attach the actual command output as evidence.
- Rollback for the implementation: revert the two `.ts` files listed above. No other
  files were modified; no schema, dependency, or configuration changes were introduced.

## 10. Types Extraction Completion Evidence (Child issue #2438)

- Implementing child issue: #2438. Parent issue #1935 remains open; this addendum does
  not close #1935 or any child issue.
- Delivered files, aligning the target module layout in the paired SDD (§2) by extracting
  the previously-consolidated type surface into its own module:
  - `src/features/finance/financeEngineUaeCorporate/financeEngineUaeCorporate.types.ts` —
    exported types (`UaeCorporateTaxCurrency`, `UaeCorporateTaxRateTable`,
    `UaeCorporateTaxCalculationInput`, `UaeCorporateTaxCalculationResult`), the frozen
    default rate table constant (`DEFAULT_UAE_CORPORATE_TAX_RATE_TABLE`, version
    `UAE-CT-FDL47-2022-v1`), the typed `UaeCorporateTaxValidationError`, and two type
    guards (`isUaeCorporateTaxCurrency`, `isUaeCorporateTaxRateTable`) satisfying FR-4 and
    FR-5 without using `any`.
  - `financeEngineUaeCorporate.types.test.ts` — vitest unit tests with real behavior
    assertions covering the default rate table's values and immutability, both type
    guards' true/false branches (including malformed and non-object inputs), the
    validation error's `Error` subclassing and prototype chain across a throw/catch
    boundary, and structural usage of the calculation input/result types.
- Required validation commands (typecheck, lint, test) must be run from the repository
  root against these two files before merge; this addendum records the requirement, and
  the implementing PR must attach the actual command output as evidence.
- Rollback for this addendum: revert `financeEngineUaeCorporate.types.ts` and
  `financeEngineUaeCorporate.types.test.ts`. No other file in the repository imports
  from these two files yet, so rollback carries no downstream runtime risk. Parent issue
  #1935 remains open and unaffected.
