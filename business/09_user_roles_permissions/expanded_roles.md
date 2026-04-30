# Expanded Roles & Permissions Matrix — Phase 2 Research Implementation

> **Last Updated:** April 11, 2026
> **Purpose:** Expand role matrix with new roles for compliance, marketing, and research-driven workflows
> **Extends:** `/business_docs/09_user_roles_permissions/roles-matrix.md`

---

## New Roles (Phase 2)

### 1. Compliance Officer (`compliance_officer`)

| Attribute | Details |
|-----------|---------|
| **Category** | Compliance |
| **Color** | #DC2626 (Red) |
| **Dashboard** | `/compliance/dashboard` |
| **Reports To** | Managing Director |
| **AI Assistant** | Laila (Compliance & Legal Officer) |

#### Permissions

| Permission | Access | Description |
|-----------|--------|-------------|
| `compliance.*` | Full | All compliance features |
| `compliance.rera.view` | Read | View RERA licensing status |
| `compliance.rera.manage` | Write | Manage RERA registrations, renewals |
| `compliance.trakheesi.view` | Read | View Trakheesi permit status |
| `compliance.trakheesi.manage` | Write | Issue, renew, revoke permits |
| `compliance.ejari.view` | Read | View Ejari registration status |
| `compliance.ejari.manage` | Write | Register, renew Ejari contracts |
| `compliance.kyc.view` | Read | View KYC/AML verification status |
| `compliance.kyc.manage` | Write | Approve/reject KYC submissions |
| `compliance.audit.view` | Read | View audit logs |
| `compliance.audit.export` | Write | Export audit reports |
| `compliance.documents.view` | Read | View compliance documents |
| `compliance.documents.manage` | Write | Upload, update compliance docs |
| `properties.view` | Read | View properties for compliance checks |
| `agents.view` | Read | View agent profiles for license checks |
| `reports.compliance` | Read | Compliance reports and dashboards |

#### Workflows

1. **RERA License Monitoring** — Track agent/broker license expiry, trigger renewal alerts
2. **Trakheesi Permit Audit** — Daily scan for expired permits, auto-unpublish listings
3. **Ejari Registration** — Verify all tenancy contracts are Ejari-registered
4. **KYC/AML Review** — Approve or escalate KYC submissions for high-value transactions
5. **Compliance Reporting** — Generate monthly compliance status reports for MD

---

### 2. Marketing Manager (`marketing_manager`)

| Attribute | Details |
|-----------|---------|
| **Category** | Marketing |
| **Color** | #EC4899 (Pink) |
| **Dashboard** | `/marketing/dashboard` |
| **Reports To** | Managing Director |
| **AI Assistant** | Olivia (Marketing & Brand Manager) |

#### Permissions

| Permission | Access | Description |
|-----------|--------|-------------|
| `marketing.*` | Full | All marketing features |
| `marketing.campaigns.view` | Read | View email/social campaigns |
| `marketing.campaigns.manage` | Write | Create, edit, schedule campaigns |
| `marketing.campaigns.approve` | Write | Approve campaign launches |
| `marketing.analytics.view` | Read | Campaign performance analytics |
| `marketing.seo.view` | Read | SEO performance data |
| `marketing.seo.manage` | Write | Update SEO settings, meta data |
| `marketing.content.view` | Read | View content library |
| `marketing.content.manage` | Write | Create, edit marketing content |
| `marketing.social.view` | Read | Social media account activity |
| `marketing.social.manage` | Write | Post, schedule social content |
| `marketing.budget.view` | Read | Marketing budget and spend |
| `marketing.budget.manage` | Write | Allocate budget, approve expenses |
| `leads.view` | Read | View leads for campaign targeting |
| `properties.view` | Read | View properties for marketing |
| `reports.marketing` | Read | Marketing reports and ROI |

#### Workflows

1. **Email Campaign Management** — Create, test, schedule, and analyze email campaigns
2. **Social Media Calendar** — Plan, create, and schedule social media posts
3. **SEO Monitoring** — Track keyword rankings, optimize listings, manage schema markup
4. **Google Ads Management** — Create campaigns, manage budget, track conversions
5. **Content Creation** — Blog posts, property descriptions, market reports
6. **Lead Nurturing Campaigns** — Design drip sequences for different lead segments
7. **Marketing ROI Reporting** — Track spend vs. leads generated vs. conversions

