# Internationalization (i18n) Tokens & Configuration

> **Last Updated:** April 11, 2026
> **Purpose:** Define i18n token structure, locale configuration, and translation guidelines
> **Languages:** English (en), Arabic (ar), French (fr), Russian (ru), Chinese (zh)
> **Locales:** 7 (en-AE, ar-AE, en-US, en-GB, fr-FR, ru-RU, zh-CN)
> **Extends:** `/business_docs/10_design_system/rtl-internationalization.md`

---

## 1. Overview

White Caves serves a diverse international clientele in Dubai. The platform must support multiple languages with proper RTL layout for Arabic, locale-aware formatting for currencies/dates/numbers, and a scalable translation token system.

---

## 2. Supported Locales

| Locale  | Language             | Direction | Currency | Date Format | Number Format | Priority     |
| ------- | -------------------- | --------- | -------- | ----------- | ------------- | ------------ |
| `en-AE` | English (UAE)        | LTR       | AED      | DD/MM/YYYY  | 1,234,567.89  | P0 (primary) |
| `ar-AE` | Arabic (UAE)         | RTL       | د.إ      | DD/MM/YYYY  | ١٬٢٣٤٬٥٦٧٫٨٩  | P0 (primary) |
| `en-US` | English (US)         | LTR       | USD      | MM/DD/YYYY  | 1,234,567.89  | P1           |
| `en-GB` | English (UK)         | LTR       | GBP      | DD/MM/YYYY  | 1,234,567.89  | P1           |
| `fr-FR` | French               | LTR       | EUR      | DD/MM/YYYY  | 1 234 567,89  | P2           |
| `ru-RU` | Russian              | LTR       | USD      | DD.MM.YYYY  | 1 234 567,89  | P2           |
| `zh-CN` | Chinese (Simplified) | LTR       | CNY      | YYYY/MM/DD  | 1,234,567.89  | P2           |

---

## 3. Translation Token Structure

### 3.1 Namespace Organization

```
locales/
├── en/
│   ├── common.json         # Shared UI elements
│   ├── auth.json           # Authentication pages
│   ├── properties.json     # Property listings
│   ├── leads.json          # Lead management
│   ├── transactions.json   # Transaction workflows
│   ├── compliance.json     # RERA, Ejari, KYC
│   ├── dashboard.json      # Dashboard widgets
│   ├── navigation.json     # Menu and navigation
│   ├── forms.json          # Form labels and validation
│   ├── notifications.json  # Alerts and notifications
│   ├── errors.json         # Error messages
│   └── marketing.json      # Marketing features
├── ar/
│   └── (same structure)
└── ...
```

### 3.2 Token Naming Convention

```
{namespace}.{section}.{element}.{variant}

Examples:
  common.buttons.save          → "Save"
  common.buttons.cancel        → "Cancel"
  properties.search.placeholder → "Search by location, community, or building..."
  properties.detail.price      → "Price"
  properties.detail.beds       → "Bedrooms"
  leads.status.hot             → "Hot Lead"
  compliance.rera.permit_label → "RERA Permit Number"
  errors.validation.required   → "This field is required"
  errors.api.not_found         → "Resource not found"
```

### 3.3 Interpolation Patterns

```json
{
  "properties.search.results_count": "{{count}} properties found",
  "properties.search.results_count_zero": "No properties found",
  "properties.search.results_count_one": "1 property found",
  "properties.detail.price_formatted": "{{currency}} {{amount}}",
  "leads.assigned_to": "Assigned to {{agentName}}",
  "notifications.new_lead": "New lead from {{source}}: {{leadName}}",
  "compliance.permit_expires": "Permit expires on {{date}}"
}
```

---

## 4. Currency Formatting Tokens

### 4.1 Currency Display

| Token                | en-AE  | ar-AE | en-US  | en-GB  |
| -------------------- | ------ | ----- | ------ | ------ |
| `currency.symbol`    | AED    | د.إ   | $      | £      |
| `currency.code`      | AED    | AED   | USD    | GBP    |
| `currency.position`  | before | after | before | before |
| `currency.separator` | ,      | ٬     | ,      | ,      |
| `currency.decimal`   | .      | ٫     | .      | .      |

### 4.2 Price Formatting Examples

