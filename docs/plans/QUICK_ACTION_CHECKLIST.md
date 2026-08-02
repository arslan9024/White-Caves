# White Caves - Quick Action Checklist

**Priority Level:** 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low  
**Generated:** January 16, 2026

---

## THIS WEEK (Do Immediately)

### 1. 🔴 CRITICAL: Remove Debug Logging
**Time:** 1 hour  
**Impact:** Security + Performance
- [ ] Install Winston logger: `npm install winston`
- [ ] Create `server/lib/logger.js` with structured logging
- [ ] Replace all `console.log` in adapters and services
- [ ] Test: Verify logs appear in console but not sensitive data
- [ ] Deploy to Vercel

**Files to Update:**
- `src/adapters/BayutAdapter.js`
- `src/adapters/PropertyFinderAdapter.js`
- `src/adapters/DubizzleAdapter.js`
- `src/adapters/SkyloovAdapter.js`
- `src/services/LeadAggregationEngine.js`

**Command:**
```bash
grep -r "console\.log" src/ server/ | wc -l  # Count occurrences
```

---

### 2. 🔴 CRITICAL: Add Rate Limiting
**Time:** 2 hours  
**Impact:** Security (prevents brute force, DDoS)

**Endpoints to Protect:**
- [ ] POST /api/auth/login - Max 5 attempts per 15 min
- [ ] POST /api/deals/close - Max 50 per hour
- [ ] POST /api/commission/adjust - Max 100 per hour
- [ ] POST /api/whatsapp/send-message - Max 100 per hour

**Implementation:**
```javascript
// server/middleware/rateLimiter.js
import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts'
});

// Use in routes:
router.post('/auth/login', loginLimiter, authController.login);
```

**Dependencies Already Installed:** ✅ express-rate-limit (check package.json)

---

### 3. 🔴 CRITICAL: Input Validation
**Time:** 3 hours  
**Impact:** Security (prevents injection, XSS)

**High-Risk Endpoints:**
- [ ] POST /api/deals/close - Validate propertyId, amount, method
- [ ] POST /api/whatsapp/send-message - Sanitize message content
- [ ] POST /api/commission/adjust - Validate rate (0-20%)
- [ ] Any file upload endpoints - Validate file type/size

**Template:**
```javascript
// server/middleware/validateDealClosure.js
export const validateDealClosure = (req, res, next) => {
  const { propertyId, amount, verificationMethod } = req.body;
  
  // Validate propertyId is valid MongoDB ObjectId
  if (!propertyId?.match(/^[0-9a-f]{24}$/)) {
    return res.status(400).json({ error: 'Invalid propertyId format' });
  }
  
  // Validate amount is positive
  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Amount must be positive number' });
  }
  
  // Validate verification method
  const validMethods = ['ejari', 'deed', 'self-report'];
  if (!validMethods.includes(verificationMethod)) {
    return res.status(400).json({ error: 'Invalid verification method' });
  }
  
  next();
};

// Use:
router.post('/deals/close', validateDealClosure, closeDealController);
```

---

### 4. 🔴 CRITICAL: Environment Variable Validation
**Time:** 30 minutes  
**Impact:** Prevents cryptic startup errors

**Implementation:**
```javascript
// server/lib/validateEnv.js
const required = ['MONGODB_URI', 'VITE_FIREBASE_API_KEY', 'JWT_SECRET'];
const optional = ['STRIPE_SECRET_KEY', 'SENTRY_DSN'];

export const validateEnv = () => {
  const missing = required.filter(v => !process.env[v]);
  if (missing.length > 0) {
    console.error('❌ FATAL: Missing required env vars:', missing);
    process.exit(1);
  }
};

// server/index.js (TOP OF FILE)
import { validateEnv } from './lib/validateEnv.js';
validateEnv(); // Validate BEFORE connecting DB
```

---

### 5. 🟠 HIGH: Centralized Error Handling
**Time:** 2 hours  
**Impact:** Better debugging, consistent error responses

**Create: `server/middleware/errorHandler.js`**
```javascript
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Server error';
  
  // Standard error response
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Use in routes:
router.post('/deals/close', asyncHandler(async (req, res) => {
  const deal = await Deal.create(req.body);
  if (!deal) throw new Error('Failed to create deal');
  res.json(deal);
}));
```

**Dependencies Already Installed:** ✅ Check if express.js v5+ (has error handling)

---

## NEXT 2 WEEKS (High Priority)

