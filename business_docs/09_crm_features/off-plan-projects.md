# Off-Plan Projects Management — Business Specification

**Owner:** @Maya (Llama 3.1 70B — Groq Console)
**Status:** 🟡 STUB — awaiting @Maya Task 1
**Target:** 14 sections
**CRM Module:** AtlasProjectsCRM (src/components/crm/AtlasProjectsCRM/)
**API Base:** `/api/properties?transactionType=primary`, `/api/leasing-inventory`

---

## Overview

AtlasProjectsCRM manages the full lifecycle of off-plan property projects — from developer launch through buyer reservation, Oqood DLD registration, construction milestone tracking, and final handover. It is used by both sales agents (selling units) and the investment team (portfolio buyers).

**Key Capabilities:**
- Project and unit inventory management
- Buyer reservation and SPA signing workflow
- Oqood DLD registration (mandatory within 60 days of SPA)
- Construction milestone and payment schedule tracking
- Escrow account compliance (Law No. 8 of 2007)
- ROI projection calculator for investor clients
- Cancellation refund engine (RERA Article 11)

---

## TODO — @Maya Task 1

Paste the output from this prompt into the sections below:

```
@Maya — DRAFT: off-plan-projects.md → spec AtlasProjectsCRM: project schema (developer, project name, location GeoPoint, launch date, estimated completion, totalUnits, availableUnits, paymentPlanOptions array), unit inventory (unitNumber, floor, type: studio/1BR/2BR/3BR/penthouse, BUA sqft, view, listPrice, status: available/reserved/sold/transferred), buyer reservation workflow (EOI deposit receipt → SPA draft → signing appointment → Oqood DLD registration within 60 days → payment milestone schedule), project milestone tracker (construction % from developer API or manual update, estimated handover countdown, delay flag), ROI projection calculator (inputs: purchase price, expected rent per RERA index, service charge/sqft → outputs: gross yield %, net yield %, payback years).
```

## TODO — @Maya Task 2

```
@Maya — DRAFT: handover-management.md → spec VestaHandoverCRM: snagging checklist, snagging report PDF, handover appointment scheduling, punch list tracking, keys & access issuance log, DEWA connection tracker, handover completion certificate.
```

## TODO — @Maya Task 3

```
@Maya — EXPAND: off-plan-projects.md → add payment plan engine: SPA payment schedule table, escrow compliance (Law No. 8 of 2007), cancellation refund table (RERA Article 11), developer credit rating display.
```
