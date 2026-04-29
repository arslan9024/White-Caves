# Architecture Decision Records — Master Index
# White Caves Real Estate Platform

> **Document ID:** WC-ADR-INDEX-001
> **Version:** 1.0
> **Date:** April 2026
> **Status:** Active
> **Owner:** Technology Department (Aurora)
> **ADR Location:** `docs/adr/`
> **Classification:** Internal

---

## What Is an ADR?

An Architecture Decision Record (ADR) documents a significant architectural decision: the context that drove it, the alternatives considered, the decision made, and its consequences. ADRs create a permanent, searchable record of *why* the system is designed the way it is — essential for onboarding new engineers and avoiding re-litigating resolved debates.

**ADR Statuses:**
- `Proposed` — Under discussion
- `Accepted` — Decision made and implemented
- `Deprecated` — Superseded by a newer ADR
- `Superseded` — Replaced (link to successor)

---

## ADR Index

### ADR-001 — Design System Gold Rebrand

| Field | Value |
|-------|-------|
| **File** | `docs/adr/001-design-system-gold-rebrand.md` |
| **Status** | Accepted |
| **Date** | March 29, 2026 |
| **Decision Makers** | White Caves Development Team |

**Decision:** Rebrand primary color from Red (#D32F2F) to Gold (#D4AF37).

**Context:** Red conflicts with semantic error colors; gold conveys luxury, prestige, and aligns with Dubai's luxury real estate market expectations. International buyers (Indian, British, Russian, Chinese demographics) associate gold with luxury.

**Consequences:**
- All styled-components updated to use `--color-primary: #D4AF37`
- Design tokens system established (ADR-007 follows)
- Error/danger states use `#EF4444` (red) exclusively
- Brand consistency across all 40+ UI components

---

### ADR-002 — AI Assistant Plan API

| Field | Value |
|-------|-------|
| **File** | `docs/adr/002-ai-assistant-plan-api.md` |
| **Status** | Accepted |
| **Date** | April 2026 |
| **Decision Makers** | White Caves Development Team |

**Decision:** Implement a CRUD API (`/api/assistants`) for managing AI assistant plans, accessible by managing_director only.

**Context:** 40 AI assistant personas need persistent, editable "plans" (capabilities, prompts, department assignments). Rather than hardcoding these in source files, a dynamic API allows the managing director to evolve assistant behaviour without code changes.

**Consequences:**
- All plan content XSS-sanitized before storage and retrieval
- Public `GET /api/assistants` (no auth) for discovery
- Write operations restricted to `managing_director` role only
- Plans stored in MongoDB with full audit trail

---

### ADR-002b — RBAC Role Alias Architecture

| Field | Value |
|-------|-------|
| **File** | `docs/adr/002-rbac-role-alias-architecture.md` |
| **Status** | Accepted |
| **Date** | April 2026 |

**Decision:** Use role alias strings (e.g., `lion`, `managing_director`) stored on User model, checked by `requireRole([...])` middleware.

**Context:** 29 distinct roles needed. A flat string stored on User is simpler than a separate permissions table for the current team size. Roles map to permission sets in middleware config.

**Consequences:**
- Adding a new role requires updating the role enum in Prisma schema
- Permission matrix is documented in `business_docs/09_user_roles_permissions/roles-matrix.md`
- No dynamic permission assignment (Phase 9 consideration)

---

### ADR-003 — Prisma + MongoDB Schema Design

| Field | Value |
|-------|-------|
| **File** | `docs/adr/003-prisma-schema-design.md` |
| **Status** | Accepted |
| **Date** | April 2026 |

**Decision:** Use Prisma ORM 6.6 with MongoDB Atlas as the database provider.

**Context:** Real estate data is semi-structured — properties have varying fields by type (villa vs apartment vs commercial). MongoDB's flexible document model handles this better than a rigid SQL schema. Prisma provides type-safe queries and migration tooling.

**Consequences:**
- Schema lives in `prisma/schema.prisma`
- No SQL migrations — Prisma push / migrate
- MongoDB Atlas UAE region for data residency compliance (PDPL)
- Aggregation pipelines for complex analytics queries

---

### ADR-004 — UnifiedSidebar Dashboard Layout

| Field | Value |
|-------|-------|
| **File** | `docs/adr/004-sidebar-dashboard-layout.md` |
| **Status** | Accepted |
| **Date** | April 2026 |

**Decision:** Replace dual sidebar (SidebarContainer + EnhancedLeftSidebar) with a single `UnifiedSidebar` component at `src/components/layout/UnifiedSidebar/`.

**Context:** Two sidebar components caused state synchronisation bugs and duplicate code. The UnifiedDashboardPage was managing conflicting navigation state across two components. A single canonical component simplifies maintenance.

**Consequences:**
- `EnhancedLeftSidebar` and `SidebarContainer` are legacy — do not use in new code
- `UnifiedSidebar` owns navigation state via `sidebarSlice`
- `AppLayout` wraps `UnifiedSidebar` + content + AI sidebar
- `departmentConfig.ts` is the single source of truth for all 12 departments

---

### ADR-005 — Redux Slice Architecture

| Field | Value |
|-------|-------|
| **File** | `docs/adr/005-redux-slice-architecture.md` |
| **Status** | Accepted |
| **Date** | April 2026 |

**Decision:** Use Redux Toolkit with 13 domain-separated slices.

**Context:** Complex CRM state (leads, properties, auth, sidebar, AI assistants, notifications, etc.) needs predictable management with DevTools support. Context API was considered but does not scale to 13 domains with cross-slice selectors.

**Consequences:**
- Each slice owns one domain (no cross-slice mutations)
- Selectors exported from slice files (no derivation in components)
- Immer used by default (RTK) — mutations OK inside `createSlice`
- 309 test files cover slice logic

---

### ADR-006 — Express Error Handling Strategy

| Field | Value |
|-------|-------|
| **File** | `docs/adr/006-express-error-handling.md` |
| **Status** | Accepted |
| **Date** | April 2026 |

**Decision:** All Express routes use `asyncHandler` wrapper + `AppError` class for a consistent error contract.

**Context:** Async errors in Express don't propagate to global error handler by default. 30+ route handlers need consistent 4xx/5xx responses. Different error shapes (validation vs auth vs not-found) must be unified.

**Consequences:**
- `asyncHandler(fn)` wraps every route handler
- `AppError(message, statusCode, errors[])` is the only error class used
- Global error middleware in `server/middleware/errorHandler.ts`
- All error responses have shape: `{ status, statusCode, message, errors? }`

---

### ADR-007 — Design Token System

| Field | Value |
|-------|-------|
| **File** | `docs/adr/007-design-token-system.md` |
| **Status** | Accepted |
| **Date** | April 2026 |

**Decision:** Implement a CSS custom property design token system for all colours, typography, spacing, and border radii.

**Context:** Phase 6 requires Arabic RTL layout. RTL switching needs to be possible without component rewrites. CSS custom properties enable automatic `dir="rtl"` layout flipping when combined with logical properties (margin-inline vs margin-left).

**Consequences:**
- All styled-components reference CSS variables (e.g., `var(--color-primary)`)
- Light/dark mode: theme values swap via CSS variable override on `[data-theme="light"]`
- RTL: layout reverses with `[dir="rtl"]` CSS selector
- Token set documented in `business_docs/10_design_system/`

---

## Proposed ADRs (Not Yet Decided)

| ADR # | Topic | Status | Target |
|-------|-------|--------|--------|
| ADR-008 | GraphQL vs REST for Phase 7 Data & AI | Proposed | Phase 7 planning |
| ADR-009 | Redis vs Memcached for property caching | Proposed | Phase 7 planning |
| ADR-010 | Elasticsearch vs Typesense for search | Proposed | Phase 7 planning |
| ADR-011 | Bull vs node-cron for job scheduling | Proposed | Phase 2 sprint 2 |
| ADR-012 | React Native vs PWA for mobile | Proposed | Phase 10 planning |
| ADR-013 | Stripe vs Telr for UAE payment processing | Proposed | Phase 2 sprint 2 |
| ADR-014 | Sentry vs Datadog for error monitoring | Proposed | Phase 2 sprint 3 |

---

## ADR Template

```markdown
# ADR-{NUMBER}: {SHORT TITLE}

**Status:** Proposed / Accepted / Deprecated / Superseded by ADR-{N}
**Date:** YYYY-MM-DD
**Decision Makers:** {names/roles}

## Context

{What situation made this decision necessary? What forces/constraints apply?}

## Decision

{What was decided?}

## Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| Option A (chosen) | ... | ... |
| Option B | ... | ... |
| Option C | ... | ... |

## Consequences

**Positive:**
- {expected benefits}

**Negative:**
- {trade-offs accepted}

**Risks:**
- {potential issues to monitor}

## Links

- {Related ADRs, issues, PRs, docs}
```

---

**Document Owner:** Technology Department (Aurora)
**Update Rule:** Add new ADR entry within 48 hours of any accepted architectural decision
**ADR files location:** `docs/adr/`
