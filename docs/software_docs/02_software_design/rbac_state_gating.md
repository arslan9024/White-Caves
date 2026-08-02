# RBAC State Gating & Founder Short-Circuit Architecture

> **Document Class:** Software Design Document (SDD)  
> **Repository Path:** `software_docs/02_software_design/rbac_state_gating.md`

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

| Route Group | Required Level | Permitted Actions |
|-------------|----------------|-------------------|
| `/crm/profile` | LEVEL 1+ | Read/Update Own Profile, View Badges |
| `/crm/sales` | LEVEL 2+ | Drag-Drop Leads, Create Deals, View Portfolio |
| `/crm/leasing` | LEVEL 2+ | Ejari Submission, Renewal Grid, Form 7/12 |
| `/crm/finance` | LEVEL 3+ | Approvals (Step 2/3), Payout Schedule, AR Aging |
| `/crm/executive` | LEVEL 4+ | Cross-Dept Aggregator, Financial P&L, Telemetry |
| `/crm/system` | LEVEL 5 | Ghost Session Impersonation, Full System Override |

---

## ⚡ 2. Founder Landing Short-Circuit Diagram

```
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
