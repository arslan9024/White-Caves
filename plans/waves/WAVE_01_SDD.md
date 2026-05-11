# WAVE_01 -- System Design Document (SDD)

> **Status:** DRAFT | Generated: 2026-05-06 | Modules: 17 | Rule 18: 10 evidence layers per module
> Expand each section with full evidence before requesting @Ada coding authorization.

## Evidence Layer Reference

| #   | Layer                 | Required Content                                    |
| --- | --------------------- | --------------------------------------------------- |
| 1   | Business Rule         | Core business logic, acceptance criteria            |
| 2   | API Contract          | Endpoint list, request/response JSON schema         |
| 3   | Data Schema           | Prisma model with all fields, types, relations      |
| 4   | Validation Rules      | Zod schema, field constraints, error messages       |
| 5   | Failure/Edge Handling | All error scenarios and HTTP codes                  |
| 6   | Security/Compliance   | RBAC roles, PII handling, RERA/DLD rules            |
| 7   | UX States             | Loading/empty/error states at 375/768/1440px + RTL  |
| 8   | Tests                 | Unit, integration, E2E file paths and scenario list |
| 9   | Observability         | Metrics, logging, alert thresholds                  |
| 10  | Rollback/Migration    | Prisma migration name, rollback trigger + procedure |

---

## Lane A -- Compliance/Legal/UX/AI

### @Sofia -- Compliance baseline expansion

| Field                    | Value                                                      |
| ------------------------ | ---------------------------------------------------------- |
| Task                     | T001                                                       |
| Lane                     | A                                                          |
| API Base                 | `/api/compliance`                                          |
| Business Doc             | `business_docs/05_requirements/compliance-requirements.md` |
| Evidence Layers Complete | 0/10 (DRAFT)                                               |

#### Layer 1 -- Business Rule

> Source: `business_docs/05_requirements/compliance-requirements.md` -- Top sections: 1. RERA (Real Estate Regulatory Agency) Requirements | 2. DLD (Dubai Land Department) Requirements | 3. Ejari (Tenancy Registration) Requirements | 4. Anti-Money Laundering (AML) Requirements | 5. UAE Personal Data Protection Law (PDPL)

- Core rule: [expand from business doc]
- Acceptance criteria: [expand from business doc]
- Dubai-specific rules (RERA/DLD): [expand from compliance-requirements.md]

#### Layer 2 -- API Contract

| Method | Route                 | Auth        | Description                     |
| ------ | --------------------- | ----------- | ------------------------------- |
| GET    | `/api/compliance`     | JWT         | List (paginated, ?page=&limit=) |
| GET    | `/api/compliance/:id` | JWT         | Get single record               |
| POST   | `/api/compliance`     | JWT + role  | Create                          |
| PUT    | `/api/compliance/:id` | JWT + owner | Update                          |
| DELETE | `/api/compliance/:id` | JWT + admin | Soft-delete                     |

```json
// POST /api/compliance -- request body (expand with real fields)
{}

// Response 201
{ "id": "cuid", "createdAt": "ISO8601" }
```

#### Layer 3 -- Data Schema

```prisma
model Sofia {
  id         String   @id @default(cuid())
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  // TODO: expand from business doc business_docs/05_requirements/compliance-requirements.md
  @@map("sofias")
}
```

#### Layer 4 -- Validation Rules

```typescript
// src/validators/sofia.validator.ts
import { z } from 'zod';
export const CreateSofiaSchema = z.object({
  // TODO: add fields from Layer 3 schema
});
```

#### Layer 5 -- Failure / Edge Handling

| Scenario          | HTTP | Response                                           |
| ----------------- | ---- | -------------------------------------------------- |
| Not found         | 404  | `{ error: 'NOT_FOUND', message: '...' }`           |
| Validation error  | 422  | `{ error: 'VALIDATION', fields: [...] }`           |
| Unauthorized      | 401  | `{ error: 'UNAUTHORIZED' }`                        |
| Forbidden (RBAC)  | 403  | `{ error: 'FORBIDDEN' }`                           |
| DB timeout        | 503  | `{ error: 'SERVICE_UNAVAILABLE', retryAfter: 30 }` |
| Upstream API down | 503  | Queue + exponential backoff (3 retries)            |

#### Layer 6 -- Security / Compliance

| Control            | Implementation                                         |
| ------------------ | ------------------------------------------------------ |
| RBAC roles allowed | [MD, Manager, Agent -- define per endpoint]            |
| PII fields         | Encrypt at rest (AES-256), mask in logs                |
| Input sanitization | Zod parse before any DB write                          |
| Audit trail        | Every mutation -> audit_trail collection (@Hedy)       |
| RERA compliance    | Rules from compliance-requirements.md Section [TBD]    |
| Rate limit         | 100 req/min per user (Express rate-limiter middleware) |

#### Layer 7 -- UX States

| State   | 375px (Mobile)   | 768px (Tablet) | 1440px (Desktop) | RTL      |
| ------- | ---------------- | -------------- | ---------------- | -------- |
| Loading | Skeleton card    | Skeleton grid  | Skeleton table   | Mirror   |
| Empty   | Icon + msg + CTA | Same           | Same             | Mirrored |
| Error   | Toast + retry    | Toast + retry  | Inline alert     | Mirrored |
| Success | Toast green 3s   | Same           | Same             | Mirrored |
| Offline | Banner + queue   | Same           | Same             | Mirrored |

#### Layer 8 -- Tests

| Type        | File                             | Key Scenarios                     |
| ----------- | -------------------------------- | --------------------------------- |
| Unit        | `src/services/sofia.test.ts`     | CRUD happy path, validation, auth |
| Integration | `test/sofia.integration.test.ts` | DB round-trip, RERA rules         |
| E2E         | `e2e/sofia.spec.ts`              | Full flow: UI -> API -> DB        |

> Coverage target: unit >= 90% | integration >= 80% | E2E >= critical paths

#### Layer 9 -- Observability

| Metric            | Type      | Alert         |
| ----------------- | --------- | ------------- |
| p95 response time | Histogram | > 500ms       |
| Error rate        | Counter   | > 1%/min      |
| DB query time     | Histogram | > 200ms       |
| Auth failures     | Counter   | > 10/min      |
| Queue depth       | Gauge     | > 100 pending |

> Log fields: requestId, userId, agentId, entityType, durationMs, statusCode

#### Layer 10 -- Rollback / Migration

- Migration name: `20260506_add_sofia`
- Rollback trigger: error rate > 5% sustained for 5 minutes
- Rollback procedure:
  1. `prisma migrate resolve --rolled-back <migration-name>`
  2. Redeploy previous Docker image tag
  3. Verify health endpoint returns 200
- Data rollback: MongoDB point-in-time restore (15-min RPO) via Atlas
- Feature flag: `ENABLE_SOFIA` env var for gradual rollout

### @Timnit -- DLD/legal integration expansion

| Field                    | Value                                              |
| ------------------------ | -------------------------------------------------- |
| Task                     | T002                                               |
| Lane                     | A                                                  |
| API Base                 | `/api/dld`                                         |
| Business Doc             | `business_docs/09_crm_features/dld-integration.md` |
| Evidence Layers Complete | 0/10 (DRAFT)                                       |

#### Layer 1 -- Business Rule

> Source: `business_docs/09_crm_features/dld-integration.md` -- Top sections: Overview | TODO â€” @Timnit Task 1

- Core rule: [expand from business doc]
- Acceptance criteria: [expand from business doc]
- Dubai-specific rules (RERA/DLD): [expand from compliance-requirements.md]

#### Layer 2 -- API Contract

| Method | Route          | Auth        | Description                     |
| ------ | -------------- | ----------- | ------------------------------- |
| GET    | `/api/dld`     | JWT         | List (paginated, ?page=&limit=) |
| GET    | `/api/dld/:id` | JWT         | Get single record               |
| POST   | `/api/dld`     | JWT + role  | Create                          |
| PUT    | `/api/dld/:id` | JWT + owner | Update                          |
| DELETE | `/api/dld/:id` | JWT + admin | Soft-delete                     |

```json
// POST /api/dld -- request body (expand with real fields)
{}

// Response 201
{ "id": "cuid", "createdAt": "ISO8601" }
```

#### Layer 3 -- Data Schema

```prisma
model Timnit {
  id         String   @id @default(cuid())
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  // TODO: expand from business doc business_docs/09_crm_features/dld-integration.md
  @@map("timnits")
}
```

#### Layer 4 -- Validation Rules

```typescript
// src/validators/timnit.validator.ts
import { z } from 'zod';
export const CreateTimnitSchema = z.object({
  // TODO: add fields from Layer 3 schema
});
```

#### Layer 5 -- Failure / Edge Handling

| Scenario          | HTTP | Response                                           |
| ----------------- | ---- | -------------------------------------------------- |
| Not found         | 404  | `{ error: 'NOT_FOUND', message: '...' }`           |
| Validation error  | 422  | `{ error: 'VALIDATION', fields: [...] }`           |
| Unauthorized      | 401  | `{ error: 'UNAUTHORIZED' }`                        |
| Forbidden (RBAC)  | 403  | `{ error: 'FORBIDDEN' }`                           |
| DB timeout        | 503  | `{ error: 'SERVICE_UNAVAILABLE', retryAfter: 30 }` |
| Upstream API down | 503  | Queue + exponential backoff (3 retries)            |

#### Layer 6 -- Security / Compliance

| Control            | Implementation                                         |
| ------------------ | ------------------------------------------------------ |
| RBAC roles allowed | [MD, Manager, Agent -- define per endpoint]            |
| PII fields         | Encrypt at rest (AES-256), mask in logs                |
| Input sanitization | Zod parse before any DB write                          |
| Audit trail        | Every mutation -> audit_trail collection (@Hedy)       |
| RERA compliance    | Rules from compliance-requirements.md Section [TBD]    |
| Rate limit         | 100 req/min per user (Express rate-limiter middleware) |

#### Layer 7 -- UX States

| State   | 375px (Mobile)   | 768px (Tablet) | 1440px (Desktop) | RTL      |
| ------- | ---------------- | -------------- | ---------------- | -------- |
| Loading | Skeleton card    | Skeleton grid  | Skeleton table   | Mirror   |
| Empty   | Icon + msg + CTA | Same           | Same             | Mirrored |
| Error   | Toast + retry    | Toast + retry  | Inline alert     | Mirrored |
| Success | Toast green 3s   | Same           | Same             | Mirrored |
| Offline | Banner + queue   | Same           | Same             | Mirrored |

#### Layer 8 -- Tests

| Type        | File                              | Key Scenarios                     |
| ----------- | --------------------------------- | --------------------------------- |
| Unit        | `src/services/timnit.test.ts`     | CRUD happy path, validation, auth |
| Integration | `test/timnit.integration.test.ts` | DB round-trip, RERA rules         |
| E2E         | `e2e/timnit.spec.ts`              | Full flow: UI -> API -> DB        |

> Coverage target: unit >= 90% | integration >= 80% | E2E >= critical paths

#### Layer 9 -- Observability

| Metric            | Type      | Alert         |
| ----------------- | --------- | ------------- |
| p95 response time | Histogram | > 500ms       |
| Error rate        | Counter   | > 1%/min      |
| DB query time     | Histogram | > 200ms       |
| Auth failures     | Counter   | > 10/min      |
| Queue depth       | Gauge     | > 100 pending |

> Log fields: requestId, userId, agentId, entityType, durationMs, statusCode

