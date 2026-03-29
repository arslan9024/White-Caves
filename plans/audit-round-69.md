# 🔍 DEEP AUDIT ROUND 69 — White Caves CRM Platform
**Date:** March 20, 2026  
**Auditor:** Senior Full-Stack Auditor  
**Scope:** Runtime bugs, data integrity, UX quality, code quality, security hardening  
**Methodology:** Static code analysis via grep_search, read_file, semantic_search  
**Build status:** ✅ PASSING (0 errors)

---

## EXECUTIVE SUMMARY

| Severity | Count |
|----------|-------|
| 🔴 CRITICAL | 3 |
| 🟠 HIGH | 5 |
| 🟡 MEDIUM | 6 |
| 🔵 LOW | 4 |
| **TOTAL** | **18** |

---

## 🔴 CRITICAL FINDINGS

### C1. Webhook Secret Comparison Is Timing-Attack Vulnerable
**File:** `server/index.ts` lines 176–178  
**Category:** Security Hardening  
**Impact:** An attacker can use timing analysis to brute-force the WhatsApp webhook secret one character at a time.

```typescript
// CURRENT (vulnerable to timing attack)
const webhookToken = req.headers['x-webhook-token'] || req.query.token;
if (webhookToken !== WHATSAPP_WEBHOOK_SECRET) {
  throw new AppError('Invalid webhook token', 403);
}
```

**Fix:** Use Node.js `crypto.timingSafeEqual` for constant-time comparison:
```typescript
import { timingSafeEqual } from 'crypto';

function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

const webhookToken = String(req.headers['x-webhook-token'] || req.query.token || '');
if (!WHATSAPP_WEBHOOK_SECRET || !safeCompare(webhookToken, WHATSAPP_WEBHOOK_SECRET)) {
  throw new AppError('Invalid webhook token', 403);
}
```

---

### C2. Firebase-Sync Endpoint Accepts Unverified Tokens in Production
**File:** `server/routes/auth.ts` lines 330–343  
**Category:** Security Hardening  
**Impact:** In production, the `/api/auth/firebase-sync` endpoint requires a `firebaseToken` parameter but only logs a warning — it does **not** actually verify the token. Anyone who sends `{ firebaseUid: "<victim-uid>", firebaseToken: "anything" }` gets a valid JWT for that user's account.

```typescript
// CURRENT — token is accepted without cryptographic verification
if (process.env.NODE_ENV === 'production') {
  if (!firebaseToken) {
    throw new AppError('Firebase ID token is required for server-side verification', 400);
  }
  logger.warn('firebase-sync: Firebase Admin SDK not configured — token accepted without server-side verification...');
}
```

**Fix:** Either (a) install `firebase-admin` and verify `firebaseToken` server-side, or (b) disable this endpoint entirely in production until verification is implemented:
```typescript
if (process.env.NODE_ENV === 'production') {
  throw new AppError('Firebase sync is disabled until firebase-admin SDK is configured', 503);
}
```

---

### C3. CRM Export Leaks Full Lead Records (Including All Fields)
**File:** `server/routes/crm.ts` lines 147–148  
**Category:** Data Integrity & API Robustness  
**Impact:** `GET /api/crm/export?entity=leads` uses `prisma.lead.findMany({ include: { assignedTo: { select: { name: true } } }, take: 10000 })` — this returns **all** lead fields including `notes` (potentially contains PII, deal strategy), `phone`, `email`, `budget`, `score`, internal `tags`, and `createdById`. Additionally `take: 10000` is a resource exhaustion vector (one request can pull 10 K rows).

```typescript
case 'leads':
  data = await prisma.lead.findMany({ include: { assignedTo: { select: { name: true } } }, take: 10000 });
  break;
```

**Fix:** Add explicit `select` to whitelist exported fields and enforce a cursor-based or paginated export with a cap:
```typescript
case 'leads':
  data = await prisma.lead.findMany({
    select: {
      id: true, name: true, email: true, status: true, source: true,
      budget: true, createdAt: true,
      assignedTo: { select: { name: true } },
    },
    take: Math.min(parseInt(req.query.limit as string) || 1000, 5000),
  });
  break;
```

---

## 🟠 HIGH FINDINGS

