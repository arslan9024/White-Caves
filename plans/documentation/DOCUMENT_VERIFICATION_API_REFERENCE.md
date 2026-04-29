# Document Verification API Reference

## Base URL
```
http://localhost:3000/api/compliance
```

## Authentication
All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 1. Verify Document (Main Endpoint)
**POST** `/documents/verify`

Upload and process a document for verification.

#### Request
```http
POST /api/compliance/documents/verify HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: multipart/form-data

documentType: emirates_id
userId: user-123
document: <binary image file>
```

#### Form Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `document` | File | Yes | Image file (JPG, PNG, GIF) - Max 10MB |
| `documentType` | String | Yes | `emirates_id`, `passport`, or `visa` |
| `userId` | String | No | User ID (defaults to authenticated user) |

#### Response
```json
{
  "success": true,
  "message": "Document verified successfully",
  "data": {
    "documentId": "507f1f77bcf86cd799439011",
    "processingResult": {
      "confidence": 92,
      "extractedFields": {
        "idNumber": "78412345678901",
        "firstName": "John",
        "lastName": "Doe",
        "dateOfBirth": "01/01/1990",
        "nationality": "UAE",
        "expiryDate": "31/12/2030"
      }
    },
    "validation": {
      "isValid": true,
      "errors": [],
      "warnings": [],
      "riskScore": 15,
      "riskLevel": "low",
      "recommendations": []
    },
    "screening": {
      "isClear": true,
      "alerts": [],
      "sources": ["OFAC", "EU Sanctions", "UN Sanctions"]
    },
    "compliance": {
      "summary": {
        "documentType": "emirates_id",
        "overallStatus": "approved",
        "riskLevel": "low",
        "timestamp": "2025-01-20T10:30:00Z"
      }
    },
    "status": "verified"
  }
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Invalid document type. Must be emirates_id, passport, or visa"
}
```

#### Status Codes
- `200` - Document processed successfully
- `400` - Bad request (invalid parameters)
- `500` - Server error

#### cURL Example
```bash
curl -X POST http://localhost:3000/api/compliance/documents/verify \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "document=@emiratesid.jpg" \
  -F "documentType=emirates_id" \
  -F "userId=user-123"
```

---

### 2. Get Document Status
**GET** `/documents/:documentId/status`

Retrieve the verification status and details of a processed document.

#### Request
```http
GET /api/compliance/documents/507f1f77bcf86cd799439011/status HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### URL Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `documentId` | String | Yes | MongoDB ObjectId of the document |

#### Response
```json
{
  "success": true,
  "data": {
    "documentId": "507f1f77bcf86cd799439011",
    "type": "emirates_id",
    "status": "verified",
    "verifiedAt": "2025-01-20T10:30:00Z",
    "verifiedBy": "compliance-officer-1",
    "ocrConfidence": 92,
    "extractedData": {
      "idNumber": "78412345678901",
      "firstName": "John",
      "lastName": "Doe",
      "dateOfBirth": "01/01/1990",
      "nationality": "UAE",
      "expiryDate": "31/12/2030"
    },
    "validation": {
      "isValid": true,
      "riskScore": 15,
      "riskLevel": "low"
    }
  }
}
```

#### Status Codes
- `200` - Document found and status retrieved
- `404` - Document not found
- `500` - Server error

#### cURL Example
```bash
curl -X GET http://localhost:3000/api/compliance/documents/507f1f77bcf86cd799439011/status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. Approve Document
**POST** `/documents/:documentId/approve`

Approve a verified document (compliance officer only).

#### Request
```http
POST /api/compliance/documents/507f1f77bcf86cd799439011/approve HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "comments": "Document verified successfully"
}
```

#### URL Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `documentId` | String | Yes | MongoDB ObjectId of the document |

#### Request Body
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `comments` | String | No | Approval comments |

#### Response
```json
{
  "success": true,
  "message": "Document approved successfully",
  "data": {
    "_id": "user-profile-id",
    "documents": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "type": "emirates_id",
        "status": "verified",
        "verifiedAt": "2025-01-20T10:30:00Z",
        "verifiedBy": "compliance-officer-1",
        "verificationComments": "Document verified successfully"
      }
    ]
  }
}
```

#### Required Permissions
- Role: `admin` or `compliance_officer`

#### Status Codes
- `200` - Document approved successfully
- `403` - Insufficient permissions
- `404` - Document not found
- `500` - Server error

#### cURL Example
```bash
curl -X POST http://localhost:3000/api/compliance/documents/507f1f77bcf86cd799439011/approve \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"comments": "Verified successfully"}'
```

---

### 4. Reject Document
**POST** `/documents/:documentId/reject`

Reject a document with a reason (compliance officer only).

#### Request
```http
POST /api/compliance/documents/507f1f77bcf86cd799439011/reject HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "reason": "Document quality too low for OCR processing"
}
```

#### URL Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `documentId` | String | Yes | MongoDB ObjectId of the document |

#### Request Body
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `reason` | String | No | Rejection reason |

#### Response
```json
{
  "success": true,
  "message": "Document rejected",
  "data": {
    "_id": "user-profile-id",
    "documents": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "type": "emirates_id",
        "status": "rejected",
        "rejectedAt": "2025-01-20T10:35:00Z",
        "rejectedBy": "compliance-officer-1",
        "rejectionReason": "Document quality too low for OCR processing"
      }
    ]
  }
}
```

#### Required Permissions
- Role: `admin` or `compliance_officer`