#### Layer 10 -- Rollback / Migration

- Migration name: `20260506_add_timnit`
- Rollback trigger: error rate > 5% sustained for 5 minutes
- Rollback procedure:
  1. `prisma migrate resolve --rolled-back <migration-name>`
  2. Redeploy previous Docker image tag
  3. Verify health endpoint returns 200
- Data rollback: MongoDB point-in-time restore (15-min RPO) via Atlas
- Feature flag: `ENABLE_TIMNIT` env var for gradual rollout

### @Victoria -- Tenancy legal workflow completion

| Field                    | Value                                            |
| ------------------------ | ------------------------------------------------ |
| Task                     | T003                                             |
| Lane                     | A                                                |
| API Base                 | `/api/tenancy`                                   |
| Business Doc             | `business_docs/09_crm_features/tenancy-ejari.md` |
| Evidence Layers Complete | 0/10 (DRAFT)                                     |

#### Layer 1 -- Business Rule

> Source: `business_docs/09_crm_features/tenancy-ejari.md` -- Top sections: Overview | User Stories | Data Models | API Endpoints | Ejari Compliance Rules

- Core rule: [expand from business doc]
- Acceptance criteria: [expand from business doc]
- Dubai-specific rules (RERA/DLD): [expand from compliance-requirements.md]

#### Layer 2 -- API Contract

| Method | Route              | Auth        | Description                     |
| ------ | ------------------ | ----------- | ------------------------------- |
| GET    | `/api/tenancy`     | JWT         | List (paginated, ?page=&limit=) |
| GET    | `/api/tenancy/:id` | JWT         | Get single record               |
| POST   | `/api/tenancy`     | JWT + role  | Create                          |
| PUT    | `/api/tenancy/:id` | JWT + owner | Update                          |
| DELETE | `/api/tenancy/:id` | JWT + admin | Soft-delete                     |

```json
// POST /api/tenancy -- request body (expand with real fields)
{}

// Response 201
{ "id": "cuid", "createdAt": "ISO8601" }
```

#### Layer 3 -- Data Schema

```prisma
model Victoria {
  id         String   @id @default(cuid())
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  // TODO: expand from business doc business_docs/09_crm_features/tenancy-ejari.md
  @@map("victorias")
}
```

#### Layer 4 -- Validation Rules

```typescript
// src/validators/victoria.validator.ts
import { z } from 'zod';
export const CreateVictoriaSchema = z.object({
  // TODO: add fields from Layer 3 schema
});
```

#### Layer 5 -- Failure / Edge Handling

| Scenario          | HTTP | Response                                           |
| ----------------- | ---- | -------------------------------------------------- |
| Not found         | 404  | `{ error: 'NOT_FOUND', message: '...' }`           |
| Validation error  | 422  | `{ error: 'VALIDATION', fields: [...] }`           |
| Unauthorized      | 401  | `{ error: 'UNAUTHORIZED' }`                        |
| Forbidden (RBAC)  | 403  | `{ error: 'FORBIDDEN' }`                           |
| DB timeout        | 503  | `{ error: 'SERVICE_UNAVAILABLE', retryAfter: 30 }` |
| Upstream API down | 503  | Queue + exponential backoff (3 retries)            |

#### Layer 6 -- Security / Compliance

| Control            | Implementation                                         |
| ------------------ | ------------------------------------------------------ |
| RBAC roles allowed | [MD, Manager, Agent -- define per endpoint]            |
| PII fields         | Encrypt at rest (AES-256), mask in logs                |
| Input sanitization | Zod parse before any DB write                          |
| Audit trail        | Every mutation -> audit_trail collection (@Hedy)       |
| RERA compliance    | Rules from compliance-requirements.md Section [TBD]    |
| Rate limit         | 100 req/min per user (Express rate-limiter middleware) |

#### Layer 7 -- UX States

| State   | 375px (Mobile)   | 768px (Tablet) | 1440px (Desktop) | RTL      |
| ------- | ---------------- | -------------- | ---------------- | -------- |
| Loading | Skeleton card    | Skeleton grid  | Skeleton table   | Mirror   |
| Empty   | Icon + msg + CTA | Same           | Same             | Mirrored |
| Error   | Toast + retry    | Toast + retry  | Inline alert     | Mirrored |
| Success | Toast green 3s   | Same           | Same             | Mirrored |
| Offline | Banner + queue   | Same           | Same             | Mirrored |

#### Layer 8 -- Tests

| Type        | File                                | Key Scenarios                     |
| ----------- | ----------------------------------- | --------------------------------- |
| Unit        | `src/services/victoria.test.ts`     | CRUD happy path, validation, auth |
| Integration | `test/victoria.integration.test.ts` | DB round-trip, RERA rules         |
| E2E         | `e2e/victoria.spec.ts`              | Full flow: UI -> API -> DB        |

> Coverage target: unit >= 90% | integration >= 80% | E2E >= critical paths

#### Layer 9 -- Observability

| Metric            | Type      | Alert         |
| ----------------- | --------- | ------------- |
| p95 response time | Histogram | > 500ms       |
| Error rate        | Counter   | > 1%/min      |
| DB query time     | Histogram | > 200ms       |
| Auth failures     | Counter   | > 10/min      |
| Queue depth       | Gauge     | > 100 pending |

> Log fields: requestId, userId, agentId, entityType, durationMs, statusCode

#### Layer 10 -- Rollback / Migration

- Migration name: `20260506_add_victoria`
- Rollback trigger: error rate > 5% sustained for 5 minutes
- Rollback procedure:
  1. `prisma migrate resolve --rolled-back <migration-name>`
  2. Redeploy previous Docker image tag
  3. Verify health endpoint returns 200
- Data rollback: MongoDB point-in-time restore (15-min RPO) via Atlas
- Feature flag: `ENABLE_VICTORIA` env var for gradual rollout

### @Annie -- Tenant portal and doc-gen expansion

| Field                    | Value                                            |
| ------------------------ | ------------------------------------------------ |
| Task                     | T004                                             |
| Lane                     | A                                                |
| API Base                 | `/api/tenant-portal`                             |
| Business Doc             | `business_docs/09_crm_features/tenant-portal.md` |
| Evidence Layers Complete | 0/10 (DRAFT)                                     |

#### Layer 1 -- Business Rule

> Source: `business_docs/09_crm_features/tenant-portal.md` -- Top sections: ðŸš€ Next Step â€” Invoke @Annie | Overview | User Stories | Dashboard | Lease Management

- Core rule: [expand from business doc]
- Acceptance criteria: [expand from business doc]
- Dubai-specific rules (RERA/DLD): [expand from compliance-requirements.md]

#### Layer 2 -- API Contract

| Method | Route                    | Auth        | Description                     |
| ------ | ------------------------ | ----------- | ------------------------------- |
| GET    | `/api/tenant-portal`     | JWT         | List (paginated, ?page=&limit=) |
| GET    | `/api/tenant-portal/:id` | JWT         | Get single record               |
| POST   | `/api/tenant-portal`     | JWT + role  | Create                          |
| PUT    | `/api/tenant-portal/:id` | JWT + owner | Update                          |
| DELETE | `/api/tenant-portal/:id` | JWT + admin | Soft-delete                     |

```json
// POST /api/tenant-portal -- request body (expand with real fields)
{}

// Response 201
{ "id": "cuid", "createdAt": "ISO8601" }
```

#### Layer 3 -- Data Schema

```prisma
model Annie {
  id         String   @id @default(cuid())
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  // TODO: expand from business doc business_docs/09_crm_features/tenant-portal.md
  @@map("annies")
}
```

#### Layer 4 -- Validation Rules

```typescript
// src/validators/annie.validator.ts
import { z } from 'zod';
export const CreateAnnieSchema = z.object({
  // TODO: add fields from Layer 3 schema
});
```

#### Layer 5 -- Failure / Edge Handling

| Scenario          | HTTP | Response                                           |
| ----------------- | ---- | -------------------------------------------------- |
| Not found         | 404  | `{ error: 'NOT_FOUND', message: '...' }`           |
| Validation error  | 422  | `{ error: 'VALIDATION', fields: [...] }`           |
| Unauthorized      | 401  | `{ error: 'UNAUTHORIZED' }`                        |
| Forbidden (RBAC)  | 403  | `{ error: 'FORBIDDEN' }`                           |
| DB timeout        | 503  | `{ error: 'SERVICE_UNAVAILABLE', retryAfter: 30 }` |
| Upstream API down | 503  | Queue + exponential backoff (3 retries)            |

#### Layer 6 -- Security / Compliance

| Control            | Implementation                                         |
| ------------------ | ------------------------------------------------------ |
| RBAC roles allowed | [MD, Manager, Agent -- define per endpoint]            |
| PII fields         | Encrypt at rest (AES-256), mask in logs                |
| Input sanitization | Zod parse before any DB write                          |
| Audit trail        | Every mutation -> audit_trail collection (@Hedy)       |
| RERA compliance    | Rules from compliance-requirements.md Section [TBD]    |
| Rate limit         | 100 req/min per user (Express rate-limiter middleware) |

#### Layer 7 -- UX States

| State   | 375px (Mobile)   | 768px (Tablet) | 1440px (Desktop) | RTL      |
| ------- | ---------------- | -------------- | ---------------- | -------- |
| Loading | Skeleton card    | Skeleton grid  | Skeleton table   | Mirror   |
| Empty   | Icon + msg + CTA | Same           | Same             | Mirrored |
| Error   | Toast + retry    | Toast + retry  | Inline alert     | Mirrored |
| Success | Toast green 3s   | Same           | Same             | Mirrored |
| Offline | Banner + queue   | Same           | Same             | Mirrored |

#### Layer 8 -- Tests

| Type        | File                             | Key Scenarios                     |
| ----------- | -------------------------------- | --------------------------------- |
| Unit        | `src/services/annie.test.ts`     | CRUD happy path, validation, auth |
| Integration | `test/annie.integration.test.ts` | DB round-trip, RERA rules         |
| E2E         | `e2e/annie.spec.ts`              | Full flow: UI -> API -> DB        |

> Coverage target: unit >= 90% | integration >= 80% | E2E >= critical paths

#### Layer 9 -- Observability

| Metric            | Type      | Alert         |
| ----------------- | --------- | ------------- |
| p95 response time | Histogram | > 500ms       |
| Error rate        | Counter   | > 1%/min      |
| DB query time     | Histogram | > 200ms       |
| Auth failures     | Counter   | > 10/min      |
| Queue depth       | Gauge     | > 100 pending |

> Log fields: requestId, userId, agentId, entityType, durationMs, statusCode

#### Layer 10 -- Rollback / Migration

- Migration name: `20260506_add_annie`
- Rollback trigger: error rate > 5% sustained for 5 minutes
- Rollback procedure:
  1. `prisma migrate resolve --rolled-back <migration-name>`
  2. Redeploy previous Docker image tag
  3. Verify health endpoint returns 200
- Data rollback: MongoDB point-in-time restore (15-min RPO) via Atlas
- Feature flag: `ENABLE_ANNIE` env var for gradual rollout

### @Marissa -- UX and luxury journey synthesis

| Field                    | Value                                             |
| ------------------------ | ------------------------------------------------- |
| Task                     | T005                                              |
| Lane                     | A                                                 |
| API Base                 | `/api/luxury`                                     |
| Business Doc             | `business_docs/09_crm_features/luxury-segment.md` |
| Evidence Layers Complete | 0/10 (DRAFT)                                      |

