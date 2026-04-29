# Partnership Framework
# White Caves Real Estate LLC

> **Document ID:** WC-PARTNER-001
> **Version:** 1.0
> **Date:** April 2026
> **Status:** Active
> **Owner:** Strategy + Operations (Dena — Strategy Lead, Jaime — Productivity Lead)
> **Scope:** Framework for developer partnerships (Emaar, DAMAC, Sobha), portal partnerships (Bayut, PF), and co-marketing agreements

---

## 1. Partnership Philosophy

White Caves pursues partnerships that:
1. **Multiply reach** without multiplying overhead
2. **Protect the brand** — White Caves associates only with trusted partners
3. **Create mutual value** — both parties win
4. **Maintain data sovereignty** — no partner gets full CRM access
5. **Stay RERA-compliant** — all partnerships disclosed to RERA as required

---

## 2. Partnership Categories

| Category | Examples | Phase | Priority |
|---------|---------|-------|---------|
| Developer Off-Plan | DAMAC, Emaar, Sobha, Meraas | Phase 8 | 🔴 High |
| Portal Syndication | PropertyFinder, Bayut | Phase 8 | 🔴 High |
| Mortgage Referral | UAE national banks, broker networks | Phase 3 | 🟡 Medium |
| Legal Services | UAE law firms (property law) | Phase 3 | 🟡 Medium |
| Property Management Co-Agent | Co-agent agreements | Phase 3 | 🟡 Medium |
| Technology | Matterport, DocuSign, proptech | Phase 7 | 🟠 Low |
| Co-brokerage / RERA Form I | Other Dubai agencies | Ongoing | 🟡 Medium |

---

## 3. Developer Partnership Framework (DAMAC, Emaar, Sobha)

### 3.1 How Developer Partnerships Work

```
Developer registers White Caves as an authorised broker:
1. White Caves applies on developer broker portal
2. Developer verifies RERA brokerage license
3. Developer approves White Caves as "registered broker"
4. Developer provides:
   ├── Project briefing materials
   ├── Unit inventory (prices, floor plans, availability)
   ├── Marketing assets (renders, brochures, videos)
   └── Sales team access for agent training

White Caves agrees to:
├── Accurate marketing of project (no misrepresentation)
├── RERA permit compliance on all listings
├── Collecting signed Form F (off-plan SPA)
└── Meeting minimum sales target (if applicable)
```

### 3.2 Developer Commission Structure

| Developer | Commission Rate | Payment Trigger | Payment Terms |
|----------|----------------|----------------|--------------|
| DAMAC Properties | 5–7% | SPA signing | 30 days from SPA |
| Emaar Properties | 5% | SPA signing | 30 days from SPA |
| Sobha Realty | 5–6% | SPA signing | 30 days from SPA |
| Meraas | 5% | SPA signing | 45 days from SPA |
| Nakheel | 4–5% | SPA signing | 30 days from SPA |

*Rates subject to project-specific agreements*

### 3.3 Developer Agreement Checklist

Before signing any developer partnership agreement:

```
☐ RERA NOC confirming White Caves is authorised to market
☐ Commission rate confirmed in writing
☐ Commission payment terms confirmed
☐ Minimum sales targets (accept if achievable; reject if unrealistic)
☐ Marketing restrictions reviewed:
   ├── Can White Caves use developer brand assets?
   ├── Can White Caves set its own prices?
   └── Is exclusivity claimed? (avoid exclusive — reduces flexibility)
☐ Escrow account details verified (RERA requirement for off-plan)
☐ Project delivery date confirmed
☐ Payment plan for buyers confirmed
☐ Developer legal counsel reviewed agreement
☐ White Caves legal counsel reviewed agreement
☐ Compliance officer sign-off
```

### 3.4 Co-Marketing Agreements

| Activity | White Caves Provides | Developer Provides |
|---------|--------------------|--------------------|
| Digital advertising | Targeting, creative | Marketing budget (shared) |
| Property events | Venue (option), invites, CRM leads | Marketing materials, gifts |
| Social media | Content production, posting | Brand assets, approval |
| Email campaigns | CRM list, template, send | Approved content |
| Virtual tours | Tech integration | 360° assets |

---

## 4. Portal Syndication Framework (Bayut, PropertyFinder)

### 4.1 Portal Partnership Requirements

Before activating portal syndication (Phase 8):

