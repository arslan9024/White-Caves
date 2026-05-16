# API Reference — White Caves CRM Platform

> **Version:** 1.0  
> **Last Updated:** March 2026  
> **Base URL:** `https://api.whitecaves.ae` (production) | `http://localhost:3001` (development)  
> **Auth:** Bearer JWT token in `Authorization` header

---

## Authentication

All API endpoints (except `/api/auth/*`) require:
```
Authorization: Bearer <jwt_token>
```

Tokens are obtained from POST `/api/auth/login` and expire after 24 hours.

---

## Standard Response Format

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

**Error:**
```json
{
  "success": false,
  "error": "Human-readable error message",
  "statusCode": 400
}
```

**Paginated:**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK — Success |
| 201 | Created — Resource created |
| 204 | No Content — Success, no body |
| 400 | Bad Request — Invalid input |
| 401 | Unauthorized — Missing or invalid JWT |
| 403 | Forbidden — Insufficient role |
| 404 | Not Found — Resource not found |
| 409 | Conflict — Duplicate record |
| 415 | Unsupported Media Type — Must use application/json |
| 429 | Too Many Requests — Rate limited |
| 500 | Internal Server Error |

---

## Rate Limits

| Endpoint Category | Limit |
|------------------|-------|
| General API | 100 requests/15 minutes/IP |
| Auth /login | 5 requests/15 minutes/IP |
| Auth /register | 3 requests/hour/IP |
| Auth /password | 3 requests/hour/IP |
| Auth /verify-2fa | 5 requests/15 minutes/IP |

---

## Auth Endpoints — `/api/auth`

### POST /api/auth/login
Login with email and password.

**Request:**
```json
{ "email": "agent@whitecaves.ae", "password": "SecurePass123!" }
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { "id": "...", "name": "Ahmed Hassan", "email": "...", "role": "agent" }
  }
}
```

**Response 200 (2FA enabled):**
```json
{ "success": true, "data": { "requiresOtp": true } }
```

### POST /api/auth/verify-2fa
Verify TOTP code for 2FA.

**Request:** `{ "email": "...", "code": "123456" }`

### POST /api/auth/register
Register a new user account.

**Request:** `{ "name": "Ahmed Hassan", "email": "...", "password": "...", "role": "agent" }`

### POST /api/auth/firebase-sync
Exchange Firebase ID token for platform JWT.

**Request:** `{ "idToken": "<firebase-id-token>" }`

### POST /api/auth/logout
Invalidate current session.

---

## Leads API — `/api/leads`

**Required Role:** Any authenticated user (agents see own; managers see all)

### GET /api/leads
List leads with filtering and pagination.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by: new, contacted, qualified, viewing, offered, negotiating, won, lost |
| `source` | string | Filter by: whatsapp, website, phone, referral, marketing, direct |
| `minScore` | number | Minimum lead score (0–100) |
| `maxScore` | number | Maximum lead score |
| `assignedTo` | string | Filter by agent user ID |
| `search` | string | Full-text search: name, email, phone, company |
| `sortBy` | string | Field to sort: createdAt, name, status, score, budget |
| `sortOrder` | string | asc or desc |
| `page` | number | Page number (default: 1) |
| `pageSize` | number | Items per page (default: 20, max: 100) |

### POST /api/leads
Create a new lead.

**Required Fields:** `name`, `phone`, `source`  
**Optional:** `email`, `company`, `budget`, `propertyType`, `timeline`, `notes`, `assignedToId`

### GET /api/leads/:id
Get single lead with activity timeline.

### PATCH /api/leads/:id
Update lead fields. Partial update supported.

### DELETE /api/leads/:id
Soft-delete lead (manager+ only).

### GET /api/leads/stats
Lead statistics aggregation.

**Response:**
```json
{
  "total": 150, "new": 23, "contacted": 45, "qualified": 32,
  "viewing": 18, "offered": 12, "won": 15, "lost": 5,
  "hotLeads": 28, "conversionRate": 10.0, "avgScore": 72
}
```