### 6. 🟠 HIGH: Logging Infrastructure
**Time:** 3-4 hours  
**Steps:**
- [ ] Set up Winston logger with console + file transports
- [ ] Create log levels: debug, info, warn, error
- [ ] Disable debug logs in production
- [ ] Add log rotation (daily)
- [ ] Create log viewer endpoint for admins

---

### 7. 🟠 HIGH: Database Caching
**Time:** 2-3 hours  
**Install:** `npm install node-cache`
**Focus:** Cache portal leads (refresh every 5 min)
**Benefit:** Reduce portal API calls by 80%

---

### 8. 🟠 HIGH: Integrate Sentry (Error Tracking)
**Time:** 2-3 hours  
**Steps:**
1. Create Sentry project at https://sentry.io
2. Get DSN
3. Install: `npm install @sentry/node @sentry/react`
4. Initialize in server/index.js and src/main.jsx
5. Test: Throw error, verify it appears in Sentry dashboard

**Benefits:** Know when errors happen in production without waiting for user reports

---

### 9. 🟠 HIGH: Database Indexes
**Time:** 1-2 hours  
**Critical Indexes:**
```javascript
// server/models/Deal.js
dealSchema.index({ agentId: 1, createdAt: -1 });
dealSchema.index({ propertyId: 1 });
dealSchema.index({ status: 1, createdAt: -1 });
dealSchema.index({ amount: 1 });

// server/models/Lead.js
leadSchema.index({ email: 1 });
leadSchema.index({ phone: 1 });
leadSchema.index({ score: -1 }); // Find hot leads fast
leadSchema.index({ portalName: 1, externalId: 1 }); // Dedup check
```

---

### 10. 🟠 HIGH: Health Check Endpoint
**Time:** 1 hour  
**Endpoint:** `GET /health`
**Returns:** { status: 'healthy' | 'degraded', checks: { db, api, firebase } }

---

## LATER (Medium Priority - 2-4 Weeks)

### Next Phase Tasks
- [ ] Unit tests for LeadAggregationEngine
- [ ] Unit tests for commission calculation
- [ ] Unit tests for payment logic
- [ ] Integration tests for deal closure flow
- [ ] TypeScript migration (incremental)
- [ ] Swagger/OpenAPI documentation
- [ ] API response pagination
- [ ] Deal dispute workflow
- [ ] Commission dispute tracking
- [ ] Database backup automation

---

## VERIFICATION CHECKLIST

After each change, verify:

```bash
# 1. No console.log in production
grep -r "console\." src/ server/ | grep -v "node_modules" | grep -v ".test."

# 2. Tests passing
npm run test:run

# 3. No TypeScript errors (if migrating)
npm run type-check

# 4. ESLint passes
npm run lint

# 5. App starts without errors
npm run dev

# 6. Health check works
curl http://localhost:3000/health

# 7. Deploy to Vercel
# Make sure all env vars are set in Vercel dashboard
```

---

## ENVIRONMENT VARIABLES CHECKLIST

Verify these are set in **Vercel Dashboard** → Project Settings → Environment Variables:

**Production (.env):**
- [ ] MONGODB_URI
- [ ] VITE_FIREBASE_API_KEY
- [ ] FIREBASE_PROJECT_ID
- [ ] JWT_SECRET
- [ ] NODE_ENV=production
- [ ] STRIPE_SECRET_KEY (if using payments)
- [ ] SENTRY_DSN (if using error tracking)

**Development (.env.local):**
- [ ] VITE_FIREBASE_API_KEY (public, OK to be in code)
- [ ] All others same as production

**Security:** Never commit .env files to Git

---

## QUESTIONS BEFORE IMPLEMENTATION

1. **Logging Level**: Should production logs be sent to file, cloud (LogRocket), or just console?
2. **Error Tracking**: Use Sentry (recommended), LogRocket, or custom solution?
3. **Cache TTL**: Keep portal leads cache at 5 minutes, or adjust?
4. **Rate Limit Strictness**: Are 5 login attempts per 15 min too strict? Adjust based on user feedback.
5. **Database**: Is MongoDB.com Atlas being used? If yes, enable backup snapshots in dashboard.

---

## ROLLBACK PLAN

If something breaks in production:

1. Revert last commit: `git revert HEAD`
2. Redeploy to Vercel (automatic)
3. Check health endpoint: `curl https://white-caves.vercel.app/health`
4. Monitor Sentry/logs for errors
5. If still broken, contact team

---

**Owner:** Development Team  
**Review Date:** Weekly  
**Last Updated:** January 16, 2026  
**Next Review:** January 23, 2026
