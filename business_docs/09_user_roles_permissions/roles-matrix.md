# White Caves — Roles & Permissions Matrix

> **Source of truth:** `src/config/roles.ts`  
> **Last updated:** March 29, 2026  
> **Total roles:** 22 | **Total permissions:** 45+

---

## 1. Executive Roles

### Managing Director (`managing_director`)
- **Category:** Executive  
- **Color:** #FFD700 (Gold)  
- **Dashboard:** `/md/dashboard`  
- **Permissions:** `*` (full access to all features)  
- **Description:** Full access to all features, analytics, and settings  
- **Aliases:** `owner`, `md`

### Real Estate Company Admin (`real_estate_company`)
- **Category:** Executive  
- **Color:** #1E40AF  
- **Dashboard:** `/company/dashboard`  
- **Permissions:** `company.*`, `agents.*`, `properties.*`, `analytics.*`  
- **Description:** Oversee agents, listings, and company performance

### Property Management Company (`property_mgmt_company`)
- **Category:** Executive  
- **Color:** #7C3AED  
- **Dashboard:** `/management/dashboard`  
- **Permissions:** `properties.*`, `tenants.*`, `maintenance.*`, `finance.*`  
- **Description:** Manage multiple properties, tenants, and maintenance

---

## 2. Admin Roles

### Super Admin (`super_admin`)
- **Category:** Admin  
- **Color:** #DC2626  
- **Dashboard:** `/admin/dashboard`  
- **Permissions:** `admin.*`, `users.*`, `settings.*`  
- **Description:** System administration and user management  
- **Alias:** `admin`

---

## 3. Management Roles

### Branch Manager (`branch_manager`)
- **Category:** Management  
- **Color:** #2563EB  
- **Dashboard:** `/branch/dashboard`  
- **Permissions:** `branch.*`, `agents.*`, `properties.approve`  

### Sales Manager (`sales_manager`)
- **Category:** Management  
- **Color:** #7C3AED  
- **Dashboard:** `/sales/dashboard`  
- **Permissions:** `sales.*`, `agents.view`, `commissions.*`  

### Leasing Manager (`leasing_manager`)
- **Category:** Management  
- **Color:** #059669  
- **Dashboard:** `/leasing/dashboard`  
- **Permissions:** `rentals.*`, `tenancy.*`, `ejari.*`  

---

## 4. Agent Roles

### Sales Agent / Broker (`sales_agent`)
- **Category:** Agent  
- **Color:** #EA580C  
- **Dashboard:** `/agent/dashboard`  
- **Permissions:** `properties.own`, `leads.own`, `clients.own`, `sales.*`  
- **Aliases:** `sales-agent`, `secondary-sales-agent`

### Leasing Agent (`leasing_agent`)
- **Category:** Agent  
- **Color:** #10B981  
- **Dashboard:** `/leasing-agent/dashboard`  
- **Permissions:** `rentals.own`, `leads.own`, `clients.own`, `tenancy.*`  
- **Alias:** `leasing-agent`

### Property Manager (`property_manager`)
- **Category:** Agent  
- **Color:** #6366F1  
- **Dashboard:** `/property-manager/dashboard`  
- **Permissions:** `properties.manage`, `tenants.*`, `maintenance.*`  
- **Alias:** `property-manager`

---

## 5. Specialist Roles

### Real Estate Consultant (`property_consultant`)
- **Category:** Specialist  
- **Color:** #0891B2  
- **Dashboard:** `/consultant/dashboard`  
- **Permissions:** `properties.view`, `clients.own`, `analytics.view`  

### Mortgage Consultant (`mortgage_consultant`)
- **Category:** Specialist  
- **Color:** #0D9488  
- **Dashboard:** `/mortgage/dashboard`  
- **Permissions:** `mortgages.*`, `clients.own`, `documents.mortgage`  

### Real Estate Valuer (`valuation_expert`)
- **Category:** Specialist  
- **Color:** #A855F7  
- **Dashboard:** `/valuation/dashboard`  
- **Permissions:** `valuations.*`, `properties.view`, `reports.valuation`  

### Trustee Officer (`trustee_officer`)
- **Category:** Specialist  
- **Color:** #4338CA  
- **Dashboard:** `/trustee/dashboard`  
- **Permissions:** `transfers.*`, `documents.verify`, `contracts.trustee`  

---

## 6. Support Roles

### Legal Officer (`legal_officer`)
- **Category:** Support  
- **Color:** #4F46E5  
- **Dashboard:** `/legal/dashboard`  
- **Permissions:** `contracts.*`, `legal.*`, `compliance.*`  

### Finance Officer (`finance_officer`)
- **Category:** Support  
- **Color:** #16A34A  
- **Dashboard:** `/finance/dashboard`  
- **Permissions:** `finance.*`, `payments.*`, `reports.financial`  

### Marketing Manager (`marketing_manager`)
- **Category:** Support  
- **Color:** #DB2777  
- **Dashboard:** `/marketing/dashboard`  
- **Permissions:** `marketing.*`, `properties.promote`, `analytics.marketing`  

### Compliance Officer (`compliance_officer`)
- **Category:** Support  
- **Color:** #B91C1C  
- **Dashboard:** `/compliance/dashboard`  
- **Permissions:** `compliance.*`, `audit.*`, `legal.view`, `reports.compliance`  
- **Description:** RERA/DLD compliance monitoring, AML reporting, audit trail management  
- **Key Responsibilities:** Ensure all listings have valid Trakheesi permits, monitor AML thresholds, generate STR reports, manage RERA BRN validations

