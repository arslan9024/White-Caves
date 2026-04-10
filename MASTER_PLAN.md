# MASTER PLAN – White Caves
**Last Updated:** 2026-04-10  
**Progress:** █████████▓ 95% (Phase 0–0.8 done; Phase 1 CRM features complete)  
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
- **Phase 1 – CRM Features (April 2026):**
  - **Prisma schema:** Added `Client`, `Notification`, `Favorite` models with indexes
  - **Backend routes:** `clients.ts` (CRUD + stats + communications), `notifications.ts` (list, unread-count, mark-read, read-all, delete), `favorites.ts` (list, add, remove, check), `users.ts` (list, stats, role change, status change, RBAC)
  - **Frontend API service:** `src/services/crmService.ts` — 30 API functions (commissions, transactions, clients, notifications, favorites, users, reporting)
  - **Redux thunks:** 16 new async thunks for commissions, transactions, clients, favorites, notifications + state fields + selectors
  - **CRM pages:** CommissionTrackingPage, TransactionManagementPage, ClientManagementPage, ReportingDashboardPage, UserManagementPage, FavoritesPage, NotificationsPage — each with dedicated custom hooks
  - **App routing:** All new pages wired with lazy loading, ProtectedRoute, error boundaries
  - **Build:** Passes with zero errors, all pages code-split

---

## In Progress / Pending

### Phase 1 (90%)

- [x] 1a. Rename WhatsApp assistant → Nadia
- [x] SEO & a11y (meta/OG/JSON-LD, form labels, aria, dynamic titles)
- [x] Bundle optimization (lazy-loading, code-splitting, inline skeleton)
- [x] 5. RBAC: middleware, frontend conditional render, data segmentation, public favorites
- [x] CRM: Lead management (create, assign, update status, track interactions)
- [x] CRM: Property management (add/edit/delete listings, assign to agents, track status)
- [x] CRM: Client/owner management (CRUD, link to properties, communication log)
- [x] CRM: Commission tracking (calculate, approve, pay out)
- [x] CRM: Transaction recording (sales/rentals, link property, buyer, seller, agent)
- [x] CRM: Reporting & analytics (dashboard charts, export CSV/JSON)
- [x] CRM: AI assistants integration (markdown plans, CRUD via admin panel)
- [x] CRM: User & role management (RBAC: MD, agent, landlord, tenant)
- [x] CRM: Favorites for public users
- [x] CRM: Notifications (in-app notification center)
- [ ] 1. WhatsApp recovery: LocalAuth, auto-reconnect, heartbeat
- [ ] 2. E2E testing: Vitest coverage >50%, Playwright critical flows, test factories
- [ ] 3. Features: file uploads (Multer + S3/local)
- [ ] 4. Bugs: webhook timeout (async), WhatsApp dedup
- [ ] 6. Design polish: full Phase 0.6 compliance audit
- [ ] 7. Code quality: Storybook, Swagger/OpenAPI, pre-commit hooks finalized
- [ ] 8. Docs: README update, API docs, ADRs
- [ ] 9. Deployment: Vercel env vars verified, rollback plan documented

---

## Progress Bar

```
[█████████▓] 95%
 Phase0 ████  Phase0.2 ████  Phase0.5 ████  Phase0.75 ████
 Phase0.6 ███▓  Phase0.8 ████  Phase1 ████▓
```

---

## Strict Policies Checklist (merge to main)

- [x] Build passes (`npm run build`)
- [ ] Tests pass (`npm run test:run`)
- [ ] No `any`, TypeScript strict mode
- [x] Error boundaries + API error handling on all routes
- [x] MongoDB/Prisma validated and indexed
- [x] RBAC active (middleware + frontend guards)
- [x] Design tokens used, unified sidebar + top navbar
- [ ] WCAG 2.1 AA, Lighthouse > 90
- [ ] No half-features (every feature end-to-end, tested, accessible)
- [ ] ADR written for every significant architectural decision

---

## Reference

- `/business_docs/` — business requirements, AI assistant profiles, design system, roles
- `/docs/adr/` — Architecture Decision Records
- `/plans/` — full historical plan archive and session summaries
