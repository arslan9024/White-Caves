# White Caves Domain-by-Domain System Optimization Manifest

**Version:** 2.0  
**Authority:** @Ada (Chief Architect)  
**Status:** Active System Specification

---

## ⚡ 1. Frontend Performance & Render Optimization (`src/`)

| Metric / Focus                   | Target Benchmark        | Optimization Technique Implemented                                       |
| -------------------------------- | ----------------------- | ------------------------------------------------------------------------ |
| **First Contentful Paint (FCP)** | `< 0.8s`                | Pre-rendered layout shell, static asset precaching via Service Worker    |
| **Time to Interactive (TTI)**    | `< 1.2s`                | Lazy loading non-critical department views via React `Suspense`          |
| **Re-render Frequency**          | `0 unnecessary renders` | Offloaded calculation logic to memoized hooks (`useDashboardMetrics.ts`) |
| **Bundle Size**                  | `< 250 KB vendor chunk` | Tree-shaking unused icons, replacing heavy libraries with optimized SVGs |
| **Layout Shift (CLS)**           | `0.00`                  | Fixed grid dimensions for sidebar (`280px`) and top bar (`64px`)         |

---

## ⚙️ 2. Backend Latency & Process Optimization (`server/`)

| Metric / Focus                | Target Benchmark      | Optimization Technique Implemented                                           |
| ----------------------------- | --------------------- | ---------------------------------------------------------------------------- |
| **API Response Time (P95)**   | `< 45ms`              | In-memory 4-hour exchange rate caching & efficient database queries          |
| **Database Pool Connections** | Zero connection leaks | Centralized Prisma Client singleton (`server/database.ts`)                   |
| **Hot-Reload Recovery**       | `< 300ms`             | `SIGUSR2` signal handler for clean database disconnection on Nodemon restart |
| **Payload Compression**       | `70% reduction`       | Gzip / Brotli compression middleware on all JSON API responses               |
| **Rate Limiting Protection**  | 100 req / min cap     | Layered rate limiters (`apiLimiter`, `authLimiter`, `strictLimiter`)         |

---

## 🛡️ 3. Security, RBAC & Hydration Optimization

| Metric / Focus             | Target Benchmark          | Optimization Technique Implemented                                                |
| -------------------------- | ------------------------- | --------------------------------------------------------------------------------- |
| **Superuser Auth Latency** | `0ms (Instant)`           | Hardcoded `LEVEL_5_MASTER` bypass for `arslanmalikgoraha@gmail.com`               |
| **Session Restoration**    | Zero page flicker         | Local memory token restoration before route guard evaluation                      |
| **Input Sanitization**     | `100% XSS immune`         | Deep payload sanitization filter (`sanitizeDeep`) on all POST/PATCH routes        |
| **Role Verification**      | Complete Level 1-5 matrix | Centralized `enforceAccessGating` middleware in `src/config/rbacConfiguration.ts` |
