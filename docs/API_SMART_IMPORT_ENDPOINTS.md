# Smart Mary Data Import System - API Endpoints Documentation

## Overview
Complete API reference for the Smart Mary Data Import System, including all endpoints, request/response formats, and integration examples.

---

## Base URL
```
/api/inventory/import
```

---

## 1. File Upload

### `POST /upload`
Uploads and processes Excel/CSV file for import.

**Request:**
```
Method: POST
Content-Type: multipart/form-data

Form Data:
- file: File (required) - Excel (.xlsx, .xls) or CSV file
- sessionId: string (optional) - Existing session ID for resuming
```

**Response - Success (200):**
```json
{
  "success": true,
  "data": {
    "sessionId": "sess_abc123xyz",
    "fileName": "properties_2025.xlsx",
    "fileSize": 2097152,
    "fileHash": "sha256:abc123...",
    "totalRows": 1250,
    "sheetNames": ["Sheet1", "Properties", "Owners"],
    "selectedSheet": "Sheet1",
    "columns": [
      "Property Number",
      "Area",
      "Project Name",
      "Owner Name",
      "Phone",
      "Status"
    ],
    "preview": [
      {
        "Property Number": "P-001",
        "Area": "Downtown",
        "Project Name": "Tower A",
        "Owner Name": "Ahmed Al Mansouri",
        "Phone": "+971501234567",
        "Status": "Vacant"
      }
    ],
    "columnMapping": {
      "Property Number": "referenceNo",
      "Area": "area",
      "Owner Name": "ownerName",
      "Phone": "phone"
    }
  }
}
```

**Response - Error (400):**
```json
{
  "success": false,
  "error": "Invalid file format. Supported formats: .xlsx, .xls, .csv"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/inventory/import/upload \
  -F "file=@properties.xlsx"
```

**JavaScript/Fetch Example:**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('/api/inventory/import/upload', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log('Session ID:', result.data.sessionId);
```

---

## 2. Auto-Detect Column Mapping

### `POST /detect-mapping`
Intelligently detects column-to-field mappings using pattern recognition.

**Request:**
```json
{
  "columns": [
    "Property ID",
    "Location",
    "Bedrooms",
    "Owner",
    "Contact"
  ],
  "sampleData": [
    {
      "Property ID": "P-001",
      "Location": "Downtown Dubai",
      "Bedrooms": "3",
      "Owner": "Ahmed Al Mansouri",
      "Contact": "+971501234567"
    }
  ]
}
```

**Response - Success (200):**
```json
{
  "success": true,
  "data": {
    "mapping": {
      "Property ID": "referenceNo",
      "Location": "area",
      "Bedrooms": "bedrooms",
      "Owner": "ownerName",
      "Contact": "phone"
    },
    "confidence": {
      "Property ID": 0.99,
      "Location": 0.92,
      "Bedrooms": 0.88,
      "Owner": 0.95,
      "Contact": 0.98
    },
    "unmappedColumns": []
  }
}
```

**JavaScript Example:**
```javascript
const mappingResult = await fetch('/api/inventory/import/detect-mapping', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    columns: ['Property ID', 'Location', 'Bedrooms'],
    sampleData: [{ 'Property ID': 'P-001', ... }]
  })
});

