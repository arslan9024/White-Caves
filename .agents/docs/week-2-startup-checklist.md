# Week 2 Test Execution - Startup Checklist

## ✅ Phase 1: Infrastructure Setup (COMPLETE)

### Database & Script Setup
- [x] Created `scripts/db-connection-check.js` - Validates MongoDB connection & CRUD operations
- [x] Created `scripts/backup-staging-db.js` - Creates snapshots of staging DB before tests
- [x] Created `scripts/restore-staging-db.js` - Rolls back DB from backup if needed
- [x] Created `.env.staging` - Environment variables for test execution
- [x] Created `scripts/week-2-test-runner.js` - Coordinates all test phases

### Directories
- [x] Created `logs/` directory - For storing daily execution logs

---

## 📋 Next Steps (Execute Before Monday Jan 20)

### CRITICAL: Configure MongoDB Connection
**File:** `.env.staging` (line 3)

```bash
# Current:
MONGODB_URI=mongodb+srv://admin:your_password@white-caves-staging.mongodb.net/white_caves_staging

# TODO: Replace with actual staging connection string
MONGODB_URI=mongodb+srv://[USERNAME]:[PASSWORD]@[CLUSTER].mongodb.net/white_caves_staging?retryWrites=true&w=majority
```

**How to get it:**
1. Go to MongoDB Atlas console
2. Find "white-caves-staging" cluster
3. Click "Connect"
4. Select "Connect your application"
5. Copy connection string
6. Replace `[USERNAME]`, `[PASSWORD]`, and `[CLUSTER]` in `.env.staging`

### Verify Setup
```bash
# Test 1: Verify DB connection
node scripts/db-connection-check.js
# Expected: ✅ MongoDB connection successful

# Test 2: Create backup
node scripts/backup-staging-db.js
# Expected: ✅ Backup created at timestamp

# Test 3: Seed test data
npm run seed:small
# Expected: Output showing counts created

# Test 4: Run sanity check
npm run test:run -- src/__tests__/Phase2A.integration.test.js
# Expected: ✓ Phase2A.integration (23 tests)
```

---

## 📅 Week 2 Test Execution Schedule

### Monday (Jan 20, 2026) - 9:00 AM
**Test Suite:** ConversationAnalyzer (215 tests)
**Target:** 215/215 passing, 95%+ coverage
**Command:**
```bash
npm run test:run -- src/services/__tests__/ConversationAnalyzer.test.js --coverage
```
**Duration:** ~5 minutes
**Log:** `logs/monday-execution-log.txt`

### Tuesday (Jan 21, 2026) - 9:00 AM
**Test Suite:** WhatsAppWebIntegration (180 tests)
**Target:** 180/180 passing, 90%+ coverage
**Focus:** QR code expiration, concurrent verifications, timeout handling, caching
**Command:**
```bash
npm run test:run -- src/services/__tests__/WhatsAppWebIntegration.test.js --coverage
```
**Duration:** ~5 minutes
**Log:** `logs/tuesday-execution-log.txt`

### Wednesday (Jan 22, 2026) - 9:00 AM
**Test Suite A:** QuickAddPropertyForm (46 tests)
```bash
npm run test:run -- src/components/sourcing/__tests__/QuickAddPropertyForm.test.js --coverage
```

**Test Suite B:** Phase2A Integration (23 tests)
```bash
npm run test:run -- src/__tests__/Phase2A.integration.test.js --coverage
```

**Combined Target:** 69/69 passing, 92%+ coverage
**Focus:** Form validation, accessibility, responsive design, verification workflows
**Duration:** ~10 minutes total
**Logs:** `logs/wednesday-component-results.txt`

### Thursday (Jan 23, 2026) - 9:00 AM
**Test Suite:** PropertySourcingService (50 tests) - Real MongoDB
**Target:** 50/50 passing, 92%+ coverage
**Database:** Real staging cluster (isolated test data)
**Focus:** Database integration, 5-stage verification workflow, property conversion
**Command:**
```bash
npm run test:run -- src/services/__tests__/PropertySourcingService.test.js --coverage
```
**Duration:** ~8 minutes
**Log:** `logs/thursday-database-results.txt`

### Friday (Jan 24, 2026) - 9:00 AM
**Task A: Load Testing** (100-500 concurrent users)
```bash
npm install -D k6
k6 run scripts/load-testing-k6.js
```
**Targets:**
- p95 latency <500ms ✓
- Error rate <1% ✓
- Peak users: 500 ✓
**Duration:** ~16 minutes

