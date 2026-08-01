# RUP Technology Replacement Rules & Fallback Manifest

**Document Class:** TRR-001 (Tech Replacement Rules)  
**Module:** System Architecture & Infrastructure Upgrades  
**Version:** 2026.08-TRR-V1  
**Owner:** @Grace (CTO) + @Ada (Chief Architect)  
**Status:** ✅ Active — Master Governance  

---

## 1. Domain Architectural Upgrades & Fallback Matrix

| Corporate Domain | Current Engine | Target Technology | Fallback Mechanism | Upgrade Status |
|------------------|----------------|-------------------|--------------------|----------------|
| **01. Executive Management** | Level 5 JWT Claims | Role-Based Hydration | Founder Email Bypass (`arslanmalikgoraha@gmail.com`) | ✅ **OPERATIONAL** |
| **02. Leasing & PM** | Ejari Manual Checks | Ejari API + 95-Day Churn Engine | Local Lease Cache (`src/mocks/`) | ✅ **OPERATIONAL** |
| **03. AI & Integrations** | Webhook Direct | Nadia & Sentinel Multi-Node Queue | Fallback Persona Handlers | ✅ **OPERATIONAL** |
| **04. Operations & Maintenance** | Ticket Table | DAMAC Hills 2 30-Min SLA Dispatch | Local Maintenance Registry | ✅ **OPERATIONAL** |
| **05. Legal & Compliance** | Static PDF Templates | Form A, B, I, 7, 12 Conveyancing Engine | Hardcoded Legal Contract Schemas | ✅ **OPERATIONAL** |
| **06. Architecture & UX** | Mixed Styling | 3-Folder Isolation (`*.tsx`, `*.logic.ts`, `*.style.ts`) | Design System CSS Tokens (`var(--wc-*)`) | ✅ **OPERATIONAL** |
| **07. Business & Finance** | Manual Calculations | 5% VAT + 4% DLD Settlement Engine | Pre-Calculated Local Yield Tables | ✅ **OPERATIONAL** |
| **08. Research & Market Data** | Static Listings | Real-Time Market Pulse DLD Open Data | Mock 9,378-Unit Data Ledgers | ✅ **OPERATIONAL** |
| **09. Sales & CRM** | Static Lists | 4-Column Drag & Drop Lead Board | Local Storage State Sync | ✅ **OPERATIONAL** |
| **10. Security & Quality** | Basic Auth | Sentinel Smart Lock Viewing Audit | Local Access Token Persistence | ✅ **OPERATIONAL** |
| **11. SEO & Marketing** | Manual Metadata | Olivia AI Property Storyteller | Static Meta Tags & Descriptions | ✅ **OPERATIONAL** |
| **12. Systems & Release** | Custom Scripts | RUP 4-Tier Automated CI/CD Hooks | Local Validation Script Suite | ✅ **OPERATIONAL** |

---

## 2. 0-Token Build & Debugging Rule

1. **Local Processor Execution**: All TypeScript compilation errors must be evaluated locally via `npm run build` or `npm run typecheck`.
2. **Error Dump Routing**: Local build logs are output to `.tmp_typecheck_out.txt` and evaluated without sending untruncated logs into AI context.
