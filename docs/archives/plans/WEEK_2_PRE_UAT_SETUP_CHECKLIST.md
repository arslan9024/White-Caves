# WEEK 2 PRE-UAT SETUP CHECKLIST

**Pre-UAT Preparation Phase**
**Target Date**: March 23, 2026
**Timeline**: Full day (8 hours)
**Status**: ⏳ READY TO EXECUTE

---

## 🎯 Mission: Prepare Everything for UAT

By end of March 23, the test environment must be **fully operational and ready** for UAT to start March 24.

---

## ✅ Pre-UAT Setup Checklist by Hour

### **8:00 AM - 9:00 AM: Team Kickoff & Verification** (1 hour)

#### Activities
```
[ ] All team members present/logged in
[ ] Review UAT_GUIDE.md together (15 min)
[ ] Assign roles & responsibilities (15 min)
[ ] Confirm escalation contacts (15 min)
[ ] Q&A session (15 min)
```

#### Success Criteria
- ✅ Team understands UAT procedures
- ✅ Roles clearly assigned
- ✅ Questions answered

#### Owner
- QA Lead

#### Handoff
- Ready to move to environment setup

---

### **9:00 AM - 10:30 AM: Test Environment Verification** (1.5 hours)

#### Physical Infrastructure Checks
```
[ ] Dev server running (check localhost:5000)
[ ] API server responding (check localhost:3000)
[ ] MongoDB accessible
[ ] Redis cache working
[ ] All services healthy
```

#### Database Checks
```
[ ] MongoDB is operational
[ ] Test database exists
[ ] Database backups completed
[ ] Backup restoration tested
[ ] Write permissions verified
```

#### Configuration Checks
```
[ ] Environment variables set correctly
[ ] API endpoints configured
[ ] CORS enabled properly
[ ] Authentication working
[ ] Session management working
```

#### Commands to Run
```bash
# Check connectivity
curl http://localhost:3000/health
curl http://localhost:5000/health

# Check database
npm run db:status

# Check services
npm run env:verify
```

#### Success Criteria
- ✅ All services responding
- ✅ Database healthy
- ✅ API accessible
- ✅ UI loads without errors

#### Owner
- DevOps Engineer

#### Handoff
- Test environment ready for data loading

---

### **10:30 AM - 12:00 PM: Test Data Preparation** (1.5 hours)

#### Data Loading Tasks
```
[ ] Review test data specifications
[ ] Prepare test data files:
    - commissions.json (50 test records)
    - users.json (6 test accounts)
    - properties.json (sample properties)
[ ] Load test data into database
[ ] Verify data loaded correctly
[ ] Create data backup (for UAT reset)
```

#### Commands to Load Data
```bash
# Load test data
npm run db:seed:test

# Verify data
npm run db:verify:test

# Create backup
npm run db:backup:pre-uat
```

#### Test Data Verification
```
Commissions Table:
[ ] 50 records loaded
[ ] Mix of statuses (draft, pending, approved, paid)
[ ] Various amounts ($500 - $50,000)
[ ] Date range: Last 6 months

Users Table:
[ ] 6 test accounts created:
    - 2 Admin accounts
    - 2 Sales Agent accounts
    - 2 Freelancer accounts
```

#### Success Criteria
- ✅ All 50 commission records loaded
- ✅ 6 user accounts created & working
- ✅ Test data verified complete
- ✅ Backup created for reset

#### Owner
- Database Administrator

#### Handoff
- Test environment fully seeded and ready

---

### **12:00 PM - 1:00 PM: Lunch Break** ☕

---

### **1:00 PM - 2:30 PM: User Account Setup & Testing** (1.5 hours)

#### Create Test Accounts
```
Admin Account 1:
[ ] Email: uat-admin-1@whitecaves.local
[ ] Password: [Generated & secured]
[ ] Role: Admin
[ ] Status: Active
[ ] Verify login works

Admin Account 2:
[ ] Email: uat-admin-2@whitecaves.local
[ ] Password: [Generated & secured]
[ ] Role: Admin
[ ] Status: Active
[ ] Verify login works

Sales Agent Account 1:
[ ] Email: uat-sales-1@whitecaves.local
[ ] Password: [Generated & secured]
[ ] Role: Secondary Sales Agent
[ ] Status: Active
[ ] Verify login works

Sales Agent Account 2:
[ ] Email: uat-sales-2@whitecaves.local
[ ] Password: [Generated & secured]
[ ] Role: Secondary Sales Agent
[ ] Status: Active
[ ] Verify login works

Freelancer Account 1:
[ ] Email: uat-freelancer-1@whitecaves.local
[ ] Password: [Generated & secured]
[ ] Role: Freelancer
[ ] Status: Active
[ ] Verify login works

Freelancer Account 2:
[ ] Email: uat-freelancer-2@whitecaves.local
[ ] Password: [Generated & secured]
[ ] Role: Freelancer
[ ] Status: Active
[ ] Verify login works
```

