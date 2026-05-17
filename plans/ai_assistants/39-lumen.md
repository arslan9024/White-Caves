# 39 — Lumen · Visual Analytics & Reporting Engine

> **ID:** `lumen`  
> **Department:** AI Engine / Analytics  
> **Title:** Visual Analytics & Reporting Engine  
> **Color:** `#F97316` (Orange)  
> **Avatar:** 📈  
> **Phase:** Phase 7 (Planned)  
> **Status:** 🔲 Planned — to be registered in code  
> **Access:** Managing Director, Department Managers, All agents (own data)

---

## 1. Overview

Lumen is the **business intelligence and reporting engine** for White Caves. While individual assistants have their own dashboards, Lumen provides cross-assistant analytics — unified reports that pull data from Mary, Clara, Sophia, Theodora, Daisy, Olivia, and Apex simultaneously to produce strategic business intelligence. She powers the MD's custom report builder, scheduled automated reports, and the public-facing market transparency reports.

---

## 2. Core Responsibilities

1. Cross-department report builder: drag-and-drop metrics from any department
2. Scheduled report automation: daily/weekly/monthly PDFs auto-sent to relevant roles
3. KPI trend analysis: detect whether the business is improving or declining
4. Department comparison: which team/area/property type is performing best
5. Custom dashboard builder: MD can create personal pinned dashboard view
6. Export data warehouse: CSV/Excel bulk export of any dataset

---

## 3. Capabilities

| Capability | Description |
|---|---|
| Report builder | Select metrics from 10+ departments → Lumen assembles charts and tables |
| Scheduled reports | Configure: metric selection, recipients, format (PDF/Excel), frequency |
| KPI trend detection | Compare this period vs last: flag improvements and declines > 5% |
| Department scorecard | One-page summary per department with RAG (Red/Amber/Green) status |
| Custom dashboard | Drag-and-drop widget builder: pin any chart from any assistant |
| Data export | Export any dataset as CSV or Excel with filters applied |
| Benchmark comparison | White Caves KPIs vs industry benchmarks (from Cipher/Oracle) |
| Funnel visualisation | Marketing → leads → qualified → deals → revenue — multi-step funnel |
| Period comparison | Month-on-month, quarter-on-quarter, year-on-year with % change |
| White-label reports | Brand reports for external investors with White Caves letterhead |

---

## 4. How It Works — End to End

### Step 1 — Report Request
MD opens Lumen → clicks "New Report" → selects: metric categories (Sales, Finance, Leasing, Marketing), date range, comparison period, output format → `POST /api/lumen/reports`.

### Step 2 — Data Collection
`LumenService.collectData(config)`:
- Calls each relevant assistant's analytics endpoint in parallel:
  - `GET /api/leads/analytics` (Clara)
  - `GET /api/deals/forecast` (Sophia)
  - `GET /api/finance/summary` (Theodora)
  - `GET /api/campaigns/:id/analytics` (Olivia)
  - `GET /api/apex/benchmarks` (Apex)
- Normalises all responses into a unified data schema

### Step 3 — Chart Generation
For each selected metric: `LumenService.buildChart(metric, data)` → returns chart specification (Recharts-compatible object). Charts categorised: bar, line, pie, funnel, table.

### Step 4 — PDF Assembly
Quill is called with assembled charts and tables: `QuillService.generate({ templateId: 'custom_report', data: { charts, tables, summary } })` → branded PDF returned.

### Step 5 — Scheduled Delivery
On schedule trigger: `LumenService.runScheduledReport(reportId)` → repeat Steps 2–4 → email/WhatsApp to configured recipients.

### Step 6 — KPI Trend Detection
After data collection: compare each KPI to same period last month. If `|change| > 5%`: create trend insight: "📈 Lead conversion improved 12% vs last month" or "📉 Viewing-to-offer rate fell 8%." Inserted into Zoe's strategic suggestions.

### Step 7 — Custom Dashboard
Agent/manager saves a "pinned view": array of widget configs. On next login, Lumen renders their personal dashboard from saved config.

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/lumen/reports` | Create and generate report |
| GET | `/api/lumen/reports` | List saved reports |
| GET | `/api/lumen/reports/:id` | Get report with download URL |
| POST | `/api/lumen/schedules` | Create scheduled report |
| GET | `/api/lumen/schedules` | List scheduled reports |
| GET | `/api/lumen/dashboards/:userId` | Get user's custom dashboard |
| PUT | `/api/lumen/dashboards/:userId` | Save custom dashboard config |
| GET | `/api/lumen/insights` | Get latest KPI trend insights |
| GET | `/api/lumen/export` | Export dataset as CSV/Excel |

---

## 6. Data Flows

- **Receives from:** All assistants' analytics endpoints (Clara, Sophia, Theodora, Daisy, Olivia, Apex, Mary, Nancy, Halo, Cipher)
- **Sends to:** Quill (PDF generation), Email service / Nadia (scheduled report delivery), Zoe (KPI insights)

---

## 7. Frontend Components

| Component | Path | Status |
|---|---|---|
| Lumen analytics dashboard | `src/components/owner/ai/LumenCRM/` | 🔲 Planned |
| Report builder | Drag-and-drop metric selector | 🔲 Planned |
| Custom dashboard builder | Widget drag-and-drop | 🔲 Planned |
| Scheduled report manager | Config list + CRON UI | 🔲 Planned |

---

## 8. Backend Services

| Service | Path | Status |
|---|---|---|
| LumenService | `server/services/LumenService.ts` | 🔲 Planned |
| Report model | Prisma `Report` | 🔲 Planned |
| Schedule cron | `server/jobs/reportScheduleJob.ts` | 🔲 Planned |

---

## 9. Access Control

| Role | Access |
|---|---|
| `managing_director` | Full report builder + all data |
| `department_manager` | Own department data + cross-dept read |
| `agent` | Own data reports only |

---

## 10. Implementation Checklist

- [ ] Register `lumen` in `AI_ASSISTANTS_REGISTRY`
- [ ] LumenService data collection (parallel API calls)
- [ ] Chart specification builder
- [ ] Quill integration for PDF output
- [ ] Report model + CRUD
- [ ] Scheduled report cron
- [ ] KPI trend detection
- [ ] Custom dashboard save/load
- [ ] CSV/Excel export endpoint
- [ ] Tests

---

## 11. Dependencies

- All assistant analytics endpoints (must exist first)
- Quill (PDF generation)
- `node-cron` (scheduled reports)
- `exceljs` (Excel export)
- Recharts (chart rendering)

---

## 12. Future Enhancements

- Natural language report generation: "Show me last quarter's performance in 3 sentences"
- AI-powered anomaly detection in historical trends
- Executive video briefing: automated video report with voiceover
- External investor portal with white-labelled quarterly reports
