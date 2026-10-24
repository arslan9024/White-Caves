# Software Quality & Testing (SQA) Policy

**Department:** 8 — Software Quality & Testing  
**Goal:** High confidence, **not** maximum test count  
**Effective:** 2026-10-24

---

## Is testing “covered enough” today?

**Partially.** The repo already has:

- Vitest unit/integration scripts  
- Playwright e2e (smoke, accessibility, performance)  
- Typecheck gate  
- Lighthouse CI hooks  

**Gaps / risk of “too much”:**

- Many tests may mirror implementation details rather than behaviour  
- Over-generated suites inflate CI time without protecting revenue paths  
- Docs claim “100% pass” while issue/PR state is still unstable — trust the pipeline, not the prose  

**Direction:** Improve **quality and targeting** of tests; avoid exploding volume.

---

## Lean testing pyramid (required)

| Layer | Tool | What we keep | What we avoid |
|-------|------|--------------|---------------|
| Static | `tsc --noEmit`, ESLint | Always on CI | Disabling for convenience |
| Unit | Vitest | Pure logic, reducers, pricing/VAT, validators, 4-way `.logic.ts` | Snapshot spam, testing styled-components internals |
| Integration | Vitest + RTL | Forms, auth flows, list filters | Full app mount for every widget |
| E2E | Playwright | Smoke (home, login, key CRM path), a11y audit on critical pages | Recording every pixel of every page |
| Perf | Lighthouse CI | Home + one authenticated shell | Running on every micro-commit locally |

---

## Mandatory coverage targets (practical)

1. **Typecheck:** 0 errors on `main`.  
2. **Critical paths must have tests:**  
   - Auth / session  
   - Property list + detail  
   - Lead create / assign  
   - Commission or VAT calculation helpers  
   - Hero + language/theme switch (public)  
3. **New 4-way components:** at least one test that exercises `.logic.ts` behaviour when the logic is non-trivial.  
4. **No requirement** for 100% line coverage globally — prefer branch coverage on money/compliance code.

---

## Commands (canonical)

```bash
npm run typecheck
npm run test:run
npm run test:e2e:smoke
npm run lint
npm run build
```

CI should fail the PR if typecheck, lint (errors), or unit tests fail. E2E smoke may be a required check on `main` or nightly if runtime cost is high.

---

## SQA department ownership

- Maintain this policy  
- Own flaky-test quarantine (fix or delete within 7 days)  
- Report weekly: pass rate, duration, top failures — not vanity “100%” claims without evidence  
