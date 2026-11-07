# TENANCY DEAL WORKFLOW - QUICK REFERENCE

## 🚀 Quick Start

### Creating an Offer

```javascript
POST /api/offers
{
  "propertyId": "ObjectId",
  "landlordId": "ObjectId",
  "tenantId": "ObjectId",
  "agentId": "ObjectId",
  "monthlyRent": 50000,
  "securityDeposit": 50000,
  "leaseDuration": 12,
  "noOfCheques": 12,
  "startDate": "2026-03-01",
  "endDate": "2027-03-01",
  "specialTerms": "No pets, quiet hours 10pm-8am"
}
```

### Updating Property Status (Mary)

```javascript
PATCH /api/property-inventory/:propertyId/status
{
  "status": "offer_in_progress",
  "visibleTo": { "mary": true },
  "notes": "Offer sent to tenant and landlord"
}
```

### Tenant Approves Offer

```javascript
POST /api/offers/:offerId/approve-tenant
{
  "notes": "Great property! Ready to move forward."
}
```

### Landlord Approves Offer

```javascript
POST /api/offers/:offerId/approve-landlord
{
  "notes": "Tenant profile looks good."
}
```

### Getting Deal Journey

```javascript
GET /api/deal-journey/by-offer/:offerId
```

---

## 📊 Property Status Workflow

```
AVAILABLE
    ↓
OFFER_IN_PROGRESS (offer sent to parties)
    ↓
OFFER_APPROVED (both approved)
    ↓
CONTRACT_GENERATION (agent creating contract)
    ↓
CONTRACT_SIGNATURE (waiting for e-signatures)
    ↓
SIGNED (all signed)
    ↓
OCCUPIED (tenant moved in)
    ↓
MAINTENANCE/INSPECTION (optional)
    ↓
ARCHIVED
```

---

## 🎭 Component Usage

### DealTimeline Component

```jsx
import { DealTimeline } from '@/components/DealTimeline';

<DealTimeline
  stages={dealStages}
  currentStage={currentStage}
  onStageClick={handleStageClick}
  dealData={dealData}
  estimatedCompletion={estimatedDate}
/>;
```

### OfferApprovalPage Component

```jsx
import OfferApprovalPage from '@/components/OfferApprovalPage';

<OfferApprovalPage
  propertyDetails={property}
  offerDetails={offer}
  landlordDetails={landlord}
  tenantDetails={tenant}
  onApprove={handleApprove}
  onReject={handleReject}
  userRole="tenant"
/>;
```

### Form Components

```jsx
// Use in a wizard with state management
import LandlordForm from '@/components/TenancyForms/LandlordForm';
import TenantForm from '@/components/TenancyForms/TenantForm';
import TenancyTermsForm from '@/components/TenancyForms/TenancyTermsForm';
import ContactDetailsForm from '@/components/TenancyForms/ContactDetailsForm';

<LandlordForm
  onNext={data => handleNext(data)}
  onPrevious={() => handlePrevious()}
  initialData={existingData}
/>;
```

---

## 🔐 Property Access Control

### Grant Agent Access

```javascript
POST /api/property-inventory/:propertyId/grant-access
{
  "agentId": "ObjectId",
  "accessLevel": "edit",  // view_only, edit, full_control
  "grantedBy": "ObjectId" // admin/manager id
}
```

### Get Properties Visible to Mary

```javascript
GET / api / property - inventory / mary / visible - properties;
```

Returns all properties where `visibleTo.mary = true`

### Get Agent's Properties

```javascript
GET /api/property-inventory/agent/:agentId/properties
```

Returns all properties assigned to the agent with their access level

---

## 📬 Notification System

### Send Notification to Party

```javascript
POST /api/deal-journey/:dealId/notify
{
  "recipientId": "ObjectId",
  "type": "action_required",  // action_required, approval_needed, signature_pending, status_update, deal_completed
  "title": "Action Required",
  "message": "Please review and approve the offer by 5 PM today."
}
```

