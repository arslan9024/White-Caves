# WEEK 1: STAGING DEPLOYMENT EXECUTION GUIDE

**Execution Period**: March 17-21, 2026 (Mon-Fri)  
**Total Effort**: 21 hours (Team: DevOps + SRE + QA + Dev)  
**Risk Level**: LOW (Staging environment only, fully reversible)  
**Success Criteria**: All tests pass, UAT sign-off obtained, zero critical issues

---

## 📋 Day 1 (Monday): Staging Environment Setup (4 hours)

### Pre-Execution Verification (30 min)

**Checklist**:
```bash
# [ ] Verify Docker installation
docker --version
# Expected: Docker version 24.0+

# [ ] Verify docker-compose
docker-compose --version
# Expected: docker-compose version 2.0+

# [ ] Verify kubectl (if using K8s)
kubectl version --client
# Expected: v1.28+

# [ ] Verify git
git status
# Expected: Clean repository or feature branch

# [ ] Verify disk space
df -h | grep -E '/$'
# Expected: > 50GB free
```

**Team Roles Assigned**:
- [ ] **DevOps Lead**: [Name] - Executes deployment
- [ ] **SRE Lead**: [Name] - Monitors during deployment
- [ ] **Database Admin**: [Name] - Database configuration
- [ ] **QA Lead**: [Name] - Prepares test cases

**Communication Channel Setup**:
- [ ] Slack/Teams channel created: #white-caves-deploy
- [ ] On-call contacts shared
- [ ] Escalation path confirmed

### Task 1: Environment Preparation (1 hour 30 min)

#### Option A: Docker Compose Staging (Recommended for Quick Setup)

```bash
# 1. Navigate to project root
cd /path/to/white-caves

# 2. Create staging environment file
cp .env.production.example .env.staging

# 3. Edit .env.staging with staging values
# ⚠️ IMPORTANT: Use staging credentials, not production!
# 
# Required changes:
# - DATABASE_URL=mongodb://staging-mongo:27017/white-caves-staging
# - REDIS_URL=redis://staging-redis:6379
# - NODE_ENV=staging
# - LOG_LEVEL=debug
# - API_BASE_URL=https://staging-api.whitecaves.local
```

```bash
# 4. Build application image
docker-compose -f docker-compose.staging.yml build

# Expected output:
# ✓ Building app service
# ✓ Building mongo service
# ✓ Building redis service
# ✓ Building nginx service
# Successfully built...
```

```bash
# 5. Verify image built
docker images | grep white-caves
# Expected: white-caves:latest exists

# 6. Create staging volumes/networks
docker volume create white-caves-mongo-data
docker volume create white-caves-redis-data
docker network create white-caves-staging-net
```

**Verification**:
```bash
docker ps -a | grep white-caves
# Should show: No containers yet (normal before start)

docker images | grep white-caves
# Should show: white-caves:latest image ready

docker volume ls | grep white-caves
# Should show: Volume names created
```

#### Option B: Kubernetes Staging (Production-Like Setup)

```bash
# 1. Create staging namespace
kubectl create namespace white-caves-staging

# 2. Create staging context (optional)
kubectl config set-context white-caves-staging \
  --namespace=white-caves-staging \
  --cluster=your-cluster \
  --user=your-user

# 3. Label nodes for staging (if using node labels)
kubectl label nodes your-node-name tier=staging

# 4. Create secrets from .env.staging
kubectl create secret generic app-secrets \
  --from-env-file=.env.staging \
  -n white-caves-staging

# 5. Verify secret created
kubectl get secrets -n white-caves-staging
# Expected: app-secrets exists
```

### Task 2: Start Services (1 hour 30 min)

#### Docker Compose Start

```bash
# 1. Start all services
docker-compose -f docker-compose.staging.yml up -d

# 2. Monitor startup
docker-compose -f docker-compose.staging.yml logs -f
# Watch for all services coming up
# Expected: "listening on port 8000" and "MongoDB connected"

# 3. Wait for services (check every 10 seconds)
for i in {1..30}; do
  echo "Check $i/30..."
  curl -s http://localhost:8000/api/health | jq . && break
  sleep 10
done
```

**Service Startup Timeline**:
```
1. MongoDB: 10-15 seconds
2. Redis: 5-10 seconds
3. Application startup: 15-30 seconds
4. Nginx ready: 5 seconds
────────────────────────────
Total: 2-3 minutes
```

