# User Roles & Permissions - White Caves Real Estate LLC

## Role Hierarchy & Access Model

### 1. Owner / Managing Director (MD)
- **System Role ID**: `owner`
- **Business Title**: Managing Director, Owner
- **Access Level**: ⭐⭐⭐⭐⭐ (Full/Complete)
- **Data Visibility**: All departments, all data
- **Page Access**:
  - Executive Dashboard (Zoe insights)
  - All departmental CRMs (Clara, Mary, Linda, etc.)
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
  - Linda WhatsApp (shared inbox + personal)
  - Sales dashboard
  - Property listings
  - Client management
- **Key Features**:
  - Lead management (create, qualify, nurture)
  - Deal tracking & closure
  - Commission tracking (own only)
  - Activity timeline
  - Client communications (WhatsApp via Linda)
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
  → Linda (WhatsApp inquiry capture)
  → Clara (Lead created)
  → Sales Agent (Lead assigned)
  → Lead nurturing & closure
  → Theodora (Finance, payment processing)
  → Compliance (KYC/AML)
  → Zoe (Executive reporting)

Landlord (Owner)
  → Property upload to Mary (Inventory)
  → Daisy (Leasing Management for rentals)
  → Linda (Lead capture for their property)
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

See also:
- `README.md` - Company overview
- `/02_services_features/` - Available features by role
