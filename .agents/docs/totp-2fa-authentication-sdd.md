# Software Design Document (SDD): TOTP 2FA Verification Engine (`docs/plans/sdd/TOTP_2FA_AUTHENTICATION_SDD.md`)

> **Feature Key:** `FE-GOAL-028`  
> **Architecture Standard:** AEGIS Atomic 3-Folder Architecture (`.tsx`, `.logic.ts`, `.style.ts`)  
> **RFC Reference:** RFC 6238 Time-Based One-Time Password Algorithm  

---

## 1. Algorithmic Mathematical Model (RFC 6238)

The TOTP value \(T\) is generated mathematically by computing the HMAC-SHA1 signature over a 64-bit counter \(C\) derived from current epoch time \(t\):

\[
C = \left\lfloor \frac{t - t_0}{T_x} \right\rfloor
\]

where \(t_0 = 0\) (Unix epoch start) and \(T_x = 30\) seconds. The 6-digit TOTP code \(TOTP\) is extracted via dynamic binary truncation:

\[
TOTP(K, t) = \text{Truncate}(\text{HMAC-SHA1}(K, C)) \bmod 10^6
\]

---

## 2. Mermaid Sequence & State Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User as VIP Managing Director
    participant UI as Totp2faSetupCard (React View)
    participant Logic as useTotp2faSetupLogic (Hook)
    participant Auth as Auth2FAService (Backend)

    User->>UI: Clicks "Enable 2FA Security"
    UI->>Logic: triggerGenerateSecret()
    Logic->>Auth: POST /api/v1/auth/2fa/generate
    Auth-->>Logic: { secret: "JBSWY3DPEHPK3PXP", qrCodeUrl: "data:image/png;base64..." }
    Logic-->>UI: Display QR Code & Secret Key String
    User->>UI: Enters 6-Digit TOTP Token (e.g. "589214")
    UI->>Logic: verifyToken("589214")
    Logic->>Auth: POST /api/v1/auth/2fa/verify
    Auth-->>Logic: { success: true, backupCodes: [...] }
    Logic-->>UI: Display Success Toast & Backup Codes Modal
```

---

## 3. Component Architecture Specification

| Component Layer | Target File Path | Responsibility |
| :--- | :--- | :--- |
| **Style Layer** | [`Totp2faSetupCard.style.ts`](file:///c:/Users/HP/Documents/My%20Web%20Sites/AntigravityWC/White-Caves/src/components/auth/Totp2faSetupCard/Totp2faSetupCard.style.ts) | Styled-components layout, glassmorphic card, red accent border (`#EF4444`). |
| **Logic Layer** | [`Totp2faSetupCard.logic.ts`](file:///c:/Users/HP/Documents/My%20Web%20Sites/AntigravityWC/White-Caves/src/components/auth/Totp2faSetupCard/Totp2faSetupCard.logic.ts) | Hook managing state (`token`, `secret`, `qrGenerated`, `isVerified`, `backupCodes`). |
| **View Layer** | [`Totp2faSetupCard.tsx`](file:///c:/Users/HP/Documents/My%20Web%20Sites/AntigravityWC/White-Caves/src/components/auth/Totp2faSetupCard/Totp2faSetupCard.tsx) | Clean JSX View consuming logic hook and styled primitives. |
