# 🔴 Critical Improvements — Broken / Stubbed Features

> **Phase assignments**: Phase 3, Phase 4, Phase 8  
> **Parent backlog**: [IMPROVEMENTS_BACKLOG.md](./IMPROVEMENTS_BACKLOG.md)  
> **Priority**: Must fix — these features are advertised but do nothing in production

---

## Item 1 — WhatsApp Integration is Fully Stubbed

**Phase**: Phase 4  
**File**: `server/services/WhatsAppBotService.ts`

### Problem
Every method in `WhatsAppBotService` logs a line and returns immediately. No real API call is ever made. The WhatsApp inbox in the Nadia CRM tab shows UI but never sends or receives real messages.

### What Needs Doing
- [ ] Implement `sendMessage()` using Meta Cloud API (`POST /messages` to `graph.facebook.com/v18.0/{PHONE_NUMBER_ID}/messages`)
- [ ] Implement `sendTemplateMessage()` for structured templates (viewing reminders, lead follow-ups)
- [ ] Implement `handleIncomingMessage()` to parse inbound webhook payloads and route to the correct agent inbox
- [ ] Upgrade webhook verification from token-only to full HMAC signature check
- [ ] Wire real-time conversation state: incoming messages push to frontend via WebSocket/SSE
- [ ] Auto-create a Lead in the CRM when a new WhatsApp contact initiates a conversation
- [ ] Register `WHATSAPP_BOT_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID` in production secrets

### Dependencies
- Meta Business WABA account approval (external — register at business.facebook.com)
- Approved WhatsApp Business phone number
- Phase 4 must start after Phase 3 is complete

### Acceptance Criteria
- Agent sends a WhatsApp message from the Nadia CRM inbox → recipient receives it on their phone
- Customer replies → message appears in Nadia inbox within 3 seconds
- Sending to an unregistered number returns a handled error, not a crash

---

## Item 2 — Stripe Payments Returns 503

**Phase**: Phase 5  
**File**: `server/routes/payments.ts`

### Problem
`/api/payments` returns HTTP 503 Service Unavailable. The Stripe SDK is not installed. No payment flow works — bookings, deposit collection, and commission payments are all broken.

### What Needs Doing
- [ ] Install `stripe` npm package: `npm install stripe`
- [ ] Add `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` to environment config
- [ ] Implement `POST /api/payments/intent` — create a PaymentIntent for property bookings
- [ ] Implement Stripe webhook handler at `POST /api/payments/webhook` with `stripe.webhooks.constructEvent()`
- [ ] Store payment records in the existing `Transaction` Prisma model on payment success
- [ ] Implement `GET /api/payments/:id` — retrieve payment status
- [ ] Add Stripe public key to frontend environment for Stripe Elements
- [ ] Implement the frontend `CheckoutForm` component using `@stripe/react-stripe-js`
- [ ] Handle payment failure gracefully with retry UI

### Dependencies
- Stripe account with live keys (external — stripe.com)
- Phase 5 (Lease & Tenancy) — payments are part of the rent collection flow

### Acceptance Criteria
- User can pay a property booking deposit via credit card
- Webhook correctly updates `Transaction.status` to `completed` on Stripe confirmation
- Failed payment shows a user-friendly error with retry option

---

## Item 3 — 2FA Returns 501

**Phase**: Phase 3  
**File**: `server/routes/auth.ts` (2FA verification handler)

### Problem
`POST /api/auth/verify-2fa` returns HTTP 501 Not Implemented. Two-factor authentication is shown in the UI but never enforced. This is a security gap for the managing_director and owner accounts.

### What Needs Doing
- [ ] Choose TOTP (recommended) — use `speakeasy` or `otplib` npm package
- [ ] `POST /api/auth/2fa/setup` — generate TOTP secret, return QR code URI for Google Authenticator
- [ ] `POST /api/auth/2fa/verify` — validate the 6-digit TOTP code against the stored secret
- [ ] `POST /api/auth/2fa/disable` — disable 2FA with password confirmation
- [ ] Store `totpSecret` (encrypted) and `twoFactorEnabled` boolean on the User model
- [ ] Add `npx prisma db push` migration for the new User fields
- [ ] On login: if `twoFactorEnabled === true`, return a partial JWT that only allows hitting `/api/auth/2fa/verify`
- [ ] After successful TOTP verify, issue the full JWT