#### Status Codes
- `200` - Document rejected successfully
- `403` - Insufficient permissions
- `404` - Document not found
- `500` - Server error

#### cURL Example
```bash
curl -X POST http://localhost:3000/api/compliance/documents/507f1f77bcf86cd799439011/reject \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Document quality too low"}'
```

---

## Data Models

### Document Type: Emirates ID

**Parsed Fields**:
```javascript
{
  idNumber: String,          // 11-digit format
  firstName: String,
  lastName: String,
  dateOfBirth: String,       // DD/MM/YYYY
  nationality: String,
  expiryDate: String,        // DD/MM/YYYY
  issuedDate: String         // DD/MM/YYYY (optional)
}
```

**Validation Rules**:
- ID number must be 11 digits
- Age must be ≥ 18 years
- Document must not be expired
- Must not be duplicate of existing document

---

### Document Type: Passport

**Parsed Fields**:
```javascript
{
  passportNumber: String,    // 9 characters
  firstName: String,
  lastName: String,
  dateOfBirth: String,       // DD/MM/YYYY
  nationality: String,
  gender: String,            // M or F
  expiryDate: String         // DD/MM/YYYY
}
```

**Validation Rules**:
- Passport number format validation
- Age ≥ 18 years
- Not expired
- No duplicates

---

### Document Type: Visa

**Parsed Fields**:
```javascript
{
  visaType: String,          // Employment, Visit, Transit, Student, Investor
  issueDate: String,         // DD/MM/YYYY
  expiryDate: String,        // DD/MM/YYYY
  residenceNumber: String,   // Optional
  sponsorName: String        // Optional
}
```

**Validation Rules**:
- Visa type must be identified
- Expiry date must be present
- Issue date must be before expiry

---

### Validation Response Object

```javascript
{
  isValid: Boolean,              // Overall validation status
  errors: [String],              // List of validation errors
  warnings: [String],            // List of validation warnings
  riskScore: Number,             // 0-100 risk score
  riskLevel: String,             // low|medium|high|critical
  recommendations: [String]      // Recommended actions
}
```

**Risk Levels**:
- `low` (0-25): Standard processing
- `medium` (26-50): Request supporting documents
- `high` (51-75): Manual review required
- `critical` (76-100): Escalate to compliance

---

### Screening Response Object

```javascript
{
  isClear: Boolean,              // Sanctions/watchlist status
  alerts: [String],              // Any alerts or matches
  sources: [String],             // Screening sources used
  timestamp: ISO8601String
}
```

---

## Error Codes

### 400 - Bad Request
Common causes:
- Missing required fields
- Invalid document type
- Unsupported file format
- File size exceeds limit

**Example Response**:
```json
{
  "success": false,
  "message": "File size exceeds maximum limit of 10MB"
}
```

### 401 - Unauthorized
- Missing or invalid authentication token

**Example Response**:
```json
{
  "success": false,
  "message": "Invalid token"
}
```

### 403 - Forbidden
- Insufficient permissions for the requested action

**Example Response**:
```json
{
  "success": false,
  "message": "Only compliance officers can approve documents"
}
```

### 404 - Not Found
- Document or resource not found

**Example Response**:
```json
{
  "success": false,
  "message": "Document not found"
}
```

### 500 - Server Error
- Internal server error during processing

**Example Response**:
```json
{
  "success": false,
  "message": "OCR extraction failed"
}
```

---

## Rate Limiting

| Endpoint | Limit | Period |
|----------|-------|--------|
| `POST /documents/verify` | 10 | 1 minute |
| `GET /documents/:id/status` | 30 | 1 minute |
| `POST /documents/:id/approve` | 20 | 1 minute |
| `POST /documents/:id/reject` | 20 | 1 minute |

---

## Best Practices

### 1. File Upload
- Always validate file type and size on client side
- Use HTTPS for file uploads
- Implement progress tracking for large files
- Handle network interruptions with retry logic

### 2. Error Handling
```javascript
try {
  const response = await fetch('/api/compliance/documents/verify', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
  
  if (!response.ok) {
    const error = await response.json();
    console.error('Error:', error.message);
  }
  
  const result = await response.json();
  console.log('Success:', result.data);
} catch (error) {
  console.error('Network error:', error);
}
```

### 3. Retry Logic
```javascript
async function verifyDocumentWithRetry(formData, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch('/api/compliance/documents/verify', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      if (response.ok) {
        return await response.json();
      }
      
      if (response.status === 500 && i < maxRetries - 1) {
        // Retry on server error
        await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
        continue;
      }
      
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
    }
  }
}
```

### 4. Progress Tracking
```javascript
const handleUpload = async (file) => {
  const xhr = new XMLHttpRequest();
  
  xhr.upload.addEventListener('progress', (e) => {
    if (e.lengthComputable) {
      const progress = (e.loaded / e.total) * 100;
      console.log(`Upload progress: ${progress}%`);
    }
  });
  
  // ... rest of upload logic
};
```

---

## Webhook Events (Future Feature)

When implemented, the following events will be available:

- `document.verified` - Document verification completed successfully
- `document.rejected` - Document was rejected
- `document.risk_flagged` - High-risk score detected
- `document.sanctioned` - Sanctions match detected

---

## Changelog

### v1.0 (Current)
- Initial release
- Support for Emirates ID, Passport, and Visa
- OCR processing and data extraction
- Risk scoring and validation
- Sanctions list integration
- Document approval/rejection workflow

---

**Version**: 1.0  
**Last Updated**: January 2025  
**API Base URL**: `/api/compliance`
