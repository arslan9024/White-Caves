# Smart Mary Data Import System - Architecture & Data Flow

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         WHITE CAVES REAL ESTATE APP                      │
└─────────────────────────────────────────────────────────────────────────┘
                                      ↓
        ┌─────────────────────────────────────────────────────────┐
        │                    REACT FRONTEND                       │
        ├─────────────────────────────────────────────────────────┤
        │                                                          │
        │  ┌────────────────────────────────────────────────┐    │
        │  │     Data Import Wizard Module                  │    │
        │  ├────────────────────────────────────────────────┤    │
        │  │ • DataImportWizard.jsx (Main Component)       │    │
        │  │   ├── ColumnMappingEditor.jsx                 │    │
        │  │   ├── PreviewGridWithFilters.jsx              │    │
        │  │   ├── DuplicateResolutionPanel.jsx            │    │
        │  │   └── StatusMappingPreview.jsx                │    │
        │  └────────────────────────────────────────────────┘    │
        │                      ↓↑ API Calls                       │
        │  ┌────────────────────────────────────────────────┐    │
        │  │     Import History Module (NEW)                │    │
        │  ├────────────────────────────────────────────────┤    │
        │  │ • ImportHistoryPage.jsx                        │    │
        │  │   ├── Import Table with Filters               │    │
        │  │   ├── Statistics Summary                       │    │
        │  │   └── ImportDetailModal.jsx                    │    │
        │  └────────────────────────────────────────────────┘    │
        │                      ↓↑ API Calls                       │
        │  ┌────────────────────────────────────────────────┐    │
        │  │     Admin Dashboard Module (NEW)               │    │
        │  ├────────────────────────────────────────────────┤    │
        │  │ • AdminDashboard.jsx                           │    │
        │  │   ├── OverviewTab (Metrics + Charts)           │    │
        │  │   ├── ImportsTab (Session Tracking)            │    │
        │  │   ├── UsersTab (Activity Monitoring)           │    │
        │  │   ├── DatabaseTab (Collection Stats)           │    │
        │  │   └── AlertsTab (System Alerts)                │    │
        │  └────────────────────────────────────────────────┘    │
        │                                                          │
        └─────────────────────────────────────────────────────────┘
                              ↓↑ HTTPS
        ┌─────────────────────────────────────────────────────────┐
        │                  NODE.JS/EXPRESS BACKEND                │
        ├─────────────────────────────────────────────────────────┤
        │                                                          │
        │  ┌────────────────────────────────────────────────┐    │
        │  │        API Route: smartImport.routes.js        │    │
        │  ├────────────────────────────────────────────────┤    │
        │  │ POST /api/inventory/import/validate           │    │
        │  │ POST /api/inventory/import/execute            │    │
        │  │ GET  /api/inventory/import/status/:sessionId  │    │
        │  └────────────────────────────────────────────────┘    │
        │                      ↓↑                                 │
        │  ┌────────────────────────────────────────────────┐    │
        │  │    API Route: importHistory.routes.js (NEW)    │    │
        │  ├────────────────────────────────────────────────┤    │
        │  │ GET /api/inventory/import/history            │    │
        │  │ GET /api/inventory/import/session/:id        │    │
        │  │ GET /api/inventory/import/session/:id/errors │    │
        │  │ GET /api/inventory/import/session/:id/report │    │
        │  │ GET /api/admin/dashboard                     │    │
        │  │ GET /api/admin/system-health                 │    │
        │  └────────────────────────────────────────────────┘    │
        │                      ↓↑                                 │
        │  ┌────────────────────────────────────────────────┐    │
        │  │           Business Logic Layer                 │    │
        │  ├────────────────────────────────────────────────┤    │
        │  │ • importValidationEngine.js (Validate Data)   │    │
        │  │ • importExecutionEngine.js (Import Data)      │    │
        │  │ • deduplicationService.js (Find Duplicates)   │    │
        │  │ • statusAutoMapper.js (Map Status Fields)     │    │
        │  │ • clusterAutoAssigner.js (Auto-assign Areas)  │    │
        │  └────────────────────────────────────────────────┘    │
        │                      ↓↑                                 │
        │  ┌────────────────────────────────────────────────┐    │
        │  │           Data Models (Mongoose)              │    │
        │  ├────────────────────────────────────────────────┤    │
        │  │ • Property.js (Property Details)              │    │
        │  │ • Owner.js (Owner Information)                │    │
        │  │ • OwnerPropertyMapping.js (Relationships)     │    │
        │  │ • ImportSession.js (Import Tracking)          │    │
        │  └────────────────────────────────────────────────┘    │
        │                                                          │
        └─────────────────────────────────────────────────────────┘
                              ↓↑ MongoDB Driver
        ┌─────────────────────────────────────────────────────────┐
        │                   MONGODB DATABASE                       │
        ├─────────────────────────────────────────────────────────┤
        │                                                          │
        │  ┌─────────────────────┐  ┌────────────────────────┐  │
        │  │  Properties Table   │  │  Owners Table          │  │
        │  ├─────────────────────┤  ├────────────────────────┤  │
        │  │ • _id               │  │ • _id                  │  │
        │  │ • address           │  │ • name                 │  │
        │  │ • area              │  │ • email                │  │
        │  │ • price             │  │ • phone                │  │
        │  │ • status            │  │ • documents            │  │
        │  │ • cluster           │  │ • address              │  │
        │  │ • createdAt         │  │ • createdAt            │  │
        │  └─────────────────────┘  └────────────────────────┘  │
        │                                                          │
        │  ┌──────────────────────────────────────────────────┐  │
        │  │  Owner-Property Mapping Table                    │  │
        │  ├──────────────────────────────────────────────────┤  │
        │  │ • _id                                            │  │
        │  │ • ownerId → Owner._id                            │  │
        │  │ • propertyId → Property._id                      │  │
        │  │ • relationshipType (owner, tenant, etc.)         │  │
        │  │ • createdAt                                      │  │
        │  └──────────────────────────────────────────────────┘  │
        │                                                          │
        │  ┌──────────────────────────────────────────────────┐  │
        │  │  Import Sessions Table (NEW)                     │  │
        │  ├──────────────────────────────────────────────────┤  │
        │  │ • _id / sessionId (unique)                       │  │
        │  │ • userId (who ran import)                        │  │
        │  │ • fileName (source file)                         │  │
        │  │ • fileSize                                       │  │
        │  │ • totalRows (in source)                          │  │
        │  │ • propertiesCreated / Updated                    │  │
        │  │ • ownersCreated / Updated                        │  │
        │  │ • duplicatesFound                                │  │
        │  │ • status (completed/failed/partial/processing)  │  │
        │  │ • successRate (percentage)                       │  │
        │  │ • errors[] (detailed error logs)                 │  │
        │  │ • createdAt / completedAt                        │  │
        │  └──────────────────────────────────────────────────┘  │
        │                                                          │
        └─────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagrams

### Import Workflow

```
┌──────────────────┐
│  User Upload     │
│   Excel File     │
└────────┬─────────┘
         ↓
┌──────────────────────────────┐
│  DataImportWizard.jsx        │
│  1. File Upload              │
│  2. Column Mapping           │
│  3. Preview & Filter         │
│  4. Duplicate Resolution     │
│  5. Status Mapping           │
└────────┬─────────────────────┘
         ↓
┌──────────────────────────────────────────────┐
│  POST /api/inventory/import/validate         │
│  Returns: validation report with warnings    │
└────────┬─────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────────┐
│  POST /api/inventory/import/execute          │
│  • importValidationEngine (Validate)         │
│  • deduplicationService (Find Duplicates)    │
│  • importExecutionEngine (Import Data)       │
│    - propertyAutoMapper (Map fields)         │
│    - ownerAutoMapper (Map fields)            │
│    - Create OwnerPropertyMapping             │
│  • ImportSession logged to DB                │
└────────┬─────────────────────────────────────┘
         ↓
┌──────────────────┐
│  Success Report  │
│  & Statistics    │
└──────────────────┘
```

### History & Monitoring Flow

```
┌─────────────────────────────────────────┐
│  User View ImportHistoryPage            │
├─────────────────────────────────────────┤
│  1. Load past imports                   │
│  2. Apply filters/search/sort           │
│  3. View summary statistics             │
│  4. Click on import → Detail Modal      │
│  5. View errors or download report      │
└────────────┬────────────────────────────┘
             ↓
┌────────────────────────────────────────────┐
│  GET /api/inventory/import/history        │
│  ?status=completed&limit=50&offset=0      │
│  Returns: Array of ImportSession docs     │
└────────────┬───────────────────────────────┘
             ↓
┌──────────────────────────────────────────┐
│  Display in ImportHistoryPage             │
│  • Summary Cards (Total, Success, etc)   │
│  • Filterable Table                      │
│  • Pagination Controls                   │
└──────────────────────────────────────────┘
             ↓
┌─────────────────────────────────────────────┐
│  User clicks Detail or Download            │
├─────────────────────────────────────────────┤
│  GET /api/inventory/import/session/:id     │
│  GET /api/inventory/import/session/:id/err │
│  GET /api/inventory/import/session/:id/rep │
└─────────────────────────────────────────────┘
             ↓
┌───────────────────────────────────────────────┐
│  Display ImportDetailModal                    │
│  • Summary Tab (Session info)                 │
│  • Statistics Tab (Detailed counts)           │
│  • Errors Tab (Error log)                     │
└───────────────────────────────────────────────┘
```

### Admin Dashboard Flow

