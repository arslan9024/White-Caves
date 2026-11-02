# Department 6: Distributed Gateway Hubs & Cross-Service API Routers

> **Framework:** White Caves Engineering Matrix V2 (1-12-108 Software Core)  
> **Protocol:** Bhakti 1-12-108  
> **Director:** `@Ruchi` — Principal API Platform Gateway Architect  
> **Tech Stack:** Express.js, REST, WebSocket (socket.io), TypeScript, Zod  
> **Skill Reference:** [`.agents/skills/aegis-dept-06-api-gateway/SKILL.md`](../../skills/aegis-dept-06-api-gateway/SKILL.md)  

---

## 9-Node Engineering Roster

| # | Agent | Role | Responsibility | Config |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **@Ruchi** *(Director)* | Principal API Platform Gateway Architect | Designs unified edge routing distribution maps and public API entry gateways. | [`config`](./node-01-ruchi.agent.json) |
| 2 | **@Daniela** | Microservice Inter-Service Contract Specialist | Establishes RPC network connection parameters and message communication contracts. | [`config`](./node-02-daniela.agent.json) |
| 3 | **@Mary_Meeker** | Network Payload Scaling Analyst | Monitors transaction request flows to dynamically scale internal gateway load bounds. | [`config`](./node-03-mary-meeker.agent.json) |
| 4 | **@Amy_Hood** | External Webhook Lifecycle Cost Specialist | Audits transaction API costs to guarantee optimized outbound request data weights. | [`config`](./node-04-amy-hood.agent.json) |
| 5 | **@Susan_Wojcicki** | Content Delivery Network Routing Engineer | Configures edge network proxies to accelerate binary media payload delivery scripts. | [`config`](./node-05-susan-wojcicki.agent.json) |
| 6 | **@Meg_Whitman** | Container Microservice Node Orchestrator | Manages automated cluster rollover parameters during continuous delivery updates. | [`config`](./node-06-meg-whitman.agent.json) |
| 7 | **@Angela_Ahrendts** | Third-Party Platform Hook Protocol Designer | Standardizes ingress communication maps for handling external developer platform hooks. | [`config`](./node-07-angela-ahrendts.agent.json) |
| 8 | **@Sheryl_Sandberg** | Cross-Department Contract Alignment Coordinator | Harmonizes endpoint request-response interface properties across isolated codebase tracks. | [`config`](./node-08-sheryl-sandberg.agent.json) |
| 9 | **@Kim_Swift** | High-Velocity Stream Processing Programmer | Optimizes event broadcasting message loops to maintain real-time web socket data syncs. | [`config`](./node-09-kim-swift.agent.json) |

---

## Key Codebase Ownership

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

## Operational Procedures

- **API Contract Tests:** `npx vitest run server/routes/`
- **WebSocket Load Test:** `npm run test:ws:load`
- **OpenAPI Spec Validation:** `npx swagger-cli validate openapi.yaml`

---

## Governance

- Single Purpose File Law (< 350 lines)
- TypeScript Strict (zero warnings)
- Zero Backlog Law
- Continuous Deduplication
- Conventional Commits