| Locale  | Format          | Example                                          |
| ------- | --------------- | ------------------------------------------------ |
| `en-AE` | `AED 1,500,000` | `formatCurrency(1500000, 'en-AE')`               |
| `ar-AE` | `١٬٥٠٠٬٠٠٠ د.إ` | `formatCurrency(1500000, 'ar-AE')`               |
| `en-US` | `$408,163`      | `formatCurrency(408163, 'en-US')` (auto-convert) |
| `en-GB` | `£326,086`      | `formatCurrency(326086, 'en-GB')` (auto-convert) |

### 4.3 Multi-Currency Support

```typescript
interface CurrencyConfig {
  code: string; // ISO 4217 code
  symbol: string; // Display symbol
  position: 'before' | 'after';
  decimals: number; // Decimal places
  exchangeRate: number; // Rate vs AED (base)
  lastUpdated: string; // ISO timestamp
}

const currencies: Record<string, CurrencyConfig> = {
  AED: {
    code: 'AED',
    symbol: 'AED',
    position: 'before',
    decimals: 0,
    exchangeRate: 1,
    lastUpdated: '',
  },
  USD: {
    code: 'USD',
    symbol: '$',
    position: 'before',
    decimals: 0,
    exchangeRate: 0.2722,
    lastUpdated: '',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    position: 'before',
    decimals: 0,
    exchangeRate: 0.2174,
    lastUpdated: '',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    position: 'before',
    decimals: 0,
    exchangeRate: 0.2513,
    lastUpdated: '',
  },
};
```

---

## 5. Date & Time Formatting

| Token           | en-AE          | ar-AE         | en-US          |
| --------------- | -------------- | ------------- | -------------- |
| `date.short`    | 11/04/2026     | ١١/٠٤/٢٠٢٦    | 04/11/2026     |
| `date.long`     | 11 April 2026  | ١١ أبريل ٢٠٢٦ | April 11, 2026 |
| `date.relative` | 2 hours ago    | منذ ساعتين    | 2 hours ago    |
| `time.short`    | 2:30 PM        | ٢:٣٠ م        | 2:30 PM        |
| `time.long`     | 2:30:00 PM GST | ٢:٣٠:٠٠ م ت.خ | 2:30:00 PM GST |

---

## 6. RTL-Specific Design Tokens

```css
/* RTL Layout Tokens */
--layout-direction: rtl; /* ltr for English */
--layout-start: right; /* left for English */
--layout-end: left; /* right for English */
--sidebar-position: right; /* left for English */
--text-align: right; /* left for English */
--icon-flip: scaleX(-1); /* scaleX(1) for English */
--border-start: border-right; /* border-left for English */
--border-end: border-left; /* border-right for English */
--margin-start: margin-right; /* margin-left for English */
--margin-end: margin-left; /* margin-right for English */
--padding-start: padding-right; /* padding-left for English */
--padding-end: padding-left; /* padding-right for English */
```

---

## 7. Property-Specific Tokens

### 7.1 Property Types

| Token                     | en        | ar        |
| ------------------------- | --------- | --------- |
| `property.type.apartment` | Apartment | شقة       |
| `property.type.villa`     | Villa     | فيلا      |
| `property.type.townhouse` | Townhouse | تاون هاوس |
| `property.type.penthouse` | Penthouse | بنتهاوس   |
| `property.type.studio`    | Studio    | استوديو   |
| `property.type.duplex`    | Duplex    | دوبلكس    |
| `property.type.land`      | Land      | أرض       |
| `property.type.office`    | Office    | مكتب      |
| `property.type.warehouse` | Warehouse | مستودع    |
| `property.type.retail`    | Retail    | محل تجاري |

### 7.2 Property Status

| Token                         | en          | ar          |
| ----------------------------- | ----------- | ----------- |
| `property.status.available`   | Available   | متاح        |
| `property.status.sold`        | Sold        | مباع        |
| `property.status.rented`      | Rented      | مؤجر        |
| `property.status.off_plan`    | Off-Plan    | على الخارطة |
| `property.status.under_offer` | Under Offer | تحت العرض   |

### 7.3 Amenities

