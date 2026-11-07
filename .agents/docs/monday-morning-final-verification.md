# MONDAY MORNING FINAL VERIFICATION (8:00 AM - 9:00 AM)
## Pre-Deployment Last-Minute Checklist

**Time**: Monday, 8:00 AM - 9:00 AM (1 hour before kickoff)  
**Purpose**: Catch any issues before the team meeting  
**Responsible**: DevOps Lead  
**Duration**: ~15 minutes if all clear, up to 1 hour if issues  

---

## ⚡ QUICK VERIFICATION (Do These First - 5 minutes)

**Run these 5 checks immediately. If ANY fail, escalate to SRE lead BEFORE the 9 AM meeting.**

### Check 1: Docker Running

```bash
# Verify Docker daemon is running
docker ps

# Expected output:
# CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS   PORTS     NAMES
# (empty list is fine - we haven't started yet)

# If error: "Cannot connect to Docker daemon"
# ACTION: Restart Docker
#   Mac/Linux: open -a Docker  OR  systemctl restart docker
#   Windows: Restart Docker Desktop via System Tray
#   Windows PowerShell: net start com.docker.service
#
# STOP and wait 30 seconds for Docker to start
# Then retry

Status: [ ] PASS  [ ] FAIL
```

### Check 2: Git is Clean

```bash
# Verify we're on main branch with clean working directory
git status

# Expected output:
# On branch main
# nothing to commit, working tree clean

# If error: uncommitted changes
# ACTION: Commit or stash any changes
#   git add .
#   git commit -m "Pre-deploy checkpoint"
#
# If wrong branch:
#   git checkout main
#   git pull origin main

Status: [ ] PASS  [ ] FAIL
```

### Check 3: Configuration Files Exist

```bash
# Verify staging config files are in place
ls -la .env.staging docker-compose.staging.yml

# Expected output (both files should exist):
# -rw------- .env.staging
# -rw-r--r-- docker-compose.staging.yml

# If missing:
# ACTION: Create from previous prep
#   cp .env.production.example .env.staging
#   [edit with staging values]
#
# OR restore from backup:
#   cp .env.staging.backup .env.staging

Status: [ ] PASS  [ ] FAIL
```

### Check 4: Docker Image Built

```bash
# Verify Docker image exists from Saturday build
docker images | grep white-caves

# Expected output (should show recent build):
# white-caves    latest    abc123def456   2 hours ago   450MB

# If missing or old:
# ACTION: Rebuild now
#   docker-compose -f docker-compose.staging.yml build
#
# WARNING: This takes 5-10 minutes. If we're close to 9 AM,
# you may need to delay kickoff to 9:30 AM
#
# Post in Slack: "Rebuilding Docker image. Kickoff delayed to 9:30 AM."

Status: [ ] PASS  [ ] FAIL
```

### Check 5: Disk Space Available

```bash
# Verify we have enough space for deployment
df -h / | tail -1

# Expected output (should show > 50GB available):
# /dev/sda1    500G    250G    250G    50%   /

# Math: Available space = Total - Used = 500 - 250 = 250GB ✅

# If less than 20GB available:
# ACTION: Clean up space
#   docker system prune -a      # Remove old images
#   npm cache clean --force      # Clean npm cache
#   rm -rf node_modules/.cache  # Clean project cache
#
# Then check again

Status: [ ] PASS  [ ] FAIL
```

---

## 📊 IF ALL 5 CHECKS PASS

```
✅ Go straight to final pre-checks (next section)
✅ You're ready for 9 AM kickoff
✅ No changes to timeline
```

---

## ✅ FINAL PRE-CHECKS (5 minutes if above passed)

**Only do these if the Quick Verification all passed.**

### Pre-Check 1: Environment File Validation

```bash
# Verify .env.staging has all required variables
grep -E "DATABASE_URL|MONGODB_USER|REDIS_URL|NODE_ENV" .env.staging

# Expected output (all 4 variables present):
# DATABASE_URL=mongodb://localhost:27017/white-caves-staging
# MONGODB_USER=admin
# REDIS_URL=redis://localhost:6379
# NODE_ENV=staging

# If any variable missing:
# ACTION: Edit .env.staging and add missing variables
#   nano .env.staging    # or your editor
#   Add missing lines
#   Save and verify again

Status: [ ] PASS  [ ] FAIL
```

### Pre-Check 2: Compose File Validation