#### Account Verification
```
For Each Account:
[ ] Can login to application
[ ] Dashboard loads correctly
[ ] Can see correct features based on role
[ ] Can access Commission tab
[ ] API authentication working
```

#### Create Credentials Document
```
[ ] Document all 6 test accounts
[ ] Include usernames/passwords (secure format)
[ ] Include login URLs
[ ] Include expected permissions for each role
[ ] Distribute to QA team (secure manner)
```

#### Success Criteria
- ✅ All 6 accounts created
- ✅ All accounts can login successfully
- ✅ Role-based access working correctly
- ✅ Credentials securely documented

#### Owner
- System Administrator

#### Handoff
- Test accounts ready for UAT execution

---

### **2:30 PM - 4:00 PM: Feature Smoke Testing** (1.5 hours)

#### Quick Functionality Tests (10 min per feature)
```
[ ] Can view commission list
    - Navigate to Commission tab
    - List loads (50 records)
    - Pagination works
    
[ ] Can create commission
    - Click "Create New"
    - Form loads
    - Can enter data
    - Can submit (save to database)
    
[ ] Can view commission details
    - Click on commission in list
    - Details modal opens
    - All fields visible
    - Edit & delete options available
    
[ ] Can filter commissions
    - Apply status filter
    - Results update
    - Filter badge appears
    - Clear filter works
    
[ ] Can search commissions
    - Search box works
    - Results filter correctly
    - Performance acceptable (< 1 sec)
    
[ ] Can generate report
    - Navigate to Reports
    - Generate report works
    - Report displays correctly
    - Download option available
```

#### Issues Found
```
If issues found:
[ ] Document issue briefly
[ ] Screenshot if needed
[ ] Add to "Known Issues" list
[ ] NOT a blocker (minor issues only expected)
```

#### Success Criteria
- ✅ All main features accessible
- ✅ No critical issues
- ✅ Interface working as expected
- ✅ Ready for comprehensive UAT tomorrow

#### Owner
- QA Lead

#### Handoff
- Feature verified, ready for UAT

---

### **4:00 PM - 5:00 PM: Team Briefing & Setup** (1 hour)

#### Distribute Documentation
```
[ ] Print or email UAT_GUIDE.md to team
[ ] Print or email test account credentials
[ ] Print or email UAT schedule
[ ] Print or email support contact list
[ ] Provide monitoring dashboard URLs
```

#### Brief QA Team
```
[ ] Walkthrough UAT schedule (10 min)
[ ] Review test scenario format (10 min)
[ ] Demo issue reporting process (15 min)
[ ] Q&A and clarification (15 min)
```

#### Confirm Logistics
```
[ ] UAT location/environment decided
[ ] QA team computer access confirmed
[ ] Network connectivity verified
[ ] Printer availability confirmed (for screenshots)
[ ] Support contact list posted/available
```

#### Prepare Monitoring Dashboard
```
[ ] Open monitoring dashboard:
    https://monitoring.whitecaves.local/commission
[ ] Confirm all metrics visible
[ ] Set up alert testing (verify alerts work)
[ ] Prepare for tomorrow's monitoring
```

#### Final Checklist
```
[ ] All team members ready?
[ ] All equipment working?
[ ] All documentation distributed?
[ ] All questions answered?
[ ] Start time tomorrow confirmed (9:00 AM)?
```

#### Success Criteria
- ✅ Team fully briefed
- ✅ All materials distributed
- ✅ Questions answered
- ✅ Ready to start UAT 9:00 AM March 24

#### Owner
- QA Lead

---

## 📋 Critical Items Checklist

### **MUST COMPLETE (Blocking)**
- [ ] MongoDB: Operational and accessible
- [ ] API Server: Responding (localhost:3000)
- [ ] Frontend: Loading (localhost:5000)
- [ ] Test Data: All 50 commission records loaded
- [ ] Test Accounts: All 6 accounts created & verified
- [ ] Team: All members briefed & ready

### **SHOULD COMPLETE (Important)**
- [ ] Monitoring Dashboard: Accessible
- [ ] Alerts: Tested & working
- [ ] Data Backup: Pre-UAT backup created
- [ ] Documentation: Distributed to team
- [ ] Support Contacts: Confirmed & available

### **NICE TO HAVE (Optional)**
- [ ] Performance baseline: Recorded
- [ ] Screenshots: Example format prepared
- [ ] Known issues: List started (if any)

