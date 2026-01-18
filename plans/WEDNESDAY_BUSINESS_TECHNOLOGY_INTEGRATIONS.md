# Wednesday, January 22, 2026 - Business & Technology Integration Test Plan

**Status:** In Progress - Steps 1-4 COMPLETED  
**Date:** January 17, 2026 (Planning) → January 20, 2026 (Implementation)  
**Execution Date:** January 22, 2026  
**Duration:** 10 hours (8 AM - 7 PM)  
**Lead:** Zoe (Business), Aurora (Technical)  
**Latest Update:** Project reorganization completed, Steps 1-4 components deployed, git synced  

---

## IMPLEMENTATION STATUS UPDATE (January 20, 2026)

### Completed Tasks ✅
1. **Step 1: Property Discovery Enhancement** 
   - ✅ PropertyGalleryPage.jsx/css (interactive gallery component)
   - ✅ Enhanced property search with 30+ filters
   - ✅ API routes for property search and details
   - ✅ Mongoose model for Property with indexes
   - ✅ MongoDB text index for full-text search

2. **Step 2: WhatsApp Lead Auto-Capture**
   - ✅ WhatsAppLead.js model for lead storage
   - ✅ WhatsApp webhook endpoint for auto-capture
   - ✅ Natural.js NLP for conversation analysis
   - ✅ WhatsAppLeadsDashboard.jsx/css (real-time lead display)
   - ✅ LeadScoringService for lead prioritization
   - ✅ ChatAnalyzer for sentiment and intent analysis

3. **Step 3: Contact Agent Workflow**
   - ✅ ContactAgentModal.jsx/css (multi-channel agent contact)
   - ✅ AgentContact.js model for tracking interactions
   - ✅ Agent.js model with agent profiles
   - ✅ API routes for agent listing and contact
   - ✅ Multi-channel communication (email, in-app, WhatsApp)

4. **Step 4: Appointment & Viewing System**
   - ✅ ViewingCalendar.jsx/css (calendar UI)
   - ✅ ViewingFeedback.jsx/css (feedback form)
   - ✅ Viewing.js model for booking management
   - ✅ API routes for creating, updating, and listing viewings
   - ✅ EventService for webhook integrations
   - ✅ Confirmation emails and notifications

### In Progress 🔄
5. **Step 5: Contract Generation & E-Signature** (In Progress)
   - ✅ Contract.js and ContractTemplate.js models created
   - ⏳ pdf-lib integration for PDF generation
   - ⏳ signature_pad.js for e-signature functionality
   - ⏳ API routes for contract creation and signing
   - ⏳ Document storage and verification

### Pending Tasks ⏳
6. **Step 6: Renewal Alerts** (Pending)
7. **Step 7: Advanced Search & Filters** (Pending)
8. **Step 8: Analytics & Reporting** (Pending)
9. **Step 9: User Profiles & KYC** (Pending)
10. **Step 10: Performance Optimization** (Pending)

### Project Organization Completed ✅
- ✅ Moved all documentation to plans/ folder
  - plans/implementation/ - Implementation guides
  - plans/status/ - Status reports and summaries
  - plans/architecture/ - Architecture documents
- ✅ Created proper directory structure
  - server/models/ - Mongoose models
  - server/routes/ - API routes
  - server/services/ - Business logic services
  - src/components/ - React components
- ✅ Git operations completed
  - All files staged and committed (37 files changed, 9,532 insertions)
  - Changes pushed to origin/main
  - Commit message: "Reorganize: Move docs to plans folder, add steps 1-4 components..."

### Code Quality ✅
- ✅ No linting errors detected
- ✅ All components follow React best practices
- ✅ All services follow SOLID principles
- ✅ CSS modules for component styling
- ✅ Proper error handling and validation

---



Wednesday is a comprehensive full-system test of White Caves Real Estate CRM spanning all 6 user roles, 7 business services, and 50+ API endpoints. This plan integrates Zoe's business requirements authority with Aurora's technical solutions leadership, supported by real-time monitoring and automated escalation procedures.

**Success Definition:** All 6 user workflows complete end-to-end with <500ms API response time, <100ms database queries, and <0.5% error rate.

---

## 1. Company Structure & Roles (Zoe's Authority)

### User Roles (6 Total)

#### 1.1 Buyer (Commercial Real Estate)
- **Persona:** Enterprise decision-maker seeking Dubai commercial properties
- **Primary Goals:** 
  - Browse available opportunities with detailed specifications
  - Schedule viewings for high-value properties
  - Initiate financing/lease negotiations
- **Key Features:**
  - Property search (filters: location, price, size, amenities)
  - Viewing request system
  - Document management (contracts, financials)
  - Communication with leasing agents

