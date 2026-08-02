# 🟢 Performance & Scalability Improvements

> **Phase assignments**: Phases 3, 5, 6, 7  
> **Parent backlog**: [IMPROVEMENTS_BACKLOG.md](./IMPROVEMENTS_BACKLOG.md)  
> **Priority**: Medium — important for production scale but not blocking day-to-day use

---

## Item 19 — No Response Caching (Redis)

**Phase**: Phase 7  
**Current state**: Every request to `/api/properties`, `/api/agents`, homepage data, and analytics endpoints hits MongoDB directly. As the database grows, these queries become the primary bottleneck.

### What Needs Doing
- [ ] Install: `npm install ioredis` (and `@types/ioredis` if not included)
- [ ] Add `REDIS_URL` to environment configuration and `validateEnv.ts`
- [ ] Create `server/services/CacheService.ts`:
  - `get(key)` — fetch from Redis, return `null` if miss
  - `set(key, value, ttlSeconds)` — store in Redis with expiry
  - `invalidate(pattern)` — delete all keys matching a glob pattern
- [ ] Apply caching to the highest-traffic read endpoints:
  - `GET /api/properties` (public listing) → TTL: 60 seconds
  - `GET /api/properties/:id` (property detail) → TTL: 300 seconds
  - `GET /api/agents` → TTL: 300 seconds
  - `GET /api/reporting/analytics` → TTL: 600 seconds
  - Homepage data (`HOME_PROPERTIES`) → TTL: 3600 seconds
- [ ] On create/update/delete of a Property → call `cache.invalidate('properties:*')`
- [ ] Add `X-Cache: HIT/MISS` response header for debugging
- [ ] Graceful degradation: if Redis is unavailable, fall through to the database without crashing

### Acceptance Criteria
- Second `GET /api/properties` request returns `X-Cache: HIT` with response time < 5ms
- Creating a new property invalidates the properties cache
- If Redis is down, the server continues serving requests from MongoDB (no 500 errors)

---

## Item 20 — No Image Optimization Pipeline

**Phase**: Phase 6  
**Current state**: Property images are stored and served as original uploaded files (JPEGs, often 5–15MB). No responsive sizes, no WebP conversion, no CDN delivery. Page load times suffer significantly on mobile.

### What Needs Doing
- [ ] Use Cloudinary transformations (if Cloudinary is chosen in Item 11) — apply at upload time:
  - Thumbnail: `w_400,h_300,c_fill,f_webp,q_auto`
  - Card: `w_800,h_600,c_fill,f_webp,q_auto`
  - Hero/fullscreen: `w_1920,h_1280,c_fill,f_webp,q_auto`
- [ ] Store all three URL variants in `property.images` as `{ thumb, card, hero }` objects
- [ ] Update `PropertyCard.tsx` and `PropertyDetailPage.tsx` to use `<img srcset>` with all three variants
- [ ] Update the existing `ResponsiveImage` component (`src/components/ui/ResponsiveImage/`) to accept the new `{ thumb, card, hero }` shape
- [ ] Add `loading="lazy"` to all property images below the fold
- [ ] Add `fetchpriority="high"` to the first hero image on the homepage
- [ ] Run Lighthouse on `/properties` before and after — target CLS < 0.1, LCP < 2.5s

### Acceptance Criteria
- Property card images are served as WebP from CDN
- Lighthouse Performance score on `/properties` page increases by ≥ 10 points
- Mobile 4G load time for property listing page is < 3 seconds (Chrome DevTools throttle)
- No layout shift from images loading (explicit `width` + `height` attributes on all `<img>`)

---

## Item 21 — Bundle Code-Splitting Audit

**Phase**: Phase 3  
**Current state**: Vite is configured but no `manualChunks` are defined. Leaflet (maps), Recharts (charts), and Framer Motion (animations) are bundled into the main chunk, adding ~400KB to the initial load.

### What Needs Doing
- [ ] Run `npx vite-bundle-analyzer` or `npx rollup-plugin-visualizer` to get current chunk sizes
- [ ] Configure `build.rollupOptions.output.manualChunks` in `vite.config.ts`:
  ```ts
  manualChunks: {
    'vendor-react': ['react', 'react-dom', 'react-router-dom'],
    'vendor-redux': ['@reduxjs/toolkit', 'react-redux'],
    'vendor-motion': ['framer-motion'],
    'vendor-charts': ['recharts'],
    'vendor-maps': ['leaflet', 'react-leaflet'],
    'vendor-forms': ['react-hook-form', 'zod'],
  }
  ```
- [ ] Ensure all heavy CRM page components are already lazy-loaded with `React.lazy()` + `Suspense`
- [ ] Target initial bundle (main chunk) < 150KB gzipped
- [ ] Add bundle size check to CI: fail if any single chunk exceeds 500KB

### Acceptance Criteria
- `npm run build` output shows separated vendor chunks
- Main application chunk < 150KB gzipped
- Lighthouse Performance — First Contentful Paint < 1.5s on desktop

---

## Item 22 — No Database Connection Pooling Config

**Phase**: Phase 5  
**Current state**: The Prisma client is a singleton (`server/database.ts`) but no connection pool limits are set. Under concurrent load, MongoDB can receive more connections than it can handle, causing timeouts.

### What Needs Doing
- [ ] Set `connection_limit` in `DATABASE_URL`:
  ```
  DATABASE_URL="mongodb+srv://...?connection_limit=10&connect_timeout=10&socket_timeout=30"
  ```
- [ ] Add Prisma datasource configuration for pool timeout:
  ```prisma
  datasource db {
    provider = "mongodb"
    url      = env("DATABASE_URL")
    connectionTimeout = 10000
    socketTimeout     = 30000
  }
  ```
- [ ] Create a `GET /api/health/db` endpoint that checks Prisma connectivity and returns connection status
- [ ] Add MongoDB slow-query logging: log any query taking > 500ms
- [ ] Set up MongoDB Atlas Performance Advisor alerts for missing indexes (if using Atlas)
- [ ] Document connection pool settings in `DEPLOYMENT_GUIDE.md`

### Acceptance Criteria
- Server under 100 concurrent requests does not exceed 10 MongoDB connections
- `GET /api/health/db` returns `{ status: 'healthy', latencyMs: <number> }`
- Slow queries (> 500ms) appear in the server log with the query details
