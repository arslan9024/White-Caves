# 🚀 DEPLOYMENT GUIDE

## Production Deployment Procedures, Checklists & Rollback Plans

**Last Updated:** March 12, 2026  
**Scope:** Staging → Production deployment, monitoring, incident response

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### Code Quality Gates

- [ ] All TypeScript errors resolved (<5 acceptable)
- [ ] All ESLint errors fixed (0 critical, <5 warnings)
- [ ] All unit tests passing (>80% coverage)
- [ ] All E2E tests passing on staging
- [ ] Code reviewed by 2+ team members
- [ ] Security scan passed (no high/critical vulnerabilities)
- [ ] Performance audit passed (<2MB bundle, Core Web Vitals green)

### Configuration

- [ ] .env.production reviewed
- [ ] Database backups taken
- [ ] API keys rotated
- [ ] SSL certificates valid
- [ ] CDN cache cleared
- [ ] Status page updated
- [ ] Incident team notified

### Testing

- [ ] Smoke tests passing (happy path)
- [ ] Critical user journeys tested
- [ ] Mobile responsiveness verified
- [ ] Browser compatibility verified
- [ ] Load testing (target: 1000+ concurrent users)
- [ ] Stress testing (target: 5000+ concurrent users)

---

## 🏗️ DEPLOYMENT ARCHITECTURE

### Current Setup

```
Development (localhost)
        ↓
Staging (staging.whitecaves.app)
        ↓
Production (app.whitecaves.app)
```

### Recommended Production Architecture

```
              ┌──────────────────┐
              │  CloudFlare CDN  │
              │ (Global caching) │
              └────────┬─────────┘
                       │
              ┌────────▼─────────┐
              │ Load Balancer    │
              │ (Geographic)     │
              └────────┬─────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
    Region-1      Region-2      Region-3
   (Primary)     (Secondary)    (Backup)

   Kubernetes Cluster (each region)
   ├── Frontend pods (React SPA)
   ├── API pods (Express.js)
   └── Database replicas
```

---

## 📦 DEPLOYMENT METHODS

### Option 1: Manual Deployment (Simple)

**Prerequisites:**

```bash
# Install deployment tools
npm install -g pm2 docker docker-compose

# Setup SSH keys for production server
ssh-keygen -t ed25519 -f ~/.ssh/production -C "deploy"
```

**Deployment Steps:**

```bash
# 1. Test in staging first
npm run build:staging
npm run test
npm run e2e:staging

# 2. Build for production
npm run build:production

# 3. Create production bundle
docker build -t whitecaves:latest .

# 4. Push to registry
docker push <registry>/whitecaves:latest

# 5. SSH into production server
ssh -i ~/.ssh/production ubuntu@prod.whitecaves.app

# 6. Pull latest image
docker pull <registry>/whitecaves:latest

# 7. Stop old container
docker stop whitecaves
docker rm whitecaves

# 8. Start new container
docker run -d \
  --name whitecaves \
  --restart always \
  -p 80:5000 \
  -e NODE_ENV=production \
  --env-file .env.production \
  <registry>/whitecaves:latest

# 9. Verify deployment
curl http://localhost:5000/health
curl http://app.whitecaves.app/health

# 10. Rollback if needed
docker run -d \
  --name whitecaves \
  -p 80:5000 \
  <registry>/whitecaves:previous-tag
```

### Option 2: GitOps + CI/CD (Recommended)

**GitHub Actions Workflow:**

**.github/workflows/deploy-production.yml**

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
    tags: ['v*.*.*']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:ci

      - name: Run E2E tests
        run: npm run e2e:ci

      - name: Check coverage
        run: npm run coverage
        if: failure()

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: SAST Scan
        uses: github/super-linter@v4

      - name: Dependency Audit
        run: npm audit --audit-level=moderate

      - name: DAST Scan
        run: npm run security:scan

  build:
    needs: [test, security]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Build
        run: npm run build:production

      - name: Build Docker image
        run: |
          docker build -t whitecaves:${{ github.sha }} .
          docker tag whitecaves:${{ github.sha }} whitecaves:latest

      - name: Push to Docker Hub
        env:
          DOCKER_USERNAME: ${{ secrets.DOCKER_USERNAME }}
          DOCKER_PASSWORD: ${{ secrets.DOCKER_PASSWORD }}
        run: |
          echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
          docker push whitecaves:${{ github.sha }}
          docker push whitecaves:latest

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: success()
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Kubernetes
        env:
          KUBECONFIG: ${{ secrets.KUBECONFIG }}
        run: |
          kubectl set image deployment/whitecaves \
            whitecaves=whitecaves:${{ github.sha }} \
            --record

      - name: Wait for rollout
        run: |
          kubectl rollout status deployment/whitecaves \
            --timeout=5m

      - name: Run smoke tests
        run: |
          curl -f http://whitecaves.app/health || exit 1
          npm run test:smoke

  monitor:
    needs: deploy
    runs-on: ubuntu-latest
    if: success()
    steps:
      - name: Check application health
        run: |
          for i in {1..30}; do
            curl http://whitecaves.app/health && exit 0
            sleep 10
          done
          exit 1

      - name: Check error rates
        run: |
          curl http://monitoring.internal/api/error-rate?app=whitecaves

      - name: Notify team
        if: failure()
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '❌ Deployment failed. Rolling back...'
            })
