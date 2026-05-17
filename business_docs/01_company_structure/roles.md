# User Roles & Permissions - White Caves Real Estate LLC

## Role Hierarchy & Access Model

### 1. Owner / Managing Director (MD)
- **System Role ID**: `owner`
- **Business Title**: Managing Director, Owner
- **Access Level**: ⭐⭐⭐⭐⭐ (Full/Complete)
- **Data Visibility**: All departments, all data
- **Page Access**:
  - Executive Dashboard (Zoe insights)
  - All departmental CRMs (Clara, Mary, Nadia, etc.)
  - Financial reports (Theodora)
  - Compliance dashboard (Laila)
  - Performance analytics (Zoe)
  - System health & monitoring (Aurora)
- **Key Features**:
  - View all KPIs and business metrics
  - Approve major decisions (commissions, budgets, strategies)
  - Access to Zoe (Executive Assistant with all data)
  - Strategic planning tools
  - Full audit trails
- **Typical User**: 1 (CEO/Owner)
- **Permissions**: Create, Read, Update, Delete (all data)

### 2. Admin
- **System Role ID**: `admin`
- **Business Title**: Administrator, Operations Manager
- **Access Level**: ⭐⭐⭐⭐ (Very High)
- **Data Visibility**: Most departments except financials
- **Page Access**:
  - Admin dashboard
  - User management
  - Department coordination
  - System configuration
  - Reporting tools
  - Performance tracking
- **Key Features**:
  - User account management
  - Role & permission administration
  - System health monitoring
  - Data import/export (Excel, CSV)
  - Backup & recovery operations
- **Typical Users**: 1-2 (System admins)
- **Permissions**: Create, Read, Update (most); Delete (with approval)

### 3. Sales Agent / Secondary Sales Agent
- **System Role ID**: `secondary-sales-agent`
- **Business Title**: Sales Agent, Broker
- **Access Level**: ⭐⭐⭐ (High)
- **Data Visibility**: Own leads, assigned deals, team performance
- **Page Access**:
  - Clara Leads CRM (own leads)
  - Sophia Pipeline (own deals)
  - Nadia WhatsApp (shared inbox + personal)
  - Sales dashboard
  - Property listings
  - Client management
- **Key Features**:
  - Lead management (create, qualify, nurture)
  - Deal tracking & closure
  - Commission tracking (own only)
  - Activity timeline
  - Client communications (WhatsApp via Nadia)
  - Personal performance metrics
- **Typical Users**: 8+ (Sales team)
- **Permissions**: Create, Read, Update (own & assigned); Limited Delete

### 4. Landlord
- **System Role ID**: `landlord`
- **Business Title**: Property Owner, Landlord
- **Access Level**: ⭐⭐ (Medium)
- **Data Visibility**: Own properties, leases, tenant info
- **Page Access**:
  - Property management dashboard
  - Daisy Leasing CRM (their properties)
  - Maintenance requests
  - Lease management
  - Financial reports (rent collected)
  - Tenant communications
- **Key Features**:
  - Property listing & management
  - Lease creation & management
  - Maintenance request submission
  - Rent payment tracking
  - Tenant communication (limited)
  - Analytics for their properties
- **Typical Users**: 50-200+ (Property owners)
- **Permissions**: Create, Read, Update (own properties); No Delete

### 5. Buyer
- **System Role ID**: `buyer`
- **Business Title**: Buyer, Investor
- **Access Level**: ⭐⭐ (Medium)
- **Data Visibility**: Public listings, personal searches, own offers
- **Page Access**:
  - Public property listings
  - Property search & filtering
  - Virtual tours
  - Favorites & saved searches
  - My applications & offers
  - Market analysis (public)
- **Key Features**:
  - Advanced property search (location, price, amenities)
  - Favorites & saved searches
  - Property comparison tools
  - Mortgage calculator
  - Make offers & applications
  - Track application status
  - View comparable markets
- **Typical Users**: Unlimited (Public/consumers)
- **Permissions**: Create (own favorites, searches), Read (public data)

