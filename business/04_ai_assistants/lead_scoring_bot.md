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

## 7. Complete Feature Engineering Specification

All features are computed at score-calculation time and stored in the `signals` JSON field of `LeadScore`. The table below defines every feature by name, source field(s), transformation formula, and expected value range.

| # | Feature Name | Source Field(s) | Transformation Formula | Expected Range | Notes |
|---|-------------|----------------|------------------------|----------------|-------|
| 1 | `days_since_last_contact` | `Lead.activities[-1].createdAt` | `(now - lastActivity) / 86400000` (ms → days) | 0 – 365 | Clamped at 365; higher = more stale |
| 2 | `budget_match_ratio` | `Lead.budget`, `Property.averagePrice` (target area) | `Lead.budget / areaAvgPrice` | 0.0 – 2.0 | >1.0 = above-market budget; <0.5 = misaligned |
| 3 | `property_view_count` | `Lead.activities` WHERE `type='property_view'` | `COUNT(activities)` in last 30 days | 0 – 50 | Capped at 50 for normalization |
| 4 | `saved_properties_count` | `Lead.savedProperties` | `LENGTH(savedProperties)` | 0 – 30 | Indicates active shortlisting |
| 5 | `search_frequency_7d` | `Lead.searchEvents` last 7 days | `COUNT(searchEvents WHERE date >= now-7d)` | 0 – 100 | Normalized to 0–1 in model |
| 6 | `return_visit_rate` | `Lead.sessions` | `sessions.count / daysKnown` (visits per day) | 0.0 – 5.0 | >1 visit/day = high engagement |
| 7 | `whatsapp_response_time_avg` | `Lead.messages` WHERE `direction='inbound'` | `AVG(inbound.createdAt - outbound.createdAt)` in hours | 0 – 72 | <1 h = highly engaged; 0 if no messages |
| 8 | `email_open_rate` | `Lead.emailCampaigns` | `openedCount / sentCount` | 0.0 – 1.0 | Requires min 3 sent emails for validity |
| 9 | `viewing_requests_count` | `Lead.activities` WHERE `type='viewing_request'` | `COUNT(activities)` all-time | 0 – 20 | Any booking = strong intent signal |
| 10 | `time_on_site_avg_mins` | `Lead.sessions.duration` | `AVG(session.duration) / 60000` (ms → min) | 0 – 60 | >5 min average = meaningful engagement |
| 11 | `source_quality_score` | `Lead.source` | Lookup table: referral=1.0, organic=0.8, portal=0.7, paid=0.5, social=0.4, unknown=0.2 | 0.0 – 1.0 | Immutable once lead created |
| 12 | `nationality_tier` | `Lead.nationality` | Lookup: Tier-1 (UAE/GCC/Western) = 1.0, Tier-2 (South Asia/East Asia) = 0.7, Other = 0.5 | 0.5 – 1.0 | Based on historical conversion rates per nationality |
| 13 | `residency_status_score` | `Lead.residencyStatus` | resident=1.0, visa_holder=0.8, tourist=0.4, unknown=0.3 | 0.3 – 1.0 | Tourists less likely to close quickly |
| 14 | `investor_intent_flag` | `Lead.type`, `Lead.activities` | 1 if `Lead.type='investor'` OR keyword "ROI/yield/portfolio" detected | 0 or 1 | Binary; investors scored separately in Phase 2 |
| 15 | `mortgage_preapproval` | `Lead.documents` WHERE `type='mortgage_preapproval'` | 1 if document exists AND `expiryDate > now`, else 0 | 0 or 1 | Strong intent; +20 bonus points applied |
| 16 | `document_upload_count` | `Lead.documents` | `COUNT(documents)` | 0 – 10 | KYC docs uploaded = high commitment |
| 17 | `urgency_keyword_score` | `Lead.notes`, `Lead.messages` | NLP keyword match: "urgent/ASAP/this month/ready to buy" → weighted count, normalized | 0.0 – 1.0 | Requires NLP pipeline (Phase 2) |
| 18 | `budget_specification` | `Lead.budget` | 1 if budget explicitly set AND > 0, 0 if null or 0 | 0 or 1 | Unspecified budget = lower intent |
| 19 | `preferred_areas_count` | `Lead.preferredAreas` | `LENGTH(preferredAreas)` | 0 – 10 | 1-3 areas = focused; >5 = browsing |
| 20 | `days_since_creation` | `Lead.createdAt` | `(now - createdAt) / 86400000` | 0 – 730 | Used for time-decay penalty beyond 180 days |
| 21 | `outbound_contact_attempts` | `Lead.activities` WHERE `type IN ['call','email','whatsapp']` AND `direction='outbound'` | `COUNT(activities)` | 0 – 30 | >10 unanswered contacts → deprioritize |
| 22 | `inbound_contact_initiated` | `Lead.activities` WHERE `direction='inbound'` AND `type='inquiry'` | 1 if any inbound inquiry exists, else 0 | 0 or 1 | Lead contacting us = highest intent signal |
| 23 | `competitor_mention_flag` | `Lead.notes`, `Lead.messages` | 1 if competitor agency name detected in messages | 0 or 1 | Flag for urgent follow-up; may be shopping |
| 24 | `property_type_match_score` | `Lead.propertyTypePreference`, `Lead.activities` | Fraction of viewed properties matching stated preference | 0.0 – 1.0 | High mismatch = recommend alternative options |

