# WAVE_01 -- Test Plan and Staged Rollout

> **Generated:** 2026-05-06 | Modules: 17 | Framework: Vitest (unit/integration) + Playwright (E2E)
> Coverage targets: Unit >= 90% | Integration >= 80% | E2E >= critical paths

---

## Test Infrastructure

| Layer       | Framework   | Config File          | Run Command              |
| ----------- | ----------- | -------------------- | ------------------------ |
| Unit        | Vitest      | vitest.config.js     | npm run test:unit        |
| Integration | Vitest      | vitest.config.js     | npm run test:integration |
| E2E         | Playwright  | playwright.config.ts | npm run test:e2e         |
| Coverage    | Vitest + c8 | vitest.config.js     | npm run test:coverage    |

---

## Lane A -- Compliance / Legal / UX / AI

### @Sofia -- Compliance baseline expansion

#### Unit Tests

- **File:** `src/services/sofia.service.test.ts`
- **Framework:** Vitest
- **Coverage target:** >= 90%

| Scenario                               | Test Type  | Expected                           |
| -------------------------------------- | ---------- | ---------------------------------- |
| Create Sofia -- valid data             | Happy path | Returns created entity with id     |
| Create Sofia -- missing required field | Validation | Throws ZodError                    |
| Get Sofia by id -- exists              | Happy path | Returns full entity                |
| Get Sofia by id -- not found           | Error      | Throws NotFoundError (404)         |
| Update Sofia -- valid data             | Happy path | Returns updated entity             |
| Update Sofia -- unauthorized role      | Auth       | Throws ForbiddenError (403)        |
| Delete Sofia -- admin role             | Happy path | Soft-deletes, returns 204          |
| Delete Sofia -- non-admin              | Auth       | Throws ForbiddenError (403)        |
| List Sofia -- paginated                | Pagination | Returns page=1 limit=10 with total |
| List Sofia -- invalid filter           | Validation | Throws ZodError                    |

#### Integration Tests

- **File:** `test/sofia.integration.test.ts`
- **Framework:** Vitest + MongoDB in-memory
- **Coverage target:** >= 80%

| Scenario                           | Setup                    | Expected                     |
| ---------------------------------- | ------------------------ | ---------------------------- |
| DB round-trip: create and retrieve | Seed test DB             | Persisted data matches input |
| RERA/DLD validation roundtrip      | Compliance rules active  | Rule violations rejected     |
| Audit trail written on mutation    | Mutation triggered       | audit_trail doc exists       |
| Concurrent update handled          | Two simultaneous updates | One wins, no data corruption |
| Pagination returns correct cursor  | 25 docs seeded           | Page 1 = 10, page 3 = 5      |
| Soft-delete excludes from list     | Delete then list         | Deleted doc not in results   |

#### E2E Tests

- **File:** `e2e/sofia.spec.ts`
- **Framework:** Playwright (Chromium)
- **Critical path:** compliance rule is enforced on property listing creation

| Scenario       | Steps                                                    | Pass Criteria                     |
| -------------- | -------------------------------------------------------- | --------------------------------- |
| Critical path  | compliance rule is enforced on property listing creation | No errors, correct data displayed |
| Mobile (375px) | Repeat critical path at 375px viewport                   | Layout intact, no overflow        |
| RTL (Arabic)   | Set lang=ar, repeat critical path                        | Correct right-to-left layout      |
| Error state    | Submit invalid form                                      | Inline error message visible      |
| Empty state    | Load with no data                                        | Empty state UI + CTA visible      |

#### Rollout Gate

| Gate                 | Requirement  | Status  |
| -------------------- | ------------ | ------- |
| Unit coverage        | >= 90%       | PENDING |
| Integration coverage | >= 80%       | PENDING |
| E2E critical path    | PASS         | PENDING |
| TypeScript errors    | 0            | PENDING |
| ESLint errors        | 0            | PENDING |
| Lighthouse perf      | >= 90        | PENDING |
| WCAG AA              | 0 violations | PENDING |
| @Katherine sign-off  | Reviewed     | PENDING |

### @Timnit -- DLD/legal integration expansion

#### Unit Tests

- **File:** `src/services/timnit.service.test.ts`
- **Framework:** Vitest
- **Coverage target:** >= 90%

| Scenario                                | Test Type  | Expected                           |
| --------------------------------------- | ---------- | ---------------------------------- |
| Create Timnit -- valid data             | Happy path | Returns created entity with id     |
| Create Timnit -- missing required field | Validation | Throws ZodError                    |
| Get Timnit by id -- exists              | Happy path | Returns full entity                |
| Get Timnit by id -- not found           | Error      | Throws NotFoundError (404)         |
| Update Timnit -- valid data             | Happy path | Returns updated entity             |
| Update Timnit -- unauthorized role      | Auth       | Throws ForbiddenError (403)        |
| Delete Timnit -- admin role             | Happy path | Soft-deletes, returns 204          |
| Delete Timnit -- non-admin              | Auth       | Throws ForbiddenError (403)        |
| List Timnit -- paginated                | Pagination | Returns page=1 limit=10 with total |
| List Timnit -- invalid filter           | Validation | Throws ZodError                    |

#### Integration Tests

- **File:** `test/timnit.integration.test.ts`
- **Framework:** Vitest + MongoDB in-memory
- **Coverage target:** >= 80%

| Scenario                           | Setup                    | Expected                     |
| ---------------------------------- | ------------------------ | ---------------------------- |
| DB round-trip: create and retrieve | Seed test DB             | Persisted data matches input |
| RERA/DLD validation roundtrip      | Compliance rules active  | Rule violations rejected     |
| Audit trail written on mutation    | Mutation triggered       | audit_trail doc exists       |
| Concurrent update handled          | Two simultaneous updates | One wins, no data corruption |
| Pagination returns correct cursor  | 25 docs seeded           | Page 1 = 10, page 3 = 5      |
| Soft-delete excludes from list     | Delete then list         | Deleted doc not in results   |

#### E2E Tests

- **File:** `e2e/timnit.spec.ts`
- **Framework:** Playwright (Chromium)
- **Critical path:** DLD transaction flow submits and returns case number

| Scenario       | Steps                                                | Pass Criteria                     |
| -------------- | ---------------------------------------------------- | --------------------------------- |
| Critical path  | DLD transaction flow submits and returns case number | No errors, correct data displayed |
| Mobile (375px) | Repeat critical path at 375px viewport               | Layout intact, no overflow        |
| RTL (Arabic)   | Set lang=ar, repeat critical path                    | Correct right-to-left layout      |
| Error state    | Submit invalid form                                  | Inline error message visible      |
| Empty state    | Load with no data                                    | Empty state UI + CTA visible      |

#### Rollout Gate

| Gate                 | Requirement  | Status  |
| -------------------- | ------------ | ------- |
| Unit coverage        | >= 90%       | PENDING |
| Integration coverage | >= 80%       | PENDING |
| E2E critical path    | PASS         | PENDING |
| TypeScript errors    | 0            | PENDING |
| ESLint errors        | 0            | PENDING |
| Lighthouse perf      | >= 90        | PENDING |
| WCAG AA              | 0 violations | PENDING |
| @Katherine sign-off  | Reviewed     | PENDING |

