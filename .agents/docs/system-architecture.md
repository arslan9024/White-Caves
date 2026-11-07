# System Architecture — White Caves CRM Platform

> **Version:** 1.0  
> **Last Updated:** March 2026  
> **Purpose:** Defines the technical architecture of the platform

---

## 1. High-Level Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                     WHITE CAVES CRM PLATFORM                        │
├──────────────────────┬──────────────────────┬───────────────────────┤
│   CLIENT LAYER       │    API LAYER         │   DATA LAYER          │
│                      │                      │                       │
│ ┌──────────────────┐ │ ┌──────────────────┐ │ ┌───────────────────┐ │
│ │ React 18 SPA     │ │ │ Express.js       │ │ │ MongoDB Atlas     │ │
│ │ TypeScript       │◄──┤ TypeScript       │◄──┤ (Primary DB)      │ │
│ │ Redux Toolkit    │ │ │ REST API         │ │ │                   │ │
│ │ Styled Components│ │ │                  │ │ │ Prisma ORM        │ │
│ └──────────────────┘ │ └──────────────────┘ │ └───────────────────┘ │
│                      │         │            │                       │
│ ┌──────────────────┐ │ ┌──────────────────┐ │ ┌───────────────────┐ │
│ │ Vite Build Tool  │ │ │ Middleware Stack  │ │ │ Cloud Storage     │ │
│ │                  │ │ │ • Auth (JWT)     │ │ │ (S3-compatible)   │ │
│ └──────────────────┘ │ │ • Rate Limiting  │ │ │ Media / Docs      │ │
│                      │ │ • CORS / Helmet  │ │ └───────────────────┘ │
│                      │ │ • Error Handling │ │                       │
│                      │ └──────────────────┘ │                       │
└──────────────────────┴──────────────────────┴───────────────────────┘
                                │
                                ▼
              ┌─────────────────────────────────┐
              │       EXTERNAL INTEGRATIONS     │
              ├─────────────────────────────────┤
              │ • WhatsApp Cloud API (Meta)      │
              │ • PropertyFinder API             │
              │ • Bayut API                      │
              │ • Firebase Auth                  │
              │ • Stripe Payments                │
              │ • Exchange Rate API              │
              │ • SendGrid / Email               │
              └─────────────────────────────────┘
