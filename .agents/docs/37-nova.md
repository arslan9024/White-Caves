# 37 — Nova · New Development & Off-Plan Tracker

> **ID:** `nova`  
> **Department:** Intelligence / Sales  
> **Title:** New Development & Off-Plan Sales Tracker  
> **Color:** `#F59E0B` (Yellow)  
> **Avatar:** 🚀  
> **Phase:** Phase 7 (Planned)  
> **Status:** 🔲 Planned — to be registered in code  
> **Access:** Managing Director, Sales Team, Investors

---

## 1. Overview

Nova is the **live tracker of Dubai's new development pipeline**. She monitors every off-plan project from launch to handover, tracks unit inventory levels, watches payment plan attractiveness, and alerts agents when a new project matches their clients' investment criteria. Nova bridges the gap between Atlas (strategic research) and Vesta (client unit tracking) by providing the operational view of the entire off-plan market.

---

## 2. Core Responsibilities

1. Track all active off-plan projects in Dubai: unit count, sold %, price changes
2. Monitor payment plan attractiveness: 0% commission, post-handover payments, 1% monthly
3. Alert agents when a new project matches a specific investor's criteria
4. Track launch events: developer launch dates, priority registration windows
5. Unit availability monitor: alert when a specific unit type/area becomes available
6. Sales velocity tracking: how fast are units selling in each project

---

## 3. Capabilities

| Capability | Description |
|---|---|
| Project watch list | Agent adds projects to watch list → gets updates on price changes, availability |
| Inventory tracker | Available units by type (studio, 1-bed, 2-bed, etc.) per project |
| Sales velocity | % sold per week — detect "selling fast" projects |
| Payment plan analyser | Score payment plans: 0% interest (10/90), post-handover (30/70), SPA (40/60) |
| Price change alerts | Price increase/decrease in a project → alert subscribed agents |
| Launch registration | Track developer registration windows; help agents get priority allocations |
| Client match alert | New project available → matches investor client profile → instant notification |
| EOI tracker | Expressions of Interest filed by White Caves clients per project |
| Competitor allocation | Which other agencies hold allocation? White Caves' share? |
| Project ROI estimate | Quick ROI estimate: launch price vs Cipher's handover price forecast |

---

## 4. How It Works — End to End

### Step 1 — Project Ingestion
Atlas's weekly scraper feeds projects to Nova: `POST /api/nova/projects`. Nova enriches with unit availability data scraped from developer booking portals.

### Step 2 — Inventory Monitoring
Daily cron: `NovaService.checkInventory()` → for each tracked project: request latest available unit count from developer portal/API → compare to previous day → compute `{ change: -5, unitsLeft: 23, percentSold: 78 }`.

### Step 3 — Sales Velocity Alert
If `weeklyChangePercent > 15%` (selling fast): create alert → notify all agents with subscribed investors:
"🔥 [Project] is 78% sold — only 23 units left. Your client [Name] may be interested."

### Step 4 — Client Match
Agent adds investor to "match alerts": `POST /api/nova/subscriptions { agentId, criteria: { budgetMax: 2M, areas: ['JVC', 'Business Bay'], type: ['apartment'], minYield: 6 } }`.
When a new project meeting criteria is detected → `NovaService.matchProject(project, subscriptions)` → notify matching agents via Nadia.

### Step 5 — Payment Plan Scoring
`NovaService.scorePaymentPlan(plan)`:
- Post-handover % contribution → +10 per 10%
- Payment-free period → +5 per year
- Booking amount < 10% → +5
Returns 0–100 score → displayed as "Payment Plan Attractiveness" badge.

### Step 6 — EOI Management
Agent files Expression of Interest for a client on a project → `POST /api/nova/eoi { clientId, projectId, unitType, budget }`. Nova tracks EOIs and confirms allocation when developer responds.

### Step 7 — Launch Event
Developer announces launch event (from Flux or Atlas) → Nova creates `LaunchEvent`: date, registration window, priority channels → agents notified → can RSVP and block calendar.

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/nova/projects` | All tracked projects with inventory |
| PATCH | `/api/nova/projects/:id` | Update project inventory/pricing |
| GET | `/api/nova/projects/:id/units` | Available units breakdown |
| POST | `/api/nova/subscriptions` | Subscribe client criteria |
| GET | `/api/nova/subscriptions` | Agent's client subscriptions |
| POST | `/api/nova/eoi` | File EOI for a client |
| GET | `/api/nova/eoi` | List EOIs |
| GET | `/api/nova/launch-events` | Upcoming launch events |
| POST | `/api/nova/launch-events/:id/rsvp` | RSVP to a launch event |

---

## 6. Data Flows

- **Receives from:** Atlas (project database), Flux (new launch news), Developer portals (inventory scraping)
- **Sends to:** Nadia (client match alerts, sales velocity alerts), Vesta (unit registration for clients), Clara (off-plan leads)

---

## 7. Frontend Components

| Component | Path | Status |
|---|---|---|
| Nova CRM dashboard | `src/components/owner/ai/NovaCRM/` | 🔲 Planned |
| Project inventory board | Kanban-style project tracker | 🔲 Planned |
| Client subscription manager | Agent preference config | 🔲 Planned |
| Launch events calendar | Upcoming launches | 🔲 Planned |

---

## 8. Backend Services

| Service | Path | Status |
|---|---|---|
| NovaService | `server/services/NovaService.ts` | 🔲 Planned |
| Inventory cron | `server/jobs/inventoryCheckJob.ts` | 🔲 Planned |
| EOI model | Prisma `EOI` | 🔲 Planned |
| Launch events model | Prisma `LaunchEvent` | 🔲 Planned |

---

## 9. Access Control

| Role | Access |
|---|---|
| `managing_director` | All projects + allocation management |
| `agent` | Own client subscriptions + EOIs |
| `investor` (portal) | Read matched projects + EOI status |

---

## 10. Implementation Checklist

- [ ] Register `nova` in `AI_ASSISTANTS_REGISTRY`
- [ ] Project model + inventory model
- [ ] Daily inventory check cron
- [ ] Client subscription model
- [ ] Sales velocity calculation + alert
- [ ] Payment plan scoring
- [ ] EOI model + CRUD
- [ ] Launch events model + RSVP
- [ ] Client match alert (via Nadia)

---

## 11. Dependencies

- Atlas (project data feed)
- Flux (new launch news triggers)
- Nadia (alert delivery)
- Vesta (handoff to project tracking for clients)
- Developer portal APIs / scrapers

---

## 12. Future Enhancements

- Virtual launch event broadcasting (live video + Q&A)
- Blockchain-based unit reservation system
- Guaranteed allocation tracking (White Caves exclusive units)
- Off-plan resale market tracker (flipping activity)
