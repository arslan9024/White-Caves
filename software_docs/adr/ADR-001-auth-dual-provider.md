# ADR-001 — Firebase + JWT Dual-Provider Authentication

**Status:** Accepted  
**Date:** 2026-01-15  
**Owners:** @Mira + @Daniela + @Radia  
**Related files:** `server/routes/auth.ts`, `src/store/authSlice.tsx`, `src/utils/superUserAccess.ts`

---

## Context

White Caves requires a production-grade authentication system that satisfies three
competing requirements simultaneously:

1. **Social sign-in (Google, Apple)** — Luxury real estate clients expect frictionless,
   zero-password entry. Firebase Authentication provides these providers with
   battle-tested SDKs and a UAE-accessible infrastructure footprint.

2. **Server-side session authority** — Backend Express routes must enforce RBAC
   independently of the client. This requires server-issued JWTs so that each API
   request carries a verifiable role claim that is not solely derived from the
   Firebase ID token (which can be replayed or delayed).

3. **Superuser fast-path** — The managing director (`arslanmalikgoraha@gmail.com`)
   must have zero-latency, unambiguous role resolution on every session start,
   independent of Firebase claim propagation delays.

---

## Decision

**Use Firebase Authentication for identity (social + phone providers) combined with
a server-issued, short-lived JWT for session authority.**

The dual-provider flow is:

```
Client → Firebase sign-in (Google/Apple/phone)
       → POST /api/auth/firebase-sync  (exchanges Firebase ID token for server JWT)
       → Server validates Firebase token, resolves role, issues signed JWT (1h)
       → Client stores JWT + expiry, proactively refreshes at T-60s
       → All subsequent API calls carry Authorization: ******
```

The Firebase sync endpoint (`/api/auth/firebase-sync`) is the canonical source of
truth for role assignment. The server may issue a different (higher or lower) role
than the Firebase custom claim when the email matches a known override rule (e.g.,
the creator superuser canonicalization — see ADR-005).

---

## Alternatives Considered

| Alternative | Reason Rejected |
| --- | --- |
| **Auth0** | Vendor lock-in; $23/MAU at projected scale; does not support the creator-email superuser override without custom Actions; additional latency hop to US/EU Auth0 data centres is undesirable for UAE-first UX. |
| **Supabase Auth** | Tightly coupled to PostgreSQL; White Caves uses MongoDB (ADR-002); migrating away from Supabase Auth later would be disruptive. Additionally, Supabase's UAE region availability was uncertain at decision time. |
| **Next-Auth / BetterAuth** | Framework-specific; White Caves uses plain Express 5 on the backend and does not use Next.js, making framework-specific auth adapters inappropriate. |
| **Firebase-only (no server JWT)** | Firebase ID tokens cannot be safely used as long-lived session tokens; they cannot carry our custom role claims without custom token minting, which requires the same Firebase Admin SDK already in use. Adds nothing over the hybrid approach. |
| **Custom JWT only (no Firebase)** | Eliminates social sign-in convenience and requires building password-reset, MFA, and social-provider plumbing from scratch — unrealistic for a rapid-delivery startup CRM. |

---

## Consequences

### Positive

- Social sign-in with Google works out of the box via Firebase SDK.
- Server JWTs are independently revocable (add to deny-list) without touching Firebase.
- Role overrides (including the superuser fast-path) are entirely server-controlled,
  reducing the attack surface for privilege escalation via Firebase claim manipulation.
- The sync endpoint acts as a natural audit hook: every session start is logged.

### Negative / Risks

- **Two-token management:** The client must track both the Firebase ID token (for
  Firebase SDK operations like storage uploads) and the server JWT (for API calls).
  This adds complexity to `authSlice.tsx`.
- **Race condition on cold load:** The Firebase `onAuthStateChanged` callback resolves
  asynchronously; the route guard must wait for `authReady` to be `true` before
  deciding to redirect — see Wave 19 task W19-003.
- **Firebase outage dependency:** If Firebase is unavailable, social sign-in fails.
  The system has a development-mode fallback (`NODE_ENV=development`) but no
  production-grade fallback for Firebase downtime.

### Mitigation

- Rate-limit `/api/auth/firebase-sync` at 20 req/min per IP (Wave 16, already shipped).
- Proactive JWT refresh at T-60s prevents expiry-at-request failures (Wave 19, W19-002).
- Add `authReady` flag to `authSlice` to gate route guards (Wave 19, W19-003).
