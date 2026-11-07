# Wave 19 — Identity & Access v2 Contract

**Wave:** 19  
**Requirement Anchor:** `REQ-IAMV2-001`  
**Status:** ✅ Published (execution contract)  
**Date:** 2026-06-18  
**Owners:** @Ada + @Mira

---

## Objective

Define one canonical Identity & Access v2 contract across all Wave 19 auth entrypoints so login, signup, forgot-password, biometric/WebAuthn, and profile-completion gating behave consistently and route deterministically.

This contract is the implementation source-of-truth for `W19-001` and a prerequisite for `W19-002`, `W19-003`, and `W19-005`.

---

## In-Scope Entry Points (Canonical Surfaces)

### Frontend

1. `src/hooks/useSignIn.ts`
   - Email sign-in/signup flow controller
   - Social auth orchestration + recovery
   - Phone OTP verification path
   - Forgot-password trigger (`handleForgotPassword`)
   - Post-login route resolution hook (`resolvePostLoginRoute`)
2. `src/services/authService.ts`
   - Backend auth API integration contract:
     - `loginWithEmail`
     - `registerWithEmail`
     - `verifyTwoFactor`
     - `syncFirebaseUser`
     - `completeSocialRegistration`
     - `logout`
3. `src/utils/authSession.ts`
   - Session finalization and deterministic post-login destination resolution.

### Backend

1. `server/routes/auth.ts`
   - `/api/auth/login`
   - `/api/auth/register`
   - `/api/auth/verify-2fa`
   - `/api/auth/profile` (GET/PATCH)
   - `/api/auth/password`
   - `/api/auth/firebase-sync`
   - `/api/auth/logout`
   - WebAuthn endpoints under `/api/auth/webauthn/*`

---

## Identity & Access v2 State Model

The auth journey SHALL use this normalized state machine:

1. `UNAUTHENTICATED`
2. `AUTH_CHALLENGE` (credentials/social/OTP/2FA)
3. `AUTHENTICATED_PENDING_PROFILE` (profile incomplete or role unresolved)
4. `AUTHENTICATED_PENDING_APPROVAL` (status `pending`)
5. `AUTHENTICATED_READY` (eligible for `/crm`)
6. `AUTH_FAILED_RECOVERABLE`
7. `AUTH_FAILED_LOCKED_OUT`

### Transition Rules

- `UNAUTHENTICATED -> AUTH_CHALLENGE` on sign-in/signup initiation.
- `AUTH_CHALLENGE -> AUTHENTICATED_PENDING_APPROVAL` when backend returns `status=pending`.
- `AUTH_CHALLENGE -> AUTHENTICATED_PENDING_PROFILE` when role missing or required profile fields incomplete.
- `AUTH_CHALLENGE -> AUTHENTICATED_READY` only after valid session + role resolution + completeness gate pass.
- Any challenge state may transition to `AUTH_FAILED_RECOVERABLE` on transient failures.
- Challenge states transition to `AUTH_FAILED_LOCKED_OUT` on rate-limit/lockout responses.

---

## Required Journey Coverage (REQ-IAMV2-001)

Wave 19 auth implementation SHALL preserve and align these journeys:

1. **Login**
   - Email/password + social providers + OTP/2FA as configured.
2. **Signup**
   - Category + role-aware onboarding path.
3. **Forgot Password**
   - Request flow is mandatory in frontend (`handleForgotPassword`) and backend reset lifecycle support is required by `W19-002`.
4. **Biometric/WebAuthn**
   - WebAuthn register/verify routes are the canonical biometric surface.
5. **Profile Completion Gate**
   - Post-auth route eligibility must evaluate role + profile completeness before full CRM access.

---

## Route Resolution Contract

### Deterministic Destination Priority

On successful auth, destination resolution MUST follow this order:

1. Safe `returnTo` (if internal and not blocked auth route)
2. Pending approval route (`/pending-approval`) when `status=pending`
3. Missing role remediation (`/select-role`) when role absent
4. Tenant route (`/tenant-portal`) when role is tenant
5. Landlord/property-owner route (`/landlord-portal`)
6. CRM route (`/crm`) for eligible staff/leadership roles

### Existing Canonical Utilities

- `resolvePostLoginDestination` in `src/utils/authSession.ts`
- role normalization via `normalizeRoleForUserContext`
- creator-superuser canonicalization preserved

### Wave 19 Profile-First Gate Note

Current frontend logic includes profile-first post-login behavior in `useSignIn.ts`. Wave 19 implementation tasks (`W19-003`, `W19-004`, `W19-005`) must align this with the global route contract so there is one consistent decision engine and no duplicated routing forks.

---

## Security and Lockout Contract

The following controls are mandatory and must remain consistent across entrypoints:

1. Per-IP brute-force lockout (`/api/auth/login` path)
2. Per-account brute-force lockout
3. `Retry-After` semantics on lockout responses
4. Audit activity logging for success/failure/unlock events
5. CSRF protection for logout and sensitive authenticated mutations
6. JWT + refresh-token issuance contract unchanged unless explicitly versioned

---

## Data Contract (Auth Success Envelope)

### Backend Success Shape

```text
{
  success: true,
  data: {
    token: string,
    user: {
      id: string,
      email: string,
      name: string | null,
      role: string,
      status?: string,
      department?: string | null,
      photoUrl?: string | null
    }
  },
  requiresTwoFactor?: boolean,
  degradedMode?: boolean
}
```

### Frontend Session Invariants

On successful auth session finalization:

1. user state set in Redux store
2. auth token persisted via canonical token helper
3. role preference persisted in safe storage
4. destination resolved through canonical route policy

---

## Error Handling Contract

Errors must map into one of:

1. `validation_error`
2. `auth_error`
3. `lockout_error`
4. `rate_limit_error`
5. `service_unavailable`

Frontend must expose actionable, non-sensitive messages; backend must avoid leaking sensitive internals.

---

## Traceability

- `REQ-IAMV2-001` ← this contract
- Feeds:
  - `W19-002` forgot-password states
  - `W19-003` / `W19-004` profile completion and role schema gates
  - `W19-005` auth-success routing standardization

---

## Acceptance for W19-001

W19-001 is complete when:

1. Contract exists as a dedicated Wave 19 artifact
2. Contract is linked from `WAVE_19_SDD.md`
3. Contract is linked from `WAVE_19_READINESS_PACKET.md`
4. `WAVE_19_IMPLEMENTATION_BACKLOG.md` marks `W19-001` as complete with this artifact reference

---

## Versioning

- Version: `v1.0.0` (2026-06-18)
- Any behavior-changing update must bump version and include impacted task IDs in the delta note.
