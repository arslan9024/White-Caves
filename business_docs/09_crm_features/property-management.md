# Property Management — CRM Feature Specification

> **Status:** In Development  
> **Module Owner:** Hassan (Property Specialist AI)  
> **Last Updated:** April 2026  
> **Priority:** Critical  
> **API Endpoints:** `/api/properties`, `/api/listings`, `/api/syndication`

---

## Overview

Property Management is the core module of the White Caves CRM, enabling real estate professionals to manage the complete lifecycle of property listings — from initial draft through active marketing to archival. The module integrates with Dubai's regulatory framework (RERA, DLD) and supports syndication to major property portals.

### Purpose

Provide agents, managers, and property owners with a centralized system to create, manage, market, and track properties across the Dubai real estate market while maintaining full regulatory compliance.

### Business Value

- **Operational Efficiency**: Centralized property data reduces duplication across portals
- **Regulatory Compliance**: Built-in RERA permit and DLD registration tracking
- **Market Reach**: One-click syndication to PropertyFinder, Bayut, and Dubizzle
- **Data-Driven Decisions**: Per-listing analytics for pricing and marketing optimization
- **Time Savings**: Bulk operations and automated workflows reduce manual effort
- **Revenue Tracking**: Link properties to deals, commissions, and financial reporting

---

## User Stories

### Agent Perspective

- **As an** agent, **I want to** create a property listing quickly with pre-filled fields, **so that** I can get it to market faster
- **As an** agent, **I want to** upload photos and floor plans in bulk, **so that** I don't waste time on individual uploads
- **As an** agent, **I want to** syndicate listings to PropertyFinder, Bayut, and Dubizzle in one click, **so that** I maximize exposure
- **As an** agent, **I want to** see how many views and inquiries each listing gets, **so that** I can optimize pricing
- **As an** agent, **I want to** track off-plan project milestones, **so that** I can update buyers on construction progress
- **As an** agent, **I want to** search and filter properties by detailed criteria, **so that** I can match buyer requirements instantly
- **As an** agent, **I want to** generate a branded property brochure, **so that** I can share professional marketing materials

### Manager Perspective

- **As a** manager, **I want to** review and approve listings before they go live, **so that** I ensure quality and compliance
- **As a** manager, **I want to** see inventory aging reports, **so that** I can address stale listings
- **As a** manager, **I want to** perform bulk status updates, **so that** I can manage portfolio-wide changes efficiently
- **As a** manager, **I want to** track RERA permit expiry dates, **so that** I maintain regulatory compliance
- **As a** manager, **I want to** view syndication performance across portals, **so that** I allocate marketing budget wisely

### Owner / Executive Perspective

- **As an** owner, **I want to** see the complete property portfolio with valuation summaries, **so that** I understand asset positioning
- **As an** owner, **I want to** track DLD registration status for all transactions, **so that** I ensure compliance
- **As an** owner, **I want to** view conversion rates per listing, **so that** I identify high-performing properties

### Landlord Perspective

- **As a** landlord, **I want to** see my properties listed on the CRM, **so that** I know their marketing status
- **As a** landlord, **I want to** receive notifications when my property gets inquiries, **so that** I stay informed
- **As a** landlord, **I want to** approve price changes before they go live, **so that** I maintain control

---

## Property Listing Lifecycle

### State Machine

```
┌─────────┐    Submit     ┌─────────┐    Approve    ┌────────┐
│  DRAFT  │──────────────▶│ PENDING │──────────────▶│ ACTIVE │
└─────────┘               └─────────┘               └────────┘
     │                         │                        │  │
     │                         │ Reject                 │  │ Sold/Rented
     │                         ▼                        │  ▼
     │                    ┌──────────┐                  │ ┌────────────┐
     │                    │ REJECTED │                  │ │ COMPLETED  │
     │                    └──────────┘                  │ └────────────┘
     │                                                  │
     │                    ┌──────────┐    Relist        │
     └───────────────────▶│ ARCHIVED │◀─────────────────┘
                          └──────────┘
```

### Lifecycle Stages

| Stage | Description | Allowed Actions | Visible on Portals |
|-------|-------------|-----------------|-------------------|
| **Draft** | Initial creation; incomplete data allowed | Edit, Upload media, Submit for review | No |
| **Pending** | Submitted for manager/compliance review | Approve, Reject, Request changes | No |
| **Active** | Live listing; visible to clients and portals | Edit (minor), Syndicate, Archive, Mark sold/rented | Yes |
| **Rejected** | Failed compliance or quality review | Edit, Resubmit | No |
| **Completed** | Successfully sold or rented | View only, Generate reports | No |
| **Archived** | Removed from active listings | Relist, Delete (admin only) | No |

