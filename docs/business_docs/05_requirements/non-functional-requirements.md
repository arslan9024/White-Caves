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

---

## 10. Measurable Acceptance Criteria (Performance Baselines)

### NFR-ACC-001: API Endpoint Latency Targets

All measurements taken under a **sustained load of 200 concurrent users** (load test — not burst). Tests run from UAE-based load generators simulating Dubai 4G/5G client connections.

| Endpoint Category | p50 Target | p95 Target | p99 Target | Max Timeout |
|------------------|:----------:|:----------:|:----------:|:-----------:|
| Auth (login / token refresh) | < 200 ms | < 400 ms | < 800 ms | 3 s |
| Lead CRUD (create/update/list) | < 150 ms | < 300 ms | < 600 ms | 3 s |
| Property listing list/search | < 200 ms | < 500 ms | < 1,000 ms | 5 s |
| Property detail page (with photos) | < 250 ms | < 600 ms | < 1,200 ms | 5 s |
| Geospatial search (map bounds) | < 300 ms | < 700 ms | < 1,500 ms | 5 s |
| Commission calculation | < 100 ms | < 250 ms | < 500 ms | 3 s |
| WhatsApp message send (sync) | < 500 ms | < 1,200 ms | < 2,000 ms | 10 s |
| Document/PDF generation | < 1,000 ms | < 3,000 ms | < 6,000 ms | 30 s |
| Analytics dashboard (aggregated) | < 500 ms | < 1,500 ms | < 3,000 ms | 10 s |
| Bulk CSV import (< 1,000 rows) | < 5,000 ms | < 15,000 ms | < 30,000 ms | 60 s |

**Acceptance Criteria:**
- **Given** 200 concurrent users perform realistic mixed operations, **When** a 10-minute sustained load test runs, **Then** p95 for all endpoints in the table above meets the specified targets; zero HTTP 5xx errors; error rate < 0.1%
- **Given** the load drops back to 0 after the 200-user test, **When** idle state is measured, **Then** all endpoints return to < p50 targets within 60 seconds
- **Test Reference:** TC-NFR-PERF-001

---

### NFR-ACC-002: Core Web Vitals (Public-Facing Pages)

Measured using Lighthouse CI and Chrome User Experience Report (CrUX) for Dubai-based 4G (avg 30 Mbps) users.

| Metric | Green Threshold | Amber Threshold | Red Threshold |
|--------|:--------------:|:---------------:|:-------------:|
| Largest Contentful Paint (LCP) | ≤ 2.5 s | 2.5–4.0 s | > 4.0 s |
| First Input Delay (FID) / INP | ≤ 100 ms | 100–300 ms | > 300 ms |
| Cumulative Layout Shift (CLS) | ≤ 0.1 | 0.1–0.25 | > 0.25 |
| Time to First Byte (TTFB) | ≤ 600 ms | 600 ms–1.5 s | > 1.5 s |
| First Contentful Paint (FCP) | ≤ 1.8 s | 1.8–3.0 s | > 3.0 s |

**Target:** All public-facing pages (property listing, property detail, homepage) achieve Green thresholds.

**Acceptance Criteria:**
- **Given** a Lighthouse CI run executes on every pull request, **When** the CI job completes, **Then** LCP ≤ 2.5 s, FID ≤ 100 ms, CLS ≤ 0.1 for the property listing page; PR is blocked if any metric falls into Red
- **Given** a production release is deployed, **When** the deployment health check runs, **Then** a CrUX API check confirms no regression from the previous week's Core Web Vitals scores
- **Test Reference:** TC-NFR-PERF-002

---

### NFR-ACC-003: System Throughput Targets

| Operation | Target Throughput | Burst Capacity |
|-----------|:-----------------:|:--------------:|
| WhatsApp messages outbound | 200 messages/minute | 500 messages/minute (5-minute burst) |
| Leads imported via bulk CSV | 5,000 leads/hour | 10,000 leads/hour (one-off import) |
| Portal sync (PropertyFinder/Bayut) | 500 listings/sync cycle | — |
| Concurrent active CRM sessions | 200 users | 500 users (peak: first day of month) |
| Document/PDF generation | 20 concurrent jobs | 50 concurrent (queue-backed) |
| Audit log writes | 10,000 events/minute | 50,000 events/minute (spike) |

