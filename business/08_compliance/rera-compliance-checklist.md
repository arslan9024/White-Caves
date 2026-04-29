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

| Requirement | Details | Status | Renewal Date |
|------------|---------|--------|-------------|
| Real Estate Brokerage License | DED (Dubai Economy & Tourism) | ☐ Verify | Annual |
| RERA Brokerage Registration | Certificate from RERA | ☐ Verify | Annual |
| Trade License (DED) | Dubai commercial license | ☐ Verify | Annual |
| VAT Registration (TRN) | Federal Tax Authority | ☐ Verify | N/A |
| Office registered with RERA | Physical office address recorded | ☐ Verify | Annual |
| ORN (Office Registration Number) | Unique RERA identifier | ☐ Confirm ORN | N/A |

---

## 2. Agent License Requirements

All agents representing White Caves must meet these requirements before handling any client:

| Requirement | Standard | Verification |
|------------|---------|-------------|
| RERA BRN (Broker Registration Number) | Valid, active | Check RERA portal or app |
| DREI training completed | Dubai Real Estate Institute | Certificate on file |
| Broker exam passed | Score ≥ 75% | DREI certificate |
| CPD (Continuing Professional Development) | 8 hours/year | Annual CPD log |
| Emirates ID | Valid | On file in CRM |
| UAE Residence Visa | Valid | On file in CRM |
| Good conduct certificate | Dubai Police clearance | On file |

**CRM Action:** All agent BRNs to be recorded in `User.reraLicense` field (Phase 9 — add field to schema).

**Platform Rule:** No agent without valid RERA BRN can be assigned leads or publish listings.

---

## 3. Property Listing Compliance

### 3.1 Pre-Listing Requirements

| Requirement | Rule | Platform Action |
|------------|------|----------------|
| Form A (Exclusive Listing Authority) | Signed by property owner before listing | Upload to CRM before listing status → PUBLISHED |
| RERA Permit Number | Required for all listings | Property form: required field (Phase 5) |
| Permit valid + not expired | RERA portal verification | API check on permit number (Phase 5) |
| Permit matches property | Permit is for this specific property | Agent confirms + logs |
| Owner identity verified | Match passport to title deed name | Agent confirms + documents |
| Title deed copy | Valid, in agent's file | Upload to CRM |

### 3.2 Advertisement Requirements

| Requirement | RERA Rule | Platform Implementation |
|------------|----------|------------------------|
| RERA permit number visible | Must appear in all ads | Auto-included in listing display |
| Agent BRN visible | Must appear in ads | Auto-included in listing display |
| Company ORN visible | Must appear in ads | Auto-included in portal feeds |
| Accurate price | Within 5% of listed price | Price change requires re-approval |
| Accurate photos | Must be actual property | Compliance officer spot-checks |
| No misleading claims | "Sea view" must be genuine sea view | Content review before publish |
| No unlicensed agent marketing | Only BRN-verified agents | Platform RBAC enforcement |

### 3.3 Off-Plan Listing Requirements

| Requirement | Details |
|------------|---------|
| Developer NOC | RERA no-objection certificate for White Caves to market project |
| Project registration number | From DLD/RERA escrow registration |
| Escrow account details | Developer escrow account number |
| Completion date | Officially registered delivery date |
| Payment plan | Exact payment schedule per SPA |
| Form F | Off-plan sales agreement template |

---

## 4. Transaction Compliance

### 4.1 Sales Transaction (Ready Properties)

| Step | Requirement | Documents |
|------|------------|----------|
| Pre-sale | Form A signed (listing authority) | Form A PDF |
| Client agreement | Form B (buyer representation) or Form F | Signed form |
| Offer | Written offer submitted | Email / CRM record |
| MOU (Memorandum of Understanding) | Non-binding heads of terms | Signed MOU |
| NOC application | Developer NOC (if in managed community) | NOC from developer |
| Mortgage (if applicable) | Bank pre-approval | Pre-approval letter |
| SPA | Sales & Purchase Agreement | Signed SPA |
| DLD transfer | Transfer at DLD Trustee office | Title deed transfer |
| Payment | Buyer pays 4% transfer fee + AED 4,000 admin | DLD receipt |
| Title deed | New title deed issued in buyer's name | Title deed copy |

### 4.2 Rental Transaction

| Step | Requirement | Documents |
|------|------------|----------|
| Listing | Form A (rental authority from landlord) | Form A PDF |
| Offer | Written rental offer | CRM record |
| Lease agreement | RERA-approved lease template | Signed lease |
| Security deposit | Receipt issued to tenant | Deposit receipt |
| Post-dated cheques | Cheques collected, dated, receipted | Cheque copies |
| Ejari registration | Within 30 days of tenancy start | Ejari certificate |
| Commission | Agent collects from landlord (5%) | Commission receipt |

---

## 5. RERA Forms Reference

| Form | Name | Purpose | When Required |
|------|------|---------|--------------|
| Form A | Exclusive Sales/Rental Listing Authority | Owner authorises agent to market | Before listing any property |
| Form B | Buyer/Tenant Representation | Buyer authorises agent to act | At start of property search |
| Form F | Off-Plan Sales Agreement | Off-plan purchase contract | Every off-plan sale |
| Form I | Agent-to-Agent sharing agreement | Co-brokerage | When sharing listing with another agency |
| Form U | Unilateral Listing | Non-exclusive listing | When exclusivity not given |

---

## 6. Advertising Compliance Rules (RERA Circular)

| Rule | Penalty for Violation |
|------|---------------------|
| Cannot advertise a property without Form A | Fine up to AED 50,000 |
| Cannot advertise without valid RERA permit | Fine + suspension |
| Cannot use "under offer" when property is still available | Fine |
| Cannot advertise a sold property as available | Fine |
| Cannot omit agent BRN from advertisement | Warning + fine |
| Cannot use misleading area claims | Fine |
| Cannot use AI-generated property photos presented as real | Fine |

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

| Requirement | Details |
|------------|---------|
| All sales registered | Every property sale must be DLD-registered |
| Transfer fee | 4% of sale price (buyer pays) |
| NOC from developer | Required for apartments/villas in managed communities |
| Mortgage clearance | Letter from bank if seller's property is mortgaged |
| Title deed verification | Verify title deed authenticity at DLD |
| Owner identity | ID documents match title deed |
| DLD registration fee (rental) | AED 220 + VAT for Ejari |

---

## 9. Ejari Registration Requirements

| Requirement | Details | Timing |
|------------|---------|--------|
| All residential leases | Must be Ejari registered | Within 30 days of start |
| Commercial leases | Must be Ejari registered | Within 30 days |
| Sub-leases | Require original lease + sublease to be registered | Before sublease start |
| Renewal leases | New Ejari registration required | Within 30 days of renewal |
| Documents required | Lease, passports, Emirates IDs, title deed | At registration |
| Fee | AED 220 + VAT | Per registration |

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