```

---

## 2. Frontend Architecture

### Technology Stack

| Component        | Technology                      | Version           |
| ---------------- | ------------------------------- | ----------------- |
| Framework        | React                           | 18.x              |
| Language         | TypeScript                      | 5.x (strict mode) |
| State Management | Redux Toolkit                   | 2.x               |
| Build Tool       | Vite                            | 5.x               |
| Styling          | Styled Components + CSS Modules | 6.x               |
| Routing          | React Router DOM                | 6.x               |
| HTTP Client      | Axios                           | 1.x               |
| Forms            | React Hook Form                 | 7.x               |
| Testing          | Vitest + React Testing Library  | Latest            |

### Application Structure

```
src/
├── App.tsx                   # Root component + router setup
├── components/               # Page-level feature components
│   ├── crm/                  # CRM-specific views
│   │   ├── admin/            # Admin-only components
│   │   ├── leads/            # Lead management components
│   │   ├── properties/       # Property management components
│   │   ├── shared/           # Shared CRM UI elements
│   │   └── whatsapp/         # WhatsApp inbox components
│   └── [other components]
├── shared/
│   └── components/           # Reusable design system components
│       ├── ui/               # Button, Input, Modal, Badge, etc.
│       ├── layout/           # Grid, Flex, Container, Stack
│       ├── dashboard/        # Dashboard layout + navigation
│       ├── data/             # DataTable, StatCard
│       └── properties/       # PropertyCard, PropertyFilters
├── store/                    # Redux store
│   ├── store.tsx             # Store configuration
│   ├── authSlice.tsx         # Auth state
│   ├── crmDataSlice.tsx      # CRM data
│   ├── propertySlice.tsx     # Properties
│   ├── roleSlice.tsx         # Role/permissions
│   └── slices/               # Feature slices
├── services/                 # API service layer
│   ├── authService.ts        # Auth API calls
│   └── assistantsService.ts  # AI assistant API calls
├── utils/                    # Utility functions
│   ├── apiClient.ts          # Axios instance + interceptors
│   ├── authFetch.ts          # Authenticated fetch wrapper
│   ├── permissions.ts        # RBAC permission helpers
│   └── validation.ts         # Form validation helpers
├── types/
│   └── index.ts              # All TypeScript type definitions
└── styles/                   # Global styles and theme tokens
```

### State Management Slices

| Slice                       | Purpose                                  |
| --------------------------- | ---------------------------------------- |
| `authSlice`                 | User auth state, JWT token, login/logout |
| `crmDataSlice`              | Leads, clients, transactions             |
| `propertySlice`             | Property listings + filters              |
| `roleSlice`                 | Current user role + permissions          |
| `dashboardSlice`            | Dashboard KPIs and metrics               |
| `analyticsSlice`            | Analytics/reporting data                 |
| `whatsappSlice`             | WhatsApp conversations + messages        |
| `inventorySlice`            | Property inventory management            |
| `aiAssistantDashboardSlice` | AI assistant state                       |
| `notificationSlice`         | In-app notifications                     |
| `sidebarSlice`              | Sidebar open/closed state                |
| `navigationSlice`           | Active route and breadcrumbs             |

---

## 3. Backend Architecture

### Technology Stack

| Component        | Technology         | Version         |
| ---------------- | ------------------ | --------------- |
| Runtime          | Node.js            | 20.x LTS        |
| Framework        | Express.js         | 4.x             |
| Language         | TypeScript         | 5.x             |
| ORM              | Prisma             | 5.x             |
| Database         | MongoDB            | 7.x (via Atlas) |
| Authentication   | JWT (jsonwebtoken) | 9.x             |
| Password Hashing | bcrypt             | 5.x             |
| Validation       | Custom + Zod       | —               |
| Logging          | Winston            | 3.x             |
| Testing          | Jest               | 29.x            |

### API Route Structure

```
server/
├── index.ts                  # Express app + server startup
├── database.ts               # MongoDB connection + Prisma client
├── middleware/
│   ├── auth.ts               # JWT verification middleware
│   ├── errorHandler.ts       # Global error handling + AppError class
│   └── rateLimiter.ts        # express-rate-limit configuration
├── routes/
│   ├── auth.ts               # POST /api/auth/{login,register,logout,refresh}
│   ├── leads.ts              # CRUD /api/leads
│   ├── properties.ts         # CRUD /api/properties
│   ├── agents.ts             # CRUD /api/agents (+ /api/users alias)
│   ├── transactions.ts       # CRUD /api/transactions
│   ├── finance.ts            # /api/finance/{summary,commissions}
│   ├── tenants.ts            # CRUD /api/tenants
│   ├── communications.ts     # /api/communications/messages
│   ├── compliance.ts         # /api/compliance/{status,requirements}
│   ├── reporting.ts          # /api/dashboard/{summary,analytics}
│   ├── crm.ts                # /api/crm/{dashboard,analytics,search}
│   └── assistants.ts         # /api/assistants (AI assistant plans)
├── services/
│   ├── LeadsService.ts       # Lead business logic
│   ├── PropertiesService.ts  # Property business logic
│   ├── WhatsAppBotService.ts # WhatsApp API integration (partial)
│   └── dashboardService.ts   # Dashboard aggregations
├── config/
│   ├── env.ts                # Environment variable validation
│   └── pagination.ts         # Pagination defaults
└── utils/
    ├── apiResponse.ts        # Standardised response helpers
    ├── sanitize.ts           # Input sanitisation
    ├── validate.ts           # Request validation helpers
    └── logger.ts             # Winston logger configuration
```

### Authentication Flow

```
Client                     Server                    Database
  │                           │                          │
  ├── POST /api/auth/login ──▶│                          │
  │   {email, password}       │                          │
  │                           ├── Find user by email ──▶│
  │                           │◀── user record ──────────┤
  │                           ├── bcrypt.compare(password, hash)
  │                           │                          │
  │                           ├── [2FA enabled?]         │
  │                           │   └── Return: needsOtp=true
  │◀── {token, user} ─────────┤                          │
  │    JWT (24h expiry)        │                          │
  │                           │                          │
  ├── GET /api/leads ─────────▶                          │
  │   Authorization: Bearer {token}                      │
  │                           ├── authMiddleware:        │
  │                           │   verify JWT + set req.user
  │                           ├── Route handler ──────── ▶
  │                           │◀── DB results ─────────  │
  │◀── {success, data} ───────┤                          │
