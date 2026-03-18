# White Caves CRM Platform - Documentation Guide

## 📚 Documentation Organization

This project is organized into clear, logical sections for easy navigation:

### 🚀 Quick Access
- **QUICK_ACCESS_GUIDE.md** - Start here for common tasks and shortcuts
- **EMERGENCY_RESPONSE_PROCEDURES.md** - Critical incident response procedures

### 📋 Strategic Planning & Operations
All strategic documents are in `/plans/`:
- **MASTER_PLAN_UPDATED_FEB_2026.md** - Current master plan and execution strategy
- **ARCHITECTURE.md** - System architecture and design patterns
- **DEPLOYMENT_GUIDE.md** - Deployment procedures and environments
- **PRODUCTION_DEPLOYMENT_RUNBOOK.md** - Step-by-step production deployment
- **PRODUCTION_EXECUTION_CHECKLIST.md** - Pre-deployment verification checklist
- **MONITORING_AND_ALERTING_SETUP.md** - Monitoring and alerting configuration
- **API_DOCUMENTATION.md** - API specifications and endpoints
- **TECHNICAL_REFERENCE.md** - Technical specifications and standards

### 📊 Dashboards & Visual References
- **STATUS_DASHBOARD_VISUAL.md** - Current project status dashboard
- **PRODUCTION_READINESS_VISUAL_OVERVIEW.md** - Visual project readiness metrics
- **PRODUCTION_READINESS_DELIVERABLES_INDEX.md** - Complete deliverables index
- **PRODUCTION_QUICK_REFERENCE.md** - Quick reference for production operations
- **INDEX.md** - Complete file index and cross-references
- **TECHNICAL_REFERENCE.md** - Technical documentation reference

### 💼 Business Documentation
Business requirements, features, and guidelines in `/business_docs/`:
- **CRM Features** - Feature specifications and requirements
- **Requirements** - Business and technical requirements
- **SEO** - SEO guidelines and strategies
- **Security** - Security policies and procedures
- **TEAM_COMMUNICATION_TEMPLATES.md** - Communication templates (in `/plans/`)

### 📦 Code & Implementation
The source code is organized as follows:
```
/src
  ├── /components       - React components
  ├── /pages           - Page components
  ├── /services        - Backend services
  ├── /hooks           - Custom React hooks
  ├── /types           - TypeScript types
  ├── /utils           - Utility functions
  ├── /store           - Redux store configuration
  └── /styles          - Styled components and themes
```

### 🗂️ Archive & Historical Records
All completed work and historical documents are in `/archives/`:
- Session summaries and completion reports
- Old deployment guides (for reference)
- Historical status documents
- Phase completion reports

---

## 🎯 Starting Points by Role

### **Project Manager / Team Lead**
1. Read: `QUICK_ACCESS_GUIDE.md`
2. Review: `STATUS_DASHBOARD_VISUAL.md`
3. Reference: `/plans/MASTER_PLAN_UPDATED_FEB_2026.md`
4. Monitor: `/plans/PRODUCTION_READINESS_VISUAL_OVERVIEW.md`

### **Developers**
1. Start: `QUICK_ACCESS_GUIDE.md`
2. Reference: `/plans/ARCHITECTURE.md`
3. API Info: `/plans/API_DOCUMENTATION.md`
4. Deploy: `/plans/PRODUCTION_DEPLOYMENT_RUNBOOK.md`

### **DevOps / Operations**
1. Setup: `/plans/DEPLOYMENT_GUIDE.md`
2. Monitor: `/plans/MONITORING_AND_ALERTING_SETUP.md`
3. Deploy: `/plans/PRODUCTION_DEPLOYMENT_RUNBOOK.md`
4. Emergency: `EMERGENCY_RESPONSE_PROCEDURES.md`

### **Business Stakeholders**
1. Overview: `STATUS_DASHBOARD_VISUAL.md`
2. Features: `/business_docs/crm_features/`
3. Readiness: `/plans/PRODUCTION_READINESS_VISUAL_OVERVIEW.md`
4. Requirements: `/business_docs/requirements/`

---

## 📈 Key Metrics

**Current Status:**
- TypeScript Coverage: 96%+
- 0 TypeScript Errors
- 0 Import Errors  
- Development Server: Running (localhost:5000)
- Production Readiness: 90%+ Complete

**Recent Deliverables:**
- Commission tracking system (complete)
- E2E test suite for commission workflows
- Sidebar consolidation and unification
- Enterprise error handling infrastructure

---

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build          # Production build
npm test               # Run tests
npm run lint           # Run linter

# Deployment
npm run deploy:prep    # Prepare for deployment
npm run deploy:prod    # Deploy to production
npm run monitor        # Start monitoring dashboard

# Documentation
npm run docs           # Generate API documentation
npm run docs:serve     # Serve documentation
```

---

## 📞 Support & Resources

For questions or issues:
1. Check `QUICK_ACCESS_GUIDE.md` for common answers
2. Review relevant `/plans/` documentation
3. Check `/archives/` for similar historical solutions
4. Refer to `/business_docs/` for domain-specific guidance

---

## 📝 Documentation Maintenance

All documentation is maintained in version control. To update:
1. Make changes to relevant markdown files
2. Commit with clear messages: `docs: update [section name]`
3. Ensure this README reflects current structure
4. Archive old versions when updated

---

**Last Updated:** February 2026
**Maintained By:** Development Team
**Next Review:** End of month