### 6. Seller
- **System Role ID**: `seller`
- **Business Title**: Property Seller
- **Access Level**: ⭐⭐ (Medium)
- **Data Visibility**: Own property, market comps, offers
- **Page Access**:
  - List property dashboard
  - Property details & media
  - Offers & negotiations
  - Pricing tools & comps
  - Performance metrics
  - Market insights
- **Key Features**:
  - List property for sale
  - Pricing tools & market comparables
  - Manage property photos/videos
  - Receive & review offers
  - Counter-offer negotiations
  - Track listing performance
- **Typical Users**: Unlimited (Property owners selling)
- **Permissions**: Create, Read, Update (own property)

### 7. Leasing Agent
- **System Role ID**: `leasing-agent`
- **Business Title**: Leasing Agent, Rental Specialist
- **Access Level**: ⭐⭐⭐ (High)
- **Data Visibility**: Leasing portfolio, tenants, maintenance
- **Page Access**:
  - Daisy Leasing CRM (full)
  - Property inventory (rental properties)
  - Tenant management
  - Lease agreements
  - Maintenance tracking
  - Financial reports (rent collections)
- **Key Features**:
  - Manage rental properties
  - Tenant applications & approvals
  - Lease creation & management
  - Rent tracking & collection
  - Maintenance request coordination
  - Tenant communications
  - Lease renewal management
- **Typical Users**: 2-4 (Leasing specialists)
- **Permissions**: Create, Read, Update (leasing-related)

## Cross-Role Data Flow

```
Buyer/Seller (Public) 
  → Nadia (WhatsApp inquiry capture)
  → Clara (Lead created)
  → Sales Agent (Lead assigned)
  → Lead nurturing & closure
  → Theodora (Finance, payment processing)
  → Compliance (KYC/AML)
  → Zoe (Executive reporting)

Landlord (Owner)
  → Property upload to Mary (Inventory)
  → Daisy (Leasing Management for rentals)
  → Nadia (Lead capture for their property)
  → Clara (Deals/offers for their property)
  → Theodora (Rent payments & financials)
  → Zoe (Performance reporting)
```

## Permission Matrix
| Action | Owner | Admin | Sales | Landlord | Buyer | Leasing |
|--------|-------|-------|-------|----------|-------|---------|
| View All Data | ✅ | ✅ | Own | Own | Public | Own Dept |
| Create Lead | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Create Property | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Create Lease | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Approve Finance | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Delete Data | ✅ | Limited | ❌ | ❌ | ❌ | ❌ |

---

## API Permission Matrix

> All API calls require a valid JWT Bearer token. Unauthenticated requests return `401 Unauthorized`. Insufficient permissions return `403 Forbidden`.

### Endpoint Access by Role