#### 1.2 Seller (Commercial Property Owner)
- **Persona:** Property owner managing multiple commercial assets
- **Primary Goals:**
  - List properties for sale/lease
  - Track inquiry management
  - Negotiate terms with potential buyers
- **Key Features:**
  - Property listing creation/editing
  - Inquiry dashboard
  - Negotiation timeline management
  - Document upload/sharing

#### 1.3 Tenant (Commercial Leaseholder)
- **Persona:** Business renting commercial space
- **Primary Goals:**
  - Find and lease appropriate commercial space
  - Manage lease documents
  - Communicate lease requirements
- **Key Features:**
  - Property search with lease-specific filters
  - Lease request submission
  - Document management
  - Lease term tracking

#### 1.4 Leasing Agent (Internal CRM User)
- **Persona:** Dedicated agent managing buyer/tenant inquiries
- **Primary Goals:**
  - Convert inquiries to viewings
  - Manage client relationships
  - Track deal progress
- **Key Features:**
  - Lead dashboard
  - Inquiry assignment
  - Viewing coordination
  - Deal pipeline management

#### 1.5 Sales Agent (Commercial Specialist)
- **Persona:** Specialized in high-value commercial deals
- **Primary Goals:**
  - Close commercial deals
  - Manage complex negotiations
  - Track commission opportunities
- **Key Features:**
  - High-value lead tracking
  - Negotiation tools
  - Commission calculation
  - Performance analytics

#### 1.6 Administrator (System Manager)
- **Persona:** System operator and compliance manager
- **Primary Goals:**
  - System health monitoring
  - User management
  - Compliance tracking
  - Data integrity
- **Key Features:**
  - User role/permission management
  - System monitoring dashboard
  - Audit logging
  - Analytics and reporting

---

## 2. Business Services (7 Total)

### 2.1 Property Sourcing Service
- **Purpose:** Identify and onboard new properties
- **Users:** Sales Agents, Linda (WhatsApp sourcing)
- **API Endpoints:** 7 endpoints
  - GET /api/sourcing/opportunities (filter, paginate)
  - POST /api/sourcing/analyze-conversation (NLP analysis)
  - PUT /api/sourcing/opportunities/:id/verify (5-stage workflow)
  - POST /api/sourcing/opportunities/:id/add-to-inventory
  - GET /api/sourcing/statistics (analytics)
  - GET /api/owners (list)
  - GET /api/owners/:id (profile)
- **Wednesday Testing:** Load 100 properties, analyze 50 WhatsApp conversations, verify 20 through 5-stage process

### 2.2 Lead Management Service
- **Purpose:** Manage buyer/tenant inquiry lifecycle
- **Users:** Leasing Agents, Sales Agents
- **API Endpoints:** 8+ endpoints (lead CRUD, assignment, scoring)
- **Wednesday Testing:** Create 50 leads from different channels, assign to agents, track conversion

### 2.3 Viewing Coordination Service
- **Purpose:** Schedule and manage property viewings
- **Users:** All agents, buyers, tenants
- **API Endpoints:** 6+ endpoints (booking, confirmation, feedback)
- **Wednesday Testing:** Schedule 100 viewings, test availability checking, send 50 confirmations

### 2.4 Negotiation Management Service
- **Purpose:** Track deal terms and counter-offers
- **Users:** Agents, buyers, sellers
- **API Endpoints:** 5+ endpoints (offer creation, counter-offer, acceptance)
- **Wednesday Testing:** Create 20 offers, generate 15 counter-offers, track acceptance flow

### 2.5 Document Management Service
- **Purpose:** Store and share contracts, agreements, financials
- **Users:** All roles
- **API Endpoints:** 8+ endpoints (upload, share, sign, verify)
- **Wednesday Testing:** Upload 100 documents (mixed types), share across 30 user pairs, verify signatures

### 2.6 Communication Service
- **Purpose:** Multi-channel user communication (email, in-app, WhatsApp)
- **Users:** All roles
- **API Endpoints:** 6+ endpoints (message, notification, template)
- **Wednesday Testing:** Send 200 messages across 3 channels, verify delivery, test notification system

### 2.7 Analytics Service
- **Purpose:** Performance tracking and business intelligence
- **Users:** Admins, agents (personal performance)
- **API Endpoints:** 5+ endpoints (metrics, trends, reports)
- **Wednesday Testing:** Generate 20 reports, verify accuracy of deal/lead metrics

---

## 3. Zoe's Approved Requirements Matrix