### POST /api/leads/:id/activities
Log an activity against a lead.

**Request:** `{ "type": "call", "description": "Discussed villa requirements", "outcome": "Interested", "duration": 15 }`

---

## Properties API — `/api/properties`

### GET /api/properties
List properties with advanced filtering.

**Query Parameters:** `status`, `type`, `area`, `minPrice`, `maxPrice`, `minBeds`, `minBaths`, `featured`, `search`, `sortBy`, `sortOrder`, `page`, `pageSize`

### POST /api/properties
Create a new property listing. (Agent / Manager)

**Required:** `title`, `type`, `status`, `price`, `location`, `bedrooms`, `bathrooms`, `sqft`

### GET /api/properties/:id
Property detail with agent and commission count.

### PATCH /api/properties/:id
Update property. Status change triggers RERA permit check.

### DELETE /api/properties/:id
Soft-delete (Admin+).

### GET /api/properties/stats
Aggregated statistics by type and status.

---

## Finance API — `/api/finance`

**Required Role:** Manager, Finance, Owner

### GET /api/finance/summary
Overall financial KPIs.

### GET /api/finance/commissions
List commissions with filters: `status`, `agentId`, `type`, `startDate`, `endDate`.

### GET /api/finance/commissions/:id
Commission detail.

### PATCH /api/finance/commissions/:id
Update commission (approve/reject/pay).

**Request:** `{ "status": "approved" }` or `{ "status": "paid", "paidAt": "2026-03-15", "paymentMethod": "bank_transfer", "paymentReference": "TRANS-001" }`

---

## Tenants API — `/api/tenants`

**Required Role:** Manager, Admin (PII restricted)

### GET /api/tenants
List tenants. Filters: `status`, `search`.

### POST /api/tenants
Create tenant record.

**Required:** `name`, `email`, `phone`, `nationality`

### GET /api/tenants/:id
Tenant detail.

### PATCH /api/tenants/:id
Update tenant.

### GET /api/tenants/stats
Tenant statistics.

---

## Transactions API — `/api/transactions`

### GET /api/transactions
List transactions. Filters: `status`, `type`.

### POST /api/transactions
Create transaction.

**Required:** `type`, `leadId`, `propertyId`, `agentId`, `offerPrice`, `status`

### GET /api/transactions/:id
Transaction detail.

### PATCH /api/transactions/:id
Update transaction status.

---

## Compliance API — `/api/compliance`

**Required Role:** Manager, Finance, Owner

### GET /api/compliance/status
Overall compliance health score.

### GET /api/compliance/requirements
List of RERA compliance requirements with pass/fail status.

---

## Agents API — `/api/agents`

**Required Role:** Manager, Admin (performance data)

### GET /api/agents
List agents with performance snapshot.

### GET /api/agents/:id
Agent detail with statistics.

---

## Dashboard / Reporting API — `/api/dashboard`

**Required Role:** Manager, Finance, Owner

### GET /api/dashboard/summary
Executive summary KPIs (leads, properties, agents, commissions, pipeline, recent activity).

### GET /api/dashboard/analytics
Detailed analytics (leads by source/status, properties by type, commission stats).

---

## CRM API — `/api/crm`

**Required Role:** Manager, Admin

### GET /api/crm/dashboard
CRM overview stats.

### GET /api/crm/analytics
CRM analytics.

### GET /api/crm/search
Global search. `?q=<query>` (min 2 chars). Returns leads, properties, agents.

---

## Communications API — `/api/communications`

### POST /api/communications/messages/send
Log / send an outbound message.

**Request:** `{ "recipientId": "...", "channel": "whatsapp|email|sms", "content": "..." }`

### GET /api/communications/conversations
List conversations. Filters: `leadId`, `status`, `channel`.

---

## AI Assistants API — `/api/assistants`

### GET /api/assistants
List all 24 AI assistant metadata entries.

