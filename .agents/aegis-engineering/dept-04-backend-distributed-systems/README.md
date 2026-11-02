# Department 4: High-Throughput Backend & Distributed Core Systems

> **Framework:** White Caves Engineering Matrix V2 (1-12-108 Software Core)  
> **Protocol:** Bhakti 1-12-108  
> **Director:** `@Mira` — Principal Server Infrastructure Systems Architect  
> **Tech Stack:** Node.js 20+, Express.js, TypeScript, Prisma, MongoDB  
> **Skill Reference:** [`.agents/skills/aegis-dept-04-backend-systems/SKILL.md`](../../skills/aegis-dept-04-backend-systems/SKILL.md)  

---

## 9-Node Engineering Roster

| # | Agent | Role | Responsibility | Config |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **@Mira** *(Director)* | Principal Server Infrastructure Systems Architect | Designs scalable multi-threaded server architecture routines for high-frequency data handling. | [`config`](./node-01-mira.agent.json) |
| 2 | **@Petra** | Senior Node.js Core Backend Developer | Authors canonical business rules controllers and modular system processing pathways. | [`config`](./node-02-petra.agent.json) |
| 3 | **@Barbara_Liskov** | Backend Subsystem Abstraction Specialist | Enforces strict class definition principles across all server runtime modules. | [`config`](./node-03-barbara-liskov.agent.json) |
| 4 | **@Frances_Allen** | Instruction Set Compiling Optimization Expert | Refines code compilation paths to minimize server thread processing delays. | [`config`](./node-04-frances-allen.agent.json) |
| 5 | **@Jean_Sammet** | Core Logic Expression Parser Programmer | Maintains calculation engines responsible for computing tiered pricing matrices. | [`config`](./node-05-jean-sammet.agent.json) |
| 6 | **@Ursula_Burns** | Parallel Server Transaction Coordinator | Balances asynchronous background queue pipelines to manage data traffic spikes smoothly. | [`config`](./node-06-ursula-burns.agent.json) |
| 7 | **@Padmasree_Warrior** | Distributed Microservice Network Engineer | Manages container networking rules to protect internal data flows from communication lag. | [`config`](./node-07-padmasree-warrior.agent.json) |
| 8 | **@Peggy_Johnson** | Enterprise Software Interface Integrator | Binds application service layers securely to core multi-server transaction backbones. | [`config`](./node-08-peggy-johnson.agent.json) |
| 9 | **@Ruth_Porat** | Backend Compute Resource Efficiency Auditor | Instruments logging loops to discover and fix memory leak vulnerabilities in server processes. | [`config`](./node-09-ruth-porat.agent.json) |

---

## Key Codebase Ownership

- `server/`
- `server/routes/`
- `server/controllers/`
- `server/middleware/`
- `server/services/`

---

## Mandatory Coding Rules

1. All routes must use Express Router with typed request/response handlers
2. Business logic MUST live in services/ — controllers are thin wrappers only
3. Every endpoint must have input validation via Zod schemas
4. Authentication middleware must verify JWT tokens on all protected routes
5. Error handling: use centralized HttpError class (src/utils/HttpError.ts)
6. Rate limiting: all public endpoints must have express-rate-limit configured
7. Response compression: enable gzip for all JSON responses > 1KB
8. Logging: structured JSON logs via src/utils/logger.ts — no console.log in production

---

## Operational Procedures

- **API Integration Tests:** `npx vitest run server/`
- **TypeScript Backend Check:** `npx tsc --noEmit --project server/tsconfig.json`
- **Route Security Scan:** `npm run security:scan`

---

## Governance

- Single Purpose File Law (< 350 lines)
- TypeScript Strict (zero warnings)
- Zero Backlog Law
- Continuous Deduplication
- Conventional Commits