---

### 3. Market Researcher (`market_researcher`)

| Attribute | Details |
|-----------|---------|
| **Category** | Analytics |
| **Color** | #6366F1 (Indigo) |
| **Dashboard** | `/research/dashboard` |
| **Reports To** | Managing Director |
| **AI Assistants** | Oracle (Market Analyst), Kairos (Intelligence), Maven (Data Science) |

#### Permissions

| Permission | Access | Description |
|-----------|--------|-------------|
| `research.*` | Full | All research features |
| `market.data.view` | Read | View market data and trends |
| `market.data.import` | Write | Import external market data |
| `market.reports.view` | Read | View market reports |
| `market.reports.generate` | Write | Generate CMA, trend reports |
| `market.forecast.view` | Read | View price forecasts |
| `market.forecast.configure` | Write | Configure forecast models |
| `properties.view` | Read | View properties for analysis |
| `transactions.view` | Read | View transactions for analytics |
| `analytics.advanced` | Read | Access to advanced analytics tools |
| `reports.market` | Read | Market research reports |

#### Workflows

1. **Market Data Collection** — Aggregate data from DLD, portals, economic sources
2. **CMA Generation** — Create comparative market analysis reports on demand
3. **Price Forecasting** — Run and refine ML-based price prediction models
4. **Competitor Monitoring** — Track competitor pricing, listings, and features
5. **Investor Briefings** — Prepare and distribute market intelligence for VIP clients

---

### 4. IT Administrator (`it_admin`)

| Attribute | Details |
|-----------|---------|
| **Category** | Technology |
| **Color** | #14B8A6 (Teal) |
| **Dashboard** | `/it/dashboard` |
| **Reports To** | CTO (Aurora) |
| **AI Assistants** | Atlas (Infrastructure), Sentinel (Monitoring), Cipher (Security) |

#### Permissions

| Permission | Access | Description |
|-----------|--------|-------------|
| `it.*` | Full | All IT management features |
| `system.health.view` | Read | System health and metrics |
| `system.logs.view` | Read | Application and server logs |
| `system.config.manage` | Write | System configuration settings |
| `users.manage` | Write | User account management |
| `security.audit.view` | Read | Security audit logs |
| `security.incidents.manage` | Write | Manage security incidents |
| `integrations.manage` | Write | Third-party integration settings |
| `backup.manage` | Write | Database backup and restore |
| `deployment.manage` | Write | Deployment and release management |

---

### 5. Document Controller (`document_controller`)

| Attribute | Details |
|-----------|---------|
| **Category** | Operations |
| **Color** | #F59E0B (Amber) |
| **Dashboard** | `/documents/dashboard` |
| **Reports To** | Compliance Officer |
| **AI Assistant** | Quill (Document Generator) |

#### Permissions

| Permission | Access | Description |
|-----------|--------|-------------|
| `documents.*` | Full | All document features |
| `documents.templates.view` | Read | View document templates |
| `documents.templates.manage` | Write | Create, edit templates |
| `documents.generate` | Write | Generate documents from templates |
| `documents.sign` | Write | Request and track signatures |
| `documents.archive` | Write | Archive and retrieve documents |
| `compliance.documents.view` | Read | View compliance documents |

---

## Updated Role Count Summary

| Category | Existing Roles | New Roles | Total |
|----------|---------------|-----------|-------|
| **Executive** | 3 | 0 | 3 |
| **Admin** | 1 | 0 | 1 |
| **Management** | 3 | 0 | 3 |
| **Sales** | 3 | 0 | 3 |
| **Operations** | 3 | 1 (Document Controller) | 4 |
| **Finance** | 1 | 0 | 1 |
| **Marketing** | 1 | 1 (Marketing Manager) | 2 |
| **Compliance** | 1 | 1 (Compliance Officer) | 2 |
| **Analytics** | 2 | 1 (Market Researcher) | 3 |
| **Technology** | 4 | 1 (IT Admin) | 5 |
| **Total** | **22** | **5** | **27** |

