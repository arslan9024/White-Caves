# Phase 10 — Mobile PWA & Advanced Features

> **Priority**: #10 — Final Phase
> **Goal**: Transform White Caves into a Progressive Web App with offline support, push notifications, mobile-first navigation, and advanced AI features
> **Prerequisite**: All previous phases (1–9) complete
> **Status**: 🔲 Not Started
> **Detailed context**: See [`PHASE_3_AND_BEYOND.md`](./PHASE_3_AND_BEYOND.md#phase-10--mobile-pwa--advanced-features-final)

---

## Why This Is Phase 10

PWA capabilities provide native-app-like experiences without the App Store. For real estate agents
in Dubai who are always on-the-go, offline access to property listings, push notifications for new
leads, and a mobile-optimised bottom tab bar are significant quality-of-life improvements.
Advanced AI features (Cipher market intelligence, Maven ROI calculator) are also included here
as they require a stable underlying data platform.

---

## External Dependencies

| Dependency              | Owner           | Notes                                                                    |
| ----------------------- | --------------- | ------------------------------------------------------------------------ |
| VAPID keys for Web Push | DevOps          | `npm install web-push`, generate with `npx web-push generate-vapid-keys` |
| `vite-plugin-pwa`       | Internal        | `npm install vite-plugin-pwa`                                            |
| Service Worker setup    | Internal        | Handled by `vite-plugin-pwa` (Workbox)                                   |
| OpenAI API key          | Business/DevOps | For Cipher AI market analysis                                            |

---

## What Already Exists ✅

| Item                           | Location                                    | Status                                               |
| ------------------------------ | ------------------------------------------- | ---------------------------------------------------- |
| Cipher Market CRM              | `src/components/crm/CipherMarketCRM.jsx`    | ✅ UI shell exists                                   |
| Maven Investment CRM           | `src/components/crm/MavenInvestmentCRM.jsx` | ✅ UI shell exists                                   |
| Mobile CSS classes             | `src/pages/RolePages.css`                   | ✅ Responsive styles exist                           |
| Mortgage calculator (frontend) | Various                                     | ✅ Frontend math exists (backend validation pending) |

---

## What Needs To Be Done 🚧

### 10.1 — PWA Manifest & Service Worker

- [ ] Install `vite-plugin-pwa`: `npm install -D vite-plugin-pwa`
- [ ] Configure in `vite.config.js`:
  - App name: "White Caves"
  - Short name: "White Caves"
  - Theme color: `#c8a84b` (gold brand color)
  - Background color: `#1a1a2e` (dark brand)
  - Display: `standalone`
  - Start URL: `/`
  - Icons: 192×192 and 512×512 WebP/PNG (White Caves logo)
- [ ] Generate `public/manifest.json` via `vite-plugin-pwa`
- [ ] Workbox service worker: cache strategies
  - Static assets (JS/CSS/fonts): `CacheFirst`, 30-day TTL
  - API calls (`/api/properties`): `NetworkFirst` with offline fallback
  - Images: `CacheFirst`, 7-day TTL
- [ ] Offline fallback page: `public/offline.html` — "You're offline. Your saved properties are still available."
- [ ] Test: Chrome DevTools → Application → Service Workers — verify registration
- [ ] Test: Lighthouse PWA audit — all checks green

---

### 10.2 — Push Notifications

- [ ] Install `web-push`: `npm install web-push`
- [ ] Generate VAPID keys: `npx web-push generate-vapid-keys` → store in env vars
- [ ] `POST /api/notifications/subscribe` — save `PushSubscription` object to `User.pushSubscription`
- [ ] Trigger push for:
  - New lead assigned to agent: "New lead: [name] is looking for a [type] in [area]"
  - Commission paid: "Commission of AED [amount] has been processed"
  - Rent due in 3 days: "Rent payment of AED [amount] is due on [date]"
  - Maintenance request updated: "Your maintenance request #[id] has been updated"
- [ ] Frontend: `NotificationService.ts` — request browser permission, subscribe, save to API
- [ ] Test: use Chrome DevTools → Application → Push to verify notification receipt

---

### 10.3 — Mobile-Optimised Navigation

- [ ] Bottom tab bar for mobile (< 768px): Home | Properties | Leads | WhatsApp | Profile
- [ ] Replace hamburger menu on mobile with bottom tab bar
- [ ] CRM mobile sidebar: collapses to icon-only rail at 1024px, hidden below 768px with swipe-open gesture
- [ ] Touch targets: all interactive elements ≥ 44×44px (verify across all pages)
- [ ] Swipe gestures: swipe right to open sidebar, swipe left to close (via `TouchEvent` handlers)

---

### 10.4 — Offline Read Mode

- [ ] Cached property list: service worker caches last known `/api/properties` response
- [ ] Offline indicator: banner "You're offline — showing cached data" when `navigator.onLine === false`
- [ ] Property detail pages: cache last viewed detail pages in service worker
- [ ] Block write operations offline: disable form submit buttons, show tooltip "Connect to internet to submit"
- [ ] Background sync: queue form submissions (maintenance request, lead note) while offline → submit when online

---

### 10.5 — Cipher AI Market Intelligence

**Goal**: Wire `CipherMarketCRM` to real OpenAI-powered DLD market analysis.

- [ ] Create `server/services/CipherService.ts`
- [ ] `POST /api/cipher/market-analysis` — body: `{ area, propertyType, period }` → calls OpenAI GPT-4 with DLD market context
- [ ] DLD data context: supply recent transaction prices from `Transaction` model as prompt context
- [ ] Response: market trend summary, recommended listing price range, comparable properties
- [ ] Wire `CipherMarketCRM` tabs to these endpoints (replace placeholder UI)
- [ ] Cache analysis results: same query within 24 hours returns cached result

---

### 10.6 — Maven Investment ROI Calculator

**Goal**: Wire `MavenInvestmentCRM` to a backend ROI calculation engine.

- [ ] `POST /api/maven/roi-calculation` — body: `{ purchasePrice, area, propertyType, bedrooms, financed, downPayment, interestRate }`
- [ ] Returns: `{ grossYield, netYield, monthlyRent, annualRent, 5yearProjection, breakEvenYears }`
- [ ] Use area average rent data from `Transaction` model (leases) to estimate rental income
- [ ] Wire `MavenInvestmentCRM` calculator form to this endpoint
- [ ] Export to PDF: "Investment Summary" report (uses Phase 7 PDFKit)

---

### 10.7 — Mortgage Calculator Backend Validation

> Currently: frontend-only math (no validation, no regulatory check)

- [ ] `POST /api/calculator/mortgage` — validate: purchase price, down payment %, tenure, interest rate
- [ ] UAE regulations: minimum 20% down payment for UAE nationals, 25% for expats (first property)
- [ ] Return: monthly payment, total interest, total cost, eligibility note
- [ ] Trigger warning if down payment below regulatory minimum

---

## Definition of Done — Phase 10

- [ ] PWA installs correctly on iPhone (Safari "Add to Home Screen") and Android Chrome
- [ ] Lighthouse PWA score ≥ 90
- [ ] Service worker caches property list for offline viewing
- [ ] Push notification received on mobile when new lead is assigned
- [ ] Bottom tab bar replaces hamburger on mobile
- [ ] Cipher market analysis returns real GPT-4 response (requires OpenAI API key)
- [ ] Maven ROI calculator uses real rental yield data from DB
- [ ] Mortgage calculator validates against UAE regulatory minimums
- [ ] All 40 AI assistants registered and functional
- [ ] Tests pass: `npx vitest run`
- [ ] Build passes: `npm run build`

---

## 🎉 All 10 Phases Complete

When Phase 10 is done, White Caves is the #1 Real Estate Platform in Dubai:

| Capability                                               | Status      |
| -------------------------------------------------------- | ----------- |
| Public homepage (luxury, SEO-optimised)                  | ✅ Phase 1  |
| Landlord & Tenant self-service portals                   | ✅ Phase 2  |
| Full CRM for managing director                           | ✅ Phase 3  |
| WhatsApp-native communication (Nina/Nadia/Olivia)        | ✅ Phase 4  |
| Lease/Ejari/RentPayment full lifecycle                   | ✅ Phase 5  |
| RERA/KYC/AML/PDPL compliance automation                  | ✅ Phase 6  |
| Portal syndication + financial exports + multi-currency  | ✅ Phase 7  |
| Full Arabic RTL internationalisation                     | ✅ Phase 8  |
| Multi-user RBAC + agent onboarding + audit log           | ✅ Phase 9  |
| Mobile PWA + push notifications + AI market intelligence | ✅ Phase 10 |
