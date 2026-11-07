# PHASE 7: EXECUTION CHECKLIST

**Date:** July 6, 2026  
**Format:** Day-by-Day Implementation Checklist  
**Duration:** 21 calendar days (3 weeks)  
**Status:** 🟢 READY FOR EXECUTION

---

## 📋 QUICK REFERENCE

| Week  | Focus             | Days  | Hours | Status   |
| ----- | ----------------- | ----- | ----- | -------- |
| **1** | Dashboard         | 1-5   | 23h   | 📋 Ready |
| **2** | Security & Collab | 6-10  | 26h   | 📋 Ready |
| **3** | AI & Deploy       | 11-15 | 20h   | 📋 Ready |

**Total:** 69 hours of focused work → 95%+ production ready

---

## 🚀 WEEK 1: DASHBOARD-FIRST (Days 1-5)

### 📅 DAY 1: WEBSOCKET INFRASTRUCTURE (4 hours)

**Goal:** Real-time KPI service running, Redux connected, hook working

**Tasks:**

- [ ] Copy Chunk 1 → `server/websocket/realtimeService.ts` (350 lines)
- [ ] Copy Chunk 2 → `src/store/slices/analyticsSlice.tsx` (80 lines)
- [ ] Copy Chunk 3 → `src/hooks/useRealTimeKPIs.ts` (120 lines)
- [ ] Update `server/index.ts`: initialize realtimeService
- [ ] Test: `npm run typecheck` (0 errors)
- [ ] Test: `npm run build` (<30s)
- [ ] Test: `npm run test:run:unit -- analytics.spec.ts`
- [ ] **Git Commit:** `git commit -m "feat(week1-day1): WebSocket infrastructure for real-time KPIs"`

**Success Criteria:**

- ✅ WebSocket server listening on port 5001
- ✅ Redux analytics slice dispatching KPIs
- ✅ Hook connects client to WebSocket
- ✅ 0 TypeScript errors
- ✅ Unit tests passing

**Time:** 4 hours

---

### 📅 DAY 2: DASHBOARD CHARTS (6 hours)

**Goal:** 5 advanced charts rendering, KPI tiles displaying, dashboard layout ready

**Tasks:**

- [ ] Create `src/components/dashboard/charts/FunnelChart.tsx` (80 lines)
- [ ] Create `src/components/dashboard/charts/HeatmapChart.tsx` (90 lines)
- [ ] Create `src/components/dashboard/charts/SankeyChart.tsx` (100 lines)
- [ ] Create `src/components/dashboard/charts/TimelineChart.tsx` (95 lines)
- [ ] Create `src/components/dashboard/charts/GaugeChart.tsx` (85 lines)
- [ ] Copy Chunk 4 → `src/components/dashboard/KPITile.tsx` (250 lines)
- [ ] Create `src/components/dashboard/DashboardConfigurator.tsx` (150 lines)
- [ ] Test: `npm run test:e2e:local -- dashboard.spec.ts`
- [ ] **Git Commit:** `git commit -m "feat(week1-day2): Advanced dashboard charts library"`

**Success Criteria:**

- ✅ All 5 charts render without errors
- ✅ KPI tiles display real-time values
- ✅ Chart library fully typed (TypeScript)
- ✅ Responsive to props changes
- ✅ E2E tests passing

**Time:** 6 hours

---

### 📅 DAY 3: MOBILE RESPONSIVE (4 hours)

**Goal:** Dashboard works perfectly on 375px to 1920px viewports

**Tasks:**

- [ ] Update `src/components/dashboard/DashboardLayout.tsx`: add Tailwind breakpoints
- [ ] Update all chart components: responsive containers
- [ ] Update KPI tile: responsive padding/font sizes
- [ ] Test at 375px (mobile), 768px (tablet), 1024px (small desktop), 1440px (desktop)
- [ ] Fix any layout shifting issues
- [ ] Verify touch interactions work
- [ ] **Git Commit:** `git commit -m "feat(week1-day3): Mobile-first responsive dashboard (375px+)"`

**Success Criteria:**