### 7.1 Feature Normalization

All continuous features are normalized to [0, 1] before being multiplied by signal weights using min-max scaling with domain-specific bounds:

```typescript
function normalize(value: number, min: number, max: number): number {
  return Math.min(1.0, Math.max(0.0, (value - min) / (max - min)));
}
```

### 7.2 Feature Update Triggers

| Trigger | Features Re-computed |
|---------|---------------------|
| New `Lead.activity` created | 1, 3, 4, 5, 6, 7, 9, 10, 21, 22 |
| New `Lead.document` uploaded | 15, 16 |
| `Lead.budget` updated | 2, 18 |
| Email campaign event received | 8 |
| WhatsApp message received (Nadia webhook) | 7, 22 |
| Scheduled nightly job | 1, 6, 20 (time-based features) |

---

## 8. Scoring Rules Engine

The rules engine applies deterministic bonuses and penalties on top of the weighted feature score. Rules are evaluated in priority order (lower number = evaluated first). When multiple rules match, all applicable bonuses/penalties stack unless an override condition is present.

### 8.1 Complete Decision Table

| Rule ID | Priority | Condition | Action | Override |
|---------|----------|-----------|--------|----------|
| R-001 | 1 | `source = 'referral'` AND `whatsapp_response_time_avg < 1` | **+15 bonus** | None |
| R-002 | 2 | `mortgage_preapproval = 1` AND `budget_specification = 1` | **+20 bonus** — mark as "finance-ready" | None |
| R-003 | 3 | `inbound_contact_initiated = 1` | **+25 bonus** — elevate category by one level | Cannot reduce below Warm |
| R-004 | 4 | `viewing_requests_count >= 2` AND `days_since_last_contact <= 7` | **+15 bonus** | None |
| R-005 | 5 | `days_since_last_contact > 8` AND `score > 70` | **Decay: −5 per day** beyond day 8 | Pause decay if agent activity logged |
| R-006 | 6 | `days_since_last_contact > 30` AND `score > 40` | **Decay: −3 per day** beyond day 30 | Pause if email auto-sent |
| R-007 | 7 | `days_since_last_contact > 90` | **Force category = 'cold'** regardless of score | Manager override only |
| R-008 | 8 | `outbound_contact_attempts >= 10` AND `inbound_contact_initiated = 0` | **−20 penalty** — mark as "unresponsive" | Remove penalty if lead responds |
| R-009 | 9 | `competitor_mention_flag = 1` | **Urgent flag** — notify assigned agent immediately, no score change | None |
| R-010 | 10 | `urgency_keyword_score >= 0.7` | **+10 bonus** + trigger immediate agent notification | None |
| R-011 | 11 | `budget_match_ratio < 0.5` | **−15 penalty** — flag as budget-misaligned | Lift if budget updated |
| R-012 | 12 | `investor_intent_flag = 1` AND `budget_match_ratio >= 0.8` | **+12 bonus** + assign to Investment Specialist queue | None |
| R-013 | 13 | `document_upload_count >= 3` | **+10 bonus** — KYC compliance signal | None |
| R-014 | 14 | `source = 'paid'` AND `property_view_count < 2` AND `days_since_creation > 2` | **−10 penalty** — low-quality paid lead | None |
| R-015 | 15 | `return_visit_rate >= 1.0` (visiting daily) | **+8 bonus** | None |
| R-016 | 16 | `score >= 90` AND `no agent assigned` | **Auto-assign** to next available senior agent + WhatsApp alert | None |
| R-017 | 17 | `email_open_rate >= 0.6` AND `time_on_site_avg_mins >= 5` | **+7 bonus** | None |
| R-018 | 18 | `budget_specification = 0` AND `days_since_creation > 14` | **−5 penalty** + trigger "budget clarification" nurture email | None |
| R-019 | 19 | `preferred_areas_count >= 1` AND `saved_properties_count >= 3` | **+8 bonus** — actively shortlisting | None |
| R-020 | 20 | `score < 20` AND `days_since_creation > 180` | **Archive lead** — move to `status='archived'`, remove from active queue | Manager can reactivate |

