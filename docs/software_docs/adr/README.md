# Architecture Decision Records (ADR)

**Last Updated:** 2026-06-17  
**Status:** Active  
**Owner:** @Ada (Chief Architect)

---

## What Are ADRs?

Architecture Decision Records capture the context, decision, and consequences of
significant technical choices made in the White Caves platform. They are permanent,
append-only records. Once recorded, the status of an ADR changes (Accepted →
Deprecated → Superseded) rather than the document being deleted.

---

## Index

| ADR | Title | Status | Date |
| --- | ----- | ------ | ---- |
| [ADR-001](./ADR-001-auth-dual-provider.md) | Firebase + JWT dual-provider authentication | Accepted | 2026-01-15 |
| [ADR-002](./ADR-002-mongodb-prisma.md) | MongoDB + Prisma ORM over PostgreSQL alternatives | Accepted | 2026-01-15 |
| [ADR-003](./ADR-003-crm-module-registry.md) | Lazy-loaded CRM module registry pattern | Accepted | 2026-03-10 |
| [ADR-004](./ADR-004-wave-gate-model.md) | Wave-based gated delivery model | Accepted | 2026-03-20 |
| [ADR-005](./ADR-005-superuser-lion-pattern.md) | Creator-email superuser canonicalization (lion pattern) | Accepted | 2026-04-01 |

---

## ADR Lifecycle

```
Proposed → Accepted → Deprecated → Superseded
```

New ADRs follow the template: title, status, date, context, decision, alternatives considered, consequences.

---

## Governance

ADRs are owned by the @Ada architecture layer. Changes to an existing ADR require
a new ADR to supersede it — never edit an accepted ADR's decision section in place.
Reference canonical planning stack: [`plans/MASTER_PLAN.md`](../../plans/MASTER_PLAN.md).
