# Phase 2: Backend API Integration Testing Guide

## Overview

This guide covers testing the 6 backend API endpoints for the relational sidebar system:

1. **GET /departments** - Get all departments
2. **GET /departments/:id** - Get specific department
3. **GET /assistants** - Get all assistants (with filtering)
4. **GET /assistants/:id** - Get specific assistant
5. **GET /assistants/:id/contexts/:context** - Get contextual data
6. **POST /assistants/:id/notifications** - Send notification

**Base URL**: `http://localhost:3000/api/relational-sidebar`

---

## Setup

### 1. Start the Backend Server

```bash
# From project root
npm run dev
# or
node api/index.js
```

### 2. Verify Health

```bash
curl http://localhost:3000/api/relational-sidebar/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "uptime": 45.123
}
```

---

## Endpoint Testing

### 1. GET /departments

**Description**: Get all departments with their services

**Request**:
```bash
curl -X GET http://localhost:3000/api/relational-sidebar/departments
```

**Expected Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "OPERATIONS",
      "name": "Operations",
      "description": "Operational tasks and management",
      "icon": "settings",
      "color": "#3b82f6",
      "services": [
        { "id": "inventory", "name": "Inventory", "icon": "package" },
        { "id": "maintenance", "name": "Maintenance", "icon": "wrench" },
        { "id": "schedules", "name": "Schedules", "icon": "calendar" }
      ]
    },
    // ... more departments
  ],
  "count": 4,
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

**Testing Checklist**:
- [ ] Response status is 200
- [ ] `success` is true
- [ ] `data` is an array of departments
- [ ] Each department has all required fields
- [ ] Each department has `services` array

---

### 2. GET /departments/:id

**Description**: Get specific department details

**Request**:
```bash
curl -X GET http://localhost:3000/api/relational-sidebar/departments/OPERATIONS
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "id": "OPERATIONS",
    "name": "Operations",
    "description": "Operational tasks and management",
    "icon": "settings",
    "color": "#3b82f6",
    "services": [
      { "id": "inventory", "name": "Inventory", "icon": "package" },
      { "id": "maintenance", "name": "Maintenance", "icon": "wrench" },
      { "id": "schedules", "name": "Schedules", "icon": "calendar" }
    ]
  },
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

**Test Cases**:

```bash
# Test 1: Valid department
curl -X GET http://localhost:3000/api/relational-sidebar/departments/OPERATIONS

# Test 2: Invalid department (should return 404)
curl -X GET http://localhost:3000/api/relational-sidebar/departments/INVALID

# Test 3: All valid departments
curl -X GET http://localhost:3000/api/relational-sidebar/departments/SALES
curl -X GET http://localhost:3000/api/relational-sidebar/departments/MARKETING
curl -X GET http://localhost:3000/api/relational-sidebar/departments/SUPPORT
```

**Testing Checklist**:
- [ ] Valid ID returns correct department
- [ ] Invalid ID returns 404 with error message
- [ ] Response contains all department details
- [ ] Services are properly populated

---

### 3. GET /assistants

**Description**: Get all assistants with optional filtering

**Request (no filters)**:
```bash
curl -X GET http://localhost:3000/api/relational-sidebar/assistants
```

**Request (with filters)**:
```bash
# Filter by department
curl -X GET "http://localhost:3000/api/relational-sidebar/assistants?department=OPERATIONS"

# Filter by service
curl -X GET "http://localhost:3000/api/relational-sidebar/assistants?service=inventory"

# Filter by permission (active only)
curl -X GET "http://localhost:3000/api/relational-sidebar/assistants?hasPermission=true"

# Combine filters
curl -X GET "http://localhost:3000/api/relational-sidebar/assistants?department=OPERATIONS&hasPermission=true"
```

**Expected Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "mary_001",
      "name": "Mary",
      "role": "Assistant",
      "department": "OPERATIONS",
      "services": [
        { "id": "inventory", "name": "Inventory" },
        { "id": "maintenance", "name": "Maintenance" }
      ],
      "isActive": true,
      "avatar": "https://i.pravatar.cc/150?img=1",
      "email": "mary@whitecaves.com",
      "lastActivity": "2024-01-20T10:25:00.000Z",
      "notificationCount": 3,
      "status": "active",
      "availableContexts": ["inventory", "campaigns"],
      "permissions": {
        "canViewInventory": true,
        "canEditInventory": true,
        "canViewReports": true,
        "canSendNotifications": false
      }
    },
    // ... more assistants
  ],
  "count": 4,
  "filters": {},
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

**Test Cases**:

```bash
# Test 1: No filters (get all)
curl -X GET http://localhost:3000/api/relational-sidebar/assistants

# Test 2: Filter by department
curl -X GET "http://localhost:3000/api/relational-sidebar/assistants?department=OPERATIONS"
# Expected: Only Mary (OPERATIONS)

