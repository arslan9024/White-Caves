# Lead Scoring Bot — AI Assistant Definition

> **Type:** Specialized AI Bot
> **Department:** Sales / AI Engine
> **Color:** #22c55e (Green)
> **Status:** Planned (Phase 2A)

---

## Overview

ML-powered lead scoring engine that automatically evaluates and prioritizes leads based on engagement, demographics, behavior, and source quality. Runs as a background service with real-time scoring on lead events and batch re-scoring every 6 hours.

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
