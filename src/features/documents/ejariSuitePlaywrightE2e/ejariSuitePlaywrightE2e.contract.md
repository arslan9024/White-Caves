# Ejari Suite Playwright E2E — Contract

- Parent issue: #1921
- Child issue: #2504
- Scope: `src/features/documents/ejariSuitePlaywrightE2e/` only.

## Purpose

Defines the contract for the Ejari document suite end-to-end (E2E) test
coverage implemented with Playwright. This document describes the scope,
inputs/outputs, invariants, and pass/fail gates that any implementation or
test file under this feature directory must satisfy. It does not itself
close, reconcile, or supersede the parent issue (#1921), which remains open
until all sibling child issues are reconciled.

## Scope boundaries

In scope:

- Test/spec plumbing, fixtures, and helper utilities for exercising the
  Ejari document generation/upload/verification suite through the UI.
- Documentation describing how the suite is structured and run.

Out of scope (excluded per issue #2504):

- Parent issue closure.
- Bulk GitHub mutation (issue/PR state changes, label operations, etc.).
- Destructive database operations (drops, truncations, irreversible seeds).
- Production secret rewrites (`.env`, secret managers, CI secrets).

## Functional contract

1. **Document lifecycle coverage**
   - The suite MUST cover, at minimum, the create → upload → verify →
     download lifecycle of an Ejari document record as exposed to the user
     through the application UI.
   - Each lifecycle step MUST be assertable independently (i.e., a failure
     in "upload" must not silently pass "verify").

2. **Test isolation**
   - Each Playwright test MUST be able to run independently of test
     ordering. No test may depend on mutable state left behind by a
     previous test in the same file unless explicitly using a shared,
     documented fixture.

3. **Deterministic selectors**
   - UI interactions MUST target stable selectors (e.g., `data-testid`
     attributes) rather than text content or CSS classes that are subject
     to styling churn.

4. **Network/data boundaries**
   - E2E tests MUST NOT perform destructive database operations. Any
     seeding or teardown must use additive, reversible fixtures scoped to
     the test run (e.g., a uniquely-named test document), never global
     truncation or drops.
   - E2E tests MUST NOT read, write, or rewrite production secrets. Any
     credentials used MUST come from local/test environment configuration
     already provisioned outside this feature's scope.

5. **Reporting**
   - Test run output MUST be sufficient to serve as completion evidence:
     pass/fail status per test, plus enough context (test name, file,
     timestamp) to correlate with the acceptance criteria for issue #2504.

## Non-functional contract

- **TypeScript strictness**: All TypeScript source in this directory MUST
  compile under strict mode with no `any` types. Prefer explicit interfaces
  for fixture data and page-object method signatures.
- **Unit-level assertions**: Where non-E2E logic (e.g., pure helper
  functions used to build fixture payloads) is extracted for unit testing,
  those tests MUST use `vitest` (`import { describe, expect, it } from
'vitest'`) and MUST assert real, observable behavior — never placeholder
  assertions such as `expect(true).toBe(true)`.
- **No new dependencies**: This contract assumes Playwright and vitest are
  already available in the workspace toolchain. Implementations MUST NOT
  add new npm dependencies as part of satisfying this contract.

## Acceptance gates (traceable to issue #2504)

| Gate | Description                                                                   | Evidence required                                                    |
| ---- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| G1   | Implementation stays within `src/features/documents/ejariSuitePlaywrightE2e/` | Diff/file listing scoped to this directory                           |
| G2   | Focused tests and required validation commands pass                           | Test run output/log referenced in completion evidence                |
| G3   | Completion evidence and rollback note recorded                                | Present in `README.md` "Completion evidence" and "Rollback" sections |
| G4   | Parent issue #1921 remains open                                               | No mutation performed against issue state by this work               |

## Rollback

If this contract or its associated implementation needs to be reverted,
delete the `src/features/documents/ejariSuitePlaywrightE2e/` directory.
This feature introduces no schema changes, no new dependencies, and no
secret rewrites, so rollback is a pure file removal with no residual
side effects.