### @Victoria -- Tenancy legal workflow completion

#### Unit Tests

- **File:** `src/services/victoria.service.test.ts`
- **Framework:** Vitest
- **Coverage target:** >= 90%

| Scenario                                  | Test Type  | Expected                           |
| ----------------------------------------- | ---------- | ---------------------------------- |
| Create Victoria -- valid data             | Happy path | Returns created entity with id     |
| Create Victoria -- missing required field | Validation | Throws ZodError                    |
| Get Victoria by id -- exists              | Happy path | Returns full entity                |
| Get Victoria by id -- not found           | Error      | Throws NotFoundError (404)         |
| Update Victoria -- valid data             | Happy path | Returns updated entity             |
| Update Victoria -- unauthorized role      | Auth       | Throws ForbiddenError (403)        |
| Delete Victoria -- admin role             | Happy path | Soft-deletes, returns 204          |
| Delete Victoria -- non-admin              | Auth       | Throws ForbiddenError (403)        |
| List Victoria -- paginated                | Pagination | Returns page=1 limit=10 with total |
| List Victoria -- invalid filter           | Validation | Throws ZodError                    |

#### Integration Tests

- **File:** `test/victoria.integration.test.ts`
- **Framework:** Vitest + MongoDB in-memory
- **Coverage target:** >= 80%

| Scenario                           | Setup                    | Expected                     |
| ---------------------------------- | ------------------------ | ---------------------------- |
| DB round-trip: create and retrieve | Seed test DB             | Persisted data matches input |
| RERA/DLD validation roundtrip      | Compliance rules active  | Rule violations rejected     |
| Audit trail written on mutation    | Mutation triggered       | audit_trail doc exists       |
| Concurrent update handled          | Two simultaneous updates | One wins, no data corruption |
| Pagination returns correct cursor  | 25 docs seeded           | Page 1 = 10, page 3 = 5      |
| Soft-delete excludes from list     | Delete then list         | Deleted doc not in results   |

#### E2E Tests

- **File:** `e2e/victoria.spec.ts`
- **Framework:** Playwright (Chromium)
- **Critical path:** tenancy contract is generated with correct RERA fields

| Scenario       | Steps                                                  | Pass Criteria                     |
| -------------- | ------------------------------------------------------ | --------------------------------- |
| Critical path  | tenancy contract is generated with correct RERA fields | No errors, correct data displayed |
| Mobile (375px) | Repeat critical path at 375px viewport                 | Layout intact, no overflow        |
| RTL (Arabic)   | Set lang=ar, repeat critical path                      | Correct right-to-left layout      |
| Error state    | Submit invalid form                                    | Inline error message visible      |
| Empty state    | Load with no data                                      | Empty state UI + CTA visible      |

#### Rollout Gate

| Gate                 | Requirement  | Status  |
| -------------------- | ------------ | ------- |
| Unit coverage        | >= 90%       | PENDING |
| Integration coverage | >= 80%       | PENDING |
| E2E critical path    | PASS         | PENDING |
| TypeScript errors    | 0            | PENDING |
| ESLint errors        | 0            | PENDING |
| Lighthouse perf      | >= 90        | PENDING |
| WCAG AA              | 0 violations | PENDING |
| @Katherine sign-off  | Reviewed     | PENDING |

### @Annie -- Tenant portal and doc-gen expansion

#### Unit Tests

- **File:** `src/services/annie.service.test.ts`
- **Framework:** Vitest
- **Coverage target:** >= 90%

| Scenario                               | Test Type  | Expected                           |
| -------------------------------------- | ---------- | ---------------------------------- |
| Create Annie -- valid data             | Happy path | Returns created entity with id     |
| Create Annie -- missing required field | Validation | Throws ZodError                    |
| Get Annie by id -- exists              | Happy path | Returns full entity                |
| Get Annie by id -- not found           | Error      | Throws NotFoundError (404)         |
| Update Annie -- valid data             | Happy path | Returns updated entity             |
| Update Annie -- unauthorized role      | Auth       | Throws ForbiddenError (403)        |
| Delete Annie -- admin role             | Happy path | Soft-deletes, returns 204          |
| Delete Annie -- non-admin              | Auth       | Throws ForbiddenError (403)        |
| List Annie -- paginated                | Pagination | Returns page=1 limit=10 with total |
| List Annie -- invalid filter           | Validation | Throws ZodError                    |

#### Integration Tests

- **File:** `test/annie.integration.test.ts`
- **Framework:** Vitest + MongoDB in-memory
- **Coverage target:** >= 80%

| Scenario                           | Setup                    | Expected                     |
| ---------------------------------- | ------------------------ | ---------------------------- |
| DB round-trip: create and retrieve | Seed test DB             | Persisted data matches input |
| RERA/DLD validation roundtrip      | Compliance rules active  | Rule violations rejected     |
| Audit trail written on mutation    | Mutation triggered       | audit_trail doc exists       |
| Concurrent update handled          | Two simultaneous updates | One wins, no data corruption |
| Pagination returns correct cursor  | 25 docs seeded           | Page 1 = 10, page 3 = 5      |
| Soft-delete excludes from list     | Delete then list         | Deleted doc not in results   |

#### E2E Tests

- **File:** `e2e/annie.spec.ts`
- **Framework:** Playwright (Chromium)
- **Critical path:** tenant can log in, view lease, and submit maintenance request

| Scenario       | Steps                                                         | Pass Criteria                     |
| -------------- | ------------------------------------------------------------- | --------------------------------- |
| Critical path  | tenant can log in, view lease, and submit maintenance request | No errors, correct data displayed |
| Mobile (375px) | Repeat critical path at 375px viewport                        | Layout intact, no overflow        |
| RTL (Arabic)   | Set lang=ar, repeat critical path                             | Correct right-to-left layout      |
| Error state    | Submit invalid form                                           | Inline error message visible      |
| Empty state    | Load with no data                                             | Empty state UI + CTA visible      |

#### Rollout Gate

| Gate                 | Requirement  | Status  |
| -------------------- | ------------ | ------- |
| Unit coverage        | >= 90%       | PENDING |
| Integration coverage | >= 80%       | PENDING |
| E2E critical path    | PASS         | PENDING |
| TypeScript errors    | 0            | PENDING |
| ESLint errors        | 0            | PENDING |
| Lighthouse perf      | >= 90        | PENDING |
| WCAG AA              | 0 violations | PENDING |
| @Katherine sign-off  | Reviewed     | PENDING |

### @Marissa -- UX and luxury journey synthesis

#### Unit Tests

- **File:** `src/services/marissa.service.test.ts`
- **Framework:** Vitest
- **Coverage target:** >= 90%

