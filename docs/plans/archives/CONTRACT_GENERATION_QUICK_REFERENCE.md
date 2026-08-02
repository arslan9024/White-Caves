# Contract Generation Service - Quick Reference Guide

## Overview

The Contract Generation Service automates the creation of EJARI-compliant tenancy contracts from approved real estate offers.

## Quick Start

### For End Users

#### 1. Generate Contract from Offer

1. Navigate to an approved offer (both landlord and tenant approved)
2. Click "Generate Contract" button
3. Review the contract preview
4. (Optional) Customize any fields if needed
5. Click "Proceed to Signatures"

#### 2. Contract Generation Workflow

```
Step 1: Preview       → Show offer summary
Step 2: Review        → Display generated contract
Step 3: Customize     → Optional field updates (optional)
Step 4: Ready         → Success & next steps
```

#### 3. Customization (Optional)

If you need to modify contract details:

1. On Step 2, click "Customize Details"
2. Update landlord info, tenant info, or lease terms
3. Add or modify special terms
4. Click "Save & Continue"

---

## API Reference

### Generate Contract from Offer

```bash
POST /api/contract-generator/from-offer/{offerId}
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "companyName": "White Caves Real Estate LLC"
}

Response: Contract object
```

### Get Contract Preview (HTML)

```bash
GET /api/contract-generator/{contractId}/preview
Authorization: Bearer {token}

Response: HTML document (opens in browser)
```

### Get Contract Details

```bash
GET /api/contract-generator/{contractId}
Authorization: Bearer {token}

Response: Full contract object with populated relations
```

### List Contracts

```bash
GET /api/contract-generator?landlordId={id}&status=draft
Authorization: Bearer {token}

Parameters:
  - propertyId (optional)
  - landlordId (optional)
  - tenantId (optional)
  - agentId (optional)
  - status (optional)

Response: Array of contracts
```

### Update Contract

```bash
PATCH /api/contract-generator/{contractId}
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "leaseTerms.monthlyRent": 5500,
  "leaseTerms.specialTerms": "Updated terms"
}

Response: Updated contract object
```

---

## Frontend Integration

### Route Setup

```javascript
import ContractGeneratorPage from './components/ContractGeneratorPage';

<Route path="/contract-generator/:offerId" element={<ContractGeneratorPage />} />;
```

### Navigation

```javascript
// From offer detail page
const handleGenerateContract = () => {
  navigate(`/contract-generator/${offerId}`);
};

<button onClick={handleGenerateContract}>Generate Contract</button>;
```

---

## Component Props

### ContractGeneratorPage

- **Required:** `offerId` (from URL params)
- **Returns:** Contract generated and ready for signatures

### Features

- Multi-step workflow
- Real-time validation
- Form field customization
- HTML preview generation
- Error handling and feedback
- Mobile responsive

---

## Common Tasks

### Task 1: Generate Contract

