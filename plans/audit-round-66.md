# 🔒 Deep Audit Round 66 — Backend API Security & Completeness

**Date:** March 20, 2026  
**Auditor:** Senior Security Auditor (AI-Assisted)  
**Scope:** All backend route files, middleware, utilities, and configuration  
**Tech Stack:** Node.js / Express 5, TypeScript, Prisma ORM, MongoDB  

---

## Executive Summary

| Severity | Count |
|----------|-------|
| 🔴 CRITICAL | 4 |
| 🟠 HIGH | 7 |
| 🟡 MEDIUM | 5 |
| **TOTAL** | **16** |

### Top 3 Most Dangerous Findings

1. **[CRITICAL-1] Firebase-sync endpoint issues unauthenticated JWTs without verifying Firebase tokens** — Any attacker can call `POST /api/auth/firebase-sync` with a fabricated `firebaseUid` and receive a valid JWT, completely bypassing authentication.

2. **[CRITICAL-2] Firebase-sync enables account takeover** — An attacker who knows a victim's email can link their firebaseUid to the victim's existing account (if it has no firebaseUid yet), receiving a JWT for the victim's session.

3. **[CRITICAL-3] Auth-protected routes bypass JWT verification** — Due to Express middleware ordering, `/api/auth/profile`, `/api/auth/password`, and `/api/auth/logout` are mounted BEFORE the global `authMiddleware`, causing `req.user` to never be set. These routes are non-functional in production and vulnerable to logic errors if modified.

---

## 🔴 CRITICAL Issues

### CRITICAL-1: Firebase-sync endpoint allows unauthenticated JWT issuance

**File:** `server/routes/auth.ts` — Lines 302–370  
**Route:** `POST /api/auth/firebase-sync`

**Problem:** This endpoint creates new users and returns valid JWT tokens based solely on a client-supplied `firebaseUid`. There is **no server-side verification** of the Firebase ID token using Firebase Admin SDK. Any attacker can send a request with a fabricated `firebaseUid` and obtain a valid JWT.

**Current Code (lines 305–318):**
```typescript
router.post(
  '/firebase-sync',
  asyncHandler(async (req: Request, res: Response) => {
    const { firebaseUid, email, name, photoUrl } = req.body;

    if (!firebaseUid) {
      throw new AppError('Firebase UID is required', 400);
    }

    // Try to find user by firebaseUid first (source of truth), then by email
    let user = await prisma.user.findFirst({ where: { firebaseUid } });

    if (!user && email) {
      user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    }

    if (!user) {
      // Create new user from Firebase social auth ← CREATES ACCOUNT WITH NO VERIFICATION
      user = await prisma.user.create({ ... });
    }
    // ... generates and returns JWT
```

**Attack Scenario:**
```bash
curl -X POST http://target/api/auth/firebase-sync \
  -H "Content-Type: application/json" \
  -d '{"firebaseUid": "attacker-fake-uid-123", "email": "attacker@evil.com", "name": "Attacker"}'
# Returns: { success: true, data: { token: "valid-jwt-here", user: { ... } } }
```

**Proposed Fix:**
```typescript
import admin from 'firebase-admin';

router.post(
  '/firebase-sync',
  asyncHandler(async (req: Request, res: Response) => {
    const { idToken } = req.body; // Client sends Firebase ID token, NOT just UID

    if (!idToken) {
      throw new AppError('Firebase ID token is required', 400);
    }

    // VERIFY the token server-side using Firebase Admin SDK
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (err) {
      throw new AppError('Invalid or expired Firebase token', 401);
    }

    const { uid: firebaseUid, email, name, picture: photoUrl } = decodedToken;
    // ... proceed with verified data
```

---

### CRITICAL-2: Firebase-sync enables account takeover via email linkage

**File:** `server/routes/auth.ts` — Lines 314–345  
**Route:** `POST /api/auth/firebase-sync`

**Problem:** When a user with a matching email exists but has no `firebaseUid`, the endpoint links the attacker's `firebaseUid` to the victim's account and returns a JWT for that account.

