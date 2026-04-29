# API Versioning & Deprecation Policy
# White Caves Real Estate Platform

> **Document ID:** WC-API-POL-001
> **Version:** 1.0
> **Date:** April 2026
> **Status:** Active
> **Owner:** Technology Department (Aurora)
> **Classification:** Internal

---

## 1. Purpose

This policy defines how the White Caves API is versioned, how breaking changes are managed, and how deprecations are communicated to all consumers — internal frontend, Landlord/Tenant portals, WhatsApp integration, and future third-party partners (Bayut, PropertyFinder).

---

## 2. Current API State

All current endpoints use **v1 (implicit)** — `/api/*` without a version prefix. Formal versioning must be adopted **before** Phase 8 (portal syndication / external API consumers launch).

| Milestone | Required Action |
|-----------|----------------|
| Phase 3 completion | Tag all current routes as `/api/v1/*` |
| Phase 4 start | Add versioned prefix to new WhatsApp endpoints |
| Phase 8 (partner API) | Enforce versioning; publish per-version OpenAPI spec |

---

## 3. Versioning Strategy

### 3.1 URL Path Versioning

White Caves uses **URL path versioning** as the primary strategy:

```
/api/v1/leads         ← current (after Phase 3 migration)
/api/v2/leads         ← future (when breaking changes required)
/api/v1/properties
/api/v1/assistants
```

**Rationale:** Path versioning is explicit, easy to test, cache-friendly, and does not require custom headers. Header-based versioning adds client complexity with no benefit at our scale.

### 3.2 Version Lifecycle States

| State | Description | Support |
|-------|------------|---------|
| **Current** | Latest stable | Full support + bug fixes |
| **Deprecated** | Older but functional | Security patches only |
| **Sunset** | Removed | No support; returns 410 Gone |

### 3.3 What Triggers a New Major Version

```
REQUIRES new /api/v{N+1}/*:
  ✗ Removing a response field
  ✗ Renaming a response field
  ✗ Changing a field's data type
  ✗ Changing HTTP status codes (e.g., 200 → 201)
  ✗ Removing an endpoint
  ✗ Adding a required request body field
  ✗ Changing authentication requirements
  ✗ Changing pagination format (cursor ↔ offset)

Does NOT require version bump:
  ✓ Adding new optional response fields
  ✓ Adding new optional query parameters
  ✓ Adding new endpoints
  ✓ Performance improvements
  ✓ Bug fixes that preserve contract
  ✓ Relaxing validation rules
  ✓ Expanding enum values (not removing)
```

---

## 4. Deprecation Process

### 4.1 Timeline

```
Breaking change identified
        │
        ▼ (within 2 weeks)
ADR created + new version designed
        │
        ▼ (phase start)
Both v1 + v2 deployed in parallel
        │
        ▼ (deployment day)
Deprecation headers added to v1 responses
Migration guide published in /openapi.json
        │
        ▼ (within 3 months)
All internal consumers migrated to v2
        │
        ▼ (month 5)
30-day sunset notice to all API key holders
        │
        ▼ (month 6)
v1 routes return 410 Gone with migration URL
```

### 4.2 Deprecation Response Headers

When an endpoint is deprecated, responses include:

```http
HTTP/1.1 200 OK
Deprecation: true
Sunset: Sat, 01 Nov 2026 00:00:00 GMT
Link: <https://api.whitecaves.ae/api/v2/leads>; rel="successor-version"
Warning: 299 - "This endpoint is deprecated. Migrate to /api/v2/leads by Nov 2026."
```

---

## 5. Current Endpoint Registry

### 5.1 Production Endpoints (v1 — All Active)

| Endpoint | Method | Auth | Status |
|----------|--------|------|--------|
| `/api/auth/login` | POST | None | ✅ |
| `/api/auth/register` | POST | None | ✅ |
| `/api/auth/logout` | POST | JWT | ✅ |
| `/api/auth/profile` | GET/PATCH | JWT | ✅ |
| `/api/leads` | GET/POST | JWT + role | ✅ |
| `/api/leads/:id` | GET/PATCH/DELETE | JWT + role | ✅ |
| `/api/properties` | GET/POST | JWT + role | ✅ |
| `/api/properties/:id` | GET/PATCH/DELETE | JWT + role | ✅ |
| `/api/clients` | GET/POST | JWT + role | ✅ |
| `/api/clients/:id` | GET/PATCH/DELETE | JWT + role | ✅ |
| `/api/users` | GET/PATCH | JWT + role | ✅ |
| `/api/transactions` | GET/POST | JWT + role | ✅ |
| `/api/compliance` | GET/POST | JWT + role | ✅ |
| `/api/assistants` | GET | None | ✅ |
| `/api/assistants` | POST/PUT/DELETE | JWT + managing_director | ✅ |
| `/api/notifications` | GET/PATCH | JWT | ✅ |
| `/api/favorites` | GET/POST/DELETE | JWT | ✅ |
| `/api/job-applications` | POST | None | ✅ |
| `/api/job-applications` | GET/PATCH | JWT + role | ✅ |

