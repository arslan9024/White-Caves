# API Endpoints Complete Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints (except login/register) require:
```
Authorization: Bearer {jwt_token}
```

---

## Property Inventory Endpoints

### 1. Get All Properties
**GET** `/property-inventory/properties`

**Query Parameters:**
- `page` (default: 1) - Page number
- `limit` (default: 20) - Items per page
- `status` - Filter by status
- `location` - Filter by location
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `propertyType` - Filter by type

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "location": "Dubai Marina",
      "propertyType": "Apartment",
      "bedrooms": 2,
      "bathrooms": 2,
      "area": 1500,
      "price": 1500000,
      "currency": "AED",
      "status": "Available",
      "owner": "507f1f77bcf86cd799439012",
      "description": "...",
      "amenities": ["Pool", "Gym"],
      "createdAt": "2024-01-15T12:00:00Z",
      "updatedAt": "2024-01-15T12:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

### 2. Get Property by ID
**GET** `/property-inventory/properties/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "location": "Dubai Marina",
    "propertyType": "Apartment",
    "bedrooms": 2,
    "bathrooms": 2,
    "area": 1500,
    "price": 1500000,
    "currency": "AED",
    "status": "Available",
    "owner": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Ahmed Al Mansouri",
      "email": "ahmed@example.com",
      "phone": "+971501234567"
    },
    "images": ["url1", "url2"],
    "videoLink": "https://...",
    "floorPlan": "url",
    "amenities": ["Pool", "Gym", "Security"],
    "interestedBuyers": [],
    "createdAt": "2024-01-15T12:00:00Z",
    "updatedAt": "2024-01-15T12:00:00Z"
  }
}
```

### 3. Create Property
**POST** `/property-inventory/properties`

**Request Body:**
```json
{
  "location": "Downtown Dubai",
  "propertyType": "Apartment",
  "bedrooms": 3,
  "bathrooms": 3,
  "area": 2000,
  "price": 2500000,
  "currency": "AED",
  "status": "Available",
  "owner": "507f1f77bcf86cd799439012",
  "description": "Luxury apartment",
  "amenities": ["Pool", "Gym"],
  "images": ["url1"],
  "videoLink": "https://..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Property created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "location": "Downtown Dubai",
    "propertyType": "Apartment",
    "bedrooms": 3,
    "bathrooms": 3,
    "area": 2000,
    "price": 2500000,
    "currency": "AED",
    "status": "Available",
    "owner": "507f1f77bcf86cd799439012",
    "createdAt": "2024-01-15T12:00:00Z"
  }
}
```

### 4. Update Property
**PUT** `/property-inventory/properties/:id`

**Request Body:** (send only fields to update)
```json
{
  "price": 2400000,
  "status": "Sold",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Property updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "location": "Dubai Marina",
    "propertyType": "Apartment",
    "price": 2400000,
    "status": "Sold",
    "description": "Updated description"
  }
}
```

### 5. Delete Property
**DELETE** `/property-inventory/properties/:id`

**Response:**
```json
{
  "success": true,
  "message": "Property deleted successfully"
}
```

### 6. Bulk Update Properties
**PATCH** `/property-inventory/properties/bulk-update`

**Request Body:**
```json
{
  "propertyIds": ["id1", "id2", "id3"],
  "updates": {
    "status": "Sold",
    "price": 1800000
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "3 properties updated successfully",
  "data": {
    "updatedCount": 3,
    "failedCount": 0
  }
}
```

---

## Smart Import Endpoints

### 1. Validate File
**POST** `/smartImport/validate-file`

**Request:** (multipart/form-data)
```
file: <Excel or CSV file>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "validRows": 95,
    "invalidRows": 5,
    "issues": [
      {
        "row": 2,
        "column": "price",
        "error": "Invalid number format",
        "value": "abc"
      }
    ],
    "suggestions": {
      "detectedColumns": ["location", "type", "bedrooms", "price"]
    }
  }
}
```

### 2. Create Import Session
**POST** `/smartImport/create-session`

**Request Body:**
```json
{
  "fileName": "properties.xlsx",
  "fileSize": 50000,
  "rowCount": 100
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "session-123",
    "fileName": "properties.xlsx",
    "status": "mapping",
    "rowCount": 100,
    "createdAt": "2024-01-15T12:00:00Z"
  }
}
```