**Acceptance Criteria:**
- **Given** a 5,000-row lead CSV is submitted for import, **When** the import job completes, **Then** all rows are processed within 1 hour and an import report is returned (success count, error count, error rows with reasons)
- **Given** 500 concurrent users are active simultaneously, **When** measured over 5 minutes, **Then** error rate < 0.5%, no requests queued > 10 seconds, and the system auto-scales (if cloud-provisioned) within 3 minutes
- **Test Reference:** TC-NFR-TPUT-001

---

## 11. UAE-Specific Non-Functional Requirements

### NFR-UAE-001: Arabic Language and RTL Interface Support

**Priority:** Critical (legal and market requirement for UAE)  
**Source:** Dubai Language Law; UAE market localisation standards

**Acceptance Criteria:**
- **Given** a user switches language to Arabic (ar-AE), **When** any CRM screen loads, **Then** the entire interface renders in RTL (right-to-left) layout: text alignment, flex direction, icon placement, form field order, sidebar position all reversed
- **Given** an Arabic tenant inputs their name in Arabic script in the lead form, **When** saved and retrieved, **Then** the Arabic text is stored and displayed without corruption (UTF-8 encoding preserved end-to-end)
- **Given** a property description is entered in both English and Arabic, **When** the listing is published to PropertyFinder/Bayut, **Then** both language fields are included in the syndication payload
- **Given** RTL mode is active, **When** form validation errors appear, **Then** error messages appear in Arabic to the right of the field (not left)
- **Given** a currency amount is displayed (e.g., AED 1,250,000), **When** Arabic locale is active, **Then** number is formatted using Arabic-Indic numerals or Western numerals per UAE convention (configurable — default: Western numerals with RTL layout)
- **Given** any PDF document is generated (tenancy agreement, receipt), **When** Arabic client details are included, **Then** the PDF renders Arabic text correctly using embedded Arabic-capable fonts (e.g., Arial Unicode, Cairo, or Noto Naskh Arabic)
- **Given** a search query is entered in Arabic, **When** the search is executed, **Then** results match on Arabic property names/areas (collation-aware search; not just ASCII prefix match)
- **Given** the keyboard is in Arabic input mode, **When** the user types in any CRM text field, **Then** text entry supports right-to-left cursor movement and text insertion
- **Test Reference:** TC-NFR-UAE-001

---

### NFR-UAE-002: UAE Timezone (UTC+4) Handling

**Priority:** Critical  
**Source:** UAE Standard Time Decree; UAE does not observe daylight saving time

**Acceptance Criteria:**
- **Given** any timestamp is stored in the database, **When** examined in MongoDB, **Then** it is stored as UTC (no timezone offset in storage layer)
- **Given** any timestamp is displayed to a UAE-based user in the CRM UI, **When** rendered, **Then** it is displayed in UTC+4 with label "GST" (Gulf Standard Time) — e.g., "14:30 GST"
- **Given** a scheduled appointment is created at "10:00 AM Thursday", **When** the reminder notification fires, **Then** it fires at 10:00 AM UTC+4 (not UTC, not UTC+3 — no DST offset applied)
- **Given** a lease expiry date is "31 December 2026", **When** the expiry check runs, **Then** the system treats midnight as 00:00:00 UTC+4 (not UTC midnight)
- **Given** an API consumer in a different timezone (e.g., UTC+0 Europe) calls `/api/viewings`, **When** response is returned, **Then** all timestamps include ISO 8601 format with explicit UTC offset `+04:00` (e.g., `2026-12-31T22:00:00+04:00`)
- **Given** daylight saving time adjusts clocks in Europe or US, **When** UAE-based operations continue, **Then** UAE system clock remains fixed at UTC+4 with no change
- **Given** email notifications are generated with "Appointment tomorrow at 3:00 PM", **When** rendered for a UAE recipient, **Then** the time shown is correct for Dubai time zone
- **Test Reference:** TC-NFR-UAE-002

---

### NFR-UAE-003: UAE Business Week and Public Holidays

**Priority:** High  
**Source:** UAE Federal Government Holiday Calendar; Dubai working week convention

**Business Week Definition:**
- Working days: **Sunday, Monday, Tuesday, Wednesday, Thursday**
- Non-working days: Friday, Saturday (UAE weekend)
- All "business day" calculations in legal notices, SLA timers, overdue counters use Sunday–Thursday only