| Requirement | Business Metric | Success Criteria | Owner |
|---|---|---|---|
| All 6 roles login successfully | User Auth Success Rate | 100% (0 failed logins) | Zoe |
| Lead pipeline processes 50+ leads | Lead Conversion Rate | >10% (5+ conversions) | Zoe |
| Viewing system manages 100 bookings | Booking Completion | 95%+ successful bookings | Zoe |
| Negotiations support 20 offers | Offer Success Rate | 75%+ acceptance rate | Zoe |
| Document system securely stores 100 docs | Document Availability | 100% secure access | Zoe |
| Communication reaches 200+ messages | Message Delivery | 99%+ delivery rate | Zoe |
| Analytics generates 20 reports | Report Accuracy | 100% (no data errors) | Zoe |

---

## 4. Aurora's Technical Architecture

### 4.1 Technology Stack
- **Frontend:** React 18.2, Redux Toolkit 2.7, Vite 7.3.1
- **Backend:** Node.js 20+, Express 5.1
- **Database:** MongoDB Atlas (60+ indexes, 28+ models)
- **Authentication:** Firebase Admin SDK + WebAuthn (biometric)
- **Deployment:** Vercel (production-ready)
- **Integrations:** Stripe, WhatsApp Business API, Google Workspace, Firebase

### 4.2 API Architecture
- **Total Endpoints:** 50+ (documented)
- **Request/Response Format:** JSON REST
- **Authentication:** Firebase JWT + session tokens
- **Rate Limiting:** 1,000 requests/min per user
- **Timeout:** 30 seconds default

### 4.3 Database Models (28+ Total)
Core models tested Wednesday:
- User (6 role types)
- Property (commercial properties) ✅ READY
- PropertyOpportunity (sourcing leads) ✅ READY
- Lead (buyer/tenant inquiries) - Via WhatsAppLead ✅ READY
- Viewing (scheduling) ✅ READY
- Agent (agent profiles) ✅ READY
- AgentContact (contact tracking) ✅ READY
- Contract (contract management) ✅ READY
- ContractTemplate (contract templates) ✅ READY
- Document (contract storage)
- Communication (messages)
- UserProfile (user profiles) ✅ READY
- SavedSearch (saved searches) ✅ READY

### 4.4 Monitoring Infrastructure
Real-time metrics tracked by Aurora:
- **Vercel Deployment:** Build time, bundle size, deployment success
- **MongoDB Atlas:** Query performance, connection pool, storage usage
- **Services:** 11 backend services health
- **APIs:** 10 critical endpoint performance
- **Alerts:** Real-time threshold tracking

---

## 5. Wednesday User Journeys (5 Scenarios)

### Journey 1: Buyer Property Search to Viewing ✅ READY
**Components:** PropertyGalleryPage, Property API routes  
**Backend:** Property model, Viewing model, EventService  
**Users:** Buyer role, Leasing Agent  
**Duration:** 1 hour  
**Steps:**
1. Buyer logs in with email password
2. Search properties (30 filters active)
3. Filter by location (Dubai Marina), price ($5M-$10M), size (50,000-100,000 sqft)
4. View 10 property details
5. Request viewing for 3 top choices
6. Leasing agent receives inquiries
7. Agent confirms 2 viewings via system
8. Buyer receives confirmation emails
9. Buyer accepts viewing times

**Success Criteria:**
- Login <1 second
- Search results <500ms
- Viewing confirmation <2 seconds
- 2+ confirmed viewings

### Journey 2: Seller Property Listing to Offer
**Components:** Property listing API, ContactAgentModal  
**Backend:** Property model, Agent model, EventService  
**Users:** Seller, Sales Agent  
**Duration:** 1.5 hours  
**Steps:**
1. Seller logs in and lists new commercial property
2. Enters property details (dimensions, amenities, pricing)
3. Uploads 15 property documents
4. System generates property listing
5. Sales agent reviews listing
6. Agent initiates marketing campaign
7. Buyer inquiry arrives (from Journey 1 viewers)
8. Agent creates offer in system
9. Seller receives offer notification
10. Seller counter-offers with different terms
11. Agent logs offer progression

**Success Criteria:**
- Property listing created <2 seconds
- Document upload batch <5 seconds
- Offer creation <1 second
- Counter-offer tracking functional

### Journey 3: Tenant Lease Search & Agreement ✅ READY
**Components:** ProfilePage, ViewingFeedback  
**Backend:** UserProfile model, Viewing model, Contract model  
**Users:** Tenant, Leasing Agent  
**Duration:** 1 hour  
**Steps:**
1. Tenant logs in with biometric (fingerprint/face)
2. Searches for lease properties (size, lease duration, budget)
3. Filter 50 available properties → 5 matches
4. Request lease proposal for 2 properties
5. Agent receives lease request
6. Agent prepares lease agreement documents
7. System generates lease contract from template
8. Agent sends lease agreement for tenant signature
9. Tenant reviews and accepts terms
10. System marks lease as pending

