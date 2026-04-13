# Lead Scoring Bot — AI Assistant Profile

> **Assistant Name**: Lex  
> **Category**: Sales Intelligence  
> **Created**: April 14, 2026  
> **Status**: Planned (Phase 1)

---

## Overview
Lex is an autonomous AI lead scoring assistant that evaluates and ranks leads based on behavioral signals, property interactions, and communication patterns. Lex replaces manual lead scoring with a real-time, weighted algorithm integrated into the CRM pipeline.

---

## Personality & Communication Style
- **Tone**: Analytical, concise, data-driven
- **Voice**: Professional, advisory — "Based on behavioral signals, this lead scores 87/100 with high purchase intent."
- **Response Format**: Structured scores with explanation — always shows WHY a score was assigned
- **Emoji Usage**: Minimal — uses 📊 🎯 ⬆️ ⬇️ for visual indicators only

---

## Core Capabilities

### 1. Behavioral Scoring (0-100)
| Factor | Weight | Data Source | Score Range |
|--------|--------|------------|-------------|
| Property views | 15% | Page view events | 0-15 |
| Saved properties | 10% | User favorites | 0-10 |
| Time on listings | 10% | Session duration | 0-10 |
| Inquiry submitted | 20% | Contact form / WhatsApp | 0-20 |
| Return visits | 10% | Session count | 0-10 |
| Budget alignment | 15% | Searched price vs property price | 0-15 |
| WhatsApp engagement | 10% | Message count + response time | 0-10 |
| Referral source | 10% | UTM params / direct / organic | 0-10 |

### 2. Lead Classification
| Score Range | Label | Color | Action |
|------------|-------|-------|--------|
| 80-100 | 🔥 Hot | `red` | Immediate call within 5 min |
| 60-79 | 🟠 Warm | `orange` | Contact within 1 hour |
| 40-59 | 🟡 Interested | `yellow` | Nurture sequence (email/WhatsApp) |
| 20-39 | 🔵 Cool | `blue` | Add to drip campaign |
| 0-19 | ⚪ Cold | `gray` | Archive after 30 days |

### 3. Score Decay
- Scores decay by **2 points per day** of inactivity
- Maximum decay: -30 points (floor at original score minus 30)
- Any new activity resets the decay timer
- WhatsApp conversation resets score to last active score

### 4. Alerts & Notifications
- Auto-notify assigned agent when lead crosses threshold (e.g., Cool → Warm)
- Daily digest email: "5 leads heated up, 3 went cold"
- WhatsApp alert to team lead for Hot leads (score ≥ 80)

---

## Integration Points

### Prisma Schema Extension
```prisma
model Lead {
  // Existing fields...
  score           Int       @default(0) // 0-100
  scoreFactors    Json?     // { views: 12, inquiries: 20, ... }
  scoreUpdatedAt  DateTime?
  classification  String?   // hot, warm, interested, cool, cold
}
```

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leads/:id/score` | Get current lead score with breakdown |
| POST | `/api/leads/:id/score/recalculate` | Force recalculation |
| GET | `/api/leads/scores/dashboard` | Aggregated scoring dashboard |
| GET | `/api/leads/scores/changes` | Recent score changes (alerts feed) |

### Redux Integration
```typescript
// New slice: leadScoringSlice
interface LeadScoringState {
  scores: Record<string, LeadScore>;
  alerts: ScoreAlert[];
  dashboard: ScoreDashboard | null;
}
```

---

## Implementation Phases

### Phase 1 (MVP): Weighted Algorithm
- 8 scoring factors with configurable weights
- Real-time calculation on lead activity events
- Dashboard widget showing score distribution
- **Effort**: 20 hours

### Phase 2: ML-Enhanced
- TensorFlow.js model trained on conversion data
- Feature: which leads actually became clients?
- Auto-adjust weights based on historical performance
- **Effort**: 40 hours (requires 6+ months of data)

### Phase 3: Predictive
- Predict expected close date and commission amount
- Identify "look-alike" leads (similar to past converters)
- **Effort**: 60 hours

---

## Success Metrics
- **Lead response time**: Target < 5 min for Hot leads (from 30 min avg)
- **Conversion rate**: Target 3-5x improvement in lead-to-client ratio
- **Agent efficiency**: Target 40% reduction in time spent on cold leads
- **Revenue attribution**: Track which scores correlate with closed deals
