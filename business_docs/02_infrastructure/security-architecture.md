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

*This document is reviewed quarterly, after security incidents, and when new features affect the security architecture. All security-related changes require review by the Security Officer before deployment.*
