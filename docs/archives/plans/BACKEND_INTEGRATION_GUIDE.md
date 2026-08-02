## Backend Integration Guide - Modern Dashboard API Endpoints

**Status:** Frontend COMPLETE | Backend READY FOR INTEGRATION  
**Created:** Session 12 | February 2026

---

## 🎯 Required API Endpoints

### 1. **Dashboard Summary Endpoint**
**Endpoint:** `GET /api/dashboard/modern/summary`

**Response Format:**
```json
{
  "kpis": {
    "totalLeads": 342,
    "activeClients": 45,
    "totalAgents": 12,
    "thisMonthCommission": 24500.50,
    "conversionRate": 12.5,
    "avgDealSize": 45000,
    "openFollowUps": 18,
    "closingRate": 68
  },
  "hotLeads": [
    {
      "id": "lead-001",
      "name": "Ahmed Al-Mazrouei",
      "status": "qualified",
      "property": "Villa in JBR",
      "interest": "High",
      "value": 950000,
      "lastContact": "2025-02-15",
      "assignedAgent": "Fatima Al-Mansouri",
      "nextAction": "Site visit scheduled",
      "priority": 1
    }
  ],
  "topAgents": [
    {
      "id": "agent-001",
      "name": "Fatima Al-Mansouri",
      "department": "Sales",
      "role": "Senior Agent",
      "commission": 12500,
      "dealsThisMonth": 4,
      "avatar": "initials|color",
      "status": "online",
      "performance": 95
    }
  ],
  "recentActivities": [
    {
      "id": "act-001",
      "type": "lead_created",
      "description": "New lead created: Ahmed Al-Mazrouei",
      "timestamp": "2025-02-15T10:30:00Z",
      "actor": "Linda (WhatsApp Bot),
      "icon": "user-plus"
    }
  ],
  "clientMetrics": {
    "active": 45,
    "pending": 8,
    "inactive": 3,
    "renewal": 2
  },
  "agentPerformance": [
    {
      "name": "Fatima Al-Mansouri",
      "deals": 4,
      "commission": 12500,
      "target": 20000,
      "achievement": 62.5
    }
  ]
}
```

