# EMERGENCY RESPONSE PROCEDURES
## What To Do When Things Go Wrong

**Purpose**: Step-by-step recovery procedures for common deployment problems  
**Use When**: Issues occur during Week 1 deployment (or any day)  
**Responsibility**: Lead team member + person who discovered issue  

---

## 🚨 EMERGENCY RESPONSE FLOW

```
Issue Occurs
    ↓
Report Immediately (Slack @channel)
    ↓
Assess Severity (Critical / High / Medium / Low)
    ↓
Follow Appropriate Response Procedure
    ↓
Execute Resolution Steps
    ↓
Verify Fix Works
    ↓
Document What Happened
    ↓
Report Results
    ↓
Decide: Continue or Pause
```

---

## 📋 SEVERITY LEVELS

### 🔴 CRITICAL (Stop Everything)
**Characteristics:**
- Deployment is blocked
- Core service won't start
- System is crashing repeatedly
- Data could be lost
- Cannot test anything

**Response Time**: < 5 minutes
**Authority to Make Decisions**: SRE Lead + Product Lead

### 🟠 HIGH (Fast Response)
**Characteristics:**
- Important functionality broken
- Tests can't run
- Performance severely degraded
- Major feature unavailable

**Response Time**: < 15 minutes
**Authority to Make Decisions**: Relevant lead + Product Lead

### 🟡 MEDIUM (Scheduled Response)
**Characteristics:**
- Non-critical functionality broken
- One component affected
- Workaround available
- Can proceed with caution

**Response Time**: < 1 hour
**Authority to Make Decisions**: Relevant lead

### 🟢 LOW (Document & Continue)
**Characteristics:**
- Minor issue
- No immediate impact
- Can be fixed later
- Doesn't block progress

**Response Time**: Document, fix tomorrow
**Authority to Make Decisions**: Relevant lead

---

## 🔴 CRITICAL ISSUES - EMERGENCY PROCEDURES

### CRITICAL Issue #1: App Container Won't Start

**Symptoms**:
- `docker ps` shows app container not running OR constantly restarting
- Logs show immediate crash
- Cannot reach localhost:8000
- Error appears in first 5 seconds of startup

**IMMEDIATE ACTIONS (Next 5 minutes)**:

```bash
# Step 1: Confirm the issue
docker ps                    # Is app container running?
docker logs app --tail 50    # What's the error?

# Step 2: Check if it's configuration
cat .env.staging | grep NODE_ENV
# Expected: NODE_ENV=staging

# Step 3: Try manual restart with debug output
docker-compose -f docker-compose.staging.yml stop app
docker-compose -f docker-compose.staging.yml up app  # DON'T use -d
# Watch for error in console output

# Step 4: If restarting doesn't help
docker-compose logs app | grep -E "error|ERROR|Error" | head -20
```

**RECOVERY OPTIONS** (Choose one based on error):

**Option A: Node.js Error in Code**
```bash
# If error is about JavaScript/TypeScript:

# 1. Check if code compiles
npm run build

# 2. If build fails:
   → Call @dev-lead immediately
   → This is a code issue, not infrastructure
   → @dev-lead must fix the code
   → While they're fixing: continue with other services
   
# 3. While waiting for code fix:
   → Deploy other services (mongo, redis, nginx)
   → Test what's working
   → Run QA tests that don't need app

Timeline: 15-30 min for code fix
```

**Option B: Database Connection Error**
```bash
# If error is "Cannot connect to MongoDB":

# 1. Verify MongoDB is running
docker ps | grep mongo
# Expected: mongo container running

# 2. If mongo not running:
docker-compose -f docker-compose.staging.yml up -d mongo
sleep 30
# Let MongoDB start completely

# 3. Verify MongoDB is ready
docker logs mongo | grep "ready to accept"
# Expected: Ready to accept connections

# 4. Now restart app
docker-compose -f docker-compose.staging.yml up -d app
sleep 10
docker ps | grep app
# Expected: app container running

Timeline: 5-10 minutes
```

