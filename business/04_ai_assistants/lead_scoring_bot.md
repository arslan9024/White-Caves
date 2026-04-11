# AI Assistant: Lead Scoring Bot (Archer)

> **ID:** `archer`
> **Department:** Sales / Analytics
> **Category:** AI-Powered Lead Intelligence
> **Status:** Proposed (Phase 2 Research Implementation)
> **Created:** April 11, 2026

---

## 1. Overview

Archer is an AI-powered lead scoring assistant that automatically evaluates and ranks incoming leads based on behavioral signals, demographic data, property preferences, and engagement history. Archer integrates with the existing CRM pipeline (Sophia, Clara, Nadia) to prioritize high-intent prospects and optimize agent time allocation.

---

## 2. Capabilities

### 2.1 Multi-Signal Lead Scoring

| Signal Category | Signals Tracked | Weight |
|----------------|-----------------|--------|
| **Behavioral** | Page views, property saves, search frequency, return visits | 35% |
| **Engagement** | WhatsApp responses, email opens, viewing requests, time on site | 25% |
| **Demographic** | Budget range, investor vs. end-user, nationality, residency status | 20% |
| **Intent** | Urgency keywords, mortgage pre-approval, document uploads | 15% |
| **Source Quality** | Referral, organic, paid ad, portal, social media | 5% |

### 2.2 Scoring Model

```
Lead Score = Σ (signal_weight × signal_value) × decay_factor(time_since_last_activity)

Score Ranges:
  90-100: 🔥 Hot Lead    — Assign to senior agent immediately
  70-89:  🟡 Warm Lead   — Schedule follow-up within 24 hours
  40-69:  🟠 Nurturing   — Add to drip campaign
  0-39:   🔵 Cold Lead   — Monthly check-in via automation
```

### 2.3 Real-Time Scoring Pipeline

1. **Event Ingestion** — Track user actions via frontend events + WhatsApp interactions
2. **Feature Extraction** — Transform raw events into scoring features
3. **Model Inference** — Apply scoring model (initially rule-based, then ML)
4. **Score Update** — Update lead score in real-time in MongoDB
5. **Alert Dispatch** — Notify assigned agent via WebSocket + WhatsApp if score crosses threshold

### 2.4 Agent Notifications

| Trigger | Action | Channel |
|---------|--------|---------|
| Score crosses 90 | Instant alert to assigned agent | WhatsApp (Nadia) + Push |
| Score crosses 70 | Priority queue notification | CRM dashboard + Email |
| Score drops below 40 | Move to nurturing sequence | Automated drip |
| New lead from premium source | Fast-track scoring | Immediate CRM entry |

---

## 3. Technical Architecture

### 3.1 Data Flow

```
User Actions → Event Queue (Redis) → Feature Extractor → Scoring Engine → MongoDB
                                                                        ↓
                                                           WebSocket Notification → Agent
                                                           WhatsApp via Nadia → Agent
```

### 3.2 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/leads/:id/score` | Get current lead score with breakdown |
| `GET` | `/api/leads/scores/top` | Get top-scored leads (agent dashboard) |
| `POST` | `/api/leads/:id/score/recalculate` | Force score recalculation |
| `GET` | `/api/leads/scores/analytics` | Score distribution and trends |
| `PUT` | `/api/leads/scoring/config` | Update scoring weights (admin) |

### 3.3 Database Schema Addition

```prisma
model LeadScore {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  leadId      String   @unique @db.ObjectId
  lead        Lead     @relation(fields: [leadId], references: [id])
  score       Int      @default(0)
  category    String   @default("cold") // hot, warm, nurturing, cold
  signals     Json     // { behavioral: 35, engagement: 20, ... }
  history     Json[]   // [{ score: 85, date: "2026-04-10", reason: "..." }]
  lastUpdated DateTime @updatedAt
  createdAt   DateTime @default(now())

  @@index([score, category])
  @@index([lastUpdated])
}
```

---

## 4. Integration Points

| System | Integration | Direction |
|--------|-------------|-----------|
| **Clara (Leads CRM)** | Score displayed on lead cards, filters by score range | Read |
| **Sophia (Sales)** | Priority queue based on score | Read |
| **Nadia (WhatsApp)** | Engagement signals from conversations | Write → Archer |
| **Olivia (Marketing)** | Campaign assignment based on score category | Read |
| **Maven (Analytics)** | Score distribution dashboards, conversion correlation | Read |
| **Hunter (Lead Gen)** | Source quality feedback loop | Bidirectional |

---

## 5. ML Model Roadmap

### Phase 1: Rule-Based (Q2 2026)
- Weighted scoring with configurable rules
- Admin UI for weight adjustment
- Historical score tracking

### Phase 2: Gradient Boosting (Q3 2026)
- Train on historical conversion data
- Features: all signals + property match score
- XGBoost or LightGBM model
- A/B test vs. rule-based

### Phase 3: Deep Learning (Q4 2026)
- Sequence model for engagement patterns
- NLP on WhatsApp conversations for intent detection
- Continuous learning with feedback loop

---

## 6. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Lead-to-client conversion rate | +30% improvement | Before/after A/B test |
| Agent response time (hot leads) | <5 minutes | Time from score alert to first contact |
| Time wasted on cold leads | -50% reduction | Agent time tracking |
| Score accuracy (precision@10) | >80% | Top-10 scored leads that convert |

---

## Sources

- [AI Lead Scoring Best Practices](https://www.orris.ai/blog/ai-automation-for-real-estate-practical-guide)
- [Real Estate AI Labs](https://www.realestateailabs.com/)
- [Saleswise AI Lead Scoring](https://www.saleswise.ai/blog/ai-tools-for-real-estate-agents)
