# Currency Management — Business Specification

**Owner:** @Anima | **Tool:** DeepSeek Chat (DeepSeek V3)
**Purpose:** Multi-currency support with live exchange rates (AED base + 8 currencies).
**Status:** ✅ Expanded by @Anima.

CONSUMES←@Fei-Fei: business_docs/09_crm_features/property-valuation.md#valuation-metrics
FEEDS→@Mary: business_docs/09_crm_features/secondary-sales.md#pipeline-rules

---

## 1. Overview

All financial values in White Caves CRM are stored in AED (dirham) as the base currency. The Currency Management module provides live exchange rates for 8 supported currencies, allowing property prices and financial figures to be displayed in the buyer's preferred currency in real time.

---

## 2. Supported Currencies and ISO Codes

| Currency | ISO Code | Symbol | Primary Market |
|---|---|---|---|
| UAE Dirham (base) | AED | د.إ | All UAE transactions |
| US Dollar | USD | $ | GCC + international |
| British Pound | GBP | £ | UK investors |
| Euro | EUR | € | European buyers |
| Indian Rupee | INR | ₹ | Indian expat market |
| Pakistani Rupee | PKR | ₨ | Pakistani expat market |
| Saudi Riyal | SAR | ﷼ | GCC buyers |
| Qatari Riyal | QAR | ﷼ | GCC buyers |

**Display rule:** All stored values remain AED. Converted amounts shown as secondary with "(~{symbol}{amount})" format. AED always shown as primary.

---

## 3. Live Rate Source and Cache Strategy

### Primary: ExchangeRate-API (free tier)
- **Endpoint:** `https://v6.exchangerate-api.com/v6/{API_KEY}/latest/AED`
- **Free tier limit:** 1,500 requests/month
- **Response:** `{ conversion_rates: { USD: 0.2723, GBP: 0.2154, ... } }`

### Fallback: Open Exchange Rates (free tier)
- **Endpoint:** `https://openexchangerates.org/api/latest.json?app_id={ID}&base=USD`
- Converts USD-base rates to AED-base via cross-rate calculation

### Cache Strategy
```ts
// server/services/currency/rateCache.ts
const rateCache = new Map<string, { rates: Rates; expiresAt: number }>();
const TTL_MS = 4 * 60 * 60 * 1000;  // 4-hour TTL

async function getRates(): Promise<Rates> {
  const cached = rateCache.get('AED');
  if (cached && Date.now() < cached.expiresAt) return cached.rates;
  
  try {
    const fresh = await fetchFromExchangeRateApi();
    rateCache.set('AED', { rates: fresh, expiresAt: Date.now() + TTL_MS });
    return fresh;
  } catch {
    // stale-while-revalidate: return stale if available, else try fallback
    if (cached) return cached.rates;
    return fetchFromOpenExchangeRates();
  }
}
```

**Redis option (multi-instance):** If `REDIS_URL` env var present, use Redis instead of in-memory Map. `SET currency:AED:rates {json} EX 14400`.

---

## 4. API Contract

```
GET /api/currency/rates
Response: {
  base: "AED",
  updatedAt: "2026-05-09T14:00:00Z",
  rates: { USD: 0.2723, GBP: 0.2154, EUR: 0.2501, INR: 22.74, PKR: 75.6, SAR: 1.022, QAR: 0.991 }
}

GET /api/currency/convert?from=AED&to=USD&amount=1000000
Response: { from: "AED", to: "USD", amount: 1000000, result: 272300, rate: 0.2723 }
```

Rate endpoint cached at CDN edge (Cache-Control: max-age=3600).

---

## 5. Property Listing Display

**User preference** stored in `UserProfile.preferredCurrency` (default: AED):
```
Property card price display:
  Primary:   "AED 3,500,000"
  Secondary: "(~USD 953,000)" in smaller grey text below
```

**Currency selector:** Dropdown in user profile settings + quick-select on property listing page header.

---

## 6. Financial Report Currency Column

Financial reports (P&L, commissions, rental income) display:
- AED column always shown (primary, used for all calculations)
- Optional secondary column in `UserProfile.preferredCurrency`
- Totals only in AED (secondary column totals intentionally omitted — cross-rate drift disclaimer shown)

---

## 7. Historical Rate Table

**Purpose:** Backdated commission calculations, financial report accuracy for historical periods.

```prisma
model CurrencyRateSnapshot {
  id        String   @id @default(cuid())
  date      String   // YYYY-MM-DD
  base      String   @default("AED")
  rates     Json     // { USD: 0.2723, GBP: 0.2154, ... }
  createdAt DateTime @default(now())
  @@unique([date, base])
}
```

**Cron:** Daily at 00:05 GST — store closing rates for previous day.

**Usage:** `GET /api/currency/historical?date=2026-04-15&currency=GBP` → returns rate for that date.

---

## 8. Unit / Integration Tests

| Test | Coverage |
|---|---|
| Cache returns stale on API timeout | Unit |
| Convert 1,000,000 AED to USD correctly | Unit |
| Historical rate stored daily | Integration |
| Rate missing for a currency → 400 error | Unit |
| Redis path used when REDIS_URL set | Integration |

---

## 9. Rollback / Migration

- `CurrencyRateSnapshot` model added via Prisma migration
- In-memory cache gracefully falls back on Redis unavailability
- API keys stored in env vars; rotation requires env update + server restart