### 3. Update Column Mapping
**POST** `/smartImport/:sessionId/column-mapping`

**Request Body:**
```json
{
  "mapping": {
    "A": "location",
    "B": "propertyType",
    "C": "bedrooms",
    "D": "price",
    "E": "owner"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Column mapping updated",
  "data": {
    "sessionId": "session-123",
    "mapping": {...}
  }
}
```

### 4. Get Preview Data
**GET** `/smartImport/:sessionId/preview`

**Query Parameters:**
- `rows` (default: 5) - Number of rows to preview

**Response:**
```json
{
  "success": true,
  "data": {
    "preview": [
      {
        "location": "Dubai Marina",
        "propertyType": "Apartment",
        "bedrooms": 2,
        "price": 1500000,
        "owner": "Ahmed"
      }
    ],
    "totalRows": 100
  }
}
```

### 5. Detect Duplicates
**POST** `/smartImport/:sessionId/detect-duplicates`

**Response:**
```json
{
  "success": true,
  "data": {
    "duplicates": [
      {
        "rows": [5, 45],
        "matchingFields": ["location", "propertyType", "bedrooms"],
        "similarity": 95
      }
    ],
    "totalDuplicateGroups": 3
  }
}
```

### 6. Resolve Duplicates
**POST** `/smartImport/:sessionId/resolve-duplicates`

**Request Body:**
```json
{
  "resolutions": [
    {
      "groupId": 1,
      "action": "keep-original",
      "primaryRowIndex": 5
    },
    {
      "groupId": 2,
      "action": "merge",
      "primaryRowIndex": 45
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Duplicates resolved"
}
```

### 7. Auto-Map Status
**POST** `/smartImport/:sessionId/auto-map-status`

**Request Body:**
```json
{
  "mappings": {
    "Active": "Available",
    "Rented": "Rented",
    "Sold": "Sold"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "mappedRows": 98,
    "unmappedRows": 2
  }
}
```

### 8. Execute Import
**POST** `/smartImport/:sessionId/execute`

**Request Body:**
```json
{
  "createNewOwners": true,
  "updateExisting": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Import completed successfully",
  "data": {
    "sessionId": "session-123",
    "status": "completed",
    "importedCount": 98,
    "failedCount": 2,
    "propertiesCreated": 80,
    "propertiesUpdated": 18,
    "errors": [
      {
        "row": 45,
        "error": "Owner not found and createNewOwners is false"
      }
    ]
  }
}
```

---

## Import History Endpoints

### 1. Get All Import Sessions
**GET** `/importHistory/sessions`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `status` - Filter by status (completed, failed, partial)
- `dateFrom` - Filter from date (YYYY-MM-DD)
- `dateTo` - Filter to date (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "session-123",
      "fileName": "properties.xlsx",
      "status": "completed",
      "importedCount": 98,
      "failedCount": 2,
      "user": "user-id",
      "createdAt": "2024-01-15T12:00:00Z",
      "completedAt": "2024-01-15T12:05:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### 2. Get Session Details
**GET** `/importHistory/sessions/:sessionId`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "session-123",
    "fileName": "properties.xlsx",
    "status": "completed",
    "importedCount": 98,
    "failedCount": 2,
    "errors": [],
    "columnMapping": {...},
    "statusMapping": {...},
    "duplicateResolutions": [...],
    "importedProperties": ["id1", "id2", ...],
    "createdAt": "2024-01-15T12:00:00Z"
  }
}
```

### 3. Get Session Report
**GET** `/importHistory/sessions/:sessionId/report`

**Response:**
```json
{
  "success": true,
  "data": {
    "fileName": "properties.xlsx",
    "summary": {
      "totalRows": 100,
      "successfulImports": 98,
      "failedImports": 2,
      "propertiesCreated": 80,
      "propertiesUpdated": 18
    },
    "errors": [
      {
        "row": 45,
        "data": {...},
        "error": "..."
      }
    ]
  }
}
```

### 4. Download Report CSV
**GET** `/importHistory/sessions/:sessionId/download-report`

Returns CSV file with import details

### 5. Retry Failed Import
**POST** `/importHistory/sessions/:sessionId/retry`

**Response:**
```json
{
  "success": true,
  "message": "Import retry initiated",
  "data": {
    "newSessionId": "session-124",
    "status": "processing"
  }
}
```

### 6. Delete Import Session
**DELETE** `/importHistory/sessions/:sessionId`

**Response:**
```json
{
  "success": true,
  "message": "Import session deleted successfully"
}
```

---

## Admin Endpoints

### 1. Get System Statistics
**GET** `/admin/statistics`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalProperties": 1500,
    "availableProperties": 750,
    "rentedProperties": 600,
    "soldProperties": 150,
    "totalOwners": 300,
    "totalImports": 45,
    "successfulImports": 43,
    "failedImports": 2,
    "totalUsers": 25,
    "activeUsers": 18,
    "storageUsed": "2.5GB",
    "storageLimit": "10GB"
  }
}
```