**Option C: Memory/Resource Issue**
```bash
# If error is "out of memory" or "resource temporarily unavailable":

# 1. Check system resources
docker stats --no-stream
# Look for: high memory (> 90%), high CPU (> 95%)

# 2. If resources are constrained:
   a) Stop other containers (dev containers, old projects)
   b) Free up system memory
   c) Increase Docker memory allocation (if on desktop Docker)
   
# 3. Restart app
docker-compose -f docker-compose.staging.yml restart app

Timeline: 5-15 minutes
```

**Option D: Configuration Problem**
```bash
# If error mentions missing config or environment variable:

# 1. List current variables
env | grep -E "DATABASE|REDIS|API|PORT|NODE"

# 2. Verify .env.staging has them
cat .env.staging

# 3. Compare and find missing ones
# Missing variable? Add to .env.staging

# 4. Restart app with updated env
docker-compose down
docker-compose -f docker-compose.staging.yml up -d app

Timeline: 5-10 minutes
```

**ESCALATION IF STILL NOT WORKING**:
```
1. Slack: "@dev-lead @sre-lead App container critical issue"
2. Include:
   - Full error message (copy from docker logs)
   - Steps taken so far
   - Current status
3. Decision: 
   - Attempt more troubleshooting
   - Pause deployment, fix Monday
   - Rollback to Saturday's working version
```

---

### CRITICAL Issue #2: Database Corruption or Disconnection

**Symptoms**:
- Cannot connect to MongoDB
- Database queries timing out
- "Connection refused" errors
- Data appears to be missing

**IMMEDIATE ACTIONS**:

```bash
# Step 1: Check MongoDB container
docker ps | grep mongo
# Is it running? Is it restarting?

# Step 2: Check logs
docker logs mongo --tail 30
# Look for: "error", "cannot start", "corruption"

# Step 3: Can we connect?
docker exec -it mongo mongosh
# If this fails → MongoDB won't start

# Step 4: Try restart
docker-compose -f docker-compose.staging.yml stop mongo
docker-compose -f docker-compose.staging.yml rm mongo  # Remove container
docker-compose -f docker-compose.staging.yml up -d mongo
sleep 30  # Wait for startup
docker logs mongo | grep "ready to accept"
```

**RECOVERY OPTIONS**:

**Option A: Clean Restart (Data Lost - OK for Staging)**
```bash
# 1. Stop all services
docker-compose -f docker-compose.staging.yml down

# 2. Remove MongoDB volume (clears database)
docker volume rm white-caves-mongodb-data   # May vary
# OR
docker volume prune  # Remove all unused volumes

# 3. Restart fresh
docker-compose -f docker-compose.staging.yml up -d

# 4. Database will be empty but fresh
docker logs mongo | grep "ready to accept"

# 5. You may need to seed data
npm run seed:staging  # If seed script exists
# Otherwise: mark data as needing restore

Timeline: 5-10 minutes
Success: Fresh clean database
```

**Option B: Restore from Backup (If Available)**
```bash
# 1. List available backups
ls -la backups/mongodb/

# 2. Restore specific backup
mongorestore --archive=backups/mongodb/staging-backup.archive \
             --authenticationDatabase=admin

# 3. Verify restore
docker exec -it mongo mongosh
> db.departments.findOne()  # Should return data

Timeline: 10-20 minutes
Success: Database restored to known good state
```

**ESCALATION IF STILL NOT WORKING**:
```
Slack: "@sre-lead Database critical issue - MongoDB not starting"

Options offered:
1. Continue with empty database (fresh staging)
2. Skip database testing today, resume tomorrow
3. Pause deployment, investigate further
```

---

### CRITICAL Issue #3: Network/Connectivity Down

**Symptoms**:
- Cannot reach services on localhost
- DNS resolution failing
- Containers can't communicate with each other
- "No route to host" errors

