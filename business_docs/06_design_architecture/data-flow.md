# Data Flow Diagrams — White Caves CRM Platform

> **Version:** 1.0  
> **Last Updated:** March 2026  
> **Purpose:** Shows how data moves through the system for each major use case

---

## DFD Level 0: System Context Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     EXTERNAL ENTITIES                           │
│                                                                 │
│  Customers ─────────────────────────────────┐                  │
│  (Buyers/Renters/Landlords/Tenants)         │                  │
│                                             ▼                  │
│  Agents / Staff ─────────────────────▶ ┌──────────────────┐   │
│                                        │  WHITE CAVES CRM  │   │
│  WhatsApp Cloud API ─────────────────▶ │                  │◀──┤ PropertyFinder
│                                        │    PLATFORM       │   │
│  Firebase Auth ──────────────────────▶ │                  │──▶┤ Bayut
│                                        └──────────────────┘   │
│  DLD / RERA ─────────────────────────────────▲                │
│                                              │                  │
│  Stripe / Payments ──────────────────────────┘                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## DFD Level 1: Lead Management Data Flow

```
[WhatsApp] ──────────▶ inbound message ──────▶ [WhatsApp Webhook Handler]
                                                        │
                                                        ▼
[Website Form] ────▶ form submission ──────────▶ [Lead Creation Service]
                                                        │
[Portal Lead] ─────▶ lead webhook ─────────────▶       │
                                                        │
[Manual Entry] ─────▶ agent input ─────────────▶       │
                                                        │
                                                        ▼
                                               ┌────────────────┐
                                               │   LEADS DB     │
                                               │  (MongoDB)     │
                                               └────────────────┘
                                                        │
                        ┌───────────────────────────────┤
                        │               │               │
                        ▼               ▼               ▼
               [Score Engine]  [Assignment Engine]  [Notification]
                        │               │               │
                        ▼               ▼               │
                  Lead Score      Assigned Agent    Agent In-App
                  Updated         Notified          Alert
                        │
                        ▼
                [Agent Dashboard — Clara CRM]
                 Kanban / List / Timeline view
                        │
                        │ Agent updates status, logs activity
                        ▼
                [Activity Log DB]
                [Lead Status Updated]
                        │
                        ▼
             [Sales Pipeline — Sophia]
             Aggregates active deals by stage
                        │
                        ▼
          [Executive Dashboard — Zoe]
          KPIs: pipeline value, hot leads, conversions
```

---

## DFD Level 1: Property Management Data Flow

```
[Agent / Admin] ─────▶ property data + media ──▶ [Property Service]
                                                          │
                               ┌──────────────────────────┤
                               │                          │
                               ▼                          ▼
                      [Media Storage]              [Properties DB]
                      (S3 / R2)                   (MongoDB)
                      Returns CDN URLs                    │
                               │                          │
                               └──────────┬───────────────┘
                                          │
                                          ▼
                              ┌─────────────────────┐
                              │  RERA PERMIT CHECK  │
                              │  (before publish)   │
                              └─────────────────────┘
                                          │
                    ├── No permit ──────▶ Block publish; alert agent
                    │
                    └── Permit valid ──▶ Status = Available
                                          │
                                          ▼
                              ┌─────────────────────┐
                              │  PORTAL SYNC        │
                              │  (if enabled)       │
                              │  → PropertyFinder   │
                              │  → Bayut            │
                              └─────────────────────┘
                                          │
                               Inbound portal leads
                                          │
                                          ▼
                              [Lead Creation — Clara]
```

---

## DFD Level 1: Transaction & Commission Data Flow