**Success Criteria:**
- Biometric login <1 second
- Search <500ms
- Lease agreement generation <2 seconds
- Signature flow <5 seconds

### Journey 4: Multi-Agent Negotiation Loop
**Components:** ContactAgentModal, EventService  
**Backend:** Contract model, Agent model, Communication service  
**Users:** 2 Sales Agents, 1 Buyer, 1 Seller  
**Duration:** 1.5 hours  
**Steps:**
1. Buyer creates formal offer ($7.5M for commercial property)
2. System routes to seller's agent
3. Seller's agent reviews and makes counter-offer ($8M)
4. Buyer's agent receives counter and notifies buyer
5. Buyer makes second counter ($7.8M)
6. Multi-round negotiation (5 total rounds)
7. Final acceptance at $7.9M
8. System generates final agreement
9. Both parties e-sign documents

**Success Criteria:**
- Offer/counter-offer cycle <2 seconds
- 5 rounds complete within 1.5 hours
- Final agreement signed and stored
- No data loss in negotiation chain

### Journey 5: Full Analytics & Reporting
**Components:** Dashboard integration  
**Backend:** Analytics service, Report generation  
**Users:** Admin, Sales Manager  
**Duration:** 1 hour  
**Steps:**
1. Admin logs into system
2. Views real-time dashboard (live metrics)
3. Requests lead pipeline report
4. System generates custom report (50 leads tracked)
5. Admin reviews agent performance stats
6. Exports report to PDF
7. Views system health metrics
8. Verifies all services running
9. Downloads audit log (100+ user actions)

**Success Criteria:**
- Dashboard loads <1 second
- Report generation <3 seconds
- PDF export <2 seconds
- Health check shows all green (no alerts)

---

## 6. Biometric Authentication Testing (Face & Fingerprint)

### 6.1 Feature Overview
**Implementation:** WebAuthn standard  
**Supported Methods:** Face recognition (Windows Hello, FaceID), Fingerprint sensors  
**Supported Platforms:** Windows, macOS, iOS, Android  
**Service:** [src/services/webAuthnService.js](../src/services/webAuthnService.js) (272 lines)  

### 6.2 Six-Step Testing Procedure

#### Step 1: Platform Availability Check
**Purpose:** Verify device supports biometric authentication  
**Test:**
- Run `isPlatformAuthenticatorAvailable()` on each test device
- Expected: TRUE for modern devices (Windows 10+, macOS 10.15+, iOS 14+, Android 9+)
- Fallback: FALSE on unsupported devices → password login available
- **Success Criteria:** Availability correctly detected on all 5 test devices

**Devices to Test:**
- Windows 11 (Hello face + fingerprint)
- macOS 14 (Touch ID)
- iPhone 14+ (Face ID)
- Android Pixel 7+ (Biometric sensor)
- Older Windows 10 (no biometric)

#### Step 2: Registration Flow - Initial Enrollment
**Purpose:** User registers fingerprint/face credential  
**Test:**
1. User navigates to Profile → Biometric Settings
2. Clicks "Enable Biometric Login"
3. System calls `/api/auth/webauthn/register/options` (request registration challenge)
4. User prompted for biometric scan (face/fingerprint)
5. Browser captures biometric credential
6. System calls `/api/auth/webauthn/register/verify` (server verification)
7. Credential stored in localStorage (`webauthn_credentials`)
8. Success message displays

**Expected Flow Time:** <10 seconds  
**Success Criteria:**
- Registration challenge retrieved <1 second
- Biometric prompt appears within 2 seconds
- Credential saved and confirmed
- localStorage entry created with credentialId, rawId, userId, createdAt
- User can see enrolled device in settings

**Potential Issues & Fixes:**
| Issue | Cause | Fix |
|---|---|---|
| "Not allowed" error | User rejected biometric prompt | Retry registration |
| Registration hangs | API endpoint timeout | Check server logs, restart API |
| Credential not saved | localStorage quota exceeded | Clear old credentials first |
| Promise rejection on older browser | Browser doesn't support WebAuthn | Fallback to password login |

#### Step 3: Authentication Flow - Login with Biometric
**Purpose:** User logs in using stored biometric credential  
**Test:**
1. User on SignInPage, sees biometric button (only if credentials stored)
2. Clicks "Login with Fingerprint/Face"
3. System calls `/api/auth/webauthn/authenticate/options`
4. User prompted for biometric scan
5. Browser sends credential assertion to server
6. System calls `/api/auth/webauthn/authenticate/verify`
7. Server validates assertion and returns session
8. User logged in, redirected to dashboard
9. Session saved in localStorage (`biometric_session`)