# Test 3: Filter by service
curl -X GET "http://localhost:3000/api/relational-sidebar/assistants?service=inventory"
# Expected: Only Mary (has inventory service)

# Test 4: Filter by active only
curl -X GET "http://localhost:3000/api/relational-sidebar/assistants?hasPermission=true"
# Expected: Mary, Nina, Linda (not Support Agent)

# Test 5: Combine filters
curl -X GET "http://localhost:3000/api/relational-sidebar/assistants?department=SALES&hasPermission=true"
# Expected: Only Nina
```

**Testing Checklist**:
- [ ] No filters returns all assistants
- [ ] Department filter works correctly
- [ ] Service filter works correctly
- [ ] hasPermission filter works correctly
- [ ] Multiple filters work together
- [ ] Response includes all assistant details
- [ ] Count is accurate

---

### 4. GET /assistants/:id

**Description**: Get specific assistant details

**Request**:
```bash
curl -X GET http://localhost:3000/api/relational-sidebar/assistants/mary_001
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "id": "mary_001",
    "name": "Mary",
    "role": "Assistant",
    "department": "OPERATIONS",
    "services": [...],
    "isActive": true,
    "avatar": "https://i.pravatar.cc/150?img=1",
    "email": "mary@whitecaves.com",
    "lastActivity": "2024-01-20T10:25:00.000Z",
    "notificationCount": 3,
    "status": "active",
    "availableContexts": ["inventory", "campaigns"],
    "permissions": {...}
  },
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

**Test Cases**:

```bash
# Test 1: Valid assistant
curl -X GET http://localhost:3000/api/relational-sidebar/assistants/mary_001

# Test 2: Another valid assistant
curl -X GET http://localhost:3000/api/relational-sidebar/assistants/nina_001

# Test 3: Invalid assistant (should return 404)
curl -X GET http://localhost:3000/api/relational-sidebar/assistants/invalid_999

# Test 4: Inactive assistant
curl -X GET http://localhost:3000/api/relational-sidebar/assistants/agent_001
```

**Testing Checklist**:
- [ ] Valid assistant returns correct details
- [ ] Invalid assistant returns 404
- [ ] All assistant properties are present
- [ ] Permissions object is complete
- [ ] AvailableContexts array is present

---

### 5. GET /assistants/:id/contexts/:context

**Description**: Get context-specific data for assistant

**Request**:
```bash
curl -X GET http://localhost:3000/api/relational-sidebar/assistants/mary_001/contexts/inventory
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "assistantId": "mary_001",
    "context": "inventory",
    "itemCount": 45,
    "lastUpdated": "2024-01-20T10:25:00.000Z",
    "items": [
      {
        "id": "inv_001",
        "name": "Paint - White",
        "quantity": 120,
        "unit": "liters",
        "lastRestocked": "2024-01-15"
      },
      // ... more items
    ],
    "fetchedAt": "2024-01-20T10:30:00.000Z"
  },
  "assistantId": "mary_001",
  "context": "inventory",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

**Test Cases**:

```bash
# Test 1: Mary - Inventory
curl -X GET http://localhost:3000/api/relational-sidebar/assistants/mary_001/contexts/inventory

# Test 2: Mary - Campaigns
curl -X GET http://localhost:3000/api/relational-sidebar/assistants/mary_001/contexts/campaigns

# Test 3: Nina - Campaigns
curl -X GET http://localhost:3000/api/relational-sidebar/assistants/nina_001/contexts/campaigns

# Test 4: Nina - Clients
curl -X GET http://localhost:3000/api/relational-sidebar/assistants/nina_001/contexts/clients

# Test 5: Linda - Messages
curl -X GET http://localhost:3000/api/relational-sidebar/assistants/linda_001/contexts/messages

# Test 6: Linda - Analytics
curl -X GET http://localhost:3000/api/relational-sidebar/assistants/linda_001/contexts/analytics

# Test 7: Invalid context (should return 400)
curl -X GET http://localhost:3000/api/relational-sidebar/assistants/mary_001/contexts/invalid

# Test 8: Non-existent context for assistant (should return 404)
curl -X GET http://localhost:3000/api/relational-sidebar/assistants/mary_001/contexts/clients
```

**Testing Checklist**:
- [ ] Valid context returns correct data
- [ ] Invalid context returns 400 with valid contexts list
- [ ] Non-existent assistant/context combo returns 404
- [ ] Items array is populated correctly
- [ ] ItemCount matches items array length
- [ ] LastUpdated is present and valid

---

### 6. POST /assistants/:id/notifications

**Description**: Send notification to assistant

**Request**:
```bash
curl -X POST http://localhost:3000/api/relational-sidebar/assistants/mary_001/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "message": "This is a test notification",
    "type": "info"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "id": "notif_1705754400000_abc123def",
    "assistantId": "mary_001",
    "message": "This is a test notification",
    "type": "info",
    "timestamp": "2024-01-20T10:30:00.000Z",
    "read": false
  },
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

