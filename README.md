# White Caves CRM Platform - Documentation Guide

## 📚 Documentation Organization

This project is organized into clear, logical sections for easy navigation:

### 🚀 Quick Access

- **QUICK_ACCESS_GUIDE.md** - Start here for common tasks and shortcuts
- **EMERGENCY_RESPONSE_PROCEDURES.md** - Critical incident response procedures

#### White Caves Real Estate LLC

- **Landline Phone**: +971 4 335 0592
- **Contact**: +971 56 361 6136
- **Email**: <mailto:admin@whitecaves.com>
- **Website**: <https://www.whitecave.com>
- **Location**: Dubai, United Arab Emirates

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

## Technology Stack

### Frontend

- React 18 with Vite
- Redux Toolkit for state management
- Framer Motion for animations
- Custom CSS with dark/light themes

### Backend

- Node.js with Express
- MongoDB with Mongoose ODM
- Firebase Admin SDK

### Design

- Red (#DC2626) and White brand colors
- Montserrat/Open Sans typography
- Mobile-responsive design
- RTL support for Arabic

---

## Deployment

### Production Requirements

- Node.js 20.x
- MongoDB database
- Firebase project with service account
- Required environment variables configured

### Supported Runtime Versions

- Node.js: `>=20.x` (CI baseline: 20.x)
- npm: `>=10.0.0`

### Build Commands

```bash
# On Windows PowerShell, use npm.cmd instead of npm if you see script execution errors:
npm.cmd install
npm.cmd run build
npm.cmd start
# Or use Node directly for package binaries:
node node_modules/vite/bin/vite.js
node node_modules/vitest/vitest.mjs run
```

If you see an error like:

> File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system.

This is a PowerShell security policy. Either use npm.cmd as above, or run:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

to allow script execution for npm.ps1 (not recommended for most users).

### Environment Variables

- `DATABASE_URL`: MongoDB connection string (canonical)
- `FIREBASE_SERVICE_ACCOUNT`: Firebase admin credentials
- `STRIPE_SECRET_KEY`: Stripe API key
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth secret
- `JWT_SECRET`: Auth signing secret (required in production)
- `CORS_ORIGIN`: Allowed origin(s) for server CORS (required in production)
- `WHATSAPP_WEBHOOK_SECRET`: Webhook signature secret (required in production)
- `WHATSAPP_ACCESS_TOKEN`: WhatsApp Business API token (optional)

Legacy note: `MONGODB_URI` is supported as a fallback alias, but `DATABASE_URL` is the canonical key.

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
npm run dev              # Start Vite frontend dev server
npm run server           # Start backend server in local mode
npm run dev:all          # Run frontend + backend together

# Production-like server run
npm start                # Starts server with NODE_ENV=production
# Requires env vars: JWT_SECRET, DATABASE_URL, CORS_ORIGIN, WHATSAPP_WEBHOOK_SECRET

# Quality gates
npm run build            # Production build
npm test                 # Run tests
npm run lint             # Run linter
npm run orchestrator:prmr:handoff        # PR/MR handoff checklist + command hints
npm run orchestrator:prmr:handoff:checks # Same checklist + typecheck/lint/build run

# Deployment verification
npm run verify-deploy         # Run deployment readiness checks (endpoints/config/env/SEO files)
npm run verify:runtime -- --url=https://whitecaves.com # Verify live runtime endpoints (/, /api/health, robots, sitemap)
npm run verify:runtime:dry     # Print runtime checks without network calls
# Optional runtime verify tuning: --timeout=15000 --retries=6 --retry-delay=5000

# SEO operations
npm run seo:generate           # Generate robots.txt + sitemap.xml for production domain
npm run seo:generate:staging   # Generate robots.txt + sitemap.xml for staging domain
npm run test:ops               # Run SEO ops script test suite
npm run quality:seo            # Generate SEO assets + run SEO ops tests
npm run quality:quick          # Lint + build + SEO ops tests

# E2E testing shortcuts
npm run test:e2e               # Run all Playwright tests
npm run test:e2e:smoke         # Run dashboard smoke suite (src/e2e/dashboard.spec.ts)
npm run test:e2e:accessibility # Run accessibility audit suite (src/e2e/accessibility.audit.spec.ts)
npm run test:e2e:performance   # Run performance suite (src/e2e/performance.layer5.spec.ts, HTML report)
npm run test:e2e:performance:json # Run performance suite (src/e2e/performance.layer5.spec.ts, JSON report)
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
