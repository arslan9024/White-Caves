# MASTER PLAN – White Caves
**Last Updated:** 2026-03-30  
**Progress:** ████████░░ 80% (Phase 0,0.2,0.5,0.75 done; 0.6 90%; 0.8 complete; Phase1 15%)  
**Strict policies enforced.**

> **Reference:** For the full historical plan, see `/plans/MASTER_PLAN.md`.  
> **Business docs:** `/business_docs/` (canonical business documentation).  
> **Architecture decisions:** `/docs/adr/`.

---

## Completed

- **Phase 0:** `/plans` created, root .md files moved, tasks extracted.
- **Phase 0.2:** `/business_docs/` created, researched, all department docs in place (RERA, Ejari, WhatsApp, multi-currency). 24 AI assistant profiles documented.
- **Phase 0.5:** Duplicate components removed, Mongoose/Prisma models consolidated, dead code cleaned (~190KB removed), freelancer refs mapped to `affiliated_agent`.
- **Phase 0.75:** CRM dual-sidebar audited, all 26 role tab-mappings verified, responsive collapse confirmed.
- **Phase 1a:** WhatsApp assistant renamed Linda → **Nadia** across 100+ references.
- **Phase 0.6:** Design tokens, component library, AppLayout (TopBar + SidebarContainer + RightPanelContainer), Redux slices (sidebar, aiAssistantDashboard, navigation), public site SEO/a11y, bundle optimization.
- **Phase 0.8:** AI Assistant API — `GET/POST/PUT/DELETE /api/assistants` + `GET /api/assistants/:id/plan` with auth, path validation, XSS sanitisation. Frontend service + Redux async thunks (`fetchAssistantPlan`). `AssistantPlanView` component. Admin `AssistantPlanEditor` (super-user only).

---

## In Progress / Pending

### Phase 1 (15%)

- [x] 1a. Rename WhatsApp assistant → Nadia
- [x] SEO & a11y (meta/OG/JSON-LD, form labels, aria, dynamic titles)
- [x] Bundle optimization (lazy-loading, code-splitting, inline skeleton)
- [ ] 1. WhatsApp recovery: LocalAuth, auto-reconnect, heartbeat
- [ ] 2. E2E testing: Vitest coverage >50%, Playwright critical flows, test factories
- [ ] 3. Features: DB indexes finalized, file uploads (Multer + S3/local)
- [ ] 4. Bugs: webhook timeout (async), WhatsApp dedup
- [ ] 5. RBAC: middleware, frontend conditional render, data segmentation, public favorites
- [ ] 6. Design polish: full Phase 0.6 compliance audit
- [ ] 7. Code quality: Storybook, Swagger/OpenAPI, pre-commit hooks finalized
- [ ] 8. Docs: README update, API docs, ADRs for Phase 0.8
- [ ] 9. Deployment: Vercel env vars verified, rollback plan documented

---

## Progress Bar

```
[████████░░] 80%
 Phase0 ████  Phase0.2 ████  Phase0.5 ████  Phase0.75 ████
 Phase0.6 ███▓  Phase0.8 ████  Phase1 █░░░░
```

---

## Strict Policies Checklist (merge to main)

- [ ] Build passes (`npm run build`)
- [ ] Tests pass (`npm run test:run`)
- [ ] No `any`, TypeScript strict mode
- [ ] Error boundaries + API error handling on all routes
- [ ] MongoDB/Prisma validated and indexed
- [ ] RBAC active (middleware + frontend guards)
- [ ] Design tokens used, unified sidebar + top navbar
- [ ] WCAG 2.1 AA, Lighthouse > 90
- [ ] No half-features (every feature end-to-end, tested, accessible)
- [ ] ADR written for every significant architectural decision

---

## Reference

- `/business_docs/` — business requirements, AI assistant profiles, design system, roles
- `/docs/adr/` — Architecture Decision Records
- `/plans/` — full historical plan archive and session summaries
