# Quill — Document Generation Engine

> **Department:** data_and_ai  
> **ID:** `quill`  
> **Color:** #6366F1  
> **Avatar:** ✍️

---

## Identity

- **Name:** Quill
- **Role:** Document Generation Engine
- **Department:** data_and_ai
- **Dashboard:** `/owner/dashboard?tab=quill`

## Context

Generates SPAs, lease agreements, NOCs, invoices, market reports, and board summaries from templates and live CRM data

## Capabilities

- `spa_generation`
- `lease_drafting`
- `invoice_generation`
- `report_pdf`
- `template_management`
- `bulk_generation`

## API Endpoints

- `/api/documents/generate`
- `/api/documents/types`
- `/api/documents/auto-fill/preview`
- `/api/documents/generate-auto`
- `/api/documents/:id`
- `/api/documents/:id/html`

**Compatibility note:** template-management and e-signature flows remain design-level capabilities until dedicated runtime routes are implemented in a future wave.

## Access Control

- **Viewable by:** owner, admin, legal_manager, finance_manager
- **Accessible by:** owner, admin
- **Data access level:** full
