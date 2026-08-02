# Wave 22 — Readiness Packet

**Wave:** 22  
**Focus:** Market Intelligence, Off-Plan Projects, Property Valuation & Advanced Analytics  
**Status:** 📋 Planned  
**Date:** 2026-06-17  
**Readiness Score:** 62% (analytics spec complete; AVM comparable data source and DLD access need confirmation)

---

## Readiness Checklist

| Category | Item | Status | Notes |
|---|---|---|---|
| Business Rules | AVM: ≥3 comparables required, ±10% confidence range | ✅ Documented | `property-valuation.md` |
| Business Rules | RERA Article 11 cancellation penalty tiers | ✅ Documented | `off-plan-projects.md` |
| Business Rules | Oqood 60-day DLD registration window | ✅ Documented | DLD mandatory requirement |
| Business Rules | Escrow: 100% of collected funds in RERA escrow | ✅ Documented | Law No. 8 of 2007 |
| Business Rules | RERA rental index: max allowed increase % by area | ✅ Documented | 2026 RERA annual release |
| Business Rules | RERA license expiry blocks lead assignment | ✅ Documented | `agent-performance.md` |
| Business Rules | Price drop alert threshold: 5% month-over-month | ✅ Documented | `market-intelligence.md` |
| API Contract | AVM + valuation endpoints | ✅ Complete | `WAVE_22_SDD.md` |
| API Contract | Off-plan project + unit endpoints | ✅ Complete | `WAVE_22_SDD.md` |
| API Contract | Analytics endpoints (snapshots, counters, export) | ✅ Complete | `WAVE_22_SDD.md` |
| Data Schema | OffPlanProject + OffPlanUnit Prisma models | ✅ Complete | `WAVE_22_SDD.md` |
| Data Schema | PropertyValuation Prisma model | ✅ Complete | `WAVE_22_SDD.md` |
| Data Schema | AnalyticsSnapshot Prisma model | ✅ Complete | `WAVE_22_SDD.md` |
| Test Scenarios | AVM with known comparable set | ✅ Defined | W22-001 |
| Test Scenarios | Oqood window alert at day 45 and 59 | ✅ Defined | W22-009 |
| Test Scenarios | RERA Article 11 all 4 penalty tiers | ✅ Defined | W22-011 |
| Test Scenarios | Real-time Redis counter increment/decrement | ✅ Defined | W22-014 |
| Test Scenarios | RERA license expiry blocks assignment | ✅ Defined | W22-016 |
| External Dependencies | Redis available (already in Wave 15 infra) | ✅ Available | Wave 15 cache infra |
| External Dependencies | Puppeteer document engine | ✅ Available | Wave 20 document engine |
| External Dependencies | Leaflet.js + OpenStreetMap tiles | ✅ Available | Free in dev |
| External Dependencies | DLD comparable transaction data | ⚠️ Pending | Internal transactions fallback available |
| External Dependencies | Mapbox API key for production heatmap | ⚠️ Pending | OSM fallback for dev |
| UI Specs | Analytics dashboard widget layout | ✅ Documented | `analytics-dashboard.md` |
| UI Specs | Off-plan project + unit detail view | ✅ Documented | `off-plan-projects.md` |

---

## Risk Register

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| DLD comparable data not available via API | High | Medium | Use internal transaction history as AVM source; confidence score adjusts accordingly |
| Mapbox API cost in production | Medium | Low | Use OpenStreetMap tiles until user count justifies Mapbox; cap at 1000 tiles/day |
| Redis rehydration on restart takes too long | Low | Low | Rehydrate async on startup; serve slightly stale counter until complete |
| RERA 2026 rental index not published by wave start | Medium | Medium | Use 2025 index as placeholder; update on 2026 release |
| Nightly cron overlaps with MongoDB backup window | Low | Medium | Schedule cron at 02:00 UAE time (22:00 UTC); backup runs at 03:00 |

---

## Pre-Coding Checklist (60% Readiness Gate)

- [x] AVM business rules documented in `property-valuation.md`
- [x] Off-plan rules (RERA Article 11, Oqood) documented in `off-plan-projects.md`
- [x] Analytics aggregation strategy documented in `analytics-dashboard.md`
- [x] API contract defined in `WAVE_22_SDD.md`
- [x] Data schema defined in `WAVE_22_SDD.md`
- [x] At least 5 test scenarios defined per module
- [ ] DLD comparable data source confirmed (internal or external)
- [ ] Wave 21 fully closed out

**Gate Status:** Ready for @Ada approval once Wave 21 closes out and DLD data source confirmed
