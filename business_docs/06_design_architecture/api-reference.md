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

**Version:** 1.0 | **Last Updated:** March 2026 | **Maintained By:** Technical Team
