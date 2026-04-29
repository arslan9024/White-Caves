# GDPR Equivalence Assessment — UAE PDPL vs GDPR
# White Caves Real Estate Platform

> **Document ID:** WC-GDPR-EQ-001
> **Version:** 1.0
> **Date:** April 2026
> **Status:** Active
> **Owner:** Compliance Department (Laila) + Technology (Timnit — Ethics/Policy)
> **Scope:** Gap analysis between UAE PDPL 2021 and EU GDPR 2018
> **Purpose:** For European investor clients, EU-based partner due diligence, and international regulatory comparison

---

## 1. Why This Assessment Matters

White Caves serves clients from across Europe (British, Russian, German, French investors) who expect GDPR-level data protection standards. While the UAE PDPL is the applicable law, demonstrating GDPR equivalence:

1. Builds trust with European clients
2. Supports DLD transactions with European counterparties
3. Enables compliance with GDPR if processing European residents' data (extraterritorial effect)
4. Facilitates data transfers from EU companies to White Caves (SCCs no longer needed if adequacy granted)

---

## 2. Law Overview

| Feature | UAE PDPL | EU GDPR |
|---------|----------|---------|
| Full name | Federal Decree-Law No. 45 of 2021 on Personal Data Protection | General Data Protection Regulation (EU) 2016/679 |
| In force | September 2021 | May 2018 |
| Enforcement authority | UAE Data Office (established 2024) | National supervisory authorities (DPA) |
| Extra-territorial effect | Yes — applies to data of UAE residents processed outside UAE | Yes — applies to EU residents' data processed anywhere |
| Maximum fine | AED 20 million | EUR 20 million or 4% global annual turnover (higher of) |

---

## 3. Principles Comparison

| Principle | GDPR | UAE PDPL | White Caves Status |
|-----------|------|----------|------------------|
| Lawfulness | Must have legal basis (6 bases) | Must have legal basis (consent, contract, legal obligation, etc.) | ✅ Same |
| Fairness and transparency | Transparent processing | Transparent processing | ✅ Same |
| Purpose limitation | Collected for specified purposes only | Collected for specific purpose only | ✅ Same |
| Data minimisation | Only what's necessary | Only what's necessary | ✅ Same |
| Accuracy | Keep accurate + up to date | Keep accurate + up to date | ✅ Same |
| Storage limitation | Retain only as long as necessary | Retain only as long as necessary | ✅ Same |
| Integrity and confidentiality | Appropriate security | Appropriate security | ✅ Same |
| Accountability | Controller responsible | Controller responsible | ✅ Same |

**Assessment:** All 8 core principles are equivalent.

---

## 4. Legal Bases Comparison

| Legal Basis | GDPR | UAE PDPL | Notes |
|------------|------|----------|-------|
| Consent | ✅ (freely given, specific, informed, unambiguous) | ✅ (clear, specific, direct) | Very similar requirements |
| Contract performance | ✅ | ✅ | Equivalent |
| Legal obligation | ✅ | ✅ | Equivalent |
| Vital interests | ✅ | ✅ (limited) | PDPL less developed |
| Public task | ✅ | ✅ (limited) | Different public sector context |
| Legitimate interests | ✅ (balancing test required) | ✅ | PDPL slightly less prescriptive |

**Assessment:** Legal bases are functionally equivalent. GDPR has more case law / guidance.

---

## 5. Data Subject Rights Comparison

| Right | GDPR | UAE PDPL | Gap |
|-------|------|----------|-----|
| Right to access | ✅ 30 days | ✅ 30 days | None |
| Right to rectification | ✅ | ✅ | None |
| Right to erasure ("right to be forgotten") | ✅ | ✅ (limited exceptions) | Minor: PDPL exceptions less defined |
| Right to restriction | ✅ | ⚠️ Implied but not explicit | Gap: PDPL doesn't explicitly define restriction right |
| Right to portability | ✅ | ✅ (machine-readable format) | None |
| Right to object | ✅ | ⚠️ Partial | Gap: GDPR object right broader (includes profiling) |
| Rights re automated decision-making | ✅ (Article 22) | ⚠️ Not explicit | Gap: PDPL doesn't explicitly address automated decisions |
| Right to withdraw consent | ✅ (at any time) | ✅ | None |

**Gap Actions for White Caves:**
- Implement restriction right (processing pause) as if GDPR applies — Phase 2
- Do not use fully automated decisions that significantly affect persons without human review
- When European clients request, apply full GDPR rights even if PDPL doesn't require them

---

## 6. Controller / Processor Requirements

| Requirement | GDPR | UAE PDPL | White Caves Status |
|------------|------|----------|------------------|
| Data Processing Agreements (DPAs) | ✅ Mandatory with all processors | ✅ Required | ⚠️ Pending with Stripe, Meta, SendGrid |
| Records of Processing Activities (ROPA) | ✅ Mandatory | ✅ Required | ✅ This DPIA serves as ROPA |
| Data Protection Officer (DPO) | ✅ (mandatory for certain orgs) | ⚠️ Not explicitly required | White Caves: MD acts as DPO; formal DPO Phase 9 |
| Privacy by Design | ✅ | ✅ | ✅ Token system, RBAC, UAE residency |
| Privacy by Default | ✅ | ✅ | ⚠️ Cookie consent banner pending (Phase 2) |

