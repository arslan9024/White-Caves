# Top 20 Critical Business Journeys (Inception Baseline)

**Status:** Active Journey Catalog  
**Owner:** Product + Operations + Compliance  
**Last Updated:** 2026-08-03

## 1. Purpose

Provide a canonical top-20 business journey set for Inception closure and UC decomposition prioritization.

## 2. Journey list

| Journey ID | Journey | Primary Dept | SLA Signal | Compliance Anchor |
| --- | --- | --- | --- | --- |
| JRN-001 | Lead ingestion from portal to assigned owner | SB/CC | 15-minute response | `POL-RERA-001` |
| JRN-002 | Lead qualification and pipeline advancement | SB | stage latency | `POL-PDPL-001` |
| JRN-003 | Property onboarding and draft validation | PF/SB | onboarding cycle time | `POL-RERA-001` |
| JRN-004 | Listing publish gate with permit checks | PF/CR | publish readiness | `POL-RERA-001` |
| JRN-005 | Viewing scheduling and confirmation flow | SB/LT | booking turnaround | `POL-PDPL-001` |
| JRN-006 | Offer intake and negotiation lifecycle | SB/LD | offer response SLA | `POL-AML-001` |
| JRN-007 | Deal closure and transaction registration | LD/CR/FT | close cycle time | `POL-DLD-001` |
| JRN-008 | Lease signing to Ejari registration | LT/CR | registration SLA | `POL-EJARI-001` |
| JRN-009 | Lease renewal decision workflow | LT | renewal lead time | `POL-EJARI-001` |
| JRN-010 | KYC/EDD compliance gate for risky transactions | CR/FT | review SLA | `POL-AML-001` |
| JRN-011 | Consent capture and data rights handling | CR/CC | request closure SLA | `POL-PDPL-001` |
| JRN-012 | Commission calculation and approval flow | FT | payout cycle time | `POL-AML-001` |
| JRN-013 | Invoice and financial reporting lifecycle | FT | close calendar adherence | `POL-PDPL-001` |
| JRN-014 | Maintenance request to contractor closure | PF | resolution SLA | `POL-PDPL-001` |
| JRN-015 | Tenant support and escalation path | LT/CC | response and resolution | `POL-PDPL-001` |
| JRN-016 | WhatsApp automation and handoff to human agent | CC/DA | first-response SLA | `POL-PDPL-001` |
| JRN-017 | Compliance incident detection and response | CR | containment SLA | `POL-AML-001` |
| JRN-018 | Audit/report export and regulatory evidence | CR/FT | report turnaround | `POL-RERA-001` |
| JRN-019 | Executive KPI review and decision actioning | EX/DA | dashboard freshness SLA | `POL-PDPL-001` |
| JRN-020 | Release readiness and rollback communication | TP/EX/CR | release gate SLA | `POL-PDPL-001` |

## 3. Decomposition requirements

Every journey must be decomposed into:

1. UC families (`UC-*` IDs),
2. requirement IDs (`FR/BR/NFR/POL/AC`),
3. SDD realization points,
4. test and release gate evidence.

## 4. Priority model

- P0 journeys: JRN-001, 004, 007, 008, 010, 011, 017
- P1 journeys: JRN-002, 003, 005, 006, 009, 012, 013, 016, 018
- P2 journeys: JRN-014, 015, 019, 020

## 5. Linkage

- `./lead-to-sale-flowchart.md`
- `./rental-management-flowchart.md`
- `../05_requirements/functional-requirements.md`
- `../05_requirements/compliance-requirements.md`
- `../../software_docs/03_use_cases/UC_MASTER_LIBRARY_12_DEPARTMENTS.md`
- `../../plans/INCEPTION_EXIT_READINESS_SCORECARD.md`
