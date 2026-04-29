#!/bin/bash

# White Caves Week 2 Test Execution - Quick Reference
# Use this file for copy-paste commands during the week

# ════════════════════════════════════════════════════════════════════════════
# BEFORE STARTING (Friday Jan 17 - Setup Complete ✓)
# ════════════════════════════════════════════════════════════════════════════

# 1. VERIFY MONGODB CONNECTION
node scripts/db-connection-check.js

# 2. CREATE BACKUP
node scripts/backup-staging-db.js

# 3. SEED TEST DATA
npm run seed:small

# 4. RUN SANITY CHECK (Phase2A Integration)
npm run test:run -- src/__tests__/Phase2A.integration.test.js

# ════════════════════════════════════════════════════════════════════════════
# MONDAY (Jan 20) - ConversationAnalyzer Tests
# ════════════════════════════════════════════════════════════════════════════
# Suite: ConversationAnalyzer
# Tests: 215
# Target: 95%+ coverage
# Duration: ~5 minutes

npm run test:run -- src/services/__tests__/ConversationAnalyzer.test.js --coverage

# If tests fail, run with verbose output:
npm run test:run -- src/services/__tests__/ConversationAnalyzer.test.js -- --reporter=verbose

# Save results:
# Check: logs/monday-execution-log.txt

# ════════════════════════════════════════════════════════════════════════════
# TUESDAY (Jan 21) - WhatsAppWebIntegration Tests
# ════════════════════════════════════════════════════════════════════════════
# Suite: WhatsAppWebIntegration
# Tests: 180
# Target: 90%+ coverage
# Focus: QR codes, concurrent operations, timeouts, caching
# Duration: ~5 minutes

npm run test:run -- src/services/__tests__/WhatsAppWebIntegration.test.js --coverage

# Check for edge cases in output:
# - QR code expiration (45 seconds)
# - Concurrent verification attempts
# - Connection retry logic
# - Cache invalidation

# If tests fail:
npm run test:run -- src/services/__tests__/WhatsAppWebIntegration.test.js -- --reporter=verbose

# Save results:
# Check: logs/tuesday-execution-log.txt

# ════════════════════════════════════════════════════════════════════════════
# WEDNESDAY (Jan 22) - Component & Integration Tests
# ════════════════════════════════════════════════════════════════════════════

# Test A: QuickAddPropertyForm (46 tests, 95% target, ~3-5 min)
npm run test:run -- src/components/sourcing/__tests__/QuickAddPropertyForm.test.js --coverage

# Test B: Phase2A Integration (23 tests, 90% target, ~5-10 min)
npm run test:run -- src/__tests__/Phase2A.integration.test.js --coverage

# Verify workflow progression:
# Stage 1: initial_detection
# Stage 2: waiting_for_photos
# Stage 3: partially_verified
# Stage 4: fully_verified
# Stage 5: listed (after property conversion)

# Combined success criteria:
# ✓ 46/46 QuickAddPropertyForm passing
# ✓ 23/23 Phase2A integration passing
# ✓ 92%+ combined coverage
# ✓ All workflow transitions validated

# Save results:
# Check: logs/wednesday-component-results.txt

# ════════════════════════════════════════════════════════════════════════════
# THURSDAY (Jan 23) - Database Integration Tests (Real MongoDB)
# ════════════════════════════════════════════════════════════════════════════
# Suite: PropertySourcingService
# Tests: 50
# Target: 92%+ coverage
# Database: Real staging cluster (isolated)
# Duration: ~8 minutes

npm run test:run -- src/services/__tests__/PropertySourcingService.test.js --coverage

# This test validates:
# ✓ Real MongoDB connection
# ✓ Opportunity creation with persistence
# ✓ 5-stage verification workflow
# ✓ Property conversion from opportunity
# ✓ Statistics aggregation queries
# ✓ Daily automation cycles
# ✓ Data integrity (no corruption)

# If database tests fail:
node scripts/db-connection-check.js  # Verify connection

# Restore from backup if needed:
# First, find backup timestamp:
cat backups/backups.json

# Then restore:
node scripts/restore-staging-db.js --backup [timestamp]

# Re-seed test data:
npm run seed:small

# Retry tests:
npm run test:run -- src/services/__tests__/PropertySourcingService.test.js --coverage

# Save results:
# Check: logs/thursday-database-results.txt

# ════════════════════════════════════════════════════════════════════════════
# FRIDAY (Jan 24) - Load Testing & Final Coverage
# ════════════════════════════════════════════════════════════════════════════

# Task A: GENERATE FINAL COVERAGE REPORT
npm run coverage:c8

# This will create:
# - coverage/index.html (interactive report)
# - coverage/lcov.info (LCOV format)
# - coverage-final.json (machine-readable)
# - text.txt (summary)

# Open HTML report to identify gaps:
open coverage/index.html  # macOS
# or
start coverage/index.html  # Windows
# or
firefox coverage/index.html  # Linux

# Task B: LOAD TESTING (if k6 not yet installed)
npm install -D k6

# Then run load test:
k6 run scripts/load-testing-k6.js

# Expected metrics:
# ✓ Peak concurrent users: 500
# ✓ Total requests: 15,000+
# ✓ p95 latency: <500ms
# ✓ Error rate: <1%
# ✓ Throughput: 200+ req/sec

# Task C: FINAL SIGN-OFF
# Create week-2-sign-off.txt with:
# - All test results
# - Coverage metrics
# - Load test results
# - Any blockers/gaps found
# - Week 3 priorities

# Save results:
# Check: logs/friday-coverage-gaps.txt
# Check: logs/load-test-summary.json
# Create: logs/WEEK_2_SIGN_OFF.txt

# ════════════════════════════════════════════════════════════════════════════
# EMERGENCY PROCEDURES
# ════════════════════════════════════════════════════════════════════════════

# If tests are failing and you need to diagnose:
npm test -- --listTests | grep -E "(test|integration)"

# To run all tests at once and check overall health:
npm test -- --run --coverage

# To clear test cache if you get weird failures:
npm test -- --clearCache

# To check code for syntax errors:
npm run validate

# To verify deployment readiness:
npm run verify-deploy

# ════════════════════════════════════════════════════════════════════════════
# EXPECTED RESULTS SUMMARY
# ════════════════════════════════════════════════════════════════════════════
# 
# By End of Week 2 (Friday):
# ✅ 875+ unit/integration tests PASSING
# ✅ 90%+ code coverage achieved
# ✅ Real database integration validated
# ✅ 5-stage workflow all transitions working
# ✅ Load test: 500 users @ <500ms p95
# ✅ Error rate <1% confirmed
# ✅ Zero data corruption
# ✅ Staging/production isolation verified
# ✅ Week 2 sign-off completed
#
# ════════════════════════════════════════════════════════════════════════════

# Documentation & Reports Location:
# logs/monday-execution-log.txt
# logs/tuesday-execution-log.txt
# logs/wednesday-component-results.txt
# logs/thursday-database-results.txt
# logs/friday-coverage-gaps.txt
# logs/load-test-summary.json
# logs/WEEK_2_SIGN_OFF.txt
# coverage/index.html (interactive coverage report)
