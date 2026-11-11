# 08. DevOps, Docker & CI/CD Runbooks

> **Document Code:** DOC-SWE-08  
> **Module ID:** `devops`  
> **Category:** Infrastructure & DevOps  
> **Primary Authority:** @Gwynne (DevOps Lead) & @Lisa (Cloud Architect)  
> **Human Interactive Viewer:** [`src/data/auroraSoftwareDocsRegistry.ts` (Item Code: DOC-SWE-08)](file:///c:/Users/HP/Documents/My%20Web%20Sites/AntigravityWC/White-Caves/src/data/auroraSoftwareDocsRegistry.ts)

---

## 1. CI/CD Pipeline Standards

- **Pre-Commit / Pre-Push:** Runs `npm run plans:validate` and `npm run aegis` to guarantee 0 planning drift.
- **Automated SQA Gates:** Full Vitest test suites must pass 100% green before any PR merge.
- **Production Build:** Vite production bundling with code splitting, Brotli compression, and immutable asset hashing.

## 2. Server Cluster Architecture

- Node.js 22.x runtime (22.19+) orchestrated with PM2 cluster mode.
- Nginx reverse proxy enforcing SSL TLS 1.3, HSTS, and strict Content Security Policies.

## 3. Backend Deployment Status

- Retain the full Express/Docker backend; Cloudflare deployment preparation is deferred to the next deployment task.
- No reachable production backend origin has been verified. Do not configure a proxy to an assumed hostname.
- The legacy Vercel API currently fails module loading. A successful frontend build does not verify API health or backend feature parity.
- Before enabling production traffic, verify backend health, authentication/RBAC, and the required Express routes against the selected deployment.

## 4. Browser Test Runtimes

- `npm run test:e2e` runs the built-application Playwright suite, then the Henry scanner component smoke suite using `playwright.henry.config.ts`.
- Henry's test-only module mount requires a real Vite module server on local port 4174; a production preview cannot serve its source imports. Both suites remain required by the combined command.
- Set `VITE_API_URL=/api` when building the isolated same-origin frontend E2E environment. Frontend-only tests must mock their API contracts explicitly; this does not prove a deployed backend is healthy.
