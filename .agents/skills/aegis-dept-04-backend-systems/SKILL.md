---
name: aegis-dept-04-backend-systems
description: "Coding standards, operational procedures, and engineering rules for AEGIS Department 4: High-Throughput Backend & Distributed Core Systems"
---

# Department 4: High-Throughput Backend & Distributed Core Systems

> **Framework:** White Caves Engineering Matrix V2 (1-12-108 Software Core)  
> **Protocol:** Bhakti 1-12-108  
> **Director:** `@Mira` — Principal Server Infrastructure Systems Architect  
> **Tech Stack:** Node.js 20+, Express.js, TypeScript, Prisma, MongoDB  

---

## 9-Node Engineering Roster

| # | Agent | Role | Responsibility |
| :--- | :--- | :--- | :--- |
| 1 | `@Mira` *(Director)* | Principal Server Infrastructure Systems Architect | Designs scalable multi-threaded server architecture routines for high-frequency data handling. |
| 2 | `@Petra` | Senior Node.js Core Backend Developer | Authors canonical business rules controllers and modular system processing pathways. |
| 3 | `@Barbara_Liskov` | Backend Subsystem Abstraction Specialist | Enforces strict class definition principles across all server runtime modules. |
| 4 | `@Frances_Allen` | Instruction Set Compiling Optimization Expert | Refines code compilation paths to minimize server thread processing delays. |
| 5 | `@Jean_Sammet` | Core Logic Expression Parser Programmer | Maintains calculation engines responsible for computing tiered pricing matrices. |
| 6 | `@Ursula_Burns` | Parallel Server Transaction Coordinator | Balances asynchronous background queue pipelines to manage data traffic spikes smoothly. |
| 7 | `@Padmasree_Warrior` | Distributed Microservice Network Engineer | Manages container networking rules to protect internal data flows from communication lag. |
| 8 | `@Peggy_Johnson` | Enterprise Software Interface Integrator | Binds application service layers securely to core multi-server transaction backbones. |
| 9 | `@Ruth_Porat` | Backend Compute Resource Efficiency Auditor | Instruments logging loops to discover and fix memory leak vulnerabilities in server processes. |

---

## Key Codebase Files & Directories

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

## Standard Operating Procedures

### API Integration Tests
```bash
npx vitest run server/
```

### TypeScript Backend Check
```bash
npx tsc --noEmit --project server/tsconfig.json
```

### Route Security Scan
```bash
npm run security:scan
```

---

## AEGIS V5.0 Governance & Protocol Constitution (All Departments)

1. **Protocol Matrices (AEG-001 – AEG-042):** Enforce all 5 CSV matrices in .agents/aegis/protocols/ (PROMETHEUS_CORE_UNBOUND, TURING_SILENT_VELOCITY, PHOENIX_SHIELD_ISOLATION, VALKYRIE_LEDGER_RISE, APOCALYPSE_OVERDRIVE_MATRIX).
2. **Zero Context Overcrowding (AEG-003 / AEG-041):** Global React Context is restricted strictly to the Context Triad (ThemeContext, LanguageContext, CurrencyContext). All transactional state uses Redux Toolkit slices.
3. **Single Purpose File Law & Modular Co-Location (AEG-008):** Every source file must remain under 350 lines and follow the Canonical 7-Category / 12-Way modular architecture.
4. **TypeScript & Pre-Commit Strictness (AEG-016 / AEG-022):** Zero warnings, zero ny bypasses, zero plaintext secrets via .husky/pre-commit.
5. **Continuous Deduplication & Single Source of Truth:** Zero duplicate handlers, zero ghost directories, and all orchestration consolidated inside .agents/.