### Dependencies
- `npm install speakeasy qrcode @types/speakeasy @types/qrcode`
- No external service required for TOTP (app-based)

### Acceptance Criteria
- Managing director can scan a QR code with Google Authenticator
- After scanning, every login requires a 6-digit code
- An incorrect code returns 401, correct code returns full JWT
- 2FA can be disabled with password confirmation

---

## Item 4 — Arabic / RTL — No `ar` Key in Translations

**Phase**: Phase 8  
**File**: `src/i18n/translations.ts`

### Problem
`translations.ts` exports an object with only the `en` key (523 lines). There is no `ar` key. The language switcher in the UI changes the setting but shows English text regardless. RTL layout is fully undocumented in CSS.

### What Needs Doing
- [ ] Add complete `ar: { ... }` translation object to `src/i18n/translations.ts` mirroring all 523 English entries
- [ ] Use professional Arabic translations (not machine-translated) for property-facing strings
- [ ] Add `dir` toggle to the `<html>` element when `language === 'ar'`
- [ ] Add `direction: 'rtl'` to `DefaultTheme` in `src/styles/theme/` and apply to all styled-components that use `flex`, `text-align`, `margin/padding` directional values
- [ ] Add `font-family` override for Arabic — use Google Fonts `Cairo` or `Tajawal`
- [ ] Test all pages in RTL mode at 375px, 768px, 1440px breakpoints
- [ ] Ensure numbers and currency remain LTR within RTL layout (use `unicode-bidi: isolate`)
- [ ] Update Nina WhatsApp bot to detect Arabic and respond in Arabic (Phase 4 dependency)

### Dependencies
- Professional Arabic translation resource for marketing copy
- Phase 8 is after Phases 4–7

### Acceptance Criteria
- Switching language to Arabic: all visible text renders in Arabic
- Page layout flips to RTL — navigation is right-aligned, content flows right-to-left
- No English fallback text visible after switch
- Arabic site passes Lighthouse accessibility (direction attributes correct)

---

## Item 5 — AI Assistant Registry Gap (10 Assistants Missing)

**Phase**: Phase 3  
**File**: `src/store/slices/aiAssistant/registry.ts`

### Problem
The code registry has 17 assistants. Business documentation defines 27. The 10 missing assistants — including Archer (lead scoring), Quill (document generator), and Oracle (market analyst) — are defined in `business/04_ai_assistants/` but never registered in Redux, meaning their dashboards cannot render in the CRM.

### What Needs Doing
- [ ] Identify all 27 assistants from `business_docs/` and `business/04_ai_assistants/`
- [ ] Add the 10 missing assistants to `src/store/slices/aiAssistant/registry.ts` following the existing pattern
- [ ] Create stub dashboard components for each new assistant under `src/components/owner/ai/` (same pattern as existing `ClaraDashboard`, `NadiaDashboard`, etc.)
- [ ] Map each new assistant to the correct CRM tab in `src/config/ROLE_TAB_MAPPING.ts`
- [ ] Wire the assistants to `/api/assistants` (existing CRUD API) so their plans load correctly
- [ ] Add tests for each new assistant registry entry (follow `aiAssistantDashboardSlice.test.ts` pattern)

### Missing Assistants to Register
Based on business docs, the 10 missing entries are:
1. **Archer** — Lead scoring bot
2. **Quill** — Document generator
3. **Oracle** — Market analyst
4. **Cipher** — AI Market Intelligence (DLD data)
5. **Maven** — Investment ROI Calculator
6. **Prism** — Property matching AI
7. **Atlas** — Area knowledge base
8. **Echo** — Client communication history
9. **Iris** — Virtual staging AI
10. **Nova** — New development tracker

### Acceptance Criteria
- All 27 assistants appear in the AI Hub sidebar of the CRM for `managing_director`
- Clicking each assistant opens its dashboard without a crash
- `GET /api/assistants` returns all 27 registered assistants
- Tests pass for all new registry entries
