# Phase 7 — Analytics, Portal Syndication & Financial Exports

> **Priority**: #7 (after Phase 6)
> **Goal**: PropertyFinder/Bayut syndication, PDF/Excel financial reports, multi-currency display, advanced performance analytics
> **Prerequisite**: Phase 6 (Compliance) for verified properties to be eligible for portal syndication
> **Status**: 🔲 Not Started
> **Detailed context**: See [`PHASE_3_AND_BEYOND.md`](./PHASE_3_AND_BEYOND.md#phase-7--analytics--portal-syndication-after-phase-6)

---

## External Dependencies

| Dependency                       | Owner         | Notes                                              |
| -------------------------------- | ------------- | -------------------------------------------------- |
| PropertyFinder partner agreement | Business team | Required for XML feed                              |
| Bayut partner agreement          | Business team | Required for XML feed                              |
| ExchangeRate-API key             | DevOps        | For live currency conversion (free tier available) |
| ExcelJS                          | Internal      | `npm install exceljs`                              |
| PDFKit                           | Internal      | `npm install pdfkit @types/pdfkit`                 |
| Redis                            | DevOps        | For response caching (`npm install ioredis`)       |

---

## What Already Exists ✅

| Item                    | Location                                     | Status                           |
| ----------------------- | -------------------------------------------- | -------------------------------- |
| Zoe Executive CRM       | `src/components/crm/ZoeExecutiveCRM_NEW/`    | ✅ UI exists                     |
| Theodora Finance CRM    | `src/components/crm/TheodoraFinanceCRM_NEW/` | ✅ UI exists                     |
| Analytics tab (CRM)     | `src/components/owner/tabs/AnalyticsTab.tsx` | ✅ Recharts charts exist         |
| `/api/finance` routes   | `server/routes/finance.ts`                   | ✅ Exists — verify data returned |
| `/api/reporting` routes | `server/routes/reporting.ts`                 | ✅ Exists                        |
| Cipher Market CRM       | `src/components/crm/CipherMarketCRM.jsx`     | ✅ UI shell exists               |
| Maven Investment CRM    | `src/components/crm/MavenInvestmentCRM.jsx`  | ✅ UI shell exists               |

---

## What Needs To Be Done 🚧

### 7.1 — PropertyFinder & Bayut Portal Syndication

- [ ] Create `server/services/PortalSyncService.ts`
- [ ] XML feed generator: converts `Property` records to PropertyFinder/Bayut XML format
- [ ] `GET /api/portal-feeds/propertyfinder` — serve XML feed (requires partner API key header)
- [ ] `GET /api/portal-feeds/bayut` — serve XML feed
- [ ] Inbound lead webhook: `POST /api/portal-feeds/lead-webhook` — parse incoming lead from portal → auto-create `Lead` record with `source = "propertyfinder"` or `source = "bayut"`
- [ ] Sync status: add `externalPortalIds` JSON field to `Property` model (per-portal listing IDs)
- [ ] Mary Inventory CRM: "Sync to Portals" button per property

---

### 7.2 — PDF & Excel Financial Reports

- [ ] Install libraries: `npm install exceljs pdfkit @types/pdfkit`
- [ ] Create `server/services/ReportService.ts`
- [ ] Commission Detail Report → Excel:
  - Columns: Agent, Property, Sale Price, Commission %, Commission Amount, Date, Status
  - `GET /api/reports/commissions?format=xlsx&from=X&to=Y`
- [ ] Agent Commission Statement → PDF:
  - Company letterhead (White Caves logo, RERA number)
  - Agent details, period summary, transaction list, total
  - `GET /api/reports/agent-statement/:agentId?format=pdf&month=X&year=Y`
- [ ] Monthly P&L Report → PDF:
  - Revenue, expenses, net income breakdown by category
  - `GET /api/reports/pnl?format=pdf&month=X&year=Y`
- [ ] Scheduled delivery: POST `/api/reports/schedule` — email report to managing_director monthly

---

### 7.3 — Multi-Currency Display

- [ ] Install or use free `ExchangeRate-API` (no npm needed — REST call)
- [ ] Create `server/services/CurrencyService.ts` — cache exchange rates (1 hour TTL via in-memory or Redis)
- [ ] `GET /api/currency/rates` — returns current AED conversion rates for USD, EUR, GBP, SAR, INR
- [ ] Frontend `CurrencySelector` component: dropdown in property listings and CRM
- [ ] Store selected currency in Redux: `state.ui.currency`
- [ ] All price displays read from Redux and apply conversion: `price * rates[selectedCurrency]`
- [ ] "Approximate conversion" disclaimer on all converted prices

---

### 7.4 — Redis Response Caching

- [ ] Install: `npm install ioredis`
- [ ] Create `server/services/CacheService.ts` — wrapper around ioredis with TTL helpers
- [ ] Cache heavy list endpoints (30s TTL):
  - `GET /api/properties` (public) — cache by query hash
  - `GET /api/currency/rates` — cache 1 hour
  - `GET /api/finance/summary` — cache 5 minutes
- [ ] Cache invalidation: clear property cache on `POST/PATCH/DELETE /api/properties`
- [ ] If Redis not available (local dev without Redis), fall back gracefully to no-cache

---

### 7.5 — Agent Performance Full Module

- [ ] Monthly target setting: `PATCH /api/agents/:id/targets` — `{ monthlyLeadTarget, monthlySaleTarget, responseTimeTargetMinutes }`
- [ ] Progress tracking: `GET /api/agents/:id/performance` — return leads/sales vs target for current month
- [ ] Response time KPI: track first-response time from lead creation to first agent activity
- [ ] Agent self-service: dedicated agent performance page (read-only for agent role)
- [ ] Sophia Sales CRM: team leaderboard with target completion %

---

### 7.6 — Advanced Analytics Dashboards

- [ ] Wire `AnalyticsTab` to real data: fetch from `/api/finance/summary` and `/api/reporting`
- [ ] Revenue chart: real monthly data from `Commission` and `Transaction` models
- [ ] Lead pipeline funnel: real counts per stage from `Lead` model
- [ ] Property type breakdown: real counts from `Property` model
- [ ] Agent leaderboard: real commission totals from `Commission` model
- [ ] Date range filter: pass `from` + `to` query params to API; persist in Redux
- [ ] Zoe Executive dashboard: executive-level KPIs (monthly revenue, YOY growth, market share)

---

## Definition of Done — Phase 7

- [ ] PropertyFinder XML feed endpoint returns valid feed for all active properties
- [ ] Inbound portal lead webhook creates a `Lead` in Clara automatically
- [ ] Commission Excel report downloads correctly with all columns
- [ ] Agent commission PDF statement has correct data and White Caves letterhead
- [ ] Multi-currency selector converts prices in real time across the app
- [ ] Redis caches property list endpoint (verified by cache hit logs)
- [ ] Analytics tab shows real data from DB (not mock/hardcoded)
- [ ] Tests pass: `npx vitest run`
- [ ] Build passes: `npm run build`

---

## Next Phase After This

Once Phase 7 is complete, move to **[PHASE_8_ARABIC.md](./PHASE_8_ARABIC.md)** — Arabic RTL & Full Internationalisation.