```bash
# Verify docker-compose staging file has valid syntax
docker-compose -f docker-compose.staging.yml config > /dev/null 2>&1

# If no output = SYNTAX OK
# If error output:
# ACTION: Fix the YAML syntax
#   docker-compose -f docker-compose.staging.yml config
#   [Look for error line]
#   Edit docker-compose.staging.yml at that line
#   Save and retry

Status: [ ] PASS  [ ] FAIL
```

### Pre-Check 3: Services List

```bash
# Verify compose file defines all required services
docker-compose -f docker-compose.staging.yml config | grep "  [a-z]*:" | head -10

# Expected output (should see these services):
#   app
#   mongo
#   redis
#   nginx
#   [others as configured]

# If less than 4 services:
# ACTION: Review docker-compose.staging.yml
#   Ensure all services are defined
#   Ask DevOps lead or refer to template

Status: [ ] PASS  [ ] FAIL
```

### Pre-Check 4: Network Connectivity

```bash
# Verify network connectivity (quick ping test)
ping -c 1 8.8.8.8 2>/dev/null && echo "Network OK" || echo "Network ISSUE"

# Expected: "Network OK"

# If fails:
# NOTE: This usually means network is fine but firewall blocks pings
# ACTION: Skip this check if your organization blocks pings
#         Network connectivity tests will run during deployment
#         If network is actually down, you'll know quickly

Status: [ ] PASS  [ ] FAIL
```

### Pre-Check 5: Team Ready

```bash
# Verify all team members are online in Slack
# Post to #white-caves-deploy:

"👀 Final verification in progress. 
Team check: React with ✅ to confirm you're here and ready."

# Wait for 4 reactions (all team leads except yourself)
# Expected: All 5 leads show ✅

# If someone missing:
# ACTION: Ping them directly
#   @[name] Are you available for 9 AM kickoff?
#
# If someone unavailable:
# ACTION: Adjust plan
#   Can they join late?
#   Do we delay kickoff?
#   Does someone cover their role?

Status: [ ] PASS  [ ] FAIL
```

---

## 📋 VERIFICATION SUMMARY FORM

**Fill this out and save when complete:**

```
MONDAY MORNING FINAL VERIFICATION
Date: March 17, 2026
Time Completed: __________
Verified By: DevOps Lead ___________

QUICK CHECKS (REQUIRED - must all pass):
  1. Docker running:           [ ] PASS  [ ] FAIL
  2. Git clean:                [ ] PASS  [ ] FAIL
  3. Config files exist:       [ ] PASS  [ ] FAIL
  4. Docker image built:       [ ] PASS  [ ] FAIL
  5. Disk space available:     [ ] PASS  [ ] FAIL

FINAL CHECKS (Required if Quick Checks pass):
  6. Environment vars valid:   [ ] PASS  [ ] FAIL
  7. Compose file valid:       [ ] PASS  [ ] FAIL
  8. Services defined:         [ ] PASS  [ ] FAIL
  9. Network connectivity:     [ ] PASS  [ ] FAIL
  10. Team members present:    [ ] PASS  [ ] FAIL

OVERALL RESULT:
  [ ] ALL GREEN - Ready for 9 AM kickoff
  [ ] SOME FAILURES - Escalate immediately (see below)

Issues Found:
  1. ______________________________
  2. ______________________________
  3. ______________________________

Actions Taken:
  1. ______________________________
  2. ______________________________
  3. ______________________________

Approval to Proceed:
  [ ] YES - Ready for 9 AM kickoff
  [ ] CONDITIONAL - Ready with caveat: ________
  [ ] NO - Delay needed - reschedule to: ________

Sign-off: ________________________  Time: __________
```

---

## ⚠️ IF VERIFICATION FINDS ISSUES

### Severity 1: Critical - STOP, Don't Proceed

**These block deployment:**
- Docker won't start
- Git repository corrupted
- Disk space critically low (< 10GB)
- Network unreachable
- Configuration files missing/invalid

**Action if Critical Issue Found**:
```
1. STOP - Do not proceed to 9 AM kickoff
2. DOCUMENT - Write exactly what's wrong
3. ESCALATE - Immediate call to SRE lead
4. DECISION - Delay deployment or troubleshoot?

Script to send:
"⛔ CRITICAL ISSUE FOUND

Issue: [describe problem]
Found: 8:15 AM during verification
Action: [what you're doing]
Timeline Impact: [15 min delay? reschedule?]

Waiting for approval to proceed/delay."

Expected response within 5 minutes
If no response within 5 min → call them
```