#### Layer 1 -- Business Rule

> [PENDING] Business doc below target depth. Free agents must expand before coding.

- Core rule: [expand from business doc]
- Acceptance criteria: [expand from business doc]
- Dubai-specific rules (RERA/DLD): [expand from compliance-requirements.md]

#### Layer 2 -- API Contract

| Method | Route             | Auth        | Description                     |
| ------ | ----------------- | ----------- | ------------------------------- |
| GET    | `/api/luxury`     | JWT         | List (paginated, ?page=&limit=) |
| GET    | `/api/luxury/:id` | JWT         | Get single record               |
| POST   | `/api/luxury`     | JWT + role  | Create                          |
| PUT    | `/api/luxury/:id` | JWT + owner | Update                          |
| DELETE | `/api/luxury/:id` | JWT + admin | Soft-delete                     |

```json
// POST /api/luxury -- request body (expand with real fields)
{}

// Response 201
{ "id": "cuid", "createdAt": "ISO8601" }
```

#### Layer 3 -- Data Schema

```prisma
model Marissa {
  id         String   @id @default(cuid())
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  // TODO: expand from business doc business_docs/09_crm_features/luxury-segment.md
  @@map("marissas")
}
```

#### Layer 4 -- Validation Rules

```typescript
// src/validators/marissa.validator.ts
import { z } from 'zod';
export const CreateMarissaSchema = z.object({
  // TODO: add fields from Layer 3 schema
});
```

#### Layer 5 -- Failure / Edge Handling

| Scenario          | HTTP | Response                                           |
| ----------------- | ---- | -------------------------------------------------- |
| Not found         | 404  | `{ error: 'NOT_FOUND', message: '...' }`           |
| Validation error  | 422  | `{ error: 'VALIDATION', fields: [...] }`           |
| Unauthorized      | 401  | `{ error: 'UNAUTHORIZED' }`                        |
| Forbidden (RBAC)  | 403  | `{ error: 'FORBIDDEN' }`                           |
| DB timeout        | 503  | `{ error: 'SERVICE_UNAVAILABLE', retryAfter: 30 }` |
| Upstream API down | 503  | Queue + exponential backoff (3 retries)            |

#### Layer 6 -- Security / Compliance

| Control            | Implementation                                         |
| ------------------ | ------------------------------------------------------ |
| RBAC roles allowed | [MD, Manager, Agent -- define per endpoint]            |
| PII fields         | Encrypt at rest (AES-256), mask in logs                |
| Input sanitization | Zod parse before any DB write                          |
| Audit trail        | Every mutation -> audit_trail collection (@Hedy)       |
| RERA compliance    | Rules from compliance-requirements.md Section [TBD]    |
| Rate limit         | 100 req/min per user (Express rate-limiter middleware) |

#### Layer 7 -- UX States

| State   | 375px (Mobile)   | 768px (Tablet) | 1440px (Desktop) | RTL      |
| ------- | ---------------- | -------------- | ---------------- | -------- |
| Loading | Skeleton card    | Skeleton grid  | Skeleton table   | Mirror   |
| Empty   | Icon + msg + CTA | Same           | Same             | Mirrored |
| Error   | Toast + retry    | Toast + retry  | Inline alert     | Mirrored |
| Success | Toast green 3s   | Same           | Same             | Mirrored |
| Offline | Banner + queue   | Same           | Same             | Mirrored |

#### Layer 8 -- Tests

| Type        | File                               | Key Scenarios                     |
| ----------- | ---------------------------------- | --------------------------------- |
| Unit        | `src/services/marissa.test.ts`     | CRUD happy path, validation, auth |
| Integration | `test/marissa.integration.test.ts` | DB round-trip, RERA rules         |
| E2E         | `e2e/marissa.spec.ts`              | Full flow: UI -> API -> DB        |

> Coverage target: unit >= 90% | integration >= 80% | E2E >= critical paths

#### Layer 9 -- Observability

| Metric            | Type      | Alert         |
| ----------------- | --------- | ------------- |
| p95 response time | Histogram | > 500ms       |
| Error rate        | Counter   | > 1%/min      |
| DB query time     | Histogram | > 200ms       |
| Auth failures     | Counter   | > 10/min      |
| Queue depth       | Gauge     | > 100 pending |

> Log fields: requestId, userId, agentId, entityType, durationMs, statusCode

#### Layer 10 -- Rollback / Migration

- Migration name: `20260506_add_marissa`
- Rollback trigger: error rate > 5% sustained for 5 minutes
- Rollback procedure:
  1. `prisma migrate resolve --rolled-back <migration-name>`
  2. Redeploy previous Docker image tag
  3. Verify health endpoint returns 200
- Data rollback: MongoDB point-in-time restore (15-min RPO) via Atlas
- Feature flag: `ENABLE_MARISSA` env var for gradual rollout

### @Rachel -- SEO/marketing strategy enrichment

| Field                    | Value                                           |
| ------------------------ | ----------------------------------------------- |
| Task                     | T006                                            |
| Lane                     | A                                               |
| API Base                 | `/api/seo`                                      |
| Business Doc             | `business_docs/09_crm_features/seo-strategy.md` |
| Evidence Layers Complete | 0/10 (DRAFT)                                    |

#### Layer 1 -- Business Rule

> [PENDING] Business doc below target depth. Free agents must expand before coding.

- Core rule: [expand from business doc]
- Acceptance criteria: [expand from business doc]
- Dubai-specific rules (RERA/DLD): [expand from compliance-requirements.md]

#### Layer 2 -- API Contract

| Method | Route          | Auth        | Description                     |
| ------ | -------------- | ----------- | ------------------------------- |
| GET    | `/api/seo`     | JWT         | List (paginated, ?page=&limit=) |
| GET    | `/api/seo/:id` | JWT         | Get single record               |
| POST   | `/api/seo`     | JWT + role  | Create                          |
| PUT    | `/api/seo/:id` | JWT + owner | Update                          |
| DELETE | `/api/seo/:id` | JWT + admin | Soft-delete                     |

```json
// POST /api/seo -- request body (expand with real fields)
{}

// Response 201
{ "id": "cuid", "createdAt": "ISO8601" }
```

#### Layer 3 -- Data Schema

```prisma
model Rachel {
  id         String   @id @default(cuid())
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  // TODO: expand from business doc business_docs/09_crm_features/seo-strategy.md
  @@map("rachels")
}
```

#### Layer 4 -- Validation Rules

```typescript
// src/validators/rachel.validator.ts
import { z } from 'zod';
export const CreateRachelSchema = z.object({
  // TODO: add fields from Layer 3 schema
});
```

#### Layer 5 -- Failure / Edge Handling

| Scenario          | HTTP | Response                                           |
| ----------------- | ---- | -------------------------------------------------- |
| Not found         | 404  | `{ error: 'NOT_FOUND', message: '...' }`           |
| Validation error  | 422  | `{ error: 'VALIDATION', fields: [...] }`           |
| Unauthorized      | 401  | `{ error: 'UNAUTHORIZED' }`                        |
| Forbidden (RBAC)  | 403  | `{ error: 'FORBIDDEN' }`                           |
| DB timeout        | 503  | `{ error: 'SERVICE_UNAVAILABLE', retryAfter: 30 }` |
| Upstream API down | 503  | Queue + exponential backoff (3 retries)            |

#### Layer 6 -- Security / Compliance

| Control            | Implementation                                         |
| ------------------ | ------------------------------------------------------ |
| RBAC roles allowed | [MD, Manager, Agent -- define per endpoint]            |
| PII fields         | Encrypt at rest (AES-256), mask in logs                |
| Input sanitization | Zod parse before any DB write                          |
| Audit trail        | Every mutation -> audit_trail collection (@Hedy)       |
| RERA compliance    | Rules from compliance-requirements.md Section [TBD]    |
| Rate limit         | 100 req/min per user (Express rate-limiter middleware) |

#### Layer 7 -- UX States

| State   | 375px (Mobile)   | 768px (Tablet) | 1440px (Desktop) | RTL      |
| ------- | ---------------- | -------------- | ---------------- | -------- |
| Loading | Skeleton card    | Skeleton grid  | Skeleton table   | Mirror   |
| Empty   | Icon + msg + CTA | Same           | Same             | Mirrored |
| Error   | Toast + retry    | Toast + retry  | Inline alert     | Mirrored |
| Success | Toast green 3s   | Same           | Same             | Mirrored |
| Offline | Banner + queue   | Same           | Same             | Mirrored |

#### Layer 8 -- Tests

| Type        | File                              | Key Scenarios                     |
| ----------- | --------------------------------- | --------------------------------- |
| Unit        | `src/services/rachel.test.ts`     | CRUD happy path, validation, auth |
| Integration | `test/rachel.integration.test.ts` | DB round-trip, RERA rules         |
| E2E         | `e2e/rachel.spec.ts`              | Full flow: UI -> API -> DB        |

> Coverage target: unit >= 90% | integration >= 80% | E2E >= critical paths

#### Layer 9 -- Observability

| Metric            | Type      | Alert         |
| ----------------- | --------- | ------------- |
| p95 response time | Histogram | > 500ms       |
| Error rate        | Counter   | > 1%/min      |
| DB query time     | Histogram | > 200ms       |
| Auth failures     | Counter   | > 10/min      |
| Queue depth       | Gauge     | > 100 pending |

> Log fields: requestId, userId, agentId, entityType, durationMs, statusCode

#### Layer 10 -- Rollback / Migration

- Migration name: `20260506_add_rachel`
- Rollback trigger: error rate > 5% sustained for 5 minutes
- Rollback procedure:
  1. `prisma migrate resolve --rolled-back <migration-name>`
  2. Redeploy previous Docker image tag
  3. Verify health endpoint returns 200
- Data rollback: MongoDB point-in-time restore (15-min RPO) via Atlas
- Feature flag: `ENABLE_RACHEL` env var for gradual rollout

### @Joelle -- AI persona and fallback matrix handoff

| Field                    | Value                                      |
| ------------------------ | ------------------------------------------ |
| Task                     | T007                                       |
| Lane                     | A                                          |
| API Base                 | `/api/ai-assistants`                       |
| Business Doc             | `business_docs/03_ai_assistants/README.md` |
| Evidence Layers Complete | 0/10 (DRAFT)                               |

#### Layer 1 -- Business Rule

> Source: `business_docs/03_ai_assistants/README.md` -- Top sections: Overview | ðŸ”´ CRITICAL BUSINESS ASSISTANTS (Owner-Exclusive) | ðŸ”µ CORE BUSINESS ASSISTANTS (Department-Specific) | ðŸŸ£ TECHNOLOGY ASSISTANTS | ðŸ“Š DATA FLOW ARCHITECTURE

- Core rule: [expand from business doc]
- Acceptance criteria: [expand from business doc]
- Dubai-specific rules (RERA/DLD): [expand from compliance-requirements.md]

#### Layer 2 -- API Contract

| Method | Route                    | Auth        | Description                     |
| ------ | ------------------------ | ----------- | ------------------------------- |
| GET    | `/api/ai-assistants`     | JWT         | List (paginated, ?page=&limit=) |
| GET    | `/api/ai-assistants/:id` | JWT         | Get single record               |
| POST   | `/api/ai-assistants`     | JWT + role  | Create                          |
| PUT    | `/api/ai-assistants/:id` | JWT + owner | Update                          |
| DELETE | `/api/ai-assistants/:id` | JWT + admin | Soft-delete                     |

