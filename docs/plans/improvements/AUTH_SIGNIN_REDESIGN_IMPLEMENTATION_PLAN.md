# Sign-in and Authentication Redesign — Implementation Plan

**Task ID:** `AUTH-SIGNIN-REDESIGN-01`
**Date:** 2026-10-13
**Status:** In Progress — security boundary first
**Requirements:** `REQ-IAMV2-001`, `REQ-IAMV2-002`, `REQ-IAMV2-003`, `REQ-IAMV2-004`, `REQ-IAMV2-005`, `REQ-IAMV2-006`
**Branch:** `feature/auth-signin-redesign`

## Objective

Secure the authentication boundary, consolidate duplicate frontend auth orchestration, make the advertised auth journeys route correctly, and redesign the sign-in/signup surfaces to a professional, accessible White Caves experience. Preserve the existing API envelopes, session issuance, RBAC authority, profile/approval gates, and deterministic destination policy.

## Evidence and risks

- `/signin` and `/signup` currently mount the same `SignInPage`; route path does not consistently determine the initial mode.
- Auth behavior is split across `SignInPage`, `useSignIn`, `AuthModal`, and a legacy `AuthPage` implementation.
- The route-mounted phone form is not wired to the OTP flow. The app redirects `/forgot-password` and `/reset-password` to `/`, despite reset lifecycle methods existing in the hook/service. Production `/forgot-password` currently returns 404.
- The live sign-in page links `/privacy`, while the available public policy route is `/privacy-policy`.
- `AuthPages.css` uses gold/dark global tokens, conflicting with the required red `#EF4444`, white `#FFFFFF`, slate `#1E293B` brand palette.
- `server/middleware/auth.ts` currently injects a founder identity for missing/invalid credentials, while its middleware tests assert rejection. Production, development, global, and route-local mounting must be reconciled before behavior changes.
- The active `/api/auth/verify-2fa` accepts email + TOTP without requiring the `twoFactorToken` issued by `/api/auth/login`; a separate legacy `server/routes/2fa.ts` is not mounted in `server/index.ts` and must not become a second active auth surface.
- Phone OTP must sync an already-provisioned active account by exact Firebase-verified phone match; unknown phone identities must not be auto-created or assigned staff roles.
- WebAuthn is currently unsafe: registration options/verification accept caller-selected identities, and authentication verification mints JWTs without verifying assertions. The existing locked `@simplewebauthn/server` dependency is available for real ceremony verification.
- Wave 19 is historically marked complete; this is a follow-up task. Do not rewrite completion history. Any contract behavior change requires a versioned delta referencing this Task ID.

## Scope

### Included

- Fail-closed JWT middleware and aligned route/mount policy; explicit safe development behavior if any bypass remains.
- One shared frontend auth state/behavior path across full page and modal entrypoints.
- Correct direct-load and refresh behavior for `/signin`, `/signup`, `/forgot-password`, and `/reset-password`.
- Existing configured email/password, social, phone OTP, 2FA, password reset, WebAuthn, signup role selection, lockout, pending-approval, profile completion, and safe return-path journeys.
- Responsive visual redesign, keyboard and screen-reader usability, contrast, reduced motion, and Arabic RTL.
- Focused tests and canonical plan/task updates.

### Excluded

- New identity providers, dependencies, credential/database migrations, production credential testing, speculative features, broad token-storage changes without a separate approved security task, unrelated pages, deployment/merge/push.

## Execution phases

### Phase 0 — Baseline and security policy (blocking)

- Classify auth endpoints and every `authMiddleware` mount in `server/index.ts`, `server/routes/auth.ts`, and `server/routes/2fa.ts` as public, authenticated, or role-gated.
- Capture focused test/type/lint baseline. Preserve unrelated existing work; record unrelated blockers separately.
- Establish rule: missing, malformed, expired, or tampered credentials never set privileged `req.user` in production. If a development shortcut is retained, it must be explicitly enabled, local-only, impossible in production, and independently tested.

### Phase 1 — Backend boundary

- Make `server/middleware/auth.ts` fail closed through existing structured error handling; preserve founder canonicalization only after a valid server-verified identity.
- Align global and route-level auth mounting with endpoint classification. Ensure login/register/reset remain intentionally public and protected APIs remain protected.
- Update middleware and route tests for absent/invalid/expired/tampered credentials, valid authorization, and development-mode gating.
- Require the signed, short-lived 2FA challenge issued after password verification at `/api/auth/verify-2fa`; derive account identity from the verified challenge, not a client-supplied email. Update hook/service contracts and test invalid, expired, and mismatched challenges.
- Secure WebAuthn enrollment with session-bound user identity and `verifyRegistrationResponse`; verify authentication challenges/assertions with expected RP ID/origin, stored public keys, user verification, and signature counters; protect credential deletion with auth and ownership checks.