**IMMEDIATE ACTIONS**:

```bash
# Step 1: Check if services exist
docker ps

# Step 2: Check Docker network
docker network ls
docker network inspect white-caves-network  # adjust name
# or
docker network inspect bridge

# Step 3: Test connectivity between containers
docker exec -it app ping mongo
# Expected: 64 bytes from mongo...

# Step 4: If no response:
docker-compose -f docker-compose.staging.yml down
docker system prune -f  # Clean up networks
docker-compose -f docker-compose.staging.yml up -d
# This recreates the network properly
```

**RECOVERY OPTIONS**:

**Option A: Network Reset**
```bash
# 1. Stop all containers
docker-compose -f docker-compose.staging.yml down

# 2. Clean Docker networks
docker network prune -f

# 3. Remove and restart
docker-compose -f docker-compose.staging.yml up -d

# 4. Verify network connectivity
docker exec -it app ping mongo
# Should ping successfully

Timeline: 5 minutes
```

**Option B: Docker Daemon Restart (Last Resort)**
```bash
# 1. Stop all containers first
docker-compose -f docker-compose.staging.yml down

# On Windows:
net stop com.docker.service
# Wait 10 seconds
net start com.docker.service

# On Mac:
osascript -e 'quit app "Docker"'
# Wait 20 seconds
open -a Docker

# On Linux:
sudo systemctl restart docker

# 2. Wait for Docker to fully start
sleep 30

# 3. Restart services
docker-compose -f docker-compose.staging.yml up -d

# 4. Verify everything running
docker ps | wc -l
# Should show all containers

Timeline: 15-20 minutes
Success: Full Docker daemon reset
```

**ESCALATION IF STILL NOT WORKING**:
```
Slack: "@sre-lead Network connectivity issue - Docker networking broken"

This typically indicates:
- Firewall blocking Docker
- System network issue  
- Docker installation problem

Options:
1. Check system network (ping external services)
2. Check firewall rules
3. May require infrastructure team involvement
```

---

## 🟠 HIGH SEVERITY ISSUES

### HIGH Issue #1: API Endpoint Not Responding

**Symptoms**:
- Health check fails
- Specific API endpoint returns 500/502/503
- API returns wrong data
- API hangs (timeout after 30 seconds)

**QUICK DIAGNOSIS**:

```bash
# Step 1: Is app container running?
docker ps | grep app
# Should show app container running

# Step 2: Can we reach it?
curl -v http://localhost:8000/health

# Step 3: What does the response say?
# Look for:
# - 200 OK = Working
# - 404 Not Found = Route doesn't exist
# - 500 Internal Error = Code problem
# - No response/timeout = App crashed or frozen

# Step 4: Check app logs
docker logs app --tail 50 | grep -E "error|Error|ERROR"
```

**RECOVERY OPTIONS**:

**Option A: Code Issue (Endpoint Logic)**
```
Issue: Endpoint returns 500 error
Cause: Bug in API route handler

Action:
1. Note the exact error from logs
2. Slack: "@dev-lead API error on GET /api/departments: [error]"
3. Dev lead investigates and reports back
4. Do NOT restart app - they need to see the error
5. While investigating:
   - Test other endpoints that work
   - Run QA tests on working APIs
   - Come back to this one later

Timeline: 15-30 min for dev investigation
```

**Option B: Timeout/Performance**
```
Issue: Endpoint returns after 30+ second delay
Cause: Slow database query or processing

Action:
1. Check database is responding
   docker exec -it mongo mongosh
   > db.departments.findOne()
   
2. If database slow:
   "MongoDB responding slowly. Investigating query performance."
   
3. Check Docker resource usage
   docker stats --no-stream
   
4. If resources constrained:
   Stop other services to free up
   
Timeline: 10-15 min
```

