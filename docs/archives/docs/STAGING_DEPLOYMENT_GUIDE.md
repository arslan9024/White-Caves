# 🚀 STAGING DEPLOYMENT GUIDE
**For: Super User Dashboard Enhancement**  
**Version:** 1.0  
**Date:** March 10, 2026  
**Status:** PRODUCTION-READY  

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### Step 1: Verify Build Status ✅

```bash
# Run build verification
npm run build

# Expected output:
# ✅ Build successful
# ✅ 0 TypeScript errors
# ✅ 0 import errors
# ✅ No console warnings
```

### Step 2: Verify Dev Environment ✅

```bash
# Check dev server running
npm run dev

# Expected:
# ✅ Server on localhost:5000
# ✅ Dashboard accessible at /lion
# ✅ All features working
```

### Step 3: Backup Current Production

```bash
# Create backup directory
mkdir -p /backups/production/$(date +%Y%m%d)

# Copy current dashboard files
cp -r src/pages/UnifiedDashboardPage.jsx /backups/production/$(date +%Y%m%d)/
cp -r src/components/admin/ /backups/production/$(date +%Y%m%d)/
cp -r src/components/layout/ /backups/production/$(date +%Y%m%d)/
```

---

## 🎯 DEPLOYMENT PHASES

### PHASE 1: Pre-Deployment (30 minutes)

#### 1.1: Environment Preparation

```bash
# Switch to staging branch
git checkout staging

# If needed, create staging branch
git checkout -b staging

# Verify current branch
git branch -v
# Expected: * staging

# Pull latest from origin
git pull origin staging
```

#### 1.2: Dependencies Update

```bash
# Install latest dependencies
npm install

# Verify installations
npm list react redux react-redux

# Expected: All dependencies installed without conflicts
```

#### 1.3: Final Build

```bash
# Clean build
npm run build

# Expected output:
# ✅ Build time: 7-10 seconds
# ✅ 0 TypeScript errors
# ✅ 0 warnings (except CSS)
# ✅ Bundle optimized
```

---

### PHASE 2: Staging Deployment (45 minutes)

#### 2.1: Deploy Code to Staging Server

```bash
# Option A: Via Git (Recommended)
git push origin staging

# Option B: Via FTP/SCP (if using manual deployment)
scp -r dist/* user@staging-server:/var/www/white-caves/

# Option C: Via Docker (if using containerization)
docker build -t white-caves:staging-1.0 -f Dockerfile.frontend .
docker push your-registry/white-caves:staging-1.0
docker pull your-registry/white-caves:staging-1.0
docker run -d -p 5000:5000 --name white-caves-staging white-caves:staging-1.0
```

#### 2.2: Verify Staging Deployment

```bash
# Test staging URL (replace with your staging domain)
curl https://staging.whitecaves.com/api/health

# Expected response:
# {"status": "ok", "version": "1.0"}

# Test main dashboard route
curl https://staging.whitecaves.com/lion

# Expected: HTML response with dashboard
```

#### 2.3: Database Synchronization (if needed)

```bash
# If using MongoDB sync
mongodump -h production-db -o /backups/mongo/production
mongostore -d staging-db -s /backups/mongo/production

# Verify data sync
mongo --eval "db.users.count()" staging-db
```

---

### PHASE 3: Staging Verification (1 hour)

#### 3.1: Automated Tests

```bash
# Run full test suite against staging
npm run test:staging

# Run E2E tests against staging
npm run test:e2e:staging

# Expected: All tests pass
```

#### 3.2: Manual Testing Checklist

**Staging URL:** `https://staging.whitecaves.com`

Access the super user dashboard:
```
1. Navigate to: https://staging.whitecaves.com/lion
2. Login with super user credentials
3. Execute testing steps from TEST_EXECUTION_REPORT.md
```

**Test Checklist:**
- [ ] MainNavBar Operations dropdown functional
- [ ] Quick Stats display correct values
- [ ] ProfilePanel admin badge visible
- [ ] Sidebar admin items accessible
- [ ] AdminDashboard all tabs working
- [ ] Dark mode toggle working
- [ ] Responsive design tested (mobile/tablet/desktop)
- [ ] No console errors
- [ ] No performance issues
- [ ] Database queries working

#### 3.3: Performance Testing

```bash
# Check page load time
curl -w "Time to connect: %{time_connect}s\nTime to first transfer: %{time_starttransfer}s\n" https://staging.whitecaves.com/lion

# Expected:
# Time to connect: <1s
# Time to first transfer: <2s

# Check performance metrics (using Lighthouse)
lighthouse https://staging.whitecaves.com/lion --output=json > lighthouse-staging.json

# Expected scores:
# Performance: >80
# Accessibility: >90
# Best Practices: >90
```

#### 3.4: Security Verification

```bash
# Check SSL certificate
curl -vI https://staging.whitecaves.com | grep -i "SSL\|TLS"

# Expected: TLS 1.2 or higher

# Check security headers
curl -I https://staging.whitecaves.com | grep -i "security\|x-frame\|x-content"

# Expected: Security headers present
```

