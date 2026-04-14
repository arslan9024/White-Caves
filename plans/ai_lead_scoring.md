# AI Lead Scoring System

**Status**: Planned  
**Priority**: High  
**Estimated Effort**: 20 hours  
**Depends On**: Existing Lead model (Prisma), score field (0-100)

---

## Objective

Replace the manual lead scoring with an AI-powered scoring algorithm that analyses lead behavior, property preferences, budget alignment, and engagement patterns to produce a 0-100 quality score in real time.

---

## Success Criteria

- [ ] Scoring accuracy >80% (validated against historical won/lost leads)
- [ ] Score updates in <500ms after any lead interaction
- [ ] Transparent scoring breakdown visible in CRM (not a black box)
- [ ] Integrates with existing `Lead.score` field in Prisma schema
- [ ] Dashboard widget showing score distribution and conversion correlation

---

## Architecture

### Scoring Factors (Weighted)

| Factor | Weight | Data Source |
|--------|--------|-------------|
| Budget vs property price alignment | 25% | Lead.budget, Property.price |
| Engagement recency (last contact) | 20% | Lead.lastContact |
| Communication frequency | 15% | Activity count (type=lead) |
| Source quality | 15% | Lead.source (referral > website > marketing > cold) |
| Property viewing count | 10% | Viewing records for this lead |
| Response time (agent → lead) | 10% | NadiaConversation response times |
| Profile completeness | 5% | Lead field fill rate |

### Implementation Checklist

- [ ] Create `server/services/LeadScoringService.ts`
  - [ ] `calculateScore(leadId)` — compute weighted score
  - [ ] `batchRecalculate()` — nightly job for all active leads
  - [ ] `getScoreBreakdown(leadId)` — return factor-by-factor analysis
- [ ] Add API endpoints:
  - [ ] `POST /api/leads/:id/score` — trigger rescore (already exists, enhance)
  - [ ] `GET /api/leads/:id/score-breakdown` — detailed breakdown
- [ ] Create scoring trigger hooks:
  - [ ] After lead creation → initial score
  - [ ] After activity logged → rescore
  - [ ] After viewing scheduled/completed → rescore
  - [ ] After message received → rescore
- [ ] Frontend components:
  - [ ] `LeadScoreGauge` — visual 0-100 gauge with color zones
  - [ ] `ScoreBreakdownCard` — factor-by-factor breakdown
  - [ ] `ScoreHistoryChart` — score changes over time (recharts)
- [ ] Add Prisma fields: `Lead.scoreBreakdown` (JSON), `Lead.scoredAt` (DateTime)
- [ ] Unit tests for scoring algorithm (min 95% coverage)
- [ ] E2E test: create lead → log activities → verify score changes

---

## Future Enhancements (Phase 2)

- Machine learning model trained on historical conversion data
- Predictive "likelihood to close" percentage
- Automated lead routing based on score thresholds
- Commission forecasting based on pipeline scores
