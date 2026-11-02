# Department 12: Defensive Coding, SQA & Automated End-to-End Testing

> **Framework:** White Caves Engineering Matrix V2 (1-12-108 Software Core)  
> **Protocol:** Bhakti 1-12-108  
> **Director:** `@Rachel_QA` — Principal Software Quality Assurance Architect  
> **Tech Stack:** Vitest, Playwright, TypeScript, Testing Library, MSW (Mock Service Worker)  
> **Skill Reference:** [`.agents/skills/aegis-dept-12-sqa-testing/SKILL.md`](../../skills/aegis-dept-12-sqa-testing/SKILL.md)  

---

## 9-Node Engineering Roster

| # | Agent | Role | Responsibility | Config |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **@Rachel_QA** *(Director)* | Principal Software Quality Assurance Architect | Owns overall validation check criteria, system test strategies, and quality gates. | [`config`](./node-01-rachel-qa.agent.json) |
| 2 | **@Corinne_QA** | Calculation Engine Unit Test Specialist | Writes strict unit assertions to validate multi-tiered calculation formulas. | [`config`](./node-02-corinne-qa.agent.json) |
| 3 | **@Olivia_QA** | Automated Playwright End-to-End Specialist | Maintains complete automated user journey replication scripts across transaction views. | [`config`](./node-03-olivia-qa.agent.json) |
| 4 | **@Nina_QA** | Pre-Merge Staging Smoke Test Developer | Configures automated pre-commit gates to block regressions from active git branches. | [`config`](./node-04-nina-qa.agent.json) |
| 5 | **@Nadia_QA** | API Shape Contract Contract Assessor | Confirms live backend endpoint response structures comply with TypeScript type maps. | [`config`](./node-05-nadia-qa.agent.json) |
| 6 | **@Katie_Bouman** | Data Integrity Visual Imaging Specialist | Deploys visual screenshot layout comparison checks to auto-flag rendering drifts. | [`config`](./node-06-katie-bouman.agent.json) |
| 7 | **@Margaret_Hamilton** | Asynchronous Thread Crash Profiler | Performs deep asynchronous execution tests to defend systems from race conditions. | [`config`](./node-07-margaret-hamilton.agent.json) |
| 8 | **@Annette_Wagner** | Interactive Component Testing Auditor | Validates responsive visual components across extreme scaling view variables. | [`config`](./node-08-annette-wagner.agent.json) |
| 9 | **@Rebecca_Heineman** | High-Stress Logic Breakage Specialist | Runs automated brute-force fuzz injection checking pipelines across input routes. | [`config`](./node-09-rebecca-heineman.agent.json) |

---

## Key Codebase Ownership

- `src/**/*.test.ts`
- `src/**/*.test.tsx`
- `e2e/`
- `vitest.config.ts`
- `playwright.config.ts`

---

## Mandatory Coding Rules

1. Test coverage: minimum 80% on all business-critical paths
2. Unit tests: use Vitest + Testing Library for component/util tests
3. E2E tests: use Playwright for critical user journeys (auth, property search, CRM flows)
4. API contract tests: validate response shapes against TypeScript interfaces
5. Mock external APIs: use MSW (Mock Service Worker) — never hit real endpoints in tests
6. Visual regression: screenshot comparison for critical UI components
7. Pre-merge gate: all tests must pass before PR merge is allowed
8. Fuzz testing: run input fuzzing on form fields and search endpoints quarterly
9. Test data: use deterministic fixtures — never Math.random() in test setup

---

## Operational Procedures

- **Full Test Suite:** `npx vitest run`
- **E2E Tests:** `npx playwright test`
- **Coverage Report:** `npx vitest run --coverage`
- **Auth Flow Tests:** `npx vitest run src/pages/auth/`
- **Component Tests:** `npx vitest run src/components/`

---

## Governance

- Single Purpose File Law (< 350 lines)
- TypeScript Strict (zero warnings)
- Zero Backlog Law
- Continuous Deduplication
- Conventional Commits