---

### PHASE 4: UAT (User Acceptance Testing) - 2-3 hours

#### 4.1: Assign Testers

**Test Team:**
- [ ] Super User (Admin)
- [ ] Department Manager
- [ ] Freelancer (Agent)
- [ ] End User

#### 4.2: UAT Scenarios

**Scenario 1: Super User Admin Operations**
```
1. Login as super user
2. Click ⚙️ Ops dropdown
3. Review System Settings
4. Check System Health
5. Verify User Management
6. Export Audit Logs
Expected: All options functional, data accurate
```

**Scenario 2: Quick Stats Verification**
```
1. Verify Properties count (should match database)
2. Verify Users count (should match database)
3. Verify Leads count (should match database)
4. Verify System Health status
Expected: All metrics accurate and updating
```

**Scenario 3: AdminDashboard Configuration**
```
1. Access Admin tab
2. Verify Overview metrics
3. Test Users tab filtering
4. Export Analytics report
5. Update Settings
Expected: All functions working, changes saved
```

**Scenario 4: Responsive Testing**

Run on actual devices:
- [ ] Tested on iPhone 12 (375px)
- [ ] Tested on iPad (768px)
- [ ] Tested on Desktop (1440px)

#### 4.3: Document Issues

For each issue found, document:
```
Issue ID: [UAT-001]
Severity: [Critical|High|Medium|Low]
Component: [MainNavBar|AdminDashboard|etc.]
Description: [Clear description]
Steps to Reproduce: [1. Login, 2. Click...]
Expected: [What should happen]
Actual: [What happened]
Screenshot: [Attach if UI issue]
```

#### 4.4: Issue Resolution

```
Critical Issues:
  - Pause deployment
  - Fix immediately
  - Re-test
  - Resume deployment

High Issues:
  - Can proceed with deployment
  - Fix in next sprint
  - Monitor in production

Medium/Low Issues:
  - Document for future sprints
  - Fix after production release
```

---

### PHASE 5: Pre-Production Readiness (30 minutes)

#### 5.1: Staging Sign-Off

```
Sign-off from:
- [ ] QA Lead (signed off tests)
- [ ] Technical Lead (verified code quality)
- [ ] Product Owner (verified requirements met)
- [ ] Operations (verified infrastructure ready)

Approval Status: [_______________]
Date: [_______________]
```

#### 5.2: Production Environment Preparation

```bash
# Get list of current production servers
ansible-inventory -i hosts | grep production

# Expected output:
# production-server-1
# production-server-2
# production-server-3

# Test connectivity to production servers
for host in $(ansible-inventory -i hosts | grep production); do
  ping -c 1 $host && echo "$host: OK" || echo "$host: FAIL"
done
```

#### 5.3: Rollback Procedure Verification

```bash
# Verify rollback scripts exist
ls -la scripts/rollback*

# Expected files:
# scripts/rollback-database.sh
# scripts/rollback-code.sh
# scripts/rollback-complete.sh

# Test rollback on staging first
./scripts/rollback-complete.sh staging

# Expected: Rollback successful, staging restored
```

---

### PHASE 6: Production Deployment (1-2 hours)

#### 6.1: Pre-Production Window

**Best practices:**
- [ ] Schedule during low-traffic window (e.g., 2-4 AM)
- [ ] Have team on standby
- [ ] Disable auto-scaling (if used)
- [ ] Set monitoring alerts to high sensitivity

#### 6.2: Deployment Steps

```bash
# Step 1: Notify stakeholders
echo "Starting production deployment..." | mail -s "White Caves Deployment" team@company.com

# Step 2: Health check current production
curl https://api.whitecaves.com/health

# Step 3: Switch to production branch and deploy
git checkout main
git pull origin main

# Step 4: Build production bundle
npm run build:prod

# Step 5: Deploy to production servers
git push origin main

# For containerized deployment:
docker build -t white-caves:prod-1.0 -f Dockerfile.frontend .
docker push your-registry/white-caves:prod-1.0

# Using Kubernetes (if applicable):
kubectl set image deployment/white-caves-frontend white-caves=your-registry/white-caves:prod-1.0
kubectl rollout status deployment/white-caves-frontend

# Step 6: Verify deployment
curl https://api.whitecaves.com/health
curl https://whitecaves.com/lion

# Expected: HTTP 200, dashboard loading
```

#### 6.3: Production Verification

```bash
# Quick verification script
./scripts/verify-deployment.sh production

# This script should:
# - Check all servers are running
# - Verify database connections
# - Confirm API responses
# - Test critical user flows
```

#### 6.4: Post-Deployment Monitoring

**Monitor for 30 minutes:**

```bash
# Watch error logs
tail -f /var/log/white-caves/error.log

# Monitor CPU/Memory
watch 'ps aux | grep white-caves | grep -v grep'

# Monitor database connections
mongo --eval "db.currentOp()" admin

# Monitor API response times
curl -w "Response time: %{time_total}s\n" https://api.whitecaves.com/users/count
```

---

