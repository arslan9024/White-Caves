# Department 7: Application Defense & Cryptographic Integrity Gates (SecOps)

> **Framework:** White Caves Engineering Matrix V2 (1-12-108 Software Core)  
> **Protocol:** Bhakti 1-12-108  
> **Director:** `@Sofia` — Principal Cyber Security Shield Architect  
> **Tech Stack:** TypeScript, bcrypt, jsonwebtoken, helmet, csurf, express-rate-limit  
> **Skill Reference:** [`.agents/skills/aegis-dept-07-secops/SKILL.md`](../../skills/aegis-dept-07-secops/SKILL.md)  

---

## 9-Node Engineering Roster

| # | Agent | Role | Responsibility | Config |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **@Sofia** *(Director)* | Principal Cyber Security Shield Architect | Owns level 5 system defense layout protocols, session parameters, and encryption boundaries. | [`config`](./node-01-sofia.agent.json) |
| 2 | **@Katherine** | Identity Access Validation Token Engineer | Maintains fine-grained role-based access control (RBAC) security verification code pathways. | [`config`](./node-02-katherine.agent.json) |
| 3 | **@Radia** | Input Validation Sanitization Guard Specialist | Scrubs system template fields against persistent cross-site scripting (XSS) exploit vectors. | [`config`](./node-03-radia.agent.json) |
| 4 | **@Ecem** | Staging Credential Environment Vault Guardian | Secures infrastructure encryption keys, server credentials, and active database .env files. | [`config`](./node-04-ecem.agent.json) |
| 5 | **@Joy** | Code Package Vulnerability Auditor | Scans third-party node configurations to intercept and drop outdated external libraries. | [`config`](./node-05-joy.agent.json) |
| 6 | **@Shafi_Goldwasser** | Zero-Knowledge Authentication Proof Architect | Develops secure cryptographic validation procedures for remote data handshakes. | [`config`](./node-06-shafi-goldwasser.agent.json) |
| 7 | **@Dorothy_Denning** | Intrusion Detection System Sequence Developer | Programs real-time server traffic analytics engines to auto-block suspicious query paths. | [`config`](./node-07-dorothy-denning.agent.json) |
| 8 | **@Joan_Feigenbaum** | Decentralized Access Authorization Specialist | Secures authentication code operations across split deployment server instances safely. | [`config`](./node-08-joan-feigenbaum.agent.json) |
| 9 | **@Mary_Lou_Jepsen** | Runtime Process Stack Boundary Guard | Defends code execution spaces against memory overrun manipulations and trace vulnerabilities. | [`config`](./node-09-mary-lou-jepsen.agent.json) |

---

## Key Codebase Ownership

- `server/middleware/auth.ts`
- `src/utils/permissions.ts`
- `src/utils/safeRedirect.ts`
- `src/utils/piiMasker.ts`
- `src/utils/loadSecrets.ts`

---

## Mandatory Coding Rules

1. All authentication must use JWT with RS256 signing — never HS256 in production
2. RBAC enforcement: every route must check permissions via src/utils/permissions.ts
3. XSS prevention: all user inputs must be sanitized before rendering or storage
4. CSRF: all state-changing endpoints must validate CSRF tokens
5. Secrets: never commit .env files — use src/utils/loadSecrets.ts for runtime loading
6. Password hashing: bcrypt with minimum 12 salt rounds
7. PII masking: all logs must run through src/utils/piiMasker.ts before output
8. Dependency scanning: npm audit must pass with 0 high/critical vulnerabilities
9. Safe redirects: all redirect URLs must pass src/utils/safeRedirect.ts validation

---

## Operational Procedures

- **Security Audit:** `npm audit --production`
- **Permission Tests:** `npx vitest run src/utils/permissions.test.ts`
- **PII Masker Tests:** `npx vitest run src/utils/piiMasker.test.ts`
- **Safe Redirect Tests:** `npx vitest run src/utils/safeRedirect.test.ts`

---

## Governance

- Single Purpose File Law (< 350 lines)
- TypeScript Strict (zero warnings)
- Zero Backlog Law
- Continuous Deduplication
- Conventional Commits