**Current Code (lines 338–343):**
```typescript
// Update existing user with Firebase data if missing
const updates: Record<string, unknown> = {};
if (!user.firebaseUid && firebaseUid) updates.firebaseUid = firebaseUid;
// ... updates the user record, then generates JWT for the victim's account
```

**Attack Scenario:**
1. Attacker knows victim's email: `manager@whitecaves.ae`
2. Attacker calls: `POST /api/auth/firebase-sync { firebaseUid: "attacker-uid", email: "manager@whitecaves.ae" }`
3. Endpoint finds the manager's account by email (which has no firebaseUid)
4. Links attacker's firebaseUid to the manager's account
5. Returns JWT with the manager's permissions (owner/manager role)

**Impact:** Full account takeover of any user who registered via email/password and hasn't used Firebase auth. The attacker inherits the victim's role (could be `owner` or `manager`).

**Proposed Fix:** This is resolved by CRITICAL-1's fix — verifying the Firebase token server-side ensures the `email` claim comes from Firebase's verified authentication, not attacker input.

---

### CRITICAL-3: Auth routes bypass global JWT verification middleware

**File:** `server/index.ts` — Lines 104–107  
**Affected routes:** `GET /api/auth/profile`, `PATCH /api/auth/profile`, `PUT /api/auth/password`, `POST /api/auth/logout`

**Problem:** The Express middleware stack registers `authRoutes` BEFORE the global `authMiddleware`:

```typescript
// Line 104 — routes registered FIRST
app.use('/api/auth', authRoutes);

// Lines 107+ — auth middleware registered AFTER
if (process.env.NODE_ENV === 'production') {
  app.use('/api', authMiddleware);  // ← NEVER runs for /api/auth/* routes
```

Express processes middleware in **registration order**. When a request hits `/api/auth/profile`, the `authRoutes` router handles it immediately. The global `authMiddleware` (which verifies the JWT and sets `req.user`) never executes for these routes.

**Impact:**
- `req.user` is **always undefined** for auth routes in production
- `/api/auth/profile` and `/api/auth/password` always return 401 ("Not authenticated") — they are non-functional
- `/api/auth/logout` silently succeeds without logging the actual user
- If any future auth route defaults `req.user?.role` to a privileged value, it becomes a privilege escalation vector

**Proposed Fix — Option A (apply auth middleware inside the router):**
```typescript
// server/routes/auth.ts — import the middleware
import authMiddleware from '../middleware/auth.js';

// Apply to protected auth routes
router.get('/profile', authMiddleware, asyncHandler(async (req, res) => { ... }));
router.patch('/profile', authMiddleware, asyncHandler(async (req, res) => { ... }));
router.put('/password', authMiddleware, asyncHandler(async (req, res) => { ... }));
router.post('/logout', authMiddleware, asyncHandler(async (req, res) => { ... }));
```

**Proposed Fix — Option B (reorder middleware in index.ts):**
```typescript
// Mount auth middleware BEFORE routes (for /api/auth/profile etc.)
// But EXCLUDE public auth endpoints
app.use('/api', (req, res, next) => {
  const publicPaths = ['/api/auth/login', '/api/auth/register', '/api/auth/firebase-sync', '/api/auth/verify-2fa'];
  if (publicPaths.includes(req.path)) return next();
  return authMiddleware(req, res, next);
});
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);
// ... etc
```

Option A is simpler and more explicit.

---

### CRITICAL-4: Compliance audit-logs accessible to any authenticated user

**File:** `server/routes/compliance.ts` — Lines 84–120  
**Route:** `GET /api/compliance/audit-logs`

**Problem:** The audit logs endpoint has **no authorization check**. Any authenticated user (including basic agents) can read the full system audit trail, which includes:
- All user login/logout events
- All data creation, modification, and deletion events
- User email addresses, names, and roles
- Activity metadata (status changes, financial data)