const { data } = await mappingResult.json();
console.log('Auto-detected mapping:', data.mapping);
```

---

## 3. Validate Data Quality

### `POST /validate`
Performs comprehensive data quality validation with configurable strategy.

**Request:**
```json
{
  "sessionId": "sess_abc123xyz",
  "strategy": "balanced",
  "mapping": {
    "Property Number": "referenceNo",
    "Area": "area",
    "Owner Name": "ownerName",
    "Phone": "phone"
  },
  "options": {
    "checkDuplicates": true,
    "strictEmailValidation": false,
    "requireAllFields": false
  }
}
```

**Validation Strategies:**
- `strict` - Reject on any error, requires all mapped fields
- `balanced` - Intelligent judgment, flags warnings (default)
- `lenient` - Import valid data, flag all warnings

**Response - Success (200):**
```json
{
  "success": true,
  "data": {
    "validationResult": {
      "isValid": true,
      "totalRows": 1250,
      "validRows": 1240,
      "totalErrors": 8,
      "totalWarnings": 12,
      "rowsWithErrors": [15, 42, 89, 156, 203, 298, 415, 589],
      "rowsWithWarnings": [12, 45, 67, 123, 178, 234, 267, 289, 312, 378, 401, 423],
      "errorDetails": [
        {
          "rowIndex": 15,
          "field": "phone",
          "message": "Invalid phone format",
          "value": "invalid"
        }
      ],
      "warningDetails": [
        {
          "rowIndex": 12,
          "field": "area",
          "message": "Unknown area value",
          "value": "New Area"
        }
      ]
    },
    "duplicates": [
      {
        "rowIndex": 45,
        "existingId": "prop_123",
        "newData": { "referenceNo": "P-001", "area": "Downtown" },
        "existingData": { "referenceNo": "P-001", "area": "Downtown" },
        "matchedFields": ["referenceNo", "area"],
        "confidence": 0.98
      }
    ],
    "summary": {
      "passRate": "99.36%",
      "requiresManualReview": false,
      "estimatedImportTime": "2.5 minutes"
    }
  }
}
```

**Response - Error (400):**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "missingFields": ["referenceNo"],
    "invalidMapping": true
  }
}
```

**JavaScript Example:**
```javascript
const validation = await fetch('/api/inventory/import/validate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: 'sess_abc123xyz',
    strategy: 'balanced',
    mapping: columnMapping
  })
});

const { data } = await validation.json();
console.log(`Valid rows: ${data.validationResult.validRows}`);
console.log(`Errors found: ${data.validationResult.totalErrors}`);
console.log(`Duplicates: ${data.duplicates.length}`);
```

---

## 4. Detect Status Mapping

### `POST /detect-status-mapping`
Intelligently maps legacy status values to multi-dimensional fields.

**Request:**
```json
{
  "data": [
    { "status": "Vacant" },
    { "status": "Occupied" },
    { "status": "Rented" }
  ],
  "statusField": "status"
}
```

**Response - Success (200):**
```json
{
  "success": true,
  "data": {
    "statusMapping": {
      "Vacant": {
        "occupancy": "empty",
        "market": "ready",
        "construction": "ready",
        "furnishing": "unknown",
        "legal": "registered"
      },
      "Occupied": {
        "occupancy": "occupied",
        "market": "unavailable",
        "construction": "ready",
        "furnishing": "furnished",
        "legal": "registered"
      },
      "Rented": {
        "occupancy": "tenanted",
        "market": "pipeline",
        "construction": "ready",
        "furnishing": "semi-furnished",
        "legal": "registered"
      }
    },
    "uniqueValues": 3,
    "mappingQuality": {
      "confidence": 0.92,
      "requiresReview": false
    }
  }
}
```

**JavaScript Example:**
```javascript
const statusDetection = await fetch('/api/inventory/import/detect-status-mapping', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    data: preview,
    statusField: 'status'
  })
});

const { data } = await statusDetection.json();
console.log('Status mappings:', data.statusMapping);
```

---

## 5. Detect Duplicates

### `POST /detect-duplicates`
Identifies potential duplicate records with configurable matching strategy.

**Request:**
```json
{
  "sessionId": "sess_abc123xyz",
  "strategy": "smart",
  "matchingFields": ["referenceNo", "area"],
  "matchingThreshold": 0.85
}
```

**Matching Strategies:**
- `exact` - Exact field match required
- `fuzzy` - Fuzzy string matching (typo tolerance)
- `smart` - Combination of exact and fuzzy (default)

**Response - Success (200):**
```json
{
  "success": true,
  "data": {
    "duplicatesFound": 24,
    "duplicates": [
      {
        "rowIndex": 45,
        "existingId": "prop_123",
        "newData": {
          "referenceNo": "P-001",
          "area": "Downtown",
          "owner": "Ahmed Al Mansouri"
        },
        "existingData": {
          "referenceNo": "P-001",
          "area": "Downtown",
          "owner": "Ahmed Al Mansouri"
        },
        "matchedFields": ["referenceNo", "area"],
        "confidence": 0.98,
        "resolution": "pending"
      }
    ],
    "summary": {
      "exactMatches": 18,
      "fuzzyMatches": 6,
      "requiresManualReview": 2
    }
  }
}
```