### GET /api/assistants/:id/plan
Get the plan/documentation for a specific assistant (reads from `business_docs/03_ai_assistants/:id.md`).

### PUT /api/assistants/:id/plan
Update an assistant plan (Admin only). HTML injection prevented.

---

---

## Ejari API — `/api/ejari`

**Required Role:** Manager, Leasing, Admin  
**Rate Limit:** 30 requests/15 minutes/IP  
**Auth:** Bearer JWT required

### POST /api/ejari/register
Register a tenancy contract in Ejari (Dubai Land Department system).

**Request Body Schema:**
```json
{
  "leaseId": "string (ObjectId, required) — linked lease record",
  "tenantId": "string (ObjectId, required)",
  "landlordId": "string (ObjectId, required)",
  "propertyId": "string (ObjectId, required)",
  "contractStartDate": "string (ISO8601, required) — lease start date",
  "contractEndDate": "string (ISO8601, required) — lease end date, must be > start",
  "annualRentAED": "number (required) — annual rent in AED, min 1200",
  "securityDepositAED": "number (required) — min 0",
  "noOfCheques": "integer (required) — 1, 2, 4, 6, or 12",
  "tenancyContractUrl": "string (URL, required) — signed PDF stored in S3",
  "utilityAccountNumber": "string (optional) — DEWA account number"
}
```

**Validation Rules:**
- `contractEndDate` must be at least 30 days after `contractStartDate`
- `annualRentAED` must be consistent with `leaseId` monthly rent ±5% tolerance
- `noOfCheques` must be one of: 1, 2, 4, 6, 12
- Property must have RERA permit number before Ejari registration

**Response 201:**
```json
{
  "success": true,
  "data": {
    "ejariContractNumber": "EJARI-2026-00123456",
    "registrationDate": "2026-03-15T10:30:00Z",
    "expiryDate": "2027-03-14T23:59:59Z",
    "certificateUrl": "https://cdn.whitecaves.ae/ejari/EJARI-2026-00123456.pdf",
    "status": "registered",
    "leaseId": "64abc123def456"
  }
}
```

**Error Codes:**
| Code | Error | Cause |
|------|-------|-------|
| 400 | `INVALID_DATES` | contractEndDate ≤ contractStartDate |
| 400 | `INVALID_CHEQUES` | noOfCheques not in allowed values |
| 404 | `LEASE_NOT_FOUND` | leaseId does not exist |
| 409 | `ALREADY_REGISTERED` | Ejari already exists for this lease period |
| 422 | `RERA_PERMIT_MISSING` | Property has no valid RERA permit |
| 500 | `EJARI_API_UNAVAILABLE` | DLD Ejari system unreachable |

**cURL Example:**
```bash
curl -X POST https://api.whitecaves.ae/api/ejari/register \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "leaseId": "64abc123def456",
    "tenantId": "64def789ghi012",
    "landlordId": "64jkl345mno678",
    "propertyId": "64pqr901stu234",
    "contractStartDate": "2026-04-01",
    "contractEndDate": "2027-03-31",
    "annualRentAED": 72000,
    "securityDepositAED": 6000,
    "noOfCheques": 4,
    "tenancyContractUrl": "https://cdn.whitecaves.ae/leases/signed-001.pdf"
  }'
```