#### Kubernetes Staging Start

```bash
# 1. Apply manifests
kubectl apply -f k8s/white-caves-k8s.yaml -n white-caves-staging

# 2. Watch rollout progress
kubectl rollout status deployment/app -n white-caves-staging --timeout=5m
# Expected: "deployment "app" successfully rolled out"

# 3. Verify all pods running
kubectl get pods -n white-caves-staging
# Expected: All pods in "Running" state

# 4. Check pod logs
kubectl logs -f deployment/app -n white-caves-staging
# Watch for startup messages
```

### Task 3: Health Verification (1 hour)

```bash
# 1. Check health endpoint
curl -v http://localhost:8000/api/health

# Expected response:
# HTTP/1.1 200 OK
# {
#   "status": "ok",
#   "database": "connected",
#   "cache": "connected",
#   "timestamp": "2026-03-17T09:00:00Z"
# }

# If not 200, diagnose:
docker-compose -f docker-compose.staging.yml logs app
# Look for connection errors

# 2. Check database connectivity
curl -s http://localhost:8000/api/health | jq .database
# Expected: "connected"

# If not connected:
# - Verify MongoDB running: docker ps | grep mongo
# - Check credentials in .env.staging

# 3. Check cache connectivity
curl -s http://localhost:8000/api/health | jq .cache
# Expected: "connected"

# If not connected:
# - Verify Redis running: docker ps | grep redis
# - Check Redis connectivity: docker exec white-caves-redis redis-cli ping

# 4. Test API endpoints
curl http://localhost:8000/api/status
# Expected: {"status":"ok"}

curl http://localhost:8000/api/version
# Expected: {"version":"1.0.0"}
```

**Success Criteria for Day 1**:
- [ ] Docker/K8s services started
- [ ] All containers/pods running
- [ ] Health check returns 200 OK
- [ ] Database connected
- [ ] Redis/Cache connected
- [ ] Zero startup errors in logs
- [ ] SRE monitoring active

**Time**: 4 hours ✅

---

## 📋 Day 2 (Tuesday): Functional Testing (6 hours)

### Task 1: API Testing (2 hours)

**Test Categories**:
```
1. Authentication Endpoints (30 min)
   ├─ POST /api/auth/login
   ├─ POST /api/auth/register
   ├─ POST /api/auth/refresh
   └─ POST /api/auth/logout

2. Core CRUD Endpoints (45 min)
   ├─ GET /api/clients (list)
   ├─ POST /api/clients (create)
   ├─ GET /api/clients/{id} (read)
   ├─ PUT /api/clients/{id} (update)
   └─ DELETE /api/clients/{id} (delete)

3. Error Handling (45 min)
   ├─ 401 Unauthorized (missing token)
   ├─ 403 Forbidden (insufficient permissions)
   ├─ 404 Not Found (missing resource)
   ├─ 400 Bad Request (invalid input)
   └─ 500 Server Error (internal issues)
```

**Automated Test Script**:
```bash
#!/bin/bash
# Test script to validate API

API_URL="http://localhost:8000/api"
PASSED=0
FAILED=0

test_endpoint() {
  local method=$1
  local endpoint=$2
  local expected_status=$3
  
  response=$(curl -s -w "\n%{http_code}" -X $method "$API_URL$endpoint")
  status=$(echo "$response" | tail -n1)
  
  if [ "$status" = "$expected_status" ]; then
    echo "✅ $method $endpoint → $status"
    ((PASSED++))
  else
    echo "❌ $method $endpoint → $status (expected $expected_status)"
    ((FAILED++))
  fi
}

# Run tests
test_endpoint "GET" "/health" "200"
test_endpoint "GET" "/status" "200"
test_endpoint "POST" "/auth/login" "400"  # No credentials
test_endpoint "GET" "/protected" "401"    # No auth

echo ""
echo "Results: $PASSED passed, $FAILED failed"
exit $FAILED
```

### Task 2: Frontend Testing (2 hours)