| Scenario                                 | Test Type  | Expected                           |
| ---------------------------------------- | ---------- | ---------------------------------- |
| Create Marissa -- valid data             | Happy path | Returns created entity with id     |
| Create Marissa -- missing required field | Validation | Throws ZodError                    |
| Get Marissa by id -- exists              | Happy path | Returns full entity                |
| Get Marissa by id -- not found           | Error      | Throws NotFoundError (404)         |
| Update Marissa -- valid data             | Happy path | Returns updated entity             |
| Update Marissa -- unauthorized role      | Auth       | Throws ForbiddenError (403)        |
| Delete Marissa -- admin role             | Happy path | Soft-deletes, returns 204          |
| Delete Marissa -- non-admin              | Auth       | Throws ForbiddenError (403)        |
| List Marissa -- paginated                | Pagination | Returns page=1 limit=10 with total |
| List Marissa -- invalid filter           | Validation | Throws ZodError                    |

#### Integration Tests

- **File:** `test/marissa.integration.test.ts`
- **Framework:** Vitest + MongoDB in-memory
- **Coverage target:** >= 80%

| Scenario                           | Setup                    | Expected                     |
| ---------------------------------- | ------------------------ | ---------------------------- |
| DB round-trip: create and retrieve | Seed test DB             | Persisted data matches input |
| RERA/DLD validation roundtrip      | Compliance rules active  | Rule violations rejected     |
| Audit trail written on mutation    | Mutation triggered       | audit_trail doc exists       |
| Concurrent update handled          | Two simultaneous updates | One wins, no data corruption |
| Pagination returns correct cursor  | 25 docs seeded           | Page 1 = 10, page 3 = 5      |
| Soft-delete excludes from list     | Delete then list         | Deleted doc not in results   |

#### E2E Tests

- **File:** `e2e/marissa.spec.ts`
- **Framework:** Playwright (Chromium)
- **Critical path:** luxury property listing triggers VIP concierge workflow

| Scenario       | Steps                                                   | Pass Criteria                     |
| -------------- | ------------------------------------------------------- | --------------------------------- |
| Critical path  | luxury property listing triggers VIP concierge workflow | No errors, correct data displayed |
| Mobile (375px) | Repeat critical path at 375px viewport                  | Layout intact, no overflow        |
| RTL (Arabic)   | Set lang=ar, repeat critical path                       | Correct right-to-left layout      |
| Error state    | Submit invalid form                                     | Inline error message visible      |
| Empty state    | Load with no data                                       | Empty state UI + CTA visible      |

#### Rollout Gate

| Gate                 | Requirement  | Status  |
| -------------------- | ------------ | ------- |
| Unit coverage        | >= 90%       | PENDING |
| Integration coverage | >= 80%       | PENDING |
| E2E critical path    | PASS         | PENDING |
| TypeScript errors    | 0            | PENDING |
| ESLint errors        | 0            | PENDING |
| Lighthouse perf      | >= 90        | PENDING |
| WCAG AA              | 0 violations | PENDING |
| @Katherine sign-off  | Reviewed     | PENDING |

### @Rachel -- SEO/marketing strategy enrichment

#### Unit Tests

- **File:** `src/services/rachel.service.test.ts`
- **Framework:** Vitest
- **Coverage target:** >= 90%

| Scenario                                | Test Type  | Expected                           |
| --------------------------------------- | ---------- | ---------------------------------- |
| Create Rachel -- valid data             | Happy path | Returns created entity with id     |
| Create Rachel -- missing required field | Validation | Throws ZodError                    |
| Get Rachel by id -- exists              | Happy path | Returns full entity                |
| Get Rachel by id -- not found           | Error      | Throws NotFoundError (404)         |
| Update Rachel -- valid data             | Happy path | Returns updated entity             |
| Update Rachel -- unauthorized role      | Auth       | Throws ForbiddenError (403)        |
| Delete Rachel -- admin role             | Happy path | Soft-deletes, returns 204          |
| Delete Rachel -- non-admin              | Auth       | Throws ForbiddenError (403)        |
| List Rachel -- paginated                | Pagination | Returns page=1 limit=10 with total |
| List Rachel -- invalid filter           | Validation | Throws ZodError                    |

#### Integration Tests

- **File:** `test/rachel.integration.test.ts`
- **Framework:** Vitest + MongoDB in-memory
- **Coverage target:** >= 80%

| Scenario                           | Setup                    | Expected                     |
| ---------------------------------- | ------------------------ | ---------------------------- |
| DB round-trip: create and retrieve | Seed test DB             | Persisted data matches input |
| RERA/DLD validation roundtrip      | Compliance rules active  | Rule violations rejected     |
| Audit trail written on mutation    | Mutation triggered       | audit_trail doc exists       |
| Concurrent update handled          | Two simultaneous updates | One wins, no data corruption |
| Pagination returns correct cursor  | 25 docs seeded           | Page 1 = 10, page 3 = 5      |
| Soft-delete excludes from list     | Delete then list         | Deleted doc not in results   |

#### E2E Tests

- **File:** `e2e/rachel.spec.ts`
- **Framework:** Playwright (Chromium)
- **Critical path:** SEO meta tags render correctly for property detail page

| Scenario       | Steps                                                   | Pass Criteria                     |
| -------------- | ------------------------------------------------------- | --------------------------------- |
| Critical path  | SEO meta tags render correctly for property detail page | No errors, correct data displayed |
| Mobile (375px) | Repeat critical path at 375px viewport                  | Layout intact, no overflow        |
| RTL (Arabic)   | Set lang=ar, repeat critical path                       | Correct right-to-left layout      |
| Error state    | Submit invalid form                                     | Inline error message visible      |
| Empty state    | Load with no data                                       | Empty state UI + CTA visible      |

#### Rollout Gate

| Gate                 | Requirement  | Status  |
| -------------------- | ------------ | ------- |
| Unit coverage        | >= 90%       | PENDING |
| Integration coverage | >= 80%       | PENDING |
| E2E critical path    | PASS         | PENDING |
| TypeScript errors    | 0            | PENDING |
| ESLint errors        | 0            | PENDING |
| Lighthouse perf      | >= 90        | PENDING |
| WCAG AA              | 0 violations | PENDING |
| @Katherine sign-off  | Reviewed     | PENDING |

### @Joelle -- AI persona and fallback matrix handoff

#### Unit Tests

- **File:** `src/services/joelle.service.test.ts`
- **Framework:** Vitest
- **Coverage target:** >= 90%

| Scenario                                | Test Type  | Expected                           |
| --------------------------------------- | ---------- | ---------------------------------- |
| Create Joelle -- valid data             | Happy path | Returns created entity with id     |
| Create Joelle -- missing required field | Validation | Throws ZodError                    |
| Get Joelle by id -- exists              | Happy path | Returns full entity                |
| Get Joelle by id -- not found           | Error      | Throws NotFoundError (404)         |
| Update Joelle -- valid data             | Happy path | Returns updated entity             |
| Update Joelle -- unauthorized role      | Auth       | Throws ForbiddenError (403)        |
| Delete Joelle -- admin role             | Happy path | Soft-deletes, returns 204          |
| Delete Joelle -- non-admin              | Auth       | Throws ForbiddenError (403)        |
| List Joelle -- paginated                | Pagination | Returns page=1 limit=10 with total |
| List Joelle -- invalid filter           | Validation | Throws ZodError                    |

#### Integration Tests

- **File:** `test/joelle.integration.test.ts`
- **Framework:** Vitest + MongoDB in-memory
- **Coverage target:** >= 80%

