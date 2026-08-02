# WEEK 2: PRODUCTION DEPLOYMENT EXECUTION GUIDE

**Execution Period**: March 23-27, 2026 (Mon-Fri)  
**Actual Deployment**: Tuesday, March 24, 2:00 AM - 2:45 AM UTC  
**Total Effort**: 13 hours active + 24 hours standby  
**Risk Level**: MEDIUM (Production systems, but with safety measures)  
**Success Criteria**: 99.5% uptime, zero data loss, all systems verified

---

## 📋 Day 1 (Monday): Final Pre-Production Preparation (4 hours)

### Pre-Production Checklist (2 hours)

**Code & Artifacts**:
```bash
# [ ] Verify final build successful
npm run build

# Expected output:
# ✓ Vite build successful
# ✓ All chunks created
# ✓ Source maps generated
# ✓ No errors or warnings
```

**Test Verification**:
```bash
# [ ] All tests passing
npm test 2>&1 | tail -20

# Expected:
# Tests:     268 passed, 1 skipped
# Duration:  2m 15s
# Coverage:  96%+
```

**Dependencies**:
```bash
# [ ] No critical vulnerabilities
npm audit

# Expected: 0 vulnerabilities found

# [ ] All peer dependencies resolved
npm list 2>&1 | grep "missing\|ERR"

# Expected: No missing dependencies
```

**Database Snapshot**:
```bash
# [ ] Production database backup taken
./scripts/backup-prod-db.sh

# Expected output:
# ✓ Database backup started
# ✓ Backup file: white-caves-prod-2026-03-24.dump
# ✓ Backup verified: 2.3GB
# ✓ Backup stored: s3://backups/...
# ✓ Backup encrypted: Yes
```

**Monitoring Preparation**:
```bash
# [ ] Prometheus alerts configured
curl -s http://prometheus.staging:9090/api/v1/rules | jq '.data.groups | length'

# Expected: 9+ alert groups

# [ ] Grafana dashboards ready
curl -s http://grafana.staging:3000/api/dashboards | jq '.[] | .title'

# Expected: All 4 dashboards listed

# [ ] AlertManager channels tested
# Verify Slack, Email, PagerDuty channels working

# [ ] On-call team notified
# Contact everyone in rotation: confirm availability

# [ ] War room scheduled
# Time: Deployment start time
# Participants: DevOps, SRE, QA, Engineering, Product
# Tools: Slack + video conference
```

### Deployment Readiness Meeting (1 hour)

**Attendees**: All team leads + executives

**Agenda**:
```
1. Deployment Overview (10 min)
   - What's being deployed
   - Why this version
   - Expected benefits

2. Risk Assessment (10 min)
   - Identified risks
   - Mitigation strategies
   - Rollback plan review

3. Success Criteria (5 min)
   - Uptime target: 99.5%
   - Error rate target: < 0.1%
   - Performance target: p95 < 200ms
   - All checks must pass

4. Execution Plan (10 min)
   - Timeline walkthrough
   - Role assignments
   - Communication plan
   - Escalation path

5. Q&A (15 min)
   - Address all concerns
   - Confirm everyone ready
   - GO/NO-GO decision

6. Final Authorization (10 min)
   - Executive sign-off
   - Proceed to deployment
```

**Decision Gate**:
```
Proceed with deployment?

[ ] Code quality: PASS
[ ] Test coverage: PASS
[ ] Staging validation: PASS
[ ] Performance benchmarks: PASS
[ ] Security audit: PASS
[ ] Infrastructure ready: PASS
[ ] Team prepared: PASS
[ ] DECISION: ► PROCEED WITH DEPLOYMENT ◄
```

### Pre-Deployment Communication (1 hour)

**Customer Notification** (6 hours before):
```
Subject: Scheduled Maintenance - White Caves CRM

Dear Users,

We're performing scheduled maintenance to deploy new features and improvements.

MAINTENANCE WINDOW:
  Date: Tuesday, March 24, 2026
  Time: 2:00 AM - 3:00 AM UTC
  Duration: ~45 minutes
  Expected Impact: Service unavailable

WHAT'S NEW:
  • Enterprise-grade infrastructure
  • Performance improvements (30% faster)
  • Enhanced monitoring & reliability
  • Improved real-time updates
  • Better security

AFFECTED SERVICES:
  • Web application: DOWN during window
  • Mobile app: Limited functionality
  • API: UNAVAILABLE

ACTION REQUIRED:
  • No action needed
  • Service will resume automatically
  • Data is safe and backed up

For questions: support@whitecaves.com
For status: status.whitecaves.com

Thank you for your patience!
```

