# 03 — Sophia · Sales Pipeline Manager

> **ID:** `sophia`  
> **Department:** Sales  
> **Title:** Sales Pipeline Manager  
> **Color:** `#8B5CF6` (Violet)  
> **Avatar:** 👩‍💻  
> **Phase:** Phase 3 (Active)  
> **Status:** ✅ In Code — `src/components/owner/ai/SophiaSalesCRM_NEW/`  
> **Access:** Managing Director, Sales Manager, Agent (own deals only)

---

## 1. Overview

Sophia manages the **deal pipeline** — the stage after Clara hands off a qualified lead. She tracks every active deal from first offer to signed contract, manages agent targets, forecasts revenue, and calculates commissions. She is the sales director's operating console.

---

## 2. Core Responsibilities

1. Track all active deals: property, buyer, agent, status, deal value
2. Manage agent monthly targets and progress vs target
3. Produce revenue forecasts (weighted pipeline, best case, committed)
4. Calculate and display commission splits per deal
5. Coordinate with Theodora on commission approval and payout
6. Generate monthly sales performance reports

---

## 3. Capabilities

| Capability | Description |
|---|---|
| Deal board | Stage-based board: Offer Made → Under Offer → SPA Signed → Closed |
| Revenue forecast | Weighted pipeline: Σ(deal_value × stage_probability) |
| Agent targets | Set monthly targets per agent; progress bar per agent |
| Commission calc | Auto-calc: Sales 2%, Rental 5%, Referral configurable % |
| Leaderboard | Top agents ranked by deals closed and revenue generated |
| Deal detail | Full deal timeline: offer, counter-offer, SPA, deposit, completion |
| Pipeline analytics | Avg deal size, avg cycle time, win rate by agent |
| Forecast export | PDF/Excel monthly forecast for MD review |

---

## 4. How It Works — End to End

### Step 1 — Deal Intake
Clara marks a lead as `won` → backend fires `POST /api/deals` via internal service → deal created in Sophia's pipeline with `status: 'offer_made'` and linked `leadId`, `propertyId`, `agentId`.

### Step 2 — Stage Progression
Agent updates deal stage via Sophia's deal board → `PATCH /api/deals/:id { status: 'under_offer' }`. Backend validates stage sequence. Each stage change timestamped.

### Step 3 — Offer Management
Agent logs offers and counter-offers → `POST /api/deals/:id/offers { amount, date, party }`. System tracks negotiation history.

### Step 4 — SPA / Contract
Deal reaches `spa_signed` → Evangeline is notified to review contract → Laila runs KYC check on buyer. Once both approve, status advances to `completion`.

### Step 5 — Commission Calculation
On `deal.status = 'completed'`: backend calls `CommissionService.calculate(deal)` → creates a `Commission` record for the agent. Sent to Theodora for approval.

### Step 6 — Target Tracking
`GET /api/agents/:id/targets` returns current month target and progress. Sophia's UI shows progress bars and Zoe's dashboard shows the team leaderboard.

### Step 7 — Forecasting
`GET /api/deals/forecast` computes: committed (≥ 80% probability stages) + best case (all active) + weighted (stage × probability weights). Rendered as grouped bar chart.

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/deals` | List all deals (filter by status, agent, date) |
| POST | `/api/deals` | Create deal (triggered by Clara on lead won) |
| PATCH | `/api/deals/:id` | Update deal stage, notes, value |
| POST | `/api/deals/:id/offers` | Log offer or counter-offer |
| GET | `/api/deals/forecast` | Revenue forecast breakdown |
| GET | `/api/agents/:id/targets` | Agent monthly target + progress |
| PUT | `/api/agents/:id/targets` | Set agent monthly target (owner only) |

---

## 6. Data Flows

- **Receives from:** Clara (won leads → new deals), Laila (KYC status), Evangeline (contract approval)
- **Sends to:** Theodora (commission records), Zoe (revenue KPIs), Mary (property status update to `under_offer`)

---

## 7. Frontend Components

| Component | Path | Status |
|---|---|---|
| `SophiaSalesCRM_NEW` | `src/components/owner/ai/SophiaSalesCRM_NEW/` | ✅ Exists |
| Agent leaderboard | Inside `SophiaSalesCRM_NEW` | ✅ Exists (mock) |
| Pipeline board | Inside `SophiaSalesCRM_NEW` | ✅ Exists (mock) |

---

## 8. Backend Services

| Service | Path | Status |
|---|---|---|
| Transactions/Deals | `server/routes/transactions.ts` | ✅ Exists |
| Commission calc | `server/services/CommissionService.ts` | 🔲 Planned |
| Target tracking | `server/routes/agents.ts` | 🔲 Planned (targets endpoint) |
| Forecast engine | `server/services/ForecastService.ts` | 🔲 Planned |

---

## 9. Access Control

| Role | Can View | Can Create | Can Edit | Can Export |
|---|---|---|---|---|
| `managing_director` | All deals | ✅ | ✅ | ✅ |
| `sales_manager` | All deals | ✅ | ✅ | ✅ |
| `agent` | Own deals | ✅ | Own only | Own only |

---

## 10. Implementation Checklist

- [x] `SophiaSalesCRM_NEW` renders (mock data)
- [x] Transactions backend (`server/routes/transactions.ts`)
- [ ] Wire pipeline board to live `/api/deals`
- [ ] Commission calculation service
- [ ] Agent targets endpoint
- [ ] Revenue forecast endpoint
- [ ] Deal offer log endpoint
- [ ] E2E test: `e2e/deal-pipeline.spec.ts`

---

## 11. Dependencies

- Clara (deal creation trigger on lead won)
- Theodora (commission approval)
- Laila (KYC gate before deal completion)
- Recharts (forecast charts)

---

## 12. Future Enhancements

- AI-predicted close date per deal based on historical velocity
- Automated SPA generation trigger (Quill)
- WhatsApp notifications to agents on deal stage changes (Nadia)
- Rolling 12-month pipeline forecast
