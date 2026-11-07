# Step 5: Contract API - Quick Reference Guide

**Version**: 1.0
**Last Updated**: Current Session
**Status**: Complete and Ready for Integration

---

## Base URL

```
http://localhost:3001/api/contracts
```

## Authentication

All endpoints require:

```
Authorization: Bearer <JWT_TOKEN>
```

---

## Endpoints

### 1. Create Contract

**Endpoint**: `POST /create`

**Description**: Create a new contract from a template

**Request Body**:

```json
{
  "templateId": "template_id",
  "propertyId": "property_id",
  "sellerId": "seller_id",
  "buyerId": "buyer_id",
  "propertyTitle": "Property Title",
  "propertyLocation": "Dubai Marina, Dubai",
  "propertySize": 1500,
  "totalPrice": 2500000,
  "downPayment": 500000,
  "startDate": "2025-01-15",
  "endDate": "2028-01-14",
  "termsAndConditions": "Standard terms apply",
  "sellerName": "Ahmed Ali",
  "sellerEmail": "seller@example.com",
  "sellerPhone": "+971501234567",
  "buyerName": "John Doe",
  "buyerEmail": "buyer@example.com",
  "buyerPhone": "+971509876543"
}
```

**Response (201)**:

```json
{
  "_id": "contract_id",
  "templateType": "Sales",
  "propertyId": "property_id",
  "sellerId": "seller_id",
  "buyerId": "buyer_id",
  "status": "Draft",
  "totalPrice": 2500000,
  "createdAt": "2025-01-13T10:00:00Z",
  "versions": ["version_id"],
  "signatures": []
}
```

**Error Responses**:

- `400`: Missing required fields
- `401`: Not authenticated
- `404`: Template not found

---

### 2. Get Contract

**Endpoint**: `GET /:contractId`

**Description**: Retrieve contract details with all signatures

**Response (200)**:

```json
{
  "_id": "contract_id",
  "templateType": "Sales",
  "propertyTitle": "Property Title",
  "propertyLocation": "Dubai Marina, Dubai",
  "status": "Signed",
  "totalPrice": 2500000,
  "signatures": [
    {
      "_id": "signature_id",
      "signerName": "Ahmed Ali",
      "signerEmail": "seller@example.com",
      "timestamp": "2025-01-14T14:30:00Z",
      "verified": true
    }
  ],
  "versions": ["version_id1", "version_id2"],
  "createdAt": "2025-01-13T10:00:00Z",
  "updatedAt": "2025-01-14T14:30:00Z"
}
```

**Error Responses**:

- `404`: Contract not found
- `403`: Not authorized to view

---

### 3. Update Contract

**Endpoint**: `PUT /:contractId`

**Description**: Update contract fields (only in Draft status)

**Request Body**:

```json
{
  "totalPrice": 2450000,
  "downPayment": 490000,
  "termsAndConditions": "Updated terms"
}
```

**Response (200)**:

```json
{
  "_id": "contract_id",
  "status": "Draft",
  "totalPrice": 2450000,
  "updatedAt": "2025-01-13T11:00:00Z",
  "versions": ["v1", "v2"]
}
```

**Error Responses**:

- `400`: Cannot update signed contract
- `404`: Contract not found
- `403`: Not authorized to edit

---

### 4. Send for Signature

**Endpoint**: `POST /:contractId/send-for-signature`

**Description**: Send contract to buyer for signature via email

**Request Body**:

```json
{
  "recipientEmail": "buyer@example.com",
  "expirationDays": 7
}
```

**Response (200)**:

```json
{
  "contractId": "contract_id",
  "status": "Pending",
  "signingUrl": "https://app.whitecaves.com/sign/abc123xyz",
  "expiresAt": "2025-01-20T10:00:00Z",
  "emailSent": true
}
```

**Error Responses**:

- `400`: Invalid email address
- `404`: Contract not found
- `500`: Email delivery failed

---

### 5. Sign Contract