**Team Notification**:
```
[In #white-caves-deploy Slack channel]

🚀 PRODUCTION DEPLOYMENT STARTING TUESDAY 2:00 AM UTC

Deployment Lead: @[name]
SRE On-Call: @[name]
Engineering Lead: @[name]

STATUS PAGE: https://status.whitecaves.com
MONITORING: https://grafana.whitecaves.com/d/overview

Timeline:
  1:45 AM - Final checks
  2:00 AM - Start deployment
  2:45 AM - Completion target
  3:00 AM - Extended monitoring

ESCALATION:
  Issues → @ops-lead
  Rollback → @devops-lead
  Communication → @product-lead

Respect the silence once deployment starts.
All updates in #deployment-updates.
```

---

## 📋 Day 2 (Tuesday): PRODUCTION DEPLOYMENT (3 hours active + 24 hours monitoring)

### Pre-Deployment Window: 1:45 AM - 2:00 AM (15 min)

```bash
# [ ] Final system health check
curl -s https://prod-api.whitecaves.com/api/health | jq .

# Expected: All systems "connected"

# [ ] Verify backup is current
ls -lh white-caves-prod-backup-*.dump | tail -1

# [ ] Confirm production readonly mode is OFF
# (Allow deployments)

# [ ] Check disk space on production
df -h /data | grep -v Filesystem

# [ ] Verify all monitoring collecting
curl -s http://prometheus:9090/api/v1/targets | jq '.data.activeTargets[].health'

# [ ] War room started
# Video + Slack #deployment-updates active

# [ ] Entire team ready and standing by
```

### Deployment Execution Window: 2:00 AM - 2:45 AM (45 min)

#### Step 1: Enable Maintenance Mode (2:00 AM - 2:02 AM)

```bash
# 1. Deploy maintenance page
curl -X POST https://api.whitecaves.com/admin/maintenance/enable \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Scheduled maintenance in progress","eta":"2:45 AM UTC"}'

# 2. Verify maintenance page active
curl -s https://whitecaves.com | head -20
# Expected: Maintenance page displayed

# 3. Broadcast to all active WebSocket connections
# (Server automatically does this)
# Expected: Clients see "Service unavailable" message

# 4. Wait for in-flight requests to complete (max 30 seconds)
sleep 30

# 5. Verify all servers are quiet
curl -s http://prometheus:9090/api/v1/query?query=rate(http_requests_total[1m]) | jq '.data.result | length'
# Expected: 0 (no requests)
```

#### Step 2: Deploy New Version (2:02 AM - 2:30 AM)

**Option A: Docker Compose Deployment**

```bash
# 1. Pull latest image
docker pull your-registry.azurecr.io/white-caves:v1.0.0

# 2. Update docker-compose.prod.yml with new image
sed -i 's/image:.*/image: your-registry.azurecr.io\/white-caves:v1.0.0/' \
  docker-compose.prod.yml

# 3. Recreate containers (zero-downtime)
docker-compose -f docker-compose.prod.yml up -d --no-deps --build

# Expected output:
# ✓ Pulling new image
# ✓ Creating app containers with new image
# ✓ Container 1 starting
# ✓ Container 2 starting (while 1 still accepting requests)
# ✓ Swapping traffic to new containers
# ✓ Old containers stopping
```

**Option B: Kubernetes Deployment (Recommended)**

```bash
# 1. Set new image version
kubectl set image deployment/app \
  app=your-registry.azurecr.io/white-caves:v1.0.0 \
  -n white-caves

# 2. Watch rollout (zero-downtime rolling update)
kubectl rollout status deployment/app -n white-caves --timeout=10m

# Expected: 
# Waiting for deployment "app" rollout to finish: 1 of 3 updated replicas are available
# Waiting for deployment "app" rollout to finish: 2 of 3 updated replicas are available
# deployment "app" successfully rolled out
```

**Option C: Blue-Green Deployment (Safest)**