### 8.2 Score Bounds

- **Maximum score:** 100 (capped; bonuses cannot exceed this)
- **Minimum score:** 0 (penalties cannot go below 0)
- **Category override rule:** If rules engine forces a category (R-007, R-020), ML model output is ignored for that lead

### 8.3 Rule Execution Pseudocode

```typescript
function applyRules(features: FeatureVector, baseScore: number): ScoringResult {
  let score = baseScore;
  const appliedRules: string[] = [];
  const overrides: string[] = [];

  // Rules evaluated in priority order
  for (const rule of RULES_SORTED_BY_PRIORITY) {
    if (rule.overrideCondition && overrides.includes(rule.overrideCondition)) continue;
    if (evaluateCondition(rule.condition, features)) {
      score = applyAction(rule.action, score, features);
      appliedRules.push(rule.id);
      if (rule.setsOverride) overrides.push(rule.setsOverride);
    }
  }

  return {
    finalScore: Math.min(100, Math.max(0, Math.round(score))),
    appliedRules,
    category: deriveCategory(score),
  };
}
```

---

## 9. Model Training & Evaluation Plan

### 9.1 Training Data Requirements

| Requirement | Specification |
|-------------|---------------|
| **Minimum dataset size** | 500 historical leads with known outcomes (converted / not converted) |
| **Recommended dataset size** | 2,000+ leads for Phase 2 gradient boosting |
| **Outcome label** | `Lead.status = 'converted'` (closed sale or lease) within 180 days |
| **Minimum observation window** | 12 months of historical data |
| **Class balance** | Target 30–40% positive class (converted); oversample if below 15% |
| **Feature completeness** | At least 18 of 24 features must be non-null per training record |
| **Holdout split** | 70% train / 15% validation / 15% test (time-stratified, not random) |

### 9.2 Cross-Validation Strategy

- **Method:** Stratified K-Fold (k=5) with time-based stratification
- **Fold assignment:** Leads sorted by `createdAt`; each fold represents a time slice to prevent data leakage
- **Hyperparameter tuning:** Bayesian optimization via Optuna over 100 trials
- **Final model selection:** Best mean AUC-ROC across all folds

```python
from sklearn.model_selection import TimeSeriesSplit
from optuna import create_study

tscv = TimeSeriesSplit(n_splits=5, gap=30)  # 30-day gap prevents leakage
study = create_study(direction='maximize', metric='roc_auc')
study.optimize(objective, n_trials=100)
```

### 9.3 Evaluation Metrics

| Metric | Formula | Target | Rationale |
|--------|---------|--------|-----------|
| **AUC-ROC** | Area under ROC curve | ≥ 0.80 | Primary metric; measures discrimination across all thresholds |
| **Precision@10** | Precision in top-10 ranked leads | ≥ 80% | Agents review top 10; must be accurate |
| **Precision@K** | Precision for hot-lead category | ≥ 75% | Hot leads must convert at high rate |
| **Recall (converted leads)** | TP / (TP + FN) | ≥ 65% | Must not miss real buyers |
| **F1 Score** | 2 × (P × R) / (P + R) | ≥ 0.72 | Balanced measure for imbalanced classes |
| **MAPE (score calibration)** | Mean absolute % error vs. conversion probability | < 15% | Ensures scores reflect actual conversion probability |
| **Brier Score** | Mean squared error of probability predictions | < 0.18 | Calibration measure |