| Token                  | en            | ar                  |
| ---------------------- | ------------- | ------------------- |
| `amenity.pool`         | Swimming Pool | مسبح                |
| `amenity.gym`          | Gym           | صالة رياضية         |
| `amenity.parking`      | Parking       | موقف سيارات         |
| `amenity.balcony`      | Balcony       | شرفة                |
| `amenity.garden`       | Garden        | حديقة               |
| `amenity.security`     | 24/7 Security | أمن على مدار الساعة |
| `amenity.concierge`    | Concierge     | خدمة الكونسيرج      |
| `amenity.beach_access` | Beach Access  | وصول للشاطئ         |
| `amenity.sea_view`     | Sea View      | إطلالة بحرية        |
| `amenity.city_view`    | City View     | إطلالة على المدينة  |

---

## 8. Area Names (Dubai Communities)

| Token                  | en                             | ar                 |
| ---------------------- | ------------------------------ | ------------------ |
| `area.dubai_marina`    | Dubai Marina                   | دبي مارينا         |
| `area.downtown`        | Downtown Dubai                 | وسط مدينة دبي      |
| `area.palm_jumeirah`   | Palm Jumeirah                  | نخلة جميرا         |
| `area.jbr`             | JBR (Jumeirah Beach Residence) | جي بي آر           |
| `area.business_bay`    | Business Bay                   | الخليج التجاري     |
| `area.jlt`             | JLT (Jumeirah Lake Towers)     | أبراج بحيرات جميرا |
| `area.creek_harbour`   | Dubai Creek Harbour            | خور دبي            |
| `area.dubai_hills`     | Dubai Hills Estate             | دبي هيلز           |
| `area.arabian_ranches` | Arabian Ranches                | المرابع العربية    |
| `area.motor_city`      | Motor City                     | موتور سيتي         |

---

## 9. react-i18next Configuration

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar', 'fr', 'ru', 'zh'],
    defaultNS: 'common',
    ns: [
      'common',
      'auth',
      'properties',
      'leads',
      'transactions',
      'compliance',
      'dashboard',
      'navigation',
      'forms',
      'notifications',
      'errors',
      'marketing',
    ],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator'],
      caches: ['localStorage', 'cookie'],
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