**Current Code (lines 84–88):**
```typescript
router.get(
  '/audit-logs',
  asyncHandler(async (req: Request, res: Response) => {
    const { page = '1', pageSize = '50', type, action } = req.query;
    // ← NO authorization check — any user can access
```

**Impact:** Information disclosure. An agent can see when the owner changed commission amounts, when records were deleted, and all system activities. In a real estate CRM, this may expose competitive information, financial decisions, and personnel actions.

**Proposed Fix:**
```typescript
router.get(
  '/audit-logs',
  asyncHandler(async (req: Request, res: Response) => {
    // AUTHORIZATION: Only admins/managers can view audit logs
    const isAdmin = ['owner', 'manager'].includes(req.user?.role || '');
    if (!isAdmin) {
      throw new AppError('Only administrators can access audit logs', 403);
    }
    // ... existing code
```

---

## 🟠 HIGH Issues

### HIGH-1: Agents list endpoint has no pagination

**File:** `server/routes/agents.ts` — Lines 14–97  
**Route:** `GET /api/agents`

**Problem:** The endpoint calls `prisma.user.findMany()` with no `take` or `skip` parameters. All agents are returned in a single response. Additionally, the endpoint performs 3 additional batch queries (won leads, total leads, commission sums) across ALL agent IDs.

**Current Code (line 40):**
```typescript
const agents = await prisma.user.findMany({
  where,
  select: { ... },
  orderBy: { name: 'asc' },
  // ← NO skip, take, or limit
});
```

**Impact:** With hundreds or thousands of agents, this causes:
- Memory exhaustion on the server (all records loaded into memory at once)
- Slow response times
- Potential OOM crash under concurrent requests

**Proposed Fix:**
```typescript
import { parsePagination } from '../config/pagination';

router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { page: pageNum, limit, skip } = parsePagination({
    page: req.query.page as string,
    limit: req.query.pageSize as string,
  });

  // ... existing where clause ...

  const [agents, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: { ... },
      orderBy: { name: 'asc' },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  // ... batch queries use only current page's agentIds ...

  res.status(200).json({
    success: true,
    data: enriched,
    pagination: { page: pageNum, pageSize: limit, total, totalPages: Math.ceil(total / limit) },
  });
}));
```

---

### HIGH-2: Agent commissions endpoint has no authorization check

**File:** `server/routes/agents.ts` — Lines 203–237  
**Route:** `GET /api/agents/:id/commissions`

**Problem:** Any authenticated user can view any agent's complete commission history (amounts, statuses, linked leads, properties) by guessing or iterating agent IDs.

**Current Code (line 204):**
```typescript
router.get(
  '/:id/commissions',
  asyncHandler(async (req: Request, res: Response) => {
    // ← NO authorization check — any user reads any agent's commissions
    const where: Record<string, unknown> = { agentId: req.params.id };
```

**Impact:** IDOR (Insecure Direct Object Reference). Agents can view competitors' commission data. Financial data exposure violates confidentiality.

**Proposed Fix:**
```typescript
// Only the agent themselves or admins/managers can view commissions
const isAdmin = ['owner', 'manager', 'finance'].includes(req.user?.role || '');
const isSelf = req.params.id === req.user?.id;
if (!isAdmin && !isSelf) {
  throw new AppError('You do not have permission to view these commissions', 403);
}
```

---

### HIGH-3: Tenant POST has no authorization — any user can create tenant records

**File:** `server/routes/tenants.ts` — Lines 80–112  
**Route:** `POST /api/tenants`

**Problem:** The PATCH and DELETE routes both check `['owner', 'manager'].includes(req.user?.role)`, but POST has **no authorization check**. Any authenticated user (including basic agents) can create tenant records.

**Current Code (lines 80–84):**
```typescript
router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { name, email, phone, nationality, emiratesId, ... } = req.body;
    if (!name?.trim()) throw new AppError('Tenant name is required', 400);
    // ← NO authorization check — any user creates tenants
```

**Impact:** Unauthorized data modification. Agents creating bogus tenant records can pollute the leasing database, impact compliance metrics, and cause operational confusion.

