# White Caves CRM — 100-View Navigation & ASCII Workflow Specification

**Version:** 2.0  
**Author:** @Ada (AEGIS Chief Architect)  
**Status:** Active & Canonical  
**Target Engine:** AEGIS 2.0 Virtual Multi-Agent Network

---

## 🗺️ Sector Execution Map (100 Viewports)

| Sector       | Views        | Domain Focus                                      |
| ------------ | ------------ | ------------------------------------------------- |
| **Sector A** | Views 01–10  | Executive Flight Deck & Founder System Control    |
| **Sector B** | Views 11–25  | Sales Department CRM Hub & Deal Pipeline          |
| **Sector C** | Views 26–40  | Operations Department Portfolio & Property Units  |
| **Sector D** | Views 41–55  | Communications Dispatch Center & Nadia WhatsApp   |
| **Sector E** | Views 56–70  | Finance & Taxation Ledger & Multi-Currency Engine |
| **Sector F** | Views 71–100 | Marketing, Compliance, Technology, Legal & Intel  |

---

## 🎨 Master ASCII Workflow Flowchart

```
[Unified Navigation Click]
           │
           ▼
[AppRouter Switch / Path Resolver]
           │
           ▼
[Local Cache & Level 5 RBAC Security Check]
           │
           ├────────────────────────────────────────────────────────────────────────┐
           ▼                                                                        ▼
   [isOfflineMode = true]                                                 [isOfflineMode = false]
           │                                                                        │
           ▼                                                                        ▼
[Load High-Fidelity Synthetic Arrays]                                     [Hydrate Live Redux State]
           │                                                                        │
           └───────────────────────────────────┬────────────────────────────────────┘
                                               │
                                               ▼
                              [Main Content Viewport Render]
                                               │
           ┌───────────────────────────────────┼───────────────────────────────────┐
           ▼                                   ▼                                   ▼
[Sector B: Sales Kanban]            [Sector C: Operations DH2]          [Sector E: Finance Matrix]
           │                                   │                                   │
           ▼                                   ▼                                   ▼
[Mutate Lead Pipeline State]        [Trigger Maintenance SLA]           [Process 4hr TTL Exchange Rate]
```

---

## 📂 Detailed Sector Viewport Breakdown

### Sector A: Executive Flight Deck (Views 01 - 10)

- `VIEW_EXE_PROFILE` (View 01): Elite Superuser Profile displaying Principal Founder & System Superuser badges.
- `VIEW_EXE_CONSOLIDATED` (View 02): Global Cross-Department Aggregator with real-time transaction tickers.
- `VIEW_EXE_METRICS` (View 03): Multi-Currency Totalizer panel (AED/USD/EUR/GBP/INR).
- `VIEW_EXE_AUDIT` (View 04): Live Interaction Activity Stream & RBAC escalation tracking.
- `VIEW_EXE_CACHE` (View 05): Local Optimization Cache monitor (`plans/AEGIS_CACHE.json`).
- `VIEW_EXE_DIAGNOSTICS` (View 06): Multi-Agent Telemetry cockpit monitoring 150 sub-agents.
- `VIEW_EXE_DEPLOYMENT` (View 07): CI/CD Pipeline tracking dashboard for Vercel releases.
- `VIEW_EXE_COMPILER` (View 08): 0-Token Debugging central trace display (`plans/COMPILER_ERRORS.txt`).
- `VIEW_EXE_POLICIES` (View 09): Restricted Corporate Library gating access by clearance level.
- `VIEW_EXE_ALERTS` (View 10): System anomaly warning board catching route/Prisma exceptions.

### Sector B: Sales Department CRM Hub (Views 11 - 25)