### H1. Auth Profile PATCH — No Input Sanitization or Length Limits
**File:** `server/routes/auth.ts` lines 272–295  
**Category:** Data Integrity / Security  
**Impact:** `PATCH /api/auth/profile` accepts `name`, `phone`, and `photoUrl` without sanitization (`sanitizeString` is never called) and without length limits. A user can store 1 MB of data in `name` or inject stored XSS payloads via `photoUrl` in a JSON context.

```typescript
const { name, phone, photoUrl } = req.body;
const data: Record<string, unknown> = {};
if (name !== undefined) data.name = name.trim();      // ← no sanitize, no max length
if (phone !== undefined) data.phone = phone;           // ← no sanitize, no max length
if (photoUrl !== undefined) data.photoUrl = photoUrl;  // ← no sanitize, no URL validation
```

**Fix:**
```typescript
import { sanitizeString, truncateString } from '../utils/sanitize';

if (name !== undefined) data.name = truncateString(sanitizeString(name.trim()), 200);
if (phone !== undefined) data.phone = truncateString(sanitizeString(phone.trim()), 30);
if (photoUrl !== undefined) {
  // Validate it's a reasonable URL
  try { new URL(photoUrl); data.photoUrl = truncateString(photoUrl.trim(), 2000); }
  catch { throw new AppError('Invalid photo URL', 400); }
}
```

---

### H2. Tenant Create/Update — No Input Sanitization
**File:** `server/routes/tenants.ts` lines 89–120, 127–170  
**Category:** Data Integrity / Security  
**Impact:** `POST /api/tenants` and `PATCH /api/tenants/:id` store `name`, `email`, `phone`, `nationality`, `emiratesId`, and `notes` directly into the database without calling `sanitizeString()`. Unlike the leads and properties routes which do sanitize, tenant data bypasses all XSS prevention.

```typescript
// POST — no sanitization
const tenant = await prisma.tenant.create({
  data: {
    name: name.trim(),            // ← no sanitizeString!
    email: email?.trim() || null, // ← no sanitizeString!
    notes: notes || null,         // ← no sanitizeString!
  },
});
```

**Fix:** Import and apply `sanitizeString` to all text inputs, add `truncateString` for length limits, and add validation rules consistent with other routes.

---

### H3. Communications Send — No Content Length Limit
**File:** `server/routes/communications.ts` lines 15–55  
**Category:** Data Integrity / API Robustness  
**Impact:** `POST /api/communications/messages/send` only validates that `content` is truthy but has no maximum length check. The `content.substring(0, 200)` in `metadata.contentPreview` limits the preview, but the full `content` value ends up in the `description` field (truncated to 100 chars) AND the content is processed. A malicious client can send a multi-MB payload.

```typescript
const { recipientId, channel, content, leadId } = req.body;
if (!recipientId || !content) {
  throw new AppError('Recipient ID and content are required', 400);
}
// No length validation on content
```

**Fix:**
```typescript
if (typeof content !== 'string' || content.length > 10000) {
  throw new AppError('Message content must be a string of 10,000 characters or less', 400);
}
```

---

### H4. Lead Activity POST — No Validation on User-Supplied Description
**File:** `server/routes/leads.ts` lines 340–360  
**Category:** Data Integrity / Security  
**Impact:** `POST /api/leads/:id/activities` accepts `type`, `action`, and `description` from the request body with zero validation or sanitization. An attacker can:
1. Store arbitrary HTML/script payloads in `description` (stored XSS if rendered raw)
2. Send unlimited-length strings
3. Set `type` and `action` to any value, bypassing the activity categorization

```typescript
const { type, action, description } = req.body;
const activity = await prisma.activity.create({
  data: {
    type: type || 'lead',              // ← no enum validation
    action: action || 'note_added',    // ← no enum validation
    description: description || 'Activity logged', // ← no sanitize, no length limit
  },
});
```

**Fix:**
```typescript
import { sanitizeString, truncateString } from '../utils/sanitize';
const VALID_TYPES = ['lead', 'client', 'property', 'system', 'commission'];
const VALID_ACTIONS = ['note_added', 'call', 'email', 'meeting', 'status_changed', 'created', 'updated'];

if (type && !VALID_TYPES.includes(type)) throw new AppError('Invalid activity type', 400);
if (action && !VALID_ACTIONS.includes(action)) throw new AppError('Invalid activity action', 400);

const sanitizedDescription = truncateString(
  sanitizeString(typeof description === 'string' ? description.trim() : 'Activity logged'),
  2000
);
```