```

---

## 4. Database Schema Overview

### Core Collections (MongoDB via Prisma)

```
Users ──────────────── one-to-many ──▶ Leads (assigned)
  │                                     │
  │                                     └── many-to-many ──▶ Properties
  └── one-to-many ──────────────────────▶ Commissions

Properties ─────────── one-to-many ──▶ Leads
  │                                     │
  └── one-to-one ───────────────────── Transactions

Transactions ───────── one-to-many ──▶ Commissions

Tenants ─────────────── one-to-many ──▶ Leases
  │
  └── Lease ───────────── one-to-many ──▶ RentPayments
                  │
                  └── one-to-many ──▶ MaintenanceRequests

Leads ──────────────── one-to-many ──▶ Activities
  │
  └── one-to-many ──▶ Communications (WhatsApp + Email)

Audit trail: Activities table records all system events
```

---

## 5. Security Architecture

### Request Security Layers

```
Internet
  │
  ▼
[Cloudflare / CDN — DDoS protection + WAF]
  │
  ▼
[Load Balancer — HTTPS termination + TLS 1.3]
  │
  ▼
[Express App]
  │
  ├── Helmet (HTTP security headers)
  ├── CORS (whitelist only)
  ├── Rate Limiter (per IP)
  ├── Content-Type enforcement
  ├── Body size limit (1 MB)
  ├── JWT Auth middleware
  ├── Input sanitisation (every route)
  └── Role-based access check (per route)
```

---

## 6. Deployment Architecture

### Environments

| Environment | Purpose                | Database                  | Branch     |
| ----------- | ---------------------- | ------------------------- | ---------- |
| Development | Local dev              | MongoDB local / Atlas Dev | feature/\* |
| Staging     | Pre-production testing | Atlas Staging cluster     | main       |
| Production  | Live platform          | Atlas Production cluster  | release/\* |

### Infrastructure

- **Frontend Hosting:** Vercel (static site deployment with preview URLs per PR)
- **API Hosting:** Railway / Render / AWS ECS (containerised Node.js)
- **Database:** MongoDB Atlas (UAE North region — data residency)
- **File Storage:** AWS S3 or Cloudflare R2 (UAE region)
- **CDN:** Cloudflare (static assets + media)
- **Monitoring:** UptimeRobot + Sentry (error tracking) + Datadog (metrics)

### CI/CD Pipeline

```
Developer pushes code
        │
        ▼
[GitHub Actions CI]
├── npm run lint (ESLint)
├── npm run type-check (tsc --noEmit)
├── npm run test (Vitest + Jest)
└── npm run build (Vite + tsc compile)
        │
        ▼ (all pass)
[Vercel Preview Deploy] ← for PRs
        │
        ▼ (merged to main)
[Staging Deployment] → smoke tests
        │
        ▼ (approved)
[Production Deployment] → zero-downtime rolling update
```

---

## 7. Architecture Decision Records (ADRs)

| ADR     | Decision                                                         | Date     | Status   |
| ------- | ---------------------------------------------------------------- | -------- | -------- |
| ADR-001 | Design system rebrand to gold/dark theme                         | Feb 2026 | Accepted |
| ADR-002 | AI assistant plans served via REST API, stored as Markdown files | Feb 2026 | Accepted |
| ADR-003 | MongoDB over PostgreSQL for flexible document schema             | Jan 2026 | Accepted |
| ADR-004 | WhatsApp Cloud API over on-premise WABA                          | Planned  | Proposed |
| ADR-005 | Cloud object storage for media (not local disk)                  | Planned  | Proposed |
| ADR-006 | Prisma ORM for type-safe MongoDB access                          | Jan 2026 | Accepted |

---

## 8. Frontend Rendering & Event Architecture Standard

### 8.1 Objective

Establish a scalable frontend standard that improves:

- Arabic/RTL localization maintainability
- UI responsiveness and perceived performance
- Rendering efficiency under high dashboard complexity

### 8.2 Component Granularity Policy

The platform adopts **small, cohesive React functional components**.

- Components should represent a stable UI/domain concern (card header, KPI tile body, row actions).
- Avoid excessive micro-fragmentation that increases prop drilling and maintenance overhead.
- Keep business orchestration in container-level components/hooks; keep view components presentational.

### 8.3 Event-Driven Rendering Model

All major UI flows follow event-driven architecture:

```
UI Trigger
  -> Redux/Domain Action
  -> Async Side Effect (API/service) [optional]
  -> Store Mutation
  -> Selector-based Targeted Re-render
  -> User Feedback (loading/success/error)