```json
// POST /api/ai-assistants -- request body (expand with real fields)
{}

// Response 201
{ "id": "cuid", "createdAt": "ISO8601" }
```

#### Layer 3 -- Data Schema

```prisma
model Joelle {
  id         String   @id @default(cuid())
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  // TODO: expand from business doc business_docs/03_ai_assistants/README.md
  @@map("joelles")
}
```

#### Layer 4 -- Validation Rules

```typescript
// src/validators/joelle.validator.ts
import { z } from 'zod';
export const CreateJoelleSchema = z.object({
  // TODO: add fields from Layer 3 schema
});
```

#### Layer 5 -- Failure / Edge Handling

| Scenario          | HTTP | Response                                           |
| ----------------- | ---- | -------------------------------------------------- |
| Not found         | 404  | `{ error: 'NOT_FOUND', message: '...' }`           |
| Validation error  | 422  | `{ error: 'VALIDATION', fields: [...] }`           |
| Unauthorized      | 401  | `{ error: 'UNAUTHORIZED' }`                        |
| Forbidden (RBAC)  | 403  | `{ error: 'FORBIDDEN' }`                           |
| DB timeout        | 503  | `{ error: 'SERVICE_UNAVAILABLE', retryAfter: 30 }` |
| Upstream API down | 503  | Queue + exponential backoff (3 retries)            |

#### Layer 6 -- Security / Compliance

| Control            | Implementation                                         |
| ------------------ | ------------------------------------------------------ |
| RBAC roles allowed | [MD, Manager, Agent -- define per endpoint]            |
| PII fields         | Encrypt at rest (AES-256), mask in logs                |
| Input sanitization | Zod parse before any DB write                          |
| Audit trail        | Every mutation -> audit_trail collection (@Hedy)       |
| RERA compliance    | Rules from compliance-requirements.md Section [TBD]    |
| Rate limit         | 100 req/min per user (Express rate-limiter middleware) |

#### Layer 7 -- UX States

| State   | 375px (Mobile)   | 768px (Tablet) | 1440px (Desktop) | RTL      |
| ------- | ---------------- | -------------- | ---------------- | -------- |
| Loading | Skeleton card    | Skeleton grid  | Skeleton table   | Mirror   |
| Empty   | Icon + msg + CTA | Same           | Same             | Mirrored |
| Error   | Toast + retry    | Toast + retry  | Inline alert     | Mirrored |
| Success | Toast green 3s   | Same           | Same             | Mirrored |
| Offline | Banner + queue   | Same           | Same             | Mirrored |

#### Layer 8 -- Tests

| Type        | File                              | Key Scenarios                     |
| ----------- | --------------------------------- | --------------------------------- |
| Unit        | `src/services/joelle.test.ts`     | CRUD happy path, validation, auth |
| Integration | `test/joelle.integration.test.ts` | DB round-trip, RERA rules         |
| E2E         | `e2e/joelle.spec.ts`              | Full flow: UI -> API -> DB        |

> Coverage target: unit >= 90% | integration >= 80% | E2E >= critical paths

#### Layer 9 -- Observability

| Metric            | Type      | Alert         |
| ----------------- | --------- | ------------- |
| p95 response time | Histogram | > 500ms       |
| Error rate        | Counter   | > 1%/min      |
| DB query time     | Histogram | > 200ms       |
| Auth failures     | Counter   | > 10/min      |
| Queue depth       | Gauge     | > 100 pending |

> Log fields: requestId, userId, agentId, entityType, durationMs, statusCode

#### Layer 10 -- Rollback / Migration

- Migration name: `20260506_add_joelle`
- Rollback trigger: error rate > 5% sustained for 5 minutes
- Rollback procedure:
  1. `prisma migrate resolve --rolled-back <migration-name>`
  2. Redeploy previous Docker image tag
  3. Verify health endpoint returns 200
- Data rollback: MongoDB point-in-time restore (15-min RPO) via Atlas
- Feature flag: `ENABLE_JOELLE` env var for gradual rollout

---

## Lane B -- Valuation/Market/Finance

### @Fei-Fei -- Valuation and market inputs

| Field                    | Value                                                 |
| ------------------------ | ----------------------------------------------------- |
| Task                     | T008                                                  |
| Lane                     | B                                                     |
| API Base                 | `/api/valuations`                                     |
| Business Doc             | `business_docs/09_crm_features/property-valuation.md` |
| Evidence Layers Complete | 0/10 (DRAFT)                                          |

#### Layer 1 -- Business Rule

> [PENDING] Business doc below target depth. Free agents must expand before coding.

- Core rule: [expand from business doc]
- Acceptance criteria: [expand from business doc]
- Dubai-specific rules (RERA/DLD): [expand from compliance-requirements.md]

#### Layer 2 -- API Contract

| Method | Route                 | Auth        | Description                     |
| ------ | --------------------- | ----------- | ------------------------------- |
| GET    | `/api/valuations`     | JWT         | List (paginated, ?page=&limit=) |
| GET    | `/api/valuations/:id` | JWT         | Get single record               |
| POST   | `/api/valuations`     | JWT + role  | Create                          |
| PUT    | `/api/valuations/:id` | JWT + owner | Update                          |
| DELETE | `/api/valuations/:id` | JWT + admin | Soft-delete                     |

```json
// POST /api/valuations -- request body (expand with real fields)
{}

// Response 201
{ "id": "cuid", "createdAt": "ISO8601" }
```

#### Layer 3 -- Data Schema

```prisma
model FeiFei {
  id         String   @id @default(cuid())
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  // TODO: expand from business doc business_docs/09_crm_features/property-valuation.md
  @@map("feifeis")
}
```

#### Layer 4 -- Validation Rules

```typescript
// src/validators/feifei.validator.ts
import { z } from 'zod';
export const CreateFeiFeiSchema = z.object({
  // TODO: add fields from Layer 3 schema
});
```

#### Layer 5 -- Failure / Edge Handling

| Scenario          | HTTP | Response                                           |
| ----------------- | ---- | -------------------------------------------------- |
| Not found         | 404  | `{ error: 'NOT_FOUND', message: '...' }`           |
| Validation error  | 422  | `{ error: 'VALIDATION', fields: [...] }`           |
| Unauthorized      | 401  | `{ error: 'UNAUTHORIZED' }`                        |
| Forbidden (RBAC)  | 403  | `{ error: 'FORBIDDEN' }`                           |
| DB timeout        | 503  | `{ error: 'SERVICE_UNAVAILABLE', retryAfter: 30 }` |
| Upstream API down | 503  | Queue + exponential backoff (3 retries)            |

#### Layer 6 -- Security / Compliance

| Control            | Implementation                                         |
| ------------------ | ------------------------------------------------------ |
| RBAC roles allowed | [MD, Manager, Agent -- define per endpoint]            |
| PII fields         | Encrypt at rest (AES-256), mask in logs                |
| Input sanitization | Zod parse before any DB write                          |
| Audit trail        | Every mutation -> audit_trail collection (@Hedy)       |
| RERA compliance    | Rules from compliance-requirements.md Section [TBD]    |
| Rate limit         | 100 req/min per user (Express rate-limiter middleware) |

#### Layer 7 -- UX States

| State   | 375px (Mobile)   | 768px (Tablet) | 1440px (Desktop) | RTL      |
| ------- | ---------------- | -------------- | ---------------- | -------- |
| Loading | Skeleton card    | Skeleton grid  | Skeleton table   | Mirror   |
| Empty   | Icon + msg + CTA | Same           | Same             | Mirrored |
| Error   | Toast + retry    | Toast + retry  | Inline alert     | Mirrored |
| Success | Toast green 3s   | Same           | Same             | Mirrored |
| Offline | Banner + queue   | Same           | Same             | Mirrored |

#### Layer 8 -- Tests

| Type        | File                              | Key Scenarios                     |
| ----------- | --------------------------------- | --------------------------------- |
| Unit        | `src/services/feifei.test.ts`     | CRUD happy path, validation, auth |
| Integration | `test/feifei.integration.test.ts` | DB round-trip, RERA rules         |
| E2E         | `e2e/feifei.spec.ts`              | Full flow: UI -> API -> DB        |

> Coverage target: unit >= 90% | integration >= 80% | E2E >= critical paths

#### Layer 9 -- Observability

| Metric            | Type      | Alert         |
| ----------------- | --------- | ------------- |
| p95 response time | Histogram | > 500ms       |
| Error rate        | Counter   | > 1%/min      |
| DB query time     | Histogram | > 200ms       |
| Auth failures     | Counter   | > 10/min      |
| Queue depth       | Gauge     | > 100 pending |

> Log fields: requestId, userId, agentId, entityType, durationMs, statusCode

#### Layer 10 -- Rollback / Migration

- Migration name: `20260506_add_feifei`
- Rollback trigger: error rate > 5% sustained for 5 minutes
- Rollback procedure:
  1. `prisma migrate resolve --rolled-back <migration-name>`
  2. Redeploy previous Docker image tag
  3. Verify health endpoint returns 200
- Data rollback: MongoDB point-in-time restore (15-min RPO) via Atlas
- Feature flag: `ENABLE_FEIFEI` env var for gradual rollout

### @Anima -- Data pipeline and secondary-sales bridge

| Field                    | Value                                              |
| ------------------------ | -------------------------------------------------- |
| Task                     | T009                                               |
| Lane                     | B                                                  |
| API Base                 | `/api/secondary-sales`                             |
| Business Doc             | `business_docs/09_crm_features/secondary-sales.md` |
| Evidence Layers Complete | 0/10 (DRAFT)                                       |

#### Layer 1 -- Business Rule

> [PENDING] Business doc below target depth. Free agents must expand before coding.

- Core rule: [expand from business doc]
- Acceptance criteria: [expand from business doc]
- Dubai-specific rules (RERA/DLD): [expand from compliance-requirements.md]

#### Layer 2 -- API Contract

| Method | Route                      | Auth        | Description                     |
| ------ | -------------------------- | ----------- | ------------------------------- |
| GET    | `/api/secondary-sales`     | JWT         | List (paginated, ?page=&limit=) |
| GET    | `/api/secondary-sales/:id` | JWT         | Get single record               |
| POST   | `/api/secondary-sales`     | JWT + role  | Create                          |
| PUT    | `/api/secondary-sales/:id` | JWT + owner | Update                          |
| DELETE | `/api/secondary-sales/:id` | JWT + admin | Soft-delete                     |

```json
// POST /api/secondary-sales -- request body (expand with real fields)
{}

// Response 201
{ "id": "cuid", "createdAt": "ISO8601" }
```

#### Layer 3 -- Data Schema

```prisma
model Anima {
  id         String   @id @default(cuid())
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  // TODO: expand from business doc business_docs/09_crm_features/secondary-sales.md
  @@map("animas")
}
```

#### Layer 4 -- Validation Rules

```typescript
// src/validators/anima.validator.ts
import { z } from 'zod';
export const CreateAnimaSchema = z.object({
  // TODO: add fields from Layer 3 schema
});
```

#### Layer 5 -- Failure / Edge Handling

