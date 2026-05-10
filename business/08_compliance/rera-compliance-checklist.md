# RERA Compliance Checklist

# White Caves Real Estate LLC

> **Document ID:** WC-RERA-001
> **Version:** 1.0
> **Date:** April 2026
> **Status:** Active — Reviewed Annually
> **Owner:** Compliance Department (Laila — Compliance & Legal Officer)
> **Regulatory Authority:** Real Estate Regulatory Agency (RERA), Dubai Land Department (DLD)
> **Legal Basis:** Law No. 16 of 2007 (Real Estate Brokerage Activities), RERA Regulations

---

## 1. Company Registration Requirements

| Requirement                      | Details                          | Status        | Renewal Date |
| -------------------------------- | -------------------------------- | ------------- | ------------ |
| Real Estate Brokerage License    | DED (Dubai Economy & Tourism)    | ☐ Verify      | Annual       |
| RERA Brokerage Registration      | Certificate from RERA            | ☐ Verify      | Annual       |
| Trade License (DED)              | Dubai commercial license         | ☐ Verify      | Annual       |
| VAT Registration (TRN)           | Federal Tax Authority            | ☐ Verify      | N/A          |
| Office registered with RERA      | Physical office address recorded | ☐ Verify      | Annual       |
| ORN (Office Registration Number) | Unique RERA identifier           | ☐ Confirm ORN | N/A          |

---

## 2. Agent License Requirements

All agents representing White Caves must meet these requirements before handling any client:

| Requirement                               | Standard                    | Verification             |
| ----------------------------------------- | --------------------------- | ------------------------ |
| RERA BRN (Broker Registration Number)     | Valid, active               | Check RERA portal or app |
| DREI training completed                   | Dubai Real Estate Institute | Certificate on file      |
| Broker exam passed                        | Score ≥ 75%                 | DREI certificate         |
| CPD (Continuing Professional Development) | 8 hours/year                | Annual CPD log           |
| Emirates ID                               | Valid                       | On file in CRM           |
| UAE Residence Visa                        | Valid                       | On file in CRM           |
| Good conduct certificate                  | Dubai Police clearance      | On file                  |

**CRM Action:** All agent BRNs to be recorded in `User.reraLicense` field (Phase 9 — add field to schema).

**Platform Rule:** No agent without valid RERA BRN can be assigned leads or publish listings.

---

## 3. Property Listing Compliance

### 3.1 Pre-Listing Requirements

| Requirement                          | Rule                                    | Platform Action                                 |
| ------------------------------------ | --------------------------------------- | ----------------------------------------------- |
| Form A (Exclusive Listing Authority) | Signed by property owner before listing | Upload to CRM before listing status → PUBLISHED |
| RERA Permit Number                   | Required for all listings               | Property form: required field (Phase 5)         |
| Permit valid + not expired           | RERA portal verification                | API check on permit number (Phase 5)            |
| Permit matches property              | Permit is for this specific property    | Agent confirms + logs                           |
| Owner identity verified              | Match passport to title deed name       | Agent confirms + documents                      |
| Title deed copy                      | Valid, in agent's file                  | Upload to CRM                                   |

### 3.2 Advertisement Requirements

| Requirement                   | RERA Rule                           | Platform Implementation           |
| ----------------------------- | ----------------------------------- | --------------------------------- |
| RERA permit number visible    | Must appear in all ads              | Auto-included in listing display  |
| Agent BRN visible             | Must appear in ads                  | Auto-included in listing display  |
| Company ORN visible           | Must appear in ads                  | Auto-included in portal feeds     |
| Accurate price                | Within 5% of listed price           | Price change requires re-approval |
| Accurate photos               | Must be actual property             | Compliance officer spot-checks    |
| No misleading claims          | "Sea view" must be genuine sea view | Content review before publish     |
| No unlicensed agent marketing | Only BRN-verified agents            | Platform RBAC enforcement         |

### 3.3 Off-Plan Listing Requirements

