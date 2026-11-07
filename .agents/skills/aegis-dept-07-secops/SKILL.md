---
name: aegis-dept-07-secops
description: "Coding standards, operational procedures, and engineering rules for AEGIS Department 7: Application Defense & Cryptographic Integrity Gates (SecOps)"
---

# Department 7: Application Defense & Cryptographic Integrity Gates (SecOps)

> **Framework:** White Caves Engineering Matrix V2 (1-12-108 Software Core)  
> **Protocol:** Bhakti 1-12-108  
> **Director:** `@Sofia` — Principal Cyber Security Shield Architect  
> **Tech Stack:** TypeScript, bcrypt, jsonwebtoken, helmet, csurf, express-rate-limit  

---

## 9-Node Engineering Roster

| # | Agent | Role | Responsibility |
| :--- | :--- | :--- | :--- |
| 1 | `@Sofia` *(Director)* | Principal Cyber Security Shield Architect | Owns level 5 system defense layout protocols, session parameters, and encryption boundaries. |
| 2 | `@Katherine` | Identity Access Validation Token Engineer | Maintains fine-grained role-based access control (RBAC) security verification code pathways. |
| 3 | `@Radia` | Input Validation Sanitization Guard Specialist | Scrubs system template fields against persistent cross-site scripting (XSS) exploit vectors. |
| 4 | `@Ecem` | Staging Credential Environment Vault Guardian | Secures infrastructure encryption keys, server credentials, and active database .env files. |
| 5 | `@Joy` | Code Package Vulnerability Auditor | Scans third-party node configurations to intercept and drop outdated external libraries. |
| 6 | `@Shafi_Goldwasser` | Zero-Knowledge Authentication Proof Architect | Develops secure cryptographic validation procedures for remote data handshakes. |
| 7 | `@Dorothy_Denning` | Intrusion Detection System Sequence Developer | Programs real-time server traffic analytics engines to auto-block suspicious query paths. |
| 8 | `@Joan_Feigenbaum` | Decentralized Access Authorization Specialist | Secures authentication code operations across split deployment server instances safely. |
| 9 | `@Mary_Lou_Jepsen` | Runtime Process Stack Boundary Guard | Defends code execution spaces against memory overrun manipulations and trace vulnerabilities. |

---

## Key Codebase Files & Directories

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

## Standard Operating Procedures

### Security Audit
```bash
npm audit --production
```

### Permission Tests
```bash
npx vitest run src/utils/permissions.test.ts
```

### PII Masker Tests
```bash
npx vitest run src/utils/piiMasker.test.ts
```

### Safe Redirect Tests
```bash
npx vitest run src/utils/safeRedirect.test.ts
```

---

## AEGIS V5.0 Governance & Protocol Constitution (All Departments)

1. **Protocol Matrices (AEG-001 – AEG-042):** Enforce all 5 CSV matrices in .agents/aegis/protocols/ (PROMETHEUS_CORE_UNBOUND, TURING_SILENT_VELOCITY, PHOENIX_SHIELD_ISOLATION, VALKYRIE_LEDGER_RISE, APOCALYPSE_OVERDRIVE_MATRIX).
2. **Zero Context Overcrowding (AEG-003 / AEG-041):** Global React Context is restricted strictly to the Context Triad (ThemeContext, LanguageContext, CurrencyContext). All transactional state uses Redux Toolkit slices.
3. **Single Purpose File Law & Modular Co-Location (AEG-008):** Every source file must remain under 350 lines and follow the Canonical 7-Category / 12-Way modular architecture.
4. **TypeScript & Pre-Commit Strictness (AEG-016 / AEG-022):** Zero warnings, zero ny bypasses, zero plaintext secrets via .husky/pre-commit.
5. **Continuous Deduplication & Single Source of Truth:** Zero duplicate handlers, zero ghost directories, and all orchestration consolidated inside .agents/.
