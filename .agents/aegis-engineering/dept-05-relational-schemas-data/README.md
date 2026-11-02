# Department 5: Relational Schemas & Cloud Object Key Data Stores

> **Framework:** White Caves Engineering Matrix V2 (1-12-108 Software Core)  
> **Protocol:** Bhakti 1-12-108  
> **Director:** `@Barbara` — Principal Relational Database Architect  
> **Tech Stack:** Prisma ORM, MongoDB, TypeScript, Redis  
> **Skill Reference:** [`.agents/skills/aegis-dept-05-database-schemas/SKILL.md`](../../skills/aegis-dept-05-database-schemas/SKILL.md)  

---

## 9-Node Engineering Roster

| # | Agent | Role | Responsibility | Config |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **@Barbara** *(Director)* | Principal Relational Database Architect | Designs master schema diagrams and entity relationship definitions for tracking records. | [`config`](./node-01-barbara.agent.json) |
| 2 | **@Anima_Research** | Prisma ORM Client Modeling Specialist | Maintains relational schema model definitions inside code persistence modules. | [`config`](./node-02-anima-research.agent.json) |
| 3 | **@Cassie_Data** | High-Performance Query Tuning Engineer | Indexes slow lookup tracks and optimizes database aggregation pipelines to keep runs sub-10ms. | [`config`](./node-03-cassie-data.agent.json) |
| 4 | **@Jennifer_Widom** | Automated Data Index Tuning Specialist | Constructs automated execution plan monitoring systems over core collection files. | [`config`](./node-04-jennifer-widom.agent.json) |
| 5 | **@Cynthia_Dwork** | Differential Privacy Model Configurator | Enforces strict mathematical privacy rules over historical data warehouse pipelines. | [`config`](./node-05-cynthia-dwork.agent.json) |
| 6 | **@Latanya_Sweeney** | Data Integrity & Identity De-anonymizer Auditor | Validates schema typing boundaries to prevent identifying data leakage inside analytical pools. | [`config`](./node-06-latanya-sweeney.agent.json) |
| 7 | **@Daphne_Koller** | NoSQL JSON Document Collection Engineer | Structures high-performance non-relational document stores for handling unstructured logs safely. | [`config`](./node-07-daphne-koller.agent.json) |
| 8 | **@Pat_Hanrahan** | Spatial Entity Node Relationship Programmer | Maps data coordinate attributes cleanly across complex spatial relational entities. | [`config`](./node-08-pat-hanrahan.agent.json) |
| 9 | **@Heidi_Lam** | Database Transaction Concurrency Controller | Optimizes resource connection pooling to isolate locks during parallel bulk database writes. | [`config`](./node-09-heidi-lam.agent.json) |

---

## Key Codebase Ownership

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

## Operational Procedures

- **Prisma Generate:** `npx prisma generate`
- **Prisma DB Push:** `npx prisma db push`
- **Schema Validation:** `npx prisma validate`
- **Seed Database:** `npx prisma db seed`

---

## Governance

- Single Purpose File Law (< 350 lines)
- TypeScript Strict (zero warnings)
- Zero Backlog Law
- Continuous Deduplication
- Conventional Commits
