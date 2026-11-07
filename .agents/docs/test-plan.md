# Test Plan — White Caves CRM Platform

> **Document ID:** WC-TP-001  
> **Version:** 1.0  
> **Date:** March 2026  
> **Status:** Approved  
> **Standard:** Based on IEEE Std 829-2008 (Software Test Documentation)

---

## 1. Introduction

### 1.1 Purpose
This Test Plan defines the testing strategy, scope, types, environment, schedule, and responsibilities for the White Caves CRM Platform. It ensures all requirements in the SRS (WC-SRS-001) are verified before each production release.

### 1.2 Test Objectives
- Verify all functional requirements are implemented correctly
- Validate all non-functional requirements (performance, security, accessibility)
- Confirm regulatory compliance requirements (RERA, AML, PDPL)
- Detect defects before they reach production
- Provide confidence that the system is ready for business operation

### 1.3 Test Scope

**In Scope:**
- All REST API endpoints
- Frontend UI components and pages
- Authentication and RBAC
- Business logic (scoring, commission, RERA enforcement)
- Third-party integration webhook handlers
- Database operations and data integrity
- Security (auth, input sanitisation, rate limiting)
- Performance benchmarks

**Out of Scope:**
- Third-party services themselves (WhatsApp, PropertyFinder, Bayut)
- Browser/OS compatibility beyond the supported matrix
- Native mobile applications (not built yet)
- Load testing above 2,000 concurrent users (future platform growth)

---

## 2. Test Strategy

### 2.1 Test Pyramid

```
        ┌─────────────────────┐
        │    E2E Tests        │  Small number, high value
        │   (Playwright)      │  ~20 critical user journeys
        └──────────────┬──────┘
               ┌───────┴────────────┐
               │  Integration Tests  │  API endpoint tests
               │  (Jest/Supertest)   │  Each route tested
               └──────────┬─────────┘
        ┌─────────────────┴──────────────────┐
        │         Unit Tests                   │  Majority of tests
        │  (Vitest + Jest)                     │  Business logic, utilities
        │  Coverage target: ≥ 80%              │  Redux slices, hooks
        └──────────────────────────────────────┘
```

### 2.2 Test Types

#### Unit Tests
- **Tool:** Vitest (frontend), Jest (backend)
- **What is tested:** Individual functions, Redux slices, React hooks, utility functions, service classes
- **Goal:** ≥ 80% coverage on business logic files
- **Location:** `*.test.ts` / `*.test.tsx` co-located with source files

#### Integration Tests
- **Tool:** Jest + Supertest (backend API)
- **What is tested:** Full API endpoint with real database (MongoDB test cluster)
- **Scope:** All CRUD operations, authentication flows, error responses
- **Database:** Test database cleared between test suites

#### End-to-End (E2E) Tests
- **Tool:** Playwright
- **What is tested:** Critical user journeys in a real browser
- **Scope:** 20 priority journeys (see Section 5)
- **Environment:** Staging environment with test data

#### Performance Tests
- **Tool:** k6
- **What is tested:** API response times, throughput, concurrent users
- **Target:** All NFR-PERF requirements met

#### Security Tests
- **Tool:** OWASP ZAP (automated) + manual review
- **What is tested:** OWASP Top 10, auth bypass, injection, XSS
- **Frequency:** On every major release

#### Accessibility Tests
- **Tool:** axe-playwright (automated) + manual screen reader check
- **Standard:** WCAG 2.1 Level AA
- **Frequency:** On UI changes

---

## 3. Test Environment

### 3.1 Environment Matrix

| Environment | Database | API URL | Purpose |
|-------------|---------|---------|---------|
| Local | MongoDB local | localhost:3001 | Developer testing |
| CI | MongoDB Atlas (test) | CI hostname | Automated pipeline tests |
| Staging | MongoDB Atlas (staging) | staging-api.whitecaves.ae | Integration + UAT |
| Production | MongoDB Atlas (production) | api.whitecaves.ae | Live only |

### 3.2 Test Data Strategy

**Unit/Integration tests:** Seed data created per test suite; cleaned up after each suite using `beforeEach`/`afterAll`.

**E2E/UAT tests:** Dedicated test accounts and test properties/leads pre-seeded in staging. Test data tagged with prefix `[TEST]` so it is never confused with real data.

**Test user accounts (staging):**
| Email | Password | Role |
|-------|---------|------|
| test.owner@whitecaves.ae | TestPass123! | Owner |
| test.manager@whitecaves.ae | TestPass123! | Sales Manager |
| test.agent@whitecaves.ae | TestPass123! | Agent |
| test.finance@whitecaves.ae | TestPass123! | Finance Director |
| test.compliance@whitecaves.ae | TestPass123! | Compliance Officer |
| test.tenant@whitecaves.ae | TestPass123! | Tenant (portal) |

---

## 4. Test Cases — API (Integration Tests)

### Module: Authentication