**Option C: Missing Endpoint**
```
Issue: Endpoint returns 404 Not Found
Cause: Route not implemented or wrong URL

Action:
1. Verify endpoint exists in code
   grep -r "GET /api/departments" src/
   
2. If exists, might be routing issue
   Check app logs for route errors
   
3. If not exists:
   This endpoint wasn't implemented yet
   Mark as "not available in this build"
   Test other endpoints instead

Timeline: 5 min
```

---

### HIGH Issue #2: Tests Failing Unexpectedly

**Symptoms**:
- Test suite fails after initially passing
- 50%+ of tests suddenly failing
- Tests were passing yesterday/earlier today

**QUICK DIAGNOSIS**:

```bash
# Step 1: Run tests again
npm run test:staging

# Step 2: Note which tests fail
# Save output: npm run test:staging > test-failure.txt

# Step 3: Pick ONE failing test
# Read the error carefully
# Is it:
# - Assertion error (expected ≠ actual)
# - Timeout (test takes too long)
# - Cannot connect error
# - Code error (import missing, etc)
```

**RECOVERY OPTIONS**:

**Option A: Infrastructure Changed**
```
Symptom: Tests can't connect to database/API
Cause: Service restarted, changed port, etc.

Action:
1. Verify all services still running
   docker ps
   
2. Verify ports unchanged
   docker port app
   # Should show 8000 mapped
   
3. Check if database got reset
   docker exec -it mongo mongosh
   > show dbs

Timeline: 5-10 min to fix
```

**Option B: Code Change Broke Something**
```
Symptom: Test assertion fails (value is different)
Cause: Code was modified, test expectations outdated

Action:
1. Don't modify the test
2. Call @dev-lead with error details
3. They verify if code is correct or needs fix
4. Update test expectations if code is intentionally different
5. Don't skip or ignore failing tests

Timeline: 15-30 min for decision
```

**Option C: Test Flakiness**
```
Symptom: Test passes sometimes, fails sometimes
Cause: Race condition, timing issue, randomization

Action:
1. Run test 3 times in a row
   npm run test:staging -- TestName
   npm run test:staging -- TestName
   npm run test:staging -- TestName
   
2. If passes 2/3 times:
   → Flaky test, not environment issue
   → @qa-lead documents this
   → Note it, move on (will fix in Phase 2)
   
3. If fails all 3 times:
   → Real issue, follow Option A or B above

Timeline: 10 min
```

---

## 🟡 MEDIUM SEVERITY ISSUES

### MEDIUM Issue #1: Single Service Performing Poorly

**Symptoms**:
- One service slow (Redis, Nginx, etc)
- High memory or CPU for one container
- Response times degraded for that service

**QUICK DIAGNOSIS**:

```bash
# Step 1: Identify which service
docker stats --no-stream | grep -E "redis|nginx|mongo"

# Step 2: Check resource usage
# If CPU > 90% or Memory > 80%:
# → Performance issue confirmed

# Step 3: Check container logs
docker logs [service-name] --tail 30
# Look for warnings or errors

# Step 4: Check if restarting helps
docker-compose -f docker-compose.staging.yml restart [service-name]
sleep 10
docker stats --no-stream | grep [service-name]
```

**RECOVERY OPTIONS**:

**Option A: Restart Service**
```bash
# 1. Restart single service (doesn't affect others)
docker-compose -f docker-compose.staging.yml restart redis

# 2. Wait 10 seconds for restart
sleep 10

# 3. Test functionality
redis-cli ping
# Expected: PONG

# 4. Monitor stats
docker stats --no-stream | grep redis
# Monitor for a minute

Timeline: 5-10 min
Typically fixes it 70% of the time
```

**Option B: Increase Resource Limits** (if available)
```bash
# Edit docker-compose.staging.yml
# Find service section, add:
services:
  redis:
    # ... existing config ...
    mem_limit: 512m      # Increase if available
    cpus: "1.0"          # Increase if available

# Save and restart
docker-compose -f docker-compose.staging.yml down
docker-compose -f docker-compose.staging.yml up -d

Timeline: 10-15 min
```

