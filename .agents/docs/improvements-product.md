# 📊 Business & Product Improvements

> **Phase assignments**: Phases 3, 5, 7  
> **Parent backlog**: [IMPROVEMENTS_BACKLOG.md](./IMPROVEMENTS_BACKLOG.md)  
> **Priority**: Medium — these features differentiate the platform and drive revenue

---

## Item 34 — Lead Scoring Not Auto-Triggered

**Phase**: Phase 3  
**Files**: `server/services/LeadScoringService.ts` (or equivalent), `prisma/schema.prisma` (Lead.score, Lead.scoreTier, LeadScoreHistory)

### Problem
The `Lead` model has `score`, `scoreTier`, `scoreBreakdown`, and `lastScoredAt` fields plus a full `LeadScoreHistory` model. However, scoring logic is never called automatically. Scores only update when explicitly triggered, meaning most leads have the default score of 0.

### What Needs Doing
- [ ] Create `server/services/LeadScoringService.ts` if not already complete:
  - `scoreOneLead(leadId)` — calculates score (0–100) from engagement, demographics, behavior, source
  - `batchScoreAllLeads()` — loops all leads and calls `scoreOneLead()`
- [ ] Wire auto-scoring to lead mutation events in route handlers:
  - After `POST /api/leads` (new lead created) → `LeadScoringService.scoreOneLead(lead.id)`
  - After `PATCH /api/leads/:id` (status/notes updated) → `LeadScoringService.scoreOneLead(id)`
  - After a viewing is created for a lead → rescore
  - After a WhatsApp message is received for a lead → rescore (Phase 4)
- [ ] Every score calculation creates a `LeadScoreHistory` record with `previousScore`, `trigger` field
- [ ] Add a `POST /api/leads/:id/rescore` endpoint for manual override by managing_director
- [ ] Connect `scoreTier` display in the CRM Leads table (badge: 🔥 Hot / 🌡️ Warm / ❄️ Cold)
- [ ] Add lead score visualization in `OverviewTab.tsx` — donut chart: Hot/Warm/Cold distribution

### Acceptance Criteria
- Creating a new lead immediately sets an initial score (not 0)
- Updating a lead's status triggers a rescore within 1 second
- `LeadScoreHistory` shows a record for every score change
- Managing director can manually override a lead's score tier

---

## Item 35 — Mortgage Calculator — Frontend Math Only

**Phase**: Phase 5  
**Files**: `src/components/property/RentVsBuyCalculator.tsx` (or equivalent)

### Problem
The mortgage calculator component does all math in JavaScript on the frontend with hardcoded interest rates. UAE mortgages are EIBOR-linked (floating) and rates change daily. The calculator gives inaccurate results and there is no API for real-time rates.

### What Needs Doing
- [ ] Create `server/routes/calculator.ts` with:
  - `GET /api/calculator/mortgage?price={price}&downPayment={pct}&termYears={years}` — returns monthly payment, total cost, total interest
  - `GET /api/calculator/rent-vs-buy?rent={monthly}&price={price}&years={years}` — returns break-even analysis
  - `GET /api/calculator/rates` — returns current UAE mortgage rates (EIBOR + bank spread)
- [ ] Integrate a UAE mortgage rates data source:
  - Option A: Central Bank of UAE public API (EIBOR rates)
  - Option B: Manual admin update via CRM Settings → Financial Rates (if no public API is available)
- [ ] Cache rates for 24 hours (stale rates are acceptable — daily update is sufficient)
- [ ] Backend calculation prevents frontend tampering and ensures consistent, accurate results
- [ ] Add `Disclaimer: "Calculations are indicative only. Consult a licensed mortgage advisor."` to the UI
- [ ] Store calculation inputs/results anonymously for analytics (no PII)

### Acceptance Criteria
- `GET /api/calculator/mortgage?price=2000000&downPayment=20&termYears=25` returns a JSON response with monthly payment in AED
- Rates are sourced from a real external source, not hardcoded
- Calculator component fetches rates from `/api/calculator/rates` on mount
- Disclaimer text is visible on the calculator UI

---

## Item 36 — No Calendar Integration for Viewings

**Phase**: Phase 5  
**Current state**: `ics` package is installed and can generate `.ics` files. But there is no Google Calendar or Outlook integration. Agents must manually enter viewings into their calendar after booking through the CRM.