| Scenario          | HTTP | Response                                           |
| ----------------- | ---- | -------------------------------------------------- |
| Not found         | 404  | `{ error: 'NOT_FOUND', message: '...' }`           |
| Validation error  | 422  | `{ error: 'VALIDATION', fields: [...] }`           |
| Unauthorized      | 401  | `{ error: 'UNAUTHORIZED' }`                        |
| Forbidden (RBAC)  | 403  | `{ error: 'FORBIDDEN' }`                           |
| DB timeout        | 503  | `{ error: 'SERVICE_UNAVAILABLE', retryAfter: 30 }` |
| Upstream API down | 503  | Queue + exponential backoff (3 retries)            |

#### Layer 6 -- Security / Compliance

| Control            | Implementation                                         |
| ------------------ | ------------------------------------------------------ |
| RBAC roles allowed | [MD, Manager, Agent -- define per endpoint]            |
| PII fields         | Encrypt at rest (AES-256), mask in logs                |
| Input sanitization | Zod parse before any DB write                          |
| Audit trail        | Every mutation -> audit_trail collection (@Hedy)       |
| RERA compliance    | Rules from compliance-requirements.md Section [TBD]    |
| Rate limit         | 100 req/min per user (Express rate-limiter middleware) |

#### Layer 7 -- UX States

| State   | 375px (Mobile)   | 768px (Tablet) | 1440px (Desktop) | RTL      |
| ------- | ---------------- | -------------- | ---------------- | -------- |
| Loading | Skeleton card    | Skeleton grid  | Skeleton table   | Mirror   |
| Empty   | Icon + msg + CTA | Same           | Same             | Mirrored |
| Error   | Toast + retry    | Toast + retry  | Inline alert     | Mirrored |
| Success | Toast green 3s   | Same           | Same             | Mirrored |
| Offline | Banner + queue   | Same           | Same             | Mirrored |

#### Layer 8 -- Tests

| Type        | File                             | Key Scenarios                     |
| ----------- | -------------------------------- | --------------------------------- |
| Unit        | `src/services/anima.test.ts`     | CRUD happy path, validation, auth |
| Integration | `test/anima.integration.test.ts` | DB round-trip, RERA rules         |
| E2E         | `e2e/anima.spec.ts`              | Full flow: UI -> API -> DB        |

> Coverage target: unit >= 90% | integration >= 80% | E2E >= critical paths

#### Layer 9 -- Observability

| Metric            | Type      | Alert         |
| ----------------- | --------- | ------------- |
| p95 response time | Histogram | > 500ms       |
| Error rate        | Counter   | > 1%/min      |
| DB query time     | Histogram | > 200ms       |
| Auth failures     | Counter   | > 10/min      |
| Queue depth       | Gauge     | > 100 pending |

> Log fields: requestId, userId, agentId, entityType, durationMs, statusCode

#### Layer 10 -- Rollback / Migration

- Migration name: `20260506_add_anima`
- Rollback trigger: error rate > 5% sustained for 5 minutes
- Rollback procedure:
  1. `prisma migrate resolve --rolled-back <migration-name>`
  2. Redeploy previous Docker image tag
  3. Verify health endpoint returns 200
- Data rollback: MongoDB point-in-time restore (15-min RPO) via Atlas
- Feature flag: `ENABLE_ANIMA` env var for gradual rollout

### @Mary -- Inventory-investment synthesis

| Field                    | Value                                                |
| ------------------------ | ---------------------------------------------------- |
| Task                     | T010                                                 |
| Lane                     | B                                                    |
| API Base                 | `/api/properties`                                    |
| Business Doc             | `business_docs/09_crm_features/sentinel-property.md` |
| Evidence Layers Complete | 0/10 (DRAFT)                                         |

#### Layer 1 -- Business Rule

> Source: `business_docs/09_crm_features/sentinel-property.md` -- Top sections: Overview | TODO â€” @Mary Task 1 | TODO â€” @Mary Task 2 | TODO â€” @Mary Task 3

- Core rule: [expand from business doc]
- Acceptance criteria: [expand from business doc]
- Dubai-specific rules (RERA/DLD): [expand from compliance-requirements.md]

#### Layer 2 -- API Contract

| Method | Route                 | Auth        | Description                     |
| ------ | --------------------- | ----------- | ------------------------------- |
| GET    | `/api/properties`     | JWT         | List (paginated, ?page=&limit=) |
| GET    | `/api/properties/:id` | JWT         | Get single record               |
| POST   | `/api/properties`     | JWT + role  | Create                          |
| PUT    | `/api/properties/:id` | JWT + owner | Update                          |
| DELETE | `/api/properties/:id` | JWT + admin | Soft-delete                     |

```json
// POST /api/properties -- request body (expand with real fields)
{}

// Response 201
{ "id": "cuid", "createdAt": "ISO8601" }
```

#### Layer 3 -- Data Schema

```prisma
model Mary {
  id         String   @id @default(cuid())
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  // TODO: expand from business doc business_docs/09_crm_features/sentinel-property.md
  @@map("marys")
}
```

#### Layer 4 -- Validation Rules

```typescript
// src/validators/mary.validator.ts
import { z } from 'zod';
export const CreateMarySchema = z.object({
  // TODO: add fields from Layer 3 schema
});
```

#### Layer 5 -- Failure / Edge Handling

| Scenario          | HTTP | Response                                           |
| ----------------- | ---- | -------------------------------------------------- |
| Not found         | 404  | `{ error: 'NOT_FOUND', message: '...' }`           |
| Validation error  | 422  | `{ error: 'VALIDATION', fields: [...] }`           |
| Unauthorized      | 401  | `{ error: 'UNAUTHORIZED' }`                        |
| Forbidden (RBAC)  | 403  | `{ error: 'FORBIDDEN' }`                           |
| DB timeout        | 503  | `{ error: 'SERVICE_UNAVAILABLE', retryAfter: 30 }` |
| Upstream API down | 503  | Queue + exponential backoff (3 retries)            |

#### Layer 6 -- Security / Compliance

| Control            | Implementation                                         |
| ------------------ | ------------------------------------------------------ |
| RBAC roles allowed | [MD, Manager, Agent -- define per endpoint]            |
| PII fields         | Encrypt at rest (AES-256), mask in logs                |
| Input sanitization | Zod parse before any DB write                          |
| Audit trail        | Every mutation -> audit_trail collection (@Hedy)       |
| RERA compliance    | Rules from compliance-requirements.md Section [TBD]    |
| Rate limit         | 100 req/min per user (Express rate-limiter middleware) |

#### Layer 7 -- UX States

| State   | 375px (Mobile)   | 768px (Tablet) | 1440px (Desktop) | RTL      |
| ------- | ---------------- | -------------- | ---------------- | -------- |
| Loading | Skeleton card    | Skeleton grid  | Skeleton table   | Mirror   |
| Empty   | Icon + msg + CTA | Same           | Same             | Mirrored |
| Error   | Toast + retry    | Toast + retry  | Inline alert     | Mirrored |
| Success | Toast green 3s   | Same           | Same             | Mirrored |
| Offline | Banner + queue   | Same           | Same             | Mirrored |

#### Layer 8 -- Tests

| Type        | File                            | Key Scenarios                     |
| ----------- | ------------------------------- | --------------------------------- |
| Unit        | `src/services/mary.test.ts`     | CRUD happy path, validation, auth |
| Integration | `test/mary.integration.test.ts` | DB round-trip, RERA rules         |
| E2E         | `e2e/mary.spec.ts`              | Full flow: UI -> API -> DB        |

> Coverage target: unit >= 90% | integration >= 80% | E2E >= critical paths

#### Layer 9 -- Observability

| Metric            | Type      | Alert         |
| ----------------- | --------- | ------------- |
| p95 response time | Histogram | > 500ms       |
| Error rate        | Counter   | > 1%/min      |
| DB query time     | Histogram | > 200ms       |
| Auth failures     | Counter   | > 10/min      |
| Queue depth       | Gauge     | > 100 pending |

> Log fields: requestId, userId, agentId, entityType, durationMs, statusCode

#### Layer 10 -- Rollback / Migration

- Migration name: `20260506_add_mary`
- Rollback trigger: error rate > 5% sustained for 5 minutes
- Rollback procedure:
  1. `prisma migrate resolve --rolled-back <migration-name>`
  2. Redeploy previous Docker image tag
  3. Verify health endpoint returns 200
- Data rollback: MongoDB point-in-time restore (15-min RPO) via Atlas
- Feature flag: `ENABLE_MARY` env var for gradual rollout

### @Invoice -- Financial modeling and KPI bridge

| Field                    | Value                                                  |
| ------------------------ | ------------------------------------------------------ |
| Task                     | T011                                                   |
| Lane                     | B                                                      |
| API Base                 | `/api/finance`                                         |
| Business Doc             | `business_docs/09_crm_features/financial-reporting.md` |
| Evidence Layers Complete | 0/10 (DRAFT)                                           |

#### Layer 1 -- Business Rule

> Source: `business_docs/09_crm_features/financial-reporting.md` -- Top sections: Overview | Report Types | Financial Dashboard UI Components | Export Requirements | Acceptance Criteria

- Core rule: [expand from business doc]
- Acceptance criteria: [expand from business doc]
- Dubai-specific rules (RERA/DLD): [expand from compliance-requirements.md]

#### Layer 2 -- API Contract

| Method | Route              | Auth        | Description                     |
| ------ | ------------------ | ----------- | ------------------------------- |
| GET    | `/api/finance`     | JWT         | List (paginated, ?page=&limit=) |
| GET    | `/api/finance/:id` | JWT         | Get single record               |
| POST   | `/api/finance`     | JWT + role  | Create                          |
| PUT    | `/api/finance/:id` | JWT + owner | Update                          |
| DELETE | `/api/finance/:id` | JWT + admin | Soft-delete                     |

```json
// POST /api/finance -- request body (expand with real fields)
{}

// Response 201
{ "id": "cuid", "createdAt": "ISO8601" }
```

#### Layer 3 -- Data Schema

```prisma
model Invoice {
  id         String   @id @default(cuid())
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  // TODO: expand from business doc business_docs/09_crm_features/financial-reporting.md
  @@map("invoices")
}
```

#### Layer 4 -- Validation Rules

```typescript
// src/validators/invoice.validator.ts
import { z } from 'zod';
export const CreateInvoiceSchema = z.object({
  // TODO: add fields from Layer 3 schema
});
```

#### Layer 5 -- Failure / Edge Handling

| Scenario          | HTTP | Response                                           |
| ----------------- | ---- | -------------------------------------------------- |
| Not found         | 404  | `{ error: 'NOT_FOUND', message: '...' }`           |
| Validation error  | 422  | `{ error: 'VALIDATION', fields: [...] }`           |
| Unauthorized      | 401  | `{ error: 'UNAUTHORIZED' }`                        |
| Forbidden (RBAC)  | 403  | `{ error: 'FORBIDDEN' }`                           |
| DB timeout        | 503  | `{ error: 'SERVICE_UNAVAILABLE', retryAfter: 30 }` |
| Upstream API down | 503  | Queue + exponential backoff (3 retries)            |

#### Layer 6 -- Security / Compliance

| Control            | Implementation                                         |
| ------------------ | ------------------------------------------------------ |
| RBAC roles allowed | [MD, Manager, Agent -- define per endpoint]            |
| PII fields         | Encrypt at rest (AES-256), mask in logs                |
| Input sanitization | Zod parse before any DB write                          |
| Audit trail        | Every mutation -> audit_trail collection (@Hedy)       |
| RERA compliance    | Rules from compliance-requirements.md Section [TBD]    |
| Rate limit         | 100 req/min per user (Express rate-limiter middleware) |

