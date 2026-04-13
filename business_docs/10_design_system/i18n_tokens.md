# Internationalization (i18n) Design Tokens & RTL Specifications

> **Last Updated**: April 14, 2026  
> **Purpose**: Design system tokens and rules for multi-language support (English + Arabic)  
> **Status**: Planned (Phase 1)

---

## Language Configuration

### Supported Languages
| Language | Code | Direction | Font | Status |
|----------|------|----------|------|--------|
| **English** | `en` | LTR | Inter, system-ui | ✅ Active |
| **Arabic** | `ar` | RTL | Noto Sans Arabic, Tahoma | 🔜 Planned |
| **French** | `fr` | LTR | Inter, system-ui | 📋 Future |
| **Russian** | `ru` | LTR | Inter, system-ui | 📋 Future |
| **Chinese (Simplified)** | `zh` | LTR | Noto Sans SC | 📋 Future |

### Dubai Market Priority
Arabic is the primary language for 40-50% of Dubai real estate buyers/renters. Phase 1 focuses on **English + Arabic** with full RTL support.

---

## Typography Tokens (Bilingual)

```typescript
export const i18nTokens = {
  fonts: {
    en: {
      primary: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
      heading: "'Inter', 'Segoe UI', sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace",
    },
    ar: {
      primary: "'Noto Sans Arabic', 'Tahoma', 'Arial', sans-serif",
      heading: "'Noto Sans Arabic', 'Tahoma', sans-serif",
      mono: "'JetBrains Mono', monospace", // Arabic doesn't have mono variant
    },
  },

  // Arabic text needs slightly different sizing for readability
  fontSizeAdjust: {
    ar: {
      body: '1.05em',      // 5% larger for Arabic readability
      heading: '1.0em',    // Same size for headings
      caption: '1.1em',    // 10% larger for small text
      button: '1.05em',    // Slightly larger for touch targets
    },
  },

  // Line height adjustments (Arabic glyphs are taller)
  lineHeight: {
    en: { body: 1.5, heading: 1.2, tight: 1.25 },
    ar: { body: 1.7, heading: 1.4, tight: 1.4 }, // Increased for Arabic
  },

  // Letter spacing (Arabic uses natural spacing)
  letterSpacing: {
    en: { tight: '-0.02em', normal: '0', wide: '0.05em', caps: '0.1em' },
    ar: { tight: '0', normal: '0', wide: '0', caps: '0' }, // No letter-spacing for Arabic
  },
} as const;
```

---

## RTL (Right-to-Left) Layout Tokens

### CSS Logical Properties Mapping
```typescript
export const rtlTokens = {
  // Instead of directional properties, use logical equivalents
  mapping: {
    // ❌ Don't use          // ✅ Use instead
    'margin-left':          'margin-inline-start',
    'margin-right':         'margin-inline-end',
    'padding-left':         'padding-inline-start',
    'padding-right':        'padding-inline-end',
    'border-left':          'border-inline-start',
    'border-right':         'border-inline-end',
    'text-align: left':     'text-align: start',
    'text-align: right':    'text-align: end',
    'float: left':          'float: inline-start',
    'float: right':         'float: inline-end',
    'left':                 'inset-inline-start',
    'right':                'inset-inline-end',
  },

  // Flex direction flips automatically with dir="rtl"
  // Grid layout flips automatically with dir="rtl"

  // Items that DON'T flip in RTL
  exceptions: [
    'phone numbers',          // Always LTR: +971 50 123 4567
    'email addresses',        // Always LTR: user@email.com
    'code blocks',            // Always LTR
    'URLs',                   // Always LTR
    'credit card numbers',    // Always LTR
    'dates (numeric)',        // Always LTR: 14/04/2026
    'mathematical formulas',  // Always LTR
    'brand name "White Caves"', // Always LTR (English brand)
  ],
} as const;
```

### RTL-Aware Spacing
```typescript
export const rtlSpacing = {
  // Sidebar
  sidebar: {
    position: 'inset-inline-start', // Left in LTR, Right in RTL
    iconRailWidth: '64px',
    flyoutWidth: '240px',
  },

  // Navigation
  nav: {
    backArrow: 'inline-start',  // ← in LTR, → in RTL
    forwardArrow: 'inline-end', // → in LTR, ← in RTL
    breadcrumbSeparator: '/',   // Keep as-is (neutral character)
  },

  // Cards
  card: {
    imageSide: 'inline-start',
    contentSide: 'inline-end',
    actionsSide: 'inline-end',
  },

  // Form layout
  form: {
    labelPosition: 'block-start',  // Top (same in LTR/RTL)
    errorPosition: 'block-end',    // Bottom (same in LTR/RTL)
    iconPosition: 'inline-end',    // Right in LTR, Left in RTL
  },
} as const;
```