export default i18n;
```

---

## 10. Translation Workflow

1. **Developers** add tokens in English (`en/*.json`)
2. **CI** checks for missing tokens in other locales
3. **Translators** fill Arabic, French, Russian, Chinese
4. **Reviewers** verify cultural accuracy (Arabic is priority)
5. **QA** tests RTL layout, formatting, and edge cases
6. **Deploy** translation files as static assets (lazy-loaded per namespace)

---

## Sources

- [react-i18next Documentation](https://react.i18next.com/)
- [i18next Documentation](https://www.i18next.com/)
- [CLDR Currency Data](https://cldr.unicode.org/)
- [MDN Intl API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
- White Caves existing i18n (`src/i18n/` — 523 lines English, 3 sections Arabic)

---

## 11. Complete Token Dictionary — English

```json
// /locales/en/common.json — selected tokens (showing 50+ key strings)
{
  "nav": {
    "home": "Home",
    "properties": "Properties",
    "about": "About Us",
    "contact": "Contact",
    "login": "Sign In",
    "logout": "Sign Out",
    "dashboard": "Dashboard",
    "crm": "CRM",
    "portals": "Portals",
    "search": "Search"
  },
  "property": {
    "bedroom": "Bedroom",
    "bedroom_plural": "Bedrooms",
    "bathroom": "Bathroom",
    "bathroom_plural": "Bathrooms",
    "floor": "Floor",
    "area": "Area",
    "price": "Price",
    "totalArea": "Total Area",
    "plotArea": "Plot Area",
    "builtUpArea": "Built-Up Area",
    "listingType": "Listing Type",
    "propertyType": "Property Type",
    "community": "Community",
    "subCommunity": "Sub-Community",
    "yearBuilt": "Year Built",
    "serviceCharge": "Service Charge",
    "parkingSpaces": "Parking Spaces",
    "view": "View",
    "amenities": "Amenities",
    "description": "Description",
    "furnished": "Furnished",
    "unfurnished": "Unfurnished",
    "partFurnished": "Part Furnished",
    "forSale": "For Sale",
    "forRent": "For Rent",
    "offPlan": "Off-Plan",
    "readyToMove": "Ready to Move",
    "sold": "Sold",
    "underOffer": "Under Offer"
  },
  "search": {
    "placeholder": "Search by community, property type, or price...",
    "filters": "Filters",
    "applyFilters": "Apply Filters",
    "clearFilters": "Clear All",
    "sortBy": "Sort By",
    "priceHighLow": "Price: High to Low",
    "priceLowHigh": "Price: Low to High",
    "newestFirst": "Newest First",
    "results": "{{count}} results found",
    "noResults": "No properties found matching your criteria",
    "refineSearch": "Try refining your search"
  },
  "form": {
    "required": "Required",
    "submit": "Submit",
    "cancel": "Cancel",
    "save": "Save",
    "edit": "Edit",
    "delete": "Delete",
    "confirm": "Confirm",
    "back": "Back",
    "next": "Next",
    "name": "Full Name",
    "email": "Email Address",
    "phone": "Phone Number",
    "message": "Message",
    "budget": "Budget",
    "currency": "Currency",
    "agree_terms": "I agree to the Privacy Policy and Terms of Service"
  },
  "errors": {
    "required": "This field is required",
    "invalidEmail": "Please enter a valid email address",
    "invalidPhone": "Please enter a valid UAE phone number (+971...)",
    "minLength": "Minimum {{min}} characters required",
    "maxLength": "Maximum {{max}} characters allowed",
    "networkError": "Unable to connect. Please check your internet connection.",
    "serverError": "Something went wrong. Please try again later.",
    "notFound": "The requested item was not found.",
    "unauthorized": "You do not have permission to perform this action."
  },
  "notifications": {
    "saved": "Changes saved successfully",
    "deleted": "Item deleted successfully",
    "leadAssigned": "New lead assigned to you",
    "viewingScheduled": "Viewing scheduled for {{date}} at {{time}}",
    "documentReady": "Your document is ready to download",
    "paymentReceived": "Payment of {{amount}} received",
    "leaseRenewalDue": "Lease renewal due in {{days}} days",
    "permitExpiring": "Property permit expires in {{days}} days"
  },
  "lead": {
    "status": {
      "new": "New",
      "contacted": "Contacted",
      "qualified": "Qualified",
      "viewing": "Viewing",
      "offer": "Offer",
      "under_offer": "Under Offer",
      "won": "Won",
      "lost": "Lost",
      "nurturing": "Nurturing"
    },
    "source": {
      "website": "Website",
      "whatsapp": "WhatsApp",
      "referral": "Referral",
      "propertyfinder": "PropertyFinder",
      "bayut": "Bayut",
      "walk_in": "Walk-In",
      "social_media": "Social Media"
    }
  },
  "currency": {
    "aed": "AED",
    "gbp": "GBP",
    "eur": "EUR",
    "usd": "USD",
    "inr": "INR",
    "rub": "RUB",
    "format": "{{amount}} {{currency}}"
  },
  "dates": {
    "today": "Today",
    "yesterday": "Yesterday",
    "daysAgo": "{{count}} days ago",
    "justNow": "Just now",
    "format_short": "DD/MM/YYYY",
    "format_long": "D MMMM YYYY"
  },
  "portal": {
    "tenant": {
      "title": "Tenant Portal",
      "welcome": "Welcome, {{name}}",
      "myLease": "My Lease",
      "payments": "Payments",
      "maintenance": "Maintenance",
      "documents": "Documents",
      "payNow": "Pay Now",
      "nextPayment": "Next Payment Due",
      "submitRequest": "Submit Maintenance Request",
      "requestSubmitted": "Maintenance request submitted successfully"
    },
    "landlord": {
      "title": "Landlord Portal",
      "myProperties": "My Properties",
      "tenants": "Tenants",
      "revenue": "Revenue",
      "occupancy": "Occupancy",
      "addProperty": "Add Property"
    }
  }
}
```

---

## 12. Arabic Translation Guidelines

### 12.1 Real Estate Terminology (Arabic ↔ English)

| English          | Arabic            | Transliteration         | Notes                        |
| ---------------- | ----------------- | ----------------------- | ---------------------------- |
| Villa            | فيلا              | Villa                   | Borrowed word; plural: فيلات |
| Apartment        | شقة               | Shaqqa                  | Plural: شقق (Shuqaq)         |
| Bedroom          | غرفة نوم          | Ghurfat nawm            | Plural: غرف نوم              |
| Bathroom         | حمام              | Hammam                  |                              |
| Kitchen          | مطبخ              | Matbakh                 |                              |
| Floor / Storey   | طابق              | Tabiq                   | Plural: طوابق                |
| Total Area       | المساحة الإجمالية | Al-masa'ha al-ijmaliyya |                              |
| Built-Up Area    | مساحة البناء      | Masa'hat al-bina        |                              |
| Price            | السعر             | Al-si'r                 |                              |
| Rent             | الإيجار           | Al-ijaar                |                              |
| For Sale         | للبيع             | Lil-bay'                |                              |
| For Rent         | للإيجار           | Lil-ijaar               |                              |
| Off-Plan         | على الخريطة       | 'Ala al-khariyta        | Literal: "on the map"        |
| Community        | مجمع سكني         | Majma' sukani           |                              |
| Title Deed       | سند الملكية       | Sanad al-milkiyya       |                              |
| Down Payment     | دفعة مقدمة        | Daf'a muqaddama         |                              |
| Mortgage         | رهن عقاري         | Rahn 'iqari             |                              |
| Commission       | عمولة             | 'Umula                  |                              |
| Viewing          | معاينة            | Mu'ayana                |                              |
| Contract         | عقد               | 'Aqd                    | Plural: عقود                 |
| Landlord         | مالك / موجر       | Malik / Mawjir          |                              |
| Tenant           | مستأجر            | Musta'jir               |                              |
| Property Manager | مدير العقار       | Mudir al-'iqaar         |                              |

### 12.2 RTL Text Alignment Rules

```css
/* Global RTL direction — applied to <html> when locale = 'ar' */
[dir='rtl'] {
  text-align: right;
}

