# Universal Navigation Map & Viewport Routing Architecture

## 1. System Overview

The **Universal Navigation Map** establishes the complete visual interaction topology for the White Caves Sovereign CRM Cockpit. It traces user clicks, authentication states, RBAC routing guards, sidebar selections, and content canvas layouts across all 100 enterprise views.

---

## 🎨 Brand Palette Enforcement

- Primary Red (`#EF4444`): Navigation highlights, active sidebar item backgrounds, active canvas borders.
- Pure White (`#FFFFFF`): Workspace canvas surfaces, modal containers.
- Slate Text (`#1E293B`): Diagram node labels, structural connection lines.

---

## 🔗 Inter-Linked Navigation References

- [Engineering Manifest](../core_engineering_manifest.md) — Technical stack, architecture rules, and credit preservation parameters.
- [Impersonation Use Case](../03_use_cases/md_impersonation_matrix.md) — Operational use case for Managing Director Ghost Session impersonation.

---

## 🗺️ 2. Comprehensive ASCII Navigation & Interaction Flowcharts

### 2.1 Pre-Login & Authentication Routing Flowchart
```
  [ Visitor Arrives ]
          │
          ▼
┌──────────────────┐    Bypass Check    ┌──────────────────────────────────┐
│  /login (SignIn) ├───────────────────►│ arslanmalikgoraha@gmail.com      │
└─────────┬────────┘ (Founder Short)    │ Access Level: LEVEL_5_MASTER     │
          │                             └────────────────┬─────────────────┘
          │ Standard Login                               │ Force Direct Landing
          ▼                                              ▼
┌──────────────────┐                    ┌──────────────────────────────────┐
│  Firebase Auth   │                    │ ProfilePage.tsx                  │
│  Verification    │                    │ Executive Credentials & Controls │
└─────────┬────────┘                    └────────────────┬─────────────────┘
          │ Success                                      │ Unmask Command
          ▼                                              ▼
┌──────────────────┐                    ┌──────────────────────────────────┐
│  Session Token   │                    │ UnifiedWorkspaceLayout.tsx       │
│  Hydrated        │                    │ 12-Department Left Sidebar       │
└──────────────────┘                    └──────────────────────────────────┘
```

---

### 2.2 Role-Filtered Content Canvas Routing Topology
```
                     ┌──────────────────────────────────────────┐
                     │     UnifiedWorkspaceLayout.tsx           │
                     │  Header: Brand Pill | Ctrl+K | User Bar  │
                     └────────────────────┬─────────────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
     ┌────────────────────────┐                      ┌────────────────────────┐
     │ Left Navigation        │                      │ Executive Impersonator │
     │ Department Sidebar     │                      │ Ghost Session Selector │
     └────────────┬───────────┘                      └────────────┬───────────┘
                  │                                               │
  ┌───────────────┼───────────────┐               ┌───────────────┼───────────────┐
  ▼               ▼               ▼               ▼               ▼               ▼
[Sales]      [Operations]     [Finance]      [MD View]      [Manager View]   [Broker View]
  │               │               │               │               │               │
  ▼               ▼               ▼               ▼               ▼               ▼
┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────────┐ ┌───────────┐ ┌───────────┐
│9,378-Unit │ │Form 12    │ │5% VAT     │ │Executive      │ │Dept Flight│ │Personal   │
│Inventory  │ │Ejari      │ │Accounting │ │Flight Deck    │ │Deck       │ │Kanban     │
│Kanban Grid│ │Evictions  │ │Ledger Lock│ │All Metrics    │ │Squad KPIs │ │Lead Board │
└───────────┘ └───────────┘ └───────────┘ └───────────────┘ └───────────┘ └───────────┘
```

---

### 2.3 Global Search Overlay (Ctrl+K Command Pill)
```
  [ User Presses Ctrl+K / Clicks Floating Search Pill (#EF4444 Pin) ]
                               │
                               ▼
            ┌────────────────────────────────────┐
            │ Framer Motion Search Modal Overlay │
            │ Search Input: Properties, Leads... │
            └──────────────────┬─────────────────┘
                               │
             ┌─────────────────┴─────────────────┐
             ▼                                   ▼
┌──────────────────────────┐        ┌──────────────────────────┐
│ Property Unit Match      │        │ Lead Record Match        │
│ Jump to Listing Card     │        │ Jump to Kanban Card      │
└──────────────────────────┘        └──────────────────────────┘
```
