# RTL & Internationalization Guidelines

Comprehensive RTL (Right-to-Left) and internationalization (i18n) standards for the White Caves Real Estate platform — supporting English and Arabic across the Dubai and UAE market.

> Last Updated: April 2026

---

## Table of Contents

1. [Arabic Language Support Strategy](#1-arabic-language-support-strategy)
2. [RTL Layout Mirroring Rules](#2-rtl-layout-mirroring-rules)
3. [Bidirectional Text Handling](#3-bidirectional-text-handling)
4. [Date, Time & Currency Formatting](#4-date-time--currency-formatting)
5. [Translation Workflow](#5-translation-workflow)
6. [Font Selection for Arabic](#6-font-selection-for-arabic)
7. [Number Formatting](#7-number-formatting)
8. [Direction-Aware Component Patterns](#8-direction-aware-component-patterns)
9. [Testing RTL Layouts](#9-testing-rtl-layouts)
10. [i18n Library Integration](#10-i18n-library-integration)

---

## 1. Arabic Language Support Strategy

### Language Priority

| Language | Code | Direction | Priority | Coverage |
|----------|------|-----------|----------|----------|
| English | `en` | LTR | Primary | 100% of content |
| Arabic | `ar` | RTL | Secondary | 100% of UI, 80% of content |

### Content Localization Tiers

| Tier | Content Type | Arabic Translation | Approach |
|------|-------------|-------------------|----------|
| **Tier 1** — Critical | UI labels, navigation, CTAs, error messages | 100% | Professional translation |
| **Tier 2** — Important | Property descriptions, area guides, FAQs | 80% | Professional + AI-assisted |
| **Tier 3** — Nice-to-have | Blog posts, market reports, legal docs | 50% | AI-assisted + human review |
| **Tier 4** — Low priority | Internal admin, developer docs | 0% | English only |

### Arabic Dialect

White Caves uses **Modern Standard Arabic (MSA / فصحى)** for all platform content, as it is universally understood across the UAE's diverse Arabic-speaking population (Emirati, Levantine, Egyptian, North African communities).

### Language Switching Behavior

| Scenario | Behavior |
|----------|----------|
| User selects Arabic | Full page re-renders in RTL with Arabic content |
| No Arabic translation available | Fall back to English with Arabic UI chrome |
| User preference persistence | Stored in `localStorage` + user profile (if authenticated) |
| SEO crawlers | Separate URLs with `hreflang` tags (`/en/`, `/ar/`) |
| Default language | English (auto-detect from browser `Accept-Language` header) |

```html
<!-- Hreflang implementation -->
<link rel="alternate" hreflang="en" href="https://whitecaves.ae/en/properties" />
<link rel="alternate" hreflang="ar" href="https://whitecaves.ae/ar/properties" />
<link rel="alternate" hreflang="x-default" href="https://whitecaves.ae/en/properties" />
```

---

## 2. RTL Layout Mirroring Rules

### What Gets Mirrored

| Element | LTR | RTL | Mirror? |
|---------|-----|-----|---------|
| Text alignment | Left | Right | ✅ Yes |
| Navigation order | Left → Right | Right → Left | ✅ Yes |
| Sidebar position | Left | Right | ✅ Yes |
| Form label position | Left of input | Right of input | ✅ Yes |
| Breadcrumbs | Home > Area > Property | Home < Area < Property | ✅ Yes |
| Progress indicators | Left → Right | Right → Left | ✅ Yes |
| Back/Forward icons | ← Back, Forward → | Back →, ← Forward | ✅ Yes |
| Checkmarks / icons | ✅ No change | ✅ No change | ❌ No |
| Logos / branding | Fixed | Fixed | ❌ No |
| Media playback controls | ▶ Play, ⏸ Pause | ▶ Play, ⏸ Pause | ❌ No |
| Phone numbers | +971 4 XXX XXXX | +971 4 XXX XXXX | ❌ No (always LTR) |
| Maps | Fixed orientation | Fixed orientation | ❌ No |
| Charts (time-based) | Left → Right (time) | Left → Right (time) | ❌ No |
| Sliders | Min left, Max right | Min right, Max left | ✅ Yes |

### CSS Logical Properties

**Always use logical properties instead of physical properties** for automatic RTL support.

| Physical (❌ Avoid) | Logical (✅ Use) |
|---------------------|-----------------|
| `margin-left` | `margin-inline-start` |
| `margin-right` | `margin-inline-end` |
| `padding-left` | `padding-inline-start` |
| `padding-right` | `padding-inline-end` |
| `text-align: left` | `text-align: start` |
| `text-align: right` | `text-align: end` |
| `float: left` | `float: inline-start` |
| `float: right` | `float: inline-end` |
| `border-left` | `border-inline-start` |
| `border-right` | `border-inline-end` |
| `left: 0` | `inset-inline-start: 0` |
| `right: 0` | `inset-inline-end: 0` |

### Tailwind CSS RTL Support

```jsx
/* Using Tailwind's RTL modifiers */
<div className="ml-4 rtl:mr-4 rtl:ml-0">
  Content with direction-aware margin
</div>

/* Better: Use logical utilities (Tailwind v3.3+) */
<div className="ms-4">
  Content with logical margin-start
</div>

/* Icon that flips in RTL */
<ChevronIcon className="rtl:rotate-180" />
```

### Layout Grid Mirroring

```css
/* Grid that automatically mirrors in RTL */
.property-grid {
  display: grid;
  grid-template-columns: 250px 1fr 300px; /* sidebar | main | aside */
  /* Automatically mirrors in RTL: aside | main | sidebar */
  direction: inherit;
}

/* Flexbox — inherits direction */
.nav-items {
  display: flex;
  gap: 1rem;
  /* Items flow LTR or RTL based on document direction */
}
```

---

## 3. Bidirectional Text Handling

### Mixed Content (BiDi) Rules

| Scenario | Approach | Example |
|----------|----------|---------|
| Arabic sentence with English brand name | Auto BiDi | "مرحبا بكم في White Caves" |
| English sentence with Arabic location | `<span dir="rtl">` | "Located in <span dir='rtl'>دبي مارينا</span>" |
| Property reference number | Always LTR | `<span dir="ltr">WC-2026-001</span>` |
| Phone numbers | Always LTR | `<span dir="ltr">+971 4 567 8900</span>` |
| URLs and emails | Always LTR | `<span dir="ltr">info@whitecaves.ae</span>` |
| Prices | Always LTR numerals | `<span dir="ltr">AED 1,800,000</span>` |

### Unicode BiDi Algorithm Helpers

```css
/* Isolate a segment to prevent BiDi reordering */
.bidi-isolate {
  unicode-bidi: isolate;
}

/* Override direction for specific content */
.force-ltr {
  direction: ltr;
  unicode-bidi: embed;
}

.force-rtl {
  direction: rtl;
  unicode-bidi: embed;
}
```

### React Component for BiDi Content

```jsx
function BiDiText({ children, direction = 'auto' }) {
  return (
    <span dir={direction} style={{ unicodeBidi: 'isolate' }}>
      {children}
    </span>
  );
}

// Usage
<p>
  Contact us at <BiDiText direction="ltr">+971 4 567 8900</BiDiText> for more info.
</p>
```

### Punctuation in BiDi Text

| Character | Arabic Context | English Context |
|-----------|---------------|----------------|
| Period (.) | Full stop at end of RTL text | Same |
| Comma | ، (Arabic comma U+060C) | , (Western comma) |
| Question mark | ؟ (Arabic U+061F) | ? (Western) |
| Parentheses | Visually mirrored by BiDi algorithm | Normal |
| Quotation marks | « » (guillemets) or " " | " " or ' ' |
| Semicolon | ؛ (Arabic U+061B) | ; (Western) |

---

## 4. Date, Time & Currency Formatting

### Date Formats

| Context | English | Arabic |
|---------|---------|--------|
| Full date | April 15, 2026 | ١٥ أبريل ٢٠٢٦ |
| Short date | 15 Apr 2026 | ١٥ أبر ٢٠٢٦ |
| Numeric date | 15/04/2026 (DD/MM/YYYY) | ١٥/٠٤/٢٠٢٦ |
| Relative date | 3 days ago | منذ ٣ أيام |
| Date range | 15 Apr – 30 Apr 2026 | ١٥ أبر – ٣٠ أبر ٢٠٢٦ |

**Important**: Always use DD/MM/YYYY format (UAE standard). Never use MM/DD/YYYY.

### Time Formats

| Context | English | Arabic |
|---------|---------|--------|
| 12-hour | 3:30 PM | ٣:٣٠ م |
| 24-hour | 15:30 | ١٥:٣٠ |
| Timezone | GST (UTC+4) | بتوقيت الخليج (UTC+4) |

### Currency Formatting

| Currency | English Format | Arabic Format | Code |
|----------|---------------|---------------|------|
| UAE Dirham | AED 1,800,000 | ١٬٨٠٠٬٠٠٠ د.إ | AED |
| US Dollar | USD 490,000 | ٤٩٠٬٠٠٠ $ | USD |
| Euro | EUR 450,000 | ٤٥٠٬٠٠٠ € | EUR |
| British Pound | GBP 380,000 | ٣٨٠٬٠٠٠ £ | GBP |

### Implementation with Intl API

```jsx
// Currency formatting
function formatCurrency(amount, currency = 'AED', locale) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

formatCurrency(1800000, 'AED', 'en-AE'); // "AED 1,800,000"
formatCurrency(1800000, 'AED', 'ar-AE'); // "١٬٨٠٠٬٠٠٠ د.إ."

// Date formatting
function formatDate(date, locale, options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(date);
}

formatDate(new Date('2026-04-15'), 'en-AE'); // "15 April 2026"
formatDate(new Date('2026-04-15'), 'ar-AE'); // "١٥ أبريل ٢٠٢٦"

// Relative time
const rtf = new Intl.RelativeTimeFormat('ar', { numeric: 'auto' });
rtf.format(-3, 'day'); // "منذ ٣ أيام"
```

---

## 5. Translation Workflow

### Workflow Overview

```
English Content    →    Translation    →    Review    →    QA    →    Deploy
     │                      │                 │           │           │
  Source text         Professional       Native speaker  Visual    Merged to
  in codebase        translator or      review for     check in   locales/
  (en.json)          AI + human edit    accuracy       context    (ar.json)
```

### Translation File Structure

```
src/
  locales/
    en/
      common.json       # Shared UI strings
      properties.json   # Property-related strings
      forms.json        # Form labels, validation messages
      navigation.json   # Nav items, breadcrumbs
      errors.json       # Error messages
    ar/
      common.json
      properties.json
      forms.json
      navigation.json
      errors.json
```

### Translation Key Naming Convention

```json
// en/properties.json
{
  "properties.search.title": "Find Your Dream Property",
  "properties.search.placeholder": "Search by location, community, or building...",
  "properties.card.bedrooms": "{{count}} Bedroom",
  "properties.card.bedrooms_plural": "{{count}} Bedrooms",
  "properties.card.price": "AED {{price}}",
  "properties.card.perYear": "/year",
  "properties.filters.propertyType": "Property Type",
  "properties.filters.priceRange": "Price Range",
  "properties.filters.bedrooms": "Bedrooms",
  "properties.detail.description": "Description",
  "properties.detail.features": "Features & Amenities",
  "properties.detail.location": "Location",
  "properties.detail.contactAgent": "Contact Agent"
}
```

```json
// ar/properties.json
{
  "properties.search.title": "ابحث عن عقارك المثالي",
  "properties.search.placeholder": "ابحث حسب الموقع أو المجمع أو المبنى...",
  "properties.card.bedrooms": "غرفة نوم {{count}}",
  "properties.card.bedrooms_plural": "{{count}} غرف نوم",
  "properties.card.price": "{{price}} د.إ",
  "properties.card.perYear": "/سنوياً",
  "properties.filters.propertyType": "نوع العقار",
  "properties.filters.priceRange": "نطاق السعر",
  "properties.filters.bedrooms": "غرف النوم",
  "properties.detail.description": "الوصف",
  "properties.detail.features": "المميزات والمرافق",
  "properties.detail.location": "الموقع",
  "properties.detail.contactAgent": "تواصل مع الوكيل"
}
```

### Translation Quality Gates

| Check | Tool | Threshold |
|-------|------|-----------|
| Missing keys | `i18next-parser` | 0 missing keys in `ar/` |
| Unused keys | `i18next-parser` | 0 unused keys |
| Placeholder consistency | Custom linter | All `{{var}}` present in both languages |
| Max string length | Custom rule | Arabic ≤ 130% of English length |
| Profanity filter | Automated scan | Zero matches |

---

## 6. Font Selection for Arabic

### Font Stack

| Usage | English Font | Arabic Font | Fallback |
|-------|-------------|-------------|----------|
| Headings | Poppins | Cairo | sans-serif |
| Body text | Inter | Noto Sans Arabic | sans-serif |
| Monospace | JetBrains Mono | Noto Sans Arabic | monospace |
| Price / numbers | Inter Tight | Noto Sans Arabic | sans-serif |

### Font Loading Strategy

```css
/* Arabic font declarations */
@font-face {
  font-family: 'Cairo';
  src: url('/fonts/Cairo-Variable.woff2') format('woff2');
  font-weight: 200 1000;
  font-display: swap;
  unicode-range: U+0600-06FF, U+0750-077F, U+FB50-FDFF, U+FE70-FEFF;
}

@font-face {
  font-family: 'Noto Sans Arabic';
  src: url('/fonts/NotoSansArabic-Variable.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
  unicode-range: U+0600-06FF, U+0750-077F, U+FB50-FDFF, U+FE70-FEFF;
}

/* Direction-aware font stack */
:root {
  --font-heading: 'Poppins', sans-serif;
  --font-body: 'Inter', sans-serif;
}

[dir="rtl"] {
  --font-heading: 'Cairo', 'Poppins', sans-serif;
  --font-body: 'Noto Sans Arabic', 'Inter', sans-serif;
}

body {
  font-family: var(--font-body);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
}
```

### Arabic Typography Adjustments

| Property | English | Arabic | Reason |
|----------|---------|--------|--------|
| Line height | 1.5 | 1.8 | Arabic diacritics need more vertical space |
| Letter spacing | 0 – 0.02em | 0 | Arabic is cursive, no extra spacing |
| Font weight (body) | 400 | 400 | Same weight works for both |
| Font weight (heading) | 600–700 | 700 | Arabic benefits from slightly bolder headings |
| Font size (body) | 16px | 16px | Same base size |
| Font size (small text) | 14px | 15px | Arabic is slightly less legible at small sizes |

```css
[dir="rtl"] {
  line-height: 1.8;
  letter-spacing: 0;
}

[dir="rtl"] h1, [dir="rtl"] h2, [dir="rtl"] h3 {
  font-weight: 700;
}

[dir="rtl"] .text-sm {
  font-size: 0.9375rem; /* 15px instead of 14px */
}
```

---

## 7. Number Formatting

### Arabic-Indic Numerals

White Caves supports both Western Arabic numerals (0-9) and Arabic-Indic numerals (٠-٩).

| Western | Arabic-Indic | Unicode |
|---------|-------------|---------|
| 0 | ٠ | U+0660 |
| 1 | ١ | U+0661 |
| 2 | ٢ | U+0662 |
| 3 | ٣ | U+0663 |
| 4 | ٤ | U+0664 |
| 5 | ٥ | U+0665 |
| 6 | ٦ | U+0666 |
| 7 | ٧ | U+0667 |
| 8 | ٨ | U+0668 |
| 9 | ٩ | U+0669 |

### Default Behavior

| Context | Numeral System | Rationale |
|---------|---------------|-----------|
| Arabic UI (default) | Arabic-Indic (٠-٩) | Native to Arabic locale |
| Arabic UI (user pref) | Western (0-9) | Some users prefer Western numerals |
| English UI | Western (0-9) | Standard |
| Reference numbers | Always Western | WC-2026-001 (universal clarity) |
| Phone numbers | Always Western | +971 50 123 4567 |
| Technical content | Always Western | API responses, code |

### Implementation

```jsx
function formatNumber(value, locale = 'en') {
  if (locale === 'ar') {
    return new Intl.NumberFormat('ar-AE', {
      useGrouping: true,
    }).format(value);
  }
  return new Intl.NumberFormat('en-AE', {
    useGrouping: true,
  }).format(value);
}

formatNumber(1800000, 'en'); // "1,800,000"
formatNumber(1800000, 'ar'); // "١٬٨٠٠٬٠٠٠"

// Percentage
function formatPercent(value, locale = 'en') {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 1,
  }).format(value / 100);
}

formatPercent(7.5, 'en'); // "7.5%"
formatPercent(7.5, 'ar'); // "٧٫٥٪"

// Area (sqft)
function formatArea(sqft, locale = 'en') {
  const formatted = new Intl.NumberFormat(locale).format(sqft);
  const unit = locale === 'ar' ? 'قدم مربع' : 'sq ft';
  return `${formatted} ${unit}`;
}

formatArea(1250, 'en'); // "1,250 sq ft"
formatArea(1250, 'ar'); // "١٬٢٥٠ قدم مربع"
```

### Grouping Separators

| Locale | Thousands Separator | Decimal Separator | Example |
|--------|-------------------|-------------------|---------|
| `en-AE` | , (comma) | . (period) | 1,800,000.50 |
| `ar-AE` | ٬ (Arabic comma) | ٫ (Arabic decimal) | ١٬٨٠٠٬٠٠٠٫٥٠ |

---

## 8. Direction-Aware Component Patterns

### Property Card

```jsx
function PropertyCard({ property, locale }) {
  const { t } = useTranslation();
  const isRTL = locale === 'ar';

  return (
    <article
      dir={isRTL ? 'rtl' : 'ltr'}
      className="flex flex-col rounded-xl overflow-hidden shadow-luxury"
    >
      <img
        src={property.image}
        alt={isRTL ? property.titleAr : property.titleEn}
        loading="lazy"
      />
      <div className="p-4">
        <h3 className="text-lg font-heading">
          {isRTL ? property.titleAr : property.titleEn}
        </h3>
        <p className="text-sm text-muted">
          <MapPinIcon className="inline-block w-4 h-4 me-1" />
          {isRTL ? property.locationAr : property.locationEn}
        </p>
        <div className="flex items-center gap-4 mt-2">
          <span>{property.bedrooms} {t('properties.card.bedrooms')}</span>
          <span>{formatArea(property.area, locale)}</span>
        </div>
        <p className="mt-3 text-xl font-bold text-gold">
          <BiDiText direction="ltr">
            {formatCurrency(property.price, 'AED', locale)}
          </BiDiText>
        </p>
      </div>
    </article>
  );
}
```

### Search Component

```jsx
function PropertySearch({ locale }) {
  const { t } = useTranslation();
  const isRTL = locale === 'ar';

  return (
    <form dir={isRTL ? 'rtl' : 'ltr'} role="search" aria-label={t('properties.search.title')}>
      <input
        type="search"
        placeholder={t('properties.search.placeholder')}
        className="w-full ps-10 pe-4 py-3"
        /* ps/pe = padding-start/end (logical) */
      />
      <SearchIcon
        className="absolute top-1/2 -translate-y-1/2 start-3"
        /* start-3 = left in LTR, right in RTL */
      />
    </form>
  );
}
```

### Navigation Component

```jsx
function Breadcrumbs({ items, locale }) {
  const separator = locale === 'ar' ? '\\' : '/';

  return (
    <nav aria-label={locale === 'ar' ? 'مسار التنقل' : 'Breadcrumb'}>
      <ol className="flex items-center gap-2" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-2">
            {index > 0 && <span aria-hidden="true">{separator}</span>}
            {index === items.length - 1 ? (
              <span aria-current="page">{item.label}</span>
            ) : (
              <a href={item.href}>{item.label}</a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

### Table Component (Direction-Aware)

```jsx
function PropertyTable({ data, locale }) {
  return (
    <div dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-start">{/* Logical: aligns to start */}</th>
            <th className="text-end">{/* Logical: aligns to end */}</th>
          </tr>
        </thead>
        <tbody>
          {/* Table content automatically mirrors in RTL */}
        </tbody>
      </table>
    </div>
  );
}
```

---

## 9. Testing RTL Layouts

### Visual Testing Checklist

- [ ] Text aligns to the right in RTL mode
- [ ] Navigation flows from right to left
- [ ] Icons that indicate direction are mirrored (arrows, chevrons)
- [ ] Non-directional icons are NOT mirrored (checkmarks, phone, email)
- [ ] Sidebar appears on the right side
- [ ] Form labels appear to the right of inputs
- [ ] Scrollbar appears on the left side
- [ ] Progress bars fill from right to left
- [ ] Breadcrumbs read right to left
- [ ] No text overflow or truncation issues
- [ ] Images and media are NOT mirrored
- [ ] Phone numbers and reference IDs remain LTR
- [ ] Currency formatting is correct for Arabic locale
- [ ] No layout breaking at any breakpoint (320px–2560px)
- [ ] Mixed BiDi content renders correctly

### Automated Testing

```jsx
// Playwright E2E test for RTL
import { test, expect } from '@playwright/test';

test.describe('RTL Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ar/properties');
  });

  test('page direction is RTL', async ({ page }) => {
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'rtl');
    await expect(html).toHaveAttribute('lang', 'ar');
  });

  test('navigation is mirrored', async ({ page }) => {
    const nav = page.locator('nav[aria-label]');
    const navBox = await nav.boundingBox();
    const viewport = page.viewportSize();
    // Nav should be closer to the right edge in RTL
    expect(navBox.x + navBox.width).toBeGreaterThan(viewport.width * 0.5);
  });

  test('property cards render Arabic content', async ({ page }) => {
    const firstCard = page.locator('article').first();
    const text = await firstCard.textContent();
    // Should contain Arabic characters
    expect(text).toMatch(/[\u0600-\u06FF]/);
  });

  test('prices remain LTR', async ({ page }) => {
    const price = page.locator('[data-testid="property-price"]').first();
    const dir = await price.evaluate(el => getComputedStyle(el).direction);
    expect(dir).toBe('ltr');
  });
});
```

### Browser Testing Matrix

| Browser | LTR | RTL | BiDi | Priority |
|---------|-----|-----|------|----------|
| Chrome (latest) | ✅ | ✅ | ✅ | Critical |
| Safari (latest) | ✅ | ✅ | ✅ | Critical |
| Firefox (latest) | ✅ | ✅ | ✅ | High |
| Edge (latest) | ✅ | ✅ | ✅ | High |
| Chrome Mobile (Android) | ✅ | ✅ | ✅ | Critical |
| Safari Mobile (iOS) | ✅ | ✅ | ✅ | Critical |
| Samsung Internet | ✅ | ✅ | ✅ | Medium |

### Visual Regression Testing

```bash
# Capture screenshots in both directions
npx playwright test --project=chromium --update-snapshots

# Compare RTL vs LTR layouts
# Screenshots stored in: e2e/snapshots/{locale}/{component}.png
```

---

## 10. i18n Library Integration

### Technology Stack

| Library | Version | Purpose |
|---------|---------|---------|
| `react-i18next` | ^14.x | React i18n framework |
| `i18next` | ^23.x | Core i18n library |
| `i18next-http-backend` | ^2.x | Lazy-load translation files |
| `i18next-browser-languagedetector` | ^7.x | Auto-detect user language |

### Configuration

```jsx
// src/i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar'],

    ns: ['common', 'properties', 'forms', 'navigation', 'errors'],
    defaultNS: 'common',

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['path', 'localStorage', 'navigator'],
      lookupFromPathIndex: 0,
      caches: ['localStorage'],
    },

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    react: {
      useSuspense: true,
    },
  });

export default i18n;
```

### Usage in Components

```jsx
import { useTranslation } from 'react-i18next';

function PropertyFilters() {
  const { t, i18n } = useTranslation('properties');
  const isRTL = i18n.dir() === 'rtl';

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <h2>{t('filters.title')}</h2>

      {/* Pluralization */}
      <span>{t('card.bedrooms', { count: 3 })}</span>

      {/* Interpolation with formatting */}
      <span>{t('card.price', { price: formatCurrency(1800000, 'AED', i18n.language) })}</span>

      {/* Language switching */}
      <button onClick={() => i18n.changeLanguage(isRTL ? 'en' : 'ar')}>
        {isRTL ? 'English' : 'العربية'}
      </button>
    </div>
  );
}
```

### Direction Provider

```jsx
// src/providers/DirectionProvider.tsx
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export function DirectionProvider({ children }) {
  const { i18n } = useTranslation();
  const direction = i18n.dir();
  const language = i18n.language;

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;

    // Update font family for Arabic
    if (direction === 'rtl') {
      document.documentElement.classList.add('rtl');
      document.documentElement.classList.remove('ltr');
    } else {
      document.documentElement.classList.add('ltr');
      document.documentElement.classList.remove('rtl');
    }
  }, [direction, language]);

  return <>{children}</>;
}
```

### Server-Side Considerations

```jsx
// Detect language from URL path for SSR
function getLocaleFromPath(path) {
  const match = path.match(/^\/(en|ar)(\/|$)/);
  return match ? match[1] : 'en';
}

// Set HTML attributes for SSR
function getHtmlAttributes(locale) {
  return {
    lang: locale,
    dir: locale === 'ar' ? 'rtl' : 'ltr',
  };
}
```

---

## Quick Reference

| Task | Solution |
|------|----------|
| Add RTL margin | `margin-inline-start: 1rem` |
| Flip an icon in RTL | `className="rtl:rotate-180"` |
| Keep numbers LTR | `<span dir="ltr">` |
| Switch language | `i18n.changeLanguage('ar')` |
| Get current direction | `i18n.dir()` |
| Format currency | `Intl.NumberFormat(locale, { style: 'currency' })` |
| Arabic font | `Cairo` (headings), `Noto Sans Arabic` (body) |
| Test RTL | Chrome DevTools → Rendering → Emulate CSS `direction: rtl` |

---

*See also: [accessibility-guidelines.md](accessibility-guidelines.md) for WCAG 2.1 AA compliance in RTL contexts.*