**UAE Public Holidays 2026 (Hardcoded Baseline):**

| Holiday | Approx. Date (may vary by moon sighting) |
|---------|------------------------------------------|
| New Year's Day | 1 January |
| Commemoration Day | 1 December |
| National Day | 2–3 December |
| Eid Al Fitr | ~3 days (TBC — moon sighting dependent) |
| Arafat Day / Eid Al Adha | ~4 days (TBC) |
| Islamic New Year (Al Hijra) | ~1 day (TBC) |
| Prophet's Birthday | ~1 day (TBC) |

**Acceptance Criteria:**
- **Given** a 90-day legal notice is generated today (a Sunday), **When** the effective date is calculated, **Then** the system counts 90 calendar days (not 90 business days) as per UAE tenancy law — and displays the effective date correctly
- **Given** an SLA timer is running (e.g., "respond within 5 business days"), **When** Friday or Saturday falls within the period, **Then** those days are excluded from the business day count
- **Given** a UAE public holiday falls within an SLA window, **When** the SLA timer calculates the deadline, **Then** the public holiday day is excluded from the business day count
- **Given** the public holiday calendar is updated (e.g., government announces early Eid), **When** updated by the admin, **Then** all future SLA and notice calculations reflect the new holiday date
- **Test Reference:** TC-NFR-UAE-003

---

### NFR-UAE-004: Prayer Time SLA Considerations

**Priority:** Medium  
**Source:** Dubai Department of Islamic Affairs; human agent availability standards

**Prayer Times (Approx. — Dubai, 25.2048°N, 55.2708°E):**

| Prayer | Approx. Time Range |
|--------|-------------------|
| Fajr | 04:45–05:15 |
| Dhuhr | 12:00–12:30 |
| Asr | 15:00–15:30 |
| Maghrib | 18:00–18:30 |
| Isha | 19:30–20:00 |

**Duration:** Each prayer window is approximately 30–35 minutes maximum.

**Platform Requirement:** Human-agent SLA timers (for WhatsApp inbox response, maintenance assignment, lease approval) auto-pause during prayer windows. Automated system SLAs (API response, data processing) are unaffected.

**Acceptance Criteria:**
- **Given** an incoming WhatsApp message arrives at 12:05 PM (during Dhuhr window), **When** the "first response SLA" timer starts, **Then** the timer is paused for the 30-minute prayer window and the agent's SLA clock shows: "SLA paused — prayer time"
- **Given** a maintenance assignment SLA of 4 hours begins at 11:45 AM, **When** Dhuhr prayer runs 12:00–12:30, **Then** the effective deadline extends by 30 minutes to account for the prayer pause
- **Given** it is outside all 5 prayer windows, **When** SLA timers run, **Then** they count normally without pause
- **Given** UAE prayer times are updated seasonally (Daylight differences), **When** the prayer time API (or hardcoded monthly table) is refreshed, **Then** all subsequent SLA pauses use the updated times
- **Test Reference:** TC-NFR-UAE-004

---

### NFR-UAE-005: Bilingual Document Generation (Arabic + English)

**Priority:** High  
**Source:** Dubai Official Languages Policy; RERA requirement for bilingual contracts

**Acceptance Criteria:**
- **Given** a Tenancy Agreement is generated, **When** the PDF is produced, **Then** it includes both English and Arabic text rendered correctly (no mojibake, no font fallback glyphs)
- **Given** the Arabic section of a contract renders in PDF, **When** examined, **Then** text flows right-to-left, paragraphs are aligned right, and the Arabic font is properly embedded in the PDF (not relying on system fonts)
- **Given** a property brochure PDF is generated, **When** Arabic locale is selected, **Then** property area names, unit numbers, and amounts are formatted in Arabic conventions
- **Given** a bilingual document has both languages on the same page (side-by-side), **When** rendered, **Then** the layout does not overflow or overlap between the English (LTR) and Arabic (RTL) columns
- **Test Reference:** TC-NFR-UAE-005

---

### NFR-UAE-006: AED Currency Handling — Integer Fils Precision

**Priority:** Critical  
**Source:** UAE Central Bank currency regulations; IEEE 754 floating-point avoidance best practice

