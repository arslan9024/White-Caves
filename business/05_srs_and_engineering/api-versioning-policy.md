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


---

## 9. API Design Principles — Reference Guide

### 9.1 RESTful Resource Naming

White Caves API follows strict RESTful conventions:

| Rule | Good ✅ | Bad ❌ |
|------|---------|------|
| Use nouns (not verbs) for resources | `/api/v1/leads` | `/api/v1/getLeads` |
| Plural nouns | `/api/v1/properties` | `/api/v1/property` |
| Lowercase + hyphens | `/api/v1/job-applications` | `/api/v1/JobApplications` |
| Nested resources for relationships | `/api/v1/leads/:id/activities` | `/api/v1/getLeadActivities?leadId=...` |
| HTTP method for action | `DELETE /api/v1/leads/:id` | `POST /api/v1/leads/delete/:id` |
| Status in body, not URL | `{ "status": "qualified" }` | `/api/v1/leads/qualify/:id` |

### 9.2 HTTP Status Code Policy

| Scenario | Code | Body |
|---------|------|------|
| Success — resource created | `201 Created` | `{ data: {...}, message: "Resource created" }` |
| Success — data returned | `200 OK` | `{ data: [...], meta: { total, page } }` |
| Success — no content (DELETE) | `204 No Content` | (empty) |
| Validation error | `400 Bad Request` | `{ error: "validation", fields: [{field, message}] }` |
| Unauthenticated | `401 Unauthorized` | `{ error: "authentication_required" }` |
| Insufficient permissions | `403 Forbidden` | `{ error: "insufficient_permissions", required: "sales_manager" }` |
| Resource not found | `404 Not Found` | `{ error: "not_found", resource: "lead", id: "..." }` |
| Conflict (duplicate) | `409 Conflict` | `{ error: "conflict", message: "Email already registered" }` |
| Rate limit exceeded | `429 Too Many Requests` | `{ error: "rate_limit", retryAfter: 60 }` |
| Server error | `500 Internal Server Error` | `{ error: "internal_error", reference: "sentry-xxxx" }` |
| Service unavailable | `503 Service Unavailable` | `{ error: "service_unavailable", retryAfter: 30 }` |

### 9.3 Pagination Standard

All list endpoints support cursor-based pagination (default) or offset pagination (legacy support):

```typescript
// Request
GET /api/v1/leads?page=2&perPage=20&sortBy=createdAt&sortDir=desc

// Response envelope (all list endpoints)
{
  "data": [...],
  "meta": {
    "total": 1247,
    "page": 2,
    "perPage": 20,
    "totalPages": 63,
    "hasNextPage": true,
    "hasPreviousPage": true,
    "nextCursor": "eyJpZCI6Ij...",  // for cursor-based pagination
    "previousCursor": "eyJpZCI6Ij..."
  }
}
```

**Cursor-based pagination** (Phase 3+): preferred for real-time data (leads, activities) where offset pagination causes "missing records" bugs when data changes between pages.

### 9.4 Error Response Standard

```typescript
// All error responses follow this schema
interface APIError {
  error: string;           // Machine-readable error code
  message: string;         // Human-readable description
  fields?: {               // Validation errors only
    field: string;
    message: string;
    value?: unknown;
  }[];
  reference?: string;      // Sentry error ID for support
  documentation?: string;  // Link to API docs for this endpoint
}
```

### 9.5 Request Validation Standard

```typescript
// Using Zod schemas for all incoming request bodies
import { z } from 'zod';
import { validateRequest } from '../middleware/validation';

const createLeadSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().optional(),
  phone: z.string().regex(/^\+971[0-9]{8,9}$/).optional(),
  budget: z.number().positive().optional(),
  propertyType: z.enum(['VILLA', 'APARTMENT', 'TOWNHOUSE', 'PENTHOUSE']).optional(),
  source: z.enum(['WEBSITE', 'WHATSAPP', 'REFERRAL', 'PROPERTYFINDER', 'BAYUT']),
});

router.post('/leads', 
  authMiddleware, 
  validateRequest(createLeadSchema), 
  LeadController.create
);
```

**Why Zod?** TypeScript-first; runtime validation + type inference from one schema; better DX than Joi; smaller bundle than class-validator.

---

## 10. API Performance Standards

### 10.1 Response Time Targets