- ✅ 375px: single column, readable text
- ✅ 768px: 2-column layout
- ✅ 1024px: 3-column layout
- ✅ 1440px: full 4-column layout
- ✅ No horizontal scrolling

**Time:** 4 hours

---

### 📅 DAY 4: ROLE-BASED CONFIGS (4 hours)

**Goal:** Owner/Agent/Manager/Admin see different dashboards

**Tasks:**

- [ ] Create `src/config/dashboardConfigs.ts` (150 lines)
  - Define 4 role configs with different widgets
  - Owner: full metrics, AI insights
  - Agent: leads, properties, commission
  - Manager: team performance, revenue
  - Admin: system health, user counts
- [ ] Create API endpoint: `GET /api/dashboard/config` (30 lines)
- [ ] Create API endpoint: `GET /api/dashboard/preferences` (30 lines)
- [ ] Add to `prisma/schema.prisma`: UserDashboardPreference model
- [ ] Test: `npm run test:run:unit -- dashboard-config.spec.ts`
- [ ] **Git Commit:** `git commit -m "feat(week1-day4): Role-based dashboard configurations"`

**Success Criteria:**

- ✅ Role config loading correctly
- ✅ User preference saving
- ✅ Dashboard updates on role change
- ✅ All 4 roles tested
- ✅ API endpoints documented

**Time:** 4 hours

---

### 📅 DAY 5: PERFORMANCE & TESTING (5 hours)

**Goal:** Dashboard loads in <2 seconds, Lighthouse >90, all tests passing

**Tasks:**

- [ ] Code-split chart components (React.lazy + Suspense)
- [ ] Code-split analytics page
- [ ] Lazy-load chart data on render
- [ ] Run: `npm run build` (should be <30s)
- [ ] Run: `npm run test:run:unit` (>90% pass)
- [ ] Run: `npm run test:e2e:local` (all dashboard tests)
- [ ] Run Lighthouse audit: `npm run test:lighthouse`
  - Target: >90 on all metrics
  - FCP: <1.5s
  - LCP: <2.5s
  - CLS: <0.1
- [ ] Fix any performance issues
- [ ] **Git Commit:** `git commit -m "feat(week1-day5): Dashboard performance optimization & comprehensive testing"`

**Success Criteria:**

- ✅ Build time <30s
- ✅ First load <2s
- ✅ Lighthouse score >90
- ✅ All unit tests passing
- ✅ All E2E tests passing

**Time:** 5 hours

---

## 🔐 WEEK 2: SECURITY & COLLABORATION (Days 6-10)

### 📅 DAYS 6-7: REMEMBER ME LOGIN (8 hours)

**Goal:** Users can stay logged in for 30 days

**Tasks:**

- [ ] Copy Chunk 5 → `server/routes/auth.ts` - Add Remember Me logic
- [ ] Add to login form: checkbox "Remember me for 30 days"
- [ ] Update Prisma: RefreshToken model with expiresAt
- [ ] Implement token refresh endpoint: `POST /api/auth/refresh`
- [ ] Update axios interceptor to call refresh on 401
- [ ] Store refreshToken in httpOnly cookie
- [ ] Test: Login without remember me → logout on 1 day
- [ ] Test: Login with remember me → stay logged in 30 days
- [ ] **Git Commit:** `git commit -m "feat(week2-day6): Remember Me 30-day persistent login with token refresh"`

**Success Criteria:**

- ✅ Token expiry: 1 day without remember me
- ✅ Token expiry: 30 days with remember me
- ✅ Refresh token in httpOnly cookie
- ✅ Auto-refresh working on 401
- ✅ Activity logs recording login time
- ✅ E2E tests passing for both flows

**Time:** 8 hours

---

### 📅 DAY 8: 2FA SETUP (8 hours)

**Goal:** Users can enable TOTP 2FA with backup codes

**Tasks:**