```
PropertyFinder:
☐ Register as verified agency at agent.propertyfinder.ae
☐ Agree to PropertyFinder advertising terms
☐ Select subscription plan (paid per listing or per lead)
☐ Implement XML feed in REAXML format
☐ Include RERA permit in every listing (mandatory)
☐ Complete agency profile (logo, contact, RERA ORN)
☐ Data sharing agreement signed
☐ Test feed integration with 10 sample listings
☐ Go live

Bayut:
☐ Register at agent.bayut.com
☐ Similar process to PropertyFinder
☐ JSON feed API integration
```

### 4.2 Feed Automation Spec

```
Feed generated every 4 hours by White Caves API:
  ├── Source: CRM properties WHERE status='PUBLISHED'
  ├── Format: PropertyFinder → REAXML; Bayut → JSON
  ├── Required fields: title, price, area, type, photos, RERA permit, agent BRN
  └── HTTPS endpoint: https://api.whitecaves.ae/feeds/propertyfinder.xml
                       https://api.whitecaves.ae/feeds/bayut.json

Lead capture from portals:
  Portal receives enquiry → sends webhook to White Caves
  POST https://api.whitecaves.ae/api/leads/webhook/propertyfinder
  POST https://api.whitecaves.ae/api/leads/webhook/bayut
  
  Response: Lead created in CRM, assigned to agent, notifications sent
```

### 4.3 Portal Budget Allocation (Planned)

| Portal | Monthly Cost | Lead Target | Cost Per Lead Target |
|--------|-------------|-------------|---------------------|
| PropertyFinder | AED 5,000–10,000 | 30 leads | < AED 300/lead |
| Bayut | AED 3,000–8,000 | 20 leads | < AED 300/lead |

---

## 5. Mortgage Referral Partnership Framework

### 5.1 Partnership Model

White Caves refers buyers who need financing to approved mortgage partners.

| Partner | Rate | Referral Trigger | Referral Fee |
|---------|------|-----------------|-------------|
| UAE national banks | TBD | Buyer requests mortgage | None (goodwill) |
| Independent mortgage brokers | TBD | Buyer requests mortgage | 0.5% of mortgage value |

**RERA rule:** Referral fees from mortgage brokers must be disclosed to the client.

### 5.2 Preferred Mortgage Partner Criteria

- Licensed by UAE Central Bank (CBUAE)
- Minimum 5 years Dubai market experience
- Can process applications in 5 business days
- Competitive rates for UAE residents AND non-residents
- Handles both conventional and Islamic (Murabaha) mortgages

---

## 6. Co-Brokerage (RERA Form I)

### 6.1 When Co-Brokerage Applies

When White Caves has a buyer but another agency has the exclusive listing (or vice versa).

### 6.2 Commission Split Standard

```
Total commission: 2% of sale price
├── Listing agency: 1% (50%)
└── Buyer agency (White Caves): 1% (50%)

Terms must be agreed in writing (RERA Form I) before:
├── Sharing property details with buyer
└── Arranging viewing
```

### 6.3 Co-Brokerage Agreement Checklist

```
☐ RERA Form I prepared and signed by both agencies
☐ Property RERA permit verified
☐ Commission % and split confirmed in writing
☐ Listing agent BRN verified
☐ Sharing agency BRN verified
☐ Client informed of dual agency arrangement
☐ Agreed timeline for offer and completion
```

---

## 7. Partnership Performance Review

| Partnership Type | Review Frequency | Key Metrics |
|----------------|-----------------|------------|
| Developer (DAMAC, Emaar) | Quarterly | Units marketed, deals closed, commission paid |
| Portal (Bayut, PF) | Monthly | Impressions, leads, cost per lead, conversion |
| Mortgage referral | Quarterly | Referrals sent, applications approved, satisfaction |
| Co-brokerage | Per transaction | Resolution time, client satisfaction |

---

## 8. Partnership Risk Management

| Risk | Mitigation |
|------|-----------|
| Developer delays payment | Invoice tracking + escalation after 30 days |
| Portal changes pricing | Lock in 12-month contracts; have backup portal |
| RERA Form I partner doesn't honour split | All terms in writing; RERA dispute mechanism |
| Developer goes into receivership | Due diligence before partnership; RERA escrow requirement protects buyers |
| Partner misrepresents White Caves | Clear brand guidelines in every partnership agreement |

---

**Document Owner:** Strategy (Dena) + Operations (Jaime)
**Review Cycle:** Quarterly or when new partnership initiated
**Related:** `business/09_operations/vendor-management.md`, `business_docs/08_market_research/portal-api-research.md`
