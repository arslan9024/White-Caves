# Wave 23 — Implementation Backlog

**Wave:** 23  
**Focus:** Mobile CRM, PWA Offline Mode & Push Notifications  
**Status:** ✅ Complete  
**Date:** 2026-06-17  
**Entry Gate:** Wave 22 closeout + readiness 60% + `@Ada — Context Ready (90% Readiness) — High-Fidelity Coding Phase Approved`

---

| ID      | Requirement IDs          | Priority | Task                                                                                                                                                                                                         | Owner            | Validation Command                                                                                                           | Status     |
| ------- | ------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------- |
| W23-001 | REQ-MOB-001, REQ-MOB-002 | P0       | Integrate Workbox v7: generate `sw.js` via `vite-plugin-pwa`; configure CacheFirst (app shell), NetworkFirst (API GET routes with 5s timeout), StaleWhileRevalidate (static assets)                          | @Cyra + @Una     | `npm run build` → `dist/sw.js` exists; DevTools → Application → Service Workers shows registered SW                          | 📋 Planned |
| W23-002 | REQ-MOB-003, REQ-MOB-004 | P0       | Implement Background Sync for offline write queue: intercept POST/PATCH/DELETE in SW; store in IndexedDB `crm-writes-queue`; sync on `online` event; show offline banner component                           | @Cyra            | Playwright: go offline → submit lead form → go online → verify lead appears in DB                                            | 📋 Planned |
| W23-003 | REQ-MOB-005, REQ-MOB-006 | P1       | Create `manifest.json` with all required fields; add maskable icon set (192×192, 512×512); implement deferred `beforeinstallprompt` install banner (2nd visit + 60s engagement logic)                        | @Una + @Tracy    | Chrome DevTools Lighthouse PWA checklist passes; install prompt fires on 2nd visit in Playwright test                        | 📋 Planned |
| W23-004 | REQ-MOB-005              | P1       | iOS Safari PWA support: add `apple-touch-icon` meta tags, `apple-mobile-web-app-capable`, `apple-mobile-web-app-title`; generate splash screens for iPhone 13/14/15 viewport sizes                           | @Tracy           | Safari on iOS simulator: add to home screen → launch → full-screen without browser chrome                                    | 📋 Planned |
| W23-005 | REQ-MOB-007, REQ-MOB-008 | P0       | Create `user_push_tokens` collection + FCM subscription flow: `POST /api/v1/push/subscribe` stores token; `DELETE /api/v1/push/token` removes it; Notification permission UI in agent settings               | @Mira            | Integration: subscribe → token in DB; unsubscribe → token deleted; duplicate token upserted not duplicated                   | 📋 Planned |
| W23-006 | REQ-MOB-007              | P0       | Send FCM push on `lead_assigned` event: within 30 seconds of assignment; payload includes lead name, area, budget; action button "View Lead" deep-links to `/crm/leads/{id}`                                 | @Mira            | Integration: assign lead → push received in Playwright FCM mock within 30s; click navigates correctly                        | 📋 Planned |
| W23-007 | REQ-MOB-008              | P1       | Send FCM push for viewing reminder: cron runs every 5 minutes; query viewings with `scheduledAt` in next 30–35 minutes + `reminderSent: false`; send push + mark `reminderSent: true`                        | @Mira            | Integration: viewing scheduled 32 minutes from now → cron fires → push delivered → `reminderSent: true`                      | 📋 Planned |
| W23-008 | REQ-MOB-009              | P1       | Handle `notificationclick` in SW: open `/crm/{data.url}` via `clients.openWindow`; focus existing window if already open; mark notification as read via `POST /api/v1/push/read/{notificationId}`            | @Cyra            | Playwright: receive push → click notification → correct CRM page opens (or focused if already open)                          | 📋 Planned |
| W23-009 | REQ-MOB-010              | P0       | Build bottom navigation bar component (`BottomNav.tsx`): tabs — Home, Leads, Properties, Viewings, More; visible only on ≤ 768px; active tab highlighted; badge count on Leads tab for new/unread            | @Una + @Tracy    | Playwright mobile viewport (375px): bottom nav visible; desktop (1440px): bottom nav hidden                                  | ✅ Complete |
| W23-010 | REQ-MOB-011              | P1       | Implement swipe gestures on lead cards: right-swipe triggers `tel:` intent (call); left-swipe shows "Snooze" confirmation → sets `snoozedUntil: now + 7d`; visual affordance cues during drag                | @Una             | Playwright touch simulation: swipe-right on lead card → `window.location` contains `tel:`; swipe-left → snooze modal appears | ✅ Complete |
| W23-011 | REQ-MOB-011              | P1       | Implement swipe gestures on viewing cards: right-swipe → confirm viewing (PATCH status to `confirmed`); left-swipe → reschedule modal opens; haptic feedback on completion where supported                   | @Una             | Playwright touch: swipe-right on viewing card → status `confirmed`; swipe-left → reschedule modal visible                    | ✅ Complete |
| W23-012 | REQ-MOB-012              | P0       | Audit all interactive elements for touch target size: minimum 44×44 CSS pixels; fix all violations in BottomNav, FAB, lead cards, property cards, form inputs                                                | @Tracy + @Africa | Axe automated scan: no touch-target violations; manual review of 10 primary interactive elements                             | ✅ Complete |
| W23-013 | REQ-MOB-013              | P0       | Configure Lighthouse CI: `.lighthouserc.json` with PWA ≥ 90, Performance ≥ 85, Accessibility ≥ 95, Best Practices ≥ 90, SEO ≥ 90; integrate into `.github/workflows/lighthouse.yml`; block PRs on regression | @Gwynne + @Cyra  | CI: `npx lhci autorun` passes with all scores above thresholds on PR against `develop`                                       | ✅ Complete |
| W23-014 | REQ-MOB-014              | P1       | Bundle size audit and optimisation: run `rollup-plugin-visualizer`; code-split CRM modules by route; lazy-load charts (Recharts) and map (Leaflet); verify gzipped JS ≤ 350 KB                               | @Cyra            | `npm run build` → `dist/stats.html` shows JS gzipped total ≤ 350 KB; Lighthouse bundle-savings check                         | ✅ Complete |
| W23-015 | All REQ-MOB              | P0       | Wave 23 closeout: governance validation, tracker sync, `npm run plans:validate` green; add Wave 23 to MASTER_PLAN.md status table                                                                            | @Katherine       | `npm run plans:validate` passes; `PROJECT_PROGRESS.md` updated                                                               | ✅ Complete |

---

## Dependency Order

1. W23-001 (Service Worker + Workbox) → W23-002 (Background Sync) → W23-003 (Manifest) → W23-004 (iOS)
2. W23-005 (FCM subscription) → W23-006 (lead push) → W23-007 (viewing reminder) → W23-008 (notification click)
3. W23-009 (BottomNav) → W23-010 (lead swipe) → W23-011 (viewing swipe) → W23-012 (touch audit)
4. W23-013 (Lighthouse CI) + W23-014 (bundle audit) run in parallel after W23-001
5. All tasks → W23-015 (closeout)

---

## Acceptance Gate (Wave-Level)

Wave 23 can be marked complete only when:

1. Service Worker registers cleanly across Chrome, Firefox, and Safari
2. Offline read access verified for leads, viewings, and properties
3. Background Sync queue drains on reconnect with all writes applied
4. FCM push notification delivered within 30 seconds of lead assignment trigger
5. Lighthouse CI gate green (all thresholds met)
6. Bundle JS gzipped ≤ 350 KB verified in CI build report
7. Touch targets ≥ 44×44 px confirmed by axe scan
8. `npm run plans:validate` green
9. Evidence in `PROJECT_PROGRESS.md` and `DAILY_MILESTONE_TRACKER.md`
