# PENDING TASKS ONLY (White Caves Architecture Master Backlog)

## 1. Interface & Feature Standardization (FE_STANDARD & INTERFACE)
- [ ] Ensure all Frontend components follow the Co-Located Feature Directories pattern (`View .tsx`, `Logic .logic.ts`, `Style .style.ts`).
- [ ] Enforce Zero Hardcoded Strings policy (extract all into `src/locales/en.json` and `ar.json`).
- [ ] Configure `TopNavbar` with layout properties: `fixed top-0 left-0 w-full h-16 z-1000 bg-white border-b-2 border-red-500`.
- [ ] Configure `UnifiedSidebar` with layout properties: `fixed top-16 left-0 h-[calc(100vh-64px)] w-[280px] z-900 bg-white border-r`.
- [ ] Configure `MainCanvas` with layout properties: `margin-top:64px; margin-left:280px; padding:24px; bg-white text-slate`.
- [ ] Setup Floating Widgets: 
  - `caves_floating_search`: `fixed bottom-6 left-6 z-2000 bg-white border-red-500 glassmorphic pill`.
  - `whatsapp_floating`: `fixed bottom-6 right-6 z-2000 corporate red/white contact marker token`.
- [ ] Refactor `src/components/home/HeroSection` into the 3-Folder isolation pattern.

## 2. UI/UX Rules (UIUX_RULE)
- [ ] Enforce Dynamic Event-Driven UI Interactivity (every click must update state, fire modals, and trigger animations).
- [ ] Ensure Zero Layout Shifts & White Flashes via JSON memory caching before REST API mounts.
- [ ] Ensure all micro-interactions and transitions are 0.25s hardware-accelerated ease-in-out.
- [ ] **AEGIS 2.0 Color Lockdown**: ONLY White Caves Red (#EF4444), Brilliant Crisp White (#FFFFFF), and Deep Slate Gray (#1E293B). FORBIDDEN: Emerald Green, Metallic Gold, Obsidian Dark.
- [ ] **The Absolute Sidebar Merger**: DELETE `SidebarV1.tsx`, `AdminNav`, `ExecutiveCockpit.tsx`. Consolidate into ONE `src/layouts/UnifiedWorkspaceLayout.tsx` with a Level 5 `[Managing Director Hub]`.
- [ ] **Founder Landing Short-Circuit**: If email matches `arslanmalikgoraha@gmail.com`, force-inject `accessLevel: 5`. Bypass token checks, land on Profile Page unmasking the 12-department navigation layout.

## 3. MD Credentials Alerting System (MD_CREDENTIAL)
- [ ] Configure Alert logic for DET License (No. 1388443) expiry warning triggers (90-day: 01-05-2026, 30-day: 30-06-2026).
- [ ] Configure Alert logic for RERA ORN (No. 44483) expiry warning triggers.
- [ ] Configure Alert logic for HQ Ejari (No. 0120250814005322) expiry warning triggers.
- [ ] Configure Alert logic for ICP Card (No. 2/1/1192499) expiry warning triggers.

## 4. Seeding & Mock Data Generation (SEEDING)
- [ ] Generate local JSON cache `properties_portfolio` (100 high-fidelity Dubai items, DAMAC Hills 2 focus).
- [ ] Generate local JSON cache `personnel_directory` (100 dummy employee profiles divided into 12 Managers and 108 Supervisors).
- [ ] Generate local JSON cache `currency_cache` (UAE / USA / ARG scaling framework on 4-hour local TTL).

## 5. Pipeline Sync Stages (PIPELINE)
- [ ] `1_APPEND_PLAN`: (Completed) Log multi-turn chat requirements updates to plans/PENDING_TASKS_ONLY.md.
- [ ] `2_ISOLATE_FILE`: Divide features folder-by-folder across matching /logic/ and /styles/ subfolders.
- [ ] `3_EXTRACT_TEXT`: Strip all copywriting parameters out of views files and move into local i18n JSON files.
- [ ] `4_TERMINAL_CHECK`: Execute free local compilation gates via `npm run build`.
- [ ] `5_HOT_RELOAD`: Verify stability using nodemon server configuration loops with zero runtime log exceptions.
- [ ] `6_REMOTE_RELEASE`: Run git pull origin main rebase -> git merge develop -> git push origin main to fire Vercel hooks.

## 6. Duplication Purge (Epic 6)
- [ ] Delete `src/components/navigation/SidebarV1.tsx`
- [ ] Delete `src/components/navigation/AdminNav.tsx`
- [ ] Delete `src/components/dashboard/ExecutiveCockpit.tsx`
- [ ] Delete `src/components/dashboard/HenrySidebar.tsx`
- [ ] Delete `src/components/home/HeroSearch.tsx`
- [ ] Delete `src/components/home/NavbarSearch.tsx`
- [ ] Delete `src/components/shared/PropertyGrid.tsx`
- [ ] Delete `src/components/shared/PropertyTable.tsx`
- [ ] Delete `src/components/shared/Calculators.tsx`
- [ ] Delete `src/components/shared/FinanceWidget.tsx`
- [ ] Delete `src/components/shared/AlertBanner.tsx`
- [ ] Delete `src/components/shared/NotificationToast.tsx`
- [ ] Purge 18 local CSS sheets in `src/components/home/styles/`
- [ ] Extract raw text from `src/pages/crm/` to `en.json`