## 📊 DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] Build verified (0 errors)
- [ ] All tests passing
- [ ] Dependencies updated
- [ ] Backup created
- [ ] Team notified

### Staging Deployment
- [ ] Code pushed to staging
- [ ] Tests pass on staging
- [ ] UAT completed successfully
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Sign-off obtained

### Production Deployment
- [ ] Low-traffic window selected
- [ ] Team on standby
- [ ] Rollback procedure verified
- [ ] Monitoring configured
- [ ] Alerts set
- [ ] Health checks working

### Post-Deployment
- [ ] All servers running
- [ ] Database synced
- [ ] Users can access dashboard
- [ ] No errors in logs
- [ ] Performance metrics normal
- [ ] Monitoring active

---

## 🔄 ROLLBACK PROCEDURE

If critical issues are found in production:

```bash
# STEP 1: Immediate action
curl https://api.whitecaves.com/health  # Verify issue
echo "Initiating rollback..." | mail -s "CRITICAL: Rollback started" team@company.com

# STEP 2: Execute rollback script
./scripts/rollback-complete.sh production

# This will:
# - Revert code to previous version
# - Restore database if needed
# - Restart services
# - Verify old version running

# STEP 3: Verify rollback
curl https://whitecaves.com/lion
curl https://api.whitecaves.com/health

# Expected: Old version running, no errors

# STEP 4: Notify team
echo "Rollback completed. Resuming normal operations." | mail -s "Rollback Complete" team@company.com

# STEP 5: Post-mortem
# Schedule post-mortem meeting within 24 hours
# Document what went wrong
# Fix issues before re-attempting deployment
```

---

## 📝 DEPLOYMENT LOG TEMPLATE

Use this to document the actual deployment:

```
DEPLOYMENT LOG - [DATE]
=======================

DEPLOYMENT WINDOW: [START TIME] - [END TIME]
DEPLOYER: [NAME]
WITNESS: [NAME]

PRE-DEPLOYMENT:
[ ] Build verified
[ ] Tests passing
[ ] Team notified
[ ] Rollback verified

DEPLOYMENT EXECUTION:
Time: [START]
- Pushed code to staging ✓
- Ran tests ✓
- UAT passed ✓
- Deployed to production ✓
Time: [END]

POST-DEPLOYMENT:
Time: [START]
- Health checks passing ✓
- Users reporting success ✓
- No critical errors ✓
- Monitoring active ✓
Duration monitored: 30 minutes ✓
Time: [END]

ISSUES FOUND:
[List any issues]

RESOLUTION:
[How issues were resolved]

APPROVALS:
[ ] QA Lead: _____________ Date: _____
[ ] Tech Lead: _____________ Date: _____
[ ] Ops Manager: _____________ Date: _____

STATUS: COMPLETE ✓
```

---

## 🎯 SUCCESS CRITERIA

Deployment is considered **SUCCESSFUL** when:

```
✅ All code deployed without errors
✅ All tests passing (100%)
✅ UAT completed with approval
✅ Zero critical issues in logs
✅ Performance within SLA (response time <2s)
✅ Users can access dashboard (100% uptime)
✅ No rollbacks needed
✅ Team monitoring active
✅ Post-deployment metrics normal
```

---

## 📞 SUPPORT & ESCALATION

**During Deployment:**

```
Issue Level    Contact              Response Time
Critical       @engineering-lead    5 minutes
High           @tech-lead          15 minutes
Medium         @dev-team           30 minutes
Low            ticket-system       Next business day
```

**Deployment Support Team:**
- Lead: [Engineering Manager]
- Tech: [Senior Developer]
- Ops: [DevOps Engineer]
- QA: [QA Lead]

---

## 📈 POST-DEPLOYMENT REPORTING

**Report to include:**

1. **Deployment Metrics**
   - Deployment duration
   - Number of servers updated
   - Rollback performed? (Yes/No)

2. **Quality Metrics**
   - Build quality (0 errors target)
   - Test pass rate (100% target)
   - UAT issues found (0 target)

3. **Performance Metrics**
   - Page load time: [__ ms]
   - API response time: [__ ms]
   - Uptime: [__ %]

4. **User Impact**
   - Users affected: [___]
   - Issues reported: [___]
   - Resolution time: [___ min]

5. **Team Feedback**
   - Deployment process rating: [1-10]
   - Suggestions for improvement: [____]

---

## ✅ CONCLUSION

This guide provides a structured, safe approach to deploying the Super User Dashboard enhancement to production.

**Key Principles:**
1. Test thoroughly before production
2. Automate what you can
3. Verify at each step
4. Monitor continuously
5. Be ready to rollback

**Status: READY FOR DEPLOYMENT** ✅

**Next Steps:**
1. Execute staging deployment (today)
2. Complete UAT (tomorrow)
3. Deploy to production (end of week)
4. Monitor for 7 days
5. Close deployment cycle

---

**Document Version:** 1.0  
**Last Updated:** March 10, 2026  
**Next Review:** After first production deployment  
**Owner:** Platform Engineering  

