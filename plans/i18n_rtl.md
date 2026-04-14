# Internationalization & RTL Support

**Status**: Planned  
**Priority**: High (Dubai market = Arabic + English)  
**Estimated Effort**: 25 hours  
**Depends On**: Design tokens, typography system

---

## Objective

Full Arabic (RTL) and English (LTR) language support with seamless switching. Arabic is essential for the Dubai market — RERA communications, tenant contracts, and government portals all use Arabic.

---

## Success Criteria

- [ ] All UI text translatable via i18n keys (no hardcoded English strings)
- [ ] RTL layout mirrors correctly (sidebar on right, text alignment, icons)
- [ ] Date/number formatting: Arabic numerals (optional), locale-specific date formats
- [ ] Language persisted in localStorage and Redux
- [ ] URL-based language prefix: `/en/properties`, `/ar/properties`
- [ ] Fallback to English for untranslated keys
- [ ] Arabic typography: Noto Sans Arabic or IBM Plex Arabic

---

## Implementation Checklist

### Phase 1: i18n Infrastructure (10h)
- [ ] Install `react-i18next` + `i18next` + `i18next-browser-languagedetector`
- [ ] Create translation namespace structure:
  ```
  src/i18n/
  ├── config.ts          # i18next initialization
  ├── locales/
  │   ├── en/
  │   │   ├── common.json    # Shared (buttons, labels, navigation)
  │   │   ├── properties.json
  │   │   ├── leads.json
  │   │   ├── dashboard.json
  │   │   └── auth.json
  │   └── ar/
  │       ├── common.json
  │       ├── properties.json
  │       ├── leads.json
  │       ├── dashboard.json
  │       └── auth.json
  ```
- [ ] Create `useTranslation()` wrapper hook
- [ ] Add `LanguageSwitcher` component (TopBar integration)
- [ ] Configure i18next with browser detection + localStorage persistence

### Phase 2: RTL Layout (10h)
- [ ] Add `dir="rtl"` to `<html>` element when Arabic active
- [ ] Create RTL-aware design tokens:
  - [ ] `spacing.start` / `spacing.end` instead of `left` / `right`
  - [ ] `margin-inline-start` / `margin-inline-end` CSS logical properties
- [ ] Update styled-components to use CSS logical properties
- [ ] Mirror sidebar: SidebarContainer on right side in RTL
- [ ] Mirror icons: arrows, chevrons, navigation indicators
- [ ] Test: every page must be visually correct in both LTR and RTL

### Phase 3: Content Translation (5h)
- [ ] Translate all common.json keys to Arabic (professional translation)
- [ ] Property data: add `title_ar`, `description_ar` fields to Property model
- [ ] API: return localized fields based on `Accept-Language` header
- [ ] SEO: `hreflang` tags for Arabic and English versions
- [ ] Arabic typography token: add to `src/styles/tokens/typography.ts`

---

## Arabic Typography

```typescript
// Addition to typography.ts
export const arabicFonts = {
  primary: "'Noto Sans Arabic', 'IBM Plex Arabic', sans-serif",
  body: "'Noto Sans Arabic', 'IBM Plex Arabic', sans-serif",
  // Arabic needs slightly larger line-height for readability
  lineHeight: { body: 1.8, heading: 1.5 },
};
```

---

## Dubai Market Context

- Official government language: Arabic
- RERA/Ejari documents are bilingual (Arabic primary)
- 85%+ of Dubai's population are expats, but Arabic shows respect and professionalism
- Competitors: Bayut and Property Finder have full Arabic support — we must match this
