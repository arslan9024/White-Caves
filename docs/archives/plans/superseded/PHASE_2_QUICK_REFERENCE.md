# Phase 2: Quick Reference Guide

## 🚀 Quick Start

### 1. Start Backend Server

```bash
npm run dev
# or
node api/index.js
```

### 2. Verify Health

```bash
curl http://localhost:3000/api/relational-sidebar/health
```

### 3. Test an Endpoint

```bash
curl http://localhost:3000/api/relational-sidebar/departments
```

---

## 📋 API Endpoints at a Glance

### Base URL

```
http://localhost:3000/api/relational-sidebar
```

### Endpoints (6 Total)

```
GET    /departments
GET    /departments/:id
GET    /assistants
GET    /assistants/:id
GET    /assistants/:id/contexts/:context
POST   /assistants/:id/notifications
```

---

## 🧪 Testing

### Using Curl

**Get All Departments**:

```bash
curl http://localhost:3000/api/relational-sidebar/departments
```

**Get Specific Department**:

```bash
curl http://localhost:3000/api/relational-sidebar/departments/OPERATIONS
```

**Get Assistants**:

```bash
curl http://localhost:3000/api/relational-sidebar/assistants
```

**Filter Assistants**:

```bash
curl "http://localhost:3000/api/relational-sidebar/assistants?department=OPERATIONS"
curl "http://localhost:3000/api/relational-sidebar/assistants?service=inventory"
```

**Get Assistant**:

```bash
curl http://localhost:3000/api/relational-sidebar/assistants/mary_001
```

**Get Context Data**:

```bash
curl http://localhost:3000/api/relational-sidebar/assistants/mary_001/contexts/inventory
```

**Send Notification**:

```bash
curl -X POST http://localhost:3000/api/relational-sidebar/assistants/mary_001/notifications \
  -H "Content-Type: application/json" \
  -d '{"message":"Test notification","type":"info"}'
```

### Using Postman

1. Import the cURL commands above into Postman
2. Create a collection for "Relational Sidebar API"
3. Save requests for repeated testing
4. Use Postman's test runner for batch testing

---

## 📁 File Locations

### Backend

- Routes: `api/relational-sidebar/routes.js`
- Controllers: `api/relational-sidebar/controllers/`
- Middleware: `api/relational-sidebar/middleware/`
- Mock Data: `api/relational-sidebar/data/mockData.js`

### Frontend

- API Service: `src/services/relationalSidebarAPI.js`
- Redux Thunks: `src/store/thunks/relationalSidebarThunks.js`

### Documentation

- Testing Guide: `plans/PHASE_2_API_TESTING_GUIDE.md`
- Progress Report: `plans/PHASE_2_PROGRESS_REPORT.md`
- Implementation Summary: `plans/PHASE_2_IMPLEMENTATION_SUMMARY.md`

---

## 🔧 Common Tasks

### Test All Endpoints

See full test cases in: `plans/PHASE_2_API_TESTING_GUIDE.md`

### Debug API Issues

1. Check console logs (backend):

   ```bash
   # Terminal should show API logs
   [API] GET /departments - Success
   ```

2. Check browser DevTools (frontend):
   - Network tab: See all requests
   - Console: See API errors

3. Enable debug logging:
   ```javascript
   localStorage.setItem('DEBUG_API', 'true');
   ```

### Add New Endpoint

1. Add route in `api/relational-sidebar/routes.js`
2. Add controller method in appropriate controller
3. Add validation if needed
4. Add API service function in `src/services/relationalSidebarAPI.js`
5. Add Redux thunk in `src/store/thunks/relationalSidebarThunks.js`
6. Document in `plans/PHASE_2_API_TESTING_GUIDE.md`

### Connect to Redux

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartments } from '../store/thunks/relationalSidebarThunks';

function MyComponent() {
  const dispatch = useDispatch();
  const { departments, loading, error } = useSelector(state => state.relationalSidebar);

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {departments.map(dept => (
        <div key={dept.id}>{dept.name}</div>
      ))}
    </div>
  );
}
```

---

## 📊 Data Models

### Department

```javascript
{
  id: string,
  name: string,
  description: string,
  icon: string,
  color: string,
  services: Service[]
}
```

### Assistant

```javascript
{
  id: string,
  name: string,
  role: string,
  department: string,
  services: Service[],
  isActive: boolean,
  avatar: string,
  email: string,
  lastActivity: string,
  notificationCount: number,
  status: 'active' | 'inactive',
  availableContexts: string[],
  permissions: object
}
```

### Context Data

```javascript
{
  assistantId: string,
  context: 'inventory' | 'campaigns' | 'clients' | 'messages',
  itemCount: number,
  lastUpdated: string,
  items: object[]
}
```

### Notification

```javascript
{
  id: string,
  assistantId: string,
  message: string,
  type: 'info' | 'warning' | 'error' | 'success',
  timestamp: string,
  read: boolean
}
```

---

## 📚 Mock Data Available

### Departments

- OPERATIONS
- SALES
- MARKETING
- SUPPORT

### Assistants

- mary_001 (Operations)
- nina_001 (Sales)
- linda_001 (Marketing)
- agent_001 (Support)

### Contexts

- inventory (Mary)
- campaigns (Mary, Nina)
- clients (Nina)
- messages (Linda)
- analytics (Linda)

---

## ✅ Checklist

### Before Moving to Next Phase

- [ ] All 6 endpoints tested and working
- [ ] API responses match expected format
- [ ] Error handling works correctly
- [ ] Filtering works as expected
- [ ] Redux thunks integrated
- [ ] Frontend components loading data from API
- [ ] Tests passed
- [ ] Code committed to git

### Performance

- [ ] Response times < 200ms
- [ ] No memory leaks
- [ ] Error rates at 0%

### Security

- [ ] Input validation working
- [ ] Error messages don't expose internals
- [ ] CORS headers configured

---

## 🐛 Troubleshooting

| Issue              | Solution                                        |
| ------------------ | ----------------------------------------------- |
| API not responding | Verify server is running: `npm run dev`         |
| 404 errors         | Check endpoint URL and HTTP method              |
| Empty data         | Verify mock data is loaded correctly            |
| CORS errors        | Add CORS headers to backend                     |
| Slow responses     | Check browser Network tab, look for bottlenecks |

---

## 📞 Support

- **Testing Issues**: See `plans/PHASE_2_API_TESTING_GUIDE.md` - Debugging section
- **Integration Issues**: Check Redux thunks in `src/store/thunks/relationalSidebarThunks.js`
- **Data Issues**: Review mock data in `api/relational-sidebar/data/mockData.js`

---

## 📈 Next Steps

1. **Test All Endpoints** (in progress)
2. **Integrate with Redux** (next)
3. **Add Real Database** (phase 2B)
4. **Real-time Updates** (phase 3)

---

## Document Info

- **Created**: 2024-01-20
- **Type**: Quick Reference
- **Updated**: 2024-01-20
