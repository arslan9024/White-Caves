# Universal Navigation & Session Flowcharts
**White Caves Real Estate LLC — Architecture Specification**
**Version:** 2026.07.27 | **Palette:** White Caves Red (#EF4444) | Brilliant White (#FFFFFF) | Slate Gray (#1E293B)

---

## 1. Global Navigation & Session Routing Flowchart

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    UNIVERSAL TOP NAV BAR (Global Component)                │
│   [Logo: WC Red] [Global Search Bar] [DLD Ticker] [Zoe AI] [Profile/Impersonate]│
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        ▼                              ▼                              ▼
┌──────────────┐               ┌──────────────┐               ┌──────────────┐
│   Homepage   │               │ Profile Page │               │  Dashboard   │
│ (Public View)│               │  (/profile)  │               │   (/crm/*)   │
└──────────────┘               └──────────────┘               └──────────────┘
                                                                      │
                                                        [Triggers RBAC Check]
                                                                      │
         ┌────────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────┐
         ▼                                                            ▼                                                            ▼
┌──────────────────────────────────────┐   ┌──────────────────────────────────────┐   ┌──────────────────────────────────────┐
│              VARIANT 1               │   │              VARIANT 2               │   │              VARIANT 3               │
│        (LEVEL_5_MASTER / MD)         │   │       (LEVEL_2_3 / Agent/Broker)      │   │       (LEVEL_1 / Client Portal)      │
├──────────────────────────────────────┤   ├──────────────────────────────────────┤   ├──────────────────────────────────────┤
│ • Full 10 Departments Visible        │   │ • Filtered Assigned Leads Only       │   │ • Left Sidebar & Internal CRM Hidden │
│ • Global Cash Flow & AED Metrics     │   │ • Personal Showing Calendar          │   │ • Owned / Leased Units Overview      │
│ • Ghost Session Impersonation Matrix │   │ • Personal Target Accelerator Split  │   │ • Active Ejari & Form 7 Contract View│
│ • Master Employee CRUD Lifecycle     │   │ • Broker Podiums & Gamified Rank     │   │ • Maintenance Tickets & Request Log  │
└──────────────────────────────────────┘   └──────────────────────────────────────┘   └──────────────────────────────────────┘
```

---

## 2. Managing Director Impersonation Flowchart

```
┌──────────────────────────────────────────────────────────────────┐
│ Managing Director Session Detected (arslanmalikgoraha@gmail.com) │
└──────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────┐
│        TopNavbar Renders "🎭 Impersonate Profile" Dropdown       │
└──────────────────────────────────────────────────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Select Broker A │     │ Select Agent B  │     │ Select Client C │
│   (Level 3)     │     │   (Level 2)     │     │   (Level 1)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────┐
│  WorkspaceContext overrides activeUser context in memory         │
│  UnifiedDashboardPage re-renders active Variant in real-time     │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. Data Hydration Context Pipeline

```
┌──────────────────────────────┐
│    companyMasterLedger.json  │
└──────────────┬───────────────┘
               │ (Pre-loaded on initial mount)
               ▼
┌──────────────────────────────┐
│       WorkspaceContext       │
│ • 10 Departments             │
│ • 100 Personnel Records      │
│ • 100 Properties Items       │
│ • Impersonation State        │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│  Instantaneous Tab Swapping  │
│  Zero White Flashes / 0ms    │
└──────────────────────────────┘
```
