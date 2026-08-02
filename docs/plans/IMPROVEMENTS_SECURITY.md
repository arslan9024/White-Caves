# 🔵 Security Improvements

> **Phase assignments**: Phase 3, Phase 9  
> **Parent backlog**: [IMPROVEMENTS_BACKLOG.md](./IMPROVEMENTS_BACKLOG.md)  
> **Priority**: High — security gaps in a financial real estate CRM are unacceptable in production

---

## Item 23 — JWT Refresh Token Flow Missing

**Phase**: Phase 3  
**Current state**: Only short-lived access tokens are issued. When the token expires, users are silently logged out. There is no refresh mechanism, forcing users to re-enter credentials frequently.

### What Needs Doing
- [ ] Issue two tokens on login:
  - **Access token**: 15-minute expiry (short-lived, stored in memory/Redux)
  - **Refresh token**: 7-day expiry (long-lived, stored in `httpOnly; Secure; SameSite=Strict` cookie)
- [ ] Add `refreshTokenHash` field to the `User` Prisma model (store bcrypt hash of the refresh token, not plain token)
- [ ] `POST /api/auth/refresh` — validates the httpOnly refresh token cookie, issues a new access token
- [ ] `POST /api/auth/logout` — clears the httpOnly cookie and invalidates the refresh token in DB
- [ ] On 401 response: frontend `apiService.ts` automatically calls `/api/auth/refresh` once before redirecting to login
- [ ] Refresh token rotation: each use of `/api/auth/refresh` issues a new refresh token and invalidates the old one

### Security Notes
- Refresh tokens must NEVER be returned in the JSON response body — httpOnly cookie only
- Storing a hash (not the raw token) means a database breach does not expose active sessions
- Rotation means a stolen refresh token can only be used once before the legitimate user's next request detects a reuse

### Acceptance Criteria
- User logs in → receives access token in response body + refresh token in httpOnly cookie
- 15 minutes later: frontend silently refreshes with `/api/auth/refresh` — user stays logged in
- User logs out → httpOnly cookie cleared, refresh token hash deleted from DB
- Stolen refresh token reuse → server detects rotation conflict, invalidates all sessions for that user

---

## Item 24 — No CSRF Protection

**Phase**: Phase 9  
**Current state**: The app uses `Authorization: Bearer` header for most requests, which is not vulnerable to classic CSRF. However, state-changing cookie-based endpoints (once refresh tokens are added in Item 23) are CSRF-vulnerable.

### What Needs Doing
- [ ] After implementing refresh tokens (Item 23), add CSRF protection for cookie-based endpoints
- [ ] Use the **Double Submit Cookie** pattern (no server-side state required):
  - On login, set a separate non-httpOnly `csrf_token` cookie (random 32-byte hex)
  - Frontend reads this cookie and sends it as a custom `X-CSRF-Token` request header on every mutating request
  - Server middleware verifies that the `X-CSRF-Token` header matches the `csrf_token` cookie value
- [ ] Apply CSRF check middleware to: `POST /api/auth/logout`, `POST /api/auth/refresh`, and any future cookie-based endpoints
- [ ] Bearer-token endpoints (all `/api/v1/*` with `Authorization` header) do NOT need CSRF tokens

### Acceptance Criteria
- `POST /api/auth/logout` without `X-CSRF-Token` header → `403 Forbidden`
- `POST /api/auth/logout` with correct `X-CSRF-Token` matching cookie → `200 OK`
- Cross-origin request cannot forge the `X-CSRF-Token` header (SameSite cookie restriction prevents reading it)

---

## Item 25 — Rate Limiting — Only Global, Not Per-Route

**Phase**: Phase 3  
**Current state**: `express-rate-limit` is configured globally (e.g., 100 req/15min). High-risk auth endpoints (login, register, password reset) need much stricter limits to prevent brute-force attacks.

### What Needs Doing
- [ ] Review current rate limiter config in `server/middleware/` or `server/config/`
- [ ] Create separate, stricter limiters and apply them per-route:
  ```
  POST /api/auth/login         → 5 requests / 15 minutes per IP
  POST /api/auth/register      → 3 requests / 1 hour per IP
  POST /api/auth/forgot-password → 3 requests / 1 hour per IP
  POST /api/auth/verify-2fa    → 5 requests / 15 minutes per IP
  POST /api/auth/refresh        → 20 requests / 15 minutes per IP
  ```
- [ ] On brute-force lockout: return `429 Too Many Requests` with `Retry-After` header
- [ ] Implement account-level lockout: after 10 failed logins for a specific email, temporarily lock that account for 30 minutes regardless of IP
- [ ] Log all rate-limit hits to the `Activity` model with `type: 'security'`

### Acceptance Criteria
- 6th login attempt from the same IP within 15 minutes → `429` with `Retry-After: 900`
- 11th failed login for `arslanmalikgoraha@gmail.com` → account locked for 30 minutes, all subsequent logins return `423 Locked`
- Successful login after lockout expiry → works normally
- Rate limit hits appear in server logs

---

## Item 26 — Secrets / Credentials in Seed File

**Phase**: Phase 3  
**File**: `prisma/seed.ts`

### Problem
`prisma/seed.ts` contains hardcoded email addresses and default passwords as plain strings in source code. This means credentials are permanently committed to git history, visible to anyone with repo access.

### What Needs Doing
- [ ] Replace hardcoded credentials in `prisma/seed.ts` with environment variable reads:
  ```typescript
  const SEED_SUPER_USER_EMAIL = process.env.SEED_SUPER_USER_EMAIL ?? 'arslanmalikgoraha@gmail.com';
  const SEED_SUPER_USER_PASSWORD = process.env.SEED_SUPER_USER_PASSWORD;
  if (!SEED_SUPER_USER_PASSWORD) throw new Error('SEED_SUPER_USER_PASSWORD env var required');
  ```
- [ ] Add `SEED_SUPER_USER_EMAIL`, `SEED_SUPER_USER_PASSWORD`, `SEED_OWNER_EMAIL`, `SEED_OWNER_PASSWORD` to `.env.example`
- [ ] Add these variables to `DEPLOYMENT_GUIDE.md` under "Initial Seed Setup"
- [ ] Ensure `.env` (with real values) is in `.gitignore` (verify — it likely already is)
- [ ] Document: after first seed, change the default password via the CRM Settings > Security tab

### Note
This does NOT remove historical commits (that would require a `git filter-branch` / BFG Repo Cleaner run which is irreversible — coordinate with the repository owner before doing so).

### Acceptance Criteria
- `npm run db:seed` without `SEED_SUPER_USER_PASSWORD` set → throws a clear error
- `npm run db:seed` with env vars set → seeds successfully
- `prisma/seed.ts` contains no hardcoded password strings
