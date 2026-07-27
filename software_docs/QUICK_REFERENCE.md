# Quick Reference: Smart Mary Data Import System

## 🚀 Quick Start

### Add to Express App
```javascript
// server/index.js
const importHistoryRoutes = require('./routes/importHistory.routes');
app.use('/api/inventory', importHistoryRoutes);
```

### Add Routes to React
```jsx
// src/App.jsx
import ImportHistoryPage from './components/MaryImport/ImportHistoryPage';
import AdminDashboard from './components/MaryImport/AdminDashboard';

<Route path="/import-history" element={<ImportHistoryPage />} />
<Route path="/admin/dashboard" element={<AdminDashboard />} />
```

---

## 📋 Component Cheat Sheet

### ImportHistoryPage

**Props:** None (fetches data from API)

**Key Methods:**
- `fetchImports()` - Load imports with filters
- `getStatusColor(status)` - Get badge color
- `formatDate(dateString)` - Format timestamps
- `formatDuration(start, end)` - Calculate duration

**Features:**
- Search by filename
- Filter by status
- Sort by date/size/rows
- Pagination (10/page)
- Modal detail view
- Report download

**State:**
```javascript
const [imports, setImports] = useState([]);
const [selectedImport, setSelectedImport] = useState(null);
const [filterStatus, setFilterStatus] = useState('all');
const [sortBy, setSortBy] = useState('date');
const [currentPage, setCurrentPage] = useState(1);
```

### AdminDashboard

**Props:** None

**Key Methods:**
- `fetchDashboardData()` - Load metrics
- `fetchSystemHealth()` - Get health status
- `getHealthColor(percentage)` - Health indicator color

**Features:**
- 5 tabbed views
- 8 key metrics
- Real-time health monitoring
- Trend analysis
- User activity tracking
- Database statistics
- Alert management

**State:**
```javascript
const [dashboardData, setDashboardData] = useState(null);
const [systemHealth, setSystemHealth] = useState(null);
const [activeView, setActiveView] = useState('overview');
const [selectedPeriod, setSelectedPeriod] = useState('week');
```

---

## 🔌 API Endpoints Cheat Sheet

### Import History

```
GET /api/inventory/import/history
  ?status=completed
  &sortBy=date
  &limit=50
  &offset=0
```

```
GET /api/inventory/import/session/:sessionId
```

```
GET /api/inventory/import/session/:sessionId/errors
```

```
GET /api/inventory/import/session/:sessionId/report
  ?format=json
```

### Admin Dashboard

```
GET /api/admin/dashboard
  ?period=week
```

```
GET /api/admin/system-health
```

---

## 🎨 CSS Class Reference

### ImportHistoryPage

| Class | Purpose |
|-------|---------|
| `.import-history-page` | Main container |
| `.page-header` | Page title section |
| `.history-controls` | Search, filter, sort row |
| `.statistics-grid` | Summary cards grid |
| `.imports-table` | Data table |
| `.modal-overlay` | Detail modal backdrop |
| `.badge` | Status badges |
| `.metric-card` | Summary statistic card |

### AdminDashboard

| Class | Purpose |
|-------|---------|
| `.admin-dashboard` | Main container |
| `.dashboard-header` | Header with controls |
| `.system-health` | Health indicators |
| `.dashboard-tabs` | Tab navigation |
| `.metric-card` | Single metric display |
| `.admin-table` | Data table |
| `.alert-item` | Alert notification |
| `.health-card` | Health indicator card |

---

## 📊 Status Badge Colors

| Status | Color | Class |
|--------|-------|-------|
| Completed | Green | `.badge.success` |
| Failed | Red | `.badge.error` |
| Partial | Yellow | `.badge.warning` |
| Processing | Blue | `.badge.info` |
| Cancelled | Gray | `.badge.secondary` |

---

## 🔄 Data Refresh Intervals

```javascript
// Dashboard auto-refresh
setInterval(() => {
  fetchDashboardData();
  fetchSystemHealth();
}, 30000); // 30 seconds
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 768px) {
  grid-template-columns: 1fr;
  font-size: 12px;
}

/* Tablet */
@media (max-width: 1200px) {
  grid-template-columns: repeat(2, 1fr);
}

/* Desktop */
Default: repeat(auto-fit, minmax(200px, 1fr));
```