```bash
# 1. Start green (new) environment alongside blue (current)
docker-compose -f docker-compose.prod-green.yml up -d

# 2. Verify green is healthy
for i in {1..30}; do
  curl -s http://green-api:8000/api/health | jq -e '.database == "connected"' && break
  echo "Waiting for green... ($i/30)"
  sleep 2
done

# 3. Run smoke tests against green
npm run test:smoke -- --api http://green-api:8000

# 4. Switch load balancer from blue to green
docker exec nginx-lb \
  sed -i 's/upstream app { server blue:8000; }/upstream app { server green:8000; }/' \
  /etc/nginx/nginx.conf
docker exec nginx-lb nginx -s reload

# 5. Monitor green for 5 minutes

# 6. If all good, remove blue
docker-compose -f docker-compose.prod.yml down
```

#### Step 3: Database Migration (if needed - 2:30 AM - 2:35 AM)

```bash
# [ ] Check if schema changes
git diff v0.9.9..v1.0.0 -- src/server/models/

# If no changes: SKIP this section

# If schema changes:
# 1. Run migration with rollback ready
npm run migrate:prod -- --dry-run

# Expected: Shows what would change, no actual changes

# 2. Run actual migration
npm run migrate:prod -- --confirm

# Expected output:
# ✓ Migration 001_initial.ts: DONE
# ✓ Migration 002_add_fields.ts: DONE
# ✓ All up-to-date

# 3. Verify data integrity
npm run verify:db-integrity

# Expected:
# ✓ All tables exist
# ✓ All indexes exist
# ✓ Data consistency: OK
# ✓ Constraints: OK
```

#### Step 4: Disable Maintenance Mode (2:35 AM - 2:40 AM)

```bash
# 1. Disable maintenance page
curl -X POST https://api.whitecaves.com/admin/maintenance/disable \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# 2. Verify application responding
curl -s https://whitecaves.com | grep -i "White Caves"
# Expected: Normal page content (not maintenance page)

# 3. Check API responding
curl -s https://api.whitecaves.com/api/status | jq .
# Expected: {"status":"ok"}

# 4. Notify clients
# WebSocket automatically sends "service resumed" message
```

#### Step 5: Verification (2:40 AM - 2:45 AM)

```bash
# 1. Health checks
echo "=== Health Checks ==="
curl -s https://api.whitecaves.com/api/health | jq .

# Expected output:
# {
#   "status": "ok",
#   "database": "connected",
#   "cache": "connected",
#   "timestamp": "2026-03-24T02:42:30Z"
# }

# 2. Smoke tests
echo "=== Smoke Tests ==="
npm run test:smoke -- --api https://api.whitecaves.com

# Expected: All 20 smoke tests pass

# 3. Check error rate
echo "=== Error Rate ==="
curl -s 'http://prometheus:9090/api/v1/query?query=rate(http_requests_errors_total[5m])' | jq '.data.result[].value[1]'

# Expected: < 0.001 (less than 0.1%)

# 4. Check latency
echo "=== Latency (p95) ==="
curl -s 'http://prometheus:9090/api/v1/query?query=histogram_quantile(0.95,rate(http_request_duration_seconds_bucket[5m]))' | jq '.data.result[].value[1]'

# Expected: < 0.2 (less than 200ms)

# 5. Check active connections
echo "=== Active Connections ==="
curl -s 'http://prometheus:9090/api/v1/query?query=app_active_connections' | jq '.data.result[].value[1]'

# Expected: > 0 (users connecting)

# 6. Database verification
echo "=== Database ==="
curl -s https://api.whitecaves.com/api/admin/db-status | jq .

# Expected: healthy connection count, response time
```

### Deployment Complete: 2:45 AM ✅

**Announcement to Users**:
```
✅ DEPLOYMENT SUCCESSFUL

All systems are now back online. Deployment completed in 45 minutes.

NEW FEATURES & IMPROVEMENTS:
  • 30% faster performance
  • Enhanced reliability
  • Better real-time sync
  • Enterprise monitoring
  • Improved security

Thank you for your patience during maintenance!
```

---

## 📋 Day 2-3 (Tue-Wed): Intensive Monitoring (24+ hours)

### Hour 1: Active Monitoring (2:45 AM - 3:45 AM)

**Every 10 minutes**:
```bash
# [ ] Check error logs
docker logs white-caves-app | tail -20 | grep -i error

# [ ] Verify no alert storms
curl -s http://alertmanager:9093/api/v1/alerts | jq '.data | length'

# [ ] Check database performance
curl -s https://api.whitecaves.com/api/admin/metrics | jq '.database'

# [ ] Monitor system resources
docker stats white-caves-app

# [ ] Check user activity
curl -s https://api.whitecaves.com/api/admin/active-users | jq '.count'
```

