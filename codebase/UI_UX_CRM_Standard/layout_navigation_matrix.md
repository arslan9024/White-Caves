# White Caves Real Estate LLC — UI/UX CRM Layout & Navigation Matrix

**Design System Standard:** White Caves Luxury Glassmorphism V3  
**Governance Authority:** @Una (UI Lead) + @Ada (Chief Architect)  
**Last Updated:** 2026-07-22

---

## 1. Architectural Layout Architecture (3-Tier Master Matrix)

To eliminate dashboard clutter and provide a sleek, high-density executive interface, all application views enforce a strict 3-tier layout matrix:

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────┐
│ TIER 2: CONTEXTUAL TOP HEADER BAR (Search | Bell Notifications | AI Trigger Shortcut Panel)       │
├─────────────────┬─────────────────────────────────────────────────────────────────────────────────┤
│ TIER 1: FIXED   │ TIER 3: PRIMARY FLEXIBLE MAIN WORKSPACE VIEWPORT                                │
│ LEFT SIDEBAR    │                                                                                 │
│ (Global Nav)    │  ┌───────────────────────────────────────────────────────────────────────────┐  │
│                 │  │ Context Page Header (Breadcrumbs, Quick Action CTA Buttons)             │  │
│ • Dashboard     │  └───────────────────────────────────────────────────────────────────────────┘  │
│ • Leads Engine  │  ┌───────────────────────────────────────────────────────────────────────────┐  │
│ • Listings      │  │                                                                           │  │
│ • Deals         │  │                                                                           │  │
│ • Leaderboard   │  │ Active Workspace Area (Kanban / Data Grids / Leaderboard Split Podiums)   │  │
│ • Library       │  │                                                                           │  │
│                 │  │                                                                           │  │
│                 │  └───────────────────────────────────────────────────────────────────────────┘  │
└─────────────────┴─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Layout Breakdown Specifications

### Tier 1: Fixed High-Contrast Left Sidebar (Width: 260px)

- **Background:** `linear-gradient(180deg, #18181e 0%, #111115 100%)` with a `1px solid rgba(255, 255, 255, 0.05)` right border.
- **Branding Header:** White Caves Gold (`#C9A84C`) Logo + Executive Flight Deck Badge.
- **Navigation Links:**
  1. `🏆 Executive Cockpit` (`/crm`)
  2. `🎯 Leads Engine` (`/crm?tab=leads`)
  3. `🏠 Property Listings` (`/crm?tab=properties`)
  4. `📋 Deal Registry & Contracts` (`/crm?tab=deals`)
  5. `🥇 Apex Leaderboard` (`/crm?tab=leaderboard`)
  6. `📚 Corporate Library` (`/crm?tab=library`)

### Tier 2: Contextual Top Header Bar (Height: 64px)

- **Global Search:** Instant fuzzy search pre-filtering leads, properties, and contract records.
- **Notification Stream (Bell Icon):** Live WebSocket notifications for lead assignments, Ejari signatures, and P1 maintenance tickets.
- **AI Command Center Trigger:** Quick shortcut button (`Ctrl + K` or click) opening Nadia AI Floating Flight Deck.

### Tier 3: Primary Flexible Main Workspace Viewport

- **Responsive Breakpoints:**
  - Desktop (`≥ 1280px`): Full 3-column or split-podium grid.
  - Tablet (`768px – 1279px`): Collapsible sidebar to 72px icons-only view.
  - Mobile (`≤ 767px`): Bottom Navigation Bar (`MobileBottomNav.tsx`) with fixed tabs.

---

## 3. Wireframe UI Flow Blueprints

### 3.1 Interactive Lead Control Board (4-Column Kanban Layout)

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────┐
│ LEAD CONTROL BOARD                                               [ + Add Lead ]  [ Filter: All ]  │
├───────────────────┬───────────────────┬───────────────────┬───────────────────────────────────────┤
│ NEW INQUIRIES     │ VIEWING SCHEDULED │ NEGOTIATION (MOU) │ CLOSED & REGISTERED                   │
│ (Count: 142)      │ (Count: 48)       │ (Count: 18)       │ (Count: 12)                           │
├───────────────────┼───────────────────┼───────────────────┼───────────────────────────────────────┤
│ ┌───────────────┐ │ ┌───────────────┐ │ ┌───────────────┐ │ ┌───────────────────────────────────┐ │
│ │ Khalid Al M.  │ │ │ Fatima Sayed  │ │ │ Omar Zayed    │ │ │ Sarah Al Maktoum                  │ │
│ │ Villa · AED 4M│ │ │ Apt · AED 1.2M│ │ │ Townhouse 2.5M│ │ │ Penthouse 8.5M                    │ │
│ │ Source: WA 💬 │ │ Status: Conf  │ │ Form F Signed │ │ Ejari Registered ✅                │ │
│ └───────────────┘ │ └───────────────┘ │ └───────────────┘ │ └───────────────────────────────────┘ │
└───────────────────┴───────────────────┴───────────────────┴───────────────────────────────────────┘
```

### 3.2 Live Apex Leaderboard Display (Split Screen Podiums)

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 🏆 WHITE CAVES APEX CHAMPIONS LEADERBOARD                                           July 2026     │
├───────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [ 🥇 Track A: Sales Elite (GWC Revenue) ]    [ 🔑 Track B: Leasing Volume (Unit Density) ]        │
├──────────────────────────────────────────────┬────────────────────────────────────────────────────┤
│ 🥇 RANK 1: Sarah Al Maktoum                  │ 🥇 RANK 1: Tariq Mansoor                           │
│    GWC: AED 4,200,000 | Deals: 8 Units       │    Units Transacted: 24 | GWC: AED 950,000        │
│    Badge: Cave Master (AED 2.5k Voucher) 🎟️  │    Badge: Leasing Density Champion 🔑              │
│    Rate Lock: 75% Chairman's Circle 👑       │                                                    │
│ 🥈 RANK 2: Arsalan Malik                     │ 🥈 RANK 2: Fatima Al Sayed                         │
│    GWC: AED 3,800,000 | Level 5 Founder 🛡️   │    Units Transacted: 19 | GWC: AED 820,000        │
└──────────────────────────────────────────────┴────────────────────────────────────────────────────┘
```

### 3.3 Central Corporate Library Portal

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 📚 CORPORATE LIBRARY & LEGAL TAXONOMY PORTAL                     [ Search Documentation... ]      │
├───────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 📂 01_COMMISSION_ENGINE_SPEC.MD      │ Commission Slabs, 180-Day Promo, Multi-Agent Splits        │
│ 📂 02_RERA_COMPLIANCE_BYLAWS.MD      │ RERA Cards, DLD Oqood Off-Plan, Form 7/12 Taxonomies     │
│ 📂 03_DAMAC_HILLS_2_AREA_PLAYBOOK.MD │ Master Plan, Unit Types, Rental Yield Maps, Valuation AVM  │
│ 📂 04_LEASING_SOP_MANUAL.MD          │ Ejari Registration, PDC Verification, Maintenance Tickets  │
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
```