### Phase 2 — Single frontend auth implementation

- Use `src/hooks/useSignIn.ts` and `src/services/authService.ts` as the single flow/API path. Refactor `SignInPage.tsx` as typed presentation and remove duplicate request logic, unsafe casts, raw diagnostic exposure, and redundant state where safe.
- Reuse the same form/actions in `AuthModal.tsx`; inspect callsites before adapting or retiring `AuthPage.tsx`, `EmailLoginForm`, or `MobileLoginForm`.
- Carry the 2FA challenge token from the login response through the hook into `authService.verifyTwoFactor`; do not persist it as a long-lived session or accept caller-selected account identity.
- Preserve `src/utils/authSession.ts` as the canonical session finalizer and return-path/destination policy. Server identity, role, status, and profile gates remain authoritative.

### Phase 3 — Route and journey completion

- Ensure `/signin` and `/signup` choose correct modes on direct load, refresh, and internal navigation.
- Wire existing reset methods to request → verify → new password → success/locked states. Implement safe, documented routes/query handling and correct `/terms` + `/privacy-policy` links.
- Wire phone OTP/reCAPTCHA/resend/verify to existing handlers; where provider configuration is absent, render a clear unavailable state, not an inert form. Render social providers only when configured and preserve redirect recovery/retry.
- Phone Firebase sync must match exactly one active pre-provisioned account using the verified phone claim; never trust the request phone alone and never auto-provision an unmatched phone.
- Preserve 2FA/WebAuthn, signup category/role onboarding, pending approval, profile completion, safe `returnTo`, and deterministic role-specific landing behavior. Normalize actionable errors without leaking account existence or internal details.

### Phase 4 — Visual and accessibility redesign

- Replace global auth tokens with scoped components/styles using red/white/slate, existing approved brand assets, restrained motion, strong hierarchy, and mobile-first form composition.
- Add visible labels, correct autocomplete/input modes, accessible errors/status, keyboard operation, visible focus, contrast, reduced-motion handling, and RTL layout. Every async state has loading/error/success/lockout feedback.

### Phase 5 — Verification and handoff

- Add component/integration coverage for route modes, all supported auth methods, provider unavailable states, reset lifecycle/lockout, social recovery, safe return path, role/profile/approval routing, and unauthenticated API rejection.
- Browser-check 375px mobile, 768px tablet, and 1440px desktop; test keyboard-only and Arabic RTL. Use mocks/test fixtures only; do not use production credentials or mutate live accounts.
- Run focused auth tests, changed-file diagnostics, `npm run typecheck`, lint, build, security review, and `npm run plans:validate`. Record unrelated baseline blockers. No release actions without separate authorization.

## Acceptance criteria

1. Missing, malformed, expired, and tampered JWTs never populate a privileged identity; protected production endpoints reject them with 401. Tests cover each case and valid authorized requests.
2. No production path enables implicit developer/founder bypass. Any retained development path is explicit, local-only, and tested as disabled outside local development.
3. WebAuthn never issues a session before a cryptographically verified assertion, and only an authenticated user can register/remove that user's credential.
4. Sign-in, signup, reset request/verify/complete, and legal links work on direct navigation and refresh. Displayed methods are functional or truthfully unavailable.
5. Full-page and modal entrypoints share one auth behavior path and preserve server-authoritative session/RBAC/profile/approval rules.
6. UI follows approved palette and passes responsive, keyboard, screen-reader, and RTL checks with loading/error/success/lockout states.
7. Focused tests and required quality checks pass, or unrelated baseline blockers are evidenced. No unrelated refactor is included.

## Validation commands

### Post-login consistency follow-up (2026-10-14)

- Goal: one server-authoritative destination policy for email, social redirect/retry, phone, 2FA, passkey, bootstrap, and route guards.
- Account approval/status, known role, and profile-completion gates run before return URLs. Founder profile-first landing remains an authenticated landing rule, not a repeated redirect when opening CRM.
- Reject external, encoded/backslash, auth-loop, API, and wrong-role return destinations; preserve allowed deep-link query/hash.
- Remove localStorage role/status fallbacks, duplicate hook session dispatches, and artificial post-login timers. Preserve server status/role in registration completion.
- After saving profile, use a fresh server profile to synchronize both user/auth state and completion metadata.
- Validate focused policy/session/hook/profile/passkey tests and App route-guard regression tests with mocked network/providers. No new dependency or production account mutation.