**Escalation Criteria**:
```
IF error rate > 1% for 5 minutes:
  → Initiate rollback

IF latency p95 > 1000ms for 5 minutes:
  → Check database load, increase replicas if needed

IF database connectivity issues:
  → Execute database failover procedure

IF memory usage > 90%:
  → Scale up container resources

IF any service down:
  → Immediate rollback
```

### Hours 1-6: Extended Monitoring (3:45 AM - 8:45 AM)

**Every 15 minutes**:
```bash
# [ ] Error rate (should be < 0.1%)
# [ ] Response latency (should be < 200ms p95)
# [ ] Memory usage (should be < 500MB)
# [ ] Database connections (should be stable)
# [ ] Cache hit ratio (should be > 70%)
# [ ] No active alerts (aside from expected)
```

**Check Dashboard**:
- Grafana Overview dashboard
- Error rate graph (should be flat and low)
- Latency graph (should be flat and low)
- Resource utilization (should be normal)

### Hours 6-24: Standard Monitoring (8:45AM onwards)

**Every hour**:
```bash
# [ ] Health check passing
# [ ] Error rate normal
# [ ] Performance metrics stable
# [ ] No degradation from baseline
```

**Daily Tasks**:
```
Next morning (Day 3):
  [ ] Analyze 24-hour metrics
  [ ] Compare against baseline
  [ ] Document any optimizations
  [ ] Approve production stability
```

---

## 📋 Day 3 (Wednesday): Continued Monitoring & First Optimization (4 hours)

### Morning Review (1 hour)

```bash
# 1. Analyze 24-hour metrics
curl -s 'http://prometheus:9090/api/v1/query_range?query=rate(http_requests_total[1h])&start=2026-03-24T02:45:00Z&end=2026-03-25T02:45:00Z&step=1h' | jq '.data.result'

# 2. Generate summary report
npm run report:metrics -- --period=24h --format=pdf

# 3. Compare performance
# Expected:
#   P50 latency: 50-60ms (acceptable)
#   P95 latency: 180-200ms (acceptable)
#   Error rate: 0.05-0.1% (acceptable)
#   Uptime: 99.95%+ (excellent)
```

### Stakeholder Communication (30 min)

```
✅ PRODUCTION DEPLOYMENT SUCCESSFUL

24-Hour Summary:
  Duration: 45 minutes
  Status: ✅ ALL SYSTEMS OPERATIONAL
  Uptime: 99.98%
  Errors: 0.08%
  Performance: p95 185ms

Key Metrics:
  Users Online: 2,340
  Requests/sec: 150
  Database Healthy: Yes
  Cache Hit Ratio: 77%

Issues Encountered: NONE
Critical Alerts: NONE
Performance Degradation: NONE

Status: PRODUCTION STABLE ✅

Next: Continue monitoring. Performance review tomorrow.
```

### Optimization (2.5 hours)

Based on 24-hour metrics:

```bash
# 1. Identify slow endpoints
npm run analyze:performance -- --threshold=200ms

# Output example:
# Slow endpoints:
#   POST /api/reports: 250ms (too slow)
#   GET /api/analytics: 180ms (ok)

# 2. Optimize identified endpoints
# Example: Add caching for expensive queries

# 3. Re-test performance
npm run load-test:normal

# 4. Verify improvements
npm run compare:performance -- --baseline=old --current=new

# 5. Deploy optimization (if needed)
# Use same procedures as main deployment
```

---

## 📋 Day 4-5 (Thu-Fri): Extended Monitoring & Documentation

### Day 4: 24-48 Hour Review

```bash
# [ ] Verify system stability
# [ ] Check all background jobs running
# [ ] Verify data integrity
# [ ] Monitor error logs
# [ ] User feedback positive?
```

### Day 5: Final Sign-Off & Documentation