| Scenario                           | Setup                    | Expected                     |
| ---------------------------------- | ------------------------ | ---------------------------- |
| DB round-trip: create and retrieve | Seed test DB             | Persisted data matches input |
| RERA/DLD validation roundtrip      | Compliance rules active  | Rule violations rejected     |
| Audit trail written on mutation    | Mutation triggered       | audit_trail doc exists       |
| Concurrent update handled          | Two simultaneous updates | One wins, no data corruption |
| Pagination returns correct cursor  | 25 docs seeded           | Page 1 = 10, page 3 = 5      |
| Soft-delete excludes from list     | Delete then list         | Deleted doc not in results   |

#### E2E Tests

- **File:** `e2e/joelle.spec.ts`
- **Framework:** Playwright (Chromium)
- **Critical path:** AI assistant responds within 3s and falls back on timeout

| Scenario       | Steps                                                     | Pass Criteria                     |
| -------------- | --------------------------------------------------------- | --------------------------------- |
| Critical path  | AI assistant responds within 3s and falls back on timeout | No errors, correct data displayed |
| Mobile (375px) | Repeat critical path at 375px viewport                    | Layout intact, no overflow        |
| RTL (Arabic)   | Set lang=ar, repeat critical path                         | Correct right-to-left layout      |
| Error state    | Submit invalid form                                       | Inline error message visible      |
| Empty state    | Load with no data                                         | Empty state UI + CTA visible      |

#### Rollout Gate

| Gate                 | Requirement  | Status  |
| -------------------- | ------------ | ------- |
| Unit coverage        | >= 90%       | PENDING |
| Integration coverage | >= 80%       | PENDING |
| E2E critical path    | PASS         | PENDING |
| TypeScript errors    | 0            | PENDING |
| ESLint errors        | 0            | PENDING |
| Lighthouse perf      | >= 90        | PENDING |
| WCAG AA              | 0 violations | PENDING |
| @Katherine sign-off  | Reviewed     | PENDING |

## Lane B -- Valuation / Market / Finance

### @Fei-Fei -- Valuation and market inputs

#### Unit Tests

- **File:** `src/services/feifei.service.test.ts`
- **Framework:** Vitest
- **Coverage target:** >= 90%

| Scenario                                | Test Type  | Expected                           |
| --------------------------------------- | ---------- | ---------------------------------- |
| Create FeiFei -- valid data             | Happy path | Returns created entity with id     |
| Create FeiFei -- missing required field | Validation | Throws ZodError                    |
| Get FeiFei by id -- exists              | Happy path | Returns full entity                |
| Get FeiFei by id -- not found           | Error      | Throws NotFoundError (404)         |
| Update FeiFei -- valid data             | Happy path | Returns updated entity             |
| Update FeiFei -- unauthorized role      | Auth       | Throws ForbiddenError (403)        |
| Delete FeiFei -- admin role             | Happy path | Soft-deletes, returns 204          |
| Delete FeiFei -- non-admin              | Auth       | Throws ForbiddenError (403)        |
| List FeiFei -- paginated                | Pagination | Returns page=1 limit=10 with total |
| List FeiFei -- invalid filter           | Validation | Throws ZodError                    |

#### Integration Tests

- **File:** `test/feifei.integration.test.ts`
- **Framework:** Vitest + MongoDB in-memory
- **Coverage target:** >= 80%

| Scenario                           | Setup                    | Expected                     |
| ---------------------------------- | ------------------------ | ---------------------------- |
| DB round-trip: create and retrieve | Seed test DB             | Persisted data matches input |
| RERA/DLD validation roundtrip      | Compliance rules active  | Rule violations rejected     |
| Audit trail written on mutation    | Mutation triggered       | audit_trail doc exists       |
| Concurrent update handled          | Two simultaneous updates | One wins, no data corruption |
| Pagination returns correct cursor  | 25 docs seeded           | Page 1 = 10, page 3 = 5      |
| Soft-delete excludes from list     | Delete then list         | Deleted doc not in results   |

#### E2E Tests

- **File:** `e2e/feifei.spec.ts`
- **Framework:** Playwright (Chromium)
- **Critical path:** AVM valuation returns estimate with confidence score

| Scenario       | Steps                                                | Pass Criteria                     |
| -------------- | ---------------------------------------------------- | --------------------------------- |
| Critical path  | AVM valuation returns estimate with confidence score | No errors, correct data displayed |
| Mobile (375px) | Repeat critical path at 375px viewport               | Layout intact, no overflow        |
| RTL (Arabic)   | Set lang=ar, repeat critical path                    | Correct right-to-left layout      |
| Error state    | Submit invalid form                                  | Inline error message visible      |
| Empty state    | Load with no data                                    | Empty state UI + CTA visible      |

#### Rollout Gate

| Gate                 | Requirement  | Status  |
| -------------------- | ------------ | ------- |
| Unit coverage        | >= 90%       | PENDING |
| Integration coverage | >= 80%       | PENDING |
| E2E critical path    | PASS         | PENDING |
| TypeScript errors    | 0            | PENDING |
| ESLint errors        | 0            | PENDING |
| Lighthouse perf      | >= 90        | PENDING |
| WCAG AA              | 0 violations | PENDING |
| @Katherine sign-off  | Reviewed     | PENDING |

### @Anima -- Data pipeline and secondary-sales bridge

#### Unit Tests

- **File:** `src/services/anima.service.test.ts`
- **Framework:** Vitest
- **Coverage target:** >= 90%

| Scenario                               | Test Type  | Expected                           |
| -------------------------------------- | ---------- | ---------------------------------- |
| Create Anima -- valid data             | Happy path | Returns created entity with id     |
| Create Anima -- missing required field | Validation | Throws ZodError                    |
| Get Anima by id -- exists              | Happy path | Returns full entity                |
| Get Anima by id -- not found           | Error      | Throws NotFoundError (404)         |
| Update Anima -- valid data             | Happy path | Returns updated entity             |
| Update Anima -- unauthorized role      | Auth       | Throws ForbiddenError (403)        |
| Delete Anima -- admin role             | Happy path | Soft-deletes, returns 204          |
| Delete Anima -- non-admin              | Auth       | Throws ForbiddenError (403)        |
| List Anima -- paginated                | Pagination | Returns page=1 limit=10 with total |
| List Anima -- invalid filter           | Validation | Throws ZodError                    |

#### Integration Tests

- **File:** `test/anima.integration.test.ts`
- **Framework:** Vitest + MongoDB in-memory
- **Coverage target:** >= 80%

| Scenario                           | Setup                    | Expected                     |
| ---------------------------------- | ------------------------ | ---------------------------- |
| DB round-trip: create and retrieve | Seed test DB             | Persisted data matches input |
| RERA/DLD validation roundtrip      | Compliance rules active  | Rule violations rejected     |
| Audit trail written on mutation    | Mutation triggered       | audit_trail doc exists       |
| Concurrent update handled          | Two simultaneous updates | One wins, no data corruption |
| Pagination returns correct cursor  | 25 docs seeded           | Page 1 = 10, page 3 = 5      |
| Soft-delete excludes from list     | Delete then list         | Deleted doc not in results   |