### GET /api/ejari/:ejariContractNumber
Retrieve Ejari registration details.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "ejariContractNumber": "EJARI-2026-00123456",
    "registrationDate": "2026-03-15",
    "expiryDate": "2027-03-14",
    "annualRentAED": 72000,
    "tenantName": "Mohammed Al Rashid",
    "propertyAddress": "Villa 12, DAMAC Hills 2, Dubai",
    "status": "registered",
    "certificateUrl": "https://cdn.whitecaves.ae/ejari/..."
  }
}
```

**Error Codes:**
| Code | Error | Cause |
|------|-------|-------|
| 401 | `UNAUTHORIZED` | Missing or expired JWT |
| 404 | `EJARI_NOT_FOUND` | Contract number not in system |

### GET /api/ejari
List all Ejari registrations. Filters: `status`, `propertyId`, `tenantId`, `startDate`, `endDate`, `page`, `pageSize`.

### PATCH /api/ejari/:ejariContractNumber/cancel
Cancel/terminate an Ejari registration (requires termination reason and supporting documents URL).

**Request:** `{ "reason": "mutual_agreement|breach|early_termination", "documentUrl": "string (URL)" }`

---

## DLD API — `/api/dld`

**Required Role:** Manager, Admin, Finance  
**Rate Limit:** 20 requests/15 minutes/IP  
**Auth:** Bearer JWT required

### POST /api/dld/transactions
Record a Dubai Land Department property transfer transaction.

**Request Body Schema:**
```json
{
  "transactionId": "string (ObjectId, required) — linked Transaction record",
  "propertyId": "string (ObjectId, required)",
  "buyerId": "string (ObjectId, required) — Lead or Tenant ID",
  "sellerId": "string (ObjectId, required)",
  "salePriceAED": "number (required) — min 100000",
  "transactionType": "string (required) — sale|transfer|gift|inheritance",
  "titleDeedNumber": "string (required) — existing title deed",
  "dldFeeAED": "number (required) — 4% of sale price (client-provided)",
  "adminFeeAED": "number (required) — typically AED 4000",
  "trusteeAppointmentDate": "string (ISO8601, optional)",
  "mortgageFlag": "boolean (required) — true if buyer using mortgage",
  "bankNOCUrl": "string (URL, required if mortgageFlag=true)"
}
```

**Validation Rules:**
- `dldFeeAED` must equal `salePriceAED × 0.04` ±AED 100 tolerance
- `adminFeeAED` minimum AED 580 per DLD schedule
- `titleDeedNumber` must match `propertyId` title deed in system
- If `mortgageFlag=true`, `bankNOCUrl` is mandatory

**Response 201:**
```json
{
  "success": true,
  "data": {
    "dldTransactionReference": "DLD-2026-TRF-000789",
    "transferDate": "2026-03-20T09:00:00Z",
    "newTitleDeedNumber": "TDN-2026-000789",
    "titleDeedUrl": "https://cdn.whitecaves.ae/dld/TDN-2026-000789.pdf",
    "registrationStatus": "completed",
    "transactionId": "64abc..."
  }
}
```

**Error Codes:**
| Code | Error | Cause |
|------|-------|-------|
| 400 | `INVALID_DLD_FEE` | dldFeeAED does not match 4% of sale price |
| 400 | `BANK_NOC_REQUIRED` | mortgageFlag=true but bankNOCUrl missing |
| 404 | `TRANSACTION_NOT_FOUND` | transactionId does not exist |
| 404 | `TITLE_DEED_MISMATCH` | titleDeedNumber not linked to propertyId |
| 409 | `TRANSFER_ALREADY_FILED` | DLD transfer already recorded for this transaction |
| 422 | `KYC_INCOMPLETE` | Buyer KYC status ≠ verified |

**cURL Example:**
```bash
curl -X POST https://api.whitecaves.ae/api/dld/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "transactionId": "64abc123",
    "propertyId": "64def456",
    "buyerId": "64ghi789",
    "sellerId": "64jkl012",
    "salePriceAED": 2000000,
    "transactionType": "sale",
    "titleDeedNumber": "TDN-2023-001234",
    "dldFeeAED": 80000,
    "adminFeeAED": 4000,
    "mortgageFlag": false
  }'
```

### GET /api/dld/transactions/:dldReference
Retrieve DLD transaction details by reference number.

### GET /api/dld/transactions
List all DLD transactions. Filters: `status`, `transactionType`, `startDate`, `endDate`, `agentId`, `page`, `pageSize`.

### GET /api/dld/compliance/status
Check DLD compliance status for all open transactions.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "pendingTransfers": 3,
    "overdueFiling": 1,
    "compliantTransactions": 45,
    "complianceScore": 95.6,
    "alerts": [
      { "transactionId": "64abc...", "issue": "DLD filing overdue by 5 days", "severity": "high" }
    ]
  }
}
```

