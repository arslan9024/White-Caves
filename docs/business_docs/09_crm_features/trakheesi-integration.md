# Trakheesi Permit Integration — CRM Feature Specification

<!-- markdownlint-disable MD032 MD040 MD060 -->

> **Status:** Active -- requirement catalog expanded.
> **Module Owner:** Compliance (Laila AI) + Listing Engine
> **Last Updated:** May 2026
> **Next Review:** 2026-08-21
> **Source of Truth:** CRM Trakheesi permit integration feature specification (business layer)
> **Priority:** Critical — AED 50,000 penalty per violation (RERA Circular No. 4 of 2021)
> **API Endpoints:** `/api/compliance/trakheesi`, DLD Trakheesi REST API

## Canonical governance links

- [`../05_requirements/compliance-requirements.md`](../05_requirements/compliance-requirements.md)
- [`../05_requirements/functional-requirements.md`](../05_requirements/functional-requirements.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)

## Feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- frontend compliance/publishing lanes in `docs/plans/waves/WAVE_39_*` and `WAVE_40_*`

---

## Overview

Trakheesi is RERA's mandatory property advertising permit system. Every property advertised in Dubai — on portals, social media, or any other channel — must have a valid Trakheesi permit number issued by RERA/DLD. White Caves CRM automates permit validation, expiry tracking, and renewal workflows to ensure zero advertising violations.

**Key Capabilities:**
- Permit validation against DLD Trakheesi API before listing goes live
- Automated expiry alerts (60/30/7 days before expiry)
- Bulk permit renewal workflow for portfolio managers
- Auto-blocking of listing publication when permit is missing or expired
- Permit number displayed on all listing exports and portal feeds
- Audit trail of all permit checks

## Requirement catalog

### REQ-TRK-001: Permit validation before publication

The system shall validate Trakheesi permit presence and freshness before listing publication.

**Acceptance criteria:**

- [ ] Missing permits block publication
- [ ] Expired or expiring permits trigger warnings and renewal routing
- [ ] Validation checks are logged per property

**Evidence:** publication gate log and permit verification history.

### REQ-TRK-002: Expiry tracking and escalation

The system shall monitor permit expiry and alert agents, managers, and owners on schedule.

**Acceptance criteria:**

- [ ] 60/30/7-day alerts are generated
- [ ] Expired permits are withdrawn from portal feeds
- [ ] Escalation paths are auditable

**Evidence:** expiry alert log and withdrawal record.

### REQ-TRK-003: Validation API proxy and audit trail

The system shall expose a CRM proxy for permit validation and keep a durable audit trail.

**Acceptance criteria:**

- [ ] Validate and status endpoints are available
- [ ] API responses are sanitized before storage
- [ ] Verification events include trigger source and result

**Evidence:** API proxy log and verification audit trail.

### REQ-TRK-004: Renewal workflow and compliance dashboard

The system shall support manual renewal steps, bulk renewal review, and compliance dashboard reporting.

**Acceptance criteria:**

- [ ] Renewal requests can be initiated from a property record
- [ ] Bulk expiring permit reports can be exported
- [ ] Dashboard widgets show active, expiring, expired, and missing counts

**Evidence:** renewal request record and compliance dashboard snapshot.

## Traceability

- Maps to `REQ-PROP-001`, `REQ-SYNC-001`, and listing compliance coverage
- Aligns to `WC-SRS-001`, `WC-SRS-014`, and permit evidence artifacts
- Feeds publication, syndication, and compliance validation

---

## Regulatory Context

| Regulation | Requirement | Penalty |
|-----------|-------------|---------|
| RERA Circular No. 4 of 2021 | Every advertised property must carry a valid Trakheesi permit | AED 50,000 per violation |
| RERA Law No. 16 of 2007 | Broker must be licensed; listing must include permit + agent BRN | License suspension for repeat violations |

---

## Data Model

### Property — Trakheesi Fields

