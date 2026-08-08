# Architecture Decision Records (ADR)

**Last Updated:** 2026-08-02  
**Status:** Active  
**Owner:** @Ada (Chief Architect)  
**Source of Truth:** Yes

## What ADRs do here

Architecture Decision Records capture durable technical decisions, why they were made,
and what consequences follow. ADRs are append-only governance artifacts: when a decision
changes, the old ADR is superseded rather than silently rewritten.

## Canonical ADR series

The active naming convention is:

`ADR-###-short-title.md`

Only this canonical format should be used for new architecture decisions.

| ADR | Title | Status | Date |
| --- | ----- | ------ | ---- |
| [ADR-001](./ADR-001-auth-dual-provider.md) | Firebase + JWT dual-provider authentication | Accepted | 2026-01-15 |
| [ADR-002](./ADR-002-mongodb-prisma.md) | MongoDB + Prisma ORM over PostgreSQL alternatives | Accepted | 2026-01-15 |
| [ADR-003](./ADR-003-crm-module-registry.md) | Lazy-loaded CRM module registry pattern | Accepted | 2026-03-10 |
| [ADR-004](./ADR-004-wave-gate-model.md) | Wave-based gated delivery model | Accepted | 2026-03-20 |
| [ADR-005](./ADR-005-superuser-lion-pattern.md) | Creator-email superuser canonicalization (lion pattern) | Accepted | 2026-04-01 |
| [ADR-006](./ADR-006-compilation-filters-and-resilience.md) | Compilation log filtering, multi-currency calculation, and payment fallbacks | Accepted | 2026-07-27 |

## Historical pre-canonical records

The following files remain in-repo as historical decision records from the pre-canonical
ADR naming phase. They are **not** the preferred numbering scheme for new records and are
currently under normalization review because some numbers collide with the canonical series.

| Historical file | Current disposition | Notes |
| --- | --- | --- |
| [`001-design-system-gold-rebrand.md`](./001-design-system-gold-rebrand.md) | Historical / needs supersession review | Conflicts with current brand-palette governance in repo-wide instructions |
| [`002-ai-assistant-plan-api.md`](./002-ai-assistant-plan-api.md) | Historical / candidate for supersession note | Useful implementation history, non-canonical numbering |
| [`002-rbac-role-alias-architecture.md`](./002-rbac-role-alias-architecture.md) | Historical / candidate for supersession note | Number collision with canonical ADR-002 |
| [`003-prisma-schema-design.md`](./003-prisma-schema-design.md) | Historical / candidate for migration | Number collision risk with canonical ADR-003 series |
| [`004-sidebar-dashboard-layout.md`](./004-sidebar-dashboard-layout.md) | Historical / candidate for migration | Number collision with canonical ADR-004 |
| [`005-redux-slice-architecture.md`](./005-redux-slice-architecture.md) | Historical / candidate for migration | Number collision with canonical ADR-005 |
| [`006-express-error-handling.md`](./006-express-error-handling.md) | Historical / candidate for migration | Overlaps canonical ADR-006 namespace |
| [`007-design-token-system.md`](./007-design-token-system.md) | Historical / candidate for migration | Legacy numbering, no collision yet but non-canonical |

## ADR lifecycle

```text
Proposed → Accepted → Deprecated → Superseded
```

## Rules for future updates

- New ADRs must use the canonical `ADR-###` naming format.
- If a historical ADR is still authoritative, create a canonical successor or supersession note.
- Do not create a second active decision for the same concern without stating the supersession path.
- Link implementation-facing design docs back to the relevant ADR where practical.

## Governance

ADRs are owned by the architecture layer and should align with the canonical planning stack:

- [`../../plans/MASTER_PLAN.md`](../../plans/MASTER_PLAN.md)
- [`../../plans/PENDING_TASKS_ONLY.md`](../../plans/PENDING_TASKS_ONLY.md)
- [`../INDEX.md`](../INDEX.md)