**Proposed Fix:**
```typescript
// AUTHORIZATION: Only admins or property managers can create tenant records
const isAdmin = ['owner', 'manager'].includes(req.user?.role || '');
if (!isAdmin) {
  throw new AppError('Only admins or property managers can create tenant records', 403);
}
```

---

### HIGH-4: Communication message history has no authorization

**File:** `server/routes/communications.ts` — Lines 44–80  
**Route:** `GET /api/communications/messages/:recipientId`

**Problem:** Any authenticated user can read the full communication history for any lead. The `recipientId` (which is actually a `leadId`) is used directly without checking if the requesting user is the lead's assigned agent or an admin.

**Current Code (line 44):**
```typescript
router.get(
  '/messages/:recipientId',
  asyncHandler(async (req: Request, res: Response) => {
    const { recipientId } = req.params;
    // ← NO authorization — any user reads any lead's communication history
```

**Impact:** IDOR. Any agent can read private communications between another agent and their leads. In a competitive real estate environment, this exposes negotiation details, pricing discussions, and client information.

**Proposed Fix:**
```typescript
// Verify the requesting user is assigned to this lead or is an admin
const lead = await prisma.lead.findUnique({ where: { id: recipientId }, select: { assignedToId: true, createdById: true } });
if (!lead) throw new AppError('Lead not found', 404);

const isAdmin = ['owner', 'manager'].includes(req.user?.role || '');
const isAssigned = lead.assignedToId === req.user?.id || lead.createdById === req.user?.id;
if (!isAdmin && !isAssigned) {
  throw new AppError('You do not have permission to view these communications', 403);
}
```

---

### HIGH-5: Executive dashboard and KPI endpoints have no role-based access

**File:** `server/routes/reporting.ts` — Lines 127–162 (executive), Lines 165–202 (kpis)  
**Routes:** `GET /api/dashboard/executive`, `GET /api/dashboard/kpis`

**Problem:** These endpoints expose aggregate financial metrics (portfolio value, commission breakdowns, revenue, deal sizes) to ALL authenticated users. The `/executive` endpoint is clearly intended for management but has no role check.

**Current Code (reporting.ts line 127):**
```typescript
router.get(
  '/executive',
  asyncHandler(async (req: Request, res: Response) => {
    // ← NO authorization — any agent sees executive financial data
    const [leadsByStatus, leadsBySource, propertiesByStatus, propertiesByType,
      commissionsByStatus, portfolioValue] = await Promise.all([...]);
```

**Impact:** Any agent can see total portfolio value, commission breakdowns by status (approved/pending/paid amounts), and complete pipeline analytics. This is sensitive business intelligence data.

**Proposed Fix:**
```typescript
// AUTHORIZATION: Executive dashboard restricted to management
const isManagement = ['owner', 'manager', 'finance'].includes(req.user?.role || '');
if (!isManagement) {
  throw new AppError('Executive dashboard requires management access', 403);
}
```

---

### HIGH-6: Bulk import lacks specific rate limiting

**File:** `server/routes/leads.ts` — Lines 380–410  
**Route:** `POST /api/leads/bulk-import`

**Problem:** While the endpoint correctly limits batch size to 500 leads, it relies only on the general API rate limiter (100 requests/minute). An attacker or rogue script can import **50,000 leads per minute** (500 × 100 requests).

**Current Code (line 382):**
```typescript
router.post(
  '/bulk-import',
  asyncHandler(async (req: Request, res: Response) => {
    const { leads } = req.body;
    if (!Array.isArray(leads) || leads.length === 0) throw new AppError('Provide an array of leads', 400);
    if (leads.length > 500) throw new AppError('Maximum 500 leads per batch', 400);
    // ← No specific rate limiter, no authorization check
```

**Additional Issue:** There is also **no authorization check** on bulk import. Any authenticated user can mass-import leads.

**Proposed Fix (in server/index.ts, add before route mounting):**
```typescript
import { strictLimiter } from './middleware/rateLimiter.js';
app.use('/api/leads/bulk-import', strictLimiter); // 10 requests per 15 min
```

