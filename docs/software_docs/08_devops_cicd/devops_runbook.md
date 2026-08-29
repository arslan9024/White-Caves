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
- Node.js 20.x runtime orchestrated with PM2 cluster mode.
- Nginx reverse proxy enforcing SSL TLS 1.3, HSTS, and strict Content Security Policies.