```typescript
Property {
  // existing fields ...
  permitNumber: string;              // Trakheesi permit number — required before listing
  permitExpiryDate: Date;            // permit validity end date
  permitStatus: PermitStatus;
  permitIssuedAt?: Date;             // date permit was issued
  permitLastVerifiedAt?: Date;       // date of last DLD API validation
  permitVerificationResult?: 'valid' | 'invalid' | 'expired' | 'not_found';
}

type PermitStatus = 'active' | 'expiring_soon' | 'expired' | 'missing' | 'pending_renewal';
```

### PermitVerificationLog (audit trail)

```typescript
PermitVerificationLog {
  id: string;
  propertyId: string;
  permitNumber: string;
  verifiedAt: Date;
  result: 'valid' | 'invalid' | 'expired' | 'not_found';
  dldResponse?: object;             // raw DLD API response (sanitised)
  triggeredBy: 'auto' | 'agent' | 'cron' | 'publish_gate';
  agentId?: string;
}
```

---

## DLD Trakheesi API Integration

### Authentication

- **Type:** API Key (issued by DLD after broker registration)
- **Header:** `Authorization: Bearer {DLD_TRAKHEESI_API_KEY}`
- **Base URL:** `https://trakheesi.dubailand.gov.ae/api/v1` (production)
- **Sandbox:** Available via DLD developer portal after account creation

### Endpoints Used

| Method | DLD Endpoint | Purpose |
|--------|-------------|---------|
| `GET` | `/permits/{permitNumber}` | Validate a specific permit + get details |
| `POST` | `/permits/validate` | Batch validate up to 50 permits |
| `POST` | `/permits/apply` | Apply for a new permit (if DLD API supports; else manual) |

### CRM Proxy Endpoints

| Method | CRM Path | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/compliance/trakheesi/validate` | Agent+ | Validate permit number against DLD API |
| `GET` | `/api/compliance/trakheesi/status/:propertyId` | Agent+ | Get permit status for a property |
| `POST` | `/api/compliance/trakheesi/bulk-validate` | Manager+ | Validate permits for multiple properties |
| `GET` | `/api/compliance/trakheesi/expiring` | Manager+ | List permits expiring within N days |
| `POST` | `/api/compliance/trakheesi/renewal-request/:propertyId` | Agent | Flag a permit for renewal workflow |

### Validation Request/Response

```typescript
// POST /api/compliance/trakheesi/validate
interface TrakheesiValidateRequest {
  propertyId: string;
  permitNumber: string;
}

interface TrakheesiValidateResponse {
  propertyId: string;
  permitNumber: string;
  status: 'valid' | 'invalid' | 'expired' | 'not_found';
  expiryDate?: string;           // ISO 8601
  propertyAddress?: string;      // from DLD record
  agentBrn?: string;             // BRN on the permit
  validatedAt: string;           // ISO 8601
  source: 'dld_api' | 'cache';  // 'cache' if validated within last 24h
}
```

---

## Permit Publication Gate

The listing publication workflow enforces a hard gate before any property can be set to `Listed` status or pushed to portal feeds:

```
Agent clicks "Publish Listing"
    ↓
System checks: permitNumber present?
    ├── NO → Error: "Trakheesi permit number required before listing can go live"
    └── YES → Check: permitExpiryDate > today + 7 days?
                  ├── NO (expired or expiring) → Error: "Permit expired or expiring within 7 days. Renew before publishing."
                  └── YES → Validate via DLD API
                                ├── invalid/not_found → Error: "Permit number not found in RERA Trakheesi system. Check permit number and retry."
                                └── valid → Allow listing publication ✅