**Test Cases**:

```bash
# Test 1: Send info notification
curl -X POST http://localhost:3000/api/relational-sidebar/assistants/mary_001/notifications \
  -H "Content-Type: application/json" \
  -d '{"message": "New inventory request", "type": "info"}'

# Test 2: Send warning notification
curl -X POST http://localhost:3000/api/relational-sidebar/assistants/mary_001/notifications \
  -H "Content-Type: application/json" \
  -d '{"message": "Inventory level critical", "type": "warning"}'

# Test 3: Send success notification
curl -X POST http://localhost:3000/api/relational-sidebar/assistants/nina_001/notifications \
  -H "Content-Type: application/json" \
  -d '{"message": "Campaign approved", "type": "success"}'

# Test 4: Send error notification
curl -X POST http://localhost:3000/api/relational-sidebar/assistants/linda_001/notifications \
  -H "Content-Type: application/json" \
  -d '{"message": "Failed to send message", "type": "error"}'

# Test 5: Missing message (should return 400)
curl -X POST http://localhost:3000/api/relational-sidebar/assistants/mary_001/notifications \
  -H "Content-Type: application/json" \
  -d '{"type": "info"}'

# Test 6: Invalid notification type (should return 400)
curl -X POST http://localhost:3000/api/relational-sidebar/assistants/mary_001/notifications \
  -H "Content-Type: application/json" \
  -d '{"message": "Test", "type": "invalid"}'

# Test 7: Default type (no type specified)
curl -X POST http://localhost:3000/api/relational-sidebar/assistants/nina_001/notifications \
  -H "Content-Type: application/json" \
  -d '{"message": "Default type notification"}'
```

**Testing Checklist**:
- [ ] All notification types (info, warning, error, success) work
- [ ] Notification ID is generated
- [ ] Timestamp is valid ISO format
- [ ] Read status defaults to false
- [ ] Missing message returns 400 error
- [ ] Invalid type returns 400 error
- [ ] Default type is "info"
- [ ] Response status is 201

---

## Integration Testing with Frontend

### Setup

1. **Update API Configuration**:

```javascript
// src/services/relationalSidebarAPI.js

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000';
```

2. **Test in Redux Thunks**:

```javascript
// In relationalSidebarSlice.js

export const fetchDepartments = createAsyncThunk(
  'relationalSidebar/fetchDepartments',
  async (_, { rejectWithValue }) => {
    const response = await getDepartments();
    if (!response.success) {
      return rejectWithValue(response.error);
    }
    return response.data;
  }
);
```

### Integration Tests

```bash
# Test 1: Initial load (departments + assistants)
# Open browser and navigate to dashboard
# Verify left sidebar loads with departments
# Verify right sidebar loads with assistants

# Test 2: Department selection
# Click on SALES department
# Verify only Sales assistants appear in right sidebar
# Verify services update

# Test 3: Assistant selection
# Click on an assistant
# Verify notification badge appears
# Verify correct contextual sidebar appears (if applicable)

# Test 4: Notification
# Send notification via API
# Verify badge count increases in UI
# Verify toast notification appears
```

---

## Performance Testing

### Load Testing

```bash
# Using Apache Bench (ab)
ab -n 1000 -c 10 http://localhost:3000/api/relational-sidebar/departments

# Using wrk
wrk -t12 -c400 -d30s http://localhost:3000/api/relational-sidebar/assistants
```

### Expected Performance

- **Response Time**: < 200ms per request
- **Throughput**: > 100 requests/second
- **Memory**: Stable < 100MB increase

---

## Debugging

### Enable Debug Logging

```javascript
// In browser console
localStorage.setItem('DEBUG_API', 'true');

// Watch network tab in DevTools
// All API calls will be logged
```

### Common Issues

| Issue | Solution |
|-------|----------|
| CORS errors | Add CORS headers to backend |
| 404 errors | Verify endpoint URL and method |
| Empty data | Check mock data is loaded |
| Slow responses | Profile with DevTools |

---

## Next Steps

1. ✅ Create API endpoints
2. ✅ Create API service layer
3. ✅ Create test guide (THIS DOCUMENT)
4. ⬜ **Integrate with Redux slices** (NEXT)
5. ⬜ Add real database models
6. ⬜ Run integration tests
7. ⬜ Performance optimization
8. ⬜ Production deployment

---

## Document Info

- **Created**: 2024-01-20
- **Phase**: 2 (Backend Integration)
- **Status**: Ready for Testing
- **Last Updated**: 2024-01-20