And add authorization in the route:
```typescript
const isAdmin = ['owner', 'manager'].includes(req.user?.role || '');
if (!isAdmin) {
  throw new AppError('Only managers can bulk-import leads', 403);
}
```

---

### HIGH-7: Lead activities POST has no input validation

**File:** `server/routes/leads.ts` — Lines 336–358  
**Route:** `POST /api/leads/:id/activities`

**Problem:** The `type`, `action`, and `description` fields are accepted without any validation or sanitization. There are no enum checks for `type`/`action` and no length limits on `description`.

**Current Code (lines 340–352):**
```typescript
router.post(
  '/:id/activities',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { type, action, description } = req.body;
    // ← NO validation on type, action, description — accepts anything

    const activity = await prisma.activity.create({
      data: {
        type: type || 'lead',       // ← arbitrary string stored
        action: action || 'note_added', // ← arbitrary string stored
        description: description || 'Activity logged', // ← no length limit
```

**Impact:** An attacker can store arbitrarily large `description` values (potentially megabytes), use invalid `type`/`action` values that break frontend rendering, or inject XSS payloads stored in the database.

**Proposed Fix:**
```typescript
const VALID_TYPES = ['lead', 'client', 'property', 'deal', 'commission', 'system'];
const VALID_ACTIONS = ['created', 'updated', 'deleted', 'status_changed', 'note_added', 'call', 'email', 'meeting'];

validate(req.body, {
  type:        rules.oneOf('Activity type', VALID_TYPES),
  action:      rules.oneOf('Activity action', VALID_ACTIONS),
  description: rules.optionalStringWithMax('Description', 2000),
});
```

---

## 🟡 MEDIUM Issues

### MEDIUM-1: Tenant POST/PATCH fields lack validation

**File:** `server/routes/tenants.ts` — Lines 80–160  
**Routes:** `POST /api/tenants`, `PATCH /api/tenants/:id`

**Problem:** Multiple fields are accepted without format or length validation:
- `email` — no format validation (the leads POST validates email, but tenants POST does not)
- `phone` — no format validation
- `emiratesId` — no format validation (should match UAE Emirates ID pattern: `784-XXXX-XXXXXXX-X`)
- `nationality`, `notes` — no max length check
- `monthlyRent`, `deposit` — parsed as float but no max value cap (allows astronomically large numbers)

**Proposed Fix:**
```typescript
validate(req.body, {
  name:        rules.requiredStringWithMax('Tenant name', 255),
  email:       rules.optionalEmail('Email'),
  phone:       rules.optionalStringWithMax('Phone', 20),
  nationality: rules.optionalStringWithMax('Nationality', 100),
  emiratesId:  rules.optionalStringWithMax('Emirates ID', 20),
  notes:       rules.optionalStringWithMax('Notes', 5000),
});

// Validate rent range
if (monthlyRent !== undefined) {
  const rent = parseFloat(monthlyRent);
  if (!Number.isFinite(rent) || rent < 0 || rent > 100_000_000) {
    throw new AppError('Monthly rent must be between 0 and 100,000,000', 400);
  }
}
```

---

### MEDIUM-2: Communications POST /messages/send has no channel validation or content length limit

**File:** `server/routes/communications.ts` — Lines 13–43  
**Route:** `POST /api/communications/messages/send`

**Problem:**
- `channel` is not validated against allowed values — any string is stored
- `content` has no max length check — could store megabytes in a single message
- `content` is not sanitized before storage

**Current Code (lines 15–18):**
```typescript
router.post(
  '/messages/send',
  asyncHandler(async (req: Request, res: Response) => {
    const { recipientId, channel, content, leadId } = req.body;
    if (!recipientId || !content) {
      throw new AppError('Recipient ID and content are required', 400);
    }
    // ← No channel validation, no content length limit, no sanitization
```