### Testing-speed priority (2026-10-14)

- Pause further auth changes while reducing App test feedback time.
- Keep all App routing/bootstrap assertions; stub unrelated workspace/modal providers, portal chrome, PWA prompts, and animations at the test boundary.
- Add an App-only Vitest configuration and one-shot/watch commands with one worker, existing jsdom, and no new dependencies. Leave the full-suite configuration unchanged.
- Measure cold-run and warm-watch timings separately; previous cold starts ranged from 8.52s to 97.44s while assertions took about 1.4s. Do not describe variable cold-start timing as a guaranteed speed improvement.
- Verify all App tests pass without real socket requests and lint the changed test/config files.

#### Verified feedback loop (2026-10-14)

- `npm run test:app:watch`: 36/36 pass, initial run 9.41s; assertions 626ms.
- Warm rerun in the same watcher: 36/36 pass in 1.17s.
- Use the existing watcher during App edits instead of repeatedly spawning cold test processes. `npm run test:app` remains the isolated one-shot option for CI/final verification.
- These are observed timings, not guaranteed budgets. Full-suite configuration, coverage requirements, and all 36 App assertions remain intact. Auth implementation remains a separate, unfinished task.

- `npm run test:run -- server/middleware/auth.test.ts server/routes/auth.test.ts server/routes/2fa.test.ts`
- `npm run test:run -- src/hooks/useSignIn.test.ts src/pages/auth/SignInPage.test.tsx src/App.test.tsx`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run plans:validate`
- Authenticated Playwright viewport checks using mocked providers and test identities.

### Firebase signup and session-boundary hardening (2026-10-14)

- Firebase sync now has an explicit `signin`/`signup` intent. Unknown identities cannot be created during sign-in; explicit social signup creates only a `social_signup_pending`/`pending` record, and phone OTP remains limited to one exact-match, pre-provisioned active account.
- Social signup JWTs stay in hook memory until role selection completes. Completion sends that short-lived session explicitly and persists only the final server-issued token; Firebase sync also skips cookie-refresh retries so a stale browser session cannot override the current provider result.
- Phone signup is rejected before OTP delivery; phone verification is sign-in-only, avoiding unusable signup attempts and unnecessary SMS sends.
- The social role-completion endpoint accepts only an incomplete pending social account (or the already-provisioned managing director path) and rejects completed accounts. The configured creator email is reserved from public password/social signup.
- Pending social-signup JWTs are accepted only by the role-completion endpoint; normal authenticated APIs reject them until onboarding issues the final role/session.
- Removed Firebase sync's database-outage synthetic-agent fallback. The explicit loopback development token-verification exception is restricted to a pre-provisioned active managing-director account; database failures now fail closed.
- The TypeScript 5.9.3-compatible `ignoreDeprecations` setting is `5.0`. Client and server typechecks both pass; the discovered Prisma query, route-param, WhatsApp API, and Henry scope errors were corrected.
- Focused auth/OTP/compliance regression pack passed `320/320` tests across 10 files. The wider auth/security/post-login pack passed `255/255` before the latest typecheck fixes; App-only suite passed `38/38`. Changed-file ESLint and `git diff --check` passed.
- Final production build passed (`npm run build:vercel`, 45.80s). `docs/plans/COMPILER_ERRORS.txt` remains untouched.
- Not release-ready yet: browser/visual verification and independent QA handoff are still pending; governance validation previously reported stale-date issues in shared documentation.

## Handoff

- **Task ID:** `AUTH-SIGNIN-REDESIGN-01`
- **Owner:** Auth/Frontend + Security/Backend; independent QA verifier
- **Files:** auth middleware/routes, auth hook/service/session utilities, active auth pages/components/styles/tests, canonical plan/tracker
- **Dependencies:** endpoint classification and fail-closed middleware precede visual work
- **Status:** In Progress
- **Handoff tags:** `CONSUMES←Wave 19: docs/plans/waves/WAVE_19_IDENTITY_ACCESS_V2_CONTRACT.md#Required Journey Coverage`; `FEEDS→@Katherine: docs/plans/improvements/AUTH_SIGNIN_REDESIGN_IMPLEMENTATION_PLAN.md#Acceptance criteria`; `FEEDS_ACK←@Katherine: pending independent verification`