**Task B: Final Coverage Report**
```bash
npm run coverage:c8
```
**Target:** 90%+ all metrics
**Output:** `coverage/friday-final/` folder

**Task C: Week 2 Sign-Off**
Document all results in `logs/WEEK_2_SIGN_OFF.txt`

---

## 🎯 Weekly Success Criteria

| Metric | Target | Critical? |
|--------|--------|-----------|
| All Tests Passing | 875+/875+ (100%) | ✅ Yes |
| Code Coverage | 90%+ overall | ✅ Yes |
| ConversationAnalyzer | 215/215 (95%+) | ✅ Yes |
| WhatsAppWebIntegration | 180/180 (90%+) | ✅ Yes |
| PropertySourcingService | 50/50 (92%+) | ✅ Yes |
| QuickAddPropertyForm | 46/46 (95%+) | ✅ Yes |
| Phase2A Integration | 23/23 (90%+) | ✅ Yes |
| Load Test p95 Latency | <500ms | ✅ Yes |
| Load Test Error Rate | <1% | ✅ Yes |
| DB Isolation | Verified | ✅ Yes |
| Backup/Restore | Functional | ⚠️ Important |

---

## 🔧 Troubleshooting Guide

### If Connection Check Fails
```bash
# 1. Verify .env.staging has correct MONGODB_URI
cat .env.staging | grep MONGODB_URI

# 2. Test connection manually
mongosh [your-connection-string]

# 3. Check firewall/network access to MongoDB Atlas
# (Ensure your IP is whitelisted in Atlas)
```

### If Tests Fail
```bash
# 1. Run individual test with verbose output
npm run test:run -- [test-file] -- --reporter=verbose

# 2. Check for database errors
node scripts/db-connection-check.js

# 3. Try restoring from backup
node scripts/restore-staging-db.js --backup [timestamp]

# 4. Re-seed test data
npm run seed:small
```

### If Coverage is Below Target
```bash
# 1. Generate detailed coverage report
npm run test:coverage

# 2. Open HTML report
open coverage/index.html

# 3. Look for red (uncovered) lines
# 4. Add additional test cases to cover gaps
# 5. Re-run tests with coverage flag
```

---

## 📊 Results Documentation

### Daily Logs Created
```
logs/
├── monday-execution-log.txt          (ConversationAnalyzer results)
├── tuesday-execution-log.txt         (WhatsAppWebIntegration results)
├── wednesday-component-results.txt   (QuickAddPropertyForm + Phase2A)
├── thursday-database-results.txt     (PropertySourcingService + DB validation)
├── friday-coverage-gaps.txt          (Coverage analysis)
├── friday-load-test-summary.json     (Load test metrics)
└── WEEK_2_SIGN_OFF.txt              (Final sign-off report)
```

### Coverage Reports
```
coverage/
├── coverage/index.html              (Interactive HTML report)
├── coverage/lcov.info               (LCOV format)
├── coverage-final.json              (Machine-readable)
└── text.txt                         (Plain text summary)
```

---

## ✅ Pre-Execution Checklist (Do on Monday Morning)

- [ ] Confirm MONGODB_URI is set correctly in `.env.staging`
- [ ] Run `node scripts/db-connection-check.js` and confirm ✅ success
- [ ] Run `node scripts/backup-staging-db.js` and confirm backup created
- [ ] Run `npm run seed:small` and confirm test data seeded
- [ ] Run `npm run test:run -- src/__tests__/Phase2A.integration.test.js` and confirm all 23 tests pass
- [ ] Open terminal for Monday test execution
- [ ] Have backup restore command ready: `node scripts/restore-staging-db.js --backup [timestamp]`
- [ ] Monitor system resources during load test (RAM, CPU, network)

---

## 🎯 Expected Outcomes

**By End of Week 2 (Friday Jan 24):**
- ✅ 875+ tests executed and passing
- ✅ 90%+ code coverage across all modules
- ✅ Real database integration validated
- ✅ 5-stage verification workflow confirmed working
- ✅ Load testing: 500 concurrent users handled successfully
- ✅ API response times within SLA (p95 <500ms)
- ✅ Zero data corruption detected
- ✅ All documentation completed
- ✅ Week 3 optimization plan prepared

---

## 📝 Notes for Week 3

If any gaps found during Week 2:
1. Document in `logs/friday-coverage-gaps.txt`
2. Add to Week 3 optimization list
3. Plan additional tests for failing areas
4. Schedule optimization tasks (caching, indexing, etc.)

---

**Status:** ✅ READY FOR MONDAY EXECUTION
**Date Created:** January 17, 2026
**Last Updated:** January 17, 2026