- [ ] Copy Chunk 6 → `server/routes/2fa.ts` endpoints
- [ ] Create `POST /api/auth/2fa/setup` - generates QR code
- [ ] Create `POST /api/auth/2fa/verify` - verifies TOTP code
- [ ] Create `POST /api/auth/2fa/disable` - disables 2FA
- [ ] Add Prisma models: TemporaryTwoFA, backup codes storage
- [ ] Generate QR codes using `qrcode` package
- [ ] Generate 10 backup codes on setup
- [ ] Show backup codes once during setup
- [ ] Add 2FA verification UI component
- [ ] Test: Full 2FA setup flow
- [ ] Test: TOTP verification with authenticator app
- [ ] Test: Backup code usage
- [ ] **Git Commit:** `git commit -m "feat(week2-day8): 2FA authentication with TOTP & 10 backup codes"`

**Success Criteria:**

- ✅ QR code displays correctly
- ✅ TOTP verification works (±30s window)
- ✅ Backup codes work for verification
- ✅ One-time use enforced
- ✅ 2FA persists after login
- ✅ UI is user-friendly
- ✅ All E2E tests passing

**Time:** 8 hours

---

### 📅 DAY 9: REAL-TIME COMMENTS & PRESENCE (8 hours)

**Goal:** Team can comment on deals/properties in real-time, see who's viewing what

**Tasks:**

- [ ] Copy Chunk 7 → `src/components/EntityComments.tsx` (200 lines)
- [ ] Create `server/routes/comments.ts` - CRUD endpoints
- [ ] Create `GET /api/comments?entityId=X&entityType=Y`
- [ ] Create `POST /api/comments` - add comment
- [ ] Create `PUT /api/comments/:id` - edit comment
- [ ] Create `DELETE /api/comments/:id` - delete comment
- [ ] Add Prisma model: Comment with entityId, entityType, userId, text, createdAt
- [ ] Add WebSocket events: comment:new, comment:updated, comment:deleted
- [ ] Integrate EntityComments into deal/property pages
- [ ] Add presence WebSocket events: user:viewing, user:stopped-viewing
- [ ] Create presence indicator component
- [ ] Test: Multiple users commenting in real-time
- [ ] Test: Comment edits broadcast to all users
- [ ] Test: Presence indicators update instantly
- [ ] **Git Commit:** `git commit -m "feat(week2-day9): Real-time comment threading & user presence indicators"`

**Success Criteria:**

- ✅ Comments broadcast instantly
- ✅ Edits broadcast instantly
- ✅ Deletions broadcast instantly
- ✅ Presence shows "User X is viewing Property Y"
- ✅ Presence clears on disconnect
- ✅ Comments persist in database
- ✅ All WebSocket events working
- ✅ E2E tests for all flows

**Time:** 8 hours

---

### 📅 DAY 10: WEEK 2 TESTING & POLISH (2 hours)

**Goal:** Week 2 deliverables fully tested and production-ready

**Tasks:**

- [ ] Run full unit test suite: `npm run test:run:unit`
- [ ] Run full E2E test suite: `npm run test:e2e:local`
- [ ] Fix any remaining TypeScript errors: `npm run typecheck`
- [ ] Performance check: Dashboard load <2s
- [ ] Accessibility audit: WCAG 2.1 AA compliance
- [ ] **Git Commit:** `git commit -m "chore(week2): Final testing & polish for security & collaboration"`

**Success Criteria:**

- ✅ All unit tests passing (>90%)
- ✅ All E2E tests passing
- ✅ 0 TypeScript errors
- ✅ 0 accessibility violations
- ✅ Performance maintained

**Time:** 2 hours

---

## 🤖 WEEK 3: AI & DEPLOYMENT (Days 11-15)

### 📅 DAY 12: NADIA AI INSIGHTS (6 hours)

**Goal:** Nadia lead scoring insights displayed on dashboard

**Tasks:**

- [ ] Create `src/components/dashboard/NadiaInsightsWidget.tsx` (150 lines)
- [ ] Pull lead scoring data from Nadia service
- [ ] Display: conversion probability per lead
- [ ] Display: recommended next steps (call, email, meeting)
- [ ] Display: risk score (churn probability)
- [ ] Add to dashboard: Nadia widget for managers/owners
- [ ] Test: Widget renders with mock data
- [ ] Test: Click lead → navigate to lead details
- [ ] **Git Commit:** `git commit -m "feat(week3-day12): Nadia AI lead scoring insights widget"`

**Success Criteria:**

