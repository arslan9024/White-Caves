# White Caves Real Estate Platform - Deployment Guide

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Database Migrations](#database-migrations)
4. [Staging Deployment](#staging-deployment)
5. [Production Deployment](#production-deployment)
6. [Zero-Downtime Deployment](#zero-downtime-deployment)
7. [Rollback Procedures](#rollback-procedures)
8. [Post-Deployment Verification](#post-deployment-verification)
9. [Monitoring & Alerts](#monitoring--alerts)
10. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing (unit, integration, e2e)
  ```bash
  npm run test
  npm run test:integration
  npm run test:e2e
  ```

- [ ] Build succeeds without errors
  ```bash
  npm run build:vercel
  ```

- [ ] No security vulnerabilities
  ```bash
  npm audit
  npm audit fix
  ```

- [ ] Code review approved by 2+ team members
- [ ] Documentation updated
- [ ] CHANGELOG.md updated with release notes

### Infrastructure
- [ ] Database backup created
  ```bash
  npm run db:backup
  ```
- [ ] Staging environment tested and verified
- [ ] Monitoring dashboards operational
- [ ] Alert thresholds configured
- [ ] Rollback plan documented

### Performance
- [ ] Build time < 15 seconds (currently: ~10s)
- [ ] Bundle size reasonable (currently: 2.8 MB)
- [ ] Web Vitals passing
  - FCP < 1.5s
  - LCP < 2.5s
  - CLS < 0.1

### Biometric & Security
- [ ] WebAuthn biometric tests passing (95%+ success)
- [ ] SSL/TLS certificates valid
- [ ] API keys rotated and secured
- [ ] Database encryption enabled
- [ ] CORS policies verified

---

## Environment Setup

### Required Environment Variables

Create `.env.production` with:

```env
# Application
NODE_ENV=production
VITE_API_URL=https://white-caves.vercel.app/api
VITE_APP_NAME=White Caves
VITE_APP_VERSION=1.0.0

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/white-caves?retryWrites=true&w=majority
MONGODB_DB_NAME=white-caves-production

# Firebase
FIREBASE_API_KEY=<production-key>
FIREBASE_AUTH_DOMAIN=white-caves.firebaseapp.com
FIREBASE_PROJECT_ID=white-caves-prod
FIREBASE_STORAGE_BUCKET=white-caves-prod.appspot.com
FIREBASE_MESSAGING_SENDER_ID=<sender-id>
FIREBASE_APP_ID=<app-id>

# Stripe
STRIPE_SECRET_KEY=sk_live_<production-key>
STRIPE_PUBLISHABLE_KEY=pk_live_<production-key>
STRIPE_WEBHOOK_SECRET=whsec_<secret>

# WhatsApp
WHATSAPP_BUSINESS_ACCOUNT_ID=<account-id>
WHATSAPP_ACCESS_TOKEN=<access-token>
WHATSAPP_WEBHOOK_VERIFY_TOKEN=<verify-token>

# Email Service
SENDGRID_API_KEY=<sendgrid-key>
SENDGRID_FROM_EMAIL=noreply@whitecaves.com

# Redis (for caching/sessions)
REDIS_URL=redis://<host>:<port>
REDIS_PASSWORD=<password>

# Vercel
VERCEL_TOKEN=<deployment-token>
```

### Verification
```bash
# Verify all required env vars are set
npm run verify:env:production
```

---

## Database Migrations

### Pre-Migration Backup

```bash
# Create timestamped backup
mongodump --uri "$MONGODB_URI" --out ./backups/backup-$(date +%Y%m%d-%H%M%S)

# Verify backup
ls -lh ./backups/
```

### Running Migrations

```bash
# List pending migrations
npm run db:migrate:status

# Run pending migrations
npm run db:migrate:up

# Verify migration results
npm run db:migrate:verify
```

### Migration Scripts Location
- Location: `scripts/migrations/`
- Naming convention: `YYYYMMDD-HHmmss-description.js`

Example migration structure:
```javascript
// scripts/migrations/20250122-100000-add-biometric-stats.js
module.exports = {
  up: async (db) => {
    // Create collection for biometric stats
    await db.createCollection('BiometricStats', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['userId', 'timestamp', 'method'],
          properties: {
            userId: { bsonType: 'string' },
            timestamp: { bsonType: 'date' },
            method: { enum: ['face', 'fingerprint'] }
          }
        }
      }
    });
    
    // Create indexes
    await db.collection('BiometricStats').createIndex({ userId: 1, timestamp: -1 });
  },
  
  down: async (db) => {
    await db.dropCollection('BiometricStats');
  }
};
```

---

## Staging Deployment

### Deploy to Staging

```bash
# Pull latest code
git pull origin develop

# Install dependencies
npm ci

# Run full test suite
npm run test
npm run test:integration

# Build for staging
npm run build:staging

# Deploy to staging
vercel --prod --scope white-caves --target staging
```

### Staging Verification

```bash
# Run smoke tests against staging
npm run test:smoke -- --url https://staging.white-caves.vercel.app

# Check monitoring endpoints
curl https://staging.white-caves.vercel.app/api/aurora/monitoring/health

# Run biometric tests
npm run test:biometric -- --environment staging
```

### Performance Check

```bash
# Analyze bundle size
npm run analyze:bundle

# Check web vitals
npm run test:web-vitals -- https://staging.white-caves.vercel.app

# Run load tests
npm run test:load -- --url https://staging.white-caves.vercel.app
```

---

## Production Deployment

### Blue-Green Deployment Strategy

```bash
# 1. Build on staging environment
npm run build:vercel
git tag v$(cat package.json | grep version | head -1 | awk -F'"' '{print $4}')

# 2. Push to production (vercel handles blue-green)
git push origin main
git push origin --tags

# 3. Vercel automatically:
#    - Builds new version (green)
#    - Runs tests
#    - Deploys to staging URLs
#    - Runs smoke tests
#    - Promotes to production (after approval)
```

### Manual Production Deployment

```bash
# 1. Final checks
npm run test
npm run test:integration
npm run build:vercel

# 2. Create release tag
git tag -a v1.0.0 -m "Release version 1.0.0 - January 22, 2025"
git push origin v1.0.0

# 3. Deploy to production
npm run deploy:production

# 4. Monitor deployment
npm run monitor:deployment
```

### Deployment Timeline

| Phase | Duration | Actions |
|-------|----------|---------|
| Pre-flight | 5 min | Final tests, backups |
| Build | 10-15 min | Vercel builds & runs tests |
| Staging | 5 min | Smoke tests on staging |
| Canary | 15 min | 10% traffic → new version |
| Rollout | 30 min | Gradual traffic increase (25%, 50%, 100%) |
| Verification | 10 min | Health checks, monitoring |
| **Total** | **~75 min** | Zero-downtime achieved |

---

## Zero-Downtime Deployment

### Implementation

1. **Database Backwards Compatibility**
   ```javascript
   // Accept both old and new schema fields during migration period
   const processRequest = (data) => {
     // Support old field 'userPhoneNumber' and new field 'user.phone'
     const phone = data.user?.phone || data.userPhoneNumber;
     return { phone };
   };
   ```

2. **API Version Support**
   ```javascript
   // Maintain previous API versions during deployment
   app.use('/api/v1', require('./routes/v1'));
   app.use('/api/v2', require('./routes/v2')); // New version
   ```

3. **Feature Flags**
   ```javascript
   // Use feature flags for gradual rollout
   if (featureFlags.enableNewBiometricUI) {
     router.get('/biometric', newBiometricController);
   } else {
     router.get('/biometric', legacyBiometricController);
   }
   ```

4. **Health Check Endpoint**
   ```bash
   # Vercel monitors this before promoting traffic
   GET /api/aurora/monitoring/health
   
   Response: {
     "success": true,
     "overallStatus": "healthy",
     "services": { "healthy": 11, "total": 11 }
   }
   ```

---

## Rollback Procedures

### Immediate Rollback (< 5 minutes)

```bash
# 1. Identify issue
npm run logs:production | tail -100

# 2. Check monitoring dashboard
# Visit: https://white-caves.vercel.app/dashboard/aurora

# 3. Rollback previous deployment
vercel --prod rollback

# 4. Verify rollback
curl https://white-caves.vercel.app/api/aurora/monitoring/health

# 5. Alert team
npm run alert:slack -- "Production rollback executed. Issue: [description]"
```

### Database Rollback

```bash
# 1. Check current migration state
npm run db:migrate:status

# 2. Restore from backup if needed
mongorestore --uri "$MONGODB_URI" ./backups/backup-20250122-093000/

# 3. Verify data integrity
npm run db:verify:integrity

# 4. Update release notes
echo "Rolled back due to [issue]. Using backup from [timestamp]" >> ROLLBACK_LOG.md
```

### Partial Rollback (Feature-Specific)

```bash
# Disable problematic feature via feature flags
npm run update:feature-flags -- --disable newBiometricUI

# Restart application
vercel --prod --scope white-caves

# Monitor metrics
npm run monitor:metrics -- --metric biometricSuccess --threshold 95
```

---

## Post-Deployment Verification

### Health Checks

Run immediately after deployment:

```bash
#!/bin/bash

echo "=== Post-Deployment Verification ==="

# 1. Health endpoint
echo "Checking system health..."
curl -s https://white-caves.vercel.app/api/aurora/monitoring/health | jq '.'

# 2. Service health
echo "Checking all services..."
curl -s https://white-caves.vercel.app/api/aurora/monitoring/services | jq '.summary'

# 3. Database connectivity
echo "Checking database..."
curl -s https://white-caves.vercel.app/api/aurora/monitoring/mongodb | jq '.database.status'

# 4. Biometric authentication
echo "Testing biometric endpoint..."
curl -s https://white-caves.vercel.app/api/biometric/test | jq '.success'

# 5. Performance metrics
echo "Checking performance..."
curl -s https://white-caves.vercel.app/api/aurora/monitoring/apis | jq '.summary'

# 6. Error logs
echo "Checking error logs..."
npm run logs:production:errors | head -20

echo "=== Verification Complete ==="
```

### Automated Verification

```bash
# Run post-deployment test suite
npm run test:post-deployment

# Expected results:
# - ✓ All endpoints responding
# - ✓ Database connected
# - ✓ Authentication working
# - ✓ Biometric system operational
# - ✓ API latency < 500ms
# - ✓ Error rate < 0.5%
# - ✓ Uptime > 99.9%
```

---

## Monitoring & Alerts

### Critical Alerts (Page on-call immediately)

```javascript
const criticalAlerts = {
  systemDown: {
    condition: 'overallStatus === "unhealthy"',
    cooldown: '5 minutes',
    channels: ['PagerDuty', 'Slack #critical']
  },
  databaseDown: {
    condition: 'mongoDBStatus !== "connected"',
    cooldown: '1 minute',
    channels: ['PagerDuty', 'SMS']
  },
  highErrorRate: {
    condition: 'errorRate > 5%',
    cooldown: '2 minutes',
    channels: ['PagerDuty', 'Slack #alerts']
  },
  biometricAuthFailing: {
    condition: 'biometricSuccessRate < 70%',
    cooldown: '10 minutes',
    channels: ['Slack #warnings']
  }
};
```

### Warning Alerts (Notify team)

```javascript
const warningAlerts = {
  highLatency: {
    condition: 'apiLatencyP95 > 500ms',
    cooldown: '5 minutes',
    channels: ['Slack #warnings']
  },
  degradedService: {
    condition: 'anyServiceLatency > threshold',
    cooldown: '10 minutes',
    channels: ['Email', 'Slack']
  },
  budgetAlert: {
    condition: 'monthlySpend > 80% of budget',
    cooldown: 'Once daily',
    channels: ['Email #finance']
  }
};
```

### Configure Alerts

```bash
curl -X POST https://white-caves.vercel.app/api/aurora/monitoring/alert-config \
  -H "Content-Type: application/json" \
  -d '{
    "apiLatency": 500,
    "dbLatency": 100,
    "errorRate": 0.5,
    "uptime": 99.9,
    "concurrentUsers": 80
  }'
```

---

## Troubleshooting

### Common Issues

#### 1. Deployment Stuck at Build Stage

**Symptoms:**
```
vercel: Build taking > 20 minutes
npm ERR! code E503 (during install)
```

**Solution:**
```bash
# 1. Clear Vercel cache
vercel env pull --environment=production
rm -rf node_modules/
npm ci

# 2. Check for circular dependencies
npm run analyze:dependencies

# 3. Rebuild with debug logging
DEBUG=* npm run build:vercel

# 4. Contact Vercel support if persistent
```

#### 2. Database Connection Issues

**Symptoms:**
```
MongoError: connect ENOTFOUND cluster.mongodb.net
```

**Solution:**
```bash
# 1. Verify connection string
echo $MONGODB_URI | grep -E "^mongodb\+srv://"

# 2. Check IP whitelist in MongoDB Atlas
# Dashboard: Security → Network Access

# 3. Test connection directly
mongosh "$MONGODB_URI" --eval "db.adminCommand('ping')"

# 4. Check credentials
vercel env pull --environment=production
grep MONGODB_URI .env.production
```

#### 3. High Latency After Deployment

**Symptoms:**
```
API latency P95 > 500ms
Database latency P99 > 150ms
```

**Solution:**
```bash
# 1. Check resource usage
vercel env pull
cat /proc/cpuinfo | grep "processor" | wc -l

# 2. Analyze slow queries
npm run analyze:slow-queries

# 3. Check for memory leaks
node --inspect scripts/memory-check.js

# 4. Enable query caching
npm run cache:enable -- --service=mongodb

# 5. Scale if needed
vercel scale --memory 3008 --duration 300  # 5 min scale up
```

#### 4. Biometric Authentication Failing

**Symptoms:**
```
WebAuthn registration failing
Face detection not working
```

**Solution:**
```bash
# 1. Check WebAuthn support
npm run test:biometric -- --platform detection

# 2. Verify HTTPS (required for WebAuthn)
curl -I https://white-caves.vercel.app

# 3. Check browser compatibility
npm run test:biometric -- --browsers

# 4. Review biometric logs
npm run logs:production | grep -i biometric

# 5. Clear cached credentials (if user issue)
# Instruct user: Settings → Security → Remove saved biometric
```

#### 5. Feature Flags Not Working

**Symptoms:**
```
Old code still running after feature flag disabled
```

**Solution:**
```bash
# 1. Verify feature flag was updated
npm run check:feature-flags

# 2. Clear Vercel cache
vercel --prod --scope white-caves --environment production --clear-cache

# 3. Force deployment
git push --force origin main  # Only if necessary

# 4. Check feature flag implementation
grep -r "featureFlags.newBiometricUI" src/
```

### Logging & Debugging

```bash
# View production logs in real-time
npm run logs:production --follow

# Filter by service
npm run logs:production | grep "mongodb"

# Get error logs only
npm run logs:production:errors --last 1h

# Get specific date range
npm run logs:production --start 2025-01-22T08:00:00Z --end 2025-01-22T10:00:00Z

# Search for specific error
npm run logs:production | grep "WebAuthn"

# Export logs for analysis
npm run logs:export -- --format json --output logs-20250122.json
```

---

## Deployment Checklist Template

Use this checklist for each deployment:

```markdown
## Deployment: [Version] - [Date]

### Pre-Deployment
- [ ] All tests passing
- [ ] Build successful (< 15s)
- [ ] No security vulnerabilities
- [ ] Code review approved
- [ ] Database backup created
- [ ] Staging verified
- [ ] Monitoring operational

### Deployment
- [ ] Tag created: v[version]
- [ ] Push to main branch
- [ ] Vercel build initiated
- [ ] Smoke tests passed
- [ ] Staged deployment successful
- [ ] Canary deployment started (10% traffic)

### Post-Deployment
- [ ] Health checks passing
- [ ] All services operational
- [ ] API latency normal
- [ ] Error rate < 0.5%
- [ ] Biometric success rate > 95%
- [ ] Database queries responsive
- [ ] Monitoring alerts configured

### Sign-Off
- Deployed by: ________________
- Verified by: ________________
- Date/Time: ________________
- Issues: ________________

### Rollback (if needed)
- [ ] Rollback initiated
- [ ] Data integrity verified
- [ ] Services restored
- [ ] Root cause identified
- [ ] Post-mortem scheduled
```

---

## References

- [Vercel Deployment Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.mongodb.com/atlas/)
- [Firebase Production Checklist](https://firebase.google.com/docs/projects/best-practices)
- [WebAuthn Security Best Practices](https://www.w3.org/TR/webauthn-2/)

**Last Updated:** January 22, 2025
**Version:** 1.0.0
