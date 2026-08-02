# ADR-002 — MongoDB + Prisma ORM

**Status:** Accepted  
**Date:** 2026-01-15  
**Owners:** @Barbara + @Mira  
**Related files:** `prisma/schema.prisma`, `server/database.ts`, `server/database.js`

---

## Context

White Caves stores heterogeneous real estate data: property listings with rich nested
amenities, lead records with deeply variable qualification fields, leases with PDC
cheque arrays, AI assistant conversation threads, and compliance audit logs that must
be immutable append-only. A rigid, fully-normalized relational schema would require
dozens of nullable columns or join tables to handle the variance in property type
attributes (villa vs studio vs off-plan unit vs commercial space).

Additionally, the team's frontend engineers already use TypeScript and expect
Prisma-style auto-complete in VS Code — the ORM choice must provide first-class
TypeScript type generation.

---

## Decision

**Use MongoDB (Atlas M0/M10) as the primary database with Prisma ORM as the
TypeScript-safe data access layer.**

Prisma's MongoDB connector was promoted to GA in Prisma v4, providing:
- `prisma generate` → auto-generated `PrismaClient` with full TypeScript types for all models
- `schema.prisma` as the single source of truth for all model shapes
- `prisma.$transaction` for multi-document atomic operations (used for KYC gate, W18.1-P0-013)
- Embedded documents (`@relation(embedded: true)`) for PDC cheque arrays on Lease models

The `postinstall` hook (`"postinstall": "prisma generate"`) ensures fresh clones
auto-generate the Prisma client. In CI, use `npm install --ignore-scripts` to skip this.

---

## Alternatives Considered

| Alternative | Reason Rejected |
| --- | --- |
| **PostgreSQL + Prisma** | PostgreSQL's rigid schema would require JSONB columns for the variable property-attribute objects, negating the type-safety advantage. MongoDB's document model maps more naturally to the CRM entity shapes. UAE-region Aurora Serverless pricing was also a concern at decision time. |
| **PostgreSQL + Drizzle ORM** | Drizzle's MongoDB support is not production-ready. PostgreSQL-specific reasons above apply. |
| **MongoDB + Mongoose** | Mongoose provides no TypeScript code generation; schema drift between runtime and IDE types is a constant source of bugs. Prisma's generate step eliminates this class of error entirely. |
| **Firebase Firestore** | Firestore's query model (no arbitrary aggregations without Cloud Functions) is unsuitable for the analytics dashboard and KPI pipeline. Cost at scale is also higher than MongoDB Atlas M10. |
| **Supabase (PostgreSQL)** | See PostgreSQL reasoning above. Supabase's UAE region availability was not confirmed at decision time. |

---

## Schema Migration Strategy

MongoDB with Prisma does not use DDL migrations (unlike relational databases).
Schema evolution follows this protocol:

1. **Add a new field** — Add to `schema.prisma`, run `prisma generate`. Existing
   documents without the field return `null` or the Prisma default. No migration script needed.

2. **Rename a field** — Add the new field name, deploy, backfill via a seed script in
   `server/seeds/`, then remove the old field in a follow-up PR.

3. **Remove a field** — Remove from `schema.prisma`, run `prisma generate`. Old
   documents retain the field in MongoDB but it becomes inaccessible via Prisma.
   A cleanup script should be run during a maintenance window.

4. **Index changes** — Managed via `@@index` in `schema.prisma`. `prisma db push`
   applies index changes to Atlas. Index changes on large collections require a
   background index build — do not run `prisma db push` in production without
   verifying the impact on Atlas's background index creation.

---

## Consequences

### Positive

- TypeScript types for all database models are generated, not hand-maintained.
- Prisma Client type errors catch schema-code drift at build time (TS2305 = `prisma generate` needed).
- Document model handles the variable attribute sets of Dubai property types naturally.
- `prisma.$transaction` provides the KYC and commission-approval atomic operations
  needed for financial correctness.

### Negative / Risks

- **Prisma MongoDB limitations:** Full-text search requires Atlas Search (not Prisma
  native). Aggregation pipelines complex enough for market analytics require raw
  `prisma.$runCommandRaw`.
- **No declarative migrations:** Schema rollbacks require manual scripting. See
  migration strategy above.
- **TS2305 in CI:** If `prisma generate` has not been run, `@prisma/client` exports
  are absent and the TypeScript compile fails. The `postinstall` hook handles this
  in developer environments; CI must use `--ignore-scripts` and then run
  `npx prisma generate` explicitly (see KNOWN_ERRORS in `verification-gates.js`).