---

## Commission API — `/api/commission`

**Required Role:** Manager, Finance, Owner (for approve/pay); Agent (view own)  
**Rate Limit:** 60 requests/15 minutes/IP  
**Auth:** Bearer JWT required

### GET /api/commission
List commissions with filters.

**Query Parameters:** `status`, `agentId`, `type`, `startDate`, `endDate`, `minAmount`, `maxAmount`, `page`, `pageSize`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "64abc123",
      "agentId": "64def456",
      "agentName": "Sarah Al Mansoori",
      "type": "sale",
      "transactionValue": 2000000,
      "grossAmountAED": 40000,
      "agentAmountAED": 20000,
      "brokerAmountAED": 20000,
      "status": "pending",
      "vatApplicable": true,
      "vatAmountAED": 2000,
      "createdAt": "2026-03-15T10:00:00Z"
    }
  ],
  "pagination": { "page": 1, "pageSize": 20, "total": 45, "totalPages": 3 }
}
```

### POST /api/commission
Create a commission record manually.

**Request Body Schema:**
```json
{
  "agentId": "string (ObjectId, required)",
  "transactionId": "string (ObjectId, required)",
  "propertyId": "string (ObjectId, required)",
  "type": "string (required) — sale|rental|referral|bonus|override",
  "transactionValueAED": "number (required) — gross deal value",
  "rate": "number (required) — decimal, e.g. 0.02 for 2%",
  "agentSplitPct": "number (required) — 0.0 to 1.0",
  "notes": "string (optional) — max 1000 chars",
  "vatApplicable": "boolean (required) — UAE VAT 5% applies to service fees"
}
```

**Validation Rules:**
- `agentSplitPct` + broker split must equal 1.0
- `rate` must be between 0.01 and 0.15 (1%–15%)
- Duplicate check: same `agentId + transactionId` returns 409
- `vatApplicable = true` triggers auto-calculation: `vatAmountAED = grossAmount × 0.05`

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "64new123",
    "grossAmountAED": 40000,
    "agentAmountAED": 20000,
    "brokerAmountAED": 20000,
    "vatAmountAED": 2000,
    "totalPayableAED": 22000,
    "status": "pending"
  }
}
```

**Error Codes:**
| Code | Error | Cause |
|------|-------|-------|
| 400 | `INVALID_RATE` | rate outside 0.01–0.15 range |
| 400 | `SPLIT_NOT_100` | agentSplitPct + brokerSplitPct ≠ 1.0 |
| 404 | `AGENT_NOT_FOUND` | agentId does not exist |
| 409 | `COMMISSION_EXISTS` | duplicate agentId + transactionId |

### PATCH /api/commission/:id/approve
Approve a pending commission. Requires Manager, Finance, or Owner role.

**Request:** `{ "approvedById": "string", "notes": "string (optional)" }`

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "64abc...", "status": "approved", "approvedAt": "2026-03-16T09:00:00Z" }
}
```

### PATCH /api/commission/:id/pay
Mark commission as paid.

**Request:**
```json
{
  "paidById": "string (ObjectId, required)",
  "paymentMethod": "string (required) — bank_transfer|cash|cheque",
  "paymentReference": "string (required) — bank ref or cheque number",
  "paidAt": "string (ISO8601, required)",
  "receiptUrl": "string (URL, optional)"
}
```

**Error Codes:**
| Code | Error | Cause |
|------|-------|-------|
| 403 | `INSUFFICIENT_ROLE` | Only manager/finance/owner may pay |
| 409 | `ALREADY_PAID` | commission status already = paid |
| 422 | `NOT_APPROVED` | commission must be approved before payment |

### GET /api/commission/agent/:agentId/summary
Agent commission summary by period.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "agentId": "64abc...",
    "agentName": "Ahmed Hassan",
    "periodStart": "2026-01-01",
    "periodEnd": "2026-03-31",
    "totalEarnedAED": 120000,
    "totalPaidAED": 80000,
    "pendingAED": 40000,
    "transactionCount": 6,
    "avgCommissionAED": 20000
  }
}
```