| API Endpoint | Method | owner | admin | sales-agent | leasing-agent | landlord | buyer | seller |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `/api/leads` | GET (all) | ✅ | ✅ | Own | ❌ | ❌ | ❌ | ❌ |
| `/api/leads` | POST | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `/api/leads/:id` | PUT | ✅ | ✅ | Own | ❌ | ❌ | ❌ | ❌ |
| `/api/leads/:id` | DELETE | ✅ | Soft only | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/api/leads/:id/assign` | POST | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/api/properties` | GET (all) | ✅ | ✅ | ✅ | ✅ | Own | Public | Own |
| `/api/properties` | POST | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ |
| `/api/properties/:id` | PUT | ✅ | ✅ | ❌ | ❌ | Own | ❌ | Own |
| `/api/properties/:id` | DELETE | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/api/properties/search` | GET | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/api/deals` | GET (all) | ✅ | ✅ | Own | ❌ | ❌ | ❌ | ❌ |
| `/api/deals` | POST | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `/api/deals/:id` | PUT | ✅ | ✅ | Own | ❌ | ❌ | ❌ | ❌ |
| `/api/pipeline` | GET | ✅ | ✅ | Own | ❌ | ❌ | ❌ | ❌ |
| `/api/leases` | GET (all) | ✅ | ✅ | ❌ | ✅ | Own | ❌ | ❌ |
| `/api/leases` | POST | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| `/api/leases/:id` | PUT | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| `/api/leases/:id/renew` | POST | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| `/api/tenants` | GET | ✅ | ✅ | ❌ | ✅ | Own | Own | ❌ |
| `/api/tenants` | POST | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| `/api/maintenance` | GET | ✅ | ✅ | ❌ | ✅ | Own | Own | ❌ |
| `/api/maintenance` | POST | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ |
| `/api/maintenance/:id` | PUT | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| `/api/finance/invoices` | GET | ✅ | ❌ | ❌ | ❌ | Own | ❌ | ❌ |
| `/api/finance/commissions` | GET | ✅ | ✅ | Own | Own | ❌ | ❌ | ❌ |
| `/api/finance/commissions/approve` | POST | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/api/finance/reports` | GET | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/api/payments` | GET | ✅ | ✅ | ❌ | ❌ | Own | ❌ | ❌ |
| `/api/payments` | POST | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/api/compliance/kyc` | GET | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/api/compliance/kyc/:id` | PUT | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/api/compliance/audits` | GET | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/api/users` | GET (all) | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/api/users` | POST | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/api/users/:id` | PUT | ✅ | ✅ | Own | Own | Own | Own | Own |
| `/api/users/:id` | DELETE | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/api/analytics/executive` | GET | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/api/analytics/sales` | GET | ✅ | ✅ | Own | ❌ | ❌ | ❌ | ❌ |
| `/api/analytics/properties` | GET | ✅ | ✅ | ✅ | ✅ | Own | Public | Own |
| `/api/whatsapp/conversations` | GET | ✅ | ✅ | Own | ❌ | ❌ | ❌ | ❌ |
| `/api/whatsapp/broadcast` | POST | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/api/offers` | GET | ✅ | ✅ | Assigned | ❌ | Own | Own | Own |
| `/api/offers` | POST | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| `/api/offers/:id/accept` | POST | ✅ | ✅ | Assigned | ❌ | Own | ❌ | Own |
| `/api/viewings` | GET | ✅ | ✅ | Own | ✅ | Own | Own | Own |
| `/api/viewings` | POST | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |

> **Legend:** ✅ = Full access | Own = Own records only | Public = Published/public records only | ❌ = No access | Assigned = Only records assigned to this user

---

## RBAC Token Claims

> JWT access tokens issued on `/api/auth/login` and `/api/auth/refresh`. Tokens expire in **15 minutes** (access) / **7 days** (refresh). All tokens signed with RS256 (RSA-SHA256).

### JWT Payload Structure

```json
{
  "sub": "user_id_mongodb_objectid",
  "iat": 1720000000,
  "exp": 1720000900,
  "jti": "unique_token_id_for_revocation",
  "role": "secondary-sales-agent",
  "departmentId": "sales",
  "permissions": [
    "leads:read:own",
    "leads:write:own",
    "deals:read:own",
    "deals:write:own",
    "properties:read:all",
    "whatsapp:read:own",
    "analytics:read:own",
    "offers:read:assigned",
    "offers:write:own",
    "viewings:read:own",
    "viewings:write:own"
  ],
  "dataScopes": {
    "leads": "own",
    "deals": "own",
    "properties": "all",
    "finance": "none",
    "compliance": "none",
    "analytics": "own"
  },
  "reraLicensed": true,
  "reraBRN": "BRN-12345",
  "reraExpiryDate": "2026-12-31",
  "mfaVerified": false,
  "sessionId": "session_id_for_audit_trail"
}
```

### Permission Claims by Role

| Role | `role` claim | Key `permissions` claims | `dataScopes` |
|------|-------------|--------------------------|-------------|
| **owner** | `owner` | `*:*:all` (wildcard full access) | All: `all` |
| **admin** | `admin` | `leads:*:all`, `users:*:all`, `properties:*:all`, `analytics:read:all` | All except `finance`: `all`; finance: `none` |
| **secondary-sales-agent** | `secondary-sales-agent` | `leads:*:own`, `deals:*:own`, `properties:read:all`, `whatsapp:*:own` | leads: `own`; deals: `own`; properties: `all`; finance: `own-commissions` |
| **leasing-agent** | `leasing-agent` | `leases:*:all`, `tenants:*:all`, `maintenance:*:all`, `properties:read:all` | leases: `all`; tenants: `all`; finance: `rent-only` |
| **landlord** | `landlord` | `properties:*:own`, `leases:read:own`, `maintenance:*:own`, `finance:read:own` | properties: `own`; leases: `own`; finance: `own-rent` |
| **buyer** | `buyer` | `properties:read:public`, `viewings:*:own`, `offers:*:own`, `favorites:*:own` | properties: `public`; finance: `none` |
| **seller** | `seller` | `properties:*:own`, `offers:read:own`, `analytics:read:own-property` | properties: `own`; finance: `none` |

### Token Validation Rules

```typescript
// Backend middleware — applied to every protected route
export const authMiddleware = async (req, res, next) => {
  // 1. Extract Bearer token
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'UNAUTHORIZED' });

  // 2. Verify signature + expiry
  const decoded = jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] });

  // 3. Check token is not revoked (Redis blacklist)
  const isRevoked = await redis.get(`revoked:${decoded.jti}`);
  if (isRevoked) return res.status(401).json({ error: 'TOKEN_REVOKED' });

  // 4. Check RERA expiry for licensed routes
  if (req.path.startsWith('/api/deals') || req.path.startsWith('/api/leads')) {
    if (decoded.reraLicensed && new Date(decoded.reraExpiryDate) < new Date()) {
      return res.status(403).json({ error: 'RERA_LICENSE_EXPIRED' });
    }
  }

  // 5. Attach decoded payload to request context
  req.user = decoded;
  next();
};
```

---

## UI Page Access Matrix

> Controls which pages/routes are rendered or redirected (HTTP 403 page) based on role.

### Page Visibility by Role

| Page / Route | owner | admin | sales-agent | leasing-agent | landlord | buyer | seller |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `/dashboard` (Executive) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/dashboard/sales` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `/dashboard/operations` | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| `/crm/leads` | ✅ | ✅ | ✅ (own) | ❌ | ❌ | ❌ | ❌ |
| `/crm/pipeline` | ✅ | ✅ | ✅ (own) | ❌ | ❌ | ❌ | ❌ |
| `/crm/deals` | ✅ | ✅ | ✅ (own) | ❌ | ❌ | ❌ | ❌ |
| `/crm/properties` | ✅ | ✅ | ✅ | ✅ | ✅ (own) | 🔒 redirect `/search` | ✅ (own) |
| `/crm/leases` | ✅ | ✅ | ❌ | ✅ | ✅ (own) | ❌ | ❌ |
| `/crm/tenants` | ✅ | ✅ | ❌ | ✅ | ✅ (own) | ❌ | ❌ |
| `/crm/maintenance` | ✅ | ✅ | ❌ | ✅ | ✅ (own) | ✅ (own) | ❌ |
| `/finance` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/finance/commissions` | ✅ | ✅ | ✅ (own) | ✅ (own) | ❌ | ❌ | ❌ |
| `/finance/reports` | ✅ | ❌ | ❌ | ❌ | ✅ (own) | ❌ | ❌ |
| `/finance/invoices` | ✅ | ✅ | ❌ | ❌ | ✅ (own) | ❌ | ❌ |
| `/compliance` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/compliance/kyc` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/compliance/audits` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/admin/users` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/admin/settings` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/whatsapp` | ✅ | ✅ | ✅ (own) | ❌ | ❌ | ❌ | ❌ |
| `/analytics` (full) | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/analytics/my-performance` | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `/search` (public listings) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/property/:id` (public) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/my-offers` | ✅ | ✅ | ✅ (submitted) | ❌ | ❌ | ✅ | ✅ |
| `/my-viewings` | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| `/portal/landlord` | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| `/portal/tenant` | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| `/tools/mortgage-calculator` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/tools/roi-calculator` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

