# Non-Functional Requirements — White Caves CRM Platform

> **Version:** 1.0  
> **Last Updated:** March 2026  
> **Purpose:** Defines quality attributes — how well the system must perform, scale, and operate

---

## 1. Performance Requirements

### NFR-PERF-001: API Response Times
| Endpoint Type | Target (p95) | Maximum |
|--------------|-------------|---------|
| Read (list) | < 300 ms | 800 ms |
| Read (single record) | < 150 ms | 400 ms |
| Write (create/update) | < 500 ms | 1,000 ms |
| Dashboard aggregation | < 800 ms | 2,000 ms |
| File upload (< 10 MB) | < 3,000 ms | 8,000 ms |
| Search with filters | < 400 ms | 1,000 ms |

### NFR-PERF-002: Frontend Load Times
| Scenario | Target | Maximum |
|----------|--------|---------|
| Initial page load (cold) | < 3 s | 5 s |
| Route navigation (hot) | < 500 ms | 1,200 ms |
| Dashboard render | < 2 s | 4 s |
| Large table (100 rows) | < 1 s | 2 s |

Measured on a 4G connection (20 Mbps download, 5 Mbps upload) from Dubai.

### NFR-PERF-003: Throughput
- Handle 500 concurrent active users without degradation
- Handle 1,000 API requests per minute across all endpoints
- Handle 200 concurrent WhatsApp messages per minute
- Handle 10 simultaneous Excel import operations

---

## 2. Availability & Reliability

### NFR-AVAIL-001: Uptime SLA
- **Production target:** 99.5% uptime (≤ 3.65 hours downtime per month)
- **Planned maintenance window:** Sundays 02:00–04:00 UAE time (notified 48h in advance)
- **Incident response:** P1 (total outage) — 15-minute acknowledgement, 2-hour resolution target

### NFR-AVAIL-002: Data Durability
- Zero data loss for all committed database writes
- Daily automated backup (retained 30 days)
- Monthly backup snapshot (retained 12 months)
- Point-in-time recovery capability to within 1 hour

### NFR-AVAIL-003: Graceful Degradation
- If the WhatsApp API is unavailable, the CRM continues operating (email/phone fallback)
- If a portal sync service fails, listings remain active internally; sync retried automatically
- If real-time exchange rates are unavailable, last cached rates are used (max 24-hour staleness)

---

## 3. Scalability Requirements

### NFR-SCALE-001: Data Volume Targets
| Entity | Current | Year 1 | Year 3 |
|--------|---------|--------|--------|
| Properties | 9,378 | 15,000 | 50,000 |
| Leads | 5,000 | 30,000 | 100,000 |
| Transactions | 1,500 | 6,000 | 20,000 |
| Users | 30 | 100 | 300 |
| WhatsApp messages | 50,000/mo | 200,000/mo | 1M/mo |

### NFR-SCALE-002: Horizontal Scaling
- API server must support horizontal scaling (stateless design, no server-side sessions)
- Database read replicas must be addable without application changes
- File storage must be cloud-native (not local disk)

### NFR-SCALE-003: Search Performance at Scale
- Property search across 50,000 listings must return results in < 400 ms
- Lead full-text search across 100,000 records must return in < 500 ms
- Database indexes must be maintained for all frequent query patterns

---

## 4. Security Requirements

### NFR-SEC-001: Authentication Security
- All passwords hashed using bcrypt with minimum cost factor 12
- JWT tokens signed with RS256 (asymmetric) or HS256 with 256-bit secret minimum
- Refresh tokens rotated on every use (rotation invalidates previous)
- 2FA supported via TOTP (HMAC-SHA1, 30-second window)

### NFR-SEC-002: Transport Security
- All traffic served over HTTPS with TLS 1.2 minimum (TLS 1.3 preferred)
- HSTS header enforced with min-age 31536000
- HTTP → HTTPS redirect enforced
- Certificate auto-renewal via Let's Encrypt or cloud provider

### NFR-SEC-003: API Security
- All API inputs sanitised (strip HTML, trim whitespace)
- SQL/NoSQL injection prevention via parameterised queries (Prisma ORM)
- Rate limiting on all endpoints (see `10_security/security-policy.md`)
- CORS restricted to approved origins only
- Content-Type enforcement on mutation endpoints (application/json required)
- Helmet.js security headers on all responses

### NFR-SEC-004: Data Security
- All data encrypted at rest (MongoDB Atlas AES-256)
- PII fields (passport, visa, ID numbers) not returned in list responses
- File uploads scanned for malware before storage
- No secrets committed to version control (environment variables only)

