# Security Architecture — White Caves Real Estate CRM

> **Last Updated:** April 2026
> **Version:** 1.0
> **Classification:** Internal — Confidential
> **Document Owner:** Security Officer / Engineering Lead
> **Review Cadence:** Quarterly

---

## 1. Security Overview

White Caves implements a defense-in-depth security architecture protecting sensitive real estate data, financial transactions, and personal information for the Dubai property market. The platform handles data subject to UAE Personal Data Protection Law (PDPL) and RERA regulatory requirements.

### Security Principles

1. **Least Privilege** — Users and services receive minimum required permissions
2. **Defense in Depth** — Multiple overlapping security layers
3. **Zero Trust** — Verify every request regardless of origin
4. **Secure by Default** — New features ship with security controls enabled
5. **Audit Everything** — All state changes are logged in the Activity model

---

## 2. Authentication Architecture

### 2.1 Authentication Flow

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐
│  Client   │────▶│  Express API │────▶│   MongoDB    │
│  (React)  │     │              │     │  (User doc)  │
└──────────┘     └──────┬───────┘     └──────────────┘
     │                   │
     │            ┌──────┴───────┐
     │            │  JWT Token   │
     │            │  Generation  │
     │            └──────────────┘
     │
     │  Social Auth
     ▼
┌──────────┐
│ Firebase  │
│   Auth    │
│ (Google,  │
│  Apple,   │
│  Phone)   │
└──────────┘
```

### 2.2 Local Authentication (Email/Password)

| Step | Description | Security Measure |
|------|-------------|-----------------|
| 1. Registration | User submits email + password | Rate limited: 3 attempts/hour |
| 2. Password hashing | bcrypt with 12 salt rounds | Constant-time comparison |
| 3. User creation | Store hashed password in MongoDB | Password never stored in plaintext |
| 4. Login | Verify credentials | Rate limited: 5 attempts/15 min |
| 5. JWT issuance | Sign token with `JWT_SECRET` (≥ 32 chars) | 7-day expiry |
| 6. Token refresh | Not yet implemented | Planned: refresh token rotation |

### 2.3 Firebase Social Authentication

| Provider | Method | Status |
|----------|--------|--------|
| Google | OAuth 2.0 via Firebase | Configured |
| Apple | Sign in with Apple via Firebase | Configured |
| Phone | SMS OTP via Firebase | Configured |
| Facebook | OAuth 2.0 via Firebase | Planned |

**Firebase Sync Flow:**

1. Client authenticates with Firebase
2. Client sends Firebase ID token to `/api/auth/firebase-sync`
3. Server verifies Firebase token (planned: firebase-admin SDK)
4. Server creates/updates local User record with `firebaseUid`
5. Server issues local JWT for subsequent API calls

### 2.4 JWT Token Structure

```json
{
  "userId": "ObjectId",
  "email": "user@example.com",
  "role": "agent",
  "iat": 1711670400,
  "exp": 1712275200
}
```

- **Algorithm:** HS256
- **Secret:** Minimum 32 characters, environment variable
- **Expiry:** 7 days
- **Transport:** `Authorization: Bearer <token>` header
- **Storage (client):** localStorage (planned migration to httpOnly cookies)

---

## 3. Role-Based Access Control (RBAC)

### 3.1 Role Hierarchy

| Role | Level | Description | User Type |
|------|-------|-------------|-----------|
| `owner` | 100 | Full system access | Business owner |
| `manager` | 90 | Management operations | Sales/branch managers |
| `admin` | 80 | Administrative functions | System administrators |
| `finance` | 70 | Financial operations | Finance officers |
| `agent` | 50 | Sales operations | Sales agents |
| `secondary-sales-agent` | 50 | Secondary sales | Affiliated agents |
| `leasing-agent` | 50 | Leasing operations | Leasing specialists |
| `landlord` | 30 | Property management | Property owners |
| `seller` | 20 | Listing management | Developers, sellers |
| `viewer` | 10 | Read-only access | Consultants |
| `tenant` | 10 | Tenant portal | Tenants |
| `buyer` | 10 | Buyer portal | Buyers, investors |

### 3.2 Role-to-Frontend Alias Mapping

The system supports 22 frontend role labels that map to 12 backend canonical roles:

| Frontend Role | Backend Role |
|--------------|-------------|
| Managing Director | `owner` |
| Sales Manager | `manager` |
| Branch Manager | `manager` |
| Property Management Company | `manager` |
| Sales Agent | `agent` |
| Affiliated Agent | `secondary-sales-agent` |
| Property Consultant | `viewer` |
| Mortgage Consultant | `viewer` |
| Trustee Officer | `admin` |
| Finance Officer | `finance` |
| Developer | `seller` |
| Investor | `buyer` |

### 3.3 Permission Matrix

| Permission | owner | manager | admin | finance | agent | landlord | viewer |
|-----------|:-----:|:-------:|:-----:|:-------:|:-----:|:--------:|:------:|
| `view_dashboard` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `edit_profile` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `view_properties` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `create_property` | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `edit_property` | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| `delete_property` | ✅ | ✅ | ✅ | — | — | — | — |
| `view_leads` | ✅ | ✅ | ✅ | — | ✅ | — | — |
| `manage_leads` | ✅ | ✅ | ✅ | — | ✅ | — | — |
| `view_contracts` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| `create_contracts` | ✅ | ✅ | ✅ | — | ✅ | — | — |
| `sign_contracts` | ✅ | ✅ | — | — | — | ✅ | — |
| `view_payments` | ✅ | ✅ | ✅ | ✅ | — | ✅ | — |
| `process_payments` | ✅ | ✅ | — | ✅ | — | — | — |
| `view_analytics` | ✅ | ✅ | ✅ | ✅ | — | — | — |
| `view_system_health` | ✅ | ✅ | ✅ | — | — | — | — |
| `manage_users` | ✅ | ✅ | ✅ | — | — | — | — |
| `manage_agents` | ✅ | ✅ | — | — | — | — | — |
| `access_whatsapp_business` | ✅ | ✅ | ✅ | — | ✅ | — | — |
| `configure_chatbot` | ✅ | ✅ | ✅ | — | — | — | — |
| `view_all_reports` | ✅ | ✅ | ✅ | ✅ | — | — | — |
| `modify_settings` | ✅ | ✅ | ✅ | — | — | — | — |

### 3.4 RBAC Middleware Functions

| Function | Purpose | Example |
|----------|---------|---------|
| `requireRole(...roles)` | Restrict to specific roles | `requireRole('owner', 'manager')` |
| `requirePermission(...perms)` | Require any listed permission | `requirePermission('view_leads')` |
| `requireAllPermissions(...perms)` | Require all listed permissions | `requireAllPermissions('view_payments', 'process_payments')` |
| `requireMinRole(role)` | Hierarchical role check | `requireMinRole('manager')` — allows manager+ |
| `scopeToOwn(field)` | Row-level security | Agents see own data; managers see all |

---

## 4. API Security

### 4.1 Rate Limiting

| Limiter | Limit | Window | Applied To |
|---------|-------|--------|-----------|
| `authLimiter` | 5 requests | 15 minutes | `/api/auth/login` |
| `registerLimiter` | 3 requests | 1 hour | `/api/auth/register` |
| `passwordLimiter` | 5 requests | 1 hour | `/api/auth/reset-password` |
| `apiLimiter` | 100 requests | 60 seconds | All `/api/*` endpoints |
| `strictLimiter` | 10 requests | 15 minutes | 2FA, exports, bulk operations |

Implementation: `express-rate-limit` with in-memory store (planned: Redis store for multi-instance).

### 4.2 Security Headers (Helmet)

| Header | Value | Purpose |
|--------|-------|---------|
| `Content-Security-Policy` | Script/style/connect directives for Firebase, Stripe | XSS prevention |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Force HTTPS (2-year HSTS) |
| `X-Content-Type-Options` | `nosniff` | MIME sniffing prevention |
| `X-Frame-Options` | `SAMEORIGIN` | Clickjacking prevention |
| `X-XSS-Protection` | `0` | Disable legacy XSS filter (CSP preferred) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Referrer leakage control |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(self), payment=(self)` | Feature restriction |

### 4.3 CORS Configuration

```
Allowed Origins: Configured via CORS_ORIGIN environment variable (comma-separated)
Credentials:     Enabled (cookies allowed)
Methods:         GET, POST, PUT, PATCH, DELETE, OPTIONS
Headers:         Content-Type, Authorization
Development:     localhost origins auto-allowed
Production:      Strict whitelist only
```

### 4.4 Request Validation

| Layer | Implementation | Coverage |
|-------|---------------|----------|
| **Body size limit** | `express.json({ limit: '1mb' })` | All endpoints |
| **Content-Type** | `express.json()` middleware | JSON enforcement |
| **Parameter validation** | Application-level checks | Route handlers |
| **Schema validation** | Prisma model constraints | Database layer |
| **File upload validation** | Size + type checks | Upload endpoints |

### 4.5 Webhook Security

WhatsApp webhook endpoints verify request authenticity:

```typescript
// Timing-safe signature comparison prevents timing attacks
const expectedSignature = crypto
  .createHmac('sha256', WEBHOOK_SECRET)
  .update(rawBody)
  .digest('hex');

if (!crypto.timingSafeEqual(
  Buffer.from(signature),
  Buffer.from(expectedSignature)
)) {
  throw new AppError('Invalid webhook signature', 403);
}
```

---

## 5. Data Encryption

### 5.1 Encryption at Rest

| Data Store | Encryption | Key Management |
|-----------|-----------|---------------|
| **MongoDB Atlas** | AES-256 (automatic) | Atlas-managed keys |
| **Redis** | Disk encryption (host-level) | Provider-managed |
| **Vercel** | AES-256 (platform) | Vercel-managed |
| **Backups** | AES-256 (Atlas) | Atlas-managed |
| **Environment variables** | Encrypted secrets | Vercel / K8s Sealed Secrets |

### 5.2 Encryption in Transit

| Connection | Protocol | Minimum Version |
|-----------|----------|----------------|
| Client → API | HTTPS (TLS) | TLS 1.2 |
| API → MongoDB | TLS | TLS 1.2 |
| API → Redis | TLS | TLS 1.2 (production) |
| API → Firebase | HTTPS | TLS 1.2 |
| API → Stripe | HTTPS | TLS 1.2 |
| API → WhatsApp | HTTPS | TLS 1.2 |
| Nginx → API | Internal TLS | TLS 1.2 |

### 5.3 Sensitive Data Handling

| Data Type | Storage | Protection |
|-----------|---------|-----------|
| Passwords | MongoDB (`passwordHash`) | bcrypt, 12 salt rounds |
| JWT secret | Environment variable | Never in code; ≥ 32 characters |
| API keys | Environment variables | Platform-encrypted secrets |
| Emirates ID | MongoDB (`emiratesId`) | Application-level access control |
| Financial data | MongoDB | RBAC restriction (finance+ roles) |
| WhatsApp messages | MongoDB | Conversation-level access control |

---

## 6. OWASP Top 10 Mitigation

| # | Vulnerability | Mitigation | Status |
|---|--------------|-----------|--------|
| A01 | **Broken Access Control** | RBAC middleware with 12 roles, 45+ permissions; `scopeToOwn` for row-level security | ✅ Implemented |
| A02 | **Cryptographic Failures** | TLS 1.2+ everywhere; bcrypt for passwords; AES-256 at rest | ✅ Implemented |
| A03 | **Injection** | Prisma ORM (parameterized queries); no raw SQL; MongoDB driver escaping | ✅ Implemented |
| A04 | **Insecure Design** | Threat modeling per feature; security review in PR process | ✅ Process |
| A05 | **Security Misconfiguration** | Helmet headers; CORS whitelist; environment-specific configs; no default credentials | ✅ Implemented |
| A06 | **Vulnerable Components** | npm audit in CI; Dependabot alerts; quarterly dependency review | ✅ Automated |
| A07 | **Authentication Failures** | Rate limiting on auth endpoints; bcrypt; JWT expiry; Firebase MFA | ✅ Implemented |
| A08 | **Data Integrity Failures** | Webhook signature verification; HTTPS-only; CSP headers | ✅ Implemented |
| A09 | **Logging & Monitoring** | Structured logging (Morgan + custom); Activity model audit trail; health checks | ✅ Implemented |
| A10 | **SSRF** | No user-controlled URL fetching; outbound network policy (K8s) | ✅ Mitigated |

---

## 7. UAE PDPL Compliance

The UAE Personal Data Protection Law (Federal Decree-Law No. 45 of 2021) imposes specific obligations on processing personal data within the UAE.

### 7.1 Compliance Measures

| PDPL Requirement | Implementation |
|-----------------|---------------|
| **Lawful basis for processing** | Consent captured at registration; contractual necessity for transactions |
| **Purpose limitation** | Data used only for stated CRM purposes; no secondary processing without consent |
| **Data minimization** | Only collect required fields; optional fields clearly marked in schema |
| **Storage limitation** | Retention policies defined per data type (see Database Architecture doc) |
| **Data subject rights** | Account deletion endpoint; data export capability; profile editing |
| **Cross-border transfer** | MongoDB Atlas hosted in ME-South-1 (Bahrain) — GCC region |
| **Data breach notification** | Incident response procedure includes 72-hour regulatory notification |
| **Data Protection Officer** | Designated within organization |
| **Privacy by design** | RBAC, encryption, access logging built into architecture |
| **Consent management** | Cookie consent banner; marketing opt-in/opt-out |

### 7.2 Data Processing Register

| Processing Activity | Data Categories | Legal Basis | Retention |
|-------------------|----------------|------------|-----------|
| User registration | Name, email, phone | Contractual necessity | Account lifetime + 2 years |
| Property listings | Address, price, images | Legitimate interest | Listing lifetime + 2 years |
| Lead management | Name, email, phone, budget | Consent + legitimate interest | Pipeline lifetime + 2 years |
| Transaction records | Financial data, parties | Legal obligation (UAE Commercial Law) | 7 years |
| WhatsApp conversations | Phone number, messages | Consent | 2 years |
| Analytics | Anonymized usage data | Legitimate interest | Indefinite (anonymized) |

### 7.3 RERA Compliance Integration

| Requirement | Implementation |
|------------|---------------|
| Agent licensing tracking | User model with role and status fields |
| Commission disclosure | Commission model with full audit trail |
| Transaction transparency | Transaction model with status workflow |
| DLD fee tracking | Transaction and Commission models |
| Compliance health monitoring | `/api/compliance/health` endpoint |

---

## 8. Penetration Testing

### 8.1 Testing Schedule

| Test Type | Frequency | Scope | Provider |
|-----------|-----------|-------|----------|
| **Automated vulnerability scan** | Weekly | Full application | Automated (npm audit, OWASP ZAP) |
| **API security assessment** | Quarterly | All API endpoints | Internal security team |
| **Full penetration test** | Annually | Infrastructure + application | External certified firm |
| **Social engineering assessment** | Annually | Staff awareness | External provider |
| **Code security review** | Per PR | Changed files | Automated (CodeQL) + peer review |

### 8.2 Testing Methodology

1. **Reconnaissance:** Map all API endpoints, authentication flows, and data flows
2. **Authentication testing:** Brute force protection, token manipulation, session management
3. **Authorization testing:** RBAC bypass attempts, privilege escalation, IDOR
4. **Input validation:** SQL/NoSQL injection, XSS, command injection, file upload abuse
5. **Business logic:** Rate limit bypass, workflow manipulation, race conditions
6. **Infrastructure:** TLS configuration, header analysis, information disclosure
7. **Reporting:** Findings classified by CVSS score; remediation timeline agreed

### 8.3 Vulnerability Response SLA

| CVSS Score | Severity | Response Time | Fix Deadline |
|-----------|----------|--------------|-------------|
| 9.0–10.0 | Critical | 4 hours | 24 hours |
| 7.0–8.9 | High | 24 hours | 7 days |
| 4.0–6.9 | Medium | 72 hours | 30 days |
| 0.1–3.9 | Low | 1 week | 90 days |

---

## 9. Security Incident Response

### 9.1 Incident Classification

| Category | Description | Example |
|----------|-------------|---------|
| **Data Breach** | Unauthorized data access or exfiltration | Database credential leak |
| **Account Compromise** | Unauthorized account access | Stolen JWT token |
| **Service Attack** | DoS/DDoS or exploitation attempt | Rate limit bypass |
| **Malware** | Malicious code in supply chain | Compromised npm package |
| **Insider Threat** | Unauthorized internal access | Employee accessing unauthorized data |

### 9.2 Response Procedure

```
1. DETECT    → Monitoring alert or user report
2. TRIAGE    → Classify severity (P1–P4)
3. CONTAIN   → Isolate affected systems; revoke compromised credentials
4. ERADICATE → Remove threat; patch vulnerability
5. RECOVER   → Restore services; verify integrity
6. REVIEW    → Post-incident analysis; update procedures
7. NOTIFY    → Regulatory notification if required (72 hours for PDPL)
```

### 9.3 Immediate Containment Actions

| Threat | Containment Action |
|--------|-------------------|
| Compromised JWT secret | Rotate `JWT_SECRET`; all sessions invalidated |
| Database credential leak | Rotate MongoDB password; review Atlas access logs |
| API key exposure | Revoke and rotate affected API keys |
| XSS vulnerability | Deploy CSP fix; purge CDN cache |
| Unauthorized admin access | Disable account; audit all actions via Activity log |
| WhatsApp session hijack | Disconnect Linda session; re-authenticate |

---

## 10. Security Monitoring

### 10.1 Security-Specific Alerts

| Alert | Condition | Action |
|-------|-----------|--------|
| **Brute force detected** | > 10 failed logins from same IP in 5 min | Block IP; notify security |
| **Privilege escalation attempt** | RBAC middleware rejects role-restricted request | Log and monitor pattern |
| **Unusual data access** | Agent queries data outside their scope | Review Activity log |
| **Token anomaly** | JWT used from unexpected geography | Flag for review |
| **Dependency vulnerability** | npm audit reports critical CVE | Patch within 24 hours |
| **Rate limit breach** | Sustained rate limit hits from single source | Temporary IP ban |

### 10.2 Audit Trail

All state-changing operations are recorded in the `Activity` collection:

```json
{
  "type": "system",
  "action": "status_changed",
  "description": "User role changed from agent to manager",
  "metadata": {
    "previousRole": "agent",
    "newRole": "manager",
    "changedBy": "owner_user_id"
  },
  "userId": "affected_user_id",
  "createdAt": "2026-04-01T10:30:00Z"
}
```

---

## 11. Secrets Management

### 11.1 Required Secrets

| Secret | Storage | Rotation Frequency |
|--------|---------|-------------------|
| `JWT_SECRET` | Vercel / K8s Secret | Quarterly |
| `DATABASE_URL` | Vercel / K8s Secret | On credential rotation |
| `REDIS_PASSWORD` | Vercel / K8s Secret | Quarterly |
| `FIREBASE_*` | Vercel / K8s Secret | Annually (key rotation) |
| `STRIPE_SECRET_KEY` | Vercel / K8s Secret | Annually |
| `WHATSAPP_VERIFY_TOKEN` | Vercel / K8s Secret | On compromise |
| `SMTP_PASSWORD` | Vercel / K8s Secret | Quarterly |

### 11.2 Secret Hygiene Rules

1. **Never commit secrets to Git** — use `.env` files (gitignored) for development
2. **Minimum secret length:** JWT_SECRET ≥ 32 characters
3. **Validate on startup:** Application refuses to start if required secrets are missing
4. **No default secrets:** Development and production use different secret values
5. **Log redaction:** Secrets are never included in log output
6. **Access restriction:** Only Engineering Lead and DevOps have production secret access

---

---

## 12. JWT Token Rotation & Session Policy

### 12.1 Current Token Configuration

| Parameter | Current Value | Target Value | Notes |
|-----------|--------------|-------------|-------|
| Algorithm | HS256 | **RS256** (target) | Asymmetric signing for multi-service trust |
| Expiry | 7 days | **15 minutes** (access) + **7 days** (refresh) | Rotate frequently for AML compliance |
| Secret length | ≥ 32 chars | ≥ 64 chars | Increase entropy |
| Storage (client) | localStorage | **httpOnly cookie** (target) | Eliminate XSS token theft vector |
| Refresh token | Not implemented | **Implemented** (see below) | Required for short-lived access tokens |

### 12.2 Token Rotation Policy

**Immediate (current state):**
- Access token expiry: **7 days** (stored in localStorage)
- No refresh token rotation

**Target state (implement by Q3 2026):**

```
ACCESS TOKEN:  15-minute expiry, RS256, httpOnly cookie (SameSite=Strict)
REFRESH TOKEN: 7-day expiry, stored in httpOnly cookie, single-use (rotate on use)
ROTATION:      On every refresh → issue new access + refresh token pair
REVOCATION:    Refresh token stored in Redis; DELETE on logout / revoke
FAMILY:        Refresh token families tracked; reuse detection → full family revoke
```

**Token rotation flow:**

```
Client                     API                      Redis
  │                          │                        │
  │── POST /auth/refresh ───▶│                        │
  │   (sends refresh token)  │── EXISTS refresh_id?──▶│
  │                          │◀── YES / NO ───────────│
  │                          │ if NO → 401 + revoke family
  │                          │── DEL old_refresh_id ─▶│
  │                          │── SET new_refresh_id ──▶│ (TTL: 7 days)
  │◀── 200 new token pair ───│                        │
```

### 12.3 JWT Invalidation on Security Events

| Security Event | Action | Timeline |
|---------------|--------|----------|
| User password change | Invalidate all refresh tokens for user | Immediate |
| Admin suspends user | Invalidate all tokens for user | Immediate |
| JWT_SECRET rotation (quarterly) | All sessions invalidated | Coordinated with users |
| Detected token reuse | Invalidate entire refresh token family | Immediate |
| User-initiated logout | Invalidate single refresh token | Immediate |
| Data breach detected | Rotate JWT_SECRET; invalidate all sessions | Emergency: < 1 hour |

**Acceptance Criteria:**
- [ ] Access token expiry ≤ 15 minutes (after migration from 7-day tokens)
- [ ] Refresh tokens stored in httpOnly cookies, never in localStorage
- [ ] Token reuse detection implemented: second use of same refresh token → full family revoke + security alert
- [ ] JWT_SECRET rotation procedure documented in runbook; tested quarterly
- [ ] `Authorization` header never logged in application logs (redacted)

---

## 13. Extended OWASP Top 10 Mitigation Matrix

The following expands on Section 6 with detailed implementation notes, test scenarios, and acceptance criteria per vulnerability class.

| # | Vulnerability | Threat | Primary Mitigations | Secondary Mitigations | Test Scenario | Acceptance Criteria |
|---|--------------|--------|--------------------|-----------------------|---------------|---------------------|
| A01 | **Broken Access Control** | Agent reads another agent's leads; privilege escalation | RBAC middleware (12 roles, 45+ perms); `scopeToOwn` row-level security | JWT role embedded; re-verified on every request; no client-side role trust | Authenticated agent requests `GET /api/leads` belonging to another agent | [ ] Returns 403; [ ] Activity log records denial; [ ] Alert fires after 5 denials |
| A02 | **Cryptographic Failures** | Password exposed; AML data stolen in transit | bcrypt 12 rounds; AES-256 at rest (Atlas); TLS 1.2+ in transit | Target: TLS 1.3 for AML connections; HSTS 2-year preload; no HTTP | Request to `/api/auth/login` over HTTP | [ ] HTTP redirected to HTTPS; [ ] TLS 1.0/1.1 connections rejected |
| A03 | **Injection** | NoSQL injection via `{ $where: ... }` in filters | Prisma ORM (parameterized); no raw query with user input; MongoDB driver escaping | Input validation before Prisma (type checks, enum whitelisting) | `POST /api/leads` with `{ "status": { "$ne": null } }` | [ ] Prisma rejects non-string status; [ ] 400 error returned |
| A04 | **Insecure Design** | Business logic bypass (e.g., commission manipulation) | Threat model per feature; RBAC enforces financial role separation | Security review checklist on every PR | Agent directly calls `POST /api/commissions` marking own commission as 'paid' | [ ] 403: only `finance` role can update commission status |
| A05 | **Security Misconfiguration** | Exposed debug endpoints; default credentials | Helmet headers; CORS whitelist; env-specific config; no default secrets | Production config diff reviewed pre-deploy | `GET /api/debug` in production | [ ] 404 in production; [ ] No stack traces in API error responses |
| A06 | **Vulnerable Components** | Compromised npm package with CVE | `npm audit` in CI (blocks merge on CRITICAL CVE); Dependabot auto-PRs | Quarterly manual dependency audit; Software Bill of Materials (SBOM) generated | CI pipeline with known vulnerable package | [ ] Build fails; [ ] Slack alert to security channel |
| A07 | **Authentication Failures** | Brute force on `/api/auth/login` | Rate limit: 5 attempts / 15 min per IP; account lockout after 10 fails | bcrypt constant-time compare; no username enumeration (same response for wrong user vs wrong password) | 6 rapid login attempts with wrong password | [ ] 429 on 6th attempt; [ ] IP blocked for 15 min; [ ] Alert fires |
| A08 | **Data Integrity Failures** | Forged webhook from Meta; tampered JWT | HMAC-SHA256 webhook verification; RS256 JWT (target); CSP headers; SRI for CDN assets | Pinned dependencies; signed Docker images | Webhook with invalid signature | [ ] 403 immediately; [ ] No processing of unauthenticated webhooks |
| A09 | **Logging & Monitoring** | Attack proceeds undetected | Structured logs for all state changes; Activity audit trail; real-time dashboards | PagerDuty alerts for anomalies; log retention 90 days operational, 7 years compliance | Delete all properties (simulated attack) | [ ] Activity log records all deletions; [ ] Alert fires after 10 deletes in 1 min |
| A10 | **SSRF** | Internal metadata endpoint reached via user-controlled URL | No user-controlled URL fetching in API; K8s NetworkPolicy blocks unexpected egress | Cloud metadata endpoint blocked (`169.254.169.254`); egress allowlist | `POST /api/webhooks/preview` with `{ "url": "http://169.254.169.254/latest/meta-data/" }` | [ ] 400: URL validation rejects internal ranges |

---

## 14. API Rate Limiting — Per-Endpoint Rules

### 14.1 Rate Limit Configuration Table

All limits are **per IP address** unless noted. Redis-backed store required for multi-instance deployments.

| Endpoint Group | Method | Limit | Window | Store | Notes |
|---------------|--------|-------|--------|-------|-------|
| `POST /api/auth/login` | Write | **5 req** | 15 min | Redis | Brute force protection |
| `POST /api/auth/register` | Write | **3 req** | 1 hour | Redis | Registration spam prevention |
| `POST /api/auth/forgot-password` | Write | **5 req** | 1 hour | Redis | Password reset abuse |
| `POST /api/auth/firebase-sync` | Write | **10 req** | 15 min | Redis | Firebase token sync |
| `POST /api/auth/refresh` | Write | **30 req** | 1 hour | Redis | Per user ID (not IP) |
| `GET /api/properties` | Read | **200 req** | 1 min | Redis | Public property listing |
| `GET /api/properties/:id` | Read | **500 req** | 1 min | Redis | Property detail page |
| `POST /api/properties` | Write | **30 req** | 1 min | Redis | Property creation |
| `GET /api/leads` | Read | **100 req** | 1 min | Redis | Per authenticated user |
| `POST /api/leads` | Write | **60 req** | 1 min | Redis | Lead creation |
| `POST /api/nadia/webhooks/messages` | Write | **1,000 req** | 1 min | Redis | Meta webhook; high volume |
| `POST /api/linda/send-message` | Write | **100 req** | 1 min | Redis | Agent message send |
| `POST /api/nina/nlp/intent` | Write | **200 req** | 1 min | Redis | NLP processing |
| `POST /api/analytics/export` | Write | **5 req** | 1 hour | Redis | Bulk export throttle |
| `GET /api/reports/*` | Read | **20 req** | 1 min | Redis | Heavy aggregation queries |
| `POST /api/admin/*` | Write | **30 req** | 1 min | Redis | Admin operations |
| `ALL /api/*` (global fallback) | Any | **100 req** | 60 sec | Redis | Global catch-all |

### 14.2 Rate Limit Response

```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded for this endpoint. Please retry after 847 seconds.",
  "retryAfter": 847,
  "limit": 5,
  "remaining": 0,
  "resetAt": "2026-06-01T10:15:00Z"
}
```

Headers returned on all rate-limited responses:
```
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1748772900
Retry-After: 847
```

### 14.3 Rate Limit Bypass Prevention

- **Redis-backed store:** `express-rate-limit` + `rate-limit-redis` to share limits across all API instances
- **IP spoofing protection:** Trust only Vercel/Cloudflare proxy IPs (`trust proxy` configured correctly)
- **User-level limits:** Auth endpoints use user ID as key (not IP) after first successful auth, preventing shared-IP abuse
- **DDoS protection:** Cloudflare WAF handles volumetric attacks before they reach the Express layer

**Acceptance Criteria:**
- [ ] Redis store active in production (not in-memory); verified by multi-instance test
- [ ] Login rate limit (5/15min) tested via automated test
- [ ] WhatsApp webhook limit (1000/min) sufficient for peak campaign volume (80 msg/sec × 12sec buffer)
- [ ] Rate limit headers present on every API response
- [ ] Rate limit exceeded events logged with IP, endpoint, timestamp

---

## 15. RERA Data Handling Requirements

Dubai Real Estate Regulatory Agency (RERA) mandates specific data handling obligations for licensed brokers.

| Requirement | RERA Reference | Implementation | Acceptance Criteria |
|------------|---------------|---------------|---------------------|
| Agent RERA BRN (Broker Registration Number) | RERA Regulation | `User.reraLicenseNumber` field; required for agent role | [ ] BRN field present; API returns 400 if missing for agent creation |
| Agent license expiry tracking | RERA | `User.reraLicenseExpiry` date field; cron alert 60/30/7 days before expiry | [ ] Cron fires at 60/30/7 days; notifications sent to agent + manager |
| Commission disclosure (Form A) | RERA | `Commission` model with full audit trail; PDF generation | [ ] Every commission record linked to signed Form A |
| Transaction records (7 years) | UAE Commercial Law | No TTL on Transaction collection | [ ] Transaction count verified in annual audit |
| Ejari registration number | RERA | `Lease.ejariNumber` unique index | [ ] Unique index prevents duplicate Ejari |
| DLD fee recording | DLD | `Transaction.dldFee` field + `Transaction.dldTransactionId` | [ ] DLD fees recorded on every sale transaction |
| Off-plan Oqood registration | RERA / DLD | `Transaction.oqoodReference` field | [ ] Required field for `type='off_plan'` transactions |
| RERA Form 7 (rent increase) | RERA | Lease amendment workflow with 90-day notice tracking | [ ] Form 7 generated 90 days before rent increase effective date |
| Property listing permit number | RERA | `Property.reraPermitNumber` field; required before status='available' | [ ] API rejects listing activation without permit number |

**Testability:** Integration test suite includes RERA data completeness checks. A `rera-compliance-check.js` script runs weekly in CI against production data and produces a compliance gap report.

---

## 16. AML Encryption Standards

### 16.1 Encryption Requirements for AML/KYC Data

Per CBUAE AML guidelines and Federal Law No. 20 of 2018:

| Data Category | Encryption at Rest | Encryption in Transit | Key Management |
|--------------|-------------------|-----------------------|----------------|
| Emirates ID / Passport copy | **AES-256** (Atlas default) | **TLS 1.3** (target) / TLS 1.2 (current minimum) | Atlas-managed KMS |
| Source of funds declarations | **AES-256** (Atlas default) | **TLS 1.3** (target) | Atlas-managed KMS |
| PEP screening results | **AES-256** + CSFLE (target) | **TLS 1.3** (target) | Customer-managed key (BYOK) |
| STR (Suspicious Transaction Reports) | **AES-256** + CSFLE (target) | **TLS 1.3** (target) | Customer-managed key (BYOK) |
| Beneficial ownership records | **AES-256** (Atlas default) | **TLS 1.3** (target) | Atlas-managed KMS |

### 16.2 TLS Version Policy (Updated)

| Connection | Minimum Version | Target Version | Current Status |
|-----------|----------------|---------------|----------------|
| Client → API | TLS 1.2 | **TLS 1.3** | ✅ TLS 1.2 enforced |
| API → MongoDB Atlas | TLS 1.2 | **TLS 1.3** | ✅ TLS 1.2 enforced |
| API → Redis | TLS 1.2 | **TLS 1.3** | ⏳ Planned Q3 2026 |
| API → Firebase | TLS 1.2 | **TLS 1.3** | ✅ Google-managed |
| API → Stripe | TLS 1.2 | **TLS 1.3** | ✅ Stripe-managed |
| API → WhatsApp Cloud | TLS 1.2 | **TLS 1.3** | ✅ Meta-managed |
| Nginx → API (internal) | TLS 1.2 | **TLS 1.3** | ⏳ Planned Q3 2026 |

> **TLS 1.0 and TLS 1.1 are explicitly disabled** in all Nginx and Atlas configurations. Connections using these versions are rejected.

### 16.3 Client-Side Field-Level Encryption (CSFLE) Plan

CSFLE adds per-field encryption on the client side before data reaches MongoDB, providing an additional protection layer for the most sensitive PII and AML fields.

**Target fields for CSFLE (Phase 2 security hardening):**

```javascript
// CSFLE schema for User collection
const encryptedFieldsMap = {
  "whitecaves.users": {
    fields: [
      {
        path: "emiratesId",
        bsonType: "string",
        algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic"
      },
      {
        path: "passportNumber",
        bsonType: "string",
        algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic"
      }
    ]
  }
};
```

**Acceptance Criteria:**
- [ ] TLS 1.0 and 1.1 disabled on all endpoints (verified via `nmap --script ssl-enum-ciphers`)
- [ ] AES-256 at rest confirmed via Atlas encryption-at-rest dashboard
- [ ] CSFLE implemented for `emiratesId` and `passportNumber` fields by Q4 2026
- [ ] Annual key rotation schedule documented and tested
- [ ] TLS 1.3 migration completed for all internal connections by Q3 2026

---

## 17. Vulnerability Disclosure Policy

### 17.1 Responsible Disclosure Program

White Caves LLC operates a responsible disclosure program. Security researchers who discover vulnerabilities are encouraged to report them in good faith.

**Contact:** `security@whitecaves.ae`

**Scope (in-scope):**
- `whitecaves.ae` and all subdomains
- `api.whitecaves.ae` (REST API)
- `status.whitecaves.ae`
- Mobile applications (if published)

**Out of scope:**
- Third-party services (Meta WhatsApp, Firebase, Stripe)
- Social engineering attacks on staff
- Physical security testing
- Denial-of-service attacks

### 17.2 Disclosure Timeline

| Timeline | Action |
|----------|--------|
| Day 0 | Researcher reports vulnerability to `security@whitecaves.ae` |
| Day 1 | Acknowledgement sent to researcher (within 24 hours) |
| Day 7 | Initial triage completed; severity assessed |
| Day 30 | Fix developed and tested |
| Day 45 | Fix deployed to production |
| Day 90 | Public disclosure (if researcher consents) |
| Ongoing | Reporter credited in security acknowledgements (optional) |

### 17.3 Safe Harbour

White Caves LLC will **not pursue legal action** against researchers who:
- Act in good faith
- Report findings before public disclosure
- Do not exploit vulnerabilities beyond proof-of-concept
- Do not access or exfiltrate user data

---

## 18. UAE Cybercrime Law Compliance

### 18.1 Federal Decree-Law No. 34 of 2021 (Cybercrime Law)

*(Supersedes Federal Law No. 5 of 2012; updated in 2021)*

| Article | Obligation | White Caves Implementation |
|---------|-----------|--------------------------|
| Art. 2 | Unauthorized access to IT systems is a criminal offence | RBAC; MFA for admin roles; access logging; anomaly detection |
| Art. 6 | Disclosure of electronic data is prohibited | PDPL-aligned data handling; RBAC restricts data access |
| Art. 8 | Electronic fraud is a criminal offence | Webhook signature verification; JWT integrity; audit trail |
| Art. 12 | Violations affecting financial systems carry enhanced penalties | PCI-DSS-aligned Stripe integration; AML transaction monitoring |
| Art. 26 | Entities must report cybercrime to authorities | Incident response plan includes TRA/TDRA notification within 72 hours |
| Art. 40 | Jurisdiction extends to acts affecting UAE or UAE residents regardless of origin | Global threat monitoring; geo-based suspicious access alerts |

### 18.2 UAE Cybersecurity Council Obligations

| Requirement | Authority | Implementation |
|------------|-----------|---------------|
| Critical Information Infrastructure (CII) — if designated | UAE Cybersecurity Council | N/A unless White Caves designated as CII |
| Data classification | UAE IA (Information Assurance) Standards | Applied in Section 4 of this document |
| Incident reporting within 6 hours (critical) | UAE Cybersecurity Council | Incident response runbook; PagerDuty P1 SLA = 4 hours |
| Annual security assessment | UAE Cybersecurity Council | Penetration test annually; report submitted if required |
| Vulnerability management | UAE Cybersecurity Council | `npm audit` in CI; quarterly pen test; Dependabot |

### 18.3 Penetration Testing Schedule (Updated)

| Test Type | Frequency | Scope | Provider | CVSS Minimum | Report Retention |
|-----------|-----------|-------|----------|-------------|-----------------|
| Automated DAST (OWASP ZAP) | **Weekly** (CI pipeline) | All API endpoints | Internal automated | Any | 30 days |
| Dependency vulnerability scan | **On every PR** + weekly | npm packages | `npm audit` + Snyk | Any | Per PR |
| API security assessment | **Quarterly** | All `/api/*` routes, RBAC, auth flows | Internal security team | 4.0+ | 1 year |
| Infrastructure pen test | **Annually** | K8s cluster, MongoDB Atlas, Nginx, TLS | **External CREST-certified firm** | 1.0+ | 3 years (regulatory) |
| Social engineering assessment | **Annually** | Staff awareness (phishing simulation) | External provider | N/A | 1 year |
| Red team exercise | **Every 2 years** | Full adversarial simulation | External red team | N/A | 3 years |
| Code security review | **Every PR** | Changed files (TypeScript, config) | CodeQL + peer review | Any | Per PR |

**Penetration test result handling:**

```
CRITICAL (CVSS 9.0+) → Fix within 24 hours → Re-test within 48 hours → Report to Board
HIGH (CVSS 7.0–8.9)  → Fix within 7 days  → Re-test within 14 days → Report to CTO
MEDIUM (CVSS 4.0–6.9)→ Fix within 30 days → Next pen test confirmation
LOW (CVSS 0.1–3.9)   → Fix within 90 days → Track in sprint backlog
```

---

*This document is reviewed quarterly, after security incidents, and when new features affect the security architecture. All security-related changes require review by the Security Officer before deployment. Regulatory references (UAE Cybercrime Law, PDPL, CBUAE AML) are reviewed annually against current legislation.*
