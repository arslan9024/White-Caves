# Flowchart: Universal Navigation Map — Role-Filtered Dashboard Routing

**Document Class:** FC-001 (Flowchart Specification)  
**Module:** Navigation Architecture — Top Nav → RBAC Dashboard Routing  
**Version:** 2026.07-FC-V1  
**Owner:** @Una (CSS Specialist) + @Tracy (Responsive Expert)  
**RUP Phase:** Elaboration Gate Document  
**Last Updated:** 2026-07-29  
**Status:** ✅ Active — Production Aligned

---

## 1. System Entry Point Map

Every session begins at the Login barrier. The Universal Top Nav Bar is the persistent anchor across all authenticated viewports.

```
═══════════════════════════════════════════════════════════════════════
                    WHITE CAVES — SESSION FLOW MASTER MAP
═══════════════════════════════════════════════════════════════════════

  [Browser URL: whitecaves.com]
           │
           ▼
  ┌────────────────────┐
  │   /login (Guest)   │  ◄── Unauthenticated users land here
  │   SignInPage.tsx   │
  └────────────────────┘
           │
           │  [Firebase Auth: Email / Google / 2FA]
           │
           ▼
  ┌────────────────────────────────────────────────────────────────┐
  │                    AUTH HYDRATION LAYER                        │
  │                                                                │
  │   1. Firebase UID extracted from JWT                           │
  │   2. User record fetched from MongoDB → /api/auth/me           │
  │   3. RBAC level loaded: accessLevel (1–5)                      │
  │   4. Founder check: arslanmalikgoraha@gmail.com                │
  │      └─ YES → force accessLevel = 5, bypass all gates          │
  │      └─ NO  → use DB-stored level                              │
  │   5. Redux store hydrated: authSlice + workspaceSlice          │
  │                                                                │
  └────────────────────────────────────────────────────────────────┘
           │
           ▼
  ┌────────────────────────────────────────────────────────────────┐
  │           UNIVERSAL AUTHENTICATED SHELL LAYOUT                 │
  │                 UnifiedWorkspaceLayout.tsx                     │
  │  ┌─────────────────────────────────────────────────────────┐   │
  │  │             FIXED TOP NAV BAR (100% width)              │   │
  │  │  [White Caves Logo] [Ctrl+K Search] [DLD Ticker]        │   │
  │  │  [Notifications Bell] [User Avatar] [Department Tabs]   │   │
  │  └─────────────────────────────────────────────────────────┘   │
  │  ┌──────────────┐  ┌───────────────────────────────────────┐   │
  │  │  FIXED LEFT  │  │         MAIN CONTENT AREA             │   │
  │  │  SIDEBAR     │  │         (GPU View Swapping)           │   │
  │  │  (280px)     │  │                                       │   │
  │  │              │  │   Renders one of:                     │   │
  │  │  Department  │  │   • Dashboard viewport                │   │
  │  │  Navigation  │  │   • Detail page                      │   │
  │  │  Nodes       │  │   • Module workspace                  │   │
  │  │              │  │                                       │   │
  │  └──────────────┘  └───────────────────────────────────────┘   │
  └────────────────────────────────────────────────────────────────┘
```

---