> **Hidden pages** are not rendered in navigation but return HTTP 403 if accessed directly, with a standard "Access Denied" component shown.

---

## Data Visibility Rules

### Scope Definitions

| Scope | Description |
|-------|-------------|
| `own` | Only records where `record.assignedAgentId === req.user.sub` OR `record.createdBy === req.user.sub` |
| `team` | Records belonging to agents in the same department or managed team |
| `own-property` | Records linked to properties where `property.ownerId === req.user.sub` |
| `public` | Records with `status: "listed"` and `visibility: "public"` |
| `all` | No filtering applied — all records in collection |
| `none` | No access to this data category |

### Data Visibility by Role and Entity

| Entity | owner | admin | sales-agent | leasing-agent | landlord | buyer | seller |
|--------|-------|-------|-------------|---------------|----------|-------|--------|
| **Leads** | all | all | own | none | none | none | none |
| **Deals / Pipeline** | all | all | own | none | none | none | own-property |
| **Properties** | all | all | all | all | own-property | public | own |
| **Leases** | all | all | none | all | own-property | none | none |
| **Tenants** | all | all | none | all | own-property | own | none |
| **Maintenance Requests** | all | all | none | all | own-property | own | none |
| **Finance / Invoices** | all | none | own-commissions | own-commissions | own-property | none | none |
| **Commissions** | all | all | own | own | none | none | none |
| **Financial Reports (P&L)** | all | none | none | none | none | none | none |
| **Users / Agents** | all | all | none | none | none | none | none |
| **KYC/AML Records** | all | all | none | none | none | none | none |
| **Audit Logs** | all | all | none | none | none | none | none |
| **WhatsApp Conversations** | all | all | own | none | none | none | none |
| **Analytics (Platform)** | all | all | own-metrics | own-metrics | own-property | none | own-property |
| **Offers** | all | all | assigned | none | own-property | own | own |