| Requirement                 | Details                                                         |
| --------------------------- | --------------------------------------------------------------- |
| Developer NOC               | RERA no-objection certificate for White Caves to market project |
| Project registration number | From DLD/RERA escrow registration                               |
| Escrow account details      | Developer escrow account number                                 |
| Completion date             | Officially registered delivery date                             |
| Payment plan                | Exact payment schedule per SPA                                  |
| Form F                      | Off-plan sales agreement template                               |

---

## 4. Transaction Compliance

### 4.1 Sales Transaction (Ready Properties)

| Step                              | Requirement                                  | Documents           |
| --------------------------------- | -------------------------------------------- | ------------------- |
| Pre-sale                          | Form A signed (listing authority)            | Form A PDF          |
| Client agreement                  | Form B (buyer representation) or Form F      | Signed form         |
| Offer                             | Written offer submitted                      | Email / CRM record  |
| MOU (Memorandum of Understanding) | Non-binding heads of terms                   | Signed MOU          |
| NOC application                   | Developer NOC (if in managed community)      | NOC from developer  |
| Mortgage (if applicable)          | Bank pre-approval                            | Pre-approval letter |
| SPA                               | Sales & Purchase Agreement                   | Signed SPA          |
| DLD transfer                      | Transfer at DLD Trustee office               | Title deed transfer |
| Payment                           | Buyer pays 4% transfer fee + AED 4,000 admin | DLD receipt         |
| Title deed                        | New title deed issued in buyer's name        | Title deed copy     |

### 4.2 Rental Transaction

| Step               | Requirement                             | Documents          |
| ------------------ | --------------------------------------- | ------------------ |
| Listing            | Form A (rental authority from landlord) | Form A PDF         |
| Offer              | Written rental offer                    | CRM record         |
| Lease agreement    | RERA-approved lease template            | Signed lease       |
| Security deposit   | Receipt issued to tenant                | Deposit receipt    |
| Post-dated cheques | Cheques collected, dated, receipted     | Cheque copies      |
| Ejari registration | Within 30 days of tenancy start         | Ejari certificate  |
| Commission         | Agent collects from landlord (5%)       | Commission receipt |

---

## 5. RERA Forms Reference

| Form   | Name                                     | Purpose                          | When Required                            |
| ------ | ---------------------------------------- | -------------------------------- | ---------------------------------------- |
| Form A | Exclusive Sales/Rental Listing Authority | Owner authorises agent to market | Before listing any property              |
| Form B | Buyer/Tenant Representation              | Buyer authorises agent to act    | At start of property search              |
| Form F | Off-Plan Sales Agreement                 | Off-plan purchase contract       | Every off-plan sale                      |
| Form I | Agent-to-Agent sharing agreement         | Co-brokerage                     | When sharing listing with another agency |
| Form U | Unilateral Listing                       | Non-exclusive listing            | When exclusivity not given               |

---

## 6. Advertising Compliance Rules (RERA Circular)

| Rule                                                      | Penalty for Violation |
| --------------------------------------------------------- | --------------------- |
| Cannot advertise a property without Form A                | Fine up to AED 50,000 |
| Cannot advertise without valid RERA permit                | Fine + suspension     |
| Cannot use "under offer" when property is still available | Fine                  |
| Cannot advertise a sold property as available             | Fine                  |
| Cannot omit agent BRN from advertisement                  | Warning + fine        |
| Cannot use misleading area claims                         | Fine                  |
| Cannot use AI-generated property photos presented as real | Fine                  |

---

## 7. Annual RERA License Renewal Checklist

Complete 60 days before license expiry:

```
License Renewal Steps:
☐ Confirm renewal date (calendar reminder 90 + 60 + 30 days before)
☐ All agents: CPD hours completed (8 hours/year minimum)
☐ All agents: BRN renewal applications submitted
☐ Company: DED trade license renewal
☐ Company: RERA brokerage certificate renewal
☐ Company: Update company profile on RERA portal
☐ Pay renewal fees (DED + RERA)
☐ Upload new certificates to CRM
☐ Update agent BRN records in platform
```

---

## 8. Dubai Land Department (DLD) Requirements