### State Transition Rules

- **Draft → Pending**: Requires minimum fields (title, type, price, location, 3+ photos, RERA permit)
- **Pending → Active**: Manager or compliance AI (Laila) must approve
- **Pending → Rejected**: Rejection reason is mandatory; notification sent to listing agent
- **Active → Archived**: Automatic after 180 days without activity (configurable)
- **Active → Completed**: Linked deal must be in "closed-won" status
- **Archived → Active**: Requires re-validation of RERA permit and pricing

---

## Property Types

### Residential

| Type | Code | Typical Fields |
|------|------|---------------|
| Apartment | `apartment` | Floor, unit number, building name, community |
| Villa | `villa` | Plot size, garden, pool, parking spaces |
| Townhouse | `townhouse` | Plot size, floors, garden, parking |
| Penthouse | `penthouse` | Floor, terrace size, private pool, view type |
| Studio | `studio` | Floor, unit number, building name |
| Duplex | `duplex` | Floors, internal staircase, terrace |

### Commercial

| Type | Code | Typical Fields |
|------|------|---------------|
| Office | `office` | Floor, partitions, grade (A/B/C), parking |
| Retail | `retail` | Frontage, footfall data, visibility |
| Warehouse | `warehouse` | Height, loading dock, power supply |
| Shop | `shop` | Frontage, mall/strip, footfall |

### Land

| Type | Code | Typical Fields |
|------|------|---------------|
| Residential Plot | `land_residential` | Plot number, permitted floors, FAR |
| Commercial Plot | `land_commercial` | Plot number, permitted use, FAR |
| Mixed-Use Plot | `land_mixed` | Plot number, permitted mix, FAR |

---

## Data Model

### Property Record

```typescript
interface Property {
  id: string;
  referenceNumber: string;          // Auto-generated: WC-PROP-2026-XXXXX

  // Core Details
  title: string;                    // Max 120 characters
  description: string;              // Max 5000 characters, supports rich text
  titleAr?: string;                 // Arabic title
  descriptionAr?: string;           // Arabic description
  type: PropertyType;
  subType?: string;
  purpose: 'sale' | 'rent' | 'short_term_rent';

  // Pricing
  price: number;
  currency: 'AED' | 'USD';
  pricePerSqFt?: number;           // Auto-calculated
  rentalFrequency?: 'yearly' | 'monthly' | 'weekly' | 'daily';
  numberOfCheques?: number;         // Dubai-specific: 1, 2, 4, 6, 12

  // Dimensions
  areaSqFt: number;
  plotSizeSqFt?: number;
  builtUpAreaSqFt?: number;

  // Features
  bedrooms?: number;               // 0 for studio
  bathrooms?: number;
  parkingSpaces?: number;
  floor?: number;
  totalFloors?: number;
  furnishing: 'furnished' | 'semi_furnished' | 'unfurnished';
  view?: string[];                  // e.g., ['sea', 'garden', 'city']
  amenities: string[];             // Pool, gym, concierge, etc.

  // Location
  community: string;               // e.g., 'Dubai Marina'
  subCommunity?: string;           // e.g., 'Marina Promenade'
  building?: string;
  unitNumber?: string;
  address: string;
  latitude: number;
  longitude: number;
  makaniNumber?: string;            // Dubai Makani geo-address

  // Media
  photos: PropertyPhoto[];
  floorPlans: FloorPlan[];
  virtualTourUrl?: string;
  videoUrl?: string;
  documents: PropertyDocument[];

  // Regulatory
  reraPermitNumber: string;
  reraPermitExpiry: Date;
  dldTransactionNumber?: string;
  trakheesiPermit?: string;         // For holiday homes
  titleDeedNumber?: string;

  // Relationships
  ownerId?: string;                 // Link to landlord/owner record
  agentId: string;                  // Listing agent
  teamId?: string;
  developerId?: string;             // For off-plan

  // Status & Tracking
  status: 'draft' | 'pending' | 'active' | 'rejected' | 'completed' | 'archived';
  listingDate?: Date;
  expiryDate?: Date;
  daysOnMarket: number;

  // Syndication
  syndication: SyndicationStatus[];

  // Analytics
  totalViews: number;
  totalInquiries: number;
  totalShortlists: number;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

interface PropertyPhoto {
  id: string;
  url: string;
  thumbnailUrl: string;
  caption?: string;
  order: number;
  isPrimary: boolean;
  watermarked: boolean;
  width: number;
  height: number;
}

interface FloorPlan {
  id: string;
  url: string;
  label: string;                   // e.g., 'Ground Floor', 'First Floor'
  order: number;
}

interface SyndicationStatus {
  portal: 'propertyfinder' | 'bayut' | 'dubizzle';
  status: 'pending' | 'active' | 'rejected' | 'expired';
  externalId?: string;
  lastSyncedAt?: Date;
  rejectionReason?: string;
}
```

