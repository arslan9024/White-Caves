# Lead Scoring Bot — AI Assistant Definition

<!-- markdownlint-disable MD012 -->

> **Type:** Specialized AI Bot
> **Department:** Sales / AI Engine
> **Color:** #22c55e (Green)
> **Status:** Active (Phase 2A)

---

## Overview

ML-powered lead scoring engine that automatically evaluates and prioritizes leads based on engagement, demographics, behavior, and source quality. Runs as a background service with real-time scoring on lead events and batch re-scoring every 6 hours.

## Requirement catalog

### REQ-SCORE-001: Real-time scoring and batch rescoring

The system shall calculate lead scores on create/update events and periodically rescore active leads.

**Acceptance criteria:**

- [ ] Lead scores update on creation and interaction events
- [ ] Batch rescoring runs on the documented cadence
- [ ] Stale or inactive leads are handled consistently

**Evidence:** scoring run log and score history snapshot.

### REQ-SCORE-002: Score explanation and routing

The system shall expose a score breakdown and route hot leads to qualified agents.

**Acceptance criteria:**

- [ ] Score breakdown includes category contributions
- [ ] Hot leads are routed using the configured assignment policy
- [ ] Manual overrides require a logged justification

**Evidence:** score explanation record and routing audit.

### REQ-SCORE-003: Trend analysis and thresholds

The system shall detect warming and cooling trends and apply configurable thresholds.

**Acceptance criteria:**

- [ ] Trend history is visible over time
- [ ] Threshold changes are versioned
- [ ] Alerting occurs when score movement crosses configured bounds

**Evidence:** trend chart and alert log.

### REQ-SCORE-004: KPI monitoring and model evolution

The system shall report scoring accuracy and support future model upgrades.

**Acceptance criteria:**

- [ ] KPI report shows assignment speed, variance, and conversion lift
- [ ] Data sources are tracked for auditability
- [ ] Model upgrade path remains backward compatible

**Evidence:** KPI dashboard and model governance note.

## Traceability

- Maps to `REQ-LT-003`, `REQ-LT-005`, and agent routing workflows
- Aligns to `WC-SRS-002`, `WC-SRS-009`, and lead scoring evidence artifacts
- Feeds prioritization, auto-routing, and performance analytics

## Capabilities

1. **Real-time lead scoring** — Score calculated on lead creation and every interaction
2. **Score explanation** — Breakdown per category (engagement: 35/40, demographic: 25/30, etc.)
3. **Auto-routing** — Hot leads (80+) assigned to best-performing agents immediately
4. **Score trending** — Track score changes over time, detect warming/cooling patterns
5. **Batch re-scoring** — All active leads re-evaluated every 6 hours via cron
6. **Manual override** — Agents can adjust scores with logged justification

## Data Inputs

- NadiaMessage (WhatsApp interactions)
- Activity (property views, viewing requests, document downloads)
- Lead profile (budget, area preference, buyer type)
- Source tracking (WhatsApp/referral/portal/social/cold)

## Data Outputs

- Lead.score (0-100)
- Lead.scoreBreakdown (JSON: { engagement, demographic, behavioral, source })
- Lead.tier (hot/warm/cold/inactive)
- Clara (Leads CRM): score display and routing
- Sophia (Pipeline): conversion probability

## KPIs

- Scoring accuracy: 85%+ (hot leads convert at 3x cold leads)
- Assignment speed: <1 min for hot leads
- Score consistency: <5 point variance on re-score
- Conversion lift: +25% vs. manual prioritization

## Technical Implementation

- File: server/services/ai/leadScoringEngine.ts
- API: GET /api/leads/:id/score, POST /api/leads/:id/score/override
- Trigger: Prisma middleware on Lead create/update + cron every 6h
- Future: XGBoost ML model when 1000+ conversions collected
<!-- end of lead scoring spec -->
Lead scoring spec status: active.