```javascript
const generateContract = async offerId => {
  const response = await fetch(`/api/contract-generator/from-offer/${offerId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ companyName: 'White Caves Real Estate LLC' }),
  });

  const result = await response.json();
  return result.data; // Contract object
};
```

### Task 2: Preview Contract

```javascript
const previewContract = contractId => {
  window.open(`/api/contract-generator/${contractId}/preview`, '_blank');
};
```

### Task 3: List Contracts by Status

```javascript
const getContractsByStatus = async status => {
  const response = await fetch(`/api/contract-generator?status=${status}`);

  const result = await response.json();
  return result.data; // Array of contracts
};
```

### Task 4: Update Contract Terms

```javascript
const updateContractTerms = async (contractId, updates) => {
  const response = await fetch(`/api/contract-generator/${contractId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });

  const result = await response.json();
  return result.data; // Updated contract
};
```

---

## Data Structure

### Contract Object

```javascript
{
  _id: ObjectId,
  offerId: ObjectId,
  propertyId: ObjectId,
  landlordId: ObjectId,
  tenantId: ObjectId,
  agentId: ObjectId,

  // Party Information
  landlordDetails: {
    name: String,
    email: String,
    phone: String,
    nationality: String,
    emiratesId: String,
    passportNo: String,
    address: String
  },

  tenantDetails: {
    name: String,
    email: String,
    phone: String,
    nationality: String,
    emiratesId: String,
    passportNo: String,
    address: String,
    occupation: String,
    employer: String
  },

  agentDetails: {
    name: String,
    email: String,
    phone: String,
    company: String
  },

  // Property Information
  propertyDetails: {
    name: String,
    type: String,
    location: String,
    size: Number,
    bedrooms: Number,
    bathrooms: Number,
    features: [String]
  },

  // Lease Terms
  leaseTerms: {
    startDate: Date,
    endDate: Date,
    duration: Number,
    monthlyRent: Number,
    securityDeposit: Number,
    chequeFrequency: String,
    noOfCheques: Number,
    rentIncreasePercentage: Number,
    maintenanceResponsibility: String,
    utilities: String,
    specialTerms: String
  },

  // Status
  status: 'draft|pending_signatures|partially_signed|fully_signed|executed',
  contractType: 'tenancy',
  templateVersion: '1.0',
  version: 1,

  // Metadata
  createdAt: Date,
  updatedAt: Date
}
```

---

## Error Handling

### Common Errors

**Offer Not Approved**

```json
{
  "success": false,
  "error": "Both parties must approve the offer before generating contract"
}
```

**Contract Not Found**

```json
{
  "success": false,
  "error": "Contract not found"
}
```

**Validation Error**

```json
{
  "success": false,
  "error": "Required field missing: tenant name"
}
```

### Error Handling in Frontend

```javascript
try {
  const contract = await generateContract(offerId);
  setContract(contract);
} catch (error) {
  setError(error.message);
  // Display error to user
}
```

---

## Status Transitions

```
Draft
  ↓ (After generation)
Pending Signatures
  ↓ (After first signature)
Partially Signed
  ↓ (After all signatures)
Fully Signed
  ↓ (After EJARI registration)
Executed
```

---

## Performance Tips

1. **Caching:** Cache contract data in Redux/Context
2. **Lazy Loading:** Load previews on-demand
3. **Indexing:** Use indexed fields for queries
4. **Pagination:** Load contracts in batches
5. **Debouncing:** Debounce form input updates

---

## Security Notes

1. Always include authentication token
2. Validate user permissions server-side
3. Sanitize all user input
4. Don't expose sensitive data in errors
5. Use HTTPS for all API calls
6. Rate limit API endpoints
7. Validate data before update

---

## Next Steps

After contract generation:

1. **Signature Collection** → Proceed to signature workflow
2. **PDF Generation** → Convert to PDF for storage
3. **EJARI Registration** → Submit to EJARI system
4. **Email Notifications** → Send to all parties
5. **Document Archival** → Store signed copies

---

## Troubleshooting

### Contract Not Generating

- ✅ Check offer has both approvals
- ✅ Verify all required fields are filled
- ✅ Check MongoDB connection
- ✅ Review server logs for errors

### Preview Not Loading

- ✅ Verify contract exists in database
- ✅ Check browser console for errors
- ✅ Ensure API endpoint is accessible
- ✅ Try refreshing the page

### Customization Not Saving

- ✅ Check network connection
- ✅ Verify all form fields are valid
- ✅ Check browser console for errors
- ✅ Ensure authentication token is valid

---

## Support Resources

- **Technical Docs:** `/plans/PHASE_2A_CONTRACT_GENERATION_COMPLETE.md`
- **Implementation Guide:** `/plans/PHASE_2A_SUMMARY.md`
- **API Routes:** `server/routes/contract-generator.js`
- **Service Logic:** `server/services/ContractGeneratorService.js`
- **Component Code:** `src/components/ContractGeneratorPage.jsx`

---

## Version History

| Version | Date         | Changes         |
| ------- | ------------ | --------------- |
| 1.0     | Dec 18, 2024 | Initial release |

---

**Last Updated:** December 18, 2024  
**Status:** Production Ready ✅