---

### H5. JWT Stored in localStorage — Vulnerable to XSS Token Theft
**File:** `src/utils/authFetch.ts` line 51 + `src/utils/safeStorage.ts`  
**Category:** Security Hardening  
**Impact:** JWT tokens are stored via `safeStorage.set('token', ...)` which uses `localStorage`. If any XSS vector exists (e.g., a future `dangerouslySetInnerHTML` or unescaped rendering), an attacker can steal the token with `localStorage.getItem('token')`. Industry best practice for session tokens is to use `httpOnly`, `Secure`, `SameSite=Strict` cookies that JavaScript cannot access.

```typescript
// authFetch.ts line 51
const token = safeStorage.get('token'); // reads from localStorage
```

**Fix (long-term):** Move JWT to a server-set `httpOnly` cookie:
```typescript
// Server: after login
res.cookie('authToken', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: JWT_EXPIRES_SECONDS * 1000,
});
```
**Short-term mitigation:** Ensure CSP blocks inline scripts and all rendered user content is sanitized.

---

## 🟡 MEDIUM FINDINGS

### M1. CRM Export Has Overly Large `take: 10000` Limits
**File:** `server/routes/crm.ts` lines 147–164  
**Category:** Data Integrity / API Robustness  
**Impact:** All four export entities (`leads`, `properties`, `agents`, `commissions`) use `take: 10000` or `take: 5000`. With complex includes, this can spike memory and response time (multi-second responses, potential OOM on large datasets).

```typescript
data = await prisma.lead.findMany({ include: { ... }, take: 10000 });
data = await prisma.property.findMany({ take: 10000 });
data = await prisma.commission.findMany({ include: { ... }, take: 10000 });
```

**Fix:** Add server-side pagination to the export endpoint:
```typescript
const page = Math.max(1, parseInt(req.query.page as string) || 1);
const limit = Math.min(500, parseInt(req.query.limit as string) || 200);
// ... use skip/take with proper pagination response
```

---

### M2. Hardcoded Phone Number in PropertyDetailModal Instead of Config.COMPANY
**File:** `src/shared/components/property/PropertyDetailModal.tsx` lines 66, 70, 76  
**Category:** Code Quality / Maintainability  
**Impact:** The phone number `971563616136` and email `info@whitecaves.ae` are hardcoded directly in the component instead of using the centralized `Config.COMPANY.WHATSAPP`, `Config.COMPANY.PHONE`, and `Config.COMPANY.EMAIL` from `src/config/constants.ts`. If the company number changes, this component won't be updated.

