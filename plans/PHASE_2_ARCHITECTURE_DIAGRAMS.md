# Phase 2: Visual Architecture & Flow Diagrams

## System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────────┐
│                         WHITE CAVES DASHBOARD                              │
│                                                                              │
│  ┌─────────────────────────────────────┐  ┌──────────────────────────────┐ │
│  │     REACT COMPONENTS                │  │   REDUX STORE                │ │
│  │                                     │  │                              │ │
│  │  ┌─────────────────────────────┐   │  │  ┌──────────────────────────┐│ │
│  │  │ RelationalLeftSidebar       │   │  │  │relationalSidebarSlice    ││ │
│  │  │ - Department list           │   │  │  │ - departments: []        ││ │
│  │  │ - Service filter            │   │  │  │ - assistants: []         ││ │
│  │  └─────────────────────────────┘   │  │  │ - selectedDept: null     ││ │
│  │                                     │  │  │ - contextData: {}        ││ │
│  │  ┌─────────────────────────────┐   │  │  │ - loading: bool          ││ │
│  │  │ RelationalRightSidebar      │   │  │  │ - error: null/string     ││ │
│  │  │ - Assistant list            │   │  │  └──────────────────────────┘│ │
│  │  │ - Notification badges       │   │  │                              │ │
│  │  │ - Status indicators         │   │  └──────────────────────────────┘ │
│  │  └─────────────────────────────┘   │                                    │
│  │                                     │                                    │
│  │  ┌─────────────────────────────┐   │  Dispatch Thunks:               │ │
│  │  │ MaryInventorySidebar        │   │  • fetchDepartments()           │ │
│  │  │ (Context-specific)          │   │  • fetchAssistants()            │ │
│  │  │ - Inventory items           │   │  • fetchContextualData()        │ │
│  │  │ - Stock levels              │   │  • sendNotification()           │ │
│  │  └─────────────────────────────┘   │                                    │
│  │                                     │                                    │
│  └─────────────────────────────────────┘                                    │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │          API SERVICE LAYER (src/services/relationalSidebarAPI.js)    │  │
│  │                                                                      │  │
│  │  • getDepartments()                                                │  │
│  │  • getDepartmentById()                                             │  │
│  │  • getAssistants()                                                │  │
│  │  • getAssistantById()                                             │  │
│  │  • getContextualData()                                            │  │
│  │  • sendNotification()                                             │  │
│  │  • Error handling & logging                                       │  │
│  │                                                                      │  │
│  └────────────────────────────────┬───────────────────────────────────┘  │
│                                    │                                       │
│                          HTTP Requests (JSON)                             │
│                                    │                                       │
└────────────────────────────────────┼───────────────────────────────────────┘
                                     │
                   ┌─────────────────↓─────────────────┐
                   │   NETWORK/INTERNET                 │
                   │   (HTTP/HTTPS)                     │
                   └─────────────────┬─────────────────┘
                                     │