**Option C: Document and Continue**
```
If restarting doesn't improve performance:

1. Document the issue:
   "Redis slow (avg 500ms response time) after 2 hours uptime"

2. Note the metrics:
   "CPU: 85%, Memory: 75%"

3. Add to "Known Issues" list
   "Memory leak suspected in Redis service"

4. Continue testing other systems

5. Return to this after core functionality validates

Timeline: Document 5 min, continue with other work
```

---

### MEDIUM Issue #2: Partial Test Suite Failure

**Symptoms**:
- 30-50% of tests passing
- Tests pass for some services, fail for others
- Some test suites complete, others hang

**QUICK DIAGNOSIS**:

```bash
# Step 1: Identify pattern
# Which tests pass? Which fail?
npm run test:staging 2>&1 | tee test-results.txt

# Step 2: Group by service
grep -E "PASS|FAIL" test-results.txt | sort

# Step 3: Is it a service issue or test issue?
# If all "[ServiceA]" tests fail → Service A problem
# If all "database" tests fail → Database connectivity problem
# If mixed → Multiple issues
```

**RECOVERY OPTIONS**:

**Option A: Service Not Healthy**
```
If all tests for "ServiceA" fail:

1. Check that service is running
   docker ps | grep service-a
   
2. Verify it's responding
   docker logs service-a | tail 20
   
3. If not healthy:
   docker-compose -f docker-compose.staging.yml restart service-a
   sleep 10
   
4. Retry tests for that service only
   npm run test:staging ServiceA

Timeline: 10 min per service
```

**Option B: Database Issue**
```
If all "database" tests fail:

1. Test database manually
   docker exec -it mongo mongosh
   > db.departments.findOne()
   
2. If database queries slow or failing:
   → See CRITICAL Issue #2 above (Database Corruption)
   → Apply recovery steps
   
3. Once database healthy:
   npm run test:staging

Timeline: 10-30 min
```

**Option C: Accept Partial Pass, Move Forward**
```
If 50%+ of tests pass and failing tests are known issues:

1. Document what passed:
   "Database tests: ✅ all pass
    API tests: ✅ 90% pass
    WhatsApp: ⚠️ 50% pass (service not fully initialized)"
    
2. Note what's failing and why:
   "WhatsApp tests failing: Feature not in scope for Day 1"
   
3. Continue testing other areas
   
4. Return to failing tests on Day 2

Timeline: Continue forward, come back later
```

---

## 🟢 LOW SEVERITY ISSUES

### LOW Issue: Minor Warnings in Logs

**Symptoms**:
- Logs show warnings (not errors)
- Deprecation notices in startup
- Non-critical missing features

**Action**: Document and Continue

```
1. Note the warning in a text file:
   "Redis startup warning: deprecation notice for AUTH command"
   
2. Check if functionality works despite warning:
   redis-cli ping
   # If returns: PONG → works fine
   
3. Add to "Day 2 Cleanup" list:
   "Update Redis config to use new AUTH syntax"
   
4. Continue with deployment
   No action needed right now
```

---

## 📋 DECISION MATRIX

**Use this to decide: Continue Deployment or Pause?**

```
Issue Found          Severity    Can Workaround?   Decision
──────────────────────────────────────────────────────────
App container crash  CRITICAL    NO                STOP - Fix
Database down        CRITICAL    NO                STOP - Fix
Network broken       CRITICAL    NO                STOP - Fix
API endpoint error   HIGH        PARTIALLY         CONTINUE - Fix in parallel
Test failures        HIGH        DEPENDS           CONTINUE or PAUSE
Service slow         MEDIUM      YES (restart)     CONTINUE
Warning in logs      LOW         YES (ignore)      CONTINUE

RULE: Only STOP if you cannot test anything at all.
      Otherwise: Document, continue, fix later.
```

---

## 📞 ESCALATION DECISION TREE