```
┌────────────────────────────────┐
│  Admin Access Dashboard        │
│  Select Time Period (week)     │
└────────────┬───────────────────┘
             ↓
┌──────────────────────────────────┐
│  GET /api/admin/dashboard        │
│  ?period=week                    │
│                                  │
│  Calculates:                     │
│  • Total imports (week)          │
│  • Success rate                  │
│  • Trend data (7 days)           │
│  • Status distribution           │
│  • Hourly activity               │
│  • Database statistics           │
│  • Recent sessions (10)          │
└──────┬───────────────────────────┘
       ↓
┌──────────────────────────────────┐
│  GET /api/admin/system-health    │
│                                  │
│  Returns:                        │
│  • Server status & uptime        │
│  • DB health percentage          │
│  • API performance percentage    │
│  • Storage usage percentage      │
└──────┬───────────────────────────┘
       ↓
┌───────────────────────────────────────┐
│  AdminDashboard Display               │
│  ├── System Health Cards (top)        │
│  ├── 5 Tabs:                          │
│  │   • Overview (Metrics + Charts)   │
│  │   • Import Monitoring             │
│  │   • Users & Activity              │
│  │   • Database Stats                │
│  │   • Alerts & Logs                 │
│  └── Auto-refresh every 30s          │
└───────────────────────────────────────┘
```

---

## 📊 Database Relationships

```
Owner
  ↓ (One-to-Many)
OwnerPropertyMapping ← (Many-to-Many Junction)
  ↑ (Many-to-One)
Property

ImportSession
  ↓
  Contains:
    • Reference to userId (who ran import)
    • List of errors
    • List of warnings
    • Summary statistics
```

---

## 🔐 Authentication Flow

```
User Login
  ↓
JWT Token Issued
  ↓
  ├─→ [For Regular Users]
  │   • Can access ImportHistoryPage
  │   • Can view own imports only
  │   • Can download own reports
  │
  └─→ [For Admins]
      • Can access AdminDashboard
      • Can view all imports
      • Can view all users
      • Can access system health
      • Can view all alerts
```

---

## 🎯 Component Interaction Matrix

| Component | Imports From | Calls API | Uses Redux | State Management |
|-----------|-------------|-----------|-----------|-----------------|
| DataImportWizard | Multer | ✅ | ❌ | Local State |
| ImportHistoryPage | ImportSession | ✅ | ❌ | Local State |
| AdminDashboard | ImportSession, User, Server | ✅ | ❌ | Local State |
| ColumnMappingEditor | - | ❌ | ❌ | Props + Local |
| PreviewGridWithFilters | - | ❌ | ❌ | Props + Local |

---

## 🚀 Deployment Architecture

```
┌──────────────────────────────────────┐
│         Client Browser               │
│    (React SPA - ImportHistoryPage)  │
└────────────┬───────────────────────┘
             │ HTTPS
┌────────────▼───────────────────────┐
│   CDN / Static Host                 │
│   (Vercel / Netlify / S3 + CloudFront)
└────────────┬───────────────────────┘
             │ HTTPS
┌────────────▼───────────────────────────────┐
│     Express.js Server                      │
│     (Node.js Backend - importHistory.routes)
│     • API Endpoints                        │
│     • Authentication                       │
│     • Business Logic                       │
└────────────┬────────────────────────────────┘
             │ TCP
┌────────────▼───────────────────────────────┐
│     MongoDB Atlas                          │
│     (Cloud Database)                       │
│     • Collections                          │
│     • Indexes                              │
│     • Replicas                             │
└────────────────────────────────────────────┘
```

---

## 📈 Performance Optimization

```
Frontend Optimization:
  ├── Code Splitting (React.lazy)
  ├── Image Optimization
  ├── CSS Minification
  └── Lazy Loading for Tables

Backend Optimization:
  ├── Query Optimization (.lean())
  ├── Database Indexing
  ├── Connection Pooling
  └── Caching Strategy

Database Optimization:
  ├── Compound Indexes
  ├── Query Plans Analysis
  ├── Sharding (if needed)
  └── Backup Strategy
```

---

## 🔄 Integration Points

```
Existing Systems:
  ├── Property Management System
  │   └── Uses Property, Owner models
  │
  ├── User Authentication
  │   └── Uses JWT & auth middleware
  │
  ├── Contract Management
  │   └── References Property & Owner
  │
  └── Analytics Dashboard
      └── Consumes ImportSession data

External Integrations (Future):
  ├── Email Notifications
  ├── Slack Alerts
  ├── BI/Analytics Tools
  ├── File Storage (S3)
  └── Backup Services
```

---

## 📝 Audit Trail

```
Every Import Session Records:
  ├── User who initiated
  ├── File information
  ├── Start & end times
  ├── Total records processed
  ├── Success/failure count
  ├── All errors with context
  ├── All warnings
  ├── Changes made to DB
  └── Can be audited later
```

---

**Last Updated:** 2024-01-15  
**Version:** 1.0