### 9.4 Confusion Matrix (Example — Phase 2 Model)

```
                    Predicted: Converted   Predicted: Not Converted
Actual: Converted         142 (TP)                 61 (FN)
Actual: Not Converted      38 (FP)                359 (TN)

Precision = 142 / (142 + 38) = 78.9%
Recall    = 142 / (142 + 61) = 69.9%
F1 Score  = 2 × (0.789 × 0.699) / (0.789 + 0.699) = 0.741
AUC-ROC   = 0.847  ✅ (Target: ≥ 0.80)
```

### 9.5 SHAP Explainability

Archer uses SHAP (SHapley Additive exPlanations) values to provide agent-facing transparency for every score:

```python
import shap

explainer = shap.TreeExplainer(trained_model)
shap_values = explainer.shap_values(lead_features)

# Top 3 contributing factors stored per lead
top_factors = sorted(
    zip(FEATURE_NAMES, shap_values[lead_idx]),
    key=lambda x: abs(x[1]),
    reverse=True
)[:3]
```

- **Storage:** Top 3 SHAP factors stored in `LeadScore.signals.topFactors`
- **Display:** Shown in score breakdown tooltip on lead card (see Section 10)
- **Format:** e.g., `"Budget aligned with Marina (↑ +18pts)"`, `"No response in 12 days (↓ −9pts)"`

---

## 10. Frontend UI Specification

### 10.1 Lead Card Score Badge

The score is displayed as a color-coded circular badge on every lead card in the Clara CRM lead list view.

```
┌─────────────────────────────────────────┐
│  👤 Ahmed Al-Rashid          [🔥 87]    │
│  Dubai Marina • AED 2.8M               │
│  ████████░░  Last active: 2h ago       │
│  📞 Agent: Sara M.  ↗ +5 this week    │
└─────────────────────────────────────────┘
```

| Score Range | Badge Color | Emoji | Text Color |
|-------------|------------|-------|------------|
| 90 – 100 | `#EF4444` (Red/Hot) | 🔥 | White |
| 70 – 89 | `#F59E0B` (Amber/Warm) | 🟡 | White |
| 40 – 69 | `#F97316` (Orange/Nurturing) | 🟠 | White |
| 0 – 39 | `#3B82F6` (Blue/Cold) | 🔵 | White |

- **Badge shape:** Circle, 36×36px, positioned top-right of lead card
- **Score value:** Shown as integer 0–100 inside badge
- **Trend indicator:** Small arrow (↑↓→) with ±delta showing change since last calculation
- **Sparkline:** 7-day score history rendered as a 60×20px SVG sparkline below the badge

### 10.2 Score Breakdown Tooltip

Clicking the score badge opens a tooltip/popover with:

```
┌─────────────────────────────────────────────┐
│  📊 Lead Score: 87  (Warm → Hot)            │
│  ─────────────────────────────────────────  │
│  Top Contributing Factors:                  │
│  ▲ Mortgage pre-approval uploaded   +20pts  │
│  ▲ 2 viewing requests this week     +15pts  │
│  ▼ No response in 9 days             −9pts  │
│  ─────────────────────────────────────────  │
│  Signal Breakdown:                          │
│  Behavioral    ████████░░  32/35            │
│  Engagement    ████████░░  22/25            │
│  Demographic   ██████░░░░  15/20            │
│  Intent        ████████░░  14/15            │
│  Source        ████░░░░░░   4/ 5            │
│  ─────────────────────────────────────────  │
│  Last Updated: 14 minutes ago              │
│  [Recalculate Now]   [View Full History]   │
└─────────────────────────────────────────────┘
```

- **Top 3 factors:** Pulled from SHAP values stored in `LeadScore.signals.topFactors`
- **Signal bars:** Visual progress bar showing each category's contribution
- **Recalculate:** Triggers `POST /api/leads/:id/score/recalculate` (rate-limited: once per 5 min per lead)

### 10.3 Lead List Filtering by Score Range

A filter panel on the Clara lead list view includes:

```typescript
interface ScoreFilter {
  minScore: number;       // 0–100 slider
  maxScore: number;       // 0–100 slider
  categories: ('hot' | 'warm' | 'nurturing' | 'cold')[];
  trend: 'rising' | 'falling' | 'stable' | 'any';
  lastUpdated: '1h' | '24h' | '7d' | 'any';
}
```

- **Quick filter chips:** "🔥 Hot (90+)", "⚡ Rising Fast", "⚠️ Decaying", "📋 Unscored"
- **Sort options:** Sort by score (desc/asc), by trend velocity, by last activity
- **URL state:** All filter state serialized to URL query params for bookmarking/sharing

### 10.4 Bulk Re-Score Button (Manager Role)

Visible only to users with `role = 'manager'` or `role = 'admin'`:

- **Location:** Lead list header toolbar
- **Label:** "Re-Score All" with count badge showing `N unscored / stale leads`
- **Behavior:** Enqueues all leads with `lastUpdated > 24h` OR `LeadScore = null` into Redis scoring queue
- **Rate limit:** Bulk re-score limited to once per hour per manager to prevent queue flooding
- **Progress:** Shows a toast notification: "Scoring 142 leads… 87 complete (61%)"
- **API:** `POST /api/leads/scores/bulk-recalculate` with `{ filter: ScoreFilter }` body

---

## 11. Monitoring & Alerting

### 11.1 Production Metrics to Track

| Metric | Description | Collection Method | Dashboard |
|--------|-------------|-----------------|-----------|
| `score_distribution_p50` | Median score across all active leads | Percentile aggregation on `LeadScore.score` | Maven dashboard |
| `score_distribution_drift` | KL-divergence between this week's and last week's score distribution | Computed nightly | Maven + alert |
| `hot_lead_percentage` | % of active leads in hot category | `COUNT(category='hot') / COUNT(active)` | KPI card |
| `cold_lead_percentage` | % of active leads in cold category | `COUNT(category='cold') / COUNT(active)` | KPI card |
| `conversion_rate_by_category` | Conversion % for hot/warm/nurturing/cold leads | Join `LeadScore` + `Lead.status` monthly | Maven report |
| `scoring_latency_p95` | 95th percentile scoring computation time | Prometheus histogram | Ops dashboard |
| `scoring_queue_depth` | Number of leads pending scoring in Redis queue | Redis `LLEN` metric | Ops dashboard |
| `rule_trigger_frequency` | How often each rule (R-001 through R-020) fires | Counter per rule ID | Admin dashboard |
| `feature_null_rate` | % of leads with each feature missing | Nightly audit query | Data quality dashboard |
| `model_score_vs_actual` | Predicted conversion probability vs. actual outcome | Monthly cohort analysis | ML dashboard |

### 11.2 Alert Thresholds

| Alert | Condition | Severity | Notification |
|-------|-----------|----------|-------------|
| Score distribution drift | KL-divergence > 0.15 vs. 7-day rolling baseline | ⚠️ WARN | Slack #archer-alerts |
| Hot lead percentage drop | `hot_lead_pct` drops >20% week-over-week | ⚠️ WARN | Slack + Email to Head of Sales |
| Scoring queue backup | Queue depth > 500 leads for > 10 minutes | 🚨 CRITICAL | PagerDuty + Slack |
| Scoring service down | No scores updated in last 30 minutes | 🚨 CRITICAL | PagerDuty + SMS to @Gwynne |
| Feature null rate spike | Any feature null rate increases > 30% | ⚠️ WARN | Slack #data-quality |
| Conversion rate anomaly | Conversion rate for hot leads < 15% for 30-day cohort | ⚠️ WARN | Email to @Joelle (ML Lead) |
| Rule override abuse | Single manager fires `bulk-recalculate` > 3×/day | ℹ️ INFO | Audit log + Slack to @Ada |

### 11.3 Weekly Calibration Review Process

Every **Monday at 09:00 GST**, the following automated calibration report is generated and sent to @Joelle (ML Lead) and @Margaret (Project Manager):