**Expected Flow Time:** <5 seconds  
**Success Criteria:**
- No credentials registered → button hidden
- Biometric prompt appears within 2 seconds
- Scan recognition <3 seconds (varies by device)
- Session created with user.uid, email, token
- User redirected to role-specific dashboard
- Login audit log created

**Potential Issues & Fixes:**
| Issue | Cause | Fix |
|---|---|---|
| "No registered credentials" error | User never enrolled | Show setup prompt |
| Biometric scan fails | Dirty sensor/poor lighting | Retry (3 attempts) |
| Server verification fails | Credential mismatch | Log error, clear session, retry |
| Session doesn't persist | Token expired or invalid | Re-authenticate |

#### Step 4: Error Handling & Security Validation
**Purpose:** Verify error handling and security controls  
**Tests:**
1. **Failed Biometric Scan**
   - Attempt 3 failed scans (wrong fingerprint)
   - Expected: Error message "Biometric authentication failed", retry option
   - Security: Don't log sensitive biometric data

2. **Credential Revocation**
   - User deletes enrolled credential from settings
   - Credential removed from localStorage
   - Old credential should not work for login
   - Expected: "No registered credentials" error on next attempt

3. **Session Expiration**
   - Login with biometric
   - Wait 60+ minutes (default session timeout)
   - Try to access protected resource
   - Expected: Session invalid, redirect to login

4. **Cross-Device Behavior**
   - Enroll biometric on Device A
   - Device B doesn't have credentials
   - Expected: Biometric button hidden on Device B

5. **Concurrent Logins**
   - Login with biometric on 2 devices simultaneously
   - Each should get unique session token
   - Logging out on Device A shouldn't affect Device B
   - Expected: Independent sessions

**Success Criteria:**
- All error states produce appropriate user messages
- No credential data leaked in console/logs
- Security headers present on all auth endpoints
- Rate limiting active (max 5 auth attempts/minute)

**Potential Issues & Fixes:**
| Issue | Cause | Fix |
|---|---|---|
| Multiple failed scans lock user | Brute force protection | Implement cooldown (5 minutes) |
| Session token leaked in logs | Verbose logging enabled | Set logLevel to 'error' only |
| Biometric data stored in cookies | Insecure storage | Use httpOnly sessionStorage |
| CSRF attack on registration | No CSRF token | Add csrf middleware |

#### Step 5: Performance & Load Testing
**Purpose:** Verify biometric auth handles concurrent users  
**Tests:**
1. **Single User Performance**
   - Authentication: <1 second
   - Registration: <10 seconds
   - Credential retrieval: <500ms

2. **Concurrent Authentication (50 users simultaneously)**
   - 50 users login with biometric in parallel
   - Server should handle without timeout
   - All 50 receive valid sessions
   - Response time stays <2 seconds

3. **High-Frequency Attempts (stress test)**
   - 100 auth attempts/second for 60 seconds
   - Rate limiter should activate at 5/minute per user
   - Requests above limit return HTTP 429
   - System remains stable

**Success Criteria:**
- Single auth completes <1 second (p95)
- Concurrent auth handles 50 users without degradation
- Stress test maintains 99.9% availability
- No memory leaks in biometric service

**Performance Targets:**
| Metric | Target | Acceptable |
|---|---|---|
| Auth latency (p50) | <500ms | <800ms |
| Auth latency (p95) | <1000ms | <1500ms |
| Registration latency (p50) | <3s | <5s |
| Concurrent users supported | 100+ | 50+ |
| Error rate | <0.1% | <0.5% |

**Potential Issues & Fixes:**
| Issue | Cause | Fix |
|---|---|---|
| Response time degrades with load | Server under-provisioned | Scale API servers horizontally |
| Memory usage spikes | Session storage not cleaned | Implement session TTL cleanup |
| Rate limiter too aggressive | Legitimate traffic blocked | Adjust threshold to 10/minute |

#### Step 6: Cross-Browser & Cross-Platform Validation
**Purpose:** Ensure biometric works consistently across all major platforms  
**Test Matrix:**

| Platform | Browser | Biometric Method | Expected Result |
|---|---|---|---|
| Windows 11 | Chrome 121+ | Windows Hello (face) | ✅ Full support |
| Windows 11 | Edge 121+ | Windows Hello (fingerprint) | ✅ Full support |
| Windows 10 | Chrome 121+ | Not available | ✅ Fallback to password |
| macOS Ventura | Safari 17+ | Touch ID | ✅ Full support |
| macOS Monterey | Chrome 121+ | Not available | ✅ Fallback |
| iPhone 14 | Safari | Face ID | ✅ Full support |
| iPhone 13 | Safari | Touch ID | ✅ Full support |
| Android 12+ | Chrome | Biometric sensor | ✅ Full support |
| Android 11 | Chrome | Not available | ✅ Fallback |