**Create Post-Deployment Report**:
```markdown
# Production Deployment - Post-Deployment Report

Date: March 24, 2026
Version: v1.0.0
Status: ✅ SUCCESSFUL

## Deployment Summary
- **Duration**: 45 minutes
- **Start Time**: 2:00 AM UTC
- **End Time**: 2:45 AM UTC
- **Uptime During**: 99.98%

## 24-Hour Performance
- **Uptime**: 99.97% ✅
- **P50 Latency**: 52ms ✅
- **P95 Latency**: 187ms ✅
- **P99 Latency**: 450ms ✅
- **Error Rate**: 0.08% ✅
- **Throughput**: 150 req/sec ✅

## Issues & Resolutions
- NONE

## Improvements Deployed
- 30% faster API response times ✅
- Enhanced real-time sync ✅
- Better error messages ✅
- Comprehensive monitoring ✅

## Monitoring Setup
- ✅ Prometheus active
- ✅ Grafana dashboards live
- ✅ AlertManager configured
- ✅ Webhook integrations working

## Sign-Offs
- [@DevOps Lead] Deployment: Approved
- [@SRE Lead] Monitoring: Approved
- [@QA Lead] Testing: Approved
- [@Engineering Lead] Code: Approved

## Recommendations for Future
1. Monitor database load more closely
2. Consider adding read replicas
3. Optimize query N+1 problems
4. Implement request compression

## Status
**PRODUCTION DEPLOYMENT SUCCESSFUL**
System stable for 72+ hours post-deployment.
Ready for next phase optimizations.
```

---

## 🚨 ROLLBACK PROCEDURES (If Needed)

### Quick Rollback (< 5 minutes)

**Option A: Docker Compose**
```bash
# 1. Stop current version
docker-compose -f docker-compose.prod.yml down

# 2. Redeploy previous
docker-compose -f docker-compose.prod.yml.backup up -d

# 3. Verify health
curl -s https://api.whitecaves.com/api/health | jq .
```

**Option B: Kubernetes**
```bash
# 1. Undo deployment
kubectl rollout undo deployment/app -n white-caves

# 2. Wait for rollout
kubectl rollout status deployment/app -n white-caves

# 3. Verify
curl -s https://api.whitecaves.com/api/health | jq .
```

**Option C: Blue-Green**
```bash
# 1. Switch load balancer back to blue
docker exec nginx-lb \
  sed -i 's/upstream app { server green:8000; }/upstream app { server blue:8000; }/' \
  /etc/nginx/nginx.conf
docker exec nginx-lb nginx -s reload

# 2. Verify
curl -s https://api.whitecaves.com/api/health | jq .
```

### Potential Issues & Fixes

| Issue | Symptoms | Fix | Time |
|-------|----------|-----|------|
| **Database connection pool exhausted** | "Too many connections" errors | Scale replicas, restart app | 5 min |
| **Memory leak in new code** | Memory grows continuously | Rollback to previous version | 5 min |
| **Nginx misconfiguration** | 502 Bad Gateway errors | Verify nginx config, reload | 3 min |
| **Cache invalidation issue** | Stale data served | Clear cache, verify code | 10 min |
| **Authentication failure** | All 401 errors | Check JWT secret, verify token | 5 min |
| **Database migration failed** | Data integrity errors | Rollback DB migration | 10 min |

---

## 📊 Week 2 Success Criteria

**Deployment Execution**:
- [ ] Maintenance window announced
- [ ] Final pre-deploy checks passed
- [ ] Deployment completed on time
- [ ] Zero downtime deployment (using rolling updates)
- [ ] All systems verified after deployment

**Performance Metrics**:
- [ ] Uptime > 99.5%
- [ ] Error rate < 0.1%
- [ ] P95 latency < 200ms
- [ ] P99 latency < 500ms
- [ ] Throughput > 100 req/sec

**Stability**:
- [ ] No critical issues in first hour
- [ ] No critical issues in first 24 hours
- [ ] No data loss
- [ ] User feedback positive

**Team**:
- [ ] On-call team available
- [ ] Escalation tested
- [ ] Rollback available
- [ ] Communication effective

**Documentation**:
- [ ] Deployment logged
- [ ] Incidents documented
- [ ] Metrics recorded
- [ ] Lessons learned captured

**Status**: **IF ALL ABOVE PASS → PRODUCTION DEPLOYMENT SUCCESSFUL** ✅

---

## 🎉 Week 2 Complete

**What You Have Now**:
- ✅ Production system live
- ✅ 99.5%+ uptime demonstrated
- ✅ Comprehensive monitoring active
- ✅ Performance benchmarks established
- ✅ Team trained on procedures
- ✅ Rollback procedures tested

**Next Step**: Week 3 Optimization
- Performance tuning based on real data
- Further optimization
- Documentation updates
- Plan Phase B upgrades

---

**Week 2 COMPLETE. Ready for Week 3 Optimization.**