**Proposed Fix:**
```typescript
const VALID_CHANNELS = ['email', 'whatsapp', 'sms', 'call', 'system'];
if (channel && !VALID_CHANNELS.includes(channel)) {
  throw new AppError(`Channel must be one of: ${VALID_CHANNELS.join(', ')}`, 400);
}
if (content.length > 10000) {
  throw new AppError('Message content must be 10,000 characters or less', 400);
}
const sanitizedContent = sanitizeString(content);
```

---

### MEDIUM-3: Compliance POST /reports has no field length validation

**File:** `server/routes/compliance.ts` — Lines 122–147  
**Route:** `POST /api/compliance/reports`

**Problem:** Only `title` existence is checked. No max length on `title`, `findings`, or `recommendations`. All three are stored in activity metadata (JSON field), where huge values could bloat the database.

**Current Code (lines 126–129):**
```typescript
const { title, findings, recommendations } = req.body;
if (!title) throw new AppError('Report title is required', 400);
// ← No length validation on title, findings, or recommendations
```

**Proposed Fix:**
```typescript
validate(req.body, {
  title:           rules.requiredStringWithMax('Report title', 255),
  findings:        rules.optionalStringWithMax('Findings', 10000),
  recommendations: rules.optionalStringWithMax('Recommendations', 10000),
});
```

---

### MEDIUM-4: Property GET /:id returns full commission objects

**File:** `server/routes/properties.ts` — Lines 121–137  
**Route:** `GET /api/properties/:id`

**Problem:** The property detail endpoint uses `commissions: true` which returns ALL commission fields (amounts, agent IDs, statuses, payment dates). Any user viewing a property sees all associated commission financial data.

**Current Code (line 130):**
```typescript
const property = await prisma.property.findUnique({
  where: { id: req.params.id },
  include: {
    user: { select: { id: true, name: true, email: true, phone: true } },
    leads: { select: { ... }, take: 10, orderBy: { ... } },
    commissions: true,  // ← Returns ALL commission fields including amounts
  },
});
```

**Proposed Fix:**
```typescript
commissions: {
  select: { id: true, type: true, status: true, createdAt: true },
  // Amount and agent details excluded unless user is admin/finance
  take: 10,
  orderBy: { createdAt: 'desc' },
},
```

Or conditionally include financial details:
```typescript
const isAdmin = ['owner', 'manager', 'finance'].includes(req.user?.role || '');
const commissionSelect = isAdmin
  ? { id: true, amount: true, percentage: true, type: true, status: true, agentId: true, createdAt: true }
  : { id: true, type: true, status: true, createdAt: true };
```

---

### MEDIUM-5: Dev JWT_SECRET fallback applies to all non-production NODE_ENV values

**File:** `server/config/env.ts` — Lines 13–20

**Problem:** The JWT_SECRET production check only triggers when `NODE_ENV === 'production'`. For `staging`, `test`, `preview`, or any other value, the hardcoded dev fallback is silently used. If a staging environment is accidentally exposed, all JWTs use the predictable secret.

**Current Code (lines 13–19):**
```typescript
const _jwtSecret = process.env.JWT_SECRET;
if (!_jwtSecret && IS_PRODUCTION) {
  throw new Error('CRITICAL: JWT_SECRET environment variable must be set in production');
}
if (!_jwtSecret) {
  console.warn('⚠️  JWT_SECRET not set — using dev-only fallback.');
}
export const JWT_SECRET = _jwtSecret || 'white-caves-dev-only-secret-DO-NOT-USE-IN-PRODUCTION';
```

**Proposed Fix:**
```typescript
const _jwtSecret = process.env.JWT_SECRET;
const INSECURE_ENVS = ['development', 'test'];
if (!_jwtSecret && !INSECURE_ENVS.includes(NODE_ENV)) {
  throw new Error(`CRITICAL: JWT_SECRET must be set for NODE_ENV=${NODE_ENV}`);
}
```

---

## Summary Table