```

---

## 🔄 ZERO-DOWNTIME DEPLOYMENT

### Blue-Green Deployment

```
┌─────────────────────────────────────┐
│    Load Balancer (routing 100%)     │
└────────────┬────────────────────────┘
             │
        ┌────▼────┐
        │          │
   ┌────▼──┐  ┌───▼───┐
   │ Blue  │  │ Green │
   │  (v1) │  │  (v2) │  ← Deploy new version here
   └───────┘  └───┬───┘
                  │
            (After validation)

        Load Balancer switches:
        100% traffic → Green (v2)
        Blue (v1) remains running (rollback)
```

**Implementation:**

```bash
# 1. Create green deployment
kubectl apply -f deployment-green.yaml

# 2. Verify green is healthy
kubectl exec -it deployment/whitecaves-green -- npm run health-check

# 3. Run smoke tests against green
npm run test:smoke -- --target green

# 4. Switch traffic (1 command!)
kubectl patch service whitecaves -p '{"spec":{"selector":{"version":"green"}}}'

# 5. Monitor for 5 minutes
npm run monitor:health -- --duration 5m

# 6. Delete old blue deployment
kubectl delete deployment whitecaves-blue
```

### Canary Deployment (Safer)

```
Traffic Distribution:
├── 95% → Blue (v1, stable)
├── 5% → Green (v2, canary)
│
After 30 mins (if healthy):
├── 50% → Blue (v1)
├── 50% → Green (v2)
│
After 1 hour (if still healthy):
├── 0% → Blue (v1)
└── 100% → Green (v2)
```

**Implementation:**

```bash
# Deploy with traffic split
kubectl apply -f - <<EOF
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: whitecaves
spec:
  hosts:
  - whitecaves.app
  http:
  - match:
    - headers:
        user-agent:
          regex: ".*canary.*"
    route:
    - destination:
        host: whitecaves-green
        port:
          number: 5000
      weight: 5
    - destination:
        host: whitecaves-blue
        port:
          number: 5000
      weight: 95
EOF
```

---

## 📊 MONITORING & ALERTING

### Key Metrics to Monitor

**Application Metrics:**

```
- HTTP 2xx responses        (target: >99%)
- HTTP 4xx responses        (target: <0.5%)
- HTTP 5xx responses        (target: <0.1%)
- API response time         (target: <200ms)
- Database query time       (target: <50ms)
- Error rate                (target: <0.1%)
- Active users              (track trends)
```

**Infrastructure Metrics:**

```
- CPU usage                 (alert: >80%)
- Memory usage              (alert: >85%)
- Disk usage                (alert: >90%)
- Network latency           (alert: >100ms)
- Database connection pool  (alert: >80%)
```

**Business Metrics:**

```
- User sign-ups (daily)
- Property listings (daily)
- Lead creation (daily)
- Commission processed (daily)
- Revenue (daily/monthly)
```

### Monitoring Stack (Recommended)

```
┌──────────────────────────────────┐
│  DataDog / New Relic / Grafana   │
│  (APM + Infrastructure)          │
└────────────┬─────────────────────┘
             │
   ┌─────────┴─────────┐
   │                   │
   ▼                   ▼
Prometheus         CloudWatch
(Internal)         (AWS logs)
```

### Alert Examples

**Critical Alerts:**

```
- Error rate > 1%              → Page on-call immediately
- Response time > 1s           → Page on-call immediately
- Server down                  → Page on-call immediately
- Database down                → Page on-call immediately
- Disk usage > 95%             → Page on-call immediately
```

**Warning Alerts:**

```
- Error rate > 0.5%            → Slack #alerts
- Response time > 500ms        → Slack #alerts
- Memory usage > 85%           → Slack #alerts
- CPU > 75%                    → Slack #alerts
```

---

## 🔙 ROLLBACK PROCEDURES

### Rollback Decision Tree

```
Issue Detected?
├─ YES → Severity Assessment
│        ├─ CRITICAL (P1) → Immediate rollback
│        ├─ HIGH (P2) → Rollback if fix > 30 mins
│        └─ MEDIUM (P3) → Analyze first
└─ NO → Continue monitoring
```

### Immediate Rollback (Kubernetes)

```bash
# Option 1: Quick rollback to previous replica set
kubectl rollout undo deployment/whitecaves

# Option 2: Rollback to specific revision
kubectl rollout history deployment/whitecaves
kubectl rollout undo deployment/whitecaves --to-revision=5

# Option 3: Switch traffic back to blue
kubectl patch service whitecaves -p '{"spec":{"selector":{"version":"blue"}}}'

# Option 4: Delete bad deployment
kubectl delete deployment whitecaves-green

# Verify rollback
kubectl get pods
curl http://app.whitecaves.app/health
```

### Data Rollback (Database)

```bash
# If data corruption occurred:

# 1. List available backups
aws s3 ls s3://whitecaves-backups/daily/