---

## 6. Execute Import

### `POST /execute`
Executes the complete import process with all validations and mappings applied.

**Request:**
```json
{
  "sessionId": "sess_abc123xyz",
  "columnMapping": {
    "Property Number": "referenceNo",
    "Area": "area",
    "Project": "projectName",
    "Owner Name": "ownerName",
    "Phone": "phone",
    "Status": "status"
  },
  "importStrategy": "balanced",
  "deduplicationStrategy": "keep",
  "statusMapping": {
    "Vacant": {
      "occupancy": "empty",
      "market": "ready",
      "construction": "ready",
      "furnishing": "unknown",
      "legal": "registered"
    }
  },
  "options": {
    "createVersions": false,
    "updateExisting": true,
    "sendNotifications": true
  }
}
```

**Deduplication Strategies:**
- `keep` - Keep existing records, skip duplicates (safest)
- `overwrite` - Replace existing with new data
- `version` - Create version history, keep both
- `manual` - Flag duplicates for manual review

**Response - Success (200):**
```json
{
  "success": true,
  "data": {
    "sessionId": "sess_abc123xyz",
    "status": "completed",
    "startedAt": "2025-01-18T10:30:00Z",
    "completedAt": "2025-01-18T10:35:45Z",
    "totalRows": 1250,
    "processedRows": 1250,
    "propertiesCreated": 850,
    "propertiesUpdated": 380,
    "propertiesFailed": 20,
    "ownersCreated": 620,
    "ownersUpdated": 210,
    "relationshipsCreated": 1200,
    "relationshipsUpdated": 50,
    "duplicatesResolved": 24,
    "duplicatesManual": 0,
    "errorsCount": 0,
    "warningsCount": 12,
    "successRate": "98.4%",
    "importErrors": [],
    "summary": {
      "executionTime": "5m 45s",
      "avgRowProcessingTime": "276ms",
      "totalDataSize": "2.5 MB",
      "createdRelationships": 1200,
      "statusMappingsApplied": 1230
    }
  }
}
```

**Response - Partial Success (202):**
```json
{
  "success": true,
  "data": {
    "status": "partial",
    "completedAt": "2025-01-18T10:35:45Z",
    "propertiesCreated": 820,
    "ownersCreated": 600,
    "failedRows": [
      {
        "rowIndex": 15,
        "error": "Invalid email format",
        "data": { "referenceNo": "P-015", ... }
      }
    ],
    "summary": "Import completed with warnings"
  }
}
```

**Response - Error (400):**
```json
{
  "success": false,
  "error": "Import execution failed",
  "details": {
    "reason": "Validation errors detected",
    "failedRows": 50,
    "firstError": "Invalid phone format in row 15"
  }
}
```

**JavaScript Example:**
```javascript
const importResult = await fetch('/api/inventory/import/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: 'sess_abc123xyz',
    columnMapping,
    importStrategy: 'balanced',
    deduplicationStrategy: 'keep',
    statusMapping
  })
});

const { data } = await importResult.json();
console.log(`✅ Import completed!`);
console.log(`Properties created: ${data.propertiesCreated}`);
console.log(`Success rate: ${data.successRate}`);
```

---

## 7. Get Import Session Status

### `GET /session/:sessionId`
Retrieves current status and progress of an import session.

**Request:**
```
GET /api/inventory/import/session/sess_abc123xyz
```

**Response - Success (200):**
```json
{
  "success": true,
  "data": {
    "sessionId": "sess_abc123xyz",
    "fileName": "properties_2025.xlsx",
    "status": "completed",
    "progress": 100,
    "totalRows": 1250,
    "processedRows": 1250,
    "propertiesCreated": 850,
    "propertiesUpdated": 380,
    "ownersCreated": 620,
    "ownersUpdated": 210,
    "duplicatesFound": 24,
    "duplicatesResolved": 24,
    "errorsCount": 0,
    "startedAt": "2025-01-18T10:30:00Z",
    "completedAt": "2025-01-18T10:35:45Z",
    "estimatedTimeRemaining": "0s"
  }
}
```

