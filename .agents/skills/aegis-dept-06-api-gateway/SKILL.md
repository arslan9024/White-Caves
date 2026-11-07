---
name: aegis-dept-06-api-gateway
description: "Coding standards, operational procedures, and engineering rules for AEGIS Department 6: Distributed Gateway Hubs & Cross-Service API Routers"
---

# Department 6: Distributed Gateway Hubs & Cross-Service API Routers

> **Framework:** White Caves Engineering Matrix V2 (1-12-108 Software Core)  
> **Protocol:** Bhakti 1-12-108  
> **Director:** `@Ruchi` — Principal API Platform Gateway Architect  
> **Tech Stack:** Express.js, REST, WebSocket (socket.io), TypeScript, Zod  

---

## 9-Node Engineering Roster

| # | Agent | Role | Responsibility |
| :--- | :--- | :--- | :--- |
| 1 | `@Ruchi` *(Director)* | Principal API Platform Gateway Architect | Designs unified edge routing distribution maps and public API entry gateways. |
| 2 | `@Daniela` | Microservice Inter-Service Contract Specialist | Establishes RPC network connection parameters and message communication contracts. |
| 3 | `@Mary_Meeker` | Network Payload Scaling Analyst | Monitors transaction request flows to dynamically scale internal gateway load bounds. |
| 4 | `@Amy_Hood` | External Webhook Lifecycle Cost Specialist | Audits transaction API costs to guarantee optimized outbound request data weights. |
| 5 | `@Susan_Wojcicki` | Content Delivery Network Routing Engineer | Configures edge network proxies to accelerate binary media payload delivery scripts. |
| 6 | `@Meg_Whitman` | Container Microservice Node Orchestrator | Manages automated cluster rollover parameters during continuous delivery updates. |
| 7 | `@Angela_Ahrendts` | Third-Party Platform Hook Protocol Designer | Standardizes ingress communication maps for handling external developer platform hooks. |
| 8 | `@Sheryl_Sandberg` | Cross-Department Contract Alignment Coordinator | Harmonizes endpoint request-response interface properties across isolated codebase tracks. |
| 9 | `@Kim_Swift` | High-Velocity Stream Processing Programmer | Optimizes event broadcasting message loops to maintain real-time web socket data syncs. |

---

## Key Codebase Files & Directories

- `server/routes/`
- `server/middleware/`
- `server/services/`
- `src/utils/apiClient.ts`

---

## Mandatory Coding Rules

1. API versioning: all public endpoints must be under /api/v1/ prefix
2. Request/response contracts must be defined with Zod schemas
3. Webhook handlers must validate signatures before processing payloads
4. CDN: static assets must be served via edge with Cache-Control headers
5. WebSocket: rooms must be scoped per-tenant — no cross-tenant data leaks
6. Rate limiting: tier-based — 100/min for standard, 1000/min for premium
7. CORS: whitelist only known origins — never use wildcard in production
8. Payload compression: responses > 1KB must use gzip encoding

---

## Standard Operating Procedures

### API Contract Tests
```bash
npx vitest run server/routes/
```

### WebSocket Load Test
```bash
npm run test:ws:load
```

### OpenAPI Spec Validation
```bash
npx swagger-cli validate openapi.yaml
```

---

## AEGIS V5.0 Governance & Protocol Constitution (All Departments)

1. **Protocol Matrices (AEG-001 – AEG-042):** Enforce all 5 CSV matrices in .agents/aegis/protocols/ (PROMETHEUS_CORE_UNBOUND, TURING_SILENT_VELOCITY, PHOENIX_SHIELD_ISOLATION, VALKYRIE_LEDGER_RISE, APOCALYPSE_OVERDRIVE_MATRIX).
2. **Zero Context Overcrowding (AEG-003 / AEG-041):** Global React Context is restricted strictly to the Context Triad (ThemeContext, LanguageContext, CurrencyContext). All transactional state uses Redux Toolkit slices.
3. **Single Purpose File Law & Modular Co-Location (AEG-008):** Every source file must remain under 350 lines and follow the Canonical 7-Category / 12-Way modular architecture.
4. **TypeScript & Pre-Commit Strictness (AEG-016 / AEG-022):** Zero warnings, zero ny bypasses, zero plaintext secrets via .husky/pre-commit.
5. **Continuous Deduplication & Single Source of Truth:** Zero duplicate handlers, zero ghost directories, and all orchestration consolidated inside .agents/.