| Requirement                   | Details                                               |
| ----------------------------- | ----------------------------------------------------- |
| All sales registered          | Every property sale must be DLD-registered            |
| Transfer fee                  | 4% of sale price (buyer pays)                         |
| NOC from developer            | Required for apartments/villas in managed communities |
| Mortgage clearance            | Letter from bank if seller's property is mortgaged    |
| Title deed verification       | Verify title deed authenticity at DLD                 |
| Owner identity                | ID documents match title deed                         |
| DLD registration fee (rental) | AED 220 + VAT for Ejari                               |

---

## 9. Ejari Registration Requirements

| Requirement            | Details                                            | Timing                    |
| ---------------------- | -------------------------------------------------- | ------------------------- |
| All residential leases | Must be Ejari registered                           | Within 30 days of start   |
| Commercial leases      | Must be Ejari registered                           | Within 30 days            |
| Sub-leases             | Require original lease + sublease to be registered | Before sublease start     |
| Renewal leases         | New Ejari registration required                    | Within 30 days of renewal |
| Documents required     | Lease, passports, Emirates IDs, title deed         | At registration           |
| Fee                    | AED 220 + VAT                                      | Per registration          |

**Platform Action:** Ejari number stored on `Lease.ejariNumber`. Certificate stored in both portals. Auto-reminder if lease active > 30 days without Ejari number.

---

## 10. RERA Audit Preparation

If RERA conducts an audit of White Caves, the following must be available within 24 hours:

```
Audit Documents Checklist:
☐ Company RERA brokerage certificate (valid)
☐ Company DED trade license (valid)
☐ List of all licensed agents + their valid BRNs
☐ All Form As on file (matching active listings)
☐ All Form Bs on file (matching client relationships)
☐ Sample SPAs (last 12 months)
☐ Commission receipts (last 12 months)
☐ Ejari certificates for all active leases
☐ Advertisement samples with RERA permit numbers visible
☐ AML/KYC records for all transactions > AED 55,000
☐ SAR register (if any SARs filed)
```

---

**Document Owner:** Compliance Department (Laila)
**Review Cycle:** Annually + when RERA regulations change
**Related:** `business/06_flowcharts/compliance-kyc-aml-flow.md`, `business_docs/05_requirements/compliance-requirements.md`

---

## 11. Trakheesi Permit Management

Trakheesi is RERA's online system for issuing advertising permits for property listings. Every property listing must have a valid Trakheesi permit before it can be advertised on any channel.

### 11.1 What is a Trakheesi Permit?

| Field             | Details                                                                 |
| ----------------- | ----------------------------------------------------------------------- |
| Issuing authority | RERA (Real Estate Regulatory Agency)                                    |
| Purpose           | Authorise agents to advertise a specific property                       |
| Validity          | 3 months (renewable)                                                    |
| Cost              | AED 10 per property (approx.)                                           |
| Coverage          | All advertising channels: online portals, social media, print, WhatsApp |
| System            | trakheesi.rera.gov.ae                                                   |

### 11.2 Step-by-Step Process to Obtain a Permit

```
Step 1: Obtain Form A (Listing Authority from Owner)
   └── Must be signed before applying for permit

Step 2: Log in to trakheesi.rera.gov.ae
   └── Company account (agent logs in with company credentials)

Step 3: Submit permit application
   ├── Property details: DLD parcel number, community, unit number
   ├── Property owner details: Name, passport/Emirates ID
   ├── Agent BRN: Must be valid and active
   └── Upload: Form A (signed), Title deed copy

Step 4: RERA reviews and issues permit
   └── Processing time: 1-3 business days (expedited: same day for urgent)

Step 5: Receive permit number
   └── Format: [Year]-[Sequence Number] e.g., 2026-0123456

Step 6: Add permit number to all listings
   └── CRM: Property.permitNumber field (required for PUBLISHED status)
   └── All ads: Must display permit number prominently
```

### 11.3 Permit Validity and Renewal

| Event                   | Action                                                           |
| ----------------------- | ---------------------------------------------------------------- |
| 30 days before expiry   | System auto-reminder to agent + compliance officer               |
| Permit expires          | Listing auto-unpublished from website and portal feeds (Phase 5) |
| Property sold / rented  | Permit expires automatically; new permit needed if relisted      |
| Price change            | Existing permit remains valid (price update logged)              |
| Property details change | New permit required if fundamental details change                |