```
[Lead reaches "Offered" stage]
        │
        ▼
[Sophia Pipeline Manager]
Creates Transaction record:
  ├── Linked Lead ID
  ├── Linked Property ID
  ├── Assigned Agent ID
  ├── Offer Price
  └── Transaction Type (Sale/Lease)
        │
        ▼
[KYC CHECK — Laila]
  ├── KYC not complete ──▶ Block to Contract Signed
  └── KYC verified ──────▶ Allow progression
        │
        ▼
[CONTRACT SIGNED]
Document generated + stored in Storage (S3)
Document URL stored in Transaction record
        │
        ▼
[PAYMENT PROCESSED — Theodora]
  ├── Bank transfer recorded manually
  └── Online payment via Stripe webhook
        │
Transaction status → CLOSED
        │
        ▼
[COMMISSION ENGINE — Automatic]
  Commission record created:
  ├── Transaction ID reference
  ├── Agent ID
  ├── Commission % applied (default: 2% sale, 5% lease)
  ├── Gross commission = Price × Rate
  ├── Agent share = Gross × Agent Split (default 50%)
  ├── Broker share = Gross × Broker Split (default 50%)
  └── Status = Pending
        │
        ▼
[APPROVAL WORKFLOW]
  Manager reviews → Approved
        │
        ▼
[PAYMENT DISBURSEMENT]
  Theodora marks Paid with date
  Agent notified: "Commission AED X paid"
        │
        ▼
[FINANCIAL REPORTS — Month-End]
  Aggregated into P&L, Commission Summary, Agent Reports
```

---

## DFD Level 1: WhatsApp Data Flow

```
[Customer sends WhatsApp]
        │ (Meta webhook POST /api/whatsapp/webhook)
        ▼
[WEBHOOK VERIFICATION]
  HMAC-SHA256 check
        │
        ▼
[MESSAGE PERSISTED]
  WhatsAppMessage document created
  Conversation document created/updated
        │
        ├── Existing lead? ──▶ Link message to lead record
        │
        └── New contact? ──▶ Create new conversation
                │
                ▼
[BOT ROUTING DECISION]
  Is conversation assigned to agent?
        │
        ├── YES: Route to agent's inbox (WebSocket push)
        │         No bot involvement
        │
        └── NO: Nina bot processes
                │
                ▼ Intent classification
                │
                ├── Handleable ──▶ Bot replies automatically
                │   └── Property search ──▶ Query Properties DB
                │       Return matching units ──▶ Send to customer
                │
                └── Escalate ──────▶ Nadia routes to human agent
                                     Agent inbox: real-time update
                                     Agent takes over conversation
```

---

## DFD Level 1: Reporting & Analytics Data Flow

```
Multiple Data Sources:
  ├── Leads DB (counts, status distribution, scores, sources)
  ├── Transactions DB (values, types, statuses, by agent)
  ├── Properties DB (inventory, types, availability)
  ├── Commissions DB (paid, pending, by agent, by period)
  ├── Activities DB (timeline, frequency, agent activity)
  └── Users DB (agent count, departments)
        │
        ▼
[AGGREGATION LAYER — dashboardService.ts]
  MongoDB aggregation pipelines:
  ├── Total leads / hot leads / won leads
  ├── Pipeline value (sum of active deal budgets)
  ├── Revenue MTD / QTD / YTD
  ├── Top agents by deal count and value
  ├── Lead source attribution
  └── Conversion funnel by stage
        │
        ▼
[API ENDPOINTS]
  GET /api/dashboard/summary ──▶ Executive KPIs
  GET /api/crm/analytics ──────▶ CRM detailed analytics
  GET /api/finance/summary ────▶ Financial overview
        │
        ▼
[FRONTEND — Zoe Dashboard]
  Role-based data display:
  ├── Owner: All metrics
  ├── Manager: Department metrics
  ├── Agent: Own metrics only
  └── Finance: Financial metrics only
        │
        ▼
[EXPORT SERVICE]
  PDF/Excel generation from report data
  Stored in temporary storage
  Download link returned to client
```

---

## Data Storage Allocation

| Data Type | Storage | Why |
|-----------|---------|-----|
| User accounts, leads, properties, transactions, commissions | MongoDB Atlas | Flexible document schema; JSON-native |
| Session tokens | JWT in client (stateless) | No server-side session storage needed |
| Uploaded photos, documents, PDFs | S3-compatible cloud storage | Scalable binary storage; CDN delivery |
| Cached exchange rates | In-memory (Node.js) | Fast access; low volume; ephemeral |
| Application logs | Winston → log files → CloudWatch/Datadog | Structured logging with aggregation |
| Audit trail | MongoDB (append-only) | Same DB for atomic operations with other data |
| AI assistant plan files | Git repository (`business_docs/03_ai_assistants/*.md`) | Version-controlled; human-readable |

---

**Version:** 1.0 | **Last Updated:** March 2026 | **Maintained By:** Technical Team
