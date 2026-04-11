# Internationalization (i18n) Tokens & Configuration

> **Last Updated:** April 11, 2026
> **Purpose:** Define i18n token structure, locale configuration, and translation guidelines
> **Languages:** English (en), Arabic (ar), French (fr), Russian (ru), Chinese (zh)
> **Extends:** `/business_docs/10_design_system/rtl-internationalization.md`

---

## 1. Overview

White Caves serves a diverse international clientele in Dubai. The platform must support multiple languages with proper RTL layout for Arabic, locale-aware formatting for currencies/dates/numbers, and a scalable translation token system.

---

## 2. Supported Locales

| Locale | Language | Direction | Currency | Date Format | Number Format | Priority |
|--------|----------|-----------|----------|-------------|---------------|----------|
| `en-AE` | English (UAE) | LTR | AED | DD/MM/YYYY | 1,234,567.89 | P0 (primary) |
| `ar-AE` | Arabic (UAE) | RTL | د.إ | DD/MM/YYYY | ١٬٢٣٤٬٥٦٧٫٨٩ | P0 (primary) |
| `en-US` | English (US) | LTR | USD | MM/DD/YYYY | 1,234,567.89 | P1 |
| `en-GB` | English (UK) | LTR | GBP | DD/MM/YYYY | 1,234,567.89 | P1 |
| `fr-FR` | French | LTR | EUR | DD/MM/YYYY | 1 234 567,89 | P2 |
| `ru-RU` | Russian | LTR | USD | DD.MM.YYYY | 1 234 567,89 | P2 |
| `zh-CN` | Chinese (Simplified) | LTR | CNY | YYYY/MM/DD | 1,234,567.89 | P2 |

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

| Token | en-AE | ar-AE | en-US | en-GB |
|-------|-------|-------|-------|-------|
| `currency.symbol` | AED | د.إ | $ | £ |
| `currency.code` | AED | AED | USD | GBP |
| `currency.position` | before | after | before | before |
| `currency.separator` | , | ٬ | , | , |
| `currency.decimal` | . | ٫ | . | . |

### 4.2 Price Formatting Examples

| Locale | Format | Example |
|--------|--------|---------|
| `en-AE` | `AED 1,500,000` | `formatCurrency(1500000, 'en-AE')` |
| `ar-AE` | `١٬٥٠٠٬٠٠٠ د.إ` | `formatCurrency(1500000, 'ar-AE')` |
| `en-US` | `$408,163` | `formatCurrency(408163, 'en-US')` (auto-convert) |
| `en-GB` | `£326,086` | `formatCurrency(326086, 'en-GB')` (auto-convert) |

### 4.3 Multi-Currency Support

```typescript
interface CurrencyConfig {
  code: string;           // ISO 4217 code
  symbol: string;         // Display symbol
  position: 'before' | 'after';
  decimals: number;       // Decimal places
  exchangeRate: number;   // Rate vs AED (base)
  lastUpdated: string;    // ISO timestamp
}

const currencies: Record<string, CurrencyConfig> = {
  AED: { code: 'AED', symbol: 'AED', position: 'before', decimals: 0, exchangeRate: 1, lastUpdated: '' },
  USD: { code: 'USD', symbol: '$', position: 'before', decimals: 0, exchangeRate: 0.2722, lastUpdated: '' },
  GBP: { code: 'GBP', symbol: '£', position: 'before', decimals: 0, exchangeRate: 0.2174, lastUpdated: '' },
  EUR: { code: 'EUR', symbol: '€', position: 'before', decimals: 0, exchangeRate: 0.2513, lastUpdated: '' },
};
```

---

## 5. Date & Time Formatting

