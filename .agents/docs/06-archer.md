# 06 — Archer · Lead Scoring Engine

> **ID:** `archer`  
> **Department:** Sales / AI Engine  
> **Title:** ML-Powered Lead Scoring Engine  
> **Color:** `#22C55E` (Green)  
> **Avatar:** 🏹  
> **Phase:** Phase 3 (High Priority)  
> **Status:** 🔲 Planned — code registration required  
> **Access:** All agents (score read-only), Managing Director (model config)

---

## 1. Overview

Archer is the **lead prioritisation brain**. He runs continuously in the background, scoring every lead from 0 to 100 based on four weighted dimensions: engagement behaviour, demographics, interaction history, and acquisition source. His scores are displayed on every lead card in Clara, drive Hunter's outreach decisions, and trigger auto-assignment of the hottest leads to the best available agents.

---

## 2. Core Responsibilities

1. Score every lead on creation (real-time, < 200ms)
2. Re-score all active leads every 6 hours (batch job)
3. Explain each score: breakdown by dimension
4. Auto-route hot leads (score ≥ 80) to agents
5. Detect score trends: warming, cooling, stale
6. Provide model configuration UI for the owner to tune weights

---

## 3. Capabilities

| Capability | Description |
|---|---|
| Real-time scoring | Score on `POST /api/leads` creation, < 200ms |
| Batch re-scoring | Cron every 6 hours — re-evaluate all `status != 'won' and status != 'lost'` leads |
| Score breakdown | Engagement (40%), Demographic (30%), Behaviour (20%), Source (10%) |
| Trend detection | Warming (score +15 in 24h), Cooling (score -15 in 24h), Stale (no change in 7 days) |
| Auto-routing | Score ≥ 80 → assign to top-ranked available agent automatically |
| Model config UI | Owner can adjust weight percentages and threshold values |
| Score history | Chart of score over time per lead |
| Segment reports | Distribution of leads by score bucket (0–20, 21–40, 41–60, 61–80, 81–100) |

---

## 4. How It Works — End to End

### Step 1 — Lead Creation Trigger
`POST /api/leads` succeeds → backend middleware calls `ArrowService.score(lead)` synchronously. Score returned and saved to `lead.score` in the same transaction.

### Step 2 — Scoring Algorithm
```
score = (engagementScore × 0.40)
      + (demographicScore × 0.30)
      + (behaviouralScore × 0.20)
      + (sourceScore × 0.10)
```

**Engagement (0–40):** Number of interactions (calls/emails/viewings): each adds points (call=5, viewing=10, email=3). Capped at 40.

**Demographic (0–30):** Budget in AED:
- < 500K → 5 pts
- 500K–2M → 15 pts
- 2M–5M → 22 pts
- > 5M → 30 pts

**Behavioural (0–20):** Response speed + interaction recency. Responded in < 1 hour → 10 pts. Last contact < 3 days → 10 pts.

**Source (0–10):** Referral → 10. WhatsApp inbound → 8. Bayut/PF → 6. Web form → 4. Manual entry → 2.

### Step 3 — Score Persistence
`lead.score` updated. `lead.scoreBreakdown` JSON saved. `lead.scoredAt` timestamp saved.

### Step 4 — Auto-Routing
If `lead.score >= 80 and lead.assignedToId == null`:
→ `AssignmentService.getBestAgent()` → returns agent with highest close rate + available capacity
→ `lead.assignedToId = agentId`
→ Nadia sends agent a WhatsApp alert: "🔥 Hot lead assigned: [Name], score 85"

### Step 5 — Batch Re-Scoring
`node-cron` fires `0 */6 * * *` → `ArrowService.batchRescore()` → fetches all active leads → re-runs scoring algorithm → updates `lead.score` and `lead.scoreTrend`. Logs re-score count and duration.

### Step 6 — Trend Alerts
After batch: leads with `scoreTrend === 'warming'` appear in Clara's "Hot Rising" filter. Leads with `scoreTrend === 'stale'` appear in "Needs Attention" filter.

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/archer/score` | Score a single lead on demand |
| POST | `/api/archer/batch-rescore` | Trigger batch re-score (admin only) |
| GET | `/api/archer/config` | Get current scoring weights |
| PUT | `/api/archer/config` | Update scoring weights (owner only) |
| GET | `/api/archer/stats` | Score distribution across all active leads |
| GET | `/api/leads/:id/score-history` | Score trend chart data |

---

## 6. Data Flows

- **Receives from:** Clara (new lead events, interaction logs), Hunter (prospect data)
- **Sends to:** Clara (scores + trends), Nadia (hot lead assignment alerts), AssignmentService (agent routing)

---

## 7. Frontend Components

| Component | Path | Status |
|---|---|---|
| Score badge | On every lead card in Clara | 🔲 Planned (wire to score field) |
| Score breakdown popup | Click badge → breakdown modal | 🔲 Planned |
| Score history chart | Lead detail view | 🔲 Planned |
| Model config UI | Owner settings panel | 🔲 Planned |

---

## 8. Backend Services

| Service | Path | Status |
|---|---|---|
| ArrowService | `server/services/ai/ArrowService.ts` | 🔲 Planned |
| Batch rescore cron | `server/jobs/rescoreCron.ts` | 🔲 Planned |
| AssignmentService | `server/services/AssignmentService.ts` | 🔲 Planned |
| Score config model | Prisma `Setting` model (key: `archer_weights`) | 🔲 Planned |

---

## 9. Access Control

| Role | Score Visible | Config Access |
|---|---|---|
| `managing_director` | ✅ All | ✅ Edit weights |
| `sales_manager` | ✅ All | ✅ View only |
| `agent` | Own leads | ❌ |

---

## 10. Implementation Checklist

- [ ] Register `archer` in `AI_ASSISTANTS_REGISTRY`
- [ ] `ArrowService.ts` — real-time scoring algorithm
- [ ] `ArrowService.batchRescore()` — batch cron
- [ ] Score saved to `Lead` model (`score`, `scoreBreakdown`, `scoreTrend`, `scoredAt`)
- [ ] Score badge component in lead cards (Clara)
- [ ] Score history endpoint
- [ ] Scoring weight config UI (owner settings)
- [ ] Auto-routing integration with AssignmentService
- [ ] `node-cron` job (Phase 6 dependency)
- [ ] Tests: `server/services/ArrowService.test.ts`

---

## 11. Dependencies

- `node-cron` (Phase 6) — batch re-scoring job
- Nadia (hot lead alert messages)
- Clara (lead event triggers)
- `Lead` Prisma model (needs `score`, `scoreBreakdown`, `scoreTrend` fields)

---

## 12. Future Enhancements

- ML model trained on historical closed deals (logistic regression)
- Predictive "days to close" estimate per lead
- Score alerts via mobile push notification (Phase 10 PWA)
- A/B test different scoring weight configurations
