# Phase 24 — Module Traceability Matrix

**Date:** May 3, 2026  
**Status:** Active  
**Related Plan:** `PHASE_23_24_25_IMPLEMENTATION_PLAN.md`

---

## Purpose

Create a single source of truth mapping each core module to business rules, UI surfaces, API namespaces, role controls, and acceptance gates.

---

## Traceability Matrix

| Module          | Business Status       | Primary UI/Flow                               | Canonical API Namespace                                          | Role Control Summary                                 | Key Business Rules                                                                                   | Acceptance Gate Summary                                                  |
| --------------- | --------------------- | --------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Leads           | Active                | Clara Leads CRM / homepage source capture     | `/api/leads`                                                     | Agent own + manager/team + executive overview        | Source attribution immutable, stage-history retained, SLA follow-up rules                            | source tags preserved, stage transitions valid, role visibility enforced |
| Inventory       | Active (Optimization) | Mary Inventory + Pipeline tabs                | `/api/properties`, `/api/listings`                               | Agent own portfolio + manager approvals              | Lifecycle state machine (draft->pending->active->completed/archived), compliance fields required     | approval gates enforced, stale/invalid records blocked                   |
| Sales Pipeline  | Active                | Sophia Sales CRM pipeline + forecasting       | `/api/deals` (or module route), integrates with leads/properties | Agent + manager override + executive view            | Ordered stage transitions, offer/negotiation preconditions, closed-won triggers downstream workflows | transition preconditions pass, closed-lost reason required               |
| Commission      | Active (Enhancement)  | Theodora commission dashboards/statements     | `/api/commissions`                                               | Approval: manager/owner; Payment: finance/owner      | Auto-create on close, immutable paid records, split/rate policy                                      | approval/payment lifecycle complete, agent scope isolation               |
| Leasing / Ejari | In Progress           | Daisy leasing tabs and renewal flows          | `/api/tenants`, `/api/leases`                                    | Agent/manager/compliance/finance scoped actions      | Ejari required for active lease, payment schedule/late fee logic, renewal controls                   | activation blocked without Ejari, reminders and overdue workflows valid  |
| WhatsApp        | In Progress           | Nadia/Nina conversation surfaces + assignment | `/api/whatsapp/*`                                                | Agent handling + manager reassignment + admin policy | Inbound persistence, bot-to-human escalation, source-to-lead mapping                                 | webhook/auth reliability, SLA alerts, retry/queue behavior observable    |

---

## Cross-Module Dependency Chain

`Homepage/Search -> Leads -> Sales -> Commission -> Financial Reporting`

Supporting rails:

- WhatsApp contributes into Leads source and SLA workflows.
- Inventory context powers Sales and Leasing decisions.

---

## Canonical Namespace Policy Reminder

- Primary module namespace must be used in all new docs/tests.
- Legacy aliases are compatibility-only and must be labeled as such.

---

## Phase 24 Completion Criteria

- [ ] All six core modules have aligned status + endpoint namespace + role control notes.
- [ ] No contradictions between requirements docs and CRM feature docs.
- [ ] Acceptance gate checklist available per module.

---

## Next Actions

1. Add explicit endpoint tables to modules still missing canonical endpoint blocks (Leads, Sales, WhatsApp where needed).
2. Add role matrix appendix for each module doc.
3. Link this matrix in `business_docs/09_crm_features/README.md` and `plans/INDEX.md`.
