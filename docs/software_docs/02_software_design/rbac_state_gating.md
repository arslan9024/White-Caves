# RBAC State Gating & Founder Short-Circuit Architecture

> **Document Class:** Software Design Document (SDD)  
> **Repository Path:** `software_docs/02_software_design/rbac_state_gating.md`  
> **Status:** Active / Reconciliation In Progress  
> **Last Updated:** 2026-08-02

---

## Canonical links

- [`../../business_docs/09_user_roles_permissions/roles-matrix.md`](../../business_docs/09_user_roles_permissions/roles-matrix.md)
- [`../../business_docs/05_requirements/functional-requirements.md`](../../business_docs/05_requirements/functional-requirements.md)
- [`../../plans/documentation/RBAC_ROLE_TO_LEVEL_MAP.md`](../../plans/documentation/RBAC_ROLE_TO_LEVEL_MAP.md)
- [`../01_requirements_engineering/functional_specifications.md`](../01_requirements_engineering/functional_specifications.md)

---

## 🔑 1. Role Levels & Access Control Matrix

```typescript
export enum AccessLevel {
  LEVEL_1_GUEST = 1,
  LEVEL_2_BROKER = 2,
  LEVEL_3_MANAGER = 3,
  LEVEL_4_EXECUTIVE = 4,
  LEVEL_5_MASTER = 5,
}
```

This document defines the **software access-level model**, not the full business role catalog.
Business roles and persona titles may collapse into these runtime levels through alias mapping
and route-guard policy.

| Route Group | Required Level | Permitted Actions |
| ----------- | -------------- | ----------------- |
| `/crm/profile` | LEVEL 1+ | Read/Update Own Profile, View Badges |
| `/crm/sales` | LEVEL 2+ | Drag-Drop Leads, Create Deals, View Portfolio |
| `/crm/leasing` | LEVEL 2+ | Ejari Submission, Renewal Grid, Form 7/12 |
| `/crm/finance` | LEVEL 3+ | Approvals (Step 2/3), Payout Schedule, AR Aging |
| `/crm/executive` | LEVEL 4+ | Cross-Dept Aggregator, Financial P&L, Telemetry |
| `/crm/system` | LEVEL 5 | Ghost Session Impersonation, Full System Override |

## Reconciliation note

The business documentation contains more granular role definitions than this file. Wave 32 uses
`docs/plans/documentation/RBAC_ROLE_TO_LEVEL_MAP.md` to bridge:

- business role names and department-facing permissions;
- backend canonical roles and alias resolution;
- software access levels used by UI and route gating.

---

## ⚡ 2. Founder Landing Short-Circuit Diagram

```text
[ Incoming Session Request ]
            │
            ▼
 ┌──────────────────────┐
 │ Check Email Identity │
 └──────────┬───────────┘
            │
      Is "arslanmalikgoraha@gmail.com"?
     ┌──────┴──────┐
     YES          NO
     │             │
     ▼             ▼
┌──────────┐ ┌─────────────┐
│ Set      │ │ Evaluate    │
│ Access   │ │ Standard    │
│ Level: 5 │ │ JWT Token   │
└────┬─────┘ └──────┬──────┘
     │              │
     ▼              ▼
┌──────────┐ ┌─────────────┐
│ Land     │ │ Land on     │
│ Profile  │ │ Assigned    │
│ Page     │ │ Viewport    │
└────┬─────┘ └─────────────┘
     │
     ▼
┌──────────────────────────┐
│ Unmask Unified Workspace │
│ Layout Cockpit           │
└──────────────────────────┘
```

## Verification expectations

This design should be validated against:

- authenticated route guard tests;
- role/permission middleware behavior;
- founder short-circuit routing and audit visibility;
- business RBAC policy documents under `docs/business_docs/09_user_roles_permissions/`.
