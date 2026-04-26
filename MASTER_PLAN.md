# MASTER PLAN – White Caves
**Last Updated:** 2026-04-26  
**Progress:** Foundation ✅ · Phase 1 (Homepage) 🚧 · Phase 2 (Landlord/Tenant Portals) 🔲  
**Priority Reset:** Homepage → Landlord/Tenant portals → Deferred (Phase 3–8) → Full CRM (Phase 9)

> **Active phase plans:** See `/plans/` for detailed task lists per phase.  
> **Business docs:** `/business_docs/` (canonical business documentation).  
> **Architecture decisions:** `/docs/adr/`.

---

## 🔢 PRIORITY ORDER

| Priority | Phase | Goal | Plan File |
|----------|-------|------|-----------|
| **#1 — Now** | Phase 1 | Public Homepage — full UI with dummy data | [PHASE_1_HOMEPAGE.md](./plans/PHASE_1_HOMEPAGE.md) |
| **#2 — Next** | Phase 2 | Landlord & Tenant Self-Service Portals — simple client-facing login | [PHASE_2_LANDLORD_TENANT.md](./plans/PHASE_2_LANDLORD_TENANT.md) |
| **#3 — High** | Phase 3 | Full CRM — all tabs for `arslanmalikgoraha@gmail.com` (managing_director) | [PHASE_3_CRM_SUPERUSER.md](./plans/PHASE_3_CRM_SUPERUSER.md) |
| **#4–10** | Phases 4–10 | WhatsApp, Compliance, Arabic, RBAC (Phase 9), PWA, etc. | [PHASE_3_AND_BEYOND.md](./plans/PHASE_3_AND_BEYOND.md) |

---

## 👤 Super User

| Detail | Value |
|--------|-------|
| Email | `arslanmalikgoraha@gmail.com` |
| Role | `managing_director` |
| Seed account | `owner@whitecaves.ae` / role `owner` — dummy data only, not the primary super user |

> Run `npm run db:seed` to create both accounts. Never create a second `managing_director` for `arslanmalikgoraha@gmail.com`.

---

## ✅ Foundation Complete (Do Not Re-Do)

- **Phase 0:** `/plans` folder created, root .md files organized.
- **Phase 0.2:** `/business_docs/` created with 98+ files — RERA, Ejari, WhatsApp, multi-currency, 24 AI assistant profiles, 15 sections.
- **Phase 0.5:** Duplicate components removed, dead code cleaned (~190KB), freelancer refs mapped to `affiliated_agent`.
- **Phase 0.75:** CRM dual-sidebar audited, all 29 role tab-mappings verified, responsive collapse confirmed.
- **Phase 1a:** WhatsApp assistant renamed Linda → **Nadia** across 100+ references.
- **Phase 0.6:** Design tokens, component library, AppLayout, Redux slices, SEO/a11y, bundle optimization.
- **Phase 0.8:** AI Assistant API (`/api/assistants`) with XSS protection, AssistantPlanEditor, AssistantPlanView.

---

## 🚧 Active Work

### Phase 1 — Homepage (Priority #1)
See full task list: [plans/PHASE_1_HOMEPAGE.md](./plans/PHASE_1_HOMEPAGE.md)

Key remaining tasks:
- [ ] Featured Properties section visible on homepage (using `HOME_PROPERTIES` dummy data)
- [ ] All section images load correctly (no broken Unsplash URLs)
- [ ] Mobile responsiveness audit at 375px / 768px
- [ ] Contact form shows success state on submit
- [ ] Lighthouse Performance > 90

### Phase 2 — Landlord & Tenant Portals (Priority #2)
See full task list: [plans/PHASE_2_LANDLORD_TENANT.md](./plans/PHASE_2_LANDLORD_TENANT.md)

Key remaining tasks:
- [ ] `/landlord-portal` page with properties, tenants, payments, maintenance tabs
- [ ] `/tenant-portal` page with lease, payments, maintenance, documents tabs
- [ ] Role-based redirect: `landlord` → `/landlord-portal`, `tenant` → `/tenant-portal`
- [ ] `arslanmalikgoraha@gmail.com` (managing_director) signs in → CRM dashboard
- [ ] Add `landlord@whitecaves.ae` and `tenant@whitecaves.ae` to seed

### Phase 3 — Full CRM Super User (Priority #3)
See full task list: [plans/PHASE_3_CRM_SUPERUSER.md](./plans/PHASE_3_CRM_SUPERUSER.md)

Key remaining tasks:
- [ ] Sign-in flow end-to-end: `arslanmalikgoraha@gmail.com` → dashboard
- [ ] All 8 CRM tabs navigate without crashing
- [ ] Properties/Leads/Agents/Users CRUD all work
- [ ] All 13 AI assistant dashboards render without errors
- [ ] Analytics charts render with real or dummy data

---

## 🔲 Deferred Phases

Backend integrations, WhatsApp real API, compliance, Arabic RTL, RBAC, and PWA are deferred.  
See: [plans/PHASE_3_AND_BEYOND.md](./plans/PHASE_3_AND_BEYOND.md)

---

## Strict Policies (For Every Merge)

- [ ] Build passes (`npm run build`)
- [ ] Tests pass (`npm run test:run`)
- [ ] No `any`, TypeScript strict mode
- [ ] Error boundaries on all lazy-loaded components
- [ ] Design tokens used (gold/dark theme — no hardcoded colors)
- [ ] WCAG 2.1 AA minimum (Accessibility Lighthouse > 90)

---

## Reference

- `/plans/PHASE_1_HOMEPAGE.md` — Homepage detailed task list
- `/plans/PHASE_2_LANDLORD_TENANT.md` — Landlord & Tenant portals task list
- `/plans/PHASE_3_CRM_SUPERUSER.md` — Full CRM for managing_director (Phase 3)
- `/plans/PHASE_3_AND_BEYOND.md` — All deferred phases (WhatsApp, Compliance, Arabic, RBAC Phase 9, PWA)
- `/business_docs/` — business requirements, AI assistant profiles, design system, roles
- `/docs/adr/` — Architecture Decision Records
- `/plans/` — full historical plan archive and session summaries
