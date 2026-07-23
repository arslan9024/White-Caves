# Wave 22 — Implementation Backlog

**Wave:** 22  
**Focus:** Market Intelligence, Off-Plan Projects, Property Valuation & Advanced Analytics  
**Status:** 📋 Planned  
**Date:** 2026-06-17  
**Entry Gate:** Wave 21 closeout + readiness 60% + `@Ada — Context Ready (90% Readiness) — High-Fidelity Coding Phase Approved`

---

| ID      | Requirement IDs                             | Priority | Task                                                                                                                                                                   | Owner              | Validation Command                                                                                  | Status      |
| ------- | ------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | --------------------------------------------------------------------------------------------------- | ----------- |
| W22-001 | REQ-INTEL-001, REQ-INTEL-002                | P0       | Build Property AVM: inputs (location, BUA, beds, baths, floor, view, building age, last DLD price) → estimated value + confidence score + ≥3 comparables + ±10% range  | @Mira + @Barbara   | Unit: AVM with known comparable set; Integration: AVM called on property save                       | ✅ Complete |
| W22-002 | REQ-INTEL-002                               | P1       | Build manual valuation override: manager approval workflow, reason required, override stored with approver ID                                                          | @Mira              | Integration: override requires manager approval; non-manager rejected with 403                      | ✅ Complete |
| W22-003 | REQ-INTEL-003                               | P1       | Build rental yield calculator: gross yield = (annual rent / purchase price) × 100; net yield = ((annual rent - service charges) / purchase price) × 100; payback years | @Barbara           | Unit: gross/net yield with known test data; display in property detail view                         | ✅ Complete |
| W22-004 | REQ-INTEL-004                               | P1       | Implement monthly AVM refresh cron: process all active properties, update `PropertyValuation` collection, log refresh summary                                          | @Mira              | Integration: cron processes test set of 10 properties; all valuations updated                       | ✅ Complete |
| W22-005 | REQ-INTEL-005, REQ-INTEL-006                | P0       | Build Dubai area price index: populate `market_data` collection for top 30 neighborhoods (price/sqft); RERA rental index overlay by area                               | @Barbara + @Cassie | Integration: index data present for all 30 neighborhoods; RERA index displays % increase allowed    | 📋 Planned  |
| W22-006 | REQ-INTEL-007                               | P1       | Implement price drop alert: nightly compare current vs previous month area avg; if drop >5% → notify assigned leads and agents via WhatsApp                            | @Mira              | Integration: test 6% drop triggers notification; 4% drop does not                                   | 📋 Planned  |
| W22-007 | REQ-INTEL-008                               | P1       | Build weekly market report PDF + Monday 08:00 email cron: price trend chart, top areas by yield, volume heatmap, MD + board recipient list                             | @Mira              | Integration: cron fires; PDF contains all 3 chart sections; email delivered to test recipients      | 📋 Planned  |
| W22-008 | REQ-OFFPLAN-001, REQ-OFFPLAN-002            | P0       | Build off-plan project CRUD + unit inventory state machine: Available → Reserved → Sold → Transferred; EOI deposit record on reservation                               | @Mira + @Barbara   | Unit: all state transitions; E2E: create project → add unit → reserve → sell                        | 📋 Planned  |
| W22-009 | REQ-OFFPLAN-003                             | P0       | Implement Oqood DLD registration tracking: 60-day window from SPA date; alert on day 45 and day 59; auto-escalate to manager on breach                                 | @Mira + @Katherine | Unit: alert fires at day 45, 59; Integration: breach escalation creates manager task                | 📋 Planned  |
| W22-010 | REQ-OFFPLAN-004, REQ-OFFPLAN-005            | P1       | Build payment milestone schedule: auto-generate from SPA payment plan + construction %; escrow compliance flag if collected > construction %                           | @Mira              | Unit: milestone schedule for 3 common payment plan templates; escrow flag triggers on 10% overshoot | 📋 Planned  |
| W22-011 | REQ-OFFPLAN-006                             | P1       | Implement RERA Article 11 cancellation refund calculator: penalty tiers by completion % (<5%: 30%, 5-60%: 40%, >60%: 50%, post-handover: no refund)                    | @Barbara           | Unit: all 4 tier boundaries (0%, 5%, 60%, 100%); display in unit detail view                        | 📋 Planned  |
| W22-012 | REQ-OFFPLAN-007                             | P1       | Build ROI projection calculator: inputs (purchase price, expected rent per RERA index, service charge/sqft) → outputs (gross yield %, net yield %, payback years)      | @Una + @Mira       | Unit: known inputs produce expected outputs; UI: calculator panel in off-plan unit view             | 📋 Planned  |
| W22-013 | REQ-ANALYTICS-001                           | P0       | Implement nightly analytics aggregation cron: daily_stats → `analytics_snapshots` collection (new leads, new properties, leases signed, deals closed, revenue AED)     | @Mira + @Barbara   | Integration: cron runs; snapshot collection grows by 1 per day; dashboard queries from snapshots    | 📋 Planned  |
| W22-014 | REQ-ANALYTICS-002                           | P0       | Integrate Redis real-time counters: INCR on lead/viewing/maintenance create events; DECR on close; serve from `/api/v1/analytics/live-counters`                        | @Mira              | Integration: counter increments correctly; survives Redis restart (rehydrate from DB on startup)    | 📋 Planned  |
| W22-015 | REQ-ANALYTICS-003                           | P1       | Build bulk data export async job: POST → jobId; background worker processes up to 50K rows → uploads to cloud storage → emails download link with 24h expiry           | @Mira              | Integration: 10K-row test export; email received with valid download URL                            | 📋 Planned  |
| W22-016 | REQ-ANALYTICS-004                           | P0       | Build RERA license expiry tracker: 90/30-day WhatsApp + email alerts to agent + manager; block lead assignment to agents with expired license                          | @Katherine + @Mira | Integration: alert fires at correct intervals; expired agent cannot receive lead assignment         | 📋 Planned  |
| W22-017 | REQ-ANALYTICS-005                           | P1       | Build agent PIP workflow: manager creates PIP → defines actions + milestones + review date → agent views own PIP → manager updates progress → resolved/escalated       | @Una + @Mira       | E2E: PIP create → agent views → manager marks milestone complete                                    | 📋 Planned  |
| W22-018 | REQ-ANALYTICS-001 through REQ-ANALYTICS-005 | P1       | Build full analytics dashboard UI: executive KPI tiles, Recharts (line + bar + scatter), Leaflet area heatmap, saved search alerts, export button                      | @Una + @Cassie     | E2E: dashboard renders all widgets for Owner role; heatmap shows Dubai neighborhoods                | 📋 Planned  |
| W22-019 | All REQ-INTEL, REQ-OFFPLAN, REQ-ANALYTICS   | P0       | Wave 22 closeout: governance validation, tracker sync, `npm run plans:validate` green                                                                                  | @Katherine         | `npm run plans:validate` passes; trackers updated                                                   | 📋 Planned  |

