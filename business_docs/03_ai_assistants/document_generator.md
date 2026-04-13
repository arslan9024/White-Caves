# Document Generator Bot — AI Assistant Profile

> **Assistant Name**: Docu  
> **Category**: Operations & Compliance  
> **Created**: April 14, 2026  
> **Status**: Planned (Phase 1)

---

## Overview
Docu is an AI document generation assistant that creates, populates, and manages real estate transaction documents. From Memorandum of Understanding (MoU) to RERA Form F, Docu automates the most time-consuming part of real estate transactions — paperwork.

---

## Personality & Communication Style
- **Tone**: Precise, formal, compliance-aware
- **Voice**: Professional and methodical — "I've prepared your Form F with all required fields populated. Please review before sending to DLD."
- **Response Format**: Document preview + checklist of filled/missing fields
- **Emoji Usage**: Minimal — uses 📄 ✅ ⚠️ for status indicators only

---

## Core Capabilities

### 1. Supported Document Types

| Document | Category | Fields | Auto-Fill Sources |
|----------|----------|--------|-------------------|
| **MoU (Memorandum of Understanding)** | Transaction | Buyer, Seller, Property, Price, Terms | Lead + Property DB |
| **RERA Form F** | Brokerage Agreement | Agent, Client, Listing, Commission % | Agent + Listing DB |
| **RERA Form A** | Seller Agreement | Seller, Property, Listing Price, Duration | Seller + Property DB |
| **RERA Form B** | Buyer Representation | Buyer, Requirements, Viewing Schedule | Lead + Search History |
| **Ejari Contract** | Tenancy | Landlord, Tenant, Rent, DEWA, Duration | Tenant + Property DB |
| **NOC Request** | Developer | Buyer, Seller, Developer, Unit, Balance | Transaction DB |
| **Commission Invoice** | Billing | Agent, Transaction, Amount, VAT (5%) | Commission Module |
| **Property Flyer** | Marketing | Images, Description, Features, Contact | Property + Agent DB |
| **Market Report** | Analytics | Area stats, price trends, comparisons | Analytics Module |

### 2. Auto-Fill Intelligence
- **Source 1**: Prisma database (Client, Property, Transaction, Lead models)
- **Source 2**: Emirates ID OCR (extract name, nationality, ID number, DOB)
- **Source 3**: Title deed scan (extract plot number, area, developer, community)
- **Source 4**: Agent profile (RERA BRN, company details, contact info)

### 3. Template Engine
- **Format**: PDF generation using `@react-pdf/renderer` or `puppeteer`
- **Branding**: White Caves letterhead, branded colors, professional layout
- **Languages**: English primary, Arabic secondary (RTL support when i18n implemented)
- **Versioning**: Every generated document gets a version number and audit trail

---

## Dubai-Specific Document Requirements

### RERA Form F (Listing Agreement)
```
Required Fields:
├── Broker Details (RERA BRN, Company Name, License No.)
├── Property Details (Type, Community, Plot, Makani No.)
├── Listing Price (AED amount, commission %)
├── Duration (Start date, End date, renewal terms)
├── Marketing Authorization (Photos, portals, signage)
└── Signatures (Agent, Seller/Landlord)

White Caves Auto-Fill:
├── Agent profile → Broker Details (100% auto)
├── Property DB → Property Details (90% auto)
├── Commission module → Pricing (100% auto)
└── Manual input → Signatures only
```

### Ejari (Rental Registration)
```
Required Fields:
├── Landlord Info (Name, Emirates ID, Passport)
├── Tenant Info (Name, Emirates ID, Visa status)
├── Property Details (DEWA premise no., Ejari no.)
├── Financial (Annual rent, security deposit, commission)
├── Duration (Start date, cheque schedule, renewal)
└── Attachments (Emirates ID copies, passport, title deed)
```

---

## Integration Architecture

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/documents/generate` | Generate document from template + data |
| GET | `/api/documents/templates` | List available templates |
| GET | `/api/documents/:id/preview` | Preview generated document (PDF) |
| GET | `/api/documents/:id/download` | Download finalized document |
| POST | `/api/documents/:id/send` | Email/WhatsApp document to recipient |
| GET | `/api/documents/history` | Document generation audit log |

### File Storage
```
/uploads/documents/
├── templates/     # Master templates (docx/html)
├── generated/     # Generated PDFs (per-transaction)
└── signatures/    # Uploaded signature images
```

### WhatsApp Integration
- Docu can send documents via Nadia WhatsApp bot
- "Send the MoU to the buyer on WhatsApp" → Generates PDF → Sends via WhatsApp Business API
- Delivery receipts tracked in conversation history

---

## Implementation Phases

### Phase 1: Core Templates (20h)
- 4 document types: MoU, Form F, Commission Invoice, Property Flyer
- `@react-pdf/renderer` for PDF generation
- Auto-fill from database
- Download + email delivery

### Phase 2: Advanced Documents (15h)
- 5 additional templates: Form A, Form B, Ejari, NOC, Market Report
- Emirates ID OCR integration (Tesseract.js)
- Arabic bilingual documents
- E-signature integration

### Phase 3: Smart Documents (10h)
- AI-powered description generation for property flyers
- Template version control with diff view
- Bulk generation (e.g., 50 commission invoices)
- DLD/RERA submission API (when available)

---

## Success Metrics
- **Document creation time**: Target < 2 min (from 30+ min manual)
- **Error rate**: Target < 1% (vs 15% manual errors)
- **Adoption**: Target 90% of agents using Docu within 30 days
- **Template coverage**: 9 document types covering 95% of transactions
