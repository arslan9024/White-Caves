# Agent Roster — 1 – 12 – 108 Organisation (≥121 agents)

**Policy:** Do **not** trim the agent team. Organise under the corporate formula so each department can track progress separately.

**Minimum total agents:** **121**

---

## Formula

| Layer | Count | Role |
|-------|-------|------|
| Level 5 | 1 | Managing Director authority / sovereign lane |
| Level 4 | 12 | Department lead agents (one per department) |
| Level 3 | 108 | Supervisor-aligned agents (**9 per department**) |
| Cross-cut | ≥0 | Extra specialists still mapped to a department |
| **Total** | **≥121** | Full mesh |

---

## Twelve departments × 9 supervisor slots

Each department has:

- **1** department lead agent  
- **9** supervisor-aligned agents  
- Optional additional specialists (count toward the ≥121 floor)

| # | Department | Lead slot | Supervisor slots |
|---|------------|-----------|------------------|
| 1 | Executive & Architecture | Lead | S1–S9 |
| 2 | Research Intelligence | Lead | S1–S9 |
| 3 | Frontend & UX Architecture | Lead | S1–S9 |
| 4 | Backend & API Systems | Lead | S1–S9 |
| 5 | Database & Data Pipelines | Lead | S1–S9 |
| 6 | Security, Compliance & Legal | Lead | S1–S9 |
| 7 | DevOps & Infrastructure | Lead | S1–S9 |
| 8 | Software Quality & Testing | Lead | S1–S9 |
| 9 | Finance & VAT Analytics | Lead | S1–S9 |
| 10 | Sales & CRM Operations | Lead | S1–S9 |
| 11 | Communications & Marketing | Lead | S1–S9 |
| 12 | Operations & Facility Maintenance | Lead | S1–S9 |

Existing named agents (Ada, Margaret, Una, Mira, Nina, etc.) **map into** these slots; they are not deleted. New agents fill empty supervisor slots first.

---

## `.agents/` layout (organisation only)

Prefer department folders:

```text
.agents/
  departments/
    01-executive/
    02-research/
    03-frontend/
    04-backend/
    05-database/
    06-compliance/
    07-devops/
    08-sqa/
    09-finance/
    10-sales-crm/
    11-communications/
    12-operations/
  shared/
  orchestrator/
```

Move or index existing skills into these folders over time; **do not delete** agent definitions solely to reduce count.
