# ADR-001: Design System Gold Rebrand

**Status:** Accepted  
**Date:** March 29, 2026  
**Decision Makers:** White Caves Development Team  

---

## Context

White Caves Real Estate platform previously used a red (#D32F2F) primary brand color inherited from early development. As the platform matures toward production deployment as Dubai's premier luxury real estate platform, the visual identity needs to convey luxury, trust, and premium positioning.

### Problems with Red Primary
1. Red conveys urgency/danger rather than luxury/prestige
2. Conflicts with error/danger semantic colors (both red)
3. Does not align with Dubai luxury real estate market expectations
4. Creates visual confusion in admin dashboards where red = errors

### Dubai Market Context
- Luxury real estate brands in Dubai favor gold, navy, emerald, and charcoal palettes
- Gold symbolizes prestige, wealth, and premium service in the regional market
- International buyers (Indian, British, Russian, Chinese demographics) associate gold with luxury

---

## Decision

**Rebrand the entire design system from Red (#D32F2F) to Gold (#D4AF37) as the primary brand color.**

### Color Mapping
| Purpose | Old (Red) | New (Gold) |
|---------|-----------|-----------|
| Primary brand | #D32F2F | #D4AF37 |
| Primary dark | #B71C1C | #B8860B |
| Primary light | #FFEBEE | #FFF8E1 |
| Primary gradient | #D32F2F → #B71C1C | #D4AF37 → #B8860B |
| Secondary | #1976D2 (blue) | #2E5A4F (emerald) |
| Accent - sand | — | #F5E6D3 |
| Accent - charcoal | — | #2C2C2C |
| Error/danger | #C62828 | #D32F2F (unchanged, now distinct from primary) |

### Typography Change
| Purpose | Old | New |
|---------|-----|-----|
| Heading font | Montserrat | Poppins |
| Body font | Open Sans / Inter | Inter (standardized) |
| Mono font | Courier New | JetBrains Mono |

### Font Loading
- Google Fonts CDN via `<link>` in index.html
- Poppins: weights 500, 600, 700, 800
- Inter: weights 400, 500, 600, 700
- `font-display: swap` for performance

---

## Consequences

### Positive
1. **Clear brand identity:** Gold conveys luxury and premium positioning
2. **Error disambiguation:** Red is now exclusively for errors/warnings, eliminating confusion
3. **Market alignment:** Matches Dubai luxury real estate standards
4. **Visual hierarchy:** Gold primary + emerald secondary creates sophisticated palette
5. **Accessibility:** Better contrast ratios with gold on dark backgrounds
6. **Professional typography:** Poppins provides cleaner hierarchy than Montserrat

### Negative
1. **One-time migration effort:** 70+ file changes across TypeScript and CSS
2. **Test updates:** Theme mocks in test files need updating
3. **Screenshot regression:** All visual regression tests need re-baselining
4. **Cached styles:** Users with cached CSS may see mixed colors temporarily

### Risks
1. **Incomplete migration:** Some hardcoded red values may remain in less-visited components
   - **Mitigation:** Grep audit for remaining `#D32F2F` / `#B71C1C` references
2. **Third-party component styling:** Some external libraries may use inherited primary colors
   - **Mitigation:** Verify all design-system components render correctly
3. **Accessibility regression:** Gold on white may fail contrast checks
   - **Mitigation:** Use `primary.700` (#B8860B) minimum for text on white backgrounds

---

## Files Modified

### Core Design Tokens
- `src/styles/brand-tokens.ts`
- `src/styles/theme/colors.ts`
- `src/styles/theme/typography.ts`
- `src/styles/color-palette.css`
- `src/styles/theme.css`

### Layout Components
- `src/components/layout/SidebarContainer/styles.ts`
- `src/components/layout/SidebarContainer/SidebarContainer.tsx`
- `src/components/layout/AIAssistantsPanel/styles.ts`

### Page Components
- `src/components/admin/AdminDashboard.styles.ts`
- `src/components/ContactForm.styles.ts`
- `src/components/Breadcrumb.styles.ts`
- `src/components/OnboardingGateway.styles.ts`
- `src/components/homepage/Features/Features.tsx`
- `src/components/crm/HazelFrontendCRM_NEW/data/frontend.ts`

### Configuration
- `index.html` (theme-color, font loading, critical CSS)

### Test Files
- `src/components/UnifiedNavbar/*.test.tsx`
- `src/components/design-system/*.test.tsx`

---

## Verification Checklist
- [ ] `npm run build` succeeds with 0 errors
- [ ] All existing tests pass (no color-related regressions)
- [ ] Lighthouse Accessibility score ≥ 90
- [ ] Visual review: all pages show gold primary, no red remnants
- [ ] Dark mode: gold renders correctly on dark backgrounds
- [ ] Mobile: gold elements visible and accessible on small screens