### POST /api/commission/rules
Create a commission rule (commission structure template).

**Request Body Schema:**
```json
{
  "name": "string (required) — e.g. Standard Sale 2%",
  "transactionType": "string (required) — sale|rental|referral",
  "rateType": "string (required) — percentage|fixed",
  "rateValue": "number (required) — decimal for %, AED amount for fixed",
  "agentSplitPct": "number (required) — 0.0–1.0",
  "minTransactionValueAED": "number (optional) — applies only above this threshold",
  "maxTransactionValueAED": "number (optional)",
  "isDefault": "boolean (required)",
  "validFrom": "string (ISO8601, required)",
  "validUntil": "string (ISO8601, optional)"
}
```

---

## Analytics API — `/api/analytics`

**Required Role:** Manager, Owner, Finance  
**Rate Limit:** 30 requests/15 minutes/IP  
**Auth:** Bearer JWT required

### GET /api/analytics/overview
KPI tiles for the executive dashboard.

**Query Parameters:** `startDate`, `endDate`, `agentId (optional)`, `area (optional)`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "period": { "start": "2026-01-01", "end": "2026-03-31" },
    "leads": {
      "total": 450, "new": 82, "hot": 34, "won": 28, "lost": 15,
      "conversionRate": 6.2, "avgScore": 68
    },
    "properties": {
      "total": 9378, "available": 4200, "reserved": 310, "sold": 890, "rented": 3978
    },
    "revenue": {
      "totalAED": 2850000, "salesCommissionAED": 1600000, "rentalCommissionAED": 720000,
      "managementFeeAED": 530000, "vatCollectedAED": 142500
    },
    "pipeline": {
      "activeDealsCount": 23, "totalPipelineValueAED": 18500000
    },
    "agents": {
      "totalActive": 47, "avgDealsPerAgent": 2.3, "topAgentId": "64abc...", "topAgentRevenue": 320000
    }
  }
}
```

### GET /api/analytics/leads
Lead funnel and source attribution analytics.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "funnel": [
      { "stage": "new", "count": 82 }, { "stage": "contacted", "count": 61 },
      { "stage": "qualified", "count": 44 }, { "stage": "viewing", "count": 29 },
      { "stage": "offered", "count": 18 }, { "stage": "won", "count": 12 }
    ],
    "bySource": [
      { "source": "whatsapp", "count": 180, "conversionRate": 8.2 },
      { "source": "property_finder", "count": 110, "conversionRate": 5.5 },
      { "source": "bayut", "count": 90, "conversionRate": 4.8 },
      { "source": "referral", "count": 70, "conversionRate": 14.3 }
    ],
    "avgDaysToClose": 28,
    "responseTimeMinutesAvg": 4.2
  }
}
```