```

### Gate Enforcement Points

1. **CRM listing form** — Client-side warning when `permitNumber` field is empty
2. **`POST /api/properties/:id/publish`** — Server-side gate; returns HTTP 422 with structured error if gate fails
3. **Portal syndication service** — Second gate; blocks feed inclusion even if CRM status is somehow `Listed`
4. **Export service** — Permit number required on all exported PDFs; redacted with `[PERMIT REQUIRED]` if missing

---

## Permit Expiry Tracking & Alerts

### Expiry Alert Schedule

| Trigger | Action | Recipient |
|---------|--------|-----------|
| 60 days before expiry | Email + CRM notification | Listing agent + manager |
| 30 days before expiry | Email + WhatsApp + CRM alert | Agent + manager + owner |
| 7 days before expiry | Urgent alert + auto-draft renewal request | Agent + manager |
| Day of expiry | Auto-set `permitStatus = 'expired'`; auto-withdraw from portal feeds | System (cron) |
| 1 day after expiry | Escalation alert | Owner + compliance officer |

### Cron Job Schedule

```
// runs every 6 hours
cron: '0 */6 * * *'
job: TrakheesiExpiryCheckJob
  1. Query all properties where permitStatus IN ('active', 'expiring_soon')
  2. For each: compare permitExpiryDate to today
  3. Update permitStatus accordingly
  4. Trigger appropriate alerts
  5. For expired: call SyndicationService.withdraw(propertyId, all_portals)
  6. Log results in PermitVerificationLog
```

---

## Permit Renewal Workflow

### Manual Renewal (Current Process via RERA Portal)

RERA currently does not offer a fully automated API for permit application. The renewal workflow in CRM is:

1. Agent clicks "Renew Permit" on a property record
2. CRM opens the RERA Trakheesi portal URL in a new tab: `https://trakheesi.dubailand.gov.ae`
3. CRM pre-fills a renewal request form with property details and current permit number (for agent reference)
4. Agent completes renewal on RERA portal (typically takes 1–3 working days; fee: AED 1,020 per permit)
5. Agent enters new permit number and new expiry date in CRM
6. CRM validates new permit via DLD API; updates `permitNumber`, `permitExpiryDate`, `permitStatus`
7. Listing automatically re-published to portal feeds on successful renewal

### Bulk Renewal Workflow (Portfolio Manager)

For portfolios with 10+ permits expiring in the same period:
1. Manager runs "Bulk Permit Report" from `/crm/compliance/trakheesi`
2. Report shows all properties with permits expiring within 60 days
3. Manager exports CSV (propertyId, address, current permit, expiry date)
4. Manager submits renewal batch via RERA portal
5. On return, manager bulk-uploads renewed permit numbers via CSV import
6. System validates each new permit number via DLD API; updates records

### Permit Renewal Cost

| Service | Fee |
|---------|-----|
| New permit application (residential) | AED 1,020 |
| New permit application (commercial) | AED 1,020 |
| Renewal | Same as new application |

---

## Compliance Dashboard — Trakheesi Section

Located in CRM Compliance module (`/crm/compliance/trakheesi`):

| Widget | Description |
|--------|-------------|
| Permit Health Overview | Active / Expiring Soon / Expired / Missing counts |
| Expiring This Month | Table: property, address, permit number, days until expiry |
| Expired Permits | Table: properties with expired permits; auto-withdrawn from portals |
| Missing Permits | Table: listed properties without a permit number |
| Permit Verification History | Log of all API checks with timestamp and result |

---

## Error Handling

| Scenario | CRM Behaviour |
|----------|--------------|
| DLD API timeout (> 10 seconds) | Use cached validation result if < 24 hours old; if cache miss, show warning and allow agent to override with manager approval |
| DLD API returns 503 | Queue retry (3 attempts, 5 min backoff); alert compliance officer if all retries fail |
| Permit number format invalid | Client-side + server-side validation: format must match `RERA-[0-9]{7}` or `[0-9]{7}` |
| DLD returns `not_found` | Show error: "Permit not found in RERA system. Check the number or contact RERA on 800-RERA"; do not block agent from saving draft |

---

## Acceptance Criteria

- [ ] Agent cannot set property to `Listed` status without a valid Trakheesi permit number
- [ ] DLD API validation called on every listing publish; result logged in `PermitVerificationLog`
- [ ] Permit expiry date stored; system sends alert at 60/30/7 days before expiry
- [ ] Expired permit auto-withdraws listing from all portal feeds within 1 hour
- [ ] Permit number displayed on: listing detail page, all exported PDFs, portal XML feed
- [ ] Compliance dashboard shows live count of active/expiring/expired/missing permits
- [ ] DLD API timeout falls back to cached result (< 24h) or manager-override with audit trail
- [ ] `GET /api/compliance/trakheesi/expiring?days=30` returns paginated list of permits expiring within 30 days