- ✅ Widget renders correctly
- ✅ Data updates in real-time (via WebSocket)
- ✅ Probability scores display clearly
- ✅ Recommended actions are clear
- ✅ Clickable lead navigation works
- ✅ E2E tests passing

**Time:** 6 hours

---

### 📅 DAY 13: LINDA AI INSIGHTS (6 hours)

**Goal:** Linda property market intelligence displayed

**Tasks:**

- [ ] Create `src/components/dashboard/LindaInsightsWidget.tsx` (150 lines)
- [ ] Pull property market data from Linda service
- [ ] Display: comparable properties (similar area/size/price)
- [ ] Display: market trend (↑ ↓ →)
- [ ] Display: estimated market value
- [ ] Display: recommended listing price
- [ ] Add to dashboard: Linda widget for agents/owners
- [ ] Test: Widget renders with mock data
- [ ] Test: Click comparable property → navigate to property
- [ ] **Git Commit:** `git commit -m "feat(week3-day13): Linda AI property market insights widget"`

**Success Criteria:**

- ✅ Widget renders correctly
- ✅ Comparable properties display
- ✅ Market trends clear
- ✅ Price recommendations reasonable
- ✅ Clickable navigation works
- ✅ E2E tests passing

**Time:** 6 hours

---

### 📅 DAY 14: ROOT CLEANUP (4 hours)

**Goal:** Clean folder structure, remove 350+ junk files

**Execute CLEANUP_AND_DEDUPLICATION_PLAN.md:**

- [ ] **Phase 1 (5 min):** Delete junk files
- [ ] **Phase 2 (10 min):** Create archive structure
- [ ] **Phase 3 (20 min):** Move Phase 1-7 docs (25 files)
- [ ] **Phase 4 (15 min):** Move 84 session iterations
- [ ] **Phase 5 (15 min):** Consolidate duplicates
- [ ] **Phase 6 (10 min):** Move legacy test files
- [ ] **Phase 7 (5 min):** Organize env backups
- [ ] **Verify:** 600 files → 250 files (60% reduction)
- [ ] **Git Commit:** `git commit -m "chore: Complete root folder cleanup & documentation reorganization (600→250 files)"`

**Success Criteria:**

- ✅ Root: 70+ files → <10 files
- ✅ `/plans`: 150+ files organized
- ✅ `/archives`: 200+ files archived
- ✅ `/sessions`: 84 iterations archived
- ✅ No breaking changes to code

**Time:** 4 hours (1.5 hours actual cleanup + 2.5 hours verification)

---

### 📅 DAY 15: PRODUCTION DEPLOYMENT (4 hours)

**Goal:** Phase 7 deployed to production, 95%+ ready achieved

**Tasks:**

- [ ] Run full build: `npm run build` (should be <30s)
- [ ] Verify build output: `dist/` folder created
- [ ] Run full unit tests: `npm run test:run:unit`
- [ ] Run full E2E tests: `npm run test:e2e:local`
- [ ] Run TypeScript check: `npm run typecheck` (0 errors)
- [ ] Deploy to staging environment
- [ ] 24-hour monitoring (check error logs, performance)
- [ ] If all green → Deploy to production
- [ ] Post-deployment verification:
  - [ ] Dashboard loads <2s
  - [ ] WebSocket connects
  - [ ] Comments working in real-time
  - [ ] 2FA setup available
  - [ ] Remember Me working
  - [ ] Nadia/Linda insights visible
- [ ] **Git Commit:** `git commit -m "chore: Phase 7 complete - Production deployment (82%→95% production ready)"`
- [ ] **Git Tag:** `git tag -a v1.0.0-phase7 -m "Phase 7 complete: Dashboard-First Sprint"`
- [ ] **Git Push:** `git push origin feature/phase7-dashboard-first-sprint && git push origin v1.0.0-phase7`

**Success Criteria:**

- ✅ Build successful (<30s)
- ✅ All tests passing (>90%)
- ✅ 0 TypeScript errors
- ✅ Staging monitoring 24h (0 critical errors)
- ✅ Production deployment successful
- ✅ Post-deployment verification complete
- ✅ Project at 95%+ production ready

**Time:** 4 hours

---

