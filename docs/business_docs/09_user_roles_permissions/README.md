# 09 — User Roles & Permissions

Comprehensive role-based access control (RBAC) documentation for the White Caves Real Estate platform.

## Documents in This Section

| File | Description |
|------|-------------|
| `roles-matrix.md` | All 22 roles with permissions, categories, and dashboard paths |
| `access-control-policy.md` | RBAC enforcement rules, permission inheritance, and security policy |

## Quick Reference

- **Total Roles:** 22
- **Categories:** Executive (3), Admin (1), Management (3), Agent (3), Specialist (4), Support (4), Client (5)
- **Total Unique Permissions:** 45+
- **Enforcement:** Frontend route guards + backend middleware + Prisma row-level filtering

## Role Categories

| Category | Count | Description |
|----------|-------|-------------|
| Executive | 3 | Managing Director, RE Company Admin, Property Mgmt Co. |
| Admin | 1 | Super Admin (system-level) |
| Management | 3 | Branch Manager, Sales Manager, Leasing Manager |
| Agent | 3 | Sales Agent, Leasing Agent, Property Manager |
| Specialist | 4 | Consultant, Mortgage, Valuer, Trustee |
| Support | 4 | Legal, Finance, Marketing, Document Controller |
| Client | 5 | Developer, Investor, Landlord, Buyer, Tenant |
| Legacy | 1 | Affiliated Agent (freelancer → affiliated_agent mapping) |