---

## 🔧 Commands Quick Reference

### Database Commands
```bash
# Verify MongoDB
npm run db:status

# Seed test data
npm run db:seed:test

# Verify data loaded
npm run db:verify:test

# Create backup
npm run db:backup:pre-uat

# Reset database (if needed)
npm run db:reset:test
```

### Server Commands
```bash
# Start dev server
npm run dev

# Check API health
curl http://localhost:3000/health
curl http://localhost:5000/health

# Check logs
npm run logs:api
npm run logs:frontend
```

### Verification Commands
```bash
# Verify environment
npm run env:verify

# Run quick tests
npm run test:smoke

# Check build
npm run build
```

---

## 🚨 Troubleshooting Quick Guide

### Issue: MongoDB Not Connecting
```
[ ] Check MongoDB service is running
[ ] Verify connection string in .env
[ ] Check firewall allows connection
[ ] Verify credentials if required
[ ] Restart MongoDB service
```

### Issue: API Not Responding
```
[ ] Check Express server is running (npm run dev)
[ ] Check port 3000 is not blocked
[ ] Verify environment variables
[ ] Check API logs for errors
[ ] Restart API server
```

### Issue: Frontend Not Loading
```
[ ] Check Vite dev server running
[ ] Clear browser cache
[ ] Check port 5000 is not blocked
[ ] Verify API connection from frontend
[ ] Restart Vite dev server
```

### Issue: Test Data Not Loading
```
[ ] Check MongoDB is running
[ ] Verify data file exists
[ ] Check file format (JSON)
[ ] Review error logs
[ ] Manually verify database state
```

### Issue: Accounts Can't Login
```
[ ] Verify accounts were created
[ ] Check password is correct
[ ] Verify account is active (not disabled)
[ ] Check role assignments
[ ] Verify authentication service
```

---

## 📞 Support During Setup

### Primary Contacts
| Role | Contact | Phone |
|------|---------|-------|
| QA Lead | [TBD] | [TBD] |
| DevOps | [TBD] | [TBD] |
| DB Admin | [TBD] | [TBD] |

### Escalation
```
Issue Found
    ↓
Contact person above
    ↓
Can't resolve in 15 min
    ↓
Escalate to Tech Lead
    ↓
Still blocked?
    ↓
Page on-call engineer
```

---

## ✅ End of Day Verification (5:00 PM)

### Before Team Leaves
```
[ ] All services still running?
[ ] Test accounts still working?
[ ] Data still in database?
[ ] Dashboard accessible?
[ ] All team members understand schedule?
[ ] Everyone knows start time tomorrow (9:00 AM)?
```

### Overnight Predictions
```
MongoDB will: [ ] Keep running [ ] Might need restart
API will: [ ] Keep running [ ] Might crash
Frontend will: [ ] Keep accessible [ ] Might reload needed
Data will: [ ] Persist [ ] Need reload tomorrow
```

---

## 🎯 Success Criteria for March 23

### Environment Ready ✅
- ✅ All servers running
- ✅ Database operational
- ✅ 50 test records loaded
- ✅ All systems responding

### Team Ready ✅
- ✅ 6 test accounts created
- ✅ All team members logged in
- ✅ Procedures understood
- ✅ Roles assigned

### Documentation Ready ✅
- ✅ UAT guide distributed
- ✅ Test data documented
- ✅ Support contacts distributed
- ✅ Credentials securely shared

### Go/No-Go ✅
- ✅ Ready to start UAT: **GO** ✅

---

## 📅 Tomorrow's Schedule (March 24)

```
9:00 AM - 9:30 AM: UAT Kickoff Meeting
9:30 AM - 12:00 PM: CRUD Operations Testing
12:00 PM - 1:00 PM: Lunch
1:00 PM - 4:30 PM: Filtering & Search Testing
4:30 PM - 5:00 PM: Daily Standup
```

---

## 🎊 Completion

**March 23 Setup Complete When:**
- ✅ All green checkmarks above
- ✅ Team ready to start
- ✅ Environment stable
- ✅ Go decision confirmed

**If Not Complete:**
- ⚠️ Escalate blockers immediately
- ⚠️ Adjust start time if needed
- ⚠️ Document delays & reasons
- ⚠️ Communicate with stakeholders

---

## 📝 Document Control

**Document**: WEEK_2_PRE_UAT_SETUP_CHECKLIST.md
**Version**: 1.0
**Created**: March 18, 2026
**Target Execution**: March 23, 2026
**Status**: ✅ READY

---

**March 23 Setup Complete = March 24 UAT Success Ready** ✅