┌────────────────────────────────────┼───────────────────────────────────────┐
│                    EXPRESS.JS BACKEND SERVER                               │
│                                    │                                       │
│  ┌────────────────────────────────↓────────────────────────────┐         │
│  │         ROUTING LAYER (/api/relational-sidebar/routes.js)   │         │
│  │                                                             │         │
│  │  GET  /departments                                         │         │
│  │  GET  /departments/:id                                    │         │
│  │  GET  /assistants (+ filters)                            │         │
│  │  GET  /assistants/:id                                    │         │
│  │  GET  /assistants/:id/contexts/:context                  │         │
│  │  POST /assistants/:id/notifications                      │         │
│  │                                                             │         │
│  └────────────────┬───────────────────────────────────────────┘         │
│                   │                                                       │
│  ┌────────────────↓───────────────────────────────────────────┐         │
│  │      MIDDLEWARE LAYER (error handling, validation)         │         │
│  │                                                             │         │
│  │  ├─ Error Handler Middleware                             │         │
│  │  │  └─ Catches async errors                              │         │
│  │  │  └─ Formats error responses                           │         │
│  │  │                                                         │         │
│  │  └─ Validation Middleware                                │         │
│  │     └─ Type checking                                     │         │
│  │     └─ Required fields                                   │         │
│  │     └─ Enum validation                                   │         │
│  │                                                             │         │
│  └────────────────┬───────────────────────────────────────────┘         │
│                   │                                                       │
│  ┌────────────────↓───────────────────────────────────────────┐         │
│  │  CONTROLLERS LAYER (Business Logic)                        │         │
│  │                                                             │         │
│  │  ├─ departmentController                                 │         │
│  │  │  ├─ getAllDepartments()                               │         │
│  │  │  ├─ getDepartmentById()                               │         │
│  │  │  └─ getDepartmentsByService()                         │         │
│  │  │                                                         │         │
│  │  ├─ assistantController                                  │         │
│  │  │  ├─ getAssistants()                                  │         │
│  │  │  ├─ getAssistantById()                               │         │
│  │  │  └─ updateAssistant()                                │         │
│  │  │                                                         │         │
│  │  ├─ contextController                                    │         │
│  │  │  ├─ getContextualData()                              │         │
│  │  │  ├─ getAllContextsForAssistant()                     │         │
│  │  │  └─ updateContextData()                              │         │
│  │  │                                                         │         │
│  │  └─ notificationController                               │         │
│  │     ├─ sendNotification()                                │         │
│  │     ├─ getNotifications()                                │         │
│  │     └─ markAsRead()                                      │         │
│  │                                                             │         │
│  └────────────────┬───────────────────────────────────────────┘         │
│                   │                                                       │
│  ┌────────────────↓───────────────────────────────────────────┐         │
│  │      DATA LAYER (Mock Data - Upgradeable to DB)           │         │
│  │                                                             │         │
│  │  ├─ departments[] (4 items)                              │         │
│  │  ├─ assistants[] (4 items)                               │         │
│  │  ├─ contextData[] (6 contexts)                           │         │
│  │  └─ notifications[] (real-time)                          │         │
│  │                                                             │         │
│  │  Future: MongoDB / PostgreSQL                             │         │
│  │                                                             │         │
│  └────────────────────────────────────────────────────────────┘         │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
┌─────────────────────┐
│   USER INTERACTION  │
│   (Click Department)│
└──────────┬──────────┘
           │
           ↓
┌──────────────────────────────────────────┐
│ Component Handler (onClick)               │
│ dispatch(fetchFilteredAssistants({        │
│   filterType: 'department',              │
│   filterId: 'OPERATIONS'                 │
│ }))                                       │
└──────────┬──────────────────────────────┘
           │
           ↓
┌──────────────────────────────────────────┐
│ Redux Dispatch                            │
│ - Action dispatched                      │
│ - Pending state: loading = true          │
└──────────┬──────────────────────────────┘
           │
           ↓
┌──────────────────────────────────────────┐
│ Async Thunk                               │
│ (relationalSidebarThunks.js)              │
│ Calls: sidebarAPI.getFilteredAssistants()│
└──────────┬──────────────────────────────┘
           │
           ↓
┌──────────────────────────────────────────┐
│ API Service Layer                         │
│ (relationalSidebarAPI.js)                 │
│ fetch(BASE_URL + endpoint, options)      │
└──────────┬──────────────────────────────┘
           │
           ↓ HTTP Request
┌──────────────────────────────────────────┐
│ HTTP GET /api/relational-sidebar/        │
│         assistants?department=OPERATIONS │
└──────────┬──────────────────────────────┘
           │
           ↓
┌──────────────────────────────────────────┐
│ Backend Route Handler                    │
│ router.get('/assistants')                │
│ Validation middleware checks query       │
└──────────┬──────────────────────────────┘
           │
           ↓
┌──────────────────────────────────────────┐
│ Controller Function                      │
│ assistantController.getAssistants()      │
│ Filters mock data by department          │
└──────────┬──────────────────────────────┘
           │
           ↓
┌──────────────────────────────────────────┐
│ Data Processing                          │
│ [                                         │
│   { id: 'mary_001', name: 'Mary', ... }  │
│ ]                                         │
└──────────┬──────────────────────────────┘
           │
           ↓ HTTP Response
