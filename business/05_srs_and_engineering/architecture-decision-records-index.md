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

An Architecture Decision Record (ADR) documents a significant architectural decision: the context that drove it, the alternatives considered, the decision made, and its consequences. ADRs create a permanent, searchable record of _why_ the system is designed the way it is — essential for onboarding new engineers and avoiding re-litigating resolved debates.

**ADR Statuses:**

- `Proposed` — Under discussion
- `Accepted` — Decision made and implemented
- `Deprecated` — Superseded by a newer ADR
- `Superseded` — Replaced (link to successor)

---

## ADR Index

### ADR-001 — Design System Gold Rebrand

| Field               | Value                                        |
| ------------------- | -------------------------------------------- |
| **File**            | `docs/adr/001-design-system-gold-rebrand.md` |
| **Status**          | Accepted                                     |
| **Date**            | March 29, 2026                               |
| **Decision Makers** | White Caves Development Team                 |

**Decision:** Rebrand primary color from Red (#D32F2F) to Gold (#D4AF37).

**Context:** Red conflicts with semantic error colors; gold conveys luxury, prestige, and aligns with Dubai's luxury real estate market expectations. International buyers (Indian, British, Russian, Chinese demographics) associate gold with luxury.

**Consequences:**

- All styled-components updated to use `--color-primary: #D4AF37`
- Design tokens system established (ADR-007 follows)
- Error/danger states use `#EF4444` (red) exclusively
- Brand consistency across all 40+ UI components

---

### ADR-002 — AI Assistant Plan API

| Field               | Value                                   |
| ------------------- | --------------------------------------- |
| **File**            | `docs/adr/002-ai-assistant-plan-api.md` |
| **Status**          | Accepted                                |
| **Date**            | April 2026                              |
| **Decision Makers** | White Caves Development Team            |

**Decision:** Implement a CRUD API (`/api/assistants`) for managing AI assistant plans, accessible by managing_director only.

**Context:** 40 AI assistant personas need persistent, editable "plans" (capabilities, prompts, department assignments). Rather than hardcoding these in source files, a dynamic API allows the managing director to evolve assistant behaviour without code changes.

**Consequences:**

- All plan content XSS-sanitized before storage and retrieval
- Public `GET /api/assistants` (no auth) for discovery
- Write operations restricted to `managing_director` role only
- Plans stored in MongoDB with full audit trail

---

### ADR-002b — RBAC Role Alias Architecture

| Field      | Value                                          |
| ---------- | ---------------------------------------------- |
| **File**   | `docs/adr/002-rbac-role-alias-architecture.md` |
| **Status** | Accepted                                       |
| **Date**   | April 2026                                     |

**Decision:** Use role alias strings (e.g., `lion`, `managing_director`) stored on User model, checked by `requireRole([...])` middleware.

**Context:** 29 distinct roles needed. A flat string stored on User is simpler than a separate permissions table for the current team size. Roles map to permission sets in middleware config.

**Consequences:**

- Adding a new role requires updating the role enum in Prisma schema
- Permission matrix is documented in `business_docs/09_user_roles_permissions/roles-matrix.md`
- No dynamic permission assignment (Phase 9 consideration)

---

### ADR-003 — Prisma + MongoDB Schema Design

| Field      | Value                                  |
| ---------- | -------------------------------------- |
| **File**   | `docs/adr/003-prisma-schema-design.md` |
| **Status** | Accepted                               |
| **Date**   | April 2026                             |

**Decision:** Use Prisma ORM 6.6 with MongoDB Atlas as the database provider.

**Context:** Real estate data is semi-structured — properties have varying fields by type (villa vs apartment vs commercial). MongoDB's flexible document model handles this better than a rigid SQL schema. Prisma provides type-safe queries and migration tooling.

**Consequences:**

- Schema lives in `prisma/schema.prisma`
- No SQL migrations — Prisma push / migrate
- MongoDB Atlas UAE region for data residency compliance (PDPL)
- Aggregation pipelines for complex analytics queries

---

### ADR-004 — UnifiedSidebar Dashboard Layout

| Field      | Value                                      |
| ---------- | ------------------------------------------ |
| **File**   | `docs/adr/004-sidebar-dashboard-layout.md` |
| **Status** | Accepted                                   |
| **Date**   | April 2026                                 |

**Decision:** Replace dual sidebar (SidebarContainer + EnhancedLeftSidebar) with a single `UnifiedSidebar` component at `src/components/layout/UnifiedSidebar/`.

**Context:** Two sidebar components caused state synchronisation bugs and duplicate code. The UnifiedDashboardPage was managing conflicting navigation state across two components. A single canonical component simplifies maintenance.

**Consequences:**

- `EnhancedLeftSidebar` and `SidebarContainer` are legacy — do not use in new code
- `UnifiedSidebar` owns navigation state via `sidebarSlice`
- `AppLayout` wraps `UnifiedSidebar` + content + AI sidebar
- `departmentConfig.ts` is the single source of truth for all 12 departments

---

### ADR-005 — Redux Slice Architecture

| Field      | Value                                      |
| ---------- | ------------------------------------------ |
| **File**   | `docs/adr/005-redux-slice-architecture.md` |
| **Status** | Accepted                                   |
| **Date**   | April 2026                                 |

**Decision:** Use Redux Toolkit with 13 domain-separated slices.

**Context:** Complex CRM state (leads, properties, auth, sidebar, AI assistants, notifications, etc.) needs predictable management with DevTools support. Context API was considered but does not scale to 13 domains with cross-slice selectors.

**Consequences:**

- Each slice owns one domain (no cross-slice mutations)
- Selectors exported from slice files (no derivation in components)
- Immer used by default (RTK) — mutations OK inside `createSlice`
- 309 test files cover slice logic

---

### ADR-006 — Express Error Handling Strategy

| Field      | Value                                    |
| ---------- | ---------------------------------------- |
| **File**   | `docs/adr/006-express-error-handling.md` |
| **Status** | Accepted                                 |
| **Date**   | April 2026                               |

**Decision:** All Express routes use `asyncHandler` wrapper + `AppError` class for a consistent error contract.

**Context:** Async errors in Express don't propagate to global error handler by default. 30+ route handlers need consistent 4xx/5xx responses. Different error shapes (validation vs auth vs not-found) must be unified.

**Consequences:**

- `asyncHandler(fn)` wraps every route handler
- `AppError(message, statusCode, errors[])` is the only error class used
- Global error middleware in `server/middleware/errorHandler.ts`
- All error responses have shape: `{ status, statusCode, message, errors? }`

---

### ADR-007 — Design Token System

| Field      | Value                                 |
| ---------- | ------------------------------------- |
| **File**   | `docs/adr/007-design-token-system.md` |
| **Status** | Accepted                              |
| **Date**   | April 2026                            |

**Decision:** Implement a CSS custom property design token system for all colours, typography, spacing, and border radii.

**Context:** Phase 6 requires Arabic RTL layout. RTL switching needs to be possible without component rewrites. CSS custom properties enable automatic `dir="rtl"` layout flipping when combined with logical properties (margin-inline vs margin-left).

**Consequences:**

- All styled-components reference CSS variables (e.g., `var(--color-primary)`)
- Light/dark mode: theme values swap via CSS variable override on `[data-theme="light"]`
- RTL: layout reverses with `[dir="rtl"]` CSS selector
- Token set documented in `business_docs/10_design_system/`

---

## Proposed ADRs (Not Yet Decided)

| ADR #   | Topic                                     | Status   | Target            |
| ------- | ----------------------------------------- | -------- | ----------------- |
| ADR-008 | GraphQL vs REST for Phase 7 Data & AI     | Proposed | Phase 7 planning  |
| ADR-009 | Redis vs Memcached for property caching   | Proposed | Phase 7 planning  |
| ADR-010 | Elasticsearch vs Typesense for search     | Proposed | Phase 7 planning  |
| ADR-011 | Bull vs node-cron for job scheduling      | Proposed | Phase 2 sprint 2  |
| ADR-012 | React Native vs PWA for mobile            | Proposed | Phase 10 planning |
| ADR-013 | Stripe vs Telr for UAE payment processing | Proposed | Phase 2 sprint 2  |
| ADR-014 | Sentry vs Datadog for error monitoring    | Proposed | Phase 2 sprint 3  |

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

| Option            | Pros | Cons |
| ----------------- | ---- | ---- |
| Option A (chosen) | ...  | ...  |
| Option B          | ...  | ...  |
| Option C          | ...  | ...  |

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

---

## ADR Quick Reference Guide

### Choosing the Right ADR Status

| Status          | Meaning                                                       | Use When                                               |
| --------------- | ------------------------------------------------------------- | ------------------------------------------------------ |
| **Proposed**    | Under discussion, not yet decided                             | Before the team alignment meeting                      |
| **Accepted**    | Decision finalised, being implemented                         | After consensus reached; implementation in progress    |
| **Implemented** | Decision fully deployed in production                         | After feature goes live                                |
| **Deprecated**  | Decision still in effect but no longer the preferred approach | When a better approach exists but migration is gradual |
| **Superseded**  | Replaced by a newer ADR                                       | When a fundamentally different decision is made        |

### Key Decision Criteria at White Caves

When evaluating architecture options, score each against these criteria:

| Criterion              | Weight | Description                                                           |
| ---------------------- | ------ | --------------------------------------------------------------------- |
| UAE/RERA compliance    | 30%    | Does this option support data residency, PDPL, RERA requirements?     |
| Developer experience   | 20%    | How quickly can a new developer understand and work with this?        |
| Operational cost       | 20%    | What does this cost to run at scale? (Phase 5: 500 agents, 50K leads) |
| Security posture       | 15%    | Does this introduce new attack surfaces?                              |
| Vendor dependency risk | 15%    | What happens if this vendor raises prices or shuts down?              |

---

## ADR-001 Full Record — Design System Gold → Red Rebrand

**Status:** Accepted
**Date:** March 2026
**Decision Makers:** Arslan (MD), @Una (CSS Specialist), @Grace (Lead Engineer)

### Context

The White Caves brand had evolved to use gold/amber (#D4AF37, #FFC107) as the primary accent colour inherited from the original design system. Brand review in March 2026 confirmed White Caves' identity is Red + White — consistent with the company name (white caves) and the premium Dubai real estate market positioning. Gold was a legacy choice from a generic luxury template.

### Decision

Replace all gold/amber CSS custom properties and Tailwind utilities with Red (#E31E24). The `--accent-gold` variable is renamed to `--accent-red` but the CSS variable name `--accent-gold` is preserved for backwards compatibility with existing component classes, with its value set to `#E31E24`.

### Alternatives Considered

| Option                   | Pros                                                        | Cons                        |
| ------------------------ | ----------------------------------------------------------- | --------------------------- |
| **Red #E31E24 (chosen)** | Matches brand identity; high contrast on white; distinctive | Adjustment period for team  |
| Retain gold              | No migration cost                                           | Not authentic to brand      |
| Blue accent              | Professional look                                           | Not White Caves brand       |
| Black accent             | Premium look                                                | Lacks warmth; too corporate |

### Consequences

**Positive:**

- Authentic brand alignment
- Higher contrast ratios on white backgrounds (WCAG compliant)
- Distinctive differentiation from gold-heavy competitors (PropertyFinder uses gold/orange)

**Negative:**

- All existing screenshots and design mockups outdated after change
- Marketing materials need update

**Rules established:**

- Never introduce gold (#D4AF37, #C9A84C, #FFB300, #FFC107, #FFD700) or amber/yellow in any UI component
- `--accent-gold` CSS variable = `#E31E24` (the value is red, the name is legacy)
- All Tailwind: `text-yellow-*`, `bg-yellow-*`, `border-yellow-*` classes prohibited in new components

---

## ADR-002 Full Record — AI Assistant Plan API Architecture

**Status:** Accepted
**Date:** March 2026
**Decision Makers:** Arslan (MD), @Aurora (Platform Lead), @Grace (Lead Engineer), @Joelle (ML Lead)

### Context

The 40 AI assistants need a backend API mechanism for their "plans" — structured task outputs that include markdown content, metadata, and action items. Three patterns were considered:

### Decision

REST endpoint: `POST /api/v1/ai-assistants/:id/generate-plan` with typed response schema. Plans stored in MongoDB (`AIPlan` model) linked to `AIAssistant`. Plan content in markdown (supports structure + formatting). XSS sanitisation applied to plan output before storage.

### Alternatives Considered

| Option                     | Pros                                               | Cons                                   |
| -------------------------- | -------------------------------------------------- | -------------------------------------- |
| **REST endpoint (chosen)** | Simple; stateless; easy to version; team expertise | No streaming                           |
| GraphQL mutation           | Better for complex nested data                     | Overhead for this use case             |
| WebSocket streaming        | Real-time generation stream                        | Complex; overkill for plan generation  |
| Webhook callback           | Non-blocking                                       | Complex async flow; more failure modes |

### Consequences

**Positive:**

- Simple, well-understood pattern; fast to implement
- Easily versioned (v2 can add streaming via SSE without breaking v1)
- AI plan generation can be queued and rate-limited

**Negative:**

- No streaming — user waits for full plan (mitigated by loading indicator + typical < 3s generation)
- Polled updates (client must refresh) — Phase 3: WebSocket push when plan completes

**Implementation notes:**

- XSS prevention: plan markdown sanitised via `DOMPurify` on frontend; `xss` library on backend
- Plan status: `GENERATING → READY | FAILED` (Zod discriminated union)
- Max plan size: 50KB (MongoDB document limit is 16MB; 50KB is practical limit for readable content)

---

## ADR-003: MongoDB Atlas vs PostgreSQL for Primary Database

**Status:** Accepted
**Date:** March 2026
**Decision Makers:** Arslan (MD), @Barbara (Database Architect), @Aurora (Platform Lead)

### Context

Real estate CRM data has varied structure: properties have different attribute sets (villa vs. apartment), leads have dynamic custom fields added by agents, and AI assistant outputs are semi-structured. Primary database selection was a foundational decision.

### Decision

MongoDB Atlas (primary operational database) + PostgreSQL (analytics/reporting database added in Phase 7).

### Alternatives Considered

| Option                           | Pros                                                                       | Cons                                                             |
| -------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **MongoDB Atlas (chosen)**       | Flexible schema; UAE Atlas region; strong Node/Prisma support; JSON-native | Less mature SQL analytics; no ACID cross-collection transactions |
| PostgreSQL (primary)             | Full ACID; excellent analytics; mature ecosystem                           | Rigid schema; more migrations; less JSON-friendly                |
| Supabase (PostgreSQL + realtime) | Realtime + auth built-in                                                   | US-only hosting; vendor lock-in risk                             |
| PlanetScale (MySQL)              | Serverless; excellent DX                                                   | No UAE region; not well-suited for document-like data            |

### Consequences

**Positive:**

- UAE data residency without VPN complexity
- Dynamic property attributes without schema migrations
- Excellent Node.js support (Mongoose/Prisma)
- MongoDB Atlas offers built-in search (basic) and can add Elasticsearch later

**Negative:**

- Joins require Prisma `include` (not SQL JOIN — slightly less flexible for complex analytics)
- Mitigation: Phase 7 introduces PostgreSQL analytics DB (dbt + Metabase) for complex reporting

---

## ADR-004: Firebase Auth vs Custom JWT vs Auth0

**Status:** Accepted
**Date:** March 2026
**Decision Makers:** @Daniela (Auth Specialist), @Grace (Lead Engineer)

### Context

The platform needs authentication for ~29 user roles plus external portal users (tenants, landlords). Decision: build custom, use Firebase, or use Auth0/Clerk.

### Decision

Firebase Authentication (Google OAuth + email/password) as identity provider; White Caves issues its own JWT (with role claims) after Firebase verification.

### Alternatives Considered

| Option                          | Pros                                                  | Cons                                                                   |
| ------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------- |
| **Firebase + own JWT (chosen)** | Google SSO free; reliable OTP; own role claims in JWT | Firebase is US-hosted (SCCs needed for EU clients); extra hop for auth |
| Auth0                           | Extensive role management; enterprise features        | Cost ($240/month for 1,000 MAU); US-hosted                             |
| Clerk                           | Modern DX; embedded UI                                | $25/month; US-hosted; newer product                                    |
| Custom JWT only                 | Full control; UAE-hosted                              | Development time; security risk if done incorrectly                    |
| Supabase Auth                   | Full stack integration                                | US-only hosting; no UAE region                                         |

### Consequences

**Positive:**

- Firebase is free for < 10,000 MAU (adequate for years)
- Google OAuth significantly reduces staff password management burden
- Own JWT gives full control over role claims and expiry
- Firebase handles 2FA (Phase 9 — enable Firebase MFA)

**Negative:**

- Firebase is US-hosted — EU client data touches US (mitigated by SCCs)
- Double hop: Firebase verify → White Caves JWT issue (< 50ms overhead)
- 2FA not enforced until Phase 9 (risk window)

---

## ADR-005: Vercel + Railway vs AWS for Hosting

**Status:** Accepted
**Date:** March 2026
**Decision Makers:** @Lisa (Cloud), @Gwynne (DevOps), Arslan (MD)

### Context

Where to host frontend (React/Vite) and backend (Node/Express)? Options: platform-as-a-service vs AWS.

### Decision

Vercel for frontend; Railway/Render for backend API. Migrate to AWS when monthly infrastructure costs exceed AED 3,000/month or specific AWS services are needed (e.g., ElastiCache, OpenSearch).

### Alternatives Considered

| Option                        | Pros                                                               | Cons                                                          |
| ----------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------- |
| **Vercel + Railway (chosen)** | Zero-config deployment; CI/CD built-in; free tier; rapid iteration | US-based; less control; more expensive at scale               |
| AWS (EC2 + CloudFront)        | Full control; UAE region available; cost-effective at scale        | Complex setup; requires DevOps expertise                      |
| AWS Amplify + Lambda          | Serverless; auto-scale                                             | Cold starts hurt real estate UX (response time unpredictable) |
| Google Cloud Run              | Excellent autoscaling                                              | Less familiar to team                                         |
| DigitalOcean App Platform     | Simple; EU/regional                                                | Less ecosystem integrations                                   |

### Migration Trigger to AWS (criteria for ADR-005-MIGRATE):

- Monthly bill > AED 3,000 on PaaS
- Need for UAE region database (already on Atlas UAE)
- Need for ElastiCache in UAE region (Phase 7)
- Compliance requirement for UAE-hosted API (if PDPL implementing regs require it)

### Consequences

**Positive:**

- Zero-to-deployed in minutes; excellent developer experience
- Vercel Edge Network gives < 50ms TTFB globally
- No DevOps hire needed until scale warrants it

**Negative:**

- US hosting for API (SCCs required for EU clients)
- Limited control over runtime environment
- Cost increases sharply with bandwidth at scale

---

**Document Owner:** Technology Department (Aurora — Platform Lead)
**Update Rule:** Add new ADR entry within 48 hours of any accepted architectural decision
**Full ADR files location:** `docs/adr/`
**Version History:** v1.0 April 2026 (index only); v2.0 April 2026 (full records for ADR-001 through ADR-005)
