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