### Data Masking Rules

Certain fields are masked in API responses even within the visible scope:

| Field | Masking Rule |
|-------|-------------|
| `user.phone` | Visible only to `owner`, `admin`; masked as `+971-XXX-XXXX` for others |
| `user.email` | Visible to `owner`, `admin`, self; masked for all others |
| `lead.sourceDetails` | Full source visible to `owner`, `admin`, assigned agent; hidden for others |
| `finance.bankAccountNumber` | Visible only to `owner`; masked for all others |
| `compliance.kycDocuments` | Visible only to `owner`, `admin`, `compliance`; not accessible via standard roles |
| `tenant.emiratesIdNumber` | Visible to `owner`, `admin`, `leasing-agent`; masked as `784-XXXX-XXXXXXX-X` for landlord |
| `deal.commissionSplit` | Visible to `owner`, assigned agent, Finance; not visible to client-facing roles |

---

## Role Escalation Workflow

### When Escalation Is Required

| Scenario | Initiating Role | Escalation Target | Process |
|----------|-----------------|-------------------|---------|
| Commission dispute | `secondary-sales-agent` | Finance Director → MD | Agent submits dispute via `/api/disputes`; Finance reviews within 2 business days; MD approves/rejects final amount |
| Lead re-assignment request | `secondary-sales-agent` | Sales Manager | Agent flags lead as unresponsive (≥ 5 contact attempts); Sales Manager re-assigns within 24h |
| Landlord property access conflict | `landlord` | Leasing Agent → Operations Manager | Landlord submits ticket; Leasing Agent investigates; Operations Manager resolves within 3 days |
| KYC/AML rejection | `secondary-sales-agent` | Compliance Officer | System blocks deal progression; Compliance Officer reviews documents within 48h; MD notified if high risk |
| Permission upgrade request | Any | Admin → MD | User submits upgrade request; Admin validates; MD approves; max 5 business days |
| RERA compliance breach | `leasing-agent` / `secondary-sales-agent` | Compliance Officer → Legal → MD | Automatic ticket created; Compliance investigates within 24h; Legal consulted if potential regulatory penalty |
| System access suspected misuse | Any | IT / Lead Developer → MD | Security alert raised; access suspended within 1h; investigation completed within 24h; MD informed |
| Deal above AED 5M | `secondary-sales-agent` | Sales Manager → MD | System flag on deal value; MD review and approval required before contract generation |
| Emergency maintenance (property) | `landlord` / `tenant` | Leasing Agent → Operations Manager | Flagged as P1 in maintenance system; response within 4 hours; Operations Manager notified |

