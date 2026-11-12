# 08. DevOps, Docker & CI/CD Runbooks

> **Document Code:** DOC-SWE-08  
> **Module ID:** `devops`  
> **Category:** Infrastructure & DevOps  
> **Primary Authority:** @Gwynne (DevOps Lead) & @Lisa (Cloud Architect)  
> **Human Interactive Viewer:** [`src/data/auroraSoftwareDocsRegistry.ts` (Item Code: DOC-SWE-08)](file:///c:/Users/HP/Documents/My%20Web%20Sites/AntigravityWC/White-Caves/src/data/auroraSoftwareDocsRegistry.ts)

---

## 1. CI/CD Pipeline Standards

- Vercel's Git integration publishes the frontend. The `Deployment Verification`
  workflow verifies an existing successful GitHub deployment status, or a manually
  selected environment. It does not deploy the local backend or create releases.
- Set `STAGING_URL` and `PROD_URL` to approved HTTPS frontend origins. Unconfigured
  manual environments fail explicitly rather than pretending deployment succeeded.
- Preview deployments require explicit approval through the configured staging URL.
- Cloudflare tunnel/backend lifecycle is documented in [the bridge guide](./CLOUDFLARE_TUNNEL_SETUP.md).

- **Pre-Commit / Pre-Push:** Runs `npm run plans:validate` and `npm run aegis` to guarantee 0 planning drift.
- **Automated SQA Gates:** Full Vitest test suites must pass 100% green before any PR merge.
- **Production Build:** Vite production bundling with code splitting, Brotli compression, and immutable asset hashing.

## 2. Server Cluster Architecture

- Supported minimum: Node.js 22.19.0. Use a current supported 22.x or 24.x release;
  `.nvmrc` and `.node-version` select 22.x. The manual Node CI matrix covers the
  minimum 22.19.0 and current 24.x, while routine jobs use current 22.x.
- The Windows bridge uses the ownership-safe PowerShell supervisor and Cloudflare;
  it does not install PM2, Nginx or a Windows service. PM2/Nginx are hosted-server
  options, not infrastructure provisioned by this wave.
- Lighthouse CLI 0.16.1 requires the new runtime floor. Production dependencies
  audit clean; the remaining low/moderate development advisories are not waived
  by that result. Never use `npm audit fix --force` as a release gate shortcut.
- On Windows, a running backend may lock Prisma's engine DLL during generation.
  Do not stop unknown processes. For a tooling-only update with unchanged Prisma,
  retaining the existing generated client and installing with `--ignore-scripts`
  is a bounded workaround; rerun generation after the owner releases the file.