### Severity 2: Important - Can Fix, Minor Delay

**These cause delay but are fixable:**
- Docker image needs rebuild (5-10 min)
- Config file missing variable (2-3 min)
- Team member not online (waiting for response)

**Action if Important Issue Found**:
```
1. ASSESS - How long to fix?
2. FIX - Take the time to fix it properly
3. RETEST - Verify your fix worked
4. COMMUNICATE - Update team on delay

Script to send:
"ℹ️ MINOR DELAY - Fixing pre-deployment issues

Issue: [describe]
Fix ETA: [e.g., 20 min]
New kickoff time: [e.g., 9:30 AM]

Will confirm when clear."

Proceed once fixed
```

### Severity 3: Minor - Document, Stay on Schedule

**These are FYI items:**
- Unusual log messages (not errors)
- Slower than expected startup
- Non-critical service not responding

**Action if Minor Issue Found**:
```
1. NOTE - Document what you saw
2. MONITOR - Watch during deployment for same issue
3. REPORT - Include in Day 1 standup

No need to escalate or delay
Just be aware during deployment
```

---

## 🎯 DECISION TREE

```
Run Quick Verification (5 checks)
    |
    ├─── ALL PASS ───────────────────────────────┐
    |                                            |
    |                                   Run Final Checks
    |                                      |
    |                          ┌───────────┴────────────┐
    |                          |                        |
    |                          ALL PASS     SOME FAILURES
    |                          |            |
    |                          v            v
    |                      ✅ READY   ⚠️  ASSESS SEVERITY
    |                      9 AM OK         |
    |                                      ├─ Critical: STOP
    |                                      |  Escalate
    |                                      |
    |                        ┌─────────────┘
    |                        |
    └────────────┬───────────┤
                 |           |
        ANY FAILURE    Any Failures
            |
            v
    ⚠️ ASSESS SEVERITY
         |
         ├─ Critical: STOP, Escalate
         ├─ Important: Fix (delay kickoff 15-30 min)
         └─ Minor: Document, continue
```

---

## 📞 ESCALATION CONTACTS

**If you find an issue you can't fix:**

```
Severity/Issue              Contact           How         When
─────────────────────────────────────────────────────────────
Docker won't start          SRE Lead          Call        Immediately
Network down               SRE Lead          Call        Immediately
Disk critical              SRE Lead          Call        Immediately
Config file missing         Dev Lead          Slack 1st   Within 5 min
Compose file broken         Dev Lead          Slack 1st   Within 10 min
Image needs rebuild         DevOps Lead       Start fix   Immediately
Team member missing         Product Lead      Slack       Within 10 min
Database unreachable        SRE Lead          Slack       Immediately
```

---

## ✅ SUCCESS STATE

**When verification is complete and passing:**

```
All 10 checks: ✅
All issues resolved: ✅
Team ready: ✅
Configuration validated: ✅
Infrastructure verified: ✅

Status: READY FOR 9:00 AM KICKOFF

Next step: Proceed to kickoff meeting with confidence
```

---

## 📋 8:50 AM CHECKPOINT

**15 minutes before kickoff - final mental checklist:**

```
8:50 AM - Team arrives

[ ] DevOps Lead: Verification complete, all clear?
[ ] SRE Lead: Monitoring dashboards ready?
[ ] QA Lead: Test cases prepared?
[ ] Dev Lead: Quick fix procedures ready?
[ ] Product Lead: Stakeholder messages prepared?

All yes? → Proceed 9:00 AM kickoff
Any no? → Quick huddle at 8:55 AM, resolve it
```

---

## 🚀 FINAL MESSAGE

**Send this to team at 8:45 AM**:

```
Good morning team. Final verification complete. All systems 
are go.

Kickoff meeting starts at 9:00 AM. Find your seat. Have your 
materials. We're about to deploy staging.

This is the result of months of preparation. We've done the 
work. The infrastructure is ready. The team is prepared.

Let's execute flawlessly.

See you in 15 minutes. 🚀
```

---

## 🎯 ONE MORE THING

**If everything checks out - and it should:**

```
You've prepared thoroughly
You've verified carefully
You've aligned your team
You've documented everything

Now you're going to execute a professional, well-planned 
staging deployment.

The next 4 hours will prove that all the preparation paid off.

Go show your team what professional execution looks like.

You've got this. 💪
```