### 11.4 CRM Integration (Phase 5)

- `Property.permitNumber` — required field for PUBLISHED status
- `Property.permitExpiry` — date field, auto-populated from Trakheesi API
- Automated check: daily cron job queries Trakheesi API for permit status
- Auto-unpublish: if `permitExpiry < today OR permitStatus != ACTIVE` → `Property.status = PERMIT_EXPIRED`
- Agent notification: WhatsApp alert 30 days before expiry (Nina — WhatsApp bot)

### 11.5 Compliance Consequences of Permit Violations

| Violation                                 | RERA Penalty                           | White Caves Response                                 |
| ----------------------------------------- | -------------------------------------- | ---------------------------------------------------- |
| Advertising without permit                | Fine AED 2,000–50,000 per violation    | Immediate takedown + agent investigation             |
| Using expired permit                      | Fine + permit suspension               | Auto-system prevention + compliance review           |
| Transferring permit to different property | Void + fine                            | Prohibited in system (permit tied to property ID)    |
| Forged permit number                      | Criminal referral + license suspension | Zero tolerance — immediate termination + RERA report |

---

## 12. RERA Inspection & Audit Procedures

### 12.1 What Triggers a RERA Inspection

| Trigger                                         | Probability | Response Time Given       |
| ----------------------------------------------- | ----------- | ------------------------- |
| Client complaint to RERA                        | High        | 5–10 business days notice |
| Competitor complaint                            | Medium      | 5–10 business days notice |
| Routine compliance audit (annual)               | Certain     | 30 days notice            |
| Random spot check                               | Low         | No notice                 |
| Advertising violation detected by RERA monitors | Medium      | Immediate (enforcement)   |

### 12.2 Inspection Preparation Checklist (30-Day Notice)

```
WEEK 1 — Document Audit:
☐ Pull all Form As issued in last 12 months — verify each matches an active/completed listing
☐ Pull all Form Bs issued in last 12 months — verify each matches a client transaction
☐ Verify all agents have valid BRNs (RERA portal check for each)
☐ Verify all active listings have valid Trakheesi permits
☐ Pull sample SPAs + MOU from last 12 months (aim for 5 complete files)
☐ Pull Ejari certificates for all active tenancies
☐ Compile AML/KYC file for all transactions > AED 55,000

WEEK 2 — Reconciliation:
☐ Match commission receipts to transactions (no unexplained receipts)
☐ Check all advertisements show: permit number, agent BRN, company ORN
☐ Verify no "sold" properties still advertised as available
☐ Check all agents listed on RERA portal as employed by White Caves

WEEK 3 — Physical Office:
☐ Company license displayed prominently in office
☐ Agent certificates/BRN cards displayed at agent workstations
☐ RERA Code of Ethics displayed
☐ Physical Form A templates available and correctly formatted

WEEK 4 — Final Review:
☐ Compliance officer internal mock audit
☐ Address any gaps identified
☐ Brief MD on status and any known issues
☐ Prepare auditor welcome pack (index of all documents)
```

### 12.3 During the Inspection

```
When RERA inspectors arrive:
1. Welcome professionally — offer designated meeting room
2. Request inspector IDs and note their names/employee numbers
3. Do NOT provide documents before confirming their authority
4. Have Compliance Officer (Laila) present throughout
5. Do NOT allow inspectors to access CRM system unaccompanied
6. Take copies of everything handed to inspectors
7. Note every request and your response in writing
8. Do NOT volunteer information beyond what is requested
9. If unsure about a question — "I need to verify and come back to you"
10. After inspection: send written summary of documents provided + any commitments made
```

### 12.4 Post-Inspection Actions

| Timeframe                | Action                                                 |
| ------------------------ | ------------------------------------------------------ |
| Same day                 | Document everything discussed and provided             |
| 5 business days          | Respond to any inspector queries or document requests  |
| If fine issued           | Assess whether to pay or appeal (28-day appeal window) |
| If recommendation issued | Implement within RERA's specified timeframe            |
| 30 days                  | Internal post-inspection review with MD                |

### 12.5 RERA Fines Appeal Process

If a fine is issued:

1. Review fine notice carefully — confirm charge and basis
2. Consult legal counsel (within 7 days)
3. If appealing: submit formal appeal to RERA Complaints Department within 28 days
4. Provide: written appeal, supporting evidence, legal argument
5. RERA responds within 30 working days
6. If appeal rejected: option to refer to Dubai courts within 30 days of RERA decision

---

## 13. Off-Plan RERA Requirements

### 13.1 Developer Registration (Oqood)

| Requirement            | Details                                                                           |
| ---------------------- | --------------------------------------------------------------------------------- |
| Oqood registration     | All off-plan sales must be registered in Oqood (DLD online system) within 30 days |
| Registration fee       | 4% of property value (DLD fee — buyer pays)                                       |
| Project registration   | Developer must register project with DLD before White Caves can market            |
| Escrow account         | Developer must have RERA-approved escrow account per project                      |
| Construction milestone | % completion milestones define when installments can be called                    |

### 13.2 Agent Obligations for Off-Plan Sales

| Obligation               | Requirement                                                      | Timing                |
| ------------------------ | ---------------------------------------------------------------- | --------------------- |
| Verify developer NOC     | RERA NOC confirming White Caves authorised to market the project | Before any marketing  |
| Confirm escrow account   | Verify developer escrow account number with RERA                 | Before SPA signing    |
| Use RERA Form F          | Off-plan SPA must use RERA-approved Form F template              | Every off-plan sale   |
| Oqood registration       | Assist buyer in completing Oqood registration (DLD facilitates)  | Within 30 days of SPA |
| Disclose payment plan    | Full payment schedule disclosed in writing before SPA            | Before SPA signing    |
| Disclose completion date | Registered completion date (not estimated) from DLD records      | Before SPA signing    |
| Handover clause          | Explain buyer's rights if developer delays/defaults              | Before SPA signing    |

### 13.3 Buyer Protections in Off-Plan Sales (RERA Law No. 8 of 2007)

| Protection            | Detail                                                                              |
| --------------------- | ----------------------------------------------------------------------------------- |
| Full refund           | Buyer entitled to full refund if developer cancels project                          |
| Partial refund        | If developer defaults, buyer receives back 30–40% of paid amounts                   |
| DLD mediation         | Buyer can apply to DLD Rental Dispute Settlement Centre if developer non-performing |
| RERA escrow oversight | RERA monitors developer escrow — can freeze if misused                              |
| Completion guarantee  | Developer must complete as per Oqood registration or face DLD sanctions             |

**Agent Responsibility:** Always advise buyers to conduct their own due diligence. White Caves should not recommend a developer project unless RERA records confirm project is registered and developer is in good standing.

### 13.4 Off-Plan Listing Checklist

```
Before publishing any off-plan listing:
☐ Developer NOC issued specifically for White Caves
☐ Project registered in DLD Oqood system (verify online)
☐ Developer escrow account number confirmed with RERA
☐ Trakheesi permit obtained for this specific unit/phase
☐ Completion date taken from DLD records (not developer marketing material)
☐ Full payment plan documented (from SPA template)
☐ Form F template obtained from RERA/developer
☐ All advertisements show: permit number, project Oqood reference, developer name
```

---

## 14. RERA Complaints & Dispute Resolution

### 14.1 Client Complaint Process

All client complaints must be handled within defined timelines:

| Step | Action                                                         | Timeline                      |
| ---- | -------------------------------------------------------------- | ----------------------------- |
| 1    | Client submits complaint (email, WhatsApp, phone, RERA portal) | Day 0                         |
| 2    | Acknowledge receipt + assign to agent's manager                | Within 4 hours                |
| 3    | Investigate: review CRM records, communications, documents     | Within 3 business days        |
| 4    | Proposed resolution communicated to client                     | Within 5 business days        |
| 5    | If accepted: implement resolution + confirm in writing         | Within 10 business days total |
| 6    | If rejected: escalate to MD for final decision                 | Day 10                        |
| 7    | If still unresolved: inform client of RERA complaint option    | Day 15                        |

**RERA Complaint Hotline:** 800-RERA (800-7372)
**RERA Online Complaints:** www.dubailand.gov.ae/en/complaints