### GET /api/analytics/revenue
Revenue breakdown with VAT reconciliation.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "period": { "start": "2026-01-01", "end": "2026-03-31" },
    "grossRevenueAED": 2850000,
    "vatCollectedAED": 142500,
    "netRevenueAED": 2707500,
    "byStream": [
      { "stream": "sale_commission", "amountAED": 1600000, "vatAED": 80000, "transactions": 32 },
      { "stream": "rental_commission", "amountAED": 720000, "vatAED": 36000, "leases": 24 },
      { "stream": "property_management", "amountAED": 530000, "vatAED": 26500, "units": 95 }
    ],
    "byAgent": [
      { "agentId": "64abc...", "agentName": "Sarah Al Mansoori", "totalAED": 320000, "deals": 8 }
    ],
    "monthlyTrend": [
      { "month": "2026-01", "revenueAED": 890000 },
      { "month": "2026-02", "revenueAED": 950000 },
      { "month": "2026-03", "revenueAED": 1010000 }
    ]
  }
}
```

### GET /api/analytics/agents
Agent performance leaderboard and KPIs.

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "agentId": "64abc...",
      "agentName": "Sarah Al Mansoori",
      "reraLicenseNumber": "BRN-12345",
      "reraExpiryDate": "2026-12-31",
      "dealsClosedCount": 8,
      "totalCommissionEarnedAED": 320000,
      "leadsAssigned": 45,
      "viewingsCompleted": 18,
      "conversionRate": 17.8,
      "avgDaysToClose": 22,
      "npsScore": 4.7
    }
  ]
}
```

