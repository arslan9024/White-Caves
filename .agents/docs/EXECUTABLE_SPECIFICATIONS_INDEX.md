# White Caves Real Estate — Executable Specifications Index

> **Status:** Canonical Living Code Architecture  
> **Philosophy:** Convert ambiguous, drifting markdown formulas and compliance rules into deterministic, type-checked, unit-tested TypeScript functions.

---

## 1. Mapped Business Rules & Formula Engines

| Domain | Markdown Source Spec | Executable TypeScript Engine | Test Suite (`vitest`) | Core Formulas / Calculations |
| :--- | :--- | :--- | :--- | :--- |
| **Broker Commission & Splits** | [white-caves-commission-engine-spec.md](file:///c:/Users/Dell/Documents/White-Caves/.agents/docs/white-caves-commission-engine-spec.md)<br>[business-rules.md (BR-011)](file:///c:/Users/Dell/Documents/White-Caves/.agents/docs/business-rules.md) | [`src/utils/commissionEngine.ts`](file:///c:/Users/Dell/Documents/White-Caves/src/utils/commissionEngine.ts) | [`commissionEngine.test.ts`](file:///c:/Users/Dell/Documents/White-Caves/src/utils/commissionEngine.test.ts) | • 180-day Onboarding buffer (70/30)<br>• Chairman's Circle Lock (75%)<br>• Revenue slabs (50%, 55%, 60%, 70%)<br>• Internal co-broke split & referral deduction (max 25%) |
| **UAE Tax & DLD Friction** | [business-rules.md (BR-011-A)](file:///c:/Users/Dell/Documents/White-Caves/.agents/docs/business-rules.md)<br>AEG-030 / AEG-031 | [`src/utils/uaeTaxEngine.ts`](file:///c:/Users/Dell/Documents/White-Caves/src/utils/uaeTaxEngine.ts) | [`uaeTaxEngine.test.ts`](file:///c:/Users/Dell/Documents/White-Caves/src/utils/uaeTaxEngine.test.ts) | • UAE 5% FTA VAT (Law No. 8/2017)<br>• UAE 9% Corporate Tax with AED 375k Small Business Relief<br>• DLD 4% Transfer + Trustee Fee + Admin Fee |
| **RERA Rental Increase Index** | [business-rules.md (BR-013)](file:///c:/Users/Dell/Documents/White-Caves/.agents/docs/business-rules.md)<br>Dubai Decree No. 43 of 2013 | [`src/utils/reraRentIndexEngine.ts`](file:///c:/Users/Dell/Documents/White-Caves/src/utils/reraRentIndexEngine.ts) | [`reraRentIndexEngine.test.ts`](file:///c:/Users/Dell/Documents/White-Caves/src/utils/reraRentIndexEngine.test.ts) | • Decree No. 43/2013 tiers (0%, 5%, 10%, 15%, 20%)<br>• Statutory 90-day notice cutoff date<br>• Over-market benchmark flag (> 10% above index) |
| **Post-Dated Cheques (PDC)** | [business-rules.md (BR-012)](file:///c:/Users/Dell/Documents/White-Caves/.agents/docs/business-rules.md)<br>UAE Law No. 14 of 2020 | [`src/utils/pdcComplianceEngine.ts`](file:///c:/Users/Dell/Documents/White-Caves/src/utils/pdcComplianceEngine.ts) | [`pdcComplianceEngine.test.ts`](file:///c:/Users/Dell/Documents/White-Caves/src/utils/pdcComplianceEngine.test.ts) | • Cheque bounce penalty (5%, min AED 200) + bank return fee<br>• 180-day (6-month) legal staleness check<br>• 5-business-day replacement deadline |
| **AI Lead Scoring Engine** | [business-rules.md (BR-001)](file:///c:/Users/Dell/Documents/White-Caves/.agents/docs/business-rules.md) | [`src/utils/leadScoringEngine.ts`](file:///c:/Users/Dell/Documents/White-Caves/src/utils/leadScoringEngine.ts) | [`leadScoringEngine.test.ts`](file:///c:/Users/Dell/Documents/White-Caves/src/utils/leadScoringEngine.test.ts) | • Budget scoring (+5 to +25)<br>• Timeline urgency (+0 to +20)<br>• Recency decay (-20 for 30+ days dormant)<br>• Inbound source attribution (+2 to +10)<br>• Hot Lead notification trigger (< 2h follow-up) |
| **Tenancy & Ejari Compliance** | [business-rules.md (BR-006)](file:///c:/Users/Dell/Documents/White-Caves/.agents/docs/business-rules.md)<br>[tenancy-ejari.md](file:///c:/Users/Dell/Documents/White-Caves/.agents/docs/tenancy-ejari.md) | [`src/utils/tenancyComplianceEngine.ts`](file:///c:/Users/Dell/Documents/White-Caves/src/utils/tenancyComplianceEngine.ts) | [`tenancyComplianceEngine.test.ts`](file:///c:/Users/Dell/Documents/White-Caves/src/utils/tenancyComplianceEngine.test.ts) | • RERA security deposit caps (5% unfurnished / 10% furnished)<br>• Ejari registration mandatory validation gate<br>• 30-day Ejari expiry alert window<br>• Overdue rent late fees (Day 5, 10, 15, Day 25 legal escalation) |
| **PDC Schedule Generator** | [leasing-intake-forms.md](file:///c:/Users/Dell/Documents/White-Caves/.agents/docs/leasing-intake-forms.md) | [`src/utils/generatePdcSchedule.ts`](file:///c:/Users/Dell/Documents/White-Caves/src/utils/generatePdcSchedule.ts) | Built-in | • 1, 2, 4, 6, 12 installments with calendar month offsets |
| **Predictive ROI & Yields** | [market-intelligence.md](file:///c:/Users/Dell/Documents/White-Caves/.agents/docs/market-intelligence.md) | [`src/utils/PredictiveROIMatrix.ts`](file:///c:/Users/Dell/Documents/White-Caves/src/utils/PredictiveROIMatrix.ts) | [`PredictiveROIMatrix.test.ts`](file:///c:/Users/Dell/Documents/White-Caves/src/utils/PredictiveROIMatrix.test.ts) | • Gross vs Net rental yield (after DLD, VAT, service charges)<br>• 3-year community appreciation benchmarks |

---

## 2. Universal Import

All engines are exported from [`src/utils/index.ts`](file:///c:/Users/Dell/Documents/White-Caves/src/utils/index.ts):

```typescript
import {
  // Commission & Splits
  calculateAgentPayout,
  calculateMultiAgentSplit,
  // Taxes & Government Friction
  calculateUaeVat,
  calculateCorporateTaxReserve,
  calculateDldAcquisitionCosts,
  // RERA Decree 43 / 2013 Rent Cap
  calculateReraPermissibleIncrease,
  // PDC & Cheque Compliance
  calculateBouncedChequePenalties,
  checkChequeValidity,
  generatePdcSchedule,
  // Lead Scoring & Dormancy
  calculateLeadScore,
  // Tenancy & Ejari Compliance
  calculateSecurityDeposit,
  validateEjariCompliance,
  calculateOverdueRentFee,
  // Portfolio ROI
  calculatePredictiveROI,
} from '@/utils';
```
