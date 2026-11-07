# Department: Legal

> **Department ID:** `legal`
> **Color:** #DC2626 (Rose)
> **Reporting To:** Managing Director
> **Status:** ✅ Active

---

## Mission

Protect White Caves Real Estate LLC from legal exposure on every transaction, contract, and business relationship. The Legal department reviews and monitors all contractual obligations, manages regulatory risks, supports dispute resolution, and ensures the company's policies align with UAE law.

---

## Team Structure

| Role | Headcount | Responsibilities |
|------|-----------|-----------------|
| Legal Counsel | 1 | Contract review, risk advice, dispute resolution |
| Legal Assistant | 1 | Document preparation, court filings, research |

---

## Key Responsibilities

1. **Contract Review** — Review all sale and purchase agreements (SPAs), tenancy contracts, and service agreements via Evangeline.
2. **Legal Risk Assessment** — Score every high-value transaction for legal risk before signing.
3. **Regulatory Compliance Tracking** — Monitor changes to UAE real estate law, RERA regulations, and DLD requirements.
4. **Dispute Resolution** — Manage buyer/seller/tenant disputes; coordinate with RERA dispute resolution centre.
5. **SPA Drafting** — Draft and customise sale and purchase agreements for off-plan and secondary properties.
6. **NOC Management** — Manage No Objection Certificate processes with developers.
7. **Employment Law Compliance** — Ensure employment contracts comply with UAE Labour Law.
8. **Data Protection** — Advise on UAE PDPL data privacy requirements in system design.
9. **Power of Attorney** — Process and verify POA documents for proxy transactions.
10. **Policy Development** — Develop and update internal policies (privacy policy, terms of use, AML policy).
11. **Legal Communications** — Draft legal correspondence to counterparties and government bodies.
12. **Third-Party Agreements** — Review vendor, technology, and partnership agreements.

---

## AI Assistants

| Assistant | Role | Status |
|-----------|------|--------|
| **Evangeline** | Legal Risk Analyst | ✅ In Code |

### End-to-End Legal Flow

```
Deal Reaches Offer Stage (Sales)
  ↓
Evangeline performs legal risk assessment:
  - Title deed ownership verification
  - Mortgage/charge status check
  - Developer standing check (RERA register)
  - SPA clause risk scoring
  ↓
Risk Score:
  - Green (Low) → Proceed; auto-draft standard SPA
  - Amber (Medium) → Notify Legal Counsel for clause modifications
  - Red (High) → Block transaction; escalate to MD
  ↓
SPA drafted (Quill generates document from template)
  ↓
Evangeline reviews final SPA
  ↓
Client receives SPA; Legal tracks signing status
  ↓
Signed SPA filed with DLD
  ↓
Compliance (Laila) logs legal clearance
  ↓
Finance (Theodora) proceeds with payment schedule

Policy Change Flow:
  → UAE law amendment detected (Evangeline monitors)
  → Legal Counsel reviews impact
  → Policy update drafted
  → MD approves
  → All affected contracts flagged for review
```

---

## Core Tools & Systems

| Tool | Purpose |
|------|---------|
| Evangeline Legal Panel | Risk assessments, contract monitoring |
| Contract Library | Standardised SPA, lease, and service templates |
| Quill Document Generator | AI-assisted contract drafting |
| Legal Alerts Feed | Regulatory change monitoring |
| DLD Portal Integration | Title deed and transfer filings |
| Dispute Management Module | Case tracking, RERA escalations |

---

## API Ownership & Integration Points

| Endpoint | Purpose |
|----------|---------|
| `POST /api/legal/risk-assess` | Trigger contract risk assessment |
| `GET /api/legal/contracts` | List all contracts |
| `POST /api/legal/contracts` | Create new contract record |
| `PATCH /api/legal/contracts/:id` | Update contract status |
| `GET /api/legal/disputes` | List active disputes |
| `POST /api/legal/disputes` | Create dispute record |
| `POST /api/legal/noc` | Initiate NOC process |
| `GET /api/legal/regulatory-alerts` | Regulatory change feed |

---

## KPIs & Success Metrics

| KPI | Target | Measurement |
|-----|--------|-------------|
| Contract Review Turnaround | <48 hours | Timestamp tracking |
| Legal Risk Identification Rate | >90% | Post-deal audit |
| Dispute Resolution Rate | >80% without litigation | Dispute tracker |
| SPA Accuracy Rate | 100% | Client feedback + legal audit |
| Regulatory Alert Response Time | <5 business days | Alert timestamps |
| Policy Update Cycle | Annual minimum | Policy register |

---

## Inter-Department Data Flows

| Department | Direction | Data |
|-----------|-----------|------|
| Sales | Inbound | Contract review requests |
| Finance | Inbound | Payment term clarifications |
| Compliance | Inbound | Risk-flagged transactions |
| Operations | Inbound | Lease agreement reviews |
| Executive | Outbound | Legal risk summary reports |
| Data & AI | Outbound | Contract data for analytics (Quill) |

---

## Implementation Status

- [x] Evangeline legal panel in code registry
- [x] Basic contract status tracking
- [ ] Quill contract generation integration (Phase 3)
- [ ] DLD API integration for title deed verification (Phase 6)
- [ ] Dispute management module (Phase 6)
- [ ] Regulatory alerts feed (Phase 6)
- [ ] SPA template library (Phase 5)

---

## Future Roadmap

| Enhancement | Phase | Priority |
|-------------|-------|----------|
| Quill AI contract generation | Phase 3 | High |
| SPA template library | Phase 5 | High |
| DLD title deed API | Phase 6 | High |
| Dispute tracking module | Phase 6 | Medium |
| RERA regulatory alerts feed | Phase 6 | Medium |
| Arabic contract templates via Mira | Phase 8 | Medium |
| E-signature integration | Phase 9 | Low |
