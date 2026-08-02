# CRM Reorganization Master Plan (May 2026)

## 1) Executive Summary

This plan consolidates the CRM UI architecture into one canonical implementation and removes duplicate navbar/sidebar/dashboard paths that are still present in the codebase.

### Objectives

1. **Fix CRM design consistency** across dashboard and role pages.
2. **Remove duplicate implementations** for sidebar/navbar/layout systems.
3. **Stabilize navigation chrome** (TopBar + UnifiedSidebar) for all CRM users.
4. **Reorganize CRM project structure** with clear canonical vs legacy boundaries.
5. **Reduce maintenance overhead** by retiring parallel implementations.

---

## 2) Current-State Audit (What is duplicated)

## 2.1 Navbar duplication

- `src/components/layout/TopBar/TopBar.tsx` (**canonical target**)
- `src/components/layout/MainNavBar/MainNavBar.tsx` (legacy)
- `src/components/UnifiedNavbar/UnifiedNavbar.tsx` (legacy)
- `src/components/layout/PublicNavbar/PublicNavbar.tsx` (public-site only, not CRM)
- `src/components/portal/PortalNavbar.tsx` (portal-only, not CRM)

## 2.2 Sidebar duplication

- `src/components/layout/UnifiedSidebar/UnifiedSidebar.tsx` (**canonical target**)
- `src/components/sidebars/EnhancedLeftSidebar/EnhancedLeftSidebar.tsx` (legacy compatible)
- `src/components/sidebars/EnhancedRightSidebar/EnhancedRightSidebar.tsx` (legacy compatible)
- `src/components/sidebars/CompanyDepartmentSidebar/CompanyDepartmentSidebar.tsx` (legacy)
- `src/components/sidebars/AIAssistantsSidebar/AIAssistantsSidebar.tsx` (legacy)
- `src/components/layout/DashboardLayout/DashboardLayout.tsx` and `DualSidebarLayout.tsx` (legacy routing shell)

## 2.3 State duplication

- `src/store/slices/sidebarSlice.ts` (**canonical target**)
- `src/store/slices/sidebarUISlice.ts` (legacy)
- `src/redux/slices/relationalSidebarSlice.js` (legacy)

---

## 3) Target CRM Architecture (Canonical)

### 3.1 Shell

- `AppLayout` = canonical CRM shell
- `TopBar` = canonical navbar
- `UnifiedSidebar` = canonical sidebar
- `UnifiedDashboardPage` = canonical CRM content host

### 3.2 Route model

- `/dashboard` always renders:
  - `AppLayout`
  - `UnifiedDashboardPage`
- Role routes redirect to `/dashboard` or dedicated portals where applicable.

### 3.3 State model

- Sidebar state only from `store/slices/sidebarSlice.ts`
- Legacy sidebar slices are read-only compatibility layer during migration.

---

## 4) Migration Waves

## Wave A — Immediate (Completed in this session)

1. Updated TopBar user binding to support both `auth.user` and `user.currentUser`.
2. Converted `DualSidebarLayout` into a **compatibility wrapper** that reuses canonical shell.
3. Updated sidebar barrel exports to explicitly expose canonical sidebars first.

## Wave B — Cleanup (Next)

1. Replace legacy imports in any remaining feature pages with canonical components.
2. Remove dead references to `CompanyDepartmentSidebar` and `AIAssistantsSidebar` from runtime routes.
3. Add deprecation notices to legacy sidebar components.

## Wave C — State Convergence

1. Remove runtime dependency on `sidebarUISlice` and `relationalSidebarSlice`.
2. Migrate selectors/hooks to `sidebarSlice` only.
3. Delete obsolete reducers after tests pass.

## Wave D — Final Deletion

1. Remove deprecated navbar/sidebar components.
2. Remove obsolete tests tied to deleted components.
3. Finalize architecture docs and enforce import lint rules.

---

## 5) File-Level Reorganization Matrix

| Area            | Keep (Canonical)                                      | Deprecate / Remove                                                                            |
| --------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| CRM Layout      | `components/layout/AppLayout.tsx`                     | `components/layout/DashboardLayout/DashboardLayout.tsx`                                       |
| Navbar          | `components/layout/TopBar/TopBar.tsx`                 | `components/layout/MainNavBar/MainNavBar.tsx`, `components/UnifiedNavbar/UnifiedNavbar.tsx`   |
| Sidebar         | `components/layout/UnifiedSidebar/UnifiedSidebar.tsx` | `components/sidebars/CompanyDepartmentSidebar/*`, `components/sidebars/AIAssistantsSidebar/*` |
| Dashboard Entry | `pages/UnifiedDashboardPage.tsx`                      | `pages/DashboardPage.jsx` (keep only compatibility wrapper usage)                             |
| State           | `store/slices/sidebarSlice.ts`                        | `store/slices/sidebarUISlice.ts`, `redux/slices/relationalSidebarSlice.js`                    |

---

## 6) Acceptance Criteria

1. All CRM routes render with one consistent top navigation and sidebar system.
2. No active route depends on deprecated `CompanyDepartmentSidebar` or `AIAssistantsSidebar`.
3. TopBar user identity works for both legacy and current store hydration paths.
4. Build passes and targeted dashboard tests pass.
5. Documentation clearly lists canonical paths and deprecated paths.

---

## 7) Test Strategy

### Unit

- `TopBar.test.tsx`
- `AppLayout.test.tsx`
- `UnifiedDashboardPage.test.tsx`

### Integration

- `/dashboard` render smoke test with authenticated user
- Sidebar selection updates dashboard content
- Breadcrumb rendering with role and department changes

### E2E

- Login -> `/dashboard` -> navbar visible -> sidebar interaction -> module rendering

---

## 8) Risks and Mitigations

1. **Risk:** Legacy pages rely on old sidebar props contracts.
   - **Mitigation:** Keep compatibility wrappers until all imports are migrated.

2. **Risk:** Redux slice mismatch causes stale UI state.
   - **Mitigation:** Transition selectors first; delete legacy slices only after green tests.

3. **Risk:** Visual regressions in responsive breakpoints.
   - **Mitigation:** Add screenshot checkpoints for 375/768/1024/1440 widths.

---

## 9) Execution Backlog (Actionable)

1. Migrate remaining `DashboardLayout/*` references to canonical shell.
2. Add `@deprecated` banners to legacy sidebar/navbar files.
3. Create lint rule to block new imports from deprecated paths.
4. Remove `redux/slices/relationalSidebarSlice.js` from active store dependencies.
5. Run full CRM nav/sidebar regression test suite.

---

## 10) Definition of Done

- Canonical CRM shell is the only active implementation in runtime routes.
- Legacy paths are compatibility-only or deleted.
- Tests are green on CRM navigation and sidebar workflows.
- Plan index and roadmap link to this master plan.
