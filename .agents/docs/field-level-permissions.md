# Field-Level Permissions Matrix

> **Last updated:** April 19, 2026
> **Purpose:** Granular field-level access control for CRM data entities
> **Extends:** roles-matrix.md (22 roles, 45+ permissions)

---

## 1. Lead Entity Field Permissions

| Field              | MD  | Sales Manager | Sales Agent | Leasing Agent | Finance | Marketing |
| ------------------ | --- | ------------- | ----------- | ------------- | ------- | --------- |
| name               | RW  | RW            | RW (own)    | RW (own)      | R       | R         |
| email              | RW  | RW            | RW (own)    | RW (own)      | R       | R         |
| phone              | RW  | RW            | RW (own)    | RW (own)      | R       | R         |
| budget             | RW  | RW            | RW (own)    | RW (own)      | R       | -         |
| score              | RW  | R             | R           | R             | -       | R         |
| source             | RW  | RW            | R           | R             | -       | R         |
| status             | RW  | RW            | RW (own)    | RW (own)      | -       | -         |
| assignedAgent      | RW  | RW            | R           | R             | -       | -         |
| notes              | RW  | RW            | RW (own)    | RW (own)      | -       | -         |
| commissionEstimate | RW  | R             | -           | -             | RW      | -         |

> **Legend:** R = Read, W = Write, RW = Read+Write, (own) = only their assigned records, - = No access

---

## 2. Property Entity Field Permissions

| Field           | MD  | Branch Manager | Sales Agent | Property Manager | Landlord | Buyer |
| --------------- | --- | -------------- | ----------- | ---------------- | -------- | ----- |
| title           | RW  | RW             | R           | RW               | R        | R     |
| price           | RW  | RW             | R           | RW               | RW (own) | R     |
| address         | RW  | RW             | R           | RW               | R        | R     |
| status          | RW  | RW             | R           | RW               | R        | R     |
| area (sqft)     | RW  | RW             | R           | RW               | R        | R     |
| bedrooms/baths  | RW  | RW             | R           | RW               | R        | R     |
| media (photos)  | RW  | RW             | R           | RW               | RW (own) | R     |
| trakheesiPermit | RW  | RW             | R           | RW               | -        | -     |
| titleDeed       | RW  | RW             | -           | RW               | RW (own) | -     |
| internalNotes   | RW  | RW             | R (own)     | RW               | -        | -     |
| ownerDetails    | RW  | RW             | -           | RW               | RW (own) | -     |
| commission %    | RW  | RW             | R           | -                | -        | -     |

---

## 3. Transaction Entity Field Permissions

| Field       | MD  | Sales Manager | Sales Agent | Finance | Legal | Buyer   | Seller  |
| ----------- | --- | ------------- | ----------- | ------- | ----- | ------- | ------- |
| type        | RW  | RW            | R           | R       | R     | R       | R       |
| property    | RW  | RW            | R           | R       | R     | R       | R       |
| price       | RW  | RW            | R           | RW      | R     | R       | R       |
| buyer       | RW  | RW            | R (own)     | R       | RW    | R (own) | -       |
| seller      | RW  | RW            | R (own)     | R       | RW    | -       | R (own) |
| agent       | RW  | RW            | R           | R       | R     | -       | -       |
| commission  | RW  | R             | R (own)     | RW      | R     | -       | -       |
| status      | RW  | RW            | R           | RW      | RW    | R       | R       |
| documents   | RW  | RW            | R (own)     | R       | RW    | R (own) | R (own) |
| dldFees     | RW  | R             | R           | RW      | R     | R       | R       |
| ejariNumber | RW  | RW            | R           | R       | RW    | -       | -       |
| timeline    | RW  | RW            | R (own)     | R       | RW    | R (own) | R (own) |

---

## 4. Commission Entity Field Permissions

| Field         | MD  | Sales Manager | Agent   | Finance | HR  |
| ------------- | --- | ------------- | ------- | ------- | --- |
| amount        | RW  | R             | R (own) | RW      | R   |
| rate          | RW  | R             | R       | RW      | -   |
| status        | RW  | R             | R (own) | RW      | R   |
| paidDate      | RW  | -             | R (own) | RW      | R   |
| vatAmount     | RW  | R             | R (own) | RW      | R   |
| invoiceNumber | RW  | R             | R (own) | RW      | R   |
| approvedBy    | R   | R             | R       | R       | R   |
| splitDetails  | RW  | R             | R (own) | RW      | -   |

---

## 5. WhatsApp/Communication Field Permissions

| Field                | MD  | Agent (assigned) | Agent (other) | Marketing | Compliance |
| -------------------- | --- | ---------------- | ------------- | --------- | ---------- |
| message content      | R   | RW               | -             | -         | R (audit)  |
| conversation history | R   | R (own)          | -             | -         | R (audit)  |
| templates            | RW  | R (send only)    | R (send only) | RW        | R          |
| broadcast lists      | RW  | -                | -             | RW        | R          |
| opt-in status        | R   | R                | R             | R         | RW         |

---

## 6. API Enforcement Pattern

```
// Middleware: checkFieldPermission(entity, field, action)
// Usage in routes:
router.patch("/api/leads/:id",
  authenticate,
  authorize("leads.update"),
  checkFieldPermission("lead", req.body, "write"),
  updateLead
);

// Implementation: server/middleware/fieldPermissions.ts
// Config: server/config/fieldPermissions.ts (matrix as code)
```

---

## 7. Data Visibility Rules

| Role             | Leads        | Properties      | Transactions   | Commissions    | Analytics    |
| ---------------- | ------------ | --------------- | -------------- | -------------- | ------------ |
| MD               | All          | All             | All            | All            | Full         |
| Branch Manager   | Branch       | Branch          | Branch         | Branch summary | Branch       |
| Sales Manager    | Team         | All listed      | Team           | Team summary   | Team         |
| Sales Agent      | Own assigned | All listed      | Own            | Own            | Own KPIs     |
| Leasing Agent    | Own assigned | Rentals only    | Own            | Own            | Own KPIs     |
| Property Manager | Related      | Managed         | Related        | -              | Portfolio    |
| Finance Officer  | Summary only | -               | Financial data | All            | Financial    |
| Landlord         | -            | Own properties  | Own            | -              | Own property |
| Buyer            | -            | Public listings | Own            | -              | -            |
| Tenant           | -            | Rented unit     | Own lease      | -              | -            |