---

## Property Search & Filters

### Search Capabilities

- **Full-text search**: Title, description, reference number, community, building
- **AI-powered search**: Natural language queries via AI assistants (e.g., "3-bed apartment in Marina under 2M AED")
- **Saved searches**: Agents can save filter combinations for quick access
- **Recent searches**: Last 10 searches stored per user

### Filter Criteria

| Filter | Type | Options |
|--------|------|---------|
| Purpose | Select | Sale, Rent, Short-term rent |
| Property type | Multi-select | All property types |
| Price range | Range slider | Min–Max (AED/USD toggle) |
| Area (sq ft) | Range slider | Min–Max |
| Bedrooms | Multi-select | Studio, 1, 2, 3, 4, 5, 6, 7+ |
| Bathrooms | Multi-select | 1, 2, 3, 4, 5+ |
| Community | Searchable dropdown | All Dubai communities |
| Building | Searchable dropdown | Filtered by community |
| Furnishing | Multi-select | Furnished, Semi, Unfurnished |
| View | Multi-select | Sea, Garden, City, Pool, Golf, etc. |
| Amenities | Multi-select | Pool, Gym, Concierge, etc. |
| Listing date | Date range | From–To |
| Status | Multi-select | All statuses |
| Agent | Searchable dropdown | All agents |
| RERA permit | Toggle | Has valid permit / All |
| Days on market | Range | Min–Max |

### Sort Options

- Price (low to high / high to low)
- Newest first / Oldest first
- Area (smallest / largest)
- Days on market
- Most viewed / Most inquired

---

## Map Integration

### Google Maps Features

- **Property pins**: Color-coded by type and status
- **Cluster view**: Group nearby properties at zoom levels
- **Location picker**: Click-to-set coordinates during listing creation
- **Street View**: Embedded street view for property context
- **Drawing tools**: Draw areas to search within custom boundaries
- **Commute calculator**: Distance/time to key landmarks (Metro, Mall, School)
- **Heatmap overlay**: Price per sq ft heatmap by community

### Location Data

- Latitude/longitude coordinates (required)
- Makani number integration (Dubai smart addressing)
- Community and sub-community auto-detection from coordinates
- Nearby Points of Interest (POIs) auto-populated

---

## Photo Management

### Upload & Processing

- **Bulk upload**: Drag-and-drop up to 50 photos per listing
- **Auto-resize**: Generate thumbnail (300px), medium (800px), large (1600px)
- **Format support**: JPEG, PNG, WebP; auto-convert HEIC
- **Max file size**: 10MB per photo
- **Minimum resolution**: 1024×768 pixels
- **Auto-orientation**: EXIF-based rotation correction

### Organization

- **Drag-and-drop reorder**: Set photo display order
- **Primary photo selection**: First photo used in listings and syndication
- **Captions**: Optional caption per photo (e.g., "Master bedroom", "Pool view")
- **Categories**: Exterior, Interior, Kitchen, Bathroom, Amenities, View

### Watermarking

- **Auto-watermark**: Company logo applied on syndication
- **Position**: Configurable (center, bottom-right, bottom-left)
- **Opacity**: Configurable (30%–70%)
- **Original preserved**: Watermark applied to copies only

### Virtual Tours

- **Matterport integration**: Embed 3D virtual tour links
- **360° photo support**: Upload and display spherical photos
- **Video tours**: YouTube/Vimeo URL embedding
- **Virtual staging**: AI-generated furnished versions of empty units

---

## Portal Syndication

### Supported Portals

| Portal | Feed Format | Sync Frequency | Features |
|--------|-------------|----------------|----------|
| PropertyFinder | XML/API | Every 4 hours | Premium listings, featured spots |
| Bayut | XML/API | Every 4 hours | TruCheck verification, floor plans |
| Dubizzle | XML/API | Every 4 hours | Auto-refresh, boost options |