### Escalation SLA

| Escalation Level | Expected Resolution Time |
|-----------------|--------------------------|
| Peer escalation (same dept) | 4 business hours |
| Cross-department escalation | 1 business day |
| MD escalation | 2 business days |
| Legal escalation | 3–5 business days |
| Regulatory authority escalation (RERA/DLD) | As per regulatory timeline (RERA RDC: 30 days; DLD: 15 days) |

### Escalation Notification Channels

```
System Event → Automatic Notification (in-app + WhatsApp) → 
  If not acknowledged in [SLA time] → Email escalation to manager → 
  If still unresolved → WhatsApp alert to MD → 
  If regulatory trigger → Email to Compliance + Legal
```

---

## RERA Compliance — Licensed vs. Unlicensed Roles

### Regulatory Basis

> **Dubai Law No. 85 of 2006** (Real Estate Brokers Regulation) and **RERA Administrative Resolution No. 85 of 2006** mandate that any individual conducting real estate brokerage activities in Dubai must be registered with RERA and hold a valid Broker Registration Number (BRN).

### Role Classification Under RERA

| System Role | RERA Classification | BRN Required? | Permitted Activities |
|-------------|---------------------|---------------|---------------------|
| `owner` (MD) | Registered Company — ORN holder | Company ORN required; personal BRN if transacting | All activities under company ORN |
| `secondary-sales-agent` | Licensed Real Estate Broker | ✅ **Mandatory RERA BRN** | Listing properties, conducting viewings, negotiating offers, signing Form A/B, executing DLD transfers |
| `leasing-agent` | Licensed Real Estate Broker | ✅ **Mandatory RERA BRN** | Listing rental properties, tenant viewings, lease negotiations, Ejari registration |
| `admin` | Administrative Staff | ❌ Not required | Back-office only; **cannot** conduct property viewings, sign Form A/B, or negotiate deals |
| `landlord` | Property Owner | ❌ Not required (own property) | Can self-manage own properties without BRN; requires BRN to act as broker for others |
| `buyer` | Member of Public | ❌ Not required | Can purchase property; if acting as investor agent must hold BRN |
| `seller` | Property Owner | ❌ Not required (own property) | Can sell own property; must engage a licensed broker for RERA Form A |

### System Enforcement of RERA Rules

| Rule | System Enforcement |
|------|--------------------|
| **BRN Expiry** | System blocks access to deal creation, Form A/B generation, and DLD submission APIs if `reraExpiryDate` < today. Warning shown 30 days before expiry. |
| **Unlicensed user cannot create listings for others** | `landlord` role can only create properties with `ownerId === req.user.sub`; cannot list on behalf of third parties |
| **Form A/B generation restricted** | `/api/compliance/form-a` and `/api/compliance/form-b` accessible only to `reraLicensed: true` users |
| **Commission recording** | Commission entries linked to a RERA BRN; system warns if BRN is expired at time of deal closure |
| **Ejari registration** | `/api/ejari/register` requires `leasing-agent` role with valid RERA BRN; system records BRN on Ejari submission |
| **DLD transfer submission** | Accessible only to `owner` or `secondary-sales-agent` with valid BRN; DLD API validates BRN independently |

### RERA BRN Management

| Process | Frequency | Responsible Party |
|---------|-----------|-------------------|
| BRN renewal | Annual (before December 31) | Individual agent + HR |
| BRN verification in CRM | Automated daily check | System (overnight cron) |
| BRN expiry notification | 30 days before + 7 days before + day of expiry | Automated email + WhatsApp to agent + HR |
| BRN revocation by RERA | Immediate upon RERA notification | Compliance Officer deactivates user within 24h |
| New agent onboarding — BRN check | Before CRM account creation | HR + Compliance Officer |

---

See also:
- `README.md` - Company overview
- `/02_services_features/` - Available features by role
