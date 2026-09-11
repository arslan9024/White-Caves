# Wave 15: PWA Readiness Specifications

## 1. Overview
The White Caves platform operates as a Progressive Web App (PWA). This ensures agents can access property details and lead data even in low-connectivity areas (e.g., inside new constructions without 5G).

## 2. Service Worker Lifecycle
- **Install**: Service Worker caches all critical CSS, JS bundles, and core fonts (Inter, Cormorant Garamond).
- **Activate**: Service Worker purges old cache versions to ensure users receive the latest application shell.
- **Fetch**: Intercepts requests. Follows a `Stale-While-Revalidate` strategy for API requests and a `Cache-First` strategy for static assets.

## 3. Offline Scope
- The PWA scope is set to `/`.
- If offline, the `OfflineAlertBanner` UI component automatically renders globally via `AppShell.tsx`.
- Property searches made offline will yield results from the local IndexedDB cache if previously viewed.

## 4. Rollback Conditions
- A `KILL_SW` feature flag is available. If set to true, the Service Worker immediately unregisters and forces a hard reload, restoring the app to standard web behavior.
