# Phase 33 — Priority Module: Homepage + Superuser Unification + Leasing E2E

> **Priority:** P0 (highest)
> **Status:** Planning Updated (Docs-first, coding gate enforced)
> **Date:** May 2026
> **Goal:** Deliver the most business-critical module: best homepage lead capture, one executive Gmail superuser identity, and complete tenant/landlord/leasing-agent journey from first touch to lease closure.

---

## 1) Executive Outcome

This phase unifies 3 business-critical streams into one operating module:

1. **Best Homepage (Conversion-First Dubai Leasing Focus)**
2. **Single Superuser Login** (`arslanmalikgoraha@gmail.com`) with one executive control path
3. **Leasing End-to-End Journey** (Tenant + Landlord + Leasing Agent) from lead creation to renewal/exit

---

## 2) Current Project Analysis (Observed State)

### 2.1 What is already strong

- Homepage foundation is advanced (`plans/PHASE_1_HOMEPAGE.md` + live route wiring)
- Portals are delivered for landlord and tenant (Phase 2 DoD complete)
- Dashboard and CRM shell are live for executive role workflows
- Role alias normalization partially exists in permission/RBAC layers

### 2.2 What is fragmented

- Executive identity is represented through multiple aliases across frontend and routing context:
  - `lion`
  - `owner`
  - `managing_director`
  - related privileged aliases in normalization maps
- Route paths still include legacy alias paths (`/lion/dashboard`, `/owner/dashboard`) even where redirects exist.
- Business flow docs need one canonical leasing lifecycle that joins homepage lead capture with tenancy execution.

---

## 3) Canonical Identity Policy (Priority Module)

## Canonical executive account

- **Email:** `arslanmalikgoraha@gmail.com`
- **Business persona:** Owner + Managing Director + Lion (single identity)
- **System canonical role target:** `owner` (with alias normalization accepted for backward compatibility)

## Alias handling policy

- Aliases remain accepted at ingress for compatibility.
- Internal storage, routing decisions, and authorization checks must normalize to canonical executive role behavior.

| Incoming value      | Normalized behavior        | Notes                            |
| ------------------- | -------------------------- | -------------------------------- |
| `lion`              | executive/owner-equivalent | keep only as compatibility alias |
| `managing_director` | `owner` equivalent         | supported in RBAC normalization  |
| `owner`             | `owner`                    | canonical internal target        |

---

## 4) Leasing E2E Journey (Business-Critical Sequence)

## Stage A — Homepage to Qualified Lead

1. Visitor lands on homepage
2. Leasing-focused CTA clicked (Rent in Dubai / Book Viewing / Talk to Agent)
3. Lead captured with source attribution (`homepage_search`, `homepage_cta`, `whatsapp_homepage`)
4. Lead assigned to leasing pipeline

## Stage B — Lead to Viewing

1. Agent qualifies lead (budget, area, unit type, move-in date)
2. Viewing slot booked
3. Reminder + confirmation via WhatsApp/email
4. Post-viewing feedback logged

## Stage C — Offer to Contract

1. Offer submitted
2. Negotiation + landlord approval
3. Tenancy contract generated
4. Ejari registration initiated

## Stage D — Active Lease Operations

1. Payment schedule active (PDC/digital)
2. Maintenance requests lifecycle tracked
3. Landlord financial visibility updated
4. Tenant portal self-service active

## Stage E — Renewal / Exit

1. 90/60/30-day renewal automation
2. Rent index + compliance checks
3. Renewal execution or move-out + closure

---

## 5) Homepage Requirements for This Priority Module

- Homepage must prioritize **leasing conversion** over generic content ordering.
- Above-the-fold must include:
  - Dubai leasing search intent
  - clear CTA to leasing journey start
  - trust anchors (RERA compliance, verified listings, response SLA)
- Mandatory tracked events:
  - `homepage_hero_cta_click`
  - `homepage_leasing_search_submit`
  - `homepage_whatsapp_start`
  - `homepage_viewing_request_submit`

---

## 6) Gate-Aligned Execution Order

Per governance policy, coding stays blocked until gates pass.

### Track 1 — Docs/Planning (active now)

- Expand business docs to full leasing lifecycle depth
- Finalize superuser identity unification acceptance criteria
- Define homepage leasing conversion metric contracts

### Track 2 — Gate Validation

- 1000% depth evidence complete on prerequisites
- Readiness packet score >=92% with matrix evidence and sign-offs
- `@Ada — Context Ready (1000% Depth, 92% Readiness) — Coding Phase Approved`

### Track 3 — Implementation (post gate)

- Apply identity unification in auth/routing/role maps
- Homepage conversion enhancements
- Leasing E2E integration hardening (tenant-landlord-agent continuity)

---

## 7) Acceptance Criteria (Priority Module)

### Identity & Access

- [ ] `arslanmalikgoraha@gmail.com` is the only canonical executive superuser in operational runbooks
- [ ] `lion` and `managing_director` resolve safely to canonical executive behavior
- [ ] Executive dashboard route entry is deterministic and single-path for authenticated superuser

### Homepage

- [ ] Homepage primary messaging prioritizes Dubai leasing conversion
- [ ] Leasing CTA journey is measurable with event-level analytics
- [ ] Mobile journey (375/768) supports full CTA → lead submission without friction

### Leasing E2E

- [ ] Tenant, landlord, and leasing-agent workflow is fully documented as one unified lifecycle
- [ ] Hand-off states between lead, viewing, offer, contract, Ejari, payment, maintenance, and renewal are defined
- [ ] Error/fallback states are documented for each stage

---

## 8) Dependencies

- `plans/PHASE_1_HOMEPAGE.md`
- `plans/PHASE_3_CRM_SUPERUSER.md`
- `business_docs/09_crm_features/tenant-portal.md`
- `business_docs/09_crm_features/landlord-portal.md`
- `business_docs/09_crm_features/tenancy-ejari.md`
- `business_docs/04_workflows/rental-management-flowchart.md`

---

## 9) Handoff

**Planning owner:** @Margaret
**Architecture sign-off:** @Ada
**Implementation owners (post-gate):** @Mira, @Una, @Daniela, @Katherine

---

## 10) Execution Pack

For direct gate-to-code task breakdown, use:

- `plans/PHASE_33_IMPLEMENTATION_EXECUTION_PACK.md`