- `VIEW_SAL_KANBAN` (View 11): 4-Column Drag-and-Drop Lead Control Grid (New, Contacted, Viewing, Closing).
- `VIEW_SAL_LEADS_LIST` (View 12): High-density tabular client registry with community filters.
- `VIEW_SAL_FUNNEL` (View 13): Conversion Flow Analytics tracking deal velocity milestones.
- `VIEW_SAL_BROKER_PERF` (View 14): Individual Agent Portfolio tracking monthly production curves.
- `VIEW_SAL_OFF_PLAN` (View 15): Developer Allocation tracker mapping off-plan launch schedules.
- `VIEW_SAL_LEADERBOARD` (View 78/16): Gamified 3-tier Apex Leaderboard (Rising Star to Chairman's Club).

### Sector C: Operations Department Portfolio (Views 26 - 40)

- `VIEW_OPR_INVENTORY` (View 26): High-density spreadsheet matrix of 9,378+ managed Dubai properties.
- `VIEW_OPR_DH2_CLUSTERS` (View 27): DAMAC Hills 2 residential cluster filterable grid.
- `VIEW_OPR_STATUS_BADGES` (View 28): Inventory status cards (Available=Emerald, Leased=Blue, Maintenance=Amber).
- `VIEW_OPR_TICKETS` (View 29): Facilities Maintenance request list with engineering dispatch triggers.
- `VIEW_OPR_VENDORS` (View 30): Third-party contractor SLA allocation matrix.

### Sector D: Communications Dispatch Center (Views 41 - 55)

- `VIEW_COM_INBOX` (View 41): Unified Messaging center aggregating 23+ WhatsApp lines.
- `VIEW_COM_NADIA_TICKER` (View 42): Nadia WhatsApp routing pool monitor with queue latency counters.
- `VIEW_COM_SLA_CLOCKS` (View 43): 15-minute SLA response countdown tickers.
- `VIEW_COM_TEMPLATES` (View 44): RERA-compliant message template catalog.
- `VIEW_COM_BOT_TREES` (View 45): Chatbot conversational decision tree layout.

### Sector E: Finance & Taxation Ledger (Views 56 - 70)

- `VIEW_FIN_CALCULATOR` (View 56): Automated Commission split processing dashboard.
- `VIEW_FIN_APPROVAL` (View 57): State-driven financial approval workflow (Submitted ➔ Approved ➔ Locked ➔ Paid).
- `VIEW_FIN_CASHFLOW` (View 58): Rolling 12-Month Cash-Flow Forecast predictive timeline chart.
- `VIEW_FIN_AGING` (View 59): Accounts Receivable aging report columns (30/60/90/120+ days).
- `VIEW_FIN_VAT` (View 60): UAE FTA 5% VAT return formatting dashboard.

### Sector F: Marketing, Compliance, Legal, Technology & Intel (Views 71 - 100)

- `VIEW_MKT_ROI` (View 71): Marketing ROI & CPL Attribution scoreboard.
- `VIEW_CMP_TIMELINE` (View 72): RERA/DLD licensing compliance checklist.
- `VIEW_LEG_FORM7` (View 73): DLD Form 7 (Rent Increase Notice) 90-day timeline panel.
- `VIEW_LEG_FORM12` (View 74): DLD Form 12 (Eviction Notice) execution tracker.
- `VIEW_LEG_FORM6` (View 75): DLD Form 6 (Lease Non-Renewal) Ejari ledger.
- `VIEW_INT_PREDICTIVE` (View 76): Sentinel Predictive Pricing neighborhood appraisal boards.
- `VIEW_INT_IOT_ANOMALIES` (View 77): Building structural health sensor anomaly heatmaps.

---

## 🔒 Security & Execution Policy

1. **Superuser Privilege**: Email `arslanmalikgoraha@gmail.com` bypasses all lower gates to `LEVEL_5_MASTER`.
2. **Brand Color Lockdown**: Strictly `#10B981` (Emerald), `#C9A84C` (Gold), `#0f0f0f` (Obsidian).
3. **Sidebar Consolidation**: All 100 views render inside `<UnifiedWorkspaceLayout>`.