| Test ID | Description | Input | Expected Result |
|---------|------------|-------|----------------|
| IT-AUTH-001 | Login with valid credentials | `{email, password}` | 200, JWT token returned |
| IT-AUTH-002 | Login with wrong password | `{email, wrongPassword}` | 401, no token |
| IT-AUTH-003 | Login with non-existent email | `{unknown@x.com, pw}` | 401, generic error (no enum) |
| IT-AUTH-004 | Rate limit triggers | 6 login attempts in 15 min | 429 on 6th attempt |
| IT-AUTH-005 | Expired token rejected | Old JWT in Authorization | 401 |
| IT-AUTH-006 | No token on protected route | No header | 401 |
| IT-AUTH-007 | Wrong role on role-restricted route | Agent on finance endpoint | 403 |
| IT-AUTH-008 | Firebase sync — new user | Valid Firebase ID token | 201, user created with role=agent |
| IT-AUTH-009 | 2FA — correct code | Valid TOTP | 200, JWT returned |
| IT-AUTH-010 | 2FA — wrong code | Invalid TOTP | 401 |

### Module: Leads

| Test ID | Description | Input | Expected Result |
|---------|------------|-------|----------------|
| IT-LEAD-001 | Create lead — valid | Required fields | 201, lead created with score |
| IT-LEAD-002 | Create lead — missing name | No name | 400 |
| IT-LEAD-003 | Create lead — duplicate phone | Existing phone | 409 or warning |
| IT-LEAD-004 | List leads — pagination | `?page=2&pageSize=5` | 200, 5 results, correct page |
| IT-LEAD-005 | Filter by status | `?status=qualified` | Only qualified leads |
| IT-LEAD-006 | Filter by score | `?minScore=80` | Only leads with score ≥ 80 |
| IT-LEAD-007 | Agent sees only own leads | Agent JWT | Only leads assigned to them |
| IT-LEAD-008 | Manager sees all leads | Manager JWT | All leads |
| IT-LEAD-009 | Update lead status | `PATCH {status: "won"}` | 200, status updated |
| IT-LEAD-010 | Update lead status — invalid value | `PATCH {status: "invalid"}` | 400 |
| IT-LEAD-011 | Log activity | POST /activities | 201, activity linked to lead |
| IT-LEAD-012 | Delete lead — agent role | DELETE by agent | 403 |
| IT-LEAD-013 | Delete lead — manager role | DELETE by manager | 200 (soft delete) |

### Module: Properties

| Test ID | Description | Input | Expected Result |
|---------|------------|-------|----------------|
| IT-PROP-001 | Create property | Valid fields | 201, property in draft |
| IT-PROP-002 | Publish without permit | `{status: "available"}` no permit | 400, blocked |
| IT-PROP-003 | Publish with valid permit | Permit + future expiry | 200, status=available |
| IT-PROP-004 | Filter by type + price range | `?type=villa&maxPrice=3000000` | Correct subset |
| IT-PROP-005 | Property status change logged | Any status change | Activity created |
| IT-PROP-006 | Duplicate DLD reference blocked | Same DLD ref twice | 409 |
| IT-PROP-007 | Upload media — too large | 55 MB file | 413 |

### Module: Finance / Commissions

| Test ID | Description | Input | Expected Result |
|---------|------------|-------|----------------|
| IT-FIN-001 | Commission auto-created on close | Transaction → Closed | Commission record created |
| IT-FIN-002 | Commission amount correct | Price=1M, rate=2% | commission.amount=20,000 |
| IT-FIN-003 | Agent cannot approve own commission | Agent role | 403 |
| IT-FIN-004 | Manager approves commission | Manager role | 200, status=approved |
| IT-FIN-005 | Cannot edit paid commission | status=paid | 400 |
| IT-FIN-006 | Agent sees only own commissions | Agent JWT | Filtered results |

### Module: Compliance

| Test ID | Description | Input | Expected Result |
|---------|------------|-------|----------------|
| IT-COMP-001 | Compliance dashboard loads | Owner/Manager JWT | 200, compliance data |
| IT-COMP-002 | Listing without permit flagged | Property with no permit | Appears in non-compliant list |
| IT-COMP-003 | Tenant lease requires Ejari | POST lease activate without Ejari | 400 |

---

## 5. End-to-End Test Scenarios

### E2E-001: Agent Lead-to-Close Journey
1. Login as `test.agent@whitecaves.ae`
2. Create a new lead with phone, budget, property interest
3. Verify lead appears with "New" status and auto-calculated score
4. Update lead status to "Qualified"
5. Log a call activity with outcome
6. Verify activity appears in timeline
7. Create a transaction linked to the lead
8. Change transaction to "Closed"
9. Verify commission record created automatically

**Pass criteria:** All steps complete without errors; commission created with correct amount.

---

### E2E-002: Manager Pipeline Review
1. Login as `test.manager@whitecaves.ae`
2. Navigate to Clara CRM pipeline view
3. Verify all team leads visible (not just own)
4. Filter by status = "Negotiating"
5. Click a lead and view activity timeline
6. Reassign lead to a different agent
7. Verify reassignment activity logged

---

### E2E-003: Finance Commission Approval
1. Login as `test.finance@whitecaves.ae`
2. Navigate to Finance → Commissions
3. Filter by status = "Approved"
4. Select multiple commissions
5. Bulk mark as "Paid" with payment date and reference
6. Verify status changes to "Paid"
7. Verify agent notification (check notification panel)