#### Layer 7 -- UX States

| State   | 375px (Mobile)   | 768px (Tablet) | 1440px (Desktop) | RTL      |
| ------- | ---------------- | -------------- | ---------------- | -------- |
| Loading | Skeleton card    | Skeleton grid  | Skeleton table   | Mirror   |
| Empty   | Icon + msg + CTA | Same           | Same             | Mirrored |
| Error   | Toast + retry    | Toast + retry  | Inline alert     | Mirrored |
| Success | Toast green 3s   | Same           | Same             | Mirrored |
| Offline | Banner + queue   | Same           | Same             | Mirrored |

#### Layer 8 -- Tests

| Type        | File                               | Key Scenarios                     |
| ----------- | ---------------------------------- | --------------------------------- |
| Unit        | `src/services/invoice.test.ts`     | CRUD happy path, validation, auth |
| Integration | `test/invoice.integration.test.ts` | DB round-trip, RERA rules         |
| E2E         | `e2e/invoice.spec.ts`              | Full flow: UI -> API -> DB        |

> Coverage target: unit >= 90% | integration >= 80% | E2E >= critical paths

#### Layer 9 -- Observability

| Metric            | Type      | Alert         |
| ----------------- | --------- | ------------- |
| p95 response time | Histogram | > 500ms       |
| Error rate        | Counter   | > 1%/min      |
| DB query time     | Histogram | > 200ms       |
| Auth failures     | Counter   | > 10/min      |
| Queue depth       | Gauge     | > 100 pending |

> Log fields: requestId, userId, agentId, entityType, durationMs, statusCode

#### Layer 10 -- Rollback / Migration

- Migration name: `20260506_add_invoice`
- Rollback trigger: error rate > 5% sustained for 5 minutes
- Rollback procedure:
  1. `prisma migrate resolve --rolled-back <migration-name>`
  2. Redeploy previous Docker image tag
  3. Verify health endpoint returns 200
- Data rollback: MongoDB point-in-time restore (15-min RPO) via Atlas
- Feature flag: `ENABLE_INVOICE` env var for gradual rollout

---

## Lane C -- Schedule/Off-plan/Analytics

### @Booking -- Viewing and scheduling contracts

| Field                    | Value                                       |
| ------------------------ | ------------------------------------------- |
| Task                     | T012                                        |
| Lane                     | C                                           |
| API Base                 | `/api/viewings`                             |
| Business Doc             | `business_docs/09_crm_features/viewings.md` |
| Evidence Layers Complete | 0/10 (DRAFT)                                |

#### Layer 1 -- Business Rule

> Source: `business_docs/09_crm_features/viewings.md` -- Top sections: Overview | TODO â€” @Booking Task 1 | TODO â€” @Booking Task 2 | TODO â€” @Booking Task 3

- Core rule: [expand from business doc]
- Acceptance criteria: [expand from business doc]
- Dubai-specific rules (RERA/DLD): [expand from compliance-requirements.md]

#### Layer 2 -- API Contract

| Method | Route               | Auth        | Description                     |
| ------ | ------------------- | ----------- | ------------------------------- |
| GET    | `/api/viewings`     | JWT         | List (paginated, ?page=&limit=) |
| GET    | `/api/viewings/:id` | JWT         | Get single record               |
| POST   | `/api/viewings`     | JWT + role  | Create                          |
| PUT    | `/api/viewings/:id` | JWT + owner | Update                          |
| DELETE | `/api/viewings/:id` | JWT + admin | Soft-delete                     |

```json
// POST /api/viewings -- request body (expand with real fields)
{}

// Response 201
{ "id": "cuid", "createdAt": "ISO8601" }
```

#### Layer 3 -- Data Schema

```prisma
model Booking {
  id         String   @id @default(cuid())
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  // TODO: expand from business doc business_docs/09_crm_features/viewings.md
  @@map("bookings")
}
```

#### Layer 4 -- Validation Rules

```typescript
// src/validators/booking.validator.ts
import { z } from 'zod';
export const CreateBookingSchema = z.object({
  // TODO: add fields from Layer 3 schema
});
```

#### Layer 5 -- Failure / Edge Handling

| Scenario          | HTTP | Response                                           |
| ----------------- | ---- | -------------------------------------------------- |
| Not found         | 404  | `{ error: 'NOT_FOUND', message: '...' }`           |
| Validation error  | 422  | `{ error: 'VALIDATION', fields: [...] }`           |
| Unauthorized      | 401  | `{ error: 'UNAUTHORIZED' }`                        |
| Forbidden (RBAC)  | 403  | `{ error: 'FORBIDDEN' }`                           |
| DB timeout        | 503  | `{ error: 'SERVICE_UNAVAILABLE', retryAfter: 30 }` |
| Upstream API down | 503  | Queue + exponential backoff (3 retries)            |

#### Layer 6 -- Security / Compliance

| Control            | Implementation                                         |
| ------------------ | ------------------------------------------------------ |
| RBAC roles allowed | [MD, Manager, Agent -- define per endpoint]            |
| PII fields         | Encrypt at rest (AES-256), mask in logs                |
| Input sanitization | Zod parse before any DB write                          |
| Audit trail        | Every mutation -> audit_trail collection (@Hedy)       |
| RERA compliance    | Rules from compliance-requirements.md Section [TBD]    |
| Rate limit         | 100 req/min per user (Express rate-limiter middleware) |

#### Layer 7 -- UX States

| State   | 375px (Mobile)   | 768px (Tablet) | 1440px (Desktop) | RTL      |
| ------- | ---------------- | -------------- | ---------------- | -------- |
| Loading | Skeleton card    | Skeleton grid  | Skeleton table   | Mirror   |
| Empty   | Icon + msg + CTA | Same           | Same             | Mirrored |
| Error   | Toast + retry    | Toast + retry  | Inline alert     | Mirrored |
| Success | Toast green 3s   | Same           | Same             | Mirrored |
| Offline | Banner + queue   | Same           | Same             | Mirrored |

#### Layer 8 -- Tests

| Type        | File                               | Key Scenarios                     |
| ----------- | ---------------------------------- | --------------------------------- |
| Unit        | `src/services/booking.test.ts`     | CRUD happy path, validation, auth |
| Integration | `test/booking.integration.test.ts` | DB round-trip, RERA rules         |
| E2E         | `e2e/booking.spec.ts`              | Full flow: UI -> API -> DB        |

> Coverage target: unit >= 90% | integration >= 80% | E2E >= critical paths

#### Layer 9 -- Observability

| Metric            | Type      | Alert         |
| ----------------- | --------- | ------------- |
| p95 response time | Histogram | > 500ms       |
| Error rate        | Counter   | > 1%/min      |
| DB query time     | Histogram | > 200ms       |
| Auth failures     | Counter   | > 10/min      |
| Queue depth       | Gauge     | > 100 pending |

> Log fields: requestId, userId, agentId, entityType, durationMs, statusCode

#### Layer 10 -- Rollback / Migration

- Migration name: `20260506_add_booking`
- Rollback trigger: error rate > 5% sustained for 5 minutes
- Rollback procedure:
  1. `prisma migrate resolve --rolled-back <migration-name>`
  2. Redeploy previous Docker image tag
  3. Verify health endpoint returns 200
- Data rollback: MongoDB point-in-time restore (15-min RPO) via Atlas
- Feature flag: `ENABLE_BOOKING` env var for gradual rollout

### @Maya -- Off-plan handover flow

| Field                    | Value                                                |
| ------------------------ | ---------------------------------------------------- |
| Task                     | T013                                                 |
| Lane                     | C                                                    |
| API Base                 | `/api/off-plan`                                      |
| Business Doc             | `business_docs/09_crm_features/off-plan-projects.md` |
| Evidence Layers Complete | 0/10 (DRAFT)                                         |

#### Layer 1 -- Business Rule

> Source: `business_docs/09_crm_features/off-plan-projects.md` -- Top sections: Overview | TODO â€” @Maya Task 1 | TODO â€” @Maya Task 2 | TODO â€” @Maya Task 3

- Core rule: [expand from business doc]
- Acceptance criteria: [expand from business doc]
- Dubai-specific rules (RERA/DLD): [expand from compliance-requirements.md]

#### Layer 2 -- API Contract

| Method | Route               | Auth        | Description                     |
| ------ | ------------------- | ----------- | ------------------------------- |
| GET    | `/api/off-plan`     | JWT         | List (paginated, ?page=&limit=) |
| GET    | `/api/off-plan/:id` | JWT         | Get single record               |
| POST   | `/api/off-plan`     | JWT + role  | Create                          |
| PUT    | `/api/off-plan/:id` | JWT + owner | Update                          |
| DELETE | `/api/off-plan/:id` | JWT + admin | Soft-delete                     |

```json
// POST /api/off-plan -- request body (expand with real fields)
{}

// Response 201
{ "id": "cuid", "createdAt": "ISO8601" }
```

#### Layer 3 -- Data Schema

```prisma
model Maya {
  id         String   @id @default(cuid())
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  // TODO: expand from business doc business_docs/09_crm_features/off-plan-projects.md
  @@map("mayas")
}
```

#### Layer 4 -- Validation Rules

```typescript
// src/validators/maya.validator.ts
import { z } from 'zod';
export const CreateMayaSchema = z.object({
  // TODO: add fields from Layer 3 schema
});
```

#### Layer 5 -- Failure / Edge Handling

| Scenario          | HTTP | Response                                           |
| ----------------- | ---- | -------------------------------------------------- |
| Not found         | 404  | `{ error: 'NOT_FOUND', message: '...' }`           |
| Validation error  | 422  | `{ error: 'VALIDATION', fields: [...] }`           |
| Unauthorized      | 401  | `{ error: 'UNAUTHORIZED' }`                        |
| Forbidden (RBAC)  | 403  | `{ error: 'FORBIDDEN' }`                           |
| DB timeout        | 503  | `{ error: 'SERVICE_UNAVAILABLE', retryAfter: 30 }` |
| Upstream API down | 503  | Queue + exponential backoff (3 retries)            |

#### Layer 6 -- Security / Compliance

| Control            | Implementation                                         |
| ------------------ | ------------------------------------------------------ |
| RBAC roles allowed | [MD, Manager, Agent -- define per endpoint]            |
| PII fields         | Encrypt at rest (AES-256), mask in logs                |
| Input sanitization | Zod parse before any DB write                          |
| Audit trail        | Every mutation -> audit_trail collection (@Hedy)       |
| RERA compliance    | Rules from compliance-requirements.md Section [TBD]    |
| Rate limit         | 100 req/min per user (Express rate-limiter middleware) |

#### Layer 7 -- UX States

| State   | 375px (Mobile)   | 768px (Tablet) | 1440px (Desktop) | RTL      |
| ------- | ---------------- | -------------- | ---------------- | -------- |
| Loading | Skeleton card    | Skeleton grid  | Skeleton table   | Mirror   |
| Empty   | Icon + msg + CTA | Same           | Same             | Mirrored |
| Error   | Toast + retry    | Toast + retry  | Inline alert     | Mirrored |
| Success | Toast green 3s   | Same           | Same             | Mirrored |
| Offline | Banner + queue   | Same           | Same             | Mirrored |

#### Layer 8 -- Tests

| Type        | File                            | Key Scenarios                     |
| ----------- | ------------------------------- | --------------------------------- |
| Unit        | `src/services/maya.test.ts`     | CRUD happy path, validation, auth |
| Integration | `test/maya.integration.test.ts` | DB round-trip, RERA rules         |
| E2E         | `e2e/maya.spec.ts`              | Full flow: UI -> API -> DB        |

