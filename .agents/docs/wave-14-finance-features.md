# Wave 14 — Finance Features: Mortgage API + Calendar Sync + Multi-Currency

**Drafted by:** @Mortgage  
**Model:** Gemini 2.0 Flash  
**Status:** ✅ READY (retrospective spec for implemented Wave 14)  
**Last Updated:** 2026-05-25  

CONSUMES←@Invoice: `business_docs/09_crm_features/financial-reporting.md#mortgage-section`  
FEEDS→@Anima: `business_docs/09_crm_features/currency-management.md#fx-conversion`  
FEEDS_ACK←@Katherine: accepted | `business_docs/09_crm_features/wave-14-finance-features.md`

---

## 1. Overview

Wave 14 delivers three finance-related features:

1. **Mortgage Calculator API** — server-side amortisation calculations exposed as a REST endpoint
2. **Appointment Calendar** — CRM scheduling API for property viewings and meetings
3. **Multi-Currency FX Conversion** — live exchange rate service for AED-denominated CRM data

---

## 2. Mortgage Calculator API

### 2.1 Endpoint

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/mortgage/calculate` | authenticated | Calculate monthly payment + full amortisation |
| `GET` | `/api/mortgage/rates` | authenticated | Current indicative bank rates |
| `GET` | `/api/mortgage/eligibility` | authenticated | Buyer eligibility estimate |

### 2.2 Request Body (`/api/mortgage/calculate`)

```typescript
interface MortgageCalculateInput {
  propertyPrice: number;     // AED
  downPaymentPercent: number; // e.g. 20 (for 20%)
  annualInterestRate: number; // e.g. 4.5 (for 4.5%)
  termYears: number;          // loan term in years (max 25)
  currency?: string;          // default 'AED'
}
```

### 2.3 Response

```typescript
interface MortgageCalculateResult {
  loanAmount: number;
  downPayment: number;
  monthlyPayment: number;
  totalInterest: number;
  totalRepayment: number;
  currency: string;
  amortisationSchedule: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
}
```

### 2.4 Amortisation Formula

```
monthlyRate = annualInterestRate / 100 / 12
n = termYears * 12
monthlyPayment = loanAmount * (monthlyRate * (1 + monthlyRate)^n) / ((1 + monthlyRate)^n - 1)
```

### 2.5 DLD Fees (auto-appended to response)

| Fee | Rate | Description |
|-----|------|-------------|
| DLD Transfer Fee | 4% of property price | Split buyer/seller |
| DLD Admin Fee | AED 580 flat | |
| Trustee Fee | AED 4,000 (standard) | For properties < AED 500K |
| Mortgage Registration | 0.25% of loan amount | Capped at AED 10,000 |

---

## 3. Appointment / Calendar API

### 3.1 Appointment Schema

```typescript
interface Appointment {
  id: string;
  propertyId?: string;
  leadId?: string;
  agentId: string;
  scheduledAt: Date;
  durationMinutes: number;    // default 60
  type: AppointmentType;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  zoomLink?: string;          // for virtual appointments
  feedbackRating?: number;    // 1–5, post-completion
  feedbackText?: string;
}

type AppointmentType =
  | 'property_viewing'
  | 'client_meeting'
  | 'landlord_meeting'
  | 'rera_inspection'
  | 'handover'
  | 'team_meeting';
```

### 3.2 REST Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/appointments` | authenticated | List with filters (agentId, date range, status) |
| `POST` | `/api/appointments` | `agent` | Create appointment |
| `GET` | `/api/appointments/:id` | authenticated | Single appointment detail |
| `PATCH` | `/api/appointments/:id` | `agent` | Update status / notes |
| `DELETE` | `/api/appointments/:id` | `manager` | Cancel appointment |
| `GET` | `/api/appointments/availability` | authenticated | Agent availability slots |

### 3.3 Conflict Detection

Before creating an appointment, the API checks for overlapping confirmed appointments for the same agent:

```sql
WHERE agentId = ? AND status = 'confirmed'
  AND scheduledAt < (newEnd)
  AND (scheduledAt + duration) > (newStart)
```

Returns `409 Conflict` if overlap found.

---

## 4. Multi-Currency Service (`server/services/currencyService.ts`)

### 4.1 Supported Currencies

`AED` (base), `USD`, `GBP`, `EUR`, `INR`, `PKR`, `SAR`, `QAR`

### 4.2 Rate Source

- **Provider:** ExchangeRate-API (free tier — 1,500 requests/month)
- **Fallback:** Open Exchange Rates (free tier)
- **Cache TTL:** 4 hours (in-memory Map)
- **Stale-while-revalidate:** Returns cached value immediately; refreshes in background on cache miss

### 4.3 REST Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/currency/rates` | authenticated | All current rates vs AED |
| `GET` | `/api/currency/convert` | authenticated | Convert amount between currencies |
| `GET` | `/api/currency/supported` | public | List of supported currency codes |

### 4.4 Convert Endpoint

```
GET /api/currency/convert?from=USD&to=AED&amount=100000

Response:
{
  "from": "USD",
  "to": "AED",
  "amount": 100000,
  "converted": 367310,
  "rate": 3.6731,
  "cachedAt": "2026-05-25T10:00:00Z"
}
```

### 4.5 Historical Rate Storage

Daily closing rates are stored in `currency_rates` collection for backdated commission calculations and financial report accuracy. A cron job (`currency-rates-daily`) runs at `23:55 AST` and writes today's closing rates.

---

## 5. Acceptance Criteria

### Mortgage API
- [x] Monthly payment calculated correctly via standard amortisation formula
- [x] Full amortisation schedule included in response
- [x] DLD fee breakdown appended to response
- [x] `termYears` capped at 25; `downPaymentPercent` min 20 for expats

### Calendar API
- [x] Appointment creation rejects overlapping confirmed appointments (`409`)
- [x] Status transitions enforced: `scheduled → confirmed → completed`
- [x] Availability endpoint returns free slots based on working hours config
- [x] Feedback rating/text capturable post-completion

### Multi-Currency
- [x] Rates cached for 4 hours; no API call on cache hit
- [x] Fallback to Open Exchange Rates if primary provider fails
- [x] Historical daily rates stored for backdated calculations
- [x] `convert` endpoint validates currency codes against supported list
