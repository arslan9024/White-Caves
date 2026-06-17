# ADR-005 — Creator-Email Superuser Canonicalization (Lion Pattern)

**Status:** Accepted  
**Date:** 2026-04-01  
**Owners:** @Daniela + @Radia + @Ada  
**Related files:** `src/utils/superUserAccess.ts`, `src/App.tsx`, `src/hooks/useUnifiedDashboard.ts`,
`server/routes/auth.ts`

---

## Context

White Caves CRM has a two-level privilege system:
- **RBAC roles** assigned to agents (agent, team_lead, manager, admin, managing_director)
  that control which routes and CRM modules are accessible.
- **Platform superuser** — the single creator/owner account that should bypass
  all permission gates, have access to every module, and have a guaranteed
  fast-path login with zero-latency role resolution.

Early in Wave 15 development, the superuser was identified by a `role: "super_admin"`
field in the database. This caused three problems:

1. **Database dependency on login:** The role lookup required a database round-trip
   before the superuser could be identified, introducing latency and a failure mode
   if MongoDB was slow.
2. **Multiple aliases:** Various parts of the codebase used `super_admin`, `owner`,
   `md`, `managing_director`, and `lion` interchangeably, causing subtle permission
   check bugs.
3. **Insider threat surface:** Any admin who could write to the `User` collection
   could grant themselves `super_admin`, effectively self-elevating.

---

## Decision

**The superuser is identified solely by email address match against the hardcoded
creator constant `CREATOR_SUPERUSER_EMAIL`. The canonical role is `lion`. All other
aliases are normalized to `lion` only when the caller is the creator.**

Implementation in `src/utils/superUserAccess.ts`:

```ts
export const CREATOR_SUPERUSER_EMAIL = 'arslanmalikgoraha@gmail.com';
export const CANONICAL_SUPERUSER_ROLE = 'lion';

export function resolveEffectiveRole(email: string, dbRole: string): string {
  if (email === CREATOR_SUPERUSER_EMAIL) return CANONICAL_SUPERUSER_ROLE;
  // normalise known aliases for non-creator users to their closest legitimate role
  return normaliseDbRole(dbRole);
}
```

`resolveEffectiveRole` is called in `src/App.tsx` during Firebase auth resolution
and in `server/routes/auth.ts` during the `/api/auth/firebase-sync` JWT issuance.

The `lion` role is the only identity that:
- Skips the profile-completion gate
- Has the managing_director navigation workspace auto-mounted
- Can access AEGIS command centre and system health modules
- Receives a `X-Superuser: lion` response header for observability

---

## Alternatives Considered

| Alternative | Reason Rejected |
| --- | --- |
| **Database flag (`isSuperuser: Boolean`)** | Writable by any admin with direct DB access. Creator intent should not be database-mutable. |
| **Environment variable `CREATOR_EMAIL`** | Any deployment can override the env var, allowing the superuser identity to be hijacked in misconfigured environments. The hardcoded constant is safer for a single-tenant platform. |
| **Firebase custom claim (`superuser: true`)** | Firebase custom claims are set server-side but can be revoked or altered by anyone with Firebase Admin SDK access. The hardcoded email check is an additional layer that remains true even if Firebase claims are wrong. |
| **Role hierarchy with `super_admin` at top** | The problem was specifically that `super_admin` is a database-writable role. Replacing it with `lion` but keeping it database-writable does not solve the insider threat surface. The fix requires removing the DB dependency for creator identification. |
| **Dedicated superuser service account (no personal email)** | Better for multi-tenant SaaS. White Caves is single-tenant, and the creator is also the primary operator. A service account adds operational overhead (key rotation, storage) with no security gain in this threat model. |

---

## Consequences

### Positive

- Zero-database-round-trip superuser identification: the email check is synchronous
  and occurs entirely in memory before any async auth call.
- Eliminates the class of bugs where a managing_director database role granted
  partial superuser access to non-creator admins.
- The `lion` role name is semantically distinct from the RBAC role tree
  (`agent → team_lead → manager → admin → managing_director`), making it obvious
  in code that `lion` is outside the normal hierarchy.

### Negative / Risks

- **Single email dependency:** If the creator email address changes (e.g., Google
  account transfer), a code change and deployment is required to update
  `CREATOR_SUPERUSER_EMAIL`. There is no admin UI to change this value.
  Mitigation: the constant is in a single file with a prominent comment.
- **Hardcoded production email in source code:** The email address
  `arslanmalikgoraha@gmail.com` is visible in the source repository.
  This is an acceptable trade-off for a private, single-tenant platform;
  the email is not a secret (it is used for public business correspondence).
  It should **never** be replaced with a password, token, or other credential.
- **No delegation path:** If the creator is unavailable, no other account can
  obtain the `lion` role. This is intentional for a single-tenant platform.
  If delegation is required in the future, a separate `DELEGATE_SUPERUSER_EMAILS`
  array should be added with explicit scope limits — it must not simply clone
  the `lion` role to the delegate.