**Endpoint**: `POST /:contractId/sign`

**Description**: Save digital signature for the contract

**Request Body**:

```json
{
  "signature": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "signerName": "John Doe",
  "signerEmail": "buyer@example.com",
  "signerRole": "Buyer"
}
```

**Response (200)**:

```json
{
  "contractId": "contract_id",
  "signatureId": "signature_id",
  "status": "Signed",
  "signerName": "John Doe",
  "timestamp": "2025-01-15T09:30:00Z",
  "verified": true
}
```

**Error Responses**:

- `400`: Invalid signature format
- `400`: Contract already signed
- `404`: Contract not found
- `401`: Unauthorized signer

---

### 6. Get Signing Status

**Endpoint**: `GET /:contractId/sign-status`

**Description**: Get signing completion status for all parties

**Response (200)**:

```json
{
  "contractId": "contract_id",
  "status": "Pending",
  "parties": [
    {
      "name": "Ahmed Ali",
      "role": "Seller",
      "email": "seller@example.com",
      "signed": true,
      "signedAt": "2025-01-14T14:30:00Z",
      "verified": true
    },
    {
      "name": "John Doe",
      "role": "Buyer",
      "email": "buyer@example.com",
      "signed": false,
      "signedAt": null,
      "verified": false
    }
  ],
  "completionPercentage": 50
}
```

---

### 7. Generate PDF

**Endpoint**: `POST /:contractId/generate-pdf`

**Description**: Generate PDF version of the contract

**Request Body** (optional):

```json
{
  "includingSignatures": true,
  "format": "A4"
}
```

**Response (200)**:

```json
{
  "contractId": "contract_id",
  "pdfUrl": "https://firebasestorage.googleapis.com/...",
  "fileName": "Contract_Sales_123456.pdf",
  "generatedAt": "2025-01-15T10:00:00Z",
  "size": 245000
}
```

**Error Responses**:

- `400`: Contract not signed yet (optional check)
- `404`: Contract not found
- `500`: PDF generation failed

---

### 8. Get Version History

**Endpoint**: `GET /:contractId/versions`

**Description**: Get all versions of the contract with changes

**Response (200)**:

```json
{
  "contractId": "contract_id",
  "versions": [
    {
      "_id": "v1",
      "versionNumber": 1,
      "createdAt": "2025-01-13T10:00:00Z",
      "createdBy": "seller_id",
      "status": "Active",
      "changes": "Initial creation"
    },
    {
      "_id": "v2",
      "versionNumber": 2,
      "createdAt": "2025-01-13T11:00:00Z",
      "createdBy": "seller_id",
      "status": "Superseded",
      "changes": "Updated price from 2500000 to 2450000"
    }
  ]
}
```

---

### 9. Rollback to Previous Version

**Endpoint**: `POST /:contractId/versions/:versionId/rollback`

**Description**: Revert contract to a previous version

**Response (200)**:

```json
{
  "contractId": "contract_id",
  "rolledBackToVersion": 1,
  "newVersionNumber": 3,
  "status": "Draft",
  "createdAt": "2025-01-15T11:00:00Z"
}
```

**Error Responses**:

- `400`: Cannot rollback signed contract
- `404`: Version not found
- `404`: Contract not found

---

### 10. Archive Contract

**Endpoint**: `DELETE /:contractId`

**Description**: Archive completed contract

**Response (200)**:

```json
{
  "contractId": "contract_id",
  "status": "Archived",
  "archivedAt": "2025-01-20T15:00:00Z",
  "message": "Contract archived successfully"
}
```

**Error Responses**:

- `400`: Cannot archive pending contract
- `404`: Contract not found

---

## Common Request/Response Patterns

### Error Response Format

```json
{
  "error": "Error description",
  "code": "ERROR_CODE",
  "details": {
    "field": "fieldName",
    "issue": "Specific issue"
  },
  "timestamp": "2025-01-13T10:00:00Z"
}
```

### Success Response Format

