# Week 2 Implementation - Startup Guide
**Date Created:** January 17, 2026  
**Testing Period:** January 20-24, 2026  
**Status:** 🟡 AWAITING CREDENTIALS VERIFICATION

---

## 🔴 CRITICAL STEP: Database Authentication

### Issue Found
The MongoDB Atlas credentials in `.env` are showing authentication failure:
```
Username: arslanmalikgoraha_db_user
Cluster: whitecavesdb.opetsag.mongodb.net
Database: whitecaves
Current Password: DubaiFuture143$ ❌ AUTHENTICATION FAILED
```

### Action Required - Choose One:

#### Option A: Verify Correct Password (RECOMMENDED)
1. Log into MongoDB Atlas: https://account.mongodb.com/account/login
2. Navigate to: **Database Access** → Find user `arslanmalikgoraha_db_user`
3. Click **Edit** → **Show Password** (or Reset if forgotten)
4. Copy the correct password
5. Update `.env` file:
   ```env
   DB_PASSWORD="[YOUR_CORRECT_PASSWORD]"
   ```
6. Run verification:
   ```bash
   node scripts/db-connection-check.js
   ```

#### Option B: Use Local MongoDB for Testing
If MongoDB Atlas credentials are unavailable, use local MongoDB:

1. **Install MongoDB Community Edition** (if not installed):
   - Windows: https://www.mongodb.com/try/download/community
   - Or via Chocolatey: `choco install mongodb-community`

2. **Start MongoDB service:**
   ```bash
   # Windows Service
   net start MongoDB
   
   # Or if running standalone
   mongod --dbpath "C:\data\db"
   ```

3. **Seed test database:**
   ```bash
   node scripts/seedDatabase.js --local
   ```

4. **Verify local connection:**
   ```bash
   node scripts/db-connection-check.js
   ```
   Expected: ✅ Connection Method: local development

---

## ✅ Pre-Test Checklist

After resolving database credentials, complete these steps:

### 1. Verify Database Connection
```bash
node scripts/db-connection-check.js
```
**Expected Output:**
```
✅ MongoDB connection successful
✅ Collections available: owners, inventoryproperties, leads, whatsappcontacts, contracts
✅ CRUD Operations: PASS
Connection Status: ✅ PASS
```

### 2. Create Pre-Test Backup
```bash
node scripts/backup-staging-db.js
```
**Creates:** Snapshot of database before testing  
**Saved:** `logs/db-backup-[timestamp].json`  
**Purpose:** Rollback capability if tests corrupt data

### 3. Install Test Dependencies
```bash
npm install
npm install -D vitest @vitest/ui c8 k6
```

### 4. Verify Build
```bash
npm run build
```
**Expected:** Build completes in <10 seconds

---

## 📅 Week 2 Test Schedule

### **Monday, January 20 (ConversationAnalyzer)**
- **Tests:** 215 unit tests
- **Target Coverage:** 95%
- **Duration:** ~5 minutes
- **Run Command:**
  ```bash
  npm run test -- src/services/__tests__/ConversationAnalyzer.test.js --coverage
  ```
- **Log File:** `logs/monday-january-20-2026.log`

### **Tuesday, January 21 (WhatsAppWebIntegration)**
- **Tests:** 180 unit tests
- **Target Coverage:** 90%
- **Focus:** QR codes (45s expiry), concurrent verification, retry logic
- **Duration:** ~5 minutes
- **Run Command:**
  ```bash
  npm run test -- src/services/__tests__/WhatsAppWebIntegration.test.js --coverage
  ```
- **Log File:** `logs/tuesday-january-21-2026.log`

### **Wednesday, January 22 (Components + Integration)**

#### Part A: Quick Add Property Form
- **Tests:** 46 component tests
- **Target Coverage:** 95%
- **Focus:** Form validation, accessibility (ARIA), keyboard navigation
- **Run Command:**
  ```bash
  npm run test -- src/components/sourcing/__tests__/QuickAddPropertyForm.test.js --coverage
  ```

#### Part B: Phase 2A Integration
- **Tests:** 23 integration tests
- **Target Coverage:** 90%
- **Focus:** End-to-end workflows, statistics, error handling
- **Run Command:**
  ```bash
  npm run test -- src/__tests__/Phase2A.integration.test.js --coverage
  ```
- **Combined Log File:** `logs/wednesday-january-22-2026.log`

### **Thursday, January 23 (PropertySourcingService + Real Database)**
- **Tests:** 50 unit tests
- **Target Coverage:** 92%
- **Focus:** 5-stage verification workflow, opportunity creation, property conversion
- **Database:** Real MongoDB (with backup/restore)
- **Duration:** ~8 minutes
- **Run Command:**
  ```bash
  npm run test -- src/services/__tests__/PropertySourcingService.test.js --coverage
  ```
- **Log File:** `logs/thursday-january-23-2026.log`

### **Friday, January 24 (Load Testing + Final Coverage)**

#### Part A: Load Testing (k6)
- **Concurrent Users:** 100 → 250 → 500
- **Duration:** 16 minutes total
- **Target Metrics:**
  - p95 latency: <500ms
  - Error rate: <1%
  - Throughput: >100 req/s
- **Run Command:**
  ```bash
  k6 run scripts/load-testing-k6.js
  ```

#### Part B: Final Coverage Report
- **Command:**
  ```bash
  npm run coverage:c8
  ```
- **Target:** 90%+ coverage across all modules
- **Output:** `coverage/friday-final-report.html`

