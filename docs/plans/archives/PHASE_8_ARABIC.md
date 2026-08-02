# Phase 8 — Arabic RTL & Full Internationalisation

> **Priority**: #8 (after Phase 7)
> **Goal**: Complete Arabic language support with right-to-left layout, enabling White Caves to serve Arabic-speaking clients natively
> **Prerequisite**: Phase 7 (Analytics) — all UI content must be stable before translating
> **Status**: 🔲 Not Started — `src/i18n/translations.ts` exists with `en` key; `ar` key is empty/partial
> **Detailed context**: See [`PHASE_3_AND_BEYOND.md`](./PHASE_3_AND_BEYOND.md#phase-8--arabic-rtl--internationalisation-after-phase-7)

---

## Why This Is Phase 8

Arabic is the official language of the UAE, and a significant portion of White Caves' buyer and
landlord clients are Arabic-speaking. Full Arabic support — with RTL layout — differentiates
White Caves from competitors who offer only English or have broken RTL implementations.

---

## What Already Exists ✅

| Item                    | Location                   | Status                                          |
| ----------------------- | -------------------------- | ----------------------------------------------- |
| i18n translations file  | `src/i18n/translations.ts` | ✅ Exists (~523 lines) with `en` key            |
| Language detection hook | `src/i18n/`                | ✅ Exists (verify `useTranslation` hook)        |
| Arabic `ar` key         | `src/i18n/translations.ts` | ⚠️ Exists but empty/partial — no Arabic strings |
| Language selector UI    | Settings tab               | ⚠️ Exists — English only for now                |

---

## What Needs To Be Done 🚧

### 8.1 — Populate Arabic Translations

- [ ] Audit all user-facing strings in `en` key of `src/i18n/translations.ts`
- [ ] Write or source Arabic translations for each string
  - Use native Arabic speaker for review (not machine translation only)
  - Key areas: navigation labels, form labels, status badges, error messages, success messages
- [ ] Populate `ar` key completely in `src/i18n/translations.ts`
- [ ] Verify Arabic pluralisation rules (different from English — zero/one/two/few/many/other)

**High-priority sections to translate first:**

1. Navigation (navbar, sidebar labels)
2. Authentication (sign in, sign up, error messages)
3. Homepage sections (hero, features, testimonials)
4. Tenant/Landlord portal labels
5. Property listing cards and detail pages

---

### 8.2 — RTL Layout Toggle

- [ ] Add `dir="rtl"` to `<html>` element when Arabic is selected
- [ ] Create CSS utility class `.rtl-layout` that flips all `margin-left/right`, `padding-left/right`, `float`, `text-align`
- [ ] Styled-components theme addition: `theme.direction = 'rtl' | 'ltr'`
- [ ] Test every layout at RTL: sidebars, navbars, modals, tables, cards
- [ ] Framer Motion animations: check `x` values reverse correctly for RTL
- [ ] Flexbox rows: `flex-direction: row` reverses automatically in RTL — verify icons stay on correct side

---

### 8.3 — Arabic Typography

- [ ] Load Arabic-compatible font: `IBM Plex Arabic` or `Tajawal` (Google Fonts — free)
- [ ] Apply Arabic font when `lang = "ar"`: `font-family: 'Tajawal', sans-serif`
- [ ] Arabic text renders right-to-left naturally when `dir="rtl"` is set — verify in all text inputs
- [ ] Line height: Arabic script typically needs 1.6–1.8 line height (adjust base)

---

### 8.4 — Number, Date & Currency Formatting

- [ ] Use `Intl.NumberFormat` for price formatting: `new Intl.NumberFormat('ar-AE', { style: 'currency', currency: 'AED' })`
- [ ] Use `Intl.DateTimeFormat` for dates: `new Intl.DateTimeFormat('ar-AE', { ... })`
- [ ] Arabic-Indic numerals vs Western numerals: default in UAE Arabic is Western (0–9) — verify this is the client's preference before switching
- [ ] Update all price display components to use locale-aware formatting

---

### 8.5 — Language Detection & Persistence

- [ ] Auto-detect browser language: `navigator.language` — if `ar` or `ar-AE`, default to Arabic
- [ ] Store language preference in `localStorage` and Redux: `state.ui.language`
- [ ] Language switcher: globe icon in top navbar, dropdown with `English` / `العربية`
- [ ] URL approach: optionally prefix routes with `/en/` and `/ar/` for SEO (lower priority)

---

### 8.6 — Arabic WhatsApp Bot Responses (Nina)

- [ ] Detect incoming message language: check Meta webhook `messages[0].text.language` or use character detection
- [ ] If Arabic detected: use Arabic message templates in Nina bot responses
- [ ] Arabic template messages must be pre-approved by Meta before sending
- [ ] Test Arabic NLP intent classification: keywords in Arabic (عقار, شقة, فيلا, إيجار, بيع)

---

### 8.7 — Homepage Arabic Content

- [ ] Hero section: Arabic headline and subtitle translations
- [ ] Area names in Locations section: display Arabic names (برج خليفة, مارينا دبي, نخلة جميرا)
- [ ] Contact form: all labels in Arabic when RTL is active
- [ ] Footer: Arabic company name and legal text

---

### 8.8 — Testing RTL

- [ ] Visual regression: screenshot every major page at 1440px RTL vs LTR
- [ ] Mobile RTL: test at 375px in RTL — ensure no overflow
- [ ] Form inputs: `text-align: right` for Arabic input
- [ ] Tables: column headers and cell text align correctly in RTL

---

## Definition of Done — Phase 8

- [ ] All user-facing strings in `en` key have matching `ar` translations
- [ ] Switching to Arabic via language selector flips the full UI to RTL in < 1s
- [ ] Arabic font (Tajawal or equivalent) loads correctly
- [ ] All numbers, dates, and currencies format correctly per Arabic locale
- [ ] No text overflow, broken layouts, or mixed LTR/RTL text in any page
- [ ] WhatsApp bot (Nina) responds in Arabic when Arabic message is detected
- [ ] Tests pass: `npx vitest run`
- [ ] Build passes: `npm run build`

---

## Next Phase After This

Once Phase 8 is complete, move to **[PHASE_9_RBAC.md](./PHASE_9_RBAC.md)** — Multi-User CRM & Full RBAC.