# 2. Restore from backup
mongorestore --uri "mongodb+srv://..." \
  --archive=whitecaves-2026-03-11-backup.tar.gz

# 3. Verify data integrity
npm run verify:database

# 4. Notify stakeholders
# "Database rolled back to 2026-03-11 23:00 UTC backup"
```

---

## 📝 POST-DEPLOYMENT

### Post-Deployment Checklist (First 24 Hours)

- [ ] All critical features working
- [ ] No spike in error rate
- [ ] Response times normal
- [ ] Database healthy
- [ ] Cache working
- [ ] Third-party integrations OK
- [ ] User feedback (check support channels)
- [ ] Monitoring dashboards green
- [ ] Team notified of successful deployment

### Post-Deployment Activities

```bash
# 1. Run comprehensive smoke tests
npm run test:smoke:all

# 2. Check error logs
tail -100 /var/log/whitecaves/error.log

# 3. Verify database size
du -sh /var/lib/mongodb/

# 4. Check CDN stats
curl https://api.cloudflare.com/api/v1/zones/stats

# 5. Generate deployment report
npm run deployment:report > deployment-$(date +%Y%m%d).html
```

### Create Release Notes

**Format:**

```markdown
# Release v2.0.0 - 2026-03-12

## What's New

- ✨ CRM Dashboard consolidation
- ✨ Component folder restructure
- ✨ Service layer refactoring
- ✨ CSS consolidation to styled-components

## Bug Fixes

- 🐛 Fixed modal stacking issue
- 🐛 Fixed form validation errors
- 🐛 Fixed API timeout handling

## Performance

- ⚡ 15-20% smaller bundle (-47,700 LOC)
- ⚡ 10% faster page load
- ⚡ Improved cache hit ratio

## Breaking Changes

- Component imports updated (see MIGRATION.md)
- CSS files no longer supported (use styled-components)

## Migration Guide

See ARCHITECTURE.md for detailed migration guide.

## Contributors

- Alice (Frontend Lead)
- Bob (Backend Lead)
- Charlie (DevOps)
- Diana (QA Lead)
```

---

## 🚨 INCIDENT RESPONSE

### On-Call Runbook

**IF ERROR RATE > 1%:**

```
1. ✅ Verify the problem
   - Check monitoring dashboard
   - Check error logs
   - Check uptime status

2. 🔍 Assess severity
   - Is auth broken? (P1)
   - Is data lost? (P1)
   - Is API slow? (P2)
   - Is minor feature broken? (P3)

3. 📞 Notify team
   - Page on-call (P1/P2)
   - Slack #incidents (all severities)
   - Update status.whitecaves.app

4. 🔙 Quick actions
   - Rollback if < 1hr since deploy
   - Restart service
   - Clear caches
   - Scale up if load issue

5. 🔧 Fix if not rollback
   - Apply hotfix to main branch
   - Deploy to production
   - Monitor metrics

6. 📋 Post-incident
   - Document issue
   - Create post-mortem
   - Prevent recurrence
```

### War Room Setup

```bash
# On-call uses these channels
- Slack: #incidents (all updates)
- Meeting: Google Meet (war room)
- Document: Google Doc (real-time notes)
- Dashboard: Grafana (live metrics)
- Logs: DataDog (error tracking)
```

---

## 📚 DEPLOYMENT CHECKLIST TEMPLATE

Use this before every production deployment:

```
DEPLOYMENT CHECKLIST - [DATE & VERSION]

Pre-Deployment
├─ Code Quality
│  ├─ [ ] TypeScript: npx tsc --noEmit
│  ├─ [ ] Linting: npm run lint
│  ├─ [ ] Tests: npm run test:ci
│  └─ [ ] E2E: npm run e2e:ci
│
├─ Security
│  ├─ [ ] Dependencies: npm audit
│  ├─ [ ] Secrets: no .env in code
│  ├─ [ ] API keys: rotated recently
│  └─ [ ] SSL: valid for 30+ days
│
├─ Infrastructure
│  ├─ [ ] Database: backed up
│  ├─ [ ] CDN: cache cleared
│  ├─ [ ] Load balancer: healthy
│  └─ [ ] Monitoring: ready
│
└─ Team
   ├─ [ ] Team notified
   ├─ [ ] On-call assigned
   ├─ [ ] Slack room created
   └─ [ ] Rollback plan reviewed

Deployment
├─ [ ] Build: npm run build:production
├─ [ ] Docker: docker build -t whitecaves:latest .
├─ [ ] Push: docker push whitecaves:latest
├─ [ ] Deploy: kubectl apply -f deployment.yaml
├─ [ ] Monitor: npm run monitor:health --duration 5m
└─ [ ] Verify: curl https://app.whitecaves.app/health

Post-Deployment
├─ [ ] Smoke tests passing
├─ [ ] Error rate normal
├─ [ ] Response times OK
├─ [ ] Database connected
├─ [ ] Cache working
├─ [ ] No user complaints
├─ [ ] Document successful deployment
└─ [ ] Close incident (if any)

Signed by: ___________________   Date: __________
```

---

**Deployment readiness = Customer happiness! 🎉**
