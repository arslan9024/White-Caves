# RBAC Role-to-Level Map

**Status:** Draft  
**Owner:** @Ada + @Daniela  
**Last Updated:** 2026-08-02

This document bridges business role catalogs to software access-level and alias-resolution models.

## Mapping intent

Business documentation currently contains both:

- role catalogs with department/business framing; and
- operational permissions or hierarchy narratives.

Software documentation and code use access gates and canonical backend role aliases.

## Canonical mapping principles

1. Business-facing roles are more granular than runtime access levels.
2. Software access levels define enforcement tiers, not exhaustive job titles.
3. Alias resolution should preserve least-privilege where a role does not cleanly map to full operational ownership.

## Role bridge matrix

| Business role ID | Category | Closest backend / alias role | Software access level | Primary software surface | Notes |
| --- | --- | --- | --- | --- | --- |
| `managing_director` | Executive | `owner` / creator-superuser override | `LEVEL_5_MASTER` | `ADR-005`; `rbac_state_gating.md` | Founder short-circuit and superuser path |
| `real_estate_company` | Executive | `owner` or high-privilege manager-equivalent | `LEVEL_4_EXECUTIVE` | `functional_specifications.md` | Broad oversight without creator-only bypass |
| `property_mgmt_company` | Executive | `manager` | `LEVEL_4_EXECUTIVE` | `rbac_state_gating.md` | Cross-property operations scope |
| `super_admin` | Admin | `admin` | `LEVEL_4_EXECUTIVE` or guarded admin plane | `rbac_state_gating.md` | High privilege, but not creator superuser |
| `branch_manager` | Management | `manager` | `LEVEL_3_MANAGER` | `rbac_state_gating.md` | Team/branch supervisory control |
| `sales_manager` | Management | `manager` | `LEVEL_3_MANAGER` | `functional_specifications.md` | Sales oversight |
| `leasing_manager` | Management | `manager` | `LEVEL_3_MANAGER` | `functional_specifications.md` | Leasing / Ejari oversight |
| `sales_agent` | Agent | `agent` / `secondary-sales-agent` | `LEVEL_2_BROKER` | `rbac_state_gating.md` | Core frontline brokerage role |
| `leasing_agent` | Agent | `leasing-agent` | `LEVEL_2_BROKER` | `rbac_state_gating.md` | Leasing-focused broker role |
| `property_manager` | Agent | `agent` or property-operations-specific role | `LEVEL_2_BROKER` | `functional_specifications.md` | Operationally elevated, but below manager tier |
| `property_consultant` | Specialist | `viewer`-leaning or limited agent-scope | `LEVEL_2_BROKER` or bounded viewer path | alias resolution layer | Needs least-privilege clarification |
| `mortgage_consultant` | Specialist | `viewer` / specialist-limited | `LEVEL_1_CLIENT` or restricted `LEVEL_2_BROKER` | alias resolution layer | Current business permissions exceed generic viewer in some areas |
| `valuation_expert` | Specialist | `viewer` / specialist-limited | `LEVEL_1_CLIENT` or restricted `LEVEL_2_BROKER` | alias resolution layer | Needs valuation-specific enforcement note |
| `trustee_officer` | Specialist | `admin` or transfer-specialist | `LEVEL_3_MANAGER` or guarded specialist track | `functional_specifications.md` | Legal-transfer power exceeds standard viewer path |
| `legal_officer` | Support | `admin` / compliance-capable | `LEVEL_3_MANAGER` | compliance and legal surfaces | Compliance/legal actions need manager-grade gating |
| `finance_officer` | Support | `finance` | `LEVEL_3_MANAGER` | finance route guards | Finance operations should not imply creator powers |
| `marketing_manager` | Support | `manager` | `LEVEL_3_MANAGER` | marketing/analytics surfaces | Owns campaigns, not platform-wide admin |
| `document_controller` | Support | `admin` / verification-limited | `LEVEL_2_BROKER` or `LEVEL_3_MANAGER` depending workflow | document verification surfaces | Requires narrower operational mapping |
| `developer` | Client | `seller` | `LEVEL_1_CLIENT` | client/developer views | Business client with project/off-plan privileges |
| `investor` | Client | `buyer` or analytics-limited client | `LEVEL_1_CLIENT` | investor dashboards | Analytics visibility without operational mutation |
| `landlord` | Client | `seller` / landlord | `LEVEL_1_CLIENT` | landlord portal | Own-portfolio access only |
| `buyer` | Client | `buyer` | `LEVEL_1_CLIENT` | buyer / offer surfaces | Self-service client role |
| `tenant` | Client | `tenant` | `LEVEL_1_CLIENT` | tenant portal | Self-service lease and payment scope |
| `affiliated_agent` | Legacy / transition | `secondary-sales-agent` or limited `agent` | `LEVEL_2_BROKER` | alias resolution layer | Explicitly constrained via limited client permissions |

## High-risk reconciliation notes

- `trustee_officer`, `legal_officer`, and `finance_officer` have business permissions that may exceed a simple generic role alias; these should map to explicit guarded capabilities, not just naming convenience.
- `mortgage_consultant` and `valuation_expert` are currently at risk of over-collapsing into low-privilege viewer behavior unless specialist permissions are preserved.
- `managing_director` must remain distinct from database-writable admin roles because creator-email superuser logic is outside the normal hierarchy.

## Key cleanup goals

1. Document one authoritative mapping between business-facing role names and backend-enforced access levels.
2. Clarify where aliasing is intentional versus where permissions materially differ.
3. Link future test evidence for manager/admin/compliance guard behavior.
