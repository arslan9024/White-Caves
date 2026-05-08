# Sentinel Property Management — Business Specification

**Owner:** @Mary (DeepSeek V3 — DeepSeek Chat)
**Status:** 🟡 STUB — awaiting @Mary Task 1
**Target:** 12 sections
**CRM Module:** SentinelPropertyCRM (src/components/crm/SentinelPropertyCRM/)
**API Base:** `/api/properties`

---

## Overview

SentinelPropertyCRM manages the complete lifecycle of every property in the White Caves inventory — from initial acquisition and listing through sale/lease and post-handover. It enforces RERA listing requirements, tracks property quality scores to optimize portal ranking, and provides bulk import for managing large inventory.

**Key Capabilities:**
- Property lifecycle state machine (Draft → Listed → Sold/Leased → Withdrawn)
- RERA mandatory field enforcement before any listing goes live
- Property quality score algorithm (drives PropertyFinder/Bayut ranking)
- Duplicate property detection (same building + unit = warning)
- Bulk CSV import with column mapping and validation

---

## TODO — @Mary Task 1

Paste the output from this prompt into the sections below:

```
@Mary — DRAFT: sentinel-property.md → spec SentinelPropertyCRM module: property lifecycle state machine (Draft → Pending Review → Listed → Under Offer → Reserved → Sold/Leased → Withdrawn → Re-listed — with allowed transitions and required fields per state), RERA mandatory fields before listing (permit number, DED approval for off-plan, NOC from developer if applicable, title deed number for resale, floor plan uploaded), property quality score algorithm (photos count ×10pts, description > 100 words ×15pts, floor plan ×20pts, virtual tour ×25pts, 360 video ×30pts — max 100pts, score drives portal ranking), duplicate detection (same community + building + unit number = duplicate warning, override with reason), bulk CSV import spec (column mapping: propertyType, area, community, building, unit, bedrooms, bathrooms, BUA, price, agentId — validation rules, error report with row numbers).
```

## TODO — @Mary Task 2

```
@Mary — DRAFT: investment-management.md → spec MavenInvestmentCRM module: investor profile, portfolio dashboard, ROI tools, investor quarterly report, deal flow pipeline, investment committee workflow for deals > AED 5M.
```

## TODO — @Mary Task 3

```
@Mary — DRAFT: prospecting-outbound.md → spec HunterProspectingCRM: prospect database, campaign workflow, call tracking, prospecting KPIs, post-call automation, DNC registry.
```