### GET /api/analytics/properties
Property market analytics — price trends, inventory turnover.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "inventory": { "total": 9378, "available": 4200, "absorption_rate": 12.3 },
    "byType": [
      { "type": "villa", "count": 1200, "avgPriceAED": 3500000, "avgDaysOnMarket": 45 },
      { "type": "apartment", "count": 5800, "avgPriceAED": 950000, "avgDaysOnMarket": 28 }
    ],
    "byArea": [
      { "area": "DAMAC Hills 2", "count": 4200, "avgPriceAED": 1200000, "yieldPct": 6.8 }
    ],
    "priceIndexTrend": [
      { "month": "2026-01", "avgPricePerSqftAED": 820 },
      { "month": "2026-02", "avgPricePerSqftAED": 835 },
      { "month": "2026-03", "avgPricePerSqftAED": 848 }
    ]
  }
}
```

### POST /api/analytics/export
Generate async analytics report export (CSV or PDF).

**Request:**
```json
{
  "reportType": "string (required) — leads|revenue|agents|properties|commissions",
  "format": "string (required) — csv|pdf|excel",
  "startDate": "string (ISO8601, required)",
  "endDate": "string (ISO8601, required)",
  "filters": "object (optional) — additional filters"
}
```

**Response 202:**
```json
{
  "success": true,
  "data": { "jobId": "export-2026-001", "status": "queued", "estimatedReadySec": 30 }
}
```

### GET /api/analytics/export/:jobId
Poll export job status; returns download URL when ready.

---

## Enhanced Endpoint Documentation — Existing Endpoints

### POST /api/leads (Full Schema)

**Auth:** Bearer JWT required  
**Rate Limit:** 100 requests/15 min/IP

**Request Body Schema:**
```json
{
  "name": "string (required) — 2–100 chars, letters/spaces/hyphens only",
  "phone": "string (optional) — E.164 format, e.g. +971501234567",
  "email": "string (optional) — valid email; at least phone or email required",
  "company": "string (optional) — max 100 chars",
  "source": "string (required) — whatsapp|website|phone|referral|marketing|direct|property_finder|bayut|walk_in|exhibition|social_media|developer_referral",
  "budget": "number (optional) — AED, min 50000",
  "propertyType": "string (optional) — villa|apartment|townhouse|studio|penthouse|commercial|land",
  "location": "string (optional) — preferred area, max 100 chars",
  "timeline": "string (optional) — urgent|1-3-months|3-6-months|future",
  "notes": "string (optional) — max 5000 chars",
  "assignedToId": "string (ObjectId, optional) — agent user ID",
  "tags": "string[] (optional) — each max 50 chars, max 10 tags"
}
```

**Error Codes:**
| Code | Error | Cause |
|------|-------|-------|
| 400 | `PHONE_OR_EMAIL_REQUIRED` | Both phone and email missing |
| 400 | `INVALID_PHONE_FORMAT` | Phone not E.164 |
| 409 | `DUPLICATE_LEAD` | Same phone already exists |
| 422 | `INVALID_SOURCE` | source not in enum |

**cURL Example:**
```bash
curl -X POST https://api.whitecaves.ae/api/leads \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Ahmed Hassan","phone":"+971501234567","source":"whatsapp","budget":1500000,"propertyType":"villa","timeline":"3-6-months"}'
```

### POST /api/properties (Full Schema)

**Auth:** Bearer JWT required — Agent or Manager role  
**Rate Limit:** 50 requests/15 min/IP

**Request Body Schema:**
```json
{
  "title": "string (required) — 5–200 chars",
  "description": "string (optional) — max 5000 chars",
  "type": "string (required) — apartment|villa|penthouse|commercial|land|townhouse|studio|hotel_apartment",
  "status": "string (required) — draft|available|reserved|sold|rented|off_market|pending_listing",
  "priceAED": "number (required) — min 50000",
  "monthlyRentAED": "number (optional) — required if status=rented",
  "bedrooms": "integer (required) — 0 (studio) to 20",
  "bathrooms": "integer (required) — 0 to 20",
  "sqft": "number (required) — min 100",
  "location": "string (required) — max 200 chars",
  "area": "string (optional) — community/neighbourhood name",
  "latitude": "number (optional) — -90 to 90",
  "longitude": "number (optional) — -180 to 180",
  "permitNumber": "string (optional) — RERA Trakheesi permit, required before status=available",
  "permitExpiryDate": "string (ISO8601, optional) — must be future date",
  "dldReference": "string (optional) — unique DLD reference",
  "amenities": "string[] (optional) — each max 50 chars",
  "images": "string[] (optional) — max 50 CDN URLs",
  "featured": "boolean (optional) — default false"
}
```

**Validation Rules:**
- `status = available` requires `permitNumber` to be set
- `permitExpiryDate` must be in the future when setting `status = available`
- `latitude` and `longitude` must both be present or both absent

**Error Codes:**
| Code | Error | Cause |
|------|-------|-------|
| 400 | `PERMIT_REQUIRED_FOR_PUBLISH` | status=available but no permitNumber |
| 400 | `PERMIT_EXPIRED` | permitExpiryDate is in the past |
| 409 | `DLD_REFERENCE_EXISTS` | dldReference already in system |

### POST /api/auth/login (Enhanced)

**Rate Limit:** 5 requests/15 min/IP — brute-force protection  
**Auth:** None required

**Request Body:**
```json
{
  "email": "string (required) — valid email",
  "password": "string (required) — min 8 chars",
  "deviceId": "string (optional) — for session tracking"
}
```

**Error Codes:**
| Code | Error | Cause |
|------|-------|-------|
| 400 | `INVALID_EMAIL` | email format invalid |
| 401 | `INVALID_CREDENTIALS` | wrong email or password |
| 403 | `ACCOUNT_SUSPENDED` | user status = suspended |
| 403 | `PENDING_APPROVAL` | user status = pending_approval |
| 429 | `RATE_LIMIT_EXCEEDED` | >5 attempts in 15 min |

---

## Webhooks — `/api/webhooks`

### POST /api/webhooks/meta
WhatsApp Cloud API inbound message webhook.

**Verification (GET):** `?hub.mode=subscribe&hub.verify_token=<secret>&hub.challenge=<num>` — returns challenge number.

**Message Payload (POST):**
```json
{
  "object": "whatsapp_business_account",
  "entry": [{
    "id": "WABA_ID",
    "changes": [{
      "value": {
        "messaging_product": "whatsapp",
        "messages": [{
          "from": "+971501234567",
          "id": "wamid.xxx",
          "timestamp": "1709123456",
          "text": { "body": "I am interested in a villa in DAMAC Hills 2" },
          "type": "text"
        }]
      }
    }]
  }]
}
```

**HMAC Signature Validation:** `X-Hub-Signature-256: sha256=<hmac>` — verified server-side using `WHATSAPP_APP_SECRET`.

---

**Version:** 2.0 | **Last Updated:** May 2026 | **Maintained By:** Technical Team (@Mira)