```typescript
window.open(`https://wa.me/971563616136?text=...`, '_blank');
window.open('tel:+971563616136', '_self');
window.open(`mailto:info@whitecaves.ae?subject=...`, '_self');
```

**Fix:**
```typescript
import { Config } from '../../../config/constants';
// ...
window.open(`https://wa.me/${Config.COMPANY.WHATSAPP}?text=...`, '_blank');
window.open(`tel:${Config.COMPANY.PHONE}`, '_self');
window.open(`mailto:${Config.COMPANY.EMAIL}?subject=...`, '_self');
```

---

### M3. Commission Payments — No Max Array Size on `commissionIds`
**File:** `server/routes/finance.ts` lines 270–295  
**Category:** Data Integrity / API Robustness  
**Impact:** `POST /api/finance/payments` validates that `commissionIds` is a non-empty array but has no maximum length. An attacker could send an array of 100k+ IDs causing a massive `WHERE id IN (...)` query.

```typescript
if (!Array.isArray(commissionIds) || commissionIds.length === 0) {
  throw new AppError('Provide an array of commission IDs', 400);
}
// No max length check
const result = await prisma.commission.updateMany({
  where: { id: { in: commissionIds }, ... },
```

**Fix:**
```typescript
if (!Array.isArray(commissionIds) || commissionIds.length === 0) {
  throw new AppError('Provide an array of commission IDs', 400);
}
if (commissionIds.length > 100) {
  throw new AppError('Maximum 100 commissions per batch payment', 400);
}
```

---

### M4. Agent Commissions Endpoint — No Validation on Status Filter
**File:** `server/routes/agents.ts` lines 222–224  
**Category:** Data Integrity  
**Impact:** `GET /api/agents/:id/commissions?status=xyz` passes the user-supplied `status` directly to Prisma `where` clause without validating against allowed values. While not a SQL injection risk (Prisma parameterizes), it produces confusing empty results with no feedback.

```typescript
const where: Record<string, unknown> = { agentId: req.params.id };
if (status) where.status = status as string; // ← No validation
```

**Fix:**
```typescript
const VALID_STATUSES = ['pending', 'approved', 'paid'];
if (status && !VALID_STATUSES.includes(status as string)) {
  throw new AppError(`Invalid status filter. Allowed: ${VALID_STATUSES.join(', ')}`, 400);
}
if (status) where.status = status as string;
```

---

### M5. 2FA Bypass in Development — Hardcoded Code `000000`
**File:** `server/routes/auth.ts` lines 207–208  
**Category:** Security Hardening  
**Impact:** The `POST /api/auth/verify-2fa` endpoint accepts code `"000000"` in any non-production environment. If `NODE_ENV` is accidentally misconfigured (e.g., `staging` instead of `production`), the bypass is active. The condition should check for `development` explicitly, not `!== 'production'`.

```typescript
if (process.env.NODE_ENV !== 'production' && code === '000000') {
```

**Fix:**
```typescript
if (process.env.NODE_ENV === 'development' && code === '000000') {
```

---

### M6. Missing `loading="lazy"` on Several Images
**File:** Multiple components  
**Category:** UX & Frontend Quality  
**Impact:** Several `<img>` tags are missing `loading="lazy"`, causing unnecessary above-the-fold resource loading:

| File | Line | Description |
|------|------|-------------|
| `VirtualTourGallery.tsx` | 253 | Selected tour thumbnail (detail view) |
| `shared/components/dashboard/UniversalDashboardLayout.tsx` | 110 | Profile avatar |
| `components/ui/Card/Card.tsx` | 187, 231 | Card images and avatars |
| `NewsletterSubscription.tsx` | 98–100 | Subscriber avatars (Unsplash URLs) |
| `components/common/DataCard.tsx` | 115 | Card avatar images |

**Fix:** Add `loading="lazy"` to all non-above-the-fold images.

---

## 🔵 LOW FINDINGS

### L1. Property Update Route Accepts `price: 0` (Zero-Value Properties)
**File:** `server/routes/properties.ts` line 237  
**Category:** Runtime Edge Case  
**Impact:** The PATCH route validates that price is `Number.isFinite` and `>= 0`, allowing `price: 0`. While intentional for off-market listings, zero-price properties could break financial calculations downstream (conversion rates, average deal sizes, portfolio value).

```typescript
if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
```

**Fix:** Consider enforcing `parsedPrice > 0` or adding a `status: 'off_market'` requirement for zero-price entries.

---

### L2. Properties Detail Endpoint Returns Full Commission Data
**File:** `server/routes/properties.ts` line 134  
**Category:** Data Integrity  
**Impact:** `GET /api/properties/:id` includes `commissions: true` with no `select` clause, which returns all commission fields including `amount`, `notes`, internal `status` to any authenticated user — not just finance/admin roles.

```typescript
commissions: true, // ← returns all fields to any authenticated user
```

**Fix:**
```typescript
commissions: {
  select: { id: true, amount: true, status: true, type: true },
  take: 10,
  orderBy: { createdAt: 'desc' },
},
```

---

### L3. `formatPrice` Function Shadowed Inside PropertyDetailModal
**File:** `src/shared/components/property/PropertyDetailModal.tsx` lines 9, 58  
**Category:** Code Quality  
**Impact:** The component imports `formatPrice` from `../../../utils` on line 9, then declares a local `formatPrice` function on line 58 that shadows the import. This is dead import code and violates DRY — the local version has Dubai-specific formatting that may diverge from the shared utility.

```typescript
import { formatPrice } from '../../../utils';  // ← imported but shadowed
// ...
const formatPrice = (price: number, priceType?: string): string => { // ← shadows import
```

**Fix:** Remove the unused import or refactor the shared `formatPrice` to accept `priceType`.

---

### L4. Inconsistent Pagination Utility Usage
**File:** Multiple server routes  
**Category:** Code Quality / Maintainability  
**Impact:** Routes `leads.ts`, `transactions.ts`, and `properties.ts` use the centralized `parsePagination()` utility from `server/config/pagination`, while `agents.ts`, `tenants.ts`, `communications.ts`, `compliance.ts`, and `reporting.ts` manually parse `page`/`pageSize` with inline `Math.max`/`Math.min`. This creates inconsistent behavior and duplicated pagination logic.

```typescript
// agents.ts — manual parsing
const pageNum = Math.max(1, parseInt(page as string) || 1);
const limit = Math.min(100, Math.max(1, parseInt(pageSize as string) || 50));

// leads.ts — centralized utility
const { page: pageNum, limit, skip } = parsePagination({ page: ..., limit: ... });
```

**Fix:** Refactor all routes to use `parsePagination()` for consistency.

---

## SUMMARY TABLE

| # | Severity | Category | File | Issue |
|---|----------|----------|------|-------|
| C1 | 🔴 CRITICAL | Security | `server/index.ts:176` | Webhook secret timing-attack vulnerable |
| C2 | 🔴 CRITICAL | Security | `server/routes/auth.ts:330` | Firebase-sync accepts unverified tokens in prod |
| C3 | 🔴 CRITICAL | Data Integrity | `server/routes/crm.ts:147` | CRM export leaks full lead records + 10K row pull |
| H1 | 🟠 HIGH | Security | `server/routes/auth.ts:272` | Profile PATCH — no sanitization or length limits |
| H2 | 🟠 HIGH | Security | `server/routes/tenants.ts:89` | Tenant create/update — no input sanitization |
| H3 | 🟠 HIGH | Data Integrity | `server/routes/communications.ts:15` | No content length limit on message send |
| H4 | 🟠 HIGH | Security | `server/routes/leads.ts:340` | Activity POST — unsanitized description stored |
| H5 | 🟠 HIGH | Security | `src/utils/authFetch.ts:51` | JWT in localStorage (XSS theft risk) |
| M1 | 🟡 MEDIUM | Performance | `server/routes/crm.ts:147` | Export routes: unbounded 10K row queries |
| M2 | 🟡 MEDIUM | Code Quality | `PropertyDetailModal.tsx:66` | Hardcoded phone/email instead of Config |
| M3 | 🟡 MEDIUM | Data Integrity | `server/routes/finance.ts:270` | No max array size on bulk payment IDs |
| M4 | 🟡 MEDIUM | Data Integrity | `server/routes/agents.ts:222` | No validation on commission status filter |
| M5 | 🟡 MEDIUM | Security | `server/routes/auth.ts:207` | 2FA bypass active in all non-production envs |
| M6 | 🟡 MEDIUM | UX | Multiple | Missing `loading="lazy"` on several images |
| L1 | 🔵 LOW | Edge Case | `server/routes/properties.ts:237` | Allows price: 0 properties |
| L2 | 🔵 LOW | Data Integrity | `server/routes/properties.ts:134` | Property detail returns full commission data |
| L3 | 🔵 LOW | Code Quality | `PropertyDetailModal.tsx:9` | Shadowed `formatPrice` import (dead code) |
| L4 | 🔵 LOW | Code Quality | Multiple server routes | Inconsistent pagination utility usage |

---

## RECOMMENDED FIX ORDER

1. **C2** — Firebase-sync: Disable in production immediately (1 line change, blocks account takeover)
2. **C1** — Webhook timing attack: Add `timingSafeEqual` (5 min fix)
3. **C3** — CRM export: Add `select` whitelist + pagination (15 min fix)
4. **H1** — Auth profile sanitization (10 min fix)
5. **H2** — Tenant sanitization (10 min fix)
6. **H4** — Activity description validation (10 min fix)
7. **H3** — Communications content length (5 min fix)
8. **M5** — 2FA bypass env check (1 line change)
9. **M3** — Bulk payment array cap (2 min fix)
10. **M4** — Commission status filter validation (5 min fix)
11. **M2** — Hardcoded contact info (5 min fix)
12. **H5** — JWT in httpOnly cookie (larger refactor - plan for future sprint)
13. **M1, M6, L1–L4** — Address in next cleanup pass

**Estimated total fix time (C1–M5):** ~75 minutes

---

*End of Audit Round 69*