---

## Dependency Order

1. W22-001 (AVM) → W22-002 (override) → W22-003 (yield) → W22-004 (cron)
2. W22-005 (area index) → W22-006 (price drop alert) → W22-007 (weekly report)
3. W22-008 (off-plan units) → W22-009 (Oqood) → W22-010 (milestones) → W22-011 (cancellation) → W22-012 (ROI)
4. W22-013 (nightly cron) → W22-014 (Redis counters) → W22-018 (dashboard UI)
5. W22-016 (RERA license) runs in parallel
6. All tasks → W22-019 (closeout)

---

## Acceptance Gate (Wave-Level)

Wave 22 can be marked complete only when:

1. AVM produces estimates with confidence score + ≥3 comparables for test property set
2. Off-plan unit lifecycle (Available → Reserved → Sold → Transferred) verified end-to-end
3. Oqood 60-day window alerts and breach escalation verified
4. Analytics snapshots written nightly and real-time Redis counters accurate
5. Weekly market report email lands on Monday 08:00 for MD role
6. RERA license expiry blocks lead assignment when expired
7. Analytics dashboard renders all widgets with no console errors
8. `npm run plans:validate` green
9. Evidence in `PROJECT_PROGRESS.md` and `DAILY_MILESTONE_TRACKER.md`
