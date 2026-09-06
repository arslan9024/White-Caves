# Software Requirements Specification (SRS)

## Work Stream W56 — Finance Engine Architecture

### Parent Issue: #1925 · Child Issue: #2483 (Finance Engine Architecture Double)

## 1. Introduction

### 1.1 Purpose

This SRS defines the functional and non-functional requirements for the finance engine subsystem that will power price breakdowns, commission calculations, currency conversion, and payment-schedule projections across the White Caves CRM and Homepage. It also defines the requirements specific to the child scope of this issue (#2483): establishing a stable, testable contract and an in-memory "double" implementation strategy that unblocks consumer development ahead of the full engine.

### 1.2 Scope

This document covers the **specification layer** only. It does not itself deliver the production finance engine implementation; it hands off actionable requirements to implementation-focused child issues under parent #1925. This document, together with the accompanying SDD, constitutes the "implementation handoff" package for work stream W56.

### 1.3 Definitions

| Term           | Definition                                                                                                                        |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Finance Engine | The subsystem computing pricing, commissions, tax, currency conversion, and payment schedules.                                    |
| Double         | A deterministic, in-memory stand-in for the finance engine used in tests/dev, implementing the same interface as the real engine. |
| Minor units    | Integer representation of currency (e.g., cents, fils) to avoid floating-point rounding errors.                                   |
| W56            | Internal work-stream identifier grouping all finance-engine-related child issues under #1925.                                     |

## 2. Overall Description

### 2.1 Product Perspective

The finance engine sits between raw property/listing data (owned by other domains: properties, leads, transactions) and any surface that must display or act on financial figures (property detail pages, CRM deal views, invoicing, reporting dashboards). It is designed as a pure computation layer: given well-formed inputs, it returns well-formed, deterministic outputs with no side effects.

### 2.2 Product Functions (high level)

1. **Price breakdown** — given a base price and applicable fee/tax rules, compute a fully itemized breakdown and total.
2. **Commission split** — given a transaction value and commission tier/agreement, compute the split across agent/agency/referral parties.
3. **Currency conversion** — given an amount, source currency, and target currency, convert using an injected rate table.
4. **Payment schedule projection** — given a total amount and a plan configuration (number of installments, cadence, down payment), project a schedule of due amounts and dates.

### 2.3 User Classes

- **CRM agents/brokers** — view commission splits and payment schedules for deals they manage.
- **Homepage visitors/buyers** — view price breakdowns and indicative payment schedules on listing pages.
- **Finance/ops staff** — rely on accurate, auditable commission and tax computations for reporting.
- **Engineers (internal)** — consume the `FinanceEngine` interface and its double in application code and tests.

## 3. Specific Requirements

### 3.1 Functional Requirements

- **FR-1:** The system SHALL expose a `FinanceEngine` interface with methods `computePriceBreakdown`, `computeCommissionSplit`, `convertCurrency`, and `projectPaymentSchedule`, as defined in `financeEngineArchitectureDouble.contract.md`.
- **FR-2:** The system SHALL provide (in a later child issue) a real implementation of `FinanceEngine` backed by configurable tax/commission/rate data.
- **FR-3:** The system SHALL provide (in a later child issue, informed by this specification) a double implementation of `FinanceEngine` suitable for use in automated tests, using fixed default configuration values and no I/O.
- **FR-4:** All monetary computations SHALL use integer minor units internally; conversion to display strings SHALL occur only at the UI/presentation boundary.
- **FR-5:** All engine methods SHALL validate their inputs and SHALL throw a descriptive error on invalid input (e.g., negative amounts, unknown currency codes, malformed payment plans) rather than returning `NaN`, `undefined`, or silently clamped values.
- **FR-6:** The engine SHALL NOT mutate any input object passed to it.
- **FR-7:** The engine SHALL NOT perform network calls, file system access, or database queries as part of any of the four core computation methods; external data (rates, tax tables) SHALL be supplied via constructor/config injection.

### 3.2 Non-Functional Requirements

- **NFR-1 (Determinism):** Given identical inputs (and, where relevant, an identical injected "as of" date), the engine SHALL produce identical outputs on every invocation.
- **NFR-2 (Type Safety):** All public APIs SHALL be implemented in strict TypeScript with no `any` types.
- **NFR-3 (Testability):** The double implementation SHALL execute in well under 1ms per call and SHALL require no test-time network or database setup.
- **NFR-4 (Interchangeability):** Consumers SHALL depend only on the `FinanceEngine` interface, not on concrete engine or double classes, so that the real engine can be substituted for the double (or vice versa) without call-site changes.
- **NFR-5 (Auditability):** Commission and tax computations SHALL be traceable — i.e., the breakdown result SHALL include enough itemized detail (line items, rates applied) to support an audit trail, not just a final total.

### 3.3 Constraints

- No new third-party dependencies may be introduced to satisfy these requirements.
- No production secrets, environment configuration, or database schemas may be modified as part of specification work.
- No GitHub issues (including parent #1925) may be closed or bulk-mutated as part of delivering this specification.

## 4. Traceability to Acceptance Criteria (Issue #2483)

| Acceptance Criterion                                         | Addressed By                                                                                                                          |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| Implementation remains within declared child scope           | This document and the SDD are scoped strictly to specification/handoff artifacts for W56; no engine code is implemented here.         |
| Focused tests and required validation commands pass          | Requirements above (FR-1–FR-7, NFR-1–NFR-5) define the pass/fail contract that future test suites for the double/engine must satisfy. |
| Completion evidence and rollback note recorded               | See README.md rollback section; this SRS and the paired SDD constitute the completion evidence for #2483.                             |
| Parent issue remains open until all child work is reconciled | This document explicitly defers engine implementation to other child issues; #1925 is not closed by this work.                        |

## 5. Open Questions for Downstream Child Issues

- Exact tax rate tables and jurisdictions to support (UAE VAT specifics, other markets) — deferred to a dedicated tax-rules child issue.
- Exact commission tier structure (flat vs. tiered vs. hybrid) — deferred to a commission-rules child issue.
- Source and refresh cadence for live currency rates in production — deferred to an integration child issue.

## 6. Addendum — Issue #2482 (Finance Engine Architecture Double Implementation)

### 6.1 Scope of This Addendum

Issue #2482, a further child of parent #1925 in work stream W56, delivers the `.ts` implementation of the `FinanceEngine` double that Section 3.1/FR-3 and Section 5 of this SRS explicitly deferred. It satisfies FR-1 through FR-7 and NFR-1 through NFR-5 for the double specifically (not the real, production-backed engine, which remains a separate future child issue).

### 6.2 Delivered Artifacts

- `src/features/finance/financeEngineArchitectureDouble/financeEngineArchitectureDouble.logic.ts` — the `FinanceEngine` interface, its supporting DTOs, `FinanceEngineValidationError`, the documented non-production default configuration, and the `FinanceEngineArchitectureDouble` class implementing `computePriceBreakdown`, `computeCommissionSplit`, `convertCurrency`, and `projectPaymentSchedule`.
- `src/features/finance/financeEngineArchitectureDouble/financeEngineArchitectureDouble.logic.test.ts` — a vitest suite with one `describe` block per core method (per Section 4.5 of the SDD) plus a config-override interchangeability check, asserting real computed values rather than placeholder assertions.

### 6.3 Requirement Traceability for This Addendum

| Requirement | How Satisfied |
| --- | --- |
| FR-1 | `FinanceEngine` interface defined with all four methods. |
| FR-3 | `FinanceEngineArchitectureDouble` implements the interface with fixed defaults and no I/O. |
| FR-4 | All amounts are integer "minor units"; `Math.round`/`Math.floor` used to keep results integral. |
| FR-5 | Every method validates inputs via shared guards and throws `FinanceEngineValidationError` on failure. |
| FR-6 | No method reassigns or mutates its `input` parameter; a dedicated test asserts this for `computePriceBreakdown`. |
| FR-7 | No network, filesystem, or database calls anywhere in the module. |
| NFR-1/NFR-3 | Pure, synchronous computation; test suite completes in well under a second. |
| NFR-2 | Strict TypeScript throughout; no `any` types used. |
| NFR-4 | Consumers are expected to depend on the exported `FinanceEngine` interface, not the concrete class. |
| NFR-5 | `PriceBreakdownResult`/`CommissionSplitResult` include `lineItems` with rate and amount detail. |

### 6.4 Completion Evidence

- Type check: `node_modules\.bin\tsc.cmd --noEmit --strict` against both new files completed with zero errors.
- Test run: `node_modules\.bin\vitest.cmd run` against `financeEngineArchitectureDouble.logic.test.ts` reported 23/23 tests passing.

### 6.5 Rollback Note

This addendum only adds two new, additive `.ts` files under `financeEngineArchitectureDouble/`; no existing file was modified or deleted, and no other module imports these files yet. To roll back, delete `financeEngineArchitectureDouble.logic.ts` and `financeEngineArchitectureDouble.logic.test.ts`; no other changes are required, and parent issue #1925 remains open and unaffected.