```

### 8.4 Mandatory Technical Practices

1. **Selector-first subscriptions**

- components read only the slice they need.

2. **Memoization boundaries**

- `React.memo`, `useMemo`, and `useCallback` where rerender pressure is measurable.

3. **Lazy-triggered module rendering**

- render heavy modules only when route/tab/feature trigger is active.

4. **Action-based interaction contracts**

- avoid implicit state coupling across unrelated UI sections.

5. **State locality discipline**

- local UI state stays local; shared domain state lives in store.

### 8.5 Localization and RTL Architecture Hooks

- Translation dictionaries must be consumable at leaf render nodes.
- Direction-aware layout tokens must support runtime RTL switch.
- Component APIs must avoid hardcoded alignment/ordering assumptions.

### 8.6 Verification Requirements

Before marking a migration wave complete:

1. React Profiler evidence for reduced unnecessary rerenders on critical flows.
2. Unit/integration tests unchanged or improved.
3. Arabic RTL visual parity checklist passed for auth + CRM shell + top dashboard tabs.
4. No regression in route-level code splitting and lazy loading behavior.

---

## 9. Interactive Map Search Architecture

### 9.1 Overview

The map-based property search is a core discovery feature. It displays geo-located property pins, neighborhood clusters, and area price heatmaps with real-time filter synchronization.

### 9.2 Frontend Map Component

| Layer | Technology | Purpose |
|---|---|---|
| Base map | Leaflet.js v1.9 (OSM dev) / Mapbox GL JS (prod) | Tile rendering |
| Clustering | `leaflet.markercluster` | Group >50 pins in viewport |
| Heatmap | Leaflet choropleth layer (Recharts fallback) | Price per sqft by area |
| GeoJSON | `public/geojson/dubai-areas.geojson` | 30 Dubai neighborhood polygons |

**Pin rendering rules:**
- Each pin shows price label (e.g., "AED 1.2M") and bedroom count
- Cluster bubble shows count; click expands
- Max 500 visible pins per viewport (beyond threshold → clusters only)
- Property card popup on pin click: photo thumbnail, price, beds/baths, deep-link

**Sidebar sync:**
- Sidebar property list reflects only pins in current viewport bounding box
- List virtualized (react-window) for performance
- Scroll-to-pin on list item hover

### 9.3 Geospatial Backend

```typescript
// MongoDB 2dsphere index
db.properties.createIndex({ location: "2dsphere" })

// Property location schema
location: {
  type: "Point",
  coordinates: [longitude, latitude]  // GeoJSON standard: lng first
}

// Radius search (km)
db.properties.find({
  location: {
    $near: {
      $geometry: { type: "Point", coordinates: [lng, lat] },
      $maxDistance: radiusMeters
    }
  }
})