| # | Severity | File | Route/Area | Issue |
|---|----------|------|------------|-------|
| 1 | 🔴 CRITICAL | auth.ts:302–370 | POST /auth/firebase-sync | JWT issuance without Firebase token verification |
| 2 | 🔴 CRITICAL | auth.ts:314–345 | POST /auth/firebase-sync | Account takeover via email-based UID linkage |
| 3 | 🔴 CRITICAL | index.ts:104–107 | Auth route mounting | Auth routes bypass global JWT verification |
| 4 | 🔴 CRITICAL | compliance.ts:84–120 | GET /compliance/audit-logs | No authorization — all users see audit trail |
| 5 | 🟠 HIGH | agents.ts:14–97 | GET /agents | No pagination — all records returned |
| 6 | 🟠 HIGH | agents.ts:203–237 | GET /agents/:id/commissions | No authorization — IDOR on commissions |
| 7 | 🟠 HIGH | tenants.ts:80–112 | POST /tenants | No authorization — any user creates tenants |
| 8 | 🟠 HIGH | communications.ts:44–80 | GET /messages/:recipientId | No authorization — IDOR on message history |
| 9 | 🟠 HIGH | reporting.ts:127–202 | GET /executive, /kpis | No role-based access on financial endpoints |
| 10 | 🟠 HIGH | leads.ts:380–410 | POST /leads/bulk-import | No rate limiter + no authorization check |
| 11 | 🟠 HIGH | leads.ts:336–358 | POST /leads/:id/activities | No input validation on type/action/description |
| 12 | 🟡 MEDIUM | tenants.ts:80–160 | POST/PATCH /tenants | Missing field format and length validation |
| 13 | 🟡 MEDIUM | communications.ts:13–43 | POST /messages/send | No channel validation, no content length limit |
| 14 | 🟡 MEDIUM | compliance.ts:122–147 | POST /reports | No field length validation |
| 15 | 🟡 MEDIUM | properties.ts:121–137 | GET /properties/:id | Full commission objects exposed |
| 16 | 🟡 MEDIUM | env.ts:13–20 | JWT_SECRET config | Dev fallback active for staging/preview envs |

---

## Recommended Fix Priority

### Immediate (before any deployment):
1. **CRITICAL-1 + CRITICAL-2:** Add Firebase Admin SDK token verification to `/firebase-sync`
2. **CRITICAL-3:** Add explicit `authMiddleware` to protected auth routes (profile, password, logout)
3. **CRITICAL-4:** Add admin-only authorization to `/compliance/audit-logs`

### This sprint:
4. **HIGH-1:** Add pagination to `GET /agents`
5. **HIGH-2 through HIGH-5:** Add authorization checks to agents/commissions, communications, executive dashboard
6. **HIGH-6:** Add rate limiting + auth to bulk import
7. **HIGH-7:** Add input validation to lead activities

### Next sprint:
8. **MEDIUM-1 through MEDIUM-5:** Field validation, content limits, conditional data exposure

---

## What's Working Well ✅

The following areas were audited and found to be solid:

- ✅ All route handlers use `asyncHandler` wrapper — no unhandled promise rejections
- ✅ Leads, properties, and transactions have comprehensive `validate()` + `rules` validation
- ✅ Prisma parameterizes all queries — no SQL/NoSQL injection vectors found
- ✅ Delete operations use `prisma.$transaction()` for atomicity
- ✅ Rate limiters applied to login, register, 2FA, and password change
- ✅ CORS properly configured with origin whitelist
- ✅ Helmet CSP properly configured with reasonable directives
- ✅ `sanitizeString()` applied to user-facing text fields in leads and properties
- ✅ Export queries hard-limited with `take: 10000` / `take: 5000`
- ✅ Sort fields validated against whitelists (prevents arbitrary field enumeration)
- ✅ Password strength validation with weak password blocklist
- ✅ Registration always assigns `agent` role — no privilege escalation on signup
- ✅ Graceful shutdown handlers and process-level error handlers in place
- ✅ Consistent `{ success, data, pagination }` response shape across most endpoints
- ✅ Request body size limited to 1MB via `express.json({ limit: '1mb' })`

---

*End of Audit Round 66*
