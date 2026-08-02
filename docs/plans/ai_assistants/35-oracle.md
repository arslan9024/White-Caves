# 35 — Oracle · Market Analyst Bot

> **ID:** `oracle`  
> **Department:** Intelligence / Executive  
> **Title:** Real-Time Market Intelligence Dashboard  
> **Color:** `#7C3AED` (Purple)  
> **Avatar:** 🔭  
> **Phase:** Phase 7 (Planned)  
> **Status:** 🔲 Planned — to be registered in code  
> **Access:** Managing Director, Investment Manager, All Agents (read-only)

---

## 1. Overview

Oracle is the **real-time market intelligence dashboard** — the presentation layer for Cipher's deep analytics. While Cipher computes and models, Oracle presents the results in a beautiful, real-time dashboard with live price feeds, comparable analysis, area demand heatmaps, and the agent's "pricing assistant" that tells them exactly what to recommend for any property. Oracle is what agents open before every client meeting to get their market briefing.

---

## 2. Core Responsibilities

1. Display real-time market data powered by Cipher's analysis
2. Provide agents with a property pricing assistant before client meetings
3. Show demand heatmaps on the DubaiMap component
4. Comparable property analysis: "What are similar properties selling for?"
5. Area briefing cards: 3-minute read per area with key stats
6. Live DLD transaction ticker: recent sales in real time

---

## 3. Capabilities

| Capability | Description |
|---|---|
| Live price feed | Most recent DLD transactions for any area — updated daily |
| Area briefing card | One-page summary: avg price, yield, demand score, recent trend, new supply |
| Pricing assistant | Input a property → Oracle returns: recommended list price, price range, comparable sales |
| Demand heatmap | Map coloured by demand index (Cipher's demand score per area) |
| Comparable analysis | 5 most similar recent transactions: area, size, price, date |
| Investment ranking | Current top 10 areas by investment score (Cipher data) |
| Transaction ticker | Live stream of today's DLD transactions as they appear |
| Price calculator | Client asks "what is my property worth?" → Oracle gives an instant estimate |
| Market briefing email | Weekly email to all agents: top market movements, investment picks |

---

## 4. How It Works — End to End

### Step 1 — Agent Opens Oracle
Agent navigates to Oracle tab in CRM → default view: demand heatmap + top 5 investment areas + today's transaction ticker.

### Step 2 — Area Briefing
Agent clicks on "Dubai Marina" → `GET /api/oracle/area/dubai-marina` → returns Cipher's cached area data: median price per sqft, yield, demand score, 12-month trend, comparable recent sales, current new supply.

### Step 3 — Pricing a Property
Agent enters: area, type, size, bedrooms, floor, view → `POST /api/oracle/price { area, type, bedrooms, sqft, floor, view }`:
- Cipher finds comparable transactions (same area, ±1 bed, ±20% size, last 6 months)
- Computes: median price per sqft of comparables × property sqft = estimate
- Adjusts: high floor (+5%), sea view (+8%), dated finishes (-5%)
- Returns: `{ estimate: 2250000, range: [2100000, 2400000], comparables: [...] }`

### Step 4 — Demand Heatmap
`GET /api/oracle/heatmap` → returns array of `{ area, lat, lng, demandScore }`. Frontend DubaiMap renders heat overlay layer using Leaflet heat plugin.

### Step 5 — Transaction Ticker
Real-time ticker component polls `GET /api/oracle/transactions/latest?limit=10&since=lastId` every 60 seconds. New transactions animate in at the top of the feed.

### Step 6 — Weekly Briefing
Monday 07:00 cron: `OracleService.generateWeeklyBriefing()` → top 3 area movers, biggest deals this week, investment pick of the week → email to all agents via `POST /api/email/send-bulk`. Also posted on CRM home page as a card.

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/oracle/area/:slug` | Area briefing data |
| POST | `/api/oracle/price` | Property price estimate |
| GET | `/api/oracle/heatmap` | Demand heatmap data |
| GET | `/api/oracle/transactions/latest` | Latest DLD transactions |
| GET | `/api/oracle/investment-ranking` | Top areas by investment score |
| GET | `/api/oracle/briefing/weekly` | Weekly market briefing |
| GET | `/api/oracle/comparable/:propertyId` | Comparable sales for a property |

---

## 6. Data Flows

- **Receives from:** Cipher (all market analytics, area scores, transaction data), DLD feed
- **Sends to:** All agents (read-only dashboard), Maven (investment data), Prism (pricing for matching), Olivia (area briefing for campaign targeting)

---

## 7. Frontend Components

| Component | Path | Status |
|---|---|---|
| Oracle dashboard | `src/components/owner/ai/OracleCRM/` | 🔲 Planned |
| Area briefing card | Inside dashboard | 🔲 Planned |
| Pricing assistant panel | Modal or sidebar | 🔲 Planned |
| Demand heatmap | `src/components/DubaiMap/` (extend) | ✅ DubaiMap exists — needs heat layer |
| Transaction ticker | Animated list component | 🔲 Planned |

---

## 8. Backend Services

| Service | Path | Status |
|---|---|---|
| OracleService | `server/services/OracleService.ts` | 🔲 Planned |
| Oracle routes | `server/routes/oracle.ts` | 🔲 Planned |
| Weekly briefing cron | `server/jobs/weeklyBriefingJob.ts` | 🔲 Planned |

---

## 9. Access Control

| Role | Access |
|---|---|
| All authenticated users | Read-only market data |
| `managing_director` | Full + briefing configuration |
| Public | Area briefing cards only (SEO pages) |

---

## 10. Implementation Checklist

- [ ] Register `oracle` in `AI_ASSISTANTS_REGISTRY`
- [ ] Area briefing endpoint (read from Cipher data)
- [ ] Property pricing assistant endpoint
- [ ] Demand heatmap endpoint + DubaiMap heat layer
- [ ] Transaction ticker (live or daily refresh)
- [ ] Comparable analysis algorithm
- [ ] Weekly briefing email cron
- [ ] Oracle CRM dashboard component

---

## 11. Dependencies

- Cipher (must be implemented first as data source)
- DubaiMap component (extend with heat layer — Leaflet.heat)
- Email service (weekly briefing)

---

## 12. Future Enhancements

- Natural language market query: "What's the best 2-bed under 1.5M in JVC right now?"
- Price negotiation insights: "Properties in this area sell 3% below asking on average"
- Off-plan vs ready market comparison
- International buyer demand signals