> Coverage target: unit >= 90% | integration >= 80% | E2E >= critical paths

#### Layer 9 -- Observability

| Metric            | Type      | Alert         |
| ----------------- | --------- | ------------- |
| p95 response time | Histogram | > 500ms       |
| Error rate        | Counter   | > 1%/min      |
| DB query time     | Histogram | > 200ms       |
| Auth failures     | Counter   | > 10/min      |
| Queue depth       | Gauge     | > 100 pending |

> Log fields: requestId, userId, agentId, entityType, durationMs, statusCode

#### Layer 10 -- Rollback / Migration

- Migration name: `20260506_add_maya`
- Rollback trigger: error rate > 5% sustained for 5 minutes
- Rollback procedure:
  1. `prisma migrate resolve --rolled-back <migration-name>`
  2. Redeploy previous Docker image tag
  3. Verify health endpoint returns 200
- Data rollback: MongoDB point-in-time restore (15-min RPO) via Atlas
- Feature flag: `ENABLE_MAYA` env var for gradual rollout

### @Hedy -- Audit and follow-up controls

| Field                    | Value                                          |
| ------------------------ | ---------------------------------------------- |
| Task                     | T014                                           |
| Lane                     | C                                              |
| API Base                 | `/api/audit`                                   |
| Business Doc             | `business_docs/09_crm_features/audit-trail.md` |
| Evidence Layers Complete | 0/10 (DRAFT)                                   |

#### Layer 1 -- Business Rule

> [PENDING] Business doc below target depth. Free agents must expand before coding.

- Core rule: [expand from business doc]
- Acceptance criteria: [expand from business doc]
- Dubai-specific rules (RERA/DLD): [expand from compliance-requirements.md]

#### Layer 2 -- API Contract

| Method | Route            | Auth        | Description                     |
| ------ | ---------------- | ----------- | ------------------------------- |
| GET    | `/api/audit`     | JWT         | List (paginated, ?page=&limit=) |
| GET    | `/api/audit/:id` | JWT         | Get single record               |
| POST   | `/api/audit`     | JWT + role  | Create                          |
| PUT    | `/api/audit/:id` | JWT + owner | Update                          |
| DELETE | `/api/audit/:id` | JWT + admin | Soft-delete                     |

```json
// POST /api/audit -- request body (expand with real fields)
{}

// Response 201
{ "id": "cuid", "createdAt": "ISO8601" }
```

#### Layer 3 -- Data Schema

```prisma
model Hedy {
  id         String   @id @default(cuid())
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  // TODO: expand from business doc business_docs/09_crm_features/audit-trail.md
  @@map("hedys")
}
```

#### Layer 4 -- Validation Rules

```typescript
// src/validators/hedy.validator.ts
import { z } from 'zod';
export const CreateHedySchema = z.object({
  // TODO: add fields from Layer 3 schema
});
```

#### Layer 5 -- Failure / Edge Handling

| Scenario          | HTTP | Response                                           |
| ----------------- | ---- | -------------------------------------------------- |
| Not found         | 404  | `{ error: 'NOT_FOUND', message: '...' }`           |
| Validation error  | 422  | `{ error: 'VALIDATION', fields: [...] }`           |
| Unauthorized      | 401  | `{ error: 'UNAUTHORIZED' }`                        |
| Forbidden (RBAC)  | 403  | `{ error: 'FORBIDDEN' }`                           |
| DB timeout        | 503  | `{ error: 'SERVICE_UNAVAILABLE', retryAfter: 30 }` |
| Upstream API down | 503  | Queue + exponential backoff (3 retries)            |

#### Layer 6 -- Security / Compliance

| Control            | Implementation                                         |
| ------------------ | ------------------------------------------------------ |
| RBAC roles allowed | [MD, Manager, Agent -- define per endpoint]            |
| PII fields         | Encrypt at rest (AES-256), mask in logs                |
| Input sanitization | Zod parse before any DB write                          |
| Audit trail        | Every mutation -> audit_trail collection (@Hedy)       |
| RERA compliance    | Rules from compliance-requirements.md Section [TBD]    |
| Rate limit         | 100 req/min per user (Express rate-limiter middleware) |

#### Layer 7 -- UX States

| State   | 375px (Mobile)   | 768px (Tablet) | 1440px (Desktop) | RTL      |
| ------- | ---------------- | -------------- | ---------------- | -------- |
| Loading | Skeleton card    | Skeleton grid  | Skeleton table   | Mirror   |
| Empty   | Icon + msg + CTA | Same           | Same             | Mirrored |
| Error   | Toast + retry    | Toast + retry  | Inline alert     | Mirrored |
| Success | Toast green 3s   | Same           | Same             | Mirrored |
| Offline | Banner + queue   | Same           | Same             | Mirrored |

#### Layer 8 -- Tests

| Type        | File                            | Key Scenarios                     |
| ----------- | ------------------------------- | --------------------------------- |
| Unit        | `src/services/hedy.test.ts`     | CRUD happy path, validation, auth |
| Integration | `test/hedy.integration.test.ts` | DB round-trip, RERA rules         |
| E2E         | `e2e/hedy.spec.ts`              | Full flow: UI -> API -> DB        |

> Coverage target: unit >= 90% | integration >= 80% | E2E >= critical paths

#### Layer 9 -- Observability

| Metric            | Type      | Alert         |
| ----------------- | --------- | ------------- |
| p95 response time | Histogram | > 500ms       |
| Error rate        | Counter   | > 1%/min      |
| DB query time     | Histogram | > 200ms       |
| Auth failures     | Counter   | > 10/min      |
| Queue depth       | Gauge     | > 100 pending |

> Log fields: requestId, userId, agentId, entityType, durationMs, statusCode

#### Layer 10 -- Rollback / Migration

- Migration name: `20260506_add_hedy`
- Rollback trigger: error rate > 5% sustained for 5 minutes
- Rollback procedure:
  1. `prisma migrate resolve --rolled-back <migration-name>`
  2. Redeploy previous Docker image tag
  3. Verify health endpoint returns 200
- Data rollback: MongoDB point-in-time restore (15-min RPO) via Atlas
- Feature flag: `ENABLE_HEDY` env var for gradual rollout

### @Cassie -- Analytics synthesis and KPI evidence

| Field                    | Value                                                  |
| ------------------------ | ------------------------------------------------------ |
| Task                     | T015                                                   |
| Lane                     | C                                                      |
| API Base                 | `/api/analytics`                                       |
| Business Doc             | `business_docs/09_crm_features/analytics-dashboard.md` |
| Evidence Layers Complete | 0/10 (DRAFT)                                           |

#### Layer 1 -- Business Rule

> Source: `business_docs/09_crm_features/analytics-dashboard.md` -- Top sections: Overview | User Stories | Executive Dashboard | Sales Analytics | Marketing Analytics

- Core rule: [expand from business doc]
- Acceptance criteria: [expand from business doc]
- Dubai-specific rules (RERA/DLD): [expand from compliance-requirements.md]

#### Layer 2 -- API Contract

| Method | Route                | Auth        | Description                     |
| ------ | -------------------- | ----------- | ------------------------------- |
| GET    | `/api/analytics`     | JWT         | List (paginated, ?page=&limit=) |
| GET    | `/api/analytics/:id` | JWT         | Get single record               |
| POST   | `/api/analytics`     | JWT + role  | Create                          |
| PUT    | `/api/analytics/:id` | JWT + owner | Update                          |
| DELETE | `/api/analytics/:id` | JWT + admin | Soft-delete                     |

```json
// POST /api/analytics -- request body (expand with real fields)
{}

// Response 201
{ "id": "cuid", "createdAt": "ISO8601" }
```

#### Layer 3 -- Data Schema

```prisma
model Cassie {
  id         String   @id @default(cuid())
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  // TODO: expand from business doc business_docs/09_crm_features/analytics-dashboard.md
  @@map("cassies")
}
```

#### Layer 4 -- Validation Rules

```typescript
// src/validators/cassie.validator.ts
import { z } from 'zod';
export const CreateCassieSchema = z.object({
  // TODO: add fields from Layer 3 schema
});
```

#### Layer 5 -- Failure / Edge Handling

| Scenario          | HTTP | Response                                           |
| ----------------- | ---- | -------------------------------------------------- |
| Not found         | 404  | `{ error: 'NOT_FOUND', message: '...' }`           |
| Validation error  | 422  | `{ error: 'VALIDATION', fields: [...] }`           |
| Unauthorized      | 401  | `{ error: 'UNAUTHORIZED' }`                        |
| Forbidden (RBAC)  | 403  | `{ error: 'FORBIDDEN' }`                           |
| DB timeout        | 503  | `{ error: 'SERVICE_UNAVAILABLE', retryAfter: 30 }` |
| Upstream API down | 503  | Queue + exponential backoff (3 retries)            |

#### Layer 6 -- Security / Compliance

| Control            | Implementation                                         |
| ------------------ | ------------------------------------------------------ |
| RBAC roles allowed | [MD, Manager, Agent -- define per endpoint]            |
| PII fields         | Encrypt at rest (AES-256), mask in logs                |
| Input sanitization | Zod parse before any DB write                          |
| Audit trail        | Every mutation -> audit_trail collection (@Hedy)       |
| RERA compliance    | Rules from compliance-requirements.md Section [TBD]    |
| Rate limit         | 100 req/min per user (Express rate-limiter middleware) |

#### Layer 7 -- UX States

| State   | 375px (Mobile)   | 768px (Tablet) | 1440px (Desktop) | RTL      |
| ------- | ---------------- | -------------- | ---------------- | -------- |
| Loading | Skeleton card    | Skeleton grid  | Skeleton table   | Mirror   |
| Empty   | Icon + msg + CTA | Same           | Same             | Mirrored |
| Error   | Toast + retry    | Toast + retry  | Inline alert     | Mirrored |
| Success | Toast green 3s   | Same           | Same             | Mirrored |
| Offline | Banner + queue   | Same           | Same             | Mirrored |

#### Layer 8 -- Tests

| Type        | File                              | Key Scenarios                     |
| ----------- | --------------------------------- | --------------------------------- |
| Unit        | `src/services/cassie.test.ts`     | CRUD happy path, validation, auth |
| Integration | `test/cassie.integration.test.ts` | DB round-trip, RERA rules         |
| E2E         | `e2e/cassie.spec.ts`              | Full flow: UI -> API -> DB        |

> Coverage target: unit >= 90% | integration >= 80% | E2E >= critical paths

#### Layer 9 -- Observability

| Metric            | Type      | Alert         |
| ----------------- | --------- | ------------- |
| p95 response time | Histogram | > 500ms       |
| Error rate        | Counter   | > 1%/min      |
| DB query time     | Histogram | > 200ms       |
| Auth failures     | Counter   | > 10/min      |
| Queue depth       | Gauge     | > 100 pending |

> Log fields: requestId, userId, agentId, entityType, durationMs, statusCode

#### Layer 10 -- Rollback / Migration

- Migration name: `20260506_add_cassie`
- Rollback trigger: error rate > 5% sustained for 5 minutes
- Rollback procedure:
  1. `prisma migrate resolve --rolled-back <migration-name>`
  2. Redeploy previous Docker image tag
  3. Verify health endpoint returns 200