**Browser Testing Checklist**:
```
Opening:
  [ ] Page loads at http://localhost:5000
  [ ] No console errors
  [ ] CSS loads correctly
  [ ] Responsive design works

Navigation:
  [ ] All menu items functional
  [ ] Routes navigate correctly
  [ ] Back button works
  [ ] Deep links work

Forms:
  [ ] Form submission works
  [ ] Validation messages appear
  [ ] Success message shown
  [ ] Error handling works

State Management (Redux):
  [ ] Redux Devtools shows state
  [ ] State updates correctly
  [ ] No state mutation warnings

Real-time Features:
  [ ] WebSocket connects
  [ ] Live updates received
  [ ] Connection maintains
```

**Manual Testing Path**:
```
1. Open http://localhost:5000 in browser
2. Chrome DevTools → Console (should be clean)
3. Chrome DevTools → Network (check requests status)
4. Try each feature:
   - Create item
   - Read/view item
   - Update item
   - Delete item
   - Real-time sync
5. Take notes of any issues
```

### Task 3: Database Testing (1 hour)

```bash
# 1. Connect to MongoDB in staging
docker exec -it white-caves-mongodb mongosh

# In MongoDB shell:
use white-caves-staging
db.collections.estimatedDocumentCount()
# Expected: Should return a number

# 2. Check data integrity
db.clients.find().limit(1)
# Expected: Sample document structure correct

# 3. Verify indexes
db.clients.getIndexes()
# Expected: Indexes are created

# 4. Check replication (if applicable)
rs.status()
# Expected: Healthy replica status

# 5. Verify backups are accessible
# (Contact database admin)
```

### Task 4: Integration Testing (1 hour)

```bash
# Run integration test suite
npm run test:integration

# Expected output:
# ✓ API +DB integration
# ✓ API + Redis cache
# ✓ WebSocket + Database sync
# ✓ File upload handling
# 
# Tests: 50 passed in 2m

# If failures, check:
docker-compose -f docker-compose.staging.yml logs
```

**Success Criteria for Day 2**:
- [ ] All API endpoints tested
- [ ] Frontend loads without errors
- [ ] CRUD operations working
- [ ] Error handling validated
- [ ] Database connectivity verified
- [ ] WebSocket connections functional
- [ ] Integration tests passing
- [ ] Zero critical issues found

**Time**: 6 hours ✅

---

## 📋 Day 3 (Wednesday): Performance & Security Testing (5 hours)

### Task 1: Performance Testing (2 hours)

```bash
# 1. Run load test - Smoke scenario
npm run load-test:smoke

# Expected:
# Duration: 1 minute
# Concurrent users: 10
# p50 latency: < 50ms
# p95 latency: < 100ms
# Error rate: 0%

# 2. Run load test - Normal scenario
npm run load-test:normal

# Expected:
# Duration: 5 minutes
# Concurrent users: 100
# p50 latency: < 100ms
# p95 latency: < 200ms
# Error rate: < 0.5%

# 3. Generate performance report
npm run load-test:report

# Review results in load-test-report.json
```

**Load Test Validation Criteria**:
```
Metric                Target        Actual        Status
──────────────────────────────────────────────────────
p50 Latency          < 100ms        [???]         [ ]
p95 Latency          < 200ms        [???]         [ ]
p99 Latency          < 500ms        [???]         [ ]
Error Rate           < 0.5%         [???]         [ ]
Throughput           > 100 req/s    [???]         [ ]
Memory Usage         < 500MB        [???]         [ ]
CPU Usage            < 70%          [???]         [ ]
Disk I/O             < 50MB/s       [???]         [ ]
Cache Hit Ratio      > 70%          [???]         [ ]
Database Queries     < 50ms         [???]         [ ]
```

### Task 2: Security Testing (1.5 hours)

```bash
# 1. Authentication enforcement
echo "Testing: Missing auth header should return 401"
curl -s http://localhost:8000/api/protected | jq .

# 2. Authorization testing
echo "Testing: User role enforcement"
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:8000/api/admin | jq .

# 3. Rate limiting
echo "Testing: Rate limiting (should get 429 after 10 requests)"
for i in {1..15}; do
  curl -s -o /dev/null -w "Request %d: %{http_code}\n" \
    http://localhost:8000/api/health
done
# Expected: Last 5 requests return 429 Too Many Requests

# 4. HTTPS/SSL readiness
echo "Testing: Nginx configuration"
docker exec white-caves-nginx nginx -T
# Expected: No errors in configuration

# 5. Security headers
echo "Testing: Security headers present"
curl -I http://localhost:8000/api/ | grep -i "Strict-Transport-Security"
# Expected to see security headers

# 6. CORS configuration
echo "Testing: CORS restricts origin"
curl -H "Origin: https://malicious.com" \
  -H "Access-Control-Request-Method: POST" \
  -X OPTIONS http://localhost:8000/api/endpoint
# Expected: No CORS headers for unauthorized origin
```

