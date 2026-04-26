# MASTER PLAN – White Caves
**Last Updated:** 2026-04-26  
**Progress:** Foundation ✅ · Phase 1 (Homepage) 🚧 · Phase 2 (CRM) 🚧  
**Priority Reset:** Frontend-first → CRM super user → Backend integrations

> **Active phase plans:** See `/plans/` for detailed task lists per phase.  
> **Business docs:** `/business_docs/` (canonical business documentation).  
> **Architecture decisions:** `/docs/adr/`.

---

## 🔢 NEW PRIORITY ORDER

| Priority | Phase | Goal | Plan File |
|----------|-------|------|-----------|
| **#1 — Now** | Phase 1 | Public Homepage — full UI with dummy data | [PHASE_1_HOMEPAGE.md](./plans/PHASE_1_HOMEPAGE.md) |
| **#2 — Next** | Phase 2 | CRM + Super User Login — all features with `owner@whitecaves.ae` | [PHASE_2_CRM_SUPERUSER.md](./plans/PHASE_2_CRM_SUPERUSER.md) |
| **#3 — Later** | Phase 3+ | WhatsApp, RBAC, Compliance, Portals, Arabic, PWA | [PHASE_3_AND_BEYOND.md](./plans/PHASE_3_AND_BEYOND.md) |

---

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

### Phase 2 — CRM + Super User (Priority #2)
See full task list: [plans/PHASE_2_CRM_SUPERUSER.md](./plans/PHASE_2_CRM_SUPERUSER.md)

Key remaining tasks:
- [ ] Sign-in flow end-to-end: `owner@whitecaves.ae` → dashboard
- [ ] All 11 CRM tabs navigate without crashing
- [ ] Properties/Leads/Agents CRUD all work
- [ ] All 13 AI assistant dashboards render without errors
- [ ] Analytics charts render with real or dummy data

---

## 🔲 Deferred Phases

All backend integrations, WhatsApp real API, compliance, portals, and Arabic RTL are deferred.  
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
- `/plans/PHASE_2_CRM_SUPERUSER.md` — CRM + super user detailed task list
- `/plans/PHASE_3_AND_BEYOND.md` — All deferred features (WhatsApp, compliance, portals, Arabic)
- `/business_docs/` — business requirements, AI assistant profiles, design system, roles
- `/docs/adr/` — Architecture Decision Records
- `/plans/` — full historical plan archive and session summaries