### 5.2 Stub Endpoints (Phase 2 Implementation)

| Endpoint | Current | Phase | Notes |
|----------|---------|-------|-------|
| `/api/contracts` | 501 Not Implemented | 2 | Prisma model needed |
| `/api/appointments` | 501 Not Implemented | 2 | Prisma model needed |
| `/api/payments` | 503 Service Unavailable | 2 | Stripe integration |
| `/api/valuation` | 501 Not Implemented | 2 | ML model needed |
| `/api/tenancy-agreements` | 501 Not Implemented | 2 | Lease model needed |
| `/api/whatsapp` | Stub (logs only) | 4 | Meta API approval needed |
| `/api/2fa` | 501 Not Implemented | 9 | TOTP/Twilio |

---

## 6. OpenAPI Specification Standards

### 6.1 Current State

| Item | Value |
|------|-------|
| Location | `/openapi.json` (root), `/openapi/` directory |
| Documented paths | ~10 (target: 30+) |
| Swagger UI | Planned at `/api-docs` (Phase 2) |

### 6.2 OpenAPI Rules

```
Rule 1: Every new endpoint MUST have an OpenAPI entry before PR merge
Rule 2: OpenAPI must match actual implementation (no drift)
Rule 3: Examples use realistic Dubai real estate data
Rule 4: All error responses documented: 400, 401, 403, 404, 422, 500
Rule 5: Reusable schemas use $ref (Lead, Property, User, Transaction)
Rule 6: Each version has its own OpenAPI file (/openapi/v1.json, v2.json)
```

### 6.3 Phase 2 OpenAPI Expansion Targets

```
New paths to add:
  /api/v1/leads/{id}/activities
  /api/v1/contracts (CRUD)
  /api/v1/appointments (CRUD)
  /api/v1/payments (Stripe flow)
  /api/v1/landlord-portal/*
  /api/v1/tenant-portal/*
  /api/v1/reporting/*
  
Phase 4:
  /api/v1/whatsapp/webhook
  /api/v1/whatsapp/send
  /api/v1/whatsapp/conversations
```

---

## 7. API Changelog

### v1.0.0 — March 2026 (Initial Release)

```
+ Auth: login, register, logout, profile
+ Leads: CRUD + activity logging
+ Properties: CRUD + search
+ Clients, Transactions, Compliance: CRUD
+ AI Assistants: CRUD + plan API (XSS protected)
+ Notifications: read + mark-read
+ Favorites: add/remove/list
+ Job Applications: submit + manage
```

### v1.1.0 — April 2026 (Security Hardening)

```
~ Firebase-sync: returns 503 (firebase-admin SDK pending)
+ Webhook: crypto.timingSafeEqual (timing attack protection)
+ CRM export: Prisma select projections (no data leakage)
~ Auth routes: ordering fixed (profile/password use authMiddleware)
+ Lead/Property edit modals: required field validation added
```

### v1.2.0 — Phase 2 (Planned)

```
+ /api/v1/contracts (CRUD)
+ /api/v1/appointments (CRUD)
+ /api/v1/payments (Stripe)
+ /api/v1/valuation (ML)
+ /api/v1/tenancy-agreements (CRUD)
+ Swagger UI at /api-docs
```

---

## 8. API Security Policy

| Control | Implementation |
|---------|---------------|
| Authentication | JWT middleware on all `/api/*` (except login/register) |
| Rate limiting | 5 tiers: api(100/15min), auth(5/15min), register(3/hr), password(3/hr), strict(10/15min) |
| Input sanitization | XSS strip on all POST/PATCH |
| Response filtering | Prisma `select` — passwords/sensitive fields never returned |
| CORS | Whitelist: whitecaves.ae, staging.whitecaves.ae, localhost:5173 |
| Body limit | 1MB (Express body-parser) |
| Partner API keys | Phase 8: HMAC-signed keys for syndication partners |

---

**Document Owner:** Technology Department (Aurora)
**Review Trigger:** Before any breaking API change
**Related:** `business_docs/06_design_architecture/api-reference.md`, `/openapi.json`