---

## 🔐 Authentication Requirements

```javascript
// All endpoints require authentication
const auth = (req, res, next) => {
  // Verify JWT token
  // Set req.user
};

// Admin endpoints require role
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
};
```

---

## 🐛 Common Issues & Solutions

### Issue: Components not rendering
**Solution:** Check authentication and route configuration

### Issue: API returns 404
**Solution:** Ensure routes are registered in Express app

### Issue: Data not updating
**Solution:** Check fetch intervals and error handling

### Issue: Slow table with many rows
**Solution:** Implement pagination (use limit/offset)

### Issue: Modal not opening
**Solution:** Check state setter and event handlers

---

## ⚡ Performance Tips

1. **Use pagination** for large datasets (limit: 50)
2. **Implement lazy loading** for modals
3. **Cache dashboard data** client-side (30s)
4. **Use `.lean()`** in MongoDB queries
5. **Debounce search** input (300ms)
6. **Optimize images** in status badges

---

## 🧪 Testing Checklist

- [ ] Components render without errors
- [ ] API endpoints return correct data
- [ ] Filters work (status, search, sort)
- [ ] Pagination works correctly
- [ ] Modal opens/closes properly
- [ ] Reports download successfully
- [ ] Mobile responsive design
- [ ] Error states handled
- [ ] Loading states visible
- [ ] No console errors

---

## 📚 File Locations

```
Frontend:
  src/components/MaryImport/ImportHistoryPage.jsx
  src/components/MaryImport/ImportHistoryPage.css
  src/components/MaryImport/AdminDashboard.jsx
  src/components/MaryImport/AdminDashboard.css

Backend:
  server/routes/importHistory.routes.js
  server/models/ImportSession.js

Docs:
  docs/IMPORT_HISTORY_AND_ADMIN_GUIDE.md
  docs/COMPLETION_SUMMARY.md
  docs/QUICK_REFERENCE.md (this file)
```

---

## 🎯 Environment Variables

```env
# If using separate API server
REACT_APP_API_URL=http://localhost:5000

# Admin dashboard settings
DASHBOARD_REFRESH_INTERVAL=30000
MAX_TABLE_ROWS=50
DEFAULT_PERIOD=week

# Authentication
JWT_SECRET=your_secret_key
```

---

## 🔗 Related Documentation

- **Full Guide**: IMPORT_HISTORY_AND_ADMIN_GUIDE.md
- **API Docs**: API_SMART_IMPORT_ENDPOINTS.md
- **User Guide**: SMART_IMPORT_USER_GUIDE.md
- **Tests**: test/integration/smartImport.test.js

---

## 💬 Support Commands

### Check import history
```javascript
// Frontend
const imports = await fetch('/api/inventory/import/history');
```

### Get dashboard metrics
```javascript
const metrics = await fetch('/api/admin/dashboard?period=week');
```

### Check system health
```javascript
const health = await fetch('/api/admin/system-health');
```

---

## 🎊 Feature Summary

| Feature | Component | Status |
|---------|-----------|--------|
| File Upload | DataImportWizard | ✅ |
| Column Mapping | ColumnMappingEditor | ✅ |
| Data Preview | PreviewGridWithFilters | ✅ |
| Duplicate Detection | DuplicateResolutionPanel | ✅ |
| Status Mapping | StatusMappingPreview | ✅ |
| Import History | ImportHistoryPage | ✅ |
| Admin Dashboard | AdminDashboard | ✅ |
| API Routes | importHistory.routes | ✅ |

---

## 🚀 Deployment Checklist

- [ ] All components created
- [ ] Routes registered
- [ ] Auth middleware configured
- [ ] Database indexes created
- [ ] Environment variables set
- [ ] CORS configured (if needed)
- [ ] Error logging enabled
- [ ] Testing complete
- [ ] Documentation reviewed
- [ ] Ready for production

---

**Last Updated:** 2024-01-15  
**Version:** 1.0  
**Status:** Production Ready ✅