```
Archer Weekly Calibration Report — Week 17 (Apr 21–27, 2026)
═══════════════════════════════════════════════════════════════
Score Distribution:
  Hot (90-100):      12.3% of leads  (prev: 11.8%)  ↑ +0.5%
  Warm (70-89):      28.1% of leads  (prev: 29.2%)  ↓ −1.1%
  Nurturing (40-69): 35.6% of leads  (prev: 34.9%)  ↑ +0.7%
  Cold (0-39):       24.0% of leads  (prev: 24.1%)  → stable

Conversion Accuracy (30-day cohort):
  Hot leads converted:      31.4%  (target: >25%)   ✅
  Warm leads converted:     14.2%  (target: >12%)   ✅
  Nurturing leads converted: 4.8%  (target: >3%)    ✅
  Cold leads converted:      0.9%  (target: <2%)    ✅

Top Fired Rules:
  R-005 (dormancy decay): fired 847 times
  R-003 (inbound inquiry): fired 203 times
  R-002 (finance-ready):   fired 89 times

Recommendation: No weight adjustments needed this week.
```

---

## 12. Configuration & Governance

### 12.1 Admin UI for Weight Adjustment

Managers with `role = 'admin'` can access the Archer Configuration panel at `/admin/archer/config`:

```typescript
interface ScoringWeightConfig {
  behavioral:  number;  // 0–100, default 35
  engagement:  number;  // 0–100, default 25
  demographic: number;  // 0–100, default 20
  intent:      number;  // 0–100, default 15
  sourceQuality: number; // 0–100, default 5
  // Constraint: all weights must sum to exactly 100
}

interface RuleConfig {
  ruleId:   string;  // R-001 through R-020
  enabled:  boolean;
  bonusValue?: number;  // Override default bonus/penalty
  threshold?: number;   // Override condition threshold
}
```

- **Live preview:** Shows simulated score change on a sample of 10 leads before saving
- **Constraint validation:** Frontend enforces `Σ weights = 100`; backend validates before saving

### 12.2 Approval Workflow for Weight Changes

All configuration changes follow a two-step approval process:

```
Manager submits change
       ↓
System generates "Change Impact Report" (shows predicted distribution shift for active leads)
       ↓
Head of Sales reviews impact report (24h window)
       ↓
Approved → applied + audit log entry
Rejected → change discarded + notification to requester
```

- **Emergency override:** CEO or CTO can bypass approval with documented justification
- **Change freeze:** No configuration changes permitted in the 7 days preceding end-of-quarter reporting

### 12.3 Audit Log

All configuration changes are written to `ScoringConfigAudit` collection:

```prisma
model ScoringConfigAudit {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  changedBy   String   @db.ObjectId       // User who made the change
  approvedBy  String?  @db.ObjectId       // Approver (null if pending)
  changeType  String                       // weight_update, rule_toggle, threshold_change
  previousConfig Json                     // Full config snapshot before change
  newConfig      Json                     // Full config snapshot after change
  impactReport   Json                     // Predicted distribution shift
  status      String   @default("pending") // pending, approved, rejected, rolled_back
  reason      String                       // Required justification text
  createdAt   DateTime @default(now())
  approvedAt  DateTime?

  @@index([changedBy, createdAt])
  @@index([status])
}
```

### 12.4 Rollback Procedure

1. Navigate to `/admin/archer/config/history`
2. Select the audit log entry to roll back to
3. Click "Rollback to this version" — system shows impact preview
4. Confirm rollback → configuration restored to previous snapshot
5. New audit log entry created with `changeType = 'rollback'` referencing original change ID
6. All leads rescored with restored configuration within 30 minutes via bulk-recalculate queue

- **Rollback window:** Any change can be rolled back within 30 days
- **Automatic rollback trigger:** If conversion rate for hot leads drops below 10% for 7 consecutive days, system auto-proposes rollback to last known good configuration

---

## Sources

- [AI Lead Scoring Best Practices](https://www.orris.ai/blog/ai-automation-for-real-estate-practical-guide)
- [Real Estate AI Labs](https://www.realestateailabs.com/)
- [Saleswise AI Lead Scoring](https://www.saleswise.ai/blog/ai-tools-for-real-estate-agents)
- [SHAP Explainability Documentation](https://shap.readthedocs.io/)
- [XGBoost Documentation](https://xgboost.readthedocs.io/)
- [Optuna Hyperparameter Optimization](https://optuna.org/)