## 📊 CUMULATIVE PROGRESS

| Phase       | Days  | Hours | Cumulative | Status   |
| ----------- | ----- | ----- | ---------- | -------- |
| Dashboard   | 1-5   | 23h   | 23h        | 📋 Ready |
| Security    | 6-10  | 26h   | 49h        | 📋 Ready |
| AI & Deploy | 11-15 | 20h   | 69h        | 📋 Ready |

**Total:** 69 hours → **95%+ production ready** ✅

---

## 🎯 FINAL METRICS (End of Phase 7)

| Metric                | Target      | Status    |
| --------------------- | ----------- | --------- |
| **Production Ready**  | 95%+        | 🎯 Target |
| **Dashboard Load**    | <2s         | 🎯 Target |
| **TypeScript Errors** | 0           | 🎯 Target |
| **Test Coverage**     | >90%        | 🎯 Target |
| **Lighthouse Score**  | >90         | 🎯 Target |
| **Code Quality**      | 88+/100     | 🎯 Target |
| **Accessibility**     | WCAG 2.1 AA | 🎯 Target |
| **Folder Files**      | <250        | 🎯 Target |

---

## 💾 GIT COMMITS (SUMMARY)

```bash
# Week 1: Dashboard
git commit -m "feat(week1-day1): WebSocket infrastructure for real-time KPIs"
git commit -m "feat(week1-day2): Advanced dashboard charts library (5 chart types)"
git commit -m "feat(week1-day3): Mobile-first responsive dashboard (375px-1920px)"
git commit -m "feat(week1-day4): Role-based dashboard configurations (owner/agent/manager/admin)"
git commit -m "feat(week1-day5): Dashboard performance optimization & comprehensive testing"

# Week 2: Security & Collaboration
git commit -m "feat(week2-day6): Remember Me 30-day persistent login with token refresh"
git commit -m "feat(week2-day8): 2FA authentication with TOTP & 10 backup codes"
git commit -m "feat(week2-day9): Real-time comment threading & user presence indicators"
git commit -m "chore(week2): Final testing & polish for security & collaboration"

# Week 3: AI & Deployment
git commit -m "feat(week3-day12): Nadia AI lead scoring insights widget"
git commit -m "feat(week3-day13): Linda AI property market insights widget"
git commit -m "chore: Complete root folder cleanup & documentation reorganization"
git commit -m "chore: Phase 7 complete - Production deployment (82%→95% production ready)"

# Final tag
git tag -a v1.0.0-phase7 -m "Phase 7 complete: Dashboard-First Sprint"
```

---

## ✅ CHECKLIST FOR GO/NO-GO DECISION

**Before Day 1 Start:**

- [ ] Read entire PHASE_7_EXECUTION_CHECKLIST.md
- [ ] Verify code chunks copied correctly
- [ ] Have DevTools (Chrome, VS Code) ready
- [ ] Have planning documents accessible
- [ ] Git branch created: `feature/phase7-dashboard-first-sprint`

**After Day 5 (Week 1 Complete):**

- [ ] Dashboard loads <2s ✅
- [ ] All 5 charts render ✅
- [ ] Mobile responsive ✅
- [ ] All tests passing ✅
- [ ] GO → Proceed to Week 2

**After Day 10 (Week 2 Complete):**

- [ ] Remember Me working ✅
- [ ] 2FA fully functional ✅
- [ ] Real-time comments working ✅
- [ ] Presence indicators working ✅
- [ ] All tests passing ✅
- [ ] GO → Proceed to Week 3

**After Day 15 (Phase 7 Complete):**

- [ ] Nadia insights visible ✅
- [ ] Linda insights visible ✅
- [ ] Root cleanup complete ✅
- [ ] Production deployment successful ✅
- [ ] Project at 95%+ production ready ✅
- [ ] All commitments met ✅

---

**Status:** ✅ READY FOR EXECUTION  
**Start Date:** Monday, July 7, 2026 - 9:00 AM  
**Target Completion:** Friday, July 26, 2026  
**Owner:** @Ada (Architecture) + Development Team  
**Next Phase:** Phase 8 (Performance & RERA Compliance, 8 weeks)
