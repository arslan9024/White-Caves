# Wave 15 — PWA Readiness: Service Worker + Manifest + Offline Behaviour

<!-- markdownlint-disable MD060 -->

**Drafted by:** @PWA  
**Model:** DeepSeek V3  
**Status:** ✅ READY (retrospective spec for implemented Wave 15)  
**Last Updated:** 2026-05-25  
**Next Review:** 2026-08-21  
**Source of Truth:** CRM Wave 15 PWA readiness feature specification (business layer)

## Canonical governance links

- [`../05_requirements/functional-requirements.md`](../05_requirements/functional-requirements.md)
- [`../05_requirements/non-functional-requirements.md`](../05_requirements/non-functional-requirements.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)

## Feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- frontend installability/offline UX lanes in `docs/plans/waves/WAVE_39_*` and `WAVE_40_*`

CONSUMES←@Redis: `business_docs/09_crm_features/wave-15-cache-performance.md#performance-baseline`  
FEEDS→@Una: `business_docs/06_design_architecture/ui-ux-specification.md#pwa`  
FEEDS_ACK←@Katherine: accepted | `business_docs/09_crm_features/wave-15-pwa-readiness.md`

---

## 1. Overview

Wave 15 establishes the PWA foundation for White Caves, enabling installability and basic offline support. The implementation uses a hand-written service worker (`public/sw.js`) and a `manifest.json` in the `public/` directory.

---

## 2. Web App Manifest (`public/manifest.json`)

```json
{
  "name": "White Caves Real Estate",
  "short_name": "White Caves",
  "description": "Luxury Real Estate CRM — Dubai",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0a",
  "theme_color": "#C9A84C",
  "orientation": "portrait-primary",
  "icons": [
    { "src": "/generated-icon.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/generated-icon.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/favicon.svg", "sizes": "any", "type": "image/svg+xml", "purpose": "maskable" }
  ]
}
```

**Manifest linked in `index.html`:**

```html
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#C9A84C" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
```

---

## 3. Service Worker (`public/sw.js`)

### 3.1 Cache Strategy: Cache-First with Network Fallback

```text
Request
  → Check cache first
  → If cached: return immediately (Cache HIT)
  → If not cached: fetch from network → cache response → return
  → If network fails + no cache: return offline.html
```

### 3.2 Pre-Cached App Shell

The following resources are cached on service worker install:

```javascript
const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/offline.html',
  '/favicon.svg',
];
```

All JS/CSS assets from the Vite build are cached on first fetch (runtime caching via `fetch` event handler).

### 3.3 SW Lifecycle

| Event | Action |
|-------|--------|
| `install` | Pre-cache app shell; `skipWaiting()` |
| `activate` | Delete old caches; `clients.claim()` |
| `fetch` | Cache-first for same-origin requests; network-only for external APIs |

### 3.4 Network-Only Bypass Rules

The following request patterns bypass the cache entirely:

- `POST`, `PUT`, `PATCH`, `DELETE` requests (mutations always go to network)
- `/api/*` routes (always fresh from server)
- Socket.io connections (`/socket.io/*`)
- Third-party URLs (different origin)

---

## 4. Offline Page (`public/offline.html`)

A standalone minimal HTML page displayed when:

- The user is offline AND
- The requested page is not in cache

**Content:** White Caves logo + "You're offline" message + retry button + "Return to Dashboard" link.

---

## 5. Service Worker Registration

```typescript
// src/main.tsx
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(err => console.warn('SW registration failed:', err));
  });
}
```

---

## 6. PWA Install Prompt

A custom install prompt is displayed to eligible users (those who have not installed and are using the app for ≥ 3 sessions):

```typescript
// Listen for beforeinstallprompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallBanner();
});
```

Install banner appears at the top of the page with:

- "Install White Caves App" text
- "Install" button → triggers `deferredPrompt.prompt()`
- "Not now" dismiss button (suppressed for 7 days)

---

## 7. Lighthouse PWA Checklist

| Criterion | Target | Implemented |
|-----------|--------|-------------|
| `manifest.json` with valid `start_url` | ✅ | ✅ |
| Service worker registered | ✅ | ✅ |
| HTTPS (production) | ✅ | ✅ (Vercel) |
| Icons ≥ 192×192 and 512×512 | ✅ | ✅ |
| `theme_color` set | ✅ | ✅ `#C9A84C` |
| Offline page | ✅ | ✅ `offline.html` |
| Maskable icon | ✅ | ✅ `favicon.svg` |
| Lighthouse PWA score | ≥ 90 | Targeted via Wave 17 CI gate |

---

## 8. Future Enhancements (Wave 18+)

- **Background sync** — Queue failed form submissions for retry when connection restored
- **Push notifications** — Web Push API integration with backend `NotificationService`
- **Workbox migration** — Replace hand-written SW with `vite-plugin-pwa` + Workbox for better cache versioning
- **App badge API** — Show unread notification count on installed app icon

---

## 9. Acceptance Criteria

- [x] `manifest.json` is valid and linked in `index.html`
- [x] Service worker registers successfully on page load
- [x] App shell pre-cached on first install
- [x] Offline page shown when both offline and URL not in cache
- [x] API routes (`/api/*`) always bypass SW cache
- [x] Mutations (`POST`/`PUT`/`PATCH`/`DELETE`) bypass SW cache
- [x] Install prompt displayed to eligible users
- [x] `theme_color` matches White Caves gold (`#C9A84C`)
