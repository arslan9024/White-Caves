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


---

## 9. Portal Syndication Partnership — Full Specification (Phase 8)

### 9.1 PropertyFinder Partnership

| Field | Details |
|-------|---------|
| Type | Subscription-based portal listing |
| URL | propertyfinder.ae |
| Audience | 2.5M+ monthly users; UAE + GCC buyers |
| Listing package | Premium (recommended): enhanced photos + video + top search placement |
| Cost structure | Annual subscription: AED 25,000–80,000 depending on listing volume and package |
| Lead routing | Lead form → email → White Caves CRM ingestion (via API webhook Phase 8) |
| API access | PropertyFinder API requires agency account + API credentials (apply at pf.com/agency) |

**Step-by-step application process:**
```
1. Apply for agency account: propertyfinder.ae/agencies/apply
2. Submit: RERA brokerage certificate, DED license, ORN number
3. Account approved (typically 3–5 business days)
4. Select listing package + sign annual contract
5. Configure API access (Phase 8): sync CRM → PF via REST API
6. Upload first listings: photo specs (min 1200×800px, min 10 photos), description (min 200 words)
7. Ensure all listings show valid Trakheesi permit (PF requirement)
```

**Listing Requirements for PropertyFinder:**
| Requirement | Standard |
|------------|---------|
| Photos | Min 10 photos; max 25; min 1200×800px resolution |
| Description | Min 200 words; English required; Arabic optional |
| RERA permit number | Mandatory — listing rejected without it |
| Agent BRN | Must appear on listing |
| Company ORN | Must appear on listing |
| Price accuracy | Within 5% of listed price |
| Watermarked photos | Not allowed |
| Floor plan | Recommended (boosts ranking) |
| Video/360° tour | Recommended (premium package) |

---

### 9.2 Bayut Partnership

| Field | Details |
|-------|---------|
| Type | Pay-per-click or subscription portal |
| URL | bayut.com |
| Audience | 3M+ monthly users; strong Indian subcontinent investor segment |
| Cost structure | Credits-based: purchase credit bundles; each listing costs credits per day |
| Agent profiles | Each agent gets a public Bayut profile (photo + BRN displayed) |
| Lead routing | Bayut Lead Manager → email + SMS → CRM API webhook (Phase 8) |

**Bayut vs PropertyFinder Strategy:**
- PropertyFinder: stronger with European + GCC buyers; better for villa + luxury market
- Bayut: stronger with Indian/Pakistani investor market; higher volume but more competitive
- Recommended: list DAMAC Hills 2 units on both; analyse lead quality monthly

---

### 9.3 API Sync Architecture (Phase 8)

```
White Caves CRM Property
         ↓
Property.status = PUBLISHED + Property.permitNumber valid
         ↓
Portal Sync Job (runs every 15 min)
    ├── Map CRM fields → PF/Bayut field format
    ├── Upload photos to portal CDN
    └── POST /api/listings (PF) or PUT /api/properties (Bayut)
         ↓
Portal confirms listing live (returns portal_listing_id)
         ↓
Property.propertyFinderListingId / Property.bayutListingId stored
         ↓
On CRM update → PUT to portal API within 15 min
On CRM delete/unpublish → DELETE to portal API immediately
```

**Inbound Lead Routing:**
```
Client submits lead form on PropertyFinder/Bayut
         ↓
Portal sends webhook to /api/webhooks/propertyfinder or /api/webhooks/bayut
         ↓
White Caves API: parse lead data, deduplicate (check existing by phone/email)
         ↓
New lead created in CRM: source = "propertyfinder" or "bayut"
         ↓
Round-robin assignment to next available agent
         ↓
Agent notified via WhatsApp (Nina) + CRM notification
```

---

## 10. Mortgage Referral Partner Framework

### 10.1 Why Mortgage Partnerships Matter

- **Market context:** 70–75% of Dubai secondary market buyers use mortgage financing (RERA data)
- **Expat buyers:** Cannot rely on employer salary without pre-approval
- **Speed to deal:** Pre-approved buyers are 3× more likely to close within 30 days
- **White Caves opportunity:** Referring buyers to mortgage partners creates a trusted ecosystem + referral fee revenue

### 10.2 Approved Mortgage Partners

| Partner | Type | Products | Referral Contact |
|---------|------|---------|-----------------|
| Emirates NBD | UAE National Bank | Expat + national mortgages; fixed + variable; Golden Visa mortgages | [Relationship Manager TBD] |
| Abu Dhabi Commercial Bank (ADCB) | UAE National Bank | Competitive rates for DAMAC community buyers | [RM TBD] |
| Mashreq Bank | UAE National Bank | Fast pre-approval (48h); expat-friendly | [RM TBD] |
| Mortgage Finder (broker) | Independent broker | Access to 20+ banks; comparison service | partner@mortgagefinder.ae |
| Bankrate UAE (broker) | Independent broker | Online mortgage marketplace; digital journey | [Contact TBD] |

