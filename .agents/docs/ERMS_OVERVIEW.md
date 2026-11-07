# ERMS – Unified Diagram View

This file aggregates all the core Mermaid flow‑charts for the Entity‑Relationship Management System (ERMS) in a single place. Open this markdown in any Mermaid‑compatible viewer (VS Code with the Markdown preview, GitHub, or a web‑based editor) to see the diagrams together in one tab.

---

## 1️⃣ Entity Hierarchy

```mermaid
flowchart TD
    Company["White Caves (Company)"] --> Dept["Departments"]
    Dept --> Emp["Employees"]
    Emp --> Client["Clients"]
    Client --> User["Users (system accounts)"]
    User --> Role["UserRoles (RBAC)"]
    Role --> Permission["Permissions"]
    User --> Commission["Commission"]
    Commission --> Transaction["Transaction"]
    Transaction --> Property["Property"]
    Transaction --> Lead["Lead"]
    Lead --> Property
    User --> Property
    User --> Lead
    Lease["Lease"] --> Property
    Lease --> Tenant["Tenant"]
```

---

## 2️⃣ Navigation Flow (Lead → Property → Transaction → Commission)

```mermaid
flowchart LR
    Lead -->|views| Property
    Lead -->|makes offer| Offer
    Offer -->|accepted| Transaction
    Transaction -->|triggers| Commission
    Commission -->|approved by| User["Finance/User (approver)"]
    Property -->|locked| PropertyLock["isLocked = true"]
```

---

## 3️⃣ Detailed Relationship Map (selected core entities)

```mermaid
flowchart TD
    User -->|creates| Property
    User -->|creates| Lead
    User -->|creates| Transaction
    User -->|receives| Commission
    Property -->|linked to| Lead
    Lead -->|generates| Transaction
    Transaction -->|generates| Commission
    Lease -->|covers| Property
    Lease -->|covers| Tenant
    Tenant -->|occupies| Property
    Commission -->|split to| CommissionSplit
```

---

*All diagrams are rendered as SVG by Mermaid‑JS. Save or export them with the Mermaid CLI (`npx mmdc`) if you need separate image files.*