// Polygon neighborhood search
db.properties.find({
  location: {
    $geoWithin: {
      $geometry: neighborhoodPolygon  // GeoJSON Polygon
    }
  }
})
```

### 9.4 Viewport Performance Guard

1. Every map move triggers `GET /api/v1/properties/map?bbox=lng1,lat1,lng2,lat2&filters=...`
2. Backend limits response to 500 pins within bbox
3. Debounce: 300ms after map move stops before API call fires
4. Response cached for identical bbox queries (Redis, 60s TTL)

### 9.5 Saved Map Search

- User saves current viewport bbox + active filters as named search
- `POST /api/v1/saved-searches` stores bbox, filters, name, alertEnabled
- Background cron (every 4 hours) checks new listings matching saved search bbox
- Push notification + email on match

### 9.6 Dubai Area GeoJSON

- Source: OpenStreetMap Overpass API export
- File: `public/geojson/dubai-areas.geojson`
- Neighborhoods covered: Downtown Dubai, Dubai Marina, JBR, JVC, JLT, DIFC, Business Bay, Palm Jumeirah, Jumeirah, Mirdif, Deira, Bur Dubai, Dubai Hills Estate, Arabian Ranches, Emirates Hills, Al Barsha, Jumeirah Village Circle, Silicon Oasis, International City, Sports City, Motor City, Damac Hills, Reem, Mudon, Akoya, Dubai Creek Harbour, MBR City, Expo City, Al Furjan, Discovery Gardens
- Update frequency: Annually; admin panel upload for additions

---

## 10. Cache & Redis Architecture

### 10.1 Caching Strategy

| Data Type | Cache Layer | TTL | Invalidation |
|---|---|---|---|
| Property listings (search) | Redis | 5 min | On property update |
| Map bbox results | Redis | 60 sec | On property update in bbox |
| Analytics snapshots | Redis | 15 min | Nightly cron refresh |
| Live counters (leads/viewings) | Redis (INCR) | Persistent | Atomic INCR/DECR on events |
| Currency exchange rates | Redis | 4 hours | Stale-while-revalidate |
| RERA rental index | Redis | 24 hours | Admin manual refresh |
| User session tokens | Redis | 7 days | On logout / password change |

### 10.2 Redis Key Namespace

```
wc:search:bbox:{bbox_hash}         → bbox property results
wc:property:{propertyId}           → full property detail
wc:analytics:live:leads            → today's lead count (INCR)
wc:analytics:live:viewings         → active viewings count (INCR)
wc:analytics:live:maintenance      → open maintenance tickets (INCR)
wc:currency:rate:{from}:{to}       → exchange rate
wc:rera:rental-index:{year}        → RERA rental index table
wc:session:{userId}                → JWT refresh token
wc:rate-limit:{ip}:{endpoint}      → rate-limit sliding window
```

### 10.3 Cache Invalidation Patterns

1. **Property update** → delete `wc:property:{id}`, delete all `wc:search:bbox:*` (pattern flush on update)
2. **Deal close** → INCR `wc:analytics:live:deals`; nightly cron writes to persistent analytics_snapshots
3. **Session logout** → delete `wc:session:{userId}` immediately
4. **Redis restart** → rehydrate live counters from MongoDB aggregation on startup (async, 200ms budget)

### 10.4 Redis Cluster Sizing (Atlas / Railway)

| Environment | Tier | Memory | Use Case |
|---|---|---|---|
| Development | Local Redis (Docker) | 256MB | Dev only |
| Staging | Redis Cloud Free (30MB) | 30MB | Smoke tests |
| Production | Redis Cloud Essentials | 1GB → 5GB | Full prod load |

### 10.5 Circuit Breaker Pattern

- All Redis calls wrapped in try/catch
- On Redis failure → fallback to MongoDB query (log warning, no user-facing error)
- Redis health included in `/api/v1/health` endpoint response

---

## 11. PWA & Offline Architecture

### 11.1 Service Worker Strategy

| Route Category | Cache Strategy | Offline Behavior |
|---|---|---|
| Static assets (JS/CSS/fonts) | Cache-first (Workbox) | Served from cache always |
| API: property listings | Network-first (15s timeout) | Serve stale cache if offline |
| API: lead/viewing data | Stale-while-revalidate | Show stale; sync when online |
| API: auth tokens | Network-only | Redirect to login if offline |
| API: write operations (POST/PATCH) | Network-only + background sync | Queue for sync when online |

### 11.2 Background Sync (Offline Write Queue)

```typescript
// IndexedDB offline queue schema
interface OfflineAction {
  id: string
  endpoint: string
  method: 'POST' | 'PATCH' | 'DELETE'
  body: Record<string, unknown>
  timestamp: number
  retries: number
}
```

- Draft leads, notes, and viewing feedback captured in IndexedDB when offline
- Background sync fires on reconnect (SW `sync` event)
- Conflict resolution: server-timestamp-wins for concurrent edits
- Stale data banner shown when serving from cache

### 11.3 Install + Update Lifecycle

1. First visit: SW registered; critical assets precached
2. App update available: toast notification ("Update available — tap to reload")
3. User taps → `skipWaiting()` → page reloads with new SW
4. Offline install prompt: deferred until user engages (not on first visit)

### 11.4 Web App Manifest (`manifest.json`)

```json
{
  "name": "White Caves CRM",
  "short_name": "WhiteCaves",
  "theme_color": "#0A0A0A",
  "background_color": "#0A0A0A",
  "display": "standalone",
  "start_url": "/crm",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

---

**Version:** 1.1 | **Last Updated:** June 2026 | **Maintained By:** Technical Team  
**Change Log:** v1.0 — Initial architecture (March 2026); v1.1 — Map search, Redis cache, PWA architecture added (June 2026)
