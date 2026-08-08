# Flowchart Master Catalog — 36× Program

**Status:** Active Planning Specification  
**Last Updated:** 2026-08-03

## 1. Purpose

Defines required flowchart coverage for all departments and cross-cutting control lanes.

## 2. Required levels per process

- **L0** Business flow
- **L1** System flow
- **L2** Exception + recovery flow

## 3. Required process categories

1. customer onboarding and routing
2. lead-to-offer-to-close
3. lease lifecycle and Ejari
4. maintenance and contractor dispatch
5. billing/payout/reconciliation
6. compliance incident response
7. legal notice and dispute handling
8. release incident and rollback
9. AI handoff and confidence fallback

## 4. Mandatory annotations

Every flowchart must annotate:

- actor boundaries
- system boundary
- SLA checkpoints
- escalation triggers
- failure exit and recovery re-entry

## 5. Quality gate

A flow artifact is valid only when all of these exist:

- L0/L1/L2 views,
- SLA markers,
- exception branch coverage,
- linked UC/SRS/SDD references.

## 6. Linkage

- `../03_use_cases/UC_MASTER_LIBRARY_12_DEPARTMENTS.md`
- `../01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `../02_software_design/SDD_MASTER_ARCHITECTURE_PACK.md`
