# Wave 16 — Security Hardening: API v1 Migration + CSRF Strategy

<!-- markdownlint-disable MD060 -->

**Drafted by:** @S5  
**Model:** Gemini 2.0 Flash  
**Status:** ✅ READY (retrospective spec for implemented Wave 16)  
**Last Updated:** 2026-05-25  
**Next Review:** 2026-08-21  
**Source of Truth:** CRM Wave 16 security hardening feature specification (business layer)

## Canonical governance links

- [`../05_requirements/functional-requirements.md`](../05_requirements/functional-requirements.md)
- [`../05_requirements/non-functional-requirements.md`](../05_requirements/non-functional-requirements.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)

## Feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- frontend auth/session/security-resilience lanes in `docs/plans/waves/WAVE_39_*` and `WAVE_40_*`

CONSUMES←@Radia: `business_docs/05_requirements/compliance-requirements.md#security`  
FEEDS→@Katherine: `business_docs/05_requirements/non-functional-requirements.md#security-hardening`  
FEEDS_ACK←@Katherine: accepted | `business_docs/09_crm_features/wave-16-security-hardening.md`

---

## 1. Overview

Wave 16 delivers two critical security/architecture improvements:

1. **API Versioning (`/api/v1`)** — Compatibility layer that prefixes all CRM routes with `/api/v1` while preserving existing `/api` routes for backwards compatibility
2. **CSRF Protection** — Double-submit cookie pattern for all state-changing requests
3. **AppError Envelope Hardening** — Standardised error response format across all routes

---

## 2. API Versioning (`server/middleware/apiVersioning.ts`)

### 2.1 Strategy

All existing `/api` routes continue to work unchanged. A new `/api/v1` prefix is added via a versioning middleware that rewrites the URL before routing:

```typescript
// /api/v1/leads → /api/leads (internal rewrite)
app.use('/api/v1', (req, res, next) => {
  req.url = req.url; // routes mounted directly under /api/v1
  next();
});
```

Route files are registered at both paths:

```typescript
app.use('/api/leads', leadsRouter);
app.use('/api/v1/leads', leadsRouter); // same router, second mount
```

### 2.2 Version Header

All API responses include:

```http
X-API-Version: 1
```

### 2.3 Deprecation Path

- `/api` (unversioned) → maintained through Wave 18; deprecated in Wave 19
- `/api/v1` → current canonical API version
- `/api/v2` → future (not yet defined)

### 2.4 Client Migration

Frontend API calls use the `authFetch` utility, which is configured via:

```typescript
// src/utils/authFetch.ts
const API_VERSION = import.meta.env.VITE_API_VERSION ?? 'v1';
const BASE_URL = `/api/${API_VERSION}`;
```

Setting `VITE_API_VERSION=v1` in `.env` migrates all frontend calls to `/api/v1/*`.

---

## 3. CSRF Protection (`server/middleware/csrf.ts`)

### 3.1 Pattern: Double-Submit Cookie

```text
1. On GET /api/csrf-token:
   → Server sets HttpOnly cookie `csrf-token={random-token}`
   → Server returns { csrfToken: "{random-token}" } in JSON body

2. On POST/PUT/PATCH/DELETE:
   → Client reads csrfToken from prior GET response
   → Client sends token in X-CSRF-Token request header
   → Server compares header value vs cookie value
   → Mismatch → 403 Forbidden
```

### 3.2 Token Generation

```typescript
import crypto from 'crypto';
const generateCsrfToken = () => crypto.randomBytes(32).toString('hex');
```

Tokens are 64-character hex strings, single-use (regenerated per form session) or session-tied.

### 3.3 CSRF Exempt Routes

The following routes are CSRF-exempt (read-only or have their own auth mechanism):

| Route                     | Reason                                       |
| ------------------------- | -------------------------------------------- |
| `GET /*`                  | Read-only; no state mutation                 |
| `/api/auth/firebase-sync` | Bearer token auth (no cookie state)          |
| `/api/webhooks/*`         | Webhook signature validation (separate HMAC) |
| `/api/health`             | Public health check                          |

### 3.4 Frontend Integration

```typescript
// On app init (App.tsx)
const { csrfToken } = await fetch('/api/csrf-token').then((r) => r.json());

// In authFetch
headers: {
  Authorization: `Bearer ${jwt}`,
  'X-CSRF-Token': csrfToken,
}
```

The `csrfToken` is stored in Redux state (not localStorage) and rotated on each new session.

---

## 4. AppError Envelope Hardening

### 4.1 Standard Error Response Shape

All API errors — validation failures, auth errors, not-found, 500s — return this exact envelope:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "statusCode": 400,
    "requestId": "req_abc123"
  }
}
```

### 4.2 AppError Class

```typescript
class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string,
    public isOperational = true
  ) {
    super(message);
  }
}
```

`isOperational = true` → safe to expose message to client  
`isOperational = false` → internal error; generic `"Internal server error"` returned to client

### 4.3 Error Code Registry

| Code               | Status | Meaning                                |
| ------------------ | ------ | -------------------------------------- |
| `VALIDATION_ERROR` | 400    | Input validation failed                |
| `UNAUTHENTICATED`  | 401    | Missing or invalid token               |
| `FORBIDDEN`        | 403    | Insufficient role / CSRF violation     |
| `NOT_FOUND`        | 404    | Entity does not exist                  |
| `CONFLICT`         | 409    | Duplicate entity / scheduling conflict |
| `RATE_LIMITED`     | 429    | Too many requests                      |
| `INTERNAL_ERROR`   | 500    | Unhandled server exception             |
| `CSRF_VIOLATION`   | 403    | CSRF token mismatch                    |

---

## 5. Content Security Policy (CSP)

Managed by `server/middleware/csp.ts`. Key directives:

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-{nonce}';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https://maps.googleapis.com;
  connect-src 'self' wss: https://api.exchangerate-api.com;
  frame-ancestors 'none';
  upgrade-insecure-requests;
```

---

## 6. Rate Limiting

| Endpoint Group     | Limit   | Window | Middleware                     |
| ------------------ | ------- | ------ | ------------------------------ |
| `/api/auth/*`      | 10 req  | 15 min | `rateLimiter.ts` (strict)      |
| `/api/*` (general) | 100 req | 1 min  | `rateLimiter.ts` (standard)    |
| `/api/ai/*`        | 20 req  | 1 min  | `rateLimiter.ts` (AI-specific) |
| Public routes      | 30 req  | 1 min  | `rateLimiter.ts` (public)      |

---

## 7. Acceptance Criteria

### API Versioning

- [x] `/api/v1/{route}` responds identically to `/api/{route}`
- [x] `X-API-Version: 1` header present on all API responses
- [x] Frontend `authFetch` reads `VITE_API_VERSION` env var

### CSRF

- [x] `GET /api/csrf-token` returns token and sets cookie
- [x] POST/PUT/PATCH/DELETE without valid CSRF header returns `403`
- [x] Webhook routes exempt from CSRF check
- [x] Firebase sync route exempt from CSRF check

### AppError Envelope

- [x] All errors return `{ success: false, error: { code, message, statusCode, requestId } }`
- [x] Non-operational errors expose generic message only
- [x] `requestId` present in all error responses (from `requestId.ts` middleware)

### CSP

- [x] CSP header present on all HTML responses
- [x] `frame-ancestors 'none'` prevents clickjacking
- [x] `upgrade-insecure-requests` enforces HTTPS