#### E2E Tests

- **File:** `e2e/anima.spec.ts`
- **Framework:** Playwright (Chromium)
- **Critical path:** secondary sale creates DLD transaction record

| Scenario       | Steps                                         | Pass Criteria                     |
| -------------- | --------------------------------------------- | --------------------------------- |
| Critical path  | secondary sale creates DLD transaction record | No errors, correct data displayed |
| Mobile (375px) | Repeat critical path at 375px viewport        | Layout intact, no overflow        |
| RTL (Arabic)   | Set lang=ar, repeat critical path             | Correct right-to-left layout      |
| Error state    | Submit invalid form                           | Inline error message visible      |
| Empty state    | Load with no data                             | Empty state UI + CTA visible      |

#### Rollout Gate

| Gate                 | Requirement  | Status  |
| -------------------- | ------------ | ------- |
| Unit coverage        | >= 90%       | PENDING |
| Integration coverage | >= 80%       | PENDING |
| E2E critical path    | PASS         | PENDING |
| TypeScript errors    | 0            | PENDING |
| ESLint errors        | 0            | PENDING |
| Lighthouse perf      | >= 90        | PENDING |
| WCAG AA              | 0 violations | PENDING |
| @Katherine sign-off  | Reviewed     | PENDING |

### @Mary -- Inventory-investment synthesis

#### Unit Tests

- **File:** `src/services/mary.service.test.ts`
- **Framework:** Vitest
- **Coverage target:** >= 90%

| Scenario                              | Test Type  | Expected                           |
| ------------------------------------- | ---------- | ---------------------------------- |
| Create Mary -- valid data             | Happy path | Returns created entity with id     |
| Create Mary -- missing required field | Validation | Throws ZodError                    |
| Get Mary by id -- exists              | Happy path | Returns full entity                |
| Get Mary by id -- not found           | Error      | Throws NotFoundError (404)         |
| Update Mary -- valid data             | Happy path | Returns updated entity             |
| Update Mary -- unauthorized role      | Auth       | Throws ForbiddenError (403)        |
| Delete Mary -- admin role             | Happy path | Soft-deletes, returns 204          |
| Delete Mary -- non-admin              | Auth       | Throws ForbiddenError (403)        |
| List Mary -- paginated                | Pagination | Returns page=1 limit=10 with total |
| List Mary -- invalid filter           | Validation | Throws ZodError                    |

#### Integration Tests

- **File:** `test/mary.integration.test.ts`
- **Framework:** Vitest + MongoDB in-memory
- **Coverage target:** >= 80%

| Scenario                           | Setup                    | Expected                     |
| ---------------------------------- | ------------------------ | ---------------------------- |
| DB round-trip: create and retrieve | Seed test DB             | Persisted data matches input |
| RERA/DLD validation roundtrip      | Compliance rules active  | Rule violations rejected     |
| Audit trail written on mutation    | Mutation triggered       | audit_trail doc exists       |
| Concurrent update handled          | Two simultaneous updates | One wins, no data corruption |
| Pagination returns correct cursor  | 25 docs seeded           | Page 1 = 10, page 3 = 5      |
| Soft-delete excludes from list     | Delete then list         | Deleted doc not in results   |

#### E2E Tests

- **File:** `e2e/mary.spec.ts`
- **Framework:** Playwright (Chromium)
- **Critical path:** property CSV bulk import completes with error report

| Scenario       | Steps                                                | Pass Criteria                     |
| -------------- | ---------------------------------------------------- | --------------------------------- |
| Critical path  | property CSV bulk import completes with error report | No errors, correct data displayed |
| Mobile (375px) | Repeat critical path at 375px viewport               | Layout intact, no overflow        |
| RTL (Arabic)   | Set lang=ar, repeat critical path                    | Correct right-to-left layout      |
| Error state    | Submit invalid form                                  | Inline error message visible      |
| Empty state    | Load with no data                                    | Empty state UI + CTA visible      |

#### Rollout Gate

| Gate                 | Requirement  | Status  |
| -------------------- | ------------ | ------- |
| Unit coverage        | >= 90%       | PENDING |
| Integration coverage | >= 80%       | PENDING |
| E2E critical path    | PASS         | PENDING |
| TypeScript errors    | 0            | PENDING |
| ESLint errors        | 0            | PENDING |
| Lighthouse perf      | >= 90        | PENDING |
| WCAG AA              | 0 violations | PENDING |
| @Katherine sign-off  | Reviewed     | PENDING |

### @Invoice -- Financial modeling and KPI bridge

#### Unit Tests

- **File:** `src/services/invoice.service.test.ts`
- **Framework:** Vitest
- **Coverage target:** >= 90%

| Scenario                                 | Test Type  | Expected                           |
| ---------------------------------------- | ---------- | ---------------------------------- |
| Create Invoice -- valid data             | Happy path | Returns created entity with id     |
| Create Invoice -- missing required field | Validation | Throws ZodError                    |
| Get Invoice by id -- exists              | Happy path | Returns full entity                |
| Get Invoice by id -- not found           | Error      | Throws NotFoundError (404)         |
| Update Invoice -- valid data             | Happy path | Returns updated entity             |
| Update Invoice -- unauthorized role      | Auth       | Throws ForbiddenError (403)        |
| Delete Invoice -- admin role             | Happy path | Soft-deletes, returns 204          |
| Delete Invoice -- non-admin              | Auth       | Throws ForbiddenError (403)        |
| List Invoice -- paginated                | Pagination | Returns page=1 limit=10 with total |
| List Invoice -- invalid filter           | Validation | Throws ZodError                    |

#### Integration Tests

- **File:** `test/invoice.integration.test.ts`
- **Framework:** Vitest + MongoDB in-memory
- **Coverage target:** >= 80%

| Scenario                           | Setup                    | Expected                     |
| ---------------------------------- | ------------------------ | ---------------------------- |
| DB round-trip: create and retrieve | Seed test DB             | Persisted data matches input |
| RERA/DLD validation roundtrip      | Compliance rules active  | Rule violations rejected     |
| Audit trail written on mutation    | Mutation triggered       | audit_trail doc exists       |
| Concurrent update handled          | Two simultaneous updates | One wins, no data corruption |
| Pagination returns correct cursor  | 25 docs seeded           | Page 1 = 10, page 3 = 5      |
| Soft-delete excludes from list     | Delete then list         | Deleted doc not in results   |

#### E2E Tests

- **File:** `e2e/invoice.spec.ts`
- **Framework:** Playwright (Chromium)
- **Critical path:** VAT invoice is generated with correct TRN and 5% calculation

| Scenario       | Steps                                                        | Pass Criteria                     |
| -------------- | ------------------------------------------------------------ | --------------------------------- |
| Critical path  | VAT invoice is generated with correct TRN and 5% calculation | No errors, correct data displayed |
| Mobile (375px) | Repeat critical path at 375px viewport                       | Layout intact, no overflow        |
| RTL (Arabic)   | Set lang=ar, repeat critical path                            | Correct right-to-left layout      |
| Error state    | Submit invalid form                                          | Inline error message visible      |
| Empty state    | Load with no data                                            | Empty state UI + CTA visible      |