```json
{
  "success": true,
  "data": {
    /* response data */
  },
  "message": "Operation completed successfully",
  "timestamp": "2025-01-13T10:00:00Z"
}
```

---

## HTTP Status Codes

| Code | Meaning                                    |
| ---- | ------------------------------------------ |
| 200  | OK - Request successful                    |
| 201  | Created - Contract created                 |
| 400  | Bad Request - Invalid input                |
| 401  | Unauthorized - Authentication required     |
| 403  | Forbidden - Not authorized                 |
| 404  | Not Found - Resource not found             |
| 409  | Conflict - State conflict (already signed) |
| 500  | Internal Error - Server error              |

---

## Common Use Cases

### Use Case 1: Create and Send for Signature

```
1. POST /create → Get contractId
2. POST /:contractId/send-for-signature → Send email
3. Buyer clicks link and signs
4. POST /:contractId/sign → Save signature
```

### Use Case 2: View and Download

```
1. GET /:contractId → Get details
2. GET /:contractId/sign-status → Check progress
3. POST /:contractId/generate-pdf → Get PDF
```

### Use Case 3: Update and Resend

```
1. PUT /:contractId → Update fields
2. GET /:contractId/versions → View changes
3. POST /:contractId/send-for-signature → Resend
```

### Use Case 4: Multi-Party Signing

```
1. POST /create → Create contract
2. POST /:contractId/send-for-signature → Send to seller
3. Seller signs
4. POST /:contractId/send-for-signature → Send to buyer
5. Buyer signs
6. GET /:contractId/sign-status → Confirm completion
```

---

## Rate Limiting

- **Create Contract**: 10 per hour per user
- **Send for Signature**: 20 per hour per contract
- **Get Requests**: 100 per minute
- **Update Contract**: 20 per hour per contract

---

## Pagination (if applicable)

Endpoints returning lists use pagination:

**Query Parameters**:

```
?page=1&limit=20&sort=createdAt&order=desc
```

**Response**:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

## Field Specifications

### Contract Status Enum

```
"Draft" | "Pending" | "Signed" | "Completed" | "Cancelled" | "Archived"
```

### Contract Type Enum

```
"Sales" | "Lease" | "Option" | "Assignment" | "Waiver"
```

### Signer Role Enum

```
"Seller" | "Buyer" | "Landlord" | "Tenant" | "Witness"
```

---

## Integration Examples

### JavaScript/Fetch

```javascript
// Create contract
const contract = await fetch('/api/contracts/create', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    templateId: 'sales_001',
    propertyId: 'prop_123',
    // ... other fields
  }),
}).then(r => r.json());

// Sign contract
const signature = await fetch(`/api/contracts/${contract._id}/sign`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    signature: signatureData,
    signerName: 'John Doe',
    signerEmail: 'buyer@example.com',
    signerRole: 'Buyer',
  }),
}).then(r => r.json());
```

### React Hook

```javascript
const [contract, setContract] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const createContract = async data => {
  setLoading(true);
  try {
    const response = await fetch('/api/contracts/create', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create');
    const result = await response.json();
    setContract(result.data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

---

## Troubleshooting

| Issue                | Solution                              |
| -------------------- | ------------------------------------- |
| 401 Unauthorized     | Check JWT token expiration            |
| 403 Forbidden        | Verify user has access rights         |
| 404 Not Found        | Check contract/template ID            |
| 409 Conflict         | Contract already signed, can't modify |
| 500 Server Error     | Check server logs, retry request      |
| Email not sent       | Verify SMTP configuration             |
| PDF generation fails | Check Firebase Storage access         |

---

## Support & Documentation

- **Full Documentation**: See STEP_5_IMPLEMENTATION_GUIDE.md
- **Testing Guide**: See STEP_5_TESTING_CHECKLIST.md
- **Code Examples**: Check component implementations
- **Issues**: Review error logs in server console

---

**Last Updated**: Current Session
**Version**: 1.0
**Status**: Complete and Ready for Use
