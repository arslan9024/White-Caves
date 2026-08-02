# Software Design Document (SDD): RBAC & State Gating Architecture

## 1. System Overview & Gating Principles

The **Role-Based Access Control (RBAC) & State Gating Engine** secures the White Caves Sovereign CRM. Access levels are strictly hierarchical (Level 1 to Level 5) and dictate layout visibility, operational permissions, data access boundaries, and API route execution.

---

## 🎨 Brand Palette Enforcement

- Primary Red (`#EF4444`): Master unmask badges (`LEVEL_5_MASTER`), security alert borders.
- Pure White (`#FFFFFF`): Role permission matrix cards and modal dialogs.
- Slate Text (`#1E293B`): Route guard signatures and access level headers.

---

## 🔗 Inter-Linked Navigation References

- [Impersonation Use Case](../03_use_cases/md_impersonation_matrix.md) — Operational use case for Managing Director Ghost Session impersonation.
- [Database Design](./database_architecture_sdd.md) — Database topology, Prisma schemas, and indexing strategies.

---

## 2. RBAC Access Level Matrix

| Access Level | Role Rank | Scope & Capabilities | Gating Target |
|---|---|---|---|
| **LEVEL_5_MASTER** | Managing Director | Full system unmask, 12 departments, ghost session impersonation, financial ledger locks | `ExecutiveFlightDeckView` |
| **LEVEL_4_MANAGER** | Department Head | Department flight deck, squad performance telemetry, lead reassignments | `DepartmentManagerView` |
| **LEVEL_3_SUPERVISOR**| Squad Lead | 9-person squad pipeline oversight, viewing approvals, commission submissions | `SquadSupervisorView` |
| **LEVEL_2_STANDARD** | Broker / Agent | Personal lead kanban, property listings, viewing requests | `BrokerDashboardView` |
| **LEVEL_1_CLIENT** | Tenant / Buyer | Client portal, contract downloads, viewing appointments | `ClientPortalView` |

---

## 3. Founder Short-Circuit Security Rule

The authentication guard (`FounderGuard.ts`) enforces an immediate short-circuit bypass for Managing Director identity:

```typescript
if (user.email === 'arslanmalikgoraha@gmail.com') {
  user.accessLevel = 5; // LEVEL_5_MASTER
  user.role = 'Managing Director';
  // Force landing directly onto Executive Profile & Flight Deck
}
```