┌──────────────────────────────────────────┐
│ JSON Response (200 OK)                   │
│ {                                         │
│   "success": true,                       │
│   "data": [ assistant objects ],         │
│   "count": 1                             │
│ }                                         │
└──────────┬──────────────────────────────┘
           │
           ↓
┌──────────────────────────────────────────┐
│ API Service Response Handler             │
│ - Check response.success                 │
│ - Return data or error                   │
└──────────┬──────────────────────────────┘
           │
           ↓
┌──────────────────────────────────────────┐
│ Thunk Fulfilled State                    │
│ - error = null                           │
│ - loading = false                        │
│ - Store dispatch(fulfilled action)       │
└──────────┬──────────────────────────────┘
           │
           ↓
┌──────────────────────────────────────────┐
│ Redux Reducer                            │
│ state.assistants = [ Mary ]              │
│ state.loading = false                    │
└──────────┬──────────────────────────────┘
           │
           ↓
┌──────────────────────────────────────────┐
│ Component Re-render                      │
│ useSelector(state =>                     │
│   state.relationalSidebar.assistants)   │
└──────────┬──────────────────────────────┘
           │
           ↓
┌──────────────────────────────────────────┐
│ UI Update                                 │
│ Display filtered assistants              │
│ Right sidebar shows only Mary            │
└──────────────────────────────────────────┘
```

---

## API Endpoint Flow Diagram

```
                         API REQUEST
                              │
                    ┌─────────┴─────────┐
                    │                   │
            GET Request           POST Request
                    │                   │
        ┌───────────┼───────────┐       │
        │           │           │       │
   /departments /assistants /contexts /notifications
        │           │           │       │
        ↓           ↓           ↓       │
    Get Depts   Get Assists  Get Data  │
    by ID/All   + Filter     by Ctxt   │
        │           │           │       │
        └───────────┼───────────┘       │
                    │                   │
              ┌─────↓─────┐         ┌───↓────┐
              │ Controller │         │ Create │
              │ - Query    │         │ - Send │
              │ - Filter   │         │ - Log  │
              │ - Return   │         └────┬───┘
              └─────┬─────┘              │
                    │                   │
              ┌─────↓──────────────────┬─┘
              │                        │
          ┌───↓──────┐          ┌──────↓────┐
          │ Mock Data │          │ In-Memory │
          │ (or DB)   │          │ Store     │
          └───┬──────┘          └──────┬────┘
              │                        │
              └─────────┬──────────────┘
                        │
                    ┌───↓────┐
                    │Response │
                    │ Formatter
                    └───┬────┘
                        │
                   ┌────↓─────┐
                   │ JSON Resp │
                   │ {         │
                   │ success:  │
                   │ data:     │
                   │ error:    │
                   │ }         │
                   └──────────┘
```

---

## Request/Response Example Flow

```
FRONTEND REQUEST
┌────────────────────────────────────────┐
│ GET /assistants?department=OPERATIONS │
├────────────────────────────────────────┤
│ Headers:                               │
│ - Content-Type: application/json       │
│ - Authorization: Bearer token          │
│                                        │
│ Query Params:                          │
│ - department: "OPERATIONS"             │
└────────────────────────────────────────┘
           │
           ↓ (HTTP)
           
BACKEND PROCESSING
┌────────────────────────────────────────┐
│ Route Match: GET /assistants           │
├────────────────────────────────────────┤
│ Middleware 1: Error Handler            │
│ - Wraps controller in try-catch        │
│                                        │
│ Middleware 2: Validation               │
│ - Checks query params                  │
│ - Validates department value           │
│                                        │
│ Controller: assistantController        │
│ - getAssistants({department: ...})     │
│ - Filters mock data                    │
│ - Returns matching assistants          │
└────────────────────────────────────────┘
           │
           ↓ (HTTP)