**Technical Standard:**
- All monetary amounts stored in the database as **integer fils** (1 AED = 100 fils) — never as floating-point
- No `FLOAT`, `DOUBLE`, or JavaScript `number` types used for AED amounts in database layer
- API serialisation: monetary amounts transmitted as integers (fils) with a `currency: "AED"` field — OR as string representation to avoid JS number precision loss
- Display layer converts fils to AED: `displayAED = (amountFils / 100).toFixed(2)`
- All financial calculations (commission, VAT, interest) performed in integer fils, rounding applied only at final display

**Acceptance Criteria:**
- **Given** a commission of AED 37,500.75 is calculated, **When** stored in the database, **Then** the value is stored as `3750075` (fils, integer) in the `commissionFils` column — not as `37500.75` (float)
- **Given** a VAT calculation of 5% on AED 120,000, **When** computed, **Then** VAT = AED 6,000.00 (integer arithmetic: `12000000 × 5 / 100 = 600000 fils`) — no floating-point rounding errors
- **Given** an API response is returned for a property price of AED 2,500,000, **When** the JSON is inspected, **Then** the amount field is either `{ "amountFils": 250000000, "currency": "AED" }` or string `"2500000.00"` — never `2500000.0000000003` (float precision error)
- **Given** a sum of 100 transactions each of AED 0.35 is calculated, **When** totalled, **Then** the result is AED 35.00 exactly (integer fils: 100 × 35 = 3500 fils = AED 35.00)
- **Test Reference:** TC-NFR-UAE-006

---

## 12. Security Non-Functional Requirements

### NFR-SEC-ACC-001: Authentication Security

**Acceptance Criteria:**
- **Given** 5 consecutive failed login attempts from the same IP, **When** the 5th attempt fails, **Then** the account is locked for 30 minutes and the account owner receives an email/SMS alert
- **Given** a valid JWT token has expired (> 24-hour inactivity), **When** any API request is made with that token, **Then** the response is HTTP 401 `{ "error": "token_expired" }` — never a 200 or silent renewal
- **Given** a user logs in from an IP address not in UAE or a previously unknown country, **When** login succeeds, **Then** an anomaly alert is sent to the user: "New login detected from [country] at [time]"
- **Given** a password reset is requested, **When** the reset link is issued, **Then** it expires after 1 hour and can only be used once
- **Test Reference:** TC-NFR-SEC-001

### NFR-SEC-ACC-002: Authorisation and Data Isolation

**Acceptance Criteria:**
- **Given** an Agent (role) calls `GET /api/leads`, **When** the response is returned, **Then** the list contains only leads assigned to that agent — never another agent's leads
- **Given** a Manager calls `GET /api/leads`, **When** the response is returned, **Then** the list contains leads for all agents in their team — but not leads from other teams
- **Given** a user's role is "Leasing Agent", **When** they call `POST /api/commissions`, **Then** the response is HTTP 403 "Insufficient permissions" (commission creation is Finance role only)
- **Given** a Finance user calls `DELETE /api/properties/{id}`, **When** executed, **Then** the response is HTTP 403 (property deletion is Admin/MD only)
- **Test Reference:** TC-NFR-SEC-002

### NFR-SEC-ACC-003: Data Encryption

**Acceptance Criteria:**
- **Given** Emirates ID numbers, passport numbers, or bank account numbers are stored in the database, **When** inspected directly in MongoDB, **Then** the values are AES-256 encrypted and unreadable without the application-layer decryption key
- **Given** all HTTP API traffic, **When** a client makes any request, **Then** the connection uses TLS 1.2 or higher; TLS 1.0 and 1.1 are rejected
- **Given** a database backup is created, **When** inspected without the application credentials, **Then** all PII fields (Emirates ID, passport, bank details) are unreadable (encrypted at rest)
- **Test Reference:** TC-NFR-SEC-003

---

**Version:** 1.1 | **Last Updated:** June 2026 | **Maintained By:** Technical & Product Teams  
**Change Log:** v1.0 — Initial NFRs (March 2026); v1.1 — Added NFR-ACC-001/002/003 (measurable performance baselines), NFR-UAE-001 through 006 (UAE-specific requirements), NFR-SEC-ACC-001/002/003 (security acceptance criteria) (June 2026)