**Implementation:** Express.js + MongoDB
```javascript
router.get('/dashboard/modern/summary', async (req, res) => {
  try {
    // Fetch from MongoDB
    const leads = await Lead.find({ status: 'qualified' }).sort({ createdAt: -1 }).limit(5);
    const clients = await Client.find({ status: 'active' });
    const agents = await Agent.find({ status: 'active' }).sort({ commission: -1 }).limit(5);
    const activities = await Activity.find().sort({ timestamp: -1 }).limit(10);

    // Calculate KPIs
    const kpis = {
      totalLeads: await Lead.countDocuments(),
      activeClients: clients.length,
      // ... etc
    };

    res.json({ kpis, hotLeads: leads, topAgents: agents, recentActivities: activities });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

### 2. **Leads List Endpoint**
**Endpoint:** `GET /api/leads?page=1&limit=20&search=&status=`

**Response Format:**
```json
{
  "data": [
    {
      "id": "lead-001",
      "name": "Ahmed Al-Mazrouei",
      "email": "ahmed@example.com",
      "phone": "+971 50 123 4567",
      "status": "qualified",
      "source": "website",
      "property": "Villa in JBR",
      "budget": 950000,
      "timeline": "2-3 months",
      "lastContact": "2025-02-15",
      "assignedAgent": "Fatima Al-Mansouri",
      "score": 8.5,
      "notes": "VIP client, ready to move forward"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 17,
    "totalRecords": 342,
    "pageSize": 20
  }
}
```

---

### 3. **Clients List Endpoint**
**Endpoint:** `GET /api/clients?page=1&limit=20&search=`

**Response Format:**
```json
{
  "data": [
    {
      "id": "client-001",
      "name": "Mohammed Al-Ketbi",
      "email": "m.ketbi@example.com",
      "phone": "+971 50 234 5678",
      "status": "active",
      "company": "Al-Ketbi Enterprises",
      "contractValue": 2500000,
      "contractDate": "2024-06-15",
      "renewalDate": "2026-06-15",
      "serviceType": "Property Management",
      "properties": 5,
      "assignedAgent": "Sarah Al-Mansoori",
      "lastInteraction": "2025-02-10",
      "nextAction": "Quarterly review"
    }
  ],
  "pagination": { ... }
}
```

---

### 4. **Agents List Endpoint**
**Endpoint:** `GET /api/agents?page=1&limit=20&department=`

**Response Format:**
```json
{
  "data": [
    {
      "id": "agent-001",
      "name": "Fatima Al-Mansouri",
      "email": "fatima@whitecaves.ae",
      "phone": "+971 50 111 1111",
      "department": "Sales",
      "role": "Senior Agent",
      "status": "online",
      "commission": 12500,
      "dealsThisMonth": 4,
      "dealsThisYear": 28,
      "commissionThisYear": 98500,
      "performance": 95,
      "badge": "Top Performer",
      "avatar": "initial|color",
      "joinDate": "2023-01-15",
      "manager": "Sophia Al-Mazrouei"
    }
  ],
  "pagination": { ... }
}
```

---

### 5. **Activities Feed Endpoint**
**Endpoint:** `GET /api/activities?limit=50&skip=0`

**Response Format:**
```json
{
  "data": [
    {
      "id": "act-001",
      "type": "lead_created|lead_updated|client_added|commission_earned|message_sent|call_logged",
      "description": "New lead created: Ahmed Al-Mazrouei",
      "timestamp": "2025-02-15T10:30:00Z",
      "actor": "Linda WhatsApp Bot",
      "actorRole": "AI Assistant",
      "icon": "user-plus|edit|plus|award|message|phone",
      "metadata": {
        "leadId": "lead-001",
        "agentId": "agent-001",
        "amount": 12500
      }
    }
  ],
  "pagination": { ... }
}
```

---

## 🔌 Redux Action Integration Examples

### Frontend Code (Already Ready)
```javascript
// Store the async thunk for leads
export const fetchLeads = createAsyncThunk(
  'crm/fetchLeads',
  async (params, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/leads?${new URLSearchParams(params)}`);
      if (!response.ok) throw new Error('Failed to fetch leads');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Dispatch in component
useEffect(() => {
  dispatch(fetchLeads({ page: 1, limit: 20 }));
}, [dispatch]);
```

---

## 🗄️ MongoDB Collection Schema Requirements

### **Leads Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  status: enum(['new', 'contacted', 'qualified', 'converted', 'lost']),
  source: enum(['website', 'whatsapp', 'referral', 'advertisement']),
  property: String,
  budget: Number,
  timeline: String,
  lastContact: Date,
  assignedAgent: ObjectId,
  score: Number,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### **Clients Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  company: String,
  status: enum(['active', 'pending', 'inactive']),
  contractValue: Number,
  contractDate: Date,
  renewalDate: Date,
  serviceType: String,
  properties: Number,
  assignedAgent: ObjectId,
  lastInteraction: Date,
  nextAction: String,
  createdAt: Date,
  updatedAt: Date
}
```

### **Agents Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  department: String,
  role: String,
  status: enum(['online', 'offline', 'away']),
  commission: Number,
  dealsThisMonth: Number,
  dealsThisYear: Number,
  commissionThisYear: Number,
  performance: Number,
  badge: String,
  joinDate: Date,
  manager: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### **Activities Collection**
```javascript
{
  _id: ObjectId,
  type: String,
  description: String,
  timestamp: Date,
  actor: String,
  actorRole: String,
  icon: String,
  metadata: {
    leadId: ObjectId,
    agentId: ObjectId,
    amount: Number
  },
  createdAt: Date
}
```

---

## 🔐 Authentication & Authorization

### Required Middleware
```javascript
// Verify Firebase Auth token
app.use(async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Check owner role
const checkOwner = (req, res, next) => {
  if (req.user.email !== 'arslanmalikgoraha@gmail.com') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

// Apply to routes
router.get('/dashboard/modern/summary', checkOwner, getDashboardSummary);
```

---

## 📊 Expected Performance Metrics

| Metric | Target | Acceptable |
|--------|--------|-----------|
| Dashboard Load | <1.5s | <2s |
| Leads Table | <800ms | <1.2s |
| Search Filtering | <500ms | <1s |
| Create Lead | <800ms | <1.5s |
| Update Lead | <600ms | <1s |
| API Response | <200ms | <500ms |

---

## 🚨 Error Handling

### Frontend Already Handles:
- Network errors
- 404 responses
- 500 server errors
- Timeout errors
- Empty data states

### Backend Should Return:
```json
{
  "error": "Clear error message",
  "status": 400|401|403|404|500,
  "timestamp": "2025-02-15T10:30:00Z"
}
```

---

## 🧪 Testing Checklist

Backend team should test:
1. ✅ All endpoints return correct JSON structure
2. ✅ Pagination works (page, limit, total)
3. ✅ Search filters work
4. ✅ Status filters work
5. ✅ Authorization checks work
6. ✅ Error handling returns proper status codes
7. ✅ Large datasets perform <2s
8. ✅ Real-time updates sync correctly

---

## 📝 Integration Steps

1. **Setup MongoDB Collections**
   - Create all 4 collections with indexes
   - Add 50-100 sample records for testing

2. **Implement Express Routes**
   - Create `/server/routes/dashboard.js`
   - Implement all 5 endpoints
   - Add error handling middleware

3. **Connect frontend**
   - Replace mock data fetch with real API calls
   - Test with Redux dev tools

4. **Performance Testing**
   - Load test with 1000+ records
   - Measure response times
   - Optimize queries with indexes

5. **E2E Testing**
   - Run Playwright test suite
   - Verify all dashboard interactions
   - Test on different network speeds

---

## 🎯 Success Criteria

✅ All API endpoints fully functional  
✅ Dashboard loads real data  
✅ No TypeScript errors  
✅ Page load time <2 seconds  
✅ All searches and filters work  
✅ Authorization working  
✅ E2E tests passing  

---

## 📞 Questions & Support

For integration questions, refer to:
- Express API pattern: `/server/routes/commission.js` (similar structure)
- Redux integration: `src/store/crmDataSlice.js`
- Error handling: `src/components/ErrorBoundary.tsx`
- API service layer: `src/services/api.js`

---

**Ready for Backend Integration: ✅**  
**Estimated Integration Time: 4-6 hours**

*Next Step: Backend team implements these endpoints*