```
Issue occurs
    |
Severity assessment
    |
    ├─ CRITICAL
    │   ├─ Try recovery option (5 min)
    │   ├─ Succeeds? → Continue
    │   ├─ Fails? → Slack @sre-lead + @product-lead
    │   └─ Decision: Fix or Pause Deployment
    │
    ├─ HIGH
    │   ├─ Try recovery option (10 min)
    │   ├─ Succeeds? → Continue
    │   ├─ Fails? → Slack @relevant-lead
    │   └─ Parallel investigation while continuing
    │
    ├─ MEDIUM
    │   ├─ Try recovery option (15 min)
    │   ├─ Succeeds? → Continue
    │   ├─ Fails? → Document + Continue
    │   └─ Fix on Day 2
    │
    └─ LOW
        ├─ Document issue
        ├─ Continue immediately
        └─ Fix later
```

---

## 🚨 WHEN TO PAUSE ENTIRE DEPLOYMENT

**Only pause if:**

```
❌ Core service won't start for > 15 minutes
❌ Cannot test anything (0% test pass rate)
❌ Data corruption suspected
❌ System keeps crashing
❌ Infrastructure unreachable (network down, Docker broken)
❌ Cannot be safely recovered by team
```

**If you pause:**

```
1. Slack: "@channel - Pausing deployment due to [issue]"
   
2. Decision needed from: @product-lead + @sre-lead
   
3. Options:
   a) Delay start to [time] to fix
   b) Pause until Monday afternoon
   c) Postpone to Tuesday
   d) Escalate to director/senior engineer
   
4. Do NOT keep trying random fixes
   Stop, assess, decide, communicate.
```

---

## ✅ AFTER RESOLUTION

**Every time you resolve an issue, do this:**

```
1. Verify the fix:
   "Restart complete, verification shows [metric] healthy"
   
2. Test affected functionality:
   "Ran [test] - result: PASS"
   
3. Post summary to Slack:
   Issue: [description]
   Root Cause: [what caused it]
   Fix Applied: [what you did]
   Verification: [all working now]
   Time to Fix: [X minutes]
   
4. Update issue tracking:
   Document in your incident log
   
5. Move forward:
   Continue deployment
```

---

## 📋 INCIDENT LOG TEMPLATE

**Keep a running log of any issues. Use this template:**

```
INCIDENT #[number]

Date/Time: March 17, 2026, 10:30 AM
Severity: [CRITICAL / HIGH / MEDIUM / LOW]
Service: [App / Database / Redis / Nginx / etc]
Reported By: @[person name]

Issue Description:
  [What happened / what was observed]

Root Cause:
  [Why did it happen]

Steps Taken:
  1. [Action taken]
  2. [Action taken]
  3. [Action taken]

Resolution:
  [What fixed it]

Time to Resolution: [Minutes]

Impact:
  [What was affected / how many users / how long offline]

Prevention:
  [What we'll do to prevent this next time]

Severity: Was this prediction correct? [This time it was X, but impact was Y]

Assigned For Follow-up:
  [ ] Day 2 (issue #XX)
  [ ] Post-deployment review
  [ ] No follow-up needed
```

---

## 🎯 FINAL EMERGENCY REMINDERS

```
✅ DON'T PANIC
   Issues are normal. We have procedures.

✅ SLOW DOWN
   5 minutes of diagnosis > 1 hour of random fixes

✅ COMMUNICATE IMMEDIATELY
   Slack update before you start fixing

✅ DON'T WORK IN ISOLATION
   Get the right person involved early

✅ FOLLOW THE PROCEDURES
   These are tested, they work

✅ DOCUMENT EVERYTHING  
   For your own future reference + team learning

✅ ASK FOR HELP
   Better to escalate than stay stuck

✅ PREVENT PANIC IN TEAM
   Professional calm communication stops panic spreading
```

---

**You now have procedures for every common issue.**

**Bookmark this page. Print it. Know it.**

**Most issues are recoverable if you follow these steps.**

