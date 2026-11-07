# Wave 23 — System Design Document (SDD)

**Wave:** 23  
**Focus:** Mobile CRM, PWA Offline Mode & Push Notifications  
**Status:** 📋 Planned  
**Date:** 2026-06-17  
**Owners:** @Una + @Tracy + @Cyra + @Mira + @Gwynne + @Katherine  
**CONSUMES←:** `business_docs/09_crm_features/wave-15-pwa-readiness.md`, `business_docs/09_crm_features/scheduling-calendar.md`, `business_docs/09_crm_features/viewings.md`, `business_docs/06_design_architecture/ui-ux-specification.md`  
**FEEDS→:** Wave 24 (WhatsApp + AI Chat depend on push notification infrastructure); Wave 25

---

## Objective

Extend White Caves CRM into a first-class mobile Progressive Web App (PWA). Agents and managers will be able to receive push notifications, manage leads and viewings, and access property data while offline. The mobile experience will be optimised for Dubai's on-the-go agent workflow: quick lead responses, viewing confirmations, and client status updates from the field, all synced automatically when connectivity is restored.

---

## Scope

### 1. Service Worker & Offline Strategy

- Service Worker (SW) registered via Workbox v7 — `sw.js` at origin root
- Cache strategy by resource type:
  - App shell (HTML, CSS, JS bundles): CacheFirst (version-busted on deploy)
  - API reads (GET `/api/v1/leads`, `/api/v1/properties`, `/api/v1/viewings`): NetworkFirst with 5-second timeout → cache fallback
  - Static assets (images, fonts, icons): StaleWhileRevalidate
  - Write requests (POST/PATCH/DELETE): Background Sync queue — retry when connectivity restored
- Offline scope: read-only access to:
  - Last 50 assigned leads (synced on last online session)
  - Today's scheduled viewings
  - Agent's own property portfolio
  - Client contact cards
- Offline indicator: persistent banner "You're offline — changes will sync when reconnected"
- Background Sync tag: `crm-writes-queue`; max 48-hour retry window

### 2. PWA Manifest & Install Prompt

- `manifest.json`:
  - `name`: "White Caves CRM"
  - `short_name`: "WC CRM"
  - `theme_color`: `#0A0A0A` (dark canvas)
  - `background_color`: `#0A0A0A`
  - `display`: `standalone`
  - `orientation`: `portrait-primary`
  - Icons: 192×192, 512×512, maskable icon (safe-zone padding)
  - `scope`: `/crm/`
  - `start_url`: `/crm/?utm_source=pwa`
- Install prompt: deferred `beforeinstallprompt` event captured; custom install banner surfaces after 2nd visit and 60-second engagement
- iOS Safari: `apple-touch-icon`, `apple-mobile-web-app-capable`, splash screens for major iPhone viewports

### 3. Push Notifications (FCM)

- Push subscription flow: agent clicks "Enable Notifications" → browser Notification permission → FCM subscription → token stored in `user_push_tokens` MongoDB collection
- Notification triggers (server-side, all via FCM HTTP v1):
  - **New lead assigned**: fires within 30 seconds of assignment; action buttons: "View Lead" / "Call Now"
  - **Viewing reminder**: 30 minutes before scheduled viewing; action: "Get Directions" (opens Apple Maps / Google Maps)
  - **Rent due reminder**: 3 days before `nextPaymentDue`; target: assigned agent
  - **Maintenance update**: on status change to `in_progress` or `completed`; target: tenant + agent
  - **Offer received**: when buyer submits offer on agent's listed property
  - **Lease expiry alert**: 30 days before lease end; target: portfolio manager
- Notification payload structure:
  ```json
  {
    "notification": { "title": "...", "body": "...", "icon": "/icons/wc-192.png" },
    "data": { "type": "lead_assigned|viewing_reminder|...", "entityId": "...", "url": "/crm/..." }
  }
  ```
- SW `notificationclick` handler: navigates to `data.url` via `clients.openWindow`
- Opt-out: `DELETE /api/v1/push/token` removes FCM token; no further pushes

### 4. Mobile-Optimised UI Components

- Bottom navigation bar (≤ 768px): tabs — Home, Leads, Properties, Viewings, More
- Floating Action Button (FAB): "+" to add lead / add property / book viewing based on active section
- Swipe gestures:
  - Lead card: swipe-right = call, swipe-left = snooze (7 days)
  - Viewing card: swipe-right = confirm, swipe-left = reschedule
- Pull-to-refresh on lead list and viewing list (triggers NetworkFirst re-fetch)
- Mobile search bar: sticky top bar with debounced live search (300ms)
- Touch target minimum: 44×44 CSS pixels per WCAG 2.1 Success Criterion 2.5.5
- Property photo carousel: native touch-scroll, lazy-loaded, WebP format served by Cloudinary
- Agent dashboard mobile view: single-column KPI tiles, horizontal scroll for chart section

