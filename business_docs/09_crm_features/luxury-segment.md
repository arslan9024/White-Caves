# Luxury Segment CRM (KairosLuxury)

> **Owner:** @Marissa | **Tool:** Google AI Studio (Gemini 2.0 Flash)
> **Module:** KairosLuxuryCRM
> **Status:** Production-ready specification

`CONSUMES←@Annie: business_docs/09_crm_features/tenant-portal.md#ux-requirements`
`FEEDS→@Rachel: business_docs/06_design_architecture/ui-ux-specification.md#seo-ux-copy`

---

## 1. Overview

The KairosLuxury module is White Caves' dedicated workflow for High-Net-Worth Individual (HNWI) clients and ultra-premium listings. It extends the standard lead and property pipelines with concierge-grade tooling: private viewings with NDA enforcement, dedicated agent assignment, white-glove logistics, and CBUAE AML enhanced due diligence.

**Luxury scope:** Any deal meeting one or more of the following thresholds is automatically elevated to luxury status and handled through this module.

---

## 2. Luxury Threshold Definition

| Threshold Type | Value | Auto-Tag Rule |
|----------------|-------|---------------|
| Sale price | AED 5,000,000+ | `property.salePrice >= 5_000_000` |
| Monthly rent | AED 30,000+ / month | `lease.monthlyRent >= 30_000` |
| Primary area — sale | Palm Jumeirah, DIFC, Emirates Hills, Jumeirah Bay Island | Always luxury regardless of price |
| Primary area — rent | Palm Jumeirah, DIFC, Bluewaters | Always luxury |
| Property type | Penthouse (any area) | Always luxury |

When threshold is met, `lead.isLuxury = true` and `lead.luxuryTier` is set:

| Tier | Sale Price Range | Features Unlocked |
|------|-----------------|-------------------|
| `premium` | AED 5M–10M | Dedicated agent, priority viewings |
| `ultra` | AED 10M–25M | Chauffeur option, NDA required |
| `ultra_plus` | AED 25M+ | Full concierge, committee approval |

---

## 3. VIP Client Profile

```ts
interface LuxuryClientProfile {
  leadId: string;
  isLuxury: true;
  luxuryTier: 'premium' | 'ultra' | 'ultra_plus';
  dedicatedAgentId: string;           // manually assigned by owner/manager
  conciergeServiceActive: boolean;
  privateViewingOnly: boolean;        // hides listing from public portal
  ndaRequired: boolean;               // enforced for ultra/ultra_plus
  ndaSignedAt?: string;
  ndaDocumentId?: string;
  chauffeurRequired: boolean;
  specialRequirements: string[];
  hnwiVerified: boolean;              // AML enhanced due diligence passed
  sourceOfFunds?: 'declared' | 'pending' | 'cleared';
  pepScreeningStatus?: 'clear' | 'flagged' | 'pending';
}
```

---

## 4. White-Glove Workflow

### 4.1 Initial Contact → Concierge Onboarding

```
Luxury Lead Created
  ↓
Auto-assign dedicated luxury agent (round-robin among luxury-certified agents)
  ↓
Agent receives WhatsApp notification via Linda: "New ultra lead — AED 12M Palm Jumeirah villa"
  ↓
Agent calls within 2 hours (SLA), logs call in CRM
  ↓
NDA sent via DocuSign (if luxuryTier ≥ 'ultra')
  ↓
Private viewing scheduled (hidden from public calendar)
  ↓
Concierge logistics arranged (chauffeur, welcome package, refreshments note)
```

### 4.2 Private Viewing Booking

- Viewings created with `viewing.isPrivate = true` — excluded from public-facing availability
- NDA check enforced before confirmation: system blocks if `ndaRequired && !ndaSignedAt`
- Viewing preparation checklist emailed to agent 24h before:
  - Keys retrieved from office safe
  - Welcome package prepared (branded folder, floor plan, area guide)
  - Chauffeur booking confirmed (if `chauffeurRequired`)
  - Building access cleared with security

### 4.3 Post-Viewing Gift Coordination

- After completed viewing: agent logs gift in CRM (`luxuryViewing.giftCoordinated: boolean`)
- Gift options managed in `SystemSetting.luxuryGiftOptions` (flowers, champagne, branded item)
- Gift cost logged to deal expense for P&L tracking

---

## 5. Luxury Listing Requirements

All luxury listings must satisfy these quality gates before activation:

| Requirement | Minimum | Preferred |
|-------------|---------|-----------|
| Professional photos | 30 | 50+ |
| Matterport 3D tour | Required | — |
| Drone / aerial footage | Required (ultra+) | All luxury |
| Video walkthrough | Optional | Recommended |
| Floor plan (CAD quality) | Required | With furniture layout |
| Lifestyle description | 200+ words | 400+ words |
| Bilingual (EN + AR) | Required | — |
| Price on request | Allowed for ultra_plus | — |