---

## 8. Get Import History

### `GET /history`
Retrieves import history for current user with pagination and filtering.

**Query Parameters:**
```
GET /api/inventory/import/history?
  limit=10&
  skip=0&
  status=completed&
  sortBy=createdAt&
  sortOrder=desc
```

**Response - Success (200):**
```json
{
  "success": true,
  "data": {
    "imports": [
      {
        "sessionId": "sess_abc123xyz",
        "fileName": "properties_2025.xlsx",
        "status": "completed",
        "totalRows": 1250,
        "propertiesCreated": 850,
        "importedBy": "user@example.com",
        "createdAt": "2025-01-18T10:30:00Z",
        "completedAt": "2025-01-18T10:35:45Z",
        "successRate": "98.4%"
      }
    ],
    "total": 45,
    "limit": 10,
    "skip": 0
  }
}
```

---

## 9. Cancel Import Session

### `POST /session/:sessionId/cancel`
Cancels an ongoing import session.

**Request:**
```json
{
  "reason": "User requested cancellation"
}
```

**Response - Success (200):**
```json
{
  "success": true,
  "data": {
    "sessionId": "sess_abc123xyz",
    "status": "cancelled",
    "processedRows": 450,
    "totalRows": 1250,
    "cancelledAt": "2025-01-18T10:32:15Z"
  }
}
```

---

## 10. Download Import Report

### `GET /session/:sessionId/report`
Downloads detailed import report as CSV or PDF.

**Query Parameters:**
```
GET /api/inventory/import/session/sess_abc123xyz/report?format=pdf
```

**Response:**
- Content-Type: application/pdf or text/csv
- File attachment with detailed import statistics

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "details": {
    "field": "Additional context",
    "suggestion": "How to fix this"
  }
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `202` - Accepted (processing)
- `400` - Bad request / Validation error
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `409` - Conflict (duplicate session)
- `500` - Server error

---

## Rate Limiting

- Upload endpoint: 10 requests/minute
- Validation endpoint: 30 requests/minute
- Other endpoints: 60 requests/minute

Headers in response:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1705602600
```

---

## Authentication

All endpoints require authentication via Bearer token:

```
Authorization: Bearer <your_jwt_token>
```

---

## Complete Workflow Example

```javascript
// Step 1: Upload file
const uploadRes = await fetch('/api/inventory/import/upload', {
  method: 'POST',
  body: formData
});
const { data: uploadData } = await uploadRes.json();
const sessionId = uploadData.sessionId;

// Step 2: Auto-detect mapping
const mappingRes = await fetch('/api/inventory/import/detect-mapping', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    columns: uploadData.columns,
    sampleData: uploadData.preview
  })
});
const { data: mappingData } = await mappingRes.json();

// Step 3: Validate data
const validationRes = await fetch('/api/inventory/import/validate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId,
    strategy: 'balanced',
    mapping: mappingData.mapping
  })
});
const { data: validationData } = await validationRes.json();

// Step 4: Execute import
const executeRes = await fetch('/api/inventory/import/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId,
    columnMapping: mappingData.mapping,
    importStrategy: 'balanced',
    deduplicationStrategy: 'keep',
    statusMapping: {}
  })
});
const { data: importResult } = await executeRes.json();

console.log('Import complete!', importResult.summary);
```

---

## Webhooks (Optional Enhancement)

Configure webhooks for import events:

```json
POST /api/inventory/import/webhooks/configure

{
  "url": "https://your-domain.com/webhooks/import",
  "events": ["import.started", "import.completed", "import.failed"],
  "secret": "webhook_secret"
}
```

Events sent to webhook:
- `import.started` - Import session created
- `import.progress` - Progress update (every 10%)
- `import.completed` - Import finished successfully
- `import.failed` - Import encountered fatal error

---

## Support & Troubleshooting

For API issues:
1. Check error response details
2. Review request format and validation
3. Check authentication token expiration
4. Verify file format compatibility
5. Contact support with session ID

---

**Last Updated:** January 18, 2025
**API Version:** 1.0
**Status:** Production Ready
