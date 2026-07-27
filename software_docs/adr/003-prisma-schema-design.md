# ADR-003: Prisma Schema Design — Multi-Model CRM

**Status:** Accepted  
**Date:** 2026-03-31  
**Deciders:** Platform Team  

## Context

White Caves is a Dubai-focused real estate CRM serving 24 user roles across sales, leasing, property management, and freelancer operations. The data layer must support:

- Multi-entity relationships (agents ↔ leads ↔ properties ↔ contracts)
- Commission tracking with multi-party splits
- WhatsApp/Meta integration event logging
- Audit trail for compliance (RERA)
- Row-level security via ownership fields

## Decision

Use **Prisma ORM with MongoDB** as the primary data layer with 17 models and 60+ indexes.

### Model inventory (17 models)

| Model | Purpose | Key Indexes |
|---|---|---|
| User | Authentication & profiles | `@@unique([email])` |
| Property | Listings (sale/rent) | `@@index([status, type])`, `@@index([agentId])` |
| Lead | Sales pipeline | `@@index([agentId, status])`, `@@index([source])` |
| Contract | Tenancy & sales agreements | `@@index([propertyId])`, `@@index([status])` |
| Transaction | Financial records | `@@index([type, status])` |
| Commission | Agent payouts | `@@index([agentId, status])` |
| Message | WhatsApp/chat messages | `@@index([conversationId, createdAt])` |
| Conversation | Chat threads | `@@index([agentId])` |
| Notification | In-app alerts | `@@index([userId, read])` |
| AuditLog | Compliance trail | `@@index([type, action])` |
| Document | File attachments | `@@index([entityType, entityId])` |
| Favorite | Saved properties | `@@unique([userId, propertyId])` |
| Viewing | Property viewings | `@@index([propertyId, date])` |
| Offer | Purchase/rental offers | `@@index([propertyId, status])` |
| AIAssistant | CRM assistant configs | `@@index([department])` |
| Integration | Third-party connections | `@@index([type, status])` |
| Setting | System configuration | `@@unique([key])` |

### Why MongoDB + Prisma

1. **Flexible schemas** — Real estate data varies (off-plan vs resale vs rental)
2. **Prisma type safety** — Full TypeScript types generated at build time
3. **Composite indexes** — Optimised for role-scoped queries (`agentId + status`)
4. **Atlas managed** — Zero-ops, auto-scaling, Dubai region available

### Why NOT SQL

- Schema changes are frequent during active development
- No complex JOIN-heavy queries (denormalised where needed)
- Embedded documents useful for metadata (e.g., property features)

## Consequences

### Positive
- Type-safe queries across all 17 models
- 60+ indexes ensure sub-100ms queries for dashboard views
- Row-level security via `userId`/`agentId` fields + `scopeToOwn()` middleware

### Negative
- No referential integrity enforcement (MongoDB)
- Prisma MongoDB connector lacks some features (no `@relation` enforcement)
- Migration story is less mature than SQL Prisma

## Files
- `prisma/schema.prisma` — Full schema definition
- `server/middleware/rbac.ts` — `scopeToOwn()` uses ownership fields
