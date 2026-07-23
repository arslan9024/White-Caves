# Wave 23 — Test Rollout Plan

**Wave:** 23  
**Focus:** Mobile CRM, PWA Offline Mode & Push Notifications  
**Date:** 2026-06-17  
**QA Owner:** @Katherine + @Vera

---

## Unit Tests

| Test File | Scope | Key Assertions |
|---|---|---|
| `src/sw/workbox.test.ts` | CacheFirst strategy | App shell served from cache when offline; cache invalidated on version bump |
| `src/sw/backgroundSync.test.ts` | Background Sync queue | Write request stored in IndexedDB when offline; cleared after successful sync |
| `src/components/mobile/BottomNav.test.tsx` | Navigation component | Renders on 375px; hidden on 1440px; active tab highlighted; badge count shown |
| `src/hooks/usePushNotifications.test.ts` | FCM subscription hook | Subscribe stores token; unsubscribe removes token; duplicate token upserted |
| `server/services/pushNotification.test.ts` | FCM send service | Lead assignment triggers FCM call; invalid token removed from DB |
| `server/routes/push.test.ts` | Push API routes | POST subscribe: 201; DELETE token: 200; unauthorized: 401 |

---

## Integration Tests

| Scenario | Steps | Expected Result |
|---|---|---|
| Offline lead list | 1. Load leads online; 2. Go offline (DevTools); 3. Navigate to leads | Leads list renders from cache; offline banner visible |
| Background sync write | 1. Go offline; 2. Create new lead; 3. Go online | Lead appears in DB; `crm-writes-queue` empty |
| Lead assignment push | 1. Subscribe to push; 2. Admin assigns lead; 3. Wait 30s | FCM notification received in browser; click opens `/crm/leads/{id}` |
| Viewing reminder push | 1. Create viewing for T+32 min; 2. Run cron; | Push delivered; `reminderSent: true` in DB |
| Opt-out | 1. Subscribe; 2. Delete token; 3. Assign lead | No push notification delivered |
| Swipe-right lead | 1. Open mobile viewport; 2. Swipe-right on lead card | `tel:` link triggered |
| Swipe-left snooze | 1. Open mobile viewport; 2. Swipe-left on lead card; 3. Confirm snooze | Lead `snoozedUntil` set to now+7d; lead removed from active list |

---

## End-to-End (Playwright)

| Test ID | Browser | Scenario |
|---|---|---|
| E2E-MOB-001 | Chrome (desktop) | PWA install prompt fires on 2nd visit + 60s engagement |
| E2E-MOB-002 | Chrome (mobile emulation, Pixel 5) | Full agent workflow: login → view leads → book viewing — offline mode active |
| E2E-MOB-003 | Firefox | Service Worker registers; app shell cached |
| E2E-MOB-004 | Chrome | FCM push received + notification click navigates to lead |

---

## Lighthouse CI Gate

```bash
# Run in CI (GitHub Actions)
npx lhci autorun --collect.url=http://localhost:3000/crm

# Required thresholds (from .lighthouserc.json):
# performance: 85
# accessibility: 95
# best-practices: 90
# seo: 90
# pwa: 90
```

---

## Regression Checks

- `npm run test:run:unit` — all existing unit tests pass
- `npm run build` — zero TypeScript errors; bundle size ≤ 350 KB gzipped
- `npm run lint` — zero new errors
- `npm run typecheck` — clean
- Existing lead, viewing, and property CRUD flows unaffected by SW registration

---

## Rollback Plan

If a critical bug is found post-deploy:

1. Set `pwa.enabled = false` in feature flags (`scripts/orchestrator/policy.json`)
2. This disables SW registration on the next app load; browser clears SW on next visit
3. Push subscriptions remain in DB but no notifications sent until re-enabled
4. No data loss — Background Sync queue entries have 48h TTL