/* Navigation: items flow right-to-left */
[dir='rtl'] .nav-items {
  flex-direction: row-reverse;
}

/* Property cards: text starts from right */
[dir='rtl'] .property-card__content {
  direction: rtl;
}

/* Icons: flip directional icons (arrows, chevrons) */
[dir='rtl'] .icon--directional {
  transform: scaleX(-1);
}

/* Form inputs: Arabic placeholder right-aligned */
[dir='rtl'] input,
[dir='rtl'] textarea {
  direction: rtl;
  text-align: right;
}

/* Price display: currency symbol placement */
/* Arabic: "2,000,000 درهم" vs English: "AED 2,000,000" */
[dir='rtl'] .price-display::before {
  content: '';
}
[dir='rtl'] .price-display::after {
  content: ' درهم';
}

/* Sidebar: opens from right side in RTL */
[dir='rtl'] .sidebar {
  right: 0;
  left: auto;
}
[dir='rtl'] .sidebar--collapsed {
  transform: translateX(100%);
}
```

### 12.3 Number Formatting

| Context         | Arabic Numerals | Latin Numerals | Decision                                      |
| --------------- | --------------- | -------------- | --------------------------------------------- |
| Property prices | ٢٬٠٠٠٬٠٠٠       | 2,000,000      | Use Latin — industry standard in UAE          |
| Percentages     | ٥٪              | 5%             | Use Latin — consistent with financial context |
| Phone numbers   | +٩٧١٥٠...       | +971 50...     | Use Latin — international dialling standard   |
| Dates           | ٢٩ أبريل ٢٠٢٦   | 29 April 2026  | Either — match user locale preference         |
| Floor numbers   | الطابق الثالث   | Floor 3        | Arabic text + Latin digit hybrid acceptable   |

**Decision:** White Caves uses Latin numerals throughout the Arabic locale for professional real estate context (consistent with UAE industry practice).

### 12.4 Currency Format

| Locale           | Format                | Example                |
| ---------------- | --------------------- | ---------------------- |
| English (en)     | AED [amount]          | AED 2,000,000          |
| Arabic (ar)      | [amount] درهم إماراتي | ٢٬٠٠٠٬٠٠٠ درهم إماراتي |
| Arabic (compact) | [amount] د.إ          | 2,000,000 د.إ          |

**Recommendation:** Use compact Arabic format (د.إ) to save space in cards; full form (درهم إماراتي) in formal documents.

### 12.5 Date Format Differences

| Locale                         | Format        | Example             |
| ------------------------------ | ------------- | ------------------- |
| English                        | DD/MM/YYYY    | 29/04/2026          |
| Arabic (Gregorian)             | YYYY/MM/DD    | 2026/04/29          |
| Arabic (Hijri calendar option) | هـ / م toggle | 1 ذو القعدة 1447 هـ |

**Implementation:** Use `Intl.DateTimeFormat` with locale:

```javascript
const formatDate = (date: Date, locale: string) =>
  new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    calendar: locale === 'ar' ? 'gregory' : undefined, // Use Gregorian in Arabic
  }).format(date);