---

## Permission Summary

| Area | Total Permissions |
|------|------------------|
| Compliance | 12 new permissions |
| Marketing | 14 new permissions |
| Research/Market | 10 new permissions |
| IT/System | 10 new permissions |
| Documents | 7 new permissions |
| **Total New** | **53 new permissions** |
| **Grand Total** | **~100 permissions** |

---

## Sources

- [RBAC Best Practices](https://blog.dreamfactory.com/rbac-rate-limits-and-audit-logs-enterprise-security-built-in-dreamfactory)
- [Dubai Real Estate Compliance Roles](https://www.rera.gov.ae)
- White Caves existing roles matrix (`business_docs/09_user_roles_permissions/roles-matrix.md`)


---

## Role Hierarchy Diagram

```
                    Managing Director
                    ┌──────────────────────────────────────────────────────┐
                    │  ALL permissions (full platform access)              │
                    │  arslanmalikgoraha@gmail.com                         │
                    └──────────────────────────────────────────────────────┘
                               │
          ┌────────────────────┼──────────────────────┐
          ↓                    ↓                       ↓
   Sales Manager         Compliance Officer      IT Administrator
   (team + pipeline)     (legal, RERA, AML)      (system, users, infra)
          │
    ┌─────┴────────────┐
    ↓                  ↓
Sales Agent        Leasing Agent
(leads,             (leases,
 viewings,           tenancies,
 transactions)       Ejari)
    │                  │
    ↓                  ↓
Junior Sales       Property Manager
Agent              (portfolio
(supervised)        maintenance,
                    landlords)
                    │
                    ↓
               Tenant Portal
               (view own data only)
               Landlord Portal
               (view own portfolio only)

─── Horizontal Departments (report to MD, not Sales Manager) ───

Marketing Manager ─→ Content Creator
Finance Officer    (payroll, invoices)
Compliance Officer ─→ Document Controller
Research Analyst   (market data, reports)
Customer Success Manager (NPS, retention)
Data Analyst       (CRM analytics, dashboards)
```

---

## Permission Matrix — All Roles

Legend: **R** = Read | **W** = Write | **A** = Admin | **—** = No access

| Role | Leads | Properties | Finance | Compliance | Analytics | Admin | Portals | AI Hub |
|------|-------|-----------|---------|-----------|-----------|-------|---------|--------|
| **managing_director** | A | A | A | A | A | A | A | A |
| **sales_manager** | A (team) | A | R | R | R (team) | — | R | R |
| **sales_agent** | W (assigned) | R | — | R | R (own) | — | — | R |
| **junior_sales_agent** | R (assigned) | R | — | R | — | — | — | R |
| **leasing_agent** | W (leasing) | R | — | R | R (own) | — | R | R |
| **property_manager** | — | W | R | R | R | — | A | R |
| **compliance_officer** | R | R | — | A | R | — | R | R |
| **document_controller** | R | R | — | R | — | — | — | R |
| **marketing_manager** | R | R | — | — | R | — | — | R |
| **content_creator** | — | R | — | — | R (marketing) | — | — | R |
| **finance_officer** | R | R | A | R | R (finance) | — | — | R |
| **research_analyst** | R | R | — | — | R | — | — | R |
| **data_analyst** | R | R | R | R | A | — | — | R |
| **customer_success** | W | R | — | — | R | — | R | R |
| **it_administrator** | — | — | — | R (audit) | R | A | — | R |
| **owner** | R | R | R | R | R | — | R | R |
| **landlord** (portal) | — | R (own) | R (own) | — | — | — | A (own) | — |
| **tenant** (portal) | — | — | R (own) | — | — | — | A (own) | — |

---

## Additional Roles — Full Detail

### 3. Research Analyst (`research_analyst`)

| Attribute | Details |
|-----------|---------|
| **Category** | Analytics & Research |
| **Dashboard** | `/research/dashboard` |
| **Reports To** | Managing Director |
| **AI Assistants** | Oracle (Market Analyst), Kairos (Competitive Intelligence) |

#### Permissions

| Permission | Access | Description |
|-----------|--------|-------------|
| `research.*` | Full | All research features |
| `market.data.view` | Read | Access DLD transaction data, area stats |
| `market.reports.create` | Write | Generate market reports, CMAs |
| `market.intelligence.view` | Read | Competitor intelligence data |
| `properties.view` | Read | All property data for market analysis |
| `leads.analytics.view` | Read | Aggregated lead funnel analytics (anonymised) |
| `reports.create` | Write | Create and publish market reports |
| `reports.distribute` | Write | Send reports to clients via WhatsApp/email |

#### Key Workflows

1. **Weekly Market Pulse** — Oracle generates weekly area price index; analyst reviews + publishes
2. **CMA Generation** — Generate comparative market analysis for listing agents or clients on request
3. **Competitor Monitoring** — Monthly review of Bayut/PF pricing data; update competitive-positioning.md
4. **Investor Briefing** — Quarterly investor report: portfolio performance + market outlook
5. **DLD Data Feed** — Pull monthly transaction data; update area price trend charts

---

### 4. Property Manager (`property_manager`)

| Attribute | Details |
|-----------|---------|
| **Category** | Operations |
| **Dashboard** | `/operations/property-management` |
| **Reports To** | Sales Manager / Managing Director |
| **AI Assistants** | Daisy (Leasing), Harmony (Tenant Relations) |

#### Permissions

| Permission | Access | Description |
|-----------|--------|-------------|
| `properties.*` | Write | Manage all properties in portfolio |
| `leases.*` | Write | Full lease lifecycle management |
| `maintenance.view` | Read | View maintenance requests |
| `maintenance.manage` | Write | Assign and track maintenance jobs |
| `tenants.view` | Read | View tenant profiles |
| `landlords.view` | Read | View landlord profiles |
| `finance.rent` | Read | View rent payment status |
| `reports.property` | Write | Property performance reports |
| `portals.landlord` | Write | Update landlord portal content |
| `portals.tenant` | Write | Update tenant portal content |

#### Key Workflows

1. **Lease Renewal Pipeline** — Track leases expiring in next 90 days; proactively contact tenants
2. **Maintenance Coordination** — Receive tenant requests → assign contractor → track completion
3. **Rent Arrears Monitoring** — Daily check for overdue payments; escalate after 7 days
4. **Periodic Property Inspection** — Schedule annual inspections; upload photos and condition report
5. **NOC Applications** — Apply for developer NOCs on behalf of landlords for DLD transfers

---

### 5. Finance Officer (`finance_officer`)

| Attribute | Details |
|-----------|---------|
| **Category** | Finance |
| **Dashboard** | `/finance/dashboard` |
| **Reports To** | Managing Director |
| **AI Assistants** | Theodora (Finance & Commissions), Sterling (Invoice Processing) |

#### Permissions

| Permission | Access | Description |
|-----------|--------|-------------|
| `finance.*` | Full | All finance features |
| `finance.commissions.view` | Read | View commission calculations |
| `finance.commissions.approve` | Write | Approve commission payouts |
| `finance.invoices.create` | Write | Generate VAT invoices |
| `finance.invoices.send` | Write | Send invoices to clients |
| `finance.payroll.view` | Read | View agent base salary data |
| `finance.reports.create` | Write | Generate P&L, cash flow reports |
| `finance.vat.manage` | Write | Manage VAT return data (FTA submissions) |
| `leads.view` | Read | View closed deals for commission calculation |
| `transactions.view` | Read | All transaction records |
| `reports.finance` | Write | Full finance reporting suite |

#### Key Workflows

1. **Monthly Commission Processing** — Extract all WON deals from CRM → calculate commissions → process payouts
2. **VAT Invoice Generation** — Quill generates commission invoices with TRN + VAT for every deal
3. **Quarterly VAT Return** — Aggregate taxable supplies + input VAT → submit to FTA
4. **Annual Budget vs. Actuals** — Track revenue against MASTER_PLAN targets
5. **Agent Bonus Calculation** — Quarterly: apply scorecard eligibility criteria → calculate bonuses → approve with MD

---

### 6. Customer Success Manager (`customer_success`)

| Attribute | Details |
|-----------|---------|
| **Category** | Customer Experience |
| **Dashboard** | `/cx/dashboard` |
| **Reports To** | Managing Director |
| **AI Assistants** | Harmony (Tenant Relations), Muse (Onboarding) |

#### Permissions

| Permission | Access | Description |
|-----------|--------|-------------|
| `cx.*` | Full | All customer experience features |
| `leads.view` | Read | View client history |
| `leads.notes.create` | Write | Add client success notes |
| `nps.view` | Read | View NPS and CSAT scores |
| `nps.manage` | Write | Send NPS surveys, track responses |
| `portals.tenant` | Read | View tenant portal usage data |
| `portals.landlord` | Read | View landlord portal usage data |
| `whatsapp.broadcast` | Write | Send post-purchase welcome messages |
| `reports.cx` | Write | Client satisfaction reports |
| `escalations.manage` | Write | Manage escalated complaints to resolution |

#### Key Workflows

1. **Post-Transaction NPS** — Send NPS survey 7 days after deal completion; follow up on detractors
2. **Client Welcome Programme** — Automated welcome WhatsApp sequence for new buyers/tenants
3. **Annual Portfolio Review** — Contact investor clients annually; review portfolio, offer new listings
4. **Complaint Resolution** — Receive escalated complaints from agents; investigate; resolve within 10 days
5. **Retention Campaigns** — Identify landlords approaching lease renewal; proactive re-engagement via Olivia

---

### 7. Content Creator (`content_creator`)

| Attribute | Details |
|-----------|---------|
| **Category** | Marketing |
| **Dashboard** | `/marketing/content` |
| **Reports To** | Marketing Manager |
| **AI Assistants** | Muse (Content & Copywriter), Lyra (Social Media) |

#### Permissions

| Permission | Access | Description |
|-----------|--------|-------------|
| `content.*` | Write | Create and edit marketing content |
| `content.blog.create` | Write | Write blog posts and property articles |
| `content.social.create` | Write | Draft social media posts |
| `content.email.create` | Write | Draft email campaign content |
| `properties.view` | Read | Access property details for listing copy |
| `media.upload` | Write | Upload photos, videos to media library |
| `seo.view` | Read | View SEO performance data |

#### Key Workflows

1. **New Listing Copy** — Write compelling description for every new property listing
2. **Weekly Social Posts** — 5× per week social content: property highlight, community insight, market stat, team content, client testimonial
3. **Blog Articles** — 2× per month: DAMAC Hills 2 community guide, investment return analysis, Dubai life articles
4. **Email Newsletter** — Monthly subscriber newsletter: featured listings + market insight

---

### 8. Data Analyst (`data_analyst`)

| Attribute | Details |
|-----------|---------|
| **Category** | Data & AI |
| **Dashboard** | `/analytics/dashboard` |
| **Reports To** | Managing Director |
| **AI Assistants** | Maven (Data Science Platform), Oracle (Market Analyst) |

#### Permissions

| Permission | Access | Description |
|-----------|--------|-------------|
| `analytics.*` | Full | All analytics features |
| `leads.analytics` | Read | Lead funnel + conversion analytics |
| `properties.analytics` | Read | Property performance analytics |
| `finance.analytics` | Read | Revenue and commission analytics |
| `whatsapp.analytics` | Read | WhatsApp engagement analytics |
| `ai.models.view` | Read | View AI model performance metrics |
| `ai.models.retrain` | Write | Trigger model retraining (Archer, Oracle) |
| `reports.create` | Write | All reports creation |
| `dbt.run` | Write | Run dbt transformations (Phase 7) |
| `metabase.manage` | Write | Manage Metabase dashboards |

---

**Document Owner:** Technology (@Daniela — Auth Specialist, @Grace — Lead Engineer)
**Version History:** v1.0 April 2026 (initial 27 roles); v2.0 April 2026 (expanded with hierarchy + full matrix)
**Review Cycle:** Updated with each new Phase adding roles
**Related Documents:**
- `business_docs/09_user_roles_permissions/roles-matrix.md`
- `plans/PHASE_9_RBAC.md`
- `src/config/departmentConfig.ts`
