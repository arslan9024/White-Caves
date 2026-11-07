# Server Route Test Coverage Uplift Plan & Verification

> **Tracking:** `DU007` | **Agent:** `@Salma` (Backend Quality & SQA Integration Lead) | **Status:** `ACTIVE SPECIFICATION`  
> **CONSUMES:** `server/routes/v1Deals.ts`, `server/routes/v1Customers.ts`, `server/routes/v1Documents.ts`, `server/routes/v1Relationships.ts`, `server/routes/v1Tasks.ts`  
> **FEEDS:** `plans/IMPROVEMENTS_UX.md`  
> **FEEDS_ACK:** `AEGIS-V5-QUALITY-ROUTE-UPLIFT-ACK`

---

## 1. Overview & Scope
To prevent regression drift across high-throughput CRM microservices, this specification establishes automated integration test coverage across all `server/routes/v1*.ts` routes:
- **`v1Deals`**: Deal creation, status transitions, commission validation.
- **`v1Customers`**: Investor/Buyer/Tenant CRUD, type filters, and search queries.
- **`v1Documents`**: Title deeds, Oqood filings, KYC passports.
- **`v1Relationships`**: Multi-owner linking, broker-to-client graphs.
- **`v1Tasks`**: P0/P1 SLA compliance tasks and follow-up triggers.

---

## 2. Test Verification Architecture (`server/routes/v1Routes.test.ts`)
- All 5 microservices are mounted on a dedicated isolated Express test application.
- Supertest simulates HTTP requests with sub-150ms execution times.
- 14 integration test assertions verify status code, response envelopes, pagination, and error handling.

---

## 3. Measurable Acceptance Criteria
1. **Pass Rate**: 100% of routes must return `{ success: true, data: [...] }`.
2. **Missing Routes Coverage**: All `server/routes/v1*.ts` files must have corresponding test coverage in `server/routes/v1Routes.test.ts`.
3. **Execution SLA**: Total test suite duration must complete under 3 seconds in Vitest (`TURING-LAW-000`).