### Document Controller (`document_controller`)
- **Category:** Support  
- **Color:** #6366F1  
- **Dashboard:** `/documents/dashboard`  
- **Permissions:** `documents.*`, `verification.*`  

### IT Administrator (`it_admin`)
- **Category:** Support  
- **Color:** #475569  
- **Dashboard:** `/admin/settings`  
- **Permissions:** `admin.system`, `settings.*`, `logs.view`, `integrations.*`  
- **Description:** Platform configuration, API key management, integration monitoring, system health

---

## 7. Client Roles

### Real Estate Developer (`developer`)
- **Category:** Client  
- **Color:** #78716C  
- **Dashboard:** `/developer/dashboard`  
- **Permissions:** `projects.*`, `offplan.*`, `sales.developer`  

### Investor (`investor`)
- **Category:** Client  
- **Color:** #0369A1  
- **Dashboard:** `/investor/dashboard`  
- **Permissions:** `analytics.investor`, `properties.view`, `roi.view`  

### Landlord / Seller (`landlord`)
- **Category:** Client  
- **Color:** #8B5CF6  
- **Dashboard:** `/landlord/dashboard`  
- **Permissions:** `properties.own`, `tenants.view`, `income.own`  
- **Alias:** `seller`

### Property Buyer (`buyer`)
- **Category:** Client  
- **Color:** #0EA5E9  
- **Dashboard:** `/buyer/dashboard`  
- **Permissions:** `properties.view`, `favorites.own`, `offers.own`  

### Tenant (`tenant`)
- **Category:** Client  
- **Color:** #14B8A6  
- **Dashboard:** `/tenant/dashboard`  
- **Permissions:** `tenancy.own`, `payments.own`, `requests.own`  

---

## 8. Legacy / Transition Roles

### Affiliated Agent (`affiliated_agent`)
- **Category:** Agent  
- **Color:** #F97316  
- **Dashboard:** `/agent/dashboard`  
- **Permissions:** `properties.own`, `leads.own`, `clients.limited`  
- **Description:** Independent contractor under company sponsorship  
- **Note:** `freelancer` role key maps to `affiliated_agent`

---

## Permission Namespace Reference

| Namespace | Description | Used By |
|-----------|-------------|---------|
| `*` | Full access | Managing Director |
| `company.*` | Company management | RE Company Admin |
| `admin.*` | System administration | Super Admin |
| `users.*` | User management | Super Admin |
| `settings.*` | System settings | Super Admin |
| `branch.*` | Branch operations | Branch Manager |
| `agents.*` | Agent management | Company Admin, Branch Manager |
| `properties.*` | Full property CRUD | Multiple roles |
| `properties.own` | Own listings only | Agents, Landlord |
| `properties.view` | Read-only | Consultants, Investors |
| `properties.manage` | Manage assigned properties | Property Manager |
| `properties.approve` | Approve listings | Branch Manager |
| `properties.promote` | Marketing promotion | Marketing Manager |
| `leads.*` | Full lead access | Sales team |
| `leads.own` | Own leads only | Agents |
| `clients.*` | Full client access | Company Admin |
| `clients.own` | Own clients | Agents, Consultants |
| `clients.limited` | Limited client data | Affiliated Agent |
| `sales.*` | Sales operations | Sales Manager, Agents |
| `rentals.*` | Rental management | Leasing Manager, Agent |
| `tenancy.*` | Tenancy contracts | Leasing roles |
| `ejari.*` | Ejari integrations | Leasing Manager |
| `commissions.*` | Commission tracking | Sales Manager |
| `finance.*` | Financial operations | Finance Officer, Prop Mgmt |
| `payments.*` | Payment processing | Finance Officer |
| `mortgages.*` | Mortgage services | Mortgage Consultant |
| `contracts.*` | Contract management | Legal Officer |
| `legal.*` | Legal operations | Legal Officer |
| `compliance.*` | Compliance monitoring | Legal Officer |
| `marketing.*` | Marketing campaigns | Marketing Manager |
| `documents.*` | Document management | Document Controller |
| `verification.*` | Document verification | Document Controller |
| `valuations.*` | Property valuations | Valuer |
| `transfers.*` | Ownership transfers | Trustee Officer |
| `analytics.*` | Full analytics | Company Admin |
| `analytics.view` | Read analytics | Consultants |
| `analytics.investor` | Investor analytics | Investors |
| `analytics.marketing` | Marketing analytics | Marketing Manager |
| `projects.*` | Development projects | Developer |
| `offplan.*` | Off-plan listings | Developer |
| `maintenance.*` | Maintenance mgmt | Property Manager, Prop Mgmt Co |
| `tenants.*` | Tenant management | Property Manager, Prop Mgmt Co |
| `reports.*` | Report access | Various |
| `roi.view` | ROI analytics | Investors |

---

## Role Key Mapping (Legacy → Canonical)

| Legacy Key | Canonical ID |
|------------|-------------|
| `owner` | `managing_director` |
| `md` | `managing_director` |
| `admin` | `super_admin` |
| `leasing-agent` | `leasing_agent` |
| `secondary-sales-agent` | `sales_agent` |
| `property-manager` | `property_manager` |
| `sales-agent` | `sales_agent` |
| `seller` | `landlord` |
| `freelancer` | `affiliated_agent` |