### Task 3: Monitoring Setup Validation (1.5 hours)

```bash
# 1. Start Prometheus (if not already running)
docker-compose -f docker-compose.staging.yml up -d prometheus

# 2. Verify metrics being collected
curl -s http://localhost:9090/api/v1/targets | jq '.data.activeTargets | length'
# Expected: > 0 targets

# 3. Start Grafana
docker-compose -f docker-compose.staging.yml up -d grafana

# 4. Access Grafana dashboard
# Open: http://localhost:3000
# Login: admin / admin
# Verify: Overview dashboard shows metrics

# 5. Test alert rules
echo "Testing: Prometheus alert rules loaded"
curl -s http://localhost:9090/api/v1/rules | jq '.data.groups | length'
# Expected: > 0 alert groups

# 6. Verify metrics middleware active
curl -s http://localhost:8000/metrics | head -20
# Expected: Prometheus metrics output (lines starting with #)
```

**Success Criteria for Day 3**:
- [ ] p95 latency < 200ms
- [ ] Error rate < 0.5%
- [ ] Load test passing
- [ ] Authentication enforced
- [ ] Rate limiting active
- [ ] Security headers present
- [ ] Monitoring collecting metrics
- [ ] Alerts configured

**Time**: 5 hours ✅

---

## 📋 Day 4 (Thursday): Complete UAT & Stakeholder Sign-Off (6 hours)

### Phase 1: Smoke Testing (15 min)

```bash
# Quick validation script
./scripts/smoke-test.sh staging

# Expected output:
# ✅ API health check
# ✅ Database connectivity
# ✅ Cache functioning
# ✅ All services running
```

### Phase 2: Functional Testing (1.5 hours)

**Test Scenarios**:
```
Scenario 1: User Registration & Login (20 min)
├─ Register new user
├─ Verify email confirmation
├─ Login with credentials
├─ Reset password flow
└─ Verify session management

Scenario 2: Client Management (30 min)
├─ Create client
├─ View client list
├─ Update client details
├─ Delete client
└─ Verify audit trail

Scenario 3: Real-Time Updates (30 min)
├─ Edit client as User A
├─ User B sees real-time update
├─ Handle concurrent edits
└─ Conflict resolution works

Scenario 4: Error Scenarios (20 min)
├─ Invalid input handling
├─ Missing required fields
├─ Unauthorized access attempts
└─ Network error recovery
```

### Phase 3: Performance Review (30 min)

**Verify Metrics**:
```bash
# Pull latest metrics from Prometheus
curl -s 'http://localhost:9090/api/v1/query?query=histogram_quantile(0.95,rate(http_request_duration_seconds_bucket[5m]))'

# Expected p95: < 200ms

# Check error rate
curl -s 'http://localhost:9090/api/v1/query?query=rate(http_requests_errors_total[5m])'

# Expected: < 0.1%
```

### Phase 4: Database & Cache Validation (30 min)

```bash
# 1. Verify data consistency
npm run test:db-integrity

# 2. Verify backup procedures
./scripts/backup-staging-db.sh

# 3. Test recovery
./scripts/verify-backup.sh

# 4. Check cache effectiveness
curl -s http://localhost:8000/api/metrics | grep cache_hits
```

### Phase 5: Monitoring & Alerting (30 min)

```bash
# 1. Verify all dashboards loading
curl -s http://localhost:3000/api/dashboards | jq '.[] | .title'

# 2. Test alert channel (Slack/Email)
# Trigger test alert and verify notification received

# 3. Check log aggregation
# Verify logs appear in centralized system
```

### Phase 6: Stakeholder Demo & UAT (2 hours)

**Demo Agenda**:
```
1. System Overview (5 min)
   - What's new in this version
   - Key features back-ended
   - Performance improvements

2. Live Demo (30 min)
   - Walk through happy path scenarios
   - Show real-time updates
   - Demonstrate performance metrics

3. Testing Results Review (20 min)
   - Performance benchmarks
   - Load test results
   - Security validation
   - Uptime metrics

4. Q&A & Feedback (15 min)
   - Answer stakeholder questions
   - Collect feedback
   - Address concerns

5. Sign-Off (10 min)
   - Review sign-off checklist
   - Get approvals
   - Document sign-offs
```

