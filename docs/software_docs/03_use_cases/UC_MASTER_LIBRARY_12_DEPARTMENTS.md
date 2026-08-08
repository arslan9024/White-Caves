# Use Case Master Library — 12 Departments

**Status:** Active / Traceability Bridge Enabled  
**Last Updated:** 2026-08-07

## 1. Purpose

This document defines the master use-case catalog and schema for all departments plus cross-cutting lanes.

## 2. UC namespaces

- `UC-EX-*` Executive
- `UC-SB-*` Sales & Brokerage
- `UC-LT-*` Leasing & Tenancy
- `UC-PF-*` Property & Facilities
- `UC-FT-*` Finance & Treasury
- `UC-CR-*` Compliance & Risk
- `UC-LD-*` Legal & Disputes
- `UC-MG-*` Marketing & Growth
- `UC-CC-*` Communications & Client Care
- `UC-TP-*` Technology & Platform
- `UC-DA-*` Data & AI
- `UC-HR-*` HR & Workforce

## 2.1 Traceability anchors

The use-case catalog is not a standalone artifact. Each UC must be traceable to the requirements layer, the software-design layer, and the test/readiness layer.

Required anchors per UC:

- one or more requirement IDs from the SRS baseline (`FR-*`, `BR-*`, `POL-*`, `AC-*`);
- one design component or API contract from the SDD pack;
- one test suite or evidence artifact from the implementation readiness pack.

### 2.2 Traceability examples

Representative use cases should resolve to the following implementation anchors:

- `UC-SB-PIPE-001` → `FR-SB-001`, `SalesPipelineService`, `sales-pipeline`;
- `UC-LT-EJARI-001` → `FR-LT-001`, `TenancyWorkflowService`, `ejari-pdc`;
- `UC-FT-APP-001` → `FR-FT-001`, `FinanceApprovalService`, `finance-approval`;
- `UC-CR-AUDIT-001` → `POL-CR-001`, `ComplianceWorkflowService`, `privacy-audit`.

Example: `UC-SB-PIPE-001` should resolve to `FR-SB-001`, `SalesPipelineService`, and the `sales-pipeline` test suite.

## 3. UC identifier and decomposition standard

Standard ID pattern:

- `UC-{DEPT}-{CAPABILITY}-{PROCESS}-{NNN}`

Scenario suffix convention:

- `-HP` happy path
- `-ALT` alternate path
- `-ERR` failure/error path
- `-RCV` recovery path
- `-MNL` manual override path

## 4. Portfolio coverage model (10,000 UC readiness)

The library must support this planned UC distribution model:

- EX: 500
- SB: 1,200
- LT: 1,000
- PF: 800
- FT: 900
- CR: 850
- LD: 700
- MG: 700
- CC: 900
- TP: 900
- DA: 900
- HR: 650

## 5. Mandatory 20-block UC schema

1. UC ID and title
2. business objective
3. primary/secondary actors
4. trigger event
5. preconditions
6. postconditions
7. happy path sequence
8. alternate path sequence
9. failure path sequence
10. recovery path sequence
11. SLA timing contract
12. authorization requirements
13. validation and schema rules
14. data writes/reads
15. external integrations
16. audit requirements
17. observability events
18. acceptance criteria
19. linked tests
20. linked wave and owner

## 6. Mandatory scenario coverage rules

For each UC family, define all scenario classes:

1. happy path,
2. alternate path,
3. validation failure,
4. authorization failure,
5. dependency timeout/outage,
6. recovery and re-entry,
7. manual override path.

## 7. UC-to-artifact traceability contract

Each UC record must map to:

- requirement IDs (`FR-*`, `NFR-*`, `POL-*`, `AC-*`),
- SDD component/API/state references,
- test suites/case IDs,
- wave task IDs and owner roles.

## 8. UC quality gates

A UC is implementation-ready only if:

- all 20 blocks are filled,
- acceptance criteria are measurable,
- at least one failure/recovery path exists,
- linked tests and waves are present,
- SRS and SDD links are explicit,
- observability events are defined.

## 9. Linkage

- `../01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `../02_software_design/SDD_MASTER_ARCHITECTURE_PACK.md`
- `../IMPLEMENTATION_TEST_READINESS_MASTER.md`
- `../DOCS_INTEGRATION_AND_CONSISTENCY_SYSTEM_2026-08-03.md`
- `../../plans/MASTER_PLAN_36X_600_DETAIL.md`
