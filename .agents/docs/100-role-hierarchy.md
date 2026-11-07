# White Caves Real Estate LLC — 100-Role Corporate Hierarchy & Department Matrix

**Version:** 2026.07-CORP-V1  
**Authority:** Executive Council (@Ada, @Zoe)  
**Last Updated:** 2026-07-27  
**Governance Standard:** [business_docs/README.md](../README.md)

---

## 🏛️ 10 Registered Corporate Departments

White Caves Real Estate LLC operates across 10 specialized functional domains:

1. **Executive Council (EX)**: Strategic leadership, architectural sign-off, capital allocation, governance oversight.
2. **Sales & Secondary Market (SL)**: Off-plan advisory, luxury residential sales, commercial transactions, secondary resale.
3. **Leasing & Property Management (LM)**: Tenancy agreements, Ejari registrations, landlord portfolio management, rent collection.
4. **Operations & Facility Management (OP)**: DAMAC Hills 2 spatial unit management (9,378+ units), maintenance dispatch, IoT sensors.
5. **Finance & Accounting (FN)**: Multi-currency treasury (AED/USD/EUR/GBP/SAR), escrow accounts, UAE FTA 5% VAT filing, AR aging.
6. **Compliance, Legal & Regulatory (CL)**: RERA broker licensing, DLD Form 7/12/6 filings, AML background checks, PDPL data privacy.
7. **Marketing & Growth (MK)**: Performance campaigns, CPL density mapping, luxury brand positioning, digital acquisition.
8. **Communications & Client Care (CC)**: Unified 23+ WhatsApp stream, Nadia AI lead qualification, 15-min SLA clocks.
9. **Technology & Engineering (TE)**: Full-stack platform maintenance, Redux store architecture, PWA offline sync engine.
10. **AI & Data Intelligence (AI)**: Sentinel IoT heatmaps, Zoe investment forecasting, AVM valuation models.

---

## 📊 100-Role Corporate Hierarchy Matrix

| Role ID | Role Title                              | Department | Level | Access Scope                 | Primary System Responsibility |
| ------- | --------------------------------------- | ---------- | ----- | ---------------------------- | ----------------------------- |
| R-001   | Founder & Managing Director             | Executive  | 5     | Global Master (`LEVEL_5`)    | System superuser, full flight deck |
| R-002   | Chief Executive Officer (CEO)           | Executive  | 5     | Global Master (`LEVEL_5`)    | Executive sign-off, strategic growth |
| R-003   | Chief Operating Officer (COO)           | Executive  | 4     | Executive Dept (`LEVEL_4`)   | Cross-department WIP & SLA enforcement |
| R-004   | Chief Technology Officer (CTO)          | Technology | 4     | Tech & Eng (`LEVEL_4`)       | Platform architecture, API scaling |
| R-005   | Chief Financial Officer (CFO)           | Finance    | 4     | Finance Dept (`LEVEL_4`)     | Treasury, escrow, VAT compliance |
| R-006   | Chief Compliance Officer (CCO)          | Compliance | 4     | Compliance Dept (`LEVEL_4`)  | RERA & DLD regulatory compliance |
| R-007   | VP of Luxury Sales                      | Sales      | 4     | Sales Dept (`LEVEL_4`)       | Off-plan portfolio & broker targets |
| R-008   | VP of Leasing Operations                | Leasing    | 4     | Leasing Dept (`LEVEL_4`)     | Ejari portfolio & landlord management |
| R-009   | Head of Digital Marketing               | Marketing  | 4     | Marketing Dept (`LEVEL_4`)   | Campaign ROI, CPL optimization |
| R-010   | Head of AI & Data Science               | AI Intel   | 4     | AI Dept (`LEVEL_4`)          | AVM models, Sentinel IoT engine |
| R-011   | Senior Director — Commercial Real Estate| Sales      | 3     | Power User (`LEVEL_3`)       | Commercial leases & sales deals |
| R-012   | Senior Director — Residential Off-Plan | Sales      | 3     | Power User (`LEVEL_3`)       | Emaar, DAMAC, Nakheel launch deals |
| R-013   | Senior Director — Secondary Resales     | Sales      | 3     | Power User (`LEVEL_3`)       | Prime luxury villa resale portfolio |
| R-014   | Director of Landlord Relations          | Leasing    | 3     | Power User (`LEVEL_3`)       | High-net-worth landlord accounts |
| R-015   | Director of Property Maintenance        | Operations | 3     | Power User (`LEVEL_3`)       | Maintenance dispatches & SLA tracking |
| R-016   | Senior Financial Controller             | Finance    | 3     | Power User (`LEVEL_3`)       | UAE FTA quarterly VAT filing |
| R-017   | Head of Escrow & Payouts                | Finance    | 3     | Power User (`LEVEL_3`)       | Developer payout reconciliation |
| R-018   | Senior Legal Counsel                    | Compliance | 3     | Power User (`LEVEL_3`)       | Form 7 / Form 12 legal notices |
| R-019   | Head of AML & Sanctions                 | Compliance | 3     | Power User (`LEVEL_3`)       | PEP & AML background screening |
| R-020   | Principal System Architect              | Technology | 3     | Power User (`LEVEL_3`)       | Microservice & database scaling |
| R-021..R-050 | Senior Brokers & Dept Leads (30 Roles) | Mixed      | 3     | Power User (`LEVEL_3`)       | Deal execution & team management |
| R-051..R-080 | Associate Brokers & Specialists (30)  | Mixed      | 2     | Restricted User (`LEVEL_2`) | Assigned record CRUD operations |
| R-081..R-100 | Operations Support & Analysts (20)    | Mixed      | 1     | Read-Only User (`LEVEL_1`)  | System viewports & data entry |

---

## 🔐 System Role Mapping & Code Implementation

This 100-role matrix directly aligns with the Redux state hydration layer (`authSlice.tsx`) and the user permissions index (`src/types/auth.ts`). When authenticated as Level 5 Founder (`arslanmalikgoraha@gmail.com`), the application unlocks full administrative access across all 100 corporate roles simultaneously.