### Get User's Notifications

```javascript
GET /api/deal-journey/:userId/notifications
```

### Mark as Read

```javascript
PATCH /api/deal-journey/:dealId/notification/:notificationId/read
```

---

## 🔄 Deal Journey Stages

Each deal progresses through:

1. **Offer Creation** (Completed by agent)
2. **Tenant Approval** (Waiting for tenant)
3. **Landlord Approval** (Waiting for landlord)
4. **Contract Generation** (Agent creates contract)
5. **E-Signature** (Both parties sign)

Each stage can include activities:

- `email_sent`
- `whatsapp_sent`
- `document_sent`
- `signature_requested`
- `signature_received`
- `approval_given`
- `approval_denied`
- `document_generated`
- `status_changed`

---

## 📈 Offer Status Transitions

```
draft
  ↓
sent_to_tenant
  ↓
tenant_approved  ──────┐
  ↓                   │
sent_to_landlord ◄────┘
  ↓
landlord_approved
  ↓
both_approved
  ↓
ready_for_contract
  ↓
contract_generated
  ↓
completed
```

Alternative flows:

- `tenant_rejected` → ends offer
- `landlord_rejected` → ends offer
- `cancelled` → any stage

---

## 🔍 Query Filters

### Get Offers with Filters

```javascript
GET /api/offers?propertyId=xxx&tenantId=yyy&status=sent_to_tenant
```

Available filters:

- `propertyId` - Filter by property
- `tenantId` - Filter by tenant
- `landlordId` - Filter by landlord
- `agentId` - Filter by agent
- `status` - Filter by offer status

### Get Deals for Agent

```javascript
GET /api/deal-journey/agent/:agentId?status=approval_stage
```

Available filters:

- `status` - Filter by overall deal status

---

## 📊 Mary's Inventory Management

**Mary can:**

- View all properties (those with `visibleTo.mary: true`)
- See current status (available, offer_in_progress, occupied, etc.)
- Update property status
- View current offers and contracts
- See assigned agents and their access levels
- Filter by status
- Track property lifecycle

**UI Endpoint:** `/api/property-inventory/mary/visible-properties`

---

## 🚨 Common Errors & Solutions

| Error                  | Solution                                       |
| ---------------------- | ---------------------------------------------- |
| Property not found     | Ensure propertyId exists and is valid ObjectId |
| Offer status invalid   | Check valid statuses in workflow diagram       |
| Access denied          | Verify agent has access to property            |
| Notification not found | Ensure dealId and notificationId are correct   |
| Date validation failed | Ensure endDate > startDate                     |

---

## 📝 Model Relationships

```
PropertyInventory
├── propertyId (ref: InventoryProperty)
├── currentOfferId (ref: Offer)
├── currentContractId (ref: Contract)
├── assignedAgents[].agentId (ref: User)
└── visibleTo.mary (Boolean)

Offer
├── propertyId (ref: InventoryProperty)
├── landlordId (ref: Owner)
├── tenantId (ref: User)
├── agentId (ref: User)
├── contractId (ref: Contract)
└── communicationHistory[]

DealJourney
├── propertyId (ref: InventoryProperty)
├── landlordId (ref: Owner)
├── tenantId (ref: User)
├── agentId (ref: User)
├── offerId (ref: Offer)
├── contractId (ref: Contract)
├── stages[]
├── notifications[]
└── communicationLinks[]
```

---

## ✨ Best Practices

1. **Always create PropertyInventory entry** when creating an offer
2. **Create DealJourney** to track deal progression
3. **Send notifications** at each stage transition
4. **Log activities** for audit trail
5. **Validate dates** before offer creation
6. **Check access levels** before granting agent access
7. **Update status** in PropertyInventory as stages progress
8. **Use timestamps** for all state changes

---

**Last Updated:** January 18, 2026  
**Version:** 1.0  
**Status:** Ready for Integration