Property quality score for luxury: minimum 80/100 (standard is 60).

---

## 6. HNWI Compliance (AML / CBUAE)

Per CBUAE AML guidelines for real estate transactions > AED 55,000:

### 6.1 Source of Funds Declaration

```ts
interface SourceOfFundsDeclaration {
  clientId: string;
  declarationDate: string;
  fundSources: Array<{
    type: 'salary' | 'business_income' | 'investment' | 'inheritance' | 'loan' | 'other';
    description: string;
    amountAED: number;
    supportingDocument?: string;      // file path
  }>;
  totalDeclaredAED: number;
  verifiedByAgentId: string;
  complianceStatus: 'pending' | 'cleared' | 'escalated';
  escalatedToComplianceOfficer?: boolean;
}
```

### 6.2 PEP Screening

- Politically Exposed Person (PEP) check run on all luxury clients
- Check provider: manual via RERA/internal watch-list (API integration roadmap item)
- Status tracked in `LuxuryClientProfile.pepScreeningStatus`
- Flagged PEPs escalated to compliance officer; deal on hold until cleared

### 6.3 Enhanced Due Diligence Checklist

| Document | Ultra | Ultra Plus |
|----------|-------|-----------|
| Passport copy (certified) | ✅ | ✅ |
| Emirates ID (if UAE resident) | ✅ | ✅ |
| Source of funds declaration | ✅ | ✅ |
| Bank reference letter | Optional | ✅ |
| Company/trust ownership structure | If buying via entity | ✅ |
| PEP screening clearance | ✅ | ✅ |

---

## 7. API Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/luxury/leads` | owner/manager | List all luxury leads with tier |
| PATCH | `/api/luxury/leads/:id` | owner/manager | Update luxury profile fields |
| POST | `/api/luxury/leads/:id/assign-agent` | owner/manager | Set dedicated luxury agent |
| POST | `/api/luxury/leads/:id/nda` | agent+ | Record NDA signed event |
| GET | `/api/luxury/viewings` | agent+ | List private viewings (own or all) |
| POST | `/api/luxury/viewings/:id/gift` | agent | Log gift coordination |
| POST | `/api/luxury/compliance/:clientId` | manager+ | Submit EDD document |

---

## 8. Validation Rules

| Rule | Logic | Error |
|------|-------|-------|
| NDA before viewing | `ndaRequired && !ndaSignedAt` → block | 422 |
| AML clearance before offer | `pepScreeningStatus !== 'clear'` → block | 422 |
| Luxury agent assignment | Only agents with `isLuxuryCertified = true` | 400 |
| Property quality score | Must be ≥ 80 before `isLuxury` listing goes live | 422 |

---

## 9. Failure and Edge Handling

| Scenario | Handling |
|----------|----------|
| NDA DocuSign timeout | Manual upload fallback, agent uploads signed PDF |
| Chauffeur booking fails | Alert agent, CRM note, manual arrangement |
| AML flagged mid-deal | Deal status → `on_hold`, notify compliance officer |
| Luxury agent unavailable | Escalate to owner for manual assignment |

---

## 10. Security & Compliance Controls

- Luxury client profiles are `dataAccessLevel: 'restricted'` — only owner, manager, assigned agent
- Source of funds documents stored in encrypted folder (`uploads/compliance/edd/`)
- PEP flag triggers automatic activity log entry and manager notification
- All luxury interactions logged to `henry_audit_log` with `entityType: 'luxury_client'`

---

## 11. UX States (CRM — Desktop + Mobile)

| State | Display |
|-------|---------|
| Lead is luxury | Gold badge "🏆 LUXURY" in lead card header |
| NDA required but pending | Orange warning banner "NDA required before viewing" |
| Viewing confirmed | Green "Viewing Confirmed — Private" with chauffeur icon if applicable |
| AML pending | Yellow banner "Compliance review in progress" |
| Deal on hold (AML flag) | Red banner "Deal on hold — compliance escalation" |
| Mobile (375px) | Luxury tier badge still visible, NDA status chip below name |

---

## 12. Tests

| Test | Type | Target |
|------|------|--------|
| Lead auto-tagged as luxury when price ≥ 5M | Unit | threshold logic |
| NDA check blocks viewing when required | Unit | validation |
| `/api/luxury/leads` returns 403 for agent without luxury access | Integration | RBAC |
| PEP flag sets deal to `on_hold` | Unit | compliance engine |
| Property quality score ≥ 80 required | Unit | listing gate |

---

## 13. Rollback / Migration Plan

- `isLuxury` and `luxuryTier` are additive fields — no existing records break
- EDD documents: file-based, no migration if path convention changes
- Luxury threshold values configurable in `SystemSetting.luxuryThresholds` — update without redeploy