#### Rollout Gate

| Gate                 | Requirement  | Status  |
| -------------------- | ------------ | ------- |
| Unit coverage        | >= 90%       | PENDING |
| Integration coverage | >= 80%       | PENDING |
| E2E critical path    | PASS         | PENDING |
| TypeScript errors    | 0            | PENDING |
| ESLint errors        | 0            | PENDING |
| Lighthouse perf      | >= 90        | PENDING |
| WCAG AA              | 0 violations | PENDING |
| @Katherine sign-off  | Reviewed     | PENDING |

## Lane C -- Schedule / Off-plan / Analytics

### @Booking -- Viewing and scheduling contracts

#### Unit Tests

- **File:** `src/services/booking.service.test.ts`
- **Framework:** Vitest
- **Coverage target:** >= 90%

| Scenario                                 | Test Type  | Expected                           |
| ---------------------------------------- | ---------- | ---------------------------------- |
| Create Booking -- valid data             | Happy path | Returns created entity with id     |
| Create Booking -- missing required field | Validation | Throws ZodError                    |
| Get Booking by id -- exists              | Happy path | Returns full entity                |
| Get Booking by id -- not found           | Error      | Throws NotFoundError (404)         |
| Update Booking -- valid data             | Happy path | Returns updated entity             |
| Update Booking -- unauthorized role      | Auth       | Throws ForbiddenError (403)        |
| Delete Booking -- admin role             | Happy path | Soft-deletes, returns 204          |
| Delete Booking -- non-admin              | Auth       | Throws ForbiddenError (403)        |
| List Booking -- paginated                | Pagination | Returns page=1 limit=10 with total |
| List Booking -- invalid filter           | Validation | Throws ZodError                    |

#### Integration Tests

- **File:** `test/booking.integration.test.ts`
- **Framework:** Vitest + MongoDB in-memory
- **Coverage target:** >= 80%

| Scenario                           | Setup                    | Expected                     |
| ---------------------------------- | ------------------------ | ---------------------------- |
| DB round-trip: create and retrieve | Seed test DB             | Persisted data matches input |
| RERA/DLD validation roundtrip      | Compliance rules active  | Rule violations rejected     |
| Audit trail written on mutation    | Mutation triggered       | audit_trail doc exists       |
| Concurrent update handled          | Two simultaneous updates | One wins, no data corruption |
| Pagination returns correct cursor  | 25 docs seeded           | Page 1 = 10, page 3 = 5      |
| Soft-delete excludes from list     | Delete then list         | Deleted doc not in results   |

#### E2E Tests

- **File:** `e2e/booking.spec.ts`
- **Framework:** Playwright (Chromium)
- **Critical path:** viewing is scheduled, confirmed, and ICS file downloaded

| Scenario       | Steps                                                    | Pass Criteria                     |
| -------------- | -------------------------------------------------------- | --------------------------------- |
| Critical path  | viewing is scheduled, confirmed, and ICS file downloaded | No errors, correct data displayed |
| Mobile (375px) | Repeat critical path at 375px viewport                   | Layout intact, no overflow        |
| RTL (Arabic)   | Set lang=ar, repeat critical path                        | Correct right-to-left layout      |
| Error state    | Submit invalid form                                      | Inline error message visible      |
| Empty state    | Load with no data                                        | Empty state UI + CTA visible      |

#### Rollout Gate

| Gate                 | Requirement  | Status  |
| -------------------- | ------------ | ------- |
| Unit coverage        | >= 90%       | PENDING |
| Integration coverage | >= 80%       | PENDING |
| E2E critical path    | PASS         | PENDING |
| TypeScript errors    | 0            | PENDING |
| ESLint errors        | 0            | PENDING |
| Lighthouse perf      | >= 90        | PENDING |
| WCAG AA              | 0 violations | PENDING |
| @Katherine sign-off  | Reviewed     | PENDING |

### @Maya -- Off-plan handover flow

#### Unit Tests

- **File:** `src/services/maya.service.test.ts`
- **Framework:** Vitest
- **Coverage target:** >= 90%

| Scenario                              | Test Type  | Expected                           |
| ------------------------------------- | ---------- | ---------------------------------- |
| Create Maya -- valid data             | Happy path | Returns created entity with id     |
| Create Maya -- missing required field | Validation | Throws ZodError                    |
| Get Maya by id -- exists              | Happy path | Returns full entity                |
| Get Maya by id -- not found           | Error      | Throws NotFoundError (404)         |
| Update Maya -- valid data             | Happy path | Returns updated entity             |
| Update Maya -- unauthorized role      | Auth       | Throws ForbiddenError (403)        |
| Delete Maya -- admin role             | Happy path | Soft-deletes, returns 204          |
| Delete Maya -- non-admin              | Auth       | Throws ForbiddenError (403)        |
| List Maya -- paginated                | Pagination | Returns page=1 limit=10 with total |
| List Maya -- invalid filter           | Validation | Throws ZodError                    |

#### Integration Tests

- **File:** `test/maya.integration.test.ts`
- **Framework:** Vitest + MongoDB in-memory
- **Coverage target:** >= 80%

| Scenario                           | Setup                    | Expected                     |
| ---------------------------------- | ------------------------ | ---------------------------- |
| DB round-trip: create and retrieve | Seed test DB             | Persisted data matches input |
| RERA/DLD validation roundtrip      | Compliance rules active  | Rule violations rejected     |
| Audit trail written on mutation    | Mutation triggered       | audit_trail doc exists       |
| Concurrent update handled          | Two simultaneous updates | One wins, no data corruption |
| Pagination returns correct cursor  | 25 docs seeded           | Page 1 = 10, page 3 = 5      |
| Soft-delete excludes from list     | Delete then list         | Deleted doc not in results   |

#### E2E Tests

- **File:** `e2e/maya.spec.ts`
- **Framework:** Playwright (Chromium)
- **Critical path:** off-plan unit reservation creates Oqood DLD record

| Scenario       | Steps                                              | Pass Criteria                     |
| -------------- | -------------------------------------------------- | --------------------------------- |
| Critical path  | off-plan unit reservation creates Oqood DLD record | No errors, correct data displayed |
| Mobile (375px) | Repeat critical path at 375px viewport             | Layout intact, no overflow        |
| RTL (Arabic)   | Set lang=ar, repeat critical path                  | Correct right-to-left layout      |
| Error state    | Submit invalid form                                | Inline error message visible      |
| Empty state    | Load with no data                                  | Empty state UI + CTA visible      |

#### Rollout Gate

| Gate                 | Requirement  | Status  |
| -------------------- | ------------ | ------- |
| Unit coverage        | >= 90%       | PENDING |
| Integration coverage | >= 80%       | PENDING |
| E2E critical path    | PASS         | PENDING |
| TypeScript errors    | 0            | PENDING |
| ESLint errors        | 0            | PENDING |
| Lighthouse perf      | >= 90        | PENDING |
| WCAG AA              | 0 violations | PENDING |
| @Katherine sign-off  | Reviewed     | PENDING |

### @Hedy -- Audit and follow-up controls

#### Unit Tests

