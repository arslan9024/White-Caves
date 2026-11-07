# Wave 16: Security Hardening & CSRF Coverage Plan

> **Tracking:** `DU001` | **Agent:** `@S5` (SecOps Core Node) | **Status:** `IMPLEMENTED & ENFORCED`  
> **CONSUMES:** `server/routes/auth.ts`, `server/middleware/csrf.ts`  
> **FEEDS:** `business_docs/09_crm_features/wave-16-security-hardening.md`  
> **FEEDS_ACK:** `AEGIS-V5-SECOPS-W16-ACK`

---

## 1. Overview & Objective
This specification formalizes the CSRF protection coverage across all mutation routes (`POST`, `PUT`, `PATCH`, `DELETE`) in White Caves CRM, establishing double-submit cookie validation, cryptographic entropy gates, and graceful client sync.

---

## 2. Architecture & Double-Submit Flow

```
[ Client Browser ]
        │  1. GET /api/auth/csrf-token (or initialized on first session)
        ▼
[ Server: CSRF Mint Gate ]
        │  Sets HttpOnly/Strict Cookie: `csrf_token`
        │  Returns JSON: { csrfToken: "<token>" }
        ▼
[ Client Application ]
        │  Injects header `x-csrf-token: <token>` on all state-modifying calls
        ▼
[ Server: requireDoubleSubmitCsrf ]
        │  Validates crypto.timingSafeEqual(cookieToken, headerToken)
        ├── If Match ──> Passes to route handler
        └── If Mismatch ─> Rejects with 403 Forbidden (CSRF_TOKEN_INVALID)
```

---

## 3. Scope & Route Coverage

| Route Surface | Method | Protection Layer | Validation Endpoint |
| :--- | :--- | :--- | :--- |
| `/api/auth/login` | `POST` | Double-Submit CSRF + Rate Limiter | `server/routes/auth.ts` |
| `/api/auth/logout` | `POST` | Double-Submit CSRF + Auth Token | `server/routes/auth.ts` |
| `/api/auth/refresh` | `POST` | Double-Submit CSRF + Session Cookie | `server/routes/auth.ts` |
| `/api/auth/password` | `PUT` | Double-Submit CSRF + Auth Token | `server/routes/auth.ts` |
| `/api/auth/webauthn/*` | `POST/DELETE`| Cryptographic Challenge & Biometric Key | `server/controllers/auth/webAuthnController.ts` |

---

## 4. Verification & Automated Testing
1. **Unit Tests**: `server/middleware/auth.test.ts` & `src/services/webAuthnService.test.ts`.
2. **Timing-Safe Equivalence**: Node `crypto.timingSafeEqual` prevents side-channel length/byte leak attacks.
3. **Audit Trail**: Every unauthorized attempt logs a `login_failed` or `csrf_violation` event to Prisma `Activity`.

