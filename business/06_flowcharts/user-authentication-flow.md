# User Authentication Flow
# White Caves Real Estate Platform

> **Document ID:** WC-FLOW-AUTH-001
> **Version:** 1.0
> **Date:** April 2026
> **Status:** Active
> **Owner:** Technology Department (Daniela — Auth Specialist)
> **Scope:** JWT login, Firebase OAuth, token refresh, logout, 2FA (Phase 9)

---

## 1. Email/Password Login Flow

```
User enters email + password → clicks "Sign In"
          │
          ▼
    [Frontend: LoginPage]
    Validate form (email format, password not empty)
          │
          ├── Invalid → Show inline errors → STOP
          │
          ▼
    POST /api/auth/login
    { email, password }
          │
          ▼
    [Rate Limiter]
    5 attempts / 15 min per IP
          │
          ├── Limit exceeded → 429 Too Many Requests
          │   "Too many login attempts. Try again in X minutes."
          │   → Frontend shows countdown timer → STOP
          │
          ▼
    [Express Auth Route]
    Look up user by email (prisma.user.findUnique)
          │
          ├── User not found → 401 "Invalid credentials"
          │   (same message as wrong password — no user enumeration)
          │
          ▼
    bcrypt.compare(password, user.passwordHash)
    [Timing-safe — always runs full hash, no short-circuit]
          │
          ├── Mismatch → 401 "Invalid credentials"
          │   Increment failed attempt counter (Phase 9: lockout after 10)
          │
          ▼
    User active? (isActive === true)
          │
          ├── Inactive / suspended → 403 "Account suspended"
          │   "Contact support: hello@whitecaves.ae"
          │
          ▼
    Generate JWT:
    {
      userId: user._id,
      email: user.email,
      role: user.role,
      iat: now,
      exp: now + 7d
    }
    Sign with process.env.JWT_SECRET
          │
          ▼
    Response 200:
    {
      token: "eyJ...",
      user: { id, name, email, role, avatar }
    }
    Set-Cookie: token=eyJ...; HttpOnly; Secure; SameSite=Strict; Max-Age=604800
          │
          ▼
    [Frontend: Redux authSlice]
    dispatch(login({ token, user }))
    Store token in redux + localStorage
          │
          ▼
    Navigate to /dashboard
    (role-adaptive: managing_director → full CRM, landlord → portal, etc.)
```

---

## 2. Firebase OAuth (Google SSO) Flow

```
User clicks "Continue with Google"
          │
          ▼
    [Firebase Auth JS SDK]
    GoogleAuthProvider popup / redirect
          │
          ├── User cancels → Return to login page → STOP
          │
          ▼
    Google returns:
    { idToken, uid, email, displayName, photoURL }
          │
          ▼
    POST /api/auth/firebase-sync
    { idToken }
    [Currently disabled — returns 503 until firebase-admin SDK configured]
          │
          ▼  [Phase 2 — after firebase-admin configured]
    [Backend: firebase-admin.auth().verifyIdToken(idToken)]
          │
          ├── Invalid token → 401 "Invalid Firebase token"
          │
          ▼
    Look up user by uid or email:
          │
          ├── New user → Create user record (role: 'viewer' default)
          │              Send welcome email via SendGrid
          │
          ├── Existing user → Update lastLoginAt
          │
          ▼
    Generate White Caves JWT (same as email/password flow)
          │
          ▼
    Response 200: { token, user }
    → Frontend handles same as email login
```

---

## 3. Token Validation Flow (Every Authenticated Request)

```
API Request received
(e.g., GET /api/leads)
          │
          ▼
    [authMiddleware]
    Extract token:
      1. Authorization header: "Bearer eyJ..."
      2. Cookie: token=eyJ...
      3. Neither present → 401 "No authentication token"
          │
          ▼
    jwt.verify(token, JWT_SECRET)
          │
          ├── Expired → 401 "Token expired. Please log in again."
          │   Frontend: dispatch(logout()), redirect to /login
          │
          ├── Invalid signature → 401 "Invalid token"
          │
          ├── Malformed → 401 "Invalid token format"
          │
          ▼
    Decoded payload: { userId, email, role, iat, exp }
    req.user = { id: userId, email, role }
          │
          ▼
    [requireRole middleware] (if route has role restriction)
    Check: allowedRoles.includes(req.user.role)
          │
          ├── Role not allowed → 403 "Insufficient permissions"
          │
          ▼
    Proceed to route handler
```

---