---

## Component RTL Behavior

### Components That Auto-Flip
| Component | RTL Behavior |
|-----------|-------------|
| Sidebar | Moves to right side |
| Breadcrumbs | Direction reverses |
| Navigation arrows | `←` becomes `→` |
| Card layouts | Image/content sides flip |
| Form fields | Input alignment flips |
| Tables | Column order stays (data is neutral) |
| Modals | Close button moves to left |
| Dropdowns | Anchor to inline-end |
| Tooltips | Position flips |
| Progress bars | Fill from right |

### Components That Stay Fixed
| Component | Reason |
|-----------|--------|
| Phone number inputs | Always LTR (+971 format) |
| Email inputs | Always LTR |
| Code editors | Always LTR |
| Maps | Geographic, not directional |
| Charts/graphs | Mathematical convention |
| Image galleries | Visual, not text-based |
| Video players | Universal controls |

---

## Implementation Guide

### 1. HTML Setup
```html
<!-- Root element gets dir attribute -->
<html lang="en" dir="ltr">  <!-- or lang="ar" dir="rtl" -->
```

### 2. CSS Strategy
```css
/* Use CSS logical properties everywhere */
.card {
  margin-inline-start: 16px;  /* Not margin-left */
  padding-inline-end: 24px;   /* Not padding-right */
  border-inline-start: 3px solid var(--color-primary); /* Not border-left */
  text-align: start;           /* Not text-align: left */
}

/* For complex transforms, use :dir() pseudo-class */
.icon-arrow {
  transform: rotate(0deg);
}
.icon-arrow:dir(rtl) {
  transform: rotate(180deg);
}
```

### 3. Styled-Components RTL Helper
```typescript
// src/styles/rtl.ts
import { css } from 'styled-components';

export const rtl = (ltrStyles: string, rtlStyles: string) => css`
  ${ltrStyles}
  [dir='rtl'] & {
    ${rtlStyles}
  }
`;

// Usage:
const StyledCard = styled.div`
  ${rtl(
    'border-left: 3px solid var(--color-primary);',
    'border-right: 3px solid var(--color-primary); border-left: none;'
  )}
`;
```

### 4. react-i18next Setup
```typescript
// src/i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import ar from './locales/ar.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, ar: { translation: ar } },
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

// Auto-set dir attribute on language change
i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
});
```

---

## Translation File Structure

```
src/i18n/
├── config.ts                  # i18n initialization
├── locales/
│   ├── en.json               # English (complete)
│   └── ar.json               # Arabic (Phase 1)
└── hooks/
    └── useDirection.ts        # RTL-aware hook
```

### Key Translation Categories
```json
{
  "common": { "save": "حفظ", "cancel": "إلغاء", "delete": "حذف" },
  "nav": { "dashboard": "لوحة القيادة", "properties": "العقارات" },
  "property": { "bedrooms": "غرف نوم", "bathrooms": "حمامات", "price": "السعر" },
  "crm": { "leads": "العملاء المحتملون", "pipeline": "خط الأنابيب" },
  "auth": { "login": "تسجيل الدخول", "register": "التسجيل" },
  "forms": { "required": "هذا الحقل مطلوب", "invalid_email": "بريد إلكتروني غير صالح" },
  "errors": { "not_found": "الصفحة غير موجودة", "server_error": "خطأ في الخادم" }
}
```

---

## Testing RTL

### Visual Regression Tests
```typescript
// playwright test
test('Arabic RTL layout renders correctly', async ({ page }) => {
  await page.goto('/dashboard?lng=ar');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('.sidebar')).toHaveCSS('right', '0px');
  await expect(page.locator('.sidebar')).not.toHaveCSS('left', '0px');
});
```

### Checklist for RTL Verification
- [ ] Sidebar appears on right side
- [ ] Text is right-aligned
- [ ] Breadcrumbs read right-to-left
- [ ] Navigation arrows are flipped
- [ ] Phone numbers remain LTR
- [ ] Email addresses remain LTR
- [ ] Charts/graphs are unchanged
- [ ] Modal close button is on left
- [ ] Dropdown menus anchor correctly
- [ ] Scroll direction is correct
- [ ] Arabic font renders cleanly at all sizes