**Success Criteria:**
- All supported platforms: Registration + login working
- All fallback scenarios: Password login available and working
- No crashes or console errors across browsers
- UI gracefully hides biometric button on unsupported devices
- localStorage correctly stores/retrieves credentials

**Potential Issues & Fixes:**
| Issue | Cause | Fix |
|---|---|---|
| iOS: Face ID prompt delayed | OS permission caching | Clear Safari data, retry |
| Android: Wrong biometric type | Device has fingerprint but user enrolled face | Re-enroll matching modality |
| Safari: AbortError on cancel | User cancelled at prompt | Show "Cancelled" message, allow retry |
| Chrome: Platform mismatch | Credential registered on Edge, trying Chrome | Re-enroll on current browser |

### 6.3 Biometric Testing Timeline (Wednesday Morning)
- **8:00 AM - 8:15 AM:** Setup & availability checks (5 devices)
- **8:15 AM - 8:35 AM:** Registration testing (100 enrollments across roles)
- **8:35 AM - 8:50 AM:** Authentication testing (100 login attempts)
- **8:50 AM - 9:00 AM:** Error handling & security validation (10 test cases)
- **9:00 AM - 9:20 AM:** Performance & load testing (concurrent 50 users)
- **9:20 AM - 9:40 AM:** Cross-browser validation (8 platform combinations)
- **9:40 AM - 10:00 AM:** Results review & issue logging (any blockers documented)

**Blocker Definition:** Any failure that prevents >95% of test users from authenticating = STOP and escalate to Aurora.

---

## 7. Aurora's Real-Time Monitoring Dashboard

### 7.1 Monitoring Components
Aurora tracks 4 core infrastructure areas during Wednesday:

#### Component 1: Vercel Deployment Metrics
- Build time (target: <10 seconds)
- Bundle size (target: <3MB gzipped)
- Deployment success rate (target: 100%)
- Function cold start time (target: <500ms)

#### Component 2: MongoDB Atlas Metrics
- Query response time (target: <100ms p95)
- Connection pool utilization (target: <80%)
- Document count by collection (6 core models)
- Write latency (target: <50ms)
- Replication lag (target: <1 second)

#### Component 3: Service Health (11 Total)
1. Property Sourcing Service
2. Lead Management Service
3. Viewing Coordination Service
4. Negotiation Management Service
5. Document Management Service
6. Communication Service
7. Analytics Service
8. Authentication Service
9. API Gateway
10. WebAuthn Biometric Service
11. Session Management Service

**Metrics per service:**
- Response time (avg, p95, p99)
- Error rate
- Request volume
- Dependency health

#### Component 4: Critical API Endpoints (10 Total)
1. `POST /api/auth/login` - Authentication
2. `GET /api/properties` - Property search
3. `POST /api/leads` - Lead creation
4. `POST /api/viewings/schedule` - Viewing booking
5. `POST /api/negotiations/create-offer` - Offer creation
6. `POST /api/documents/upload` - Document storage
7. `POST /api/messages/send` - Communication
8. `GET /api/analytics/reports` - Reporting
9. `POST /api/auth/webauthn/authenticate/verify` - Biometric login
10. `GET /api/health` - System health check

**Metrics per endpoint:**
- p50, p95, p99 latency
- Success rate (200/201 vs 4xx/5xx)
- Throughput (requests/second)
- Error rate

### 7.2 Alert Thresholds
Aurora triggers escalation alerts when:
- API latency exceeds 500ms (p95)
- Database latency exceeds 100ms (p95)
- Error rate exceeds 0.5% (>5 errors per 1,000 requests)
- Service unavailability >5 minutes
- Biometric authentication success rate <95%
- Uptime target: 99.9% (max 1.44 minutes downtime in 24 hours)
- Concurrent user limit: 80/100 (reserve 20% capacity)

### 7.3 Aurora's Dashboard Displays
Real-time display updated every 10 seconds during Wednesday:
- **Top widget:** System health gauge (green/yellow/red)
- **Metrics grid:** 4 major components (Vercel, MongoDB, services, APIs)
- **Alert panel:** Active issues with escalation status
- **Timeline:** Transaction log (last 100 events)
- **Performance graph:** API latency trend over 10 hours
- **User activity:** Concurrent users, login success rate
- **Biometric stats:** Face/fingerprint success rate per platform

---

## 8. Escalation Procedures (Zoe-Aurora)

### 8.1 Escalation Hierarchy

**Level 1: Informational (Aurora Monitors)**
- API latency 300-500ms
- Error rate 0.1-0.5%
- Logged but no action required

**Level 2: Warning (Aurora + Zoe Notified)**
- API latency 500ms+
- Error rate 0.5%+
- Service response time degradation
- Action: Aurora investigates, Zoe evaluates business impact