### 2. Get Recent Activity
**GET** `/admin/recent-activity`

**Query Parameters:**
- `limit` (default: 20)
- `type` - Filter by type (import, property_created, user_login)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "activity-1",
      "type": "import",
      "user": "user-id",
      "description": "Imported 98 properties",
      "timestamp": "2024-01-15T12:00:00Z",
      "details": {
        "sessionId": "session-123",
        "importCount": 98
      }
    }
  ]
}
```

### 3. Get User List
**GET** `/admin/users`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "user-1",
      "email": "user@example.com",
      "role": "agent",
      "status": "active",
      "lastLogin": "2024-01-15T12:00:00Z",
      "createdAt": "2024-01-10T10:00:00Z"
    }
  ]
}
```

### 4. Create User
**POST** `/admin/users`

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "role": "agent",
  "sendInvitation": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created and invitation sent",
  "data": {
    "_id": "user-25",
    "email": "newuser@example.com",
    "role": "agent"
  }
}
```

### 5. Update User Role
**PUT** `/admin/users/:userId`

**Request Body:**
```json
{
  "role": "admin"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User role updated"
}
```

### 6. Delete User
**DELETE** `/admin/users/:userId`

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### 7. Get System Settings
**GET** `/admin/settings`

**Response:**
```json
{
  "success": true,
  "data": {
    "applicationName": "White Caves",
    "defaultCurrency": "AED",
    "timezone": "Asia/Dubai",
    "language": "en",
    "maxFileUploadSize": 50,
    "allowedFileTypes": [".xlsx", ".csv"],
    "importBatchSize": 100,
    "maxPropertiesPerUser": null
  }
}
```

### 8. Update Settings
**PUT** `/admin/settings`

**Request Body:**
```json
{
  "applicationName": "White Caves v2",
  "defaultCurrency": "USD"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Settings updated successfully"
}
```

---

## Error Responses

### 400 - Bad Request
```json
{
  "success": false,
  "message": "Bad request",
  "errors": [
    {
      "field": "price",
      "error": "Price must be a positive number"
    }
  ]
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized access",
  "error": "Invalid or missing authentication token"
}
```

### 403 - Forbidden
```json
{
  "success": false,
  "message": "Access denied",
  "error": "You don't have permission to access this resource"
}
```

### 404 - Not Found
```json
{
  "success": false,
  "message": "Resource not found",
  "error": "Property with ID 'xxx' not found"
}
```

### 409 - Conflict
```json
{
  "success": false,
  "message": "Conflict",
  "error": "A property with this location already exists"
}
```

### 422 - Unprocessable Entity
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "location",
      "error": "Location is required"
    }
  ]
}
```

### 429 - Rate Limited
```json
{
  "success": false,
  "message": "Too many requests",
  "retryAfter": 60
}
```

### 500 - Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "An unexpected error occurred"
}
```

---

## Rate Limiting

All API endpoints are rate-limited:
- **General API**: 30 requests per 15 minutes per IP
- **File Upload**: 10 requests per 15 minutes per IP
- **Admin Endpoints**: 50 requests per 15 minutes per user

Rate limit headers included in response:
```
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 25
X-RateLimit-Reset: 1234567890
```

---

## Pagination

Endpoints supporting pagination include:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

**Last Updated**: January 2024
**API Version**: 1.0
**Document Version**: 1.0