### 14.2 Rental Dispute Settlement Centre (RDSC)

For landlord-tenant disputes that cannot be resolved bilaterally:

| Stage       | Process                                                   | Timeline                 |
| ----------- | --------------------------------------------------------- | ------------------------ |
| Filing      | Either party files at RDSC (Deira, Dubai Courts building) | Anytime                  |
| Case review | RDSC reviews case + schedules hearing                     | 7–14 days                |
| Mediation   | Mediator attempts settlement                              | Hearing day              |
| Judgment    | RDSC judge issues binding order if mediation fails        | Within 30 days of filing |
| Enforcement | Court enforcement if losing party non-compliant           | Via Dubai Courts         |

**White Caves Role:** Support client (landlord or tenant) with documentation. Do NOT take sides in landlord-tenant disputes — provide factual CRM records only.

**RDSC Fees:** AED 3,500 per case (approx.), split at RDSC discretion.

### 14.3 DLD Dispute Resolution (Sales Transactions)

For sale transaction disputes (buyer vs. seller, agent fee disputes):

| Path        | Mechanism                                     | Timeline    |
| ----------- | --------------------------------------------- | ----------- |
| Mediation   | DLD Real Estate Affairs department mediates   | 15–30 days  |
| Arbitration | Dubai International Arbitration Centre (DIAC) | 3–6 months  |
| Litigation  | Dubai Courts (civil case)                     | 6–18 months |

**Commission Disputes:** If a client disputes White Caves' commission, RERA can arbitrate based on signed Form A/B and commission receipt. Always have signed commission agreement before transaction.

---

## 15. RERA Digital Compliance

### 15.1 Daily Agent Tasks on RERA Portal (REST)

| Task                        | Frequency          | Portal Action                    |
| --------------------------- | ------------------ | -------------------------------- |
| Check BRN status            | Weekly             | My Profile → BRN Status          |
| Check CPD hours log         | Monthly            | Professional Development → Hours |
| Submit new Form A digitally | Per listing        | Transactions → New Form A        |
| Check permit status         | Per active listing | Permits → Search by property     |
| View inspection notices     | Daily              | Notifications                    |

### 15.2 RERA App Features

The RERA mobile app provides agents with:

- Real-time BRN verification (scan QR code → verify any agent's license)
- Property permit lookup (enter permit number → verify validity)
- Market data (avg. prices by area — useful for client consultations)
- Broker directory (find other licensed brokers)
- Complaint submission (clients can complain directly in-app)

### 15.3 Digital Form A Submission

From 2025, RERA accepts digital Form A submissions:

- Submitted via RERA REST portal (trakheesi.rera.gov.ae)
- Agent digitally signs using UAE PASS (national digital identity)
- Owner signs via email link (UAE PASS optional)
- Timestamped + reference number issued by RERA
- Legally equivalent to paper Form A
- Platform integration: Phase 5 — White Caves CRM generates pre-filled Form A → agent submits via API

### 15.4 RERA Record Keeping Requirements

| Record Type                    | Retention Period                         | Format Acceptable    |
| ------------------------------ | ---------------------------------------- | -------------------- |
| Form A (all)                   | As long as RERA license active + 5 years | Digital (signed PDF) |
| Form B (all)                   | As above                                 | Digital              |
| Transaction records (SPA, MOU) | 7 years                                  | Digital or physical  |
| Commission receipts            | 7 years                                  | Digital              |
| AML/KYC files                  | 5 years from last activity               | Digital (encrypted)  |
| Complaint records              | 5 years                                  | Digital              |
| Training certificates          | Active license period                    | Digital              |

---

**Document Owner:** Compliance Department (Laila)
**Version History:** v1.0 April 2026 (initial); next review due April 2027
**Review Cycle:** Annually + whenever RERA issues new circulars
**Related Documents:**

- `business/06_flowcharts/compliance-kyc-aml-flow.md`
- `business/08_compliance/aml-risk-assessment.md`
- `business_docs/05_requirements/compliance-requirements.md`
- RERA website: www.rera.gov.ae
- Dubai Land Department: www.dubailand.gov.ae