### NFR-SEC-005: Audit & Non-Repudiation
- Every data mutation logged with: user ID, timestamp, entity type, entity ID, action, changed fields
- Audit log is append-only; delete operations are not permitted
- Login events (success/failure) logged with IP address and user agent

---

## 5. Usability Requirements

### NFR-USE-001: Responsive Design
- Platform must be fully usable on desktop (1920×1080), laptop (1366×768), and tablet (1024×768) screens
- Mobile web (360px+) must support key workflows: view leads, update lead status, send WhatsApp
- All forms usable with keyboard only (no mouse required)

### NFR-USE-002: Language Support
- UI supports English (default) and Arabic (RTL)
- Language toggle visible on all pages
- RTL layout switches correctly for Arabic including tables, forms, and charts
- Date and number formats localised (e.g., Arabic-Indic numerals optional)

### NFR-USE-003: Accessibility
- Meets WCAG 2.1 Level AA
- Colour contrast ratio ≥ 4.5:1 for all body text
- All interactive elements keyboard-accessible
- Screen reader compatible (ARIA labels on icons and non-text elements)

### NFR-USE-004: Error Handling
- Form validation errors shown inline at the field, not as a general alert
- API errors translated to user-friendly messages (no raw server error strings exposed)
- All async operations show loading state
- Network failure shows a clear "connection problem" message with retry option

---

## 6. Maintainability Requirements

### NFR-MAINT-001: Code Quality
- TypeScript strict mode enabled across the full codebase
- No `any` type usage in production code (ESLint rule)
- All public API functions documented with JSDoc
- Unit test coverage minimum 80% for business logic modules

### NFR-MAINT-002: Deployment
- Zero-downtime deployments via rolling update or blue-green strategy
- Full CI/CD pipeline: lint → type-check → test → build → deploy
- Deployment rollback achievable within 5 minutes
- Feature flags available to disable features without redeployment

### NFR-MAINT-003: Logging & Observability
- Structured JSON logs for all server operations
- Log levels: ERROR, WARN, INFO, DEBUG (configurable at runtime)
- Distributed tracing with correlation IDs across requests
- Uptime and API health metrics exported to monitoring system
- Alerts configured for: error rate > 1%, response time p95 > 2s, DB connection failures

### NFR-MAINT-004: Documentation
- All API endpoints documented in OpenAPI 3.0 format
- Architecture decision records (ADRs) maintained for major decisions
- Runbooks for: deployment, incident response, backup restore, database migration
- Component-level documentation for all shared UI components

---

## 7. Compliance & Legal Requirements

### NFR-LEGAL-001: UAE PDPL Compliance
- User consent captured before collecting personal data
- Privacy policy displayed and linked at login and registration
- Users can request export of their personal data (right to access)
- Data deletion requests processed within 30 days (where not blocked by AML retention rules)

### NFR-LEGAL-002: AML Data Retention
- All transaction records, KYC documents, and financial data retained for minimum 5 years
- System prevents deletion of records within retention period
- Retention schedule documented and reviewed annually

### NFR-LEGAL-003: RERA/DLD Compliance
- RERA permit numbers stored and displayed per regulatory requirement
- DLD reference numbers tracked for all sale transactions
- Ejari numbers tracked for all lease transactions

---

## 8. Integration Requirements

### NFR-INT-001: Third-Party API Resilience
- All outbound API calls have timeout (default 10 seconds), retry (3 attempts, exponential backoff), and circuit breaker
- Failures of non-critical integrations (portals, exchange rates) do not interrupt core CRM operations
- All third-party API credentials stored in environment variables, never hardcoded

### NFR-INT-002: Webhook Security
- All inbound webhooks (WhatsApp, payment gateways) validated with HMAC signature
- Webhook endpoints do not require authentication tokens (signed by provider)
- Duplicate webhook events handled idempotently

---

## 9. Capacity Planning

### NFR-CAP-001: Database
- MongoDB Atlas M20 or equivalent as minimum production tier
- Auto-scaling storage enabled
- Database connection pool: minimum 5, maximum 100 connections
- Slow query threshold alert: queries > 500 ms logged and alerted

### NFR-CAP-002: File Storage
- Cloud object storage (S3-compatible) minimum 500 GB provisioned
- CDN enabled for all media assets (photos, PDFs)
- Maximum file size enforced: 50 MB per upload, 500 MB per property

---

**Version:** 1.0 | **Last Updated:** March 2026 | **Maintained By:** Technical & Product Teams