---

### E2E-004: Property Listing with RERA Compliance
1. Login as admin
2. Create new property in Mary CRM
3. Attempt to set status = "Available" → expect error (no permit)
4. Add RERA permit number and expiry date
5. Set status = "Available" → expect success
6. Verify property appears in public property list

---

### E2E-005: Tenant Application + Ejari Activation
1. Login as leasing agent
2. Create tenant application with required documents
3. Update KYC status to "Verified" as compliance officer
4. Create lease for the tenant
5. Attempt to activate lease without Ejari → expect error
6. Add Ejari contract number
7. Activate lease → expect success

---

### E2E-006: WhatsApp Inbox Navigation (UI-only)
1. Login as sales agent
2. Navigate to WhatsApp Dashboard
3. Verify conversation list loads
4. Open a conversation
5. Verify message thread visible
6. Open template picker and preview a template

---

### E2E-007: Owner Executive Dashboard
1. Login as owner
2. Navigate to Zoe Executive Dashboard
3. Verify KPI cards: leads, transactions, pipeline value
4. Switch period selector to "This Quarter"
5. Verify numbers update
6. Navigate to finance summary

---

### E2E-008: System Health (Aurora)
1. Login as owner/admin
2. Navigate to System Health page
3. Verify API status indicators shown
4. Verify recent activity feed loads

---

### E2E-009: Lead Import from Excel
1. Login as manager
2. Navigate to Lead Management
3. Click Import
4. Upload test Excel file (provided in test data)
5. Map columns
6. Confirm import
7. Verify imported leads appear in list

---

### E2E-010: Access Control Enforcement
1. Login as `test.agent@whitecaves.ae`
2. Attempt to navigate to Finance dashboard URL directly
3. Verify redirect to "Access Denied" or dashboard

---

## 6. Performance Test Plan

### 6.1 Test Scenarios

| Scenario | Tool | Target | Pass Criteria |
|---------|------|--------|--------------|
| API: GET /leads (100 users concurrent) | k6 | p95 < 300 ms | PASS if p95 < 300 ms |
| API: POST /leads (50 users concurrent) | k6 | p95 < 500 ms | PASS if p95 < 500 ms |
| API: GET /properties (200 concurrent) | k6 | p95 < 400 ms | PASS if p95 < 400 ms |
| Dashboard aggregate (50 concurrent) | k6 | p95 < 800 ms | PASS if p95 < 800 ms |
| Frontend cold load (Lighthouse) | Lighthouse | < 3 s LCP | Score ≥ 90 performance |
| WhatsApp webhook (100 msg/sec) | k6 | 100% within 5 sec | 0 timeouts |

---

## 7. Security Test Checklist

| Check | Tool | Priority |
|-------|------|---------|
| SQL/NoSQL injection on all inputs | OWASP ZAP + manual | Critical |
| XSS via stored fields (names, notes, etc.) | OWASP ZAP | Critical |
| JWT manipulation (alg:none, key confusion) | Manual | Critical |
| IDOR: access another user's leads by ID | Manual | Critical |
| Rate limit bypass via X-Forwarded-For | Manual | High |
| CORS: ensure non-whitelisted origins blocked | Curl tests | High |
| HTTPS downgrade (HSTS check) | SSLLabs | High |
| File upload: malicious file type | Manual | High |
| Password enumeration via login timing | Manual | Medium |
| Mass assignment via extra body fields | Manual | Medium |

---

## 8. Regression Test Suite

The following tests must pass on every PR merge to `main`:
1. All unit tests (`npm test`)
2. All API integration tests
3. E2E-001 through E2E-008 (critical path only)
4. TypeScript type checking (`tsc --noEmit`)
5. ESLint (zero errors)

---

## 9. Entry and Exit Criteria

### Entry Criteria (to start testing)
- Feature branch merged to staging
- All unit tests pass in CI
- Staging database seeded with test data
- Test environment healthy (API responds to health check)

### Exit Criteria (to approve release)
- All unit tests pass: 0 failures
- Integration test suite: 0 failures
- Critical E2E tests (E2E-001 to E2E-010): 100% pass
- No open P1 or P2 defects
- Performance benchmarks met
- Security scan: no critical/high vulnerabilities
- UAT sign-off from product owner (see UAT Scenarios doc)

---

## 10. Defect Management

### Severity Levels

| Severity | Description | Response SLA | Example |
|---------|-------------|-------------|---------|
| P1 — Critical | System down or data loss | Fix within 4 hours | Login broken for all users |
| P2 — High | Core feature broken | Fix within 24 hours | Lead creation fails |
| P3 — Medium | Non-critical feature broken | Fix within 72 hours | Filter not working |
| P4 — Low | Cosmetic or minor | Next sprint | Wrong colour on button |

### Defect Lifecycle
```
Reported → Triaged (P1-P4) → Assigned to Developer → 
Fixed → Code Review → Tested → Closed
```

---

**Document ID:** WC-TP-001 | **Version:** 1.0 | **Date:** March 2026
