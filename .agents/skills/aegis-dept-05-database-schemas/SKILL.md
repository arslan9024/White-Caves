---
name: aegis-dept-05-database-schemas
description: "Coding standards, operational procedures, and engineering rules for AEGIS Department 5: Relational Schemas & Cloud Object Key Data Stores"
---

# Department 5: Relational Schemas & Cloud Object Key Data Stores

> **Framework:** White Caves Engineering Matrix V2 (1-12-108 Software Core)  
> **Protocol:** Bhakti 1-12-108  
> **Director:** `@Barbara` — Principal Relational Database Architect  
> **Tech Stack:** Prisma ORM, MongoDB, TypeScript, Redis  

---

## 9-Node Engineering Roster

| # | Agent | Role | Responsibility |
| :--- | :--- | :--- | :--- |
| 1 | `@Barbara` *(Director)* | Principal Relational Database Architect | Designs master schema diagrams and entity relationship definitions for tracking records. |
| 2 | `@Anima_Research` | Prisma ORM Client Modeling Specialist | Maintains relational schema model definitions inside code persistence modules. |
| 3 | `@Cassie_Data` | High-Performance Query Tuning Engineer | Indexes slow lookup tracks and optimizes database aggregation pipelines to keep runs sub-10ms. |
| 4 | `@Jennifer_Widom` | Automated Data Index Tuning Specialist | Constructs automated execution plan monitoring systems over core collection files. |
| 5 | `@Cynthia_Dwork` | Differential Privacy Model Configurator | Enforces strict mathematical privacy rules over historical data warehouse pipelines. |
| 6 | `@Latanya_Sweeney` | Data Integrity & Identity De-anonymizer Auditor | Validates schema typing boundaries to prevent identifying data leakage inside analytical pools. |
| 7 | `@Daphne_Koller` | NoSQL JSON Document Collection Engineer | Structures high-performance non-relational document stores for handling unstructured logs safely. |
| 8 | `@Pat_Hanrahan` | Spatial Entity Node Relationship Programmer | Maps data coordinate attributes cleanly across complex spatial relational entities. |
| 9 | `@Heidi_Lam` | Database Transaction Concurrency Controller | Optimizes resource connection pooling to isolate locks during parallel bulk database writes. |

---

## Key Codebase Files & Directories

- `prisma/schema.prisma`
- `prisma/seed.ts`
- `server/services/`
- `src/utils/cacheUtils.js`

---

## Mandatory Coding Rules

1. All schema changes must go through Prisma migrations — never modify DB directly
2. Query performance: all lookups must use indexed fields — target sub-10ms execution
3. Aggregation pipelines must be profiled before deployment
4. Connection pooling: max 10 connections per service instance
5. Transaction isolation: use Prisma.$transaction() for multi-document writes
6. Data privacy: PII fields must be encrypted at rest and masked in logs
7. Cache strategy: use Redis for frequently accessed data with 5-minute TTL
8. Seed data must be idempotent — re-runnable without duplicating records

---

## Standard Operating Procedures

### Prisma Generate
```bash
npx prisma generate
```

### Prisma DB Push
```bash
npx prisma db push
```

### Schema Validation
```bash
npx prisma validate
```

### Seed Database
```bash
npx prisma db seed
```

---

## Aegis V4.1 Governance (All Departments)

1. **Single Purpose File Law:** Every source file must have a single responsibility and remain under 350 lines.
2. **Canonical 5-Way File Standard:** View (`.view.tsx`), Logic (`.logic.ts`), Styles (`.styles.ts`), Data (`.data.ts`), Config (`.config.ts`).
3. **TypeScript Strict:** Zero warnings, zero `any` bypasses, zero `@ts-ignore` comments.
4. **Continuous Deduplication:** Zero duplicate handlers, zero ghost directories, zero redundant imports.
5. **Zero-Backlog Law:** All PRs and issues must be resolved before moving to the next sprint.
6. **Token Preservation Shield:** Hard 15,000 token ceiling per task — no runaway retry loops.
7. **Conventional Commits:** All commits must follow `feat|fix|chore|refactor|test|docs(scope): message` format.