### Syndication Workflow

1. Agent selects target portals during listing creation or update
2. System validates listing against portal-specific requirements
3. Photos are watermarked and resized per portal specs
4. XML feed generated or API call made to portal
5. Portal confirms acceptance or returns rejection with reason
6. Status tracked per portal in listing detail view
7. Automatic re-syndication on listing updates

### Portal Requirements Validation

- **PropertyFinder**: Minimum 5 photos, RERA permit, watermark, max 4000 char description
- **Bayut**: Minimum 3 photos, agent RERA BRN, building/community, floor plan preferred
- **Dubizzle**: Minimum 3 photos, valid price, complete location data

### Syndication Analytics

- Views per portal
- Inquiries per portal
- Click-through rates
- Cost per inquiry (for paid listings)
- Comparison across portals

---

## Off-Plan Property Tracking

### Project Management

- **Developer profile**: Link properties to developer records
- **Project phases**: Pre-launch, Launch, Under construction, Handover
- **Payment plans**: Track installment schedules and milestones
- **Construction updates**: Photo/video progress tracking
- **Handover tracking**: Expected vs. actual handover dates

### Off-Plan Listing Fields

| Field | Description |
|-------|-------------|
| Developer | Developer company name and profile |
| Project name | Master development name |
| Phase | Current construction phase |
| Expected handover | Quarter/Year (e.g., Q3 2027) |
| Payment plan | Down payment %, installments, post-handover % |
| DLD waiver | Whether developer is offering DLD fee waiver |
| Escrow account | Escrow account number (RERA requirement) |

---

## Property Valuation Integration

### Valuation Methods

- **Comparable analysis**: AI-powered comparison with similar recent transactions
- **Price per sq ft benchmarks**: Community-level pricing data
- **DLD transaction data**: Integration with Dubai REST API for actual transaction prices
- **Historical price tracking**: Year-over-year price changes for the property/community
- **Rental yield calculator**: Calculate ROI based on purchase price and rental income

### Valuation Report

- Auto-generated PDF valuation report
- Comparable properties with prices and dates
- Community price trends (12-month chart)
- Estimated market value range (low–mid–high)
- Disclaimer for regulatory compliance

---

## RERA & DLD Compliance

### RERA Permit Requirements

- **Mandatory field**: All active listings must have a valid RERA permit number
- **Format validation**: Regex pattern for RERA permit numbers
- **Expiry tracking**: Alerts sent 30, 15, and 7 days before permit expiry
- **Auto-deactivation**: Listings automatically moved to "Pending" when permit expires
- **Agent BRN**: Each listing agent's Broker Registration Number stored and validated
- **Audit trail**: All permit-related changes logged for compliance audits

### DLD Registration

- **Transaction tracking**: Link DLD transaction numbers to completed deals
- **Fee calculator**: Auto-calculate 4% DLD transfer fee + admin fees
- **NOC tracking**: Track No Objection Certificate status from developer
- **Title deed status**: Monitor title deed issuance progress
- **Oqood registration**: Track off-plan registration with DLD

### Compliance Dashboard (Laila AI)

- Percentage of listings with valid RERA permits
- Upcoming permit expirations
- Agent BRN status overview
- DLD registration completion rates
- Compliance score per agent and team

---

## Bulk Operations

### CSV/Excel Import

- **Template download**: Pre-formatted CSV/Excel template with all fields
- **Field mapping**: Map CSV columns to property fields
- **Validation**: Pre-import validation with error report
- **Duplicate detection**: Match by reference number, address, or title deed
- **Preview**: Review first 10 records before full import
- **Progress tracking**: Real-time import progress with success/failure count
- **Error handling**: Detailed error log with row numbers and field-level issues

### Bulk Status Update

- Select multiple properties via checkboxes or filter criteria
- Apply status change (e.g., Archive all listings older than 6 months)
- Confirmation dialog with affected count
- Audit log entry per property

### Bulk Photo Upload

- ZIP file upload containing photos organized by property reference
- Folder structure: `{reference_number}/photo1.jpg, photo2.jpg...`
- Auto-assign photos to matching properties

---

## Analytics Per Listing

### Metrics Tracked