- **File:** `src/services/hedy.service.test.ts`
- **Framework:** Vitest
- **Coverage target:** >= 90%

| Scenario                              | Test Type  | Expected                           |
| ------------------------------------- | ---------- | ---------------------------------- |
| Create Hedy -- valid data             | Happy path | Returns created entity with id     |
| Create Hedy -- missing required field | Validation | Throws ZodError                    |
| Get Hedy by id -- exists              | Happy path | Returns full entity                |
| Get Hedy by id -- not found           | Error      | Throws NotFoundError (404)         |
| Update Hedy -- valid data             | Happy path | Returns updated entity             |
| Update Hedy -- unauthorized role      | Auth       | Throws ForbiddenError (403)        |
| Delete Hedy -- admin role             | Happy path | Soft-deletes, returns 204          |
| Delete Hedy -- non-admin              | Auth       | Throws ForbiddenError (403)        |
| List Hedy -- paginated                | Pagination | Returns page=1 limit=10 with total |
| List Hedy -- invalid filter           | Validation | Throws ZodError                    |

#### Integration Tests

- **File:** `test/hedy.integration.test.ts`
- **Framework:** Vitest + MongoDB in-memory
- **Coverage target:** >= 80%

| Scenario                           | Setup                    | Expected                     |
| ---------------------------------- | ------------------------ | ---------------------------- |
| DB round-trip: create and retrieve | Seed test DB             | Persisted data matches input |
| RERA/DLD validation roundtrip      | Compliance rules active  | Rule violations rejected     |
| Audit trail written on mutation    | Mutation triggered       | audit_trail doc exists       |
| Concurrent update handled          | Two simultaneous updates | One wins, no data corruption |
| Pagination returns correct cursor  | 25 docs seeded           | Page 1 = 10, page 3 = 5      |
| Soft-delete excludes from list     | Delete then list         | Deleted doc not in results   |

#### E2E Tests

- **File:** `e2e/hedy.spec.ts`
- **Framework:** Playwright (Chromium)
- **Critical path:** audit trail records every CREATE/UPDATE/DELETE with immutable log

| Scenario       | Steps                                                             | Pass Criteria                     |
| -------------- | ----------------------------------------------------------------- | --------------------------------- |
| Critical path  | audit trail records every CREATE/UPDATE/DELETE with immutable log | No errors, correct data displayed |
| Mobile (375px) | Repeat critical path at 375px viewport                            | Layout intact, no overflow        |
| RTL (Arabic)   | Set lang=ar, repeat critical path                                 | Correct right-to-left layout      |
| Error state    | Submit invalid form                                               | Inline error message visible      |
| Empty state    | Load with no data                                                 | Empty state UI + CTA visible      |

#### Rollout Gate

| Gate                 | Requirement  | Status  |
| -------------------- | ------------ | ------- |
| Unit coverage        | >= 90%       | PENDING |
| Integration coverage | >= 80%       | PENDING |
| E2E critical path    | PASS         | PENDING |
| TypeScript errors    | 0            | PENDING |
| ESLint errors        | 0            | PENDING |
| Lighthouse perf      | >= 90        | PENDING |
| WCAG AA              | 0 violations | PENDING |
| @Katherine sign-off  | Reviewed     | PENDING |

### @Cassie -- Analytics synthesis and KPI evidence

#### Unit Tests

- **File:** `src/services/cassie.service.test.ts`
- **Framework:** Vitest
- **Coverage target:** >= 90%

| Scenario                                | Test Type  | Expected                           |
| --------------------------------------- | ---------- | ---------------------------------- |
| Create Cassie -- valid data             | Happy path | Returns created entity with id     |
| Create Cassie -- missing required field | Validation | Throws ZodError                    |
| Get Cassie by id -- exists              | Happy path | Returns full entity                |
| Get Cassie by id -- not found           | Error      | Throws NotFoundError (404)         |
| Update Cassie -- valid data             | Happy path | Returns updated entity             |
| Update Cassie -- unauthorized role      | Auth       | Throws ForbiddenError (403)        |
| Delete Cassie -- admin role             | Happy path | Soft-deletes, returns 204          |
| Delete Cassie -- non-admin              | Auth       | Throws ForbiddenError (403)        |
| List Cassie -- paginated                | Pagination | Returns page=1 limit=10 with total |
| List Cassie -- invalid filter           | Validation | Throws ZodError                    |

#### Integration Tests

- **File:** `test/cassie.integration.test.ts`
- **Framework:** Vitest + MongoDB in-memory
- **Coverage target:** >= 80%

| Scenario                           | Setup                    | Expected                     |
| ---------------------------------- | ------------------------ | ---------------------------- |
| DB round-trip: create and retrieve | Seed test DB             | Persisted data matches input |
| RERA/DLD validation roundtrip      | Compliance rules active  | Rule violations rejected     |
| Audit trail written on mutation    | Mutation triggered       | audit_trail doc exists       |
| Concurrent update handled          | Two simultaneous updates | One wins, no data corruption |
| Pagination returns correct cursor  | 25 docs seeded           | Page 1 = 10, page 3 = 5      |
| Soft-delete excludes from list     | Delete then list         | Deleted doc not in results   |

#### E2E Tests

- **File:** `e2e/cassie.spec.ts`
- **Framework:** Playwright (Chromium)
- **Critical path:** analytics dashboard loads with correct KPI tiles in < 2s

| Scenario       | Steps                                                    | Pass Criteria                     |
| -------------- | -------------------------------------------------------- | --------------------------------- |
| Critical path  | analytics dashboard loads with correct KPI tiles in < 2s | No errors, correct data displayed |
| Mobile (375px) | Repeat critical path at 375px viewport                   | Layout intact, no overflow        |
| RTL (Arabic)   | Set lang=ar, repeat critical path                        | Correct right-to-left layout      |
| Error state    | Submit invalid form                                      | Inline error message visible      |
| Empty state    | Load with no data                                        | Empty state UI + CTA visible      |

#### Rollout Gate

| Gate                 | Requirement  | Status  |
| -------------------- | ------------ | ------- |
| Unit coverage        | >= 90%       | PENDING |
| Integration coverage | >= 80%       | PENDING |
| E2E critical path    | PASS         | PENDING |
| TypeScript errors    | 0            | PENDING |
| ESLint errors        | 0            | PENDING |
| Lighthouse perf      | >= 90        | PENDING |
| WCAG AA              | 0 violations | PENDING |
| @Katherine sign-off  | Reviewed     | PENDING |

## Lane D -- Offers / WhatsApp / AI-Chat

### @Jaime -- Offers and WhatsApp routing

#### Unit Tests

- **File:** `src/services/jaime.service.test.ts`
- **Framework:** Vitest
- **Coverage target:** >= 90%

| Scenario                               | Test Type  | Expected                           |
| -------------------------------------- | ---------- | ---------------------------------- |
| Create Jaime -- valid data             | Happy path | Returns created entity with id     |
| Create Jaime -- missing required field | Validation | Throws ZodError                    |
| Get Jaime by id -- exists              | Happy path | Returns full entity                |
| Get Jaime by id -- not found           | Error      | Throws NotFoundError (404)         |
| Update Jaime -- valid data             | Happy path | Returns updated entity             |
| Update Jaime -- unauthorized role      | Auth       | Throws ForbiddenError (403)        |
| Delete Jaime -- admin role             | Happy path | Soft-deletes, returns 204          |
| Delete Jaime -- non-admin              | Auth       | Throws ForbiddenError (403)        |
| List Jaime -- paginated                | Pagination | Returns page=1 limit=10 with total |
| List Jaime -- invalid filter           | Validation | Throws ZodError                    |

