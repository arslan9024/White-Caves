# WAVE_07_TEST_ROLLOUT.md

## Scope

Wave 07 tests focus on social auth reliability gate and regression protection.

## Test Matrix

### Unit/Integration (Vitest)

- **File:** `src/hooks/useSignIn.test.ts`
- **Critical Cases:**
  1. Google signin success -> role-based navigation
  2. Google signup success -> step progression
  3. Firebase popup error -> no navigation
  4. Backend sync error signin -> explicit error, no navigation, no user state set
  5. Backend sync error signup -> no step progression, no pending user

### Diagnostics

- `get_errors` on:
  - `src/hooks/useSignIn.ts`
  - `src/hooks/useSignIn.test.ts`

## Executed Results (Wave 07)

- `npx vitest run src/hooks/useSignIn.test.ts` ✅ 17/17 tests passing
- Diagnostics for changed files ✅ no errors

## Exit Gate

Wave passes when:

1. All focused tests pass.
2. No diagnostics in changed files.
3. No behavior allows Firebase-only protected session entry.

## Follow-up Tests for Wave 08+

1. Add E2E test for Google login popup success/failure and refresh persistence.
2. Add integration test for App bootstrap + protected route gate using canonical selectors.
3. Add profile save failure/success route-level tests once API unification starts.