| Metric | Description | Source |
|--------|-------------|--------|
| Total views | Page views on CRM and portals | Internal + portal APIs |
| Unique views | Deduplicated by session/user | Internal tracking |
| Inquiries | Number of contact requests | Forms, calls, WhatsApp |
| Shortlists | Times added to client shortlists | Internal tracking |
| Shares | Times shared by agents | Internal tracking |
| Days on market | Days since listing went active | Calculated |
| Price changes | History of price modifications | Audit log |
| Conversion rate | Inquiries / Views × 100 | Calculated |

### Analytics Views

- **Per-listing dashboard**: Sparkline charts on listing detail page
- **Portfolio overview**: Aggregate metrics for all agent's listings
- **Comparative analysis**: Compare listing performance within same community
- **Trend charts**: 30/60/90-day performance trends

---

## Acceptance Criteria

### Property Creation

- [ ] Agent can create a property listing with all required fields
- [ ] System validates minimum data before allowing submission
- [ ] Reference number is auto-generated in format WC-PROP-YYYY-XXXXX
- [ ] Draft listings are saved automatically every 30 seconds
- [ ] Photos can be uploaded, reordered, and captioned

### Lifecycle Management

- [ ] Status transitions follow the defined state machine
- [ ] Manager approval is required for Draft → Active transition
- [ ] RERA permit validation blocks activation of non-compliant listings
- [ ] Automatic archival triggers after configurable inactivity period
- [ ] All state changes create audit log entries

### Search & Discovery

- [ ] Full-text search returns results within 500ms
- [ ] All filter combinations work correctly in combination
- [ ] Map view displays all active listings with correct pins
- [ ] Saved searches persist across sessions
- [ ] AI assistants can query properties via natural language

### Syndication

- [ ] Listings syndicate to selected portals within configured sync window
- [ ] Portal-specific validation runs before syndication attempt
- [ ] Rejection reasons from portals are displayed to agent
- [ ] Updates to active listings trigger re-syndication
- [ ] Delisted/archived properties are removed from portals

### Compliance

- [ ] RERA permit number is mandatory for active listings
- [ ] Permit expiry notifications fire at 30, 15, and 7 days
- [ ] Expired permits auto-deactivate the listing
- [ ] DLD transaction numbers can be linked to completed deals
- [ ] Compliance dashboard shows real-time compliance scores

---

## Technical Notes

### Performance Requirements

- Property search: < 500ms for 95th percentile
- Photo upload: Support 50 concurrent uploads per session
- Map rendering: < 2s for 1000 pins
- Syndication: Process 500 listings per sync cycle
- Bulk import: Handle 10,000 records per file

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/properties` | List/search properties with filters |
| POST | `/api/properties` | Create new property |
| GET | `/api/properties/:id` | Get property details |
| PUT | `/api/properties/:id` | Update property |
| PATCH | `/api/properties/:id/status` | Update property status |
| POST | `/api/properties/:id/photos` | Upload photos |
| DELETE | `/api/properties/:id/photos/:photoId` | Remove photo |
| POST | `/api/properties/:id/syndicate` | Trigger syndication |
| GET | `/api/properties/:id/analytics` | Get listing analytics |
| POST | `/api/properties/import` | Bulk import from CSV/Excel |
| POST | `/api/properties/bulk-update` | Bulk status update |
| GET | `/api/properties/:id/valuation` | Get property valuation |

### Multi-Currency Support

- Prices stored in AED (base currency)
- USD conversion using daily exchange rate feed
- Display currency toggled by user preference
- Portal syndication always in AED

### Role-Based Access

| Role | Create | Edit Own | Edit All | Approve | Delete | Bulk Ops |
|------|--------|----------|----------|---------|--------|----------|
| Owner | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manager | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Agent | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Sales Agent | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Leasing Agent | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

### AI Integration

- **Hassan (Property Specialist)**: Assists with listing creation, suggests pricing, validates data
- **Laila (Compliance)**: Validates RERA permits, flags compliance issues
- **Fatima (Marketing)**: Generates listing descriptions and marketing copy
- **Aisha (Analytics)**: Provides insights on listing performance and market trends

---

## Dependencies

- Google Maps Platform API (maps, geocoding, places)
- PropertyFinder API / XML feed
- Bayut API / XML feed
- Dubizzle API / XML feed
- Dubai REST API (DLD transaction data)
- Image processing service (Sharp/ImageMagick)
- Cloud storage (property photos and documents)

---

## Future Enhancements

- AI-powered photo quality scoring and auto-rejection of blurry/dark images
- Automated competitive market analysis per listing
- Blockchain-based title deed verification
- AR/VR property viewing integration
- Predictive pricing model using ML
- Automated property description generation in multiple languages