### 5. Lighthouse CI Gate

- Lighthouse CI configured in `.github/workflows/lighthouse.yml`
- Minimum scores for PWA category: 90/100
- Minimum scores: Performance ≥ 85, Accessibility ≥ 95, Best Practices ≥ 90, SEO ≥ 90
- PWA checklist: installable + splash screen + offline + maskable icon all pass
- CI fails PR if any Lighthouse score drops below threshold

### 6. Mobile Performance Budget

| Metric | Target |
|---|---|
| Largest Contentful Paint (LCP) | < 2.5s on 4G (Moto G4 simulation) |
| First Input Delay (FID) / INP | < 100ms |
| Cumulative Layout Shift (CLS) | < 0.1 |
| Time to Interactive (TTI) | < 5s on 4G |
| Total JS bundle (gzipped) | < 350 KB |
| Total CSS | < 50 KB |
| Service Worker install time | < 3s |

---

## Requirement IDs (Wave 23)

| ID | Requirement |
|---|---|
| `REQ-MOB-001` | Service Worker registered via Workbox; app shell cached CacheFirst |
| `REQ-MOB-002` | GET API routes served from cache fallback after 5-second network timeout |
| `REQ-MOB-003` | POST/PATCH/DELETE requests queued in Background Sync when offline |
| `REQ-MOB-004` | Offline banner visible and accurate |
| `REQ-MOB-005` | PWA manifest passes Chrome installability checklist |
| `REQ-MOB-006` | Custom install prompt surfaces after 2nd visit + 60-second engagement |
| `REQ-MOB-007` | New lead push notification delivered within 30 seconds of assignment |
| `REQ-MOB-008` | Viewing reminder push notification fires 30 minutes before scheduled time |
| `REQ-MOB-009` | Agent can opt out of push notifications; token deleted from `user_push_tokens` |
| `REQ-MOB-010` | Bottom navigation bar renders on ≤ 768px viewports |
| `REQ-MOB-011` | Swipe-right on lead card triggers call intent; swipe-left snoozes 7 days |
| `REQ-MOB-012` | Touch targets are ≥ 44×44 CSS pixels |
| `REQ-MOB-013` | Lighthouse PWA score ≥ 90 in CI; Performance ≥ 85 |
| `REQ-MOB-014` | Total gzipped JS bundle ≤ 350 KB |

---

## Data Models

### `user_push_tokens` Collection

```typescript
{
  userId: string;           // Firebase UID
  fcmToken: string;         // FCM device registration token
  deviceType: 'web' | 'ios' | 'android';
  userAgent: string;
  subscribedAt: Date;
  lastActiveAt: Date;
  active: boolean;
}
```

### Background Sync Queue Entry (IndexedDB)

```typescript
{
  id: string;               // UUID
  method: 'POST' | 'PATCH' | 'DELETE';
  url: string;
  body: string;             // JSON stringified
  headers: Record<string, string>;
  timestamp: number;        // Unix ms
  retryCount: number;
  tag: 'crm-writes-queue';
}
```

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/push/subscribe` | Agent+ | Register FCM token |
| DELETE | `/api/v1/push/token` | Agent+ | Remove FCM token (opt-out) |
| POST | `/api/v1/push/send` | Internal (service) | Send push to userId (internal use) |
| GET | `/api/v1/push/status` | Agent+ | Get current push subscription status |

---

## Technical Architecture

```
[Agent Mobile Browser]
       │
       ├── SW registers → Workbox caches app shell + API routes
       ├── FCM subscription → token stored in MongoDB
       │
[White Caves Server]
       ├── Event bus (EventEmitter / Redis pub-sub)
       │     └── on lead_assigned → POST FCM HTTP v1 API
       │
[FCM]  ── push → [Agent Device SW]
              └── notificationclick → /crm/leads/{id}
```

---

## Acceptance Gate (Wave-Level)

Wave 23 is complete when:

1. Service Worker registers in Chrome/Safari/Firefox without console errors
2. App shell loads offline after initial visit (verified with DevTools → Offline toggle)
3. Write operations queued offline sync correctly on reconnect (verified with Network → Slow 3G → Offline)
4. FCM push notification arrives on desktop + Android Chrome within 30 seconds of lead assignment
5. iOS Safari home screen install works with correct splash screen and icon
6. Lighthouse CI gate green (PWA ≥ 90, Performance ≥ 85, Accessibility ≥ 95)
7. Bundle size report confirms JS ≤ 350 KB gzipped
8. `npm run plans:validate` green
9. Evidence committed to `PROJECT_PROGRESS.md` and `DAILY_MILESTONE_TRACKER.md`
