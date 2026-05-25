# Wave 18 — System Design Document (SDD)

**Wave:** 18  
**Focus:** World-Class Auth + Profile-First Onboarding + Role-Based Dashboards  
**Status:** 📋 Planned  
**Date:** 2026-05-25  
**Owners:** @Mira + @Una + @Lea + @Radia + @Daniela + @Katherine  
**Entry Gate:** Wave 17 green + readiness 60% + `@Ada — Context Ready (60% Readiness) — Coding Phase Approved`

---

## Scope

Wave 18 defines three integrated outcomes:

- **Auth hardening upgrade:** passkeys/WebAuthn, refresh-token rotation, trusted devices, recovery + magic-link flows, audit/rate-limit expansion.
- **Profile-first onboarding gate:** post-login routes through `/profile?onboarding=true` for first-time/incomplete users.
- **Role-specific dashboard routing:** dashboard entry becomes role-group aware with thin dashboard shells over unified modules.

---

## Architecture Decisions

### 18-A — Authentication Hardening

1. Add WebAuthn credential persistence in Prisma (`WebAuthnCredential`), user-owned and multi-device capable.
2. Replace single refresh-token hash behavior with rotation semantics and revocation-aware session records.
3. Add trusted-device persistence (`TrustedDevice`) and trigger new-device notification workflow.
4. Expand auth API with recovery + passwordless capability:
   - `POST /api/auth/forgot-password`
   - `POST /api/auth/reset-password`
   - `POST /api/auth/verify-email`
   - `POST /api/auth/magic-link/request`
   - `GET /api/auth/magic-link/verify`
5. Enforce stronger password controls (minimum length + strength signal + breach-screening path).

### 18-B — Profile Completion Gate

1. `/api/auth/profile` returns:
   - `profileCompletionPct: number`
   - `profileMissingFields: string[]`
   - `profileComplete: boolean`
2. Server-side completeness rules by role:
   - All roles: name, phone, verified email
   - Agents/staff: department + role-required BRN/RERA identifiers
   - Buyer/tenant/landlord tracks: nationality + Emirates ID or passport fields
3. `profileCompletedAt` is authoritative for first-login completion lifecycle.
4. Post-login destination resolves to profile onboarding when first-login or completion threshold unmet.

### 18-C — Dashboard Routing

1. Replace flat `DashboardEntryRoute` behavior with `DashboardRouter` role-group resolver.
2. Create role-group shell routes (executive/manager/agent/buyer/seller/property/finance/investor).
3. Shell components seed `setActiveRole` and wrap `UnifiedDashboardPage` (no duplicate dashboard logic).
4. Add first-login UX polish primitives:
   - welcome banner per role group
   - one-time welcome splash
   - first-7-days quick-start checklist card

---

## Data Model Additions (Planned)

- `User` additions:
  - `nationality String?`
  - `emiratesId String?`
  - `passportNumber String?`
  - `emailVerified Boolean @default(false)`
  - `profileCompletedAt DateTime?`
- New model: `WebAuthnCredential`
  - `id`, `userId`, `credentialId`, `publicKey`, `counter`, `deviceType`, timestamps
- New model: `TrustedDevice`
  - `id`, `userId`, `deviceHash`, `userAgent`, `ip`, `lastSeenAt`, `trusted`, timestamps

---

## API Surface (Planned)

| Area | Endpoint | Purpose |
| --- | --- | --- |
| Profile scoring | `GET /api/auth/profile` | Return user profile + completeness metrics |
| Profile completion | `PATCH /api/auth/profile` | Persist onboarding data; set `profileCompletedAt` when required fields complete |
| Passkeys | `POST /api/auth/webauthn/register` | Register WebAuthn credential |
| Passkeys | `POST /api/auth/webauthn/authenticate` | Authenticate with passkey |
| Sessions | `GET /api/auth/sessions` | List active sessions with device metadata |
| Sessions | `DELETE /api/auth/sessions/:id` | Revoke session |
| Recovery | `POST /api/auth/forgot-password` | Issue reset flow |
| Recovery | `POST /api/auth/reset-password` | Complete password reset |
| Email verify | `POST /api/auth/verify-email` | Verify ownership path |
| Magic link | `POST /api/auth/magic-link/request` | Create and send link |
| Magic link | `GET /api/auth/magic-link/verify` | Consume signed token and create session |

---

## Risk Register

| Risk | Severity | Mitigation |
| --- | --- | --- |
| New auth flows increase attack surface | High | Route-level rate limits + audit events + centralized AppError handling |
| Dashboard shell drift from unified module metadata | Medium | Shells only seed role and compose existing `UnifiedDashboardPage` |
| Onboarding hard-gate blocks legitimate returning users | Medium | Soft gate when completion >60%; banner nudges instead of hard block |
| WebAuthn browser inconsistencies | Medium | Keep password + OTP fallback and feature-detect client capabilities |
| Session rotation regression risk | High | Add focused auth/session regression tests before rollout |

---

## Dependencies & Integration Notes

- Reuse existing auth route patterns (`AppError`, `asyncHandler`, CSRF middleware, audit `Activity` model).
- Reuse existing profile page route and UX shell; extend with onboarding overlay.
- Reuse CRM module registry architecture (`src/config/crmModuleRegistry.tsx`) for role-shell composition.
- Dependency additions (if required) must pass advisory review prior to install.