- Data rollback: MongoDB point-in-time restore (15-min RPO) via Atlas
- Feature flag: `ENABLE_CASSIE` env var for gradual rollout

---

## Lane D -- Offers/WhatsApp/AI-Chat

### @Jaime -- Offers and WhatsApp routing

| Field                    | Value                                     |
| ------------------------ | ----------------------------------------- |
| Task                     | T016                                      |
| Lane                     | D                                         |
| API Base                 | `/api/offers`                             |
| Business Doc             | `business_docs/09_crm_features/offers.md` |
| Evidence Layers Complete | 0/10 (DRAFT)                              |

#### Layer 1 -- Business Rule

> Source: `business_docs/09_crm_features/offers.md` -- Top sections: Overview | TODO â€” @Jaime Task 1 | TODO â€” @Jaime Task 2 | TODO â€” @Jaime Task 3

- Core rule: [expand from business doc]
- Acceptance criteria: [expand from business doc]
- Dubai-specific rules (RERA/DLD): [expand from compliance-requirements.md]

#### Layer 2 -- API Contract

| Method | Route             | Auth        | Description                     |
| ------ | ----------------- | ----------- | ------------------------------- |
| GET    | `/api/offers`     | JWT         | List (paginated, ?page=&limit=) |
| GET    | `/api/offers/:id` | JWT         | Get single record               |
| POST   | `/api/offers`     | JWT + role  | Create                          |
| PUT    | `/api/offers/:id` | JWT + owner | Update                          |
| DELETE | `/api/offers/:id` | JWT + admin | Soft-delete                     |

```json
// POST /api/offers -- request body (expand with real fields)
{}

// Response 201
{ "id": "cuid", "createdAt": "ISO8601" }
```

#### Layer 3 -- Data Schema

```prisma
model Jaime {
  id         String   @id @default(cuid())
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  // TODO: expand from business doc business_docs/09_crm_features/offers.md
  @@map("jaimes")
}
```

#### Layer 4 -- Validation Rules

```typescript
// src/validators/jaime.validator.ts
import { z } from 'zod';
export const CreateJaimeSchema = z.object({
  // TODO: add fields from Layer 3 schema
});
```

#### Layer 5 -- Failure / Edge Handling

| Scenario          | HTTP | Response                                           |
| ----------------- | ---- | -------------------------------------------------- |
| Not found         | 404  | `{ error: 'NOT_FOUND', message: '...' }`           |
| Validation error  | 422  | `{ error: 'VALIDATION', fields: [...] }`           |
| Unauthorized      | 401  | `{ error: 'UNAUTHORIZED' }`                        |
| Forbidden (RBAC)  | 403  | `{ error: 'FORBIDDEN' }`                           |
| DB timeout        | 503  | `{ error: 'SERVICE_UNAVAILABLE', retryAfter: 30 }` |
| Upstream API down | 503  | Queue + exponential backoff (3 retries)            |

#### Layer 6 -- Security / Compliance

| Control            | Implementation                                         |
| ------------------ | ------------------------------------------------------ |
| RBAC roles allowed | [MD, Manager, Agent -- define per endpoint]            |
| PII fields         | Encrypt at rest (AES-256), mask in logs                |
| Input sanitization | Zod parse before any DB write                          |
| Audit trail        | Every mutation -> audit_trail collection (@Hedy)       |
| RERA compliance    | Rules from compliance-requirements.md Section [TBD]    |
| Rate limit         | 100 req/min per user (Express rate-limiter middleware) |

#### Layer 7 -- UX States

| State   | 375px (Mobile)   | 768px (Tablet) | 1440px (Desktop) | RTL      |
| ------- | ---------------- | -------------- | ---------------- | -------- |
| Loading | Skeleton card    | Skeleton grid  | Skeleton table   | Mirror   |
| Empty   | Icon + msg + CTA | Same           | Same             | Mirrored |
| Error   | Toast + retry    | Toast + retry  | Inline alert     | Mirrored |
| Success | Toast green 3s   | Same           | Same             | Mirrored |
| Offline | Banner + queue   | Same           | Same             | Mirrored |

#### Layer 8 -- Tests

| Type        | File                             | Key Scenarios                     |
| ----------- | -------------------------------- | --------------------------------- |
| Unit        | `src/services/jaime.test.ts`     | CRUD happy path, validation, auth |
| Integration | `test/jaime.integration.test.ts` | DB round-trip, RERA rules         |
| E2E         | `e2e/jaime.spec.ts`              | Full flow: UI -> API -> DB        |

> Coverage target: unit >= 90% | integration >= 80% | E2E >= critical paths

#### Layer 9 -- Observability

| Metric            | Type      | Alert         |
| ----------------- | --------- | ------------- |
| p95 response time | Histogram | > 500ms       |
| Error rate        | Counter   | > 1%/min      |
| DB query time     | Histogram | > 200ms       |
| Auth failures     | Counter   | > 10/min      |
| Queue depth       | Gauge     | > 100 pending |

> Log fields: requestId, userId, agentId, entityType, durationMs, statusCode

#### Layer 10 -- Rollback / Migration

- Migration name: `20260506_add_jaime`
- Rollback trigger: error rate > 5% sustained for 5 minutes
- Rollback procedure:
  1. `prisma migrate resolve --rolled-back <migration-name>`
  2. Redeploy previous Docker image tag
  3. Verify health endpoint returns 200
- Data rollback: MongoDB point-in-time restore (15-min RPO) via Atlas
- Feature flag: `ENABLE_JAIME` env var for gradual rollout

### @Corinne -- AI chat and maintenance mapping

| Field                    | Value                                      |
| ------------------------ | ------------------------------------------ |
| Task                     | T017                                       |
| Lane                     | D                                          |
| API Base                 | `/api/ai-chat`                             |
| Business Doc             | `business_docs/09_crm_features/ai-chat.md` |
| Evidence Layers Complete | 0/10 (DRAFT)                               |

#### Layer 1 -- Business Rule

> [PENDING] Business doc below target depth. Free agents must expand before coding.

- Core rule: [expand from business doc]
- Acceptance criteria: [expand from business doc]
- Dubai-specific rules (RERA/DLD): [expand from compliance-requirements.md]

#### Layer 2 -- API Contract

| Method | Route              | Auth        | Description                     |
| ------ | ------------------ | ----------- | ------------------------------- |
| GET    | `/api/ai-chat`     | JWT         | List (paginated, ?page=&limit=) |
| GET    | `/api/ai-chat/:id` | JWT         | Get single record               |
| POST   | `/api/ai-chat`     | JWT + role  | Create                          |
| PUT    | `/api/ai-chat/:id` | JWT + owner | Update                          |
| DELETE | `/api/ai-chat/:id` | JWT + admin | Soft-delete                     |

```json
// POST /api/ai-chat -- request body (expand with real fields)
{}

// Response 201
{ "id": "cuid", "createdAt": "ISO8601" }
```

#### Layer 3 -- Data Schema

```prisma
model Corinne {
  id         String   @id @default(cuid())
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  // TODO: expand from business doc business_docs/09_crm_features/ai-chat.md
  @@map("corinnes")
}
```

#### Layer 4 -- Validation Rules

```typescript
// src/validators/corinne.validator.ts
import { z } from 'zod';
export const CreateCorinneSchema = z.object({
  // TODO: add fields from Layer 3 schema
});
```

#### Layer 5 -- Failure / Edge Handling

| Scenario          | HTTP | Response                                           |
| ----------------- | ---- | -------------------------------------------------- |
| Not found         | 404  | `{ error: 'NOT_FOUND', message: '...' }`           |
| Validation error  | 422  | `{ error: 'VALIDATION', fields: [...] }`           |
| Unauthorized      | 401  | `{ error: 'UNAUTHORIZED' }`                        |
| Forbidden (RBAC)  | 403  | `{ error: 'FORBIDDEN' }`                           |
| DB timeout        | 503  | `{ error: 'SERVICE_UNAVAILABLE', retryAfter: 30 }` |
| Upstream API down | 503  | Queue + exponential backoff (3 retries)            |

#### Layer 6 -- Security / Compliance

| Control            | Implementation                                         |
| ------------------ | ------------------------------------------------------ |
| RBAC roles allowed | [MD, Manager, Agent -- define per endpoint]            |
| PII fields         | Encrypt at rest (AES-256), mask in logs                |
| Input sanitization | Zod parse before any DB write                          |
| Audit trail        | Every mutation -> audit_trail collection (@Hedy)       |
| RERA compliance    | Rules from compliance-requirements.md Section [TBD]    |
| Rate limit         | 100 req/min per user (Express rate-limiter middleware) |

#### Layer 7 -- UX States

| State   | 375px (Mobile)   | 768px (Tablet) | 1440px (Desktop) | RTL      |
| ------- | ---------------- | -------------- | ---------------- | -------- |
| Loading | Skeleton card    | Skeleton grid  | Skeleton table   | Mirror   |
| Empty   | Icon + msg + CTA | Same           | Same             | Mirrored |
| Error   | Toast + retry    | Toast + retry  | Inline alert     | Mirrored |
| Success | Toast green 3s   | Same           | Same             | Mirrored |
| Offline | Banner + queue   | Same           | Same             | Mirrored |

#### Layer 8 -- Tests

| Type        | File                               | Key Scenarios                     |
| ----------- | ---------------------------------- | --------------------------------- |
| Unit        | `src/services/corinne.test.ts`     | CRUD happy path, validation, auth |
| Integration | `test/corinne.integration.test.ts` | DB round-trip, RERA rules         |
| E2E         | `e2e/corinne.spec.ts`              | Full flow: UI -> API -> DB        |

> Coverage target: unit >= 90% | integration >= 80% | E2E >= critical paths

#### Layer 9 -- Observability

| Metric            | Type      | Alert         |
| ----------------- | --------- | ------------- |
| p95 response time | Histogram | > 500ms       |
| Error rate        | Counter   | > 1%/min      |
| DB query time     | Histogram | > 200ms       |
| Auth failures     | Counter   | > 10/min      |
| Queue depth       | Gauge     | > 100 pending |

> Log fields: requestId, userId, agentId, entityType, durationMs, statusCode

#### Layer 10 -- Rollback / Migration

- Migration name: `20260506_add_corinne`
- Rollback trigger: error rate > 5% sustained for 5 minutes
- Rollback procedure:
  1. `prisma migrate resolve --rolled-back <migration-name>`
  2. Redeploy previous Docker image tag
  3. Verify health endpoint returns 200
- Data rollback: MongoDB point-in-time restore (15-min RPO) via Atlas
- Feature flag: `ENABLE_CORINNE` env var for gradual rollout

---

## Sign-off Required Before Coding

| Role            | Agent      | Status  | Date | Notes                                       |
| --------------- | ---------- | ------- | ---- | ------------------------------------------- |
| Chief Architect | @Ada       | PENDING |      | Must declare: Context Ready (60% Readiness) |
| Project Manager | @Margaret  | PENDING |      | Sprint table updated + daily sync run       |
| QA Lead         | @Katherine | PENDING |      | Test scenarios reviewed                     |
| Compliance      | @Sofia     | PENDING |      | RERA/DLD rules verified                     |

> When ALL sign-offs are APPROVED and readiness-packet.ps1 reports >= 60%:
> `@Ada -- Context Ready (60% Readiness) -- Coding Phase Approved`

---

_Auto-generated by sdd-generator.ps1 on 2026-05-06 -- expand all DRAFT sections with free agent output_