#### Integration Tests

- **File:** `test/jaime.integration.test.ts`
- **Framework:** Vitest + MongoDB in-memory
- **Coverage target:** >= 80%

| Scenario                           | Setup                    | Expected                     |
| ---------------------------------- | ------------------------ | ---------------------------- |
| DB round-trip: create and retrieve | Seed test DB             | Persisted data matches input |
| RERA/DLD validation roundtrip      | Compliance rules active  | Rule violations rejected     |
| Audit trail written on mutation    | Mutation triggered       | audit_trail doc exists       |
| Concurrent update handled          | Two simultaneous updates | One wins, no data corruption |
| Pagination returns correct cursor  | 25 docs seeded           | Page 1 = 10, page 3 = 5      |
| Soft-delete excludes from list     | Delete then list         | Deleted doc not in results   |

#### E2E Tests

- **File:** `e2e/jaime.spec.ts`
- **Framework:** Playwright (Chromium)
- **Critical path:** offer is submitted, countered, and accepted with MOU PDF generated

| Scenario       | Steps                                                              | Pass Criteria                     |
| -------------- | ------------------------------------------------------------------ | --------------------------------- |
| Critical path  | offer is submitted, countered, and accepted with MOU PDF generated | No errors, correct data displayed |
| Mobile (375px) | Repeat critical path at 375px viewport                             | Layout intact, no overflow        |
| RTL (Arabic)   | Set lang=ar, repeat critical path                                  | Correct right-to-left layout      |
| Error state    | Submit invalid form                                                | Inline error message visible      |
| Empty state    | Load with no data                                                  | Empty state UI + CTA visible      |

#### Rollout Gate

| Gate                 | Requirement  | Status  |
| -------------------- | ------------ | ------- |
| Unit coverage        | >= 90%       | PENDING |
| Integration coverage | >= 80%       | PENDING |
| E2E critical path    | PASS         | PENDING |
| TypeScript errors    | 0            | PENDING |
| ESLint errors        | 0            | PENDING |
| Lighthouse perf      | >= 90        | PENDING |
| WCAG AA              | 0 violations | PENDING |
| @Katherine sign-off  | Reviewed     | PENDING |

### @Corinne -- AI chat and maintenance mapping

#### Unit Tests

- **File:** `src/services/corinne.service.test.ts`
- **Framework:** Vitest
- **Coverage target:** >= 90%

| Scenario                                 | Test Type  | Expected                           |
| ---------------------------------------- | ---------- | ---------------------------------- |
| Create Corinne -- valid data             | Happy path | Returns created entity with id     |
| Create Corinne -- missing required field | Validation | Throws ZodError                    |
| Get Corinne by id -- exists              | Happy path | Returns full entity                |
| Get Corinne by id -- not found           | Error      | Throws NotFoundError (404)         |
| Update Corinne -- valid data             | Happy path | Returns updated entity             |
| Update Corinne -- unauthorized role      | Auth       | Throws ForbiddenError (403)        |
| Delete Corinne -- admin role             | Happy path | Soft-deletes, returns 204          |
| Delete Corinne -- non-admin              | Auth       | Throws ForbiddenError (403)        |
| List Corinne -- paginated                | Pagination | Returns page=1 limit=10 with total |
| List Corinne -- invalid filter           | Validation | Throws ZodError                    |

#### Integration Tests

- **File:** `test/corinne.integration.test.ts`
- **Framework:** Vitest + MongoDB in-memory
- **Coverage target:** >= 80%

| Scenario                           | Setup                    | Expected                     |
| ---------------------------------- | ------------------------ | ---------------------------- |
| DB round-trip: create and retrieve | Seed test DB             | Persisted data matches input |
| RERA/DLD validation roundtrip      | Compliance rules active  | Rule violations rejected     |
| Audit trail written on mutation    | Mutation triggered       | audit_trail doc exists       |
| Concurrent update handled          | Two simultaneous updates | One wins, no data corruption |
| Pagination returns correct cursor  | 25 docs seeded           | Page 1 = 10, page 3 = 5      |
| Soft-delete excludes from list     | Delete then list         | Deleted doc not in results   |

#### E2E Tests

- **File:** `e2e/corinne.spec.ts`
- **Framework:** Playwright (Chromium)
- **Critical path:** AI chat responds via streaming SSE and persists conversation

| Scenario       | Steps                                                        | Pass Criteria                     |
| -------------- | ------------------------------------------------------------ | --------------------------------- |
| Critical path  | AI chat responds via streaming SSE and persists conversation | No errors, correct data displayed |
| Mobile (375px) | Repeat critical path at 375px viewport                       | Layout intact, no overflow        |
| RTL (Arabic)   | Set lang=ar, repeat critical path                            | Correct right-to-left layout      |
| Error state    | Submit invalid form                                          | Inline error message visible      |
| Empty state    | Load with no data                                            | Empty state UI + CTA visible      |

#### Rollout Gate

| Gate                 | Requirement  | Status  |
| -------------------- | ------------ | ------- |
| Unit coverage        | >= 90%       | PENDING |
| Integration coverage | >= 80%       | PENDING |
| E2E critical path    | PASS         | PENDING |
| TypeScript errors    | 0            | PENDING |
| ESLint errors        | 0            | PENDING |
| Lighthouse perf      | >= 90        | PENDING |
| WCAG AA              | 0 violations | PENDING |
| @Katherine sign-off  | Reviewed     | PENDING |

---

## Staged Rollout Plan

> Each stage gates the next. No stage can begin until ALL checks in the previous stage pass.

| Stage                | Modules        | Audience                       | Success Metric          | Rollback Trigger        |
| -------------------- | -------------- | ------------------------------ | ----------------------- | ----------------------- |
| Alpha (internal)     | All 17 modules | Dev team only                  | 0 critical bugs in 48h  | Any critical bug        |
| Beta (staff)         | All 17 modules | White Caves staff (< 10 users) | 0 data integrity issues | Data loss or corruption |
| Soft launch          | All 17 modules | 5% of real users               | Error rate < 0.5%       | Error rate > 1%         |
| General availability | All 17 modules | All users                      | p95 response < 500ms    | p95 > 1500ms for 5min   |

---

## Test Commands Quick Reference

    npm run test:unit                    # run all Vitest unit tests
    npm run test:integration             # run integration tests
    npm run test:coverage                # run coverage report
    npm run test:e2e                     # run all Playwright E2E tests
    npx vitest run src/services/NAME.service.test.ts   # single unit file
    npx playwright test e2e/NAME.spec.ts               # single E2E file
    npx playwright test --project=chromium --grep 'critical path'  # filter tests

---

_Auto-generated by test-rollout-generator.ps1 on 2026-05-06_