```

---

## 13. Testing i18n Coverage

### 13.1 Missing Key Detection

**VS Code Extension:** `lokalise.i18n-ally` — shows inline translated strings and flags missing keys in yellow.

**CI Pipeline Check (Phase 2):**

```yaml
# .github/workflows/ci.yml
- name: Check i18n coverage
  run: |
    node scripts/check-i18n-coverage.js
    # Fails if any key in en/*.json is missing in ar/*.json
    # Outputs: "Missing keys: 3 — portal.tenant.submitRequest (ar), ..."
```

**Script logic:**

```javascript
// scripts/check-i18n-coverage.js
const en = loadAllKeys('locales/en');
const ar = loadAllKeys('locales/ar');
const missing = en.filter(key => !ar.includes(key));
if (missing.length > 0) {
  console.error('Missing Arabic translations:', missing);
  process.exit(1);
}
```

### 13.2 Screenshot Testing for RTL Layout Regressions

**Tool:** Playwright visual regression testing:

```typescript
// tests/i18n.visual.test.ts
test('Property listing page renders correctly in Arabic RTL', async ({ page }) => {
  await page.goto('/ar/properties/test-property-id');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  // Visual snapshot comparison
  await expect(page).toHaveScreenshot('property-listing-ar.png', {
    fullPage: true,
    maxDiffPixels: 100, // Allow minor anti-aliasing differences
  });
});
```

### 13.3 Jest Locale Simulation Tests

```typescript
// src/utils/currency.test.ts
describe('formatCurrency', () => {
  it('formats AED correctly in English', () => {
    expect(formatCurrency(2000000, 'en')).toBe('AED 2,000,000');
  });

  it('formats AED correctly in Arabic', () => {
    expect(formatCurrency(2000000, 'ar')).toBe('2,000,000 د.إ');
  });

  it('formats with compact notation for Arabic cards', () => {
    expect(formatCurrencyCompact(2000000, 'ar')).toBe('2M د.إ');
  });
});

describe('formatDate', () => {
  it('formats date correctly in Arabic', () => {
    const date = new Date('2026-04-29');
    expect(formatDate(date, 'ar')).toBe('29 أبريل 2026');
  });
});
```

### 13.4 Manual QA Checklist for Arabic Locale

Before every release that touches the UI:

```
RTL Layout:
☐ Navigation menu renders right-to-left
☐ Property cards: text aligned right, price correct
☐ Forms: labels right-aligned, input text direction correct
☐ Sidebar: opens from right edge
☐ Breadcrumbs: direction reversed
☐ Pagination arrows: previous/next directions swapped

Typography:
☐ Arabic font (Noto Naskh Arabic) loaded correctly
☐ Font size 1–2px larger than English equivalent (Arabic requires more size for readability)
☐ No text overflow on Arabic strings (Arabic words are longer than English equivalents)
☐ Line height sufficient for Arabic diacritics (harakat)

Numbers & Currency:
☐ All prices display as Latin numerals (not Eastern Arabic)
☐ Currency symbol د.إ appears after the number (not before)
☐ Date format follows user preference

Content:
☐ All navigation items translated
☐ All form labels translated
☐ All error messages translated
☐ All notification messages translated
☐ No untranslated English strings visible (run i18n-ally scan)
```

---

**Document Owner:** Design (@Una — CSS Specialist, @Africa — Accessibility Lead) + Technology (@Grace — Lead Engineer)
**Version History:** v1.0 April 2026 (initial); v2.0 April 2026 (complete token dictionary, Arabic guidelines, testing)
**Review Cycle:** Updated with each locale addition (Arabic Phase 6, French/Russian Phase 8+)
**Related Documents:**

- `src/i18n/` (implementation)
- `business/10_design_system/ar_vr_3d_tours.md`
- `plans/PHASE_8_ARABIC.md`
- Arabic Standard: CLDR — unicode.org/cldr