| Endpoint Category | p50 Target | p95 Target | p99 Target |
|-----------------|-----------|-----------|-----------|
| Auth (login/register) | < 150ms | < 500ms | < 1s |
| Simple CRUD (GET by ID) | < 50ms | < 200ms | < 500ms |
| List with pagination | < 100ms | < 300ms | < 800ms |
| Complex aggregations | < 200ms | < 800ms | < 2s |
| Search (Elasticsearch — Phase 7) | < 50ms | < 150ms | < 300ms |
| AI inference (lead scoring) | < 200ms | < 800ms | < 2s |
| File upload | < 500ms processing | < 2s | < 5s |
| Document generation (PDF) | < 2s | < 5s | < 10s |
| WhatsApp send | < 1s | < 3s | < 10s |

### 10.2 Caching Strategy by Endpoint

| Endpoint | Cache Layer | TTL | Invalidation |
|---------|-----------|-----|-------------|
| `GET /api/v1/properties` (public) | CDN (Vercel Edge) + Redis | 5 min | On any property update |
| `GET /api/v1/properties/:id` (public) | Redis | 15 min | On property update |
| `GET /api/v1/properties/search` | Redis (query hash as key) | 2 min | On property updates in area |
| `GET /api/v1/analytics/kpis` | Redis | 1 hour | On deal status change |
| `GET /api/v1/market/price-trends` | Redis | 24 hours | Manual invalidation |
| Lead CRUD | No cache | — | Always fresh |
| Auth endpoints | No cache | — | Never cache |
| Document generation | No cache | — | Always generate fresh |

### 10.3 MongoDB Index Requirements

Every heavily-queried field must have an index. Current index policy:

```javascript
// /prisma/schema.prisma — index declarations
model Lead {
  // Indexes required for common queries:
  @@index([status])           // Filter by pipeline stage
  @@index([agentId])          // Filter by assigned agent
  @@index([createdAt])        // Sort by newest
  @@index([source])           // Filter by lead source
  @@index([updatedAt])        // For change stream sync
  @@index([email])            // Deduplication lookup
  @@index([phone])            // Deduplication lookup
  @@index([agentId, status])  // Compound: agent's pipeline view
}

model Property {
  @@index([status])           // Filter by PUBLISHED/DRAFT
  @@index([type])             // Filter by property type
  @@index([communityId])      // Filter by community
  @@index([price])            // Sort/filter by price
  @@index([bedrooms])         // Filter by bedrooms
  @@index([status, type])     // Compound: search filter
}
```

**Rule:** Any query that appears in the top 20 by frequency (via Atlas Performance Advisor) must have a compound index covering its full `find()` filter + `sort()`.

---

## 11. API Documentation (OpenAPI / Swagger)

### 11.1 Implementation Plan (Phase 2)

```typescript
// Integration via swagger-jsdoc + swagger-ui-express
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions: swaggerJsDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'White Caves Real Estate API',
      version: '1.2.0',
      description: 'CRM and portal API for White Caves Real Estate LLC',
      contact: { name: 'Aurora (API Lead)', email: 'tech@whitecaves.ae' },
      license: { name: 'Private — Internal Use Only' },
    },
    servers: [
      { url: 'https://api.whitecaves.ae', description: 'Production' },
      { url: 'https://staging-api.whitecaves.ae', description: 'Staging' },
      { url: 'http://localhost:3001', description: 'Local Development' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/**/*.ts', './models/**/*.ts'],
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsDoc(swaggerOptions)));
```

### 11.2 JSDoc Comment Standard

```typescript
/**
 * @swagger
 * /api/v1/leads:
 *   post:
 *     summary: Create a new lead
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateLeadInput'
 *           example:
 *             firstName: "Mohammed"
 *             lastName: "Al-Rashidi"
 *             phone: "+971501234567"
 *             source: "WHATSAPP"
 *             budget: 2000000
 *     responses:
 *       201:
 *         description: Lead created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lead'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthenticated
 *       403:
 *         description: Insufficient permissions (role: sales_agent minimum)
 */
```

### 11.3 API Testing with Thunder Client / Postman

A shared collection is maintained at `docs/api/white-caves-api.postman_collection.json`:
- All endpoints documented with example requests
- Environment variables: `{{baseUrl}}`, `{{authToken}}`, `{{testLeadId}}`
- Pre-request script: auto-refresh JWT token on expiry
- Test scripts: assert status codes, response schema validation

---

**Document Owner:** Technology Department (Aurora — Platform Lead)
**Version History:** v1.0 March 2026; v1.1 April 2026 (security hardening); v2.0 April 2026 (principles + performance)
**Review Trigger:** Before any breaking API change; quarterly for performance targets
**Related Documents:**
- `business_docs/06_design_architecture/api-reference.md`
- `business/05_srs_and_engineering/srs-v2-2026.md`
- OpenAPI specification: `/openapi.json`