### What Needs Doing
- [ ] When a viewing is confirmed (`POST /api/viewings`):
  - Auto-generate a `.ics` file using the existing `ics` package
  - Attach the `.ics` to the confirmation email sent to agent and lead (requires Item 8)
- [ ] Add Google Calendar OAuth flow:
  - Install `googleapis` package: `npm install googleapis`
  - `GET /api/integrations/google-calendar/connect` — OAuth redirect
  - `GET /api/integrations/google-calendar/callback` — store OAuth tokens in `Integration` Prisma model
  - `POST /api/integrations/google-calendar/sync-viewing/:id` — create calendar event for agent
- [ ] Add a "Sync to Calendar" button on the viewing confirmation screen in the CRM
- [ ] Add Microsoft Outlook integration (same OAuth pattern) as Phase 5+ follow-up
- [ ] Store integration tokens encrypted in the `Integration` model (never in plain text)

### Acceptance Criteria
- Agent confirms a viewing → receives calendar invite via email (`.ics` attachment)
- Agent clicks "Sync to Google Calendar" → viewing appears in their Google Calendar within 30 seconds
- OAuth tokens stored with encryption — not retrievable in plain text from the DB

---

## Item 37 — No Audit Log UI in CRM

**Phase**: Phase 3  
**Current state**: The `Activity` model logs all CRM changes (who did what, when). This data is captured but never surfaced to the managing_director. There is no way to review who changed a lead status, who deleted a property, or who exported client data.

### What Needs Doing
- [ ] Create `AuditLogTab.tsx` in `src/components/owner/tabs/` (same pattern as `LeadsTab.tsx`)
- [ ] Add "Audit Log" to the managing_director tab list in `src/config/ROLE_TAB_MAPPING.ts`
- [ ] `GET /api/activities?limit=50&offset=0&type=&userId=&dateFrom=&dateTo=` — paginated activity feed
- [ ] Audit log table columns: `Timestamp | User | Action | Resource | Details`
- [ ] Filters: by user, by resource type (lead, property, agent, user, system), by date range
- [ ] Highlight security-relevant events (login, export, delete, role change) in red/amber
- [ ] Export audit log to CSV (use the report generation pipeline from Item 7)
- [ ] Audit log entries are **append-only** — no endpoint allows deletion of activity records

### Acceptance Criteria
- Managing director opens "Audit Log" tab → sees last 50 system events with filters
- Filtering by user shows all actions taken by that agent in the selected period
- Clicking "Export CSV" downloads all filtered activities as a spreadsheet
- No route exists that allows deleting Activity records (verified by security test)

---

## Item 38 — Multi-Currency Display — No Live Exchange Rates

**Phase**: Phase 7  
**Current state**: Property prices are stored in AED with `currency` field. The `budgetCurrency` field on Leads accepts AED, USD, EUR, GBP, INR. The frontend shows prices only in AED. International buyers have no way to see prices in their currency.

### What Needs Doing
- [ ] Integrate free exchange rate API:
  - Option A: `https://open.er-api.com/v6/latest/AED` (free tier: 1500 req/month)
  - Option B: `https://api.exchangerate-api.com/v4/latest/AED`
- [ ] Create `server/services/ExchangeRateService.ts`:
  - `getRates()` — fetch and cache rates for 24 hours in Redis (Item 19)
  - Returns: `{ AED: 1, USD: 0.272, EUR: 0.250, GBP: 0.214, INR: 22.6, SAR: 1.02 }`
- [ ] `GET /api/calculator/exchange-rates` — returns current rates (cached)
- [ ] Add `CurrencySelector` dropdown component (AED / USD / EUR / GBP / SAR / INR) to:
  - Property listing page header
  - Property detail page price display
  - Homepage featured properties section
- [ ] All price displays re-render using the selected currency with the `~` (approximate) prefix
- [ ] Add disclaimer: "Prices shown in {currency} are indicative. Transactions are completed in AED."
- [ ] Rates refresh automatically every 24 hours via the cron scheduler (Item 6)

### Acceptance Criteria
- User selects "USD" from currency dropdown → all property prices update to USD without page reload
- `GET /api/calculator/exchange-rates` returns rates with a `lastUpdated` timestamp
- Currency preference is saved in `localStorage` and remembered across sessions
- Disclaimer appears whenever a non-AED currency is selected