### Phase 7: Sign-Off Documentation (1 hour)

**Create Sign-Off Document**:
```markdown
# Staging Deployment Validation Sign-Off

Date: March 20, 2026
Environment: Staging (Docker Compose)
Version: v1.0.0
Build Number: mc-2026-03-20-001

## Validation Summary

### Functional Testing
- [x] All API endpoints working (50/50 tests passed)
- [x] Frontend loads without errors
- [x] CRUD operations functional
- [x] Error handling working
- [x] WebSocket real-time updates

### Performance Testing
- [x] p50 latency: 45ms ✅
- [x] p95 latency: 185ms ✅ (Target: < 200ms)
- [x] Error rate: 0.02% ✅ (Target: < 0.1%)
- [x] Throughput: 250 req/sec ✅
- [x] Memory stable: No leaks

### Security Testing
- [x] Authentication enforced
- [x] Authorization working
- [x] Rate limiting active
- [x] Security headers present
- [x] HTTPS ready for production

### Infrastructure Testing
- [x] Docker images optimized
- [x] Health checks passing
- [x] Monitoring collecting metrics
- [x] Alerts configured correctly
- [x] Database connectivity stable

### Load Testing
- [x] 10 users, 1 min: PASS
- [x] 100 users, 5 min: PASS
- [x] 500 users, 10 min: PASS
- [x] Memory stable (no leaks)
- [x] No timeout errors

## Summary

**Status**: ✅ APPROVED FOR PRODUCTION DEPLOYMENT

All acceptance criteria met:
- Zero critical issues
- Zero security vulnerabilities
- All performance targets exceeded
- All tests passing
- Team fully trained
- Documentation complete
- Monitoring active
- Stakeholders satisfied

## Approvals

**By**: [QA Lead Name]           Date: 3/20/26     Time: 14:00
**By**: [Product Lead Name]      Date: 3/20/26     Time: 14:15
**By**: [DevOps Lead Name]       Date: 3/20/26     Time: 14:30
**By**: [Engineering Lead Name]  Date: 3/20/26     Time: 14:45

---

## Next Steps

Proceed with Week 2 Production Deployment on Monday, March 23, 2026.
Deployment window: 2:00 AM - 4:00 AM UTC (minimize user impact)
Estimated duration: 45 minutes
Rollback available: Yes (< 5 minutes)

All team members briefed on procedures.
Emergency contacts confirmed.
Monitoring dashboards ready.
```

**Success Criteria for Day 4**:
- [ ] All tests passing
- [ ] Performance exceeds targets
- [ ] Security validated
- [ ] Monitoring verified
- [ ] UAT completed with stakeholders
- [ ] Sign-off document signed
- [ ] Team confident in system
- [ ] **STATUS: APPROVED FOR PRODUCTION**

**Time**: 6 hours ✅

---

## 🎉 Week 1 Summary

**Completion Checklist**:
- [ ] Day 1: Staging environment deployed ✅
- [ ] Day 2: Functional testing complete ✅
- [ ] Day 3: Performance & security validated ✅
- [ ] Day 4: UAT complete & signed-off ✅

**Deliverables**:
- ✅ Staging environment running
- ✅ All systems verified working
- ✅ Performance benchmarks established
- ✅ Security validated
- ✅ Stakeholder sign-off obtained
- ✅ Team trained and confident

**Status**: **READY FOR PRODUCTION DEPLOYMENT (Week 2)**

**Total Effort**: 21 hours ✅  
**Risk Facing Week 2**: LOW (staging validated, team trained)  
**Success Probability**: 95%+

---

## 🚀 Ready for Week 2

**Preparation Tasks Before Monday**:
- [ ] Review PRODUCTION_DEPLOYMENT_RUNBOOK.md
- [ ] Schedule production maintenance window
- [ ] Brief customer support team
- [ ] Prepare customer announcement
- [ ] Confirm all team members available
- [ ] Test rollback procedures
- [ ] Schedule post-deployment review

---

**Week 1 COMPLETE. Ready to proceed to Week 2 Production Deployment.**