## 2. Top Nav Bar — Component Interaction Map

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TOP NAV BAR COMPONENT TREE                       │
│                    TopNavbar.tsx (fixed, z-index: 50)               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [Logo: White Caves ■]    ←──── src/components/shared/CavesLogo.tsx │
│                                                                     │
│  [Ctrl+K Global Search]   ←──── GlobalSearchModal.tsx              │
│    │                             Opens spotlight overlay            │
│    └─ Queries:                   useSearchItems(modules, workspaces) │
│        • Department tabs                                            │
│        • CRM modules (100 nodes)                                    │
│        • Recent records                                             │
│                                                                     │
│  [DLD Live Ticker]        ←──── DLDTickerBar.tsx                   │
│    └─ Data: /api/market/dld-feed (cached, 4hr TTL)                  │
│                                                                     │
│  [🔔 Notifications]       ←──── NotificationBell.tsx               │
│    └─ WebSocket: /ws/notifications                                  │
│    └─ Badge: unread count (Red #EF4444)                             │
│                                                                     │
│  [Avatar + Role Badge]    ←──── UserAvatarMenu.tsx                 │
│    └─ Shows: displayName, role, accessLevel badge                   │
│    └─ Menu: Profile / Settings / Logout                             │
│                                                                     │
│  [MD Impersonation]       ←──── ImpersonationBar.tsx               │
│    └─ ONLY visible if: accessLevel === 5                            │
│    └─ Allows: view-as any role (Level 1–4)                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. RBAC Dashboard Routing — The Five-Level Filter

```
═══════════════════════════════════════════════════════════════════════
             RBAC DASHBOARD ROUTER — 5-LEVEL ACCESS TREE
═══════════════════════════════════════════════════════════════════════

                    [accessLevel loaded from Redux]
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
       Level 5             Level 4           Level 3
   MANAGING DIRECTOR      DIRECTOR          SENIOR BROKER
          │                   │                   │
          ▼                   ▼                   ▼
  ExecutiveFlightDeck   DeptHeadView      SeniorBrokerView
       View.tsx            .tsx               .tsx
          │                   │                   │
          │  All 10 depts      │  Own dept +        │  Own leads +
          │  All data          │  team reports      │  team KPIs
          │  Impersonation     │  No impersonation  │
          │  MD alerts         │                   │
          │                   │                   │
          └───────────────────┤                   │
                              │                   │
                    ┌─────────┘                   │
                    │                             │
                    ▼                             ▼
                Level 2                       Level 1
              STD BROKER                      CLIENT
                    │                             │
                    ▼                             ▼
           BrokerDashboard              ClientPortalView
               .tsx                          .tsx
                    │                             │
                    │  Own leads only              │  Own contracts
                    │  Own pipeline                │  Own viewings
                    │  Own commission              │  Own documents
                    │                             │
```

---

## 4. Left Sidebar — 10 Department Navigation Nodes

```
┌──────────────────────────────────────┐
│         FIXED LEFT SIDEBAR           │
│         (280px — Dark #1E293B)       │
├──────────────────────────────────────┤
│  🔱 White Caves CRM                  │  ← Logo / workspace name
├──────────────────────────────────────┤
│                                      │
│  [●] SALES & LEASING          DEP-01 │  ← Active state: Red #EF4444
│  [○] OPERATIONS               DEP-02 │
│  [○] COMMUNICATIONS           DEP-03 │
│  [○] FINANCE & ACCOUNTING     DEP-04 │
│  [○] MARKETING                DEP-05 │
│  [○] EXECUTIVE FLIGHT DECK    DEP-06 │  ← Level 5 only visible
│  [○] COMPLIANCE & LEGAL       DEP-07 │
│  [○] TECHNOLOGY               DEP-08 │
│  [○] LEGAL DEPARTMENT         DEP-09 │
│  [○] HR & PEOPLE              DEP-10 │
│                                      │
├──────────────────────────────────────┤
│  [Settings]  [Help]  [Logout]        │
└──────────────────────────────────────┘

VISIBILITY RULES:
  DEP-06 (Executive Flight Deck) → accessLevel === 5 ONLY
  DEP-07 (Compliance) → accessLevel >= 3
  DEP-08 (Technology) → accessLevel >= 4
  All others → accessLevel >= 2
```

---

## 5. Main Content Area — The 100-Module View Switch

```
═══════════════════════════════════════════════════════════════════════
                    MAIN CONTENT VIEWPORT ENGINE
            DynamicContentRouter.tsx (GPU-accelerated swap)
═══════════════════════════════════════════════════════════════════════

  User clicks Department Node in Sidebar
         │
         ▼
  [WorkspaceContext.setActiveDepartment(deptId)]
         │
         ▼
  [DynamicContentRouter resolves component]
         │
         ├─ SALES      → SalesDepartmentView.tsx
         │    └─ Modules: Pipeline Board, Lead List, Commission Tracker
         │                ViewingsCalendar, OffersManager, ContractStepper
         │
         ├─ OPERATIONS → OperationsDepartmentView.tsx
         │    └─ Modules: 9,378-unit Inventory Grid, SLA Dispatch Board
         │                Maintenance Tickets, Property Stages
         │
         ├─ FINANCE    → FinanceDepartmentView.tsx
         │    └─ Modules: P&L Dashboard, Cash Flow Ledger
         │                VAT Return Exporter, Multi-Currency FX Board
         │                Escrow Clearance Meter, AR Aging Grid
         │
         ├─ COMMS      → CommunicationsView.tsx
         │    └─ Modules: 23+ WhatsApp Inbox, Broadcast Centre
         │                Nadia SLA Clock, Campaign Manager
         │
         ├─ MARKETING  → MarketingDepartmentView.tsx
         │    └─ Modules: CPL Density Maps, Ad ROI Scoreboard
         │                SEO Rankings, Social Media Metrics
         │
         ├─ EXECUTIVE  → ExecutiveFlightDeckView.tsx [Level 5 only]
         │    └─ Modules: MD Summary Tiles, Hot Lead Alerts
         │                Revenue KPI Gauges, Market Intelligence
         │                Team Performance Leaderboard
         │
         ├─ COMPLIANCE → ComplianceDepartmentView.tsx [Level 3+]
         │    └─ Modules: RERA Card Verification, AML Matrices
         │                DLD Registration Status, EJARI Queue
         │
         ├─ TECHNOLOGY → TechnologyDiagnosticsView.tsx [Level 4+]
         │    └─ Modules: System Health, API Latency, Error Logs
         │                DB Connection Status, Import Queue
         │
         ├─ LEGAL      → LegalDepartmentView.tsx
         │    └─ Modules: Form 7 Generator, Form 12 Generator
         │                Form 6 Stepper, Contract Archive
         │
         └─ HR         → HRDepartmentView.tsx
              └─ Modules: Employee Directory, Payroll Overview
                          Recruitment Pipeline, Onboarding Tracker
```

---

## 6. Global Search (Ctrl+K) — Spotlight Navigation Flow

```
  User presses [Ctrl+K] anywhere in the application
         │
         ▼
  ┌─────────────────────────────────────┐
  │  GlobalSearchModal.tsx (overlay)    │
  │  ┌───────────────────────────────┐  │
  │  │ 🔍 Search modules, leads...   │  │  ← Input focused immediately
  │  └───────────────────────────────┘  │
  │                                     │
  │  RECENT                             │
  │  ● Sales Pipeline Board             │
  │  ● Finance P&L Dashboard            │
  │  ● Lead #L-2847 (Ahmed Al Rashidi)  │
  │                                     │
  │  MODULES                            │
  │  ◎ Operations → Inventory Grid      │
  │  ◎ Finance → VAT Return Exporter    │
  │  ◎ Compliance → RERA Verification   │
  └─────────────────────────────────────┘
         │
         │  [User selects result]
         ▼
  [WorkspaceContext navigation call]
         │
         ├─ Module result → setActiveDepartment() + setActiveModule()
         ├─ Record result → navigate("/crm/leads/:id")
         └─ Department result → setActiveDepartment()
```

---

## 7. Client Portal — Level 1 Simplified Navigation

```
═══════════════════════════════════════════════════════════════════════
                 CLIENT PORTAL NAVIGATION (Level 1)
═══════════════════════════════════════════════════════════════════════

  [Top Nav: Logo | Notifications | Avatar]   ← Simplified (no dept tabs)
  │
  ├── [My Properties]    → Listed / Reserved / Sold properties
  │      └─ Property Cards → Price, Status, Agent Contact
  │
  ├── [My Contracts]     → Active Tenancy & Sale Contracts
  │      └─ EJARI Number, Rent Schedule, PDC Cheques
  │
  ├── [Viewings]         → Upcoming + Past Viewing Appointments
  │      └─ Calendar view, Reschedule button, Agent info
  │
  ├── [Documents]        → Title Deed, NOC, Form 6/7/12
  │      └─ Download PDF, Upload acknowledgment
  │
  ├── [Payments]         → Rent due, Cheque status, Payment history
  │      └─ PDC tracker: Pending / Cleared / Bounced badges
  │
  └── [Support]          → WhatsApp Nadia, Email broker, Raise ticket
```

---

## 8. Navigation Transition Rules

| Action | Animation | Duration | Trigger |
|---|---|---|---|
| Department switch | Fade + slide-up | 200ms | Click sidebar node |
| Module switch within dept | Fade | 150ms | Click module tab |
| Global search open | Blur backdrop + scale-in | 180ms | Ctrl+K |
| Global search close | Fade-out | 120ms | Esc / backdrop click |
| Notification panel | Slide-in from right | 200ms | Bell click |
| MD impersonation banner | Slide-down | 250ms | Role switch toggle |
| Page-level route change | Cross-fade | 300ms | Router `<Link>` |

All transitions use CSS custom properties: `var(--transition-speed-fast: 150ms)` and `var(--transition-speed-normal: 200ms)`.

---

## 9. Mobile Responsive Navigation Rules (≤ 768px)

```
MOBILE LAYOUT (≤ 768px)
─────────────────────────
Top Nav:
  [Hamburger ☰]  [Logo]  [Bell]  [Avatar]
       │
       └─ Opens: MobileSidebar.tsx (full-screen overlay, dark #1E293B)
                 Renders: same 10 department nodes in list format
                 Close: swipe-right or tap backdrop

Sidebar: Hidden by default (useSidebarState.isMobileOpen)
Content: Full width (0px left margin)
Search: Bottom-fixed FAB → opens GlobalSearchModal

Bottom Nav Bar (Mobile only):
  [Home] [Pipeline] [Leads] [Finance] [Profile]
  Colors: Active = #EF4444, Inactive = #6B7280
```

---

*This flowchart is governed by `software_docs/core_engineering_manifest.md`. Implementation files: `src/components/navigation/TopNavbar.tsx`, `src/layouts/UnifiedWorkspaceLayout.tsx`, `src/router/DynamicContentRouter.tsx`, `src/context/WorkspaceContext.tsx`.*