| Token | en-AE | ar-AE | en-US |
|-------|-------|-------|-------|
| `date.short` | 11/04/2026 | ١١/٠٤/٢٠٢٦ | 04/11/2026 |
| `date.long` | 11 April 2026 | ١١ أبريل ٢٠٢٦ | April 11, 2026 |
| `date.relative` | 2 hours ago | منذ ساعتين | 2 hours ago |
| `time.short` | 2:30 PM | ٢:٣٠ م | 2:30 PM |
| `time.long` | 2:30:00 PM GST | ٢:٣٠:٠٠ م ت.خ | 2:30:00 PM GST |

---

## 6. RTL-Specific Design Tokens

```css
/* RTL Layout Tokens */
--layout-direction: rtl;                    /* ltr for English */
--layout-start: right;                      /* left for English */
--layout-end: left;                         /* right for English */
--sidebar-position: right;                  /* left for English */
--text-align: right;                        /* left for English */
--icon-flip: scaleX(-1);                    /* scaleX(1) for English */
--border-start: border-right;              /* border-left for English */
--border-end: border-left;                 /* border-right for English */
--margin-start: margin-right;             /* margin-left for English */
--margin-end: margin-left;                /* margin-right for English */
--padding-start: padding-right;           /* padding-left for English */
--padding-end: padding-left;              /* padding-right for English */
```

---

## 7. Property-Specific Tokens

### 7.1 Property Types

| Token | en | ar |
|-------|----|----|
| `property.type.apartment` | Apartment | شقة |
| `property.type.villa` | Villa | فيلا |
| `property.type.townhouse` | Townhouse | تاون هاوس |
| `property.type.penthouse` | Penthouse | بنتهاوس |
| `property.type.studio` | Studio | استوديو |
| `property.type.duplex` | Duplex | دوبلكس |
| `property.type.land` | Land | أرض |
| `property.type.office` | Office | مكتب |
| `property.type.warehouse` | Warehouse | مستودع |
| `property.type.retail` | Retail | محل تجاري |

### 7.2 Property Status

| Token | en | ar |
|-------|----|----|
| `property.status.available` | Available | متاح |
| `property.status.sold` | Sold | مباع |
| `property.status.rented` | Rented | مؤجر |
| `property.status.off_plan` | Off-Plan | على الخارطة |
| `property.status.under_offer` | Under Offer | تحت العرض |

### 7.3 Amenities

| Token | en | ar |
|-------|----|----|
| `amenity.pool` | Swimming Pool | مسبح |
| `amenity.gym` | Gym | صالة رياضية |
| `amenity.parking` | Parking | موقف سيارات |
| `amenity.balcony` | Balcony | شرفة |
| `amenity.garden` | Garden | حديقة |
| `amenity.security` | 24/7 Security | أمن على مدار الساعة |
| `amenity.concierge` | Concierge | خدمة الكونسيرج |
| `amenity.beach_access` | Beach Access | وصول للشاطئ |
| `amenity.sea_view` | Sea View | إطلالة بحرية |
| `amenity.city_view` | City View | إطلالة على المدينة |

---

## 8. Area Names (Dubai Communities)

| Token | en | ar |
|-------|----|----|
| `area.dubai_marina` | Dubai Marina | دبي مارينا |
| `area.downtown` | Downtown Dubai | وسط مدينة دبي |
| `area.palm_jumeirah` | Palm Jumeirah | نخلة جميرا |
| `area.jbr` | JBR (Jumeirah Beach Residence) | جي بي آر |
| `area.business_bay` | Business Bay | الخليج التجاري |
| `area.jlt` | JLT (Jumeirah Lake Towers) | أبراج بحيرات جميرا |
| `area.creek_harbour` | Dubai Creek Harbour | خور دبي |
| `area.dubai_hills` | Dubai Hills Estate | دبي هيلز |
| `area.arabian_ranches` | Arabian Ranches | المرابع العربية |
| `area.motor_city` | Motor City | موتور سيتي |

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
      'common', 'auth', 'properties', 'leads',
      'transactions', 'compliance', 'dashboard',
      'navigation', 'forms', 'notifications',
      'errors', 'marketing'
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