---

## 7. Cross-Border Data Transfers

| Mechanism | GDPR | UAE PDPL | White Caves |
|-----------|------|----------|------------|
| Adequacy decision | ✅ EU Commission can grant | ✅ UAE Data Office can grant (no decisions yet) | N/A currently |
| Standard Contractual Clauses (SCCs) | ✅ Available | ✅ Equivalent clauses available | ⚠️ Needed for Firebase, Stripe, Meta, Vercel |
| Binding Corporate Rules | ✅ For multinationals | ✅ | Not applicable |
| Explicit consent | ✅ For transfers | ✅ | Consent covers some transfers |

**Status:** White Caves uses US-based processors (Google/Firebase, Stripe, Meta, Vercel). SCCs must be signed with each processor before European clients' data is processed. UAE PDPL requires similar protection mechanisms for cross-border transfers.

**Action (Phase 2):** Sign Data Processing Addenda with:
- Firebase (Google): Available at admin.google.com
- Stripe: Available at stripe.com/legal/dpa
- Meta/WhatsApp: Available at developers.facebook.com/docs/whatsapp/dpa
- Vercel: Available at vercel.com/legal/dpa

---

## 8. Security Requirements

| Requirement | GDPR | UAE PDPL | White Caves |
|------------|------|----------|------------|
| Appropriate technical measures | ✅ | ✅ | ✅ TLS 1.3, bcrypt, Helmet |
| Appropriate organisational measures | ✅ (RBAC, training) | ✅ | ✅ RBAC, ⏳ formal training Phase 5 |
| Breach notification to authority | ✅ 72 hours | ✅ UAE Data Office notification required | ⏳ Procedure documented Phase 2 |
| Breach notification to individuals | ✅ If high risk | ✅ If high risk | ⏳ Procedure documented Phase 2 |
| Data protection impact assessments | ✅ Mandatory for high risk | ✅ | ✅ This document + DPIA |
| Encryption at rest | ✅ (best practice) | ✅ (best practice) | ✅ MongoDB Atlas AES-256 |
| Pseudonymisation | ✅ (recommended) | ✅ | ⚠️ Not implemented — Phase 5 |

---

## 9. Sensitive Data (Special Categories)

| Category | GDPR (Article 9) | UAE PDPL | White Caves |
|---------|-----------------|----------|------------|
| Race / ethnicity | ✅ Special category | ✅ Sensitive data | Not collected (nationality only) |
| Health data | ✅ Special category | ✅ Sensitive data | Not collected |
| Religious beliefs | ✅ Special category | ✅ Sensitive data | Not collected |
| Political opinions | ✅ Special category | ✅ Sensitive data | Not collected |
| Biometric data | ✅ Special category | ✅ Sensitive data | Passport photo (processed, not analysed) |
| Financial data | Not special per GDPR | Sensitive per PDPL | Collected (AML requirement) |

**White Caves Position:** Passport photos are collected for KYC but not biometrically analysed. Financial data is collected under legal obligation (AML). No health, political, or religious data collected.

---

## 10. Compliance Gap Summary

| Area | GDPR | UAE PDPL | Gap Level | Action Required |
|------|------|----------|-----------|----------------|
| Core principles | ✅ | ✅ | None | — |
| Legal bases | ✅ | ✅ | Minor | Document balancing tests |
| Data subject rights | ✅ | Partial | Medium | Add restriction right (Phase 2) |
| DPO requirement | ✅ (some orgs) | Not required | Low | Formalise DPO role Phase 9 |
| SCCs for US transfers | ✅ Required | Required | High | Sign all DPAs Phase 2 |
| Breach notification | ✅ 72 hours | Required | Medium | Procedure + contact Phase 2 |
| DPIA | ✅ High risk mandatory | ✅ | None | ✅ Completed |
| Privacy notice | ✅ Mandatory | ✅ | High | Publish on website Phase 2 |
| Pseudonymisation | Best practice | Best practice | Low | Phase 5 |
| Automated decisions | ✅ Article 22 | Not explicit | Medium | Apply GDPR Article 22 voluntarily |

---

## 11. Statement of GDPR Equivalence

Based on this assessment:

**White Caves Real Estate LLC, when operating in compliance with this DPIA and the UAE PDPL:**

✅ Meets or exceeds GDPR standards for core data protection principles
✅ Provides equivalent data subject rights (with minor exception for restriction right — to be remedied Phase 2)
⚠️ Requires completion of US-processor SCCs before full GDPR-equivalence on cross-border transfers (Phase 2 action)
⚠️ Automated decision documentation needed before deploying ML lead scoring (Phase 7)

**For European clients:** White Caves voluntarily applies the higher standard (GDPR) where UAE PDPL and GDPR differ, ensuring European clients receive full protection.

---

**Document Owner:** Compliance (Laila) + Strategy (Timnit)
**Review Cycle:** Annually + when UAE PDPL implementing regulations published
**Related:** `business/08_compliance/data-privacy-impact-assessment.md`, `business/06_flowcharts/data-privacy-flow.md`