## 4. Logout Flow

```
User clicks "Sign Out"
          │
          ▼
    [Frontend]
    POST /api/auth/logout
    Authorization: Bearer eyJ...
          │
          ▼
    [Backend]
    Add token to revocation list (Redis blacklist — Phase 7)
    [Current Phase 2: Stateless — token expires naturally after 7d]
    Clear Set-Cookie (Max-Age=0)
          │
          ▼
    Response 200: { message: "Logged out successfully" }
          │
          ▼
    [Frontend: Redux]
    dispatch(logout())
    Clear localStorage token
    Clear Redux auth state
          │
          ▼
    Navigate to /login
```

---

## 5. Password Reset Flow

```
User clicks "Forgot Password?"
          │
          ▼
    Enter email address
          │
          ▼
    POST /api/auth/forgot-password
    Rate limited: 3 requests / hour per IP
          │
          ▼
    [Backend]
    Look up user by email
    [Always return 200 — no user enumeration]
    {
      message: "If that email exists, a reset link has been sent."
    }
          │
          ├── Email found →
          │     Generate reset token (crypto.randomBytes(32) → hex)
          │     Store: { token: hash, userId, expiresAt: now+1h }
          │     Send email via SendGrid: "Reset your password"
          │     Link: https://whitecaves.ae/reset-password?token=abc123
          │
          ├── Email not found → Log silently, return same 200
          │
          ▼
    User clicks email link
          │
          ▼
    GET /reset-password?token=abc123
    [Frontend shows new password form]
          │
          ▼
    POST /api/auth/reset-password
    { token, newPassword, confirmPassword }
          │
          ▼
    [Backend]
    Validate token: find by hash, check expiry
          │
          ├── Token not found → 400 "Invalid or expired reset link"
          ├── Token expired → 400 "Reset link expired. Request a new one."
          │
          ▼
    bcrypt.hash(newPassword, 10)
    Update user.passwordHash
    Delete reset token (single-use)
    Invalidate all existing JWTs for this user (Phase 7: Redis blacklist)
          │
          ▼
    Response 200: "Password updated. Please log in."
    → Redirect to /login
```

---

## 6. Two-Factor Authentication Flow (Phase 9)

```
[Phase 9 — not yet implemented; returns 501]

Login succeeds (email/password validated)
          │
          ▼
    Is 2FA enabled for this user?
          │
          ├── No → Issue JWT immediately (current behaviour)
          │
          ▼  [Phase 9]
    Issue short-lived "2FA pending" token (5 min expiry)
    Trigger 2FA challenge:
      Option A: TOTP — user opens authenticator app
      Option B: SMS — Twilio sends 6-digit code
          │
          ▼
    POST /api/auth/2fa/verify
    { pendingToken, code }
          │
          ├── Code invalid or expired → 401 "Invalid code"
          │   Allow 3 attempts before locking (10 min)
          │
          ▼
    Verify TOTP: speakeasy.totp.verify(code, secret)
    OR verify SMS: compare code + check expiry
          │
          ▼
    Issue full JWT (7d) → Same as standard login
```

---

## 7. Role-Based Redirect After Login

| Role | Redirect Target | Available Tabs |
|------|----------------|----------------|
| `managing_director`, `lion` | `/dashboard` | All 8+ CRM tabs |
| `owner` | `/dashboard` | All 8+ CRM tabs |
| `admin` | `/dashboard` | Admin + core CRM tabs |
| `agent`, `senior_agent` | `/dashboard` | Leads, Properties, Clients |
| `landlord` | `/landlord-portal` | Landlord portal only |
| `tenant` | `/tenant-portal` | Tenant portal only |
| `viewer` | `/dashboard` | Read-only view |

---

## 8. Security Controls Summary

| Control | Implementation |
|---------|---------------|
| Password hashing | bcrypt, rounds=10 |
| Token expiry | JWT 7d, 2FA pending 5min |
| Rate limiting | Auth: 5/15min; Register: 3/hr; Password: 3/hr |
| No user enumeration | Same response for wrong email / wrong password |
| Timing-safe auth | bcrypt always runs full comparison |
| Cookie security | HttpOnly, Secure, SameSite=Strict |
| 2FA | TOTP + SMS (Phase 9) |
| Token revocation | Redis blacklist (Phase 7) |

---

**Document Owner:** Technology / Daniela (Auth Specialist)
**Related:** `business_docs/10_security/security-policy.md`, `server/middleware/auth.ts`
