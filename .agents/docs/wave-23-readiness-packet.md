# Wave 23 — Readiness Packet

**Wave:** 23  
**Focus:** Mobile CRM, PWA Offline Mode & Push Notifications  
**Date:** 2026-06-17  
**Readiness Assessed By:** @Margaret + @Elena

---

## Readiness Score: 72% ✅ (Exceeds 60% Unlock Threshold)

---

## Gate Criteria Checklist

| # | Gate | Status | Evidence |
|---|---|---|---|
| 1 | Business rules documented | ✅ | `wave-15-pwa-readiness.md` — offline scope, SW strategy, and PWA manifest spec complete |
| 2 | API contract defined | ✅ | Push subscription endpoints defined in `WAVE_23_SDD.md#api-endpoints` |
| 3 | Data schema defined | ✅ | `user_push_tokens` collection + Background Sync queue schema in `WAVE_23_SDD.md` |
| 4 | ≥1 test scenario per requirement | ✅ | All 15 backlog items have validation commands in `WAVE_23_IMPLEMENTATION_BACKLOG.md` |
| 5 | Dependency wave complete or unblocked | 🟡 | Wave 22 planned; Wave 23 has no hard dependency on Wave 22 data — can run in parallel |
| 6 | Free-agent planning preflight done | ✅ | `@Cyra` PWA spec complete; `@Una` mobile UI spec in `ui-ux-specification.md` |
| 7 | Security review | ✅ | FCM token scoped to user; push opt-out implemented; Background Sync never retries beyond 48h |
| 8 | Performance budget defined | ✅ | Budget table in `WAVE_23_SDD.md#mobile-performance-budget` |

---

## Source Documents

| Document | Sections Referenced | Readiness |
|---|---|---|
| `business_docs/09_crm_features/wave-15-pwa-readiness.md` | SW lifecycle, offline scope, manifest spec | ✅ Complete |
| `business_docs/06_design_architecture/ui-ux-specification.md` | Mobile breakpoints, touch target spec, bottom nav | ✅ Complete |
| `business_docs/08_integrations/integration-map.md` | FCM integration, environment variables | ✅ Complete |
| `business_docs/09_crm_features/viewings.md` | Viewing schema, reminder triggers | ✅ Complete |
| `business_docs/09_crm_features/scheduling-calendar.md` | Appointment types, calendar views | ✅ Complete |

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| iOS Safari PWA limitations (no push notifications on older iOS) | Medium | Medium | Graceful fallback to in-app notification centre; document iOS 16.4+ requirement for push |
| FCM token rotation (tokens expire or change) | Low | High | Implement `tokenRefresh` handler in SW; re-register token on app open |
| Background Sync not supported in Safari | Medium | Low | Detect support; queue in localStorage as fallback; sync on next `focus` event |
| Bundle size regression from Workbox | Low | Medium | Bundle analyser in CI; lazy-load SW registration only after app interactive |

---

## Recommended Daily Coding Targets (Once Approved)

| Day | Tasks | Expected Output |
|---|---|---|
| Day 1 | W23-001, W23-003 | Service Worker registered + PWA manifest green |
| Day 2 | W23-002, W23-004 | Offline mode works + iOS install works |
| Day 3 | W23-005, W23-006 | FCM subscription + lead assignment push |
| Day 4 | W23-007, W23-008 | Viewing reminder push + notification click handler |
| Day 5 | W23-009, W23-010, W23-011 | Mobile nav + swipe gestures |
| Day 6 | W23-012, W23-013, W23-014 | Touch audit + Lighthouse CI + bundle optimisation |
| Day 7 | W23-015 | Closeout + governance validation |
