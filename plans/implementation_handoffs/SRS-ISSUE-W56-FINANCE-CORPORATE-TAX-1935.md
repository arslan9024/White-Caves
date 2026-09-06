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

## 9. Implementation Addendum (Child Issue #2440)

Child issue #2440 (parent #1935) delivers the implementation PR anticipated by
Section 7 above. It does not modify any requirement, decision, or exclusion recorded
in Sections 1–8 of this SRS; those remain unchanged and this addendum is purely
additive.

- **Implemented module:** `src/features/finance/financeEngineUaeCorporate/financeEngineUaeCorporate.logic.ts`
  exporting the pure function `calculate()` plus supporting types
  (`UaeCorporateTaxInput`, `UaeCorporateTaxResult`, `UaeCorporateTaxRateTable`),
  the versioned rate table registry (`UAE_CORPORATE_TAX_RATE_TABLES`,
  `DEFAULT_RATE_TABLE_VERSION`), convenience constants
  (`SMALL_BUSINESS_RELIEF_THRESHOLD_AED`, `STANDARD_CORPORATE_TAX_RATE`), the
  typed `UaeCorporateTaxValidationError`, and a `formatAedAmount()` display helper.
- **Test evidence:** `src/features/finance/financeEngineUaeCorporate/financeEngineUaeCorporate.logic.test.ts`
  covers FR-1 through FR-7 with vitest, including exact boundary tests at
  AED 375,000 and AED 375,001, zero/negative accounting profit flooring,
  `rateTableVersion` pass-through and rejection of unknown versions, input
  non-mutation, and rejection of non-`'AED'` currency values.
- **Validation commands (required for merge):** `npx vitest run src/features/finance/financeEngineUaeCorporate` and
  the repository's standard `typecheck`/`lint` scripts, run from the repository root
  (not available inside this isolated documentation sandbox, which has no
  `node_modules`).
- **Scope confirmation:** No files outside the four listed in the #2440 issue body were
  created or modified. Parent issue #1935 remains open. No GitHub mutation, database
  operation, or secret rewrite was performed.
- **Rollback (implementation):** Revert
  `financeEngineUaeCorporate.logic.ts`/`financeEngineUaeCorporate.logic.test.ts` and
  this addendum section. The module is not yet wired into any route, job, or UI, so
  reverting it has no runtime blast radius beyond removing the pure calculation
  function itself.
