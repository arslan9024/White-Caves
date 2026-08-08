# Leasing Intake Forms & Onboarding Architecture — Feature Specification

<!-- markdownlint-disable MD040 MD060 -->

**Module:** Leasing & Tenancy Intake | **Owner:** @Amina (Leasing Intake Lead) | **Priority:** High  
**Governance:** `business_docs/` | **Brand Palette:** White Caves Red (`#EF4444`) | White (`#FFFFFF`) | Slate (`#1E293B`)
**Last Updated:** 2026-08-07  
**Next Review:** 2026-08-21  
**Source of Truth:** CRM leasing intake forms and onboarding feature specification (business layer)

## Canonical governance links

- [`../05_requirements/functional-requirements.md`](../05_requirements/functional-requirements.md)
- [`../05_requirements/compliance-requirements.md`](../05_requirements/compliance-requirements.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)

## Feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- frontend intake UX/reliability lanes in `docs/plans/waves/WAVE_39_*` and `WAVE_40_*`

---

## 1. Overview & Business Rationale

The **Leasing Intake Forms Engine** standardizes data collection for prospective tenants, landlords, and co-occupants in Dubai's luxury rental market. By enforcing mandatory DLD/RERA compliance fields upfront (Emirates ID, Passport, Visa, Title Deed, DEWA Premises Number, PDC Schedule), the engine reduces tenant onboarding SLA from 48 hours to under 15 minutes.

```
┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐
│  Tenant Intake Form    │ ───► │  KYC Verification Gate │ ───► │ Ejari Auto-Draft Engine│
│  (Income/PDC/Emirates) │      │  (Passport/Visa/EID)   │      │ (Form A / Unified DLD) │
└────────────────────────┘      └────────────────────────┘      └────────────────────────┘
```

---

## 2. Intake Form Schemas & Field Requirements

### 2.1 Tenant Application Intake Schema (`TenantIntakeForm`)

| Field Name | Type | Required? | Validation Rule / Pattern | Purpose |
|------------|------|-----------|---------------------------|---------|
| `fullName` | string | Yes | Min 3 chars | Full legal name matching Passport |
| `email` | string | Yes | RFC 5322 email regex | Primary communication channel |
| `phone` | string | Yes | `^\+971[0-9]{9}$` | UAE E.164 phone number |
| `emiratesId` | string | Yes | `^784-[0-9]{4}-[0-9]{7}-[0-9]{1}$` | UAE Emirates ID |
| `passportNumber` | string | Yes | Alphanumeric | International identity verification |
| `visaStatus` | enum | Yes | `Resident` \| `Investor` \| `Tourist` | Legal residency check |
| `employerName` | string | Yes | String | Proof of income source |
| `monthlyIncomeAED` | number | Yes | Min 10,000 AED | Rent affordability ratio check |
| `numberOfCheques` | enum | Yes | `1` \| `2` \| `4` \| `6` \| `12` | PDC installment schedule |
| `preferredMoveInDate` | date | Yes | Future date | Tenancy start date |

### 2.2 Landlord Property Listing Intake Schema (`LandlordListingIntake`)

| Field Name | Type | Required? | Validation Rule | Purpose |
|------------|------|-----------|-----------------|---------|
| `landlordName` | string | Yes | Passport match | Property owner identity |
| `titleDeedNumber` | string | Yes | DLD Title Deed format | Legal ownership validation |
| `dewaPremisesNumber` | string | Yes | 9-digit DEWA number | Utility connection mapping |
| `propertyCommunity` | string | Yes | Valid Dubai neighborhood | Neighborhood classification |
| `unitNumber` | string | Yes | Alphanumeric | Unit identification |
| `askingRentAED` | number | Yes | Min 20,000 AED | Annual rental price |
| `securityDepositAED` | number | Yes | 5% (unfurnished) / 10% (furnished) | RERA legal deposit bound |

---

## 3. PDC (Post-Dated Cheque) Tracking Schedule

All leasing intake forms automatically generate the PDC clearance schedule based on the selected `numberOfCheques`:

```typescript
export interface ChequeScheduleItem {
  chequeNumber: string;
  bankName: string;
  dueDate: string;
  amountAED: number;
  status: 'Pending' | 'Deposited' | 'Cleared' | 'Bounced';
}

export function generatePdcSchedule(
  annualRentAED: number,
  chequeCount: 1 | 2 | 4 | 6 | 12,
  startDate: string
): ChequeScheduleItem[] {
  const installmentAmount = Math.round(annualRentAED / chequeCount);
  const items: ChequeScheduleItem[] = [];
  const start = new Date(startDate);

  for (let i = 0; i < chequeCount; i++) {
    const dueDate = new Date(start);
    dueDate.setMonth(start.getMonth() + (12 / chequeCount) * i);
    items.push({
      chequeNumber: `CHQ-${100001 + i}`,
      bankName: 'Emirates NBD',
      dueDate: dueDate.toISOString().split('T')[0],
      amountAED: installmentAmount,
      status: 'Pending',
    });
  }
  return items;
}
```

---

## 4. UI Component Architecture (`LeasingIntakeModal.tsx`)

The React frontend presents a multi-step, red-accented wizard modal:

1. **Step 1: Applicant Identity & Passport Upload**
2. **Step 2: Employment & Income Affidavit**
3. **Step 3: Rent Payment & PDC Schedule Selection**
4. **Step 4: RERA Ejari Terms Acknowledgment**

```tsx
// Red & White styled UI Step Indicator
<div className="step-indicator" style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
  {[1, 2, 3, 4].map(step => (
    <div
      key={step}
      style={{
        flex: 1,
        height: '4px',
        background: currentStep >= step ? '#EF4444' : '#E2E8F0',
        borderRadius: '2px',
        transition: 'background 0.3s ease',
      }}
    />
  ))}
</div>
```

---

## 5. Regulatory & Verification Gates

- **RERA Rent Increase Index Check:** Intake rent figures are validated against the official DLD RERA Rent Calculator to prevent illegal rent inflation.
- **Form 12 Non-Renewal Verification:** Checks if a 12-month legal eviction notice was previously registered against the unit before allowing new lease intake.
- **Ejari Unified System Payload:** Auto-serializes submitted form entries into DLD-ready JSON payload for one-click Ejari registration.
