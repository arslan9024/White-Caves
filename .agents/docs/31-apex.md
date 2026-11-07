# 31 — Apex · Agent Performance Coach

> **ID:** `apex`  
> **Department:** Marketing / Sales  
> **Title:** Agent Performance Coach & Training Manager  
> **Color:** `#F59E0B` (Yellow)  
> **Avatar:** 🏆  
> **Phase:** Phase 9 (Planned)  
> **Status:** 🔲 Planned — to be registered in code  
> **Access:** Managing Director, Sales Manager, Agent (own metrics only)

---

## 1. Overview

Apex is the **performance coaching engine** for the White Caves sales team. He analyses each agent's activity patterns, conversion rates, and deal velocity to identify strengths and gaps, then delivers personalised coaching recommendations. Apex also manages the training programme, tracking certifications, RERA exam readiness, and product knowledge assessments. He gamifies performance with leaderboards, achievement badges, and milestone rewards.

---

## 2. Core Responsibilities

1. Track agent KPIs: calls made, viewings completed, deals closed, conversion rates
2. Compare agent performance against team benchmarks
3. Identify individual performance gaps: low response rate, slow follow-up, poor qualification
4. Deliver personalised coaching cards: "Your viewing-to-offer conversion is 18% vs team average 32%"
5. Manage training modules: product knowledge, sales scripts, RERA requirements
6. Gamification: leaderboard, streaks, badges, quarterly champions

---

## 3. Capabilities

| Capability | Description |
|---|---|
| KPI dashboard | Per-agent: leads assigned, contacts made, viewings, offers, deals, commissions |
| Benchmark comparison | Individual vs team average vs top performer on every metric |
| Gap analysis | Automatic detection: "You close 40% fewer deals in off-plan vs ready" |
| Coaching recommendations | Personalised weekly coaching card: 3 specific improvement actions |
| Training modules | 12 video modules + quiz: Dubai RE law, off-plan sales, luxury client handling |
| Certification tracker | RERA exam prep: mock tests, study materials, exam date tracking |
| Achievement badges | 20 badges: First Deal, 10 Deals, Top Caller, Speed Responder, etc. |
| Leaderboard | Monthly: top 3 agents by deals and revenue; displayed on CRM homepage |
| Performance reports | Manager view: full team performance report, recommended actions |
| Coaching sessions | Log 1:1 coaching session notes and follow-up actions |

---

## 4. How It Works — End to End

### Step 1 — Data Aggregation
`ApexService.aggregateAgentMetrics(agentId, period)`:
- Leads assigned: `COUNT(leads WHERE assignedTo = agentId AND createdAt BETWEEN dates)`
- Contacts made: `COUNT(communication_events WHERE agentId AND channel IN ['call','whatsapp'])`
- Viewings: `COUNT(viewings WHERE agentId)`
- Deals closed: `COUNT(deals WHERE agentId AND status = 'completed')`

### Step 2 — Benchmark Calculation
`ApexService.getTeamBenchmarks(period)` → median values across all agents. Benchmarks stored daily via cron.

### Step 3 — Gap Detection
For each metric: compare agent value vs benchmark. If agent value < 70% of benchmark → flag as "gap". Gaps categorised by severity: red (< 50%), amber (50–70%), green (≥ 70%).

### Step 4 — Coaching Card Generation
Weekly (Monday 08:00): `ApexService.generateCoachingCard(agentId)` → identifies top 3 gaps → maps to coaching recommendations from pre-built library:
- "Low contact rate" → "Set a daily goal of 20 calls. Use the calling script in Training Module 3."
- "Slow follow-up" → "Enable Nadia follow-up automation. Review leads with no contact in 24h."
Coaching card delivered via Nadia WhatsApp and shown in agent dashboard.

### Step 5 — Training Module Completion
Agent watches video → completes quiz (pass = 80%) → `PATCH /api/training/:moduleId/complete { agentId }`. Badge awarded if module is part of a certification track.

### Step 6 — Leaderboard Update
Real-time: whenever a deal closes → Apex recalculates leaderboard positions. Leaderboard displayed on CRM home page as a widget.

### Step 7 — Manager View
Sales Manager opens Apex for team view → sees all agents' performance tiles → clicks agent → deep dive: 30-day activity chart, gap report, coaching history.

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/apex/metrics/:agentId` | Get agent performance metrics |
| GET | `/api/apex/benchmarks` | Get team benchmark values |
| GET | `/api/apex/gaps/:agentId` | Get identified performance gaps |
| GET | `/api/apex/coaching-card/:agentId` | Get weekly coaching card |
| GET | `/api/apex/training` | List training modules |
| PATCH | `/api/apex/training/:id/complete` | Mark module as completed |
| GET | `/api/apex/leaderboard` | Current leaderboard |
| GET | `/api/apex/badges/:agentId` | Agent badges |

---

## 6. Data Flows

- **Receives from:** Clara (lead assignments), Sophia (deal completions), Echo (communication activity), Daisy (viewing logs)
- **Sends to:** Nadia (weekly coaching card delivery), Zoe (team leaderboard KPI), Sales manager (performance reports)

---

## 7. Frontend Components

| Component | Path | Status |
|---|---|---|
| Apex CRM dashboard | `src/components/owner/ai/ApexCRM/` | 🔲 Planned |
| Agent performance tile | Manager team view | 🔲 Planned |
| Coaching card widget | Agent dashboard | 🔲 Planned |
| Leaderboard widget | CRM homepage | 🔲 Planned |
| Training module player | `src/pages/crm/TrainingPage.tsx` | 🔲 Planned |

---

## 8. Backend Services

| Service | Path | Status |
|---|---|---|
| ApexService | `server/services/ApexService.ts` | 🔲 Planned |
| Benchmark cron | `server/jobs/benchmarkJob.ts` | 🔲 Planned |
| Coaching card cron | `server/jobs/coachingCardJob.ts` | 🔲 Planned |
| Training modules | `server/routes/training.ts` | 🔲 Planned |

---

## 9. Access Control

| Role | Access |
|---|---|
| `managing_director` | All agents' metrics |
| `sales_manager` | Team metrics |
| `agent` | Own metrics only |

---

## 10. Implementation Checklist

- [ ] Register `apex` in `AI_ASSISTANTS_REGISTRY`
- [ ] AgentMetrics aggregation service
- [ ] Benchmark calculation + daily cron
- [ ] Gap detection algorithm
- [ ] Coaching recommendation library (static JSON initially)
- [ ] Weekly coaching card cron + Nadia delivery
- [ ] Training module model + video player
- [ ] Badge system (20 badge definitions)
- [ ] Leaderboard endpoint + widget
- [ ] Tests

---

## 11. Dependencies

- `node-cron` (weekly coaching card, daily benchmarks)
- Nadia (coaching card delivery via WhatsApp)
- Echo (communication activity data)
- Clara, Sophia (performance data sources)

---

## 12. Future Enhancements

- AI-generated personalised coaching scripts (GPT-4 with agent's specific metrics)
- Video role-play practice (record pitch → AI rates delivery)
- Team challenge mode (agents compete on a specific metric for 2 weeks)
- Integration with Zoom for virtual coaching sessions