BACKEND RESPONSE
┌────────────────────────────────────────┐
│ HTTP 200 OK                            │
├────────────────────────────────────────┤
│ {                                      │
│   "success": true,                     │
│   "data": [                            │
│     {                                  │
│       "id": "mary_001",                │
│       "name": "Mary",                  │
│       "department": "OPERATIONS",      │
│       "isActive": true,                │
│       "services": [...],               │
│       "permissions": {...}             │
│     }                                  │
│   ],                                   │
│   "count": 1,                          │
│   "filters": {                         │
│     "department": "OPERATIONS"         │
│   },                                   │
│   "timestamp": "2024-01-20T10:30:00Z"  │
│ }                                      │
└────────────────────────────────────────┘
           │
           ↓ (Frontend)

FRONTEND HANDLING
┌────────────────────────────────────────┐
│ API Service                            │
│ - Check response.success               │
│ - Return data                          │
│                                        │
│ Redux Thunk                            │
│ - Dispatch fulfilled action            │
│ - payload = [Mary]                     │
│                                        │
│ Redux Reducer                          │
│ - state.assistants = [Mary]            │
│ - state.loading = false                │
│                                        │
│ Component                              │
│ - useSelector hook                     │
│ - Receive new data                     │
│ - Re-render with Mary                  │
└────────────────────────────────────────┘
```

---

## Error Flow Diagram

```
ERROR SCENARIO
┌──────────────────────┐
│ Invalid Department   │
│ GET /assistants?     │
│ department=INVALID   │
└──────┬───────────────┘
       │
       ↓
┌──────────────────────────────┐
│ Validation Middleware        │
│ - Check query params         │
│ - Validate department value  │
│ - Not in valid list          │
│ - Return 400 Bad Request     │
│ [Could also skip if optional]│
└──────┬───────────────────────┘
       │
       ↓
┌──────────────────────────────┐
│ Response                     │
│ HTTP 400 Bad Request         │
│ {                            │
│   "success": false,          │
│   "error": "Validation ...", │
│   "details": [...]           │
│ }                            │
└──────┬───────────────────────┘
       │
       ↓
┌──────────────────────────────┐
│ Frontend Handler             │
│ - Check response.success     │
│ - Is false                   │
│ - Set error state            │
│ - Show error message         │
└──────────────────────────────┘
```

---

## State Management Flow

```
┌──────────────────────────────────────────────────────┐
│         Redux relationalSidebarSlice                 │
├──────────────────────────────────────────────────────┤
│                                                      │
│  INITIAL STATE                                       │
│  ├─ departments: []                                 │
│  ├─ assistants: []                                  │
│  ├─ selectedDepartment: null                        │
│  ├─ selectedAssistant: null                         │
│  ├─ contextData: {}                                 │
│  ├─ notifications: []                               │
│  ├─ loading: false                                  │
│  └─ error: null                                     │
│                                                      │
│  THUNK ACTIONS                                       │
│  ├─ fetchDepartments()                             │
│  │  ├─ Pending: loading = true                     │
│  │  ├─ Fulfilled: departments = data, loading = false
│  │  └─ Rejected: error = msg, loading = false      │
│  │                                                   │
│  ├─ fetchAssistants(filters)                       │
│  │  ├─ Pending: loading = true                     │
│  │  ├─ Fulfilled: assistants = data                │
│  │  └─ Rejected: error = msg                       │
│  │                                                   │
│  ├─ fetchContextualData({assistantId, context})    │
│  │  ├─ Pending: loading = true                     │
│  │  ├─ Fulfilled: contextData = data               │
│  │  └─ Rejected: error = msg                       │
│  │                                                   │
│  └─ sendNotification({assistantId, message, type}) │
│     ├─ Pending: loading = true                     │
│     ├─ Fulfilled: notification created             │
│     └─ Rejected: error = msg                       │
│                                                      │
│  SELECTORS (for Components)                         │
│  ├─ selectDepartments(state)                       │
│  ├─ selectAssistants(state)                        │
│  ├─ selectLoading(state)                           │
│  ├─ selectError(state)                             │
│  └─ selectContextData(state)                       │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## Document Info

- **Created**: 2024-01-20
- **Type**: Architecture & Flow Diagrams
- **Phase**: 2 (Backend API Integration)
- **Diagrams**: 6 visual representations