### 10.3 Referral Fee Structure

| Scenario | Fee |
|---------|-----|
| Bank mortgage (direct referral) | 0.5% of mortgage value (paid by bank to White Caves) |
| Mortgage broker referral | 0.3–0.5% of mortgage value (paid by broker) |
| No fee scenario | Certain banks prohibit referral fees — confirm in writing |

**Revenue Example:** Client buys AED 2M property with AED 1.5M mortgage → referral fee = AED 7,500 (0.5%)

### 10.4 Client Referral Process

```
Step 1: Identify buyer needs mortgage (ask: "Have you spoken to a bank yet?")
Step 2: Offer referral ("We work with Mortgage Finder — free service, access to 20+ banks")
Step 3: Obtain client consent for data sharing ("May I share your contact with [Partner]?")
Step 4: CRM: mark lead as "mortgage_referral_sent" + note partner name
Step 5: Send client details to mortgage partner (email or CRM integration)
Step 6: Partner contacts client within 24 hours (SLA in partner agreement)
Step 7: Partner updates White Caves: pre-approved / declined / in progress
Step 8: CRM updated with mortgage status (helps track deal progress)
Step 9: Commission: partner pays referral fee within 30 days of mortgage completion
```

### 10.5 Mortgage Partner Agreement Requirements

Before formalising any mortgage referral partnership:
- ☐ Confirm referral fee rate and payment terms in writing
- ☐ Confirm RERA / UAE Central Bank compliance (no kickbacks that violate regulations)
- ☐ Confirm client data sharing is covered in White Caves privacy notice + PDPL compliant
- ☐ Service Level Agreement: partner contacts client within 24h
- ☐ Feedback loop: partner notifies White Caves of application outcome within 7 days
- ☐ Review clause: quarterly performance review (if < 80% of referrals contacted within SLA → review partnership)

---

## 11. Partnership Performance Scorecard

Quarterly review process for all active partnerships:

### 11.1 Developer Partnership KPIs

| KPI | Measurement | Target | Action if Below |
|-----|------------|--------|----------------|
| Units marketed | COUNT(properties with developer NOC active) | As per contract | Review if significantly below target |
| Deals closed | COUNT(WON leads from developer project) | As per contract minimum | Investigate pipeline; request developer support |
| Commission paid on time | % of commissions paid within SPA terms | 100% within 30 days | Escalate to developer account manager |
| Developer materials up to date | Floor plans, prices, renders current | < 7 days old | Request update from developer |
| Client satisfaction (off-plan) | CSAT from off-plan buyers | > 8.0 | Review handover procedure; escalate to developer |

### 11.2 Portal Partnership KPIs

| KPI | Measurement | Target | Action if Below |
|-----|------------|--------|----------------|
| Listing impressions | Portal dashboard | Growing MoM | Review listing quality (photos, description, price) |
| Lead volume from portal | CRM source filter | >20 leads/month per portal | Review listing prominence; consider paid boost |
| Cost per lead | Annual contract cost / total leads | < AED 300 | If > AED 500: consider renegotiation |
| Lead-to-viewing conversion | Viewings / portal leads | > 30% | Review agent response time to portal leads |
| Listing compliance score | % listings with permit, photos, BRN | 100% | Immediate remediation — non-compliant listings removed |

### 11.3 Quarterly Review Meeting Agenda (30 min)

```
1. [5 min] KPI dashboard review: actual vs. target
2. [10 min] What's working: top deals, best leads, successful campaigns
3. [10 min] What's not working: gaps, issues, partner service failures
4. [5 min] Actions for next quarter: specific, measurable, owned

Decision criteria:
- Partnership achieving all targets + positive feedback: CONTINUE + explore expansion
- Partnership 50–80% of targets: REVIEW — specific action plan for next quarter
- Partnership < 50% of targets for 2 consecutive quarters: TERMINATE or renegotiate
```

---

**Document Owner:** Strategy (Dena) + Operations (Jaime)
**Version History:** v1.0 April 2026 (initial)
**Review Cycle:** Quarterly or when new partnership initiated
**Related Documents:**
- `business/09_operations/vendor-management.md`
- `business_docs/08_market_research/portal-api-research.md`
- `business/07_strategy/competitive-positioning.md`
