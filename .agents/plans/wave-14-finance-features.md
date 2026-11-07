# Wave 14: Finance Features Specifications

## 1. Overview
Finance features support statutory compliance, accurate ROI tracking, and cross-border currency conversions for international investors.

## 2. Mortgage API Contracts
- The `UAEMortgageCalculatorModal` encapsulates the CBUAE loan-to-value limits (e.g., 80% for first-time buyers, 60% for non-residents).
- The calculator integrates a static approximation of the DLD 4% transfer fee, plus trustee and title deed fees.

## 3. Calendar Sync
- Payment schedules (PDCs, monthly rent) are available as `.ics` feed exports via `GET /api/v1/calendar/feed/:userId`.
- This allows landlords to synchronize payment due dates directly to Outlook or Google Calendar.

## 4. FX Conversion
- Integrating an external API (e.g., OpenExchangeRates) to provide daily spot rates.
- The `FXCurrencyConverter` UI component caches rates to allow seamless conversion between AED, USD, EUR, and GBP for foreign investors.
