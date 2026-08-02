# System Design Document (SDD) — Managing Director 14 Operations Architecture

> **White Caves Real Estate LLC** — Core Technical Specification  
> **System Architecture**: React 18 + Redux Toolkit + TypeScript 5.7 + Express v4 + MongoDB / Prisma 6.2  
> **Security Rating**: Enterprise Level 5 Master RBAC Hardened

---

## 📐 1. ERD Database Schema Relationships

```mermaid
erDiagram
    USER ||--o{ LEAD : assigns
    USER ||--o{ LEASING_TRANSACTION : brokers
    USER ||--o{ COMMISSION_RECORD : earns
    USER ||--o{ AUDIT_EVENT : triggers
    
    PROPERTY ||--o{ LEASING_TRANSACTION : SubjectOf
    PROPERTY ||--o{ VIEWING_SCHEDULE : HostedAt
    PROPERTY ||--o{ REGULATORY_CONTRACT : GovernedBy
    
    LEAD ||--o{ VIEWING_SCHEDULE : Requests
    LEAD ||--o{ LEASING_TRANSACTION : ConvertsTo
    
    USER {
        string id PK
        string email UK
        string name
        string role
        int accessLevel
        string iban
        string bankName
        float baseSalaryAED
    }

    PROPERTY {
        string id PK
        string title
        string community
        string developer
        float priceAED
        string reraPermitNumber
        string makaniNumber
        string dewaPremisesNumber
        string titleDeedNumber
        string status
    }

    LEAD {
        string id PK
        string clientName
        string email
        string phone
        string status
        int aiConfidenceScore
        string assignedBrokerId FK
    }

    COMMISSION_RECORD {
        string id PK
        string dealId
        float grossCommissionAED
        float agentShareAED
        float companyShareAED
        float vatAmountAED
        string payoutStatus
    }
```

---

## ⚡ 2. Unified REST & WebSocket API Endpoint Matrix

| Method | Endpoint | Auth Clearance | Response Latency Target | Description |
|--------|----------|----------------|-------------------------|-------------|
| `GET` | `/api/v1/crm/leads` | Level 2+ | < 120ms | Fetch paginated leads for Sales Kanban |
| `PATCH` | `/api/v1/crm/leads/:id/stage` | Level 2+ | < 100ms | Update lead stage & trigger SLA countdown |
| `GET` | `/api/v1/properties` | Public / Level 1+ | < 80ms | Faceted search across 9,378+ units |
| `POST` | `/api/v1/documents/generate` | Level 3+ | < 400ms | Generate PDF RERA Form A/B/F/7/12 |
| `GET` | `/api/v1/finance/commissions` | Level 4+ | < 150ms | Fetch itemized commission ledger & VAT 5% |
| `POST` | `/api/v1/finance/payout/approve` | Level 5 Master | < 250ms | Approve AED IBAN bank transfer to broker |
| `GET` | `/api/v1/compliance/audit-scan` | Level 4+ | < 300ms | Run 12-check automated RERA/DLD scan |
| `GET` | `/api/v1/system/audit-trail` | Level 5 Master | < 100ms | Stream append-only audit events |
| `WS` | `ws://server/socket.io/?room=md` | Level 5 Master | Real-Time Push | Live WebSocket connection for AI traces & SLA alerts |

---

## 🔄 3. Operational Sequence Diagrams

### 3.1 Lead Ingestion & AI Qualifier Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Client
    participant Portal as Property Finder / Bayut
    participant API as Express Gateway
    participant AI as Nadia AI Engine
    participant DB as MongoDB Atlas
    participant WS as Socket.io Broker Room

    Client->>Portal: Submit Inquiry Form
    Portal->>API: Webhook: POST /api/v1/leads/ingest
    API->>AI: Qualify Lead (Budget, Intent, Location)
    AI-->>API: Score = 88 (High Priority)
    API->>DB: Save Lead Record (Status: New)
    API->>WS: Emit 'lead:new_priority' to Sales Agents
    WS-->>WS: Trigger 12m 45s SLA Timer on Kanban
```

### 3.2 Commission Approval & Bank Payout Sequence

```mermaid
sequenceDiagram
    autonumber
    actor MD as Managing Director (Level 5)
    participant UI as CRM Dashboard
    participant API as Express Finance API
    participant DB as MongoDB Atlas
    participant Bank as Emirates NBD WPS API

    MD->>UI: Click 'Approve Payout' on Deal #WC-892
    UI->>API: POST /api/v1/finance/payout/approve { dealId }
    API->>API: Validate MD Clearance (Level === 5)
    API->>DB: Update CommissionRecord (Status: APPROVED)
    API->>Bank: Initiate AED IBAN Wire Transfer
    Bank-->>API: Transaction Ref #NBD-902418
    API->>DB: Log AuditEvent ('COMMISSION_PAID')
    API-->>UI: Return Success Payload & Updated Ledger
```
