# Statutory Anti-Money Laundering (AML) & KYC Risk Scoring Architecture

> **Tracking:** `DU010` | **Agent:** `@Sofia` (SecOps & Cryptographic Defense Director) | **Status:** `ACTIVE SPECIFICATION`  
> **Statutory Authority:** UAE Federal Decree-Law No. (20) of 2018 on Anti-Money Laundering & goAML Requirements  
> **CONSUMES:** `server/routes/aegis.ts`, `business_docs/09_crm_features/legal-management.md`  
> **FEEDS:** `business_docs/05_requirements/compliance-requirements.md`  
> **FEEDS_ACK:** `AEGIS-V5-SECOPS-AML-RISK-ACK`

---

## 1. Statutory AML Compliance Mandate
Under UAE CBUAE and goAML regulations, all real estate transactions involving cash amounts >= AED 55,000, virtual assets, or high-risk politically exposed persons (PEPs) require mandatory risk assessment and suspicious activity reporting (SAR).

---

## 2. AML 4-Tier Risk Matrix
- **Tier 1 (Low Risk - Score 0-25)**: UAE Resident with verified Emirates ID, corporate salary transfer, local UAE bank escrow settlement.
- **Tier 2 (Medium Risk - Score 26-55)**: Non-resident investor, certified bank wire from FATF compliant jurisdictions.
- **Tier 3 (High Risk - Score 56-80)**: High-net-worth individual from non-cooperative jurisdiction, complex corporate offshore structure.
- **Tier 4 (Prohibited / Critical - Score 81-100)**: PEP match on international sanctions list, unverified source of wealth. Immediate deal freeze.

---

## 3. Automated goAML Reporting Envelope
When a transaction exceeds the risk threshold, the CRM automatically generates a pre-formatted XML dossier ready for export into the Ministry of Economy / FIU goAML portal.