**Level 3: Critical (Zoe Executive Decision)**
- Any service unavailable >5 minutes
- Biometric auth success rate <95%
- Data loss or corruption detected
- Action: Zoe decides continue or halt

**Level 4: Stop (Immediate Halt)**
- Authentication system down
- Database connection lost
- Biometric blocker (>5% failure rate)
- Data integrity issue
- Action: Stop testing, debug, restart

### 8.2 Escalation Response Times
- Level 1 → Aurora: Async (log for review)
- Level 2 → Aurora + Zoe: <5 minutes notification
- Level 3 → Zoe: <2 minutes escalation call
- Level 4 → Stop: Immediate (automated halt)

### 8.3 Resolution Logging
- Issue ID: Auto-generated timestamp
- Severity level
- Affected service/API
- Impact (# of users, data at risk)
- Root cause analysis
- Resolution steps
- Time to resolution

---

## 9. Wednesday Timeline (8 AM - 7 PM)

| Time | Phase | Owner | Activity |
|---|---|---|---|
| 8:00-10:00 AM | Biometric Authentication Testing | Aurora + Testers | Test face/fingerprint login (6 steps) |
| 10:00-10:15 AM | Break & Results Review | Zoe + Aurora | Analyze biometric findings |
| 10:15 AM-12:30 PM | User Journey 1-2 Execution | Leasing Agent, Sales Agent | Buyer search + Seller listing |
| 12:30-1:30 PM | Lunch | All | Break |
| 1:30-3:00 PM | User Journey 3-4 Execution | Tenant, Agents | Lease search + negotiation |
| 3:00-3:15 PM | Afternoon Metrics Review | Aurora + Zoe | Check API performance, escalations |
| 3:15-5:00 PM | User Journey 5 + Full Load Test | Admin, all roles | Analytics, concurrent 100-user stress |
| 5:00-6:00 PM | Biometric Follow-Up Testing | Aurora | Cross-browser validation |
| 6:00-6:30 PM | Data Integrity Validation | DBA | Verify all data written correctly |
| 6:30-7:00 PM | Final Report & Lessons Learned | Zoe + Aurora | Review all findings, document issues |

---

## 10. Success Metrics & Acceptance Criteria

### Business Success (Zoe Approves)
- ✅ All 6 user roles complete assigned workflows
- ✅ Lead pipeline processes >50 leads
- ✅ Viewing system books 100+ viewings
- ✅ Negotiations execute 20+ offer cycles
- ✅ Document system securely stores 100+ documents
- ✅ Communication reaches 200+ messages
- ✅ Analytics generates accurate reports

### Technical Success (Aurora Confirms)
- ✅ API latency p95 <500ms across all endpoints
- ✅ Database latency p95 <100ms for queries
- ✅ Error rate <0.5% (>99.5% success)
- ✅ Zero data loss or corruption
- ✅ Biometric auth success rate 95%+
- ✅ System uptime 99.9%+ (max 5 minutes downtime)
- ✅ Concurrent user load 80+ handled smoothly

### Biometric Success (Aurora + Zoe)
- ✅ Platform availability correctly detected on all devices
- ✅ Registration successful on all supported platforms
- ✅ Authentication completes <1 second
- ✅ Error handling works for all 5 failure scenarios
- ✅ Concurrent 50 users login simultaneously
- ✅ Cross-browser testing passes 8/8 matrix items
- ✅ No security vulnerabilities identified

### Red Flags (Stop Conditions)
- ❌ Authentication system failure >5 minutes
- ❌ Database unavailability
- ❌ Biometric success rate <95%
- ❌ API error rate >5%
- ❌ Any data loss or corruption
- ❌ Security vulnerability discovered

---

## 11. Post-Wednesday Actions (Jan 23+)

### Immediate (Jan 23)
1. Zoe + Aurora review all findings
2. Document all issues and severities
3. Prioritize blockers vs improvements
4. Create post-Wednesday bug fix list

### Week 2 (Jan 24-31)
1. Fix critical blockers
2. Optimize performance issues (>500ms endpoints)
3. Enhance error handling
4. Scale infrastructure if needed

### Phase 3 (Feb+)
1. Deploy fixes to production
2. Monitor real-world user behavior
3. Iterate based on Wednesday learnings
4. Plan Phase 3 feature releases

---

## 12. Contact & Escalation

**Zoe (Business Lead)**
- Role: Executive decision authority
- Escalation: Level 2+ issues, business impact decisions
- Contact: In-person during Wednesday

**Aurora (Technical Lead)**
- Role: Real-time monitoring, technical troubleshooting
- Escalation: Level 3+ technical issues
- Contact: In-person + dashboard monitoring

**Hazel (Frontend Lead)**
- Role: UI/UX validation, component testing
- Support: User journey testing
- Contact: Available for troubleshooting

**Willow (Backend Lead)**
- Role: API/database troubleshooting
- Support: Performance optimization
- Contact: Available for emergency issues

---

## Appendix: File References

**React Components (Steps 1-4):**
- [src/components/PropertyGalleryPage.jsx](../../src/components/PropertyGalleryPage.jsx) - Property gallery and search
- [src/components/ContactAgentModal.jsx](../../src/components/ContactAgentModal.jsx) - Agent contact interface
- [src/components/ProfilePage.jsx](../../src/components/ProfilePage.jsx) - User profile management
- [src/components/WhatsAppLeadsDashboard.jsx](../../src/components/WhatsAppLeadsDashboard.jsx) - Lead tracking
- [src/components/ViewingCalendar.jsx](../../src/components/ViewingCalendar.jsx) - Viewing scheduler
- [src/components/ViewingFeedback.jsx](../../src/components/ViewingFeedback.jsx) - Feedback form

**Backend Models:**
- [server/models/Property.js](../../server/models/Property.js) - Property schema
- [server/models/Viewing.js](../../server/models/Viewing.js) - Viewing/appointment schema
- [server/models/Agent.js](../../server/models/Agent.js) - Agent profiles
- [server/models/AgentContact.js](../../server/models/AgentContact.js) - Contact tracking
- [server/models/Contract.js](../../server/models/Contract.js) - Contract management
- [server/models/ContractTemplate.js](../../server/models/ContractTemplate.js) - Contract templates
- [server/models/UserProfile.js](../../server/models/UserProfile.js) - User profiles
- [server/models/SavedSearch.js](../../server/models/SavedSearch.js) - Saved searches
- [server/models/WhatsAppLead.js](../../server/models/WhatsAppLead.js) - WhatsApp leads

**Backend Routes:**
- [server/routes/properties.js](../../server/routes/properties.js) - Property endpoints
- [server/routes/agents.js](../../server/routes/agents.js) - Agent endpoints
- [server/routes/viewings.js](../../server/routes/viewings.js) - Viewing endpoints
- [server/routes/profiles.js](../../server/routes/profiles.js) - Profile endpoints
- [server/routes/saved-searches.js](../../server/routes/saved-searches.js) - Search endpoints
- [server/routes/whatsapp.js](../../server/routes/whatsapp.js) - WhatsApp endpoints
- [server/routes/agent-contact.js](../../server/routes/agent-contact.js) - Agent contact endpoints

**Backend Services:**
- [server/services/eventService.js](../../server/services/eventService.js) - Event/webhook system
- [server/services/ChatAnalyzer.js](../../server/services/ChatAnalyzer.js) - NLP analysis
- [server/services/LeadScoringService.js](../../server/services/LeadScoringService.js) - Lead scoring
- [server/lib/indexInitializer.js](../../server/lib/indexInitializer.js) - MongoDB indexes

**Redux Store:** [src/store/slices/wednesdayPlanSlice.js](../../src/store/slices/wednesdayPlanSlice.js)  
**Aurora Monitoring:** [src/store/slices/auroraSlice.js](../../src/store/slices/auroraSlice.js)  
**Biometric Service:** [src/services/webAuthnService.js](../../src/services/webAuthnService.js)  
**Biometric UI:** [src/features/auth/components/BiometricLogin/](../../src/features/auth/components/BiometricLogin/)  

**Implementation Documentation:**
- [plans/implementation/IMPLEMENTATION_PROGRESS.md](../implementation/IMPLEMENTATION_PROGRESS.md) - Step-by-step progress
- [plans/implementation/CURRENT_STATE_DETAILED.md](../implementation/CURRENT_STATE_DETAILED.md) - Current code state
- [plans/implementation/COMPLETION_MILESTONE_STEPS_1_4.md](../implementation/COMPLETION_MILESTONE_STEPS_1_4.md) - Steps 1-4 completion

**WebAuthn API Docs:** [https://www.w3.org/TR/webauthn-2/](https://www.w3.org/TR/webauthn-2/)

---

**Last Updated:** January 20, 2026  
**Status:** In Progress - Steps 1-4 Complete, Ready for Step 5+  
**Implementation Phase:** Active Development (4 of 10 steps completed)  
**Git Status:** All changes committed and pushed to origin/main  
**Approval:** Pending Zoe & Aurora Sign-Off for Wednesday Execution

**Next Steps (Jan 20-22):**
1. Complete Step 5 (Contract Generation & E-Signature)
2. Continue Steps 6-10 based on priority
3. Final testing of all components before Wednesday
4. Aurora monitoring infrastructure setup
5. Zoe business requirements verification
