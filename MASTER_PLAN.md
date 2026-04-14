# MASTER_PLAN.md — White Caves Real Estate Platform

> **Mission**: Build the #1 Dubai real estate platform  
> **Last Updated**: April 14, 2026  
> **Branch**: `development`  
> **Target**: 500% platform improvement across UX, features, performance, and market position

---

## Current State

| Metric | Value |
|--------|-------|
| **Frontend** | React 18, TypeScript 5 (strict), Redux Toolkit, 250+ components, 50+ routes |
| **Backend** | Express 5, Prisma 6.6, MongoDB, 121+ API endpoints, 15 models |
| **Auth** | JWT + bcrypt, 12-role RBAC (50+ permissions), Firebase sync |
| **Testing** | Vitest + Playwright, 285 test files, 7,163 tests passing |
| **Build** | Vite (8.64s clean build), 0 TypeScript errors |
| **Design** | Gold (#D4AF37) luxury theme, 14 design-system components, responsive tokens |
| **Layout** | Single sidebar (64px rail + 240px flyout) + 56px TopBar |
| **WhatsApp** | Nadia bot (Meta Business API + LocalAuth), NLP routing, conversation queue |
| **Deployment** | Docker multi-stage, Vercel, Nginx, Kubernetes manifests ready |

---

## Transformation Roadmap

### ✅ Phase 0 — Cleanup & Preparation
**Branch**: `feature/phase-0-cleanup` | **Status**: COMPLETE

- [x] Delete `/archives/` folder (82 obsolete session reports)
- [x] Delete `/bot/` folder (empty scaffolding)
- [x] Delete 64 obsolete plan files (sessions, completed phases, packages)
- [x] Keep 12 operational docs in `/plans/`
- [x] Create 5 new forward-looking plans (AI scoring, AR/VR, payments, i18n, SEO)
- [x] Archive valuable content to `/docs/ARCHIVED_IDEAS.md`
- [x] Remove freelancer code references
- [x] Rewrite MASTER_PLAN.md as transformation roadmap

### ⬜ Phase 0.2 — Business Docs & Market Research
**Branch**: `feature/phase-0.2-business-research` | **Effort**: ~6h

- [ ] Research Dubai RERA regulations, Ejari, TRN, escrow, agent licensing
- [ ] Competitor analysis: Property Finder, Bayut, Dubizzle, Houza, LuxuryProperty
- [ ] WhatsApp Business API best practices and compliance
- [ ] AI assistants for real estate: lead scoring, document generation, market analysis
- [ ] Multi-currency payment gateways (Stripe UAE, Checkout.com)
- [ ] MongoDB optimization: sharding, indexing, aggregation patterns
- [ ] Luxury design: 3D tours, AR/VR, i18n, WCAG AAA
- [ ] Security: OWASP, GDPR/PDPL, audit logging
- [ ] Deployment: Vercel Edge, AWS, CDN, caching
- [ ] Lead generation: SEO keywords, Google Ads, email campaigns
- [ ] Create `business_docs/08_market_research/competitor_analysis.md`
- [ ] Create `business_docs/08_market_research/technology_upgrades.md`
- [ ] Create new AI assistant docs (lead scoring bot, document generator, market analyst)
- [ ] Expand user roles matrix (compliance officer, marketing manager)
- [ ] Create design system AR/VR and i18n token specs
- [ ] Remove all freelancer references from business_docs

### ⬜ Phase 0.5 — Unify Duplicates & Consolidate
**Branch**: `feature/phase-0.5-consolidation` | **Effort**: ~8h

- [ ] Audit `components/common/` vs `components/ui/` vs `components/design-system/` for duplicates
- [ ] Merge into canonical design-system components
- [ ] Replace all hardcoded hex colors with design tokens
- [ ] Consolidate WhatsApp route files (linda.ts, meta-webhook.ts, stubs)
- [ ] Run depcheck for unused dependencies
- [ ] Delete dead code and unused files
- [ ] Create ADR: `/docs/adr/008-duplicate-consolidation.md`

### ⬜ Phase 0.6 — Complete Redesign (CRITICAL)
**Branch**: `feature/phase-0.6-redesign` | **Effort**: ~40h

**Design System**:
- [ ] Export design tokens as CSS custom properties
- [ ] Verify all 14 base components use tokens exclusively
- [ ] Build missing components (Table, SearchBar)
- [ ] WCAG AAA compliance audit with axe-core

**Public Website**:
- [ ] HomePage: hero with search bar, featured properties, market stats, testimonials
- [ ] PropertiesPage: dynamic Redux filters, grid/list toggle, map view, pagination
- [ ] PropertyDetailPage: image gallery, property map, agent info, save favorites, share
- [ ] TopBar: language toggle (en/ar), theme toggle

**CRM Layout**:
- [ ] Verify sidebar → Redux → content rendering pipeline works end-to-end
- [ ] Create DynamicContentRenderer for dept+service → component mapping
- [ ] Full responsive/mobile review (all breakpoints)

**Dummy Data**:
- [ ] Enhance Prisma seed with @faker-js/faker (50 properties, 20 agents, 100 leads)
- [ ] Create frontend mock data layer (for tests/Storybook)

**Performance**:
- [ ] Lighthouse score ≥ 90 on all pages (target 100)
- [ ] React.memo on heavy list items
- [ ] Image optimization (WebP, lazy loading)

### ⬜ Phase 0.8 — AI Assistant API
**Branch**: `feature/phase-0.8-ai-api` | **Effort**: ~6h

- [ ] `GET /api/assistants` — list all (from business_docs/03_ai_assistants/*.md)
- [ ] `GET /api/assistants/:id/plan` — serve markdown plan
- [ ] `POST/PUT/DELETE /api/assistants` — admin CRUD (owner/admin only)
- [ ] Path traversal prevention, XSS sanitization
- [ ] Frontend: AssistantDetailView component
- [ ] Unit tests + E2E tests

### ⬜ Phase 1 — Remaining Features & Hardening
**Branch**: `feature/phase-1-features` | **Effort**: ~30h

**1A: WhatsApp Recovery**
- [ ] LocalAuth session persistence + auto-reconnect
- [ ] Heartbeat monitoring (30s interval)
- [ ] Structured logging for connection state changes

**1B: E2E Testing Expansion**
- [ ] Playwright specs for login, dashboard, property CRUD, lead management
- [ ] Vitest coverage target >90% for services, >80% for components
- [ ] axe-core accessibility assertions in every Playwright test

**1C: Features**
- [ ] File uploads: Multer + local/S3 adapter (images, PDFs, 10MB limit)
- [ ] DB query optimization: run explain() on top queries, add missing indexes
- [ ] Rate limiting review (5 limiters already configured)

**1D: Bug Fixes**
- [ ] Webhook timeout: async handler, return 200 immediately
- [ ] WhatsApp message deduplication (idempotency key)

**1E: RBAC Enhancement**
- [ ] `usePermission()` hook for frontend conditional rendering
- [ ] Data segmentation: agents see only their own leads/properties
- [ ] Public favorites (localStorage + sync on login)

**1F: Code Quality**
- [ ] GitHub Actions CI: lint → test → build → deploy
- [ ] Expand openapi.json to cover all 121+ endpoints
- [ ] Storybook for design-system components

---

## Operational Documentation

Located in `/plans/`:

| Document | Purpose |
|----------|---------|
| `00_START_HERE.md` | Team onboarding guide |
| `INDEX.md` | Complete documentation index |
| `ARCHITECTURE.md` | Code structure, patterns, folder hierarchy |
| `TECHNICAL_REFERENCE.md` | Technical specs, standards, service architecture |
| `API_DOCUMENTATION.md` | REST API specs, endpoints, auth |
| `DEPLOYMENT_GUIDE.md` | Staging → production procedures |
| `PRODUCTION_DEPLOYMENT_RUNBOOK.md` | Step-by-step deployment |
| `EMERGENCY_RESPONSE_PROCEDURES.md` | Incident response playbooks |
| `MONITORING_AND_ALERTING_SETUP.md` | Monitoring, alerting, dashboards |
| `CICD_SETUP_DOCUMENTATION.md` | CI/CD pipeline guide |
| `CICD_QUICK_REFERENCE.md` | Quick CI/CD reference |
| `QUICK_ACCESS_GUIDE.md` | Common tasks quick reference |

## Future Plans

Located in `/plans/`:

| Plan | Priority | Effort |
|------|----------|--------|
| `ai_lead_scoring.md` | High | 20h |
| `payment_gateways.md` | High | 30h |
| `i18n_rtl.md` | High | 25h |
| `seo_strategy.md` | High | 15h |
| `ar_vr_tours.md` | Medium | 40h |

## Architecture Decisions

Located in `/docs/adr/`:

| ADR | Decision |
|-----|----------|
| 001 | Design system gold rebrand |
| 002 | RBAC role alias architecture |
| 003 | Prisma schema design |
| 004 | Sidebar dashboard layout |
| 005 | Redux slice architecture |
| 006 | Express error handling |
| 007 | Design token system |

---

## Quality Standards Checklist

Before marking any feature complete:

- [ ] No `any` TypeScript — strict mode enforced
- [ ] All API calls have try/catch with user-friendly error handling
- [ ] React error boundaries wrap major component trees
- [ ] MongoDB queries use indexes (no COLLSCAN in explain)
- [ ] RBAC middleware blocks unauthorized access
- [ ] Design tokens used everywhere (no hardcoded colors/fonts)
- [ ] Lighthouse score ≥ 90 on public and CRM pages
- [ ] WCAG AAA passes (axe, keyboard nav, ARIA)
- [ ] Tests >90% coverage (Vitest + Playwright)
- [ ] No half-implemented features (feature-flag if needed)
- [ ] ADR created for architectural changes

---

## Git Workflow

1. Always start from `development`: `git checkout development && git pull origin development`
2. Create feature branch: `git checkout -b feature/<description>`
3. Commit with clear messages, push branch
4. Create Pull Request targeting `development`
5. Never commit directly to `main` or `development`