#### Part C: Week 2 Sign-Off
- **Create:** `logs/WEEK_2_SIGN_OFF.txt`
- **Content:** Summary of all 5 days' results, sign-off confirmation

---

## 🛠️ Available Automation Scripts

### db-connection-check.js
**Purpose:** Verify database connectivity and functionality  
**Usage:** `node scripts/db-connection-check.js`  
**Tries in order:**
1. MONGODB_URI (from environment)
2. MONGODB_ATLAS_URI (from environment)
3. MONGODB_LOCAL (from environment)
4. localhost:27017 (hardcoded fallback)

**Output:** Connection statistics, CRUD test results, available collections

### backup-staging-db.js
**Purpose:** Create database snapshot before testing  
**Usage:** `node scripts/backup-staging-db.js`  
**Creates:** Timestamped backup in `logs/` directory  
**Use When:** Before Monday morning tests, after database changes

### restore-staging-db.js
**Purpose:** Restore database from backup  
**Usage:** `node scripts/restore-staging-db.js --backup [timestamp]`  
**Example:** `node scripts/restore-staging-db.js --backup 1705513600000`  
**Use When:** Tests corrupt data, need to restart fresh

### week-2-test-runner.js
**Purpose:** Orchestrate all 5 days of testing  
**Usage:** 
- Full week: `node scripts/week-2-test-runner.js`
- Single day: `node scripts/week-2-test-runner.js --day monday`
- Modes: `--mode fast`, `--mode verbose`, `--skip-db-check`

---

## 🔧 Environment Configuration Files

### .env (Development)
- Contains: Firebase credentials, Stripe keys, WhatsApp config
- **DB_PASSWORD:** DubaiFuture143$ (currently failing - needs verification)
- **MONGODB_URI:** Can override connection string here

### .env.staging (Testing)
- Contains: Test-specific environment variables
- **MONGODB_URI:** Updated to point to whitecavesdb cluster
- **NODE_ENV:** test
- **VITE_MODE:** staging

### .env.example
- Template file for all required environment variables
- Reference: Copy from this file if variables are missing

---

## 📊 Expected Results Summary

### Test Counts (Total: 514+)
- ConversationAnalyzer: 215 tests
- WhatsAppWebIntegration: 180 tests
- PropertySourcingService: 50 tests
- QuickAddPropertyForm: 46 tests
- Phase2A.integration: 23 tests
- **Total:** 514 tests

### Coverage Targets
- Monday: 95%
- Tuesday: 90%
- Wednesday: 92% (combined)
- Thursday: 92% (with real DB)
- Friday: 90%+ overall

### Performance Targets
- Load test: 500 concurrent users
- p95 latency: <500ms
- Error rate: <1%
- Build time: <10 seconds

---

## ⚠️ Troubleshooting

### Problem: "Authentication Failed" on MongoDB
**Solution:**
1. Verify password in MongoDB Atlas (Option A above)
2. Check if user `arslanmalikgoraha_db_user` still exists
3. Try resetting the password in MongoDB Atlas
4. Check IP whitelist includes current machine IP

### Problem: "Cannot find module 'vitest'"
**Solution:**
```bash
npm install -D vitest @vitest/ui c8
```

### Problem: Local MongoDB won't connect
**Solution:**
1. Verify MongoDB service is running: `net start MongoDB`
2. Check default port: `mongosh localhost:27017`
3. Use MongoDB Compass to verify connectivity

### Problem: "Tests hanging" or "Timeout"
**Solution:**
1. Increase timeout: `npm run test -- --inspect-brk`
2. Check database connection: `node scripts/db-connection-check.js`
3. Verify backup isn't locked: `ls -la logs/db-backup-*.json`

---

## 🎯 Success Criteria

All items must be checked before final sign-off:

- [ ] Database connection verified (✅ PASS)
- [ ] Pre-test backup created
- [ ] Monday tests: 215/215 passing (95%+ coverage)
- [ ] Tuesday tests: 180/180 passing (90%+ coverage)
- [ ] Wednesday tests: 69/69 passing (92%+ coverage)
- [ ] Thursday tests: 50/50 passing with real database
- [ ] Friday load test: 500 concurrent users @ <500ms p95
- [ ] Friday coverage: 90%+ overall
- [ ] All logs archived in `logs/week-2-archive/`
- [ ] WEEK_2_SIGN_OFF.txt created and signed

---

## 📞 Quick Reference Commands

```bash
# Verify everything is ready
node scripts/db-connection-check.js

# Create backup before testing
node scripts/backup-staging-db.js

# Run all Monday tests
npm run test -- src/services/__tests__/ConversationAnalyzer.test.js --coverage

# Run all tests for the week
npm run test

# Generate coverage report
npm run coverage:c8

# Load testing (after installing k6)
k6 run scripts/load-testing-k6.js

# Restore from backup if needed
node scripts/restore-staging-db.js --backup [timestamp]
```

---

## 📝 Notes for Team

1. **Database credentials issue:** Current `.env` password not authenticating. Requires verification or use of local MongoDB.
2. **No data should be modified in production:** Always use backup/restore for safety.
3. **Load testing requires k6:** Install with `npm install -D k6` before Friday.
4. **Keep logs for audit:** All execution logs stored in `logs/` for review.
5. **Week 2 focused on coverage:** All tests pre-written, just need execution verification.

---

**Document Status:** DRAFT - AWAITING DATABASE CREDENTIALS  
**Last Updated:** January 17, 2026, 5:30 PM  
**Next Action:** Verify/update DB_PASSWORD in `.env` file
