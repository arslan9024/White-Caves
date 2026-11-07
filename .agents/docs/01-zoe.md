# 01 — Zoe · Executive Assistant & Strategic Intelligence

> **ID:** `zoe`  
> **Department:** Executive  
> **Title:** Executive Assistant & Strategic Intelligence  
> **Color:** `#10B981` (Emerald)  
> **Avatar:** 👩‍🏫  
> **Phase:** Phase 3 (Active)  
> **Status:** ✅ In Code — `src/components/owner/ai/ZoeExecutiveCRM_NEW/`  
> **Access:** Owner / Managing Director only

---

## 1. Overview

Zoe is the **command-centre assistant** for the Managing Director and owner. She aggregates real-time KPIs from every department, surfaces strategic recommendations, manages the executive calendar, and delivers daily/weekly intelligence briefings. She is the first screen the owner sees after signing in.

---

## 2. Core Responsibilities

1. Executive KPI dashboard — live metrics from all 39 other assistant feeds
2. Strategic suggestions inbox — prioritised actions ranked by business impact
3. Cross-department reporting — unified view across Sales, Finance, Compliance, Operations
4. Calendar & meeting management — agenda, reminders, pre-read packs
5. Risk alerts — flags from Laila, Evangeline, Sentinel that require owner decision
6. Board-level report generation — monthly performance PDFs

---

## 3. Capabilities

| Capability | Description |
|---|---|
| Live KPI cards | Total revenue, active leads, properties listed, deals closing this week |
| Pipeline snapshot | Revenue forecast vs target (Recharts bar chart) |
| Agent leaderboard | Top 5 agents by deals and commissions this month |
| Strategic inbox | Ranked list of suggested actions from all departments |
| Calendar view | Today's meetings, viewings, contract signings |
| Alert centre | Critical flags requiring owner decision (red/amber/green) |
| Report builder | Select date range + departments → generate PDF briefing |
| Cross-assistant chat | Send instructions to any assistant via the AI Command Center |

---

## 4. How It Works — End to End

### Step 1 — Sign-in Redirect
Owner logs in as `arslanmalikgoraha@gmail.com` → JWT issued → frontend Redux sets `role: managing_director` → `App.tsx` routes to `/dashboard` → `UnifiedDashboardPage` renders Zoe's Overview tab as the landing screen.

### Step 2 — Data Aggregation
On mount, `ZoeExecutiveCRM_NEW` dispatches:
- `GET /api/dashboard/summary` → KPI totals
- `GET /api/leads?status=hot&limit=5` → hot leads
- `GET /api/finance/summary` → revenue this month
- `GET /api/agents?sort=commissions` → agent leaderboard
- `GET /api/notifications?type=alert&unread=true` → risk alerts

### Step 3 — KPI Rendering
KPIs animate via Framer Motion counter on mount. Each card shows current value, % change vs last period, and a mini sparkline.

### Step 4 — Strategic Suggestions
Backend aggregates rule-based suggestions: if `leads.hot > 10 and unassigned`, suggest "Assign 10 hot leads now". If `contracts.expiring_in_7d > 0`, suggest "Review expiring contracts". Suggestions returned by `GET /api/suggestions`.

### Step 5 — Calendar Integration
`GET /api/calendar/today` returns today's events. Clicking an event opens the linked entity (lead, property, contract) directly.

### Step 6 — Report Generation
Owner clicks "Generate Monthly Report" → `POST /api/reports/executive` → server builds PDF with Puppeteer → returns download URL → browser downloads.

### Step 7 — Alert Escalation
Any assistant (Laila, Evangeline, Sentinel) can push a critical alert via `POST /api/notifications` with `type: 'critical'`. Zoe's alert centre shows these in real time via WebSocket.

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/dashboard/summary` | Aggregate KPI totals |
| GET | `/api/suggestions` | Strategic action suggestions |
| GET | `/api/calendar/today` | Today's schedule |
| POST | `/api/reports/executive` | Generate monthly PDF report |
| GET | `/api/notifications?type=alert` | Critical alerts feed |

---

## 6. Data Flows

- **Receives from:** Clara (lead counts), Sophia (pipeline revenue), Theodora (finance totals), Laila (compliance alerts), Sentinel (property alerts), Mary (inventory counts), Nancy (HR flags)
- **Sends to:** All assistants via AI Command Center instructions

---

## 7. Frontend Components

| Component | Path | Status |
|---|---|---|
| `ZoeExecutiveCRM_NEW` | `src/components/owner/ai/ZoeExecutiveCRM_NEW/` | ✅ Exists |
| `OverviewTab` | `src/components/owner/tabs/OverviewTab.tsx` | ✅ Exists |
| KPI cards | Inside `OverviewTab` | ✅ Exists |
| `AICommandCenter` | `src/components/crm/AICommandCenter.tsx` | ✅ Exists |

---

## 8. Backend Services

| Service | Path | Status |
|---|---|---|
| Dashboard summary | `server/routes/crm.ts` | ✅ Exists (mock data) |
| Reporting | `server/routes/reporting.ts` | ✅ Exists |
| Suggestions engine | `server/services/SuggestionsService.ts` | 🔲 Planned |

---

## 9. Access Control

| Role | Can View | Can Edit | Can Export |
|---|---|---|---|
| `managing_director` | ✅ Full | ✅ Full | ✅ Yes |
| `owner` / `lion` | ✅ Full | ✅ Full | ✅ Yes |
| All others | ❌ No | ❌ No | ❌ No |

---

## 10. Implementation Checklist

- [x] ZoeExecutiveCRM_NEW component renders without crash
- [x] Registered in `AI_ASSISTANTS_REGISTRY`
- [x] KPI cards render (mock data)
- [ ] Wire KPIs to live `/api/dashboard/summary`
- [ ] Strategic suggestions engine (`SuggestionsService.ts`)
- [ ] Calendar integration (`GET /api/calendar/today`)
- [ ] Monthly PDF report generation
- [ ] Real-time alerts via WebSocket
- [ ] Tests: `ZoeExecutiveCRM_NEW.test.tsx`

---

## 11. Dependencies

- Recharts (already installed) — charts
- Framer Motion (already installed) — counter animations
- Puppeteer / pdfkit (Phase 7) — PDF generation
- WebSocket / Socket.io (Phase 4) — real-time alerts

---

## 12. Future Enhancements

- GPT-4 powered weekly narrative summary ("This week, your revenue increased 12%...")
- Voice briefing via text-to-speech
- Integration with Google Calendar / Outlook
- Predictive revenue forecasting (12-month ML model)
