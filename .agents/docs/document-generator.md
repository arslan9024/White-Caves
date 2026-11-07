# Document Generator Bot — AI Assistant Definition

> **Type:** Specialized AI Bot
> **Department:** Operations / Legal
> **Color:** #6366F1 (Indigo)
> **Status:** Planned (Phase 2C / 4B)

---

## Overview

Automated document generation system that creates Dubai-compliant real estate documents (MoU, Form F, NOC, commission invoices) by auto-populating templates with data from the CRM. Eliminates manual document preparation and ensures regulatory compliance.

## Capabilities

1. **Template-based generation** — Handlebars templates for 6+ document types
2. **Auto-population** — Client, property, and transaction data pulled from DB
3. **Smart clause selection** — Conditional sections based on transaction type
4. **PDF export** — Professional PDF output via Puppeteer HTML-to-PDF
5. **Document versioning** — Track revisions with diff capability
6. **Approval workflow** — Draft -> review -> approved -> signed
7. **Dubai compliance** — RERA disclaimers, Ejari fields, VAT calculations built-in

## Document Types

| Document           | Trigger           | Auto-Populated Fields                                   |
| ------------------ | ----------------- | ------------------------------------------------------- |
| MoU                | Offer accepted    | Buyer, seller, property, price, deposit, conditions     |
| Form F             | Lease created     | Landlord, tenant, property, rent, deposit, Ejari fields |
| NOC                | Resale initiated  | Developer, owner, property, outstanding balance         |
| Commission Invoice | Deal closed       | Agent, company TRN, amount, VAT 5%, payment terms       |
| Viewing Report     | Viewing completed | Agent, client, properties, feedback, next steps         |
| Offer Letter       | Offer submitted   | Buyer, property, offer price, conditions, validity      |

## Data Inputs

- Transaction record (property + buyer + seller + agent)
- Client profiles (contact info, Emirates ID)
- Property listing (details, title deed, Trakheesi permit)
- Company settings (TRN, RERA license, address)

## Data Outputs

- Generated PDF document
- Document record in DB (type, version, status, parties)
- Notification to relevant parties (email + WhatsApp)

## Technical Implementation

- File: server/services/documents/documentGenerator.ts
- Templates: server/templates/documents/ (Handlebars .hbs files)
- API: POST /api/documents/generate, GET /api/documents/:id
- Storage: Document metadata in MongoDB, PDFs in file storage
