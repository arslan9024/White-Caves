# Inter-Department Dependency Contracts (12×9 Model)

**Status:** Canonical  
**Last Updated:** 2026-08-03

## 1. Dependency layers

- **L1 Customer Value Chain:** MG → CC → SB → LT → PF → FT
- **L2 Governance Chain:** CR ↔ LD ↔ FT ↔ EX
- **L3 Platform Chain:** TP → all departments
- **L4 Intelligence Chain:** DA → EX, SB, MG, FT, CR
- **L5 Workforce Chain:** HR → all departments

## 2. Contract template (mandatory)

Each dependency contract must include:

1. Producer department + sub-department
2. Consumer department + sub-department
3. Artifact type (data/process/approval)
4. Delivery cadence
5. Freshness/accuracy threshold
6. SLA target and breach windows
7. Breach severity class (P0/P1/P2)
8. Fallback path
9. Escalation owner + deadline
10. FEEDS/CONSUMES/FEEDS_ACK references

## 3. Critical contracts (priority)

| Contract ID | Producer | Consumer | Artifact | SLA |
| --- | --- | --- | --- | --- |
| DEP-001 | MG-2 | CC-2 | Qualified campaign leads | < 5 min routing |
| DEP-002 | CC-4 | SB-3 | Human-handoff lead packet | < 15 min |
| DEP-003 | SB-5 | LT-2 | Accepted offer lease intent | same business day |
| DEP-004 | LT-3 | CR-4 | Ejari regulatory packet | 24h |
| DEP-005 | PF-4 | FT-3 | Maintenance cost approvals | 8h |
| DEP-006 | FT-8 | EX-6 | Monthly close KPI summary | T+2 days |
| DEP-007 | CR-8 | LD-4 | Compliance incident case file | 4h |
| DEP-008 | TP-7 | EX-5 | Sev-1 reliability incident report | 1h |
| DEP-009 | DA-7 | EX-1 | Insight confidence brief | weekly |
| DEP-010 | HR-4 | EX-3 | Workforce performance variance | monthly |

## 4. Breach protocol

- **P0:** immediate escalation to EX-5 + TP-7 (if system-involved)
- **P1:** escalation within 30 minutes to department heads
- **P2:** tracked in weekly risk log with owner and corrective action

## 5. Validation

A dependency is considered valid only if:

- contract template is fully populated,
- SLA is measurable,
- fallback and escalation are defined,
- FEEDS/CONSUMES/FEEDS_ACK links are recorded.
