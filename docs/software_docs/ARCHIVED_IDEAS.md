# Archived Ideas & Design Notes

> Extracted from root-level documentation during Phase 0 cleanup (March 23, 2026).

---

## From: QUICK_ACCESS_GUIDE.md (March 16, 2026)

### Deployment Infrastructure (Ready to Execute)
- **Docker**: Multi-stage `Dockerfile.prod`, `docker-compose.prod.yml`, `docker-compose.staging.yml`
- **Kubernetes**: Complete K8s stack (`k8s/white-caves-k8s.yaml`, 1000+ LOC), Helm chart
- **Deployment Scripts**: `scripts/deploy-prod.sh` (bash), `scripts/deploy-prod.ps1` (PowerShell)
- **Monitoring**: Prometheus config, metrics middleware, alerting setup guide
- **Health Check**: `src/server/routes/health.ts`

### Load Testing Framework
- 5 scenarios: Smoke (10 users), Normal (100), Spike (500), Stress (1000), Endurance (200 sustained)
- Files: `load-test.config.ts`, `load-test.runner.ts`, `performance-profiler.ts`, `run-load-tests.ts`

### 3-Week Production Deployment Plan (Designed March 2026)
- Week 1: Staging deployment (21 hours)
- Week 2: Production deployment (13 hours)
- Week 3: Optimization (9 hours)

---

## From: audit-round-66.md (March 20, 2026)

### Security Architecture Decisions
- Firebase-sync endpoint needs server-side token verification via `firebase-admin` SDK
- Auth route ordering must place `authMiddleware` before protected routes
- Rate limiter on `/api/auth/register` prevents brute-force account creation
- CRM export endpoint needs field projection to prevent data leakage
- Prisma unique constraint on email needs proper conflict handling

### Proposed Fix: Firebase Admin SDK Integration
```typescript
import admin from 'firebase-admin';
// Verify Firebase ID token server-side before issuing JWT
const decodedToken = await admin.auth().verifyIdToken(idToken);
```

---

## From: audit-round-69.md (March 20, 2026)

### Security Patterns Identified
- Webhook secret comparison should use `crypto.timingSafeEqual` for constant-time comparison
- Firebase-sync production mode needs actual token verification (not just parameter check)
- CRM data exports require field-level access control

---

## From: audit-round-70.md (March 21, 2026)

### UX Patterns to Implement
- All data-fetching components need loading/empty/error states (JobApplicants pattern)
- Form validation should provide real-time feedback with `aria-describedby`
- API client needs retry logic with exponential backoff for transient failures
- CSS layout: Avoid `position: fixed` without `safe-area-inset` consideration for notched devices
